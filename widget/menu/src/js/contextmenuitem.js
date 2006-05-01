/*
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
* @class Creates an item for a context menu instance.
* @constructor
* @extends YAHOO.widget.MenuItem
* @base YAHOO.widget.MenuItem
* @param {String or HTMLElement} p_oObject String or HTMLElement 
* (either HTMLLIElement, HTMLOptGroupElement or HTMLOptionElement) of the 
* source HTMLElement node.
* @param {Object} p_oUserConfig The configuration object literal containing 
* the configuration for a ContextMenuItem instance. See the configuration 
* class documentation for more details.
*/
YAHOO.widget.ContextMenuItem = function(p_oObject, p_oUserConfig) {

    if(p_oObject) {

        YAHOO.widget.ContextMenuItem.superclass.constructor.call(
            this, 
            p_oObject, 
            p_oUserConfig
        );

    }

};

YAHOO.widget.ContextMenuItem.prototype = new YAHOO.widget.MenuItem();

YAHOO.widget.ContextMenuItem.prototype.constructor = 

    YAHOO.widget.ContextMenuItem;

YAHOO.widget.ContextMenuItem.superclass = YAHOO.widget.MenuItem.prototype;


/**
* The ContextMenuItem class's initialization method. This method is
* automatically called by the constructor, and sets up all DOM references for
* pre-existing markup, and creates required markup if it is not
* already present.
* @param {String or HTMLElement} p_oObject String or HTMLElement 
* (either HTMLLIElement, HTMLOptGroupElement or HTMLOptionElement) of the 
* source HTMLElement node.
* @param {Object} p_oUserConfig The configuration object literal containing 
* the configuration for a ContextMenuItem instance. See the configuration 
* class documentation for more details.
*/
YAHOO.widget.ContextMenuItem.prototype.init = 

    function(p_oObject, p_oUserConfig) {
    
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
    
    
        if(p_oUserConfig) {
    
            this.cfg.applyConfig(p_oUserConfig, true);
    
        }
    
    
        this.cfg.fireQueue();
    
    };