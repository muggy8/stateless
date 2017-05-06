## work in progress

#table of contents

stateless
-   [stateless](#stateless)
-   [.consume()](#statelessconsume)
-   [.register()](#statelessregister)
-   [.instantiate()](#statelessinstantiate)
-   [.each()](#statelesseach)

[Scope](#scope)
-   [.parent](#.parent)
-   [.children](#.children)
-   [.root](#.root)
-   [.element()](#.element())
-   [.elements()](#.elements())
-   [.on()](#.on())
-   [.off()](#.off())
-   [.once()](#.once())
-   [.hasClass()](#.hasClass())
-   [.addClass()](#.addClass())
-   [.removeClass()](#.removeClass())
-   [.attr()](#.attr())
-   [.css()](#.css())
-   [.data()](#.data())
-   [.html()](#.html())
-   [.include()](#.include())
-   [.property()](#.property())
-   [.define()](#.define())
-   [.append()](#.append())
-   [.appendChild()](#.appendChild())
-   [.unlink()](#.unlink())
-   [.render()](#.render())

HTMLElement
-   [.scope](#scope)

## Stateless
Usage:
```javascript
stateless[indexOrIdKey]
```

stateless is a global object and contains a list of all the templates that have been registered with the [.register()](#stateless.register) function and can be accessed via it's index. you however cannot remove an element from the registry once it has been registered. as such, all items in the stateless object is view only for debugging purposes

Example:
```javascript
stateless.register("<div>this is a div</div>")
stateless[0] // returns the the first item registereg in this case, the empty div as an HTMLElement object
```
## stateless.consume()
Usage:
```javascript
stateless.consume(htmlString)
stateless.consume(domElement)
```
Consume is the function that you use to add new elements to the stateless library that can be instantiated later. You can provide an html string or you can provide a html dom element. If you provide an html dom element, that element will be removed from the dom and added into the library. If you provide a string, that string will be converted into a html dom element while being added to the library.

If the element has an id attribute, that attribute is moved into the class attribute and is also made to be indexed by that id when instantiating or for indexing the stateless object.

Example:
```javascript
stateless.consume(`<input id="number-input" type="number">`)
var myDiv = document.createElement("div")
myDiv.id = "my-div"
stateless.consume(myDiv)
stateless.consume(document.querySelector("#element-id"))
```

## stateless.register()
This is an alias for [.consume()](#stateless.consume())

## stateless.instantiate()
Usage:
```javascript
stateless.instantiate(selectionIndex)
```

The instantiate function returns a Scope object that contains a copy of the html element which can be manipulated either directly or by the number of functions provided by the Scope object.

Example:
```javascript
var element = stateless.instantiate("my-element-id-attribute") //instantiates the item initiated with the id when registered
var otherElement = stateless.instantiate(0) //instantiates the first item to have been registered with stateless
```

## stateless.each()
Usage:
```javascript
stateless.each(callback)
```

The each function in stateless allows you to itterate through each item in the library. The function is a wrapper for the [forEach](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) function of standard javascript without the last property

Example:
```javascript
stateless.each(function(template, index){
	console.log(`template ${index} registered in stateless is:`, template)
})
```

## Scope
The Scope object is returned by the [instantiate()](#statelessinstantiate) function. This object contains a number of useful functions that you can use to manipulate the DOM element that is a part of the object. You can directly manipulate the DOM element that is attached to this object but often time, it's better to use the provided functions to do that. If there's a particular feature that you feel should be part of this object for manipulating the element feel free to (open an issue)[issues] or fork this project.

Functions implemented under Scope uses [querySelector()](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) and [querySelectorAll()](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) for selecting elements. However to disambiguate selectors from data values, any function that allows a selector to be passed into the function will require that you prefix the selector with the "$" character followed by 0 or more spaces before the actual selector string.

Please note as stated earlier, objects instantiated via the instantiate function is not automatically added to the page and you need to manually add it to the page via a another State object's [append() / appendChild()](#scopeappend) function or via this object's [render()](#scoperender) function. As such it is best to save a reference to this object so you can use it later.

Unless otherwise specified functions within the scope function will return the Scope object it belongs to when it has finished executing it's logic. As such you you can chain most Scope methods.

## Scope.element()
Usage:
```javascript
ScopeInstance.element()
ScopeInstance.element(selector)
```

The element function will return the HTML element that is associated with this instance of Scope. However you can use a selector to select an element that is a chiled of the scope element. If you do, that element is returned instead.

Example
```javaScript
// register an element
stateless.register(`
	<div id="image-gallery">
		<img src="1.jpg"/>
		<img src="2.jpg"/>
		<img src="3.jpg"/>
	</div>
`)

// extract the element for whatever reason
var gallery = stateless.instantiate("image-gallery"),
	galleryDiv = gallery.element(), // the root element
	galleryFirstImgTag = gallery.element("$img"), // the first img element
	galleryStillFirstImgTag = gallery.element("$img") // still the first img element
```
