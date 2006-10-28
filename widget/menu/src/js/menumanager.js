/**
* @module Menu
* @description <p>The Menu Library features a collection of widgets that makes  
it easy to add menus to your website or web application.  Use can use the Menu 
Library to create things like application-style fly-out menus, customizable 
context menus, or navigation-style menu bars with just a small amount of 
scripting.</p> <p>The Menu library features:</p>
<ul>
    <li>Screen-reader accessibility.</li>
    <li>Keyboard and mouse navigation.</li>
    <li>A rich event model that provides access to all of a Menu instance's 
    interesting moments.</li>
    <li>Support for 
    <a href="http://en.wikipedia.org/wiki/Progressive_Enhancement">Progressive
    Enhancement</a>; Menus can be created from simple, 
    semantic markup on the page or purely through JavaScript.</li>
</ul>
* @title Menu Library
* @namespace YAHOO.widget
* @requires Event, Dom, Container
*/
(function() {

var Dom = YAHOO.util.Dom;
var Event = YAHOO.util.Event;

/**
* Singleton that manages a collection of all menus and menu items.  Listens for 
* DOM events at the document level and dispatches the events to the 
* corresponding menu or menu item.
*
* @namespace YAHOO.widget
* @class MenuManager
* @static
*/
YAHOO.widget.MenuManager = new function() {

    // Private member variables


    // Flag indicating if the DOM event handlers have been attached

    var m_bInitializedEventHandlers = false;


    // Collection of menus

    var m_oMenus = {};
    
    
    //  Collection of menu items 

    var m_oItems = {};


    // Collection of visible menus
    
    var m_oVisibleMenus = {};



    // Private methods


    /**
    * @method addItem
    * @description Adds an item to the collection of known MenuItem instances.
    * @private
    * @param {YAHOO.widget.MenuItem} p_oItem MenuItem instance to be added.
    */
    var addItem = function(p_oItem) {
    
        var sYUIId = Dom.generateId();

        if(p_oItem && m_oItems[sYUIId] != p_oItem) {

            p_oItem.element.setAttribute("yuiid", sYUIId);
    
            m_oItems[sYUIId] = p_oItem;            
    
            p_oItem.destroyEvent.subscribe(onItemDestroy, p_oItem);

        }
    
    };


    /**
    * @method removeItem
    * @description Removes an item from the collection of known 
    * MenuItem instances.
    * @private
    * @param {YAHOO.widget.MenuItem} p_oItem MenuItem instance
    */
    var removeItem = function(p_oItem) {
    
        var sYUIId = p_oItem.element.getAttribute("yuiid");

        if(sYUIId && m_oItems[sYUIId]) {

            delete m_oItems[sYUIId];

        }
    
    };


    /**
    * @method getMenuRootElement
    * @description Finds the root DIV node of a menu or the root LI node of a 
    * menu item
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



    // Private event handlers


    /**
    * @method onDOMEvent
    * @description Generic, global event handler for all of a menu's DOM-based 
    * events.  This listens for events against the document object.  If the 
    * target of a given event is a member of a menu or menu item's DOM, the 
    * instance's corresponding Custom Event is fired.
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
    * @method onMenuDestroy
    * @description "destroy" event handler for a Menu instance.
    * @private
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArgs Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.Menu} p_oMenu The Menu instance that fired the event.
    */
    var onMenuDestroy = function(p_sType, p_aArgs, p_oMenu) {
        
        this.removeMenu(p_oMenu);

    };


    /**
    * @method onItemDestroy
    * @description "destroy" event handler for a MenuItem instance.
    * @private
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArgs Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.MenuItem} p_oItem The MenuItem instance 
    * that fired the event.
    */
    var onItemDestroy = function(p_sType, p_aArgs, p_oItem) {

        var sYUIId = p_oItem.element.getAttribute("yuiid");

        if(sYUIId) {

            delete m_oItems[sYUIId];

        }

    };


    /**
    * @method onMenuVisibleConfigChange
    * @description Event handler for when the "visible" configuration property 
    * of a Menu instance changes.
    * @private
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArgs Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.Menu} p_oMenu The Menu instance that fired the event.
    */
    var onMenuVisibleConfigChange = function(p_sType, p_aArgs, p_oMenu) {

        var bVisible = p_aArgs[0];
        
        if(bVisible) {

            m_oVisibleMenus[p_oMenu.id] = p_oMenu;
        
        }
        else if(m_oVisibleMenus[p_oMenu.id]) {
        
            delete m_oVisibleMenus[p_oMenu.id];
        
        }
    
    };


    /**
    * @method onItemAdded
    * @description "itemadded" event handler for a Menu instance.
    * @private
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArgs Collection of arguments sent when the 
    * event was fired.
    */
    var onItemAdded = function(p_sType, p_aArgs) {
    
        addItem(p_aArgs[0]);
    
    };
    

    /**
    * @method onItemRemoved
    * @description "itemremoved" event handler for a Menu instance.
    * @private
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArgs Collection of arguments sent when the 
    * event was fired.
    */
    var onItemRemoved = function(p_sType, p_aArgs) {

        removeItem(p_aArgs[0]);
    
    };



    // Privileged methods


    /**
    * @method addMenu
    * @description Adds a Menu instance to the collection of known menus.
    * @param {YAHOO.widget.Menu} p_oMenu The Menu instance to be added.
    */
    this.addMenu = function(p_oMenu) {

        if(p_oMenu && p_oMenu.id && !m_oMenus[p_oMenu.id]) {

            m_oMenus[p_oMenu.id] = p_oMenu;
        
    
            if(!m_bInitializedEventHandlers) {
    
                var oDoc = document;
        
                Event.addListener(oDoc, "mouseover", onDOMEvent, this, true);
                Event.addListener(oDoc, "mouseout", onDOMEvent, this, true);
                Event.addListener(oDoc, "mousedown", onDOMEvent, this, true);
                Event.addListener(oDoc, "mouseup", onDOMEvent, this, true);
                Event.addListener(oDoc, "click", onDOMEvent, this, true);
                Event.addListener(oDoc, "keydown", onDOMEvent, this, true);
                Event.addListener(oDoc, "keyup", onDOMEvent, this, true);
                Event.addListener(oDoc, "keypress", onDOMEvent, this, true);
    
                m_bInitializedEventHandlers = true;
    
            }
    
            p_oMenu.destroyEvent.subscribe(onMenuDestroy, p_oMenu, this);
            
            p_oMenu.cfg.subscribeToConfigEvent(
                "visible", 
                onMenuVisibleConfigChange, 
                p_oMenu
            );
    
            p_oMenu.itemAddedEvent.subscribe(onItemAdded);
            p_oMenu.itemRemovedEvent.subscribe(onItemRemoved);

        }

    };


    /**
    * @method removeMenu
    * @description Removes a Menu instance from the collection of known menus.
    * @param {YAHOO.widget.Menu} p_oMenu The Menu instance to be removed.
    */
    this.removeMenu = function(p_oMenu) {

        if(p_oMenu && m_oMenus[p_oMenu.id]) {

            delete m_oMenus[p_oMenu.id];

        }

    };


    /**
    * @method hideVisible
    * @description Hides all visible, dynamically positioned Menu instances.
    */
    this.hideVisible = function() {

        var oMenu;

        for(var i in m_oVisibleMenus) {

            if(m_oVisibleMenus.hasOwnProperty(i)) {

                oMenu = m_oVisibleMenus[i];

                if(oMenu.cfg.getProperty("position") == "dynamic") {

                    oMenu.hide();

                }

            }

        }        
    
    };


    /**
    * @method getMenus
    * @description Returns a collection of all Menu instances.
    */
    this.getMenus = function() {
    
        return m_oMenus;
    
    };


    /**
    * @method getMenuById
    * @description Returns a Menu instance with the specified id.
    * @param {String} p_sId The id of the Menu instance to be retrieved.
    */
    this.getMenuById = function(p_sId) {

        if(m_oMenus[p_sId]) {
        
            return m_oMenus[p_sId];
        
        }
    
    };

};

})();