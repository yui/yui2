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