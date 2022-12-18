# rssCloud server demo

A working example of a server-based feed reader implementation of rssCloud.

### A feed with a cloud element

This is a Node.js app that works with one feed that has a cloud element. <a href="http://feeder.scripting.com/returnjson?feedurl=http://scripting.com/rss.xml">Example.</a>

When it starts up, it reads the feed, sees if it has a cloud element, and if so it requests notification from the server specified in the cloud element. It tells the cloud server how to notifiy it. 

The cloud server calls back to verify that there's someone listening on the other end who understands the rssCloud protocol. 

We get the test message and send back the expected response and we're in the network, ready to receive notification about the feed with the cloud element.

### When a notification comes in

The notification will come in as a POST request that comes with one parameter in its body, the URL of the feed that updated.

We then read the feed, and do whatever we want with the info in the feed. 

We respond to the server with a string that it probably ignores. 

### Must be outside of firewalls

This server must be callable by servers on the net. You can't even run a test version locally without some tunneling. I

### A tour of the code

I've placed little "markers" in the code in comments

//1 -- config.thisServer is where I specify how the cloud server should call me by providing my domain, port and path. To run this app you will have to change these values.

//2 -- We log events into stats.events, if you want to see what's going on, that's a good place to watch.

//3 -- pleaseNotify is where we call the cloud server asking to be notified when the feed changes. 

//4 -- the feed you want to test is specified in config.defaultFeedUrl. It should be a feed you can update to cause a message to be sent to your copy of this app. I'm using a WordPress feed. They supprt rssCloud. 

//5 -- handlePing -- does nothing. This is where you'd read the feed, look for changed items, update your database, notify users, etc. 

//6 -- this is where we handle notification via POST requests.

//7 -- where we handle notification via GET requests.

### Comments, questions

I started a thread <a href="https://github.com/scripting/reallysimple/issues/12">here</a>. 

