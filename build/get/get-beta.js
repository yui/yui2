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

        // ridx=0,

        // sandboxFrame=null,

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
            if (attr[i] && YAHOO.lang.hasOwnProperty(attr, i)) {
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
            }, win);
    };

    // var _iframe = function(url, win) {
    //     var id = "yui__dyn_" + (nidx++);
    //     return _node("iframe", {
    //             "id": id,
    //             "name": id 
    //             //,"src": url
    //         }, win);
    // };

    /*
     * The request failed, execute fail handler with whatever
     * was accomplished.  There isn't a failure case at the
     * moment unless you count aborted transactions
     * @method _fail
     * @param id {string} the id of the request
     * @private
     */
    // var _fail = function(id) {
    //     var q = queues[id], o;
    //     // execute fail callback
    //     if (q.onFailure) {
    //         o = {
    //             win: q.win,
    //             data: q.data,
    //             nodes: q.nodes,
    //             purge: _purge
    //         };
    //         var sc=q.scope || q.win;
    //         q.onFailure.call(sc, o);
    //     }
    // };

    /**
     * The request is complete, so executing the requester's callback
     * @method _finish
     * @param id {string} the id of the request
     * @private
     */
    var _finish = function(id) {
        var q = queues[id], o;
        q.finished = true;

        if (q.aborted) {
            return;
        }

        // execute callback
        if (q.onSuccess) {
            o = {
                tId: q.tId,
                win: q.win,
                data: q.data,
                nodes: q.nodes,
                purge: _purge
            };

            // if (q.opts.sandbox) {
            //     var ref = q.opts.sandbox.reference, refobj=q.win[ref];
            //     //alert(ref + ", " + refobj);
            //     //var src = "var " + ref + "=" + refobj.toSource();
            //     var src = Function.toString.apply(refobj);
            //     //var src = refobj.toSource().replace(/#1/, "var " + ref);
            //     //alert(src);
            //     var t = "(function() {\n",
            //     //var t = "(function() {\nvar window=parent,document=parent.document,y=eval('" + q.sandboxid + ".YAHOO');",
            //     //var t = "(function() {\nparent.MYYAHOO=eval('" + q.sandboxid + ".YAHOO.toSource()');",
            //         b = "\nreturn " + ref + "\n})();";
            //     o.reference = eval(t + src + b);
            // }

            var sc=q.scope || q.win;

            

            q.onSuccess.call(sc, o);
        }
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

        if (q.aborted) {
            return;
        }

        if (loaded) {
            q.url.shift();
        } else {
            // This is the first pass: make sure the url is an array
            q.url = (lang.isString(q.url)) ? [q.url] : q.url;
        }

        if (q.url.length === 0) {

            // Safari workaround - add an extra script node.  When
            // this one is done we know the script in the previous
            // one is ready.
            if (q.type === "script" && ua.webkit && !q.finalpass) {
                q.finalpass = true;
                var extra = _scriptNode(null, q.win);
                _track(q.type, extra, id, "safari_extra", q.win, 1);
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
            tId: id,
            type: type,
            url: url,
            onSuccess: opts.onSuccess,
            onFailure: opts.onFailure,
            data: opts.data,
            opts: opts,
            win: win,
            scope: opts.scope || win,
            finished: false,
            nodes: []
        };

        var q = queues[id];

        // if (opts.sandbox) {
        //     var f = opts.iframe || sandboxFrame;
        //     if (!f) {
        //         var w = opts.win||window, d=w.document, b=d.getElementsByTagName("body")[0];
        //         f = _iframe(opts.iframesrc || YAHOO.util.Get.IFRAME_SRC , w);
        //         _track("iframe", f, "sandbox_iframe", null, win, q.url.length, function() {
        //                     sandboxFrame = f;
        //                     q.sandboxid = f.id;
        //                     q.win = f.contentWindow || f;
        //                     q.win.document.write('&nbsp;');
        //                     _next(id);
        //                     //lang.later(0, q, _next, id);
        //                 });
        //         b.insertBefore(f, b.firstChild);
        //         return {
        //             tId: id
        //         };
        //     }
        //     q.win = f.contentWindow || f;
        // }

        lang.later(0, q, _next, id);

        return {
            tId: id
        };
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
            // poll the document readyState.  When the readyState is complete
            // or loaded, it is safe to insert the next item.  Script contents
            // may not be ready yet, so we still need another workaround for
            // the last script
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
                //lang.later(20, null, f, [id, url]);
                f(id, url);
            };
        }
    };

    return {

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
         * Abort a transaction
         * @method abort
         * @param {string|object} either the tId or the object returned from
         * script() or css()
         */
        abort: function(o) {
            var id = (lang.isString(o)) ? o : o.tId;
            var q = queues[id];
            if (q) {
                q.aborted = true;
            }
        }, 

        /**
         * Fetches and inserts one or more script nodes into the head
         * of the current document or the document in a specified window.
         *
         * @method script
         * @static
         * @param url {string|string[]} the url or urls to the script(s)
         * @param opts {object} Options: 
         * <dl>
         * <dt>onSuccess</dt>
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
         * <dt>purge</dt>
         * <dd>A function that, when executed, will remove the nodes
         * that were inserted</dd>
         * <dt>
         * </dl>
         * </dd>
         * <dt>onFailure</dt>
         * <dd>
         * callback to execute when the script load operation fails
         * The callback receives an object back with the following
         * data:
         * <dl>
         * <dt>win</dt>
         * <dd>the window the script(s) were inserted into</dd>
         * <dt>data</dt>
         * <dd>the data object passed in when the request was made</dd>
         * <dt>nodes</dt>
         * <dd>An array containing references to the nodes that were
         * inserted successfully</dd>
         * <dt>purge</dt>
         * <dd>A function that, when executed, will remove any nodes
         * that were inserted</dd>
         * <dt>
         * </dl>
         * </dd>
         * <dt>scope</dt>
         * <dd>the execution context for the callbacks</dd>
         * <dt>win</dt>
         * <dd>a window other than the one the utility occupies</dd>
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
         * &nbsp;&nbsp;&nbsp;&nbsp;onSuccess: function(o) &#123;
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;new YAHOO.util.DDProxy("dd1"); // also new o.reference("dd1"); would work
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.log("won't cause error because YAHOO is the scope");
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.log(o.nodes.length === 2) // true
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// o.purge(); // optionally remove the script nodes immediately
         * &nbsp;&nbsp;&nbsp;&nbsp;&#125;,
         * &nbsp;&nbsp;&nbsp;&nbsp;onFailure: function(o) &#123;
         * &nbsp;&nbsp;&nbsp;&nbsp;&#125;,
         * &nbsp;&nbsp;&nbsp;&nbsp;data: "foo",
         * &nbsp;&nbsp;&nbsp;&nbsp;scope: YAHOO,
         * &nbsp;&nbsp;&nbsp;&nbsp;// win: otherframe // target another window/frame
         * &nbsp;&nbsp;&nbsp;&nbsp;autopurge: true // allow the utility to choose when to remove the nodes
         * &nbsp;&nbsp;&#125;);
         * </pre>
         * @return {tId: string} an object containing info about the transaction
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
         * <dt>onSuccess</dt>
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
         * <dd>the execution context for the callbacks</dd>
         * <dt>win</dt>
         * <dd>a window other than the one the utility occupies</dd>
         * <dt>data</dt>
         * <dd>
         * data that is supplied to the callbacks when the nodes(s) are
         * loaded.
         * </dd>
         * </dl>
         * <pre>
         *      YAHOO.util.Get.css("http://yui.yahooapis.com/2.3.1/build/menu/assets/skins/sam/menu.css");
         * </pre>
         * <pre>
         *      YAHOO.util.Get.css(["http://yui.yahooapis.com/2.3.1/build/menu/assets/skins/sam/menu.css",
         * </pre>
         * @return {tId: string} an object containing info about the transaction
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
