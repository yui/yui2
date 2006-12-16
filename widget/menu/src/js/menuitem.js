


(function() {

var Dom = YAHOO.util.Dom,
    Module = YAHOO.widget.Module,
    Menu = YAHOO.widget.Menu;


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
YAHOO.widget.MenuItem = function(p_oObject, p_oConfig) {

    if(p_oObject) {

        if(p_oConfig) {
    
            this.parent = p_oConfig.parent;
            this.value = p_oConfig.value;
            
        }

        this.init(p_oObject, p_oConfig);

    }

};

YAHOO.widget.MenuItem.prototype = {

    // Constants

    /**
    * @property SUBMENU_INDICATOR_IMAGE_PATH
    * @description String representing the path to the image to be used for the 
    * menu item's submenu arrow indicator.
    * @default "nt/ic/ut/alt1/menuarorght8_nrm_1.gif"
    * @final
    * @type String
    */
    SUBMENU_INDICATOR_IMAGE_PATH: "nt/ic/ut/alt1/menuarorght8_nrm_1.gif",


    /**
    * @property SELECTED_SUBMENU_INDICATOR_IMAGE_PATH
    * @description String representing the path to the image to be used for the 
    * submenu arrow indicator when the menu item is selected.
    * @default "nt/ic/ut/alt1/menuarorght8_hov_1.gif"
    * @final
    * @type String
    */
    SELECTED_SUBMENU_INDICATOR_IMAGE_PATH: 
        "nt/ic/ut/alt1/menuarorght8_hov_1.gif",


    /**
    * @property DISABLED_SUBMENU_INDICATOR_IMAGE_PATH
    * @description String representing the path to the image to be used for the 
    * submenu arrow indicator when the menu item is disabled.
    * @default "nt/ic/ut/alt1/menuarorght8_dim_1.gif"
    * @final
    * @type String
    */
    DISABLED_SUBMENU_INDICATOR_IMAGE_PATH: 
        "nt/ic/ut/alt1/menuarorght8_dim_1.gif",


    /**
    * @property COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT
    * @description String representing the alt text for the image to be used 
    * for the submenu arrow indicator.
    * @default "Collapsed.  Click to expand."
    * @final
    * @type String
    */
    COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT: "Collapsed.  Click to expand.",


    /**
    * @property EXPANDED_SUBMENU_INDICATOR_ALT_TEXT
    * @description String representing the alt text for the image to be used 
    * for the submenu arrow indicator when the submenu is visible.
    * @default "Expanded.  Click to collapse."
    * @final
    * @type String
    */
    EXPANDED_SUBMENU_INDICATOR_ALT_TEXT: "Expanded.  Click to collapse.",


    /**
    * @property DISABLED_SUBMENU_INDICATOR_ALT_TEXT
    * @description String representing the alt text for the image to be used 
    * for the submenu arrow indicator when the menu item is disabled.
    * @default "Disabled."
    * @final
    * @type String
    */
    DISABLED_SUBMENU_INDICATOR_ALT_TEXT: "Disabled.",


    /**
    * @property CHECKED_IMAGE_PATH
    * @description String representing the path to the image to be used for 
    * the checked state.
    * @default "nt/ic/ut/bsc/menuchk8_nrm_1.gif"
    * @final
    * @type String
    */
    CHECKED_IMAGE_PATH: "nt/ic/ut/bsc/menuchk8_nrm_1.gif",
    

    /**
    * @property SELECTED_CHECKED_IMAGE_PATH
    * @description String representing the path to the image to be used for 
    * the selected checked state.
    * @default "nt/ic/ut/bsc/menuchk8_hov_1.gif"
    * @final
    * @type String
    */
    SELECTED_CHECKED_IMAGE_PATH: "nt/ic/ut/bsc/menuchk8_hov_1.gif",
    

    /**
    * @property DISABLED_CHECKED_IMAGE_PATH
    * @description String representing the path to the image to be used for 
    * the disabled checked state.
    * @default "nt/ic/ut/bsc/menuchk8_dim_1.gif"
    * @final
    * @type String
    */
    DISABLED_CHECKED_IMAGE_PATH: "nt/ic/ut/bsc/menuchk8_dim_1.gif",
    

    /**
    * @property CHECKED_IMAGE_ALT_TEXT
    * @description String representing the alt text for the image to be used 
    * for the checked image.
    * @default "Checked."
    * @final
    * @type String
    */
    CHECKED_IMAGE_ALT_TEXT: "Checked.",
    
    
    /**
    * @property DISABLED_CHECKED_IMAGE_ALT_TEXT
    * @description String representing the alt text for the image to be used 
    * for the checked image when the item is disabled.
    * @default "Checked. (Item disabled.)"
    * @final
    * @type String
    */
    DISABLED_CHECKED_IMAGE_ALT_TEXT: "Checked. (Item disabled.)",


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
    * @property SUBMENU_TYPE
    * @description Object representing the type of menu to instantiate and 
    * add when parsing the child nodes of the menu item's source HTML element.
    * @final
    * @type YAHOO.widget.Menu
    */
    SUBMENU_TYPE: null,


    /**
    * @property IMG_ROOT
    * @description String representing the prefix path to use for 
    * non-secure images.
    * @default "http://us.i1.yimg.com/us.yimg.com/i/"
    * @type String
    */
    IMG_ROOT: "http://us.i1.yimg.com/us.yimg.com/i/",
    

    /**
    * @property IMG_ROOT_SSL
    * @description String representing the prefix path to use for securely 
    * served images.
    * @default "https://a248.e.akamai.net/sec.yimg.com/i/"
    * @type String
    */
    IMG_ROOT_SSL: "https://a248.e.akamai.net/sec.yimg.com/i/",



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
    * @property _oText
    * @description Object reference to the menu item's text node.
    * @default null
    * @private
    * @type TextNode
    */
    _oText: null,
    
    
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
    * @property _checkImage
    * @description Object reference to the menu item's checkmark image.
    * @default null
    * @private
    * @type <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
    * one-html.html#ID-17701901">HTMLImageElement</a>
    */
    _checkImage: null,



    // Public properties

	/**
    * @property constructor
	* @description Object reference to the menu item's constructor function.
    * @default YAHOO.widget.MenuItem
	* @type YAHOO.widget.MenuItem
	*/
	constructor: YAHOO.widget.MenuItem,


	/**
    * @property imageRoot
	* @description String representing the root path for all of the menu 
	* item's images.
	* @type String
	*/
	imageRoot: null,


	/**
    * @property isSecure
	* @description Boolean representing whether or not the current browsing 
	* context is secure (HTTPS).
	* @type Boolean
	*/
	isSecure: Module.prototype.isSecure,


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
    * @property submenuIndicator
    * @description Object reference to the <code>&#60;img&#62;</code> element 
    * used to create the submenu indicator for the menu item.
    * @default <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
    * level-one-html.html#ID-17701901">HTMLImageElement</a>
    * @type <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
    * level-one-html.html#ID-17701901">HTMLImageElement</a>
    */
    submenuIndicator: null,


	/**
    * @property browser
	* @description String representing the browser.
	* @type String
	*/
	browser: Module.prototype.browser,



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
    init: function(p_oObject, p_oConfig) {

        this.imageRoot = (this.isSecure) ? this.IMG_ROOT_SSL : this.IMG_ROOT;


        if(!this.SUBMENU_TYPE) {
    
            this.SUBMENU_TYPE = Menu;
    
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

            switch(p_oObject.tagName.toUpperCase()) {

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

                    var oAnchor = this._getFirstElement(p_oObject, "A"),
                        sURL = "#",
                        sTarget,
                        sText;


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
    

                    // Check if emphasis has been applied to the MenuItem

                    var oEmphasisNode = this._getFirstElement(oAnchor),
                        bEmphasis = false,
                        bStrongEmphasis = false;

                    if(oEmphasisNode) {

                        // Set a reference to the text node 

                        this._oText = oEmphasisNode.firstChild;

                        switch(oEmphasisNode.tagName.toUpperCase()) {

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


            Dom.addClass(this.element, this.CSS_CLASS_NAME);


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


            if(p_oConfig) {
    
                oConfig.applyConfig(p_oConfig);
    
            }        

            oConfig.fireQueue();

        }

    },



    // Private methods

    /**
    * @method _getFirstElement
    * @description Returns an HTML element's first HTML element node.
    * @private
    * @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
    * level-one-html.html#ID-58190037">HTMLElement</a>} p_oElement Object 
    * reference specifying the element to be evaluated.
    * @param {String} p_sTagName Optional. String specifying the tagname of 
    * the element to be retrieved.
    * @return {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
    * level-one-html.html#ID-58190037">HTMLElement</a>}
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

            return (oElement && oElement.tagName.toUpperCase() == p_sTagName) ? 
                oElement : false;

        }

        return oElement;

    },


    /**
    * @method _checkString
    * @description Determines if an object is a string.
    * @private
    * @param {Object} p_oObject Object to be evaluated.
    * @return {Boolean}
    */
    _checkString: function(p_oObject) {

        return (typeof p_oObject == "string");

    },


    /**
    * @method _checkDOMNode
    * @description Determines if an object is an HTML element.
    * @private
    * @param {Object} p_oObject Object to be evaluated.
    * @return {Boolean}
    */
    _checkDOMNode: function(p_oObject) {

        return (p_oObject && p_oObject.tagName);

    },


    /**
    * @method _createRootNodeStructure
    * @description Creates the core DOM structure for the menu item.
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
    * @method _initSubTree
    * @description Iterates the source element's childNodes collection and uses 
    * the child nodes to instantiate other menus.
    * @private
    */
    _initSubTree: function() {

        var oSrcEl = this.srcElement,
            oConfig = this.cfg;


        if(oSrcEl.childNodes.length > 0) {

            if(
                this.parent.lazyLoad && 
                this.parent.srcElement && 
                this.parent.srcElement.tagName.toUpperCase() == "SELECT"
            ) {

                oConfig.setProperty(
                        "submenu", 
                        { id: Dom.generateId(), itemdata: oSrcEl.childNodes }
                    );

            }
            else {

                var oNode = oSrcEl.firstChild,
                    aOptions = [];
    
                do {
    
                    if(oNode && oNode.tagName) {
    
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
    
    
                var nOptions = aOptions.length;
    
                if(nOptions > 0) {
    
                    var oMenu = new this.SUBMENU_TYPE(Dom.generateId());
                    
                    oConfig.setProperty("submenu", oMenu);
    
                    for(var n=0; n<nOptions; n++) {
        
                        oMenu.addItem((new oMenu.ITEM_TYPE(aOptions[n])));
        
                    }
        
                }
            
            }

        }

    },


    /**
    * @method _preloadImage
    * @description Preloads an image by creating an image element from the 
    * specified path and appending the image to the body of the document.
    * @private
    * @param {String} p_sPath String specifying the path to the image.                
    */
    _preloadImage: function(p_sPath) {

        var sPath = this.imageRoot + p_sPath;

        if(!document.images[sPath]) {

            var oImage = document.createElement("img");
            oImage.src = sPath;
            oImage.name = sPath;
            oImage.id = sPath;
            oImage.style.display = "none";
            
            document.body.appendChild(oImage);

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
    configText: function(p_sType, p_aArgs, p_oItem) {

        var sText = p_aArgs[0];


        if(this._oText) {

            this._oText.nodeValue = sText;

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
    configHelpText: function(p_sType, p_aArgs, p_oItem) {

        var me = this,
            oHelpText = p_aArgs[0],
            oEl = this.element,
            oConfig = this.cfg,
            aNodes = [oEl, this._oAnchor],
            oImg = this.submenuIndicator;


        /**
        * Adds the "hashelptext" class to the necessary nodes and refires the 
        * "selected" and "disabled" configuration events.
        * @private
        */
        function initHelpText() {

            Dom.addClass(aNodes, "hashelptext");

            if(oConfig.getProperty("disabled")) {

                oConfig.refireEvent("disabled");

            }

            if(oConfig.getProperty("selected")) {

                oConfig.refireEvent("selected");

            }                

        }


        /**
        * Removes the "hashelptext" class and corresponding DOM element (EM).
        * @private
        */
        function removeHelpText() {

            Dom.removeClass(aNodes, "hashelptext");

            oEl.removeChild(me._oHelpTextEM);
            me._oHelpTextEM = null;

        }


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
    * @method configURL
    * @description Event handler for when the "url" configuration property of 
    * the menu item changes.
    * @param {String} p_sType String representing the name of the event that 
    * was fired.
    * @param {Array} p_aArgs Array of arguments sent when the event was fired.
    * @param {YAHOO.widget.MenuItem} p_oItem Object representing the menu item
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
    * @method configTarget
    * @description Event handler for when the "target" configuration property 
    * of the menu item changes.  
    * @param {String} p_sType String representing the name of the event that 
    * was fired.
    * @param {Array} p_aArgs Array of arguments sent when the event was fired.
    * @param {YAHOO.widget.MenuItem} p_oItem Object representing the menu item
    * that fired the event.
    */    
    configTarget: function(p_sType, p_aArgs, p_oItem) {

        var sTarget = p_aArgs[0],
            oAnchor = this._oAnchor;

        if(sTarget && sTarget.length > 0) {

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
    configEmphasis: function(p_sType, p_aArgs, p_oItem) {

        var bEmphasis = p_aArgs[0],
            oAnchor = this._oAnchor,
            oText = this._oText,
            oConfig = this.cfg,
            oEM;


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

                if(oEM) {

                    oAnchor.removeChild(oEM);
                    oAnchor.appendChild(oText);

                }

            }

        }

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
    configStrongEmphasis: function(p_sType, p_aArgs, p_oItem) {

        var bStrongEmphasis = p_aArgs[0],
            oAnchor = this._oAnchor,
            oText = this._oText,
            oConfig = this.cfg,
            oStrong;

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

                if(oStrong) {

                    oAnchor.removeChild(oStrong);
                    oAnchor.appendChild(oText);

                }

            }

        }

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
    configChecked: function(p_sType, p_aArgs, p_oItem) {
    
        var bChecked = p_aArgs[0],
            oEl = this.element,
            oConfig = this.cfg,
            oImg;
        

        if(bChecked) {

            this._preloadImage(this.CHECKED_IMAGE_PATH);
            this._preloadImage(this.SELECTED_CHECKED_IMAGE_PATH);
            this._preloadImage(this.DISABLED_CHECKED_IMAGE_PATH);


            oImg = document.createElement("img");
            oImg.src = (this.imageRoot + this.CHECKED_IMAGE_PATH);
            oImg.alt = this.CHECKED_IMAGE_ALT_TEXT;

            var oSubmenu = this.cfg.getProperty("submenu");

            if(oSubmenu) {

                oEl.insertBefore(oImg, oSubmenu.element);

            }
            else {

                oEl.appendChild(oImg);            

            }


            Dom.addClass([oEl, oImg], "checked");

            this._checkImage = oImg;

            if(oConfig.getProperty("disabled")) {

                oConfig.refireEvent("disabled");

            }

            if(oConfig.getProperty("selected")) {

                oConfig.refireEvent("selected");

            }
        
        }
        else {

            oImg = this._checkImage;

            Dom.removeClass([oEl, oImg], "checked");

            if(oImg) {

                oEl.removeChild(oImg);

            }

            this._checkImage = null;
        
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
    configDisabled: function(p_sType, p_aArgs, p_oItem) {

        var bDisabled = p_aArgs[0],
            oAnchor = this._oAnchor,
            aNodes = [this.element, oAnchor],
            oEM = this._oHelpTextEM,
            oConfig = this.cfg,
            oImg,
            sImgSrc,
            sImgAlt;


        if(oEM) {

            aNodes[2] = oEM;

        }


        if(this.cfg.getProperty("checked")) {
    
            sImgAlt = this.CHECKED_IMAGE_ALT_TEXT;
            sImgSrc = this.CHECKED_IMAGE_PATH;
            oImg = this._checkImage;
            
            if(bDisabled) {
    
                sImgAlt = this.DISABLED_CHECKED_IMAGE_ALT_TEXT;
                sImgSrc = this.DISABLED_CHECKED_IMAGE_PATH;
            
            }

            oImg.src = document.images[(this.imageRoot + sImgSrc)].src;
            oImg.alt = sImgAlt;
            
        }    


        oImg = this.submenuIndicator;

        if(bDisabled) {

            if(oConfig.getProperty("selected")) {

                oConfig.setProperty("selected", false);

            }

            oAnchor.removeAttribute("href");

            Dom.addClass(aNodes, "disabled");

            sImgSrc = this.DISABLED_SUBMENU_INDICATOR_IMAGE_PATH;
            sImgAlt = this.DISABLED_SUBMENU_INDICATOR_ALT_TEXT;

        }
        else {

            oAnchor.setAttribute("href", oConfig.getProperty("url"));

            Dom.removeClass(aNodes, "disabled");

            sImgSrc = this.SUBMENU_INDICATOR_IMAGE_PATH;
            sImgAlt = this.COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT;

        }


        if(oImg) {

            oImg.src = this.imageRoot + sImgSrc;
            oImg.alt = sImgAlt;

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
    configSelected: function(p_sType, p_aArgs, p_oItem) {

        if(!this.cfg.getProperty("disabled")) {

            var bSelected = p_aArgs[0],
                oEM = this._oHelpTextEM,
                aNodes = [this.element, this._oAnchor],
                oImg = this.submenuIndicator,
                sImgSrc;


            if(oEM) {
    
                aNodes[aNodes.length] = oEM;  
    
            }
            
            if(oImg) {

                aNodes[aNodes.length] = oImg;  
            
            }
    

            if(this.cfg.getProperty("checked")) {
    
                sImgSrc = this.imageRoot + (bSelected ? 
                    this.SELECTED_CHECKED_IMAGE_PATH : this.CHECKED_IMAGE_PATH);
    
                this._checkImage.src = document.images[sImgSrc].src;
                
            }


            if(bSelected) {
    
                Dom.addClass(aNodes, "selected");
                sImgSrc = this.SELECTED_SUBMENU_INDICATOR_IMAGE_PATH;
    
            }
            else {
    
                Dom.removeClass(aNodes, "selected");
                sImgSrc = this.SUBMENU_INDICATOR_IMAGE_PATH;
    
            }
    
            if(oImg) {
    
                oImg.src = document.images[(this.imageRoot + sImgSrc)].src;

            }

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
    configSubmenu: function(p_sType, p_aArgs, p_oItem) {

        var oEl = this.element,
            oSubmenu = p_aArgs[0],
            oImg = this.submenuIndicator,
            oConfig = this.cfg,
            aNodes = [this.element, this._oAnchor],
            oMenu,
            bLazyLoad = this.parent && this.parent.lazyLoad;


        if(oSubmenu) {

            if(oSubmenu instanceof Menu) {

                oMenu = oSubmenu;
                oMenu.parent = this;
                oMenu.lazyLoad = bLazyLoad;

            }
            else if(
                typeof oSubmenu == "object" && 
                oSubmenu.id && 
                !oSubmenu.nodeType
            ) {

                var sSubmenuId = oSubmenu.id,
                    oSubmenuConfig = oSubmenu;

                oSubmenuConfig.lazyload = bLazyLoad;
                oSubmenuConfig.parent = this;

                oMenu = new this.SUBMENU_TYPE(sSubmenuId, oSubmenuConfig);


                // Set the value of the property to the Menu instance
                
                this.cfg.setProperty("submenu", oMenu, true);

            }
            else {

                oMenu = new this.SUBMENU_TYPE(
                                oSubmenu,
                                { lazyload: bLazyLoad, parent: this }                
                            );


                // Set the value of the property to the Menu instance
                
                this.cfg.setProperty("submenu", oMenu, true);

            }


            if(oMenu) {

                this._oSubmenu = oMenu;


                if(!oImg) { 

                    this._preloadImage(this.SUBMENU_INDICATOR_IMAGE_PATH);
                    this._preloadImage(
                            this.SELECTED_SUBMENU_INDICATOR_IMAGE_PATH
                        );

                    this._preloadImage(
                            this.DISABLED_SUBMENU_INDICATOR_IMAGE_PATH
                        );

                    oImg = document.createElement("img");

                    oImg.src = 
                        (this.imageRoot + this.SUBMENU_INDICATOR_IMAGE_PATH);

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
    * @method initDefaultConfig
	* @description Initializes an item's configurable properties.
	*/
	initDefaultConfig : function() {

        var oConfig = this.cfg,
            CheckBoolean = oConfig.checkBoolean;


        // Define the config properties

        /**
        * @config text
        * @description String specifying the text label for the menu item.  
        * When building a menu from existing HTML the value of this property
        * will be interpreted from the menu's markup.
        * @default ""
        * @type String
        */
        oConfig.addProperty(
            "text", 
            { 
                value: "", 
                handler: this.configText, 
                validator: this._checkString, 
                suppressEvent: true 
            }
        );
        

        /**
        * @config helptext
        * @description String specifying additional instructional text to 
        * accompany the text for the nenu item.
        * @default null
        * @type String|<a href="http://www.w3.org/TR/
        * 2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-58190037">
        * HTMLElement</a>
        */
        oConfig.addProperty("helptext", { handler: this.configHelpText });


        /**
        * @config url
        * @description String specifying the URL for the menu item's anchor's 
        * "href" attribute.  When building a menu from existing HTML the value 
        * of this property will be interpreted from the menu's markup.
        * @default "#"
        * @type String
        */        
        oConfig.addProperty(
            "url", 
            { value: "#", handler: this.configURL, suppressEvent: true }
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
            "target", 
            { handler: this.configTarget, suppressEvent: true }
        );


        /**
        * @config emphasis
        * @description Boolean indicating if the text of the menu item will be 
        * rendered with emphasis.  When building a menu from existing HTML the 
        * value of this property will be interpreted from the menu's markup.
        * @default false
        * @type Boolean
        */
        oConfig.addProperty(
            "emphasis", 
            { 
                value: false, 
                handler: this.configEmphasis, 
                validator: CheckBoolean, 
                suppressEvent: true 
            }
        );


        /**
        * @config strongemphasis
        * @description Boolean indicating if the text of the menu item will be 
        * rendered with strong emphasis.  When building a menu from existing 
        * HTML the value of this property will be interpreted from the
        * menu's markup.
        * @default false
        * @type Boolean
        */
        oConfig.addProperty(
            "strongemphasis",
            {
                value: false,
                handler: this.configStrongEmphasis,
                validator: CheckBoolean,
                suppressEvent: true
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
            "checked", 
            {
                value: false, 
                handler: this.configChecked, 
                validator: this.cfg.checkBoolean, 
                suppressEvent: true,
                supercedes:["disabled"]
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
            "disabled",
            {
                value: false,
                handler: this.configDisabled,
                validator: CheckBoolean,
                suppressEvent: true
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
            "selected",
            {
                value: false,
                handler: this.configSelected,
                validator: CheckBoolean,
                suppressEvent: true
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
        oConfig.addProperty("submenu", { handler: this.configSubmenu });

	},


    /**
    * @method getNextEnabledSibling
    * @description Finds the menu item's next enabled sibling.
    * @return YAHOO.widget.MenuItem
    */
    getNextEnabledSibling: function() {

        if(this.parent instanceof Menu) {

            var nGroupIndex = this.groupIndex;

            /**
            * Finds the next item in an array.
            * @private
            * @param {p_aArray} Array to search.
            * @param {p_nStartIndex} Number indicating the index to 
            * start searching the array.
            * @return {Object}
            */
            function getNextArrayItem(p_aArray, p_nStartIndex) {
    
                return p_aArray[p_nStartIndex] || 
                    getNextArrayItem(p_aArray, (p_nStartIndex+1));
    
            }
    
    
            var aItemGroups = this.parent.getItemGroups(),
                oNextItem;
    
    
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
    
                // Retrieve the first menu item in the next group
    
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
    * @method getPreviousEnabledSibling
    * @description Finds the menu item's previous enabled sibling.
    * @return {YAHOO.widget.MenuItem}
    */
    getPreviousEnabledSibling: function() {

        if(this.parent instanceof Menu) {

            var nGroupIndex = this.groupIndex;

            /**
            * Returns the previous item in an array 
            * @private
            * @param {p_aArray} Array to search.
            * @param {p_nStartIndex} Number indicating the index to 
            * start searching the array.
            * @return {Object}
            */
            function getPreviousArrayItem(p_aArray, p_nStartIndex) {
    
                return p_aArray[p_nStartIndex] || 
                    getPreviousArrayItem(p_aArray, (p_nStartIndex-1));
    
            }


            /**
            * Get the index of the first item in an array 
            * @private
            * @param {p_aArray} Array to search.
            * @param {p_nStartIndex} Number indicating the index to 
            * start searching the array.
            * @return {Object}
            */    
            function getFirstItemIndex(p_aArray, p_nStartIndex) {
    
                return p_aArray[p_nStartIndex] ? 
                    p_nStartIndex : 
                    getFirstItemIndex(p_aArray, (p_nStartIndex+1));
    
            }
    
            var aItemGroups = this.parent.getItemGroups(),
                oPreviousItem;
    
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
    * @method focus
    * @description Causes the menu item to receive the focus and fires the 
    * focus event.
    */
    focus: function() {

        var oParent = this.parent,
            oAnchor = this._oAnchor,
            oActiveItem = oParent.activeItem;


        function setFocus() {

            try {

                oAnchor.focus();

            }
            catch(e) {
            
            }

        }


        if(
            !this.cfg.getProperty("disabled") && 
            oParent && 
            oParent.cfg.getProperty("visible") && 
            this.element.style.display != "none"
        ) {

            if(oActiveItem) {

                oActiveItem.blur();

            }


            /*
                Setting focus via a timer fixes a race condition in Firefox, IE 
                and Opera where the browser viewport jumps as it trys to 
                position and focus the menu.
            */

            window.setTimeout(setFocus, 0);
            
            this.focusEvent.fire();

        }

    },


    /**
    * @method blur
    * @description Causes the menu item to lose focus and fires the 
    * onblur event.
    */    
    blur: function() {

        var oParent = this.parent;

        if(
            !this.cfg.getProperty("disabled") && 
            oParent && 
            Dom.getStyle(oParent.element, "visibility") == "visible"
        ) {

            this._oAnchor.blur();

            this.blurEvent.fire();

        }

    },


	/**
    * @method destroy
	* @description Removes the menu item's <code>&#60;li&#62;</code> element 
	* from its parent <code>&#60;ul&#62;</code> element.
	*/
    destroy: function() {

        var oEl = this.element;

        if(oEl) {


            // If the item has a submenu, destroy it first

            var oSubmenu = this.cfg.getProperty("submenu");

            if(oSubmenu) {
            
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

            var oParentNode = oEl.parentNode;

            if(oParentNode) {

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
    toString: function() {
    
        return ("MenuItem: " + this.cfg.getProperty("text"));
    
    }

};

})();