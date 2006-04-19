/*
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
* @class The MenuItem class allows you to create and modify an item for an Menu.
* @constructor
* @param {String/HTMLElement} p_oObject String or HTMLElement 
* (either HTMLLIElement, HTMLOptGroupElement or HTMLOptionElement) of the 
* source HTMLElement node.
* @param {Object} p_oUserConfig The configuration object literal containing 
* the configuration that should be set for this MenuItem. See configuration 
* documentation for more details.
*/
YAHOO.widget.MenuItem = function(p_oObject, p_oUserConfig) {

    if(p_oObject) {

        this.init(p_oObject, p_oUserConfig);

    }

};

YAHOO.widget.MenuItem.prototype = {

    // Constants

    /**
    * Constant representing the path to the image to be used for the submenu
    * arrow indicator.
    * @final
    * @type String
    */
    SUBMENU_INDICATOR_IMAGE_URL: 
        "http://us.i1.yimg.com/us.yimg.com/i/nt/ic/ut/alt1/menuarorght9_nrm_1.gif",


    /**
    * Constant representing the path to the image to be used for the submenu
    * arrow indicator when a MenuItem instance has focus.
    * @final
    * @type String
    */
    SELECTED_SUBMENU_INDICATOR_IMAGE_URL: 
        "http://us.i1.yimg.com/us.yimg.com/i/nt/ic/ut/alt1/menuarorght9_hov_1.gif",


    /**
    * Constant representing the path to the image to be used for the submenu
    * arrow indicator when a MenuItem instance is disabled.
    * @final
    * @type String
    */
    DISABLED_SUBMENU_INDICATOR_IMAGE_URL: 
        "http://us.i1.yimg.com/us.yimg.com/i/nt/ic/ut/alt1/menuarorght9_dim_1.gif",


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
    * submenu arrow indicator when a MenuItem instance is disabled.
    * @final
    * @type String
    */
    DISABLED_SUBMENU_INDICATOR_ALT_TEXT: "Disabled.",


    /**
    * Constant representing the CSS class(es) to be applied to the root 
    * HTMLLIElement of the MenuItem.
    * @final
    * @type String
    */
    CSS_CLASS_NAME: "yuimenuitem",


    /**
    * Constant representing the type of Menu to instantiate when creating 
    * Menu instances from parsing the child nodes (either HTMLSelectElement or 
    * HTMLDivElement) of the MenuItem's DOM.  The default is YAHOO.widget.Menu.
    * @final
    * @type YAHOO.widget.Menu
    */
    SUBMENU_TYPE: null,


    /**
    * Constant representing how a submenu instance should be aligned it's 
    * parent MenuItem instance.
    * @final
    * @type Array
    */
    SUBMENU_ALIGNMENT: ["tl","tr"],


    /**
    * Constant representing the type of MenuItem to instantiate when creating 
    * MenuItem instances from parsing the child nodes (either HTMLLIElement, 
    * HTMLOptGroupElement or HTMLOptionElement) of the MenuItem's DOM.  The 
    * default is YAHOO.widget.MenuItem.
    * @final
    * @type YAHOO.widget.MenuItem
    */
    MENUITEM_TYPE: null,


    // Private member variables
    
    /**
    * Reference to the HTMLAnchorElement of the MenuItem's core internal
    * DOM structure.
    * @private
    * @type {HTMLAnchorElement}
    */
    _oAnchor: null,
    

    /**
    * Reference to the text node of the MenuItem's core internal
    * DOM structure.
    * @private
    * @type {Text}
    */
    _oText: null,
    
    
    /**
    * Reference to the HTMLElement (<EM>) used to create the optional
    * help text for a MenuItem instance.
    * @private
    * @type {HTMLElement}
    */
    _oHelpTextEM: null,
    
    
    /**
    * Reference to the submenu for a MenuItem instance.
    * @private
    * @type {YAHOO.widget.Menu}
    */
    _oSubmenu: null,
    
    
    /**
    * Reference to the Dom utility singleton.
    * @private
    * @type {YAHOO.util.Dom}
    */
    _oDom: YAHOO.util.Dom,


    // Public properties

	/**
	* The class's constructor function
	* @type YAHOO.widget.MenuItem
	*/
	constructor : YAHOO.widget.MenuItem,


    /**
    * Returns the ordinal position of a MenuItem instance in a group.
    * @type Number
    */
    index: null,


    /**
    * Returns the index of the group to which a MenuItem instance belongs.
    * @type Number
    */
    groupIndex: null,


    /**
    * Returns the parent Menu instance for a MenuItem instance.
    * @type {YAHOO.widget.Menu}
    */
    parent: null,


    /**
    * Returns the HTMLLIElement for a MenuItem instance.
    * @type {HTMLLIElement}
    */
    element: null,


    /**
    * Returns the HTMLElement (either HTMLLIElement, HTMLOptGroupElement or
    * HTMLOptionElement) used create the MenuItem instance.
    * @type {HTMLLIElement/HTMLOptGroupElement/HTMLOptionElement}
    */
    srcElement: null,


    /**
    * Specifies an arbitrary value for a MenuItem instance.
    * @type {Object}
    */
    value: null,


    /**
    * Reference to the HTMLImageElement used to create the submenu
    * indicator for a MenuItem instance.
    * @private
    * @type {HTMLImageElement}
    */
    subMenuIndicator: null,


    // Events

    /**
    * Fires when a MenuItem instances's HTMLLIElement is removed from
    * it's parent HTMLUListElement node.
    * @type {YAHOO.util.CustomEvent}
    * @see YAHOO.util.CustomEvent
    */
    destroyEvent: null,


    /**
    * Fires when the mouse has entered a MenuItem instance.  Passes
    * back the DOM Event object as an argument.
    * @type {YAHOO.util.CustomEvent}
    * @see YAHOO.util.CustomEvent
    */
    mouseOverEvent: null,


    /**
    * Fires when the mouse has left a MenuItem instance.  Passes back  
    * the DOM Event object as an argument.
    * @type {YAHOO.util.CustomEvent}
    * @see YAHOO.util.CustomEvent
    */
    mouseOutEvent: null,


    /**
    * Fires when the user mouses down on a MenuItem instance.  Passes 
    * back the DOM Event object as an argument.
    * @type {YAHOO.util.CustomEvent}
    * @see YAHOO.util.CustomEvent
    */
    mouseDownEvent: null,


    /**
    * Fires when the user releases a mouse button while the mouse is 
    * over a MenuItem instance.  Passes back the DOM Event object as
    * an argument.
    * @type {YAHOO.util.CustomEvent}
    * @see YAHOO.util.CustomEvent
    */
    mouseUpEvent: null,


    /**
    * Fires when the user clicks the on a MenuItem instance.  Passes 
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
    * Fires when a MenuItem instance receives focus.  Passes back the 
    * DOM Event object as an argument.
    * @type {YAHOO.util.CustomEvent}
    * @see YAHOO.util.CustomEvent
    */
    focusEvent: null,


    /**
    * Fires when a MenuItem instance loses the input focus.  Passes 
    * back the DOM Event object as an argument.
    * @type {YAHOO.util.CustomEvent}
    * @see YAHOO.util.CustomEvent
    */
    blurEvent: null,


    /**
    * The MenuItem class's initialization method. This method is automatically
    * called by the constructor, and sets up all DOM references for
    * pre-existing markup, and creates required markup if it is not
    * already present.
    * @param {String/HTMLElement} p_oObject String or HTMLElement 
    * (either HTMLLIElement, HTMLOptGroupElement or HTMLOptionElement) of the 
    * source HTMLElement node.
    * @param {Object} p_oUserConfig The configuration object literal containing 
    * the configuration that should be set for this MenuItem. See configuration 
    * documentation for more details.
    */
    init: function(p_oObject, p_oUserConfig) {


        if(!this.SUBMENU_TYPE) {
    
            this.SUBMENU_TYPE = YAHOO.widget.Menu;
    
        }

        if(!this.MENUITEM_TYPE) {
    
            this.MENUITEM_TYPE = YAHOO.widget.MenuItem;
    
        }


        // Create the config object

        this.cfg = new YAHOO.util.Config(this);


        // Define the config properties


        this.cfg.addProperty("text", { value:"", handler: this.configText, validator: this._checkString, suppressEvent: true });
        
        this.cfg.addProperty("helptext", { handler: this.configHelpText });
        
        this.cfg.addProperty("url", { value: "#", handler: this.configURL, suppressEvent: true });
        
        this.cfg.addProperty("emphasis", { value: false, handler: this.configEmphasis, validator: this.cfg.checkBoolean, suppressEvent: true });
        
        this.cfg.addProperty("strongemphasis", { value: false, handler: this.configStrongEmphasis, validator: this.cfg.checkBoolean, suppressEvent: true });
        
        this.cfg.addProperty("disabled", { value: false, handler: this.configDisabled, validator: this.cfg.checkBoolean, suppressEvent: true });
        
        this.cfg.addProperty("selected", { value: false, handler: this.configSelected, validator: this.cfg.checkBoolean, suppressEvent: true });
        
        this.cfg.addProperty("submenu", { handler: this.configSubmenu });
        
        this.cfg.addProperty("initsubmenus", { value: ((p_oUserConfig && (!p_oUserConfig.initsubmenus)) ? false : true) });



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

                    if(this.cfg.getProperty("initsubmenus")) {

                        this._initSubTree();

                    }

                break;

                case "LI":

                    // Get the anchor node (if it exists)

                    var oAnchor = this._getFirstElement(p_oObject, "A"),
                        sURL = null,
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

                        sText = p_oObject.firstChild.nodeValue;

                    }


                    this.srcElement = p_oObject;
                    this.element = p_oObject;
                    this._oAnchor = oAnchor;
    

                    // Check if emphasis has been applied to the MenuItem

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
                   
                    if(this.cfg.getProperty("initsubmenus")) {

                        this._initSubTree();

                    }

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
    * Returns an element's first element node
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

            return (oElement && oElement.tagName == p_sTagName) ? oElement : false;

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
    * Creates the core DOM structure for a MenuItem instance.
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
    * child nodes to instantiate Menu and MenuItem instances.
    * @private
    */
    _initSubTree: function() {

        var Menu = this.SUBMENU_TYPE,
            MenuItem = this.MENUITEM_TYPE;


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
    
                    this._oSubmenu.addMenuItem((new MenuItem(aOptions[n])));
    
                }
    
            }

        }

    },



    // Event handlers for configuration properties


    /**
    * Event handler for when the "text" configuration property of
    * a MenuItem instance changes. 
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuItem} p_oMenuItem The MenuItem instance fired
    * the event.
    */
    configText: function(p_sType, p_aArguments, p_oMenuItem) {

        var sText = p_aArguments[0];


        if(this._oText) {

            this._oText.nodeValue = sText;

        }

    },


    /**
    * Event handler for when the "helptext" configuration property of
    * a MenuItem instance changes. 
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuItem} p_oMenuItem The MenuItem instance fired
    * the event.
    */    
    configHelpText: function(p_sType, p_aArguments, p_oMenuItem) {

        var oHelpText = p_aArguments[0],
            aNodes = [this.element, this._oAnchor],
            me = this;

        function initHelpText() {

            me._oDom.addClass(aNodes, "hashelptext");

            if(me.cfg.getProperty("disabled")) {

                me.cfg.refireEvent("disabled");

            }

            if(me.cfg.getProperty("selected")) {

                me.cfg.refireEvent("selected");

            }                

        }

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
    * a MenuItem instance changes.  
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuItem} p_oMenuItem The MenuItem instance fired
    * the event.
    */    
    configURL: function(p_sType, p_aArguments, p_oMenuItem) {

        var sURL = p_aArguments[0];

        if(!sURL) {

            sURL = "#";

        }

        this._oAnchor.setAttribute("href", sURL);

    },


    /**
    * Event handler for when the "emphasis" configuration property of
    * a MenuItem instance changes.  
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuItem} p_oMenuItem The MenuItem instance fired
    * the event.
    */    
    configEmphasis: function(p_sType, p_aArguments, p_oMenuItem) {

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
    * a MenuItem instance changes. 
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuItem} p_oMenuItem The MenuItem instance fired
    * the event.
    */    
    configStrongEmphasis: function(p_sType, p_aArguments, p_oMenuItem) {

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
    * a MenuItem instance changes. 
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuItem} p_oMenuItem The MenuItem instance fired
    * the event.
    */    
    configDisabled: function(p_sType, p_aArguments, p_oMenuItem) {

        var bDisabled = p_aArguments[0],
            aNodes = [this.element, this._oAnchor],
            sImageId,
            sImageAlt;

        if(this._oHelpTextEM) {

            aNodes[2] = this._oHelpTextEM;  

        }

        if(bDisabled) {

            if(this.cfg.getProperty("selected")) {

                this.cfg.setProperty("selected", false);

            }

            this._oAnchor.removeAttribute("href");
            this._oAnchor.removeAttribute("tabIndex");

            this._oDom.addClass(aNodes, "disabled");

            sImageId = "yuidisabledsubmenuindicator";
            sImageAlt = this.DISABLED_SUBMENU_INDICATOR_ALT_TEXT;

        }
        else {

            this._oAnchor.setAttribute("href", this.cfg.getProperty("url"));
            this._oAnchor.setAttribute("tabIndex", 0);

            this._oDom.removeClass(aNodes, "disabled");

            sImageId = "yuisubmenuindicator";
            sImageAlt = this.COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT;

        }


        if(this.subMenuIndicator) {

            this.subMenuIndicator.src = document.getElementById(sImageId).src;
            this.subMenuIndicator.alt = sImageAlt;

        }

    },


    /**
    * Event handler for when the "selected" configuration property of
    * a MenuItem instance changes. 
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuItem} p_oMenuItem The MenuItem instance fired
    * the event.
    */    
    configSelected: function(p_sType, p_aArguments, p_oMenuItem) {

        var bSelected = p_aArguments[0],
            aNodes = [this.element, this._oAnchor],
            sImageId;

        if(this._oHelpTextEM) {

            aNodes[2] = this._oHelpTextEM;  

        }

        if(bSelected) {

            this._oDom.addClass(aNodes, "selected");

            sImageId = "yuiselectedsubmenuindicator";

        }
        else {

            this._oDom.removeClass(aNodes, "selected");

            sImageId = "yuisubmenuindicator";

        }

        if(this.subMenuIndicator) {

            this.subMenuIndicator.src = document.getElementById(sImageId).src;

        }

    },


    /**
    * Event handler for when the "submenu" configuration property of
    * a MenuItem instance changes. 
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuItem} p_oMenuItem The MenuItem instance fired
    * the event.
    */
    configSubmenu: function(p_sType, p_aArguments, p_oMenuItem) {

        var oSubmenu = p_aArguments[0],
            aNodes = [this.element, this._oAnchor];

        if(oSubmenu) {

            // Set the submenu's parent to this MenuItem instance

            oSubmenu.parent = this;

            this._oSubmenu = oSubmenu;


            if(!this.subMenuIndicator) { 

                var oSubMenuIndicator = 
                        document.getElementById("yuisubmenuindicator");

                if(!oSubMenuIndicator) {

                    oSubMenuIndicator = document.createElement("img");

                    oSubMenuIndicator.src = 
                        this.SUBMENU_INDICATOR_IMAGE_URL;
        
                    oSubMenuIndicator.alt = 
                        this.COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT;

                    oSubMenuIndicator.id = "yuisubmenuindicator";


                    var oSelectedSubMenuIndicator = 
                            document.createElement("img");

                        oSelectedSubMenuIndicator.src = 
                            this.SELECTED_SUBMENU_INDICATOR_IMAGE_URL;

                        oSelectedSubMenuIndicator.id = 
                            "yuiselectedsubmenuindicator";
                    

                    var oDisabledSubMenuIndicator = 
                            document.createElement("img");

                        oDisabledSubMenuIndicator.src = 
                            this.DISABLED_SUBMENU_INDICATOR_IMAGE_URL;

                        oDisabledSubMenuIndicator.id = 
                            "yuidisabledsubmenuindicator";

                    var oDIV = document.createElement("div");

                    oDIV.style.position = "absolute";
                    oDIV.style.left = "-1000px";

                    oDIV.appendChild(oSubMenuIndicator);
                    oDIV.appendChild(oSelectedSubMenuIndicator);
                    oDIV.appendChild(oDisabledSubMenuIndicator);

                    document.body.appendChild(oDIV);

                }              


                var oClone = oSubMenuIndicator.cloneNode(false);
                oClone.removeAttribute("id");

                this.subMenuIndicator = oClone;
                    
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
    * Finds the next enabled MenuItem instance in a Menu instance 
    * @return Returns a MenuItem instance.
    * @type YAHOO.widget.MenuItem
    */
    getNextEnabledSibling: function() {

        if(this.parent instanceof YAHOO.widget.Menu) {

            function getNextArrayItem(p_aArray, p_nStartIndex) {
    
                return p_aArray[p_nStartIndex] || 
                    getNextArrayItem(p_aArray, (p_nStartIndex+1));
    
            }
    
    
            var aMenuItemGroups = this.parent.getMenuItemGroups(),
                oNextMenuItem;
    
    
            if(this.index < (aMenuItemGroups[this.groupIndex].length - 1)) {
    
                oNextMenuItem = 
                    getNextArrayItem(
                        aMenuItemGroups[this.groupIndex], 
                        (this.index+1)
                    );
    
            }
            else {
    
                var nNextGroupIndex;
    
                if(this.groupIndex < (aMenuItemGroups.length - 1)) {
    
                    nNextGroupIndex = this.groupIndex + 1;
    
                }
                else {
    
                    nNextGroupIndex = 0;
    
                }
    
                var aNextGroup = getNextArrayItem(aMenuItemGroups, nNextGroupIndex);
    
                // Retrieve the first MenuItem instance in the next group
    
                oNextMenuItem = getNextArrayItem(aNextGroup, 0);
    
            }
    
            return oNextMenuItem.cfg.getProperty("disabled") ? 
                        oNextMenuItem.getNextEnabledSibling() : oNextMenuItem;

        }

    },


    /**
    * Finds the previous enabled MenuItem instance in a Menu instance 
    * @return Returns a MenuItem instance.
    * @type YAHOO.widget.MenuItem
    */
    getPreviousEnabledSibling: function() {

        if(this.parent instanceof YAHOO.widget.Menu) {

            function getPreviousArrayItem(p_aArray, p_nStartIndex) {
    
                return p_aArray[p_nStartIndex] || 
                    getPreviousArrayItem(p_aArray, (p_nStartIndex-1));
    
            }
    
            function getFirstItemIndex(p_aArray, p_nStartIndex) {
    
                return p_aArray[p_nStartIndex] ? 
                    p_nStartIndex : getFirstItemIndex(p_aArray, (p_nStartIndex+1));
    
            }
    
            var aMenuItemGroups = this.parent.getMenuItemGroups(),
                oPreviousMenuItem;
    
            if(this.index > getFirstItemIndex(aMenuItemGroups[this.groupIndex], 0)) {
    
                oPreviousMenuItem = getPreviousArrayItem(aMenuItemGroups[this.groupIndex], (this.index-1));
    
            }
            else {
    
                var nPreviousGroupIndex;
    
                if(this.groupIndex > getFirstItemIndex(aMenuItemGroups, 0)) {
    
                    nPreviousGroupIndex = this.groupIndex - 1;
    
                }
                else {
    
                    nPreviousGroupIndex = aMenuItemGroups.length - 1;
    
                }
    
                var aPreviousGroup = getPreviousArrayItem(aMenuItemGroups, nPreviousGroupIndex);
    
                oPreviousMenuItem = getPreviousArrayItem(aPreviousGroup, (aPreviousGroup.length - 1));
    
            }
    
            return oPreviousMenuItem.cfg.getProperty("disabled") ? oPreviousMenuItem.getPreviousEnabledSibling() : oPreviousMenuItem;

        }

    },


    /**
    * Causes a MenuItem instance to receive the focus and fires the
    * focus event.
    */
    focus: function() {

        if(
            !this.cfg.getProperty("disabled") && 
            this.parent && 
            this.parent.cfg.getProperty("visible")
        ) {

            var oActiveMenuItem = this.parent.activeMenuItem;

            if(oActiveMenuItem) {

                oActiveMenuItem.blur();

            }

            this._oAnchor.focus();

            /*
                Opera 8.5 doesn't always focus the anchor if a MenuItem
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
    * Causes a MenuItem instance to lose focus and fires the onblur event.
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
	* Removes a MenuItem instance's HTMLLIElement from it's parent
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