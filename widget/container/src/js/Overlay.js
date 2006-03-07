/**
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
Version: 0.10.0
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

/*
* The Overlay initialization method, which is executed for Overlay and all of its subclasses. This method is automatically called by the constructor, and  sets up all DOM references for pre-existing markup, and creates required markup if it is not already present.
* @param {string}	el	The element ID representing the Overlay <em>OR</em>
* @param {Element}	el	The element representing the Overlay
* @param {object}	userConfig	The configuration object literal containing the configuration that should be set for this Overlay. See configuration documentation for more details.
*/
YAHOO.widget.Overlay.prototype.init = function(el, userConfig) {
	YAHOO.widget.Overlay.superclass.init.call(this, el/*, userConfig*/);  // Note that we don't pass the user config in here yet because we only want it executed once, at the lowest subclass level

	this.renderEvent.subscribe(this.cfg.refresh, this.cfg, true);

	if (userConfig) {
		this.cfg.applyConfig(userConfig, true);
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
	
	/**
	* A string representing the current browser, as determined by the user-agent
	* @type string
	*/
	this.browser = function() {
		  var ua = navigator.userAgent.toLowerCase();
		  
		  if (ua.indexOf('opera')!=-1) // Opera (check first in case of spoof)
			 return 'opera';
		  else if (ua.indexOf('msie')!=-1) // IE
			 return 'ie';
		  else if (ua.indexOf('safari')!=-1) // Safari (check before Gecko because it includes "like Gecko")
			 return 'safari';
		  else if (ua.indexOf('gecko') != -1) // Gecko
			 return 'gecko';
		 else
		  return false;
	}();

	// Add overlay config properties //

	this.cfg.addProperty("x", null, this.configX, this.cfg.checkNumber, this.container || this.element, true);
	this.cfg.addProperty("y", null, this.configY, this.cfg.checkNumber, this.container || this.element, true);
	this.cfg.addProperty("xy", null, this.configXY, null, this.container || this.element, true);

	this.cfg.addProperty("width", "auto", this.configWidth, null, this.container || this.element);
	this.cfg.addProperty("height", "auto", this.configHeight, null, this.container || this.element);

	this.cfg.addProperty("zIndex", null, this.configzIndex, this.cfg.checkNumber, this.container || this.element, true);

	this.cfg.addProperty("constraintoviewport", false, this.configConstrainToViewport, this.cfg.checkBoolean);
	this.cfg.addProperty("iframe", (this.browser == "ie" ? true : false), this.configIframe, this.cfg.checkBoolean, this.container || this.element);
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
* The default event handler fired when the "visible" property is changed.
*/
YAHOO.widget.Overlay.prototype.configVisible = function(type, args, obj) {
	var val = args[0];
	if (! val) {
		YAHOO.util.Dom.setStyle(this.container || this.element, "visibility", "hidden");
		if (this.iframe) {
			YAHOO.util.Dom.setStyle(this.iframe, "visibility", "hidden");
		}
	} else {
		YAHOO.util.Dom.setStyle(this.container || this.element, "visibility", "visible");
		if (this.iframe) {
			YAHOO.util.Dom.setStyle(this.iframe, "visibility", "visible");
		}
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
}

/**
* The default event handler fired when the "zIndex" property is changed.
*/
YAHOO.widget.Overlay.prototype.configzIndex = function(type, args, obj) {
	var zIndex = args[0];
	var el = this.container || this.element;

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

	YAHOO.util.Dom.setXY(this.container || this.element, [x,y]);

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

	YAHOO.util.Dom.setX(this.container || this.element, x);
	this.cfg.setProperty("xy", [x, y], true);

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

	YAHOO.util.Dom.setY(this.container || this.element, y);
	this.cfg.setProperty("xy", [x, y], true);

	this.moveEvent.fire([x, y]);
}

/**
* The default event handler fired when the "iframe" property is changed.
*/
YAHOO.widget.Overlay.prototype.configIframe = function(type, args, obj) {
	var val = args[0];
	var el = this.container || this.element;

	if (val) {
		if (! this.iframe) {
			this.iframe = document.createElement("iframe");
			document.body.appendChild(this.iframe);
			YAHOO.util.Dom.setStyle(this.iframe, "position", "absolute");
			YAHOO.util.Dom.setStyle(this.iframe, "zIndex", "0");
			YAHOO.util.Dom.setStyle(this.iframe, "opacity", "0");
		} else {
			this.iframe.style.display = "block";
		}
		
		if (YAHOO.util.Dom.getStyle(el, "zIndex") <= 0) {
			YAHOO.util.Dom.setStyle(el, "zIndex", 1);
		}

		YAHOO.util.Dom.setStyle(this.iframe, "top", YAHOO.util.Dom.getXY(el)[1]-2 + "px");
		YAHOO.util.Dom.setStyle(this.iframe, "left", YAHOO.util.Dom.getXY(el)[0]-2 + "px");

		var width = el.offsetWidth;
		var height = el.offsetHeight;

		YAHOO.util.Dom.setStyle(this.iframe, "width", width + "px");
		YAHOO.util.Dom.setStyle(this.iframe, "height", height + "px");
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
		this.beforeMoveEvent.subscribe(this.enforceConstraints, this, true);
	} else {
		this.beforeMoveEvent.unsubscribe(this.enforceConstraints, this);
	}
}

// END BUILT-IN PROPERTY EVENT HANDLERS //

/**
* The default event handler executed when the moveEvent is fired, if the "constraintoviewport" is set to true.
*/
YAHOO.widget.Overlay.prototype.enforceConstraints = function(type, args, obj) {
	var pos = args[0];

	var bod = document.getElementsByTagName('body')[0];
	var htm = document.getElementsByTagName('html')[0];
	
	var bodyOverflow = YAHOO.util.Dom.getStyle(bod, "overflow");
	var htmOverflow = YAHOO.util.Dom.getStyle(htm, "overflow");

	var x = pos[0];
	var y = pos[1];

	var offsetHeight = this.element.offsetHeight;
	var offsetWidth = this.element.offsetWidth;

	var viewPortWidth = YAHOO.util.Dom.getClientWidth();
	var viewPortHeight = YAHOO.util.Dom.getClientHeight();

	var scrollX = window.scrollX || document.body.scrollLeft;
	var scrollY = window.scrollY || document.body.scrollTop;

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
}
