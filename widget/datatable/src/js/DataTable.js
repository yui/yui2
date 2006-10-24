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
 * @param oColumnset {object} Columnset object
 * @param oDataSource {object} DataSource instance
 * @param oConfigs {object} (optional) Object literal of configuration values
 */
YAHOO.widget.DataTable = function(elElement,oColumnset,oDataSource,oConfigs) {
    // Internal var needed right away
    this._nIndex = YAHOO.widget.DataTable._nCount;

    // Validate configs
    if(typeof oConfigs == "object") {
        for(var sConfig in oConfigs) {
            this[sConfig] = oConfigs[sConfig];
        }
    }

    // Validate DataSource
    if(oDataSource && (oDataSource instanceof YAHOO.widget.DataSource)) {
        this._oDataSource = oDataSource;
    }
    else {
        YAHOO.log("Could not instantiate DataTable due to an invalid DataSource", "error", this.toString());
        return;
    }

    // Validate Columnset
    // TODO: is columnset always an array??
    if(oColumnset.constructor == Array) {
        this._oColumnset = oColumnset;
    }
    else {
        YAHOO.log("Could not instantiate DataTable due to an invalid DataSource", "error", this.toString());
        return;
    }

    // Validate HTML Element
    if(YAHOO.util.Dom.inDocument(elElement)) {
        if(typeof elElement == "string") {
            elElement = document.getElementById(elElement);
        }
        var elType = elElement.nodeName.toLowerCase();
        var success = false;

        // Progressively enhance an existing table
        if(elType == "table") {
            // First create recordset
            // TODO: validate the following inputs -- do we take the table or require the tbody??
            this._oRecordset = this._createRecordsetFromMarkup(elElement.tBodies[0],oColumnset);

            // Then enhance existing markup
            this._elTable = elElement;
            success = this._enhanceTableMarkup();
            if(!success) {
                YAHOO.log("Could not progressively enhance existing markup", "error", this.toString());
                return;
            }
        }
        // Create a table from scratch
        else if(elType == "div") {
            // For an XHR DataSource
            if(oDataSource instanceof YAHOO.widget.XHRDataSource) {
                // First create the table element to hook into
                this._elTable = elElement.appendChild(document.createElement("table"));
                
                // Then send out for recordset data in an asynchronous request
                oDataSource.getResponse(this.initRequest, this.handleInitXHRResponse, this);
            }
            // For a local DataSource
            else {
                // First create the table element to hook into
                this._elTable = elElement.appendChild(document.createElement("table"));
                
                // Then create recordset
                this._oRecordset = this._createRecordsetFromDataSource(oDataSource,oColumnset);

                // Then create markup from scratch
                success = this._createTableMarkup(this._elTable,oColumnset,this._oRecordset);
                if(!success) {
                YAHOO.log("Could not create markup from scratch", "error", this.toString());
                return;
                }
            }
        }
        // Invalid element
        else {
            YAHOO.log("Could not instantiate DataTable due to an invalid HTML element", "error", this.toString());
            return;
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
YAHOO.widget.DataTable.prototype.handleInitXHRResponse = function(sRequest, oResponse, oSelf) {
    // First create recordset
    oSelf._oRecordset = new YAHOO.widget.Recordset(oSelf.getRecordsFromResponse(sRequest,oResponse));

    // Create markup from scratch
    var success = oSelf._createTableMarkup(oSelf._elTable,oSelf._oColumnset,oSelf._oRecordset);
    if(!success) {
        YAHOO.log("Could not create markup from scratch", "error", oSelf.toString());
        return;
    }
};

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
        var oRecord = xmlList.item(k);
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
YAHOO.widget.DataTable.prototype.handleXHRResponse = function(sRequest, oResponse) {
    alert(oResponse);
};



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
 * @static
 * @private
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
 * Table element reference.
 *
 * @property _elTable
 * @type element
 * @private
 */
YAHOO.widget.DataTable.prototype._elTable = null;

/**
 * An array of object literals that describe each column of the table.
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
//TODO: use the new Recordset constructor instead
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
                        this.parseCell(cell,oRecord,oColumnset[j]);
                    }
                aRecords.push(oRecord);
                this._updateRow(elRows[i]);
                }
            }
        }
        return new YAHOO.widget.Recordset(aRecords);
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
    return new YAHOO.widget.Recordset(oDataSource.getResponse(this.initRequest));
};

/**
 * Creates HTML markup for a table from scratch.
 *
 * @method _createTableMarkup
 * @return {Boolean} True if markup created successfully, false otherwise.
 * @private
 */
YAHOO.widget.DataTable.prototype._createTableMarkup = function(elTable, oColumnset, oRecordset) {
    // TODO: nested theads if the columnset has nested arrays
    var success = this._createThead(elTable, oColumnset);
    if(success) {
        success = this._createTbody(elTable, oColumnset, oRecordset);
    }
    return success;
};

/**
 * Creates an HTML thead element in the table.
 *
 * @method _createThead
 * @return {Boolean} True if markup created successfully, false otherwise.
 * @private
 */
YAHOO.widget.DataTable.prototype._createThead = function(elTable, oColumnset) {
    // Create thead row
    var elHead= elTable.appendChild(document.createElement("thead"));
    var elHeadRow = elHead.appendChild(document.createElement("tr"));

    if(oColumnset.length > 0) {
        for(var i=0; i<oColumnset.length; i++) {
            var elHeadCell = elHeadRow.appendChild(document.createElement("th"));
            elHeadCell.id = "yui-dt"+this._nIndex+"-th"+i;
            this._formatHeadCell(elHeadCell,oColumnset[i],i);
        }
    }
    else {
        YAHOO.log("Invalid columnset","error",this.toString());
        return false;
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
 * Creates an HTML tbody element in the table, and creates cells within in. Called by DataSource at the moment...
 *
 * @method _initTableBody
 * @param sQuery {string} Currently required for DataSource integration, but this needs to change.
 * @param aRecords {object} Array of record objects.
 * @param oSelf {object} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._createTbody = function(elTable, oColumnset, oRecordset) {
    var aRecords = oRecordset.getRecords();
    if(aRecords) {
        // Create tbody row
        var elTableBody = elTable.appendChild(document.createElement("tbody"));
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
                for(var k=0; k<oColumnset.length; k++) {
                    var elCell = elRecordRow.appendChild(document.createElement("td"));
                    this.formatCell(elCell, oRecord, oColumnset[k]);
                }
            }
        }
        YAHOO.log(aRecords.length + " records initialized","info",this.toString())
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
    //TODO: account for nested headers
    var elTheadCells = this._elTable.tHead.rows[0].cells;
    
    var columnset = this._oColumnset;
    if(elTheadCells.length > 0) {
        for(var i=0; i<elTheadCells.length; i++) {
            var elHeadCell = elTheadCells[i];
            if(!elHeadCell.id) {
                elHeadCell.id =  "yui-dt"+this._nIndex+"-th"+i;
            }
            this._formatHeadCell(elHeadCell,columnset[i],i);
        }
        return true;
    }
    else {
        YAHOO.log("TODO: some warning or error");
        return false;
    }

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
YAHOO.widget.DataTable.prototype._formatHeadCell = function(elHeadCell,oColumn,iCol) {
    // Clear out the cell of prior content
    // TODO: purgeListeners and other validation-related things
    elHeadCell.innerHTML = "";

    var oSelf = this;
    var index = this._nIndex;
    var elHeadContainer = elHeadCell.appendChild(document.createElement("div"));
    elHeadContainer.id = "yui-dt" + index + "-headcontainer"+iCol;
    YAHOO.util.Dom.addClass(elHeadContainer,"yui-dt-headcontainer");
    var elHeadContent = elHeadContainer.appendChild(document.createElement("span"));

    if(oColumn.sortable) {
        elHeadContent.id = oColumn.id;
        elHeadContent.innerHTML = oColumn.text;
        YAHOO.util.Dom.addClass(elHeadContent,"yui-dt-sortable");
        YAHOO.util.Event.addListener(elHeadContent, "click", oSelf._doSort, oSelf);
    }
    else {
        elHeadContent.innerHTML = oColumn.text;
    }
    if(oColumn.resizeable) {
        //TODO: deal with fixed width tables
        if(!(this.fixedwidth && oColumn.isLast)) {
            var elHeadResizer = elHeadContainer.appendChild(document.createElement("span"));
            YAHOO.util.Dom.addClass(elHeadResizer,"yui-dt-headresizer");
            elHeadResizer.id = "yui-dt" + index + "-headresizer"+iCol;
            var ddResizer = new YAHOO.util.ColResizer(elHeadCell.id, elHeadResizer.id, elHeadResizer.id);
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
 * Updates the HTML tbody element in the table, and updates every existing cell
 * in it.
 *
 * @method _updateTableBody
 * @private
 */
YAHOO.widget.DataTable.prototype._updateTableBody = function() {
//TODO: validate each variable exists
    var elTable = this._elTable;
    var oRecordset = this._oRecordset;
    var columnset = this._oColumnset;

    // For each row in the tbody...
    var elTableBodyRows = elTable.tBodies[0].rows;
    for(var i=0; i< elTableBodyRows.length; i++) {
        var elRecordRow = elTableBodyRows[i];

        // ...Update tbody cells with new data
        for(var j=0; j<columnset.length; j++) {
            elCell = elRecordRow.cells[j]
            this.formatCell(elCell, oRecordset.getRecord(i), columnset[j]);
        }
    }
};

/*    // Create caption
    var elCaption = elTable.appendChild(document.createElement("caption"));
    elCaption.innerHTML = "Caption: This is a basic table";

    // Create tfoot row
    var oFooter = elTable.appendChild(document.createElement("tfoot"));
    var oFooterRow = oFooter.appendChild(document.createElement("tr"));

    // Format tfoot cells
    for(var i=0; i< footerObj.length; i++) {
        var oFooterCell = oFooterRow.appendChild(document.createElement("td"));
        oFooterCell.innerHTML = footerObj[i];
    }
*/


/**
 * Sorts a column in response to a click event on the table's thead cell element.
 *
 * @method _doSort
 * @param e {event} HTML click event.
 * @param oSelf {object} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._doSort = function(e, oSelf) {
    var columnset = oSelf._oColumnset;
    for(var i=0; i<columnset.length; i++) {
        // Which column are we sorting?
        if(this.id == columnset[i].id) {
            column = columnset[i];
            // Which direction are we sorting in?
            var oldDir = column.currentSortDir;
            var dir = "asc";
            if(oldDir === "asc") {
                dir = "desc";
            }
            else if(oldDir === "desc") {
                dir = "asc";
            }
            else if(column.defaultSortDir) {
                dir = column.defaultSortDir;
            }

            // Define the sort function
            var sortFnc = (dir === "desc") ? column.sortDesc : column.sortAsc;
            if(!sortFnc) {
                sortFnc = function(a, b) {
                    if(dir === "desc") {
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
            oSelf._updateTableBody();

            // Reset direction of all other columns
            for(var j=0; j<columnset.length; j++) {
                if(j != i) {
                    oSelf._oColumnset[j].currentSortDir = null;
                }
                else {
                    oSelf._oColumnset[j].currentSortDir = (dir === "desc") ? "desc" : "asc";
                }
            }
            YAHOO.log("Column \"" + this.id + "\" sorted " + dir + " on " + column.key,"info",oSelf.toString());
            break;
        }
    }
//{self:oSelf,recordset:oSelf._oRecordset,sortFnc:oColumn.sortFnc,table:oSelf._elTable,desc:oColumn.desc}

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

 /**
 * Comparator function for sort in ascending order
 *
 * @method compareAsc
 * @param a {object} First sort argument.
 * @param b {object} Second sort argument.
 */
YAHOO.util.Sort.compareAsc = function(a, b) {
    //TODO: is typeof better or is constructor property better?
    if(typeof a === "string") {
        a = a.toLowerCase();
    }
    if(typeof b === "string") {
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
 * Comparator function for sort in descending order
 *
 * @method compareDesc
 * @param a {object} First sort argument.
 * @param b {object} Second sort argument.
 */
YAHOO.util.Sort.compareDesc = function(a, b) {
    //TODO: is typeof better or is constructor property better?
    if(typeof a === "string") {
        a = a.toLowerCase();
    }
    if(typeof b === "string") {
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
 * ColResizer subclasses DragDrop to support resizeable columns.
 *
 * @class ColResizer
 * @extends YAHOO.util.DragDrop
 * @constructor
 * @param colElId {string} ID of the column element being resized
 * @param handleElId {string} ID of the handle element that causes the resize
 * @param sGroup {string} Group name of related DragDrop items
 */
YAHOO.util.ColResizer = function(colElId, handleElId, sGroup, config) {
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
YAHOO.extend(YAHOO.util.ColResizer, YAHOO.util.DragDrop);

/**
 * Handles mousedown events on the column resizer.
 *
 * @method onMouseDown
 * @param e {string} The mousedown event
 */
YAHOO.util.ColResizer.prototype.onMouseDown = function(e) {
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
YAHOO.util.ColResizer.prototype.onDrag = function(e) {
    var newPos = YAHOO.util.Event.getPageX(e);
    var offsetX = newPos - this.startPos;

    if(offsetX > 0) { // moving to the right
        var newWidth = this.startWidth + offsetX; //Math.max(this.startWidth + offsetX, edge);
    }
    else { // moving to the left
        var newWidth = this.startWidth + offsetX
    }
    //var newWidth = Math.max(this.startWidth + offsetX, edge);
    //YAHOO.log("cur:"+this.startWidth+ " and max: "+this.minWidth,"warn");
    //if(newWidth < this.maxWidth) {
        var column = this.getEl();
        column.style.width = newWidth + "px";
    //}
};




/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * A generic data model class is a sparsely populated JavaScript array of uniquely
 * identifiable records.
 *
 *
 * @class Recordset
 * @constructor
 */
YAHOO.widget.Recordset = function(aRecords) {
    this._records = [];
    this._count = 0;
    for(var i=0; i<aRecords.length; i++) {
        this.addRecord(aRecords[i],i);
    }
};


/**
 * Returns the number of non-null records in the sparse Recordset
 *
 * @method getCount
 * @return {Number} Number of non-null records in the sparse Recordset
 */
YAHOO.widget.Recordset.prototype.getCount = function() {
        return this._count;
};

/**
 * Returns the record with the given ID
 *
 * @method getRecordById
 * @param id {String} Record ID.
 * @return {Object} Record with given ID, or null.
 */
YAHOO.widget.Recordset.prototype.getRecordById = function(id) {
    var record = null;
    var length = this._records.length;
    for(var i=length-1; i>0; i--) {
        record = this._records[i];
        if(record && (record.id == id)) {
            return record;
        }
    }
    return null;
};

/**
 * Adds the given record to the Recordset at the given index. If index is null,
 * then adds the record to the end of the Recordset.
 *
 * @method addRecord
 * @param record {Object}
 * @param i {Number} (optional) Record index
 */
YAHOO.widget.Recordset.prototype.addRecord = function(record,i) {
    //TODO: anything else to validate record?
    if(record) {
        if(i) {
            this._records.splice(i,0,record);
        }
        else {
            this._records.push(record);
        }
    }
    else {
        //could not add invalid record
    }
    this._count++;
};

/**
 * Updates the record at the given index with the given record.
 *
 * @method updateRecord
 * @param i {Number} Record index
 * @param newRecord {Object} Record object to add
 */
YAHOO.widget.Recordset.prototype.updateRecord = function(i, newRecord) {
    this._records[i] = newRecord;
};

/**
 * Removes the record at the given index from the Recordset. If a range is
 * given, starts at the given index and removes all records in the range.
 *
 * @method removeRecord
 * @param i {Number} Record index
 * @param range {Number} (optional) Range of records to remove, or null.
 */
YAHOO.widget.Recordset.prototype.removeRecord = function(i, range) {
    if(isNaN(range)) {
        range = 1;
    }
    this._records.splice(i, range)
    this._count = this._count - range;
};

/**
 * Returns record at the given index, or null.
 *
 * @method getRecord
 * @param i {Number} Record index
 * @return {Object} Record object
 */
YAHOO.widget.Recordset.prototype.getRecord = function(i) {
    return this._records[i];
};

/**
 * Returns records from the recordset.
 *
 * @method getRecords
 * @param i {number} Index of which record to start at
 * @param range {number} (optional) Number of records to get
 * @return {Array} Array of records starting at given index and lenth equal to
 * given range. If range is null, entire Recordset array is returned.
 */
YAHOO.widget.Recordset.prototype.getRecords = function(i, range) {
    if(!i) {
        return this._records;
    }
    else if(!range) {
        //TODO: return all records from i until end
    }
    else {
        //TODO: return all records from i to range
    }
};

/**
 * Returns index for the given record.
 *
 * @method getRecordIndex
 * @param oRecord {object} Record object
 * @return {number} index
 */

YAHOO.widget.Recordset.prototype.getRecordIndex = function(oRecord) {
    //TODO: return i;
};

/**
 * Removes all records from the recordset.
 *
 * @method reset
 */
YAHOO.widget.Recordset.prototype.reset = function() {
    this._records = [];
    this._count = 0;
};

/**
 * Replaces entire Recordset array with given array of records.
 *
 * @method replace
 * @param aNewRecords {Array} New array of records
 */
YAHOO.widget.Recordset.prototype.replace = function(aNewRecords) {
    this._records = aNewRecords;
};

