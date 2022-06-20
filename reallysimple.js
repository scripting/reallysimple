var myProductName = "reallysimple", myVersion = "0.4.10";     

exports.readFeed = readFeed;
exports.convertFeedToOpml = convertFeedToOpml;

const utils = require ("daveutils");
const request = require ("request");
const opml = require ("opml");
const davefeedread = require ("davefeedread");

const allowedHeadNames = [
	"title", "link", "description", "language", "copyright", "managingEditor", "webMaster", "lastBuildDate", "pubDate", "category",
	"generator", "docs", "cloud", "ttl", "image", "rating", "textInput", "skipHours", "skipDays", "source:account", "source:localtime", "linkToSelf"
	];
const allowedItemNames = [
	"title", "link", "description", "author", "category", "comments", "enclosures", "guid", "pubDate", "source", "source:outline", "source:likes"
	];
const allowedEnclosureNames = [
	"url", "type", "length"
	];

var config = {
	timeOutSecs: 3
	}

function isEmptyObject (obj) {
	try {
		return (Object.keys (obj).length === 0);
		}
	catch (err) {
		return (true); //6/8/22 by DW
		}
	}
function getItemPermalink (item) { 
	var rssguid = item ["rss:guid"], returnedval = undefined;
	if (rssguid !== undefined) {
		var atts = rssguid ["@"];
		if (atts.ispermalink === undefined) {
			returnedval = rssguid ["#"];
			}
		else {
			if (utils.getBoolean (atts.ispermalink)) {
				returnedval = rssguid ["#"];
				}
			}
		}
	if (returnedval !== undefined) {
		if (utils.beginsWith (returnedval, "http")) {
			return (returnedval);
			}
		}
	return (undefined);
	}
function convertFeedToOpml (theFeed) { //use this if you want to show an RSS feed in an outline
	var theOutline = {
		opml: {
			head: {
				title: theFeed.title
				},
			body: {
				subs: new Array ()
				}
			}
		}
	theFeed.items.forEach (function (item) {
		var linetext, subtext;
		if (item.title === undefined) {
			linetext = item.description;
			}
		else {
			linetext = item.title;
			subtext = item.description;
			}
		theOutline.opml.body.subs.push ({
			text: linetext,
			type: "link",
			url: item.link
			});
		});
	return (opml.stringify (theOutline));
	}
function convertFeed (oldFeed) {
	
	var newFeed = new Object ();
	
	function convertOutline (jstruct) { 
		var theNewOutline = {};
		if (jstruct ["@"] !== undefined) {
			utils.copyScalars (jstruct ["@"], theNewOutline);
			}
		if (jstruct ["source:outline"] !== undefined) {
			if (jstruct ["source:outline"] instanceof Array) {
				var theArray = jstruct ["source:outline"];
				theNewOutline.subs = [];
				theArray.forEach (function (item) {
					theNewOutline.subs.push (convertOutline (item));
					});
				}
			else {
				theNewOutline.subs = [
					convertOutline (jstruct ["source:outline"])
					];
				}
			}
		return (theNewOutline);
		}
	function removeExtraAttributes (theNode) {
		function visit (theNode) {
			if (theNode.flincalendar !== undefined) {
				delete theNode.flincalendar;
				}
			if (theNode.subs !== undefined) {
				theNode.subs.forEach (function (sub) {
					visit (sub);
					});
				}
			}
		visit (theNode);
		}
	function getHeadValuesFromFirstItem () { //3/6/22 by DW
		if (oldFeed.items.length > 0) {
			var item = oldFeed.items [0];
			if (item.meta !== undefined) {
				if (item.meta ["source:account"] !== undefined) {
					var account = item.meta ["source:account"]; 
					newFeed.accounts = new Object ();
					if (Array.isArray (account)) {
						account.forEach (function (item) {
							var service = item  ["@"].service
							var name = item ["#"];
							newFeed.accounts [service] = name;
							});
						}
					else {
						var service = account ["@"].service; //something like twitter
						var name = account ["#"];
						newFeed.accounts [service] = name;
						}
					}
				if (item.meta ["source:localtime"] !== undefined) {
					var localtime = item.meta ["source:localtime"]; 
					newFeed.localtime = localtime ["#"];
					}
				}
			}
		}
	
	for (var x in oldFeed.head) {
		let val = oldFeed.head [x];
		if (val != null) {
			allowedHeadNames.forEach (function (name) {
				if (x == name) {
					newFeed [x] = val;
					}
				});
			}
		}
	
	getHeadValuesFromFirstItem (); //3/6/22 by DW
	
	if (newFeed.image !== undefined) { //5/17/22 by DW
		if (isEmptyObject (newFeed.image)) {
			delete newFeed.image;
			}
		}
	if (newFeed.cloud !== undefined) { //6/11/22 by DW
		if (isEmptyObject (newFeed.cloud)) {
			delete newFeed.cloud;
			}
		}
	
	newFeed.items = new Array ();
	oldFeed.items.forEach (function (item) {
		var newItem = new Object ();
		for (var x in item) {
			val = item [x];
			if (val != null) {
				allowedItemNames.forEach (function (name) {
					if (x == name) {
						if (x == "source:outline") {
							val = convertOutline (item ["source:outline"]);
							removeExtraAttributes (val); //3/27/22 by DW
							newItem.outline = val;
							}
						else {
							if (x == "enclosures") {
								if (item.enclosures.length > 0) {
									newItem.enclosure = item.enclosures [0];
									}
								}
							else {
								newItem [x] = val;
								}
							}
						}
					});
				}
			}
		newItem.guid = getItemPermalink (item);
		if (newItem.source !== undefined) { //5/17/22 by DW
			if (isEmptyObject (newItem.source)) {
				delete newItem.source;
				}
			}
		
		if (newItem.enclosure !== undefined) { //6/11/22 by DW
			var enc = new Object ();
			for (var x in newItem.enclosure) {
				allowedEnclosureNames.forEach (function (name) {
					if (x == name) {
						if (newItem.enclosure [x] != null) {
							enc [x] = newItem.enclosure [x];
							}
						}
					});
				}
			newItem.enclosure = enc;
			}
		
		newFeed.items.push (newItem);
		});
	
	return (newFeed);
	}

function readFeed (url, callback) {
	davefeedread.parseUrl (url, config.timeOutSecs, function (err, theFeed) {
		if (err) {
			callback (err);
			}
		else {
			callback (undefined, convertFeed (theFeed));
			}
		});
	}
