(function () {
    
    /**
    * OverlayManager is used for maintaining the focus status of 
    * multiple Overlays.
    * @namespace YAHOO.widget
    * @namespace YAHOO.widget
    * @class OverlayManager
    * @constructor
    * @param {Array} overlays Optional. A collection of Overlays to register 
    * with the manager.
    * @param {Object} userConfig  The object literal representing the user 
    * configuration of the OverlayManager
    */
    YAHOO.widget.OverlayManager = function (userConfig) {
        this.init(userConfig);
    };

    var Overlay = YAHOO.widget.Overlay,
        Event = YAHOO.util.Event,
        Dom = YAHOO.util.Dom,
        Config = YAHOO.util.Config,
        CustomEvent = YAHOO.util.CustomEvent,
        OverlayManager = YAHOO.widget.OverlayManager;
    
    /**
    * The CSS class representing a focused Overlay
    * @property OverlayManager.CSS_FOCUSED
    * @static
    * @final
    * @type String
    */
    OverlayManager.CSS_FOCUSED = "focused";
    
    OverlayManager.prototype = {
    
        /**
        * The class's constructor function
        * @property contructor
        * @type Function
        */
        constructor: OverlayManager,
        
        /**
        * The array of Overlays that are currently registered
        * @property overlays
        * @type YAHOO.widget.Overlay[]
        */
        overlays: null,
        
        /**
        * Initializes the default configuration of the OverlayManager
        * @method initDefaultConfig
        */
        initDefaultConfig: function () {
        
            /**
            * The collection of registered Overlays in use by 
            * the OverlayManager
            * @config overlays
            * @type YAHOO.widget.Overlay[]
            * @default null
            */
            this.cfg.addProperty("overlays", { suppressEvent: true } );
        
            /**
            * The default DOM event that should be used to focus an Overlay
            * @config focusevent
            * @type String
            * @default "mousedown"
            */
            this.cfg.addProperty("focusevent", { value: "mousedown" } );

        },

        /**
        * Initializes the OverlayManager
        * @method init
        * @param {Overlay[]} overlays Optional. A collection of Overlays to 
        * register with the manager.
        * @param {Object} userConfig  The object literal representing the user 
        * configuration of the OverlayManager
        */
        init: function (userConfig) {

            /**
            * The OverlayManager's Config object used for monitoring 
            * configuration properties.
            * @property cfg
            * @type Config
            */
            this.cfg = new Config(this);

            this.initDefaultConfig();

            if (userConfig) {
                this.cfg.applyConfig(userConfig, true);
            }
            this.cfg.fireQueue();

            /**
            * The currently activated Overlay
            * @property activeOverlay
            * @private
            * @type YAHOO.widget.Overlay
            */
            var activeOverlay = null;

            /**
            * Returns the currently focused Overlay
            * @method getActive
            * @return {Overlay} The currently focused Overlay
            */
            this.getActive = function () {
                return activeOverlay;
            };

            /**
            * Focuses the specified Overlay
            * @method focus
            * @param {Overlay} overlay The Overlay to focus
            * @param {String} overlay The id of the Overlay to focus
            */
            this.focus = function (overlay) {
                var o = this.find(overlay);
                if (o) {
                    if (activeOverlay != o) {
                        if (activeOverlay) {
                            activeOverlay.blur();
                        }
                        this.bringToTop(o);

                        activeOverlay = o;

                        Dom.addClass(activeOverlay.element, 
                            OverlayManager.CSS_FOCUSED);

                        o.focusEvent.fire();
                    }
                }
            };
        
            /**
            * Removes the specified Overlay from the manager
            * @method remove
            * @param {Overlay} overlay The Overlay to remove
            * @param {String} overlay The id of the Overlay to remove
            */
            this.remove = function (overlay) {
                var o = this.find(overlay), 
                        originalZ;
                if (o) {
                    if (activeOverlay == o) {
                        activeOverlay = null;
                    }

                    var bDestroyed = (o.element === null && o.cfg === null) ? true : false;

                    if (!bDestroyed) {
                        // Set it's zindex so that it's sorted to the end.
                        originalZ = Dom.getStyle(o.element, "zIndex");
                        o.cfg.setProperty("zIndex", -1000, true);
                    }

                    this.overlays.sort(this.compareZIndexDesc);
                    this.overlays = this.overlays.slice(0, (this.overlays.length - 1));

                    o.hideEvent.unsubscribe(o.blur);
                    o.destroyEvent.unsubscribe(this._onOverlayDestroy, o);

                    if (!bDestroyed) {
                        Event.removeListener(o.element, 
                                    this.cfg.getProperty("focusevent"), 
                                    this._onOverlayElementFocus);

                        o.cfg.setProperty("zIndex", originalZ, true);
                        o.cfg.setProperty("manager", null);
                    }

                    o.focusEvent.unsubscribeAll();
                    o.blurEvent.unsubscribeAll();

                    o.focusEvent = null;
                    o.blurEvent = null;

                    o.focus = null;
                    o.blur = null;
                }
            };

            /**
            * Removes focus from all registered Overlays in the manager
            * @method blurAll
            */
            this.blurAll = function () {
    
                var nOverlays = this.overlays.length,
                    i;

                if (nOverlays > 0) {
                    i = nOverlays - 1;

                    do {
                        this.overlays[i].blur();
                    }
                    while(i--);
                }
            };
        
            this._onOverlayBlur = function (p_sType, p_aArgs) {
                activeOverlay = null;
            };
        
            var overlays = this.cfg.getProperty("overlays");
        
            if (! this.overlays) {
                this.overlays = [];
            }
        
            if (overlays) {
                this.register(overlays);
                this.overlays.sort(this.compareZIndexDesc);
            }
        },
        
        
        /**
        * @method _onOverlayElementFocus
        * @description Event handler for the DOM event that is used to focus 
        * the Overlay instance as specified by the "focusevent" 
        * configuration property.
        * @private
        * @param {Event} p_oEvent Object representing the DOM event 
        * object passed back by the event utility (Event).
        */
        _onOverlayElementFocus: function (p_oEvent) {
        
            var oTarget = Event.getTarget(p_oEvent),
                oClose = this.close;
            
            if (oClose && (oTarget == oClose || Dom.isAncestor(oClose, oTarget))) {
                this.blur();
            } else {
                this.focus();
            }
        },
        
        
        /**
        * @method _onOverlayDestroy
        * @description "destroy" event handler for the Overlay.
        * @private
        * @param {String} p_sType String representing the name of the event  
        * that was fired.
        * @param {Array} p_aArgs Array of arguments sent when the event 
        * was fired.
        * @param {Overlay} p_oOverlay Object representing the menu that 
        * fired the event.
        */
        _onOverlayDestroy: function (p_sType, p_aArgs, p_oOverlay) {
            this.remove(p_oOverlay);
        },
        
        /**
        * Registers an Overlay or an array of Overlays with the manager. Upon 
        * registration, the Overlay receives functions for focus and blur, 
        * along with CustomEvents for each.
        * @method register
        * @param {Overlay} overlay  An Overlay to register with the manager.
        * @param {Overlay[]} overlay  An array of Overlays to register with 
        * the manager.
        * @return {Boolean} True if any Overlays are registered.
        */
        register: function (overlay) {
        
            var mgr = this,
                zIndex,
                regcount,
                i,
                nOverlays;
        
            if (overlay instanceof Overlay) {

                overlay.cfg.addProperty("manager", { value: this } );

                overlay.focusEvent = overlay.createEvent("focus");
                overlay.focusEvent.signature = CustomEvent.LIST;

                overlay.blurEvent = overlay.createEvent("blur");
                overlay.blurEvent.signature = CustomEvent.LIST;
        
                overlay.focus = function () {
                    mgr.focus(this);
                };
        
                overlay.blur = function () {
                    if (mgr.getActive() == this) {
                        Dom.removeClass(this.element, OverlayManager.CSS_FOCUSED);
                        this.blurEvent.fire();
                    }
                };
        
                overlay.blurEvent.subscribe(mgr._onOverlayBlur);
                overlay.hideEvent.subscribe(overlay.blur);
                
                overlay.destroyEvent.subscribe(this._onOverlayDestroy, overlay, this);
        
                Event.on(overlay.element, this.cfg.getProperty("focusevent"), 
                            this._onOverlayElementFocus, null, overlay);
        
                zIndex = Dom.getStyle(overlay.element, "zIndex");

                if (!isNaN(zIndex)) {
                    overlay.cfg.setProperty("zIndex", parseInt(zIndex, 10));
                } else {
                    overlay.cfg.setProperty("zIndex", 0);
                }

                this.overlays.push(overlay);
                this.bringToTop(overlay);

                return true;

            } else if (overlay instanceof Array) {

                regcount = 0;
                nOverlays = overlay.length;

                for (i = 0; i < nOverlays; i++) {
                    if (this.register(overlay[i])) {
                        regcount++;
                    }
                }

                if (regcount > 0) {
                    return true;
                }
            } else {
                return false;
            }
        },

        /**
        * Places the specified Overlay instance on top of all other 
        * Overlay instances.
        * @method bringToTop
        * @param {YAHOO.widget.Overlay} p_oOverlay Object representing an 
        * Overlay instance.
        * @param {String} p_oOverlay String representing the id of an 
        * Overlay instance.
        */        
        bringToTop: function (p_oOverlay) {

            var oOverlay = this.find(p_oOverlay),
                nTopZIndex,
                oTopOverlay,
                aOverlays;

            if (oOverlay) {

                aOverlays = this.overlays;
                aOverlays.sort(this.compareZIndexDesc);

                oTopOverlay = aOverlays[0];

                if (oTopOverlay) {
                    nTopZIndex = Dom.getStyle(oTopOverlay.element, "zIndex");

                    if (!isNaN(nTopZIndex)) {

                        var bRequiresBump = false;

                        if (oTopOverlay !== oOverlay) {
                            bRequiresBump = true;
                        } else if (aOverlays.length > 1) {
                            var nNextZIndex = Dom.getStyle(aOverlays[1].element, "zIndex");
                            // Don't rely on DOM order to stack if 2 overlays are at the same zindex.
                            if (!isNaN(nNextZIndex) && (nTopZIndex == nNextZIndex)) {
                                bRequiresBump = true;
                            }
                        }

                        if (bRequiresBump) {
                            oOverlay.cfg.setProperty("zindex", (parseInt(nTopZIndex, 10) + 2));
                        }
                    }
                    aOverlays.sort(this.compareZIndexDesc);
                }
            }
        },

        /**
        * Attempts to locate an Overlay by instance or ID.
        * @method find
        * @param {Overlay} overlay  An Overlay to locate within the manager
        * @param {String} overlay  An Overlay id to locate within the manager
        * @return {Overlay} The requested Overlay, if found, or null if it 
        * cannot be located.
        */
        find: function (overlay) {

            var aOverlays = this.overlays,
                nOverlays = aOverlays.length,
                i;

            if (nOverlays > 0) {
                i = nOverlays - 1;

                if (overlay instanceof Overlay) {
                    do {
                        if (aOverlays[i] == overlay) {
                            return aOverlays[i];
                        }
                    }
                    while(i--);

                } else if (typeof overlay == "string") {
                    do {
                        if (aOverlays[i].id == overlay) {
                            return aOverlays[i];
                        }
                    }
                    while(i--);
                }
                return null;
            }
        },
        
        /**
        * Used for sorting the manager's Overlays by z-index.
        * @method compareZIndexDesc
        * @private
        * @return {Number} 0, 1, or -1, depending on where the Overlay should 
        * fall in the stacking order.
        */
        compareZIndexDesc: function (o1, o2) {

            var zIndex1 = (o1.cfg) ? o1.cfg.getProperty("zIndex") : null, // Sort invalid (destroyed)
                zIndex2 = (o2.cfg) ? o2.cfg.getProperty("zIndex") : null; // objects at bottom.

            if (zIndex1 === null && zIndex2 === null) {
                return 0;
            } else if (zIndex1 === null){
                return 1;
            } else if (zIndex2 === null) {
                return -1;
            } else if (zIndex1 > zIndex2) {
                return -1;
            } else if (zIndex1 < zIndex2) {
                return 1;
            } else {
                return 0;
            }
        },
        
        /**
        * Shows all Overlays in the manager.
        * @method showAll
        */
        showAll: function () {
        
            var aOverlays = this.overlays,
                nOverlays = aOverlays.length,
                i;

            if (nOverlays > 0) {
                i = nOverlays - 1;
                do {
                    aOverlays[i].show();
                }
                while(i--);
            }
        },

        /**
        * Hides all Overlays in the manager.
        * @method hideAll
        */
        hideAll: function () {
        
            var aOverlays = this.overlays,
                nOverlays = aOverlays.length,
                i;

            if (nOverlays > 0) {
                i = nOverlays - 1;
                do {
                    aOverlays[i].hide();
                }
                while(i--);
            }
        },

        /**
        * Returns a string representation of the object.
        * @method toString
        * @return {String} The string representation of the OverlayManager
        */
        toString: function () {
            return "OverlayManager";
        }
    };

}());