# reallysimple

JavaScript code to read a feed. Calls back with a JavaScript structure, hiding all the history.

#### What formats are supported?

RSS, Atom, and RDF.

#### Why?

To make reading a feed from a JavaScript app as easy as possible. 

To hide all the history to get it out of your way. 

If developers can quickly put together an app that uses feeds, people will try out more ideas, add feed support to more apps.

I needed to simplify feed reading for the scripting system in Drummer. For scripting, simplicity is everything. Why not share the simplicity with lower level code.

There probably is a small tradeoff in performance, you can probably write faster code by going straight to the feedparser level. And that's fine for applications that require the maximum performance, perhaps where you're reading a thousand feeds per sectond. 

#### A coding example

Here's how you call the package.

const reallysimple = require ("reallysimple");

const url = "http://scripting.com/rss.xml";

reallysimple.readFeed (url, function (err, theFeed) {

if (!err) {

console.log ("theFeed == " + JSON.stringify (theFeed));

}

}):

Here's what shows up in the console when you run that code. 

#### What we build on

Thanks to Dan MacTough for the <a href="https://www.npmjs.com/package/feedparser">feedparser</a> package.

It also builds on the davefeedread package, which simplifies the programming interface to feedparser.

This package further simplifies the struct returned by <a href="https://www.npmjs.com/package/davefeedread">davefeedread</a>.

#### Work notes

3/7/22; 10:27:47 AM by DW

Start the reallysimple repo. Publish the NPM package. 

3/6/22; 11:27:52 AM by DW

It now understands various elements from the source namespace, including source:account, source:localtime and source:outline.

Started a new private GitHub repo for the project and saved the files. 

Added it to my NPM sub-menu, this is going to be a supported project.

#### Comments, questions?

Please post your comments and questions in the <a href="https://github.com/scripting/reallysimple/issues/new">issues section</a> of this repo.

