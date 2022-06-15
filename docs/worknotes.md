# Worknotes

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

