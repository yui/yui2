


/**
* @class Extends YAHOO.widget.MenuModule to provide a set of default mouse and 
* key event behaviors.
* @constructor
* @extends YAHOO.widget.MenuModule
* @base YAHOO.widget.MenuModule
* @param {String} p_oElement The HTMLElement ID representing the source node 
* (either HTMLSelectElement or HTMLDivElement) of the Menu <em>OR</em>
* @param {Element} p_oElement The HTMLElement representing the Menu to 
* be created
* @param {Object} p_oConfig Optional. The configuration object literal 
* containing the configuration for a Menu instance. See 
* configuration class documentation for more details.
*/
YAHOO.widget.Menu = function(p_oElement, p_oConfig) {

    YAHOO.widget.Menu.superclass.constructor.call(
            this, 
            p_oElement,
            p_oConfig
        );

};

YAHOO.extend(YAHOO.widget.Menu, YAHOO.widget.MenuModule);


/**
* The Menu class's initialization method. This method is automatically 
* called by the constructor, and sets up all DOM references for pre-existing 
* markup, and creates required markup if it is not already present.
* @param {String} p_oElement The HTMLElement ID representing the source node 
* (either HTMLSelectElement or HTMLDivElement) of the Menu <em>OR</em>
* @param {Element} p_oElement The HTMLElement representing the Menu to 
* be created
* @param {Object} p_oConfig Optional. The configuration object literal 
* containing the configuration for a Menu instance. See 
* configuration class documentation for more details.
*/
YAHOO.widget.Menu.prototype.init = function(p_oElement, p_oConfig) {

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
    this.clickEvent.subscribe(this._onMenuClick, this, true);

    if(p_oConfig) {

        this.cfg.applyConfig(p_oConfig, true);

    }
    
    this.initEvent.fire(YAHOO.widget.Menu);

};


// Private event handlers

/**
* "show" Custom Event handler for a Menu instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.Menu} p_oMenu The Menu instance that fired the event.
*/
YAHOO.widget.Menu.prototype._onMenuShow = 

    function(p_sType, p_aArgs, p_oMenu) {

        var Event = YAHOO.util.Event;
        var oParent = this.parent;

        if(oParent) {

            var oParentMenu = oParent.parent;

            if(oParentMenu instanceof YAHOO.widget.Menu) {

                var aAlignment = oParent.parent.cfg.getProperty("submenualignment");
        
                this.cfg.setProperty(
                    "submenualignment", 
                    [ aAlignment[0], aAlignment[1] ]
                );
            
            }


            if(
                !oParentMenu.cfg.getProperty("autosubmenudisplay") && 
                oParentMenu.cfg.getProperty("position") == "static"
            ) {

                oParentMenu.cfg.setProperty("autosubmenudisplay", true);


                /**
                * "click" event handler for the document
                * @private
                * @param {Event} p_oEvent Event object passed back by the event 
                * utility (YAHOO.util.Event).
                */
                var disableAutoSubmenuDisplay = function(p_oEvent) {

                    if(
                        p_oEvent.type == "mousedown" || 
                        (p_oEvent.type == "keydown" && p_oEvent.keyCode == 27)
                    ) {
    
                        /*  
                            Set the "autosubmenudisplay" to "false" if the user
                            clicks outside the MenuBar instance.
                        */
    
                        var oTarget = Event.getTarget(p_oEvent);
    
                        if(
                            oTarget != oParentMenu.element || 
                            !Dom.isAncestor(oParentMenu.element, oTarget)
                        ) {
    
                            oParentMenu.cfg.setProperty(
                                "autosubmenudisplay", 
                                false
                            );
    
                            Event.removeListener(
                                    document, 
                                    "mousedown", 
                                    disableAutoSubmenuDisplay
                                );
    
                            Event.removeListener(
                                    document, 
                                    "keydown", 
                                    disableAutoSubmenuDisplay
                                );
    
                        }
                    
                    }

                };

                Event.addListener(document, "mousedown", disableAutoSubmenuDisplay);                             
                Event.addListener(document, "keydown", disableAutoSubmenuDisplay);

            }

        }


    


    };


/**
* "mouseover" Custom Event handler for a Menu instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.Menu} p_oMenu The Menu instance that fired the event.
*/
YAHOO.widget.Menu.prototype._onMenuMouseOver = 

    function(p_sType, p_aArgs, p_oMenu) {
    
        /*
            If the menu is a submenu, then select the menu's parent
            MenuItem instance
        */
    
        if(this.parent) {
    
            this.parent.cfg.setProperty("selected", true);
    
        }
    
    };


/**
* "keydown" Custom Event handler for a Menu instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.Menu} p_oMenu The Menu instance that fired the event.
*/
YAHOO.widget.Menu.prototype._onMenuKeyDown = 

    function(p_sType, p_aArgs, p_oMenu) {

        var Event = YAHOO.util.Event;
        var oEvent = p_aArgs[0];
        var oItem = p_aArgs[1];
        var oItemCfg = oItem.cfg;
        var oParentItem = this.parent;
        var oRoot;
        var oNextItem;

        switch(oEvent.keyCode) {
    
            case 38:    // Up arrow
            case 40:    // Down arrow
    
                if(
                    oItem == this.activeItem && 
                    !oItemCfg.getProperty("selected")
                ) {
    
                    oItemCfg.setProperty("selected", true);
    
                }
                else {
    
                    oNextItem = (oEvent.keyCode == 38) ? 
                        oItem.getPreviousEnabledSibling() : 
                        oItem.getNextEnabledSibling();
            
                    if(oNextItem) {

                        this.clearActiveItem();

                        oNextItem.cfg.setProperty("selected", true);
                        oNextItem.focus();

                    }
    
                }
    
                Event.preventDefault(oEvent);

            break;
            
    
            case 39:    // Right arrow

                var oSubmenu = oItemCfg.getProperty("submenu");
    
                if(oSubmenu) {

                    oSubmenu.show();
                    oSubmenu.setInitialSelection();

                }
                else {

                    oRoot = this.getRoot();
                    
                    if(oRoot instanceof YAHOO.widget.MenuBar) {

                        oNextItem = oRoot.activeItem.getNextEnabledSibling();

                        if(oNextItem) {
                        
                            oRoot.clearActiveItem();

                            oNextItem.cfg.setProperty("selected", true);

                            oSubmenu = oNextItem.cfg.getProperty("submenu");

                            if(oSubmenu) {
                            
                                oSubmenu.show();
                            
                            }

                            oNextItem.focus();
                        
                        }
                    
                    }
                
                }


                Event.preventDefault(oEvent);

            break;
    
    
            case 37:    // Left arrow

                if(oParentItem) {
    
                    var oParentMenu = oParentItem.parent;

                    if(oParentMenu instanceof YAHOO.widget.MenuBar) {

                        oNextItem = 
                            oParentMenu.activeItem.getPreviousEnabledSibling();

                        if(oNextItem) {
                        
                            oParentMenu.clearActiveItem();

                            oNextItem.cfg.setProperty("selected", true);

                            oSubmenu = oNextItem.cfg.getProperty("submenu");

                            if(oSubmenu) {
                            
                                oSubmenu.show();
                            
                            }

                            oNextItem.focus();
                        
                        } 
                    
                    }
                    else {

                        this.hide();
    
                        oParentItem.focus();
                        oParentItem.cfg.setProperty("selected", true);
                    
                    }
    
                }

                Event.preventDefault(oEvent);
    
            break;        
    
        }
    
    };
    

/**
* "click" Custom Event handler for a Menu instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.Menu} p_oMenu The Menu instance that fired the event.
*/    
YAHOO.widget.Menu.prototype._onMenuClick = function(p_sType, p_aArgs, p_oMenu) {

    var oItem = p_aArgs[1];

    if(oItem) {

        var sURL = oItem.cfg.getProperty("url");
        var oEvent = p_aArgs[0];
        var oTarget = YAHOO.util.Event.getTarget(oEvent);


        if(
            oTarget != oItem.submenuIndicator && 
            sURL.substr((sURL.length-1),1) == "#"
        ) {

            var oRoot = this.getRoot();
            
            if(oRoot.cfg.getProperty("position") == "static") {

                oRoot.clearActiveItem();

            }
            else {

                oRoot.hide();
            
            }

        }

    }

};


/**
* "keypress" Custom Event handler for a Menu instance.
* @private
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.Menu} p_oMenu The Menu instance that fired the event.
*/
YAHOO.widget.Menu.prototype._onMenuKeyPress = 

    function(p_sType, p_aArgs, p_oMenu) {
    
        var oEvent = p_aArgs[0];
        
        if(this.activeItem && this.browser == "safari") {

            var oLI = this.activeItem.element;
            var oBody = this.body;

            if(oEvent.keyCode == 40) {

                if(
                    (oLI.offsetTop + oLI.offsetHeight) > 
                    (oBody.scrollTop + oBody.offsetHeight)
                ) {
                
                    oBody.scrollTop = 
                        (oLI.offsetTop + oLI.offsetHeight) - oBody.offsetHeight;
                
                }
                else if(
                    (oLI.offsetTop + oLI.offsetHeight) < 
                    oBody.scrollTop
                ) {

                    oBody.scrollTop = oLI.offsetTop;
                
                }

            }
            else {

                if(oLI.offsetTop < oBody.scrollTop) {

                    oBody.scrollTop = oLI.offsetTop;
                }

                else if(
                    oLI.offsetTop > 
                    (oBody.scrollTop + oBody.offsetHeight)
                ) {

                    oBody.scrollTop = 
                        (oLI.offsetTop + oLI.offsetHeight) - oBody.offsetHeight;
                }
            }                        
        
        }


        if(
            this.browser == "gecko" && 
            (oEvent.keyCode == 40 || oEvent.keyCode == 38)
        ) {

            YAHOO.util.Event.preventDefault(oEvent);
    
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

    var me = this;
    var oConfig = this.cfg;

    if(oConfig.getProperty("position") == "dynamic") {

        oConfig.setProperty("width", (this._getOffsetWidth() + "px"));
        
        if(this.parent && oConfig.getProperty("visible")) {


            /**
            * Aligns the menu to its specified "context" element.  If the menu  
            * is a submenu then its "context" element is always the parent 
            * item's element.
            * @private
            */ 
            var align = function() {

                me.align();
            
            };

            window.setTimeout(align, 0);
            
        }

    }

    YAHOO.widget.Menu.superclass.onDomResize.call(this, e, obj);

};


// Public methods

/**
* Returns a string representing the specified object.
*/
YAHOO.widget.Menu.prototype.toString = function() {

    return ("Menu " + this.id);

};


/**
* Event handler for when the "maxHeight" configuration property of a
* Menu changes.
* @param {String} p_sType The name of the event that was fired.
* @param {Array} p_aArgs Collection of arguments sent when the event 
* was fired.
* @param {YAHOO.widget.MenuModule} p_oMenuModule The MenuModule instance fired
* the event.
*/
YAHOO.widget.Menu.prototype.configMaxHeight = 

    function(p_sType, p_aArgs, p_oMenu) {

        var nMaxHeight = p_aArgs[0];
        var Dom = YAHOO.util.Dom;
        var oBody = this.body;
        var bIE = (this.browser == "ie");
        var bHandleKeyPress = 
                (this.browser == "gecko" || this.browser == "safari");

        if(nMaxHeight && oBody.offsetHeight > nMaxHeight) {
            
            Dom.setStyle(oBody, "height", (nMaxHeight + "px"));

            if(bIE) {
            
                Dom.setStyle(oBody, "overflow-y", "auto");
                Dom.setStyle(oBody, "overflow-x", "visible");

            }
            else {

                Dom.setStyle(oBody, "overflow", "auto");

            }

            if(bHandleKeyPress) {
        
                this.keyPressEvent.subscribe(this._onMenuKeyPress, this, true);
        
            }

        }
        else {

            Dom.setStyle(oBody, "height", "auto");

            if(bIE) {
            
                Dom.setStyle(oBody, "overflow-y", "visible");
                Dom.setStyle(oBody, "overflow-x", "visible");
            
            }
            else {

                Dom.setStyle(oBody, "overflow", "visible");

            }

            if(bHandleKeyPress) {
        
                this.keyPressEvent.unsubscribe(this._onMenuKeyPress, this);
        
            }
        
        }

    };


/**
* Initializes the class's configurable properties which can be changed using 
* the MenuModule's Config object (cfg).
*/
YAHOO.widget.Menu.prototype.initDefaultConfig = function() {

    YAHOO.widget.Menu.superclass.initDefaultConfig.call(this);

    var oConfig = this.cfg;

	oConfig.addProperty(
	   "autosubmenudisplay", 
	   { 
	       value: true, 
	       validator: oConfig.checkBoolean
       }
    );

	oConfig.addProperty(
	   "maxHeight", 
	   { 
	       validator: oConfig.checkNumber, 
	       handler: this.configMaxHeight
       } 
    );

};