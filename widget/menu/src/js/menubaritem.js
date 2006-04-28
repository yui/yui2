/*
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

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
    this.mouseOverEvent.subscribe(this._onMouseOver, this, true);
    this.mouseOutEvent.subscribe(this._onMouseOut, this, true);


    if(p_oUserConfig) {

        this.cfg.applyConfig(p_oUserConfig);

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
* "mouseover" Custom Event handler for a MenuBarItem instance.
* @private
*/
YAHOO.widget.MenuBarItem.prototype._onMouseOver = 
    YAHOO.widget.MenuItem.prototype._onMouseOver;


/**
* "mouseout" Custom Event handler for a MenuBarItem instance.
* @private
*/
YAHOO.widget.MenuBarItem.prototype._onMouseOut = 
    YAHOO.widget.MenuItem.prototype._onMouseOut;
    

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