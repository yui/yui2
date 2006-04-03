/**
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
* @class
* Panel is an implementation of Overlay that behaves like an OS window, with a draggable header and an optional close icon at the top right.
* @param {string}	el	The element ID representing the Panel <em>OR</em>
* @param {Element}	el	The element representing the Panel
* @param {object}	userConfig	The configuration object literal containing the configuration that should be set for this Panel. See configuration documentation for more details.
* @constructor
*/
YAHOO.widget.Panel = function(el, userConfig) {
	if (arguments.length > 0) {
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

/**
* Constant representing the default CSS class used for a Panel
* @type string
* @final
*/
YAHOO.widget.Panel.CSS_PANEL = "panel";

/*
* The Overlay initialization method, which is executed for Overlay and all of its subclasses. This method is automatically called by the constructor, and  sets up all DOM references for pre-existing markup, and creates required markup if it is not already present.
* @param {string}	el	The element ID representing the Overlay <em>OR</em>
* @param {Element}	el	The element representing the Overlay
* @param {object}	userConfig	The configuration object literal containing the configuration that should be set for this Overlay. See configuration documentation for more details.
*/
YAHOO.widget.Panel.prototype.init = function(el, userConfig) {
	YAHOO.widget.Panel.superclass.init.call(this, el/*, userConfig*/);  // Note that we don't pass the user config in here yet because we only want it executed once, at the lowest subclass level
	
	YAHOO.util.Dom.addClass(this.element, YAHOO.widget.Panel.CSS_PANEL);

	this.buildWrapper();			
	
	if (userConfig) {
		this.cfg.applyConfig(userConfig, true);
	}

	YAHOO.util.Event.addListener(window, "resize", this.onWindowResize, this, true);
}

/**
* Initializes the custom events for Module which are fired automatically at appropriate times by the Module class.
*/
YAHOO.widget.Panel.prototype.initEvents = function() {
	YAHOO.widget.Panel.superclass.initEvents.call(this);

	this.showMaskEvent = new YAHOO.util.CustomEvent("showMask");
	this.hideMaskEvent = new YAHOO.util.CustomEvent("hideMask");
}

/**
* Initializes the class's configurable properties which can be changed using the Panel's Config object (cfg).
*/
YAHOO.widget.Panel.prototype.initDefaultConfig = function() {
	YAHOO.widget.Panel.superclass.initDefaultConfig.call(this);

	// Add panel config properties //
	this.cfg.addProperty("close",	true,	this.configClose,	this.cfg.checkBoolean);
	this.cfg.addProperty("draggable", true,	this.configDraggable,	this.cfg.checkBoolean);

	this.cfg.addProperty("underlay",	"shadow", this.configUnderlay, null, this.element);
	this.cfg.addProperty("modal",	false,	this.configModal,	this.cfg.checkBoolean, this.element);

	this.cfg.addProperty("keyListeners", null, this.configkeyListeners);
}

// BEGIN BUILT-IN PROPERTY EVENT HANDLERS //

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
			YAHOO.util.Dom.addClass(this.close, "close");

			if (this.isSecure) {
				YAHOO.util.Dom.addClass(this.close, "secure");
			} else {
				YAHOO.util.Dom.addClass(this.close, "nonsecure");
			}

			this.close.innerHTML = "&nbsp;";
			this.innerElement.appendChild(this.close);
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
		YAHOO.util.Dom.setStyle(this.header,"cursor","move");
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
			YAHOO.util.Dom.removeClass(this.element, "matte");
			YAHOO.util.Dom.addClass(this.element, "shadow");

			if (! this.underlay) { // create if not already in DOM
				this.underlay = document.createElement("DIV");
				this.underlay.className = "underlay";
				this.underlay.innerHTML = "&nbsp;";
				this.element.appendChild(this.underlay);
			} 
			this.sizeUnderlay();
			break;
		case "matte":
			YAHOO.util.Dom.removeClass(this.element, "shadow");
			YAHOO.util.Dom.addClass(this.element, "matte");
			break;
		case "none":
		default:
			YAHOO.util.Dom.removeClass(this.element, "shadow");
			YAHOO.util.Dom.removeClass(this.element, "matte");
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
		var effect = this.cfg.getProperty("effect");
		var visible = this.cfg.getProperty("visible");
		
		if (visible) {
			this.showMask();
		}

		if (effect && this.effects.length > 0) {
			var firstEffect = this.effects[0];
			
			this.showEvent.unsubscribe(this.showMask, this);
			this.hideEvent.unsubscribe(this.hideMask, this);

			firstEffect.beforeAnimateInEvent.subscribe(this.showMask, this, true);
			firstEffect.animateOutCompleteEvent.subscribe(this.hideMask, this, true);

		} else {
			this.showEvent.subscribe(this.showMask, this, true);
			this.hideEvent.subscribe(this.hideMask, this, true);
		}
	}
}

YAHOO.widget.Panel.prototype.configkeyListeners = function(type, args, obj) {
	var handlers = args[0];

	if (handlers) {
		var dupeCheck = function(evt, fn, obj) {
			for (var e=0;e<evt.subscribers.length;e++) {
				var subsc = evt.subscribers[e];
				if (subsc.obj == obj && subsc.fn == fn) {
					return true;
					break;
				}
			}
			return false;
		}

		if (handlers instanceof Array) {
			for (var i=0;i<handlers.length;i++) {
				var handler = handlers[i];

				if (! dupeCheck(this.showEvent, handler.enable, handler)) {
					this.showEvent.subscribe(handler.enable, handler, true);
				}
				if (! dupeCheck(this.hideEvent, handler.disable, handler)) {
					this.hideEvent.subscribe(handler.disable, handler, true);
				}
			}
		} else {
			if (! dupeCheck(this.showEvent, handlers.enable, handlers)) {
				this.showEvent.subscribe(handlers.enable, handlers, true);
			}
			if (! dupeCheck(this.hideEvent, handlers.disable, handlers)) {
				this.hideEvent.subscribe(handlers.disable, handlers, true);
			}
		}
	} 
}

// END BUILT-IN PROPERTY EVENT HANDLERS //


/**
* Builds the wrapping container around the Panel that is used for positioning the shadow and matte underlays. The container element is assigned to a  local instance variable called container, and the element is reinserted inside of it.
*/
YAHOO.widget.Panel.prototype.buildWrapper = function() {
	var elementParent = this.element.parentNode;

	var elementClone = this.element.cloneNode(true);
	this.innerElement = elementClone;
	this.innerElement.style.visibility = "inherit";

	YAHOO.util.Dom.addClass(this.innerElement, "panel");

	var wrapper = document.createElement("DIV");
	wrapper.className = "panel-container";
	wrapper.id = elementClone.id + "_c";
	
	wrapper.appendChild(elementClone);
	
	if (elementParent) {
		elementParent.replaceChild(wrapper, this.element);
	}

	this.element = wrapper;

	// Resynchronize the local field references

	var childNodes = this.innerElement.childNodes;
	if (childNodes) {
		for (var i=0;i<childNodes.length;i++) {
			var child = childNodes[i];
			switch (child.className) {
				case YAHOO.widget.Module.CSS_HEADER:
					this.header = child;
					break;
				case YAHOO.widget.Module.CSS_BODY:
					this.body = child;
					break;
				case YAHOO.widget.Module.CSS_FOOTER:
					this.footer = child;
					break;
			}
		}
	}

	this.initDefaultConfig(); // We've changed the DOM, so the configuration must be re-tooled to get the DOM references right
}

/**
* Adjusts the size of the shadow based no the size of the element.
*/
YAHOO.widget.Panel.prototype.sizeUnderlay = function() {
	if (this.underlay && this.browser != "gecko" && this.browser != "safari") {
		this.underlay.style.width = this.innerElement.offsetWidth + "px";
		this.underlay.style.height = this.innerElement.offsetHeight + "px";
	}
}

/**
* Event handler fired when the resize monitor element is resized.
*/
YAHOO.widget.Panel.prototype.onDomResize = function(e, obj) { 
	YAHOO.widget.Panel.superclass.onDomResize.call(this, e, obj);
	var me = this;
	setTimeout(function() {
		me.sizeUnderlay();
	}, 0);
};

YAHOO.widget.Panel.prototype.onWindowResize = function(e, obj) {
	if (this.cfg.getProperty("modal")) {
		this.sizeMask();
	}
}

/**
* Registers the Panel's header for drag & drop capability.
*/
YAHOO.widget.Panel.prototype.registerDragDrop = function() {
	if (this.header) {
		this.dd = new YAHOO.util.DD(this.element.id, "panel");

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
	if (this.cfg.getProperty("modal") && this.mask) {
		this.mask.style.display = "none";
		this.mask.style.width = "1px";
		this.mask.style.height = "1px";

		YAHOO.util.Dom.removeClass(document.body, "masked");

		switch (this.browser) {
			case "ie":
			case "ie7":
				document.documentElement.style.overflowX = "auto";
				document.documentElement.style.overflowY = "scroll";
				break;
			case "gecko":
				document.body.style.overflowX = "auto";
				document.body.style.overflowY = "auto";
				break;
			default:
				document.body.style.overflow = "auto"; 
				break;
		}

		this.hideMaskEvent.fire();
	}
}

/**
* Shows the modality mask.
*/
YAHOO.widget.Panel.prototype.showMask = function() {
	if (this.cfg.getProperty("modal") && this.mask) {
		switch (this.browser) {
			case "ie":
			case "ie7":
				document.documentElement.style.overflowX = "hidden";
				document.documentElement.style.overflowY = "hidden";	
				break;
			case "gecko":
				document.body.style.overflowX = "hidden";
				document.body.style.overflowY = "hidden";
				break;
			default:
				document.body.style.overflow = "hidden"; 
				break;
		}

		this.sizeMask();

		YAHOO.util.Dom.addClass(document.body, "masked");
		this.mask.style.display = "block";

		this.showMaskEvent.fire();
	}
}

YAHOO.widget.Panel.prototype.sizeMask = function() {
	if (this.mask) {
		var clientHeight = YAHOO.util.Dom.getClientHeight();
		var scrollHeight = document.body.scrollHeight;

		switch (this.browser) {
			case "ie":
			case "ie7":
				this.mask.style.width = "110%";
				this.mask.style.height = (scrollHeight > clientHeight ? scrollHeight : clientHeight)+ "px";
				break;
			case "gecko":
				this.mask.style.width = "110%";
				this.mask.style.height = "100%";
				break;
			default:
				this.mask.style.width = "110%";
				this.mask.style.height = "100%";
				break;
		}
	}
}

/**
* The default event handler fired when the "height" property is changed.
*/
YAHOO.widget.Panel.prototype.configHeight = function(type, args, obj) {
	var height = args[0];
	var el = this.innerElement;
	YAHOO.util.Dom.setStyle(el, "height", height);
	this.cfg.refireEvent("underlay");
	this.cfg.refireEvent("iframe");
}

/**
* The default event handler fired when the "width" property is changed.
*/
YAHOO.widget.Panel.prototype.configWidth = function(type, args, obj) {
	var width = args[0];
	var el = this.innerElement;
	YAHOO.util.Dom.setStyle(el, "width", width);
	this.cfg.refireEvent("underlay");
	this.cfg.refireEvent("iframe");
	this.cfg.refireEvent("context");
}

YAHOO.widget.Panel.prototype.render = function(appendToNode) {
	this.beforeRenderEvent.fire();

	var me = this;
	var appendTo = function(element) {
		if (typeof element == "string") {
			element = document.getElementById(element);
		}
		
		if (element) {
			element.appendChild(me.element);
			me.appendEvent.fire();
		}
	}

	if (appendToNode) {
		if (typeof appendToNode == "string") {
			el = document.getElementById(el);
			if (! el) {
				el = document.createElement("DIV");
				el.id = elId;
			}
		}
		appendTo(appendToNode);
	} else { // No node was passed in. If the element is not pre-marked up, this fails
		if (! YAHOO.util.Dom.inDocument(this.element)) {
			return false;
		}
	}

	// Need to get everything into the DOM if it isn't already
	
	if ((! this.childNodesInDOM[0]) && this.header) {
		// There is a header, but it's not in the DOM yet... need to add it
		var firstChild = this.innerElement.firstChild;
		if (firstChild) { // Insert before first child if exists
			this.innerElement.insertBefore(this.header, firstChild);
		} else { // Append to empty body because there are no children
			this.innerElement.appendChild(this.header);
		}
	}

	if ((! this.childNodesInDOM[1]) && this.body) {
		// There is a body, but it's not in the DOM yet... need to add it
		if (this.childNodesInDOM[2]) { // Insert before footer if exists in DOM
			this.innerElement.insertBefore(this.body, this.childNodesInDOM[2]);
		} else { // Append to element because there is no footer
			this.innerElement.appendChild(this.body);
		}
	}

	if ((! this.childNodesInDOM[2]) && this.footer) {
		// There is a footer, but it's not in the DOM yet... need to add it
		this.innerElement.appendChild(this.footer);
	}
	
	this.cfg.fireDeferredEvents();

	this.renderEvent.fire();
	return true;
}