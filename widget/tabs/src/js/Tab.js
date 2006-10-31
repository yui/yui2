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
     * The default tag name for a Tab's element.
	 * @property TAGNAME
	 * @type String
     * @default 'li'
	 */
    proto.TAG = 'li';
    
	/**
     * The default tag name for a Tab's element.
	 * @property TAGNAME
	 * @type String
     * @default 'li'
	 */
    proto.LABEL_TAG = 'a';
    
	/**
     * The default tag name for a Tab's inner element.
	 * @property TAGNAME
	 * @type String
     * @default 'li'
	 */
    proto.LABEL_INNER_TAG = 'em';
    
	/**
     * The class name applied to active tabs.
	 * @property ACTIVE_CLASSNAME
	 * @type String
     * @default 'on'
	 */
    proto.ACTIVE_CLASS = 'on';
    
	/**
     * The class name applied to active tabs.
	 * @property ACTIVE_CLASSNAME
	 * @type String
     * @default 'on'
	 */
    proto.DISABLED_CLASS = 'disabled';
    
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
     * @default 'click'
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
    
    /**
     * Registers TabView specific properties.
     * @method initProperties
     * @param {Object} properties Hash of initial properties
     */
    proto.initConfigs = function(attr) {
        attr = attr || {};
        Tab.superclass.initConfigs.call(this, attr);
        
        var el = this.get('element');
        
        /**
         * The tab's label text (or innerHTML).
         * @config label
         * @type String
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

        /**
         * Whether or not the tab is currently active
         * @config active
         * @type Boolean
         */
        this.register('active', {
            value: attr.active || this.hasClass(this.ACTIVE_CLASS),
            method: function(value) {
                if (value === true) {
                    this.addClass(this.ACTIVE_CLASS);
                    this.set('title', 'active');
                } else {
                    this.removeClass(this.ACTIVE_CLASS);
                    this.set('title', '');
                }
            },
            validator: function(value) {
                return Lang.isBoolean(value) && !this.get('disabled') ;
            }
        });
        
        /**
         * The tab's content element.
         * @config diabled
         * @type Boolean
         * @default false
         */
        this.register('disabled', {
            value: attr.disabled || this.hasClass(this.DISABLED_CLASS),
            method: function(value) {
                if (value === true) {
                    Dom.addClass(this.get('element'), this.DISABLED_CLASS);
                } else {
                    Dom.removeClass(this.get('element'), this.DISABLED_CLASS);
                }
            },
            validator: Lang.isBoolean
        });
        
        /**
         * The tab's content element.
         * @config contentElement
         * @type HTMLElement
         */
        this.register('panel', {
            value: attr.panel,
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
         * The tab's content element.
         * @config contentElement
         * @type HTMLElement
         */
        this.register('content', {
            value: attr.content, // TODO: what about existing?
            method: function(value) {
                var panel = this.get('panel');

                if (!panel) {
                    panel = new YAHOO.widget.TabPanel(null, { 'innerHTML': value });
                    this.set('panel', panel, true);

                    // TODO: append?
                } else {
                    panel.set('innerHTML', value);
                }
                
            }
        });
    };
    
    var _createTabElement = function(attr) {
        var el = document.createElement(this.TAG);
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

        if (this.CLASS) {
            el.className = this.CLASS;
        }
        
        el.appendChild(labelElement);
        
        return el;
    };
    
    var _getLabelElement = function() {
        var el = this.getElementsByClassName(this.LABEL_CLASS, this.LABEL_TAG)[0]; 
        
        if (!el) {
            el = this.getElementsByTagName(this.LABEL_TAG)[0];
        }

        return el;
    };
    
    var _createLabelElement = function() {
        var el = document.createElement(this.LABEL_TAG);
        var inner;
        
        if (this.LABEL_CLASS) {
            el.className = this.LABEL_CLASS;
        }
        
        el.href = '#';
        
        if (this.LABEL_INNER_TAG) {
            inner = document.createElement(this.LABEL_INNER_TAG);
            el.appendChild(inner);
        }
        
        return el;
    };
    
    var _setLabel = function(label) {
        var el = this.get('labelElement');
        var inner = el.getElementsByTagName(this.LABEL_INNER_TAG)[0];
        
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
                inner = el.getElementsByTagName(this.LABEL_INNER_TAG)[0];
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