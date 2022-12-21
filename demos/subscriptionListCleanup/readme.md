# subscriptionListCleanup

A Node app that reads an OPML subscription list, and loop over all the feeds and only pass on the ones that are reachable and parseable.

#### Who it's for

You have to be a JavaScript programmer to use it. 

#### How to use

You can run the app without command line arguments or with. 

Without them, it reads the file specified by config.urlSource, which you can of course change. 

With command line arguments, you can specify whether you want to read from a file or over the web, and which file or URL you want to read. 

Here are three examples that illustrate:

2. node subscriptionlistcleanup.js -f mlb.opml 

3. node subscriptionlistcleanup.js -u http://scripting.com/code/subscriptionlistcleanup/mlb.opml

1. node subscriptionlistcleanup.js

In all cases it will create a file in the data sub-folder with the same name as the original file that contains only the feeds it was able to read and correctly parse as a feed.

#### Why?

I had a lot of OPML subscription lists from previous feed reading apps, and I wanted to speed up the process of getting them into my FeedLand database, and keep the no longer functional ones out of the database. 

#### Possible mods

It's probably a good idea to look at the OPML file it generates in Drummer, because some of the feeds, while they may be valid RSS, Atom or RDF, haven't been updated in a long time. Alternatively you could make this app smarter by checking the result from reallysimple.readFeed and seeing how long it' has been since there's been a new item, and not passing it of if it's been too long. 

#### Comments, questions

Post them <a href="https://github.com/scripting/subscriptionListCleanup/issues/1">here.</a>

