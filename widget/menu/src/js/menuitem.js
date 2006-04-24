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
* @param {String/HTMLElement} p_oObject String or HTMLElement 
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
* @param {String/HTMLElement} p_oObject String or HTMLElement 
* (either HTMLLIElement, HTMLOptGroupElement or HTMLOptionElement) of the 
* source HTMLElement node.
* @param {Object} p_oUserConfig The configuration object literal containing 
* the configuration for a MenuItem instance. See the configuration 
* class documentation for more details.
*/
YAHOO.widget.MenuItem.prototype.init = function(p_oObject, p_oUserConfig) {

    if(!this.MENU_TYPE) {

        this.MENU_TYPE = YAHOO.widget.Menu;

    }

    if(!this.ITEM_TYPE) {

        this.ITEM_TYPE = YAHOO.widget.MenuItem;

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

    /*
        Handle tab "onkeypress" for FF < 1.5 because FF 1.0 doesn't allow you
        to prevent the default tab behavior "onkeydown"
    */

    if((this.browser == "gecko" && this._sUserAgent.indexOf("1.0") != -1)) {

        this.keyPressEvent.subscribe(this._onKeyPress, this, true);

    }

    this.mouseOverEvent.subscribe(this._onMouseOver, this, true);
    this.mouseOutEvent.subscribe(this._onMouseOut, this, true);


    if(p_oUserConfig) {

        this.cfg.applyConfig(p_oUserConfig);

    }

    this.cfg.fireQueue();

};


// Private event handlers

/**
* "keypress" Custom Event handler for a MenuItem instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance that 
* fired the event.
*/
YAHOO.widget.MenuItem.prototype._onKeyPress = function(p_sType, p_aArguments, p_oMenuItem) {

    var oEvent = p_aArguments[0];

    if(oEvent.keyCode == 9) {
        
        var oActiveItem = this.parent.activeItem;

        if(this == oActiveItem && !this.cfg.getProperty("selected")) {

            this.cfg.setProperty("selected", true);

        }
        else {

            var oNextItem;

            if(oEvent.shiftKey) {

                oNextItem = this.getPreviousEnabledSibling();

            }
            else {

                oNextItem = this.getNextEnabledSibling();

            }
    
            if(oNextItem) {

                var oSubmenu = this.cfg.getProperty("submenu");
        
                if(oSubmenu) {
        
                    oSubmenu.hide();
        
                }

                this.cfg.setProperty("selected", false);

                oNextItem.cfg.setProperty("selected", true);
    
                oNextItem.focus();

            }

        }

        YAHOO.util.Event.preventDefault(oEvent);

    }

}; 


/**
* "keydown" Custom Event handler for a MenuItem instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance that 
* fired the event.
*/
YAHOO.widget.MenuItem.prototype._onKeyDown = function(p_sType, p_aArguments, p_oMenuItem) {

    var oEvent = p_aArguments[0];

    switch(oEvent.keyCode) {

        case 9:     // Tab                    
        case 38:    // Up arrow
        case 40:    // Down arrow

            if(
                oEvent.keyCode == 9 && 
                (
                    this.browser == "gecko" && 
                    this._sUserAgent.indexOf("1.0") != -1)
                ) 
            {

                return;

            }

            var oActiveItem = this.parent.activeItem;

            if(this == oActiveItem && !this.cfg.getProperty("selected")) {

                this.cfg.setProperty("selected", true);

            }
            else {

                var oNextItem;

                if(
                    (oEvent.keyCode == 9 && oEvent.shiftKey) || 
                    oEvent.keyCode == 38
                ) {

                    oNextItem = this.getPreviousEnabledSibling();

                }
                else {

                    oNextItem = this.getNextEnabledSibling();

                }
        
                if(oNextItem) {

                    var oSubmenu = this.cfg.getProperty("submenu");
            
                    if(oSubmenu) {
            
                        oSubmenu.hide();
            
                    }

                    this.cfg.setProperty("selected", false);

                    oNextItem.cfg.setProperty("selected", true);
        
                    oNextItem.focus();
    
                }

            }

            if(oEvent.keyCode == 9) {

                YAHOO.util.Event.preventDefault(oEvent);

            }

        break;
        

        case 39:    // Right arrow

            var oSubmenu = this.cfg.getProperty("submenu");

            if(oSubmenu) {

                oSubmenu.show();
                oSubmenu.setInitialSelection();

            }

        break;


        case 37:    // Left arrow

            // Only hide if this this is a MenuItem of a submenu

            if(this.parent.parent) {

                this.parent.hide();

                // Set focus to the parent MenuItem if one exists

                var oMenuItem = this.parent.parent;

                if(oMenuItem) {

                    oMenuItem.focus();

                }

            }

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
YAHOO.widget.MenuItem.prototype._onMouseOver = function(p_sType, p_aArguments, p_oMenuItem) {

    var oSubmenu,
        oActiveItem = this.parent.activeItem;


    // Hide any other submenus that might be visible

    if(oActiveItem && oActiveItem != this) {

        oActiveItem.cfg.setProperty("selected", false);


        oSubmenu = oActiveItem.cfg.getProperty("submenu");

        if(oSubmenu && oSubmenu.cfg.getProperty("visible")) {

            oSubmenu.hide();

        }

    }


    // Select and focus the current MenuItem instance

    this.cfg.setProperty("selected", true);
    this.focus();


    // Show the submenu for this instance

    oSubmenu = this.cfg.getProperty("submenu");

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
YAHOO.widget.MenuItem.prototype._onMouseOut = function(p_sType, p_aArguments, p_oMenuItem) {

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