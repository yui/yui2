/*
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

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

    this.mouseOverEvent.subscribe(this._onMouseOver, this, true);
    this.keyDownEvent.subscribe(this._onKeyDown, this, true);


    if(p_oUserConfig) {

        this.cfg.applyConfig(p_oUserConfig, true);

    }
    
    this.initEvent.fire(YAHOO.widget.Menu);

};


// Private event handlers

/**
* "mouseover" Custom Event handler for a Menu instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArguments Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.Menu} p_oMenu The Menu instance that fired the event.
*/
YAHOO.widget.Menu.prototype._onMouseOver = 

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
YAHOO.widget.Menu.prototype._onKeyDown = 

    function(p_sType, p_aArguments, p_oMenu) {
    
        if(this.cfg.getProperty("position") == "dynamic") {
    
            var oEvent = p_aArguments[0];
        
            if(oEvent.keyCode == 27) { // Esc key
        
                this.hide();
        
                // Set focus to the parent MenuItem if one exists
        
                if(this.parent) {
        
                    this.parent.focus();
                    this.parent.cfg.setProperty("selected", true);
        
                }
            
            }
        
        }
    
    };