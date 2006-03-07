/**
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
Version: 0.10.0
* @class
* Panel is an implementation of Overlay that behaves like an OS window, with a draggable header and an optional close icon at the top right.
* @param {string}	el	The element ID representing the Panel <em>OR</em>
* @param {Element}	el	The element representing the Panel
* @param {object}	userConfig	The configuration object literal containing the configuration that should be set for this Panel. See configuration documentation for more details.
* @constructor
*/
YAHOO.widget.Panel = function(el, userConfig) {
	if (arguments.length > 0)
	{
		YAHOO.widget.Panel.superclass.constructor.call(this, el, userConfig);
	}
}

YAHOO.widget.Panel.prototype = new YAHOO.widget.Overlay();
YAHOO.widget.Panel.prototype.constructor = YAHOO.widget.Panel;

/**
* Reference to the Panel's superclass, Overlay
* @type class
* @final
*/
YAHOO.widget.Panel.superclass = YAHOO.widget.Overlay.prototype;

/*
* The Overlay initialization method, which is executed for Overlay and all of its subclasses. This method is automatically called by the constructor, and  sets up all DOM references for pre-existing markup, and creates required markup if it is not already present.
* @param {string}	el	The element ID representing the Overlay <em>OR</em>
* @param {Element}	el	The element representing the Overlay
* @param {object}	userConfig	The configuration object literal containing the configuration that should be set for this Overlay. See configuration documentation for more details.
*/
YAHOO.widget.Panel.prototype.init = function(el, userConfig) {
	YAHOO.widget.Panel.superclass.init.call(this, el/*, userConfig*/);  // Note that we don't pass the user config in here yet because we only want it executed once, at the lowest subclass level

	this.buildContainer()							
	YAHOO.util.Dom.addClass(this.element, "panel");

	if (userConfig) {
		this.cfg.applyConfig(userConfig, true);
	}
}

/**
* Initializes the class's configurable properties which can be changed using the Panel's Config object (cfg).
*/
YAHOO.widget.Panel.prototype.initDefaultConfig = function() {
	YAHOO.widget.Panel.superclass.initDefaultConfig.call(this);

	// Add panel config properties //
	this.cfg.addProperty("close",	true,	this.configClose,	this.cfg.checkBoolean);
	this.cfg.addProperty("draggable", true,	this.configDraggable,	this.cfg.checkBoolean);
	this.cfg.addProperty("fixedcenter", false, this.configFixedCenter, this.cfg.checkBoolean);

	this.cfg.addProperty("animate",		true,	null,	this.cfg.checkBoolean);
	this.cfg.addProperty("fadeintime",	0.25,	null,	this.cfg.checkNumber);
	this.cfg.addProperty("fadeouttime",	0.25,	null,	this.cfg.checkNumber);

	this.cfg.addProperty("underlay",	"shadow", this.configUnderlay, null);
	this.cfg.addProperty("modal",	false,	this.configModal,	this.cfg.checkBoolean);
}

// BEGIN BUILT-IN PROPERTY EVENT HANDLERS //

/**
* The default event handler fired when the "visible" property is changed. The fading animation of the Panel, if enabled, is also handled within this method.
*/
YAHOO.widget.Panel.prototype.configVisible = function(type, args, obj) {
	var val = args[0];

	YAHOO.util.Dom.setStyle(this.element, "visibility", "inherit");

	if (this.cfg.getProperty("animate")) { // Animation
		var inTime = this.cfg.getProperty("fadeintime");
		var outTime = this.cfg.getProperty("fadeouttime");
		
		var currentVis = YAHOO.util.Dom.getStyle(this.container, "visibility");
		
		var shadow = this.shadow;
		var iframe = this.iframe;

		if (val) { // Fade in if not showing
			if (currentVis == "hidden") {

				if (shadow && shadow.style.filter) {
					shadow.style.filter = null;
				}

				var fadeIn = new YAHOO.util.Anim(this.container, {opacity: {to: 1} }, inTime);
				fadeIn.onStart.subscribe(function() {
					this.getEl().style.visibility = "visible";
					
					if (iframe) {
						YAHOO.util.Dom.setStyle(iframe, "visibility", "visible");
					}
					YAHOO.util.Dom.setStyle(this.getEl(), "opacity", 0);				
				});
				fadeIn.onComplete.subscribe(function() {
					if (this.getEl().style.filter) {
						this.getEl().style.filter = null;
					}				
					if (shadow) {
						YAHOO.util.Dom.setStyle(shadow, "opacity", .5);
					}
				});

				fadeIn.animate();
			}
		} else { // Fade out if showing
			if (currentVis == "visible") {
				if (shadow && shadow.style.filter) {
					shadow.style.filter = null;
				}

				var fadeOut = new YAHOO.util.Anim(this.container, {opacity: {to: 0} }, outTime)

				fadeOut.onComplete.subscribe(function() {
					this.getEl().style.visibility = "hidden";

					if (this.getEl().style.filter) {
						this.getEl().style.filter = null;
					}
					if (iframe) {
						YAHOO.util.Dom.setStyle(iframe, "visibility", "hidden");
					}			
				});
				fadeOut.animate();
			}
		}
	} else { // No animation
		if (val) {
			YAHOO.util.Dom.setStyle((this.container), "visibility", "visible");
			if (this.iframe) {
				YAHOO.util.Dom.setStyle(this.iframe, "visibility", "visible");
			}
		} else {
			YAHOO.util.Dom.setStyle((this.container), "visibility", "hidden");
			if (this.iframe) {
				YAHOO.util.Dom.setStyle(this.iframe, "visibility", "hidden");
			}
		}
	}
}

/**
* The default event handler fired when the "height" property is changed.
*/
YAHOO.widget.Panel.prototype.configHeight = function(type, args, obj) {
	YAHOO.widget.Panel.superclass.configHeight.call(this, type, args, obj);
	this.cfg.refireEvent("underlay");
}

/**
* The default event handler fired when the "width" property is changed.
*/
YAHOO.widget.Panel.prototype.configWidth = function(type, args, obj) {
	YAHOO.widget.Panel.superclass.configWidth.call(this, type, args, obj);
	this.cfg.refireEvent("underlay");
}

/**
* The default event handler fired when the "close" property is changed. The method controls the appending or hiding of the close icon at the top right of the Panel.
*/
YAHOO.widget.Panel.prototype.configClose = function(type, args, obj) {
	var val = args[0];

	var doHide = function(e, obj) {
		obj.hide();
	}

	if (val) {
		if (! this.close) {
			this.close = document.createElement("DIV");
			this.close.className = "close";
			this.close.innerHTML = "&nbsp;";
			this.element.appendChild(this.close);
			YAHOO.util.Event.addListener(this.close, "click", doHide, this);	
		} else {
			this.close.style.display = "block";
		}
	} else {
		if (this.close) {
			this.close.style.display = "none";
		}
	}
}

/**
* The default event handler fired when the "draggable" property is changed.
*/
YAHOO.widget.Panel.prototype.configDraggable = function(type, args, obj) {
	var val = args[0];
	if (val) {
		if (! this.header) {
			this.setHeader("&nbsp;");
			this.render();
		}
		this.registerDragDrop();
		this.dd.onDrag = function() {
			obj.syncPosition();
		}
		if (this.browser == "ie") {
			this.dd.startDrag = function() {
				YAHOO.util.Dom.addClass(obj.element,"drag");
			}
			this.dd.endDrag = function() {
				YAHOO.util.Dom.removeClass(obj.element,"drag");
			}
		}
	} else {
		if (this.dd) {
			this.dd.unreg();
		}
		if (this.header) {
			YAHOO.util.Dom.setStyle(this.header, "cursor","default");
		}
	}
}

/**
* The default event handler fired when the "underlay" property is changed.
*/
YAHOO.widget.Panel.prototype.configUnderlay = function(type, args, obj) {
	var val = args[0];

	switch (val.toLowerCase()) {
		case "shadow":
			this.element.style.position = "absolute";
			if (! this.shadow) { // create if not already in DOM
				this.shadow = document.createElement("DIV");
				this.shadow.className = "shadow";
				this.shadow.innerHTML = "&nbsp;";
				
				YAHOO.util.Dom.setStyle(this.shadow, "opacity", ".5");

				this.container.appendChild(this.shadow);
			} 
			this.sizeShadow();
			this.shadow.style.display = "block";
			if (this.matte) {
				this.matte.style.display = "none";
			}
			break;
		case "matte":
			this.element.style.position = "absolute";
			if (! this.matte) { // create if not already in DOM
				this.matte = document.createElement("DIV");
				this.matte.className = "matte";
				this.matte.innerHTML = "&nbsp;";
				this.container.appendChild(this.matte);
			}
			this.sizeMatte();
			this.matte.style.display = "block";
			if (this.shadow) {
				this.shadow.style.display = "none";
			}
			break;
		case "none":
		default:
			this.element.style.position = "relative";

			if (this.shadow) {
				this.shadow.style.display = "none";
			}
			if (this.matte) {
				this.matte.style.display = "none";
			}
			break;
	}
}

/**
* The default event handler fired when the "modal" property is changed. This handler subscribes or unsubscribes to the show and hide events to handle the display or hide of the modality mask.
*/
YAHOO.widget.Panel.prototype.configModal = function(type, args, obj) {
	var val = args[0];
	if (val) {
		this.buildMask();
		this.showEvent.subscribe(this.showMask, this, true);
		this.hideEvent.subscribe(this.hideMask, this, true);
	} else {
		this.showEvent.unsubscribe(this.showMask, this);
		this.hideEvent.unsubscribe(this.hideMask, this);
	}
}

/**
* The default event handler fired when the "fixedcenter" property is changed.
*/
YAHOO.widget.Panel.prototype.configFixedCenter = function(type, args, obj) {
	var val = args[0];
	if (val) {
		var elementWidth = this.element.offsetWidth;
		var elementHeight = this.element.offsetHeight;

		this.container.style.left = "50%";
		this.container.style.marginLeft = "-" + (elementWidth/2) + "px";

		this.container.style.top = "50%";
		this.container.style.marginTop = "-" + (elementHeight/2) + "px";
	} else {
		this.syncPosition();
	}
}

// END BUILT-IN PROPERTY EVENT HANDLERS //

/**
* Synchronizes the Panel's "xy", "x", and "y" properties with the Panel's position in the DOM. This is primarily used to update position information during drag & drop.
*/
YAHOO.widget.Panel.prototype.syncPosition = function() {
	var pos = YAHOO.util.Dom.getXY(this.container);
	this.cfg.setProperty("xy", pos);
}

/**
* Builds the wrapping container around the Panel that is used for positioning the shadow and matte underlays. The container element is assigned to a  local instance variable called container, and the element is reinserted inside of it.
*/
YAHOO.widget.Panel.prototype.buildContainer = function() {
	var elementParent = this.element.parentNode;
	
	this.container = document.createElement("DIV");
	this.container.className = "panel-container";
	this.container.id = this.element.id + "_c";
	elementParent.insertBefore(this.container, this.element);

	this.container.appendChild(this.element);
}

/**
* Adjusts the size of the shadow based no the size of the element.
*/
YAHOO.widget.Panel.prototype.sizeShadow = function() {
	if (this.shadow) {
		this.shadow.style.width = this.element.offsetWidth + "px";
		this.shadow.style.height = this.element.offsetHeight + "px";
	}
}

/**
* Adjusts the size of the matte based no the size of the element.
*/
YAHOO.widget.Panel.prototype.sizeMatte = function() {
	if (this.matte) {
		this.matte.style.width = this.element.offsetWidth + 6 + "px";
		this.matte.style.height = this.element.offsetHeight + 6 + "px";
	}
}

/**
* Centers the container in the viewport.
*/
YAHOO.widget.Panel.prototype.center = function() {

	var scrollX = window.scrollX || document.body.scrollLeft;
	var scrollY = window.scrollY || document.body.scrollTop;

	var viewPortWidth = YAHOO.util.Dom.getClientWidth();
	var viewPortHeight = YAHOO.util.Dom.getClientHeight();

	var elementWidth = this.element.offsetWidth;
	var elementHeight = this.element.offsetHeight;

	var x = (viewPortWidth / 2) - (elementWidth / 2) + scrollX;
	var y = (viewPortHeight / 2) - (elementHeight / 2) + scrollY;
	
	this.cfg.setProperty("xy", [x,y]);
}

/**
* Registers the Panel's header for drag & drop capability.
*/
YAHOO.widget.Panel.prototype.registerDragDrop = function() {
	if (this.header) {
		this.dd = new YAHOO.util.DD(this.container.id, "panel");

		if (! this.header.id) {
			this.header.id = this.id + "_h";
		}
		this.dd.setHandleElId(this.header.id);
		this.dd.addInvalidHandleType("INPUT");
		this.dd.addInvalidHandleType("SELECT");
		this.dd.addInvalidHandleType("TEXTAREA");
	}
}

/**
* Builds the mask that is laid over the document when the Panel is configured to be modal.
*/
YAHOO.widget.Panel.prototype.buildMask = function() {
	if (! this.mask) {
		this.mask = document.createElement("DIV");
		this.mask.className = "mask";
		this.mask.innerHTML = "&nbsp;";

		var maskClick = function(e, obj) {
			YAHOO.util.Event.stopEvent(e);
		}

		YAHOO.util.Event.addListener(this.mask, maskClick, this);

		if (this.browser == "opera") {
			this.mask.style.backgroundColor = "transparent";
		}
		document.body.appendChild(this.mask);
	}
}

/**
* Hides the modality mask.
*/
YAHOO.widget.Panel.prototype.hideMask = function() {
	this.mask.style.display = "none";

	var bod = document.getElementsByTagName('body')[0];
	bod.style.height = 'auto';
	bod.style.overflow = 'auto';

	YAHOO.util.Dom.removeClass(bod, "masked");

	var htm = document.getElementsByTagName('html')[0];
	htm.style.height = 'auto';
	htm.style.overflow = 'auto';
}

/**
* Shows the modality mask.
*/
YAHOO.widget.Panel.prototype.showMask = function() {
	var bod = document.getElementsByTagName('body')[0];
	bod.style.height = '100%';
	bod.style.overflow = 'hidden';

	var htm = document.getElementsByTagName('html')[0];
	htm.style.height = '100%';
	htm.style.overflow = 'hidden';

	YAHOO.util.Dom.addClass(bod, "masked");

	this.mask.style.display = "block";
}