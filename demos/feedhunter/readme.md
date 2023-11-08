# feedHunter

Look for an HTML file's associated feed.

### What it does

When the user subscribes to an HTML file in FeedLand, first we look for a &lt;link> element in the HTML that points to a feed. We look at each feed in turn, and if we find one that's a feed, we subscribe to that feed and display its Feed Info page. 

We also use a set of common feed locations we found by studying the feed list of the <a href="https://indieblog.page/export">indieblog</a> site (a great resource for our work, thanks!), and by studying the feeds people have subscribed to on <a href="https://feedland.org">feedland.org</a>. 

I put this code in a separate package, because it seemed it might be useful in other contexts. 

If you want to try an experiment, choose <i>To one feed</i> from the Subscribe sub-menu in FeedLand's main menu, and enter bullmancuso.com. I put a copy of a very old feed in a weird location, one of the places <a href="https://github.com/scripting/reallysimple/tree/main/demos/feedhunter">feedhunter</a> looks. If it's working we'll find the feed anyway. :smile:

