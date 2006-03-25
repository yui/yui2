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
* Constant representing the type of Menu to instantiate when creating 
* submenu instances.
* @final
* @type YAHOO.widget.Menu
*/
YAHOO.widget.Menu.prototype.SUBMENU_TYPE = null;


/**
* Constant representing the type of Menu to instantiate when creating 
* MenuItem instances.
* @final
* @type YAHOO.widget.MenuItem
*/
YAHOO.widget.Menu.prototype.MENUITEM_TYPE = null;


// Private properties

/**
* Array of MenuItem instances.
* @private
* @type {Array}
*/
YAHOO.widget.Menu.prototype._aMenuItems = null;


/**
* Array of Menu instances.
* @private
* @type {Array}
*/
YAHOO.widget.Menu.prototype._aSubmenus = null;


/**
* The HTMLUListElement for each MenuItem's HTMLLIElement node
* @private
* @type {HTMLUListElement}
*/
YAHOO.widget.Menu.prototype._oListElement = null;


/**
* The HTMLLIElement node that is currently the target of a DOM event
* @private
* @type {HTMLLIElement}
*/
YAHOO.widget.Menu.prototype._oCurrentMenuItemLI = null;


/**
* The HTMLDIVElement node that is currently the target of a DOM event
* @private
* @type {HTMLDIVElement}
*/
YAHOO.widget.Menu.prototype._oCurrentMenuDIV = null;


/**
* Reference to the Event utility singleton.
* @private
* @type {YAHOO.util.Event}
*/
YAHOO.widget.Menu.prototype._oEventUtil = YAHOO.util.Event;


/**
* Reference to the MenuManager singleton.
* @private
* @type {YAHOO.widget.MenuManager}
*/
YAHOO.widget.Menu.prototype._oMenuManager = YAHOO.widget.MenuManager;


/**
* Reference to the Dom utility singleton.
* @private
* @type {YAHOO.util.Dom}
*/
YAHOO.widget.Menu.prototype._oDom = YAHOO.util.Dom;


/**
* Reference to the MenuItem instance that has focus.
* @private
* @type {YAHOO.widget.MenuItem}
*/
YAHOO.widget.Menu.prototype._oActiveMenuItem = null;


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



// Events

/**
* Fires when the mouse has entered a Menu instance.  Passes back the 
* DOM Event object as an argument.
* @type {YAHOO.util.CustomEvent}
* @see YAHOO.util.CustomEvent
*/
YAHOO.widget.Menu.prototype.mouseOverEvent = null;


/**
* Fires when the mouse has left a Menu instance.  Passes back the DOM 
* Event object as an argument.
* @type {YAHOO.util.CustomEvent}
* @see YAHOO.util.CustomEvent
*/
YAHOO.widget.Menu.prototype.mouseOutEvent = null;


/**
* Fires when the user clicks the on a Menu instance.  Passes back the 
* DOM Event object as an argument.
* @type {YAHOO.util.CustomEvent}
* @see YAHOO.util.CustomEvent
*/
YAHOO.widget.Menu.prototype.mouseDownEvent = null;


/**
* Fires when the user releases a mouse button while the mouse is over 
* a Menu instance.  Passes back the DOM Event object as an argument.
* @type {YAHOO.util.CustomEvent}
* @see YAHOO.util.CustomEvent
*/
YAHOO.widget.Menu.prototype.mouseUpEvent = null;


/**
* Fires when the user clicks the on a Menu instance.  Passes back the 
* DOM Event object as an argument.
* @type {YAHOO.util.CustomEvent}
* @see YAHOO.util.CustomEvent
*/
YAHOO.widget.Menu.prototype.clickEvent = null;


/**
* Fires when the user presses an alphanumeric key.  Passes back the 
* DOM Event object as an argument.
* @type {YAHOO.util.CustomEvent}
* @see YAHOO.util.CustomEvent
*/
YAHOO.widget.Menu.prototype.keyPressEvent = null;


/**
* Fires when the user presses a key.  Passes back the DOM Event 
* object as an argument.
* @type {YAHOO.util.CustomEvent}
* @see YAHOO.util.CustomEvent
*/
YAHOO.widget.Menu.prototype.keyDownEvent = null;


/**
* Fires when the user releases a key.  Passes back the DOM Event 
* object as an argument.
* @type {YAHOO.util.CustomEvent}
* @see YAHOO.util.CustomEvent
*/
YAHOO.widget.Menu.prototype.keyUpEvent = null;



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


    if(!this.SUBMENU_TYPE) {

        this.SUBMENU_TYPE = YAHOO.widget.Menu;

    }

    if(!this.MENUITEM_TYPE) {

        this.MENUITEM_TYPE = YAHOO.widget.MenuItem;

    }


    this._aMenuItems = [];
    this._aSubmenus = [];


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

                if(this._oDom.hasClass(oElement, "yuimenu")) {

                    this.srcElement = oElement;
   
                    if(!oElement.id) {

                        oElement.id = this._oMenuManager.createMenuId();

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
    
                        this._oListElement = this.body.firstChild;
    
                    }
                    else if(
                        this.body.childNodes[1] && 
                        this.body.childNodes[1].nodeType == 1 &&
                        this.body.childNodes[1].tagName == "UL"
                    ) {
    
                        this._oListElement = this.body.childNodes[1];
    
                    }

                }
    
            break;
    
            case "UL":
            case "SELECT":
    
                this.srcElement = oElement;
    
    
                /*
                    The source element is not something that we can use 
                    outright, so we need to create a new Overlay
                */
    
                var sId = this._oMenuManager.createMenuId();
    
    
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

        this._oDom.addClass(this.element, this.CSS_CLASS_NAME);


        // Assign DOM event handlers

        this._oEventUtil.addListener(
            this.element, 
            "mouseover", 
            this._onElementMouseOver, 
            this,
            true
        );

        this._oEventUtil.addListener(
            this.element, 
            "mouseout", 
            this._onElementMouseOut, 
            this,
            true
        );

        this._oEventUtil.addListener(
            this.element, 
            "mousedown", 
            this._onElementMouseDown, 
            this,
            true
        );

        this._oEventUtil.addListener(
            this.element, 
            "mouseup", 
            this._onElementMouseUp, 
            this,
            true
        );

        this._oEventUtil.addListener(
            this.element, 
            "click", 
            this._onElementClick, 
            this,
            true
        );

        this._oEventUtil.addListener(
            this.element, 
            "keydown", 
            this._onElementKeyDown, 
            this,
            true
        );

        this._oEventUtil.addListener(
            this.element, 
            "keyup", 
            this._onElementKeyUp, 
            this,
            true
        );

        this._oEventUtil.addListener(
            this.element, 
            "keypress", 
            this._onElementKeyPress, 
            this,
            true
        );


        // Create custom events

        var CustomEvent = YAHOO.util.CustomEvent;

        this.mouseOverEvent = new CustomEvent("mouseOverEvent", this);
        this.mouseOutEvent = new CustomEvent("mouseOutEvent", this);
        this.mouseDownEvent = new CustomEvent("mouseDownEvent", this);
        this.mouseUpEvent = new CustomEvent("mouseUpEvent", this);
        this.clickEvent = new CustomEvent("clickEvent", this);
        this.keyPressEvent = new CustomEvent("keyPressEvent", this);
        this.keyDownEvent = new CustomEvent("keyDownEvent", this);
        this.keyUpEvent = new CustomEvent("keyUpEvent", this);


        this._oMenuManager.addMenu(this);

        if(p_oUserConfig) {
    
            this.cfg.applyConfig(p_oUserConfig);
    
        }

        if(this.srcElement) {

            this._initSubTree(this.srcElement);

        }

    }

};


// Private methods

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
YAHOO.widget.Menu.prototype._addArrayItem = function(p_oArray, p_oItem, p_nIndex) {

    if(typeof p_nIndex == "number") {

        p_oArray.splice(p_nIndex, 0, p_oItem);

        p_oItem.parent = this;


        // Update the index and className properties of each member        
        
        this._updateArrayItemProperties(p_oArray);

    }
    else {

        var nIndex = p_oArray.length;

        p_oArray[nIndex] = p_oItem;

        p_oItem.index = nIndex;

        p_oItem.element.setAttribute("index", nIndex);

        p_oItem.parent = this;

        if(nIndex === 0) {

            this._oDom.addClass(p_oItem.element, "first");

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
YAHOO.widget.Menu.prototype._removeArrayItemByIndex = function(p_oArray, p_nIndex) {

    var aArray = p_oArray.splice(p_nIndex, 1);


    // Update the index and className properties of each member        
    
    this._updateArrayItemProperties(p_oArray);


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
YAHOO.widget.Menu.prototype._removeArrayItemByValue = function(p_oArray, p_oItem) {

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

        return this._removeArrayItemByIndex(p_oArray, nIndex);

    }      

};


/**
* Updates the index and className properties of Menu and MenuItem instances 
* that are added and removed from the Menu.  Used to manage a Menu's 
* collection of submenus and MenuItem instances.
* @private
* @param {Array} p_oArray Array of Menu or MenuItem instances.
*/
YAHOO.widget.Menu.prototype._updateArrayItemProperties = function (p_oArray) {

    var i = p_oArray.length-1;


    // Update the index and className properties of each member        

    do {

        p_oArray[i].index = i;

        p_oArray[i].element.setAttribute("index", i);

        switch(i) {

            case 0:

                this._oDom.addClass(p_oArray[i].element, "first");

            break;

            default:

                this._oDom.removeClass(p_oArray[i].element, "first");

            break;

        }

    }
    while(i--);

};


/**
* Iterates the source element's childNodes collection and uses the child 
* nodes to instantiate Menu and MenuItem instances.
* @private
* @param {Array} p_aNode HTML Element
* objects that are direct descendants of the Menu's source element.
*/
YAHOO.widget.Menu.prototype._initSubTree = function(p_aNode) {
    
    var oNode = p_aNode.firstChild,
        Menu = this.SUBMENU_TYPE,
        MenuItem = this.MENUITEM_TYPE;

    do {
    
        switch(oNode.tagName) {

            case "LI":
            case "OPTGROUP":
            case "OPTION":
            
                this.addMenuItem(
                    (
                        new MenuItem(
                            oNode, 
                            { 
                                initsubmenus: 
                                    (this.cfg.getProperty("initsubmenus"))
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
                    this._oDom.hasClass(oNode.parentNode.parentNode, "yuimenu")
                ) {

                    var oLI = oNode.firstChild;

                    do { 

                        switch(oLI.tagName) {

                            case "LI":

                                this.addMenuItem(
                                    (
                                        new MenuItem(
                                            oLI,
                                            {
                                                initsubmenus: 
                                                    (
                                                        this.cfg.getProperty(
                                                            "initsubmenus"
                                                        )
                                                    )
                                            }
                                        )
                                    )
                                );

                            break;                                

                        }

                    }
                    while((oLI = oLI.nextSibling));

                }
                else {

                    this.addSubmenu(
                        (
                            new Menu(
                                oNode, 
                                {
                                    initsubmenus: 
                                        (
                                            this.cfg.getProperty(
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
                    this._oDom.hasClass(oNode.parentNode, "yuimenu") && 
                    this._oDom.hasClass(oNode, "bd") 
                ) {

                    return this._initSubTree(oNode);

                }
                else {                  

                    this.addSubmenu(
                        (
                            new Menu(
                                oNode, 
                                {
                                    initsubmenus: 
                                        (
                                            this.cfg.getProperty(
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
    while((oNode = oNode.nextSibling));

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
YAHOO.widget.Menu.prototype._onElementMouseOver = function(p_oEvent, p_oMenu) {

    /*
        Because Menus can be embedded in eachother, stop the 
        propagation of the event at each Menu instance to make handling 
        the event easier for the user.
    */

    if(!this.parent || this.parent instanceof YAHOO.widget.MenuItem) {
        
        this._oEventUtil.stopPropagation(p_oEvent);

    }


    /*
        Calculate when the mouse has entered the Menu's root HTMLDivElement 
        to make handling the MouseOver event easier for the user.
    */

    var oTarget = this._oEventUtil.getTarget(p_oEvent, true);

    if(!this._oCurrentMenuDIV && oTarget == this.element) {

        this._oCurrentMenuDIV = this.element;

        // Fire the associated custom event

        this.mouseOverEvent.fire(p_oEvent);

    }

    if(!this._oCurrentMenuItemLI) {

        var oNode = oTarget;
    
        do {

            if(
                oNode && 
                oNode.tagName == "LI" && 
                oNode.parentNode.parentNode.parentNode == this.element
            ) {

                this._oCurrentMenuItemLI = oNode;

                var nIndex = parseInt(oNode.getAttribute("index"), 10),
                    oMenuItem = this._aMenuItems[nIndex];
    
                if(oMenuItem && !oMenuItem.cfg.getProperty("disabled")) {

                    // Fire the associated custom event

                    oMenuItem.mouseOverEvent.fire(p_oEvent);

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

                }

                break;

            }

        }
        while((oNode = oNode.parentNode));

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
YAHOO.widget.Menu.prototype._onElementMouseOut = function(p_oEvent, p_oMenu) {

    /*
        Because Menus can be embedded in eachother, stop the 
        propagation of the event at each Menu instance to make handling 
        the event easier for the user.
    */

    if(!this.parent || this.parent instanceof YAHOO.widget.MenuItem) {
        
        this._oEventUtil.stopPropagation(p_oEvent);

    }

    var oRelatedTarget = this._oEventUtil.getRelatedTarget(p_oEvent),
        bLIMouseOut = true,
        bDIVMouseOut = true;
        
    if((this._oCurrentMenuItemLI || this._oCurrentMenuDIV)  && oRelatedTarget) {

        var oNode = oRelatedTarget;
    
        do {

            if(
                oNode == this._oCurrentMenuItemLI && 
                oNode.parentNode.parentNode.parentNode == this.element
            ) {

                bLIMouseOut = false;

            }

            if(oNode == this._oCurrentMenuDIV) {

                bDIVMouseOut = false;
                break;
            }

        }
        while((oNode = oNode.parentNode));

    }        

    if(this._oCurrentMenuItemLI && bLIMouseOut) {

        var nIndex = 
                parseInt(this._oCurrentMenuItemLI.getAttribute("index"), 10),
            oMenuItem = this._aMenuItems[nIndex];

        if(oMenuItem && !oMenuItem.cfg.getProperty("disabled")) {

            // Fire the associated custom event

            oMenuItem.mouseOutEvent.fire(p_oEvent);

            oMenuItem.cfg.setProperty("selected", false);

        }

        this._oCurrentMenuItemLI = null;

    }

    if(this._oCurrentMenuDIV && bDIVMouseOut) {

        // Fire the associated custom event

        this.mouseOutEvent.fire(p_oEvent);

        this._oCurrentMenuDIV = null;

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
YAHOO.widget.Menu.prototype._onElementMouseDown = function(p_oEvent, p_oMenu) {

    /*
        Because Menus can be embedded in eachother, stop the 
        propagation of the event at each Menu instance to make handling 
        the event easier for the user.
    */

    if(!this.parent || this.parent instanceof YAHOO.widget.MenuItem) {
        
        this._oEventUtil.stopPropagation(p_oEvent);

    }


    /*
        Check if the target was a DOM element that is a part of a 
        MenuItem instance and (if so), fire the associated custom event.
    */    

    var oTarget = this._oEventUtil.getTarget(p_oEvent, true),
        oNode = oTarget;

    do {

        if(
            oNode && 
            oNode.tagName == "LI" && 
            oNode.parentNode.parentNode.parentNode == this.element
        ) {

            var nIndex = parseInt(oNode.getAttribute("index"), 10),
                oMenuItem = this._aMenuItems[nIndex];

            if(oMenuItem && !oMenuItem.cfg.getProperty("disabled")) {

                // Fire the associated custom event

                oMenuItem.mouseDownEvent.fire(p_oEvent);

            }

            break;

        }

    }
    while((oNode = oNode.parentNode));


    // Fire the associated custom event

    this.mouseDownEvent.fire(p_oEvent);

};


/**
* "mouseup" event handler for the Menu's root HTMLDivElement.
* @private
* @param {Event} p_oEvent Event object passed back by the 
* event utility (YAHOO.util.Event).
* @param {YAHOO.widget.Menu} p_oMenu The Menu instance corresponding to the 
* HTMLDivElement that fired the event.
*/    
YAHOO.widget.Menu.prototype._onElementMouseUp = function(p_oEvent, p_oMenu) {

    /*
        Because Menus can be embedded in eachother, stop the 
        propagation of the event at each Menu instance to make handling 
        the event easier for the user.
    */

    if(!this.parent || this.parent instanceof YAHOO.widget.MenuItem) {
        
        this._oEventUtil.stopPropagation(p_oEvent);

    }


    /*
        Check if the target was a DOM element that is a part of a 
        MenuItem instance and (if so), fire the associated custom event.
    */    

    var oTarget = this._oEventUtil.getTarget(p_oEvent, true),
        oNode = oTarget;

    do {

        if(
            oNode && 
            oNode.tagName == "LI" && 
            oNode.parentNode.parentNode.parentNode == this.element
        ) {

            var nIndex = parseInt(oNode.getAttribute("index"), 10),
                oMenuItem = this._aMenuItems[nIndex];

            if(oMenuItem && !oMenuItem.cfg.getProperty("disabled")) {

                // Fire the associated custom event

                oMenuItem.mouseUpEvent.fire(p_oEvent);

            }

            break;

        }

    }
    while((oNode = oNode.parentNode));


    // Fire the associated custom event

    this.mouseUpEvent.fire(p_oEvent);

};


/**
* "click" Event handler for the Menu's root HTMLDivElement.
* @private
* @param {Event} p_oEvent Event object passed back by the 
* event utility (YAHOO.util.Event).
* @param {YAHOO.widget.Menu} p_oMenu The Menu instance corresponding to the 
* HTMLDivElement that fired the event.
*/         
YAHOO.widget.Menu.prototype._onElementClick = function(p_oEvent, p_oMenu) {

    /*
        Because Menus can be embedded in eachother, stop the 
        propagation of the event at each Menu instance to make handling 
        the event easier for the user.
    */

    var oTarget = this._oEventUtil.getTarget(p_oEvent, true);

    if(
        (!this.parent || this.parent instanceof YAHOO.widget.MenuItem) && 
        (
            oTarget.tagName != "A" || 
            (oTarget.tagName == "A" && oTarget.getAttribute("href") == "#")
        )            
    ) {

        /*
            Don't stop propagation of the event for anchors so that Safari
            can follow the URL
        */

        this._oEventUtil.stopPropagation(p_oEvent);

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
            oNode.parentNode.parentNode.parentNode == this.element
        ) {

            var nIndex = parseInt(oNode.getAttribute("index"), 10),
                oMenuItem = this._aMenuItems[nIndex];

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
        
                        this._oEventUtil.preventDefault(p_oEvent);
                    
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

    }
    while((oNode = oNode.parentNode));


    // Fire the associated custom event

    this.clickEvent.fire(p_oEvent);

};


/**
* "keydown" Event handler for the Menu's root HTMLDivElement.
* @private
* @param {Event} p_oEvent Event object passed back by the 
* event utility (YAHOO.util.Event).
* @param {YAHOO.widget.Menu} p_oMenu The Menu instance corresponding to the 
* HTMLDivElement that fired the event.
*/         
YAHOO.widget.Menu.prototype._onElementKeyDown = function(p_oEvent, p_oMenu) {

    /*
        Because Menus can be embedded in eachother, stop the 
        propagation of the event at each Menu instance to make handling 
        the event easier for the user.
    */

    if(!this.parent || this.parent instanceof YAHOO.widget.MenuItem) {

        this._oEventUtil.stopPropagation(p_oEvent);

    }


    /*
        Check if the target was a DOM element that is a part of a 
        MenuItem instance and (if so), fire the associated custom event.
    */

    var oTarget = this._oEventUtil.getTarget(p_oEvent, true);

    if(
        oTarget.tagName == "A" && 
        oTarget.parentNode.parentNode.parentNode.parentNode == this.element
    ) {

        var nIndex = parseInt(oTarget.parentNode.getAttribute("index"), 10),
            oMenuItem = this._aMenuItems[nIndex];

        if(oMenuItem && !oMenuItem.cfg.getProperty("disabled")) {

            // Fire the associated custom event

            oMenuItem.keyDownEvent.fire(p_oEvent);

        }

    }


    // Fire the associated custom event

    this.keyDownEvent.fire(p_oEvent);

};


/**
* "keyup" Event handler for the Menu's root HTMLDivElement.
* @private
* @param {Event} p_oEvent Event object passed back by the 
* event utility (YAHOO.util.Event).
* @param {YAHOO.widget.Menu} p_oMenu The Menu instance corresponding to the 
* HTMLDivElement that fired the event.
*/         
YAHOO.widget.Menu.prototype._onElementKeyUp = function(p_oEvent, p_oMenu) {

    /*
        Because Menus can be embedded in eachother, stop the 
        propagation of the event at each Menu instance to make handling 
        the event easier for the user.
    */

    if(!this.parent || this.parent instanceof YAHOO.widget.MenuItem) {

        this._oEventUtil.stopPropagation(p_oEvent);

    }


    /*
        Check if the target was a DOM element that is a part of a 
        MenuItem instance and (if so), fire the associated custom event.
    */

    var oTarget = this._oEventUtil.getTarget(p_oEvent, true);

    if(
        oTarget.tagName == "A" && 
        oTarget.parentNode.parentNode.parentNode.parentNode == this.element
    ) {

        var nIndex = parseInt(oTarget.parentNode.getAttribute("index"), 10),
            oMenuItem = this._aMenuItems[nIndex];

        if(oMenuItem && !oMenuItem.cfg.getProperty("disabled")) {

            // Fire the associated custom event

            oMenuItem.keyUpEvent.fire(p_oEvent);

        }

    }


    // Fire the associated custom event

    this.keyUpEvent.fire(p_oEvent);

};


/**
* "keypress" Event handler for the Menu's root HTMLDivElement.
* @private
* @param {Event} p_oEvent Event object passed back by the 
* event utility (YAHOO.util.Event).
* @param {YAHOO.widget.Menu} p_oMenu The Menu instance corresponding to the 
* HTMLDivElement that fired the event.
*/         
YAHOO.widget.Menu.prototype._onElementKeyPress = function(p_oEvent, p_oMenu) {

    /*
        Because Menus can be embedded in eachother, stop the 
        propagation of the event at each Menu instance to make handling 
        the event easier for the user.
    */

    if(!this.parent || this.parent instanceof YAHOO.widget.MenuItem) {

        this._oEventUtil.stopPropagation(p_oEvent);

    }


    /*
        Check if the target was a DOM element that is a part of a 
        MenuItem instance and (if so), fire the associated custom event.
    */

    var oTarget = this._oEventUtil.getTarget(p_oEvent, true);

    if(
        oTarget.tagName == "A" && 
        oTarget.parentNode.parentNode.parentNode.parentNode == this.element
    ) {

        var nIndex = parseInt(oTarget.parentNode.getAttribute("index"), 10),
            oMenuItem = this._aMenuItems[nIndex];

        if(oMenuItem && !oMenuItem.cfg.getProperty("disabled")) {

            // Fire the associated custom event

            oMenuItem.keyPressEvent.fire(p_oEvent);

        }

    }


    // Fire the associated custom event

    this.keyPressEvent.fire(p_oEvent);

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
YAHOO.widget.Menu.prototype._onMenuItemFocus = function(p_sType, p_aArguments, p_aObjects) {

    var me = p_aObjects[0],
        oMenuItem = p_aObjects[1];

    me.setActiveMenuItem(oMenuItem);

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
YAHOO.widget.Menu.prototype._onMenuItemBlur = function(p_sType, p_aArguments, p_aObjects) {

    var me = p_aObjects[0],
        oMenuItem = p_aObjects[1],
        oSubmenu = oMenuItem.cfg.getProperty("submenu");

    if(!oSubmenu || (oSubmenu && !oSubmenu.cfg.getProperty("visible"))) {

        me.setActiveMenuItem(null);

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
YAHOO.widget.Menu.prototype._onMenuItemConfigChange = function(p_sType, p_aArguments, p_oMenu) {

    var sProperty = p_aArguments[0][0];

    switch(sProperty) {

        case "text":
        case "helptext":

            p_oMenu.cfg.refireEvent("width");

        break;

    }

};


// Public methods

/**
* Appends the specified MenuItem instance to a Menu instance.
* @param {YAHOO.widget.MenuItem} p_oMenuItem MenuItem instance to be added.
* @param {Number} p_nIndex Optional. Number indicating the ordinal position 
* at which the MenuItem should be added.
*/
YAHOO.widget.Menu.prototype.addMenuItem = function(p_oMenuItem, p_nIndex) {

    if(p_oMenuItem && p_oMenuItem instanceof YAHOO.widget.MenuItem) {

        p_oMenuItem.focusEvent.subscribe(
            this._onMenuItemFocus, 
            [this, p_oMenuItem]
        );

        p_oMenuItem.blurEvent.subscribe(
            this._onMenuItemBlur, 
            [this, p_oMenuItem]
        );

        p_oMenuItem.cfg.configChangedEvent.subscribe(
            this._onMenuItemConfigChange,
            this,
            true
        );

        this._addArrayItem(this._aMenuItems, p_oMenuItem, p_nIndex);

    }

};


/**
* Removes the specified MenuItem instance from a Menu instance.
* @param {YAHOO.widget.MenuItem/Number} p_oObject MenuItem or index of the
* MenuItem instance to be removed.
* @return Returns the MenuItem that was removed from the Menu.
* @type YAHOO.widget.MenuItem
*/
YAHOO.widget.Menu.prototype.removeMenuItem = function(p_oObject) {

    if(typeof p_oObject != "undefined") {

        var oMenuItem;

        if(p_oObject instanceof YAHOO.widget.MenuItem) {

            oMenuItem = this._removeArrayItemByValue(this._aMenuItems, p_oObject);           

        }
        else if(typeof p_oObject == "number") {

            oMenuItem = this._removeArrayItemByIndex(this._aMenuItems, p_oObject);

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
YAHOO.widget.Menu.prototype.getMenuItems = function() {

    return this._aMenuItems;

};


/**
* Removes the specified MenuItem instance from a Menu instance.
* @param {Number} p_nIndex Number indicating the ordinal position of the 
* Menu instance to be retrieved.
* @return Returns the MenuItem at the specified index.
* @type YAHOO.widget.MenuItem
*/
YAHOO.widget.Menu.prototype.getMenuItem = function(p_nIndex) {

    if(typeof p_nIndex == "number") {

        return this._aMenuItems[p_nIndex];

    }

};


/**
* Appends the specified Menu instance as a submenu of a Menu instance.
* @param {YAHOO.widget.MenuItem} p_oMenu Menu instance to be added.
* @param {Number} p_nIndex Optional. Number indicating the ordinal
* position at which the Menu should be added.
*/
YAHOO.widget.Menu.prototype.addSubmenu = function(p_oMenu, p_nIndex) {

    if(
        p_oMenu && 
        p_oMenu instanceof YAHOO.widget.Menu && 
        (
            (!this.parent || (this.parent && this.parent instanceof YAHOO.widget.MenuItem)) &&
            (p_oMenu.getSubmenus().length === 0)
        )
    ) {

        this._oDom.addClass(p_oMenu.element, "yuimenuddmenu");

        p_oMenu.cfg.setProperty("iframe", false);

        this._addArrayItem(this._aSubmenus, p_oMenu, p_nIndex);

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
YAHOO.widget.Menu.prototype.removeSubmenu = function(p_oObject) {

    if(typeof p_oObject != "undefined") {

        var oMenu;

        if(p_oObject instanceof YAHOO.widget.Menu) {

            oMenu = this._removeArrayItemByValue(this._aSubmenus, p_oObject);

        }
        else if(typeof p_oObject == "number") {

            oMenu = this._removeArrayItemByIndex(this._aSubmenus, p_oObject);

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
YAHOO.widget.Menu.prototype.getSubmenus = function() {

    return this._aSubmenus;

};


/**
* Removes the specified Menu instance from a Menu instance.
* @param {Number} p_nIndex Number indicating the ordinal position of the
* Menu instance to be retrieved.
* @return Returns the Menu at the specified index.
* @type YAHOO.widget.Menu
*/
YAHOO.widget.Menu.prototype.getSubmenu = function(p_nIndex) {

    if(typeof p_nIndex == "number") {

        return this._aSubmenus[p_nIndex];

    }

};


/**
* Iterates the Menu's collection of MenuItem instances and renders them.
*/
YAHOO.widget.Menu.prototype.renderMenuItems = function() {

    if(this._aMenuItems.length > 0) {            

        var i = this._aMenuItems.length - 1,
            oSubmenu;

        do {

            this._oListElement.insertBefore(
                this._aMenuItems[i].element, 
                this._oListElement.firstChild
            );

            oSubmenu = this._aMenuItems[i].cfg.getProperty("submenu");

            if(oSubmenu) {

                oSubmenu.render(this._aMenuItems[i].element);

            }

        }
        while(i--);

    }

};


/**
* Iterates the Menu's collection of Menu instances and renders them.
*/
YAHOO.widget.Menu.prototype.renderSubmenus = function() {

    if(this._aSubmenus.length > 0) {

        var nSubmenus = this._aSubmenus.length;

        for(var i=0; i<nSubmenus; i++) {

            this.appendToBody(this._aSubmenus[i].element);

            this._aSubmenus[i].render(this.body);

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
YAHOO.widget.Menu.prototype.render = function(p_bAppendToNode, p_bHideSourceElement) {

    /*
        If the menu contains MenuItem instances, create the list element 
        (UL) and append it to the body of the module
    */        

    if(this._aMenuItems.length > 0 && !this._oListElement) {
    
        var oUL = document.createElement("ul");
   
        this.setBody(oUL);

        this._oListElement = oUL;

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
YAHOO.widget.Menu.prototype.destroy = function() {

    // Remove DOM event handlers

    this._oEventUtil.removeListener(this.element, "mouseover", this._onElementMouseOver);
    this._oEventUtil.removeListener(this.element, "mouseout", this._onElementMouseOut);
    this._oEventUtil.removeListener(this.element, "mousedown", this._onElementMouseDown);
    this._oEventUtil.removeListener(this.element, "mouseup", this._onElementMouseUp);
    this._oEventUtil.removeListener(this.element, "click", this._onElementClick);
    this._oEventUtil.removeListener(this.element, "keydown", this._onElementKeyDown);
    this._oEventUtil.removeListener(this.element, "keyup", this._onElementKeyUp);
    this._oEventUtil.removeListener(this.element, "keypress", this._onElementKeyPress);


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


    var nMenuItems = this._aMenuItems.length,
        nSubmenus = this._aSubmenus.length,
        i;


    // Remove all MenuItem instances

    if(nMenuItems > 0) {

        i = nMenuItems - 1;

        do {

            this._aMenuItems[i].destroy();

        }
        while(i--);

    }        


    // Remove all Submenu instances

    if(nSubmenus > 0) {

        i = nSubmenus - 1;

        do {

            this._aSubmenus[i].destroy();

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
YAHOO.widget.Menu.prototype.enforceConstraints = function(type, args, obj) {

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


    var bSubmenu = (this.parent && this.parent instanceof YAHOO.widget.MenuItem);

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
YAHOO.widget.Menu.prototype.initDefaultConfig = function() {

    YAHOO.widget.Menu.superclass.initDefaultConfig.call(this);

    this.cfg.addProperty("initsubmenus", true);

};


/**
* Sets focus to a Menu instance's first enabled MenuItem instance.
*/
YAHOO.widget.Menu.prototype.setInitialFocus = function() {

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
YAHOO.widget.Menu.prototype.setInitialSelection = function() {

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
YAHOO.widget.Menu.prototype.setActiveMenuItem = function(p_oMenuItem) {

    if(this.parent && this.parent instanceof YAHOO.widget.Menu) {

        this.parent.setActiveMenuItem(p_oMenuItem);
   
    }
    else {

        if(p_oMenuItem && p_oMenuItem instanceof YAHOO.widget.MenuItem) {
    
            this._oActiveMenuItem = p_oMenuItem;
            this._oMenuManager.activeMenu = this;

        }
        else {

            this._oActiveMenuItem = null;
            this._oMenuManager.activeMenu = null;

        }
    
    }

};


/**
* Returns the MenuItem instance that has focus.
* @return Returns a MenuItem instance.
* @type YAHOO.widget.MenuItem
*/
YAHOO.widget.Menu.prototype.getActiveMenuItem = function() {

    if(this.parent && this.parent instanceof YAHOO.widget.Menu) {

        return this.parent.getActiveMenuItem();
    
    }
    else {
    
        return this._oActiveMenuItem;
    
    }

};



// Event handlers for configuration properties


/**
* Event handler for when the "iframe" configuration property of a
* Menu changes.
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.Menu} p_oMenu The Menu instance fired the event.
* @see YAHOO.widget.Overlay#configIframe
*/
YAHOO.widget.Menu.prototype.configIframe = function(p_sType, p_aArguments, p_oMenu) {

    YAHOO.widget.Menu.superclass.configIframe.call(
        this, 
        p_sType, 
        p_aArguments, 
        p_oMenu
    );

    var sPosition = this._oDom.getStyle(this.element, "position");

    if(this.iframe && (sPosition == "static" || sPosition == "relative")) {

        this.ifrathis.style.display = "none";

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
YAHOO.widget.Menu.prototype.configConstrainToViewport = function(p_sType, p_aArguments, p_oMenu) {

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

    if(this._aMenuItems.length > 0) {

        var i = this._aMenuItems.length - 1,
            oSubmenu;

        do {

            oSubmenu = this._aMenuItems[i].cfg.getProperty("submenu");

            if(oSubmenu) {

                oSubmenu.cfg.setProperty(
                    "constraintoviewport", 
                    bConstrainToViewport
                );

            }

        }
        while(i--);

    }

    if(this._aSubmenus.length > 0) {

        var n = this._aSubmenus.length - 1;

        do {

            this._aSubmenus[n].cfg.setProperty(
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
YAHOO.widget.Menu.prototype.configWidth = function(p_sType, p_aArguments, p_oMenu) {

    if(this.parent && !this.parent instanceof YAHOO.widget.Menu) {

        // Reset the width of the object
        this._oDom.setStyle(this.element, "width", "auto");

        var oMenuElementClone = this.element.cloneNode(true);
        document.body.appendChild(oMenuElementClone);

        var nBorderWidth = 
            parseInt(
                this._oDom.getStyle(oMenuElementClone, "borderLeftWidth"), 
                10
            );

        nBorderWidth += 
            parseInt(
                this._oDom.getStyle(oMenuElementClone, "borderRightWidth"), 
                10
            );

        var nPadding = 
            parseInt(
                this._oDom.getStyle(oMenuElementClone, "paddingLeft"), 
                10
            );

        nPadding += 
            parseInt(
                this._oDom.getStyle(oMenuElementClone, "paddingRight"), 
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

        p_aArguments[0] = this._oDom.getStyle(this.element, "width");

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
YAHOO.widget.Menu.prototype.configVisible = function(p_sType, p_aArguments, p_oMenu) {

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