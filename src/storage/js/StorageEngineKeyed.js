(function() {
var Y = YAHOO.util,
	YL = YAHOO.lang;

	/**
	 * The StorageEngineKeyed class implements the interface necessary for managing keys.
	 * @namespace YAHOO.util
	 * @class StorageEngineKeyed
	 * @constructor
	 * @extend YAHOO.util.Storage
	 */
	Y.StorageEngineKeyed = function() {
		Y.StorageEngineKeyed.superclass.constructor.apply(this, arguments);
		this._keys = [];
		this._keyMap = {};
	};

	YL.extend(Y.StorageEngineKeyed, Y.Storage, {

		/**
		 * A collection of keys applicable to the current location. This should never be edited by the developer.
		 * @property _keys
		 * @type {Array}
		 * @protected
		 */
		_keys: null,

		/**
		 * A map of keys to their applicable position in keys array. This should never be edited by the developer.
		 * @property _keyMap
		 * @type {Object}
		 * @protected
		 */
		_keyMap: null,

		/**
		 * Adds the key to the set.
		 * @method _addKey
		 * @param key {String} Required. The key to evaluate.
		 * @protected
		 */
		_addKey: function(key) {
			this._keyMap[key] = this.length;
			this._keys.push(key);
			this.length = this._keys.length;
		},

		/**
		 * Evaluates if a key exists in the keys array; indexOf does not work in all flavors of IE.
		 * @method _indexOfKey
		 * @param key {String} Required. The key to evaluate.
		 * @protected
		 */
		_indexOfKey: function(key) {
			var i = this._keyMap[key];
			return undefined === i ? -1 : i;
		},

		/**
		 * Removes a key from the keys array.
		 * @method _removeKey
		 * @param key {String} Required. The key to remove.
		 * @protected
		 */
		_removeKey: function(key) {
			var j = this._indexOfKey(key),
				rest = this._keys.slice(j + 1);

			delete this._keyMap[key];

			for (var k in this._keyMap) {
				if (j < this._keyMap[k]) {
					this._keyMap[k] -= 1;
				}
			}
			
			this._keys.length = j;
			this._keys = this._keys.concat(rest);
			this.length = this._keys.length;
		}
	});
}());