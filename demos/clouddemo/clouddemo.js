const myVersion = "0.4.0", myProductName = "clouddemo"; 

const fs = require ("fs");
const utils = require ("daveutils");
const qs = require ("querystring"); 
const request = require ("request");
const daveappserver = require ("daveappserver"); 
const davehttp = require ("davehttp"); 
const xml2js = require ("xml2js");
const reallysimple = require ("reallysimple"); 

var config = {
	port: process.env.PORT || 1422,
	flLogToConsole: true, //davehttp logs each request to the console
	flTraceOnError: false, //davehttp does not try to catch the error
	defaultFeedUrl: "http://scripting.com/rss.xml",
	thisServer: { //how the cloud server should call us back
		domain: "clouddemo.rss.land",
		port: 80,
		feedUpdatedCallback: "/feedupdated"
		}
	};
var whenLastRequest = new Date (0);

var stats = {
	events: new Array ()
	}
var flStatsChanged = false;
const fnameStats = "stats.json";

function readStats (callback) {
	fs.readFile (fnameStats, function (err, jsontext) {
		try {
			stats = JSON.parse (jsontext);
			callback (undefined);
			}
		catch (err) {
			callback (err);
			}
		});
	}
function statsChanged () {
	flStatsChanged = true;
	}
function addEvent (infoAboutEvent) {
	infoAboutEvent.when = new Date ().toLocaleString ();
	stats.events.push (infoAboutEvent); //insert at beginning
	statsChanged ();
	}
function readFeed (feedUrl, callback) {
	const whenstart = new Date ();
	reallysimple.readFeed (feedUrl, function (err, theFeed) {
		if (err) {
			callback (err);
			}
		else {
			callback (undefined, theFeed);
			}
		});
	}
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
function requestWithRedirect (theRequest, callback) { //12/11/22 by DW
	var myRequest = new Object ();
	for (var x in theRequest) {
		myRequest [x] = theRequest [x];
		}
	myRequest.followAllRedirects = false; //we're doing this ourselves
	myRequest.maxRedirects = (myRequest.maxRedirects === undefined) ? 0 : myRequest.maxRedirects;
	request (myRequest, function (err, response, body) {
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
		});
	}
function getUrlCloudServer (theCloudElement) {
	var url = undefined;
	if ((theCloudElement !== undefined) && (theCloudElement.type == "rsscloud")) {
		url = "http://" + theCloudElement.domain + ":" + theCloudElement.port + theCloudElement.path;
		}
	return (url);
	}
function pleaseNotify (urlCloudServer, feedUrl, thisServer, callback) { //rssCloud support
	var now = new Date ();
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
			path: thisServer.feedUpdatedCallback,
			url1: feedUrl,
			protocol: "http-post"
			})
		};
	requestWithRedirect (theRequest, function (err, response, body) {
		if (err) {
			callback (err);
			}
		else {
			callback (undefined, body);
			}
		});
	}
function requestNotification (feedUrl, callback) {
	function getResponseFromXml (xmltext, callback) {
		var options = {
			explicitArray: false
			};
		xml2js.parseString (xmltext, options, function (err, jstruct) {
			if (err) { 
				callback (err);
				}
			else {
				if (jstruct == null) { //12/27/21 by DW
					let err = {message: "Internal error: xml2js.parseString returned null."};
					callback (err);
					}
				else {
					callback (undefined, jstruct);
					}
				}
			});
		}
	readFeed (feedUrl, function (err, theFeed) {
		if (err) {
			console.log (err.message);
			if (callback !== undefined) {
				callback (err);
				}
			}
		else {
			var urlCloudServer = getUrlCloudServer (theFeed.cloud);
			pleaseNotify (urlCloudServer, feedUrl, config.thisServer, function (err, xmltext) {
				if (err) {
					console.log ("requestNotification: err.message == " + err.message + ", urlCloudServer == " + urlCloudServer + ", feedUrl == " + feedUrl);
					addEvent ({
						type: "requestNotification",
						error: err.message, 
						urlCloudServer,
						feedUrl
						});
					if (callback !== undefined) {
						callback (err);
						}
					}
				else {
					getResponseFromXml (xmltext, function (err, jstruct) {
						addEvent ({
							type: "requestNotification",
							response: jstruct.notifyResult ["$"],
							urlCloudServer,
							feedUrl
							});
						});
					if (callback !== undefined) {
						callback (undefined, theFeed);
						}
					}
				});
			}
		});
	}
function handleHttpRequest (theRequest) {
	var now = new Date ();
	const params = theRequest.params;
	function returnRedirect (url, code) { 
		var headers = {
			location: url
			};
		if (code === undefined) {
			code = 302;
			}
		theRequest.httpReturn (code, "text/plain", code + " REDIRECT", headers);
		}
		
	function returnPlainText (s) {
		theRequest.httpReturn (200, "text/plain", s.toString ());
		}
	function returnNotFound () {
		theRequest.httpReturn (404, "text/plain", "Not found.");
		}
	function returnData (jstruct) {
		if (jstruct === undefined) {
			jstruct = {};
			}
		theRequest.httpReturn (200, "application/json", utils.jsonStringify (jstruct));
		}
	function returnJsontext (jsontext) { //9/14/22 by DW
		theRequest.httpReturn (200, "application/json", jsontext.toString ());
		}
	function returnError (jstruct) {
		theRequest.httpReturn (500, "application/json", utils.jsonStringify (jstruct));
		}
	function returnOpml (err, opmltext) {
		if (err) {
			returnError (err);
			}
		else {
			theRequest.httpReturn (200, "text/xml", opmltext);
			}
		}
	function httpReturn (err, returnedValue) {
		if (err) {
			returnError (err);
			}
		else {
			if (typeof returnedValue == "object") {
				returnData (returnedValue);
				}
			else {
				returnJsontext (returnedValue); //9/14/22 by DW
				}
			}
		}
	switch (theRequest.method) {
		case "POST":
			switch (theRequest.lowerpath) {
				case config.thisServer.feedUpdatedCallback:
					var jstruct = qs.parse (theRequest.postBody);
					addEvent ({
						type: "feedUpdate",
						params: jstruct,
						method: "POST"
						});
					returnPlainText ("Thanks for the update! ;-)");
					break;
				default: 
					returnNotFound ()
					break;
				}
		case "GET":
			switch (theRequest.lowerpath) {
				case "/now": 
					returnPlainText (new Date ().toString ());
					return (true);
				case config.thisServer.feedUpdatedCallback: 
					returnPlainText (params.challenge);
					addEvent ({
						type: "feedUpdate",
						params,
						method: "GET"
						});
					break;
				default: 
					returnNotFound ();
					break;
				}
			break;
		}
	}
function everySecond () {
	if (utils.secondsSince (whenLastRequest) > 3600) {
		requestNotification (config.defaultFeedUrl);
		whenLastRequest = new Date ();
		}
	if (flStatsChanged) {
		flStatsChanged = false;
		fs.writeFile (fnameStats, utils.jsonStringify (stats), function (err) {
			});
		}
	}
readStats (function (err) {
	console.log ("config == " + utils.jsonStringify (config));
	davehttp.start (config, handleHttpRequest);
	setInterval (everySecond, 1000);
	});
