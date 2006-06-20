


/**
* @class Extends YAHOO.widget.MenuModule to provide a set of default mouse and 
* key event behaviors.
* @constructor
* @extends YAHOO.widget.MenuModule
* @base YAHOO.widget.MenuModule
* @param {String or HTMLElement} p_oElement String id or HTMLElement 
* (either HTMLSelectElement or HTMLDivElement) of the source HTMLElement node.
* @param {Object} p_oUserConfig Optional. The configuration object literal 
* containing the configuration for a Menu instance. See 
* configuration class documentation for more details.
*/
YAHOO.widget.Menu = function(p_oElement, p_oUserConfig) {

    if(arguments.length > 0) {

        YAHOO.widget.Menu.superclass.constructor.call(
                this, 
                p_oElement,
                p_oUserConfig
            );

    }

};

YAHOO.widget.Menu.prototype = new YAHOO.widget.MenuModule();
YAHOO.widget.Menu.prototype.constructor = YAHOO.widget.Menu;
YAHOO.widget.Menu.superclass = YAHOO.widget.MenuModule.prototype;


/**
* The Menu class's initialization method. This method is automatically 
* called by the constructor, and sets up all DOM references for pre-existing 
* markup, and creates required markup if it is not already present.
* @param {String or HTMLElement} p_oElement String id or HTMLElement 
* (either HTMLSelectElement or HTMLDivElement) of the source HTMLElement node.
* @param {Object} p_oUserConfig Optional. The configuration object literal 
* containing the configuration for a Menu instance. See 
* configuration class documentation for more details.
*/
YAHOO.widget.Menu.prototype.init = function(p_oElement, p_oUserConfig) {

    if(!this.ITEM_TYPE) {

        this.ITEM_TYPE = YAHOO.widget.MenuItem;

    }


    // Call the init of the superclass (YAHOO.widget.Menu)

    YAHOO.widget.Menu.superclass.init.call(this, p_oElement);


    this.beforeInitEvent.fire(YAHOO.widget.Menu);


    // Add event handlers

    this.showEvent.subscribe(this._onMenuShow, this, true);
    this.mouseOverEvent.subscribe(this._onMenuMouseOver, this, true);
    this.keyDownEvent.subscribe(this._onMenuKeyDown, this, true);


    if(p_oUserConfig) {

        this.cfg.applyConfig(p_oUserConfig, true);

    }
    
    this.initEvent.fire(YAHOO.widget.Menu);

};


// Private event handlers

/**
* "show" Custom Event handler for a menu.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.Menu} p_oMenu The menu that fired the event.
*/
YAHOO.widget.Menu.prototype._onMenuShow = 

    function(p_sType, p_aArguments, p_oMenu) {

        if(this.parent && this.parent.parent instanceof YAHOO.widget.Menu) {

            var aAlignment = 
                    this.parent.parent.cfg.getProperty("submenualignment");
    
            this.cfg.setProperty(
                "submenualignment", 
                [ aAlignment[0], aAlignment[1] ]
            );
        
        }

    };


/**
* "mouseover" Custom Event handler for a Menu instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.Menu} p_oMenu The Menu instance that fired the event.
*/
YAHOO.widget.Menu.prototype._onMenuMouseOver = 

    function(p_sType, p_aArguments, p_oMenu) {
    
        /*
            If the menu is a submenu, then select the menu's parent
            MenuItem instance
        */
    
        if(this.parent) {
    
            this.parent.cfg.setProperty("selected", true);
    
        }
    
    };


/**
* "mouseover" Custom Event handler for a Menu instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.Menu} p_oMenu The Menu instance that fired the event.
*/
YAHOO.widget.Menu.prototype._onMenuKeyDown = 

    function(p_sType, p_aArguments, p_oMenu) {
    
        if(this.cfg.getProperty("position") == "dynamic") {
    
            var oEvent = p_aArguments[0];
        
            if(oEvent.keyCode == 27) { // Esc key
        
                this.hide();
        
                // Set focus to the parent MenuItem if one exists
        
                if(this.parent) {
        
                    this.parent.focus();

                    if(this.parent.parent instanceof YAHOO.widget.Menu) {

                        this.parent.cfg.setProperty("selected", true);
        
                    }
        
                }
            
            }
        
        }
    
    };
    

// Public event handlers

/**
* Event handler fired when the resize monitor element is resized.
*/
YAHOO.widget.Menu.prototype.onDomResize = function(e, obj) {

    if(!this._handleResize) {
    
        this._handleResize = true;
        return;
    
    }

    this.logger.log("Browser font sized changed.");

    if(this.cfg.getProperty("position") == "dynamic") {

        this.cfg.setProperty("width", (this._getOffsetWidth() + "px"));
        
        if(this.parent && this.cfg.getProperty("visible")) {

            var me = this;

            function align() {

                me.align();
            
            }

            window.setTimeout(align, 0);
            
        }

    }

    YAHOO.widget.Menu.superclass.onDomResize.call(this, e, obj);

};    