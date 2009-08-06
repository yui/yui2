/**
 * Augments the Event Utility with support for the mouseenter and mouseleave 
 * events
 * 
 * @module event-mouseenter
 * @title Event Utility mouseenter and mouseout Module
 * @namespace YAHOO.util
 * @requires event
 */

(function () {

	var Event = YAHOO.util.Event,
		Lang = YAHOO.lang,

		addListener = Event.addListener,
		removeListener = Event.removeListener,

		delegates = [],
		
		specialTypes = {
			mouseenter: "mouseover",
			mouseleave: "mouseout"
		}, 

		remove = function(el, type, fn) {

			var index = Event._getCacheIndex(delegates, el, type, fn),
				cacheItem,
				returnVal;

		    if (index >= 0) {
		        cacheItem = delegates[index];
		    }

		    if (el && cacheItem) {

				//	removeListener will translate the value of type				
		        returnVal = removeListener.call(Event, cacheItem[0], type, cacheItem[3]);
		
				if (returnVal) {
	                delete delegates[index][2];
	                delete delegates[index][3];
	                delegates.splice(index, 1);
				}
		
		    }

			return returnVal;

		};		


	Lang.augmentObject(Event._specialTypes, specialTypes); 

	Lang.augmentObject(Event, {

		/**
		 * Creates a delegate function used to call event listeners specified 
		 * via the <code>YAHOO.util.Event.addListener</code> 
		 * or <code>YAHOO.util.Event.on</code> method.
		 *
		 * @method _createMouseDelegate
		 *
		 * @param {Function} fn        The method (event listener) to call
		 * @param {Object}   obj    An arbitrary object that will be 
		 *                             passed as a parameter to the listener
		 * @param {Boolean|object}  overrideContext  If true, the obj passed in becomes
		 *                             the execution context of the listener. If an
		 *                             object, this object becomes the execution
		 *                             context. 
		 * @return {Function} Function that will call the event listener 
		 * specified by either the <code>YAHOO.util.Event.addListener</code> 
		 * or <code>YAHOO.util.Event.on</code> method.
	     * @private
		 * @static
	     * @for Event
		 */
		_createMouseDelegate: function (fn, obj, overrideContext) {

			return function (event, container) {

				var el = this,
					relatedTarget = Event.getRelatedTarget(event),
					context,
					args;

				if (el != relatedTarget && !YAHOO.util.Dom.isAncestor(el, relatedTarget)) {

					context = el;

			        if (overrideContext) {
			            if (overrideContext === true) {
			                context = obj;
			            } else {
			                context = overrideContext;
			            }
			        }

					//	The default args passed back to a mouseenter or 
					//	mouseleave listener are: the event, the element 
					//	to which the listener is bound, and any object the  
					//	user passed when subscribing

					args = [event, el, obj];

					//	Add the delegation container as an argument when 
					//	delegating mouseenter and mouseleave

					if (container) {
						args.splice(2, 0, container);
					}

					return fn.apply(context, args);

				}

			};

		},
		
		addListener: function (el, type, fn, obj, overrideContext) {

			var fnDelegate,
				returnVal;

			if (specialTypes[type]) {

				fnDelegate = Event._createMouseDelegate(fn, obj, overrideContext);

				delegates.push([el, type, fn, fnDelegate]);

				//	addListener will translate the value of type
				returnVal = addListener.call(Event, el, type, fnDelegate);

			}
			else {
				returnVal = addListener.apply(Event, arguments);
			}

			return returnVal;

		},
		
		removeListener: function (el, type, fn) {

			var returnVal;

			if (specialTypes[type]) {
				returnVal = remove.apply(Event, arguments);
			}
			else {
				returnVal = removeListener.apply(Event, arguments);
			}

			return returnVal;

		}		
		
	}, true);
	
	Event.on = Event.addListener;

}());
