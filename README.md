# Stateless
Stateless is a Front-End javascript library for manipulating dom elements and attaching data values to them and pseudo mimicking angular's two way data binding in a much simpler but less powerful way

## Goal
The goal of stateless is to put the model of an app into the view and make accessing that data easier. Because everyone is familiar with DOM manipulation, this makes it easier to edit and modify the app state without a some kind of external app stat that the app tries to reflect.

Additionally the system also tries to force as few changes as it can on your already existing pipeline so you can feel free to use whatever syntax you want and stateless will handle what is asked of it.

## Usage
To use stateless, all you have to do is include the stateless js build into your app with `<script src="path/to/stateless.js"></script>`

After you have added stateless to your app, you need to add some elements into stateless's template library. to do this you call either `stateless.register(htmlString)` or `stateless.register(domElement)`.

your dom element templates are then indexed in the stateless template library and if the root of the template elements has an ID attribute, that will be moved into the class attribute and will also be indexable via the string in the attribute. This is probably the easiest way of instantiating the template in the future so you may want to give all of your templates an ID,

The next step in building a dom out of the data is to instantiate the template element. Do this, we call `stateless.instantiate(templateIndex)` and this will return an instantiated copy of the registered element. you are now free to do with it as you wish.

Alternatively you can use `stateless.view` to build the main views before manipulating them later.

## Simple Example Explnanation:
For a better understanding of the framework. lets take a look at the example and find out more about it. Feel free to open [example.html](./example.html) in a new tab or view it in [jsFiddle](https://jsfiddle.net/ks6e2ade/) and lets continue

First at the top we have some styles that we'll get into later but bare with me here trust me on these and keep them in mind as we will likely need them later. Lets by looking below at our first lines of javascript
```javascript
stateless
	.register("<div id='block'></div>")
	.register("<button id='btn' onclick='this.scope.execute(this.scope.command)'></button>")
```
This line is pretty easy to understand. we register 2 elements. a generic button element and a generic div element. Notice however that first off, they both have an id attribute and second, notice how the button has an onclick function and it is calling "this.scope.execute" and passing in the parameters `this.scope.command`

Each HTML element that is instantiated with stateless will have a scope attribute and that attribute points towards the toolkit that is returned when `stateless.instantiate` is called and is reffered to as the "scope". This scope object will inherit from it's parent via prototypal inheritance (more about this later). Now that we have setted up some templates, lets instantiate something and put it into the view

```javascript
var calculator = stateless.instantiate("block")
	.render()
	.addClass("calc-body")
```

 seems normal... wait what's that .render()? You see when you instantiate a template, you dont actually render it to the view. the `.render()` function will insert the element into the `body` element of the page. and we of course add a "calc-body" class to our nice div. next up,

```javascript
.define("execute", {
	static: function(fn){
		return fn()
	}
})
```

right here we are of course continuing our javascript chain as per normal but what does the define function do? well in this case it acts very much like the the "=" operator in javascript and assigns a value to the scope it's called on. however it gives you a bit more control over how you want to define your variables since it can also be used to define get and set methods so your variables can be change / updated via variable = value. continuing along we have our first append call followed by another define

```javascript
.append(
	stateless.instantiate("block")
		.addClass("screen")
).define("display", {
	get: function(){
		return calculator.html("$ .block.screen") || ""
	},
	set: function(input){
		calculator.html("$ .block.screen", input.toString())
	}
})
```

the append call will append the chiled scope to the current scope which is created on the spot via the `stateless.instantiate()` call. this time, the display function seems a bit differet. instead of defining a function, we are defining a getter and a setter. this effectively turns the display property. You'll notice that the function .html's first parameter is almost like a CSS slector except it starts with `$`. This is intentional as all selectors used by the scope will need to lead with the `$` character. The getter / setter just references the object with the class of screen and block's (define earlier) innerHTML as a store place for it's value.

```javascript
.append(
	stateless.instantiate("block")
		.addClass("number-pad")
		.addClass("float-wrap")
)
```

add a styling block

```javascript
;['9','8','7','6','5','4','3','2','1'].forEach(function(numberKey){
	calculator.append(
		"$ .number-pad",
		stateless.instantiate("btn")
			.html(numberKey)
			.define("command", {
				static: function(){
					calculator.display += numberKey
				}
			})
	)
})

calculator.append(
	"$ .number-pad",
	stateless.instantiate("btn")
		.html("0")
		.css("width", "100%")
		.define("command", {
			static: function(){
				calculator.display += "0"
			}
		})
)
```

Here is where we create the number pad for our item and you'll also notice that the first argument to the .append function is a selector. This is how stateless works. all of it's jQuery like methods, you are allowed to put a $selector before it and it will act as if you are doing things from that node. You'll notice that here we are defining a command property into this scope. the command property here is the property that is passed into the execute function we defined at the top. because of inheritance. this command property and it's parent's execute property are both accessible from within the scope of this button. as a result, the onclick event is calling the root element's execution function on this scope's command function. and as always we do that 9 times

Lastly we want to look at our simple logic within the function: `calculator.display += numberKey`. Earlier we have defined the display attribute on the root scope to be just the innerHTML of the display div and because of that, here all we have to do is just set that to whatever value we want and tada done. no fancy footwork no calling elaborate functions no weird {{expressions}} just plain old `=`.

```javascript
.append(
	stateless.instantiate("block")
		.css("float", "left")
		.css("width", "33.33%")
		.append(
			stateless.instantiate("btn")
				.html("+")
				.css("width", "50%")
				.define("command", {
					static: function(){
						calculator.display += "+"
					}
				})
		)
		.append(
			stateless.instantiate("btn")
				.html("-")
				.css("width", "50%")
				.define("command", {
					static: function(){
						calculator.display += "-"
					}
				})
		)
		.append(
			stateless.instantiate("btn")
				.html("/")
				.css("width", "50%")
				.define("command", {
					static: function(){
						calculator.display += "/"
					}
				})
		)
		.append(
			stateless.instantiate("btn")
				.html("%")
				.css("width", "50%")
				.define("command", {
					static: function(){
						calculator.display += "%"
					}
				})
		)
		.append(
			stateless.instantiate("btn")
				.html("*")
				.css("width", "50%")
				.define("command", {
					static: function(){
						calculator.display += "*"
					}
				})
		)
		.append(
			stateless.instantiate("btn")
				.html("=")
				.css("width", "50%")
				.define("command", {
					static: function(){
						calculator.display = eval(calculator.display)
					}
				})
		)
		.append(
			stateless.instantiate("btn")
				.html("c")
				.css("width", "100%")
				.define("command", {
					static: function(){
						calculator.display = ""
					}
				})
		)
)
```

This is the final block of our execution where we add a floating div to the left of the number pad that contains all of our controls. You'll notice that the stuff is all pretty much the same but you'll also notice that there are append calls within append calls. There's absolutely nothing stopping you from making these calls. Finally, we have the 2 different buttons at the bottom. the `=` button and the `c` button. Both of them are extremely simple and operates on the display variable without the need of directly going into the HTML or fancy expressions.

And that's about it. There's alot more functions that you can call from the scope and you can feel free to check out the [API docs](./api.md) for a full list of all the functions that you can use as well as what they do
