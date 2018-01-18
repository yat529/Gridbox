// Mini Libruary
(function myTool(global){
    
    // RegExp for Selectors
    var sReg = /^(?:\.([\w-]+)|\#([\w-]+))$/;

    var init = {

        // 
        // -------------------- Core Functions --------------------------
        // 
        
        extend: function(obj, name){
            if(typeof obj !== "object" && typeof obj !== "function") return "Argument must be an Object or function!";
            
            if(typeof obj === "object"){
                for(var prop in obj){
                    if(this[prop]) return "An object with same name already exists!";
                    this[prop] = obj[prop];
                }
            }else if(typeof obj === "function"){
                var name = name || obj[name];
                if(!name) "Function cannot be anonymouse!";
                this[name] = obj;
            }

            return this;
        },

        // Selector API, can use .classname or #id
        get: function(selector, ctx){
            if(typeof selector !== "string") return "Selector must be String Type";
            var match = sReg.exec(selector),
                ctx;

            if(!match) return "No selector matches!";

            ctx = (ctx && typeof ctx === "object")? ctx : document;

            if(match[1]){
                this[0] = ctx.getElementsByClassName(match[1]);
            }else if(match[2]){
                this[0] = ctx.getElementById(match[2]);
            }

            this.length = 1;
            return this;
        },

        // log the object
        log: function(){
            console.log(this);
        },

        // loop thru an Array
        each: function(arr, callback){
            var array,
                fn;

            // check if arr is passed as 1st param
            if(arguments.length === 2){
                if(!arr.length && typeof callback !== "function") return "Parameter Type Error!";
                array = arr;
                fn = callback;
            }

            // if only one parameter passed in
            if(arguments.length === 1){
                // if only pass in array, but not callback function, return the array
                // if(arr.length) return arr;
                // if only pass in callback function
                if(typeof arr === "function") fn = arr;
                // if HTMLCollection array is exists, assign it to array
                if(this[0]) array = this[0];
            }

            // now array & fn is ready, do something
            for(var i = 0; i < array.length; i++){
                // each iteration is an IIFE, so that this of the callback function 
                // in each iteration is unique
                (function(j, f){
                    // New object created each time, so this will refer to this new obj
                    var obj = Object.create(init);
                    obj[0] = array[j];
                    // change this and the argument to obj
                    f.call(obj, obj);
                })(i, fn);
            }
        },

        // Get first item in the array
        first: function(){
            // this[0] = this[0][0];
            // return this;
            return createObj( this[0][0] );
        },

        // Get last item in the array
        last: function(){
            // this[0] = this[0][(this[0].length - 1)];
            // return this;
            return createObj( this[0][(this[0].length - 1)] );
        },

        // Get array length
        getLength: function() {
            return this[0].length;
        },

        // add to array
        add: function(elem){
            if(typeof this[0].length) this[0].push(elem[0]);
            return this;
        },

        // Set time out
        wait: function(time, callback){
            setTimeout(callback.bind(this), time);
        },

    };

    // 
    // -------------------- Entry Point --------------------------
    // 

    // Object Constructor
    var iAm = function(selector){

        // if only extend methods, for plugins
        if(!selector) return init;

        var F = Object.create(init);

        if(sReg.exec(selector)){
            return F.get(selector);
        }else if(selector === global){
            return createObj(selector);
        }else if(selector === document){
            return createObj(document);
        } else {
            // wrap DOM obj
            return createObj(selector);
        }
        
    };

    // 
    // -------------------- Helper Functions --------------------------
    // 

    // Create an im Object
    // Input is HTMLelement or HTMLCollection
    var createObj = function(elem){
        var obj = Object.create(init);
        obj[0] = elem;
        obj.length = 1;
        return obj;
    };

    // Check if is im Object
    // Input is im Object
    var isObj = function(obj){
        return (obj.length && obj[0] && typeof obj[0])? true : false;
    }

    // 
    // -------------------- Core Methods --------------------------
    // 

    init.extend({

        // DOM Traversal
        // Return children Array
        children: function(){
            return createObj( this[0].children );
        },

        // Get firstChild of each element in an array
        // Return an Array
        eachChild: function(){
            var match = []
            this.each(function(i){
                match.push(i.firstChild()[0]);
            });
            return createObj( match );
        },

        // Return parent Object
        parent: function(){
            // check if parent is html
            if(!this[0].parentElement) return this;
            return createObj( this[0].parentElement );
        },

        // Return first child Object
        firstChild: function(){
            return createObj( this[0].firstElementChild );
        },

        // Return lastChild Object
        lastChild: function(){
            return createObj( this[0].lastElementChild );           
        },

        // Return nextSibling Object
        nextSibling: function(){
            return createObj( this[0].nextElementSibling );  
        },

        // Return lastSibling Object
        lastSibling: function(){
            return createObj( this[0].parentElement.children[this[0].parentElement.children.length - 1] ); 
        },

        // Return siblings Array
        siblings: function(){
            if(!this[0].parentElement) return this;
            return createObj( this[0].parentElement.children ); 
        },

        // Return nextSiblings Array
        nextSiblings: function(){
            var match = [],
                next = this[0].nextElementSibling;

            while(next){
                match.push(next);
                next = next.nextElementSibling;
            }

            return createObj( match ); 
        },

        // Return previousSiblings Array
        previousSiblings: function(){
            var match = [],
            next = this[0].previousElementSibling;

            while(next){
                match.push(next);
                next = next.previousElementSibling;
            }

            return createObj( match ); 
        },

        // Return all the matched parent in an array
        parentUntil: function(selector){
            var match = sReg.exec(selector),
                parent = this.parent(),
                parentList = [];

            if(match){
                // if .classname
                if(match[1]){
                    while(parent[0].nodeType === 1){
                        parentList.push(parent[0]);  
                        if(parent.hasClass(match[1])){           
                            break;
                        }
                        parent = parent.parent();
                    }
                }
                // if #id
                else if(match[2]){
                    while(parent[0].nodeType === 1){
                        parentList.push(parent[0]);     
                        if(parent[0].id === match[2]){            
                            break;
                        }
                        parent = parent.parent();
                    }
                }
            }

            // return a Object with HTMLCollection
            return createObj(parentList);
        },
        
        // Get all attribute of a DOM element
        data: function(attr){
            if(typeof attr !== "string") return "Attributes must be String Type";
            return this[0].getAttribute("data-" + attr) || undefined;
        },

        // toggle classname of a DOM element
        toggleClass: function(cls){
            if(typeof cls !== "string") return "Class name must be String Type";
            this[0].classList.toggle(cls);
            return this;
        },

        // add classname
        addClass: function(cls){
            if(typeof cls !== "string") return "Class name must be String Type";
            this[0].classList.add(cls);
            return this;
        },

        // remove classname
        removeClass: function(cls){
            if(typeof cls !== "string") return "Class name must be String Type";
            this[0].classList.remove(cls);
            return this;
        },

        // check if has a classname
        hasClass: function(cls){
            if(typeof cls !== "string") return "Class name must be String Type";
            if(!this[0]) return false;
            return this[0].classList.contains(cls)? true : false;
        },

        // css
        // Argument: String: the css property name, or Object: in key value pair
        css: function(property){
            if(typeof property !== "string" && typeof property !== "object") return "Property can be only String or Object type";

            // if prop is String, then get the css property
            if(typeof property === "string"){
            return global.getComputedStyle(this[0], null).getPropertyValue(property); // Note: the pseudo element is ignored
            }

            // if prop is Object, then set the css property
            // loop thru the obj, stringnify the obj, pass in setAttribute() method
            if(typeof property === "object"){
                var style = "";
                for(var prop in property){
                    style += prop + ":" + property[prop] + ";";
                }
                this[0].setAttribute("style", style);
                return this;
            }
        },

        // toggle display property
        toggle: function(){
            global.getComputedStyle(this[0]).getPropertyValue("display") === "block"?
                this[0].setAttribute("style", "display:none;"):
                this[0].setAttribute("style", "display:block;");
            return this;
        },

        // click event
        click: function(callback){
            if(typeof callback !== "function") return "Paramete Type Error";
            this[0].addEventListener("click", callback.bind(this), false);
        },

        // if not click on this element
        notClickOn: function(elem, callback){
            if(typeof callback !== "function") return "Parameter is not in Function Type!";
            if(!isObj(elem)) return "Must pass in an im Object!";

            document.addEventListener("click", (function(e){
                e.preventDefault();
                // if HTMLCollection
                if(elem[0].length){
                    var inArray = [];
                    elem.each(function(i){
                        e.target === i[0]? inArray.push(true) : inArray.push(false);
                    });
                    if(!inArray.includes(true)) callback.call(this);
                }
                // if HTMLElement
                else{
                    if(e.target !== elem[0]) callback.call(this);
                } 
            }).bind(this), false);
            return this;
        },

        // focus event
        onfocus: function(callback) {
            if(typeof callback !== "function") return "Parameter Type Error";
            this[0].addEventListener("focus", callback.bind(this), false);
        },

        focus: function() {
            this[0].focus();
        },

        // blur event (out of focus)
        onblur: function(callback) {
            if(typeof callback !== "function") return "Parameter Type Error";
            this[0].addEventListener("blur", callback.bind(this), false);
        },

        // keydown event
        keydown: function(callback) {
            if(typeof callback !== "function") return "Parameter Type Error";
            this[0].addEventListener("keydown", callback.bind(this), false);
        },

        // keyup event
        keyup: function(callback) {
            if(typeof callback !== "function") return "Parameter Type Error";
            this[0].addEventListener("keyup", callback.bind(this), false);
        }

    });

    // 
    // -------------------- Exit Point --------------------------
    // 

    // Export to Gloabl
    global.im = im = iAm;



    // 
    // -------------------- Gridbox Plugins --------------------------
    // 

    init.extend({

        // -----------------------------------------------------------
        //                  Input Length Check
        // -----------------------------------------------------------
        // Description: Use to check input string length. Will check
        //              validity, and display status icon
        // -----------------------------------------------------------
        // Parameter:   min
        // Description: minimun length
        // Parameter:   max
        // Description: maximun length
        // Parameter:   statusElem (Optional)
        // Description: the element object for the check icon
        // -----------------------------------------------------------
        // Note:  if statusElem parameter is not passed, will use the 
        //        default value. The default HTML template is requied
        // -----------------------------------------------------------

        lengthCheck: function(min, max, statusElem){
            var self = this;
            var status = statusElem || self.nextSibling().nextSibling();

            self.onfocus(function(){
                resetStatus(status)
            });

            self.onblur(function(){
                if(self[0].value.length >= min && self[0].value.length <= max) {
                    status.addClass("valid");
                } else {
                    status.addClass("invalid");
                }
            });
        },

        // -----------------------------------------------------------
        //                  Format Phone Number Input
        // -----------------------------------------------------------
        // Description: Use for <input type="tel">, add format symbol
        //              to the inpunt value. Will also check for
        //              input validity, and show status icon
        // Note:        (xxx) xxx-xxxx format is used
        // -----------------------------------------------------------
        // Parameter:   statusElem (Optional)
        // Description: the element object for the check icon
        // -----------------------------------------------------------
        // Note:  if statusElem parameter is not passed, will use the 
        //        default value. The default HTML template is requied
        // -----------------------------------------------------------

        formatNumber: function(statusElem){

            var self = this;
            var status = statusElem || self.nextSibling().nextSibling();
            var regexp = /^\([0-9]{3}\)\s{1}[0-9]{3}\-[0-9]{4}$/;
     
            // define format
            // format array will have 3 items
            var seporator = ["(",")", " ","-"];

            self.keydown(function(evt){               
                addSeporator(self, evt, seporator, true);
            });

            self.keyup(function(evt){
                // reset all classes
                if(self[0].value.length <= 13) {
                    resetStatus(status)
                }

                addSeporator(self, evt, seporator, false);

                // add success class if length and format is valid, else add invalid
                if(self[0].value.length === 14) {
                    resetStatus(status)

                    if(regexp.test(self[0].value)) {
                        status.addClass("valid");
                    } else {
                        status.addClass("invalid");
                    }    
                }

                // add invalid class
                if(self[0].value.length > 14 && !status.hasClass("invalid")) {
                    status.removeClass("valid");
                    status.addClass("invalid");
                }
            });

            // exit check (when lose focus)
            self.onblur(function(){
                resetStatus(status)

                if(regexp.test(self[0].value)) {
                    status.addClass("valid");
                } else {
                    status.addClass("invalid");
                }
            })

            // helper function
            function addSeporator(elem, event, seporator, initial){

                if(initial) {
                    // add initial seporators
                    if(event.keyCode !== 8 && !elem[0].value.length) {
                        elem[0].value += seporator[0];
                    }
                }

                if(event.keyCode !== 8 && elem[0].value.length === 4) {
                    elem[0].value += seporator[1];
                }
                if(event.keyCode !== 8 && elem[0].value.length === 5) {
                    elem[0].value += seporator[2];
                }
                if(event.keyCode !== 8 && elem[0].value.length === 9) {
                    elem[0].value += seporator[3];
                }
            }
        },

        // -----------------------------------------------------------
        //                  Show Input Password
        // -----------------------------------------------------------
        // Description: Use for <input type="password">, change its
        //              type to "text" to show the password. Will
        //              check for input validity and show status icon
        // -----------------------------------------------------------
        // Parameter:   toggleElem (Optional)
        // Description: the element object for the toggler
        // Parameter:   statusElem (Optional)
        // Description: the element object for the check icon
        // -----------------------------------------------------------
        // Note:  if the two parameter is not passed, will use the 
        //        default value. The default HTML template is requied
        // -----------------------------------------------------------

        showPassword: function(toggleElem, statusElem){
            var self = this;
            var toggle = toggleElem || self.lastSibling();
            var status = statusElem || self.nextSibling().nextSibling();

            // show the icon
            self.onfocus(function(){
                toggle.css({ opacity: 1 });
                resetStatus(status);
            });

            // hide the icon
            self.onblur(function(){
                toggle.css({ opacity: 0 });

                // exit validation
                if(self[0].value.length >= 6 && self[0].value.length <= 12) {
                    status.addClass("valid");
                } else {
                    status.addClass("invalid");
                }
            });

            // toggle password
            toggle.click(function(){

                toggle.toggleClass("active");
                self.focus();

                if(self[0].type === "password") {
                    self[0].type = "text";
                } else {
                    self[0].type = "password";
                }
            })
        },

    });

    // 
    // -----------Gridbox Plugin Helper Functions-----------------
    // 

    // -----------------------------------------------------------
    //              reset the check icon classes
    // -----------------------------------------------------------
    // Parameter: statusElem
    // Description: the element object for the check icon
    // -----------------------------------------------------------
    function resetStatus(statusElem) {
        if(statusElem.hasClass("valid")) statusElem.removeClass("valid");
        if(statusElem.hasClass("invalid")) statusElem.removeClass("invalid");
    }


    // 
    // -------------------- Gridbox Plugins --------------------------
    // 

    init.extend({

        // -----------------------------------------------------------
        //                         Carousel
        // -----------------------------------------------------------
        // Description: Enable to carousel effect for HTML showcase
        //              element
        // -----------------------------------------------------------
        // Parameter:   min
        // Description: minimun length
        // 
        // -----------------------------------------------------------
        // Note:  Must use gridbox carousel format 
        // -----------------------------------------------------------


        carousel: function() {
        
            var self = this;
            var toggleLeft = self.get(".toggle").first().get(".left").first() || null;
            var toggleRight = self.get(".toggle").first().get(".right").first() || null;
            var showcase = self.get(".showcase").first() || null;
            var slides = self.get(".showcase-carousel") || null;
    
            if(!toggleLeft || !toggleRight || !showcase || !slides) {
                return new Error("Element Missing. Must use default HTML Template Format");
            }
    
            var slidesLength = slides.getLength();
            var counter = 0;
    
            // classes to toggle
            // on slides - waiting, active
            // on showcase - deactive
    
            // click right counter ++, slides[counter - 1] add class active
            // if counter == slidesLength, reset showcase deactive
            // click left counter --
    
            // console.log(slides);
    
            toggleLeft.click(function(){
    
                counter--;
    
                if(counter < 0) {
                    counter = slidesLength;
                    showcase.addClass("hide");
                    im(slides[0][counter - 1]).addClass("show");
                } else {
                    if(counter === 0) {
                        im(slides[0][counter]).removeClass("show");
                        showcase.removeClass("hide");
                    } else {
                        im(slides[0][counter]).removeClass("show");
                        im(slides[0][counter - 1]).addClass("show");
                    } 
                }
            });
    
            toggleRight.click(function(){
    
                if(counter === slidesLength) {
                    im(slides[0][counter - 1]).removeClass("show");
                    counter = 0;
                    showcase.removeClass("hide");
                } else {
                    if(counter === 0) {
                        showcase.addClass("hide");
                        im(slides[0][counter]).addClass("show");
                    } else {
                        im(slides[0][counter - 1]).removeClass("show");
                        im(slides[0][counter]).addClass("show");
                    }
                    counter++;
                } 
            });
    
        }

    });

})(window);






