/*
 * SWF limitation:
 *  - only 100,000 bytes of data may be stored this way
 *  - data is publicly available on user machine
 *
 * Thoughts:
 *  - data can be shared across browsers
 *  - how can we not use cookies to handle session location
 */
(function() {
    // internal shorthand
var Y = YAHOO.util,
    YL = YAHOO.lang,
    YD = Y.Dom,
    
    /*
     * The minimum width required to be able to display the settings panel within the SWF.
     */ 
    MINIMUM_WIDTH = 215,

    /*
     * The minimum height required to be able to display the settings panel within the SWF.
     */ 
    MINIMUM_HEIGHT = 138,

    // local variables
    _engine = null,

    /*
     * Creates a location bound key.
     */
    _getKey = function(that, key) {
        return that._location + that.DELIMITER + key;
    },

    /*
     * Initializes the engine, if it isn't already initialized.
     */
    _initEngine = function(cfg) {
        if (! _engine) {
            if (! YL.isString(cfg.swfURL)) {cfg.swfURL = Y.StorageEngineSWF.SWFURL;}
            if (! cfg.containerID) {
                var bd = document.getElementsByTagName('body')[0],
                    container = bd.appendChild(document.createElement('div'));
                cfg.containerID = YD.generateId(container);
            }

            if (! cfg.attributes) {cfg.attributes  = {};}
            if (! cfg.attributes.flashVars) {cfg.attributes.flashVars = {};}
            cfg.attributes.flashVars.useCompression = 'true';
            cfg.attributes.version = 9.115;
            _engine = new YAHOO.widget.SWF(cfg.containerID, cfg.swfURL, cfg.attributes);
        }
    };

    /**
     * The StorageEngineSWF class implements the SWF storage engine.
     * @namespace YAHOO.util
     * @class StorageEngineSWF
     * @uses YAHOO.widget.SWF
     * @constructor
     * @extend YAHOO.util.Storage
     * @param location {String} Required. The storage location.
     * @param conf {Object} Required. A configuration object.
     */
    Y.StorageEngineSWF = function(location, conf) {
        var _this = this;
        Y.StorageEngineSWF.superclass.constructor.call(_this, location, Y.StorageEngineSWF.ENGINE_NAME, conf);
        
        _initEngine(_this._cfg);

        // evaluates when the SWF is loaded
		_engine.unsubscribe('contentReady'); // prevents local and session content ready callbacks from firing, when switching between context
        _engine.addListener("contentReady", function() {
            _this._swf = _engine._swf;
            _engine.initialized = true;
			
			var isSessionStorage = Y.StorageManager.LOCATION_SESSION === _this._location,
				sessionKey = Y.Cookie.get('sessionKey' + Y.StorageEngineSWF.ENGINE_NAME);

            for (var i = _engine.callSWF("getLength", []) - 1; 0 <= i; i -= 1) {
                var key = _engine.callSWF("getNameAt", [i]),
                    isKeySessionStorage = -1 < key.indexOf(Y.StorageManager.LOCATION_SESSION + _this.DELIMITER);

                // this is session storage, but the session key is not set, so remove item
                if (isSessionStorage && ! sessionKey) {
                    _engine.callSWF("removeItem", [key]);
                }
                // the key matches the storage type, add to key collection
                else if (isSessionStorage === isKeySessionStorage) {
                    _this._addKey(key);
                }
            }

            // this is session storage, ensure that the session key is set
            if (isSessionStorage) {
                Y.Cookie.set('sessionKey' + Y.StorageEngineSWF.ENGINE_NAME, true);
            }

            _this.length = _this._keys.length;
            _this.fireEvent(_this.CE_READY);
        });
        
        // required for pages with both a session and local storage
        if (_engine.initialized) {_engine.fireEvent('contentReady');}
    };

    YL.extend(Y.StorageEngineSWF, Y.StorageEngineKeyed, {
        /**
         * The underlying SWF of the engine, exposed so developers can modify the adapter behavior.
         * @property _swf
         * @type {Object}
         * @protected
         */
        _swf: null,

        /*
         * Implementation to clear the values from the storage engine.
         * @see YAHOO.util.Storage._clear
         */
        _clear: function() {
            for (var i = this._keys.length - 1; 0 <= i; i -= 1) {
                var key = this._keys[i];
                _engine.callSWF("removeItem", [key]);
            }

            this._keys = [];
            this.length = 0;
        },

        /*
         * Implementation to fetch an item from the storage engine.
         * @see YAHOO.util.Storage._getItem
         */
        _getItem: function(key) {
            var _key = _getKey(this, key);
            return _engine.callSWF("getValueOf", [_key]);
        },

        /*
         * Implementation to fetch a key from the storage engine.
         * @see YAHOO.util.Storage.key
         */
        _key: function(index) {
            return (this._keys[index] || '').replace(/^.*?__/, '');
        },

        /*
         * Implementation to remove an item from the storage engine.
         * @see YAHOO.util.Storage._removeItem
         */
        _removeItem: function(key) {
            var _key = _getKey(this, key);
            _engine.callSWF("removeItem", [_key]);
            this._removeKey(_key);
        },

        /*
         * Implementation to remove an item from the storage engine.
         * @see YAHOO.util.Storage._setItem
         */
        _setItem: function(key, data) {
            var _key = _getKey(this, key), swfNode;

            // setting the value returns false if the value didn't change,
            // so I changed this to clear the key if it exists so that the
            // fork below works.
            if (_engine.callSWF("getValueOf", [_key])) {
                this._removeItem(key);
            }

            this._addKey(_key);

            if (_engine.callSWF("setItem", [_key, data])) {
                return true;
            } else {

                // @TODO we should not assume that a false return means that
                // the quota has been exceeded.  this dialog should only be
                // displayed if the quotaExceededError event fired.
                swfNode = YD.get(_engine._id);
                if (MINIMUM_WIDTH > YD.getStyle(swfNode, 'width').replace(/\D+/g, '')) {
                    YD.setStyle(swfNode, 'width', MINIMUM_WIDTH + 'px');
                }
                if (MINIMUM_HEIGHT > YD.getStyle(swfNode, 'height').replace(/\D+/g, '')) {
                    YD.setStyle(swfNode, 'height', MINIMUM_HEIGHT + 'px');
                }
                return _engine.callSWF("displaySettings", []);
            }
        }
    });

    Y.StorageEngineSWF.SWFURL = "swfstore.swf";
    Y.StorageEngineSWF.ENGINE_NAME = 'swf';
    Y.StorageEngineSWF.isAvailable = function() {
        return (6 <= YAHOO.env.ua.flash && YAHOO.widget.SWF);
    };
    Y.StorageManager.register(Y.StorageEngineSWF);
}());
