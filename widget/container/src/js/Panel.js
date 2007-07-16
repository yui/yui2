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

        m_oMaskTemplate,
        m_oUnderlayTemplate,
        m_oCloseIconTemplate,

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


    // Private CustomEvent listeners

    /* 
        "beforeRender" event handler that creates an empty header for a Panel 
        instance if its "draggable" configuration property is set to "true" 
        and no header has been created.
    */

    function createHeader(p_sType, p_aArgs) {

        if (!this.header) {

            this.setHeader("&#160;");

        }

    }


    /* 
        "hide" event handler that sets a Panel instance's "width"
        configuration property back to its original value before 
        "setWidthToOffsetWidth" was called.
    */
    
    function restoreOriginalWidth(p_sType, p_aArgs, p_oObject) {

        var sOriginalWidth = p_oObject[0],
            sNewWidth = p_oObject[1],
            oConfig = this.cfg,
            sCurrentWidth = oConfig.getProperty("width");

        if (sCurrentWidth == sNewWidth) {
            
            oConfig.setProperty("width", sOriginalWidth);
        
        }

        this.unsubscribe("hide", this._onHide, p_oObject);
    
    }


    /* 
        "beforeShow" event handler that sets a Panel instance's "width"
        configuration property to the value of its root HTML 
        elements's offsetWidth
    */

    function setWidthToOffsetWidth(p_sType, p_aArgs) {

        var nIE = YAHOO.env.ua.ie,
            oConfig,
            sOriginalWidth,
            sNewWidth;

        if (nIE == 6 || (nIE == 7 && document.compatMode == "BackCompat")) {

            oConfig = this.cfg;
            sOriginalWidth = oConfig.getProperty("width");
            
            if (!sOriginalWidth || sOriginalWidth == "auto") {
    
                sNewWidth = (this.element.offsetWidth + "px");
    
                oConfig.setProperty("width", sNewWidth);
                
                this.subscribe("hide", restoreOriginalWidth, 
                    [(sOriginalWidth || ""), sNewWidth]);
            
            }
        
        }

    }

    /* 
        "focus" event handler for a focuable element.  Used to automatically 
        blur the element when it receives focus to ensure that a Panel 
        instance's modality is not compromised.
    */

    function onElementFocus() {

        this.blur();

    }

    /* 
        "showMask" event handler that adds a "focus" event handler to all
        focusable elements in the document to enforce a Panel instance's 
        modality from being compromised.
    */

    function addFocusEventHandlers(p_sType, p_aArgs) {

        var me = this;

        function isFocusable(el) {

            var sTagName = el.tagName.toUpperCase(),
                bFocusable = false;
            
            switch (sTagName) {
            
            case "A":
            case "BUTTON":
            case "SELECT":
            case "TEXTAREA":

                if (!Dom.isAncestor(me.element, el)) {
                    Event.on(el, "focus", onElementFocus, el, true);
                    bFocusable = true;
                }

                break;

            case "INPUT":

                if (el.type != "hidden" && 
                    !Dom.isAncestor(me.element, el)) {

                    Event.on(el, "focus", onElementFocus, el, true);
                    bFocusable = true;

                }

                break;
            
            }

            return bFocusable;

        }

        this.focusableElements = Dom.getElementsBy(isFocusable);
    
    }

    /* 
        "hideMask" event handler that removes all "focus" event handlers added 
        by the "addFocusEventHandlers" method.
    */
    
    function removeFocusEventHandlers(p_sType, p_aArgs) {

        var aElements = this.focusableElements,
            nElements = aElements.length,
            el2,
            i;

        for (i = 0; i < nElements; i++) {
            el2 = aElements[i];
            Event.removeListener(el2, "focus", onElementFocus);
        }

    }

    
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
        
            this.subscribe("showMask", addFocusEventHandlers);
            this.subscribe("hideMask", removeFocusEventHandlers);

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
            * Boolean specifying if the Panel should be draggable.  The default 
            * value is "true" if the Drag and Drop utility is included, 
            * otherwise it is "false." <strong>PLEASE NOTE:</strong> There is a 
            * known issue in IE 6 (Strict Mode and Quirks Mode) and IE 7 
            * (Quirks Mode) where Panels that either don't have a value set for 
            * their "width" configuration property, or their "width" 
            * configuration property is set to "auto" will only be draggable by
            * placing the mouse on the text of the Panel's header element.
            * To fix this bug, draggable Panels missing a value for their 
            * "width" configuration property, or whose "width" configuration 
            * property is set to "auto" will have it set to the value of 
            * their root HTML element's offsetWidth before they are made 
            * visible.  The calculated width is then removed when the Panel is   
            * hidden. <em>This fix is only applied to draggable Panels in IE 6 
            * (Strict Mode and Quirks Mode) and IE 7 (Quirks Mode)</em>. For 
            * more information on this issue see:
            * SourceForge bugs #1726972 and #1589210.
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

            var val = args[0],
                oClose = this.close;
        
            function doHide(e, obj) {

                obj.hide();

            }
        
            if (val) {

                if (!oClose) {

                    if (!m_oCloseIconTemplate) {

                        m_oCloseIconTemplate = document.createElement("span");
                        m_oCloseIconTemplate.innerHTML = "&#160;";
                        m_oCloseIconTemplate.className = "container-close";

                    }

                    oClose = m_oCloseIconTemplate.cloneNode(true);

                    this.innerElement.appendChild(oClose);

                    Event.on(oClose, "click", doHide, this);
                    
                    this.close = oClose;
                    

                } else {

                    oClose.style.display = "block";

                }

            } else {

                if (oClose) {

                    oClose.style.display = "none";

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

                    Dom.setStyle(this.header, "cursor", "move");

                    this.registerDragDrop();

                }

                this.subscribe("beforeRender", createHeader);
                this.subscribe("beforeShow", setWidthToOffsetWidth);

            } else {

                if (this.dd) {

                    this.dd.unreg();

                }

                if (this.header) {

                    Dom.setStyle(this.header,"cursor","auto");

                }

                this.unsubscribe("beforeRender", createHeader);
                this.unsubscribe("beforeShow", setWidthToOffsetWidth);

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
    
            var sUnderlay = args[0].toLowerCase(),
                oUnderlay = this.underlay;
                oElement = this.element;

            function createUnderlay() {

                var oUnderlay = this.underlay,
                    nIE;

                if (!oUnderlay) { // create if not already in DOM

                    if (!m_oUnderlayTemplate) {

                        m_oUnderlayTemplate = document.createElement("div");
                        m_oUnderlayTemplate.className = "underlay";
                    
                    }

                    oUnderlay = m_oUnderlayTemplate.cloneNode(false);
                    this.element.appendChild(oUnderlay);
                    
                    this.underlay = oUnderlay;

                    nIE = YAHOO.env.ua.ie;

                    if (nIE == 6 || 
                        (nIE == 7 && document.compatMode == "BackCompat")) {

                        this.cfg.subscribeToConfigEvent("width", 
                            this.sizeUnderlay);

                        this.cfg.subscribeToConfigEvent("height", 
                            this.sizeUnderlay);

                        YAHOO.widget.Module.textResizeEvent.subscribe(
                            this.sizeUnderlay, this, true);

                        this.sizeUnderlay();
                    
                    }

                }

            }

            function onBeforeShow() {
            
                createUnderlay.call(this);
    
                this.beforeShowEvent.unsubscribe(onBeforeShow);
            
            }
        

            switch (sUnderlay) {
    
            case "shadow":

                Dom.removeClass(oElement, "matte");
                Dom.addClass(oElement, "shadow");

                break;

            case "matte":

                Dom.removeClass(oElement, "shadow");
                Dom.addClass(oElement, "matte");

                break;

            default:

                Dom.removeClass(oElement, "shadow");
                Dom.removeClass(oElement, "matte");

                break;

            }


            if (sUnderlay == "shadow" || 
                ((this.platform == "mac" && YAHOO.env.ua.gecko) && 
                !oUnderlay)) {
                
                if (this.cfg.getProperty("visible")) {
                
                    createUnderlay.call(this);                    
                
                }
                else {

                    this.beforeShowEvent.subscribe(onBeforeShow);                
                
                }

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

                if (!this._hasModalityEventListeners) {

                    this.subscribe("beforeShow", this.buildMask);
                    this.subscribe("beforeShow", this.bringToTop);
                    this.subscribe("beforeShow", this.showMask);
                    this.subscribe("hide", this.hideMask);

                    Overlay.windowResizeEvent.subscribe(this.sizeMask, 
                        this, true);

                    this._hasModalityEventListeners = true;

                }

            } else {

                if (this._hasModalityEventListeners) {

                    if (this.cfg.getProperty("visible")) {
                    
                        this.hideMask();
                        this.removeMask();
                    
                    }

                    this.unsubscribe("beforeShow", this.buildMask);
                    this.unsubscribe("beforeShow", this.bringToTop);
                    this.unsubscribe("beforeShow", this.showMask);
                    this.unsubscribe("hide", this.hideMask);

                    Overlay.windowResizeEvent.unsubscribe(this.sizeMask, this);
                    
                    this._hasModalityEventListeners = false;
                
                }

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
    
            Panel.superclass.configzIndex.call(this, type, args, obj);
        
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

            var oUnderlay = this.underlay,
                oElement;

            if (oUnderlay) {

                oElement = this.innerElement;

                oUnderlay.style.width = oElement.offsetWidth + "px";
                oUnderlay.style.height = oElement.offsetHeight + "px";

            }

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
                        
                        scrollX = Dom.getDocumentScrollLeft();
                        scrollY = Dom.getDocumentScrollTop();
                        
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
                    me.moveEvent.fire(me.cfg.getProperty("xy"));
                    
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
    
            var oMask = this.mask;
    
            if (!oMask) {

                if (!m_oMaskTemplate) {
                
                    m_oMaskTemplate = document.createElement("div");
                    m_oMaskTemplate.className = "mask";
                    m_oMaskTemplate.innerHTML = "&#160;";
                
                }

                oMask = m_oMaskTemplate.cloneNode(true);
                oMask.id = this.id + "_mask";

                document.body.insertBefore(oMask, document.body.firstChild);
                
                this.mask = oMask;

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
            
            this.removeMask();
        
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