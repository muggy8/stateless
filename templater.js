(function(context){
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

    var registeredWrap = context.registeredWrap = [];

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

        return self;
    }

    context.instantiateable = function(ele){
        // detect if new or just calling it
        var self = (context == this)? {} : this;

        // simulate "class instantiateable extends templateInstance"
        var actualChunk = new templateInstance(ele);
        Object.setPrototypeOf(self, actualChunk);

        // limit the instantiate function here
        actualChunk.instantiate = function(){

        }

        return self;
    }

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
            ele.className = ele.id + " " + ele.className;
            ele.className = ele.className.replace(/(^\s|\s$)/);
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
            ele.parentElement.removeChild(ele);
            return pushEle(ele);
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
