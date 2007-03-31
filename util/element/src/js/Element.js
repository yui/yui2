(function() {
// internal shorthand
var Dom = YAHOO.util.Dom,
    AttributeProvider = YAHOO.util.AttributeProvider;

/**
 * Element provides an wrapper object to simplify adding
 * event listeners, using dom methods, and managing attributes. 
 * @module element
 * @namespace YAHOO.util
 * @requires yahoo, dom, event
 * @beta
 */

/**
 * Element provides an wrapper object to simplify adding
 * event listeners, using dom methods, and managing attributes. 
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
    replaceChild: function(newNode, oldNode) {
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
        scope = scope || this;
        
        el = this.get('id') || el;
        var self = this; 
        if (!this._events[type]) { // create on the fly
            if ( this.DOM_EVENTS[type] ) {
                YAHOO.util.Event.addListener(el, type, function(e) {
                    if (e.srcElement && !e.target) { // supplement IE with target
                        e.target = e.srcElement;
                    }
                    self.fireEvent(type, e);
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
        var el = this.get('element');
        if (!el) {
            return this._queue[this._queue.length] = ['setStyle', arguments];
        }

        return Dom.setStyle(el,  property, value); // TODO: always queuing?
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
        
        this.fireEvent('beforeAppendTo', {
            type: 'beforeAppendTo',
            target: parent
        });
        
        
        before = (before && before.get) ? 
                before.get('element') : Dom.get(before);
        var element = this.get('element');
        
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
        
        this.fireEvent('appendTo', {
            type: 'appendTo',
            target: parent
        });
    },
    
    get: function(key) {
        var configs = this._configs || {};
        var el = configs.element; // avoid loop due to 'element'
        if (el && !configs[key] && !YAHOO.lang.isUndefined(el.value[key]) ) {
            return el.value[key];
        }

        return AttributeProvider.prototype.get.call(this, key);
    },

    set: function(key, value, silent) {
        var el = this.get('element');
        if (!el) {
            this._queue[this._queue.length] = ['set', arguments];
            if (this._configs[key]) {
                this._configs[key].value = value; // so "get" works while queueing
            
            }
            return;
        }
        
        // set it on the element if not configured and is an HTML attribute
        if ( !this._configs[key] && !YAHOO.lang.isUndefined(el[key]) ) {
            _registerHTMLAttr.call(this, key);
        }

        return AttributeProvider.prototype.set.apply(this, arguments);
    },
    
    setAttributeConfig: function(key, map, init) {
        var el = this.get('element');

        if (el && !this._configs[key] && !YAHOO.lang.isUndefined(el[key]) ) {
            _registerHTMLAttr.call(this, key, map);
        } else {
            AttributeProvider.prototype.setAttributeConfig.apply(this, arguments);
        }
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
        _initElement.apply(this, arguments); 
    }
};

var _initElement = function(el, attr) {
    this._queue = this._queue || [];
    this._events = this._events || {};
    this._configs = this._configs || {};
    attr = attr || {};
    attr.element = attr.element || el || null;

    this.DOM_EVENTS = {
        'click': true,
        'dblclick': true,
        'keydown': true,
        'keypress': true,
        'keyup': true,
        'mousedown': true,
        'mousemove': true,
        'mouseout': true, 
        'mouseover': true, 
        'mouseup': true,
        'focus': true,
        'blur': true,
        'submit': true
    };

    if (YAHOO.lang.isString(el) ) { // defer until available/ready
        _registerHTMLAttr.call(this, 'id', { value: attr.element });
    }

    if (Dom.get(el)) {
        _availableHandler.call(this, attr);  
        _readyHandler.call(this, attr);
        return; // note return
    } 

    YAHOO.util.Event.onAvailable(attr.element, function() {
        _availableHandler.call(this, attr);  
    }, this, true);
    
    YAHOO.util.Event.onContentReady(attr.element, function() {
        _readyHandler.call(this, attr);
    }, this, true);
};

var _availableHandler = function(attr) {
    attr.element = Dom.get(attr.element);

    /**
     * The HTMLElement the Element instance refers to.
     * @config element
     * @type HTMLElement
     */
    this.setAttributeConfig('element', {
        value: attr.element,
        readOnly: true
     });

    this.fireEvent('available', {
        type: 'available',
        target: attr.element
    }); 
};

var _readyHandler = function(attr) {
    this.initAttributes(attr);
    this.setAttributes(attr, true);
    this.fireQueue();

    this.fireEvent('contentReady', {
        type: 'contentReady',
        target: attr.element
    });
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
var _registerHTMLAttr = function(key, map) {
    var el = this.get('element');
    map = map || {};
    map.name = key;
    map.method = map.method || function(value) {
        el[key] = value;
    };
    map.value = map.value || el[key];
    this._configs[key] = new YAHOO.util.Attribute(map, this);
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

