/**
 * Augments the Element Utility with event delegation support.
 *
 * @module element-delegate
 * @title Element Event Delegation Module
 * @namespace YAHOO.util
 * @requires element
 */

(function () {

	var Event = YAHOO.util.Event,
		delegates = [],
		specialTypes = {
			mouseenter: true,
			mouseleave: true
		};

	YAHOO.lang.augmentObject(YAHOO.util.Element.prototype, {

	    /**
         * Appends a delegated event listener.  Delegated event listeners 
		 * receive two arguments by default: the DOM event and the element  
		 * specified by the filtering function or CSS selector. 
	     * @method delegate
	     * @param {String} type The name of the event to listen for
	     * @param {Function} fn The handler to call when the event fires
		 * @param {Function|string} filter Function or CSS selector used to 
		 * determine for what element(s) the event listener should be called. 
		 * When a function is specified, the function should return an 
		 * HTML element.  Using a CSS Selector requires the inclusion of the 
		 * CSS Selector utility (YAHOO.util.Selector).
	     * @param {Any} obj A variable to pass to the handler
	     * @param {Object} scope The object to use for the scope of the handler 
         * @return {boolean} true if the delegate was added successfully
         * @for Element
	     */
		delegate: function (type, fn, filter, obj, overrideContext) {

			var sType = Event._getType(type),
				el = this.get("element"),
				fnDelegate,
				fnMouseDelegate,

				fnWrapper = function (e) {

					return fnDelegate.call(el, e);

				};

			if (!Event._createDelegate) {
		        YAHOO.log("Using delegate functionality requires the event-delegate", "error", "Event");
		        return false;
			}

			if (specialTypes[type]) {

				fnMouseDelegate = Event._createMouseDelegate(fn, obj, overrideContext);

				fnDelegate = Event._createDelegate(function (event, matchedEl, container) {

					return fnMouseDelegate.call(matchedEl, event, container);

				}, filter, obj, overrideContext);

			}
			else {
				fnDelegate = Event._createDelegate(fn, filter, obj, overrideContext);
			}


			delegates.push([el, sType, fn, fnWrapper]);

			return this.on(sType, fnWrapper);

		},


	    /**
	     * Remove an event listener
	     * @method removeDelegate
	     * @param {String} type The name of the event to listen for
	     * @param {Function} fn The function call when the event fires
         * @return {boolean} true if the unbind was successful, false 
         *  otherwise.
         * @for Element
	     */
		removeDelegate: function (type, fn) {

			var sType = Event._getType(type),
				index = Event._getCacheIndex(delegates, this.get("element"), sType, fn),
				returnVal,
				cacheItem;

		    if (index >= 0) {
		        cacheItem = delegates[index];
		    }

		    if (cacheItem) {

		        returnVal = this.removeListener(cacheItem[1], cacheItem[3]);

				if (returnVal) {
		            delete delegates[index][2];
		            delete delegates[index][3];
		            delegates.splice(index, 1);
				}

			}

			return returnVal;

		}
		
	});

}());
YAHOO.register("element-delegate", YAHOO.util.Element, {version: "@VERSION@", build: "@BUILD@"});
