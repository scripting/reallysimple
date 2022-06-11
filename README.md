# reallysimple

A Node package that reads RSS-like feeds and calls back with a simple, consistent JavaScript object. Easy to use, hides the history.

#### Code example

I always like to see the code first...

```javascriptconst fs = require ("fs");const reallysimple = require ("reallysimple");const urlFeed = "http://scripting.com/rss.xml";reallysimple.readFeed (urlFeed, function (err, theFeed) {	if (!err) {		const jsontext = JSON.stringify (theFeed, undefined, 4);		fs.writeFile ("test.json", jsontext, function (err) {			});		}	});```

Here's <a href="https://github.com/scripting/reallysimple/blob/main/example/test.json">the file</a> that's created when you run the code. 

#### Why?

I needed a simple routine to call when I wanted to read a feed. 

#### What formats are supported?

RSS, Atom, and RDF.

#### What we build on

Thanks to Dan MacTough for the <a href="https://www.npmjs.com/package/feedparser">feedparser</a> package.

#### Work notes

#### Comments, questions?

Please post your comments and questions in the <a href="https://github.com/scripting/reallysimple/issues/new">issues section</a> of this repo.

