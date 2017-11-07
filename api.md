## work in progress

#table of contents

stateless
-   [stateless](#stateless)
-   [.consume()](#statelessconsume)
-   [.register()](#statelessregister)
-   [.instantiate()](#statelessinstantiate)
-   [.each()](#statelesseach)
-   [.watch()](#statelesswatch)
-   [.emit()](#statelessemit)
-   [.plugin()](#statelessplugin)
-   [.view()](#statelessview)
-   [.build()](#statelessbuild)

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

The each function in stateless allows you to iterate through each item in the library. The function is a wrapper for the [forEach](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) function of standard javascript without the last property

Example:
```javascript
stateless.each(function(template, index){
	console.log(`template ${index} registered in stateless is:`, template)
})
```

## stateless.watch()
usage:
```javascript
statelsss.watch(customEventName, callback)
stateless.watch(callback)
```

The watch function lets you watch for specific "events" to be fired by something and then calls the function in the callback with an object that is passed by the event. If no data object is provided, then the callback is passed an empty object. The function returns another function that can be called to remove the listener that got added.

If you want to watch for all events emitted by the event system. you can call stateless.watch without an event name and if you do, the callback will be fired when all any event is triggered. This callback is called after all the appropriate named watchers resolve and is passed the event name as the first parameter and the event data as the second parameter instead of just the event data.

Because this function returns the unwatcher function, it goes without saying that this function is not chainable

Example:
```javascript
var stopWatching = stateless.watch("myEvent", function(data){ // this event will fire first
	if (data.prop === true){
		stopWatching()
		console.log("successfully watched an event till prop has been set to true")
	}
	else {
		console.log("This event is not the one we are looking for")
	}
})

var stopGlobalPeeker = statelss.watch(function(eventType, target){ // this event will fire second
	if (data.prop === true){
		stopGlobalPeeker()
		console.log("successfully watched an event till prop has been set to true")
	}
	else {
		console.log("This event is not the one we are looking for")
	}
})
```

## stateless.emit()
usage:
```javascript
statelss.emit(customEventName[, dataObject])
```

The emit function allows you to emit custom events that may or may not have watchers waiting for them. You may optionally attach objects to the events you send this way and will allow you to pass data to the callbacks.

Example:
```javascript
var stopWatching = stateless.watch("myEvent", function(data){
	if (data.prop === true){
		stopWatching()
		console.log("successfully watched an event till prop has been set to true")
	}
	else {
		console.log("This event is not the one we are looking for")
	}
})

var stopGlobalPeeker = statelss.watch(function(eventType, target){ // this event will fire second
	if (data.prop === true){
		stopGlobalPeeker()
		console.log("successfully watched an event till prop has been set to true")
	}
	else {
		console.log("This event is not the one we are looking for")
	}
})

stateless.emit("myEvent")
	.emit("myEvent")
	.emit("myEvent", {prop: false})
	.emit("yourEvent", {prop: true})
	.emit("myEvent", {prop: true})
```

## stateless.plugin()
Usage:
```javascript
stateless.plugin(pluginName, pluginValue)
stateless.plugin(pluginName)
```

The plugin function allows you to add Additional functionality (eg routing) to stateless that is otherwise not part of the standard package. you can override any part of the default functionalities (eg the each function) and add any Additional data or functionality. The default objects are tucked away in a inheritance tree and if you override a core functionality, it is still accessable via the prototype of the statelss object. You can optionally declare functions and values directly into stateless via `stateless.prop = someValue` however the top level statelss object is mostly reserved for template objects and you should avoid directly adding functionality to it. If your plugin shares a name with a template element, calling plugin without a value variable will allow you to get the plugin component associated to that name

Example:
```javascript
stateless.plugin("meaningOfLife", function(){
	console.log("the meaning of life is", 42)
	return 42
})
stateless.register(`<div id="meaningOfLife"></div>`)
stateless.plugin("meaningOfLife")()
```

## stateless.view()
usage:
```javascript
stateless.view(htmlElement)
stateless.view(templateString)
```

The view method allows you to construct scope objects directly from HTML elements / HTMLstring bypassing the need to register them. This is useful for building larger more complicated views that have multiple components and sub components but only one set of common methods (much like views and controllers in an MVC framework). This method will return the scope object created as if it was a stateless.register().instantiate() call without adding the item to the stateless template repository and thus, you cannot chain this method with any other stateless methods. That said you can choose to chain standsard Scope methods from here.

Example:
```javascript
var tr = document.createElement("tr")
tr.id = "tr"
var th = document.createElement("th")
th.id = "th"
var td = document.createElement("td")
td.id = "td"

stateless
	.register(tr)
	.register(th)
	.register(td)

var tableView = stateless
	.view(`
		<table>
			<thead>
				<tr></tr>
			</thead>
			<tbody>
			</tbody>
			<tfoot>
				<tr></tr>
			</tfoot>
		</table>
	`)
	.render()

var cols = 5
for(var i = 0; i < cols; i++){
	tableView.appendChild(
		"$ thead tr",
		stateless.instantiate("th")
			.html(i + "th head")
	)

	tableView.appendChild(
		"$ tfoot tr",
		stateless.instantiate("td")
			.html(i + "th foot")
	)
}

["a", "b", "c"].forEach(function(letter){
	var row;
	tableView.appendChild(
		"$ tbody",
		row = stateless.instantiate("tr")
	)

	for(var i = 0; i < cols; i++){
		row.appendChild(
			stateless.instantiate("td")
				.html(letter + " " + i)
		)
	}
})

```

## stateless.build()
This is an alias for [.view()](#stateless.view())

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
addClass adds a class to the root of the template or the selected elements uniquely meaning it will only add the class once. if you have a need to add the same class multiple times then you can specify multiple to be true.

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

gallery.elements("$img").forEach(function(element){
	if (gallery.css(element, "background-color")) return
	gallery.css(element, "background-color", "orange")
})
```

## Scope.data()
Usage:
```javascript
ScopeInstance.data(name)

ScopeInstance.data(selector, name)
ScopeInstance.data(ScopeInstance.element(), name)
ScopeInstance.data(ScopeInstance.elements(), name)

ScopeInstance.data(selector, name, value)
ScopeInstance.data(ScopeInstance.element(), name, value)
ScopeInstance.data(ScopeInstance.elements(), name, value)
```

the data function returns the data-* attribute found in the selected element or the root element of the template for the current Scope instance. If a value is defined, the function sets that value instead. This function uses the dataset variable so support may vary across different browsers.

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
	var clicks = gallery.data(ev.target, "clickTimes") || 0
	gallery.data(ev.target, "clickTimes", clicks +1)
})
```
## Scope.html()
Usage:
```javascript
ScopeInstance.html()
ScopeInstance.html(selector)
ScopeInstance.html(ScopeInstance.element())

ScopeInstance.html(innerHtmlText)
ScopeInstance.html(selector, innerHtmlText)
ScopeInstance.html(ScopeInstance.element(), innerHtmlText)
```

the html function returns the innerHTML of the selected element or the root element of the template if none selected. if a string is provided the string is inserted into that element's innerHTML instead.

Example:
```javascript
stateless.register(`
	<button id="btn"></button>
`)

var button = stateless.instantiate("btn")

button.html("Click me!")
```

## Scope.include()
Usage:
```javascript
ScopeInstance.include()
ScopeInstance.include(DOMelement)
ScopeInstance.include(selector, DOMelement)
ScopeInstance.include(ScopeInstance.element(), DOMelement)
```

the include function will include an html element into the current Scope instance as part of it's template. you will not be able to include parts of other Scopes with this function. If you need to append another Scope as a part of the current scope, us the [append](#scopeappend) or [appendChild](#scopeappendchild) functions. if include called with no arguments, then include will recursively add all elements that are not already a part of the current Scope instance (or a child Scope of the current Scope) but is part of the current scope's DOM hierarchy and add them to the appropriate Scope instance.

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

gallery.element().appendChild(document.createElement("img"))
gallery.include() // adds the newly created element to the gallery's scope

gallery.include(document.createElement("button")) // add a button to the gallery's scope
```

## Scope.property()
Usage:
```javascript
ScopeInstance.property(attribute, {static: value})
ScopeInstance.property(attribute, {get: getterFunction})
ScopeInstance.property(attribute, {get: getterFunction, set: setterFunction})
ScopeInstance.property(attribute, {asVar: value})
```

the property function sets a value with the scope using [Object.defineProperty](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty). many of the goals you would want to achieve with this function can also be done with ScopeInstance[property] = value however, that would require you to break the chain. you can also make a relatively simple 2 way data binding by using the getters and setters and binding variables to user input.

Additionally, the configuration object that you passed into the define function is accessible from any value functions within the object via the "this" keyword. Additionally, the Scope instance that is associated with that object is attached to the config object's "scope" parameter. This allows you to have private information that's only available to the defined function without making those values publicly accessible as a reference to the object is not publicly available. If this effect is not desirable use the "asVar" declaration as that allows you to use the function as a standard prototypal inheritance function. This is useful for situations where prototypal inheritance for recursive actions is useful.

Example:
```javascript
stateless.register(`<div id="color-box"></div>`)

var currentNode,
	divWidth = window.innerWidth

while( divWidth > 100) {
	var newNode = stateless.instantiate("color-box")
	if (currentNode) {
		currentNode.append(
			newNode
				.css("padding", "1.5em")
				.css("border", "solid 1px #888")
				.on("click", function(ev){
					newNode.selected = ev.target.scope
					ev.stopPropagation()
				})
		)
	}
	else {
		newNode.render()
	}
	currentNode = newNode
	divWidth = parseInt(newNode.css("width").replace("px", ""))
}

currentNode.root
	.define("color", {
		// function that if called from a scope, function's this parameter is always the scope that this function is called from
		asVar: function(rgb){
			this.children.forEach(function(childScope){
				childScope.color(rgb)
			})
			this.css("background-color", rgb)
		}
	})
	.define("selected", {
		// these getter and setters will always have a "this" value of the object that they are assigned in
		get: function(){
			return this.selection
		},
		set: function(targetScope){
			if (this.selection){
				this.selection.css("border", "solid 1px #888")
			}
			this.selection = targetScope.css("border", "solid 2px #000")
		}
	})
	.define("red", {
		// these getter and setters will always have a "this" value of the object that they are assigned in
		get: function(){
			return this.value
		},
		set: function(val){
			var scope = this.scope
			this.value = val
			scope.selected.color("rgb("+scope.red+", "+scope.green+", "+scope.blue+")")
		},
		value: 255
	})
	.define("green", {
		// these getter and setters will always have a "this" value of the object that they are assigned in
		get: function(){
			return this.value
		},
		set: function(val){
			var scope = this.scope
			this.value = val
			scope.selected.color("rgb("+scope.red+", "+scope.green+", "+scope.blue+")")
		},
		value: 255
	})
	.define("blue", {
		// these getter and setters will always have a "this" value of the object that they are assigned in
		get: function(){
			return this.value
		},
		set: function(val){
			var scope = this.scope
			this.value = val
			scope.selected.color("rgb("+scope.red+", "+scope.green+", "+scope.blue+")")
		},
		value: 255
	})
	.append(`<div>R:<input type="range" min="0" max="255" value="255" onmouseup="this.scope.red=this.value"></div>`)
	.append(`<div>G:<input type="range" min="0" max="255" value="255" onmouseup="this.scope.green=this.value"></div>`)
	.append(`<div>B:<input type="range" min="0" max="255" value="255" onmouseup="this.scope.blue=this.value"></div>`)
	.selected = currentNode.root.children[0] // set the default selected item to be the first child
```

## Scope.define()
an alias for [Scope.Property()](#scopeproperty)

## Scope.append()
Usage:
```javascript
ScopeInstance.append(AnotherScopeInstance)
ScopeInstance.append(selector, AnotherScopeInstance)
ScopeInstance.append(ScopeInstance.element(), AnotherScopeInstance)

ScopeInstance.append(htmlString)
ScopeInstance.append(selector, htmlString)
ScopeInstance.append(ScopeInstance.element(), htmlString)

ScopeInstance.append(DOMelement)
ScopeInstance.append(selector, DOMelement)
ScopeInstance.append(ScopeInstance.element(), DOMelement)

ScopeInstance.append(AnotherScopeInstance, beforeSelectorOrBeforeElement)
ScopeInstance.append(selector, AnotherScopeInstance, beforeSelectorOrBeforeElement)
ScopeInstance.append(ScopeInstance.element(), AnotherScopeInstance, beforeSelectorOrBeforeElement)

ScopeInstance.append(htmlString, beforeSelectorOrBeforeElement)
ScopeInstance.append(selector, htmlString, beforeSelectorOrBeforeElement)
ScopeInstance.append(ScopeInstance.element(), htmlString, beforeSelectorOrBeforeElement)

ScopeInstance.append(DOMelement, beforeSelectorOrBeforeElement)
ScopeInstance.append(selector, DOMelement, beforeSelectorOrBeforeElement)
ScopeInstance.append(ScopeInstance.element(), DOMelement, beforeSelectorOrBeforeElement)
```

General example:
```javascript
ScopeInstance.append([insertLocationSelectorOrInsertLocationElement, ]anotherScopeOrStringOrElement[, insertElementsBeforeSelectorOrElement])
```

The append function acts partly as an alias for include while also providing a method of adding another Scope instance as a child of the current Scope. When a Scope is added as a child of the current scope, the child scope will inherit via prototypal inheritance from the parent Scope from the javascript level. this means that if a parent has a function defined in it's scope, all child Scopes will have access to the function. This doesn't mean that event listeners are transferred over as those are attached to the element rather than the Javascript object.

When a element or an html string is provided the the object to append, the object is added to the Scope's template in the same way that [include()](#scopeinclude) adds an element to the selected target. If another scope is provided, that Scope is made a child of the current scope and the html elements that the appended Scope references is then added to the parent Scope's DOM Element's as the child of the selected element.

Example:
```javascript
stateless.register(`
	<div id="image-gallery">

	</div>
`)
stateless.register(`
	<div id="image">
		<img>
	</div>
`)
stateless.register(`<button id="btn">Like</button>`)

gallery = stateless.instantiate("image-gallery")
gallery.append("<span>Welcome to our gallery. Below are our pictures for you viewing</span>", )

;["1.jpg", "2.jpg", "3.jpg"].forEach(function(imgLink){
	gallery.append(
		stateless.instantiate("image"), // this returns a new Scope instance
		"$ span" // insert this scope before the span element.
	)
})

gallery.children.forEach(function(imageScope){
	if (imageScope.element("$ img")){
		imageScope.append(
			stateless.instantiate("btn")
				.on("click", function(ev){
					imageScope.addClass("$ img", "like")
				})
		)
	}
})
```

## Scope.appendChild()
alias for [append()](#scopeappend)

## Scope.unlink()
Usage:
```javascript
ScopeInstance.unlink()
```

The unlink function removes the Scope Instance from the tree and removes any inheritance based links as well as removes the DOM elements associated with the scope from the DOM. If the references to this object is preserved, then the element can be re-inserted at a later time.

Example:
```javascript
stateless.register(`
	<div id="image-gallery">

	</div>
`)
stateless.register(`
	<div id="image">
		<img>
	</div>
`)

gallery = stateless.instantiate("image-gallery")
gallery.append("<span>Welcome to our gallery. Below are our pictures for you viewing</span>")

;["1.jpg", "2.jpg", "3.jpg"].forEach(function(imgLink){
	gallery.append(
		stateless.instantiate("image") // this returns a new Scope instance
	)
})

gallery.children.forEach(function(imageScope){
	imageScope.on("click", function(ev){
		imageScope.unlink()
	})
})
```

## Scope.render()
Usage:
```javascript
ScopeInstance.render()
```

The render function inserts the Scope instance's DOM elements into the Body of the document.

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
	.render()
```
