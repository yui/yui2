


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