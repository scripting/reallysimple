var myProductName = "outlinecloud"; myVersion = "0.4.0";    

const fs = require ("fs");
const utils = require ("daveutils"); 
const websocket = require ("nodejs-websocket"); 
const opml = require ("opml");
const davehttp = require ("davehttp");
const request = require ("request");
const xml2js = require ("xml2js");

var config = {
	port: process.env.PORT || 3231,
	websocketPort: 3232,
	flLogToConsole: true,
	ctSecsBetwRenews: 23 * 60 * 60, //for an individual outline
	thisServer: { //how the cloud server should call us back
		domain: "opmlcloud.scripting.com",
		port: 80,
		outlineUpdatedCallback: "/outlineupdated"
		}
	};

var stats = {
	ctLaunches: 0,
	whenLastLaunch: undefined,
	ctSaves: 0,
	whenLastSave: undefined,
	outlines: new Object ()
	};
const fnameStats = "stats.json", fnameConfig = "config.json";
var flStatsChanged = false;


function statsChanged () {
	flStatsChanged = true;
	}

function requestWithRedirect (theRequest, callback) { //12/11/22 by DW
	var myRequest = new Object ();
	for (var x in theRequest) {
		myRequest [x] = theRequest [x];
		}
	myRequest.followAllRedirects = false; //we're doing this ourselves
	myRequest.maxRedirects = (myRequest.maxRedirects === undefined) ? 0 : myRequest.maxRedirects;
	request (myRequest, function (err, response, body) {
		if (err) {
			callback (err);
			}
		else {
			const code = response.statusCode;
			if ((code == 301) || (code == 302)) { //redirect
				if (myRequest.maxRedirects == 0) {
					callback (err, response, body);
					}
				else {
					myRequest.maxRedirects--;
					myRequest.url = response.headers.location;
					requestWithRedirect (myRequest, callback);
					}
				}
			else {
				callback (err, response, body);
				}
			}
		});
	}
function pleaseNotify (urlCloudServer, urlOutline, thisServer, callback) { //3
	console.log ("pleaseNotify: urlCloudServer == " + urlCloudServer);
	function buildParamList (paramtable) { //12/10/22 by DW
		if (paramtable === undefined) {
			return ("");
			}
		else {
			var s = "";
			for (var x in paramtable) {
				if (paramtable [x] !== undefined) { //8/4/21 by DW
					if (s.length > 0) {
						s += "&";
						}
					s += x + "=" + encodeURIComponent (paramtable [x]);
					}
				}
			return (s);
			}
		}
	const theRequest = {
		url: urlCloudServer,
		method: "POST",
		followAllRedirects: true, 
		maxRedirects: 5,
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
			},
		body: buildParamList ({
			domain: thisServer.domain, 
			port: thisServer.port,
			path: thisServer.outlineUpdatedCallback,
			url1: urlOutline,
			protocol: "http-post"
			})
		};
	requestWithRedirect (theRequest, function (err, response, body) {
		if (err) {
			callback (err);
			}
		else {
			xml2js.parseString (body, {explicitArray: false}, function (err, jstruct) {
				if (err) { 
					callback (err);
					}
				else {
					if (jstruct == null) { 
						let err = {message: "Internal error: xml2js.parseString returned null."};
						callback (err);
						}
					else {
						var theResult = jstruct.notifyResult ["$"];
						if (theResult.success == "true") {
							callback (undefined);
							}
						else {
							let err = {message: theResult.msg};
							callback (err);
							}
						}
					}
				});
			}
		});
	}
function notifyOutlineRec (outlineRec, callback) {
	pleaseNotify (outlineRec.head.urlCloudServer, outlineRec.urlToWatch, config.thisServer, function (err, data) {
		outlineRec.whenLastRenew = new Date ();
		if (err) {
			outlineRec.lastError = err.message;
			if (callback !== undefined) {
				callback (err);
				}
			}
		else {
			outlineRec.lastRenewData = data;
			if (callback !== undefined) {
				callback (undefined, outlineRec);
				}
			}
		statsChanged ();
		});
	}
function renewReadySubscriptions () {
	for (var urlToWatch in stats.outlines) {
		let outlineRec = stats.outlines [urlToWatch];
		if (outlineRec.whenLastRenew === undefined) {
			outlineRec.whenLastRenew = new Date (0); 
			statsChanged ();
			}
		if (utils.secondsSince (outlineRec.whenLastRenew) >= config.ctSecsBetwRenews) {
			notifyOutlineRec (outlineRec, function (err, data) {
				});
			}
		}
	}

function httpRequest (url, callback) {
	request (url, function (err, response, data) {
		if (err) {
			callback (err);
			}
		else {
			var code = response.statusCode;
			if ((code < 200) || (code > 299)) {
				const message = "The request returned a status code of " + response.statusCode + ".";
				callback ({message});
				}
			else {
				callback (undefined, data) 
				}
			}
		});
	}
function watchThisOutline (urlToWatch, conn, callback) {
	var now = new Date ();
	if (stats.outlines [urlToWatch] === undefined) {
		stats.outlines [urlToWatch] = {
			urlToWatch,
			whenCreated: now
			};
		}
	var outlineRec = stats.outlines [urlToWatch];
	opml.readOutline (urlToWatch, function (err, theOutline) {
		if (err) {
			callback (err);
			return;
			}
		else {
			try {
				outlineRec.head = theOutline.opml.head;
				}
			catch (err) {
				callback (err);
				return;
				}
			}
		notifyOutlineRec (outlineRec, callback);
		});
	}

var theWsServer = undefined;

function webSocketStartup () {
	function handleWebSocketConnection (conn) { 
		console.log ("handleWebSocketConnection: conn.socket.remoteAddress == " + conn.socket.remoteAddress);
		function initAppData (conn) {
			if (conn.appData === undefined) {
				conn.appData = { 
					whenStarted: new Date (),
					ctUpdates: 0,
					whenLastUpdate: new Date (0),
					lastVerb: undefined,
					urlToWatch: undefined,
					domain: undefined
					};
				}
			}
		conn.on ("text", function (theText) {
			console.log ("handleWebSocketConnection: theText == " + theText); 
			var words = theText.split (" ");
			if (words.length > 1) {
				initAppData (conn);
				conn.appData.whenLastUpdate = new Date ();
				conn.appData.lastVerb = words [0];
				switch (words [0]) {
					case "watch":
						var urlToWatch = utils.trimWhitespace (words [1]);
						conn.appData.urlToWatch = urlToWatch;
						watchThisOutline (urlToWatch, conn);
						break;
					}
				}
			});
		conn.on ("close", function () {
			console.log ("'close' message received.");
			});
		conn.on ("error", function (err) {
			console.log ("'error' message received, err.code == " + err.code);
			});
		}
	theWsServer = websocket.createServer (handleWebSocketConnection);
	console.log ("webSocketStartup: config.websocketPort == " + config.websocketPort);
	theWsServer.listen (config.websocketPort);
	}
function notifySocketSubscribers (verb, payload, flPayloadIsString, callbackToQualify) {
	if (theWsServer !== undefined) {
		var ctUpdates = 0, now = new Date (), ctTotalSockets = 0;
		if (payload !== undefined) { 
			if (!flPayloadIsString) {
				payload = utils.jsonStringify (payload);
				}
			}
		theWsServer.connections.forEach (function (conn, ix) {
			ctTotalSockets++;
			if (conn.appData !== undefined) { //it's one of ours
				var flnotify = true;
				if (callbackToQualify !== undefined) {
					flnotify = callbackToQualify (conn);
					}
				if (flnotify) {
					try {
						conn.sendText (verb + "\r" + payload);
						conn.appData.whenLastUpdate = now;
						conn.appData.ctUpdates++;
						ctUpdates++;
						}
					catch (err) {
						console.log ("notifySocketSubscribers: socket #" + i + ": error updating");
						}
					}
				}
			});
		}
	}
function handlePing (feedUrl, callback) { //5
	console.log ("handlePing: feedUrl == " + feedUrl);
	if (feedUrl !== undefined) {
		httpRequest (feedUrl, function (err, filetext) {
			if (!err) {
				notifySocketSubscribers ("update", filetext, true, function (conn) {
					if (conn.appData.urlToWatch == feedUrl) {
						return (true);
						}
					else {
						return (false);
						}
					});
				}
			})
		}
	callback (undefined, {status: "Got the update. Thanks! :-)"})
	}
function httpStartup () {
	davehttp.start (config, function (theRequest) {
		const params = theRequest.params;
		function returnPlainText (theString) {
			if (theString === undefined) {
				theString = "";
				}
			theRequest.httpReturn (200, "text/plain", theString);
			}
		switch (theRequest.lowerpath) {
			case config.thisServer.outlineUpdatedCallback:
				handlePing (params.url, function (err, pingResponse) { //read the feed, add new stuff to database, etc.
					returnPlainText (params.challenge);
					});
				break;
			default: 
				theRequest.httpReturn (404, "text/plain", "Not found.");
				break;
			}
		});
	}

function startup () {
	console.log ("startup");
	function readConfig (callback) {
		utils.sureFilePath (fnameConfig, function () {
			fs.readFile (fnameConfig, function (err, data) {
				if (!err) {
					try {
						var jstruct = JSON.parse (data.toString ());
						for (var x in jstruct) {
							config [x] = jstruct [x];
							}
						}
					catch (err) {
						console.log ("readStats: err == " + err.message);
						}
					}
				if (callback !== undefined) {
					callback ();
					}
				});
			});
		}
	function readStats (callback) {
		utils.sureFilePath (fnameStats, function () {
			fs.readFile (fnameStats, function (err, data) {
				if (!err) {
					try {
						var jstruct = JSON.parse (data.toString ());
						for (var x in jstruct) {
							stats [x] = jstruct [x];
							}
						}
					catch (err) {
						console.log ("readStats: err == " + err.message);
						}
					}
				if (callback !== undefined) {
					callback ();
					}
				});
			});
		}
	function everyMinute () {
		}
	function everySecond () {
		if (flStatsChanged) {
			flStatsChanged = false;
			stats.ctSaves++; stats.whenLastSave = new Date ();
			fs.writeFile (fnameStats, utils.jsonStringify (stats), function (err) {
				if (err) {
					console.log ("everySecond: err.message == " + err.message);
					}
				});
			}
		renewReadySubscriptions ();
		}
	readConfig (function () {
		readStats (function () {
			if (false) { //for local testing
				var urlTestOutline = "http://scripting.com/publicfolder/drummer/dwPublicNotes.opml";
				watchThisOutline (urlTestOutline, function (err, data) {
					if (err) {
						console.log (err.message);
						}
					else {
						console.log (utils.jsonStringify (data));
						}
					fs.writeFile (fnameStats, utils.jsonStringify (stats), function (err) {
						if (err) {
							console.log ("everySecond: err.message == " + err.message);
							}
						});
					});
				}
			delete stats.outlines ["http://scripting.com/publicfolder/drummer/dwPublicNotes.opml"];
			stats.ctLaunches++; stats.whenLastLaunch = new Date (); statsChanged ();
			setInterval (everySecond, 1000); 
			utils.runEveryMinute (everyMinute);
			everyMinute ();
			webSocketStartup ();
			httpStartup ();
			});
		});
	}
startup ();


