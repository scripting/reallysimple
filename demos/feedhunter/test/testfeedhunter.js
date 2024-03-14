const feedhunter = require ("feedhunter"); 
const htmlUrl = "https://bsky.app/profile/scripting.com";
feedhunter.huntForFeed (htmlUrl, undefined, function (feedUrl) {
	if (feedUrl === undefined) {
		console.log ("\nCouldn't find a feed for this page.\n");
		}
	else {
		console.log ("\nWe found a feed: " + feedUrl + "\n");
		}
	});
