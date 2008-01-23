/**
 * Mechanism to execute a series of callbacks in a non-blocking queue.  Each callback is executed via setTimout unless configured with a negative timeout, in which case it is run in blocking mode in the same execution thread as the previous callback.  Callbacks can be function references or object literals with the following keys:
 * <ul>
 *    <li><code>method</code> - {Function} REQUIRED the callback function.</li>
 *    <li><code>scope</code> - {Object} the scope from which to execute the callback.  Default is the global window scope.</li>
 *    <li><code>argument</code> - {Array} parameters to be passed to method as individual arguments.</li>
 *    <li><code>timeout</code> - {number} millisecond delay to wait after previous callback completion before executing this callback.  Negative values cause immediate blocking execution.  Default 0.</li>
 *    <li><code>until</code> - {Function} boolean function executed before each iteration.  Return true to indicate completion and proceed to the next callback.</li>
 *    <li><code>iterations</code> - {Number} number of times to execute the callback before proceeding to the next callback in the chain. Incompatible with <code>until</code>.</li>
 * </ul>
 *
 * @namespace YAHOO.util
 * @class Chain
 * @constructor
 * @param callback* {Function|Object} Any number of callbacks to initialize the queue
*/
YAHOO.util.Chain = function () {
    /**
     * The callback queue
     * @property q
     * @type {Array}
     * @private
     */
    this.q = [].slice.call(arguments);
};

YAHOO.util.Chain.prototype = {
    /**
     * Timeout id used to pause or stop execution and indicate the execution state of the Chain.  0 indicates paused or stopped, -1 indicates blocking execution, and any positive number indicates non-blocking execution.
     * @property id
     * @type {number}
     * @private
     */
    id   : 0,

    /**
     * Begin executing the chain, or resume execution from the last paused position.
     * @method run
     * @return {Chain} the Chain instance
     */
    run : function () {
        // Grab the first callback in the queue
        var c  = this.q[0];

        // If there is no callback in the queue or the Chain is currently
        // in an execution mode, return
        */
        if (!c || this.id) {
            return this;
        }

        // If the until condition is set, check if we're done
        if (c.until) {
            if (c.until()) {
                // Shift this callback from the queue and execute the next
                // callback
                this.q.shift();
                return this.run();
            }
        // Otherwise if either iterations is not set or we're executing the
        // last iteration, shift this callback from the queue
        } else if (!c.iterations || !--c.iterations) {
            this.q.shift();
        }

        var fn = c.method || c;

        if (typeof fn === 'function') {
            var o    = c.scope || {},
                args = c.argument || [],
                ms   = c.timeout || 0,
                me   = this;
                
            if (!(args instanceof Array)) {
                args = [args];
            }

            // Build the callback closure
            var f = function () {
                // Execute the callback from scope, with argument
                fn.apply(o,args);
                // Check if the Chain was not paused from inside the callback
                if (me.id) {
                    // Indicate ready to run state
                    me.id = 0;
                    // Start the fun all over again
                    me.run();
                }
            };

            // Execute immediately if the callback timeout is negative.
            // Otherwise set to execute after the configured timeout
            if (ms < 0) {
                me.id = ms;
                f();
            } else {
                this.id = setTimeout(f,ms);
            }
        }

        return this;
    },
    
    /**
     * Add a callback to the end of the queue
     * @method add
     * @param c {Function|Object} the callback function ref or object literal
     * @return {Chain} the Chain instance
     */
    add  : function (c) {
        this.q.push(c);
        return this;
    },

    /**
     * Pause the execution of the Chain after the current execution of the
     * current callback completes.  If called interstitially, clears the
     * timeout for the pending callback. Paused Chains can be restarted with
     * chain.run()
     * @method pause
     * @return {Chain} the Chain instance
     */
    pause: function () {
        clearTimeout(this.id);
        this.id = 0;
        return this;
    },

    /**
     * Stop and clear the Chain's queue after the current execution of the
     * current callback completes.
     * @method stop
     * @return {Chain} the Chain instance
     */
    stop : function () { 
        this.pause();
        this.q = [];
        return this;
    }
};
