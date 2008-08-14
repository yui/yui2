(function () {

	var Lang = YAHOO.lang,

		// String constants
	
		_STATIC = "static",
		_DYNAMIC_STATIC = "dynamic," + _STATIC,
		_DISABLED = "disabled",
		_SELECTED = "selected",
		_AUTO_SUBMENU_DISPLAY = "autosubmenudisplay",
		_SUBMENU = "submenu",
		_VISIBLE = "visible",
		_SPACE = " ",
		_MENUBAR = "MenuBar";

/**
* Horizontal collection of items, each of which can contain a submenu.
* 
* @param {String} p_oElement String specifying the id attribute of the 
* <code>&#60;div&#62;</code> element of the menu bar.
* @param {String} p_oElement String specifying the id attribute of the 
* <code>&#60;select&#62;</code> element to be used as the data source for the 
* menu bar.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-22445964">HTMLDivElement</a>} p_oElement Object specifying 
* the <code>&#60;div&#62;</code> element of the menu bar.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-94282980">HTMLSelectElement</a>} p_oElement Object 
* specifying the <code>&#60;select&#62;</code> element to be used as the data 
* source for the menu bar.
* @param {Object} p_oConfig Optional. Object literal specifying the 
* configuration for the menu bar. See configuration class documentation for
* more details.
* @class MenuBar
* @constructor
* @extends YAHOO.widget.Menu
* @namespace YAHOO.widget
*/
YAHOO.widget.MenuBar = function(p_oElement, p_oConfig) {

    YAHOO.widget.MenuBar.superclass.constructor.call(this, p_oElement, p_oConfig);

};


/**
* @method checkPosition
* @description Checks to make sure that the value of the "position" property 
* is one of the supported strings. Returns true if the position is supported.
* @private
* @param {Object} p_sPosition String specifying the position of the menu.
* @return {Boolean}
*/
function checkPosition(p_sPosition) {

	var returnVal = false;

    if (Lang.isString(p_sPosition)) {

        returnVal = (_DYNAMIC_STATIC.indexOf((p_sPosition.toLowerCase())) != -1);

    }
    
    return returnVal;

}


var Event = YAHOO.util.Event,
    MenuBar = YAHOO.widget.MenuBar,

    /**
    * Constant representing the MenuBar's configuration properties
    * @property DEFAULT_CONFIG
    * @private
    * @final
    * @type Object
    */
    DEFAULT_CONFIG = {
    
        "POSITION": { 
            key: "position", 
            value: _STATIC, 
            validator: checkPosition, 
            supercedes: [_VISIBLE] 
        }, 
    
        "SUBMENU_ALIGNMENT": { 
            key: "submenualignment", 
            value: ["tl","bl"]
        },
    
        "AUTO_SUBMENU_DISPLAY": { 
            key: _AUTO_SUBMENU_DISPLAY, 
            value: false, 
            validator: Lang.isBoolean,
            suppressEvent: true
        }
    
    };



Lang.extend(MenuBar, YAHOO.widget.Menu, {

/**
* @method init
* @description The MenuBar class's initialization method. This method is 
* automatically called by the constructor, and sets up all DOM references for 
* pre-existing markup, and creates required markup if it is not already present.
* @param {String} p_oElement String specifying the id attribute of the 
* <code>&#60;div&#62;</code> element of the menu bar.
* @param {String} p_oElement String specifying the id attribute of the 
* <code>&#60;select&#62;</code> element to be used as the data source for the 
* menu bar.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-22445964">HTMLDivElement</a>} p_oElement Object specifying 
* the <code>&#60;div&#62;</code> element of the menu bar.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-94282980">HTMLSelectElement</a>} p_oElement Object 
* specifying the <code>&#60;select&#62;</code> element to be used as the data 
* source for the menu bar.
* @param {Object} p_oConfig Optional. Object literal specifying the 
* configuration for the menu bar. See configuration class documentation for
* more details.
*/
init: function(p_oElement, p_oConfig) {

    if(!this.ITEM_TYPE) {

        this.ITEM_TYPE = YAHOO.widget.MenuBarItem;

    }


    // Call the init of the superclass (YAHOO.widget.Menu)

    MenuBar.superclass.init.call(this, p_oElement);


    this.beforeInitEvent.fire(MenuBar);


    if(p_oConfig) {

        this.cfg.applyConfig(p_oConfig, true);

    }

    this.initEvent.fire(MenuBar);

},



// Constants


/**
* @property CSS_CLASS_NAME
* @description String representing the CSS class(es) to be applied to the menu 
* bar's <code>&#60;div&#62;</code> element.
* @default "yuimenubar"
* @final
* @type String
*/
CSS_CLASS_NAME: "yuimenubar",



// Protected event handlers


/**
* @method _onKeyDown
* @description "keydown" Custom Event handler for the menu bar.
* @private
* @param {String} p_sType String representing the name of the event that 
* was fired.
* @param {Array} p_aArgs Array of arguments sent when the event was fired.
* @param {YAHOO.widget.MenuBar} p_oMenuBar Object representing the menu bar 
* that fired the event.
*/
_onKeyDown: function(p_sType, p_aArgs, p_oMenuBar) {

    var oEvent = p_aArgs[0],
        oItem = p_aArgs[1],
        oSubmenu,
        oItemCfg,
        oNextItem;


    if(oItem && !oItem.cfg.getProperty(_DISABLED)) {

        oItemCfg = oItem.cfg;

        switch(oEvent.keyCode) {
    
            case 37:    // Left arrow
            case 39:    // Right arrow
    
                if(oItem == this.activeItem && !oItemCfg.getProperty(_SELECTED)) {
    
                    oItemCfg.setProperty(_SELECTED, true);
    
                }
                else {
    
                    oNextItem = (oEvent.keyCode == 37) ? 
                        oItem.getPreviousEnabledSibling() : 
                        oItem.getNextEnabledSibling();
            
                    if(oNextItem) {
    
                        this.clearActiveItem();
    
                        oNextItem.cfg.setProperty(_SELECTED, true);
    
    
                        if(this.cfg.getProperty(_AUTO_SUBMENU_DISPLAY)) {
                        
                            oSubmenu = oNextItem.cfg.getProperty(_SUBMENU);
                            
                            if(oSubmenu) {
                        
                                oSubmenu.show();
                            
                            }
                
                        }           
    
                        oNextItem.focus();
    
                    }
    
                }
    
                Event.preventDefault(oEvent);
    
            break;
    
            case 40:    // Down arrow
    
                if(this.activeItem != oItem) {
    
                    this.clearActiveItem();
    
                    oItemCfg.setProperty(_SELECTED, true);
                    oItem.focus();
                
                }
    
                oSubmenu = oItemCfg.getProperty(_SUBMENU);
    
                if(oSubmenu) {
    
                    if(oSubmenu.cfg.getProperty(_VISIBLE)) {
    
                        oSubmenu.setInitialSelection();
                        oSubmenu.setInitialFocus();
                    
                    }
                    else {
    
                        oSubmenu.show();
                    
                    }
    
                }
    
                Event.preventDefault(oEvent);
    
            break;
    
        }

    }


    if(oEvent.keyCode == 27 && this.activeItem) { // Esc key

        oSubmenu = this.activeItem.cfg.getProperty(_SUBMENU);

        if(oSubmenu && oSubmenu.cfg.getProperty(_VISIBLE)) {
        
            oSubmenu.hide();
            this.activeItem.focus();
        
        }
        else {

            this.activeItem.cfg.setProperty(_SELECTED, false);
            this.activeItem.blur();
    
        }

        Event.preventDefault(oEvent);
    
    }

},


/**
* @method _onClick
* @description "click" event handler for the menu bar.
* @protected
* @param {String} p_sType String representing the name of the event that 
* was fired.
* @param {Array} p_aArgs Array of arguments sent when the event was fired.
* @param {YAHOO.widget.MenuBar} p_oMenuBar Object representing the menu bar 
* that fired the event.
*/
_onClick: function(p_sType, p_aArgs, p_oMenuBar) {

    MenuBar.superclass._onClick.call(this, p_sType, p_aArgs, p_oMenuBar);

    var oItem = p_aArgs[1],
        oEvent,
        oTarget,
        oActiveItem,
        oConfig,
        oSubmenu;
    

    if(oItem && !oItem.cfg.getProperty(_DISABLED)) {

        oEvent = p_aArgs[0];
        oTarget = Event.getTarget(oEvent);
        oActiveItem = this.activeItem;
        oConfig = this.cfg;


        // Hide any other submenus that might be visible
    
        if(oActiveItem && oActiveItem != oItem) {
    
            this.clearActiveItem();
    
        }

    
        oItem.cfg.setProperty(_SELECTED, true);
    

        // Show the submenu for the item
    
        oSubmenu = oItem.cfg.getProperty(_SUBMENU);


        if(oSubmenu) {
        
            if(oSubmenu.cfg.getProperty(_VISIBLE)) {
            
                oSubmenu.hide();
            
            }
            else {
            
                oSubmenu.show();                    
            
            }
        
        }
    
    }

},



// Public methods


/**
* @method toString
* @description Returns a string representing the menu bar.
* @return {String}
*/
toString: function() {

    var sReturnVal = _MENUBAR,
        sId = this.id;

    if(sId) {

        sReturnVal += (_SPACE + sId);
    
    }

    return sReturnVal;

},


/**
* @description Initializes the class's configurable properties which can be
* changed using the menu bar's Config object ("cfg").
* @method initDefaultConfig
*/
initDefaultConfig: function() {

    MenuBar.superclass.initDefaultConfig.call(this);

    var oConfig = this.cfg;

	// Add configuration properties


    /*
        Set the default value for the "position" configuration property
        to "static" by re-adding the property.
    */


    /**
    * @config position
    * @description String indicating how a menu bar should be positioned on the 
    * screen.  Possible values are "static" and "dynamic."  Static menu bars 
    * are visible by default and reside in the normal flow of the document 
    * (CSS position: static).  Dynamic menu bars are hidden by default, reside
    * out of the normal flow of the document (CSS position: absolute), and can 
    * overlay other elements on the screen.
    * @default static
    * @type String
    */
    oConfig.addProperty(
        DEFAULT_CONFIG.POSITION.key, 
        {
            handler: this.configPosition, 
            value: DEFAULT_CONFIG.POSITION.value, 
            validator: DEFAULT_CONFIG.POSITION.validator,
            supercedes: DEFAULT_CONFIG.POSITION.supercedes
        }
    );


    /*
        Set the default value for the "submenualignment" configuration property
        to ["tl","bl"] by re-adding the property.
    */

    /**
    * @config submenualignment
    * @description Array defining how submenus should be aligned to their 
    * parent menu bar item. The format is: [itemCorner, submenuCorner].
    * @default ["tl","bl"]
    * @type Array
    */
    oConfig.addProperty(
        DEFAULT_CONFIG.SUBMENU_ALIGNMENT.key, 
        {
            value: DEFAULT_CONFIG.SUBMENU_ALIGNMENT.value,
            suppressEvent: DEFAULT_CONFIG.SUBMENU_ALIGNMENT.suppressEvent
        }
    );


    /*
        Change the default value for the "autosubmenudisplay" configuration 
        property to "false" by re-adding the property.
    */

    /**
    * @config autosubmenudisplay
    * @description Boolean indicating if submenus are automatically made 
    * visible when the user mouses over the menu bar's items.
    * @default false
    * @type Boolean
    */
	oConfig.addProperty(
	   DEFAULT_CONFIG.AUTO_SUBMENU_DISPLAY.key, 
	   {
	       value: DEFAULT_CONFIG.AUTO_SUBMENU_DISPLAY.value, 
	       validator: DEFAULT_CONFIG.AUTO_SUBMENU_DISPLAY.validator,
	       suppressEvent: DEFAULT_CONFIG.AUTO_SUBMENU_DISPLAY.suppressEvent
       } 
    );

}
 
}); // END YAHOO.lang.extend

}());