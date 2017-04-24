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
})(this)