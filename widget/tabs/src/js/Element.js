(function() {
// internal shorthand
var Dom = YAHOO.util.Dom,
    Lang = YAHOO.util.Lang,
    EventPublisher = YAHOO.util.EventPublisher,
    AttributeProvider = YAHOO.util.AttributeProvider;

/**
 * Element provides an interface to an HTMLElement's properties and common
 * methods.  Other commonly used properties are added as well.
 * @namespace YAHOO.util
 * @class Element
 * @uses YAHOO.util.AttributeProvider
 * @constructor
 * @param el {HTMLElement | String} The html element that 
 * represents the Element.
 * @param {Object} map A key-value map of initial config names and values
 */
Element = function(el, map) {
    if (arguments.length) {
        this.init(el, map);
    }
};

Element.prototype = {
	/**
     * Dom events supported by the Element instance.
	 * @config DOM_EVENTS
	 * @type Object
	 */
    DOM_EVENTS: {
        'click': true,
        'keydown': true,
        'keypress': true,
        'keyup': true,
        'mousedown': true,
        'mousemove': true,
        'mouseout': true, 
        'mouseover': true, 
        'mouseup': true
    },

	/**
     * Wrapper for HTMLElement method.
	 * @method cloneNode
	 * @param {Boolean} deep Whether or not to do a deep clone
	 */
    appendChild: function(element) {
        return this.get('element').appendChild(element);
    },
    
	/**
     * Wrapper for HTMLElement method.
	 * @method cloneNode
	 * @param {Boolean} deep Whether or not to do a deep clone
	 */
    cloneNode: function(deep) {
        return this.get('element').cloneNode(deep);
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
        return this.get('element').insertBefore(element, before);
    },
    
	/**
     * Wrapper for HTMLElement method.
	 * @method removeChild
	 * @param {HTMLElement} child The HTMLElement to remove
	 */
    removeChild: function(child) {
        this.get('element').removeChild(child);
        return true;
    },
    
	/**
     * Wrapper for HTMLElement method.
	 * @method replaceChild
	 * @param {HTMLElement} oldNode The HTMLElement to replace
	 * @param {HTMLElement} newNode The HTMLElement to insert
	 */
    replaceChild: function(oldNode, newNode) { // TODO: is the order right?
        return this.get('element').replaceChild(oldNode, newNode);
    },
    
	/**
     * Wrapper for HTMLElement method.
	 * @method scrollIntoView
	 */
    scrollIntoView: function() {
        return this.get('element').scrollIntoView();
    },

    
    /**
     * Registers Element specific properties.
     * @method initConfigs
     * @param {Object} map A key-value map of initial config names and values
     */
    initConfigs: function(map) {
        map = map || {}; 
        var element = Dom.get(map.element) || null;
        
        /**
         * The HTMLElement the Element instance refers to.
         * @config element
         * @type HTMLElement
         */
        this.register('element', { value: element, writeOnce: true });
        
        /**
         * The x coordinate of the element.
         * @config x
         * @type Number
         */
        this.register('x', {
            value: map.x || null, 
            method: function(value) { Dom.setX(element, value); }, 
            validator: Lang.isNumber
        });
        
        /**
         * The y coordinate of the element.
         * @config y
         * @type Number
         */
        this.register('y', {
            value: map.y || null, // TODO: what about no element?
            method: function(value) { Dom.setY(element, value); }, 
            validator: Lang.isNumber
        });
        
        /**
         * The xy coordinates of the element.
         * @config xy
         * @type Array
         */
        this.register('xy', {
            value: map.xy || null, 
            method: function(value) { Dom.setXY(element, value); },
            validator: Lang.isArray
        });
        
        /**
         * The xy coordinates of the element.
         * @config xy
         * @type Array
         */
         
        this.register('visible', {
            value: map.visible || null, 
            method: function(value) {
                if (value) {
                    Dom.setStyle(element, 'visibility', 'visible');
                } else {
                    Dom.setStyle(element, 'visibility', 'hidden');
                }
            },
            validator: Lang.isBoolean
        });
    },

    addListener: function(type, fn, obj, override) {
        var el = this.get('element');
        
        el = this.get('id') || el;
        
        if (!this._events[type]) { // create on the fly
            if ( this.DOM_EVENTS[type] ) {
                YAHOO.util.Event.addListener(el, type, function(e) {
                    this.fireEvent(type, e);
                }, this, true);
            }
            
            this.createEvent(type, this);
            this._events[type] = true;
        }
        
        this.subscribe.apply(this, arguments); // notify via customEvent
    },
    
    on: function() { this.addListener.apply(this, arguments); },
    
    removeListener: function(type, fn, obj, override) {
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
    
    mutationEvent: function() {},
    
	/**
     * Apply any queued set calls.
	 * @method fireQueue
	 */
    fireQueue: function() {
        var queue = this._queue;
        for (var key in queue) {
            this.set.apply(this, queue[key]);
        }
    },
    
	/**
     * Renders the HTMLElement into either the supplied parentNode or
     * the document.body.
	 * @method render
	 * @param {HTMLElement | Element} parentNode The node to append to
	 * @param {HTMLElement | Element} before An optional node to insert before
	 */
    appendTo: function(parent, before) {
        parent = (parent.get) ?  parent.get('element') : Dom.get(parent);
                
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
        
        this.refresh( this.getConfigKeys() );
        YAHOO.log(element + 'appended to ' + parent);
    },
    
    get: function(key) {
        var configs = this._configs || {};
        var el = configs.element;
        
        if (el && !configs[key] && !Lang.isUndefined(el.value[key]) ) {
            return el.value[key];
        }

        return AttributeProvider.prototype.get.call(this, key);
    },

    set: function(key, value, silent) {
        var el = this.get('element');
        if (!el) {
            this._queue[key] = arguments;
            return false;
        }
        
        // set it on the element if not a property
        if ( !this._configs[key] && !Lang.isUndefined(el[key]) ) {
            registerHTMLAttr(this, key);
        }

        return AttributeProvider.prototype.set.apply(this, arguments);
    },
    
    register: function(key) { // protect html properties
        var configs = this._configs || {};
        var element = configs.element || null;
        
        if ( element && !Lang.isUndefined(element[key]) ) {
            YAHOO.log(key + ' is reserved for ' + element, 
                    'error', 'Element');
            return false;
        }
        
        return AttributeProvider.prototype.register.apply(this, arguments);
    },
    
    configure: function(property, map, init) { // protect html properties
        if (!this._configs[property] && this._configs.element && 
                !Lang.isUndefined(this._configs.element[property]) ) {
            registerHTMLAttr(this, property, map);
            return false;
        }
        
        return AttributeProvider.prototype.configure.apply(this, arguments);
    },
    
    getConfigKeys: function() {
        var el = this.get('element');
        var keys = AttributeProvider.prototype.getConfigKeys.call(this);
        
        //add any unconfigured element keys
        for (var key in el) {
            if (!this._configs[key]) {
                keys[key] = keys[key] || el[key];
            }
        }
        
        return keys;
    },
    
    init: function(el, properties) {
        this._queue = {};
        this._events = {};
        this._configs = {};
        properties = properties || {};
        properties.element = el;
        
        var self = this;
        
        var readyHandler = function() {
            self.initConfigs(properties);
            self.setValues(properties, true);
            self.fireQueue();
            self.fireEvent('contentReady');
        };

        if ( Lang.isString(el) ) {
            registerHTMLAttr(this, 'id', { value: el });
            YAHOO.util.Event.onAvailable(el, function() {
                self.fireEvent('available'); 
                properties.element = Dom.get(el);
            });
            
            YAHOO.util.Event.onContentReady(el, function() {
                readyHandler();
            });
        } else {
            readyHandler();
        }        
    }
};

/**
 * Sets the value of the property and fires beforeChange and change events.
 * @private
 * @method registerHTMLAttr
 * @param {YAHOO.util.Element} element The Element instance to
 * register the config to.
 * @param {String} key The name of the config to register
 * @param {Object} map A key-value map of the config's params
 */
var registerHTMLAttr = function(self, key, map) {
    var el = self.get('element');
    map = map || {};
    map.name = key;
    map.method = map.method || function(value) {
        el[key] = value;
    };
    map.value = map.value || el[key];
    self._configs[key] = new YAHOO.util.Attribute(map, self);
};


YAHOO.augment(Element, AttributeProvider);
YAHOO.util.Element = Element;
})();