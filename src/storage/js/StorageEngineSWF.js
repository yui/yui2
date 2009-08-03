/*
 * Copyright (c) 2009, Matt Snider, LLC. All rights reserved.
 * Version: 0.2.00
 */

/*
 * SWF limitation:
 * 	- only 100,000 bytes of data may be stored this way
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

		// local variables
		_engine = null;

	var _getKey = function(that, key) {
		return that._location + that.DELIMITER + key;
	};

	/**
	 * Initializes the engine, if it isn't already initialized.
	 * @method _initEngine
	 * @param cfg {Object} Required. The configuration.
	 * @private
	 */
	var _initEngine = function(cfg) {
		if (! _engine) {
			if (! YL.isString(cfg.swfURL)) {cfg.swfURL = Y.StorageEngineSWF.SWFURL;}
			if (! cfg.containerID) {
				var bd = document.getElementsByTagName('body')[0],
					container = bd.appendChild(document.createElement('div'));
				cfg.containerID = Y.Dom.generateId(container);
			}

			if (! cfg.attributes) {cfg.attributes  = {};}
			if (! cfg.attributes.flashVars) {cfg.attributes.flashVars = {};}
			cfg.attributes.flashVars.useCompression = 'true';
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

		var isSessionStorage = Y.StorageManager.LOCATION_SESSION === _this._location;

		// evaluates when the SWF is loaded
		_engine.addListener("contentReady", function() {
			_this._swf = _engine._swf;

			var sessionKey = Y.Cookie.get('sessionKey' + Y.StorageEngineSWF.ENGINE_NAME);

			for (var i = _engine.callSWF("getLength", []) - 1; 0 <= i; i -= 1) {
				var key = _engine.callSWF("getNameAt", [i]),
					isKeySessionStorage = -1 < key.indexOf(Y.StorageManager.LOCATION_SESSION + _this.DELIMITER);

				// this is session storage, but the session key is not set, so remove item
				if (isSessionStorage && ! sessionKey) {
					_engine.callSWF("removeItem", [key]);
				}
				// the key matches the storage type, add to key collection
				else if (isSessionStorage === isKeySessionStorage) {
					_this._keys.push(key);
				}
			}

			// this is session storage, ensure that the session key is set
			if (isSessionStorage) {
				Y.Cookie.set('sessionKey' + Y.StorageEngineSWF.ENGINE_NAME, true);
			}

			_this.length = _this._keys.length;
			_this.fireEvent(_this.CE_READY);
		});
	};

	YL.extend(Y.StorageEngineSWF, Y.StorageEngineKeyed, {
		/**
		 * The underlying SWF of the engine, exposed so developers can modify the adapter behavior.
		 * @property _swf
		 * @type {Object}
		 * @public
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
			var _key = _getKey(this, key);

			if (! _engine.callSWF("getValueOf", [_key])) {
				this._addKey(_key);
			}
			
			return _engine.callSWF("setItem", [data, _key]);
		}
	});

	Y.StorageEngineSWF.SWFURL = "swfstore.swf";
	Y.StorageEngineSWF.ENGINE_NAME = 'swf';
    Y.StorageManager.register(Y.StorageEngineSWF.ENGINE_NAME, function() {
		return (6 <= YAHOO.env.ua.flash && YAHOO.widget.SWF);
	}, Y.StorageEngineSWF);
}());