/**
 * @description <p>Provides a fixed layout containing, top, bottom, left, right and center layout units. It can be applied to either the body or an element.</p>
 * @namespace YAHOO.widget
 * @requires yahoo, dom, element, event
 * @module layout
 * @beta
 */
(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        Lang = YAHOO.lang;

    /**
     * @constructor
     * @class Layout
     * @extends YAHOO.util.Element
     * @description <p>Provides a fixed layout containing, top, bottom, left, right and center layout units. It can be applied to either the body or an element.</p>
     * @param {String/HTMLElement} el The element to make contain a layout.
     * @param {Object} attrs Object liternal containing configuration parameters.
    */

    var Layout = function(el, config) {
        YAHOO.log('Creating the Layout Object', 'info', 'Layout');
        if (Lang.isObject(el) && !el.tagName) {
            config = el;
            el = null;
        }
        if (Lang.isString(el)) {
            if (Dom.get(el)) {
                el = Dom.get(el);
            }
        }
        if (!el) {
            el = document.body;
        }

        var oConfig = {
            element: el,
            attributes: config || {}
        };

        Layout.superclass.constructor.call(this, oConfig.element, oConfig.attributes);    
    };

    /**
    * @private
    * @static
    * @property _instances
    * @description Internal hash table for all layout instances
    * @type Object
    */ 
    Layout._instances = {};
    /**
    * @static
    * @method getLayoutById 
    * @description Get's a layout object by the HTML id of the element associated with the Layout object.
    * @return {Object} The Layout Object
    */ 
    Layout.getLayoutById = function(id) {
        if (Layout._instances[id]) {
            return Layout._instances[id];
        }
        return false;
    };

    YAHOO.extend(Layout, YAHOO.util.Element, {
        /**
        * @property browser
        * @description A modified version of the YAHOO.env.ua object
        * @type Object
        */
        browser: function() {
            var b = YAHOO.env.ua;
            b.standardsMode = false;
            b.secure = false;
            return b;
        }(),
        /**
        * @private
        * @property _rendered
        * @description Set to true when the layout is rendered
        * @type Boolean
        */
        _rendered: null,
        /**
        * @private
        * @property _zIndex
        * @description The zIndex to set all LayoutUnits to
        * @type Number
        */
        _zIndex: null,
        /**
        * @private
        * @property _sizes
        * @description A collection of the current sizes of all usable LayoutUnits to be used for calculations
        * @type Object
        */
        _sizes: null,
        /**
        * @private
        * @method _setBodySize
        * @param {Boolean} set If set to false, it will NOT set the size, just perform the calculations (used for collapsing units)
        * @description Used to set the body size of the layout, sets the height and width of the parent container
        */
        _setBodySize: function(set) {
            var h = 0, w = 0;
            set = ((set === false) ? false : true);

            if (this._isBody) {
                h = Dom.getClientHeight();
                w = Dom.getClientWidth();
            } else {
                h = parseInt(this.getStyle('height'), 10);
                w = parseInt(this.getStyle('width'), 10);
                if (isNaN(w)) {
                    w = this.get('element').clientWidth;
                }
                if (isNaN(h)) {
                    h = this.get('element').clientHeight;
                }
            }
            if (this.get('minWidth')) {
                if (w < this.get('minWidth')) {
                    w = this.get('minWidth');
                }
            }
            if (this.get('minHeight')) {
                if (h < this.get('minHeight')) {
                    h = this.get('minHeight');
                }
            }
            if (set) {
                Dom.setStyle(this._doc, 'height', h + 'px');
                Dom.setStyle(this._doc, 'width', w + 'px');
            }
            this._sizes.doc = { h: h, w: w };
            YAHOO.log('Setting Body height and width: (' + h + ',' + w + ')', 'info', 'Layout');
            this._setSides(set);
        },
        /**
        * @private
        * @method _setSides
        * @param {Boolean} set If set to false, it will NOT set the size, just perform the calculations (used for collapsing units)
        * @description Used to set the size and position of the left, right, top and bottom units
        */
        _setSides: function(set) {
            YAHOO.log('Setting side units', 'info', 'Layout');
            var h1 = ((this._top) ? this._top.get('height') : 0),
                h2 = ((this._bottom) ? this._bottom.get('height') : 0),
                h = this._sizes.doc.h,
                w = this._sizes.doc.w;
            set = ((set === false) ? false : true);

            this._sizes.top = {
                h: h1, w: ((this._top) ? w : 0),
                t: 0
            };
            this._sizes.bottom = {
                h: h2, w: ((this._bottom) ? w : 0)
            };
            
            var newH = (h - (h1 + h2));

            this._sizes.left = {
                h: newH, w: ((this._left) ? this._left.get('width') : 0)
            };
            this._sizes.right = {
                h: newH, w: ((this._right) ? this._right.get('width') : 0),
                l: ((this._right) ? (w - this._right.get('width')) : 0),
                t: ((this._top) ? this._sizes.top.h : 0)
            };
            
            if (this._right && set) {
                this._right.set('top', this._sizes.right.t);
                if (!this._right._collapsing) { 
                    this._right.set('left', this._sizes.right.l);
                }
                this._right.set('height', this._sizes.right.h, true);
            }
            if (this._left) {
                this._sizes.left.l = 0;
                if (this._top) {
                    this._sizes.left.t = this._sizes.top.h;
                } else {
                    this._sizes.left.t = 0;
                }
                if (set) {
                    this._left.set('top', this._sizes.left.t);
                    this._left.set('height', this._sizes.left.h, true);
                    this._left.set('left', 0);
                }
            }
            if (this._bottom) {
                this._sizes.bottom.t = this._sizes.top.h + this._sizes.left.h;
                if (set) {
                    this._bottom.set('top', this._sizes.bottom.t);
                    this._bottom.set('width', this._sizes.bottom.w, true);
                }
            }
            if (this._top) {
                if (set) {
                    this._top.set('width', this._sizes.top.w, true);
                }
            }
            YAHOO.log('Setting sizes: (' + Lang.dump(this._sizes) + ')', 'info', 'Layout');
            this._setCenter(set);
        },
        /**
        * @private
        * @method _setCenter
        * @param {Boolean} set If set to false, it will NOT set the size, just perform the calculations (used for collapsing units)
        * @description Used to set the size and position of the center unit
        */
        _setCenter: function(set) {
            set = ((set === false) ? false : true);
            var h = this._sizes.left.h;
            var w = (this._sizes.doc.w - (this._sizes.left.w + this._sizes.right.w));
            if (set) {
                this._center.set('height', h, true);
                this._center.set('width', w, true);
                this._center.set('top', this._sizes.top.h);
                this._center.set('left', this._sizes.left.w);
            }
            this._sizes.center = { h: h, w: w, t: this._sizes.top.h, l: this._sizes.left.w };
            YAHOO.log('Setting Center size to: (' + h + ', ' + w + ')', 'info', 'Layout');
        },
        /**
        * @method getSizes
        * @description Get a reference to the internal Layout Unit sizes
        * @return {Object} An object of the layout unit sizes
        */
        getSizes: function() {
            return this._sizes;
        },
        /**
        * @method getUnitById
        * @param {String} id The HTML element id of the unit
        * @description Get the LayoutUnit by it's HTML id
        * @return {<a href="YAHOO.widget.LayoutUnit.html">YAHOO.widget.LayoutUnit</a>} The LayoutUnit instance
        */
        getUnitById: function(id) {
            return YAHOO.widget.LayoutUnit.getLayoutUnitById(id);
        },
        /**
        * @method getUnitByPosition
        * @param {String} pos The position of the unit in this layout
        * @description Get the LayoutUnit by it's position in this layout
        * @return {<a href="YAHOO.widget.LayoutUnit.html">YAHOO.widget.LayoutUnit</a>} The LayoutUnit instance
        */
        getUnitByPosition: function(pos) {
            if (pos) {
                pos = pos.toLowerCase();
                if (this['_' + pos]) {
                    return this['_' + pos];
                }
            }
            return false;
        },
        /**
        * @method removeUnit
        * @param {Object} unit The LayoutUnit that you want to remove
        * @description Remove the unit from this layout and resize the layout.
        */
        removeUnit: function(unit) {
            this['_' + unit.get('position')] = null;
            this.resize();
        },
        /**
        * @method addUnit
        * @param {Object} cfg The config for the LayoutUnit that you want to add
        * @description Add a unit to this layout and if the layout is rendered, resize the layout. 
        * @return {<a href="YAHOO.widget.LayoutUnit.html">YAHOO.widget.LayoutUnit</a>} The LayoutUnit instance
        */
        addUnit: function(cfg) {
            if (!cfg.position) {
                YAHOO.log('No position property passed', 'error', 'Layout');
                return false;
            }
            if (this['_' + cfg.position]) {
                YAHOO.log('Position already exists', 'error', 'Layout');
                return false;
            }
            YAHOO.log('Adding Unit at position: ' + cfg.position, 'info', 'Layout');
            var element = null,
                el = null;

            if (cfg.id) {
                if (Dom.get(cfg.id)) {
                    element = Dom.get(cfg.id);
                    delete cfg.id;

                }
            }
            if (cfg.element) {
                element = cfg.element;
            }

            if (!el) {
                el = document.createElement('div');
                var id = Dom.generateId();
                el.id = id;
            }

            if (!element) {
                element = document.createElement('div');
            }
            Dom.addClass(element, 'yui-layout-wrap');
            if (this.browser.ie && !this.browser.standardsMode) {
                el.style.zoom = 1;
                element.style.zoom = 1;
            }

            if (el.firstChild) {
                el.insertBefore(element, el.firstChild);
            } else {
                el.appendChild(element);
            }
            this._doc.appendChild(el);

            var h = false, w = false;

            if (cfg.height) {
                h = parseInt(cfg.height, 10);
            }
            if (cfg.width) {
                w = parseInt(cfg.width, 10);
            }
            var unitConfig = {};
            YAHOO.lang.augmentObject(unitConfig, cfg); // break obj ref

            unitConfig.parent = this;
            unitConfig.wrap = element;
            unitConfig.height = h;
            unitConfig.width = w;

            var unit = new YAHOO.widget.LayoutUnit(el, unitConfig);

            unit.on('heightChange', this.resize, this, true);
            unit.on('widthChange', this.resize, this, true);
            unit.on('gutterChange', this.resize, this, true);
            this['_' + cfg.position] = unit;

            if (this._rendered) {
                this.resize();
            }

            return unit;
        },
        /**
        * @private
        * @method _createUnits
        * @description Private method to create units from the config that was passed in.
        */
        _createUnits: function() {
            var units = this.get('units');
            for (var i in units) {
                if (Lang.hasOwnProperty(units, i)) {
                    this.addUnit(units[i]);
                }
            }
        },
        /**
        * @method resize
        * @param {Boolean} set If set to false, it will NOT set the size, just perform the calculations (used for collapsing units)
        * @description Starts the chain of resize routines that will resize all the units.
        * @return {<a href="YAHOO.widget.Layout.html">YAHOO.widget.Layout</a>} The Layout instance
        */
        resize: function(set) {
            set = ((set === false) ? false : true);
            if (set) {
                var retVal = this.fireEvent('beforeResize');
                if (retVal === false) {
                    set = false;
                }
                if (this.browser.ie) {
                    if (this._isBody) {
                        Dom.removeClass(document.documentElement, 'yui-layout');
                        Dom.addClass(document.documentElement, 'yui-layout');
                    } else {
                        this.removeClass('yui-layout');
                        this.addClass('yui-layout');
                    }
                }
            }
            this._setBodySize(set);
            if (set) {
                this.fireEvent('resize', { target: this, sizes: this._sizes });
            }
            return this;
        },
        /**
        * @private
        * @method _setupBodyElements
        * @description Sets up the main doc element when using the body as the main element.
        */
        _setupBodyElements: function() {
            this._doc = Dom.get('layout-doc');
            if (!this._doc) {
                this._doc = document.createElement('div');
                this._doc.id = 'layout-doc';
                if (document.body.firstChild) {
                    document.body.insertBefore(this._doc, document.body.firstChild);
                } else {
                    document.body.appendChild(this._doc);
                }
            }
            this._createUnits();
            this._setBodySize();
            Event.on(window, 'resize', this.resize, this, true);
            Dom.addClass(this._doc, 'yui-layout-doc');
        },
        /**
        * @private
        * @method _setupElements
        * @description Sets up the main doc element when not using the body as the main element.
        */
        _setupElements: function() {
            this._doc = this.getElementsByClassName('doc')[0];
            if (!this._doc) {
                this._doc = document.createElement('div');
                this.get('element').appendChild(this._doc);
            }
            this._createUnits();
            this._setBodySize();
            Event.on(window, 'resize', this.resize, this, true);
            Dom.addClass(this._doc, 'yui-layout-doc');
        },
        /**
        * @private
        * @property _isBody
        * @description Flag to determine if we are using the body as the root element.
        * @type Boolean
        */
        _isBody: null,
        /**
        * @private
        * @property _doc
        * @description Reference to the root element
        * @type HTMLElement
        */
        _doc: null,
        /**
        * @private
        * @property _left
        * @description Reference to the left LayoutUnit Object
        * @type {<a href="YAHOO.widget.LayoutUnit.html">YAHOO.widget.LayoutUnit</a>} A LayoutUnit instance
        */
        _left: null,
        /**
        * @private
        * @property _right
        * @description Reference to the right LayoutUnit Object
        * @type {<a href="YAHOO.widget.LayoutUnit.html">YAHOO.widget.LayoutUnit</a>} A LayoutUnit instance
        */
        _right: null,
        /**
        * @private
        * @property _top
        * @description Reference to the top LayoutUnit Object
        * @type {<a href="YAHOO.widget.LayoutUnit.html">YAHOO.widget.LayoutUnit</a>} A LayoutUnit instance
        */
        _top: null,
        /**
        * @private
        * @property _bottom
        * @description Reference to the bottom LayoutUnit Object
        * @type {<a href="YAHOO.widget.LayoutUnit.html">YAHOO.widget.LayoutUnit</a>} A LayoutUnit instance
        */
        _bottom: null,
        /**
        * @private
        * @property _center
        * @description Reference to the center LayoutUnit Object
        * @type {<a href="YAHOO.widget.LayoutUnit.html">YAHOO.widget.LayoutUnit</a>} A LayoutUnit instance
        */
        _center: null,
        /**
        * @private
        * @method init
        * @description The Layout class' initialization method
        */        
        init: function(p_oElement, p_oAttributes) {
            YAHOO.log('init', 'info', 'Layout');
            this._zIndex = 0;
            Layout.superclass.init.call(this, p_oElement, p_oAttributes);
            
            if (this.get('parent')) {
                this._zIndex = this.get('parent')._zIndex + 10;
            }

            this._sizes = {};

            var id = p_oElement;
            if (!Lang.isString(id)) {
                id = Dom.generateId(id);
            }
            Layout._instances[id] = this;
        },
        /**
        * @method render
        * @description This method starts the render process, applying classnames and creating elements
        * @return {<a href="YAHOO.widget.Layout.html">YAHOO.widget.Layout</a>} The Layout instance
        */        
        render: function() {
            YAHOO.log('Render', 'info', 'Layout');
            this._stamp();
            var el = this.get('element');
            if (el && el.tagName && (el.tagName.toLowerCase() == 'body')) {
                this._isBody = true;
                Dom.addClass(document.body, 'yui-layout');
                if (Dom.hasClass(document.body, 'yui-skin-sam')) {
                    //Move the class up so we can have a css chain
                    Dom.addClass(document.documentElement, 'yui-skin-sam');
                    Dom.removeClass(document.body, 'yui-skin-sam');
                }
                this._setupBodyElements();
            } else {
                this._isBody = false;
                this.addClass('yui-layout');
                this._setupElements();
            }
            this.resize();
            this._rendered = true;
            this.fireEvent('render');

            return this;
        },
        /**
        * @private
        * @method _stamp
        * @description Stamps the root node with a secure classname for ease of use. Also sets the this.browser.standardsMode variable.
        */        
        _stamp: function() {
            if (document.compatMode == 'CSS1Compat') {
                this.browser.standardsMode = true;
            }
            if (window.location.href.toLowerCase().indexOf("https") === 0) {
                Dom.addClass(document.documentElement, 'secure');
                this.browser.secure = true;
            }
        },
        /**
        * @private
        * @method initAttributes
        * @description Processes the config
        */        
        initAttributes: function(attr) {
            Layout.superclass.initAttributes.call(this, attr);
            /**
            * @attribute units
            * @description An array of config definitions for the LayoutUnits to add to this layout
            * @type Array
            */
            this.setAttributeConfig('units', {
                writeOnce: true,
                validator: YAHOO.lang.isArray,
                value: attr.units || []
            });

            /**
            * @attribute minHeight
            * @description The minimum height in pixels
            * @type Number
            */
            this.setAttributeConfig('minHeight', {
                value: attr.minHeight || false,
                validator: YAHOO.lang.isNumber
            });

            /**
            * @attribute minWidth
            * @description The minimum width in pixels
            * @type Number
            */
            this.setAttributeConfig('minWidth', {
                value: attr.minWidth || false,
                validator: YAHOO.lang.isNumber
            });

            /**
            * @attribute height
            * @description The height in pixels
            * @type Number
            */
            this.setAttributeConfig('height', {
                value: attr.height || false,
                validator: YAHOO.lang.isNumber,
                method: function(h) {
                    this.setStyle('height', h + 'px');
                }
            });

            /**
            * @attribute width
            * @description The width in pixels
            * @type Number
            */
            this.setAttributeConfig('width', {
                value: attr.width || false,
                validator: YAHOO.lang.isNumber,
                method: function(w) {
                    this.setStyle('width', w + 'px');
                }
            });

            /**
            * @attribute parent
            * @description If this layout is to be used as a child of another Layout instance, this config will bind the resize events together.
            * @type Object YAHOO.widget.Layout
            */
            this.setAttributeConfig('parent', {
                writeOnce: true,
                value: attr.parent || false,
                method: function(p) {
                    if (p) {
                        p.on('resize', this.resize, this, true);
                    }
                }
            });
        },
        /**
        * @method toString
        * @description Returns a string representing the Layout.
        * @return {String}
        */        
        toString: function() {
            if (this.get) {
                return 'Layout #' + this.get('id');
            }
            return 'Layout';
        }
    });
    /**
    * @event resize
    * @description Fired when this.resize is called
    * @type YAHOO.util.CustomEvent
    */
    /**
    * @event startResize
    * @description Fired when the Resize Utility for a Unit fires it's startResize Event.
    * @type YAHOO.util.CustomEvent
    */
    /**
    * @event beforeResize
    * @description Firef at the beginning of the resize method. If you return false, the resize is cancelled.
    * @type YAHOO.util.CustomEvent
    */
    /**
    * @event render
    * @description Fired after the render method completes.
    * @type YAHOO.util.CustomEvent
    */

    YAHOO.widget.Layout = Layout;
})();
