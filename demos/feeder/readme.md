# feeder

A Node server app that hooks the <a href="https://github.com/scripting/reallysimple">reallysimple</a> package up to the web.

### Why?

To provide service to <a href="http://drummer.scripting.com/">Drummer</a> and possibly other apps that run in the browser.

### Two calls

Two calls are supported: /returnjson and /returnopml. Both take a <i>url</i> parameter. 

http://feeder.scripting.com/returnjson?url=http://scripting.com/rss.xml 

* Returns a JSON structure containing the information in the feed, as processed by reallysimple. 

http://feeder.scripting.com/returnopml?url=http://scripting.com/rss.xml 

* Returns an OPML structure which you can insert into an outline, with all the items from the feed. 

These calls are used from <a href="http://drummer.scripting.com/">Drummer</a> to implement the <a href="http://docserver.scripting.com/?verb=rss.readFeed">rss.readFeed</a> verb and to allow <a href="https://www.youtube.com/watch?v=j7L1bvP0dQc">expanding of rss node types</a>. 

### Templates

You an also run the contents of a reallysimple query through a template, which is just a web page, which has the result of the query as a local object you can use JavaScript to render.

Here's the <a href="https://github.com/scripting/reallysimple/blob/main/demos/feeder/docs/templates.md">docs page</a> for templates. 

### Caveats

If you're deploying a real application, please run your own copy of this app. 

It's fine to use feeder.scripting.com for testing. 

### Questions or comments

Please respond in <a href="https://github.com/scripting/reallysimple/issues/1">this thread</a> on the reallysimple issues section. 

