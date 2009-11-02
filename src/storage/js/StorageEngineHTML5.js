/*
 * HTML limitations:
 *  - 5MB in FF and Safari, 10MB in IE 8
 *  - only FF 3.5 recovers session storage after a browser crash
 *
 * Thoughts:
 *  - how can we not use cookies to handle session
 */
(function() {
	// internal shorthand
var Y = YAHOO.util,
	YL = YAHOO.lang,

	/*
	 * Required for IE 8 to make synchronous.
	 */
	_beginTransaction = function(engine) {
		if (engine.begin) {engine.begin();}
	},

	/*
	 * Required for IE 8 to make synchronous.
	 */
	_commitTransaction = function(engine) {
		if (engine.commit) {engine.commit();}
	};

	/**
	 * The StorageEngineHTML5 class implements the HTML5 storage engine.
	 * @namespace YAHOO.util
	 * @class StorageEngineHTML5
	 * @constructor
	 * @extend YAHOO.util.Storage
	 * @param location {String} Required. The storage location.
	 * @param conf {Object} Required. A configuration object.
	 */
	Y.StorageEngineHTML5 = function(location, conf) {
		var _this = this;
		Y.StorageEngineHTML5.superclass.constructor.call(_this, location, Y.StorageEngineHTML5.ENGINE_NAME, conf);// not set, are cookies available
		_this._engine = window[location];
		_this.length = _this._engine.length;
		YL.later(250, _this, function() { // temporary solution so that CE_READY can be subscribed to after this object is created
			_this.fireEvent(_this.CE_READY);
		});
	};

	YAHOO.lang.extend(Y.StorageEngineHTML5, Y.Storage, {

		_engine: null,

		/*
		 * Implementation to clear the values from the storage engine.
		 * @see YAHOO.util.Storage._clear
		 */
		_clear: function() {
			var _this = this;
			if (_this._engine.clear) {
				_this._engine.clear();
			}
			// for FF 3, fixed in FF 3.5
			else {
				for (var i = _this.length, key; 0 <= i; i -= 1) {
					key = _this._key(i);
					_this._removeItem(key);
				}
			}
		},

		/*
		 * Implementation to fetch an item from the storage engine.
		 * @see YAHOO.util.Storage._getItem
		 */
		_getItem: function(key) {
			var o = this._engine.getItem(key);
			return YL.isObject(o) ? o.value : o; // for FF 3, fixed in FF 3.5
		},

		/*
		 * Implementation to fetch a key from the storage engine.
		 * @see YAHOO.util.Storage._key
		 */
		_key: function(index) {return this._engine.key(index);},

		/*
		 * Implementation to remove an item from the storage engine.
		 * @see YAHOO.util.Storage._removeItem
		 */
		_removeItem: function(key) {
			var _this = this;
			_beginTransaction(_this._engine);
			_this._engine.removeItem(key);
			_commitTransaction(_this._engine);
			_this.length = _this._engine.length;
		},

		/*
		 * Implementation to remove an item from the storage engine.
		 * @see YAHOO.util.Storage._setItem
		 */
		_setItem: function(key, value) {
			var _this = this;
			
			try {
				_beginTransaction(_this._engine);
				_this._engine.setItem(key, value);
				_commitTransaction(_this._engine);
				_this.length = _this._engine.length;
				return true;
			}
			catch (e) {
				return false;
			}
		}
	}, true);

	Y.StorageEngineHTML5.ENGINE_NAME = 'html5';
	Y.StorageEngineHTML5.isAvailable = function() {
		return window.localStorage;
	};
    Y.StorageManager.register(Y.StorageEngineHTML5);
}());