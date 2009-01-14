(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        Lang = YAHOO.lang;
    

    // STRING CONSTANTS
    var CONTENT_EL = 'contentEl',
        LABEL_EL = 'labelEl',
        CONTENT = 'content',
        ELEMENT = 'element',
        CACHE_DATA = 'cacheData',
        DATA_SRC = 'dataSrc',
        DATA_LOADED = 'dataLoaded',
        DATA_TIMEOUT = 'dataTimeout',
        LOAD_METHOD = 'loadMethod',
        POST_DATA = 'postData',
        DISABLED = 'disabled';
    
    /**
     * A representation of a Tab's label and content.
     * @namespace YAHOO.widget
     * @class Tab
     * @extends YAHOO.util.Element
     * @constructor
     * @param element {HTMLElement | String} (optional) The html element that 
     * represents the TabView. An element will be created if none provided.
     * @param {Object} properties A key map of initial properties
     */
    var Tab = function(el, attr) {
        attr = attr || {};
        if (arguments.length == 1 && !Lang.isString(el) && !el.nodeName) {
            attr = el;
            el = attr.element;
        }

        if (!el && !attr.element) {
            el = _createTabElement.call(this, attr);
        }

        this.loadHandler =  {
            success: function(o) {
                this.set(CONTENT, o.responseText);
            },
            failure: function(o) {
            }
        };
        
        Tab.superclass.constructor.call(this, el, attr);
        
        this.DOM_EVENTS = {}; // delegating to tabView
    };

    YAHOO.extend(Tab, YAHOO.util.Element, {
        /**
         * The default tag name for a Tab's inner element.
         * @property LABEL_INNER_TAGNAME
         * @type String
         * @default "em"
         */
        LABEL_TAGNAME: 'em',
        
        /**
         * The class name applied to active tabs.
         * @property ACTIVE_CLASSNAME
         * @type String
         * @default "selected"
         */
        ACTIVE_CLASSNAME: 'selected',
        
        /**
         * The class name applied to active tabs.
         * @property ACTIVE_CLASSNAME
         * @type String
         * @default "selected"
         */
        HIDDEN_CLASSNAME: 'yui-hidden',
        
        /**
         * The title applied to active tabs.
         * @property ACTIVE_TITLE
         * @type String
         * @default "active"
         */
        ACTIVE_TITLE: 'active',

        /**
         * The class name applied to disabled tabs.
         * @property DISABLED_CLASSNAME
         * @type String
         * @default "disabled"
         */
        DISABLED_CLASSNAME: DISABLED,
        
        /**
         * The class name applied to dynamic tabs while loading.
         * @property LOADING_CLASSNAME
         * @type String
         * @default "disabled"
         */
        LOADING_CLASSNAME: 'loading',

        /**
         * Provides a reference to the connection request object when data is
         * loaded dynamically.
         * @property dataConnection
         * @type Object
         */
        dataConnection: null,
        
        /**
         * Object containing success and failure callbacks for loading data.
         * @property loadHandler
         * @type object
         */
        loadHandler: null,

        _loading: false,
        
        /**
         * Provides a readable name for the tab.
         * @method toString
         * @return String
         */
        toString: function() {
            var el = this.get(ELEMENT);
            var id = el.id || el.tagName;
            return "Tab " + id; 
        },
        
        /**
         * setAttributeConfigs TabView specific properties.
         * @method initAttributes
         * @param {Object} attr Hash of initial attributes
         */
        initAttributes: function(attr) {
            attr = attr || {};
            Tab.superclass.initAttributes.call(this, attr);
            
            var el = this.get(ELEMENT);
            
            /**
             * The event that triggers the tab's activation.
             * @attribute activationEvent
             * @type String
             */
            this.setAttributeConfig('activationEvent', {
                value: attr.activationEvent || 'click'
            });        

            /**
             * The element that contains the tab's label.
             * @attribute labelEl
             * @type HTMLElement
             */
            this.setAttributeConfig(LABEL_EL, {
                value: attr.labelEl || _getlabelEl.call(this),
                method: function(value) {
                    var current = this.get(LABEL_EL);

                    if (current) {
                        if (current == value) {
                            return false; // already set
                        }
                        
                        this.replaceChild(value, current);
                    } else if (el.firstChild) { // ensure label is firstChild by default
                        this.insertBefore(value, el.firstChild);
                    } else {
                        this.appendChild(value);
                    }  
                } 
            });

            /**
             * The tab's label text (or innerHTML).
             * @attribute label
             * @type String
             */
            this.setAttributeConfig('label', {
                value: attr.label || _getLabel.call(this),
                method: function(value) {
                    var labelEl = this.get(LABEL_EL);
                    if (!labelEl) { // create if needed
                        this.set(LABEL_EL, _createlabelEl.call(this));
                    }
                    
                    _setLabel.call(this, value);
                }
            });
            
            /**
             * The HTMLElement that contains the tab's content.
             * @attribute contentEl
             * @type HTMLElement
             */
            this.setAttributeConfig(CONTENT_EL, {
                value: attr.contentEl || document.createElement('div'),
                method: function(value) {
                    var current = this.get(CONTENT_EL);

                    if (current) {
                        if (current == value) {
                            return false; // already set
                        }
                        this.replaceChild(value, current);
                    }
                }
            });
            
            /**
             * The tab's content.
             * @attribute content
             * @type String
             */
            this.setAttributeConfig(CONTENT, {
                value: attr.content,
                method: function(value) {
                    this.get(CONTENT_EL).innerHTML = value;
                }
            });

            var _dataLoaded = false;
            
            /**
             * The tab's data source, used for loading content dynamically.
             * @attribute dataSrc
             * @type String
             */
            this.setAttributeConfig(DATA_SRC, {
                value: attr.dataSrc
            });
            
            /**
             * Whether or not content should be reloaded for every view.
             * @attribute cacheData
             * @type Boolean
             * @default false
             */
            this.setAttributeConfig(CACHE_DATA, {
                value: attr.cacheData || false,
                validator: Lang.isBoolean
            });
            
            /**
             * The method to use for the data request.
             * @attribute loadMethod
             * @type String
             * @default "GET"
             */
            this.setAttributeConfig(LOAD_METHOD, {
                value: attr.loadMethod || 'GET',
                validator: Lang.isString
            });

            /**
             * Whether or not any data has been loaded from the server.
             * @attribute dataLoaded
             * @type Boolean
             */        
            this.setAttributeConfig(DATA_LOADED, {
                value: false,
                validator: Lang.isBoolean,
                writeOnce: true
            });
            
            /**
             * Number if milliseconds before aborting and calling failure handler.
             * @attribute dataTimeout
             * @type Number
             * @default null
             */
            this.setAttributeConfig(DATA_TIMEOUT, {
                value: attr.dataTimeout || null,
                validator: Lang.isNumber
            });
            
            /**
             * Arguments to pass when POST method is used 
             * @attribute postData
             * @default null
             */
            this.setAttributeConfig(POST_DATA, {
                value: attr.postData || null
            });

            /**
             * Whether or not the tab is currently active.
             * If a dataSrc is set for the tab, the content will be loaded from
             * the given source.
             * @attribute active
             * @type Boolean
             */
            this.setAttributeConfig('active', {
                value: attr.active || this.hasClass(this.ACTIVE_CLASSNAME),
                method: function(value) {
                    if (value === true) {
                        this.addClass(this.ACTIVE_CLASSNAME);
                        this.set('title', this.ACTIVE_TITLE);
                    } else {
                        this.removeClass(this.ACTIVE_CLASSNAME);
                        this.set('title', '');
                    }
                },
                validator: function(value) {
                    return Lang.isBoolean(value) && !this.get(DISABLED) ;
                }
            });
            
            /**
             * Whether or not the tab is disabled.
             * @attribute disabled
             * @type Boolean
             */
            this.setAttributeConfig(DISABLED, {
                value: attr.disabled || this.hasClass(this.DISABLED_CLASSNAME),
                method: function(value) {
                    if (value === true) {
                        Dom.addClass(this.get(ELEMENT), this.DISABLED_CLASSNAME);
                    } else {
                        Dom.removeClass(this.get(ELEMENT), this.DISABLED_CLASSNAME);
                    }
                },
                validator: Lang.isBoolean
            });
            
            /**
             * The href of the tab's anchor element.
             * @attribute href
             * @type String
             * @default '#'
             */
            this.setAttributeConfig('href', {
                value: attr.href ||
                        this.getElementsByTagName('a')[0].getAttribute('href', 2) || '#',
                method: function(value) {
                    this.getElementsByTagName('a')[0].href = value;
                },
                validator: Lang.isString
            });
            
            /**
             * The Whether or not the tab's content is visible.
             * @attribute contentVisible
             * @type Boolean
             * @default false
             */
            this.setAttributeConfig('contentVisible', {
                value: attr.contentVisible,
                method: function(value) {
                    if (value) {
                        //this.get(CONTENT_EL).style.display = 'block';
                        Dom.removeClass(this.get(CONTENT_EL), this.HIDDEN_CLASSNAME);
                        
                        if ( this.get(DATA_SRC) ) {
                         // load dynamic content unless already loading or loaded and caching
                            if ( !this._loading && !(this.get(DATA_LOADED) && this.get(CACHE_DATA)) ) {
                                this._dataConnect();
                            }
                        }
                    } else {
                        Dom.addClass(this.get(CONTENT_EL), this.HIDDEN_CLASSNAME);
                    }
                },
                validator: Lang.isBoolean
            });
            YAHOO.log('attributes initialized', 'info', 'Tab');
        },
        
        _dataConnect: function() {
            if (!YAHOO.util.Connect) {
                YAHOO.log('YAHOO.util.Connect dependency not met',
                        'error', 'Tab');
                return false;
            }

            Dom.addClass(this.get(CONTENT_EL).parentNode, this.LOADING_CLASSNAME);
            this._loading = true; 
            this.dataConnection = YAHOO.util.Connect.asyncRequest(
                this.get(LOAD_METHOD),
                this.get(DATA_SRC), 
                {
                    success: function(o) {
                        YAHOO.log('content loaded successfully', 'info', 'Tab');
                        this.loadHandler.success.call(this, o);
                        this.set(DATA_LOADED, true);
                        this.dataConnection = null;
                        Dom.removeClass(this.get(CONTENT_EL).parentNode,
                                this.LOADING_CLASSNAME);
                        this._loading = false;
                    },
                    failure: function(o) {
                        YAHOO.log('loading failed: ' + o.statusText, 'error', 'Tab');
                        this.loadHandler.failure.call(this, o);
                        this.dataConnection = null;
                        Dom.removeClass(this.get(CONTENT_EL).parentNode,
                                this.LOADING_CLASSNAME);
                        this._loading = false;
                    },
                    scope: this,
                    timeout: this.get(DATA_TIMEOUT)
                },

                this.get(POST_DATA)
            );
        }
    });
    
    var _createTabElement = function(attr) {
        var el = document.createElement('li');
        var a = document.createElement('a');
        
        a.href = attr.href || '#';
        
        el.appendChild(a);
        
        var label = attr.label || null;
        var labelEl = attr.labelEl || null;
        
        if (labelEl) { // user supplied labelEl
            if (!label) { // user supplied label
                label = _getLabel.call(this, labelEl);
            }
        } else {
            labelEl = _createlabelEl.call(this);
        }
        
        a.appendChild(labelEl);
        
        YAHOO.log('creating Tab Dom', 'info', 'Tab');
        return el;
    };
    
    var _getlabelEl = function() {
        return this.getElementsByTagName(this.LABEL_TAGNAME)[0];
    };
    
    var _createlabelEl = function() {
        var el = document.createElement(this.LABEL_TAGNAME);
        return el;
    };
    
    var _setLabel = function(label) {
        var el = this.get(LABEL_EL);
        el.innerHTML = label;
    };
    
    var _getLabel = function() {
        var label,
            el = this.get(LABEL_EL);
            
            if (!el) {
                return undefined;
            }
        
        return el.innerHTML;
    };
    
    YAHOO.widget.Tab = Tab;
})();

