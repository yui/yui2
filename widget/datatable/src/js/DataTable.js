/**
 * The DataTable widget provides a progressively enhanced DHTML control for
 * displaying tabular data across A-grade browsers.
 *
 * @module datatable
 * @requires yahoo, dom, event, element, datasource
 * @optional connection, dragdrop
 * @title DataTable Widget
 * @beta
 */

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * DataTable class for the YUI DataTable widget.
 *
 * @namespace YAHOO.widget
 * @class DataTable
 * @uses YAHOO.util.EventProvider
 * @constructor
 * @param elContainer {HTMLElement} Container element for the TABLE.
 * @param aColumnDefs {Object[]} Array of object literal Column definitions.
 * @param oDataSource {YAHOO.util.DataSource} DataSource instance.
 * @param oConfigs {object} (optional) Object literal of configuration values.
 */
YAHOO.widget.DataTable = function(elContainer,aColumnDefs,oDataSource,oConfigs) {
    // Internal vars
    this._nIndex = YAHOO.widget.DataTable._nCount;
    this._sId = "yui-dt"+this._nIndex;

    // Initialize configs
    this._initConfigs(oConfigs);

    // Initialize DataSource
    this._initDataSource(oDataSource);
    if(!this._oDataSource) {
        YAHOO.log("Could not instantiate DataTable due to an invalid DataSource", "error", this.toString());
        return;
    }

    // Initialize ColumnSet
    this._initColumnSet(aColumnDefs);
    if(!this._oColumnSet) {
        YAHOO.log("Could not instantiate DataTable due to an invalid ColumnSet", "error", this.toString());
        return;
    }

    // Initialize RecordSet
    this._initRecordSet();
    if(!this._oRecordSet) {
        YAHOO.log("Could not instantiate DataTable due to an invalid RecordSet", "error", this.toString());
        return;
    }

    // Initialize container element
    this._initContainerEl(elContainer);
    if(!this._elContainer) {
        YAHOO.log("Could not instantiate DataTable due to an invalid container element", "error", this.toString());
        return;
    }

    // Initialize the rest of the DOM elements
    this._initTableEl();
    if(!this._elContainer || !this._elThead || !this._elTbody) {
        YAHOO.log("Could not instantiate DataTable due to an invalid DOM elements", "error", this.toString());
        return;
    }

    // Call Element's constructor after DOM elements are created
    // but *before* table is populated with data
    YAHOO.widget.DataTable.superclass.constructor.call(this, this._elContainer, this._oConfigs);

    //HACK: Set the paginator values.  Attribute doesn't afford for merging
    // obj value's keys.  It's all or nothing.  Merge in provided keys.
    if(this._oConfigs.paginator && !(this._oConfigs.paginator instanceof YAHOO.widget.Paginator)) {
        // Backward compatibility
        this.updatePaginator(this._oConfigs.paginator);
    }

    //HACK: Set initialRequest to undefined explicitly when necessary.
    // Attribute doesn't afford for default value of undefined.
    if((this._oConfigs.initialRequest === undefined) &&
            ((this._oDataSource.dataType == YAHOO.util.DataSource.TYPE_XHR) ||
            (this._oDataSource.dataType == YAHOO.util.DataSource.TYPE_JSFUNCTION))) {
        this._configs.initialRequest.value = undefined;
    }


    // Initialize inline Cell editing
    this._initCellEditorEl();

    // Initialize Column sort
    this._initColumnSort();

    YAHOO.widget.DataTable._nCount++;
    
    // Send out for initial data in an asynchronous request
    var initialRequest = this.get('initialRequest');
    if(initialRequest !== undefined) {
        this._oDataSource.sendRequest(initialRequest, this.onDataReturnInitializeTable, this);
    }
    else {
        this.showTableMessage(YAHOO.widget.DataTable.MSG_EMPTY, YAHOO.widget.DataTable.CLASS_EMPTY);
        this.fireEvent("initEvent");
        YAHOO.log("DataTable initialized with no rows", "info", this.toString());

    }
};

if(YAHOO.util.Element) {
    YAHOO.lang.extend(YAHOO.widget.DataTable, YAHOO.util.Element);
}
else {
    YAHOO.log("Missing dependency: YAHOO.util.Element","error",this.toString());
}

/////////////////////////////////////////////////////////////////////////////
//
// Superclass methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Implementation of Element's abstract method. Sets up config values.
 *
 * @method initAttributes
 * @param oConfigs {Object} (Optional) Object literal definition of configuration values.
 * @private
 */

YAHOO.widget.DataTable.prototype.initAttributes = function(oConfigs) {
    oConfigs = oConfigs || {};
    YAHOO.widget.DataTable.superclass.initAttributes.call(this, oConfigs);

    /**
    * @attribute summary
    * @description Value for the SUMMARY attribute.
    * @type String
    */
    this.setAttributeConfig("summary", {
        value: null,
        validator: YAHOO.lang.isString,
        method: function(sSummary) {
            this._elThead.parentNode.summary = sSummary;
        }
    });

    /**
    * @attribute selectionMode
    * @description Specifies row or cell selection mode. Accepts the following strings:
    *    <dl>
    *      <dt>"standard"</dt>
    *      <dd>Standard row selection with support for modifier keys to enable
    *      multiple selections.</dd>
    *
    *      <dt>"single"</dt>
    *      <dd>Row selection with modifier keys disabled to not allow
    *      multiple selections.</dd>
    *
    *      <dt>"singlecell"</dt>
    *      <dd>Cell selection with modifier keys disabled to not allow
    *      multiple selections.</dd>
    *
    *      <dt>"cellblock"</dt>
    *      <dd>Cell selection with support for modifier keys to enable multiple
    *      selections in a block-fashion, like a spreadsheet.</dd>
    *
    *      <dt>"cellrange"</dt>
    *      <dd>Cell selection with support for modifier keys to enable multiple
    *      selections in a range-fashion, like a calendar.</dd>
    *    </dl>
    *
    * @default "standard"
    * @type String
    */
    this.setAttributeConfig("selectionMode", {
        value: "standard",
        validator: YAHOO.lang.isString
    });

    /**
    * @attribute initialRequest
    * @description Defines the initial request that gets sent to the DataSource
    * during initialization.
    * @type Object
    * @default null
    */
    this.setAttributeConfig("initialRequest", {
        value: null
    });

    /**
    * @attribute renderLoopSize
    * @description How many rows to write to the DOM in each render loop.
    * @type Number
    * @default 1
    */
    this.setAttributeConfig("renderLoopSize", {
        value: 1,
        validator: function(n) {
            return (YAHOO.lang.isNumber(n) && (n > 0));
        }
    });

    /**
     * @attribute generateRequest
     * @description A function used to translate proposed DataTable state into
     * into a value which is then passed to the DataSource's sendRequest method.
     * This function is called to get the DataTable's initial data as well as
     * any data changes or requests such as pagination or sorting.  The method
     * is passed two params, an object literal with the state data and a
     * reference to the DataTable.
     * @type function
     * @default YAHOO.widget.DataTable._generateRequest
     */
    this.setAttributeConfig("generateRequest", {
        value: YAHOO.widget.DataTable._generateRequest,
        validator: YAHOO.lang.isFunction
    });

    /**
    * @attribute sortedBy
    * @description Object literal provides metadata for initial sort values if
    * data will arrive pre-sorted:
    * <dl>
    *     <dt>sortedBy.key</dt>
    *     <dd>{String} Key of sorted Column</dd>
    *     <dt>sortedBy.dir</dt>
    *     <dd>{String} Initial sort direction, either YAHOO.widget.DataTable.CLASS_ASC or YAHOO.widget.DataTable.CLASS_DESC</dd>
    * </dl>
    * @type Object
    */
    this.setAttributeConfig("sortedBy", {
        value: null,
        // TODO: accepted array for nested sorts
        validator: function(oNewSortedBy) {
            return (oNewSortedBy && (oNewSortedBy.constructor == Object) && oNewSortedBy.key);
        },
        method: function(oNewSortedBy) {
            // Remove ASC/DESC from TH
            var oOldSortedBy = this.get("sortedBy");
            if(oOldSortedBy && (oOldSortedBy.constructor == Object) && oOldSortedBy.key) {
                var oldColumn = this._oColumnSet.getColumn(oOldSortedBy.key);
                var oldThEl = this.getThEl(oldColumn);
                YAHOO.util.Dom.removeClass(oldThEl, YAHOO.widget.DataTable.CLASS_ASC);
                YAHOO.util.Dom.removeClass(oldThEl, YAHOO.widget.DataTable.CLASS_DESC);
            }

            // Set ASC/DESC on TH
            var column = (oNewSortedBy.column) ? oNewSortedBy.column : this._oColumnSet.getColumn(oNewSortedBy.key);
            if(column) {
                // Backward compatibility
                if(oNewSortedBy.dir && ((oNewSortedBy.dir == "asc") ||  (oNewSortedBy.dir == "desc"))) {
                    var newClass = (oNewSortedBy.dir && (oNewSortedBy.dir != YAHOO.widget.DataTable.CLASS_ASC)) ?
                            YAHOO.widget.DataTable.CLASS_DESC :
                            YAHOO.widget.DataTable.CLASS_ASC;
                    YAHOO.util.Dom.addClass(column.getThEl(), newClass);
                }
                else {
                     var sortClass = oNewSortedBy.dir || YAHOO.widget.DataTable.CLASS_ASC;
                     YAHOO.util.Dom.addClass(column.getThEl(), sortClass);
                }
            }
        }
    });

    /**
    * @attribute paginator
    * @description Stores an instance of YAHOO.widget.Paginator, or (for
    * backward compatibility), an object literal of pagination values in the
    * following form:<br>
    *   { containers:[], // UI container elements <br>
    *   rowsPerPage:500, // 500 rows <br>
    *   currentPage:1,  // page one <br>
    *   pageLinks:0,    // show all links <br>
    *   pageLinksStart:1, // first link is page 1 <br>
    *   dropdownOptions:null, // no dropdown <br>
    *   links: [], // links elements <br>
    *   dropdowns: [] } //dropdown elements
    *
    * @default null
    * @type {Object|YAHOO.widget.Paginator}
    */
    this.setAttributeConfig("paginator", {
        value : { // Backward compatibility
            rowsPerPage:500, // 500 rows per page
            currentPage:1,  // show page one
            startRecordIndex:0, // start with first Record
            totalRecords:0, // how many Records total
            totalPages:0, // how many pages total
            rowsThisPage:0, // how many rows this page
            pageLinks:0,    // show all links
            pageLinksStart:1, // first link is page 1
            dropdownOptions: null, //no dropdown
            containers:[], // Paginator container element references
            dropdowns: [], //dropdown element references,
            links: [] // links elements
        },
        validator : function (oNewPaginator) {
            if (typeof oNewPaginator === 'object' && oNewPaginator) {
                if (oNewPaginator instanceof YAHOO.widget.Paginator) {
                    return true;
                }
                else {
                    // Backward compatibility
                    if(oNewPaginator && (oNewPaginator.constructor == Object)) {
                        // Check for incomplete set of values
                        if((oNewPaginator.rowsPerPage !== undefined) &&
                                (oNewPaginator.currentPage !== undefined) &&
                                (oNewPaginator.startRecordIndex !== undefined) &&
                                (oNewPaginator.totalRecords !== undefined) &&
                                (oNewPaginator.totalPages !== undefined) &&
                                (oNewPaginator.rowsThisPage !== undefined) &&
                                (oNewPaginator.pageLinks !== undefined) &&
                                (oNewPaginator.pageLinksStart !== undefined) &&
                                (oNewPaginator.dropdownOptions !== undefined) &&
                                (oNewPaginator.containers !== undefined) &&
                                (oNewPaginator.dropdowns !== undefined) &&
                                (oNewPaginator.links !== undefined)) {

                            // Validate each value
                            if(YAHOO.lang.isNumber(oNewPaginator.rowsPerPage) &&
                                    YAHOO.lang.isNumber(oNewPaginator.currentPage) &&
                                    YAHOO.lang.isNumber(oNewPaginator.startRecordIndex) &&
                                    YAHOO.lang.isNumber(oNewPaginator.totalRecords) &&
                                    YAHOO.lang.isNumber(oNewPaginator.totalPages) &&
                                    YAHOO.lang.isNumber(oNewPaginator.rowsThisPage) &&
                                    YAHOO.lang.isNumber(oNewPaginator.pageLinks) &&
                                    YAHOO.lang.isNumber(oNewPaginator.pageLinksStart) &&
                                    YAHOO.lang.isArray(oNewPaginator.dropdownOptions) &&
                                    YAHOO.lang.isArray(oNewPaginator.containers) &&
                                    YAHOO.lang.isArray(oNewPaginator.dropdowns) &&
                                    YAHOO.lang.isArray(oNewPaginator.links)) {
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        },
        method : function (oNewPaginator) {
            // Hook into the pagintor's change event
            if (oNewPaginator instanceof YAHOO.widget.Paginator) {
                oNewPaginator.subscribe('changeRequest', this.onPaginatorChange, this, true);
            }
        }
    });

    /**
    * @attribute paginated
    * @description True if built-in client-side pagination is enabled
    * @default false
    * @type Boolean
    */
    this.setAttributeConfig("paginated", {
        value: false,
        validator: YAHOO.lang.isBoolean,
        method : function (on) {
            var curVal = this.get('paginated');
            var i,len;
            if (on == curVal) {
                return;
            }

            var oPaginator  = this.get('paginator');
            if (oPaginator instanceof YAHOO.widget.Paginator) {
                var containers = oPaginator.getContainerNodes();
                if (on) {
                    if (!containers.length) {
                        // Build the container nodes
                        var c_above = document.createElement('div');
                        c_above.id = this._sId + "-paginator0";
                        this._elContainer.insertBefore(c_above,this._elContainer.firstChild);

                        // ...and one below the table
                        var c_below = document.createElement('div');
                        c_below.id = this._sId + "-paginator1";
                        this._elContainer.appendChild(c_below);

                        containers = [c_above, c_below];
                        YAHOO.util.Dom.addClass(containers,
                                    YAHOO.widget.DataTable.CLASS_PAGINATOR);

                        oPaginator.set('containers',containers);
                    }

                    // rendering handled in refreshView
                    for (i = 0, len = containers.length; i < len; ++i) {
                        YAHOO.util.Dom.setStyle(containers[i],'display','');
                    }
                } else {
                    // Can't just remove nodes from the DataTable container element
                    // because we need to know if the pagination was rendered then
                    // hidden.
                    for (i = 0, len = containers.length; i < len; ++i) {
                        YAHOO.util.Dom.setStyle(containers[i],'display','none');
                    }
                }
            } else {
                // Backward compatibility--pagination generated here
                oPaginator = oPaginator || {
                    rowsPerPage     : 500,  // 500 rows per page
                    currentPage     : 1,    // show page one
                    startRecordIndex: 0,    // start with first Record
                    totalRecords    : 0,    // how many Records total
                    totalPages      : 0,    // how many pages total
                    rowsThisPage    : 0,    // how many rows this page
                    pageLinks       : 0,    // show all links
                    pageLinksStart  : 1,    // first link is page 1
                    dropdownOptions : null, // no dropdown
                    containers      : [],   // Paginator container element references
                    dropdowns       : [],   // dropdown element references,
                    links           : []    // links elements
                };
                var aContainerEls = oPaginator.containers;

                // Paginator is enabled
                if(on) {
                    // No containers found, create two from scratch
                    if(aContainerEls.length === 0) {
                        // One before TABLE
                        var pag0 = document.createElement("span");
                        pag0.id = this._sId + "-paginator0";
                        YAHOO.util.Dom.addClass(pag0, YAHOO.widget.DataTable.CLASS_PAGINATOR);
                        pag0 = this._elContainer.insertBefore(pag0, this._elContainer.firstChild);
                        aContainerEls.push(pag0);

                        // One after TABLE
                        var pag1 = document.createElement("span");
                        pag1.id = this._sId + "-paginator1";
                        YAHOO.util.Dom.addClass(pag1, YAHOO.widget.DataTable.CLASS_PAGINATOR);
                        pag1 = this._elContainer.appendChild(pag1);
                        aContainerEls.push(pag1);

                        // (re)set the paginator value directly
                        oPaginator.containers = aContainerEls;
                        this._configs.paginator.value= oPaginator;
                    }
                    else {
                        // Show each container
                        for(i=0; i<aContainerEls.length; i++) {
                            aContainerEls[i].style.display = "";
                        }
                    }

                    // Links are enabled
                    if(oPaginator.pageLinks > -1) {
                        var aLinkEls = oPaginator.links;
                        // No links containers found, create from scratch
                        if(aLinkEls.length === 0) {
                            for(i=0; i<aContainerEls.length; i++) {
                                // Create one links container per Paginator container
                                var linkEl = document.createElement("span");
                                linkEl.id = "yui-dt-pagselect"+i;
                                linkEl = aContainerEls[i].appendChild(linkEl);

                                // Add event listener
                                //TODO: anon fnc
                                YAHOO.util.Event.addListener(linkEl,"click",this._onPaginatorLinkClick,this);

                                 // Add directly to tracker
                                this._configs.paginator.value.links.push(linkEl);
                           }
                       }
                    }

                    for(i=0; i<aContainerEls.length; i++) {
                        // Create one SELECT element per Paginator container
                        var selectEl = document.createElement("select");
                        YAHOO.util.Dom.addClass(selectEl, YAHOO.widget.DataTable.CLASS_DROPDOWN);
                        selectEl = aContainerEls[i].appendChild(selectEl);
                        selectEl.id = "yui-dt-pagselect"+i;

                        // Add event listener
                        //TODO: anon fnc
                        YAHOO.util.Event.addListener(selectEl,"change",this._onPaginatorDropdownChange,this);

                        // Add DOM reference directly to tracker
                       this._configs.paginator.value.dropdowns.push(selectEl);

                        // Hide dropdown
                        if(!oPaginator.dropdownOptions) {
                            selectEl.style.display = "none";
                        }
                    }

                    //TODO: fire paginatorDisabledEvent & add to api doc
                    YAHOO.log("Paginator enabled", "info", this.toString());
                }
                // Pagination is disabled
                else {
                    // Containers found
                    if(aContainerEls.length > 0) {
                        // Destroy or just hide?

                        // Hide each container
                        for(i=0; i<aContainerEls.length; i++) {
                            aContainerEls[i].style.display = "none";
                        }

                        /*TODO?
                        // Destroy each container
                        for(i=0; i<aContainerEls.length; i++) {
                            YAHOO.util.Event.purgeElement(aContainerEls[i], true);
                            aContainerEls.innerHTML = null;
                            //TODO: remove container?
                            // aContainerEls[i].parentNode.removeChild(aContainerEls[i]);
                        }
                        */
                    }
                    //TODO: fire paginatorDisabledEvent & add to api doc
                    YAHOO.log("Paginator disabled", "info", this.toString());
                }
            }
        }
    });

    /**
     * @attribute paginationEventHandler
     * @description For use with YAHOO.widget.Paginator pagination.  A
     * handler function that receives the requestChange event from the
     * configured paginator.  The handler method will be passed these
     * parameters:
     * <ol>
     * <li>oState {Object} - an object literal describing the requested
     * pagination state</li>
     * <li>oSelf {DataTable} - The DataTable instance.</li>
     * </ol>
     * 
     * For pagination through dynamic or server side data, assign
     * YAHOO.widget.DataTable.handleDataSourcePagination or your own custom
     * handler.
     * @type {function|Object}
     * @default YAHOO.widget.DataTable.handleSimplePagination
     */
    this.setAttributeConfig("paginationEventHandler", {
        value     : YAHOO.widget.DataTable.handleSimplePagination,
        validator : YAHOO.lang.isObject
    });

    /**
    * @attribute caption
    * @description Value for the CAPTION element.
    * @type String
    */
    this.setAttributeConfig("caption", {
        value: null,
        validator: YAHOO.lang.isString,
        method: function(sCaption) {
            // Create CAPTION element
            if(!this._elCaption) {
                this._elCaption = this._elThead.parentNode.insertBefore(document.createElement("caption"), this._elThead.parentNode.firstChild);
            }
            // Set CAPTION value
            this._elCaption.innerHTML = sCaption;
        }
    });

    /**
    * @attribute scrollable
    * @description True if primary TBODY should scroll while THEAD remains fixed.
    * When enabling this feature, captions cannot be used, and the following
    * features are not recommended: inline editing, resizeable columns.
    * @default false
    * @type Boolean
    */
    this.setAttributeConfig("scrollable", {
        value: false,
        validator: function(oParam) {
            //TODO: validate agnst resizeable
            return (YAHOO.lang.isBoolean(oParam) &&
                    // Not compatible with caption
                    !YAHOO.lang.isString(this.get("caption")));
        },
        method: function(oParam) {
            if(oParam) {
                //TODO: conf height?
                YAHOO.util.Dom.addClass(this._elContainer,YAHOO.widget.DataTable.CLASS_SCROLLABLE);

                // Set explicit padding
                if(!YAHOO.env.ua.ie) {
                    this._elContainer.style.paddingBottom = this._elThead.offsetHeight + "px";
                }
            }
            else {
                YAHOO.util.Dom.removeClass(this._elContainer,YAHOO.widget.DataTable.CLASS_SCROLLABLE);

                // Unset explicit padding
                if(!YAHOO.env.ua.ie) {
                    this._elContainer.style.paddingBottom = "";
                }
            }
        }
    });
};

/////////////////////////////////////////////////////////////////////////////
//
// Public constants
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Class name assigned to the container liner DIV elements.
 *
 * @property DataTable.CLASS_LINER
 * @type String
 * @static
 * @final
 * @default "yui-dt-liner"
 */
YAHOO.widget.DataTable.CLASS_LINER = "yui-dt-liner";

/**
 * Class name assigned to display label elements.
 *
 * @property DataTable.CLASS_LABEL
 * @type String
 * @static
 * @final
 * @default "yui-dt-label"
 */
YAHOO.widget.DataTable.CLASS_LABEL = "yui-dt-label";

/**
 * Class name assigned to resizer handle elements.
 *
 * @property DataTable.CLASS_RESIZER
 * @type String
 * @static
 * @final
 * @default "yui-dt-resizer"
 */
YAHOO.widget.DataTable.CLASS_RESIZER = "yui-dt-resizer";

/**
 * Class name assigned to resizer proxy elements.
 *
 * @property DataTable.CLASS_RESIZERPROXY
 * @type String
 * @static
 * @final
 * @default "yui-dt-resizerproxy"
 */
YAHOO.widget.DataTable.CLASS_RESIZERPROXY = "yui-dt-resizerproxy";

/**
 * Class name assigned to Editor container elements.
 *
 * @property DataTable.CLASS_EDITOR
 * @type String
 * @static
 * @final
 * @default "yui-dt-editor"
 */
YAHOO.widget.DataTable.CLASS_EDITOR = "yui-dt-editor";

/**
 * Class name assigned to paginator container elements.
 *
 * @property DataTable.CLASS_PAGINATOR
 * @type String
 * @static
 * @final
 * @default "yui-dt-paginator"
 */
YAHOO.widget.DataTable.CLASS_PAGINATOR = "yui-dt-paginator";

/**
 * Class name assigned to page number indicators.
 *
 * @property DataTable.CLASS_PAGE
 * @type String
 * @static
 * @final
 * @default "yui-dt-page"
 */
YAHOO.widget.DataTable.CLASS_PAGE = "yui-dt-page";

/**
 * Class name assigned to default indicators.
 *
 * @property DataTable.CLASS_DEFAULT
 * @type String
 * @static
 * @final
 * @default "yui-dt-default"
 */
YAHOO.widget.DataTable.CLASS_DEFAULT = "yui-dt-default";

/**
 * Class name assigned to previous indicators.
 *
 * @property DataTable.CLASS_PREVIOUS
 * @type String
 * @static
 * @final
 * @default "yui-dt-previous"
 */
YAHOO.widget.DataTable.CLASS_PREVIOUS = "yui-dt-previous";

/**
 * Class name assigned next indicators.
 *
 * @property DataTable.CLASS_NEXT
 * @type String
 * @static
 * @final
 * @default "yui-dt-next"
 */
YAHOO.widget.DataTable.CLASS_NEXT = "yui-dt-next";

/**
 * Class name assigned to first elements.
 *
 * @property DataTable.CLASS_FIRST
 * @type String
 * @static
 * @final
 * @default "yui-dt-first"
 */
YAHOO.widget.DataTable.CLASS_FIRST = "yui-dt-first";

/**
 * Class name assigned to last elements.
 *
 * @property DataTable.CLASS_LAST
 * @type String
 * @static
 * @final
 * @default "yui-dt-last"
 */
YAHOO.widget.DataTable.CLASS_LAST = "yui-dt-last";

/**
 * Class name assigned to even elements.
 *
 * @property DataTable.CLASS_EVEN
 * @type String
 * @static
 * @final
 * @default "yui-dt-even"
 */
YAHOO.widget.DataTable.CLASS_EVEN = "yui-dt-even";

/**
 * Class name assigned to odd elements.
 *
 * @property DataTable.CLASS_ODD
 * @type String
 * @static
 * @final
 * @default "yui-dt-odd"
 */
YAHOO.widget.DataTable.CLASS_ODD = "yui-dt-odd";

/**
 * Class name assigned to selected elements.
 *
 * @property DataTable.CLASS_SELECTED
 * @type String
 * @static
 * @final
 * @default "yui-dt-selected"
 */
YAHOO.widget.DataTable.CLASS_SELECTED = "yui-dt-selected";

/**
 * Class name assigned to highlighted elements.
 *
 * @property DataTable.CLASS_HIGHLIGHTED
 * @type String
 * @static
 * @final
 * @default "yui-dt-highlighted"
 */
YAHOO.widget.DataTable.CLASS_HIGHLIGHTED = "yui-dt-highlighted";

/**
 * Class name assigned to disabled elements.
 *
 * @property DataTable.CLASS_DISABLED
 * @type String
 * @static
 * @final
 * @default "yui-dt-disabled"
 */
YAHOO.widget.DataTable.CLASS_DISABLED = "yui-dt-disabled";

/**
 * Class name assigned to empty indicators.
 *
 * @property DataTable.CLASS_EMPTY
 * @type String
 * @static
 * @final
 * @default "yui-dt-empty"
 */
YAHOO.widget.DataTable.CLASS_EMPTY = "yui-dt-empty";

/**
 * Class name assigned to loading indicatorx.
 *
 * @property DataTable.CLASS_LOADING
 * @type String
 * @static
 * @final
 * @default "yui-dt-loading"
 */
YAHOO.widget.DataTable.CLASS_LOADING = "yui-dt-loading";

/**
 * Class name assigned to error indicators.
 *
 * @property DataTable.CLASS_ERROR
 * @type String
 * @static
 * @final
 * @default "yui-dt-error"
 */
YAHOO.widget.DataTable.CLASS_ERROR = "yui-dt-error";

/**
 * Class name assigned to editable elements.
 *
 * @property DataTable.CLASS_EDITABLE
 * @type String
 * @static
 * @final
 * @default "yui-dt-editable"
 */
YAHOO.widget.DataTable.CLASS_EDITABLE = "yui-dt-editable";

/**
 * Class name assigned to resizeable elements.
 *
 * @property DataTable.CLASS_RESIZEABLE
 * @type String
 * @static
 * @final
 * @default "yui-dt-resizeable"
 */
YAHOO.widget.DataTable.CLASS_RESIZEABLE = "yui-dt-resizeable";

/**
 * Class name assigned to scrollable elements.
 *
 * @property DataTable.CLASS_SCROLLABLE
 * @type String
 * @static
 * @final
 * @default "yui-dt-scrollable"
 */
YAHOO.widget.DataTable.CLASS_SCROLLABLE = "yui-dt-scrollable";

/**
 * Class name assigned to sortable elements.
 *
 * @property DataTable.CLASS_SORTABLE
 * @type String
 * @static
 * @final
 * @default "yui-dt-sortable"
 */
YAHOO.widget.DataTable.CLASS_SORTABLE = "yui-dt-sortable";

/**
 * Class name assigned to ascending elements.
 *
 * @property DataTable.CLASS_ASC
 * @type String
 * @static
 * @final
 * @default "yui-dt-asc"
 */
YAHOO.widget.DataTable.CLASS_ASC = "yui-dt-asc";

/**
 * Class name assigned to descending elements.
 *
 * @property DataTable.CLASS_DESC
 * @type String
 * @static
 * @final
 * @default "yui-dt-desc"
 */
YAHOO.widget.DataTable.CLASS_DESC = "yui-dt-desc";

/**
 * Class name assigned to BUTTON elements and/or container elements.
 *
 * @property DataTable.CLASS_BUTTON
 * @type String
 * @static
 * @final
 * @default "yui-dt-button"
 */
YAHOO.widget.DataTable.CLASS_BUTTON = "yui-dt-button";

/**
 * Class name assigned to INPUT TYPE=CHECKBOX elements and/or container elements.
 *
 * @property DataTable.CLASS_CHECKBOX
 * @type String
 * @static
 * @final
 * @default "yui-dt-checkbox"
 */
YAHOO.widget.DataTable.CLASS_CHECKBOX = "yui-dt-checkbox";

/**
 * Class name assigned to SELECT elements and/or container elements.
 *
 * @property DataTable.CLASS_DROPDOWN
 * @type String
 * @static
 * @final
 * @default "yui-dt-dropdown"
 */
YAHOO.widget.DataTable.CLASS_DROPDOWN = "yui-dt-dropdown";

/**
 * Class name assigned to INPUT TYPE=RADIO elements and/or container elements.
 *
 * @property DataTable.CLASS_RADIO
 * @type String
 * @static
 * @final
 * @default "yui-dt-radio"
 */
YAHOO.widget.DataTable.CLASS_RADIO = "yui-dt-radio";

/**
 * Message to display if DataTable has no data.
 *
 * @property DataTable.MSG_EMPTY
 * @type String
 * @static
 * @final
 * @default "No records found."
 */
YAHOO.widget.DataTable.MSG_EMPTY = "No records found.";

/**
 * Message to display while DataTable is loading data.
 *
 * @property DataTable.MSG_LOADING
 * @type String
 * @static
 * @final
 * @default "Loading data..."
 */
YAHOO.widget.DataTable.MSG_LOADING = "Loading data...";

/**
 * Message to display while DataTable has data error.
 *
 * @property DataTable.MSG_ERROR
 * @type String
 * @static
 * @final
 * @default "Data error."
 */
YAHOO.widget.DataTable.MSG_ERROR = "Data error.";

/////////////////////////////////////////////////////////////////////////////
//
// Private member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Internal class variable for indexing multiple DataTable instances.
 *
 * @property DataTable._nCount
 * @type Number
 * @private
 * @static
 */
YAHOO.widget.DataTable._nCount = 0;

/**
 * True if instance is initialized, so as to fire the initEvent rather than
 * renderEvent.
 *
 * @property _bInit
 * @type Boolean
 * @default true
 * @private
 */
YAHOO.widget.DataTable.prototype._bInit = true;

/**
 * Index assigned to instance.
 *
 * @property _nIndex
 * @type Number
 * @private
 */
YAHOO.widget.DataTable.prototype._nIndex = null;

/**
 * Counter for IDs assigned to TR elements.
 *
 * @property _nTrCount
 * @type Number
 * @private
 */
YAHOO.widget.DataTable.prototype._nTrCount = 0;

/**
 * Unique id assigned to instance "yui-dtN", useful prefix for generating unique
 * DOM ID strings and log messages.
 *
 * @property _sId
 * @type String
 * @private
 */
YAHOO.widget.DataTable.prototype._sId = null;

/**
 * True when DOM mutations are in progress.
 *
 * @property _bRendering
 * @type Boolean
 * @private
 */
YAHOO.widget.DataTable.prototype._bRendering = false;

/**
 * DOM reference to the container element for the DataTable instance into which
 * the container liner and TABLE element get created.
 *
 * @property _elContainer
 * @type HTMLElement
 * @private
 */
YAHOO.widget.DataTable.prototype._elContainer = null;

/**
 * DOM reference to the container element for the DataTable's THEAD.
 *
 * @property _elTheadContainer
 * @type HTMLElement
 * @private
 */
YAHOO.widget.DataTable.prototype._elTheadContainer = null;

/**
 * DOM reference to the container element for the DataTable's TBODY.
 *
 * @property _elTbodyContainer
 * @type HTMLElement
 * @private
 */
YAHOO.widget.DataTable.prototype._elTbodyContainer = null;

/**
 * DOM reference to the CAPTION element for the DataTable instance.
 *
 * @property _elCaption
 * @type HTMLElement
 * @private
 */
YAHOO.widget.DataTable.prototype._elCaption = null;

/**
 * DOM reference to the primary THEAD element for the DataTable instance.
 *
 * @property _elThead
 * @type HTMLElement
 * @private
 */
YAHOO.widget.DataTable.prototype._elThead = null;

/**
 * DOM reference to the primary TBODY element for the DataTable instance.
 *
 * @property _elTbody
 * @type HTMLElement
 * @private
 */
YAHOO.widget.DataTable.prototype._elTbody = null;

/**
 * DOM reference to the secondary TBODY element used to display DataTable messages.
 *
 * @property _elMsgTbody
 * @type HTMLElement
 * @private
 */
YAHOO.widget.DataTable.prototype._elMsgTbody = null;

/**
 * DOM reference to the secondary TBODY element's single TR element used to display DataTable messages.
 *
 * @property _elMsgTbodyRow
 * @type HTMLElement
 * @private
 */
YAHOO.widget.DataTable.prototype._elMsgTbodyRow = null;

/**
 * DOM reference to the secondary TBODY element's single TD element used to display DataTable messages.
 *
 * @property _elMsgTbodyCell
 * @type HTMLElement
 * @private
 */
YAHOO.widget.DataTable.prototype._elMsgTbodyCell = null;

/**
 * DataSource instance for the DataTable instance.
 *
 * @property _oDataSource
 * @type YAHOO.util.DataSource
 * @private
 */
YAHOO.widget.DataTable.prototype._oDataSource = null;

/**
 * ColumnSet instance for the DataTable instance.
 *
 * @property _oColumnSet
 * @type YAHOO.widget.ColumnSet
 * @private
 */
YAHOO.widget.DataTable.prototype._oColumnSet = null;

/**
 * RecordSet instance for the DataTable instance.
 *
 * @property _oRecordSet
 * @type YAHOO.widget.RecordSet
 * @private
 */
YAHOO.widget.DataTable.prototype._oRecordSet = null;

/**
 * ID string of first TR element of the current DataTable page.
 *
 * @property _sFirstTrId
 * @type String
 * @private
 */
YAHOO.widget.DataTable.prototype._sFirstTrId = null;

/**
 * ID string of the last TR element of the current DataTable page.
 *
 * @property _sLastTrId
 * @type String
 * @private
 */
YAHOO.widget.DataTable.prototype._sLastTrId = null;































/////////////////////////////////////////////////////////////////////////////
//
// Private methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Clears browser text selection. Useful to call on rowSelectEvent or
 * cellSelectEvent to prevent clicks or dblclicks from selecting text in the
 * browser.
 *
 * @method clearTextSelection
 */
YAHOO.widget.DataTable.prototype.clearTextSelection = function() {
    var sel;
    if(window.getSelection) {
    	sel = window.getSelection();
    }
    else if(document.getSelection) {
    	sel = document.getSelection();
    }
    else if(document.selection) {
    	sel = document.selection;
    }
    if(sel) {
        if(sel.empty) {
            sel.empty();
        }
        else if (sel.removeAllRanges) {
            sel.removeAllRanges();
        }
        else if(sel.collapse) {
            sel.collapse();
        }
    }
};

/**
 * Sets focus on the given element.
 *
 * @method _focusEl
 * @param el {HTMLElement} Element.
 * @private
 */
YAHOO.widget.DataTable.prototype._focusEl = function(el) {
    el = el || this._elTbody;
    // http://developer.mozilla.org/en/docs/index.php?title=Key-navigable_custom_DHTML_widgets
    // The timeout is necessary in both IE and Firefox 1.5, to prevent scripts from doing
    // strange unexpected things as the user clicks on buttons and other controls.
    setTimeout(function() {
        try {
            el.focus();
        }
        catch(e) {
        }
    },0);
};

/**
 * Syncs up widths of THs and TDs across all Columns.
 *
 * @method _syncColWidths
 * @param elRow {HTMLElement} Sync THEAD cell widths with cells from
 * the given TBODY row.
 * @private
 */
YAHOO.widget.DataTable.prototype._syncColWidths = function(elRow) {
    var oSelf = this;

    setTimeout(function() {
        // Only if instance is still valid
        if((oSelf instanceof YAHOO.widget.DataTable) && (oSelf._sId)) {
            var allKeys = oSelf._oColumnSet.keys;
            var elWhichRow = elRow || oSelf.getFirstTrEl();

            if(elWhichRow && (elWhichRow.cells.length > 0) && (allKeys.length > 0)) {
                var elHeadLiner, nHeadLinerWidth, elCellLiner, nCellLinerWidth, nNewWidth;

                for(var i=0; i<allKeys.length; i++) {
                    elHeadLiner = allKeys[i].getThEl().firstChild;
                    nHeadLinerWidth = elHeadLiner.offsetWidth -
                            (parseInt(YAHOO.util.Dom.getStyle(elHeadLiner,"paddingLeft"),10)) -
                            (parseInt(YAHOO.util.Dom.getStyle(elHeadLiner,"paddingRight"),10));
                    elCellLiner = elWhichRow.cells[i].firstChild;
                    nCellLinerWidth = elCellLiner.offsetWidth -
                            (parseInt(YAHOO.util.Dom.getStyle(elCellLiner,"paddingLeft"),10)) -
                            (parseInt(YAHOO.util.Dom.getStyle(elCellLiner,"paddingRight"),10));
                    if(nHeadLinerWidth !== nCellLinerWidth) {
                        nNewWidth = Math.max(nHeadLinerWidth, nCellLinerWidth);
                        oSelf._setColumnWidth(allKeys[i],nNewWidth+"px");
                    }
                }
            }
        }
    }, 0);
};












// INIT FUNCTIONS

/**
 * Initializes container element.
 *
 * @method _initContainerEl
 * @param elContainer {HTMLElement | String} HTML DIV element by reference or ID.
 * @private
 */
YAHOO.widget.DataTable.prototype._initContainerEl = function(elContainer) {
    // Clear any previous container
    if(this._elContainer) {
        YAHOO.util.Event.purgeElement(this._elContainer, true);
        this._elContainer.innerHTML = "";
    }

    elContainer = YAHOO.util.Dom.get(elContainer);
    if(elContainer && elContainer.tagName && (elContainer.tagName.toLowerCase() == "div")) {
        // Esp for progressive enhancement
        YAHOO.util.Event.purgeElement(elContainer, true);
        elContainer.innerHTML = "";

        YAHOO.util.Dom.addClass(elContainer,"yui-dt");
        
        // Container for header TABLE
        this._elTheadContainer = elContainer.appendChild(document.createElement("div"));
        YAHOO.util.Dom.addClass(this._elTheadContainer, "yui-dt-hd");

        // Container for body TABLE
        this._elTbodyContainer = elContainer.appendChild(document.createElement("div"));
        YAHOO.util.Dom.addClass(this._elTbodyContainer, "yui-dt-bd");

        this._elContainer = elContainer;
    }
};

/**
 * Initializes object literal of config values.
 *
 * @method _initConfigs
 * @param oConfig {Object} Object literal of config values.
 * @private
 */
YAHOO.widget.DataTable.prototype._initConfigs = function(oConfigs) {
    if(oConfigs) {
        if(oConfigs.constructor != Object) {
            oConfigs = null;
            YAHOO.log("Invalid configs", "warn", this.toString());
        }
        // Backward compatibility
        else if(YAHOO.lang.isBoolean(oConfigs.paginator)) {
            YAHOO.log("DataTable's paginator model has been revised" +
            " -- please refer to the documentation for implementation" +
            " details", "warn", this.toString());
        }
        this._oConfigs = oConfigs;
    }
    else {
        this._oConfigs = {};
    }
};

/**
 * Initializes ColumnSet.
 *
 * @method _initColumnSet
 * @param aColumnDefs {Object[]} Array of object literal Column definitions.
 * @private
 */
YAHOO.widget.DataTable.prototype._initColumnSet = function(aColumnDefs) {
    this._oColumnSet = null;
    if(YAHOO.lang.isArray(aColumnDefs)) {
        this._oColumnSet =  new YAHOO.widget.ColumnSet(aColumnDefs);
    }
    // Backward compatibility
    else if(aColumnDefs instanceof YAHOO.widget.ColumnSet) {
        this._oColumnSet =  aColumnDefs;
        YAHOO.log("DataTable's constructor now requires an array" +
        " of object literal Column definitions instead of a ColumnSet instance",
        "warn", this.toString());
    }
};

/**
 * Initializes DataSource.
 *
 * @method _initDataSource
 * @param oDataSource {YAHOO.util.DataSource} DataSource instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._initDataSource = function(oDataSource) {
    this._oDataSource = null;
    if(oDataSource && (oDataSource instanceof YAHOO.util.DataSource)) {
        this._oDataSource = oDataSource;
    }
    // Backward compatibility
    else {
        var tmpTable = null;
        var tmpContainer = this._elContainer;
        var i;
        // Peek in container child nodes to see if TABLE already exists
        if(tmpContainer.hasChildNodes()) {
            var tmpChildren = tmpContainer.childNodes;
            for(i=0; i<tmpChildren.length; i++) {
                if(tmpChildren[i].tagName && tmpChildren[i].tagName.toLowerCase() == "table") {
                    tmpTable = tmpChildren[i];
                    break;
                }
            }
            if(tmpTable) {
                var tmpFieldsArray = [];
                for(i=0; i<this._oColumnSet.keys.length; i++) {
                    tmpFieldsArray.push({key:this._oColumnSet.keys[i].key});
                }

                this._oDataSource = new YAHOO.util.DataSource(tmpTable);
                this._oDataSource.responseType = YAHOO.util.DataSource.TYPE_HTMLTABLE;
                this._oDataSource.responseSchema = {fields: tmpFieldsArray};
                YAHOO.log("Null DataSource for progressive enhancement from" +
                " markup has been deprecated", "warn", this.toString());
            }
        }
    }
};

/**
 * Initializes RecordSet.
 *
 * @method _initRecordSet
 * @private
 */
YAHOO.widget.DataTable.prototype._initRecordSet = function() {
    if(this._oRecordSet) {
        this._oRecordSet.reset();
    }
    else {
        this._oRecordSet = new YAHOO.widget.RecordSet();
    }
};

/**
 * Creates HTML markup for TABLE, THEAD and TBODY elements.
 *
 * @method _initTableEl
 * @private
 */
YAHOO.widget.DataTable.prototype._initTableEl = function() {
    var elTable;

    // Destroy existing
    if(this._elThead) {
        elTable = this._elThead.parentNode;
        YAHOO.util.Event.purgeElement(elTable, true);
        elTable.parentNode.removeChild(elTable);
        this._elThead = null;
    }
    if(this._elTbody) {
        elTable = this._elTbody.parentNode;
        YAHOO.util.Event.purgeElement(elTable, true);
        elTable.parentNode.removeChild(elTable);
        this._elTbody = null;
    }

    // Create elements for header
    // Create TABLE
    var elHeadTable = document.createElement("table");
    elHeadTable.id = this._sId + "-headtable";
    elHeadTable = this._elTheadContainer.appendChild(elHeadTable);

    // Create THEAD
    this._initTheadEl(elHeadTable,false);

    // Create elements for body
    // Create TABLE
    var elBodyTable = document.createElement("table");
    elBodyTable.id = this._sId + "-bodytable";
    this._elTbodyContainer.appendChild(elBodyTable);

    // Create THEAD
    this._initTheadEl(elBodyTable, true);

    // Create TBODY for data
    this._elTbody = elBodyTable.appendChild(document.createElement("tbody"));
    this._elTbody.tabIndex = 0;
    YAHOO.util.Dom.addClass(this._elTbody,YAHOO.widget.DataTable.CLASS_BODY);

    // Create TBODY for messages
    var elMsgTbody = document.createElement("tbody");
    var elMsgRow = elMsgTbody.appendChild(document.createElement("tr"));
    YAHOO.util.Dom.addClass(elMsgRow,YAHOO.widget.DataTable.CLASS_FIRST);
    YAHOO.util.Dom.addClass(elMsgRow,YAHOO.widget.DataTable.CLASS_LAST);
    this._elMsgRow = elMsgRow;
    var elMsgCell = elMsgRow.appendChild(document.createElement("td"));
    elMsgCell.colSpan = this._oColumnSet.keys.length;
    YAHOO.util.Dom.addClass(elMsgCell,YAHOO.widget.DataTable.CLASS_FIRST);
    YAHOO.util.Dom.addClass(elMsgCell,YAHOO.widget.DataTable.CLASS_LAST);
    this._elMsgTd = elMsgCell;
    this._elMsgTbody = elBodyTable.appendChild(elMsgTbody);
    var elMsgCellLiner = elMsgCell.appendChild(document.createElement("div"));
    YAHOO.util.Dom.addClass(elMsgCellLiner,YAHOO.widget.DataTable.CLASS_LINER);
    this.showTableMessage(YAHOO.widget.DataTable.MSG_LOADING, YAHOO.widget.DataTable.CLASS_LOADING);

    var elContainer = this._elContainer;
    var elThead = this._elThead;
    var elTbody = this._elTbody;
    var elTbodyContainer = this._elTbodyContainer;

    // Set up DOM events
    YAHOO.util.Event.addListener(document, "click", this._onDocumentClick, this);
    
    YAHOO.util.Event.addListener(elContainer, "focus", this._onTableFocus, this);
    YAHOO.util.Event.addListener(elThead, "focus", this._onTheadFocus, this);
    YAHOO.util.Event.addListener(elTbody, "focus", this._onTbodyFocus, this);

    YAHOO.util.Event.addListener(elTbody, "mouseover", this._onTableMouseover, this);
    YAHOO.util.Event.addListener(elTbody, "mouseout", this._onTableMouseout, this);
    YAHOO.util.Event.addListener(elTbody, "mousedown", this._onTableMousedown, this);

    YAHOO.util.Event.addListener(elThead, "keydown", this._onTheadKeydown, this);
    YAHOO.util.Event.addListener(elTbody, "keydown", this._onTbodyKeydown, this);

    YAHOO.util.Event.addListener(elTbody, "keypress", this._onTableKeypress, this);

    // Since we can't listen for click and dblclick on the same element...
    YAHOO.util.Event.addListener(elThead.parentNode, "dblclick", this._onTableDblclick, this);
    YAHOO.util.Event.addListener(elTbody.parentNode, "dblclick", this._onTableDblclick, this);
    YAHOO.util.Event.addListener(elThead, "click", this._onTheadClick, this);
    YAHOO.util.Event.addListener(elTbody, "click", this._onTbodyClick, this);

    YAHOO.util.Event.addListener(elTbodyContainer, "scroll", this._onScroll, this); // to sync horiz scroll headers
};

/**
 * Populates THEAD element with TH cells as defined by ColumnSet.
 *
 * @method _initTheadEl
 * @param elTable {HTMLElement} TABLE element into which to initialize THEAD.
 * @param bA11y {Boolean} True if THEAD is for accessibility, so as not to
 * initialize presentation elements.
 * @private
 */
YAHOO.widget.DataTable.prototype._initTheadEl = function(elTable, bA11y) {
    var i, oColumn;
    var oColumnSet = this._oColumnSet;

    // Create THEAD
    var elThead = elTable.appendChild(document.createElement("thead"));
    if(!bA11y) {
        this._elThead = elThead;
    }

    // Iterate through each row of THEAD cells...
    var colTree = oColumnSet.tree;
    var elTheadCell;
    for(i=0; i<colTree.length; i++) {
        var elTheadRow = elThead.appendChild(document.createElement("tr"));
        elTheadRow.id = this._sId+"-hdrow"+i;

        // ...and create THEAD cells
        for(var j=0; j<colTree[i].length; j++) {
            oColumn = colTree[i][j];
            elTheadCell = elTheadRow.appendChild(document.createElement("th"));
            if(!bA11y) {
                oColumn._elTh = elTheadCell;
            }
            var id = (bA11y) ? this._sId+"-th" + oColumn.getId() + "-a11y": this._sId+"-th" + oColumn.getId();
            elTheadCell.id = id;
            elTheadCell.yuiCellIndex = j;
            this._initThEl(elTheadCell,oColumn,i,j, bA11y);
        }

        if(!bA11y) {
            // Set FIRST/LAST on THEAD rows
            if(i === 0) {
                YAHOO.util.Dom.addClass(elTheadRow, YAHOO.widget.DataTable.CLASS_FIRST);
            }
            if(i === (colTree.length-1)) {
                YAHOO.util.Dom.addClass(elTheadRow, YAHOO.widget.DataTable.CLASS_LAST);
            }
        }
    }

    if(!bA11y) {
        // Set FIRST/LAST on TH elements using the values in ColumnSet headers array
        var aFirstHeaders = oColumnSet.headers[0];
        var aLastHeaders = oColumnSet.headers[oColumnSet.headers.length-1];
        for(i=0; i<aFirstHeaders.length; i++) {
            //TODO: A better way to get th cell
            YAHOO.util.Dom.addClass(YAHOO.util.Dom.get(this._sId+"-th"+aFirstHeaders[i]), YAHOO.widget.DataTable.CLASS_FIRST);
        }
        for(i=0; i<aLastHeaders.length; i++) {
            //TODO: A better way to get th cell
            YAHOO.util.Dom.addClass(YAHOO.util.Dom.get(this._sId+"-th"+aLastHeaders[i]), YAHOO.widget.DataTable.CLASS_LAST);
        }
    
        // Add Resizer only after DOM has been updated
        //TODO: Support resizers on parents of nested Columns?
        var foundDD = (YAHOO.util.DD) ? true : false;
        var needDD = false;
        for(i=0; i<this._oColumnSet.keys.length; i++) {
            oColumn = this._oColumnSet.keys[i];
            var colKey = oColumn.getKey();
            elTheadCell = oColumn.getThEl();
            if(oColumn.resizeable) {
                if(foundDD) {
                    YAHOO.util.Dom.addClass(elTheadCell, YAHOO.widget.DataTable.CLASS_RESIZEABLE);
                    var elThContainer = elTheadCell.firstChild;
                    var elThResizer = elThContainer.appendChild(document.createElement("div"));
                    elThResizer.id = this._sId + "-colresizer-" + colKey;
                    oColumn._elResizer = elThResizer;
                    YAHOO.util.Dom.addClass(elThResizer,YAHOO.widget.DataTable.CLASS_RESIZER);
                    this._initColumnResizerProxyEl();
                    oColumn.ddResizer = new YAHOO.util.ColumnResizer(
                            this, oColumn, elTheadCell, elThResizer.id, this._elColumnResizerProxy);
                    var cancelClick = function(e) {
                        YAHOO.util.Event.stopPropagation(e);
                    };
                    YAHOO.util.Event.addListener(elThResizer,"click",cancelClick);
                }
                else {
                    needDD = true;
                }
            }
        }
        if(needDD) {
            YAHOO.log("Could not find DragDrop dependancy for resizeable Columns", "warn", this.toString());
        }
        
        YAHOO.log("TH cells for " + this._oColumnSet.keys.length + " keys created","info",this.toString());
    }
    else {
        YAHOO.log("Accessibility TH cells for " + this._oColumnSet.keys.length + " keys created","info",this.toString());
    }
};

/**
 * Populates TH cell as defined by Column.
 *
 * @method _initThEl
 * @param elTheadCell {HTMLElement} TH cell element reference.
 * @param oColumn {YAHOO.widget.Column} Column object.
 * @param row {Number} Row index.
 * @param col {Number} Column index.
 * @param bA11y {Boolean} True if TH is for accessibility, so as not to
 * initialize presentation elements.
 * @private
 */
YAHOO.widget.DataTable.prototype._initThEl = function(elTheadCell,oColumn,row,col, bA11y) {
    // Clear out the cell of prior content
    // TODO: purgeListeners and other validation-related things
    var colKey = oColumn.getKey();
    var colId = oColumn.getId();
    elTheadCell.yuiColumnKey = colKey;
    elTheadCell.yuiColumnId = colId;
    elTheadCell.innerHTML = "";
    elTheadCell.rowSpan = oColumn.getRowspan();
    elTheadCell.colSpan = oColumn.getColspan();
    if(oColumn.abbr) {
        elTheadCell.abbr = oColumn.abbr;
    }

    var elTheadCellLiner = elTheadCell.appendChild(document.createElement("div"));
    var id = (bA11y) ? this._sId + "-container" + colId + "-a11y" : this._sId + "-container" + colId;
    elTheadCellLiner.id = id;

    var elTheadCellLabel = elTheadCellLiner.appendChild(document.createElement("span"));
    id = (bA11y) ? this._sId + "-label" + colId + "-a11y" : this._sId + "-label" + colId;
    elTheadCellLabel.id = id;

    // Keep it basic for screen readers
    if(bA11y) {
        //TODO: remove IDs and form elements from label
        elTheadCellLabel.innerHTML = YAHOO.lang.isValue(oColumn.label) ? oColumn.label : colKey;
    }
    // Visually format the elements
    else {
        YAHOO.util.Dom.addClass(elTheadCellLiner,YAHOO.widget.DataTable.CLASS_LINER);
        YAHOO.util.Dom.addClass(elTheadCellLiner, "yui-dt-col-"+colKey);
        var aCustomClasses;
        if(YAHOO.lang.isString(oColumn.className)) {
            aCustomClasses = [oColumn.className];
        }
        else if(YAHOO.lang.isArray(oColumn.className)) {
            aCustomClasses = oColumn.className;
        }
        if(aCustomClasses) {
            for(var i=0; i<aCustomClasses.length; i++) {
                YAHOO.util.Dom.addClass(elTheadCellLiner,aCustomClasses[i]);
            }
        }
        if(oColumn.width) {
            elTheadCellLiner.style.width = oColumn.width + "px";
        }
        
        YAHOO.util.Dom.addClass(elTheadCellLabel,YAHOO.widget.DataTable.CLASS_LABEL);
        
        if(oColumn.resizeable) {
            YAHOO.util.Dom.addClass(elTheadCell,YAHOO.widget.DataTable.CLASS_RESIZEABLE);
        }
        if(oColumn.sortable) {
            YAHOO.util.Dom.addClass(elTheadCell,YAHOO.widget.DataTable.CLASS_SORTABLE);
        }

        YAHOO.widget.DataTable.formatHeadCell(elTheadCellLabel, oColumn, this);
    }
};

/**
 * Creates HTML markup for Cell Editor.
 *
 * @method _initCellEditorEl
 * @private
 */
YAHOO.widget.DataTable.prototype._initCellEditorEl = function() {
    // TODO: destroy previous instances

    // Attach Cell Editor container element as first child of body
    var elCellEditor = document.createElement("div");
    elCellEditor.id = this._sId + "-celleditor";
    elCellEditor.style.display = "none";
    elCellEditor.tabIndex = 0;
    YAHOO.util.Dom.addClass(elCellEditor, YAHOO.widget.DataTable.CLASS_EDITOR);
    var elFirstChild = YAHOO.util.Dom.getFirstChild(document.body);
    if(elFirstChild) {
        elCellEditor = YAHOO.util.Dom.insertBefore(elCellEditor, elFirstChild);
    }
    else {
        elCellEditor = document.body.appendChild(elCellEditor);
    }
    
    // Internal tracker of Cell Editor values
    var oCellEditor = {};
    oCellEditor.container = elCellEditor;
    oCellEditor.value = null;
    oCellEditor.isActive = false;
    this._oCellEditor = oCellEditor;
};

/**
 * Creates HTML markup for shared Column resizer proxy.
 *
 * @method _initColumnResizerProxyEl
 * @private
 */
YAHOO.widget.DataTable.prototype._initColumnResizerProxyEl = function() {
    // TODO: destroy previous instances
    if(!this._elColumnResizerProxy) {

        // Attach Column resizer element as first child of body
        var elColumnResizerProxy = document.createElement("div");
        elColumnResizerProxy.id = this._sId + "-colresizerproxy";
        YAHOO.util.Dom.addClass(elColumnResizerProxy, YAHOO.widget.DataTable.CLASS_RESIZERPROXY);
        var elFirstChild = YAHOO.util.Dom.getFirstChild(document.body);
        if(elFirstChild) {
            elColumnResizerProxy = YAHOO.util.Dom.insertBefore(elColumnResizerProxy, elFirstChild);
        }
        else {
            elColumnResizerProxy = document.body.appendChild(elColumnResizerProxy);
        }

        // Internal tracker of Cell Editor values
        this._elColumnResizerProxy = elColumnResizerProxy;
    }
};

/**
 * Initializes Column sorting.
 *
 * @method _initColumnSort
 * @private
 */
YAHOO.widget.DataTable.prototype._initColumnSort = function() {
    this.subscribe("theadCellClickEvent", this.onEventSortColumn);
};




































// DOM MUTATION FUNCTIONS




/**
 * Adds a TR element to the primary TBODY at the page row index if given, otherwise
 * at the end of the page. Formats TD elements within the TR element using data
 * from the given Record.
 *
 * @method _addTrEl
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param index {Number} (optional) The page row index at which to add the TR
 * element.
 * @return {HTMLElement} DOM reference to the new TR element.
 * @private
 */
YAHOO.widget.DataTable.prototype._addTrEl = function(oRecord, index) {
    // It's an append if no index provided, or index is negative or too big
    var append = (!YAHOO.lang.isNumber(index) || (index < 0) ||
            (index >= (this._elTbody.rows.length))) ? true : false;

    var oColumnSet = this._oColumnSet;
    var elRow = (append) ? this._elTbody.appendChild(document.createElement("tr")) :
        this._elTbody.insertBefore(document.createElement("tr"),this._elTbody.rows[index]);

    elRow.id = this._sId+"-bdrow"+this._nTrCount;
    this._nTrCount++;
    elRow.yuiRecordId = oRecord.getId();

    // Stripe the new row
    if(elRow.sectionRowIndex%2) {
        YAHOO.util.Dom.addClass(elRow, YAHOO.widget.DataTable.CLASS_ODD);
    }
    else {
        YAHOO.util.Dom.addClass(elRow, YAHOO.widget.DataTable.CLASS_EVEN);
    }

    var sortKey, sortClass, isSortedBy = this.get("sortedBy");
    if(isSortedBy) {
        sortKey = isSortedBy.key;
        sortClass = isSortedBy.dir;
    }

    // Create TD cells
    for(var j=0; j<oColumnSet.keys.length; j++) {
        var oColumn = oColumnSet.keys[j];
        var elCell = elRow.appendChild(document.createElement("td"));
        var elCellLiner = elCell.appendChild(document.createElement("div"));
        YAHOO.util.Dom.addClass(elCellLiner, YAHOO.widget.DataTable.CLASS_LINER);
        elCell.id = elRow.id+"-cell"+j;
        elCell.yuiColumnKey = oColumn.getKey();
        elCell.yuiColumnId = oColumn.getId();

        for(var k=0; k<oColumnSet.headers[j].length; k++) {
            elCell.headers += this._sId + "-th" + oColumnSet.headers[j][k] + "-a11y ";
        }

        // For SF2 cellIndex bug: http://www.webreference.com/programming/javascript/ppk2/3.html
        elCell.yuiCellIndex = j;

        // Update UI
        this.formatCell(elCellLiner, oRecord, oColumn);

        // Set FIRST/LAST on TD
        if (j === 0) {
            YAHOO.util.Dom.addClass(elCell, YAHOO.widget.DataTable.CLASS_FIRST);
        }
        else if (j === this._oColumnSet.keys.length-1) {
            YAHOO.util.Dom.addClass(elCell, YAHOO.widget.DataTable.CLASS_LAST);
        }

        // Set ASC/DESC on TD
        if(oColumn.key === sortKey) {
            YAHOO.util.Dom.addClass(elCell, sortClass);
        }

        // Set width if given
        if(oColumn.width) {
            elCellLiner.style.width = oColumn.width + "px";
        }
        // Or else bump up to fit content width when necessary
        else if(elCellLiner.offsetWidth < elCellLiner.scrollWidth) {
            elCellLiner.style.width = elCellLiner.scrollWidth + "px";
            oColumn.getThEl().firstChild.style.width = elCellLiner.scrollWidth + "px";
        }
    }

    // Sync up widths of cells for given row with corresponding TH elements
    this._syncColWidths(elRow);
    
    return elRow;
};

/**
 * Formats all TD elements of given TR element with data from the given Record.
 *
 * @method _updateTrEl
 * @param elRow {HTMLElement} The TR element to update.
 * @param oRecord {YAHOO.widget.Record} The associated Record instance.
 * @return {HTMLElement} DOM reference to the new TR element.
 * @private
 */
YAHOO.widget.DataTable.prototype._updateTrEl = function(elRow, oRecord) {
    var sortKey, sortClass, isSortedBy = this.get("sortedBy");
    if(isSortedBy) {
        sortKey = isSortedBy.key;
        sortClass = isSortedBy.dir;
    }

    // Update TD elements with new data
    for(var j=0; j<elRow.cells.length; j++) {
        var oColumn = this._oColumnSet.keys[j];
        var elCell = elRow.cells[j];
        var elCellLiner = elCell.firstChild;
        this.formatCell(elCellLiner, oRecord, oColumn);

        // Remove ASC/DESC
        YAHOO.util.Dom.removeClass(elCell, YAHOO.widget.DataTable.CLASS_ASC);
        YAHOO.util.Dom.removeClass(elCell, YAHOO.widget.DataTable.CLASS_DESC);

        // Set ASC/DESC on TD
        if(oColumn.key === sortKey) {
            YAHOO.util.Dom.addClass(elCell, sortClass);
        }
        
        // Set width if given
        if(oColumn.width) {
            elCellLiner.style.width = oColumn.width + "px";
        }
        // Or else bump up to fit content width when necessary
        else if(elCellLiner.offsetWidth < elCellLiner.scrollWidth) {
            elCellLiner.style.width = elCellLiner.scrollWidth + "px";
        }
    }

    // Update Record ID
    elRow.yuiRecordId = oRecord.getId();
    
    // Sync up widths of cells for given row with corresponding TH elements
    this._syncColWidths(elRow);

    return elRow;
};


/**
 * Deletes TR element by DOM reference or by DataTable page row index.
 *
 * @method _deleteTrEl
 * @param row {HTMLElement | Number} TR element reference or Datatable page row index.
 * @return {Boolean} Returns true if successful, else returns false.
 * @private
 */
YAHOO.widget.DataTable.prototype._deleteTrEl = function(row) {
    var rowIndex;

    // Get page row index for the element
    if(!YAHOO.lang.isNumber(row)) {
        rowIndex = YAHOO.util.Dom.get(row).sectionRowIndex;
    }
    else {
        rowIndex = row;
    }
    if(YAHOO.lang.isNumber(rowIndex) && (rowIndex > -2) && (rowIndex < this._elTbody.rows.length)) {
        this._elTbody.deleteRow(rowIndex);
        return true;
    }
    else {
        return false;
    }
};



























// CSS/STATE FUNCTIONS




/**
 * Assigns the class YAHOO.widget.DataTable.CLASS_FIRST to the first TR element
 * of the DataTable page and updates internal tracker.
 *
 * @method _setFirstRow
 * @private
 */
YAHOO.widget.DataTable.prototype._setFirstRow = function() {
    var rowEl = this.getFirstTrEl();
    if(rowEl) {
        // Remove FIRST
        if(this._sFirstTrId) {
            YAHOO.util.Dom.removeClass(this._sFirstTrId, YAHOO.widget.DataTable.CLASS_FIRST);
        }
        // Set FIRST
        YAHOO.util.Dom.addClass(rowEl, YAHOO.widget.DataTable.CLASS_FIRST);
        this._sFirstTrId = rowEl.id;
    }
    else {
        this._sFirstTrId = null;
    }
};

/**
 * Assigns the class YAHOO.widget.DataTable.CLASS_LAST to the last TR element
 * of the DataTable page and updates internal tracker.
 *
 * @method _setLastRow
 * @private
 */
YAHOO.widget.DataTable.prototype._setLastRow = function() {
    var rowEl = this.getLastTrEl();
    if(rowEl) {
        // Unassign previous class
        if(this._sLastTrId) {
            YAHOO.util.Dom.removeClass(this._sLastTrId, YAHOO.widget.DataTable.CLASS_LAST);
        }
        // Assign class
        YAHOO.util.Dom.addClass(rowEl, YAHOO.widget.DataTable.CLASS_LAST);
        this._sLastTrId = rowEl.id;
    }
    else {
        this._sLastTrId = null;
    }
};

/**
 * Assigns the classes YAHOO.widget.DataTable.CLASS_EVEN and
 * YAHOO.widget.DataTable.CLASS_ODD to alternating TR elements of the DataTable
 * page. For performance, a subset of rows may be specified.
 *
 * @method _setRowStripes
 * @param row {HTMLElement | String | Number} (optional) HTML TR element reference
 * or string ID, or page row index of where to start striping.
 * @param range {Number} (optional) If given, how many rows to stripe, otherwise
 * stripe all the rows until the end.
 * @private
 */
YAHOO.widget.DataTable.prototype._setRowStripes = function(row, range) {
    // Default values stripe all rows
    var allRows = this._elTbody.rows;
    var nStartIndex = 0;
    var nEndIndex = allRows.length;

    // Stripe a subset
    if((row !== null) && (row !== undefined)) {
        // Validate given start row
        var elStartRow = this.getTrEl(row);
        if(elStartRow) {
            nStartIndex = elStartRow.sectionRowIndex;

            // Validate given range
            if(YAHOO.lang.isNumber(range) && (range > 1)) {
                nEndIndex = nStartIndex + range;
            }
        }
    }

    for(var i=nStartIndex; i<nEndIndex; i++) {
        if(i%2) {
            YAHOO.util.Dom.removeClass(allRows[i], YAHOO.widget.DataTable.CLASS_EVEN);
            YAHOO.util.Dom.addClass(allRows[i], YAHOO.widget.DataTable.CLASS_ODD);
        }
        else {
            YAHOO.util.Dom.removeClass(allRows[i], YAHOO.widget.DataTable.CLASS_ODD);
            YAHOO.util.Dom.addClass(allRows[i], YAHOO.widget.DataTable.CLASS_EVEN);
        }
    }
};













































/////////////////////////////////////////////////////////////////////////////
//
// Private DOM Event Handlers
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Syncs scrolltop and scrollleft of all TABLEs.
 *
 * @method _onScroll
 * @param e {HTMLEvent} The scroll event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance
 * @private
 */
YAHOO.widget.DataTable.prototype._onScroll = function(e, oSelf) {
    oSelf._elTheadContainer.scrollLeft = oSelf._elTbodyContainer.scrollLeft;

    if(oSelf._oCellEditor && oSelf._oCellEditor.isActive) {
        oSelf.fireEvent("editorBlurEvent", {editor:oSelf._oCellEditor});
        oSelf.cancelCellEditor();
    }

    var elTarget = YAHOO.util.Event.getTarget(e);
    var elTag = elTarget.tagName.toLowerCase();
    oSelf.fireEvent("tableScrollEvent", {event:e, target:elTarget});
};

/**
 * Handles click events on the DOCUMENT.
 *
 * @method _onDocumentClick
 * @param e {HTMLEvent} The click event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onDocumentClick = function(e, oSelf) {
    var elTarget = YAHOO.util.Event.getTarget(e);
    var elTag = elTarget.tagName.toLowerCase();

    if(!YAHOO.util.Dom.isAncestor(oSelf._elContainer, elTarget)) {
        oSelf.fireEvent("tableBlurEvent");

        // Fires editorBlurEvent when click is not within the TABLE.
        // For cases when click is within the TABLE, due to timing issues,
        // the editorBlurEvent needs to get fired by the lower-level DOM click
        // handlers below rather than by the TABLE click handler directly.
        if(oSelf._oCellEditor && oSelf._oCellEditor.isActive) {
            // Only if the click was not within the Cell Editor container
            if(!YAHOO.util.Dom.isAncestor(oSelf._oCellEditor.container, elTarget) &&
                    (oSelf._oCellEditor.container.id !== elTarget.id)) {
                oSelf.fireEvent("editorBlurEvent", {editor:oSelf._oCellEditor});
            }
        }
    }
};

/**
 * Handles focus events on the DataTable instance.
 *
 * @method _onTableFocus
 * @param e {HTMLEvent} The focus event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onTableFocus = function(e, oSelf) {
    oSelf.fireEvent("tableFocusEvent");
};

/**
 * Handles focus events on the THEAD element.
 *
 * @method _onTheadFocus
 * @param e {HTMLEvent} The focus event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onTheadFocus = function(e, oSelf) {
    oSelf.fireEvent("theadFocusEvent");
    oSelf.fireEvent("tableFocusEvent");
};

/**
 * Handles focus events on the TBODY element.
 *
 * @method _onTbodyFocus
 * @param e {HTMLEvent} The focus event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onTbodyFocus = function(e, oSelf) {
    oSelf.fireEvent("tbodyFocusEvent");
    oSelf.fireEvent("tableFocusEvent");
};

/**
 * Handles mouseover events on the DataTable instance.
 *
 * @method _onTableMouseover
 * @param e {HTMLEvent} The mouseover event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onTableMouseover = function(e, oSelf) {
    var elTarget = YAHOO.util.Event.getTarget(e);
    var elTag = elTarget.tagName.toLowerCase();
    var bKeepBubbling = true;
    while(elTarget && (elTag != "table")) {
        switch(elTag) {
            case "body":
                 return;
            case "a":
                break;
            case "td":
                bKeepBubbling = oSelf.fireEvent("cellMouseoverEvent",{target:elTarget,event:e});
                break;
            case "span":
                if(YAHOO.util.Dom.hasClass(elTarget, YAHOO.widget.DataTable.CLASS_LABEL)) {
                    bKeepBubbling = oSelf.fireEvent("theadLabelMouseoverEvent",{target:elTarget,event:e});
                    // Backward compatibility
                    bKeepBubbling = oSelf.fireEvent("headerLabelMouseoverEvent",{target:elTarget,event:e});
                }
                break;
            case "th":
                bKeepBubbling = oSelf.fireEvent("theadCellMouseoverEvent",{target:elTarget,event:e});
                // Backward compatibility
                bKeepBubbling = oSelf.fireEvent("headerCellMouseoverEvent",{target:elTarget,event:e});
                break;
            case "tr":
                if(elTarget.parentNode.tagName.toLowerCase() == "thead") {
                    bKeepBubbling = oSelf.fireEvent("theadRowMouseoverEvent",{target:elTarget,event:e});
                    // Backward compatibility
                    bKeepBubbling = oSelf.fireEvent("headerRowMouseoverEvent",{target:elTarget,event:e});
                }
                else {
                    bKeepBubbling = oSelf.fireEvent("rowMouseoverEvent",{target:elTarget,event:e});
                }
                break;
            default:
                break;
        }
        if(bKeepBubbling === false) {
            return;
        }
        else {
            elTarget = elTarget.parentNode;
            if(elTarget) {
                elTag = elTarget.tagName.toLowerCase();
            }
        }
    }
    oSelf.fireEvent("tableMouseoverEvent",{target:(elTarget || oSelf._elContainer),event:e});
};

/**
 * Handles mouseout events on the DataTable instance.
 *
 * @method _onTableMouseout
 * @param e {HTMLEvent} The mouseout event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onTableMouseout = function(e, oSelf) {
    var elTarget = YAHOO.util.Event.getTarget(e);
    var elTag = elTarget.tagName.toLowerCase();
    var bKeepBubbling = true;
    while(elTarget && (elTag != "table")) {
        switch(elTag) {
            case "body":
                return;
            case "a":
                break;
            case "td":
                bKeepBubbling = oSelf.fireEvent("cellMouseoutEvent",{target:elTarget,event:e});
                break;
            case "span":
                if(YAHOO.util.Dom.hasClass(elTarget, YAHOO.widget.DataTable.CLASS_LABEL)) {
                    bKeepBubbling = oSelf.fireEvent("theadLabelMouseoutEvent",{target:elTarget,event:e});
                    // Backward compatibility
                    bKeepBubbling = oSelf.fireEvent("headerLabelMouseoutEvent",{target:elTarget,event:e});
                }
                break;
            case "th":
                bKeepBubbling = oSelf.fireEvent("theadCellMouseoutEvent",{target:elTarget,event:e});
                // Backward compatibility
                bKeepBubbling = oSelf.fireEvent("headerCellMouseoutEvent",{target:elTarget,event:e});
                break;
            case "tr":
                if(elTarget.parentNode.tagName.toLowerCase() == "thead") {
                    bKeepBubbling = oSelf.fireEvent("theadRowMouseoutEvent",{target:elTarget,event:e});
                    // Backward compatibility
                    bKeepBubbling = oSelf.fireEvent("headerRowMouseoutEvent",{target:elTarget,event:e});
                }
                else {
                    bKeepBubbling = oSelf.fireEvent("rowMouseoutEvent",{target:elTarget,event:e});
                }
                break;
            default:
                break;
        }
        if(bKeepBubbling === false) {
            return;
        }
        else {
            elTarget = elTarget.parentNode;
            if(elTarget) {
                elTag = elTarget.tagName.toLowerCase();
            }
        }
    }
    oSelf.fireEvent("tableMouseoutEvent",{target:(elTarget || oSelf._elContainer),event:e});
};

/**
 * Handles mousedown events on the DataTable instance.
 *
 * @method _onTableMousedown
 * @param e {HTMLEvent} The mousedown event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onTableMousedown = function(e, oSelf) {
    var elTarget = YAHOO.util.Event.getTarget(e);
    var elTag = elTarget.tagName.toLowerCase();
    var bKeepBubbling = true;
    while(elTarget && (elTag != "table")) {
        switch(elTag) {
            case "body":
                return;
            case "a":
                break;
            case "td":
                bKeepBubbling = oSelf.fireEvent("cellMousedownEvent",{target:elTarget,event:e});
                break;
            case "span":
                if(YAHOO.util.Dom.hasClass(elTarget, YAHOO.widget.DataTable.CLASS_LABEL)) {
                    bKeepBubbling = oSelf.fireEvent("theadLabelMousedownEvent",{target:elTarget,event:e});
                    // Backward compatibility
                    bKeepBubbling = oSelf.fireEvent("headerLabelMousedownEvent",{target:elTarget,event:e});
                }
                break;
            case "th":
                bKeepBubbling = oSelf.fireEvent("theadCellMousedownEvent",{target:elTarget,event:e});
                // Backward compatibility
                bKeepBubbling = oSelf.fireEvent("headerCellMousedownEvent",{target:elTarget,event:e});
                break;
            case "tr":
                if(elTarget.parentNode.tagName.toLowerCase() == "thead") {
                    bKeepBubbling = oSelf.fireEvent("theadRowMousedownEvent",{target:elTarget,event:e});
                    // Backward compatibility
                    bKeepBubbling = oSelf.fireEvent("headerRowMousedownEvent",{target:elTarget,event:e});
                }
                else {
                    bKeepBubbling = oSelf.fireEvent("rowMousedownEvent",{target:elTarget,event:e});
                }
                break;
            default:
                break;
        }
        if(bKeepBubbling === false) {
            return;
        }
        else {
            elTarget = elTarget.parentNode;
            if(elTarget) {
                elTag = elTarget.tagName.toLowerCase();
            }
        }
    }
    oSelf.fireEvent("tableMousedownEvent",{target:(elTarget || oSelf._elContainer),event:e});
};

/**
 * Handles dblclick events on the DataTable instance.
 *
 * @method _onTableDblclick
 * @param e {HTMLEvent} The dblclick event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onTableDblclick = function(e, oSelf) {
    var elTarget = YAHOO.util.Event.getTarget(e);
    var elTag = elTarget.tagName.toLowerCase();
    var bKeepBubbling = true;
    while(elTarget && (elTag != "table")) {
        switch(elTag) {
            case "body":
                return;
            case "td":
                bKeepBubbling = oSelf.fireEvent("cellDblclickEvent",{target:elTarget,event:e});
                break;
            case "span":
                if(YAHOO.util.Dom.hasClass(elTarget, YAHOO.widget.DataTable.CLASS_LABEL)) {
                    bKeepBubbling = oSelf.fireEvent("theadLabelDblclickEvent",{target:elTarget,event:e});
                    // Backward compatibility
                    bKeepBubbling = oSelf.fireEvent("headerLabelDblclickEvent",{target:elTarget,event:e});
                }
                break;
            case "th":
                bKeepBubbling = oSelf.fireEvent("theadCellDblclickEvent",{target:elTarget,event:e});
                // Backward compatibility
                bKeepBubbling = oSelf.fireEvent("headerCellDblclickEvent",{target:elTarget,event:e});
                break;
            case "tr":
                if(elTarget.parentNode.tagName.toLowerCase() == "thead") {
                    bKeepBubbling = oSelf.fireEvent("theadRowDblclickEvent",{target:elTarget,event:e});
                    // Backward compatibility
                    bKeepBubbling = oSelf.fireEvent("headerRowDblclickEvent",{target:elTarget,event:e});
                }
                else {
                    bKeepBubbling = oSelf.fireEvent("rowDblclickEvent",{target:elTarget,event:e});
                }
                break;
            default:
                break;
        }
        if(bKeepBubbling === false) {
            return;
        }
        else {
            elTarget = elTarget.parentNode;
            if(elTarget) {
                elTag = elTarget.tagName.toLowerCase();
            }
        }
    }
    oSelf.fireEvent("tableDblclickEvent",{target:(elTarget || oSelf._elContainer),event:e});
};
/**
 * Handles keydown events on the THEAD element.
 *
 * @method _onTheadKeydown
 * @param e {HTMLEvent} The key event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onTheadKeydown = function(e, oSelf) {
    // If tabbing to next TH label link causes THEAD to scroll,
    // need to sync scrollLeft with TBODY
    if(YAHOO.util.Event.getCharCode(e) === 9) {
        setTimeout(function() {
            if((oSelf instanceof YAHOO.widget.DataTable) && oSelf._sId) {
                oSelf._elTbodyContainer.scrollLeft = oSelf._elTheadContainer.scrollLeft;
            }
        },0);
    }
    
    var elTarget = YAHOO.util.Event.getTarget(e);
    var elTag = elTarget.tagName.toLowerCase();
    var bKeepBubbling = true;
    while(elTarget && (elTag != "table")) {
        switch(elTag) {
            case "body":
                return;
            case "input":
            case "textarea":
                // TODO
                break;
            case "thead":
                bKeepBubbling = oSelf.fireEvent("theadKeyEvent",{target:elTarget,event:e});
                break;
            default:
                break;
        }
        if(bKeepBubbling === false) {
            return;
        }
        else {
            elTarget = elTarget.parentNode;
            if(elTarget) {
                elTag = elTarget.tagName.toLowerCase();
            }
        }
    }
    oSelf.fireEvent("tableKeyEvent",{target:(elTarget || oSelf._elContainer),event:e});
};

/**
 * Handles keydown events on the TBODY element. Handles selection behavior,
 * provides hooks for ENTER to edit functionality.
 *
 * @method _onTbodyKeydown
 * @param e {HTMLEvent} The key event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onTbodyKeydown = function(e, oSelf) {
    var sMode = oSelf.get("selectionMode");

    if(sMode == "standard") {
        oSelf._handleStandardSelectionByKey(e);
    }
    else if(sMode == "single") {
        oSelf._handleSingleSelectionByKey(e);
    }
    else if(sMode == "cellblock") {
        oSelf._handleCellBlockSelectionByKey(e);
    }
    else if(sMode == "cellrange") {
        oSelf._handleCellRangeSelectionByKey(e);
    }
    else if(sMode == "singlecell") {
        oSelf._handleSingleCellSelectionByKey(e);
    }
    
    if(oSelf._oCellEditor && oSelf._oCellEditor.isActive) {
        oSelf.fireEvent("editorBlurEvent", {editor:oSelf._oCellEditor});
    }

    var elTarget = YAHOO.util.Event.getTarget(e);
    var elTag = elTarget.tagName.toLowerCase();
    var bKeepBubbling = true;
    while(elTarget && (elTag != "table")) {
        switch(elTag) {
            case "body":
                return;
            case "tbody":
                bKeepBubbling = oSelf.fireEvent("tbodyKeyEvent",{target:elTarget,event:e});
                break;
            default:
                break;
        }
        if(bKeepBubbling === false) {
            return;
        }
        else {
            elTarget = elTarget.parentNode;
            if(elTarget) {
                elTag = elTarget.tagName.toLowerCase();
            }
        }
    }
    oSelf.fireEvent("tableKeyEvent",{target:(elTarget || oSelf._elContainer),event:e});
};

/**
 * Handles keypress events on the TABLE. Mainly to support stopEvent on Mac.
 *
 * @method _onTableKeypress
 * @param e {HTMLEvent} The key event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onTableKeypress = function(e, oSelf) {
    if(YAHOO.env.ua.webkit) {
        var nKey = YAHOO.util.Event.getCharCode(e);
        // arrow down
        if(nKey == 40) {
            YAHOO.util.Event.stopEvent(e);
        }
        // arrow up
        else if(nKey == 38) {
            YAHOO.util.Event.stopEvent(e);
        }
    }
};

/**
 * Handles click events on the THEAD element.
 *
 * @method _onTheadClick
 * @param e {HTMLEvent} The click event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onTheadClick = function(e, oSelf) {
    // Always blur the cell editor
    if(oSelf._oCellEditor && oSelf._oCellEditor.isActive) {
        oSelf.fireEvent("editorBlurEvent", {editor:oSelf._oCellEditor});
    }

    var elTarget = YAHOO.util.Event.getTarget(e);
    var elTag = elTarget.tagName.toLowerCase();
    var bKeepBubbling = true;
    while(elTarget && (elTag != "table")) {
        switch(elTag) {
            case "body":
                return;
            case "input":
                if(elTarget.type.toLowerCase() == "checkbox") {
                    bKeepBubbling = oSelf.fireEvent("theadCheckboxClickEvent",{target:elTarget,event:e});
                }
                else if(elTarget.type.toLowerCase() == "radio") {
                    bKeepBubbling = oSelf.fireEvent("theadRadioClickEvent",{target:elTarget,event:e});
                }
                break;
            case "a":
                bKeepBubbling = oSelf.fireEvent("theadLinkClickEvent",{target:elTarget,event:e});
                break;
            case "button":
                bKeepBubbling = oSelf.fireEvent("theadButtonClickEvent",{target:elTarget,event:e});
                break;
            case "span":
                if(YAHOO.util.Dom.hasClass(elTarget, YAHOO.widget.DataTable.CLASS_LABEL)) {
                    bKeepBubbling = oSelf.fireEvent("theadLabelClickEvent",{target:elTarget,event:e});
                    // Backward compatibility
                    bKeepBubbling = oSelf.fireEvent("headerLabelClickEvent",{target:elTarget,event:e});
                }
                break;
            case "th":
                bKeepBubbling = oSelf.fireEvent("theadCellClickEvent",{target:elTarget,event:e});
                // Backward compatibility
                bKeepBubbling = oSelf.fireEvent("headerCellClickEvent",{target:elTarget,event:e});
                break;
            case "tr":
                bKeepBubbling = oSelf.fireEvent("theadRowClickEvent",{target:elTarget,event:e});
                // Backward compatibility
                bKeepBubbling = oSelf.fireEvent("headerRowClickEvent",{target:elTarget,event:e});
                break;
            default:
                break;
        }
        if(bKeepBubbling === false) {
            return;
        }
        else {
            elTarget = elTarget.parentNode;
            if(elTarget) {
                elTag = elTarget.tagName.toLowerCase();
            }
        }
    }
    oSelf.fireEvent("tableClickEvent",{target:(elTarget || oSelf._elContainer),event:e});
};

/**
 * Handles click events on the primary TBODY element.
 *
 * @method _onTbodyClick
 * @param e {HTMLEvent} The click event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onTbodyClick = function(e, oSelf) {
    // Always blur the cell editor
    if(oSelf._oCellEditor && oSelf._oCellEditor.isActive) {
        oSelf.fireEvent("editorBlurEvent", {editor:oSelf._oCellEditor});
    }

    // Fire Custom Events
    var elTarget = YAHOO.util.Event.getTarget(e);
    var elTag = elTarget.tagName.toLowerCase();
    var bKeepBubbling = true;
    while(elTarget && (elTag != "table")) {
        switch(elTag) {
            case "body":
                return;
            case "input":
                if(elTarget.type.toLowerCase() == "checkbox") {
                    bKeepBubbling = oSelf.fireEvent("checkboxClickEvent",{target:elTarget,event:e});
                }
                else if(elTarget.type.toLowerCase() == "radio") {
                    bKeepBubbling = oSelf.fireEvent("radioClickEvent",{target:elTarget,event:e});
                }
                break;
            case "a":
                bKeepBubbling = oSelf.fireEvent("linkClickEvent",{target:elTarget,event:e});
                break;
            case "button":
                bKeepBubbling = oSelf.fireEvent("buttonClickEvent",{target:elTarget,event:e});
                break;
            case "td":
                bKeepBubbling = oSelf.fireEvent("cellClickEvent",{target:elTarget,event:e});
                break;
            case "tr":
                bKeepBubbling = oSelf.fireEvent("rowClickEvent",{target:elTarget,event:e});
                break;
            default:
                break;
        }
        if(!bKeepBubbling) {
            return;
        }
        else {
            elTarget = elTarget.parentNode;
            if(elTarget) {
                elTag = elTarget.tagName.toLowerCase();
            }
        }
    }
    oSelf.fireEvent("tableClickEvent",{target:(elTarget || oSelf._elContainer),event:e});
};

/*TODO undeprecate?
 * Handles change events on SELECT elements within DataTable.
 *
 * @method _onDropdownChange
 * @param e {HTMLEvent} The change event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 * @deprecated
 */
YAHOO.widget.DataTable.prototype._onDropdownChange = function(e, oSelf) {
    var elTarget = YAHOO.util.Event.getTarget(e);
    //TODO: pass what args?
    //var value = elTarget[elTarget.selectedIndex].value;
    oSelf.fireEvent("dropdownChangeEvent", {event:e, target:elTarget});
};
































/////////////////////////////////////////////////////////////////////////////
//
// Public member variables
//
/////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////
//
// Public methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Returns unique id assigned to instance, which is a useful prefix for
 * generating unique DOM ID strings.
 *
 * @property getId
 * @type String
 */
YAHOO.widget.DataTable.prototype.getId = function() {
    return this._sId;
};

/**
 * DataSource instance name, for logging.
 *
 * @method toString
 * @return {String} Unique name of the DataSource instance.
 */

YAHOO.widget.DataTable.prototype.toString = function() {
    return "DataTable instance " + this._sId;
};

/**
 * Returns the DataTable instance's DataSource instance.
 *
 * @method getDataSource
 * @return {YAHOO.util.DataSource} DataSource instance.
 */
YAHOO.widget.DataTable.prototype.getDataSource = function() {
    return this._oDataSource;
};

/**
 * Returns the DataTable instance's ColumnSet instance.
 *
 * @method getColumnSet
 * @return {YAHOO.widget.ColumnSet} ColumnSet instance.
 */
YAHOO.widget.DataTable.prototype.getColumnSet = function() {
    return this._oColumnSet;
};

/**
 * Returns the DataTable instance's RecordSet instance.
 *
 * @method getRecordSet
 * @return {YAHOO.widget.RecordSet} RecordSet instance.
 */
YAHOO.widget.DataTable.prototype.getRecordSet = function() {
    return this._oRecordSet;
};

/**
 * Returns the DataTable instance's Cell Editor as an object literal with the
 * following properties:
 * <dl>
 * <dt>cell</dt>
 * <dd>{HTMLElement} Cell element being edited.</dd>
 *
 * <dt>column</dt>
 * <dd>{YAHOO.widget.Column} Associated Column instance.</dd>
 *
 * <dt>container</dt>
 * <dd>{HTMLElement} Reference to editor's container DIV element.</dd>
 *
 * <dt>isActive</dt>
 * <dd>{Boolean} True if cell is currently being edited.</dd>
 *
 * <dt>record</dt>
 * <dd>{YAHOO.widget.Record} Associated Record instance.</dd>
 *
 * <dt>validator</dt>
 * <dd>{HTMLFunction} Associated validator function called before new data is stored. Called
 * within the scope of the DataTable instance, the function receieves the
 * following arguments:
 *
 * <dl>
 *  <dt>oNewData</dt>
 *  <dd>{Object} New data to validate.</dd>
 *
 *  <dt>oOldData</dt>
 *  <dd>{Object} Original data in case of reversion.</dd>
 *
 *  <dt>oCellEditor</dt>
 *  <dd>{Object} Object literal representation of Editor values.</dd>
 * </dl>
 *
 *  </dd>
 *
 * <dt>defaultValue</dt>
 * <dd>Dynamically settable default value</dd>
 * </dl>
 *
 * <dt>value</dt>
 * <dd>Current input value</dd>
 * </dl>
 *
 *
 *
 *
 *
 * @method getCellEditor
 * @return {Object} Cell Editor object literal values.
 */
YAHOO.widget.DataTable.prototype.getCellEditor = function() {
    return this._oCellEditor;
};











































// DOM ACCESSORS

/**
 * Returns DOM reference to the DataTable's container element.
 *
 * @method getContainerEl
 * @return {HTMLElement} Reference to DIV element.
 */
YAHOO.widget.DataTable.prototype.getContainerEl = function() {
    return this._elContainer;
};

/**
 * Returns DOM reference to the DataTable's THEAD element.
 *
 * @method getTheadEl
 * @return {HTMLElement} Reference to THEAD element.
 */
YAHOO.widget.DataTable.prototype.getTheadEl = function() {
    return this._elThead;
};

/**
 * Returns DOM reference to the DataTable's primary TBODY element.
 *
 * @method getTbodyEl
 * @return {HTMLElement} Reference to TBODY element.
 */
YAHOO.widget.DataTable.prototype.getTbodyEl = function() {
    return this._elTbody;
};

/**
 * Returns DOM reference to the DataTable's secondary TBODY element that is
 * used to display messages.
 *
 * @method getMsgTbodyEl
 * @return {HTMLElement} Reference to TBODY element.
 */
YAHOO.widget.DataTable.prototype.getMsgTbodyEl = function() {
    return this._elMsgTbody;
};

/**
 * Returns DOM reference to the TD element within the secondary TBODY that is
 * used to display messages.
 *
 * @method getMsgTdEl
 * @return {HTMLElement} Reference to TD element.
 */
YAHOO.widget.DataTable.prototype.getMsgTdEl = function() {
    return this._elMsgTd;
};

/**
 * Returns the corresponding TR reference for a given DOM element, ID string or
 * directly page row index. If the given identifier is a child of a TR element,
 * then DOM tree is traversed until a parent TR element is returned, otherwise
 * null.
 *
 * @method getTrEl
 * @param row {HTMLElement | String | Number | YAHOO.widget.Record} Which row to
 * get: by element reference, ID string, page row index, or Record.
 * @return {HTMLElement} Reference to TR element, or null.
 */
YAHOO.widget.DataTable.prototype.getTrEl = function(row) {
    var allRows = this._elTbody.rows;

    // By Record
    if(row instanceof YAHOO.widget.Record) {
        var nTrIndex = this.getTrIndex(row);
            if(nTrIndex !== null) {
                return allRows[nTrIndex];
            }
            // Not a valid Record
            else {
                return null;
            }
    }
    // By page row index
    else if(YAHOO.lang.isNumber(row) && (row > -1) && (row < allRows.length)) {
        return allRows[row];
    }
    // By ID string or element reference
    else {
        var elRow;
        var el = YAHOO.util.Dom.get(row);

        // Validate HTML element
        if(el && (el.ownerDocument == document)) {
            // Validate TR element
            if(el.tagName.toLowerCase() != "tr") {
                // Traverse up the DOM to find the corresponding TR element
                elRow = YAHOO.util.Dom.getAncestorByTagName(el,"tr");
            }
            else {
                elRow = el;
            }

            // Make sure the TR is in this TBODY
            if(elRow && (elRow.parentNode == this._elTbody)) {
                // Now we can return the TR element
                return elRow;
            }
        }
    }

    return null;
};

/**
 * Returns DOM reference to the first TR element in the DataTable page, or null.
 *
 * @method getFirstTrEl
 * @return {HTMLElement} Reference to TR element.
 */
YAHOO.widget.DataTable.prototype.getFirstTrEl = function() {
    return this._elTbody.rows[0] || null;
};

/**
 * Returns DOM reference to the last TR element in the DataTable page, or null.
 *
 * @method getLastTrEl
 * @return {HTMLElement} Reference to last TR element.
 */
YAHOO.widget.DataTable.prototype.getLastTrEl = function() {
    var allRows = this._elTbody.rows;
        if(allRows.length > 0) {
            return allRows[allRows.length-1] || null;
        }
};

/**
 * Returns DOM reference to the next TR element from the given TR element, or null.
 *
 * @method getNextTrEl
 * @param row {HTMLElement | String | Number | YAHOO.widget.Record} Element
 * reference, ID string, page row index, or Record from which to get next TR element.
 * @return {HTMLElement} Reference to next TR element.
 */
YAHOO.widget.DataTable.prototype.getNextTrEl = function(row) {
    var nThisTrIndex = this.getTrIndex(row);
    if(nThisTrIndex !== null) {
        var allRows = this._elTbody.rows;
        if(nThisTrIndex < allRows.length-1) {
            return allRows[nThisTrIndex+1];
        }
    }

    YAHOO.log("Could not get next TR element for row " + row, "info", this.toString());
    return null;
};

/**
 * Returns DOM reference to the previous TR element from the given TR element, or null.
 *
 * @method getPreviousTrEl
 * @param row {HTMLElement | String | Number | YAHOO.widget.Record} Element
 * reference, ID string, page row index, or Record from which to get previous TR element.
 * @return {HTMLElement} Reference to previous TR element.
 */
YAHOO.widget.DataTable.prototype.getPreviousTrEl = function(row) {
    var nThisTrIndex = this.getTrIndex(row);
    if(nThisTrIndex !== null) {
        var allRows = this._elTbody.rows;
        if(nThisTrIndex > 0) {
            return allRows[nThisTrIndex-1];
        }
    }

    YAHOO.log("Could not get previous TR element for row " + row, "info", this.toString());
    return null;
};

/**
 * Returns DOM reference to a TD element.
 *
 * @method getTdEl
 * @param cell {HTMLElement | String | Object} DOM element reference or string ID, or
 * object literal of syntax {record:oRecord, column:oColumn}.
 * @return {HTMLElement} Reference to TD element.
 */
YAHOO.widget.DataTable.prototype.getTdEl = function(cell) {
    var elCell;
    var el = YAHOO.util.Dom.get(cell);

    // Validate HTML element
    if(el && (el.ownerDocument == document)) {
        // Validate TD element
        if(el.tagName.toLowerCase() != "td") {
            // Traverse up the DOM to find the corresponding TR element
            elCell = YAHOO.util.Dom.getAncestorByTagName(el, "td");
        }
        else {
            elCell = el;
        }

        // Make sure the TD is in this TBODY
        if(elCell && (elCell.parentNode.parentNode == this._elTbody)) {
            // Now we can return the TD element
            return elCell;
        }
    }
    else {
        var oRecord, nColKeyIndex;

        if(YAHOO.lang.isString(cell.columnId) && YAHOO.lang.isString(cell.recordId)) {
            oRecord = this.getRecord(cell.recordId);
            var oColumn = this.getColumnById(cell.columnId);
            if(oColumn) {
                nColKeyIndex = oColumn.getKeyIndex();
            }

        }
        if(cell.record && cell.column && cell.column.getKeyIndex) {
            oRecord = cell.record;
            nColKeyIndex = cell.column.getKeyIndex();
        }
        var elRow = this.getTrEl(oRecord);
        if((nColKeyIndex !== null) && elRow && elRow.cells && elRow.cells.length > 0) {
            return elRow.cells[nColKeyIndex] || null;
        }
    }

    return null;
};

/**
 * Returns DOM reference to the first TD element in the DataTable page (by default),
 * the first TD element of the optionally given row, or null.
 *
 * @method getFirstTdEl
 * @param {HTMLElement} (
 * @return {HTMLElement} Reference to TD element.
 */
YAHOO.widget.DataTable.prototype.getFirstTdEl = function(row) {
    var elRow = this.getTrEl(row) || this.getFirstTrEl();
    if(elRow && (elRow.cells.length > 0)) {
        return elRow.cells[0];
    }
    YAHOO.log("Could not get first TD element for row " + elRow, "info", this.toString());
    return null;
};

/**
 * Returns DOM reference to the last TD element in the DataTable page (by default),
 * the first TD element of the optionally given row, or null.
 *
 * @method getLastTdEl
 * @return {HTMLElement} Reference to last TD element.
 */
YAHOO.widget.DataTable.prototype.getLastTdEl = function(row) {
    var elRow = this.getTrEl(row) || this.getLastTrEl();
    if(elRow && (elRow.cells.length > 0)) {
        return elRow.cells[elRow.cells.length-1];
    }
    YAHOO.log("Could not get last TD element for row " + elRow, "info", this.toString());
    return null;
};

/**
 * Returns DOM reference to the next TD element from the given cell, or null.
 *
 * @method getNextTdEl
 * @param cell {HTMLElement | String | Object} DOM element reference or string ID, or
 * object literal of syntax {record:oRecord, column:oColumn} from which to get next TD element.
 * @return {HTMLElement} Reference to next TD element, or null.
 */
YAHOO.widget.DataTable.prototype.getNextTdEl = function(cell) {
    var elCell = this.getTdEl(cell);
    if(elCell) {
        var nThisTdIndex = elCell.yuiCellIndex;
        var elRow = this.getTrEl(elCell);
        if(nThisTdIndex < elRow.cells.length-1) {
            return elRow.cells[nThisTdIndex+1];
        }
        else {
            var elNextRow = this.getNextTrEl(elRow);
            if(elNextRow) {
                return elNextRow.cells[0];
            }
        }
    }
    YAHOO.log("Could not get next TD element for cell " + cell, "info", this.toString());
    return null;
};

/**
 * Returns DOM reference to the previous TD element from the given cell, or null.
 *
 * @method getPreviousTdEl
 * @param cell {HTMLElement | String | Object} DOM element reference or string ID, or
 * object literal of syntax {record:oRecord, column:oColumn} from which to get previous TD element.
 * @return {HTMLElement} Reference to previous TD element, or null.
 */
YAHOO.widget.DataTable.prototype.getPreviousTdEl = function(cell) {
    var elCell = this.getTdEl(cell);
    if(elCell) {
        var nThisTdIndex = elCell.yuiCellIndex;
        var elRow = this.getTrEl(elCell);
        if(nThisTdIndex > 0) {
            return elRow.cells[nThisTdIndex-1];
        }
        else {
            var elPreviousRow = this.getPreviousTrEl(elRow);
            if(elPreviousRow) {
                return this.getLastTdEl(elPreviousRow);
            }
        }
    }
    YAHOO.log("Could not get next TD element for cell " + cell, "info", this.toString());
    return null;
};

/**
 * Returns DOM reference to the above TD element from the given cell, or null.
 *
 * @method getAboveTdEl
 * @param cell {HTMLElement | String | Object} DOM element reference or string ID, or
 * object literal of syntax {record:oRecord, column:oColumn} from which to get next TD element.
 * @return {HTMLElement} Reference to next TD element, or null.
 */
YAHOO.widget.DataTable.prototype.getAboveTdEl = function(cell) {
    var elCell = this.getTdEl(cell);
    if(elCell) {
        var elPreviousRow = this.getPreviousTrEl(elCell);
        if(elPreviousRow) {
            return elPreviousRow.cells[elCell.yuiCellIndex];
        }
    }
    YAHOO.log("Could not get above TD element for cell " + cell, "info", this.toString());
    return null;
};

/**
 * Returns DOM reference to the below TD element from the given cell, or null.
 *
 * @method getBelowTdEl
 * @param cell {HTMLElement | String | Object} DOM element reference or string ID, or
 * object literal of syntax {record:oRecord, column:oColumn} from which to get previous TD element.
 * @return {HTMLElement} Reference to previous TD element, or null.
 */
YAHOO.widget.DataTable.prototype.getBelowTdEl = function(cell) {
    var elCell = this.getTdEl(cell);
    if(elCell) {
        var elNextRow = this.getNextTrEl(elCell);
        if(elNextRow) {
            return elNextRow.cells[elCell.yuiCellIndex];
        }
    }
    YAHOO.log("Could not get below TD element for cell " + cell, "info", this.toString());
    return null;
};

/**
 * Returns DOM reference to a TH element.
 *
 * @method getThEl
 * @param theadCell {YAHOO.widget.Column | HTMLElement | String} Column instance,
 * DOM element reference, or string ID.
 * @return {HTMLElement} Reference to TH element.
 */
YAHOO.widget.DataTable.prototype.getThEl = function(theadCell) {
    var elTheadCell;

    // Validate Column instance
    if(theadCell instanceof YAHOO.widget.Column) {
        var oColumn = theadCell;
        elTheadCell = oColumn.getThEl();
        if(elTheadCell) {
            return elTheadCell;
        }
    }
    // Validate HTML element
    else {
        var el = YAHOO.util.Dom.get(theadCell);

        if(el && (el.ownerDocument == document)) {
            // Validate TH element
            if(el.tagName.toLowerCase() != "th") {
                // Traverse up the DOM to find the corresponding TR element
                elTheadCell = YAHOO.util.Dom.getAncestorByTagName(el,"th");
            }
            else {
                elTheadCell = el;
            }

            // Make sure the TH is in this THEAD
            if(elTheadCell && (elTheadCell.parentNode.parentNode == this._elThead)) {
                // Now we can return the TD element
                return elTheadCell;
            }
        }
    }

    return null;
};

/**
 * Returns the page row index of given row. Returns null if the row is not on the
 * current DataTable page.
 *
 * @method getTrIndex
 * @param row {HTMLElement | String | YAHOO.widget.Record | Number} DOM or ID
 * string reference to an element within the DataTable page, a Record instance,
 * or a Record's RecordSet index.
 * @return {Number} Page row index, or null if row does not exist or is not on current page.
 */
YAHOO.widget.DataTable.prototype.getTrIndex = function(row) {
    var nRecordIndex;

    // By Record
    if(row instanceof YAHOO.widget.Record) {
        nRecordIndex = this._oRecordSet.getRecordIndex(row);
        if(nRecordIndex === null) {
            // Not a valid Record
            return null;
        }
    }
    // Calculate page row index from Record index
    else if(YAHOO.lang.isNumber(row)) {
        nRecordIndex = row;
    }
    if(YAHOO.lang.isNumber(nRecordIndex)) {
        // Validate the number
        if((nRecordIndex > -1) && (nRecordIndex < this._oRecordSet.getLength())) {
            // DataTable is paginated
            var oPaginator = this.get('paginator');
            if(oPaginator instanceof YAHOO.widget.Paginator || this.get('paginated')) {
                // Get the first and last Record on current page
                var startRecordIndex = 0,
                    endRecordIndex   = 0;

                if (oPaginator instanceof YAHOO.widget.Paginator) {
                    var rng = oPaginator.getCurrentRecords();
                    startRecordIndex = rng[0];
                    endRecordIndex   = rng[1];
                } else {
                    startRecordIndex = oPaginator.startRecordIndex;
                    endRecordIndex = startRecordIndex + oPaginator.rowsPerPage - 1;
                }

                // This Record is on current page
                if((nRecordIndex >= startRecordIndex) && (nRecordIndex <= endRecordIndex)) {
                    return nRecordIndex - startRecordIndex;
                }
                // This Record is not on current page
                else {
                    return null;
                }
            }
            // Not paginated, just return the Record index
            else {
                return nRecordIndex;
            }
        }
        // RecordSet index is out of range
        else {
            return null;
        }
    }
    // By element reference or ID string
    else {
        // Validate TR element
        var elRow = this.getTrEl(row);
        if(elRow && (elRow.ownerDocument == document) &&
                (elRow.parentNode == this._elTbody)) {
            return elRow.sectionRowIndex;
        }
    }

    YAHOO.log("Could not get page row index for row " + row, "info", this.toString());
    return null;
};














































// TABLE FUNCTIONS

/**
 * Resets a RecordSet with the given data and populates the page view
 * with the new data. Any previous data and selection states are cleared.
 * However, sort states are not cleared, so if the given data is in a particular
 * sort order, implementers should take care to reset the sortedBy property. If
 * pagination is enabled, the currentPage is shown and Paginator UI updated,
 * otherwise all rows are displayed as a single page. For performance, existing
 * DOM elements are reused when possible.
 *
 * @method initializeTable
 * @param oData {Object | Object[]} An object literal of data or an array of
 * object literals containing data.
 */
YAHOO.widget.DataTable.prototype.initializeTable = function(oData) {
    // Reset init flag
    this._bInit = true;
    
    // Clear the RecordSet
    this._oRecordSet.reset();

    // Clear selections
    this._unselectAllTrEls();
    this._unselectAllTdEls();
    this._aSelections = null;
    this._oAnchorRecord = null;
    this._oAnchorCell = null;

    // Add data to RecordSet
    this._oRecordSet.addRecords(oData);

    // Render the view
    this.render(); // The initEvent will be fired by render method...
};

/**
 * Renders the view with existing Records from the RecordSet while
 * maintaining sort, pagination, and selection states. For performance, reuses
 * existing DOM elements when possible while deleting extraneous elements.
 *
 * @method render
 */
YAHOO.widget.DataTable.prototype.render = function() {
    YAHOO.log("DataTable rendering...", "info", this.toString());
    this._bRendering = true;
    this.showTableMessage(YAHOO.widget.DataTable.MSG_LOADING, YAHOO.widget.DataTable.CLASS_LOADING);
    
    var i, j, k, l, allRecords;

    // Paginator is enabled, show a subset of Records and update Paginator UI
    var oPaginator = this.get('paginator');
    var bPaginated = oPaginator instanceof YAHOO.widget.Paginator || this.get('paginated');
    if(oPaginator) {
        if (oPaginator instanceof YAHOO.widget.Paginator) {
            allRecords = this._oRecordSet.getRecords(
                            oPaginator.get('recordOffset'),
                            oPaginator.get('rowsPerPage'));
            oPaginator.render();
        }
        else {
            // Backward compatibility
            this.updatePaginator();
            var rowsPerPage = oPaginator.rowsPerPage;
            var startRecordIndex = (oPaginator.currentPage - 1) * rowsPerPage;
            allRecords = this._oRecordSet.getRecords(startRecordIndex, rowsPerPage);
            this.formatPaginators();
        }
    }
    // Show all records
    else {
        allRecords = this._oRecordSet.getRecords();
    }

    var elTbody = this._elTbody;
    var allRows = elTbody.rows;

    // Should have rows
    if(YAHOO.lang.isArray(allRecords) && (allRecords.length > 0)) {
        // Keep track of selected rows
        var allSelectedRows = this.getSelectedRows();
        // Keep track of selected cells
        var allSelectedCells = this.getSelectedCells();
        // Anything to reinstate?
        var bReselect = (allSelectedRows.length>0) || (allSelectedCells.length > 0);

        // Remove extra rows from the bottom so as to preserve ID order
        while(elTbody.hasChildNodes() && (allRows.length > allRecords.length)) {
            elTbody.deleteRow(-1);
        }

        // Unselect all TR and TD elements in the UI
        if(bReselect) {
            this._unselectAllTrEls();
            this._unselectAllTdEls();
        }

        this.hideTableMessage();

        // From the top, update in-place existing rows, so as to reuse DOM elements
        for(i=0; i<allRows.length; i++) {
            this._updateTrEl(allRows[i], allRecords[i]);
        }

        // Add more TR elements as necessary
        var oSelf = this;
        var nStartIndex = allRows.length; // where to start
        var nMaxIndex = allRecords.length; // where to end
        var loopN = this.get("renderLoopSize"); // how many per loop

        // Post loop stuff to reinstate various states
        var endLoops = function() {
            setTimeout(function() {
                if((oSelf instanceof YAHOO.widget.DataTable) && oSelf._sId) {
                     // Reinstate selected and sorted classes
                    if(bReselect) {
                        // Loop over each row
                        for(j=0; j<allRows.length; j++) {
                            var thisRow = allRows[j];
                            var sMode = oSelf.get("selectionMode");
                            if ((sMode == "standard") || (sMode == "single")) {
                                // Set SELECTED
                                for(k=0; k<allSelectedRows.length; k++) {
                                    if(allSelectedRows[k] === thisRow.yuiRecordId) {
                                        YAHOO.util.Dom.addClass(thisRow, YAHOO.widget.DataTable.CLASS_SELECTED);
                                        if(j === allRows.length-1) {
                                            oSelf._oAnchorRecord = oSelf.getRecord(thisRow.yuiRecordId);
                                        }
                                    }
                                }
                            }
                            else {
                                // Loop over each cell
                                for(k=0; k<thisRow.cells.length; k++) {
                                    var thisCell = thisRow.cells[k];
                                    // Set SELECTED
                                    for(l=0; l<allSelectedCells.length; l++) {
                                        if((allSelectedCells[l].recordId === thisRow.yuiRecordId) &&
                                                (allSelectedCells[l].columnId === thisCell.yuiColumnId)) {
                                            YAHOO.util.Dom.addClass(thisCell, YAHOO.widget.DataTable.CLASS_SELECTED);
                                            if(k === thisRow.cells.length-1) {
                                                oSelf._oAnchorCell = {record:oSelf.getRecord(thisRow.yuiRecordId), column:oSelf.getColumnById(thisCell.yuiColumnId)};
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                oSelf._bRendering = false;
                if(oSelf._bInit) {
                    oSelf._bInit = false;
                    oSelf.fireEvent("initEvent");
                    YAHOO.log("DataTable initialized with " + allRecords.length + " of " + oSelf._oRecordSet.getLength() + " rows", "info", this.toString());
                }
                else {
                    oSelf.fireEvent("renderEvent");
                    // Backward compatibility
                    oSelf.fireEvent("refreshEvent");
                    YAHOO.log("DataTable rendered " + allRecords.length + " of " + oSelf._oRecordSet.getLength() + " rows", "info", oSelf.toString());
                }
            },0);
        };

        // Timeout loops to add TR elements
        var startLoops = function(nRowIndex) {
            setTimeout(function() {
                if((oSelf instanceof YAHOO.widget.DataTable) && oSelf._sId) {
                    for(var n=nRowIndex; n<nRowIndex+loopN; n++) {
                        if(n < nMaxIndex) {
                            oSelf._addTrEl(allRecords[n]);

                        }
                        else {
                            oSelf._setFirstRow();
                            oSelf._setLastRow();
                            endLoops();
                            return;
                        }
                    }
                    startLoops(n);
                }
            }, 0);
        };
        startLoops(nStartIndex);
    }
    // Empty
    else {
        // Remove all rows
        while(elTbody.hasChildNodes()) {
            elTbody.deleteRow(-1);
        }

        this.showTableMessage(YAHOO.widget.DataTable.MSG_EMPTY, YAHOO.widget.DataTable.CLASS_EMPTY);
    }
};

/**
 * Nulls out the entire DataTable instance and related objects, removes attached
 * event listeners, and clears out DOM elements inside the container. After
 * calling this method, the instance reference should be expliclitly nulled by
 * implementer, as in myDataTable = null. Use with caution!
 *
 * @method destroy
 */
YAHOO.widget.DataTable.prototype.destroy = function() {
    // Destroy Cell Editor
    YAHOO.util.Event.purgeElement(this._oCellEditor.container, true);
    document.body.removeChild(this._oCellEditor.container);

    var instanceName = this.toString();
    var elContainer = this._elContainer;

    // Unhook custom events
    this._oRecordSet.unsubscribeAll();
    this.unsubscribeAll();

    // Unhook DOM events
    YAHOO.util.Event.purgeElement(elContainer, true);

    // Remove DOM elements
    elContainer.innerHTML = "";

    // Null out objects
    for(var param in this) {
        if(YAHOO.lang.hasOwnProperty(this, param)) {
            this[param] = null;
        }
    }

    YAHOO.log("DataTable instance destroyed: " + instanceName);
};

/**
 * Displays message within secondary TBODY.
 *
 * @method showTableMessage
 * @param sHTML {String} (optional) Value for innerHTML.
 * @param sClassName {String} (optional) Classname.
 */
YAHOO.widget.DataTable.prototype.showTableMessage = function(sHTML, sClassName) {
    var elCell = this._elMsgTd;
    if(YAHOO.lang.isString(sHTML)) {
        elCell.firstChild.innerHTML = sHTML;
    }
    if(YAHOO.lang.isString(sClassName)) {
        YAHOO.util.Dom.addClass(elCell.firstChild, sClassName);
    }

    var elCellLiner = elCell.firstChild;
    elCellLiner.style.width = ((this.getTheadEl().parentNode.offsetWidth) -
        (parseInt(YAHOO.util.Dom.getStyle(elCellLiner,"paddingLeft"),10)) -
        (parseInt(YAHOO.util.Dom.getStyle(elCellLiner,"paddingRight"),10))) + "px";

    this._elMsgTbody.style.display = "";
    this.fireEvent("tableMsgShowEvent", {html:sHTML, className:sClassName});
    YAHOO.log("DataTable showing message: " + sHTML, "info", this.toString());
};

/**
 * Hides secondary TBODY.
 *
 * @method hideTableMessage
 */
YAHOO.widget.DataTable.prototype.hideTableMessage = function() {
    if(this._elMsgTbody.style.display != "none") {
        this._elMsgTbody.style.display = "none";
        this.fireEvent("tableMsgHideEvent");
        YAHOO.log("DataTable message hidden", "info", this.toString());
    }
};

/**
 * Brings focus to the TBODY element. Alias to focusTbodyEl.
 *
 * @method focus
 */
YAHOO.widget.DataTable.prototype.focus = function() {
    this.focusTbodyEl();
};

/**
 * Brings focus to the THEAD element.
 *
 * @method focusTheadEl
 */
YAHOO.widget.DataTable.prototype.focusTheadEl = function() {
    this._focusEl(this._elThead);
};

/**
 * Brings focus to the TBODY element.
 *
 * @method focusTbodyEl
 */
YAHOO.widget.DataTable.prototype.focusTbodyEl = function() {
    this._focusEl(this._elTbody);
};

































































// RECORDSET FUNCTIONS

/**
 * Returns Record index for given TR element or page row index.
 *
 * @method getRecordIndex
 * @param row {YAHOO.widget.Record | HTMLElement | Number} Record instance, TR
 * element reference or page row index.
 * @return {Number} Record's RecordSet index, or null.
 */
YAHOO.widget.DataTable.prototype.getRecordIndex = function(row) {
    var nTrIndex;

    if(!YAHOO.lang.isNumber(row)) {
        // By Record
        if(row instanceof YAHOO.widget.Record) {
            return this._oRecordSet.getRecordIndex(row);
        }
        // By element reference
        else {
            // Find the TR element
            var el = this.getTrEl(row);
            if(el) {
                nTrIndex = el.sectionRowIndex;
            }
        }
    }
    // By page row index
    else {
        nTrIndex = row;
    }

    if(YAHOO.lang.isNumber(nTrIndex)) {
        var oPaginator = this.get("paginator");
        if(oPaginator instanceof YAHOO.widget.Paginator) {
            return oPaginator.get('recordOffset') + nTrIndex;
        }
        else if (this.get('paginated')) {
            return oPaginator.startRecordIndex + nTrIndex;
        }
        else {
            return nTrIndex;
        }
    }

    YAHOO.log("Could not get Record index for row " + row, "info", this.toString());
    return null;
};

/**
 * For the given identifier, returns the associated Record instance.
 *
 * @method getRecord
 * @param row {HTMLElement | Number | String} DOM reference to a TR element (or
 * child of a TR element), RecordSet position index, or Record ID.
 * @return {YAHOO.widget.Record} Record instance.
 */
YAHOO.widget.DataTable.prototype.getRecord = function(row) {
    var oRecord = this._oRecordSet.getRecord(row);

    if(!oRecord) {
        // Validate TR element
        var elRow = this.getTrEl(row);
        if(elRow) {
            oRecord = this._oRecordSet.getRecord(elRow.yuiRecordId);
        }
    }

    if(oRecord instanceof YAHOO.widget.Record) {
        return this._oRecordSet.getRecord(oRecord);
    }
    else {
        YAHOO.log("Could not get Record for row at " + row, "info", this.toString());
        return null;
    }
};














































// COLUMN FUNCTIONS

/**
 * For the given identifier, returns the associated Column instance. Note: For
 * getting Columns by Column ID string, please use the method getColumnById().
 *
 * @method getColumn
 * @param column {HTMLElement | String | Number} DOM reference or ID string to a
 * TH/TD element (or child of a TH/TD element), a Column key, or a ColumnSet key index.
 * @return {YAHOO.widget.Column} Column instance.
 */
 YAHOO.widget.DataTable.prototype.getColumn = function(column) {
    var oColumn = this._oColumnSet.getColumn(column);

    if(!oColumn) {
        // Validate TD element
        var elCell = this.getTdEl(column);
        if(elCell) {
            oColumn = this._oColumnSet.getColumnById(elCell.yuiColumnId);
        }
        // Validate TH element
        else {
            elCell = this.getThEl(column);
            if(elCell) {
                oColumn = this._oColumnSet.getColumnById(elCell.yuiColumnId);
            }
        }
    }
    if(!oColumn) {
        YAHOO.log("Could not get Column for column at " + column, "info", this.toString());
    }
    return oColumn;
};

/**
 * For the given Column ID, returns the associated Column instance. Note: For
 * getting Columns by key, please use the method getColumn().
 *
 * @method getColumnById
 * @param column {String} Column ID string.
 * @return {YAHOO.widget.Column} Column instance.
 */
 YAHOO.widget.DataTable.prototype.getColumnById = function(column) {
    return this._oColumnSet.getColumnById(column);
};

/**
 * For the given Column instance, returns next direction to sort.
 *
 * @method getColumnSortDir
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @return {String} DataTable.widget.CLASS_ASC or DataTable.widget.CLASS_DESC.
 */
 YAHOO.widget.DataTable.prototype.getColumnSortDir = function(oColumn) {
    // Backward compatibility
    if(oColumn.sortOptions && oColumn.sortOptions.defaultOrder) {
        if(oColumn.sortOptions.defaultOrder == "asc") {
            oColumn.sortOptions.defaultDir = YAHOO.widget.DataTable.CLASS_ASC;
        }
        else if (oColumn.sortOptions.defaultOrder == "desc") {
            oColumn.sortOptions.defaultDir = YAHOO.widget.DataTable.CLASS_DESC;
        }
    }
    
    // What is the Column's default sort direction?
    var sortDir = (oColumn.sortOptions && oColumn.sortOptions.defaultDir) ? oColumn.sortOptions.defaultDir : YAHOO.widget.DataTable.CLASS_ASC;

    // Already sorted?
    var bSorted = false;
    var oSortedBy = this.get("sortedBy");
    if(oSortedBy && (oSortedBy.key === oColumn.key)) {
        bSorted = true;
        if(oSortedBy.dir) {
            sortDir = (oSortedBy.dir == YAHOO.widget.DataTable.CLASS_ASC) ? YAHOO.widget.DataTable.CLASS_DESC : YAHOO.widget.DataTable.CLASS_ASC;
        }
        else {
            sortDir = (sortDir == YAHOO.widget.DataTable.CLASS_ASC) ? YAHOO.widget.DataTable.CLASS_DESC : YAHOO.widget.DataTable.CLASS_ASC;
        }
    }
    return sortDir;
};

/**
 * Sorts given Column.
 *
 * @method sortColumn
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @param sDir {String} (Optional) YAHOO.widget.DataTable.CLASS_ASC or
 * YAHOO.widget.DataTable.CLASS_DESC
 */
YAHOO.widget.DataTable.prototype.sortColumn = function(oColumn, sDir) {
    if(oColumn && (oColumn instanceof YAHOO.widget.Column)) {
        if(!oColumn.sortable) {
            YAHOO.util.Dom.addClass(this.getThEl(oColumn), YAHOO.widget.DataTable.CLASS_SORTABLE);
        }
        
        // Validate given direction
        if(sDir && (sDir !== YAHOO.widget.DataTable.CLASS_ASC) && (sDir !== YAHOO.widget.DataTable.CLASS_DESC)) {
            sDir = null;
        }
        
        // Get the sort dir
        var sortDir = sDir || this.getColumnSortDir(oColumn);

        // Do the actual sort
        var oSortedBy = this.get("sortedBy") || {};
        var bSorted = (oSortedBy.key === oColumn.key) ? true : false;
        if(!bSorted || sDir) {
            // Is there a custom sort handler function defined?
            var sortFnc = (oColumn.sortOptions && YAHOO.lang.isFunction(oColumn.sortOptions.sortFunction)) ?
                    // Custom sort function
                    oColumn.sortOptions.sortFunction :

                    // Default sort function
                    function(a, b, desc) {
                        var sorted = YAHOO.util.Sort.compare(a.getData(oColumn.key),b.getData(oColumn.key), desc);
                        if(sorted === 0) {
                            return YAHOO.util.Sort.compare(a.getId(),b.getId(), desc);
                        }
                        else {
                            return sorted;
                        }
                    };

            this._oRecordSet.sortRecords(sortFnc, ((sortDir == YAHOO.widget.DataTable.CLASS_DESC) ? true : false));
        }
        else {
            this._oRecordSet.reverseRecords();
        }

        // Update sortedBy tracker
        this.set("sortedBy", {key:oColumn.key, dir:sortDir, column:oColumn});

        // Reset to first page
        //TODO: Keep selection in view
        var oPaginator = this.get('paginator');
        if (oPaginator instanceof YAHOO.widget.Paginator) {
            oPaginator.setPage(1);
        }
        else if (this.get('paginated')) {
            // Backward compatibility
            this.updatePaginator({currentPage:1});
        }

        // Update the UI
        YAHOO.widget.DataTable.formatHeadCell(oColumn.getThEl().firstChild.firstChild, oColumn, this);
        this.render();

        this.fireEvent("columnSortEvent",{column:oColumn,dir:sortDir});
        YAHOO.log("Column \"" + oColumn.key + "\" sorted \"" + sortDir + "\"", "info", this.toString());
    }
    else {
        YAHOO.log("Could not sort Column \"" + oColumn.key + "\"", "warn", this.toString());
    }
};

/**
 * Sets given Column to given pixel width. No validations against minimum width
 * and no updating Column.width value.
 *
 * @method _setColumnWidth
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @param sWidth {String} New width value.
 * @private
 */
YAHOO.widget.DataTable.prototype._setColumnWidth = function(oColumn, sWidth) {
    oColumn = this.getColumn(oColumn);
    if(oColumn) {
        var nColKeyIndex = oColumn.getKeyIndex();
        var elTheadCell = oColumn.getThEl();

        elTheadCell.style.width = sWidth;
        elTheadCell.firstChild.style.width = sWidth;
        
        var allrows = this.getTbodyEl().rows;
        var nMaxIndex = allrows.length;
        for(var i=0;i<nMaxIndex;i++) {
            allrows[i].cells[nColKeyIndex].firstChild.style.width = sWidth;
            allrows[i].cells[nColKeyIndex].style.width = sWidth;
        }
        if(YAHOO.env.ua.opera && !this.get("scrollable")) {
            this.getTbodyEl().parentNode.style.width = this.getTheadEl().offsetWidth + "px";
            document.body.style += '';
        }
    }
    else {
        YAHOO.log("Could not set width of Column " + oColumn + " to " + sWidth, "warn", this.toString());
    }
};

/**
 * Sets given Column to given pixel width. If new width is less than minimum
 * width, sets to minimum width. Updates oColumn.width value.
 *
 * @method setColumnWidth
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @param nWidth {Number} New width in pixels.
 */
YAHOO.widget.DataTable.prototype.setColumnWidth = function(oColumn, nWidth) {
    oColumn = this.getColumn(oColumn);
    if(oColumn) {
        // Validate new width against minimum width
        var sWidth = "";
        if(YAHOO.lang.isNumber(nWidth)) {
            sWidth = (nWidth > oColumn.minWidth) ? nWidth + "px" : oColumn.minWidth + "px";
        }

        // Save state
        oColumn.width = parseInt(sWidth,10);
        
        // Resize the DOM elements
        this._setColumnWidth(oColumn, sWidth);
        
        YAHOO.log("Set width of Column " + oColumn + " to " + sWidth, "info", this.toString());
    }
    else {
        YAHOO.log("Could not set width of Column " + oColumn + " to " + nWidth + "px", "warn", this.toString());
    }
};


/**
 * Hides given Column. NOTE: You cannot hide/show nested Columns. You can only
 * hide/show non-nested Columns, and top-level parent Columns (which will
 * hide/show all children Columns).
 *
 * @method hideColumn
 * @param oColumn {YAHOO.widget.Column} Column instance.
 */
YAHOO.widget.DataTable.prototype.hideColumn = function(oColumn) {
    oColumn = this.getColumn(oColumn);
    if(oColumn && !oColumn.hidden) {
        // Only top-level Columns can get hidden
        if(oColumn.getTreeIndex() !== null) {
            var allrows = this.getTbodyEl().rows;
            var l = allrows.length;
            var allDescendants = this._oColumnSet.getDescendants(oColumn);
            for(var i=0; i<allDescendants.length; i++) {
                var thisColumn = allDescendants[i];

                // Adjust thead cell
                var elTheadCell = thisColumn.getThEl();
                var elLiner = elTheadCell.firstChild;
                var linerStyle = elLiner.style;
                linerStyle.margin = 0;
                linerStyle.padding = 0;
                linerStyle.overflow = "hidden";
                thisColumn._nLastWidth = elLiner.offsetWidth;// Store for later

                // Adjust body cells (if key Column)
                var thisKeyIndex = thisColumn.getKeyIndex();
                if(thisKeyIndex !== null) {
                    for(var j=0;j<l;j++) {
                        var cellStyle = allrows[j].cells[thisKeyIndex].firstChild.style;
                        cellStyle.margin = 0;
                        cellStyle.padding = 0;
                        cellStyle.overflow = "hidden";
                    }

                    this._setColumnWidth(thisColumn, "1px");
                    
                    // Disable interactive features
                    if(thisColumn.resizeable) {
                        YAHOO.util.Dom.removeClass(thisColumn.getResizerEl(),YAHOO.widget.DataTable.CLASS_RESIZER);
                    }
                    if(thisColumn.sortable) {
                        YAHOO.util.Dom.removeClass(thisColumn.getThEl(),YAHOO.widget.DataTable.CLASS_SORTABLE);
                        thisColumn.getThEl().firstChild.firstChild.firstChild.style.display = "none";
                    }
                }
                // Just set thead cell width directly for parent Column
                else {
                    elLiner.style.width = "1px";
                }
                
                thisColumn.hidden = true;
                this.fireEvent("columnHideEvent",{column:thisColumn});
            }
        }
        else {
            YAHOO.log("Could not hide Column \"" + oColumn.key + "\". Only non-nested Columns can be hidden", "warn", this.toString());
        }
    }
};

/**
 * Shows given Column. NOTE: You cannot hide/show nested Columns. You can only
 * hide/show non-nested Columns, and top-level parent Columns (which will
 * hide/show all children Columns).
 *
 * @method showColumn
 * @param oColumn {YAHOO.widget.Column} Column instance.
 */
YAHOO.widget.DataTable.prototype.showColumn = function(oColumn) {
    oColumn = this.getColumn(oColumn);
    if(oColumn && oColumn.hidden) {
        // Only top-level Columns can get hidden
        if(oColumn.getTreeIndex() !== null) {
            var allrows = this.getTbodyEl().rows;
            var l = allrows.length;
            var allDescendants = this._oColumnSet.getDescendants(oColumn);
            for(var i=0; i<allDescendants.length; i++) {
                var thisColumn = allDescendants[i];
                
                // Adjust thead cell
                var elTheadCell = thisColumn.getThEl();
                var elLiner = elTheadCell.firstChild;
                var linerStyle = elLiner.style;
                linerStyle.margin = "";
                linerStyle.padding = "";
                linerStyle.overflow = "";

                // Adjust body cells (if key Column)
                var thisKeyIndex = thisColumn.getKeyIndex();
                if(thisKeyIndex !== null) {
                    for(var j=0;j<l;j++) {
                        var cellStyle = allrows[j].cells[thisKeyIndex].firstChild.style;
                        cellStyle.margin = "";
                        cellStyle.padding = "";
                        cellStyle.overflow = "";
                    }
                    
                    this.setColumnWidth(thisColumn, (thisColumn._nLastWidth || thisColumn.minWidth), true);

                    // Enable interactive features
                    if(thisColumn.sortable) {
                        thisColumn.getThEl().firstChild.firstChild.firstChild.style.display = "";
                        YAHOO.util.Dom.removeClass(thisColumn.getThEl(),YAHOO.widget.DataTable.CLASS_SORTABLE);
                    }
                    if(thisColumn.resizeable) {
                        thisColumn.ddResizer.resetResizerEl();
                        YAHOO.util.Dom.addClass(thisColumn.getResizerEl(),YAHOO.widget.DataTable.CLASS_RESIZER);
                    }
                }
                else {
                    linerStyle.width = "";
                }


                thisColumn._nLastWidth = null;
                thisColumn.hidden = false;
                this.fireEvent("columnShowEvent",{column:thisColumn});
            }
        }
        else {
            YAHOO.log("Could not show Column \"" + oColumn.key + "\". Only non-nested Columns can be shown", "warn", this.toString());
        }
    }
};

/**
 * Removes given Column. NOTE: You cannot remove nested Columns. You can only remove
 * non-nested Columns, and top-level parent Columns (which will remove all
 * children Columns).
 *
 * @method removeColumn
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @return oColumn {YAHOO.widget.Column} Removed Column instance.
 */
YAHOO.widget.DataTable.prototype.removeColumn = function(oColumn) {
    var nColTreeIndex = oColumn.getTreeIndex();
    if(nColTreeIndex !== null) {
        var aOrigColumnDefs = this._oColumnSet.getDefinitions();

        oColumn = aOrigColumnDefs.splice(nColTreeIndex,1);
        this._initColumnSet(aOrigColumnDefs);

        this._initTableEl();
        this.render();
        YAHOO.log("Column \"" + oColumn.key + "\" removed", "info", this.toString());
        return oColumn;
    }
    YAHOO.log("Could not remove Column \"" + oColumn.key + "\". Only non-nested Columns can be removed", "warn", this.toString());
};

/**
 * Inserts given Column at the index if given, otherwise at the end. NOTE: You
 * can only add non-nested Columns and top-level parent Columns. You cannot add
 * a nested Column to an existing parent.
 *
 * @method insertColumn
 * @param oColumn {Object | YAHOO.widget.Column} Object literal Column
 * definition or a Column instance.
 * @param index {Number} (optional) Column key index.
 */
YAHOO.widget.DataTable.prototype.insertColumn = function(oColumn, index) {
    // Validate Column
    if(oColumn instanceof YAHOO.widget.Column) {
        oColumn = oColumn.getDefinition();
    }
    else if(oColumn.constructor !== Object) {
        YAHOO.log("Could not insert Column \"" + oColumn + "\" due to invalid argument", "warn", this.toString());
        return;
    }
    
    var oColumnSet = this._oColumnSet;

    // Validate index
    if(!YAHOO.lang.isValue(index) || !YAHOO.lang.isNumber(index)) {
        index = oColumnSet.keys.length;
    }
    
    var aNewColumnDefs = this._oColumnSet.getDefinitions();
    aNewColumnDefs.splice(index, 0, oColumn);
    this._initColumnSet(aNewColumnDefs);

    this._initTableEl();
    this.render();
    YAHOO.log("Column \"" + oColumn.key + "\" inserted", "info", this.toString());
};











































// ROW FUNCTIONS


/**
 * Adds one new Record of data into the RecordSet at the index if given,
 * otherwise at the end. If the new Record is in page view, the
 * corresponding DOM elements are also updated.
 *
 * @method addRow
 * @param oData {Object} Object literal of data for the row.
 * @param index {Number} (optional) RecordSet position index at which to add data.
 */
YAHOO.widget.DataTable.prototype.addRow = function(oData, index) {
    if(oData && (oData.constructor == Object)) {
        var oRecord = this._oRecordSet.addRecord(oData, index);
        if(oRecord) {
            var recIndex;
            var oPaginator = this.get('paginator');

            if (oPaginator instanceof YAHOO.widget.Paginator ||
                this.get('paginated')) {
                recIndex = this.getRecordIndex(oRecord);
                var endRecIndex;
                if (oPaginator instanceof YAHOO.widget.Paginator) {
                    // Update the paginator's totalRecords
                    var totalRecords = oPaginator.get('totalRecords');
                    if (totalRecords !== YAHOO.widget.Paginator.VALUE_UNLIMITED) {
                        oPaginator.set('totalRecords',totalRecords + 1);
                    }

                    endRecIndex = (oPaginator.getCurrentRecords())[1];
                } else {
                // Paginated so just refresh the view to keep pagination state
                    endRecIndex = oPaginator.startRecordIndex +
                                  oPaginator.rowsPerPage - 1;

                    // Backward compatibility
                    this.updatePaginator();
                }

                if (recIndex <= endRecIndex) {
                    this.render();
                }
            } else {
                recIndex = this.getTrIndex(oRecord);

                // Row is on current page
                if(YAHOO.lang.isNumber(recIndex)) {
                    // Add the TR element
                    var elNewTr = this._addTrEl(oRecord, recIndex);
                    if(elNewTr) {
                        // Is this an insert or an append?
                        var append = (YAHOO.lang.isNumber(recIndex) &&
                                (recIndex == this._elTbody.rows.length-1)) ? true : false;

                        // Stripe the one new row
                        if(append) {
                            if(elNewTr.sectionRowIndex%2) {
                                YAHOO.util.Dom.addClass(elNewTr, YAHOO.widget.DataTable.CLASS_ODD);
                            }
                            else {
                                YAHOO.util.Dom.addClass(elNewTr, YAHOO.widget.DataTable.CLASS_EVEN);
                            }
                        }
                        // Restripe all the rows after the new one
                        else {
                            this._setRowStripes(recIndex);
                        }

                        // If new row is at the bottom
                        if(append) {
                            this._setLastRow();
                        }
                        // If new row is at the top
                        else if(YAHOO.lang.isNumber(index) && (recIndex === 0)) {
                            this._setFirstRow();
                        }
                        
                        this._syncColWidths();
                    }
                    this.hideTableMessage();
                }
            }

            // TODO: what args to pass?
            this.fireEvent("rowAddEvent", {record:oRecord});

            // For log message
            recIndex = (YAHOO.lang.isValue(recIndex))? recIndex : "n/a";

            YAHOO.log("Added row: Record ID = " + oRecord.getId() +
                    ", Record index = " + this.getRecordIndex(oRecord) +
                    ", page row index = " + recIndex, "info", this.toString());
            return;
        }
    }
    YAHOO.log("Could not add row with " + YAHOO.lang.dump(oData), "error", this.toString());
};

/**
 * Convenience method to add multiple rows.
 *
 * @method addRows
 * @param aData {Object[]} Array of object literal data for the rows.
 * @param index {Number} (optional) RecordSet position index at which to add data.
 */
YAHOO.widget.DataTable.prototype.addRows = function(aData, index) {
    if(YAHOO.lang.isArray(aData)) {
        var i;
        if(YAHOO.lang.isNumber(index)) {
            for(i=aData.length-1; i>-1; i--) {
                this.addRow(aData[i], index);
            }
        }
        else {
            for(i=0; i<aData.length; i++) {
                this.addRow(aData[i]);
            }
        }
    }
    else {
        YAHOO.log("Could not add rows " + YAHOO.lang.dump(aData));
    }
};

/**
 * For the given row, updates the associated Record with the given data. If the
 * row is on current page, the corresponding DOM elements are also updated.
 *
 * @method updateRow
 * @param row {YAHOO.widget.Record | Number | HTMLElement | String}
 * Which row to update: By Record instance, by Record's RecordSet
 * position index, by HTMLElement reference to the TR element, or by ID string
 * of the TR element.
 * @param oData {Object} Object literal of data for the row.
 */
YAHOO.widget.DataTable.prototype.updateRow = function(row, oData) {
    var oldRecord, oldData, updatedRecord, elRow;

    // Get the Record directly
    if((row instanceof YAHOO.widget.Record) || (YAHOO.lang.isNumber(row))) {
            // Get the Record directly
            oldRecord = this._oRecordSet.getRecord(row);

            // Is this row on current page?
            elRow = this.getTrEl(oldRecord);
    }
    // Get the Record by TR element
    else {
        elRow = this.getTrEl(row);
        if(elRow) {
            oldRecord = this.getRecord(elRow);
        }
    }

    // Update the Record
    if(oldRecord) {
        // Copy data from the Record for the event that gets fired later
        var oRecordData = oldRecord.getData();
        oldData = {};
        for(var param in oRecordData) {
            oldData[param] = oRecordData[param];
        }

        updatedRecord = this._oRecordSet.updateRecord(oldRecord, oData);
    }
    else {
        YAHOO.log("Could not update row " + row + " with the data : " +
                YAHOO.lang.dump(oData), "error", this.toString());
        return;

    }

    // Update the TR only if row is on current page
    if(elRow) {
        this._updateTrEl(elRow, updatedRecord);
        this._syncColWidths();
    }

    this.fireEvent("rowUpdateEvent", {record:updatedRecord, oldData:oldData});
    YAHOO.log("DataTable row updated: Record ID = " + updatedRecord.getId() +
            ", Record index = " + this.getRecordIndex(updatedRecord) +
            ", page row index = " + this.getTrIndex(updatedRecord), "info", this.toString());
};

/**
 * Deletes the given row's Record from the RecordSet. If the row is on current page,
 * the corresponding DOM elements are also deleted.
 *
 * @method deleteRow
 * @param row {HTMLElement | String | Number} DOM element reference or ID string
 * to DataTable page element or RecordSet index.
 */
YAHOO.widget.DataTable.prototype.deleteRow = function(row) {
    // Get the Record index...
    var oRecord = null;
    // ...by Record index
    if(YAHOO.lang.isNumber(row)) {
        oRecord = this._oRecordSet.getRecord(row);
    }
    // ...by element reference
    else {
        var elRow = YAHOO.util.Dom.get(row);
        elRow = this.getTrEl(elRow);
        if(elRow) {
            oRecord = this.getRecord(elRow);
        }
    }
    if(oRecord) {
        var oPaginator = this.get('paginator');
        var sRecordId = oRecord.getId();

        // Remove from selection tracker if there
        var tracker = this._aSelections || [];
        for(var j=tracker.length-1; j>-1; j--) {
            if((YAHOO.lang.isNumber(tracker[j]) && (tracker[j] === sRecordId)) ||
                    ((tracker[j].constructor == Object) && (tracker[j].recordId === sRecordId))) {
                tracker.splice(j,1);
            }
        }

        // Copy data from the Record for the event that gets fired later
        var nTrIndex = this.getTrIndex(oRecord);
        var nRecordIndex = this.getRecordIndex(oRecord);
        var oRecordData = oRecord.getData();
        var oData = {};
        for(var param in oRecordData) {
            oData[param] = oRecordData[param];
        }

        // Delete Record from RecordSet
        this._oRecordSet.deleteRecord(nRecordIndex);

        // If paginated and the deleted row was on this or a prior page, just
        // re-render
        if (oPaginator instanceof YAHOO.widget.Paginator ||
            this.get('paginated')) {

            var endRecIndex;
            if (oPaginator instanceof YAHOO.widget.Paginator) {
                // Update the paginator's totalRecords
                var totalRecords = oPaginator.get('totalRecords');
                if (totalRecords !== YAHOO.widget.Paginator.VALUE_UNLIMITED) {
                    oPaginator.set('totalRecords',totalRecords - 1);
                }

                endRecIndex = (oPaginator.getCurrentRecords())[1];
            } else {
                // Backward compatibility
                endRecIndex = oPaginator.startRecordIndex +
                              oPaginator.rowsPerPage - 1;

                this.updatePaginator();
            }

            // If the deleted record was on this or a prior page, re-render
            if (nRecordIndex <= endRecIndex) {
                this.render();
            }
        } else {
            if(YAHOO.lang.isNumber(nTrIndex)) {
                var isLast = (nTrIndex == this.getLastTrEl().sectionRowIndex);
                this._deleteTrEl(nTrIndex);

                // Empty body
                if(this._elTbody.rows.length === 0) {
                    this.showTableMessage(YAHOO.widget.DataTable.MSG_EMPTY, YAHOO.widget.DataTable.CLASS_EMPTY);
                }
                // Update UI
                else {
                    // Set FIRST/LAST
                    if(nTrIndex === 0) {
                        this._setFirstRow();
                    }
                    if(isLast) {
                        this._setLastRow();
                    }
                    // Set EVEN/ODD
                    if(nTrIndex != this._elTbody.rows.length) {
                        this._setRowStripes(nTrIndex);
                    }
                    
                    this._syncColWidths();
                }
            }
        }

        this.fireEvent("rowDeleteEvent", {recordIndex:nRecordIndex,
                oldData:oData, trElIndex:nTrIndex});
        YAHOO.log("DataTable row deleted: Record ID = " + sRecordId +
                ", Record index = " + nRecordIndex +
                ", page row index = " + nTrIndex, "info", this.toString());
    }
    else {
        YAHOO.log("Could not delete row: " + row, "warn", this.toString());
    }
};

/**
 * Convenience method to delete multiple rows.
 *
 * @method deleteRows
 * @param row {HTMLElement | String | Number} DOM element reference or ID string
 * to DataTable page element or RecordSet index.
 * @param count {Number} (optional) How many rows to delete. A negative value
 * will delete towards the beginning.
 */
YAHOO.widget.DataTable.prototype.deleteRows = function(row, count) {
    // Get the Record index...
    var nRecordIndex = null;
    // ...by Record index
    if(YAHOO.lang.isNumber(row)) {
        nRecordIndex = row;
    }
    // ...by element reference
    else {
        var elRow = YAHOO.util.Dom.get(row);
        elRow = this.getTrEl(elRow);
        if(elRow) {
            nRecordIndex = this.getRecordIndex(elRow);
        }
    }
    if(nRecordIndex !== null) {
        if(count && YAHOO.lang.isNumber(count)) {
            // Start with highest index and work down
            var startIndex = (count > 0) ? nRecordIndex + count -1 : nRecordIndex;
            var endIndex = (count > 0) ? nRecordIndex : nRecordIndex + count + 1;
            for(var i=startIndex; i>endIndex-1; i--) {
                this.deleteRow(i);
            }
        }
        else {
            this.deleteRow(nRecordIndex);
        }
    }
    else {
        YAHOO.log("Could not delete row " + row, "info", this.toString());
    }
};














































// CELL FUNCTIONS

/**
 * Outputs markup into the given TH based on given Column.
 *
 * @method formatHeadCell
 * @param elCellLabel {HTMLElement} The label DIV element within the TH liner.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @static
 */
YAHOO.widget.DataTable.formatHeadCell = function(elCellLabel, oColumn, oSelf) {
    var sKey = oColumn.getKey();
    var sLabel = YAHOO.lang.isValue(oColumn.label) ? oColumn.label : sKey;

    // Add accessibility link for sortable Columns
    if(oColumn.sortable) {
        // Calculate the direction
        var sSortClass = oSelf.getColumnSortDir(oColumn);
        var sSortDir = (sSortClass === YAHOO.widget.DataTable.CLASS_DESC) ? "descending" : "ascending";

        // Generate a unique HREF for visited status
        var sHref = oSelf.getId() + "-sort" + oColumn.getId() + "-" + sSortDir;
        
        // Generate a dynamic TITLE for sort status
        var sTitle = "Click to sort " + sSortDir;
        
        // Format the element
        elCellLabel.innerHTML = "<a href=\"" + sHref + "\" title=\"" + sTitle + "\" class=\"" + YAHOO.widget.DataTable.CLASS_SORTABLE + "\">" + sLabel + "</a>";
    }
    // Just display the label for non-sortable Columns
    else {
        elCellLabel.innerHTML = sLabel;
    }
};

/**
 * Outputs markup into the given TD based on given Record.
 *
 * @method formatCell
 * @param elCell {HTMLElement} The liner DIV element within the TD.
 * @param oRecord {YAHOO.widget.Record} (Optional) Record instance.
 * @param oColumn {YAHOO.widget.Column} (Optional) Column instance.
 */
YAHOO.widget.DataTable.prototype.formatCell = function(elCell, oRecord, oColumn) {
    if(!(oRecord instanceof YAHOO.widget.Record)) {
        oRecord = this.getRecord(elCell);
    }
    if(!(oColumn instanceof YAHOO.widget.Column)) {
        oColumn = this._oColumnSet.getColumn(elCell.parentNode.yuiColumnKey);
    }

    if(oRecord && oColumn) {
        var sKey = oColumn.key;
        var oData = oRecord.getData(sKey);

        // Add custom classNames
        var aCustomClasses = null;
        if(YAHOO.lang.isString(oColumn.className)) {
            aCustomClasses = [oColumn.className];
        }
        else if(YAHOO.lang.isArray(oColumn.className)) {
            aCustomClasses = oColumn.className;
        }

        if(aCustomClasses) {
            for(var i=0; i<aCustomClasses.length; i++) {
                YAHOO.util.Dom.addClass(elCell, aCustomClasses[i]);
            }
        }

        YAHOO.util.Dom.addClass(elCell, "yui-dt-col-"+sKey);

        if(oColumn.sortable) {
            YAHOO.util.Dom.addClass(elCell.parentNode,YAHOO.widget.DataTable.CLASS_SORTABLE);
        }
        if(oColumn.resizeable) {
            YAHOO.util.Dom.addClass(elCell.parentNode,YAHOO.widget.DataTable.CLASS_RESIZEABLE);
        }
        if(oColumn.editor) {
            YAHOO.util.Dom.addClass(elCell.parentNode,YAHOO.widget.DataTable.CLASS_EDITABLE);
        }

        var fnFormatter;
        if(YAHOO.lang.isString(oColumn.formatter)) {
            switch(oColumn.formatter) {
                case "button":
                    fnFormatter = YAHOO.widget.DataTable.formatButton;
                    break;
                case "checkbox":
                    fnFormatter = YAHOO.widget.DataTable.formatCheckbox;
                    break;
                case "currency":
                    fnFormatter = YAHOO.widget.DataTable.formatCurrency;
                    break;
                case "date":
                    fnFormatter = YAHOO.widget.DataTable.formatDate;
                    break;
                case "dropdown":
                    fnFormatter = YAHOO.widget.DataTable.formatDropdown;
                    break;
                case "email":
                    fnFormatter = YAHOO.widget.DataTable.formatEmail;
                    break;
                case "link":
                    fnFormatter = YAHOO.widget.DataTable.formatLink;
                    break;
                case "number":
                    fnFormatter = YAHOO.widget.DataTable.formatNumber;
                    break;
                case "radio":
                    fnFormatter = YAHOO.widget.DataTable.formatRadio;
                    break;
                case "text":
                    fnFormatter = YAHOO.widget.DataTable.formatText;
                    break;
                case "textarea":
                    fnFormatter = YAHOO.widget.DataTable.formatTextarea;
                    break;
                case "textbox":
                    fnFormatter = YAHOO.widget.DataTable.formatTextbox;
                    break;
                case "html":
                    // This is the default
                    break;
                default:
                    YAHOO.log("Could not find formatter function \"" +
                            oColumn.formatter + "\"", "warn", this.toString());
                    fnFormatter = null;
            }
        }
        else if(YAHOO.lang.isFunction(oColumn.formatter)) {
            fnFormatter = oColumn.formatter;
        }

        // Apply special formatter
        if(fnFormatter) {
            fnFormatter.call(this, elCell, oRecord, oColumn, oData);
        }
        else {
            elCell.innerHTML = (YAHOO.lang.isValue(oData)) ? oData.toString() : "";
        }

        this.fireEvent("cellFormatEvent", {record:oRecord, column:oColumn, key:sKey, el:elCell});
    }
    else {
        YAHOO.log("Could not format cell " + elCell, "error", this.toString());
    }
};


/**
 * Formats a BUTTON element.
 *
 * @method DataTable.formatButton
 * @param el {HTMLElement} The element to format with markup.
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @param oData {Object | Boolean} Data value for the cell. By default, the value
 * is what gets written to the BUTTON.
 * @static
 */
YAHOO.widget.DataTable.formatButton= function(el, oRecord, oColumn, oData) {
    var sValue = YAHOO.lang.isValue(oData) ? oData : "Click";
    //TODO: support YAHOO.widget.Button
    //if(YAHOO.widget.Button) {

    //}
    //else {
        el.innerHTML = "<button type=\"button\" class=\""+
                YAHOO.widget.DataTable.CLASS_BUTTON + "\">" + sValue + "</button>";
    //}
};

/**
 * Formats a CHECKBOX element.
 *
 * @method DataTable.formatCheckbox
 * @param el {HTMLElement} The element to format with markup.
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @param oData {Object | Boolean} Data value for the cell. Can be a simple
 * Boolean to indicate whether checkbox is checked or not. Can be object literal
 * {checked:bBoolean, label:sLabel}. Other forms of oData require a custom
 * formatter.
 * @static
 */
YAHOO.widget.DataTable.formatCheckbox = function(el, oRecord, oColumn, oData) {
    var bChecked = oData;
    bChecked = (bChecked) ? " checked" : "";
    el.innerHTML = "<input type=\"checkbox\"" + bChecked +
            " class=\"" + YAHOO.widget.DataTable.CLASS_CHECKBOX + "\">";
};

/**
 * Formats currency. Default unit is USD.
 *
 * @method DataTable.formatCurrency
 * @param el {HTMLElement} The element to format with markup.
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @param oData {Number} Data value for the cell.
 * @static
 */
YAHOO.widget.DataTable.formatCurrency = function(el, oRecord, oColumn, oData) {
    el.innerHTML = YAHOO.util.Number.format(oData, {
            prefix:"$",
            decimalPlaces:2,
            decimalSeparator:".",
            thousandsSeparator:","
        });
};

/**
 * Formats JavaScript Dates.
 *
 * @method DataTable.formatDate
 * @param el {HTMLElement} The element to format with markup.
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @param oData {Object} Data value for the cell, or null.
 * @static
 */
YAHOO.widget.DataTable.formatDate = function(el, oRecord, oColumn, oData) {
    el.innerHTML = YAHOO.util.Date.format(oData, {format:"MM/DD/YYYY"});
};

/**
 * Formats SELECT elements.
 *
 * @method DataTable.formatDropdown
 * @param el {HTMLElement} The element to format with markup.
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @param oData {Object} Data value for the cell, or null.
 * @static
 */
YAHOO.widget.DataTable.formatDropdown = function(el, oRecord, oColumn, oData) {
    var selectedValue = (YAHOO.lang.isValue(oData)) ? oData : oRecord.getData(oColumn.key);
    var options = (YAHOO.lang.isArray(oColumn.dropdownOptions)) ?
            oColumn.dropdownOptions : null;

    var selectEl;
    var collection = el.getElementsByTagName("select");

    // Create the form element only once, so we can attach the onChange listener
    if(collection.length === 0) {
        // Create SELECT element
        selectEl = document.createElement("select");
        YAHOO.util.Dom.addClass(selectEl, YAHOO.widget.DataTable.CLASS_DROPDOWN);
        selectEl = el.appendChild(selectEl);

        // Add event listener
        YAHOO.util.Event.addListener(selectEl,"change",this._onDropdownChange,this);
    }

    selectEl = collection[0];

    // Update the form element
    if(selectEl) {
        // Clear out previous options
        selectEl.innerHTML = "";

        // We have options to populate
        if(options) {
            // Create OPTION elements
            for(var i=0; i<options.length; i++) {
                var option = options[i];
                var optionEl = document.createElement("option");
                optionEl.value = (YAHOO.lang.isValue(option.value)) ?
                        option.value : option;
                optionEl.innerHTML = (YAHOO.lang.isValue(option.text)) ?
                        option.text : option;
                optionEl = selectEl.appendChild(optionEl);
            }
        }
        // Selected value is our only option
        else {
            selectEl.innerHTML = "<option value=\"" + selectedValue + "\">" + selectedValue + "</option>";
        }
    }
    else {
        el.innerHTML = YAHOO.lang.isValue(oData) ? oData : "";
    }
};

/**
 * Formats emails.
 *
 * @method DataTable.formatEmail
 * @param el {HTMLElement} The element to format with markup.
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @param oData {Object} Data value for the cell, or null.
 * @static
 */
YAHOO.widget.DataTable.formatEmail = function(el, oRecord, oColumn, oData) {
    if(YAHOO.lang.isString(oData)) {
        el.innerHTML = "<a href=\"mailto:" + oData + "\">" + oData + "</a>";
    }
    else {
        el.innerHTML = YAHOO.lang.isValue(oData) ? oData : "";
    }
};

/**
 * Formats links.
 *
 * @method DataTable.formatLink
 * @param el {HTMLElement} The element to format with markup.
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @param oData {Object} Data value for the cell, or null.
 * @static
 */
YAHOO.widget.DataTable.formatLink = function(el, oRecord, oColumn, oData) {
    if(YAHOO.lang.isString(oData)) {
        el.innerHTML = "<a href=\"" + oData + "\">" + oData + "</a>";
    }
    else {
        el.innerHTML = YAHOO.lang.isValue(oData) ? oData : "";
    }
};

/**
 * Formats numbers.
 *
 * @method DataTable.formatNumber
 * @param el {HTMLElement} The element to format with markup.
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @param oData {Object} Data value for the cell, or null.
 * @static
 */
YAHOO.widget.DataTable.formatNumber = function(el, oRecord, oColumn, oData) {
    if(YAHOO.lang.isNumber(oData)) {
        el.innerHTML = oData;
    }
    else {
        el.innerHTML = YAHOO.lang.isValue(oData) ? oData : "";
    }
};

/**
 * Formats INPUT TYPE=RADIO elements.
 *
 * @method DataTable.formatRadio
 * @param el {HTMLElement} The element to format with markup.
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @param oData {Object} (Optional) Data value for the cell.
 * @static
 */
YAHOO.widget.DataTable.formatRadio = function(el, oRecord, oColumn, oData) {
    var bChecked = oData;
    bChecked = (bChecked) ? " checked" : "";
    el.innerHTML = "<input type=\"radio\"" + bChecked +
            " name=\"" + oColumn.getKey() + "-radio\"" +
            " class=\"" + YAHOO.widget.DataTable.CLASS_RADIO+ "\">";
};

/**
 * Formats text strings.
 *
 * @method DataTable.formatText
 * @param el {HTMLElement} The element to format with markup.
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @param oData {Object} (Optional) Data value for the cell.
 * @static
 */
YAHOO.widget.DataTable.formatText = function(el, oRecord, oColumn, oData) {
    var value = (YAHOO.lang.isValue(oRecord.getData(oColumn.key))) ?
            oRecord.getData(oColumn.key) : "";
    //TODO: move to util function
    el.innerHTML = value.toString().replace(/&/g, "&#38;").replace(/</g, "&#60;").replace(/>/g, "&#62;");
};

/**
 * Formats TEXTAREA elements.
 *
 * @method DataTable.formatTextarea
 * @param el {HTMLElement} The element to format with markup.
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @param oData {Object} (Optional) Data value for the cell.
 * @static
 */
YAHOO.widget.DataTable.formatTextarea = function(el, oRecord, oColumn, oData) {
    var value = (YAHOO.lang.isValue(oRecord.getData(oColumn.key))) ?
            oRecord.getData(oColumn.key) : "";
    var markup = "<textarea>" + value + "</textarea>";
    el.innerHTML = markup;
};

/**
 * Formats INPUT TYPE=TEXT elements.
 *
 * @method DataTable.formatTextbox
 * @param el {HTMLElement} The element to format with markup.
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @param oData {Object} (Optional) Data value for the cell.
 * @static
 */
YAHOO.widget.DataTable.formatTextbox = function(el, oRecord, oColumn, oData) {
    var value = (YAHOO.lang.isValue(oRecord.getData(oColumn.key))) ?
            oRecord.getData(oColumn.key) : "";
    var markup = "<input type=\"text\" value=\"" + value + "\">";
    el.innerHTML = markup;
};
















































// PAGINATION

/**
 * Delegates the YAHOO.widget.Paginator changeRequest events to the configured
 * handler.
 * @method onPaginatorChange
 * @param {Object} an object literal describing the proposed pagination state
 */
YAHOO.widget.DataTable.prototype.onPaginatorChange = function (oState) {
    var handler = this.get('paginationEventHandler');

    handler(oState,this);
};

/**
 * Handles YAHOO.widget.Paginator changeRequest events for static DataSources
 * (i.e. DataSources that return all data immediately)
 * @method handleSimplePagination
 * @param {object} the requested state of the pagination
 * @param {DataTable} the DataTable instance
 * @private
 */
YAHOO.widget.DataTable.handleSimplePagination = function (oState,self) {
    oState.paginator.set('recordOffset',oState.recordOffset);
    oState.paginator.set('rowsPerPage',oState.rowsPerPage);

    self.render();
};

/**
 * Handles YAHOO.widget.Paginator changeRequest events for dynamic DataSources
 * such as DataSource.TYPE_XHR or DataSource.TYPE_JSFUNCTION.
 * @method handleDataSourcePagination
 * @param {object} the requested state of the pagination
 * @param {DataTable} the DataTable instance
 */
YAHOO.widget.DataTable.handleDataSourcePagination = function (oState,self) {
    var requestedRecords = oState.records[1] - oState.recordOffset;

    if (self._oRecordSet.hasRecords(oState.recordOffset, requestedRecords)) {
        oState.paginator.set('recordOffset',oState.recordOffset);
        oState.paginator.set('rowsPerPage',oState.rowsPerPage);

        self.render();
    } else {
        // Translate the proposed page state into a DataSource request param
        var generateRequest = self.get('generateRequest');
        var request = generateRequest({ pagination : oState }, self);

        var callback = {
            success : self.onDataReturnSetPageData,
            failure : self.onDataReturnSetPageData,
            argument : {
                datatable : self,
                pagination : oState
            },
            scope : self
        };

        self._oDataSource.sendRequest(request, callback);
    }
};

















































// SELECTION/HIGHLIGHTING

/**
 * ID string of last highlighted cell element
 *
 * @property _sLastHighlightedTdElId
 * @type String
 * @private
 */
YAHOO.widget.DataTable.prototype._sLastHighlightedTdElId = null;

/**
 * ID string of last highlighted row element
 *
 * @property _sLastHighlightedTrElId
 * @type String
 * @private
 */
YAHOO.widget.DataTable.prototype._sLastHighlightedTrElId = null;

/**
 * Array to track row selections (by sRecordId) and/or cell selections
 * (by {recordId:sRecordId, columnId:sColumnId})
 *
 * @property _aSelections
 * @type Object[]
 * @private
 */
YAHOO.widget.DataTable.prototype._aSelections = null;

/**
 * Record instance of the row selection anchor.
 *
 * @property _oAnchorRecord
 * @type YAHOO.widget.Record
 * @private
 */
YAHOO.widget.DataTable.prototype._oAnchorRecord = null;

/**
 * Object literal representing cell selection anchor:
 * {recordId:sRecordId, columnId:sColumnId}.
 *
 * @property _oAnchorCell
 * @type Object
 * @private
 */
YAHOO.widget.DataTable.prototype._oAnchorCell = null;

/**
 * Convenience method to remove the class YAHOO.widget.DataTable.CLASS_SELECTED
 * from all TR elements on the page.
 *
 * @method _unselectAllTrEls
 * @private
 */
YAHOO.widget.DataTable.prototype._unselectAllTrEls = function() {
    var selectedRows = YAHOO.util.Dom.getElementsByClassName(YAHOO.widget.DataTable.CLASS_SELECTED,"tr",this._elTbody);
    YAHOO.util.Dom.removeClass(selectedRows, YAHOO.widget.DataTable.CLASS_SELECTED);
};

/**
 * Returns object literal of values that represent the selection trigger. Used
 * to determine selection behavior resulting from a key event.
 *
 * @method _getSelectionTrigger
 * @private
 */
YAHOO.widget.DataTable.prototype._getSelectionTrigger = function() {
    var sMode = this.get("selectionMode");
    var oTrigger = {};
    var oTriggerCell, oTriggerRecord, nTriggerRecordIndex, elTriggerRow, nTriggerTrIndex;

    // Cell mode
    if((sMode == "cellblock") || (sMode == "cellrange") || (sMode == "singlecell")) {
        oTriggerCell = this.getLastSelectedCell();
        // No selected cells found
        if(!oTriggerCell) {
            return null;
        }
        else {
            oTriggerRecord = this.getRecord(oTriggerCell.recordId);
            nTriggerRecordIndex = this.getRecordIndex(oTriggerRecord);
            elTriggerRow = this.getTrEl(oTriggerRecord);
            nTriggerTrIndex = this.getTrIndex(elTriggerRow);

            // Selected cell not found on this page
            if(nTriggerTrIndex === null) {
                return null;
            }
            else {
                oTrigger.record = oTriggerRecord;
                oTrigger.recordIndex = nTriggerRecordIndex;
                oTrigger.el = this.getTdEl(oTriggerCell);
                oTrigger.trIndex = nTriggerTrIndex;
                oTrigger.column = this.getColumnById(oTriggerCell.columnId);
                oTrigger.colKeyIndex = oTrigger.column.getKeyIndex();
                oTrigger.cell = oTriggerCell;
                return oTrigger;
            }
        }
    }
    // Row mode
    else {
        oTriggerRecord = this.getLastSelectedRecord();
        // No selected rows found
        if(!oTriggerRecord) {
                return null;
        }
        else {
            // Selected row found, but is it on current page?
            oTriggerRecord = this.getRecord(oTriggerRecord);
            nTriggerRecordIndex = this.getRecordIndex(oTriggerRecord);
            elTriggerRow = this.getTrEl(oTriggerRecord);
            nTriggerTrIndex = this.getTrIndex(elTriggerRow);

            // Selected row not found on this page
            if(nTriggerTrIndex === null) {
                return null;
            }
            else {
                oTrigger.record = oTriggerRecord;
                oTrigger.recordIndex = nTriggerRecordIndex;
                oTrigger.el = elTriggerRow;
                oTrigger.trIndex = nTriggerTrIndex;
                return oTrigger;
            }
        }
    }
};

/**
 * Returns object literal of values that represent the selection anchor. Used
 * to determine selection behavior resulting from a user event.
 *
 * @method _getSelectionAnchor
 * @param oTrigger {Object} (Optional) Object literal of selection trigger values
 * (for key events).
 * @private
 */
YAHOO.widget.DataTable.prototype._getSelectionAnchor = function(oTrigger) {
    var sMode = this.get("selectionMode");
    var oAnchor = {};
    var oAnchorRecord, nAnchorRecordIndex, nAnchorTrIndex;

    // Cell mode
    if((sMode == "cellblock") || (sMode == "cellrange") || (sMode == "singlecell")) {
        // Validate anchor cell
        var oAnchorCell = this._oAnchorCell;
        if(!oAnchorCell) {
            if(oTrigger) {
                oAnchorCell = this._oAnchorCell = oTrigger.cell;
            }
            else {
                return null;
            }
        }
        oAnchorRecord = this._oAnchorCell.record;
        nAnchorRecordIndex = this._oRecordSet.getRecordIndex(oAnchorRecord);
        nAnchorTrIndex = this.getTrIndex(oAnchorRecord);
        // If anchor cell is not on this page...
        if(nAnchorTrIndex === null) {
            // ...set TR index equal to top TR
            if(nAnchorRecordIndex < this.getRecordIndex(this.getFirstTrEl())) {
                nAnchorTrIndex = 0;
            }
            // ...set TR index equal to bottom TR
            else {
                nAnchorTrIndex = this.getRecordIndex(this.getLastTrEl());
            }
        }

        oAnchor.record = oAnchorRecord;
        oAnchor.recordIndex = nAnchorRecordIndex;
        oAnchor.trIndex = nAnchorTrIndex;
        oAnchor.column = this._oAnchorCell.column;
        oAnchor.colKeyIndex = oAnchor.column.getKeyIndex();
        oAnchor.cell = oAnchorCell;
        return oAnchor;
    }
    // Row mode
    else {
        oAnchorRecord = this._oAnchorRecord;
        if(!oAnchorRecord) {
            if(oTrigger) {
                oAnchorRecord = this._oAnchorRecord = oTrigger.record;
            }
            else {
                return null;
            }
        }

        nAnchorRecordIndex = this.getRecordIndex(oAnchorRecord);
        nAnchorTrIndex = this.getTrIndex(oAnchorRecord);
        // If anchor row is not on this page...
        if(nAnchorTrIndex === null) {
            // ...set TR index equal to top TR
            if(nAnchorRecordIndex < this.getRecordIndex(this.getFirstTrEl())) {
                nAnchorTrIndex = 0;
            }
            // ...set TR index equal to bottom TR
            else {
                nAnchorTrIndex = this.getRecordIndex(this.getLastTrEl());
            }
        }

        oAnchor.record = oAnchorRecord;
        oAnchor.recordIndex = nAnchorRecordIndex;
        oAnchor.trIndex = nAnchorTrIndex;
        return oAnchor;
    }
};

/**
 * Determines selection behavior resulting from a mouse event when selection mode
 * is set to "standard".
 *
 * @method _handleStandardSelectionByMouse
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 * @private
 */
YAHOO.widget.DataTable.prototype._handleStandardSelectionByMouse = function(oArgs) {
    var elTarget = oArgs.target;

    // Validate target row
    var elTargetRow = this.getTrEl(elTarget);
    if(elTargetRow) {
        var e = oArgs.event;
        var bSHIFT = e.shiftKey;
        var bCTRL = e.ctrlKey || ((navigator.userAgent.toLowerCase().indexOf("mac") != -1) && e.metaKey);

        var oTargetRecord = this.getRecord(elTargetRow);
        var nTargetRecordIndex = this._oRecordSet.getRecordIndex(oTargetRecord);

        var oAnchor = this._getSelectionAnchor();

        var i;

        // Both SHIFT and CTRL
        if(bSHIFT && bCTRL) {
            // Validate anchor
            if(oAnchor) {
                if(this.isSelected(oAnchor.record)) {
                    // Select all rows between anchor row and target row, including target row
                    if(oAnchor.recordIndex < nTargetRecordIndex) {
                        for(i=oAnchor.recordIndex+1; i<=nTargetRecordIndex; i++) {
                            if(!this.isSelected(i)) {
                                this.selectRow(i);
                            }
                        }
                    }
                    // Select all rows between target row and anchor row, including target row
                    else {
                        for(i=oAnchor.recordIndex-1; i>=nTargetRecordIndex; i--) {
                            if(!this.isSelected(i)) {
                                this.selectRow(i);
                            }
                        }
                    }
                }
                else {
                    // Unselect all rows between anchor row and target row
                    if(oAnchor.recordIndex < nTargetRecordIndex) {
                        for(i=oAnchor.recordIndex+1; i<=nTargetRecordIndex-1; i++) {
                            if(this.isSelected(i)) {
                                this.unselectRow(i);
                            }
                        }
                    }
                    // Unselect all rows between target row and anchor row
                    else {
                        for(i=nTargetRecordIndex+1; i<=oAnchor.recordIndex-1; i++) {
                            if(this.isSelected(i)) {
                                this.unselectRow(i);
                            }
                        }
                    }
                    // Select the target row
                    this.selectRow(oTargetRecord);
                }
            }
            // Invalid anchor
            else {
                // Set anchor
                this._oAnchorRecord = oTargetRecord;

                // Toggle selection of target
                if(this.isSelected(oTargetRecord)) {
                    this.unselectRow(oTargetRecord);
                }
                else {
                    this.selectRow(oTargetRecord);
                }
            }
        }
         // Only SHIFT
        else if(bSHIFT) {
            this.unselectAllRows();

            // Validate anchor
            if(oAnchor) {
                // Select all rows between anchor row and target row,
                // including the anchor row and target row
                if(oAnchor.recordIndex < nTargetRecordIndex) {
                    for(i=oAnchor.recordIndex; i<=nTargetRecordIndex; i++) {
                        this.selectRow(i);
                    }
                }
                // Select all rows between target row and anchor row,
                // including the target row and anchor row
                else {
                    for(i=oAnchor.recordIndex; i>=nTargetRecordIndex; i--) {
                        this.selectRow(i);
                    }
                }
            }
            // Invalid anchor
            else {
                // Set anchor
                this._oAnchorRecord = oTargetRecord;

                // Select target row only
                this.selectRow(oTargetRecord);
            }
        }
        // Only CTRL
        else if(bCTRL) {
            // Set anchor
            this._oAnchorRecord = oTargetRecord;

            // Toggle selection of target
            if(this.isSelected(oTargetRecord)) {
                this.unselectRow(oTargetRecord);
            }
            else {
                this.selectRow(oTargetRecord);
            }
        }
        // Neither SHIFT nor CTRL
        else {
            this._handleSingleSelectionByMouse(oArgs);
            return;
        }
    }
};

/**
 * Determines selection behavior resulting from a key event when selection mode
 * is set to "standard".
 *
 * @method _handleStandardSelectionByKey
 * @param e {HTMLEvent} Event object.
 * @private
 */
YAHOO.widget.DataTable.prototype._handleStandardSelectionByKey = function(e) {
    var nKey = YAHOO.util.Event.getCharCode(e);

    if((nKey == 38) || (nKey == 40)) {
        var bSHIFT = e.shiftKey;

        // Validate trigger
        var oTrigger = this._getSelectionTrigger();
        // Arrow selection only works if last selected row is on current page
        if(!oTrigger) {
            return null;
        }

        YAHOO.util.Event.stopEvent(e);

        // Validate anchor
        var oAnchor = this._getSelectionAnchor(oTrigger);

        // Determine which direction we're going to
        if(bSHIFT) {
            // Selecting down away from anchor row
            if((nKey == 40) && (oAnchor.recordIndex <= oTrigger.trIndex)) {
                this.selectRow(this.getNextTrEl(oTrigger.el));
            }
            // Selecting up away from anchor row
            else if((nKey == 38) && (oAnchor.recordIndex >= oTrigger.trIndex)) {
                this.selectRow(this.getPreviousTrEl(oTrigger.el));
            }
            // Unselect trigger
            else {
                this.unselectRow(oTrigger.el);
            }
        }
        else {
            this._handleSingleSelectionByKey(e);
        }
    }
};

/**
 * Determines selection behavior resulting from a mouse event when selection mode
 * is set to "single".
 *
 * @method _handleSingleSelectionByMouse
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 * @private
 */
YAHOO.widget.DataTable.prototype._handleSingleSelectionByMouse = function(oArgs) {
    var elTarget = oArgs.target;

    // Validate target row
    var elTargetRow = this.getTrEl(elTarget);
    if(elTargetRow) {
        var oTargetRecord = this.getRecord(elTargetRow);

        // Set anchor
        this._oAnchorRecord = oTargetRecord;

        // Select only target
        this.unselectAllRows();
        this.selectRow(oTargetRecord);
    }
};

/**
 * Determines selection behavior resulting from a key event when selection mode
 * is set to "single".
 *
 * @method _handleSingleSelectionByKey
 * @param e {HTMLEvent} Event object.
 * @private
 */
YAHOO.widget.DataTable.prototype._handleSingleSelectionByKey = function(e) {
    var nKey = YAHOO.util.Event.getCharCode(e);

    if((nKey == 38) || (nKey == 40)) {
        // Validate trigger
        var oTrigger = this._getSelectionTrigger();
        // Arrow selection only works if last selected row is on current page
        if(!oTrigger) {
            return null;
        }

        YAHOO.util.Event.stopEvent(e);

        // Determine the new row to select
        var elNew;
        if(nKey == 38) { // arrow up
            elNew = this.getPreviousTrEl(oTrigger.el);

            // Validate new row
            if(elNew === null) {
                //TODO: wrap around to last tr on current page
                //elNew = this.getLastTrEl();

                //TODO: wrap back to last tr of previous page

                // Top row selection is sticky
                elNew = this.getFirstTrEl();
            }
        }
        else if(nKey == 40) { // arrow down
            elNew = this.getNextTrEl(oTrigger.el);

            // Validate new row
            if(elNew === null) {
                //TODO: wrap around to first tr on current page
                //elNew = this.getFirstTrEl();

                //TODO: wrap forward to first tr of previous page

                // Bottom row selection is sticky
                elNew = this.getLastTrEl();
            }
        }

        // Unselect all rows
        this.unselectAllRows();

        // Select the new row
        this.selectRow(elNew);

        // Set new anchor
        this._oAnchorRecord = this.getRecord(elNew);
    }
};

/**
 * Determines selection behavior resulting from a mouse event when selection mode
 * is set to "cellblock".
 *
 * @method _handleCellBlockSelectionByMouse
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 * @private
 */
YAHOO.widget.DataTable.prototype._handleCellBlockSelectionByMouse = function(oArgs) {
    var elTarget = oArgs.target;

    // Validate target cell
    var elTargetCell = this.getTdEl(elTarget);
    if(elTargetCell) {
        var e = oArgs.event;
        var bSHIFT = e.shiftKey;
        var bCTRL = e.ctrlKey || ((navigator.userAgent.toLowerCase().indexOf("mac") != -1) && e.metaKey);

        var elTargetRow = this.getTrEl(elTargetCell);
        var nTargetTrIndex = this.getTrIndex(elTargetRow);
        var oTargetColumn = this.getColumn(elTargetCell);
        var nTargetColKeyIndex = oTargetColumn.getKeyIndex();
        var oTargetRecord = this.getRecord(elTargetRow);
        var nTargetRecordIndex = this._oRecordSet.getRecordIndex(oTargetRecord);
        var oTargetCell = {record:oTargetRecord, column:oTargetColumn};

        var oAnchor = this._getSelectionAnchor();

        var allRows = this.getTbodyEl().rows;
        var startIndex, endIndex, currentRow, i, j;

        // Both SHIFT and CTRL
        if(bSHIFT && bCTRL) {

            // Validate anchor
            if(oAnchor) {
                // Anchor is selected
                if(this.isSelected(oAnchor.cell)) {
                    // All cells are on the same row
                    if(oAnchor.recordIndex === nTargetRecordIndex) {
                        // Select all cells between anchor cell and target cell, including target cell
                        if(oAnchor.colKeyIndex < nTargetColKeyIndex) {
                            for(i=oAnchor.colKeyIndex+1; i<=nTargetColKeyIndex; i++) {
                                this.selectCell(elTargetRow.cells[i]);
                            }
                        }
                        // Select all cells between target cell and anchor cell, including target cell
                        else if(nTargetColKeyIndex < oAnchor.colKeyIndex) {
                            for(i=nTargetColKeyIndex; i<oAnchor.colKeyIndex; i++) {
                                this.selectCell(elTargetRow.cells[i]);
                            }
                        }
                    }
                    // Anchor row is above target row
                    else if(oAnchor.recordIndex < nTargetRecordIndex) {
                        startIndex = Math.min(oAnchor.colKeyIndex, nTargetColKeyIndex);
                        endIndex = Math.max(oAnchor.colKeyIndex, nTargetColKeyIndex);

                        // Select all cells from startIndex to endIndex on rows between anchor row and target row
                        for(i=oAnchor.trIndex; i<=nTargetTrIndex; i++) {
                            for(j=startIndex; j<=endIndex; j++) {
                                this.selectCell(allRows[i].cells[j]);
                            }
                        }
                    }
                    // Anchor row is below target row
                    else {
                        startIndex = Math.min(oAnchor.trIndex, nTargetColKeyIndex);
                        endIndex = Math.max(oAnchor.trIndex, nTargetColKeyIndex);

                        // Select all cells from startIndex to endIndex on rows between target row and anchor row
                        for(i=oAnchor.trIndex; i>=nTargetTrIndex; i--) {
                            for(j=endIndex; j>=startIndex; j--) {
                                this.selectCell(allRows[i].cells[j]);
                            }
                        }
                    }
                }
                // Anchor cell is unselected
                else {
                    // All cells are on the same row
                    if(oAnchor.recordIndex === nTargetRecordIndex) {
                        // Unselect all cells between anchor cell and target cell
                        if(oAnchor.colKeyIndex < nTargetColKeyIndex) {
                            for(i=oAnchor.colKeyIndex+1; i<nTargetColKeyIndex; i++) {
                                this.unselectCell(elTargetRow.cells[i]);
                            }
                        }
                        // Select all cells between target cell and anchor cell
                        else if(nTargetColKeyIndex < oAnchor.colKeyIndex) {
                            for(i=nTargetColKeyIndex+1; i<oAnchor.colKeyIndex; i++) {
                                this.unselectCell(elTargetRow.cells[i]);
                            }
                        }
                    }
                    // Anchor row is above target row
                    if(oAnchor.recordIndex < nTargetRecordIndex) {
                        // Unselect all cells from anchor cell to target cell
                        for(i=oAnchor.trIndex; i<=nTargetTrIndex; i++) {
                            currentRow = allRows[i];
                            for(j=0; j<currentRow.cells.length; j++) {
                                // This is the anchor row, only unselect cells after the anchor cell
                                if(currentRow.sectionRowIndex === oAnchor.trIndex) {
                                    if(j>oAnchor.colKeyIndex) {
                                        this.unselectCell(currentRow.cells[j]);
                                    }
                                }
                                // This is the target row, only unelect cells before the target cell
                                else if(currentRow.sectionRowIndex === nTargetTrIndex) {
                                    if(j<nTargetColKeyIndex) {
                                        this.unselectCell(currentRow.cells[j]);
                                    }
                                }
                                // Unselect all cells on this row
                                else {
                                    this.unselectCell(currentRow.cells[j]);
                                }
                            }
                        }
                    }
                    // Anchor row is below target row
                    else {
                        // Unselect all cells from target cell to anchor cell
                        for(i=nTargetTrIndex; i<=oAnchor.trIndex; i++) {
                            currentRow = allRows[i];
                            for(j=0; j<currentRow.cells.length; j++) {
                                // This is the target row, only unselect cells after the target cell
                                if(currentRow.sectionRowIndex == nTargetTrIndex) {
                                    if(j>nTargetColKeyIndex) {
                                        this.unselectCell(currentRow.cells[j]);
                                    }
                                }
                                // This is the anchor row, only unselect cells before the anchor cell
                                else if(currentRow.sectionRowIndex == oAnchor.trIndex) {
                                    if(j<oAnchor.colKeyIndex) {
                                        this.unselectCell(currentRow.cells[j]);
                                    }
                                }
                                // Unselect all cells on this row
                                else {
                                    this.unselectCell(currentRow.cells[j]);
                                }
                            }
                        }
                    }

                    // Select the target cell
                    this.selectCell(elTargetCell);
                }
            }
            // Invalid anchor
            else {
                // Set anchor
                this._oAnchorCell = oTargetCell;

                // Toggle selection of target
                if(this.isSelected(oTargetCell)) {
                    this.unselectCell(oTargetCell);
                }
                else {
                    this.selectCell(oTargetCell);
                }
            }

        }
         // Only SHIFT
        else if(bSHIFT) {
            this.unselectAllCells();

            // Validate anchor
            if(oAnchor) {
                // All cells are on the same row
                if(oAnchor.recordIndex === nTargetRecordIndex) {
                    // Select all cells between anchor cell and target cell,
                    // including the anchor cell and target cell
                    if(oAnchor.colKeyIndex < nTargetColKeyIndex) {
                        for(i=oAnchor.colKeyIndex; i<=nTargetColKeyIndex; i++) {
                            this.selectCell(elTargetRow.cells[i]);
                        }
                    }
                    // Select all cells between target cell and anchor cell
                    // including the target cell and anchor cell
                    else if(nTargetColKeyIndex < oAnchor.colKeyIndex) {
                        for(i=nTargetColKeyIndex; i<=oAnchor.colKeyIndex; i++) {
                            this.selectCell(elTargetRow.cells[i]);
                        }
                    }
                }
                // Anchor row is above target row
                else if(oAnchor.recordIndex < nTargetRecordIndex) {
                    // Select the cellblock from anchor cell to target cell
                    // including the anchor cell and the target cell
                    startIndex = Math.min(oAnchor.colKeyIndex, nTargetColKeyIndex);
                    endIndex = Math.max(oAnchor.colKeyIndex, nTargetColKeyIndex);

                    for(i=oAnchor.trIndex; i<=nTargetTrIndex; i++) {
                        for(j=startIndex; j<=endIndex; j++) {
                            this.selectCell(allRows[i].cells[j]);
                        }
                    }
                }
                // Anchor row is below target row
                else {
                    // Select the cellblock from target cell to anchor cell
                    // including the target cell and the anchor cell
                    startIndex = Math.min(oAnchor.colKeyIndex, nTargetColKeyIndex);
                    endIndex = Math.max(oAnchor.colKeyIndex, nTargetColKeyIndex);

                    for(i=nTargetTrIndex; i<=oAnchor.trIndex; i++) {
                        for(j=startIndex; j<=endIndex; j++) {
                            this.selectCell(allRows[i].cells[j]);
                        }
                    }
                }
            }
            // Invalid anchor
            else {
                // Set anchor
                this._oAnchorCell = oTargetCell;

                // Select target only
                this.selectCell(oTargetCell);
            }
        }
        // Only CTRL
        else if(bCTRL) {

            // Set anchor
            this._oAnchorCell = oTargetCell;

            // Toggle selection of target
            if(this.isSelected(oTargetCell)) {
                this.unselectCell(oTargetCell);
            }
            else {
                this.selectCell(oTargetCell);
            }

        }
        // Neither SHIFT nor CTRL
        else {
            this._handleSingleCellSelectionByMouse(oArgs);
        }
    }
};

/**
 * Determines selection behavior resulting from a key event when selection mode
 * is set to "cellblock".
 *
 * @method _handleCellBlockSelectionByKey
 * @param e {HTMLEvent} Event object.
 * @private
 */
YAHOO.widget.DataTable.prototype._handleCellBlockSelectionByKey = function(e) {
    var nKey = YAHOO.util.Event.getCharCode(e);
    var bSHIFT = e.shiftKey;
    if((nKey == 9) || !bSHIFT) {
        this._handleSingleCellSelectionByKey(e);
        return;
    }

    if((nKey > 36) && (nKey < 41)) {
        // Validate trigger
        var oTrigger = this._getSelectionTrigger();
        // Arrow selection only works if last selected row is on current page
        if(!oTrigger) {
            return null;
        }

        YAHOO.util.Event.stopEvent(e);

        // Validate anchor
        var oAnchor = this._getSelectionAnchor(oTrigger);

        var i, startIndex, endIndex, elNew, elNewRow;
        var allRows = this.getTbodyEl().rows;
        var elThisRow = oTrigger.el.parentNode;

        // Determine which direction we're going to

        if(nKey == 40) { // arrow down
            // Selecting away from anchor cell
            if(oAnchor.recordIndex <= oTrigger.recordIndex) {
                // Select the horiz block on the next row...
                // ...making sure there is room below the trigger row
                elNewRow = this.getNextTrEl(oTrigger.el);
                if(elNewRow) {
                    startIndex = oAnchor.colKeyIndex;
                    endIndex = oTrigger.colKeyIndex;
                    // ...going left
                    if(startIndex > endIndex) {
                        for(i=startIndex; i>=endIndex; i--) {
                            elNew = elNewRow.cells[i];
                            this.selectCell(elNew);
                        }
                    }
                    // ... going right
                    else {
                        for(i=startIndex; i<=endIndex; i++) {
                            elNew = elNewRow.cells[i];
                            this.selectCell(elNew);
                        }
                    }
                }
            }
            // Unselecting towards anchor cell
            else {
                startIndex = Math.min(oAnchor.colKeyIndex, oTrigger.colKeyIndex);
                endIndex = Math.max(oAnchor.colKeyIndex, oTrigger.colKeyIndex);
                // Unselect the horiz block on this row towards the next row
                for(i=startIndex; i<=endIndex; i++) {
                    this.unselectCell(elThisRow.cells[i]);
                }
            }
        }
        // Arrow up
        else if(nKey == 38) {
            // Selecting away from anchor cell
            if(oAnchor.recordIndex >= oTrigger.recordIndex) {
                // Select the horiz block on the previous row...
                // ...making sure there is room
                elNewRow = this.getPreviousTrEl(oTrigger.el);
                if(elNewRow) {
                    // Select in order from anchor to trigger...
                    startIndex = oAnchor.colKeyIndex;
                    endIndex = oTrigger.colKeyIndex;
                    // ...going left
                    if(startIndex > endIndex) {
                        for(i=startIndex; i>=endIndex; i--) {
                            elNew = elNewRow.cells[i];
                            this.selectCell(elNew);
                        }
                    }
                    // ... going right
                    else {
                        for(i=startIndex; i<=endIndex; i++) {
                            elNew = elNewRow.cells[i];
                            this.selectCell(elNew);
                        }
                    }
                }
            }
            // Unselecting towards anchor cell
            else {
                startIndex = Math.min(oAnchor.colKeyIndex, oTrigger.colKeyIndex);
                endIndex = Math.max(oAnchor.colKeyIndex, oTrigger.colKeyIndex);
                // Unselect the horiz block on this row towards the previous row
                for(i=startIndex; i<=endIndex; i++) {
                    this.unselectCell(elThisRow.cells[i]);
                }
            }
        }
        // Arrow right
        else if(nKey == 39) {
            // Selecting away from anchor cell
            if(oAnchor.colKeyIndex <= oTrigger.colKeyIndex) {
                // Select the next vert block to the right...
                // ...making sure there is room
                if(oTrigger.colKeyIndex < elThisRow.cells.length-1) {
                    // Select in order from anchor to trigger...
                    startIndex = oAnchor.trIndex;
                    endIndex = oTrigger.trIndex;
                    // ...going up
                    if(startIndex > endIndex) {
                        for(i=startIndex; i>=endIndex; i--) {
                            elNew = allRows[i].cells[oTrigger.colKeyIndex+1];
                            this.selectCell(elNew);
                        }
                    }
                    // ... going down
                    else {
                        for(i=startIndex; i<=endIndex; i++) {
                            elNew = allRows[i].cells[oTrigger.colKeyIndex+1];
                            this.selectCell(elNew);
                        }
                    }
                }
            }
            // Unselecting towards anchor cell
            else {
                // Unselect the vert block on this column towards the right
                startIndex = Math.min(oAnchor.trIndex, oTrigger.trIndex);
                endIndex = Math.max(oAnchor.trIndex, oTrigger.trIndex);
                for(i=startIndex; i<=endIndex; i++) {
                    this.unselectCell(allRows[i].cells[oTrigger.colKeyIndex]);
                }
            }
        }
        // Arrow left
        else if(nKey == 37) {
            // Selecting away from anchor cell
            if(oAnchor.colKeyIndex >= oTrigger.colKeyIndex) {
                //Select the previous vert block to the left
                if(oTrigger.colKeyIndex > 0) {
                    // Select in order from anchor to trigger...
                    startIndex = oAnchor.trIndex;
                    endIndex = oTrigger.trIndex;
                    // ...going up
                    if(startIndex > endIndex) {
                        for(i=startIndex; i>=endIndex; i--) {
                            elNew = allRows[i].cells[oTrigger.colKeyIndex-1];
                            this.selectCell(elNew);
                        }
                    }
                    // ... going down
                    else {
                        for(i=startIndex; i<=endIndex; i++) {
                            elNew = allRows[i].cells[oTrigger.colKeyIndex-1];
                            this.selectCell(elNew);
                        }
                    }
                }
            }
            // Unselecting towards anchor cell
            else {
                // Unselect the vert block on this column towards the left
                startIndex = Math.min(oAnchor.trIndex, oTrigger.trIndex);
                endIndex = Math.max(oAnchor.trIndex, oTrigger.trIndex);
                for(i=startIndex; i<=endIndex; i++) {
                    this.unselectCell(allRows[i].cells[oTrigger.colKeyIndex]);
                }
            }
        }
    }
};

/**
 * Determines selection behavior resulting from a mouse event when selection mode
 * is set to "cellrange".
 *
 * @method _handleCellRangeSelectionByMouse
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 * @private
 */
YAHOO.widget.DataTable.prototype._handleCellRangeSelectionByMouse = function(oArgs) {
    var elTarget = oArgs.target;

    // Validate target cell
    var elTargetCell = this.getTdEl(elTarget);
    if(elTargetCell) {
        var e = oArgs.event;
        var bSHIFT = e.shiftKey;
        var bCTRL = e.ctrlKey || ((navigator.userAgent.toLowerCase().indexOf("mac") != -1) && e.metaKey);

        var elTargetRow = this.getTrEl(elTargetCell);
        var nTargetTrIndex = this.getTrIndex(elTargetRow);
        var oTargetColumn = this.getColumn(elTargetCell);
        var nTargetColKeyIndex = oTargetColumn.getKeyIndex();
        var oTargetRecord = this.getRecord(elTargetRow);
        var nTargetRecordIndex = this._oRecordSet.getRecordIndex(oTargetRecord);
        var oTargetCell = {record:oTargetRecord, column:oTargetColumn};

        var oAnchor = this._getSelectionAnchor();

        var allRows = this.getTbodyEl().rows;
        var currentRow, i, j;

        // Both SHIFT and CTRL
        if(bSHIFT && bCTRL) {

            // Validate anchor
            if(oAnchor) {
                // Anchor is selected
                if(this.isSelected(oAnchor.cell)) {
                    // All cells are on the same row
                    if(oAnchor.recordIndex === nTargetRecordIndex) {
                        // Select all cells between anchor cell and target cell, including target cell
                        if(oAnchor.colKeyIndex < nTargetColKeyIndex) {
                            for(i=oAnchor.colKeyIndex+1; i<=nTargetColKeyIndex; i++) {
                                this.selectCell(elTargetRow.cells[i]);
                            }
                        }
                        // Select all cells between target cell and anchor cell, including target cell
                        else if(nTargetColKeyIndex < oAnchor.colKeyIndex) {
                            for(i=nTargetColKeyIndex; i<oAnchor.colKeyIndex; i++) {
                                this.selectCell(elTargetRow.cells[i]);
                            }
                        }
                    }
                    // Anchor row is above target row
                    else if(oAnchor.recordIndex < nTargetRecordIndex) {
                        // Select all cells on anchor row from anchor cell to the end of the row
                        for(i=oAnchor.colKeyIndex+1; i<elTargetRow.cells.length; i++) {
                            this.selectCell(elTargetRow.cells[i]);
                        }

                        // Select all cells on all rows between anchor row and target row
                        for(i=oAnchor.trIndex+1; i<nTargetTrIndex; i++) {
                            for(j=0; j<allRows[i].cells.length; j++){
                                this.selectCell(allRows[i].cells[j]);
                            }
                        }

                        // Select all cells on target row from first cell to the target cell
                        for(i=0; i<=nTargetColKeyIndex; i++) {
                            this.selectCell(elTargetRow.cells[i]);
                        }
                    }
                    // Anchor row is below target row
                    else {
                        // Select all cells on target row from target cell to the end of the row
                        for(i=nTargetColKeyIndex; i<elTargetRow.cells.length; i++) {
                            this.selectCell(elTargetRow.cells[i]);
                        }

                        // Select all cells on all rows between target row and anchor row
                        for(i=nTargetTrIndex+1; i<oAnchor.trIndex; i++) {
                            for(j=0; j<allRows[i].cells.length; j++){
                                this.selectCell(allRows[i].cells[j]);
                            }
                        }

                        // Select all cells on anchor row from first cell to the anchor cell
                        for(i=0; i<oAnchor.colKeyIndex; i++) {
                            this.selectCell(elTargetRow.cells[i]);
                        }
                    }
                }
                // Anchor cell is unselected
                else {
                    // All cells are on the same row
                    if(oAnchor.recordIndex === nTargetRecordIndex) {
                        // Unselect all cells between anchor cell and target cell
                        if(oAnchor.colKeyIndex < nTargetColKeyIndex) {
                            for(i=oAnchor.colKeyIndex+1; i<nTargetColKeyIndex; i++) {
                                this.unselectCell(elTargetRow.cells[i]);
                            }
                        }
                        // Select all cells between target cell and anchor cell
                        else if(nTargetColKeyIndex < oAnchor.colKeyIndex) {
                            for(i=nTargetColKeyIndex+1; i<oAnchor.colKeyIndex; i++) {
                                this.unselectCell(elTargetRow.cells[i]);
                            }
                        }
                    }
                    // Anchor row is above target row
                    if(oAnchor.recordIndex < nTargetRecordIndex) {
                        // Unselect all cells from anchor cell to target cell
                        for(i=oAnchor.trIndex; i<=nTargetTrIndex; i++) {
                            currentRow = allRows[i];
                            for(j=0; j<currentRow.cells.length; j++) {
                                // This is the anchor row, only unselect cells after the anchor cell
                                if(currentRow.sectionRowIndex === oAnchor.trIndex) {
                                    if(j>oAnchor.colKeyIndex) {
                                        this.unselectCell(currentRow.cells[j]);
                                    }
                                }
                                // This is the target row, only unelect cells before the target cell
                                else if(currentRow.sectionRowIndex === nTargetTrIndex) {
                                    if(j<nTargetColKeyIndex) {
                                        this.unselectCell(currentRow.cells[j]);
                                    }
                                }
                                // Unselect all cells on this row
                                else {
                                    this.unselectCell(currentRow.cells[j]);
                                }
                            }
                        }
                    }
                    // Anchor row is below target row
                    else {
                        // Unselect all cells from target cell to anchor cell
                        for(i=nTargetTrIndex; i<=oAnchor.trIndex; i++) {
                            currentRow = allRows[i];
                            for(j=0; j<currentRow.cells.length; j++) {
                                // This is the target row, only unselect cells after the target cell
                                if(currentRow.sectionRowIndex == nTargetTrIndex) {
                                    if(j>nTargetColKeyIndex) {
                                        this.unselectCell(currentRow.cells[j]);
                                    }
                                }
                                // This is the anchor row, only unselect cells before the anchor cell
                                else if(currentRow.sectionRowIndex == oAnchor.trIndex) {
                                    if(j<oAnchor.colKeyIndex) {
                                        this.unselectCell(currentRow.cells[j]);
                                    }
                                }
                                // Unselect all cells on this row
                                else {
                                    this.unselectCell(currentRow.cells[j]);
                                }
                            }
                        }
                    }

                    // Select the target cell
                    this.selectCell(elTargetCell);
                }
            }
            // Invalid anchor
            else {
                // Set anchor
                this._oAnchorCell = oTargetCell;

                // Toggle selection of target
                if(this.isSelected(oTargetCell)) {
                    this.unselectCell(oTargetCell);
                }
                else {
                    this.selectCell(oTargetCell);
                }
            }
        }
         // Only SHIFT
        else if(bSHIFT) {

            this.unselectAllCells();

            // Validate anchor
            if(oAnchor) {
                // All cells are on the same row
                if(oAnchor.recordIndex === nTargetRecordIndex) {
                    // Select all cells between anchor cell and target cell,
                    // including the anchor cell and target cell
                    if(oAnchor.colKeyIndex < nTargetColKeyIndex) {
                        for(i=oAnchor.colKeyIndex; i<=nTargetColKeyIndex; i++) {
                            this.selectCell(elTargetRow.cells[i]);
                        }
                    }
                    // Select all cells between target cell and anchor cell
                    // including the target cell and anchor cell
                    else if(nTargetColKeyIndex < oAnchor.colKeyIndex) {
                        for(i=nTargetColKeyIndex; i<=oAnchor.colKeyIndex; i++) {
                            this.selectCell(elTargetRow.cells[i]);
                        }
                    }
                }
                // Anchor row is above target row
                else if(oAnchor.recordIndex < nTargetRecordIndex) {
                    // Select all cells from anchor cell to target cell
                    // including the anchor cell and target cell
                    for(i=oAnchor.trIndex; i<=nTargetTrIndex; i++) {
                        currentRow = allRows[i];
                        for(j=0; j<currentRow.cells.length; j++) {
                            // This is the anchor row, only select the anchor cell and after
                            if(currentRow.sectionRowIndex == oAnchor.trIndex) {
                                if(j>=oAnchor.colKeyIndex) {
                                    this.selectCell(currentRow.cells[j]);
                                }
                            }
                            // This is the target row, only select the target cell and before
                            else if(currentRow.sectionRowIndex == nTargetTrIndex) {
                                if(j<=nTargetColKeyIndex) {
                                    this.selectCell(currentRow.cells[j]);
                                }
                            }
                            // Select all cells on this row
                            else {
                                this.selectCell(currentRow.cells[j]);
                            }
                        }
                    }
                }
                // Anchor row is below target row
                else {
                    // Select all cells from target cell to anchor cell,
                    // including the target cell and anchor cell
                    for(i=nTargetTrIndex; i<=oAnchor.trIndex; i++) {
                        currentRow = allRows[i];
                        for(j=0; j<currentRow.cells.length; j++) {
                            // This is the target row, only select the target cell and after
                            if(currentRow.sectionRowIndex == nTargetTrIndex) {
                                if(j>=nTargetColKeyIndex) {
                                    this.selectCell(currentRow.cells[j]);
                                }
                            }
                            // This is the anchor row, only select the anchor cell and before
                            else if(currentRow.sectionRowIndex == oAnchor.trIndex) {
                                if(j<=oAnchor.colKeyIndex) {
                                    this.selectCell(currentRow.cells[j]);
                                }
                            }
                            // Select all cells on this row
                            else {
                                this.selectCell(currentRow.cells[j]);
                            }
                        }
                    }
                }
            }
            // Invalid anchor
            else {
                // Set anchor
                this._oAnchorCell = oTargetCell;

                // Select target only
                this.selectCell(oTargetCell);
            }


        }
        // Only CTRL
        else if(bCTRL) {

            // Set anchor
            this._oAnchorCell = oTargetCell;

            // Toggle selection of target
            if(this.isSelected(oTargetCell)) {
                this.unselectCell(oTargetCell);
            }
            else {
                this.selectCell(oTargetCell);
            }

        }
        // Neither SHIFT nor CTRL
        else {
            this._handleSingleCellSelectionByMouse(oArgs);
        }
    }
};

/**
 * Determines selection behavior resulting from a key event when selection mode
 * is set to "cellrange".
 *
 * @method _handleCellRangeSelectionByKey
 * @param e {HTMLEvent} Event object.
 * @private
 */
YAHOO.widget.DataTable.prototype._handleCellRangeSelectionByKey = function(e) {
    var nKey = YAHOO.util.Event.getCharCode(e);
    var bSHIFT = e.shiftKey;
    if((nKey == 9) || !bSHIFT) {
        this._handleSingleCellSelectionByKey(e);
        return;
    }

    if((nKey > 36) && (nKey < 41)) {
        // Validate trigger
        var oTrigger = this._getSelectionTrigger();
        // Arrow selection only works if last selected row is on current page
        if(!oTrigger) {
            return null;
        }

        YAHOO.util.Event.stopEvent(e);

        // Validate anchor
        var oAnchor = this._getSelectionAnchor(oTrigger);

        var i, elNewRow, elNew;
        var allRows = this.getTbodyEl().rows;
        var elThisRow = oTrigger.el.parentNode;

        // Arrow down
        if(nKey == 40) {
            elNewRow = this.getNextTrEl(oTrigger.el);

            // Selecting away from anchor cell
            if(oAnchor.recordIndex <= oTrigger.recordIndex) {
                // Select all cells to the end of this row
                for(i=oTrigger.colKeyIndex+1; i<elThisRow.cells.length; i++){
                    elNew = elThisRow.cells[i];
                    this.selectCell(elNew);
                }

                // Select some of the cells on the next row down
                if(elNewRow) {
                    for(i=0; i<=oTrigger.colKeyIndex; i++){
                        elNew = elNewRow.cells[i];
                        this.selectCell(elNew);
                    }
                }
            }
            // Unselecting towards anchor cell
            else {
                // Unselect all cells to the end of this row
                for(i=oTrigger.colKeyIndex; i<elThisRow.cells.length; i++){
                    this.unselectCell(elThisRow.cells[i]);
                }

                // Unselect some of the cells on the next row down
                if(elNewRow) {
                    for(i=0; i<oTrigger.colKeyIndex; i++){
                        this.unselectCell(elNewRow.cells[i]);
                    }
                }
            }
        }
        // Arrow up
        else if(nKey == 38) {
            elNewRow = this.getPreviousTrEl(oTrigger.el);

            // Selecting away from anchor cell
            if(oAnchor.recordIndex >= oTrigger.recordIndex) {
                // Select all the cells to the beginning of this row
                for(i=oTrigger.colKeyIndex-1; i>-1; i--){
                    elNew = elThisRow.cells[i];
                    this.selectCell(elNew);
                }

                // Select some of the cells from the end of the previous row
                if(elNewRow) {
                    for(i=elThisRow.cells.length-1; i>=oTrigger.colKeyIndex; i--){
                        elNew = elNewRow.cells[i];
                        this.selectCell(elNew);
                    }
                }
            }
            // Unselecting towards anchor cell
            else {
                // Unselect all the cells to the beginning of this row
                for(i=oTrigger.colKeyIndex; i>-1; i--){
                    this.unselectCell(elThisRow.cells[i]);
                }

                // Unselect some of the cells from the end of the previous row
                if(elNewRow) {
                    for(i=elThisRow.cells.length-1; i>oTrigger.colKeyIndex; i--){
                        this.unselectCell(elNewRow.cells[i]);
                    }
                }
            }
        }
        // Arrow right
        else if(nKey == 39) {
            elNewRow = this.getNextTrEl(oTrigger.el);

            // Selecting away from anchor cell
            if(oAnchor.recordIndex < oTrigger.recordIndex) {
                // Select the next cell to the right
                if(oTrigger.colKeyIndex < elThisRow.cells.length-1) {
                    elNew = elThisRow.cells[oTrigger.colKeyIndex+1];
                    this.selectCell(elNew);
                }
                // Select the first cell of the next row
                else if(elNewRow) {
                    elNew = elNewRow.cells[0];
                    this.selectCell(elNew);
                }
            }
            // Unselecting towards anchor cell
            else if(oAnchor.recordIndex > oTrigger.recordIndex) {
                this.unselectCell(elThisRow.cells[oTrigger.colKeyIndex]);

                // Unselect this cell towards the right
                if(oTrigger.colKeyIndex < elThisRow.cells.length-1) {
                }
                // Unselect this cells towards the first cell of the next row
                else {
                }
            }
            // Anchor is on this row
            else {
                // Selecting away from anchor
                if(oAnchor.colKeyIndex <= oTrigger.colKeyIndex) {
                    // Select the next cell to the right
                    if(oTrigger.colKeyIndex < elThisRow.cells.length-1) {
                        elNew = elThisRow.cells[oTrigger.colKeyIndex+1];
                        this.selectCell(elNew);
                    }
                    // Select the first cell on the next row
                    else if(oTrigger.trIndex < allRows.length-1){
                        elNew = elNewRow.cells[0];
                        this.selectCell(elNew);
                    }
                }
                // Unselecting towards anchor
                else {
                    // Unselect this cell towards the right
                    this.unselectCell(elThisRow.cells[oTrigger.colKeyIndex]);
                }
            }
        }
        // Arrow left
        else if(nKey == 37) {
            elNewRow = this.getPreviousTrEl(oTrigger.el);

            // Unselecting towards the anchor
            if(oAnchor.recordIndex < oTrigger.recordIndex) {
                this.unselectCell(elThisRow.cells[oTrigger.colKeyIndex]);

                // Unselect this cell towards the left
                if(oTrigger.colKeyIndex > 0) {
                }
                // Unselect this cell towards the last cell of the previous row
                else {
                }
            }
            // Selecting towards the anchor
            else if(oAnchor.recordIndex > oTrigger.recordIndex) {
                // Select the next cell to the left
                if(oTrigger.colKeyIndex > 0) {
                    elNew = elThisRow.cells[oTrigger.colKeyIndex-1];
                    this.selectCell(elNew);
                }
                // Select the last cell of the previous row
                else if(oTrigger.trIndex > 0){
                    elNew = elNewRow.cells[elNewRow.cells.length-1];
                    this.selectCell(elNew);
                }
            }
            // Anchor is on this row
            else {
                // Selecting away from anchor cell
                if(oAnchor.colKeyIndex >= oTrigger.colKeyIndex) {
                    // Select the next cell to the left
                    if(oTrigger.colKeyIndex > 0) {
                        elNew = elThisRow.cells[oTrigger.colKeyIndex-1];
                        this.selectCell(elNew);
                    }
                    // Select the last cell of the previous row
                    else if(oTrigger.trIndex > 0){
                        elNew = elNewRow.cells[elNewRow.cells.length-1];
                        this.selectCell(elNew);
                    }
                }
                // Unselecting towards anchor cell
                else {
                    this.unselectCell(elThisRow.cells[oTrigger.colKeyIndex]);

                    // Unselect this cell towards the left
                    if(oTrigger.colKeyIndex > 0) {
                    }
                    // Unselect this cell towards the last cell of the previous row
                    else {
                    }
                }
            }
        }
    }
};

/**
 * Determines selection behavior resulting from a mouse event when selection mode
 * is set to "singlecell".
 *
 * @method _handleSingleCellSelectionByMouse
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 * @private
 */
YAHOO.widget.DataTable.prototype._handleSingleCellSelectionByMouse = function(oArgs) {
    var elTarget = oArgs.target;

    // Validate target cell
    var elTargetCell = this.getTdEl(elTarget);
    if(elTargetCell) {
        var elTargetRow = this.getTrEl(elTargetCell);
        var oTargetRecord = this.getRecord(elTargetRow);
        var oTargetColumn = this.getColumn(elTargetCell);
        var oTargetCell = {record:oTargetRecord, column:oTargetColumn};

        // Set anchor
        this._oAnchorCell = oTargetCell;

        // Select only target
        this.unselectAllCells();
        this.selectCell(oTargetCell);
    }
};

/**
 * Determines selection behavior resulting from a key event when selection mode
 * is set to "singlecell".
 *
 * @method _handleSingleCellSelectionByKey
 * @param e {HTMLEvent} Event object.
 * @private
 */
YAHOO.widget.DataTable.prototype._handleSingleCellSelectionByKey = function(e) {
    var nKey = YAHOO.util.Event.getCharCode(e);
    if((nKey == 9) || ((nKey > 36) && (nKey < 41))) {
        var bSHIFT = e.shiftKey;

        // Validate trigger
        var oTrigger = this._getSelectionTrigger();
        // Arrow selection only works if last selected row is on current page
        if(!oTrigger) {
            return null;
        }

        // Determine the new cell to select
        var elNew;
        if(nKey == 40) { // Arrow down
            elNew = this.getBelowTdEl(oTrigger.el);

            // Validate new cell
            if(elNew === null) {
                //TODO: wrap around to first tr on current page

                //TODO: wrap forward to first tr of next page

                // Bottom selection is sticky
                elNew = oTrigger.el;
            }
        }
        else if(nKey == 38) { // Arrow up
            elNew = this.getAboveTdEl(oTrigger.el);

            // Validate new cell
            if(elNew === null) {
                //TODO: wrap around to last tr on current page

                //TODO: wrap back to last tr of previous page

                // Top selection is sticky
                elNew = oTrigger.el;
            }
        }
        else if((nKey == 39) || (!bSHIFT && (nKey == 9))) { // Arrow right or tab
            elNew = this.getNextTdEl(oTrigger.el);

            // Validate new cell
            if(elNew === null) {
                //TODO: wrap around to first td on current page

                //TODO: wrap forward to first td of next page

                // Top-left selection is sticky, and release TAB focus
                //elNew = oTrigger.el;
                return;
            }
        }
        else if((nKey == 37) || (bSHIFT && (nKey == 9))) { // Arrow left or shift-tab
            elNew = this.getPreviousTdEl(oTrigger.el);

            // Validate new cell
            if(elNew === null) {
                //TODO: wrap around to last td on current page

                //TODO: wrap back to last td of previous page

                // Bottom-right selection is sticky, and release TAB focus
                //elNew = oTrigger.el;
                return;
            }
        }

        YAHOO.util.Event.stopEvent(e);
        
        // Unselect all cells
        this.unselectAllCells();

        // Select the new cell
        this.selectCell(elNew);

        // Set new anchor
        this._oAnchorCell = {record:this.getRecord(elNew), column:this.getColumn(elNew)};
    }
};

/**
 * Returns array of selected TR elements on the page.
 *
 * @method getSelectedTrEls
 * @return {HTMLElement[]} Array of selected TR elements.
 */
YAHOO.widget.DataTable.prototype.getSelectedTrEls = function() {
    return YAHOO.util.Dom.getElementsByClassName(YAHOO.widget.DataTable.CLASS_SELECTED,"tr",this._elTbody);
};

/**
 * Sets given row to the selected state.
 *
 * @method selectRow
 * @param row {HTMLElement | String | YAHOO.widget.Record | Number} HTML element
 * reference or ID string, Record instance, or RecordSet position index.
 */
YAHOO.widget.DataTable.prototype.selectRow = function(row) {
    var oRecord, elRow;

    if(row instanceof YAHOO.widget.Record) {
        oRecord = this._oRecordSet.getRecord(row);
        elRow = this.getTrEl(oRecord);
    }
    else if(YAHOO.lang.isNumber(row)) {
        oRecord = this.getRecord(row);
        elRow = this.getTrEl(oRecord);
    }
    else {
        elRow = this.getTrEl(row);
        oRecord = this.getRecord(elRow);
    }

    if(oRecord) {
        // Update selection trackers
        var tracker = this._aSelections || [];
        var sRecordId = oRecord.getId();
        var index = -1;

        // Remove if already there:
        // Use Array.indexOf if available...
        /*if(tracker.indexOf && (tracker.indexOf(sRecordId) >  -1)) {
            tracker.splice(tracker.indexOf(sRecordId),1);
        }*/
        if(tracker.indexOf) {
            index = tracker.indexOf(sRecordId);
            
        }
        // ...or do it the old-fashioned way
        else {
            for(var j=tracker.length-1; j>-1; j--) {
                if(tracker[j] === sRecordId){
                    index = j;
                    break;
                }
            }
        }
        if(index > -1) {
            tracker.splice(index,1);
        }
        
        // Add to the end
        tracker.push(sRecordId);
        this._aSelections = tracker;

        // Update trackers
        if(!this._oAnchorRecord) {
            this._oAnchorRecord = oRecord;
        }

        // Update UI
        if(elRow) {
            YAHOO.util.Dom.addClass(elRow, YAHOO.widget.DataTable.CLASS_SELECTED);
        }

        this.fireEvent("rowSelectEvent", {record:oRecord, el:elRow});
        YAHOO.log("Selected " + elRow, "info", this.toString());
    }
    else {
        YAHOO.log("Could not select row " + row, "warn", this.toString());
    }
};

/**
 * Sets given row to the selected state.
 *
 * @method unselectRow
 * @param row {HTMLElement | String | YAHOO.widget.Record | Number} HTML element
 * reference or ID string, Record instance, or RecordSet position index.
 */
YAHOO.widget.DataTable.prototype.unselectRow = function(row) {
    var elRow = this.getTrEl(row);

    var oRecord;
    if(row instanceof YAHOO.widget.Record) {
        oRecord = this._oRecordSet.getRecord(row);
    }
    else if(YAHOO.lang.isNumber(row)) {
        oRecord = this.getRecord(row);
    }
    else {
        oRecord = this.getRecord(elRow);
    }

    if(oRecord) {
        // Update selection trackers
        var tracker = this._aSelections || [];
        var sRecordId = oRecord.getId();
        var index = -1;

        // Remove if found
        var bFound = false;

        // Use Array.indexOf if available...
        if(tracker.indexOf) {
            index = tracker.indexOf(sRecordId);
        }
        // ...or do it the old-fashioned way
        else {
            for(var j=tracker.length-1; j>-1; j--) {
                if(tracker[j] === sRecordId){
                    index = j;
                    break;
                }
            }
        }
        if(index > -1) {
            tracker.splice(index,1);
        }

        if(bFound) {
            // Update tracker
            this._aSelections = tracker;

            // Update the UI
            YAHOO.util.Dom.removeClass(elRow, YAHOO.widget.DataTable.CLASS_SELECTED);

            this.fireEvent("rowUnselectEvent", {record:oRecord, el:elRow});
            YAHOO.log("Unselected " + elRow, "info", this.toString());

            return;
        }

        // Update the UI
        YAHOO.util.Dom.removeClass(elRow, YAHOO.widget.DataTable.CLASS_SELECTED);

        this.fireEvent("rowUnselectEvent", {record:oRecord, el:elRow});
        YAHOO.log("Unselected " + elRow, "info", this.toString());
    }
    YAHOO.log("Could not unselect row " + row, "warn", this.toString());
};

/**
 * Clears out all row selections.
 *
 * @method unselectAllRows
 */
YAHOO.widget.DataTable.prototype.unselectAllRows = function() {
    // Remove all rows from tracker
    var tracker = this._aSelections || [];
    for(var j=tracker.length-1; j>-1; j--) {
       if(YAHOO.lang.isString(tracker[j])){
            tracker.splice(j,1);
        }
    }

    // Update tracker
    this._aSelections = tracker;

    // Update UI
    this._unselectAllTrEls();

    //TODO: send an array of [{el:el,record:record}]
    //TODO: or convert this to an unselectRows method
    //TODO: that takes an array of rows or unselects all if none given
    this.fireEvent("unselectAllRowsEvent");
    YAHOO.log("Unselected all rows", "info", this.toString());
};

/**
 * Convenience method to remove the class YAHOO.widget.DataTable.CLASS_SELECTED
 * from all TD elements in the internal tracker.
 *
 * @method _unselectAllTdEls
 * @private
 */
YAHOO.widget.DataTable.prototype._unselectAllTdEls = function() {
    var selectedCells = YAHOO.util.Dom.getElementsByClassName(YAHOO.widget.DataTable.CLASS_SELECTED,"td",this._elTbody);
    YAHOO.util.Dom.removeClass(selectedCells, YAHOO.widget.DataTable.CLASS_SELECTED);
};

/**
 * Returns array of selected TD elements on the page.
 *
 * @method getSelectedTdEls
 * @return {HTMLElement[]} Array of selected TD elements.
 */
YAHOO.widget.DataTable.prototype.getSelectedTdEls = function() {
    return YAHOO.util.Dom.getElementsByClassName(YAHOO.widget.DataTable.CLASS_SELECTED,"td",this._elTbody);
};

/**
 * Sets given cell to the selected state.
 *
 * @method selectCell
 * @param cell {HTMLElement | String} DOM element reference or ID string
 * to DataTable page element or RecordSet index.
 */
YAHOO.widget.DataTable.prototype.selectCell = function(cell) {
/*TODO:
accept {record}
*/
    var elCell = this.getTdEl(cell);

    if(elCell) {
        var oRecord = this.getRecord(elCell);
        var sColumnId = elCell.yuiColumnId;

        if(oRecord && sColumnId) {
            // Get Record ID
            var tracker = this._aSelections || [];
            var sRecordId = oRecord.getId();

            // Remove if there
            for(var j=tracker.length-1; j>-1; j--) {
               if((tracker[j].recordId === sRecordId) && (tracker[j].columnId === sColumnId)){
                    tracker.splice(j,1);
                    break;
                }
            }

            // Add to the end
            tracker.push({recordId:sRecordId, columnId:sColumnId});

            // Update trackers
            this._aSelections = tracker;
            if(!this._oAnchorCell) {
                this._oAnchorCell = {record:oRecord, column:this.getColumnById(sColumnId)};
            }

            // Update the UI
            YAHOO.util.Dom.addClass(elCell, YAHOO.widget.DataTable.CLASS_SELECTED);

            this.fireEvent("cellSelectEvent", {record:oRecord, column:this.getColumnById(sColumnId), key: elCell.yuiColumnKey, el:elCell});
            YAHOO.log("Selected " + elCell, "info", this.toString());
            return;
        }
    }
    YAHOO.log("Could not select cell " + cell, "warn", this.toString());
};

/**
 * Sets given cell to the unselected state.
 *
 * @method unselectCell
 * @param cell {HTMLElement | String} DOM element reference or ID string
 * to DataTable page element or RecordSet index.
 */
YAHOO.widget.DataTable.prototype.unselectCell = function(cell) {
    var elCell = this.getTdEl(cell);

    if(elCell) {
        var oRecord = this.getRecord(elCell);
        var sColumnId = elCell.yuiColumnId;

        if(oRecord && sColumnId) {
            // Get Record ID
            var tracker = this._aSelections || [];
            var id = oRecord.getId();

            // Is it selected?
            for(var j=tracker.length-1; j>-1; j--) {
                if((tracker[j].recordId === id) && (tracker[j].columnId === sColumnId)){
                    // Remove from tracker
                    tracker.splice(j,1);

                    // Update tracker
                    this._aSelections = tracker;

                    // Update the UI
                    YAHOO.util.Dom.removeClass(elCell, YAHOO.widget.DataTable.CLASS_SELECTED);

                    this.fireEvent("cellUnselectEvent", {record:oRecord, column: this.getColumnById(sColumnId), key:elCell.yuiColumnKey, el:elCell});
                    YAHOO.log("Unselected " + elCell, "info", this.toString());
                    return;
                }
            }
        }
    }
    YAHOO.log("Could not unselect cell " + cell, "warn", this.toString());
};

/**
 * Clears out all cell selections.
 *
 * @method unselectAllCells
 */
YAHOO.widget.DataTable.prototype.unselectAllCells= function() {
    // Remove all cells from tracker
    var tracker = this._aSelections || [];
    for(var j=tracker.length-1; j>-1; j--) {
       if(tracker[j].constructor == Object){
            tracker.splice(j,1);
        }
    }

    // Update tracker
    this._aSelections = tracker;

    // Update UI
    this._unselectAllTdEls();

    //TODO: send data
    //TODO: or fire individual cellUnselectEvent
    this.fireEvent("unselectAllCellsEvent");
    YAHOO.log("Unselected all cells", "info", this.toString());
};

/**
 * Returns true if given item is selected, false otherwise.
 *
 * @method isSelected
 * @param o {String | HTMLElement | YAHOO.widget.Record | Number
 * {record:YAHOO.widget.Record, column:YAHOO.widget.Column} } TR or TD element by
 * reference or ID string, a Record instance, a RecordSet position index,
 * or an object literal representation
 * of a cell.
 * @return {Boolean} True if item is selected.
 */
YAHOO.widget.DataTable.prototype.isSelected = function(o) {
    var oRecord, sRecordId, j;

    var el = this.getTrEl(o) || this.getTdEl(o);
    if(el) {
        return YAHOO.util.Dom.hasClass(el,YAHOO.widget.DataTable.CLASS_SELECTED);
    }
    else {
        var tracker = this._aSelections;
        if(tracker && tracker.length > 0) {
            // Looking for a Record?
            if(o instanceof YAHOO.widget.Record) {
                oRecord = o;
            }
            else if(YAHOO.lang.isNumber(o)) {
                oRecord = this.getRecord(o);
            }
            if(oRecord) {
                sRecordId = oRecord.getId();

                // Is it there?
                // Use Array.indexOf if available...
                if(tracker.indexOf) {
                    if(tracker.indexOf(sRecordId) >  -1) {
                        return true;
                    }
                }
                // ...or do it the old-fashioned way
                else {
                    for(j=tracker.length-1; j>-1; j--) {
                       if(tracker[j] === sRecordId){
                        return true;
                       }
                    }
                }
            }
            // Looking for a cell
            else if(o.record && o.column){
                sRecordId = o.record.getId();
                var sColumnId = o.column.getId();

                for(j=tracker.length-1; j>-1; j--) {
                    if((tracker[j].recordId === sRecordId) && (tracker[j].columnId === sColumnId)){
                        return true;
                    }
                }
            }
        }
    }
    return false;
};

/**
 * Returns selected rows as an array of Record IDs.
 *
 * @method getSelectedRows
 * @return {String[]} Array of selected rows by Record ID.
 */
YAHOO.widget.DataTable.prototype.getSelectedRows = function() {
    var aSelectedRows = [];
    var tracker = this._aSelections || [];
    for(var j=0; j<tracker.length; j++) {
       if(YAHOO.lang.isString(tracker[j])){
            aSelectedRows.push(tracker[j]);
        }
    }
    return aSelectedRows;
};

/**
 * Returns selected cells as an array of object literals:
 *     {recordId:sRecordId, columnId:sColumnId}.
 *
 * @method getSelectedCells
 * @return {Object[]} Array of selected cells by Record ID and Column ID.
 */
YAHOO.widget.DataTable.prototype.getSelectedCells = function() {
    var aSelectedCells = [];
    var tracker = this._aSelections || [];
    for(var j=0; j<tracker.length; j++) {
       if(tracker[j] && (tracker[j].constructor == Object)){
            aSelectedCells.push(tracker[j]);
        }
    }
    return aSelectedCells;
};

/**
 * Returns last selected Record ID.
 *
 * @method getLastSelectedRecord
 * @return {String} Record ID of last selected row.
 */
YAHOO.widget.DataTable.prototype.getLastSelectedRecord = function() {
    var tracker = this._aSelections;
    if(tracker && tracker.length > 0) {
        for(var i=tracker.length-1; i>-1; i--) {
           if(YAHOO.lang.isString(tracker[i])){
                return tracker[i];
            }
        }
    }
};

/**
 * Returns last selected cell as an object literal:
 *     {recordId:sRecordId, columnId:sColumnId}.
 *
 * @method getLastSelectedCell
 * @return {Object} Object literal representation of a cell.
 */
YAHOO.widget.DataTable.prototype.getLastSelectedCell = function() {
    var tracker = this._aSelections;
    if(tracker && tracker.length > 0) {
        for(var i=tracker.length-1; i>-1; i--) {
           if(tracker[i].recordId && tracker[i].columnId){
                return tracker[i];
            }
        }
    }
};

/**
 * Assigns the class YAHOO.widget.DataTable.CLASS_HIGHLIGHTED to the given row.
 *
 * @method highlightRow
 * @param row {HTMLElement | String} DOM element reference or ID string.
 */
YAHOO.widget.DataTable.prototype.highlightRow = function(row) {
    var elRow = this.getTrEl(row);

    if(elRow) {
        // Make sure previous row is unhighlighted
        if(this._sLastHighlightedTrElId) {
            YAHOO.util.Dom.removeClass(this._sLastHighlightedTrElId,YAHOO.widget.DataTable.CLASS_HIGHLIGHTED);
        }
        var oRecord = this.getRecord(elRow);
        YAHOO.util.Dom.addClass(elRow,YAHOO.widget.DataTable.CLASS_HIGHLIGHTED);
        this._sLastHighlightedTrElId = elRow.id;
        this.fireEvent("rowHighlightEvent", {record:oRecord, el:elRow});
        YAHOO.log("Highlighted " + elRow, "info", this.toString());
        return;
    }
    YAHOO.log("Could not highlight row " + row, "warn", this.toString());
};

/**
 * Removes the class YAHOO.widget.DataTable.CLASS_HIGHLIGHTED from the given row.
 *
 * @method unhighlightRow
 * @param row {HTMLElement | String} DOM element reference or ID string.
 */
YAHOO.widget.DataTable.prototype.unhighlightRow = function(row) {
    var elRow = this.getTrEl(row);

    if(elRow) {
        var oRecord = this.getRecord(elRow);
        YAHOO.util.Dom.removeClass(elRow,YAHOO.widget.DataTable.CLASS_HIGHLIGHTED);
        this.fireEvent("rowUnhighlightEvent", {record:oRecord, el:elRow});
        YAHOO.log("Unhighlighted " + elRow, "info", this.toString());
        return;
    }
    YAHOO.log("Could not unhighlight row " + row, "warn", this.toString());
};

/**
 * Assigns the class YAHOO.widget.DataTable.CLASS_HIGHLIGHTED to the given cell.
 *
 * @method highlightCell
 * @param cell {HTMLElement | String} DOM element reference or ID string.
 */
YAHOO.widget.DataTable.prototype.highlightCell = function(cell) {
    var elCell = this.getTdEl(cell);

    if(elCell) {
        // Make sure previous cell is unhighlighted
        if(this._sLastHighlightedTdElId) {
            YAHOO.util.Dom.removeClass(this._sLastHighlightedTdElId,YAHOO.widget.DataTable.CLASS_HIGHLIGHTED);
        }

        var oRecord = this.getRecord(elCell);
        var sColumnId = elCell.yuiColumnId;
        YAHOO.util.Dom.addClass(elCell,YAHOO.widget.DataTable.CLASS_HIGHLIGHTED);
        this._sLastHighlightedTdElId = elCell.id;
        this.fireEvent("cellHighlightEvent", {record:oRecord, column:this.getColumnById(sColumnId), key:elCell.yuiColumnKey, el:elCell});
        YAHOO.log("Highlighted " + elCell, "info", this.toString());
        return;
    }
    YAHOO.log("Could not highlight cell " + cell, "warn", this.toString());
};

/**
 * Removes the class YAHOO.widget.DataTable.CLASS_HIGHLIGHTED from the given cell.
 *
 * @method unhighlightCell
 * @param cell {HTMLElement | String} DOM element reference or ID string.
 */
YAHOO.widget.DataTable.prototype.unhighlightCell = function(cell) {
    var elCell = this.getTdEl(cell);

    if(elCell) {
        var oRecord = this.getRecord(elCell);
        YAHOO.util.Dom.removeClass(elCell,YAHOO.widget.DataTable.CLASS_HIGHLIGHTED);
        this.fireEvent("cellUnhighlightEvent", {record:oRecord, column:this.getColumnById(elCell.yuiColumnId), key:elCell.yuiColumnKey, el:elCell});
        YAHOO.log("Unhighlighted " + elCell, "info", this.toString());
        return;
    }
    YAHOO.log("Could not unhighlight cell " + cell, "warn", this.toString());
};













































// INLINE EDITING

/**
 * Shows Cell Editor for given cell.
 *
 * @method showCellEditor
 * @param elCell {HTMLElement | String} Cell to edit.
 * @param oRecord {YAHOO.widget.Record} (Optional) Record instance.
 * @param oColumn {YAHOO.widget.Column} (Optional) Column instance.
 */
YAHOO.widget.DataTable.prototype.showCellEditor = function(elCell, oRecord, oColumn) {
    elCell = YAHOO.util.Dom.get(elCell);

    if(elCell && (elCell.ownerDocument === document)) {
        if(!oRecord || !(oRecord instanceof YAHOO.widget.Record)) {
            oRecord = this.getRecord(elCell);
        }
        if(!oColumn || !(oColumn instanceof YAHOO.widget.Column)) {
            oColumn = this.getColumn(elCell);
        }
        if(oRecord && oColumn) {
            var oCellEditor = this._oCellEditor;

            // Clear previous Editor
            if(oCellEditor.isActive) {
                this.cancelCellEditor();
            }

            // Editor not defined
            if(!oColumn.editor) {
                return;
            }

            // Update Editor values
            oCellEditor.cell = elCell;
            oCellEditor.record = oRecord;
            oCellEditor.column = oColumn;
            oCellEditor.validator = (oColumn.editorOptions &&
                    YAHOO.lang.isFunction(oColumn.editorOptions.validator)) ?
                    oColumn.editorOptions.validator : null;
            oCellEditor.value = oRecord.getData(oColumn.key);
            oCellEditor.defaultValue = null;

            // Move Editor
            var elContainer = oCellEditor.container;
            var x = YAHOO.util.Dom.getX(elCell);
            var y = YAHOO.util.Dom.getY(elCell);

            // SF doesn't get xy for cells in scrolling table
            // when tbody display is set to block
            if(isNaN(x) || isNaN(y)) {
                x = elCell.offsetLeft + // cell pos relative to table
                        YAHOO.util.Dom.getX(this._elTbody.parentNode) - // plus table pos relative to document
                        this._elTbody.scrollLeft; // minus tbody scroll
                y = elCell.offsetTop + // cell pos relative to table
                        YAHOO.util.Dom.getY(this._elTbody.parentNode) - // plus table pos relative to document
                        this._elTbody.scrollTop + // minus tbody scroll
                        this._elThead.offsetHeight; // account for fixed THEAD cells
            }

            elContainer.style.left = x + "px";
            elContainer.style.top = y + "px";

            // Hook to customize the UI
            this.doBeforeShowCellEditor(this._oCellEditor);

            //TODO: This is temporarily up here due so elements can be focused
            // Show Editor
            elContainer.style.display = "";

            // To enable ESC handling
            YAHOO.util.Event.addListener(elContainer, "click", function(e, oSelf) {
                oSelf.focus(elContainer);
            }, this);

            // Handle ESC key
            YAHOO.util.Event.addListener(elContainer, "keydown", function(e, oSelf) {
                // ESC hides Cell Editor
                if((e.keyCode == 27)) {
                    oSelf.cancelCellEditor();
                    oSelf.focusTbodyEl();
                }
                else {
                    oSelf.fireEvent("editorKeydownEvent", {editor:oSelf._oCellEditor, event:e});
                }
            }, this);

            // Render Editor markup
            var fnEditor;
            if(YAHOO.lang.isString(oColumn.editor)) {
                switch(oColumn.editor) {
                    case "checkbox":
                        fnEditor = YAHOO.widget.DataTable.editCheckbox;
                        break;
                    case "date":
                        fnEditor = YAHOO.widget.DataTable.editDate;
                        break;
                    case "dropdown":
                        fnEditor = YAHOO.widget.DataTable.editDropdown;
                        break;
                    case "radio":
                        fnEditor = YAHOO.widget.DataTable.editRadio;
                        break;
                    case "textarea":
                        fnEditor = YAHOO.widget.DataTable.editTextarea;
                        break;
                    case "textbox":
                        fnEditor = YAHOO.widget.DataTable.editTextbox;
                        break;
                    default:
                        fnEditor = null;
                }
            }
            else if(YAHOO.lang.isFunction(oColumn.editor)) {
                fnEditor = oColumn.editor;
            }

            if(fnEditor) {
                // Create DOM input elements
                fnEditor(this._oCellEditor, this);

                // Show Save/Cancel buttons
                if(!oColumn.editorOptions || !oColumn.editorOptions.disableBtns) {
                    this.showCellEditorBtns(elContainer);
                }

                oCellEditor.isActive = true;

                //TODO: verify which args to pass
                this.fireEvent("editorShowEvent", {editor:oCellEditor});
                YAHOO.log("Cell Editor shown for " + elCell, "info", this.toString());
                return;
            }
        }
    }
    YAHOO.log("Could not show Cell Editor for " + elCell, "warn", this.toString());
};

/**
 * Overridable abstract method to customize Cell Editor UI.
 *
 * @method doBeforeShowCellEditor
 * @param oCellEditor {Object} Cell Editor object literal.
 */
YAHOO.widget.DataTable.prototype.doBeforeShowCellEditor = function(oCellEditor) {
};

/**
 * Adds Save/Cancel buttons to Cell Editor.
 *
 * @method showCellEditorBtns
 * @param elContainer {HTMLElement} Cell Editor container.
 */
YAHOO.widget.DataTable.prototype.showCellEditorBtns = function(elContainer) {
    // Buttons
    var elBtnsDiv = elContainer.appendChild(document.createElement("div"));
    YAHOO.util.Dom.addClass(elBtnsDiv, YAHOO.widget.DataTable.CLASS_BUTTON);

    // Save button
    var elSaveBtn = elBtnsDiv.appendChild(document.createElement("button"));
    YAHOO.util.Dom.addClass(elSaveBtn, YAHOO.widget.DataTable.CLASS_DEFAULT);
    elSaveBtn.innerHTML = "OK";
    YAHOO.util.Event.addListener(elSaveBtn, "click", function(oArgs, oSelf) {
        oSelf.onEventSaveCellEditor(oArgs, oSelf);
        oSelf.focusTbodyEl();
    }, this, true);

    // Cancel button
    var elCancelBtn = elBtnsDiv.appendChild(document.createElement("button"));
    elCancelBtn.innerHTML = "Cancel";
    YAHOO.util.Event.addListener(elCancelBtn, "click", function(oArgs, oSelf) {
        oSelf.onEventCancelCellEditor(oArgs, oSelf);
        oSelf.focusTbodyEl();
    }, this, true);
};

/**
 * Clears Cell Editor of all state and UI.
 *
 * @method resetCellEditor
 */

YAHOO.widget.DataTable.prototype.resetCellEditor = function() {
    var elContainer = this._oCellEditor.container;
    elContainer.style.display = "none";
    YAHOO.util.Event.purgeElement(elContainer, true);
    elContainer.innerHTML = "";
    this._oCellEditor.value = null;
    this._oCellEditor.isActive = false;
};

/**
 * Saves Cell Editor input to Record.
 *
 * @method saveCellEditor
 */
YAHOO.widget.DataTable.prototype.saveCellEditor = function() {
    //TODO: Copy the editor's values to pass to the event
    if(this._oCellEditor.isActive) {
        var newData = this._oCellEditor.value;
        var oldData = this._oCellEditor.record.getData(this._oCellEditor.column.key);

        // Validate input data
        if(this._oCellEditor.validator) {
            newData = this._oCellEditor.value = this._oCellEditor.validator.call(this, newData, oldData, this._oCellEditor);
            if(newData === null ) {
                this.resetCellEditor();
                this.fireEvent("editorRevertEvent",
                        {editor:this._oCellEditor, oldData:oldData, newData:newData});
                YAHOO.log("Could not save Cell Editor input due to invalid data " +
                        YAHOO.lang.dump(newData), "warn", this.toString());
                return;
            }
        }

        // Update the Record
        this._oRecordSet.updateKey(this._oCellEditor.record, this._oCellEditor.column.key, this._oCellEditor.value);

        // Update the UI
        this.formatCell(this._oCellEditor.cell.firstChild);

        // Clear out the Cell Editor
        this.resetCellEditor();

        this.fireEvent("editorSaveEvent",
                {editor:this._oCellEditor, oldData:oldData, newData:newData});
        YAHOO.log("Cell Editor input saved", "info", this.toString());
    }
    else {
        YAHOO.log("Cell Editor not active to save input", "warn", this.toString());
    }
};

/**
 * Cancels Cell Editor.
 *
 * @method cancelCellEditor
 */
YAHOO.widget.DataTable.prototype.cancelCellEditor = function() {
    if(this._oCellEditor.isActive) {
        this.resetCellEditor();
        //TODO: preserve values for the event?
        this.fireEvent("editorCancelEvent", {editor:this._oCellEditor});
        YAHOO.log("Cell Editor input canceled", "info", this.toString());
    }
    else {
        YAHOO.log("Cell Editor not active to cancel input", "warn", this.toString());
    }
};

/**
 * Enables CHECKBOX Editor.
 *
 * @method editCheckbox
 * @param oEditor {Object} Object literal representation of Editor values.
 * @param oSelf {YAHOO.widget.DataTable} Reference back to DataTable instance.
 * @static
 */
//YAHOO.widget.DataTable.editCheckbox = function(elContainer, oRecord, oColumn, oEditor, oSelf) {
YAHOO.widget.DataTable.editCheckbox = function(oEditor, oSelf) {
    var elCell = oEditor.cell;
    var oRecord = oEditor.record;
    var oColumn = oEditor.column;
    var elContainer = oEditor.container;
    var aCheckedValues = oEditor.value;
    if(!YAHOO.lang.isArray(aCheckedValues)) {
        aCheckedValues = [aCheckedValues];
    }

    // Checkboxes
    if(oColumn.editorOptions && YAHOO.lang.isArray(oColumn.editorOptions.checkboxOptions)) {
        var checkboxOptions = oColumn.editorOptions.checkboxOptions;
        var checkboxValue, checkboxId, elLabel, j, k;
        // First create the checkbox buttons in an IE-friendly way
        for(j=0; j<checkboxOptions.length; j++) {
            checkboxValue = YAHOO.lang.isValue(checkboxOptions[j].label) ?
                    checkboxOptions[j].label : checkboxOptions[j];
            checkboxId =  oSelf.getId() + "-editor-checkbox" + j;
            elContainer.innerHTML += "<input type=\"checkbox\"" +
                    " name=\"" + oSelf.getId() + "-editor-checkbox\"" +
                    " value=\"" + checkboxValue + "\"" +
                    " id=\"" +  checkboxId + "\">";
            // Then create the labels in an IE-friendly way
            elLabel = elContainer.appendChild(document.createElement("label"));
            elLabel.htmlFor = checkboxId;
            elLabel.innerHTML = checkboxValue;
        }
        var aCheckboxEls = [];
        var checkboxEl;
        // Loop through checkboxes to check them
        for(j=0; j<checkboxOptions.length; j++) {
            checkboxEl = YAHOO.util.Dom.get(oSelf.getId() + "-editor-checkbox" + j);
            aCheckboxEls.push(checkboxEl);
            for(k=0; k<aCheckedValues.length; k++) {
                if(checkboxEl.value === aCheckedValues[k]) {
                    checkboxEl.checked = true;
                }
            }
            // Focus the first checkbox
            if(j===0) {
                oSelf._focusEl(checkboxEl);
            }
        }
        // Loop through checkboxes to assign click handlers
        for(j=0; j<checkboxOptions.length; j++) {
            checkboxEl = YAHOO.util.Dom.get(oSelf.getId() + "-editor-checkbox" + j);
            YAHOO.util.Event.addListener(checkboxEl, "click", function(){
                var aNewValues = [];
                for(var m=0; m<aCheckboxEls.length; m++) {
                    if(aCheckboxEls[m].checked) {
                        aNewValues.push(aCheckboxEls[m].value);
                    }
                }
                oSelf._oCellEditor.value = aNewValues;
                oSelf.fireEvent("editorUpdateEvent",{editor:oSelf._oCellEditor});
            });
        }
    }
};

/**
 * Enables Date Editor.
 *
 * @method editDate
 * @param oEditor {Object} Object literal representation of Editor values.
 * @param oSelf {YAHOO.widget.DataTable} Reference back to DataTable instance.
 * @static
 */
YAHOO.widget.DataTable.editDate = function(oEditor, oSelf) {
    var elCell = oEditor.cell;
    var oRecord = oEditor.record;
    var oColumn = oEditor.column;
    var elContainer = oEditor.container;
    var value = oEditor.value;
    
    // Set a default
    if(!(value instanceof Date)) {
        value = oEditor.defaultValue || new Date();
    }

    // Calendar widget
    if(YAHOO.widget.Calendar) {
        var selectedValue = (value.getMonth()+1)+"/"+value.getDate()+"/"+value.getFullYear();
        var calContainer = elContainer.appendChild(document.createElement("div"));
        var calPrefix = oColumn.getColEl();
        calContainer.id = calPrefix + "-dateContainer";
        var calendar =
                new YAHOO.widget.Calendar(calPrefix + "-date",
                calContainer.id,
                {selected:selectedValue, pagedate:value});
        calendar.render();
        calContainer.style.cssFloat = "none";

        if(YAHOO.env.ua.ie == 6) {
            var calFloatClearer = elContainer.appendChild(document.createElement("br"));
            calFloatClearer.style.clear = "both";
        }

        calendar.selectEvent.subscribe(function(type, args, obj) {
            oSelf._oCellEditor.value = new Date(args[0][0][0], args[0][0][1]-1, args[0][0][2]);
            oSelf.fireEvent("editorUpdateEvent",{editor:oSelf._oCellEditor});
        });
    }
    else {
        //TODO;
    }
};

/**
 * Enables SELECT Editor.
 *
 * @method editDropdown
 * @param oEditor {Object} Object literal representation of Editor values.
 * @param oSelf {YAHOO.widget.DataTable} Reference back to DataTable instance.
 * @static
 */
YAHOO.widget.DataTable.editDropdown = function(oEditor, oSelf) {
    var elCell = oEditor.cell;
    var oRecord = oEditor.record;
    var oColumn = oEditor.column;
    var elContainer = oEditor.container;
    var value = oEditor.value;
    
    // Set a default
    if(!YAHOO.lang.isValue(value)) {
        value = oEditor.defaultValue;
    }


    // Textbox
    var elDropdown = elContainer.appendChild(document.createElement("select"));
    var dropdownOptions = (oColumn.editorOptions && YAHOO.lang.isArray(oColumn.editorOptions.dropdownOptions)) ?
            oColumn.editorOptions.dropdownOptions : [];
    for(var j=0; j<dropdownOptions.length; j++) {
        var dropdownOption = dropdownOptions[j];
        var elOption = document.createElement("option");
        elOption.value = (YAHOO.lang.isValue(dropdownOption.value)) ?
                dropdownOption.value : dropdownOption;
        elOption.innerHTML = (YAHOO.lang.isValue(dropdownOption.text)) ?
                dropdownOption.text : dropdownOption;
        elOption = elDropdown.appendChild(elOption);
        if(value === elDropdown.options[j].value) {
            elDropdown.options[j].selected = true;
        }
    }

    // Set up a listener on each check box to track the input value
    YAHOO.util.Event.addListener(elDropdown, "change",
        function(){
            oSelf._oCellEditor.value = elDropdown[elDropdown.selectedIndex].value;
            oSelf.fireEvent("editorUpdateEvent",{editor:oSelf._oCellEditor});
    });

    // Focus the dropdown
    oSelf._focusEl(elDropdown);
};

/**
 * Enables INPUT TYPE=RADIO Editor.
 *
 * @method editRadio
 * @param oEditor {Object} Object literal representation of Editor values.
 * @param oSelf {YAHOO.widget.DataTable} Reference back to DataTable instance.
 * @static
 */
YAHOO.widget.DataTable.editRadio = function(oEditor, oSelf) {
    var elCell = oEditor.cell;
    var oRecord = oEditor.record;
    var oColumn = oEditor.column;
    var elContainer = oEditor.container;
    var value = oEditor.value;

    // Set a default
    if(!YAHOO.lang.isValue(value)) {
        value = oEditor.defaultValue;
    }

    // Radios
    if(oColumn.editorOptions && YAHOO.lang.isArray(oColumn.editorOptions.radioOptions)) {
        var radioOptions = oColumn.editorOptions.radioOptions;
        var radioValue, radioId, elLabel, j;
        // First create the radio buttons in an IE-friendly way
        for(j=0; j<radioOptions.length; j++) {
            radioValue = YAHOO.lang.isValue(radioOptions[j].label) ?
                    radioOptions[j].label : radioOptions[j];
            radioId =  oSelf.getId() + "-editor-radio" + j;
            elContainer.innerHTML += "<input type=\"radio\"" +
                    " name=\"" + oSelf.getId() + "-editor-radio\"" +
                    " value=\"" + radioValue + "\"" +
                    " id=\"" +  radioId + "\">";
            // Then create the labels in an IE-friendly way
            elLabel = elContainer.appendChild(document.createElement("label"));
            elLabel.htmlFor = radioId;
            elLabel.innerHTML = radioValue;
        }
        // Then check one, and assign click handlers
        for(j=0; j<radioOptions.length; j++) {
            var radioEl = YAHOO.util.Dom.get(oSelf.getId() + "-editor-radio" + j);
            if(value === radioEl.value) {
                radioEl.checked = true;
                oSelf._focusEl(radioEl);
            }
            YAHOO.util.Event.addListener(radioEl, "click",
                function(){
                    oSelf._oCellEditor.value = this.value;
                    oSelf.fireEvent("editorUpdateEvent",{editor:oSelf._oCellEditor});
            });
        }
    }
};

/**
 * Enables TEXTAREA Editor.
 *
 * @method editTextarea
 * @param oEditor {Object} Object literal representation of Editor values.
 * @param oSelf {YAHOO.widget.DataTable} Reference back to DataTable instance.
 * @static
 */
YAHOO.widget.DataTable.editTextarea = function(oEditor, oSelf) {
   var elCell = oEditor.cell;
   var oRecord = oEditor.record;
   var oColumn = oEditor.column;
   var elContainer = oEditor.container;
   var value = oEditor.value;

    // Set a default
    if(!YAHOO.lang.isValue(value)) {
        value = oEditor.defaultValue || "";
    }

    // Textarea
    var elTextarea = elContainer.appendChild(document.createElement("textarea"));
    elTextarea.style.width = elCell.offsetWidth + "px"; //(parseInt(elCell.offsetWidth,10)) + "px";
    elTextarea.style.height = "3em"; //(parseInt(elCell.offsetHeight,10)) + "px";
    elTextarea.value = value;

    // Set up a listener on each check box to track the input value
    YAHOO.util.Event.addListener(elTextarea, "keyup", function(){
        //TODO: set on a timeout
        oSelf._oCellEditor.value = elTextarea.value;
        oSelf.fireEvent("editorUpdateEvent",{editor:oSelf._oCellEditor});
    });

    // Select the text
    elTextarea.focus();
    elTextarea.select();
};

/**
 * Enables INPUT TYPE=TEXT Editor.
 *
 * @method editTextbox
 * @param oEditor {Object} Object literal representation of Editor values.
 * @param oSelf {YAHOO.widget.DataTable} Reference back to DataTable instance.
 * @static
 */
YAHOO.widget.DataTable.editTextbox = function(oEditor, oSelf) {
   var elCell = oEditor.cell;
   var oRecord = oEditor.record;
   var oColumn = oEditor.column;
   var elContainer = oEditor.container;
   var value = oEditor.value;

    // Set a default
    if(!YAHOO.lang.isValue(value)) {
        value = oEditor.defaultValue || "";
    }

    // Textbox
    var elTextbox = elContainer.appendChild(document.createElement("input"));
    elTextbox.type = "text";
    elTextbox.style.width = elCell.offsetWidth + "px"; //(parseInt(elCell.offsetWidth,10)) + "px";
    //elTextbox.style.height = "1em"; //(parseInt(elCell.offsetHeight,10)) + "px";
    elTextbox.value = value;

    // Set up a listener on each textbox to track the input value
    YAHOO.util.Event.addListener(elTextbox, "keyup", function(){
        //TODO: set on a timeout
        oSelf._oCellEditor.value = elTextbox.value;
        oSelf.fireEvent("editorUpdateEvent",{editor:oSelf._oCellEditor});
    });

    // Select the text
    elTextbox.focus();
    elTextbox.select();
};

/**
 * Validates Editor input value to type Number, doing type conversion as
 * necessary. A valid Number value is return, else the previous value is returned
 * if input value does not validate.
 *
 *
 * @method validateNumber
 * @param oData {Object} Data to validate.
 * @static
*/
YAHOO.widget.DataTable.validateNumber = function(oData) {
    //Convert to number
    var number = oData * 1;

    // Validate
    if(YAHOO.lang.isNumber(number)) {
        return number;
    }
    else {
        YAHOO.log("Could not validate data " + YAHOO.lang.dump(oData) + " to type Number", "warn", this.toString());
        return null;
    }
};

/**
 * Translates (proposed) DataTable state data into a form consumable by
 * DataSource sendRequest as the request parameter.  Use
 * set('generateParameter', yourFunc) to use a custom function rather than this
 * one.
 * @method _generateRequest
 * @param oData {Object} Object literal defining the current or proposed state
 * @param oDataTable {DataTable} Reference to the DataTable instance
 * @returns {MIXED} Returns appropriate value based on DataSource type
 * @private
 */
YAHOO.widget.DataTable._generateRequest = function (oData, oDataTable) {
    var request = oData;

    if (oData.pagination) {
        if (oDataTable._oDataSource.dataType === YAHOO.util.DataSource.TYPE_XHR) {
            request = ['?page=',        oData.pagination.page,
                       '&recordOffset=',oData.pagination.recordOffset,
                       '&rowsPerPage=', oData.pagination.rowsPerPage].join('');
        }
    }
    
    return request;
};






































// ABSTRACT METHODS

/**
 * Overridable method gives implementers a hook to access data before
 * it gets added to RecordSet and rendered to the TBODY.
 *
 * @method doBeforeLoadData
 * @param sRequest {String} Original request.
 * @param oResponse {Object} Response object.
 * @return {Boolean} Return true to continue loading data into RecordSet and
 * updating DataTable with new Records, false to cancel.
 */
YAHOO.widget.DataTable.prototype.doBeforeLoadData = function(sRequest, oResponse) {
    return true;
};































































/////////////////////////////////////////////////////////////////////////////
//
// Public Custom Event Handlers
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Overridable custom event handler to sort Column.
 *
 * @method onEventSortColumn
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 */
YAHOO.widget.DataTable.prototype.onEventSortColumn = function(oArgs) {
//TODO: support form elements in sortable columns
    var evt = oArgs.event;
    var target = oArgs.target;

    var el = this.getThEl(target) || this.getTdEl(target);
    if(el && el.yuiColumnKey) {
        var oColumn = this.getColumn(el.yuiColumnKey);
        if(oColumn.sortable) {
            YAHOO.util.Event.stopEvent(evt);
            this.sortColumn(oColumn);
        }
    }
    else {
        YAHOO.log("Could not find Column for " + target, "warn", this.toString());
    }
};

/**
 * Overridable custom event handler to manage selection according to desktop paradigm.
 *
 * @method onEventSelectRow
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 */
YAHOO.widget.DataTable.prototype.onEventSelectRow = function(oArgs) {
    var sMode = this.get("selectionMode");
    if(sMode == "single") {
        this._handleSingleSelectionByMouse(oArgs);
    }
    else {
        this._handleStandardSelectionByMouse(oArgs);
    }
};

/**
 * Overridable custom event handler to select cell.
 *
 * @method onEventSelectCell
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 */
YAHOO.widget.DataTable.prototype.onEventSelectCell = function(oArgs) {
    var sMode = this.get("selectionMode");
    if(sMode == "cellblock") {
        this._handleCellBlockSelectionByMouse(oArgs);
    }
    else if(sMode == "cellrange") {
        this._handleCellRangeSelectionByMouse(oArgs);
    }
    else {
        this._handleSingleCellSelectionByMouse(oArgs);
    }
};

/**
 * Overridable custom event handler to highlight row.
 *
 * @method onEventHighlightRow
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 */
YAHOO.widget.DataTable.prototype.onEventHighlightRow = function(oArgs) {
    this.highlightRow(oArgs.target);
};

/**
 * Overridable custom event handler to unhighlight row.
 *
 * @method onEventUnhighlightRow
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 */
YAHOO.widget.DataTable.prototype.onEventUnhighlightRow = function(oArgs) {
    this.unhighlightRow(oArgs.target);
};

/**
 * Overridable custom event handler to highlight cell.
 *
 * @method onEventHighlightCell
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 */
YAHOO.widget.DataTable.prototype.onEventHighlightCell = function(oArgs) {
    this.highlightCell(oArgs.target);
};

/**
 * Overridable custom event handler to unhighlight cell.
 *
 * @method onEventUnhighlightCell
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 */
YAHOO.widget.DataTable.prototype.onEventUnhighlightCell = function(oArgs) {
    this.unhighlightCell(oArgs.target);
};

/**
 * Overridable custom event handler to format cell.
 *
 * @method onEventFormatCell
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 */
YAHOO.widget.DataTable.prototype.onEventFormatCell = function(oArgs) {
    var target = oArgs.target;

    var elCell = this.getTdEl(target);
    if(elCell && elCell.yuiColumnKey) {
        var oColumn = this.getColumn(elCell.yuiColumnKey);
        this.formatCell(elCell.firstChild, this.getRecord(elCell), oColumn);
    }
    else {
        YAHOO.log("Could not format cell " + target, "warn", this.toString());
    }
};

/**
 * Overridable custom event handler to edit cell.
 *
 * @method onEventShowCellEditor
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 */
YAHOO.widget.DataTable.prototype.onEventShowCellEditor = function(oArgs) {
    var target = oArgs.target;

    var elCell = this.getTdEl(target);
    if(elCell) {
        this.showCellEditor(elCell);
    }
    else {
        YAHOO.log("Could not edit cell " + target, "warn", this.toString());
    }
};

/**
 * Overridable custom event handler to save Cell Editor input.
 *
 * @method onEventSaveCellEditor
 * @param oArgs.editor {Object} Cell Editor object literal.
 */
YAHOO.widget.DataTable.prototype.onEventSaveCellEditor = function(oArgs) {
    this.saveCellEditor();
};

/**
 * Overridable custom event handler to cancel Cell Editor.
 *
 * @method onEventCancelCellEditor
 * @param oArgs.editor {Object} Cell Editor object literal.
 */
YAHOO.widget.DataTable.prototype.onEventCancelCellEditor = function(oArgs) {
    this.cancelCellEditor();
};

/**
 * Callback function receives data from DataSource and populates an entire
 * DataTable with Records and TR elements, clearing previous Records, if any.
 *
 * @method onDataReturnInitializeTable
 * @param sRequest {String} Original request.
 * @param oResponse {Object} Response object.
 */
YAHOO.widget.DataTable.prototype.onDataReturnInitializeTable = function(sRequest, oResponse) {
    this.fireEvent("dataReturnEvent", {request:sRequest,response:oResponse});

    // Pass data through abstract method for any transformations
    var ok = this.doBeforeLoadData(sRequest, oResponse);

    // Data ok to populate
    if(ok && oResponse && !oResponse.error && YAHOO.lang.isArray(oResponse.results)) {
        // If paginating, set the number of total records if provided
        var oPaginator = this.get('paginator');
        if (oPaginator instanceof YAHOO.widget.Paginator && oResponse.totalRecords) {
            oPaginator.set('totalRecords',oResponse.totalRecords);
        }

        this.initializeTable(oResponse.results);
    }
    // Error
    else if(ok && oResponse && oResponse.error) {
        this.showTableMessage(YAHOO.widget.DataTable.MSG_ERROR, YAHOO.widget.DataTable.CLASS_ERROR);
    }
    // Empty
    else if(ok){
        this.showTableMessage(YAHOO.widget.DataTable.MSG_EMPTY, YAHOO.widget.DataTable.CLASS_EMPTY);
    }
};

/**
 * Callback function receives data from DataSource and appends to an existing
 * DataTable new Records and, if applicable, creates or updates
 * corresponding TR elements.
 *
 * @method onDataReturnAppendRows
 * @param sRequest {String} Original request.
 * @param oResponse {Object} Response object.
 * @param bError {Boolean} (optional) True if there was a data error.
 */
YAHOO.widget.DataTable.prototype.onDataReturnAppendRows = function(sRequest, oResponse) {
    this.fireEvent("dataReturnEvent", {request:sRequest,response:oResponse});

    // Pass data through abstract method for any transformations
    var ok = this.doBeforeLoadData(sRequest, oResponse);

    // Data ok to append
    if(ok && oResponse && !oResponse.error && YAHOO.lang.isArray(oResponse.results)) {
        this.addRows(oResponse.results);
    }
    // Error
    else if(ok && oResponse.error) {
        this.showTableMessage(YAHOO.widget.DataTable.MSG_ERROR, YAHOO.widget.DataTable.CLASS_ERROR);
    }
};

/**
 * Callback function receives data from DataSource and inserts into top of an
 * existing DataTable new Records and, if applicable, creates or updates
 * corresponding TR elements.
 *
 * @method onDataReturnInsertRows
 * @param sRequest {String} Original request.
 * @param oResponse {Object} Response object.
 * @param bError {Boolean} (optional) True if there was a data error.
 */
YAHOO.widget.DataTable.prototype.onDataReturnInsertRows = function(sRequest, oResponse) {
    this.fireEvent("dataReturnEvent", {request:sRequest,response:oResponse});

    // Pass data through abstract method for any transformations
    var ok = this.doBeforeLoadData(sRequest, oResponse);

    // Data ok to append
    if(ok && oResponse && !oResponse.error && YAHOO.lang.isArray(oResponse.results)) {
        this.addRows(oResponse.results, 0);
    }
    // Error
    else if(ok && oResponse.error) {
        this.showTableMessage(YAHOO.widget.DataTable.MSG_ERROR, YAHOO.widget.DataTable.CLASS_ERROR);
    }
};

/**
 * Receives reponse from DataSource and populates the RecordSet with the
 * results.
 * @method onDataReturnSetPageData
 * @param oRequest {MIXED} Original generated request.
 * @param oResponse {Object} Response object.
 * @param bError {Boolean} (optional) True if there was a data error.
 * @param oPayload {MIXED} (optional) Additional argument(s)
 */
YAHOO.widget.DataTable.prototype.onDataReturnSetPageData = function(oRequest, oResponse, bError, oPayload) {
    this.fireEvent("dataReturnEvent", {request:oRequest,response:oResponse});

    // Pass data through abstract method for any transformations
    var ok = this.doBeforeLoadData(oRequest, oResponse);

    // Data ok to set
    if(ok && oResponse && !(oResponse.error || bError) && YAHOO.lang.isArray(oResponse.results)) {
        var oState = oPayload.pagination;

        if (oState) {
            // Set the paginator values in preparation to refresh
            var oPaginator = this.get('paginator');
            if (oPaginator && oPaginator instanceof YAHOO.widget.Paginator) {
                oPaginator.set('recordOffset',oState.recordOffset);
                oPaginator.set('rowsPerPage',oState.rowsPerPage);
            }

            this._oRecordSet.setRecords(oResponse.results,oState.recordOffset);
        }

        this.render();
    }
    // Error
    else if(ok && (oResponse.error || bError)) {
        this.showTableMessage(YAHOO.widget.DataTable.MSG_ERROR, YAHOO.widget.DataTable.CLASS_ERROR);
    }
};



































    /////////////////////////////////////////////////////////////////////////////
    //
    // Custom Events
    //
    /////////////////////////////////////////////////////////////////////////////

    /**
     * Fired when the DataTable instance's initialization is complete.
     *
     * @event initEvent
     */

    /**
     * Fired when the DataTable's view is rendered.
     *
     * @event renderEvent
     */

    /**
     * Fired when data is returned from DataSource but before it is consumed by
     * DataTable.
     *
     * @event dataReturnEvent
     * @param oArgs.request {String} Original request.
     * @param oArgs.response {Object} Response object.
     */

    /**
     * Fired when the DataTable has a focus event.
     *
     * @event tableFocusEvent
     */

    /**
     * Fired when the DataTable THEAD element has a focus event.
     *
     * @event theadFocusEvent
     */

    /**
     * Fired when the DataTable TBODY element has a focus event.
     *
     * @event tbodyFocusEvent
     */

    /**
     * Fired when the DataTable has a blur event.
     *
     * @event tableBlurEvent
     */

    /*TODO
     * Fired when the DataTable THEAD element has a blur event.
     *
     * @event theadBlurEvent
     */

    /*TODO
     * Fired when the DataTable TBODY element has a blur event.
     *
     * @event tbodyBlurEvent
     */

    /**
     * Fired when the DataTable has a key event.
     *
     * @event tableKeyEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The DataTable's TABLE element.
     */

    /**
     * Fired when the DataTable THEAD element has a key event.
     *
     * @event theadKeyEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The DataTable's TABLE element.
     */

    /**
     * Fired when the DataTable TBODY element has a key event.
     *
     * @event tbodyKeyEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The DataTable's TABLE element.
     */

    /**
     * Fired when the DataTable has a mouseover.
     *
     * @event tableMouseoverEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The DataTable's TABLE element.
     *
     */

    /**
     * Fired when the DataTable has a mouseout.
     *
     * @event tableMouseoutEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The DataTable's TABLE element.
     *
     */

    /**
     * Fired when the DataTable has a mousedown.
     *
     * @event tableMousedownEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The DataTable's TABLE element.
     *
     */

    /**
     * Fired when the DataTable has a click.
     *
     * @event tableClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The DataTable's TABLE element.
     *
     */

    /**
     * Fired when the DataTable has a dblclick.
     *
     * @event tableDblclickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The DataTable's TABLE element.
     *
     */

    /**
     * Fired when a fixed scrolling DataTable has a scroll.
     *
     * @event tableScrollEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The DataTable's CONTAINER element (in IE)
     * or the DataTable's TBODY element (everyone else).
     *
     */

    /**
     * Fired when a message is shown in the DataTable's message element.
     *
     * @event tableMsgShowEvent
     * @param oArgs.html {String} The HTML displayed.
     * @param oArgs.className {String} The className assigned.
     *
     */

    /**
     * Fired when the DataTable's message element is hidden.
     *
     * @event tableMsgHideEvent
     */

    /**
     * Fired when a THEAD row has a mouseover.
     *
     * @event theadRowMouseoverEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TR element.
     */

    /**
     * Fired when a THEAD row has a mouseout.
     *
     * @event theadRowMouseoutEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TR element.
     */

    /**
     * Fired when a THEAD row has a mousedown.
     *
     * @event theadRowMousedownEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TR element.
     */

    /**
     * Fired when a THEAD row has a click.
     *
     * @event theadRowClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TR element.
     */

    /**
     * Fired when a THEAD row has a dblclick.
     *
     * @event theadRowDblclickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TR element.
     */

    /**
     * Fired when a THEAD cell has a mouseover.
     *
     * @event theadCellMouseoverEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TH element.
     *
     */

    /**
     * Fired when a THEAD cell has a mouseout.
     *
     * @event theadCellMouseoutEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TH element.
     *
     */

    /**
     * Fired when a THEAD cell has a mousedown.
     *
     * @event theadCellMousedownEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TH element.
     */

    /**
     * Fired when a THEAD cell has a click.
     *
     * @event theadCellClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TH element.
     */

    /**
     * Fired when a THEAD cell has a dblclick.
     *
     * @event theadCellDblclickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TH element.
     */

    /**
     * Fired when a THEAD label has a mouseover.
     *
     * @event theadLabelMouseoverEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The SPAN element.
     *
     */

    /**
     * Fired when a THEAD label has a mouseout.
     *
     * @event theadLabelMouseoutEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The SPAN element.
     *
     */

    /**
     * Fired when a THEAD label has a mousedown.
     *
     * @event theadLabelMousedownEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The SPAN element.
     */

    /**
     * Fired when a THEAD label has a click.
     *
     * @event theadLabelClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The SPAN element.
     */

    /**
     * Fired when a THEAD label has a dblclick.
     *
     * @event theadLabelDblclickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The SPAN element.
     */

    /**
     * Fired when a column is sorted.
     *
     * @event columnSortEvent
     * @param oArgs.column {YAHOO.widget.Column} The Column instance.
     * @param oArgs.dir {String} Sort direction "asc" or "desc".
     */

    /**
     * Fired when a column is resized.
     *
     * @event columnResizeEvent
     * @param oArgs.column {YAHOO.widget.Column} The Column instance.
     * @param oArgs.target {HTMLElement} The TH element.
     */

    /**
     * Fired when a column is hidden.
     *
     * @event columnHideEvent
     * @param oArgs.column {YAHOO.widget.Column} The Column instance.
     */

    /**
     * Fired when a column is shown.
     *
     * @event columnShowEvent
     * @param oArgs.column {YAHOO.widget.Column} The Column instance.
     */

    /**
     * Fired when a row has a mouseover.
     *
     * @event rowMouseoverEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TR element.
     */

    /**
     * Fired when a row has a mouseout.
     *
     * @event rowMouseoutEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TR element.
     */

    /**
     * Fired when a row has a mousedown.
     *
     * @event rowMousedownEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TR element.
     */

    /**
     * Fired when a row has a click.
     *
     * @event rowClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TR element.
     */

    /**
     * Fired when a row has a dblclick.
     *
     * @event rowDblclickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TR element.
     */

    /**
     * Fired when a row is added.
     *
     * @event rowAddEvent
     * @param oArgs.record {YAHOO.widget.Record} The added Record.
     */

    /**
     * Fired when a row is updated.
     *
     * @event rowUpdateEvent
     * @param oArgs.record {YAHOO.widget.Record} The updated Record.
     * @param oArgs.oldData {Object} Object literal of the old data.
     */

    /**
     * Fired when a row is deleted.
     *
     * @event rowDeleteEvent
     * @param oArgs.oldData {Object} Object literal of the deleted data.
     * @param oArgs.recordIndex {Number} Index of the deleted Record.
     * @param oArgs.trElIndex {Number} Index of the deleted TR element, if on current page.
     */

    /**
     * Fired when a row is selected.
     *
     * @event rowSelectEvent
     * @param oArgs.el {HTMLElement} The selected TR element, if applicable.
     * @param oArgs.record {YAHOO.widget.Record} The selected Record.
     */

    /**
     * Fired when a row is unselected.
     *
     * @event rowUnselectEvent
     * @param oArgs.el {HTMLElement} The unselected TR element, if applicable.
     * @param oArgs.record {YAHOO.widget.Record} The unselected Record.
     */

    /*TODO: delete and use rowUnselectEvent?
     * Fired when all row selections are cleared.
     *
     * @event unselectAllRowsEvent
     */

    /*
     * Fired when a row is highlighted.
     *
     * @event rowHighlightEvent
     * @param oArgs.el {HTMLElement} The highlighted TR element.
     * @param oArgs.record {YAHOO.widget.Record} The highlighted Record.
     */

    /*
     * Fired when a row is unhighlighted.
     *
     * @event rowUnhighlightEvent
     * @param oArgs.el {HTMLElement} The highlighted TR element.
     * @param oArgs.record {YAHOO.widget.Record} The highlighted Record.
     */

    /**
     * Fired when a cell has a mouseover.
     *
     * @event cellMouseoverEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TD element.
     */

    /**
     * Fired when a cell has a mouseout.
     *
     * @event cellMouseoutEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TD element.
     */

    /**
     * Fired when a cell has a mousedown.
     *
     * @event cellMousedownEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TD element.
     */

    /**
     * Fired when a cell has a click.
     *
     * @event cellClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TD element.
     */

    /**
     * Fired when a cell has a dblclick.
     *
     * @event cellDblclickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TD element.
     */

    /**
     * Fired when a cell is formatted.
     *
     * @event cellFormatEvent
     * @param oArgs.el {HTMLElement} The formatted TD element.
     * @param oArgs.record {YAHOO.widget.Record} The associated Record instance.
     * @param oArgs.column {YAHOO.widget.Column} The associated Column instance.
     * @param oArgs.key {String} (deprecated) The key of the formatted cell.
     */

    /**
     * Fired when a cell is selected.
     *
     * @event cellSelectEvent
     * @param oArgs.el {HTMLElement} The selected TD element.
     * @param oArgs.record {YAHOO.widget.Record} The associated Record instance.
     * @param oArgs.column {YAHOO.widget.Column} The associated Column instance.
     * @param oArgs.key {String} (deprecated) The key of the selected cell.
     */

    /**
     * Fired when a cell is unselected.
     *
     * @event cellUnselectEvent
     * @param oArgs.el {HTMLElement} The unselected TD element.
     * @param oArgs.record {YAHOO.widget.Record} The associated Record.
     * @param oArgs.column {YAHOO.widget.Column} The associated Column instance.
     * @param oArgs.key {String} (deprecated) The key of the unselected cell.

     */

    /**
     * Fired when a cell is highlighted.
     *
     * @event cellHighlightEvent
     * @param oArgs.el {HTMLElement} The highlighted TD element.
     * @param oArgs.record {YAHOO.widget.Record} The associated Record instance.
     * @param oArgs.column {YAHOO.widget.Column} The associated Column instance.
     * @param oArgs.key {String} (deprecated) The key of the highlighted cell.

     */

    /**
     * Fired when a cell is unhighlighted.
     *
     * @event cellUnhighlightEvent
     * @param oArgs.el {HTMLElement} The unhighlighted TD element.
     * @param oArgs.record {YAHOO.widget.Record} The associated Record instance.
     * @param oArgs.column {YAHOO.widget.Column} The associated Column instance.
     * @param oArgs.key {String} (deprecated) The key of the unhighlighted cell.

     */

    /*TODO: hide from doc and use cellUnselectEvent
     * Fired when all cell selections are cleared.
     *
     * @event unselectAllCellsEvent
     */

    /*TODO: implement
     * Fired when DataTable paginator is updated.
     *
     * @event paginatorUpdateEvent
     * @param paginator {Object} Object literal of Paginator values.
     */

    /**
     * Fired when an Editor is activated.
     *
     * @event editorShowEvent
     * @param oArgs.editor {Object} The Editor object literal.
     */

    /**
     * Fired when an active Editor has a keydown.
     *
     * @event editorKeydownEvent
     * @param oArgs.editor {Object} The Editor object literal.
     * @param oArgs.event {HTMLEvent} The event object.
     */

    /**
     * Fired when Editor input is reverted.
     *
     * @event editorRevertEvent
     * @param oArgs.editor {Object} The Editor object literal.
     * @param oArgs.newData {Object} New data value.
     * @param oArgs.oldData {Object} Old data value.
     */

    /**
     * Fired when Editor input is saved.
     *
     * @event editorSaveEvent
     * @param oArgs.editor {Object} The Editor object literal.
     * @param oArgs.newData {Object} New data value.
     * @param oArgs.oldData {Object} Old data value.
     */

    /**
     * Fired when Editor input is canceled.
     *
     * @event editorCancelEvent
     * @param oArgs.editor {Object} The Editor object literal.
     */

    /**
     * Fired when an active Editor has a blur.
     *
     * @event editorBlurEvent
     * @param oArgs.editor {Object} The Editor object literal.
     */







    /**
     * Fired when a link is clicked.
     *
     * @event linkClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The A element.
     */

    /**
     * Fired when a BUTTON element is clicked.
     *
     * @event buttonClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The BUTTON element.
     */

    /**
     * Fired when a CHECKBOX element is clicked.
     *
     * @event checkboxClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The CHECKBOX element.
     */

    /*TODO
     * Fired when a SELECT element is changed.
     *
     * @event dropdownChangeEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The SELECT element.
     */

    /**
     * Fired when a RADIO element is clicked.
     *
     * @event radioClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The RADIO element.
     */


























/////////////////////////////////////////////////////////////////////////////
//
// Deprecated APIs
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Use getTbodyEl().
 *
 * @method getBody
 * @deprecated
 */
YAHOO.widget.DataTable.prototype.getBody = function() {
    // Backward compatibility
    YAHOO.log("The method getBody() has been deprecated" +
            " in favor of getTbodyEl()", "warn", this.toString());
    return this.getTbodyEl();
};

/**
 * Use getTrEl().
 *
 * @method getRow
 * @deprecated
 */
YAHOO.widget.DataTable.prototype.getRow = function(index) {
    // Backward compatibility
    YAHOO.log("The method getRow() has been deprecated" +
            " in favor of getTrEl()", "warn", this.toString());
    return this.getTrEl(index);
};

/**
 * Use render.
 *
 * @method refreshView
 * @deprecated
 */
YAHOO.widget.DataTable.prototype.refreshView = function() {
    // Backward compatibility
    YAHOO.log("The method refreshView() has been deprecated" +
            " in favor of render()", "warn", this.toString());
    this.render();
};

/**
 * Use selectRow.
 *
 * @method select
 * @deprecated
 */
YAHOO.widget.DataTable.prototype.select = function(els) {
    // Backward compatibility
    YAHOO.log("The method select() has been deprecated" +
            " in favor of selectRow()", "warn", this.toString());
    if(!YAHOO.lang.isArray(els)) {
        els = [els];
    }
    for(var i=0; i<els.length; i++) {
        this.selectRow(els[i]);
    }
};

/**
 * Use Paginator class APIs.
 *
 * @method updatePaginator
 * @deprecated
 */
YAHOO.widget.DataTable.prototype.updatePaginator = function(oNewValues) {
    // Complete the set (default if not present)
    var oValidPaginator = this.get("paginator");

    var nOrigCurrentPage = oValidPaginator.currentPage;
    for(var param in oNewValues) {
        if(YAHOO.lang.hasOwnProperty(oValidPaginator, param)) {
            oValidPaginator[param] = oNewValues[param];
        }
    }

    oValidPaginator.totalRecords = this._oRecordSet.getLength();
    oValidPaginator.rowsThisPage = Math.min(oValidPaginator.rowsPerPage, oValidPaginator.totalRecords);
    oValidPaginator.totalPages = Math.ceil(oValidPaginator.totalRecords / oValidPaginator.rowsThisPage);
    if(isNaN(oValidPaginator.totalPages)) {
        oValidPaginator.totalPages = 0;
    }
    if(oValidPaginator.currentPage > oValidPaginator.totalPages) {
        if(oValidPaginator.totalPages < 1) {
            oValidPaginator.currentPage = 1;
        }
        else {
            oValidPaginator.currentPage = oValidPaginator.totalPages;
        }
    }

    if(oValidPaginator.currentPage !== nOrigCurrentPage) {
        oValidPaginator.startRecordIndex = (oValidPaginator.currentPage-1)*oValidPaginator.rowsPerPage;
    }


    this.set("paginator", oValidPaginator);
    return this.get("paginator");
};

/**
 * Use Paginator class APIs.
 *
 * @method showPage
 * @deprecated
 */
YAHOO.widget.DataTable.prototype.showPage = function(nPage) {
    var oPaginator = this.get('paginator');
    // Validate input
    if(!YAHOO.lang.isNumber(nPage) || (nPage < 1)) {
        if (oPaginator instanceof YAHOO.widget.Paginator) {
            if (!oPaginator.hasPage(nPage)) {
                nPage = 1;
            }
        } else if (nPage > oPaginator.totalPages) {
            nPage = 1;
        }
    }

    if (oPaginator instanceof YAHOO.widget.Paginator) {
        oPaginator.setPage(nPage);
    } else {
        this.updatePaginator({currentPage:nPage});
    }
    this.render();
};

/**
 * Use Paginator class APIs.
 *
 * @method formatPaginators
 * @deprecated
 */
 YAHOO.widget.DataTable.prototype.formatPaginators = function() {
    var pag = this.get("paginator");
    if (pag instanceof YAHOO.widget.Paginator) {
        pag.update();
        return;
    }

    var i;

    // For Opera workaround
    var dropdownEnabled = false;

    // Links are enabled
    if(pag.pageLinks > -1) {
        for(i=0; i<pag.links.length; i++) {
            this.formatPaginatorLinks(pag.links[i], pag.currentPage, pag.pageLinksStart, pag.pageLinks, pag.totalPages);
        }
    }

    // Dropdown is enabled
    for(i=0; i<pag.dropdowns.length; i++) {
         if(pag.dropdownOptions) {
            dropdownEnabled = true;
            this.formatPaginatorDropdown(pag.dropdowns[i], pag.dropdownOptions);
        }
        else {
            pag.dropdowns[i].style.display = "none";
        }
    }

    // For Opera artifacting in dropdowns
    if(dropdownEnabled && YAHOO.env.ua.opera) {
        document.body.style += '';
    }
    YAHOO.log("Paginators formatted", "info", this.toString());
};

/**
 * Use Paginator class APIs.
 *
 * @method formatPaginatorDropdown
 * @deprecated
 */
YAHOO.widget.DataTable.prototype.formatPaginatorDropdown = function(elDropdown, dropdownOptions) {
    if(elDropdown && (elDropdown.ownerDocument == document)) {
        // Clear OPTION elements
        while (elDropdown.firstChild) {
            elDropdown.removeChild(elDropdown.firstChild);
        }

        // Create OPTION elements
        for(var j=0; j<dropdownOptions.length; j++) {
            var dropdownOption = dropdownOptions[j];
            var optionEl = document.createElement("option");
            optionEl.value = (YAHOO.lang.isValue(dropdownOption.value)) ?
                    dropdownOption.value : dropdownOption;
            optionEl.innerHTML = (YAHOO.lang.isValue(dropdownOption.text)) ?
                    dropdownOption.text : dropdownOption;
            optionEl = elDropdown.appendChild(optionEl);
        }

        var options = elDropdown.options;
        // Update dropdown's "selected" value
        if(options.length) {
            for(var i=options.length-1; i>-1; i--) {
                if((this.get("paginator").rowsPerPage + "") === options[i].value) {
                    options[i].selected = true;
                }
            }
        }

        // Show the dropdown
        elDropdown.style.display = "";
        return;
    }
    YAHOO.log("Could not update Paginator dropdown " + elDropdown, "error", this.toString());
};

/**
 * Use Paginator class APIs.
 *
 * @method formatPaginatorLinks
 * @deprecated
 */
YAHOO.widget.DataTable.prototype.formatPaginatorLinks = function(elContainer, nCurrentPage, nPageLinksStart, nPageLinksLength, nTotalPages) {
    if(elContainer && (elContainer.ownerDocument == document) &&
            YAHOO.lang.isNumber(nCurrentPage) && YAHOO.lang.isNumber(nPageLinksStart) &&
            YAHOO.lang.isNumber(nTotalPages)) {
        // Set up markup for first/last/previous/next
        var bIsFirstPage = (nCurrentPage == 1) ? true : false;
        var bIsLastPage = (nCurrentPage == nTotalPages) ? true : false;
        var sFirstLinkMarkup = (bIsFirstPage) ?
                " <span class=\"" + YAHOO.widget.DataTable.CLASS_DISABLED +
                " " + YAHOO.widget.DataTable.CLASS_FIRST + "\">&lt;&lt;</span> " :
                " <a href=\"#\" class=\"" + YAHOO.widget.DataTable.CLASS_FIRST + "\">&lt;&lt;</a> ";
        var sPrevLinkMarkup = (bIsFirstPage) ?
                " <span class=\"" + YAHOO.widget.DataTable.CLASS_DISABLED +
                " " + YAHOO.widget.DataTable.CLASS_PREVIOUS + "\">&lt;</span> " :
                " <a href=\"#\" class=\"" + YAHOO.widget.DataTable.CLASS_PREVIOUS + "\">&lt;</a> " ;
        var sNextLinkMarkup = (bIsLastPage) ?
                " <span class=\"" + YAHOO.widget.DataTable.CLASS_DISABLED +
                " " + YAHOO.widget.DataTable.CLASS_NEXT + "\">&gt;</span> " :
                " <a href=\"#\" class=\"" + YAHOO.widget.DataTable.CLASS_NEXT + "\">&gt;</a> " ;
        var sLastLinkMarkup = (bIsLastPage) ?
                " <span class=\"" + YAHOO.widget.DataTable.CLASS_DISABLED +
                " " + YAHOO.widget.DataTable.CLASS_LAST +  "\">&gt;&gt;</span> " :
                " <a href=\"#\" class=\"" + YAHOO.widget.DataTable.CLASS_LAST + "\">&gt;&gt;</a> ";

        // Start with first and previous
        var sMarkup = sFirstLinkMarkup + sPrevLinkMarkup;

        // Ok to show all links
        var nMaxLinks = nTotalPages;
        var nFirstLink = 1;
        var nLastLink = nTotalPages;

        if(nPageLinksLength > 0) {
        // Calculate how many links to show
            nMaxLinks = (nPageLinksStart+nPageLinksLength < nTotalPages) ?
                    nPageLinksStart+nPageLinksLength-1 : nTotalPages;

            // Try to keep the current page in the middle
            nFirstLink = (nCurrentPage - Math.floor(nMaxLinks/2) > 0) ? nCurrentPage - Math.floor(nMaxLinks/2) : 1;
            nLastLink = (nCurrentPage + Math.floor(nMaxLinks/2) <= nTotalPages) ? nCurrentPage + Math.floor(nMaxLinks/2) : nTotalPages;

            // Keep the last link in range
            if(nFirstLink === 1) {
                nLastLink = nMaxLinks;
            }
            // Keep the first link in range
            else if(nLastLink === nTotalPages) {
                nFirstLink = nTotalPages - nMaxLinks + 1;
            }

            // An even number of links can get funky
            if(nLastLink - nFirstLink === nMaxLinks) {
                nLastLink--;
            }
      }

        // Generate markup for each page
        for(var i=nFirstLink; i<=nLastLink; i++) {
            if(i != nCurrentPage) {
                sMarkup += " <a href=\"#\" class=\"" + YAHOO.widget.DataTable.CLASS_PAGE + "\">" + i + "</a> ";
            }
            else {
                sMarkup += " <span class=\"" + YAHOO.widget.DataTable.CLASS_SELECTED + "\">" + i + "</span>";
            }
        }
        sMarkup += sNextLinkMarkup + sLastLinkMarkup;
        elContainer.innerHTML = sMarkup;
        return;
    }
    YAHOO.log("Could not format Paginator links", "error", this.toString());
};

/**
 * Use Paginator class APIs.
 *
 * @method _onPaginatorLinkClick
 * @deprecated
 */
YAHOO.widget.DataTable.prototype._onPaginatorLinkClick = function(e, oSelf) {
    // Backward compatibility
    var elTarget = YAHOO.util.Event.getTarget(e);
    var elTag = elTarget.tagName.toLowerCase();

    if(oSelf._oCellEditor && oSelf._oCellEditor.isActive) {
        oSelf.fireEvent("editorBlurEvent", {editor:oSelf._oCellEditor});
    }

    while(elTarget && (elTag != "table")) {
        switch(elTag) {
            case "body":
                return;
            case "a":
                YAHOO.util.Event.stopEvent(e);
                //TODO: after the showPage call, figure out which link
                //TODO: was clicked and reset focus to the new version of it
                //TODO: support multiple custom classnames
                switch(elTarget.className) {
                    case YAHOO.widget.DataTable.CLASS_PAGE:
                        oSelf.showPage(parseInt(elTarget.innerHTML,10));
                        return;
                    case YAHOO.widget.DataTable.CLASS_FIRST:
                        oSelf.showPage(1);
                        return;
                    case YAHOO.widget.DataTable.CLASS_LAST:
                        oSelf.showPage(oSelf.get("paginator").totalPages);
                        return;
                    case YAHOO.widget.DataTable.CLASS_PREVIOUS:
                        oSelf.showPage(oSelf.get("paginator").currentPage - 1);
                        return;
                    case YAHOO.widget.DataTable.CLASS_NEXT:
                        oSelf.showPage(oSelf.get("paginator").currentPage + 1);
                        return;
                }
                break;
            default:
                return;
        }
        elTarget = elTarget.parentNode;
        if(elTarget) {
            elTag = elTarget.tagName.toLowerCase();
        }
        else {
            return;
        }
    }
};

/**
 * Use Paginator class APIs.
 *
 * @method _onPaginatorDropdownChange
 * @deprecated
 */
YAHOO.widget.DataTable.prototype._onPaginatorDropdownChange = function(e, oSelf) {
    // Backward compatibility
    var elTarget = YAHOO.util.Event.getTarget(e);
    var newValue = elTarget[elTarget.selectedIndex].value;

    var newRowsPerPage = YAHOO.lang.isValue(parseInt(newValue,10)) ? parseInt(newValue,10) : null;
    if(newRowsPerPage !== null) {
        var newStartRecordIndex = (oSelf.get("paginator").currentPage-1) * newRowsPerPage;
        oSelf.updatePaginator({rowsPerPage:newRowsPerPage, startRecordIndex:newStartRecordIndex});
        oSelf.render();
    }
    else {
        YAHOO.log("Could not paginate with " + newValue + " rows per page", "error", oSelf.toString());
    }
};

/**
 * Use onEventShowCellEditor.
 *
 * @method onEventEditCell
 * @deprecated
 */
YAHOO.widget.DataTable.prototype.onEventEditCell = function(oArgs) {
    // Backward compatibility
    YAHOO.log("The method onEventEditCell() has been deprecated" +
        " in favor of onEventShowCellEditor()", "warn", this.toString());
    this.onEventShowCellEditor(oArgs);
};

/**
 * Use onDataReturnInitializeTable.
 *
 * @method onDataReturnReplaceRows
 * @deprecated
 */
YAHOO.widget.DataTable.prototype.onDataReturnReplaceRows = function(sRequest, oResponse) {
    // Backward compatibility
    YAHOO.log("The method onDataReturnReplaceRows() has been deprecated" +
            " in favor of onDataReturnInitializeTable()", "warn", this.toString());
    this.onDataReturnInitializeTable(sRequest, oResponse);
};

/**
 * Use theadRowMouseoverEvent.
 *
 * @event headerRowMouseoverEvent
 * @deprecated
 */

/**
 * Use theadRowMouseoutEvent.
 *
 * @event headerRowMouseoutEvent
 * @deprecated
 */

/**
 * Use theadRowMousedownEvent.
 *
 * @event headerRowMousedownEvent
 * @deprecated
 */

/**
 * Use theadRowClickEvent.
 *
 * @event headerRowClickEvent
 * @deprecated
 */

/**
 * Use theadRowDblclickEvent.
 *
 * @event headerRowDblclickEvent
 * @deprecated
 */

/**
 * Use theadCellMouseoverEvent.
 *
 * @event headerCellMouseoverEvent
 * @deprecated
 */

/**
 * Use headerCellMouseoutEvent.
 *
 * @event theadCellMouseoutEvent
 * @deprecated
 */

/**
 * Use theadCellMousedownEvent.
 *
 * @event headerCellMousedownEvent
 * @deprecated
 */

/**
 * Use theadCellClickEvent.
 *
 * @event headerCellClickEvent
 * @deprecated
 */

/**
 * Use theadCellDblclickEvent.
 *
 * @event headerCellDblclickEvent
 * @deprecated
 */

/**
 * Use theadLabelMouseoverEvent.
 *
 * @event headerLabelMouseoverEvent
 * @deprecated
 */

/**
 * Use theadLabelMouseoutEvent.
 *
 * @event headerLabelMouseoutEvent
 * @deprecated
 */

/**
 * Use theadLabelMousedownEvent.
 *
 * @event headerLabelMousedownEvent
 * @deprecated
 */

/**
 * Use theadLabelClickEvent.
 *
 * @event headerLabelClickEvent
 * @deprecated
 */

/**
 * Use theadLabelDblclickEvent.
 *
 * @event headerLabelClickEvent
 * @deprecated
 */


