/*
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

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