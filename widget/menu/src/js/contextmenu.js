


/**
* @class Creates a list of options which vary depending on the context in 
* which the menu is invoked.
* @constructor
* @extends YAHOO.widget.Menu
* @base YAHOO.widget.Menu
* @param {String} p_oElement The HTMLElement ID representing the source node 
* (either HTMLSelectElement or HTMLDivElement) of the ContextMenu <em>OR</em>
* @param {Element} p_oElement The HTMLElement representing the ContextMenu to 
* be created
* @param {Object} p_oConfig Optional. The configuration object literal 
* containing the configuration for a ContextMenu instance. See 
* configuration class documentation for more details.
*/
YAHOO.widget.ContextMenu = function(p_oElement, p_oConfig) {

    YAHOO.widget.ContextMenu.superclass.constructor.call(
            this, 
            p_oElement,
            p_oConfig
        );

};

YAHOO.extend(YAHOO.widget.ContextMenu, YAHOO.widget.Menu);


// Private properties


/**
* Array of ContextMenu instances
* @private
* @type Array
*/
YAHOO.widget.ContextMenu._aMenus = [];


/**
* The id(s) or element(s) that trigger the display of the ContextMenu instance
* @private
* @type String/Array/HTMLElement
*/
YAHOO.widget.ContextMenu.prototype._oTrigger = null;


// Public properties

/**
* Returns the HTMLElement node that was the target of the "contextmenu" 
* DOM event.
* @type HTMLElement
*/
YAHOO.widget.ContextMenu.prototype.contextEventTarget = null;


/**
* The ContextMenu class's initialization method. This method is automatically  
* called by the constructor, and sets up all DOM references for pre-existing 
* markup, and creates required markup if it is not already present.
* @param {String} p_oElement The HTMLElement ID representing the source node 
* (either HTMLSelectElement or HTMLDivElement) of the ContextMenu <em>OR</em>
* @param {Element} p_oElement The HTMLElement representing the ContextMenu to 
* be created
* @param {Object} p_oConfig Optional. The configuration object literal 
* containing the configuration for a ContextMenu instance. See 
* configuration class documentation for more details.
*/
YAHOO.widget.ContextMenu.prototype.init = function(p_oElement, p_oConfig) {

    if(!this.ITEM_TYPE) {

        this.ITEM_TYPE = YAHOO.widget.ContextMenuItem;

    }


    // Call the init of the superclass (YAHOO.widget.Menu)

    YAHOO.widget.ContextMenu.superclass.init.call(this, p_oElement);


    this.beforeInitEvent.fire(YAHOO.widget.ContextMenu);


    if(p_oConfig) {

        this.cfg.applyConfig(p_oConfig, true);

    }
    
    
    this.initEvent.fire(YAHOO.widget.ContextMenu);


    var aMenus = YAHOO.widget.ContextMenu._aMenus;
    
    aMenus[aMenus.length] = this;
    
};


// Private event handlers




/**
* "click" event handler for the HTMLElement node that triggered the event. 
* Used to cancel default behaviors in Opera.
* @private
* @param {Event} p_oEvent Event object passed back by the 
* event utility (YAHOO.util.Event).
* @param {YAHOO.widget.ContextMenu} p_oMenu The ContextMenu instance 
* handling the event.
*/
YAHOO.widget.ContextMenu.prototype._onTriggerClick = 

    function(p_oEvent, p_oMenu) {

        if(p_oEvent.ctrlKey) {
        
            YAHOO.util.Event.stopEvent(p_oEvent);
    
        }
        
    };


/**
* "contextmenu" event handler ("mousedown" for Opera) for the HTMLElement 
* node that triggered the event.
* @private
* @param {Event} p_oEvent Event object passed back by the 
* event utility (YAHOO.util.Event).
* @param {YAHOO.widget.ContextMenu} p_oMenu The ContextMenu instance 
* handling the event.
*/
YAHOO.widget.ContextMenu.prototype._onTriggerContextMenu = 

    function(p_oEvent, p_oMenu) {

        var Event = YAHOO.util.Event;
        var oConfig = this.cfg;


        // Hide any other ContextMenu instances that might be visible

        var aMenus = YAHOO.widget.ContextMenu._aMenus;
        var i = aMenus.length - 1;

        do {

             aMenus[i].hide();
        
        }
        while(i--);
            

        if(p_oEvent.type == "mousedown" && !p_oEvent.ctrlKey) {
    
            return;
    
        }
    
        this.contextEventTarget = Event.getTarget(p_oEvent);
    
    
        // Position and display the context menu
    
        var nX = Event.getPageX(p_oEvent);
        var nY = Event.getPageY(p_oEvent);
    
    
        oConfig.applyConfig( { xy:[nX, nY], visible:true } );
        oConfig.fireQueue();
    
    
        /*
             Prevent the browser's default context menu from appearing and 
             stop the propagation of the "contextmenu" event so that 
             other ContextMenu instances are no displayed.
        */
    
        Event.stopEvent(p_oEvent);
    
    };


// Private methods

/**
* Removes all of the DOM event handlers from the menu's trigger(s)
* @private
*/
YAHOO.widget.ContextMenu.prototype._removeEventHandlers = function() {

    var Event = YAHOO.util.Event;
    var oTrigger = this._oTrigger;
    var bOpera = (this.browser == "opera");


    // Remove the event handlers from the trigger(s)

    Event.removeListener(
        oTrigger, 
        (bOpera ? "mousedown" : "contextmenu"), 
        this._onTriggerContextMenu
    );    
    
    if(bOpera) {
    
        Event.removeListener(oTrigger, "click", this._onTriggerClick);

    }

};


// Public methods

/**
* Returns a string representing the specified object.
*/
YAHOO.widget.ContextMenu.prototype.toString = function() {

    return ("ContextMenu " + this.id);

};


/**
* Initializes the class's configurable properties which can be changed using 
* a ContextMenu instance's Config object (cfg).
*/
YAHOO.widget.ContextMenu.prototype.initDefaultConfig = function() {

    YAHOO.widget.ContextMenu.superclass.initDefaultConfig.call(this);


	// Add a configuration property

    this.cfg.addProperty("trigger", { handler: this.configTrigger });

};


// Event handlers for configuration properties

/**
* Event handler for when the "trigger" configuration property of
* a MenuItem instance. 
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the 
* event was fired.
* @param {YAHOO.widget.ContextMenu} p_oMenu The ContextMenu that instance fired
* the event.
*/
YAHOO.widget.ContextMenu.prototype.configTrigger = 

    function(p_sType, p_aArgs, p_oMenu) {
    
        var Event = YAHOO.util.Event;
        var oTrigger = p_aArgs[0];
    
        if(oTrigger) {
    
            /*
                If there is a current "trigger" - remove the event handlers 
                from that element(s) before assigning new ones
            */

            if(this._oTrigger) {
            
                this._removeEventHandlers();

            }

            this._oTrigger = oTrigger;


            /*
                Listen for the "mousedown" event in Opera b/c it does not 
                support the "contextmenu" event
            */ 
      
            var bOpera = (this.browser == "opera");
    
            Event.addListener(
                oTrigger, 
                (bOpera ? "mousedown" : "contextmenu"), 
                this._onTriggerContextMenu,
                this,
                true
            );
    
    
            /*
                Assign a "click" event handler to the trigger element(s) for
                Opera to prevent default browser behaviors.
            */
    
            if(bOpera) {
            
                Event.addListener(
                    oTrigger, 
                    "click", 
                    this._onTriggerClick,
                    this,
                    true
                );
    
            }
    
        }
        else {
        
            this._removeEventHandlers();
        
        }
        
    };


// Public methods

/**
* Removes the MenuModule instance's element from the DOM and sets all child 
* elements to null.
*/
YAHOO.widget.ContextMenu.prototype.destroy = function() {

    // Remove the menu from the array of known ContextMenu instances

    var aMenus = YAHOO.widget.ContextMenu._aMenus;
    var i = aMenus.length - 1;

    do {

        if(aMenus[i] == this) {

            aMenus.splice(i, 1);
        
        }

    }
    while(i--);


    // Remove the DOM event handlers from the current trigger(s)

    this._removeEventHandlers();
    

    // Continue with the superclass implementation of this method

    YAHOO.widget.ContextMenu.superclass.destroy.call(this);

};    