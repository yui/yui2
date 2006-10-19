


/**
* @class Horizontal collection of items, each of which can contain a submenu.
* Extends YAHOO.widget.MenuModule to provide a set of default mouse and 
* key event behaviors.
* @constructor
* @extends YAHOO.widget.MenuModule
* @base YAHOO.widget.MenuModule
* @param {String} p_oElement The HTMLElement ID representing the source node 
* (either HTMLSelectElement or HTMLDivElement) of the MenuBar <em>OR</em>
* @param {Element} p_oElement The HTMLElement representing the MenuBar to
* be created
* @param {Object} p_oConfig Optional. The configuration object literal 
* containing the configuration for a MenuBar instance. See 
* configuration class documentation for more details.
*/
YAHOO.widget.MenuBar = function(p_oElement, p_oConfig) {

    YAHOO.widget.MenuBar.superclass.constructor.call(
            this, 
            p_oElement,
            p_oConfig
        );

};

YAHOO.extend(YAHOO.widget.MenuBar, YAHOO.widget.MenuModule);


/**
* The MenuBar class's initialization method. This method is automatically 
* called by the constructor, and sets up all DOM references for pre-existing 
* markup, and creates required markup if it is not already present.
* @param {String} p_oElement The HTMLElement ID representing the source node 
* (either HTMLSelectElement or HTMLDivElement) of the MenuBar <em>OR</em>
* @param {Element} p_oElement The HTMLElement representing the MenuBar to
* be created
* @param {Object} p_oConfig Optional. The configuration object literal 
* containing the configuration for a MenuBar instance. See 
* configuration class documentation for more details.
*/
YAHOO.widget.MenuBar.prototype.init = function(p_oElement, p_oConfig) {

    if(!this.ITEM_TYPE) {

        this.ITEM_TYPE = YAHOO.widget.MenuBarItem;

    }


    // Call the init of the superclass (YAHOO.widget.MenuModule)

    YAHOO.widget.MenuBar.superclass.init.call(this, p_oElement);


    this.beforeInitEvent.fire(YAHOO.widget.MenuBar);


    // Add event handlers to each "MenuBar" instance

    this.keyDownEvent.subscribe(this._onMenuBarKeyDown, this, true);
    this.clickEvent.subscribe(this._onMenuBarClick, this, true);


    var oConfig = this.cfg;

    /*
        Set the default value for the "position" configuration property
        to "static" 
    */
    if(!p_oConfig || (p_oConfig && !p_oConfig.position)) {

        oConfig.queueProperty("position", "static");

    }

    /*
        Set the default value for the "submenualignment" configuration property
        to "tl" and "bl" 
    */
    if(!p_oConfig || (p_oConfig && !p_oConfig.submenualignment)) {

        oConfig.queueProperty("submenualignment", ["tl","bl"]);

    }


    if(p_oConfig) {

        oConfig.applyConfig(p_oConfig, true);

    }
    
    this.initEvent.fire(YAHOO.widget.MenuBar);

};


// Constants

/**
* Constant representing the CSS class(es) to be applied to the root 
* HTMLDivElement of the MenuBar instance.
* @final
* @type String
*/
YAHOO.widget.MenuBar.prototype.CSS_CLASS_NAME = "yuimenubar";


/**
* Returns a string representing the specified object.
*/
YAHOO.widget.MenuBar.prototype.toString = function() {

    return ("MenuBar " + this.id);

};


// Private event handlers

/**
* "keydown" Custom Event handler for a MenuBar instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuBar} p_oMenuBar The MenuBar instance that 
* fired the event.
*/
YAHOO.widget.MenuBar.prototype._onMenuBarKeyDown =

    function(p_sType, p_aArgs, p_oMenuBar) {

        var Event = YAHOO.util.Event;
        var oEvent = p_aArgs[0];
        var oItem = p_aArgs[1];
        var oItemCfg = oItem.cfg;
        var oSubmenu;

    
        switch(oEvent.keyCode) {
    
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

    };


/**
* "click" Custom Event handler for a MenuBar instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuBar} p_oMenuBar The MenuBar instance that 
* fired the event.
*/
YAHOO.widget.MenuBar.prototype._onMenuBarClick =  

    function(p_sType, p_aArgs, p_oMenuBar) {

        var oItem = p_aArgs[1];
        
        if(oItem) {

            var Event = YAHOO.util.Event;
            var Dom = YAHOO.util.Dom;
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
    
            if(oSubmenu) {
        
                if(oSubmenu.cfg.getProperty("visible")) {
                
                    oSubmenu.hide();
                
                }
                else {
                
                    oSubmenu.show();                    
                
                }
        
            }
        
        }

    };  