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
