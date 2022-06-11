# reallysimple

Node package that reads a fead in multiple formats and returns a simple JavaScript object. Hides the history.

#### Why?

I needed a simple routine to call when I wanted to read a feed. 

#### What formats are supported?

RSS, Atom, and RDF.

#### A coding example

```javascriptconst fs = require ("fs");const reallysimple = require ("reallysimple");const urlFeed = "http://scripting.com/rss.xml";reallysimple.readFeed (urlFeed, function (err, theFeed) {	if (!err) {		const jsontext = JSON.stringify (theFeed, undefined, 4);		fs.writeFile ("test.json", jsontext, function (err) {			});		}	});```

Here's <a href="https://github.com/scripting/reallysimple/blob/main/example/test.json">the file</a> that's created when you run that code. 

#### What we build on

Thanks to Dan MacTough for the <a href="https://www.npmjs.com/package/feedparser">feedparser</a> package.

#### Work notes

#### Comments, questions?

Please post your comments and questions in the <a href="https://github.com/scripting/reallysimple/issues/new">issues section</a> of this repo.





#### Old stuff

#### Why?

I wanted to make reading a feed from a JavaScript app as easy as possible. 

To hide all the history to get it out of your way. 

If developers can quickly put together an app that uses feeds, people will try out more ideas, add feed support to more apps.

I needed to simplify feed reading for the scripting system in Drummer. For scripting, simplicity is everything. Why not share the simplicity with lower level code.

There probably is a small tradeoff in performance, you can probably write faster code by going straight to the feedparser level. And that's fine for applications that require the maximum performance, perhaps where you're reading a thousand feeds per sectond. 











