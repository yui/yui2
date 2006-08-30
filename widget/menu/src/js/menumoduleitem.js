


/**
* @class The MenuModuleItem class allows you to create and modify an item for a
* MenuModule instance.
* @constructor
* @param {String} p_oObject The text of the MenuModuleItem to be 
* created <em>OR</em>
* @param {HTMLElement} p_oObject The HTMLElement representing the source node 
* (either HTMLLIElement, HTMLOptGroupElement or HTMLOptionElement) of 
* the MenuModuleItem
* @param {Object} p_oConfig The configuration object literal containing 
* the configuration for a MenuModuleItem instance. See the configuration 
* class documentation for more details.
*/
YAHOO.widget.MenuModuleItem = function(p_oObject, p_oConfig) {

    if(p_oObject) {

        this.init(p_oObject, p_oConfig);

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
    SUBMENU_INDICATOR_IMAGE_PATH: "nt/ic/ut/alt1/menuarorght8_nrm_1.gif",


    /**
    * Constant representing the path to the image to be used for the submenu
    * arrow indicator when a MenuModuleItem instance is selected.
    * @final
    * @type String
    */
    SELECTED_SUBMENU_INDICATOR_IMAGE_PATH: 
        "nt/ic/ut/alt1/menuarorght8_hov_1.gif",


    /**
    * Constant representing the path to the image to be used for the submenu
    * arrow indicator when a MenuModuleItem instance is disabled.
    * @final
    * @type String
    */
    DISABLED_SUBMENU_INDICATOR_IMAGE_PATH: 
        "nt/ic/ut/alt1/menuarorght8_dim_1.gif",


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
    * @type String
    */
    IMG_ROOT: "http://us.i1.yimg.com/us.yimg.com/i/",
    

    /**
    * Constant representing the prefix path to use for securely served images
    * @type String
    */
    IMG_ROOT_SSL: "https://a248.e.akamai.net/sec.yimg.com/i/",


    // Private member variables
    
    /**
    * Reference to the HTMLAnchorElement of the MenuModuleItem's core internal
    * DOM structure.
    * @private
    * @type HTMLAnchorElement
    */
    _oAnchor: null,
    

    /**
    * Reference to the text node of the MenuModuleItem's core internal
    * DOM structure.
    * @private
    * @type Text
    */
    _oText: null,
    
    
    /**
    * Reference to the HTMLElement (&#60;EM&#60;) used to create the optional
    * help text for a MenuModuleItem instance.
    * @private
    * @type HTMLElement
    */
    _oHelpTextEM: null,
    
    
    /**
    * Reference to the submenu for a MenuModuleItem instance.
    * @private
    * @type YAHOO.widget.MenuModule
    */
    _oSubmenu: null,
    
    
    /**
    * Reference to the Dom utility singleton.
    * @private
    * @type YAHOO.util.Dom
    */
    _oDom: YAHOO.util.Dom,


    /** 
    * The current state of a MenuModuleItem instance's "mouseover" event
    * @private
    * @type Boolean
    */
    _bFiredMouseOverEvent: false,
    
    
    /** 
    * The current state of a MenuModuleItem instance's "mouseout" event
    * @private
    * @type Boolean
    */
    _bFiredMouseOutEvent: false,


    // Public properties

	/**
	* The class's constructor function
	* @type YAHOO.widget.MenuModuleItem
	*/
	constructor: YAHOO.widget.MenuModuleItem,


	/**
	* The string representing the image root
	* @type String
	*/
	imageRoot: null,


	/**
	* Boolean representing whether or not the current browsing context 
	* is secure (https)
	* @type Boolean
	*/
	isSecure: YAHOO.widget.Module.prototype.isSecure,


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
    * @type YAHOO.widget.MenuModule
    */
    parent: null,


    /**
    * Returns the HTMLLIElement for a MenuModuleItem instance.
    * @type HTMLLIElement
    */
    element: null,


    /**
    * Returns the HTMLElement (either HTMLLIElement, HTMLOptGroupElement or
    * HTMLOptionElement) used create the MenuModuleItem instance.
    * @type HTMLLIElement/HTMLOptGroupElement/HTMLOptionElement
    */
    srcElement: null,


    /**
    * Specifies an arbitrary value for a MenuModuleItem instance.
    * @type Object
    */
    value: null,


    /**
    * Reference to the HTMLImageElement used to create the submenu
    * indicator for a MenuModuleItem instance.
    * @type HTMLImageElement
    */
    submenuIndicator: null,


	/**
	* String representing the browser
	* @type String
	*/
	browser: YAHOO.widget.Module.prototype.browser,


    // Events

    /**
    * Fires when a MenuModuleItem instances's HTMLLIElement is removed from
    * its parent HTMLUListElement node.
    * @type YAHOO.util.CustomEvent
    */
    destroyEvent: null,


    /**
    * Fires when the mouse has entered a MenuModuleItem instance.  Passes
    * back the DOM Event object as an argument.
    * @type YAHOO.util.CustomEvent
    */
    mouseOverEvent: null,


    /**
    * Fires when the mouse has left a MenuModuleItem instance.  Passes back  
    * the DOM Event object as an argument.
    * @type YAHOO.util.CustomEvent
    */
    mouseOutEvent: null,


    /**
    * Fires when the user mouses down on a MenuModuleItem instance.  Passes 
    * back the DOM Event object as an argument.
    * @type YAHOO.util.CustomEvent
    */
    mouseDownEvent: null,


    /**
    * Fires when the user releases a mouse button while the mouse is 
    * over a MenuModuleItem instance.  Passes back the DOM Event object as
    * an argument.
    * @type YAHOO.util.CustomEvent
    */
    mouseUpEvent: null,


    /**
    * Fires when the user clicks the on a MenuModuleItem instance.  Passes 
    * back the DOM Event object as an argument.
    * @type YAHOO.util.CustomEvent
    */
    clickEvent: null,


    /**
    * Fires when the user presses an alphanumeric key.  Passes back the 
    * DOM Event object as an argument.
    * @type YAHOO.util.CustomEvent
    */
    keyPressEvent: null,


    /**
    * Fires when the user presses a key.  Passes back the DOM Event 
    * object as an argument.
    * @type YAHOO.util.CustomEvent
    */
    keyDownEvent: null,


    /**
    * Fires when the user releases a key.  Passes back the DOM Event 
    * object as an argument.
    * @type YAHOO.util.CustomEvent
    */
    keyUpEvent: null,


    /**
    * Fires when a MenuModuleItem instance receives focus.
    * @type YAHOO.util.CustomEvent
    */
    focusEvent: null,


    /**
    * Fires when a MenuModuleItem instance loses the input focus.
    * @type YAHOO.util.CustomEvent
    */
    blurEvent: null,


    /**
    * The MenuModuleItem class's initialization method. This method is 
    * automatically called by the constructor, and sets up all DOM references 
    * for pre-existing markup, and creates required markup if it is not
    * already present.
    * @param {String} p_oObject The text of the MenuModuleItem to be 
    * created <em>OR</em>
    * @param {HTMLElement} p_oObject The HTMLElement representing the source  
    * node (either HTMLLIElement, HTMLOptGroupElement or HTMLOptionElement) of 
    * the MenuModuleItem
    * @param {Object} p_oConfig The configuration object literal containing 
    * the configuration for a MenuModuleItem instance. See the configuration 
    * class documentation for more details.
    */
    init: function(p_oObject, p_oConfig) {

        this.imageRoot = (this.isSecure) ? this.IMG_ROOT_SSL : this.IMG_ROOT;


        if(!this.SUBMENU_TYPE) {
    
            this.SUBMENU_TYPE = YAHOO.widget.MenuModule;
    
        }

        if(!this.SUBMENU_ITEM_TYPE) {
    
            this.SUBMENU_ITEM_TYPE = YAHOO.widget.MenuModuleItem;
    
        }


        // Create the config object

        this.cfg = new YAHOO.util.Config(this);

        this.initDefaultConfig();

        var oConfig = this.cfg;


        if(this._checkString(p_oObject)) {

            this._createRootNodeStructure();

            oConfig.setProperty("text", p_oObject);

        }
        else if(this._checkDOMNode(p_oObject)) {

            switch(p_oObject.tagName) {

                case "OPTION":

                    this._createRootNodeStructure();

                    oConfig.setProperty("text", p_oObject.text);

                    this.srcElement = p_oObject;

                break;

                case "OPTGROUP":

                    this._createRootNodeStructure();

                    oConfig.setProperty("text", p_oObject.label);

                    this.srcElement = p_oObject;

                    this._initSubTree();

                break;

                case "LI":

                    // Get the anchor node (if it exists)

                    var oAnchor = this._getFirstElement(p_oObject, "A");
                    var sURL = "#";
                    var sTarget = null;
                    var sText = null;


                    // Capture the "text" and/or the "URL"

                    if(oAnchor) {

                        sURL = oAnchor.getAttribute("href");
                        sTarget = oAnchor.getAttribute("target");

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

                    var oEmphasisNode = this._getFirstElement(oAnchor);
                    var bEmphasis = false;
                    var bStrongEmphasis = false;

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

                    oConfig.setProperty("text", sText, true);
                    oConfig.setProperty("url", sURL, true);
                    oConfig.setProperty("target", sTarget, true);
                    oConfig.setProperty("emphasis", bEmphasis, true);
                    oConfig.setProperty(
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


            // Subscribe to custom event

            this.clickEvent.subscribe(this._onMenuModuleItemClick, this, true);


            if(p_oConfig) {
    
                oConfig.applyConfig(p_oConfig);
    
            }        

            oConfig.fireQueue();

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

        var Menu = this.SUBMENU_TYPE;
        var MenuModuleItem = this.SUBMENU_ITEM_TYPE;
        var oSrcEl = this.srcElement;
        var oConfig = this.cfg;


        if(oSrcEl.childNodes.length > 0) {

            var oNode = oSrcEl.firstChild;
            var aOptions = [];

            do {

                switch(oNode.tagName) {
        
                    case "DIV":
        
                        oConfig.setProperty("submenu", (new Menu(oNode)));
        
                    break;
 
                    case "OPTION":

                        aOptions[aOptions.length] = oNode;

                    break;
       
                }
            
            }        
            while((oNode = oNode.nextSibling));


            var nOptions = aOptions.length;

            if(nOptions > 0) {
    
                oConfig.setProperty(
                    "submenu", 
                    (new Menu(this._oDom.generateId()))
                );
    
                for(var n=0; n<nOptions; n++) {
    
                    this._oSubmenu.addItem((new MenuModuleItem(aOptions[n])));
    
                }
    
            }

        }

    },


    /**
    * "click" event handler for a MenuModuleItem
    * @private
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArgs Collection of arguments sent when the event 
    * was fired.
    * @param {YAHOO.widget.MenuItem} p_oMenuModuleItem The MenuModule instance  
    * that fired the event.
    */         
    _onMenuModuleItemClick: function(p_sType, p_aArgs, p_oMenuModuleItem) {

        var Event = YAHOO.util.Event;
        var oEvent = p_aArgs[0];
        var oTarget = Event.getTarget(oEvent);
        var oSubmenu = this.cfg.getProperty("submenu");


        /*
            ACCESSIBILITY FEATURE FOR SCREEN READERS: Expand/collapse the
            submenu when the user clicks on the submenu indicator image.
        */        

        if(oTarget == this.submenuIndicator && oSubmenu) {

            if(oSubmenu.cfg.getProperty("visible")) {
    
                oSubmenu.hide();
    
            }
            else {

                var oActiveItem = this.parent.activeItem;
           

                // Hide any other submenus that might be visible
            
                if(oActiveItem && oActiveItem != this) {
            
                    this.parent.clearActiveItem();
            
                }

                this.parent.activeItem = this;
    
                this.cfg.setProperty("selected", true);

                oSubmenu.show();
    
            }
    
        }
        else {

            var sURL = this.cfg.getProperty("url");
            var bCurrentPageURL = (sURL.substr((sURL.length-1),1) == "#");

            var sTarget = this.cfg.getProperty("target");
            var bHasTarget = (sTarget && sTarget.length > 0);

            // Prevent the browser from following links equal to "#"

            if(oTarget.tagName == "A" && bCurrentPageURL && !bHasTarget) {

                Event.preventDefault(oEvent);
            
            }

            if(oTarget.tagName != "A" && !bCurrentPageURL && !bHasTarget) {
                
                /*
                    Follow the URL of the item regardless of whether or 
                    not the user clicked specifically on the
                    HTMLAnchorElement (&#60;A&#60;) node.
                */
    
                document.location = sURL;
        
            }

        }

    },


    // Event handlers for configuration properties

    /**
    * Event handler for when the "text" configuration property of
    * a MenuModuleItem instance changes. 
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArgs Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuModuleItem} p_oItem The MenuModuleItem instance 
    * that fired the event.
    */
    configText: function(p_sType, p_aArgs, p_oItem) {

        var sText = p_aArgs[0];


        if(this._oText) {

            this._oText.nodeValue = sText;

        }

    },


    /**
    * Event handler for when the "helptext" configuration property of
    * a MenuModuleItem instance changes. 
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArgs Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuModuleItem} p_oItem The MenuModuleItem instance 
    * that fired the event.
    */    
    configHelpText: function(p_sType, p_aArgs, p_oItem) {

        var me = this;
        var Dom = this._oDom;
        var oHelpText = p_aArgs[0];
        var oEl = this.element;
        var oConfig = this.cfg;
        var aNodes = [oEl, this._oAnchor];
        var oImg = this.submenuIndicator;


        /**
        * Adds the "hashelptext" class to the necessary nodes and refires the 
        * "selected" and "disabled" configuration events
        * @private
        */
        var initHelpText = function() {

            Dom.addClass(aNodes, "hashelptext");

            if(oConfig.getProperty("disabled")) {

                oConfig.refireEvent("disabled");

            }

            if(oConfig.getProperty("selected")) {

                oConfig.refireEvent("selected");

            }                

        };


        /**
        * Removes the "hashelptext" class and corresponding DOM element (EM)
        * @private
        */
        var removeHelpText = function() {

            Dom.removeClass(aNodes, "hashelptext");

            oEl.removeChild(me._oHelpTextEM);
            me._oHelpTextEM = null;

        };


        if(this._checkDOMNode(oHelpText)) {

            if(this._oHelpTextEM) {

                this._oHelpTextEM.parentNode.replaceChild(
                    oHelpText, 
                    this._oHelpTextEM
                );

            }
            else {

                this._oHelpTextEM = oHelpText;

                oEl.insertBefore(this._oHelpTextEM, oImg);

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

                    oEl.insertBefore(this._oHelpTextEM, oImg);

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
    * @param {Array} p_aArgs Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuModuleItem} p_oItem The MenuModuleItem instance 
    * that fired the event.
    */    
    configURL: function(p_sType, p_aArgs, p_oItem) {

        var sURL = p_aArgs[0];

        if(!sURL) {

            sURL = "#";

        }

        this._oAnchor.setAttribute("href", sURL);

    },


    /**
    * Event handler for when the "target" configuration property of
    * a MenuModuleItem instance changes.  
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArgs Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuModuleItem} p_oItem The MenuModuleItem instance 
    * that fired the event.
    */    
    configTarget: function(p_sType, p_aArgs, p_oItem) {

        var sTarget = p_aArgs[0];
        var oAnchor = this._oAnchor;

        if(sTarget && sTarget.length > 0) {

            oAnchor.setAttribute("target", sTarget);

        }
        else {

            oAnchor.removeAttribute("target");
        
        }

    },


    /**
    * Event handler for when the "emphasis" configuration property of
    * a MenuModuleItem instance changes.  
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArgs Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuModuleItem} p_oItem The MenuModuleItem instance 
    * that fired the event.
    */    
    configEmphasis: function(p_sType, p_aArgs, p_oItem) {

        var bEmphasis = p_aArgs[0];
        var oAnchor = this._oAnchor;
        var oText = this._oText;
        var oConfig = this.cfg;
        var oEM;


        if(bEmphasis && oConfig.getProperty("strongemphasis")) {

            oConfig.setProperty("strongemphasis", false);

        }


        if(oAnchor) {

            if(bEmphasis) {

                oEM = document.createElement("em");
                oEM.appendChild(oText);

                oAnchor.appendChild(oEM);

            }
            else {

                oEM = this._getFirstElement(oAnchor, "EM");

                oAnchor.removeChild(oEM);
                oAnchor.appendChild(oText);

            }

        }

    },


    /**
    * Event handler for when the "strongemphasis" configuration property of
    * a MenuModuleItem instance changes. 
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArgs Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuModuleItem} p_oItem The MenuModuleItem instance 
    * that fired the event.
    */    
    configStrongEmphasis: function(p_sType, p_aArgs, p_oItem) {

        var bStrongEmphasis = p_aArgs[0];
        var oAnchor = this._oAnchor;
        var oText = this._oText;
        var oConfig = this.cfg;
        var oStrong;

        if(bStrongEmphasis && oConfig.getProperty("emphasis")) {

            oConfig.setProperty("emphasis", false);

        }

        if(oAnchor) {

            if(bStrongEmphasis) {

                oStrong = document.createElement("strong");
                oStrong.appendChild(oText);

                oAnchor.appendChild(oStrong);

            }
            else {

                oStrong = this._getFirstElement(oAnchor, "STRONG");

                oAnchor.removeChild(oStrong);
                oAnchor.appendChild(oText);

            }

        }

    },


    /**
    * Event handler for when the "disabled" configuration property of
    * a MenuModuleItem instance changes. 
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArgs Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuModuleItem} p_oItem The MenuModuleItem instance 
    * that fired the event.
    */    
    configDisabled: function(p_sType, p_aArgs, p_oItem) {

        var bDisabled = p_aArgs[0];
        var Dom = this._oDom;
        var oAnchor = this._oAnchor;
        var aNodes = [this.element, oAnchor];
        var oEM = this._oHelpTextEM;
        var oConfig = this.cfg;
        var oImg = this.submenuIndicator;
        var sImageSrc;
        var sImageAlt;


        if(oEM) {

            aNodes[2] = oEM;

        }

        if(bDisabled) {

            if(oConfig.getProperty("selected")) {

                oConfig.setProperty("selected", false);

            }

            oAnchor.removeAttribute("href");

            Dom.addClass(aNodes, "disabled");

            sImageSrc = this.DISABLED_SUBMENU_INDICATOR_IMAGE_PATH;
            sImageAlt = this.DISABLED_SUBMENU_INDICATOR_ALT_TEXT;

        }
        else {

            oAnchor.setAttribute("href", oConfig.getProperty("url"));

            Dom.removeClass(aNodes, "disabled");

            sImageSrc = this.SUBMENU_INDICATOR_IMAGE_PATH;
            sImageAlt = this.COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT;

        }


        if(oImg) {

            oImg.src = this.imageRoot + sImageSrc;
            oImg.alt = sImageAlt;

        }

    },


    /**
    * Event handler for when the "selected" configuration property of
    * a MenuModuleItem instance changes. 
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArgs Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuModuleItem} p_oItem The MenuModuleItem instance 
    * that fired the event.
    */    
    configSelected: function(p_sType, p_aArgs, p_oItem) {

        if(!this.cfg.getProperty("disabled")) {

            var Dom = this._oDom;
            var bSelected = p_aArgs[0];
            var oEM = this._oHelpTextEM;
            var aNodes = [this.element, this._oAnchor];
            var oImg = this.submenuIndicator;
            var sImageSrc;


            if(oEM) {
    
                aNodes[aNodes.length] = oEM;  
    
            }
            
            if(oImg) {

                aNodes[aNodes.length] = oImg;  
            
            }
    
            if(bSelected) {
    
                Dom.addClass(aNodes, "selected");
                sImageSrc = this.SELECTED_SUBMENU_INDICATOR_IMAGE_PATH;
    
            }
            else {
    
                Dom.removeClass(aNodes, "selected");
                sImageSrc = this.SUBMENU_INDICATOR_IMAGE_PATH;
    
            }
    
            if(oImg) {
    
                oImg.src = document.images[(this.imageRoot + sImageSrc)].src;

            }

        }

    },


    /**
    * Event handler for when the "submenu" configuration property of
    * a MenuModuleItem instance changes. 
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArgs Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuModuleItem} p_oItem The MenuModuleItem instance 
    * that fired the event.
    */
    configSubmenu: function(p_sType, p_aArgs, p_oItem) {

        var Dom = this._oDom;
        var oEl = this.element;
        var oSubmenu = p_aArgs[0];
        var oImg = this.submenuIndicator;
        var oConfig = this.cfg;
        var aNodes = [this.element, this._oAnchor];


        if(oSubmenu) {

            // Set the submenu's parent to this MenuModuleItem instance

            oSubmenu.parent = this;

            this._oSubmenu = oSubmenu;


            if(!oImg) { 

                var me = this;

                /**
                * Preloads an image by creating an image element from the 
                * specified path and appending the image to the body of 
                * the document
                * @private
                * @param {String} p_sPath The path to the image.                
                */
                var preloadImage = function(p_sPath) {

                    var sPath = me.imageRoot + p_sPath;

                    if(!document.images[sPath]) {

                        var oImage = document.createElement("img");
                        oImage.src = sPath;
                        oImage.name = sPath;
                        oImage.id = sPath;
                        oImage.style.display = "none";
                        
                        document.body.appendChild(oImage);

                    }
                
                };

                preloadImage(this.SUBMENU_INDICATOR_IMAGE_PATH);
                preloadImage(this.SELECTED_SUBMENU_INDICATOR_IMAGE_PATH);
                preloadImage(this.DISABLED_SUBMENU_INDICATOR_IMAGE_PATH);

                oImg = document.createElement("img");
                oImg.src = (this.imageRoot + this.SUBMENU_INDICATOR_IMAGE_PATH);
                oImg.alt = this.COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT;

                oEl.appendChild(oImg);

                this.submenuIndicator = oImg;

                Dom.addClass(aNodes, "hassubmenu");


                if(oConfig.getProperty("disabled")) {

                    oConfig.refireEvent("disabled");

                }

                if(oConfig.getProperty("selected")) {

                    oConfig.refireEvent("selected");

                }                

            }

        }
        else {

            Dom.removeClass(aNodes, "hassubmenu");

            if(oImg) {

                oEl.removeChild(oImg);

            }

            if(this._oSubmenu) {

                this._oSubmenu.destroy();

            }

        }

    },


    // Public methods

	/**
	* Initializes an item's configurable properties.
	*/
	initDefaultConfig : function() {

        var oConfig = this.cfg;
        var CheckBoolean = oConfig.checkBoolean;


        // Define the config properties

        oConfig.addProperty(
            "text", 
            { 
                value: "", 
                handler: this.configText, 
                validator: this._checkString, 
                suppressEvent: true 
            }
        );
        
        oConfig.addProperty("helptext", { handler: this.configHelpText });
        
        oConfig.addProperty(
            "url", 
            { value: "#", handler: this.configURL, suppressEvent: true }
        );
        
        oConfig.addProperty(
            "target", 
            { handler: this.configTarget, suppressEvent: true }
        );

        oConfig.addProperty(
            "emphasis", 
            { 
                value: false, 
                handler: this.configEmphasis, 
                validator: CheckBoolean, 
                suppressEvent: true 
            }
        );

        oConfig.addProperty(
            "strongemphasis",
            {
                value: false,
                handler: this.configStrongEmphasis,
                validator: CheckBoolean,
                suppressEvent: true
            }
        );

        oConfig.addProperty(
            "disabled",
            {
                value: false,
                handler: this.configDisabled,
                validator: CheckBoolean,
                suppressEvent: true
            }
        );

        oConfig.addProperty(
            "selected",
            {
                value: false,
                handler: this.configSelected,
                validator: CheckBoolean,
                suppressEvent: true
            }
        );

        oConfig.addProperty("submenu", { handler: this.configSubmenu });

	},


    /**
    * Finds the next enabled MenuModuleItem instance in a MenuModule instance 
    * @return Returns a MenuModuleItem instance.
    * @type YAHOO.widget.MenuModuleItem
    */
    getNextEnabledSibling: function() {

        if(this.parent instanceof YAHOO.widget.MenuModule) {

            var nGroupIndex = this.groupIndex;

            /**
            * Returns the next item in an array 
            * @private
            * @param {p_aArray} An array
            * @param {p_nStartIndex} The index to start searching the array 
            * @return Returns an item in an array
            * @type Object 
            */
            var getNextArrayItem = function(p_aArray, p_nStartIndex) {
    
                return p_aArray[p_nStartIndex] || 
                    getNextArrayItem(p_aArray, (p_nStartIndex+1));
    
            };
    
    
            var aItemGroups = this.parent.getItemGroups();
            var oNextItem;
    
    
            if(this.index < (aItemGroups[nGroupIndex].length - 1)) {
    
                oNextItem = getNextArrayItem(
                        aItemGroups[nGroupIndex], 
                        (this.index+1)
                    );
    
            }
            else {
    
                var nNextGroupIndex;
    
                if(nGroupIndex < (aItemGroups.length - 1)) {
    
                    nNextGroupIndex = nGroupIndex + 1;
    
                }
                else {
    
                    nNextGroupIndex = 0;
    
                }
    
                var aNextGroup = getNextArrayItem(aItemGroups, nNextGroupIndex);
    
                // Retrieve the first MenuModuleItem instance in the next group
    
                oNextItem = getNextArrayItem(aNextGroup, 0);
    
            }
    
            return (
                oNextItem.cfg.getProperty("disabled") || 
                oNextItem.element.style.display == "none"
            ) ? 
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

            var nGroupIndex = this.groupIndex;

            /**
            * Returns the previous item in an array 
            * @private
            * @param {p_aArray} An array
            * @param {p_nStartIndex} The index to start searching the array 
            * @return Returns an item in an array
            * @type Object 
            */
            var getPreviousArrayItem = function(p_aArray, p_nStartIndex) {
    
                return p_aArray[p_nStartIndex] || 
                    getPreviousArrayItem(p_aArray, (p_nStartIndex-1));
    
            };


            /**
            * Get the index of the first item in an array 
            * @private
            * @param {p_aArray} An array
            * @param {p_nStartIndex} The index to start searching the array 
            * @return Returns an item in an array
            * @type Object 
            */    
            var getFirstItemIndex = function(p_aArray, p_nStartIndex) {
    
                return p_aArray[p_nStartIndex] ? 
                    p_nStartIndex : 
                    getFirstItemIndex(p_aArray, (p_nStartIndex+1));
    
            };
    
            var aItemGroups = this.parent.getItemGroups();
            var oPreviousItem;
    
            if(
                this.index > getFirstItemIndex(aItemGroups[nGroupIndex], 0)
            ) {
    
                oPreviousItem = 
                    getPreviousArrayItem(
                        aItemGroups[nGroupIndex], 
                        (this.index-1)
                    );
    
            }
            else {
    
                var nPreviousGroupIndex;
    
                if(nGroupIndex > getFirstItemIndex(aItemGroups, 0)) {
    
                    nPreviousGroupIndex = nGroupIndex - 1;
    
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

            return (
                oPreviousItem.cfg.getProperty("disabled") || 
                oPreviousItem.element.style.display == "none"
            ) ? 
            oPreviousItem.getPreviousEnabledSibling() : oPreviousItem;

        }

    },


    /**
    * Causes a MenuModuleItem instance to receive the focus and fires the
    * focus event.
    */
    focus: function() {

        var oParent = this.parent;
        var oAnchor = this._oAnchor;
        var oActiveItem = oParent.activeItem;

        if(
            !this.cfg.getProperty("disabled") && 
            oParent && 
            oParent.cfg.getProperty("visible") && 
            this.element.style.display != "none"
        ) {

            if(oActiveItem) {

                oActiveItem.blur();

            }

            oAnchor.focus();

            this.focusEvent.fire();

        }

    },


    /**
    * Causes a MenuModuleItem instance to lose focus and fires the onblur event.
    */    
    blur: function() {

        var oParent = this.parent;

        if(
            !this.cfg.getProperty("disabled") && 
            oParent && 
            this._oDom.getStyle(oParent.element, "visibility") == "visible"
        ) {

            this._oAnchor.blur();

            this.blurEvent.fire();

        }

    },


	/**
	* Removes a MenuModuleItem instance's HTMLLIElement from its parent
    * HTMLUListElement node.
	*/
    destroy: function() {

        var oEl = this.element;

        if(oEl) {

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

            var oParentNode = oEl.parentNode;

            if(oParentNode) {

                oParentNode.removeChild(oEl);

                this.destroyEvent.fire();

            }

            this.destroyEvent.unsubscribeAll();

        }

    }

};