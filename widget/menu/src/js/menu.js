/*
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
* @class The Menu class allows you to create menus that can overlay other 
* elements on the page.
* @constructor
* @extends YAHOO.widget.Overlay
* @base YAHOO.widget.Overlay
* @param {String/HTMLElement} p_oElement String id or HTMLElement 
* (either HTMLUListElement, HTMLSelectElement or HTMLDivElement) of the 
* source HTMLElement node.
* @param {Object} p_oUserConfig Optional. The configuration object literal containing 
* the configuration that should be set for this Menu. See configuration 
* documentation for more details.
*/
YAHOO.widget.Menu = function(p_oElement, p_oUserConfig) {

	if (arguments.length > 0) {

		YAHOO.widget.Menu.superclass.constructor.call(
            this, 
            p_oElement, 
            p_oUserConfig
        );

	}

}

YAHOO.widget.Menu.prototype = new YAHOO.widget.Overlay();
YAHOO.widget.Menu.prototype.constructor = YAHOO.widget.Menu;
YAHOO.widget.Menu.superclass = YAHOO.widget.Overlay.prototype;


// Constants

/**
* Constant representing the CSS class(es) to be applied to the root 
* HTMLDivElement of the Menu.
* @final
* @type String
*/
YAHOO.widget.Menu.prototype.CSS_CLASS_NAME = "yuimenu";


/**
* Used to identify a Menu instance's type as Menu since looking the constructor 
* property will not be reliable if Menu is subclassed.
* @final  
* @type {Boolean}
*/
YAHOO.widget.Menu.prototype._Menu = true;


// Public properties

/**
* Returns the ordinal position of a Menu instance relative to other 
* Menus inside it's parent Menu instance.
* @type Number
*/
YAHOO.widget.Menu.prototype.index = null;


/**
* Returns the parent Menu or MenuItem instance.
* @type {YAHOO.widget.Menu/YAHOO.widget.MenuItem}
*/
YAHOO.widget.Menu.prototype.parent = null;


/**
* Returns a pointer to the MenuItem instance that has focus.
* @type {YAHOO.widget.MenuItem}
*/
YAHOO.widget.Menu.prototype.activeMenuItem = null;


/**
* Returns the HTMLElement (either HTMLUListElement, HTMLSelectElement or 
* HTMLDivElement) used create the Menu instance.
* @type {HTMLUListElement/HTMLSelectElement/HTMLDivElement}
*/
YAHOO.widget.Menu.prototype.srcElement = null;


// Public methods

/**
* The Menu class's initialization method. This method is automatically called 
* by the constructor, and sets up all DOM references for pre-existing markup, 
* and creates required markup if it is not already present.
* @param {String/HTMLElement} p_oElement String id or HTMLElement 
* (either HTMLUListElement, HTMLSelectElement or HTMLDivElement) of the 
* source HTMLElement node.
* @param {Object} p_oUserConfig The configuration object literal containing 
* the configuration that should be set for this Menu. See configuration 
* documentation for more details.
*/
YAHOO.widget.Menu.prototype.init = function(p_oElement, p_oUserConfig) {

    // Private member variables

    /**
    * Array of MenuItem instances.
    * @private
    * @type {Array}
    */
    var m_aMenuItems = [],


        /**
        * Array of Menu instances.
        * @private
        * @type {Array}
        */
        m_aSubMenus = [],


        /**
        * The HTMLUListElement for each MenuItem's HTMLLIElement node
        * @private
        * @type {HTMLUListElement}
        */
        m_oListElement,


        /**
        * Reference to the Event utility singleton.
        * @private
        * @type {YAHOO.util.Event}
        */
        m_oEventUtil = YAHOO.util.Event,


        /**
        * Reference to the MenuManager singleton.
        * @private
        * @type {YAHOO.widget.MenuManager}
        */
        m_oMenuManager = YAHOO.widget.MenuManager, 


        /**
        * Reference to the Dom utility singleton.
        * @private
        * @type {YAHOO.util.Dom}
        */
        m_oDom = YAHOO.util.Dom,


        /**
        * String representing the user's browser's userAgent string.
        * @private
        * @type {String}
        */
        m_sUserAgent = navigator.userAgent.toLowerCase(),


        /**
        * String representing the user's browser.
        * @private
        * @type {String}
        */
        m_sBrowser = function() {

            var m_sUserAgent = navigator.userAgent.toLowerCase();
            
            if(m_sUserAgent.indexOf("opera") != -1) {

                return "opera";

            }
            else if(m_sUserAgent.indexOf("msie") != -1) {

                return "ie";

            }
            else if(m_sUserAgent.indexOf("safari") != -1) {

                return "safari";

            }
            else if(m_sUserAgent.indexOf("gecko") != -1) {

                return "gecko";

            }
            else {

                return false;

            }

        }(),


        /**
        * Reference to the current context so that private methods have access 
        * to class members
        * @private
        * @type {YAHOO.widget.Menu}
        */
        me = this;


    // Private methods

    /**
    * Determines if an object is a string
    * @private
    * @param {Object} p_oObject The object to be evaluated.
    * @return Returns true if the object is a string.
    * @type Boolean
    */
    var checkString = function(p_oObject) {

        return (typeof p_oObject == "string");

    };


    /**
    * Determines if the value is one of the supported positions.
    * @private
    * @param {Object} p_sPosition The object to be evaluated.
    * @return Returns true if the position is supported.
    * @type Boolean
    */
    var checkPosition = function(p_sPosition) {

        if(checkString(p_sPosition)) {

            var sPosition = p_sPosition.toLowerCase();

            return ("absolute,relative,static".indexOf(sPosition) != -1);

        }

    };


    /**
    * Adds an item to an array.  Used to manage a Menu's collection of  
    * Menu and MenuItem instances.
    * @private
    * @param {Array} p_oArray The array instance to be modified.
    * @param {YAHOO.widget.Menu/YAHOO.widget.MenuItem} p_oItem The Menu or 
    * MenuItem instance to be added.
    * @param {Number} p_nIndex Optional. Index at which the Menu or MenuItem 
    * should be added.
    */
    var addArrayItem = function(p_oArray, p_oItem, p_nIndex) {

        if(typeof p_nIndex == "number") {

            p_oArray.splice(p_nIndex, 0, p_oItem);

            p_oItem.parent = me;


            // Update the index and className properties of each member        
            
            updateArrayItemProperties(p_oArray);

        }
        else {

            var nIndex = p_oArray.length;

            p_oArray[nIndex] = p_oItem;

            p_oItem.index = nIndex;

            p_oItem.parent = me;

            if(nIndex == 0) {

                m_oDom.addClass(p_oItem.element, "first");

            }

        }

    };


    /**
    * Removes an item at the specified index from an array.  Used to manage a 
    * Menu's collection of Menus and MenuItem instances.
    * @private
    * @param {Array} p_oArray The array instance to be modified.
    * @param {Number} p_nIndex  Index at which the Menu or MenuItem should 
    * be removed.
    * @return Returns a reference to the item (Menu or MenuItem instance) 
    * that was removed.
    */    
    var removeArrayItemByIndex = function(p_oArray, p_nIndex) {

        var aArray = p_oArray.splice(p_nIndex, 1);


        // Update the index and className properties of each member        
        
        updateArrayItemProperties(p_oArray);


        // Return a reference to the item that was removed

        return aArray[0];

    };


    /**
    * Removes an item from an array.  Used to manage a Menu's collection of 
    * Menus and MenuItem instances.
    * @private
    * @param {Array} p_oArray The array instance to be modified.
    * @param {YAHOO.widget.Menu/YAHOO.widget.MenuItem} p_oItem The Menu or
    * MenuItem instance to be removed.
    * @return Returns a reference to the item (Menu or MenuItem instance) 
    * that was removed.
    */        
    var removeArrayItemByValue = function(p_oArray, p_oItem) {

        var nIndex = -1,
            i = p_oArray.length-1;

        do {

            if(p_oArray[i] == p_oItem) {

                nIndex = i;
                break;    

            }

        }
        while(i--);

        if(nIndex > -1) {

            return removeArrayItemByIndex(p_oArray, nIndex);

        }      

    };


    /**
    * Updates the index and className properties of Menu and MenuItem instances 
    * that are added and removed from the Menu.  Used to manage a Menu's 
    * collection of submenus and MenuItem instances.
    * @private
    * @param {Array} p_oArray Array of Menu or MenuItem instances.
    */
    var updateArrayItemProperties = function(p_oArray) {

        var i = p_oArray.length-1;


        // Update the index and className properties of each member        

        do {

            p_oArray[i].index = i;

            switch(i) {

                case 0:

                    if(p_oArray[i]._Menu) {

                        p_oArray[i].element.runtimeStyle.behavior = "";

                    }

                    m_oDom.addClass(p_oArray[i].element, "first");

                break;

                default:

                    m_oDom.removeClass(p_oArray[i].element, "first");


                break;

            }

        }
        while(i--);

    };


    /**
    * Iterates the source element's childNodes collection and uses the child 
    * nodes to instantiate Menu and MenuItem instances.
    * @private
    * @param {Array} p_aNodeList Collection of HTML Elements and TextNode 
    * objects that are direct descendants of the Menu's source element.
    */
    var initSubTree = function(p_aNodeList) {
    
        var oNode,
            Menu = YAHOO.widget.Menu,
            MenuItem = YAHOO.widget.MenuItem;
    
        for (var i=0; (oNode = p_aNodeList[i]); i++) {
        
            switch(oNode.tagName) {
    
                case "LI":
                case "OPTGROUP":
                case "OPTION":
                
                    me.addMenuItem(
                        (
                            new MenuItem(
                                oNode, 
                                { 
                                    initsubmenus: 
                                        (me.cfg.getProperty("initsubmenus"))
                                }
                            )
                        )
                    );
    
                break;
    
                case "UL":

                    if(
                        oNode.parentNode && 
                        oNode.parentNode.parentNode && 
                        oNode.parentNode.parentNode.tagName == "DIV" && 
                        m_oDom.hasClass(oNode.parentNode.parentNode, "yuimenu")
                    ) {
    
                        var oLI;
    
                        for (var n=0; (oLI = oNode.childNodes[n]); n++) {
    
                            if(oLI.nodeType == 1) {
    
                                me.addMenuItem(
                                    (
                                        new MenuItem(
                                            oLI,
                                            {
                                                initsubmenus: 
                                                    (
                                                        me.cfg.getProperty(
                                                            "initsubmenus"
                                                        )
                                                    )
                                            }
                                        )
                                    )
                                );
    
                            }
    
                        }
    
                    }
                    else {
    
                        me.addSubMenu(
                            (
                                new Menu(
                                    oNode, 
                                    {
                                        initsubmenus: 
                                            (
                                                me.cfg.getProperty(
                                                    "initsubmenus"
                                                )
                                            )
                                    }
                                )
                            )
                        );
    
                    }
    
                break;
    
                case "DIV":
    
                    if(
                        oNode.parentNode &&
                        oNode.parentNode.tagName == "DIV" &&
                        m_oDom.hasClass(oNode.parentNode, "yuimenu") && 
                        m_oDom.hasClass(oNode, "bd") 
                    ) {

                        return initSubTree(oNode.childNodes);

                    }
                    else {                  

                        me.addSubMenu(
                            (
                                new Menu(
                                    oNode, 
                                    {
                                        initsubmenus: 
                                            (
                                                me.cfg.getProperty(
                                                    "initsubmenus"
                                                )
                                            )
                                    }
                                )
                            )
                        );
    
                    }

                break;
    
            }
        
        }

    };


    // Private DOM event handlers

    /**
    * "mouseover" event handler for the Menu's root HTMLDivElement.
    * @private
    * @param {Event} p_oEvent Event object passed back by the 
    * event utility (YAHOO.util.Event).
    * @param {YAHOO.widget.Menu} p_oMenu The Menu instance corresponding to the 
    * HTMLDivElement that fired the event.
    */
    var onElementMouseOver = function(p_oEvent, p_oMenu) {

        /*
            Because Menus can be embedded in eachother, stop the 
            propagation of the event at each Menu instance to make handling 
            the event easier for the user.
        */

        if(!this.parent || this.parent._MenuItem) {
        
            m_oEventUtil.stopPropagation(p_oEvent);

        }


        /*
            Calculate when the mouse has entered the Menu's root HTMLDivElement 
            to make handling the MouseOver event easier for the user.
        */

        var oRelatedTarget = m_oEventUtil.getRelatedTarget(p_oEvent),
            oNode = oRelatedTarget,
            bElementMouseOver = true;
    
    
        if(oNode) {
    
            do {
    
                if(oNode == this.element) {
    
                    bElementMouseOver = false;
                    break;
    
                }
    
                oNode = oNode.parentNode;
    
            }
            while(oNode);
    
        }
    
    
        if(bElementMouseOver) {
    
            this.mouseOverEvent.fire(p_oEvent);
    
        }
    
    };


    /**
    * "mouseout" event handler for the Menu's root HTMLDivElement.
    * @private
    * @param {Event} p_oEvent Event object passed back by the 
    * event utility (YAHOO.util.Event).
    * @param {YAHOO.widget.Menu} p_oMenu The Menu instance corresponding to the 
    * HTMLDivElement that fired the event.
    */
    var onElementMouseOut = function(p_oEvent, p_oMenu) {

        /*
            Because Menus can be embedded in eachother, stop the 
            propagation of the event at each Menu instance to make handling 
            the event easier for the user.
        */

        if(!this.parent || this.parent._MenuItem) {
        
            m_oEventUtil.stopPropagation(p_oEvent);

        }


        /*
            Calculate when the mouse has left the Menu's root HTMLDivElement 
            to make handling the MouseOver event easier for the user.
        */

        var oRelatedTarget = m_oEventUtil.getRelatedTarget(p_oEvent),
            oNode = oRelatedTarget,
            bElementMouseOut = true;
    
    
        if(oNode) {
    
            do {
    
                if(oNode == this.element) {
    
                    bElementMouseOut = false;
                    break;
    
                }
    
                oNode = oNode.parentNode;
    
            }
            while(oNode);
    
        }
    
    
        if(bElementMouseOut) {
    
            this.mouseOutEvent.fire(p_oEvent);
    
        }
    
    };


    /**
    * "mousedown" event handler for the Menu's root HTMLDivElement.
    * @private
    * @param {Event} p_oEvent Event object passed back by the 
    * event utility (YAHOO.util.Event).
    * @param {YAHOO.widget.Menu} p_oMenu The Menu instance corresponding to the 
    * HTMLDivElement that fired the event.
    */
    var onElementMouseDown = function(p_oEvent, p_oMenu) {

        /*
            Because Menus can be embedded in eachother, stop the 
            propagation of the event at each Menu instance to make handling 
            the event easier for the user.
        */

        if(!this.parent || this.parent._MenuItem) {

            m_oEventUtil.stopPropagation(p_oEvent);

        }

        this.mouseDownEvent.fire(p_oEvent);

        return true;

    };


    /**
    * "mouseup" event handler for the Menu's root HTMLDivElement.
    * @private
    * @param {Event} p_oEvent Event object passed back by the 
    * event utility (YAHOO.util.Event).
    * @param {YAHOO.widget.Menu} p_oMenu The Menu instance corresponding to the 
    * HTMLDivElement that fired the event.
    */    
    var onElementMouseUp = function(p_oEvent, p_oMenu) {

        /*
            Because Menus can be embedded in eachother, stop the 
            propagation of the event at each Menu instance to make handling 
            the event easier for the user.
        */

        if(!this.parent || this.parent._MenuItem) {
        
            m_oEventUtil.stopPropagation(p_oEvent);

        }

        this.mouseUpEvent.fire(p_oEvent);

        return true;

    };


    /**
    * "click" Event handler for the Menu's root HTMLDivElement.
    * @private
    * @param {Event} p_oEvent Event object passed back by the 
    * event utility (YAHOO.util.Event).
    * @param {YAHOO.widget.Menu} p_oMenu The Menu instance corresponding to the 
    * HTMLDivElement that fired the event.
    */         
    var onElementClick = function(p_oEvent, p_oMenu) {

        var oTarget = m_oEventUtil.getTarget(p_oEvent, true);

        if(
            (!this.parent || this.parent._MenuItem) && 
            oTarget.tagName != "A"
        ) {
        
            m_oEventUtil.stopPropagation(p_oEvent);

        }

        this.clickEvent.fire(p_oEvent);

        return true;
    
    };


    // Private CustomEvent handlers

    /**
    * "focus" YAHOO.util.CustomEvent handler for the Menu's
    * MenuItem instance(s).
    * @private
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the event 
    * was fired.
    * @param {YAHOO.widget.MenuItem} p_oMenuItem The MenuItem instance
    * that fired the event.
    */
    var onMenuItemFocus = function(p_sType, p_aArguments, p_oMenuItem) {

        if(me.parent && me.parent._Menu) {

            me.parent.activeMenuItem = p_oMenuItem;
            m_oMenuManager.activeMenu = me.parent;
        
        }
        else {

            me.activeMenuItem = p_oMenuItem;
            m_oMenuManager.activeMenu = me;

        }    

    };


    /**
    * "blur" YAHOO.util.CustomEvent handler for the Menu's
    * MenuItem instance(s).
    * @private
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the event 
    * was fired.
    * @param {YAHOO.widget.MenuItem} p_oMenuItem The MenuItem instance 
    * that fired the event.
    */
    var onMenuItemBlur = function(p_sType, p_aArguments, p_oMenuItem) {

        var oSubMenu = p_oMenuItem.cfg.getProperty("submenu");

        if(!oSubMenu || (oSubMenu && !oSubMenu.cfg.getProperty("visible"))) {

            if(me.parent && me.parent._Menu) {
    
                me.parent.activeMenuItem = null;
                m_oMenuManager.activeMenu = null;
            
            }
            else {
    
                me.activeMenuItem = null;
                m_oMenuManager.activeMenu = null;
    
            }            

        }

    };


    /**
    * "configchange" YAHOO.util.CustomEvent handler for the Menu's 
    * MenuItem instance(s).
    * @private
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.Menu} p_oMenu The parent Menu instance for the 
    * MenuItem that fired the event.
    */
    var onMenuItemConfigChange = function(p_sType, p_aArguments, p_oMenuItem) {

        var sProperty = p_aArguments[0][0];

        switch(sProperty) {

            case "text":
            case "helptext":

                me.cfg.refireEvent("width");

            break;

        }

    };


    // Privileged methods

    /**
    * Appends the specified MenuItem instance to a Menu instance.
    * @param {YAHOO.widget.MenuItem} p_oMenuItem MenuItem instance to be added.
    * @param {Number} p_nIndex Optional. Number indicating the ordinal position 
    * at which the MenuItem should be added.
    */
    this.addMenuItem = function(p_oMenuItem, p_nIndex) {

        if(p_oMenuItem && p_oMenuItem._MenuItem) {

            p_oMenuItem.focusEvent.subscribe(onMenuItemFocus, p_oMenuItem);
            p_oMenuItem.blurEvent.subscribe(onMenuItemBlur, p_oMenuItem);

            p_oMenuItem.cfg.configChangedEvent.subscribe(
                onMenuItemConfigChange,
                p_oMenuItem
            );

            addArrayItem(m_aMenuItems, p_oMenuItem, p_nIndex);

        }

    };


    /**
    * Removes the specified MenuItem instance from a Menu instance.
    * @param {YAHOO.widget.MenuItem/Number} p_oObject MenuItem or index of the
    * MenuItem instance to be removed.
    * @return Returns the MenuItem that was removed from the Menu.
    * @type YAHOO.widget.MenuItem
    */
    this.removeMenuItem = function(p_oObject) {

        if(typeof p_oObject != "undefined") {

            var oMenuItem;

            if(p_oObject._MenuItem) {

                oMenuItem = 
                    removeArrayItemByValue(m_aMenuItems, p_oObject);           

            }
            else if(typeof p_oObject == "number") {

                oMenuItem = 
                    removeArrayItemByIndex(m_aMenuItems, p_oObject);

            }

            if(oMenuItem) {

                oMenuItem.destroy();

                return oMenuItem;

            }

        }

    };


    /**
    * Returns an array of MenuItem instances.
    * @return Returns an array of MenuItem instances.
    * @type Array
    */        
    this.getMenuItems = function() {

        return m_aMenuItems;

    };


    /**
    * Removes the specified MenuItem instance from a Menu instance.
    * @param {Number} p_nIndex Number indicating the ordinal position of the 
    * Menu instance to be retrieved.
    * @return Returns the MenuItem at the specified index.
    * @type YAHOO.widget.MenuItem
    */
    this.getMenuItem = function(p_nIndex) {

        if(typeof p_nIndex == "number") {

            return m_aMenuItems[p_nIndex];

        }

    };


    /**
    * Appends the specified Menu instance as a submenu of a Menu instance.
    * @param {YAHOO.widget.MenuItem} p_oMenu Menu instance to be added.
    * @param {Number} p_nIndex Optional. Number indicating the ordinal
    * position at which the Menu should be added.
    */
    this.addSubMenu = function(p_oMenu, p_nIndex) {

        if(
            p_oMenu && 
            p_oMenu._Menu && 
            (
                (!this.parent || (this.parent && this.parent._MenuItem)) &&
                (p_oMenu.getSubMenus().length == 0)
            )
        ) {

            p_oMenu.cfg.setProperty("iframe", false);

            addArrayItem(m_aSubMenus, p_oMenu, p_nIndex);

            this.cfg.refireEvent("constraintoviewport");

        }

    };


    /**
    * Removes the specified Menu instance from a Menu instance.
    * @param {YAHOO.widget.Menu/Number} p_oObject Menu instance or index of
    * the Menu instance to be removed.
    * @return Returns the Menu that was removed from the Menu.
    * @type YAHOO.widget.Menu
    */        
    this.removeSubMenu = function(p_oObject) {

        if(typeof p_oObject != "undefined") {

            var oMenu;

            if(p_oObject._Menu) {

                oMenu = removeArrayItemByValue(m_aSubMenus, p_oObject);

            }
            else if(typeof p_oObject == "number") {

                oMenu = removeArrayItemByIndex(m_aSubMenus, p_oObject);

            }

            if(oMenu) {

                oMenu.destroy();

                return oMenu;

            }

        }

    };


    /**
    * Returns an array of Menu instances.
    * @return Returns an array of Menu instances.
    * @type Array
    */        
    this.getSubMenus = function() {

        return m_aSubMenus;

    };


    /**
    * Removes the specified Menu instance from a Menu instance.
    * @param {Number} p_nIndex Number indicating the ordinal position of the
    * Menu instance to be retrieved.
    * @return Returns the Menu at the specified index.
    * @type YAHOO.widget.Menu
    */
    this.getSubMenu = function(p_nIndex) {

        if(typeof p_nIndex == "number") {

            return m_aSubMenus[p_nIndex];

        }

    };


    /**
    * Iterates the Menu's collection of MenuItem instances and renders them.
    */
    this.renderMenuItems = function() {
    
        if(m_aMenuItems.length > 0) {            
    
            var nMenuItems = m_aMenuItems.length;

            for(var i=0; i<nMenuItems; i++) {

                m_oListElement.appendChild(m_aMenuItems[i].element);
    
            }


            if(m_sBrowser == "opera") {

                var oUL = m_oListElement.cloneNode(true),
                    oDIV = document.createElement("div"),
                    oBody = oDIV.cloneNode(false);
    
                oDIV.className = this.CSS_CLASS_NAME;
                oBody.className = "bd";
    
                oBody.appendChild(oUL);
                oDIV.appendChild(oBody);
                    
                document.body.appendChild(oDIV);
    
                var sWidth = oUL.offsetWidth + "px";
                m_oListElement.style.width = sWidth;
    
                document.body.removeChild(oDIV);

            }


            var i = m_aMenuItems.length - 1, 
                oSubMenu;

            do {

                oSubMenu = m_aMenuItems[i].cfg.getProperty("submenu");

                if(oSubMenu) {

                    oSubMenu.render(m_aMenuItems[i].element);

                }
    
            }
            while(i--);
    
        }
    
    };


    /**
    * Iterates the Menu's collection of Menu instances and renders them.
    */
    this.renderSubMenus = function() {
    
        if(m_aSubMenus.length > 0) {
    
            var nSubMenus = m_aSubMenus.length;

            for(var i=0; i<nSubMenus; i++) {

                this.appendToBody(m_aSubMenus[i].element);

                m_aSubMenus[i].render(this.body);

            }
    
        }
    
    };


	/**
	* Renders the Menu by inserting the elements that are not already in the 
    * main Module format into their correct places. Optionally appends the 
    * Menu to the specified node prior to the render's execution.
	* @param {String/HTMLElement} p_bAppendToNode The element or element id to 
    * that the Module should be appended to prior to rendering.
    * @param {Boolean} p_bHideSourceElement Boolean indicating if the source
    * element should be hidden rather than destroyed. Default is false.
    * @see YAHOO.widget.Module#render
	*/    
    this.render = function(p_bAppendToNode, p_bHideSourceElement) {

        m_oDom.addClass(this.element, this.CSS_CLASS_NAME);


        /*
            If the menu contains MenuItem instances, create the list element 
            (UL) and append it to the body of the module
        */        

        if(m_aMenuItems.length > 0 && !m_oListElement) {
        
            var oUL = document.createElement("ul");
       
            this.setBody(oUL);

            m_oListElement = oUL;

        }


        /*
            Determine whether to hide or destory the source element
        */ 

        if(this.srcElement && this.srcElement.tagName != "DIV") {

            if(p_bHideSourceElement) {
    
                this.srcElement.style.display = "none";
    
            }
            else {

                var oParentNode = this.srcElement.parentNode;
                oParentNode.removeChild(this.srcElement);
    
            }

        }

        this.renderMenuItems();

        this.renderSubMenus();


        // Continue with the superclass implementation of this method

        YAHOO.widget.Menu.superclass.render.call(this, p_bAppendToNode);
    
    };


	/**
	* Keeps the Menu in the viewport.
    * @see YAHOO.widget.Overlay#enforceConstraints
	*/
    this.enforceConstraints = function(type, args, obj) {
    
        var pos = args[0];
        
        var x = pos[0];
        var y = pos[1];
    
        var offsetHeight = this.element.offsetHeight;
        var offsetWidth = this.element.offsetWidth;
    
        var viewPortWidth = YAHOO.util.Dom.getClientWidth();
        var viewPortHeight = YAHOO.util.Dom.getClientHeight();
    
        var scrollX = window.scrollX || document.body.scrollLeft;
        var scrollY = window.scrollY || document.body.scrollTop;
    
        var topConstraint = scrollY;
        var leftConstraint = scrollX;
        var bottomConstraint = scrollY + viewPortHeight - offsetHeight;
        var rightConstraint = scrollX + viewPortWidth - offsetWidth;

        var bSubMenu = (this.parent && this.parent._MenuItem);

        if (x < 10) {

            x = leftConstraint;

        } else if ((x + offsetWidth) > viewPortWidth) {

            if(
                bSubMenu && 
                ((x-this.parent.element.offsetWidth) > offsetWidth)
            ) {
    
                x = (x - (this.parent.element.offsetWidth + offsetWidth));
    
            }
            else {

                x = rightConstraint;

            }

        }

        if (y < 10) {

            y = topConstraint;

        } else if (y > bottomConstraint) {

            if(bSubMenu && (y > offsetHeight)) {

                y = ((y + this.parent.element.offsetHeight) - offsetHeight);

            }
            else {

                y = bottomConstraint;

            }

        }
 
        this.cfg.setProperty("x", x, true);
        this.cfg.setProperty("y", y, true);
    
    };


	/**
	* Initializes the custom events for Menu which are fired automatically
    * at appropriate times by the Menu class.
    * @see YAHOO.widget.Overlay#initDefaultConfig
	*/
    this.initDefaultConfig = function() {

    	YAHOO.widget.Menu.superclass.initDefaultConfig.call(this);

        this.cfg.addProperty("initsubmenus", true);

        this.cfg.addProperty(
            "position", 
            "absolute", 
            this.configPosition, 
            checkPosition, 
            this.element
        );

    };


    // Event handlers for configuration properties


	/**
	* Event handler for when the "position" configuration property of a
    * Menu changes.
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the event 
    * was fired.
    * @param {YAHOO.widget.Menu} p_oMenu The Menu instance fired the event.
    * @see YAHOO.widget.Overlay#configIframe
	*/
    this.configPosition = function(p_sType, p_aArguments, p_oMenu) {

        var sPosition = p_aArguments[0];

        if(sPosition) {

            m_oDom.setStyle(this.element, "position", sPosition);

        }

    };


	/**
	* Event handler for when the "iframe" configuration property of a
    * Menu changes.
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the event 
    * was fired.
    * @param {YAHOO.widget.Menu} p_oMenu The Menu instance fired the event.
    * @see YAHOO.widget.Overlay#configIframe
	*/
    this.configIframe = function(p_sType, p_aArguments, p_oMenu) {

        YAHOO.widget.Menu.superclass.configIframe.call(
            this, 
            p_sType, 
            p_aArguments, 
            p_oMenu
        );

        var sPosition = m_oDom.getStyle(this.element, "position");

		if(this.iframe && (sPosition == "static" || sPosition == "relative")) {

			this.iframe.style.display = "none";

		}

    };


	/**
	* Event handler for when the "constraintoviewport" configuration
    * property of a Menu changes. 
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the event 
    * was fired.
    * @param {YAHOO.widget.Menu} p_oMenu The Menu instance fired the event.
    * @see YAHOO.widget.Overlay#configVisible
	*/
    this.configConstrainToViewport = function(p_sType, p_aArguments, p_oMenu) {

        var bConstrainToViewport = p_aArguments[0];

        if(bConstrainToViewport) {

            this.beforeMoveEvent.subscribe(
                this.enforceConstraints, 
                this, 
                true
            );

        } else {

            this.beforeMoveEvent.unsubscribe(this.enforceConstraints, this);

        }

        if(m_aMenuItems.length > 0) {

            var i = m_aMenuItems.length - 1,
                oSubMenu;
    
            do {

                oSubMenu = m_aMenuItems[i].cfg.getProperty("submenu");

                if(oSubMenu) {

                    oSubMenu.cfg.setProperty(
                        "constraintoviewport", 
                        bConstrainToViewport
                    );

                }

            }
            while(i--);

        }

        if(m_aSubMenus.length > 0) {

            var i = m_aSubMenus.length - 1;
    
            do {

                m_aSubMenus[i].cfg.setProperty(
                    "constraintoviewport", 
                    bConstrainToViewport
                );

            }
            while(i--);

        }

    };


	/**
	* Event handler for when the "width" configuration property of a
    * Menu changes. 
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the event 
    * was fired.
    * @param {YAHOO.widget.Menu} p_oMenu The Menu instance fired the event.
    * @see YAHOO.widget.Overlay#configWidth
	*/
    this.configWidth = function(p_sType, p_aArguments, p_oMenu) {

        if(this.parent && !this.parent._Menu) {

            // Reset the width of the object
            m_oDom.setStyle(this.element, "width", "auto");

            var oMenuElementClone = this.element.cloneNode(true);
            document.body.appendChild(oMenuElementClone);
    
            var nBorderWidth = 
                parseInt(
                    m_oDom.getStyle(oMenuElementClone, "borderLeftWidth"), 
                    10
                );

            nBorderWidth += 
                parseInt(
                    m_oDom.getStyle(oMenuElementClone, "borderRightWidth"), 
                    10
                );

            var nPadding = 
                parseInt(
                    m_oDom.getStyle(oMenuElementClone, "paddingLeft"), 
                    10
                );

            nPadding += 
                parseInt(
                    m_oDom.getStyle(oMenuElementClone, "paddingRight"), 
                    10
                );
    

            var nWidth = oMenuElementClone.offsetWidth;

            if(
                document.compatMode && 
                document.compatMode == "CSS1Compat"
            ) {

                nWidth = nWidth - (nBorderWidth + nPadding);

            }

            var sWidth = nWidth + "px";

            document.body.removeChild(oMenuElementClone);

            p_aArguments[0] = sWidth;

        }
        else {

            p_aArguments[0] = m_oDom.getStyle(this.element, "width");

        }

        // Continue with the superclass implementation of this method

        YAHOO.widget.Menu.superclass.configWidth.call(
            this, 
            p_sType, 
            p_aArguments, 
            p_oMenu
        );

    };


	/**
	* Event handler for when the "visible" configuration property of a
    * Menu changes. 
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the event 
    * was fired.
    * @param {YAHOO.widget.Menu} p_oMenu The Menu instance fired the event.
    * @see YAHOO.widget.Overlay#configVisible
	*/
    this.configVisible = function(p_sType, p_aArguments, p_oMenu) {
   
        var bVisible = p_aArguments[0];

        if (bVisible) {

            this.cfg.refireEvent("width");

            // Continue with the superclass implementation of this method
    
            YAHOO.widget.Menu.superclass.configVisible.call(
                this, 
                p_sType, 
                p_aArguments, 
                p_oMenu
            );

    
        } else {
    
            // Continue with the superclass implementation of this method
    
            YAHOO.widget.Menu.superclass.configVisible.call(
                this, 
                p_sType, 
                p_aArguments, 
                p_oMenu
            );

    
            var oActiveMenuItem;
        
            if(this.parent && this.parent._Menu) {
        
                oActiveMenuItem = this.parent.activeMenuItem;
            
            }
            else {
            
                oActiveMenuItem = this.activeMenuItem;
            
            }
            
            if(oActiveMenuItem) {
        
                if(oActiveMenuItem.cfg.getProperty("selected")) {
        
                    oActiveMenuItem.cfg.setProperty("selected", false)
        
                }
        
                var oSubMenu = oActiveMenuItem.cfg.getProperty("submenu");
        
                if(oSubMenu && oSubMenu.cfg.getProperty("visible")) {
        
                    oSubMenu.hide();
        
                }
        
            }
    
        }
    
    };


    // Begin constructor logic

    var oElement;


    if(typeof p_oElement == "string") {

        oElement = document.getElementById(p_oElement);

    }
    else if(p_oElement.tagName) {

        oElement = p_oElement;

    }


    if(oElement) {

        switch(oElement.tagName) {
    
            case "DIV":

                if(m_oDom.hasClass(oElement, "yuimenu")) {

                    this.srcElement = oElement;
   
                    if(!oElement.id) {

                        oElement.id = m_oMenuManager.createMenuId();

                    }
 
    
                    /* 
                        Note that we don't pass the user config in here yet 
                        because we only want it executed once, at the lowest 
                        subclass level.
                    */ 
                
                    YAHOO.widget.Menu.superclass.init.call(this, oElement.id); 
    
    
                    // Get the list node (UL) if it exists
    
                    if(
                        this.body.firstChild && 
                        this.body.firstChild.nodeType == 1 && 
                        this.body.firstChild.tagName == "UL"
                    ) {
    
                        m_oListElement = this.body.firstChild;
    
                    }
                    else if(
                        this.body.childNodes[1] && 
                        this.body.childNodes[1].nodeType == 1 &&
                        this.body.childNodes[1].tagName == "UL"
                    ) {
    
                        m_oListElement = this.body.childNodes[1];
    
                    }

                    var sPosition = m_oDom.getStyle(this.element, "position");

                    this.cfg.setProperty("position", sPosition, true);

                }
    
            break;
    
            case "UL":
            case "SELECT":
    
                this.srcElement = oElement;
    
    
                /*
                    The source element is not something that we can use 
                    outright, so we need to create a new Overlay
                */
    
                var sId = m_oMenuManager.createMenuId();
    
    
                /* 
                    Note that we don't pass the user config in here yet 
                    because we only want it executed once, at the lowest 
                    subclass level.
                */ 
            
                YAHOO.widget.Menu.superclass.init.call(this, sId); 
    
            break;
    
        }

    }
    else {

        /* 
            Note that we don't pass the user config in here yet 
            because we only want it executed once, at the lowest 
            subclass level.
        */ 
    
        YAHOO.widget.Menu.superclass.init.call(this, p_oElement);

    }

    if(this.element) {

        // Assign DOM event handlers

        m_oEventUtil.addListener(
            this.element, 
            "mouseover", 
            onElementMouseOver, 
            this,
            true
        );

        m_oEventUtil.addListener(
            this.element, 
            "mouseout", 
            onElementMouseOut, 
            this,
            true
        );

        m_oEventUtil.addListener(
            this.element, 
            "mousedown", 
            onElementMouseDown, 
            this,
            true
        );

        m_oEventUtil.addListener(
            this.element, 
            "mouseup", 
            onElementMouseUp, 
            this,
            true
        );

        m_oEventUtil.addListener(
            this.element, 
            "click", 
            onElementClick, 
            this,
            true
        );


        // Create custom events

        var CustomEvent = YAHOO.util.CustomEvent;


        /**
        * Fires when the mouse has entered a Menu instance.  Passes back the 
        * DOM Event object as an argument.
        * @type {YAHOO.util.CustomEvent}
        * @see YAHOO.util.CustomEvent
        */
        this.mouseOverEvent = new CustomEvent("mouseOverEvent", this);


        /**
        * Fires when the mouse has left a Menu instance.  Passes back the DOM 
        * Event object as an argument.
        * @type {YAHOO.util.CustomEvent}
        * @see YAHOO.util.CustomEvent
        */
        this.mouseOutEvent = new CustomEvent("mouseOutEvent", this);


        /**
        * Fires when the user clicks the on a Menu instance.  Passes back the 
        * DOM Event object as an argument.
        * @type {YAHOO.util.CustomEvent}
        * @see YAHOO.util.CustomEvent
        */
        this.mouseDownEvent = new CustomEvent("mouseDownEvent", this);


        /**
        * Fires when the user releases a mouse button while the mouse is over 
        * a Menu instance.  Passes back the DOM Event object as an argument.
        * @type {YAHOO.util.CustomEvent}
        * @see YAHOO.util.CustomEvent
        */
        this.mouseUpEvent = new CustomEvent("mouseUpEvent", this);


        /**
        * Fires when the user clicks the on a Menu instance.  Passes back the 
        * DOM Event object as an argument.
        * @type {YAHOO.util.CustomEvent}
        * @see YAHOO.util.CustomEvent
        */
        this.clickEvent = new CustomEvent("clickEvent", this);


        m_oMenuManager.addMenu(this);

        if(p_oUserConfig) {
    
            this.cfg.applyConfig(p_oUserConfig);
    
        }

        if(this.srcElement) {

            initSubTree(this.srcElement.childNodes);

        }

    }

};