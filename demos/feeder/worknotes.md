* <a name="a0"></a>7/15/22; 9:41:22 AM by DW <a href="#a0">#</a>
   * <a name="a1"></a>Included the <a href="https://github.com/scripting/feeder/blob/main/templates/mailbox.html">mailbox template</a>, also <a href="https://github.com/scripting/feeder/blob/main/docs/templates.md#the-mailbox-template">documented</a> it. <a href="#a1">#</a>
* <a name="a2"></a>6/23/22; 11:38:44 AM by DW -- v0.4.10  <a href="#a2">#</a>
   * <a name="a3"></a>A new template, jsonify. <a href="#a3">#</a>
   * <a name="a4"></a>Two new values returned in serverConfig --  <a href="#a4">#</a>
      * <a name="a5"></a>feedUrl -- the url of the feed we're asking you to render <a href="#a5">#</a>
      * <a name="a6"></a>ctSecs -- how many seconds it took to read the feed <a href="#a6">#</a>
* <a name="a7"></a>6/23/22; 9:55:17 AM by DW -- v0.4.9 <a href="#a7">#</a>
   * <a name="a8"></a>We weren't checking for errors when rendering through a template, so if a server was responding too slowly the process would continue as if we had the feed structure, but we don't, and it would crash.  <a href="#a8">#</a>
* <a name="a9"></a>6/22/22; 10:19:39 AM by DW -- v0.4.8 <a href="#a9">#</a>
   * <a name="a10"></a>Mopping up, fixing little things. Today's project is to write docs for the Hello World template.  <a href="#a10">#</a>
* <a name="a11"></a>6/21/22; 11:32:20 AM by DW-- v0.4.7 <a href="#a11">#</a>
   * <a name="a12"></a>the helloworld template <a href="#a12">#</a>
      * <a name="a13"></a>it's in the templates folder <a href="#a13">#</a>
      * <a name="a14"></a>here's how you access it <a href="#a14">#</a>
         * <a name="a15"></a><a href="http://feeder.scripting.com/?template=helloworld&feedurl=http%3A%2F%2Fscripting.com%2Frss.xml">http://feeder.scripting.com/?template=helloworld&feedurl=http%3A%2F%2Fscripting.com%2Frss.xml</a> <a href="#a15">#</a>
      * <a name="a16"></a>have a look at the template source. <a href="#a16">#</a>
      * <a name="a17"></a>i made it as simple as possible, but I did use jQuery. It wasn't worth the time imho to figure out how to not use jQuery. ;-) <a href="#a17">#</a>
      * <a name="a18"></a>The next step is to do a bit of docs. Need a fresh start for that.  <a href="#a18">#</a>
      * <a name="a19"></a>And then I want to get some people reviewing this stuff. I don't want all the suggestions to come two months from now.  <a href="#a19">#</a>
      * <a name="a20"></a>We still have a lot of ground to cover, this is just the beginning. <a href="#a20">#</a>
* <a name="a21"></a>6/20/22; 12:21:34 PM by DW -- v0.4.6 <a href="#a21">#</a>
   * <a name="a22"></a>feeder now supports templates, so it's easy to add a new way to view a feed.  <a href="#a22">#</a>
   * <a name="a23"></a>here's an example. I implemented the mailbox viewer as a template, it was previously a built-in command. <a href="#a23">#</a>
      * <a name="a24"></a><a href="http://feeder.scripting.com/?template=mailbox&url=https://fallows.substack.com/feed">http://feeder.scripting.com/?template=mailbox&url=https://fallows.substack.com/feed</a> <a href="#a24">#</a>
   * <a name="a25"></a>there's a viewers subfolder, to add a template named hello, you'd add a file hello.html to the folder. <a href="#a25">#</a>
   * <a name="a26"></a>before serving the text, we do some macro substitutions, with the title of the feed, the name and version number of the feeder app, and most important, a JSON structure with the contents of the feed as produced by the reallysimple package.  <a href="#a26">#</a>
   * <a name="a27"></a>next step -- write a hello world template and document it. this will be clearer when that's provided. <a href="#a27">#</a>
   * <a name="a28"></a>still feeder is just a testbed. these templates will become applications in their own right.  <a href="#a28">#</a>
* <a name="a29"></a>6/13/22; 12:06:18 PM by DW -- v0.4.5 <a href="#a29">#</a>
   * <a name="a30"></a>Include the charset in the content-type header when returning JSON and XML.  <a href="#a30">#</a>
* <a name="a31"></a>6/12/22; 6:56:43 PM by DW -- v0.4.4 <a href="#a31">#</a>
   * <a name="a32"></a>We now keep a stats.json file, with info on number of reads, errors, and reads per feed. <a href="#a32">#</a>
* <a name="a33"></a>6/12/22; 9:52:26 AM by DW <a href="#a33">#</a>
   * <a name="a34"></a>I need this functionality for the reallysimple project.  <a href="#a34">#</a>
   * <a name="a35"></a>This predates the package, it's basically where it was developed. <a href="#a35">#</a>
   * <a name="a36"></a>So I rewrote it to use the package.  <a href="#a36">#</a>
