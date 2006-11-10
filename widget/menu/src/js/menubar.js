


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
* @class Menubar
* @constructor
* @extends YAHOO.widget.Menu
* @namespace YAHOO.widget
*/
YAHOO.widget.MenuBar = function(p_oElement, p_oConfig) {

    YAHOO.widget.MenuBar.superclass.constructor.call(
            this, 
            p_oElement,
            p_oConfig
        );

};

YAHOO.extend(YAHOO.widget.MenuBar, YAHOO.widget.Menu, {

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

    YAHOO.widget.MenuBar.superclass.init.call(this, p_oElement);


    this.beforeInitEvent.fire(YAHOO.widget.MenuBar);


    if(p_oConfig) {

        this.cfg.applyConfig(p_oConfig, true);

    }

    this.initEvent.fire(YAHOO.widget.MenuBar);

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

    var Event = YAHOO.util.Event;
    var oEvent = p_aArgs[0];
    var oItem = p_aArgs[1];
    var oItemCfg = oItem.cfg;
    var oSubmenu;


    switch(oEvent.keyCode) {

        case 27:    // Esc key

            if(this.cfg.getProperty("position") == "dynamic") {
            
                this.hide();
    
                if(this.parent) {
    
                    this.parent.focus();
                
                }
    
            }
            else if(this.activeItem) {
    
                oSubmenu = this.activeItem.cfg.getProperty("submenu");
    
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
        
        break;

        case 37:    // Left arrow
        case 39:    // Right arrow

            if(
                oItem == this.activeItem && 
                !oItemCfg.getProperty("selected")
            ) {

                oItemCfg.setProperty("selected", true);

            }
            else {

                var oNextItem = (oEvent.keyCode == 37) ? 
                        oItem.getPreviousEnabledSibling() : 
                        oItem.getNextEnabledSibling();
        
                if(oNextItem) {

                    this.clearActiveItem();

                    oNextItem.cfg.setProperty("selected", true);


                    if(this.cfg.getProperty("autosubmenudisplay")) {
                    
                        oSubmenu = oNextItem.cfg.getProperty("submenu");
                        
                        if(oSubmenu) {
                    
                            oSubmenu.show();
                            oSubmenu.activeItem.blur();
                            oSubmenu.activeItem = null;
                        
                        }
            
                    }           

                    oNextItem.focus();

                }

            }

            Event.preventDefault(oEvent);

        break;

        case 40:    // Down arrow

            this.clearActiveItem();

            oItemCfg.setProperty("selected", true);
            oItem.focus();

            oSubmenu = oItemCfg.getProperty("submenu");

            if(oSubmenu) {

                oSubmenu.show();
                oSubmenu.setInitialSelection();

            }

            Event.preventDefault(oEvent);

        break;

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

    YAHOO.widget.MenuBar.superclass._onClick.call(
        this, 
        p_sType, 
        p_aArgs, 
        p_oMenuBar
    );


    var oItem = p_aArgs[1];
    
    if(oItem) {

        var Event = YAHOO.util.Event;
        var Dom = YAHOO.util.Dom;

        var oEvent = p_aArgs[0];
        var oTarget = Event.getTarget(oEvent);

        var oActiveItem = this.activeItem;
        var oConfig = this.cfg;


        // Hide any other submenus that might be visible
    
        if(oActiveItem && oActiveItem != oItem) {
    
            this.clearActiveItem();
    
        }
    
    
        // Select and focus the current item
    
        oItem.cfg.setProperty("selected", true);
        oItem.focus();
    

        // Show the submenu for the item
    
        var oSubmenu = oItem.cfg.getProperty("submenu");


        if(oSubmenu && oTarget != oItem.submenuIndicator) {
        
            if(oSubmenu.cfg.getProperty("visible")) {
            
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

    return ("MenuBar " + this.id);

},


/**
* @description Initializes the class's configurable properties which can be
* changed using the menu bar's Config object ("cfg").
* @method initDefaultConfig
*/
initDefaultConfig: function() {

    YAHOO.widget.MenuBar.superclass.initDefaultConfig.call(this);

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
        "position", 
        {
            value: "static", 
            handler: this.configPosition, 
            validator: this._checkPosition,
            supercedes: ["visible"]
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
    oConfig.addProperty("submenualignment", { value: ["tl","bl"] } );


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
	   "autosubmenudisplay", 
	   { value: false, validator: oConfig.checkBoolean } 
    );

}
 
}); // END YAHOO.extend