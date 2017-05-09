## work in progress

#table of contents

stateless
-   [stateless](#stateless)
-   [.consume()](#statelessconsume)
-   [.register()](#statelessregister)
-   [.instantiate()](#statelessinstantiate)
-   [.each()](#statelesseach)

[Scope](#scope)
-   [.parent](#scopeparent)
-   [.children](#scopechildren)
-   [.root](#scoperoot)
-   [.element()](#scopeelement)
-   [.elements()](#scopeelements)
-   [.on()](#scopeon)
-   [.off()](#scopeoff)
-   [.once()](#scopeonce)
-   [.hasClass()](#scopehasClass)
-   [.addClass()](#scopeaddClass)
-   [.removeClass()](#scoperemoveClass)
-   [.attr()](#scopeattr)
-   [.css()](#scopecss)
-   [.data()](#scopedata)
-   [.html()](#scopehtml)
-   [.include()](#scopeinclude)
-   [.property()](#scopeproperty)
-   [.define()](#scopedefine)
-   [.append()](#scopeappend)
-   [.appendChild()](#scopeappendChild)
-   [.unlink()](#scopeunlink)
-   [.render()](#scoperender)

HTMLElement
-   [.scope](#elementscope)

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
The Scope object is returned by the [instantiate()](#statelessinstantiate) function. This object contains a number of useful functions that you can use to manipulate the DOM element that is a part of the object. You can directly manipulate the DOM element that is attached to this object but often time, it's better to use the provided functions to do that. If there's a particular feature that you feel should be part of this object for manipulating the element feel free to open an issue or fork this project.

Functions implemented under Scope uses [querySelector()](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) and [querySelectorAll()](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) for selecting elements. However to disambiguate selectors from data values, any function that allows a selector to be passed into the function will require that you prefix the selector with the "$" character followed by 0 or more spaces before the actual selector string.

Please note as stated earlier, objects instantiated via the instantiate function is not automatically added to the page and you need to manually add it to the page via a another State object's [append() / appendChild()](#scopeappend) function as long as said other State object is already in the DOM or via this object's [render()](#scoperender) function. As such it is best to save a reference to this object so you can use it later. Scopes that are attached to other scopes inherit via prototype inheritance from the scope that parents the current scope. as such any method and properties uniquely available to a parent's scope is also available in a child scope.

Unless otherwise specified functions within the scope function will return the Scope object it belongs to when it has finished executing it's logic. As such you you can chain most Scope methods.

## Scope.parent
Usage:
```javascript
ScopeInstance.parent
```

The parent property references the ScopeInstance that is a parent to the current ScopeInstance. If there's no parent ScopeInstance then this value will hold the value of undefined.

## Scope.children
Usage:
```javascript
ScopeInstance.children
```

The children property is an array of the ScopeInstance that is a child to the current ScopeInstance. If there's no children ScopeInstance then this value will be an empty array.


## Scope.root
Usage:
```javascript
ScopeInstance.root
```

The root property references the ScopeInstance that is at the root to the current ScopeInstance parent-child tree. If the current ScopeInstance is the root then this property will hold a reference to itself.

## Scope.element()
Usage:
```javascript
ScopeInstance.element()
ScopeInstance.element(selector)
```

The element function will return the HTML element that is associated with this instance of Scope. However you can use a selector to select an element that is a child of the scope element. If you do, that element is returned instead.

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

## Scope.elements()
Usage:
```javascript
ScopeInstance.elements()
ScopeInstance.elements(selector)
```

The elements function will return an array of elements that belong to the current scope in one of two ways. If the function is called without any selectors it will return all elements including the root element of the object. However, it will not return any elements that belong to a Scope that's not the current scope. Passing a selector to the function will bypass this limitation and the returned array will include any and all matching HTML elements even those that belong to a differed Scope but is a child of the root element.

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

stateless.register(`
	<img id="random-image" src="./random"/>
`)

// extract the element for whatever reason
var gallery = stateless.instantiate("image-gallery")
var randomImage = stateless.instantiate("random-image")

gallery.append(randomImage)

var allGalleryElements = gallery.elements() // this will not include `<img id="random-image" src="./random"/>`
var allImageTags = gallery.elements("$img") // this will include `<img id="random-image" src="./random"/>`
var allElements = gallery.elements("$*").unshift(gallery.element()) // the * selector will select everything including elements belonging to Scope objects that are a child and you can append on the root element after with unshift
```

## Scope.on()
Usage
```javascript
ScopeInstance.on(type, callback)
ScopeInstance.on(selector, type, callback)
ScopeInstance.on(ScopeInstance.element(), type, callback)
ScopeInstance.on(ScopeInstance.elements(), type, callback)
```

The on function attaches an event listener to the HTML element that is at the root of the template or if a selector, child element or array of child elements are selected, to the selected element. this callback is directly attached to the HTML element in question via [addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) and the callback should be specified accordingly. the options parameter is not available. The callback is saved internally for validation with the (.off)[#scopeoff] function.

Example:
```javascript
stateless.register(`
	<div id="image-gallery">
		<img src="1.jpg"/>
		<img src="2.jpg"/>
		<img src="3.jpg"/>
	</div>
`)

var gallery = stateless.instantiate("image-gallery")
gallery.on("$img", "click", function(ev){
	document.lcoation.href = ev.target.getAttribute("src")
})
gallery.on(gallery.elements(), "mouseenter", function(){
	gallery.css("border", "solid 1px #000")
})
gallery.on("mouseout", function(){
	gallery.css("border", "none")
})
```

## Scope.off()
Usage
```javascript
ScopeInstance.off(type, callback)
ScopeInstance.off(selector, type, callback)
ScopeInstance.off(ScopeInstance.element(), type, callback)
ScopeInstance.off(ScopeInstaice.elements(), type, callback)
```

The off function attaches an event listener to the HTML element that is at the root of the template or if a selector, child element or array of child elements are selected, to the selected element. this callback is directly attached to the HTML element in question via [removeEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener) and the callback should be specified accordingly. the options parameter is not available. It will match the callback to the saved callback list and remove the callback accordingly to deal with anonymous functions. If you intend to remove the callback, please use a reference function instead of declaring it on the spot.

Example:
```javascript
stateless.register(`
	<div id="my-div">Meow</div>
`)
stateless.register(`
	<button id="btn"></button>
`)

var divScope = stateless.instantiate("my-div")

var appendTimes = 0,
	addBtnToDiv3Times = function(){
		divScope.append(stateless.instantiate("btn"))
		appendTimes++
		if (appendTimes <= 0){
			divScope.off("click", addBtnToDiv3Times)
		}
	}

divScope.on("click", addBtnToDiv3Times)
```


## Scope.once()
Usage
```javascript
ScopeInstance.once(type, callback)
ScopeInstance.once(selector, type, callback)
ScopeInstance.once(ScopeInstance.element(), type, callback)
ScopeInstance.once(ScopeInstance.elements(), type, callback)
```

The once function attaches an event listener to the HTML element that is at the root of the template or if a selector, child element or array of child elements are selected, to the selected element. This callback is modified wrapped by a function that calls the [off](#scopeoff) function on execute and the callback is added to the target via the [on](#scopeon) function. As such, you cannot remove a event listener attached via once with the [off](scopeoff) function

Example:
```javascript
stateless.register(`
	<button id="btn"></button>
`)

var btn = stateless.instantiate("btn")
	.html("sudo")
	.once("click", function(){
		alert("what you are about to do is potentially dangerous. You have been warned")
	})
```

## Scope.hasClass()
Usage:
```javascript
ScopeInstance.hasClass("class")
ScopeInstance.hasClass(selector, "class")
ScopeInstance.hasClass(ScopeInstance.element(), "class")
```

returns true or false based on if the selected element (or base element if no element selected) has the specified class

Example
```javascript
stateless.register(`
	<div id="image-gallery">
		<img src="1.jpg"/>
		<img src="2.jpg" class="middle"/>
		<img src="3.jpg"/>
	</div>
`)

var gallery = stateless.instantiate("image-gallery")

gallery.hasClass("image-gallery") // true
gallery.hasClass("$img", "middle") // false
gallery.elements("$img").forEach(function(imgEle){
	console.log(gallery.hasClass(imgEle, "middle"))
}) // false, true, false
```

## Scope.addClass()
Usage:
```javascript
ScopeInstance.addClass("class")
ScopeInstance.addClass("class", multiple)

ScopeInstance.addClass(selector, "class")
ScopeInstance.addClass(selector, "class", multiple)

ScopeInstance.addClass(ScopeInstance.element(), "class")
ScopeInstance.addClass(ScopeInstance.element(), "class", multiple)

ScopeInstance.addClass(ScopeInstance.elements(), "class")
ScopeInstance.addClass(ScopeInstance.elements(), "class", multiple)
```
addclass adds a class to the root of the template or the selected elements uniquely meaning it will only add the class once. if you have a need to add the same class multiple times then you can specify multiple to be true.

Example:
```javascript
stateless.register(`
	<div id="image-gallery">
		<img src="1.jpg"/>
		<img src="2.jpg" class="middle"/>
		<img src="3.jpg"/>
	</div>
`)

var gallery = stateless.instantiate("image-gallery")

gallery.on("$img", "click", function(ev){
	gallery.addClass(ev.target, "favorite")
})

gallery.on("click", function(ev){
	gallery.addClass("intrest", true)

	setTimeout(function(){
		gallery.removeClass("intrest")
	}, 1000)
})
```

## Scope.removeClass()
Usage:
```javascript
ScopeInstance.removeClass("class")
ScopeInstance.removeClass("class", multiple)

ScopeInstance.removeClass(selector, "class")
ScopeInstance.removeClass(selector, "class", multiple)

ScopeInstance.removeClass(ScopeInstance.element(), "class")
ScopeInstance.removeClass(ScopeInstance.element(), "class", multiple)

ScopeInstance.removeClass(ScopeInstance.elements(), "class")
ScopeInstance.removeClass(ScopeInstance.elements(), "class", multiple)
```
removeClass removes one instance of a class to the root of the template or the selected elements. If you want to remove all instance of a class from the selected elements you can declare multiple to be true and all instances of the class will be removed from the target elements

Example:
```javascript
stateless.register(`
	<div id="image-gallery">
		<img src="1.jpg"/>
		<img src="2.jpg" class="middle"/>
		<img src="3.jpg"/>
	</div>
`)

var gallery = stateless.instantiate("image-gallery")

gallery.removeClass("$img", "middle")

gallery.on("click", function(){
	gallery
		.addClass("animating")
		.addClass("expand")

	gallery.once("transitionend", function(){
		gallery.removeClass("animating")
	})
})
```

## Scope.attr()
Usage:
```javascript
ScopeInstance.attr(attribute)
ScopeInstance.attr(attribute, value)

ScopeInstance.attr(selector, attribute)
ScopeInstance.attr(ScopeInstance.element(), attribute)
ScopeInstance.attr(ScopeInstance.elements(), attribute)

ScopeInstance.attr(selector, attribute, value)
ScopeInstance.attr(ScopeInstance.element(), attribute, value)
ScopeInstance.attr(ScopeInstance.elements(), attribute, value)
```

the attr function returns the attribute of the selected element(s) or sets it if a value is provided. 

Example:
```javascript
stateless.register(`
	<div id="image-gallery">
		<img src="1.jpg"/>
		<img src="2.jpg" class="middle"/>
		<img src="3.jpg"/>
	</div>
`)

var gallery = stateless.instantiate("image-gallery")

gallery.attr("title", "image gallery")
gallery.elements("$ img").forEach(function(element, index){
	if (gallery.attr(element, alt)) return // do not overwrite existing alts
	gallery.attr(element, "alt", `image number ${index + 1}`)
})
```

## Scope.css()
Usage:
```javascript
ScopeInstance.css(styleName)
ScopeInstance.css(styleName, value)

ScopeInstance.css(selector, styleName)
ScopeInstance.css(ScopeInstance.element(), styleName)
ScopeInstance.css(ScopeInstance.elements(), styleName)

ScopeInstance.css(selector, styleName, value)
ScopeInstance.css(ScopeInstance.element(), styleName, value)
ScopeInstance.css(ScopeInstance.elements(), styleName, value)
```

the css function returns the value of the style property of the requested element or the root element of the template using [getComputeStyles](https://developer.mozilla.org/en/docs/Web/API/Window/getComputedStyle). if a value is defined, it will instead set that value to the chosen rule using setAttribute.

Usage: 
```javascript
stateless.register(`
	<div id="image-gallery">
		<img src="1.jpg"/>
		<img src="2.jpg" class="middle"/>
		<img src="3.jpg"/>
	</div>
`)

var gallery = stateless.instantiate("image-gallery")

gallery.elements("$img").forEach(function(element){
	if (gallery.css(element, "background-color")) return
	gallery.css(element, "background-color", "orange")
})
```

## Scope.data()

## Scope.html()

## Scope.include()

## Scope.property()

## Scope.define()

## Scope.append()

## Scope.appendChild()

## Scope.unlink()

## Scope.render()
