/*
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
* @class The MenuModuleItem class allows you to create and modify an item for a
* MenuModule instance.
* @constructor
* @param {String or HTMLElement} p_oObject String or HTMLElement 
* (either HTMLLIElement, HTMLOptGroupElement or HTMLOptionElement) of the 
* source HTMLElement node.
* @param {Object} p_oUserConfig The configuration object literal containing 
* the configuration for a MenuModuleItem instance. See the configuration 
* class documentation for more details.
*/
YAHOO.widget.MenuModuleItem = function(p_oObject, p_oUserConfig) {

    if(p_oObject) {

        this.init(p_oObject, p_oUserConfig);

    }

};

YAHOO.widget.MenuModuleItem.prototype = {

    // Constants

    /**
    * Constant representing the path to the image to be used for the submenu
    * arrow indicator.
    * @final
    * @type String
    */
    SUBMENU_INDICATOR_IMAGE_PATH: "nt/ic/ut/alt1/menuarorght9_nrm_1.gif",


    /**
    * Constant representing the path to the image to be used for the submenu
    * arrow indicator when a MenuModuleItem instance has focus.
    * @final
    * @type String
    */
    SELECTED_SUBMENU_INDICATOR_IMAGE_PATH: 
        "nt/ic/ut/alt1/menuarorght9_hov_1.gif",


    /**
    * Constant representing the path to the image to be used for the submenu
    * arrow indicator when a MenuModuleItem instance is disabled.
    * @final
    * @type String
    */
    DISABLED_SUBMENU_INDICATOR_IMAGE_PATH: 
        "nt/ic/ut/alt1/menuarorght9_dim_1.gif",


    /**
    * Constant representing the alt text for the image to be used for the 
    * submenu arrow indicator.
    * @final
    * @type String
    */
    COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT: "Collapsed.  Click to expand.",


    /**
    * Constant representing the alt text for the image to be used for the 
    * submenu arrow indicator when the submenu is visible.
    * @final
    * @type String
    */
    EXPANDED_SUBMENU_INDICATOR_ALT_TEXT: "Expanded.  Click to collapse.",


    /**
    * Constant representing the alt text for the image to be used for the 
    * submenu arrow indicator when a MenuModuleItem instance is disabled.
    * @final
    * @type String
    */
    DISABLED_SUBMENU_INDICATOR_ALT_TEXT: "Disabled.",


    /**
    * Constant representing the CSS class(es) to be applied to the root 
    * HTMLLIElement of the MenuModuleItem.
    * @final
    * @type String
    */
    CSS_CLASS_NAME: "yuimenuitem",


    /**
    * Constant representing the type of menu to instantiate when creating 
    * submenu instances from parsing the child nodes (either HTMLSelectElement 
    * or HTMLDivElement) of the item's DOM.  The default 
    * is YAHOO.widget.MenuModule.
    * @final
    * @type YAHOO.widget.MenuModule
    */
    SUBMENU_TYPE: null,


    /**
    * Constant representing the type of item to instantiate when 
    * creating item instances from parsing the child nodes (either 
    * HTMLLIElement, HTMLOptGroupElement or HTMLOptionElement) of the 
    * submenu's DOM.  
    * The default is YAHOO.widget.MenuModuleItem.
    * @final
    * @type YAHOO.widget.MenuModuleItem
    */
    SUBMENU_ITEM_TYPE: null,


    /**
    * Constant representing the prefix path to use for non-secure images
    * @type string
    */
    IMG_ROOT: "http://us.i1.yimg.com/us.yimg.com/i/",
    

    /**
    * Constant representing the prefix path to use for securely served images
    * @type string
    */
    IMG_ROOT_SSL: "https://a248.e.akamai.net/sec.yimg.com/i/",


    // Private member variables
    
    /**
    * Reference to the HTMLAnchorElement of the MenuModuleItem's core internal
    * DOM structure.
    * @private
    * @type {HTMLAnchorElement}
    */
    _oAnchor: null,
    

    /**
    * Reference to the text node of the MenuModuleItem's core internal
    * DOM structure.
    * @private
    * @type {Text}
    */
    _oText: null,
    
    
    /**
    * Reference to the HTMLElement (&#60;EM&#60;) used to create the optional
    * help text for a MenuModuleItem instance.
    * @private
    * @type {HTMLElement}
    */
    _oHelpTextEM: null,
    
    
    /**
    * Reference to the submenu for a MenuModuleItem instance.
    * @private
    * @type {YAHOO.widget.MenuModule}
    */
    _oSubmenu: null,
    
    
    /**
    * Reference to the Dom utility singleton.
    * @private
    * @type {YAHOO.util.Dom}
    */
    _oDom: YAHOO.util.Dom,


    /**
    * Reference to the browser's user agent string.
    * @private
    * @type {String}
    */
    _sUserAgent: window.navigator.userAgent.toLowerCase(),


    // Public properties

	/**
	* The class's constructor function
	* @type YAHOO.widget.MenuModuleItem
	*/
	constructor: YAHOO.widget.MenuModuleItem,


	/**
	* The string representing the image root
	* @type string
	*/
	imageRoot: null,


	/**
	* Boolean representing whether or not the current browsing context 
	* is secure (https)
	* @type boolean
	*/
	isSecure: function() {

		if(window.location.href.toLowerCase().indexOf("https") === 0) {

			return true;

		} else {

			return false;

		}

	}(),


    /**
    * Returns the ordinal position of a MenuModuleItem instance in a group.
    * @type Number
    */
    index: null,


    /**
    * Returns the index of the group to which a MenuModuleItem instance belongs.
    * @type Number
    */
    groupIndex: null,


    /**
    * Returns the parent object for a MenuModuleItem instance.
    * @type {YAHOO.widget.MenuModule}
    */
    parent: null,


    /**
    * Returns the HTMLLIElement for a MenuModuleItem instance.
    * @type {HTMLLIElement}
    */
    element: null,


    /**
    * Returns the HTMLElement (either HTMLLIElement, HTMLOptGroupElement or
    * HTMLOptionElement) used create the MenuModuleItem instance.
    * @type {HTMLLIElement/HTMLOptGroupElement/HTMLOptionElement}
    */
    srcElement: null,


    /**
    * Specifies an arbitrary value for a MenuModuleItem instance.
    * @type {Object}
    */
    value: null,


    /**
    * Reference to the HTMLImageElement used to create the submenu
    * indicator for a MenuModuleItem instance.
    * @type {HTMLImageElement}
    */
    subMenuIndicator: null,


	/**
	* String representing the browser
	* @type string
	*/
	browser: function() {

        var sUserAgent = navigator.userAgent.toLowerCase();

        // Opera (check first in case of spoof)
    
        if(sUserAgent.indexOf("opera")!=-1) { 
        
            return "opera";
        
        // IE7

        } else if(sUserAgent.indexOf("msie 7")!=-1) {
        
            return "ie7";
        
        // IE

        } else if(sUserAgent.indexOf("msie") !=-1) {
        
            return "ie";
        
        // Safari (check before Gecko because it includes "like Gecko")

        } else if(sUserAgent.indexOf("safari")!=-1) {
        
            return "safari";
        
        // Gecko

        } else if(sUserAgent.indexOf("gecko") != -1) {
        
            return "gecko";
        
        } else {
        
            return false;
        
        }

    }(),


    // Events

    /**
    * Fires when a MenuModuleItem instances's HTMLLIElement is removed from
    * it's parent HTMLUListElement node.
    * @type {YAHOO.util.CustomEvent}
    * @see YAHOO.util.CustomEvent
    */
    destroyEvent: null,


    /**
    * Fires when the mouse has entered a MenuModuleItem instance.  Passes
    * back the DOM Event object as an argument.
    * @type {YAHOO.util.CustomEvent}
    * @see YAHOO.util.CustomEvent
    */
    mouseOverEvent: null,


    /**
    * Fires when the mouse has left a MenuModuleItem instance.  Passes back  
    * the DOM Event object as an argument.
    * @type {YAHOO.util.CustomEvent}
    * @see YAHOO.util.CustomEvent
    */
    mouseOutEvent: null,


    /**
    * Fires when the user mouses down on a MenuModuleItem instance.  Passes 
    * back the DOM Event object as an argument.
    * @type {YAHOO.util.CustomEvent}
    * @see YAHOO.util.CustomEvent
    */
    mouseDownEvent: null,


    /**
    * Fires when the user releases a mouse button while the mouse is 
    * over a MenuModuleItem instance.  Passes back the DOM Event object as
    * an argument.
    * @type {YAHOO.util.CustomEvent}
    * @see YAHOO.util.CustomEvent
    */
    mouseUpEvent: null,


    /**
    * Fires when the user clicks the on a MenuModuleItem instance.  Passes 
    * back the DOM Event object as an argument.
    * @type {YAHOO.util.CustomEvent}
    * @see YAHOO.util.CustomEvent
    */
    clickEvent: null,


    /**
    * Fires when the user presses an alphanumeric key.  Passes back the 
    * DOM Event object as an argument.
    * @type {YAHOO.util.CustomEvent}
    * @see YAHOO.util.CustomEvent
    */
    keyPressEvent: null,


    /**
    * Fires when the user presses a key.  Passes back the DOM Event 
    * object as an argument.
    * @type {YAHOO.util.CustomEvent}
    * @see YAHOO.util.CustomEvent
    */
    keyDownEvent: null,


    /**
    * Fires when the user releases a key.  Passes back the DOM Event 
    * object as an argument.
    * @type {YAHOO.util.CustomEvent}
    * @see YAHOO.util.CustomEvent
    */
    keyUpEvent: null,


    /**
    * Fires when a MenuModuleItem instance receives focus.
    * @type {YAHOO.util.CustomEvent}
    * @see YAHOO.util.CustomEvent
    */
    focusEvent: null,


    /**
    * Fires when a MenuModuleItem instance loses the input focus.
    * @type {YAHOO.util.CustomEvent}
    * @see YAHOO.util.CustomEvent
    */
    blurEvent: null,


    /**
    * The MenuModuleItem class's initialization method. This method is 
    * automatically called by the constructor, and sets up all DOM references 
    * for pre-existing markup, and creates required markup if it is not
    * already present.
    * @param {String or HTMLElement} p_oObject String or HTMLElement 
    * (either HTMLLIElement, HTMLOptGroupElement or HTMLOptionElement) of the 
    * source HTMLElement node.
    * @param {Object} p_oUserConfig The configuration object literal containing 
    * the configuration for a MenuModuleItem instance. See the configuration 
    * class documentation for more details.
    */
    init: function(p_oObject, p_oUserConfig) {

        this.imageRoot = (this.isSecure) ? this.IMG_ROOT_SSL : this.IMG_ROOT;


        if(!this.SUBMENU_TYPE) {
    
            this.SUBMENU_TYPE = YAHOO.widget.MenuModule;
    
        }

        if(!this.SUBMENU_ITEM_TYPE) {
    
            this.SUBMENU_ITEM_TYPE = YAHOO.widget.MenuModuleItem;
    
        }


        // Create the config object

        this.cfg = new YAHOO.util.Config(this);


        // Define the config properties


        this.cfg.addProperty(
            "text", 
            { 
                value:"", 
                handler: this.configText, 
                validator: this._checkString, 
                suppressEvent: true 
            }
        );
        
        this.cfg.addProperty("helptext", { handler: this.configHelpText });
        
        this.cfg.addProperty(
            "url", 
            { value: "#", handler: this.configURL, suppressEvent: true }
        );
        
        this.cfg.addProperty(
            "emphasis", 
            { 
                value: false, 
                handler: this.configEmphasis, 
                validator: this.cfg.checkBoolean, 
                suppressEvent: true 
            }
        );
        
        this.cfg.addProperty(
            "strongemphasis", 
            {
                value: false, 
                handler: this.configStrongEmphasis, 
                validator: this.cfg.checkBoolean, 
                suppressEvent: true 
            }
        );
        
        this.cfg.addProperty(
            "disabled", 
            {
                value: false, 
                handler: this.configDisabled, 
                validator: this.cfg.checkBoolean, 
                suppressEvent: true 
            }
        );
        
        this.cfg.addProperty(
            "selected", 
            {
                value: false, 
                handler: this.configSelected, 
                validator: this.cfg.checkBoolean, 
                suppressEvent: true 
            }
        );
        
        this.cfg.addProperty("submenu", { handler: this.configSubmenu });


        if(this._checkString(p_oObject)) {

            this._createRootNodeStructure();

            this.cfg.setProperty("text", p_oObject);

        }
        else if(this._checkDOMNode(p_oObject)) {

            switch(p_oObject.tagName) {

                case "OPTION":

                    this._createRootNodeStructure();

                    this.cfg.setProperty("text", p_oObject.text);

                    this.srcElement = p_oObject;

                break;

                case "OPTGROUP":

                    this._createRootNodeStructure();

                    this.cfg.setProperty("text", p_oObject.label);

                    this.srcElement = p_oObject;

                    this._initSubTree();

                break;

                case "LI":

                    // Get the anchor node (if it exists)

                    var oAnchor = this._getFirstElement(p_oObject, "A"),
                        sURL = "#",
                        sText = null;


                    // Capture the "text" and/or the "URL"

                    if(oAnchor) {

                        sURL = oAnchor.getAttribute("href");

                        if(oAnchor.innerText) {
                
                            sText = oAnchor.innerText;
                
                        }
                        else {
                
                            var oRange = oAnchor.ownerDocument.createRange();
                
                            oRange.selectNodeContents(oAnchor);
                
                            sText = oRange.toString();             
                
                        }

                    }
                    else {

                        var oText = p_oObject.firstChild;

                        sText = oText.nodeValue;

                        oAnchor = document.createElement("a");
                        
                        oAnchor.setAttribute("href", sURL);

                        p_oObject.replaceChild(oAnchor, oText);
                        
                        oAnchor.appendChild(oText);

                    }


                    this.srcElement = p_oObject;
                    this.element = p_oObject;
                    this._oAnchor = oAnchor;
    

                    // Check if emphasis has been applied to the MenuModuleItem

                    var oEmphasisNode = this._getFirstElement(oAnchor),
                        bEmphasis = false,
                        bStrongEmphasis = false;

                    if(oEmphasisNode) {

                        // Set a reference to the text node 

                        this._oText = oEmphasisNode.firstChild;

                        switch(oEmphasisNode.tagName) {

                            case "EM":

                                bEmphasis = true;

                            break;

                            case "STRONG":

                                bStrongEmphasis = true;

                            break;

                        }

                    }
                    else {

                        // Set a reference to the text node 

                        this._oText = oAnchor.firstChild;

                    }


                    /*
                        Set these properties silently to sync up the 
                        configuration object without making changes to the 
                        element's DOM
                    */ 

                    this.cfg.setProperty("text", sText, true);
                    this.cfg.setProperty("url", sURL, true);
                    this.cfg.setProperty("emphasis", bEmphasis, true);
                    this.cfg.setProperty(
                        "strongemphasis", 
                        bStrongEmphasis, 
                        true
                    );

                    this._initSubTree();

                break;

            }            

        }


        if(this.element) {


            this._oDom.addClass(this.element, this.CSS_CLASS_NAME);


            // Create custom events
    
            var CustomEvent = YAHOO.util.CustomEvent;
    
            this.destroyEvent = new CustomEvent("destroyEvent", this);
            this.mouseOverEvent = new CustomEvent("mouseOverEvent", this);
            this.mouseOutEvent = new CustomEvent("mouseOutEvent", this);
            this.mouseDownEvent = new CustomEvent("mouseDownEvent", this);
            this.mouseUpEvent = new CustomEvent("mouseUpEvent", this);
            this.clickEvent = new CustomEvent("clickEvent", this);
            this.keyPressEvent = new CustomEvent("keyPressEvent", this);
            this.keyDownEvent = new CustomEvent("keyDownEvent", this);
            this.keyUpEvent = new CustomEvent("keyUpEvent", this);
            this.focusEvent = new CustomEvent("focusEvent", this);
            this.blurEvent = new CustomEvent("blurEvent", this);


            if(p_oUserConfig) {
    
                this.cfg.applyConfig(p_oUserConfig);
    
            }        

            this.cfg.fireQueue();

        }

    },


    // Private methods

    /**
    * Returns an HTMLElement's first HTMLElement node
    * @private
    * @param {HTMLElement} p_oElement The element to be evaluated.
    * @param {String} p_sTagName Optional. The tagname of the element.
    * @return Returns an HTMLElement node.
    * @type Boolean
    */
    _getFirstElement: function(p_oElement, p_sTagName) {

        var oElement;

        if(p_oElement.firstChild && p_oElement.firstChild.nodeType == 1) {

            oElement = p_oElement.firstChild;

        }
        else if(
            p_oElement.firstChild && 
            p_oElement.firstChild.nextSibling && 
            p_oElement.firstChild.nextSibling.nodeType == 1
        ) {

            oElement = p_oElement.firstChild.nextSibling;

        }


        if(p_sTagName) {

            return (oElement && oElement.tagName == p_sTagName) ? 
                oElement : false;

        }

        return oElement;

    },


    /**
    * Determines if an object is a string
    * @private
    * @param {Object} p_oObject The object to be evaluated.
    * @return Returns true if the object is a string.
    * @type Boolean
    */
    _checkString: function(p_oObject) {

        return (typeof p_oObject == "string");

    },


    /**
    * Determines if an object is an HTMLElement.
    * @private
    * @param {Object} p_oObject The object to be evaluated.
    * @return Returns true if the object is an HTMLElement.
    * @type Boolean
    */
    _checkDOMNode: function(p_oObject) {

        return (p_oObject && p_oObject.tagName);

    },


    /**
    * Creates the core DOM structure for a MenuModuleItem instance.
    * @private
    */
    _createRootNodeStructure: function () {

        this.element = document.createElement("li");

        this._oText = document.createTextNode("");

        this._oAnchor = document.createElement("a");
        this._oAnchor.appendChild(this._oText);
        
        this.cfg.refireEvent("url");

        this.element.appendChild(this._oAnchor);            

    },


    /**
    * Iterates the source element's childNodes collection and uses the  
    * child nodes to instantiate other menus.
    * @private
    */
    _initSubTree: function() {

        var Menu = this.SUBMENU_TYPE,
            MenuModuleItem = this.SUBMENU_ITEM_TYPE;


        if(this.srcElement.childNodes.length > 0) {

            var oNode = this.srcElement.firstChild,
                aOptions = [];

            do {

                switch(oNode.tagName) {
        
                    case "DIV":
        
                        this.cfg.setProperty("submenu", (new Menu(oNode)));
        
                    break;
 
                    case "OPTION":

                        aOptions[aOptions.length] = oNode;

                    break;
       
                }
            
            }        
            while((oNode = oNode.nextSibling));


            var nOptions = aOptions.length;

            if(nOptions > 0) {
    
                this.cfg.setProperty(
                    "submenu", 
                    (new Menu(this._oDom.generateId()))
                );
    
                for(var n=0; n<nOptions; n++) {
    
                    this._oSubmenu.addItem((new MenuModuleItem(aOptions[n])));
    
                }
    
            }

        }

    },


    // Event handlers for configuration properties

    /**
    * Event handler for when the "text" configuration property of
    * a MenuModuleItem instance changes. 
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuModuleItem} p_oItem The MenuModuleItem instance 
    * that fired the event.
    */
    configText: function(p_sType, p_aArguments, p_oItem) {

        var sText = p_aArguments[0];


        if(this._oText) {

            this._oText.nodeValue = sText;

        }

    },


    /**
    * Event handler for when the "helptext" configuration property of
    * a MenuModuleItem instance changes. 
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuModuleItem} p_oItem The MenuModuleItem instance 
    * that fired the event.
    */    
    configHelpText: function(p_sType, p_aArguments, p_oItem) {

        var oHelpText = p_aArguments[0],
            aNodes = [this.element, this._oAnchor],
            me = this;


        /**
        * Adds the "hashelptext" class to the necessary nodes and refires the 
        * "selected" and "disabled" configuration events
        * @ignore
        */
        function initHelpText() {

            me._oDom.addClass(aNodes, "hashelptext");

            if(me.cfg.getProperty("disabled")) {

                me.cfg.refireEvent("disabled");

            }

            if(me.cfg.getProperty("selected")) {

                me.cfg.refireEvent("selected");

            }                

        }


        /**
        * Removes the "hashelptext" class and corresponding DOM element (EM)
        * @ignore
        */
        function removeHelpText() {

            me._oDom.removeClass(aNodes, "hashelptext");

            me.element.removeChild(me._oHelpTextEM);
            me._oHelpTextEM = null;

        }


        if(this._checkDOMNode(oHelpText)) {

            if(this._oHelpTextEM) {

                var oParentNode = this._oHelpTextEM.parentNode;
                oParentNode.replaceChild(oHelpText, this._oHelpTextEM);

            }
            else {

                this._oHelpTextEM = oHelpText;

                this.element.insertBefore(
                    this._oHelpTextEM, 
                    this.subMenuIndicator
                );

            }

            initHelpText();

        }
        else if(this._checkString(oHelpText)) {

            if(oHelpText.length === 0) {

                removeHelpText();

            }
            else {

                if(!this._oHelpTextEM) {

                    this._oHelpTextEM = document.createElement("em");

                    this.element.insertBefore(
                        this._oHelpTextEM, 
                        this.subMenuIndicator
                    );

                }

                this._oHelpTextEM.innerHTML = oHelpText;

                initHelpText();

            }

        }
        else if(!oHelpText && this._oHelpTextEM) {

            removeHelpText();

        }

    },


    /**
    * Event handler for when the "url" configuration property of
    * a MenuModuleItem instance changes.  
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuModuleItem} p_oItem The MenuModuleItem instance 
    * that fired the event.
    */    
    configURL: function(p_sType, p_aArguments, p_oItem) {

        var sURL = p_aArguments[0];

        if(!sURL) {

            sURL = "#";

        }

        this._oAnchor.setAttribute("href", sURL);

    },


    /**
    * Event handler for when the "emphasis" configuration property of
    * a MenuModuleItem instance changes.  
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuModuleItem} p_oItem The MenuModuleItem instance 
    * that fired the event.
    */    
    configEmphasis: function(p_sType, p_aArguments, p_oItem) {

        var bEmphasis = p_aArguments[0];


        if(bEmphasis && this.cfg.getProperty("strongemphasis")) {

            this.cfg.setProperty("strongemphasis", false);

        }


        if(this._oAnchor) {

            var oEM;

            if(bEmphasis) {

                oEM = document.createElement("em");
                oEM.appendChild(this._oText);

                this._oAnchor.appendChild(oEM);

            }
            else {

                oEM = this._getFirstElement(this._oAnchor, "EM");

                this._oAnchor.removeChild(oEM);
                this._oAnchor.appendChild(this._oText);

            }

        }

    },


    /**
    * Event handler for when the "strongemphasis" configuration property of
    * a MenuModuleItem instance changes. 
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuModuleItem} p_oItem The MenuModuleItem instance 
    * that fired the event.
    */    
    configStrongEmphasis: function(p_sType, p_aArguments, p_oItem) {

        var bStrongEmphasis = p_aArguments[0];


        if(bStrongEmphasis && this.cfg.getProperty("emphasis")) {

            this.cfg.setProperty("emphasis", false);

        }

        if(this._oAnchor) {

            var oStrong;

            if(bStrongEmphasis) {

                oStrong = document.createElement("strong");
                oStrong.appendChild(this._oText);

                this._oAnchor.appendChild(oStrong);

            }
            else {

                oStrong = this._getFirstElement(this._oAnchor, "STRONG");

                this._oAnchor.removeChild(oStrong);
                this._oAnchor.appendChild(this._oText);

            }

        }

    },


    /**
    * Event handler for when the "disabled" configuration property of
    * a MenuModuleItem instance changes. 
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuModuleItem} p_oItem The MenuModuleItem instance 
    * that fired the event.
    */    
    configDisabled: function(p_sType, p_aArguments, p_oItem) {

        var bDisabled = p_aArguments[0],
            aNodes = [this.element, this._oAnchor],
            sImageSrc,
            sImageAlt;

        if(this._oHelpTextEM) {

            aNodes[2] = this._oHelpTextEM;  

        }

        if(bDisabled) {

            if(this.cfg.getProperty("selected")) {

                this.cfg.setProperty("selected", false);

            }

            this._oAnchor.removeAttribute("href");

            this._oDom.addClass(aNodes, "disabled");

            sImageSrc = this.DISABLED_SUBMENU_INDICATOR_IMAGE_PATH;
            sImageAlt = this.DISABLED_SUBMENU_INDICATOR_ALT_TEXT;

        }
        else {

            this._oAnchor.setAttribute("href", this.cfg.getProperty("url"));

            this._oDom.removeClass(aNodes, "disabled");

            sImageSrc = this.SUBMENU_INDICATOR_IMAGE_PATH;
            sImageAlt = this.COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT;

        }


        if(this.subMenuIndicator) {

            this.subMenuIndicator.src = this.imageRoot + sImageSrc;
            this.subMenuIndicator.alt = sImageAlt;

        }

    },


    /**
    * Event handler for when the "selected" configuration property of
    * a MenuModuleItem instance changes. 
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuModuleItem} p_oItem The MenuModuleItem instance 
    * that fired the event.
    */    
    configSelected: function(p_sType, p_aArguments, p_oItem) {

        var bSelected = p_aArguments[0],
            aNodes = [this.element, this._oAnchor],
            sImageSrc;

        if(this._oHelpTextEM) {

            aNodes[2] = this._oHelpTextEM;  

        }

        if(bSelected) {

            this._oDom.addClass(aNodes, "selected");

            sImageSrc = this.SELECTED_SUBMENU_INDICATOR_IMAGE_PATH;

        }
        else {

            this._oDom.removeClass(aNodes, "selected");

            sImageSrc = this.SUBMENU_INDICATOR_IMAGE_PATH;

        }

        if(this.subMenuIndicator) {

            this.subMenuIndicator.src = this.imageRoot + sImageSrc;

        }

    },


    /**
    * Event handler for when the "submenu" configuration property of
    * a MenuModuleItem instance changes. 
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuModuleItem} p_oItem The MenuModuleItem instance 
    * that fired the event.
    */
    configSubmenu: function(p_sType, p_aArguments, p_oItem) {

        var oSubmenu = p_aArguments[0],
            aNodes = [this.element, this._oAnchor];

        if(oSubmenu) {

            // Set the submenu's parent to this MenuModuleItem instance

            oSubmenu.parent = this;

            this._oSubmenu = oSubmenu;


            if(!this.subMenuIndicator) { 

                this.subMenuIndicator = document.createElement("img");

                this.subMenuIndicator.src = 
                    (this.imageRoot + this.SUBMENU_INDICATOR_IMAGE_PATH);

                this.subMenuIndicator.alt = 
                    this.COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT;


                this.element.appendChild(this.subMenuIndicator);

                this._oDom.addClass(aNodes, "hassubmenu");


                if(this.cfg.getProperty("disabled")) {

                    this.cfg.refireEvent("disabled");

                }

                if(this.cfg.getProperty("selected")) {

                    this.cfg.refireEvent("selected");

                }                

            }

        }
        else {

            this._oDom.removeClass(aNodes, "hassubmenu");

            if(this.subMenuIndicator) {

                this.element.removeChild(this.subMenuIndicator);

            }

            if(this._oSubmenu) {

                this._oSubmenu.destroy();

            }

        }

    },


    // Public methods

    /**
    * Finds the next enabled MenuModuleItem instance in a MenuModule instance 
    * @return Returns a MenuModuleItem instance.
    * @type YAHOO.widget.MenuModuleItem
    */
    getNextEnabledSibling: function() {

        if(this.parent instanceof YAHOO.widget.MenuModule) {


            /**
            * Returns the next item in an array 
            * @param {p_aArray} An array
            * @param {p_nStartIndex} The index to start searching the array 
            * @ignore
            * @return Returns an item in an array
            * @type Object 
            */
            function getNextArrayItem(p_aArray, p_nStartIndex) {
    
                return p_aArray[p_nStartIndex] || 
                    getNextArrayItem(p_aArray, (p_nStartIndex+1));
    
            }
    
    
            var aItemGroups = this.parent.getItemGroups(),
                oNextItem;
    
    
            if(this.index < (aItemGroups[this.groupIndex].length - 1)) {
    
                oNextItem = getNextArrayItem(
                        aItemGroups[this.groupIndex], 
                        (this.index+1)
                    );
    
            }
            else {
    
                var nNextGroupIndex;
    
                if(this.groupIndex < (aItemGroups.length - 1)) {
    
                    nNextGroupIndex = this.groupIndex + 1;
    
                }
                else {
    
                    nNextGroupIndex = 0;
    
                }
    
                var aNextGroup = getNextArrayItem(aItemGroups, nNextGroupIndex);
    
                // Retrieve the first MenuModuleItem instance in the next group
    
                oNextItem = getNextArrayItem(aNextGroup, 0);
    
            }
    
            return oNextItem.cfg.getProperty("disabled") ? 
                        oNextItem.getNextEnabledSibling() : oNextItem;

        }

    },


    /**
    * Finds the previous enabled MenuModuleItem instance in a 
    * MenuModule instance 
    * @return Returns a MenuModuleItem instance.
    * @type YAHOO.widget.MenuModuleItem
    */
    getPreviousEnabledSibling: function() {

        if(this.parent instanceof YAHOO.widget.MenuModule) {

            /**
            * Returns the previous item in an array 
            * @param {p_aArray} An array
            * @param {p_nStartIndex} The index to start searching the array 
            * @ignore
            * @return Returns an item in an array
            * @type Object 
            */
            function getPreviousArrayItem(p_aArray, p_nStartIndex) {
    
                return p_aArray[p_nStartIndex] || 
                    getPreviousArrayItem(p_aArray, (p_nStartIndex-1));
    
            }


            /**
            * Get the index of the first item in an array 
            * @param {p_aArray} An array
            * @param {p_nStartIndex} The index to start searching the array 
            * @ignore
            * @return Returns an item in an array
            * @type Object 
            */    
            function getFirstItemIndex(p_aArray, p_nStartIndex) {
    
                return p_aArray[p_nStartIndex] ? 
                    p_nStartIndex : 
                    getFirstItemIndex(p_aArray, (p_nStartIndex+1));
    
            }
    
            var aItemGroups = this.parent.getItemGroups(),
                oPreviousItem;
    
            if(
                this.index > getFirstItemIndex(aItemGroups[this.groupIndex], 0)
            ) {
    
                oPreviousItem = 
                    getPreviousArrayItem(
                        aItemGroups[this.groupIndex], 
                        (this.index-1)
                    );
    
            }
            else {
    
                var nPreviousGroupIndex;
    
                if(this.groupIndex > getFirstItemIndex(aItemGroups, 0)) {
    
                    nPreviousGroupIndex = this.groupIndex - 1;
    
                }
                else {
    
                    nPreviousGroupIndex = aItemGroups.length - 1;
    
                }
    
                var aPreviousGroup = 
                        getPreviousArrayItem(aItemGroups, nPreviousGroupIndex);
    
                oPreviousItem = 
                    getPreviousArrayItem(
                        aPreviousGroup, 
                        (aPreviousGroup.length - 1)
                    );
    
            }
    
            return oPreviousItem.cfg.getProperty("disabled") ? 
                    oPreviousItem.getPreviousEnabledSibling() : oPreviousItem;

        }

    },


    /**
    * Causes a MenuModuleItem instance to receive the focus and fires the
    * focus event.
    */
    focus: function() {

        if(
            !this.cfg.getProperty("disabled") && 
            this.parent && 
            this.parent.cfg.getProperty("visible")
        ) {

            var oActiveItem = this.parent.activeItem;

            if(oActiveItem) {

                oActiveItem.blur();

            }

            this._oAnchor.focus();

            /*
                Opera 8.5 doesn't always focus the anchor if a MenuModuleItem
                instance has a submenu, this is fixed by calling "focus"
                twice.
            */
            if(
                this.parent && 
                this.parent.browser == "opera" && 
                this._oSubmenu
            ) {

                this._oAnchor.focus();

            }

            this.focusEvent.fire();

        }

    },


    /**
    * Causes a MenuModuleItem instance to lose focus and fires the onblur event.
    */    
    blur: function() {

        if(
            !this.cfg.getProperty("disabled") && 
            this.parent && 
            this.parent.cfg.getProperty("visible")
        ) {

            this._oAnchor.blur();

            this.blurEvent.fire();

        }

    },


	/**
	* Removes a MenuModuleItem instance's HTMLLIElement from it's parent
    * HTMLUListElement node.
	*/
    destroy: function() {

        if(this.element) {

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

            var oParentNode = this.element.parentNode;

            if(oParentNode) {

                oParentNode.removeChild(this.element);

                this.destroyEvent.fire();

            }

            this.destroyEvent.unsubscribeAll();

        }

    }

};