(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        Lang = YAHOO.util.Lang;
    
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
    Tab = function(el, attr) {
        attr = attr || {};
        if (arguments.length == 1 && !Lang.isString(el) && !el.nodeName) {
            attr = el;
            el = attr.element;
        }

        if (!el && !attr.element) {
            el = _createTabElement.call(this, attr);
        }

        Tab.superclass.constructor.call(this, el, attr);
    };

    YAHOO.extend(Tab, YAHOO.util.Element);
    var proto = Tab.prototype;
    
    /**
     * The default tag name for a Tab's label element.
     * @property LABEL_TAGNAME
     * @type String
     * @default "a"
     */
    proto.LABEL_TAGNAME = 'a';
    
    /**
     * The default tag name for a Tab's inner element.
     * @property LABEL_INNER_TAGNAME
     * @type String
     * @default "em"
     */
    proto.LABEL_INNER_TAGNAME = 'em';
    
    /**
     * The class name applied to active tabs.
     * @property ACTIVE_CLASSNAME
     * @type String
     * @default "on"
     */
    proto.ACTIVE_CLASSNAME = 'on';
    
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
     * Dom events supported by the Tab instance.
     * These are deferred to TabView.
     * @property DOM_EVENTS
     * @type Object
     */
	proto.DOM_EVENTS = {};
    
    /**
     * The event that activates the tab.
     * @property ACTIVATION_EVENT
     * @type String
     * @default "click"
     */
    proto.ACTIVATION_EVENT = 'click';

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
    
    proto.element = null;
    
    proto.labelElement = null;
    
    /**
     * Registers TabView specific properties.
     * @method initConfigs
     * @param {Object} attr Hash of initial attributes
     */
    proto.initConfigs = function(attr) {
        attr = attr || {};
        Tab.superclass.initConfigs.call(this, attr);
        
        var el = this.get('element');
        
        /**
         * The element that contains the tab's label.
         * @config labelElement
         * @type HTMLElement
         */
        this.register('labelElement', {
            value: attr.labelElement || _getLabelElement.call(this),
            method: function(value) {
                var current = this.get('labelElement');
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
         * @config label
         * @type String
         */
        this.register('label', {
            value: attr.label || _getLabel.call(this),
            method: function(value) {
                var labelEl = this.get('labelElement');
                if (!labelEl) { // create if needed
                    this.set('labelElement', _createLabelElement.call(this));
                }
                
                _setLabel.call(this, value);
            }
        });

        var _dataLoaded = false;
        
        /**
         * The tab's data source, used for loading content dynamically.
         * @config dataSrc
         * @type String
         */
        this.register('dataSrc', {
            value: attr.dataSrc
        });
        
        /**
         * Whether or not content should be reloaded for every view.
         * @config cacheData
         * @type Boolean
         * @default false
         */
        this.register('cacheData', {
            value: attr.cacheData || false,
            validator: Lang.isBoolean
        });
        
        this.register('connectionCallback', {
            value: {
                success: function(o) {
                            this.set('content', o.responseText);
                            Dom.removeClass(this.get('panel').get('parentNode'),
                                    this.LOADING_CLASSNAME);
                },
                failure: function(o) {
                            YAHOO.log('loading failed: ' + o.statusText,
                                    'error', 'TabPanel');
                            Dom.removeClass(this.get('panel').get('parentNode'),
                                    this.LOADING_CLASSNAME);
                },
                scope: this
            }
        });
        
        /**
         * Whether or not the tab is currently active.
         * If a dataSrc is set for the tab, the content will be loaded from
         * the given source.
         * @config active
         * @type Boolean
         */
        this.register('active', {
            value: attr.active || this.hasClass(this.ACTIVE_CLASSNAME),
            method: function(value) {
                if (value === true) {
                    this.addClass(this.ACTIVE_CLASSNAME);
                    this.set('title', 'active');

                    if ( this.get('dataSrc') ) {
                     // load dynamic content
                        if ( !_dataLoaded || !this.get('cacheData') ) { // unless already loaded and caching
                            if (!YAHOO.util.Connect) {
                                YAHOO.log('YAHOO.util.Connect dependency not met',
                                        'error', 'Tab');
                                return false;
                            }
                            
                            Dom.addClass(this.get('panel').get('parentNode'), this.LOADING_CLASSNAME);
                            
                            YAHOO.util.Connect.asyncRequest(
                                'GET',
                                this.get('dataSrc'), 
                                this.get('connectionCallback')
                            );
                            _dataLoaded = true;
                        }
                    }
                    
                } else {
                    this.removeClass(this.ACTIVE_CLASSNAME);
                    this.set('title', '');
                }
            },
            validator: function(value) {
                return Lang.isBoolean(value) && !this.get('disabled') ;
            }
        });
        
        /**
         * Whether or not the tab is disabled.
         * @config disabled
         * @type Boolean
         */
        this.register('disabled', {
            value: attr.disabled || this.hasClass(this.DISABLED_CLASSNAME),
            method: function(value) {
                if (value === true) {
                    Dom.addClass(this.get('element'), this.DISABLED_CLASSNAME);
                } else {
                    Dom.removeClass(this.get('element'), this.DISABLED_CLASSNAME);
                }
            },
            validator: Lang.isBoolean
        });
        
        /**
         * The TabPanel that contains the tab's content.
         * @config panel
         * @type TabPanel
         */
        this.register('panel', {
            value: attr.panel || new YAHOO.widget.TabPanel(),
            method: function(value) {
                var current = this.get('panel');
                
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
         * @config content
         * @type String
         */
        this.register('content', {
            value: attr.content, // TODO: what about existing?
            method: function(value) {
                var panel = this.get('panel');

                if (!panel) {
                    panel = new YAHOO.widget.TabPanel(null, { 'innerHTML': value });
                    this.set('panel', panel, true);
                } else {
                    panel.set('innerHTML', value);
                }
                
            }
        });
    };
    
    var _createTabElement = function(attr) {
        var el = document.createElement('li');
        var label = attr.label || null;
        var labelElement = attr.labelElement || null;
        var inner;
        
        if (labelElement) { // user supplied labelElement
            if (!label) { // user supplied label
                label = _getLabel.call(this, labelElement);
            }
        } else {
            labelElement = _createLabelElement.call(this);
        }
        
        el.appendChild(labelElement);
        
        return el;
    };
    
    var _getLabelElement = function() {
        return this.getElementsByTagName(this.LABEL_TAGNAME)[0];
    };
    
    var _createLabelElement = function() {
        var el = document.createElement(this.LABEL_TAGNAME);
        var inner;
        
        el.href = '#';
        
        if (this.LABEL_INNER_TAGNAME) {
            inner = document.createElement(this.LABEL_INNER_TAGNAME);
            el.appendChild(inner);
        }
        
        return el;
    };
    
    var _setLabel = function(label) {
        var el = this.get('labelElement');
        var inner = el.getElementsByTagName(this.LABEL_INNER_TAGNAME)[0];
        
        if (inner) {
            inner.innerHTML = label;
        } else {
            el.innerHTML = label;
        }
    };
    
    var _getLabel = function() {
        var label,
            inner,
            el = this.get('labelElement');
            
            if (el) {
                inner = el.getElementsByTagName(this.LABEL_INNER_TAGNAME)[0];
            } else {
                return undefined;
            }
        
        if (inner) {
            label = inner.innerHTML;
        } else {
            label = el.innerHTML;
        }
        
        return label;
    };
    
    YAHOO.widget.Tab = Tab;
})();