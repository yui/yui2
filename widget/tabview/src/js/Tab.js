(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event;
    
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
        if (arguments.length == 1 && !YAHOO.lang.isString(el) && !el.nodeName) {
            attr = el;
            el = attr.element;
        }

        if (!el && !attr.element) {
            el = _createTabElement.call(this, attr);
        }

        this.loadHandler =  {
            success: function(o) {
                this.set('content', o.responseText);
            },
            failure: function(o) {
            }
        };
        
        Tab.superclass.constructor.call(this, el, attr);
        
        this.DOM_EVENTS = {}; // delegating to tabView
    };

    YAHOO.extend(Tab, YAHOO.util.Element);
    var proto = Tab.prototype;
    
    /**
     * The default tag name for a Tab's inner element.
     * @property LABEL_INNER_TAGNAME
     * @type String
     * @default "em"
     */
    proto.LABEL_TAGNAME = 'em';
    
    /**
     * The class name applied to active tabs.
     * @property ACTIVE_CLASSNAME
     * @type String
     * @default "selected"
     */
    proto.ACTIVE_CLASSNAME = 'selected';
    
    /**
     * The class name applied to disabled tabs.
     * @property DISABLED_CLASSNAME
     * @type String
     * @default "disabled"
     */
    proto.DISABLED_CLASSNAME = 'disabled';
    
    /**
     * The class name applied to dynamic tabs while loading.
     * @property LOADING_CLASSNAME
     * @type String
     * @default "disabled"
     */
    proto.LOADING_CLASSNAME = 'loading';

    /**
     * Provides a reference to the connection request object when data is
     * loaded dynamically.
     * @property dataConnection
     * @type Object
     */
    proto.dataConnection = null;
    
    /**
     * Object containing success and failure callbacks for loading data.
     * @property loadHandler
     * @type object
     */
    proto.loadHandler = null;

    proto._loading = false;
    
    /**
     * Provides a readable name for the tab.
     * @method toString
     * @return String
     */
    proto.toString = function() {
        var el = this.get('element');
        var id = el.id || el.tagName;
        return "Tab " + id; 
    };
    
    /**
     * setAttributeConfigs TabView specific properties.
     * @method initAttributes
     * @param {Object} attr Hash of initial attributes
     */
    proto.initAttributes = function(attr) {
        attr = attr || {};
        Tab.superclass.initAttributes.call(this, attr);
        
        var el = this.get('element');
        
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
        this.setAttributeConfig('labelEl', {
            value: attr.labelEl || _getlabelEl.call(this),
            method: function(value) {
                var current = this.get('labelEl');

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
                var labelEl = this.get('labelEl');
                if (!labelEl) { // create if needed
                    this.set('labelEl', _createlabelEl.call(this));
                }
                
                _setLabel.call(this, value);
            }
        });
        
        /**
         * The HTMLElement that contains the tab's content.
         * @attribute contentEl
         * @type HTMLElement
         */
        this.setAttributeConfig('contentEl', {
            value: attr.contentEl || document.createElement('div'),
            method: function(value) {
                var current = this.get('contentEl');

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
        this.setAttributeConfig('content', {
            value: attr.content,
            method: function(value) {
                this.get('contentEl').innerHTML = value;
            }
        });

        var _dataLoaded = false;
        
        /**
         * The tab's data source, used for loading content dynamically.
         * @attribute dataSrc
         * @type String
         */
        this.setAttributeConfig('dataSrc', {
            value: attr.dataSrc
        });
        
        /**
         * Whether or not content should be reloaded for every view.
         * @attribute cacheData
         * @type Boolean
         * @default false
         */
        this.setAttributeConfig('cacheData', {
            value: attr.cacheData || false,
            validator: YAHOO.lang.isBoolean
        });
        
        /**
         * The method to use for the data request.
         * @attribute loadMethod
         * @type String
         * @default "GET"
         */
        this.setAttributeConfig('loadMethod', {
            value: attr.loadMethod || 'GET',
            validator: YAHOO.lang.isString
        });

        /**
         * Whether or not any data has been loaded from the server.
         * @attribute dataLoaded
         * @type Boolean
         */        
        this.setAttributeConfig('dataLoaded', {
            value: false,
            validator: YAHOO.lang.isBoolean,
            writeOnce: true
        });
        
        /**
         * Number if milliseconds before aborting and calling failure handler.
         * @attribute dataTimeout
         * @type Number
         * @default null
         */
        this.setAttributeConfig('dataTimeout', {
            value: attr.dataTimeout || null,
            validator: YAHOO.lang.isNumber
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
                    this.set('title', 'active');
                } else {
                    this.removeClass(this.ACTIVE_CLASSNAME);
                    this.set('title', '');
                }
            },
            validator: function(value) {
                return YAHOO.lang.isBoolean(value) && !this.get('disabled') ;
            }
        });
        
        /**
         * Whether or not the tab is disabled.
         * @attribute disabled
         * @type Boolean
         */
        this.setAttributeConfig('disabled', {
            value: attr.disabled || this.hasClass(this.DISABLED_CLASSNAME),
            method: function(value) {
                if (value === true) {
                    Dom.addClass(this.get('element'), this.DISABLED_CLASSNAME);
                } else {
                    Dom.removeClass(this.get('element'), this.DISABLED_CLASSNAME);
                }
            },
            validator: YAHOO.lang.isBoolean
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
            validator: YAHOO.lang.isString
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
                    this.get('contentEl').style.display = 'block';
                    
                    if ( this.get('dataSrc') ) {
                     // load dynamic content unless already loading or loaded and caching
                        if ( !this._loading && !(this.get('dataLoaded') && this.get('cacheData')) ) {
                            _dataConnect.call(this);
                        }
                    }
                } else {
                    this.get('contentEl').style.display = 'none';
                }
            },
            validator: YAHOO.lang.isBoolean
        });
        YAHOO.log('attributes initialized', 'info', 'Tab');
    };
    
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
        var el = this.get('labelEl');
        el.innerHTML = label;
    };
    
    var _getLabel = function() {
        var label,
            el = this.get('labelEl');
            
            if (!el) {
                return undefined;
            }
        
        return el.innerHTML;
    };
    
    var _dataConnect = function() {
        if (!YAHOO.util.Connect) {
            YAHOO.log('YAHOO.util.Connect dependency not met',
                    'error', 'Tab');
            return false;
        }

        Dom.addClass(this.get('contentEl').parentNode, this.LOADING_CLASSNAME);
        this._loading = true; 
        this.dataConnection = YAHOO.util.Connect.asyncRequest(
            this.get('loadMethod'),
            this.get('dataSrc'), 
            {
                success: function(o) {
                    YAHOO.log('content loaded successfully', 'info', 'Tab');
                    this.loadHandler.success.call(this, o);
                    this.set('dataLoaded', true);
                    this.dataConnection = null;
                    Dom.removeClass(this.get('contentEl').parentNode,
                            this.LOADING_CLASSNAME);
                    this._loading = false;
                },
                failure: function(o) {
                    YAHOO.log('loading failed: ' + o.statusText, 'error', 'Tab');
                    this.loadHandler.failure.call(this, o);
                    this.dataConnection = null;
                    Dom.removeClass(this.get('contentEl').parentNode,
                            this.LOADING_CLASSNAME);
                    this._loading = false;
                },
                scope: this,
                timeout: this.get('dataTimeout')
            }
        );
    };
    
    YAHOO.widget.Tab = Tab;
})();

