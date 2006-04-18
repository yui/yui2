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
* (either HTMLSelectElement or HTMLDivElement) of the source HTMLElement node.
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
* Constant representing the type of MenuItem to instantiate when creating 
* MenuItem instances from parsing the child nodes (either HTMLLIElement, 
* HTMLOptGroupElement or HTMLOptionElement) of the Menu's DOM.  The default 
* is YAHOO.widget.MenuItem.
* @final
* @type YAHOO.widget.MenuItem
*/
YAHOO.widget.Menu.prototype.MENUITEM_TYPE = null;


/**
* Constant representing the tagname of the HTMLElement node to use to title 
* a group of MenuItem instances.
* @final
* @type String
*/
YAHOO.widget.Menu.prototype.GROUP_TITLE_TAG_NAME = "H6";


// Private properties

/**
* Array of HTMLElements used to title groups of MenuItem instances.
* @private
* @type {Array}
*/
YAHOO.widget.Menu.prototype._aGroupTitles = null;


/**
* Multi-dimensional array of MenuItem instances.
* @private
* @type {Array}
*/
YAHOO.widget.Menu.prototype._aMenuItemGroups = null;


/**
* An array of HTMLUListElements, each of which is the parent node of a MenuItem
* instance's HTMLLIElement node.
* @private
* @type {Array}
*/
YAHOO.widget.Menu.prototype._aListElements = null;


/**
* Reference to the Event utility singleton.
* @private
* @type {YAHOO.util.Event}
*/
YAHOO.widget.Menu.prototype._oEventUtil = YAHOO.util.Event;


/**
* Reference to the Dom utility singleton.
* @private
* @type {YAHOO.util.Dom}
*/
YAHOO.widget.Menu.prototype._oDom = YAHOO.util.Dom;


/**
* Reference to the MenuItem instance the mouse is currently over.
* @private
* @type {YAHOO.widget.MenuItem}
*/
YAHOO.widget.Menu.prototype._oCurrentMenuItem = null;


/** 
* The current state of the Menu's "mouseover" event
* @private
* @type {Boolean}
*/
YAHOO.widget.Menu.prototype._bFiredMouseOverEvent = false;


/** 
* The current state of the Menu's "mouseout" event
* @private
* @type {Boolean}
*/
YAHOO.widget.Menu.prototype._bFiredMouseOutEvent = false;


// Public properties

/**
* Reference to the MenuItem instance that has focus.
* @private
* @type {YAHOO.widget.MenuItem}
*/
YAHOO.widget.Menu.prototype.activeMenuItem = null;


/**
* Returns the parent MenuItem instance.
* @type {YAHOO.widget.MenuItem}
*/
YAHOO.widget.Menu.prototype.parent = null;


/**
* Returns the HTMLElement (either HTMLSelectElement or HTMLDivElement)
* used create the Menu instance.
* @type {HTMLSelectElement/HTMLDivElement}
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
* Fires when the user mouses down on a Menu instance.  Passes back the 
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


/**
* The Menu class's initialization method. This method is automatically called 
* by the constructor, and sets up all DOM references for pre-existing markup, 
* and creates required markup if it is not already present.
* @param {String/HTMLElement} p_oElement String id or HTMLElement 
* (either HTMLSelectElement or HTMLDivElement) of the source HTMLElement node.
* @param {Object} p_oUserConfig The configuration object literal containing 
* the configuration that should be set for this Menu. See configuration 
* documentation for more details.
*/
YAHOO.widget.Menu.prototype.init = function(p_oElement, p_oUserConfig) {

    if(!this.MENUITEM_TYPE) {

        this.MENUITEM_TYPE = YAHOO.widget.MenuItem;

    }


    this._aMenuItemGroups = [];
    this._aListElements = [];
    this._aGroupTitles = [];


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

                this.srcElement = oElement;

                /* 
                    Note that we don't pass the user config in here yet 
                    because we only want it executed once, at the lowest 
                    subclass level.
                */ 
            
                YAHOO.widget.Menu.superclass.init.call(this, oElement);

                this.beforeInitEvent.fire(YAHOO.widget.Menu);


                /*
                    Populate the collection of MenuItem groups and MenuItem
                    group titles
                */

                var oNode = this.body.firstChild, 
                    i = 0;

                do {

                    switch(oNode.tagName) {

                        case this.GROUP_TITLE_TAG_NAME:
                        
                            this._aGroupTitles[i] = oNode;

                        break;

                        case "UL":

                            this._aListElements[i] = oNode;
                            this._aMenuItemGroups[i] = [];
                            i++;

                        break;

                    }

                }
                while((oNode = oNode.nextSibling));


                /*
                    Apply the "first" class to the first UL to mimic 
                    the "first-child" psuedo class.
                */

                if(this._aListElements[0]) {

                    this._oDom.addClass(this._aListElements[0], "first");

                }

    
            break;
    
            case "SELECT":
    
                this.srcElement = oElement;
    
    
                /*
                    The source element is not something that we can use 
                    outright, so we need to create a new Overlay
                */
    
                var sId = this._oDom.generateId();

                /* 
                    Note that we don't pass the user config in here yet 
                    because we only want it executed once, at the lowest 
                    subclass level.
                */ 
            
                YAHOO.widget.Menu.superclass.init.call(this, sId); 

                this.beforeInitEvent.fire(YAHOO.widget.Menu);

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

        this.beforeInitEvent.fire(YAHOO.widget.Menu);

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
            this._onDOMEvent, 
            this,
            true
        );

        this._oEventUtil.addListener(
            this.element, 
            "mouseup", 
            this._onDOMEvent, 
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
            this._onDOMEvent, 
            this,
            true
        );

        this._oEventUtil.addListener(
            this.element, 
            "keyup", 
            this._onDOMEvent, 
            this,
            true
        );

        this._oEventUtil.addListener(
            this.element, 
            "keypress", 
            this._onDOMEvent, 
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


        // Subscribe to Custom Events

        this.initEvent.subscribe(this._onMenuInit, this, true);
        this.beforeRenderEvent.subscribe(this._onMenuBeforeRender, this, true);
        this.renderEvent.subscribe(this._onMenuRender, this, true);
        this.hideEvent.subscribe(this._onMenuHide, this, true);


        if(p_oUserConfig) {
    
            this.cfg.applyConfig(p_oUserConfig);
    
        }

    }

    this.initEvent.fire(YAHOO.widget.Menu);

};


// Private methods

/**
* Adds a MenuItem instance to a group of MenuItem instances.
* @private
* @param {Number} p_nGroupIndex Number indicating the group to which
* the MenuItem belongs.
* @param {YAHOO.widget.MenuItem} p_oMenuItem The MenuItem instance to be added.
* @param {Number} p_nMenuItemIndex Optional. Index at which the MenuItem 
* should be added.
* @return The MenuItem that was added to the Menu.
* @type YAHOO.widget.MenuItem
*/
YAHOO.widget.Menu.prototype._addMenuItemToGroup = function(p_nGroupIndex, p_oMenuItem, p_nMenuItemIndex) {

    if(typeof p_nMenuItemIndex == "number") {

        var nGroupIndex = typeof p_nGroupIndex == "number" ? p_nGroupIndex : 0,
            aGroup = this._getMenuItemGroup(nGroupIndex);

        if(!aGroup) {

            aGroup = this._createMenuItemGroup(nGroupIndex);

        }

        var bFirstInsertion = (aGroup.length === 0);


        if(aGroup[p_nMenuItemIndex]) {

            aGroup.splice(p_nMenuItemIndex, 0, p_oMenuItem);

        }
        else {

            aGroup[p_nMenuItemIndex] = p_oMenuItem;

        }


        var oMenuItem = aGroup[p_nMenuItemIndex];

        if(oMenuItem) {

            if(bFirstInsertion && !oMenuItem.element.parentNode) {
    
                this._aListElements[nGroupIndex].appendChild(oMenuItem.element);

            }
            else {

                function getNextMenuItemSibling(p_aArray, p_nStartIndex) {
        
                    return p_aArray[p_nStartIndex] || getNextMenuItemSibling(p_aArray, (p_nStartIndex+1));
        
                }


                var oNextMenuItemSibling = getNextMenuItemSibling(aGroup, (p_nMenuItemIndex+1));

                if(oNextMenuItemSibling && !oMenuItem.element.parentNode) {
        
                    this._aListElements[nGroupIndex].insertBefore(oMenuItem.element, oNextMenuItemSibling.element);
    
                }

            }


            oMenuItem.parent = this;
    
            this._subscribeToMenuItemEvents(oMenuItem);

            this._configureMenuItemSubmenu(oMenuItem);
            
            this._updateMenuItemProperties(nGroupIndex);
    
            return oMenuItem;

        }

    }
    else {

        var nGroupIndex = typeof p_nGroupIndex == "number" ? p_nGroupIndex : 0,
            aGroup = this._getMenuItemGroup(nGroupIndex);

        if(!aGroup) {

            aGroup = this._createMenuItemGroup(nGroupIndex);

        }

        var nMenuItemIndex = aGroup.length;

        aGroup[nMenuItemIndex] = p_oMenuItem;


        var oMenuItem = aGroup[nMenuItemIndex];

        if(oMenuItem) {

            if(!this._oDom.isAncestor(this._aListElements[nGroupIndex], oMenuItem.element)) {

                this._aListElements[nGroupIndex].appendChild(oMenuItem.element);

            }

            oMenuItem.element.setAttribute("groupindex", nGroupIndex);
            oMenuItem.element.setAttribute("index", nMenuItemIndex);
    
            oMenuItem.parent = this;

            oMenuItem.index = nMenuItemIndex;
            oMenuItem.groupIndex = nGroupIndex;
    
            this._subscribeToMenuItemEvents(oMenuItem);

            this._configureMenuItemSubmenu(oMenuItem);

            if(nMenuItemIndex === 0) {
    
                this._oDom.addClass(oMenuItem.element, "first");
    
            }
    
            return oMenuItem;

        }

    }

};


/**
* Removes a MenuItem instance from a group of MenuItem instances by index.
* @private
* @param {Number} p_nGroupIndex Number indicating the group to which
* the MenuItem belongs.
* @param {Number} p_nMenuItem Number indicating the index of the MenuItem to  
* be removed.
* @return The MenuItem instance that was removed.
* @type YAHOO.widget.MenuItem
*/    
YAHOO.widget.Menu.prototype._removeMenuItemFromGroupByIndex = function(p_nGroupIndex, p_nMenuItem) {

    var nGroupIndex = typeof p_nGroupIndex == "number" ? p_nGroupIndex : 0,
        aGroup = this._getMenuItemGroup(nGroupIndex),
        aArray = aGroup.splice(p_nMenuItem, 1),
        oMenuItem = aArray[0];

    if(oMenuItem) {

        // Update the index and className properties of each member        
        
        this._updateMenuItemProperties(nGroupIndex);

        if(aGroup.length === 0) {

            // Remove the UL from the Menu's DOM

            var oUL = this._aListElements[nGroupIndex];

            if(this.body && oUL) {

                this.body.removeChild(oUL);

            }

            // Remove the group from the array of MenuItems

            this._aMenuItemGroups.splice(nGroupIndex, 1);


            // Remove the UL from the array of ULs

            this._aListElements.splice(nGroupIndex, 1);


            // Assign the "first" class to the new first UL in the collection

            oUL = this._aListElements[0];

            if(oUL) {

                this._oDom.addClass(oUL, "first");

            }            

        }


        // Return a reference to the MenuItem instance that was removed
    
        return oMenuItem;

    }

};


/**
* Removes a MenuItem instance from a group of MenuItem instances by reference.
* @private
* @param {Number} p_nGroupIndex Number indicating the group to which
* the MenuItem belongs.
* @param {YAHOO.widget.MenuItem} p_oMenuItem The MenuItem to be removed.
* @return The MenuItem instance that was removed.
* @type YAHOO.widget.MenuItem
*/    
YAHOO.widget.Menu.prototype._removeMenuItemFromGroupByValue = function(p_nGroupIndex, p_oMenuItem) {

    var aGroup = this._getMenuItemGroup(p_nGroupIndex),
        nMenuItems = aGroup.length,
        nMenuItemIndex = -1;

    if(nMenuItems > 0) {

        var i = nMenuItems-1;
    
        do {
    
            if(aGroup[i] == p_oMenuItem) {
    
                nMenuItemIndex = i;
                break;    
    
            }
    
        }
        while(i--);
    
        if(nMenuItemIndex > -1) {
    
            return this._removeMenuItemFromGroupByIndex(p_nGroupIndex, nMenuItemIndex);
    
        }

    }

};


/**
* Updates the index, groupindex, and className properties of MenuItem instances
* in the specified group. 
* @private
* @param {Number} p_nGroupIndex Number indicating the group of MenuItem
* instances to update.
*/
YAHOO.widget.Menu.prototype._updateMenuItemProperties = function(p_nGroupIndex) {

    var aGroup = this._getMenuItemGroup(p_nGroupIndex),
        nMenuItems = aGroup.length;

    if(nMenuItems > 0) {

        var i = nMenuItems - 1,
            oMenuItem;

        // Update the index and className properties of each member        
    
        do {

            if(aGroup[i]) {
    
                aGroup[i].index = i;
                aGroup[i].groupIndex = p_nGroupIndex;
                aGroup[i].element.setAttribute("groupindex", p_nGroupIndex);
                aGroup[i].element.setAttribute("index", i);
                this._oDom.removeClass(aGroup[i].element, "first");

                oMenuItem = aGroup[i];

            }
    
        }
        while(i--);


        this._oDom.addClass(oMenuItem.element, "first");


    }

};


/**
* Creates a new MenuItem group (array) and it's associated HTMLUlElement node 
* @private
* @param {Number} p_nIndex Number indicating the group to create.
* @return A MenuItem group.
* @type Array
*/
YAHOO.widget.Menu.prototype._createMenuItemGroup = function(p_nIndex) {

    if(!this._aMenuItemGroups[p_nIndex]) {

        this._aMenuItemGroups[p_nIndex] = [];

        var oUL = document.createElement("ul");

        this._aListElements[p_nIndex] = oUL;

        return this._aMenuItemGroups[p_nIndex];

    }

};


/**
* Returns the MenuItem group at the specified index.
* @private
* @param {Number} p_nIndex Number indicating the index of the MenuItem group to
* be retrieved.
* @return An array of MenuItem instances.
* @type Array
*/
YAHOO.widget.Menu.prototype._getMenuItemGroup = function(p_nIndex) {

    var nIndex = ((typeof p_nIndex == "number") ? p_nIndex : 0);

    return this._aMenuItemGroups[nIndex];

};


/**
* Adds a subscriber to a Menu instance's renderEvent so submenus are rendered
* once their parent Menu has rendered.
* @private
* @param {YAHOO.widget.MenuItem} p_oMenuItem The MenuItem instance to listen
* for events on.
*/
YAHOO.widget.Menu.prototype._configureMenuItemSubmenu = function(p_oMenuItem) {

    var oSubmenu = p_oMenuItem.cfg.getProperty("submenu");

    if(oSubmenu) {

        // Subscribe the submenu to it's parent Menu instance's events

        /*
            Listen for configuration changes to the parent Menu instance so 
            they they can be applied to the submenu.
        */

        this.cfg.configChangedEvent.subscribe(
            this._onParentMenuConfigChange, 
            oSubmenu, 
            true
        );
        
        this.renderEvent.subscribe(this._onParentMenuRender, oSubmenu, true);

        oSubmenu.beforeShowEvent.subscribe(
            this._onSubmenuBeforeShow, 
            oSubmenu, 
            true
        );

        oSubmenu.showEvent.subscribe(this._onSubmenuShow, oSubmenu, true);

        oSubmenu.hideEvent.subscribe(this._onSubmenuHide, oSubmenu, true);

    }

};


/**
* Subscribes a Menu instance to the specified MenuItem instance's Custom Events.
* @private
* @param {YAHOO.widget.MenuItem} p_oMenuItem The MenuItem instance to listen
* for events on.
*/
YAHOO.widget.Menu.prototype._subscribeToMenuItemEvents = function(p_oMenuItem) {

    var aArguments = [this, p_oMenuItem];

    p_oMenuItem.focusEvent.subscribe(this._onMenuItemFocus, aArguments);

    p_oMenuItem.blurEvent.subscribe(this._onMenuItemBlur, aArguments);

    p_oMenuItem.cfg.configChangedEvent.subscribe(
        this._onMenuItemConfigChange,
        aArguments
    );

};


/**
* Returns the offset width of a Menu instance.
* @private
*/
YAHOO.widget.Menu.prototype._getOffsetWidth = function() {

    var oClone = this.element.cloneNode(true);

    this._oDom.setStyle(oClone, "width", "");

    document.body.appendChild(oClone);

    var sWidth = oClone.offsetWidth;

    document.body.removeChild(oClone);

    return sWidth;

};


/**
* Determines if a DOM event was fired on a MenuItem instance and (if so)
* fires the MenuItem's associated Custom Event
* @private
* @param {HTMLElement} p_oElement The original target of the event.
* @param {String} p_sEventType The type/name of the Custom Event to fire.
* @param {Event} p_oDOMEvent The DOM event to pass back when firing the 
* Custom Event.
* @return A MenuItem instance.
* @type YAHOO.widget.MenuItem
*/
YAHOO.widget.Menu.prototype._fireMenuItemEvent = function(p_oElement, p_sEventType, p_oDOMEvent) {

    var me = this;


    // Returns the specified element's parent HTMLLIElement (<LI>)

    function getMenuItemElement(p_oElement) {
    
        if(p_oElement == me.element) {

            return;
        
        }
        else if(p_oElement.tagName == "LI") {
    
            return p_oElement;
    
        }
        else if(p_oElement.parentNode) {

            return getMenuItemElement(p_oElement.parentNode);
    
        }
    
    }


    var oElement = getMenuItemElement(p_oElement);

    if(oElement) {

        /*
            Retrieve the MenuItem instance that corresponds to the 
            HTMLLIElement (<LI>) and fire the Custom Event        
        */

        var nGroupIndex = parseInt(oElement.getAttribute("groupindex"), 10),
            nIndex = parseInt(oElement.getAttribute("index"), 10),
            oMenuItem = this._aMenuItemGroups[nGroupIndex][nIndex];

        if(!oMenuItem.cfg.getProperty("disabled")) {

            oMenuItem[p_sEventType].fire(p_oDOMEvent);

            return oMenuItem;

        }

    }

};


// Private DOM event handlers

/**
* Generic event handler for the Menu's root HTMLDivElement.  Used to handle the
* "mousedown," "mouseup," "keydown," "keyup," and "keypress" events.
* @private
* @param {Event} p_oEvent Event object passed back by the 
* event utility (YAHOO.util.Event).
* @param {YAHOO.widget.Menu} p_oMenu The Menu instance corresponding to the 
* HTMLDivElement that fired the event.
*/
YAHOO.widget.Menu.prototype._onDOMEvent = function(p_oEvent, p_oMenu) {

    // Map of DOM event types to Custom Event types
    
    var oEventTypes =  {
            "mousedown": "mouseDownEvent",
            "mouseup": "mouseUpEvent",
            "keydown": "keyDownEvent",
            "keyup": "keyUpEvent",
            "keypress": "keyPressEvent"
        },

        sCustomEventType = oEventTypes[p_oEvent.type],
    
        oTarget = this._oEventUtil.getTarget(p_oEvent, true);

    /*
        Check if the target was an element that is a part of a 
        MenuItem instance and (if so), fire the associated custom event.
    */

    this._fireMenuItemEvent(oTarget, sCustomEventType, p_oEvent);


    // Fire the associated custom event for the Menu

    this[sCustomEventType].fire(p_oEvent);


    /*
        Stop the propagation of the event at each Menu instance
        since Menus can be embedded in eachother.
    */
        
    this._oEventUtil.stopPropagation(p_oEvent);

};


/**
* "mouseover" event handler for the Menu's root HTMLDivElement.
* @private
* @param {Event} p_oEvent Event object passed back by the 
* event utility (YAHOO.util.Event).
* @param {YAHOO.widget.Menu} p_oMenu The Menu instance corresponding to the 
* HTMLDivElement that fired the event.
*/
YAHOO.widget.Menu.prototype._onElementMouseOver = function(p_oEvent, p_oMenu) {

    var oTarget = this._oEventUtil.getTarget(p_oEvent, true);

    if(
        (
            oTarget == this.element || 
            this._oDom.isAncestor(this.element, oTarget)
        )  && 
        !this._bFiredMouseOverEvent
    ) {

        // Fire the "mouseover" Custom Event for the Menu instance

        this.mouseOverEvent.fire(p_oEvent);

        this._bFiredMouseOverEvent = true;
        this._bFiredMouseOutEvent = false;

    }


    /*
        Check if the target was an element that is a part of a 
        MenuItem instance and (if so), fire the "mouseover" Custom Event.
    */

    if(!this._oCurrentMenuItem) {

        this._oCurrentMenuItem = 
            this._fireMenuItemEvent(oTarget, "mouseOverEvent", p_oEvent);

    }


    /*
        Stop the propagation of the event at each Menu instance
        since Menus can be embedded in eachother.
    */

    this._oEventUtil.stopPropagation(p_oEvent);

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

    var oRelatedTarget = this._oEventUtil.getRelatedTarget(p_oEvent),
        bLIMouseOut = true,
        bMovingToSubmenu = false;


    // Determine where the mouse is going

    if(this._oCurrentMenuItem && oRelatedTarget) {

        if(
            oRelatedTarget == this._oCurrentMenuItem.element || 
            this._oDom.isAncestor(this._oCurrentMenuItem.element, oRelatedTarget)
        ) {

            bLIMouseOut = false;

        }


        var oSubmenu = this._oCurrentMenuItem.cfg.getProperty("submenu");

        if(
            oSubmenu && 
            (
                oRelatedTarget == oSubmenu.element ||
                this._oDom.isAncestor(oSubmenu.element, oRelatedTarget)
            )
        ) {

            bMovingToSubmenu = true;

        }

    }


    if(this._oCurrentMenuItem && (bLIMouseOut || bMovingToSubmenu)) {

        // Fire the "mouseout" Custom Event for the MenuItem instance

        this._oCurrentMenuItem.mouseOutEvent.fire(p_oEvent);

        this._oCurrentMenuItem = null;

    }


    if(
        !this._bFiredMouseOutEvent && 
        (
            !this._oDom.isAncestor(this.element, oRelatedTarget) ||
            bMovingToSubmenu
        )
    ) {

        // Fire the "mouseout" Custom Event for the Menu instance

        this.mouseOutEvent.fire(p_oEvent);

        this._bFiredMouseOutEvent = true;
        this._bFiredMouseOverEvent = false;

    }


    /*
        Stop the propagation of the event at each Menu instance
        since Menus can be embedded in eachother.
    */

    this._oEventUtil.stopPropagation(p_oEvent);

};


/**
* "click" event handler for the Menu's root HTMLDivElement.
* @private
* @param {Event} p_oEvent Event object passed back by the 
* event utility (YAHOO.util.Event).
* @param {YAHOO.widget.Menu} p_oMenu The Menu instance corresponding to the 
* HTMLDivElement that fired the event.
*/         
YAHOO.widget.Menu.prototype._onElementClick = function(p_oEvent, p_oMenu) {

    var oTarget = this._oEventUtil.getTarget(p_oEvent, true),

        /*
            Check if the target was a DOM element that is a part of a 
            MenuItem instance and (if so), fire the associated "click" 
            Custom Event.
        */
    
        oMenuItem = this._fireMenuItemEvent(oTarget, "clickEvent", p_oEvent),

        bCurrentPageURL; // Indicates if the URL points to the current page


    if(oMenuItem) {

        var sURL = oMenuItem.cfg.getProperty("url"),
            oSubmenu = oMenuItem.cfg.getProperty("submenu");
        
        bCurrentPageURL = (sURL.substr((sURL.length-1),1) == "#");

        /*
            ACCESSIBILITY FEATURE FOR SCREEN READERS: Expand/collapse the
            submenu when the user clicks on the submenu indicator image.
        */        

        if(oTarget == oMenuItem.subMenuIndicator && oSubmenu) {
    
            if(oSubmenu.cfg.getProperty("visible")) {
    
                oSubmenu.hide();
    
                oMenuItem.focus();
    
            }
            else {
    
                oMenuItem.cfg.setProperty("selected", true);
                
                oSubmenu.show();
    
                oSubmenu.setInitialSelection();

                /*
                    Setting focus to the newly visible submenu alerts the 
                    contents of the submenu to the screen reader.
                */

                oSubmenu.setInitialFocus();
    
            }                
    
        }
        else if(!bCurrentPageURL) {
            
            /*
                Follow the URL of the MenuItem regardless of whether or 
                not the user clicked specifically on the
                HTMLAnchorElement (<A>) node.
            */

            document.location = sURL;
    
        }
    
    }
        

    switch(oTarget.tagName) {
    
        case "A":
        
            if(bCurrentPageURL) {

                // Don't follow URLs that are equal to "#"

                this._oEventUtil.preventDefault(p_oEvent);
            
            }
            else {

                /*
                    Break if the anchor's URL is something other than "#" to
                    prevent the call to "stopPropagation" from be executed.
                    This is required for Safari to be able to follow the URL.
                */
            
                break;
            
            }
        
        default:

            /*
                Stop the propagation of the event at each Menu instance
                since Menus can be embedded in eachother.
            */

            this._oEventUtil.stopPropagation(p_oEvent);
        
        break;
    
    }


    // Fire the associated "click" Custom Event for the Menu instance

    this.clickEvent.fire(p_oEvent);

};


// Private Custom Event handlers

/**
* "init" Custom Event handler for a Menu instance.  Iterates a Menu instance's 
* child nodes and instantiates MenuItem and submenu instances.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.Menu} p_oMenu The Menu instance that fired the event.
*/
YAHOO.widget.Menu.prototype._onMenuInit = function(p_sType, p_aArguments, p_oMenu) {

    if(this.srcElement) {

        var bInitSubmenus = this.cfg.getProperty("initsubmenus"),
            oNode;


        switch(this.srcElement.tagName) {
    
            case "DIV":
    
                if(this._aListElements.length > 0) {
    
                    var i = this._aListElements.length - 1;

                    do {
            
                        oNode = this._aListElements[i].firstChild;
        
                        do {
        
                            switch(oNode.tagName) {
            
                                case "LI":
            
                                    this.addMenuItem(
                                        
                                        new this.MENUITEM_TYPE(
                                            oNode, 
                                            { initsubmenus: bInitSubmenus }
                                        ),
                                        i
                                        
                                    );
            
                                break;
            
                            }
                
                        }
                        while((oNode = oNode.nextSibling));
                
                    }
                    while(i--);
    
                }
    
            break;
    
            case "SELECT":
    
                oNode = this.srcElement.firstChild;
    
                do {
    
                    switch(oNode.tagName) {
    
                        case "OPTGROUP":
                        case "OPTION":
    
                            this.addMenuItem(
                                (
                                    new this.MENUITEM_TYPE(
                                        oNode, 
                                        { initsubmenus: bInitSubmenus }
                                    )
                                )
                            );
    
                        break;
    
                    }
    
                }
                while((oNode = oNode.nextSibling));
    
            break;
    
        }

    }

};


/**
* "beforerender" Custom Event handler for a Menu instance.  Appends all of the 
* HTMLUListElement (<UL>s) nodes (and their child HTMLLIElement (<LI>)) nodes 
* and their accompanying title nodes to the body of the Menu instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.Menu} p_oMenu The Menu instance that fired the event.
*/
YAHOO.widget.Menu.prototype._onMenuBeforeRender = function(p_sType, p_aArguments, p_oMenu) {

    var nListElements = this._aListElements.length;

    if(nListElements > 0) {

        var i = 0, 
            bFirstList = true,
            bFirstTitle = true;

        do {

            if(this._aListElements[i]) {

                if(bFirstList) {
        
                    this._oDom.addClass(this._aListElements[i], "first");
                    bFirstList = false;
        
                }


                if(!this._oDom.isAncestor(this.element, this._aListElements[i])) {

                    this.appendToBody(this._aListElements[i]);

                }


                if(this._aGroupTitles[i]) {

                    if(!this._oDom.isAncestor(this.element, this._aGroupTitles[i])) {

                        this._aListElements[i].parentNode.insertBefore(this._aGroupTitles[i], this._aListElements[i]);

                    }

                    if(bFirstTitle) {
                    
                        this._oDom.addClass(this._aGroupTitles[i], "first");
                        bFirstTitle = false;
                    
                    }

                    this._oDom.addClass(this._aListElements[i], "hastitle");

                }

            }

            i++;

        }
        while(i < nListElements);

    }

};


/**
* "render" Custom Event handler for a Menu instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.Menu} p_oMenu The Menu instance that fired the event.
*/
YAHOO.widget.Menu.prototype._onMenuRender = function(p_sType, p_aArguments, p_oMenu) {

    var sWidth = this.element.parentNode.tagName == "BODY" ? 
            this.element.offsetWidth : this._getOffsetWidth();

    this.cfg.setProperty("width", (sWidth + "px"));

};


/**
* "hide" Custom Event handler for a Menu instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.Menu} p_oMenu The Menu instance that fired the event.
*/
YAHOO.widget.Menu.prototype._onMenuHide = function(p_sType, p_aArguments, p_oMenu) {

    if(this.activeMenuItem) {

        if(this.activeMenuItem.cfg.getProperty("selected")) {

            this.activeMenuItem.cfg.setProperty("selected", false);

        }

        var oSubmenu = this.activeMenuItem.cfg.getProperty("submenu");

        if(oSubmenu && oSubmenu.cfg.getProperty("visible")) {

            oSubmenu.hide();

        }

    }

};


/**
* "configchange" Custom Event handler for a Menu instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.Menu} p_oSubmenu The submenu instance that subscribed 
* to the event.
*/
YAHOO.widget.Menu.prototype._onParentMenuConfigChange = function(p_sType, p_aArguments, p_oSubmenu) {

    var sPropertyName = p_aArguments[0][0],
        sPropertyValue = p_aArguments[0][1];

    switch(sPropertyName) {

        case "iframe":
        case "constraintoviewport":

            p_oSubmenu.cfg.setProperty(sPropertyName, sPropertyValue);
        
        break;
        
    }

};


/**
* "render" Custom Event handler for a Menu instance.  Renders a submenu in 
* response to the firing of it's parent's "render" event.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.Menu} p_oSubmenu The submenu instance that subscribed 
* to the event.
*/
YAHOO.widget.Menu.prototype._onParentMenuRender = function(p_sType, p_aArguments, p_oSubmenu) {

    /*
        Set the "iframe" and "constraintoviewport" configuration 
        properties to match the parent Menu
    */ 

    var oParentMenu = p_oSubmenu.parent.parent;

    p_oSubmenu.cfg.applyConfig(
    
        {
            constraintoviewport: 
                oParentMenu.cfg.getProperty("constraintoviewport"),

            xy: [0,0],

            iframe: oParentMenu.cfg.getProperty("iframe")

        }
    
    );


    if(this._oDom.inDocument(this.element)) {

        this.render();

    }
    else {

        this.render(this.parent.element);

    }

};


/**
* "beforeshow" Custom Event handler for a submenu instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.Menu} p_oSubmenu The submenu instance that fired
* the event.
*/
YAHOO.widget.Menu.prototype._onSubmenuBeforeShow = function(p_sType, p_aArguments, p_oSubmenu) {

    this.cfg.setProperty(
        "context", 
        [
            this.parent.element, 
            this.parent.SUBMENU_ALIGNMENT[0], 
            this.parent.SUBMENU_ALIGNMENT[1]
        ]
    );

};


/**
* "show" Custom Event handler for a submenu instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.Menu} p_oSubmenu The submenu instance that fired
* the event.
*/
YAHOO.widget.Menu.prototype._onSubmenuShow = function(p_sType, p_aArguments, p_oSubmenu) {

    this.parent.subMenuIndicator.alt = 
        this.parent.EXPANDED_SUBMENU_INDICATOR_ALT_TEXT;

};


/**
* "hide" Custom Event handler for a submenu instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.Menu} p_oSubmenu The submenu instance that fired
* the event.
*/
YAHOO.widget.Menu.prototype._onSubmenuHide = function(p_sType, p_aArguments, p_oSubmenu) {

    this.parent.subMenuIndicator.alt = 
        this.parent.COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT;

};


/**
* "focus" YAHOO.util.CustomEvent handler for the Menu's
* MenuItem instance(s).
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {Array} p_aObjects Array containing the current Menu instance and the 
* MenuItem instance that fired the event.
*/
YAHOO.widget.Menu.prototype._onMenuItemFocus = function(p_sType, p_aArguments, p_aObjects) {

    var me = p_aObjects[0],
        oMenuItem = p_aObjects[1];

    me.activeMenuItem = oMenuItem;

};


/**
* "blur" YAHOO.util.CustomEvent handler for the Menu's
* MenuItem instance(s).
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {Array} p_aObjects Array containing the current Menu instance and the 
* MenuItem instance that fired the event.
*/
YAHOO.widget.Menu.prototype._onMenuItemBlur = function(p_sType, p_aArguments, p_aObjects) {

    var me = p_aObjects[0],
        oMenuItem = p_aObjects[1],
        oSubmenu = oMenuItem.cfg.getProperty("submenu");

    if(!oSubmenu || (oSubmenu && !oSubmenu.cfg.getProperty("visible"))) {

        me.activeMenuItem = null;

    }

};


/**
* "configchange" YAHOO.util.CustomEvent handler for the Menu's 
* MenuItem instance(s).
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the 
* event was fired.
* @param {Array} p_aObjects Array containing the current Menu instance and the 
* MenuItem instance that fired the event.
*/
YAHOO.widget.Menu.prototype._onMenuItemConfigChange = function(p_sType, p_aArguments, p_aObjects) {

    var sProperty = p_aArguments[0][0],
        me = p_aObjects[0],
        oMenuItem = p_aObjects[1];

    switch(sProperty) {

        case "submenu":

            var oSubmenu = p_aArguments[0][1];

            if(oSubmenu) {

                me._configureMenuItemSubmenu(oMenuItem);

            }

        break;

        case "text":
        case "helptext":

            /*
                A change to a MenuItem instance's "text" or "helptext"
                configuration properties requires the width of the parent
                Menu instance to be recalculated.
            */

            if(me.element.style.width) {
    
                var sWidth = me._getOffsetWidth() + "px";

                me._oDom.setStyle(me.element, "width", sWidth);

            }

        break;

    }

};


/**
* Keeps the Menu in the viewport.
* @see YAHOO.widget.Overlay#enforceConstraints
*/
YAHOO.widget.Menu.prototype.enforceConstraints = function(type, args, obj) {

    var pos = args[0],

        x = pos[0],
        y = pos[1],

        bod = document.getElementsByTagName('body')[0],
        htm = document.getElementsByTagName('html')[0],
    
        bodyOverflow = YAHOO.util.Dom.getStyle(bod, "overflow"),
        htmOverflow = YAHOO.util.Dom.getStyle(htm, "overflow"),

        offsetHeight = this.element.offsetHeight,
        offsetWidth = this.element.offsetWidth,
    
        viewPortWidth = YAHOO.util.Dom.getClientWidth(),
        viewPortHeight = YAHOO.util.Dom.getClientHeight(),
    
        scrollX = window.scrollX || document.body.scrollLeft,
        scrollY = window.scrollY || document.body.scrollTop,
    
        topConstraint = scrollY + 10,
        leftConstraint = scrollX + 10,
        bottomConstraint = scrollY + viewPortHeight - offsetHeight - 10,
        rightConstraint = scrollX + viewPortWidth - offsetWidth - 10,
    
        aContext = this.cfg.getProperty("context"),
        oContextElement = aContext ? aContext[0] : null;


    if (x < 10) {

        x = leftConstraint;

    } else if ((x + offsetWidth) > viewPortWidth) {

        if(
            oContextElement && 
            ((x - oContextElement.offsetWidth) > offsetWidth)
        ) {

            x = (x - (oContextElement.offsetWidth + offsetWidth));

        }
        else {

            x = rightConstraint;

        }

    }

    if (y < 10) {

        y = topConstraint;

    } else if (y > bottomConstraint) {

        if(oContextElement && (y > offsetHeight)) {

            y = ((y + oContextElement.offsetHeight) - offsetHeight);

        }
        else {

            y = bottomConstraint;

        }

    }

    this.cfg.setProperty("x", x, true);
    this.cfg.setProperty("y", y, true);

};


// Public methods

/**
* Sets the title of a group of MenuItem instances.
* @param {String} p_sGroupTitle The title of the MenuItem group.
* @param {Number} p_nGroupIndex Optional. Number indicating the group to which
* the MenuItem belongs.
*/
YAHOO.widget.Menu.prototype.setMenuGroupTitle = function(p_sGroupTitle, p_nGroupIndex) {
    
    if(typeof p_sGroupTitle == "string" && p_sGroupTitle.length > 0) {

        var oGroupTitleElement = 
                document.createElement(this.GROUP_TITLE_TAG_NAME),
            oGroupTitleText = document.createTextNode(p_sGroupTitle),
            nGroupIndex = typeof p_nGroupIndex == "number" ? p_nGroupIndex : 0;
    
        oGroupTitleElement.appendChild(oGroupTitleText);
    
        this._aGroupTitles[nGroupIndex] = oGroupTitleElement;

    }

};


/**
* Appends the specified MenuItem instance to a Menu instance.
* @param {YAHOO.widget.MenuItem} p_oMenuItem MenuItem instance to be added.
* @param {Number} p_nGroupIndex Optional. Number indicating the group to which
* the MenuItem belongs.
* @return The MenuItem that was added to the Menu.
* @type YAHOO.widget.MenuItem
*/
YAHOO.widget.Menu.prototype.addMenuItem = function(p_oMenuItem, p_nGroupIndex) {

    if(p_oMenuItem && p_oMenuItem instanceof YAHOO.widget.MenuItem) {

        return this._addMenuItemToGroup(p_nGroupIndex, p_oMenuItem);

    }

};


/**
* Inserts a MenuItem instance into a Menu instance at the specified index.
* @param {YAHOO.widget.MenuItem} p_oMenuItem MenuItem instance to be inserted.
* @param {Number} p_nMenuItemIndex Number indicating the ordinal position 
* at which the MenuItem should be added.
* @param {Number} p_nGroupIndex Optional. Number indicating the group to which
* the MenuItem instance belongs.
* @return The MenuItem that was inserted into the Menu.
* @type YAHOO.widget.MenuItem
*/
YAHOO.widget.Menu.prototype.insertMenuItem = function(p_oMenuItem, p_nMenuItemIndex, p_nGroupIndex) {

    if(p_oMenuItem && p_oMenuItem instanceof YAHOO.widget.MenuItem) {

        return this._addMenuItemToGroup(p_nGroupIndex, p_oMenuItem, p_nMenuItemIndex);

    }

};


/**
* Removes the specified MenuItem instance from a Menu instance.
* @param {YAHOO.widget.MenuItem/Number} p_oObject MenuItem or index of the
* MenuItem instance to be removed.
* @param {Number} p_nGroupIndex Optional. Number indicating the group to which
* the MenuItem belongs.
* @return The MenuItem that was removed from the Menu.
* @type YAHOO.widget.MenuItem
*/
YAHOO.widget.Menu.prototype.removeMenuItem = function(p_oObject, p_nGroupIndex) {

    if(typeof p_oObject != "undefined") {

        var oMenuItem;

        if(p_oObject instanceof YAHOO.widget.MenuItem) {

            oMenuItem = this._removeMenuItemFromGroupByValue(p_nGroupIndex, p_oObject);           

        }
        else if(typeof p_oObject == "number") {

            oMenuItem = this._removeMenuItemFromGroupByIndex(p_nGroupIndex, p_oObject);

        }

        if(oMenuItem) {

            oMenuItem.destroy();

            return oMenuItem;

        }

    }

};


/**
* Returns a multi-dimensional array of all of a Menu's MenuItem instances.
* @return An array of MenuItem instances.
* @type Array
*/        
YAHOO.widget.Menu.prototype.getMenuItemGroups = function() {

    return this._aMenuItemGroups;

};


/**
* Returns the MenuItem instance at the specified index.
* @param {Number} p_nMenuItemIndex Number indicating the ordinal position of the 
* MenuItem instance to be retrieved.
* @param {Number} p_nGroupIndex Optional. Number indicating the group to which
* the MenuItem belongs.
* @return A MenuItem instance.
* @type YAHOO.widget.MenuItem
*/
YAHOO.widget.Menu.prototype.getMenuItem = function(p_nMenuItemIndex, p_nGroupIndex) {

    if(typeof p_nMenuItemIndex == "number") {

        var aGroup = this._getMenuItemGroup(p_nGroupIndex);

        if(aGroup) {

            return aGroup[p_nMenuItemIndex];
        
        }

    }

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


    var nMenuItemGroups = this._aMenuItemGroups.length,
        nMenuItems,
        i,
        n;


    // Remove all MenuItem instances

    if(nMenuItemGroups > 0) {

        i = nMenuItemGroups - 1;

        do {

            if(this._aMenuItemGroups[i]) {

                nMenuItems = this._aMenuItemGroups[i].length;
    
                if(nMenuItems > 0) {
    
                    n = nMenuItems - 1;
        
                    do {

                        if(this._aMenuItemGroups[i][n]) {
        
                            this._aMenuItemGroups[i][n].destroy();
                        }
        
                    }
                    while(n--);
    
                }

            }

        }
        while(i--);

    }        


    // Continue with the superclass implementation of this method

    YAHOO.widget.Menu.superclass.destroy.call(this);

};


/**
* Sets focus to a Menu instance's first enabled MenuItem instance.
*/
YAHOO.widget.Menu.prototype.setInitialFocus = function() {

    var oMenuItem = this._aMenuItemGroups[0][0];

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

    var oMenuItem = this._aMenuItemGroups[0][0];

    if(oMenuItem) {

        if(oMenuItem.cfg.getProperty("disabled")) {

            oMenuItem = oMenuItem.getNextEnabledSibling();

        }

        oMenuItem.cfg.setProperty("selected", true);

    }        

};


/**
* Initializes the class's configurable properties which can be changed using 
* the Menu's Config object (cfg).
*/
YAHOO.widget.Menu.prototype.initDefaultConfig = function() {

    YAHOO.widget.Menu.superclass.initDefaultConfig.call(this);

	// Add Menu config properties

//    this.cfg.addProperty("initsubmenus", true);

    this.cfg.addProperty("initsubmenus", { value:true } );
    this.cfg.queueProperty("visible", false);

};