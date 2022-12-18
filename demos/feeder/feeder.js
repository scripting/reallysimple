const myVersion = "0.4.10", myProductName = "feeder";     

const fs = require ("fs");
const utils = require ("daveutils");
const request = require ("request"); 
const davehttp = require ("davehttp"); 
const reallysimple = require ("reallysimple");

var config = {
	port: process.env.PORT || 1403,
	flAllowAccessFromAnywhere: true,
	flLogToConsole: true,
	defaultFeedUrl: "http://nytimes.com/timeswire/feeds/",
	fnameStats: "stats.json",
	templatesFolderPath: "templates/"
	}

var stats = {
	ctLaunches: 0,
	whenLastLaunch: undefined,
	ctFeedReads: 0,
	whenLastFeedRead: undefined,
	ctFeedReadErrors: 0,
	whenLastFeedReadError: undefined,
	ctSecsLastRequest: undefined,
	feeds: new Object ()
	}
var flStatsChanged = false;

function statsChanged () {
	flStatsChanged = true;
	}
function buildParamList (params) {
	var s = "";
	for (var x in params) {
		if (params [x] !== undefined) {
			if (s.length > 0) {
				s += "&";
				}
			s += x + "=" + encodeURIComponent (params [x]);
			}
		}
	return (s);
	}
function readFeed (feedUrl=config.defaultFeedUrl, callback) {
	const whenstart = new Date ();
	reallysimple.readFeed (feedUrl, function (err, theFeed) {
		stats.ctFeedReads++;
		stats.whenLastFeedRead = whenstart;
		stats.ctSecsLastRequest = utils.secondsSince (whenstart);
		if (err) {
			stats.ctFeedReadErrors++;
			stats.whenLastFeedReadError = whenstart;
			callback (err);
			}
		else {
			if (stats.feeds [feedUrl] === undefined) {
				stats.feeds [feedUrl] = {
					ct: 1,
					when: whenstart
					}
				}
			else {
				let thisFeed = stats.feeds [feedUrl];
				thisFeed.ct++;
				thisFeed.when = whenstart;
				}
			callback (undefined, theFeed);
			}
		statsChanged ();
		});
	}
function viewFeedInTemplate (feedUrl, templateName, callback) { //6/20/22 by DW
	const whenstart = new Date ();
	function servePage (templatetext, theFeed) {
		const feedJsonText = utils.jsonStringify (theFeed);
		const serverConfig = {
			productName: myProductName, 
			version: myVersion,
			ctSecs: utils.secondsSince (whenstart), //6/23/22 by DW
			feedUrl //6/23/22 by DW
			};
		var pagetable = {
			feedTitle: theFeed.title,
			productnameForDisplay: myProductName, //it appears in the mailbox template -- 6/22/22 AM by DW
			config: utils.jsonStringify (serverConfig),
			riverJsonText: feedJsonText, //for compatibility with River6
			feedJsonText
			};
		var pagetext = utils.multipleReplaceAll (templatetext.toString (), pagetable, false, "[%", "%]");
		callback (pagetext);
		}
	readFeed (feedUrl, function (err, theFeed) {
		if (err) { //6/23/22 by DW
			callback ("Can't view the feed because there was an error reading it: " + err.message + ".");
			}
		else {
			var flnotfound = true;
			utils.sureFolder (config.templatesFolderPath, function () {
				var f = config.templatesFolderPath + templateName + ".html";
				fs.readFile (f, function (err, templatetext) {
					if (err) {
						callback ("Can't view the feed because there was an error reading the template.");
						}
					else {
						servePage (templatetext, theFeed);
						}
					});
				});
			}
		});
	}
function readConfig (f, config, callback) {
	fs.readFile (f, function (err, jsontext) {
		if (!err) {
			try {
				var jstruct = JSON.parse (jsontext);
				for (var x in jstruct) {
					config [x] = jstruct [x];
					}
				}
			catch (err) {
				console.log ("Error reading " + f);
				}
			}
		callback ();
		});
	}
function everySecond () {
	if (flStatsChanged) {
		flStatsChanged = false;
		fs.writeFile (config.fnameStats, utils.jsonStringify (stats), function (err) {
			});
		}
	}
function handleHttpRequest (theRequest) {
	var params = theRequest.params;
	function returnNotFound () {
		theRequest.httpReturn (404, "text/plain", "Not found.");
		}
	function returnRedirect (url) {
		const code = 302;
		theRequest.httpReturn (code, "text/plain", code + " REDIRECT", {location: url});
		}
		
	function returnHtml (htmltext) {
		theRequest.httpReturn (200, "text/html; charset=utf-8", htmltext); //6/13/22 by DW
		}
	function returnOpml (opmltext) {
		theRequest.httpReturn (200, "text/xml; charset=utf-8", opmltext); //6/13/22 by DW
		}
	function returnError (jstruct) {
		theRequest.httpReturn (500, "application/json", utils.jsonStringify (jstruct));
		}
	function returnData (jstruct) {
		if (jstruct === undefined) {
			jstruct = {};
			}
		theRequest.httpReturn (200, "application/json; charset=utf-8", utils.jsonStringify (jstruct)); //6/13/22 by DW
		}
	function httpReturn (err, jstruct) {
		if (err) {
			returnError (err);
			}
		else {
			returnData (jstruct);
			}
		}
	function mailboxRedirect () {
		var newUrl = "/?template=mailbox";
		if (params.url !== undefined) {
			params.feedurl = params.url;
			}
		if (params.feedurl !== undefined) {
			newUrl += "&feedurl=" + encodeURIComponent (params.feedurl);
			}
		returnRedirect (newUrl);
		}
	
	if (params.url !== undefined) { //6/20/22 by DW
		params.feedurl = params.url;
		delete params.url;
		let newUrl = theRequest.lowerpath + "?" + buildParamList (params);
		returnRedirect (newUrl);
		}
	else {
		switch (theRequest.lowerpath) {
			case "/": //6/20/22 by DW
				viewFeedInTemplate (params.feedurl, params.template, returnHtml);
				break;
			case "/stats": 
				returnData (stats); 
				break;
			case "/returnjson": 
				readFeed (params.feedurl, httpReturn);
				break;
			case "/returnopml":
				readFeed (params.feedurl, function (err, theFeed) {
					if (err) {
						returnError (err);
						}
					else {
						returnOpml (reallysimple.convertFeedToOpml (theFeed));
						}
					});
				break;
			case "/returnmailbox": //6/18/22 by DW
				mailboxRedirect ();
				break;
			default:
				returnNotFound ();
				break;
			}
		}
	}

readConfig (config.fnameStats, stats, function () {
	stats.ctLaunches++;
	stats.whenLastLaunch = new Date ();
	statsChanged ();
	davehttp.start (config, handleHttpRequest)
	setInterval (everySecond, 1000); 
	});
