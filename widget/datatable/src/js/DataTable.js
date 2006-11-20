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
    //TODO: DS may not be required if DT is from markup?
    if(oDataSource && (oDataSource instanceof YAHOO.widget.DataSource)) {
        this.oDataSource = oDataSource;
    }
    else {
        YAHOO.log("Could not instantiate DataTable due to an invalid DataSource", "error", this.toString());
        return;
    }

    // Instantiate Columnset and Column objects
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

        // Progressively enhance an existing table
        if(elType == "table") {alert(elElement.tBodies[0]);
            // Create a DataTable from markup: create recordset from markup and enhance markup
            // TODO: validate the following inputs -- do we take the table or require the tbody??
            //TODO: use new Recordset
            this._oRecordset = this._createRecordsetFromMarkup(elElement.tBodies[0], oColumnset);

            // Then enhance existing markup
            this._elTable = elElement;
            success = this._enhanceTableMarkup();
            if(!success) {
                YAHOO.log("Could not progressively enhance existing markup", "error", this.toString());
                return;
            }
        }
        // Create a DataTable from scratch: create recordset from datasource and create markup
        else {
            this._elContainer = elElement;
            // Send out for recordset data in an asynchronous request
            oDataSource.sendRequest(this.defaultRequest, this._createTableFromScratch, this);
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


/////////////////////////////////////////////////////////////////////////////
//
// Public methods
//
/////////////////////////////////////////////////////////////////////////////

 /**
 * Public accessor to the unique name of the data table instance.
 *
 * @method toString
 * @return {string} Unique name of the data table instance
 */
YAHOO.widget.DataTable.prototype.toString = function() {
    return "DataTable instance " + this._nIndex;
};

 /**
 * Inserts a row into the top of the table body.
 *
 * @method insertRow
 */
YAHOO.widget.DataTable.prototype.insertRow = function() {
    var newRow = this._elTable.tBodies[0].insertRow(0);
    YAHOO.log("New row inserted","info",this.toString());
};

 /**
 * Updates all the cells of a given row element.
 *
 * @method updateRow
 * @param elRow {element} HTML table row element reference.
 */
YAHOO.widget.DataTable.prototype.updateRow = function(elRow) {
    var elCell,oRecord,oColumn;
    formatCell(elCell, oRecord, oColumn);
};

 /**
 * Deletes a given row element.
 *
 * @method deleteRow
 * @param elRow {element} HTML table row element reference.
 */
YAHOO.widget.DataTable.prototype.deleteRow = function(elRow) {
    //TODO
};

 /**
 * Selects a given row element.
 *
 * @method selectRow
 * @param elRow {element} HTML table row element reference.
 */
YAHOO.widget.DataTable.prototype.selectRow = function(elRow) {
    //TODO
};

 /**
 * Unselects a given row element.
 *
 * @method unselectRow
 * @param elRow {element} HTML table row element reference.
 */
YAHOO.widget.DataTable.prototype.unselectRow = function(elRow) {
    //TODO
};

 /**
 * Returns true if given row element is select, false otherwise.
 *
 * @method isRowSelected
 * @param elRow {element} HTML table row element reference.
 * @return {boolean} True if row is selected
 */
YAHOO.widget.DataTable.prototype.isRowSelected = function(elRow) {
    //TODO
};

 /**
 * Returns array of selected row or rows.
 *
 * @method getSelectedRows
 * @return {array} Array of selected row or rows.
 */
YAHOO.widget.DataTable.prototype.getSelectedRows = function() {
    //TODO
};

 /**
 * Updates a table cell element with data and presentation.
 *
 * @method formatCell
 * @param elCell {element} HTML table cell element reference.
 * @param oRecord {object} DataTable record object.
 * @param oColumn {object} DataTable column object.
 *
 */
YAHOO.widget.DataTable.prototype.formatCell = function(elCell, oRecord, oColumn) {
    elCell.innerHTML = oRecord[oColumn.key];
    //TODO: make sure this gets propagated to overriders
    if(oColumn.editable) {
        YAHOO.util.Dom.addClass(elCell,"yui-dt-editable");
    }
};

 /**
 * Parses cell contents to extract data and presentation for internal storage by
 * the DataTable class.
 *
 * @method parseCell
 * @param elCell {element} HTML table cell element reference.
 * @param oRecord {object} DataTable record object.
 * @param oColumn {object} DataTable column object.
 */
YAHOO.widget.DataTable.prototype.parseCell = function(elCell, oRecord, oColumn) {
    oRecord[oColumn.key] = elCell.innerHTML;
};

 /**
 * Sorts a column.
 *
 * @method sortColumn
 * @param oColumn {object} DataTable column object.
 */
YAHOO.widget.DataTable.prototype.sortColumn = function(oColumn) {
    //TODO
};

 /**
 * Handles the initial XHR DataSource response to create table from scratch
 *
 * @method handleResponse
 * @param sRequest {string} Original request.
 * @param oResp {object} XHR DataSource response.
 */
//YAHOO.widget.DataTable.prototype.handleInitXHRResponse = function(sRequest, oResponse, oSelf) {
    // First create recordset
    //oSelf._oRecordset = new YAHOO.widget.Recordset(oResponse);

    // Create markup from scratch
    //var success = oSelf._createTable(oSelf._elTable,oSelf._oColumnset,oSelf._oRecordset);
    //if(!success) {
        //YAHOO.log("Could not create markup from scratch", "error", oSelf.toString());
        //return;
    //}
//};

 /**
 * Parses XHR DataSource response into an array of data records for consumption
 * into recordset.
 *
 * @method getRecordsFromResponse
 * @param sRequest {object} Original request.
 * @param oResponse {object} XHR DataSource response.
 * @return aRecords {array} Array of data records.
 */
YAHOO.widget.DataTable.prototype.getRecordsFromResponse = function(sRequest,oResponse) {
    var nEnd = ((this.responseStripAfter !== "") && (oResponse.indexOf)) ?
        oResponse.indexOf(this.responseStripAfter) : -1;
    if(nEnd != -1) {
        oResponse = oResponse.substring(0,nEnd);
    }
    var aSchema = this.aSchema;
    var aRecords = [];
    var oRecord = {};
    var xmlList = oResponse.responseXML.getElementsByTagName(aSchema[0]);
    if(!xmlList) {
        var bError = true;
        //TODO: do something on error
    }
    // Loop through each result in the nodelist
    for(var k = xmlList.length-1; k >= 0 ; k--) {
        // Parse one result node at a time and stash data in fieldSet
        oRecord = xmlList.item(k);
        //YAHOO.log("oRecord"+k+" is "+oRecord.attributes.item(0).firstChild.nodeValue,"debug",this.toString());

        // Loop through each data field in each result using the schema
        for(var m = aSchema.length-1; m >= 1 ; m--) {
            //YAHOO.log(aSchema[m]+" is "+oRecord.attributes.getNamedItem(aSchema[m]).firstChild.nodeValue,"debug",this.toString());
            var sValue = null;
            // Values may be held in an attribute...
            var xmlAttr = oRecord.attributes.getNamedItem(aSchema[m]);
            if(xmlAttr) {
                sValue = xmlAttr.value;
                //YAHOO.log("Attr value is "+sValue,"debug",this.toString());
            }
            // ...or in a node
            else {
                var xmlNode = oRecord.getElementsByTagName(aSchema[m]);
                if(xmlNode && xmlNode.item(0) && xmlNode.item(0).firstChild) {
                    sValue = xmlNode.item(0).firstChild.nodeValue;
                    //YAHOO.log("Node value is "+sValue,"debug",this.toString());
                }
                else {
                    sValue = "";
                    YAHOO.log("Value not found","debug",this.toString());
                }
            }
            // Capture the data into the record
            oRecord[aSchema[m]] = sValue;
        }
        // Capture each data fieldset an array of results
        aRecords.unshift(oRecord);
    }
    return aRecords;
};

 /**
 * Handles an XHR DataSource response to update recordset and markup
 *
 * @method handleXHRResponse
 * @param sRequest {string} Original request.
 * @param oResponse {object} XHR DataSource response.
 */
//YAHOO.widget.DataTable.prototype.handleXHRResponse = function(sRequest, oResponse) {
    //alert(oResponse);
//};



/////////////////////////////////////////////////////////////////////////////
//
// Public Events
//
/////////////////////////////////////////////////////////////////////////////

 //TODO: create custom events for these
 
/**
 * Fired when a table is created from scratch.
 *
 * @event tableCreated
 * @param oDataTable {object} The data table instance
 */
YAHOO.widget.DataTable.prototype.tableCreated = null;

/**
 * Fired when a table is parsed from existing markup.
 *
 * @event tableParsed
 * @param oDataTable {object} The data table instance
 */
YAHOO.widget.DataTable.prototype.tableParsed = null;

/**
 * Fired when a table row is inserted.
 *
 * @event rowInserted
 * @param elRow {element} The table row element
 */
YAHOO.widget.DataTable.prototype.rowInserted = null;

/**
 * Fired when a table row is updated.
 *
 * @event rowUpdated
 * @param elRow {element} The table row element
 */
YAHOO.widget.DataTable.prototype.rowUpdated = null;

/**
 * Fired when a table row is deleted.
 *
 * @event rowDeleted
 * @param rowId {string} The unique row ID string
 */
YAHOO.widget.DataTable.prototype.rowDeleted = null;

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
 * Table element reference.
 *
 * @property _elTable
 * @type element
 * @private
 */
YAHOO.widget.DataTable.prototype._elTable = null;

/**
 * An array of Column objects that describe each column of the table.
 *
 * @property columnset
 * @type object
 */
YAHOO.widget.DataTable.prototype._oColumnset = null;

/////////////////////////////////////////////////////////////////////////////
//
// Private methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Creates a recordset for internal use based on table markup
 *
 * @method _createRecordsetFromMarkup
 * @return {Object} Recordset object
 * @private
 */
YAHOO.widget.DataTable.prototype._createRecordsetFromMarkup = function(elTbody,oColumnset) {
    var aRecords = [];
    if(elTbody) {
        var elRows = elTbody.rows;
        if(elRows.length > 0) {
            for(var i=0; i<elRows.length; i++) {
                var oRecord = {};
                var elCells = elRows[i].cells;
                if(elCells.length > 0) {
                    for(var j=0; j<elCells.length; j++) {
                        var cell = elCells[j];
                        //TODO: customizable parse cell function
                        this.parseCell(cell,oRecord,oColumnset.columns[j]);
                    }
                aRecords.push(oRecord);
                this._updateRow(elRows[i]);
                }
            }
        }
        return new YAHOO.widget.Recordset(aRecords, oColumnset);
    }
    YAHOO.log("Recordset has no data","warn",this.toString());
};

/**
 * Creates a recordset for internal use based on DataSource response
 *
 * @method _createRecordsetFromDataSource
 * @return {Object} Recordset object
 * @private
 */
YAHOO.widget.DataTable.prototype._createRecordsetFromDataSource = function(oDataSource,oColumnset) {
    return new YAHOO.widget.Recordset(oDataSource.getResponse(this.defaultRequest), oColumnset);
};

/**
 * Creates HTML markup for a table from scratch. Called from DataSource as the callback.
 *
 * @method _createTableFromScratch
 * @param sRequest {String} Original request.
 * @param oResponse {Object} Response object.
 * @param oSelf {Object} The DataTable instance.
 * @return {Boolean} True if markup created successfully, false otherwise.
 * @private
 */
YAHOO.widget.DataTable.prototype._createTableFromScratch = function(sRequest, oResponse, oSelf) {
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
    return success;
};

/**
 * Creates an HTML thead element in the table.
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

    // Iterate through each row...
    for(var i=0; i<oColumnset.rows.length; i++) {
        var elHeadRow = elHead.appendChild(document.createElement("tr"));

        // ...and create header cells
        for(var j=0; j<oColumnset.rows[i].length; j++) {
            var oCell = oColumnset.rows[i][j];
            var elHeadCell = elHeadRow.appendChild(document.createElement("th"));
            elHeadCell.id = "yui-dt"+this._nIndex+"-th"+j+i;
            this._formatHeadCell(elHeadCell,oCell,i,j);
        }
    }

    //TODO: finish support for fixed width table :-(
    if(this.fixedwidth) {
        for(var j=0; j<elHeadRow.cells.length; j++) {
            var setWidth = elHeadRow.cells[j].offsetWidth + "px";
            elHeadRow.cells[j].style.width = setWidth;
            //Debug:
            YAHOO.log(elHeadRow.cells[j].style.width,"warn");
        }
    }
    YAHOO.log("Markup for " + oColumnset.length + " columns created in the thead element","info",this.toString());
    return true;
};

/**
 * Creates an HTML tbody element in the table, and creates cells within in.
 *
 * @method _createTbody
 * @param elTable {HTMLElement} DOM reference to the empty TABLE element.
 * @param oColumnset {Object} The table's Columnset object
 * @param oRecordset {Object} The table's Recordset object
 * @private
 */
YAHOO.widget.DataTable.prototype._createTbody = function(elTable, oColumnset, oRecordset) {
    // Create tbody row
    var elTableBody = elTable.appendChild(document.createElement("tbody"));
    
    if(oRecordset) {
        var aRecords = oRecordset.getRecords();
        for(var j=0; j<aRecords.length; j++) {
            var oRecord = aRecords[j];
            // TODO: support sparse array
            if(oRecord) {
                var elRecordRow = elTableBody.appendChild(document.createElement("tr"));
                if(j%2) {
                    YAHOO.util.Dom.addClass(elRecordRow,"yui-dt-odd");
                }
                this._updateRow(elRecordRow);

                // Create tbody cells
                for(var k=0; k<oColumnset.columns.length; k++) {
                    var elCell = elRecordRow.appendChild(document.createElement("td"));
                    this.formatCell(elCell, oRecord, oColumnset.columns[k]);
                }
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
 * Enhances existing HTML markup for a table.
 *
 * @method _enhanceTableMarkup
 * @private
 */
YAHOO.widget.DataTable.prototype._enhanceTableMarkup = function(elTable, oColumnset, oRecordset) {
    // TODO: nested theads if the columnset has nested arrays
    return this._enhanceThead();
    // TODO: enhance Tbody function
};


/**
 * Enhance existing table's thead markup.
 *
 * @method _enhanceTheadMarkup
 * @private
 */
YAHOO.widget.DataTable.prototype._enhanceThead = function() {
    var oColumnset = this._oColumnset;
    for(var i=0; i<oColumnset.rows.length; i++) {
        var elTheadCellsInRow = this._elTable.tHead.rows[i].cells;
        for(var j=0; j<oColumnset.rows[i].length; j++) {
            var oCell = oColumnset.rows[i][j];
            var elHeadCell = elTheadCellsInRow[j];
            if(!elHeadCell.id) {
                elHeadCell.id =  "yui-dt"+this._nIndex+"-th"+j;
            }
            this._formatHeadCell(elHeadCell,oCell,i,j);
        }
    }
    return true;
};

/**
 * Formats a cell in the table's thead element.
 *
 * @method _formatHeadCell
 * @param elHeadCell {element} HTML table thead cell element reference.
 * @param oColumn {object} DataTable column object.
 * @param iCol {number} Column index.
 * @private
 */
YAHOO.widget.DataTable.prototype._formatHeadCell = function(elHeadCell,oCell,row,col) {
    // Clear out the cell of prior content
    // TODO: purgeListeners and other validation-related things
    elHeadCell.innerHTML = "";

    var oSelf = this;
    var index = this._nIndex;
    var elHeadContainer = elHeadCell.appendChild(document.createElement("div"));
    elHeadContainer.id = "yui-dt" + index + "-headcontainer"+row+"-"+col;
    YAHOO.util.Dom.addClass(elHeadContainer,"yui-dt-headcontainer");
    var elHeadContent = elHeadContainer.appendChild(document.createElement("span"));
    elHeadCell.rowSpan = oCell.rowspan;
    elHeadCell.colSpan = oCell.colspan;

    if(oCell.sortable) {
        elHeadContent.id = oCell.id;
        elHeadContent.innerHTML = oCell.text;
        YAHOO.util.Dom.addClass(elHeadContent,"yui-dt-sortable");
        YAHOO.util.Event.addListener(elHeadContent, "click", oSelf._doSort, oSelf);
    }
    else {
        elHeadContent.innerHTML = oCell.text;
    }
    if(oCell.resizeable) {
        //TODO: deal with fixed width tables
        //TODO: figure out whether this is last column programmatically
        if(!(this.fixedwidth && oCell.isLast)) {
            var elHeadResizer = elHeadContainer.appendChild(document.createElement("span"));
            YAHOO.util.Dom.addClass(elHeadResizer,"yui-dt-headresizer");
            elHeadResizer.id = "yui-dt" + index + "-headresizer"+row+"-"+col;
            var ddResizer = new YAHOO.util.WidthResizer(elHeadCell.id, elHeadResizer.id, elHeadResizer.id);
        }
    }
};

/**
 * Updates a given HTML tr element in the table. TODO: Are 2nd and 3rd args nec?
 *
 * @method _updateRow
 * @param elRow {element} HTML table row element.
 * @param oRecordset {object} DataTable recordset object.
 * @param oDataSource {object} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._updateRow = function(elRow) {
    YAHOO.util.Event.addListener(elRow,"click",this._onRowClick,this);
    YAHOO.util.Event.addListener(elRow,"dblclick",this._onCellDoubleclick,this);
};

/**
 * Handles click events on a table body row.
 *
 * @method _onRowClick
 * @param e {event} HTML click event.
 * @param oSelf {object} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onRowClick = function(e,oSelf) {
    // Break functionality out into modular functions: selectRow, unselectRow
    // Unselect all other rows if ctrl key not pressed
    if(!e.ctrlKey) {
        aSelected = YAHOO.util.Dom.getElementsByClassName("yui-dt-rowselected","tr",oSelf._elTable);
        for(var i=0; i<aSelected.length; i++) {
            YAHOO.util.Dom.removeClass(aSelected[i],"yui-dt-rowselected");
        }
    }
    
    //TODO: allow shift click to select multiple rows
    
    //TODO: allow arrow key selection

    if(YAHOO.util.Dom.hasClass(this,"yui-dt-rowselected")) {
        YAHOO.util.Dom.removeClass(this,"yui-dt-rowselected");
    }
    else {
        YAHOO.util.Dom.addClass(this,"yui-dt-rowselected");
    }
};

/**
 * Handles doubleclick events on a table body cell.
 *
 * @method _onCellDoubleclick
 * @param e {event} HTML doubleclick event.
 * @param oSelf {object} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onCellDoubleclick = function(e,oSelf) {
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
            for(var key in e) {
                YAHOO.log(key+": "+e[key],"warn");
            }
            oSelf._editor = editor;
        }
        editor.style.left = YAHOO.util.Dom.getX(cellEl) + "px";
        editor.style.top = YAHOO.util.Dom.getY(cellEl) + "px";
        editor.style.display = "block";
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
    var elTableBodyRows = elTable.tBodies[0].rows;
    for(var i=0; i< elTableBodyRows.length; i++) {
        if(aNewRecords[i]) {
            var elRecordRow = elTableBodyRows[i];

            // ...Update tbody cells with new data
            for(var j=0; j<columns.length; j++) {
                elCell = elRecordRow.cells[j];
                this.formatCell(elCell, aNewRecords[i], columns[j]);
            }
        }
    }
};

/**
 * Sorts a column in response to a click event on the table's thead cell element.
 *
 * @method _doSort
 * @param e {event} HTML click event.
 * @param oSelf {object} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._doSort = function(e, oSelf) {
    var columns = oSelf._oColumnset.columns;
    var column = null;
    for(var i=0; i<columns.length; i++) {
        // Which column are we sorting?
        if(this.id == columns[i].id) {
            column = columns[i];
            break;
        }
    }

    if(column) {
        // Do we want to sort in DESCENDING order
        var sortDesc = (column.currentlyAsc !== null) ? column.currentlyAsc : column.sortDesc;

        // Define the sort handler function based on the direction
        var sortFnc = (sortDesc) ? column.sortDescHandler : column.sortAscHandler;
        // One was not provided so use the default generic sort handler function
        // TODO: use diff default functions based on column data type
        if(!sortFnc) {
            sortFnc = function(a, b) {
                if(sortDesc) {
                    return YAHOO.util.Sort.compareDesc(a[column.key],b[column.key]);
                }
                else {
                    return YAHOO.util.Sort.compareAsc(a[column.key],b[column.key]);
                }
            };
        }

        // Do the actual sort
        var records = oSelf._oRecordset.getRecords();
        var newRecords =  records.sort(sortFnc);
        oSelf._oRecordset.replace(newRecords);
        //TODO: expose thru events
        oSelf._updateTableBody(newRecords);

        // Set current direction of sorted column and
        // reset direction of all other columns to null
        for(var j=0; j<columns.length; j++) {
            if(j != i) {
                columns[j].currentlyAsc = null;
            }
            else {
                columns[j].currentlyAsc = !sortDesc;
            }
        }
        YAHOO.log("Column \"" + this.id + "\" sorted " + (sortDesc?"desc":"asc") + " on " + column.key,"info",oSelf.toString());
    }
    else {
        //TODO
        YAHOO.log("Could not do sort");
    }
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
YAHOO.util.WidthResizer = function(colElId, handleElId, sGroup, config) {
    if (colElId) {
        this.init(colElId, sGroup, config);
        this.handleElId = handleElId;
        this.setHandleElId(handleElId);
        this.logger = this.logger || YAHOO;
    }
    else {
        YAHOO.log("Column resizer could not be created due to invalid colElId","warn");
    }
};

// YAHOO.example.DDResize.prototype = new YAHOO.util.DragDrop();
YAHOO.extend(YAHOO.util.WidthResizer, YAHOO.util.DragDrop);

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
    var column = this.getEl();
    this.startWidth = column.offsetWidth;
    this.startPos = YAHOO.util.Event.getPageX(e);
};

/**
 * Handles drag events on the column resizer.
 *
 * @method onDrag
 * @param e {string} The drag event
 */
YAHOO.util.WidthResizer.prototype.onDrag = function(e) {
    var newPos = YAHOO.util.Event.getPageX(e);
    var offsetX = newPos - this.startPos;
    var newWidth;

    if(offsetX > 0) { // moving to the right
        newWidth = this.startWidth + offsetX; //Math.max(this.startWidth + offsetX, edge);
    }
    else { // moving to the left
        newWidth = this.startWidth + offsetX;
    }
    //var newWidth = Math.max(this.startWidth + offsetX, edge);
    //YAHOO.log("cur:"+this.startWidth+ " and max: "+this.minWidth,"warn");
    //if(newWidth < this.maxWidth) {
        var column = this.getEl();
        column.style.width = newWidth + "px";
    //}
};


