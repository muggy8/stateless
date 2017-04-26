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

        var regID;
        if (ele.dataset.regId){
            regID = ele.dataset.regId;
        }
        else {
            regID = registeredWrap.push(self)-1;
            ele.setAttribute('data-reg-id', regID);
        }

        console.log(regID);

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

    context.Templater = function(ele){
        
    }
})(this)
