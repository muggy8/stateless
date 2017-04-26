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

    var domChunk = context.domChunk = function(ele){
        if (!ele){
            throw "No element selected";
        }

        // detect if new or just calling it
        var self = (context == this)? {} : this;

        // initialize some private values
        self.ele = ele;
        console.log(ele.prototype, ele.__proto__)
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

    context.instantiateableChunk = function(ele){
        // detect if new or just calling it
        var self = (context == this)? {} : this;

        // simulate "class instantiateableChunk extends domChunk"
        var actualChunk = new domChunk(ele);
        Object.setPrototypeOf(self, actualChunk);

        // limit the instantiate function here
        actualChunk.instantiate = function(){

        }

        return self;
    }
})(this)
