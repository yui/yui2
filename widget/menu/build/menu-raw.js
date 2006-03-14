/*
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
* @class The MenuManager is a singleton class that helps manage every Menu
* instance that is created.
* @constructor
*/
YAHOO.widget.MenuManager = function() {

    /**
    * Collection of Menu instances.
    * @private
    * @type {Object}
    */
    var m_oMenus = {},

        /**
        * Collection of visible Menu instances.
        * @private
        * @type {Object}
        */
        m_oVisibleMenus = {},


        /**
        * Number of Menu ids that have been generated.
        * @private
        * @type {Number}
        */
        m_nMenuIds = 0,


        /**
        * The base prefix for all generated menu ids.
        * @private
        * @type {String}
        */
        m_sMenuIdBase = "yuimenu";


    /**
    * Returns the currently active Menu.  A Menu instance becomes active 
    * when one of it's MenuItem instances recieves focus.
    * @member YAHOO.widget.MenuManager
    * @type {YAHOO.widget.Menu}
    */
    this.activeMenu = null;


    /**
    * Reference to the current context so that private methods have access 
    * to class members
    * @private
    * @type {YAHOO.widget.MenuManager}
    */
    var me = this;


    // Private methods

    /**
    * Adds an item to a collection.  Used to manage a the collection of  
    * Menu and visible Menu instances.
    * @private
    * @param {Object} p_oCollection The object instance to be modified.
    * @param {YAHOO.widget.Menu} p_oItem The Menu instance to be added.
    */
    function addItem(p_oCollection, p_oItem) {

          p_oCollection[p_oItem.id] = p_oItem;

    }


    /**
    * Removes an item from a collection.  Used to manage a the collection of  
    * Menu and visible Menu instances.
    * @private
    * @param {Object} p_oCollection The object instance to be modified.
    * @param {String/YAHOO.widget.Menu} p_oValue String id of or object
    * reference for the Menu instance to be removed.
    */
    function removeItem(p_oCollection, p_oValue) {

        if(p_oValue) {

            if(p_oValue._Menu) {

                oItem = removeItemByValue(p_oCollection, p_oValue);

            }

            if(typeof p_oValue == "string") {

                oItem = removeItemByKey(p_oCollection, p_oValue);

            }

            if(oItem && oItem === me.activeMenu) {

                me.activeMenu = null;

            }

        }        

    }


    /**
    * Removes an item from a collection.  Used to manage a the collection of  
    * Menu and visible Menu instances.
    * @private
    * @param {Object} p_oCollection The object instance to be modified.
    * @param {String} p_sElementId String id of the Menu to be removed.
    */
    function removeItemByKey(p_oCollection, p_sElementId) {

        var oItem = null;
        
        if(p_oCollection[p_sElementId]) {

            oItem = p_oCollection[p_sElementId];
            delete p_oCollection[p_sElementId];

        }

        return oItem;

    }


    /**
    * Removes an item from a collection.  Used to manage a the collection of  
    * Menu and visible Menu instances.
    * @private
    * @param {Object} p_oCollection The object instance to be modified.
    * @param {YAHOO.widget.Menu} p_oItem Object reference for the Menu
    * instance to be removed.
    */
    function removeItemByValue(p_oCollection, p_oItem) {

        var oItem = null;

        for(var i in p_oCollection) {

            if(p_oCollection[i] == p_oItem) {

                oItem = p_oCollection[i];
                delete p_oCollection[i];
                break;

            }

        }

        return oItem;

    }


    // Private CustomEvent event handlers

    /**
    * "show" YAHOO.util.CustomEvent handler for each Menu instance.
    * @private
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.Menu} p_oMenu The Menu that fired the event.
    */
    function onMenuShow(p_sType, p_aArguments, p_oMenu) {

        if(p_oMenu) {

            addItem(m_oVisibleMenus, p_oMenu);
            
        }

    }


    /**
    * "hide" YAHOO.util.CustomEvent handler for each Menu instance.
    * @private
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.Menu} p_oMenu The Menu that fired the event.
    */
    function onMenuHide(p_sType, p_aArguments, p_oMenu) {

        removeItem(m_oVisibleMenus, p_oMenu);

    }

    /**
    * "configvisible" YAHOO.util.CustomEvent handler for the Menu's "visible" 
    * configuration property.
    * @private
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.Menu} p_oMenu The Menu instance that fired the event.
    */
    function onMenuConfigVisible(p_sType, p_aArguments, p_oMenu) {

        var bVisible = p_aArguments[0];

        if(bVisible) {

            addItem(m_oVisibleMenus, p_oMenu);

        }
        else {

            removeItem(m_oVisibleMenus, p_oMenu);

        }

    }


    return {

        /**
        * Generates a unique id for a Menu instance.
        * @return Returns a new id
        * @type {String}
        */
        createMenuId: function() {

            var sMenuId = (m_sMenuIdBase + (m_nMenuIds++));

            return sMenuId;

        },


        /**
        * Registers a Menu instance.
        * @param {YAHOO.widget.Menu} p_oMenu The Menu instance to be added.
        */
        addMenu: function(p_oMenu) {

            if(p_oMenu) {

                addItem(m_oMenus, p_oMenu);

                p_oMenu.showEvent.subscribe(onMenuShow, p_oMenu);
                p_oMenu.hideEvent.subscribe(onMenuHide, p_oMenu);

                p_oMenu.cfg.subscribeToConfigEvent(
                    "visible", 
                    onMenuConfigVisible, 
                    p_oMenu
                );

            }

        },


        /**
        * Removes the Menu from the known list of Menu and visible
        * Menu instances.
        * @param {String/YAHOO.widget.Menu} p_oValue String id of or object
        * reference for the Menu instance to be removed.
        */
        removeMenu: function(p_oValue) {

            removeItem(m_oMenus, p_oValue);
            removeItem(m_oVisibleMenus, p_oValue);

        },


        /**
        * Hides all visible Menu instances.
        */
        hideVisibleMenus: function() {

            for(var i in m_oVisibleMenus) {

                m_oVisibleMenus[i].hide();

            }

            m_oVisibleMenus = {};

        },


        /**
        * Returns a collection of all of the registered Menu instances.
        * @return Returns a collection Menu instances.
        * @type Object
        */
        getMenus: function() {

            return m_oMenus;

        },


        /**
        * Returns the Menu instance with the specified id.
        * @return Returns a Menu instance.
        * @type YAHOO.widget.Menu
        */
        getMenu: function(p_sElementId) {

            if(p_sElementId && m_oMenus[p_sElementId]) {

                return m_oMenus[p_sElementId];

            }

        },


        /**
        * Returns a collection of all of the visible Menu instances.
        * @return Returns a collection Menu instances.
        * @type Object
        */
        getVisibleMenus: function() {

            return m_oVisibleMenus;

        }

    };

} ();


/**
* @class The Menu class allows you to create menus that can overlay other 
* elements on the page.
* @constructor
* @extends YAHOO.widget.Overlay
* @base YAHOO.widget.Overlay
* @param {String/HTMLElement} p_oElement String id or HTMLElement 
* (either HTMLUListElement, HTMLSelectElement or HTMLDivElement) of the 
* source HTMLElement node.
* @param {Object} p_oUserConfig Optional. The configuration object literal 
* containing the configuration that should be set for this Menu. See 
* configuration documentation for more details.
*/
YAHOO.widget.Menu = function(p_oElement, p_oUserConfig) {

	if (arguments.length > 0) {

		YAHOO.widget.Menu.superclass.constructor.call(
            this, 
            p_oElement, 
            p_oUserConfig
        );

	}

};

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

    /**
    * Constant representing the type of Menu to instantiate when creating 
    * submenu instances.
    * @final
    * @type YAHOO.widget.Menu
    */
    this.SUBMENU_TYPE = YAHOO.widget.Menu;
    
    /**
    * Constant representing the type of Menu to instantiate when creating 
    * MenuItem instances.
    * @final
    * @type YAHOO.widget.MenuItem
    */
    this.MENUITEM_TYPE = YAHOO.widget.MenuItem;


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
        m_aSubmenus = [],


        /**
        * The HTMLUListElement for each MenuItem's HTMLLIElement node
        * @private
        * @type {HTMLUListElement}
        */
        m_oListElement,


        /**
        * The HTMLLIElement node that is currently the target of a DOM event
        * @private
        * @type {HTMLLIElement}
        */
        m_oCurrentMenuItemLI,


        /**
        * The HTMLDIVElement node that is currently the target of a DOM event
        * @private
        * @type {HTMLDIVElement}
        */
        m_oCurrentMenuDIV,


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
        * Reference to the MenuItem instance that has focus.
        * @type {YAHOO.widget.MenuItem}
        */
        m_oActiveMenuItem,

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
    function checkString(p_oObject) {

        return (typeof p_oObject == "string");

    }


    /**
    * Determines if the value is one of the supported positions.
    * @private
    * @param {Object} p_sPosition The object to be evaluated.
    * @return Returns true if the position is supported.
    * @type Boolean
    */
    function checkPosition(p_sPosition) {

        if(checkString(p_sPosition)) {

            var sPosition = p_sPosition.toLowerCase();

            return ("absolute,relative,static".indexOf(sPosition) != -1);

        }

    }


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
    function addArrayItem(p_oArray, p_oItem, p_nIndex) {

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

            p_oItem.element.setAttribute("index", nIndex);

            p_oItem.parent = me;

            if(nIndex === 0) {

                m_oDom.addClass(p_oItem.element, "first");

            }

        }

    }


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
    function removeArrayItemByIndex(p_oArray, p_nIndex) {

        var aArray = p_oArray.splice(p_nIndex, 1);


        // Update the index and className properties of each member        
        
        updateArrayItemProperties(p_oArray);


        // Return a reference to the item that was removed

        return aArray[0];

    }


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
    function removeArrayItemByValue(p_oArray, p_oItem) {

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

    }


    /**
    * Updates the index and className properties of Menu and MenuItem instances 
    * that are added and removed from the Menu.  Used to manage a Menu's 
    * collection of submenus and MenuItem instances.
    * @private
    * @param {Array} p_oArray Array of Menu or MenuItem instances.
    */
    function updateArrayItemProperties(p_oArray) {

        var i = p_oArray.length-1;


        // Update the index and className properties of each member        

        do {

            p_oArray[i].index = i;

            p_oArray[i].element.setAttribute("index", i);

            switch(i) {

                case 0:

                    m_oDom.addClass(p_oArray[i].element, "first");

                break;

                default:

                    m_oDom.removeClass(p_oArray[i].element, "first");

                break;

            }

        }
        while(i--);

    }


    /**
    * Iterates the source element's childNodes collection and uses the child 
    * nodes to instantiate Menu and MenuItem instances.
    * @private
    * @param {Array} p_aNodeList Collection of HTML Elements and TextNode 
    * objects that are direct descendants of the Menu's source element.
    */
    function initSubTree(p_aNodeList) {
    
        var oNode,
            Menu = me.SUBMENU_TYPE,
            MenuItem = me.MENUITEM_TYPE;
    
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
    
                        me.addSubmenu(
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

                        me.addSubmenu(
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

    }


    // Private DOM event handlers

    /**
    * "mouseover" event handler for the Menu's root HTMLDivElement.
    * @private
    * @param {Event} p_oEvent Event object passed back by the 
    * event utility (YAHOO.util.Event).
    * @param {YAHOO.widget.Menu} p_oMenu The Menu instance corresponding to the 
    * HTMLDivElement that fired the event.
    */
    function onElementMouseOver(p_oEvent, p_oMenu) {

        /*
            Because Menus can be embedded in eachother, stop the 
            propagation of the event at each Menu instance to make handling 
            the event easier for the user.
        */

        if(!me.parent || me.parent._MenuItem) {
            
            m_oEventUtil.stopPropagation(p_oEvent);

        }


        /*
            Calculate when the mouse has entered the Menu's root HTMLDivElement 
            to make handling the MouseOver event easier for the user.
        */

        var oTarget = m_oEventUtil.getTarget(p_oEvent, true);

        if(!m_oCurrentMenuDIV && oTarget == this.element) {

            m_oCurrentMenuDIV = this.element;

            // Fire the associated custom event

            me.mouseOverEvent.fire(p_oEvent);

        }
    
        if(!m_oCurrentMenuItemLI) {

            var oNode = oTarget;
        
            do {

                if(
                    oNode && 
                    oNode.tagName == "LI" && 
                    oNode.parentNode.parentNode.parentNode == me.element
                ) {

                    m_oCurrentMenuItemLI = oNode;

                    var nIndex = parseInt(oNode.getAttribute("index"), 10),
                        oMenuItem = m_aMenuItems[nIndex];
        
                    if(oMenuItem && !oMenuItem.cfg.getProperty("disabled")) {
    
                        // Fire the associated custom event
    
                        oMenuItem.mouseDownEvent.fire(p_oEvent);

                        var oActiveMenuItem = 
                                oMenuItem.parent.getActiveMenuItem();
                    
                        if(oActiveMenuItem && oActiveMenuItem != oMenuItem) {
                
                            if(oActiveMenuItem.cfg.getProperty("selected")) {
                
                                oActiveMenuItem.cfg.setProperty(
                                    "selected", 
                                    false
                                );
                    
                            }
                    
                            var oSubmenu = 
                                    oActiveMenuItem.cfg.getProperty("submenu");
                    
                            if(oSubmenu) {
                    
                                oSubmenu.hide();
                    
                            }
                
                        }
                
                        oMenuItem.cfg.setProperty("selected", true);
                
                        oMenuItem.focus();

                        onMenuItemLIMouseOver(oMenuItem);
    
                    }

                    break;

                }

                oNode = oNode.parentNode;
    
            }
            while(oNode);

        }
    
    }


    /**
    * "mouseout" event handler for the Menu's root HTMLDivElement.
    * @private
    * @param {Event} p_oEvent Event object passed back by the 
    * event utility (YAHOO.util.Event).
    * @param {YAHOO.widget.Menu} p_oMenu The Menu instance corresponding to the 
    * HTMLDivElement that fired the event.
    */
    function onElementMouseOut(p_oEvent, p_oMenu) {

        /*
            Because Menus can be embedded in eachother, stop the 
            propagation of the event at each Menu instance to make handling 
            the event easier for the user.
        */

        if(!me.parent || me.parent._MenuItem) {
            
            m_oEventUtil.stopPropagation(p_oEvent);

        }

        var oRelatedTarget = m_oEventUtil.getRelatedTarget(p_oEvent),
            bLIMouseOut = true,
            bDIVMouseOut = true;
            
        if((m_oCurrentMenuItemLI || m_oCurrentMenuDIV)  && oRelatedTarget) {
    
            var oNode = oRelatedTarget;
        
            do {
    
                if(
                    oNode == m_oCurrentMenuItemLI && 
                    oNode.parentNode.parentNode.parentNode == me.element
                ) {
    
                    bLIMouseOut = false;
    
                }
    
                if(oNode == m_oCurrentMenuDIV) {
    
                    bDIVMouseOut = false;
                    break;
                }
    
                oNode = oNode.parentNode;
    
            }
            while(oNode);
    
        }        
    
        if(m_oCurrentMenuItemLI && bLIMouseOut) {

            var nIndex = 
                    parseInt(m_oCurrentMenuItemLI.getAttribute("index"), 10),
                oMenuItem = m_aMenuItems[nIndex];

            if(oMenuItem && !oMenuItem.cfg.getProperty("disabled")) {

                // Fire the associated custom event

                oMenuItem.mouseOutEvent.fire(p_oEvent);

                oMenuItem.cfg.setProperty("selected", false);

                onMenuItemLIMouseOut(oMenuItem);

            }

            m_oCurrentMenuItemLI = null;
    
        }
    
        if(m_oCurrentMenuDIV && bDIVMouseOut) {

            // Fire the associated custom event
    
            me.mouseOutEvent.fire(p_oEvent);

            m_oCurrentMenuDIV = null;
    
        }
    
    }


    /**
    * "mousedown" event handler for the Menu's root HTMLDivElement.
    * @private
    * @param {Event} p_oEvent Event object passed back by the 
    * event utility (YAHOO.util.Event).
    * @param {YAHOO.widget.Menu} p_oMenu The Menu instance corresponding to the 
    * HTMLDivElement that fired the event.
    */
    function onElementMouseDown(p_oEvent, p_oMenu) {

        /*
            Because Menus can be embedded in eachother, stop the 
            propagation of the event at each Menu instance to make handling 
            the event easier for the user.
        */

        if(!me.parent || me.parent._MenuItem) {
            
            m_oEventUtil.stopPropagation(p_oEvent);

        }


        /*
            Check if the target was a DOM element that is a part of a 
            MenuItem instance and (if so), fire the associated custom event.
        */    

        var oTarget = m_oEventUtil.getTarget(p_oEvent, true),
            oNode = oTarget;
    
        do {

            if(
                oNode && 
                oNode.tagName == "LI" && 
                oNode.parentNode.parentNode.parentNode == me.element
            ) {

                var nIndex = parseInt(oNode.getAttribute("index"), 10),
                    oMenuItem = m_aMenuItems[nIndex];
    
                if(oMenuItem && !oMenuItem.cfg.getProperty("disabled")) {

                    // Fire the associated custom event

                    oMenuItem.mouseDownEvent.fire(p_oEvent);

                }

                break;

            }

            oNode = oNode.parentNode;

        }
        while(oNode);


        // Fire the associated custom event

        me.mouseDownEvent.fire(p_oEvent);

    }


    /**
    * "mouseup" event handler for the Menu's root HTMLDivElement.
    * @private
    * @param {Event} p_oEvent Event object passed back by the 
    * event utility (YAHOO.util.Event).
    * @param {YAHOO.widget.Menu} p_oMenu The Menu instance corresponding to the 
    * HTMLDivElement that fired the event.
    */    
    function onElementMouseUp(p_oEvent, p_oMenu) {

        /*
            Because Menus can be embedded in eachother, stop the 
            propagation of the event at each Menu instance to make handling 
            the event easier for the user.
        */

        if(!me.parent || me.parent._MenuItem) {
            
            m_oEventUtil.stopPropagation(p_oEvent);

        }


        /*
            Check if the target was a DOM element that is a part of a 
            MenuItem instance and (if so), fire the associated custom event.
        */    

        var oTarget = m_oEventUtil.getTarget(p_oEvent, true),
            oNode = oTarget;
    
        do {

            if(
                oNode && 
                oNode.tagName == "LI" && 
                oNode.parentNode.parentNode.parentNode == me.element
            ) {

                var nIndex = parseInt(oNode.getAttribute("index"), 10),
                    oMenuItem = m_aMenuItems[nIndex];
    
                if(oMenuItem && !oMenuItem.cfg.getProperty("disabled")) {

                    // Fire the associated custom event

                    oMenuItem.mouseUpEvent.fire(p_oEvent);

                }

                break;

            }

            oNode = oNode.parentNode;

        }
        while(oNode);


        // Fire the associated custom event

        me.mouseUpEvent.fire(p_oEvent);

    }


    /**
    * "click" Event handler for the Menu's root HTMLDivElement.
    * @private
    * @param {Event} p_oEvent Event object passed back by the 
    * event utility (YAHOO.util.Event).
    * @param {YAHOO.widget.Menu} p_oMenu The Menu instance corresponding to the 
    * HTMLDivElement that fired the event.
    */         
    function onElementClick(p_oEvent, p_oMenu) {

        /*
            Because Menus can be embedded in eachother, stop the 
            propagation of the event at each Menu instance to make handling 
            the event easier for the user.
        */

        var oTarget = m_oEventUtil.getTarget(p_oEvent, true);

        if(
            (!this.parent || this.parent._MenuItem) && 
            (
                oTarget.tagName != "A" || 
                (oTarget.tagName == "A" && oTarget.getAttribute("href") == "#")
            )            
        ) {

            /*
                Don't stop propagation of the event for anchors so that Safari
                can follow the URL
            */

            m_oEventUtil.stopPropagation(p_oEvent);

        }


        /*
            Check if the target was a DOM element that is a part of a 
            MenuItem instance and (if so), fire the associated custom event.
        */

        var oNode = oTarget;
    
        do {

            if(
                oNode && 
                oNode.tagName == "LI" && 
                oNode.parentNode.parentNode.parentNode == me.element
            ) {

                var nIndex = parseInt(oNode.getAttribute("index"), 10),
                    oMenuItem = m_aMenuItems[nIndex];
    
                if(oMenuItem && !oMenuItem.cfg.getProperty("disabled")) {

                    // Fire the associated custom event

                    oMenuItem.clickEvent.fire(p_oEvent);    


                    var sURL = oMenuItem.cfg.getProperty("url");


                    if(oTarget.tagName == "A") {

                        if(sURL && sURL != "#") {

                            // Needed to tell Safari to follow the link                        

                            return true;
            
                        }
                        else {

                            // Prevent the browser from following the link
            
                            m_oEventUtil.preventDefault(p_oEvent);
                        
                            // Needed to tell Safari to NOT follow the link

                            return false;
            
                        }                

                    }
                    else {

                        var oSubmenu = oMenuItem.cfg.getProperty("submenu");
    
                        if(oTarget == oMenuItem.subMenuIndicator && oSubmenu) {
            
                            if(oSubmenu.cfg.getProperty("visible")) {
                
                                oMenuItem.hideSubmenu();
                
                                oMenuItem.focus();
                
                            }
                            else {
                
                                oMenuItem.cfg.setProperty("selected", true);
                                
                                oMenuItem.showSubmenu();
                
                                oSubmenu.setInitialSelection();
                                oSubmenu.setInitialFocus();
                
                            }                
            
                        }
                        else if(sURL && sURL != "#") {
                            
                            document.location = sURL;

                        }

                    }

                }

                break;

            }

            oNode = oNode.parentNode;

        }
        while(oNode);


        // Fire the associated custom event

        me.clickEvent.fire(p_oEvent);
    
    }
    

    /**
    * "keydown" Event handler for the Menu's root HTMLDivElement.
    * @private
    * @param {Event} p_oEvent Event object passed back by the 
    * event utility (YAHOO.util.Event).
    * @param {YAHOO.widget.Menu} p_oMenu The Menu instance corresponding to the 
    * HTMLDivElement that fired the event.
    */         
    function onElementKeyDown(p_oEvent, p_oMenu) {

        /*
            Because Menus can be embedded in eachother, stop the 
            propagation of the event at each Menu instance to make handling 
            the event easier for the user.
        */

        if(!me.parent || me.parent._MenuItem) {

            m_oEventUtil.stopPropagation(p_oEvent);

        }


        /*
            Check if the target was a DOM element that is a part of a 
            MenuItem instance and (if so), fire the associated custom event.
        */

        var oTarget = m_oEventUtil.getTarget(p_oEvent, true);

        if(
            oTarget.tagName == "A" && 
            oTarget.parentNode.parentNode.parentNode.parentNode == me.element
        ) {

            var nIndex = parseInt(oTarget.parentNode.getAttribute("index"), 10),
                oMenuItem = m_aMenuItems[nIndex];
    
            if(oMenuItem && !oMenuItem.cfg.getProperty("disabled")) {
    
                // Fire the associated custom event

                oMenuItem.keyDownEvent.fire(p_oEvent);
    
                onMenuItemAnchorKeyDown(p_oEvent, oMenuItem);
    
            }

        }


        // Fire the associated custom event

        me.keyDownEvent.fire(p_oEvent);
    
    }


    /**
    * "keyup" Event handler for the Menu's root HTMLDivElement.
    * @private
    * @param {Event} p_oEvent Event object passed back by the 
    * event utility (YAHOO.util.Event).
    * @param {YAHOO.widget.Menu} p_oMenu The Menu instance corresponding to the 
    * HTMLDivElement that fired the event.
    */         
    function onElementKeyUp(p_oEvent, p_oMenu) {

        /*
            Because Menus can be embedded in eachother, stop the 
            propagation of the event at each Menu instance to make handling 
            the event easier for the user.
        */

        if(!me.parent || me.parent._MenuItem) {

            m_oEventUtil.stopPropagation(p_oEvent);

        }


        /*
            Check if the target was a DOM element that is a part of a 
            MenuItem instance and (if so), fire the associated custom event.
        */

        var oTarget = m_oEventUtil.getTarget(p_oEvent, true);

        if(
            oTarget.tagName == "A" && 
            oTarget.parentNode.parentNode.parentNode.parentNode == me.element
        ) {

            var nIndex = parseInt(oTarget.parentNode.getAttribute("index"), 10),
                oMenuItem = m_aMenuItems[nIndex];
    
            if(oMenuItem && !oMenuItem.cfg.getProperty("disabled")) {

                // Fire the associated custom event

                oMenuItem.keyUpEvent.fire(p_oEvent);

            }

        }


        // Fire the associated custom event

        me.keyUpEvent.fire(p_oEvent);
    
    }


    /**
    * "keypress" Event handler for the Menu's root HTMLDivElement.
    * @private
    * @param {Event} p_oEvent Event object passed back by the 
    * event utility (YAHOO.util.Event).
    * @param {YAHOO.widget.Menu} p_oMenu The Menu instance corresponding to the 
    * HTMLDivElement that fired the event.
    */         
    function onElementKeyPress(p_oEvent, p_oMenu) {

        /*
            Because Menus can be embedded in eachother, stop the 
            propagation of the event at each Menu instance to make handling 
            the event easier for the user.
        */

        if(!me.parent || me.parent._MenuItem) {

            m_oEventUtil.stopPropagation(p_oEvent);

        }


        /*
            Check if the target was a DOM element that is a part of a 
            MenuItem instance and (if so), fire the associated custom event.
        */

        var oTarget = m_oEventUtil.getTarget(p_oEvent, true);

        if(
            oTarget.tagName == "A" && 
            oTarget.parentNode.parentNode.parentNode.parentNode == me.element
        ) {

            var nIndex = parseInt(oTarget.parentNode.getAttribute("index"), 10),
                oMenuItem = m_aMenuItems[nIndex];
    
            if(oMenuItem && !oMenuItem.cfg.getProperty("disabled")) {

                // Fire the associated custom event
    
                oMenuItem.keyPressEvent.fire(p_oEvent);
    
            }

        }


        // Fire the associated custom event

        me.keyPressEvent.fire(p_oEvent);
    
    }


    /**
    * "mouseover" Event handler for a MenuItem's root HTMLLIElement.
    * @private
    * @param {YAHOO.widget.Menu} p_oMenuItem The MenuItem instance 
    * corresponding to the HTMLLIElement that fired the event.
    */ 
    function onMenuItemLIMouseOver(p_oMenuItem) {

        var oSubmenu = p_oMenuItem.cfg.getProperty("submenu");

        if(oSubmenu) {

            p_oMenuItem.showSubmenu();

        }
    
    }
    

    /**
    * "mouseout" Event handler for a MenuItem's root HTMLLIElement.
    * @private
    * @param {YAHOO.widget.Menu} p_oMenuItem The MenuItem instance 
    * corresponding to the HTMLLIElement that fired the event.
    */ 
    function onMenuItemLIMouseOut(p_oMenuItem) {

        var oSubmenu = p_oMenuItem.cfg.getProperty("submenu");
            
        if(oSubmenu) {

            oSubmenu.hide();

        }
    
    }


    /**
    * "keydown" Event handler for a MenuItem's HTMLAnchorElement.
    * @private
    * @param {Event} p_oEvent Event object passed back by the 
    * event utility (YAHOO.util.Event).
    * @param {YAHOO.widget.Menu} p_oMenuItem The MenuItem instance 
    * corresponding to the HTMLAnchorElement that fired the event.
    */ 
    function onMenuItemAnchorKeyDown(p_oEvent, p_oMenuItem) {
    
        switch(p_oEvent.keyCode) {

            case 38:    // Up arrow
    
                var oActiveMenuItem = p_oMenuItem.parent.getActiveMenuItem();

                if(
                    p_oMenuItem == oActiveMenuItem && 
                    !p_oMenuItem.cfg.getProperty("selected")
                ) {

                    p_oMenuItem.cfg.setProperty("selected", true);

                }
                else {

                    var oNextMenuItem = p_oMenuItem.getPreviousEnabledSibling();

                    if(oNextMenuItem) {

                        var oSubmenu = p_oMenuItem.cfg.getProperty("submenu");
                
                        if(oSubmenu) {
                
                            oSubmenu.hide();
                
                        }

                        p_oMenuItem.cfg.setProperty("selected", false);

                        oNextMenuItem.cfg.setProperty("selected", true);
            
                        oNextMenuItem.focus();
        
                    }

                }

            break;

            
            case 9:     // Tab
            case 40:    // Down arrow

                var oActiveMenuItem = p_oMenuItem.parent.getActiveMenuItem();

                if(
                    p_oMenuItem == oActiveMenuItem && 
                    !p_oMenuItem.cfg.getProperty("selected")
                ) {

                    p_oMenuItem.cfg.setProperty("selected", true);

                }
                else {

                    var oNextMenuItem;
    
                    if(p_oEvent.shiftKey) {

                        oNextMenuItem = 
                            p_oMenuItem.getPreviousEnabledSibling();

                    }
                    else {

                        oNextMenuItem = 
                            p_oMenuItem.getNextEnabledSibling();

                    }
            
                    if(oNextMenuItem) {

                        var oSubmenu = p_oMenuItem.cfg.getProperty("submenu");
                
                        if(oSubmenu) {
                
                            oSubmenu.hide();
                
                        }

                        p_oMenuItem.cfg.setProperty("selected", false);

                        oNextMenuItem.cfg.setProperty("selected", true);
            
                        oNextMenuItem.focus();
        
                    }

                }

            break;
            

            case 39:    // Right arrow

                var oSubmenu = p_oMenuItem.cfg.getProperty("submenu");

                if(oSubmenu) {

                    p_oMenuItem.showSubmenu();

                    oSubmenu.setInitialSelection();
                    oSubmenu.setInitialFocus();

                }

            break;
            

            case 37:    // Left arrow
            case 27:    // Esc key
    
                var oParentMenu = p_oMenuItem.parent;

                if(oParentMenu.parent && oParentMenu.parent._Menu) {

                    oParentMenu = oParentMenu.parent;

                }

                if(oParentMenu.cfg.getProperty("position") == "absolute") {

                    oParentMenu.hide();

                }

                var oMenuItem = oParentMenu.parent;

                if(oMenuItem) {

                    oMenuItem.focus();

                }

            break;

        }

    }


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
    function onMenuItemFocus(p_sType, p_aArguments, p_oMenuItem) {

        me.setActiveMenuItem(p_oMenuItem);

    }


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
    function onMenuItemBlur(p_sType, p_aArguments, p_oMenuItem) {

        var oSubmenu = p_oMenuItem.cfg.getProperty("submenu");

        if(!oSubmenu || (oSubmenu && !oSubmenu.cfg.getProperty("visible"))) {

            me.setActiveMenuItem(null);

        }

    }


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
    function onMenuItemConfigChange(p_sType, p_aArguments, p_oMenuItem) {

        var sProperty = p_aArguments[0][0];

        switch(sProperty) {

            case "text":
            case "helptext":

                me.cfg.refireEvent("width");

            break;

        }

    }


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
    this.addSubmenu = function(p_oMenu, p_nIndex) {

        if(
            p_oMenu && 
            p_oMenu._Menu && 
            (
                (!this.parent || (this.parent && this.parent._MenuItem)) &&
                (p_oMenu.getSubmenus().length === 0)
            )
        ) {

            m_oDom.addClass(p_oMenu.element, "yuimenuddmenu");

            p_oMenu.cfg.setProperty("iframe", false);

            addArrayItem(m_aSubmenus, p_oMenu, p_nIndex);

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
    this.removeSubmenu = function(p_oObject) {

        if(typeof p_oObject != "undefined") {

            var oMenu;

            if(p_oObject._Menu) {

                oMenu = removeArrayItemByValue(m_aSubmenus, p_oObject);

            }
            else if(typeof p_oObject == "number") {

                oMenu = removeArrayItemByIndex(m_aSubmenus, p_oObject);

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
    this.getSubmenus = function() {

        return m_aSubmenus;

    };


    /**
    * Removes the specified Menu instance from a Menu instance.
    * @param {Number} p_nIndex Number indicating the ordinal position of the
    * Menu instance to be retrieved.
    * @return Returns the Menu at the specified index.
    * @type YAHOO.widget.Menu
    */
    this.getSubmenu = function(p_nIndex) {

        if(typeof p_nIndex == "number") {

            return m_aSubmenus[p_nIndex];

        }

    };


    /**
    * Iterates the Menu's collection of MenuItem instances and renders them.
    */
    this.renderMenuItems = function() {
    
        if(m_aMenuItems.length > 0) {            
    
            var nMenuItems = m_aMenuItems.length,
                i=0;

            do {

                m_oListElement.appendChild(m_aMenuItems[i].element);
                i++;

            }
            while(i<nMenuItems);


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


            i = m_aMenuItems.length - 1;
            var oSubmenu;

            do {

                oSubmenu = m_aMenuItems[i].cfg.getProperty("submenu");

                if(oSubmenu) {

                    oSubmenu.render(m_aMenuItems[i].element);

                }
    
            }
            while(i--);
    
        }
    
    };


    /**
    * Iterates the Menu's collection of Menu instances and renders them.
    */
    this.renderSubmenus = function() {
    
        if(m_aSubmenus.length > 0) {
    
            var nSubmenus = m_aSubmenus.length;

            for(var i=0; i<nSubmenus; i++) {

                this.appendToBody(m_aSubmenus[i].element);

                m_aSubmenus[i].render(this.body);

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
            Determine whether to hide or destroy the source element
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

        this.renderSubmenus();


        // Continue with the superclass implementation of this method

        YAHOO.widget.Menu.superclass.render.call(this, p_bAppendToNode);
    
    };


	/**
	* Removes the Menu instance's element from the DOM and sets all child 
    * elements to null.
	*/
	this.destroy = function() {

        // Remove DOM event handlers

        m_oEventUtil.addListener(this.element, "mouseover", onElementMouseOver);
        m_oEventUtil.addListener(this.element, "mouseout", onElementMouseOut);
        m_oEventUtil.addListener(this.element, "mousedown", onElementMouseDown);
        m_oEventUtil.addListener(this.element, "mouseup", onElementMouseUp);
        m_oEventUtil.addListener(this.element, "click", onElementClick);
        m_oEventUtil.addListener(this.element, "keydown", onElementKeyDown);
        m_oEventUtil.addListener(this.element, "keyup", onElementKeyUp);
        m_oEventUtil.addListener(this.element, "keypress", onElementKeyPress);


        // Remove CustomEvent listeners

        this.mouseOverEvent.unsubscribeAll();
        this.mouseOutEvent.unsubscribeAll();
        this.mouseDownEvent.unsubscribeAll();
        this.mouseUpEvent.unsubscribeAll();
        this.clickEvent.unsubscribeAll();
        this.keyPressEvent.unsubscribeAll();
        this.keyDownEvent.unsubscribeAll();
        this.keyUpEvent.unsubscribeAll();
        this.beforeMoveEvent.unsubscribeAll();


        // Remove all MenuItem instances

        if(m_aMenuItems.length > 0) {

            var i = m_aMenuItems.length - 1;
    
            do {
    
                m_aMenuItems[i].destroy();
    
            }
            while(i--);

        }        


        // Remove all Submenu instances

        if(m_aSubmenus.length > 0) {

            var i = m_aSubmenus.length - 1;
    
            do {
    
                m_aSubmenus[i].destroy();
    
            }
            while(i--);

        }


        // Continue with the superclass implementation of this method

        YAHOO.widget.Menu.superclass.destroy.call(this);

	};


	/**
	* Keeps the Menu in the viewport.
    * @see YAHOO.widget.Overlay#enforceConstraints
	*/
    this.enforceConstraints = function(type, args, obj) {

        var pos = args[0];
    
        var bod = document.getElementsByTagName('body')[0];
        var htm = document.getElementsByTagName('html')[0];
        
        var bodyOverflow = YAHOO.util.Dom.getStyle(bod, "overflow");
        var htmOverflow = YAHOO.util.Dom.getStyle(htm, "overflow");
    
        var x = pos[0];
        var y = pos[1];
    
        var offsetHeight = this.element.offsetHeight;
        var offsetWidth = this.element.offsetWidth;
    
        var viewPortWidth = YAHOO.util.Dom.getClientWidth();
        var viewPortHeight = YAHOO.util.Dom.getClientHeight();
    
        var scrollX = window.scrollX || document.body.scrollLeft;
        var scrollY = window.scrollY || document.body.scrollTop;
    
        var topConstraint = scrollY + 10;
        var leftConstraint = scrollX + 10;
        var bottomConstraint = scrollY + viewPortHeight - offsetHeight - 10;
        var rightConstraint = scrollX + viewPortWidth - offsetWidth - 10;


        var bSubmenu = (this.parent && this.parent._MenuItem);

        if (x < 10) {

            x = leftConstraint;

        } else if ((x + offsetWidth) > viewPortWidth) {

            if(
                bSubmenu && 
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

            if(bSubmenu && (y > offsetHeight)) {

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


    /**
    * Sets focus to a Menu instance's first enabled MenuItem instance.
    */
    this.setInitialFocus = function() {

        var oMenuItem;

        if(this.getSubmenus().length > 0) {

            oMenuItem = this.getSubmenu(0).getMenuItem(0);

        }
        else {

            oMenuItem = this.getMenuItem(0);

        }

        if(oMenuItem) {

            if(oMenuItem.cfg.getProperty("disabled")) {

                oMenuItem = oMenuItem.getNextEnabledSibling();

            }

            oMenuItem.focus();

        }        

    };


    /**
    * Sets the "selected" configuration property of a Menu instance's first
    * enabled MenuItem instance to "true."
    */
    this.setInitialSelection = function() {

        var oMenuItem;

        if(this.getSubmenus().length > 0) {

            oMenuItem = this.getSubmenu(0).getMenuItem(0);

        }
        else {

            oMenuItem = this.getMenuItem(0);

        }

        if(oMenuItem) {

            if(oMenuItem.cfg.getProperty("disabled")) {

                oMenuItem = oMenuItem.getNextEnabledSibling();

            }

            oMenuItem.cfg.setProperty("selected", true);

        }        

    };


    /**
    * Sets the specified MenuItem instance as a Menu instance's active
    * MenuItem instance
    * @param {YAHOO.widget.MenuItem} p_oMenuItem A MenuItem instance
    */
    this.setActiveMenuItem = function(p_oMenuItem) {

        if(this.parent && this.parent._Menu) {

            this.parent.setActiveMenuItem(p_oMenuItem);
       
        }
        else {

            if(p_oMenuItem && p_oMenuItem._MenuItem) {
        
                m_oActiveMenuItem = p_oMenuItem;
                m_oMenuManager.activeMenu = this;

            }
            else {

                m_oActiveMenuItem = null;
                m_oMenuManager.activeMenu = null;

            }
        
        }

    };


    /**
    * Returns the MenuItem instance that has focus.
    * @return Returns a MenuItem instance.
    * @type YAHOO.widget.MenuItem
    */
    this.getActiveMenuItem = function() {

        if(this.parent && this.parent._Menu) {

            return this.parent.getActiveMenuItem();
        
        }
        else {
        
            return m_oActiveMenuItem;
        
        }

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
                oSubmenu;
    
            do {

                oSubmenu = m_aMenuItems[i].cfg.getProperty("submenu");

                if(oSubmenu) {

                    oSubmenu.cfg.setProperty(
                        "constraintoviewport", 
                        bConstrainToViewport
                    );

                }

            }
            while(i--);

        }

        if(m_aSubmenus.length > 0) {

            var n = m_aSubmenus.length - 1;
    
            do {

                m_aSubmenus[n].cfg.setProperty(
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

    
            var oActiveMenuItem = this.getActiveMenuItem();
            
            if(oActiveMenuItem) {
        
                if(oActiveMenuItem.cfg.getProperty("selected")) {
        
                    oActiveMenuItem.cfg.setProperty("selected", false);
        
                }
        
                var oSubmenu = oActiveMenuItem.cfg.getProperty("submenu");
        
                if(oSubmenu && oSubmenu.cfg.getProperty("visible")) {
        
                    oSubmenu.hide();
        
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

        m_oDom.addClass(this.element, this.CSS_CLASS_NAME);


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

        m_oEventUtil.addListener(
            this.element, 
            "keydown", 
            onElementKeyDown, 
            this,
            true
        );

        m_oEventUtil.addListener(
            this.element, 
            "keyup", 
            onElementKeyUp, 
            this,
            true
        );

        m_oEventUtil.addListener(
            this.element, 
            "keypress", 
            onElementKeyPress, 
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


        /**
        * Fires when the user presses an alphanumeric key.  Passes back the 
        * DOM Event object as an argument.
        * @type {YAHOO.util.CustomEvent}
        * @see YAHOO.util.CustomEvent
        */
        this.keyPressEvent = new CustomEvent("keyPressEvent", this);


        /**
        * Fires when the user presses a key.  Passes back the DOM Event 
        * object as an argument.
        * @type {YAHOO.util.CustomEvent}
        * @see YAHOO.util.CustomEvent
        */
        this.keyDownEvent = new CustomEvent("keyDownEvent", this);


        /**
        * Fires when the user releases a key.  Passes back the DOM Event 
        * object as an argument.
        * @type {YAHOO.util.CustomEvent}
        * @see YAHOO.util.CustomEvent
        */
        this.keyUpEvent = new CustomEvent("keyUpEvent", this);


        m_oMenuManager.addMenu(this);

        if(p_oUserConfig) {
    
            this.cfg.applyConfig(p_oUserConfig);
    
        }

        if(this.srcElement) {

            initSubTree(this.srcElement.childNodes);

        }

    }

};


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
    * Used to identify a MenuItem instance's type as MenuItem since checking the 
    * constructor property will not be reliable if MenuItem is subclassed.
    * @final  
    * @type {Boolean}
    */
    _MenuItem: true,


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

        /**
        * Constant representing the type of Menu to instantiate when creating 
        * submenu instances.
        * @final
        * @type YAHOO.widget.Menu
        */
        this.SUBMENU_TYPE = YAHOO.widget.Menu;
        
        /**
        * Constant representing the type of Menu to instantiate when creating 
        * MenuItem instances.
        * @final
        * @type YAHOO.widget.MenuItem
        */
        this.MENUITEM_TYPE = YAHOO.widget.MenuItem;


        // Private member variables

        /**
        * Reference to the HTMLAnchorElement of the MenuItem's core internal
        * DOM structure.
        * @private
        * @type {HTMLAnchorElement}
        */
        var m_oAnchor = null,

            /**
            * Reference to the Text node of the MenuItem's core internal
            * DOM structure.
            * @private
            * @type {Text}
            */
            m_oText = null,


            /**
            * Reference to the HTMLElement (<EM>) used to create the optional
            * help text for a MenuItem instance.
            * @private
            * @type {HTMLElement}
            */
            m_oHelpTextEM = null,


            /**
            * Reference to the submenu for a MenuItem instance.
            * @private
            * @type {YAHOO.widget.Menu}
            */
            m_oSubmenu = null,


            /**
            * Reference to the Dom utility singleton.
            * @private
            * @type {YAHOO.util.Dom}
            */
            m_oDom = YAHOO.util.Dom,


            /**
            * Reference to the Event utility singleton.
            * @private
            * @type {YAHOO.util.Event}
            */
            m_oEventUtil = YAHOO.util.Event,


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
            * Reference to the current context so that private methods have 
            * access to class members.
            * @private
            * @type {YAHOO.widget.MenuItem}
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
        function checkString(p_oObject) {

            return (typeof p_oObject == "string");

        }


        /**
        * Determines if an object is an HTMLElement.
        * @private
        * @param {Object} p_oObject The object to be evaluated.
        * @return Returns true if the object is an HTMLElement.
        * @type Boolean
        */
        function checkDOMNode(p_oObject) {

            return (p_oObject && p_oObject.tagName);

        }


        /**
        * Creates the core DOM structure for a MenuItem instance.
        * @private
        */
        function createRootNodeStructure() {

            me.element = document.createElement("li");

            m_oText = document.createTextNode("");

            m_oAnchor = document.createElement("a");
            m_oAnchor.appendChild(m_oText);
            
            me.cfg.refireEvent("url");

            me.element.appendChild(m_oAnchor);            

        }


        /**
        * Iterates the source element's childNodes collection and uses the  
        * child nodes to instantiate Menu and MenuItem instances.
        * @private
        */
        function initSubTree() {
    
            var aChildNodes = me.srcElement.childNodes,
                nChildNodes = aChildNodes.length,
                oMenuManager = YAHOO.widget.MenuManager,
                Menu = me.SUBMENU_TYPE,
                MenuItem = me.MENUITEM_TYPE;
    
    
            if(nChildNodes > 0) {
    
                var oNode,
                    aULs = [],
                    aOptions = [];
        
                for(var i=0; i<nChildNodes; i++) {
                
                    oNode = aChildNodes[i];
                
                    if(oNode.nodeType == 1) {
                
                        switch(oNode.tagName) {
                
                            case "DIV":
                
                                me.cfg.setProperty(
                                    "submenu", 
                                    (new Menu(oNode))
                                );
                
                            break;
         
                            case "OPTION":
        
                                aOptions[aOptions.length] = oNode;
        
                            break;
               
                            case "UL":
                                
                                aULs[aULs.length] = oNode;
                
                            break;
                
                        }
        
                    }
                
                }        
    
    
                if(aOptions.length > 0) {
        
                    me.cfg.setProperty(
                        "submenu", 
                        (new Menu(oMenuManager.createMenuId()))
                    );
    
                    var nOptions = aOptions.length;
        
                    for(var n=0; n<nOptions; n++) {
        
                        m_oSubmenu.addMenuItem((new MenuItem(aOptions[n])));
        
                    }
        
                }
        
    
                if(aULs.length > 0) {
        
                    if(aULs.length > 1) {
    
                        var oMenu = new Menu(oMenuManager.createMenuId()),
                            nULs = aULs.length;
            
                        for(var n=0; n<nULs; n++) {
            
                            oMenu.addSubmenu((new Menu(aULs[n])));
            
                        }
    
                        me.cfg.setProperty(
                            "submenu", 
                            oMenu
                        );
                    
                    }
                    else {
    
                        me.cfg.setProperty(
                            "submenu", 
                            (new Menu(aULs[0]))
                        );
                    
                    }
        
                }        
    
            }
    
        }
    

        // Event handlers for configuration properties
    

        /**
        * Event handler for when the "text" configuration property of
        * a MenuItem instance changes. 
        * @param {String} p_sType The name of the event that was fired.
        * @param {Array} p_aArguments Collection of arguments sent when the 
        * event was fired.
        * @param {YAHOO.widget.Menu} p_oMenu The Menu instance fired the event.
        */
        this.configText = function(p_sType, p_aArguments, p_oObject) {
    
            var sText = p_aArguments[0];


            if(m_oText) {

                m_oText.nodeValue = sText;

            }
    
        };


        /**
        * Event handler for when the "helptext" configuration property of
        * a MenuItem instance changes. 
        * @param {String} p_sType The name of the event that was fired.
        * @param {Array} p_aArguments Collection of arguments sent when the 
        * event was fired.
        * @param {YAHOO.widget.Menu} p_oMenu The Menu instance fired the event.
        */    
        this.configHelpText = function(p_sType, p_aArguments, p_oObject) {
    
            var oHelpText = p_aArguments[0];


            function initHelpText() {

                m_oDom.addClass(me.element, "hashelptext");
                m_oDom.addClass(m_oAnchor, "hashelptext");

                if(me.cfg.getProperty("disabled")) {

                    me.cfg.refireEvent("disabled");

                }

                if(me.cfg.getProperty("selected")) {

                    me.cfg.refireEvent("selected");

                }                

            }

            function removeHelpText() {

                m_oDom.removeClass(me.element, "hashelptext");
                m_oDom.removeClass(m_oAnchor, "hashelptext"); 

                me.element.removeChild(m_oHelpTextEM);
                m_oHelpTextEM = null;

            }


            if(checkDOMNode(oHelpText)) {

                if(m_oHelpTextEM) {

                    var oParentNode = m_oHelpTextEM.parentNode;
                    oParentNode.replaceChild(oHelpText, m_oHelpTextEM);

                }
                else {

                    m_oHelpTextEM = oHelpText;

                    this.element.insertBefore(
                        m_oHelpTextEM, 
                        this.subMenuIndicator
                    );

                }

                initHelpText();

            }
            else if(checkString(oHelpText)) {

                if(oHelpText.length === 0) {

                    removeHelpText();

                }
                else {

                    if(!m_oHelpTextEM) {

                        m_oHelpTextEM = document.createElement("em");

                        this.element.insertBefore(
                            m_oHelpTextEM, 
                            this.subMenuIndicator
                        );

                    }

                    m_oHelpTextEM.innerHTML = oHelpText;

                    initHelpText();

                }

            }
            else if(!oHelpText && m_oHelpTextEM) {

                removeHelpText();

            }
    
        };


        /**
        * Event handler for when the "url" configuration property of
        * a MenuItem instance changes.  
        * @param {String} p_sType The name of the event that was fired.
        * @param {Array} p_aArguments Collection of arguments sent when the 
        * event was fired.
        * @param {YAHOO.widget.Menu} p_oMenu The Menu instance fired the event.
        */    
        this.configURL = function(p_sType, p_aArguments, p_oObject) {
    
            var sURL = p_aArguments[0];

            if(!sURL) {

                sURL = "#";

            }

            m_oAnchor.setAttribute("href", sURL);

        };


        /**
        * Event handler for when the "emphasis" configuration property of
        * a MenuItem instance changes.  
        * @param {String} p_sType The name of the event that was fired.
        * @param {Array} p_aArguments Collection of arguments sent when the 
        * event was fired.
        * @param {YAHOO.widget.Menu} p_oMenu The Menu instance fired the event.
        */    
        this.configEmphasis = function(p_sType, p_aArguments, p_oObject) {
    
            var bEmphasis = p_aArguments[0];
    

            if(bEmphasis && this.cfg.getProperty("strongemphasis")) {

                this.cfg.setProperty("strongemphasis", false);

            }


            if(m_oAnchor) {

                var oEM;

                if(bEmphasis) {

                    oEM = document.createElement("em");
                    oEM.appendChild(m_oText);

                    m_oAnchor.appendChild(oEM);

                }
                else {

                    if(
                        m_oAnchor.firstChild && 
                        m_oAnchor.firstChild.nodeType == 1 && 
                        m_oAnchor.firstChild.tagName == "EM"
                    ) {

                        oEM = m_oAnchor.firstChild;

                    }
                    else if(
                        m_oAnchor.childNodes[1] && 
                        m_oAnchor.childNodes[1].nodeType == 1 &&
                        m_oAnchor.childNodes[1].tagName == "EM"
                    ) {

                        oEM = m_oAnchor.childNodes[1];

                    }


                    m_oAnchor.removeChild(oEM);
                    m_oAnchor.appendChild(m_oText);

                }

            }
    
        };


        /**
        * Event handler for when the "strongemphasis" configuration property of
        * a MenuItem instance changes. 
        * @param {String} p_sType The name of the event that was fired.
        * @param {Array} p_aArguments Collection of arguments sent when the 
        * event was fired.
        * @param {YAHOO.widget.Menu} p_oMenu The Menu instance fired the event.
        */    
        this.configStrongEmphasis = function(p_sType, p_aArguments, p_oObject) {
    
            var bStrongEmphasis = p_aArguments[0];
    

            if(bStrongEmphasis && this.cfg.getProperty("emphasis")) {

                this.cfg.setProperty("emphasis", false);

            }

            if(m_oAnchor) {

                var oStrong;

                if(bStrongEmphasis) {

                    oStrong = document.createElement("strong");
                    oStrong.appendChild(m_oText);

                    m_oAnchor.appendChild(oStrong);

                }
                else {

                    if(
                        m_oAnchor.firstChild && 
                        m_oAnchor.firstChild.nodeType == 1 && 
                        m_oAnchor.firstChild.tagName == "STRONG"
                    ) {

                        oStrong = m_oAnchor.firstChild;

                    }
                    else if(
                        m_oAnchor.childNodes[1] && 
                        m_oAnchor.childNodes[1].nodeType == 1 &&
                        m_oAnchor.childNodes[1].tagName == "STRONG"
                    ) {

                        oStrong = m_oAnchor.childNodes[1];

                    }

                    m_oAnchor.removeChild(oStrong);
                    m_oAnchor.appendChild(m_oText);

                }

            }
    
        };


        /**
        * Event handler for when the "disabled" configuration property of
        * a MenuItem instance changes. 
        * @param {String} p_sType The name of the event that was fired.
        * @param {Array} p_aArguments Collection of arguments sent when the 
        * event was fired.
        * @param {YAHOO.widget.Menu} p_oMenu The Menu instance fired the event.
        */    
        this.configDisabled = function(p_sType, p_aArguments, p_oObject) {
    
            var bDisabled = p_aArguments[0];
    

            if(bDisabled) {

                this.cfg.setProperty("selected", false);

                m_oAnchor.removeAttribute("href");
                m_oAnchor.removeAttribute("tabIndex");

                m_oDom.addClass(this.element, "disabled");
                m_oDom.addClass(m_oAnchor, "disabled");

                if(m_oHelpTextEM) {

                    m_oDom.addClass(m_oHelpTextEM, "disabled");

                }

                if(this.subMenuIndicator) {

                    this.subMenuIndicator.src = 
                        this.DISABLED_SUBMENU_INDICATOR_IMAGE_URL;
    
                    this.subMenuIndicator.alt = 
                        this.DISABLED_SUBMENU_INDICATOR_ALT_TEXT;

                }

            }
            else {

                m_oAnchor.setAttribute(
                    "href", 
                    this.cfg.getProperty("url")
                );

                m_oAnchor.setAttribute("tabIndex", 0);

                m_oDom.removeClass(this.element, "disabled");
                m_oDom.removeClass(m_oAnchor, "disabled");

                if(m_oHelpTextEM) {

                    m_oDom.removeClass(m_oHelpTextEM, "disabled");

                }

                if(this.subMenuIndicator) {

                    this.subMenuIndicator.src = 
                        this.SUBMENU_INDICATOR_IMAGE_URL;
    
                    this.subMenuIndicator.alt = 
                        this.COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT;

                }

            }    
    
        };


        /**
        * Event handler for when the "selected" configuration property of
        * a MenuItem instance changes. 
        * @param {String} p_sType The name of the event that was fired.
        * @param {Array} p_aArguments Collection of arguments sent when the 
        * event was fired.
        * @param {YAHOO.widget.Menu} p_oMenu The Menu instance fired the event.
        */    
        this.configSelected = function(p_sType, p_aArguments, p_oObject) {
    
            var bSelected = p_aArguments[0];


            if(bSelected) {

                m_oDom.addClass(this.element, "selected");
                m_oDom.addClass(m_oAnchor, "selected");

                if(m_oHelpTextEM) {

                    m_oDom.addClass(m_oHelpTextEM, "selected");

                }

                if(this.subMenuIndicator) {

                    this.subMenuIndicator.src = 
                        this.SELECTED_SUBMENU_INDICATOR_IMAGE_URL;

                }

            }
            else {

                m_oDom.removeClass(this.element, "selected");
                m_oDom.removeClass(m_oAnchor, "selected");

                if(m_oHelpTextEM) {

                    m_oDom.removeClass(m_oHelpTextEM, "selected");

                }

                if(this.subMenuIndicator) {

                    this.subMenuIndicator.src = 
                        this.SUBMENU_INDICATOR_IMAGE_URL;

                }

            }
    
    
        };


        /**
        * Event handler for when the "submenu" configuration property of
        * a MenuItem instance changes. 
        * @param {String} p_sType The name of the event that was fired.
        * @param {Array} p_aArguments Collection of arguments sent when the 
        * event was fired.
        * @param {YAHOO.widget.Menu} p_oMenu The Menu instance fired the event.
        */
        this.configSubmenu = function(p_sType, p_aArguments, p_oObject) {

            var oMenu = p_aArguments[0];

            if(oMenu) {

                oMenu.parent = this;

                m_oSubmenu = oMenu;

                m_oDom.addClass(this.element, "hassubmenu");
                m_oDom.addClass(m_oAnchor, "hassubmenu");

                if(!this.subMenuIndicator) { 

                    this.subMenuIndicator = document.createElement("img");

                    this.element.appendChild(this.subMenuIndicator);
            
                    this.subMenuIndicator.src = 
                        this.SUBMENU_INDICATOR_IMAGE_URL;
        
                    this.subMenuIndicator.alt = 
                        this.COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT;

                    if(this.cfg.getProperty("disabled")) {
    
                        this.cfg.refireEvent("disabled");
    
                    }

                    if(this.cfg.getProperty("selected")) {
    
                        this.cfg.refireEvent("selected");
    
                    }                

                }

                if(!m_oSubmenu.element.parentNode) {

                    this.element.appendChild(m_oSubmenu.element);

                }

            }
            else {

                m_oDom.removeClass(this.element, "hassubmenu");
                m_oDom.removeClass(oAnchor, "hassubmenu");

                if(this.subMenuIndicator) {

                    this.element.removeChild(this.subMenuIndicator);

                }

                if(m_oSubmenu) {

                    this.element.removeChild(m_oSubmenu);                    

                }

            }

        };


        // Privileged methods


        /**
        * Finds the next enabled MenuItem instance in a Menu instance 
        * @return Returns a MenuItem instance.
        * @type YAHOO.widget.MenuItem
        */
        this.getNextEnabledSibling = function() {
    
            var oNextMenuItem;
    
            if(
                this.index < (this.parent.getMenuItems().length - 1)
            ) {
    
                oNextMenuItem = this.parent.getMenuItem((this.index+1));
    
            }
            else {
    
                // Check if this Menu instance is a member of a group
    
                var oParent = this.parent.parent;
    
                if(oParent && oParent._Menu) {
    
                    var oNextMenu, nNextMenuIndex;
    
                    if(
                        this.parent.index < 
                        (oParent.getSubmenus().length - 1)
                    ) {
    
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
    
        };
    
    
        /**
        * Finds the previous enabled MenuItem instance in a Menu instance 
        * @return Returns a MenuItem instance.
        * @type YAHOO.widget.MenuItem
        */
        this.getPreviousEnabledSibling = function() {
    
            var oPreviousMenuItem;
    
            if(this.index > 0) {
    
                oPreviousMenuItem = this.parent.getMenuItem((this.index-1));
    
            }
            else {
    
                // Check if this Menu instance is a member of a group
    
                var oParent = this.parent.parent;
    
                if(oParent && oParent._Menu) {
    
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
    
        };


        /**
        * Causes a MenuItem instance to receive the focus and fires the
        * focus event.
        */
        this.focus = function() {
    
            if(!this.cfg.getProperty("disabled") && m_oAnchor) {


                var oActiveMenuItem = this.parent.getActiveMenuItem();

                if(oActiveMenuItem) {

                    oActiveMenuItem.blur();

                }


                m_oAnchor.focus();

                this.focusEvent.fire();
  
            }
    
        };


        /**
        * Causes a MenuItem instance to lose focus and fires the onblur event.
        */    
        this.blur = function() {
    
            if(!this.cfg.getProperty("disabled") && m_oAnchor) {

                m_oAnchor.blur();

                this.blurEvent.fire();
    
            }
    
        };


        /**
        * Displays the submenu for a MenuItem instance.
        */
        this.showSubmenu = function() {
    
            if(m_oSubmenu) {

                var aMenuItemPosition = m_oDom.getXY(this.element),
                    aSubmenuPosition = [];


                // Calculate the x position
                
                aSubmenuPosition[0] = 
                    (aMenuItemPosition[0] + this.element.offsetWidth);


                // Calculate the y position
    
                aSubmenuPosition[1] = aMenuItemPosition[1];


                // Position the menu

                m_oSubmenu.cfg.setProperty("xy", aSubmenuPosition);
               
                m_oSubmenu.show();

                this.subMenuIndicator.alt = 
                    this.EXPANDED_SUBMENU_INDICATOR_ALT_TEXT;
    
            }
    
        };


        /**
        * Displays the submenu for a MenuItem instance.
        */
        this.hideSubmenu = function() {
    
            if(m_oSubmenu) {
    
                this.subMenuIndicator.alt = 
                    this.COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT;
    
                m_oSubmenu.hide();
    
            }
    
        };


        // Begin constructor logic


        // Create the config object

        this.cfg = new YAHOO.util.Config(this);


        // Define the config properties

        this.cfg.addProperty("text", null, this.configText, checkString);

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


        if(checkString(p_oObject)) {

            createRootNodeStructure();

            this.cfg.setProperty("text", p_oObject);

        }
        else if(checkDOMNode(p_oObject)) {

            switch(p_oObject.tagName) {

                case "OPTION":

                    createRootNodeStructure();

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

                    createRootNodeStructure();

                    this.cfg.setProperty("text", p_oObject.label);

                    this.srcElement = p_oObject;

                    if(p_oObject.disabled || p_oObject.parentNode.disabled) {

                        this.cfg.setProperty("disabled", true);

                    }

                    if(this.cfg.getProperty("initsubmenus")) {

                        initSubTree();

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
                        m_oDom.hasClass(
                            p_oObject.parentNode.parentNode, 
                            "bd"
                        ) &&

                        // Root node check
                        p_oObject.parentNode.parentNode.parentNode && 
                        p_oObject.parentNode.parentNode.parentNode.tagName == "DIV" && 
                        m_oDom.hasClass(
                            p_oObject.parentNode.parentNode.parentNode, 
                            "yuimenu"
                        )
                    ) {

                        this.element = p_oObject;
                        m_oAnchor = oAnchor;


                        // Check to see if the MenuItem is disabled

                        var bDisabled = 
                            m_oDom.hasClass(this.element, "disabled");


                        /*
                            Check to see if the MenuItem should be selected 
                            by default
                        */ 

                        var bSelected = 
                            m_oDom.hasClass(this.element, "selected");
    

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

                            m_oText = oEmphasisNode.firstChild;

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

                            m_oText = oAnchor.firstChild;

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

                            m_oHelpTextEM = oHelpText;

                            /*
                                Propagate the "hashelptext" class to the LI and 
                                anchor if it isn't already applied
                            */
                            
                            m_oDom.addClass(this.element, "hashelptext");
                            m_oDom.addClass(oAnchor, "hashelptext");


                        }
                        else {

                            /* 
                                Remove the "hashelptext" class if it exists but
                                there is no help text present
                            */

                            m_oDom.removeClass(this.element, "hashelptext");
                            m_oDom.removeClass(oAnchor, "hashelptext");

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

                        createRootNodeStructure();

                        this.cfg.setProperty("text", sText);
                        this.cfg.setProperty("url", sURL);

                    }

                    if(this.cfg.getProperty("initsubmenus")) {

                        initSubTree();

                    }

                break;

            }            

        }


        if(this.element) {


            m_oDom.addClass(this.element, this.CSS_CLASS_NAME);


            // Create custom events
    
            var CustomEvent = YAHOO.util.CustomEvent;
    
            /**
            * Fires when a MenuItem instances's HTMLLIElement is removed from
            * it's parent HTMLUListElement node.
            * @type {YAHOO.util.CustomEvent}
            * @see YAHOO.util.CustomEvent
            */
            this.destroyEvent = new CustomEvent("destroyEvent", this);


            /**
            * Fires when the mouse has entered a MenuItem instance.  Passes
            * back the DOM Event object as an argument.
            * @type {YAHOO.util.CustomEvent}
            * @see YAHOO.util.CustomEvent
            */
            this.mouseOverEvent = new CustomEvent("mouseOverEvent", this);


            /**
            * Fires when the mouse has left a MenuItem instance.  Passes back  
            * the DOM Event object as an argument.
            * @type {YAHOO.util.CustomEvent}
            * @see YAHOO.util.CustomEvent
            */
            this.mouseOutEvent = new CustomEvent("mouseOutEvent", this);


            /**
            * Fires when the user clicks the on a MenuItem instance.  Passes 
            * back the DOM Event object as an argument.
            * @type {YAHOO.util.CustomEvent}
            * @see YAHOO.util.CustomEvent
            */
            this.mouseDownEvent = new CustomEvent("mouseDownEvent", this);


            /**
            * Fires when the user releases a mouse button while the mouse is 
            * over a MenuItem instance.  Passes back the DOM Event object as
            * an argument.
            * @type {YAHOO.util.CustomEvent}
            * @see YAHOO.util.CustomEvent
            */
            this.mouseUpEvent = new CustomEvent("mouseUpEvent", this);


            /**
            * Fires when the user clicks the on a MenuItem instance.  Passes 
            * back the DOM Event object as an argument.
            * @type {YAHOO.util.CustomEvent}
            * @see YAHOO.util.CustomEvent
            */
            this.clickEvent = new CustomEvent("clickEvent", this);


            /**
            * Fires when the user presses an alphanumeric key.  Passes back the 
            * DOM Event object as an argument.
            * @type {YAHOO.util.CustomEvent}
            * @see YAHOO.util.CustomEvent
            */
            this.keyPressEvent = new CustomEvent("keyPressEvent", this);


            /**
            * Fires when the user presses a key.  Passes back the DOM Event 
            * object as an argument.
            * @type {YAHOO.util.CustomEvent}
            * @see YAHOO.util.CustomEvent
            */
            this.keyDownEvent = new CustomEvent("keyDownEvent", this);


            /**
            * Fires when the user releases a key.  Passes back the DOM Event 
            * object as an argument.
            * @type {YAHOO.util.CustomEvent}
            * @see YAHOO.util.CustomEvent
            */
            this.keyUpEvent = new CustomEvent("keyUpEvent", this);


            /**
            * Fires when a MenuItem instance receives focus.  Passes back the 
            * DOM Event object as an argument.
            * @type {YAHOO.util.CustomEvent}
            * @see YAHOO.util.CustomEvent
            */
            this.focusEvent = new CustomEvent("focusEvent", this);


            /**
            * Fires when a MenuItem instance loses the input focus.  Passes 
            * back the DOM Event object as an argument.
            * @type {YAHOO.util.CustomEvent}
            * @see YAHOO.util.CustomEvent
            */
            this.blurEvent = new CustomEvent("blurEvent", this);


            if(p_oUserConfig) {
    
                this.cfg.applyConfig(p_oUserConfig);
    
            }        

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