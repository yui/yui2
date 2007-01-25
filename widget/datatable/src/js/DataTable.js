 /**
 * The DataTable widget provides a progressively enhanced DHTML control for
 * displaying tabular data across A-grade browsers.
 *
 * @module datatable
 * @requires datasource
 * @title DataTable Widget
 */

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

 /**
 * DataTable class for the YUI DataTable widget.
 *
 * @class DataTable
 * @uses YAHOO.util.EventProvider
 * @constructor
 * @param elContainer {HTMLElement} Container element for the TABLE.
 * @param oColumnset {YAHOO.widget.Columnset} Columnset instance.
 * @param oDataSource {YAHOO.widget.DataSource} DataSource instance.
 * @param oConfigs {object} (optional) Object literal of configuration values.
 */
YAHOO.widget.DataTable = function(elContainer,oColumnset,oDataSource,oConfigs) {
    // Internal vars
    this._nIndex = YAHOO.widget.DataTable._nCount;
    this._sName = "instance" + this._nIndex;
    this.id = "yui-dt"+this._nIndex;

    // Validate configs
    if(typeof oConfigs == "object") {
        for(var sConfig in oConfigs) {
            this[sConfig] = oConfigs[sConfig];
        }
    }

    // Validate DataSource
    if(oDataSource && (oDataSource instanceof YAHOO.widget.DataSource)) {
        this.dataSource = oDataSource;
    }

    // Validate Columnset
    if(oColumnset && (oColumnset instanceof YAHOO.widget.Columnset)) {
        this._oColumnset = oColumnset;
    }
    else {
        YAHOO.log("Could not instantiate DataTable due to an invalid Columnset", "error", this.toString());
        return;
    }

    // Create Recordset
    this._oRecordset = new YAHOO.widget.Recordset();

    // Validate HTML Element
    elContainer = YAHOO.util.Dom.get(elContainer);
    if(elContainer && (elContainer.nodeName.toLowerCase() == "div")) {
        this._elContainer = elContainer;
        // Peek in container child nodes to see if TABLE already exists
        var elTable = null;
        if(elContainer.hasChildNodes()) {
            var children = elContainer.childNodes;
            for(var i=0; i<children.length; i++) {
                if(children[i].nodeName.toLowerCase() == "table") {
                    elTable = children[i];
                    break;
                }
            }
        }

        // Progressively enhance an existing table from markup
        if(elTable) {
            // Fill Recordset with data parsed out of table
            var aRecords = [];

            // Iterate through each TBODY
            for(var j=0; j<elTable.tBodies.length; j++) {
                var elBody = elTable.tBodies[j];

                // Iterate through each TR
                for(var k=0; k<elBody.rows.length; k++) {
                    var elRow = elBody.rows[k];
                    var oRecord = {};

                    // Iterate through each TD
                    for(var l=0; l<elRow.cells.length; l++) {

                        //var elCell = elRow.cells[l];
                        //elCell.id = this.id+"-bdrow"+k+"-cell"+l;
                        oRecord[oColumnset.keys[l].key] = oColumnset.keys[l].parse(elRow.cells[l].innerHTML);
                    }
                    aRecords.push(oRecord);
                }

            }
            this._oRecordset.addRecords(aRecords);

            // Then re-do the markup
            this._initTable();
            this.appendRows(this._oRecordset.getRecords());
        }
        // Create markup from scratch
        else {
            this._initTable();
            // Send out for data in an asynchronous request
            oDataSource.sendRequest(this.initialRequest, this.onDataReturnAppendRows, this);
        }
    }
    // Container element not found in document
    else {
        YAHOO.log("Could not instantiate DataTable due to an invalid container element", "error", this.toString());
        return;
    }

    // Set up sort
    this.subscribe("headCellClickEvent",this.onEventSortColumn);

    // Set up context menu
    //TODO: does trigger have to exist? can trigger be TBODY rather than rows?
    if(this.contextMenu && this.contextMenuOptions) {
        this.contextMenu = new YAHOO.widget.ContextMenu(this.id+"-cm", { trigger: this._elBody.rows } );
        this.contextMenu.addItem("delete item");
        this.contextMenu.render(document.body);
    }

    // Set up event model
    elTable = this._elTable;
    /////////////////////////////////////////////////////////////////////////////
    //
    // DOM Events
    //
    /////////////////////////////////////////////////////////////////////////////
    //YAHOO.util.Event.addListener(this._elContainer, "focus", this._onFocus, this);
    YAHOO.util.Event.addListener(elTable, "click", this._onClick, this);
    YAHOO.util.Event.addListener(elTable, "dblclick", this._onDoubleclick, this);
    YAHOO.util.Event.addListener(elTable, "mouseout", this._onMouseout, this);
    YAHOO.util.Event.addListener(elTable, "mouseover", this._onMouseover, this);
    YAHOO.util.Event.addListener(elTable, "mousedown", this._onMousedown, this);
    //YAHOO.util.Event.addListener(elTable, "mouseup", this._onMouseup, this);
    //YAHOO.util.Event.addListener(elTable, "mousemove", this._onMousemove, this);
    YAHOO.util.Event.addListener(elTable, "keydown", this._onKeydown, this);
    //YAHOO.util.Event.addListener(elTable, "keypress", this._onKeypress, this);
    YAHOO.util.Event.addListener(document, "keyup", this._onKeyup, this);
    //YAHOO.util.Event.addListener(elTable, "focus", this._onFocus, this);
    YAHOO.util.Event.addListener(elTable, "blur", this._onBlur, this);

    /////////////////////////////////////////////////////////////////////////////
    //
    // Custom Events
    //
    /////////////////////////////////////////////////////////////////////////////

    /**
     * Fired when a mouseover occurs on a TD element.
     *
     * @event cellMouseoverEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TD element.
     */
    this.createEvent("cellMouseoverEvent");

    /**
     * Fired when a TH cell element is mouseover.
     *
     * @event headCellMouseoverEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TH element.
     *
     */
    this.createEvent("headCellMouseoverEvent");

    /**
     * Fired when a TABLE element is mouseover.
     *
     * @event tableMouseoverEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TABLE element.
     *
     */
    this.createEvent("tableMouseoverEvent");

    /**
     * Fired when a mousedown occurs on a TD element.
     *
     * @event cellMousedownEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TD element.
     */
    this.createEvent("cellMousedownEvent");

    /**
     * Fired when a TH cell element is mousedown.
     *
     * @event headCellMousedownEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TH element.
     */
    this.createEvent("headCellMousedownEvent");

    /**
     * Fired when a TABLE element is mousedown.
     *
     * @event tableMousedownEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TABLE element.
     *
     */
    this.createEvent("tableMousedownEvent");

    /**
     * Fired when a CHECKBOX element is clicked.
     *
     * @event checkboxClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The CHECKBOX element.
     */
    this.checkboxClickEvent = this.createEvent("checkboxClickEvent");
    //this.checkboxClickEvent.subscribeEvent.subscribe(this._registerEvent,{type:"checkboxClickEvent"},this);

    /**
     * Fired when a RADIO element is clicked.
     *
     * @event radioClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The RADIO element.
     */
    this.createEvent("radioClickEvent");
    
    /**
     * Fired when a TD element is clicked.
     *
     * @event cellClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TD element.
     */
    this.createEvent("cellClickEvent");

    /**
     * Fired when a TH cell element is clicked.
     *
     * @event headCellClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TH element.
     */
    this.createEvent("headCellClickEvent");

    /**
     * Fired when a TABLE element is clicked.
     *
     * @event tableClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TABLE element.
     *
     */
    this.createEvent("tableClickEvent");

    /**
     * Fired when a TD element is doubleclicked.
     *
     * @event cellDoublcickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TD element.
     */
    this.createEvent("cellDoubleclickEvent");

    /**
     * Fired when a TH cell element is doubleclicked.
     *
     * @event headCellDoubleclickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TH element.
     */
    this.createEvent("headCellDoubleclickEvent");

    /**
     * Fired when a TABLE element is doubleclicked.
     *
     * @event tableDoubleclickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TABLE element.
     *
     */
    this.createEvent("tableDoubleclickEvent");

    /**
     * Fired when up-arrow is typed.
     *
     * @event tableDoubleclickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TABLE element.
     *
     */
    this.createEvent("arrowUpEvent");

    /**
     * Fired when down-arrow is typed.
     *
     * @event tableDoubleclickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TABLE element.
     *
     */
    this.createEvent("arrowDownEvent");
    /**
     * Fired when a column is resized.
     *
     * @event columnResizeEvent
     * @param oArgs.target {HTMLElement} The TH element.
     */
    this.createEvent("columnResizeEvent");

    /**
     * Fired when a paginator element is clicked.
     *
     * @event pagerClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The paginator element.
     *
     */
    this.createEvent("pagerClickEvent");

    /**
     * Fired when an element is selected.
     *
     * @event selectEvent
     * @param oArgs.els {Array} An array of the selected element(s).
     */
    this.createEvent("selectEvent");

    /**
     * Fired when an element is unselected.
     *
     * @event unselectEvent
     * @param oArgs.els {Array} An array of the unselected element(s).
     */
    this.createEvent("unselectEvent");

    /**
     * Fired when a TR element is deleted.
     *
     * @event rowDeleteEvent
     * @param oArgs.rowIndex {Number || Array} The index(es) of the deleted row(s).
     * @param oArgs.rowId {String || Array} DOM ID(s) of the deleted row(s).
     * @param oArgs.recordId {String || Array} The Record ID(s) of the deleted row(s).
     */
    this.createEvent("rowDeleteEvent");
    this.subscribe("rowDeleteEvent", this._onRowDelete);
    
    
    
    
    YAHOO.widget.DataTable._nCount++;
    YAHOO.log("DataTable initialized", "info", this.toString());
};

if(YAHOO.util.EventProvider) {
    YAHOO.augment(YAHOO.widget.DataTable, YAHOO.util.EventProvider);
}
else {
    YAHOO.log("Missing dependency: YAHOO.util.EventProvider","error",this.toString());
}

/////////////////////////////////////////////////////////////////////////////
//
// Public constants
//
/////////////////////////////////////////////////////////////////////////////

 /**
 * Class name of TBODY element.
 *
 * @property CLASS_TBODY
 * @type String
 * @static
 * @final
 */
YAHOO.widget.DataTable.CLASS_TBODY = "yui-dt-tbody";

 /**
 * Class name of even element.
 *
 * @property CLASS_EVEN
 * @type String
 * @static
 * @final
 */
YAHOO.widget.DataTable.CLASS_EVEN = "yui-dt-even";

 /**
 * Class name of odd element.
 *
 * @property CLASS_ODD
 * @type String
 * @static
 * @final
 */
YAHOO.widget.DataTable.CLASS_ODD = "yui-dt-odd";

 /**
 * Class name of column text.
 *
 * @property CLASS_COLUMNTEXT
 * @type String
 * @static
 * @final
 */
YAHOO.widget.DataTable.CLASS_COLUMNTEXT = "yui-dt-columntext";

 /**
 * Class name of empty element.
 *
 * @property CLASS_EMPTY
 * @type String
 * @static
 * @final
 */
YAHOO.widget.DataTable.CLASS_EMPTY = "yui-dt-empty";


 /**
 * Class name of loading element.
 *
 * @property CLASS_LOADING
 * @type String
 * @static
 * @final
 */
YAHOO.widget.DataTable.CLASS_LOADING = "yui-dt-loading";

 /**
 * Class name of selected element.
 *
 * @property CLASS_SELECTED
 * @type String
 * @static
 * @final
 */
YAHOO.widget.DataTable.CLASS_SELECTED = "yui-dt-selected";

 /**
 * Class name of sortable column.
 *
 * @property CLASS_SORTABLE
 * @type String
 * @static
 * @final
 */
YAHOO.widget.DataTable.CLASS_SORTABLE = "yui-dt-sortable";

 /**
 * Class name of sorted column in ascending order.
 *
 * @property CLASS_SORTEDBYASC
 * @type String
 * @static
 * @final
 */
YAHOO.widget.DataTable.CLASS_SORTEDBYASC = "yui-dt-sortedbyasc";

 /**
 * Class name of sorted column in descending order.
 *
 * @property CLASS_SORTEDBYDESC
 * @type String
 * @static
 * @final
 */
YAHOO.widget.DataTable.CLASS_SORTEDBYDESC = "yui-dt-sortedbydesc";
 /**
 * Class name of editable column.
 *
 * @property CLASS_EDITABLE
 * @type String
 * @static
 * @final
 */
YAHOO.widget.DataTable.CLASS_EDITABLE = "yui-dt-editable";

 /**
 * Class name of cell type checkbox.
 *
 * @property CLASS_CHECKBOX
 * @type String
 * @static
 * @final
 */
YAHOO.widget.DataTable.CLASS_CHECKBOX = "yui-dt-checkbox";

 /**
 * Class name of cell type currency.
 *
 * @property CLASS_CURRENCY
 * @type String
 * @static
 * @final
 */
YAHOO.widget.DataTable.CLASS_CURRENCY = "yui-dt-currency";

 /**
 * Class name of cell type custom.
 *
 * @property CLASS_CUSTOM
 * @type String
 * @static
 * @final
 */
YAHOO.widget.DataTable.CLASS_CUSTOM = "yui-dt-custom";

 /**
 * Class name of cell type date.
 *
 * @property CLASS_DATE
 * @type String
 * @static
 * @final
 */
YAHOO.widget.DataTable.CLASS_DATE = "yui-dt-date";

 /**
 * Class name of cell type EMAIL.
 *
 * @property CLASS_EMAIL
 * @type String
 * @static
 * @final
 */
YAHOO.widget.DataTable.CLASS_EMAIL = "yui-dt-email";

 /**
 * Class name of cell type float.
 *
 * @property CLASS_FLOAT
 * @type String
 * @static
 * @final
 */
YAHOO.widget.DataTable.CLASS_FLOAT = "yui-dt-float";

 /**
 * Class name of cell type HTML.
 *
 * @property CLASS_HTML
 * @type String
 * @static
 * @final
 */
YAHOO.widget.DataTable.CLASS_HTML = "yui-dt-html";

 /**
 * Class name of cell type LINK.
 *
 * @property CLASS_LINK
 * @type String
 * @static
 * @final
 */
YAHOO.widget.DataTable.CLASS_LINK = "yui-dt-link";

 /**
 * Class name of cell type int.
 *
 * @property CLASS_INT
 * @type String
 * @static
 * @final
 */
YAHOO.widget.DataTable.CLASS_NUMBER = "yui-dt-number";

 /**
 * Class name of cell type radio.
 *
 * @property CLASS_RADIO
 * @type String
 * @static
 * @final
 */
YAHOO.widget.DataTable.CLASS_RADIO = "yui-dt-radio";

 /**
 * Class name of cell type string.
 *
 * @property CLASS_STRING
 * @type String
 * @static
 * @final
 */
YAHOO.widget.DataTable.CLASS_STRING = "yui-dt-string";

 /**
 * Message to display if table has no data.
 *
 * @property MSG_EMPTY
 * @type String
 * @static
 * @final
 */
YAHOO.widget.DataTable.MSG_EMPTY = "Table data has no records.";

 /**
 * Message to display while table is loading.
 *
 * @property MSG_LOADING
 * @type String
 * @static
 * @final
 */
YAHOO.widget.DataTable.MSG_LOADING = "Loading table data...";

/////////////////////////////////////////////////////////////////////////////
//
// Private member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Internal class variable to index multiple data table instances.
 *
 * @property _nCount
 * @type number
 * @private
 * @static
 */
YAHOO.widget.DataTable._nCount = 0;

/**
 * Instance index.
 *
 * @property _nIndex
 * @type number
 * @private
 */
YAHOO.widget.DataTable.prototype._nIndex = null;

/**
 * Unique instance name.
 *
 * @property _sName
 * @type String
 * @private
 */
YAHOO.widget.DataTable.prototype._sName = null;

//TODO: convert these to public members

/**
 * Container element reference. Is null unless the table is built from scratch into the
 * provided container.
 *
 * @property _elContainer
 * @type element
 * @private
 */
YAHOO.widget.DataTable.prototype._elContainer = null;

/**
 * TABLE element reference.
 *
 * @property _elTable
 * @type HTMLElement
 * @private
 */
YAHOO.widget.DataTable.prototype._elTable = null;

/**
 * TBODY element reference.
 *
 * @property _elBody
 * @type HTMLElement
 * @private
 */
YAHOO.widget.DataTable.prototype._elBody = null;

/**
 * A Columnset instance that describes the Columns of the table.
 *
 * @property _oColumnset
 * @type YAHOO.widget.Columnset
 * @private
 */
YAHOO.widget.DataTable.prototype._oColumnset = null;

/**
 * A Recordset instance that models the data held in the table.
 *
 * @property _oRecordset
 * @type YAHOO.widget.Recordset
 * @private
 */
YAHOO.widget.DataTable.prototype._oRecordset = null;

/**
 * Array of Records that are in the selected state.
 *
 * @property _aSelectedRecords
 * @type YAHOO.widget.Record[]
 * @private
 */
YAHOO.widget.DataTable.prototype._aSelectedRecords = [];

/**
 * Internal variable to track whether widget has focus.
 *
 * @property _bFocused
 * @type Boolean
 * @private
 */
YAHOO.widget.DataTable.prototype._bFocused = false;

/////////////////////////////////////////////////////////////////////////////
//
// Private methods
//
/////////////////////////////////////////////////////////////////////////////
/**
 * Initializes DataTable's DOM-related row properties once DOM is finalized
 *
 * @method _initRows
 * @private
 */
YAHOO.widget.DataTable.prototype._initRows = function() {
    //TODO: where does this go?
    var topRowCells = this._elBody.rows[0].cells;
    var columns = this._oColumnset.keys;
    for(var i=0; i<topRowCells.length; i++) {
        if(columns[i].key) {
            columns[i].width = topRowCells[i].offsetWidth;
        }
    }

    if(this.fixedWidth) {
        this._elTable.style.tableLayout = "fixed";
        for(var j=0; j<topRowCells.length; j++) {
            columns[j].width = topRowCells[j].offsetWidth;
            //elHeadRow.cells[j].style.width = setWidth;
        }
    }
};

/**
 * Creates HTML markup: TABLE, THEAD, TBODY.
 *
 * @method _createTable
 * @private
 */
YAHOO.widget.DataTable.prototype._initTable = function() {
    // Clear the container
    this._elContainer.innerHTML = "";
    
    if(this.scrolling) {
        //TODO: make class name a constant
        //TODO: conf height
        YAHOO.util.Dom.addClass(this._elContainer,"yui-dt-scrolling");
    }

    // Create TABLE
    this._elTable = this._elContainer.appendChild(document.createElement("table"));
    var elTable = this._elTable;
    elTable.tabIndex = 0;

    // Create SUMMARY, if applicable
    if(this.summary) {
        elTable.summary = this.summary;
    }

    // Create CAPTION, if applicable
    if(this.caption) {
        this._elCaption = elTable.appendChild(document.createElement("caption"));
        this._elCaption.innerHTML = this.caption;
    }

    // Create THEAD
    this._initHead(elTable, this._oColumnset);

    // Create TBODY for messages
    var elMsgBody = document.createElement("tbody");
    elMsgBody.tabIndex = -1;
    this._elMsgRow = elMsgBody.appendChild(document.createElement("tr"));
    var elMsgRow = this._elMsgRow;
    var elMsgCell = elMsgRow.appendChild(document.createElement("td"));
    elMsgCell.colSpan = this._oColumnset.keys.length;
    this._elMsgCell = elMsgCell;
    this._elMsgBody = elTable.appendChild(elMsgBody);
    this.showLoadingMessage();

    // Create TBODY for data
    this._elBody = elTable.appendChild(document.createElement("tbody"));
    this._elBody.tabIndex = -1;
    this._elBody.className = YAHOO.widget.DataTable.CLASS_TBODY;
};

/**
 * Populates THEAD element with header cells defined by Columnset.
 *
 * @method _initHead
 * @private
 */
YAHOO.widget.DataTable.prototype._initHead = function() {
    // Create THEAD
    var elHead = document.createElement("thead");
    elHead.tabIndex = -1;

    // Iterate through each row of Column headers...
    var colTree = this._oColumnset.tree;
    for(var i=0; i<colTree.length; i++) {
        var elHeadRow = elHead.appendChild(document.createElement("tr"));
        elHeadRow.id = this.id+"-hdrow"+i;

        // ...and create THEAD cells
        for(var j=0; j<colTree[i].length; j++) {
            var oColumn = colTree[i][j];
            var elHeadCell = elHeadRow.appendChild(document.createElement("th"));
            elHeadCell.id = oColumn.id;
            this._initHeadCell(elHeadCell,oColumn,i,j);
        }
    }

    this._elHead = this._elTable.appendChild(elHead);
    
    // Add Resizer only after DOM has been updated...
    // ...and skip the last column
    for(var k=0; k<this._oColumnset.keys.length-1; k++) {
        var oColumn = this._oColumnset.keys[k];
        if(oColumn.resizeable && YAHOO.util.DD) {
            //TODO: deal with fixed width tables
            if(!this.fixedWidth || (this.fixedwidth && !oColumn.isLast)) {
                // TODO: better way to get elHeadContainer
                var elHeadContainer = (YAHOO.util.Dom.getElementsByClassName("yui-dt-headcontainer","div",YAHOO.util.Dom.get(oColumn.id)))[0];
                var elHeadResizer = elHeadContainer.appendChild(document.createElement("span"));
                elHeadResizer.id = oColumn.id + "-resizer";
                YAHOO.util.Dom.addClass(elHeadResizer,"yui-dt-headresizer");
                oColumn.ddResizer = new YAHOO.util.WidthResizer(
                        this, oColumn.id, elHeadResizer.id, elHeadResizer.id);
                var cancelClick = function(e) {
                    YAHOO.util.Event.stopPropagation(e);
                };
                YAHOO.util.Event.addListener(elHeadResizer,"click",cancelClick);
            }
            if(this.fixedWidth) {
                elHeadContainer.style.overflow = "hidden";
                elHeadContent.style.overflow = "hidden";
            }
        }
    }

    YAHOO.log("THEAD with " + this._oColumnset.keys.length + " columns created","info",this.toString());
};

/**
 * Populates TH cell as defined by Column.
 *
 * @method _initHeadCell
 * @param elHeadCell {HTMLElement} TH cell element reference.
 * @param oColumn {YAHOO.widget.Column} Column object.
 * @param row {number} Row index.
 * @param col {number} Column index.
 * @private
 */
YAHOO.widget.DataTable.prototype._initHeadCell = function(elHeadCell,oColumn,row,col) {
    // Clear out the cell of prior content
    // TODO: purgeListeners and other validation-related things
    var index = this._nIndex;
    elHeadCell.columnKey = oColumn.key;
    elHeadCell.index = oColumn.index;
    if(oColumn.abbr) {
        elHeadCell.abbr = oColumn.abbr;
    }

    var recurseAncestors = function(oParent) {
        if(oParent) {
            elHeadCell.headers += oColumn.parent.id + " ";
            if(oParent.parent) {
                recurseAncestors(oParent.parent);
            }
        }
    };
    recurseAncestors(oColumn.parent);

    elHeadCell.innerHTML = "";

    var elHeadContainer = elHeadCell.appendChild(document.createElement("div"));
    elHeadContainer.id = this.id+"-hdrow"+row+"-container"+col;
    YAHOO.util.Dom.addClass(elHeadContainer,"yui-dt-headcontainer");
    var elHeadContent = elHeadContainer.appendChild(document.createElement("span"));
    elHeadContent.id = this.id+"-hdrow"+row+"-columntext"+col;
    YAHOO.util.Dom.addClass(elHeadContent,YAHOO.widget.DataTable.CLASS_COLUMNTEXT);
    elHeadContent.innerHTML = oColumn.text || oColumn.key;

    elHeadCell.rowSpan = oColumn.rowspan;
    elHeadCell.colSpan = oColumn.colspan;

    if(oColumn.sortable) {
        YAHOO.util.Dom.addClass(elHeadCell,YAHOO.widget.DataTable.CLASS_SORTABLE);
    }
};

/**
 * Initializes pagination with values passed in or else default values.
 *
 * @method _initPagination
 * @private
 */
YAHOO.widget.DataTable.prototype._initPagination = function() {
    var pag = (typeof this.paginator == "object") ? this.paginator : {};

    // Validate range
    pag.currentRange = (pag.initialMaxRows && !isNaN(pag.initialMaxRows)) ? pag.initialMaxRows : 100;
    var currentRange = pag.currentRange;

    // Validate current page number
    pag.currentPage = (pag.initialPage && !isNaN(pag.initialPage)) ? pag.initialPage : 1;
    var currentPage = pag.currentPage;

    // How many rows this page
    var maxRows = (currentRange && (currentRange < aRecords.length)) ?
    currentRange : aRecords.length;

    // How many total pages
    pag.totalPages = Math.ceil(aRecords.length / maxRows);
    var totalPages = pag.totalPages;

    // First row of this page
    pag.currentStartRecord = (currentPage-1) * currentRange;

    // How many page links to display
    pag.maxPageLinksDisplayed =
        (!isNaN(pag.maxPageLinksDisplayed) && (pag.maxPageLinksDisplayed < totalPages)) ?
        pag.maxPageLinksDisplayed : totalPages;
    var maxPageLinksDisplayed = pag.maxPageLinksDisplayed;

    // First link of this page
    pag.currentStartLink = (currentPage < maxPageLinksDisplayed) ? 1 : currentPage;

    this.paginator = pag;
};

/**
 * Enhance existing table's TH cell element markup.
 *
 * @method _enhanceHeadCellMarkup
 * @private
 */
/*YAHOO.widget.DataTable.prototype._enhanceHeadCell = function() {
    var oColumnset = this._oColumnset;
    var elHead = this._elTable.tHead;
    var index = this._nIndex;
    for(var nodelevel=0; nodelevel<oColumnset.tree.length; nodelevel++) {
        var elRow = elHead.rows[nodelevel];
        elRow.id = this.id+"-hdrow"+nodelevel;
        var elHeadCellsInRow = elRow.cells;
        var columnsetRow = oColumnset.tree[nodelevel];
        for(var col=0; col< columnsetRow.length; col++) {
            var oColumn = columnsetRow[col];
            var elHeadCell = elHeadCellsInRow[col];
            elHeadCell.id = oColumn.id;
            this._enhanceHeadCell(elHeadCell,oColumn,nodelevel,col);
        }
    }
    return true;
};*/

/**
 * Restripes rows with class YAHOO.widget.DataTable.CLASS_EVEN or
 * YAHOO.widget.DataTable.CLASS_ODD.
 *
 * @method _restripeRows
 * @private
 */
YAHOO.widget.DataTable.prototype._restripeRows = function(range) {
    if(!range) {
        var rows = this._elBody.rows;
        for(var i=0; i<rows.length; i++) {
            if(i%2) {
                YAHOO.util.Dom.removeClass(rows[i], YAHOO.widget.DataTable.CLASS_EVEN);
                YAHOO.util.Dom.addClass(rows[i], YAHOO.widget.DataTable.CLASS_ODD);
            }
            else {
                YAHOO.util.Dom.removeClass(rows[i], YAHOO.widget.DataTable.CLASS_ODD);
                YAHOO.util.Dom.addClass(rows[i], YAHOO.widget.DataTable.CLASS_EVEN);
            }
        }
    }
    else {
        //TODO: allow restriping of a subset of rows for performance
    }
};

 /**
 * Changes element CSS to CLASS_SELECTED and fires selectEvent.
 *
 * @method _select
 * @param aRows {HTMLElement | String | HTMLElement[] | String[]} HTML TR element
 * reference, TR String ID, array of HTML TR element, or array of TR element IDs.
 * @private
 */
YAHOO.widget.DataTable.prototype._select = function(els) {
    if(els.constructor != Array) {
        els = [els];
    }
    for(var i=0; i<els.length; i++) {
        YAHOO.util.Dom.addClass(YAHOO.util.Dom.get(els[i]),YAHOO.widget.DataTable.CLASS_SELECTED);
        this._aSelectedRecords.push(els[i].recordId);
    }
    this.fireEvent("selectEvent",{els:els});
};

 /**
 * Sets one or more rows to the unselected.
 *
 * @method _unselect
 * @param aRows {HTMLElement | String | HTMLElement[] | String[]} HTML element
 * reference, element ID, array of HTML elements, or array of element IDs
 * @private
 */
YAHOO.widget.DataTable.prototype._unselect = function(els) {
    if(els.constructor != Array) {
        els = [els];
    }
    var array = this._aSelectedRecords;
    for(var i=0; i<els.length; i++) {
        YAHOO.util.Dom.removeClass(YAHOO.util.Dom.get(els[i]),YAHOO.widget.DataTable.CLASS_SELECTED);
        for(var j=0; j<array.length; j++) {
            if(els[i].recordId == array[j]) {
                array.splice(j);
            }
        }
    }
    this.fireEvent("unselectEvent",{els:els});
};

/////////////////////////////////////////////////////////////////////////////
//
// Private DOM Event Handlers
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Handles blur events on the TABLE element.
 *
 * @method _onBlur
 * @param e {event} The mouseover event.
 * @param oSelf {object} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onBlur = function(e, oSelf) {
    this._bFocused = false;
};

/**
 * Handles mouseover events on the TABLE element.
 *
 * @method _onMouseover
 * @param e {event} The mouseover event.
 * @param oSelf {object} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onMouseover = function(e, oSelf) {
	    var elTarget = YAHOO.util.Event.getTarget(e);
	    var elTag = elTarget.nodeName.toLowerCase();
	    var knownTag = false;

        if (elTag != "table") {
            while(!knownTag) {
                switch(elTag) {
                    case "body":
                        knownTag = true;
                        break;
                    case "td":
    	                oSelf.fireEvent("cellMouseoverEvent",{target:elTarget,event:e});
    	                knownTag = true;
    	                break;
        	        case "th":
                    	oSelf.fireEvent("headCellMouseoverEvent",{target:elTarget,event:e});
                    	knownTag = true;
                    	break;
                    default:
                        break;
                }
                elTarget = elTarget.parentNode;
                if(elTarget) {
                    elTag = elTarget.nodeName.toLowerCase();
                }
                else {
                    break;
                }
            }
        }
	    oSelf.fireEvent("tableMouseoverEvent",{target:elTarget,event:e});
};

/**
 * Handles mousedown events on the TABLE element.
 *
 * @method _onMousedown
 * @param e {event} The mouseover event.
 * @param oSelf {object} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onMousedown = function(e, oSelf) {
        //YAHOO.util.Event.stopEvent(e);
	    var elTarget = YAHOO.util.Event.getTarget(e);
	    var elTag = elTarget.nodeName.toLowerCase();
	    var knownTag = false;

        if (elTag != "table") {
            while(!knownTag) {
                switch(elTag) {
                    case "body":
                        knownTag = true;
                        break;
                    case "td":
    	               oSelf.fireEvent("cellMousedownEvent",{target:elTarget,event:e});
    	               knownTag = true;
    	               break;
        	        case "th":
                    	oSelf.fireEvent("headCellMousedownEvent",{target:elTarget,event:e});
                    	knownTag = true;
                    	break;
                    default:
                        break;
                }
                elTarget = elTarget.parentNode;
                if(elTarget) {
                    elTag = elTarget.nodeName.toLowerCase();
                }
                else {
                    break;
                }
            }
        }
	    oSelf.fireEvent("tableMousedownEvent",{target:elTarget,event:e});
};

/**
 * Handles click events on the TABLE element.
 *
 * @method _onClick
 * @param e {event} The click event.
 * @param oSelf {object} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onClick = function(e, oSelf) {
    var elTarget = YAHOO.util.Event.getTarget(e);
    var elTag = elTarget.nodeName.toLowerCase();
    var knownTag = false; // True if event should stop propagating

    if(oSelf.activeEditor) { //&& (oSelf.activeEditor != column)
        oSelf.activeEditor.hideEditor();
        oSelf.activeEditor = null;

        // Editor causes widget to lose focus
        oSelf._bFocused = false;
        oSelf.focusTable();
    }

    if (elTag != "table") {
        while(!knownTag) {
            switch(elTag) {
                case "body":
                    knownTag = true;
                    break;
                case "input":
                    if(elTarget.type.toLowerCase() == "checkbox") {
                        oSelf.fireEvent("checkboxClickEvent",{target:elTarget,event:e});
                    }
                    else if(elTarget.type.toLowerCase() == "radio") {
                        oSelf.fireEvent("radioClickEvent",{target:elTarget,event:e});
                    }
                    knownTag = true;
                    break;
                case "td":
	               oSelf.fireEvent("cellClickEvent",{target:elTarget,event:e});
	               knownTag = true;
	               break;
    	        case "th":
                	oSelf.fireEvent("headCellClickEvent",{target:elTarget,event:e});
                	knownTag = true;
                	break;
                default:
                    break;
            }
            elTarget = elTarget.parentNode;
            elTag = elTarget.nodeName.toLowerCase();
        }
    }
    oSelf.focusTable();
    oSelf.fireEvent("tableClickEvent",{target:elTarget,event:e});
};

/**
 * Handles doubleclick events on the TABLE element.
 *
 * @method _onDoubleclick
 * @param e {event} The doubleclick event.
 * @param oSelf {object} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onDoubleclick = function(e, oSelf) {
    var elTarget = YAHOO.util.Event.getTarget(e);
    var elTag = elTarget.nodeName.toLowerCase();
    var knownTag = false;

    if(oSelf.activeEditor) { //&& (oSelf.activeEditor != column)
        oSelf.activeEditor.hideEditor();
        oSelf.activeEditor = null;
        
        // Editor causes widget to lose focus
        oSelf._bFocused = false;
        oSelf.focusTable();
    }

    if (elTag != "table") {
        while(!knownTag) {
            switch(elTag) {
                case "body":
                    knownTag = true;
                    break;
                case "td":
	                oSelf.fireEvent("cellDoubleclickEvent",{target:elTarget,event:e});
	                knownTag = true;
	                break;
    	        case "th":
                	oSelf.fireEvent("headCellDoubleclickEvent",{target:elTarget,event:e});
                	knownTag = true;
                	break;
                default:
                    break;
            }
            elTarget = elTarget.parentNode;
            elTag = elTarget.nodeName.toLowerCase();
        }
    }
    oSelf.fireEvent("tableDoubleclickEvent",{target:elTarget,event:e});
};

/**
 * Handles keydown events on the TABLE.
 *
 * @method _onKeydown
 * @param e {event} The key event.
 * @param oSelf {object} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onKeydown = function(e, oSelf) {
    var oldSelected = oSelf._lastSelected;
    // Only move selection if one is already selected
    // TODO: config to allow selection even if one is NOT already selected
    // TODO: if something isn't selected already, arrow key should select first or last one
    if(oldSelected && oSelf.isSelected(oldSelected)) {
        var newSelected;
        // arrow down
        if(e.keyCode == 40) {
            // row mode
            if(oldSelected.nodeName.toLowerCase() == "tr") {
                // We have room to move down
                if(oldSelected.sectionRowIndex+1 < oSelf._elBody.rows.length) {
                            if(!e.shiftKey) {
                                oSelf.unselectAllRows();
                            }
                            newSelected = oSelf._elBody.rows[oldSelected.sectionRowIndex+1];
                            oSelf.select(newSelected);
                            
                }
            }
            // cell mode
            else if(oldSelected.nodeName.toLowerCase() == "td") {
                /*// We have room to move down
                if(oldSelected.sectionRowIndex+1 < oSelf._elBody.rows.length) {
                            if(!e.shiftKey) {
                                oSelf.unselectAllRows();
                            }
                            newSelected = oSelf._elBody.rows[oldSelected.sectionRowIndex+1];
                            oSelf.select(newSelected);
                }*/
            }
            // Arrows can cause widget to lose focus
            oSelf._bFocused = false;
            oSelf.focusTable();
        }
        // arrow up
        else if(e.keyCode == 38) {
            // row mode
            if(oldSelected.nodeName.toLowerCase() == "tr") {
                // We have room to move up
                if((oldSelected.sectionRowIndex > 0)) {
                            if(!e.shiftKey) {
                                oSelf.unselectAllRows();
                            }
                            newSelected = oSelf._elBody.rows[oldSelected.sectionRowIndex-1];
                            oSelf.select(newSelected);
                }
            }
            // cell mode
            else if(oldSelected.nodeName.toLowerCase() == "td") {
                // We have room to move up
                if((oldSelected.sectionRowIndex > 0)) {
                            if(!e.shiftKey) {
                                oSelf.unselectAllRows();
                            }
                            newSelected = oSelf._elBody.rows[oldSelected.sectionRowIndex-1];
                            oSelf.select(newSelected);
                }
            }
            // Arrows can cause widget to lose focus
            oSelf._bFocused = false;
            oSelf.focusTable();
        }
    }
};

/**
 * Handles keyup events on the DOCUMENT.
 *
 * @method _onKeyup
 * @param e {event} The key event.
 * @param oSelf {object} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onKeyup = function(e, oSelf) {
    // esc
    if((e.keyCode == 27) && (oSelf.activeEditor)) {
        oSelf.activeEditor.hideEditor();
        oSelf.activeEditor = null;
        
        // Editor causes widget to lose focus
        oSelf._bFocused = false;
        oSelf.focusTable();
    }
};

/**
 * Handles click events on paginator elements.
 *
 * @method _onPagerClick
 * @param e {event} The click event.
 * @param oSelf {object} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onPagerClick = function(e, oSelf) {
    var elTarget = YAHOO.util.Event.getTarget(e);
    var elTag = elTarget.nodeName.toLowerCase();
    var knownTag = false; // True if event should stop propagating

    if (elTag != "table") {
        while(!knownTag) {
            switch(elTag) {
                case "body":
                    knownTag = true;
                    break;
                case "a":
                    switch(elTarget.className) {
                        case "yui-dt-pagelink":
                            oSelf.showPage(parseInt(elTarget.innerHTML,10));
                            break;
                        case "yui-dt-firstlink":
                            oSelf.showPage(1);
                            break;
                        case "yui-dt-lastlink":
                            oSelf.showPage(parseInt(oSelf.paginator.totalPages,10));
                            break;
                        case "yui-dt-prevlink":
                            oSelf.showPage(parseInt(oSelf.paginator.currentPage-1,10));
                            break;
                        case "yui-dt-nextlink":
                            oSelf.showPage(parseInt(oSelf.paginator.currentPage+1,10));
                            break;
                    }
                    knownTag = true;
                    break;
                case "select":
                    var newRange = parseInt(elTarget[elTarget.selectedIndex].text,10);
                    if(newRange != oSelf.paginator.currentRange) {
                        // New range
                        oSelf.paginator.currentRange = newRange;
                        var currentRange = oSelf.paginator.currentRange;

                        // How many records
                        var recordsLength = oSelf._oRecordset.getRecords().length;

                        // First row of this page
                        oSelf.paginator.currentStartRecord =
                                (currentRange > recordsLength ) ?
                                0: oSelf.paginator.currentStartRecord;
                        var currentStartRecord = oSelf.paginator.currentStartRecord;

                        // Current page
                        oSelf.paginator.currentPage =
                                (currentRange > recordsLength ) ? 1 :
                                Math.ceil(currentStartRecord / currentRange) + 1;
                        var currentPage = oSelf.paginator.currentPage;

                        // How many rows this page
                        var maxRows =
                                (currentRange && (currentRange < recordsLength)) ?
                                currentRange : recordsLength;

                        // How many total pages
                        oSelf.paginator.totalPages =
                                (currentRange > recordsLength) ? 1 :
                                Math.ceil(recordsLength / maxRows);

                        // First link of this page
                        if(currentRange > recordsLength) {
                            oSelf.paginator.currentStartLink = 1;
                        }
                        else {
                            oSelf.paginator.currentStartLink = currentPage;
                        }

                        oSelf.paginate();

                    }
                    knownTag = true;
                    break;
                default:
                    break;
            }
            elTarget = elTarget.parentNode;
            if(elTarget) {
                elTag = elTarget.nodeName.toLowerCase();
            }
            else {
                break;
            }
        }
    }
    oSelf.fireEvent("pagerClickEvent",{target:elTarget,event:e});
};

/////////////////////////////////////////////////////////////////////////////
//
// Private Custom Event Handlers
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Handles row delete events.
 *
 * @method _onRowDelete
 * @param oArgs.rowIndex {Number || Array} The index(es) of the deleted row(s).
 * @param oArgs.rowId {String || Array} DOM ID(s) of the deleted row(s).
 * @param oArgs.recordId {String || Array} The Record ID(s) of the deleted row(s).
 * @private
 */
YAHOO.widget.DataTable.prototype._onRowDelete = function(oArgs) {
    this._restripeRows();
};

/////////////////////////////////////////////////////////////////////////////
//
// Public member variables
//
/////////////////////////////////////////////////////////////////////////////

 /**
 * DataSource instance.
 *
 * @property dataSource
 * @type YAHOO.widget.DataSource
 */
YAHOO.widget.DataTable.prototype.dataSource = null;

 /**
 * Initial request parameters to send to DataSource.
 *
 * @property initialRequest
 * @type String
 * @default ""
 */
YAHOO.widget.DataTable.prototype.initialRequest = "";

 /**
 * Summary of table data for SUMMARY attribute. Recommended for accessibility.
 *
 * @property summary
 * @type String
 */
YAHOO.widget.DataTable.prototype.summary = null;

 /**
 * True if TABLE width is a fixed size.
 *
 * @property fixedWidth
 * @type Boolean
 * @default false
 */
YAHOO.widget.DataTable.prototype.fixedWidth = false;

 /**
 * True if TBODY scrolls while headers remain fixed.
 *
 * @property scrollable
 * @type Boolean
 * @default false
 */
YAHOO.widget.DataTable.prototype.scrollable = false;

 /**
 * True if only one row may be selected at a time.
 *
 * @property singleSelect
 * @type Boolean
 * @default false
 */
YAHOO.widget.DataTable.prototype.singleSelect = false;

 /**
 * Context menu.
 *
 * @property contextMenu
 * @type YAHOO.widget.ContextMenu
 */
YAHOO.widget.DataTable.prototype.contextMenu = null;

/**
 * Object literal defines and manages pagination behavior.
 *
 * @property paginator
 * @type Object
 */
YAHOO.widget.DataTable.prototype.paginator = null;

/**
 * True if the DataTable is empty of data. False if table is populated with
 * data from Recordset.
 *
 * @property isEmpty
 * @type Boolean
 */
YAHOO.widget.DataTable.prototype.isEmpty = false;


/////////////////////////////////////////////////////////////////////////////
//
// Public methods
//
/////////////////////////////////////////////////////////////////////////////

 /**
 * Public accessor to the unique name of the DataSource instance.
 *
 * @method toString
 * @return {String} Unique name of the DataSource instance.
 */

YAHOO.widget.DataTable.prototype.toString = function() {
    return "DataTable " + this._sName;
};

 /**
 * Returns element reference to given TD cell.
 *
 * @method getCell
 * @param row {Number} Row number.
 * @param col {Number} Column number.
 */
YAHOO.widget.DataTable.prototype.getCell = function(row, col) {
    return(this._elBody.rows[row].cells[col]);
};

 /**
 * Returns element reference to given TR cell.
 *
 * @method getRow
 * @param index {Number} Row number.
 */
YAHOO.widget.DataTable.prototype.getRow = function(index) {
    return(this._elBody.rows[index]);
};

 /**
 * Placeholder row to indicate table data is empty.
 *
 * @method showEmptyMessage
 */
YAHOO.widget.DataTable.prototype.showEmptyMessage = function() {
    if(this.isEmpty) {
        return;
    }
    if(this.isLoading) {
        this.hideTableMessages();
    }

    this._elMsgBody.style.display = "table-row-group";
    var elCell = this._elMsgCell;
    elCell.className = YAHOO.widget.DataTable.CLASS_EMPTY;
    elCell.innerHTML = YAHOO.widget.DataTable.MSG_EMPTY;
    this.isEmpty = true;
};

 /**
 * Placeholder row to indicate table data is loading.
 *
 * @method showLoadingMessage
 */
YAHOO.widget.DataTable.prototype.showLoadingMessage = function() {
    if(this.isLoading) {
        return;
    }
    if(this.isEmpty) {
        this.hideTableMessages();
    }

    this._elMsgBody.style.display = "table-row-group";
    var elCell = this._elMsgCell;
    elCell.className = YAHOO.widget.DataTable.CLASS_LOADING;
    elCell.innerHTML = YAHOO.widget.DataTable.MSG_LOADING;
    this.isLoading = true;
};

 /**
 * Hide any placeholder message row.
 *
 * @method hideTableMessages
 */
YAHOO.widget.DataTable.prototype.hideTableMessages = function() {
    if(!this.isEmpty && !this.isLoading) {
        return;
    }

    this._elMsgBody.style.display = "none";

    this.isEmpty = false;
    this.isLoading = false;
};

/**
 * Sets focus on the TABLE element.
 *
 * @method focusTable
 */
YAHOO.widget.DataTable.prototype.focusTable = function() {
    if(!this._bFocused) {
        //TODO: fix scope issue with timeout
        gTable = this._elTable;
            setTimeout("gTable.focus();",0);
            this._bFocused = true;
    }
};


 /**
 * Add rows to bottom of table body.
 *
 * @method addRow
 * @param aRecords {YAHOO.widget.Record[]} Array of Records.
 */
YAHOO.widget.DataTable.prototype.appendRows = function(aRecords) {
    this.hideTableMessages();

    for(var i=0; i<aRecords.length; i++) {
        this.addRow(aRecords[i]);
    }
};

 /**
 * Add rows to top of table body.
 *
 * @method insertRows
 * @param aRecords {YAHOO.widget.Record[]} Array of Records.
 */
YAHOO.widget.DataTable.prototype.insertRows = function(aRecords) {
    this.hideTableMessages();

    for(var i=0; i<aRecords.length; i++) {
        this.addRow(aRecords[i],0);
    }
    
};

 /**
 * Replaces existing rows of table body with new rows.
 *
 * @method insertRows
 * @param aRecords {YAHOO.widget.Record[]} Array of Records.
 */
YAHOO.widget.DataTable.prototype.replaceRows = function(aRecords) {
    this.hideTableMessages();

    var elBody = this._elBody;
    var elRows = this._elBody.rows;
    // Remove extra rows
    while(elBody.hasChildNodes() && (elRows > aRecords.length)) {
        elBody.deleteRow(0);
    }
    // Format in-place existing rows
    for(var i=0; i<elRows.length; i++) {
        if(aRecords[i]) {
            this.updateRow(aRecords[i],i);
        }
    }
    // Add rows as necessary
    for(var j=elRows.length; j<aRecords.length; j++) {
        this.addRow(aRecords[j]);
    }
};

 /**
 * Add a new row to table body at position i if given, or to the bottom otherwise.
 *
 * @method addRow
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param i {Number} Position at which to add row.
 */
YAHOO.widget.DataTable.prototype.addRow = function(oRecord, i) {
    this.hideTableMessages();

    // Is this an insert or an append?
    var insert = (isNaN(i)) ? false : true;
    if(!insert) {
        i = this._elBody.rows.length;
    }

    var oColumnset = this._oColumnset;
    var oRecordset = this._oRecordset;

    var elRow = (insert && this._elBody.rows[i]) ?
        this._elBody.insertBefore(document.createElement("tr"),this._elBody.rows[i]) :
        this._elBody.appendChild(document.createElement("tr"));
    var recId = oRecord.id;
    elRow.id = this.id+"-bdrow"+recId;
    elRow.recordId = recId;

    // Create TBODY cells
    for(var j=0; j<oColumnset.keys.length; j++) {
        if(oColumnset.keys[j].key) {
            var elCell = elRow.appendChild(document.createElement("td"));
            elCell.id = this.id+"-bdrow"+i+"-cell"+j;
            elCell.headers = oColumnset.keys[j].id;
            oColumnset.keys[j].format(elCell, oRecord);
        /*p.abx {word-wrap:break-word;}
ought to solve the problem for Safari (the long words will wrap in your
tds, instead of overflowing to the next td.
(this is supported by IE win as well, so hide it if needed).

One thing, though: it doesn't work in combination with
'white-space:nowrap'.*/

// need a div wrapper for safari?
            if(this.fixedWidth) {
                elCell.style.overflow = "hidden";
                //elCell.style.width = "20px";
            }
        }
    }

    if(this.isEmpty && (this._elBody.rows.length > 0)) {
        //TODO: hideMessages()
        //this._initRows()
        //this.isEmpty = false;
    }

    // Striping
    if(!insert) {
        if(i%2) {
            YAHOO.util.Dom.addClass(elRow, YAHOO.widget.DataTable.CLASS_ODD);
        }
        else {
            YAHOO.util.Dom.addClass(elRow, YAHOO.widget.DataTable.CLASS_EVEN);
        }
    }
    else {
        //TODO: pass in a subset for better performance
        this._restripeRows();
    }
};

 /**
 * Updates existing row at position i with data from the given Record.
 *
 * @method updateRow
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param i {Number} Position at which to update row.
 */
YAHOO.widget.DataTable.prototype.updateRow = function(oRecord, i) {
    this.hideTableMessages();

    var elRow = this._elBody.rows[i];
    elRow.recordId = oRecord.id;

    var columns = this._oColumnset.keys;
    // ...Update TBODY cells with new data
    for(var j=0; j<columns.length; j++) {
        columns[j].format(elRow.cells[j], oRecord);
    }
};

 /**
 * Calls delete on selected rows.
 *
 * @method deleteSelectedRows
 */
YAHOO.widget.DataTable.prototype.deleteRows = function(rows) {
    for(var i=0; i<rows.length; i++) {
        this.deleteRow(rows[i]);
    }
};

 /**
 * Deletes a given row element as well its corresponding Record in the Recordset.
 *
 * @method deleteRow
 * @param elRow {element} HTML table row element reference.
 */
YAHOO.widget.DataTable.prototype.deleteRow = function(elRow) {
    var allRows = this._elBody.rows;
    var id = elRow.id;
    var recordId = elRow.recordId;
    for(var i=0; i< allRows.length; i++) {
        if(id == allRows[i].id) {
            this._elBody.deleteRow(i);

            // Update the Recordset
            this._oRecordset.deleteRecord(i);
            break;
        }
    }
    if(this._elBody.rows.length === 0) {
        this.showEmptyMessage();
    }
    this.fireEvent("rowDeleteEvent",{rowIndex: i, rowId: id, recordId: recordId});
};


 /**
 * Sets one or more rows to the selected state.
 *
 * @method select
 * @param aRows {HTMLElement | String | HTMLElement[] | String[]} HTML TR element
 * reference, TR String ID, array of HTML TR element, or array of TR element IDs.
 */
YAHOO.widget.DataTable.prototype.select = function(els) {
    this._select(els);
    if(els.constructor != Array) {
        els = [els];
    }
    this._lastSelected = YAHOO.util.Dom.get(els[(els.length-1)]);
};

 /**
 * Sets one or more rows to the unselected state.
 *
 * @method unselect
 * @param aRows {HTMLElement | String | HTMLElement[] | String[]} HTML element
 * reference, element ID, array of HTML elements, or array of element IDs
 */
YAHOO.widget.DataTable.prototype.unselect = function(els) {
    this._unselect(els);
};

/**
 * Unselects all selected rows.
 *
 * @method unselectAllRows
 */
YAHOO.widget.DataTable.prototype.unselectAllRows = function() {
    this._unselect(YAHOO.util.Dom.getElementsByClassName(YAHOO.widget.DataTable.CLASS_SELECTED,"tr",this._elBody));
};

/**
 * Unselects all selected cells.
 *
 * @method unselectAllCells
 */
YAHOO.widget.DataTable.prototype.unselectAllCells = function() {
    this._unselect(YAHOO.util.Dom.getElementsByClassName(YAHOO.widget.DataTable.CLASS_SELECTED,"td",this._elBody));
};


 /**
 * Returns true if given element is select, false otherwise.
 *
 * @method isSelected
 * @param el {element} HTML element reference.
 * @return {boolean} True if element is selected.
 */
YAHOO.widget.DataTable.prototype.isSelected = function(el) {
    return YAHOO.util.Dom.hasClass(el,YAHOO.widget.DataTable.CLASS_SELECTED);
};

 /**
 * Returns array of selected rows.
 *
 * @method getSelectedRows
 * @return {HTMLElement[]} Array of selected TR elements.
 */
YAHOO.widget.DataTable.prototype.getSelectedRows = function() {
    //TODO: keep internal array
    return YAHOO.util.Dom.getElementsByClassName(YAHOO.widget.DataTable.CLASS_SELECTED,"tr",this._elBody);
};

 /**
 * Returns array of selected Record IDs.
 *
 * @method getSelectedRecords
 * @return {HTMLElement[]} Array of selected TR elements.
 */
YAHOO.widget.DataTable.prototype.getSelectedRecords = function() {
    return this._aSelectedRecords;
};
 /**
 * Returns array of selected TD cells.
 *
 * @method getSelectedCells
 * @return {HTMLElement[]} Array of selected TD elements.
 */
YAHOO.widget.DataTable.prototype.getSelectedCells = function() {
    //TODO: keep internal array
    return YAHOO.util.Dom.getElementsByClassName(YAHOO.widget.DataTable.CLASS_SELECTED,"td",this._elBody);
};

 /**
 * Returns pointer to the DataTable instance's Columnset instance.
 *
 * @method getColumnset
 * @return {YAHOO.widget.Columnset} Columnset instance.
 */
YAHOO.widget.DataTable.prototype.getColumnset = function() {
    return this._oColumnset;
};

 /**
 * Returns pointer to the DataTable instance's Recordset instance.
 *
 * @method getRecordset
 * @return {YAHOO.widget.Recordset} Recordset instance.
 */
YAHOO.widget.DataTable.prototype.getRecordset = function() {
    return this._oRecordset;
};

/**
 * Handles tableKeypressEvent.
 *
 * @method doKeypress
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 */
YAHOO.widget.DataTable.prototype.doKeypress = function(oArgs) {
    //TODO: hook this up
    var key = YAHOO.util.Event.getCharCode(oArgs.event);
    switch (key) {
        case 46: // delete
            this.deleteSelectedRows();
            break;
    }
};

 /**
 * Displays a specific page of a paginated DataTable.
 *
 * @method showPage
 * @param nPage {Number} Which page.
 */
YAHOO.widget.DataTable.prototype.showPage = function(nPage) {
//TODO: much optimization
    if(isNaN(nPage) || (nPage < 1) || (nPage > this.paginator.totalPages)) {
        nPage = 1;
    }
    if(nPage < this.paginator.currentStartLink){
        this.paginator.currentStartLink = nPage;
    }
    else if (nPage >= (this.paginator.currentStartLink + this.paginator.maxLinksDisplayed)) {
        this.paginator.currentStartLink = nPage - this.paginator.maxLinksDisplayed + 1;
    }
    var currentRange = this.paginator.currentRange;
    this.paginator.currentStartRecord = (nPage-1) * currentRange;
    var startRecord = this.paginator.currentStartRecord;
    var pageRecords = this._oRecordset.getRecords(startRecord, currentRange);
    this.paginator.currentPage = nPage;
    this.paginate();
};

 /**
 * Renders paginator with current values.
 *
 * @method paginate
 */
YAHOO.widget.DataTable.prototype.paginate = function() {
    var pag = this.paginator;
    var pageRecords = this._oRecordset.getRecords(pag.currentStartRecord, pag.currentRange);
    this.replaceRows(pageRecords);



    // Markup for page links
    pag.firstLink = " <a href=# class=\"yui-dt-firstlink\">&lt;&lt;</a> ";
    pag.prevLink = " <a href=# class=\"yui-dt-prevlink\">&lt;</a> ";
    pag.nextLink = " <a href=# class=\"yui-dt-nextlink\">&gt;</a> ";
    pag.lastLink = " <a href=# class=\"yui-dt-lastlink\">&gt;&gt;</a> ";
    var markup = pag.firstLink + pag.prevLink;
    var maxLinks = (pag.currentStartLink+pag.maxPageLinksDisplayed < pag.totalPages) ?
        pag.currentStartLink+pag.maxPageLinksDisplayed-1 : pag.totalPages;
    for(var i=pag.currentStartLink; i<=maxLinks; i++) {
         if(i != pag.currentPage) {
            markup += " <a href=# class=\"yui-dt-pagelink\">" + i + "</a> ";
        }
        else {
            markup += " <span class=\"yui-dt-currentpage\">" + i + "</span>";
        }
    }
    markup += pag.nextLink + pag.lastLink;

    // Markup for range selector
    if(pag.maxRowsOptions) {
        markup+= "<select class=\"yui-dt-rangeselect\">";
            for(var i=0; i<pag.maxRowsOptions.length; i++) {
                var option = pag.maxRowsOptions[i];
                markup += "<option value=\"" + option + "\"";
                if(pag.currentRange === option) {
                    markup += " selected";
                }
                markup += ">" + option + "</option>";
            }
        markup += "</select>";
    }

    // Populate each pager container with markup
    this.pagers = YAHOO.util.Dom.getElementsByClassName("yui-dt-pager","div",document.body);
    if(this.pagers.length == 0) {
        var pager1 = document.createElement("div");
        pager1.className = "yui-dt-pager";
        var pager2 = document.createElement("div");
        pager2.className = "yui-dt-pager";
        pager1 = this._elContainer.insertBefore(pager1, this._elTable);
        pager2 = this._elContainer.insertBefore(pager2, this._elTable.nextSibling);
        this.pagers = [pager1,pager2];
    }
    for(var i=0; i<this.pagers.length; i++) {
        YAHOO.util.Event.purgeElement(this.pagers[i]);
        this.pagers[i].innerHTML = markup;
        YAHOO.util.Event.addListener(this.pagers[i],"click",this._onPagerClick,this);
    }

};

/**
 * Sort given column.
 *
 * @method sortColumn
 * @param oColumn {YAHOO.widget.Column} Column to sort. TODO: accept the TH or TH.key
 */
YAHOO.widget.DataTable.prototype.sortColumn = function(oColumn) {
    if(oColumn.constructor != YAHOO.widget.Column) {
        //TODO: Figure out the column based on TH ref or TH.key
    }
    if(oColumn && oColumn.sortable) {
        // What is the default sort direction?
        var sortDir = (oColumn.sortOptions && oColumn.sortOptions.defaultOrder) ? oColumn.sortOptions.defaultOrder : "asc";

        // Is the column sorted already?
        if(this.sortedBy == oColumn.key) {
            if(this.sortedByDir) {
                sortDir = (this.sortedByDir == "asc") ? "desc" : "asc";
            }
            else {
                sortDir = (sortDir == "asc") ? "desc" : "asc";
            }
        }

        // Define the sort handler function based on the direction
        var sortFnc = null;
        if((sortDir == "desc") && oColumn.sortOptions && oColumn.sortOptions.descHandler) {
            sortFnc = oColumn.sortOptions.descHandler
        }
        else if((sortDir == "asc") && oColumn.sortOptions && oColumn.sortOptions.ascHandler) {
            sortFnc = oColumn.sortOptions.ascHandler
        }

        // One was not provided so use the default generic sort handler function
        // TODO: use diff default functions based on column data type
        // TODO: nested/cumulative/hierarchical sorting
        // TODO: support server side sorting
        if(!sortFnc) {
            sortFnc = function(a, b) {
                if(sortDir == "desc") {
                    var sorted = YAHOO.util.Sort.compareDesc(a[oColumn.key],b[oColumn.key]);
                    if(sorted == 0) {
                        return YAHOO.util.Sort.compareDesc(a.id,b.id);
                    }
                    else {
                        return sorted;
                    }
                }
                else {
                    var sorted = YAHOO.util.Sort.compareAsc(a[oColumn.key],b[oColumn.key]);
                    if(sorted == 0) {
                        return YAHOO.util.Sort.compareAsc(a.id,b.id);
                    }
                    else {
                        return sorted;
                    }
                }
            };
        }

        // Do the actual sort
        this.replaceRows(this._oRecordset.sort(sortFnc));

        // Keep track of currently sorted column
        YAHOO.util.Dom.removeClass(this.sortedBy,YAHOO.widget.DataTable.CLASS_SORTEDBYASC);
        YAHOO.util.Dom.removeClass(this.sortedBy,YAHOO.widget.DataTable.CLASS_SORTEDBYDESC);
        this.sortedBy = oColumn.key;
        this.sortedByDir = sortDir;
        var newClass = (sortDir == "asc") ? YAHOO.widget.DataTable.CLASS_SORTEDBYASC : YAHOO.widget.DataTable.CLASS_SORTEDBYDESC;
        YAHOO.util.Dom.addClass(oColumn.id, newClass);
        YAHOO.log("Column \"" + oColumn.key + "\" sorted " + sortDir,"info",this.toString());
    }
    else {
        //TODO
        YAHOO.log("Column \"" + oColumn + "\" not sortable", "info", this.toString());
    }
};

/**
 * Handles editors based on DOM events.
 *
 * @method editCell
 */
YAHOO.widget.DataTable.prototype.editCell = function(elCell) {
    var columns = this._oColumnset.keys;
    var column = null;
    for(var i=0; i<columns.length; i++) {
        // Which column are we editing?
        if(elCell.columnKey == columns[i].key) {
            column = columns[i];
            break;
        }
    }

    if(column && column.editable) {
        column.showEditor(elCell,this._oRecordset.getRecord(elCell.parentNode.recordId));
        this.activeEditor = column;
    }
    this._bFocused = true;
};

 /**
 * Default formatter for cells in columns of type "checkbox".
 * Can be overridden for custom formatting.
 *
 * @method checkboxFormatter
 * @param elCell {HTMLElement} Table cell element.
 * @param oData {Object} Data value for the cell.
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 */
YAHOO.widget.DataTable.checkboxFormatter = function(elCell, oData, oRecord, oColumn) {
    var bChecked = oData;
    bChecked = (bChecked) ? " checked" : "";
    elCell.innerHTML = "<input type=\"checkbox\"" + bChecked + " class=\"yui-dt-checkbox\">";
};

 /**
 * Default formatter for cells in columns of type "currency".
 * Can be overridden for custom formatting.
 *
 * @method currencyFormatter
 * @param elCell {HTMLElement} Table cell element.
 * @param oData {Object} Data value for the cell.
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 */
YAHOO.widget.DataTable.currencyFormatter = function(elCell, oData, oRecord, oColumn) {
    // Make it dollars
    var nAmount = oData;
    var markup = "$"+nAmount;

    // Normalize to the penny
    var dotIndex = markup.indexOf(".")
    if(dotIndex < 0) {
        markup += ".00";
    }
    else {//alert(markup.length);
        while(dotIndex != markup.length-3) {
            markup += "0";
        }
    }
    elCell.innerHTML = markup;
};

 /**
 * Default formatter for cells in columns of type "custom".
 * Should be overridden for custom formatting.
 *
 * @method customFormatter
 * @param elCell {HTMLElement} Table cell element.
 * @param oData {Object} Data value for the cell.
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 */
YAHOO.widget.DataTable.customFormatter = function(elCell, oData, oRecord, oColumn) {
    elCell.innerHTML = (oData) ? oData.toString() : "";
};

 /**
 * Default formatter for cells in columns of type "date".
 * Can be overridden for custom formatting.
 *
 * @method dateFormatter
 * @param elCell {HTMLElement} Table cell element.
 * @param oData {Object} Data value for the cell.
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 */
YAHOO.widget.DataTable.dateFormatter = function(elCell, oData, oRecord, oColumn) {
    var oDate = oData;
    elCell.innerHTML = oDate.getMonth() + "/" + oDate.getDate()  + "/" + oDate.getFullYear();
};

 /**
 * Default formatter for cells in columns of type "email".
 * Can be overridden for custom formatting.
 *
 * @method emailFormatter
 * @param elCell {HTMLElement} Table cell element.
 * @param oData {Object} Data value for the cell.
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 */
YAHOO.widget.DataTable.emailFormatter = function(elCell, oData, oRecord, oColumn) {
    var sEmail = oData;
    elCell.innerHTML = "<a href=\"mailto:" + sEmail + "\">" + sEmail + "</a>";
};

 /**
 * Default formatter for cells in columns of type "float".
 * Can be overridden for custom formatting.
 *
 * @method floatFormatter
 * @param elCell {HTMLElement} Table cell element.
 * @param oData {Object} Data value for the cell.
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 */
YAHOO.widget.DataTable.floatFormatter = function(elCell, oData, oRecord, oColumn) {
    var nFloat = oData;
    elCell.innerHTML = nFloat.toString();
};

 /**
 * Default formatter for cells in columns of type "html".
 * Can be overridden for custom formatting.
 *
 * @method htmlFormatter
 * @param elCell {HTMLElement} Table cell element.
 * @param oData {Object} Data value for the cell.
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 */
YAHOO.widget.DataTable.htmlFormatter = function(elCell, oData, oRecord, oColumn) {
    var sMarkup = oData;
    elCell.innerHTML = sMarkup;
};

 /**
 * Default formatter for cells in columns of type "link".
 * Can be overridden for custom formatting.
 *
 * @method linkFormatter
 * @param elCell {HTMLElement} Table cell element.
 * @param oData {Object} Data value for the cell.
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 */
YAHOO.widget.DataTable.linkFormatter = function(elCell, oData, oRecord, oColumn) {
    var sLink = oData;
    elCell.innerHTML = "<a href=\"" + sLink + "\">" + sLink + "</a>";
};

 /**
 * Default formatter for cells in columns of type "number".
 * Can be overridden for custom formatting.
 *
 * @method numberFormatter
 * @param elCell {HTMLElement} Table cell element.
 * @param oData {Object} Data value for the cell.
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 */
YAHOO.widget.DataTable.numberFormatter = function(elCell, oData, oRecord, oColumn) {
    var nNumber = oData;
    elCell.innerHTML = nNumber.toString();
};

 /**
 * Default formatter for cells in columns of type "select".
 * Can be overridden for custom formatting.
 *
 * @method selectFormatter
 * @param elCell {HTMLElement} Table cell element.
 * @param oData {Object} Data value for the cell.
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 */
YAHOO.widget.DataTable.selectFormatter = function(elCell, oData, oRecord, oColumn) {
    var selectedValue = oData;
    var options = oColumn.selectOptions;

    var markup = "<select>";
    if(options) {
        for(var i=0; i<options.length; i++) {
            var option = options[i];
            markup += "<option value=\"" + option + "\"";
            if(selectedValue === option) {
                markup += " selected";
            }
            markup += ">" + option + "</option>";
        }
    }
    else {
        markup += "<option value=\"" + selectedValue + "\" selected>" + selectedValue + "</option>";
    }
    markup += "</select>";
    elCell.innerHTML = markup;
};



/////////////////////////////////////////////////////////////////////////////
//
// Public Custom Event Handlers
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Overridable custom event handler to sort column.
 *
 * @method onEventSortColumn
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 */
YAHOO.widget.DataTable.prototype.onEventSortColumn = function(oArgs) {

    var evt = oArgs.event;
    var target = oArgs.target;
    //TODO: traverse DOM to find a columnKey, incl safety net if none exists
    var whichColumn = target.columnKey;
    if(whichColumn) {
        var allColumns = this._oColumnset.keys;
        var oColumn = null;
        for(var i=0; i<allColumns.length; i++) {
            // Which column are we sorting?
            if(target.columnKey == allColumns[i].key) {
                oColumn = allColumns[i];
                break;
            }
        }

        //TODO: pass in just the column key and find the column object in the sortColumn method or the TH ref?
        this.sortColumn(oColumn);
    }
};

/**
 * Overridable custom event handler to select row.
 *
 * @method onEventSelectRow
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 */
YAHOO.widget.DataTable.prototype.onEventSelectRow = function(oArgs) {
    var evt = oArgs.event;
    var target = oArgs.target;

    //TODO: add a safety net in case TR is never reached
    // Walk up the DOM until we get to the TR
    while(target.nodeName.toLowerCase() != "tr") {
        target = target.parentNode;
    }

    if(this.isSelected(target)) {
        this.unselect(target);
    }
    else {
        if(this.singleSelect && !evt.ctrlKey && !evt.shiftKey) {
            this.unselectAllRows();
        }
        if(evt.shiftKey) {
            var startRow = this._lastSelected;
            if(startRow && this.isSelected(startRow)) {
                this.unselectAllRows();
                if(startRow.sectionRowIndex < target.sectionRowIndex) {
                    for(var i=startRow.sectionRowIndex; i <= target.sectionRowIndex; i++) {
                        this._select(this._elBody.rows[i]);
                    }
                }
                else {
                    for(var i=target.sectionRowIndex; i <= startRow.sectionRowIndex; i++) {
                        this._select(this._elBody.rows[i]);
                    }
                }
            }
            else {
                this._select(target);
            }
        }
        else {
            this.select(target);
        }
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
    var evt = oArgs.event;
    var target = oArgs.target;

    //TODO: add a safety net in case TD is never reached
    // Walk up the DOM until we get to the TD
    while(target.nodeName.toLowerCase() != "td") {
        target = target.parentNode;
    }

    if(this.isSelected(target)) {
        this.unselect(target);
    }
    else {
        if(this.singleSelect && !evt.ctrlKey) {
            this.unselectAllCells();
        }
        this.select(target);
    }
};

/**
 * Overridable custom event handler to edit cell.
 *
 * @method onEventEditCell
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 */
YAHOO.widget.DataTable.prototype.onEventEditCell = function(oArgs) {
    var evt = oArgs.event;
    var element = oArgs.target;

    //TODO: add a safety net in case TD is never reached
    // Walk up the DOM until we get to the TD
    while(element.nodeName.toLowerCase() != "td") {
        element = element.parentNode;
    }

    this.editCell(element);
};

/**
 * Handles data return for adding new rows to bottom of table.
 *
 * @method onDataReturnAppendRows
 * @param sRequest {String} Original request.
 * @param oResponse {Object} Response object.
 */
YAHOO.widget.DataTable.prototype.onDataReturnAppendRows = function(sRequest, oResponse) {
    // Update the Recordset from the response
    var newRecords = this._oRecordset.append(oResponse);
    // Update markup
    this.appendRows(newRecords);
    YAHOO.log("Data returned for " + newRecords.length + " rows","info",this.toString());
};

/**
 * Handles data return for inserting new rows to top of table.
 *
 * @method onDataReturnInsertRows
 * @param sRequest {String} Original request.
 * @param oResponse {Object} Response object.
 */
YAHOO.widget.DataTable.prototype.onDataReturnInsertRows = function(sRequest, oResponse) {
    // Update the Recordset from the response
    var newRecords = this._oRecordset.insert(oResponse);
    // Update markup
    this.insertRows(newRecords);
    YAHOO.log("Data returned for " + newRecords.length + " rows","info",this.toString());
};

/**
 * Handles data return for replacing all existing of table with new rows.
 *
 * @method onDataReturnReplaceRows
 * @param sRequest {String} Original request.
 * @param oResponse {Object} Response object.
 */
YAHOO.widget.DataTable.prototype.onDataReturnReplaceRows = function(sRequest, oResponse) {
    // Update the Recordset from the response
    var newRecords = this._oRecordset.replace(oResponse);
    this.replaceRows(newRecords);
    YAHOO.log("Data returned for " + newRecords.length + " rows","info",this.toString());
};

