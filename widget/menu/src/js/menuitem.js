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
    * submenu instances.
    * @final
    * @type YAHOO.widget.Menu
    */
    SUBMENU_TYPE: null,
    
    
    /**
    * Constant representing the type of Menu to instantiate when creating 
    * MenuItem instances.
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
    * Reference to the Text node of the MenuItem's core internal
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
    
    
    /**
    * Reference to the Event utility singleton.
    * @private
    * @type {YAHOO.util.Event}
    */
    _oEventUtil: YAHOO.util.Event,




    // Public properties

    /**
    * Returns the ordinal position of a MenuItem instance relative to other 
    * MenuItems inside it's parent Menu instance.
    * @type Number
    */
    index: null,


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
    * @type {HTMLAnchorElement}
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
    * Fires when the user clicks the on a MenuItem instance.  Passes 
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

        this.cfg.addProperty("text", null, this.configText, this._checkString);

        this.cfg.addProperty("helptext", null, this.configHelpText);
            
        this.cfg.addProperty("url", "#", this.configURL);

        this.cfg.addProperty(
            "emphasis", 
            false, 
            this.configEmphasis, 
            this.cfg.checkBoolean
        );

        this.cfg.addProperty(
            "strongemphasis", 
            false, 
            this.configStrongEmphasis, 
            this.cfg.checkBoolean
        );

        this.cfg.addProperty(
            "disabled", 
            false, 
            this.configDisabled, 
            this.cfg.checkBoolean
        );
    
        this.cfg.addProperty(
            "selected", 
            false, 
            this.configSelected, 
            this.cfg.checkBoolean
        );

        this.cfg.addProperty("submenu", null, this.configSubmenu);

        this.cfg.addProperty(
            "initsubmenus", 
            ((p_oUserConfig && (!p_oUserConfig.initsubmenus)) ? false : true)
        );


        if(this._checkString(p_oObject)) {

            this._createRootNodeStructure();

            this.cfg.setProperty("text", p_oObject);

        }
        else if(this._checkDOMNode(p_oObject)) {

            switch(p_oObject.tagName) {

                case "OPTION":

                    this._createRootNodeStructure();

                    this.cfg.setProperty("text", p_oObject.text);
                    this.cfg.setProperty("value", p_oObject.value);

                    this.srcElement = p_oObject;

                    if(p_oObject.disabled || p_oObject.parentNode.disabled) {

                        this.cfg.setProperty("disabled", true);

                    }

                    if(p_oObject.selected) {

                        this.cfg.setProperty("selected", true);

                    }

                break;

                case "OPTGROUP":

                    this._createRootNodeStructure();

                    this.cfg.setProperty("text", p_oObject.label);

                    this.srcElement = p_oObject;

                    if(p_oObject.disabled || p_oObject.parentNode.disabled) {

                        this.cfg.setProperty("disabled", true);

                    }

                    if(this.cfg.getProperty("initsubmenus")) {

                        this._initSubTree();

                    }

                break;

                case "LI":

                    // Get the anchor node (if it exists)

                    var oAnchor = null,
                        sURL = null,
                        sText = null;

                    if(
                        p_oObject.firstChild && 
                        p_oObject.firstChild.nodeType == 1 && 
                        p_oObject.firstChild.tagName == "A"
                    ) {

                        oAnchor = p_oObject.firstChild;

                    }
                    else if(
                        p_oObject.childNodes[1] && 
                        p_oObject.childNodes[1].nodeType == 1 &&
                        p_oObject.childNodes[1].tagName == "A"
                    ) {

                        oAnchor = p_oObject.childNodes[1];

                    }


                    // Capture the "text" and/or the "URL"

                    if(oAnchor) {

                        sURL = oAnchor.getAttribute("href");                        

                        if(oAnchor.innerText) {
                
                            sText = oAnchor.innerText;
                
                        }
                        else {
                
                            var oRange = 
                                oAnchor.ownerDocument.createRange();
                
                            oRange.selectNodeContents(oAnchor);
                
                            sText = oRange.toString();             
                
                        }

                    }
                    else {

                        sText = p_oObject.firstChild.nodeValue;

                    }


                    this.srcElement = p_oObject;


                    // Check for the "bring your own HTML" scenario

                    if(
                        oAnchor && 
                        p_oObject.parentNode && // UL check

                        // body node check
                        p_oObject.parentNode.parentNode && 
                        p_oObject.parentNode.parentNode.tagName == "DIV" && 
                        this._oDom.hasClass(
                            p_oObject.parentNode.parentNode, 
                            "bd"
                        ) &&

                        // Root node check
                        p_oObject.parentNode.parentNode.parentNode && 
                        p_oObject.parentNode.parentNode.parentNode.tagName == "DIV" && 
                        this._oDom.hasClass(
                            p_oObject.parentNode.parentNode.parentNode, 
                            "yuimenu"
                        )
                    ) {

                        this.element = p_oObject;
                        this._oAnchor = oAnchor;


                        // Check to see if the MenuItem is disabled

                        var bDisabled = 
                            this._oDom.hasClass(this.element, "disabled");


                        /*
                            Check to see if the MenuItem should be selected 
                            by default
                        */ 

                        var bSelected = 
                            this._oDom.hasClass(this.element, "selected");
    

                        // Check if emphasis has been applied to the MenuItem

                        var oEmphasisNode; // Either EM or STRONG

                        if(
                            oAnchor.firstChild && 
                            oAnchor.firstChild.nodeType == 1
                        ) {
    
                            oEmphasisNode = oAnchor.firstChild;
    
                        }
                        else if(
                            oAnchor.childNodes[1] && 
                            oAnchor.childNodes[1].nodeType == 1
                        ) {

                            oEmphasisNode = oAnchor.childNodes[1];

                        }


                        // Determine if the MenuItem has emphasis

                        var bEmphasis = false,
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


                        // Check for the "help text" node (EM)

                        var oHelpText = null;

                        if(
                            oAnchor.nextSibling &&
                            oAnchor.nextSibling.nodeType == 1 &&
                            oAnchor.nextSibling.tagName == "EM"
                        ) {

                            oHelpText = oAnchor.nextSibling;

                        }
                        else if(
                            oAnchor.nextSibling &&
                            oAnchor.nextSibling.nextSibling &&
                            oAnchor.nextSibling.nextSibling.nodeType == 1 &&
                            oAnchor.nextSibling.nextSibling.tagName == "EM"
                        ) {

                            oHelpText =  oAnchor.nextSibling.nextSibling;

                        }


                        if(oHelpText) {

                            this._oHelpTextEM = oHelpText;

                            /*
                                Propagate the "hashelptext" class to the LI and 
                                anchor if it isn't already applied
                            */
                            
                            this._oDom.addClass(this.element, "hashelptext");
                            this._oDom.addClass(oAnchor, "hashelptext");


                        }
                        else {

                            /* 
                                Remove the "hashelptext" class if it exists but
                                there is no help text present
                            */

                            this._oDom.removeClass(this.element, "hashelptext");
                            this._oDom.removeClass(oAnchor, "hashelptext");

                        }


                        /*
                            Set these properties silently to sync up the 
                            configuration object without making changes to the 
                            element's DOM
                        */ 

                        this.cfg.setProperty("text", sText, true);
                        this.cfg.setProperty("helptext", oHelpText, true);
                        this.cfg.setProperty("url", sURL, true);
                        this.cfg.setProperty("emphasis", bEmphasis, true);
                        this.cfg.setProperty(
                            "strongemphasis", 
                            bStrongEmphasis, 
                            true
                        );


                        /*
                            The "selected" and "disabled" properties are not set
                            silently to ensure that the associated class names
                            are applied correctly to the DOM elements
                        */ 

                        this.cfg.setProperty("selected", bSelected);
                        this.cfg.setProperty("disabled", bDisabled);
                    
                    }
                    else {

                        this._createRootNodeStructure();

                        this.cfg.setProperty("text", sText);
                        this.cfg.setProperty("url", sURL);

                    }

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

        }

    },


    // Private methods

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

        var oMenuManager = YAHOO.widget.MenuManager,
            Menu = this.SUBMENU_TYPE,
            MenuItem = this.MENUITEM_TYPE;


        if(this.srcElement.childNodes.length > 0) {

            var oNode = this.srcElement.firstChild,
                aULs = [],
                aOptions = [];

            do {

                switch(oNode.tagName) {
        
                    case "DIV":
        
                        this.cfg.setProperty("submenu", (new Menu(oNode)));
        
                    break;
 
                    case "OPTION":

                        aOptions[aOptions.length] = oNode;

                    break;
       
                    case "UL":
                        
                        aULs[aULs.length] = oNode;
        
                    break;
        
                }
            
            }        
            while((oNode = oNode.nextSibling));


            var nOptions = aOptions.length;

            if(nOptions > 0) {
    
                this.cfg.setProperty(
                    "submenu", 
                    (new Menu(oMenuManager.createMenuId()))
                );
    
                for(var n=0; n<nOptions; n++) {
    
                    this._oSubmenu.addMenuItem((new MenuItem(aOptions[n])));
    
                }
    
            }


            var nULs = aULs.length;

            if(nULs > 0) {
    
                switch(nULs) {

                    case 1:

                        this.cfg.setProperty("submenu", (new Menu(aULs[0])));

                    break;

                    default:

                        var oMenu = new Menu(oMenuManager.createMenuId());
            
                        for(var n=0; n<nULs; n++) {
            
                            oMenu.addSubmenu((new Menu(aULs[n])));
            
                        }
    
                        this.cfg.setProperty("submenu", oMenu);

                    break;

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
    * @param {YAHOO.widget.Menu} p_oMenu The Menu instance fired the event.
    */
    configText: function(p_sType, p_aArguments, p_oObject) {

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
    * @param {YAHOO.widget.Menu} p_oMenu The Menu instance fired the event.
    */    
    configHelpText: function(p_sType, p_aArguments, p_oObject) {

        var oHelpText = p_aArguments[0];


        function initHelpText() {

            this._oDom.addClass(this.element, "hashelptext");
            this._oDom.addClass(this._oAnchor, "hashelptext");

            if(this.cfg.getProperty("disabled")) {

                this.cfg.refireEvent("disabled");

            }

            if(this.cfg.getProperty("selected")) {

                this.cfg.refireEvent("selected");

            }                

        }

        function removeHelpText() {

            this._oDom.removeClass(this.element, "hashelptext");
            this._oDom.removeClass(this._oAnchor, "hashelptext"); 

            this.element.removeChild(this._oHelpTextEM);
            this._oHelpTextEM = null;

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
    * @param {YAHOO.widget.Menu} p_oMenu The Menu instance fired the event.
    */    
    configURL: function(p_sType, p_aArguments, p_oObject) {

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
    * @param {YAHOO.widget.Menu} p_oMenu The Menu instance fired the event.
    */    
    configEmphasis: function(p_sType, p_aArguments, p_oObject) {

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

                if(
                    this._oAnchor.firstChild && 
                    this._oAnchor.firstChild.nodeType == 1 && 
                    this._oAnchor.firstChild.tagName == "EM"
                ) {

                    oEM = this._oAnchor.firstChild;

                }
                else if(
                    this._oAnchor.childNodes[1] && 
                    this._oAnchor.childNodes[1].nodeType == 1 &&
                    this._oAnchor.childNodes[1].tagName == "EM"
                ) {

                    oEM = this._oAnchor.childNodes[1];

                }


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
    * @param {YAHOO.widget.Menu} p_oMenu The Menu instance fired the event.
    */    
    configStrongEmphasis: function(p_sType, p_aArguments, p_oObject) {

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

                if(
                    this._oAnchor.firstChild && 
                    this._oAnchor.firstChild.nodeType == 1 && 
                    this._oAnchor.firstChild.tagName == "STRONG"
                ) {

                    oStrong = this._oAnchor.firstChild;

                }
                else if(
                    this._oAnchor.childNodes[1] && 
                    this._oAnchor.childNodes[1].nodeType == 1 &&
                    this._oAnchor.childNodes[1].tagName == "STRONG"
                ) {

                    oStrong = this._oAnchor.childNodes[1];

                }

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
    * @param {YAHOO.widget.Menu} p_oMenu The Menu instance fired the event.
    */    
    configDisabled: function(p_sType, p_aArguments, p_oObject) {

        var bDisabled = p_aArguments[0];


        if(bDisabled) {

            this.cfg.setProperty("selected", false);

            this._oAnchor.removeAttribute("href");
            this._oAnchor.removeAttribute("tabIndex");

            this._oDom.addClass(this.element, "disabled");
            this._oDom.addClass(this._oAnchor, "disabled");

            if(this._oHelpTextEM) {

                this._oDom.addClass(this._oHelpTextEM, "disabled");

            }

            if(this.subMenuIndicator) {

                this.subMenuIndicator.src = 
                    this.DISABLED_SUBMENU_INDICATOR_IMAGE_URL;

                this.subMenuIndicator.alt = 
                    this.DISABLED_SUBMENU_INDICATOR_ALT_TEXT;

            }

        }
        else {

            this._oAnchor.setAttribute(
                "href", 
                this.cfg.getProperty("url")
            );

            this._oAnchor.setAttribute("tabIndex", 0);

            this._oDom.removeClass(this.element, "disabled");
            this._oDom.removeClass(this._oAnchor, "disabled");

            if(this._oHelpTextEM) {

                this._oDom.removeClass(this._oHelpTextEM, "disabled");

            }

            if(this.subMenuIndicator) {

                this.subMenuIndicator.src = 
                    this.SUBMENU_INDICATOR_IMAGE_URL;

                this.subMenuIndicator.alt = 
                    this.COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT;

            }

        }    

    },


    /**
    * Event handler for when the "selected" configuration property of
    * a MenuItem instance changes. 
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.Menu} p_oMenu The Menu instance fired the event.
    */    
    configSelected: function(p_sType, p_aArguments, p_oObject) {

        var bSelected = p_aArguments[0];


        if(bSelected) {

            this._oDom.addClass(this.element, "selected");
            this._oDom.addClass(this._oAnchor, "selected");

            if(this._oHelpTextEM) {

                this._oDom.addClass(this._oHelpTextEM, "selected");

            }

            if(this.subMenuIndicator) {

                this.subMenuIndicator.src = 
                    document.getElementById("yuiselectedsubmenuindicator").src;

            }

        }
        else {

            this._oDom.removeClass(this.element, "selected");
            this._oDom.removeClass(this._oAnchor, "selected");

            if(this._oHelpTextEM) {

                this._oDom.removeClass(this._oHelpTextEM, "selected");

            }

            if(this.subMenuIndicator) {

                this.subMenuIndicator.src = 
                    document.getElementById("yuisubmenuindicator").src;

            }

        }


    },


    /**
    * Event handler for when the "submenu" configuration property of
    * a MenuItem instance changes. 
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.Menu} p_oMenu The Menu instance fired the event.
    */
    configSubmenu: function(p_sType, p_aArguments, p_oObject) {

        var oMenu = p_aArguments[0];

        if(oMenu) {

            oMenu.parent = this;

            this._oSubmenu = oMenu;

            this._oDom.addClass(this.element, "hassubmenu");
            this._oDom.addClass(this._oAnchor, "hassubmenu");

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


                if(this.cfg.getProperty("disabled")) {

                    this.cfg.refireEvent("disabled");

                }

                if(this.cfg.getProperty("selected")) {

                    this.cfg.refireEvent("selected");

                }                

            }

            if(!this._oSubmenu.element.parentNode) {

                this.element.appendChild(this._oSubmenu.element);

            }

        }
        else {

            this._oDom.removeClass(this.element, "hassubmenu");
            this._oDom.removeClass(oAnchor, "hassubmenu");

            if(this.subMenuIndicator) {

                this.element.removeChild(this.subMenuIndicator);

            }

            if(this._oSubmenu) {

                this.element.removeChild(this._oSubmenu);                    

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

        var oNextMenuItem;

        if(this.index < (this.parent.getMenuItems().length - 1)) {

            oNextMenuItem = this.parent.getMenuItem((this.index+1));

        }
        else {

            // Check if this Menu instance is a member of a group

            var oParent = this.parent.parent;

            if(oParent && oParent instanceof YAHOO.widget.Menu) {

                var oNextMenu, nNextMenuIndex;

                if(this.parent.index < (oParent.getSubmenus().length - 1)) {

                    nNextMenuIndex = this.parent.index + 1;

                }
                else {

                    nNextMenuIndex = 0;

                }

                oNextMenu = oParent.getSubmenu(nNextMenuIndex);

                if(oNextMenu) {

                    /*
                        Retrieve the first MenuItem instance in 
                        the next Menu
                    */ 

                    oNextMenuItem = oNextMenu.getMenuItem(0);

                }

            }
            else {

                /*
                    Retrieve the first MenuItem instance in the next 
                    parent Menu
                */ 

                oNextMenuItem = this.parent.getMenuItem(0);                    

            }

        }


        if(oNextMenuItem) {

            if(oNextMenuItem.cfg.getProperty("disabled")) {

                return oNextMenuItem.getNextEnabledSibling();

            }
            else {

                return oNextMenuItem;

            }

        }

    },


    /**
    * Finds the previous enabled MenuItem instance in a Menu instance 
    * @return Returns a MenuItem instance.
    * @type YAHOO.widget.MenuItem
    */
    getPreviousEnabledSibling: function() {

        var oPreviousMenuItem;

        if(this.index > 0) {

            oPreviousMenuItem = this.parent.getMenuItem((this.index-1));

        }
        else {

            // Check if this Menu instance is a member of a group

            var oParent = this.parent.parent;

            if(oParent && oParent instanceof YAHOO.widget.Menu) {

                var oPreviousMenu, nPreviousMenuIndex;

                if(this.parent.index > 0) {

                    nPreviousMenuIndex = this.parent.index - 1;

                }
                else {

                    nPreviousMenuIndex = oParent.getSubmenus().length - 1;

                }

                oPreviousMenu = oParent.getSubmenu(nPreviousMenuIndex);

                if(oPreviousMenu) {

                    /*
                        Retrieve the last MenuItem instance in 
                        the previous Menu
                    */ 

                    oPreviousMenuItem = 
                        oPreviousMenu.getMenuItem(
                            (oPreviousMenu.getMenuItems().length - 1)
                        );

                }

            }
            else {

                // Retrieve the last MenuItem instance in the parent Menu

                oPreviousMenuItem = 
                    this.parent.getMenuItem(
                        (this.parent.getMenuItems().length - 1)
                    );                    

            }

        }

        if(oPreviousMenuItem) {

            if(oPreviousMenuItem.cfg.getProperty("disabled")) {

                return oPreviousMenuItem.getPreviousEnabledSibling();

            }
            else {

                return oPreviousMenuItem;

            }

        }

    },


    /**
    * Causes a MenuItem instance to receive the focus and fires the
    * focus event.
    */
    focus: function() {

        if(!this.cfg.getProperty("disabled") && this._oAnchor) {


            var oActiveMenuItem = this.parent.getActiveMenuItem();

            if(oActiveMenuItem) {

                oActiveMenuItem.blur();

            }


            this._oAnchor.focus();

            this.focusEvent.fire();

        }

    },


    /**
    * Causes a MenuItem instance to lose focus and fires the onblur event.
    */    
    blur: function() {

        if(!this.cfg.getProperty("disabled") && this._oAnchor) {

            this._oAnchor.blur();

            this.blurEvent.fire();

        }

    },


    /**
    * Displays the submenu for a MenuItem instance.
    */
    showSubmenu: function() {

        if(this._oSubmenu) {

            var aMenuItemPosition = this._oDom.getXY(this.element),
                aSubmenuPosition = [];


            // Calculate the x position
            
            aSubmenuPosition[0] = 
                (aMenuItemPosition[0] + this.element.offsetWidth);


            // Calculate the y position

            aSubmenuPosition[1] = aMenuItemPosition[1];


            // Position the menu

            this._oSubmenu.cfg.setProperty("xy", aSubmenuPosition);
           
            this._oSubmenu.show();

            this.subMenuIndicator.alt = 
                this.EXPANDED_SUBMENU_INDICATOR_ALT_TEXT;

        }

    },


    /**
    * Displays the submenu for a MenuItem instance.
    */
    hideSubmenu: function() {

        if(this._oSubmenu) {

            this.subMenuIndicator.alt = 
                this.COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT;

            this._oSubmenu.hide();

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