YAHOO.widget.Paginator = function (config) {
    config = YAHOO.lang.isObject(config) ? config : {};
    var attrib, initialPage, records, perPage;

    this._initConfig();

    this._initEvents();

    // Update with config values
    for (attrib in config) {
        this.set(attrib,config[attrib]);
    }

    // Calculate the initial record offset
    initialPage = this.get('initialPage');
    records     = this.get('totalRecords');
    perPage     = this.get('rowsPerPage');
    if (initialPage > 1 && perPage !== YAHOO.widget.Paginator.VALUE_UNLIMITED) {
        var startIndex = (initialPage - 1) * perPage;
        if (records === YAHOO.widget.Paginator.VALUE_UNLIMITED || startIndex < records) {
            this.set('recordOffset', startIndex);
        }
    }

    this._initialized = true;
}
YAHOO.lang.augmentProto(YAHOO.widget.Paginator, YAHOO.util.EventProvider);
YAHOO.lang.augmentProto(YAHOO.widget.Paginator, YAHOO.util.AttributeProvider);


/**
 * Incrementing index used to give instances unique ids.
 * @static
 * @property id
 * @private
 */
YAHOO.widget.Paginator.id = 0;

YAHOO.widget.Paginator.VALUE_UNLIMITED = -1;

YAHOO.widget.Paginator.CLASS_CONTAINER = 'yui-pg-container';
YAHOO.widget.Paginator.CLASS_DISABLED  = 'yui-pg-disabled';
YAHOO.widget.Paginator.CLASS_SELECTED  = 'yui-pg-selected';
YAHOO.widget.Paginator.CLASS_PAGE      = 'yui-pg-page';
YAHOO.widget.Paginator.CLASS_FIRST     = 'yui-pg-first';
YAHOO.widget.Paginator.CLASS_LAST      = 'yui-pg-last';
YAHOO.widget.Paginator.CLASS_PREVIOUS  = 'yui-pg-previous';
YAHOO.widget.Paginator.CLASS_NEXT      = 'yui-pg-next';

YAHOO.widget.Paginator.CLASS_PAGE_SIZE_OPTIONS = 'yui-pg-sizes';

YAHOO.widget.Paginator.hasClassRE = new RegExp("("+[ YAHOO.widget.Paginator.CLASS_DISABLED,
                                        YAHOO.widget.Paginator.CLASS_SELECTED,
                                        YAHOO.widget.Paginator.CLASS_PAGE,
                                        YAHOO.widget.Paginator.CLASS_FIRST,
                                        YAHOO.widget.Paginator.CLASS_LAST,
                                        YAHOO.widget.Paginator.CLASS_PREVIOUS,
                                        YAHOO.widget.Paginator.CLASS_NEXT ].join('|')+")");
/**
 * Calculates start and end page numbers given a current page, attempting
 * to keep the current page in the middle
 * @static
 * @method calculatePageRange
 * @param {int} currentPage  The current page
 * @param {int} totalPages   (optional) Maximum number of pages
 * @param {int} numPages     (optional) Preferred number of pages in range
 * @returns {Array} [{int} startPage, {int} endPage]
 * @public
 */
YAHOO.widget.Paginator.calculatePageRange = function (currentPage,totalPages,numPages) {
    var start, end, delta;

    if (!currentPage) {
        return null;
    }

    // Either has no pages, or unlimited pages.  Show none.
    if (numPages == 0 || totalPages == 0
    ||  (totalPages === YAHOO.widget.Paginator.VALUE_UNLIMITED &&
         numPages   === YAHOO.widget.Paginator.VALUE_UNLIMITED)) {
        return [0,-1];
    }

    // Limit requested pageLinks if there are fewer totalPages
    if (totalPages !== YAHOO.widget.Paginator.VALUE_UNLIMITED) {
        numPages = numPages === YAHOO.widget.Paginator.VALUE_UNLIMITED ?
                    totalPages :
                    Math.min(numPages,totalPages);
    }

    // Determine start and end, trying to keep current in the middle
    start = Math.max(1,Math.ceil(currentPage - (numPages/2)));
    if (totalPages === YAHOO.widget.Paginator.VALUE_UNLIMITED) {
        end = start + numPages - 1;
    } else {
        end = Math.min(totalPages, start + numPages - 1);
    }

    // Adjust the start index when approaching the last page
    delta = numPages - (end - start + 1);
    start = Math.max(1, start - delta);

    return [start,end];
};

YAHOO.widget.Paginator.prototype._initConfig = function () {

    /**
     * Total number of records to paginate through
     * @property totalRecords
     * @type integer
     * @default YAHOO.widget.Paginator.VALUE_UNLIMITED
     * @public
     */
    this.setAttributeConfig('totalRecords', {
        value     : YAHOO.widget.Paginator.VALUE_UNLIMITED,
        validator : YAHOO.lang.isNumber
    });

    /**
     * Number of records constituting a <q>page</q>
     * @property rowsPerPage
     * @type integer
     * @public
     */
    this.setAttributeConfig('rowsPerPage', {
        value     : 0,
        validator : YAHOO.lang.isNumber
    });

    /**
     * Array of available page sizes
     * @property rowsPerPageOptions
     * @type Array of integers
     * @public
     */
    this.setAttributeConfig('rowsPerPageOptions', {
        value     : [],
        validator : YAHOO.lang.isArray
    });

    /**
     * Number of page links to display
     * @property pageLinks
     * @type integer
     * @default YAHOO.widget.Paginator.VALUE_UNLIMITED
     * @public
     */
    this.setAttributeConfig('pageLinks', {
        value     : YAHOO.widget.Paginator.VALUE_UNLIMITED,
        validator : YAHOO.lang.isNumber
    });

    /**
     * Flag to show a Jump to page [ ] input
     * @property showPageInput
     * @type boolean
     * @default false
     * @public
     */
    this.setAttributeConfig('showPageInput', {
        value     : false,
        validator : YAHOO.lang.isBoolean
    });

    /**
     * Page to display on initial paint
     * @property initialPage
     * @type integer
     * @public
     */
    this.setAttributeConfig('initialPage', {
        value     : 1,
        validator : YAHOO.lang.isNumber
    });

    /**
     * Update the UI immediately upon interaction.  If false, changeRequest
     * subscribers or other external code will need to call <code>update</code>
     * manually to trigger repaint.
     * @property updateOnChange
     * @type boolean
     * @default false
     * @public
     */
    this.setAttributeConfig('updateOnChange', {
        value     : false,
        validator : YAHOO.lang.isBoolean
    });

    /**
     * Unique id assigned to this instance
     * @property id
     * @type integer
     * @readonly
     * @public
     */
    this.setAttributeConfig('id', {
        value    : YAHOO.widget.Paginator.id++,
        readOnly : true
    });

    /**
     * Stores the index offset from the first record (index 0) representing
     * the first record on the current page.
     * Alternately use <code>setPage(num)</code> or <code>setOffsetRecord(newOffset)</code>.
     * @property recordOffset
     * @type integer
     * @private
     */
    this.setAttributeConfig('recordOffset', {
        value     : 0,
        validator : function (newOffset) {
            var records = this.get('totalRecords');

            if (YAHOO.lang.isNumber(newOffset) && newOffset >= 0
            &&  (records === YAHOO.widget.Paginator.VALUE_UNLIMITED || newOffset < records)) {
                return true;
            }

            return false;
        }
    });

    /**
     * Indicator of whether the DOM nodes have been initially created
     * @property rendered
     * @type boolean
     * @readonly
     * @public
     */
    this.setAttributeConfig('rendered', {
        value    : false,
        readOnly : true
    });

    /**
     * Container nodes in which to render the pagination controls.
     * Using setContainers(containers) is faster.
     * @property containerNodes
     * @type Array
     * @private
     */
    this.setAttributeConfig('containerNodes', {
        value : []
    });

    // HACK: subscribe to own attribute change events to transform assigned
    // values after the fact, since there's no current method to transform
    // en route
    this.subscribe('containerNodesChange',
        function (change) { this.setContainers(change.newValue); }, this, true);
};

YAHOO.widget.Paginator.prototype.LABEL_FIRST      = '&lt;&lt; first';
YAHOO.widget.Paginator.prototype.LABEL_PREVIOUS   = '&lt; prev';
YAHOO.widget.Paginator.prototype.LABEL_NEXT       = 'next &gt;';
YAHOO.widget.Paginator.prototype.LABEL_LAST       = 'last &gt;&gt;';

YAHOO.widget.Paginator.prototype.render = function () {
    if (this.get('rendered')) {
        return true;
    }

    var containers = this.get('containerNodes');
    if (containers.length < 1) {
        return false;
    }

    this._initNodeCollections();

    for (var i = 0, len = containers.length; i < len; ++i) {
        var id_base = 'yui-pg' + this.get('id');
        YAHOO.util.Dom.addClass(containers[i], YAHOO.widget.Paginator.CLASS_CONTAINER);
        this._renderControls(containers[i],id_base,i,false);
    }

    // Set manually to support readOnly contract of the attribute
    this._configs.rendered.value = true;

    this.fireEvent('rendered',this.getState());
};

/**
 * Override these methods to define custom pagination controls.
 */
YAHOO.widget.Paginator.prototype._initNodeCollections = function () {
    this._pageNavNodes        = {
        pageLinkGroups : [],
        gotoInputs     : [],
        dropdowns      : []
    };
}

YAHOO.widget.Paginator.prototype._renderControls = function (container, id_base, containerIndex, isUpdate) {
    var Dom         = YAHOO.util.Dom,
        Event       = YAHOO.util.Event,
        d           = document,
        currentPage = this.getCurrentPage(),
        currentSize = this.get('rowsPerPage'),
        wrapperId   = id_base + '-pages' + containerIndex,
        wrapper, link, range, i;

    // Must have this info to paginate
    if (currentPage === null) {
        return;
    }

    // wrapping span
    if (isUpdate) {
        wrapper = d.getElementById(wrapperId);
        if (wrapper) {
            wrapper.parentNode.removeChild(wrapper);
        }
    }

    if (!wrapper) {
        wrapper = d.createElement('span');
        wrapper.id = wrapperId;
    }

    wrapper.innerHTML = '';

    // First
    link = this._createPageEl(id_base,YAHOO.widget.Paginator.CLASS_FIRST,currentPage);
    if (link) {
        wrapper.appendChild(link);
    }

    // Previous
    link = this._createPageEl(id_base,YAHOO.widget.Paginator.CLASS_PREVIOUS,currentPage);
    if (link) {
        wrapper.appendChild(link);
    }

    // Page links
    range = YAHOO.widget.Paginator.calculatePageRange(currentPage,
                    this.getTotalPages(),
                    this.get('pageLinks'));
    if (range) {
        for (i = range[0]; i <= range[1]; ++i) {
            link = this._createPageEl(id_base,YAHOO.widget.Paginator.CLASS_PAGE,currentPage,i);
            if (link) {
                wrapper.appendChild(link);
            }
        }
    }

    // Next
    link = this._createPageEl(id_base,YAHOO.widget.Paginator.CLASS_NEXT,currentPage);
    if (link) {
        wrapper.appendChild(link);
    }

    // Last
    link = this._createPageEl(id_base,YAHOO.widget.Paginator.CLASS_LAST,currentPage);
    if (link) {
        wrapper.appendChild(link);
    }

    if (!isUpdate) {
        Event.on(wrapper,'click',this._onClickHandler, this, true);

        this._pageNavNodes.pageLinkGroups.push(wrapper);
    }

    container.insertBefore(wrapper, container.firstChild);

    // Page size dropdown
    var sizeOptions = this.get('rowsPerPageOptions');
    if (sizeOptions && sizeOptions.length) {
        var dropdownId = id_base + '-pagesize' + containerIndex;
        var sizeOptionDropdown;

        if (isUpdate) {
            // Make sure the right option is selected
            sizeOptionDropdown = Dom.get(dropdownId);
            for (var i = 0, len = sizeOptions.length; i < len; ++i) {
                if (sizeOptions[i] == currentSize) {
                    sizeOptionDropdown.options[i].selected = true;
                    break;
                }
            }
        } else {
            sizeOptionDropdown = d.createElement('select');

            // Id and class the element
            Dom.addClass(sizeOptionDropdown,YAHOO.widget.Paginator.CLASS_PAGE_SIZE_OPTIONS);
            sizeOptionDropdown.id = dropdownId;

            // Add the size options
            for (var i = 0, len = sizeOptions.length; i < len; ++i) {
                var opt = d.createElement('option');
                opt.value = sizeOptions[i];
                opt.appendChild(d.createTextNode(sizeOptions[i]));
                if (sizeOptions[i] == currentSize) {
                    opt.selected = true;
                }

                sizeOptionDropdown.appendChild(opt);
            }

            // Hook up the change event listener
            Event.on(sizeOptionDropdown,'change',this._onPageSizeChange, this, true);
            // Add the select outside the page links wrapper
            container.insertBefore(sizeOptionDropdown, wrapper.nextSibling);

            this._pageNavNodes.dropdowns.push(sizeOptionDropdown);
        }
    }


};

YAHOO.widget.Paginator.prototype._createPageEl = function(id_base,pgClass,currentPage,page) {
    var Dom = YAHOO.util.Dom,
        d   = document,
        el;

    function elem(inactive, content) {
        var node;
        if (inactive) {
            node = d.createElement('span');
            Dom.addClass(node,YAHOO.widget.Paginator.CLASS_DISABLED);
        } else {
            node = d.createElement('a');
            node.href = '#';
        }
        node.innerHTML = content;
        return node;
    }

    switch (pgClass) {
        case YAHOO.widget.Paginator.CLASS_FIRST :
                el = elem((currentPage === 1),this.LABEL_FIRST);
                break;

        case YAHOO.widget.Paginator.CLASS_PREVIOUS :
                el = elem((currentPage === 1),this.LABEL_PREVIOUS);
                break;

        case YAHOO.widget.Paginator.CLASS_NEXT :
                el = elem(!this.hasNextPage(),this.LABEL_NEXT);
                break;

        case YAHOO.widget.Paginator.CLASS_LAST :
                if (this.get('totalRecords') === YAHOO.widget.Paginator.VALUE_UNLIMITED) {
                    return null;
                }
                el = elem(!this.hasNextPage(),this.LABEL_LAST); 
                break;

        case YAHOO.widget.Paginator.CLASS_PAGE :
                el = elem((page == currentPage), page);
                el.id = id_base + '-page' + page;
                if (Dom.hasClass(el,YAHOO.widget.Paginator.CLASS_DISABLED)) {
                    Dom.replaceClass(el,
                        YAHOO.widget.Paginator.CLASS_DISABLED,
                        YAHOO.widget.Paginator.CLASS_SELECTED);
                }
                break;

        default : return null;
    }

    Dom.addClass(el,pgClass);

    return el;
}

YAHOO.widget.Paginator.prototype._initEvents = function () {
    this.createEvent('rendered');
    this.createEvent('containerNodesChange');
    this.createEvent('updated');
    this.createEvent('changeRequest');
};

YAHOO.widget.Paginator.prototype._onClickHandler = function (e) {
    var Event = YAHOO.util.Event,
        t     = Event.getTarget(e),
        re,
        newRecords;

    if (t.nodeName.toLowerCase() !== 'a') {
        return;
    }

    if (YAHOO.widget.Paginator.hasClassRE.test(t.className)) {
        switch (RegExp.$1) {
            case YAHOO.widget.Paginator.CLASS_FIRST :
                    newPage = 1;
                    break;
            case YAHOO.widget.Paginator.CLASS_LAST :
                    newPage = this.getTotalPages();
                    break;
            case YAHOO.widget.Paginator.CLASS_PREVIOUS :
                    newPage = this.getPreviousPage();
                    break;
            case YAHOO.widget.Paginator.CLASS_NEXT :
                    newPage = this.getNextPage();
                    break;

            case YAHOO.widget.Paginator.CLASS_PAGE :
                    newPage = this._determinePage(t);
                    break;
            
            default : return;
        }

        Event.stopEvent(e);

        if (YAHOO.lang.isValue(newPage)) {
            if (this.get('updateOnChange')) {
                this.setPage(newPage);
                this.update();
            } else {
                this.fireEvent('changeRequest', this.getState({page:newPage}));
            }
        }
    }
};

YAHOO.widget.Paginator.prototype._determinePage = function (el) {
    if (el && el.nodeType == 1 && /page(\d+)/i.test(el.id)) {
        return parseInt(RegExp.$1,10);
    }
    return 1;
};

YAHOO.widget.Paginator.prototype._onPageSizeChange = function (e) {
    var sel            = YAHOO.util.Event.getTarget(e),
        newRowsPerPage = parseInt(sel.options[sel.selectedIndex].value,10);

    if (this.get('updateOnChange')) {
        this.set('rowsPerPage', newRowsPerPage);
        this.update();
    } else {
        this.fireEvent('changeRequest',
                        this.getState({rowsPerPage:newRowsPerPage}));
    }
};

/*
 * Make the UI reflect the data state.
 */
YAHOO.widget.Paginator.prototype.update = function () {
    if (!this.get('rendered')) {
        return this.render();
    }

    var containers = this.get('containerNodes');
    for (var i = 0, len = containers.length; i < len; ++i) {
        var id_base = 'yui-pg' + this.get('id');
        this._renderControls(containers[i], id_base, i, true);
    }

    this.fireEvent('updated', this.getState());
};





YAHOO.widget.Paginator.prototype.getPageRecords = function (page) {
    if (!YAHOO.lang.isNumber(page)) {
        return null;
    }

    var perPage = this.get('rowsPerPage'),
        records = this.get('totalRecords'),
        start, end;

    if (!perPage) {
        return null;
    }

    start = (page - 1) * perPage;
    if (records !== YAHOO.widget.Paginator.VALUE_UNLIMITED) {
        if (start > records) {
            return null;
        }
        end = Math.min(start + perPage, records);
    } else {
        end = start + perPage;
    }

    return [start,end];
};

YAHOO.widget.Paginator.prototype.getTotalPages = function () {
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
}
YAHOO.widget.Paginator.prototype.getTotalRecords = function () {
    return this.get('totalRecords');
};

YAHOO.widget.Paginator.prototype.hasPage = function (page) {
    if (!YAHOO.lang.isNumber(page) || page < 1) {
        return false;
    }

    var totalPages = this.getTotalPages();

    return (totalPages === YAHOO.widget.Paginator.VALUE_UNLIMITED || totalPages >= page);
};

YAHOO.widget.Paginator.prototype.getCurrentPage = function () {
    var perPage = this.get('rowsPerPage');
    if (!perPage) {
        return null;
    }
    return Math.floor(this.get('recordOffset') / perPage) + 1;
};
YAHOO.widget.Paginator.prototype.getCurrentRecords = function () {
    return this.getPageRecords(this.getCurrentPage());
}

YAHOO.widget.Paginator.prototype.hasNextPage = function () {
    var currentPage = this.getCurrentPage(),
        totalPages  = this.getTotalPages();

    if (currentPage === null) {
        return false;
    }

    return (totalPages === YAHOO.widget.Paginator.VALUE_UNLIMITED ? true : currentPage < totalPages);
};
YAHOO.widget.Paginator.prototype.getNextPage = function () {
    return this.hasNextPage() ? this.getCurrentPage() + 1 : null;
};
YAHOO.widget.Paginator.prototype.getNextRecords = function () {
    return this.hasNextPage() ?
            this.getPageRecords(this.getNextPage()) : null;
};

YAHOO.widget.Paginator.prototype.hasPreviousPage = function () {
    return (this.getCurrentPage() > 1);
};
YAHOO.widget.Paginator.prototype.getPreviousPage = function () {
    return (this.hasPreviousPage() ? this.getCurrentPage() - 1 : 1);
};
YAHOO.widget.Paginator.prototype.getPreviousRecords = function () {
    return this.hasPreviousPage() ?
            this.getPageRecords(this.getPreviousPage()) : null;
};

YAHOO.widget.Paginator.prototype.setPage = function (newPage) {
    return YAHOO.lang.isNumber(newPage) ?
            this.set('recordOffset',(newPage - 1) * this.get('rowsPerPage')) :
            false;
};

YAHOO.widget.Paginator.prototype.setRecordOffset = function (newOffset) {
    return this.set('recordOffset',newOffset);
};

/**
 * Sets the container nodes for the pagination controls.  Accepts an element id,
 * a DOM node, or an array of either.  Value stored in attribute
 * 'containerNodes'.
 * @method setContainers
 * @param {String|HTMLElement|Array(String|HTMLElement)} containers
 * @public
 */
YAHOO.widget.Paginator.prototype.setContainers = function (containers) {
    if (!containers) {
        return false;
    }
    containers = YAHOO.util.Dom.get(containers);

    if (containers && !YAHOO.lang.isArray(containers)) {
        containers = [containers];
    }

    // (Re)set the containers attribute value directly.
    // set('containerNodes',...) calls this method, so this avoids cyclical
    // refs.  Icky, I know.
    this._configs.containerNodes.value = containers || [];
};

YAHOO.widget.Paginator.prototype.getContainers = function() {
    return this.get('containerNodes');
};

YAHOO.widget.Paginator.prototype.getState = function (changes) {
    var currentState = {
        paginator    : this,
        page         : this.getCurrentPage(),
        totalRecords : this.get('totalRecords'),
        recordOffset : this.get('recordOffset'),
        rowsPerPage  : this.get('rowsPerPage')
    };

    if (!changes) {
        return currentState;
    }

    var newOffset = currentState.recordOffset;
    var state = {
        paginator    : this,
        before       : currentState,

        rowsPerPage  : changes.rowsPerPage || currentState.rowsPerPage,
        totalRecords : (YAHOO.lang.isNumber(changes.totalRecords) ?
                            Math.max(changes.totalRecords,YAHOO.widget.Paginator.VALUE_UNLIMITED) :
                            currentState.totalRecords)
    };

    if (state.totalRecords == 0) {
        newOffset  = 0;
        state.page = 0;
    } else {
        if (!YAHOO.lang.isNumber(changes.recordOffset)
        &&   YAHOO.lang.isNumber(changes.page)) {
            newOffset = (changes.page - 1) * state.rowsPerPage;
            if (state.totalRecords === YAHOO.widget.Paginator.VALUE_UNLIMITED) {
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

    return state;
};
