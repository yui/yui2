/**
 * Provides dynamic loading for the YUI library.  It includes the dependency
 * info for the library, and will automatically pull in dependencies for
 * the modules requested.  It supports rollup files (such as utilities.js
 * and yahoo-dom-event.js), and will automatically use these when
 * appropriate in order to minimize the number of http connections
 * required to load all of the dependencies.
 * @module yuiloader
 * @namespace YAHOO.util
 */

/**
 * YUILoader provides dynamic loading for YUI.
 * @class YAHOO.util.YUILoader
 */
(function() {
 
    /*

    // can the user specify a minimum version?

    // what is the behavior if it is already on the page, wrong version?

    // does event need to overwrite itself if the version is lower than what is
    // being loaded?

    // any other singletons that do not overwrite themselves?

    YAHOO_config = {
        load: {
            require: ['yahoo', 'dom', 'event'], 
            sandbox: true, // not supported yet
            css: true, // not supported yet
            onCompleteCallback: function(yahooref) {
                // YAHOO123 = yahooref;
            }
        }
    };

    */
   
    // define YAHOO_config if it doesn't exist.  Only relevant if YAHOO is not
    // already on the page
    if (typeof YAHOO_config === "undefined") {
        YAHOO_config = {};
    }

    var TYPE='type', PATH='path', REQUIRES='requires', OPTIONAL='optional', 
        SUPERSEDES='supersedes', ROLLUP='rollup';

    // YUI is locally scoped, only pieces of it will be referenced in YAHOO
    // after YAHOO has been loaded.
    var YUI = {

        /*
         * The library metadata for the current release  The is the default
         * value for YAHOO.util.YUILoader.moduleInfo
         * @property YUIInfo
         * @static
         */
        info: '@yuiinfo@', 

        // Simple utils since we can't count on YAHOO.lang being
        // available.
        ObjectUtil: {
            appendArray: function(o, a) {
                if (a) {
                    for (var i=0; i<a.length; i=i+1) {
                        o[a[i]] = true;
                    }
                }
            },

            clone: function(o) {
                var c = {};
                for (var i in o) {
                    c[i] = o[i];
                }
                return c;
            },

            merge: function() {
                var o={}, a=arguments, i, j;
                for (i=0; i<a.length; i=i+1) {
                    
                    for (j in a[i]) {
                        o[j] = a[i][j];
                    }
                }
                return o;
            },

            keys: function(o, ordered) {
                var a=[], i;
                for (i in o) {
                    a.push(i);
                }

                return a;
            }
        },

        ArrayUtil: {

            appendArray: function(a1, a2) {
                Array.prototype.push.apply(a1, a2);
                /*
                for (var i=0; i<a2.length; i=i+1) {
                    a1.push(a2[i]);
                }
                */
            },

            /*
             * Uses the identity operator
             */
            indexOf: function(a, val) {
                for (var i=0; i<a.length; i=i+1) {
                    if (a[i] === val) {
                        return i;
                    }
                }

                return -1;
            },

            toObject: function(a) {
                var o = {};
                for (var i=0; i<a.length; i=i+1) {
                    o[a[i]] = true;
                }

                return o;
            },

            /*
             * Returns a unique array.  Does not maintain order, which is fine
             * for this application, and performs better than it would if it
             * did.
             */
            uniq: function(a) {
                return YUI.ObjectUtil.keys(YUI.ArrayUtil.toObject(a));
            }
        },

        // Add a new module to the component metadata.  The javascript
        // component must also use YAHOO.register to notify the
        // loader when it has been loaded.
        addModule: function(o) {
            if (!o || !o.name || !o.type || !o.path) {
                return false;
            }

            YUI.info.moduleInfo[o.name] = {
                TYPE:       o.type,
                PATH:       o.path,
                REQUIRES:   o.requires,
                OPTIONAL:   o.optional,
                SUPERSEDES: o.supersedes,
                ROLLUP:     o.rollup
            };

            return true;
        },

        // loader instances
        loaders: [],

        finishInit: function(yahooref) {

            // YAHOO has been loaded either in this window or passed 
            // from the sandbox routine.  Set up local references 
            // to the loader and module metadata in the YAHOO object
            // in question so additional modules can be loaded. 

            yahooref = yahooref || YAHOO;

            yahooref.env.YUIInfo=YUI.info;
            yahooref.util.YUILoader=YUI.YUILoader;

            //if (YUI.onLoadComplete) {
                //YUI.onLoadComplete(yahooref);
            //}
        },

        /*
         * Global handler for the module loaded event exposed by
         * YAHOO
         */
        onModuleLoaded: function(minfo) {

            var mname = minfo.name, m;

            for (var i=0; i<YUI.loaders.length; i=i+1) {
                YUI.loaders[i].loadNext(mname);
            }

        },

        /*
         * Sets up the module metadata
         */
        init: function() {

            var c = YAHOO_config, o = c.load, 
                y_loaded = (typeof YAHOO !== "undefined");


            // add our listener to the existing YAHOO.env.listeners stack
            if (y_loaded && YAHOO.env) {

                YAHOO.env.listeners.push(YUI.onModuleLoaded);

            // define a listener in YAHOO_config that YAHOO will pick up
            // when it is loaded.
            } else {

                if (c.listener) {
                    YUI.cachedCallback = c.listener;
                }

                c.listener = function(minfo) {
                    YUI.onModuleLoaded(minfo);
                    if (YUI.cachedCallback) {
                        YUI.cachedCallback(minfo);
                    }
                };
            }

            // Fetch the required modules immediately if specified
            // in YAHOO_config.  Otherwise detect YAHOO and fetch
            // it if it doesn't exist so we have a place to put
            // the loader.  The problem with this is that it will
            // prevent rollups from working
            if (o || !y_loaded) {

                o = o || {};

                var loader = new YUI.YUILoader(o);

                // If no load was requested, we must load YAHOO
                // so we have a place to put the loader
                if (!y_loaded) {
                    loader.require("yahoo");
                }

                loader.insert(function() {

                        if (o.onLoadComplete) {

                            loader._pushEvents();
                            o.onLoadComplete(loader);
                        }

                        YUI.finishInit();
                        
                    }, o);
            } else {
                YUI.finishInit();
            }
        }

    };

    YUI.YUILoader = function(o) {
        o = o || {};

        /**
         * The domain that will be used to create the full
         * path to each script/css file.
         * @property domain
         * @type string
         * @default yui.yahooapis.com
         */
        this.domain = ("domain" in o) ? o.domain : YUI.info.domain;

        /**
         * The base directory.
         * @property base
         * @type string
         * @default build
         */
        this.base = ("base" in o) ? o.base : YUI.info.base;

        /**
         * The version of the library to load.  While the
         * supplied metadata is specific to a given version
         * of the library, it isn't completely out of the
         * question to change this in order to load an
         * older version.
         * @property version
         * @type string
         */
        this.version = ("version" in o) ? o.version : YUI.info.version;

        /**
         * Use SSL or not.  Not supported on yahooapis
         * @property secure
         * @type boolean
         * @default false
         */
        this.secure = o.secure || false;

        /**
         * Should we allow rollups
         * @property allowRollup
         * @type boolean
         * @default false
         */
        this.allowRollup = ("allowRollup" in o) ? this.allowRollup : true;

        /**
         * Create a sandbox rather than inserting into lib into.
         * the current context.  Not currently supported
         * property sandbox
         * @type boolean
         * @default false
         */
        this.sandbox = o.sandbox;

        /**
         * The list of requested modules
         * @property required
         * @type {string: boolean}
         */
        this.required = {};

        /**
         * The library metadata
         * @property moduleInfo
         */
        this.moduleInfo = o.moduleInfo || YUI.info.moduleInfo;

        /**
         * List of rollup files found in the library metadata
         * @property rollups
         */
        this.rollups = null;

        /**
         * Whether or not to load optional dependencies for 
         * the requested modules
         * @property loadOptional
         * @type boolean
         * @default false
         */
        this.loadOptional = o.loadOptional || false;

        /**
         * All of the derived dependencies in sorted order, which
         * will be populated when either calculate() or insert()
         * is called
         * @property sorted
         * @type string[]
         */
        this.sorted = [];

        /**
         * Set when beginning to compute the dependency tree. 
         * Composed of what YAHOO reports to be loaded combined
         * with what has been loaded by the tool
         * @propery loaded
         * @type {string: boolean}
         */
        this.loaded = {};

        /**
         * Flag to indicate the dependency tree needs to be recomputed
         * if insert is called again.
         * @property dirty
         * @type boolean
         * @default true
         */
        this.dirty = true;

        /**
         * List of modules inserted by the utility
         * @property inserted
         * @type {string: boolean}
         */
        this.inserted = {};


        /**
         * Set to the rollup name while we are loading a rollup.
         * This is used to translate YAHOO notifications for the
         * individual superseded modules
         * @property _loadingRollup
         * @private
         */
        this._loadingRollup = null;


        if (o.require) {
            this.require(o.require);
        }

        //this.onLoadComplete = o.onLoadComplete || null;
        
        YUI.loaders.push(this);
    };

    YUI.YUILoader.prototype = {

        FILTERS: {
            RAW: { 
                'searchExpression': "-min\\.js", 
                'replaceString': ".js"
            },
            DEBUG: { 
                'searchExpression': "-min\\.js", 
                'replaceString': "-debug.js"
            }
        },

        /**
         * Add a requirement for one or more module
         * @method require
         * @param what {string[] | string*} the modules to load
         */
        require: function(what) {
            var a = (typeof what === "string") ? arguments : what;
            YUI.ObjectUtil.appendArray(this.required, a);
        },

        /**
         * Calculates the dependency tree, the result is will be
         * stored in the sorted property
         * @method calculate
         * @param o optional options object
         */
        calculate: function(o) {
            if (this.dirty) {

                this._setup(o);
                this._explode();
                if (this.allowRollup) {
                    this._rollup();
                }
                this._reduce();
                this._sort();

                this.dirty = false;
            }
        },

        /**
         * Investigates the current YUI configuration on the page.  By default,
         * modules already detected will not be loaded again unless a force
         * option is encountered.  Called by calculate()
         * @method _setup
         * @param o optional options object
         * @private
         */
        _setup: function(o) {

            o = o || {};
            this.loaded = YUI.ObjectUtil.clone(this.inserted); 
            
            if (!this.sandbox && typeof YAHOO !== "undefined" && YAHOO.env) {
                this.loaded = YUI.ObjectUtil.merge(this.loaded, YAHOO.env.modules);
            }

            // add the ignore list to the list of loaded packages
            if (o.ignore) {
                YUI.ObjectUtil.appendArray(this.loaded, o.ignore);
            }

            // remove modules on the force list from the loaded list
            if (o.force) {
                for (var i=0; i<o.force.length; i=i+1) {
                    if (o.force[i] in this.loaded) {
                        delete this.loaded[o.force[i]];
                    }
                }
            }
        },
        
        /**
         * Returns an object containing properties for all modules required
         * in order to load the requested module
         * @method getRequires
         * @param mod The module definition from moduleInfo
         */
        getRequires: function(mod) {
            if (!this.dirty && mod.expanded) {
                return mod.expanded;
            }

            mod.requires=mod.requires || [];
            var i, d=[], r=mod.requires, o=mod.optional, s=mod.supersedes, info=this.moduleInfo;
            for (i=0; i<r.length; i=i+1) {
                d.push(r[i]);
                YUI.ArrayUtil.appendArray(d, this.getRequires(info[r[i]]));
            }

            if (o && this.loadOptional) {
                for (i=0; i<o.length; i=i+1) {
                    d.push(o[i]);
                    YUI.ArrayUtil.appendArray(d, this.getRequires(info[o[i]]));
                }
            }

            /* this is not necessary if we require that rollups have all
             * of their dependencies specified.
            if (s) {
                for (i=0; i<s.length; i=i+1) {
                    YUI.ArrayUtil.appendArray(d, this.getRequires(info[s[i]]));
                }
            }
            */

            mod.expanded = YUI.ArrayUtil.uniq(d);

            return mod.expanded;
        },

        /**
         * Returns an object literal of the modules the supplied module satisfies
         * @method getProvides
         * @param mod The module definition from moduleInfo
         * @return what this module provides
         */
        getProvides: function(name) {
            var mod = this.moduleInfo[name];

            var o = {};
            o[name] = true;
            s = mod && mod[SUPERSEDES];

            YUI.ObjectUtil.appendArray(o, s);

            // console.log(this.sorted + ", " + name + " provides " + YUI.ObjectUtil.keys(o));

            return o;
        },

        /**
         * Inspects the required modules list looking for additional 
         * dependencies.  Expands the required list to include all 
         * required modules.  Called from calculate()
         * @method _explode
         * @private
         */
        _explode: function() {

            var r=this.required, i, mod;

            for (i in r) {
                mod = this.moduleInfo[i];
                if (mod) {

                    var req = this.getRequires(mod);

                    if (req) {
                        YUI.ObjectUtil.appendArray(r, req);
                    }
                }
            }
        },
        
        /**
         * Look for rollup packages to determine if all of the modules a
         * rollup supersedes are required.  If so, include the rollup to
         * help reduce the total number of connections required.  Called
         * by calculate()
         * @method _rollup
         * @private
         */
        _rollup: function() {
            var i, j, m, s, rollups={}, r=this.required;

            // find and cache rollup modules
            if (this.dirty || !this.rollups) {
                for (i in this.moduleInfo) {
                    m = this.moduleInfo[i];
                    if (m && m[ROLLUP] && m[SUPERSEDES]) {
                        rollups[i] = m;
                    }
                }

                this.rollups = rollups;
            }

            // make as many passes as needed to pick up rollup rollups
            for (;;) {
                var rolled = false;

                // go through the rollup candidates
                for (i in rollups) { 

                    // there can be only one
                    if (!(i in r) && !(i in this.loaded)) {
                        m =this.moduleInfo[i]; s = m[SUPERSEDES]; roll=true;

                        // require all modules to trigger a rollup (using the 
                        // threshold value has not proved worthwhile)
                        for (j=0;j<s.length;j=j+1) {

                            // only look in the required modules list for
                            // this evaluation so we don't create a
                            // situation where we load a rollup containing a
                            // module that has been loaded.
                            if (!(s[j] in r) || (s[j] in this.loaded)) {
                                roll=false;
                                break;
                            }
                        }

                        if (roll) {
                            // add the rollup
                            r[i] = true;
                            rolled = true;
                            
                            // expand the rollup's dependencies
                            this.getRequires(m);
                        }
                    }
                }

                // if we made it here w/o rolling up something, we are done
                if (!rolled) {
                    break;
                }
            }
        },

        /**
         * Remove superceded modules and loaded modules.  Called by
         * calculate() after we have the mega list of all dependencies
         * @method _reduce
         * @private
         */
        _reduce: function() {

            var i, j, s, m, r=this.required;
            for (i in r) {

                // remove if already loaded
                if (i in this.loaded) { 
                    delete r[i];

                // remove anything this module supersedes
                } else {
                    m = this.moduleInfo[i];
                    s = m && m[SUPERSEDES];
                    if (s) {
                        for (j=0;j<s.length;j=j+1) {
                            if (s[j] in r) {
                                delete r[s[j]];
                            }
                        }
                    }
                }
            }
        },
        
        /**
         * Sorts the dependency tree.  The last step of calculate()
         * @method _sort
         * @private
         */
        _sort: function() {
            // create an indexed list
            var s=[], info=this.moduleInfo, loaded=this.loaded;

            // returns true if b is not loaded, and is required
            // by a directly or by means of modules it supersedes.
            var requires = function(aa, bb) {
                if (loaded[bb]) {
                    return false;
                }

                var ii, mm=info[aa], rr=mm.expanded;

                if (rr && YUI.ArrayUtil.indexOf(rr, bb) > -1) {
                    return true;
                }

                var ss=info[bb][SUPERSEDES];
                if (ss) {
                    for (ii=0; ii<ss.length; ii=i+1) {
                        if (requires(aa, ss[ii])) {
                            return true;
                        }
                    }
                }

                return false;
            };

            // get the required items out of the obj into an array so we
            // can sort
            for (var i in this.required) {
                s.push(i);
            }

            // pointer to the first unsorted item
            var p=0; 

            // keep going until we make a pass without moving anything
            for (;;) {
               
                var l=s.length, a, b, j, k, moved=false;

                // start the loop after items that are already sorted
                for (j=p; j<l; j=j+1) {

                    // check the next module on the list to see if its
                    // dependencies have been met
                    a = s[j];

                    // check everything below current item and move if we
                    // find a requirement for the current item
                    for (k=j+1; k<l; k=k+1) {
                        if (requires(a, s[k])) {

                            // extract the dependency so we can move it up
                            b = s.splice(k, 1);

                            // insert the dependency above the item that 
                            // requires it
                            s.splice(j, 0, b[0]);

                            moved = true;
                            break;
                        }
                    }

                    // jump out of loop if we moved
                    if (moved) {
                        break;
                    // this item is sorted, move our pointer and keep going
                    } else {
                        p = p + 1;
                    }
                }

                // when we make it here and moved is still false, we are 
                // finished sorting
                if (!moved) {
                    break;
                }

            }

            this.sorted = s;
        },

        /**
         * Fetches and inserts the requested modules.  <code>type</code> 
         * can be "js" or "css".  Both script and css are inserted if
         * type is not provided.
         * @method insert
         * @param callback {Function} a function to execute when the load
         * is complete.
         * @param o optional options object
         * @param type {string} the type of dependency to insert
         */
        insert: function(callback, o, type) {

            o = o || {};

            // store the callback for when we are done
            this.onLoadComplete = callback || this.onLoadComplete;

            // store the optional filter
            var f = o && o.filter || null;

            if (typeof f === "string") {
                f = f.toUpperCase();

                // the logger must be available in order to use the debug
                // versions of the library
                if (f === "DEBUG") {
                    this.require("logger");
                }
            }

            this.filter = this.FILTERS[f] || f;

            // store the options... not currently in use
            this.insertOptions = o;

            // build the dependency list
            this.calculate(o);

            // set a flag to indicate the load has started
            this.loading = true;

            // keep the loadType (js, css or undefined) cached
            this.loadType = type;

            // start the load
            this.loadNext();

            this.count = 0;
        },

        /**
         * Executed every time a module is loaded, and if we are in a load
         * cycle, we attempt to load the next script.  Public so that it
         * is possible to call this if using a method other than
         * YAHOO.register to determine when scripts are fully loaded
         * @method loadNext
         * @param mname {string} optional the name of the module that has
         * been loaded (which is usually why it is time to load the next
         * one)
         */
        loadNext: function(mname) {

            if (this.count++ > 100) {
                return;
            }

            // console.log("loadNext executing, just loaded " + mname);

            // The global handler that is called when each module is loaded
            // will pass that module name to this function.  Storing this
            // data to avoid loading the same module multiple times
            if (mname) {
                this.inserted[mname] = true;
                //var o = this.getProvides(mname);
                //this.inserted = YUI.ObjectUtil.merge(this.inserted, o);
            }

            // It is possible that this function is executed due to something
            // else one the page loading a YUI module.  Only react when we
            // are actively loading something
            if (!this.loading) {
                return;
            }

            if (mname && mname !== this.loading) {
                // another module was loaded, possibly by another process

                //if (this._loadingRollup) {
                    // mark the rollup loaded and continue
                    //this.inserted[this._loadingRollup] = true;
                //}

                return;
            }
            
            var s=this.sorted, len=s.length, i, m;

            for (i=0; i<len; i=i+1) {

                // This.inserted keeps track of what the loader has loaded
                if (s[i] in this.inserted) {
                    // console.log(s[i] + " alread loaded ");
                    continue;
                }

                // Because rollups will cause multiple load notifications
                // from YAHOO, loadNext may be called multiple times for
                // the same module when loading a rollup.  We can safely
                // skip the subsequent requests
                if (s[i] === this.loading) {
                    // console.log("still loading " + s[i] + ", waiting");
                    return;
                }

                // console.log("inserting " + s[i]);

                m = this.moduleInfo[s[i]];

                // The load type is stored to offer the possibility to load
                // the css separately from the script.
                if (!this.loadType || this.loadType === m.type) {
                    this.loading = s[i];

                    // Insert the css node and continue.  It is possible
                    // that the css file will load out of order ... this
                    // may be a problem that needs to be addressed, but
                    // unlike the script files, there is no notification
                    // mechanism in place for the css files.
                    if (m.type === "css") {
                        this.insertCss(this._url(m.path));
                        this.inserted[s[i]] = true;

                    // Scripts must be loaded in order, so we wait for the
                    // notification from YAHOO to process the next script
                    } else {

                        // When we load script rollups, we will be notified
                        // about the individual pieces of the rollup rather
                        // than the rollup itself.  Keep track of this so
                        // that we can mark this as inserted as soon as we
                        // detect one of modules it supersedes is loaded.
                        var sup = m[SUPERSEDES];
                        if (sup && sup.length > 0) {
                            this._loadingRollup = s[i];
                        }

                        this.insertScript(this._url(m.path));
                        return;
                    }
                }
            }

            // we are finished
            this.loading = null;

            if (this.onLoadComplete) {
                this._pushEvents();
                this.onLoadComplete(this);
            }

        },

        /**
         * In IE, the onAvailable/onDOMReady events need help when Event is
         * loaded dynamically
         * @method _pushEvents
         * @private
         */
        _pushEvents: function() {
            if (typeof YAHOO !== "undefined" && YAHOO.util && YAHOO.util.Event) {
                YAHOO.util.Event._load();
            }
        },

        /**
         * Generates the full url for a module
         * method _url
         * @param path {string} the path fragment
         * @return {string} the full url
         * @private
         */
        _url: function(path) {
            
            var d = this.domain, u;
            u = (d) ? ((this.secure) ? "https://" : "http://") + this.domain + "/" : "";

            if (this.version) {
                u = u + this.version + "/";
            }

            if (this.base) {
                u = u + this.base + "/";
            }

            u = u + path;

            if (this.filter) {
                // console.log("filter: " + this.filter + ", " + this.filter.searchExpression + 
                            // ", " + this.filter.replaceString);
                u = u.replace(new RegExp(this.filter.searchExpression), this.filter.replaceString);
            }

            // console.log(u);

            return u;
        },

        /**
         * Inserts a script node
         * @method insertScript
         * @param url {string} the full url for the script
         * @param win {Window} optional window to target
         */
        insertScript: function(url, win) {
            var w = win || window, d=w.document, n=d.createElement("script"),
                h = d.getElementsByTagName("head")[0];

            n.src = url;
            n.type = "text/javascript";
            h.appendChild(n);
        },

        /**
         * Inserts a css link node
         * @method insertCss
         * @param url {string} the full url for the script
         * @param win {Window} optional window to target
         */
        insertCss: function(url, win) {
            var w = win || window, d=w.document, n=d.createElement("link"),
                h = d.getElementsByTagName("head")[0];

            n.href = url;
            n.type = "text/css";
            n.rel = "stylesheet";
            h.appendChild(n);
        },
       
        /*
         * Interns the script for the requested modules.  The callback is
         * provided a reference to the sandboxed YAHOO object.  This only
         * applies to the script: css can not be sandboxed.  Not implemented.
         * @method sandbox
         * @param callback {Function} the callback to exectued when the load is
         *        complete.
         * @notimplemented
         */
        sandbox: function(callback) {
            // this.calculate({
                         //sandbox: true
                     //});
        }
    };

    YUI.init();

})();
