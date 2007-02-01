/**
 *
 * The Browser History Manager provides the ability to use the 
 * back/forward navigation buttons in a DHTML application. It also allows 
 * a DHTML application to be bookmarked in a specific state.
 *
 * @module history
 * @requires yahoo,event
 * @namespace YAHOO.util
 * @title Browser History Manager
 * @experimental
 */

/**
 * The History class provides the ability to use the back/forward navigation
 * buttons in a DHTML application. It also allows a DHTML application to
 * be bookmarked in a specific state.
 *
 * @class History
 * @constructor
 */
YAHOO.util.History = ( function() {

    /**
     * String identifying which browser we are in.
     * Different code is run depending on which browser you are using.
     *
     * @property _browser
     * @type string
     * @default "unknown"
     * @private
     */
    var _browser = "unknown";

    /**
     * Our hidden IFrame used to store the browsing history.
     *
     * @property _iframe
     * @type HTMLIFrameElement
     * @default null
     * @private
     */
    var _iframe = null;

    /**
     * INPUT field (with type="hidden" or type="text") or TEXTAREA.
     * This field keeps the value of the initial state, current state
     * the list of all states across pages within a single browser session.
     *
     * @property _storageField
     * @type HTMLInputElement|HTMLTextAreaElement
     * @default null
     * @private
     */
    var _storageField = null;

    /**
     * Flag used to tell whether YAHOO.util.History.initialize has been called.
     *
     * @property _initialized
     * @type boolean
     * @default false
     * @private
     */
    var _initialized = false;

    /**
     * Flag used to tell whether the storage field is ready to be used.
     *
     * @property _storageFieldReady
     * @type boolean
     * @default false
     * @private
     */
    var _storageFieldReady = false;

    /**
     * Flag used to tell whether the Browser History Manager is ready.
     *
     * @property _bhmReady
     * @type boolean
     * @default false
     * @private
     */
    var _bhmReady = false;

    /**
     * List of registered modules.
     *
     * @property _modules
     * @type array
     * @default []
     * @private
     */
    var _modules = [];

    /**
     * List of fully qualified states. This is used only by Safari.
     *
     * @property _fqstates
     * @type array
     * @default []
     * @private
     */
    var _fqstates = [];

    /**
     * Trims a string.
     *
     * @method _trim
     * @param {string} str The string to be trimmed.
     * @return {string} The trimmed string
     * @private
     */
    function _trim( str ) {
        return str.replace( /^\s*(\S*(\s+\S+)*)\s*$/, "$1" );
    }

    /**
     * location.hash is a bit buggy on Opera. I have seen instances where
     * navigating the history using the back/forward buttons, and hence
     * changing the URL, would not change location.hash. That's ok, the
     * implementation of an equivalent is trivial.
     *
     * @method _getHash
     * @return {string} The hash portion of the document's location
     * @private
     */
    function _getHash() {
        var href = top.location.href;
        var idx = href.indexOf( "#" );
        return idx >= 0 ? href.substr( idx+1 ) : null;
    }

    /**
     * Stores all the registered modules' initial state and current state.
     * On Safari, we also store all the fully qualified states visited by
     * the application within a single browser session. The storage takes
     * place in the form field specified during initialization.
     *
     * @method _storeStates
     * @private
     */
    function _storeStates() {
        var initialStates = [];
        var currentStates = [];
        for ( var moduleName in _modules ) {
            var moduleObj = _modules[moduleName];
            initialStates.push( moduleName + "=" + moduleObj.initialState );
            currentStates.push( moduleName + "=" + moduleObj.currentState );
        }
        _storageField.value = initialStates.join( "&" ) + "|" + currentStates.join( "&" );
        if ( _browser == "safari" ) {
            _storageField.value += "|" + _fqstates.join( "," );
        }
    }

    /**
     * Periodically checks whether our internal IFrame is ready to be used.
     *
     * @method _checkIframeLoaded
     * @private
     */
    function _checkIframeLoaded() {
        if ( !_iframe.contentWindow || !_iframe.contentWindow.document ) {
            // Check again in 10 msec...
            setTimeout( _checkIframeLoaded, 10 );
            return;
        }

        // Start the thread that will have the responsibility to
        // periodically check whether a navigate operation has been
        // requested on the main window. This will happen when
        // YAHOO.util.History.navigate has been called or after
        // the user has hit the back/forward button.

        var doc = _iframe.contentWindow.document;
        var elem = doc.getElementById( "state" );
        // We must use innerText, and not innerHTML because our string contains
        // the "&" character (which would end up being escaped as "&amp;") and
        // the string comparison would fail...
        var fqstate = elem ? elem.innerText : null;

        setInterval( function() {
            elem = doc.getElementById( "state" );
            // See my comment above about using innerText instead of innerHTML...
            var newfqstate = elem ? elem.innerText : null;
            if ( newfqstate != fqstate ) {
                fqstate = newfqstate;
                _handleFQStateChange( fqstate );

                var hash;
                if ( !fqstate ) {
                    var states = [];
                    for ( var moduleName in _modules ) {
                        var moduleObj = _modules[moduleName];
                        states.push( moduleName + "=" + moduleObj.initialState );
                    }
                    hash = states.join( "&" );
                } else {
                    hash = fqstate;
                }

                // Allow the state to be bookmarked without messing up the browser history...
                top.location.replace( "#" + hash );

                _storeStates();
            }
        }, 50 );

        _bhmReady = true;

        YAHOO.util.History.onLoadEvent.fire();
    }

    /**
     * Sets the new currentState attribute of all modules depending on the new
     * fully qualified state. Also notifies the modules which current state has
     * changed.
     *
     * @method _handleFQStateChange
     * @param {string} fqstate Fully qualified state
     * @private
     */
    function _handleFQStateChange( fqstate ) {
        var moduleName, moduleObj, currentState;

        if ( !fqstate ) {
            // Notifies all modules
            for ( moduleName in _modules ) {
                moduleObj = _modules[moduleName];
                moduleObj.currentState = moduleObj.initialState;
                moduleObj.onStateChange( moduleObj.currentState );
            }
            return;
        }

        var modules = [];
        var states = fqstate.split( "&" );
        for ( var idx=0, len=states.length ; idx<len ; idx++ ) {
            var tokens = states[idx].split( "=" );
            if ( tokens.length == 2 ) {
                moduleName = tokens[0];
                currentState = tokens[1];
                modules[moduleName] = currentState;
            }
        }

        for ( moduleName in _modules ) {
            moduleObj = _modules[moduleName];
            currentState = modules[moduleName];
            if ( !currentState || moduleObj.currentState != currentState ) {
                moduleObj.currentState = currentState || moduleObj.initialState;
                moduleObj.onStateChange( moduleObj.currentState );
            }
        }
    }

    /**
     * Finish up the initialization of the Browser History Manager.
     *
     * @method _initialize
     * @private
     */
    function _initialize() {

        _storageField = document.getElementById( "yui_hist_field" );

        // Decode the content of our storage field...
        var parts = _storageField.value.split( "|" );

        if ( parts.length > 1 ) {

            var idx, len, tokens, moduleName, moduleObj;

            var initialStates = parts[0].split( "&" );
            for ( idx=0, len=initialStates.length ; idx<len ; idx++ ) {
                tokens = initialStates[idx].split( "=" );
                if ( tokens.length == 2 ) {
                    moduleName = tokens[0];
                    var initialState = tokens[1];
                    moduleObj = _modules[moduleName];
                    if ( moduleObj ) {
                        moduleObj.initialState = initialState;
                    }
                }
            }

            var currentStates = parts[1].split( "&" );
            for ( idx=0, len=currentStates.length ; idx<len ; idx++ ) {
                tokens = currentStates[idx].split( "=" );
                if ( tokens.length >= 2 ) {
                    moduleName = tokens[0];
                    var currentState = tokens[1];
                    moduleObj = _modules[moduleName];
                    if ( moduleObj ) {
                        moduleObj.currentState = currentState;
                    }
                }
            }
        }

        if ( parts.length > 2 ) {
            _fqstates = parts[2].split( "," );
        }

        _storageFieldReady = true;

        if ( _browser == "msie" ) {

            _iframe = document.getElementById( "yui_hist_iframe" );
            _checkIframeLoaded();

        } else {

            // Start the thread that will have the responsibility to
            // periodically check whether a navigate operation has been
            // requested on the main window. This will happen when
            // YAHOO.util.History.navigate has been called or after
            // the user has hit the back/forward button.

            // On Safari 1.x and 2.0, the only way to catch a back/forward
            // operation is to watch history.length... We basically exploit
            // what I consider to be a bug (history.length is not supposed
            // to change when going back/forward in the history...) This is
            // why, in the following thread, we first compare the hash,
            // because the hash thing will be fixed in the next major
            // version of Safari. So even if they fix the history.length
            // bug, all this will still work!
            var counter = history.length;

            // On Gecko and Opera, we just need to watch the hash...
            var hash = _getHash();

            setInterval( function() {
                var state;
                var newHash = _getHash();
                var newCounter = history.length;
                if ( newHash != hash ) {
                    hash = newHash;
                    counter = newCounter;
                    _handleFQStateChange( hash );
                    _storeStates();
                } else if ( newCounter != counter ) {
                    // If we ever get here, we should be on Safari...
                    hash = newHash;
                    counter = newCounter;
                    state = _fqstates[counter-1];
                    _handleFQStateChange( state );
                    _storeStates();
                }
            }, 50 );

            _bhmReady = true;

            YAHOO.util.History.onLoadEvent.fire();
        }
    }

    // Simple browser detection code
    // After talking with Matt Sweeney, I moved back to using the
    // user agent string instead of doing browser detection.
    var ua = navigator.userAgent.toLowerCase();
    if ( ua.indexOf( "opera" ) != -1 ) {
        // Opera (check first in case of spoof)
        _browser = "opera";
    } else if ( ua.indexOf( "msie" ) != -1 ) {
        // Microsoft Internet Explorer and derivatives...
        _browser = "msie";
    } else if ( ua.indexOf( "safari" ) != -1 ) {
        // Safari (check before Gecko because it includes "like Gecko")
        _browser = "safari";
    } else if ( ua.indexOf( "gecko" ) != -1 ) {
        // Gecko
        _browser = "gecko";
    }

    return {

        /**
         * Fired when the Browser History Manager is ready.
         *
         * @event onLoadEvent
         */
        onLoadEvent : new YAHOO.util.CustomEvent( "onLoad" ),

        /**
         * Registers a new module.
         *
         * @method register
         * @param {string} module Non-empty string uniquely identifying the
         *     module you wish to register.
         * @param {string} initialState The initial state of the specified
         *     module corresponding to its earliest history entry.
         * @param {function} onStateChange Callback called when the
         *     state of the specified module has changed.
         */
        register : function( module, initialState, onStateChange ) {
            if ( typeof module != "string" || _trim( module ) === "" ||
                 typeof initialState != "string" ||
                 typeof onStateChange != "function" ) {
                throw new Error( "Missing or invalid argument passed to YAHOO.util.History.register" );
            }

            if ( _modules[module] ) {
                throw new Error( "A module cannot be registered twice" );
            }

            // Note: A module CANNOT be registered after calling
            // YAHOO.util.History.initialize. Indeed, we set the initial state
            // of each registered module in YAHOO.util.History.initialize.
            // If you could register a module after initializing the Browser
            // History Manager, you would not read the correct state using
            // YAHOO.util.History.getCurrentState when coming back to the
            // page using the back button.
            if ( _initialized ) {
                throw new Error( "All modules must be registered before calling YAHOO.util.History.initialize" );
            }

            // Make sure the strings passed in do not contain our separators "," and "|"
            module = escape( module );
            initialState = escape( initialState );

            _modules[module] = {
                name : module,
                initialState : initialState,
                currentState : initialState,
                onStateChange : onStateChange
            };
        },

        /**
         * Initializes the Browser History Manager. Call this method
         * from a script block located right after the opening body tag.
         *
         * @method initialize
         * @param {string} iframeTarget Optional - Path to an existing
         *     HTML document accessible from the same domain. If not
         *     specified, defaults to "blank.html"
         * @public
         */
        initialize : function( iframeTarget ) {
            // Return if the browser history manager has already been initialized
            if ( _initialized ) {
                return;
            }

            if ( _browser == "unknown" ) {
                throw new Error( "Your web browser is not supported by the Browser History Manager" );
            }

            if ( !iframeTarget ) {
                iframeTarget = "blank.html";
            }

            if ( typeof iframeTarget != "string" || _trim( iframeTarget ) === "" ) {
                throw new Error( "Invalid argument passed to YAHOO.util.History.initialize" );
            }

            document.write( '<input type="hidden" id="yui_hist_field">' );
            if ( _browser == "msie" ) {
                // Pointing the IFrame to a file on the server is absolutely
                // essential. I tried to point it to nothing (by setting
                // src="") and create the initial entry in the browser
                // history (by using document.write) but it did not work
                // when coming back to the page... Also, the file must exist
                // on the server!
                document.write( '<iframe id="yui_hist_iframe" src="' + iframeTarget + '" style="position:absolute;visibility:hidden;"></iframe>' );
            }

            // We have to wait for the window's onload handler. Otherwise, our
            // hidden form field will always be empty (i.e. the browser won't
            // have had enough time to restore the session)
            YAHOO.util.Event.addListener( window, "load", _initialize );

            _initialized = true;
        },

        /**
         * Call this method when you want to store a new entry in the browser's history.
         *
         * @method navigate
         * @param {string} state Non-empty string representing the application's new state.
         * @return {boolean} Indicates whether the new state was successfully added to the history.
         * @public
         */
        navigate : function( module, state ) {
            if ( typeof module != "string" || _trim( module ) === "" || typeof state != "string" ) {
                throw new Error( "Missing or invalid argument passed to YAHOO.util.History.navigate" );
            }

            if ( !_bhmReady ) {
                throw new Error( "The Browser History Manager is not initialized" );
            }

            if ( !_modules[module] ) {
                throw new Error( "The following module has not been registered: " + module );
            }

            // Make sure the strings passed in do not contain our separators "," and "|"
            module = escape( module );
            state = escape( state );

            // Generate our new full state string mod1=xxx&mod2=yyy
            var currentStates = [];
            for ( var moduleName in _modules ) {
                var moduleObj = _modules[moduleName];
                var currentState = ( moduleName == module ) ? state : moduleObj.currentState;
                currentStates.push( moduleName + "=" + currentState );
            }

            var fqstate = currentStates.join( "&" );

            if ( _browser == "msie" ) {

                // Add a new entry to the browser's history...
                var html = '<html><body><div id="state">' + fqstate + '</div></body></html>';
                try {
                    var doc = _iframe.contentWindow.document;
                    doc.open();
                    doc.write( html );
                    doc.close();
                } catch ( e ) {
                }

            } else {

                // Known bug: On Safari 1.x and 2.0, if you have tab browsing
                // enabled, Safari will show an endless loading icon in the
                // tab. This has apparently been fixed in recent WebKit builds.
                // One work around found by Dav Glass is to submit a form that
                // points to the same document. This indeed works on Safari 1.x
                // and 2.0 but creates bigger problems on WebKit. So for now,
                // we'll consider this an acceptable bug, and hope that Apple
                // comes out with their next version of Safari very soon.
                top.location.hash = fqstate;
                if ( _browser == "safari" ) {
                    // The following two lines are only useful for Safari 1.x
                    // and 2.0. Recent nightly builds of WebKit do not require
                    // that, but unfortunately, it is not easy to differentiate
                    // between the two. Once Safari 2.0 departs the A-grade
                    // list, we can remove the following two lines...
                    _fqstates[history.length] = fqstate;
                    _storeStates();
                }

            }

            return true;
        },

        /**
         * Returns the current state of the specified module.
         *
         * @method getCurrentState
         * @param {string} module Non-empty string representing your module.
         * @return {string} The current state of the specified module.
         * @public
         */
        getCurrentState : function( module ) {
            if ( typeof module != "string" || _trim( module ) === "" ) {
                throw new Error( "Missing or invalid argument passed to YAHOO.util.History.getCurrentState" );
            }

            if ( !_storageFieldReady ) {
                throw new Error( "The Browser History Manager is not initialized" );
            }

            var moduleObj = _modules[module];
            if ( !moduleObj ) {
                throw new Error( "No such registered module: " + module );
            }

            return unescape( moduleObj.currentState );
        },

        /**
         * Returns the state of a module according to the URL fragment
         * identifier. This method is useful to initialize your modules
         * if your application was bookmarked from a particular state.
         *
         * @method getBookmarkedState
         * @param {string} module Non-empty string representing your module.
         * @return {string} The bookmarked state of the specified module.
         * @public
         */
        getBookmarkedState : function( module ) {
            if ( typeof module != "string" || _trim( module ) === "" ) {
                throw new Error( "Missing or invalid argument passed to YAHOO.util.History.getBookmarkedState" );
            }

            var hash = top.location.hash.substr(1);
            var states = hash.split( "&" );
            for ( var idx=0, len=states.length ; idx<len ; idx++ ) {
                var tokens = states[idx].split( "=" );
                if ( tokens.length == 2 ) {
                    var moduleName = tokens[0];
                    if ( moduleName == module ) {
                        return tokens[1];
                    }
                }
            }

            return null;
        },

        /**
         * Returns the value of the specified query string parameter.
         * This method is not used internally by the Browser History Manager.
         * However, it is provided here as a helper since many applications
         * using the Browser History Manager will want to read the value of
         * url parameters to initialize themselves.
         *
         * @method getQueryStringParameter
         * @param {string} paramName Name of the parameter we want to look up.
         * @param {string} queryString Optional URL to look at. If not specified,
         *     this method uses the URL in the address bar.
         * @return {string} The value of the specified parameter, or null.
         * @public
         */
        getQueryStringParameter : function( paramName, url ) {
            url = url || top.location.href;
            var idx = url.indexOf( "?" );
            var queryString = idx >= 0 ? url.substr( idx+1 ) : url;
            var params = queryString.split( "&" );
            for ( var i=0, len=params.length ; i<len ; i++ ) {
                var tokens = params[i].split( "=" );
                if ( tokens.length >= 2 ) {
                    if ( tokens[0] == paramName ) {
                        return tokens[1];
                    }
                }
            }
            return null;
        }

    };

} )();
YAHOO.register("history", YAHOO.util.History, {version: "@VERSION@", build: "@BUILD@"});
