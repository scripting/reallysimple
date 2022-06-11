I've been working on a new Node package meant to be the absolutely final top-level API for reading feeds in a Node.js app, and to serve as reference code for other platforms.

It takes all the history, in theory, and wraps it up into a concise, thoughtfully designed JavaScript object that makes no compromises to history. It won't reflect every feature in every feed out there. Make the job of using feeds as simple as it should be.

Considering that RSS 2.0 came out in September 2002, which is almost 20 years ago, and there hasn't been any activity in the community to try to fix these problems since feedparser came out, who can object if I try to simplify this making it possible to build on this foundation.

I also have a new feed reader built on top of this, that's not yet ready for testing. It handles titled and untitled posts, HTML styling, links, enclosures, unlimited length posts.

