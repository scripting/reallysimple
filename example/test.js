var myProductName = "test"; myVersion = "0.4.0";    

const fs = require ("fs");
const utils = require ("daveutils");
const reallysimple = require ("reallysimple");

const urlfeed = "https://rss.nytimes.com/services/xml/rss/nyt/Movies.xml";

reallysimple.readFeed (urlfeed, function (err, theFeed) {
	if (err) {
		console.log (err.message);
		}
	else {
		var jsontext = utils.jsonStringify (theFeed);
		console.log ("theFeed == " + jsontext);
		fs.writeFile ("test.json", jsontext, function (err) {
			if (err) {
				console.log (err.message);
				}
			});
		}
	});
