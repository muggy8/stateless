## work in progress

#table of contents

stateless
-   [stateless](#stateless)
-   [.consume()](#stateless.consume())
-   [.register()](#stateless.register())
-   [.each()](#stateless.each())

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
```