/* Copyright (c) 2006 Yahoo! Inc. All rights reserved. */

/**
 * The CustomEvent class lets you define events for your application
 * that can be subscribed to by one or more independent component.
 *
 * @param {String} type The type of event, which is passed to the callback
 *                 when the event fires
 * @param {Object} oScope The context the event will fire from.  "this" will
 *                 refer to this object in the callback.  Default value: 
 *                 the window object.  The listener can override this.
 * @constructor
 */
YAHOO.util.CustomEvent = function(type, oScope) {
    /**
     * The type of event, returned to subscribers when the event fires
     * @type string
     */
    this.type = type;

    /**
     * The scope the the event will fire from by default.  Defaults to the window 
     * obj
     * @type object
     */
    this.scope = oScope || window;

    /**
     * The subscribers to this event
     * @type Subscriber[]
     */
    this.subscribers = [];

    // Register with the event utility for automatic cleanup.  Made optional
    // so that CustomEvent can be used independently of pe.event
    if (YAHOO.util["Event"]) { 
        YAHOO.util.Event.regCE(this);
    }
};

YAHOO.util.CustomEvent.prototype = {
    /**
     * Subscribes the caller to this event
     * @param {Function} fn       The function to execute
     * @param {Object}   obj      An object to be passed along when the event fires
     * @param {boolean}  bOverride If true, the obj passed in becomes the execution
     *                            scope of the listener
     */
    subscribe: function(fn, obj, bOverride) {
        this.subscribers.push( new YAHOO.util.Subscriber(fn, obj, bOverride) );
    },

    /**
     * Unsubscribes the caller from this event
     * @param {Function} fn  The function to execute
     * @param {Object}   obj An object to be passed along when the event fires
     * @return {boolean} True if the subscriber was found and detached.
     */
    unsubscribe: function(fn, obj) {
        var found = false;
        for (var i=0; i<this.subscribers.length; ++i) {
            var s = this.subscribers[i];
            if (s && s.contains(fn, obj)) {
                this._delete(i);
                found = true;
            }
        }

        return found;
    },

    /**
     * Notifies the subscribers.  The callback functions will be executed
     * from the scope specified when the event was created, and with the following
     * parameters:
     *   <pre>
     *   - The type of event
     *   - All of the arguments fire() was executed with as an array
     *   - The custom object (if any) that was passed into the subscribe() method
     *   </pre>
     *   
     * @param {Array} an arbitrary set of parameters to pass to the handler
     */
    fire: function() {
        for (var i=0; i<this.subscribers.length; ++i) {
            var s = this.subscribers[i];
            if (s) {
                var scope = (s.override) ? s.obj : this.scope;
                s.fn.call(scope, this.type, arguments, s.obj);
            }
        }
    },

    /**
     * Removes all listeners
     */
    unsubscribeAll: function() {
        for (var i=0; i<this.subscribers.length; ++i) {
            this._delete(i);
        }
    },

    /**
     * @private
     */
    _delete: function(index) {
        var s = this.subscribers[index];
        if (s) {
            delete s.fn;
            delete s.obj;
        }

        delete this.subscribers[index];
    }
};

/////////////////////////////////////////////////////////////////////

/**
 * @class Stores the subscriber information to be used when the event fires.
 * @param {Function} fn       The function to execute
 * @param {Object}   obj      An object to be passed along when the event fires
 * @param {boolean}  bOverride If true, the obj passed in becomes the execution
 *                            scope of the listener
 * @constructor
 */
YAHOO.util.Subscriber = function(fn, obj, bOverride) {
    /**
     * The callback that will be execute when the event fires
     * @type function
     */
    this.fn = fn;

    /**
     * An optional custom object that will passed to the callback when
     * the event fires
     * @type object
     */
    this.obj = obj || null;

    /**
     * The default execution scope for the event listener is defined when the
     * event is created (usually the object which contains the event).
     * By setting override to true, the execution scope becomes the custom
     * object passed in by the subscriber
     * @type boolean
     */
    this.override = (bOverride);
};

/**
 * Returns true if the fn and obj match this objects properties.
 * Used by the unsubscribe method to match the right subscriber.
 *
 * @param {Function} fn the function to execute
 * @param {Object} obj an object to be passed along when the event fires
 * @return {boolean} true if the supplied arguments match this 
 *                   subscriber's signature.
 */
YAHOO.util.Subscriber.prototype.contains = function(fn, obj) {
    return (this.fn == fn && this.obj == obj);
};

