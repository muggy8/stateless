(function(context, eval){

	// --------------------------------------------------------
	// helper functions that do stuff
	// --------------------------------------------------------

	// lets you declare recursive anonamyous recursive functions
	function recursive(fn){
	    var bound = function(){
	        var inputs = Array.prototype.concat.call([bound], Array.prototype.splice.call(arguments, 0))
	        return fn.apply(null, inputs)
	    }
	    return bound
	}

	// unused right now but checks if an object is empty
	function isEmpty(obj) {
		for(var prop in obj) {
			if(obj.hasOwnProperty(prop))
				return false
		}
		return JSON.stringify(obj) === JSON.stringify({})
	}

	// make ajax calls (used in stateless.import)
	function ajaxGet(url, successCallback, failCallback){
		var request = new XMLHttpRequest()

		successCallback = successCallback || function (data){/*console.log(data)*/}
		failCallback = failCallback || function (data){/*console.log(data)*/}

		request.onload = function(){
			successCallback(request)
		}
		request.onerror = function(){
			failCallback(request)
		}

		request.open('GET', url, true)
		request.send()
	}

	// exclusive or never a bad thing to have but unused right now
	function xor(a,b) {
		return ( a || b ) && !( a && b )
	}

	// make sure that only 1 of 2 or more variables are defined
	var onlyOneIsDefined = function(){
		var truthness = false;
		for (var i = 0; i < arguments.length; i++){
			if (arguments[i] !== null  && typeof arguments[i] != "undefined" && truthness) { // found a second truthful item in array
				return false
			}
			else if (arguments[i] !== null  && typeof arguments[i] != "undefined" && !truthness){ // found the first truthful item
				truthness = true;
			}
		}
		return truthness // you can only get here if there was one truthful item in the array
	}

	// --------------------------------------------------------
	// The templater that does the heavy lifting kinda
	// --------------------------------------------------------
	var _scope = function(ele){
		// detect if new or just calling it
		var self = {}

		if (!ele){
			throw new Error("No element selected")
		}

		// set public methods into the prototype of this object.
		var public_method = {}
		Object.setPrototypeOf(self, public_method)

		// define public propertyies that can be gotten with .varname
		Object.defineProperty(public_method, "parent", {
			enumerable: false,
			configurable: false,
			get: function(){
				return ele.parentNode && ele.parentNode.scope
			}
		})

		Object.defineProperty(public_method, "children", {
			enumerable: false,
			configurable: false,
			get: function(){
				var unique = [];
				Array.prototype.forEach.call(ele.querySelectorAll("*"), function(item){
					var scope = item.scope
					// todo: refactor this and make a better way of keeping track of child scopes.
					if (scope && scope != self && scope.parent == self && unique.indexOf(scope) === -1){
						unique.push(scope)
					}
				})
				return unique;
			}
		})

		Object.defineProperty(public_method, "root", {
			enumerable: false,
			configurable: false,
			get: recursive(function(getParent, scope){
				scope = scope || self
				return (scope.parent)? getParent(scope.parent) : scope
			})
		})

		// set the "scope" property of every HTML element associated to self to provide a reference to self
		// most depended upon property in the framework
		var recursiveDefineScope = function(ele, recur){
			Object.defineProperty(ele, "scope", {
				enumerable: false,
				configurable: false,
				get: function(){
					return self
				}
			})

			if (recur !== false){
				Array.prototype.forEach.call(ele.querySelectorAll("*"), function(item){
					recursiveDefineScope(item, false)
				})
			}
		}
		recursiveDefineScope(ele)

		var addEventInterface = function(el, again){
			var listeners = {}

			el.on = function(type, callback){
				var typeList = listeners[type] || (listeners[type] = []),
					repeat = false

				typeList.forEach(function(fn){
					if (fn == callback || fn.toString() == callback.toString()){
						repeat = true
					}
				})

				if (!repeat){
					el.addEventListener(type, callback)
					typeList.push(callback)
				}
			}

			el.off = function(type, callback){
				var typeList = listeners[type],
					found = false

				typeList && typeList.forEach(function(fn){
					if (fn == callback || fn.toString() == callback.toString()){
						found = true
						el.removeEventListener(type, fn)
					}
				})

				if (!found){
					console.warn("Listener is not currently registered")
				}
			}

			el.once = function(type, callback){
				var handler = function(ev){
					callback(ev)
					el.off(type, callback)
				}
				el.on(type, callback)
			}

			if (again !== false){
				Array.prototype.forEach.call(el.querySelectorAll("*"), function(node){
					addEventInterface(node, false)
				})
			}
		}
		addEventInterface(ele)

		// public methods (kept in the prototype) for others to access
		public_method.on = function(selectorOrType, typeOrCallback, potentialCallback){
			if (
				typeof potentialCallback == "function" &&
				typeof selectorOrType == "string" &&
				typeof typeOrCallback == "string"
			){
				var el = ele.querySelectorAll(selectorOrType)
				Array.prototype.forEach.call(el, function(ele){
					console.log(ele)
					ele.on(typeOrCallback, potentialCallback)
				})
			}
			else if (
				typeof typeOrCallback == "function" &&
				typeof selectorOrType == "string" &&
				!potentialCallback
			){
				ele.on(typeOrCallback, potentialCallback)
			}
			else {
				throw new Error("Malformed event listener registration")
			}

			return self
		}

		public_method.off = function(selectorOrType, typeOrCallback, potentialCallback){
			if (
				typeof potentialCallback == "function" &&
				typeof selectorOrType == "string" &&
				typeof typeOrCallback == "string"
			){
				var el = ele.querySelectorAll(selectorOrType)
				Array.prototype.forEach.call(function(ele){
					ele.on(typeOrCallback, potentialCallback)
				})
			}
			else if (
				typeof typeOrCallback == "function" &&
				typeof selectorOrType == "string" &&
				!potentialCallback
			){
				ele.on(typeOrCallback, potentialCallback)
			}
			else {
				throw new Error("Malformed event listener removal")
			}

			return self
		}

		public_method.once = function(selectorOrType, typeOrCallback, potentialCallback){
			if (
				typeof potentialCallback == "function" &&
				typeof selectorOrType == "string" &&
				typeof typeOrCallback == "string"
			){
				var el = ele.querySelectorAll(selectorOrType)
				Array.prototype.forEach.call(function(ele){
					ele.once(typeOrCallback, potentialCallback)
				})
			}
			else if (
				typeof typeOrCallback == "function" &&
				typeof selectorOrType == "string" &&
				!potentialCallback
			){
				ele.once(typeOrCallback, potentialCallback)
			}
			else {
				throw new Error("Malformed event listener registration")
			}

			return self
		}

		public_method.include = function(el, where){
			var insertAt = ele.querySelector(where) || ele
			insertAt.appendChild(el)
			recursiveDefineScope(el, false)
			addEventInterface(ele, false)
			return self
		}

		public_method.appendChild = function(childScope, where){
			childScope.unlink()
			Object.setPrototypeOf(Object.getPrototypeOf(childScope), self)
			var insertAt = ele.querySelector(where) || ele
			insertAt.appendChild(childScope.element())
			return self
		}

		public_method.unlink = function(){
			if (ele.parentNode) {
				Object.setPrototypeOf(Object.getPrototypeOf(self), Object.prototype)
				ele.parentNode.removeChild(ele)
			}
			return self
		}

		public_method.render = function(){
			self.unlink()
			document.body.appendChild(ele)
			return self
		}

		public_method.text = function(){

		}

		public_method.hasClass = function(q){
			if (q) {
				return (ele.className.match(new RegExp("(^"+q+"$|\\s"+q+"\\s|^"+q+"\\s|\\s"+q+"$)")))? true : false
			}
			else {
				return self
			}
		}

		public_method.addClass = function(c, multiple){
			if (!self.hasClass(c) || multiple === true){
				ele.className += " " + c
			}
			return self
		}

		public_method.removeClass = function(c, multiple){
			if (self.hasClass(c)){
				if (multiple === true){
					ele.className = ele.className
						.replace(new RegExp(c, "g"), "")
						.replace(/(^\s+|\s+$)/g, "")
						.replace(/\s+/g, " ")
				}
				else {
					ele.className = ele.className
						.replace(c, "")
						.replace(/(^\s+|\s+$)/g, "")
						.replace(/\s+/g, " ")
				}
			}
			return self
		}

		public_method.attr = function(attribute, value){
			if (typeof value == "undefined") {
				return ele.getAttribute(attribute)
			}
			else {
				ele.setAttribute(attribute, value)
				return self
			}
		}

		public_method.css = function(){

		}

		public_method.data = function(){

		}

		public_method.define = function(prop, config){
			var deffs = {
				enumerable: (typeof config.enumerable == "undefined")?  true : config.enumerable,
				configurable: true
			}

			if (!onlyOneIsDefined((config.get || config.set), config.static, config.asVar)) {
				throw new Error("You can only have one of (getter[+setter]), static, or asVar");
			}
			else if (config.get || config.set){
				if (config.set && config.get){
					deffs.set = config.set
				}
				else if (config.set && !config.get){
					throw new Error("You need a getter with your setter")
				}

				deffs.get = config.get
			}
			else if (config.static){
				deffs.value = config.static
			}
			else if (config.asVar !== null || typeof config.asVar != "undefined"){
				deffs.value = config.asVar
				deffs.writable = true
			}
			else {
				throw new Error("Your congifs must include either a get, a static, or an asVar property")
			}

			Object.defineProperty(self, prop, deffs)
			return self
		}
		public_method.property = public_method.define

		public_method.element = function(selector){
			return (selector)? ele.querySelector(selector) : ele
		}

		public_method.elements = function(selector){
			if (selector){
				return Array.prototype.splice.call(ele.querySelectorAll(selector), 1)
			}
			else{
				var everything = Array.prototype.splice.call(ele.querySelectorAll("*"), 1)
				everything.push(ele)
				return everything
			}
		}

		return self
	}


	// --------------------------------------------------------
	// Stateless object exposed to the main execution scope for managing and playing with the templates
	// --------------------------------------------------------
	context.stateless = {}
	var statelessOpps = {}
	Object.setPrototypeOf(context.stateless, statelessOpps)

	// private values to be manipulated internally
	var length = 0

	var pushEle = function (ele){
		var index = length
		var id = ele.id || index
		if (ele.id){
			var className = ele.className
			ele.className = ele.id
			if (className){
				ele.className += " " + className
			}
			ele.removeAttribute("id")
		}
		length ++

		Object.defineProperty(context.stateless, id, {
			enumerable: false,
			configurable: false,
			writable: false,
			value: ele
		})

		if (!context.stateless[index]){
			Object.defineProperty(context.stateless, index, {
				enumerable: false,
				configurable: false,
				writable: false,
				value: ele
			})
		}

		return id
	}
	// public unchangeable variable
	Object.defineProperty(statelessOpps, "length", {
		enumerable: false,
		configurable: false,
		get: function(){
			return length
		}
	})

	Object.defineProperty(statelessOpps, "consume", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: function(ele){ // public static function
			if (ele instanceof HTMLElement){
				ele.parentElement && ele.parentElement.removeChild(ele)
				pushEle(ele)
			}
			else if (typeof ele === "string"){
				var converter = document.createElement("div")
				converter.innerHTML = ele
				stateless.consume(converter.children)
			}
			else if (ele.length && ele[0] ){ //
				for (var i = 0; i < ele.length; i++){
					stateless.consume(ele[i])
				}
			}
			else {
				throw new Error("Invalid inputs")
			}
			return context.stateless
		}
	})

	Object.defineProperty(statelessOpps, "import", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: function(url){
			ajaxGet(url, function(xmlhttp){
				stateless.consume(xmlhttp.responseText)
			}, function(xmlhttp){
				throw new Error("The URL failed to load")
			})
			return context.stateless
		}
	})

	Object.defineProperty(statelessOpps, "register", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: statelessOpps.consume
	})

	Object.defineProperty(statelessOpps, "each", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: function(callback){
			for (var i = 0; i < length; i++){
				callback(context.stateless[i], i)
			}
			return context.stateless
		}
	})

	Object.defineProperty(statelessOpps, "instantiate", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: function(identifyer){ // public static function
			if (stateless[identifyer]) {
				var instance = _scope(stateless[identifyer].cloneNode(true))
				return instance
			}
			else {
				throw new Error( identifyer + " cannot be found in the template librare")
			}
		}
	})
})(
	//var context =
		this,
	//var safeEval =
		function(code){
			var safeContext = this;
			eval.call(safeContext, code)
		}.bind(this)
)
