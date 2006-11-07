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
YAHOO.util.Element = function(el, map) {
    if (arguments.length) {
        this.init(el, map);
    }
};

YAHOO.util.Element.prototype = {
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
     * Registers Element specific attribute.
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
        this.register('element', {
            value: element,
            readOnly: true
         });
        
        /**
         * Whether or not the element is visible.
         * @config visible
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
    
	/**
     * Apply any queued set calls.
	 * @method fireQueue
	 */
    fireQueue: function() {
        var queue = this._queue;
        for (var key in queue) {
            this[queue[key][0]].apply(this, queue[key][1]);
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
    
    register: function(key) { // protect html properties
        var configs = this._configs || {};
        var element = this.get('element') || null;
        
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
            _registerHTMLAttr(this, property, map);
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
    
    init: function(el, attr) {
        this._queue = this._queue || {};
        this._events = this._events || {};
        this._configs = this._configs || {};
        attr = attr || {};
        attr.element = attr.element || el || null;
        
        var readyHandler = function() {
            this.initConfigs(attr);
            this.setValues(attr, true); // TODO: set HTMLElement attrs
            this.fireQueue();
            this.fireEvent('contentReady');
        };

        if ( Lang.isString(el) ) {
            _registerHTMLAttr(this, 'id', { value: el });
            YAHOO.util.Event.onAvailable(el, function() {
                this.fireEvent('available'); 
                attr.element = Dom.get(el);
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


YAHOO.augment(YAHOO.util.Element, AttributeProvider);
})();