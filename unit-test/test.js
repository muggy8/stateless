
    "use strict"
    function verdict(verdict, input, output, test){
        this.verdict = verdict
        this.input = input
        this.output = output
        this.test = test
    }

    var scopeIdentifyer = {
        addClass: "function",
        append: "function",
        appendChild: "function",
        attr: "function",
        css: "function",
        data: "function",
        define: "function",
        element: "function",
        elements: "function",
        hasClass: "function",
        html: "function",
        include: "function",
        off: "function",
        on: "function",
        once: "function",
        property: "function",
        removeClass: "function",
        render: "function",
        unlink: "function"
    }

    var isInstance = overload()
        .args(scopeIdentifyer).use(function(){
            return true
        })
        .args().use(function(){
            return false
        })

    var results = {}
    function createTesterFunction(nameOfFunctionToTest, objectFunctionBelongsTo = stateless){
        var selfResults = results[nameOfFunctionToTest] = results[nameOfFunctionToTest] || []
        var checkerFn = function(){
            var argList = Array.prototype.splice.call(arguments, 0)
            var expectedChecker = argList.splice(-1)[0]

            var output
            try {
                output = objectFunctionBelongsTo[nameOfFunctionToTest].apply(objectFunctionBelongsTo, argList)
            }
            catch(o3o){
                output = o3o
            }
            if (typeof expectedChecker == "function"){
                if (expectedChecker(output, argList)){
                    selfResults.push(new verdict("pass", argList, output, checkerFn))
                }
                else {
                    selfResults.push(new verdict("failed", argList, output, checkerFn))
                }
            }
            else {
                if (output === expectedChecker){
                    selfResults.push(new verdict("pass", argList, output, checkerFn))
                }
                else {
                    selfResults.push(new verdict("failed", argList, output, checkerFn))
                }
            }
        }
        return checkerFn
    }

    var objectEquivalence = (function(){
        // a helper function that's limited to the current scope that helps do the object equivalence stuff
        function removeKeyFromList(key, list){
            var keyIndex = list.indexOf(key)
            if (keyIndex > -1){
                list.splice(keyIndex, 1)
            }
        }

        // return an anonymous that does the comparison of a and b
        return function(a, b){
            var equivalence = true,
                keyA = Object.keys(a),
                keyB = Object.keys(b)

            // they should have the same number of keys if they dont we know it's not the same and return (this is a performance optimization)
            if (keyA.length != keyB.length){
                return false
            }

            // we check only on A. if we assume that they are the same then by the end of this process we try to disprove  that
            keyA.forEach(function(key){
                // a pretty big tell is if the key names don't match so we just stop and we know it's not the same
                if (typeof a[key] !== typeof b[key]){
                    return equivalence = false
                }

                // if it's an object we want to recursively loop through sub items and find if the sub items match too
                if (typeof a[key] === "object"){ // we got here so type of b[key] should also equal object
                    var subIsEqual = objectEquivalence(a[key], b[key])
                    if (subIsEqual){
                        // if the sub objects are the same, we can remove the same item from keyB
                        removeKeyFromList(key, keyB)
                        //keyB.splice(keyB.indexOf(key), 1)
                    }
                    // and we update / perserve the current equivalence state
                    equivalence = equivalence && subIsEqual
                }
                // if it's not an object, it's a basic data property so we can do a strict === comparison
                else if (a[key] === b[key]){
                    // if it does match we can cut this key out of the key B set
                    removeKeyFromList(key, keyB)
                    //keyB.splice(keyB.indexOf(key), 1)
                }
            })
            // by the end. we have looped through all the A keys and if the A keys match the B keys the B keys should be empty by now. if it's not then obviously the data doesn't match so we mark it false
            if (keyB.length != 0){
                equivalence = false
            }
            return equivalence
        }
    })()

    ;(function(testRegister){
        testRegister(document.querySelector(".div"), function(output){
            try {
                var t1 = output == stateless,
                    t2 = stateless[0].outerHTML == '<div class="div"></div>',
                    t3 = stateless[0].getAttribute("id") == null,
                    t4 = stateless.length === 1,
                    t5 = document.querySelector(".div:not([id])") == null
                if (t1 && t2 && t3 && t4 && t5){
                    return true
                }
                return false
            } catch(o3o){
                return false
            }
        })

        testRegister(document.querySelector("div#wrap"), function(output){
            try {
                var t1 = output == stateless,
                    t2 = stateless[1].getAttribute("id") == null ,
                    t3 = stateless[1].outerHTML == '<div class="wrap"></div>',
                    t4 = stateless.length === 2,
                    t5 = stateless.wrap == stateless[1],
                    t6 = document.querySelector("div#wrap") == null
                if (t1 && t2 && t3 && t4 && t5 && t6){
                    return true
                }
                return false
            } catch(o3o){
                return false
            }
        })

        testRegister(document.querySelector("span#wrap"), function(output, input){
            input = input[0]
            try {
                var t1 = output instanceof Error,
                    t2 = input.getAttribute("id") != null,
                    t3 = stateless[1] != input,
                    t4 = stateless.wrap == stateless[1],
                    t5 = typeof stateless[2] == "undefined",
                    t6 = document.querySelector("span#wrap") != null
                if (t1 && t2 && t3 && t4 && t5 && t6){
                    return true
                }
                return false
            } catch(o3o){
                return false
            }
        })

        testRegister(`<div id="was-string"></div>`, function(output, input){
            input = input[0]
            try {
                input = input.replace("id", "class")
                var t1 = output == stateless,
                    t2 = stateless[2].outerHTML == input,
                    t3 = stateless.length === 3,
                    t4 = stateless["was-string"] == stateless[2]
                if (t1 && t2 && t3 && t4){
                    return true
                }
                return false
            } catch(o3o){
                return false
            }
        })

        testRegister(`<div id="was-string-2" class="some-other-class"></div>`, function(output, input){
            input = input[0]
            try {
                input = input.replace("id", "class")
                var t1 = output == stateless,
                    t2 = stateless[3].outerHTML == `<div class="was-string-2 some-other-class"></div>`,
                    t3 = stateless.length === 4,
                    t4 = stateless["was-string-2"] == stateless[3]
                if (t1 && t2 && t3 && t4 ){
                    return true
                }
                return false
            } catch(o3o){
                return false
            }
        })

        testRegister(`
            <div id="was-string-4"></div>
            <div id="was-string-5" class="some-other-class"></div>
        `, function(output, input){
            input = input[0]
            try {
                input = input.replace("id", "class")
                var t1 = output == stateless,
                    t2 = stateless[4].outerHTML == `<div class="was-string-4"></div>`,
                    t3 = stateless["was-string-4"] == stateless[4],
                    t4 = stateless[5].outerHTML == `<div class="was-string-5 some-other-class"></div>`,
                    t5 = stateless["was-string-5"] == stateless[5],
                    t6 = stateless.length === 6
                if (t1 && t2 && t3 && t4 && t5 && t6){
                    return true
                }
                return false
            } catch(o3o){
                return false
            }
        })
    })(createTesterFunction("register", stateless))

    ;(function(testInstantiate){
        testInstantiate(0, function(output, input){
            var t1 = isInstance(output),
                t2 = output.element().outerHTML == `<div class="div"></div>`
            if (t1 && t2){
                return true
            }
            else {
                return false
            }
        })

        testInstantiate("was-string", function(output, input){
            var t1 = isInstance(output),
                t2 = output.element().outerHTML == `<div class="was-string"></div>`
            if (t1 && t2){
                return true
            }
            else {
                return false
            }
        })
    })(createTesterFunction("instantiate", stateless))

    ;(function(testEach, itemList = [], indexList = []){
        testEach(function(item, index){
            itemList.push(item)
            indexList.push(index)
        }, function(output, input){
            var createdItemList = []
            var createdIndexList = []
            for(var i = 0; i < stateless.length; i++){
                createdItemList.push(stateless[i])
                createdIndexList.push(i)
            }

            var t1 = output == stateless ,
                t2 = objectEquivalence(createdItemList, itemList),
                t3 = objectEquivalence(createdIndexList, indexList)

            if(t1 && t2 && t3){
                return true
            }
            return false
        })
    })(createTesterFunction("each", stateless))

    ;(function(testWatch, testEmit, eventStore = {}){
        var unwatchA1, unwatchA2, unwatchNameless1, unwatchNameless2
        testWatch("testA", function(eventType, data){
            eventStore[eventType] = eventStore[eventType] || []
            eventStore[eventType].push({
                callback: eventType + "-1",
                payload: data
            })
        }, function(output, input){
            unwatchA1 = output
            if (typeof output == "function"){
                return true
            }
            return false
        })

        testWatch("testA", function(eventType, data){
            eventStore[eventType] = eventStore[eventType] || []
            eventStore[eventType].push({
                callback: eventType + "-2",
                payload: data
            })
        }, function(output, input){
            unwatchA2 = output
            if (typeof output == "function"){
                return true
            }
            return false
        })

        testWatch(function(eventType, data){
            eventStore[eventType] = eventStore[eventType] || []
            eventStore[eventType].push({
                callback: eventType + "-none-1",
                payload: data
            })
        }, function(output, input){
            unwatchNameless1 = output
            if (typeof output == "function"){
                return true
            }
            return false
        })

        testWatch(function(eventType, data){
            eventStore[eventType] = eventStore[eventType] || []
            eventStore[eventType].push({
                callback: eventType + "-none-2",
                payload: data
            })
        }, function(output, input){
            unwatchNameless2 = output
            if (typeof output == "function"){
                return true
            }
            return false
        })

        var emitObj = {
            foo: "bar"
        }

        var emitObjReducer = function(currentState, item){
            if (item.payload != emitObj){
                return false
            }
            return currentState
        }

        var emitNullReducer = function(currentState, item){
            return currentState && objectEquivalence(item.payload, {})
        }

        testEmit("unregistered", emitObj, function(output, input){
            var t1 = output == stateless,
                t2 = eventStore.unregistered.length == 2,
                t3 = eventStore.unregistered.reduce(emitObjReducer, true),
                t4 = objectEquivalence(eventStore.unregistered.map(function(item){
                    return item.callback
                }), ["unregistered-none-1", "unregistered-none-2"])
            if (t1 && t2 && t3 && t4){
                return true
            }
            return false
        })

        testEmit("testA", emitObj, function(output, input){
            var t1 = output == stateless,
                t2 = eventStore.testA.length == 4,
                t3 = eventStore.testA.reduce(emitObjReducer, true),
                t4 = objectEquivalence(eventStore.testA.map(function(item){
                    return item.callback
                }), ["testA-1", "testA-2", "testA-none-1", "testA-none-2"])

            if (t1 && t2 && t3 && t4){
                return true
            }
            return false
        })

        testEmit("somethingElse", function(output, input){
            var t1 = output == stateless ,
                t2 = eventStore.somethingElse.length == 2 ,
                t3 = eventStore.somethingElse.reduce(emitNullReducer, true) ,
                t4 = objectEquivalence(eventStore.somethingElse.map(function(item){
                    return item.callback
                }), ["somethingElse-none-1", "somethingElse-none-2"])

            if (t1 && t2 && t3 && t4){
                return true
            }
            return false
        })

        unwatchA1()

        testEmit("testA", emitObj, function(output, input){
            var t1 = output == stateless,
                t2 = eventStore.testA.length == 7,
                t3 = eventStore.testA.reduce(emitObjReducer, true),
                t4 = objectEquivalence(eventStore.testA.map(function(item){
                    return item.callback
                }), ["testA-1", "testA-2", "testA-none-1", "testA-none-2", "testA-2", "testA-none-1", "testA-none-2"])

            if (t1 && t2 && t3 && t4){
                return true
            }
            return false
        })

        // move the old tests over to old test
        eventStore.oldTestA = eventStore.testA
        delete eventStore.testA

        testEmit("testA", function(output, input){
            var t1 = output == stateless,
                t2 = eventStore.testA.length == 3,
                t3 = eventStore.testA.reduce(emitNullReducer, true),
                t4 = objectEquivalence(eventStore.testA.map(function(item){
                    return item.callback
                }), ["testA-2", "testA-none-1", "testA-none-2"])

            if (t1 && t2 && t3 && t4){
                return true
            }
            return false
        })

        unwatchNameless1()

        testEmit("unnamed1", emitObj, function(output){
            var t1 = output == stateless,
                t2 = eventStore.unnamed1.length == 1,
                t3 = eventStore.unnamed1.reduce(emitObjReducer, true),
                t4 = objectEquivalence(eventStore.unnamed1.map(function(item){
                    return item.callback
                }), ["unnamed1-none-2"])

            if (t1 && t2 && t3 && t4){
                return true
            }
            return false
        })

        testEmit("unnamed2", emitObj, function(output){
            var t1 = output == stateless,
                t2 = eventStore.unnamed2.length == 1,
                t3 = eventStore.unnamed2.reduce(emitObjReducer, true),
                t4 = objectEquivalence(eventStore.unnamed2.map(function(item){
                    return item.callback
                }), ["unnamed2-none-2"])

            if (t1 && t2 && t3 && t4){
                return true
            }
            return false
        })
    })(createTesterFunction("watch", stateless), createTesterFunction("emit", stateless))

    ;(function(testPlugin){
        testPlugin(function(output){
            var t1 = output === stateless
            if (t1) {
                return true
            }
            return false
        })

        testPlugin("none-existant-plugin", function(output){
            var t1 = output === stateless
            if (t1) {
                return true
            }
            return false
        })


        testPlugin("overload", overload, function(output){
            var t1 = output === stateless,
                t2 = output.overload === overload
            if (t1 && t2){
                return true
            }
            return false
        })

        testPlugin("overload", function(output){
            var t1 = output === overload
            if (t1){
                return true
            }
            return false
        })

        var wrapPlugin = {foo: "bar"}
        testPlugin("wrap", wrapPlugin, function(output){
            var t1 = output === stateless,
                t2 = output.wrap !== wrapPlugin
            if (t1 && t2){
                return true
            }
            return false
        })

        testPlugin("wrap", function(output){
            var t1 = output === wrapPlugin
            if (t1){
                return true
            }
            return false
        })
    })(createTesterFunction("plugin", stateless))

    ;(function(testView){
        var viewTemplateEle = document.createElement("div");
        viewTemplateEle.appendChild(document.createElement("hr"))
        viewTemplateEle.appendChild(document.createElement("p")).innerText="This is a test thing"
        viewTemplateEle.appendChild(document.createElement("p")).innerText="Why am i doing this?"
        viewTemplateEle.appendChild(document.createElement("hr"))
        viewTemplateEle.id = "view"
        viewTemplateEle.setAttribute("class", "super")

        var viewTemplateText = `<div id="id-1" class="class-1 class-2">
            <hr>
            <p>This is the string version</p>
            <p>I'm pretty sure most people will be doing this</p>
            <hr>
        </div>`

        var viewDoubleTemplateText = `<div id="id-1" class="class-1 class-2">
            <hr>
            <p>This is the string version</p>
            <p>I'm pretty sure most people will be doing this</p>
            <hr>
        </div><div id="id-2" class="class-1 class-2">Not sure how this will work actually</div>`

        var pretestStatelessLen = stateless.length

        testView(viewTemplateEle, function(output){
            var t1 = isInstance(output),
                t2 = output.element() === viewTemplateEle,
                t3 = stateless.length === pretestStatelessLen,
                t4 = viewTemplateEle.getAttribute("id") === null,
                t5 = viewTemplateEle.className === "view super"
            if (t1 && t2 && t3 && t4 && t5){
                return true
            }
            return false
        })

        testView(viewTemplateText, function(output){
            var t1 = isInstance(output),
                t2 = output.element().outerHTML.replace(/\n\s*/g, "") === `<div class="id-1 class-1 class-2">
                    <hr>
                    <p>This is the string version</p>
                    <p>I'm pretty sure most people will be doing this</p>
                    <hr>
                </div>`.replace(/\n\s*/g, ""),
                t3 = stateless.length === pretestStatelessLen
            if (t1 && t2 && t3){
                return true
            }
            return false
        })

        testView(viewDoubleTemplateText, function(output){
            var t1 = output instanceof Error,
                t2 = stateless.length === pretestStatelessLen
            if (t1 && t2){
                return true
            }
            return false
        })
    })(createTesterFunction("view", stateless))

    // display the various verdicts

    function displayResultRow(test, index, results) {
        var div, title, message
        div = document.createElement("div")
        div.appendChild(title = document.createElement("strong"))
        title.appendChild(document.createTextNode(test + " " + index + ": "))
        div.appendChild(document.createTextNode(results.verdict))

        if (results.verdict == "failed"){
            div.style.backgroundColor = "red"

            div.appendChild(message = document.createElement("div"))
            message.appendChild(document.createTextNode("Please see console for further details"))
            console.warn(test, index , results)
        } else {
            console.log(test, index , results)
        }
        document.body.appendChild(div)
    }

    for(var test in results){
        results[test].forEach(function(item, index){
            displayResultRow(test, index, item)
        })
        document.body.appendChild(document.createElement("hr"))
    }
