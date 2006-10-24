/**
 * Provides Attribute options for properties.
 * @namespace YAHOO.util
 * @class Attribute
 * @constructor
 * @param hash {Object} The intial Attribute.
 * @param {YAHOO.util.ConfigMgr} The owner of the Attribute instance.
 */

YAHOO.util.Attribute = function(hash, owner) {
    if (owner) { 
        this.owner = owner;
        this.configure(hash, true);
    }
};

YAHOO.util.Attribute.prototype = {
	/**
     * The name of the property.
	 * @property name
	 * @type String
	 */
    name: undefined,
    
	/**
     * The value of the property.
	 * @property value
	 * @type String
	 */
    value: null,
    
	/**
     * The owner of the property.
	 * @property owner
	 * @type YAHOO.util.PropertyMgr
	 */
    owner: null,
    
	/**
     * Whether or not the property is read only.
	 * @property readOnly
	 * @type Boolean
	 */
    readOnly: false,
    
	/**
     * Whether or not the property can only be written once.
	 * @property writeOnce
	 * @type Boolean
	 */
    writeOnce: false,

	/**
     * The property's initial Attribute.
     * @private
	 * @property _initialConfig
	 * @type Object
	 */
    _initialConfig: null,
    
	/**
     * Whether or not the property's value has been set.
     * @private
	 * @property _written
	 * @type Boolean
	 */
    _written: false,
    
	/**
     * The method to use when setting the property's value.
     * The method recieves the new value as the only argument.
	 * @property method
	 * @type Function
	 */
    method: null,
    
	/**
     * The validator to use when setting the property's value.
	 * @property validator
	 * @type Function
     * @return Boolean
	 */
    validator: null,
    
    /**
     * Retrieves the current value of the property.
     * @method getValue
     * @return {any} The current value of the property.
     */
    getValue: function() {
        return this.value;
    },
    
    /**
     * Sets the value of the property and fires beforeChange and change events.
     * @method setValue
     * @param {Any} value The value to apply to the property.
     * @param {Boolean} silent If true the change events will not be fired.
     * @return {Boolean} Whether or not the value was set.
     */
    setValue: function(value, silent) {
        var beforeRetVal;
        var owner = this.owner;
        var name = this.name;
        
        if (this.readOnly || ( this.writeOnce && this._written) ) {
            return false; // write not allowed
        }
        
        if (this.validator && !this.validator.call(owner, value) ) {
            return false; // invalid value
        }

        if (!silent) { // TODO: should Property be a publisher?
            beforeRetVal = owner.fireBeforeChangeEvent(name, value);
            if (beforeRetVal === false) {
                YAHOO.log('setValue ' + name + 
                        'cancelled by beforeChange event', 'info', 'Property');
                return false;
            }
        }
        //console.log(name + ' ' + value);
        if (this.method) {
            this.method.call(owner, value);
        }
        
        this.value = value;
        this._written = true;
        
        if (!silent) {
            this.owner.fireChangeEvent.call(owner, name, value); // TODO: should this be current value?
        }
        
        return true;
    },
    
    /**
     * Sets the value of the property and fires beforeChange and change events.
     * @method configure
     * @param {Object} map A key-value map of Attribute properties.
     * @param {Boolean} init Whether or not this should become the initial config.
     */
    configure: function(map, init) {
        map = map || {};
        this._written = false; // reset writeOnce
        this._initialConfig = this._initialConfig || {};
        
        for (var key in map) {
            if ( map.propertyIsEnumerable(key) ) {
                this[key] = map[key];
                if (init) {
                    this._initialConfig[key] = map[key];
                }
            }
        }
    },
    
    /**
     * Resets the value to the initial config value.
     * @method resetValue
     * @param {Object} The config to apply to the property.
     * @return {Boolean} Whether or not the value was set.
     */
    resetValue: function() {
        return this.setValue(this._initialConfig.value);
    },
    
    /**
     * Resets the property config to the initial config state.
     * @method resetConfig
     */
    resetConfig: function() {
        this.configure(this._initialConfig);
    },
    
    /**
     * Resets the value to the current value.
     * Useful when values may have gotten out of sync with actual properties.
     * @method refresh
     * @return {Boolean} Whether or not the value was set.
     */
    refresh: function(silent) {
        this.setValue(this.value, silent);
    },
    
    setChildFunction: function(fnName, fn) {
        var fnTokens = fnName.split(".");
        for (var f=0;f<fnTokens.length;f++) {
            var token = fnTokens[f];
            if (f == (fnTokens.length-1)) {
                obj[token] = fn;
            } else {
                obj = obj[token];
            }
        }
    }
};