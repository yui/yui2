/**
 * Provides a mechanism to fetch remote resources and
 * insert them into a document
 * @module get
 * @requires yahoo
 */

/**
 * Fetches and inserts one or more script or link nodes into the document 
 * @namespace YAHOO.util
 * @class YAHOO.util.Get
 */
YAHOO.util.Get = function() {

    /**
     * hash of timer handles to deal with simultaneus script inserts
     * @property timers
     * @private
     */
    var timers = {}, 
        
    /**
     * hash of queues to manage multiple requests
     * @property queues
     * @private
     */
        queues={}, 
        
    /**
     * queue index used to generate transaction ids
     * @property qidx
     * @type int
     * @private
     */
        qidx=0, 
        
    /**
     * node index used to generate unique node ids
     * @property nidx
     * @type int
     * @private
     */
        nidx=0, 

        //ridx=0,

        //sandboxFrame=null,

    /**
     * interal property used to prevent multiple simultaneous purge 
     * processes
     * @property purging
     * @type boolean
     * @private
     */
        purging=false,

        ua=YAHOO.env.ua, 
        
        lang=YAHOO.lang;
    
    /** 
     * Generates an HTML element, this is not appended to a document
     * @method _node
     * @param type {string} the type of element
     * @param attr {string} the attributes
     * @param win {Window} optional window to create the element in
     * @return {HTMLElement} the generated node
     * @private
     */
    var _node = function(type, attr, win) {
        var w = win || window, d=w.document, n=d.createElement(type);

        for (var i in attr) {
            if (YAHOO.lang.hasOwnProperty(attr, i)) {
                n.setAttribute(i, attr[i]);
            }
        }

        return n;
    };

    /**
     * Generates a link node
     * @method _linkNode
     * @param url {string} the url for the css file
     * @param win {Window} optional window to create the node in
     * @return {HTMLElement} the generated node
     * @private
     */
    var _linkNode = function(url, win) {
        return _node("link", {
                "id": "yui__dyn_" + (nidx++),
                "type": "text/css",
                "rel": "stylesheet",
                "href": url
            }, win);
    };

    /**
     * Generates a script node
     * @method _scriptNode
     * @param url {string} the url for the script file
     * @param win {Window} optional window to create the node in
     * @return {HTMLElement} the generated node
     * @private
     */
    var _scriptNode = function(url, win) {
        return _node("script", {
                "id": "yui__dyn_" + (nidx++),
                "type": "text/javascript",
                "src": url
                // cache busting doesn't help safari
                //"src": url + ((url.indexOf("?") > -1) ? "&" : "?") + "yui=" + ridx++
            }, win);
    };

    // var _iframe = function(url, win) {
    //     var id = "yui__dyn_" + (nidx++);
    //     return _node("iframe", {
    //             "id": id,
    //             "name": name,
    //             "src": url
    //         }, win);
    // };

    /**
     * The request is complete, so executing the requester's callback
     * @method _finish
     * @param id {string} the id of the request
     * @private
     */
    var _finish = function(id) {
        var q = queues[id], o;

        // execute callback
        if (q.callback) {
            o = {
                win: q.win,
                data: q.data,
                nodes: q.nodes,
                reference: q.reference,
                purge: _purge
            };

            //if (q.opts.sandbox) {
                //var s = [];
                //var t = "(function() {\n",
                    //b = "\nreturn YAHOO\n})();";

                //var newyahoo = window.eval(t + s.join("\n") + b);
                //o.reference = q.win.eval(q.opts.sandbox.reference);
                //o.reference = newyahoo;
            //}

            var sc=q.scope || q.win;

            if (q.type === "script" && !q.verifier && ua.webkit && ua.webkit < 420) {
                lang.later(this.SAFARI_SCRIPT_DELAY, sc, q.callback, o);
            } else {
                q.callback.call(sc, o);
            }
        }

        // delete queues[id];
        queues[id].finished = true;
    };

    /**
     * Loads the next item for a given request
     * @method _next
     * @param id {string} the id of the request
     * @param loaded {string} the url that was just loaded, if any
     * @private
     */
    var _next = function(id, loaded) {
        var q = queues[id];

        if (loaded) {
            q.url.shift();
        } else {
            // This is the first pass: make sure the url is an array
            q.url = (lang.isString(q.url)) ? [q.url] : q.url;
        }

        if (q.url.length === 0) {

            // If a verifier function was provided, this is used to
            // determine when the loaded material is ready (and when 
            // to execute the callback).
            if (q.opts.verifier) {
                q.opts.verifier(function() {
                        _finish(id);
                    }, q.win);

            // If a scriptproperty is provided, we can poll for it
            } else if (q.opts.scriptproperty) {
                q.timer = lang.later(YAHOO.util.Get.POLL_FREQ, q, function(o) {
                    if (!this._cache) {
                        this._cache = this.opts.scriptproperty.split(".");
                    }
                    var a=this._cache, l=a.length, w=this.win, i;
                    for (i=0; i<l; i=i+1) {
                        w = w[a[i]];
                        if (!w) {
                            return;
                        }
                    }
                    
                    q.reference=w;
                    q.timer.cancel();
                    _finish(id);

                }, null, true);

            // If a verifier or scriptproperty is not provided, use whatever means
            // available to determine when the node is loaded.  When
            // loading script, this does not guarantee that the
            // script in the node is ready to be used.  This is why
            // a verifier function is needed if the plan is to act
            // on the script immediately.
            } else {
                _finish(id);
            }

            return;
        } 

        var w=q.win, d=w.document, h=d.getElementsByTagName("head")[0], n;

        var url = q.url[0];

        if (q.type === "script") {
            n = _scriptNode(url, w);
        } else {
            n = _linkNode(url, w);
        }

        // track this node's load progress
        _track(q.type, n, id, url, w, q.url.length);

        // add the node to the queue so we can return it to the user supplied callback
        q.nodes.push(n);

        // add it to the head
        h.appendChild(n);
        

        // FireFox does not support the onload event for link nodes, so there is
        // no way to make the css requests synchronous. This means that the css 
        // rules in multiple files could be applied out of order in this browser
        // if a later request returns before an earlier one.
        if (ua.gecko && q.type === "css") {
            _next(id, url);
        }
    };

    /**
     * Removes processed queues and corresponding nodes
     * @method _purge
     * @private
     */
    var _purge = function() {

        if (purging) {
            return;
        }

        purging = true;
        for (var i in queues) {
            var q = queues[i];
            if (q.autopurge && q.finished) {
                var n=q.nodes, l=n.length, d=q.win.document, 
                    h=d.getElementsByTagName("head")[0];
                for (var j=0; j<l; j=j+1) {
                    h.removeChild(n[j]);
                }
                delete queues[i];
            }
        }
        purging = false;
    };

    /**
     * Saves the state for the request and begins loading
     * the requested urls
     * @method queue
     * @param type {string} the type of node to insert
     * @param url {string} the url to load
     * @param opts the hash of options for this request
     * @private
     */
    var _queue = function(type, url, opts) {

        var id = "q" + (qidx++);
        opts = opts || {};

        if (qidx % YAHOO.util.Get.PURGE_THRESH === 0) {
            _purge();
        }

        var win = opts.win || window;

        queues[id] = {
            type: type,
            url: url,
            callback: opts.callback,
            data: opts.data,
            opts: opts,
            win: win,
            scope: opts.scope || win,
            finished: false,
            nodes: []
        };

        // var q = queues[id];
        // if (opts.sandbox) {
        //     var f = opts.iframe || sandboxFrame;
        //     if (!f) {
        //         var w = opts.win||window, d=w.document, b=d.getElementsByTagName("body")[0];
        //         f = _iframe(opts.iframesrc || YAHOO.util.Get.IFRAME_SRC , w);
        //         _track("iframe", f, "safari_iframe", null, win, q.url.length, function() {
        //                     _next(id);
        //                 });
        //         b.insertBefore(f, b.firstChild);
        //         sandboxFrame = f;
        //         q.win = f.contentWindow || f;
        //         return;
        //     }
        //     q.win = f.contentWindow || f;
        // }

        _next(id);
    };

    /**
     * Detects when a node has been loaded.  In the case of
     * script nodes, this does not guarantee that contained
     * script is ready to use.
     * @method _track
     * @param type {string} the type of node to track
     * @param n {HTMLElement} the node to track
     * @param id {string} the id of the request
     * @param url {string} the url that is being loaded
     * @param win {Window} the targeted window
     * @param qlength the number of remaining items in the queue,
     * including this one
     * @param trackfn {Function} function to execute when finished
     * the default is _next
     * @private
     */
    var _track = function(type, n, id, url, win, qlength, trackfn) {
        var f = trackfn || _next;
        if (ua.ie) {
            // IE supports the readystatechange event for script and css nodes
            n.onreadystatechange = function() {
                var rs = this.readyState;
                if ("loaded" === rs || "complete" === rs) {
                    f(id, url);
                }
            };

        } else if (ua.webkit) {

            // Currently, Safari 2.0.x does not support either the onload or
            // onreadystatechange events on script/link nodes.  It also 
            // doesn't have a readyState property on the node.  The workaround
            // is to check the readyState of the document it is being inserted
            // into.  While this works, some of the time the document becomes
            // ready before the script has been evaluated.  This doesn't appear
            // to be a problem for loading sequential scripts, but it is a
            // problem when all scripts are finished and we are ready to notify
            // the consumer that we are done.  
            //if (type === "script" && qlength === 1) {
            //    var d=win.document, b=d.getElementsByTagName("body")[0];
            //    var fr = (type === "iframe") ? n : _iframe(url, win);
            //    fr.onload = function() {
            //        f(id, url);
            //    };
            //    
            //    if (type !== "iframe") {
            //        b.appendChild(fr);
            //    }
            //} else {

            timers[id] = setInterval(function(){
                var rs=win.document.readyState;
                if ("loaded" === rs || "complete" === rs) {
                    clearInterval(timers[id]);
                    timers[id] = null;
                    f(id, url);
                }
            }, YAHOO.util.Get.POLL_FREQ); 

        } else {
            // FireFox and Opera support the onload event for script nodes.
            // Opera, but not FF, supports the onload event for link nodes
            n.onload = function() {
                f(id, url);
            };
        }
    };

    return {

        /**
         * The mechanism for detecting script node load in Safari isn't
         * isn't perfect in Safari 2.x.  Implementing a delay after the
         * last script loads is one way to hack around the issue if you
         * do not want to provide a verifier function or a method for the
         * utility to find.  To be effective, this delay must be at
         * least 30 ms.
         * @property SAFARI_SCRIPT_DELAY
         * @type int
         * @static
         * @default 0
         */
        SAFARI_SCRIPT_DELAY: 0,


        /**
         * The default poll freqency in ms, when needed
         * @property POLL_FREQ
         * @static
         * @type int
         * @default 10
         */
        POLL_FREQ: 10,

        /**
         * The number of request required before an automatic purge.
         * property PURGE_THRESH
         * @static
         * @type int
         * @default 20
         */
        PURGE_THRESH: 20,

        //IFRAME_SRC: "../../build/get/assets/blank.html",

        /**
         * Fetches and inserts one or more script nodes into the head
         * of the current document or the document in a specified window.
         *
         * @method script
         * @static
         * @param url {string|string[]} the url or urls to the script(s)
         * @param opts {object} Options: 
         * <dl>
         * <dt>callback</dt>
         * <dd>
         * callback to execute when the script(s) are finished loading
         * The callback receives an object back with the following
         * data:
         * <dl>
         * <dt>win</dt>
         * <dd>the window the script(s) were inserted into</dd>
         * <dt>data</dt>
         * <dd>the data object passed in when the request was made</dd>
         * <dt>nodes</dt>
         * <dd>An array containing references to the nodes that were
         * inserted</dd>
         * <dt>reference</dt>
         * <dd>If the request contained a scriptproperty, this will
         * contain the reference to the object that was found.</dd>
         * <dt>purge</dt>
         * <dd>A function that, when executed, will remove the nodes
         * that were inserted</dd>
         * <dt>
         * </dl>
         * </dd>
         * <dt>scope</dt>
         * <dd>the execution context for the callback</dd>
         * <dt>win</dt>
         * <dd>a window other than the one the utility occupies</dd>
         * <dt>scriptproperty</dt>
         * <dd>
         * the name of a method/property that will be used to
         * determine when the script is loaded
         * </dd>
         * <dt>verifier</dt>
         * <dd>
         * a function that can be used instead of scriptproperty to implement a
         * custom function that will be used to determine when the script is
         * loaded
         * </dd>
         * <dt>autopurge</dt>
         * <dd>
         * setting to true will let the utilities cleanup routine purge 
         * the script once loaded
         * </dd>
         * <dt>data</dt>
         * <dd>
         * data that is supplied to the callback when the script(s) are
         * loaded.
         * </dd>
         * </dl>
         * <pre>
         * // assumes yahoo, dom, and event are already on the page
         * &nbsp;&nbsp;YAHOO.util.Get.script(
         * &nbsp;&nbsp;["http://yui.yahooapis.com/2.3.1/build/dragdrop/dragdrop-min.js",
         * &nbsp;&nbsp;&nbsp;"http://yui.yahooapis.com/2.3.1/build/animation/animation-min.js"], &#123;
         * &nbsp;&nbsp;&nbsp;&nbsp;callback: function(o) &#123;
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;new YAHOO.util.DDProxy("dd1"); // also new o.reference("dd1"); would work
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.log("won't cause error because YAHOO is the scope");
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.log(o.nodes.length === 2) // true
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// o.purge(); // optionally remove the script nodes immediately
         * &nbsp;&nbsp;&nbsp;&nbsp;&#125;,
         * &nbsp;&nbsp;&nbsp;&nbsp;data: "foo",
         * &nbsp;&nbsp;&nbsp;&nbsp;// verifier: checkDragDrop, // I could write my own verifier, but using the scriptproperty is easier
         * &nbsp;&nbsp;&nbsp;&nbsp;scriptproperty: "YAHOO.util.DDProxy",
         * &nbsp;&nbsp;&nbsp;&nbsp;scope: YAHOO,
         * &nbsp;&nbsp;&nbsp;&nbsp;// win: otherframe // target another window/frame
         * &nbsp;&nbsp;&nbsp;&nbsp;autopurge: true // allow the utility to choose when to remove the nodes
         * &nbsp;&nbsp;&#125;);
         * </pre>
         */
        script: function(url, opts) { return _queue("script", url, opts); },

        /**
         * Fetches and inserts one or more css link nodes into the 
         * head of the current document or the document in a specified
         * window.
         * @method css
         * @static
         * @param url {string} the url or urls to the css file(s)
         * @param opts Options: 
         * <dl>
         * <dt>callback</dt>
         * <dd>
         * callback to execute when the css file(s) are finished loading
         * The callback receives an object back with the following
         * data:
         * <dl>win</dl>
         * <dd>the window the link nodes(s) were inserted into</dd>
         * <dt>data</dt>
         * <dd>the data object passed in when the request was made</dd>
         * <dt>nodes</dt>
         * <dd>An array containing references to the nodes that were
         * inserted</dd>
         * <dt>purge</dt>
         * <dd>A function that, when executed, will remove the nodes
         * that were inserted</dd>
         * <dt>
         * </dl>
         * </dd>
         * <dt>scope</dt>
         * <dd>the execution context for the callback</dd>
         * <dt>win</dt>
         * <dd>a window other than the one the utility occupies</dd>
         * <dt>data</dt>
         * <dd>
         * data that is supplied to the callback when the script(s) are
         * loaded.
         * </dd>
         * </dl>
         * <pre>
         *      YAHOO.util.Get.css("http://yui.yahooapis.com/2.3.1/build/menu/assets/skins/sam/menu.css");
         * </pre>
         * <pre>
         *      YAHOO.util.Get.css(["http://yui.yahooapis.com/2.3.1/build/menu/assets/skins/sam/menu.css",
         * </pre>
         * 
         */
        css: function(url, opts) {
            return _queue("css", url, opts); 
        },

        /** Generates an HTML element, this is not appended to a document
         * @method createNode
         * @static
         * @param type {string} the type of element
         * @param attr {string} the attributes
         * @param win {Window} optional window to create the element in
         * @return {HTMLElement} the generated node
         */
        createNode: function(type, attr, win) {
            return _node(type, attr, win);
        }
    };
}();

YAHOO.register("get", YAHOO.util.Get, {version: "@VERSION@", build: "@BUILD@"});
