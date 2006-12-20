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
    // Internal var needed right away
    this._nIndex = YAHOO.widget.DataTable._nCount;

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
            elElement.id = "yui-dt"+this._nIndex;
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
                        elRow.id = "yui-dt"+index+"-bodyrow"+i;
                        var numCells = elRow.cells.length;
                        if(numCells > 0) {
                            for(var j=0; j<numCells; j++) {
                                var elCell = elRow.cells[j];
                                elCell.id = "yui-dt"+index+"-bodycell"+i+"-"+j;
                                oRecord[oColumnset.columns[j].key] = oColumnset.columns[j].parse(elCell.innerHTML);
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
 * Class name of sortable column text.
 *
 * @property CLASS_SORTABLE
 * @type String
 * @static
 * @final
 */
YAHOO.widget.DataTable.CLASS_SORTABLE = "yui-dt-sortable";
/////////////////////////////////////////////////////////////////////////////
//
// Public member variables
//
/////////////////////////////////////////////////////////////////////////////

 /**
 * DataSource
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
    return "DataTable instance " + this._nIndex;
};

 /**
 * Sets behavioral policies that associate events with behaviors. Can be overridden for
 * customized behavior.
 *
 * @method setPolicy
 * @param {String} (optional) Policy name.
 */
YAHOO.widget.DataTable.prototype.setPolicy = function() {
    this.subscribe("cellClickEvent",this.doSelectRow);
    this.subscribe("theadClickEvent",this.doSort);
    this.subscribe("tableClickEvent",this.doFocus);
    this.subscribe("tableKeypressEvent",this.doKeypress);
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
    
    var elRecordRow = this._elTbody.appendChild(document.createElement("tr"));
    var i = this._elTbody.rows.length-1;
    elRecordRow.id = "yui-dt"+index+"-bodyrow"+i;
    if(i%2) {
        YAHOO.util.Dom.addClass(elRecordRow,"yui-dt-odd");
    }
    else {
        YAHOO.util.Dom.addClass(elRecordRow,"yui-dt-even");
    }

    // Create tbody cells
    for(var j=0; j<oColumnset.columns.length; j++) {
        var elCell = elRecordRow.appendChild(document.createElement("td"));
        elCell.id = "yui-dt"+index+"-bodycell"+i+"-"+j;
        oColumnset.columns[j].format(elCell, oRecord);
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
 * Updates all the cells of a given row element.
 *
 * @method updateRow
 * @param elRow {element} HTML table row element reference.
 */
//YAHOO.widget.DataTable.prototype.updateRow = function(elRow) {
//    var elCell,oRecord,oColumn;
//    formatCell(elCell, oRecord, oColumn);
//};

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
    for(var i=0; i< allRows.length; i++) {
        if(elRow.id == allRows[i].id) {
            this._elTbody.deleteRow(i);
            this.fireEvent("deleteRowEvent");
            break;
        }
    }
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

/////////////////////////////////////////////////////////////////////////////
//
// Public Event Handlers
//
/////////////////////////////////////////////////////////////////////////////

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
 * Handles tableClickEvent.
 *
 * @method doFocus
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 */
YAHOO.widget.DataTable.prototype.doFocus = function(oArgs) {
    this._elTable.focus();
};

/**
 * Handles selection based on DOM events.
 *
 * @method doSelectRow
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 */
YAHOO.widget.DataTable.prototype.doSelectRow = function(oArgs) {
    var evt = oArgs.event;
    var row = oArgs.target;
    while(row.nodeName.toLowerCase() != "tr") {
        row = row.parentNode;
    }
    
    if(this.singleSelect && !evt.ctrlKey) {
        //TODO: convenience method to get to tbody
        this.unselect(YAHOO.util.Dom.getElementsByClassName(YAHOO.widget.DataTable.CLASS_SELECTED,"tr",this._elTbody));
    }
    
    //TODO: if singleSelect allow shift click to select multiple rows

    //TODO: allow arrow key selection

    if(this.isSelected(row)) {
        this.unselect(row);
    }
    else {
        this.select(row);
    }
};

/**
 * Handles sort based on DOM events.
 *
 * @method doSort
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 */
YAHOO.widget.DataTable.prototype.doSort = function(oArgs) {
    var evt = oArgs.event;
    var target = oArgs.target;
    
    var columns = this._oColumnset.columns;
    var column = null;
    for(var i=0; i<columns.length; i++) {
        // Which column are we sorting?
        if(target.key == columns[i].key) {
            column = columns[i];
            break;
        }
    }

    if(column) {
        // What is the default sort direction?
        var sortDir = (column.sortOptions && column.sortOptions.defaultOrder) ? column.sortOptions.defaultOrder : "asc";
        
        // Is the column sorted already?
        if(this.sortedBy == column.key) {
            if(this.sortedByDir) {
                sortDir = (this.sortedByDir == "asc") ? "desc" : "asc";
            }
            else {
                sortDir = (sortDir == "asc") ? "desc" : "asc";
            }
        }
        

        // Define the sort handler function based on the direction
        var sortFnc = null;
        if((sortDir == "desc") && column.sortOptions && column.sortOptions.sortDescHandler) {
            sortFnc = column.sortOptions.sortDescHandler
        }
        else if((sortDir == "asc") && column.sortOptions && column.sortOptions.sortAscHandler) {
            sortFnc = column.sortOptions.sortAscHandler
        }

        // One was not provided so use the default generic sort handler function
        // TODO: use diff default functions based on column data type
        if(!sortFnc) {
            sortFnc = function(a, b) {
                if(sortDir == "desc") {
                    return YAHOO.util.Sort.compareDesc(a[column.key],b[column.key]);
                }
                else {
                    return YAHOO.util.Sort.compareAsc(a[column.key],b[column.key]);
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
        this.sortedBy = column.key;
        this.sortedByDir = sortDir;
        YAHOO.log("Column \"" + target.key + "\" sorted " + sortDir,"info",this.toString());
    }
    else {
        //TODO
        YAHOO.log("Could not do sort");
    }
};

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
//    if(this.fixedwidth) {
//        this._createSpacerTbody(this._elTable, this._oColumnset);
//        this._elTbody = this._elTable.tBodies[1];
//    }
//    else {
        this._elTbody = this._elTable.tBodies[0];
//    }

    var topRowCells = this._elTbody.rows[0].cells;
    var columns = this._oColumnset.columns;
    for(var i=0; i<topRowCells.length; i++) {
        columns[i].width = topRowCells[i].offsetWidth;
    }

    this._elTable.tabIndex = 0;
    this._registerEvents();
    this.setPolicy();
    
    //TODO: finish support for fixed width table :-(
    if(this.fixedwidth) {
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
    for(var i=0; i<oColumnset.rows.length; i++) {
        var elHeadRow = elHead.appendChild(document.createElement("tr"));
        elHeadRow.id = "yui-dt"+index+"-headrow"+i;

        // ...and create header cells
        for(var j=0; j<oColumnset.rows[i].length; j++) {
            var oColumn = oColumnset.rows[i][j];
            var elHeadCell = elHeadRow.appendChild(document.createElement("th"));
            elHeadCell.id = "yui-dt"+index+"-headcell"+i+"-"+j;
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
 * Inserts an HTML tbody element in the table to manage cell widths.
 *
 * @method _createSpacerTbody
 * @param elTable {HTMLElement} DOM reference to the empty TABLE element.
 * @param oColumnset {Object} The table's Columnset object.
 * @private
 */
YAHOO.widget.DataTable.prototype._createSpacerTbody = function(elTable, oColumnset) {
    var contentTbody = elTable.tBodies[0];
    var firstRowCells = contentTbody.rows[0].cells;
    var spacerTbody = elTable.insertBefore(document.createElement("tbody"), contentTbody);
    var spacerRow = spacerTbody.appendChild(document.createElement("tr"));
    for(var i=0; i<firstRowCells.length; i++) {
        var newcell = spacerRow.appendChild(document.createElement("td"));
        newcell.style.width = firstRowCells[i].offsetWidth + "px";
        newcell.style.height = "0px";
    }

    // First iterate through cells to get current widths
    // Insert the spacer tbody
    // Apply current widths
}

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
    for(var row=0; row<oColumnset.rows.length; row++) {
        var elRow = elThead.rows[row];
        elRow.id = "yui-dt"+index+"-headrow"+row;
        var elTheadCellsInRow = elRow.cells;
        var columnsetRow = oColumnset.rows[row];
        for(var col=0; col< columnsetRow.length; col++) {
            var oColumn = columnsetRow[col];
            var elHeadCell = elTheadCellsInRow[col];
            elHeadCell.id = "yui-dt"+index+"-headcell"+row+"-"+col;
            this._enhanceTheadCell(elHeadCell,oColumn,row,col);
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
    elHeadCell.key = oColumn.key;
    elHeadCell.index = oColumn.index;
    elHeadCell.innerHTML = "";

    var elHeadContainer = elHeadCell.appendChild(document.createElement("div"));
    elHeadContainer.id = "yui-dt"+index+"-headcontainer"+row+"-"+col;
    oColumn.id = elHeadContainer.id;
    YAHOO.util.Dom.addClass(elHeadContainer,"yui-dt-headcontainer");
    var elHeadContent = elHeadContainer.appendChild(document.createElement("span"));
    elHeadContent.id = "yui-dt"+index+"-headcontent"+row+"-"+col;
    YAHOO.util.Dom.addClass(elHeadContent,YAHOO.widget.DataTable.CLASS_COLUMNTEXT);
    elHeadContent.innerHTML = oColumn.text || oColumn.key;

    elHeadCell.rowSpan = oColumn.rowspan;
    elHeadCell.colSpan = oColumn.colspan;

    if(oColumn.sortable) {
        YAHOO.util.Dom.addClass(elHeadContent,YAHOO.widget.DataTable.CLASS_SORTABLE);
    }
    if(oColumn.resizeable) {
        //TODO: deal with fixed width tables
        //TODO: figure out whether this is last column programmatically
        if(!this.fixedwidth || (this.fixedwidth && !oColumn.isLast)) {
            var elHeadResizer = elHeadContainer.appendChild(document.createElement("span"));
            elHeadResizer.id = "yui-dt"+index+"-headresizer"+row+"-"+col;
            YAHOO.util.Dom.addClass(elHeadResizer,"yui-dt-headresizer");
            oColumn.ddResizer = new YAHOO.util.WidthResizer(this, elHeadCell.id, elHeadResizer.id, elHeadResizer.id);
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
    var columns = this._oColumnset.columns;

    // For each row in the tbody...
    var elTableBodyRows = this._elTbody.rows;
    for(var i=0; i< elTableBodyRows.length; i++) {
        if(aNewRecords[i]) {
            var elRecordRow = elTableBodyRows[i];

            // ...Update tbody cells with new data
            for(var j=0; j<columns.length; j++) {
                elCell = elRecordRow.cells[j];
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

/////////////////////////////////////////////////////////////////////////////
//
// DOM Events
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Registers browser events on TABLE element.
 *
 * @method _registerEvents
 * @private
 */
YAHOO.widget.DataTable.prototype._registerEvents = function() {
    var elTable = this._elTable;
    YAHOO.util.Event.addListener(elTable, "click", this._onClick, this);
    YAHOO.util.Event.addListener(elTable, "dblclick", this._onDoubleclick, this);
    YAHOO.util.Event.addListener(elTable, "mouseout", this._onMouseout, this);
    YAHOO.util.Event.addListener(elTable, "mouseover", this._onMouseover, this);
    //YAHOO.util.Event.addListener(elTable, "mousedown", this._onMousedown, this);
    //YAHOO.util.Event.addListener(elTable, "mouseup", this._onMouseup, this);
    //YAHOO.util.Event.addListener(elTable, "mousemove", this._onMousemove, this);
    YAHOO.util.Event.addListener(elTable, "keydown", this._onKeydown, this);
    YAHOO.util.Event.addListener(elTable, "keyup", this._onKeypress, this);
    //YAHOO.util.Event.addListener(elTable, "keyup", this._onKeyup, this);
    YAHOO.util.Event.addListener(elTable, "focus", this._onFocus, this);
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
     * Fired when a mouseout occurs on a TD element.
     *
     * @event cellMouseoutEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TD element.
     */
    this.createEvent("cellMouseoutEvent");

    /**
     * Fired when a TD element is clicked.
     *
     * @event cellClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TD element.
     */
    this.createEvent("cellClickEvent");

    /**
     * Fired when a TR element is deleted.
     *
     * @event rowDeleteEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TR element.
     */
    this.createEvent("rowDeleteEvent");

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
     * Fired when a TABLE element receives a keypress.
     *
     * @event tableKeyEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TABLE element.
     * 
     */
    this.createEvent("tableKeypressEvent");

    /**
     * Fired when a column is resized.
     *
     * @event columnResizeEvent
     * @param oArgs.target {HTMLElement} The TH element.
     */
    this.createEvent("columnResizeEvent");
};

/////////////////////////////////////////////////////////////////////////////
//
// DOM Event Handlers
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
                elTag = elTarget.nodeName.toLowerCase();
            }
        }
	    oSelf.fireEvent("tableMouseoverEvent",{target:elTarget,event:e});
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
	    var knownTag = false;

        if (elTag != "table") {
            while(!knownTag) {
                switch(elTag) {
                    case "input":
                        oSelf.fireEvent("checkClickEvent",{target:elTarget,event:e});
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
        /*
                while (elTag != "table") {
            if(elTag == "input") {
                oSelf.fireEvent("checkClickEvent",{target:elTarget,event:e});
                break;
            }
	        else if(elTag == "td") {
	            //oSelf.fireEvent("cellClickEvent",{target:elTarget});
	        }
	        else if (elTag == "th") {
                childWasHead = true;
            	oSelf.fireEvent("theadClickEvent",{target:elTarget,event:e});
	        }
	        else if (elTag == "tr") {
                if(childWasHead) {
                    //oSelf.fireEvent("headRowClickEvent",elTarget);//Worth implementing?
                }
            	else {
                    oSelf.fireEvent("rowClickEvent",{target:elTarget,event:e});
                }
	        }
            // Keep going up the DOM tree
            elTarget = elTarget.parentNode;
            elTag = elTarget.nodeName.toLowerCase();
	    }
        */
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
    var target = YAHOO.util.Event.getTarget(e);
    //YAHOO.log(e.type + ": " + target, "warn");
};

/**
 * Handles mouseout events on the TABLE element.
 *
 * @method _onMouseout
 * @param e {event} The mouseout event.
 * @param oSelf {object} DataTable instance.
 * @private
 */
/*YAHOO.widget.DataTable.prototype._onMouseout = function(e, oSelf) {
    var target = YAHOO.util.Event.getTarget(e);
//    YAHOO.log(e.type + ": " + target, "warn");
};*/

/**
 * Handles mouseover events on the TABLE element.
 *
 * @method _onMouseover
 * @param e {event} The mouseover event.
 * @param oSelf {object} DataTable instance.
 * @private
 */
/*YAHOO.widget.DataTable.prototype._onMouseover = function(e, oSelf) {
    var target = YAHOO.util.Event.getTarget(e);
//    YAHOO.log(e.type + ": " + target, "warn");
};*/

/**
 * Handles key events on the TABLE element.
 *
 * @method _onKeypress
 * @param e {event} The click event.
 * @param oSelf {object} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onKeypress = function(e, oSelf) {
    oSelf.fireEvent("tableKeypressEvent",{target:YAHOO.util.Event.getTarget(e),event:e});
};

/**
 * Handles doubleclick events on a table body element.
 *
 * @method _onTbodyDoubleclick
 * @param e {event} HTML doubleclick event.
 * @param oSelf {object} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onTbodyDoubleclick = function(e,oSelf) {
    //TODO: filter out the cell doubleclick from the tbody click
    //if(YAHOO.util.Event.getTarget(e)) {
        //TODO:  Break functionality out into modular functions: makeEditable, saveEdit, cancelEdit

        //: Check for editability
        var cellEl = YAHOO.util.Event.getTarget(e);
        if(YAHOO.util.Dom.hasClass(cellEl,"yui-dt-editable")) {
            // Provide input UI
            //TODO: use a container
            var editor = oSelf._editor;
            if(!editor) {
                editor = document.body.appendChild(document.createElement("div"));
                editor.style.position = "absolute";
                editor.style.zIndex = 9000;
                editor.innerHTML = "<input style='width:" + cellEl.offsetWidth + "px;height:"+ cellEl.offsetHeight + "px;'>";
                //TODO: Take styles out of inline and set focus into input
                editor.style.display = "none";
                oSelf._editor = editor;
            }
            editor.style.left = YAHOO.util.Dom.getX(cellEl) + "px";
            editor.style.top = YAHOO.util.Dom.getY(cellEl) + "px";
            editor.style.display = "block";
        }
    //}
};

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * Sort utility class to support column sorting.
 *
 * @class Sort
 * @static
 */

YAHOO.util.Sort = {};

/////////////////////////////////////////////////////////////////////////////
//
// Public methods
//
/////////////////////////////////////////////////////////////////////////////

 /**
 * Comparator function for sort in ascending order. String sorting is case insensitive.
 *
 * @method compareAsc
 * @param a {object} First sort argument.
 * @param b {object} Second sort argument.
 */
YAHOO.util.Sort.compareAsc = function(a, b) {
    //TODO: is typeof better or is constructor property better?
    if(a.constructor == String) {
        a = a.toLowerCase();
    }
    if(b.constructor == String) {
        b = b.toLowerCase();
    }
    if(a < b) {
        return -1;
    }
    else if (a > b) {
        return 1;
    }
    else {
        return 0;
    }
};

 /**
 * Comparator function for sort in descending order. String sorting is case insensitive.
 *
 * @method compareDesc
 * @param a {object} First sort argument.
 * @param b {object} Second sort argument.
 */
YAHOO.util.Sort.compareDesc = function(a, b) {
    //TODO: is typeof better or is constructor property better?
    if(a.constructor == String) {
        a = a.toLowerCase();
    }
    if(b.constructor == String) {
        b = b.toLowerCase();
    }
    if(a < b) {
        return 1;
    }
    else if (a > b) {
        return -1;
    }
    else {
        return 0;
    }
};

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * WidthResizer subclasses DragDrop to support resizeable columns.
 *
 * @class WidthResizer
 * @extends YAHOO.util.DragDrop
 * @constructor
 * @param colElId {string} ID of the column element being resized
 * @param handleElId {string} ID of the handle element that causes the resize
 * @param sGroup {string} Group name of related DragDrop items
 */
YAHOO.util.WidthResizer = function(oDataTable, colId, handleId, sGroup, config) {
    if (colId) {
        this.cell = YAHOO.util.Dom.get(colId);
        this.init(handleId, sGroup, config);
        //this.initFrame();
        this.datatable = oDataTable;
        this.setYConstraint(0,0);
    }
    else {
        YAHOO.log("Column resizer could not be created due to invalid colElId","warn");
    }
};

YAHOO.extend(YAHOO.util.WidthResizer, YAHOO.util.DD);

/////////////////////////////////////////////////////////////////////////////
//
// Public event handlers
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Handles mousedown events on the column resizer.
 *
 * @method onMouseDown
 * @param e {string} The mousedown event
 */
YAHOO.util.WidthResizer.prototype.onMouseDown = function(e) {
    this.startWidth = this.cell.offsetWidth;
    this.startPos = YAHOO.util.Dom.getX(this.getDragEl());

    if(this.datatable.fixedwidth) {
        var cellText = YAHOO.util.Dom.getElementsByClassName(YAHOO.widget.DataTable.CLASS_COLUMNTEXT,"span",this.cell)[0];
        this.minWidth = cellText.offsetWidth + 6;
        var sib = this.cell.nextSibling;
        var sibCellText = YAHOO.util.Dom.getElementsByClassName(YAHOO.widget.DataTable.CLASS_COLUMNTEXT,"span",sib)[0];
        this.sibMinWidth = sibCellText.offsetWidth + 6;
//!!
        var left = ((this.startWidth - this.minWidth) < 0) ? 0 : (this.startWidth - this.minWidth);
        var right = ((sib.offsetWidth - this.sibMinWidth) < 0) ? 0 : (sib.offsetWidth - this.sibMinWidth);
        this.setXConstraint(left, right);
        YAHOO.log("cellstartwidth:" + this.startWidth,"time");
        YAHOO.log("cellminwidth:" + this.minWidth,"time");
        YAHOO.log("sibstartwidth:" + sib.offsetWidth,"time");
        YAHOO.log("sibminwidth:" + this.sibMinWidth,"time");
        YAHOO.log("l:" + left + " AND r:" + right,"time");
    }

};

/**
 * Handles mouseup events on the column resizer.
 *
 * @method onMouseUp
 * @param e {string} The mouseup event
 */
YAHOO.util.WidthResizer.prototype.onMouseUp = function(e) {
    //TODO: replace the resizer where it belongs:
    var resizeStyle = YAHOO.util.Dom.get(this.handleElId).style;
    resizeStyle.left = "auto";
    resizeStyle.right = 0;
    resizeStyle.marginRight = "-6px";
    resizeStyle.width = "6px";
    //.yui-dt-headresizer {position:absolute;margin-right:-6px;right:0;bottom:0;width:6px;height:100%;cursor:w-resize;cursor:col-resize;}


    //var cells = this.datatable._elTable.tHead.rows[this.datatable._elTable.tHead.rows.length-1].cells;
    //for(var i=0; i<cells.length; i++) {
        //cells[i].style.width = "5px";
    //}

    //TODO: set new columnset width values
    this.datatable.fireEvent("columnResizeEvent",{datatable:this.datatable,target:YAHOO.util.Dom.get(this.id)});
};

/**
 * Handles drag events on the column resizer.
 *
 * @method onDrag
 * @param e {string} The drag event
 */
YAHOO.util.WidthResizer.prototype.onDrag = function(e) {
    var newPos = YAHOO.util.Dom.getX(this.getDragEl());//YAHOO.log("newpos:"+newPos,"warn");//YAHOO.util.Event.getPageX(e);
    var offsetX = newPos - this.startPos;//YAHOO.log("offset:"+offsetX,"warn");
    YAHOO.log("startwidth:"+this.startWidth + " and offset:"+offsetX,"warn");
    var newWidth = this.startWidth + offsetX;//YAHOO.log("newwidth:"+newWidth,"warn");

    if(newWidth < this.minWidth) {
        newWidth = this.minWidth;
    }

    // Resize the column
    var oDataTable = this.datatable;
    var elCell = this.cell;
    
    //YAHOO.log("newwidth" + newWidth,"warn");
    //YAHOO.log(newWidth + " AND "+ elColumn.offsetWidth + " AND " + elColumn.id,"warn");
    
    // Resize the other columns
    if(oDataTable.fixedwidth) {
        // Moving right or left?
        var sib = elCell.nextSibling;
        var sibIndex = elCell.index + 1;
        var sibnewwidth = sib.offsetWidth - offsetX;
        if(sibnewwidth < this.sibMinWidth) {
            sibnewwidth = this.sibMinWidth;
        }
        for(var i=0; i<oDataTable._oColumnset.length; i++) {
            if((i != elCell.index) &&  (i!=sibIndex)) {
                YAHOO.util.Dom.get(oDataTable._oColumnset.columns[i].id).style.width = oDataTable._oColumnset.columns[i].width + "px";
            }
        }
        sib.style.width = sibnewwidth;
        elCell.style.width = newWidth + "px";
        oDataTable._oColumnset.columns[sibIndex].width = sibnewwidth;
        oDataTable._oColumnset.columns[elCell.index].width = newWidth;
        
    }
    else {
        elCell.style.width = newWidth + "px";
    }

};


