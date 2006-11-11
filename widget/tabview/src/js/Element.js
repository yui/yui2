(function() {
// internal shorthand
var Dom = YAHOO.util.Dom,
    Lang = YAHOO.util.Lang,
    EventPublisher = YAHOO.util.EventPublisher,
    AttributeProvider = YAHOO.util.AttributeProvider;

/**
 * Element provides an interface to an HTMLElement's attributes and common
 * methods.  Other commonly used attributes are added as well.
 * @namespace YAHOO.util
 * @class Element
 * @uses YAHOO.util.AttributeProvider
 * @constructor
 * @param el {HTMLElement | String} The html element that 
 * represents the Element.
 * @param {Object} map A key-value map of initial config names and values
 */
YAHOO.util.Element = function(el, map) {
    if (arguments.length) {
        this.init(el, map);
    }
};

YAHOO.util.Element.prototype = {
	/**
     * Dom events supported by the Element instance.
	 * @property DOM_EVENTS
	 * @type Object
	 */
    DOM_EVENTS: null,

	/**
     * Wrapper for HTMLElement method.
	 * @method appendChild
	 * @param {Boolean} deep Whether or not to do a deep clone
	 */
    appendChild: function(child) {
        child = child.get ? child.get('element') : child;
        this.get('element').appendChild(child);
    },
    
	/**
     * Wrapper for HTMLElement method.
	 * @method getElementsByTagName
	 * @param {String} tag The tagName to collect
	 */
    getElementsByTagName: function(tag) {
        return this.get('element').getElementsByTagName(tag);
    },
    
	/**
     * Wrapper for HTMLElement method.
	 * @method hasChildNodes
	 * @return {Boolean} Whether or not the element has childNodes
	 */
    hasChildNodes: function() {
        return this.get('element').hasChildNodes();
    },
    
	/**
     * Wrapper for HTMLElement method.
	 * @method insertBefore
	 * @param {HTMLElement} element The HTMLElement to insert
	 * @param {HTMLElement} before The HTMLElement to insert
     * the element before.
	 */
    insertBefore: function(element, before) {
        element = element.get ? element.get('element') : element;
        before = (before && before.get) ? before.get('element') : before;
        
        this.get('element').insertBefore(element, before);
    },
    
	/**
     * Wrapper for HTMLElement method.
	 * @method removeChild
	 * @param {HTMLElement} child The HTMLElement to remove
	 */
    removeChild: function(child) {
        child = child.get ? child.get('element') : child;
        this.get('element').removeChild(child);
        return true;
    },
    
	/**
     * Wrapper for HTMLElement method.
	 * @method replaceChild
	 * @param {HTMLElement} newNode The HTMLElement to insert
	 * @param {HTMLElement} oldNode The HTMLElement to replace
	 */
    replaceChild: function(newNode, oldNode) { // TODO: HTMLElement had get?
        newNode = newNode.get ? newNode.get('element') : newNode;
        oldNode = oldNode.get ? oldNode.get('element') : oldNode;
        return this.get('element').replaceChild(newNode, oldNode);
    },

    
    /**
     * Registers Element specific attributes.
     * @method initAttributes
     * @param {Object} map A key-value map of initial attribute configs
     */
    initAttributes: function(map) {
        map = map || {}; 
        var element = Dom.get(map.element) || null;
        
        /**
         * The HTMLElement the Element instance refers to.
         * @config element
         * @type HTMLElement
         */
        this.register('element', {
            value: element,
            readOnly: true
         });
    },

    /**
     * Adds a listener for the given event.  These may be DOM or 
     * customEvent listeners.  Any event that is fired via fireEvent
     * can be listened for.  All handlers receive an event object. 
     * @method addListener
     * @param {String} type The name of the event to listen for
     * @param {Function} fn The handler to call when the event fires
     * @param {Any} obj A variable to pass to the handler
     * @param {Object} scope The object to use for the scope of the handler 
     */
    addListener: function(type, fn, obj, scope) {
        var el = this.get('element');
        var scope = scope || this;
        
        el = this.get('id') || el;
        
        if (!this._events[type]) { // create on the fly
            if ( this.DOM_EVENTS[type] ) {
                YAHOO.util.Event.addListener(el, type, function(e) {
                    if (e.srcElement && !e.target) { // supplement IE with target
                        e.target = e.srcElement;
                    }
                    this.fireEvent(type, e);
                }, obj, scope);
            }
            
            this.createEvent(type, this);
            this._events[type] = true;
        }
        
        this.subscribe.apply(this, arguments); // notify via customEvent
    },
    
    
    /**
     * Alias for addListener
     * @method on
     * @param {String} type The name of the event to listen for
     * @param {Function} fn The function call when the event fires
     * @param {Any} obj A variable to pass to the handler
     * @param {Object} scope The object to use for the scope of the handler 
     */
    on: function() { this.addListener.apply(this, arguments); },
    
    
    /**
     * Remove an event listener
     * @method removeListener
     * @param {String} type The name of the event to listen for
     * @param {Function} fn The function call when the event fires
     */
    removeListener: function(type, fn) {
        this.unsubscribe.apply(this, arguments);
    },
    
	/**
     * Wrapper for Dom method.
	 * @method addClass
	 * @param {String} className The className to add
	 */
    addClass: function(className) {
        Dom.addClass(this.get('element'), className);
    },
    
	/**
     * Wrapper for Dom method.
	 * @method getElementsByClassName
	 * @param {String} className The className to collect
	 * @param {String} tag (optional) The tag to use in
     * conjunction with class name
     * @return {Array} Array of HTMLElements
	 */
    getElementsByClassName: function(className, tag) {
        return Dom.getElementsByClassName(className, tag,
                this.get('element') );
    },
    
	/**
     * Wrapper for Dom method.
	 * @method hasClass
	 * @param {String} className The className to add
     * @return {Boolean} Whether or not the element has the class name
	 */
    hasClass: function(className) {
        return Dom.hasClass(this.get('element'), className); 
    },
    
	/**
     * Wrapper for Dom method.
	 * @method removeClass
	 * @param {String} className The className to remove
	 */
    removeClass: function(className) {
        return Dom.removeClass(this.get('element'), className);
    },
    
	/**
     * Wrapper for Dom method.
	 * @method replaceClass
	 * @param {String} oldClassName The className to replace
	 * @param {String} newClassName The className to add
	 */
    replaceClass: function(oldClassName, newClassName) {
        return Dom.replaceClass(this.get('element'), 
                oldClassName, newClassName);
    },
    
	/**
     * Wrapper for Dom method.
	 * @method setStyle
	 * @param {String} property The style property to set
	 * @param {String} value The value to apply to the style property
	 */
    setStyle: function(property, value) {
        return Dom.setStyle(this.get('element'),  property, value);
    },
    
	/**
     * Wrapper for Dom method.
	 * @method getStyle
	 * @param {String} property The style property to retrieve
	 * @return {String} The current value of the property
	 */
    getStyle: function(property) {
        return Dom.getStyle(this.get('element'),  property);
    },
    
	/**
     * Apply any queued set calls.
	 * @method fireQueue
	 */
    fireQueue: function() {
        var queue = this._queue;
        for (var i = 0, len = queue.length; i < len; ++i) {
            this[queue[i][0]].apply(this, queue[i][1]);
        }
    },
    
	/**
     * Appends the HTMLElement into either the supplied parentNode.
	 * @method appendTo
	 * @param {HTMLElement | Element} parentNode The node to append to
	 * @param {HTMLElement | Element} before An optional node to insert before
	 */
    appendTo: function(parent, before) {
        parent = (parent.get) ?  parent.get('element') : Dom.get(parent);
        
        before = (before && before.get) ? 
                before.get('element') : Dom.get(before);
        var element = this.get('element');
        
        var newAddition =  !Dom.inDocument(element);
        
        if (!element) {
            YAHOO.log('appendTo failed: element not available',
                    'error', 'Element');
            return false;
        }
        
        if (!parent) {
            YAHOO.log('appendTo failed: parent not available',
                    'error', 'Element');
            return false;
        }
        
        if (element.parent != parent) {
            if (before) {
                parent.insertBefore(element, before);
            } else {
                parent.appendChild(element);
            }
        }
        
        YAHOO.log(element + 'appended to ' + parent);
        
        if (!newAddition) {
            return false; // note return
        }
        
        // if a new addition, refresh HTMLElement any applied attributes
        var keys = this.getAttributeKeys();
        
        for (var key in keys) { // only refresh HTMLElement attributes
            if ( !Lang.isUndefined(element[key]) ) {
                this.refresh(key); // TODO: verify
            }
        }
    },
    
    get: function(key) {
        var configs = this._configs || {};
        var el = configs.element; // avoid loop due to 'element'
        if (el && !configs[key] && !Lang.isUndefined(el.value[key]) ) {
            return el.value[key];
        }

        return AttributeProvider.prototype.get.call(this, key);
    },

    set: function(key, value, silent) {
        var el = this.get('element');
        if (!el) {
            this._queue[key] = ['set', arguments];
            return false;
        }
        
        // set it on the element if not a property
        if ( !this._configs[key] && !Lang.isUndefined(el[key]) ) {
            _registerHTMLAttr(this, key);
        }

        return AttributeProvider.prototype.set.apply(this, arguments);
    },
    
    register: function(key) { // protect html attributes
        var configs = this._configs || {};
        var element = this.get('element') || null;
        
        if ( element && !Lang.isUndefined(element[key]) ) {
            YAHOO.log(key + ' is reserved for ' + element, 
                    'error', 'Element');
            return false;
        }
        
        return AttributeProvider.prototype.register.apply(this, arguments);
    },
    
    configureAttribute: function(property, map, init) { // protect html attributes
        if (!this._configs[property] && this._configs.element && 
                !Lang.isUndefined(this._configs.element[property]) ) {
            _registerHTMLAttr(this, property, map);
            return false;
        }
        
        return AttributeProvider.prototype.configure.apply(this, arguments);
    },
    
    getAttributeKeys: function() {
        var el = this.get('element');
        var keys = AttributeProvider.prototype.getAttributeKeys.call(this);
        
        //add any unconfigured element keys
        for (var key in el) {
            if (!this._configs[key]) {
                keys[key] = keys[key] || el[key];
            }
        }
        
        return keys;
    },
    
    init: function(el, attr) {
        this._queue = this._queue || [];
        this._events = this._events || {};
        this._configs = this._configs || {};
        attr = attr || {};
        attr.element = attr.element || el || null;

        this.DOM_EVENTS = {
            'click': true,
            'keydown': true,
            'keypress': true,
            'keyup': true,
            'mousedown': true,
            'mousemove': true,
            'mouseout': true, 
            'mouseover': true, 
            'mouseup': true
        };
        
        var readyHandler = function() {
            this.initAttributes(attr);

            this.setAttributes(attr, true); // TODO: set HTMLElement attrs
            this.fireQueue();
            this.fireEvent('contentReady', {
                type: 'contentReady',
                target: attr.element
            });
        };

        if ( Lang.isString(el) ) {
            _registerHTMLAttr(this, 'id', { value: el });
            YAHOO.util.Event.onAvailable(el, function() {
                attr.element = Dom.get(el);
                this.fireEvent('available', {
                    type: 'available',
                    target: attr.element
                }); 
            }, this, true);
            
            YAHOO.util.Event.onContentReady(el, function() {
                readyHandler.call(this);
            }, this, true);
        } else {
            readyHandler.call(this);
        }        
    }
};

/**
 * Sets the value of the property and fires beforeChange and change events.
 * @private
 * @method _registerHTMLAttr
 * @param {YAHOO.util.Element} element The Element instance to
 * register the config to.
 * @param {String} key The name of the config to register
 * @param {Object} map A key-value map of the config's params
 */
var _registerHTMLAttr = function(self, key, map) {
    var el = self.get('element');
    map = map || {};
    map.name = key;
    map.method = map.method || function(value) {
        el[key] = value;
    };
    map.value = map.value || el[key];
    self._configs[key] = new YAHOO.util.Attribute(map, self);
};

/**
 * Fires when the Element's HTMLElement can be retrieved by Id.
 * <p>See: <a href="#addListener">Element.addListener</a></p>
 * <p><strong>Event fields:</strong><br>
 * <code>&lt;String&gt; type</code> available<br>
 * <code>&lt;HTMLElement&gt;
 * target</code> the HTMLElement bound to this Element instance<br>
 * <p><strong>Usage:</strong><br>
 * <code>var handler = function(e) {var target = e.target};<br>
 * myTabs.addListener('available', handler);</code></p>
 * @event available
 */
 
/**
 * Fires when the Element's HTMLElement subtree is rendered.
 * <p>See: <a href="#addListener">Element.addListener</a></p>
 * <p><strong>Event fields:</strong><br>
 * <code>&lt;String&gt; type</code> contentReady<br>
 * <code>&lt;HTMLElement&gt;
 * target</code> the HTMLElement bound to this Element instance<br>
 * <p><strong>Usage:</strong><br>
 * <code>var handler = function(e) {var target = e.target};<br>
 * myTabs.addListener('contentReady', handler);</code></p>
 * @event contentReady
 */


YAHOO.augment(YAHOO.util.Element, AttributeProvider);
})();