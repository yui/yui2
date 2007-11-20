/**
 * Provides dynamic loading for the YUI library.  It includes the dependency
 * info for the library, and will automatically pull in dependencies for
 * the modules requested.  It supports rollup files (such as utilities.js
 * and yahoo-dom-event.js), and will automatically use these when
 * appropriate in order to minimize the number of http connections
 * required to load all of the dependencies.
 * 
 * @module yuiloader
 * @namespace YAHOO.util
 */

/**
 * YUILoader provides dynamic loading for YUI.
 * @class YAHOO.util.YUILoader
 * @todo
 *      version management, automatic sandboxing
 */
(function() {

    var Y=YAHOO, util=Y.util, lang=Y.lang, env=Y.env;
 
    var YUI = {

        dupsAllowed: {'yahoo': true, 'get': true},

        /*
         * The library metadata for the current release  The is the default
         * value for YAHOO.util.YUILoader.moduleInfo
         * @property YUIInfo
         * @static
         */
        info: {

    'base': 'http://yui.yahooapis.com/2.4.0/build/',

    'skin': {
        'defaultSkin': 'sam',
        'base': 'assets/skins/',
        'path': 'skin.css',
        'rollup': 3
    },

    'moduleInfo': {

        'animation': {
            'type': 'js',
            'path': 'animation/animation-min.js',
            'requires': ['dom', 'event']
        },

        'autocomplete': {
            'type': 'js',
            'path': 'autocomplete/autocomplete-min.js',
            'requires': ['dom', 'event'],
            'optional': ['connection', 'animation'],
            'skinnable': true
        },

        'base': {
            'type': 'css',
            'path': 'base/base-min.css'
        },

        'button': {
            'type': 'js',
            'path': 'button/button-min.js',
            'requires': ['element'],
            'optional': ['menu'],
            'skinnable': true
        },

        'calendar': {
            'type': 'js',
            'path': 'calendar/calendar-min.js',
            'requires': ['event', 'dom'],
            'skinnable': true
        },

        'charts': {
            'type': 'js',
            'path': 'charts/charts-experimental-min.js',
            'requires': ['element', 'datasource']
        },

        'colorpicker': {
            'type': 'js',
            'path': 'colorpicker/colorpicker-beta-min.js',
            'requires': ['slider', 'element'],
            'optional': ['animation'],
            'skinnable': true
        },

        'connection': {
            'type': 'js',
            'path': 'connection/connection-min.js',
            'requires': ['event']
        },

        'container': {
            'type': 'js',
            'path': 'container/container-min.js',
            'requires': ['dom', 'event'],
            // button is optional, but creates a circular dep
            //'optional': ['dragdrop', 'animation', 'connection', 'connection', 'button'],
            'optional': ['dragdrop', 'animation', 'connection'],
            'supersedes': ['containercore'],
            'skinnable': true
        },

        'containercore': {
            'type': 'js',
            'path': 'container/container_core-min.js',
            'requires': ['dom', 'event'],
            'pkg': 'container'
        },

        'datasource': {
            'type': 'js',
            'path': 'datasource/datasource-beta-min.js',
            'requires': ['event'],
            'optional': ['connection']
        },

        'datatable': {
            'type': 'js',
            'path': 'datatable/datatable-beta-min.js',
            'requires': ['element', 'datasource'],
            'optional': ['calendar', 'dragdrop'],
            'skinnable': true
        },

        'dom': {
            'type': 'js',
            'path': 'dom/dom-min.js',
            'requires': ['yahoo']
        },

        'dragdrop': {
            'type': 'js',
            'path': 'dragdrop/dragdrop-min.js',
            'requires': ['dom', 'event']
        },

        'editor': {
            'type': 'js',
            'path': 'editor/editor-beta-min.js',
            'requires': ['menu', 'element', 'button'],
            'optional': ['animation', 'dragdrop'],
            'skinnable': true
        },

        'element': {
            'type': 'js',
            'path': 'element/element-beta-min.js',
            'requires': ['dom', 'event']
        },

        'event': {
            'type': 'js',
            'path': 'event/event-min.js',
            'requires': ['yahoo']
        },

        'fonts': {
            'type': 'css',
            'path': 'fonts/fonts-min.css'
        },

        'get': {
            'type': 'js',
            'path': 'get/get-beta-min.js',
            'requires': ['yahoo']
        },

        'grids': {
            'type': 'css',
            'path': 'grids/grids-min.css',
            'requires': ['fonts'],
            'optional': ['reset']
        },

        'history': {
            'type': 'js',
            'path': 'history/history-min.js',
            'requires': ['event']
        },

        'imageloader': {
            'type': 'js',
            'path': 'imageloader/imageloader-beta-min.js',
            'requires': ['event', 'dom']
        },

        'json': {
            'type': 'js',
            'path': 'json/json-beta-min.js',
            'requires': ['yahoo']
        },

        'logger': {
            'type': 'js',
            'path': 'logger/logger-min.js',
            'requires': ['event', 'dom'],
            'optional': ['dragdrop'],
            'skinnable': true
        },

        'menu': {
            'type': 'js',
            'path': 'menu/menu-min.js',
            'requires': ['containercore'],
            'skinnable': true
        },

        'reset': {
            'type': 'css',
            'path': 'reset/reset-min.css'
        },

        'reset-fonts-grids': {
            'type': 'css',
            'path': 'reset-fonts-grids/reset-fonts-grids.css',
            'supersedes': ['reset', 'fonts', 'grids']
        },

        'reset-fonts': {
            'type': 'css',
            'path': 'reset-fonts/reset-fonts.css',
            'supersedes': ['reset', 'fonts']
        },

        'simpleeditor': {
            'type': 'js',
            'path': 'editor/simpleeditor-beta-min.js',
            'requires': ['element'],
            'optional': ['containercore', 'menu', 'button', 'animation', 'dragdrop'],
            'skinnable': true,
            'pkg': 'editor'
        },

        'slider': {
            'type': 'js',
            'path': 'slider/slider-min.js',
            'requires': ['dragdrop'],
            'optional': ['animation']
        },

        'tabview': {
            'type': 'js',
            'path': 'tabview/tabview-min.js',
            'requires': ['element'],
            'optional': ['connection'],
            'skinnable': true
        },

        'treeview': {
            'type': 'js',
            'path': 'treeview/treeview-min.js',
            'requires': ['event'],
            'skinnable': true
        },

        'utilities': {
            'type': 'js',
            'path': 'utilities/utilities.js',
            'supersedes': ['yahoo', 'event', 'dragdrop', 'animation', 'dom', 'connection', 'element', 'yahoo-dom-event'],
            'rollup': 6
        },

        'yahoo': {
            'type': 'js',
            'path': 'yahoo/yahoo-min.js'
        },

        'yahoo-dom-event': {
            'type': 'js',
            'path': 'yahoo-dom-event/yahoo-dom-event.js',
            'supersedes': ['yahoo', 'event', 'dom'],
            'rollup': 3
        },

        'yuiloader': {
            'type': 'js',
            'path': 'yuiloader/yuiloader-beta-min.js'
        },

        'yuitest': {
            'type': 'js',
            'path': 'yuitest/yuitest-beta-min.js',
            'requires': ['logger'],
            'skinnable': true
        }
    }
}
 , 

        ObjectUtil: {
            appendArray: function(o, a) {
                if (a) {
                    for (var i=0; i<a.length; i=i+1) {
                        o[a[i]] = true;
                    }
                }
            },

            keys: function(o, ordered) {
                var a=[], i;
                for (i in o) {
                    if (lang.hasOwnProperty(o, i)) {
                        a.push(i);
                    }
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
        }
    };

    YAHOO.util.YUILoader = function(o) {

        /**
         * Internal callback to handle multiple internal insert() calls
         * so that css is inserted prior to js
         * @property _internalCallback
         * @private
         */
        this._internalCallback = null;

        /**
         * Use the YAHOO environment listener to detect script load.  This
         * is only switched on for Safari 2.x and below.
         * @property _useYahooListener
         * @private
         */
        this._useYahooListener = false;

        /**
         * Callback that will be executed when the loader is finished
         * with an insert
         * @method onSuccess
         * @type function
         */
        this.onSuccess = null;

        /**
         * Callback that will be executed if there is a failure
         * @method onFailure
         * @type function
         */
        this.onFailure = Y.log;

        /**
         * Callback that will be executed each time a new module is loaded
         * @method onProgress
         * @type function
         */
        this.onProgress = null;

        /**
         * The execution scope for all callbacks
         * @property scope
         * @default this
         */
        this.scope = this;

        /**
         * Data that is passed to all callbacks
         * @property data
         */
        this.data = null;

        /**
         * The name of the variable in a sandbox or script node 
         * (for external script support in Safari 2.x and earlier)
         * to reference when the load is complete.  If this variable 
         * is not available in the specified scripts, the operation will 
         * fail.  
         * @property varName
         * @type string
         */
        this.varName = null;

        /**
         * The base directory.
         * @property base
         * @type string
         * @default http://yui.yahooapis.com/[YUI VERSION]/build/
         */
        this.base = YUI.info.base;

        /**
         * A list of modules that should not be loaded, even if
         * they turn up in the dependency tree
         * @property ignore
         * @type string[]
         */
        this.ignore = null;

        /**
         * A list of modules that should always be loaded, even
         * if they have already been inserted into the page.
         * @property force
         * @type string
         */
        this.force = null;

        /**
         * Should we allow rollups
         * @property allowRollup
         * @type boolean
         * @default true
         */
        this.allowRollup = true;

        /**
         * Filter to apply to result url.  This filter will modify the default
         * path for all modules.  The default path for the YUI library is the
         * minified version of the files (e.g., event-min.js).  The filter property
         * can be a predefined filter or a custom filter.  The valid predefined 
         * filters are:
         * <dl>
         *  <dt>debug</dt>
         *  <dd>Selects the debug versions of the library (e.g., event-debug.js).
         *      This option will automatically include the logger widget</dd>
         *  <dt>raw</dt>
         *  <dd>Selects the non-minified version of the library (e.g., event.js).
         * </dl>
         * You can also define a custom filter, which must be an object literal 
         * containing a search expression and a replace string:
         * <pre>
         *  myFilter: &#123; 
         *      'searchExp': "-min\\.js", 
         *      'replaceStr': "-debug.js"
         *  &#125;
         * </pre>
         * Note: the default base path for the YUI library is http://yui.yahooapis.com.
         * Only the minified versions of the components are available on this host,
         * so if you choose to use the raw or debug versions of the files, you will
         * have to host these files locally, and change the "base" property.
         * @property filter
         * @type string|{searchExp: string, replaceStr: string}
         */
        this.filter = null;

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
        this.moduleInfo = lang.merge(YUI.info.moduleInfo);

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
        this.loadOptional = false;

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
         * Provides the information used to skin the skinnable components.
         * The following skin definition would result in 'skin1' and 'skin2'
         * being loaded for calendar (if calendar was requested), and
         * 'sam' for all other skinnable components:
         *
         *   <code>
         *   skin: {
         *
         *      // The default skin, which is automatically applied if not
         *      // overriden by a component-specific skin definition.
         *      // Change this in to apply a different skin globally
         *      defaultSkin: 'sam', 
         *
         *      // This is combined with the loader base property to get
         *      // the default root directory for a skin. ex:
         *      // http://yui.yahooapis.com/2.3.0/build/assets/skins/sam/
         *      base: 'assets/skins/',
         *
         *      // The name of the rollup css file for the skin
         *      path: 'skin.css',
         *
         *      // The number of skinnable components requested that are
         *      // required before using the rollup file rather than the
         *      // individual component css files
         *      rollup: 3,
         *
         *      // Any component-specific overrides can be specified here,
         *      // making it possible to load different skins for different
         *      // components.  It is possible to load more than one skin
         *      // for a given component as well.
         *      overrides: {
         *          calendar: ['skin1', 'skin2']
         *      }
         *   }
         *   </code>
         *   @property skin
         */

        var self = this;

        env.listeners.push(function(m) {
            if (self._useYahooListener) {
                //Y.log("YAHOO listener: " + m.name);
                self.loadNext(m.name);
            }
        });

        this.skin = lang.merge(YUI.info.skin); 

        this._config(o);

    };

    Y.util.YUILoader.prototype = {

        FILTERS: {
            RAW: { 
                'searchExp': "-min\\.js", 
                'replaceStr': ".js"
            },
            DEBUG: { 
                'searchExp': "-min\\.js", 
                'replaceStr': "-debug.js"
            }
        },

        SKIN_PREFIX: "skin-",

        _config: function(o) {

            if (!o) {
                return;
            }

            // lang.augmentObject(this, o);

            // apply config values
            for (var i in o) {
                if (lang.hasOwnProperty(o, i)) {
                    switch (i) {
                        case "require":
                            this.require(o[i]);
                            break;

                        case "filter":
                            var f = o[i];

                            if (typeof f === "string") {
                                f = f.toUpperCase();

                                // the logger must be available in order to use the debug
                                // versions of the library
                                if (f === "DEBUG") {
                                    this.require("logger");
                                }

                                this.filter = this.FILTERS[f];
                            } else {
                                this.filter = f;
                            }

                            break;

                        default:
                            this[i] = o[i];
                    }
                }
            }
        },

        /** Add a new module to the component metadata.         
         * <dl>
         *     <dt>name:</dt>       <dd>required, the component name</dd>
         *     <dt>type:</dt>       <dd>required, the component type (js or css)</dd>
         *     <dt>path:</dt>       <dd>required, the path to the script from "base"</dd>
         *     <dt>requires:</dt>   <dd>the modules required by this component</dd>
         *     <dt>optional:</dt>   <dd>the optional modules for this component</dd>
         *     <dt>supersedes:</dt> <dd>the modules this component replaces</dd>
         *     <dt>rollup:</dt>     <dd>the number of superseded modules required for automatic rollup</dd>
         *     <dt>fullpath:</dt>   <dd>If fullpath is specified, this is used instead of the configured base + path</dd>
         *     <dt>skinnable:</dt>  <dd>flag to determine if skin assets should automatically be pulled in</dd>
         * </dl>
         * @method addModule
         * @param o An object containing the module data
         * @return {boolean} true if the module was added, false if 
         * the object passed in did not provide all required attributes
         */
        addModule: function(o) {

            if (!o || !o.name || !o.type || (!o.path && !o.fullpath)) {
                return false;
            }

            this.moduleInfo[o.name] = o;
            this.dirty = true;

            return true;
        },

        /**
         * Add a requirement for one or more module
         * @method require
         * @param what {string[] | string*} the modules to load
         */
        require: function(what) {
            var a = (typeof what === "string") ? arguments : what;

            this.dirty = true;

            for (var i=0; i<a.length; i=i+1) {
                this.required[a[i]] = true;
                var s = this.parseSkin(a[i]);
                if (s) {
                    this._addSkin(s.skin, s.module);
                }
            }
            YUI.ObjectUtil.appendArray(this.required, a);
        },


        /**
         * Adds the skin def to the module info
         * @method _addSkin
         * @private
         */
        _addSkin: function(skin, mod) {

            // Add a module definition for the skin rollup css
            var name = this.formatSkin(skin);
            if (!this.moduleInfo[name]) {
                this.addModule({
                    'name': name,
                    'type': 'css',
                    'path': this.skin.base + skin + "/" + this.skin.path,
                    //'supersedes': '*',
                    'rollup': this.skin.rollup
                });
            }

            // Add a module definition for the module-specific skin css
            if (mod) {
                name = this.formatSkin(skin, mod);
                if (!this.moduleInfo[name]) {
                    var mdef = this.moduleInfo[mod];
                    var pkg = mdef.pkg || mod;
                    this.addModule({
                        'name': name,
                        'type': 'css',
                        //'path': this.skin.base + skin + "/" + mod + ".css"
                        // 'path': mod + '/' + this.skin.base + skin + "/" + mod + ".css"
                        'path': pkg + '/' + this.skin.base + skin + "/" + mod + ".css"
                    });
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
            var i, d=[], r=mod.requires, o=mod.optional, info=this.moduleInfo;
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

            var s = mod && mod.supersedes;

            YUI.ObjectUtil.appendArray(o, s);

            // console.log(this.sorted + ", " + name + " provides " + YUI.ObjectUtil.keys(o));

            return o;
        },

        /**
         * Calculates the dependency tree, the result is stored in the sorted 
         * property
         * @method calculate
         * @param o optional options object
         */
        calculate: function(o) {
            if (this.dirty) {
                this._config(o);
                this._setup();
                this._explode();
                this._skin();
                if (this.allowRollup) {
                    this._rollup();
                }
                this._reduce();
                this._sort();

                // Y.log("after calculate: " + lang.dump(this.required));

                this.dirty = false;
            }
        },

        /**
         * Investigates the current YUI configuration on the page.  By default,
         * modules already detected will not be loaded again unless a force
         * option is encountered.  Called by calculate()
         * @method _setup
         * @private
         */
        _setup: function() {

            this.loaded = lang.merge(this.inserted); // shallow clone
            
            if (!this._sandbox) {
                this.loaded = lang.merge(this.loaded, env.modules);
            }

            // Y.log("already loaded stuff: " + lang.dump(this.loaded, 0));

            // add the ignore list to the list of loaded packages
            if (this.ignore) {
                YUI.ObjectUtil.appendArray(this.loaded, this.ignore);
            }

            // remove modules on the force list from the loaded list
            if (this.force) {
                for (var i=0; i<this.force.length; i=i+1) {
                    if (this.force[i] in this.loaded) {
                        delete this.loaded[this.force[i]];
                    }
                }
            }
        },
        

        /**
         * Inspects the required modules list looking for additional 
         * dependencies.  Expands the required list to include all 
         * required modules.  Called by calculate()
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
         * Sets up the requirements for the skin assets if any of the
         * requested modules are skinnable
         * @method _skin
         * @private
         */
        _skin: function() {

            var r=this.required, i, mod;

            for (i in r) {
                mod = this.moduleInfo[i];
                if (mod && mod.skinnable) {
                    var o=this.skin.overrides, j;
                    if (o && o[i]) {
                        for (j=0; j<o[i].length; j=j+1) {
                            this.require(this.formatSkin(o[i][j], i));
                        }
                    } else {
                        this.require(this.formatSkin(this.skin.defaultSkin, i));
                    }
                }
            }
        },

        /**
         * Returns the skin module name for the specified skin name.  If a
         * module name is supplied, the returned skin module name is 
         * specific to the module passed in.
         * @method formatSkin
         * @param skin {string} the name of the skin
         * @param mod {string} optional: the name of a module to skin
         * @return {string} the full skin module name
         */
        formatSkin: function(skin, mod) {
            var s = this.SKIN_PREFIX + skin;
            if (mod) {
                s = s + "-" + mod;
            }

            return s;
        },
        
        /**
         * Reverses <code>formatSkin</code>, providing the skin name and
         * module name if the string matches the pattern for skins.
         * @method parseSkin
         * @param mod {string} the module name to parse
         * @return {skin: string, module: string} the parsed skin name 
         * and module name, or null if the supplied string does not match
         * the skin pattern
         */
        parseSkin: function(mod) {
            
            if (mod.indexOf(this.SKIN_PREFIX) === 0) {
                var a = mod.split("-");
                return {skin: a[1], module: a[2]};
            } 

            return null;
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
            var i, j, m, s, rollups={}, r=this.required, roll;

            // find and cache rollup modules
            if (this.dirty || !this.rollups) {
                for (i in this.moduleInfo) {
                    m = this.moduleInfo[i];
                    //if (m && m.rollup && m.supersedes) {
                    if (m && m.rollup) {
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
                    if (!r[i] && !this.loaded[i]) {
                        m =this.moduleInfo[i]; s = m.supersedes; roll=false;

                        if (!m.rollup) {
                            continue;
                        }

                        var skin = this.parseSkin(i), c = 0;
                        if (skin) {

                            for (j in r) {
                                if (i !== j && this.parseSkin(j)) {
                                    c++;
                                    roll = (c >= m.rollup);
                                    if (roll) {
                                        // Y.log("skin rollup " + lang.dump(r));
                                        break;
                                    }
                                }
                            }

                        } else {

                            // check the threshold
                            for (j=0;j<s.length;j=j+1) {

                                // if the superseded module is loaded, we can't load the rollup
                                if (this.loaded[s[j]] && (!YUI.dupsAllowed[s[j]])) {
                                    roll = false;
                                    break;
                                // increment the counter if this module is required.  if we are
                                // beyond the rollup threshold, we will use the rollup module
                                } else if (r[s[j]]) {
                                    c++;
                                    roll = (c >= m.rollup);
                                    if (roll) {
                                        // Y.log("over thresh " + c + ", " + lang.dump(r));
                                        break;
                                    }
                                }
                            }
                        }

                        if (roll) {
                            // Y.log("rollup: " +  i + ", " + lang.dump(this, 1));
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

                    var skinDef = this.parseSkin(i);

                    if (skinDef) {
                        //console.log("skin found in reduce: " + skinDef.skin + ", " + skinDef.module);
                        // the skin rollup will not have a module name
                        if (!skinDef.module) {
                            var skin_pre = this.SKIN_PREFIX + skinDef.skin;
                            //console.log("skin_pre: " + skin_pre);
                            for (j in r) {
                                if (j !== i && j.indexOf(skin_pre) > -1) {
                                    //console.log ("removing component skin: " + j);
                                    delete r[j];
                                }
                            }
                        }
                    } else {

                         m = this.moduleInfo[i];
                         s = m && m.supersedes;
                         if (s) {
                             for (j=0;j<s.length;j=j+1) {
                                 if (s[j] in r) {
                                     delete r[s[j]];
                                 }
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
            // directly or by means of modules it supersedes.
            var requires = function(aa, bb) {
                if (loaded[bb]) {
                    return false;
                }

                var ii, mm=info[aa], rr=mm && mm.expanded;

                if (rr && YUI.ArrayUtil.indexOf(rr, bb) > -1) {
                    return true;
                }

                var ss=info[bb] && info[bb].supersedes;
                if (ss) {
                    for (ii=0; ii<ss.length; ii=ii+1) {
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

                    // jump out of loop if we moved something
                    if (moved) {
                        break;
                    // this item is sorted, move our pointer and keep going
                    } else {
                        p = p + 1;
                    }
                }

                // when we make it here and moved is false, we are 
                // finished sorting
                if (!moved) {
                    break;
                }

            }

            this.sorted = s;
        },

        toString: function() {
            var o = {
                type: "YUILoader",
                base: this.base,
                filter: this.filter,
                required: this.required,
                loaded: this.loaded,
                inserted: this.inserted
            };

            lang.dump(o, 1);
        },

        /**
         * inserts the requested modules and their dependencies.  
         * <code>type</code> can be "js" or "css".  Both script and 
         * css are inserted if type is not provided.
         * @method insert
         * @param o optional options object
         * @param type {string} the type of dependency to insert
         */
        insert: function(o, type) {
            // if (o) {
            //     Y.log("insert: " + lang.dump(o, 1) + ", " + type);
            // } else {
            //     Y.log("insert: " + this.toString() + ", " + type);
            // }

            // build the dependency list
            this.calculate(o);

            if (!type) {
                // Y.log("trying to load css first");
                var self = this;
                this._internalCallback = function() {
                            self._internalCallback = null;
                            self.insert(null, "js");
                        };
                this.insert(null, "css");
                return;
            }

            // set a flag to indicate the load has started
            this._loading = true;

            // keep the loadType (js, css or undefined) cached
            this.loadType = type;

            // start the load
            this.loadNext();

        },

        /*
         * Interns the script for the requested modules.  The callback is
         * provided a reference to the sandboxed YAHOO object.  This only
         * applies to the script: css can not be sandboxed; css will be
         * loaded into the page normally if specified.
         * @method sandbox
         * @param callback {Function} the callback to exectued when the load is
         *        complete.
         */
        sandbox: function(o, type) {
            if (o) {
                // YAHOO.log("sandbox: " + lang.dump(o, 1) + ", " + type);
            } else {
                // YAHOO.log("sandbox: " + this.toString() + ", " + type);
            }

            this._config(o);

            if (!this.onSuccess) {
throw new Error("You must supply an onSuccess handler for your sandbox");
            }

            this._sandbox = true;

            var self = this;

            // take care of any css first (this can't be sandboxed)
            if (!type || type !== "js") {
                this._internalCallback = function() {
                            self._internalCallback = null;
                            self.sandbox(null, "js");
                        };
                this.insert(null, "css");
                return;
            }

            // get the connection manager if not on the page
            if (!util.Connect) {
                // get a new loader instance to load connection.
                var ld = new YAHOO.util.YUILoader();
                ld.insert({
                    base: this.base,
                    filter: this.filter,
                    require: "connection",
                    onSuccess: function() {
                        this.sandbox(null, "js");
                    },
                    scope: this
                }, "js");
                return;
            }

            this._scriptText = [];
            this._loadCount = 0;
            this._stopCount = this.sorted.length;
            this._xhr = [];

            this.calculate();

            var s=this.sorted, l=s.length, i, m, url;

            for (i=0; i<l; i=i+1) {
                m = this.moduleInfo[s[i]];

                // undefined modules cause a failure
                if (!m) {
                    this.onFailure.call(this.scope, {
                            msg: "undefined module " + m,
                            data: this.data
                        });
                    for (var j=0;j<this._xhr.length;j=j+1) {
                        this._xhr[j].abort();
                    }
                    return;
                }

                // css files should be done
                if (m.type !== "js") {
                    this._loadCount++;
                    continue;
                }

                url = m.fullpath || this._url(m.path);

                // YAHOO.log("xhr request: " + url + ", " + i);

                var xhrData = {

                    success: function(o) {
                        
                        var idx=o.argument[0], name=o.argument[2];

                        // store the response in the position it was requested
                        this._scriptText[idx] = o.responseText; 
                        
                        // YAHOO.log("received: " + o.responseText.substr(0, 100) + ", " + idx);
                    
                        if (this.onProgress) {
                            this.onProgress.call(this.scope, {
                                        name: name,
                                        scriptText: o.responseText,
                                        xhrResponse: o,
                                        data: this.data
                                    });
                        }

                        // only generate the sandbox once everything is loaded
                        this._loadCount++;

                        if (this._loadCount >= this._stopCount) {

                            // the variable to find
                            var v = this.varName || "YAHOO";

                            // wrap the contents of the requested modules in an anonymous function
                            var t = "(function() {\n";
                        
                            // return the locally scoped reference.
                            var b = "\nreturn " + v + ";\n})();";

                            var ref = eval(t + this._scriptText.join("\n") + b);

                            this._pushEvents(ref);

                            if (ref) {
                                this.onSuccess.call(this.scope, {
                                        reference: ref,
                                        data: this.data
                                    });
                            } else {
                                this.onFailure.call(this.scope, {
                                        msg: this.varName + " reference failure",
                                        data: this.data
                                    });
                            }
                        }
                    },

                    failure: function(o) {
                        this.onFailure.call(this.scope, {
                                msg: "XHR failure",
                                xhrResponse: o,
                                data: this.data
                            });
                    },

                    scope: this,

                    // module index, module name, sandbox name
                    argument: [i, url, s[i]]

                };

                this._xhr.push(util.Connect.asyncRequest('GET', url, xhrData));
            }
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

            // It is possible that this function is executed due to something
            // else one the page loading a YUI module.  Only react when we
            // are actively loading something
            if (!this._loading) {
                return;
            }

            if (mname) {

                // if the module that was just loaded isn't what we were expecting,
                // continue to wait
                if (mname !== this._loading) {
                    return;
                }

                // YAHOO.log("loadNext executing, just loaded " + mname);

                // The global handler that is called when each module is loaded
                // will pass that module name to this function.  Storing this
                // data to avoid loading the same module multiple times
                this.inserted[mname] = true;

                if (this.onProgress) {
                    this.onProgress.call(this.scope, {
                            name: mname,
                            data: this.data
                        });
                }
                //var o = this.getProvides(mname);
                //this.inserted = lang.merge(this.inserted, o);
            }

            var s=this.sorted, len=s.length, i, m;

            for (i=0; i<len; i=i+1) {

                // This.inserted keeps track of what the loader has loaded
                if (s[i] in this.inserted) {
                    // YAHOO.log(s[i] + " alread loaded ");
                    continue;
                }

                // Because rollups will cause multiple load notifications
                // from YAHOO, loadNext may be called multiple times for
                // the same module when loading a rollup.  We can safely
                // skip the subsequent requests
                if (s[i] === this._loading) {
                    // YAHOO.log("still loading " + s[i] + ", waiting");
                    return;
                }

                // log("inserting " + s[i]);
                m = this.moduleInfo[s[i]];

                if (!m) {
                    this.onFailure.call(this.scope, {
                            msg: "undefined module " + m,
                            data: this.data
                        });
                    return;
                }

                // The load type is stored to offer the possibility to load
                // the css separately from the script.
                if (!this.loadType || this.loadType === m.type) {
                    this._loading = s[i];
                    //YAHOO.log("attempting to load " + s[i] + ", " + this.base);

                    var fn=(m.type === "css") ? util.Get.css : util.Get.script,
                        url=m.fullpath || this._url(m.path), self=this, 
                        c=function(o) {
                            self.loadNext(o.data);
                        };

                    // safari 2.x or lower, script, and part of YUI
                    if (env.ua.webkit && env.ua.webkit < 420 && m.type === "js" && 
                          !m.varName) {
                          //YUI.info.moduleInfo[s[i]]) {
                          //YAHOO.log("using YAHOO env " + s[i] + ", " + m.varName);
                        c = null;
                        this._useYahooListener = true;
                    }

                    fn(url, {
                        data: s[i],
                        onSuccess: c,
                        varName: m.varName,
                        scope: self 
                    });

                    return;
                }
            }

            // we are finished
            this._loading = null;

            // internal callback for loading css first
            if (this._internalCallback) {
                var f = this._internalCallback;
                this._internalCallback = null;
                f.call(this);
            } else if (this.onSuccess) {
                this._pushEvents();
                this.onSuccess.call(this.scope, {
                        data: this.data
                    });
            }

        },

        /**
         * In IE, the onAvailable/onDOMReady events need help when Event is
         * loaded dynamically
         * @method _pushEvents
         * @param {Function} optional function reference
         * @private
         */
        _pushEvents: function(ref) {
            var r = ref || YAHOO;
            if (r.util && r.util.Event) {
                r.util.Event._load();
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
            
            var u = this.base || "", f=this.filter;
            u = u + path;

            if (f) {
                // console.log("filter: " + f + ", " + f.searchExp + 
                // ", " + f.replaceStr);
                u = u.replace(new RegExp(f.searchExp), f.replaceStr);
            }

            // console.log(u);

            return u;
        }

    };

})();
