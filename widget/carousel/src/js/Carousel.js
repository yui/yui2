/**
 *----------------------------------------------------------------------------
 * The Carousel module provides a widget for browsing among a set of like
 * objects represented pictorially.
 *
 * @module carousel
 * @requires yahoo, dom, event, element
 * @optional animation
 * @namespace YAHOO.widget
 * @title Carousel Widget
 *----------------------------------------------------------------------------
 */
(function () {

    /*
     * Private variables of the Carousel component
     */

    /* Some abbreviations to avoid lengthy typing and lookups. */
    var Carousel,
        Dom         = YAHOO.util.Dom,
        Event       = YAHOO.util.Event,
        JS          = YAHOO.lang;

    /**
     * The Carousel widget.
     *
     * @class Carousel
     * @extends YAHOO.util.Element
     * @constructor
     * @param el {HTMLElement | String} The HTML element that represents the
     * the container that houses the Carousel.
     * @param cfg {Object} (optional) The configuration values
     */
    YAHOO.widget.Carousel = function (el, cfg) {
        YAHOO.log("Component creation", WidgetName);

        YAHOO.widget.Carousel.superclass.constructor.call(this, el, cfg);
    }

    Carousel = YAHOO.widget.Carousel;

    /**
     * The widget name.
     * @private
     * @static
     */
    var WidgetName = "Carousel";

    /**
     * The internal table of Carousel instances.
     * @private
     * @static
     */
    var instances = {};

    /*
     * Custom events of the Carousel component
     */

    /**
     * @event afterScroll
     * @description Fires when the Carousel has scrolled to the previous or
     * next page.  Passes back the index of the first and last visible items in
     * the Carousel.  See
     * <a href="YAHOO.util.Element.html#addListener">Element.addListener</a>
     * for more information on listening for this event.
     * @type YAHOO.util.CustomEvent
     */
    var afterScrollEvent = "afterScroll";

    /**
     * @event beforeHide
     * @description Fires before the Carousel is hidden.  See
     * <a href="YAHOO.util.Element.html#addListener">Element.addListener</a>
     * for more information on listening for this event.
     * @type YAHOO.util.CustomEvent
     */
    var beforeHideEvent = "beforeHide";

    /**
     * @event beforePageChangeEvent
     * @description Fires when the Carousel is about to scroll to the previous
     * or next page.  Passes back the page number of the current page.  Note
     * that the first page number is zero.  See
     * <a href="YAHOO.util.Element.html#addListener">Element.addListener</a>
     * for more information on listening for this event.
     * @type YAHOO.util.CustomEvent
     */
    var beforePageChangeEvent = "beforePageChange";

    /**
     * @event beforeScrollEvent
     * @description Fires when the Carousel is about to scroll to the previous
     * or next page.  Passes back the index of the first and last visible items
     * in the Carousel and the direction (backward/forward) of the scroll.  See
     * <a href="YAHOO.util.Element.html#addListener">Element.addListener</a>
     * for more information on listening for this event.
     * @type YAHOO.util.CustomEvent
     */
    var beforeScrollEvent = "beforeScroll";

    /**
     * @event beforeShow
     * @description Fires when the Carousel is about to be shown.  See
     * <a href="YAHOO.util.Element.html#addListener">Element.addListener</a>
     * for more information on listening for this event.
     * @type YAHOO.util.CustomEvent
     */
    var beforeShowEvent = "beforeShow";

    /**
     * @event blur
     * @description Fires when the Carousel loses focus.  See
     * <a href="YAHOO.util.Element.html#addListener">Element.addListener</a>
     * for more information on listening for this event.
     * @type YAHOO.util.CustomEvent
     */
    var blurEvent = "blur";

    /**
     * @event focus
     * @description Fires when the Carousel gains focus.  See
     * <a href="YAHOO.util.Element.html#addListener">Element.addListener</a>
     * for more information on listening for this event.
     * @type YAHOO.util.CustomEvent
     */
    var focusEvent = "focus";

    /**
     * @event hide
     * @description Fires when the Carousel is hidden.  See
     * <a href="YAHOO.util.Element.html#addListener">Element.addListener</a>
     * for more information on listening for this event.
     * @type YAHOO.util.CustomEvent
     */
    var hideEvent = "hide";

    /**
     * @event itemAdded
     * @description Fires when an item has been added to the Carousel.  Passes
     * back the content of the item that would be added, the index at which the
     * item would be added, and the event itself.  See 
     * <a href="YAHOO.util.Element.html#addListener">Element.addListener</a>
     * for more information on listening for this event.
     * @type YAHOO.util.CustomEvent
     */
    var itemAddedEvent = "itemAdded";

    /**
     * @event itemRemoved
     * @description Fires when an item has been removed from the Carousel.
     * Passes back the content of the item that would be removed, the index
     * from which the item would be removed, and the event itself.  See 
     * <a href="YAHOO.util.Element.html#addListener">Element.addListener</a>
     * for more information on listening for this event.
     * @type YAHOO.util.CustomEvent
     */
    var itemRemovedEvent = "itemRemoved";

    /**
     * @event itemSelected
     * @description Fires when an item has been selected in the Carousel.
     * Passes back the index of the selected item in the Carousel.  Note, that
     * the index begins from zero.  See
     * <a href="YAHOO.util.Element.html#addListener">Element.addListener</a>
     * for more information on listening for this event.
     * @type YAHOO.util.CustomEvent
     */
    var itemSelectedEvent = "itemSelected";

    /**
     * @event loadItems
     * @description Fires when the Carousel needs more items to be loaded for
     * displaying them.  Passes back the first and last visible items in the
     * Carousel, and the number of items needed to be loaded.  See
     * <a href="YAHOO.util.Element.html#addListener">Element.addListener</a>
     * for more information on listening for this event.
     * @type YAHOO.util.CustomEvent
     */
    var loadItemsEvent = "loadItems";

    /**
     * @event navigationStateChange
     * @description Fires when the state of either one of the navigation
     * buttons are changed from enabled to disabled or vice versa.  Passes back
     * the state (true/false) of the previous and next buttons.  The value true
     * signifies the button is enabled, false signifies disabled.  See
     * <a href="YAHOO.util.Element.html#addListener">Element.addListener</a>
     * for more information on listening for this event.
     * @type YAHOO.util.CustomEvent
     */
    var navigationStateChangeEvent = "navigationStateChange";

    /**
     * @event pageChangeEvent
     * @description Fires after the Carousel has scrolled to the previous or
     * next page.  Passes back the page number of the current page.  Note
     * that the first page number is zero.  See
     * <a href="YAHOO.util.Element.html#addListener">Element.addListener</a>
     * for more information on listening for this event.
     * @type YAHOO.util.CustomEvent
     */
    var pageChangeEvent = "pageChange";

    /**
     * @event render
     * @description Fires when the Carousel is rendered.  See
     * <a href="YAHOO.util.Element.html#addListener">Element.addListener</a>
     * for more information on listening for this event.
     * @type YAHOO.util.CustomEvent
     */
    var renderEvent = "render";

    /**
     * @event show
     * @description Fires when the Carousel is shown.  See
     * <a href="YAHOO.util.Element.html#addListener">Element.addListener</a>
     * for more information on listening for this event.
     * @type YAHOO.util.CustomEvent
     */
    var showEvent = "show";

    /**
     * @event startAutoPlay
     * @description Fires when the auto play has started in the Carousel.  See
     * <a href="YAHOO.util.Element.html#addListener">Element.addListener</a>
     * for more information on listening for this event.
     * @type YAHOO.util.CustomEvent
     */
    var startAutoPlayEvent = "startAutoPlay";

    /**
     * @event stopAutoPlay
     * @description Fires when the auto play has been stopped in the Carousel.
     * See
     * <a href="YAHOO.util.Element.html#addListener">Element.addListener</a>
     * for more information on listening for this event.
     * @type YAHOO.util.CustomEvent
     */
    var stopAutoPlayEvent = "stopAutoPlay";

    /*
     * Static members and methods of the Carousel component
     */

    /**
     * Return the appropriate Carousel object based on the id associated with
     * the Carousel element or false if none match.
     * @method getById
     * @public
     * @static
     */
    Carousel.getById = function (id) {
        return instances[id] ? instances[id] : false;
    };

    YAHOO.extend(Carousel, YAHOO.util.Element, {

        /*
         * Internal variables used within the Carousel component
         */

        /**
         * The Carousel element.
         *
         * @property _carouselEl
         * @private
         */
        _carouselEl: null,

        /**
         * The Carousel clipping container element.
         *
         * @property _clipEl
         * @private
         */
        _clipEl: null,

        /**
         * The current first index of the Carousel.
         *
         * @property _firstItem
         * @private
         */
        _firstItem: 0,

        /**
         * Is the animation still in progress?
         *
         * @property _isAnimationInProgress
         * @private
         */
        _isAnimationInProgress: false,

        /**
         * Whether tabindex has been set?
         *
         * @property _isTabIndexSet
         * @private
         */
        _isTabIndexSet: false,

        /**
         * The table of items in the Carousel.
         * The numItems is the number of items in the Carousel, items being the
         * array of items in the Carousel.  The size is the size of a single
         * item in the Carousel.  It is cached here for efficiency (to avoid
         * computing the size multiple times).
         *
         * @property _itemsTable
         * @private
         */
        _itemsTable: null,

        /**
         * The Carousel navigation.
         *
         * @property _navEl
         * @private
         */
        _navEl: null,

        /**
         * Status of the next navigation item.
         *
         * @property _nextEnabled
         * @private
         */
        _nextEnabled: true,

        /**
         * The Carousel pages structure.
         * This is an object of the total number of pages and the current page.
         *
         * @property _pages
         * @private
         */
        _pages: {},

        /**
         * Status of the previous navigation item.
         *
         * @property _prevEnabled
         * @private
         */
        _prevEnabled: true,

        /**
         * Whether the Carousel size needs to be recomputed or not?
         *
         * @property _recomputeSize
         * @private
         */
        _recomputeSize: true,

        /*
         * CSS classes used by the Carousel component
         */
        
        CLASSES: {
            
            /**
             * The class name of the Carousel navigation buttons.
             *
             * @property BUTTON
             * @default "yui-carousel-button"
             */
            BUTTON: "yui-carousel-button",
            
            /**
             * The class name of the Carousel element.
             *
             * @property CAROUSEL
             * @default "yui-carousel"
             */
            CAROUSEL: "yui-carousel",

            /**
             * The class name of the Carousel's container element.
             *
             * @property CONTAINER
             * @default "yui-carousel-container"
             */
            CONTAINER: "yui-carousel-container",

            /**
             * The class name of the Carousel's container element.
             *
             * @property CONTENT
             * @default "yui-carousel-content"
             */
            CONTENT: "yui-carousel-content",
            
            /**
             * The class name of a disabled navigation button.
             *
             * @property DISABLED
             * @default "disabled"
             */
            DISABLED: "disabled",
            
            /**
             * The class name of the first Carousel navigation button.
             *
             * @property FIRST_BUTTON
             * @default " first"
             */
            FIRST_BUTTON: " first",
            
            /**
             * The class name of a first disabled navigation button.
             *
             * @property FIRST_DISABLED
             * @default "first-disabled"
             */
            FIRST_DISABLED: "first-disabled",

            /**
             * The class name of a horizontally oriented Carousel.
             *
             * @property HORIZONTAL
             * @default "yui-carousel-horizontal"
             */
            HORIZONTAL: "yui-carousel-horizontal",

            /**
             * The navigation element container class name.
             *
             * @property NAVIGATION
             * @default "yui-carousel-nav"
             */
            NAVIGATION: "yui-carousel-nav",

            /**
             * The class name of the next navigation link. This variable is not
             * only used for styling, but also for identifying the link within
             * the Carousel container.
             *
             * @property NEXT_PAGE
             * @default "yui-carousel-next"
             */
            NEXT_PAGE: "yui-carousel-next",

            /**
             * The class name for the navigation element container for pages.
             *
             * @property PAGE_NAV
             * @default "yui-carousel-pages"
             */
            PAGE_NAV: "yui-carousel-pages",

            /**
             * The class name for the navigation container for prev/next.
             *
             * @property NAV_CONTAINER
             * @default "yui-carousel-buttons"
             */
            NAV_CONTAINER: "yui-carousel-buttons",

            /**
             * The class name of the previous navigation link. This variable
             * is not only used for styling, but also for identifying the link
             * within the Carousel container.
             *
             * @property PREV_PAGE
             * @default "yui-carousel-prev"
             */
            PREV_PAGE: "yui-carousel-prev",

            /**
             * The class name of the selected item.
             *
             * @property SELECTED_ITEM
             * @default "yui-selected"
             */
            SELECTED_ITEM: "yui-carousel-selected",

            /**
             * The class name of a vertically oriented Carousel.
             *
             * @property VERTICAL
             * @default "yui-carousel-vertical"
             */
            VERTICAL: "yui-carousel-vertical",
            
            /**
             * The class name of the (vertical) Carousel's container element.
             *
             * @property VERTICAL_CONTAINER
             * @default "yui-carousel-vertical-container"
             */
            VERTICAL_CONTAINER: "yui-carousel-vertical-container",

            /**
             * The class name of a visible Carousel.
             *
             * @property VISIBLE
             * @default "yui-carousel-visible"
             */
            VISIBLE: "yui-carousel-visible"

        },

        /*
         * Configuration attributes for configuring the Carousel component
         */
        
        CONFIG: {

            /**
             * The offset of the first visible item in the Carousel.
             *
             * @property FIRST_VISIBLE
             * @default 0
             */
            FIRST_VISIBLE: 0,

            /**
             * The element to be used as the progress indicator when the item
             * is still being loaded.
             *
             * @property ITEM_LOADING
             * @default The progress indicator (spinner) image
             */
            ITEM_LOADING: "<img " +
                    "src=\"../../build/carousel/assets/ajax-loader.gif\" " +
                    "alt=\"Loading\" " +
                    "style=\"margin-top:-32px;position:relative;top:50%;\">",
            
            /**
             * The tag name of the Carousel item.
             *
             * @property ITEM_TAG_NAME
             * @default "LI"
             */
            ITEM_TAG_NAME: "LI",
            
            /**
             * The maximum number of pager buttons allowed beyond which the UI
             * of the pager would be a drop-down of pages instead of buttons.
             *
             * @property MAX_PAGER_BUTTONS
             * @default 5
             */
            MAX_PAGER_BUTTONS: 5,
            
            /**
             * The minimum width of the Carousel container to support the
             * navigation buttons.
             *
             * @property MIN_WIDTH
             * @default 99
             */
            MIN_WIDTH: 99,
            
            /**
             * The number of visible items in the Carousel.
             *
             * @property NUM_VISIBLE
             * @default 3
             */
            NUM_VISIBLE: 3,
            
            /**
             * The tag name of the Carousel.
             *
             * @property TAG_NAME
             * @default "OL"
             */
            TAG_NAME: "OL"
            
        },

        /*
         * Internationalizable strings in the Carousel component
         */
        
        STRINGS: {
            
            /**
             * The next navigation button name/text.
             *
             * @property NEXT_BUTTON_TEXT
             * @default "Next"
             */
            NEXT_BUTTON_TEXT: "Next",
            
            /**
             * The prefix text for the pager in case the UI is a drop-down.
             *
             * @property PAGER_PREFIX_TEXT
             * @default "Go to page "
             */
            PAGER_PREFIX_TEXT: "Go to page ",
            
            /**
             * The previous navigation button name/text.
             *
             * @property PREVIOUS_BUTTON_TEXT
             * @default "Previous"
             */
            PREVIOUS_BUTTON_TEXT: "Previous"
            
        },

        /*
         * Public methods of the Carousel component
         */

        /**
         * Insert or append an item to the Carousel.
         *
         * @method addItem
         * @public
         * @param item {String | Object | HTMLElement} The item to be appended
         * to the Carousel. If the parameter is a string, it is assumed to be
         * the content of the newly created item. If the parameter is an
         * object, it is assumed to supply the content and an optional class
         * and an optional id of the newly created item.
         * @param index {Number} optional The position to where in the list
         * (starts from zero).
         * @return {Boolean} Return true on success, false otherwise
         */
        addItem: function (item, index) {
            var className, content, el, elId, numItems = this.get("numItems");

            if (!item) {
                return false;
            }
            
            if (JS.isString(item) || item.nodeName) {
                content = item.nodeName ? item.innerHTML : item;
            } else if (JS.isObject(item)) {
                content = item.content;
            } else {
                YAHOO.log("Invalid argument to addItem", "error", WidgetName);
                return false;
            }
            
            className = item.className || "";
            elId      = item.id ? item.id : Dom.generateId();

            if (JS.isUndefined(index)) {
                this._itemsTable.items.push({
                        item      : content,
                        className : className,
                        id        : elId
                });
            } else {
                if (index < 0 || index >= numItems) {
                    YAHOO.log("Index out of bounds", "error", WidgetName);
                    return false;
                }
                this._itemsTable.items.splice(index, 0, {
                        item      : content,
                        className : className,
                        id        : elId
                });
            }
            this._itemsTable.numItems++;

            if (numItems < this._itemsTable.items.length) {
                this.set("numItems", this._itemsTable.items.length);
            }
            
            this.fireEvent(itemAddedEvent, { pos: index, ev: itemAddedEvent });

            return true;
        },

        /**
         * Insert or append multiple items to the Carousel.
         *
         * @method addItems
         * @public
         * @param items {Array} An array of items to be added with each item
         * representing an item, index pair [{item, index}, ...]
         * @return {Boolean} Return true on success, false otherwise
         */
        addItems: function (items) {
            var i, n, rv = true;

            if (!JS.isArray(items)) {
                return false;
            }

            for (i = 0, n = items.length; i < n; i++) {
                if (this.addItem(items[i][0], items[i][1]) === false) {
                    rv = false;
                }
            }

            return rv;
        },

        /**
         * Remove focus from the Carousel.
         *
         * @method blur
         * @public
         */
        blur: function () {
            this._carouselEl.blur();
            this.fireEvent(blurEvent);
        },

        /**
         * Clears the items from Carousel.
         *
         * @method clearItems
         * public
         */
        clearItems: function () {
            var n = this.get("numItems");
            
            while (n > 0) {
                this.removeItem(0);
                n--;
            }
        },

        /**
         * Set focus on the Carousel.
         *
         * @method focus
         * @public
         */
        focus: function () {
            this._carouselEl.focus();
            this.fireEvent(focusEvent);
        },

        /**
         * Hide the Carousel.
         *
         * @method hide
         * @public
         */
        hide: function () {
            if (this.fireEvent(beforeHideEvent) !== false) {
                this.removeClass(this.CLASSES.VISIBLE);
                this.fireEvent(hideEvent);
            }
        },
        
        /**
         * Initialize the Carousel.
         *
         * @method init
         * @public
         * @param el {HTMLElement | String} The html element that represents
         * the Carousel container.
         * @param attrs {Object} The set of configuration attributes for
         * creating the Carousel.
         */
        init: function (el, attrs) {
            var elId  = el,     // save for a rainy day
                parse = false;
            
            if (!el) {
                YAHOO.log(el + " is neither an HTML element, nor a string",
                        "error", WidgetName);
                return;                
            }
            
            this._itemsTable = { loading: {}, numItems: 0, items: [], size: 0 };
            YAHOO.log("Component initialization", WidgetName);

            if (JS.isString(el)) {
                el = Dom.get(el);
            } else if (!el.nodeName) {
                YAHOO.log(el + " is neither an HTML element, nor a string",
                        "error", WidgetName);
                return;
            }

            if (el) {
                if (!el.id) {   // in case the HTML element is passed
                    el.setAttribute("id", Dom.generateId());
                }
                this._parseCarousel(el);
                parse = true;
            } else {
                el = this._createCarousel(elId);
            }
            elId = el.id;
           
            Carousel.superclass.init.call(this, el, attrs);

            this.initEvents();
            
            if (parse) {
                this._parseCarouselItems();
            }

            if (!attrs || typeof attrs.isVertical == "undefined") {
                this.set("isVertical", false);
            }
            
            this._parseCarouselNavigation(el);
            this._navEl = setupCarouselNavigation.call(this);

            instances[elId] = this;

            loadItems.call(this);
        },
        
        /**
         * Initialize the configuration attributes used to create the Carousel.
         *
         * @method initAttributes
         * @public
         * @param attrs {Object} The set of configuration attributes for
         * creating the Carousel.
         */
        initAttributes: function (attrs) {
            Carousel.superclass.initAttributes.call(this, attrs);

            /**
             * @attribute currentPage
             * @description The current page number (read-only.)
             * @type Number
             */
            this.setAttributeConfig("currentPage", {
                    readOnly : true,
                    value    : 0
            });

            /**
             * @attribute firstVisible
             * @description The index to start the Carousel from (indexes begin
             * from zero)
             * @default 0
             * @type Number
             */
            this.setAttributeConfig("firstVisible", {
                    method    : this._setFirstVisible,
                    validator : this._validateFirstVisible,
                    value     : this.CONFIG.FIRST_VISIBLE
            });

            /**
             * @attribute numVisible
             * @description The number of visible items in the Carousel's
             * viewport.
             * @default 3
             * @type Number
             */
            this.setAttributeConfig("numVisible", {
                    method    : this._setNumVisible,
                    validator : this._validateNumVisible,
                    value     : this.CONFIG.NUM_VISIBLE
            });

            /**
             * @attribute numItems
             * @description The number of items in the Carousel.
             * @type Number
             */
            this.setAttributeConfig("numItems", {
                    method    : this._setNumItems,
                    validator : this._validateNumItems,
                    value     : this._itemsTable.numItems
            });

            /**
             * @attribute scrollIncrement
             * @description The number of items to scroll by for arrow keys.
             * @default 3
             * @type Number
             */
            this.setAttributeConfig("scrollIncrement", {
                    validator : this._validateScrollIncrement,
                    value     : 1
            });

            /**
             * @attribute selectedItem
             * @description The index of the selected item.
             * @type Number
             */
            this.setAttributeConfig("selectedItem", {
                    method    : this._setSelectedItem,
                    validator : JS.isNumber,
                    value     : 0
            });

            /**
             * @attribute revealAmount
             * @description The percentage of the item to be revealed on each
             * side of the Carousel (before and after the first and last item
             * in the Carousel's viewport.)
             * @default 0
             * @type Number
             */
            this.setAttributeConfig("revealAmount", {
                    method    : this._setRevealAmount,
                    validator : this._validateRevealAmount,
                    value     : 0
            });

            /**
             * @attribute isCircular
             * @description Set this to true to wrap scrolling of the contents
             * in the Carousel.
             * @default false
             * @type Boolean
             */
            this.setAttributeConfig("isCircular", {
                    validator : JS.isBoolean,
                    value     : false
            });

            /**
             * @attribute isVertical
             * @description True if the orientation of the Carousel is vertical
             * @default false
             * @type Boolean
             */
            this.setAttributeConfig("isVertical", {
                    method    : this._setOrientation,
                    validator : JS.isBoolean,
                    value     : false
            });

            /**
             * @attribute navigation
             * @description The set of navigation controls for Carousel
             * @default <br>
             * { prev: null, // the previous navigation element<br>
             *   next: null } // the next navigation element
             * @type Object
             */
            this.setAttributeConfig("navigation", {
                    method    : this._setNavigation,
                    validator : this._validateNavigation,
                    value     : { prev: null, next: null, page: null }
            });

            /**
             * @attribute animation
             * @description The optional animation attributes for the Carousel.
             * @default <br>
             * { speed: 0, // the animation speed (in seconds)<br>
             *   effect: null } // the animation effect (like
             *   YAHOO.util.Easing.easeOut)
             * @type Object
             */
            this.setAttributeConfig("animation", {
                    validator : this._validateAnimation,
                    value     : { speed: 0, effect: null }
            });

            /**
             * @attribute autoPlay
             * @description Set this to time in milli-seconds to have the
             * Carousel automatically scroll the contents.
             * @type Number
             */
            this.setAttributeConfig("autoPlay", {
                    validator : JS.isNumber,
                    value     : 0
            });
        },

        /**
         * Initialize and bind the event handlers.
         *
         * @method initEvents
         * @public
         */
        initEvents: function () {
            this.on.call(this, "keydown", keyboardEventHandler, this);
            
            this.subscribe(afterScrollEvent, syncNavigation);
            
            this.subscribe(itemAddedEvent, syncUI);
            this.subscribe(itemAddedEvent, syncNavigation);
            
            this.subscribe(itemRemovedEvent, syncUI);
            this.subscribe(itemRemovedEvent, syncNavigation);

            this.subscribe(itemSelectedEvent, setItemSelection);
            
            this.subscribe(loadItemsEvent, syncUI);
            
            this.subscribe(pageChangeEvent, syncPagerUI);

            this.subscribe(renderEvent, syncNavigation);
            this.subscribe(renderEvent, syncPagerUI);

            // Handle set focus
            this.on("click", setFocusHandler, this);

            // Handle item selection on mouse click
            this.on("click", itemClickHandler, this);

            // Handle page navigation
            this.on("click", pagerClickHandler, this);
        },

        /**
         * Return the item at index or null if the index is not found.
         *
         * @method getItem
         * @param index {Number} The index of the item to be returned
         * @public
         */
        getItem: function (index) {
            if (index < 0 || index >= this.get("numItems")) {
                YAHOO.log("Index out of bounds", "error", WidgetName);
                return null;
            }

            return this._itemsTable.numItems > index ?
                    this._itemsTable.items[index] : null;
        },

        /**
         * Return the position of the Carousel item that has the id "id", or -1
         * if the id is not found.
         *
         * @method getItemPositionById
         * @param index {Number} The index of the item to be returned
         * @public
         */
        getItemPositionById: function (id) {
            var i = 0, n = this._itemsTable.numItems;

            while (i < n) {
                if (this._itemsTable.items[i].id == id) {
                    return i;
                }
                i++;
            }

            return -1;
        },

        /**
         * Remove an item at index from the Carousel.
         *
         * @method removeItem
         * @public
         * @param index {Number} The position to where in the list (starts from
         * zero).
         * @return {Boolean} Return true on success, false otherwise
         */
        removeItem: function (index) {
            var item, num = this.get("numItems");

            if (index < 0 || index >= num) {
                YAHOO.log("Index out of bounds", "error", WidgetName);
                return false;
            }

            item = this._itemsTable.items.splice(index, 1);
            if (item && item.length == 1) {
                this.set("numItems", num - 1);

                this.fireEvent(itemRemovedEvent,
                        { item: item[0], pos: index, ev: itemRemovedEvent });
                return true;
            }

            return false;
        },

        /**
         * Render the Carousel.
         *
         * @method render
         * @public
         * @param appendTo {HTMLElement | String} The element to which the
         * Carousel should be appended prior to rendering.
         * @return {Boolean} Status of the operation
         */
        render: function (appendTo) {
            var config = this.CONFIG,
                cssClass = this.CLASSES,
                size;
            
            if (!this._clipEl) {
                this._clipEl = this._createCarouselClip();
                this._clipEl.appendChild(this._carouselEl);
            }
            
            if (appendTo) {
                this.appendChild(this._clipEl);
                this.appendTo(appendTo);
                setClipContainerSize.call(this);
            } else {
                if (!Dom.inDocument(this.get("element"))) {
                    YAHOO.log("Nothing to render. The container should be " +
                            "within the document if appendTo is not "       +
                            "specified", "error", WidgetName);
                    return false;
                }
                this.appendChild(this._clipEl);
            }
            
            if (this.get("isVertical")) {
                size = getCarouselItemSize.call(this);
                size = size < config.MIN_WIDTH ? config.MIN_WIDTH : size;
                this.setStyle("width",  size + "px");
                this.addClass(cssClass.VERTICAL_CONTAINER);
            } else {
                this.addClass(cssClass.CONTAINER);
            }

            if (this.get("numItems") < 1) {
                YAHOO.log("No items in the Carousel to render", "warn",
                        WidgetName);
                return false;
            }
        
            setTabIndex.call(this);

            // Make sure at least one item is selected
            this.set("selectedItem", this.get("firstVisible"));

            // By now, the navigation would have been rendered, so calculate
            // the container height now.
            setContainerSize.call(this);

            this.fireEvent(renderEvent);

            return true;
        },

        /**
         * Scroll the Carousel by an item backward.
         *
         * @method scrollBackward
         * @public
         */
        scrollBackward: function () {
            this.scrollTo(this._firstItem - this.get("scrollIncrement"));
        },

        /**
         * Scroll the Carousel by an item forward.
         *
         * @method scrollForward
         * @public
         */
        scrollForward: function () {
            this.scrollTo(this._firstItem + this.get("scrollIncrement"));
        },

        /**
         * Scroll the Carousel by a page backward.
         *
         * @method scrollPageBackward
         * @public
         */
        scrollPageBackward: function () {
            this.scrollTo(this._firstItem - this.get("numVisible"));
        },

        /**
         * Scroll the Carousel by a page forward.
         *
         * @method scrollPageForward
         * @public
         */
        scrollPageForward: function () {
            this.scrollTo(this._firstItem + this.get("numVisible"));
        },

        /**
         * Scroll the Carousel to make the item the first visible item.
         *
         * @method scrollTo
         * @public
         * @param item Number The index of the element to position at.
         */
        scrollTo: function (item) {
            var anim,
                animAttrs,
                animCfg    = this.get("animation"),
                isCircular = this.get("isCircular"),
                delta,
                direction,
                firstItem  = this._firstItem,
                newPage,
                numItems   = this.get("numItems"),
                numPerPage = this.get("numVisible"),
                offset,
                page       = this.get("currentPage"),
                rv,
                sentinel,
                which;

            if (item == firstItem) {
                return;         // nothing to do!
            }
            
            if (this._isAnimationInProgress) {
                return;         // let it take its own sweet time to complete
            }

            if (item < 0) {
                if (isCircular) {
                    item = numItems + item;
                } else {
                    return;
                }
            } else if (item > numItems - 1) {
                if (this.get("isCircular")) {
                    item = numItems - item;
                } else {
                    return;
                }
            }

            direction = (this._firstItem > item) ? "backward" : "forward";

            sentinel  = firstItem + numPerPage;
            sentinel  = (sentinel > numItems - 1) ? numItems - 1 : sentinel;
            rv = this.fireEvent(beforeScrollEvent,
                    { dir: direction, first: firstItem, last: sentinel });
            if (rv === false) { // scrolling is prevented
                return;
            }

            this.fireEvent(beforePageChangeEvent, { page: page });
            
            delta = firstItem - item; // yes, the delta is reverse
            this._firstItem = item;
            this.set("firstVisible", item);

            loadItems.call(this); // do we have all the items to display?

            sentinel  = item + numPerPage;
            sentinel  = (sentinel > numItems - 1) ? numItems - 1 : sentinel;
            
            which  = this.get("isVertical") ? "top" : "left";
            offset = getScrollOffset.call(this, delta);
            
            if (animCfg.speed > 0) {
                this._isAnimationInProgress = true;
                if (this.get("isVertical")) {
                    animAttrs = { points: { by: [0, offset] } };
                } else {
                    animAttrs = { points: { by: [offset, 0] } };
                }
                anim = new YAHOO.util.Motion(this._carouselEl, animAttrs,
                        animCfg.speed, animCfg.effect);
                anim.onComplete.subscribe(function (ev) {
                    var first = this.get("firstVisible");
                    
                    this._isAnimationInProgress = false;
                    this.fireEvent(afterScrollEvent,
                            { first: first, last: sentinel });
                }, null, this);
                anim.animate();
                anim = null;
            } else {
                offset += getStyle(this._carouselEl, which);
                Dom.setStyle(this._carouselEl, which, offset + "px");
                this.fireEvent(afterScrollEvent,
                        { first: item, last: sentinel });
            }

            newPage = parseInt(this._firstItem / numPerPage, 10);
            if (newPage != page) {
                this.setAttributeConfig("currentPage", { value: newPage });
                this.fireEvent(pageChangeEvent, newPage);
            }

            delete this._autoPlayTimer;
            if (this.get("autoPlay") > 0) {
                this.startAutoPlay();
            }
        },

        /**
         * Display the Carousel.
         *
         * @method show
         * @public
         */
        show: function () {
            var cssClass = this.CLASSES;
            
            if (this.fireEvent(beforeShowEvent) !== false) {
                this.addClass(cssClass.VISIBLE);
                Dom.addClass(this._carouselEl, cssClass.VISIBLE);
                this.fireEvent(showEvent);
            }
        },

        /**
         * Start auto-playing the Carousel.
         *
         * @method startAutoPlay
         * @public
         */
        startAutoPlay: function () {
            var self  = this,
                timer = this.get("autoPlay");
            
            if (timer > 0) {
                if (!JS.isUndefined(this._autoPlayTimer)) {
                    return;
                }
                this.fireEvent(startAutoPlayEvent);
                this._autoPlayTimer = setTimeout(function () {
                    autoScroll.call(self); }, timer);
            }
        },

        /**
         * Stop auto-playing the Carousel.
         *
         * @method stopAutoPlay
         * @public
         */
        stopAutoPlay: function () {
            if (!JS.isUndefined(this._autoPlayTimer)) {
                clearTimeout(this._autoPlayTimer);
                delete this._autoPlayTimer;
                this.set("autoPlay", 0);
                this.fireEvent(stopAutoPlayEvent);
            }
        },

        /**
         * Return the string representation of the Carousel.
         *
         * @method toString
         * @public
         * @return {String}
         */
        toString: function () {
            return WidgetName + (this.get ? " (#" + this.get("id") + ")" : "");
        },

        /*
         * Protected methods of the Carousel component
         */
        
        /**
         * Create the Carousel.
         *
         * @method createCarousel
         * @param elId {String} The id of the element to be created
         * @protected
         */
        _createCarousel: function (elId) {
            var cssClass = this.CLASSES;
            
            var el = createElement("DIV", {
                    className : cssClass.CONTAINER,
                    id        : elId
            });
            
            if (!this._carouselEl) {
                this._carouselEl = createElement(this.CONFIG.TAG_NAME,
                        { className: cssClass.CAROUSEL });
            }

            return el;
        },
        
        /**
         * Create the Carousel clip container.
         *
         * @method createCarouselClip
         * @protected
         */
        _createCarouselClip: function () {
            var el = createElement("DIV", { className: this.CLASSES.CONTENT });
            setClipContainerSize.call(this, el);
            
            return el;
        },
        
        /**
         * Create the Carousel item.
         *
         * @method createCarouselItem
         * @param obj {Object} The attributes of the element to be created
         * @protected
         */
        _createCarouselItem: function (obj) {
            return createElement(this.CONFIG.ITEM_TAG_NAME, {
                    className : obj.className,
                    content   : obj.content,
                    id        : obj.id
            });
        },
        
        /**
         * Get the value for the selected item.
         *
         * @method _getSelectedItem
         * @param val {Number} The new value for "selected" item
         * @return {Number} The new value that would be set
         * @protected
         */
        _getSelectedItem: function (val) {
            var isCircular = this.get("isCircular"),
                numItems   = this.get("numItems"),
                sentinel   = numItems - 1;

            if (val < 0) {
                if (isCircular) {
                    val = numItems + val;
                } else {
                    val = this.get("selectedItem");
                }
            } else if (val > sentinel) {
                if (isCircular) {
                    val = val - numItems;
                } else {
                    val = this.get("selectedItem");
                }
            }
            
            return val;
        },
        
        /**
         * Find the Carousel within a container. The Carousel is identified by
         * the first element that matches the carousel element tag or the
         * element that has the Carousel class.
         *
         * @method parseCarousel
         * @param parent {HTMLElement} The parent element to look under
         * @return {Boolean} True if Carousel is found, false otherwise
         * @protected
         */
        _parseCarousel: function (parent) {
            var child, cssClass, found, hasClass, node;

            cssClass = this.CLASSES;
            found    = false;
            
            for (child = parent.firstChild; child; child = child.nextSibling) {
                if (child.nodeType == 1) {
                    node = child.nodeName;
                    if (node.toUpperCase() == this.CONFIG.TAG_NAME ||
                        (hasClass = Dom.hasClass(child, cssClass.CAROUSEL))) {
                        this._carouselEl = child;
                        if (!hasClass) {
                            Dom.addClass(this._carouselEl, cssClass.CAROUSEL);
                        }
                        YAHOO.log("Found Carousel - " + node +
                                (child.id ? " (#" + child.id + ")" : ""),
                                WidgetName);
                        found = true;
                    }
                }
            }
            
            return found;
        },
        
        /**
         * Find the items within the Carousel and add them to the items table.
         * A Carousel item is identified by elements that matches the carousel
         * item element tag.
         *
         * @method parseCarouselItems
         * @protected
         */
        _parseCarouselItems: function () {
            var child,
                elId,
                node,
                parent = this._carouselEl;

            for (child = parent.firstChild; child; child = child.nextSibling) {
                if (child.nodeType == 1) {
                    node = child.nodeName;
                    if (node.toUpperCase() == this.CONFIG.ITEM_TAG_NAME) {
                        if (child.id) {
                            elId = child.id;
                        } else {
                            elId = Dom.generateId();
                            child.setAttribute("id", elId);
                        }
                        this.addItem(child);
                    }
                }
            }
        },
        
        /**
         * Find the Carousel navigation within a container. The navigation
         * elements need to match the carousel navigation class names.
         *
         * @method parseCarouselNavigation
         * @param parent {HTMLElement} The parent element to look under
         * @return {Boolean} True if at least one is found, false otherwise
         * @protected
         */
        _parseCarouselNavigation: function (parent) {
            var cfg, cssClass = this.CLASSES, el, rv = false;

            el = Dom.getElementsByClassName(cssClass.PREV_PAGE, "*", parent);
            if (el.length > 0) {
                YAHOO.log("Found Carousel previous page navigation - " +
                      el[0] + (el[0].id ? " (#" + el[0].id + ")" : ""),
                      WidgetName);
                cfg = { prev: el[0] };
            }

            el = Dom.getElementsByClassName(cssClass.NEXT_PAGE, "*", parent);
            if (el.length > 0) {
                YAHOO.log("Found Carousel next page navigation - " +
                      el[0] + (el[0].id ? " (#" + el[0].id + ")" : ""),
                      WidgetName);
                if (cfg) {
                    cfg.next = el[0];
                } else {
                    cfg = { next: el[0] };
                }
            }

            if (cfg) {
                this.set("navigation", cfg);
                rv = true;
            }

            return rv;
        },

        /**
         * Set the value for the Carousel's first visible item.
         *
         * @method _setFirstVisible
         * @param val {Number} The new value for firstVisible
         * @return {Number} The new value that would be set
         * @protected
         */
        _setFirstVisible: function (val) {
            if (val >= 0 && val < this.get("numItems")) {
                this.scrollTo(val);
            } else {
                val = this.get("firstVisible");
            }
            return val;
        },

        /**
         * Set the value for the Carousel's navigation.
         *
         * @method _setNavigation
         * @param cfg {Object} The navigation configuration
         * @return {Object} The new value that would be set
         * @protected
         */
        _setNavigation: function (cfg) {
            if (cfg.prev) {
                Event.on(cfg.prev, "click", scrollPageBackward, this);
            }
            if (cfg.next) {
                Event.on(cfg.next, "click", scrollPageForward, this);
            }
        },

        /**
         * Set the value for the number of visible items in the Carousel.
         *
         * @method _setNumVisible
         * @param val {Number} The new value for numVisible
         * @return {Number} The new value that would be set
         * @protected
         */
        _setNumVisible: function (val) {
            if (val > 1 && val < this.get("numItems")) {
                setClipContainerSize.call(this, this._clipEl, val);
            } else {
                val = this.get("numVisible");
            }
            return val;
        },

        /**
         * Set the number of items in the Carousel.
         * Warning: Setting this to a lower number than the current removes
         * items from the end.
         *
         * @method _setNumItems
         * @param val {Number} The new value for numItems
         * @return {Number} The new value that would be set
         * @protected
         */
        _setNumItems: function (val) {
            var num = this._itemsTable.numItems;
            
            if (JS.isArray(this._itemsTable.items)) {
                if (this._itemsTable.items.length != num) { // out of sync
                    num = this._itemsTable.items.length;
                    this._itemsTable.numItems = num;
                }
            }
            
            if (val < num) {
                while (num > val) {
                    this.removeItem(num - 1);
                    num--;
                }
            }
            
            return val;
        },

        /**
         * Set the orientation of the Carousel.
         *
         * @method _setOrientation
         * @param val {Boolean} The new value for isVertical
         * @return {Boolean} The new value that would be set
         * @protected
         */
        _setOrientation: function (val) {
            var cssClass = this.CLASSES;
            
            if (val) {
                Dom.replaceClass(this._carouselEl, cssClass.HORIZONTAL,
                        cssClass.VERTICAL);
            } else {
                Dom.replaceClass(this._carouselEl, cssClass.VERTICAL,
                        cssClass.HORIZONTAL);
            }
            this._itemsTable.size = 0; // invalidate our size computation cache
            return val;
        },

        /**
         * Set the value for the reveal amount percentage in the Carousel.
         *
         * @method _setRevealAmount
         * @param val {Number} The new value for revealAmount
         * @return {Number} The new value that would be set
         * @protected
         */
        _setRevealAmount: function (val) {
            if (val >= 0 && val <= 100) {
                val = parseInt(val, 10);
                val = JS.isNumber(val) ? val : 0;
                setClipContainerSize.call(this);
            } else {
                val = this.get("revealAmount");
            }
            return val;
        },

        /**
         * Set the value for the selected item.
         *
         * @method _setSelectedItem
         * @param val {Number} The new value for "selected" item
         * @protected
         */
        _setSelectedItem: function (val) {
            this._selectedItem = val;
            this.fireEvent(itemSelectedEvent, val);
        },

        /**
         * Validate animation parameters.
         *
         * @method _validateAnimation
         * @param cfg {Object} The animation configuration
         * @return {Boolean} The status of the validation
         * @protected
         */
        _validateAnimation: function (cfg) {
            var rv = true;
            
            if (JS.isObject(cfg)) {
                if (cfg.speed) {
                    rv = rv && JS.isNumber(cfg.speed);
                }
                if (cfg.effect) {
                    rv = rv && JS.isFunction(cfg.effect);
                } else {
                    cfg.effect = YAHOO.util.Easing.easeOut;
                }
            } else {
                rv = false;
            }
            
            return rv;
        },

        /**
         * Validate the firstVisible value.
         *
         * @method _validateFirstVisible
         * @param val {Number} The first visible value
         * @return {Boolean} The status of the validation
         * @protected
         */
        _validateFirstVisible: function (val) {
            var rv = false;
            
            if (JS.isNumber(val)) {
                rv = (val >= 0 && val < this.get("numItems"));
            }
            
            return rv;
        },
        
        /**
         * Validate and navigation parameters.
         *
         * @method _validateNavigation
         * @param cfg {Object} The navigation configuration
         * @return {Boolean} The status of the validation
         * @protected
         */
        _validateNavigation : function (cfg) {
            if (!JS.isObject(cfg)) {
                return false;
            }
            if (cfg.prev && !(JS.isString(cfg.prev) ||
                    JS.isString(cfg.prev.nodeName))) {
                return false;
            }
            if (cfg.next && !(JS.isString(cfg.next) ||
                    JS.isString(cfg.next.nodeName))) {
                return false;
            }
            return true;
        },

        /**
         * Validate the numItems value.
         *
         * @method _validateNumItems
         * @param val {Number} The numItems value
         * @return {Boolean} The status of the validation
         * @protected
         */
        _validateNumItems: function (val) {
            var rv = false;
            
            if (JS.isNumber(val)) {
                rv = val > 0;
            }
            
            return rv;
        },

        /**
         * Validate the numVisible value.
         *
         * @method _validateNumVisible
         * @param val {Number} The numVisible value
         * @return {Boolean} The status of the validation
         * @protected
         */
        _validateNumVisible: function (val) {
            var rv = false;
            
            if (JS.isNumber(val)) {
                rv = val > 0 && val < this.get("numItems");
            }
            
            return rv;
        },

        /**
         * Validate the revealAmount value.
         *
         * @method _validateRevealAmount
         * @param val {Number} The revealAmount value
         * @return {Boolean} The status of the validation
         * @protected
         */
        _validateRevealAmount: function (val) {
            var rv = false;
            
            if (JS.isNumber(val)) {
                rv = val >= 0 && val < 100;
            }
            
            return rv;
        },

        /**
         * Validate the scrollIncrement value.
         *
         * @method _validateScrollIncrement
         * @param val {Number} The scrollIncrement value
         * @return {Boolean} The status of the validation
         * @protected
         */
        _validateScrollIncrement: function (val) {
            var rv = false;
            
            if (JS.isNumber(val)) {
                rv = (val > 0 && val < this.get("numItems"));
            }
            
            return rv;
        }
        
    });

    /*
     * Private helper functions used by the Carousel component
     */

    /**
     * Automatically scroll the contents of the Carousel.
     * @method autoScroll
     * @private
     */
    function autoScroll() {
        var currIndex = this._firstItem;

        if (currIndex >= this.get("numItems") - 1) {
            if (this.get("isCircular")) {
                index = 0;
            } else {
                this.stopAutoPlay();
            }
        } else {
            index = currIndex + this.get("numVisible");
        }
        this.scrollTo.call(this, index);
    }

    /**
     * Create an element, set its class name and optionally install the element
     * to its parent.
     * @method createElement
     * @param el {String} The element to be created
     * @param attrs {Object} Configuration of parent, class and id attributes.
     * If the content is specified, it is inserted after creation of the
     * element. The content can also be an HTML element in which case it would
     * be appended as a child node of the created element.
     * @private
     */
    function createElement(el, attrs) {
        var newEl = document.createElement(el);

        if (attrs.className) {
            Dom.addClass(newEl, attrs.className);
        }

        if (attrs.parent) {
            attrs.parent.appendChild(newEl);
        }

        if (attrs.id) {
            newEl.setAttribute("id", attrs.id);
        }

        if (attrs.content) {
            if (attrs.content.nodeName) {
                newEl.appendChild(attrs.content);
            } else {
                newEl.innerHTML = attrs.content;
            }
        }

        return newEl;
    }

    /**
     * Compute and return the height or width of a single Carousel item
     * depending upon the orientation.
     *
     * @method getCarouselItemSize
     * @param which {String} "height" or "width" to be returned.  If this is
     * passed explicitly, the calculated size is not cached.
     * @private
     */
    function getCarouselItemSize(which) {
        var child,
            size     = 0,
            vertical = false;

        if (this._itemsTable.numItems == 0) {
            return 0;
        }

        if (typeof which === "undefined") {
            if (this._itemsTable.size > 0) {
                return this._itemsTable.size;
            }
        }

        child = Dom.get(this._itemsTable.items[0].id);
        
        if (typeof which === "undefined") {
            vertical = this.get("isVertical");
        } else {
            vertical = which == "height";
        }
        
        if (vertical) {
            size = getStyle(child, "height");
        } else {
            size = getStyle(child, "width");
        }

        if (typeof which === "undefined") {
            this._itemsTable.size = size; // save the size for later
        }
        
        return size;
    }

    /**
     * Return the scrolling offset size given the number of elements to
     * scroll.
     *
     * @method getScrollOffset
     * @param delta {Number} The delta number of elements to scroll by.
     * @private
     */
    function getScrollOffset(delta) {
        var itemSize = 0,
            size     = 0;

        itemSize = getCarouselItemSize.call(this);
        size     = itemSize * delta;

        // XXX: really, when the orientation is vertical, the scrolling
        // is not exactly the number of elements into element size.
        if (this.get("isVertical")) {
            size -= delta;
        }

        return size;
    }

    /**
     * Get the computed style of an element.
     *
     * @method getStyle
     * @param el {HTMLElement} The element for which the style needs to be
     * returned.
     * @param style {String} The style attribute
     * @param type {String} "int", "float", etc. (defaults to int)
     * @private
     */
    function getStyle(el, style, type) {
        var value;

        function getStyleIntVal(el, style) {
            var val;

            val = parseInt(Dom.getStyle(el, style), 10);
            return JS.isNumber(val) ? val : 0;
        }

        function getStyleFloatVal(el, style) {
            var val;

            val = parseFloat(Dom.getStyle(el, style));
            return JS.isNumber(val) ? val : 0;
        }

        if (typeof type === "undefined") {
            type = "int";
        }

        switch (style) {
        case "height":
            value = el.offsetHeight;
            if (value > 0) {
                value += getStyleIntVal(el, "marginTop")        +
                        getStyleIntVal(el, "marginBottom");
            } else {
                value = getStyleFloatVal(el, "height")          +
                        getStyleIntVal(el, "marginTop")         +
                        getStyleIntVal(el, "marginBottom")      +
                        getStyleIntVal(el, "borderTopWidth")    +
                        getStyleIntVal(el, "borderBottomWidth") +
                        getStyleIntVal(el, "paddingTop")        +
                        getStyleIntVal(el, "paddingBottom");
            }
            break;
        case "width":
            value = el.offsetWidth;
            if (value > 0) {
                value += getStyleIntVal(el, "marginLeft")       +
                        getStyleIntVal(el, "marginRight");
            } else {
                value = getStyleFloatVal(el, "width")           +
                        getStyleIntVal(el, "marginLeft")        +
                        getStyleIntVal(el, "marginRight")       +
                        getStyleIntVal(el, "borderLeftWidth")   +
                        getStyleIntVal(el, "borderRightWidth")  +
                        getStyleIntVal(el, "paddingLeft")       +
                        getStyleIntVal(el, "paddingRight");
            }
            break;
        default:
            if (type == "int") {
                value = getStyleIntVal(el, style);
                // XXX: Safari returns a large negative number for margin-right
                if (style == "marginRight" && YAHOO.env.ua.webkit) {
                    value = value < 0 ? 0 : value;
                }
            } else if (type == "float") {
                value = getStyleFloatVal(el, style);
            } else {
                value = Dom.getStyle(el, style);
            }
            break;
        }

        return value;
    }
    
    /**
     * The "click" handler for the item.
     *
     * @method itemClickHandler
     * @param {Event} ev The event object
     * @param {Object} obj The context object
     * @private
     */
    function itemClickHandler(ev, obj) {
        var container = obj.get("element"),
            el,
            item,
            target = YAHOO.util.Event.getTarget(ev);
        
        while (target && target != container && target.id != obj._carouselEl) {
            el = target.nodeName;
            if (el.toUpperCase() == obj.CONFIG.ITEM_TAG_NAME) {
                break;
            }
            target = target.parentNode;
        }

        if ((item = obj.getItemPositionById(target.id)) >= 0) {
            obj.set("selectedItem", obj._getSelectedItem(item));
        }
    }

    /**
     * The keyboard event handler for Carousel.
     *
     * @method keyboardEventHandler
     * @param ev {Event} The event that is being handled.
     * @param o {Object} The current object instance.
     * @private
     */
    function keyboardEventHandler(ev, o) {
        var key      = Event.getCharCode(ev),
            prevent  = false,
            position = 0;

        if (o._isAnimationInProgress) {
            return;         // do not mess while animation is in progress
        }
        
        switch (key) {
        case 0x25:          // left arrow
        case 0x26:          // up arrow
            position = o.get("selectedItem");
            o.set("selectedItem",
                    o._getSelectedItem(position - o.get("scrollIncrement")));
            prevent = true;
            break;
        case 0x27:          // right arrow
        case 0x28:          // down arrow
            position = o.get("selectedItem");
            o.set("selectedItem",
                    o._getSelectedItem(position + o.get("scrollIncrement")));
            prevent = true;
            break;
        case 0x21:          // page-up
            o.scrollPageBackward();
            prevent = true;
            break;
        case 0x22:          // page-down
            o.scrollPageForward();
            prevent = true;
            break;
        }

        if (prevent) {
            Event.preventDefault(ev);
        }
    }

    /**
     * The load the required set of items that are needed for display.
     *
     * @method loadItems
     * @private
     */
    function loadItems() {
        var first      = this.get("firstVisible"),
            last       = 0,
            numItems   = this.get("numItems"),
            numVisible = this.get("numVisible"),
            reveal     = this.get("revealAmount");

        last = first + numVisible - 1 + (reveal ? 1 : 0);
        last = last > numItems - 1 ? numItems - 1 : last;
        
        if (!this.getItem(first) || !this.getItem(last)) {
            this.fireEvent(loadItemsEvent, {
                    ev: loadItemsEvent,
                    first: first, last: last,
                    num: last - first
            });
        }
    }
    
    /**
     * The "click" handler for the pager navigation.
     *
     * @method pagerClickHandler
     * @param {Event} ev The event object
     * @param {Object} obj The context object
     * @private
     */
    function pagerClickHandler(ev, obj) {
        var match,
            target = Event.getTarget(ev),
            val;

        val = target.href || target.value;
        if (val && (match = val.match(/.*?-(\d+)$/))) {
            if (match.length == 2) {
                obj.scrollTo((match[1] - 1) * obj.get("numVisible"));
                Event.preventDefault(ev);
            }
        }
    }

    /**
     * Scroll the Carousel by a page backward.
     *
     * @method scrollPageBackward
     * @param {Event} ev The event object
     * @param {Object} obj The context object
     * @private
     */
    function scrollPageBackward(ev, obj) {
        obj.scrollPageBackward();
        Event.preventDefault(ev);
    }

    /**
     * Scroll the Carousel by a page forward.
     *
     * @method scrollPageForward
     * @param {Event} ev The event object
     * @param {Object} obj The context object
     * @private
     */
    function scrollPageForward(ev, obj) {
        obj.scrollPageForward();
        Event.preventDefault(ev);
    }

    /**
     * Set the clip container size (based on the new numVisible value).
     *
     * @method setClipContainerSize
     * @param clip {HTMLElement} The clip container element.
     * @param num {Number} optional The number of items per page.
     * @private
     */
    function setClipContainerSize(clip, num) {
        var attr, currVal, isVertical, itemSize, reveal, size, which;

        isVertical = this.get("isVertical");
        reveal     = this.get("revealAmount");
        which      = isVertical ? "height" : "width";
        attr       = isVertical ? "top" : "left";
        clip       = clip || this._clipEl;
        num        = num  || this.get("numVisible");
        itemSize   = getCarouselItemSize.call(this, which);
        size       = itemSize * num;

        this._recomputeSize = (size == 0); // bleh!
        if (this._recomputeSize) {
            return;             // no use going further, bail out!
        }
        
        if (!clip) {
            return;
        }

        if (reveal > 0) {
            reveal = itemSize * (reveal / 100) * 2;
            size += reveal;
            // XXX: its quite unusual to set the Carousel's initial offset here
            currVal = parseFloat(Dom.getStyle(this._carouselEl, attr));
            currVal = JS.isNumber(currVal) ? currVal : 0;
            Dom.setStyle(this._carouselEl, attr, currVal + (reveal/2) + "px");
        }

        if (isVertical) {
            size += getStyle(this._carouselEl, "marginTop")     +
                    getStyle(this._carouselEl, "marginBottom")  +
                    getStyle(this._carouselEl, "paddingTop")    +
                    getStyle(this._carouselEl, "paddingBottom") +
                    getStyle(this._carouselEl, "borderTop")     +
                    getStyle(this._carouselEl, "borderBottom");
            // XXX: for vertical Carousel
            Dom.setStyle(clip, which, (size - (num - 1)) + "px");
        } else {
            size += getStyle(this._carouselEl, "marginLeft")    +
                    getStyle(this._carouselEl, "marginRight")   +
                    getStyle(this._carouselEl, "paddingLeft")   +
                    getStyle(this._carouselEl, "paddingRight")  +
                    getStyle(this._carouselEl, "borderLeft")    +
                    getStyle(this._carouselEl, "borderRight");
            Dom.setStyle(clip, which, size + "px");
        }

        setContainerSize.call(this, clip); // adjust the container size too
    }

    /**
     * Set the container size.
     *
     * @method setContainerSize
     * @param clip {HTMLElement} The clip container element.
     * @param attr {String} Either set the height or width.
     * @private
     */
    function setContainerSize(clip, attr) {
        var isVertical, size;

        isVertical = this.get("isVertical");
        if (isVertical) {
            return;             // no need to set the height for container
        }
        clip       = clip || this._clipEl;
        attr       = attr || (isVertical ? "height" : "width");
        size       = parseFloat(Dom.getStyle(clip, attr), 10);

        size = JS.isNumber(size) ? size : 0;

        size += getStyle(clip, "marginLeft")   +
                getStyle(clip, "marginRight")  +
                getStyle(clip, "paddingLeft")  +
                getStyle(clip, "paddingRight") +
                getStyle(clip, "borderLeft")   +
                getStyle(clip, "borderRight");
        
        this.setStyle(attr, size + "px");
    }
    
    /**
     * The "click" handler for the Carousel container.  This function sets
     * the focus on the Carousel.
     *
     * @method setFocusHandler
     * @param {Event} ev The event object
     * @param {Object} obj The context object
     * @private
     */
    function setFocusHandler(ev, obj) {
        if (obj && obj.focus) {
            obj.focus();
        }
    }

    /**
     * Set the selected item.
     *
     * @method setItemSelection
     * @param {Number} newposition The index of the new position
     * @private
     */
    function setItemSelection(newposition) {
        var cssClass   = this.CLASSES,
            el,
            firstItem  = this._firstItem,
            numItems   = this.get("numItems"),
            numVisible = this.get("numVisible"),
            position   = this.get("selectedItem"),
            sentinel   = firstItem + numVisible - 1;
        
        if (position >= 0 && position < numItems) {
            el = Dom.get(this._itemsTable.items[position].id);
            if (el) {
                Dom.removeClass(el, cssClass.SELECTED_ITEM);
            }
        }
        
        if (JS.isNumber(newposition)) {
            newposition = parseInt(newposition, 10);
            newposition = JS.isNumber(newposition) ? newposition : 0;
        } else {
            newposition = firstItem;
        }

        if (JS.isUndefined(this._itemsTable.items[newposition])) {
            this.scrollTo(newposition); // still loading the item
        }

        el = Dom.get(this._itemsTable.items[newposition].id);
        if (el) {
            Dom.addClass(el, cssClass.SELECTED_ITEM);
        }

        if (newposition < firstItem || newposition > sentinel) {
            // out of focus
            this.scrollTo(newposition);
        }
    }

    /**
     * Setup/Create the Carousel navigation element (if needed).
     *
     * @method setupCarouselNavigation
     * @private
     */
    function setupCarouselNavigation() {
        var cfg, cssClass, navContainer, nextButton, pageEl, prevButton;

        cssClass = this.CLASSES;
        
        navContainer = Dom.getElementsByClassName(cssClass.NAVIGATION, "DIV",
                this.get("element"));
        
        if (navContainer.length == 0) {
            navContainer = createElement("DIV",
                    { className: cssClass.NAVIGATION });
            this.insertBefore(navContainer,
                    Dom.getFirstChild(this.get("element")));
        } else {
            navContainer = navContainer[0];
        }

        this._pages.el = createElement("UL",
                { className:cssClass.PAGE_NAV });
        navContainer.appendChild(this._pages.el);
        
        nav = this.get("navigation");
        if (nav.prev) {
            navContainer.appendChild(nav.prev);
        } else {
            // TODO: separate method for creating a navigation button
            prevButton = createElement("SPAN",
                    { className: cssClass.BUTTON + cssClass.FIRST_BUTTON });
            prevButton.innerHTML = "<input type=\"button\" " +
                    "value=\"" + this.STRINGS.PREVIOUS_BUTTON_TEXT + "\" " +
                    "name=\"" + this.STRINGS.PREVIOUS_BUTTON_TEXT + "\">";
            navContainer.appendChild(prevButton);
            cfg = { prev: prevButton };
        }
        
        if (nav.next) {
            navContainer.appendChild(nav.next);
        } else {
            // TODO: separate method for creating a navigation button
            nextButton = createElement("SPAN",
                    { className: cssClass.BUTTON });
            nextButton.innerHTML = "<input type=\"button\" " +
                    "value=\"" + this.STRINGS.NEXT_BUTTON_TEXT + "\" " +
                    "name=\"" + this.STRINGS.NEXT_BUTTON_TEXT + "\">";
            navContainer.appendChild(nextButton);
            if (cfg) {
                cfg.next = nextButton;
            } else {
                cfg = { next: nextButton };
            }
        }

        if (cfg) {
            this.set("navigation", cfg);
        }
        
        return navContainer;
    }
    
    /**
     * Set the tabindex for our Carousel.
     * 
     * @method setTabIndex
     * @private
     */
    function setTabIndex() {        
        if (!this._isTabIndexSet) {            
            if (!this._carouselEl.getAttribute("tabindex")) {
                this._carouselEl.setAttribute("tabindex", 0);
                this._isTabIndexSet = true;
            }
        }
    }

    /**
     * Fire custom events for enabling/disabling navigation elements.
     *
     * @method syncNavigation
     * @private
     */
    function syncNavigation() {
        var attach   = false,
            cssClass = this.CLASSES,
            navigation,
            sentinel;

        navigation = this.get("navigation");
        sentinel   = this._firstItem + this.get("numVisible");
        
        if (navigation.prev) {
            if (this._firstItem == 0) {
                if (!this.get("isCircular")) {
                    Event.removeListener(navigation.prev, "click",
                            scrollPageBackward);
                    Dom.addClass(navigation.prev, cssClass.FIRST_DISABLED);
                    this._prevEnabled = false;
                } else {
                    attach = !this._prevEnabled;
                }
            } else {
                attach = !this._prevEnabled;
            }
            
            if (attach) {
                Event.on(navigation.prev, "click", scrollPageBackward, this);
                Dom.removeClass(navigation.prev, cssClass.FIRST_DISABLED);
                this._prevEnabled = true;
            }
        }

        attach = false;
        if (navigation.next) {
            if (sentinel >= this.get("numItems")) {
                if (!this.get("isCircular")) {
                    Event.removeListener(navigation.next, "click",
                            scrollPageForward);
                    Dom.addClass(navigation.next, cssClass.DISABLED);
                    this._nextEnabled = false;
                } else {
                    attach = !this._nextEnabled;
                }
            } else {
                attach = !this._nextEnabled;
            }
            
            if (attach) {
                Event.on(navigation.next, "click", scrollPageForward, this);
                Dom.removeClass(navigation.next, cssClass.DISABLED);
                this._nextEnabled = true;
            }
        }
        
        this.fireEvent(navigationStateChangeEvent,
                { next: this._nextEnabled, prev: this._prevEnabled });
    }

    /**
     * Synchronize and redraw the Pager UI if necessary.
     *
     * @method syncPagerUI
     * @private
     */
    function syncPagerUI(page) {
        var i,
            markup     = "",
            numPages,
            numVisible = this.get("numVisible");

        page     = page || 0;
        numPages = Math.ceil(this.get("numItems") / numVisible);

        this._pages.num = numPages;
        this._pages.cur = page;

        if (numPages > this.CONFIG.MAX_PAGER_BUTTONS) {
            markup = "<form><select>";
        } else {
            markup = "";
        }
        
        for (i = 0; i < numPages; i++) {
            if (numPages > this.CONFIG.MAX_PAGER_BUTTONS) {
                markup += "<option value=\"#yui-carousel-page-" + (i+1)    +
                        "\" " + "id=\"#yui-carousel-page-" + (i+1) + "\" " +
                        (i == page ? " selected" : "") + "\">"             +
                        this.STRINGS.PAGER_PREFIX_TEXT + " " + (i+1)       +
                        "</option>";
            } else {
                markup += "<li" + (i == 0 ? " class=\"first\">" : ">")     +
                        "<a href=\"#page-" + (i+1) + "\" "                 +
                        (i == page ? " class=\"selected\"" : "") + "><em>" +
                        this.STRINGS.PAGER_PREFIX_TEXT + " " + (i+1)       +
                        "</em></a></li>";
            }
        }

        if (numPages > this.CONFIG.MAX_PAGER_BUTTONS) {
            markup += "</select></form>";
        }
        
        this._pages.el.innerHTML = markup;
        markup = null;
    }

    /**
     * Fire custom events for synchronizing the DOM.
     *
     * @method syncUI
     * @param {Object} o The item that needs to be added or removed
     * @private
     */
    function syncUI(o) {
        var el, i, item, num, oel, pos, sibling;
        
        if (!JS.isObject(o)) {
            return;
        }
        
        setTabIndex.call(this);

        switch (o.ev) {
        case itemAddedEvent:
            pos  = JS.isUndefined(o.pos) ? this._itemsTable.numItems-1 : o.pos;
            item = this._itemsTable.items[pos];
            oel  = Dom.get(item.id);
            if (!oel) {
                el = this._createCarouselItem({
                        className : item.className,
                        content   : item.item,
                        id        : item.id
                });
                if (JS.isUndefined(o.pos)) {
                    if ((oel = this._itemsTable.loading[pos])) {
                        this._carouselEl.replaceChild(el, oel);
                    } else {
                        this._carouselEl.appendChild(el);
                    }
                } else {
                    sibling = Dom.get(this._itemsTable.items[o.pos + 1].id);
                    if (sibling) {
                        this._carouselEl.insertBefore(el, sibling);
                    } else {
                        YAHOO.log("Unable to find sibling","error",WidgetName);
                    }
                }
            } else {
                if (JS.isUndefined(o.pos)) {
                    if (!Dom.isAncestor(this._carouselEl, oel)) {
                        this._carouselEl.appendChild(obj.el);
                    }
                } else {
                    if (!Dom.isAncestor(this._carouselEl, oel)) {
                        this._carouselEl.insertBefore(oel,
                                Dom.get(this._itemsTable.items[o.pos + 1].id));
                    }
                }
            }

            if (this._recomputeSize) {
                setClipContainerSize.call(this);
            }
            break;            
        case itemRemovedEvent:
            num  = this.get("numItems");
            item = o.item;
            pos  = o.pos;

            if (item && (el = Dom.get(item.id))) {
                if (el && Dom.isAncestor(this._carouselEl, el)) {
                    Event.purgeElement(el, true);
                    this._carouselEl.removeChild(el);
                }

                if (this.get("selectedItem") == pos) {
                    pos = pos >= num ? num - 1 : pos;
                    this.set("selectedItem", pos);
                }
            } else {
                YAHOO.log("Unable to find item", "warn", WidgetName);
            }
            break;
        case loadItemsEvent:
            for (i = o.first; i <= o.last; i++) {
                el = this._createCarouselItem({
                        content : this.CONFIG.ITEM_LOADING,
                        id      : Dom.generateId()
                });
                if (el) {
                    if (this._itemsTable.items[o.last + 1]) {
                        sibling = Dom.get(this._itemsTable.items[o.last+1].id);
                        if (sibling) {
                            this._carouselEl.insertBefore(el, sibling);
                        } else {
                            YAHOO.log("Unable to find sibling", "error",
                                    WidgetName);
                        }
                    } else {
                        this._carouselEl.appendChild(el);
                    }
                }
                this._itemsTable.loading[i] = el;
            }
            break;
        }
    }
    
})();
