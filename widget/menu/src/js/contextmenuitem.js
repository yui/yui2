


/**
* Creates an item for a context menu instance.
* 
* @param {String} p_oObject The text of the ContextMenuItem to be 
* created <em>OR</em>
* @param {HTMLElement} p_oObject The HTMLElement representing the source node 
* (either HTMLLIElement, HTMLOptGroupElement or HTMLOptionElement) of 
* the ContextMenuItem
* @param {Object} p_oConfig The configuration object literal containing 
* the configuration for a ContextMenuItem instance. See the configuration 
* class documentation for more details.
* @class ContextMenuItem
* @constructor
* @extends YAHOO.widget.MenuItem
*/
YAHOO.widget.ContextMenuItem = function(p_oObject, p_oConfig) {

    YAHOO.widget.ContextMenuItem.superclass.constructor.call(
        this, 
        p_oObject, 
        p_oConfig
    );

};

YAHOO.extend(YAHOO.widget.ContextMenuItem, YAHOO.widget.MenuItem, {


/**
* @method init
* @description The ContextMenuItem class's initialization method. This method is
* automatically called by the constructor, and sets up all DOM references for
* pre-existing markup, and creates required markup if it is not
* already present.
* @param {String} p_oObject The text of the ContextMenuItem to be 
* created <em>OR</em>
* @param {HTMLElement} p_oObject The HTMLElement representing the source node 
* (either HTMLLIElement, HTMLOptGroupElement or HTMLOptionElement) of 
* the ContextMenuItem
* @param {Object} p_oConfig The configuration object literal containing 
* the configuration for a ContextMenuItem instance. See the configuration 
* class documentation for more details.
*/
init: function(p_oObject, p_oConfig) {
    
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

    var oConfig = this.cfg;

    if(p_oConfig) {

        oConfig.applyConfig(p_oConfig, true);

    }

    oConfig.fireQueue();

},



// Public methods


/**
* @method toString
* @description Returns a string representing the specified object.
*/
toString: function() {

    return ("MenuBarItem: " + this.cfg.getProperty("text"));

}
    
}); // END YAHOO.extend