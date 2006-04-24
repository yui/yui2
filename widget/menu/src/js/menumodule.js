/*
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
* @class The superclass of all menu containers.
* @constructor
* @extends YAHOO.widget.Overlay
* @base YAHOO.widget.Overlay
* @param {String/HTMLElement} p_oElement String id or HTMLElement 
* (either HTMLSelectElement or HTMLDivElement) of the source HTMLElement node.
* @param {Object} p_oUserConfig Optional. The configuration object literal 
* containing the configuration for a MenuModule instance. See 
* configuration class documentation for more details.
*/
YAHOO.widget.MenuModule = function(p_oElement, p_oUserConfig) {

	if (arguments.length > 0) {

		YAHOO.widget.MenuModule.superclass.constructor.call(
            this, 
            p_oElement, 
            p_oUserConfig
        );

	}

};

YAHOO.widget.MenuModule.prototype = new YAHOO.widget.Overlay();
YAHOO.widget.MenuModule.prototype.constructor = YAHOO.widget.MenuModule;
YAHOO.widget.MenuModule.superclass = YAHOO.widget.Overlay.prototype;


// Constants

/**
* Constant representing the CSS class(es) to be applied to the root 
* HTMLDivElement of the MenuModule instance.
* @final
* @type String
*/
YAHOO.widget.MenuModule.prototype.CSS_CLASS_NAME = "yuimenu";


/**
* Constant representing the type of item to instantiate and add when parsing 
* the child nodes (either HTMLLIElement, HTMLOptGroupElement or 
* HTMLOptionElement) of a menu's DOM.  The default 
* is YAHOO.widget.MenuModuleItem.
* @final
* @type YAHOO.widget.MenuModuleItem
*/
YAHOO.widget.MenuModule.prototype.ITEM_TYPE = null;


/**
* Constant representing the tagname of the HTMLElement used to title 
* a group of items.
* @final
* @type String
*/
YAHOO.widget.MenuModule.prototype.GROUP_TITLE_TAG_NAME = "H6";


// Private properties

/**
* Array of HTMLElements used to title groups of items.
* @private
* @type {Array}
*/
YAHOO.widget.MenuModule.prototype._aGroupTitleElements = null;


/**
* Multi-dimensional array of items.
* @private
* @type {Array}
*/
YAHOO.widget.MenuModule.prototype._aItemGroups = null;


/**
* An array of HTMLUListElements, each of which is the parent node of each 
* items's HTMLLIElement node.
* @private
* @type {Array}
*/
YAHOO.widget.MenuModule.prototype._aListElements = null;


/**
* Reference to the Event utility singleton.
* @private
* @type {YAHOO.util.Event}
*/
YAHOO.widget.MenuModule.prototype._oEventUtil = YAHOO.util.Event;


/**
* Reference to the Dom utility singleton.
* @private
* @type {YAHOO.util.Dom}
*/
YAHOO.widget.MenuModule.prototype._oDom = YAHOO.util.Dom;


/**
* Reference to the item the mouse is currently over.
* @private
* @type {YAHOO.widget.MenuModuleItem}
*/
YAHOO.widget.MenuModule.prototype._oCurrentItem = null;


/** 
* The current state of a MenuModule instance's "mouseover" event
* @private
* @type {Boolean}
*/
YAHOO.widget.MenuModule.prototype._bFiredMouseOverEvent = false;


/** 
* The current state of a MenuModule instance's "mouseout" event
* @private
* @type {Boolean}
*/
YAHOO.widget.MenuModule.prototype._bFiredMouseOutEvent = false;


// Public properties

/**
* Reference to the item that has focus.
* @private
* @type {YAHOO.widget.MenuModuleItem}
*/
YAHOO.widget.MenuModule.prototype.activeItem = null;


/**
* Returns a MenuModule instance's parent object.
* @type {YAHOO.widget.MenuModuleItem}
*/
YAHOO.widget.MenuModule.prototype.parent = null;


/**
* Returns the HTMLElement (either HTMLSelectElement or HTMLDivElement)
* used create the MenuModule instance.
* @type {HTMLSelectElement/HTMLDivElement}
*/
YAHOO.widget.MenuModule.prototype.srcElement = null;


// Events

/**
* Fires when the mouse has entered a MenuModule instance.  Passes back the 
* DOM Event object as an argument.
* @type {YAHOO.util.CustomEvent}
* @see YAHOO.util.CustomEvent
*/
YAHOO.widget.MenuModule.prototype.mouseOverEvent = null;


/**
* Fires when the mouse has left a MenuModule instance.  Passes back the DOM 
* Event object as an argument.
* @type {YAHOO.util.CustomEvent}
* @see YAHOO.util.CustomEvent
*/
YAHOO.widget.MenuModule.prototype.mouseOutEvent = null;


/**
* Fires when the user mouses down on a MenuModule instance.  Passes back the 
* DOM Event object as an argument.
* @type {YAHOO.util.CustomEvent}
* @see YAHOO.util.CustomEvent
*/
YAHOO.widget.MenuModule.prototype.mouseDownEvent = null;


/**
* Fires when the user releases a mouse button while the mouse is over 
* a MenuModule instance.  Passes back the DOM Event object as an argument.
* @type {YAHOO.util.CustomEvent}
* @see YAHOO.util.CustomEvent
*/
YAHOO.widget.MenuModule.prototype.mouseUpEvent = null;


/**
* Fires when the user clicks the on a MenuModule instance.  Passes back the 
* DOM Event object as an argument.
* @type {YAHOO.util.CustomEvent}
* @see YAHOO.util.CustomEvent
*/
YAHOO.widget.MenuModule.prototype.clickEvent = null;


/**
* Fires when the user presses an alphanumeric key.  Passes back the 
* DOM Event object as an argument.
* @type {YAHOO.util.CustomEvent}
* @see YAHOO.util.CustomEvent
*/
YAHOO.widget.MenuModule.prototype.keyPressEvent = null;


/**
* Fires when the user presses a key.  Passes back the DOM Event 
* object as an argument.
* @type {YAHOO.util.CustomEvent}
* @see YAHOO.util.CustomEvent
*/
YAHOO.widget.MenuModule.prototype.keyDownEvent = null;


/**
* Fires when the user releases a key.  Passes back the DOM Event 
* object as an argument.
* @type {YAHOO.util.CustomEvent}
* @see YAHOO.util.CustomEvent
*/
YAHOO.widget.MenuModule.prototype.keyUpEvent = null;


/**
* The MenuModule class's initialization method. This method is automatically 
* called  by the constructor, and sets up all DOM references for 
* pre-existing markup, and creates required markup if it is not already present.
* @param {String/HTMLElement} p_oElement String id or HTMLElement 
* (either HTMLSelectElement or HTMLDivElement) of the source HTMLElement node.
* @param {Object} p_oUserConfig Optional. The configuration object literal 
* containing the configuration for a MenuModule instance. See 
* configuration class documentation for more details.
*/
YAHOO.widget.MenuModule.prototype.init = function(p_oElement, p_oUserConfig) {

    if(!this.ITEM_TYPE) {

        this.ITEM_TYPE = YAHOO.widget.MenuModuleItem;

    }


    this._aItemGroups = [];
    this._aListElements = [];
    this._aGroupTitleElements = [];


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
                    Note: we don't pass the user config in here yet 
                    because we only want it executed once, at the lowest 
                    subclass level.
                */ 
            
                YAHOO.widget.MenuModule.superclass.init.call(this, oElement);

                this.beforeInitEvent.fire(YAHOO.widget.MenuModule);


                /*
                    Populate the collection of item groups and item
                    group titles
                */

                var oNode = this.body.firstChild, 
                    i = 0;

                do {

                    switch(oNode.tagName) {

                        case this.GROUP_TITLE_TAG_NAME:
                        
                            this._aGroupTitleElements[i] = oNode;

                        break;

                        case "UL":

                            this._aListElements[i] = oNode;
                            this._aItemGroups[i] = [];
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
                    Note: we don't pass the user config in here yet 
                    because we only want it executed once, at the lowest 
                    subclass level.
                */ 
            
                YAHOO.widget.MenuModule.superclass.init.call(this, sId); 

                this.beforeInitEvent.fire(YAHOO.widget.MenuModule);

            break;
    
        }

    }
    else {

        /* 
            Note: we don't pass the user config in here yet 
            because we only want it executed once, at the lowest 
            subclass level.
        */ 
    
        YAHOO.widget.MenuModule.superclass.init.call(this, p_oElement);

        this.beforeInitEvent.fire(YAHOO.widget.MenuModule);

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

        this.beforeRenderEvent.subscribe(this._onBeforeRender, this, true);
        this.renderEvent.subscribe(this._onRender, this, true);
        this.showEvent.subscribe(this._onShow, this, true);
        this.hideEvent.subscribe(this._onHide, this, true);


        if(p_oUserConfig) {
    
            this.cfg.applyConfig(p_oUserConfig);
    
        }


        this.cfg.queueProperty("visible", false);


        if(this.srcElement) {

            this._initSubTree();

        }

    }


    this.initEvent.fire(YAHOO.widget.MenuModule);

};


// Private methods

/**
* Determines if the value is one of the supported positions.
* @private
* @param {Object} p_sPosition The object to be evaluated.
* @return Returns true if the position is supported.
* @type Boolean
*/
YAHOO.widget.MenuModule.prototype._checkPosition = function(p_sPosition) {

    if(typeof p_sPosition == "string") {

        var sPosition = p_sPosition.toLowerCase();

        return ("dynamic,static".indexOf(sPosition) != -1);

    }

};


/**
* Adds an item to a group.
* @private
* @param {Number} p_nGroupIndex Number indicating the group to which
* the item belongs.
* @param {YAHOO.widget.MenuModuleItem} p_oItem The item to be added.
* @param {Number} p_nItemIndex Optional. Index at which the item 
* should be added.
* @return The item that was added.
* @type YAHOO.widget.MenuModuleItem
*/
YAHOO.widget.MenuModule.prototype._addItemToGroup = function(p_nGroupIndex, p_oItem, p_nItemIndex) {

    if(typeof p_nItemIndex == "number") {

        var nGroupIndex = typeof p_nGroupIndex == "number" ? p_nGroupIndex : 0,
            aGroup = this._getItemGroup(nGroupIndex);

        if(!aGroup) {

            aGroup = this._createItemGroup(nGroupIndex);

        }

        var bFirstInsertion = (aGroup.length === 0);


        if(aGroup[p_nItemIndex]) {

            aGroup.splice(p_nItemIndex, 0, p_oItem);

        }
        else {

            aGroup[p_nItemIndex] = p_oItem;

        }


        var oItem = aGroup[p_nItemIndex];

        if(oItem) {

            if(bFirstInsertion && !oItem.element.parentNode) {
    
                this._aListElements[nGroupIndex].appendChild(oItem.element);

            }
            else {

                function getNextItemSibling(p_aArray, p_nStartIndex) {
        
                    return p_aArray[p_nStartIndex] || getNextItemSibling(p_aArray, (p_nStartIndex+1));
        
                }


                var oNextItemSibling = getNextItemSibling(aGroup, (p_nItemIndex+1));

                if(oNextItemSibling && !oItem.element.parentNode) {
        
                    this._aListElements[nGroupIndex].insertBefore(oItem.element, oNextItemSibling.element);
    
                }

            }


            oItem.parent = this;
    
            this._subscribeToItemEvents(oItem);

            this._configureItemSubmenuModule(oItem);
            
            this._updateItemProperties(nGroupIndex);
    
            return oItem;

        }

    }
    else {

        var nGroupIndex = typeof p_nGroupIndex == "number" ? p_nGroupIndex : 0,
            aGroup = this._getItemGroup(nGroupIndex);

        if(!aGroup) {

            aGroup = this._createItemGroup(nGroupIndex);

        }

        var nItemIndex = aGroup.length;

        aGroup[nItemIndex] = p_oItem;


        var oItem = aGroup[nItemIndex];

        if(oItem) {

            if(!this._oDom.isAncestor(this._aListElements[nGroupIndex], oItem.element)) {

                this._aListElements[nGroupIndex].appendChild(oItem.element);

            }

            oItem.element.setAttribute("groupindex", nGroupIndex);
            oItem.element.setAttribute("index", nItemIndex);
    
            oItem.parent = this;

            oItem.index = nItemIndex;
            oItem.groupIndex = nGroupIndex;
    
            this._subscribeToItemEvents(oItem);

            this._configureItemSubmenuModule(oItem);

            if(nItemIndex === 0) {
    
                this._oDom.addClass(oItem.element, "first");
    
            }
    
            return oItem;

        }

    }

};


/**
* Removes an item from a group by index.
* @private
* @param {Number} p_nGroupIndex Number indicating the group to which
* the item belongs.
* @param {Number} p_nItemIndex Number indicating the index of the item to  
* be removed.
* @return The item that was removed.
* @type YAHOO.widget.MenuModuleItem
*/    
YAHOO.widget.MenuModule.prototype._removeItemFromGroupByIndex = function(p_nGroupIndex, p_nItemIndex) {

    var nGroupIndex = typeof p_nGroupIndex == "number" ? p_nGroupIndex : 0,
        aGroup = this._getItemGroup(nGroupIndex),
        aArray = aGroup.splice(p_nItemIndex, 1),
        oItem = aArray[0];

    if(oItem) {

        // Update the index and className properties of each member        
        
        this._updateItemProperties(nGroupIndex);

        if(aGroup.length === 0) {

            // Remove the UL

            var oUL = this._aListElements[nGroupIndex];

            if(this.body && oUL) {

                this.body.removeChild(oUL);

            }

            // Remove the group from the array of items

            this._aItemGroups.splice(nGroupIndex, 1);


            // Remove the UL from the array of ULs

            this._aListElements.splice(nGroupIndex, 1);


            // Assign the "first" class to the new first UL in the collection

            oUL = this._aListElements[0];

            if(oUL) {

                this._oDom.addClass(oUL, "first");

            }            

        }


        // Return a reference to the item that was removed
    
        return oItem;

    }

};


/**
* Removes a item from a group by reference.
* @private
* @param {Number} p_nGroupIndex Number indicating the group to which
* the item belongs.
* @param {YAHOO.widget.MenuModuleItem} p_oItem The item to be removed.
* @return The item that was removed.
* @type YAHOO.widget.MenuModuleItem
*/    
YAHOO.widget.MenuModule.prototype._removeItemFromGroupByValue = function(p_nGroupIndex, p_oItem) {

    var aGroup = this._getItemGroup(p_nGroupIndex),
        nItems = aGroup.length,
        nItemIndex = -1;

    if(nItems > 0) {

        var i = nItems-1;
    
        do {
    
            if(aGroup[i] == p_oItem) {
    
                nItemIndex = i;
                break;    
    
            }
    
        }
        while(i--);
    
        if(nItemIndex > -1) {
    
            return this._removeItemFromGroupByIndex(p_nGroupIndex, nItemIndex);
    
        }

    }

};


/**
* Updates the index, groupindex, and className properties of the items
* in the specified group. 
* @private
* @param {Number} p_nGroupIndex Number indicating the group of items to update.
*/
YAHOO.widget.MenuModule.prototype._updateItemProperties = function(p_nGroupIndex) {

    var aGroup = this._getItemGroup(p_nGroupIndex),
        nItems = aGroup.length;

    if(nItems > 0) {

        var i = nItems - 1,
            oItem;

        // Update the index and className properties of each member        
    
        do {

            if(aGroup[i]) {
    
                aGroup[i].index = i;
                aGroup[i].groupIndex = p_nGroupIndex;
                aGroup[i].element.setAttribute("groupindex", p_nGroupIndex);
                aGroup[i].element.setAttribute("index", i);
                this._oDom.removeClass(aGroup[i].element, "first");

                oItem = aGroup[i];

            }
    
        }
        while(i--);


        this._oDom.addClass(oItem.element, "first");


    }

};


/**
* Creates a new item group (array) and it's associated HTMLUlElement node 
* @private
* @param {Number} p_nIndex Number indicating the group to create.
* @return An item group.
* @type Array
*/
YAHOO.widget.MenuModule.prototype._createItemGroup = function(p_nIndex) {

    if(!this._aItemGroups[p_nIndex]) {

        this._aItemGroups[p_nIndex] = [];

        var oUL = document.createElement("ul");

        this._aListElements[p_nIndex] = oUL;

        return this._aItemGroups[p_nIndex];

    }

};


/**
* Returns the item group at the specified index.
* @private
* @param {Number} p_nIndex Number indicating the index of the item group to
* be retrieved.
* @return An array of items.
* @type Array
*/
YAHOO.widget.MenuModule.prototype._getItemGroup = function(p_nIndex) {

    var nIndex = ((typeof p_nIndex == "number") ? p_nIndex : 0);

    return this._aItemGroups[nIndex];

};


/**
* Subscribe's a MenuModule instance to it's parent MenuModule instance's events.
* @private
* @param {YAHOO.widget.MenuModuleItem} p_oItem The item to listen
* for events on.
*/
YAHOO.widget.MenuModule.prototype._configureItemSubmenuModule = function(p_oItem) {

    var oSubmenu = p_oItem.cfg.getProperty("submenu");

    if(oSubmenu) {

        /*
            Listen for configuration changes to the parent MenuModule instance
            so they they can be applied to the submenu.
        */

        this.cfg.configChangedEvent.subscribe(
            this._onParentMenuModuleConfigChange, 
            oSubmenu, 
            true
        );
        
        this.renderEvent.subscribe(
            this._onParentMenuModuleRender,
            oSubmenu, 
            true
        );

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
* Subscribes a MenuModule instance to the specified item's Custom Events.
* @private
* @param {YAHOO.widget.MenuModuleItem} p_oItem The item to listen for events on.
*/
YAHOO.widget.MenuModule.prototype._subscribeToItemEvents = function(p_oItem) {

    var aArguments = [this, p_oItem];

    p_oItem.focusEvent.subscribe(this._onItemFocus, aArguments);

    p_oItem.blurEvent.subscribe(this._onItemBlur, aArguments);

    p_oItem.cfg.configChangedEvent.subscribe(
        this._onItemConfigChange,
        aArguments
    );

};


/**
* Returns the offset width of a MenuModule instance.
* @private
*/
YAHOO.widget.MenuModule.prototype._getOffsetWidth = function() {

    var oClone = this.element.cloneNode(true);

    this._oDom.setStyle(oClone, "width", "");

    document.body.appendChild(oClone);

    var sWidth = oClone.offsetWidth;

    document.body.removeChild(oClone);

    return sWidth;

};


/**
* Determines if a DOM event was fired on an item and (if so) fires the item's
* associated Custom Event
* @private
* @param {HTMLElement} p_oElement The original target of the event.
* @param {String} p_sEventType The type/name of the Custom Event to fire.
* @param {Event} p_oDOMEvent The DOM event to pass back when firing the 
* Custom Event.
* @return An item.
* @type YAHOO.widget.MenuModuleItem
*/
YAHOO.widget.MenuModule.prototype._fireItemEvent = function(p_oElement, p_sEventType, p_oDOMEvent) {

    var me = this;


    // Returns the specified element's parent HTMLLIElement (&#60;LI&#60;)

    function getItemElement(p_oElement) {
    
        if(p_oElement == me.element) {

            return;
        
        }
        else if(p_oElement.tagName == "LI") {
    
            return p_oElement;
    
        }
        else if(p_oElement.parentNode) {

            return getItemElement(p_oElement.parentNode);
    
        }
    
    }


    var oElement = getItemElement(p_oElement);

    if(oElement) {

        /*
            Retrieve the item that corresponds to the 
            HTMLLIElement (&#60;LI&#60;) and fire the Custom Event        
        */

        var nGroupIndex = parseInt(oElement.getAttribute("groupindex"), 10),
            nIndex = parseInt(oElement.getAttribute("index"), 10),
            oItem = this._aItemGroups[nGroupIndex][nIndex];

        if(!oItem.cfg.getProperty("disabled")) {

            oItem[p_sEventType].fire(p_oDOMEvent);

            return oItem;

        }

    }

};


// Private DOM event handlers

/**
* Generic event handler for the MenuModule's root HTMLDivElement node.  Used to
* handle "mousedown," "mouseup," "keydown," "keyup," and "keypress" events.
* @private
* @param {Event} p_oEvent Event object passed back by the event 
* utility (YAHOO.util.Event).
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance 
* corresponding to the HTMLDivElement that fired the event.
*/
YAHOO.widget.MenuModule.prototype._onDOMEvent = function(p_oEvent, p_oMenuModule) {

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
        an item and (if so), fire the associated custom event.
    */

    this._fireItemEvent(oTarget, sCustomEventType, p_oEvent);


    // Fire the associated custom event for the MenuModule

    this[sCustomEventType].fire(p_oEvent);


    /*
        Stop the propagation of the event at each MenuModule instance
        since menus can be embedded in eachother.
    */
        
    this._oEventUtil.stopPropagation(p_oEvent);

};


/**
* "mouseover" event handler for the MenuModule's root HTMLDivElement node.
* @private
* @param {Event} p_oEvent Event object passed back by the event
* utility (YAHOO.util.Event).
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance 
* corresponding to the HTMLDivElement that fired the event.
*/
YAHOO.widget.MenuModule.prototype._onElementMouseOver = function(p_oEvent, p_oMenuModule) {

    var oTarget = this._oEventUtil.getTarget(p_oEvent, true);

    if(
        (
            oTarget == this.element || 
            this._oDom.isAncestor(this.element, oTarget)
        )  && 
        !this._bFiredMouseOverEvent
    ) {

        // Fire the "mouseover" Custom Event for the MenuModule instance

        this.mouseOverEvent.fire(p_oEvent);

        this._bFiredMouseOverEvent = true;
        this._bFiredMouseOutEvent = false;

    }


    /*
        Check if the target was an element that is a part of an item
        and (if so), fire the "mouseover" Custom Event.
    */

    if(!this._oCurrentItem) {

        this._oCurrentItem = 
            this._fireItemEvent(oTarget, "mouseOverEvent", p_oEvent);

    }


    /*
        Stop the propagation of the event at each MenuModule instance
        since menus can be embedded in eachother.
    */

    this._oEventUtil.stopPropagation(p_oEvent);

};


/**
* "mouseout" event handler for the MenuModule's root HTMLDivElement node.
* @private
* @param {Event} p_oEvent Event object passed back by the event
* utility (YAHOO.util.Event).
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance 
* corresponding to the HTMLDivElement that fired the event.
*/
YAHOO.widget.MenuModule.prototype._onElementMouseOut = function(p_oEvent, p_oMenuModule) {

    var oRelatedTarget = this._oEventUtil.getRelatedTarget(p_oEvent),
        bLIMouseOut = true,
        bMovingToSubmenu = false;


    // Determine where the mouse is going

    if(this._oCurrentItem && oRelatedTarget) {

        if(
            oRelatedTarget == this._oCurrentItem.element || 
            this._oDom.isAncestor(this._oCurrentItem.element, oRelatedTarget)
        ) {

            bLIMouseOut = false;

        }


        var oSubmenu = this._oCurrentItem.cfg.getProperty("submenu");

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


    if(this._oCurrentItem && (bLIMouseOut || bMovingToSubmenu)) {

        // Fire the "mouseout" Custom Event for the item

        this._oCurrentItem.mouseOutEvent.fire(p_oEvent);

        this._oCurrentItem = null;

    }


    if(
        !this._bFiredMouseOutEvent && 
        (
            !this._oDom.isAncestor(this.element, oRelatedTarget) ||
            bMovingToSubmenu
        )
    ) {

        // Fire the "mouseout" Custom Event for the MenuModule instance

        this.mouseOutEvent.fire(p_oEvent);

        this._bFiredMouseOutEvent = true;
        this._bFiredMouseOverEvent = false;

    }


    /*
        Stop the propagation of the event at each MenuModule instance
        since menus can be embedded in eachother.
    */

    this._oEventUtil.stopPropagation(p_oEvent);

};


/**
* "click" event handler for the MenuModule's root HTMLDivElement node.
* @private
* @param {Event} p_oEvent Event object passed back by the 
* event utility (YAHOO.util.Event).
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance 
* corresponding to the HTMLDivElement that fired the event.
*/         
YAHOO.widget.MenuModule.prototype._onElementClick = function(p_oEvent, p_oMenuModule) {

    var oTarget = this._oEventUtil.getTarget(p_oEvent, true),

        /*
            Check if the target was a DOM element that is a part of an
            item and (if so), fire the associated "click" 
            Custom Event.
        */
    
        oItem = this._fireItemEvent(oTarget, "clickEvent", p_oEvent),

        bCurrentPageURL; // Indicates if the URL points to the current page


    if(oItem) {

        var sURL = oItem.cfg.getProperty("url"),
            oSubmenu = oItem.cfg.getProperty("submenu");
        
        bCurrentPageURL = (sURL.substr((sURL.length-1),1) == "#");

        /*
            ACCESSIBILITY FEATURE FOR SCREEN READERS: Expand/collapse the
            submenu when the user clicks on the submenu indicator image.
        */        

        if(oTarget == oItem.subMenuIndicator && oSubmenu) {
    
            if(oSubmenu.cfg.getProperty("visible")) {
    
                oSubmenu.hide();
    
                oItem.focus();
    
            }
            else {
    
                oItem.cfg.setProperty("selected", true);
                
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
                Follow the URL of the item regardless of whether or 
                not the user clicked specifically on the
                HTMLAnchorElement (&#60;A&#60;) node.
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
                Stop the propagation of the event at each MenuModule instance
                since Menus can be embedded in eachother.
            */

            this._oEventUtil.stopPropagation(p_oEvent);
        
        break;
    
    }


    // Fire the associated "click" Custom Event for the MenuModule instance

    this.clickEvent.fire(p_oEvent);

};


// Private Custom Event handlers

/**
* Iterates the source element's childNodes collection and uses the child 
* nodes to instantiate MenuModule and MenuModuleItem instances.
* @private
*/
YAHOO.widget.MenuModule.prototype._initSubTree = function() {

    var bInitSubmenus = this.cfg.getProperty("initsubtree"),
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
        
                                this.addItem(
                                    
                                    new this.ITEM_TYPE(
                                        oNode, 
                                        { initsubtree: bInitSubmenus }
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

                        this.addItem(
                            (
                                new this.ITEM_TYPE(
                                    oNode, 
                                    { initsubtree: bInitSubmenus }
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


/**
* "beforerender" Custom Event handler for a MenuModule instance.  Appends all 
* of the HTMLUListElement (&#60;UL&#60;s) nodes (and their child HTMLLIElement (&#60;LI&#60;)) 
* nodes and their accompanying title nodes to the body of the 
* MenuModule instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance that 
* fired the event.
*/
YAHOO.widget.MenuModule.prototype._onBeforeRender = function(p_sType, p_aArguments, p_oMenuModule) {

    if(this.cfg.getProperty("position") == "static") {

        this.cfg.queueProperty("iframe", false);
        this.cfg.queueProperty("visible", true);
        
    }

    var nListElements = this._aListElements.length;

    if(nListElements > 0) {

        var i = 0, 
            bFirstList = true,
            oUL,
            oGroupTitle;


        do {

            oUL = this._aListElements[i];

            if(oUL) {

                if(bFirstList) {
        
                    this._oDom.addClass(oUL, "first");
                    bFirstList = false;
        
                }


                if(!this._oDom.isAncestor(this.element, oUL)) {

                    this.appendToBody(oUL);

                }


                oGroupTitle = this._aGroupTitleElements[i];

                if(oGroupTitle) {

                    if(!this._oDom.isAncestor(this.element, oGroupTitle)) {

                        oUL.parentNode.insertBefore(oGroupTitle, oUL);

                    }


                    this._oDom.addClass(oUL, "hastitle");

                }

            }

            i++;

        }
        while(i < nListElements);

    }

};


/**
* "render" Custom Event handler for a MenuModule instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance that 
* fired the event.
*/
YAHOO.widget.MenuModule.prototype._onRender = function(p_sType, p_aArguments, p_oMenuModule) {

    if(this.cfg.getProperty("position") == "dynamic") {

        var sWidth = this.element.parentNode.tagName == "BODY" ? 
                this.element.offsetWidth : this._getOffsetWidth();
    
        this.cfg.setProperty("width", (sWidth + "px"));

    }

};


/**
* "show" Custom Event handler for a MenuModule instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance that 
* fired the event.
*/
YAHOO.widget.MenuModule.prototype._onShow = function(p_sType, p_aArguments, p_oMenuModule) {

    this.setInitialFocus();

};


/**
* "hide" Custom Event handler for a MenuModule instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance that 
* fired the event.
*/
YAHOO.widget.MenuModule.prototype._onHide = function(p_sType, p_aArguments, p_oMenuModule) {

    if(this.activeItem) {

        if(this.activeItem.cfg.getProperty("selected")) {

            this.activeItem.cfg.setProperty("selected", false);

        }

        var oSubmenu = this.activeItem.cfg.getProperty("submenu");

        if(oSubmenu && oSubmenu.cfg.getProperty("visible")) {

            oSubmenu.hide();

        }

    }

};


/**
* "configchange" Custom Event handler for a submenu.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oSubmenu The submenu that subscribed
* to the event.
*/
YAHOO.widget.MenuModule.prototype._onParentMenuModuleConfigChange = function(p_sType, p_aArguments, p_oSubmenu) {

    var sPropertyName = p_aArguments[0][0],
        sPropertyValue = p_aArguments[0][1];

    switch(sPropertyName) {

        case "iframe":
        case "constraintoviewport":
        case "submenualignment":

            p_oSubmenu.cfg.setProperty(sPropertyName, oPropertyValue);
                
        break;        
        
    }

};


/**
* "render" Custom Event handler for a MenuModule instance.  Renders a submenu in 
* response to the firing of it's parent's "render" event.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oSubmenu The submenu that subscribed
* to the event.
*/
YAHOO.widget.MenuModule.prototype._onParentMenuModuleRender = function(p_sType, p_aArguments, p_oSubmenu) {

    /*
        Set the "iframe" and "constraintoviewport" configuration 
        properties to match the parent MenuModule
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
* "beforeshow" Custom Event handler for a submenu.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oSubmenu The submenu that fired
* the event.
*/
YAHOO.widget.MenuModule.prototype._onSubmenuBeforeShow = function(p_sType, p_aArguments, p_oSubmenu) {

    var aAlignment = this.parent.parent.cfg.getProperty("submenualignment");

    this.cfg.setProperty(
        "context", 
        [
            this.parent.element, 
            aAlignment[0], 
            aAlignment[1]
        ]
    );

    this.parent.subMenuIndicator.alt = 
        this.parent.EXPANDED_SUBMENU_INDICATOR_ALT_TEXT;

};


/**
* "show" Custom Event handler for a submenu.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oSubmenu The submenu that fired
* the event.
*/
YAHOO.widget.MenuModule.prototype._onSubmenuShow = function(p_sType, p_aArguments, p_oSubmenu) {

    this.parent.subMenuIndicator.alt = 
        this.parent.EXPANDED_SUBMENU_INDICATOR_ALT_TEXT;

};


/**
* "hide" Custom Event handler for a submenu.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oSubmenu The submenu that fired
* the event.
*/
YAHOO.widget.MenuModule.prototype._onSubmenuHide = function(p_sType, p_aArguments, p_oSubmenu) {

    this.parent.subMenuIndicator.alt = 
        this.parent.COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT;

};


/**
* "focus" YAHOO.util.CustomEvent handler for a MenuModule instance's items.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {Array} p_aObjects Array containing the current MenuModule instance 
* and the item that fired the event.
*/
YAHOO.widget.MenuModule.prototype._onItemFocus = function(p_sType, p_aArguments, p_aObjects) {

    var me = p_aObjects[0],
        oItem = p_aObjects[1];

    me.activeItem = oItem;

};


/**
* "blur" YAHOO.util.CustomEvent handler for a MenuModule instance's items.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {Array} p_aObjects Array containing the current MenuModule instance 
* and the item that fired the event.
*/
YAHOO.widget.MenuModule.prototype._onItemBlur = function(p_sType, p_aArguments, p_aObjects) {

    var me = p_aObjects[0],
        oItem = p_aObjects[1],
        oSubmenu = oItem.cfg.getProperty("submenu");

    if(!oSubmenu || (oSubmenu && !oSubmenu.cfg.getProperty("visible"))) {

        me.activeItem = null;

    }

};


/**
* "configchange" YAHOO.util.CustomEvent handler for the MenuModule 
* instance's items.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the 
* event was fired.
* @param {Array} p_aObjects Array containing the current MenuModule instance 
* and the item that fired the event.
*/
YAHOO.widget.MenuModule.prototype._onItemConfigChange = function(p_sType, p_aArguments, p_aObjects) {

    var sProperty = p_aArguments[0][0],
        me = p_aObjects[0],
        oItem = p_aObjects[1];

    switch(sProperty) {

        case "submenu":

            var oSubmenu = p_aArguments[0][1];

            if(oSubmenu) {

                me._configureItemSubmenuModule(oItem);

            }

        break;

        case "text":
        case "helptext":

            /*
                A change to an item's "text" or "helptext"
                configuration properties requires the width of the parent
                MenuModule instance to be recalculated.
            */

            if(me.element.style.width) {
    
                var sWidth = me._getOffsetWidth() + "px";

                me._oDom.setStyle(me.element, "width", sWidth);

            }

        break;

    }

};


/**
* The default event handler executed when the moveEvent is fired, if the 
* "constraintoviewport" configuration property is set to true.
*/
YAHOO.widget.MenuModule.prototype.enforceConstraints = function(type, args, obj) {

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


// Event handlers for configuration properties

/**
* Event handler for when the "position" configuration property of a
* MenuModule changes.
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance fired the event.
* @see YAHOO.widget.Overlay#configIframe
*/
YAHOO.widget.MenuModule.prototype.configPosition = function(p_sType, p_aArguments, p_oMenuModule) {

    var sCSSPosition = p_aArguments[0] == "static" ? "static" : "absolute";

    this._oDom.setStyle(this.element, "position", sCSSPosition);

};


// Public methods

/**
* Sets the title of a group of items.
* @param {String} p_sGroupTitle The title of the group.
* @param {Number} p_nGroupIndex Optional. Number indicating the group to which
* the title belongs.
*/
YAHOO.widget.MenuModule.prototype.setItemGroupTitle = function(p_sGroupTitle, p_nGroupIndex) {
    
    if(typeof p_sGroupTitle == "string" && p_sGroupTitle.length > 0) {

        var nGroupIndex = typeof p_nGroupIndex == "number" ? p_nGroupIndex : 0,

            oTitle = this._aGroupTitleElements[nGroupIndex];


        if(oTitle) {

            oTitle.innerHTML = p_sGroupTitle;
            
        }
        else {

            oTitle = document.createElement(this.GROUP_TITLE_TAG_NAME);
                    
            oTitle.innerHTML = p_sGroupTitle;

            this._aGroupTitleElements[nGroupIndex] = oTitle;

        }


        var i = this._aGroupTitleElements.length - 1,
            nFirstIndex;

        do {

            if(this._aGroupTitleElements[i]) {

                this._oDom.removeClass(this._aGroupTitleElements[i], "first");
                nFirstIndex = i;

            }

        }
        while(i--);


        if(nFirstIndex !== null) {

            this._oDom.addClass(this._aGroupTitleElements[nFirstIndex], "first");

        }

    }

};


/**
* Appends the specified item to a MenuModule instance.
* @param {YAHOO.widget.MenuModuleItem} p_oItem The item to be added.
* @param {Number} p_nGroupIndex Optional. Number indicating the group to which
* the item belongs.
* @return The item that was added to the MenuModule.
* @type YAHOO.widget.MenuModuleItem
*/
YAHOO.widget.MenuModule.prototype.addItem = function(p_oItem, p_nGroupIndex) {

    if(p_oItem && p_oItem instanceof YAHOO.widget.MenuModuleItem) {

        return this._addItemToGroup(p_nGroupIndex, p_oItem);

    }

};


/**
* Inserts an item into a MenuModule instance at the specified index.
* @param {YAHOO.widget.MenuModuleItem} p_oItem The item to be inserted.
* @param {Number} p_nItemIndex Number indicating the ordinal position 
* at which the item should be added.
* @param {Number} p_nGroupIndex Optional. Number indicating the group to which
* the item belongs.
* @return The item that was inserted into the MenuModule.
* @type YAHOO.widget.MenuModuleItem
*/
YAHOO.widget.MenuModule.prototype.insertItem = function(p_oItem, p_nItemIndex, p_nGroupIndex) {

    if(p_oItem && p_oItem instanceof YAHOO.widget.MenuModuleItem) {

        return this._addItemToGroup(p_nGroupIndex, p_oItem, p_nItemIndex);

    }

};


/**
* Removes the specified item from a MenuModule instance.
* @param {YAHOO.widget.MenuModuleItem/Number} p_oObject The item or index of the
* item to be removed.
* @param {Number} p_nGroupIndex Optional. Number indicating the group to which
* the item belongs.
* @return The item that was removed from the MenuModule.
* @type YAHOO.widget.MenuModuleItem
*/
YAHOO.widget.MenuModule.prototype.removeItem = function(p_oObject, p_nGroupIndex) {

    if(typeof p_oObject != "undefined") {

        var oItem;

        if(p_oObject instanceof YAHOO.widget.MenuModuleItem) {

            oItem = this._removeItemFromGroupByValue(p_nGroupIndex, p_oObject);           

        }
        else if(typeof p_oObject == "number") {

            oItem = this._removeItemFromGroupByIndex(p_nGroupIndex, p_oObject);

        }

        if(oItem) {

            oItem.destroy();

            return oItem;

        }

    }

};


/**
* Returns a multi-dimensional array of all of a MenuModule's items.
* @return An array of items.
* @type Array
*/        
YAHOO.widget.MenuModule.prototype.getItemGroups = function() {

    return this._aItemGroups;

};


/**
* Returns the item at the specified index.
* @param {Number} p_nItemIndex Number indicating the ordinal position of the 
* item to be retrieved.
* @param {Number} p_nGroupIndex Optional. Number indicating the group to which
* the item belongs.
* @return An item.
* @type YAHOO.widget.MenuModuleItem
*/
YAHOO.widget.MenuModule.prototype.getItem = function(p_nItemIndex, p_nGroupIndex) {

    if(typeof p_nItemIndex == "number") {

        var aGroup = this._getItemGroup(p_nGroupIndex);

        if(aGroup) {

            return aGroup[p_nItemIndex];
        
        }

    }

};


/**
* Removes the MenuModule instance's element from the DOM and sets all child 
* elements to null.
*/
YAHOO.widget.MenuModule.prototype.destroy = function() {

    // Remove DOM event handlers

    this._oEventUtil.removeListener(this.element, "mouseover", this._onElementMouseOver);
    this._oEventUtil.removeListener(this.element, "mouseout", this._onElementMouseOut);
    this._oEventUtil.removeListener(this.element, "click", this._onElementClick);
    this._oEventUtil.removeListener(this.element, "mousedown", this._onDOMEvent);
    this._oEventUtil.removeListener(this.element, "mouseup", this._onDOMEvent);
    this._oEventUtil.removeListener(this.element, "keydown", this._onDOMEvent);
    this._oEventUtil.removeListener(this.element, "keyup", this._onDOMEvent);
    this._oEventUtil.removeListener(this.element, "keypress", this._onDOMEvent);


    // Remove Custom Event listeners

    this.mouseOverEvent.unsubscribeAll();
    this.mouseOutEvent.unsubscribeAll();
    this.mouseDownEvent.unsubscribeAll();
    this.mouseUpEvent.unsubscribeAll();
    this.clickEvent.unsubscribeAll();
    this.keyPressEvent.unsubscribeAll();
    this.keyDownEvent.unsubscribeAll();
    this.keyUpEvent.unsubscribeAll();
    this.beforeMoveEvent.unsubscribeAll();


    var nItemGroups = this._aItemGroups.length,
        nItems,
        i,
        n;


    // Remove all items

    if(nItemGroups > 0) {

        i = nItemGroups - 1;

        do {

            if(this._aItemGroups[i]) {

                nItems = this._aItemGroups[i].length;
    
                if(nItems > 0) {
    
                    n = nItems - 1;
        
                    do {

                        if(this._aItemGroups[i][n]) {
        
                            this._aItemGroups[i][n].destroy();
                        }
        
                    }
                    while(n--);
    
                }

            }

        }
        while(i--);

    }        


    // Continue with the superclass implementation of this method

    YAHOO.widget.MenuModule.superclass.destroy.call(this);

};


/**
* Sets focus to a MenuModule instance's first enabled item.
*/
YAHOO.widget.MenuModule.prototype.setInitialFocus = function() {

    var oItem = this._aItemGroups[0][0];

    if(oItem) {

        if(oItem.cfg.getProperty("disabled")) {

            oItem = oItem.getNextEnabledSibling();

        }

        oItem.focus();

    }        

};


/**
* Sets the "selected" configuration property of a MenuModule instance's first
* enabled item to "true."
*/
YAHOO.widget.MenuModule.prototype.setInitialSelection = function() {

    var oItem = this._aItemGroups[0][0];

    if(oItem) {

        if(oItem.cfg.getProperty("disabled")) {

            oItem = oItem.getNextEnabledSibling();

        }

        oItem.cfg.setProperty("selected", true);

    }        

};


/**
* Initializes the class's configurable properties which can be changed using 
* the MenuModule's Config object (cfg).
*/
YAHOO.widget.MenuModule.prototype.initDefaultConfig = function() {

    YAHOO.widget.MenuModule.superclass.initDefaultConfig.call(this);

	// Add configuration properties

    this.cfg.addProperty("initsubtree", { value: true } );
    this.cfg.addProperty("position", { value: "dynamic", handler: this.configPosition, validator: this._checkPosition } );
    this.cfg.addProperty("submenualignment", { value: ["tl","tr"] } );

};