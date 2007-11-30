YAHOO.widget.Paginator = function (config) {
    config = YAHOO.lang.isObject(config) ? config : {};
    var attrib, initialPage, records, perPage;

    this._initConfig();

    this._initEvents();

    // Update with config values
    for (attrib in config) {
        this.set(attrib,config[attrib]);
    }

    this._initControlNodes();

    // Calculate the initial record offset
    initialPage = this.get('initialPage');
    records     = this.get('totalRecords');
    perPage     = this.get('rowsPerPage');
    if (initialPage > 1 && perPage !== YAHOO.widget.Paginator.VALUE_UNLIMITED) {
        var startIndex = (initialPage - 1) * perPage;
        if (records === YAHOO.widget.Paginator.VALUE_UNLIMITED || startIndex < records) {
            this._recordOffset = startIndex;
        }
    }

    this._initialized = true;
};
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

YAHOO.widget.Paginator.CLASS_PAGE_LINKS = 'yui-pg-page-links';
YAHOO.widget.Paginator.CLASS_DISABLED   = 'yui-pg-disabled';
YAHOO.widget.Paginator.CLASS_SELECTED   = 'yui-pg-selected';
YAHOO.widget.Paginator.CLASS_PAGE       = 'yui-pg-page';
YAHOO.widget.Paginator.CLASS_FIRST      = 'yui-pg-first';
YAHOO.widget.Paginator.CLASS_LAST       = 'yui-pg-last';
YAHOO.widget.Paginator.CLASS_PREVIOUS   = 'yui-pg-previous';
YAHOO.widget.Paginator.CLASS_NEXT       = 'yui-pg-next';

YAHOO.widget.Paginator.CLASS_PAGE_SIZE_OPTIONS = 'yui-pg-sizes';

YAHOO.widget.Paginator.CLASS_PAGE_INPUT        = 'yui-pg-jump';
YAHOO.widget.Paginator.CLASS_PAGE_INPUT_BUTTON = 'yui-pg-jump-go';

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
    if (numPages === 0 || totalPages === 0 ||
        (totalPages === YAHOO.widget.Paginator.VALUE_UNLIMITED &&
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

/**
 * Converts an input value/list to DOM node array.  This should probably be
 * in a different library.
 * @method _toNodeArray
 * @param string|HTMLElement|array list HTMLElement(s) or id(s) of DOM elements
 * @returns array(HTMLElement)
 * @static
 * @private
 */
YAHOO.widget.Paginator._toNodeArray = function (list) {
    var nodes = null;
    if (list) {
        nodes = YAHOO.util.Dom.get(list);
    }
    if (!nodes) {
        return [];
    }

    if (!YAHOO.lang.isArray(nodes)) {
        nodes = [nodes];
    }
    return nodes;
};




// Instance members
YAHOO.widget.Paginator.prototype.LABEL_FIRST      = '&lt;&lt; first';
YAHOO.widget.Paginator.prototype.LABEL_PREVIOUS   = '&lt; prev';
YAHOO.widget.Paginator.prototype.LABEL_NEXT       = 'next &gt;';
YAHOO.widget.Paginator.prototype.LABEL_LAST       = 'last &gt;&gt;';
YAHOO.widget.Paginator.prototype.LABEL_GO_BUTTON  = 'go';
YAHOO.widget.Paginator.prototype.LABEL_JUMP       = 'Jump to page';

YAHOO.widget.Paginator.prototype._recordOffset    = 0;
YAHOO.widget.Paginator.prototype._controlNodes    = {};

// Instance methods
YAHOO.widget.Paginator.prototype._initConfig = function () {

    // Read only attributes

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


    // Constructor config options

    /**
     * REQUIRED. Number of records constituting a <q>page</q>
     * @property rowsPerPage
     * @type integer
     * @public
     */
    this.setAttributeConfig('rowsPerPage', {
        value     : 0,
        validator : YAHOO.lang.isNumber
    });

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
     * Include links to previous page and next page in page links
     * @property showNextPreviousLinks
     * @type boolean
     * @default true
     * @public
     */
    this.setAttributeConfig('showNextPreviousLinks', {
        value     : true,
        validator : YAHOO.lang.isBoolean
    });

    /**
     * Include links to first page and last page in page links
     * @property showFirstLastLinks
     * @type boolean
     * @default true
     * @public
     */
    this.setAttributeConfig('showFirstLastLinks', {
        value     : true,
        validator : YAHOO.lang.isBoolean
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
     * Include &quot;go&quot; buttons after page inputs.  This option works in
     * conjunction with showPageInput.
     * @property showPageInputGoButton
     * @type boolean
     * @default true
     * @public
     */
    this.setAttributeConfig('showPageInputGoButton', {
        value     : true,
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
     * Container node(s) in which to render pagination controls.
     * @property controlContainerNodes
     * @type string|HTMLElement|array
     * @default []
     * @public
     */
    this.setAttributeConfig('controlContainerNodes', {
        value     : [],
        validator : YAHOO.lang.isValue
    });

    /**
     * Container node(s) in which to render page links.
     * @property pageLinkContainerNodes
     * @type string|HTMLElement|array
     * @default []
     * @public
     */
    this.setAttributeConfig('pageLinkContainerNodes', {
        value     : [],
        validator : YAHOO.lang.isValue
    });

    /**
     * Input HTMLElement(s), or id(s) of, to control rows per page setting.
     * @property rowsPerPageNodes
     * @type string|HTMLElement|array
     * @default []
     * @public
     */
    this.setAttributeConfig('rowsPerPageNodes', {
        value     : [],
        validator : YAHOO.lang.isValue
    });

    /**
     * Input HTMLElement(s), or id(s) of, to control jumping to a specific page.
     * Value can take the form of an array of ids, HTMLElement nodes, or object
     * literals in the form {"input": id|HTMLElement, "button": id|HTMLElement}.
     * @property pageInputNodes
     * @type string|HTMLElement|object|array
     * @default []
     * @public
     */
    this.setAttributeConfig('pageInputNodes', {
        value     : [],
        validator : YAHOO.lang.isValue
    });
};

YAHOO.widget.Paginator.prototype._initControlNodes = function () {
    this._controlNodes = {
        controlContainerNodes : [],
        pageLinkContainerNodes: [],
        rowsPerPageNodes      : [],
        pageInputNodes        : []
    };

    this.setContainerNodes(        this.get('controlContainerNodes'));
    this.setPageLinkContainerNodes(this.get('pageLinkContainerNodes'));
    this.setRowsPerPageNodes(      this.get('rowsPerPageNodes'));
    this.setPageInputNodes(        this.get('pageInputNodes'));

};

YAHOO.widget.Paginator.prototype.render = function () {
    if (this.get('rendered')) {
        return true;
    }

    this.createControls();

    this.addControlEvents(this._controlNodes);

    this.placeControls(this._controlNodes);

    // Set manually to support readOnly contract of the attribute
    this._configs.rendered.value = true;

    this.fireEvent('rendered',this.getState());
};

YAHOO.widget.Paginator.prototype.createControls = function () {
    var id_base = 'yui-pg' + this.get('id');

    // Add the container class to configured node containers
    for (var i = 0, len = this._controlNodes.controlContainerNodes.length; i < len; ++i) {
        YAHOO.util.Dom.addClass(
            this._controlNodes.controlContainerNodes[i],
            YAHOO.widget.Paginator.CLASS_CONTAINER);
    }

    this._buildPageLinks(id_base,
                         this._controlNodes.controlContainerNodes,
                         this._controlNodes.pageLinkContainerNodes,
                         this.get('pageLinks'),
                         this.get('showNextPreviousLinks'),
                         this.get('showFirstLastLinks'));

    this._buildRowsPerPageControls(id_base,
                                   this._controlNodes.controlContainerNodes,
                                   this._controlNodes.rowsPerPageNodes,
                                   this.get('rowsPerPageOptions'),
                                   this.get('rowsPerPage'));

    this._buildPageInputControls(id_base,
                                 this._controlNodes.controlContainerNodes,
                                 this._controlNodes.pageInputNodes,
                                 this.get('showPageInput'),
                                 this.get('showPageInputGoButton'));

};

YAHOO.widget.Paginator.prototype._buildPageLinks = function (id_base,containers,linkContainers,numLinks,prevNext,firstLast) {
    var Dom = YAHOO.util.Dom,
        Pag = YAHOO.widget.Paginator,
        currentPage = this.getCurrentPage(),
        totalPages  = this.getTotalPages(),
        d = document,
        range, i, len, j, jlen;

    // Build the page link container nodes if containers declared and
    // any page links config is appropriately set
    if (containers.length > 0 && linkContainers.length === 0) {
        if (numLinks || prevNext || firstLast) {
            for (i = 0,len = containers.length; i < len; ++i) {
                var wrapper = d.createElement('span');
                wrapper.id = id_base + '-pages' + i;
                linkContainers[i] = wrapper;
            }
        }
    }

    // Calculate the page links to display
    range = Pag.calculatePageRange(currentPage, totalPages, numLinks);

    // cookie cutter function
    var elem = function (off,content,offClass) {
        offClass = offClass || YAHOO.widget.Paginator.CLASS_DISABLED;
        var el;
        if (off) {
            el = d.createElement('span');
            Dom.addClass(el,offClass);
        } else {
            el = d.createElement('a');
            el.href = "#";
        }
        el.innerHTML = content;
        return el;
    };

    // Create the page links, prev/next, first/last
    for (i = 0, len = linkContainers.length; i < len; ++i) {
        var links = linkContainers[i];
        var link = null;

        Dom.addClass(links,Pag.CLASS_PAGE_LINKS);
        links.innerHTML = '';

        if (firstLast) {
            link = elem((currentPage === 1), this.LABEL_FIRST);
            if (link) {
                Dom.addClass(link,Pag.CLASS_FIRST);
                links.appendChild(link);
            }
        }

        if (prevNext) {
            link = elem((currentPage === 1), this.LABEL_PREVIOUS);
            if (link) {
                Dom.addClass(link,Pag.CLASS_PREVIOUS);
                links.appendChild(link);
            }
        }

        // page links
        for (j = range[0], jlen = range[1] + 1; j < jlen; ++j) {
            link = elem((j === currentPage),j,Pag.CLASS_SELECTED);
            if (link) {
                Dom.addClass(link,Pag.CLASS_PAGE);
                links.appendChild(link);
            }
        }

        if (prevNext) {
            link = elem(!this.hasNextPage(), this.LABEL_NEXT);
            if (link) {
                Dom.addClass(link,Pag.CLASS_NEXT);
                links.appendChild(link);
            }
        }

        if (firstLast && totalPages != Pag.VALUE_UNLIMITED) {
            link = elem(!this.hasNextPage(), this.LABEL_LAST);
            if (link) {
                Dom.addClass(link,Pag.CLASS_LAST);
                links.appendChild(link);
            }
        }
    }
};

YAHOO.widget.Paginator.prototype._buildRowsPerPageControls = function (id_base,containers,controlNodes,sizeOptions,currentSize) {
    var d = document;
    // Build the page input nodes if containers declared, no nodes currently
    // identified, and config calls for their inclusion
    if (containers.length > 0 && controlNodes.length === 0 && sizeOptions.length > 0) {
        for (var i = 0, len = containers.length; i < len; ++i) {
            var sel = d.createElement('select');
            sel.id = id_base + '-size' + i;
            YAHOO.util.Dom.addClass(sel,YAHOO.widget.Paginator.CLASS_PAGE_SIZE_OPTIONS);
            for (var j = 0, jlen = sizeOptions.length; j < jlen; ++j) {
                var opt = d.createElement('option');
                opt.value = sizeOptions[j];
                opt.appendChild(d.createTextNode(sizeOptions[j]));
                if (sizeOptions[i] === currentSize) {
                    opt.selected = true;
                }

                sel.appendChild(opt);
            }
            controlNodes[i] = sel;
        }
    }
};

YAHOO.widget.Paginator.prototype._buildPageInputControls = function (id_base,containers,controlNodes,showInputs,showGoButtons) {
    // Build the page input nodes if containers declared, no nodes currently
    var d = document;
    // identified, and config calls for their inclusion
    if (containers.length > 0 && controlNodes.length === 0 && showInputs) {
        for (var i = 0,len = containers.length; i < len; ++i) {
            var inputSet = {
                input  : d.createElement('input'),
                button : showGoButtons ? d.createElement('input') : null
            };
            inputSet.input.id = id_base + '-jump' + i;
            inputSet.input.value = this.getCurrentPage();
            inputSet.input.type = 'text';
            inputSet.input.size = 3;
            YAHOO.util.Dom.addClass(inputSet.input,
                                    YAHOO.widget.Paginator.CLASS_PAGE_INPUT);

            if (showGoButtons) {
                inputSet.button.id = id_base + '-jump' + i + '-go';
                inputSet.button.type = 'button';
                inputSet.button.value = this.LABEL_GO_TO_PAGE;
            }

            controlNodes[i] = inputSet;
        }
    }
};

YAHOO.widget.Paginator.prototype.addControlEvents = function (controls) {
    var Event = YAHOO.util.Event,
        i,len;

    // Page links
    for (i = 0, len = controls.pageLinkContainerNodes.length; i < len; ++i) {
        Event.on(controls.pageLinkContainerNodes[i],'click',
                 this._pageClickHandler,this,true);
    }

    // Rows per page options
    for (i = 0, len = controls.rowsPerPageNodes.length; i < len; ++i) {
        Event.on(controls.rowsPerPageNodes[i], 'change',
                 this._rowsPerPageChangeHandler,this,true);
    }

    // Page input controls
    for (i = 0, len = controls.pageInputNodes.length; i < len; ++i) {
        // prefer button over simple input event
        var inputSet = controls.pageInputNodes[i];
        if (inputSet.button) {
            Event.on(inputSet.button,'click',
                     this._jumpToPageButtonHandler,this,true);
        } else {
            Event.on(inputSet.input,'keyup',
                     this._jumpToPageInputHandler,this,true);
        }
    }
};

/**
 * Override this method to render controls differently
 */
YAHOO.widget.Paginator.prototype.placeControls = function (controls) {
    for (var i = 0, len = controls.controlContainerNodes.length; i < len; ++i) {
        var container = controls.controlContainerNodes[i];
        
        if (controls.pageLinkContainerNodes.length) {
            if (!controls.pageLinkContainerNodes[i].parentNode) {
                container.appendChild(controls.pageLinkContainerNodes[i]);
            }
        }

        if (controls.rowsPerPageNodes.length) {
            if (!controls.rowsPerPageNodes[i].parentNode) {
                container.appendChild(controls.rowsPerPageNodes[i]);
            }
        }

        if (controls.pageInputNodes.length) {
            var inputSet = controls.pageInputNodes[i];
            if (!inputSet.input.parentNode) {
                var label = document.createElement('label');
                label.htmlFor = inputSet.input.id;
                label.innerHTML = this.LABEL_JUMP;
                container.appendChild(label);
                container.appendChild(inputSet.input);
                if (inputSet.button) {
                    container.appendChild(inputSet.button);
                }
            }
        }
    }
};

YAHOO.widget.Paginator.prototype.destroy = function () {
    // TODO
};


YAHOO.widget.Paginator.prototype._initEvents = function () {
    this.createEvent('rendered');
    this.createEvent('updated');
    this.createEvent('changeRequest');
};

YAHOO.widget.Paginator.prototype._pageClickHandler = function (e) {
    var Event = YAHOO.util.Event,
        t     = Event.getTarget(e),
        re,
        newPage;

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
    if (el && el.nodeType === 1) {
        return parseInt(el.innerHTML,10) || 1;
    }
    return 1;
};

YAHOO.widget.Paginator.prototype._rowsPerPageChangeHandler = function (e) {
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

YAHOO.widget.Paginator.prototype._jumpToPageButtonHandler = function (e) {
    var button = YAHOO.util.Event.getTarget(e);
    if (button && button.type === 'button' && /(.*-jump\d+)-go$/.test(button.id)) {
        var input = YAHOO.util.Dom.get(RegExp.$1);
        if (input) {
            var newPage = +input.value; // convert to number
            if (this.hasPage(newPage)) {
                if (this.get('updateOnChange')) {
                    this.setPage(newPage);
                    this.update();
                } else {
                    this.fireEvent('changeRequest',
                                   this.getState({page:newPage}));
                }
            } else {
                // TODO: report error to UI
                input.value = '';
            }
        }
    }
};

YAHOO.widget.Paginator.prototype._jumpToPageInputHandler = function (e) {
    // TODO: add KeyListener and send change request on pause or enter
};

YAHOO.widget.Paginator.prototype.update = function () {
    if (!this.get('rendered')) {
        return this.render();
    }

    var currentPage = this.getCurrentPage(),
        currentSize = this.get('rowsPerPage'),
        i,len, j, jlen;

    // rebuild page links
    for (i = 0, len = this._controlNodes.pageLinkContainerNodes.length; i < len; ++i) {
        var container = this._controlNodes.pageLinkContainerNodes[i];
        container.innerHTML = '';
    }
    this._buildPageLinks('yui-pg' + this.get('id'),
                         this._controlNodes.controlContainerNodes,
                         this._controlNodes.pageLinkContainerNodes,
                         this.get('pageLinks'),
                         this.get('showNextPreviousLinks'),
                         this.get('showFirstLastLinks'));

    // select the correct rows per page option
    for (i = 0, len = this._controlNodes.rowsPerPageNodes.length; i < len; ++i) {
        var options = this._controlNodes.rowsPerPageNodes[i].options;
        for (j = 0, jlen = options.length; j < jlen; ++j) {
            if (options[j].value == currentSize) {
                options[j].selected = true;
                break;
            }
        }
    }

    // replace input value with current page
    for (i = 0, len = this._controlNodes.pageInputNodes.length; i < len; ++i) {
        var inputSet = this._controlNodes.pageInputNodes[i];
        inputSet.input.value = currentPage;
    }

    this.fireEvent('updated', this.getState());
};



YAHOO.widget.Paginator.prototype.hasControls = function () {
    if (this.getPageLinkContainerNodes().length ||
        this.getRowsPerPageNodes().length ||
        this.getPageInputNodes().length) {
        return true;
    }

    return false;
};
YAHOO.widget.Paginator.prototype.getControlNodes = function () {
    return this._controlNodes;
};

YAHOO.widget.Paginator.prototype.getContainerNodes = function () {
    return this._controlNodes.controlContainerNodes;
};
YAHOO.widget.Paginator.prototype.setContainerNodes = function (list) {
    this._controlNodes.controlContainerNodes =
        YAHOO.widget.Paginator._toNodeArray(list);
};

YAHOO.widget.Paginator.prototype.getPageLinkContainerNodes = function () {
    return this._controlNodes.pageLinkContainerNodes;
};
YAHOO.widget.Paginator.prototype.setPageLinkContainerNodes = function (list) {
    this._controlNodes.pageLinkContainerNodes =
        YAHOO.widget.Paginator._toNodeArray(list);
};

YAHOO.widget.Paginator.prototype.getRowsPerPageNodes = function () {
    return this._controlNodes.rowsPerPageNodes;
};
YAHOO.widget.Paginator.prototype.setRowsPerPageNodes = function (list) {
    this._controlNodes.rowsPerPageNodes =
        YAHOO.widget.Paginator._toNodeArray(list);
};

YAHOO.widget.Paginator.prototype.getPageInputNodes = function () {
    return this._controlNodes.pageInputNodes;
};
YAHOO.widget.Paginator.prototype.setPageInputNodes = function (list) {
    var Dom = YAHOO.util.Dom;

    // build the page input node collection by hand because of optional
    // formats [elem|id,...] and [{input:elem|id, button:elem|id},...]
    var rawInputNodes  = this.get('pageInputNodes');
    if (rawInputNodes) {
        if (!YAHOO.lang.isArray(rawInputNodes)) {
            rawInputNodes = [rawInputNodes];
        }
        for (var i = 0, len = rawInputNodes.length; i < len; ++i) {
            var inputNode  = null,
                buttonNode = null;
            switch (typeof(rawInputNodes[i])) {
                case 'string' : inputNode = Dom.get(rawInputNodes[i]);
                                break;
                case 'object' : if (rawInputNodes[i].input) {
                                    inputNode = Dom.get(rawInputNodes[i].input);
                                }
                                if (rawInputNodes[i].button) {
                                    buttonNode = Dom.get(rawInputNodes[i].button);
                                }
                                break;
            }
            if (inputNode) {
                this._controlNodes.pageInputNodes.push(
                    { input : inputNode, button: buttonNode });
            }
        }
    }
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
};
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
    return Math.floor(this._recordOffset / perPage) + 1;
};
YAHOO.widget.Paginator.prototype.getCurrentRecords = function () {
    return this.getPageRecords(this.getCurrentPage());
};

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
    if (this.hasPage(newPage)) {
        this._recordOffset = (newPage - 1) * this.get('rowsPerPage');
        return true;
    }
    
    return false;
};

YAHOO.widget.Paginator.prototype.getRecordOffset = function () {
    return this._recordOffset;
};
YAHOO.widget.Paginator.prototype.setRecordOffset = function (newOffset) {
    var totalRecords = this.get('totalRecords');
    if (totalRecords === YAHOO.widget.Paginator.VALUE_UNLIMITED ||
        totalRecords > newOffset) {
        this._recordOffset = newOffset;
        return true;
    }

    return false;
};

YAHOO.widget.Paginator.prototype.setRowsPerPage = function (newRowsPerPage) {
    this.set('rowsPerPage',newRowsPerPage);
};

YAHOO.widget.Paginator.prototype.getState = function (changes) {
    var currentState = {
        paginator    : this,
        page         : this.getCurrentPage(),
        totalRecords : this.get('totalRecords'),
        recordOffset : this._recordOffset,
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

    if (state.totalRecords === 0) {
        newOffset  = 0;
        state.page = 0;
    } else {
        if (!YAHOO.lang.isNumber(changes.recordOffset) &&
             YAHOO.lang.isNumber(changes.page)) {
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
