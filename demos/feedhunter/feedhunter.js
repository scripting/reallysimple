var myProductName = "feedfinder", myVersion = "0.4.0";

exports.huntForFeed = huntForFeed;

const fs = require ("fs");
const utils = require ("daveutils"); 
const request = require ("request");
const reallysimple = require ("reallysimple");
const urlpackage = require ("url");

function httpReadUrl (url, callback) { //8/21/22 by DW
	request (url, function (err, response, data) {
		if (err) {
			callback (err);
			}
		else {
			if (response.statusCode != 200) {
				const errstruct = {
					message: "Can't read the URL, \"" + url + "\" because we received a status code of " + response.statusCode + ".",
					statusCode: response.statusCode
					};
				callback (errstruct);
				}
			else {
				callback (undefined, data);
				}
			}
		});
	}
function getFeedsLinkedToFromHtml (htmlUrl, callback) { //11/8/23 by DW
	function findFeedsFromHTML (html) {
		const regex = /<link[^>]+type="application\/(?:rss\+xml|atom\+xml)"[^>]+href="([^"]+)"[^>]*>/g;
		let match;
		const feeds = [];
		while ((match = regex.exec (html)) !== null) {
			feeds.push (match [1]);
			}
		return (feeds);
		}
	httpReadUrl (htmlUrl, function (err, htmltext) {
		if (err) {
			callback (err);
			}
		else {
			var feedlist = findFeedsFromHTML (htmltext);
			if (feedlist.length == 0) {
				const message = "Can't find any feeds in the HTML text.";
				callback ({message});
				}
			else {
				callback (undefined, feedlist);
				}
			}
		});
	}
function huntForFeed (htmlUrl, options, callback) {
	var config = {
		filePathsToCheck: [
			"feed",
			"rss",
			"feeds/posts/default",
			"feed.xml",
			"rss.xml",
			"index.xml",
			"blog/feed",
			"feeds/videos.xml",
			"atom.xml",
			"blog",
			"rss/index.xml",
			"feed.rss",
			"feed/atom",
			"feed/podcast",
			"blog/rss.xml",
			"blog/index.xml",
			"news/feed",
			"blog-feed.xml",
			"rss.php",
			"blog/rss",
			"bridge01",
			"feed.atom",
			"blog/atom.xml",
			"feed/rss",
			"index.rss",
			"RSSFeed.aspx",
			"blog/feed.xml"
			]
		};
	if (options !== undefined) {
		for (var x in options) {
			config [x] = options [x];
			}
		}
	const parsedUrl = urlpackage.parse (htmlUrl, true);
	const origin = parsedUrl.protocol + "//" + parsedUrl.host + "/";
	console.log (utils.jsonStringify (parsedUrl));
	console.log ("origin == " + origin);
	var fileQueue = new Array ();
	getFeedsLinkedToFromHtml (htmlUrl, function (err, feeds) {
		if (feeds !== undefined) {
			feeds.forEach (function (item) {
				fileQueue.push (item);
				});
			}
		config.filePathsToCheck.forEach (function (item) {
			fileQueue.push (origin + item);
			});
		function checkNext (ix) {
			if (ix < fileQueue.length) {
				const feedUrl = fileQueue [ix];
				reallysimple.readFeed (feedUrl, function (err, theFeed) {
					if (err) {
						console.log ("huntForFeed: feedUrl == " + feedUrl);
						checkNext (ix + 1);
						}
					else {
						console.log ("huntForFeed: found! feedUrl == " + feedUrl);
						callback (feedUrl); 
						}
					});
				}
			else {
				callback (undefined); //didn't find a feed
				}
			}
		checkNext (0);
		});
	}
