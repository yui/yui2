


(function () {


/**
* Creates an item for a menu.
* 
* @param {String} p_oObject String specifying the text of the menu item.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-74680021">HTMLLIElement</a>} p_oObject Object specifying 
* the <code>&#60;li&#62;</code> element of the menu item.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-38450247">HTMLOptGroupElement</a>} p_oObject Object 
* specifying the <code>&#60;optgroup&#62;</code> element of the menu item.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-70901257">HTMLOptionElement</a>} p_oObject Object 
* specifying the <code>&#60;option&#62;</code> element of the menu item.
* @param {Object} p_oConfig Optional. Object literal specifying the 
* configuration for the menu item. See configuration class documentation 
* for more details.
* @class MenuItem
* @constructor
*/
YAHOO.widget.MenuItem = function (p_oObject, p_oConfig) {

    if (p_oObject) {

        if (p_oConfig) {
    
            this.parent = p_oConfig.parent;
            this.value = p_oConfig.value;
            this.id = p_oConfig.id;

        }

        this.init(p_oObject, p_oConfig);

    }

};


var Dom = YAHOO.util.Dom,
    Module = YAHOO.widget.Module,
    Menu = YAHOO.widget.Menu,
    MenuItem = YAHOO.widget.MenuItem,
    CustomEvent = YAHOO.util.CustomEvent,
    Lang = YAHOO.lang,

    m_oMenuItemTemplate,

    /**
    * Constant representing the name of the MenuItem's events
    * @property EVENT_TYPES
    * @private
    * @final
    * @type Object
    */
    EVENT_TYPES = {
    
        "MOUSE_OVER": "mouseover",
        "MOUSE_OUT": "mouseout",
        "MOUSE_DOWN": "mousedown",
        "MOUSE_UP": "mouseup",
        "CLICK": "click",
        "KEY_PRESS": "keypress",
        "KEY_DOWN": "keydown",
        "KEY_UP": "keyup",
        "ITEM_ADDED": "itemAdded",
        "ITEM_REMOVED": "itemRemoved",
        "FOCUS": "focus",
        "BLUR": "blur",
        "DESTROY": "destroy"
    
    },

    /**
    * Constant representing the MenuItem's configuration properties
    * @property DEFAULT_CONFIG
    * @private
    * @final
    * @type Object
    */
    DEFAULT_CONFIG = {
    
        "TEXT": { 
            key: "text", 
            value: "", 
            validator: Lang.isString, 
            suppressEvent: true 
        }, 
    
        "HELP_TEXT": { 
            key: "helptext",
            supercedes: ["text"], 
            suppressEvent: true 
        },
    
        "URL": { 
            key: "url", 
            value: "#", 
            suppressEvent: true 
        }, 
    
        "TARGET": { 
            key: "target", 
            suppressEvent: true 
        }, 
    
        "EMPHASIS": { 
            key: "emphasis", 
            value: false, 
            validator: Lang.isBoolean, 
            suppressEvent: true, 
            supercedes: ["text"]
        }, 
    
        "STRONG_EMPHASIS": { 
            key: "strongemphasis", 
            value: false, 
            validator: Lang.isBoolean, 
            suppressEvent: true,
            supercedes: ["text"]
        },
    
        "CHECKED": { 
            key: "checked", 
            value: false, 
            validator: Lang.isBoolean, 
            suppressEvent: true, 
            supercedes: ["disabled", "selected"]
        }, 

        "SUBMENU": { 
            key: "submenu",
            suppressEvent: true,
            supercedes: ["disabled", "selected"]
        },
    
        "DISABLED": { 
            key: "disabled", 
            value: false, 
            validator: Lang.isBoolean, 
            suppressEvent: true,
            supercedes: ["text", "selected"]
        },
    
        "SELECTED": { 
            key: "selected", 
            value: false, 
            validator: Lang.isBoolean, 
            suppressEvent: true
        },
    
        "ONCLICK": { 
            key: "onclick",
            suppressEvent: true
        },
    
        "CLASS_NAME": { 
            key: "classname", 
            value: null, 
            validator: Lang.isString,
            suppressEvent: true
        }
    
    };


MenuItem.prototype = {

    /**
    * @property CSS_CLASS_NAME
    * @description String representing the CSS class(es) to be applied to the 
    * <code>&#60;li&#62;</code> element of the menu item.
    * @default "yuimenuitem"
    * @final
    * @type String
    */
    CSS_CLASS_NAME: "yuimenuitem",


    /**
    * @property CSS_LABEL_CLASS_NAME
    * @description String representing the CSS class(es) to be applied to the 
    * menu item's <code>&#60;a&#62;</code> element.
    * @default "yuimenuitemlabel"
    * @final
    * @type String
    */
    CSS_LABEL_CLASS_NAME: "yuimenuitemlabel",


    /**
    * @property SUBMENU_TYPE
    * @description Object representing the type of menu to instantiate and 
    * add when parsing the child nodes of the menu item's source HTML element.
    * @final
    * @type YAHOO.widget.Menu
    */
    SUBMENU_TYPE: null,



    // Private member variables
    

    /**
    * @property _oAnchor
    * @description Object reference to the menu item's 
    * <code>&#60;a&#62;</code> element.
    * @default null 
    * @private
    * @type <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
    * one-html.html#ID-48250443">HTMLAnchorElement</a>
    */
    _oAnchor: null,
    
    
    /**
    * @property _oHelpTextEM
    * @description Object reference to the menu item's help text 
    * <code>&#60;em&#62;</code> element.
    * @default null
    * @private
    * @type <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
    * one-html.html#ID-58190037">HTMLElement</a>
    */
    _oHelpTextEM: null,
    
    
    /**
    * @property _oSubmenu
    * @description Object reference to the menu item's submenu.
    * @default null
    * @private
    * @type YAHOO.widget.Menu
    */
    _oSubmenu: null,


    /** 
    * @property _oOnclickAttributeValue
    * @description Object reference to the menu item's current value for the 
    * "onclick" configuration attribute.
    * @default null
    * @private
    * @type Object
    */
    _oOnclickAttributeValue: null,


    /**
    * @property _sClassName
    * @description The current value of the "classname" configuration attribute.
    * @default null
    * @private
    * @type String
    */
    _sClassName: null,



    // Public properties


	/**
    * @property constructor
	* @description Object reference to the menu item's constructor function.
    * @default YAHOO.widget.MenuItem
	* @type YAHOO.widget.MenuItem
	*/
	constructor: MenuItem,


    /**
    * @property index
    * @description Number indicating the ordinal position of the menu item in 
    * its group.
    * @default null
    * @type Number
    */
    index: null,


    /**
    * @property groupIndex
    * @description Number indicating the index of the group to which the menu 
    * item belongs.
    * @default null
    * @type Number
    */
    groupIndex: null,


    /**
    * @property parent
    * @description Object reference to the menu item's parent menu.
    * @default null
    * @type YAHOO.widget.Menu
    */
    parent: null,


    /**
    * @property element
    * @description Object reference to the menu item's 
    * <code>&#60;li&#62;</code> element.
    * @default <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level
    * -one-html.html#ID-74680021">HTMLLIElement</a>
    * @type <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
    * one-html.html#ID-74680021">HTMLLIElement</a>
    */
    element: null,


    /**
    * @property srcElement
    * @description Object reference to the HTML element (either 
    * <code>&#60;li&#62;</code>, <code>&#60;optgroup&#62;</code> or 
    * <code>&#60;option&#62;</code>) used create the menu item.
    * @default <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
    * level-one-html.html#ID-74680021">HTMLLIElement</a>|<a href="http://www.
    * w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-38450247"
    * >HTMLOptGroupElement</a>|<a href="http://www.w3.org/TR/2000/WD-DOM-
    * Level-1-20000929/level-one-html.html#ID-70901257">HTMLOptionElement</a>
    * @type <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
    * one-html.html#ID-74680021">HTMLLIElement</a>|<a href="http://www.w3.
    * org/TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-38450247">
    * HTMLOptGroupElement</a>|<a href="http://www.w3.org/TR/2000/WD-DOM-
    * Level-1-20000929/level-one-html.html#ID-70901257">HTMLOptionElement</a>
    */
    srcElement: null,


    /**
    * @property value
    * @description Object reference to the menu item's value.
    * @default null
    * @type Object
    */
    value: null,


	/**
    * @property browser
    * @deprecated Use YAHOO.env.ua
	* @description String representing the browser.
	* @type String
	*/
	browser: Module.prototype.browser,


    /**
    * @property id
    * @description Id of the menu item's root <code>&#60;li&#62;</code> 
    * element.  This property should be set via the constructor using the 
    * configuration object literal.  If an id is not specified, then one will 
    * be created using the "generateId" method of the Dom utility.
    * @default null
    * @type String
    */
    id: null,



    // Events


    /**
    * @event destroyEvent
    * @description Fires when the menu item's <code>&#60;li&#62;</code> 
    * element is removed from its parent <code>&#60;ul&#62;</code> element.
    * @type YAHOO.util.CustomEvent
    */
    destroyEvent: null,


    /**
    * @event mouseOverEvent
    * @description Fires when the mouse has entered the menu item.  Passes 
    * back the DOM Event object as an argument.
    * @type YAHOO.util.CustomEvent
    */
    mouseOverEvent: null,


    /**
    * @event mouseOutEvent
    * @description Fires when the mouse has left the menu item.  Passes back 
    * the DOM Event object as an argument.
    * @type YAHOO.util.CustomEvent
    */
    mouseOutEvent: null,


    /**
    * @event mouseDownEvent
    * @description Fires when the user mouses down on the menu item.  Passes 
    * back the DOM Event object as an argument.
    * @type YAHOO.util.CustomEvent
    */
    mouseDownEvent: null,


    /**
    * @event mouseUpEvent
    * @description Fires when the user releases a mouse button while the mouse 
    * is over the menu item.  Passes back the DOM Event object as an argument.
    * @type YAHOO.util.CustomEvent
    */
    mouseUpEvent: null,


    /**
    * @event clickEvent
    * @description Fires when the user clicks the on the menu item.  Passes 
    * back the DOM Event object as an argument.
    * @type YAHOO.util.CustomEvent
    */
    clickEvent: null,


    /**
    * @event keyPressEvent
    * @description Fires when the user presses an alphanumeric key when the 
    * menu item has focus.  Passes back the DOM Event object as an argument.
    * @type YAHOO.util.CustomEvent
    */
    keyPressEvent: null,


    /**
    * @event keyDownEvent
    * @description Fires when the user presses a key when the menu item has 
    * focus.  Passes back the DOM Event object as an argument.
    * @type YAHOO.util.CustomEvent
    */
    keyDownEvent: null,


    /**
    * @event keyUpEvent
    * @description Fires when the user releases a key when the menu item has 
    * focus.  Passes back the DOM Event object as an argument.
    * @type YAHOO.util.CustomEvent
    */
    keyUpEvent: null,


    /**
    * @event focusEvent
    * @description Fires when the menu item receives focus.
    * @type YAHOO.util.CustomEvent
    */
    focusEvent: null,


    /**
    * @event blurEvent
    * @description Fires when the menu item loses the input focus.
    * @type YAHOO.util.CustomEvent
    */
    blurEvent: null,


    /**
    * @method init
    * @description The MenuItem class's initialization method. This method is 
    * automatically called by the constructor, and sets up all DOM references 
    * for pre-existing markup, and creates required markup if it is not 
    * already present.
    * @param {String} p_oObject String specifying the text of the menu item.
    * @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
    * one-html.html#ID-74680021">HTMLLIElement</a>} p_oObject Object specifying 
    * the <code>&#60;li&#62;</code> element of the menu item.
    * @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
    * one-html.html#ID-38450247">HTMLOptGroupElement</a>} p_oObject Object 
    * specifying the <code>&#60;optgroup&#62;</code> element of the menu item.
    * @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
    * one-html.html#ID-70901257">HTMLOptionElement</a>} p_oObject Object 
    * specifying the <code>&#60;option&#62;</code> element of the menu item.
    * @param {Object} p_oConfig Optional. Object literal specifying the 
    * configuration for the menu item. See configuration class documentation 
    * for more details.
    */
    init: function (p_oObject, p_oConfig) {


        if (!this.SUBMENU_TYPE) {
    
            this.SUBMENU_TYPE = Menu;
    
        }


        // Create the config object

        this.cfg = new YAHOO.util.Config(this);

        this.initDefaultConfig();

        var SIGNATURE = CustomEvent.LIST,
            oConfig = this.cfg,
            sURL = "#",
            oAnchor,
            sTarget,
            sText,
            sId;


        if (Lang.isString(p_oObject)) {

            this._createRootNodeStructure();

            oConfig.queueProperty("text", p_oObject);

        }
        else if (p_oObject && p_oObject.tagName) {

            switch(p_oObject.tagName.toUpperCase()) {

                case "OPTION":

                    this._createRootNodeStructure();

                    oConfig.queueProperty("text", p_oObject.text);
                    oConfig.queueProperty("disabled", p_oObject.disabled);

                    this.value = p_oObject.value;

                    this.srcElement = p_oObject;

                break;

                case "OPTGROUP":

                    this._createRootNodeStructure();

                    oConfig.queueProperty("text", p_oObject.label);
                    oConfig.queueProperty("disabled", p_oObject.disabled);

                    this.srcElement = p_oObject;

                    this._initSubTree();

                break;

                case "LI":

                    // Get the anchor node (if it exists)
                    
                    oAnchor = Dom.getFirstChild(p_oObject);


                    // Capture the "text" and/or the "URL"

                    if (oAnchor) {

                        sURL = oAnchor.getAttribute("href", 2);
                        sTarget = oAnchor.getAttribute("target");

                        sText = oAnchor.innerHTML;

                    }

                    this.srcElement = p_oObject;
                    this.element = p_oObject;
                    this._oAnchor = oAnchor;

                    /*
                        Set these properties silently to sync up the 
                        configuration object without making changes to the 
                        element's DOM
                    */ 

                    oConfig.setProperty("text", sText, true);
                    oConfig.setProperty("url", sURL, true);
                    oConfig.setProperty("target", sTarget, true);

                    this._initSubTree();

                break;

            }            

        }


        if (this.element) {

            sId = (this.srcElement || this.element).id;

            if (!sId) {

                sId = this.id || Dom.generateId();

                this.element.id = sId;

            }

            this.id = sId;


            Dom.addClass(this.element, this.CSS_CLASS_NAME);
            Dom.addClass(this._oAnchor, this.CSS_LABEL_CLASS_NAME);


            // Create custom events

            this.mouseOverEvent = this.createEvent(EVENT_TYPES.MOUSE_OVER);
            this.mouseOverEvent.signature = SIGNATURE;

            this.mouseOutEvent = this.createEvent(EVENT_TYPES.MOUSE_OUT);
            this.mouseOutEvent.signature = SIGNATURE;

            this.mouseDownEvent = this.createEvent(EVENT_TYPES.MOUSE_DOWN);
            this.mouseDownEvent.signature = SIGNATURE;

            this.mouseUpEvent = this.createEvent(EVENT_TYPES.MOUSE_UP);
            this.mouseUpEvent.signature = SIGNATURE;

            this.clickEvent = this.createEvent(EVENT_TYPES.CLICK);
            this.clickEvent.signature = SIGNATURE;

            this.keyPressEvent = this.createEvent(EVENT_TYPES.KEY_PRESS);
            this.keyPressEvent.signature = SIGNATURE;

            this.keyDownEvent = this.createEvent(EVENT_TYPES.KEY_DOWN);
            this.keyDownEvent.signature = SIGNATURE;

            this.keyUpEvent = this.createEvent(EVENT_TYPES.KEY_UP);
            this.keyUpEvent.signature = SIGNATURE;

            this.focusEvent = this.createEvent(EVENT_TYPES.FOCUS);
            this.focusEvent.signature = SIGNATURE;

            this.blurEvent = this.createEvent(EVENT_TYPES.BLUR);
            this.blurEvent.signature = SIGNATURE;

            this.destroyEvent = this.createEvent(EVENT_TYPES.DESTROY);
            this.destroyEvent.signature = SIGNATURE;

            if (p_oConfig) {
    
                oConfig.applyConfig(p_oConfig);
    
            }        

            oConfig.fireQueue();

        }

    },



    // Private methods


    /**
    * @method _createRootNodeStructure
    * @description Creates the core DOM structure for the menu item.
    * @private
    */
    _createRootNodeStructure: function () {

        var oElement,
            oAnchor;

        if (!m_oMenuItemTemplate) {

            m_oMenuItemTemplate = document.createElement("li");
            m_oMenuItemTemplate.innerHTML = "<a href=\"#\"></a>";

        }

        oElement = m_oMenuItemTemplate.cloneNode(true);
        oElement.className = this.CSS_CLASS_NAME;

        oAnchor = oElement.firstChild;
        oAnchor.className = this.CSS_LABEL_CLASS_NAME;
        
        this.element = oElement;
        this._oAnchor = oAnchor;

    },


    /**
    * @method _initSubTree
    * @description Iterates the source element's childNodes collection and uses 
    * the child nodes to instantiate other menus.
    * @private
    */
    _initSubTree: function () {

        var oSrcEl = this.srcElement,
            oConfig = this.cfg,
            oNode,
            aOptions,
            nOptions,
            oMenu,
            n;


        if (oSrcEl.childNodes.length > 0) {

            if (this.parent.lazyLoad && this.parent.srcElement && 
                this.parent.srcElement.tagName.toUpperCase() == "SELECT") {

                oConfig.setProperty(
                        "submenu", 
                        { id: Dom.generateId(), itemdata: oSrcEl.childNodes }
                    );

            }
            else {

                oNode = oSrcEl.firstChild;
                aOptions = [];
    
                do {
    
                    if (oNode && oNode.tagName) {
    
                        switch(oNode.tagName.toUpperCase()) {
                
                            case "DIV":
                
                                oConfig.setProperty("submenu", oNode);
                
                            break;
         
                            case "OPTION":
        
                                aOptions[aOptions.length] = oNode;
        
                            break;
               
                        }
                    
                    }
                
                }        
                while((oNode = oNode.nextSibling));
    
    
                nOptions = aOptions.length;
    
                if (nOptions > 0) {
    
                    oMenu = new this.SUBMENU_TYPE(Dom.generateId());
                    
                    oConfig.setProperty("submenu", oMenu);
    
                    for(n=0; n<nOptions; n++) {
        
                        oMenu.addItem((new oMenu.ITEM_TYPE(aOptions[n])));
        
                    }
        
                }
            
            }

        }

    },



    // Event handlers for configuration properties


    /**
    * @method configText
    * @description Event handler for when the "text" configuration property of 
    * the menu item changes.
    * @param {String} p_sType String representing the name of the event that 
    * was fired.
    * @param {Array} p_aArgs Array of arguments sent when the event was fired.
    * @param {YAHOO.widget.MenuItem} p_oItem Object representing the menu item
    * that fired the event.
    */
    configText: function (p_sType, p_aArgs, p_oItem) {

        var sText = p_aArgs[0],
            oConfig = this.cfg,
            oAnchor = this._oAnchor,
            sHelpText = oConfig.getProperty("helptext"),
            sHelpTextHTML = "",
            sEmphasisStartTag = "",
            sEmphasisEndTag = "";


        if (sText) {


            if (sHelpText) {
                    
                sHelpTextHTML = "<em class=\"helptext\">" + sHelpText + "</em>";
            
            }


            if (oConfig.getProperty("emphasis")) {

                sEmphasisStartTag = "<em>";
                sEmphasisEndTag = "</em>";

            }


            if (oConfig.getProperty("strongemphasis")) {

                sEmphasisStartTag = "<strong>";
                sEmphasisEndTag = "</strong>";
            
            }


            oAnchor.innerHTML = (sEmphasisStartTag + sText + 
                sEmphasisEndTag + sHelpTextHTML);

        }

    },


    /**
    * @method configHelpText
    * @description Event handler for when the "helptext" configuration property 
    * of the menu item changes.
    * @param {String} p_sType String representing the name of the event that 
    * was fired.
    * @param {Array} p_aArgs Array of arguments sent when the event was fired.
    * @param {YAHOO.widget.MenuItem} p_oItem Object representing the menu item
    * that fired the event.
    */    
    configHelpText: function (p_sType, p_aArgs, p_oItem) {

        this.cfg.refireEvent("text");

    },


    /**
    * @method configURL
    * @description Event handler for when the "url" configuration property of 
    * the menu item changes.
    * @param {String} p_sType String representing the name of the event that 
    * was fired.
    * @param {Array} p_aArgs Array of arguments sent when the event was fired.
    * @param {YAHOO.widget.MenuItem} p_oItem Object representing the menu item
    * that fired the event.
    */    
    configURL: function (p_sType, p_aArgs, p_oItem) {

        var sURL = p_aArgs[0];

        if (!sURL) {

            sURL = "#";

        }

        var oAnchor = this._oAnchor;

        if (YAHOO.env.ua.opera) {

            oAnchor.removeAttribute("href");
        
        }

        oAnchor.setAttribute("href", sURL);

    },


    /**
    * @method configTarget
    * @description Event handler for when the "target" configuration property 
    * of the menu item changes.  
    * @param {String} p_sType String representing the name of the event that 
    * was fired.
    * @param {Array} p_aArgs Array of arguments sent when the event was fired.
    * @param {YAHOO.widget.MenuItem} p_oItem Object representing the menu item
    * that fired the event.
    */    
    configTarget: function (p_sType, p_aArgs, p_oItem) {

        var sTarget = p_aArgs[0],
            oAnchor = this._oAnchor;

        if (sTarget && sTarget.length > 0) {

            oAnchor.setAttribute("target", sTarget);

        }
        else {

            oAnchor.removeAttribute("target");
        
        }

    },


    /**
    * @method configEmphasis
    * @description Event handler for when the "emphasis" configuration property
    * of the menu item changes.
    * @param {String} p_sType String representing the name of the event that 
    * was fired.
    * @param {Array} p_aArgs Array of arguments sent when the event was fired.
    * @param {YAHOO.widget.MenuItem} p_oItem Object representing the menu item
    * that fired the event.
    */    
    configEmphasis: function (p_sType, p_aArgs, p_oItem) {

        var bEmphasis = p_aArgs[0],
            oConfig = this.cfg;


        if (bEmphasis && oConfig.getProperty("strongemphasis")) {

            oConfig.setProperty("strongemphasis", false);

        }


        oConfig.refireEvent("text");

    },


    /**
    * @method configStrongEmphasis
    * @description Event handler for when the "strongemphasis" configuration 
    * property of the menu item changes.
    * @param {String} p_sType String representing the name of the event that 
    * was fired.
    * @param {Array} p_aArgs Array of arguments sent when the event was fired.
    * @param {YAHOO.widget.MenuItem} p_oItem Object representing the menu item
    * that fired the event.
    */    
    configStrongEmphasis: function (p_sType, p_aArgs, p_oItem) {

        var bStrongEmphasis = p_aArgs[0],
            oConfig = this.cfg;


        if (bStrongEmphasis && oConfig.getProperty("emphasis")) {

            oConfig.setProperty("emphasis", false);

        }

        oConfig.refireEvent("text");

    },


    /**
    * @method configChecked
    * @description Event handler for when the "checked" configuration property 
    * of the menu item changes. 
    * @param {String} p_sType String representing the name of the event that 
    * was fired.
    * @param {Array} p_aArgs Array of arguments sent when the event was fired.
    * @param {YAHOO.widget.MenuItem} p_oItem Object representing the menu item
    * that fired the event.
    */    
    configChecked: function (p_sType, p_aArgs, p_oItem) {

        var bChecked = p_aArgs[0],
            oElement = this.element,
            oAnchor = this._oAnchor,
            oConfig = this.cfg,
            sState = "-checked",
            sClassName = this.CSS_CLASS_NAME + sState,
            sLabelClassName = this.CSS_LABEL_CLASS_NAME + sState;


        if (bChecked) {

            Dom.addClass(oElement, sClassName);
            Dom.addClass(oAnchor, sLabelClassName);

        }
        else {

            Dom.removeClass(oElement, sClassName);
            Dom.removeClass(oAnchor, sLabelClassName);
        
        }


        oConfig.refireEvent("text");


        if (oConfig.getProperty("disabled")) {

            oConfig.refireEvent("disabled");

        }


        if (oConfig.getProperty("selected")) {

            oConfig.refireEvent("selected");

        }

    },



    /**
    * @method configDisabled
    * @description Event handler for when the "disabled" configuration property 
    * of the menu item changes. 
    * @param {String} p_sType String representing the name of the event that 
    * was fired.
    * @param {Array} p_aArgs Array of arguments sent when the event was fired.
    * @param {YAHOO.widget.MenuItem} p_oItem Object representing the menu item
    * that fired the event.
    */    
    configDisabled: function (p_sType, p_aArgs, p_oItem) {

        var bDisabled = p_aArgs[0],
            oConfig = this.cfg,
            oSubmenu = oConfig.getProperty("submenu"),
            bChecked = oConfig.getProperty("checked"),
            oElement = this.element,
            oAnchor = this._oAnchor,
            sState = "-disabled",
            sCheckedState = "-checked" + sState,
            sSubmenuState = "-hassubmenu" + sState,
            sClassName = this.CSS_CLASS_NAME + sState,
            sLabelClassName = this.CSS_LABEL_CLASS_NAME + sState,
            sCheckedClassName = this.CSS_CLASS_NAME + sCheckedState,
            sLabelCheckedClassName = this.CSS_LABEL_CLASS_NAME + sCheckedState,
            sSubmenuClassName = this.CSS_CLASS_NAME + sSubmenuState,
            sLabelSubmenuClassName = this.CSS_LABEL_CLASS_NAME + sSubmenuState;


        if (bDisabled) {

            if (oConfig.getProperty("selected")) {

                oConfig.setProperty("selected", false);

            }

            Dom.addClass(oElement, sClassName);
            Dom.addClass(oAnchor, sLabelClassName);


            if (oSubmenu) {

                Dom.addClass(oElement, sSubmenuClassName);
                Dom.addClass(oAnchor, sLabelSubmenuClassName);
            
            }
            

            if (bChecked) {

                Dom.addClass(oElement, sCheckedClassName);
                Dom.addClass(oAnchor, sLabelCheckedClassName);

            }

        }
        else {

            Dom.removeClass(oElement, sClassName);
            Dom.removeClass(oAnchor, sLabelClassName);


            if (oSubmenu) {

                Dom.removeClass(oElement, sSubmenuClassName);
                Dom.removeClass(oAnchor, sLabelSubmenuClassName);
            
            }
            

            if (bChecked) {

                Dom.removeClass(oElement, sCheckedClassName);
                Dom.removeClass(oAnchor, sLabelCheckedClassName);

            }

        }

    },


    /**
    * @method configSelected
    * @description Event handler for when the "selected" configuration property 
    * of the menu item changes. 
    * @param {String} p_sType String representing the name of the event that 
    * was fired.
    * @param {Array} p_aArgs Array of arguments sent when the event was fired.
    * @param {YAHOO.widget.MenuItem} p_oItem Object representing the menu item
    * that fired the event.
    */    
    configSelected: function (p_sType, p_aArgs, p_oItem) {

        var oConfig = this.cfg,
            bSelected = p_aArgs[0],
            oElement = this.element,
            oAnchor = this._oAnchor,
            bChecked = oConfig.getProperty("checked"),
            oSubmenu = oConfig.getProperty("submenu"),
            sState = "-selected",
            sCheckedState = "-checked" + sState,
            sSubmenuState = "-hassubmenu" + sState,
            sClassName = this.CSS_CLASS_NAME + sState,
            sLabelClassName = this.CSS_LABEL_CLASS_NAME + sState,
            sCheckedClassName = this.CSS_CLASS_NAME + sCheckedState,
            sLabelCheckedClassName = this.CSS_LABEL_CLASS_NAME + sCheckedState,
            sSubmenuClassName = this.CSS_CLASS_NAME + sSubmenuState,
            sLabelSubmenuClassName = this.CSS_LABEL_CLASS_NAME + sSubmenuState;


        if (YAHOO.env.ua.opera) {

            oAnchor.blur();
        
        }


        if (bSelected && !oConfig.getProperty("disabled")) {

            Dom.addClass(oElement, sClassName);
            Dom.addClass(oAnchor, sLabelClassName);


            if (oSubmenu) {

                Dom.addClass(oElement, sSubmenuClassName);
                Dom.addClass(oAnchor, sLabelSubmenuClassName);
            
            }


            if (bChecked) {

                Dom.addClass(oElement, sCheckedClassName);
                Dom.addClass(oAnchor, sLabelCheckedClassName);

            }

        }
        else {

            Dom.removeClass(oElement, sClassName);
            Dom.removeClass(oAnchor, sLabelClassName);


            if (oSubmenu) {

                Dom.removeClass(oElement, sSubmenuClassName);
                Dom.removeClass(oAnchor, sLabelSubmenuClassName);
            
            }

        
            if (bChecked) {

                Dom.removeClass(oElement, sCheckedClassName);
                Dom.removeClass(oAnchor, sLabelCheckedClassName);

            }

        }


        if (this.hasFocus() && YAHOO.env.ua.opera) {
        
            oAnchor.focus();
        
        }

    },


    /**
    * @method _onSubmenuBeforeHide
    * @description "beforehide" Custom Event handler for a submenu.
    * @private
    * @param {String} p_sType String representing the name of the event that 
    * was fired.
    * @param {Array} p_aArgs Array of arguments sent when the event was fired.
    */
    _onSubmenuBeforeHide: function (p_sType, p_aArgs) {

        var oItem = this.parent,
            oMenu;

        function onHide() {

            oItem._oAnchor.blur();
            oMenu.beforeHideEvent.unsubscribe(onHide);
        
        }


        if (oItem.hasFocus()) {

            oMenu = oItem.parent;

            oMenu.beforeHideEvent.subscribe(onHide);
        
        }
    
    },


    /**
    * @method configSubmenu
    * @description Event handler for when the "submenu" configuration property 
    * of the menu item changes. 
    * @param {String} p_sType String representing the name of the event that 
    * was fired.
    * @param {Array} p_aArgs Array of arguments sent when the event was fired.
    * @param {YAHOO.widget.MenuItem} p_oItem Object representing the menu item
    * that fired the event.
    */
    configSubmenu: function (p_sType, p_aArgs, p_oItem) {

        var oSubmenu = p_aArgs[0],
            oConfig = this.cfg,
            oElement = this.element,
            oAnchor = this._oAnchor,
            bLazyLoad = this.parent && this.parent.lazyLoad,
            sState = "-hassubmenu",
            sClassName = this.CSS_CLASS_NAME + sState,
            sLabelClassName = this.CSS_LABEL_CLASS_NAME + sState,
            oMenu,
            sSubmenuId,
            oSubmenuConfig;


        if (oSubmenu) {

            if (oSubmenu instanceof Menu) {

                oMenu = oSubmenu;
                oMenu.parent = this;
                oMenu.lazyLoad = bLazyLoad;

            }
            else if (typeof oSubmenu == "object" && oSubmenu.id && !oSubmenu.nodeType) {

                sSubmenuId = oSubmenu.id;
                oSubmenuConfig = oSubmenu;

                oSubmenuConfig.lazyload = bLazyLoad;
                oSubmenuConfig.parent = this;

                oMenu = new this.SUBMENU_TYPE(sSubmenuId, oSubmenuConfig);


                // Set the value of the property to the Menu instance

                oConfig.setProperty("submenu", oMenu, true);

            }
            else {

                oMenu = new this.SUBMENU_TYPE(oSubmenu, { lazyload: bLazyLoad, parent: this });


                // Set the value of the property to the Menu instance
                
                oConfig.setProperty("submenu", oMenu, true);

            }


            if (oMenu) {

				oMenu.cfg.setProperty("preventcontextoverlap", true);

                Dom.addClass(oElement, sClassName);
                Dom.addClass(oAnchor, sLabelClassName);

                this._oSubmenu = oMenu;

                if (YAHOO.env.ua.opera) {
                
                    oMenu.beforeHideEvent.subscribe(this._onSubmenuBeforeHide);               
                
                }
            
            }

        }
        else {

            Dom.removeClass(oElement, sClassName);
            Dom.removeClass(oAnchor, sLabelClassName);

            if (this._oSubmenu) {

                this._oSubmenu.destroy();

            }

        }


        if (oConfig.getProperty("disabled")) {

            oConfig.refireEvent("disabled");

        }


        if (oConfig.getProperty("selected")) {

            oConfig.refireEvent("selected");

        }

    },


    /**
    * @method configOnClick
    * @description Event handler for when the "onclick" configuration property 
    * of the menu item changes. 
    * @param {String} p_sType String representing the name of the event that 
    * was fired.
    * @param {Array} p_aArgs Array of arguments sent when the event was fired.
    * @param {YAHOO.widget.MenuItem} p_oItem Object representing the menu item
    * that fired the event.
    */
    configOnClick: function (p_sType, p_aArgs, p_oItem) {

        var oObject = p_aArgs[0];

        /*
            Remove any existing listeners if a "click" event handler has 
            already been specified.
        */

        if (this._oOnclickAttributeValue && (this._oOnclickAttributeValue != oObject)) {

            this.clickEvent.unsubscribe(this._oOnclickAttributeValue.fn, 
                                this._oOnclickAttributeValue.obj);

            this._oOnclickAttributeValue = null;

        }


        if (!this._oOnclickAttributeValue && typeof oObject == "object" && 
            typeof oObject.fn == "function") {
            
            this.clickEvent.subscribe(oObject.fn, 
                (("obj" in oObject) ? oObject.obj : this), 
                (("scope" in oObject) ? oObject.scope : null) );

            this._oOnclickAttributeValue = oObject;

        }
    
    },


    /**
    * @method configClassName
    * @description Event handler for when the "classname" configuration 
    * property of a menu item changes.
    * @param {String} p_sType String representing the name of the event that 
    * was fired.
    * @param {Array} p_aArgs Array of arguments sent when the event was fired.
    * @param {YAHOO.widget.MenuItem} p_oItem Object representing the menu item
    * that fired the event.
    */
    configClassName: function (p_sType, p_aArgs, p_oItem) {
    
        var sClassName = p_aArgs[0];
    
        if (this._sClassName) {
    
            Dom.removeClass(this.element, this._sClassName);
    
        }
    
        Dom.addClass(this.element, sClassName);
        this._sClassName = sClassName;
    
    },



    // Public methods


	/**
    * @method initDefaultConfig
	* @description Initializes an item's configurable properties.
	*/
	initDefaultConfig : function () {

        var oConfig = this.cfg;


        // Define the configuration attributes

        /**
        * @config text
        * @description String specifying the text label for the menu item.  
        * When building a menu from existing HTML the value of this property
        * will be interpreted from the menu's markup.
        * @default ""
        * @type String
        */
        oConfig.addProperty(
            DEFAULT_CONFIG.TEXT.key, 
            { 
                handler: this.configText, 
                value: DEFAULT_CONFIG.TEXT.value, 
                validator: DEFAULT_CONFIG.TEXT.validator, 
                suppressEvent: DEFAULT_CONFIG.TEXT.suppressEvent 
            }
        );
        

        /**
        * @config helptext
        * @description String specifying additional instructional text to 
        * accompany the text for the menu item.
        * @deprecated Use "text" configuration property to add help text markup.  
        * For example: <code>oMenuItem.cfg.setProperty("text", "Copy &#60;em 
        * class=\"helptext\"&#62;Ctrl + C&#60;/em&#62;");</code>
        * @default null
        * @type String|<a href="http://www.w3.org/TR/
        * 2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-58190037">
        * HTMLElement</a>
        */
        oConfig.addProperty(
            DEFAULT_CONFIG.HELP_TEXT.key,
            {
                handler: this.configHelpText, 
                supercedes: DEFAULT_CONFIG.HELP_TEXT.supercedes,
                suppressEvent: DEFAULT_CONFIG.HELP_TEXT.suppressEvent 
            }
        );


        /**
        * @config url
        * @description String specifying the URL for the menu item's anchor's 
        * "href" attribute.  When building a menu from existing HTML the value 
        * of this property will be interpreted from the menu's markup.
        * @default "#"
        * @type String
        */        
        oConfig.addProperty(
            DEFAULT_CONFIG.URL.key, 
            {
                handler: this.configURL, 
                value: DEFAULT_CONFIG.URL.value, 
                suppressEvent: DEFAULT_CONFIG.URL.suppressEvent
            }
        );


        /**
        * @config target
        * @description String specifying the value for the "target" attribute 
        * of the menu item's anchor element. <strong>Specifying a target will 
        * require the user to click directly on the menu item's anchor node in
        * order to cause the browser to navigate to the specified URL.</strong> 
        * When building a menu from existing HTML the value of this property 
        * will be interpreted from the menu's markup.
        * @default null
        * @type String
        */        
        oConfig.addProperty(
            DEFAULT_CONFIG.TARGET.key, 
            {
                handler: this.configTarget, 
                suppressEvent: DEFAULT_CONFIG.TARGET.suppressEvent
            }
        );


        /**
        * @config emphasis
        * @description Boolean indicating if the text of the menu item will be 
        * rendered with emphasis.
        * @deprecated Use "text" configuration property to add emphasis.  
        * For example: <code>oMenuItem.cfg.setProperty("text", "&#60;em&#62;Some 
        * Text&#60;/em&#62;");</code>
        * @default false
        * @type Boolean
        */
        oConfig.addProperty(
            DEFAULT_CONFIG.EMPHASIS.key, 
            { 
                handler: this.configEmphasis, 
                value: DEFAULT_CONFIG.EMPHASIS.value, 
                validator: DEFAULT_CONFIG.EMPHASIS.validator, 
                suppressEvent: DEFAULT_CONFIG.EMPHASIS.suppressEvent,
                supercedes: DEFAULT_CONFIG.EMPHASIS.supercedes
            }
        );


        /**
        * @config strongemphasis
        * @description Boolean indicating if the text of the menu item will be 
        * rendered with strong emphasis.
        * @deprecated Use "text" configuration property to add strong emphasis.  
        * For example: <code>oMenuItem.cfg.setProperty("text", "&#60;strong&#62; 
        * Some Text&#60;/strong&#62;");</code>
        * @default false
        * @type Boolean
        */
        oConfig.addProperty(
            DEFAULT_CONFIG.STRONG_EMPHASIS.key,
            {
                handler: this.configStrongEmphasis,
                value: DEFAULT_CONFIG.STRONG_EMPHASIS.value,
                validator: DEFAULT_CONFIG.STRONG_EMPHASIS.validator,
                suppressEvent: DEFAULT_CONFIG.STRONG_EMPHASIS.suppressEvent,
                supercedes: DEFAULT_CONFIG.STRONG_EMPHASIS.supercedes
            }
        );


        /**
        * @config checked
        * @description Boolean indicating if the menu item should be rendered 
        * with a checkmark.
        * @default false
        * @type Boolean
        */
        oConfig.addProperty(
            DEFAULT_CONFIG.CHECKED.key, 
            {
                handler: this.configChecked, 
                value: DEFAULT_CONFIG.CHECKED.value, 
                validator: DEFAULT_CONFIG.CHECKED.validator, 
                suppressEvent: DEFAULT_CONFIG.CHECKED.suppressEvent,
                supercedes: DEFAULT_CONFIG.CHECKED.supercedes
            } 
        );


        /**
        * @config disabled
        * @description Boolean indicating if the menu item should be disabled.  
        * (Disabled menu items are  dimmed and will not respond to user input 
        * or fire events.)
        * @default false
        * @type Boolean
        */
        oConfig.addProperty(
            DEFAULT_CONFIG.DISABLED.key,
            {
                handler: this.configDisabled,
                value: DEFAULT_CONFIG.DISABLED.value,
                validator: DEFAULT_CONFIG.DISABLED.validator,
                suppressEvent: DEFAULT_CONFIG.DISABLED.suppressEvent
            }
        );


        /**
        * @config selected
        * @description Boolean indicating if the menu item should 
        * be highlighted.
        * @default false
        * @type Boolean
        */
        oConfig.addProperty(
            DEFAULT_CONFIG.SELECTED.key,
            {
                handler: this.configSelected,
                value: DEFAULT_CONFIG.SELECTED.value,
                validator: DEFAULT_CONFIG.SELECTED.validator,
                suppressEvent: DEFAULT_CONFIG.SELECTED.suppressEvent
            }
        );


        /**
        * @config submenu
        * @description Object specifying the submenu to be appended to the 
        * menu item.  The value can be one of the following: <ul><li>Object 
        * specifying a Menu instance.</li><li>Object literal specifying the
        * menu to be created.  Format: <code>{ id: [menu id], itemdata: 
        * [<a href="YAHOO.widget.Menu.html#itemData">array of values for 
        * items</a>] }</code>.</li><li>String specifying the id attribute 
        * of the <code>&#60;div&#62;</code> element of the menu.</li><li>
        * Object specifying the <code>&#60;div&#62;</code> element of the 
        * menu.</li></ul>
        * @default null
        * @type Menu|String|Object|<a href="http://www.w3.org/TR/2000/
        * WD-DOM-Level-1-20000929/level-one-html.html#ID-58190037">
        * HTMLElement</a>
        */
        oConfig.addProperty(
            DEFAULT_CONFIG.SUBMENU.key, 
            {
                handler: this.configSubmenu, 
                supercedes: DEFAULT_CONFIG.SUBMENU.supercedes,
                suppressEvent: DEFAULT_CONFIG.SUBMENU.suppressEvent
            }
        );


        /**
        * @config onclick
        * @description Object literal representing the code to be executed when 
        * the item is clicked.  Format:<br> <code> {<br> 
        * <strong>fn:</strong> Function,   &#47;&#47; The handler to call when 
        * the event fires.<br> <strong>obj:</strong> Object, &#47;&#47; An 
        * object to  pass back to the handler.<br> <strong>scope:</strong> 
        * Object &#47;&#47; The object to use for the scope of the handler.
        * <br> } </code>
        * @type Object
        * @default null
        */
        oConfig.addProperty(
            DEFAULT_CONFIG.ONCLICK.key, 
            {
                handler: this.configOnClick, 
                suppressEvent: DEFAULT_CONFIG.ONCLICK.suppressEvent 
            }
        );


        /**
        * @config classname
        * @description CSS class to be applied to the menu item's root 
        * <code>&#60;li&#62;</code> element.  The specified class(es) are 
        * appended in addition to the default class as specified by the menu 
        * item's CSS_CLASS_NAME constant.
        * @default null
        * @type String
        */
        oConfig.addProperty(
            DEFAULT_CONFIG.CLASS_NAME.key, 
            { 
                handler: this.configClassName,
                value: DEFAULT_CONFIG.CLASS_NAME.value, 
                validator: DEFAULT_CONFIG.CLASS_NAME.validator,
                suppressEvent: DEFAULT_CONFIG.CLASS_NAME.suppressEvent 
            }
        );

	},


    /**
    * @method getNextEnabledSibling
    * @description Finds the menu item's next enabled sibling.
    * @return YAHOO.widget.MenuItem
    */
    getNextEnabledSibling: function () {

        var nGroupIndex,
            aItemGroups,
            oNextItem,
            nNextGroupIndex,
            aNextGroup,
            returnVal;

        function getNextArrayItem(p_aArray, p_nStartIndex) {

            return p_aArray[p_nStartIndex] || getNextArrayItem(p_aArray, (p_nStartIndex+1));

        }

        if (this.parent instanceof Menu) {

            nGroupIndex = this.groupIndex;
    
            aItemGroups = this.parent.getItemGroups();
    
            if (this.index < (aItemGroups[nGroupIndex].length - 1)) {
    
                oNextItem = getNextArrayItem(aItemGroups[nGroupIndex], 
                        (this.index+1));
    
            }
            else {
    
                if (nGroupIndex < (aItemGroups.length - 1)) {
    
                    nNextGroupIndex = nGroupIndex + 1;
    
                }
                else {
    
                    nNextGroupIndex = 0;
    
                }
    
                aNextGroup = getNextArrayItem(aItemGroups, nNextGroupIndex);
    
                // Retrieve the first menu item in the next group
    
                oNextItem = getNextArrayItem(aNextGroup, 0);
    
            }
    
            returnVal = (oNextItem.cfg.getProperty("disabled") || 
                oNextItem.element.style.display == "none") ? 
                oNextItem.getNextEnabledSibling() : oNextItem;

        }
        
        return returnVal;

    },


    /**
    * @method getPreviousEnabledSibling
    * @description Finds the menu item's previous enabled sibling.
    * @return {YAHOO.widget.MenuItem}
    */
    getPreviousEnabledSibling: function () {

        var nGroupIndex,
            aItemGroups,
            oPreviousItem,
            nPreviousGroupIndex,
            aPreviousGroup,
            returnVal;

        function getPreviousArrayItem(p_aArray, p_nStartIndex) {

            return p_aArray[p_nStartIndex] || getPreviousArrayItem(p_aArray, (p_nStartIndex-1));

        }

        function getFirstItemIndex(p_aArray, p_nStartIndex) {

            return p_aArray[p_nStartIndex] ? p_nStartIndex : 
                getFirstItemIndex(p_aArray, (p_nStartIndex+1));

        }

       if (this.parent instanceof Menu) {

            nGroupIndex = this.groupIndex;
            aItemGroups = this.parent.getItemGroups();

    
            if (this.index > getFirstItemIndex(aItemGroups[nGroupIndex], 0)) {
    
                oPreviousItem = getPreviousArrayItem(aItemGroups[nGroupIndex], 
                        (this.index-1));
    
            }
            else {
    
                if (nGroupIndex > getFirstItemIndex(aItemGroups, 0)) {
    
                    nPreviousGroupIndex = nGroupIndex - 1;
    
                }
                else {
    
                    nPreviousGroupIndex = aItemGroups.length - 1;
    
                }
    
                aPreviousGroup = getPreviousArrayItem(aItemGroups, 
                    nPreviousGroupIndex);
    
                oPreviousItem = getPreviousArrayItem(aPreviousGroup, 
                        (aPreviousGroup.length - 1));
    
            }

            returnVal = (oPreviousItem.cfg.getProperty("disabled") || 
                oPreviousItem.element.style.display == "none") ? 
                oPreviousItem.getPreviousEnabledSibling() : oPreviousItem;

        }
        
        return returnVal;

    },


    /**
    * @method focus
    * @description Causes the menu item to receive the focus and fires the 
    * focus event.
    */
    focus: function () {

        var oParent = this.parent,
            oAnchor = this._oAnchor,
            oActiveItem = oParent.activeItem,
            me = this;


        function setFocus() {

            try {

                if (!(YAHOO.env.ua.ie && !document.hasFocus())) {
                
					if (oActiveItem) {
		
						oActiveItem.blurEvent.fire();
		
					}
	
					oAnchor.focus();
					
					me.focusEvent.fire();
                
                }

            }
            catch(e) {
            
            }

        }


        if (!this.cfg.getProperty("disabled") && oParent && 
            oParent.cfg.getProperty("visible") && 
            this.element.style.display != "none") {


            /*
                Setting focus via a timer fixes a race condition in Firefox, IE 
                and Opera where the browser viewport jumps as it trys to 
                position and focus the menu.
            */

            window.setTimeout(setFocus, 0);

        }

    },


    /**
    * @method blur
    * @description Causes the menu item to lose focus and fires the 
    * blur event.
    */    
    blur: function () {

        var oParent = this.parent;

        if (!this.cfg.getProperty("disabled") && oParent && 
            oParent.cfg.getProperty("visible")) {


            var me = this;
            
            window.setTimeout(function () {

                try {
    
                    me._oAnchor.blur();
                    me.blurEvent.fire();    

                } 
                catch (e) {
                
                }
                
            }, 0);

        }

    },


    /**
    * @method hasFocus
    * @description Returns a boolean indicating whether or not the menu item
    * has focus.
    * @return {Boolean}
    */
    hasFocus: function () {
    
        return (YAHOO.widget.MenuManager.getFocusedMenuItem() == this);
    
    },


	/**
    * @method destroy
	* @description Removes the menu item's <code>&#60;li&#62;</code> element 
	* from its parent <code>&#60;ul&#62;</code> element.
	*/
    destroy: function () {

        var oEl = this.element,
            oSubmenu,
            oParentNode;

        if (oEl) {


            // If the item has a submenu, destroy it first

            oSubmenu = this.cfg.getProperty("submenu");

            if (oSubmenu) {
            
                oSubmenu.destroy();
            
            }


            // Remove CustomEvent listeners
    
            this.mouseOverEvent.unsubscribeAll();
            this.mouseOutEvent.unsubscribeAll();
            this.mouseDownEvent.unsubscribeAll();
            this.mouseUpEvent.unsubscribeAll();
            this.clickEvent.unsubscribeAll();
            this.keyPressEvent.unsubscribeAll();
            this.keyDownEvent.unsubscribeAll();
            this.keyUpEvent.unsubscribeAll();
            this.focusEvent.unsubscribeAll();
            this.blurEvent.unsubscribeAll();
            this.cfg.configChangedEvent.unsubscribeAll();


            // Remove the element from the parent node

            oParentNode = oEl.parentNode;

            if (oParentNode) {

                oParentNode.removeChild(oEl);

                this.destroyEvent.fire();

            }

            this.destroyEvent.unsubscribeAll();

        }

    },


    /**
    * @method toString
    * @description Returns a string representing the menu item.
    * @return {String}
    */
    toString: function () {

        var sReturnVal = "MenuItem",
            sId = this.id;

        if (sId) {
    
            sReturnVal += (" " + sId);
        
        }

        return sReturnVal;
    
    }

};

Lang.augmentProto(MenuItem, YAHOO.util.EventProvider);

})();