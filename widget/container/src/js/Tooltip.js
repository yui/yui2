/**
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
* @class
* Tooltip is an implementation of Overlay that behaves like an OS tooltip, displaying when the user mouses over a particular element, and disappearing on mouse out.
* @param {string}	el	The element ID representing the Tooltip <em>OR</em>
* @param {Element}	el	The element representing the Tooltip
* @param {object}	userConfig	The configuration object literal containing the configuration that should be set for this Overlay. See configuration documentation for more details.
* @constructor
*/
YAHOO.widget.Tooltip = function(el, userConfig) {
	if (arguments.length > 0) {
		YAHOO.widget.Tooltip.superclass.constructor.call(this, el, userConfig);
	}
}

YAHOO.widget.Tooltip.prototype = new YAHOO.widget.Overlay();
YAHOO.widget.Tooltip.prototype.constructor = YAHOO.widget.Tooltip;

/**
* Reference to the Tooltip's superclass, Overlay
* @type class
* @final
*/
YAHOO.widget.Tooltip.superclass = YAHOO.widget.Overlay.prototype;

/**
* Constant representing the Tooltip CSS class
* @type string
* @final
*/
YAHOO.widget.Tooltip.CSS_TOOLTIP = "tt";

/*
* The Tooltip initialization method. This method is automatically called by the constructor. A Tooltip is automatically rendered by the init method, and it also is set to be invisible by default, and constrained to viewport by default as well.
* @param {string}	el	The element ID representing the Tooltip <em>OR</em>
* @param {Element}	el	The element representing the Tooltip
* @param {object}	userConfig	The configuration object literal containing the configuration that should be set for this Tooltip. See configuration documentation for more details.
*/
YAHOO.widget.Tooltip.prototype.init = function(el, userConfig) {
	if (document.readyState && document.readyState != "complete") {
		var deferredInit = function() {
			this.init(el, userConfig);
		}
		YAHOO.util.Event.addListener(window, "load", deferredInit, this, true);
	} else {
		YAHOO.widget.Tooltip.superclass.init.call(this, el);

		YAHOO.util.Dom.addClass(this.element, YAHOO.widget.Tooltip.CSS_TOOLTIP);

		if (userConfig) {
			this.cfg.applyConfig(userConfig);
		}

		this.moveEvent.subscribe(this.preventOverlap, this, true);
		this.cfg.setProperty("visible",false);
		this.cfg.setProperty("constraintoviewport",true);
		this.render(this.cfg.getProperty("container"));
	}
}

/**
* Initializes the class's configurable properties which can be changed using the Overlay's Config object (cfg).
*/
YAHOO.widget.Tooltip.prototype.initDefaultConfig = function() {
	YAHOO.widget.Tooltip.superclass.initDefaultConfig.call(this);
	
	this.cfg.addProperty("showdelay",			200,	this.configShowDelay,			this.cfg.checkNumber);
	this.cfg.addProperty("autodismissdelay",	5000,	this.configAutoDismissDelay,	this.cfg.checkNumber);
	this.cfg.addProperty("hidedelay",			250,	this.configHideDelay,			this.cfg.checkNumber);

	this.cfg.addProperty("text",				null,	this.configText,				null, null, true);
	this.cfg.addProperty("container",			document.body, this.configContainer);
}

// BEGIN BUILT-IN PROPERTY EVENT HANDLERS //

/**
* The default event handler fired when the "text" property is changed.
*/
YAHOO.widget.Tooltip.prototype.configText = function(type, args, obj) {
	var text = args[0];
	if (text) {
		this.setBody(text);
	}
}

/**
* The default event handler fired when the "container" property is changed.
*/
YAHOO.widget.Tooltip.prototype.configContainer = function(type, args, obj) {
	var container = args[0];
	if (typeof container == 'string') {
		this.cfg.setProperty("container", document.getElementById(container), true);
	}
}

/**
* The default event handler fired when the "context" property is changed.
*/
YAHOO.widget.Tooltip.prototype.configContext = function(type, args, obj) {
	var context = args[0];
	if (context) {
		if (typeof context == "string") {
			this.cfg.setProperty("context", document.getElementById(context), true);
		}
		
		var contextElement = this.cfg.getProperty("context");

		if (contextElement && contextElement.title && ! this.cfg.getProperty("text")) {
			this.cfg.setProperty("text", contextElement.title);
		}

		YAHOO.util.Event.addListener(contextElement, "mouseover", this.onContextMouseOver, this);
		YAHOO.util.Event.addListener(contextElement, "mouseout", this.onContextMouseOut, this);
	}
}

// END BUILT-IN PROPERTY EVENT HANDLERS //

// BEGIN BUILT-IN DOM EVENT HANDLERS //

/**
* The default event handler fired when the user mouses over the context element.
* @param {DOMEvent} e	The current DOM event
* @param {object}	obj	The object argument
*/
YAHOO.widget.Tooltip.prototype.onContextMouseOver = function(e, obj) {
	if (! obj) {
		obj = this;
	}
	
	var context = obj.cfg.getProperty("context");
	
	if (context.title) {
		obj.tempTitle = context.title;
		context.title = "";
	}

	/**
	* The unique process ID associated with the thread responsible for showing the Tooltip.
	* @type int
	*/
	this.procId = obj.doShow(e);
}

/**
* The default event handler fired when the user mouses out of the context element.
* @param {DOMEvent} e	The current DOM event
* @param {object}	obj	The object argument
*/
YAHOO.widget.Tooltip.prototype.onContextMouseOut = function(e, obj) {
	if (! obj) {
		obj = this;
	}

	var context = obj.cfg.getProperty("context");

	if (obj.tempTitle) {
		context.title = obj.tempTitle;
	}
	
	if (this.procId) {
		clearTimeout(this.procId);
	}

	setTimeout(function() {
				obj.hide();
				}, obj.cfg.getProperty("hidedelay"));
}

// END BUILT-IN DOM EVENT HANDLERS //

/**
* Processes the showing of the Tooltip by setting the timeout delay and offset of the Tooltip.
* @param {DOMEvent} e	The current DOM event
* @return {int}	The process ID of the timeout function associated with doShow
*/
YAHOO.widget.Tooltip.prototype.doShow = function(e) {

	var pageX = YAHOO.util.Event.getPageX(e);
	var pageY = YAHOO.util.Event.getPageY(e);
	
	var context = this.cfg.getProperty("context");
	var yOffset = 25;
	if (this.browser == "opera" && context.tagName == "A") {
		yOffset += 12;
	}

	var me = this;
	return setTimeout(
		function() {
			me.moveTo(pageX, pageY + yOffset);
			me.show();
			me.doHide();
		},
	this.cfg.getProperty("showdelay"));
}

/**
* Sets the timeout for the auto-dismiss delay, which by default is 5 seconds, meaning that a tooltip will automatically dismiss itself after 5 seconds of being displayed.
*/
YAHOO.widget.Tooltip.prototype.doHide = function() {
	var me = this;
	setTimeout(
		function() {
			me.hide();
		},
		this.cfg.getProperty("autodismissdelay"));
}

/**
* Fired when the Tooltip is moved, this event handler is used to prevent the Tooltip from overlapping with its context element.
*/
YAHOO.widget.Tooltip.prototype.preventOverlap = function(type, args, obj) {
	var pos = args[0];
	var x = pos[0];
	var y = pos[1];

	var elementRegion = YAHOO.util.Dom.getRegion(this.element);
	var contextRegion = YAHOO.util.Dom.getRegion(this.cfg.getProperty("context"));
	
	var intersection = contextRegion.intersect(elementRegion);
	if (intersection) { // they overlap
		var overlapHeight = intersection.bottom - intersection.top;
		y = (y - overlapHeight - 10);
		this.cfg.setProperty("y", y);
	}
}
