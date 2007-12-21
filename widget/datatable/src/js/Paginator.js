/**
 * The Paginator widget provides a set of controls to navigate through paged
 * data.
 *
 * @namespace YAHOO.widget
 * @class Paginator
 * @uses YAHOO.util.EventProvider, YAHOO.util.AttributeProvider
 */

/**
 * @constructor
 * @param rowsPerPage {Number} Initial value for number of rows constituting one
 * &quot;page&quot;.
 * @param config {Object} Object literal to set instance and visualization
 * plugin attributes.
 */
YAHOO.widget.Paginator = function (config) {
    config = YAHOO.lang.isObject(config) ? config : {};
    var UNLIMITED = YAHOO.widget.Paginator.VALUE_UNLIMITED,
        attrib, initialPage, records, perPage;

    this.initConfig();

    this.initPlugins();

    this.initEvents();

    // Update with config values
    for (attrib in config) {
        this.set(attrib,config[attrib]);
    }

    // Calculate the initial record offset
    initialPage = this.get('initialPage');
    records     = this.get('totalRecords');
    perPage     = this.get('rowsPerPage');
    if (initialPage > 1 && perPage !== UNLIMITED) {
        var startIndex = (initialPage - 1) * perPage;
        if (records === UNLIMITED || startIndex < records) {
            this.set('recordOffset',startIndex);
        }
    }
};


// Static members
YAHOO.lang.augmentObject(YAHOO.widget.Paginator, {
    /**
     * Incrementing index used to give instances unique ids.
     * @static
     * @property id
     * @private
     */
    id : 0,

    /**
     * Used to identify unset, optional configurations, or used explicitly in the
     * case of totalRecords to indicate unlimited pagination.
     * @static
     * @property VALUE_UNLIMITED
     * @public
     * @final
     */
    VALUE_UNLIMITED : -1,

    /**
     * Map of plugin names to the plugin class.  Used by Paginator instances
     * while rendering their &quot;template&quot; attribute.
     * @static
     * @property PLUGINS
     * @type Object
     * @public
     */
    PLUGINS : {}

},true);





// Instance members
YAHOO.widget.Paginator.prototype = {

    /**
     * Array of nodes in which to render pagination controls.  This is set via
     * the &quot;containers&quot; attribute.
     * @property _containers
     * @type Array(HTMLElement)
     * @private
     */
    _containers : [],

    /**
     * Array of view plugin instances generated.  Populated during render and
     * Used to issue plugin UI updates when paginator.update() is called.
     * @property _plugins
     * @type Array(Paginator.Plugin)
     * @private
     */
    _plugins : null,



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
         */
        this.setAttributeConfig('initialPage', {
            value     : 1,
            validator : l.isNumber
        });

        /**
         * Template used to render controls.  The string will be used as
         * innerHTML on all specified container nodes.  Bracketed keys
         * (e.g. {pageLinks}) in the string will be replaced with the so named
         * view plugin.
         * @see registerViewPlugin
         * @attribute template
         * @type string
         * @default "{firstPage} {previousPage} {pageLinks} {nextPage} {lastPage}"
         */
        this.setAttributeConfig('template', {
            value : "{firstPageLink} {previousPageLink} {pageLinks} {nextPageLink} {lastPageLink}",
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
         * subscribers or other external code will need to explicitly set the new
         * values and call <code>update</code> to trigger repaint.
         * @attribute updateOnChange
         * @type boolean
         * @default false
         * @public
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
         * @public
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
         * @public
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
        var P = YAHOO.widget.Paginator.PLUGINS;
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

        // Listen for changes to totalRecords and alwaysVisible 
        this.subscribe('totalRecordsChange',this.updateVisibility,this,true);
        this.subscribe('alwaysVisibleChange',this.updateVisibility,this,true);
    },

    /**
     * Render the pagination controls per the format attribute into the
     * specified container nodes.
     * @method render
     * @public
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

        template = template.replace(/\{([a-z0-9_ \-]+)\}/gi,
            '<span class="plugin $1"></span>');
        for (var i = 0, len = this._containers.length; i < len; ++i) {
            YAHOO.util.Dom.addClass(this._containers[i],containerClass);
            this._containers[i].innerHTML = template;

            var markers = YAHOO.util.Dom.getElementsByClassName('plugin','span',this._containers[i]);
            for (var j = 0, jlen = markers.length; j < jlen; ++j) {
                var plugin = markers[j].className.replace(/\s*plugin\s+/g,''),
                    PluginClass = YAHOO.widget.Paginator.PLUGINS[plugin];

                if (PluginClass) {
                    var p = new PluginClass(this);
                    if (p instanceof YAHOO.widget.Paginator.Plugin) {
                        this._plugins[this._plugins.length] = p;
                        this._containers[i].insertBefore(p.render(),markers[j]);
                    }
                }

                this._containers[i].removeChild(markers[j]);
            }
        }

        // Set manually to support readOnly contract of the attribute
        if (this._containers.length) {
            this._configs.rendered.value = true;

            this.fireEvent('rendered',this.getState());
        }
    },

    /**
     * Removes controls from the page and unhooks events.
     * @method destroy
     * @public
     */
    destroy : function () {
        //TODO
    },

    /**
     * Hides the containers if there is only one page of data and attribute
     * alwaysVisible is false.  Conversely, it displays the containers if either
     * there is more than one page worth of data or alwaysVisible is turned on.
     * @method updateVisibility
     * @public
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




    getContainerNodes : function () {
        return this._containers;
    },

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
    getTotalRecords : function () {
        return this.get('totalRecords');
    },

    hasPage : function (page) {
        if (!YAHOO.lang.isNumber(page) || page < 1) {
            return false;
        }

        var totalPages = this.getTotalPages();

        return (totalPages === YAHOO.widget.Paginator.VALUE_UNLIMITED || totalPages >= page);
    },

    getCurrentPage : function () {
        var perPage = this.get('rowsPerPage');
        if (!perPage) {
            return null;
        }
        return Math.floor(this.get('recordOffset') / perPage) + 1;
    },
    getCurrentRecords : function () {
        return this.getPageRecords(this.getCurrentPage());
    },

    hasNextPage : function () {
        var currentPage = this.getCurrentPage(),
            totalPages  = this.getTotalPages();

        if (currentPage === null) {
            return false;
        }

        return (totalPages === YAHOO.widget.Paginator.VALUE_UNLIMITED ? true : currentPage < totalPages);
    },
    getNextPage : function () {
        return this.hasNextPage() ? this.getCurrentPage() + 1 : null;
    },
    getNextRecords : function () {
        return this.hasNextPage() ?
                this.getPageRecords(this.getNextPage()) : null;
    },

    hasPreviousPage : function () {
        return (this.getCurrentPage() > 1);
    },
    getPreviousPage : function () {
        return (this.hasPreviousPage() ? this.getCurrentPage() - 1 : 1);
    },
    getPreviousRecords : function () {
        return this.hasPreviousPage() ?
                this.getPageRecords(this.getPreviousPage()) : null;
    },

    setPage : function (newPage) {
        if (this.hasPage(newPage)) {
            this.set('recordOffset', (newPage - 1) * this.get('rowsPerPage'));
            return true;
        }
        
        return false;
    },

    getRecordOffset : function () {
        return this.get('recordOffset');
    },
    setRecordOffset : function (newOffset) {
        var totalRecords = this.get('totalRecords');
        if (totalRecords === YAHOO.widget.Paginator.VALUE_UNLIMITED ||
            totalRecords > newOffset) {
            this.set('recordOffset',newOffset);
            return true;
        }

        return false;
    },

    setRowsPerPage : function (newRowsPerPage) {
        this.set('rowsPerPage',newRowsPerPage);
    },

    requestPage : function (page) {
        if (page !== this.getCurrentPage()) {
            if (this.get('updateOnChange')) {
                this.setPage(page);
            } else {
                this.fireEvent('changeRequest',this.getState({'page':page}));
            }
        }
    },

    requestRowsPerPage : function (rpp) {
        if (rpp !== this.get('rowsPerPage')) {
            if (this.get('updateOnChange')) {
                this.set('rowsPerPage',rpp);
            } else {
                this.fireEvent('changeRequest',
                    this.getState({'rowsPerPage':rpp}));
            }
        }
    },

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

// Plugin base class
YAHOO.widget.Paginator.Plugin = function () {};

var Paginator = YAHOO.widget.Paginator;
var Plugin = Paginator.Plugin;

Plugin.prototype = {
    paginator : null,
    render    : function () {},
    update    : function () {}
};


// Plugin for displaying the link to jump to the first page
Plugin.FirstPageLink = function (paginator) {
    this.paginator = paginator;

    this.paginator.createEvent('firstPageLinkLabelChange');
    this.paginator.createEvent('firstPageLinkClassChange');

    this.paginator.subscribe('recordOffsetChange',this.update,this,true);

    // TODO: make this work
    this.paginator.subscribe('firstPageLinkLabelChange',this.update,this,true);
    this.paginator.subscribe('firstPageLinkClassChange',this.update,this,true);
};
YAHOO.lang.augmentObject(Plugin.FirstPageLink, {
    init : function (paginator) {
        paginator.setAttributeConfig('firstPageLinkLabel', {
            value : '&lt;&lt;&nbsp;first',
            validator : YAHOO.lang.isString
        });
        paginator.setAttributeConfig('firstPageLinkClass', {
            value : 'yui-pg-first',
            validator : YAHOO.lang.isString
        });
    }
});
YAHOO.lang.extend(Plugin.FirstPageLink, Plugin, {
    current   : null,
    link      : null,
    span      : null,

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

    update : function (type,e) {
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

    onClick : function (e) {
        YAHOO.util.Event.stopEvent(e);
        this.paginator.requestPage(1);
    }
});
Paginator.PLUGINS.firstPageLink = Plugin.FirstPageLink;



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
YAHOO.lang.augmentObject(Plugin.LastPageLink, {
    init : function (paginator) {
        paginator.setAttributeConfig('lastPageLinkLabel', {
            value : 'last&nbsp;&gt;&gt;',
            validator : YAHOO.lang.isString
        });
        paginator.setAttributeConfig('lastPageLinkClass', {
            value : 'yui-pg-last',
            validator : YAHOO.lang.isString
        });
    }
});
YAHOO.lang.extend(Plugin.LastPageLink, Plugin, {
    current   : null,
    link      : null,
    span      : null,
    na        : null,

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

    update : function (type,e) {
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

    onClick : function (e) {
        YAHOO.util.Event.stopEvent(e);
        this.paginator.requestPage(this.paginator.getTotalPages());
    }
});
Paginator.PLUGINS.lastPageLink = Plugin.LastPageLink;


Plugin.PreviousPageLink = function (paginator) {
    this.paginator = paginator;

    this.paginator.createEvent('previousPageLinkLabelChange');
    this.paginator.createEvent('previousPageLinkClassChange');

    this.paginator.subscribe('recordOffsetChange',this.update,this,true);

    // TODO: make this work
    this.paginator.subscribe('previousPageLinkLabelChange',this.update,this,true);
    this.paginator.subscribe('previousPageLinkClassChange',this.update,this,true);
};
YAHOO.lang.augmentObject(Plugin.PreviousPageLink, {
    init : function (paginator) {
        paginator.setAttributeConfig('previousPageLinkLabel', {
            value : '&lt;&nbsp;prev',
            validator : YAHOO.lang.isString
        });
        paginator.setAttributeConfig('previousPageLinkClass', {
            value : 'yui-pg-previous',
            validator : YAHOO.lang.isString
        });
    }
});
YAHOO.lang.extend(Plugin.PreviousPageLink, Plugin, {
    current   : null,
    link      : null,
    span      : null,

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

    update : function (type,e) {
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

    onClick : function (e) {
        YAHOO.util.Event.stopEvent(e);
        this.paginator.requestPage(this.paginator.getPreviousPage());
    }
});
Paginator.PLUGINS.previousPageLink = Plugin.PreviousPageLink;



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
YAHOO.lang.augmentObject(Plugin.NextPageLink, {
    init : function (paginator) {
        paginator.setAttributeConfig('nextPageLinkLabel', {
            value : 'next&nbsp;&gt;',
            validator : YAHOO.lang.isString
        });
        paginator.setAttributeConfig('nextPageLinkClass', {
            value : 'yui-pg-next',
            validator : YAHOO.lang.isString
        });
    }
});
YAHOO.lang.extend(Plugin.NextPageLink, Plugin, {
    current   : null,
    link      : null,
    span      : null,

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

    update : function (type,e) {
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

    onClick : function (e) {
        YAHOO.util.Event.stopEvent(e);
        this.paginator.requestPage(this.paginator.getNextPage());
    }
});
Paginator.PLUGINS.nextPageLink = Plugin.NextPageLink;


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
YAHOO.lang.augmentObject(Plugin.PageLinks,{
    init : function (paginator) {
        paginator.setAttributeConfig('pageLinkClass', {
            value : 'yui-pg-page',
            validator : YAHOO.lang.isString
        });
        paginator.setAttributeConfig('currentPageClass', {
            value : 'yui-pg-current-page',
            validator : YAHOO.lang.isString
        });
        paginator.setAttributeConfig('pageLinksContainerClass', {
            value : 'yui-pg-pages',
            validator : YAHOO.lang.isString
        });
        paginator.setAttributeConfig('pageLinks', {
            value : 10,
            validator : function (val) {
                if (YAHOO.lang.isNumber(val)) {
                    var last = this.getTotalPages();
                    return last === YAHOO.widget.Paginator.VALUE_UNLIMITED ||
                           last >= val;
                }

                return false;
            }
        });
        paginator.setAttributeConfig('pageLabelBuilder', {
            value : Plugin.PageLinks.buildLabel,
            validator : YAHOO.lang.isFunction
        });
        paginator.setAttributeConfig('pageLinkParser', {
            value : Plugin.PageLinks.parsePageLink,
            validator : YAHOO.lang.isFunction
        });
    },

    /**
     * Calculates start and end page numbers given a current page, attempting
     * to keep the current page in the middle
     * @static
     * @method calculateRange
     * @param {int} currentPage  The current page
     * @param {int} totalPages   (optional) Maximum number of pages
     * @param {int} numPages     (optional) Preferred number of pages in range
     * @returns {Array} [{int} startPage, {int} endPage]
     * @public
     */
    calculateRange : function (currentPage,totalPages,numPages) {
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
    },

    buildLabel : function (page, paginator) {
        return page;
    },

    parsePageLink : function (link, paginator) {
        return parseInt(link.innerHTML,10);
    }
});
YAHOO.lang.extend(Plugin.PageLinks, Plugin, {
    current     : null,
    container   : null,

    render : function () {
        var p = this.paginator;

        //Set up container
        this.container = document.createElement('span');
        this.container.className = p.get('pageLinksContainerClass');
        YAHOO.util.Event.on(this.container,'click',this.onClick,this,true);

        this.rebuild();

        return this.container;
    },

    update : function (type,e) {
        var p           = this.paginator,
            currentPage = p.getCurrentPage();

        // TODO: don't update for totalRecordsChange if not applicable

        // Replace content if there's been a change
        if (this.current !== currentPage || type === 'rebuild') {
            var labelBuilder = p.get('pageLabelBuilder'),
                range        = Plugin.PageLinks.calculateRange(
                                currentPage,
                                p.getTotalPages(),
                                p.get('pageLinks')),
                start        = range[0],
                end          = range[1],
                content      = [],
                linkTemplate,i;

            linkTemplate = '<a href="#" class="' + p.get('pageLinkClass') + '">';
            for (i = start; i <= end; ++i) {
                if (i === currentPage) {
                    content[content.length] =
                        '<span class="' + p.get('currentPageClass') + '">' +
                        labelBuilder(i,p) + '</span>';
                } else {
                    content[content.length] =
                        linkTemplate + labelBuilder(i,p) + '</a>';
                }
            }

            this.container.innerHTML = content.join('');
        }
    },

    rebuild     : function () {
        this.update('rebuild');
    },

    onClick : function (e) {
        var t = YAHOO.util.Event.getTarget(e);
        if (t && YAHOO.util.Dom.hasClass(t,
                        this.paginator.get('pageLinkClass'))) {

            YAHOO.util.Event.stopEvent(e);

            var parser = this.paginator.get('pageLinkParser');
            if (YAHOO.lang.isFunction(parser)) {
                parser = { method : parser };
            }

            this.paginator.requestPage(parser.method.call(parser.scope||{},t));
        }
    }

});
Paginator.PLUGINS.pageLinks = Plugin.PageLinks;


Plugin.RowsPerPageDropdown = function (paginator) {
    this.paginator = paginator;

    this.paginator.createEvent('rowsPerPageOptionsChange');
    this.paginator.createEvent('rowsPerPageDropdownClassChange');

    this.paginator.subscribe('rowsPerPageChange',this.update,this,true);
    this.paginator.subscribe('rowsPerPageOptionsChange',this.rebuild,this,true);

    // TODO: make this work
    this.paginator.subscribe('rowsPerPageDropdownClassChange',this.rebuild,this,true);
};
YAHOO.lang.augmentObject(Plugin.RowsPerPageDropdown, {
    init : function (paginator) {
        paginator.setAttributeConfig('rowsPerPageOptions', {
            value : [],
            validator : YAHOO.lang.isArray
        });
        paginator.setAttributeConfig('rowsPerPageDropdownClass', {
            value : 'yui-pg-rpp-options',
            validator : YAHOO.lang.isString
        });
    }
});
YAHOO.lang.extend(Plugin.RowsPerPageDropdown, Plugin, {
    select  : null,

    render : function () {
        this.select = document.createElement('select');
        this.select.className = this.paginator.get('rowsPerPageDropdownClass');

        YAHOO.util.Event.on(this.select,'change',this.onChange,this,true);

        this.rebuild();

        return this.select;
    },

    update : function (type,e) {
        var rpp     = this.paginator.get('rowsPerPage'),
            options = this.select.options,
            i,len;

        for (i = 0, len = options.length; i < len; ++i) {
            if (parseInt(options[i].value,10) === rpp) {
                options[i].selected = true;
            }
        }
    },

    rebuild : function () {
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
            node.value = YAHOO.lang.isValue(opt.value) ? opt.value : opt;
            node.innerHTML = YAHOO.lang.isValue(opt.text) ? opt.text : opt;
            sel.appendChild(node);
        }

        this.update();
    },

    onChange : function (e) {
        this.paginator.requestRowsPerPage(
                parseInt(this.select.options[this.select.selectedIndex].value,10));
    }
});
Paginator.PLUGINS.rowsPerPageDropdown = Plugin.RowsPerPageDropdown;



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
YAHOO.lang.augmentObject(Plugin.CurrentPageReport, {
    init   : function (paginator) {
        paginator.setAttributeConfig('pageReportClass', {
            value : 'yui-pg-current',
            validator : YAHOO.lang.isString
        });
        paginator.setAttributeConfig('pageReportTemplate', {
            value : '({currentPage} of {totalPages})',
            validator : YAHOO.lang.isString
        });
    },

    format : function (template, values) {
        return template.replace(/{([\w\s\-]+)}/g, function (x,key) {
                return (key in values) ? values[key] : '';
            });
    }
});
YAHOO.lang.extend(Plugin.CurrentPageReport, Plugin, {
    span : null,

    render : function () {
        this.span = document.createElement('span');
        this.span.className = this.paginator.get('pageReportClass');
        this.update();
        
        return this.span;
    },
    
    update : function (type,e) {
        var p       = this.paginator,
            curPage = p.getCurrentPage(),
            records = p.getPageRecords(curPage);

        this.span.innerHTML = Plugin.CurrentPageReport.format(
            this.paginator.get('pageReportTemplate'), {
                'currentPage' : curPage,
                'totalPages'  : p.getTotalPages(),
                'startIndex'  : records[0],
                'endIndex'    : records[1],
                'startRecord' : records[0] + 1,
                'endRecord'   : records[1] + 1,
                'totalRecords': p.get('totalRecords')
            });
    }
});
Paginator.PLUGINS.currentPageReport = Plugin.CurrentPageReport;

})();
