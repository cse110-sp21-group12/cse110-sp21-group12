## 110 OH 5/3/21 Dustin:

## taking notes on what other ppl asked:


exploaratory coding, helping to de-risk and figure out things that work
- break down into some things we want to do, and implenet thigns (ex audio, impleneting pictures)
- gague how hard these things are, do we want to invest time in doing it


framing the project: (ex frame the house)
- perhaps frame and then fill-in
- skeleton out UI, 
- "walking skeleton" 
- fill in the blank
- create routes/pages first
- get some theme stlying going to use across all the pages
- look at creating boxes where things will go, setting up layouts 

watch out for creating too many "golf-swings" aka clicks
- don't want the user to click 10,000 things to get to writing a bullet 



## Dustin's question: How to deal with storing things? 

### broswer based ones:

[local sotrage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage): 
- basically like search history (domain-specific, gets cleared when you enter in a private window)
- aka web storage api
- stores in browser

[indexedDB api](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API): 
- more complex than local storage API, allows for more data to be stored
- stores data on the client side (on local disk), client can still delete it themselves
- stored in place such as "Dustin/storage" under firefox
- see bottom of page for beginner friendly wrapper we can use
- perhaps a good analogy could be like bookmarks?
	
	
*Still gotta look up which one to use, seems like indexDB is better?
*How do these things work on the phone?


### file system:
- read and write to files stored on local machine (ie text files) 


### Creating a "web-app" 
- wrapping it in things such as electron.js
- allows other things to be done? (not sure what exactlly)
-perhaps allows things such as cloud databases to connect easier.
	
### Cloud
- stright up just call a fetch/post request @ mongoDB
	

### whatever the case....
- lets abstract with save/read functions!
- we may want to change what we want to store (don't want to redefine the schemas)
- could start with creating json-objects and passing them around with arrays
	


