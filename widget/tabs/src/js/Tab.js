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
    YAHOO.widget.Tab = function(element, properties) {
        YAHOO.widget.Tab.superclass.constructor.apply(this, arguments);
    };
    
    YAHOO.extend(YAHOO.widget.Tab, YAHOO.util.Element);
    var proto = YAHOO.widget.Tab.prototype;
    
    /**
     * Adds the active className to the element and updates the childNodes to 
     * reflect the active state of the element.
     * @method focus
     * @private
     * @param {YAHOO.widget.Tab} tab The tab instance to give focus
     * @return void
     */
    var focus = function(tab) {
        var el = tab.get('element');
        var panel = tab.get('panel');
        var inner = tab.getElementsByTagName(tab.LABEL_INNER_TAGNAME)[0];
        var active = tab.getElementsByTagName(tab.ACTIVE_LABEL_INNER_TAGNAME)[0];

        tab.getElementsByTagName(tab.LABEL_TAGNAME)[0].removeAttribute('tabindex');
        if (panel) {
            tab.showContent();
        }
        
        if (active) {
            return;  // nothing left to do if already active
        }

        // insert the active element around the inner element
        tab.addClass(tab.ACTIVE_CLASSNAME);
        active = document.createElement(tab.ACTIVE_LABEL_INNER_TAGNAME);
        active.appendChild(inner);
        el.getElementsByTagName(tab.LABEL_TAGNAME)[0].appendChild(active);
    };
    
    /**
     * Removes the active className from the element and updates the childNodes 
     * to reflect the normal state of the element.
     * @method blur
     * @private
     * @param {YAHOO.widget.Tab} tab The tab instance to blur
     * @return void
     */
    var blur = function(tab) {
        var el = tab.get('element');
        var panel = tab.get('panel');
        tab.removeClass(tab.ACTIVE_CLASSNAME);
        var anchor = tab.getElementsByTagName(tab.LABEL_TAGNAME)[0];
        var active = tab.getElementsByTagName(tab.ACTIVE_LABEL_INNER_TAGNAME)[0]; // TODO: abstract
        var inner = tab.getElementsByTagName(tab.LABEL_INNER_TAGNAME)[0];
        if (active) {
            anchor.replaceChild(inner, active);
        }
        
        anchor.setAttribute('tabindex', -1);
        
        if (panel) {
            tab.hideContent();
        }
    };
    
	/**
     * The default tag name for a Tab's element.
	 * @property TAGNAME
	 * @type String
     * @default 'li'
	 */
    proto.TAGNAME = 'li';
    
	/**
     * The default tag name for a Tab's label element.
	 * @property LABEL_TAGNAME
	 * @type String
     * @default 'a'
	 */
	proto.LABEL_TAGNAME = 'a';
    
	/**
     * The default tag name for a Tab's label element.
	 * @property LABEL_TAGNAME
	 * @type String
     * @default 'a'
	 */
	proto.LABEL_CLASSNAME = '';
    
	/**
     * The default tag name for a Tab's label's inner element.
	 * @property LABEL_INNER_TAGNAME
	 * @type String
     * @default 'em'
	 */
    proto.LABEL_INNER_TAGNAME = 'em';
    
	/**
     * The default tag name for a Tab's label's active inner element.
     * This element is placed around the label's inner element.
	 * @property ACTIVE_LABEL_INNER_TAGNAME
	 * @type String
     * @default 'strong'
	 */
    proto.ACTIVE_LABEL_INNER_TAGNAME = 'strong';
    
	/**
     * The default tag name for a Tab's label's content element.
	 * @property CONTENT_TAGNAME
	 * @type String
     * @default 'div'
	 */
	proto.PANEL_TAGNAME = 'div';
    
	/**
     * The default tag name for a Tab's label element.
	 * @property LABEL_TAGNAME
	 * @type String
     * @default 'a'
	 */
	proto.PANEL_CLASSNAME = '';
    
	/**
     * The class name applied to active tabs.
	 * @property ACTIVE_CLASSNAME
	 * @type String
     * @default 'on'
	 */
    proto.ACTIVE_CLASSNAME = 'on';
    
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
    
    proto.hideContent = function() {
        this.get('panel').set('visible', false);
    };
    
    proto.showContent = function(callback) {
        if ( this.get('dataUrl') ) {
            this.loadData(callback);
        }
        
        this.get('panel').set('visible', true);
    };
    
    proto.loadData = function() {
        var el = this.get('panel').get('element');

        if (!YAHOO.util.Connect) {
            YAHOO.log('YAHOO.util.Connect not available', 'error', 'Tab');
            return false;
        }
        
        if ( !this.get('loadHandler') ) {
            callback = {
                success: function(o) {
                    el.innerHTML = o.responseText;
                }
            }
        }
        
        var conn = YAHOO.util.Connect.asyncRequest('GET', this.get('dataUrl'), callback, null); 
    };
    
    /**
     * Registers TabView specific properties.
     * @method initProperties
     * @param {Object} properties Hash of initial properties
     */
    proto.initConfigs = function(properties) {
        properties = properties || {};
        YAHOO.widget.Tab.superclass.initConfigs.apply(this, arguments);
        
        var el = this.get('element');
        
        var label = properties.label || '';
        var panel = properties.panel || '';
        
        if (!label) { // try and get by class or tag name
            label = Dom.getElementsByClassName(el, this.LABEL_CLASSNAME,
                            this.LABEL_TAGNAME, el)[0] ||
                    el.getElementsByTagName(this.LABEL_TAGNAME)[0];

            if (!label) {
                label = document.createElement(this.LABEL_TAGNAME);
                if (this.LABEL_CLASSNAME) {
                    label.set('className') = this.LABEL_CLASSNAME;
                }
            }

            label = new YAHOO.widget.TabLabel(label);
        }
        
        if (!panel) { // try and get by class or tag name

            panel = Dom.getElementsByClassName(el, 
                            this.PANEL_CLASSNAME,
                            this.PANEL_TAGNAME, el)[0] ||
                    el.getElementsByTagName(this.PANEL_TAGNAME)[0];
            
            if (!panel) {
                panel = document.createElement(this.PANEL_TAGNAME);
                if (this.PANEL_CLASSNAME) {
                    panel.set('className') = this.PANEL_CLASSNAME;
                }
            }

            panel = new YAHOO.widget.TabPanel(panel);

        }

        if ( !this.hasClass(this.ACTIVE_CLASSNAME) ) {
            this.getElementsByTagName(this.LABEL_TAGNAME)[0].tabIndex = -1;
        }
        
        /**
         * Whether or not the tab is currently active
         * @config active
         * @type Boolean
         */
        this.register('active', {
            value: properties.active || this.hasClass(this.ACTIVE_CLASSNAME),
            method: function(value) {
                if (value === true) {
                    focus(this);
                } else {
                    blur(this);
                }
            },
            validator: Lang.isBoolean
        });
        
        /**
         * The tabIndex of the tab's label element.
         * Inactive tabs are taken out of tab order (value set to -1).
         * @config tabIndex
         * @type Number
         */
        this.configure('tabIndex', {
            value: this.getElementsByTagName(this.LABEL_TAGNAME)[0].tabIndex,
            method: function(value) {
                this.getElementsByTagName(this.LABEL_TAGNAME)[0].tabIndex = value;
            },
            validator: Lang.isNumber
        });
        
        // create label element if content provided
        if (properties.label) {
            this.getElementsByTagName(this.LABEL_INNER_TAGNAME)[0].innerHTML =
                    properties.label;
        }
        
        /**
         * The tab's content element.
         * @config diabled
         * @type Boolean
         * @default false
         */
        this.register('disabled', {
            value: properties.disabled|| false,
            validator: Lang.isBoolean
        });
        
        /**
         * The tab's label text (or innerHTML).
         * @config label
         * @type String
         */
        this.register('label', {
            value: label,
            readOnly: true
        });
        
        /**
         * The tab's content element.
         * @config contentElement
         * @type HTMLElement
         */
        this.register('panel', {
            value: panel, // TODO: map to ID?
            readOnly: true
        });
        
        /**
         * The tab's label text (or innerHTML).
         * @config label
         * @type String
         */
        this.register('dataUrl', {
            value: properties.dataUrl || null
        });
        
        this.on(this.ACTIVATION_EVENT, function() {
            this.set('active');
        });
    };
})();