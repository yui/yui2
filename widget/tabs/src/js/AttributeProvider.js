(function() {
    var Lang = YAHOO.util.Lang;

    /*
    Copyright (c) 2006, Yahoo! Inc. All rights reserved.
    Code licensed under the BSD License:
    http://developer.yahoo.net/yui/license.txt
    */
    
    /**
     * Manages YAHOO.util.Configuration instances
     * @namespace YAHOO.util
     * @class AttributeProvider
     * @uses YAHOO.util.EventProvider
     */
    YAHOO.util.AttributeProvider = function() {};
    
    YAHOO.util.AttributeProvider.prototype = {
        
        /**
         * Returns the current value of the property.
         * @property _configs
         * @protected
         * @type {Object} A key-value map of Configuration properties
         */
        _configs: null,
        /**
         * Returns the current value of the config.
         * @method get
         * @param {String} key The config whose value will be returned.
         */
        get: function(key){ // TODO: return copies of objects?
            var configs = this._configs || {};
            var config = configs[key];
            
            if (!config) {
                YAHOO.log(key + ' not found', 'error', 'AttributeProvider');
                return undefined;
            }
            
            return config.value;
        },
        
        /**
         * Sets the value of a config.
         * @method set
         * @param {String} key The name of the config
         * @param {Any} value The value to apply to the config's value
         * @param {Boolean} silent Whether the value should be set silently,
         * without firing the change events.
         * @return {Boolean} Whether or not the value was set.
         */
        set: function(key, value, silent){
            var configs = this._configs || {};
            var config = configs[key];
            
            if (!config) {
                YAHOO.log('set failed: ' + key + ' not found',
                        'error', 'AttributeProvider');
                return false;
            }
            
            return config.setValue(value, silent);
        },
    
        /**
         * Returns a key-value map of config names and their current values.
         * @method getValues
         * @return {Object} A key-value map of config names and values.
         */
        getConfigKeys: function(){
            var configs = this._configs;
            var keys = [];
            var config;
            for (var key in configs) {
                config = configs[key];
                if ( configs.propertyIsEnumerable(key) && 
                        !Lang.isUndefined(config) ) {
                    keys[keys.length] = key;
                }
            }
            
            return keys;
        },
        
        /**
         * Sets multiple config values.
         * @method setValues
         * @param {Object} map  A map of keys-values.
         * @param {Boolean} silent If true, change events will not fire.
         */
        setValues: function(map, silent){
            for (var key in map) {
                if ( map.propertyIsEnumerable(key) ) {
                    this.set(key, map[key], silent);
                }
            }
        },
    
        /**
         * Resets the specified property's value to its initial value.
         * @method resetProperty
         * @param {String} key The name of the property
         * @param {Boolean} silent Whether or not to suppress change events
         * @return {Boolean} Whether or not the value was set
         */
        resetValue: function(key, silent){
            var configs = this._configs || {};
            if (configs[key]) {
                this.set(key, configs[key]._initialConfig.value, silent);
                return true;
            }
            return false;
        },
    
        /**
         * Sets the config's value to its current value.
         * @method refresh
         * @param {String | Array} key The config(s) to refresh
         */
        refresh: function(key, silent){
            var configs = this._configs;
            
            key = ( ( Lang.isString(key) ) ? [key] : key ) || 
                    this.getConfigKeys(); // if no key, refresh all TODO: keep?
            
            for (var i = 0, len = key.length; i < len; ++i) { 
                if ( // only set if there is a value and not null
                    configs[key[i]] && 
                    ! Lang.isUndefined(configs[key[i]].value) &&
                    ! Lang.isNull(configs[key[i]].value) ) {
                    configs[key[i]].refresh(silent);
                }
            }
        },
    
        /**
         * Adds a Configuration to the AttributeProvider instance. 
         * @method register
         * @param {String} key The property's name
         * @param {Object} map A key-value map containing the config's properties.
         */
        register: function(key, map) {
            this._configs = this._configs || {};
            
            if (this._configs[key]) { // dont override
                return false;
            }
            
            map.name = key;
            this._configs[key] = new YAHOO.util.Attribute(map, this);
            return true;
        },
        
        /**
         * Returns the config's properties.
         * @method getConfig
         * @param {String} key The config's name
         * @return {object} A key-value map containing all of the
         * config's properties.
         */
        getConfig: function(key) {
            var configs = this._configs || {};
            var config = configs[key] || {};
            var map = {}; // returning a copy to prevent overrides
            
            for (key in config) {
                if ( config.propertyIsEnumerable(key) ) {
                    map[key] = config[key];
                }
            }
    
            return map;
        },
        
        /**
         * Sets or updates a Configuration instance's properties. 
         * @method configure
         * @param {String} key The config's name.
         * @param {Object} map A key-value map of config properties
         * @param {Boolean} init Whether or not this should become the intial config.
         */
        setValues: function(map, silent, init) {// TODO: init?
            var configs = this._configs || {};
            
            for (var key in map) {
                if ( map.propertyIsEnumerable(key) ) {
                    this.set(key, map[key], silent);
                }
            }
        },
        
        // TODO: configure multiples?
        
        /**
         * Sets or updates a Configuration instance's properties. 
         * @method configure
         * @param {String} key The config's name.
         * @param {Object} map A key-value map of config properties
         * @param {Boolean} init Whether or not this should become the intial config.
         */
        configure: function(key, map, init) {
            var configs = this._configs || {};
            
            if (!configs[key]) {
                YAHOO.log('unable to configure, ' + key + ' not found',
                        'error', 'AttributeProvider');
                return false;
            }
            
            configs[key].configure(map, init);
        },
        
        /**
         * Resets a config to its intial configuration. 
         * @method resetConfig
         * @param {String} key The config's name.
         */
        resetConfig: function(key){
            var configs = this._configs || {};
            configs[key].resetConfig();
        },
        
        /**
         * Fires the config's beforeChange event. 
         * @method fireBeforeChangeEvent
         * @param {String} key The property's name.
         * @param {Any} arg An argument to pass to the listeners.
         */
        fireBeforeChangeEvent: function(key, arg) {
            var type = 'before';
            type += key.charAt(0).toUpperCase() + key.substr(1) + 'Change';

            return this.fireEvent(type, arg);
        },
        
        /**
         * Fires the config's change event. 
         * @method fireChangeEvent
         * @param {String} key The property's name.
         * @param {Any} arg An argument to pass to the listeners.
         */
        fireChangeEvent: function(key, arg) {
            return this.fireEvent(key + 'Change', arg);
        }
    };
    
    YAHOO.augment(YAHOO.util.AttributeProvider, YAHOO.util.EventProvider);
})();