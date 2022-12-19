const myVersion = "0.4.1", myProductName = "titlelessFeedsHowto"; 

var defaultFeedUrl = "http://scripting.com/rss.xml";

var config = {
	maxTitleTextLength: 120,
	maxBodyTextLength: 240,
	maxItemsInList: 25,
	flDisplayBodytext: true
	};

function getUrlParam (name) { 
	var val = getURLParameter (name);
	if (val == "null") {
		return (undefined);
		}
	else {
		return (decodeURIComponent (val));
		}
	}
function goToNewUrl () {
	var newUrl = $("#idFeedUrlInput").val ();
	window.location.href = "?url=" + encodeURIComponent (newUrl);
	}
function firstCharsFrom (theString, ctCharsApprox) {
	var ixLastWhitespace = 0;
	for (var i = 0; i < theString.length; i++) {
		if (isWhitespace (theString [i])) {
			ixLastWhitespace = i;
			}
		if (i == ctCharsApprox) {
			return (stringMid (theString, 1, ixLastWhitespace));
			}
		}
	return (theString);
	}
function firstSentence (theString) { //12/11/22
	for (var i = 0; i < theString.length - 1; i++) {
		if (theString [i] == ".") {
			if (isWhitespace (theString [i + 1])) {
				return (stringMid (theString, 1, i + 1));
				}
			}
		}
	return ("");
	}
function httpRequest (url, timeout, headers, callback) {
	timeout = (timeout === undefined) ? 30000 : timeout;
	var jxhr = $.ajax ({ 
		url: url,
		dataType: "text", 
		headers,
		timeout
		}) 
	.success (function (data, status) { 
		callback (undefined, data);
		}) 
	.error (function (status) { 
		var message;
		try { //9/18/21 by DW
			message = JSON.parse (status.responseText).message;
			}
		catch (err) {
			message = status.responseText;
			}
		var err = {
			code: status.status,
			message
			};
		callback (err);
		});
	}
function readFeed (feedUrl, callback) {
	var url = "http://feeder.scripting.com/returnjson?url=" + feedUrl;
	httpRequest (url, undefined, undefined, function (err, jsontext) {
		if (err) {
			callback (err);
			}
		else {
			try {
				var jstruct = JSON.parse (jsontext);
				callback (undefined, jstruct); 
				}
			catch (err) {
				callback (err);
				}
			}
		});
	}
function viewFeedItems (feedUrl) {
	readFeed (feedUrl, function (err, theFeed) {
		if (err) {
			alertDialog (err.message);
			}
		else {
			$("#idFeedTitle").text (theFeed.title);
			const itemViewer = $("#idItemViewer");
			const itemList = $("<ul></ul>");
			var ctItems = 0;
			theFeed.items.forEach (function (feedItem) {
				if (ctItems < config.maxItemsInList) {
					const viewedItem = $("<li></li>");
					var titleText = "", bodyText = "";
					if (feedItem.title !== undefined) {
						titleText = stripMarkup (feedItem.title) + ". ";
						bodyText = stripMarkup (feedItem.description);
						}
					else {
						let s = stripMarkup (feedItem.description);
						
						let firstSen = firstSentence (s); //12/11/22 by DW
						if ((firstSen.length <= config.maxTitleTextLength) && (firstSen.length > 0)) {
							titleText = firstSen;
							}
						else {
							titleText = firstCharsFrom (s, config.maxTitleTextLength);
							}
						bodyText = stringDelete (s, 1, titleText.length);
						
						bodyText = maxStringLength (bodyText, config.maxBodyTextLength, true, true); //whole words, if truncated add elipses
						}
					const theTitle = $("<span class=\"spTitleText\">" + titleText + "</span>");
					const theBody = $("<span class=\"spBodyText\">" + bodyText + "</span>");
					
					viewedItem.append (theTitle);
					if (config.flDisplayBodytext) {
						viewedItem.append (theBody);
						}
					ctItems++;
					
					itemList.append (viewedItem);
					
					viewedItem.mouseenter (function () {
						viewedItem.addClass ("hovering");
						});
					viewedItem.mouseleave (function () {
						viewedItem.removeClass ("hovering");
						});
					viewedItem.click (function () {
						if (feedItem.permalink === undefined) {
							speakerBeep ();
							}
						else {
							window.location.href = feedItem.permalink;
							}
						});
					}
				});
			itemViewer.append (itemList);
			}
		});
	}

function startup () {
	console.log ("startup");
	$(".divVersionNumber").text ("v" + myVersion);
	var urlParam = getUrlParam ("url");
	var feedUrl = (urlParam === undefined) ? defaultFeedUrl : urlParam;
	$("#idFeedUrlInput").val (feedUrl);
	viewFeedItems (feedUrl);
	hitCounter (); 
	}
