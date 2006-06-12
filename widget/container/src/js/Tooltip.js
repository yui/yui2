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

		this.beforeInitEvent.fire(YAHOO.widget.Tooltip);

		YAHOO.util.Dom.addClass(this.element, YAHOO.widget.Tooltip.CSS_TOOLTIP);

		if (userConfig) {
			this.cfg.applyConfig(userConfig, true);
		}
		
		this.cfg.queueProperty("visible",false);
		this.cfg.queueProperty("constraintoviewport",true);

		this.setBody("");
		this.render(this.cfg.getProperty("container"));

		this.initEvent.fire(YAHOO.widget.Tooltip);
	}
}

/**
* Initializes the class's configurable properties which can be changed using the Overlay's Config object (cfg).
*/
YAHOO.widget.Tooltip.prototype.initDefaultConfig = function() {
	YAHOO.widget.Tooltip.superclass.initDefaultConfig.call(this);

	this.cfg.addProperty("preventoverlap",		{ value:true, validator:this.cfg.checkBoolean, supercedes:["x","y","xy"] } );

	this.cfg.addProperty("showdelay",			{ value:200, handler:this.configShowDelay, validator:this.cfg.checkNumber } );
	this.cfg.addProperty("autodismissdelay",	{ value:5000, handler:this.configAutoDismissDelay, validator:this.cfg.checkNumber } );
	this.cfg.addProperty("hidedelay",			{ value:250, handler:this.configHideDelay, validator:this.cfg.checkNumber } );

	this.cfg.addProperty("text",				{ handler:this.configText, suppressEvent:true } );
	this.cfg.addProperty("container",			{ value:document.body, handler:this.configContainer } );
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
* The default event handler fired when the "preventoverlap" property is changed.

YAHOO.widget.Tooltip.prototype.configPreventOverlap = function(type, args, obj) {
	var preventoverlap = args[0];
	if (preventoverlap) {
		if (! YAHOO.util.Config.alreadySubscribed(this.moveEvent, this.preventOverlap, this)) {
			this.moveEvent.subscribe(this.preventOverlap, this, true);
		}
	} else {
		this.moveEvent.unsubscribe(this.preventOverlap, this);
	}
}
*/

/**
* The default event handler fired when the "context" property is changed.
*/
YAHOO.widget.Tooltip.prototype.configContext = function(type, args, obj) {
	var context = args[0];
	if (context) {
		
		// Normalize parameter into an array
		if (! (context instanceof Array)) {
			if (typeof context == "string") {
				this.cfg.setProperty("context", [document.getElementById(context)], true);
			} else { // Assuming this is an element
				this.cfg.setProperty("context", [context], true);
			}
			context = this.cfg.getProperty("context");
		}


		// Remove any existing mouseover/mouseout listeners
		if (this._context) {
			for (var c=0;c<this._context.length;++c) {
				var el = this._context[c];
				YAHOO.util.Event.removeListener(el, "mouseover", this.onContextMouseOver);
				YAHOO.util.Event.removeListener(el, "mouseout", this.onContextMouseOut);
			}
		}

		// Add mouseover/mouseout listeners to context elements
		this._context = context;
		for (var c=0;c<this._context.length;++c) {
			var el = this._context[c];
			YAHOO.util.Event.addListener(el, "mouseover", this.onContextMouseOver, this);
			YAHOO.util.Event.addListener(el, "mouseout", this.onContextMouseOut, this);
		}
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
	var context = this;

	if (context.title) {
		obj._tempTitle = context.title;
		context.title = "";
		obj.setBody(obj._tempTitle);
	} else {
		obj.cfg.refireEvent("text");
	}

	/**
	* The unique process ID associated with the thread responsible for showing the Tooltip.
	* @type int
	*/
	this.procId = obj.doShow(e, context);
}

/**
* The default event handler fired when the user mouses out of the context element.
* @param {DOMEvent} e	The current DOM event
* @param {object}	obj	The object argument
*/
YAHOO.widget.Tooltip.prototype.onContextMouseOut = function(e, obj) {
	var el = this;

	if (obj._tempTitle) {
		el.title = obj._tempTitle;
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
YAHOO.widget.Tooltip.prototype.doShow = function(e, context) {

	var pageX = YAHOO.util.Event.getPageX(e);
	var pageY = YAHOO.util.Event.getPageY(e);
	
	var yOffset = 25;
	if (this.browser == "opera" && context.tagName == "A") {
		yOffset += 12;
	}

	var me = this;
	return setTimeout(
		function() {
			me.moveTo(pageX, pageY + yOffset);
			if (me.cfg.getProperty("preventoverlap")) {
				me.preventOverlap(context);
			}
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
YAHOO.widget.Tooltip.prototype.preventOverlap = function(context) {
	var pos = this.cfg.getProperty("xy");
	var x = pos[0];
	var y = pos[1];

	var elementRegion = YAHOO.util.Dom.getRegion(this.element);
	var contextRegion = YAHOO.util.Dom.getRegion(context);
	
	var intersection = contextRegion.intersect(elementRegion);
	if (intersection) { // they overlap
		var overlapHeight = intersection.bottom - intersection.top;
		y = (y - overlapHeight - 10);
		this.cfg.setProperty("y", y);
	}
}

YAHOO.widget.Tooltip.prototype.toString = function() {
	return "Tooltip " + this.id;
}