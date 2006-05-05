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
* @param {String or HTMLElement} p_oElement String id or HTMLElement 
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
* @param {String or HTMLElement} p_oElement String id or HTMLElement 
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
    
            this.cfg.applyConfig(p_oUserConfig, true);
    
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
* Returns the first enabled item in a menu instance.
* @return Returns a MenuModuleItem instance.
* @type YAHOO.widget.MenuModuleItem
* @private
*/
YAHOO.widget.MenuModule.prototype._getFirstEnabledItem = function() {

    var nGroups = this._aItemGroups.length,
        oItem,
        aItemGroup;

    for(var i=0; i<nGroups; i++) {

        aItemGroup = this._aItemGroups[i];
        
        if(aItemGroup) {

            var nItems = aItemGroup.length;
            
            for(var n=0; n<nItems; n++) {
            
                oItem = aItemGroup[n];
                
                if(!oItem.cfg.getProperty("disabled")) {
                
                    return oItem;
                
                }
    
                oItem = null;
    
            }
        
        }
    
    }
    
};


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
YAHOO.widget.MenuModule.prototype._addItemToGroup = 

    function(p_nGroupIndex, p_oItem, p_nItemIndex) {

        if(typeof p_nItemIndex == "number") {

            var nGroupIndex = typeof p_nGroupIndex == "number" ? 
                    p_nGroupIndex : 0,
                    aGroup = this._getItemGroup(nGroupIndex);

    
            if(!aGroup) {
    
                aGroup = this._createItemGroup(nGroupIndex);
    
            }


            var bAppend = (p_nItemIndex >= aGroup.length);            


            if(aGroup[p_nItemIndex]) {
    
                aGroup.splice(p_nItemIndex, 0, p_oItem);
    
            }
            else {
    
                aGroup[p_nItemIndex] = p_oItem;
    
            }


            var oItem = aGroup[p_nItemIndex];

            if(oItem) {

                if(bAppend && !oItem.element.parentNode) {
        
                    this._aListElements[nGroupIndex].appendChild(oItem.element);
    
                }
                else {
  
    
                    /**
                    * Returns the next sibling of an item in an array 
                    * @param {p_aArray} An array
                    * @param {p_nStartIndex} The index to start searching the array 
                    * @ignore
                    * @return Returns an item in an array
                    * @type Object 
                    */
                    function getNextItemSibling(p_aArray, p_nStartIndex) {
            
                        return (
                                p_aArray[p_nStartIndex] || 
                                getNextItemSibling(p_aArray, (p_nStartIndex+1))
                            );
            
                    }
    
    
                    var oNextItemSibling = 
                            getNextItemSibling(aGroup, (p_nItemIndex+1));
    
                    if(oNextItemSibling && !oItem.element.parentNode) {
            
                        this._aListElements[nGroupIndex].insertBefore(
                                oItem.element, 
                                oNextItemSibling.element
                            );
        
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
    
                if(
                    !this._oDom.isAncestor(
                        this._aListElements[nGroupIndex], 
                        oItem.element
                    )
                ) {
    
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
YAHOO.widget.MenuModule.prototype._removeItemFromGroupByIndex = 

    function(p_nGroupIndex, p_nItemIndex) {

        var nGroupIndex = typeof p_nGroupIndex == "number" ? p_nGroupIndex : 0,
            aGroup = this._getItemGroup(nGroupIndex);
    
        if(aGroup) {
    
            var aArray = aGroup.splice(p_nItemIndex, 1),
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
        
        
                    /*
                         Assign the "first" class to the new first UL in 
                         the collection
                    */
        
                    oUL = this._aListElements[0];
        
                    if(oUL) {
        
                        this._oDom.addClass(oUL, "first");
        
                    }            
        
                }
        
        
                // Return a reference to the item that was removed
            
                return oItem;
        
            }
    
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
YAHOO.widget.MenuModule.prototype._removeItemFromGroupByValue =

    function(p_nGroupIndex, p_oItem) {

        var aGroup = this._getItemGroup(p_nGroupIndex);

        if(aGroup) {

            var nItems = aGroup.length,
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
            
                    return this._removeItemFromGroupByIndex(
                                p_nGroupIndex, 
                                nItemIndex
                            );
            
                }
        
            }
        
        }
    
    };


/**
* Updates the index, groupindex, and className properties of the items
* in the specified group. 
* @private
* @param {Number} p_nGroupIndex Number indicating the group of items to update.
*/
YAHOO.widget.MenuModule.prototype._updateItemProperties = 

    function(p_nGroupIndex) {

        var aGroup = this._getItemGroup(p_nGroupIndex),
            nItems = aGroup.length;
    
        if(nItems > 0) {
    
            var i = nItems - 1,
                oItem,
                oLI;
    
            // Update the index and className properties of each member        
        
            do {
    
                oItem = aGroup[i];
    
                if(oItem) {
        
                    oLI = oItem.element;
    
                    oItem.index = i;
                    oItem.groupIndex = p_nGroupIndex;
    
                    oLI.setAttribute("groupindex", p_nGroupIndex);
                    oLI.setAttribute("index", i);
    
                    this._oDom.removeClass(oLI, "first");
    
                }
        
            }
            while(i--);
    
    
            if(oLI) {
    
                this._oDom.addClass(oLI, "first");
    
            }
    
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
YAHOO.widget.MenuModule.prototype._configureItemSubmenuModule = 

    function(p_oItem) {

        var oSubmenu = p_oItem.cfg.getProperty("submenu");
    
        if(oSubmenu) {
    
            /*
                Listen for configuration changes to the parent MenuModule 
                instance so they they can be applied to the submenu.
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
YAHOO.widget.MenuModule.prototype._fireItemEvent = 

    function(p_oElement, p_sEventType, p_oDOMEvent) {

        var me = this;
    
        /**
        * Returns the specified element's parent HTMLLIElement (&#60;LI&#60;)
        * @param {p_oElement} An HTMLElement node
        * @ignore
        * @return Returns an HTMLElement node
        * @type HTMLElement 
        */
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
YAHOO.widget.MenuModule.prototype._onDOMEvent = 

    function(p_oEvent, p_oMenuModule) {

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
YAHOO.widget.MenuModule.prototype._onElementMouseOver = 

    function(p_oEvent, p_oMenuModule) {

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
YAHOO.widget.MenuModule.prototype._onElementMouseOut = 

    function(p_oEvent, p_oMenuModule) {

        var oRelatedTarget = this._oEventUtil.getRelatedTarget(p_oEvent),
            bLIMouseOut = true,
            bMovingToSubmenu = false;
    
    
        // Determine where the mouse is going
    
        if(this._oCurrentItem && oRelatedTarget) {
    
            if(
                oRelatedTarget == this._oCurrentItem.element || 

                this._oDom.isAncestor(
                        this._oCurrentItem.element, 
                        oRelatedTarget
                    )
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
YAHOO.widget.MenuModule.prototype._onElementClick = 

    function(p_oEvent, p_oMenuModule) {

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
        
                }
                else {

                    var oActiveItem = this.activeItem;
               

                    // Hide any other submenus that might be visible
                
                    if(oActiveItem && oActiveItem != this) {
                
                        this.clearActiveItem();
                
                    }

                    this.activeItem = oItem;
        
                    oItem.cfg.setProperty("selected", true);

                    oSubmenu.show();
        
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
                        Break if the anchor's URL is something other than "#" 
                        to prevent the call to "stopPropagation" from be 
                        executed.  This is required for Safari to be able to 
                        follow the URL.
                    */
                
                    break;
                
                }
            
            default:
    
                /*
                    Stop the propagation of the event at each MenuModule 
                    instance since Menus can be embedded in eachother.
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

    var oNode;

    switch(this.srcElement.tagName) {

        case "DIV":

            if(this._aListElements.length > 0) {

                var i = this._aListElements.length - 1;

                do {
        
                    oNode = this._aListElements[i].firstChild;
    
                    do {
    
                        switch(oNode.tagName) {
        
                            case "LI":
        
                                this.addItem(new this.ITEM_TYPE(oNode), i);
        
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

                        this.addItem(new this.ITEM_TYPE(oNode));

                    break;

                }

            }
            while((oNode = oNode.nextSibling));

        break;

    }

};


/**
* "beforerender" Custom Event handler for a MenuModule instance.  Appends all 
* of the HTMLUListElement (&#60;UL&#60;s) nodes (and their child 
* HTMLLIElement (&#60;LI&#60;)) nodes and their accompanying title nodes to  
* the body of the MenuModule instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance that 
* fired the event.
*/
YAHOO.widget.MenuModule.prototype._onBeforeRender = 

    function(p_sType, p_aArguments, p_oMenuModule) {

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
YAHOO.widget.MenuModule.prototype._onRender = 

    function(p_sType, p_aArguments, p_oMenuModule) {

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
YAHOO.widget.MenuModule.prototype._onShow = 

    function(p_sType, p_aArguments, p_oMenuModule) {
    
        /*
            Setting focus to an item in the newly visible submenu alerts the 
            contents of the submenu to the screen reader.
        */

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
YAHOO.widget.MenuModule.prototype._onHide = 

    function(p_sType, p_aArguments, p_oMenuModule) {

        if(this.activeItem) {
    
            if(this.activeItem.cfg.getProperty("selected")) {
    
                this.activeItem.cfg.setProperty("selected", false);
                this.activeItem.blur();
    
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
YAHOO.widget.MenuModule.prototype._onParentMenuModuleConfigChange = 

    function(p_sType, p_aArguments, p_oSubmenu) {
    
        var sPropertyName = p_aArguments[0][0],
            oPropertyValue = p_aArguments[0][1];
    
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
YAHOO.widget.MenuModule.prototype._onParentMenuModuleRender = 

    function(p_sType, p_aArguments, p_oSubmenu) {

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
YAHOO.widget.MenuModule.prototype._onSubmenuBeforeShow = 

    function(p_sType, p_aArguments, p_oSubmenu) {
    
        var aAlignment = this.parent.parent.cfg.getProperty("submenualignment");

        this.cfg.setProperty(
            "submenualignment", 
            [ aAlignment[0], aAlignment[1] ]
        );

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
YAHOO.widget.MenuModule.prototype._onSubmenuShow = 

    function(p_sType, p_aArguments, p_oSubmenu) {
    
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
YAHOO.widget.MenuModule.prototype._onSubmenuHide = 

    function(p_sType, p_aArguments, p_oSubmenu) {
    
        if(this.parent.parent.cfg.getProperty("visible")) {

            this.parent.cfg.setProperty("selected", false);
    
            this.parent.focus();
        
        }

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
YAHOO.widget.MenuModule.prototype._onItemFocus = 

    function(p_sType, p_aArguments, p_aObjects) {
    
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
YAHOO.widget.MenuModule.prototype._onItemBlur = 

    function(p_sType, p_aArguments, p_aObjects) {
    
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
YAHOO.widget.MenuModule.prototype._onItemConfigChange = 

    function(p_sType, p_aArguments, p_aObjects) {
    
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
YAHOO.widget.MenuModule.prototype.enforceConstraints = 

    function(type, args, obj) {
    
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
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance fired
* the event.
* @see YAHOO.widget.Overlay#configIframe
*/
YAHOO.widget.MenuModule.prototype.configPosition = 

    function(p_sType, p_aArguments, p_oMenuModule) {

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
YAHOO.widget.MenuModule.prototype.setItemGroupTitle = 

    function(p_sGroupTitle, p_nGroupIndex) {
        
        if(typeof p_sGroupTitle == "string" && p_sGroupTitle.length > 0) {
    
            var nGroupIndex = 
                    typeof p_nGroupIndex == "number" ? p_nGroupIndex : 0,
    
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
    
                    this._oDom.removeClass(
                        this._aGroupTitleElements[i],
                        "first"
                    );

                    nFirstIndex = i;
    
                }
    
            }
            while(i--);
    
    
            if(nFirstIndex !== null) {
    
                this._oDom.addClass(
                    this._aGroupTitleElements[nFirstIndex], 
                    "first"
                );
    
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
YAHOO.widget.MenuModule.prototype.insertItem = 

    function(p_oItem, p_nItemIndex, p_nGroupIndex) {
    
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
YAHOO.widget.MenuModule.prototype.removeItem =

    function(p_oObject, p_nGroupIndex) {
    
        if(typeof p_oObject != "undefined") {
    
            var oItem;
    
            if(p_oObject instanceof YAHOO.widget.MenuModuleItem) {
    
                oItem = 
                    this._removeItemFromGroupByValue(p_nGroupIndex, p_oObject);           
    
            }
            else if(typeof p_oObject == "number") {
    
                oItem = 
                    this._removeItemFromGroupByIndex(p_nGroupIndex, p_oObject);
    
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
YAHOO.widget.MenuModule.prototype.getItem = 

    function(p_nItemIndex, p_nGroupIndex) {
    
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

    this._oEventUtil.removeListener(
        this.element, 
        "mouseover", 
        this._onElementMouseOver
    );

    this._oEventUtil.removeListener(
        this.element, 
        "mouseout", 
        this._onElementMouseOut
    );

    this._oEventUtil.removeListener(
        this.element, 
        "click", 
        this._onElementClick
    );

    this._oEventUtil.removeListener(
        this.element, 
        "mousedown", 
        this._onDOMEvent
        );

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

    var oItem = this._getFirstEnabledItem();
    
    if(oItem) {
    
        oItem.focus();
    }
    
};


/**
* Sets the "selected" configuration property of a MenuModule instance's first
* enabled item to "true."
*/
YAHOO.widget.MenuModule.prototype.setInitialSelection = function() {

    var oItem = this._getFirstEnabledItem();
    
    if(oItem) {
    
        oItem.cfg.setProperty("selected", true);
    }        

};


/**
* Sets the "selected" configuration property of a MenuModule instance's active 
* item to "false," blurs the item and hide's the item's submenu.
*/
YAHOO.widget.MenuModule.prototype.clearActiveItem = function () {

    var oActiveItem = this.activeItem;

    if(oActiveItem) {

        oActiveItem.cfg.setProperty("selected", false);

        var oSubmenu = oActiveItem.cfg.getProperty("submenu");

        if(oSubmenu) {

            oSubmenu.hide();

        }

    }

};


/**
* Initializes the class's configurable properties which can be changed using 
* the MenuModule's Config object (cfg).
*/
YAHOO.widget.MenuModule.prototype.initDefaultConfig = function() {

    YAHOO.widget.MenuModule.superclass.initDefaultConfig.call(this);

	// Add configuration properties

    this.cfg.addProperty(
        "position", 
        {
            value: "dynamic", 
            handler: this.configPosition, 
            validator: this._checkPosition 
        } 
    );

    this.cfg.refireEvent("position");

    this.cfg.addProperty("submenualignment", { value: ["tl","tr"] } );

};


/**
* @class The MenuModuleItem class allows you to create and modify an item for a
* MenuModule instance.
* @constructor
* @param {String or HTMLElement} p_oObject String or HTMLElement 
* (either HTMLLIElement, HTMLOptGroupElement or HTMLOptionElement) of the 
* source HTMLElement node.
* @param {Object} p_oUserConfig The configuration object literal containing 
* the configuration for a MenuModuleItem instance. See the configuration 
* class documentation for more details.
*/
YAHOO.widget.MenuModuleItem = function(p_oObject, p_oUserConfig) {

    if(p_oObject) {

        this.init(p_oObject, p_oUserConfig);

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
    SUBMENU_INDICATOR_IMAGE_PATH: "nt/ic/ut/alt1/menuarorght9_nrm_1.gif",


    /**
    * Constant representing the path to the image to be used for the submenu
    * arrow indicator when a MenuModuleItem instance has focus.
    * @final
    * @type String
    */
    SELECTED_SUBMENU_INDICATOR_IMAGE_PATH: 
        "nt/ic/ut/alt1/menuarorght9_hov_1.gif",


    /**
    * Constant representing the path to the image to be used for the submenu
    * arrow indicator when a MenuModuleItem instance is disabled.
    * @final
    * @type String
    */
    DISABLED_SUBMENU_INDICATOR_IMAGE_PATH: 
        "nt/ic/ut/alt1/menuarorght9_dim_1.gif",


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


    // Private member variables
    
    /**
    * Reference to the HTMLAnchorElement of the MenuModuleItem's core internal
    * DOM structure.
    * @private
    * @type {HTMLAnchorElement}
    */
    _oAnchor: null,
    

    /**
    * Reference to the text node of the MenuModuleItem's core internal
    * DOM structure.
    * @private
    * @type {Text}
    */
    _oText: null,
    
    
    /**
    * Reference to the HTMLElement (&#60;EM&#60;) used to create the optional
    * help text for a MenuModuleItem instance.
    * @private
    * @type {HTMLElement}
    */
    _oHelpTextEM: null,
    
    
    /**
    * Reference to the submenu for a MenuModuleItem instance.
    * @private
    * @type {YAHOO.widget.MenuModule}
    */
    _oSubmenu: null,
    
    
    /**
    * Reference to the Dom utility singleton.
    * @private
    * @type {YAHOO.util.Dom}
    */
    _oDom: YAHOO.util.Dom,


    /**
    * Reference to the browser's user agent string.
    * @private
    * @type {String}
    */
    _sUserAgent: window.navigator.userAgent.toLowerCase(),


    // Public properties

	/**
	* The class's constructor function
	* @type YAHOO.widget.MenuModuleItem
	*/
	constructor: YAHOO.widget.MenuModuleItem,


	/**
	* The string representing the image root
	* @type string
	*/
	imageRoot: YAHOO.widget.Module.IMG_ROOT,


	/**
	* Boolean representing whether or not the current browsing context 
	* is secure (https)
	* @type boolean
	*/
	isSecure: function() {

		if(window.location.href.toLowerCase().indexOf("https") === 0) {

			this.imageRoot = YAHOO.widget.Module.IMG_ROOT_SSL;

			return true;

		} else {

			return false;

		}

	}(),


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
    * @type {YAHOO.widget.MenuModule}
    */
    parent: null,


    /**
    * Returns the HTMLLIElement for a MenuModuleItem instance.
    * @type {HTMLLIElement}
    */
    element: null,


    /**
    * Returns the HTMLElement (either HTMLLIElement, HTMLOptGroupElement or
    * HTMLOptionElement) used create the MenuModuleItem instance.
    * @type {HTMLLIElement/HTMLOptGroupElement/HTMLOptionElement}
    */
    srcElement: null,


    /**
    * Specifies an arbitrary value for a MenuModuleItem instance.
    * @type {Object}
    */
    value: null,


    /**
    * Reference to the HTMLImageElement used to create the submenu
    * indicator for a MenuModuleItem instance.
    * @type {HTMLImageElement}
    */
    subMenuIndicator: null,


	/**
	* String representing the browser
	* @type string
	*/
	browser: function() {

        var sUserAgent = navigator.userAgent.toLowerCase();

        // Opera (check first in case of spoof)
    
        if(sUserAgent.indexOf("opera")!=-1) { 
        
            return "opera";
        
        // IE7

        } else if(sUserAgent.indexOf("msie 7")!=-1) {
        
            return "ie7";
        
        // IE

        } else if(sUserAgent.indexOf("msie") !=-1) {
        
            return "ie";
        
        // Safari (check before Gecko because it includes "like Gecko")

        } else if(sUserAgent.indexOf("safari")!=-1) {
        
            return "safari";
        
        // Gecko

        } else if(sUserAgent.indexOf("gecko") != -1) {
        
            return "gecko";
        
        } else {
        
            return false;
        
        }

    }(),


    // Events

    /**
    * Fires when a MenuModuleItem instances's HTMLLIElement is removed from
    * it's parent HTMLUListElement node.
    * @type {YAHOO.util.CustomEvent}
    * @see YAHOO.util.CustomEvent
    */
    destroyEvent: null,


    /**
    * Fires when the mouse has entered a MenuModuleItem instance.  Passes
    * back the DOM Event object as an argument.
    * @type {YAHOO.util.CustomEvent}
    * @see YAHOO.util.CustomEvent
    */
    mouseOverEvent: null,


    /**
    * Fires when the mouse has left a MenuModuleItem instance.  Passes back  
    * the DOM Event object as an argument.
    * @type {YAHOO.util.CustomEvent}
    * @see YAHOO.util.CustomEvent
    */
    mouseOutEvent: null,


    /**
    * Fires when the user mouses down on a MenuModuleItem instance.  Passes 
    * back the DOM Event object as an argument.
    * @type {YAHOO.util.CustomEvent}
    * @see YAHOO.util.CustomEvent
    */
    mouseDownEvent: null,


    /**
    * Fires when the user releases a mouse button while the mouse is 
    * over a MenuModuleItem instance.  Passes back the DOM Event object as
    * an argument.
    * @type {YAHOO.util.CustomEvent}
    * @see YAHOO.util.CustomEvent
    */
    mouseUpEvent: null,


    /**
    * Fires when the user clicks the on a MenuModuleItem instance.  Passes 
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
    * Fires when a MenuModuleItem instance receives focus.
    * @type {YAHOO.util.CustomEvent}
    * @see YAHOO.util.CustomEvent
    */
    focusEvent: null,


    /**
    * Fires when a MenuModuleItem instance loses the input focus.
    * @type {YAHOO.util.CustomEvent}
    * @see YAHOO.util.CustomEvent
    */
    blurEvent: null,


    /**
    * The MenuModuleItem class's initialization method. This method is 
    * automatically called by the constructor, and sets up all DOM references 
    * for pre-existing markup, and creates required markup if it is not
    * already present.
    * @param {String or HTMLElement} p_oObject String or HTMLElement 
    * (either HTMLLIElement, HTMLOptGroupElement or HTMLOptionElement) of the 
    * source HTMLElement node.
    * @param {Object} p_oUserConfig The configuration object literal containing 
    * the configuration for a MenuModuleItem instance. See the configuration 
    * class documentation for more details.
    */
    init: function(p_oObject, p_oUserConfig) {

        if(!this.SUBMENU_TYPE) {
    
            this.SUBMENU_TYPE = YAHOO.widget.MenuModule;
    
        }

        if(!this.SUBMENU_ITEM_TYPE) {
    
            this.SUBMENU_ITEM_TYPE = YAHOO.widget.MenuModuleItem;
    
        }


        // Create the config object

        this.cfg = new YAHOO.util.Config(this);


        // Define the config properties


        this.cfg.addProperty(
            "text", 
            { 
                value:"", 
                handler: this.configText, 
                validator: this._checkString, 
                suppressEvent: true 
            }
        );
        
        this.cfg.addProperty("helptext", { handler: this.configHelpText });
        
        this.cfg.addProperty(
            "url", 
            { value: "#", handler: this.configURL, suppressEvent: true }
        );
        
        this.cfg.addProperty(
            "emphasis", 
            { 
                value: false, 
                handler: this.configEmphasis, 
                validator: this.cfg.checkBoolean, 
                suppressEvent: true 
            }
        );
        
        this.cfg.addProperty(
            "strongemphasis", 
            {
                value: false, 
                handler: this.configStrongEmphasis, 
                validator: this.cfg.checkBoolean, 
                suppressEvent: true 
            }
        );
        
        this.cfg.addProperty(
            "disabled", 
            {
                value: false, 
                handler: this.configDisabled, 
                validator: this.cfg.checkBoolean, 
                suppressEvent: true 
            }
        );
        
        this.cfg.addProperty(
            "selected", 
            {
                value: false, 
                handler: this.configSelected, 
                validator: this.cfg.checkBoolean, 
                suppressEvent: true 
            }
        );
        
        this.cfg.addProperty("submenu", { handler: this.configSubmenu });


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

                    this._initSubTree();

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

                        var oText = p_oObject.firstChild;

                        sText = oText.nodeValue;

                        oAnchor = document.createElement("a");

                        p_oObject.replaceChild(oAnchor, oText);
                        
                        oAnchor.appendChild(oText);

                    }


                    this.srcElement = p_oObject;
                    this.element = p_oObject;
                    this._oAnchor = oAnchor;
    

                    // Check if emphasis has been applied to the MenuModuleItem

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


            if(p_oUserConfig) {
    
                this.cfg.applyConfig(p_oUserConfig);
    
            }        

            this.cfg.fireQueue();

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

        var Menu = this.SUBMENU_TYPE,
            MenuModuleItem = this.SUBMENU_ITEM_TYPE;


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
    
                    this._oSubmenu.addItem((new MenuModuleItem(aOptions[n])));
    
                }
    
            }

        }

    },


    // Event handlers for configuration properties

    /**
    * Event handler for when the "text" configuration property of
    * a MenuModuleItem instance changes. 
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuModuleItem} p_oItem The MenuModuleItem instance 
    * that fired the event.
    */
    configText: function(p_sType, p_aArguments, p_oItem) {

        var sText = p_aArguments[0];


        if(this._oText) {

            this._oText.nodeValue = sText;

        }

    },


    /**
    * Event handler for when the "helptext" configuration property of
    * a MenuModuleItem instance changes. 
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuModuleItem} p_oItem The MenuModuleItem instance 
    * that fired the event.
    */    
    configHelpText: function(p_sType, p_aArguments, p_oItem) {

        var oHelpText = p_aArguments[0],
            aNodes = [this.element, this._oAnchor],
            me = this;


        /**
        * Adds the "hashelptext" class to the necessary nodes and refires the 
        * "selected" and "disabled" configuration events
        * @ignore
        */
        function initHelpText() {

            me._oDom.addClass(aNodes, "hashelptext");

            if(me.cfg.getProperty("disabled")) {

                me.cfg.refireEvent("disabled");

            }

            if(me.cfg.getProperty("selected")) {

                me.cfg.refireEvent("selected");

            }                

        }


        /**
        * Removes the "hashelptext" class and corresponding DOM element (EM)
        * @ignore
        */
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
    * a MenuModuleItem instance changes.  
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuModuleItem} p_oItem The MenuModuleItem instance 
    * that fired the event.
    */    
    configURL: function(p_sType, p_aArguments, p_oItem) {

        var sURL = p_aArguments[0];

        if(!sURL) {

            sURL = "#";

        }

        this._oAnchor.setAttribute("href", sURL);

    },


    /**
    * Event handler for when the "emphasis" configuration property of
    * a MenuModuleItem instance changes.  
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuModuleItem} p_oItem The MenuModuleItem instance 
    * that fired the event.
    */    
    configEmphasis: function(p_sType, p_aArguments, p_oItem) {

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
    * a MenuModuleItem instance changes. 
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuModuleItem} p_oItem The MenuModuleItem instance 
    * that fired the event.
    */    
    configStrongEmphasis: function(p_sType, p_aArguments, p_oItem) {

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
    * a MenuModuleItem instance changes. 
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuModuleItem} p_oItem The MenuModuleItem instance 
    * that fired the event.
    */    
    configDisabled: function(p_sType, p_aArguments, p_oItem) {

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

            this._oDom.addClass(aNodes, "disabled");

            sImageId = "yuidisabledsubmenuindicator";
            sImageAlt = this.DISABLED_SUBMENU_INDICATOR_ALT_TEXT;

        }
        else {

            this._oAnchor.setAttribute("href", this.cfg.getProperty("url"));

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
    * a MenuModuleItem instance changes. 
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuModuleItem} p_oItem The MenuModuleItem instance 
    * that fired the event.
    */    
    configSelected: function(p_sType, p_aArguments, p_oItem) {

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
    * a MenuModuleItem instance changes. 
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuModuleItem} p_oItem The MenuModuleItem instance 
    * that fired the event.
    */
    configSubmenu: function(p_sType, p_aArguments, p_oItem) {

        var oSubmenu = p_aArguments[0],
            aNodes = [this.element, this._oAnchor];

        if(oSubmenu) {

            // Set the submenu's parent to this MenuModuleItem instance

            oSubmenu.parent = this;

            this._oSubmenu = oSubmenu;


            if(!this.subMenuIndicator) { 

                var oSubMenuIndicator = 
                        document.getElementById("yuisubmenuindicator");

                if(!oSubMenuIndicator) {

                    oSubMenuIndicator = document.createElement("img");

                    oSubMenuIndicator.src = 
                        (this.imageRoot + this.SUBMENU_INDICATOR_IMAGE_PATH);
        
                    oSubMenuIndicator.alt = 
                        this.COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT;

                    oSubMenuIndicator.id = "yuisubmenuindicator";


                    var oSelectedSubMenuIndicator = 
                            document.createElement("img");

                        oSelectedSubMenuIndicator.src = 
                            (
                                this.imageRoot + 
                                this.SELECTED_SUBMENU_INDICATOR_IMAGE_PATH
                            );

                        oSelectedSubMenuIndicator.id = 
                            "yuiselectedsubmenuindicator";
                    

                    var oDisabledSubMenuIndicator = 
                            document.createElement("img");

                        oDisabledSubMenuIndicator.src = 
                            (
                                this.imageRoot + 
                                this.DISABLED_SUBMENU_INDICATOR_IMAGE_PATH
                            );

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
    * Finds the next enabled MenuModuleItem instance in a MenuModule instance 
    * @return Returns a MenuModuleItem instance.
    * @type YAHOO.widget.MenuModuleItem
    */
    getNextEnabledSibling: function() {

        if(this.parent instanceof YAHOO.widget.MenuModule) {


            /**
            * Returns the next item in an array 
            * @param {p_aArray} An array
            * @param {p_nStartIndex} The index to start searching the array 
            * @ignore
            * @return Returns an item in an array
            * @type Object 
            */
            function getNextArrayItem(p_aArray, p_nStartIndex) {
    
                return p_aArray[p_nStartIndex] || 
                    getNextArrayItem(p_aArray, (p_nStartIndex+1));
    
            }
    
    
            var aItemGroups = this.parent.getItemGroups(),
                oNextItem;
    
    
            if(this.index < (aItemGroups[this.groupIndex].length - 1)) {
    
                oNextItem = getNextArrayItem(
                        aItemGroups[this.groupIndex], 
                        (this.index+1)
                    );
    
            }
            else {
    
                var nNextGroupIndex;
    
                if(this.groupIndex < (aItemGroups.length - 1)) {
    
                    nNextGroupIndex = this.groupIndex + 1;
    
                }
                else {
    
                    nNextGroupIndex = 0;
    
                }
    
                var aNextGroup = getNextArrayItem(aItemGroups, nNextGroupIndex);
    
                // Retrieve the first MenuModuleItem instance in the next group
    
                oNextItem = getNextArrayItem(aNextGroup, 0);
    
            }
    
            return oNextItem.cfg.getProperty("disabled") ? 
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

            /**
            * Returns the previous item in an array 
            * @param {p_aArray} An array
            * @param {p_nStartIndex} The index to start searching the array 
            * @ignore
            * @return Returns an item in an array
            * @type Object 
            */
            function getPreviousArrayItem(p_aArray, p_nStartIndex) {
    
                return p_aArray[p_nStartIndex] || 
                    getPreviousArrayItem(p_aArray, (p_nStartIndex-1));
    
            }


            /**
            * Get the index of the first item in an array 
            * @param {p_aArray} An array
            * @param {p_nStartIndex} The index to start searching the array 
            * @ignore
            * @return Returns an item in an array
            * @type Object 
            */    
            function getFirstItemIndex(p_aArray, p_nStartIndex) {
    
                return p_aArray[p_nStartIndex] ? 
                    p_nStartIndex : 
                    getFirstItemIndex(p_aArray, (p_nStartIndex+1));
    
            }
    
            var aItemGroups = this.parent.getItemGroups(),
                oPreviousItem;
    
            if(
                this.index > getFirstItemIndex(aItemGroups[this.groupIndex], 0)
            ) {
    
                oPreviousItem = 
                    getPreviousArrayItem(
                        aItemGroups[this.groupIndex], 
                        (this.index-1)
                    );
    
            }
            else {
    
                var nPreviousGroupIndex;
    
                if(this.groupIndex > getFirstItemIndex(aItemGroups, 0)) {
    
                    nPreviousGroupIndex = this.groupIndex - 1;
    
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
    
            return oPreviousItem.cfg.getProperty("disabled") ? 
                    oPreviousItem.getPreviousEnabledSibling() : oPreviousItem;

        }

    },


    /**
    * Causes a MenuModuleItem instance to receive the focus and fires the
    * focus event.
    */
    focus: function() {

        if(
            !this.cfg.getProperty("disabled") && 
            this.parent && 
            this.parent.cfg.getProperty("visible")
        ) {

            var oActiveItem = this.parent.activeItem;

            if(oActiveItem) {

                oActiveItem.blur();

            }

            this._oAnchor.focus();

            /*
                Opera 8.5 doesn't always focus the anchor if a MenuModuleItem
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
    * Causes a MenuModuleItem instance to lose focus and fires the onblur event.
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
	* Removes a MenuModuleItem instance's HTMLLIElement from it's parent
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


/**
* @class Extends YAHOO.widget.MenuModule to provide a set of default mouse and 
* key event behaviors.
* @constructor
* @extends YAHOO.widget.MenuModule
* @base YAHOO.widget.MenuModule
* @param {String or HTMLElement} p_oElement String id or HTMLElement 
* (either HTMLSelectElement or HTMLDivElement) of the source HTMLElement node.
* @param {Object} p_oUserConfig Optional. The configuration object literal 
* containing the configuration for a Menu instance. See 
* configuration class documentation for more details.
*/
YAHOO.widget.Menu = function(p_oElement, p_oUserConfig) {

    if(arguments.length > 0) {

        YAHOO.widget.Menu.superclass.constructor.call(
                this, 
                p_oElement,
                p_oUserConfig
            );

    }

};

YAHOO.widget.Menu.prototype = new YAHOO.widget.MenuModule();
YAHOO.widget.Menu.prototype.constructor = YAHOO.widget.Menu;
YAHOO.widget.Menu.superclass = YAHOO.widget.MenuModule.prototype;


/**
* The Menu class's initialization method. This method is automatically 
* called by the constructor, and sets up all DOM references for pre-existing 
* markup, and creates required markup if it is not already present.
* @param {String or HTMLElement} p_oElement String id or HTMLElement 
* (either HTMLSelectElement or HTMLDivElement) of the source HTMLElement node.
* @param {Object} p_oUserConfig Optional. The configuration object literal 
* containing the configuration for a Menu instance. See 
* configuration class documentation for more details.
*/
YAHOO.widget.Menu.prototype.init = function(p_oElement, p_oUserConfig) {

    if(!this.ITEM_TYPE) {

        this.ITEM_TYPE = YAHOO.widget.MenuItem;

    }


    // Call the init of the superclass (YAHOO.widget.Menu)

    YAHOO.widget.Menu.superclass.init.call(this, p_oElement);


    this.beforeInitEvent.fire(YAHOO.widget.Menu);


    // Add event handlers

    this.mouseOverEvent.subscribe(this._onMouseOver, this, true);
    this.keyDownEvent.subscribe(this._onKeyDown, this, true);


    if(p_oUserConfig) {

        this.cfg.applyConfig(p_oUserConfig, true);

    }
    
    this.initEvent.fire(YAHOO.widget.Menu);

};


// Private event handlers

/**
* "mouseover" Custom Event handler for a Menu instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.Menu} p_oMenu The Menu instance that fired the event.
*/
YAHOO.widget.Menu.prototype._onMouseOver = 

    function(p_sType, p_aArguments, p_oMenu) {
    
        /*
            If the menu is a submenu, then select the menu's parent
            MenuItem instance
        */
    
        if(this.parent) {
    
            this.parent.cfg.setProperty("selected", true);
    
        }
    
    };


/**
* "mouseover" Custom Event handler for a Menu instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.Menu} p_oMenu The Menu instance that fired the event.
*/
YAHOO.widget.Menu.prototype._onKeyDown = 

    function(p_sType, p_aArguments, p_oMenu) {
    
        if(this.cfg.getProperty("position") == "dynamic") {
    
            var oEvent = p_aArguments[0];
        
            if(oEvent.keyCode == 27) { // Esc key
        
                this.hide();
        
                // Set focus to the parent MenuItem if one exists
        
                if(this.parent) {
        
                    this.parent.focus();

                    if(this.parent.parent instanceof YAHOO.widget.Menu) {

                        this.parent.cfg.setProperty("selected", true);
        
                    }
        
                }
            
            }
        
        }
    
    };
    

/**
* @class The MenuItem class allows you to create and modify an item for a
* Menu instance.  MenuItem extends YAHOO.widget.MenuModuleItem to provide a 
* set of default mouse and key event behaviors.
* @constructor
* @extends YAHOO.widget.MenuModuleItem
* @base YAHOO.widget.MenuModuleItem
* @param {String or HTMLElement} p_oObject String or HTMLElement 
* (either HTMLLIElement, HTMLOptGroupElement or HTMLOptionElement) of the 
* source HTMLElement node.
* @param {Object} p_oUserConfig The configuration object literal containing 
* the configuration for a MenuItem instance. See the configuration 
* class documentation for more details.
*/
YAHOO.widget.MenuItem = function(p_oObject, p_oUserConfig) {

    if(p_oObject) {

        YAHOO.widget.MenuItem.superclass.constructor.call(
            this, 
            p_oObject, 
            p_oUserConfig
        );

    }

};

YAHOO.widget.MenuItem.prototype = new YAHOO.widget.MenuModuleItem();
YAHOO.widget.MenuItem.prototype.constructor = YAHOO.widget.MenuItem;
YAHOO.widget.MenuItem.superclass = YAHOO.widget.MenuModuleItem.prototype;


/**
* The MenuItem class's initialization method. This method is automatically
* called by the constructor, and sets up all DOM references for
* pre-existing markup, and creates required markup if it is not
* already present.
* @param {String or HTMLElement} p_oObject String or HTMLElement 
* (either HTMLLIElement, HTMLOptGroupElement or HTMLOptionElement) of the 
* source HTMLElement node.
* @param {Object} p_oUserConfig The configuration object literal containing 
* the configuration for a MenuItem instance. See the configuration 
* class documentation for more details.
*/
YAHOO.widget.MenuItem.prototype.init = function(p_oObject, p_oUserConfig) {

    if(!this.SUBMENU_TYPE) {

        this.SUBMENU_TYPE = YAHOO.widget.Menu;

    }

    if(!this.SUBMENU_ITEM_TYPE) {

        this.SUBMENU_ITEM_TYPE = YAHOO.widget.MenuItem;

    }


    /* 
        Call the init of the superclass (YAHOO.widget.MenuModuleItem)
        Note: We don't pass the user config in here yet 
        because we only want it executed once, at the lowest 
        subclass level.
    */ 

    YAHOO.widget.MenuItem.superclass.init.call(this, p_oObject);  


    // Add event handlers to each "MenuItem" instance

    this.keyDownEvent.subscribe(this._onKeyDown, this, true);
    this.mouseOverEvent.subscribe(this._onMouseOver, this, true);
    this.mouseOutEvent.subscribe(this._onMouseOut, this, true);


    if(p_oUserConfig) {

        this.cfg.applyConfig(p_oUserConfig, true);

    }

    this.cfg.fireQueue();

};


// Private event handlers


/**
* "keydown" Custom Event handler for a MenuItem instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance that 
* fired the event.
*/
YAHOO.widget.MenuItem.prototype._onKeyDown = 

    function(p_sType, p_aArguments, p_oMenuItem) {
    
        var oEvent = p_aArguments[0];
    
        switch(oEvent.keyCode) {
    
            case 38:    // Up arrow
            case 40:    // Down arrow
    
                var oActiveItem = this.parent.activeItem;
    
                if(this == oActiveItem && !this.cfg.getProperty("selected")) {
    
                    this.cfg.setProperty("selected", true);
    
                }
                else {
    
                    var oNextItem = (oEvent.keyCode == 38) ? 
                            this.getPreviousEnabledSibling() : 
                            this.getNextEnabledSibling();
            
                    if(oNextItem) {

                        this.parent.clearActiveItem();

                        oNextItem.cfg.setProperty("selected", true);
            
                        oNextItem.focus();
    
                    }
    
                }
    
                YAHOO.util.Event.preventDefault(oEvent);

            break;
            
    
            case 39:    // Right arrow

                this.parent.clearActiveItem();

                this.cfg.setProperty("selected", true);
                
                this.focus();


                var oSubmenu = this.cfg.getProperty("submenu");
    
                if(oSubmenu) {

                    oSubmenu.show();
                    oSubmenu.setInitialSelection();                    
    
                }
                else if(
                    YAHOO.widget.MenuBarItem && 
                    this.parent.parent && 
                    this.parent.parent instanceof YAHOO.widget.MenuBarItem
                ) {

                    this.parent.hide();
    
                    // Set focus to the parent MenuItem if one exists
    
                    var oMenuItem = this.parent.parent;
    
                    if(oMenuItem) {
    
                        oMenuItem.focus();
                        oMenuItem.cfg.setProperty("selected", true);
    
                    }                    
                
                }
    
                YAHOO.util.Event.preventDefault(oEvent);

            break;
    
    
            case 37:    // Left arrow
    
                // Only hide if this this is a MenuItem of a submenu
    
                if(this.parent.parent) {
    
                    this.parent.hide();
    
                    // Set focus to the parent MenuItem if one exists
    
                    var oMenuItem = this.parent.parent;
    
                    if(oMenuItem) {
    
                        oMenuItem.focus();
                        oMenuItem.cfg.setProperty("selected", true);
    
                    }
    
                }

                YAHOO.util.Event.preventDefault(oEvent);
    
            break;        
    
        }
    
    };


/**
* "mouseover" Custom Event handler for a MenuItem instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance that 
* fired the event.
*/
YAHOO.widget.MenuItem.prototype._onMouseOver = 

    function(p_sType, p_aArguments, p_oMenuItem) {
    
        var oActiveItem = this.parent.activeItem;
    
    
        // Hide any other submenus that might be visible
    
        if(oActiveItem && oActiveItem != this) {
    
            this.parent.clearActiveItem();
    
        }
    
    
        // Select and focus the current MenuItem instance
    
        this.cfg.setProperty("selected", true);
        this.focus();
    
    
        // Show the submenu for this instance
    
        var oSubmenu = this.cfg.getProperty("submenu");
    
        if(oSubmenu) {
    
            oSubmenu.show();
    
        }
    
    };


/**
* "mouseout" Custom Event handler for a MenuItem instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance that 
* fired the event.
*/
YAHOO.widget.MenuItem.prototype._onMouseOut = 

    function(p_sType, p_aArguments, p_oMenuItem) {
    
        this.cfg.setProperty("selected", false);
    
    
        var oSubmenu = this.cfg.getProperty("submenu");
    
        if(oSubmenu) {
    
            var oEvent = p_aArguments[0],
                oRelatedTarget = YAHOO.util.Event.getRelatedTarget(oEvent);
    
            if(
                !(
                    oRelatedTarget == oSubmenu.element || 
                    this._oDom.isAncestor(oSubmenu.element, oRelatedTarget)
                )
            ) {
    
                oSubmenu.hide();
    
            }
    
        }
    
    };
    
    
/**
* @class Creates a list of options which vary depending on the context in 
* which the menu is invoked.
* @constructor
* @extends YAHOO.widget.Menu
* @base YAHOO.widget.Menu
* @param {String or HTMLElement} p_oElement String id or HTMLElement 
* (either HTMLSelectElement or HTMLDivElement) of the source HTMLElement node.
* @param {Object} p_oUserConfig Optional. The configuration object literal 
* containing the configuration for a ContextMenu instance. See 
* configuration class documentation for more details.
*/
YAHOO.widget.ContextMenu = function(p_oElement, p_oUserConfig) {

    if(arguments.length > 0) {

        YAHOO.widget.ContextMenu.superclass.constructor.call(
                this, 
                p_oElement,
                p_oUserConfig
            );

    }

};

YAHOO.widget.ContextMenu.prototype = new YAHOO.widget.Menu();
YAHOO.widget.ContextMenu.prototype.constructor = YAHOO.widget.ContextMenu;
YAHOO.widget.ContextMenu.superclass = YAHOO.widget.Menu.prototype;


/**
* The ContextMenu class's initialization method. This method is automatically  
* called by the constructor, and sets up all DOM references for pre-existing 
* markup, and creates required markup if it is not already present.
* @param {String or HTMLElement} p_oElement String id or HTMLElement 
* (either HTMLSelectElement or HTMLDivElement) of the source HTMLElement node.
* @param {Object} p_oUserConfig Optional. The configuration object literal 
* containing the configuration for a ContextMenu instance. See 
* configuration class documentation for more details.
*/
YAHOO.widget.ContextMenu.prototype.init = function(p_oElement, p_oUserConfig) {

    if(!this.ITEM_TYPE) {

        this.ITEM_TYPE = YAHOO.widget.ContextMenuItem;

    }


    // Call the init of the superclass (YAHOO.widget.Menu)

    YAHOO.widget.ContextMenu.superclass.init.call(this, p_oElement);


    this.beforeInitEvent.fire(YAHOO.widget.ContextMenu);


    if(p_oUserConfig) {

        this.cfg.applyConfig(p_oUserConfig, true);

    }
    
    
    this.initEvent.fire(YAHOO.widget.ContextMenu);


};


// Private event handlers

/**
* "mousedown" event handler for the document object.
* @private
* @param {Event} p_oEvent Event object passed back by the 
* event utility (YAHOO.util.Event).
* @param {YAHOO.widget.ContextMenu} p_oMenu The ContextMenu instance 
* handling the event.
*/
YAHOO.widget.ContextMenu.prototype._onDocumentMouseDown = 

    function(p_oEvent, p_oMenu) {
    
        var oTarget = this._oEventUtil.getTarget(p_oEvent, true);
    
        if(
            oTarget != this._oTargetElement || 
            !this._oDom.isAncestor(this._oTargetElement, oTarget)
        ) {
    
            this.hide();    
        
        }
    
    };


/**
* "click" event handler for the HTMLElement node that triggered the event. 
* Used to cancel default behaviors in Opera.
* @private
* @param {Event} p_oEvent Event object passed back by the 
* event utility (YAHOO.util.Event).
* @param {YAHOO.widget.ContextMenu} p_oMenu The ContextMenu instance 
* handling the event.
*/
YAHOO.widget.ContextMenu.prototype._onTriggerClick = 

    function(p_oEvent, p_oMenu) {

        if(p_oEvent.ctrlKey) {
        
            this._oEventUtil.stopEvent(p_oEvent);
    
        }
        
    };


/**
* "contextmenu" event handler ("mousedown" for Opera) for the HTMLElement 
* node that triggered the event.
* @private
* @param {Event} p_oEvent Event object passed back by the 
* event utility (YAHOO.util.Event).
* @param {YAHOO.widget.ContextMenu} p_oMenu The ContextMenu instance 
* handling the event.
*/
YAHOO.widget.ContextMenu.prototype._onTriggerContextMenu = 

    function(p_oEvent, p_oMenu) {
    
        if(p_oEvent.type == "mousedown") {
        
            if(!p_oEvent.ctrlKey) {
    
                return;
            
            }
        
            this._oEventUtil.stopEvent(p_oEvent);
    
        }
    
    
        this.contextEventTarget = this._oEventUtil.getTarget(p_oEvent, true);
    
    
        // Position and display the context menu
    
        var nX = this._oEventUtil.getPageX(p_oEvent),
            nY = this._oEventUtil.getPageY(p_oEvent);
    
    
        this.cfg.applyConfig( { x:nX, y:nY, visible:true } );
        this.cfg.fireQueue();
    
    
        // Prevent the browser's default context menu from appearing
    
        this._oEventUtil.preventDefault(p_oEvent);
    
    };


// Public properties

/**
* Returns the HTMLElement node that was the target of the "contextmenu" 
* DOM event.
* @type HTMLElement
*/
YAHOO.widget.ContextMenu.prototype.contextEventTarget = null;


// Public methods

/**
* Initializes the class's configurable properties which can be changed using 
* a ContextMenu instance's Config object (cfg).
*/
YAHOO.widget.ContextMenu.prototype.initDefaultConfig = function() {

    YAHOO.widget.ContextMenu.superclass.initDefaultConfig.call(this);


	// Add a configuration property

    this.cfg.addProperty("trigger", { handler: this.configTrigger });

};


// Event handlers for configuration properties

/**
* Event handler for when the "trigger" configuration property of
* a MenuItem instance. 
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the 
* event was fired.
* @param {YAHOO.widget.ContextMenu} p_oMenu The ContextMenu that instance fired
* the event.
*/
YAHOO.widget.ContextMenu.prototype.configTrigger = 

    function(p_sType, p_aArguments, p_oMenu) {
    
        var oTrigger = p_aArguments[0];
    
        if(oTrigger) {
    
            /*
                Listen for the "mousedown" event in Opera b/c it does not 
                support the "contextmenu" event
            */ 
      
            var bOpera = (this.browser == "opera");
    
            var sContextEvent = bOpera ? "mousedown" : "contextmenu";
    
            this._oEventUtil.addListener(
                oTrigger, 
                sContextEvent, 
                this._onTriggerContextMenu,
                this,
                true
            );
    
    
            /*
                Assign a "click" event handler to the trigger element(s) for
                Opera to prevent default browser behaviors.
            */
    
            if(bOpera) {
            
                this._oEventUtil.addListener(
                    oTrigger, 
                    "click", 
                    this._onTriggerClick,
                    this,
                    true
                );
    
            }
    
    
            // Assign a "mousedown" event handler to the document
        
            this._oEventUtil.addListener(
                document, 
                "mousedown", 
                this._onDocumentMouseDown,
                this,
                true
            );        
    
        }
        
    };


/**
* @class Creates an item for a context menu instance.
* @constructor
* @extends YAHOO.widget.MenuItem
* @base YAHOO.widget.MenuItem
* @param {String or HTMLElement} p_oObject String or HTMLElement 
* (either HTMLLIElement, HTMLOptGroupElement or HTMLOptionElement) of the 
* source HTMLElement node.
* @param {Object} p_oUserConfig The configuration object literal containing 
* the configuration for a ContextMenuItem instance. See the configuration 
* class documentation for more details.
*/
YAHOO.widget.ContextMenuItem = function(p_oObject, p_oUserConfig) {

    if(p_oObject) {

        YAHOO.widget.ContextMenuItem.superclass.constructor.call(
            this, 
            p_oObject, 
            p_oUserConfig
        );

    }

};

YAHOO.widget.ContextMenuItem.prototype = new YAHOO.widget.MenuItem();

YAHOO.widget.ContextMenuItem.prototype.constructor = 

    YAHOO.widget.ContextMenuItem;

YAHOO.widget.ContextMenuItem.superclass = YAHOO.widget.MenuItem.prototype;


/**
* The ContextMenuItem class's initialization method. This method is
* automatically called by the constructor, and sets up all DOM references for
* pre-existing markup, and creates required markup if it is not
* already present.
* @param {String or HTMLElement} p_oObject String or HTMLElement 
* (either HTMLLIElement, HTMLOptGroupElement or HTMLOptionElement) of the 
* source HTMLElement node.
* @param {Object} p_oUserConfig The configuration object literal containing 
* the configuration for a ContextMenuItem instance. See the configuration 
* class documentation for more details.
*/
YAHOO.widget.ContextMenuItem.prototype.init = 

    function(p_oObject, p_oUserConfig) {
    
        if(!this.SUBMENU_TYPE) {
    
            this.SUBMENU_TYPE = YAHOO.widget.ContextMenu;
    
        }
    
        if(!this.SUBMENU_ITEM_TYPE) {
    
            this.SUBMENU_ITEM_TYPE = YAHOO.widget.ContextMenuItem;
    
        }
    
    
        /* 
            Call the init of the superclass (YAHOO.widget.MenuItem)
            Note: We don't pass the user config in here yet 
            because we only want it executed once, at the lowest 
            subclass level.
        */ 
    
        YAHOO.widget.ContextMenuItem.superclass.init.call(this, p_oObject);
    
    
        if(p_oUserConfig) {
    
            this.cfg.applyConfig(p_oUserConfig, true);
    
        }
    
    
        this.cfg.fireQueue();
    
    };
    

/**
* @class Horizontal collection of items, each of which can contain a submenu.
* Extends YAHOO.widget.MenuModule to provide a set of default mouse and 
* key event behaviors.
* @constructor
* @extends YAHOO.widget.MenuModule
* @base YAHOO.widget.MenuModule
* @param {String or HTMLElement} p_oElement String id or HTMLElement 
* (either HTMLSelectElement or HTMLDivElement) of the source HTMLElement node.
* @param {Object} p_oUserConfig Optional. The configuration object literal 
* containing the configuration for a MenuBar instance. See 
* configuration class documentation for more details.
*/
YAHOO.widget.MenuBar = function(p_oElement, p_oUserConfig) {

    if(arguments.length > 0) {

        YAHOO.widget.MenuBar.superclass.constructor.call(
                this, 
                p_oElement,
                p_oUserConfig
            );

    }

};

YAHOO.widget.MenuBar.prototype = new YAHOO.widget.MenuModule();
YAHOO.widget.MenuBar.prototype.constructor = YAHOO.widget.MenuBar;
YAHOO.widget.MenuBar.superclass = YAHOO.widget.MenuModule.prototype;


/**
* The MenuBar class's initialization method. This method is automatically 
* called by the constructor, and sets up all DOM references for pre-existing 
* markup, and creates required markup if it is not already present.
* @param {String or HTMLElement} p_oElement String id or HTMLElement 
* (either HTMLSelectElement or HTMLDivElement) of the source HTMLElement node.
* @param {Object} p_oUserConfig Optional. The configuration object literal 
* containing the configuration for a MenuBar instance. See 
* configuration class documentation for more details.
*/
YAHOO.widget.MenuBar.prototype.init = function(p_oElement, p_oUserConfig) {

    if(!this.ITEM_TYPE) {

        this.ITEM_TYPE = YAHOO.widget.MenuBarItem;

    }


    // Call the init of the superclass (YAHOO.widget.MenuModule)

    YAHOO.widget.MenuBar.superclass.init.call(this, p_oElement);


    this.beforeInitEvent.fire(YAHOO.widget.MenuBar);


    /*
        Set the default value for the "position" configuration property
        to "static" 
    */
    if(!p_oUserConfig || (p_oUserConfig && !p_oUserConfig.position)) {

        this.cfg.queueProperty("position", "static");

    }

    /*
        Set the default value for the "submenualignment" configuration property
        to "tl" and "bl" 
    */
    if(!p_oUserConfig || (p_oUserConfig && !p_oUserConfig.submenualignment)) {

        this.cfg.queueProperty("submenualignment", ["tl","bl"]);

    }


    if(p_oUserConfig) {

        this.cfg.applyConfig(p_oUserConfig, true);

    }
    
    this.initEvent.fire(YAHOO.widget.MenuBar);

};


// Constants

/**
* Constant representing the CSS class(es) to be applied to the root 
* HTMLDivElement of the MenuBar instance.
* @final
* @type String
*/
YAHOO.widget.MenuBar.prototype.CSS_CLASS_NAME = "yuimenubar"; 


/**
* @class The MenuBarItem class allows you to create and modify an item for a
* MenuBar instance.  MenuBarItem extends YAHOO.widget.MenuModuleItem to provide 
* a set of default mouse and key event behaviors.
* @constructor
* @extends YAHOO.widget.MenuModuleItem
* @base YAHOO.widget.MenuModuleItem
* @param {String or HTMLElement} p_oObject String or HTMLElement 
* (either HTMLLIElement, HTMLOptGroupElement or HTMLOptionElement) of the 
* source HTMLElement node.
* @param {Object} p_oUserConfig The configuration object literal containing 
* the configuration for a MenuBarItem instance. See the configuration 
* class documentation for more details.
*/
YAHOO.widget.MenuBarItem = function(p_oObject, p_oUserConfig) {

    if(p_oObject) {

        YAHOO.widget.MenuBarItem.superclass.constructor.call(
            this, 
            p_oObject, 
            p_oUserConfig
        );

    }

};

YAHOO.widget.MenuBarItem.prototype = new YAHOO.widget.MenuModuleItem();
YAHOO.widget.MenuBarItem.prototype.constructor = YAHOO.widget.MenuBarItem;
YAHOO.widget.MenuBarItem.superclass = YAHOO.widget.MenuModuleItem.prototype;


/**
* The MenuBarItem class's initialization method. This method is automatically
* called by the constructor, and sets up all DOM references for
* pre-existing markup, and creates required markup if it is not
* already present.
* @param {String or HTMLElement} p_oObject String or HTMLElement 
* (either HTMLLIElement, HTMLOptGroupElement or HTMLOptionElement) of the 
* source HTMLElement node.
* @param {Object} p_oUserConfig The configuration object literal containing 
* the configuration for a MenuBarItem instance. See the configuration 
* class documentation for more details.
*/
YAHOO.widget.MenuBarItem.prototype.init = function(p_oObject, p_oUserConfig) {

    if(!this.SUBMENU_TYPE) {

        this.SUBMENU_TYPE = YAHOO.widget.Menu;

    }

    if(!this.SUBMENU_ITEM_TYPE) {

        this.SUBMENU_ITEM_TYPE = YAHOO.widget.MenuItem;

    }


    /* 
        Call the init of the superclass (YAHOO.widget.MenuModuleItem)
        Note: We don't pass the user config in here yet 
        because we only want it executed once, at the lowest 
        subclass level.
    */ 

    YAHOO.widget.MenuBarItem.superclass.init.call(this, p_oObject);  


    // Add event handlers to each "MenuBarItem" instance

    this.keyDownEvent.subscribe(this._onKeyDown, this, true);


    if(p_oUserConfig) {

        this.cfg.applyConfig(p_oUserConfig, true);

    }

    this.cfg.fireQueue();

};


// Constants

/**
* Constant representing the CSS class(es) to be applied to the root 
* HTMLLIElement of the MenuBarItem.
* @final
* @type String
*/
YAHOO.widget.MenuBarItem.prototype.CSS_CLASS_NAME = "yuimenubaritem";


/**
* Constant representing the path to the image to be used for the submenu
* arrow indicator.
* @final
* @type String
*/
YAHOO.widget.MenuBarItem.prototype.SUBMENU_INDICATOR_IMAGE_PATH =
    "nt/ic/ut/bsc/menuarodwn9_nrm_1.gif";


/**
* Constant representing the path to the image to be used for the submenu
* arrow indicator when a MenuBarItem instance has focus.
* @final
* @type String
*/
YAHOO.widget.MenuBarItem.prototype.SELECTED_SUBMENU_INDICATOR_IMAGE_PATH =
    "nt/ic/ut/bsc/menuarodwn9_clk_1.gif";


/**
* Constant representing the path to the image to be used for the submenu
* arrow indicator when a MenuBarItem instance is disabled.
* @final
* @type String
*/
YAHOO.widget.MenuBarItem.prototype.DISABLED_SUBMENU_INDICATOR_IMAGE_PATH = 
    "nt/ic/ut/bsc/menuarodwn9_dim_1.gif";


// Private event handlers

/**
* "keydown" Custom Event handler for a MenuBarItem instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance that 
* fired the event.
*/
YAHOO.widget.MenuBarItem.prototype._onKeyDown =

    function(p_sType, p_aArguments, p_oMenuItem) {

        var oEvent = p_aArguments[0];
    
        switch(oEvent.keyCode) {
    
            case 37:    // Left arrow
            case 39:    // Right arrow
    
                var oActiveItem = this.parent.activeItem;
    
                if(this == oActiveItem && !this.cfg.getProperty("selected")) {
    
                    this.cfg.setProperty("selected", true);
    
                }
                else {
    
                    var oNextItem = (oEvent.keyCode == 37) ? 
                            this.getPreviousEnabledSibling() : 
                            this.getNextEnabledSibling();
            
                    if(oNextItem) {

                        this.parent.clearActiveItem();

                        oNextItem.cfg.setProperty("selected", true);
            
                        oNextItem.focus();
    
                    }
    
                }

                YAHOO.util.Event.preventDefault(oEvent);
    
            break;
    
            case 40:    // Down arrow

                this.parent.clearActiveItem();
                        
                this.cfg.setProperty("selected", true);
                
                this.focus();

                var oSubmenu = this.cfg.getProperty("submenu");
    
                if(oSubmenu) {
        
                    oSubmenu.show();
                    oSubmenu.setInitialSelection();
    
                }

                YAHOO.util.Event.preventDefault(oEvent);
    
            break;
    
        }
    
    };