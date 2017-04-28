(function(context){

    // --------------------------------------------------------
    // helper functions that do stuff
    // --------------------------------------------------------
    function isEmpty(obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }
        return JSON.stringify(obj) === JSON.stringify({});
    }

    var ajaxGet = function(url, successCallback, failCallback){
        var request = new XMLHttpRequest();

        successCallback = successCallback || function (data){/*console.log(data)*/};
        failCallback = failCallback || function (data){/*console.log(data)*/};

        request.onload = function(){
            successCallback(request)
        };
        request.onerror = function(){
            failCallback(request)
        }

        request.open('GET', url, true);
        request.send();
    }

    // --------------------------------------------------------
    // templater that does the heavy lifting kinda
    // --------------------------------------------------------
    var templateInstance = function(ele){
        // detect if new or just calling it
        var self = (context == this)? {} : this;

        if (!ele){
            throw "No element selected";
        }
        // initialize some private values
        //self.ele = ele;

        var insertAt = ele.querySelector("ins") || ele;
        var children = [];
        var parent = [];

        // set public methods into the prototype of this object.
        var public_method = {};
        Object.setPrototypeOf(self, public_method);

        Object.defineProperty(public_method, "parent", {
            enumerable: false,
            configurable: false,
            get: function(){
                return ele.parentNode && ele.parentNode.context;
            }
        });

        Object.defineProperty(public_method, "Children", {
            enumerable: false,
            configurable: false,
            get: function(){
                if (insertAt.children){
                    return Array.prototype.filter.call(insertAt.children, function(item){
                        return (item.context && item.context != self);
                    }).map(function(item){
                        return item.context;
                    })
                }
                else {
                    return false;
                }
            }
        });

        Object.defineProperty(public_method, "root", {
            enumerable: false,
            configurable: false,
            get: function(){
                function getParentR (context){
                    if (context.parent) {
                        return getParentR(context.parent);
                    }
                    else {
                        return context;
                    }
                }
                return getParentR(self);
            }
        });

        function recursiveDefineScope (ele, recur){
             Object.defineProperty(ele, "context", {
                enumerable: false,
                configurable: false,
                get: function(){
                    return self;
                }
            });
            if (recur !== false){
                Array.prototype.forEach.call(ele.querySelectorAll("*"), function(item){
                    recursiveDefineScope(item, false);
                });
            }
        };
        recursiveDefineScope(ele);


        public_method.on = function(){

        }

        public_method.off = function(){

        }

        public_method.once = function(){

        }

        public_method.include = function(ele){
            insertAt.appendChild(ele);
            recursiveDefineScope(ele, false);
            return self;
        }

        public_method.appendChild = function(childContext){
            childContext.unlink();
            Object.setPrototypeOf(Object.getPrototypeOf(childContext), self);
            ele.appendChild(childContext.element())
            return self;
        }

        public_method.unlink = function(){
            if (ele.parentNode) {
                Object.setPrototypeOf(Object.getPrototypeOf(self), Object.prototype);
                ele.parentNode.removeChild(ele);
            }
            return self;
        }

        public_method.render = function(){
            document.body.appendChild(ele)
            return self
        }

        public_method.text = function(){

        }

        public_method.hasClass = function(){

        }

        public_method.addClass = function(){

        }

        public_method.removeClass = function(){

        }

        public_method.attr = function(){

        }

        public_method.css = function(){

        }

        public_method.data = function(){

        }

        public_method.define = function(){

        }

        public_method.element = function(){
            return ele;
        }

        return self;
    }


    // --------------------------------------------------------
    // Stateless object exposed to the main execution scope for managing and playing with the templates
    // --------------------------------------------------------
    context.stateless = {};
    var statelessOpps = {};
    Object.setPrototypeOf(context.stateless, statelessOpps);

    // private values to be manipulated internally
    var length = 0;

    var pushEle = function (ele){
        var index = length;
        var id = ele.id || index;
        if (ele.id){
            var className = ele.className;
            ele.className = ele.id;
            if (className){
                ele.className += " " + className;
            }
            ele.removeAttribute("id");
        }
        length ++;

        Object.defineProperty(context.stateless, id, {
            enumerable: false,
            configurable: false,
            writable: false,
            value: ele
        });

        if (!context.stateless[index]){
            Object.defineProperty(context.stateless, index, {
                enumerable: false,
                configurable: false,
                writable: false,
                value: ele
            });
        }

        return id;
    }
    // public unchangeable variable
    Object.defineProperty(statelessOpps, "length", {
        enumerable: false,
        configurable: false,
        get: function(){
            return length;
        }
    });

    Object.defineProperty(statelessOpps, "consume", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function(ele){ // public static function
            if (ele instanceof HTMLElement){
                ele.parentElement && ele.parentElement.removeChild(ele);
                pushEle(ele);
            }
            else if (typeof ele === "string"){
                var converter = document.createElement("div");
                converter.innerHTML = ele;
                stateless.consume(converter.children);
            }
            else if (ele.length && ele[0] ){ //
                for (var i = 0; i < ele.length; i++){
                    stateless.consume(ele[i]);
                }
            }
            else {
                throw new Error("Invalid inputs");
            }
            return context.stateless;
        }
    });

    Object.defineProperty(statelessOpps, "import", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function(url){
            ajaxGet(url, function(xmlhttp){
                stateless.consume(xmlhttp.responseText);
            }, function(xmlhttp){
                throw new Error("The URL failed to load");
            });
            return context.stateless;
        }
    });

    Object.defineProperty(statelessOpps, "register", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: statelessOpps.consume
    });

    Object.defineProperty(statelessOpps, "each", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function(callback){
            for (var i = 0; i < length; i++){
                callback(context.stateless[i], i);
            }
            return context.stateless;
        }
    })

    Object.defineProperty(statelessOpps, "instantiate", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function(identifyer){ // public static function
            if (stateless[identifyer]) {
                var instance = new templateInstance(stateless[identifyer].cloneNode(true));
                return instance;
            }
            else {
                throw new Error( identifyer + " cannot be found in the template librare");
            }
        }
    });

})(this)
