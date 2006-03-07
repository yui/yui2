/**
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
Version: 0.10.0
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
	YAHOO.widget.Overlay.superclass.init.call(this, el/*, userConfig*/);  // Note that we don't pass the user config in here yet because we only want it executed once, at the lowest subclass level
	
	this.element.className = YAHOO.widget.Tooltip.CSS_TOOLTIP;

	if (userConfig) {
		this.cfg.applyConfig(userConfig);
	}

	this.cfg.setProperty("visible",false);
	this.cfg.setProperty("constraintoviewport",true);

	this.render(document.body);
}

/**
* Initializes the class's configurable properties which can be changed using the Overlay's Config object (cfg).
*/
YAHOO.widget.Tooltip.prototype.initDefaultConfig = function() {
	YAHOO.widget.Tooltip.superclass.initDefaultConfig.call(this);
	
	this.cfg.addProperty("showdelay",			2000,	this.configShowDelay,			this.cfg.checkNumber);
	this.cfg.addProperty("autodismissdelay",	5000,	this.configAutoDismissDelay,	this.cfg.checkNumber);
	this.cfg.addProperty("hidedelay",			250,	this.configHideDelay,			this.cfg.checkNumber);

	this.cfg.addProperty("text",	null, this.configText,		null, null, true);
	this.cfg.addProperty("context",	null, this.configContext,	null, null, true);
}

// BEGIN BUILT-IN PROPERTY EVENT HANDLERS //

/**
* The default event handler fired when the "text" property is changed.
*/
YAHOO.widget.Tooltip.prototype.configText = function(type, args, obj) {
	var text = args[0];
	if (text) {
		this.text = text;
		this.setBody(this.text);
	}
}

/**
* The default event handler fired when the "context" property is changed.
*/
YAHOO.widget.Tooltip.prototype.configContext = function(type, args, obj) {
	var context = args[0];
	if (context) {
		if (typeof context == "string") {
			this.context = document.getElementById(context);
		} else {
			this.context = context;
		}

		if (this.context && this.context.title && ! this.cfg.getProperty("text")) {
			this.cfg.setProperty("text", this.context.title);
		}

		YAHOO.util.Event.addListener(this.context, "mouseover", this.onContextMouseOver, this);
		YAHOO.util.Event.addListener(this.context, "mouseout", this.onContextMouseOut, this);
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

	
	if (obj.context.title) {
		obj.tempTitle = obj.context.title;
		obj.context.title = "";
	}

	/**
	* The unique process ID associated with the thread responsible for showing the Tooltip.
	* @type int
	*/
	this.procId = obj.doShow(e);
}

/**
* The default event handler fired when the user mouses out of thhe context element.
* @param {DOMEvent} e	The current DOM event
* @param {object}	obj	The object argument
*/
YAHOO.widget.Tooltip.prototype.onContextMouseOut = function(e, obj) {
	if (! obj) {
		obj = this;
	}
	
	if (obj.tempTitle) {
		obj.context.title = obj.tempTitle;
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

	var me = this;
	return setTimeout(
		function() {
			var yOffset = 25;
			if (me.browser == "opera" && me.context.tagName == "A") {
				yOffset += 12;
			}
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

