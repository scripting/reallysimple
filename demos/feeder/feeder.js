const myVersion = "0.5.1", myProductName = "feeder";      

const fs = require ("fs");
const utils = require ("daveutils");
const dateformat = require ("dateformat");
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
function convertFeedToMarkdown (theOutline) { //3/29/23 by DW
	var mdtext = "";
	function add (s) {
		mdtext += s + "\n\n";
		}
	theOutline.items.forEach (function (item) {
		if (item.pubDate !== undefined) {
			add ("# " + item.pubDate.toUTCString ());
			}
		if (item.title === undefined) {
			if (item.description !== undefined) {
				add ("## " + item.description);
				}
			}
		else {
			add ("## " + item.title);
			if (item.description !== undefined) {
				add ("- " + item.description);
				}
			}
		});
	return (mdtext);
	}

function cleanDescription (desc) { //4/19/23 by DW
	desc = utils.trimWhitespace (desc); //11/28/25 by DW
	if (utils.beginsWith (desc, "<p>")) {
		desc = utils.stringDelete (desc, 1, 3);
		}
	if (utils.endsWith (desc, "</p>")) {
		desc = utils.stringMid (desc, 1, desc.length - 5);
		}
	return (desc);
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
		
	function returnString (s) {
		theRequest.httpReturn (200, "text/plain; charset=utf-8", s); //4/7/23 by DW
		}
	function returnHtml (htmltext) {
		theRequest.httpReturn (200, "text/html; charset=utf-8", htmltext); //6/13/22 by DW
		}
	function returnOpml (opmltext) {
		theRequest.httpReturn (200, "text/xml; charset=utf-8", opmltext); //6/13/22 by DW
		}
	
	function returnLinkblogDay (feedUrl, callback) {
		const theDay = new Date (); //get the linkblog html for today
		readFeed (feedUrl, function (err, theFeed) { 
			if (err) {
				returnError (err);
				}
			else {
				var htmltext = "";
				function add (s) {
					htmltext += s + "\n";
					}
				var ctitems = 0;
				theFeed.items.forEach (function (item) {
					if (utils.sameDay (theDay, item.pubDate)) {
						var pubdatestring = new Date (item.pubDate).toLocaleTimeString ();
						
						var link = "";
						if (typeof item.link == "string") { //1/13/23 by DW
							link = "<a href=\"" + item.link + "\">" + utils.getDomainFromUrl (item.link) + "</a>";
							}
						
						add ("<div class=\"divLinkblogItem\">" + cleanDescription (item.description) + " " + link + "</div>");
						ctitems++;
						}
					});
				if (ctitems > 0) {
					htmltext = "<h4>Linkblog items for the day.</h4>\n" + htmltext;
					}
				callback (undefined, htmltext);
				}
			});
		}
	function returnLinkblogJson (feedUrl, callback) { //4/19/23 by DW
		readFeed (feedUrl, function (err, theFeed) { 
			if (err) {
				callback (err);
				}
			else {
				var daysArray = new Array ();
				theFeed.items.forEach (function (item) {
					const convertedItem = {
						text: cleanDescription (item.description),
						title: item.title,
						link: item.link,
						linkShort: "",
						whenLastEdit: item.pubDate,
						flDirty: false,
						when: item.pubDate
						};
					const pubDate = new Date (item.pubDate);
					const datestring = pubDate.toLocaleDateString (); //something like 4/19/2023
					var flfound = false;
					daysArray.forEach (function (theDay) {
						if (utils.sameDay (pubDate, theDay.when)) {
							flfound = true;
							theDay.jstruct.dayHistory.push (convertedItem);
							}
						});
					if (!flfound) {
						daysArray.push ({
							when: pubDate,
							jstruct: {
								version: "1.0",
								when: new Date (),
								whenLastUpdate: new Date (),
								dayHistory: [convertedItem]
								}
							});
						}
					});
				callback (undefined, daysArray);
				}
			});
		}
	function returnLinkblogHtml (feedUrl, callback) { //4/20/23 by DW
		const firstLinkblogDay = new Date ("April 17, 2023");
		
		function getDayTitle (when) {
			return (dateformat (when, "dddd, mmmm d, yyyy"));
			}
		
		function buildDaysTable (theFeed) {
			var daysTable = new Object ();
			theFeed.items.forEach (function (item) {
				const pubDate = new Date (item.pubDate);
				if (utils.dayGreaterThanOrEqual (pubDate, firstLinkblogDay)) {
					const datestring = pubDate.toLocaleDateString (); //something like 4/19/2023
					var bucket = daysTable [datestring];
					if (bucket === undefined) {
						daysTable [datestring] = new Array ();
						bucket = daysTable [datestring];
						}
					bucket.push (item);
					}
				});
			return (daysTable);
			}
		function appendDay (dayString, theDayItems) {
			const when = new Date (dayString); //turn something like 4/19/2023 to a date object
			var daytext = "", indentlevel = 0;
			
			function add (s) {
				daytext += utils.filledString ("\t", indentlevel) + s + "\n";
				}
			add ("<div class=\"divLinkblogDayTitle\">" + getDayTitle (when) + "</div>");
			add ("<div class=\"divLinkblogDay\">"); indentlevel++;
			theDayItems.forEach (function (item) {
				var link = "";
				if (typeof item.link == "string") { //1/13/23 by DW
					link = "<a href=\"" + item.link + "\">" + utils.getDomainFromUrl (item.link) + "</a>";
					}
				add ("<p>" + cleanDescription (item.description) + " " + link + "</p>"); //4/18/23 by DW
				});
			add ("</div>"); indentlevel--;
			return (daytext)
			}
		readFeed (feedUrl, function (err, theFeed) { 
			if (err) {
				callback (err);
				}
			else {
				var daysTable = buildDaysTable (theFeed), htmltext = "";
				for (var x in daysTable) {
					htmltext += appendDay (x, daysTable [x]);
					}
				callback (undefined, htmltext);
				}
			});
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
				if (params.template === undefined) { //1/11/25 by DW -- don't use a template, just return the json
					readFeed (params.feedurl, httpReturn);
					}
				else {
					viewFeedInTemplate (params.feedurl, params.template, returnHtml);
					}
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
			case "/returnmarkdown": //3/29/23 by DW
				readFeed (params.feedurl, function (err, theFeed) {
					if (err) {
						returnError (err);
						}
					else {
						returnString (convertFeedToMarkdown (theFeed));
						}
					});
				break;
			case "/returnmailbox": //6/18/22 by DW
				mailboxRedirect ();
				break;
			case "/returnlinkblogday": //4/18/23 by DW
				returnLinkblogDay (params.feedurl, function (err, htmltext) {
					if (err) {
						returnError (err);
						}
					else {
						returnHtml (htmltext);
						}
					});
				break;
			case "/returnlinkblogjson": //4/19/23 by DW
				returnLinkblogJson (params.feedurl, httpReturn);
				break;
			case "/returnlinkbloghtml": //4/20/23 by DW
				returnLinkblogHtml (params.feedurl, function (err, htmltext) {
					if (err) {
						returnError (err);
						}
					else {
						returnHtml (htmltext);
						}
					});
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
