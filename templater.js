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
    var templateInstance = context.templateInstance = function(ele){
        // detect if new or just calling it
        var self = (context == this)? {} : this;

        if (!ele){
            throw "No element selected";
        }
        // initialize some private values
        self.ele = ele;

        var insertAt = ele.querySelector("ins") || ele;
        var children = [];
        var parent = [];

        // set public methods into the prototype of this object.
        var public_method = {};
        Object.setPrototypeOf(self, public_method);

        public_method.on = function(){

        }

        public_method.off = function(){

        }

        public_method.once = function(){

        }

        public_method.appendChild = function(){

        }

        public_method.unlink = function(){

        }

        public_method.render = function(){

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

        return self;
    }


    // --------------------------------------------------------
    // Stateless object exposed to the main execution scope for managing and playing with the templates
    // --------------------------------------------------------
    context.stateless = {};
    var statelessOpps = {};
    Object.setPrototypeOf(context.stateless, statelessOpps);

    var length = 0;
    // public unchangeable variable
    Object.defineProperty(statelessOpps, "length", {
        enumerable: false,
        configurable: false,
        get: function(){
            return length;
        }
    });

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

    Object.defineProperty(statelessOpps, "consume", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function(ele){ // public static function
            if (ele instanceof HTMLElement){
                ele.parentElement && ele.parentElement.removeChild(ele);
                return pushEle(ele);
            }
            else if (typeof ele === "string"){
                var converter = document.createElement("div");
                converter.innerHTML = ele;
                stateless.consume(converter.children);
            }
            else if (ele.length && ele[0] ){ //
                for (var i = 0; i < ele.length; i++){
                    var el = ele[i];
                    el.parentElement && el.parentElement.removeChild(el);
                    pushEle(el);
                }
            }
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
            })
        }
    });

    Object.defineProperty(statelessOpps, "register", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: statelessOpps.consume
    });

    Object.defineProperty(statelessOpps, "forEach", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function(callback){
            for (var i = 0; i < length; i++){
                callback(context.stateless[i], i, context.stateless);
            }
        }
    })

    Object.defineProperty(statelessOpps, "instantiate", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function(identifyer){ // public static function

        }
    });

})(this)
