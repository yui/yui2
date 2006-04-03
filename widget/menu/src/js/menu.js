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


// Private properties

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

                        this._oDom.generateId(oElement);

                    }
 
    
                    /* 
                        Note that we don't pass the user config in here yet 
                        because we only want it executed once, at the lowest 
                        subclass level.
                    */ 
                
                    YAHOO.widget.Menu.superclass.init.call(this, oElement.id); 
    
    
                    // Populate the collection of ULs

                    var oNode = this.body.firstChild, 
                        i = 0;

                    do {

                        switch(oNode.tagName) {

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


        if(p_oUserConfig) {
    
            this.cfg.applyConfig(p_oUserConfig);
    
        }

        if(this.srcElement) {

            this._initSubTree();

        }

    }

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

            this._subscribeSubMenuToRenderEvent(oMenuItem);
            
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

            if(
                !oMenuItem.element.parentNode || 

                // Check if the parentNode is a document fragment

                (
                    oMenuItem.element.parentNode && 
                    oMenuItem.element.parentNode.nodeType == 11
                )
            ) {

                this._aListElements[nGroupIndex].appendChild(oMenuItem.element);

            }

            oMenuItem.element.setAttribute("groupindex", nGroupIndex);
            oMenuItem.element.setAttribute("index", nMenuItemIndex);
    
            oMenuItem.parent = this;

            oMenuItem.index = nMenuItemIndex;
            oMenuItem.groupIndex = nGroupIndex;
    
            this._subscribeToMenuItemEvents(oMenuItem);

            this._subscribeSubMenuToRenderEvent(oMenuItem);

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
YAHOO.widget.Menu.prototype._subscribeSubMenuToRenderEvent = function(p_oMenuItem) {

    var oSubmenu = p_oMenuItem.cfg.getProperty("submenu");

    if(oSubmenu) {

        this.renderEvent.subscribe(this._onRender, oSubmenu);

    }

};


/**
* Subscribes a Menu instance to the specified MenuItem instance's Custom Events.
* @private
* @param {YAHOO.widget.MenuItem} p_oMenuItem The MenuItem instance to listen
* for events on.
*/
YAHOO.widget.Menu.prototype._subscribeToMenuItemEvents = function(p_oMenuItem) {

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
        [this, p_oMenuItem]
    );

};


/**
* Iterates the source element's childNodes collection and uses the child 
* nodes to instantiate Menu and MenuItem instances.
* @private
* @param {Array} p_aNode HTML Element
* objects that are direct descendants of the Menu's source element.
*/
YAHOO.widget.Menu.prototype._initSubTree = function() {

    switch(this.srcElement.tagName) {

        case "DIV":

            var nListElements = this._aListElements.length,
                i = 0,
                oNode;
    

            do {
    
                oNode = this._aListElements[i].firstChild;

                do {

                    switch(oNode.tagName) {
    
                        case "LI":
    
                            this.addMenuItem(
                                
                                new this.MENUITEM_TYPE(
                                    oNode, 
                                    { 
                                        initsubmenus: 
                                            (this.cfg.getProperty("initsubmenus"))
                                    }
                                ),
                                i
                                
                            );
    
                        break;
    
                    }
    
        
                }
                while((oNode = oNode.nextSibling));
    
                i++;
        
            }
            while(i<nListElements);

        break;

        case "SELECT":

            var oNode = this.srcElement.firstChild;

            do {

                switch(oNode.tagName) {

                    case "OPTGROUP":
                    case "OPTION":

                        this.addMenuItem(
                            (
                                new this.MENUITEM_TYPE(
                                    oNode, 
                                    { 
                                        initsubmenus: 
                                            (this.cfg.getProperty("initsubmenus"))
                                    }
                                )
                            )
                        );

                    break;

                }

            }
            while((oNode = oNode.nextSibling));

        break;

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
YAHOO.widget.Menu.prototype._onElementMouseOver = function(p_oEvent, p_oMenu) {

    /*
        Because Menus can be embedded in eachother, stop the 
        propagation of the event at each Menu instance to make handling 
        the event easier for the user.
    */

    this._oEventUtil.stopPropagation(p_oEvent);


    /*
        Calculate when the mouse has entered the Menu's root HTMLDivElement 
        to make handling the MouseOver event easier for the user.
    */

    var oTarget = this._oEventUtil.getTarget(p_oEvent, true);


    if(
        (
            oTarget == this.element || 
            this._oDom.isAncestor(this.element, oTarget)
        )  && 
        !this._bFiredMouseOverEvent
    ) {

        // Fire the associated custom event

        this.mouseOverEvent.fire(p_oEvent);

        this._bFiredMouseOverEvent = true;
        this._bFiredMouseOutEvent = false;

    }


    if(!this._oCurrentMenuItem) {

        var oNode = oTarget;
    
        do {

            if(
                oNode && 
                oNode.tagName == "LI" && 
                oNode.parentNode.parentNode.parentNode == this.element
            ) {

                var nGroupIndex = parseInt(oNode.getAttribute("groupindex"), 10),
                    nIndex = parseInt(oNode.getAttribute("index"), 10),
                    oMenuItem = this._aMenuItemGroups[nGroupIndex][nIndex];

                if(oMenuItem && !oMenuItem.cfg.getProperty("disabled")) {

                    // Keep a reference to the MenuItem
    
                    this._oCurrentMenuItem = oMenuItem;


                    // Fire the associated custom event

                    oMenuItem.mouseOverEvent.fire(p_oEvent);
            

                    // Deselect the previously active MenuItem

                    if(this.activeMenuItem && this.activeMenuItem != oMenuItem) {
            
                        if(this.activeMenuItem.cfg.getProperty("selected")) {
            
                            this.activeMenuItem.cfg.setProperty(
                                "selected", 
                                false
                            );
                
                        }
            
                    }


                    // Select and focus the current MenuItem

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
        
    this._oEventUtil.stopPropagation(p_oEvent);


    var oRelatedTarget = this._oEventUtil.getRelatedTarget(p_oEvent);

    var bLIMouseOut = true;
    var bMovingToSubmenu = false;

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

        // Fire the associated custom event

        this._oCurrentMenuItem.mouseOutEvent.fire(p_oEvent);

        this._oCurrentMenuItem.cfg.setProperty("selected", false);

        this._oCurrentMenuItem = null;

    }


    if(
        !this._bFiredMouseOutEvent && 
        (
            !this._oDom.isAncestor(this.element, oRelatedTarget) ||
            bMovingToSubmenu
        )
    ) {

        // Fire the associated custom event

        this.mouseOutEvent.fire(p_oEvent);

        this._bFiredMouseOutEvent = true;
        this._bFiredMouseOverEvent = false;

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
        
    this._oEventUtil.stopPropagation(p_oEvent);


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

            var nGroupIndex = parseInt(oNode.getAttribute("groupindex"), 10),
                nIndex = parseInt(oNode.getAttribute("index"), 10),
                oMenuItem = this._aMenuItemGroups[nGroupIndex][nIndex];

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
        
    this._oEventUtil.stopPropagation(p_oEvent);


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

            var nGroupIndex = parseInt(oNode.getAttribute("groupindex"), 10),
                nIndex = parseInt(oNode.getAttribute("index"), 10),
                oMenuItem = this._aMenuItemGroups[nGroupIndex][nIndex];

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
        oTarget.tagName != "A" || 
        (oTarget.tagName == "A" && oTarget.getAttribute("href") == "#")
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

            var nGroupIndex = parseInt(oNode.getAttribute("groupindex"), 10),
                nIndex = parseInt(oNode.getAttribute("index"), 10),
                oMenuItem = this._aMenuItemGroups[nGroupIndex][nIndex];

            if(oMenuItem && !oMenuItem.cfg.getProperty("disabled")) {

                // Fire the associated custom event

                oMenuItem.clickEvent.fire(p_oEvent);    

                var sURL = oMenuItem.cfg.getProperty("url");

                if(oTarget.tagName == "A" && sURL && sURL.substr((sURL.length-1),1) == "#") {

                    // Prevent the browser from following the link
    
                    this._oEventUtil.preventDefault(p_oEvent);

                }
                else {

                    var oSubmenu = oMenuItem.cfg.getProperty("submenu");

                    if(oTarget == oMenuItem.subMenuIndicator && oSubmenu) {
        
                        if(oSubmenu.cfg.getProperty("visible")) {
            
                            oSubmenu.hide();
            
                            oMenuItem.focus();
            
                        }
                        else {
            
                            oMenuItem.cfg.setProperty("selected", true);
                            
                            oSubmenu.show();
            
                            oSubmenu.setInitialSelection();
                            oSubmenu.setInitialFocus();
            
                        }                
        
                    }
                    else if(sURL && sURL.substr((sURL.length-1),1) != "#") {
                        
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

    this._oEventUtil.stopPropagation(p_oEvent);


    /*
        Check if the target was a DOM element that is a part of a 
        MenuItem instance and (if so), fire the associated custom event.
    */

    var oTarget = this._oEventUtil.getTarget(p_oEvent, true);

    if(
        oTarget.tagName == "A" && 
        oTarget.parentNode.parentNode.parentNode.parentNode == this.element
    ) {

        var nGroupIndex = parseInt(oTarget.parentNode.getAttribute("groupindex"), 10),
            nIndex = parseInt(oTarget.parentNode.getAttribute("index"), 10),
            oMenuItem = this._aMenuItemGroups[nGroupIndex][nIndex];

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

    this._oEventUtil.stopPropagation(p_oEvent);


    /*
        Check if the target was a DOM element that is a part of a 
        MenuItem instance and (if so), fire the associated custom event.
    */

    var oTarget = this._oEventUtil.getTarget(p_oEvent, true);

    if(
        oTarget.tagName == "A" && 
        oTarget.parentNode.parentNode.parentNode.parentNode == this.element
    ) {

        var nGroupIndex = parseInt(oTarget.parentNode.getAttribute("groupindex"), 10),
            nIndex = parseInt(oTarget.parentNode.getAttribute("index"), 10),
            oMenuItem = this._aMenuItemGroups[nGroupIndex][nIndex];

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

    this._oEventUtil.stopPropagation(p_oEvent);


    /*
        Check if the target was a DOM element that is a part of a 
        MenuItem instance and (if so), fire the associated custom event.
    */

    var oTarget = this._oEventUtil.getTarget(p_oEvent, true);

    if(
        oTarget.tagName == "A" && 
        oTarget.parentNode.parentNode.parentNode.parentNode == this.element
    ) {

        var nGroupIndex = parseInt(oTarget.parentNode.getAttribute("groupindex"), 10),
            nIndex = parseInt(oTarget.parentNode.getAttribute("index"), 10),
            oMenuItem = this._aMenuItemGroups[nGroupIndex][nIndex];

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
* "render" YAHOO.util.CustomEvent handler for a Menu instance.  Calls the 
* render method of a Menu instance's submenus.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.Menu} p_oMenu The submenu instance to be rendered.
*/
YAHOO.widget.Menu.prototype._onRender = function(p_sType, p_aArguments, p_oMenu) {

    p_oMenu.render(p_oMenu.parent.element);

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

                me._subscribeSubMenuToRenderEvent(oMenuItem);

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

                var oClone = me.element.cloneNode(true);
    
                me._oDom.setStyle(oClone, "width", "");
    
                document.body.appendChild(oClone);
    
                var sWidth = oClone.offsetWidth + "px";

                me._oDom.setStyle(me.element, "width", sWidth);
    
                document.body.removeChild(oClone);

            }

        break;

    }

};



// Public methods

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
* Renders the Menu by inserting the elements that are not already in the 
* main Module format into their correct places. Optionally appends the 
* Menu to the specified node prior to the render's execution.
* @param {String/HTMLElement} p_oAppendToNode The element or element id to 
* that the Module should be appended to prior to rendering.
* @param {Boolean} p_bHideSourceElement Boolean indicating if the source
* element should be hidden rather than destroyed. Default is false.
* @see YAHOO.widget.Module#render
*/    
YAHOO.widget.Menu.prototype.render = function(p_oAppendToNode, p_bHideSourceElement) {

    this.beforeRenderEvent.fire();


    /*
        Append all of the HTMLUListElement nodes (and their child HTMLLIElement)
        nodes to the body of the module.
    */

    var nListElements = this._aListElements.length;

    if(nListElements > 0) {

        var i = 0, 
            bFirstList = true;

        do {

            if(this._aListElements[i]) {

                if(bFirstList) {
        
                    this._oDom.addClass(this._aListElements[i], "first");
                    bFirstList = false;
        
                }

                if(
                    !this._aListElements[i].parentNode ||

                    // Check if the parentNode is a document fragment

                    (
                        this._aListElements[i].parentNode && 
                        this._aListElements[i].parentNode.nodeType == 11
                    )
                ) {

                    this.appendToBody(this._aListElements[i]);

                }

            }

            i++;

        }
        while(i < nListElements);

    }


    // Need to get everything into the DOM if it isn't already
    
    if((!this.childNodesInDOM[0]) && this.header) {

        // There is a header, but it's not in the DOM yet... need to add it
        var firstChild = this.element.firstChild;

        if(firstChild) { // Insert before first child if exists

            this.element.insertBefore(this.header, firstChild);

        } else { // Append to empty body because there are no children

            this.element.appendChild(this.header);

        }

    }


    if((!this.childNodesInDOM[1]) && this.body) {

        // There is a body, but it's not in the DOM yet... need to add it

        if(this.childNodesInDOM[2]) { // Insert before footer if exists in DOM

            this.element.insertBefore(this.body, this.childNodesInDOM[2]);

        } else { // Append to element because there is no footer

            this.element.appendChild(this.body);

        }

    }


    if((!this.childNodesInDOM[2]) && this.footer) {

        // There is a footer, but it's not in the DOM yet... need to add it
        this.element.appendChild(this.footer);

    }


    var me = this;
    
    function appendTo(element) {

        if (typeof element == "string") {
            element = document.getElementById(element);
        }
        
        if (element) {
            element.appendChild(me.element);
            me.appendEvent.fire();
        }

    }

    if(p_oAppendToNode) {

        if (typeof p_oAppendToNode == "string") {

            el = document.getElementById(el);

            if (! el) {
                el = document.createElement("DIV");
                el.id = elId;
            }

        }


        /*
            In order to render the Menu correctly in Opera we need to 
            remove all of the submenu indicator images for each
            MenuItem instance.
        */

        var aMenuItemNodes = [];

        if(this.browser == "opera") {

            var nMenuItemGroups = this._aMenuItemGroups.length;
        
            if(nMenuItemGroups > 0) {
        
                var i = nMenuItemGroups - 1,
                    nMenuItems,
                    n,
                    oImg,
                    oLI;
        
                do {
        
                    if(this._aMenuItemGroups[i]) {
        
                        nMenuItems = this._aMenuItemGroups[i].length;
            
                        if(nMenuItems > 0) {
            
                            n = nMenuItems - 1;
            
                            do {

                                oImg = this._aMenuItemGroups[i][n].subMenuIndicator;
                                oLI = this._aMenuItemGroups[i][n].element;
                    
                                if(this._aMenuItemGroups[i][n] && oImg) {

                                    this._oDom.removeClass(oLI, "hasusbmenu");

                                    oLI.removeChild(oImg);

                                    aMenuItemNodes[aMenuItemNodes.length] = [oLI, oImg];
        
                                }
                
                            }
                            while(n--);
            
                        }
        
                    }
        
                }
                while(i--);
        
            }

        }


        if(p_oAppendToNode.tagName != "BODY" || this.browser == "opera") {

            document.body.appendChild(this.element);

            var sWidth = this.element.offsetWidth + "px";
    
            this.cfg.setProperty("width", sWidth);

        }

        appendTo(p_oAppendToNode);


        // Put the submenu indicator images back in place.

        if(aMenuItemNodes.length > 0) {

            var i = aMenuItemNodes.length - 1;

            do {

                this._oDom.addClass(aMenuItemNodes[i][0], "hassubmenu");

                aMenuItemNodes[i][0].insertBefore(aMenuItemNodes[i][1], aMenuItemNodes[i][0].lastChild);

            }
            while(i--);

        }


    }
    else {

        /*
            No node was passed in. If the element is not already in the 
            document, this fails.
        */

        if(!YAHOO.util.Dom._elementInDom(this.element)) {

            return false;

        }

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


    this.cfg.fireDeferredEvents();

    this.renderEvent.fire();

    return true;

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


    if (x < 10) {

        x = leftConstraint;

    } else if ((x + offsetWidth) > viewPortWidth) {

        if(
            this.parent && 
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

        if(this.parent && (y > offsetHeight)) {

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


// Event handlers for configuration properties


/**
* The default event handler fired when the "fixedcenter" property is changed.
*/
YAHOO.widget.Menu.prototype.configFixedCenter = function(type, args, obj) {

	var val = args[0];
	var me = this;

	var refireIframe = function(e, obj) {
		setTimeout(function() {
			me.cfg.refireEvent("iframe");
		}, 0);	
	}

	if (val) {

		this.center();
		if (YAHOO.util.Event._getCacheIndex(window, "resize", this.center) == -1) {
			YAHOO.util.Event.addListener(window, "resize", this.center, this, true);
		}
		if (YAHOO.util.Event._getCacheIndex(window, "resize", refireIframe) == -1) {
			YAHOO.util.Event.addListener(window, "resize", refireIframe, this, true);
		}
		if (YAHOO.util.Event._getCacheIndex(window, "scroll", this.center) == -1) {
			YAHOO.util.Event.addListener(window, "scroll", this.center, this, true);
		}
		if (YAHOO.util.Event._getCacheIndex(window, "scroll", refireIframe) == -1) {
			YAHOO.util.Event.addListener(window, "scroll", refireIframe, this, true);
		}

	} else {

		YAHOO.util.Event.removeListener(window, "resize", this.center);
		YAHOO.util.Event.removeListener(window, "resize", refireIframe);
		YAHOO.util.Event.removeListener(window, "scroll", this.center);
		YAHOO.util.Event.removeListener(window, "scroll", refireIframe);


        var sPosition = this._oDom.getStyle(this.element, "position");
    
        if(this.iframe && sPosition == "absolute") {
    
		  this.syncPosition();
    
        }

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
YAHOO.widget.Menu.prototype.configIframe = function(p_sType, p_aArguments, p_oMenu) {

    YAHOO.widget.Menu.superclass.configIframe.call(
        this, 
        p_sType, 
        p_aArguments, 
        p_oMenu
    );

    var sPosition = this._oDom.getStyle(this.element, "position");

    if(this.iframe && (sPosition == "static" || sPosition == "relative")) {

        this.iframe.style.display = "none";

    }

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

    if(bVisible) {

        if(this.parent) {

            var oParentMenu = this.parent.parent;

            var bConstrainToViewport = 
                    oParentMenu.cfg.getProperty("constraintoviewport");

            this.cfg.setProperty("constraintoviewport", bConstrainToViewport);

            this.parent.subMenuIndicator.alt = 
                this.parent.EXPANDED_SUBMENU_INDICATOR_ALT_TEXT;
        
        }

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
        

        if(this.parent) {

            this.parent.subMenuIndicator.alt = 
                this.parent.COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT;
        
        }


        if(this.activeMenuItem) {
    
            if(this.activeMenuItem.cfg.getProperty("selected")) {
    
                this.activeMenuItem.cfg.setProperty("selected", false);
    
            }
    
            var oSubmenu = this.activeMenuItem.cfg.getProperty("submenu");
    
            if(oSubmenu && oSubmenu.cfg.getProperty("visible")) {
    
                oSubmenu.hide();
    
            }
    
        }

    }

};