# How feeder templates work

The basic function of <a href="https://github.com/scripting/feeder">feeder</a> is to provide an <a href="http://feeder.scripting.com/returnjson?feedurl=https%3A%2F%2Frss.nytimes.com%2Fservices%2Fxml%2Frss%2Fnyt%2FTheater.xml">HTTP interface</a> to the <a href="https://github.com/scripting/reallysimple">reallysimple</a> package, so you can access its functionality from a browser-based app without having to run a server. 

You can also run the contents of a reallysimple request through a template, which is just a web page, which has the result of the request as a local object you can use JavaScript to render.

This doc walks you through the Hello World template first, it's a tour of the basic features, and then the Titled Items template that works with the reallysimple object in code. 

### The Hello World template

This is the <a href="https://github.com/scripting/feeder/blob/main/templates/helloworld.html">template</a>.

This is how you invoke it:

<a href="http://feeder.scripting.com/?template=helloworld&feedurl=https://news.ycombinator.com/rss">http://feeder.scripting.com/?template=helloworld&feedurl=https://news.ycombinator.com/rss</a>

The template refers to 3 macros which are filled in by the feeder app serving it.

1. [%feedTitle%] -- the title of the feed, displayed in the &lt;title> element in the HTML.

2. [%config%] -- configuration info from the server, assigned to a local variable <i>config.</i>

3. [%feedJsonText%] -- the JSON object returned by the reallysimple package, assigned to a local variable, <i>theFeed.</i>

From there, the primary job of the template is to display and allow the user to interact with the contents of the feed, which is accessed locally through <i>theFeed,</i> which is just a JavaScript object. 

<i>config</i> is there mostly for the future, if there's information we might want to send to all templates from the server that's hosting the template. Initially it just has the name of the feeder app and its version. 

The Hello World app just displays what's in theFeed by stringifying it and assigning it to the <i>idFeedInfo</i> DOM object. 

### The Mailbox template

Here's the <a href="https://github.com/scripting/feeder/blob/main/templates/mailbox.html">template</a>.

It displays the contents in a feed in the common mailbox format used by readers such as Feedly and NetNewsWire. 

This is how you invoke it:

<a href="http://feeder.scripting.com/?template=mailbox&feedurl=https://johnnaughton.substack.com/feed">http://feeder.scripting.com/?template=mailbox&feedurl=https://johnnaughton.substack.com/feed</a>

The mailbox form works well with feeds with lots of titled longform posts, not so well with items that don't have titles, or are short.

### The Titled Items template

Here's the <a href="https://github.com/scripting/feeder/blob/main/templates/titleditems.html">template</a>.

This template <a href="http://scripting.com/images/2022/07/15/memexScreenFull.png">displays</a> items that have titles and links to their &lt;link> value, if it has one. 

This is how you invoke it:

<a href="http://feeder.scripting.com/?template=titleditems&feedurl=https://news.ycombinator.com/rss">http://feeder.scripting.com/?template=titleditems&feedurl=https://news.ycombinator.com/rss</a>

Here's the code that builds the list.

```JavaScriptfunction viewTitledItems () {	var htmltext = "";	function add (s) {		htmltext += s + "\n";		}	add ("<ul>"); 	theFeed.items.forEach (function (item) {		if (item.title !== undefined) {			var link = item.title;			if (item.link !== undefined) {				link = "<a href=\"" + item.link + "\">" + link + "</a>";				}			add ("<li>" + link + "</li>");			}		});	add ("</ul>"); 	return (htmltext);	}```

This is the punchline for the whole <a href="https://github.com/scripting/reallysimple">reallysimple</a> stack up to this point. The goal was to make using info from a feed as simple as working with a JavaScript object. At this point you have the full power of JavaScript and the web to work with the info in a feed. 

### The JSONify Feed template

Here's the <a href="https://github.com/scripting/feeder/blob/main/templates/jsonify.html">template</a>.

This is how you invoke it:

<a href="http://feeder.scripting.com/?template=jsonify&feedurl=http://scripting.com/rss.xml">http://feeder.scripting.com/?template=jsonify&feedurl=http://scripting.com/rss.xml</a>

It displays the JSONified feed in a nice Concord outline. The top level of the object is expanded. The list of items is collapsed. It's a fun way to browse the JSON that the <a href="https://github.com/scripting/reallysimple">reallysimple</a> package generates.

### Questions, comments

Please post an item in <a href="https://github.com/scripting/feeder/issues/2">this thread</a>. 

