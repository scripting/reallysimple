# rssCloudServer demo

Suppose you're writing a server-based feed reader database. 

If you see a cloud element in the feed, what do you do with it? 

There are docs to help you, but to be sure you understand it's always good to have simple clear example code that works.

This is a Node.js app that works with one feed that has a cloud element. 

Every hour it registers with the hub for the feed, per the rssCloud protocol.

It waits for notification of updates. 

All these events are logged in a stats.json file in the local folder.

Should make it faster and easier to create a working rssCloud implementation. 

More docs to come.

12/16/22; 5:42:50 PM by DW

