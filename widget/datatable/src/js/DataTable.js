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
 * @param elElement {element} Container element -- either existing table markup
 * for progressive-enhancement mode or an empty container for from-scratch mode
 * @param aColumnset {object} Array of column object literals
 * @param oDataSource {object} DataSource instance
 * @param oConfigs {object} (optional) Object literal of configuration values
 */
YAHOO.widget.DataTable = function(elElement,aColumnset,oDataSource,oConfigs) {
    // Internal vars
    this._nIndex = YAHOO.widget.DataTable._nCount;
    this.id = "yui-dt"+this._nIndex;

    // Validate configs
    if(typeof oConfigs == "object") {
        for(var sConfig in oConfigs) {
            this[sConfig] = oConfigs[sConfig];
        }
    }
;
    // Validate DataSource
    //TODO: validation
    if(oDataSource && (oDataSource instanceof YAHOO.widget.DataSource)) {
        this.datasource = oDataSource;
    }
    //TODO: support null datasource for v simple tables
    else {
        YAHOO.log("Could not instantiate DataTable due to an invalid DataSource", "error", this.toString());
        return;
    }

    // Validate and instantiate Columnset and Columns
    //TODO: validation
    if(aColumnset && aColumnset.constructor == Array) {
        var oColumnset = new YAHOO.widget.Columnset(aColumnset);
        this._oColumnset = oColumnset;
    }
    else {
        YAHOO.log("Could not instantiate DataTable due to a Columnset error", "error", this.toString());
        return;
    }

    // Validate HTML Element
    if(YAHOO.util.Dom.inDocument(elElement)) {
        if(elElement.constructor == String) {
            elElement = document.getElementById(elElement);
        }
        var elType = elElement.nodeName.toLowerCase();
        var success = false;

        // Progressively enhance an existing table from markup
        if(elType == "table") {
            elElement.id = this.id+"-table";
            // Create a Recordset
            var aRecords = [];
            //TODO: Is this too hardcoded? Supoprts at most one TBODY in the TABLE!
            var elTbody = elElement.tBodies[0];
            if(elTbody) {
                var numRows = elTbody.rows.length;
                if(numRows > 0) {
                    var index = this._nIndex;
                    for(var i=0; i<numRows; i++) {
                        var oRecord = {};
                        var elRow = elTbody.rows[i];
                        elRow.id = this.id+"-bdrow"+i;
                        var numCells = elRow.cells.length;
                        if(numCells > 0) {
                            for(var j=0; j<numCells; j++) {
                                var elCell = elRow.cells[j];
                                elCell.id = this.id+"-bdrow"+i+"-cell"+j;
                                oRecord[oColumnset.bottom[j].key] = oColumnset.bottom[j].parse(elCell.innerHTML);
                            }
                        aRecords.push(oRecord);
                        }
                    }
                }
            }
            var oRecordset = new YAHOO.widget.Recordset(aRecords, oColumnset);
            this._oRecordset = oRecordset;

            // Then enhance existing markup
            this._elTable = elElement;
            success = this._enhanceTable(oRecordset);
            if(!success) {
                YAHOO.log("Could not progressively enhance existing markup", "error", this.toString());
                return;
            }
            this._initTable();
        }
        // Create a DataTable from scratch
        else {
            this._elContainer = elElement;
            // Send out for recordset data in an asynchronous request
            oDataSource.sendRequest(this.defaultRequest, this._createTable, this);
        }
    }
    // Element not found in document
    else {
        YAHOO.log("Could not instantiate DataTable due to an invalid HTML element", "error", this.toString());
        return;
    }

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
 * Initializes DataTable's DOM-related properties once DOM is finalized
 *
 * @method _initTable
 * @private
 */
YAHOO.widget.DataTable.prototype._initTable = function() {
    var elTable = this._elTable;
    this._elTbody = elTable.tBodies[0];

    var topRowCells = this._elTbody.rows[0].cells;
    var columns = this._oColumnset.bottom;
    for(var i=0; i<topRowCells.length; i++) {
        columns[i].width = topRowCells[i].offsetWidth;
    }

    elTable.tabIndex = 0;

    if(this.fixedwidth) {
        elTable.style.tableLayout = "fixed";
        for(var j=0; j<topRowCells.length; j++) {
            columns[j].width = topRowCells[j].offsetWidth;
            //elHeadRow.cells[j].style.width = setWidth;
        }
    }

    if(this.contextmenu && this.contextmenuOptions) {
        this.contextmenu = new YAHOO.widget.ContextMenu(this.id+"-cm", { trigger: this._elTbody.rows } );
        this.contextmenu.addItem("delete item");
        this.contextmenu.render(document.body);
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
    YAHOO.util.Event.addListener(elTable, "keydown", this._onKeydown, this);
    YAHOO.util.Event.addListener(elTable, "keyup", this._onKeypress, this);
    //YAHOO.util.Event.addListener(elTable, "keyup", this._onKeyup, this);
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
 * Creates Recordset and HTML markup for a table from scratch. Called from DataSource as
 * the callback handler.
 *
 * @method _createTable
 * @param sRequest {String} Original request.
 * @param oResponse {Object} Response object.
 * @param oSelf {Object} The DataTable instance.
 * @return {Boolean} True if markup created successfully, false otherwise.
 * @private
 */
YAHOO.widget.DataTable.prototype._createTable = function(sRequest, oResponse, oSelf) {
    //TODO: provide public accessors

    // Create the element to populate
    var elTable = oSelf._elContainer.appendChild(document.createElement("table"));
    oSelf._elTable = elTable;

    // Get the Columnset
    var oColumnset = oSelf._oColumnset;

    //TODO: support updating existing recordset??

    // Create the Recordset from the response
    oSelf._oRecordset = new YAHOO.widget.Recordset(oResponse, oColumnset);
    var success = oSelf._createThead(elTable, oColumnset);
    if(success) {
        success = oSelf._createTbody(elTable, oColumnset, oSelf._oRecordset);
    }
    oSelf._initTable();
    return success;
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
    var elHead= elTable.appendChild(document.createElement("thead"));
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

    YAHOO.log("Markup for " + oColumnset.length + " columns created in the thead element","info",this.toString());
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

    if(oRecordset) {
        var aRecords = oRecordset.getRecords();
        for(var i=0; i<aRecords.length; i++) {
            var oRecord = aRecords[i];
            // TODO: support sparse array
            if(oRecord) {
                this.appendRow(oRecord);
            }
        }
        YAHOO.log(aRecords.length + " records initialized","info",this.toString());
        return true;
    }
    else {
        YAHOO.log("No records were initialized","warn",this.toString());
    }
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
        if(!this.fixedwidth || (this.fixedwidth && !oColumn.isLast)) {
            var elHeadResizer = elHeadContainer.appendChild(document.createElement("span"));
            elHeadResizer.id = this.id+"-hdrow"+row+"-resizer"+col;
            YAHOO.util.Dom.addClass(elHeadResizer,"yui-dt-headresizer");
            oColumn.ddResizer = new YAHOO.util.WidthResizer(this, elHeadCell.id, elHeadResizer.id, elHeadResizer.id);
            var cancelClick = function(e) {
                YAHOO.util.Event.stopPropagation(e);
            };
            YAHOO.util.Event.addListener(elHeadResizer,"click",cancelClick);
        }
        if(this.fixedwidth) {
            elHeadContainer.style.overflow = "hidden";
            elHeadContent.style.overflow = "hidden";
        }
    }
};

/**
 * Updates the HTML tbody element in the table with the given records.
 * //TODO: driven by # rows in tbody? or # records?
 *
 * @method _updateTableBody
 * @private
 */
YAHOO.widget.DataTable.prototype._updateTableBody = function(aNewRecords) {
//TODO: validate each variable exists
    var elTable = this._elTable;
    var columns = this._oColumnset.bottom;

    // For each row in the tbody...
    var elTableBodyRows = this._elTbody.rows;
    for(var i=0; i< elTableBodyRows.length; i++) {
        if(aNewRecords[i]) {
            var elRow = elTableBodyRows[i];
            elRow.recordId = aNewRecords[i].id;

            // ...Update tbody cells with new data
            for(var j=0; j<columns.length; j++) {
                elCell = elRow.cells[j];
                columns[j].format(elCell, aNewRecords[i]);
            }
        }
    }
};

/**
 * Adds rows. Called from DataSource as the callback handler.
 *
 * @method _addRows
 * @param sRequest {String} Original request.
 * @param oResponse {Object} Response object.
 * @param oSelf {Object} The DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._addRows = function(sRequest, oResponse, oSelf) {
    var elTable = oSelf._elTable;
    var oColumnset = oSelf._oColumnset;
    var oRecordset = oSelf._oRecordset;

    // Update the Recordset from the response
    oRecordset.addRecords(oResponse, oColumnset);
    for(var i=0; i<oResponse.length; i++) {
        oSelf.appendRow(oResponse[i]);
    }
};

/**
 * Replaces existing rows. Called from DataSource as the callback handler.
 *
 * @method _replaceRows
 * @param sRequest {String} Original request.
 * @param oResponse {Object} Response object.
 * @param oSelf {Object} The DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._replaceRows = function(sRequest, oResponse, oSelf) {
    var elTable = oSelf._elTable;
    var oColumnset = oSelf._oColumnset;
    var oRecordset = oSelf._oRecordset;

    // Update the Recordset from the response
    // TODO: get rid of old records?
    oRecordset.addRecords(oResponse, oColumnset);
    oSelf._elTbody.innerHTML = "";
    for(var i=0; i<oResponse.length; i++) {
        oSelf.appendRow(oResponse[i]);
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
        YAHOO.util.Event.stopEvent(e);
	    var elTarget = YAHOO.util.Event.getTarget(e);
	    var elTag = elTarget.nodeName.toLowerCase();
	    var knownTag = false;

        if (elTag != "table") {
            while(!knownTag) {
                switch(elTag) {
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
                case "input":
                    if(elTarget.type.toLowerCase() == "checkbox") {
                        oSelf.fireEvent("checkboxClickEvent",{target:elTarget,event:e});
                        knownTag = true;
                    }
                    else if(elTarget.type.toLowerCase() == "radio") {
                        oSelf.fireEvent("radioClickEvent",{target:elTarget,event:e});
                        knownTag = true;
                    }
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
 * Handles key events on the TABLE element.
 *
 * @method _onKeypress
 * @param e {event} The click event.
 * @param oSelf {object} DataTable instance.
 * @private
 */
//YAHOO.widget.DataTable.prototype._onKeypress = function(e, oSelf) {
//    oSelf.fireEvent("tableKeypressEvent",{target:YAHOO.util.Event.getTarget(e),event:e});
//};

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
 * @property datasource
 * @type YAHOO.widget.DataSource
 */
YAHOO.widget.DataTable.prototype.datasource = null;

 /**
 * True if TABLE width is a fixed size.
 *
 * @property fixedwidth
 * @type Boolean
 * @default false
 */
YAHOO.widget.DataTable.prototype.fixedwidth = false;

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
 * @property contextmenu
 * @type YAHOO.widget.ContextMenu
 */
YAHOO.widget.DataTable.prototype.contextmenu = null;

/////////////////////////////////////////////////////////////////////////////
//
// Public methods
//
/////////////////////////////////////////////////////////////////////////////

 /**
 * Public accessor to the unique name of the data table instance.
 *
 * @method toString
 * @return {string} Unique name of the DataTable instance
 */
YAHOO.widget.DataTable.prototype.toString = function() {
    // TODO: implement _sName?
    return "DataTable " + this._nIndex;
};

 /**
 * Add rows based on query results.
 *
 * @method addRows
 */
YAHOO.widget.DataTable.prototype.addRows = function(sRequest) {
    this.datasource.sendRequest(sRequest, this._addRows, this);
};

 /**
 * Replaces existing rows based on query results.
 *
 * @method replaceRows
 */
YAHOO.widget.DataTable.prototype.replaceRows = function(sRequest) {
    this.datasource.sendRequest(sRequest, this._replaceRows, this);
};

 /**
 * Appends a row into the bottom of the table body.
 *
 * @method appendRow
 */
YAHOO.widget.DataTable.prototype.appendRow = function(oRecord) {
    var index = this._nIndex;
    var oColumnset = this._oColumnset;

    var elRow = this._elTbody.appendChild(document.createElement("tr"));
    var i = this._elTbody.rows.length-1;
    elRow.id = this.id+"-bdrow"+i;
    elRow.recordId = oRecord.id;
    if(i%2) {
        YAHOO.util.Dom.addClass(elRow, YAHOO.widget.DataTable.CLASS_ODD);
    }
    else {
        YAHOO.util.Dom.addClass(elRow, YAHOO.widget.DataTable.CLASS_EVEN);
    }

    // Create tbody cells
    for(var j=0; j<oColumnset.bottom.length; j++) {
        var elCell = elRow.appendChild(document.createElement("td"));
        elCell.id = this.id+"-bdrow"+i+"-cell"+j;
        oColumnset.bottom[j].format(elCell, oRecord);
        /*p.abx {word-wrap:break-word;}
ought to solve the problem for Safari (the long words will wrap in your
tds, instead of overflowing to the next td.
(this is supported by IE win as well, so hide it if needed).

One thing, though: it doesn't work in combination with
'white-space:nowrap'.*/

// need a div wrapper for safari?
        if(this.fixedwidth) {
            elCell.style.overflow = "hidden";
            //elCell.style.width = "20px";
        }
    }
};

 /**
 * Deletes selected rows, including in the Recordset.
 *
 * @method deleteSelectedRows
 */
YAHOO.widget.DataTable.prototype.deleteSelectedRows = function() {
    //TODO: remove from recordset also
    aSelected = YAHOO.util.Dom.getElementsByClassName(YAHOO.widget.DataTable.CLASS_SELECTED,"tr",this._elTbody);
    for(var i=0; i<aSelected.length; i++) {
        this.deleteRow(aSelected[i]);
    }
};

 /**
 * Deletes a given row element.
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
 * @return {array} Array of zero to n selected rows.
 */
YAHOO.widget.DataTable.prototype.getSelectedRows = function() {
    //TODO
};

 /**
 * Returns pointer to the DataTable instance's Columnset instance.
 *
 * @method getColumnset
 * @return {YAHOO.widget.Columnset} Columsnet instance.
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
    var key = YAHOO.util.Event.getCharCode(oArgs.event);
    switch (key) {
        case 46: // delete
            this.deleteSelectedRows();
            break;
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
        // Figure out the column based on TH ref or TH.key
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
        if(!sortFnc) {
            sortFnc = function(a, b) {
                if(sortDir == "desc") {
                    return YAHOO.util.Sort.compareDesc(a[oColumn.key],b[oColumn.key]);
                }
                else {
                    return YAHOO.util.Sort.compareAsc(a[oColumn.key],b[oColumn.key]);
                }
            };
        }

        // Do the actual sort
        var records = this._oRecordset.getRecords();
        var newRecords =  records.sort(sortFnc);
        this._oRecordset.replace(newRecords);
        //TODO: expose thru events
        this._updateTableBody(newRecords);

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
    var columns = this._oColumnset.bottom;
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
            if(selectedValue == option) {
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
        var allColumns = this._oColumnset.flat;
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
    var target = oArgs.target;

    //TODO: add a safety net in case TD is never reached
    // Walk up the DOM until we get to the TD
    while(target.nodeName.toLowerCase() != "td") {
        target = target.parentNode;
    }
    
    this.editCell(target);
};

