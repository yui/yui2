


/**
* Creates an item for a menu bar.
* 
* @param {String} p_oObject String specifying the text of the menu bar item.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-74680021">HTMLLIElement</a>} p_oObject Object specifying the 
* <code>&#60;li&#62;</code> element of the menu bar item.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-38450247">HTMLOptGroupElement</a>} p_oObject Object 
* specifying the <code>&#60;optgroup&#62;</code> element of the menu bar item.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-70901257">HTMLOptionElement</a>} p_oObject Object specifying 
* the <code>&#60;option&#62;</code> element of the menu bar item.
* @param {Object} p_oConfig Optional. Object literal specifying the 
* configuration for the menu bar item. See configuration class documentation 
* for more details.
* @class MenuBarItem
* @constructor
* @extends YAHOO.widget.MenuItem
*/
YAHOO.widget.MenuBarItem = function(p_oObject, p_oConfig) {

    YAHOO.widget.MenuBarItem.superclass.constructor.call(
        this, 
        p_oObject, 
        p_oConfig
    );

};

YAHOO.extend(YAHOO.widget.MenuBarItem, YAHOO.widget.MenuItem, {


/**
* @method init
* @description The MenuBarItem class's initialization method. This method is 
* automatically called by the constructor, and sets up all DOM references for 
* pre-existing markup, and creates required markup if it is not already present.
* @param {String} p_oObject String specifying the text of the menu bar item.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-74680021">HTMLLIElement</a>} p_oObject Object specifying the 
* <code>&#60;li&#62;</code> element of the menu bar item.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-38450247">HTMLOptGroupElement</a>} p_oObject Object 
* specifying the <code>&#60;optgroup&#62;</code> element of the menu bar item.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-70901257">HTMLOptionElement</a>} p_oObject Object specifying 
* the <code>&#60;option&#62;</code> element of the menu bar item.
* @param {Object} p_oConfig Optional. Object literal specifying the 
* configuration for the menu bar item. See configuration class documentation 
* for more details.
*/
init: function(p_oObject, p_oConfig) {

    if(!this.SUBMENU_TYPE) {

        this.SUBMENU_TYPE = YAHOO.widget.Menu;

    }


    /* 
        Call the init of the superclass (YAHOO.widget.MenuItem)
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

},



// Constants

/**
* @property CSS_CLASS_NAME
* @description String representing the CSS class(es) to be applied to the 
* <code>&#60;li&#62;</code> element of the menu bar item.
* @default "yuimenubaritem"
* @final
* @type String
*/
CSS_CLASS_NAME: "yuimenubaritem",


/**
* @property SUBMENU_INDICATOR_IMAGE_PATH
* @description String representing the path to the image to be used for the 
* menu bar item's submenu arrow indicator.
* @default "nt/ic/ut/alt1/menuarodwn8_nrm_1.gif"
* @final
* @type String
*/
SUBMENU_INDICATOR_IMAGE_PATH: "nt/ic/ut/alt1/menuarodwn8_nrm_1.gif",


/**
* @property SELECTED_SUBMENU_INDICATOR_IMAGE_PATH
* @description String representing the path to the image to be used for the 
* submenu arrow indicator when the menu bar item is selected.
* @default "nt/ic/ut/alt1/menuarodwn8_hov_1.gif"
* @final
* @type String
*/
SELECTED_SUBMENU_INDICATOR_IMAGE_PATH: "nt/ic/ut/alt1/menuarodwn8_hov_1.gif",


/**
* @property DISABLED_SUBMENU_INDICATOR_IMAGE_PATH
* @description String representing the path to the image to be used for the 
* submenu arrow indicator when the menu bar item is disabled.
* @default "nt/ic/ut/alt1/menuarodwn8_dim_1.gif"
* @final
* @type String
*/
DISABLED_SUBMENU_INDICATOR_IMAGE_PATH: "nt/ic/ut/alt1/menuarodwn8_dim_1.gif",



// Public methods


/**
* @method toString
* @description Returns a string representing the menu bar item.
* @return {String}
*/
toString: function() {

    return ("MenuBarItem: " + this.cfg.getProperty("text"));

}
    
}); // END YAHOO.extend