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
            var match = sReg.exec(selector),
                ctx;

            if(!match) return "No selector matches!";

            ctx = (ctx && typeof ctx === "object")? ctx : document;

            if(match[1]){
                this[0] = ctx.getElementsByClassName(match[1]);
            }else if(match[2]){
                this[0] = document.getElementById(match[2]);
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
                    f.call(obj, j);
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
        } else if(typeof selector === "object") {
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

        // Query DOM
        find: function(selector) {
            var match = sReg.exec(selector);

            if(match[1]){
                return createObj( this[0].getElementsByClassName(match[1]) );
            }else if(match[2]){
                return createObj( document.getElementById(match[2]) );
            }
        },

        // DOM Manipulate
        // add html
        html: function(html) {
            this[0].innerHTML = html;
            return this;
        },

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
        attr: function(attr) {
            return this[0].getAttribute(attr) || undefined;
        },

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
        click: function(callback, bubbling){
            if(typeof callback !== "function") return "Paramete Type Error";

            var bubbling = bubbling === undefined ? true : bubbling;
            var callback = callback;

            this[0].addEventListener("click", (function(e) {
                if(!bubbling) {
                    if(this[0] === e.target) {
                        callback.call(this);
                    }
                } else {
                    callback.call(this);
                }
            }).bind(this), false);
              
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
        },

        // scroll event 
        // on element
        scroll: function(callback) {
            this[0].addEventListener("scroll", callback.bind(this), false);
        },

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
        //                         Navigation Bar
        // -----------------------------------------------------------
        // Description: enable the navigation bar toggle feature
        // -----------------------------------------------------------
        // Parameter:   name (optional)
        // Description: navigation bar theme name, modulized theme
        //              is used by default
        // -----------------------------------------------------------
        // Note:  Must use gridbox navbar template
        // -----------------------------------------------------------

        navbar: function(name) {

            var self = this;

            if(!name || name === "modulized") {

                var menuToggle = self.find("#menu-toggle"),
                    menuOvrly = self.find("#menu-overlay"),
                    brandname = self.find("#brandname"),
                    subToggles = self.find(".sub-toggle"),
                    mainMenu = self.find(".main").first();

                // check if key element is cached
                if(!menuToggle || !menuOvrly || !mainMenu)
                    throw new Error("HTML element missing. Must use defautl HTML template.");

                // show main menu
                menuToggle.click(function(){
                    this.toggleClass("active");
                    menuOvrly.toggleClass("show");
                    mainMenu.toggleClass("show");
                    // optional brand name text contrast feature
                    if(brandname) brandname.toggleClass("contrast");
                });

                // show sub menu (optional)
                if(subToggles) {
                    subToggles.each(function(){
                        this.click(function(){
                            this.toggleClass("clicked");
                            this.nextSibling().toggleClass("show");
                        });
                    });
                }
            }

            // if other themes, wirte code below
            // ...
        }
    })



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


        carousel: function(optionObj) {
        
            var self = this;

            // Toggle & Indicator Cache
            var arrowLeft = im(".toggle").first().get(".left").first() || null;
            var arrowRight = im(".toggle").first().get(".right").first() || null;
            var indicator = im(".indicator").first();

            // Slides Cache
            var slides = im(".showcase-carousel") || null;
    
            // Slides Counter
            var slidesLength = slides.getLength();
            var counter = 0;

            // options
            optionObj = optionObj || {arrowToggle: true, indicator: true};

            // check if slides exists
            if(!slides) return new Error("Slides Missing. Must use default HTML Template Format");

            // Check for option object
            if(typeof optionObj !== "object") return new Error("Option must be an Object");


            // if arrow toggle is choose
            if(optionObj.arrowToggle) {

                // check if arrow element exists
                if(!arrowLeft || !arrowRight) {
                    return new Error("Element Missing. Must use default HTML Template Format");
                }

                arrowLeft.click(function(){
                    // reset classes
                    slides.each(function(){
                        resetClasses(this, "remove", "show");
                    });

                    counter --;

                    // check counter
                    if(counter < 0) {
                        counter = slidesLength - 1;
                        im(slides[0][counter]).addClass("show");
                        
                    } else {
                        im(slides[0][counter]).addClass("show");            
                    }

                    // Update indicator
                    if(optionObj.indicator) {
                        indicator.children().each(function(){
                            resetClasses(this, "remove", "active");
                        });
                        im(indicator.children()[0][counter]).addClass("active");
                    }
                });

                arrowRight.click(function(){
                    // reset classes
                    slides.each(function(){
                        resetClasses(this, "remove", "show");
                    });

                    counter ++;

                    // check counter
                    if(counter === slidesLength) {                        
                        counter = 0;
                        im(slides[0][counter]).addClass("show");
                    } else {
                        im(slides[0][counter]).addClass("show");  
                    }

                    // Update indicator
                    if(optionObj.indicator) {
                        indicator.children().each(function(){
                            resetClasses(this, "remove", "active");
                        });
                        im(indicator.children()[0][counter]).addClass("active");
                    }
                });

            }

            // if indicator is choose
            if(optionObj.indicator) {
                // setup indicator span
                var html = '<span class="active"></span>';
                for(var i = 0; i < slidesLength - 1; i++) {
                    html += '<span></span>';
                }
                indicator.html(html);

                // assign click event
                indicator.children().each(function(i){
                    this.click(function(){
                        // reset classes
                        indicator.children().each(function(){
                            resetClasses(this, "remove", "active");
                        });
                        slides.each(function(){
                            resetClasses(this, "remove", "show");
                        });

                        // add classes
                        this.addClass("active");
                        im(slides[0][i]).addClass("show");
                        
                        // update counter
                        counter = i;
                    });
                });
            }

            // helper function
            function resetClasses(elem, action, cls) {
                if(action === "add") {
                    elem.addClass(cls);
                } else if(action === "remove") {
                    if(elem.hasClass(cls)) 
                        elem.removeClass(cls);
                }
            }
        }
    });

    // 
    // -------------------- Gridbox Plugins --------------------------
    //

    init.extend({
        // -----------------------------------------------------------
        //                     Parallax - Responsive
        // -----------------------------------------------------------
        // Description: give element with .parallax class a parallax
        //              effect
        // -----------------------------------------------------------
        // Parameter:   none
        // Description: none
        // -----------------------------------------------------------
        // Note:  element must have a .parallax class and encapsulate
        //        a <img> element with a .bg class 
        // -----------------------------------------------------------


        parallax: function() {

            var elem = this[0],
                bg = this.find(".bg").first()[0];
            
            var url = bg.getAttribute("src"),
                movement = {};
    
            loadImage(url)
                .then(function success(result) {
                    var imgWidth = result.naturalWidth,
                        imgHeight = result.naturalHeight,
                        winWidth = getWindowWidth(),
                        winHeight = getWindowHeight();
    
                    // initial setup
                    init(elem, bg, movement, imgWidth, imgHeight, winWidth, winHeight);
    
                    // update window width and height on resize
                    update(elem, bg, movement, imgWidth, imgHeight);
    
                    // run the animation on scroll
                    animate(elem, bg, movement, imgWidth, imgHeight);
                })
                .catch(function failure(error) {
                    console.error(error.name, error.message);
                });
    
            // Core functions
            // load image to retrieve image actual size
            function loadImage(url) {
                return new Promise(function(resolve, reject){
                    var img = new Image();
    
                    img.src = url;
                    img.onload = function() {
                        resolve(img);
                    }
                    img.onerror = function() {
                        reject( new Error("Could not load image at URL " + img.src + ".") );
                    }
                }); 
            }
    
            // init function
            function init(elem, bg, movement, imgWidth, imgHeight, winWidth, winHeight) {
                if(!movement || typeof movement !== "object") throw new Error("The movement object is not defined!");
    
                // setup background width and height, and display mode
                var fitMode = movement.fitMode = autoFit(bg, imgWidth, imgHeight, winWidth, winHeight);
    
                // set background position
                setPosition(bg, fitMode);
    
                // set background movement range
                var range = movement.range = setMovementRange(bg, fitMode, imgWidth, imgHeight, winWidth, winHeight);
    
                // get current position, and setup movement state
                var winHeight = getWindowHeight(),
                    scrollRange = elem.offsetHeight + winHeight,
                    scrollY = window.pageYOffset - elem.offsetTop + winHeight,
                    speed = scrollY / scrollRange;
    
                if(isVisible(elem)) {
                    bg.style.opacity = 1;
                    moveBackground(bg, fitMode, -speed, range, "px");
                } else {
                    bg.style.opacity = 0;
                }
            }
    
            // update image state on window resize
            function update(elem, bg, movement, imgWidth, imgHeight) {
                window.addEventListener("resize", function() {
    
                    var winWidth = getWindowWidth(),
                        winHeight = getWindowHeight();
    
                    init(elem, bg, movement, imgWidth, imgHeight, winWidth, winHeight);
                })
            }
    
            // animate parallax
            function animate(elem, bg, movement, imgWidth, imgHeight) {
                if(!movement || typeof movement !== "object") throw new Error("The movement object is not defined!");
    
                window.addEventListener("scroll", function(){
                    if(isVisible(elem)) {
                        var winHeight = getWindowHeight(),
                            scrollRange = elem.offsetHeight + winHeight,
                            range = movement.range,
                            fitMode = movement.fitMode,
                            scrollY = window.pageYOffset - elem.offsetTop + winHeight;

                        var speed = scrollY / scrollRange;
    
                        bg.style.opacity = 1;
                        moveBackground(bg, fitMode, -speed, range, "px");
                    } else {
                        bg.style.opacity = 0;
                    }
                });
            }
    
            // Helper functions
            // auto set the image size to conver the window/screen
            function autoFit(elem, imgWidth, imgHeight, winWidth, winHeight) {
                // first check for landscape fit
                // check w/h ratio
                var imgRatio = imgWidth / imgHeight;
                var winRatio = winWidth / winHeight;
    
                //  image width is larger than window width when height is equal => image height === window height
                if(imgRatio >= winRatio && imgWidth >= winWidth) {
                    elem.style.height = winHeight + "px";
                    elem.style.width = winHeight * imgRatio + "px";
    
                    return "landscape";
                } 
                //  image height is larger than window height when width is equal => image width === window width
                else if(imgRatio < winRatio && imgHeight > winHeight) {
                    elem.style.width = winWidth + "px";
                    elem.style.height = winWidth / imgRatio + "px";
    
                    return "portrait";
                }
                else {
                    // image size too small to conver the screen
                    throw new Error("Image size is too small to cover the screen. Minimum image dimension is " + winWidth + "px X " + winHeight + "px.");
                }
            }
    
            // set image element positions according to the fitMode
            function setPosition(elem, fitMode) {
                if(fitMode === "landscape") {
                    elem.style.top = 0;
                    elem.style.left = 0;
                } else if(fitMode === "portrait") {
                    elem.style.left = 0;
                    elem.style.top = "auto";
                    elem.style.bottom = 0;
                } else {
                    throw new Error("fitMode is missing. Please specify the fitMode to position the image.");
                }
            }
    
            // set image movement range during parallax
            function setMovementRange(elem, fitMode, imgWidth, imgHeight, winWidth, winHeight) {
                var imgRatio = imgWidth / imgHeight;
                var winRatio = winWidth / winHeight;
    
                if(fitMode === "landscape") {
                    return winHeight * imgRatio - winWidth;
                } else if(fitMode === "portrait") {
                    return winWidth / imgRatio - winHeight;
                } else {
                    throw new Error("fitMode is missing. Please specify the fitMode to set movement distance.");
                }
            }
    
            // move the background with specified css property
            function moveBackground(elem, fitMode, speed, range, unit) {
                if(fitMode === "landscape") {
                    elem.style.transform = "translateX(" + speed * range + unit + ")";
                } else if(fitMode === "portrait") {
                    elem.style.transform = "translateY(" + (- speed) * range + unit + ")";
                } else {
                    throw new Error("fitMode is missing. Please specify the fitMode to set movement.");
                }
            }
        }
    });

    // 
    // -----------Gridbox Plugin Helper Functions-----------------
    // 

    // -----------------------------------------------------------
    //              Get window width and height
    // -----------------------------------------------------------
    // Parameter: none
    // Description: cross-browser method
    // -----------------------------------------------------------

    function getWindowHeight() {
        return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    }

    function getWindowWidth() {
        return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    }

    function widthToHeightRatio(width, height) {
        return width/height;
    }

    // ---------------------------------------------------------------
    //              element is in view
    // ---------------------------------------------------------------
    // Parameter: element to check, (default DOM elem, not wrapper)
    // Description: check if the target elem is in the view window
    // ---------------------------------------------------------------
    function isVisible(elem) {
        if(window.pageYOffset + document.documentElement.clientHeight >= elem.offsetTop 
        && window.pageYOffset <= elem.offsetTop + elem.offsetHeight)
            return true;
        return false;
    }


    // 
    // -------------------- Gridbox Plugins --------------------------
    //

    init.extend({
    // -----------------------------------------------------------
    //                          Modal
    // -----------------------------------------------------------
    // Description: toggle the modal elements
    // -----------------------------------------------------------
    // Parameter:   none
    // Description: none
    // -----------------------------------------------------------
    // Note:  must use Modal HTML Template
    // -----------------------------------------------------------

        modal: function() {
            var self = this;

            var modalID = self.data("target");
            var modal = im(modalID);
            var modalBox = modal.find(".modal-box").first();
            var dismiss = im("#dismiss");

            // show the modal
            self.click(showModal);

            // dismiss the modal
            dismiss.click(hideModal);
            modal.click(hideModal, false);

            // dismiss when esc pressed
            window.addEventListener("keypress", function(e){
                if(e.keyCode == 27 && modalBox.hasClass("slide-in")) {
                    hideModal();
                }
            });

            // helper functions
            function animate() {
                return new Promise( function(resolve) {
                    modal.toggleClass("fade");
                    modalBox.toggleClass("slide-in");
                    setTimeout(resolve, 300); // 300ms is the transition time
                });
            }

            function toggleDisplay() {
                return new Promise( function(resolve) {
                    modal.toggleClass("show");
                    setTimeout(resolve, 100);
                });
            }

            function showModal() {
                toggleDisplay().then(animate);
            }

            function hideModal() {
                animate().then(toggleDisplay);
            }
        }

    });

})(window);






