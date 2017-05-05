# Stateless
Stateless is a Front-End javascript library for manipulating dom elements and attaching data values to them and psudo mimicing angular's two way data binding in a much simpler but less powerful way

## Goal
Ths goal of stateless is to put the model of an app into the view and make accessing that data easier. Because everyone is farmiliar with DOM manipulation, this makes it easier to edit and modify the app state without a some kind of external app stat that the app tries to reflect. 

Additionally the system also tries to force as few changes as it can on your already exsiting pipeline so you can feel free to use whatever syntax you want and stateless will handle what is asked of it. 

## Usage
To use stateless, all you have to do is include the stateless js build into your app with `<script src="path/to/stateless.js"></script>`

After you have adled stateless to your app, you need to add some elements into stateless's templato library. to do this you call either `stateless.import(templateUrl)`, `stateless.register(cssSelector)`, `stateless.register(htmlString)` or `stateless.register(domElement)`

your dom elements are then indexed in the stateless template library and if the root of the template elements has an ID attribute, that will be moved into the class attribute and will also be indexable via the string in the attribute. This is probably the easiest way of instantiating the template in the future so you may want to give all of your templates an ID,

The next step in building a dom out of the data is to instantiate the template element. Do this, we call `stateless.instantiate(templateIndex)` and this will reture an instantiated copy of the registered element. you are now free to do with it as you wish.

## Simple Example: