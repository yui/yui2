(function() {

/**
* Reference to the DOM utility
* @private
* @type YAHOO.util.Dom
*/
var Dom = YAHOO.util.Dom;


/**
* Reference to the Event utility
* @private
* @type YAHOO.util.Event
*/
var Event = YAHOO.util.Event;


/**
* @class Manages a collection of all menus and menu items.  Listens for DOM
* events at the document level and dispatches the events to the corresponding
* menu or menu item.
* @constructor
* @private
*/
var MenuManager = new function() {

    /**
    * Flag indicating if the DOM event handlers have been attached
    * @private
    * @type Boolean
    */
    var m_bInitializedEventHandlers = true;


    /**
    * Private global collection of menus
    * @private
    * @type Object
    */
    var m_oMenus = {};
    
    
    /**
    * Private global collection of menu items 
    * @private
    * @type Object
    */
    var m_oItems = {};


    /**
    * Finds the root DIV node of a menu or the root LI node of a menu item
    * @private
    * @param {HTMLElement} p_oElement An HTML element
    */
    var getMenuRootElement = function(p_oElement) {
    
        var oParentNode;

        if(p_oElement && p_oElement.tagName) {
        
            switch(p_oElement.tagName.toUpperCase()) {
                    
                case "DIV":
    
                    oParentNode = p_oElement.parentNode;
    
                    // Check if the DIV is the inner "body" node of a menu
                    if(
                        Dom.hasClass(p_oElement, "bd") && 
                        oParentNode && 
                        oParentNode.tagName && 
                        oParentNode.tagName.toUpperCase() == "DIV"
                    ) {
                    
                        return oParentNode;
                    
                    }
                    else {
                    
                        return p_oElement;
                    
                    }
                
                break;

                case "LI":
    
                    return p_oElement;

                default:
    
                    oParentNode = p_oElement.parentNode;
    
                    if(oParentNode) {
                    
                        return getMenuRootElement(oParentNode);
                    
                    }
                
                break;
            
            }

        }
        
    };


    /**
    * Generic, global event handler for all of a menu's DOM-based events.  This 
    * listens for events against the document object.  If the target of a given 
    * event is a member of a menu or menu item's DOM, the instance's 
    * corresponding Custom Event is fired.
    * @private
    * @param {Event} p_oEvent Event object passed back by the event 
    * utility (YAHOO.util.Event).
    */
    var onDOMEvent = function(p_oEvent) {

        // Get the target node of the DOM event
    
        var oTarget = Event.getTarget(p_oEvent);


        // See if the target of the event was a menu, or a menu item

        var oElement = getMenuRootElement(oTarget);
    
        var oMenuItem;
        var oMenu; 


        if(oElement) {

            var sTagName = oElement.tagName.toUpperCase();
    
            if(sTagName == "LI") {
        
                var sYUIId = oElement.getAttribute("yuiid");
        
                if(sYUIId) {
        
                    oMenuItem = m_oItems[sYUIId];
                    oMenu = oMenuItem.parent;
        
                }
            
            }
            else if(sTagName == "DIV") {
            
                if(oElement.id) {
                
                    oMenu = m_oMenus[oElement.id];
                
                }
            
            }

        }

        if(oMenu) {

            // Map of DOM event names to CustomEvent names
        
            var oEventTypes =  {
                    "click": "clickEvent",
                    "mousedown": "mouseDownEvent",
                    "mouseup": "mouseUpEvent",
                    "mouseover": "mouseOverEvent",
                    "mouseout": "mouseOutEvent",
                    "keydown": "keyDownEvent",
                    "keyup": "keyUpEvent",
                    "keypress": "keyPressEvent"
                };
    
            var sCustomEventType = oEventTypes[p_oEvent.type];


            // Fire the Custom Even that corresponds the current DOM event    
    
            if(oMenuItem && !oMenuItem.cfg.getProperty("disabled")) {
            
                oMenuItem[sCustomEventType].fire(p_oEvent);                   
            
            }
    
            oMenu[sCustomEventType].fire(p_oEvent, oMenuItem);
        
        }
        else if(p_oEvent.type == "mousedown") {

            /*
                 If the target of the event wasn't a menu, hide all 
                 dynamically positioned menus
            */
            
            var oActiveItem;
    
            for(var i in m_oMenus) {
    
                if(m_oMenus.hasOwnProperty(i)) {
    
                    oMenu = m_oMenus[i];
    
                    if(
                        oMenu.cfg.getProperty("clicktohide") && 
                        oMenu.cfg.getProperty("position") == "dynamic"
                    ) {
    
                        oMenu.hide();
    
                    }
                    else {

                        oMenu.clearActiveItem(true);
    
                    }
    
                }
    
            } 
            
        }

    };


    /**
    * Assigns event handlers to the document object
    */
    this.initEventHandlers = function() {

        if(m_bInitializedEventHandlers) {

            var oDoc = document;
    
            Event.addListener(oDoc, "mouseover", onDOMEvent);
            Event.addListener(oDoc, "mouseout", onDOMEvent);
            Event.addListener(oDoc, "mousedown", onDOMEvent);
            Event.addListener(oDoc, "mouseup", onDOMEvent);
            Event.addListener(oDoc, "click", onDOMEvent);
            Event.addListener(oDoc, "keydown", onDOMEvent);
            Event.addListener(oDoc, "keyup", onDOMEvent);
            Event.addListener(oDoc, "keypress", onDOMEvent);

            m_bInitializedEventHandlers = false;

        }
    
    };


    /**
    * Adds a menu to the collection of known menus
    * @public
    * @param {YAHOO.widget.MenuModule} p_oMenu MenuModule instance   
    */
    this.addMenu = function(p_oMenu) {

        m_oMenus[p_oMenu.id] = p_oMenu;
    
    };


    /**
    * Removes a menu from the collection of known menus
    * @public
    * @param {YAHOO.widget.MenuModule} p_oMenu MenuModule instance   
    */
    this.removeMenu = function(p_oMenu) {

        delete m_oMenus[p_oMenu.id];
    
    };


    /**
    * Adds an item to the collection of known menu item
    * @public
    * @param {YAHOO.widget.MenuModuleItem} p_oItem MenuModuleItem instance   
    */
    this.addItem = function(p_oItem) {
    
        var sYUIId = Dom.generateId();

        p_oItem.element.setAttribute("yuiid", sYUIId);

        m_oItems[sYUIId] = p_oItem;            
    
    };


    /**
    * Removes an item from the collection of known menu item
    * @public
    * @param {YAHOO.widget.MenuModuleItem} p_oItem MenuModuleItem instance   
    */
    this.removeItem = function(p_oItem) {
    
        var sYUIId = p_oItem.element.getAttribute("yuiid");

        if(sYUIId) {

            delete m_oItems[sYUIId];

        }
    
    };

};


/**
* @class The superclass of all menu containers.
* @constructor
* @extends YAHOO.widget.Overlay
* @base YAHOO.widget.Overlay
* @param {String} p_oElement The HTMLElement ID representing the source node 
* (either HTMLSelectElement or HTMLDivElement) of the MenuModule <em>OR</em>
* @param {Element} p_oElement The HTMLElement representing the MenuModule to 
* be created
* @param {Object} p_oConfig Optional. The configuration object literal 
* containing the configuration for a MenuModule instance. See 
* configuration class documentation for more details.
*/
YAHOO.widget.MenuModule = function(p_oElement, p_oConfig) {

    YAHOO.widget.MenuModule.superclass.constructor.call(
        this, 
        p_oElement, 
        p_oConfig
    );

};

YAHOO.extend(YAHOO.widget.MenuModule, YAHOO.widget.Overlay);


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
* Identifier used to cancel the hiding of a MenuModule
* @private
* @type Number
*/
YAHOO.widget.MenuModule.prototype._nHideDelayId = null;


/** 
* Identifier used to cancel the showing of a MenuModule
* @private
* @type Number
*/
YAHOO.widget.MenuModule.prototype._nShowDelayId = null;


/** 
* Determines if the "mouseover" and "mouseout" event handlers used for 
* hiding a menu via a call to "window.setTimeout" have already been assigned 
* to the MenuModule instance
* @private
* @type Boolean
*/
YAHOO.widget.MenuModule.prototype._hideDelayEventHandlersAssigned = false;


/**
* The current state of a MenuModule instance's "mouseover" event
* @private
* @type Boolean
*/
YAHOO.widget.MenuModule.prototype._bHandledMouseOverEvent = false;


/**
* The current state of a MenuModule instance's "mouseout" event
* @private
* @type Boolean
*/
YAHOO.widget.MenuModule.prototype._bHandledMouseOutEvent = false;


/**
* Array of HTMLElements used to title groups of items.
* @private
* @type Array
*/
YAHOO.widget.MenuModule.prototype._aGroupTitleElements = null;


/**
* Multi-dimensional array of items.
* @private
* @type Array
*/
YAHOO.widget.MenuModule.prototype._aItemGroups = null;


/**
* An array of HTMLUListElements, each of which is the parent node of each 
* items's HTMLLIElement node.
* @private
* @type Array
*/
YAHOO.widget.MenuModule.prototype._aListElements = null;



// Public properties

/**
* Reference to the item that has focus.
* @private
* @type YAHOO.widget.MenuModuleItem
*/
YAHOO.widget.MenuModule.prototype.activeItem = null;


/**
* Returns a MenuModule instance's parent object.
* @type YAHOO.widget.MenuModuleItem
*/
YAHOO.widget.MenuModule.prototype.parent = null;


/**
* Returns the HTMLElement (either HTMLSelectElement or HTMLDivElement)
* used create the MenuModule instance.
* @type HTMLSelectElement/HTMLDivElement
*/
YAHOO.widget.MenuModule.prototype.srcElement = null;



// Events

/**
* Fires when the mouse has entered a MenuModule instance.  Passes back the 
* DOM Event object as an argument.
* @type YAHOO.util.CustomEvent
*/
YAHOO.widget.MenuModule.prototype.mouseOverEvent = null;


/**
* Fires when the mouse has left a MenuModule instance.  Passes back the DOM 
* Event object as an argument.
* @type YAHOO.util.CustomEvent
*/
YAHOO.widget.MenuModule.prototype.mouseOutEvent = null;


/**
* Fires when the user mouses down on a MenuModule instance.  Passes back the 
* DOM Event object as an argument.
* @type YAHOO.util.CustomEvent
*/
YAHOO.widget.MenuModule.prototype.mouseDownEvent = null;


/**
* Fires when the user releases a mouse button while the mouse is over 
* a MenuModule instance.  Passes back the DOM Event object as an argument.
* @type YAHOO.util.CustomEvent
*/
YAHOO.widget.MenuModule.prototype.mouseUpEvent = null;


/**
* Fires when the user clicks the on a MenuModule instance.  Passes back the 
* DOM Event object as an argument.
* @type YAHOO.util.CustomEvent
*/
YAHOO.widget.MenuModule.prototype.clickEvent = null;


/**
* Fires when the user presses an alphanumeric key.  Passes back the 
* DOM Event object as an argument.
* @type YAHOO.util.CustomEvent
*/
YAHOO.widget.MenuModule.prototype.keyPressEvent = null;


/**
* Fires when the user presses a key.  Passes back the DOM Event 
* object as an argument.
* @type YAHOO.util.CustomEvent
*/
YAHOO.widget.MenuModule.prototype.keyDownEvent = null;


/**
* Fires when the user releases a key.  Passes back the DOM Event 
* object as an argument.
* @type YAHOO.util.CustomEvent
*/
YAHOO.widget.MenuModule.prototype.keyUpEvent = null;


/**
* The MenuModule class's initialization method. This method is automatically 
* called  by the constructor, and sets up all DOM references for 
* pre-existing markup, and creates required markup if it is not already present.
* @param {String} p_oElement The HTMLElement ID representing the source node 
* (either HTMLSelectElement or HTMLDivElement) of the MenuModule <em>OR</em>
* @param {Element} p_oElement The HTMLElement representing the MenuModule to 
* be created
* @param {Object} p_oConfig Optional. The configuration object literal 
* containing the configuration for a MenuModule instance. See 
* configuration class documentation for more details.
*/
YAHOO.widget.MenuModule.prototype.init = function(p_oElement, p_oConfig) {

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


    if(oElement && oElement.tagName) {

        switch(oElement.tagName.toUpperCase()) {
    
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

                var oNode = this.body.firstChild;
                var i = 0;

                do {

                    if(oNode && oNode.tagName) {

                        switch(oNode.tagName.toUpperCase()) {
    
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

                }
                while((oNode = oNode.nextSibling));


                /*
                    Apply the "first-of-type" class to the first UL to mimic 
                    the "first-of-type" CSS3 psuedo class.
                */

                if(this._aListElements[0]) {

                    Dom.addClass(this._aListElements[0], "first-of-type");

                }

                this.logger = new YAHOO.widget.LogWriter(this.toString());

                this.logger.log("Source element: " + this.srcElement.tagName);
    
            break;
    
            case "SELECT":
    
                this.srcElement = oElement;
    
    
                /*
                    The source element is not something that we can use 
                    outright, so we need to create a new Overlay
                */
    
                var sId = Dom.generateId();

                /* 
                    Note: we don't pass the user config in here yet 
                    because we only want it executed once, at the lowest 
                    subclass level.
                */ 
            
                YAHOO.widget.MenuModule.superclass.init.call(this, sId); 

                this.beforeInitEvent.fire(YAHOO.widget.MenuModule);

                this.logger = new YAHOO.widget.LogWriter(this.toString());

                this.logger.log("Source element: " + this.srcElement.tagName);

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

        this.logger = new YAHOO.widget.LogWriter(this.toString());

        this.logger.log("No source element found.  " +
            "Created element with id: " + this.id);

    }


    if(this.element) {

        var oEl = this.element;
        var CustomEvent = YAHOO.util.CustomEvent;

        Dom.addClass(oEl, this.CSS_CLASS_NAME);

        // Assign DOM event handlers

        MenuManager.initEventHandlers();


        // Create custom events

        this.mouseOverEvent = new CustomEvent("mouseOverEvent", this);
        this.mouseOutEvent = new CustomEvent("mouseOutEvent", this);
        this.mouseDownEvent = new CustomEvent("mouseDownEvent", this);
        this.mouseUpEvent = new CustomEvent("mouseUpEvent", this);
        this.clickEvent = new CustomEvent("clickEvent", this);
        this.keyPressEvent = new CustomEvent("keyPressEvent", this);
        this.keyDownEvent = new CustomEvent("keyDownEvent", this);
        this.keyUpEvent = new CustomEvent("keyUpEvent", this);


        // Subscribe to Custom Events

        this.initEvent.subscribe(this._onMenuModuleInit, this, true);

        this.beforeRenderEvent.subscribe(
                this._onMenuModuleBeforeRender, 
                this, 
                true
            );

        this.renderEvent.subscribe(this._onMenuModuleRender, this, true);
        this.showEvent.subscribe(this.setInitialFocus, this, true);

        this.beforeHideEvent.subscribe(
                this._onMenuModuleBeforeHide, 
                this, 
                true
            );

        this.mouseOverEvent.subscribe(this._onMenuModuleMouseOver, this, true);
        this.mouseOutEvent.subscribe(this._onMenuModuleMouseOut, this, true);
        this.clickEvent.subscribe(this._onMenuModuleClick, this, true);
        this.keyDownEvent.subscribe(this._onMenuModuleKeyDown, this, true);

        if(p_oConfig) {
    
            this.cfg.applyConfig(p_oConfig, true);
    
        }


        this.cfg.queueProperty("visible", false);


        if(this.srcElement) {

            this._initSubTree();

        }

        MenuManager.addMenu(this);

    }


    this.initEvent.fire(YAHOO.widget.MenuModule);

};


// Private methods

/**
* Iterates the source element's childNodes collection and uses the child 
* nodes to instantiate MenuModule and MenuModuleItem instances.
* @private
*/
YAHOO.widget.MenuModule.prototype._initSubTree = function() {

    var oNode;

    this.logger.log("Searching DOM for items to initialize.");

    if(this.srcElement.tagName) {
    
        switch(this.srcElement.tagName.toUpperCase()) {
    
            case "DIV":
    
                if(this._aListElements.length > 0) {
    
                    this.logger.log("Found " + 
                        this._aListElements.length + 
                        " item groups to initialize.");
    
                    var i = this._aListElements.length - 1;
    
                    do {
    
                        oNode = this._aListElements[i].firstChild;
        
                        this.logger.log("Scanning " + 
                            this._aListElements[i].childNodes.length + 
                            " child nodes for items to initialize.");
    
                        do {
        
                            if(oNode && oNode.tagName) {
                            
                                switch(oNode.tagName.toUpperCase()) {
                
                                    case "LI":
        
                                        this.logger.log("Initializing " + 
                                            oNode.tagName + " node.");
        
                                        this.addItem(
                                                new this.ITEM_TYPE(oNode), 
                                                i
                                            );
                
                                    break;
                
                                }
    
                            }
                
                        }
                        while((oNode = oNode.nextSibling));
                
                    }
                    while(i--);
    
                }
    
            break;
    
            case "SELECT":
    
                this.logger.log("Scanning " +  
                    this.srcElement.childNodes.length + 
                    " child nodes for items to initialize.");
    
                oNode = this.srcElement.firstChild;
    
                do {
    
                    if(oNode && oNode.tagName) {
                    
                        switch(oNode.tagName.toUpperCase()) {
        
                            case "OPTGROUP":
                            case "OPTION":
        
                                this.logger.log("Initializing " +  
                                    oNode.tagName + " node.");
        
                                this.addItem(new this.ITEM_TYPE(oNode));
        
                            break;
        
                        }

                    }
    
                }
                while((oNode = oNode.nextSibling));
    
            break;
    
        }

    }

};


/**
* Returns the first enabled item in a menu instance.
* @return Returns a MenuModuleItem instance.
* @type YAHOO.widget.MenuModuleItem
* @private
*/
YAHOO.widget.MenuModule.prototype._getFirstEnabledItem = function() {

    var nGroups = this._aItemGroups.length;
    var oItem;
    var aItemGroup;

    for(var i=0; i<nGroups; i++) {

        aItemGroup = this._aItemGroups[i];
        
        if(aItemGroup) {

            var nItems = aItemGroup.length;
            
            for(var n=0; n<nItems; n++) {
            
                oItem = aItemGroup[n];
                
                if(
                    !oItem.cfg.getProperty("disabled") && 
                    oItem.element.style.display != "none"
                ) {
                
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

        var oItem;

        if(p_oItem instanceof this.ITEM_TYPE) {

            oItem = p_oItem;     

        }
        else if(typeof p_oItem == "string") {

            oItem = new this.ITEM_TYPE(p_oItem);
        
        }


        if(oItem) {

            MenuManager.addItem(oItem);

            var nGroupIndex = typeof p_nGroupIndex == "number" ? 
                    p_nGroupIndex : 0;
            
            var aGroup = this._getItemGroup(nGroupIndex);
            
            var oGroupItem;
    

            if(!aGroup) {
    
                aGroup = this._createItemGroup(nGroupIndex);
    
            }


            if(typeof p_nItemIndex == "number") {
    
                var bAppend = (p_nItemIndex >= aGroup.length);            
    

                if(aGroup[p_nItemIndex]) {
        
                    aGroup.splice(p_nItemIndex, 0, oItem);
        
                }
                else {
        
                    aGroup[p_nItemIndex] = oItem;
        
                }
    
    
                oGroupItem = aGroup[p_nItemIndex];
    
                if(oGroupItem) {
    
                    if(
                        bAppend && 
                        (
                            !oGroupItem.element.parentNode || 
                            oGroupItem.element.parentNode.nodeType == 11
                        )
                    ) {
            
                        this._aListElements[nGroupIndex].appendChild(
                            oGroupItem.element
                        );
        
                    }
                    else {
      
        
                        /**
                        * Returns the next sibling of an item in an array 
                        * @private
                        * @param {p_aArray} An array
                        * @param {p_nStartIndex} The index to start searching
                        * the array 
                        * @return Returns an item in an array
                        * @type Object 
                        */
                        var getNextItemSibling = 
                        
                            function(p_aArray, p_nStartIndex) {
                    
                                return (
                                        p_aArray[p_nStartIndex] || 
                                        getNextItemSibling(
                                            p_aArray, 
                                            (p_nStartIndex+1)
                                        )
                                    );
                    
                            };
        
        
                        var oNextItemSibling = 
                                getNextItemSibling(aGroup, (p_nItemIndex+1));
        
                        if(
                            oNextItemSibling && 
                            (
                                !oGroupItem.element.parentNode || 
                                oGroupItem.element.parentNode.nodeType == 11
                            )
                        ) {
                
                            this._aListElements[nGroupIndex].insertBefore(
                                    oGroupItem.element, 
                                    oNextItemSibling.element
                                );
            
                        }
        
                    }
        
    
                    oGroupItem.parent = this;
            
                    this._subscribeToItemEvents(oGroupItem);
        
                    this._configureItemSubmenuModule(oGroupItem);
                    
                    this._updateItemProperties(nGroupIndex);
            
                    this.logger.log("Item inserted." + 
                        " Text: " + oGroupItem.cfg.getProperty("text") + ", " + 
                        " Index: " + oGroupItem.index + ", " + 
                        " Group Index: " + oGroupItem.groupIndex);

                    return oGroupItem;
        
                }
    
            }
            else {
        
                var nItemIndex = aGroup.length;
        
                aGroup[nItemIndex] = oItem;
        
        
                oGroupItem = aGroup[nItemIndex];
        
                if(oGroupItem) {
        
                    if(
                        !Dom.isAncestor(
                            this._aListElements[nGroupIndex], 
                            oGroupItem.element
                        )
                    ) {
        
                        this._aListElements[nGroupIndex].appendChild(
                            oGroupItem.element
                        );
        
                    }
        
                    oGroupItem.element.setAttribute("groupindex", nGroupIndex);
                    oGroupItem.element.setAttribute("index", nItemIndex);
            
                    oGroupItem.parent = this;
        
                    oGroupItem.index = nItemIndex;
                    oGroupItem.groupIndex = nGroupIndex;
            
                    this._subscribeToItemEvents(oGroupItem);
        
                    this._configureItemSubmenuModule(oGroupItem);
        
                    if(nItemIndex === 0) {
            
                        Dom.addClass(oGroupItem.element, "first-of-type");
            
                    }

                    this.logger.log("Item added." + 
                        " Text: " + oGroupItem.cfg.getProperty("text") + ", " + 
                        " Index: " + oGroupItem.index + ", " + 
                        " Group Index: " + oGroupItem.groupIndex);
            
                    return oGroupItem;
        
                }
        
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

        var nGroupIndex = typeof p_nGroupIndex == "number" ? p_nGroupIndex : 0;
        var aGroup = this._getItemGroup(nGroupIndex);
    
        if(aGroup) {
    
            var aArray = aGroup.splice(p_nItemIndex, 1);
            var oItem = aArray[0];
        
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
                         Assign the "first-of-type" class to the new first UL 
                         in the collection
                    */
        
                    oUL = this._aListElements[0];
        
                    if(oUL) {
        
                        Dom.addClass(oUL, "first-of-type");
        
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

            var nItems = aGroup.length;
            var nItemIndex = -1;
        
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

        var aGroup = this._getItemGroup(p_nGroupIndex);
        var nItems = aGroup.length;
    
        if(nItems > 0) {
    
            var i = nItems - 1;
            var oItem;
            var oLI;
    
            // Update the index and className properties of each member        
        
            do {
    
                oItem = aGroup[i];
    
                if(oItem) {
        
                    oLI = oItem.element;
    
                    oItem.index = i;
                    oItem.groupIndex = p_nGroupIndex;
    
                    oLI.setAttribute("groupindex", p_nGroupIndex);
                    oLI.setAttribute("index", i);
    
                    Dom.removeClass(oLI, "first-of-type");
    
                }
        
            }
            while(i--);
    
    
            if(oLI) {
    
                Dom.addClass(oLI, "first-of-type");
    
            }
    
        }
    
    };


/**
* Creates a new item group (array) and its associated HTMLUlElement node 
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
* Subscribe's a MenuModule instance to its parent MenuModule instance's events.
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
                    this._onSubmenuModuleBeforeShow, 
                    oSubmenu, 
                    true
                );
    
            oSubmenu.showEvent.subscribe(
                    this._onSubmenuModuleShow, 
                    oSubmenu, 
                    true
                );
    
            oSubmenu.hideEvent.subscribe(
                    this._onSubmenuModuleHide, 
                    oSubmenu, 
                    true
                );
    
        }

};


/**
* Subscribes a MenuModule instance to the specified item's Custom Events.
* @private
* @param {YAHOO.widget.MenuModuleItem} p_oItem The item to listen for events on.
*/
YAHOO.widget.MenuModule.prototype._subscribeToItemEvents = function(p_oItem) {

    var aArguments = [this, p_oItem];

    p_oItem.focusEvent.subscribe(this._onMenuModuleItemFocus, aArguments);

    p_oItem.blurEvent.subscribe(this._onMenuModuleItemBlur, aArguments);

    p_oItem.cfg.configChangedEvent.subscribe(
        this._onMenuModuleItemConfigChange,
        aArguments
    );

    p_oItem.destroyEvent.subscribe(this._onMenuModuleItemDestroy, aArguments);

};


/**
* Returns the offset width of a MenuModule instance.
* @private
*/
YAHOO.widget.MenuModule.prototype._getOffsetWidth = function() {

    var oClone = this.element.cloneNode(true);

    Dom.setStyle(oClone, "width", "");

    document.body.appendChild(oClone);

    var sWidth = oClone.offsetWidth;

    document.body.removeChild(oClone);

    return sWidth;

};


/**
* Cancels the call to "hideSubmenus"
* @private
*/
YAHOO.widget.MenuModule.prototype._cancelHideDelay = function() {

    var oRoot = this.getRoot();

    if(oRoot._nHideDelayId) {

        window.clearTimeout(oRoot._nHideDelayId);

    }

};


/**
* Hides a MenuModule instance after the number of milliseconds specified 
* by the "hidedelay" configuration property.
* @private
*/
YAHOO.widget.MenuModule.prototype._execHideDelay = function() {

    this._cancelHideDelay();

    var oRoot = this.getRoot();
    var me = this;


    /**
    * Hides submenus of the root MenuModule instance.
    * @private
    */
    var hideSubmenus = function() {
    
        if(oRoot.activeItem) {

            oRoot.clearActiveItem();

        }

        if(oRoot == me && me.cfg.getProperty("position") == "dynamic") {

            me.hide();            
        
        }
    
    };


    oRoot._nHideDelayId = 
        window.setTimeout(hideSubmenus, oRoot.cfg.getProperty("hidedelay"));

};


/**
* Cancels the call to "showMenu"
* @private
*/
YAHOO.widget.MenuModule.prototype._cancelShowDelay = function() {

    var oRoot = this.getRoot();

    if(oRoot._nShowDelayId) {

        window.clearTimeout(oRoot._nShowDelayId);

    }

};


/**
* Shows a MenuModule instance after the number of milliseconds specified 
* by the "showdelay" configuration property.
* @private
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance that 
* should be made visible.
*/
YAHOO.widget.MenuModule.prototype._execShowDelay = function(p_oMenuModule) {

    this._cancelShowDelay();

    var oRoot = this.getRoot();


    /**
    * Shows a MenuModule instance.
    * @private
    */
    var showMenu = function() {

        p_oMenuModule.show();    
    
    };


    oRoot._nShowDelayId = 
        window.setTimeout(showMenu, oRoot.cfg.getProperty("showdelay"));

};


// Private Custom Event handlers

/**
* "init" Custom Event handler for a MenuModule instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance that 
* fired the event.
*/
YAHOO.widget.MenuModule.prototype._onMenuModuleInit = 

    function(p_sType, p_aArgs, p_oMenuModule) {
        
        var sCSSPosition = (this.cfg.getProperty("position") == "static") ? 
                "static" : "absolute";

        Dom.setStyle(this.element, "position", sCSSPosition);

    };


/**
* "beforerender" Custom Event handler for a MenuModule instance.  Appends all 
* of the HTMLUListElement (&#60;UL&#60;s) nodes (and their child 
* HTMLLIElement (&#60;LI&#60;)) nodes and their accompanying title nodes to  
* the body of the MenuModule instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance that 
* fired the event.
*/
YAHOO.widget.MenuModule.prototype._onMenuModuleBeforeRender = 

    function(p_sType, p_aArgs, p_oMenuModule) {

        var oConfig = this.cfg;
        var oEl = this.element;
        var nListElements = this._aListElements.length;
    

        if(oConfig.getProperty("position") == "static") {
    
            oConfig.queueProperty("iframe", false);
            oConfig.queueProperty("visible", true);
            
        }
    
    
        if(nListElements > 0) {
    
            var i = 0;
            var bFirstList = true;
            var oUL;
            var oGroupTitle;
    
    
            do {
    
                oUL = this._aListElements[i];
    
                if(oUL) {
    
                    if(bFirstList) {
            
                        Dom.addClass(oUL, "first-of-type");
                        bFirstList = false;
            
                    }
    
    
                    if(!Dom.isAncestor(oEl, oUL)) {
    
                        this.appendToBody(oUL);
    
                    }
    
    
                    oGroupTitle = this._aGroupTitleElements[i];
    
                    if(oGroupTitle) {
    
                        if(!Dom.isAncestor(oEl, oGroupTitle)) {
    
                            oUL.parentNode.insertBefore(oGroupTitle, oUL);
    
                        }
    
    
                        Dom.addClass(oUL, "hastitle");
    
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
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance that 
* fired the event.
*/
YAHOO.widget.MenuModule.prototype._onMenuModuleRender = 

    function(p_sType, p_aArgs, p_oMenuModule) {

        if(this.cfg.getProperty("position") == "dynamic") {
    
            var sWidth = 
                this.element.parentNode.tagName.toUpperCase() == "BODY" ? 
                this.element.offsetWidth : this._getOffsetWidth();
        
            this.cfg.setProperty("width", (sWidth + "px"));
    
        }

    };


/**
* "beforehide" Custom Event handler for a MenuModule instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance that 
* fired the event.
*/
YAHOO.widget.MenuModule.prototype._onMenuModuleBeforeHide = 

    function(p_sType, p_aArgs, p_oMenuModule) {

        this.clearActiveItem(true);

    };


/**
* "mouseover" Custom Event handler for a MenuModule instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance that 
* fired the event.
*/
YAHOO.widget.MenuModule.prototype._onMenuModuleMouseOver = 

    function(p_sType, p_aArgs, p_oMenuModule) {

        var oEvent = p_aArgs[0];
        var oItem = p_aArgs[1];
        var oTarget = Event.getTarget(oEvent);

        if(
            !this._bHandledMouseOverEvent && 
            (oTarget == this.element || Dom.isAncestor(this.element, oTarget))
        ) {
        
            // MENU  MOUSEOVER LOGIC HERE

            this.clearActiveItem();

            this._bHandledMouseOverEvent = true;
            this._bHandledMouseOutEvent = false;
        
        }


        if(
            oItem && !oItem.handledMouseOverEvent && 
            (oTarget == oItem.element || Dom.isAncestor(oItem.element, oTarget))
        ) {

            var oItemCfg = oItem.cfg;
        
            // Select and focus the current MenuItem instance
        
            oItemCfg.setProperty("selected", true);
            oItem.focus();
    
    
            if(this.cfg.getProperty("autosubmenudisplay")) {
    
                // Show the submenu for this instance

                var oSubmenu = oItemCfg.getProperty("submenu");
            
                if(oSubmenu) {
            
                    if(this.cfg.getProperty("showdelay") > 0) {

                        this._execShowDelay(oSubmenu);
            
                    }
                    else {

                        oSubmenu.show();
    
                    }
            
                }

            }                        

            oItem.handledMouseOverEvent = true;
            oItem.handledMouseOutEvent = false;

        }

    };


/**
* "mouseout" Custom Event handler for a MenuModule instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance that 
* fired the event.
*/
YAHOO.widget.MenuModule.prototype._onMenuModuleMouseOut = 

    function(p_sType, p_aArgs, p_oMenuModule) {
    
        var oEvent = p_aArgs[0];
        var oItem = p_aArgs[1];
        var oRelatedTarget = Event.getRelatedTarget(oEvent);
        var bMovingToSubmenu = false;

        if(oItem) {

            var oItemCfg = oItem.cfg;
            var oSubmenu = oItemCfg.getProperty("submenu");


            if(
                oSubmenu && 
                (
                    oRelatedTarget == oSubmenu.element ||
                    Dom.isAncestor(oSubmenu.element, oRelatedTarget)
                )
            ) {
    
                bMovingToSubmenu = true;
    
            }


            if( 
                !oItem.handledMouseOutEvent && 
                (
                    (
                        oRelatedTarget != oItem.element &&  
                        !Dom.isAncestor(oItem.element, oRelatedTarget)
                    ) || bMovingToSubmenu
                )
            ) {


                if(this.cfg.getProperty("showdelay") > 0) {
                
                    this._cancelShowDelay();
                
                }


                oItemCfg.setProperty("selected", false);
    
                if(this.cfg.getProperty("autosubmenudisplay")) {
                
                    if(oSubmenu) {
                
                        if(
                            !(
                                oRelatedTarget == oSubmenu.element || 
                                YAHOO.util.Dom.isAncestor(
                                    oSubmenu.element, 
                                    oRelatedTarget
                                )
                            )
                        ) {

                            oSubmenu.hide();
                
                        }
                
                    }
                
                }
    
                oItem.handledMouseOutEvent = true;
                oItem.handledMouseOverEvent = false;
        
            }

        }


        if(
            !this._bHandledMouseOutEvent && 
            (
                (
                    oRelatedTarget != this.element &&  
                    !Dom.isAncestor(this.element, oRelatedTarget)
                ) 
                || bMovingToSubmenu
            )
        ) {
            
            this._bHandledMouseOutEvent = true;
            this._bHandledMouseOverEvent = false;
    
        }

    };


/**
* "click" Custom Event handler for a MenuModule instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance that 
* fired the event.
*/
YAHOO.widget.MenuModule.prototype._onMenuModuleClick = 

    function(p_sType, p_aArgs, p_oMenuModule) {

        var oEvent = p_aArgs[0];
        var oItem = p_aArgs[1];
        var oTarget = Event.getTarget(oEvent);

        if(oItem) {

            var oItemCfg = oItem.cfg;
            var oSubmenu = oItemCfg.getProperty("submenu");
    
    
            /*
                ACCESSIBILITY FEATURE FOR SCREEN READERS: 
                Expand/collapse the submenu when the user clicks 
                on the submenu indicator image.
            */        
    
            if(oTarget == oItem.submenuIndicator && oSubmenu) {
    
                if(oSubmenu.cfg.getProperty("visible")) {

                    oSubmenu.hide();
        
                }
                else {
    
                    this.clearActiveItem();
    
                    this.activeItem = oItem;
        
                    oItemCfg.setProperty("selected", true);
    
                    oSubmenu.show();
        
                }
        
            }
            else {
    
                var sURL = oItemCfg.getProperty("url");
                var bCurrentPageURL = (sURL.substr((sURL.length-1),1) == "#");
                var sTarget = oItemCfg.getProperty("target");
                var bHasTarget = (sTarget && sTarget.length > 0);
    
                /*
                    Prevent the browser from following links 
                    equal to "#"
                */
                
                if(
                    oTarget.tagName.toUpperCase() == "A" && 
                    bCurrentPageURL && !bHasTarget
                ) {
    
                    Event.preventDefault(oEvent);
                
                }
    
                if(
                    oTarget.tagName.toUpperCase() != "A" && 
                    !bCurrentPageURL && !bHasTarget
                ) {
                    
                    /*
                        Follow the URL of the item regardless of 
                        whether or not the user clicked specifically
                        on the HTMLAnchorElement (&#60;A&#60;) node.
                    */
        
                    document.location = sURL;
            
                }
    
            }                    
        
        }

    };


/**
* "keydown" Custom Event handler for a MenuModule instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance that 
* fired the event.
*/
YAHOO.widget.MenuModule.prototype._onMenuModuleKeyDown = 

    function(p_sType, p_aArgs, p_oMenuModule) {

        var oEvent = p_aArgs[0];

        if(oEvent.keyCode == 27) { // ESC Key

            if(this.cfg.getProperty("position") == "dynamic") {
            
                this.hide();

                if(this.parent) {

                    this.parent.focus();
                
                }

            }
            else if(this.activeItem) {

                var oSubmenu = this.activeItem.cfg.getProperty("submenu");

                if(oSubmenu && oSubmenu.cfg.getProperty("visible")) {
                
                    oSubmenu.hide();
                    this.activeItem.focus();
                
                }
                else {

                    this.activeItem.cfg.setProperty("selected", false);
                    this.activeItem.blur();
            
                }
            
            }


            Event.preventDefault(oEvent);

        }
    
    };


/**
* "configchange" Custom Event handler for a submenu.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oSubmenu The submenu that subscribed
* to the event.
*/
YAHOO.widget.MenuModule.prototype._onParentMenuModuleConfigChange = 

    function(p_sType, p_aArgs, p_oSubmenu) {
    
        var sPropertyName = p_aArgs[0][0];
        var oPropertyValue = p_aArgs[0][1];
    
        switch(sPropertyName) {
    
            case "iframe":
            case "constraintoviewport":
            case "hidedelay":
            case "showdelay":
            case "clicktohide":
    
                p_oSubmenu.cfg.setProperty(sPropertyName, oPropertyValue);
                    
            break;        
            
        }
    
    };


/**
* "render" Custom Event handler for a MenuModule instance.  Renders a  
* submenu in response to the firing of its parent's "render" event.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oSubmenu The submenu that subscribed
* to the event.
*/
YAHOO.widget.MenuModule.prototype._onParentMenuModuleRender = 

    function(p_sType, p_aArgs, p_oSubmenu) {

        /*
            Set the "constraintoviewport" configuration 
            property to match the parent MenuModule
        */ 
    
        var oParentMenu = p_oSubmenu.parent.parent;

        var oConfig = {

                constraintoviewport: 
                    oParentMenu.cfg.getProperty("constraintoviewport"),
    
                xy: [0,0],
                    
                clicktohide:
                    oParentMenu.cfg.getProperty("clicktohide")

            };


        var nShowDelay = oParentMenu.cfg.getProperty("showdelay");

        if(nShowDelay > 0) {

            oConfig.showdelay = nShowDelay;

        }


        var nHideDelay = oParentMenu.cfg.getProperty("hidedelay");

        if(nHideDelay > 0) {

            oConfig.hidedelay = nHideDelay;

        }


        /*
            Only sync the "iframe" configuration property if the parent
            MenuModule instance's position is of the same value
        */

        if(
            this.cfg.getProperty("position") == 
            oParentMenu.cfg.getProperty("position")
        ) {

            oConfig.iframe = oParentMenu.cfg.getProperty("iframe");
        
        }
                   

        p_oSubmenu.cfg.applyConfig(oConfig);
        

        if(Dom.inDocument(this.element)) {
    
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
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oSubmenu The submenu that fired
* the event.
*/
YAHOO.widget.MenuModule.prototype._onSubmenuModuleBeforeShow = 

    function(p_sType, p_aArgs, p_oSubmenu) {
    
        var oParent = this.parent;
        var aAlignment = oParent.parent.cfg.getProperty("submenualignment");

        this.cfg.setProperty(
            "context", 
            [
                oParent.element, 
                aAlignment[0], 
                aAlignment[1]
            ]
        );

        oParent.submenuIndicator.alt = 
            oParent.EXPANDED_SUBMENU_INDICATOR_ALT_TEXT;
    
    };


/**
* "show" Custom Event handler for a submenu.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oSubmenu The submenu that fired
* the event.
*/
YAHOO.widget.MenuModule.prototype._onSubmenuModuleShow = 

    function(p_sType, p_aArgs, p_oSubmenu) {
    
        var oParent = this.parent;

        oParent.submenuIndicator.alt = 
            oParent.EXPANDED_SUBMENU_INDICATOR_ALT_TEXT;
    
    };


/**
* "hide" Custom Event handler for a submenu.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oSubmenu The submenu that fired
* the event.
*/
YAHOO.widget.MenuModule.prototype._onSubmenuModuleHide = 

    function(p_sType, p_aArgs, p_oSubmenu) {
    
        var oParent = this.parent;

        oParent.submenuIndicator.alt = 
            oParent.COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT;
    
    };


/**
* "focus" YAHOO.util.CustomEvent handler for a MenuModule instance's items.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {Array} p_aObjects Array containing the current MenuModule instance 
* and the item that fired the event.
*/
YAHOO.widget.MenuModule.prototype._onMenuModuleItemFocus = 

    function(p_sType, p_aArgs, p_aObjects) {
    
        var me = p_aObjects[0];
        var oItem = p_aObjects[1];
    
        me.activeItem = oItem;
    
    };


/**
* "blur" YAHOO.util.CustomEvent handler for a MenuModule instance's items.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {Array} p_aObjects Array containing the current MenuModule instance 
* and the item that fired the event.
*/
YAHOO.widget.MenuModule.prototype._onMenuModuleItemBlur = 

    function(p_sType, p_aArgs, p_aObjects) {
    
        var me = p_aObjects[0];
    
        me.activeItem = null;
    
    };


/**
* "configchange" YAHOO.util.CustomEvent handler for the MenuModule 
* instance's items.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the 
* event was fired.
* @param {Array} p_aObjects Array containing the current MenuModule instance 
* and the item that fired the event.
*/
YAHOO.widget.MenuModule.prototype._onMenuModuleItemConfigChange = 

    function(p_sType, p_aArgs, p_aObjects) {

        var me = p_aObjects[0];    
        var sProperty = p_aArgs[0][0];
        var oItem = p_aObjects[1];
    
        switch(sProperty) {
    
            case "submenu":
    
                var oSubmenu = p_aArgs[0][1];
    
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
    
                    Dom.setStyle(me.element, "width", sWidth);
    
                }
    
            break;
    
        }
    
    };


/**
* "destroy" YAHOO.util.CustomEvent handler for the MenuModule 
* instance's items.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the 
* event was fired.
* @param {Array} p_aObjects Array containing the current MenuModule instance 
* and the item that fired the event.
*/
YAHOO.widget.MenuModule.prototype._onMenuModuleItemDestroy = 

    function(p_sType, p_aArgs, p_aObjects) {

        var oItem = p_aObjects[1];

        MenuManager.removeItem(oItem);

    };


/**
* The default event handler executed when the moveEvent is fired, if the 
* "constraintoviewport" configuration property is set to true.
*/
YAHOO.widget.MenuModule.prototype.enforceConstraints = 

    function(type, args, obj) {

        var oConfig = this.cfg;
    
        var pos = args[0];
            
        var x = pos[0];
        var y = pos[1];
        
        var bod = document.getElementsByTagName('body')[0];
        var htm = document.getElementsByTagName('html')[0];
        
        var bodyOverflow = Dom.getStyle(bod, "overflow");
        var htmOverflow = Dom.getStyle(htm, "overflow");
        
        var offsetHeight = this.element.offsetHeight;
        var offsetWidth = this.element.offsetWidth;
        
        var viewPortWidth = Dom.getClientWidth();
        var viewPortHeight = Dom.getClientHeight();
        
        var scrollX = window.scrollX || document.body.scrollLeft;
        var scrollY = window.scrollY || document.body.scrollTop;
        
        var topConstraint = scrollY + 10;
        var leftConstraint = scrollX + 10;
        var bottomConstraint = scrollY + viewPortHeight - offsetHeight - 10;
        var rightConstraint = scrollX + viewPortWidth - offsetWidth - 10;
        
        var aContext = oConfig.getProperty("context");
        var oContextElement = aContext ? aContext[0] : null;
    
    
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
    
        oConfig.setProperty("x", x, true);
        oConfig.setProperty("y", y, true);
    
    };


// Event handlers for configuration properties

/**
* Event handler for when the "position" configuration property of a
* MenuModule changes.
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance fired
* the event.
*/
YAHOO.widget.MenuModule.prototype.configPosition = 

    function(p_sType, p_aArgs, p_oMenuModule) {

        var sCSSPosition = p_aArgs[0] == "static" ? "static" : "absolute";

        Dom.setStyle(this.element, "position", sCSSPosition);


        if(sCSSPosition == "absolute") {

            Dom.setStyle(this.element, "visibility", "hidden");    
        
        }

    };


/**
* Event handler for when the "iframe" configuration property of a
* MenuModule changes.
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance fired
* the event.
*/
YAHOO.widget.MenuModule.prototype.configIframe = 

    function(p_sType, p_aArgs, p_oMenuModule) {    

        if(this.cfg.getProperty("position") == "dynamic") {

            YAHOO.widget.MenuModule.superclass.configIframe.call(
                this, 
                p_sType, 
                p_aArgs, 
                p_oMenuModule
            );
    
        }
    
    };


/**
* Event handler for when the "hidedelay" configuration property of a
* MenuModule changes.
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance fired
* the event.
*/
YAHOO.widget.MenuModule.prototype.configHideDelay = 

    function(p_sType, p_aArgs, p_oMenuModule) {

        var nHideDelay = p_aArgs[0];
        var oMouseOutEvent = this.mouseOutEvent;
        var oMouseOverEvent = this.mouseOverEvent;
        var oKeyDownEvent = this.keyDownEvent;

        if(nHideDelay > 0) {

            /*
                Only assign event handlers once. This way the user change 
                the value for the hidedelay as many times as they want.
            */

            if(!this._hideDelayEventHandlersAssigned) {

                oMouseOutEvent.subscribe(
                        this._execHideDelay, 
                        this, 
                        true
                    );

                oMouseOverEvent.subscribe(
                        this._cancelHideDelay, 
                        this, 
                        true
                    );

                oKeyDownEvent.subscribe(
                        this._cancelHideDelay, 
                        this, 
                        true
                    );


                this._hideDelayEventHandlersAssigned = true;
            
            }

        }
        else {

            oMouseOutEvent.unsubscribe(this._execHideDelay, this);
            oMouseOverEvent.unsubscribe(this._cancelHideDelay, this);
            oKeyDownEvent.unsubscribe(this._cancelHideDelay, this);

            this._hideDelayEventHandlersAssigned = false;

        }

    };


// Public methods

/**
* Finds a MenuModule's root MenuModule instance.
*/
YAHOO.widget.MenuModule.prototype.getRoot = function() {

    var oItem = this.parent; // The parent MenuModuleItem instance

    if(oItem) {

        var oParentMenu = oItem.parent;

        return oParentMenu ? oParentMenu.getRoot() : this;

    }
    else {
    
        return this;
    
    }

};

/**
* Returns a string representing the specified object.
*/
YAHOO.widget.MenuModule.prototype.toString = function() {

    return ("MenuModule " + this.id);

};


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
                    typeof p_nGroupIndex == "number" ? p_nGroupIndex : 0;
    
            var oTitle = this._aGroupTitleElements[nGroupIndex];
    
    
            if(oTitle) {
    
                oTitle.innerHTML = p_sGroupTitle;
                
            }
            else {
    
                oTitle = document.createElement(this.GROUP_TITLE_TAG_NAME);
                        
                oTitle.innerHTML = p_sGroupTitle;
    
                this._aGroupTitleElements[nGroupIndex] = oTitle;
    
            }
    
    
            var i = this._aGroupTitleElements.length - 1;
            var nFirstIndex;
    
            do {
    
                if(this._aGroupTitleElements[i]) {
    
                    Dom.removeClass(
                        this._aGroupTitleElements[i],
                        "first-of-type"
                    );

                    nFirstIndex = i;
    
                }
    
            }
            while(i--);
    
    
            if(nFirstIndex !== null) {
    
                Dom.addClass(
                    this._aGroupTitleElements[nFirstIndex], 
                    "first-of-type"
                );
    
            }
    
        }
    
    };


/**
* Appends the specified item to a MenuModule instance.
* @param {YAHOO.widget.MenuModuleItem} p_oItem The item to be added.
* @param {String} p_oItem The text of the item to be added.
* @param {Number} p_nGroupIndex Optional. Number indicating the group to which
* the item belongs.
* @return The item that was added to the MenuModule.
* @type YAHOO.widget.MenuModuleItem
*/
YAHOO.widget.MenuModule.prototype.addItem = function(p_oItem, p_nGroupIndex) {

    if(p_oItem) {

        return this._addItemToGroup(p_nGroupIndex, p_oItem);
        
    }

};


/**
* Inserts an item into a MenuModule instance at the specified index.
* @param {YAHOO.widget.MenuModuleItem} p_oItem The item to be inserted.
* @param {String} p_oItem The text of the item to be inserted.
* @param {Number} p_nItemIndex Number indicating the ordinal position 
* at which the item should be added.
* @param {Number} p_nGroupIndex Optional. Number indicating the group to which
* the item belongs.
* @return The item that was inserted into the MenuModule.
* @type YAHOO.widget.MenuModuleItem
*/
YAHOO.widget.MenuModule.prototype.insertItem = 

    function(p_oItem, p_nItemIndex, p_nGroupIndex) {
    
        if(p_oItem) {
    
            return this._addItemToGroup(p_nGroupIndex, p_oItem, p_nItemIndex);
    
        }
    
    };


/**
* Removes the specified item from a MenuModule instance.
* @param {YAHOO.widget.MenuModuleItem} p_oObject The item to be removed.
* @param {Number} p_oObject The index of the item to be removed.
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

                this.logger.log("Item removed." + 
                    " Text: " + oItem.cfg.getProperty("text") + ", " + 
                    " Index: " + oItem.index + ", " + 
                    " Group Index: " + oItem.groupIndex);
    
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

    // Remove the Menu from the "_menus" collection

    MenuManager.removeMenu(this);


    // Remove Custom Event listeners

    this.mouseOverEvent.unsubscribeAll();
    this.mouseOutEvent.unsubscribeAll();
    this.mouseDownEvent.unsubscribeAll();
    this.mouseUpEvent.unsubscribeAll();
    this.clickEvent.unsubscribeAll();
    this.keyPressEvent.unsubscribeAll();
    this.keyDownEvent.unsubscribeAll();
    this.keyUpEvent.unsubscribeAll();


    var nItemGroups = this._aItemGroups.length;
    var nItems;
    var oItemGroup;
    var oItem;
    var i;
    var n;


    // Remove all items

    if(nItemGroups > 0) {

        i = nItemGroups - 1;

        do {

            oItemGroup = this._aItemGroups[i];

            if(oItemGroup) {

                nItems = oItemGroup.length;
    
                if(nItems > 0) {
    
                    n = nItems - 1;
        
                    do {

                        oItem = this._aItemGroups[i][n];

                        if(oItem) {
        
                            oItem.destroy();
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
    
    this.logger.log("Destroyed.");

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
* item to "false" and hide's the item's submenu.
* @param {Boolean} p_bBlur Flag indicating if the MenuModule instance's 
* active item should be blurred.  
*/
YAHOO.widget.MenuModule.prototype.clearActiveItem = function(p_bBlur) {

    if(this.cfg.getProperty("showdelay") > 0) {
    
        this._cancelShowDelay();
    
    }


    var oActiveItem = this.activeItem;

    if(oActiveItem) {

        var oConfig = oActiveItem.cfg;

        oConfig.setProperty("selected", false);

        var oSubmenu = oConfig.getProperty("submenu");

        if(oSubmenu) {

            oSubmenu.hide();

        }

        if(p_bBlur) {

            oActiveItem.blur();
        
        }

    }

};


/**
* Initializes the class's configurable properties which can be changed using 
* the MenuModule's Config object (cfg).
*/
YAHOO.widget.MenuModule.prototype.initDefaultConfig = function() {

    YAHOO.widget.MenuModule.superclass.initDefaultConfig.call(this);

    var oConfig = this.cfg;

	// Add configuration properties

	oConfig.addProperty(
	   "constraintoviewport", 
	   { 
	       value: true, 
	       handler: this.configConstrainToViewport, 
	       validator: oConfig.checkBoolean, 
	       supercedes:["iframe","x","y","xy"] 
       } 
    );

    oConfig.addProperty(
        "position", 
        {
            value: "dynamic", 
            handler: this.configPosition, 
            validator: this._checkPosition 
        }
    );

    oConfig.addProperty("submenualignment", { value: ["tl","tr"] } );

	oConfig.addProperty(
	   "autosubmenudisplay", 
	   { 
	       value: false, 
	       validator: oConfig.checkBoolean
       } 
    );
    
	oConfig.addProperty(
	   "showdelay", 
	   { 
	       value: 0, 
	       validator: oConfig.checkNumber
       } 
    );

	oConfig.addProperty(
	   "hidedelay", 
	   { 
	       value: 0, 
	       validator: oConfig.checkNumber, 
	       handler: this.configHideDelay,
	       suppressEvent: true
       } 
    );

    oConfig.addProperty(
        "clicktohide",
        {
            value: true,
            validator: oConfig.checkBoolean
        }
    );

};


})();