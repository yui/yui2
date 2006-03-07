/**
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
Version: 0.10.0
* @class 
* Config is a utility used within an object to allow the implementer to maintain a list of local configuration properties and listen for changes to those properties dynamically using CustomEvent. The initial values are also maintained so that the configuration can be reset at any given point to its initial state.
* @param {object}	owner	The owner object to which this Config object belongs
* @constructor
*/
YAHOO.util.Config = function(owner) {
	if (owner) {
		this.init(owner);
	}
}

/**
* Initializes the configuration object and all of its local members.
* @param {object}	owner	The owner object to which this Config object belongs
*/
YAHOO.util.Config.prototype.init = function(owner) {

	this.owner = owner;
	this.configChangedEvent = new YAHOO.util.CustomEvent("configChanged");

	/* Private Members */

	var config = {};
	var deferredEvents = {};
	var initialConfig = {};

	/**
	* @private
	* Fires a configuration property event using the specified value. If the property has a DOM dependency specified in its configuration, the event will be deferred. All deferred events can be fired by a call to the Config object's fireDeferredEvents method.
	* @param {string}	key			The configuration property's name
	* @param {property}	property	The property object for which to fire the event
	* @param {value}	object		The value of the correct type for the property
	*/ 
	var fireEvent = function(key, property, value) {
		if (property.dependentElement && ! YAHOO.util.Dom._elementInDom(property.dependentElement)) { // Can't fire this event yet
			deferredEvents[key] = { args : value };
			return true;
		} else {
			if (property.mustChange) {
				if (property.defaultValue != property.value) {
					property.event.fire(value);
				}
			} else {
				property.event.fire(value);
			}
			return false;
		}		
	}

	/* End Private Members */

	/**
	* Adds a property to the Config object's private config hash. 
	* @param {string}	key	The configuration property's name
	* @param {object}	val	The property's default value
	* @param {Function} hdl	The default event handler
	* @param {Function}	vfn	The validation function used to validate the value(s) set into the property
	* @param {Element}	el	The DOM-dependency element that must be in the document in order for the event execution not the be deferred
	* @param {boolean} mc	Whether or not the property must be changed from the default in order to fire events.
	*/
	this.addProperty = function(key, val, hdl, vfn, el, mc) {
		config[key] = { event : new YAHOO.util.CustomEvent(key), 
						handler : hdl, 
						dependentElement : el,
						defaultValue : val, 
						value : null,
						validator : vfn,
						mustChange : mc
						};
		if (config[key].handler) {
			config[key].event.subscribe(config[key].handler, this.owner, true);
		}
		this.setProperty(key, val, true);
	}

	/**
	* Returns a key-value configuration map of the values currently set in the Config object.
	* @return {object} The current config, represented in a key-value map
	*/
	this.getConfig = function() {
		var cfg = {};

		for (var prop in config)
		{
			cfg[prop] = config[prop].value;
		}
		
		return cfg;
	}

	/**
	* Returns the value of specified property.
	* @param {key}		The name of the property
	* @return {object}	The value of the specified property
	*/
	this.getProperty = function(key) {
		var property = config[key];
		if (property != undefined)
		{
			return property.value;
		} else {
			return undefined;
		}
	}

	/**
	* Returns the default value of specified property.
	* @param {key}		The name of the property
	* @return {object} The default of the specified property
	*/	
	this.getDefault = function(key) {
		var property = config[key];
		if (property != undefined)
		{
			return property.defaultValue;
		} else {
			return undefined;
		}
	}

	/**
	* Resets the specified property's value to its initial value.
	* @param {key}		The name of the property
	*/
	this.resetProperty = function(key) {
		var property = config[key];
		if (property != undefined) {
			this.setProperty(key, initialConfig[key].value);
		} else {
			return undefined;
		}
	}

	/**
	* Sets the value of a property. If the silent property is passed as true, the property's event will not be fired.
	* @param {key}		The name of the property
	* @param {value}	The value to set the property to
	* @param {boolean}	Whether the value should be set silently, without firing the property event.
	* @return {boolean}	true, if the set was successful, false if it failed.
	*/
	this.setProperty = function(key, value, silent) {
		var property = config[key];
		if (property != undefined)
		{
			if (property.validator && ! property.validator(value)) { // validator
				return false;
			} else {
				property.value = value;
				if (! silent) {
					// We're good to fire the events, but we need
					// to make sure that the owner is in the DOM if this is
					// a DOM-dependent event

					var deferred = fireEvent(key, property, value);

					this.configChangedEvent.fire([key, value, deferred]);
				}
				return true;
			}
		} else {
			return false;
		}
	}

	/**
	* Fires the event for a property using the property's current value.
	* @param {key}		The name of the property
	*/
	this.refireEvent = function(key) {
		var property = config[key];
		if (property != undefined) {
			fireEvent(key, property, property.value);
		}
	}

	/**
	* Applies a key-value object literal to the configuration, replacing any existing values.
	* @param {object}	userConfig	The configuration object literal
	* @param {boolean}	init		When set to true, the initialConfig will be set to the userConfig passed in, so that calling a reset will reset the properties to the passed values.
	*/
	this.applyConfig = function(userConfig, init) {
		if (init) {
			initialConfig = userConfig;
		}
		for (var prop in userConfig) {
			this.setProperty(prop, userConfig[prop], true);
		}
		for (var prop in userConfig) {
			var property = config[prop];
			if (property != undefined) {
				fireEvent(prop, property, userConfig[prop]);
			}
		}

	}

	/**
	* Refires the events for all configuration properties using their current values.
	*/
	this.refresh = function() {
		for (var prop in config) {
			this.refireEvent(prop);
		}
	}

	/**
	* Applies the private initialConfig to the configuration object, which in effect resets the config to its original intended state.
	*/
	this.reset = function() {
		this.applyConfig(initialConfig);
	}
	

	/**
	* Subscribes an external handler to the change event for any given property. 
	* @param {string}	key			The property name
	* @param {Function}	handler		The handler function to use subscribe to the property's event
	* @param {object}	obj			The object to use for scoping the event handler (see CustomEvent documentation)
	* @param {boolean}	override	Optional. If true, will override "this" within the handler to map to the scope object passed into the method.
	*/
	this.subscribeToConfigEvent = function(key, handler, obj, override) {
		var property = config[key];
		if (property != undefined) {
			property.event.subscribe(handler, obj, override);
			return true;
		} else {
			return false;
		}
	}

	/**
	* Fires any events that were deferred due to unavailable DOM dependencies.
	*/
	this.fireDeferredEvents = function() {
		for (var prop in deferredEvents) {
			var property = config[prop];
			if (property != undefined) {
				fireEvent(prop, property, deferredEvents[prop].args);
			}
		}
	}

	// Some built-in validators //

	/**
	* Validates that the value passed in is a boolean.
	* @param	{object}	val	The value to validate
	* @return	{boolean}	true, if the value is valid
	*/
	this.checkBoolean = function(val) {
		if (typeof val == 'boolean')
		{
			return true;
		} else {
			return false;
		}
	}
	/**

	* Validates that the value passed in is a number.
	* @param	{object}	val	The value to validate
	* @return	{boolean}	true, if the value is valid
	*/
	this.checkNumber = function(val) {
		if (isNaN(val))
		{
			return false;
		} else {
			return true;
		}
	}
}

/**
* Checks to see if the passed element is actually present in the DOM.
* @param	{Element}	element	The element to be checked for DOM presence.
* @return	{boolean}	true, if the element is present in the DOM
*/
YAHOO.util.Dom._elementInDom = function(element) {
	var parentNode = element.parentNode;
	if (! parentNode) {
		return false;
	} else {
		if (parentNode.tagName == "HTML") {
			return true;
		} else {
			return YAHOO.util.Dom._elementInDom(parentNode);
		}
	}
}

/**
* @class 
* Module is a JavaScript representation of the Standard Module Format. Standard Module Format is a simple standard for markup containers where child nodes representing the header, body, and footer of the content are denoted using the CSS classes "hd", "bd", and "ft" respectively. Module is the base class for all other classes in the YUI Container package.
* @param {string}	el	The element ID representing the Module <em>OR</em>
* @param {Element}	el	The element representing the Module
* @param {object}	userConfig	The configuration object literal containing the configuration that should be set for this module. See configuration documentation for more details.
* @constructor
*/
YAHOO.widget.Module = function(el, userConfig) {
	if (el) { 
		this.init(el, userConfig); 
	}
}

/**
* Constant representing the module header
* @type string
* @final
*/
YAHOO.widget.Module.CSS_HEADER = "hd";

/**
* Constant representing the module body
* @type string
* @final
*/
YAHOO.widget.Module.CSS_BODY   = "bd";

/**
* Constant representing the module footer
* @type string
* @final
*/
YAHOO.widget.Module.CSS_FOOTER = "ft";

YAHOO.widget.Module.prototype = {

	/**
	* The class's constructor function
	* @type function
	*/
	constructor : YAHOO.widget.Module,

	/**
	* The main module element that contains the header, body, and footer
	* @type Element
	*/
	element : null, 

	/**
	* The header element, denoted with CSS class "hd"
	* @type Element
	*/
	header : null,

	/**
	* The body element, denoted with CSS class "bd"
	* @type Element
	*/
	body : null,

	/**
	* The footer element, denoted with CSS class "ft"
	* @type Element
	*/
	footer : null,

	/**
	* Array of elements
	* @type Element[]
	*/
	childNodesInDOM : null,

	/**
	* Initializes the custom events for Module which are fired automatically at appropriate times by the Module class.
	*/
	initEvents : function() {
		this.appendEvent		= new YAHOO.util.CustomEvent("append");
		this.beforeRenderEvent	= new YAHOO.util.CustomEvent("beforeRender");
		this.renderEvent		= new YAHOO.util.CustomEvent("render");

		this.changeHeaderEvent	= new YAHOO.util.CustomEvent("changeHeader");
		this.changeBodyEvent	= new YAHOO.util.CustomEvent("changeBody");
		this.changeFooterEvent	= new YAHOO.util.CustomEvent("changeFooter");

		this.changeContentEvent = new YAHOO.util.CustomEvent("changeContent");

		this.destroyEvent		= new YAHOO.util.CustomEvent("destroy");
		this.beforeShowEvent	= new YAHOO.util.CustomEvent("beforeShow", this);
		this.showEvent			= new YAHOO.util.CustomEvent("show", this);
		this.beforeHideEvent	= new YAHOO.util.CustomEvent("beforeHide", this);
		this.hideEvent			= new YAHOO.util.CustomEvent("hide", this);
	}, 

	/**
	* Initializes the custom events for Module which are fired automatically at appropriate times by the Module class.
	*/
	initDefaultConfig : function() {
		this.cfg = new YAHOO.util.Config(this);

		// Add properties //
		this.cfg.addProperty("visible", null, this.configVisible, this.cfg.checkBoolean, this.element, true);
	},

	/**
	* The Module class's initialization method, which is executed for Module and all of its subclasses. This method is automatically called by the constructor, and  sets up all DOM references for pre-existing markup, and creates required markup if it is not already present.
	* @param {string}	el	The element ID representing the Module <em>OR</em>
	* @param {Element}	el	The element representing the Module
	* @param {object}	userConfig	The configuration object literal containing the configuration that should be set for this module. See configuration documentation for more details.
	*/
	init : function(el, userConfig) {

		if (typeof el == "string")
		{
			var elId = el;

			el = document.getElementById(el);
			if (! el)
			{
				el = document.createElement("DIV");
				el.id = elId;
			}
		}

		this.element = el;
		this.id = el.id;
		
		this.childNodesInDOM = [null,null,null];

		var childNodes = this.element.childNodes;

		if (childNodes)
		{
			for (var i=0;i<childNodes.length;i++)
			{
				var child = childNodes[i];
				switch (child.className)
				{
					case YAHOO.widget.Module.CSS_HEADER:
						this.header = child;
						this.childNodesInDOM[0] = child;
						break;
					case YAHOO.widget.Module.CSS_BODY:
						this.body = child;
						this.childNodesInDOM[1] = child;
						break;
					case YAHOO.widget.Module.CSS_FOOTER:
						this.footer = child;
						this.childNodesInDOM[2] = child;
						break;
				}
			}
		}

		this.initEvents();
		this.initDefaultConfig();
		
		if (userConfig) {
			this.cfg.applyConfig(userConfig);
		}
	},

	/**
	* Sets the Module's header content to the HTML specified, or appends the passed element to the header. If no header is present, one will be automatically created.
	* @param {string}	headerContent	The HTML used to set the header <em>OR</em>
	* @param {Element}	headerContent	The Element to append to the header
	*/	
	setHeader : function(headerContent) {
		if (! this.header) {
			this.header = document.createElement("DIV");
			this.header.className = YAHOO.widget.Module.CSS_HEADER;
		}
		
		if (typeof headerContent == "string") {
			this.header.innerHTML = headerContent;
		} else {
			this.header.innerHTML = "";
			this.header.appendChild(headerContent);
		}

		this.changeHeaderEvent.fire(headerContent);
		this.changeContentEvent.fire();
	},

	/**
	* Appends the passed element to the header. If no header is present, one will be automatically created.
	* @param {Element}	element	The element to append to the header
	*/	
	appendToHeader : function(element) {
		if (! this.header) {
			this.header = document.createElement("DIV");
			this.header.className = YAHOO.widget.Module.CSS_HEADER;
		}
		
		this.header.appendChild(element);
		this.changeHeaderEvent.fire(element);
		this.changeContentEvent.fire();
	},

	/**
	* Sets the Module's body content to the HTML specified, or appends the passed element to the body. If no body is present, one will be automatically created.
	* @param {string}	bodyContent	The HTML used to set the body <em>OR</em>
	* @param {Element}	bodyContent	The Element to append to the body
	*/		
	setBody : function(bodyContent) {
		if (! this.body) {
			this.body = document.createElement("DIV");
			this.body.className = YAHOO.widget.Module.CSS_BODY;
		}

		if (typeof bodyContent == "string")
		{
			this.body.innerHTML = bodyContent;
		} else {
			this.body.innerHTML = "";
			this.body.appendChild(bodyContent);
		}

		this.changeBodyEvent.fire(bodyContent);
		this.changeContentEvent.fire();
	},

	/**
	* Appends the passed element to the body. If no body is present, one will be automatically created.
	* @param {Element}	element	The element to append to the body
	*/
	appendToBody : function(element) {
		if (! this.body) {
			this.body = document.createElement("DIV");
			this.body.className = YAHOO.widget.Module.CSS_BODY;
		}

		this.body.appendChild(element);
		this.changeBodyEvent.fire(element);
		this.changeContentEvent.fire();
	},

	/**
	* Sets the Module's footer content to the HTML specified, or appends the passed element to the footer. If no footer is present, one will be automatically created.
	* @param {string}	footerContent	The HTML used to set the footer <em>OR</em>
	* @param {Element}	footerContent	The Element to append to the footer
	*/	
	setFooter : function(footerContent) {
		if (! this.footer) {
			this.footer = document.createElement("DIV");
			this.footer.className = YAHOO.widget.Module.CSS_FOOTER;
		}

		if (typeof footerContent == "string")
		{
			this.footer.innerHTML = footerContent;
		} else {
			this.footer.innerHTML = "";
			this.footer.appendChild(footerContent);
		}

		this.changeFooterEvent.fire(footerContent);
		this.changeContentEvent.fire();
	},

	/**
	* Appends the passed element to the footer. If no footer is present, one will be automatically created.
	* @param {Element}	element	The element to append to the footer
	*/
	appendToFooter : function(element) {
		if (! this.footer) {
			this.footer = document.createElement("DIV");
			this.footer.className = YAHOO.widget.Module.CSS_FOOTER;
		}

		this.footer.appendChild(element);
		this.changeFooterEvent.fire(element);
		this.changeContentEvent.fire();
	},

	/**
	* Renders the Module by inserting the elements that are not already in the main Module into their correct places. Optionally appends the Module to the specified node prior to the render's execution. NOTE: For Modules without existing markup, the appendToNode argument is REQUIRED. If this argument is ommitted and the current element is not present in the document, the function will return false, indicating that the render was a failure.
	* @param {string}	appendToNode	The element id to which the Module should be appended to prior to rendering <em>OR</em>
	* @param {Element}	appendToNode	The element to which the Module should be appended to prior to rendering	
	* @return {boolean} Success or failure of the render
	*/
	render : function(appendToNode) {
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
			if (! YAHOO.util.Dom._elementInDom(this.element)) {
				return false;
			}
		}

		// Need to get everything into the DOM if it isn't already
		
		if ((! this.childNodesInDOM[0]) && this.header) {
			// There is a header, but it's not in the DOM yet... need to add it
			var firstChild = this.element.firstChild;
			if (firstChild) { // Insert before first child if exists
				this.element.insertBefore(this.header, firstChild);
			} else { // Append to empty body because there are no children
				this.element.appendChild(this.header);
			}
		}

		if ((! this.childNodesInDOM[1]) && this.body) {
			// There is a body, but it's not in the DOM yet... need to add it
			if (this.childNodesInDOM[2]) { // Insert before footer if exists in DOM
				this.element.insertBefore(this.body, this.childNodesInDOM[2]);
			} else { // Append to element because there is no footer
				this.element.appendChild(this.body);
			}
		}

		if ((! this.childNodesInDOM[2]) && this.footer) {
			// There is a footer, but it's not in the DOM yet... need to add it
			this.element.appendChild(this.footer);
		}
		
		this.cfg.fireDeferredEvents();
		this.renderEvent.fire();

		return true;
	},

	/**
	* Removes the Module element from the DOM and sets all child elements to null.
	*/
	destroy : function() {
		if (this.element) {
			var parent = this.element.parentNode;
		}
		if (parent) {
			parent.removeChild(this.element);
		}

		this.element = null;
		this.header = null;
		this.body = null;
		this.footer = null;

		this.destroyEvent.fire();
	},

	/**
	* Shows the Module element by setting the visible configuration property to true. Also fires two events: beforeShowEvent prior to the visibility change, and showEvent after.
	*/
	show : function() {
		this.beforeShowEvent.fire();
		this.cfg.setProperty("visible", true);
		this.showEvent.fire();
	},

	/**
	* Hides the Module element by setting the visible configuration property to false. Also fires two events: beforeHideEvent prior to the visibility change, and hideEvent after.
	*/
	hide : function() {
		this.beforeHideEvent.fire();
		this.cfg.setProperty("visible", false);
		this.hideEvent.fire();
	},

	// BUILT-IN EVENT HANDLERS FOR MODULE //

	/**
	* Default event handler for changing the visibility property of a Module. By default, this is achieved by switching the "display" style between "block" and "none".
	*/
	configVisible : function(type, args, obj) {
		var visible = args[0];
		if (visible) {
			YAHOO.util.Dom.setStyle(this.element, "display", "block");
		} else {
			YAHOO.util.Dom.setStyle(this.element, "display", "none");
		}
	}
}



/**
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

/**
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

/**
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

/**
* @class
* Dialog is an implementation of Panel that behaves like an OS dialog. Built-in functionality for buttons with event handlers is included, and button sets can be build dynamically, or the preincluded ones for OK/Cancel and Yes/No can be utilized.
* @param {string}	el	The element ID representing the Dialog <em>OR</em>
* @param {Element}	el	The element representing the Dialog
* @param {object}	userConfig	The configuration object literal containing the configuration that should be set for this Dialog. See configuration documentation for more details.
* @constructor
*/
YAHOO.widget.Dialog = function(el, userConfig) {
	if (arguments.length > 0)
	{
		YAHOO.widget.Dialog.superclass.constructor.call(this, el, userConfig);
	}
}

YAHOO.widget.Dialog.prototype = new YAHOO.widget.Panel();
YAHOO.widget.Dialog.prototype.constructor = YAHOO.widget.Dialog;

/**
* Reference to the Dialog's superclass, Panel
* @type class
* @final
*/
YAHOO.widget.Dialog.superclass = YAHOO.widget.Panel.prototype;

/**
* Constant for the standard network icon for a blocking action
* @type string
* @final
*/
YAHOO.widget.Dialog.ICON_BLOCK = "http://us.i1.yimg.com/us.yimg.com/i/nt/ic/ut/bsc/blck16_1.gif";

/**
* Constant for the standard network icon for alarm
* @type string
* @final
*/
YAHOO.widget.Dialog.ICON_ALARM = "http://us.i1.yimg.com/us.yimg.com/i/nt/ic/ut/bsc/alrt16_1.gif";

/**
* Constant for the standard network icon for help
* @type string
* @final
*/
YAHOO.widget.Dialog.ICON_HELP  = "http://us.i1.yimg.com/us.yimg.com/i/nt/ic/ut/bsc/hlp16_1.gif";

/**
* Constant for the standard network icon for info
* @type string
* @final
*/
YAHOO.widget.Dialog.ICON_INFO  = "http://us.i1.yimg.com/us.yimg.com/i/nt/ic/ut/bsc/info16_1.gif";

/**
* Constant for the standard network icon for warn
* @type string
* @final
*/
YAHOO.widget.Dialog.ICON_WARN  = "http://us.i1.yimg.com/us.yimg.com/i/nt/ic/ut/bsc/warn16_1.gif";

/**
* Constant for the standard network icon for a tip
* @type string
* @final
*/
YAHOO.widget.Dialog.ICON_TIP   = "http://us.i1.yimg.com/us.yimg.com/i/nt/ic/ut/bsc/tip16_1.gif";

/**
* Initializes the class's configurable properties which can be changed using the Dialog's Config object (cfg).
*/
YAHOO.widget.Dialog.prototype.initDefaultConfig = function() {
	YAHOO.widget.Dialog.superclass.initDefaultConfig.call(this);

	// Add dialog config properties //
	this.cfg.addProperty("icon",	"none",		this.configIcon);
	this.cfg.addProperty("buttons",	"none",		this.configButtons);
}

/**
* Initializes the custom events for Dialog which are fired automatically at appropriate times by the Dialog class.
*/
YAHOO.widget.Dialog.prototype.initEvents = function() {
	YAHOO.widget.Dialog.superclass.initEvents.call(this);
	this.buttonClickEvent = new YAHOO.util.CustomEvent("buttonClick", this);
}

/*
* The Dialog initialization method, which is executed for Dialog and all of its subclasses. This method is automatically called by the constructor, and  sets up all DOM references for pre-existing markup, and creates required markup if it is not already present.
* @param {string}	el	The element ID representing the Dialog <em>OR</em>
* @param {Element}	el	The element representing the Dialog
* @param {object}	userConfig	The configuration object literal containing the configuration that should be set for this Dialog. See configuration documentation for more details.
*/
YAHOO.widget.Dialog.prototype.init = function(el, userConfig) {
	YAHOO.widget.Dialog.superclass.init.call(this, el/*, userConfig*/);  // Note that we don't pass the user config in here yet because we only want it executed once, at the lowest subclass level

	/**
	* Built-in button set for OK/Cancel buttons
	* @type object
	*/
	this.BUTTONS_OKCANCEL = { 
				"OK": {
					handler : this.handleOKClick,
					isDefault : true
				},
				"Cancel": {
					handler : this.handleCancelClick
				} };
	/**
	* Built-in button set for Yes/No buttons
	* @type object
	*/
	this.BUTTONS_YESNO = { 
				"Yes": {
					handler : this.handleYesClick,
					isDefault : true
				},
				"No": {
					handler : this.handleNoClick
				} };

	this.showEvent.subscribe(this.focusDefault, this, true);

	if (userConfig) {
		this.cfg.applyConfig(userConfig, true);
	}
	
	this.cfg.applyConfig({ close:false, visible:false });
}


// BEGIN BUILT-IN PROPERTY EVENT HANDLERS //

/**
* The default event handler for the "icon" configuration property
*/
YAHOO.widget.Dialog.prototype.configIcon = function(type, args, obj) {
	var iconURL = args[0];
	if (iconURL && iconURL != "none") {
		if (! this.icon) {
			this.icon = document.createElement("DIV");

			var firstChild = this.body.firstChild;
			if (firstChild) {
				this.body.insertBefore(this.icon, firstChild);
			} else {
				this.body.appendChild(this.icon);
			}	
		} else {
			this.icon.style.display = "block";
		}
		
		this.icon.className = "icon";
		this.icon.style.backgroundImage = "url(" + iconURL + ")";
		this.icon.style.height = this.body.offsetHeight + "px";

	} else {
		if (this.icon) {
			this.icon.style.display = "none";
		}
	}
}

/**
* The default event handler for the "buttons" configuration property
*/
YAHOO.widget.Dialog.prototype.configButtons = function(type, args, obj) {
	var buttons = args[0];
	if (buttons != "none") {
		this.buttonSet = null;
		this.buttonSet = document.createElement("SPAN");
		this.buttonSet.className = "button-group";

		if (buttons == "okcancel") {
			buttons = this.BUTTONS_OKCANCEL;
		} else if (buttons == "yesno") {
			buttons = this.BUTTONS_YESNO;
		}

		for (var text in buttons) {
			var button = buttons[text];
			var htmlButton = document.createElement("BUTTON");

			if (button.isDefault) {
				htmlButton.className = "default";
				//if (this.browser == "ie") {
				this.defaultHtmlButton = htmlButton;//.cloneNode(true);
				//}
			}

			htmlButton.appendChild(document.createTextNode(text));
			YAHOO.util.Event.addListener(htmlButton, "click", button.handler, this);
			this.buttonSet.appendChild(htmlButton);

			button.htmlButton = htmlButton;

		}
		this.setFooter(this.buttonSet);
	} else {
		if (this.buttonSet)	{
			this.buttonSet.style.display = "none";
		}
	}
	this.cfg.refireEvent("underlay");
}

/**
* Sets the focus to the button that is designated as the default. By default, his handler is executed when the show event is fired.
*/
YAHOO.widget.Dialog.prototype.focusDefault = function(type, args, obj) {
	this.defaultHtmlButton.focus();
}

// END BUILT-IN PROPERTY EVENT HANDLERS //

// BEGIN BUILT-IN DOM EVENT HANDLERS //


/**
* The default event handler fired when the user clicks OK in the built-in button set
* @param {DOMEvent} e	The current DOM event
* @param {object}	obj	The object argument, in this case, the Dialog itself
*/
YAHOO.widget.Dialog.prototype.handleOKClick = function(e, obj) { }

/**
* The default event handler fired when the user clicks Cancel in the built-in button set
* @param {DOMEvent} e	The current DOM event
* @param {object}	obj	The object argument, in this case, the Dialog itself
*/
YAHOO.widget.Dialog.prototype.handleCancelClick = function(e, obj) {
	obj.hide();
}

/**
* The default event handler fired when the user clicks Yes in the built-in button set
* @param {DOMEvent} e	The current DOM event
* @param {object}	obj	The object argument, in this case, the Dialog itself
*/
YAHOO.widget.Dialog.prototype.handleYesClick = function(e, obj) { }

/**
* The default event handler fired when the user clicks No in the built-in button set
* @param {DOMEvent} e	The current DOM event
* @param {object}	obj	The object argument, in this case, the Dialog itself
*/
YAHOO.widget.Dialog.prototype.handleNoClick = function(e, obj) {
	obj.hide();
}

// END BUILT-IN DOM EVENT HANDLERS //

/**
* @class
* FormDialog is an implementation of Panel that can be used to submit form data. Built-in functionality for buttons with event handlers is included, and button sets can be build dynamically, or the preincluded ones for Submit/Cancel and OK/Cancel can be utilized. Forms can be processed in 3 ways -- via an asynchronous Connection utility call, a simple form POST or GET, or manually.
* @param {string}	el	The element ID representing the FormDialog <em>OR</em>
* @param {Element}	el	The element representing the FormDialog
* @param {object}	userConfig	The configuration object literal containing the configuration that should be set for this FormDialog. See configuration documentation for more details.
* @constructor
*/
YAHOO.widget.FormDialog = function(el, userConfig) {
	if (arguments.length > 0)
	{
		YAHOO.widget.FormDialog.superclass.constructor.call(this, el, userConfig);
	}
}

YAHOO.widget.FormDialog.prototype = new YAHOO.widget.Panel();
YAHOO.widget.FormDialog.prototype.constructor = YAHOO.widget.FormDialog;

/**
* Reference to the FormDialog's superclass, Panel
* @type class
* @final
*/
YAHOO.widget.FormDialog.superclass = YAHOO.widget.Panel.prototype;


/**
* Initializes the class's configurable properties which can be changed using the FormDialog's Config object (cfg).
*/
YAHOO.widget.FormDialog.prototype.initDefaultConfig = function() {
	YAHOO.widget.FormDialog.superclass.initDefaultConfig.call(this);

	/**
	* The internally maintained callback object for use with the Connection utility
	* @type object
	* @private
	*/
	var callback = {
		success : null,
		failure : null,
		argument: null,
		scope : this
	}

	/**
	* The default handler fired when the "success" property is changed
	*/ 
	this.configOnSuccess = function(type, args, obj) {
		var fn = args[0];
		callback.success = fn;
	}

	/**
	* The default handler fired when the "failure" property is changed
	*/ 
	this.configOnFailure = function(type, args, obj) {
		var fn = args[0];
		callback.failure = fn;
	}

	/**
	* Executes a submission of the form based on the value of the postmethod property.
	*/
	this.doSubmit = function() {
		var method = this.cfg.getProperty("postmethod");
		switch (method) {
			case "async":
				YAHOO.util.Connect.setForm(this.form.name);
				var cObj = YAHOO.util.Connect.asyncRequest('POST', this.form.action, callback);
				this.asyncSubmitEvent.fire();
				break;
			case "form":
				this.form.submit();
				this.formSubmitEvent.fire();
				break;
			case "none":
				this.manualSubmitEvent.fire();
				break;
		}
	}

	// Add form dialog config properties //
	this.cfg.addProperty("postmethod", "async", null, 
												function(val) { 
													if (val != "form" && val != "async" && val != "none") {
														return false;
													} else {
														return true;
													}
												});

	this.cfg.addProperty("buttons",		"none",	this.configButtons);
	this.cfg.addProperty("onsuccess",	null,	this.configOnSuccess);
	this.cfg.addProperty("onfailure",	null,	this.configOnFailure);
}

/**
* Initializes the custom events for FormDialog which are fired automatically at appropriate times by the FormDialog class.
*/
YAHOO.widget.FormDialog.prototype.initEvents = function() {
	YAHOO.widget.FormDialog.superclass.initEvents.call(this);

	this.submitEvent = new YAHOO.util.CustomEvent("submit");

	this.manualSubmitEvent = new YAHOO.util.CustomEvent("manualSubmit");
	this.asyncSubmitEvent = new YAHOO.util.CustomEvent("asyncSubmit");
	this.formSubmitEvent = new YAHOO.util.CustomEvent("formSubmit");

	this.cancelEvent = new YAHOO.util.CustomEvent("cancel");
}

/*
* The FormDialog initialization method, which is executed for FormDialog and all of its subclasses. This method is automatically called by the constructor, and  sets up all DOM references for pre-existing markup, and creates required markup if it is not already present.
* @param {string}	el	The element ID representing the FormDialog <em>OR</em>
* @param {Element}	el	The element representing the FormDialog
* @param {object}	userConfig	The configuration object literal containing the configuration that should be set for this FormDialog. See configuration documentation for more details.
*/
YAHOO.widget.FormDialog.prototype.init = function(el, userConfig) {
	YAHOO.widget.FormDialog.superclass.init.call(this, el/*, userConfig*/);  // Note that we don't pass the user config in here yet because we only want it executed once, at the lowest subclass level
	
	/**
	* Built-in button set for OK/Cancel buttons
	* @type object
	*/	
	this.BUTTONS_OKCANCEL = { 
				"OK": {
					handler : this.handleSubmitClick,
					isDefault : true
				},
				"Cancel": {
					handler : this.handleCancelClick
				} };

	/**
	* Built-in button set for Submit/Cancel buttons
	* @type object
	*/
	this.BUTTONS_SUBMITCANCEL = { 
				"Submit": {
					handler : this.handleSubmitClick,
					isDefault : true
				},
				"Cancel": {
					handler : this.handleCancelClick
				} };

	/**
	* Reference to the form 
	* @type object
	*/
	var form = this.element.getElementsByTagName("FORM")[0];
	if (form) {
		this.form = form;
	} else {
		this.renderEvent.subscribe(function(){
												var form = this.element.getElementsByTagName("FORM")[0];
												if (form) {
													this.form = form;
												}
											 }, this, true);
	}

	this.showEvent.subscribe(this.focusFirstField, this, true);

	if (userConfig) {
		this.cfg.applyConfig(userConfig);
	}
}


// BEGIN BUILT-IN PROPERTY EVENT HANDLERS //

/**
* The default event handler for the "buttons" configuration property
*/
YAHOO.widget.FormDialog.prototype.configButtons = function(type, args, obj) {
	var buttons = args[0];
	if (buttons != "none") {
		this.buttonSet = null;
		this.buttonSet = document.createElement("SPAN");
		this.buttonSet.className = "button-group";
		
		if (buttons == "okcancel") {
			buttons = this.BUTTONS_OKCANCEL;
		} else if (buttons == "submitcancel") {
			buttons = this.BUTTONS_SUBMITCANCEL;
		}

		for (var text in buttons) {
			var button = buttons[text];
			var htmlButton = document.createElement("BUTTON");

			if (button.isDefault) {
				htmlButton.className = "default";
				this.defaultHtmlButton = htmlButton;
			}

			htmlButton.appendChild(document.createTextNode(text));
			YAHOO.util.Event.addListener(htmlButton, "click", button.handler, this);
			this.buttonSet.appendChild(htmlButton);

			button.htmlButton = htmlButton;
		}
		this.setFooter(this.buttonSet);
	} else {
		if (this.buttonSet)	{
			this.buttonSet.style.display = "none";
		}
	}
	this.cfg.refireEvent("underlay");
}

/**
* The default event handler used to focus the first field of the form when the FormDialog is shown.
*/
YAHOO.widget.FormDialog.prototype.focusFirstField = function(type, args, obj) {
	if (this.form) {
		this.form[0].focus();
	}
}

// END BUILT-IN PROPERTY EVENT HANDLERS //

// BEGIN BUILT-IN DOM EVENT HANDLERS //

/**
* The default event handler fired when the user clicks OK or Submit in the built-in button set
* @param {DOMEvent} e	The current DOM event
* @param {object}	obj	The object argument, in this case, the FormDialog itself
*/
YAHOO.widget.FormDialog.prototype.handleSubmitClick = function(e, obj) { 
	obj.submit();
}

/**
* The default event handler fired when the user clicks Cancel in the built-in button set
* @param {DOMEvent} e	The current DOM event
* @param {object}	obj	The object argument, in this case, the FormDialog itself
*/
YAHOO.widget.FormDialog.prototype.handleCancelClick = function(e, obj) {
	obj.cancelEvent.fire();
	obj.hide();
}

// END BUILT-IN DOM EVENT HANDLERS //

/**
* Built-in function hook for writing a validation function that will be checked for a "true" value prior to a submit. This function, as implemented by default, always returns true, so it should be overridden if validation is necessary.
*/
YAHOO.widget.FormDialog.prototype.validate = function() {
	return true;
}

/**
* Executes a submit of the FormDialog followed by a hide, if validation is successful.
*/
YAHOO.widget.FormDialog.prototype.submit = function() {
	if (this.validate()) {
		this.doSubmit();
		this.submitEvent.fire();
		this.hide();
		return true;
	} else {
		return false;
	}
}

/**
* Returns a JSON data structure representing the data currently contained in the form.
* @return {object} A JSON object reprsenting the data of the current form.
*/
YAHOO.widget.FormDialog.prototype.getData = function() {
	var form = this.form;
	var data = {};

	if (form) {
		for (var i in this.form) {
			var formItem = form[i];
			if (formItem) {
				if (formItem.tagName) { // Got a single form item
					switch (formItem.tagName) {
						case "INPUT":
							switch (formItem.type) {
								case "checkbox": 
									data[i] = formItem.checked;
									break;
								case "textbox":
								case "text":
									data[i] = formItem.value;
									break;
							}
							break;
						case "TEXTAREA":
							data[i] = formItem.value;
							break;
						case "SELECT":
							var val = new Array();
							for (var x=0;x<formItem.options.length;x++)	{
								var option = formItem.options[x];
								if (option.selected) {
									var selval = option.value;
									if (! selval || selval == "") {
										selval = option.text;
									}
									val[val.length] = selval;
								}
							}
							data[i] = val;
							break;
					}
				} else if (formItem[0] && formItem[0].tagName) { // this is an array of form items
					switch (formItem[0].tagName) {
						case"INPUT" :
							switch (formItem[0].type) {
								case "radio":
									for (var r=0; r<formItem.length; r++) {
										var radio = formItem[r];
										if (radio.checked) {
											data[radio.name] = radio.value;
											break;
										}
									}
									break;
								case "checkbox":
									var cbArray = new Array();
									for (var c=0; c<formItem.length; c++) {
										var check = formItem[c];
										if (check.checked) {
											cbArray[cbArray.length] = check.value;
										}
									}
									data[formItem[0].name] = cbArray;
									break;
							}
					}
				}
			}
		}	
	}
	return data;
}