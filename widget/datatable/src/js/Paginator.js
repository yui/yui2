/**
 * The Paginator widget provides a set of controls to navigate through paged
 * data.
 *
 * @namespace YAHOO.widget
 * @class Paginator
 * @uses YAHOO.util.EventProvider
 * @uses YAHOO.util.AttributeProvider
 *
 * @constructor
 * @param config {Object} Object literal to set instance and visualization
 * plugin attributes.
 */
YAHOO.widget.Paginator = function (config) {
    var UNLIMITED = YAHOO.widget.Paginator.VALUE_UNLIMITED,
        attrib, initialPage, records, perPage;

    config = YAHOO.lang.isObject(config) ? config : {};

    this.initConfig();

    this.initEvents();

    // Set the basic config keys first
    this.set('rowsPerPage',config.rowsPerPage,true);
    if (YAHOO.lang.isNumber(config.totalRecords)) {
        this.set('totalRecords',config.totalRecords,true);
    }
    
    this.initPlugins();

    // Update the other config values
    for (attrib in config) {
        this.set(attrib,config[attrib],true);
    }

    // Calculate the initial record offset
    initialPage = this.get('initialPage');
    records     = this.get('totalRecords');
    perPage     = this.get('rowsPerPage');
    if (initialPage > 1 && perPage !== UNLIMITED) {
        var startIndex = (initialPage - 1) * perPage;
        if (records === UNLIMITED || startIndex < records) {
            this.set('recordOffset',startIndex,true);
        }
    }
};


// Static members
YAHOO.lang.augmentObject(YAHOO.widget.Paginator, {
    /**
     * Incrementing index used to give instances unique ids.
     * @static
     * @property id
     * @type number
     * @private
     */
    id : 0,

    /**
     * Used to identify unset, optional configurations, or used explicitly in
     * the case of totalRecords to indicate unlimited pagination.
     * @static
     * @property VALUE_UNLIMITED
     * @type number
     * @final
     */
    VALUE_UNLIMITED : -1

},true);





// Instance members and methods
YAHOO.widget.Paginator.prototype = {

    // Instance members

    /**
     * Array of nodes in which to render pagination controls.  This is set via
     * the &quot;containers&quot; attribute.
     * @property _containers
     * @type Array(HTMLElement)
     * @private
     */
    _containers : [],




    // Instance methods

    /**
     * Initialize the Paginator's attributes (see YAHOO.util.Element class
     * AttributeProvider).
     * @method initConfig
     * @private
     */
    initConfig : function () {

        var UNLIMITED = YAHOO.widget.Paginator.VALUE_UNLIMITED,
            l         = YAHOO.lang;

        /**
         * REQUIRED. Number of records constituting a &quot;page&quot;
         * @attribute rowsPerPage
         * @type integer
         */
        this.setAttributeConfig('rowsPerPage', {
            value     : 0,
            validator : l.isNumber
        });

        /**
         * REQUIRED. Node references or ids of nodes in which to render the
         * pagination controls.
         * @attribute containers
         * @type {string|HTMLElement|Array(string|HTMLElement)}
         */
        this.setAttributeConfig('containers', {
            value     : null,
            writeOnce : true,
            validator : function (val) {
                if (!l.isArray(val)) {
                    val = [val];
                }
                for (var i = 0, len = val.length; i < len; ++i) {
                    if (l.isString(val[i]) || 
                        (l.isObject(val[i]) && val[i].nodeType === 1)) {
                        continue;
                    }
                    return false;
                }
                return true;
            },
            method : function (val) {
                val = YAHOO.util.Dom.get(val);
                if (!l.isArray(val)) {
                    val = [val];
                }
                this._containers = val;
            }
        });

        /**
         * Total number of records to paginate through
         * @attribute totalRecords
         * @type integer
         * @default Paginator.VALUE_UNLIMITED
         */
        this.setAttributeConfig('totalRecords', {
            value     : UNLIMITED,
            validator : l.isNumber
        });

        /**
         * Zero based index of the record considered first on the current page.
         * For page based interactions, don't modify this attribute directly;
         * use setPage(n).
         * @attribute recordOffset
         * @type integer
         * @default 0
         */
        this.setAttributeConfig('recordOffset', {
            value     : 0,
            validator : function (val) {
                var total = this.get('totalRecords');
                if (l.isNumber(val)) {
                    return total === UNLIMITED || total > val;
                }

                return false;
            }
        });

        /**
         * Page to display on initial paint
         * @attribute initialPage
         * @type integer
         * @default 1
         */
        this.setAttributeConfig('initialPage', {
            value     : 1,
            validator : l.isNumber
        });

        /**
         * Template used to render controls.  The string will be used as
         * innerHTML on all specified container nodes.  Bracketed keys
         * (e.g. {pageLinks}) in the string will be replaced with an instance
         * of the so named view plugin.
         * @attribute template
         * @type string
         * @default "{FirstPageLink} {PreviousPageLink} {PageLinks} {NextPageLink} {LastPageLink}"
         */
        this.setAttributeConfig('template', {
            value : "{FirstPageLink} {PreviousPageLink} {PageLinks} {NextPageLink} {LastPageLink}",
            validator : l.isString
        });

        /**
         * Class assigned to the element(s) containing pagination controls.
         * @attribute containerClass
         * @type string
         * @default 'yui-pg-container'
         */
        this.setAttributeConfig('containerClass', {
            value : 'yui-pg-container',
            validator : l.isString
        });

        /**
         * Display pagination controls even when there is only one page.  Set
         * to false to forgo rendering and/or hide the containers when there
         * is only one page of data.  Note if you are using the rowsPerPage
         * dropdown plugin, visibility will be maintained as long as the
         * number of records exceeds the smallest page size.
         * @attribute alwaysVisible
         * @type boolean
         * @default true
         */
        this.setAttributeConfig('alwaysVisible', {
            value : true,
            validator : l.isBoolean
        });

        /**
         * Update the UI immediately upon interaction.  If false, changeRequest
         * subscribers or other external code will need to explicitly set the
         * new values in the paginator to trigger repaint.
         * @attribute updateOnChange
         * @type boolean
         * @default false
         */
        this.setAttributeConfig('updateOnChange', {
            value     : false,
            validator : l.isBoolean
        });



        // Read only attributes

        /**
         * Unique id assigned to this instance
         * @attribute id
         * @type integer
         * @final
         */
        this.setAttributeConfig('id', {
            value    : YAHOO.widget.Paginator.id++,
            readOnly : true
        });

        /**
         * Indicator of whether the DOM nodes have been initially created
         * @attribute rendered
         * @type boolean
         * @final
         */
        this.setAttributeConfig('rendered', {
            value    : false,
            readOnly : true
        });

    },

    /**
     * Initialize registered view plugins onto this instance.
     * @method initPlugins
     * @private
     */
    initPlugins : function () {
        var P = YAHOO.widget.Paginator.Plugin;
        for (var name in P) {
            var plugin = P[name];
            if (YAHOO.lang.isObject(plugin) &&
                YAHOO.lang.isFunction(plugin.init)) {
                plugin.init(this);
            }
        }
    },

    /**
     * Initialize this instance's CustomEvents.
     * @method initEvents
     * @private
     */
    initEvents : function () {
        this.createEvent('recordOffsetChange');
        this.createEvent('totalRecordsChange');
        this.createEvent('rowsPerPageChange');
        this.createEvent('alwaysVisibleChange');

        this.createEvent('rendered');
        this.createEvent('changeRequest');
        this.createEvent('beforeDestroy');

        // Listen for changes to totalRecords and alwaysVisible 
        this.subscribe('totalRecordsChange',this.updateVisibility,this,true);
        this.subscribe('alwaysVisibleChange',this.updateVisibility,this,true);
    },

    /**
     * Render the pagination controls per the format attribute into the
     * specified container nodes.
     * @method render
     */
    render : function () {
        if (this.get('rendered')) {
            return;
        }

        // Forgo rendering if only one page and alwaysVisible is off
        var totalRecords = this.get('totalRecords');
        if (totalRecords !== YAHOO.widget.Paginator.VALUE_UNLIMITED &&
            totalRecords < this.get('rowsPerPage') &&
            !this.get('alwaysVisible')) {
            return;
        }

        var template       = this.get('template'),
            containerClass = this.get('containerClass');
        this._plugins = [];

        // add marker spans to the template html to indicate drop zones
        // for plugins
        template = template.replace(/\{([a-z0-9_ \-]+)\}/gi,
            '<span class="yui-pg-plugin $1"></span>');
        for (var i = 0, len = this._containers.length; i < len; ++i) {
            YAHOO.util.Dom.addClass(this._containers[i],containerClass);

            // Place the template innerHTML
            this._containers[i].innerHTML = template;

            // Replace each marker with the appropriate plugin's render() output
            var markers = YAHOO.util.Dom.getElementsByClassName('yui-pg-plugin','span',this._containers[i]);
            for (var j = 0, jlen = markers.length; j < jlen; ++j) {
                var m      = markers[j],
                    mp     = m.parentNode,
                    name   = m.className.replace(/\s*yui-pg-plugin\s+/g,''),
                    Plugin = YAHOO.widget.Paginator.Plugin[name];

                if (YAHOO.lang.isFunction(Plugin)) {
                    var plugin = new Plugin(this);
                    if (YAHOO.lang.isFunction(plugin.render)) {
                        mp.insertBefore(plugin.render(),m);
                    }
                }

                // remove the marker
                mp.removeChild(m);
            }
        }

        // Set render attribute manually to support its readOnly contract
        if (this._containers.length) {
            this._configs.rendered.value = true;

            this.fireEvent('rendered',this.getState());
        }
    },

    /**
     * Removes controls from the page and unhooks events.
     * @method destroy
     */
    destroy : function () {
        this.fireEvent('beforeDestroy');
        for (var i = 0, len = this._containers.length; i < len; ++i) {
            this._containers[i].innerHTML = '';
        }
        this.setAttributeConfig('rendered',{value:false});
    },

    /**
     * Hides the containers if there is only one page of data and attribute
     * alwaysVisible is false.  Conversely, it displays the containers if either
     * there is more than one page worth of data or alwaysVisible is turned on.
     * @method updateVisibility
     */
    updateVisibility : function (e) {
        var alwaysVisible = this.get('alwaysVisible');
        if (e.type === 'alwaysVisibleChange' || !alwaysVisible) {
            var totalRecords = this.get('totalRecords'),
                visible = true,
                rpp = this.get('rowsPerPage'),
                rppOptions = this.get('rowsPerPageOptions'),
                i,len;

            if (YAHOO.lang.isArray(rppOptions)) {
                for (i = 0, len = rppOptions.length; i < len; ++i) {
                    rpp = Math.min(rpp,rppOptions[i]);
                }
            }

            if (totalRecords !== YAHOO.widget.Paginator.VALUE_UNLIMITED &&
                totalRecords <= rpp) {
                visible = false;
            }

            visible = visible || alwaysVisible;

            for (i = 0, len = this._containers.length; i < len; ++i) {
                YAHOO.util.Dom.setStyle(this._containers[i],'display',
                    visible ? '' : 'none');
            }
        }
    },




    /**
     * Get the configured container nodes
     * @method getContainerNodes
     * @return {Array} array of HTMLElement nodes
     */
    getContainerNodes : function () {
        return this._containers;
    },

    /**
     * Get the total number of pages in the data set according to the current
     * rowsPerPage and totalRecords values.  If totalRecords is not set, or
     * set to YAHOO.widget.Paginator.VALUE_UNLIMITED, returns
     * YAHOO.widget.Paginator.VALUE_UNLIMITED.
     * @method getTotalPages
     * @return {number}
     */
    getTotalPages : function () {
        var records = this.get('totalRecords');
        var perPage = this.get('rowsPerPage');

        // rowsPerPage not set.  Can't calculate
        if (!perPage) {
            return null;
        }

        if (records === YAHOO.widget.Paginator.VALUE_UNLIMITED) {
            return YAHOO.widget.Paginator.VALUE_UNLIMITED;
        }

        return Math.ceil(records/perPage);
    },

    /**
     * Does the requested page have any records?
     * @method hasPage
     * @param page {number} the page in question
     * @return {boolean}
     */
    hasPage : function (page) {
        if (!YAHOO.lang.isNumber(page) || page < 1) {
            return false;
        }

        var totalPages = this.getTotalPages();

        return (totalPages === YAHOO.widget.Paginator.VALUE_UNLIMITED || totalPages >= page);
    },

    /**
     * Get the page number corresponding to the current record offset.
     * @method getCurrentPage
     * @return {number}
     */
    getCurrentPage : function () {
        var perPage = this.get('rowsPerPage');
        if (!perPage) {
            return null;
        }
        return Math.floor(this.get('recordOffset') / perPage) + 1;
    },

    /**
     * Are there records on the next page?
     * @method hasNextPage
     * @return {boolean}
     */
    hasNextPage : function () {
        var currentPage = this.getCurrentPage(),
            totalPages  = this.getTotalPages();

        if (currentPage === null) {
            return false;
        }

        return (totalPages === YAHOO.widget.Paginator.VALUE_UNLIMITED ? true : currentPage < totalPages);
    },

    /**
     * Get the page number of the next page, or null if the current page is the
     * last page.
     * @method getNextPage
     * @return {number}
     */
    getNextPage : function () {
        return this.hasNextPage() ? this.getCurrentPage() + 1 : null;
    },

    /**
     * Is there a page before the current page?
     * @method hasPreviousPage
     * @return {boolean}
     */
    hasPreviousPage : function () {
        return (this.getCurrentPage() > 1);
    },

    /**
     * Get the page number of the previous page, or null if the current page
     * is the first page.
     * @method getPreviousPage
     * @return {number}
     */
    getPreviousPage : function () {
        return (this.hasPreviousPage() ? this.getCurrentPage() - 1 : 1);
    },

    /**
     * Get the start and end record indexes of the specified page.
     * @method getPageRecords
     * @param page {number} (optional) The page (current page if not specified)
     * @return {Array} [start_index, end_index]
     */
    getPageRecords : function (page) {
        if (!YAHOO.lang.isNumber(page)) {
            page = this.getCurrentPage();
        }

        var perPage = this.get('rowsPerPage'),
            records = this.get('totalRecords'),
            start, end;

        if (!perPage) {
            return null;
        }

        start = (page - 1) * perPage;
        if (records !== YAHOO.widget.Paginator.VALUE_UNLIMITED) {
            if (start >= records) {
                return null;
            }
            end = Math.min(start + perPage, records) - 1;
        } else {
            end = start + perPage - 1;
        }

        return [start,end];
    },

    /**
     * Set the current page to the provided page number if possible.
     * @method setPage
     * @param newPage {number} the new page number
     * @param silent {boolean} whether to forcibly avoid firing the changeRequest event
     */
    setPage : function (page,silent) {
        if (page !== this.getCurrentPage()) {
            if (this.get('updateOnChange') || silent) {
                this.set('recordOffset', (page - 1) * this.get('rowsPerPage'));
            } else {
                this.fireEvent('changeRequest',this.getState({'page':page}));
            }
        }
    },

    /**
     * Get the number of rows per page.
     * @method getRowsPerPage
     * @return {number} the current setting of the rowsPerPage attribute
     */
    getRowsPerPage : function () {
        return this.get('rowsPerPage');
    },

    /**
     * Set the number of rows per page.
     * @method setRowsPerPage
     * @param rpp {number} the new number of rows per page
     * @param silent {boolean} whether to forcibly avoid firing the changeRequest event
     */
    setRowsPerPage : function (rpp,silent) {
        if (rpp !== this.get('rowsPerPage')) {
            if (this.get('updateOnChange') || silent) {
                this.set('rowsPerPage',rpp);
            } else {
                this.fireEvent('changeRequest',
                    this.getState({'rowsPerPage':rpp}));
            }
        }
    },

    /**
     * Get the total number of records.
     * @method getTotalRecords
     * @return {number} the current setting of totalRecords attribute
     */
    getTotalRecords : function () {
        return this.get('totalRecords');
    },

    /**
     * Set the total number of records.
     * @method setTotalRecords
     * @param total {number} the new total number of records
     * @param silent {boolean} whether to forcibly avoid firing the changeRequest event
     */
    setTotalRecords : function (total,silent) {
        if (total !== this.get('totalRecords')) {
            if (this.get('updateOnChange') || silent) {
                this.set('totalRecords',total);
            } else {
                this.fireEvent('changeRequest',
                    this.getState({'totalRecords':total}));
            }
        }
    },

    /**
     * Get the index of the first record on the current page
     * @method getStartIndex
     * @return {number} the index of the first record on the current page
     */
    getStartIndex : function () {
        return this.get('recordOffset');
    },

    /**
     * Move the record offset to a new starting index.  This will likely cause
     * the calculated current page to change.  You should probably use setPage.
     * @method setStartIndex
     * @param offset {number} the new record offset
     * @param silent {boolean} whether to forcibly avoid firing the changeRequest event
     */
    setStartIndex : function (offset,silent) {
        if (offset !== this.get('recordOffset')) {
            if (this.get('updateOnChange') || silent) {
                this.set('recordOffset',offset);
            } else {
                this.fireEvent('changeRequest',
                    this.getState({'recordOffset':offset}));
            }
        }
    },

    /**
     * Get an object literal describing the current state of the paginator.  If
     * an object literal of proposed values is passed, the proposed state will
     * be returned as an object literal with the following keys:
     * <ul>
     * <li>paginator - instance of the Paginator</li>
     * <li>page - number</li>
     * <li>totalRecords - number</li>
     * <li>recordOffset - number</li>
     * <li>rowsPerPage - number</li>
     * <li>records - [ start_index, end_index ]</li>
     * <li>before - (OPTIONAL) { state object literal for current state }</li>
     * </ul>
     * @method getState
     * @return {object}
     * @param changes {object} OPTIONAL object literal with proposed values
     * Supported change keys include:
     * <ul>
     * <li>rowsPerPage</li>
     * <li>totalRecords</li>
     * <li>recordOffset OR</li>
     * <li>page</li>
     * </ul>
     */
    getState : function (changes) {
        var UNLIMITED = YAHOO.widget.Paginator.VALUE_UNLIMITED,
            L         = YAHOO.lang;

        var currentState = {
            paginator    : this,
            page         : this.getCurrentPage(),
            totalRecords : this.get('totalRecords'),
            recordOffset : this.get('recordOffset'),
            rowsPerPage  : this.get('rowsPerPage'),
            records      : this.getPageRecords()
        };

        if (!changes) {
            return currentState;
        }

        var newOffset = currentState.recordOffset;
        var state = {
            paginator    : this,
            before       : currentState,

            rowsPerPage  : changes.rowsPerPage || currentState.rowsPerPage,
            totalRecords : (L.isNumber(changes.totalRecords) ?
                                Math.max(changes.totalRecords,UNLIMITED) :
                                currentState.totalRecords)
        };

        if (state.totalRecords === 0) {
            newOffset  = 0;
            state.page = 0;
        } else {
            if (!L.isNumber(changes.recordOffset) &&
                 L.isNumber(changes.page)) {
                newOffset = (changes.page - 1) * state.rowsPerPage;
                if (state.totalRecords === UNLIMITED) {
                    state.page = changes.page;
                } else {
                    // Limit values by totalRecords and rowsPerPage
                    state.page = Math.min(
                                    changes.page,
                                    Math.ceil(state.totalRecords / state.rowsPerPage));
                    newOffset  = Math.min(newOffset, state.totalRecords - 1);
                }
            } else {
                newOffset  = Math.min(newOffset,state.totalRecords - 1);
                state.page = Math.floor(newOffset/state.rowsPerPage) + 1;
            }
        }

        // Jump offset to top of page
        state.recordOffset = state.recordOffset ||
                             newOffset - (newOffset % state.rowsPerPage);

        state.records = [ state.recordOffset,
                          state.recordOffset + state.rowsPerPage - 1 ];

        if (state.totalRecords !== UNLIMITED &&
            state.recordOffset < state.totalRecords &&
            state.records[1] > state.totalRecords - 1) {
            // limit upper index to totalRecords - 1
            state.records[1] = state.totalRecords - 1;
        }

        return state;
    }
};

YAHOO.lang.augmentProto(YAHOO.widget.Paginator, YAHOO.util.EventProvider);
YAHOO.lang.augmentProto(YAHOO.widget.Paginator, YAHOO.util.AttributeProvider);






// View Plugins


(function () {

// Plugin namespace
YAHOO.widget.Paginator.Plugin = {};

var Paginator = YAHOO.widget.Paginator,
    Plugin    = Paginator.Plugin,
    l         = YAHOO.lang;

/**
 * Plugin to generate the link to jump to the first page.
 *
 * @namespace YAHOO.widget.Paginator.Plugin
 * @class FirstPageLink
 * @for YAHOO.widget.Paginator
 *
 * @constructor
 * @param paginator {Pagintor} Paginator instance to attach to
 */
Plugin.FirstPageLink = function (paginator) {
    this.paginator = paginator;

    this.paginator.createEvent('firstPageLinkLabelChange');
    this.paginator.createEvent('firstPageLinkClassChange');

    this.paginator.subscribe('recordOffsetChange',this.update,this,true);

    // TODO: make this work
    this.paginator.subscribe('firstPageLinkLabelChange',this.update,this,true);
    this.paginator.subscribe('firstPageLinkClassChange',this.update,this,true);
};

/**
 * Decorates Paginator instances with new attributes. Called during
 * Paginator instantiation.
 * @method init
 * @param paginator {Paginator} Paginator instance to decorate
 * @static
 */
Plugin.FirstPageLink.init = function (paginator) {

    /**
     * Used as innerHTML for the first page link/span.
     * @attribute firstPageLinkLabel
     * @default '&lt;&lt;&nbsp;first'
     */
    paginator.setAttributeConfig('firstPageLinkLabel', {
        value : '&lt;&lt;&nbsp;first',
        validator : l.isString
    });

    /**
     * CSS class assigned to the link/span
     * @attribute firstPageLinkClass
     * @default 'yui-pg-first'
     */
    paginator.setAttributeConfig('firstPageLinkClass', {
        value : 'yui-pg-first',
        validator : l.isString
    });
};

// Instance members and methods
Plugin.FirstPageLink.prototype = {

    /**
     * The currently placed HTMLElement node
     * @property current
     * @type HTMLElement
     * @private
     */
    current   : null,

    /**
     * Link node
     * @property link
     * @type HTMLElement
     * @private
     */
    link      : null,

    /**
     * Span node (inactive link)
     * @property span
     * @type HTMLElement
     * @private
     */
    span      : null,

    /**
     * Generate the nodes and return the appropriate node given the current
     * pagination state.
     * @method render
     * @return {HTMLElement}
     */
    render : function () {
        var p     = this.paginator,
            c     = p.get('firstPageLinkClass'),
            label = p.get('firstPageLinkLabel');

        this.link     = document.createElement('a');
        this.span     = document.createElement('span');

        this.link.href = '#';
        this.link.className = c;
        this.link.innerHTML = label;
        YAHOO.util.Event.on(this.link,'click',this.onClick,this,true);

        this.span.className = c;
        this.span.innerHTML = label;

        this.current = p.get('recordOffset') < 1 ? this.span : this.link;
        return this.current;
    },

    /**
     * Swap the link and span nodes if appropriate.
     * @method update
     * @param e {CustomEvent} The calling change event
     */
    update : function (e) {
        if (e && e.prevValue === e.newValue) {
            return;
        }

        var par = this.current ? this.current.parentNode : null;
        if (this.paginator.get('recordOffset') < 1) {
            if (par && this.current === this.link) {
                par.insertBefore(this.span,this.current);
                par.removeChild(this.current);
                this.current = this.span;
            }
        } else {
            if (par && this.current === this.span) {
                par.insertBefore(this.link,this.current);
                par.removeChild(this.current);
                this.current = this.link;
            }
        }
    },

    /**
     * Listener for the link's onclick event.  Pass new value to setPage method.
     * @method onClick
     * @param e {DOMEvent} The click event
     */
    onClick : function (e) {
        YAHOO.util.Event.stopEvent(e);
        this.paginator.setPage(1);
    }
};



/**
 * Plugin to generate the link to jump to the last page.
 *
 * @namespace YAHOO.widget.Paginator.Plugin
 * @class LastPageLink
 * @for YAHOO.widget.Paginator
 *
 * @constructor
 * @param paginator {Pagintor} Paginator instance to attach to
 */
Plugin.LastPageLink = function (paginator) {
    this.paginator = paginator;

    this.paginator.createEvent('lastPageLinkLabelChange');
    this.paginator.createEvent('lastPageLinkClassChange');

    this.paginator.subscribe('recordOffsetChange',this.update,this,true);
    this.paginator.subscribe('totalRecordsChange',this.update,this,true);
    this.paginator.subscribe('rowsPerPageChange', this.update,this,true);

    // TODO: make this work
    this.paginator.subscribe('lastPageLinkLabelChange',this.update,this,true);
    this.paginator.subscribe('lastPageLinkClassChange', this.update,this,true);
};

/**
 * Decorates Paginator instances with new attributes. Called during
 * Paginator instantiation.
 * @method init
 * @param paginator {Paginator} Paginator instance to decorate
 * @static
 */
Plugin.LastPageLink.init = function (paginator) {

    /**
     * Used as innerHTML for the last page link/span.
     * @attribute lastPageLinkLabel
     * @default 'last&nbsp;&gt;&gt;'
     */
    paginator.setAttributeConfig('lastPageLinkLabel', {
        value : 'last&nbsp;&gt;&gt;',
        validator : l.isString
    });

    /**
     * CSS class assigned to the link/span
     * @attribute lastPageLinkClass
     * @default 'yui-pg-last'
     */
    paginator.setAttributeConfig('lastPageLinkClass', {
        value : 'yui-pg-last',
        validator : l.isString
    });
};

Plugin.LastPageLink.prototype = {

    /**
     * Currently placed HTMLElement node
     * @property current
     * @type HTMLElement
     * @private
     */
    current   : null,

    /**
     * Link HTMLElement node
     * @property link
     * @type HTMLElement
     * @private
     */
    link      : null,

    /**
     * Span node (inactive link)
     * @property span
     * @type HTMLElement
     * @private
     */
    span      : null,

    /**
     * Empty place holder node for when the last page link is inappropriate to
     * display in any form (unlimited paging).
     * @property na
     * @type HTMLElement
     * @private
     */
    na        : null,


    /**
     * Generate the nodes and return the appropriate node given the current
     * pagination state.
     * @method render
     * @return {HTMLElement}
     */
    render : function () {
        var p     = this.paginator,
            c     = p.get('lastPageLinkClass'),
            label = p.get('lastPageLinkLabel'),
            last  = p.getTotalPages();

        this.link = document.createElement('a');
        this.span = document.createElement('span');
        this.na   = this.span.cloneNode(false);

        this.link.href = '#';
        this.link.className = c;
        this.link.innerHTML = label;
        YAHOO.util.Event.on(this.link,'click',this.onClick,this,true);

        this.span.className = c;
        this.span.innerHTML = label;

        switch (last) {
            case YAHOO.widget.Paginator.VALUE_UNLIMITED :
                    this.current = this.na; break;
            case p.getCurrentPage() :
                    this.current = this.span; break;
            default :
                    this.current = this.link;
        }

        return this.current;
    },

    /**
     * Swap the link, span, and na nodes if appropriate.
     * @method update
     * @param e {CustomEvent} The calling change event (ignored)
     */
    update : function (e) {
        if (e && e.prevValue === e.newValue) {
            return;
        }

        var par   = this.current ? this.current.parentNode : null,
            after = this.link;

        if (par) {
            switch (this.paginator.getTotalPages()) {
                case YAHOO.widget.Paginator.VALUE_UNLIMITED :
                        after = this.na; break;
                case this.paginator.getCurrentPage() :
                        after = this.span; break;
            }

            if (this.current !== after) {
                par.insertBefore(after,this.current);
                par.removeChild(this.current);
                this.current = after;
            }
        }
    },

    /**
     * Listener for the link's onclick event.  Passes to setPage method.
     * @method onClick
     * @param e {DOMEvent} The click event
     */
    onClick : function (e) {
        YAHOO.util.Event.stopEvent(e);
        this.paginator.setPage(this.paginator.getTotalPages());
    }
};


/**
 * Plugin to generate the link to jump to the previous page.
 *
 * @namespace YAHOO.widget.Paginator.Plugin
 * @class PreviousPageLink
 * @for YAHOO.widget.Paginator
 *
 * @constructor
 * @param paginator {Pagintor} Paginator instance to attach to
 */
Plugin.PreviousPageLink = function (paginator) {
    this.paginator = paginator;

    this.paginator.createEvent('previousPageLinkLabelChange');
    this.paginator.createEvent('previousPageLinkClassChange');

    this.paginator.subscribe('recordOffsetChange',this.update,this,true);

    // TODO: make this work
    this.paginator.subscribe('previousPageLinkLabelChange',this.update,this,true);
    this.paginator.subscribe('previousPageLinkClassChange',this.update,this,true);
};

/**
 * Decorates Paginator instances with new attributes. Called during
 * Paginator instantiation.
 * @method init
 * @param paginator {Paginator} Paginator instance to decorate
 * @static
 */
Plugin.PreviousPageLink.init = function (paginator) {

    /**
     * Used as innerHTML for the previous page link/span.
     * @attribute previousPageLinkLabel
     * @default '&lt;&nbsp;prev'
     */
    paginator.setAttributeConfig('previousPageLinkLabel', {
        value : '&lt;&nbsp;prev',
        validator : l.isString
    });

    /**
     * CSS class assigned to the link/span
     * @attribute previousPageLinkClass
     * @default 'yui-pg-previous'
     */
    paginator.setAttributeConfig('previousPageLinkClass', {
        value : 'yui-pg-previous',
        validator : l.isString
    });
};

Plugin.PreviousPageLink.prototype = {

    /**
     * Currently placed HTMLElement node
     * @property current
     * @type HTMLElement
     * @private
     */
    current   : null,

    /**
     * Link node
     * @property link
     * @type HTMLElement
     * @private
     */
    link      : null,

    /**
     * Span node (inactive link)
     * @property span
     * @type HTMLElement
     * @private
     */
    span      : null,


    /**
     * Generate the nodes and return the appropriate node given the current
     * pagination state.
     * @method render
     * @return {HTMLElement}
     */
    render : function () {
        var p     = this.paginator,
            c     = p.get('previousPageLinkClass'),
            label = p.get('previousPageLinkLabel');

        this.link     = document.createElement('a');
        this.span     = document.createElement('span');

        this.link.href = '#';
        this.link.className = c;
        this.link.innerHTML = label;
        YAHOO.util.Event.on(this.link,'click',this.onClick,this,true);

        this.span.className = c;
        this.span.innerHTML = label;

        this.current = p.get('recordOffset') < 1 ? this.span : this.link;
        return this.current;
    },

    /**
     * Swap the link and span nodes if appropriate.
     * @method update
     * @param e {CustomEvent} The calling change event
     */
    update : function (e) {
        if (e && e.prevValue === e.newValue) {
            return;
        }

        var par = this.current ? this.current.parentNode : null;
        if (this.paginator.get('recordOffset') < 1) {
            if (par && this.current === this.link) {
                par.insertBefore(this.span,this.current);
                par.removeChild(this.current);
                this.current = this.span;
            }
        } else {
            if (par && this.current === this.span) {
                par.insertBefore(this.link,this.current);
                par.removeChild(this.current);
                this.current = this.link;
            }
        }
    },

    /**
     * Listener for the link's onclick event.  Passes to setPage method.
     * @method onClick
     * @param e {DOMEvent} The click event
     */
    onClick : function (e) {
        YAHOO.util.Event.stopEvent(e);
        this.paginator.setPage(this.paginator.getPreviousPage());
    }
};



/**
 * Plugin to generate the link to jump to the next page.
 *
 * @namespace YAHOO.widget.Paginator.Plugin
 * @class NextPageLink
 * @for YAHOO.widget.Paginator
 *
 * @constructor
 * @param paginator {Pagintor} Paginator instance to attach to
 */
Plugin.NextPageLink = function (paginator) {
    this.paginator = paginator;

    this.paginator.createEvent('nextPageLinkLabelChange');
    this.paginator.createEvent('nextPageLinkClassChange');

    this.paginator.subscribe('recordOffsetChange',this.update,this,true);
    this.paginator.subscribe('totalRecordsChange',this.update,this,true);
    this.paginator.subscribe('rowsPerPageChange', this.update,this,true);

    // TODO: make this work
    this.paginator.subscribe('nextPageLinkLabelChange', this.update,this,true);
    this.paginator.subscribe('nextPageLinkClassChange', this.update,this,true);
};

/**
 * Decorates Paginator instances with new attributes. Called during
 * Paginator instantiation.
 * @method init
 * @param paginator {Paginator} Paginator instance to decorate
 * @static
 */
Plugin.NextPageLink.init = function (paginator) {

    /**
     * Used as innerHTML for the next page link/span.
     * @attribute nextPageLinkLabel
     * @default 'next&nbsp;&gt;'
     */
    paginator.setAttributeConfig('nextPageLinkLabel', {
        value : 'next&nbsp;&gt;',
        validator : l.isString
    });

    /**
     * CSS class assigned to the link/span
     * @attribute nextPageLinkClass
     * @default 'yui-pg-next'
     */
    paginator.setAttributeConfig('nextPageLinkClass', {
        value : 'yui-pg-next',
        validator : l.isString
    });
};

Plugin.NextPageLink.prototype = {

    /**
     * Currently placed HTMLElement node
     * @property current
     * @type HTMLElement
     * @private
     */
    current   : null,

    /**
     * Link node
     * @property link
     * @type HTMLElement
     * @private
     */
    link      : null,

    /**
     * Span node (inactive link)
     * @property span
     * @type HTMLElement
     * @private
     */
    span      : null,


    /**
     * Generate the nodes and return the appropriate node given the current
     * pagination state.
     * @method render
     * @return {HTMLElement}
     */
    render : function () {
        var p     = this.paginator,
            c     = p.get('nextPageLinkClass'),
            label = p.get('nextPageLinkLabel'),
            last  = p.getTotalPages();

        this.link     = document.createElement('a');
        this.span     = document.createElement('span');

        this.link.href = '#';
        this.link.className = c;
        this.link.innerHTML = label;
        YAHOO.util.Event.on(this.link,'click',this.onClick,this,true);

        this.span.className = c;
        this.span.innerHTML = label;

        this.current = p.getCurrentPage() === last ? this.span : this.link;

        return this.current;
    },

    /**
     * Swap the link and span nodes if appropriate.
     * @method update
     * @param e {CustomEvent} The calling change event
     */
    update : function (e) {
        if (e && e.prevValue === e.newValue) {
            return;
        }

        var last = this.paginator.getTotalPages(),
            par  = this.current ? this.current.parentNode : null;

        if (this.paginator.getCurrentPage() !== last) {
            if (par && this.current === this.span) {
                par.insertBefore(this.link,this.current);
                par.removeChild(this.current);
                this.current = this.link;
            }
        } else if (this.current === this.link) {
            if (par) {
                par.insertBefore(this.span,this.current);
                par.removeChild(this.current);
                this.current = this.span;
            }
        }
    },

    /**
     * Listener for the link's onclick event.  Passes to setPage method.
     * @method onClick
     * @param e {DOMEvent} The click event
     */
    onClick : function (e) {
        YAHOO.util.Event.stopEvent(e);
        this.paginator.setPage(this.paginator.getNextPage());
    }
};


/**
 * Plugin to generate the page links
 *
 * @namespace YAHOO.widget.Paginator.Plugin
 * @class PageLinks
 * @for YAHOO.widget.Paginator
 *
 * @constructor
 * @param paginator {Pagintor} Paginator instance to attach to
 */
Plugin.PageLinks = function (paginator) {
    this.paginator = paginator;

    this.paginator.createEvent('pageLinkClassChange');
    this.paginator.createEvent('currentPageClassChange');
    this.paginator.createEvent('pageLinksContainerClassChange');
    this.paginator.createEvent('pageLinksChange');

    this.paginator.subscribe('recordOffsetChange',this.update,this,true);
    this.paginator.subscribe('pageLinksChange',   this.rebuild,this,true);
    this.paginator.subscribe('totalRecordsChange',this.rebuild,this,true);
    this.paginator.subscribe('rowsPerPageChange', this.rebuild,this,true);
    this.paginator.subscribe('pageLinkClassChange', this.rebuild,this,true);
    this.paginator.subscribe('currentPageClassChange', this.rebuild,this,true);

    //TODO: Make this work
    this.paginator.subscribe('pageLinksContainerClassChange', this.rebuild,this,true);
};

/**
 * Decorates Paginator instances with new attributes. Called during
 * Paginator instantiation.
 * @method init
 * @param paginator {Paginator} Paginator instance to decorate
 * @static
 */
Plugin.PageLinks.init = function (paginator) {

    /**
     * CSS class assigned to each page link/span.
     * @attribute pageLinkClass
     * @default 'yui-pg-page'
     */
    paginator.setAttributeConfig('pageLinkClass', {
        value : 'yui-pg-page',
        validator : l.isString
    });

    /**
     * CSS class assigned to the current page span.
     * @attribute currentPageClass
     * @default 'yui-pg-current-page'
     */
    paginator.setAttributeConfig('currentPageClass', {
        value : 'yui-pg-current-page',
        validator : l.isString
    });

    /**
     * CSS class assigned to the span containing the page links.
     * @attribute pageLinksContainerClass
     * @default 'yui-pg-pages'
     */
    paginator.setAttributeConfig('pageLinksContainerClass', {
        value : 'yui-pg-pages',
        validator : l.isString
    });

    /**
     * Maximum number of page links to display at one time.
     * @attribute pageLinks
     * @default 10
     */
    paginator.setAttributeConfig('pageLinks', {
        value : 10,
        validator : l.isNumber
    });

    /**
     * Function used generate the innerHTML for each page link/span.  The
     * function receives as parameters the page number and a reference to the
     * paginator object.
     * @attribute pageLabelBuilder
     * @default function (page, paginator) { return page; }
     */
    paginator.setAttributeConfig('pageLabelBuilder', {
        value : function (page, paginator) { return page; },
        validator : l.isFunction
    });
};

/**
 * Calculates start and end page numbers given a current page, attempting
 * to keep the current page in the middle
 * @static
 * @method calculateRange
 * @param {int} currentPage  The current page
 * @param {int} totalPages   (optional) Maximum number of pages
 * @param {int} numPages     (optional) Preferred number of pages in range
 * @return {Array} [start_page_number, end_page_number]
 */
Plugin.PageLinks.calculateRange = function (currentPage,totalPages,numPages) {
    var UNLIMITED = YAHOO.widget.Paginator.VALUE_UNLIMITED,
        start, end, delta;

    if (!currentPage) {
        return null;
    }

    // Either has no pages, or unlimited pages.  Show none.
    if (numPages === 0 || totalPages === 0 ||
        (totalPages === UNLIMITED && numPages === UNLIMITED)) {
        return [0,-1];
    }

    // Limit requested pageLinks if there are fewer totalPages
    if (totalPages !== UNLIMITED) {
        numPages = numPages === UNLIMITED ?
                    totalPages :
                    Math.min(numPages,totalPages);
    }

    // Determine start and end, trying to keep current in the middle
    start = Math.max(1,Math.ceil(currentPage - (numPages/2)));
    if (totalPages === UNLIMITED) {
        end = start + numPages - 1;
    } else {
        end = Math.min(totalPages, start + numPages - 1);
    }

    // Adjust the start index when approaching the last page
    delta = numPages - (end - start + 1);
    start = Math.max(1, start - delta);

    return [start,end];
};


Plugin.PageLinks.prototype = {

    /**
     * Current page
     * @property current
     * @type number
     * @private
     */
    current     : null,

    /**
     * Span node containing the page links
     * @property container
     * @type HTMLElement
     * @private
     */
    container   : null,


    /**
     * Generate the nodes and return the container node containing page links
     * appropriate to the current pagination state.
     * @method render
     * @return {HTMLElement}
     */
    render : function () {
        var p = this.paginator;

        //Set up container
        this.container = document.createElement('span');
        this.container.className = p.get('pageLinksContainerClass');
        YAHOO.util.Event.on(this.container,'click',this.onClick,this,true);

        this.update({newValue : null, rebuild : true});

        return this.container;
    },

    /**
     * Update the links if appropriate
     * @method update
     * @param e {CustomEvent} The calling change event
     */
    update : function (e) {
        if (e && e.prevValue === e.newValue) {
            return;
        }

        var p           = this.paginator,
            currentPage = p.getCurrentPage();

        // TODO: don't update for totalRecordsChange if not applicable

        // Replace content if there's been a change
        if (this.current !== currentPage || e.rebuild) {
            var labelBuilder = p.get('pageLabelBuilder'),
                range        = Plugin.PageLinks.calculateRange(
                                currentPage,
                                p.getTotalPages(),
                                p.get('pageLinks')),
                start        = range[0],
                end          = range[1],
                content      = [],
                linkTemplate,i;

            linkTemplate = '<a href="#" class="' + p.get('pageLinkClass') +
                           '" page="';
            for (i = start; i <= end; ++i) {
                if (i === currentPage) {
                    content[content.length] =
                        '<span class="' + p.get('currentPageClass') + '">' +
                        labelBuilder(i,p) + '</span>';
                } else {
                    content[content.length] =
                        linkTemplate + i + '">' + labelBuilder(i,p) + '</a>';
                }
            }

            this.container.innerHTML = content.join('');
        }
    },

    /**
     * Force a rebuild of the page links.
     * @method rebuild
     * @param e {CustomEvent} The calling change event
     */
    rebuild     : function (e) {
        e.rebuild = true;
        this.update(e);
    },

    /**
     * Listener for the container's onclick event.  Looks for qualifying link
     * clicks, and pulls the page number from the link's page attribute.
     * Sends link's page attribute to the Paginator's setPage method.
     * @method onClick
     * @param e {DOMEvent} The click event
     */
    onClick : function (e) {
        var t = YAHOO.util.Event.getTarget(e);
        if (t && YAHOO.util.Dom.hasClass(t,
                        this.paginator.get('pageLinkClass'))) {

            YAHOO.util.Event.stopEvent(e);

            this.paginator.setPage(parseInt(t.getAttribute('page'),10));
        }
    }

};


/**
 * Plugin to generate the rows-per-page dropdown
 *
 * @namespace YAHOO.widget.Paginator.Plugin
 * @class RowsPerPageDropdown
 * @for YAHOO.widget.Paginator
 *
 * @constructor
 * @param paginator {Pagintor} Paginator instance to attach to
 */
Plugin.RowsPerPageDropdown = function (paginator) {
    this.paginator = paginator;

    this.paginator.createEvent('rowsPerPageOptionsChange');
    this.paginator.createEvent('rowsPerPageDropdownClassChange');

    this.paginator.subscribe('rowsPerPageChange',this.update,this,true);
    this.paginator.subscribe('rowsPerPageOptionsChange',this.rebuild,this,true);

    // TODO: make this work
    this.paginator.subscribe('rowsPerPageDropdownClassChange',this.rebuild,this,true);
};

/**
 * Decorates Paginator instances with new attributes. Called during
 * Paginator instantiation.
 * @method init
 * @param paginator {Paginator} Paginator instance to decorate
 * @static
 */
Plugin.RowsPerPageDropdown.init = function (paginator) {

    /**
     * Array of available rows-per-page sizes.  Converted into select options.
     * Array values may be positive integers or object literals in the form<br>
     * { value : NUMBER, text : STRING }
     * @attribute rowsPerPageOptions
     * @default []
     */
    paginator.setAttributeConfig('rowsPerPageOptions', {
        value : [],
        validator : l.isArray
    });

    /**
     * CSS class assigned to the select node
     * @attribute rowsPerPageDropdownClass
     * @default 'yui-pg-rpp-options'
     */
    paginator.setAttributeConfig('rowsPerPageDropdownClass', {
        value : 'yui-pg-rpp-options',
        validator : l.isString
    });
};

Plugin.RowsPerPageDropdown.prototype = {

    /**
     * select node
     * @property select
     * @type HTMLElement
     * @private
     */
    select  : null,


    /**
     * Generate the select and option nodes and returns the select node.
     * @method render
     * @return {HTMLElement}
     */
    render : function () {
        this.select = document.createElement('select');
        this.select.className = this.paginator.get('rowsPerPageDropdownClass');
        this.select.title = 'Rows per page';

        YAHOO.util.Event.on(this.select,'change',this.onChange,this,true);

        this.rebuild();

        return this.select;
    },

    /**
     * Select the appropriate option if changed.
     * @method update
     * @param e {CustomEvent} The calling change event
     */
    update : function (e) {
        if (e && e.prevValue === e.newValue) {
            return;
        }

        var rpp     = this.paginator.get('rowsPerPage'),
            options = this.select.options,
            i,len;

        for (i = 0, len = options.length; i < len; ++i) {
            if (parseInt(options[i].value,10) === rpp) {
                options[i].selected = true;
            }
        }
    },


    /**
     * (Re)generate the select options.
     * @method rebuild
     */
    rebuild : function (e) {
        var p       = this.paginator,
            sel     = this.select,
            options = p.get('rowsPerPageOptions'),
            opt_tem = document.createElement('option'),
            i,len;

        while (sel.firstChild) {
            sel.removeChild(sel.firstChild);
        }

        for (i = 0, len = options.length; i < len; ++i) {
            var node = opt_tem.cloneNode(false),
                opt  = options[i];
            node.value = l.isValue(opt.value) ? opt.value : opt;
            node.innerHTML = l.isValue(opt.text) ? opt.text : opt;
            sel.appendChild(node);
        }

        this.update();
    },

    /**
     * Listener for the select's onchange event.  Sent to setRowsPerPage method.
     * @method onChange
     * @param e {DOMEvent} The change event
     */
    onChange : function (e) {
        this.paginator.setRowsPerPage(
                parseInt(this.select.options[this.select.selectedIndex].value,10));
    }
};



/**
 * Plugin to generate the textual report of current pagination status.  E.g.
 * "Now viewing page 1 of 13".
 *
 * @namespace YAHOO.widget.Paginator.Plugin
 * @class CurrentPageReport
 * @for YAHOO.widget.Paginator
 *
 * @constructor
 * @param paginator {Pagintor} Paginator instance to attach to
 */
Plugin.CurrentPageReport = function (paginator) {
    this.paginator = paginator;

    this.paginator.createEvent('pageReportClassChange');
    this.paginator.createEvent('pageReportTemplateChange');

    this.paginator.subscribe('recordOffsetChange',this.update,this,true);
    this.paginator.subscribe('totalRecordsChange',this.update,this,true);
    this.paginator.subscribe('rowsPerPageChange', this.update,this,true);
    this.paginator.subscribe('pageReportTemplateChange', this.update,this,true);

    //TODO: make this work
    this.paginator.subscribe('pageReportClassChange', this.update,this,true);
};

/**
 * Decorates Paginator instances with new attributes. Called during
 * Paginator instantiation.
 * @method init
 * @param paginator {Paginator} Paginator instance to decorate
 * @static
 */
Plugin.CurrentPageReport.init = function (paginator) {

    /**
     * CSS class assigned to the span containing the info.
     * @attribute pageReportClass
     * @default 'yui-pg-current'
     */
    paginator.setAttributeConfig('pageReportClass', {
        value : 'yui-pg-current',
        validator : l.isString
    });

    /**
     * Used as innerHTML for the span.  Place holders in the form of {name}
     * will be replaced with the so named value from the key:value map
     * generated by the function held in the pageReportValueGenerator attribute.
     * @attribute pageReportTemplate
     * @default '({currentPage} of {totalPages})'
     * @see pageReportValueGenerator attribute
     */
    paginator.setAttributeConfig('pageReportTemplate', {
        value : '({currentPage} of {totalPages})',
        validator : l.isString
    });

    /**
     * Function to generate the value map used to populate the
     * pageReportTemplate.  The function is passed the Paginator instance as a
     * parameter.  The default function returns a map with the following keys:
     * <ul>
     * <li>currentPage</li>
     * <li>totalPages</li>
     * <li>startIndex</li>
     * <li>endIndex</li>
     * <li>startRecord</li>
     * <li>endRecord</li>
     * <li>totalRecords</li>
     * </ul>
     * @attribute pageReportValueGenarator
     */
    paginator.setAttributeConfig('pageReportValueGenerator', {
        value : function (paginator) {
            var curPage = paginator.getCurrentPage(),
                records = paginator.getPageRecords(curPage);

            return {
                'currentPage' : curPage,
                'totalPages'  : paginator.getTotalPages(),
                'startIndex'  : records[0],
                'endIndex'    : records[1],
                'startRecord' : records[0] + 1,
                'endRecord'   : records[1] + 1,
                'totalRecords': paginator.get('totalRecords')
            };
        },
        validator : l.isFunction
    });
};

/**
 * Replace place holders in a string with the named values found in an
 * object literal.
 * @static
 * @method sprintf
 * @param template {string} The content string containing place holders
 * @param values {object} The key:value pairs used to replace the place holders
 * @return {string}
 */
Plugin.CurrentPageReport.sprintf = function (template, values) {
    return template.replace(/{([\w\s\-]+)}/g, function (x,key) {
            return (key in values) ? values[key] : '';
        });
};

Plugin.CurrentPageReport.prototype = {

    /**
     * Span node containing the formatted info
     * @property span
     * @type HTMLElement
     * @private
     */
    span : null,


    /**
     * Generate the span containing info formatted per the pageReportTemplate
     * attribute.
     * @method render
     * @return {HTMLElement}
     */
    render : function () {
        this.span = document.createElement('span');
        this.span.className = this.paginator.get('pageReportClass');
        this.update();
        
        return this.span;
    },
    
    /**
     * Regenerate the content of the span if appropriate. Calls
     * CurrentPageReport.sprintf with the value of the pageReportTemplate
     * attribute and the value map returned from pageReportValueGenerator
     * function.
     * @method update
     * @param e {CustomEvent} The calling change event
     */
    update : function (e) {
        if (e && e.prevValue === e.newValue) {
            return;
        }


        this.span.innerHTML = Plugin.CurrentPageReport.sprintf(
            this.paginator.get('pageReportTemplate'),
            this.paginator.get('pageReportValueGenerator')(this.paginator));
    }
};

})();
