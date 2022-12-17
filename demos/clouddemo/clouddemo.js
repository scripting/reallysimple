const myVersion = "0.4.0", myProductName = "clouddemo"; 

const fs = require ("fs");
const utils = require ("daveutils");
const qs = require ("querystring"); 
const request = require ("request");
const davehttp = require ("davehttp"); 
const xml2js = require ("xml2js");
const reallysimple = require ("reallysimple"); 

var config = {
	port: process.env.PORT || 1422,
	flPostEnabled: true,
	flLogToConsole: true, //davehttp logs each request to the console
	flTraceOnError: false, //davehttp does not try to catch the error
	defaultFeedUrl: "https://unberkeley.wordpress.com/feed/",
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
function logEvent (infoAboutEvent) {
	if (infoAboutEvent.whenstart !== undefined) {
		infoAboutEvent.ctSecs = utils.secondsSince (infoAboutEvent.whenstart);
		delete infoAboutEvent.whenstart;
		}
	infoAboutEvent.when = new Date ().toLocaleString ();
	stats.events.push (infoAboutEvent); //insert at beginning
	statsChanged ();
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
	const whenstart = new Date ();
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
	reallysimple.readFeed (feedUrl, function (err, theFeed) {
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
					logEvent ({
						type: "requestNotification",
						error: err.message, 
						urlCloudServer,
						feedUrl,
						whenstart
						});
					if (callback !== undefined) {
						callback (err);
						}
					}
				else {
					getResponseFromXml (xmltext, function (err, jstruct) {
						var theEvent = {
							type: "requestNotification",
							urlCloudServer,
							response: jstruct.notifyResult ["$"],
							feedUrl,
							whenstart
							}
						logEvent (theEvent);
						});
					if (callback !== undefined) {
						callback (undefined, theFeed);
						}
					}
				});
			}
		});
	}
function handlePing (feedUrl, callback) {
	//12/17/22; 11:14:18 AM by DW
		//this is where you'd put code that reads the feed, looks for new or updated items
		//it's the punchline, why we did all this stuff in rssCloud, to get you this bit of info
		//much faster.
	callback (undefined, {status: "Got the update. Thanks! :-)"})
	}
function handleHttpRequest (theRequest) {
	var now = new Date ();
	const params = theRequest.params;
	function returnPlainText (theString) {
		if (theString === undefined) {
			theString = "";
			}
		theRequest.httpReturn (200, "text/plain", theString);
		}
	function returnNotFound () {
		theRequest.httpReturn (404, "text/plain", "Not found.");
		}
	function returnError (jstruct) {
		theRequest.httpReturn (500, "application/json", utils.jsonStringify (jstruct));
		}
	switch (theRequest.method) {
		case "POST":
			switch (theRequest.lowerpath) {
				case config.thisServer.feedUpdatedCallback:
					var jstruct = qs.parse (theRequest.postBody);
					handlePing (jstruct.url, function (err, pingResponse) { //read the feed, add new stuff to database, etc.
						returnPlainText (pingResponse.status);
						logEvent ({
							method: "POST",
							path: config.thisServer.feedUpdatedCallback,
							params: jstruct,
							myResponse: pingResponse
							});
						});
					break;
				default: 
					returnNotFound ()
					break;
				}
			break;
		case "GET":
			switch (theRequest.lowerpath) {
				case "/now": 
					returnPlainText (new Date ());
					return (true);
				case config.thisServer.feedUpdatedCallback: 
					handlePing (params.url, function (err, pingResponse) { //read the feed, add new stuff to database, etc.
						logEvent ({
							method: "GET",
							path: config.thisServer.feedUpdatedCallback,
							params,
							myResponse: params.challenge
							});
						returnPlainText (params.challenge);
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
	if (utils.secondsSince (whenLastRequest) > 3600) { //request notification once an hour
		requestNotification (config.defaultFeedUrl);
		whenLastRequest = new Date ();
		}
	if (flStatsChanged) {
		flStatsChanged = false;
		fs.writeFile (fnameStats, utils.jsonStringify (stats), function (err) {
			if (err) {
				console.log ("everySecond: err.message == " + err.message);
				}
			});
		}
	}
readStats (function (err) {
	davehttp.start (config, handleHttpRequest);
	setInterval (everySecond, 1000);
	});
