/**
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
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
		if (property.dependentElement && ! YAHOO.util.Dom.inDocument(property.dependentElement)) { // Can't fire this event yet
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
			
		for (var prop in config) {
			var property = config[prop]
			if (property != undefined && property.event) {
				cfg[prop] = property.value;
			}
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
		if (property != undefined && property.event) {
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
		if (property != undefined && property.event) {
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
		if (property != undefined && property.event) {
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
		if (property != undefined && property.event) {
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
		if (property != undefined && property.event) {
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
			if (property != undefined && property.event) {
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
		if (property != undefined && property.event) {
			if (! YAHOO.util.Config.alreadySubscribed(property.event, handler, obj)) {
				property.event.subscribe(handler, obj, override);
			}
			return true;
		} else {
			return false;
		}
	}

	/**
	* Unsubscribes an external handler from the change event for any given property. 
	* @param {string}	key			The property name
	* @param {Function}	handler		The handler function to use subscribe to the property's event
	* @param {object}	obj			The object to use for scoping the event handler (see CustomEvent documentation)
	* @param {boolean}	override	Optional. If true, will override "this" within the handler to map to the scope object passed into the method.
	*/
	this.unsubscribeFromConfigEvent = function(key, handler, obj) {
		var property = config[key];
		if (property != undefined && property.event) {
			return property.event.unsubscribe(handler, obj);
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
			if (property != undefined && property.event) {
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
		if (typeof val == 'boolean') {
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
		if (isNaN(val)) {
			return false;
		} else {
			return true;
		}
	}
}


YAHOO.util.Config.alreadySubscribed = function(evt, fn, obj) {
	for (var e=0;e<evt.subscribers.length;e++) {
		var subsc = evt.subscribers[e];
		if (subsc && subsc.obj == obj && subsc.fn == fn) {
			return true;
			break;
		}
	}
	return false;
}

/**
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
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

YAHOO.widget.Module.IMG_ROOT = "http://us.i1.yimg.com/us.yimg.com/i/";
YAHOO.widget.Module.IMG_ROOT_SSL = "https://a248.e.akamai.net/sec.yimg.com/i/";

/**
* Constant for the default CSS class name that represents a Module
* @type string
* @final
*/
YAHOO.widget.Module.CSS_MODULE = "module";

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
	* The id of the element
	* @type string
	*/
	id : null,

	/**
	* Array of elements
	* @type Element[]
	*/
	childNodesInDOM : null,

	/**
	* The string representing the image root
	* @type string
	*/
	imageRoot : YAHOO.widget.Module.IMG_ROOT,

	/**
	* Array of OverlayEffects to use when showing and hiding the Module
	* @type YAHOO.widget.OverlayEffect[]
	*/
	effects : new Array(),

	/**
	* Initializes the custom events for Module which are fired automatically at appropriate times by the Module class.
	*/
	initEvents : function() {

		this.beforeInitModuleEvent	= new YAHOO.util.CustomEvent("beforeInitModule");
		this.initModuleEvent		= new YAHOO.util.CustomEvent("initModule");

		this.appendEvent			= new YAHOO.util.CustomEvent("append");
		this.beforeRenderEvent		= new YAHOO.util.CustomEvent("beforeRender");
		this.renderEvent			= new YAHOO.util.CustomEvent("render");

		this.changeHeaderEvent		= new YAHOO.util.CustomEvent("changeHeader");
		this.changeBodyEvent		= new YAHOO.util.CustomEvent("changeBody");
		this.changeFooterEvent		= new YAHOO.util.CustomEvent("changeFooter");

		this.changeContentEvent		= new YAHOO.util.CustomEvent("changeContent");

		this.destroyEvent			= new YAHOO.util.CustomEvent("destroy");
		this.beforeShowEvent		= new YAHOO.util.CustomEvent("beforeShow", this);
		this.showEvent				= new YAHOO.util.CustomEvent("show", this);
		this.beforeHideEvent		= new YAHOO.util.CustomEvent("beforeHide", this);
		this.hideEvent				= new YAHOO.util.CustomEvent("hide", this);

		this.resizeEvent			= new YAHOO.util.CustomEvent("resize", this);
	}, 

	/**
	* Initializes the custom events for Module which are fired automatically at appropriate times by the Module class.
	*/
	initDefaultConfig : function() {
		// Add properties //

		var ua = navigator.userAgent.toLowerCase();

		this.platform = function() {
			if (ua.indexOf("windows") != -1 || ua.indexOf("win32") != -1) {
				return "windows";
			} else if (ua.indexOf("macintosh") != -1) {
				return "mac";
			} else {
				return false;
			}
		}();

		/**
		* A string representing the current browser, as determined by the user-agent
		* @type string
		*/
		this.browser = function() {
			  if (ua.indexOf('opera')!=-1) { // Opera (check first in case of spoof)
				 return 'opera';
			  } else if (ua.indexOf('msie 7')!=-1) { // IE7
				 return 'ie7';
			  } else if (ua.indexOf('msie') !=-1) { // IE
				 return 'ie';
			  } else if (ua.indexOf('safari')!=-1) { // Safari (check before Gecko because it includes "like Gecko")
				 return 'safari';
			  } else if (ua.indexOf('gecko') != -1) { // Gecko
				 return 'gecko';
			  } else {
				 return false;
			  }
		}();

		if (window.location.href.toLowerCase().indexOf("https") == 0) {
			this.imageRoot = YAHOO.widget.Module.IMG_ROOT_SSL;
			this.isSecure = true;
		} else {
			this.isSecure = false;
		}

		this.cfg.addProperty("visible", null, this.configVisible, this.cfg.checkBoolean, this.element, true);
		this.cfg.addProperty("effect");
		this.cfg.addProperty("monitorresize", true, this.configMonitorResize);
	},

	/**
	* The Module class's initialization method, which is executed for Module and all of its subclasses. This method is automatically called by the constructor, and  sets up all DOM references for pre-existing markup, and creates required markup if it is not already present.
	* @param {string}	el	The element ID representing the Module <em>OR</em>
	* @param {Element}	el	The element representing the Module
	* @param {object}	userConfig	The configuration object literal containing the configuration that should be set for this module. See configuration documentation for more details.
	*/
	init : function(el, userConfig) {

		this.cfg = new YAHOO.util.Config(this);

		this.initEvents();
		
		this.beforeInitModuleEvent.fire(el);

		if (typeof el == "string") {
			var elId = el;

			el = document.getElementById(el);
			if (! el) {
				el = document.createElement("DIV");
				el.id = elId;
			}
		}

		this.element = el;
		
		if (el.id) {
			this.id = el.id;
		} 
		
		this.childNodesInDOM = [null,null,null];

		var childNodes = this.element.childNodes;

		if (childNodes) {
			for (var i=0;i<childNodes.length;i++) {
				var child = childNodes[i];
				switch (child.className) {
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

		this.initDefaultConfig();

		YAHOO.util.Dom.addClass(this.element, YAHOO.widget.Module.CSS_MODULE);

		if (userConfig) {
			this.cfg.applyConfig(userConfig);
		}

		this.initModuleEvent.fire(this.element);
	},

	/**
	* Initialized an empty DOM element that is placed out of the visible area that can be used to detect text resize.
	*/
	initResizeMonitor : function() {
		var resizeMonitor = document.getElementById("_yuiResizeMonitor");
		if (! resizeMonitor) {
			resizeMonitor = document.createElement("DIV");
			resizeMonitor.style.position = "absolute";
			resizeMonitor.id = "_yuiResizeMonitor";
			resizeMonitor.style.width = "1em";
			resizeMonitor.style.height = "1em";
			resizeMonitor.style.top = "-1000px";
			resizeMonitor.style.left = "-1000px";
			resizeMonitor.innerHTML = "&nbsp;";
			document.body.appendChild(resizeMonitor);
		}
		this.resizeMonitor = resizeMonitor;
		YAHOO.util.Event.addListener(this.resizeMonitor, "resize", this.onDomResize, this, true);
	},

	/**
	* Event handler fired when the resize monitor element is resized.
	*/
	onDomResize : function(e, obj) { },

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

		if (typeof footerContent == "string") {
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
	render : function(appendToNode, moduleElement) {
		this.beforeRenderEvent.fire();

		if (! moduleElement) {
			moduleElement = this.element;
		}

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
			var firstChild = moduleElement.firstChild;
			if (firstChild) { // Insert before first child if exists
				moduleElement.insertBefore(this.header, firstChild);
			} else { // Append to empty body because there are no children
				moduleElement.appendChild(this.header);
			}
		}

		if ((! this.childNodesInDOM[1]) && this.body) {
			// There is a body, but it's not in the DOM yet... need to add it
			if (this.childNodesInDOM[2]) { // Insert before footer if exists in DOM
				moduleElement.insertBefore(this.body, this.childNodesInDOM[2]);
			} else { // Append to element because there is no footer
				moduleElement.appendChild(this.body);
			}
		}

		if ((! this.childNodesInDOM[2]) && this.footer) {
			// There is a footer, but it's not in the DOM yet... need to add it
			moduleElement.appendChild(this.footer);
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
		if (! this.cfg.getProperty("effect")) {
			this.showEvent.fire();
		}
	},

	/**
	* Hides the Module element by setting the visible configuration property to false. Also fires two events: beforeHideEvent prior to the visibility change, and hideEvent after.
	*/
	hide : function() {
		this.beforeHideEvent.fire();
		this.cfg.setProperty("visible", false);
		if (! this.cfg.getProperty("effect")) {
			this.hideEvent.fire();
		}
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
	},

	/**
	* Default event handler for the "monitorresize" configuration property
	*/
	configMonitorResize : function(type, args, obj) {
		var monitor = args[0];
		if (monitor) {
			this.initResizeMonitor();
		} else {
			YAHOO.util.Event.removeListener(this.resizeMonitor, "resize", this.onDomResize);
			this.resizeMonitor = null;
		}
	}
}

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
YAHOO.widget.OverlayManager = function(overlays, userConfig) {
	this.init(overlays, userConfig);
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
	overlays : new Array(),

	/**
	* Initializes the default configuration of the OverlayManager
	*/	
	initDefaultConfig : function() {}, 

	/**
	* Initializes the OverlayManager
	* @param {Array}	overlays	Optional. A collection of Overlays to register with the manager.
	* @param {object}	userConfig		The object literal representing the user configuration of the OverlayManager
	*/
	init : function(overlays, userConfig) {
		this.cfg = new YAHOO.util.Config(this);
		this.initDefaultConfig();

		var activeOverlay = null;

		/**
		* Returns the currently focused Overlay
		* @return {Overlay}	The currently focused Overlay
		*/
		this.getActive = function() {
			return activeOverlay;
		}

		/**
		* Focuses the specified Overlay
		* @param {Overlay}	The Overlay to focus
		* @param {string}	The id of the Overlay to focus
		*/
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

		/**
		* Removes the specified Overlay from the manager
		* @param {Overlay}	The Overlay to remove
		* @param {string}	The id of the Overlay to remove
		*/
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

		/**
		* Removes focus from all registered Overlays in the manager
		*/
		this.blurAll = function() {
			activeOverlay = null;
			for (var o=0;o<this.overlays.length;o++) {
				YAHOO.util.Dom.removeClass(this.overlays[o].element, YAHOO.widget.OverlayManager.CSS_FOCUSED);
			}		
		}

		if (overlays) {
			this.register(overlays);
			this.overlays.sort(this.compareZIndexDesc);
		}

		if (userConfig) {
			this.cfg.applyConfig(userConfig, true);
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
			overlay.cfg.addProperty("manager");
			overlay.cfg.setProperty("manager", this);

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

			var focusOnMouseDown = function(e,obj) {
				mgr.focus(overlay);
			}

			YAHOO.util.Event.addListener(overlay.element,"mousedown",focusOnMouseDown,this,true);

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
	}

}

/**
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
* @class
* OverlayEffect encapsulates animation transitions that are executed when an Overlay is shown or hidden.
* @param {Overlay}	overlay		The Overlay that the animation should be associated with
* @param {object}	attrIn		The object literal representing the animation arguments to be used for the animate-in transition. The arguments for this literal are: attributes(object, see YAHOO.util.Anim for description), duration(float), and method(i.e. YAHOO.util.Easing.easeIn).
* @param {object}	attrOut		The object literal representing the animation arguments to be used for the animate-out transition. The arguments for this literal are: attributes(object, see YAHOO.util.Anim for description), duration(float), and method(i.e. YAHOO.util.Easing.easeIn).
* @param {Element}	targetElement	Optional. The target element that should be animated during the transition. Defaults to overlay.element.
* @constructor
*/
YAHOO.widget.OverlayEffect = function(overlay, attrIn, attrOut, targetElement) {
	this.overlay = overlay;

	this.attrIn = attrIn;
	this.attrOut = attrOut;

	this.targetElement = targetElement || overlay.element;

	this.beforeAnimateInEvent = new YAHOO.util.CustomEvent("beforeAnimateIn");
	this.beforeAnimateOutEvent = new YAHOO.util.CustomEvent("beforeAnimateOut");

	this.animateInCompleteEvent = new YAHOO.util.CustomEvent("animateInComplete");
	this.animateOutCompleteEvent = new YAHOO.util.CustomEvent("animateOutComplete");
}

/**
* Initializes the animation classes and events.
* @param {class}	Optional. The animation class to instantiate. Defaults to YAHOO.util.Anim. Other options include YAHOO.util.Motion.
*/
YAHOO.widget.OverlayEffect.prototype.init = function(animClass) {
	if (! animClass) {
		animClass = YAHOO.util.Anim;
	}
	this.animIn = new animClass(this.targetElement, this.attrIn.attributes, this.attrIn.duration, this.attrIn.method);
	this.animIn.onStart.subscribe(this.handleStartAnimateIn, this);
	this.animIn.onTween.subscribe(this.handleTweenAnimateIn, this);
	this.animIn.onComplete.subscribe(this.handleCompleteAnimateIn, this);

	this.animOut = new animClass(this.targetElement, this.attrOut.attributes, this.attrOut.duration, this.attrOut.method);
	this.animOut.onStart.subscribe(this.handleStartAnimateOut, this);
	this.animOut.onTween.subscribe(this.handleTweenAnimateOut, this);
	this.animOut.onComplete.subscribe(this.handleCompleteAnimateOut, this);
}

/**
* Triggers the in-animation.
*/
YAHOO.widget.OverlayEffect.prototype.animateIn = function() {
	this.beforeAnimateInEvent.fire();
	this.animIn.animate();
}

/**
* Triggers the out-animation.
*/
YAHOO.widget.OverlayEffect.prototype.animateOut = function() {
	this.beforeAnimateOutEvent.fire();
	this.animOut.animate();
}

/**
* The default onStart handler for the in-animation.
*/
YAHOO.widget.OverlayEffect.prototype.handleStartAnimateIn = function(type, args, obj) { }
/**
* The default onTween handler for the in-animation.
*/
YAHOO.widget.OverlayEffect.prototype.handleTweenAnimateIn = function(type, args, obj) { }
/**
* The default onComplete handler for the in-animation.
*/
YAHOO.widget.OverlayEffect.prototype.handleCompleteAnimateIn = function(type, args, obj) { }

/**
* The default onStart handler for the out-animation.
*/
YAHOO.widget.OverlayEffect.prototype.handleStartAnimateOut = function(type, args, obj) { }
/**
* The default onTween handler for the out-animation.
*/
YAHOO.widget.OverlayEffect.prototype.handleTweenAnimateOut = function(type, args, obj) { }
/**
* The default onComplete handler for the out-animation.
*/
YAHOO.widget.OverlayEffect.prototype.handleCompleteAnimateOut = function(type, args, obj) { }

/**
* A pre-configured OverlayEffect instance that can be used for fading an overlay in and out.
* @param {Overlay}	The Overlay object to animate
* @param {float}	The duration of the animation
* @type OverlayEffect
*/
YAHOO.widget.OverlayEffect.FADE = function(overlay, dur) {
	var fade = new YAHOO.widget.OverlayEffect(overlay, { attributes:{opacity: {from:0, to:1}}, duration:dur, method:YAHOO.util.Easing.easeIn }, { attributes:{opacity: {to:0}}, duration:dur, method:YAHOO.util.Easing.easeOut} );

	fade.handleStartAnimateIn = function(type,args,obj) {
		YAHOO.util.Dom.addClass(obj.overlay.element, "hide-select");
		
		if (! obj.overlay.underlay) {
			obj.overlay.cfg.refireEvent("underlay");
		}

		if (obj.overlay.underlay) {
			obj.initialUnderlayOpacity = YAHOO.util.Dom.getStyle(obj.overlay.underlay, "opacity");
			obj.overlay.underlay.style.filter = null;
		}

		YAHOO.util.Dom.setStyle(obj.overlay.element, "visibility", "visible"); 
		YAHOO.util.Dom.setStyle(obj.overlay.element, "opacity", 0);
	}

	fade.handleCompleteAnimateIn = function(type,args,obj) {
		YAHOO.util.Dom.removeClass(obj.overlay.element, "hide-select");

		if (obj.overlay.element.style.filter) {
			obj.overlay.element.style.filter = null;
		}			
		
		if (obj.overlay.underlay) {
			YAHOO.util.Dom.setStyle(obj.overlay.underlay, "opacity", obj.initialUnderlayOpacity);
		}

		obj.animateInCompleteEvent.fire();
	}

	fade.handleStartAnimateOut = function(type, args, obj) {
		YAHOO.util.Dom.addClass(obj.overlay.element, "hide-select");

		if (obj.overlay.underlay && obj.overlay.underlay.style.filter) {
			obj.overlay.underlay.style.filter = null;
		}
	}

	fade.handleCompleteAnimateOut =  function(type, args, obj) { 
		YAHOO.util.Dom.removeClass(obj.overlay.element, "hide-select");
		if (obj.overlay.element.style.filter) {
			obj.overlay.element.style.filter = null;
		}				
		YAHOO.util.Dom.setStyle(obj.overlay.element, "visibility", "hidden");
		YAHOO.util.Dom.setStyle(obj.overlay.element, "opacity", 1); 

		obj.animateOutCompleteEvent.fire();
	};	

	fade.init();
	return fade;
};


/**
* A pre-configured OverlayEffect instance that can be used for sliding an overlay in and out.
* @param {Overlay}	The Overlay object to animate
* @param {float}	The duration of the animation
* @type OverlayEffect
*/
YAHOO.widget.OverlayEffect.SLIDE = function(overlay, dur) {
	var x = overlay.cfg.getProperty("x") || YAHOO.util.Dom.getX(overlay.element);
	var y = overlay.cfg.getProperty("y") || YAHOO.util.Dom.getY(overlay.element);

	this.startX = x;
	this.startY = y;

	var clientWidth = YAHOO.util.Dom.getClientWidth();
	var offsetWidth = overlay.element.offsetWidth;

	var slide = new YAHOO.widget.OverlayEffect(overlay, { 
															attributes:{ points: { from:[(-25-offsetWidth),y], to:[x, y] } }, 
															duration:dur, 
															method:YAHOO.util.Easing.easeIn 
														}, 
														{ 
															attributes:{ points: { to:[(clientWidth+25), y] } },
															duration:dur, 
															method:YAHOO.util.Easing.easeOut
														} 
												);
	
	slide.handleTweenAnimateIn = function(type, args, obj) {
		if (YAHOO.util.Dom.getStyle(obj.overlay.element, "visibility") == "hidden") {
			YAHOO.util.Dom.setStyle(obj.overlay.element, "visibility", "visible");
		}

		var pos = YAHOO.util.Dom.getXY(obj.overlay.element);

		var x = pos[0];
		var y = pos[1];

		obj.overlay.cfg.setProperty("xy", [x,y], true);
		obj.overlay.cfg.refireEvent("iframe");
	}
	
	slide.handleCompleteAnimateIn = function(type, args, obj) {
		obj.overlay.cfg.setProperty("xy", [x,y], true);
		obj.overlay.cfg.refireEvent("iframe");
		obj.animateInCompleteEvent.fire();
	}

	slide.handleStartAnimateOut = function(type, args, obj) {
		/*if (obj.overlay.browser == "ie") {
			document.documentElement.style.overflowX = "hidden";
		} else if (obj.overlay.browser == "gecko") {
			document.body.style.overflowX = "hidden";
		} else {
			document.body.style.overflow = "hidden"; 
		}*/

		obj.overlay.element.style.width = obj.overlay.element.offsetWidth + "px";

		var clientWidth = YAHOO.util.Dom.getClientWidth();
		
		var pos = YAHOO.util.Dom.getXY(obj.overlay.element);

		var x = pos[0];
		var y = pos[1];

		var currentTo = obj.animOut.attributes.points.to;
		obj.animOut.attributes.points.to = [(clientWidth+25), y];
	}

	slide.handleTweenAnimateOut = function(type, args, obj) {
		/*if (obj.overlay.browser == "ie") {
			document.documentElement.style.overflowX = "hidden";
			document.documentElement.style.overflowY = "hidden";	
		} else if (obj.overlay.browser == "gecko") {
			document.body.style.overflowX = "hidden";
			document.body.style.overflowY = "hidden";
		} else {
			document.body.style.overflow = "hidden"; 
		}*/
		
		var pos = YAHOO.util.Dom.getXY(obj.overlay.element);

		var x = pos[0];
		var y = pos[1];

		obj.overlay.cfg.setProperty("xy", [x,y], true);
		obj.overlay.cfg.refireEvent("iframe");
	}

	slide.handleCompleteAnimateOut = function(type, args, obj) { 
		YAHOO.util.Dom.setStyle(obj.overlay.element, "visibility", "hidden");		
		var offsetWidth = obj.overlay.element.offsetWidth;

		obj.overlay.cfg.setProperty("xy", [this.startX,this.startY]);
		obj.overlay.cfg.refireEvent("fixedcenter");
		obj.overlay.cfg.refireEvent("width");

		/*if (obj.overlay.browser == "ie") {
			document.documentElement.style.overflowX = "auto";
			document.documentElement.style.overflowY = "auto";
		} else if (obj.overlay.browser == "gecko") {
			document.body.style.overflowX = "visible";
			document.body.style.overflowY = "visible";
		} else {
			document.body.style.overflow = "visible"; 
		}*/

		obj.animateOutCompleteEvent.fire();
	};	

	slide.init(YAHOO.util.Motion);
	return slide;
}

/**
* A pre-configured OverlayEffect instance that can be used for expanding an overlay in and out horizontally.
* @param {Overlay}	The Overlay object to animate
* @param {float}	The duration of the animation
* @type OverlayEffect
*/
YAHOO.widget.OverlayEffect.EXPAND_H = function(overlay, dur) {
	var initialWidth = YAHOO.util.Dom.getStyle(overlay.element, "width");

	var offsetWidth = overlay.element.offsetWidth;
	var offsetHeight = overlay.element.offsetHeight;

	var expand = new YAHOO.widget.OverlayEffect(overlay, { attributes:{width: {from:0, to:parseInt(initialWidth), unit:"em" }}, duration:dur, method:YAHOO.util.Easing.easeIn }, { attributes:{width: {to:0, unit:"em"}}, duration:dur, method:YAHOO.util.Easing.easeOut} );

	expand.handleStartAnimateIn = function(type,args,obj) {
		var w = obj.cachedOffsetWidth || obj.overlay.element.offsetWidth;

		if (obj.overlay.header) {
			var padLeft = YAHOO.util.Dom.getStyle(obj.overlay.header, "paddingLeft");
			var padRight = YAHOO.util.Dom.getStyle(obj.overlay.header, "paddingRight");
			obj.overlay.header.style.width = (w-parseInt(padLeft)-parseInt(padRight)) + "px";
		}
		if (obj.overlay.body) {
			var padLeft = YAHOO.util.Dom.getStyle(obj.overlay.body, "paddingLeft");
			var padRight = YAHOO.util.Dom.getStyle(obj.overlay.body, "paddingRight");
			obj.overlay.body.style.width = (w-parseInt(padLeft)-parseInt(padRight)) + "px";
		}
		if (obj.overlay.footer) {
			var padLeft = YAHOO.util.Dom.getStyle(obj.overlay.footer, "paddingLeft");
			var padRight = YAHOO.util.Dom.getStyle(obj.overlay.footer, "paddingRight");
			obj.overlay.footer.style.width = (w-parseInt(padLeft)-parseInt(padRight)) + "px";
		}
	}

	expand.handleTweenAnimateIn = function(type, args, obj) {
		obj.overlay.cfg.refireEvent("underlay");
		obj.overlay.cfg.refireEvent("iframe");
		if (YAHOO.util.Dom.getStyle(obj.overlay.element, "visibility") == "hidden") {
			YAHOO.util.Dom.setStyle(obj.overlay.element, "visibility", "visible");
		}
	}

	expand.handleCompleteAnimateIn = function(type,args,obj) {
		YAHOO.util.Dom.setStyle(obj.overlay.element, "height", "auto");
		YAHOO.util.Dom.setStyle(obj.overlay.element, "width", initialWidth);

		if (obj.overlay.header) {
			obj.overlay.header.style.width = "auto";
		}
		if (obj.overlay.body) {
			obj.overlay.body.style.width = "auto";
		}
		if (obj.overlay.footer) {
			obj.overlay.footer.style.width = "auto";
		}
	}

	expand.handleStartAnimateOut = function(type,args,obj) {
		var w = obj.overlay.element.offsetWidth;
		obj.cachedOffsetWidth = w;

		if (obj.overlay.header) {
			var padLeft = YAHOO.util.Dom.getStyle(obj.overlay.header, "paddingLeft");
			var padRight = YAHOO.util.Dom.getStyle(obj.overlay.header, "paddingRight");
			obj.overlay.header.style.width = (w-parseInt(padLeft)-parseInt(padRight)) + "px";
		}
		if (obj.overlay.body) {
			var padLeft = YAHOO.util.Dom.getStyle(obj.overlay.body, "paddingLeft");
			var padRight = YAHOO.util.Dom.getStyle(obj.overlay.body, "paddingRight");
			obj.overlay.body.style.width = (w-parseInt(padLeft)-parseInt(padRight)) + "px";
		}
		if (obj.overlay.footer) {
			var padLeft = YAHOO.util.Dom.getStyle(obj.overlay.footer, "paddingLeft");
			var padRight = YAHOO.util.Dom.getStyle(obj.overlay.footer, "paddingRight");
			obj.overlay.footer.style.width = (w-parseInt(padLeft)-parseInt(padRight)) + "px";
		}
	}

	expand.handleTweenAnimateOut = function(type, args, obj) {
		obj.overlay.cfg.refireEvent("underlay");
		obj.overlay.cfg.refireEvent("iframe");
	}

	expand.handleCompleteAnimateOut =  function(type, args, obj) { 
		YAHOO.util.Dom.setStyle(obj.overlay.element, "visibility", "hidden");
		YAHOO.util.Dom.setStyle(obj.overlay.element, "height", "auto");
		YAHOO.util.Dom.setStyle(obj.overlay.element, "width", initialWidth);

		if (obj.overlay.header) {
			obj.overlay.header.style.width = "auto";
		}
		if (obj.overlay.body) {
			obj.overlay.body.style.width = "auto";
		}
		if (obj.overlay.footer) {
			obj.overlay.footer.style.width = "auto";
		}
	};	

	expand.init();
	return expand;
};

/**
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
* @class 
* KeyListener is a utility that provides an easy interface for listening for keydown/keyup events fired against DOM elements.
* @param {Element}	attachTo	The element or element ID to which the key event should be attached
* @param {string}	attachTo	The element or element ID to which the key event should be attached
* @param (object}	keyData		The object literal representing the key(s) to detect. Possible attributes are shift(boolean), alt(boolean), ctrl(boolean) and keys(either an int or an array of ints representing keycodes).
* @param {function}	handler		The CustomEvent handler to fire when the key event is detected
* @param {object}	handler		An object literal representing the handler. 
* @param {string}	event		Optional. The event (keydown or keyup) to listen for. Defaults automatically to keydown.
* @constructor
*/
YAHOO.util.KeyListener = function(attachTo, keyData, handler, event) {
	if (! event) {
		event = YAHOO.util.KeyListener.KEYDOWN;
	}

	var keyEvent = new YAHOO.util.CustomEvent("keyPressed");
	
	this.enabledEvent = new YAHOO.util.CustomEvent("enabled");
	this.disabledEvent = new YAHOO.util.CustomEvent("disabled");

	if (typeof attachTo == 'string') {
		attachTo = document.getElementById(attachTo);
	}

	if (typeof handler == 'function') {
		keyEvent.subscribe(handler);
	} else {
		keyEvent.subscribe(handler.fn, handler.scope, handler.correctScope);
	}

	/**
	* Handles the key event when a key is pressed.
	* @private
	*/
	var handleKeyPress = function(e, obj) {
		var keyPressed = e.charCode || e.keyCode;
		
		if (! keyData.shift)	keyData.shift = false;
		if (! keyData.alt)		keyData.alt = false;
		if (! keyData.ctrl)		keyData.ctrl = false;

		// check held down modifying keys first
		if (e.shiftKey == keyData.shift && 
			e.altKey   == keyData.alt &&
			e.ctrlKey  == keyData.ctrl) { // if we pass this, all modifiers match

			if (keyData.keys instanceof Array) {
				for (var i=0;i<keyData.keys.length;i++) {
					if (keyPressed == keyData.keys[i]) {
						YAHOO.util.Event.stopEvent(e);
						keyEvent.fire(keyPressed);
						break;
					}
				}
			} else {
				if (keyPressed == keyData.keys) {
					YAHOO.util.Event.stopEvent(e);
					keyEvent.fire(keyPressed);
				}
			}
		}
	}

	/**
	* Enables the KeyListener, by dynamically attaching the key event to the appropriate DOM element.
	*/
	this.enable = function() {
		if (! this.enabled) {
			YAHOO.util.Event.addListener(attachTo, event, handleKeyPress);
			this.enabledEvent.fire(keyData);
		}
		this.enabled = true;
	}

	/**
	* Disables the KeyListener, by dynamically removing the key event from the appropriate DOM element.
	*/
	this.disable = function() {
		YAHOO.util.Event.removeListener(attachTo, event, handleKeyPress);
		this.enabled = false;
		this.disabledEvent.fire(keyData);
	}

}

/**
* Constant representing the DOM "keydown" event.
* @final
*/
YAHOO.util.KeyListener.KEYDOWN = "keydown";

/**
* Constant representing the DOM "keyup" event.
* @final
*/
YAHOO.util.KeyListener.KEYUP = "keyup";

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
			
			if (! YAHOO.util.Config.alreadySubscribed( firstEffect.beforeAnimateInEvent, this.showMask, this) ) {
				firstEffect.beforeAnimateInEvent.subscribe(this.showMask, this, true);
			}

			if (! YAHOO.util.Config.alreadySubscribed( firstEffect.animateOutCompleteEvent, this.hideMask, this ) ) {
				firstEffect.animateOutCompleteEvent.subscribe(this.hideMask, this, true);
			}
			//firstEffect.animateInCompleteEvent.subscribe(this.sizeMask, this, true);
			

		} else {
			if (! YAHOO.util.Config.alreadySubscribed( this.showEvent, this.showMask, this) ) {
				this.showEvent.subscribe(this.showMask, this, true);
			}
			if (! YAHOO.util.Config.alreadySubscribed( this.hideEvent, this.hideMask, this) ) {
				this.hideEvent.subscribe(this.hideMask, this, true);
			}
		}
	}
}

YAHOO.widget.Panel.prototype.configkeyListeners = function(type, args, obj) {
	var handlers = args[0];

	if (handlers) {

		if (handlers instanceof Array) {
			for (var i=0;i<handlers.length;i++) {
				var handler = handlers[i];

				if (! YAHOO.util.Config.alreadySubscribed(this.showEvent, handler.enable, handler)) {
					this.showEvent.subscribe(handler.enable, handler, true);
				}
				if (! YAHOO.util.Config.alreadySubscribed(this.hideEvent, handler.disable, handler)) {
					this.hideEvent.subscribe(handler.disable, handler, true);
				}
			}
		} else {
			if (! YAHOO.util.Config.alreadySubscribed(this.showEvent, handlers.enable, handlers)) {
				this.showEvent.subscribe(handlers.enable, handlers, true);
			}
			if (! YAHOO.util.Config.alreadySubscribed(this.hideEvent, handlers.disable, handlers)) {
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
		
		var me = this;

		this.dd.startDrag = function() {
			if (me.browser == "ie") {
				YAHOO.util.Dom.addClass(me.element,"drag");
			}

			if (me.cfg.getProperty("constraintoviewport")) {
				var offsetHeight = me.element.offsetHeight;
				var offsetWidth = me.element.offsetWidth;

				var viewPortWidth = YAHOO.util.Dom.getViewportWidth();
				var viewPortHeight = YAHOO.util.Dom.getViewportHeight();

				var scrollX = window.scrollX || document.documentElement.scrollLeft;
				var scrollY = window.scrollY || document.documentElement.scrollTop;

				var topConstraint = scrollY + 10;
				var leftConstraint = scrollX + 10;
				var bottomConstraint = scrollY + viewPortHeight - offsetHeight - 10;
				var rightConstraint = scrollX + viewPortWidth - offsetWidth - 10;

				this.minX = leftConstraint
				this.maxX = rightConstraint;
				this.constrainX = true;

				this.minY = topConstraint;
				this.maxY = bottomConstraint;
				this.constrainY = true;
			} else {
				this.constrainX = false;
				this.constrainY = false;
			}
		
		}
		
		this.dd.onDrag = function() {
			me.syncPosition();
			me.cfg.refireEvent("iframe");
		}

		this.dd.endDrag = function() {
			if (me.browser == "ie") {
				YAHOO.util.Dom.removeClass(me.element,"drag");
			}
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
		this.mask.id = this.id + "_mask";
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
		YAHOO.util.Event.removeListener(window, "resize", this.onWindowResize);
		this.hideMaskEvent.fire();
		YAHOO.util.Dom.removeClass(document.body, "masked");
	}
}

/**
* Shows the modality mask.
*/
YAHOO.widget.Panel.prototype.showMask = function() {
	if (this.cfg.getProperty("modal") && this.mask) {
		YAHOO.util.Dom.addClass(document.body, "masked");
		YAHOO.util.Event.addListener(window, "resize", this.onWindowResize, this, true);
		this.sizeMask();
		this.mask.style.display = "block";
		this.showMaskEvent.fire();
	}
}

YAHOO.widget.Panel.prototype.sizeMask = function() {
	if (this.mask) {
		this.mask.style.height = YAHOO.util.Dom.getDocumentHeight()+"px";
		this.mask.style.width = YAHOO.util.Dom.getDocumentWidth()+"px";
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
	var moduleElement = this.innerElement;
	return YAHOO.widget.Panel.superclass.render.call(this, appendToNode, moduleElement);
}

/**
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
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
YAHOO.widget.Dialog.ICON_BLOCK = "nt/ic/ut/bsc/blck16_1.gif";

/**
* Constant for the standard network icon for alarm
* @type string
* @final
*/
YAHOO.widget.Dialog.ICON_ALARM = "nt/ic/ut/bsc/alrt16_1.gif";

/**
* Constant for the standard network icon for help
* @type string
* @final
*/
YAHOO.widget.Dialog.ICON_HELP  = "nt/ic/ut/bsc/hlp16_1.gif";

/**
* Constant for the standard network icon for info
* @type string
* @final
*/
YAHOO.widget.Dialog.ICON_INFO  = "nt/ic/ut/bsc/info16_1.gif";

/**
* Constant for the standard network icon for warn
* @type string
* @final
*/
YAHOO.widget.Dialog.ICON_WARN  = "nt/ic/ut/bsc/warn16_1.gif";

/**
* Constant for the standard network icon for a tip
* @type string
* @final
*/
YAHOO.widget.Dialog.ICON_TIP   = "nt/ic/ut/bsc/tip16_1.gif";

/**
* Constant for the default CSS class name that represents a Dialog
* @type string
* @final
*/
YAHOO.widget.Dialog.CSS_DIALOG = "dialog";

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
	
	YAHOO.util.Dom.addClass(this.element, YAHOO.widget.Dialog.CSS_DIALOG);

	/**
	* Built-in button set for OK/Cancel buttons
	* @type Array
	*/	
	this.BUTTONS_OKCANCEL = [ 
				{	text : "OK",
					handler : this.handleSubmitClick,
					isDefault : true
				},
				{	text : "Cancel",
					handler : this.handleCancelClick
				}];

	/**
	* Built-in button set for Yes/No buttons
	* @type Array
	*/
	this.BUTTONS_YESNO = [ 
				{	text : "Yes",
					handler : this.handleSubmitClick,
					isDefault : true
				},
				{	text : "No",
					handler : this.handleCancelClick
				}];

	this.showEvent.subscribe(this.focusDefault, this, true);
	this.beforeHideEvent.subscribe(this.blurButtons, this, true);

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
		iconURL = this.imageRoot + iconURL;
		if (! this.icon) {
			this.icon = document.createElement("DIV");
			if (! this.body) {
				return;
			}
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
		this.buttonSpan = null;
		this.buttonSpan = document.createElement("SPAN");
		this.buttonSpan.className = "button-group";

		if (buttons == "okcancel") {
			buttons = this.BUTTONS_OKCANCEL;
		} else if (buttons == "yesno") {
			buttons = this.BUTTONS_YESNO;
		}

		for (var b=0;b<buttons.length;b++) {
			var button = buttons[b];
			var htmlButton = document.createElement("BUTTON");

			if (button.isDefault) {
				htmlButton.className = "default";
				this.defaultHtmlButton = htmlButton;
			}

			htmlButton.appendChild(document.createTextNode(button.text));
			YAHOO.util.Event.addListener(htmlButton, "click", button.handler, this);
			
			var me = this;

			if (b == 0) {
				this.preventBackTab = new YAHOO.util.KeyListener(htmlButton, { shift:true, keys:9 }, {fn:me.focusLastButton, scope:me, correctScope:true} );
				this.showEvent.subscribe(this.preventBackTab.enable, this.preventBackTab, true);
				this.hideEvent.subscribe(this.preventBackTab.disable, this.preventBackTab, true);
				this.preventBackTab.enable();

			}
			if (b == (buttons.length-1)) {
				if (this.cfg.getProperty("modal")) {
					this.restrictFocus = new YAHOO.util.KeyListener(htmlButton, { shift:false, keys:9 }, {fn:me.focusFirstButton,scope:me,correctScope:true} );
					this.showEvent.subscribe(this.restrictFocus.enable, this.restrictFocus, true);
					this.hideEvent.subscribe(this.restrictFocus.disable, this.restrictFocus, true);
					this.restrictFocus.enable();
				}
			}

			this.buttonSpan.appendChild(htmlButton);		
			button.htmlButton = htmlButton;
		}

		this.setFooter(this.buttonSpan);
	} else {
		if (this.buttonSpan)	{
			this.buttonSpan.style.display = "none";
		}
	}
	this.cfg.refireEvent("underlay");
	this.cfg.refireEvent("iframe");
}

/**
* Sets the focus to the button that is designated as the default. By default, his handler is executed when the show event is fired.
*/
YAHOO.widget.Dialog.prototype.focusDefault = function() {
	this.defaultHtmlButton.focus();
}
/**
* Blurs all the html buttons
*/
YAHOO.widget.Dialog.prototype.blurButtons = function() {
	var buttons = this.cfg.getProperty("buttons");
	if (buttons) {
		var html = buttons[0].htmlButton;
		html.blur();
	}
}

/**
* Sets the focus to the first button in the button list
*/
YAHOO.widget.Dialog.prototype.focusFirstButton = function() {
	var buttons = this.cfg.getProperty("buttons");
	if (buttons) {
		var html = buttons[0].htmlButton;
		html.focus();
	}
}
/**
* Sets the focus to the last button in the button list
*/
YAHOO.widget.Dialog.prototype.focusLastButton = function() {
	var buttons = this.cfg.getProperty("buttons");
	if (buttons) {
		var html = buttons[buttons.length-1].htmlButton;
		html.focus();
	}
}
// END BUILT-IN PROPERTY EVENT HANDLERS //

// BEGIN BUILT-IN DOM EVENT HANDLERS //
/**
* The default event handler fired when the user clicks OK/Yes in the built-in button set
* @param {DOMEvent} e	The current DOM event
* @param {object}	obj	The object argument, in this case, the Dialog itself
*/
YAHOO.widget.Dialog.prototype.handleSubmitClick = function(e, obj) { }

/**
* The default event handler fired when the user clicks Cancel in the built-in button set
* @param {DOMEvent} e	The current DOM event
* @param {object}	obj	The object argument, in this case, the Dialog itself
*/
YAHOO.widget.Dialog.prototype.handleCancelClick = function(e, obj) {
	obj.hide();
}

// END BUILT-IN DOM EVENT HANDLERS //

/**
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
* @class
* FormDialog is an implementation of Panel that can be used to submit form data. Built-in functionality for buttons with event handlers is included, and button sets can be build dynamically, or the preincluded ones for Submit/Cancel and OK/Cancel can be utilized. Forms can be processed in 3 ways -- via an asynchronous Connection utility call, a simple form POST or GET, or manually.
* @param {string}	el	The element ID representing the FormDialog <em>OR</em>
* @param {Element}	el	The element representing the FormDialog
* @param {object}	userConfig	The configuration object literal containing the configuration that should be set for this FormDialog. See configuration documentation for more details.
* @constructor
*/
YAHOO.widget.FormDialog = function(el, userConfig) {
	if (arguments.length > 0) {
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
* Constant representing the default CSS class used for a FormDialog
* @type string
* @final
*/
YAHOO.widget.FormDialog.CSS_FORMDIALOG = "form-dialog";

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
	this.cfg.addProperty("onsuccess",	null,	this.configOnSuccess, null, null, true);
	this.cfg.addProperty("onfailure",	null,	this.configOnFailure, null, null, true);
}

/**
* Initializes the custom events for FormDialog which are fired automatically at appropriate times by the FormDialog class.
*/
YAHOO.widget.FormDialog.prototype.initEvents = function() {
	YAHOO.widget.FormDialog.superclass.initEvents.call(this);

	this.submitEvent		= new YAHOO.util.CustomEvent("submit");

	this.manualSubmitEvent	= new YAHOO.util.CustomEvent("manualSubmit");
	this.asyncSubmitEvent	= new YAHOO.util.CustomEvent("asyncSubmit");
	this.formSubmitEvent	= new YAHOO.util.CustomEvent("formSubmit");

	this.cancelEvent		= new YAHOO.util.CustomEvent("cancel");
}

/*
* The FormDialog initialization method, which is executed for FormDialog and all of its subclasses. This method is automatically called by the constructor, and  sets up all DOM references for pre-existing markup, and creates required markup if it is not already present.
* @param {string}	el	The element ID representing the FormDialog <em>OR</em>
* @param {Element}	el	The element representing the FormDialog
* @param {object}	userConfig	The configuration object literal containing the configuration that should be set for this FormDialog. See configuration documentation for more details.
*/
YAHOO.widget.FormDialog.prototype.init = function(el, userConfig) {
	YAHOO.widget.FormDialog.superclass.init.call(this, el/*, userConfig*/);  // Note that we don't pass the user config in here yet because we only want it executed once, at the lowest subclass level

	YAHOO.util.Dom.addClass(this.element, YAHOO.widget.FormDialog.CSS_FORMDIALOG);

	/**
	* Built-in button set for OK/Cancel buttons
	* @type Array
	*/	
	this.BUTTONS_OKCANCEL = [ 
				{	text : "OK",
					handler : this.handleSubmitClick,
					isDefault : true
				},
				{	text : "Cancel",
					handler : this.handleCancelClick
				}];

	/**
	* Built-in button set for Submit/Cancel buttons
	* @type Array
	*/
	this.BUTTONS_SUBMITCANCEL = [ 
				{	text : "Submit",
					handler : this.handleSubmitClick,
					isDefault : true
				},
				{	text : "Cancel",
					handler : this.handleCancelClick
				}];


	var me = this;

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
													if (this.cfg.getProperty("modal")) {
														this.preventBackTab = new YAHOO.util.KeyListener(this.form[0], { shift:true, keys:9 }, {fn:me.focusLastButton, scope:me, correctScope:true});
														this.showEvent.subscribe(this.preventBackTab.enable, this.preventBackTab, true);
														this.hideEvent.subscribe(this.preventBackTab.disable, this.preventBackTab, true);
													}
												}
											 }, this, true);
	}

	this.showEvent.subscribe(this.focusFirstField, this, true);
	this.beforeHideEvent.subscribe(this.blurButtons, this, true);

	if (userConfig) {
		this.cfg.applyConfig(userConfig);
	}

	if (this.cfg.getProperty("modal") && this.form) {
		this.preventBackTab = new YAHOO.util.KeyListener(this.form[0], { shift:true, keys:9 }, {fn:me.focusLastButton, scope:me, correctScope:true} );
		this.showEvent.subscribe(this.preventBackTab.enable, this.preventBackTab, true);
		this.hideEvent.subscribe(this.preventBackTab.disable, this.preventBackTab, true);
	}
}


// BEGIN BUILT-IN PROPERTY EVENT HANDLERS //

/**
* The default event handler for the "buttons" configuration property
*/
YAHOO.widget.FormDialog.prototype.configButtons = function(type, args, obj) {
	var buttons = args[0];
	if (buttons != "none") {
		this.buttonSpan = null;
		this.buttonSpan = document.createElement("SPAN");
		this.buttonSpan.className = "button-group";
		
		if (buttons == "okcancel") {
			buttons = this.BUTTONS_OKCANCEL;
		} else if (buttons == "submitcancel") {
			buttons = this.BUTTONS_SUBMITCANCEL;
		}

		for (var b=0;b<buttons.length;b++) {
			var button = buttons[b];
			var htmlButton = document.createElement("BUTTON");

			if (button.isDefault) {
				htmlButton.className = "default";
				this.defaultHtmlButton = htmlButton;
			}

			htmlButton.appendChild(document.createTextNode(button.text));
			YAHOO.util.Event.addListener(htmlButton, "click", button.handler, this);
			
			var me = this;

			if (b == (buttons.length-1)) {
				if (this.cfg.getProperty("modal")) {
					this.restrictFocus = new YAHOO.util.KeyListener(htmlButton, { shift:false, keys:9 }, {fn:me.focusFirstField,scope:me,correctScope:true} );
					this.showEvent.subscribe(this.restrictFocus.enable, this.restrictFocus, true);
					this.hideEvent.subscribe(this.restrictFocus.disable, this.restrictFocus, true);
					this.restrictFocus.enable();
				}
			}

			this.buttonSpan.appendChild(htmlButton);		
			button.htmlButton = htmlButton;
		}

		this.setFooter(this.buttonSpan);
	} else {
		if (this.buttonSpan)	{
			this.buttonSpan.style.display = "none";
		}
	}
	this.cfg.refireEvent("iframe");
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

/**
* Sets the focus to the button that is designated as the default. By default, his handler is executed when the show event is fired.
*/
YAHOO.widget.FormDialog.prototype.focusDefault = function() {
	this.defaultHtmlButton.focus();
}

/**
* Blurs all the html buttons
*/
YAHOO.widget.FormDialog.prototype.blurButtons = function() {
	var buttons = this.cfg.getProperty("buttons");
	if (buttons) {
		var html = buttons[0].htmlButton;
		html.blur();
	}
}

/**
* Sets the focus to the first button in the button list
*/
YAHOO.widget.FormDialog.prototype.focusFirstButton = function() {
	var buttons = this.cfg.getProperty("buttons");
	if (buttons) {
		var html = buttons[0].htmlButton;
		html.focus();
	}
}
/**
* Sets the focus to the last button in the button list
*/
YAHOO.widget.FormDialog.prototype.focusLastButton = function() {
	var buttons = this.cfg.getProperty("buttons");
	if (buttons) {
		var html = buttons[buttons.length-1].htmlButton;
		html.focus();
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
	obj.cancel();
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
* Executes the cancel of the FormDialog followed by a hide.
*/
YAHOO.widget.FormDialog.prototype.cancel = function() {
	this.cancelEvent.fire();
	this.hide();	
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
