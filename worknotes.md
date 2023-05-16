# Worknotes

#### 5/16/23 by DW -- v0.4.24

Believe it or not node-emoji of all things introduced a breaking change, so we have to hold at v1.11.0.

I'm not sure if this will get it to work, but emoji is a nice feature to have not a <i>required</i> feature. 

#### 3/22/23 by DW -- v0.4.23

Allow for the possibility that rss:guid elements might not have atttributes. I know it happens because when it does FeedLand crashes. ;-)

#### 11/11/22 by DW

<a href="http://scripting.com/2022/11/11.html#a141519">Hack alert</a>: We generate item-level link elements for items that don't have link elements. Explained <a href="http://scripting.com/2022/11/11.html#a141519">here</a>. This isn't my code that's doing it, it's a lower-level package that I'm using. I think it was copying an even older <a href="https://pythonhosted.org/feedparser/reference-entry-link.html">package</a>. Which did something they should not have done. 

#### 9/29/22 by DW -- v0.4.20

I did an update to the davefeedread package, but for some reason NPM isn't picking it up. So I changed the spec in package.json to specify the exact version or greater, to "force" it to use the correct version, I hope. 

#### 8/25/22 by DW -- v0.4.19

We now return the markdowntext for items that have the source:markdown element. 

We needed this because [app] strips markup from descriptions, by providing  markdowntext, we will have a way to regenerate it. The idea is that we can let through the styling that Markdown implements, it's harmless, where the garbage many feeds put in their text is intolerable. 

#### 7/18/22 by DW -- v0.4.17

If we see a source:markdown element, we generate the description by processing the markdown text.

#### 7/14/22 by DW -- v0.4.16

Created a new item-level value called permalink. Previously we were getting the permalink and overwriting the guid value. Which is all well and good if the guid is a permalink. It's possible it's not, as illustrated by <a href="http://xmlviewer.scripting.com/?url=http%3A%2F%2Fscripting.com%2Fuserfeeds%2Fdavewiner.xml">this feed</a>, where it's just an id, not a permalink, in which case we overwrite the guid with undefined. Not really good behavior. So now instead of doing that we copy it into the permalink value. 

#### 7/2/22 by DW -- v0.4.15

Added a new <i>reader</i> section to the returned object, containing information that's not from the feed, rather is about the feed reader software. The first element of this object is ctSecsToRead which is the number of seconds it took to read the feed. Also included the name of the reader app and version.

#### 6/23/22 by DW -- v0.4.11

New exported function reallySimple.setConfig.

Right now there is just one item in its config, timeoutSecs. 

We need to change it in the feeder app, and there may be other config elements to change in the future, so let's do this right. 

Also change the default from 3 to 10.

#### 6/20/22 by DW -- v0.4.10

Fixed a syntax error on the first line of reallysimple.js, changing a semicolon to a comma. 

Oddly, this is not seen as a syntax error in my Node, whereas Scott's is reporting an error.

It's not good syntax no matter what. :smile:

#### 6/15/22 by DW -- v0.4.9

If a feed has an &lt;atom:link> head-level element with rel="self", we add a head-level linkToSelf value with its value. 

A <a href="http://scripting.com/2022/06/15.html#a163715">blog post</a> on this addition. 

#### 6/12/22 by DW

<a href="https://github.com/scripting/feeder">Feeder</a> is a server app that connects to the <a href="https://github.com/scripting/reallysimple">reallysimple</a> package via the web. 

#### 6/11/22 by DW -- v0.4.8

Announced on <a href="http://scripting.com/2022/06/11.html#a193356">Scripting News</a> and <a href="https://twitter.com/davewiner/status/1535708039621353472">Twitter</a>. 

If the cloud element exists but is empty, delete it. 

Only allow url, type and length properties in enclosure objects.

Don't pass through enclosure properties whose value is null. 

#### 6/5/22 by DW

Put together the <a href="http://reallysimple.org/twentyYearsAgo.opml">notes</a> on how RSS 0.94 became RSS 2.0 in the summer of 2002.

Added a menubar to the reallysimple.org website, to organize the various projects.

#### 5/17/22 by DW

If an object is undefined there's no need to delete it.

#### 4/7/22 by DW

Clean up the readme file. Simplify the example app. Review docs. Start to invite collaborators to the repo, still private.

#### 3/21/22 by DW

Reviewing the way we represent links in items in the API. 

The question is this -- how can we get a link to the item from the item. 

The answer, on reflection -- rely on the link element as the permalink. 

#### 3/7/22 by DW

Start the reallysimple repo. Publish the NPM package. 

#### 3/6/22 by DW

It now understands various elements from the source namespace, including source:account, source:localtime and source:outline.

Started a new private GitHub repo for the project and saved the files. 

Added it to my NPM sub-menu, this is going to be a supported project.

