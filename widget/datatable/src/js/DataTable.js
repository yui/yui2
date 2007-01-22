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
    //TODO: support null datasource for v simple tables
    else {
        YAHOO.log("Could not instantiate DataTable due to an invalid DataSource", "error", this.toString());
        return;
    }

    // Validate Columnset
    if(oColumnset && (oColumnset instanceof YAHOO.widget.Columnset)) {
        this._oColumnset = oColumnset;
    }
    else {
        YAHOO.log("Could not instantiate DataTable due to an invalid Columnset", "error", this.toString());
        return;
    }

    // Validate HTML Element
    elContainer = YAHOO.util.Dom.get(elContainer);
    if(elContainer && (elContainer.nodeName.toLowerCase() == "div")) {
        this._elContainer = elContainer;
        // Peek in children to see if TABLE already exists
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
            elTable.id = this.id+"-table";
            // Create a Recordset
            var aRecords = [];
            //TODO: Is this too hardcoded? Supoprts at most one TBODY in the TABLE!
            var elTbody = elTable.tBodies[0];
            if(elTbody) {
                var numRows = elTbody.rows.length;
                if(numRows > 0) {
                    var index = this._nIndex;
                    for(var j=0; j<numRows; j++) {
                        var oRecord = {};
                        var elRow = elTbody.rows[j];
                        //TODO: we need the record before this
                        elRow.id = this.id+"-bdrow"+oRecord.id;
                        var numCells = elRow.cells.length;
                        if(numCells > 0) {
                            for(var k=0; k<numCells; k++) {
                                var elCell = elRow.cells[k];
                                elCell.id = this.id+"-bdrow"+j+"-cell"+k;
                                oRecord[oColumnset.keys[k].key] = oColumnset.keys[k].parse(elCell.innerHTML);
                            }
                        aRecords.push(oRecord);
                        }
                    }
                }
            }
            var oRecordset = new YAHOO.widget.Recordset(aRecords, oColumnset);
            this._oRecordset = oRecordset;

            // Then enhance existing markup
            this._elTable = elTable;
            success = this._enhanceTable(oRecordset);
            if(!success) {
                YAHOO.log("Could not progressively enhance existing markup", "error", this.toString());
                return;
            }
            this._initTable();
        }
        // Create a DataTable from scratch
        else {
            // Send out for recordset data in an asynchronous request
            oDataSource.sendRequest(this.initialRequest, this._createTable, this);
        }
    }
    // Element not found in document
    else {
        YAHOO.log("Could not instantiate DataTable due to an invalid container element", "error", this.toString());
        return;
    }
    
    // Set up sort
    this.subscribe("theadClickEvent",this.onEventSortColumn);

    YAHOO.widget.DataTable._nCount++;
    YAHOO.log("DataTable initialized", "info", this.toString());
};

YAHOO.augment(YAHOO.widget.DataTable, YAHOO.util.EventProvider);

/////////////////////////////////////////////////////////////////////////////
//
// Public constants
//
/////////////////////////////////////////////////////////////////////////////

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
 * @property _elTbody
 * @type HTMLElement
 * @private
 */
YAHOO.widget.DataTable.prototype._elTbody = null;

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

/////////////////////////////////////////////////////////////////////////////
//
// Private methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Initializes DataTable's DOM-related table properties once DOM is finalized
 *
 * @method _initTable
 * @private
 */
YAHOO.widget.DataTable.prototype._initTable = function() {
    var elTable = this._elTable;
    elTable.tabIndex = 0;

    var elTbody = elTable.tBodies[0];
    this._elTbody = elTbody;

    if(this.contextMenu && this.contextMenuOptions) {
        this.contextMenu = new YAHOO.widget.ContextMenu(this.id+"-cm", { trigger: this._elTbody.rows } );
        this.contextMenu.addItem("delete item");
        this.contextMenu.render(document.body);
    }

    if(!this.isEmpty) {
        this._initRows();
    }


    /////////////////////////////////////////////////////////////////////////////
    //
    // DOM Events
    //
    /////////////////////////////////////////////////////////////////////////////
    YAHOO.util.Event.addListener(elTable, "click", this._onClick, this);
    YAHOO.util.Event.addListener(elTable, "dblclick", this._onDoubleclick, this);
    YAHOO.util.Event.addListener(elTable, "mouseout", this._onMouseout, this);
    YAHOO.util.Event.addListener(elTable, "mouseover", this._onMouseover, this);
    YAHOO.util.Event.addListener(elTable, "mousedown", this._onMousedown, this);
    //YAHOO.util.Event.addListener(elTable, "mouseup", this._onMouseup, this);
    //YAHOO.util.Event.addListener(elTable, "mousemove", this._onMousemove, this);
    //YAHOO.util.Event.addListener(elTable, "keydown", this._onKeydown, this);
    //YAHOO.util.Event.addListener(elTable, "keypress", this._onKeypress, this);
    YAHOO.util.Event.addListener(document, "keyup", this._onKeyup, this);
    //YAHOO.util.Event.addListener(elTable, "focus", this._onFocus, this);
    //YAHOO.util.Event.addListener(elTable, "blur", this._onBlur, this);

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
     * Fired when a TH element is mouseover.
     *
     * @event theadMouseoverEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TH element.
     *
     */
    this.createEvent("theadMouseoverEvent");

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
     * Fired when a TH element is mousedown.
     *
     * @event theadMousedownEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TH element.
     */
    this.createEvent("theadMousedownEvent");

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
    this.createEvent("checkboxClickEvent");

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
     * Fired when a TH element is clicked.
     *
     * @event theadClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TH element.
     */
    this.createEvent("theadClickEvent");

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
     * Fired when a TH element is doubleclicked.
     *
     * @event theadDoubleclickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TH element.
     */
    this.createEvent("theadDoubleclickEvent");

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
     * Fired when a TR element is deleted.
     *
     * @event rowDeleteEvent
     * @param oArgs.rowIndex {Number || Array} The index(es) of the deleted row(s).
     * @param oArgs.rowId {String || Array} DOM ID(s) of the deleted row(s).
     * @param oArgs.recordId {String || Array} The Record ID(s) of the deleted row(s).
     */
    this.createEvent("rowDeleteEvent");
    this.subscribe("rowDeleteEvent", this._onRowDelete);
};

/**
 * Initializes DataTable's DOM-related row properties once DOM is finalized
 *
 * @method _initRows
 * @private
 */
YAHOO.widget.DataTable.prototype._initRows = function() {
    var topRowCells = this._elTbody.rows[0].cells;
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
 * Creates Recordset and HTML markup for a table from scratch. Called from DataSource as
 * the callback handler.
 *
 * @method _createTable
 * @param sRequest {String} Original request.
 * @param oResponse {Object} Response object.
 * @return {Boolean} True if markup created successfully, false otherwise.
 * @private
 */
YAHOO.widget.DataTable.prototype._createTable = function(sRequest, oResponse) {
    // Clear the container
    this._elContainer.innerHTML = "";
    //TODO: provide public accessors

    // Create the TABLE
    var elTable = document.createElement("table");
    this._elTable = this._elContainer.appendChild(elTable);//    this._elTable = elTable;
    
    // Create summary, if applicable
    if(this.summary) {
        this._elTable.summary = this.summary;
    }
    
    // Create caption, if applicable
    if(this.caption) {
        this._elCaption = this._elTable.appendChild(document.createElement("caption"));
        this._elCaption.innerHTML = this.caption;
    }

    // Get the Columnset
    var oColumnset = this._oColumnset;

    //TODO: support updating existing recordset??
    this._createThead(elTable, oColumnset);

    // Create the Recordset from the response
    var oRecordset = new YAHOO.widget.Recordset(oResponse, oColumnset);
    this._oRecordset = oRecordset;
    
    // TODO: Give implementers a chance to sort Recordset before DOM gets created
    this._createTbody(elTable, oColumnset, oRecordset);

    this._initTable();

    
};

/**
 * Creates an HTML THEAD element in the TABLE.
 *
 * @method _createThead
 * @param elTable {HTMLElement} DOM reference to the TABLE element.
 * @param oColumnset {Object} The table's Columnset object.
 * @return {Boolean} True if markup created successfully, false otherwise.
 * @private
 */
YAHOO.widget.DataTable.prototype._createThead = function(elTable, oColumnset) {
    // Create thead row
    var elHead = document.createElement("thead");
    var index = this._nIndex;

    // Iterate through each row...
    for(var i=0; i<oColumnset.tree.length; i++) {
        var elHeadRow = elHead.appendChild(document.createElement("tr"));
        elHeadRow.id = this.id+"-hdrow"+i;

        // ...and create header cells
        for(var j=0; j<oColumnset.tree[i].length; j++) {
            var oColumn = oColumnset.tree[i][j];
            var elHeadCell = elHeadRow.appendChild(document.createElement("th"));
            elHeadCell.id = oColumn.id;
            this._enhanceTheadCell(elHeadCell,oColumn,i,j);
        }
    }

    this._elHead = this._elTable.appendChild(elHead);
    YAHOO.log("Table head with " + oColumnset.keys.length + " columns created","info",this.toString());
    return true;
};

/**
 * Creates an HTML TBODY element in the table, and creates cells within it.
 *
 * @method _createTbody
 * @param elTable {HTMLElement} DOM reference to the empty TABLE element.
 * @param oColumnset {Object} The table's Columnset object.
 * @param oRecordset {Object} The table's Recordset object.
 * @private
 */
YAHOO.widget.DataTable.prototype._createTbody = function(elTable, oColumnset, oRecordset) {
    // Create tbody row
    this._elTbody = elTable.appendChild(document.createElement("tbody"));

    if(oRecordset && (oRecordset.getLength() > 0)) {
        var aRecords = oRecordset.getRecords();
        if(aRecords) {
            // Set up pagination
            if(this.paginator) {
                var pag = (typeof this.paginator == "object") ? this.paginator : {};

                // Validate range
                var currentRange = pag.currentRange =
                        (pag.initialMaxRows && !isNaN(pag.initialMaxRows)) ? pag.initialMaxRows : 100;

                // Validate current page number
                var currentPage = pag.currentPage = parseInt(pag.initialPage) || 1;

                // How many rows this page
                var maxRows = (currentRange && (currentRange < aRecords.length)) ?
                currentRange : aRecords.length;

                // How many total pages
                var totalPages = pag.totalPages = Math.ceil(aRecords.length / maxRows);

                // First row of this page
                pag.currentStartRecord = (currentPage-1) * currentRange;

                // How many page links to display
                var maxPageLinksDisplayed = pag.maxPageLinksDisplayed =
                    (!isNaN(pag.maxPageLinksDisplayed) && (pag.maxPageLinksDisplayed < totalPages)) ?
                    pag.maxPageLinksDisplayed : totalPages;

                // First link of this page
                pag.currentStartLink = (currentPage < maxPageLinksDisplayed) ? 1 : currentPage;

                this.paginator = pag;
                this.paginate();
            }
            // Show all rows on one page
            else {
                // Add rows
                for(var i=0; i<aRecords.length; i++) {
                    var oRecord = aRecords[i];
                    // TODO: support sparse array
                    if(oRecord) {
                        this.addRow(oRecord);
                    }
                }
            }
            YAHOO.log("Table with " + aRecords.length + " records and " + (maxRows || aRecords.length) + " rows created","info",this.toString());
            return true;
        }
    }

    // No Recordset or no Records
    this.isEmpty = true;
    var elRow = this._elTbody.appendChild(document.createElement("tr"));
    this.formatEmptyRow(elRow);
    YAHOO.log("Emtpy table body created","info",this.toString());

};

/**
 * Enhances existing HTML markup for a table with DataTable functionality.
 *
 * @method _enhanceTable
 * @param oRecordset {YAHOO.widget.Recordset} Pointer to DataTable's Recordset instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._enhanceTable = function(oRecordset) {
    var success = this._enhanceThead();
    return success;
};


/**
 * Enhance existing table's thead markup.
 *
 * @method _enhanceTheadMarkup
 * @private
 */
YAHOO.widget.DataTable.prototype._enhanceThead = function() {
    var oColumnset = this._oColumnset;
    var elThead = this._elTable.tHead;
    var index = this._nIndex;
    for(var nodelevel=0; nodelevel<oColumnset.tree.length; nodelevel++) {
        var elRow = elThead.rows[nodelevel];
        elRow.id = this.id+"-hdrow"+nodelevel;
        var elTheadCellsInRow = elRow.cells;
        var columnsetRow = oColumnset.tree[nodelevel];
        for(var col=0; col< columnsetRow.length; col++) {
            var oColumn = columnsetRow[col];
            var elHeadCell = elTheadCellsInRow[col];
            elHeadCell.id = oColumn.id;
            this._enhanceTheadCell(elHeadCell,oColumn,nodelevel,col);
        }
    }
    return true;
};

/**
 * Formats a cell in the table's thead element.
 *
 * @method _enhanceTheadCell
 * @param elHeadCell {HTMLElement} HTML table thead cell element reference.
 * @param oColumn {YAHOO.widget.Column} Column object.
 * @param row {number} Row index.
 * @param col {number} Column index.
 * @private
 */
YAHOO.widget.DataTable.prototype._enhanceTheadCell = function(elHeadCell,oColumn,row,col) {
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
    if(oColumn.resizeable) {
        //TODO: deal with fixed width tables
        //TODO: figure out whether this is last column programmatically
        if(!this.fixedWidth || (this.fixedwidth && !oColumn.isLast)) {
            var elHeadResizer = elHeadContainer.appendChild(document.createElement("span"));
            elHeadResizer.id = this.id+"-hdrow"+row+"-resizer"+col;
            YAHOO.util.Dom.addClass(elHeadResizer,"yui-dt-headresizer");
            oColumn.ddResizer = new YAHOO.util.WidthResizer(this, elHeadCell.id, elHeadResizer.id, elHeadResizer.id);
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
};

/**
 * Restripes rows with class YAHOO.widget.DataTable.CLASS_EVEN or
 * YAHOO.widget.DataTable.CLASS_ODD.
 *
 * @method _restripeRows
 * @private
 */
YAHOO.widget.DataTable.prototype._restripeRows = function(range) {
    if(!range) {
        var rows = this._elTbody.rows;
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

/////////////////////////////////////////////////////////////////////////////
//
// Private DOM Event Handlers
//
/////////////////////////////////////////////////////////////////////////////

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
                    	oSelf.fireEvent("theadMouseoverEvent",{target:elTarget,event:e});
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
                    	oSelf.fireEvent("theadMousedownEvent",{target:elTarget,event:e});
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
                	oSelf.fireEvent("theadClickEvent",{target:elTarget,event:e});
                	knownTag = true;
                	break;
                default:
                    break;
            }
            elTarget = elTarget.parentNode;
            elTag = elTarget.nodeName.toLowerCase();
        }
    }
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
                	oSelf.fireEvent("theadDoubleclickEvent",{target:elTarget,event:e});
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
 * Handles keyup events on the DOCUMENT.
 *
 * @method _onKeyup
 * @param e {event} The mouseover event.
 * @param oSelf {object} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onKeyup = function(e, oSelf) {
    // esc
    if((e.keyCode == 27) && (oSelf.activeEditor)) {
        oSelf.activeEditor.hideEditor();
        oSelf.activeEditor = null;
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
                            oSelf.showPage(parseInt(elTarget.innerHTML));
                            break;
                        case "yui-dt-firstlink":
                            oSelf.showPage(1);
                            break;
                        case "yui-dt-lastlink":
                            oSelf.showPage(parseInt(oSelf.paginator.totalPages));
                            break;
                        case "yui-dt-prevlink":
                            oSelf.showPage(parseInt(oSelf.paginator.currentPage-1));
                            break;
                        case "yui-dt-nextlink":
                            oSelf.showPage(parseInt(oSelf.paginator.currentPage+1));
                            break;
                    }
                    knownTag = true;
                    break;
                case "select":
                    var newRange = parseInt(elTarget[elTarget.selectedIndex].text);
                    if(newRange != oSelf.paginator.currentRange) {
                        // New range
                        var currentRange = oSelf.paginator.currentRange = newRange;
                        
                        // How many records
                        var recordsLength = oSelf._oRecordset.getRecords().length;
                        
                        // First row of this page
                        var currentStartRecord = oSelf.paginator.currentStartRecord = (currentRange > recordsLength ) ?
                            0: oSelf.paginator.currentStartRecord;

                        // Current page
                        var currentPage = oSelf.paginator.currentPage = (currentRange > recordsLength ) ?
                            1 : Math.ceil(currentStartRecord / currentRange) + 1;
                        
                        // How many rows this page
                        var maxRows = (currentRange && (currentRange < recordsLength)) ?
                        currentRange : recordsLength;

                        // How many total pages
                        oSelf.paginator.totalPages = (currentRange > recordsLength) ?
                            1 : Math.ceil(recordsLength / maxRows);

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
 * Formats an emtpy row for no data.
 *
 * @method formatEmptyRow
 * @param elRow {HTMLElement} Reference to the TR.
 */
YAHOO.widget.DataTable.prototype.formatEmptyRow = function(elRow) {
    var elCell = elRow.appendChild(document.createElement("td"));
    elCell.colSpan = this._oColumnset.keys.length;
    elCell.className = YAHOO.widget.DataTable.CLASS_EMPTY
    elCell.innerHTML = "There is no data for this table";

};

 /**
 * Add rows to bottom of table body.
 *
 * @method addRow
 * @param aRecords {YAHOO.widget.Record[]} Array of Records.
 */
YAHOO.widget.DataTable.prototype.appendRows = function(aRecords) {
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
    var elTbody = this._elTbody;
    var elTableBodyRows = this._elTbody.rows;
    // Remove extra rows
    while(elTbody.hasChildNodes() && (elTableBodyRows > aRecords.length)) {
        elTbody.deleteRow(0);
    }
    // Format in-place existing rows
    for(var i=0; i<elTableBodyRows.length; i++) {
        if(aRecords[i]) {
            this.updateRow(aRecords[i],i);
        }
    }
    // Add rows as necessary
    for(var j=elTableBodyRows.length; j<aRecords.length; j++) {
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
    if(this.isEmpty && (this._elTbody.rows.length == 1)) {
        this._elTbody.deleteRow(0);
    }

    // Is this an insert or an append?
    var insert = (isNaN(i)) ? false : true;
    if(!insert) i = this._elTbody.rows.length;
    
    var oColumnset = this._oColumnset;
    var oRecordset = this._oRecordset;

    var elRow = (insert && this._elTbody.rows[i]) ?
        this._elTbody.insertBefore(document.createElement("tr"),this._elTbody.rows[i]) :
        this._elTbody.appendChild(document.createElement("tr"));
    var recId = oRecord.id;
    elRow.id = this.id+"-bdrow"+recId;
    elRow.recordId = recId;

    // Create tbody cells
    for(var j=0; j<oColumnset.keys.length; j++) {
        if(oColumnset.keys[j].key) {
            var elCell = elRow.appendChild(document.createElement("td"));
            elCell.id = this.id+"-bdrow"+i+"-cell"+j;
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

    if(this.isEmpty && (this._elTbody.rows.length > 0)) {
        this._initRows()
        this.isEmpty = false;
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
        var elRow = this._elTbody.rows[i];
        elRow.recordId = oRecord.id;
        
        var columns = this._oColumnset.keys;
        // ...Update tbody cells with new data
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

    //TODO: set isEmpty and call formatEmptyRow if all rows have been deleted
};

 /**
 * Deletes a given row element as well its corresponding Record in the Recordset.
 *
 * @method deleteRow
 * @param elRow {element} HTML table row element reference.
 */
YAHOO.widget.DataTable.prototype.deleteRow = function(elRow) {
    var allRows = this._elTbody.rows;
    var id = elRow.id;
    var recordId = elRow.recordId;
    for(var i=0; i< allRows.length; i++) {
        if(id == allRows[i].id) {
            this._elTbody.deleteRow(i);

            // Update the Recordset
            this._oRecordset.deleteRecord(i);
            break;
        }
    }
    this.fireEvent("rowDeleteEvent",{rowIndex: i, rowId: id, recordId: recordId});

//TODO: set isEmpty and call formatEmptyRow if all rows have been deleted
};

 /**
 * Sets one or more rows to the selected state.
 *
 * @method select
 * @param aRows {HTMLElement | String | HTMLElement[] | String[]} HTML TR element
 * reference, TR String ID, array of HTML TR element, or array of TR element IDs.
 */
YAHOO.widget.DataTable.prototype.select = function(els) {
    if(els.constructor != Array) {
        els = [els];
    }
    for(var i=0; i<els.length; i++) {
        YAHOO.util.Dom.addClass(YAHOO.util.Dom.get(els[i]),YAHOO.widget.DataTable.CLASS_SELECTED);
    }
};

 /**
 * Sets one or more rows to the unselected.
 *
 * @method unselect
 * @param aRows {HTMLElement | String | HTMLElement[] | String[]} HTML element
 * reference, element ID, array of HTML elements, or array of element IDs
 */
YAHOO.widget.DataTable.prototype.unselect = function(els) {
    if(els.constructor != Array) {
        els = [els];
    }
    for(var i=0; i<els.length; i++) {
        YAHOO.util.Dom.removeClass(YAHOO.util.Dom.get(els[i]),YAHOO.widget.DataTable.CLASS_SELECTED);
    }
};

/**
 * Unselects all selected rows.
 *
 * @method unselectAllRows
 */
YAHOO.widget.DataTable.prototype.unselectAllRows = function() {
    this.unselect(YAHOO.util.Dom.getElementsByClassName(YAHOO.widget.DataTable.CLASS_SELECTED,"tr",this._elTbody));
};

/**
 * Unselects all selected cells.
 *
 * @method unselectAllCells
 */
YAHOO.widget.DataTable.prototype.unselectAllCells = function() {
    this.unselect(YAHOO.util.Dom.getElementsByClassName(YAHOO.widget.DataTable.CLASS_SELECTED,"td",this._elTbody));
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
 * @return {HTMLElement[]} Array of selected rows elements.
 */
YAHOO.widget.DataTable.prototype.getSelectedRows = function() {
   return YAHOO.util.Dom.getElementsByClassName(YAHOO.widget.DataTable.CLASS_SELECTED,"tr",this._elTbody);
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
    var startRecord = this.paginator.currentStartRecord = (nPage-1) * currentRange;
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
        if(this.sortedBy == oColumn.id) {
            if(this.sortedByDir) {
                sortDir = (this.sortedByDir == "asc") ? "desc" : "asc";
            }
            else {
                sortDir = (sortDir == "asc") ? "desc" : "asc";
            }
        }

        // Define the sort handler function based on the direction
        var sortFnc = null;
        if((sortDir == "desc") && oColumn.sortOptions && oColumn.sortOptions.sortDescHandler) {
            sortFnc = oColumn.sortOptions.sortDescHandler
        }
        else if((sortDir == "asc") && oColumn.sortOptions && oColumn.sortOptions.sortAscHandler) {
            sortFnc = oColumn.sortOptions.sortAscHandler
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
        this.sortedBy = oColumn.id;
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
    elCell.innerHTML = "<input type=\"checkbox\"" + bChecked + ">";
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
    elCell.innerHTML = oDate.getMonth() + "/" + oDate.getDate()  + "/" + oDate.getYear();
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
        if(this.singleSelect && !evt.ctrlKey) {
            this.unselectAllRows();
        }
        this.select(target);
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
};

