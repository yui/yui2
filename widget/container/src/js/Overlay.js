/**
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
* @class Overlay is a Module that is absolutely positioned above the page flow. It has convenience methods for positioning and sizing, as well as options for controlling zIndex and constraining the Overlay's position to the current visible viewport. Overlay also contains a dynamicly generated IFRAME which is placed beneath it for Internet Explorer 6 and 5.x so that it will be properly rendered above SELECT elements.
* @param {string}	el	The element ID representing the Overlay <em>OR</em>
* @param {Element}	el	The element representing the Overlay
* @param {object}	userConfig	The configuration object literal containing the configuration that should be set for this Overlay. See configuration documentation for more details.
* @constructor
*/
YAHOO.widget.Overlay = function(el, userConfig) {
	if (arguments.length > 0) {
		YAHOO.widget.Overlay.superclass.constructor.call(this, el, userConfig);
	}
}

YAHOO.widget.Overlay.prototype = new YAHOO.widget.Module();
YAHOO.widget.Overlay.prototype.constructor = YAHOO.widget.Overlay;

/**
* Reference to the Overlay's superclass, Module
* @type class
* @final
*/
YAHOO.widget.Overlay.superclass = YAHOO.widget.Module.prototype;

/**
* The URL of the blank image that will be placed in the iframe
* @type string
* @final
*/
YAHOO.widget.Overlay.IFRAME_SRC = "promo/m/irs/blank.gif";

/**
* Constant representing the top left corner of an element, used for configuring the context element alignment
* @type string
* @final
*/
YAHOO.widget.Overlay.TOP_LEFT = "tl";

/**
* Constant representing the top right corner of an element, used for configuring the context element alignment
* @type string
* @final
*/
YAHOO.widget.Overlay.TOP_RIGHT = "tr";

/**
* Constant representing the top bottom left corner of an element, used for configuring the context element alignment
* @type string
* @final
*/
YAHOO.widget.Overlay.BOTTOM_LEFT = "bl";

/**
* Constant representing the bottom right corner of an element, used for configuring the context element alignment
* @type string
* @final
*/
YAHOO.widget.Overlay.BOTTOM_RIGHT = "br";

/**
* Constant representing the default CSS class used for an Overlay
* @type string
* @final
*/
YAHOO.widget.Overlay.CSS_OVERLAY = "overlay";

/*
* The Overlay initialization method, which is executed for Overlay and all of its subclasses. This method is automatically called by the constructor, and  sets up all DOM references for pre-existing markup, and creates required markup if it is not already present.
* @param {string}	el	The element ID representing the Overlay <em>OR</em>
* @param {Element}	el	The element representing the Overlay
* @param {object}	userConfig	The configuration object literal containing the configuration that should be set for this Overlay. See configuration documentation for more details.
*/
YAHOO.widget.Overlay.prototype.init = function(el, userConfig) {
	YAHOO.widget.Overlay.superclass.init.call(this, el/*, userConfig*/);  // Note that we don't pass the user config in here yet because we only want it executed once, at the lowest subclass level
	
	YAHOO.util.Dom.addClass(this.element, YAHOO.widget.Overlay.CSS_OVERLAY);

	if (userConfig) {
		this.cfg.applyConfig(userConfig, true);
	}

	if (! YAHOO.util.Config.alreadySubscribed(this.renderEvent, this.cfg.refresh, this.cfg)) {
		this.renderEvent.subscribe(this.cfg.refresh, this.cfg, true);
	}
}

/**
* Initializes the custom events for Overlay which are fired automatically at appropriate times by the Overlay class.
*/
YAHOO.widget.Overlay.prototype.initEvents = function() {
	YAHOO.widget.Overlay.superclass.initEvents.call(this);

	this.beforeMoveEvent = new YAHOO.util.CustomEvent("beforeMove", this);
	this.moveEvent = new YAHOO.util.CustomEvent("move", this);
}

/**
* Initializes the class's configurable properties which can be changed using the Overlay's Config object (cfg).
*/
YAHOO.widget.Overlay.prototype.initDefaultConfig = function() {
	YAHOO.widget.Overlay.superclass.initDefaultConfig.call(this);

	// Add overlay config properties //

	this.cfg.addProperty("x", null, this.configX, this.cfg.checkNumber, this.element, true);
	this.cfg.addProperty("y", null, this.configY, this.cfg.checkNumber, this.element, true);
	this.cfg.addProperty("xy", null, this.configXY, null, this.element, true);

	this.cfg.addProperty("fixedcenter", false, this.configFixedCenter, this.cfg.checkBoolean, this.element);

	this.cfg.addProperty("width", null, this.configWidth, null, this.element, true);
	this.cfg.addProperty("height", null, this.configHeight, null, this.element, true);

	this.cfg.addProperty("zIndex", null, this.configzIndex, this.cfg.checkNumber, this.element, true);

	this.cfg.addProperty("constraintoviewport", false, this.configConstrainToViewport, this.cfg.checkBoolean);
	this.cfg.addProperty("iframe", ((this.browser == "ie" || (this.platform == "mac" && this.browser == "gecko")) ? true : false), this.configIframe, this.cfg.checkBoolean, this.element);

	this.cfg.addProperty("context",	null, this.configContext);
}

/**
* Moves the Overlay to the specified position. This function is identical to calling this.cfg.setProperty("xy", [x,y]);
* @param {int}	x	The Overlay's new x position
* @param {int}	y	The Overlay's new y position
*/
YAHOO.widget.Overlay.prototype.moveTo = function(x, y) {
	this.cfg.setProperty("xy",[x,y]);
}

// BEGIN BUILT-IN PROPERTY EVENT HANDLERS //

/**
* The default event handler fired when the "visible" property is changed. The fading animation of the Panel, if enabled, is also handled within this method.
*/
YAHOO.widget.Overlay.prototype.configVisible = function(type, args, obj) {
	var val = args[0];
	
	var effect = this.cfg.getProperty("effect");
	if (effect) {
		var effectInstances = new Array();
		
		if (effect instanceof Array) {
			for (var i=0;i<effect.length;i++) {
				var eff = effect[i];
				effectInstances[effectInstances.length] = eff.effect(this, eff.duration);
			}
		} else {
			effectInstances[effectInstances.length] = effect.effect(this, effect.duration);
		}

		var currentVis = YAHOO.util.Dom.getStyle(this.element, "visibility");
		if (val) { // Animate in if not showing
			if (currentVis == "hidden") {
				for (var i=0;i<effectInstances.length;i++) {
					var e = effectInstances[i];
					if (! YAHOO.util.Config.alreadySubscribed(e.animateInCompleteEvent,this.showEvent.fire,this.showEvent)) {
						e.animateInCompleteEvent.subscribe(this.showEvent.fire,this.showEvent,true);
					}
					e.animateIn();
				}
				//if (this.iframe) {
				//	YAHOO.util.Dom.setStyle(this.iframe, "display", "block");
				//}
			}
		} else { // Animate out if showing
			if (currentVis == "visible") {
				for (var i=0;i<effectInstances.length;i++) {
					var e = effectInstances[i];
					if (! YAHOO.util.Config.alreadySubscribed(e.animateOutCompleteEvent,this.hideEvent.fire,this.hideEvent)) {				
						e.animateOutCompleteEvent.subscribe(this.hideEvent.fire,this.hideEvent,true);			
					}
					e.animateOut();
				}
				//if (this.iframe) {
				//	YAHOO.util.Dom.setStyle(this.iframe, "display", "none");
				//}
			}
		}
	} else { // No animation
		if (val) {
			YAHOO.util.Dom.setStyle((this.element), "visibility", "visible");
				
			if (this.platform == "mac" && this.browser == "gecko") {
				if (! YAHOO.util.Config.alreadySubscribed(this.showEvent,this.showMacGeckoScrollbars,this)) {
					this.showEvent.subscribe(this.showMacGeckoScrollbars,this,true);
				}
				this.cfg.refireEvent("iframe");
				/*this.showEvent.subscribe(
					function() {
						this.cfg.refireEvent("iframe");
					}, this, true);*/
			}
			//if (this.iframe) {
				//YAHOO.util.Dom.setStyle(this.iframe, "display", "block");
				//YAHOO.util.Dom.setStyle(this.iframe, "opacity", 1);
				//YAHOO.util.Dom.setStyle(this.iframe, "visibility", "visible");
				//YAHOO.util.Dom.setStyle(this.iframe, "zIndex", (this.cfg.getProperty("zIndex") - 1));
			//}
		} else {

			if (this.platform == "mac" && this.browser == "gecko") {
				if (! YAHOO.util.Config.alreadySubscribed(this.hideEvent,this.hideMacGeckoScrollbars,this)) {
					this.hideEvent.subscribe(this.hideMacGeckoScrollbars,this,true);
				}
				this.cfg.refireEvent("iframe");
			}
			YAHOO.util.Dom.setStyle((this.element), "visibility", "hidden");
			//if (this.iframe) {
			//	YAHOO.util.Dom.setStyle(this.iframe, "display", "none");
				//YAHOO.util.Dom.setStyle(this.iframe, "visibility", "hidden");
				//YAHOO.util.Dom.setStyle(this.iframe, "zIndex", (this.cfg.getProperty("zIndex") + 1));
			//}
		}
	}
	this.cfg.refireEvent("iframe");
}


/**
* The default event handler fired when the "fixedcenter" property is changed.
*/
YAHOO.widget.Overlay.prototype.configFixedCenter = function(type, args, obj) {
	var val = args[0];
	var me = this;
	
	if (! this.centerOnVis) {
		this.centerOnVis = function(type,args,obj) {
			var visible = args[0];
			if (visible) {
				this.center();
			}
		};
	}

	if (val) {
		this.cfg.subscribeToConfigEvent("visible", this.centerOnVis, this, true);
			
		//= function(key, handler, obj, override)
		if (! YAHOO.util.Config.alreadySubscribed(this.beforeShowEvent, this.center, this)) {
			this.beforeShowEvent.subscribe(this.center, this, true);
		}
		
		if (! YAHOO.util.Config.alreadySubscribed(YAHOO.widget.Overlay.windowResizeEvent, this.center, this)) {
			YAHOO.widget.Overlay.windowResizeEvent.subscribe(this.center, this, true);
		}

		if (! YAHOO.util.Config.alreadySubscribed(YAHOO.widget.Overlay.windowScrollEvent, this.center, this)) {
			YAHOO.widget.Overlay.windowScrollEvent.subscribe(this.center, this, true);
		}

		//YAHOO.widget.Overlay.windowResizeEvent.subscribe(refireIframe, this, true);
		//YAHOO.widget.Overlay.windowScrollEvent.subscribe(refireIframe, this, true);

		/*if (YAHOO.util.Event._getCacheIndex(window, "resize", this.center) == -1) {
			YAHOO.util.Event.addListener(window, "resize", this.center, this, true);
		}
		if (YAHOO.util.Event._getCacheIndex(window, "resize", refireIframe) == -1) {
			YAHOO.util.Event.addListener(window, "resize", refireIframe, this, true);
		}
		if (YAHOO.util.Event._getCacheIndex(window, "scroll", this.center) == -1) {
			YAHOO.util.Event.addListener(window, "scroll", this.center, this, true);
		}
		if (YAHOO.util.Event._getCacheIndex(window, "scroll", refireIframe) == -1) {
			YAHOO.util.Event.addListener(window, "scroll", refireIframe, this, true);
		}*/
	} else {
		/*var removed = [];
		removed[0] = YAHOO.util.Event.removeListener(window, "resize", this.center);
		removed[1] = YAHOO.util.Event.removeListener(window, "resize", refireIframe);
		removed[2] = YAHOO.util.Event.removeListener(window, "scroll", this.center);
		removed[3] = YAHOO.util.Event.removeListener(window, "scroll", refireIframe);*/
		//this.beforeShowEvent.unsubscribe(this.center, this);
		this.cfg.unsubscribeFromConfigEvent("visible", this.centerOnVis, this);
		YAHOO.widget.Overlay.windowResizeEvent.unsubscribe(this.center, this);
		YAHOO.widget.Overlay.windowScrollEvent.unsubscribe(this.center, this);

		//YAHOO.widget.Overlay.windowResizeEvent.unsubscribe(refireIframe, this);
		//YAHOO.widget.Overlay.windowScrollEvent.unsubscribe(refireIframe, this);

		//this.syncPosition();
	}
}

/**
* The default event handler fired when the "height" property is changed.
*/
YAHOO.widget.Overlay.prototype.configHeight = function(type, args, obj) {
	var height = args[0];
	var el = this.element;
	YAHOO.util.Dom.setStyle(el, "height", height);
	this.cfg.refireEvent("iframe");
}

/**
* The default event handler fired when the "width" property is changed.
*/
YAHOO.widget.Overlay.prototype.configWidth = function(type, args, obj) {
	var width = args[0];
	var el = this.element;
	YAHOO.util.Dom.setStyle(el, "width", width);
	this.cfg.refireEvent("iframe");
	this.cfg.refireEvent("context");
}

/**
* The default event handler fired when the "zIndex" property is changed.
*/
YAHOO.widget.Overlay.prototype.configzIndex = function(type, args, obj) {
	var zIndex = args[0];
	var el = this.element;

	if (this.iframe) {
		if (zIndex <= 0) {
			zIndex = 1;
		}
		YAHOO.util.Dom.setStyle(this.iframe, "zIndex", (zIndex-1));
	}
	YAHOO.util.Dom.setStyle(el, "zIndex", zIndex);
	this.cfg.setProperty("zIndex", zIndex, true);
}

/**
* The default event handler fired when the "xy" property is changed.
*/
YAHOO.widget.Overlay.prototype.configXY = function(type, args, obj) {
	var pos = args[0];
	var x = pos[0];
	var y = pos[1];

	this.cfg.setProperty("x", x, true);
	this.cfg.setProperty("y", y, true);

	this.beforeMoveEvent.fire([x,y]);

	x = this.cfg.getProperty("x");
	y = this.cfg.getProperty("y");

	//alert("setXY:"+[x,y]);
	YAHOO.util.Dom.setXY(this.element, [x,y], true);

	if (this.cfg.getProperty("iframe")) {
		this.cfg.refireEvent("iframe");
	}

	this.moveEvent.fire([x,y]);
}

/**
* The default event handler fired when the "x" property is changed.
*/
YAHOO.widget.Overlay.prototype.configX = function(type, args, obj) {
	var x = args[0];
	var y = this.cfg.getProperty("y");

	this.cfg.setProperty("x", x, true);
	this.cfg.setProperty("y", y, true);

	this.beforeMoveEvent.fire([x,y]);

	x = this.cfg.getProperty("x");
	y = this.cfg.getProperty("y");

	YAHOO.util.Dom.setX(this.element, x, true);
	this.cfg.setProperty("xy", [x, y], true);

	if (this.cfg.getProperty("iframe")) {
		this.cfg.refireEvent("iframe");
	}

	this.moveEvent.fire([x, y]);
}

/**
* The default event handler fired when the "y" property is changed.
*/
YAHOO.widget.Overlay.prototype.configY = function(type, args, obj) {
	var x = this.cfg.getProperty("x");
	var y = args[0];

	this.cfg.setProperty("x", x, true);
	this.cfg.setProperty("y", y, true);

	this.beforeMoveEvent.fire([x,y]);

	x = this.cfg.getProperty("x");
	y = this.cfg.getProperty("y");

	YAHOO.util.Dom.setY(this.element, y, true);
	this.cfg.setProperty("xy", [x, y], true);

	if (this.cfg.getProperty("iframe")) {
		this.cfg.refireEvent("iframe");
	}

	this.moveEvent.fire([x, y]);
}

/**
* The default event handler fired when the "iframe" property is changed.
*/
YAHOO.widget.Overlay.prototype.configIframe = function(type, args, obj) {
	var val = args[0];

	var el = this.element;

	//var x = this.cfg.getProperty("x");
	//var y = this.cfg.getProperty("y");
	
	var pos = YAHOO.util.Dom.getXY(this.element);

	//if (! x || ! y) {
	//	this.syncPosition();
	//	x = this.cfg.getProperty("x");
	//	y = this.cfg.getProperty("y");
	//}

	if (val) {
		if (! this.iframe) {
			this.iframe = document.createElement("iframe");
			
			var parent = el.parentNode;
			if (parent) {
				parent.appendChild(this.iframe);
			} else {
				document.body.appendChild(this.iframe);
			}

			this.iframe.src = this.imageRoot + YAHOO.widget.Overlay.IFRAME_SRC;
			YAHOO.util.Dom.setStyle(this.iframe, "position", "absolute");
			YAHOO.util.Dom.setStyle(this.iframe, "border", "none");
			YAHOO.util.Dom.setStyle(this.iframe, "margin", "0");
			YAHOO.util.Dom.setStyle(this.iframe, "padding", "0");
			YAHOO.util.Dom.setStyle(this.iframe, "opacity", "0");
		}

		var elementZ = parseInt(YAHOO.util.Dom.getStyle(el, "zIndex"));

		if (isNaN(elementZ) || elementZ <= 0) {
			this.cfg.setProperty("zIndex", 1);
		} else {
			this.cfg.setProperty("zIndex", elementZ, true);
		}

		//YAHOO.util.Dom.setStyle(this.iframe, "zIndex", (this.cfg.getProperty("zIndex") - 1));

		//YAHOO.util.Dom.setStyle(this.iframe, "left", x-2 + "px");
		//YAHOO.util.Dom.setStyle(this.iframe, "top", y-2 + "px");

		YAHOO.util.Dom.setXY(this.iframe, pos, true);

		var width = el.offsetWidth;
		var height = el.offsetHeight;

		YAHOO.util.Dom.setStyle(this.iframe, "width", (width+2) + "px");
		YAHOO.util.Dom.setStyle(this.iframe, "height", (height+2) + "px");

		if (! this.cfg.getProperty("visible")) {
			//alert("hidden z: " + (this.cfg.getProperty("zIndex") + 1));
			this.iframe.style.display = "none";
			//YAHOO.util.Dom.setStyle(this.iframe, "visibility", "hidden");
		} else {
			YAHOO.util.Dom.setStyle(this.iframe, "zIndex", (this.cfg.getProperty("zIndex") - 1));
			this.iframe.style.display = "block";
			this.iframe.style.opacity = (this.iframe.style.opacity != 0 ? 0: 1);
		}


	} else {
		if (this.iframe) {
			this.iframe.style.display = "none";
		}
	}
}

/**
* The default event handler fired when the "constraintoviewport" property is changed.
*/
YAHOO.widget.Overlay.prototype.configConstrainToViewport = function(type, args, obj) {
	var val = args[0];
	if (val) {
		if (! YAHOO.util.Config.alreadySubscribed(this.beforeMoveEvent, this.enforceConstraints, this)) {
			this.beforeMoveEvent.subscribe(this.enforceConstraints, this, true);
		}
	} else {
		this.beforeMoveEvent.unsubscribe(this.enforceConstraints, this);
	}
}

/**
* The default event handler fired when the "context" property is changed.
*/
YAHOO.widget.Overlay.prototype.configContext = function(type, args, obj) {
	var contextArgs = args[0];

	if (contextArgs) {
		var contextEl = contextArgs[0];
		var elementMagnetCorner = contextArgs[1];
		var contextMagnetCorner = contextArgs[2];

		if (contextEl) {
			if (typeof contextEl == "string") {
				this.cfg.setProperty("context", [document.getElementById(contextEl),elementMagnetCorner,contextMagnetCorner], true);
			}
			
			if (elementMagnetCorner && contextMagnetCorner) {
				this.align(elementMagnetCorner, contextMagnetCorner);
			}
		}	
	}
}


// END BUILT-IN PROPERTY EVENT HANDLERS //

/**
* Aligns the Overlay to its context element using the specified corner points (represented by the constants TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, and BOTTOM_RIGHT.
* @param {string} elementAlign		The string representing the corner of the Overlay that should be aligned to the context element
* @param {string} contextAlign		The corner of the context element that the elementAlign corner should stick to.
*/
YAHOO.widget.Overlay.prototype.align = function(elementAlign, contextAlign) {
	var contextArgs = this.cfg.getProperty("context");
	if (contextArgs) {
		var context = contextArgs[0];
		
		var element = this.element;
		var me = this;

		if (! elementAlign) {
			elementAlign = contextArgs[1];
		}

		if (! contextAlign) {
			contextAlign = contextArgs[2];
		}

		if (element && context) {
			var elementRegion = YAHOO.util.Dom.getRegion(element);
			var contextRegion = YAHOO.util.Dom.getRegion(context);

			var doAlign = function(v,h) {
				switch (elementAlign) {
					case YAHOO.widget.Overlay.TOP_LEFT:
						me.moveTo(h,v);
						break;
					case YAHOO.widget.Overlay.TOP_RIGHT:
						me.moveTo(h-element.offsetWidth,v);
						break;
					case YAHOO.widget.Overlay.BOTTOM_LEFT:
						me.moveTo(h,v-element.offsetHeight);
						break;
					case YAHOO.widget.Overlay.BOTTOM_RIGHT:
						me.moveTo(h-element.offsetWidth,v-element.offsetHeight);
						break;
				}
			}

			switch (contextAlign) {
				case YAHOO.widget.Overlay.TOP_LEFT:
					doAlign(contextRegion.top, contextRegion.left);
					break;
				case YAHOO.widget.Overlay.TOP_RIGHT:
					doAlign(contextRegion.top, contextRegion.right);
					break;		
				case YAHOO.widget.Overlay.BOTTOM_LEFT:
					doAlign(contextRegion.bottom, contextRegion.left);
					break;
				case YAHOO.widget.Overlay.BOTTOM_RIGHT:
					doAlign(contextRegion.bottom, contextRegion.right);
					break;
			}
		}
	}
}

/**
* The default event handler executed when the moveEvent is fired, if the "constraintoviewport" is set to true.
*/
YAHOO.widget.Overlay.prototype.enforceConstraints = function(type, args, obj) {
	var pos = args[0];

	var x = pos[0];
	var y = pos[1];

	var width = parseInt(this.cfg.getProperty("width"));

	if (isNaN(width)) {
		width = 0;
	}

	var offsetHeight = this.element.offsetHeight;
	var offsetWidth = (width>0?width:this.element.offsetWidth); //this.element.offsetWidth;

	var viewPortWidth = YAHOO.util.Dom.getViewportWidth();
	var viewPortHeight = YAHOO.util.Dom.getViewportHeight();

	var scrollX = window.scrollX || document.documentElement.scrollLeft;
	var scrollY = window.scrollY || document.documentElement.scrollTop;

	var topConstraint = scrollY + 10;
	var leftConstraint = scrollX + 10;
	var bottomConstraint = scrollY + viewPortHeight - offsetHeight - 10;
	var rightConstraint = scrollX + viewPortWidth - offsetWidth - 10;
	
	if (x < leftConstraint) {
		x = leftConstraint;
	} else if (x > rightConstraint) {
		x = rightConstraint;
	}

	if (y < topConstraint) {
		y = topConstraint;
	} else if (y > bottomConstraint) {
		y = bottomConstraint;
	}

	this.cfg.setProperty("x", x, true);
	this.cfg.setProperty("y", y, true);
	this.cfg.setProperty("xy", [x,y], true);
}

/**
* Centers the container in the viewport.
*/
YAHOO.widget.Overlay.prototype.center = function() {
	var scrollX = window.scrollX || document.documentElement.scrollLeft;
	var scrollY = window.scrollY || document.documentElement.scrollTop;

	var viewPortWidth = YAHOO.util.Dom.getClientWidth();
	var viewPortHeight = YAHOO.util.Dom.getClientHeight();

	var elementWidth = this.element.offsetWidth;
	var elementHeight = this.element.offsetHeight;

	var x = (viewPortWidth / 2) - (elementWidth / 2) + scrollX;
	var y = (viewPortHeight / 2) - (elementHeight / 2) + scrollY;
	
	this.element.style.left = x + "px";
	this.element.style.top = y + "px";
	
	this.syncPosition();
	//this.cfg.setProperty("xy", [x,y]);
	this.cfg.refireEvent("iframe");

	//this.cfg.setProperty("x", x, true);
	//this.cfg.setProperty("y", y, true);
}

/**
* Synchronizes the Panel's "xy", "x", and "y" properties with the Panel's position in the DOM. This is primarily used to update position information during drag & drop.
*/
YAHOO.widget.Overlay.prototype.syncPosition = function() {
	var pos = YAHOO.util.Dom.getXY(this.element);
	//;alert("sync:"+pos);
	this.cfg.setProperty("x", pos[0], true);
	this.cfg.setProperty("y", pos[1], true);
	this.cfg.setProperty("xy", pos, true);
}

/**
* Event handler fired when the resize monitor element is resized.
*/
YAHOO.widget.Overlay.prototype.onDomResize = function(e, obj) {
	YAHOO.widget.Overlay.superclass.onDomResize.call(this, e, obj);
	this.cfg.refireEvent("iframe");
}

YAHOO.widget.Overlay.windowScrollEvent = new YAHOO.util.CustomEvent("windowScroll");
YAHOO.widget.Overlay.windowResizeEvent = new YAHOO.util.CustomEvent("windowResize");

YAHOO.widget.Overlay.windowScrollHandler = function() {
	YAHOO.widget.Overlay.windowScrollEvent.fire();
}

YAHOO.widget.Overlay.windowResizeHandler = function() {
	YAHOO.widget.Overlay.windowResizeEvent.fire();
}

YAHOO.util.Event.addListener(window, "scroll", YAHOO.widget.Overlay.windowScrollHandler);
YAHOO.util.Event.addListener(window, "resize", YAHOO.widget.Overlay.windowResizeHandler);

YAHOO.widget.Overlay.prototype.hideMacGeckoScrollbars = function() {
	YAHOO.util.Dom.addClass(this.element, "hide-scrollbars");
}

YAHOO.widget.Overlay.prototype.showMacGeckoScrollbars = function() {
	YAHOO.util.Dom.removeClass(this.element, "hide-scrollbars");
}