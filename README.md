# reallysimple

JavaScript code to read a feed. Calls back with a simple JavaScript object, easily represented in JSON. Hides all the history.

#### What formats are supported?

RSS, Atom, and RDF.

#### Why?

I wanted to make reading a feed from a JavaScript app as easy as possible. 

To hide all the history to get it out of your way. 

If developers can quickly put together an app that uses feeds, people will try out more ideas, add feed support to more apps.

I needed to simplify feed reading for the scripting system in Drummer. For scripting, simplicity is everything. Why not share the simplicity with lower level code.

There probably is a small tradeoff in performance, you can probably write faster code by going straight to the feedparser level. And that's fine for applications that require the maximum performance, perhaps where you're reading a thousand feeds per sectond. 

#### A coding example

Here's how you call the package.

```javascriptconst fs = require ("fs");const reallysimple = require ("reallysimple");const urlFeed = "http://scripting.com/rss.xml";reallysimple.readFeed (urlFeed, function (err, theFeed) {	if (!err) {		const jsontext = JSON.stringify (theFeed, undefined, 4);		fs.writeFile ("test.json", jsontext, function (err) {			});		}	});```

Here's <a href="https://github.com/scripting/reallysimple/blob/main/example/test.json">the file</a> that's created when you run that code. 

#### What we build on

Thanks to Dan MacTough for the <a href="https://www.npmjs.com/package/feedparser">feedparser</a> package.

It also builds on the davefeedread package, which simplifies the programming interface to feedparser.

This package further simplifies the struct returned by <a href="https://www.npmjs.com/package/davefeedread">davefeedread</a>.

#### Work notes

4/7/22; 11:37:16 AM by DW

Clean up the readme file. Simplify the example app. Review docs. Start to invite collaborators to the repo, still private.

3/21/22; 10:19:22 AM by DW

Reviewing the way we represent links in items in the API. 

The question is this -- how can we get a link to the item from the item. 

The answer, on reflection -- rely on the link element as the permalink. 

3/7/22; 10:27:47 AM by DW

Start the reallysimple repo. Publish the NPM package. 

3/6/22; 11:27:52 AM by DW

It now understands various elements from the source namespace, including source:account, source:localtime and source:outline.

Started a new private GitHub repo for the project and saved the files. 

Added it to my NPM sub-menu, this is going to be a supported project.

#### Comments, questions?

Please post your comments and questions in the <a href="https://github.com/scripting/reallysimple/issues/new">issues section</a> of this repo.

