/**
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
* @class
* OverlayManager is used for maintaining the focus status of multiple Overlays.
* @param {Array}	overlays	Optional. A collection of Overlays to register with the manager.
* @param {object}	userConfig		The object literal representing the user configuration of the OverlayManager
* @constructor
*/
YAHOO.widget.OverlayManager = function(userConfig) {
	this.init(userConfig);
}

/**
* The CSS class representing a focused Overlay
* @type string
*/
YAHOO.widget.OverlayManager.CSS_FOCUSED = "focused";

YAHOO.widget.OverlayManager.prototype = {

	constructor : YAHOO.widget.OverlayManager,

	/**
	* The array of Overlays that are currently registered
	* @type Array
	*/
	overlays : null,

	/**
	* Initializes the default configuration of the OverlayManager
	*/	
	initDefaultConfig : function() {
		this.cfg.addProperty("overlays", { suppressEvent:true } );
		this.cfg.addProperty("focusevent", { value:"mousedown" } );
	}, 

	/**
	* Returns the currently focused Overlay
	* @return {Overlay}	The currently focused Overlay
	*/
	getActive : function() {},

	/**
	* Focuses the specified Overlay
	* @param {Overlay}	The Overlay to focus
	* @param {string}	The id of the Overlay to focus
	*/
	focus : function(overlay) {},

	/**
	* Removes the specified Overlay from the manager
	* @param {Overlay}	The Overlay to remove
	* @param {string}	The id of the Overlay to remove
	*/
	remove: function(overlay) {},

	/**
	* Removes focus from all registered Overlays in the manager
	*/
	blurAll : function() {},

	/**
	* Initializes the OverlayManager
	* @param {Array}	overlays	Optional. A collection of Overlays to register with the manager.
	* @param {object}	userConfig		The object literal representing the user configuration of the OverlayManager
	*/
	init : function(userConfig) {
		this.cfg = new YAHOO.util.Config(this);

		this.initDefaultConfig();

		if (userConfig) {
			this.cfg.applyConfig(userConfig, true);
		}
		this.cfg.fireQueue();

		var activeOverlay = null;

		this.getActive = function() {
			return activeOverlay;
		}

		this.focus = function(overlay) {
			var o = this.find(overlay);
			if (o) {
				this.blurAll();
				activeOverlay = o;
				YAHOO.util.Dom.addClass(activeOverlay.element, YAHOO.widget.OverlayManager.CSS_FOCUSED);
				this.overlays.sort(this.compareZIndexDesc);
				var topZIndex = YAHOO.util.Dom.getStyle(this.overlays[0].element, "zIndex");
				if (! isNaN(topZIndex) && this.overlays[0] != overlay) {
					activeOverlay.cfg.setProperty("zIndex", (parseInt(topZIndex) + 1));
				}
				this.overlays.sort(this.compareZIndexDesc);
			}
		}

		this.remove = function(overlay) {
			var o = this.find(overlay);
			if (o) {
				var originalZ = YAHOO.util.Dom.getStyle(o.element, "zIndex");
				o.cfg.setProperty("zIndex", -1000, true);
				this.overlays.sort(this.compareZIndexDesc);
				this.overlays = this.overlays.slice(0, this.overlays.length-1);
				o.cfg.setProperty("zIndex", originalZ, true);

				o.cfg.setProperty("manager", null);
				o.focusEvent = null
				o.blurEvent = null;
				o.focus = null;
				o.blur = null;
			}
		}

		this.blurAll = function() {
			activeOverlay = null;
			for (var o=0;o<this.overlays.length;o++) {
				YAHOO.util.Dom.removeClass(this.overlays[o].element, YAHOO.widget.OverlayManager.CSS_FOCUSED);
			}		
		}

		var overlays = this.cfg.getProperty("overlays");
		
		if (! this.overlays) {
			this.overlays = new Array();
		}

		if (overlays) {
			this.register(overlays);
			this.overlays.sort(this.compareZIndexDesc);
		}
	},

	/**
	* Registers an Overlay or an array of Overlays with the manager. Upon registration, the Overlay receives functions for focus and blur, along with CustomEvents for each.
	* @param {Overlay}	overlay		An Overlay to register with the manager.
	* @param {Overlay[]}	overlay		An array of Overlays to register with the manager.
	* @return	{boolean}	True if any Overlays are registered.
	*/
	register : function(overlay) {
		if (overlay instanceof YAHOO.widget.Overlay) {
			overlay.cfg.addProperty("manager", { value:this } );

			overlay.focusEvent = new YAHOO.util.CustomEvent("focus");
			overlay.blurEvent = new YAHOO.util.CustomEvent("blur");
			
			var mgr=this;

			overlay.focus = function() {
				mgr.focus(this);
				this.focusEvent.fire();
			} 

			overlay.blur = function() {
				mgr.blurAll();
				this.blurEvent.fire();
			}

			var focusOnDomEvent = function(e,obj) {
				overlay.focus();
			}
			
			var focusevent = this.cfg.getProperty("focusevent");
			YAHOO.util.Event.addListener(overlay.element,focusevent,focusOnDomEvent,this,true);

			var zIndex = YAHOO.util.Dom.getStyle(overlay.element, "zIndex");
			if (! isNaN(zIndex)) {
				overlay.cfg.setProperty("zIndex", parseInt(zIndex));
			} else {
				overlay.cfg.setProperty("zIndex", 0);
			}
			
			this.overlays.push(overlay);
			return true;
		} else if (overlay instanceof Array) {
			var regcount = 0;
			for (var i=0;i<overlay.length;i++) {
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
	* Attempts to locate an Overlay by instance or ID.
	* @param {Overlay}	overlay		An Overlay to locate within the manager
	* @param {string}	overlay		An Overlay id to locate within the manager
	* @return	{Overlay}	The requested Overlay, if found, or null if it cannot be located.
	*/
	find : function(overlay) {
		if (overlay instanceof YAHOO.widget.Overlay) {
			for (var o=0;o<this.overlays.length;o++) {
				if (this.overlays[o] == overlay) {
					return this.overlays[o];
				}
			}
		} else if (typeof overlay == "string") {
			for (var o=0;o<this.overlays.length;o++) {
				if (this.overlays[o].id == overlay) {
					return this.overlays[o];
				}
			}			
		}
		return null;
	},

	/**
	* Used for sorting the manager's Overlays by z-index.
	* @private
	*/
	compareZIndexDesc : function(o1, o2) {
		var zIndex1 = o1.cfg.getProperty("zIndex");
		var zIndex2 = o2.cfg.getProperty("zIndex");

		if (zIndex1 > zIndex2) {
			return -1;
		} else if (zIndex1 < zIndex2) {
			return 1;
		} else {
			return 0;
		}
	},

	/**
	* Shows all Overlays in the manager.
	*/
	showAll : function() {
		for (var o=0;o<this.overlays.length;o++) {
			this.overlays[o].show();
		}
	},

	/**
	* Hides all Overlays in the manager.
	*/
	hideAll : function() {
		for (var o=0;o<this.overlays.length;o++) {
			this.overlays[o].hide();
		}
	},

	toString : function() {
		return "OverlayManager";
	}

}