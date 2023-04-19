4/19/23; 9:36:56 AM by DW

New call -- /returnlinkblog

An example --

http://feeder.scripting.com/returnlinkblog?feedurl=http://data.feedland.org/feeds/davewiner.xml

We return the HTML text you'd display if you wanted to display the links for the current day, as we do in the nightly email.

I needed a place to test this code before including it in the server app. 

Increasingly that's a role the feeder app is taking on. A nice development testbed for feed renderings built on the reallysimple package. 

#### 4/7/23; 10:00:28 AM by DW

Return text/plain with  charset=utf-8.

#### 3/29/23; 12:36:50 PM by DW

Add /returnmarkdown endpoint.

#### 7/15/22; 9:41:22 AM by DW

Included the <a href="https://github.com/scripting/feeder/blob/main/templates/mailbox.html">mailbox template</a>, also <a href="https://github.com/scripting/feeder/blob/main/docs/templates.md#the-mailbox-template">documented</a> it.

#### 6/23/22; 11:38:44 AM by DW -- v0.4.10 

A new template, jsonify.

Two new values returned in serverConfig -- 

feedUrl -- the url of the feed we're asking you to render

ctSecs -- how many seconds it took to read the feed

#### 6/22/22; 10:19:39 AM by DW -- v0.4.8

Mopping up, fixing little things. Today's project is to write docs for the Hello World template. 

#### 6/21/22; 11:32:20 AM by DW-- v0.4.7

the helloworld template

it's in the templates folder

here's how you access it

<a href="http://feeder.scripting.com/?template=helloworld&feedurl=http%3A%2F%2Fscripting.com%2Frss.xml">http://feeder.scripting.com/?template=helloworld&feedurl=http%3A%2F%2Fscripting.com%2Frss.xml</a>

have a look at the template source.

i made it as simple as possible, but I did use jQuery. It wasn't worth the time imho to figure out how to not use jQuery. ;-)

The next step is to do a bit of docs. Need a fresh start for that. 

And then I want to get some people reviewing this stuff. I don't want all the suggestions to come two months from now. 

We still have a lot of ground to cover, this is just the beginning.

#### 6/20/22; 12:21:34 PM by DW -- v0.4.6

feeder now supports templates, so it's easy to add a new way to view a feed. 

here's an example. I implemented the mailbox viewer as a template, it was previously a built-in command.

<a href="http://feeder.scripting.com/?template=mailbox&url=https://fallows.substack.com/feed">http://feeder.scripting.com/?template=mailbox&url=https://fallows.substack.com/feed</a>

there's a viewers subfolder, to add a template named hello, you'd add a file hello.html to the folder.

before serving the text, we do some macro substitutions, with the title of the feed, the name and version number of the feeder app, and most important, a JSON structure with the contents of the feed as produced by the reallysimple package. 

next step -- write a hello world template and document it. this will be clearer when that's provided.

still feeder is just a testbed. these templates will become applications in their own right. 

#### 6/13/22; 12:06:18 PM by DW -- v0.4.5

Include the charset in the content-type header when returning JSON and XML. 

#### 6/12/22; 6:56:43 PM by DW -- v0.4.4

We now keep a stats.json file, with info on number of reads, errors, and reads per feed.

#### 6/12/22; 9:52:26 AM by DW

I need this functionality for the reallysimple project. 

This predates the package, it's basically where it was developed.

So I rewrote it to use the package. 

