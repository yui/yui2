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

        this.loadHandler =  {
            success: function(o) {
                this.set('content', o.responseText);
            },
            failure: function(o) {
                YAHOO.log('loading failed: ' + o.statusText,
                        'error', 'Tab');
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
     * @default "on"
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
     * @method initAttributes
     * @param {Object} attr Hash of initial attributes
     */
    proto.initAttributes = function(attr) {
        attr = attr || {};
        Tab.superclass.initAttributes.call(this, attr);
        
        var el = this.get('element');
        
        /**
         * The event that triggers the tab's activation.
         * @config label
         * @type String
         */
        this.register('activationEvent', {
            value: attr.activationEvent || 'click'
        });        

        /**
         * The element that contains the tab's label.
         * @config labelEl
         * @type HTMLElement
         */
        this.register('labelEl', {
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
         * @config label
         * @type String
         */
        this.register('label', {
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
         * @config contentEl
         * @type HTMLElement
         */
        this.register('contentEl', { // TODO: apply className?
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
         * @config content
         * @type String
         */
        this.register('content', {
            value: attr.content, // TODO: what about existing?
            method: function(value) {
                this.get('contentEl').innerHTML = value;
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
        
        /**
         * The method to use for the data request.
         * @config loadMethod
         * @type String
         * @default "GET"
         */
        this.register('loadMethod', {
            value: attr.loadMethod || 'GET',
            validator: Lang.isString
        });

        /**
         * Whether or not any data has been loaded from the server.
         * @config dataLoaded
         * @type Boolean
         */        
        this.register('dataLoaded', {
            value: false,
            validator: Lang.isBoolean,
            writeOnce: true
        });
        
        /**
         * Number if milliseconds before aborting and calling failure handler.
         * @config dataTimeout
         * @type Number
         * @default null
         */
        this.register('dataTimeout', {
            value: attr.dataTimeout || null,
            validator: Lang.isNumber
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
         * The href of the tab's anchor element.
         * @config href
         * @type String
         * @default '#'
         */
        this.register('href', {
            value: attr.href || '#',
            method: function(value) {
                this.getElementsByTagName('a')[0].href = value;
            },
            validator: Lang.isString
        });
        
        /**
         * The Whether or not the tab's content is visible.
         * @config contentVisible
         * @type Boolean
         * @default false
         */
        this.register('contentVisible', {
            value: attr.contentVisible,
            method: function(value) {
                if (value == true) {
                    this.get('contentEl').style.display = 'block';
                    
                    if ( this.get('dataSrc') ) {
                     // load dynamic content unless already loaded and caching
                        if ( !this.get('dataLoaded') || !this.get('cacheData') ) {
                            _dataConnect.call(this);
                        }
                    }
                } else {
                    this.get('contentEl').style.display = 'none';
                }
            },
            validator: Lang.isBoolean
        });
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
        
        this.dataConnection = YAHOO.util.Connect.asyncRequest(
            this.get('loadMethod'),
            this.get('dataSrc'), 
            {
                success: function(o) {
                    this.loadHandler.success.call(this, o);
                    this.set('dataLoaded', true);
                    this.dataConnection = null;
                    Dom.removeClass(this.get('contentEl').parentNode,
                            this.LOADING_CLASSNAME);
                },
                failure: function(o) {
                    this.loadHandler.failure.call(this, o);
                    this.dataConnection = null;
                    Dom.removeClass(this.get('contentEl').parentNode,
                            this.LOADING_CLASSNAME);
                },
                scope: this,
                timeout: this.get('dataTimeout')
            }
        );
    };
    
    YAHOO.widget.Tab = Tab;
    
    /**
     * Fires before the active state is changed.
     * <p>See: <a href="YAHOO.util.Element.html#addListener">Element.addListener</a></p>
     * <p>If handler returns false, the change will be cancelled, and the value will not
     * be set.</p>
     * <p><strong>Event fields:</strong><br>
     * <code>&lt;String&gt; type</code> beforeActiveChange<br>
     * <code>&lt;Boolean&gt;
     * prevValue</code> the current value<br>
     * <code>&lt;Boolean&gt;
     * newValue</code> the new value</p>
     * <p><strong>Usage:</strong><br>
     * <code>var handler = function(e) {var previous = e.prevValue};<br>
     * myTabs.addListener('beforeActiveChange', handler);</code></p>
     * @event beforeActiveChange
     */
        
    /**
     * Fires after the active state is changed.
     * <p>See: <a href="YAHOO.util.Element.html#addListener">Element.addListener</a></p>
     * <p><strong>Event fields:</strong><br>
     * <code>&lt;String&gt; type</code> activeChange<br>
     * <code>&lt;Boolean&gt;
     * prevValue</code> the previous value<br>
     * <code>&lt;Boolean&gt;
     * newValue</code> the updated value</p>
     * <p><strong>Usage:</strong><br>
     * <code>var handler = function(e) {var previous = e.prevValue};<br>
     * myTabs.addListener('activeChange', handler);</code></p>
     * @event activeChange
     */
     
    /**
     * Fires before the tab label is changed.
     * <p>See: <a href="YAHOO.util.Element.html#addListener">Element.addListener</a></p>
     * <p>If handler returns false, the change will be cancelled, and the value will not
     * be set.</p>
     * <p><strong>Event fields:</strong><br>
     * <code>&lt;String&gt; type</code> beforeLabelChange<br>
     * <code>&lt;String&gt;
     * prevValue</code> the current value<br>
     * <code>&lt;String&gt;
     * newValue</code> the new value</p>
     * <p><strong>Usage:</strong><br>
     * <code>var handler = function(e) {var previous = e.prevValue};<br>
     * myTabs.addListener('beforeLabelChange', handler);</code></p>
     * @event beforeLabelChange
     */
        
    /**
     * Fires after the tab label is changed.
     * <p>See: <a href="YAHOO.util.Element.html#addListener">Element.addListener</a></p>
     * <p><strong>Event fields:</strong><br>
     * <code>&lt;String&gt; type</code> labelChange<br>
     * <code>&lt;String&gt;
     * prevValue</code> the previous value<br>
     * <code>&lt;String&gt;
     * newValue</code> the updated value</p>
     * <p><strong>Usage:</strong><br>
     * <code>var handler = function(e) {var previous = e.prevValue};<br>
     * myTabs.addListener('labelChange', handler);</code></p>
     * @event labelChange
     */
     
    /**
     * Fires before the tab content is changed.
     * <p>See: <a href="YAHOO.util.Element.html#addListener">Element.addListener</a></p>
     * <p>If handler returns false, the change will be cancelled, and the value will not
     * be set.</p>
     * <p><strong>Event fields:</strong><br>
     * <code>&lt;String&gt; type</code> beforeContentChange<br>
     * <code>&lt;String&gt;
     * prevValue</code> the current value<br>
     * <code>&lt;String&gt;
     * newValue</code> the new value</p>
     * <p><strong>Usage:</strong><br>
     * <code>var handler = function(e) {var previous = e.prevValue};<br>
     * myTabs.addListener('beforeContentChange', handler);</code></p>
     * @event beforeContentChange
     */
        
    /**
     * Fires after the tab content is changed.
     * <p>See: <a href="YAHOO.util.Element.html#addListener">Element.addListener</a></p>
     * <p><strong>Event fields:</strong><br>
     * <code>&lt;String&gt; type</code> contentChange<br>
     * <code>&lt;String&gt;
     * prevValue</code> the previous value<br>
     * <code>&lt;Boolean&gt;
     * newValue</code> the updated value</p>
     * <p><strong>Usage:</strong><br>
     * <code>var handler = function(e) {var previous = e.prevValue};<br>
     * myTabs.addListener('contentChange', handler);</code></p>
     * @event contentChange
     */
})();