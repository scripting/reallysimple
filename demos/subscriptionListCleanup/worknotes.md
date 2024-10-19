#### 10/19/24; 11:24:25 AM by DW

I took a few hours to try to turn this into an HTTP server. I preserved the code in discuss.root, under today's archive. 

The problem was that it can take a long time, the way the timeouts are set, each time we hit a bad feed.

To fix all that, I'd have to dig into code that hasn't been touched in a long time. That's not my idea of a quick one day project. It could spiral into much more. 

So I punted. It was a nice idea, a utility that might have attracted exactly the kind of people I want to work with. 

I must get back to WordLand where I am very well dug in, and making good progress. 

#### 12/21/22; 8:51:20 AM by DW

Moved to the demos folder of the reallySimple repo. Want to build a nice collection for devs working with feeds.

#### 11/2/22; 10:31:40 AM by DW

Support command line arguments

#### 10/23/22; 11:27:38 AM by DW

Moved it to its own repo. It's generally useful, not just in using FeedLand. 

#### 8/5/22; 4:46:07 PM by DW

Wrote docs, removed an old config element. Moved to the feedlandSupport repo.

#### 5/17/22; 10:51:31 AM by DW

Started. Read an OPML subscription list, and loop over all the feeds and only pass on the ones that are reachable and parseable.

