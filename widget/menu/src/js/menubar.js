


/**
* @class Horizontal collection of items, each of which can contain a submenu.
* Extends YAHOO.widget.MenuModule to provide a set of default mouse and 
* key event behaviors.
* @constructor
* @extends YAHOO.widget.MenuModule
* @base YAHOO.widget.MenuModule
* @param {String or HTMLElement} p_oElement String id or HTMLElement 
* (either HTMLSelectElement or HTMLDivElement) of the source HTMLElement node.
* @param {Object} p_oUserConfig Optional. The configuration object literal 
* containing the configuration for a MenuBar instance. See 
* configuration class documentation for more details.
*/
YAHOO.widget.MenuBar = function(p_oElement, p_oUserConfig) {

    YAHOO.widget.MenuBar.superclass.constructor.call(
            this, 
            p_oElement,
            p_oUserConfig
        );

};

YAHOO.extend(YAHOO.widget.MenuBar, YAHOO.widget.MenuModule);


/**
* The MenuBar class's initialization method. This method is automatically 
* called by the constructor, and sets up all DOM references for pre-existing 
* markup, and creates required markup if it is not already present.
* @param {String or HTMLElement} p_oElement String id or HTMLElement 
* (either HTMLSelectElement or HTMLDivElement) of the source HTMLElement node.
* @param {Object} p_oUserConfig Optional. The configuration object literal 
* containing the configuration for a MenuBar instance. See 
* configuration class documentation for more details.
*/
YAHOO.widget.MenuBar.prototype.init = function(p_oElement, p_oUserConfig) {

    if(!this.ITEM_TYPE) {

        this.ITEM_TYPE = YAHOO.widget.MenuBarItem;

    }


    // Call the init of the superclass (YAHOO.widget.MenuModule)

    YAHOO.widget.MenuBar.superclass.init.call(this, p_oElement);


    this.beforeInitEvent.fire(YAHOO.widget.MenuBar);


    /*
        Set the default value for the "position" configuration property
        to "static" 
    */
    if(!p_oUserConfig || (p_oUserConfig && !p_oUserConfig.position)) {

        this.cfg.queueProperty("position", "static");

    }

    /*
        Set the default value for the "submenualignment" configuration property
        to "tl" and "bl" 
    */
    if(!p_oUserConfig || (p_oUserConfig && !p_oUserConfig.submenualignment)) {

        this.cfg.queueProperty("submenualignment", ["tl","bl"]);

    }


    if(p_oUserConfig) {

        this.cfg.applyConfig(p_oUserConfig, true);

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