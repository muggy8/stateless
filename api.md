## work in progress

#table of contents

stateless
-   [stateless](## stateless)
-   [.consume()](## stateless.consume())
-   [.register()](## stateless.register())
-   [.instantiate()](## stateless.instantiate())
-   [.each()](## stateless.each())

_scope
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

## Sateless
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

## sthteless.instantiate()
Usage:
```javascript
stateless.instantiate(selectionIndex)
```

The instantiate function returns a _scope object that contains a copy of the html element which can be mainpulated either directly or by the number of functions provided by the _scope object.

Example:
```javascript
var element = stateless.instantiate("my-element-id-attribute") //instantiates the item initiated with the id when regestered
var otherElement = stateless.instantiate(0) //instantiates the first item to have been registered with stateless
```

## statelssts.each()
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