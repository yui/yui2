(function () {

    /**
    * Overlay is a Module that is absolutely positioned above the page flow. It 
    * has convenience methods for positioning and sizing, as well as options for 
    * controlling zIndex and constraining the Overlay's position to the current 
    * visible viewport. Overlay also contains a dynamicly generated IFRAME which 
    * is placed beneath it for Internet Explorer 6 and 5.x so that it will be 
    * properly rendered above SELECT elements.
    * @namespace YAHOO.widget
    * @class Overlay
    * @extends Module
    * @param {String} el The element ID representing the Overlay <em>OR</em>
    * @param {HTMLElement} el The element representing the Overlay
    * @param {Object} userConfig The configuration object literal containing 
    * the configuration that should be set for this Overlay. See configuration 
    * documentation for more details.
    * @constructor
    */
    YAHOO.widget.Overlay = function (el, userConfig) {
    
        YAHOO.widget.Overlay.superclass.constructor.call(this, el, userConfig);
    
    };


    var Lang = YAHOO.lang,
        CustomEvent = YAHOO.util.CustomEvent,
        Module = YAHOO.widget.Module,
        Event = YAHOO.util.Event,
        Dom = YAHOO.util.Dom,
        Config = YAHOO.util.Config,
        Overlay = YAHOO.widget.Overlay,

        /**
        * Constant representing the name of the Overlay's events
        * @property EVENT_TYPES
        * @private
        * @final
        * @type Object
        */
        EVENT_TYPES = {
        
            "BEFORE_MOVE": "beforeMove",
            "MOVE": "move"
        
        },
        
        /**
        * Constant representing the Overlay's configuration properties
        * @property DEFAULT_CONFIG
        * @private
        * @final
        * @type Object
        */
        DEFAULT_CONFIG = {
        
            "X": { 
                key: "x", 
                validator: Lang.isNumber, 
                suppressEvent: true, 
                supercedes: ["iframe"] 
            },
        
            "Y": { 
                key: "y", 
                validator: Lang.isNumber, 
                suppressEvent: true, 
                supercedes: ["iframe"] 
            },
        
            "XY": { 
                key: "xy", 
                suppressEvent: true, 
                supercedes: ["iframe"] 
            },
        
            "CONTEXT": { 
                key: "context", 
                suppressEvent: true, 
                supercedes: ["iframe"] 
            },
        
            "FIXED_CENTER": { 
                key: "fixedcenter", 
                value: false, 
                validator: Lang.isBoolean, 
                supercedes: ["iframe", "visible"] 
            },
        
            "WIDTH": { 
                key: "width", 
                suppressEvent: true, 
                supercedes: ["context", "fixedcenter", "iframe"] 
            }, 
        
            "HEIGHT": { 
                key: "height", 
                suppressEvent: true, 
                supercedes: ["context", "fixedcenter", "iframe"] 
            }, 
        
            "ZINDEX": { 
                key: "zindex", 
                value: null 
            }, 
        
            "CONSTRAIN_TO_VIEWPORT": { 
                key: "constraintoviewport", 
                value: false, 
                validator: Lang.isBoolean, 
                supercedes: ["iframe", "x", "y", "xy"] 
            }, 
        
            "IFRAME": { 
                key: "iframe", 
                value: (YAHOO.env.ua.ie == 6 ? true : false), 
                validator: Lang.isBoolean, 
                supercedes: ["zindex"] 
            }
        
        };


    /**
    * The URL that will be placed in the iframe
    * @property Overlay.IFRAME_SRC
    * @static
    * @final
    * @type String
    */
    Overlay.IFRAME_SRC = "javascript:false;";
    
    /**
    * Constant representing the top left corner of an element, used for 
    * configuring the context element alignment
    * @property Overlay.TOP_LEFT
    * @static
    * @final
    * @type String
    */
    Overlay.TOP_LEFT = "tl";
    
    /**
    * Constant representing the top right corner of an element, used for 
    * configuring the context element alignment
    * @property Overlay.TOP_RIGHT
    * @static
    * @final
    * @type String
    */
    Overlay.TOP_RIGHT = "tr";
    
    /**
    * Constant representing the top bottom left corner of an element, used for 
    * configuring the context element alignment
    * @property Overlay.BOTTOM_LEFT
    * @static
    * @final
    * @type String
    */
    Overlay.BOTTOM_LEFT = "bl";
    
    /**
    * Constant representing the bottom right corner of an element, used for 
    * configuring the context element alignment
    * @property Overlay.BOTTOM_RIGHT
    * @static
    * @final
    * @type String
    */
    Overlay.BOTTOM_RIGHT = "br";
    
    /**
    * Constant representing the default CSS class used for an Overlay
    * @property Overlay.CSS_OVERLAY
    * @static
    * @final
    * @type String
    */
    Overlay.CSS_OVERLAY = "yui-overlay";
    
    
    /**
    * A singleton CustomEvent used for reacting to the DOM event for 
    * window scroll
    * @event Overlay.windowScrollEvent
    */
    Overlay.windowScrollEvent = new CustomEvent("windowScroll");
    
    /**
    * A singleton CustomEvent used for reacting to the DOM event for
    * window resize
    * @event Overlay.windowResizeEvent
    */
    Overlay.windowResizeEvent = new CustomEvent("windowResize");
    
    /**
    * The DOM event handler used to fire the CustomEvent for window scroll
    * @method Overlay.windowScrollHandler
    * @static
    * @param {DOMEvent} e The DOM scroll event
    */
    Overlay.windowScrollHandler = function (e) {
    
        if (YAHOO.env.ua.ie) {
    
            if (! window.scrollEnd) {
    
                window.scrollEnd = -1;
    
            }
    
            clearTimeout(window.scrollEnd);
    
            window.scrollEnd = setTimeout(function () { 
            
                Overlay.windowScrollEvent.fire(); 
    
            }, 1);
    
        } else {
    
            Overlay.windowScrollEvent.fire();
    
        }
    
    };
    
    /**
    * The DOM event handler used to fire the CustomEvent for window resize
    * @method Overlay.windowResizeHandler
    * @static
    * @param {DOMEvent} e The DOM resize event
    */
    Overlay.windowResizeHandler = function (e) {
    
        if (YAHOO.env.ua.ie) {
    
            if (! window.resizeEnd) {
                window.resizeEnd = -1;
            }
    
            clearTimeout(window.resizeEnd);
    
            window.resizeEnd = setTimeout(function () {
    
                Overlay.windowResizeEvent.fire(); 
    
            }, 100);
    
        } else {
    
            Overlay.windowResizeEvent.fire();
    
        }
    
    };
    
    /**
    * A boolean that indicated whether the window resize and scroll events have 
    * already been subscribed to.
    * @property Overlay._initialized
    * @private
    * @type Boolean
    */
    Overlay._initialized = null;
    
    if (Overlay._initialized === null) {
    
        Event.on(window, "scroll", 
            Overlay.windowScrollHandler);
    
        Event.on(window, "resize", 
            Overlay.windowResizeHandler);
    
        Overlay._initialized = true;
    
    }
    
    YAHOO.extend(Overlay, Module, {
    
        /**
        * The Overlay initialization method, which is executed for Overlay and  
        * all of its subclasses. This method is automatically called by the 
        * constructor, and  sets up all DOM references for pre-existing markup, 
        * and creates required markup if it is not already present.
        * @method init
        * @param {String} el The element ID representing the Overlay <em>OR</em>
        * @param {HTMLElement} el The element representing the Overlay
        * @param {Object} userConfig The configuration object literal 
        * containing the configuration that should be set for this Overlay. 
        * See configuration documentation for more details.
        */
        init: function (el, userConfig) {
    
            /*
                 Note that we don't pass the user config in here yet because we
                 only want it executed once, at the lowest subclass level
            */
    
            Overlay.superclass.init.call(this, el/*, userConfig*/);  
            
            this.beforeInitEvent.fire(Overlay);
            
            Dom.addClass(this.element, Overlay.CSS_OVERLAY);
            
            if (userConfig) {
    
                this.cfg.applyConfig(userConfig, true);
    
            }
            
            if (this.platform == "mac" && YAHOO.env.ua.gecko) {
    
                if (! Config.alreadySubscribed(this.showEvent,
                    this.showMacGeckoScrollbars, this)) {
    
                    this.showEvent.subscribe(this.showMacGeckoScrollbars, 
                        this, true);
    
                }
    
                if (! Config.alreadySubscribed(this.hideEvent, 
                    this.hideMacGeckoScrollbars, this)) {
    
                    this.hideEvent.subscribe(this.hideMacGeckoScrollbars, 
                        this, true);
    
                }
    
            }
            
            this.initEvent.fire(Overlay);
        
        },
        
        /**
        * Initializes the custom events for Overlay which are fired  
        * automatically at appropriate times by the Overlay class.
        * @method initEvents
        */
        initEvents: function () {
    
            Overlay.superclass.initEvents.call(this);
            
            var SIGNATURE = CustomEvent.LIST;
            
            /**
            * CustomEvent fired before the Overlay is moved.
            * @event beforeMoveEvent
            * @param {Number} x x coordinate
            * @param {Number} y y coordinate
            */
            this.beforeMoveEvent = this.createEvent(EVENT_TYPES.BEFORE_MOVE);
            this.beforeMoveEvent.signature = SIGNATURE;
            
            /**
            * CustomEvent fired after the Overlay is moved.
            * @event moveEvent
            * @param {Number} x x coordinate
            * @param {Number} y y coordinate
            */
            this.moveEvent = this.createEvent(EVENT_TYPES.MOVE);
            this.moveEvent.signature = SIGNATURE;
        
        },
        
        /**
        * Initializes the class's configurable properties which can be changed 
        * using the Overlay's Config object (cfg).
        * @method initDefaultConfig
        */
        initDefaultConfig: function () {
    
            Overlay.superclass.initDefaultConfig.call(this);
            
            
            // Add overlay config properties //
            
            /**
            * The absolute x-coordinate position of the Overlay
            * @config x
            * @type Number
            * @default null
            */
            this.cfg.addProperty(DEFAULT_CONFIG.X.key, { 
    
                handler: this.configX, 
                validator: DEFAULT_CONFIG.X.validator, 
                suppressEvent: DEFAULT_CONFIG.X.suppressEvent, 
                supercedes: DEFAULT_CONFIG.X.supercedes
    
            });
        
    
            /**
            * The absolute y-coordinate position of the Overlay
            * @config y
            * @type Number
            * @default null
            */
            this.cfg.addProperty(DEFAULT_CONFIG.Y.key, {
    
                handler: this.configY, 
                validator: DEFAULT_CONFIG.Y.validator, 
                suppressEvent: DEFAULT_CONFIG.Y.suppressEvent, 
                supercedes: DEFAULT_CONFIG.Y.supercedes
    
            });
        
    
            /**
            * An array with the absolute x and y positions of the Overlay
            * @config xy
            * @type Number[]
            * @default null
            */
            this.cfg.addProperty(DEFAULT_CONFIG.XY.key, {
            
                handler: this.configXY, 
                suppressEvent: DEFAULT_CONFIG.XY.suppressEvent, 
                supercedes: DEFAULT_CONFIG.XY.supercedes
            
            });
        
    
            /**
            * The array of context arguments for context-sensitive positioning.  
            * The format is: [id or element, element corner, context corner]. 
            * For example, setting this property to ["img1", "tl", "bl"] would 
            * align the Overlay's top left corner to the context element's 
            * bottom left corner.
            * @config context
            * @type Array
            * @default null
            */
            this.cfg.addProperty(DEFAULT_CONFIG.CONTEXT.key, {
            
                handler: this.configContext, 
                suppressEvent: DEFAULT_CONFIG.CONTEXT.suppressEvent, 
                supercedes: DEFAULT_CONFIG.CONTEXT.supercedes
            
            });
        
    
            /**
            * True if the Overlay should be anchored to the center of 
            * the viewport.
            * @config fixedcenter
            * @type Boolean
            * @default false
            */
            this.cfg.addProperty(DEFAULT_CONFIG.FIXED_CENTER.key, {
            
                handler: this.configFixedCenter,
                value: DEFAULT_CONFIG.FIXED_CENTER.value, 
                validator: DEFAULT_CONFIG.FIXED_CENTER.validator, 
                supercedes: DEFAULT_CONFIG.FIXED_CENTER.supercedes
            
            });
        
    
            /**
            * CSS width of the Overlay.
            * @config width
            * @type String
            * @default null
            */
            this.cfg.addProperty(DEFAULT_CONFIG.WIDTH.key, {
            
                handler: this.configWidth, 
                suppressEvent: DEFAULT_CONFIG.WIDTH.suppressEvent, 
                supercedes: DEFAULT_CONFIG.WIDTH.supercedes
            
            });
            
            /**
            * CSS height of the Overlay.
            * @config height
            * @type String
            * @default null
            */
            this.cfg.addProperty(DEFAULT_CONFIG.HEIGHT.key, {
            
                handler: this.configHeight, 
                suppressEvent: DEFAULT_CONFIG.HEIGHT.suppressEvent, 
                supercedes: DEFAULT_CONFIG.HEIGHT.supercedes
            
            });
            
            /**
            * CSS z-index of the Overlay.
            * @config zIndex
            * @type Number
            * @default null
            */
            this.cfg.addProperty(DEFAULT_CONFIG.ZINDEX.key, {
    
                handler: this.configzIndex,
                value: DEFAULT_CONFIG.ZINDEX.value
    
            });
            
            /**
            * True if the Overlay should be prevented from being positioned 
            * out of the viewport.
            * @config constraintoviewport
            * @type Boolean
            * @default false
            */
            this.cfg.addProperty(DEFAULT_CONFIG.CONSTRAIN_TO_VIEWPORT.key, {
            
                handler: this.configConstrainToViewport, 
                value: DEFAULT_CONFIG.CONSTRAIN_TO_VIEWPORT.value, 
                validator: DEFAULT_CONFIG.CONSTRAIN_TO_VIEWPORT.validator, 
                supercedes: DEFAULT_CONFIG.CONSTRAIN_TO_VIEWPORT.supercedes
            
            });
            
            /**
            * True if the Overlay should have an IFRAME shim (for correcting  
            * the select z-index bug in IE6 and below).
            * @config iframe
            * @type Boolean
            * @default true for IE6 and below, false for all others
            */
            this.cfg.addProperty(DEFAULT_CONFIG.IFRAME.key, {
            
                handler: this.configIframe, 
                value: DEFAULT_CONFIG.IFRAME.value, 
                validator: DEFAULT_CONFIG.IFRAME.validator, 
                supercedes: DEFAULT_CONFIG.IFRAME.supercedes
            
            });
        
        },
        
        /**
        * Moves the Overlay to the specified position. This function is  
        * identical to calling this.cfg.setProperty("xy", [x,y]);
        * @method moveTo
        * @param {Number} x The Overlay's new x position
        * @param {Number} y The Overlay's new y position
        */
        moveTo: function (x, y) {
    
            this.cfg.setProperty("xy", [x, y]);
    
        },
        
        /**
        * Adds a CSS class ("hide-scrollbars") and removes a CSS class 
        * ("show-scrollbars") to the Overlay to fix a bug in Gecko on Mac OS X 
        * (https://bugzilla.mozilla.org/show_bug.cgi?id=187435)
        * @method hideMacGeckoScrollbars
        */
        hideMacGeckoScrollbars: function () {
    
            Dom.removeClass(this.element, "show-scrollbars");
            Dom.addClass(this.element, "hide-scrollbars");
    
        },
        
        /**
        * Adds a CSS class ("show-scrollbars") and removes a CSS class 
        * ("hide-scrollbars") to the Overlay to fix a bug in Gecko on Mac OS X 
        * (https://bugzilla.mozilla.org/show_bug.cgi?id=187435)
        * @method showMacGeckoScrollbars
        */
        showMacGeckoScrollbars: function () {
    
            Dom.removeClass(this.element, "hide-scrollbars");
            Dom.addClass(this.element, "show-scrollbars");
    
        },
        
        // BEGIN BUILT-IN PROPERTY EVENT HANDLERS //
        
        /**
        * The default event handler fired when the "visible" property is 
        * changed.  This method is responsible for firing showEvent
        * and hideEvent.
        * @method configVisible
        * @param {String} type The CustomEvent type (usually the property name)
        * @param {Object[]} args The CustomEvent arguments. For configuration
        * handlers, args[0] will equal the newly applied value for the property.
        * @param {Object} obj The scope object. For configuration handlers, 
        * this will usually equal the owner.
        */
        configVisible: function (type, args, obj) {
    
            var visible = args[0],
                currentVis = Dom.getStyle(this.element, "visibility"),
                effect = this.cfg.getProperty("effect"),
                effectInstances = [],
                isMacGecko = (this.platform == "mac" && YAHOO.env.ua.gecko),
                alreadySubscribed = Config.alreadySubscribed,
                eff, ei, e, i, j, k, h,
                nEffects,
                nEffectInstances;
    
    
            if (currentVis == "inherit") {
    
                e = this.element.parentNode;
    
                while (e.nodeType != 9 && e.nodeType != 11) {
    
                    currentVis = Dom.getStyle(e, "visibility");
    
                    if (currentVis != "inherit") { 
    
                        break; 
    
                    }
    
                    e = e.parentNode;
    
                }
    
                if (currentVis == "inherit") {
    
                    currentVis = "visible";
                
                }
    
            }
        
    
            if (effect) {
    
                if (effect instanceof Array) {

                    nEffects = effect.length;
    
                    for (i = 0; i < nEffects; i++) {
    
                        eff = effect[i];
    
                        effectInstances[effectInstances.length] = 
                            eff.effect(this, eff.duration);
    
                    }
    
                } else {
    
                    effectInstances[effectInstances.length] = 
                        effect.effect(this, effect.duration);
    
                }
    
            }
    
        
            if (visible) { // Show
    
                if (isMacGecko) {
    
                    this.showMacGeckoScrollbars();
    
                }
                
    
                if (effect) { // Animate in
    
    
                    if (visible) { // Animate in if not showing
    
    
                        if (currentVis != "visible" || currentVis === "") {
    
                            this.beforeShowEvent.fire();

                            nEffectInstances = effectInstances.length;
    
                            for (j = 0; j < nEffectInstances; j++) {
    
                                ei = effectInstances[j];
    
                                if (j === 0 && !alreadySubscribed(
                                        ei.animateInCompleteEvent, 
                                        this.showEvent.fire, this.showEvent)) {
    
                                    /*
                                         Delegate showEvent until end 
                                         of animateInComplete
                                    */
    
                                    ei.animateInCompleteEvent.subscribe(
                                     this.showEvent.fire, this.showEvent, true);
    
                                }
    
                                ei.animateIn();
    
                            }
    
                        }
    
                    }
    
                } else { // Show
    
                    if (currentVis != "visible" || currentVis === "") {
    
                        this.beforeShowEvent.fire();
    
                        Dom.setStyle(this.element, 
                            "visibility", "visible");
    
                        this.cfg.refireEvent("iframe");
                        this.showEvent.fire();
    
                    }
        
                }
        
            } else { // Hide
    
                if (isMacGecko) {
    
                    this.hideMacGeckoScrollbars();
    
                }
                    
                if (effect) { // Animate out if showing
    
                    if (currentVis == "visible") {
    
                        this.beforeHideEvent.fire();

                        nEffectInstances = effectInstances.length;
    
                        for (k = 0; k < nEffectInstances; k++) {
    
                            h = effectInstances[k];
    
                            if (k === 0 && !alreadySubscribed(
                                h.animateOutCompleteEvent, this.hideEvent.fire, 
                                this.hideEvent)) {
    
                                /*
                                     Delegate hideEvent until end 
                                     of animateOutComplete
                                */
    
                                h.animateOutCompleteEvent.subscribe(
                                    this.hideEvent.fire, this.hideEvent, true);
    
                            }
    
                            h.animateOut();
    
                        }
    
                    } else if (currentVis === "") {
    
                        Dom.setStyle(
                            this.element, "visibility", "hidden");
    
                    }
    
                } else { // Simple hide
    
                    if (currentVis == "visible" || currentVis === "") {
    
                        this.beforeHideEvent.fire();
    
                        Dom.setStyle(this.element, 
                            "visibility", "hidden");
    
                        this.cfg.refireEvent("iframe");
                        this.hideEvent.fire();
    
                    }
    
                }
    
            }
    
        },
        
        /**
        * Center event handler used for centering on scroll/resize, but only if 
        * the Overlay is visible
        * @method doCenterOnDOMEvent
        */
        doCenterOnDOMEvent: function () {
    
            if (this.cfg.getProperty("visible")) {
    
                this.center();
    
            }
    
        },
        
        /**
        * The default event handler fired when the "fixedcenter" property 
        * is changed.
        * @method configFixedCenter
        * @param {String} type The CustomEvent type (usually the property name)
        * @param {Object[]} args The CustomEvent arguments. For configuration 
        * handlers, args[0] will equal the newly applied value for the property.
        * @param {Object} obj The scope object. For configuration handlers, 
        * this will usually equal the owner.
        */
        configFixedCenter: function (type, args, obj) {
    
            var val = args[0],
                alreadySubscribed = Config.alreadySubscribed,
                windowResizeEvent = Overlay.windowResizeEvent,
                windowScrollEvent = Overlay.windowScrollEvent;
            
            if (val) {
    
                this.center();
            
                if (!alreadySubscribed(this.beforeShowEvent, 
                    this.center, this)) {
    
                    this.beforeShowEvent.subscribe(this.center);
    
                }
            
                if (!alreadySubscribed(windowResizeEvent, 
                    this.doCenterOnDOMEvent, this)) {
    
                    windowResizeEvent.subscribe(this.doCenterOnDOMEvent, 
                        this, true);
    
                }
            
                if (!alreadySubscribed(windowScrollEvent, 
                    this.doCenterOnDOMEvent, this)) {
        
                    windowScrollEvent.subscribe(this.doCenterOnDOMEvent, 
                        this, true);
    
                }
    
            } else {
    
                this.beforeShowEvent.unsubscribe(this.center);
    
                windowResizeEvent.unsubscribe(this.doCenterOnDOMEvent, this);
                windowScrollEvent.unsubscribe(this.doCenterOnDOMEvent, this);
    
            }
    
        },
        
        /**
        * The default event handler fired when the "height" property is changed.
        * @method configHeight
        * @param {String} type The CustomEvent type (usually the property name)
        * @param {Object[]} args The CustomEvent arguments. For configuration 
        * handlers, args[0] will equal the newly applied value for the property.
        * @param {Object} obj The scope object. For configuration handlers, 
        * this will usually equal the owner.
        */
        configHeight: function (type, args, obj) {
    
            var height = args[0],
                el = this.element;
    
            Dom.setStyle(el, "height", height);
            this.cfg.refireEvent("iframe");
    
        },
        
        /**
        * The default event handler fired when the "width" property is changed.
        * @method configWidth
        * @param {String} type The CustomEvent type (usually the property name)
        * @param {Object[]} args The CustomEvent arguments. For configuration 
        * handlers, args[0] will equal the newly applied value for the property.
        * @param {Object} obj The scope object. For configuration handlers, 
        * this will usually equal the owner.
        */
        configWidth: function (type, args, obj) {
    
            var width = args[0],
                el = this.element;
    
            Dom.setStyle(el, "width", width);
            this.cfg.refireEvent("iframe");
    
        },
        
        /**
        * The default event handler fired when the "zIndex" property is changed.
        * @method configzIndex
        * @param {String} type The CustomEvent type (usually the property name)
        * @param {Object[]} args The CustomEvent arguments. For configuration 
        * handlers, args[0] will equal the newly applied value for the property.
        * @param {Object} obj The scope object. For configuration handlers, 
        * this will usually equal the owner.
        */
        configzIndex: function (type, args, obj) {
    
            var zIndex = args[0],
                el = this.element;
        
            if (! zIndex) {
    
                zIndex = Dom.getStyle(el, "zIndex");
        
                if (! zIndex || isNaN(zIndex)) {
    
                    zIndex = 0;
    
                }
    
            }
            
            if (this.iframe) {
    
                if (zIndex <= 0) {
    
                    zIndex = 1;
    
                }
    
                Dom.setStyle(this.iframe, "zIndex", (zIndex - 1));
            }
            
            Dom.setStyle(el, "zIndex", zIndex);
            this.cfg.setProperty("zIndex", zIndex, true);
    
        },
        
        /**
        * The default event handler fired when the "xy" property is changed.
        * @method configXY
        * @param {String} type The CustomEvent type (usually the property name)
        * @param {Object[]} args The CustomEvent arguments. For configuration 
        * handlers, args[0] will equal the newly applied value for the property.
        * @param {Object} obj The scope object. For configuration handlers, 
        * this will usually equal the owner.
        */
        configXY: function (type, args, obj) {
    
            var pos = args[0],
                x = pos[0],
                y = pos[1];
            
            this.cfg.setProperty("x", x);
            this.cfg.setProperty("y", y);
            
            this.beforeMoveEvent.fire([x, y]);
            
            x = this.cfg.getProperty("x");
            y = this.cfg.getProperty("y");
            
            YAHOO.log(("xy: " + [x, y]), "iframe");
            
            this.cfg.refireEvent("iframe");
            this.moveEvent.fire([x, y]);
    
        },
        
        /**
        * The default event handler fired when the "x" property is changed.
        * @method configX
        * @param {String} type The CustomEvent type (usually the property name)
        * @param {Object[]} args The CustomEvent arguments. For configuration 
        * handlers, args[0] will equal the newly applied value for the property.
        * @param {Object} obj The scope object. For configuration handlers, 
        * this will usually equal the owner.
        */
        configX: function (type, args, obj) {
    
            var x = args[0],
                y = this.cfg.getProperty("y");
            
            this.cfg.setProperty("x", x, true);
            this.cfg.setProperty("y", y, true);
            
            this.beforeMoveEvent.fire([x, y]);
            
            x = this.cfg.getProperty("x");
            y = this.cfg.getProperty("y");
            
            Dom.setX(this.element, x, true);
            
            this.cfg.setProperty("xy", [x, y], true);
           
            this.cfg.refireEvent("iframe");
            this.moveEvent.fire([x, y]);
    
        },
        
        /**
        * The default event handler fired when the "y" property is changed.
        * @method configY
        * @param {String} type The CustomEvent type (usually the property name)
        * @param {Object[]} args The CustomEvent arguments. For configuration 
        * handlers, args[0] will equal the newly applied value for the property.
        * @param {Object} obj The scope object. For configuration handlers, 
        * this will usually equal the owner.
        */
        configY: function (type, args, obj) {
    
            var x = this.cfg.getProperty("x"),
                y = args[0];
        
            this.cfg.setProperty("x", x, true);
            this.cfg.setProperty("y", y, true);
            
            this.beforeMoveEvent.fire([x, y]);
            
            x = this.cfg.getProperty("x");
            y = this.cfg.getProperty("y");
            
            Dom.setY(this.element, y, true);
            
            this.cfg.setProperty("xy", [x, y], true);
            
            this.cfg.refireEvent("iframe");
            this.moveEvent.fire([x, y]);
    
        },
        
        /**
        * Shows the iframe shim, if it has been enabled
        * @method showIframe
        */
        showIframe: function () {
    
            if (this.iframe) {
    
                this.iframe.style.display = "block";
    
            }
    
        },
        
        /**
        * Hides the iframe shim, if it has been enabled
        * @method hideIframe
        */
        hideIframe: function () {
    
            if (this.iframe) {
    
                this.iframe.style.display = "none";
    
            }
    
        },
        
        /**
        * The default event handler fired when the "iframe" property is changed.
        * @method configIframe
        * @param {String} type The CustomEvent type (usually the property name)
        * @param {Object[]} args The CustomEvent arguments. For configuration 
        * handlers, args[0] will equal the newly applied value for the property.
        * @param {Object} obj The scope object. For configuration handlers, 
        * this will usually equal the owner.
        */
        configIframe: function (type, args, obj) {
        
            var val = args[0],
                alreadySubscribed = Config.alreadySubscribed,
                x, y, parent, iframeDisplay, width, height;
            
            if (val) { // IFRAME shim is enabled
            
                if (!alreadySubscribed(this.showEvent, this.showIframe, this)) {
    
                    this.showEvent.subscribe(this.showIframe, this, true);
    
                }
    
                if (!alreadySubscribed(this.hideEvent, this.hideIframe, this)) {
    
                    this.hideEvent.subscribe(this.hideIframe, this, true);
    
                }
            
                x = this.cfg.getProperty("x");
                y = this.cfg.getProperty("y");
            
                if (! x || ! y) {
    
                    this.syncPosition();
                    x = this.cfg.getProperty("x");
                    y = this.cfg.getProperty("y");
    
                }
            
                YAHOO.log(("iframe positioning to: " + [x, y]), "iframe");
            
                if (! isNaN(x) && ! isNaN(y)) {
    
                    if (! this.iframe) {
    
                        this.iframe = document.createElement("iframe");
    
                        if (this.isSecure) {
        
                            this.iframe.src = Overlay.IFRAME_SRC;
        
                        }
    
                        parent = this.element.parentNode;
    
                        if (parent) {
    
                            parent.appendChild(this.iframe);
    
                        } else {
    
                            document.body.appendChild(this.iframe);
    
                        }
            
                        Dom.setStyle(this.iframe, 
                            "position", "absolute");
    
                        Dom.setStyle(this.iframe, "border", "none");
                        Dom.setStyle(this.iframe, "margin", "0");
                        Dom.setStyle(this.iframe, "padding", "0");
                        Dom.setStyle(this.iframe, "opacity", "0");
    
                        if (this.cfg.getProperty("visible")) {
    
                            this.showIframe();
                        
                        } else {
            
                            this.hideIframe();
                        
                        }
                    }
            
                    iframeDisplay = Dom.getStyle(this.iframe, "display");
            
                    if (iframeDisplay == "none") {
    
                        this.iframe.style.display = "block";
    
                    }
            
                    Dom.setXY(this.iframe, [x, y]);
            
                    width = this.element.clientWidth;
                    height = this.element.clientHeight;
                    
                    Dom.setStyle(this.iframe, "width", 
                        ((width + 2) + "px"));
    
                    Dom.setStyle(this.iframe, "height", 
                        ((height + 2) + "px"));
            
                    if (iframeDisplay == "none") {
    
                        this.iframe.style.display = "none";
    
                    }
    
                }
    
            } else {
    
                if (this.iframe) {
    
                    this.iframe.style.display = "none";
    
                }
    
                this.showEvent.unsubscribe(this.showIframe, this);
                this.hideEvent.unsubscribe(this.hideIframe, this);
    
            }
    
        },
        
        
        /**
        * The default event handler fired when the "constraintoviewport" 
        * property is changed.
        * @method configConstrainToViewport
        * @param {String} type The CustomEvent type (usually the property name)
        * @param {Object[]} args The CustomEvent arguments. For configuration 
        * handlers, args[0] will equal the newly applied value for 
        * the property.
        * @param {Object} obj The scope object. For configuration handlers, 
        * this will usually equal the owner.
        */
        configConstrainToViewport: function (type, args, obj) {
    
            var val = args[0];
    
            if (val) {
    
                if (! Config.alreadySubscribed(this.beforeMoveEvent, 
                    this.enforceConstraints, this)) {
    
                    this.beforeMoveEvent.subscribe(this.enforceConstraints, 
                        this, true);
    
                }
    
            } else {
    
                this.beforeMoveEvent.unsubscribe(this.enforceConstraints, this);
    
            }
    
        },
        
        /**
        * The default event handler fired when the "context" property 
        * is changed.
        * @method configContext
        * @param {String} type The CustomEvent type (usually the property name)
        * @param {Object[]} args The CustomEvent arguments. For configuration 
        * handlers, args[0] will equal the newly applied value for the property.
        * @param {Object} obj The scope object. For configuration handlers, 
        * this will usually equal the owner.
        */
        configContext: function (type, args, obj) {
    
            var contextArgs = args[0],
                contextEl,
                elementMagnetCorner,
                contextMagnetCorner;
            
            if (contextArgs) {
            
                contextEl = contextArgs[0];
                elementMagnetCorner = contextArgs[1];
                contextMagnetCorner = contextArgs[2];
                
                if (contextEl) {
    
                    if (typeof contextEl == "string") {
    
                        this.cfg.setProperty("context", 
                            [document.getElementById(contextEl), 
                                elementMagnetCorner, contextMagnetCorner], 
                                true);
    
                    }
                    
                    if (elementMagnetCorner && contextMagnetCorner) {
    
                        this.align(elementMagnetCorner, contextMagnetCorner);
    
                    }
    
                }
    
            }
    
        },
        
        
        // END BUILT-IN PROPERTY EVENT HANDLERS //
        
        /**
        * Aligns the Overlay to its context element using the specified corner 
        * points (represented by the constants TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, 
        * and BOTTOM_RIGHT.
        * @method align
        * @param {String} elementAlign  The String representing the corner of 
        * the Overlay that should be aligned to the context element
        * @param {String} contextAlign  The corner of the context element 
        * that the elementAlign corner should stick to.
        */
        align: function (elementAlign, contextAlign) {
    
            var contextArgs = this.cfg.getProperty("context"),
                me = this,
                context,
                element,
                contextRegion;
    
    
            function doAlign(v, h) {
    
                switch (elementAlign) {
    
                case Overlay.TOP_LEFT:
    
                    me.moveTo(h, v);
    
                    break;
    
                case Overlay.TOP_RIGHT:
    
                    me.moveTo((h - element.offsetWidth), v);
    
                    break;
    
                case Overlay.BOTTOM_LEFT:
    
                    me.moveTo(h, (v - element.offsetHeight));
    
                    break;
    
                case Overlay.BOTTOM_RIGHT:
    
                    me.moveTo((h - element.offsetWidth), 
                        (v - element.offsetHeight));
    
                    break;
    
                }
    
            }
    
    
            if (contextArgs) {
            
                context = contextArgs[0];
                element = this.element;
                me = this;
                
                if (! elementAlign) {
    
                    elementAlign = contextArgs[1];
    
                }
                
                if (! contextAlign) {
    
                    contextAlign = contextArgs[2];
    
                }
                
                if (element && context) {
    
                    contextRegion = Dom.getRegion(context);
                    
                    switch (contextAlign) {
    
                    case Overlay.TOP_LEFT:
    
                        doAlign(contextRegion.top, contextRegion.left);
    
                        break;
    
                    case Overlay.TOP_RIGHT:
    
                        doAlign(contextRegion.top, contextRegion.right);
    
                        break;
    
                    case Overlay.BOTTOM_LEFT:
    
                        doAlign(contextRegion.bottom, contextRegion.left);
    
                        break;
    
                    case Overlay.BOTTOM_RIGHT:
    
                        doAlign(contextRegion.bottom, contextRegion.right);
    
                        break;
    
                    }
    
                }
    
            }
            
        },
        
        /**
        * The default event handler executed when the moveEvent is fired, if the 
        * "constraintoviewport" is set to true.
        * @method enforceConstraints
        * @param {String} type The CustomEvent type (usually the property name)
        * @param {Object[]} args The CustomEvent arguments. For configuration 
        * handlers, args[0] will equal the newly applied value for the property.
        * @param {Object} obj The scope object. For configuration handlers, 
        * this will usually equal the owner.
        */
        enforceConstraints: function (type, args, obj) {
    
            var pos = args[0],
                x = pos[0],
                y = pos[1],
                offsetHeight = this.element.offsetHeight,
                offsetWidth = this.element.offsetWidth,
                viewPortWidth = Dom.getViewportWidth(),
                viewPortHeight = Dom.getViewportHeight(),
                scrollX = Dom.getDocumentScrollLeft(),
                scrollY = Dom.getDocumentScrollTop(),
                topConstraint = scrollY + 10,
                leftConstraint = scrollX + 10,
                bottomConstraint = scrollY + viewPortHeight - offsetHeight - 10,
                rightConstraint = scrollX + viewPortWidth - offsetWidth - 10;
        
    
            if (x < leftConstraint) {
    
                x = leftConstraint;
    
            } else if (x > rightConstraint) {
    
                x = rightConstraint;
    
            }
            
            if (y < topConstraint) {
    
                y = topConstraint;
    
            } else if (y > bottomConstraint) {
    
                y = bottomConstraint;
    
            }
            
            this.cfg.setProperty("x", x, true);
            this.cfg.setProperty("y", y, true);
            this.cfg.setProperty("xy", [x, y], true);
    
        },
        
        /**
        * Centers the container in the viewport.
        * @method center
        */
        center: function () {
    
            var scrollX = Dom.getDocumentScrollLeft(),
                scrollY = Dom.getDocumentScrollTop(),
    
                viewPortWidth = Dom.getClientWidth(),
                viewPortHeight = Dom.getClientHeight(),
                elementWidth = this.element.offsetWidth,
                elementHeight = this.element.offsetHeight,
                x = (viewPortWidth / 2) - (elementWidth / 2) + scrollX,
                y = (viewPortHeight / 2) - (elementHeight / 2) + scrollY;
            
            this.cfg.setProperty("xy", [parseInt(x, 10), parseInt(y, 10)]);
            
            this.cfg.refireEvent("iframe");
    
        },
        
        /**
        * Synchronizes the Panel's "xy", "x", and "y" properties with the 
        * Panel's position in the DOM. This is primarily used to update  
        * position information during drag & drop.
        * @method syncPosition
        */
        syncPosition: function () {
    
            var pos = Dom.getXY(this.element);
    
            this.cfg.setProperty("x", pos[0], true);
            this.cfg.setProperty("y", pos[1], true);
            this.cfg.setProperty("xy", pos, true);
    
        },
        
        /**
        * Event handler fired when the resize monitor element is resized.
        * @method onDomResize
        * @param {DOMEvent} e The resize DOM event
        * @param {Object} obj The scope object
        */
        onDomResize: function (e, obj) {
    
            var me = this;
    
            Overlay.superclass.onDomResize.call(this, e, obj);
    
            setTimeout(function () {
                me.syncPosition();
                me.cfg.refireEvent("iframe");
                me.cfg.refireEvent("context");
            }, 0);
    
        },

        /**
        * Places the Overlay on top of all other instances of 
        * YAHOO.widget.Overlay.
        * @method bringToTop
        */
        bringToTop: function() {
    
            var aOverlays = [],
                oElement = this.element;
    
            function compareZIndexDesc(p_oOverlay1, p_oOverlay2) {
        
                var sZIndex1 = Dom.getStyle(p_oOverlay1, "zIndex"),
        
                    sZIndex2 = Dom.getStyle(p_oOverlay2, "zIndex"),
        
                    nZIndex1 = (!sZIndex1 || isNaN(sZIndex1)) ? 
                        0 : parseInt(sZIndex1, 10),
        
                    nZIndex2 = (!sZIndex2 || isNaN(sZIndex2)) ? 
                        0 : parseInt(sZIndex2, 10);
        
                if (nZIndex1 > nZIndex2) {
        
                    return -1;
        
                } else if (nZIndex1 < nZIndex2) {
        
                    return 1;
        
                } else {
        
                    return 0;
        
                }
        
            }
        
            function isOverlayElement(p_oElement) {
        
                var oOverlay = Dom.hasClass(p_oElement, Overlay.CSS_OVERLAY),
                    Panel = YAHOO.widget.Panel;
            
                if (oOverlay && !Dom.isAncestor(oElement, oOverlay)) {
                
                    if (Panel && Dom.hasClass(p_oElement, Panel.CSS_PANEL)) {
        
                        aOverlays[aOverlays.length] = p_oElement.parentNode;
                    
                    }
                    else {
        
                        aOverlays[aOverlays.length] = p_oElement;
        
                    }
                
                }
            
            }
            
            Dom.getElementsBy(isOverlayElement, "DIV", document.body);
    
            aOverlays.sort(compareZIndexDesc);
            
            var oTopOverlay = aOverlays[0],
                nTopZIndex;
            
            if (oTopOverlay) {
    
                nTopZIndex = Dom.getStyle(oTopOverlay, "zIndex");
    
                if (!isNaN(nTopZIndex) && oTopOverlay != oElement) {
    
                    this.cfg.setProperty("zindex", 
                        (parseInt(nTopZIndex, 10) + 2));
    
                }
            
            }
        
        },
        
        /**
        * Removes the Overlay element from the DOM and sets all child 
        * elements to null.
        * @method destroy
        */
        destroy: function () {
    
            if (this.iframe) {
    
                this.iframe.parentNode.removeChild(this.iframe);
    
            }
        
            this.iframe = null;
        
            Overlay.windowResizeEvent.unsubscribe(
                this.doCenterOnDOMEvent, this);
    
            Overlay.windowScrollEvent.unsubscribe(
                this.doCenterOnDOMEvent, this);
        
            Overlay.superclass.destroy.call(this);
        },
        
        /**
        * Returns a String representation of the object.
        * @method toString
        * @return {String} The string representation of the Overlay.
        */
        toString: function () {
    
            return "Overlay " + this.id;
    
        }
    
    });
    
}());
