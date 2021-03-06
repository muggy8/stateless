(function(context, overload, recursive){
	if (context.stateless){ // lets not do extra work when we re-loading stuff
		return
	}

	var converter = document.createElement("div")

	// --------------------------------------------------------
	// The templater that does the heavy lifting kinda
	// --------------------------------------------------------
	var Scope = function(ele){
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
			get: recursive(function(recur, children){
				children = children || ele.children
				var childList = []

				Array.prototype.forEach.call(children, function(item){
					if (item.scope != self){
						childList.push(item.scope)
					}
					else {
						Array.prototype.push.apply(childList, recur(item.children))
					}
				})

				return childList
			})
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

		// begin dom manip functions

		var listeners = {}

		// public methods (kept in the prototype) for others to access
		public_method.on = overload()
			.args({scope:{on:"function"}, addEventListener: "function"}, "string", "function").use(function(ele, type, callback){
				if (ele.scope == self){
					//ele_on(ele, type, callback)
					var typeList = listeners[type] || (listeners[type] = []),
						repeat = false

					typeList.forEach(function(elfn){
						if (
							(elfn.fn == callback || elfn.fn.toString() == callback.toString()) &&
							(elfn.el == ele)
						){
							repeat = true
						}
					})

					if (!repeat){
						ele.addEventListener(type, callback)
						listeners[type].push({
							fn: callback,
							el: ele
						})
					}
					else {
						console.warn("listener is already registered")
					}
				}
				else {
					ele.scope.on(ele, type, callback)
				}
				return self
			})
			.args({"0":"object", length:"number", forEach:"function"}, "string", "function").use(function(eles, type, callback){
				eles.forEach(function(ele){
					self.on(ele, type, callback)
				})
				return self
			})
			.args("string", "string", "function").use(function(selector, type, callback){
				if(selector[0] == "$"){
					self.elements(selector).forEach( function(ele){
						self.on(ele, type, callback)
					})
				}
				else {
					console.warn("selector must begin with '$'")
				}
				return self
			})
			.args("string", "function").use(function(type, callback){
				self.on(ele, type, callback)
				return self
			})
			.args().use(function(){
				console.warn("on function inputs improperly formatted")
				return self
			})

		public_method.off = overload()
			.args({scope:{off:"function"}, addEventListener: "function"}, "string", "function").use(function(ele, type, callback){
				if (ele.scope == self){
					var typeList = listeners[type],
						found = false

					typeList && typeList.forEach(function(elfn, index){
						if (
							(elfn.fn == callback || elfn.fn.toString() == callback.toString()) &&
							elfn.el == ele
						){
							found = true
							ele.removeEventListener(type, elfn.fn)
							typeList.splice(index, 1)
						}
					})

					if (!found){
						console.warn("Listener is not currently registered")
					}
				}
				else {
					ele.scope.off(ele, type, callback)
				}
				return self
			})
			.args({"0":"object", length:"number", forEach:"function"}, "string", "function").use(function(eles, type, callback){
				eles.forEach(function(ele){
					self.off(ele, type, callback)
				})
			})
			.args("string", "string", "function").use(function(selector, type, callback){
				if(selector[0] == "$"){
					self.elements(selector).forEach( function(ele){
						self.off(ele, type, callback)
					})
				}
				else {
					console.warn("selector must begin with '$'")
				}
				return self
			})
			.args("string", "function").use(function(type, callback){
				self.off(ele, type, callback)
				return self
			})
			.args().use(function(){
				console.warn("off function inputs improperly formatted")
				return self
			})

		public_method.once = overload()
			.args({scope:{off:"function"}, addEventListener: "function"}, "string", "function").use(function(ele, type, callback){
				if (ele.scope == self){
					var cb = function(e){
						callback(e)
						self.off(ele, type, cb)
					}
					self.on(ele, type, cb)
				}
				else {
					ele.scope.once(ele, type, callback)
				}
				return self
			})
			.args({"0":"object", length:"number", forEach:"function"}, "string", "function").use(function(eles, type, callback){
				eles.forEach(function(ele){
					self.once(ele, type, callback)
				})
			})
			.args("string", "string", "function").use(function(selector, type, callback){
				if(selector[0] == "$"){
					self.elements(selector).forEach( function(ele){
						self.once(ele, type, callback)
					})
				}
				else {
					console.warn("selector must begin with '$'")
				}
				return self
			})
			.args("string", "function").use(function(type, callback){
				self.once(ele, type, callback)
				return self
			})
			.args().use(function(){
				console.warn("once function inputs improperly formatted")
				return self
			})

		public_method.hasClass = overload()
			.args({className: "string"}, "string").use(function(ele, c){
				return (ele.className.match(new RegExp("(^"+c+"$|\\s"+c+"\\s|^"+c+"\\s|\\s"+c+"$)")))? true : false
			})
			.args("string", "string").use(function(selector, c){
				if(selector[0] == "$"){
					return self.hasClass(self.element(selector), c)
				}
				else {
					console.warn("selector must begin with '$'")
					return false
				}
			})
			.args("string").use(function(c){
				return self.hasClass(ele, c)
			})
			.args().use(function(c){
				console.warn("malformed call")
				return false
			})

		public_method.addClass = overload()
			.args({scope:"object", className:"string"}, "string", "boolean").use(function(ele, c, multiple){
				if (ele.scope == self){
					if (multiple || !self.hasClass(ele, c)){
						ele.className += " " + c
						ele.className = ele.className.replace(/(^\s+|\s+$)/g, "")
					}
				}
				else {
					ele.scope.addClass(ele, c, multiple)
				}
				return self
			})
			.args({scope:"object", className:"string"}, "string").use(function(ele, c){
				self.addClass(ele, c, false)
				return self
			})
			.args({"0":"object", length:"number", forEach:"function"}, "string", "boolean").use(function(eles, c, multiple){
				eles.forEach(function(ele){
					self.addClass(ele, c, multiple)
				})
			})
			.args("string", "string", "boolean").use(function(selector, c, multiple){
				if(selector[0] == "$"){
					self.elements(selector).forEach( function(ele){
						self.addClass(ele, c, multiple)
					})
				}
				else {
					console.warn("selector must begin with '$'")
				}
				return self
			})
			.args({"0":"object", length:"number", forEach:"function"}, "string").use(function(eles, c){
				eles.forEach(function(ele){
					self.addClass(ele, c, false)
				})
			})
			.args({scope:"object", className:"string"}, "string").use(function(ele, c){
				self.addClass(ele, c, false)
				return self
			})
			.args("string", "string").use(function(selector, c){
				if(selector[0] == "$"){
					self.elements(selector).forEach( function(ele){
						self.addClass(ele, c, false)
					})
				}
				else {
					console.warn("selector must begin with '$'")
				}
				return self
			})
			.args("string", "boolean").use(function(c, multiple){
				self.addClass(ele, c, multiple)
				return self
			})
			.args("string").use(function(c){
				self.addClass(ele, c, false)
				return self
			})
			.args().use(function(){
				console.warn("addClass function inputs improperly formatted")
				return self
			})

		public_method.removeClass = overload()
			.args({scope:"object", className:"string"}, "string", "boolean").use(function(ele, c, multiple){
				if (ele.scope == self){
					var globalMatch = (multiple)? "g" : ""
					var matcher =  new RegExp("(^"+c+"$|\\s"+c+"\\s|^"+c+"\\s|\\s"+c+"$)", globalMatch)

					ele.className = ele.className
						.replace(matcher, " ")
						.replace(/(^\s+|\s+$)/g, "")
						.replace(/\s+/g, " ")
				}
				else {
					ele.scope.removeClass(ele, c, multiple)
				}
				return self
			})
			.args({scope:"object", className:"string"}, "string").use(function(ele, c){
				self.removeClass(ele, c, false)
				return self
			})
			.args({"0":"object", length:"number", forEach:"function"}, "string", "boolean").use(function(eles, c, multiple){
				eles.forEach(function(ele){
					self.removeClass(ele, c, multiple)
				})
			})
			.args("string", "string", "boolean").use(function(selector, c, multiple){
				if(selector[0] == "$"){
					self.elements(selector).forEach( function(ele){
						self.removeClass(ele, c, multiple)
					})
				}
				else {
					console.warn("selector must begin with '$'")
				}
				return self
			})
			.args({"0":"object", length:"number", forEach:"function"}, "string").use(function(eles, c){
				eles.forEach(function(ele){
					self.removeClass(ele, c, false)
				})
			})
			.args("string", "string").use(function(selector, c){
				if(selector[0] == "$"){
					self.elements(selector).forEach( function(ele){
						self.removeClass(ele, c, false)
					})
				}
				else {
					console.warn("selector must begin with '$'")
				}
				return self
			})
			.args("string", "boolean").use(function(c, multiple){
				self.removeClass(ele, c, multiple)
				return self
			})
			.args("string").use(function(c){
				self.removeClass(ele, c, false)
				return self
			})
			.args().use(function(){
				console.warn("removeClass function inputs improperly formatted")
				return self
			})

		public_method.attr = overload()
			.args({scope:"object", getAttribute:"function", setAttribute: "function"}, "string").use(function(ele, attribute, value){
				if (ele.scope == self){
					if (typeof value == "undefined") {
						return ele.getAttribute(attribute)
					}
					else {
						ele.setAttribute(attribute, value)
						return self
					}
				}
				else {
					if (typeof value == "undefined"){
						return ele.scope.attr(ele, attribute)
					}
					else {
						ele.scope.attr(ele, attribute, value)
						return self
					}
				}
			})
			.args({"0":"object", length:"number", forEach:"function"}, "string").use(function(eles, attribute, value){
				eles.forEach(function(ele){
					self.attr(ele, attribute, value)
				})
				return self
			})
			.args("string", "string").use(function(v1, v2, v3){
				if (v1[0] == "$"){ //v1 is selector
					var selector = v1,
						attribute = v2,
						value = v3

					if (typeof value == "undefined"){
						return self.attr(self.element(selector), attribute)
					}
					else {
						self.elements(selector).forEach( function(ele){
							self.attr(ele, attribute, value)
						})
						return self
					}
				}
				else{ // v1 is property name
					var attribute = v1,
						value = v2

					return self.attr(ele, attribute, value)
				}
			})
			.args("string").use(function(attribute, value){
				return self.attr(ele, attribute, value)
			})
			.args().use(function(){
				console.warn("attr function inputs improperly formatted")
				return self
			})


		public_method.css = overload()
			.args({scope: "object", style:"object"}, "string").use(function(ele, rule, value){
				if (ele.scope == self){
					if (typeof value != "undefined"){
						var elemStyles = self.attr(ele, "style") || "",
							ruleForm = rule + "[^;]*(;|$)"
							replaceRule = new RegExp("((^(\\n|\\s)*|;)(\\s|\\n)*" + ruleForm + "|^" + ruleForm + ")", "gi"),
							replaceWith = rule + ":" + value + ";"
							newRules = elemStyles
								.replace(replaceRule, ";" + replaceWith)
								.replace(/^;/, "")

						if (newRules == elemStyles){
							self.attr(ele, "style", elemStyles + replaceWith)
						}
						else {
							self.attr(ele, "style", newRules)
						}
						return self
					}
					else {
						return getComputedStyle(ele).getPropertyValue(rule)
					}
				}
				else {
					if (value){
						ele.scope.css(ele, rule, value)
						return self
					}
					else {
						return ele.scope.css(ele, rule)
					}
				}
			})
			.args({"0":"object", length:"number", forEach:"function"}, "string").use(function(eles, rule, value){
				eles.forEach(function(ele){
					self.css(ele, rule, value)
				})
				return self
			})
			.args("string", "string").use(function(v1, v2, v3){
				if (v1[0] == "$"){
					var selector = v1,
						rule = v2,
						value = v3

					self.elements(selector).forEach(function(ele){
						self.css(ele, rule, value)
					})
					return self
				}
				else {
					var rule = v1,
						value = v2

					return self.css(ele, rule, value)
				}
			})
			.args("string").use(function(rule){
				return self.css(ele, rule)
			})
			.args().use(function(){
				console.warn("css function inputs improperly formatted")
				return self
			})

		public_method.data = overload()
			.args({scope:"object", dataset:"object"}, "string").use(function(ele, attribute, value){
				if (ele.scope == self){
					if (typeof value !== "undefined"){
						ele.dataset[attribute] = value
						return self
					}
					else {
						return ele.dataset[attribute]
					}
				}
				else {
					return ele.scope.data(ele, attribute)
				}
			})
			.args("string", "string").use(function(v1, v2, v3){
				if (v1[0] == "$"){ //v1 is selector
					var selector = v1,
						attribute = v2,
						value = v3

					if (typeof value == "undefined"){
						return self.data(self.element(selector), attribute)
					}
					else {
						self.elements(selector).forEach( function(ele){
							self.data(ele, attribute, value)
						})
						return self
					}
				}
				else{ // v1 is property name
					var attribute = v1,
						value = v2

					return self.data(ele, attribute, value)
				}
			})
			.args("string").use(function(attribute, value){
				return self.data(ele, attribute, value)
			})
			.args().use(function(){
				console.warn("data function inputs improperly formatted")
				return self
			})

		public_method.html = overload()
			.args({scope:"object", appendChild:"function"}, "string").use(function(ele, htmlString){
				if (ele.scope == self){
					self.children.forEach(function(subScope){
						subScope.unlink()
					})
					ele.innerHTML = htmlString
					ele.scope.include()
				}
				else {
					ele.scope.html(ele, htmlString)
				}
				return self
			})
			.args("string", "string").use(function(selector, htmlString){
				if (selector[0] == "$"){
					self.html(self.element(selector), htmlString)
				}
				return self
			})
			.args({scope:"object", appendChild:"function"}).use(function(ele){
				if (ele.scope == self) {
					return ele.innerHTML
				}
				else {
					return ele.scope.html(ele)
				}
			})
			.args("string").use(function(v){
				if (v[0] == "$"){
					var selector = v
					return self.html(self.element(selector))
				}
				else {
					var htmlString = v
					self.html(ele, htmlString)
					return self
				}
			})
			.args().use(function(v){
				return self.html(self.element())
			})

		// functions for dom manip end

		public_method.include = overload()
			.args({scope:"object", appendChild:"function"}, "object").use(function(ele, subEle, before){
				if (ele.scope == self && !subEle.scope){
					if (!before){
						recursiveDefineScope(subEle)
						ele.appendChild(subEle)
					}
					else {
						if (typeof before == "string" && before[0] == "$"){
							before = self.element(before)
						}

						var beforeParent = before.parentNode
						if (beforeParent.scope != self){
							beforeParent.scope.include(beforeParent, subEle, before)
						}
						else {
							recursiveDefineScope(subEle)
							beforeParent.insertBefore(subEle, before)
						}
					}
				}
				else if (!subEle.scope){
					ele.scope.include(ele, subEle)
				}
				else {
					console.warn("The item you are trying to include into this scope is already part of another scope. Try to append that scope to the current scope instead")
				}
				return self
			})
			.args("string", "object").use(function(selector, subEle, before){
				if(selector[0] == "$"){
					self.include(self.element(selector), subEle, before)
				}
				else {
					console.warn("selector must begin with '$'")
				}
				return self
			})
			.args("object").use(function(subEle, before){
				self.include(ele, subEle, before)
				return self
			})
			.args().use(function(){
				self.children.forEach(function(subScope){
					subScope.include()
				})
				self.elements().forEach(function(ele){
					if (!ele.scope){
						self.include(self.element(), ele, ele)
					}
				})
				return self
			})

		// functions for module manip begin

		public_method.property = public_method.define = overload()
			.args("string", {get: "function", static: "undefined", asVar: "undefined"}).use(function(prop, config){
				config.scope = self

				var deffs = {
					enumerable: (typeof config.enumerable == "undefined")?  true : config.enumerable,
					configurable: true,
					get: config.get
				}
				if (config.set && typeof config.set === "function") {
					deffs.set = config.set
				}

				if (deffs.get.bind){
					deffs.get = deffs.get.bind(config)
				}
				if (deffs.set && deffs.set.bind){
					deffs.set = deffs.set.bind(config)
				}

				Object.defineProperty(self, prop, deffs)
				return self
			})
			.args("string", {get: "undefined", set:"undefined", asVar: "undefined", static: "!undefined"}).use(function(prop, config){
				config.scope = self

				var deffs = {
					enumerable: (typeof config.enumerable == "undefined")? true : config.enumerable,
					configurable: true,
					writable: false,
					value: config.static
				}

				if (deffs.value.bind){
					deffs.value = deffs.value.bind(config)
				}

				Object.defineProperty(self, prop, deffs)
				return self
			})
			.args("string", {get: "undefined", set:"undefined", asVar: "!undefined", static: "undefined"}).use(function(prop, config){
				var deffs = {
					enumerable: (typeof config.enumerable == "undefined")?  true : config.enumerable,
					configurable: true,
					writable: true,
					value: config.asVar
				}

				Object.defineProperty(self, prop, deffs)
				return self
			})
			.args().use(function(){
				console.warn("property/define function inputs improperly formatted")
				return self
			})

		public_method.element = function(selector){
			if (selector){
				if(selector[0] == "$"){
					selector = selector.replace(/^\$\s*/, "")
				}
				return ele.querySelector(selector)
			}
			else {
				return ele
			}
		}

		public_method.elements = function(selector){
			if (selector){
				if(selector[0] == "$"){
					selector = selector.replace(/^\$\s*/, "")
				}
				return Array.prototype.slice.call(ele.querySelectorAll(selector), 0)
			}
			else{
				var arr = Array.prototype.filter.call(ele.querySelectorAll("*"), function(node){
					return node.scope == self
				})
				arr.unshift(ele)
				return arr
			}
		}

		public_method.append = public_method.appendChild = overload()
			// main method 1 append child scope
			.args({scope:{append:"function"}, appendChild:"function"}, {children:"object", root:"object", element:"function", unlink:"function"}).use(function(ele, subScope, before){
				if (ele.scope == self){
					if (!before){
						subScope.unlink()
						Object.setPrototypeOf(Object.getPrototypeOf(subScope), self)
						ele.appendChild(subScope.element())
					}
					else {
						if (typeof before == "string" && before[0] == "$"){
							before = self.element(before)
						}

						var beforeParent = before.parentNode
						if (beforeParent.scope != self){
							beforeParent.scope.append(beforeParent, subScope, before)
						}
						else {
							subScope.unlink()
							Object.setPrototypeOf(Object.getPrototypeOf(subScope), self)
							beforeParent.insertBefore(subScope.element(), before)
						}
					}
				}
				else {
					ele.scope.append(ele, subScope)
				}
				return self
			})
			// bootstrap off main method 1
			.args("string", {children:"object", root:"object", element:"function", unlink:"function"}).use(function(selector, subScope, before){
				if(selector[0] == "$"){
					self.append(self.element(selector), subScope, before)
				}
				else {
					console.warn("selector must begin with '$'")
				}
				return self
			})
			// main method 2: alias for include
			.args({scope:{append:"function"}, appendChild:"function"}, "object").use(function(ele, addedEle, before){
				if (ele.scope == self){
					self.include(ele, addedEle, before)
				}
				else {
					ele.scope.include(ele, addedEle, before)
				}
				return self
			})
			// main bootstrap off main metho 2
			.args("string", "object").use(function(selector, addedEle, before){
				if(selector[0] == "$"){
					self.append(self.element(selector), addedEle, before)
				}
				else {
					console.warn("selector must begin with '$'")
				}
				return self
			})
			// bootstrap off main method 2
			.args({scope:{append:"function"}, appendChild:"function"}, "string").use(function(ele, htmlString, before){
				converter.innerHTML = htmlString
				Array.prototype.slice.call(converter.children, 0).forEach(function(addedEle){
					self.append(ele, addedEle, before)
				})
				return self
			})
			// bootstrap off main method 2
			.args("string", "string").use(function(selector, htmlString, before){
				if(selector[0] == "$"){
					var el = self.element(selector)
					converter.innerHTML = htmlString

					Array.prototype.slice.call(converter.children, 0).forEach(function(addedEle){
						self.append(el, addedEle, before)
					})
				}
				else if (htmlString[0] == "$"){
					// using string with a before selector
					before = htmlString
					htmlString = selector
					converter.innerHTML = htmlString
					Array.prototype.slice.call(converter.children, 0).forEach.call(converter.children, function(addedEle){
						self.append(ele, addedEle, before)
					})
				}
				else {
					console.warn("selector must begin with '$'")
				}
				return self
			})
			// bootstrp off of main method 1
			.args({children:"object", root:"object", element:"function", unlink:"function"}).use(function(subScope, before){
				self.append(ele, subScope, before)
				return self
			})
			// bootstraps off main method 2
			.args("object").use(function(addedEle, before){
				if (ele.scope == self){
					self.append(ele, addedEle, before)
				}
				return self
			})
			// bootstrap off main method 2
			.args("string").use(function(htmlString){
				converter.innerHTML = htmlString
				Array.prototype.slice.call(converter.children, 0).forEach.call(converter.children, function(addedEle){
					self.append(ele, addedEle)
				})
				return self
			})
			.args().use(function(){
				console.warn("append/appendChild function inputs improperly formatted")
				return self
			})


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

		return self
	}


	// --------------------------------------------------------
	// Stateless object exposed to the main execution scope for managing and playing with the templates
	// --------------------------------------------------------
	context.stateless = {}
	var statelessOpps = {},
		statelessPlugins = {}
	Object.setPrototypeOf(context.stateless, statelessPlugins)
	Object.setPrototypeOf(statelessPlugins, statelessOpps)

	// private values to be manipulated internally
	var length = 0,
		migrateId = function(ele){
			if (ele.id){
				var className = ele.className
				ele.className = ele.id
				if (className){
					ele.className += " " + className
				}
				ele.removeAttribute("id")
			}
		},
		pushEle = function(ele){
			var index = length
			var id = ele.id || index

            // will check if the item is already in stateless here. if it is, it will error and no sideeffects will happen
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

			migrateId(ele)
			length ++
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
                if (ele.id && context.stateless[ele.id]){
                    throw new Error("Template with id of \"" + ele.id + "\" has already been declared");
                }
                else {
                    pushEle(ele.cloneNode(true))
	                ele.parentElement && ele.parentElement.removeChild(ele)
                }

			}
			else if (typeof ele === "string"){
				converter.innerHTML = ele
				while (converter.children[0]){
					stateless.consume(converter.children[0])
				}
			}
			else {
				throw new Error("Invalid inputs")
			}
			return context.stateless
		}
	})

	Object.defineProperty(statelessOpps, "register", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: statelessOpps.consume
	})

	Object.defineProperty(statelessOpps, "view", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: function(ele){
			if (ele instanceof HTMLElement){
				ele.parentElement && ele.parentElement.removeChild(ele)
				migrateId(ele)
				return Scope(ele)
			}
			else if (typeof ele === "string"){
				converter.innerHTML = ele
				if (converter.children.length === 1){
					return stateless.view(converter.children[0])
				} else {
                    throw new Error("Views can only have 1 root element")
                }
			}
			else {
				throw new Error("Invalid inputs")
			}
		}
	})

	Object.defineProperty(statelessOpps, "build", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: statelessOpps.view
	})

	Object.defineProperty(statelessOpps, "instantiate", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: function(identifyer){ // public static function
			if (stateless[identifyer]) {
				var instance = Scope(stateless[identifyer].cloneNode(true))
				return instance
			}
			else {
				throw new Error( identifyer + " cannot be found in the template library")
			}
		}
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

	var subscription = {},
		globalWatchers = []

	Object.defineProperty(statelessOpps, "watch", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: overload()
			.args("string", "function").use(function(nameSpace, callback){ // public static function
				subscription[nameSpace] = subscription[nameSpace] || []
				subscription[nameSpace].push(callback)

				return function(){
					subscription[nameSpace].forEach(function(watcher, index){
						if (watcher == callback){
							subscription[nameSpace].splice(index, 1)
						}
					})
				}
			})
			.args("function").use(function(callback){
				globalWatchers.push(callback)

				return function(){
					globalWatchers.forEach(function(watcher, index){
						if (watcher == callback){
							globalWatchers.splice(index, 1)
						}
					})
				}
			})
			.args().use(function(){
				console.warn("watcher registration error")
			})
	})

	Object.defineProperty(statelessOpps, "emit", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: function(nameSpace, data){ // public static function
			data = data || {}
			subscription[nameSpace] && subscription[nameSpace].forEach(function(callback){
				callback(nameSpace, data)
			})
			globalWatchers.forEach(function(watcher){
				watcher(nameSpace, data)
			})
			return context.stateless
		}
	})

	Object.defineProperty(statelessOpps, "plugin", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: overload() // public static function
			.args("string", "!undefined").use(function(name, val){ // set a plugin function
				if (statelessPlugins.hasOwnProperty(name)){
					return console.warn("Plugin already defined")
				}
				Object.defineProperty(statelessPlugins, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: val
				})
				return context.stateless
			})
			.args("string", "undefined").use(function(name){ // get a plugin function
				if (statelessPlugins.hasOwnProperty(name)){
					return statelessPlugins[name]
				}
				return context.stateless
			})
			.args().use(function(){
				console.warn("plugin error")
				return context.stateless
			})
	})
})(
	this,
	// modified method-overload v0.1.1
	(function(){var b=function(a,c){var d=!0;for(var e in c){"string"==typeof c[e]&&"!"===c[e][0]?typeof a[e]===c[e].substring(1)&&(d=!1):"object"==typeof a[e]&&"object"==typeof c[e]?d=b(a[e],c[e])&&d:typeof a[e]!==c[e]&&(d=!1)}return d};return function(){var a=this,c=arguments;1===arguments.length&&(c=arguments[0]);var d=[],e=function(){};e.use=e.args=function(){return e};var f=function(){for(var a in d){var c=d[a];if(b(arguments,c.m))return c.e.apply(this,arguments)}},g=function(){var g=arguments;return{use:function(h){return 0==g.length&&delete f.args,d.push({m:g,e:h}),c.length&&b(c,g)?(h.apply(a,c),e):f}}};return f.args=g,f}})(),

	// anonamyous recursive functions
	function(fn){
		var bound = function(){
			var inputs = Array.prototype.concat.call([bound], Array.prototype.splice.call(arguments, 0))
			return fn.apply(null, inputs)
		}
		return bound
	}
)
