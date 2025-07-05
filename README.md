# reallysimple

A <a href="https://www.npmjs.com/package/reallysimple">Node package</a> that reads RSS-like feeds and calls back with a simple, consistent JavaScript object. Easy to use, hides the history.

#### Code example

I always like to see the code first...

```javascriptconst reallysimple = require ("reallysimple");const urlFeed = "https://rss.nytimes.com/services/xml/rss/nyt/World.xml";reallysimple.readFeed (urlFeed, function (err, theFeed) {	if (err) {		console.log (err.message);		}	else {		console.log (JSON.stringify (theFeed, undefined, 4));		}	});```

This is <a href="https://github.com/scripting/reallysimple/blob/main/example/test.json">what you see</a> when you run the code. 

#### Why?

I needed a simple routine to call when I wanted to read a feed. 

#### What formats are supported?

RSS, Atom, and RDF.

#### Demo

Here's a <a href="http://feeder.scripting.com/returnjson?feedurl=https%3A%2F%2Frss.nytimes.com%2Fservices%2Fxml%2Frss%2Fnyt%2FTheater.xml">demo app</a> that runs a feed through reallySimple. 

#### tinyFeedReader

<a href="https://github.com/scripting/tinyFeedReader">tinyFeedReader</a> is a useful Node app that builds on the reallySimple package.

#### What we build on

Thanks to Dan MacTough for the <a href="https://www.npmjs.com/package/feedparser">feedparser</a> package.

#### Comments, questions?

Post comments and questions in the <a href="https://github.com/scripting/reallysimple/issues/new">issues section</a> of this repo.

