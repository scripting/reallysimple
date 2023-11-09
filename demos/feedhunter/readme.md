# feedHunter

A Node.js <a href="https://www.npmjs.com/package/feedhunter">package</a> that looks for a feed, starting with the address of an HTML file.

### How to

```JAVASCRIPTconst feedhunter = require ("feedhunter");const htmlUrl = "http://bullmancuso.com";feedhunter.huntForFeed (htmlUrl, undefined, function (feedUrl) {	if (feedUrl === undefined) {		console.log ("Couldn't find a feed for this page.");		}	else {		console.log ("feedUrl == " + feedUrl);		}	});```

Note: The second parameter to <i>feedhunter.huntForFeed</i> allows you to replace our set of standard feed locations with your own list.

### What it does

When the user subscribes to an HTML file in FeedLand, first we look for all the &lt;link> elements in the HTML that point to feeds. We look at each feed in turn, and if we find one that can be read and parses as a feed, we subscribe to that feed and display its <i>Feed Info</i> page. We do that with a call to feedhunter.huntForFeed.

We also use a set of common feed locations we found by studying the feed list of the <a href="https://indieblog.page/export">indieblog</a> site (a great resource for our work, thanks!), and by studying the feeds people have subscribed to on <a href="https://feedland.org">feedland.org</a>. 

I put this code in a separate package, because it seemed it might be useful in other contexts and people may have other ideas for standard feed locations we could add to the search.

If you want to try an experiment, choose <i>To one feed</i> from the Subscribe sub-menu in FeedLand's main menu, and enter http://bullmancuso.com. I put a copy of a very old feed in a weird location, one of the places <a href="https://github.com/scripting/reallysimple/tree/main/demos/feedhunter">feedhunter</a> looks. If it's working we'll find the feed anyway. :smile:

### Questions, comments?

Create an issue <a href="https://github.com/scripting/reallysimple/issues">here</a>. 

