(function () {

    /**
    * Panel is an implementation of Overlay that behaves like an OS window, 
    * with a draggable header and an optional close icon at the top right.
    * @namespace YAHOO.widget
    * @class Panel
    * @extends Overlay
    * @constructor
    * @param {String} el The element ID representing the Panel <em>OR</em>
    * @param {HTMLElement} el The element representing the Panel
    * @param {Object} userConfig The configuration object literal containing 
    * the configuration that should be set for this Panel. See configuration 
    * documentation for more details.
    */
    YAHOO.widget.Panel = function (el, userConfig) {
    
        YAHOO.widget.Panel.superclass.constructor.call(this, el, userConfig);
    
    };


    var Lang = YAHOO.lang,
        DD = YAHOO.util.DD,
        Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        Overlay = YAHOO.widget.Overlay,
        CustomEvent = YAHOO.util.CustomEvent,
        Config = YAHOO.util.Config,
        Panel = YAHOO.widget.Panel,

        /**
        * Constant representing the name of the Panel's events
        * @property EVENT_TYPES
        * @private
        * @final
        * @type Object
        */
        EVENT_TYPES = {
        
            "SHOW_MASK": "showMask",
            "HIDE_MASK": "hideMask",
            "DRAG": "drag"
        
        },
        
        /**
        * Constant representing the Panel's configuration properties
        * @property DEFAULT_CONFIG
        * @private
        * @final
        * @type Object
        */
        DEFAULT_CONFIG = {
        
            "CLOSE": { 
                key: "close", 
                value: true, 
                validator: Lang.isBoolean, 
                supercedes: ["visible"] 
            },
            
            "DRAGGABLE": { 
                key: "draggable", 
                value: (DD ? true : false), 
                validator: Lang.isBoolean, 
                supercedes: ["visible"]  
            },
            
            "UNDERLAY": { 
                key: "underlay", 
                value: "shadow", 
                supercedes: ["visible"] 
            },
            
            "MODAL": { 
                key: "modal", 
                value: false, 
                validator: Lang.isBoolean, 
                supercedes: ["visible"] 
            },
            
            "KEY_LISTENERS": { 
                key: "keylisteners", 
                suppressEvent: true, 
                supercedes: ["visible"] 
            }
        
        };

    
    /**
    * Constant representing the default CSS class used for a Panel
    * @property Panel.CSS_PANEL
    * @static
    * @final
    * @type String
    */
    Panel.CSS_PANEL = "yui-panel";
    
    /**
    * Constant representing the default CSS class used for a Panel's 
    * wrapping container
    * @property Panel.CSS_PANEL_CONTAINER
    * @static
    * @final
    * @type String
    */
    Panel.CSS_PANEL_CONTAINER = "yui-panel-container";

    
    YAHOO.extend(Panel, Overlay, {
    
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
                 Note that we don't pass the user config in here yet because 
                 we only want it executed once, at the lowest subclass level
            */

            Panel.superclass.init.call(this, el/*, userConfig*/);  
        
            this.beforeInitEvent.fire(Panel);
        
            Dom.addClass(this.element, Panel.CSS_PANEL);
        
            this.buildWrapper();
        
            if (userConfig) {
                this.cfg.applyConfig(userConfig, true);
            }
        
            this.beforeRenderEvent.subscribe(function () {
                var draggable = this.cfg.getProperty("draggable");
                if (draggable) {
                    if (!this.header) {
                        this.setHeader("&#160;");
                    }
                }
            }, this, true);
        
        
            this.renderEvent.subscribe(function () {
        
                /*
                    If no value for the "width" configuration property was 
                    specified, set it to the offsetWidth. If the "width" is 
                    not set, then in IE  you can only drag the panel when you 
                    put the cursor on the header's text.
                */
        
                var sWidth = this.cfg.getProperty("width");
                
                if (!sWidth) {
        
                    this.cfg.setProperty("width", 
                        (this.element.offsetWidth + "px"));
                
                }
            
            });
        
        
            var me = this;
        
            function doBlur() {
        
                this.blur();
        
            }
        
            this.showMaskEvent.subscribe(function () {
        
                function checkFocusable(el) {
        
                    var sTagName = el.tagName.toUpperCase(),
                        bFocusable = false;
                    
                    switch (sTagName) {
                    
                    case "A":
                    case "BUTTON":
                    case "SELECT":
                    case "TEXTAREA":
    
                        if (!Dom.isAncestor(me.element, el)) {
                            Event.on(el, "focus", doBlur, el, true);
                            bFocusable = true;
                        }
    
                        break;
    
                    case "INPUT":
    
                        if (el.type != "hidden" && 
                            !Dom.isAncestor(me.element, el)) {
    
                            Event.on(el, "focus", doBlur, el, true);
                            bFocusable = true;
    
                        }
    
                        break;
                    
                    }
        
                    return bFocusable;
        
                }
        
                this.focusableElements = Dom.getElementsBy(checkFocusable);
    
            }, this, true);
        
            this.hideMaskEvent.subscribe(function () {
    
                var aElements = this.focusableElements,
                    nElements = aElements.length,
                    el2,
                    i;
    
                for (i = 0; i < nElements; i++) {
                    el2 = aElements[i];
                    Event.removeListener(el2, "focus", doBlur);
                }
    
            }, this, true);
        
            this.beforeShowEvent.subscribe(function () {
                this.cfg.refireEvent("underlay");
            }, this, true);
            this.initEvent.fire(Panel);
        },
        
        /**
        * Initializes the custom events for Module which are fired 
        * automatically at appropriate times by the Module class.
        */
        initEvents: function () {
            Panel.superclass.initEvents.call(this);
        
            var SIGNATURE = CustomEvent.LIST;
        
            /**
            * CustomEvent fired after the modality mask is shown
            * @event showMaskEvent
            */
            this.showMaskEvent = this.createEvent(EVENT_TYPES.SHOW_MASK);
            this.showMaskEvent.signature = SIGNATURE;
        
            /**
            * CustomEvent fired after the modality mask is hidden
            * @event hideMaskEvent
            */
            this.hideMaskEvent = this.createEvent(EVENT_TYPES.HIDE_MASK);
            this.hideMaskEvent.signature = SIGNATURE;
        
            /**
            * CustomEvent when the Panel is dragged
            * @event dragEvent
            */
            this.dragEvent = this.createEvent(EVENT_TYPES.DRAG);
            this.dragEvent.signature = SIGNATURE;
        
        },
        
        /**
        * Initializes the class's configurable properties which can be changed 
        * using the Panel's Config object (cfg).
        * @method initDefaultConfig
        */
        initDefaultConfig: function () {
            Panel.superclass.initDefaultConfig.call(this);
        
            // Add panel config properties //
        
            /**
            * True if the Panel should display a "close" button
            * @config close
            * @type Boolean
            * @default true
            */
            this.cfg.addProperty(DEFAULT_CONFIG.CLOSE.key, { 
                handler: this.configClose, 
                value: DEFAULT_CONFIG.CLOSE.value, 
                validator: DEFAULT_CONFIG.CLOSE.validator, 
                supercedes: DEFAULT_CONFIG.CLOSE.supercedes 
            });
        
            /**
            * True if the Panel should be draggable.  Default value is "true" 
            * if the Drag and Drop utility is included, otherwise it is "false."
            * @config draggable
            * @type Boolean
            * @default true
            */
            this.cfg.addProperty(DEFAULT_CONFIG.DRAGGABLE.key, { 
                handler: this.configDraggable, 
                value: DEFAULT_CONFIG.DRAGGABLE.value, 
                validator: DEFAULT_CONFIG.DRAGGABLE.validator, 
                supercedes: DEFAULT_CONFIG.DRAGGABLE.supercedes 
            });
        
            /**
            * Sets the type of underlay to display for the Panel. Valid values 
            * are "shadow", "matte", and "none".
            * @config underlay
            * @type String
            * @default shadow
            */
            this.cfg.addProperty(DEFAULT_CONFIG.UNDERLAY.key, { 
                handler: this.configUnderlay, 
                value: DEFAULT_CONFIG.UNDERLAY.value, 
                supercedes: DEFAULT_CONFIG.UNDERLAY.supercedes 
            });
        
            /**
            * True if the Panel should be displayed in a modal fashion, 
            * automatically creating a transparent mask over the document that
            * will not be removed until the Panel is dismissed.
            * @config modal
            * @type Boolean
            * @default false
            */
            this.cfg.addProperty(DEFAULT_CONFIG.MODAL.key, { 
                handler: this.configModal, 
                value: DEFAULT_CONFIG.MODAL.value,
                validator: DEFAULT_CONFIG.MODAL.validator, 
                supercedes: DEFAULT_CONFIG.MODAL.supercedes 
            });
        
            /**
            * A KeyListener (or array of KeyListeners) that will be enabled 
            * when the Panel is shown, and disabled when the Panel is hidden.
            * @config keylisteners
            * @type YAHOO.util.KeyListener[]
            * @default null
            */
            this.cfg.addProperty(DEFAULT_CONFIG.KEY_LISTENERS.key, { 
                handler: this.configKeyListeners, 
                suppressEvent: DEFAULT_CONFIG.KEY_LISTENERS.suppressEvent, 
                supercedes: DEFAULT_CONFIG.KEY_LISTENERS.supercedes 
            });
        
        },
        
        // BEGIN BUILT-IN PROPERTY EVENT HANDLERS //
        
        /**
        * The default event handler fired when the "close" property is changed.
        * The method controls the appending or hiding of the close icon at the 
        * top right of the Panel.
        * @method configClose
        * @param {String} type The CustomEvent type (usually the property name)
        * @param {Object[]} args The CustomEvent arguments. For configuration 
        * handlers, args[0] will equal the newly applied value for the property.
        * @param {Object} obj The scope object. For configuration handlers, 
        * this will usually equal the owner.
        */
        configClose: function (type, args, obj) {
            var val = args[0];
        
            function doHide(e, obj) {
                obj.hide();
            }
        
            if (val) {
                if (!this.close) {
                    this.close = document.createElement("span");
                    Dom.addClass(this.close, "container-close");
                    this.close.innerHTML = "&#160;";
                    this.innerElement.appendChild(this.close);
                    Event.on(this.close, "click", doHide, this);
                } else {
                    this.close.style.display = "block";
                }
            } else {
                if (this.close) {
                    this.close.style.display = "none";
                }
            }
        },
        
        /**
        * The default event handler fired when the "draggable" property 
        * is changed.
        * @method configDraggable
        * @param {String} type The CustomEvent type (usually the property name)
        * @param {Object[]} args The CustomEvent arguments. For configuration 
        * handlers, args[0] will equal the newly applied value for the property.
        * @param {Object} obj The scope object. For configuration handlers, 
        * this will usually equal the owner.
        */
        configDraggable: function (type, args, obj) {
        
            var val = args[0];
            if (val) {
        
                if (!DD) {
            
                    YAHOO.log("DD dependency not met.", "error");
        
                    this.cfg.setProperty("draggable", false);
            
                    return;
                
                }
        
                if (this.header) {
                    Dom.setStyle(this.header,"cursor","move");
                    this.registerDragDrop();
                }
            } else {
                if (this.dd) {
                    this.dd.unreg();
                }
                if (this.header) {
                    Dom.setStyle(this.header,"cursor","auto");
                }
            }
        },
        
        /**
        * The default event handler fired when the "underlay" property 
        * is changed.
        * @method configUnderlay
        * @param {String} type The CustomEvent type (usually the property name)
        * @param {Object[]} args The CustomEvent arguments. For configuration 
        * handlers, args[0] will equal the newly applied value for the property.
        * @param {Object} obj The scope object. For configuration handlers, 
        * this will usually equal the owner.
        */
        configUnderlay: function (type, args, obj) {
    
            var val = args[0];
        
            switch (val.toLowerCase()) {
    
            case "shadow":
                Dom.removeClass(this.element, "matte");
                Dom.addClass(this.element, "shadow");
    
                if (!this.underlay) { // create if not already in DOM
                    this.underlay = document.createElement("div");
                    this.underlay.className = "underlay";
                    this.underlay.innerHTML = "&#160;";
                    this.element.appendChild(this.underlay);
                }
    
                this.sizeUnderlay();
                break;
            case "matte":
                Dom.removeClass(this.element, "shadow");
                Dom.addClass(this.element, "matte");
                break;
            default:
                Dom.removeClass(this.element, "shadow");
                Dom.removeClass(this.element, "matte");
                break;
            }
    
        },
        
        /**
        * The default event handler fired when the "modal" property is 
        * changed. This handler subscribes or unsubscribes to the show and hide
        * events to handle the display or hide of the modality mask.
        * @method configModal
        * @param {String} type The CustomEvent type (usually the property name)
        * @param {Object[]} args The CustomEvent arguments. For configuration 
        * handlers, args[0] will equal the newly applied value for the property.
        * @param {Object} obj The scope object. For configuration handlers, 
        * this will usually equal the owner.
        */
        configModal: function (type, args, obj) {
            var modal = args[0];
        
            if (modal) {
                this.buildMask();
        
                if (!Config.alreadySubscribed( this.beforeShowEvent, 
                    this.showMask, this)) {

                    this.beforeShowEvent.subscribe(this.showMask, this, true);
                }
                if (!Config.alreadySubscribed( this.hideEvent, 
                    this.hideMask, this)) {

                    this.hideEvent.subscribe(this.hideMask, this, true);
                }
                if (!Config.alreadySubscribed(Overlay.windowResizeEvent, 
                    this.sizeMask, this)) {

                    Overlay.windowResizeEvent.subscribe(this.sizeMask, 
                        this, true);
                }
                if (!Config.alreadySubscribed( this.destroyEvent, 
                    this.removeMask, this)) {

                    this.destroyEvent.subscribe(this.removeMask, this, true);
                }
        
                this.cfg.refireEvent("zIndex");

            } else {

                this.beforeShowEvent.unsubscribe(this.showMask, this);
                this.hideEvent.unsubscribe(this.hideMask, this);
                Overlay.windowResizeEvent.unsubscribe(this.sizeMask, this);
                this.destroyEvent.unsubscribe(this.removeMask, this);

            }
        },
        
        /**
        * Removes the modality mask.
        * @method removeMask
        */
        removeMask: function () {
        
            var oMask = this.mask,
                oParentNode;
        
            if (oMask) {
            
                /*
                    Hide the mask before destroying it to ensure that DOM
                    event handlers on focusable elements get removed.
                */
        
                this.hideMask();
            
                oParentNode = oMask.parentNode;
        
                if (oParentNode) {
        
                    oParentNode.removeChild(oMask);
        
                }
        
                this.mask = null;
            }
            
        },
        
        /**
        * The default event handler fired when the "keylisteners" property 
        * is changed.
        * @method configKeyListeners
        * @param {String} type The CustomEvent type (usually the property name)
        * @param {Object[]} args The CustomEvent arguments. For configuration
        * handlers, args[0] will equal the newly applied value for the property.
        * @param {Object} obj The scope object. For configuration handlers, 
        * this will usually equal the owner.
        */
        configKeyListeners: function (type, args, obj) {

            var listeners = args[0],
                listener,
                nListeners,
                i;
        
            if (listeners) {

                if (listeners instanceof Array) {

                    nListeners = listeners.length;

                    for (i = 0; i < nListeners; i++) {

                        listener = listeners[i];
        
                        if (!Config.alreadySubscribed(this.showEvent, 
                            listener.enable, listener)) {

                            this.showEvent.subscribe(listener.enable, 
                                listener, true);

                        }

                        if (!Config.alreadySubscribed(this.hideEvent, 
                            listener.disable, listener)) {

                            this.hideEvent.subscribe(listener.disable, 
                                listener, true);

                            this.destroyEvent.subscribe(listener.disable, 
                                listener, true);
                        }

                    }

                } else {

                    if (!Config.alreadySubscribed(this.showEvent, 
                        listeners.enable, listeners)) {

                        this.showEvent.subscribe(listeners.enable, 
                            listeners, true);
                    }

                    if (!Config.alreadySubscribed(this.hideEvent, 
                        listeners.disable, listeners)) {

                        this.hideEvent.subscribe(listeners.disable, 
                            listeners, true);

                        this.destroyEvent.subscribe(listeners.disable, 
                            listeners, true);

                    }

                }

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
                el = this.innerElement;
    
            Dom.setStyle(el, "height", height);
            this.cfg.refireEvent("underlay");
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
                el = this.innerElement;
    
            Dom.setStyle(el, "width", width);
            this.cfg.refireEvent("underlay");
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
    
            Panel.superclass.configzIndex.call(this, type, 
                args, obj);
        
            var maskZ = 0,
                currentZ = Dom.getStyle(this.element, "zIndex");
        
            if (this.mask) {
                if (!currentZ || isNaN(currentZ)) {
                    currentZ = 0;
                }
        
                if (currentZ === 0) {
                    this.cfg.setProperty("zIndex", 1);
                } else {
                    maskZ = currentZ - 1;
                    Dom.setStyle(this.mask, "zIndex", maskZ);
                }
        
            }
        },
        
        // END BUILT-IN PROPERTY EVENT HANDLERS //
        
        
        /**
        * Builds the wrapping container around the Panel that is used for 
        * positioning the shadow and matte underlays. The container element is 
        * assigned to a  local instance variable called container, and the 
        * element is reinserted inside of it.
        * @method buildWrapper
        */
        buildWrapper: function () {
    
            var elementParent = this.element.parentNode,
                originalElement = this.element,
                wrapper = document.createElement("div");
    
            wrapper.className = Panel.CSS_PANEL_CONTAINER;
            wrapper.id = originalElement.id + "_c";
        
            if (elementParent) {
                elementParent.insertBefore(wrapper, originalElement);
            }
        
            wrapper.appendChild(originalElement);
        
            this.element = wrapper;
            this.innerElement = originalElement;
        
            Dom.setStyle(this.innerElement, "visibility", "inherit");
        },
        
        /**
        * Adjusts the size of the shadow based on the size of the element.
        * @method sizeUnderlay
        */
        sizeUnderlay: function () {

            if (this.underlay && !YAHOO.env.ua.gecko && 
                !YAHOO.env.ua.webkit) {

                this.underlay.style.width = 
                    this.innerElement.offsetWidth + "px";

                this.underlay.style.height = 
                    this.innerElement.offsetHeight + "px";

            }

        },
        
        /**
        * Event handler fired when the resize monitor element is resized.
        * @method onDomResize
        * @param {DOMEvent} e The resize DOM event
        * @param {Object} obj The scope object
        */
        onDomResize: function (e, obj) {
            Panel.superclass.onDomResize.call(this, e, obj);
            var me = this;
            setTimeout(function () {
                me.sizeUnderlay();
            }, 0);
        },
        
        /**
        * Registers the Panel's header for drag & drop capability.
        * @method registerDragDrop
        */
        registerDragDrop: function () {
    
            var me = this;
    
            if (this.header) {
        
                if (!DD) {
        
                    YAHOO.log("DD dependency not met.", "error");
        
                    return;
                
                }
        
                this.dd = new DD(this.element.id, this.id);
        
                if (!this.header.id) {
                    this.header.id = this.id + "_h";
                }
        
    
                this.dd.startDrag = function () {
        
                    var offsetHeight,
                        offsetWidth,
                        viewPortWidth,
                        viewPortHeight,
                        scrollX,
                        scrollY,
                        topConstraint,
                        leftConstraint,
                        bottomConstraint,
                        rightConstraint;
    
                    if (YAHOO.env.ua.ie == 6) {
                        Dom.addClass(me.element,"drag");
                    }
        
                    if (me.cfg.getProperty("constraintoviewport")) {
    
                        offsetHeight = me.element.offsetHeight;
                        offsetWidth = me.element.offsetWidth;
                        
                        viewPortWidth = Dom.getViewportWidth();
                        viewPortHeight = Dom.getViewportHeight();
                        
                        scrollX = window.scrollX || 
                            document.documentElement.scrollLeft;

                        scrollY = window.scrollY || 
                            document.documentElement.scrollTop;
                        
                        topConstraint = scrollY + 10;
                        leftConstraint = scrollX + 10;

                        bottomConstraint = 
                            scrollY + viewPortHeight - offsetHeight - 10;

                        rightConstraint = 
                            scrollX + viewPortWidth - offsetWidth - 10;
        
                        this.minX = leftConstraint;
                        this.maxX = rightConstraint;
                        this.constrainX = true;
        
                        this.minY = topConstraint;
                        this.maxY = bottomConstraint;
                        this.constrainY = true;
    
                    } else {
    
                        this.constrainX = false;
                        this.constrainY = false;
    
                    }
        
                    me.dragEvent.fire("startDrag", arguments);
                };
        
                this.dd.onDrag = function () {
                    me.syncPosition();
                    me.cfg.refireEvent("iframe");
                    if (this.platform == "mac" && YAHOO.env.ua.gecko) {
                        this.showMacGeckoScrollbars();
                    }
        
                    me.dragEvent.fire("onDrag", arguments);
                };
        
                this.dd.endDrag = function () {
                    if (YAHOO.env.ua.ie == 6) {
                        Dom.removeClass(me.element,"drag");
                    }
        
                    me.dragEvent.fire("endDrag", arguments);
                };
        
                this.dd.setHandleElId(this.header.id);
                this.dd.addInvalidHandleType("INPUT");
                this.dd.addInvalidHandleType("SELECT");
                this.dd.addInvalidHandleType("TEXTAREA");
            }
        },
        
        /**
        * Builds the mask that is laid over the document when the Panel is 
        * configured to be modal.
        * @method buildMask
        */
        buildMask: function () {
    
            var firstChild;
    
            function maskClick(e, obj) {
                Event.stopEvent(e);
            }
    
            if (!this.mask) {
                this.mask = document.createElement("div");
                this.mask.id = this.id + "_mask";
                this.mask.className = "mask";
                this.mask.innerHTML = "&#160;";
        
                firstChild = document.body.firstChild;
                if (firstChild) {
                    document.body.insertBefore(this.mask, 
                        document.body.firstChild);
                } else {
                    document.body.appendChild(this.mask);
                }
            }
        },
        
        /**
        * Hides the modality mask.
        * @method hideMask
        */
        hideMask: function () {
            if (this.cfg.getProperty("modal") && this.mask) {
                this.mask.style.display = "none";
                this.hideMaskEvent.fire();
                Dom.removeClass(document.body, "masked");
            }
        },
        
        /**
        * Shows the modality mask.
        * @method showMask
        */
        showMask: function () {
            if (this.cfg.getProperty("modal") && this.mask) {
                Dom.addClass(document.body, "masked");
                this.sizeMask();
                this.mask.style.display = "block";
                this.showMaskEvent.fire();
            }
        },
        
        /**
        * Sets the size of the modality mask to cover the entire scrollable 
        * area of the document
        * @method sizeMask
        */
        sizeMask: function () {
            if (this.mask) {
                this.mask.style.height = Dom.getDocumentHeight() + "px";
                this.mask.style.width = Dom.getDocumentWidth() + "px";
            }
        },
        
        /**
        * Renders the Panel by inserting the elements that are not already in 
        * the main Panel into their correct places. Optionally appends the 
        * Panel to the specified node prior to the render's execution. NOTE: 
        * For Panels without existing markup, the appendToNode argument is 
        * REQUIRED. If this argument is ommitted and the current element is 
        * not present in the document, the function will return false, 
        * indicating that the render was a failure.
        * @method render
        * @param {String} appendToNode The element id to which the Module 
        * should be appended to prior to rendering <em>OR</em>
        * @param {HTMLElement} appendToNode The element to which the Module 
        * should be appended to prior to rendering
        * @return {boolean} Success or failure of the render
        */
        render: function (appendToNode) {

            return Panel.superclass.render.call(this, 
                appendToNode, this.innerElement);

        },
        
        /**
        * Removes the Panel element from the DOM and sets all child elements
        * to null.
        * @method destroy
        */
        destroy: function () {
        
            Overlay.windowResizeEvent.unsubscribe(this.sizeMask, this);
        
            if (this.close) {
            
                Event.purgeElement(this.close);
        
            }
        
            Panel.superclass.destroy.call(this);  
        
        },
        
        /**
        * Returns a String representation of the object.
        * @method toString
        * @return {String} The string representation of the Panel.
        */
        toString: function () {
            return "Panel " + this.id;
        }
    
    });

}());