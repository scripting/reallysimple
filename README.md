# reallysimple

Reads an RSS-like feed and calls back with a JavaScript structure, hiding all the history.

#### Why?

If it's easier to use RSS, more people will use it. If programmers can quickly put together an app that uses RSS, people will try out more ideas, add RSS support to more apps. I see this as a good thing.

I also want to include RSS verbs in a scripting language I'm working on. For scripting, simplicity is everything. 

There probably is a small tradeoff in performance, you can probably write faster code by going straight to the feedparser level. And that's fine for applications that require the maximum performance, perhaps where you're reading a thousand feeds per sectond. 

#### An example

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

Thanks to Dan MacTough for the feedparser package which we build on.

It also builds on the davefeedread package, which simplifies the programming interface to feedparser, and returns the same complicated structure returned by feedparser. 

#### Work notes

3/7/22; 10:27:47 AM by DW

Start the reallysimple repo. Publish the NPM package. 

3/6/22; 11:27:52 AM by DW

It now understands various elements from the source namespace, including source:account, source:localtime and source:outline.

Started a new private GitHub repo for the project and saved the files. 

Added it to my NPM sub-menu, this is going to be a supported project.

#### Comments, questions?

Please post your comments and questions in the <a href="https://github.com/scripting/reallysimple/issues/new">issues section</a> of this repo.

