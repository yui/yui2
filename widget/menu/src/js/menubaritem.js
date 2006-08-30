


/**
* @class The MenuBarItem class allows you to create and modify an item for a
* MenuBar instance.  MenuBarItem extends YAHOO.widget.MenuModuleItem to provide 
* a set of default mouse and key event behaviors.
* @constructor
* @extends YAHOO.widget.MenuModuleItem
* @base YAHOO.widget.MenuModuleItem
* @param {String} p_oObject The text of the MenuBarItem to be 
* created <em>OR</em>
* @param {HTMLElement} p_oObject The HTMLElement representing the source node
* (either HTMLLIElement, HTMLOptGroupElement or HTMLOptionElement) of
* the MenuBarItem
* @param {Object} p_oConfig The configuration object literal containing 
* the configuration for a MenuBarItem instance. See the configuration 
* class documentation for more details.
*/
YAHOO.widget.MenuBarItem = function(p_oObject, p_oConfig) {

    YAHOO.widget.MenuBarItem.superclass.constructor.call(
        this, 
        p_oObject, 
        p_oConfig
    );

};

YAHOO.extend(YAHOO.widget.MenuBarItem, YAHOO.widget.MenuModuleItem);


/**
* The MenuBarItem class's initialization method. This method is automatically
* called by the constructor, and sets up all DOM references for
* pre-existing markup, and creates required markup if it is not
* already present.
* @param {String} p_oObject The text of the MenuBarItem to be 
* created <em>OR</em>
* @param {HTMLElement} p_oObject The HTMLElement representing the source node
* (either HTMLLIElement, HTMLOptGroupElement or HTMLOptionElement) of
* the MenuBarItem
* @param {Object} p_oConfig The configuration object literal containing 
* the configuration for a MenuBarItem instance. See the configuration 
* class documentation for more details.
*/
YAHOO.widget.MenuBarItem.prototype.init = function(p_oObject, p_oConfig) {

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

    var oConfig = this.cfg;

    if(p_oConfig) {

        oConfig.applyConfig(p_oConfig, true);

    }

    oConfig.fireQueue();

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
    "nt/ic/ut/alt1/menuarodwn8_nrm_1.gif";


/**
* Constant representing the path to the image to be used for the submenu
* arrow indicator when a MenuBarItem instance is selected.
* @final
* @type String
*/
YAHOO.widget.MenuBarItem.prototype.SELECTED_SUBMENU_INDICATOR_IMAGE_PATH =
    "nt/ic/ut/alt1/menuarodwn8_hov_1.gif";


/**
* Constant representing the path to the image to be used for the submenu
* arrow indicator when a MenuBarItem instance is disabled.
* @final
* @type String
*/
YAHOO.widget.MenuBarItem.prototype.DISABLED_SUBMENU_INDICATOR_IMAGE_PATH = 
    "nt/ic/ut/alt1/menuarodwn8_dim_1.gif";


// Private event handlers

/**
* "keydown" Custom Event handler for a MenuBarItem instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuBarItem} p_oMenuModule The MenuModule instance that 
* fired the event.
*/
YAHOO.widget.MenuBarItem.prototype._onKeyDown =

    function(p_sType, p_aArgs, p_oMenuItem) {

        var Event = YAHOO.util.Event;
        var oDOMEvent = p_aArgs[0];
        var oConfig = this.cfg;
        var oParent = this.parent;
    
        switch(oDOMEvent.keyCode) {
    
            case 37:    // Left arrow
            case 39:    // Right arrow
    
                if(
                    this == oParent.activeItem && 
                    !oConfig.getProperty("selected")
                ) {
    
                    oConfig.setProperty("selected", true);
    
                }
                else {
    
                    var oNextItem = (oDOMEvent.keyCode == 37) ? 
                            this.getPreviousEnabledSibling() : 
                            this.getNextEnabledSibling();
            
                    if(oNextItem) {

                        oParent.clearActiveItem();

                        oNextItem.cfg.setProperty("selected", true);
            
                        oNextItem.focus();
    
                    }
    
                }

                Event.preventDefault(oDOMEvent);
    
            break;
    
            case 40:    // Down arrow

                oParent.clearActiveItem();
                        
                oConfig.setProperty("selected", true);
                
                this.focus();

                var oSubmenu = oConfig.getProperty("submenu");
    
                if(oSubmenu) {
        
                    oSubmenu.show();
                    oSubmenu.setInitialSelection();
    
                }

                Event.preventDefault(oDOMEvent);
    
            break;
    
        }
    
    };