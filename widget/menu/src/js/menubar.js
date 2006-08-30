


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