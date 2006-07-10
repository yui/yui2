


/**
* @class The MenuItem class allows you to create and modify an item for a
* Menu instance.  MenuItem extends YAHOO.widget.MenuModuleItem to provide a 
* set of default mouse and key event behaviors.
* @constructor
* @extends YAHOO.widget.MenuModuleItem
* @base YAHOO.widget.MenuModuleItem
* @param {String or HTMLElement} p_oObject String or HTMLElement 
* (either HTMLLIElement, HTMLOptGroupElement or HTMLOptionElement) of the 
* source HTMLElement node.
* @param {Object} p_oConfig The configuration object literal containing 
* the configuration for a MenuItem instance. See the configuration 
* class documentation for more details.
*/
YAHOO.widget.MenuItem = function(p_oObject, p_oConfig) {

    YAHOO.widget.MenuItem.superclass.constructor.call(
        this, 
        p_oObject, 
        p_oConfig
    );

};

YAHOO.extend(YAHOO.widget.MenuItem, YAHOO.widget.MenuModuleItem);


/**
* The MenuItem class's initialization method. This method is automatically
* called by the constructor, and sets up all DOM references for
* pre-existing markup, and creates required markup if it is not
* already present.
* @param {String or HTMLElement} p_oObject String or HTMLElement 
* (either HTMLLIElement, HTMLOptGroupElement or HTMLOptionElement) of the 
* source HTMLElement node.
* @param {Object} p_oConfig The configuration object literal containing 
* the configuration for a MenuItem instance. See the configuration 
* class documentation for more details.
*/
YAHOO.widget.MenuItem.prototype.init = function(p_oObject, p_oConfig) {

    if(!this.SUBMENU_TYPE) {

        this.SUBMENU_TYPE = YAHOO.widget.Menu;

    }

    if(!this.SUBMENU_ITEM_TYPE) {

        this.SUBMENU_ITEM_TYPE = YAHOO.widget.MenuItem;

    }


    /* 
        Call the init of the superclass (YAHOO.widget.MenuModuleItem)
        Note: We don't pass the user config in here yet 
        because we only want it executed once, at the lowest 
        subclass level.
    */ 

    YAHOO.widget.MenuItem.superclass.init.call(this, p_oObject);  


    // Add event handlers to each "MenuItem" instance

    this.keyDownEvent.subscribe(this._onKeyDown, this, true);
    this.mouseOverEvent.subscribe(this._onMouseOver, this, true);
    this.mouseOutEvent.subscribe(this._onMouseOut, this, true);

    var oConfig = this.cfg;

    if(p_oConfig) {

        oConfig.applyConfig(p_oConfig, true);

    }

    oConfig.fireQueue();

};


// Constants

/**
* Constant representing the path to the image to be used for the checked state.
* @final
* @type String
*/
YAHOO.widget.MenuItem.prototype.CHECKED_IMAGE_PATH = 
    "nt/ic/ut/bsc/menuchk8_nrm_1.gif";

/**
* Constant representing the path to the image to be used for the selected 
* checked state.
* @final
* @type String
*/
YAHOO.widget.MenuItem.prototype.SELECTED_CHECKED_IMAGE_PATH = 
    "nt/ic/ut/bsc/menuchk8_hov_1.gif";

/**
* Constant representing the path to the image to be used for the disabled 
* checked state.
* @final
* @type String
*/
YAHOO.widget.MenuItem.prototype.DISABLED_CHECKED_IMAGE_PATH = 
    "nt/ic/ut/bsc/menuchk8_dim_1.gif";

/**
* Constant representing the alt text for the image to be used for the 
* checked image.
* @final
* @type String
*/
YAHOO.widget.MenuItem.prototype.CHECKED_IMAGE_ALT_TEXT = "Checked.";


/**
* Constant representing the alt text for the image to be used for the 
* checked image when the item is disabled.
* @final
* @type String
*/
YAHOO.widget.MenuItem.prototype.DISABLED_CHECKED_IMAGE_ALT_TEXT = 
    "Checked. (Item disabled.)";


// Private properties

/**
* Reference to the HTMLImageElement used to create the checked
* indicator for a MenuItem instance.
* @private
* @type {HTMLImageElement}
*/
YAHOO.widget.MenuItem.prototype._checkImage = null;


// Private event handlers


/**
* "keydown" Custom Event handler for a MenuItem instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance that 
* fired the event.
*/
YAHOO.widget.MenuItem.prototype._onKeyDown = 

    function(p_sType, p_aArgs, p_oMenuItem) {

        var Event = YAHOO.util.Event;
        var oDOMEvent = p_aArgs[0];
        var oParent = this.parent;
        var oConfig = this.cfg;
        var oMenuItem;
    

        switch(oDOMEvent.keyCode) {
    
            case 38:    // Up arrow
            case 40:    // Down arrow
    
                if(
                    this == oParent.activeItem && 
                    !oConfig.getProperty("selected")
                ) {
    
                    oConfig.setProperty("selected", true);
    
                }
                else {
    
                    var oNextItem = (oDOMEvent.keyCode == 38) ? 
                            this.getPreviousEnabledSibling() : 
                            this.getNextEnabledSibling();
            
                    if(oNextItem) {

                        oParent.clearActiveItem();

                        oNextItem.cfg.setProperty("selected", true);
            
                        oNextItem.focus();
    
                    }
    
                }
    
                Event.preventDefault(oDOMEvent);

            break;
            
    
            case 39:    // Right arrow

                oParent.clearActiveItem();

                oConfig.setProperty("selected", true);
                
                this.focus();


                var oSubmenu = oConfig.getProperty("submenu");
    
                if(oSubmenu) {

                    oSubmenu.show();
                    oSubmenu.setInitialSelection();                    
    
                }
                else if(
                    YAHOO.widget.MenuBarItem && 
                    oParent.parent && 
                    oParent.parent instanceof YAHOO.widget.MenuBarItem
                ) {

                    oParent.hide();
    
                    // Set focus to the parent MenuItem if one exists
    
                    oMenuItem = oParent.parent;
    
                    if(oMenuItem) {
    
                        oMenuItem.focus();
                        oMenuItem.cfg.setProperty("selected", true);
    
                    }                    
                
                }
    
                Event.preventDefault(oDOMEvent);

            break;
    
    
            case 37:    // Left arrow
    
                // Only hide if this this is a MenuItem of a submenu
    
                if(oParent.parent) {
    
                    oParent.hide();
    
                    // Set focus to the parent MenuItem if one exists
    
                    oMenuItem = oParent.parent;
    
                    if(oMenuItem) {
    
                        oMenuItem.focus();
                        oMenuItem.cfg.setProperty("selected", true);
    
                    }
    
                }

                Event.preventDefault(oDOMEvent);
    
            break;        
    
        }
    
    };


/**
* "mouseover" Custom Event handler for a MenuItem instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance that 
* fired the event.
*/
YAHOO.widget.MenuItem.prototype._onMouseOver = 

    function(p_sType, p_aArgs, p_oMenuItem) {

        var oParent = this.parent;
        var oConfig = this.cfg;
        var oActiveItem = oParent.activeItem;
    
    
        // Hide any other submenus that might be visible
    
        if(oActiveItem && oActiveItem != this) {
    
            oParent.clearActiveItem();
    
        }
    
    
        // Select and focus the current MenuItem instance
    
        oConfig.setProperty("selected", true);
        this.focus();
    
    
        // Show the submenu for this instance
    
        var oSubmenu = oConfig.getProperty("submenu");
    
        if(oSubmenu) {
    
            oSubmenu.show();
    
        }
    
    };


/**
* "mouseout" Custom Event handler for a MenuItem instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance that 
* fired the event.
*/
YAHOO.widget.MenuItem.prototype._onMouseOut = 

    function(p_sType, p_aArgs, p_oMenuItem) {
    
        var oConfig = this.cfg;
        var oSubmenu = oConfig.getProperty("submenu");

        oConfig.setProperty("selected", false);
    
        if(oSubmenu) {
    
            var oDOMEvent = p_aArgs[0];
            var oRelatedTarget = YAHOO.util.Event.getRelatedTarget(oDOMEvent);
    
            if(
                !(
                    oRelatedTarget == oSubmenu.element || 
                    YAHOO.util.Dom.isAncestor(oSubmenu.element, oRelatedTarget)
                )
            ) {
    
                oSubmenu.hide();
    
            }
    
        }
    
    };


// Event handlers for configuration properties

/**
* Event handler for when the "checked" configuration property of
* a MenuItem instance changes. 
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the 
* event was fired.
* @param {YAHOO.widget.MenuItem} p_oItem The MenuItem instance 
* that fired the event.
*/    
YAHOO.widget.MenuItem.prototype.configChecked =

    function(p_sType, p_aArgs, p_oItem) {
    
        var Dom = YAHOO.util.Dom;
        var bChecked = p_aArgs[0];
        var oEl = this.element;
        var oConfig = this.cfg;
        var oImg;
        

        if(bChecked) {

            var me = this;

            function preloadImage(p_sPath) {

                var sPath = me.imageRoot + p_sPath;

                if(!document.images[sPath]) {

                    var oImg = document.createElement("img");
                    oImg.src = sPath;
                    oImg.name = sPath;
                    oImg.id = sPath;
                    oImg.style.display = "none";
                    
                    document.body.appendChild(oImg);

                }
            
            }

            preloadImage(this.CHECKED_IMAGE_PATH);
            preloadImage(this.SELECTED_CHECKED_IMAGE_PATH);
            preloadImage(this.DISABLED_CHECKED_IMAGE_PATH);


            oImg = document.createElement("img");
            oImg.src = (this.imageRoot + this.CHECKED_IMAGE_PATH);
            oImg.alt = this.CHECKED_IMAGE_ALT_TEXT;

            var oSubmenu = this.cfg.getProperty("submenu");

            if(oSubmenu) {

                oEl.insertBefore(oImg, oSubmenu.element);

            }
            else {

                oEl.appendChild(oImg);            

            }


            Dom.addClass([oEl, oImg], "checked");

            this._checkImage = oImg;

            if(oConfig.getProperty("disabled")) {

                oConfig.refireEvent("disabled");

            }

            if(oConfig.getProperty("selected")) {

                oConfig.refireEvent("selected");

            }
        
        }
        else {

            oImg = this._checkImage;

            Dom.removeClass([oEl, oImg], "checked");

            if(oImg) {

                oEl.removeChild(oImg);

            }

            this._checkImage = null;
        
        }

    };
    

/**
* Event handler for when the "selected" configuration property of
* a MenuItem instance changes. 
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the 
* event was fired.
* @param {YAHOO.widget.MenuItem} p_oItem The MenuItem instance 
* that fired the event.
*/    
YAHOO.widget.MenuItem.prototype.configSelected = 

    function(p_sType, p_aArgs, p_oItem) {

        YAHOO.widget.MenuItem.superclass.configSelected.call(
                this, p_sType, p_aArgs, p_oItem
            );        
    
        var oConfig = this.cfg;

        if(!oConfig.getProperty("disabled") && oConfig.getProperty("checked")) {

            var bSelected = p_aArgs[0];

            var sSrc = this.imageRoot + (bSelected ? 
                this.SELECTED_CHECKED_IMAGE_PATH : this.CHECKED_IMAGE_PATH);

            this._checkImage.src = document.images[sSrc].src;
            
        }            
    
    };


/**
* Event handler for when the "disabled" configuration property of
* a MenuItem instance changes. 
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the 
* event was fired.
* @param {YAHOO.widget.MenuItem} p_oItem The MenuItem instance 
* that fired the event.
*/    
YAHOO.widget.MenuItem.prototype.configDisabled = 

    function(p_sType, p_aArgs, p_oItem) {
    
        YAHOO.widget.MenuItem.superclass.configDisabled.call(
                this, p_sType, p_aArgs, p_oItem
            );        
    
        if(this.cfg.getProperty("checked")) {
    
            var bDisabled = p_aArgs[0];
            var sAlt = this.CHECKED_IMAGE_ALT_TEXT;
            var sSrc = this.CHECKED_IMAGE_PATH;
            var oImg = this._checkImage;
            
            if(bDisabled) {
    
                sAlt = this.DISABLED_CHECKED_IMAGE_ALT_TEXT;
                sSrc = this.DISABLED_CHECKED_IMAGE_PATH;
            
            }

            oImg.src = document.images[(this.imageRoot + sSrc)].src;
            oImg.alt = sAlt;
            
        }    
            
    };


// Public methods
    
/**
* Initializes the class's configurable properties which can be changed using 
* the MenuModule's Config object (cfg).
*/
YAHOO.widget.MenuItem.prototype.initDefaultConfig = function() {

    YAHOO.widget.MenuItem.superclass.initDefaultConfig.call(this);

	// Add configuration properties

    this.cfg.addProperty(
        "checked", 
        {
            value: false, 
            handler: this.configChecked, 
            validator: this.cfg.checkBoolean, 
            suppressEvent: true 
        } 
    );

};