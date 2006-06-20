


/**
* @class Creates a list of options which vary depending on the context in 
* which the menu is invoked.
* @constructor
* @extends YAHOO.widget.Menu
* @base YAHOO.widget.Menu
* @param {String or HTMLElement} p_oElement String id or HTMLElement 
* (either HTMLSelectElement or HTMLDivElement) of the source HTMLElement node.
* @param {Object} p_oUserConfig Optional. The configuration object literal 
* containing the configuration for a ContextMenu instance. See 
* configuration class documentation for more details.
*/
YAHOO.widget.ContextMenu = function(p_oElement, p_oUserConfig) {

    YAHOO.widget.ContextMenu.superclass.constructor.call(
            this, 
            p_oElement,
            p_oUserConfig
        );

};

YAHOO.extend(YAHOO.widget.ContextMenu, YAHOO.widget.Menu);


/**
* The ContextMenu class's initialization method. This method is automatically  
* called by the constructor, and sets up all DOM references for pre-existing 
* markup, and creates required markup if it is not already present.
* @param {String or HTMLElement} p_oElement String id or HTMLElement 
* (either HTMLSelectElement or HTMLDivElement) of the source HTMLElement node.
* @param {Object} p_oUserConfig Optional. The configuration object literal 
* containing the configuration for a ContextMenu instance. See 
* configuration class documentation for more details.
*/
YAHOO.widget.ContextMenu.prototype.init = function(p_oElement, p_oUserConfig) {

    if(!this.ITEM_TYPE) {

        this.ITEM_TYPE = YAHOO.widget.ContextMenuItem;

    }


    // Call the init of the superclass (YAHOO.widget.Menu)

    YAHOO.widget.ContextMenu.superclass.init.call(this, p_oElement);


    this.beforeInitEvent.fire(YAHOO.widget.ContextMenu);


    if(p_oUserConfig) {

        this.cfg.applyConfig(p_oUserConfig, true);

    }
    
    
    this.initEvent.fire(YAHOO.widget.ContextMenu);


};


// Private event handlers

/**
* "mousedown" event handler for the document object.
* @private
* @param {Event} p_oEvent Event object passed back by the 
* event utility (YAHOO.util.Event).
* @param {YAHOO.widget.ContextMenu} p_oMenu The ContextMenu instance 
* handling the event.
*/
YAHOO.widget.ContextMenu.prototype._onDocumentMouseDown = 

    function(p_oEvent, p_oMenu) {
    
        var oTarget = this._oEventUtil.getTarget(p_oEvent);
    
        if(
            oTarget != this._oTargetElement || 
            !this._oDom.isAncestor(this._oTargetElement, oTarget)
        ) {
    
            this.hide();    
        
        }
    
    };


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
        
            this._oEventUtil.stopEvent(p_oEvent);
    
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
    
        if(p_oEvent.type == "mousedown") {
        
            if(!p_oEvent.ctrlKey) {
    
                return;
            
            }
        
            this._oEventUtil.stopEvent(p_oEvent);
    
        }
    
    
        this.contextEventTarget = this._oEventUtil.getTarget(p_oEvent);
    
    
        // Position and display the context menu
    
        var nX = this._oEventUtil.getPageX(p_oEvent),
            nY = this._oEventUtil.getPageY(p_oEvent);
    
    
        this.cfg.applyConfig( { x:nX, y:nY, visible:true } );
        this.cfg.fireQueue();
    
    
        // Prevent the browser's default context menu from appearing
    
        this._oEventUtil.preventDefault(p_oEvent);
    
    };


// Public properties

/**
* Returns the HTMLElement node that was the target of the "contextmenu" 
* DOM event.
* @type HTMLElement
*/
YAHOO.widget.ContextMenu.prototype.contextEventTarget = null;


// Public methods

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
* @param {Array} p_aArguments Collection of arguments sent when the 
* event was fired.
* @param {YAHOO.widget.ContextMenu} p_oMenu The ContextMenu that instance fired
* the event.
*/
YAHOO.widget.ContextMenu.prototype.configTrigger = 

    function(p_sType, p_aArguments, p_oMenu) {
    
        var oTrigger = p_aArguments[0];
    
        if(oTrigger) {
    
            /*
                Listen for the "mousedown" event in Opera b/c it does not 
                support the "contextmenu" event
            */ 
      
            var bOpera = (this.browser == "opera");
    
            var sContextEvent = bOpera ? "mousedown" : "contextmenu";
    
            this._oEventUtil.addListener(
                oTrigger, 
                sContextEvent, 
                this._onTriggerContextMenu,
                this,
                true
            );
    
    
            /*
                Assign a "click" event handler to the trigger element(s) for
                Opera to prevent default browser behaviors.
            */
    
            if(bOpera) {
            
                this._oEventUtil.addListener(
                    oTrigger, 
                    "click", 
                    this._onTriggerClick,
                    this,
                    true
                );
    
            }
    
    
            // Assign a "mousedown" event handler to the document
        
            this._oEventUtil.addListener(
                document, 
                "mousedown", 
                this._onDocumentMouseDown,
                this,
                true
            );        
    
        }
        
    };