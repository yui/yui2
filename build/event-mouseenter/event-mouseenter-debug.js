(function () {

	var Event = YAHOO.util.Event,

		delegates = [],
		
		MOUSEOVER = "mouseover",
		MOUSEOUT = "mouseout",

		addListener = function (el, type, fn, obj, overrideContext) {

			var fnDelegate = Event._createMouseDelegate(fn, obj, overrideContext);

			delegates.push([el, type, fn, fnDelegate]);

			return Event.on(el, type, fnDelegate);

		},

		removeListener = function(el, type, fn) {

			var index = Event._getCacheIndex(delegates, el, type, fn),
				cacheItem,
				returnVal;

		    if (index >= 0) {
		        cacheItem = delegates[index];
		    }

		    if (el && cacheItem) {
		        returnVal = Event.removeListener(cacheItem[0], type, cacheItem[3]);
		
				if (returnVal) {
	                delete delegates[index][2];
	                delete delegates[index][3];
	                delegates.splice(index, 1);
				}
		
		    }

			return returnVal;

		};		


	YAHOO.lang.augmentObject(Event, {

		/**
		 * Creates a delegate function used to call event listeners specified 
		 * via the <code>YAHOO.util.Event.onMouseEnter</code> and 
		 * <code>YAHOO.util.Event.onMouseLeave</code> methods.
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
		 * specified by either the <code>YAHOO.util.Event.onMouseEnter</code> 
		 * and <code>YAHOO.util.Event.onMouseLeave</code> methods.
         * @private
		 * @static
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


		/**
		 * Appends a mouseenter event listener&#151;a listener that is 
		 * called the first time the user's mouse enters the specified
		 * element.  Event listeners receive two arguments by default:
		 * the DOM event and the element to which the listener is bound.
		 * 
		 *
		 * @method onMouseEnter
		 *
		 * @param {String|HTMLElement|Array|NodeList} el An id, an element 
		 *  reference, or a collection of ids and/or elements to assign the 
		 *  listener to.
		 * @param {Function} fn        The method the event invokes
		 * @param {Object}   obj    An arbitrary object that will be 
		 *                             passed as a parameter to the listener
		 * @param {Boolean|object}  overrideContext  If true, the obj passed in becomes
		 *                             the execution context of the listener. If an
		 *                             object, this object becomes the execution
		 *                             context.
		 * @return {Boolean} True if the action was successful or defered,
		 *                        false if one or more of the elements 
		 *                        could not have the listener attached,
		 *                        or if the operation throws an exception.
		 * @static
		 */
		onMouseEnter: function (el, fn, obj, overrideContext) {
			return addListener.call(Event, el, MOUSEOVER, fn, obj, overrideContext);
		},


		/**
		 * Appends a mouseleave event listener&#151;a listener that is 
		 * called the first time the user's mouse leaves the specified
		 * element.  Event listeners receive two arguments by default:
		 * the DOM event and the element to which the listener is bound.
		 *
		 * @method onMouseLeave
		 *
		 * @param {String|HTMLElement|Array|NodeList} el An id, an element 
		 *  reference, or a collection of ids and/or elements to assign the 
		 *  listener to.
		 * @param {Function} fn        The method the event invokes
		 * @param {Object}   obj    An arbitrary object that will be 
		 *                             passed as a parameter to the listener
		 * @param {Boolean|object}  overrideContext  If true, the obj passed in becomes
		 *                             the execution context of the listener. If an
		 *                             object, this object becomes the execution
		 *                             context.
		 * @return {Boolean} True if the action was successful or defered,
		 *                        false if one or more of the elements 
		 *                        could not have the listener attached,
		 *                        or if the operation throws an exception.
		 * @static
		 */
		onMouseLeave: function (el, fn, obj, overrideContext) {
			return addListener.call(Event, el, MOUSEOUT, fn, obj, overrideContext);
		},


        /**
         * Removes a mouseenter event listener
         *
         * @method removeMouseEnterListener
         *
         * @param {String|HTMLElement|Array|NodeList} el An id, an element 
         *  reference, or a collection of ids and/or elements to remove
         *  the listener from.
         * @param {Function} fn the method the event invokes.  If fn is
         *  undefined, then all event listeners for the type of event are 
         *  removed.
         * @return {boolean} true if the unbind was successful, false 
         *  otherwise.
         * @static
         */
		removeMouseEnterListener: function (el, fn) { 
			return removeListener.call(Event, el, MOUSEOVER, fn);
		},


        /**
         * Removes a mouseleave event listener
         *
         * @method removeMouseLeaveListener
         *
         * @param {String|HTMLElement|Array|NodeList} el An id, an element 
         *  reference, or a collection of ids and/or elements to remove
         *  the listener from.
         * @param {Function} fn the method the event invokes.  If fn is
         *  undefined, then all event listeners for the type of event are 
         *  removed.
         * @return {boolean} true if the unbind was successful, false 
         *  otherwise.
         * @static
         */
		removeMouseLeaveListener: function (el, fn) { 
			return removeListener.call(Event, el, MOUSEOUT, fn);
		}
		
	});

}());
YAHOO.register("event-mouseenter", YAHOO.util.Event, {version: "@VERSION@", build: "@BUILD@"});
