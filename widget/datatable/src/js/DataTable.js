/**
 * The DataTable widget provides a progressively enhanced DHTML control for
 * displaying tabular data across A-grade browsers.
 *
 * @module datatable
 * @requires yahoo, dom, event, datasource
 * @optional dragdrop
 * @title DataTable Widget
 * @beta
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
 * @param oColumnSet {YAHOO.widget.ColumnSet} ColumnSet instance.
 * @param oDataSource {YAHOO.util.DataSource} DataSource instance.
 * @param oConfigs {object} (optional) Object literal of configuration values.
 */
YAHOO.widget.DataTable = function(elContainer,oColumnSet,oDataSource,oConfigs) {
    // Internal vars
    var i;
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
    if(oDataSource) {
        if(oDataSource instanceof YAHOO.util.DataSource) {
            this.dataSource = oDataSource;
        }
        else {
            YAHOO.log("Invalid DataSource", "warn", this.toString());
        }
    }

    // Validate ColumnSet
    if(oColumnSet && (oColumnSet instanceof YAHOO.widget.ColumnSet)) {
        this._oColumnSet = oColumnSet;
    }
    else {
        YAHOO.log("Could not instantiate DataTable due to an invalid ColumnSet", "error", this.toString());
        return;
    }
    
    // Create RecordSet
    this._oRecordSet = new YAHOO.widget.RecordSet();

    // Validate HTML Element
    elContainer = YAHOO.util.Dom.get(elContainer);
    if(elContainer && elContainer.tagName && (elContainer.tagName.toLowerCase() == "div")) {
        this._elContainer = elContainer;
        // Peek in container child nodes to see if TABLE already exists
        var elTable = null;
        if(elContainer.hasChildNodes()) {
            var children = elContainer.childNodes;
            for(i=0; i<children.length; i++) {
                if(children[i].tagName && children[i].tagName.toLowerCase() == "table") {
                    elTable = children[i];
                    break;
                }
            }
        }

        // Progressively enhance an existing table from markup...
        // while using the markup as the source of data
        if(elTable && !this.dataSource) {
            // Fill RecordSet with data parsed out of table
            var aRecords = [];

            // Iterate through each TBODY
            for(i=0; i<elTable.tBodies.length; i++) {
                var elBody = elTable.tBodies[i];

                // Iterate through each TR
                for(var j=0; j<elBody.rows.length; j++) {
                    var elRow = elBody.rows[j];
                    var oRecord = {};

                    // Iterate through each TD
                    for(var k=0; k<elRow.cells.length; k++) {

                        //var elCell = elRow.cells[l];
                        //elCell.id = this.id+"-bdrow"+k+"-cell"+l;
                        //TODO: can we parse a column with null key?
                        oRecord[oColumnSet.keys[k].key] = oColumnSet.keys[k].parse(elRow.cells[k].innerHTML);
                    }
                    aRecords.push(oRecord);
                }
            }
            
            this._initTable();
            
            var ok = this.doBeforeLoadData(aRecords);
            if(ok) {
                this._oRecordSet.addRecords(aRecords);
                this.paginateRows();
            }
        }
        // Create markup from scratch using the provided DataSource
        else if(this.dataSource) {
                this._initTable();
                // Send out for data in an asynchronous request
                oDataSource.sendRequest(this.initialRequest, this.onDataReturnPaginateRows, this);
        }
        // Else there is no data
        else {
            this._initTable();
            this.showEmptyMessage();
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
    YAHOO.util.Event.addListener(elTable, "keypress", this._onKeypress, this);
    YAHOO.util.Event.addListener(document, "keyup", this._onDocumentKeyup, this);
    YAHOO.util.Event.addListener(elTable, "keyup", this._onKeyup, this);
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
     * Fired when a mouseout occurs on a TD element.
     *
     * @event cellMouseoutEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TD element.
     */
    this.createEvent("cellMouseoutEvent");

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
     * Fired when a TH cell element is mouseout.
     *
     * @event headCellMouseoutEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TH element.
     *
     */
    this.createEvent("headCellMouseoutEvent");

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
     * Fired when a TABLE element is mouseout.
     *
     * @event tableMouseoutEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TABLE element.
     *
     */
    this.createEvent("tableMouseoutEvent");

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
     * @event cellDoubleclickEvent
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
     * Fired when a column is sorted.
     *
     * @event columnSortEvent
     * @param oArgs.column {YAHOO.widget.Column} The Column instance.
     * @param oArgs.dir {String} Sort direction "asc" or "desc".
     */
    this.createEvent("columnSortEvent");

    /**
     * Fired when an editor is activated.
     *
     * @event editorShowEvent
     * @param oArgs.target {HTMLElement} The TD element.
     * @param oArgs.column {YAHOO.widget.Column} The Column instance.
     */
    this.createEvent("editorShowEvent");


    /**
     * Fired when a cell is edited.
     *
     * @event cellEditEvent
     * @param oArgs.target {HTMLElement} The TD element.
     * @param oArgs.newData {Object} New data value.
     * @param oArgs.oldData {Object} Old data value.
     */
    this.createEvent("cellEditEvent");

    /**
     * Fired when a column is resized.
     *
     * @event columnResizeEvent
     * @param oArgs.target {HTMLElement} The TH element.
     */
    this.createEvent("columnResizeEvent");

    /**
     * Fired when DataTable instance is first initialized.
     *
     * @event tableInitEvent
     */
    this.createEvent("tableInitEvent");

    /**
     * Fired when DataTable instance is focused.
     *
     * @event tableFocusEvent
     */
    this.createEvent("tableFocusEvent");

    /**
     * Fired when data is returned from DataSource.
     *
     * @event dataReturnEvent
     * @param oArgs.request {String} Original request.
     * @param oArgs.response {Object} Response object.
     */
    this.createEvent("dataReturnEvent");

    /**
     * Fired when DataTable is paginated.
     *
     * @event paginateEvent
     */
    this.createEvent("paginateEvent");

    /**
     * Fired when a TD element is formatted.
     *
     * @event cellFormatEvent
     * @param oArgs.el {HTMLElement} Reference to the TD element.
     */
    this.createEvent("cellFormatEvent");

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
     * Fired when an element is highlighted.
     *
     * @event highlightEvent
     * @param oArgs.els {Array} An array of the highlighted element(s).
     */
    this.createEvent("highlightEvent");

    /**
     * Fired when an element is unhighlighted.
     *
     * @event unhighlightEvent
     * @param oArgs.els {Array} An array of the unhighlighted element(s).
     */
    this.createEvent("unhighlightEvent");
    
    /**
     * Fired when one or more TR elements are deleted.
     *
     * @event rowDeleteEvent
     * @param oArgs.rowIndexes {Array} The indexes of the deleted rows.
     */
    this.createEvent("rowDeleteEvent");
    this.subscribe("rowDeleteEvent", this._onRowDelete);
    
    /**
     * Fired when one or more TR elements are appended.
     *
     * @event rowAppendEvent
     * @param oArgs.rowIds {Array} The IDs of the appended rows.
     */
    this.createEvent("rowAppendEvent");

    /**
     * Fired when a Record is updated in the RecordSet.
     *
     * @event recordSetUpdateEvent
     * @param oArgs.record {YAHOO.widget.Record} The Record instance.
     * @param oArgs.key {String} The Record key.
     * @param oArgs.newData {Object} New data.
     * @param oArgs.oldData {Object} New data.
     */
    this.createEvent("recordSetUpdateEvent");
    this._oRecordSet.subscribe("recordUpdateEvent", this._onRecordUpdate, this, true);
    
    
    YAHOO.widget.DataTable._nCount++;
    YAHOO.log("DataTable initialized", "info", this.toString());
    this.fireEvent("tableInitEvent");
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
 * Class name assigned to TBODY element that holds data rows.
 *
 * @property CLASS_BODY
 * @type String
 * @static
 * @final
 * @default "yui-dt-body"
 */
YAHOO.widget.DataTable.CLASS_BODY = "yui-dt-body";

/**
 * Class name assigned to container element within THEAD.
 *
 * @property CLASS_HEADCONTAINER
 * @type String
 * @static
 * @final
 */
YAHOO.widget.DataTable.CLASS_HEADCONTAINER = "yui-dt-headcontainer";

/**
 * Class name assigned to resizer handle element within THEAD.
 *
 * @property CLASS_HEADRESIZER
 * @type String
 * @static
 * @final
 * @default "yui-dt-headresizer"
 */
YAHOO.widget.DataTable.CLASS_HEADRESIZER = "yui-dt-headresizer";

/**
 * Class name assigned to text displayed within THEAD.
 *
 * @property CLASS_HEADTEXT
 * @type String
 * @static
 * @final
 * @default "yui-dt-headtext"
 */
YAHOO.widget.DataTable.CLASS_HEADTEXT = "yui-dt-headtext";

/**
 * Class name assigned to even TR elements.
 *
 * @property CLASS_EVEN
 * @type String
 * @static
 * @final
 * @default "yui-dt-even
 */
YAHOO.widget.DataTable.CLASS_EVEN = "yui-dt-even";

/**
 * Class name assigned to odd TR elements.
 *
 * @property CLASS_ODD
 * @type String
 * @static
 * @final
 * @default "yui-dt-odd"
 */
YAHOO.widget.DataTable.CLASS_ODD = "yui-dt-odd";

/**
 * Class name assigned to empty elements.
 *
 * @property CLASS_EMPTY
 * @type String
 * @static
 * @final
 * @default "yui-dt-empty"
 */
YAHOO.widget.DataTable.CLASS_EMPTY = "yui-dt-empty";

/**
 * Class name assigned to loading message.
 *
 * @property CLASS_LOADING
 * @type String
 * @static
 * @final
 * @default "yui-dt-loading"
 */
YAHOO.widget.DataTable.CLASS_LOADING = "yui-dt-loading";

/**
 * Class name assigned to selected elements.
 *
 * @property CLASS_SELECTED
 * @type String
 * @static
 * @final
 * @default "yui-dt-selected"
 */
YAHOO.widget.DataTable.CLASS_SELECTED = "yui-dt-selected";

/**
 * Class name assigned to highlighted element.
 *
 * @property CLASS_HIGHLIGHT
 * @type String
 * @static
 * @final
 * @default "yui-dt-highlight"
 */
YAHOO.widget.DataTable.CLASS_HIGHLIGHT = "yui-dt-highlight";

/**
 * Class name assigned to certain elements of a scrollable DataTable.
 *
 * @property CLASS_SCROLLABLE
 * @type String
 * @static
 * @final
 * @default "yui-dt-scrollable"
 */
YAHOO.widget.DataTable.CLASS_SCROLLABLE = "yui-dt-scrollable";

/**
 * Class name assigned to column headers of sortable Columns.
 *
 * @property CLASS_SORTABLE
 * @type String
 * @static
 * @final
 * @default "yui-dt-sortable"
 */
YAHOO.widget.DataTable.CLASS_SORTABLE = "yui-dt-sortable";

/**
 * Class name assigned to column headers when sorted in ascending order.
 *
 * @property CLASS_SORTEDBYASC
 * @type String
 * @static
 * @final
 * @default "yui-dt-sortedbyasc"
 */
YAHOO.widget.DataTable.CLASS_SORTEDBYASC = "yui-dt-sortedbyasc";

/**
 * Class name assigned to column headers when sorted in descending order.
 *
 * @property CLASS_SORTEDBYDESC
 * @type String
 * @static
 * @final
 * @default "yui-dt-sortedbydesc"
 */
YAHOO.widget.DataTable.CLASS_SORTEDBYDESC = "yui-dt-sortedbydesc";

/**
 * Class name assigned to the pagination link "&lt;&lt;".
 *
 * @property CLASS_FIRSTLINK
 * @type String
 * @static
 * @final
 * @default "yui-dt-firstlink"
 */
YAHOO.widget.DataTable.CLASS_FIRSTLINK = "yui-dt-firstlink";

/**
 * Class name assigned to the pagination link "&lt;&lt;" when it is disabled.
 *
 * @property CLASS_FIRSTPAGE
 * @type String
 * @static
 * @final
 * @default "yui-dt-firstpage"
 */
YAHOO.widget.DataTable.CLASS_FIRSTPAGE = "yui-dt-firstpage";

/**
 * Class name assigned to the pagination link "&gt;&gt;".
 *
 * @property CLASS_LASTLINK
 * @type String
 * @static
 * @final
 * @default "yui-dt-lastlink"
 */
YAHOO.widget.DataTable.CLASS_LASTLINK = "yui-dt-lastlink";

/**
 * Class name assigned to the pagination link "&gt;&gt;" when it is disabled.
 *
 * @property CLASS_LASTPAGE
 * @type String
 * @static
 * @final
 * @default "yui-dt-lastpage"
 */
YAHOO.widget.DataTable.CLASS_LASTPAGE = "yui-dt-lastpage";

/**
 * Class name assigned to the pagination link "&lt;".
 *
 * @property CLASS_PREVLINK
 * @type String
 * @static
 * @final
 * @default "yui-dt-prevlink"
 */
YAHOO.widget.DataTable.CLASS_PREVLINK = "yui-dt-prevlink";

/**
 * Class name assigned to the pagination link "&lt;" when it is disabled.
 *
 * @property CLASS_PREVPAGE
 * @type String
 * @static
 * @final
 * @default "yui-dt-prevpage"
 */
YAHOO.widget.DataTable.CLASS_PREVPAGE = "yui-dt-prevpage";

/**
 * Class name assigned to the pagination link "&gt;".
 *
 * @property CLASS_NEXTLINK
 * @type String
 * @static
 * @final
 * @default "yui-dt-nextlink"
 */
YAHOO.widget.DataTable.CLASS_NEXTLINK = "yui-dt-nextlink";

/**
 * Class name assigned to the pagination link "&gt;" when it is disabled.
 *
 * @property CLASS_NEXTPAGE
 * @type String
 * @static
 * @final
 * @default "yui-dt-nextpage"
 */
YAHOO.widget.DataTable.CLASS_NEXTPAGE = "yui-dt-nextpage";


/**
 * Class name assigned to pagination links to specific page numbers.
 *
 * @property CLASS_PAGELINK
 * @type String
 * @static
 * @final
 * @default "yui-dt-pagelink"
 */
YAHOO.widget.DataTable.CLASS_PAGELINK = "yui-dt-pagelink";

/**
 * Class name assigned to pagination links for specific page numbers that are disabled.
 *
 * @property CLASS_CURRENTPAGE
 * @type String
 * @static
 * @final
 * @default "yui-dt-currentpage"
 */
YAHOO.widget.DataTable.CLASS_CURRENTPAGE = "yui-dt-currentpage";

/**
 * Class name assigned to the pagination SELECT element.
 *
 * @property CLASS_PAGESELECT
 * @type String
 * @static
 * @final
 * @default "yui-dt-pageselect"
 */
YAHOO.widget.DataTable.CLASS_PAGESELECT = "yui-dt-pageselect";

/**
 * Class name assigned to the pagination links container element.
 *
 * @property CLASS_PAGELINKS
 * @type String
 * @static
 * @final
 * @default "yui-dt-pagelinks"
 */
YAHOO.widget.DataTable.CLASS_PAGELINKS = "yui-dt-pagelinks";

/**
 * Class name assigned to editable TD elements.
 *
 * @property CLASS_EDITABLE
 * @type String
 * @static
 * @final
 * @default "yui-dt-editable"
 */
YAHOO.widget.DataTable.CLASS_EDITABLE = "yui-dt-editable";

/**
 * Class name assigned to TD elements of type "checkbox".
 *
 * @property CLASS_CHECKBOX
 * @type String
 * @static
 * @final
 * @default "yui-dt-checkbox"
 */
YAHOO.widget.DataTable.CLASS_CHECKBOX = "yui-dt-checkbox";

/**
 * Class name assigned to TD elements of type "currency".
 *
 * @property CLASS_CURRENCY
 * @type String
 * @static
 * @final
 * @default "yui-dt-currency"
 */
YAHOO.widget.DataTable.CLASS_CURRENCY = "yui-dt-currency";

/**
 * Class name assigned to TD elements of type "date".
 *
 * @property CLASS_DATE
 * @type String
 * @static
 * @final
 * @default "yui-dt-date"
 */
YAHOO.widget.DataTable.CLASS_DATE = "yui-dt-date";

/**
 * Class name assigned to TD elements of type "email".
 *
 * @property CLASS_EMAIL
 * @type String
 * @static
 * @final
 * @default "yui-dt-email"
 */
YAHOO.widget.DataTable.CLASS_EMAIL = "yui-dt-email";

/**
 * Class name assigned to TD elements of type "link".
 *
 * @property CLASS_LINK
 * @type String
 * @static
 * @final
 * @default "yui-dt-link"
 */
YAHOO.widget.DataTable.CLASS_LINK = "yui-dt-link";

/**
 * Class name assigned to TD elements of type "number".
 *
 * @property CLASS_NUMBER
 * @type String
 * @static
 * @final
 * @default "yui-dt-number"
 */
YAHOO.widget.DataTable.CLASS_NUMBER = "yui-dt-number";

/**
 * Class name assigned to TD elements of type "string".
 *
 * @property CLASS_STRING
 * @type String
 * @static
 * @final
 * @default "yui-dt-string"
 */
YAHOO.widget.DataTable.CLASS_STRING = "yui-dt-string";

/**
 * Message to display if DataTable has no data.
 *
 * @property MSG_EMPTY
 * @type String
 * @static
 * @final
 * @default "No records found."
 */
YAHOO.widget.DataTable.MSG_EMPTY = "No records found.";

/**
 * Message to display while DataTable is loading data.
 *
 * @property MSG_LOADING
 * @type String
 * @static
 * @final
 * @default "Loading data..."
 */
YAHOO.widget.DataTable.MSG_LOADING = "Loading data...";

/////////////////////////////////////////////////////////////////////////////
//
// Private member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Internal class variable to index multiple DataTable instances.
 *
 * @property _nCount
 * @type Number
 * @private
 * @static
 */
YAHOO.widget.DataTable._nCount = 0;

/**
 * Instance index.
 *
 * @property _nIndex
 * @type Number
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
 * Container element reference. Is null unless the TABLE is built from scratch into the
 * provided container.
 *
 * @property _elContainer
 * @type HTMLElement
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
 * ColumnSet instance.
 *
 * @property _oColumnSet
 * @type YAHOO.widget.ColumnSet
 * @private
 */
YAHOO.widget.DataTable.prototype._oColumnSet = null;

/**
 * RecordSet instance.
 *
 * @property _oRecordSet
 * @type YAHOO.widget.RecordSet
 * @private
 */
YAHOO.widget.DataTable.prototype._oRecordSet = null;

/**
 * Array of Records that are in the selected state.
 *
 * @property _aSelectedRecords
 * @type YAHOO.widget.Record[]
 * @private
 */
YAHOO.widget.DataTable.prototype._aSelectedRecords = null;

/**
 * Internal variable to track whether widget has focus.
 *
 * @property _bFocused
 * @type Boolean
 * @private
 */
YAHOO.widget.DataTable.prototype._bFocused = false;

/**
 * Total number of pages, calculated on the fly.
 *
 * @property _totalPages
 * @type Number
 * @private
 */
YAHOO.widget.DataTable.prototype._totalPages = null;


/////////////////////////////////////////////////////////////////////////////
//
// Private methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Creates HTML markup for TABLE, THEAD, TBODY.
 *
 * @method _initTable
 * @private
 */
YAHOO.widget.DataTable.prototype._initTable = function() {
    // Clear the container
    this._elContainer.innerHTML = "";

    // Set up scrolling
    if(this.scrollable) {
        //TODO: conf height
        YAHOO.util.Dom.addClass(this._elContainer,YAHOO.widget.DataTable.CLASS_SCROLLABLE);
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
    this._initHead(elTable, this._oColumnSet);


    // Create TBODY for messages
    var elMsgBody = document.createElement("tbody");
    elMsgBody.tabIndex = -1;
    this._elMsgRow = elMsgBody.appendChild(document.createElement("tr"));
    var elMsgRow = this._elMsgRow;
    var elMsgCell = elMsgRow.appendChild(document.createElement("td"));
    elMsgCell.colSpan = this._oColumnSet.keys.length;
    this._elMsgCell = elMsgCell;
    this._elMsgBody = elTable.appendChild(elMsgBody);
    this.showLoadingMessage();

    // Create TBODY for data
    this._elBody = elTable.appendChild(document.createElement("tbody"));
    this._elBody.tabIndex = -1;
    YAHOO.util.Dom.addClass(this._elBody,YAHOO.widget.DataTable.CLASS_BODY);
    if(this.scrollable) {
        YAHOO.util.Dom.addClass(this._elBody,YAHOO.widget.DataTable.CLASS_SCROLLABLE);
    }
};

/**
 * Populates THEAD element with TH cells as defined by ColumnSet.
 *
 * @method _initHead
 * @private
 */
YAHOO.widget.DataTable.prototype._initHead = function() {
    var i,oColumn;
    
    // Create THEAD
    var elHead = document.createElement("thead");
    elHead.tabIndex = -1;

    // Iterate through each row of Column headers...
    var colTree = this._oColumnSet.tree;
    for(i=0; i<colTree.length; i++) {
        var elHeadRow = elHead.appendChild(document.createElement("tr"));
        elHeadRow.id = this.id+"-hdrow"+i;

        // ...and create THEAD cells
        for(var j=0; j<colTree[i].length; j++) {
            oColumn = colTree[i][j];
            var elHeadCell = elHeadRow.appendChild(document.createElement("th"));
            elHeadCell.id = oColumn.getId();
            this._initHeadCell(elHeadCell,oColumn,i,j);
        }
    }

    this._elHead = this._elTable.appendChild(elHead);
    
    // Add Resizer only after DOM has been updated...
    // ...and skip the last column
    for(i=0; i<this._oColumnSet.keys.length-1; i++) {
        oColumn = this._oColumnSet.keys[i];
        if(oColumn.resizeable && YAHOO.util.DD) {
            //TODO: deal with fixed width tables
            //TODO: no more oColumn.isLast
            if(!this.fixedWidth || (this.fixedwidth && !oColumn.isLast)) {
                // TODO: better way to get elHeadContainer
                var elHeadContainer = (YAHOO.util.Dom.getElementsByClassName(YAHOO.widget.DataTable.CLASS_HEADCONTAINER,"div",YAHOO.util.Dom.get(oColumn.getId())))[0];
                var elHeadResizer = elHeadContainer.appendChild(document.createElement("span"));
                elHeadResizer.id = oColumn.getId() + "-resizer";
                YAHOO.util.Dom.addClass(elHeadResizer,YAHOO.widget.DataTable.CLASS_HEADRESIZER);
                oColumn.ddResizer = new YAHOO.util.WidthResizer(
                        this, oColumn.getId(), elHeadResizer.id, elHeadResizer.id);
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

    YAHOO.log("THEAD with " + this._oColumnSet.keys.length + " columns created","info",this.toString());
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
    elHeadCell.columnIndex = col;
    if(oColumn.abbr) {
        elHeadCell.abbr = oColumn.abbr;
    }
    if(oColumn.width) {
        elHeadCell.style.width = oColumn.width;
    }
    if(oColumn.className) {
        YAHOO.util.Dom.addClass(elHeadCell,oColumn.className);
    }
    // Apply CSS for sorted tables
    if(this.sortedBy && this.sortedBy.colKey) {
        if(this.sortedBy.colKey == oColumn.key) {
            var sortClass = (this.sortedBy.dir && (this.sortedBy.dir != "asc")) ?
                    YAHOO.widget.DataTable.CLASS_SORTEDBYDESC :
                    YAHOO.widget.DataTable.CLASS_SORTEDBYASC;
            YAHOO.util.Dom.addClass(elHeadCell,sortClass);
            this.sortedBy._id = elHeadCell.id;
        }
    }

    elHeadCell.innerHTML = "";

    var elHeadContainer = elHeadCell.appendChild(document.createElement("div"));
    elHeadContainer.id = this.id+"-hdrow"+row+"-container"+col;
    YAHOO.util.Dom.addClass(elHeadContainer,YAHOO.widget.DataTable.CLASS_HEADCONTAINER);
    var elHeadContent = elHeadContainer.appendChild(document.createElement("span"));
    elHeadContent.id = this.id+"-hdrow"+row+"-text"+col;
    YAHOO.util.Dom.addClass(elHeadContent,YAHOO.widget.DataTable.CLASS_HEADTEXT);

    elHeadCell.rowSpan = oColumn.getRowSpan();
    elHeadCell.colSpan = oColumn.getColSpan();

    var contentText = oColumn.text || oColumn.key || "";
    if(oColumn.sortable) {
        YAHOO.util.Dom.addClass(elHeadContent,YAHOO.widget.DataTable.CLASS_SORTABLE);
        //TODO: Make hash configurable to be a server link
        //TODO: Make title configurable
        //TODO: Separate contentText from an accessibility link that says
        // Click to sort ascending and push it offscreen
        elHeadContent.innerHTML = "<a href=\"#\" title=\"Click to sort\">" + contentText + "</a>";
         //elHeadContent.innerHTML = contentText;

    }
    else {
        elHeadContent.innerHTML = contentText;
    }
};

/**
 * Add a new row to table body at position i if given, or to the bottom
 * otherwise. Does not fire any events.
 *
 * @method _addRow
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param index {Number} Position at which to add row.
 * @return {String} ID of the added TR element.
 * @private
 */
YAHOO.widget.DataTable.prototype._addRow = function(oRecord, index) {
    this.hideTableMessages();

    // Is this an insert or an append?
    var insert = (isNaN(index)) ? false : true;
    if(!insert) {
        index = this._elBody.rows.length;
    }

    var oColumnSet = this._oColumnSet;
    var oRecordSet = this._oRecordSet;

    var elRow = (insert && this._elBody.rows[index]) ?
        this._elBody.insertBefore(document.createElement("tr"),this._elBody.rows[index]) :
        this._elBody.appendChild(document.createElement("tr"));
    var recId = oRecord.id;
    elRow.id = this.id+"-bdrow"+index;
    elRow.recordId = recId;

    // Create TBODY cells
    for(var j=0; j<oColumnSet.keys.length; j++) {
        var oColumn = oColumnSet.keys[j];
        var elCell = elRow.appendChild(document.createElement("td"));
        elCell.id = this.id+"-bdrow"+index+"-cell"+j;
        elCell.headers = oColumn.id;
        elCell.columnIndex = j;
        elCell.headers = oColumnSet.headers[j];

        oColumn.format(elCell, oRecord);
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

    if(this.isEmpty && (this._elBody.rows.length > 0)) {
        //TODO: hideMessages()
        //this._initRows()
        //this.isEmpty = false;
    }

    // Striping
    if(!insert) {
        if(index%2) {
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
    
    return elRow.id;
};

/**
 * Restripes rows by applying class YAHOO.widget.DataTable.CLASS_EVEN or
 * YAHOO.widget.DataTable.CLASS_ODD.
 *
 * @method _restripeRows
 * @param range {Number} (optional) Range defines a subset of rows to restripe.
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
 * Updates existing row at position i with data from the given Record. Does not
 * fire any events.
 *
 * @method _updateRow
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param index {Number} Position at which to update row.
 * @return {String} ID of the updated TR element.
 * @private
 */
YAHOO.widget.DataTable.prototype._updateRow = function(oRecord, index) {
    this.hideTableMessages();

    var elRow = this._elBody.rows[index];
    elRow.recordId = oRecord.id;

    var columns = this._oColumnSet.keys;
    // ...Update TBODY cells with new data
    for(var j=0; j<columns.length; j++) {
        columns[j].format(elRow.cells[j], oRecord);
    }
    return elRow.id;
};

/**
 * Sets elements to selected state. Does not fire any events. Does not affect
 * internal tracker.
 *
 * @method _select
 * @param els {HTMLElement[] | String[]} Array of HTML elements by reference or ID string.
 * @private
 */
YAHOO.widget.DataTable.prototype._select = function(els) {
//TODO: put els in an array if it is just one element?
    for(var i=0; i<els.length; i++) {
        // Set the style
        YAHOO.util.Dom.addClass(YAHOO.util.Dom.get(els[i]),YAHOO.widget.DataTable.CLASS_SELECTED);
    }
    this._lastSelected = els[els.length-1];
};

/**
 * Sets elements to the unselected state. Does not fire any events. Does not
 * affect internal tracker.
 *
 * @method _unselect
 * @param els {HTMLElement[] | String[]} Array of HTML elements by reference or ID string.
 * @private
 */
YAHOO.widget.DataTable.prototype._unselect = function(els) {
    for(var i=0; i<els.length; i++) {
        // Remove the style
        YAHOO.util.Dom.removeClass(YAHOO.util.Dom.get(els[i]),YAHOO.widget.DataTable.CLASS_SELECTED);
    }
};

/**
 * Unselects all selected rows. Does not fire any events. Does not affect internal
 * tracker.
 *
 * @method _unselectAllRows
 * @private
 */
YAHOO.widget.DataTable.prototype._unselectAllRows = function() {
    var selectedRows = YAHOO.util.Dom.getElementsByClassName(YAHOO.widget.DataTable.CLASS_SELECTED,"tr",this._elBody);
    this._unselect(selectedRows);
};

/**
 * Unselects all selected cells.
 *
 * @method _unselectAllCells
 * @private
 */
YAHOO.widget.DataTable.prototype._unselectAllCells = function() {
    var selectedCells = YAHOO.util.Dom.getElementsByClassName(YAHOO.widget.DataTable.CLASS_SELECTED,"td",this._elBody);
    this._unselect(selectedCells);
};

/**
 * Deletes a given row element as well its corresponding Record in the RecordSet.
 * Does not fire any events.
 *
 * @method _deleteRow
 * @param elRow {element} HTML table row element reference.
 * @private
 */
YAHOO.widget.DataTable.prototype._deleteRow = function(elRow) {
//TODO: sniff elRow.rowIndex
    var allRows = this._elBody.rows;
    var id = elRow.id;
    var recordId = elRow.recordId;
    for(var i=0; i< allRows.length; i++) {
        if(id == allRows[i].id) {
            this._elBody.deleteRow(i);

            // Update the RecordSet
            this._oRecordSet.deleteRecord(i);
            break;
        }
    }
    if(this._elBody.rows.length === 0) {
        this.showEmptyMessage();
    }
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
 * @param e {HTMLEvent} The blur event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onBlur = function(e, oSelf) {
    this._bFocused = false;
};

/**
 * Handles mouseover events on the TABLE element.
 *
 * @method _onMouseover
 * @param e {HTMLEvent} The mouseover event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onMouseover = function(e, oSelf) {
        var elTarget = YAHOO.util.Event.getTarget(e);
        var elTag = elTarget.tagName.toLowerCase();
        var knownTag = false;

        if (elTag != "table") {
            while(!knownTag) {
                switch(elTag) {
                    case "body":
                        knownTag = true;
                        break;
                    case "a":
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
                    elTag = elTarget.tagName.toLowerCase();
                }
                else {
                    break;
                }
            }
        }
        oSelf.fireEvent("tableMouseoverEvent",{target:elTarget,event:e});
};

/**
 * Handles mouseout events on the TABLE element.
 *
 * @method _onMouseout
 * @param e {HTMLEvent} The mouseout event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onMouseout = function(e, oSelf) {
        var elTarget = YAHOO.util.Event.getTarget(e);
        var elTag = elTarget.tagName.toLowerCase();
        var knownTag = false;

        if (elTag != "table") {
            while(!knownTag) {
                switch(elTag) {
                    case "body":
                        knownTag = true;
                        break;
                    case "a":
                        knownTag = true;
                        break;
                    case "td":
                        oSelf.fireEvent("cellMouseoutEvent",{target:elTarget,event:e});
                        knownTag = true;
                        break;
                    case "th":
                        oSelf.fireEvent("headCellMouseoutEvent",{target:elTarget,event:e});
                        knownTag = true;
                        break;
                    default:
                        break;
                }
                elTarget = elTarget.parentNode;
                if(elTarget) {
                    elTag = elTarget.tagName.toLowerCase();
                }
                else {
                    break;
                }
            }
        }
        oSelf.fireEvent("tableMouseoutEvent",{target:elTarget,event:e});
};

/**
 * Handles mousedown events on the TABLE element.
 *
 * @method _onMousedown
 * @param e {HTMLEvent} The mousedown event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onMousedown = function(e, oSelf) {
        //YAHOO.util.Event.stopEvent(e);
        var elTarget = YAHOO.util.Event.getTarget(e);
        var elTag = elTarget.tagName.toLowerCase();
        var knownTag = false;

        if (elTag != "table") {
            while(!knownTag) {
                switch(elTag) {
                    case "body":
                        knownTag = true;
                        break;
                    case "a":
                        knownTag = true;
                        break;
                    case "td":
                        YAHOO.util.Event.stopEvent(e);
                        oSelf.fireEvent("cellMousedownEvent",{target:elTarget,event:e});
                        knownTag = true;
                        break;
                    case "th":
                        YAHOO.util.Event.stopEvent(e);
                        oSelf.fireEvent("headCellMousedownEvent",{target:elTarget,event:e});
                        knownTag = true;
                        break;
                    default:
                        break;
                }
                elTarget = elTarget.parentNode;
                if(elTarget) {
                    elTag = elTarget.tagName.toLowerCase();
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
 * @param e {HTMLEvent} The click event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onClick = function(e, oSelf) {
    var elTarget = YAHOO.util.Event.getTarget(e);
    var elTag = elTarget.tagName.toLowerCase();
    var knownTag = false; // True if event should stop propagating

    if(oSelf.activeEditor) { //&& (oSelf.activeEditor.column != column)
        oSelf.activeEditor.hide();
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
                case "a":
                    knownTag = true;
                    break;
                case "td":
                    YAHOO.util.Event.stopEvent(e);
                    oSelf.fireEvent("cellClickEvent",{target:elTarget,event:e});
                    knownTag = true;
                    break;
                case "th":
                    YAHOO.util.Event.stopEvent(e);
                    oSelf.fireEvent("headCellClickEvent",{target:elTarget,event:e});
                    knownTag = true;
                    break;
                default:
                    break;
            }
            elTarget = elTarget.parentNode;
            elTag = elTarget.tagName.toLowerCase();
        }
    }
    oSelf.focusTable();
    oSelf.fireEvent("tableClickEvent",{target:elTarget,event:e});
};

/**
 * Handles doubleclick events on the TABLE element.
 *
 * @method _onDoubleclick
 * @param e {HTMLEvent} The doubleclick event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onDoubleclick = function(e, oSelf) {
    var elTarget = YAHOO.util.Event.getTarget(e);
    var elTag = elTarget.tagName.toLowerCase();
    var knownTag = false;

    if(oSelf.activeEditor) { //&& (oSelf.activeEditor.column != column)
        oSelf.activeEditor.hide();
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
                case "a":
                    knownTag = true;
                    break;
                case "td":
                    YAHOO.util.Event.stopEvent(e);
                    oSelf.fireEvent("cellDoubleclickEvent",{target:elTarget,event:e});
                    knownTag = true;
                    break;
                case "th":
                    YAHOO.util.Event.stopEvent(e);
                    oSelf.fireEvent("headCellDoubleclickEvent",{target:elTarget,event:e});
                    knownTag = true;
                    break;
                default:
                    break;
            }
            elTarget = elTarget.parentNode;
            elTag = elTarget.tagName.toLowerCase();
        }
    }
    oSelf.fireEvent("tableDoubleclickEvent",{target:elTarget,event:e});
};

/**
 * Handles keypress events on the TABLE. Mainly to support stopEvent on Mac.
 *
 * @method _onKeypress
 * @param e {HTMLEvent} The key event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onKeypress = function(e, oSelf) {
    var isMac = (navigator.userAgent.toLowerCase().indexOf("mac") != -1);
    if(isMac) {
        // arrow down
        if(e.keyCode == 40) {
            YAHOO.util.Event.stopEvent(e);
        }
        // arrow up
        else if(e.keyCode == 38) {
            YAHOO.util.Event.stopEvent(e);
        }
    }
};

/**
 * Handles keydown events on the TABLE. Executes arrow selection.
 *
 * @method _onKeydown
 * @param e {HTMLEvent} The key event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
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
            YAHOO.util.Event.stopEvent(e);
            // row mode
            if(oldSelected.tagName.toLowerCase() == "tr") {
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
            else if(oldSelected.tagName.toLowerCase() == "td") {
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
            YAHOO.util.Event.stopEvent(e);
            // row mode
            if(oldSelected.tagName.toLowerCase() == "tr") {
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
            else if(oldSelected.tagName.toLowerCase() == "td") {
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
 * Handles keyup events on the TABLE. Executes deletion
 *
 * @method _onKeyup
 * @param e {HTMLEvent} The key event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onKeyup = function(e, oSelf) {
    var key = YAHOO.util.Event.getCharCode(e);
    // delete
    if(key == 46) {//TODO: && this.isFocused
        //TODO: delete row
    }
};

/**
 * Handles keyup events on the DOCUMENT. Executes interaction with editor.
 *
 * @method _onDocumentKeyup
 * @param e {HTMLEvent} The key event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onDocumentKeyup = function(e, oSelf) {
    // esc Clears active editor
    if((e.keyCode == 27) && (oSelf.activeEditor)) {
        oSelf.activeEditor.hide();
        oSelf.activeEditor = null;
        
        // Editor causes widget to lose focus
        oSelf._bFocused = false;
        oSelf.focusTable();
    }
    // enter Saves active editor data
    if((e.keyCode == 13) && (oSelf.activeEditor)) {
        var elCell = oSelf.activeEditor.cell;
        var oColumn = oSelf.activeEditor.column;
        var oRecord = oSelf.activeEditor.record;
        var oldValue = oRecord[oColumn.key];
        var newValue = oSelf.activeEditor.getValue();
        
        //Update Record
        //TODO: Column.key may be null!
        oSelf._oRecordSet.updateRecord(oRecord,oColumn.key,newValue);

        //Update cell
        oSelf.formatCell(elCell);

        // Hide editor
        oSelf.activeEditor.hide();
        oSelf.activeEditor = null;

        // Editor causes widget to lose focus
        oSelf._bFocused = false;
        oSelf.focusTable();
        oSelf.fireEvent("cellEditEvent",{target:elCell,oldData:oldValue,newData:newValue});
    }
};

/**
 * Handles click events on paginator links.
 *
 * @method _onPagerClick
 * @param e {HTMLEvent} The click event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onPagerClick = function(e, oSelf) {
    var elTarget = YAHOO.util.Event.getTarget(e);
    var elTag = elTarget.tagName.toLowerCase();
    var knownTag = false; // True if event should stop propagating

    if (elTag != "table") {
        while(!knownTag) {
            switch(elTag) {
                case "body":
                    knownTag = true;
                    break;
                case "a":
                    YAHOO.util.Event.stopEvent(e);
                    switch(elTarget.className) {
                        case YAHOO.widget.DataTable.CLASS_PAGELINK:
                            oSelf.showPage(parseInt(elTarget.innerHTML,10));
                            break;
                        case YAHOO.widget.DataTable.CLASS_FIRSTLINK:
                            oSelf.showPage(1);
                            break;
                        case YAHOO.widget.DataTable.CLASS_LASTLINK:
                            oSelf.showPage(oSelf._totalPages);
                            break;
                        case YAHOO.widget.DataTable.CLASS_PREVLINK:
                            oSelf.showPage(oSelf.pageCurrent-1);
                            break;
                        case YAHOO.widget.DataTable.CLASS_NEXTLINK:
                            oSelf.showPage(oSelf.pageCurrent+1);
                            break;
                    }
                    knownTag = true;
                    break;
                default:
                    break;
            }
            elTarget = elTarget.parentNode;
            if(elTarget) {
                elTag = elTarget.tagName.toLowerCase();
            }
            else {
                break;
            }
        }
    }
};

/**
 * Handles change events on paginator SELECT.
 *
 * @method _onPagerSelect
 * @param e {HTMLEvent} The change event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onPagerSelect = function(e, oSelf) {
    var elTarget = YAHOO.util.Event.getTarget(e);
    var elTag = elTarget.tagName.toLowerCase();

    // How many rows per page
    var oldRowsPerPage = oSelf.rowsPerPage;
    var rowsPerPage = parseInt(elTarget[elTarget.selectedIndex].text,10);
    if(rowsPerPage && (rowsPerPage != oSelf.rowsPerPage)) {
        if(rowsPerPage > oldRowsPerPage) {
            oSelf.pageCurrent = 1;
        }
        oSelf.rowsPerPage = rowsPerPage;
        oSelf.paginateRows();
    }
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
 * @param oArgs.rowIndexes {Number[]} The indexes of the deleted rows.
 * @private
 */
YAHOO.widget.DataTable.prototype._onRowDelete = function(oArgs) {
    this._restripeRows();
};

/**
 * Passes along recordSetUpdate Event when recordUpdateEvent is caught from RecordSet.
 *
 * @event _onRecordUpdate
 * @param oArgs.record {YAHOO.widget.Record} The Record instance.
 * @param oArgs.key {String} The Record key.
 * @param oArgs.newData {Object} New data.
 * @param oArgs.oldData {Object} New data.
 * @private
 */
YAHOO.widget.DataTable.prototype._onRecordUpdate = function(oArgs) {
    this.fireEvent("recordSetUpdateEvent",oArgs);
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
 * @type YAHOO.util.DataSource
 */
YAHOO.widget.DataTable.prototype.dataSource = null;

/**
 * Initial request to send to DataSource.
 *
 * @property initialRequest
 * @type String
 * @default ""
 */
YAHOO.widget.DataTable.prototype.initialRequest = "";

/**
 * Defines value of CAPTION attribute.
 *
 * @property caption
 * @type String
 */
YAHOO.widget.DataTable.prototype.caption = null;

/**
 * Defines value of SUMMARY attribute.
 *
 * @property summary
 * @type String
 */
YAHOO.widget.DataTable.prototype.summary = null;

/**
 * True if DataTable's width is a fixed size.
 *
 * @property fixedWidth
 * @type Boolean
 * @default false
 */
YAHOO.widget.DataTable.prototype.fixedWidth = false;

/**
 * True if TBODY should scroll while THEAD remains fixed.
 *
 * @property scrollable
 * @type Boolean
 * @default false
 */
YAHOO.widget.DataTable.prototype.scrollable = false;

/**
 * True if only one row may be selected at a time.
 *
 * @property rowSingleSelect
 * @type Boolean
 * @default false
 */
YAHOO.widget.DataTable.prototype.rowSingleSelect = false;

/**
 * ContextMenu instance.
 *
 * @property contextMenu
 * @type YAHOO.widget.ContextMenu
 */
YAHOO.widget.DataTable.prototype.contextMenu = null;

/**
 * Current page number.
 *
 * @property pageCurrent
 * @type Number
 * @default 1
 */
YAHOO.widget.DataTable.prototype.pageCurrent = 1;

/**
 * Rows per page.
 *
 * @property rowsPerPage
 * @type Number
 * @default 500
 */
YAHOO.widget.DataTable.prototype.rowsPerPage = 500;

/**
 * Record index of first row of current page.
 *
 * @property startRecordIndex
 * @type Number
 * @default 1
 */
YAHOO.widget.DataTable.prototype.startRecordIndex = 1;

/**
 * Maximum number of pagination page links to show. Any page links beyond this number are
 * available through the "&lt;" and "&gt;" links. A negative value will display all page links.
 *
 * @property pageLinksLength
 * @type Number
 * @default -1
 */
YAHOO.widget.DataTable.prototype.pageLinksLength = -1;

/**
 * Options to show in the rows-per-page pagination dropdown, should be an array
 * of numbers. Null or an empty array causes no dropdown to be displayed.
 *
 * @property rowsPerPageDropdown
 * @type Number[]
 */
YAHOO.widget.DataTable.prototype.rowsPerPageDropdown = null;
        
/**
 * First pagination page link.
 *
 * @property pageLinksStart
 * @type Number
 * @default 1
 */
YAHOO.widget.DataTable.prototype.pageLinksStart = 1;

/**
 * An array of DIV elements into which pagination elements can go.
 *
 * @property pagers
 * @type HTMLElement[]
 */
YAHOO.widget.DataTable.prototype.pagers = null;

/**
 * True if the DataTable is empty of data. False if DataTable is populated with
 * data from RecordSet.
 *
 * @property isEmpty
 * @type Boolean
 */
YAHOO.widget.DataTable.prototype.isEmpty = false;

/**
 * Object literal holds sort metadata:
 *  sortedBy.colKey
 *  sortedBy.dir
 *
 *
 * @property sortedBy
 * @type Object
 */
YAHOO.widget.DataTable.prototype.sortedBy = null;


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
 * Returns element reference to TABLE.
 *
 * @method getTable
 * @return {HTMLElement} Reference to TABLE element.
 */
YAHOO.widget.DataTable.prototype.getTable = function() {
    return(this._elTable);
};

/**
 * Returns element reference to THEAD.
 *
 * @method getHead
 * @return {HTMLElement} Reference to THEAD element.
 */
YAHOO.widget.DataTable.prototype.getHead = function() {
    return(this._elHead);
};

/**
 * Returns element reference to TBODY.
 *
 * @method getBody
 * @return {HTMLElement} Reference to TBODY element.
 */
YAHOO.widget.DataTable.prototype.getBody = function() {
    return(this._elBody);
};

/**
 * Returns element reference to given TR cell.
 *
 * @method getRow
 * @param index {Number} Row number.
 * @return {HTMLElement} Reference to TR element.
 */
YAHOO.widget.DataTable.prototype.getRow = function(index) {
    return(this._elBody.rows[index]);
};

/**
 * Returns element reference to given TD cell.
 *
 * @method getCell
 * @param row {Number} Row number.
 * @param col {Number} Column number.
 * @return {HTMLElement} Reference to TD element.
 */
YAHOO.widget.DataTable.prototype.getCell = function(row, col) {
    return(this._elBody.rows[row].cells[col]);
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

    this._elMsgBody.style.display = "";
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

    this._elMsgBody.style.display = "";
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
    var elTable = this._elTable;
    if(!this._bFocused) {
        // http://developer.mozilla.org/en/docs/index.php?title=Key-navigable_custom_DHTML_widgets
        // The timeout is necessary in both IE and Firefox 1.5, to prevent scripts from doing
        // strange unexpected things as the user clicks on buttons and other controls.
        setTimeout(function() { elTable.focus(); },0);
        this._bFocused = true;
        this.fireEvent("tableFocusEvent");
    }
};

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

/**
 * Add rows to bottom of table body.
 *
 * @method appendRow
 * @param aRecords {YAHOO.widget.Record[]} Array of Records.
 */
YAHOO.widget.DataTable.prototype.appendRows = function(aRecords) {
    if(aRecords && aRecords.length > 0) {
        this.hideTableMessages();

        var rowIds = [];
        for(var i=0; i<aRecords.length; i++) {
            var rowId = this._addRow(aRecords[i]);
            rowIds.push(rowId);
        }
        
        this.fireEvent("rowAppendEvent", {rowIds:rowIds});
    }
};

/**
 * Add rows to top of table body.
 *
 * @method insertRows
 * @param aRecords {YAHOO.widget.Record[]} Array of Records.
 */
YAHOO.widget.DataTable.prototype.insertRows = function(aRecords) {
    if(aRecords && aRecords.length > 0) {
        this.hideTableMessages();

        var rowIds = [];
        for(var i=0; i<aRecords.length; i++) {
            var rowId = this._addRow(aRecords[i],0);
            rowIds.push(rowId);
        }
        
        this.fireEvent("rowInsertEvent", {rowIds:rowIds});
    }
};

/**
 * Replaces existing rows of table body with new Records.
 *
 * @method replaceRows
 * @param aRecords {YAHOO.widget.Record[]} Array of Records.
 */
YAHOO.widget.DataTable.prototype.replaceRows = function(aRecords) {
    var i;
    
    if(aRecords && aRecords.length > 0) {
        this.hideTableMessages();

        var elBody = this._elBody;
        var elRows = this._elBody.rows;
        
        // Remove extra rows
        while(elBody.hasChildNodes() && (elRows.length > aRecords.length)) {
            elBody.deleteRow(0);
        }
        
        // Unselect rows in the UI but keep tracking selected rows
        var selectedRecords = this.getSelectedRecordIds();
        if(selectedRecords.length > 0) {
            this._unselectAllRows();
        }
        
        var rowIds = [];
        // Format in-place existing rows
        for(i=0; i<elRows.length; i++) {
            if(aRecords[i]) {
                var oRecord = aRecords[i];
                rowIds.push(this._updateRow(oRecord,i));
            }
        }

        // Add rows as necessary
        for(i=elRows.length; i<aRecords.length; i++) {
            rowIds.push(this._addRow(aRecords[i]));
        }
        
        // Select any rows as necessary
        for(i=0; i<selectedRecords.length; i++) {
            var allRows = elBody.rows;
            for(var j=0; j<allRows.length; j++) {
                if(selectedRecords[i] == allRows[j].recordId) {
                    this._select([allRows[j]]);
                }
            }
        }
        
        this.fireEvent("rowReplaceEvent", {rowIds:rowIds});
    }
};

/**
 * Convenience method to add a new row to table body at position index if given,
 * or to the bottom otherwise.
 *
 * @method addRow
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param index {Number} Position at which to add row.
 */
YAHOO.widget.DataTable.prototype.addRow = function(oRecord, index) {
    if(oRecord) {
        var rowId = this._addRow(oRecord, index);
        if(index !== undefined) {
            this.fireEvent("rowInsertEvent", {rowIds:[rowId]});
        }
        else {
            this.fireEvent("rowAppendEvent", {rowIds:[rowId]});
        }
    }
};

/**
 * Updates existing row at position index with data from the given Record.
 *
 * @method updateRow
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param index {Number} Position at which to update row.
 */
YAHOO.widget.DataTable.prototype.updateRow = function(oRecord, index) {
    if(oRecord) {
        var rowId = this._updateRow(oRecord, index);
        this.fireEvent("rowUpdateEvent", {rowIds:[rowId]});
    }
};

/**
 * Calls delete on selected rows.
 *
 * @method deleteSelectedRows
 */
YAHOO.widget.DataTable.prototype.deleteRows = function(rows) {
    var rowIndexes = [];
    for(var i=0; i<rows.length; i++) {
        var rowIndex = (rows[i].sectionRowIndex !== undefined) ? rows[i].sectionRowIndex : null;
        rowIndexes.push(rowIndex);
        this._deleteRow(rows[i]);
        this.fireEvent("rowDeleteEvent", {rowIndexes:rowIndexes});
    }
};

/**
 * Deletes a given row element as well its corresponding Record in the RecordSet.
 *
 * @method deleteRow
 * @param elRow {element} HTML table row element reference.
 */
YAHOO.widget.DataTable.prototype.deleteRow = function(elRow) {
    if(elRow) {
        var rowIndex = (elRow.sectionRowIndex !== undefined) ? elRow.sectionRowIndex : null;
        this._deleteRow(elRow);
        this.fireEvent("rowDeleteEvent", {rowIndexes:[rowIndex]});
    }
};

/**
 * Sets one or more elements to the highlighted state.
 *
 * @method highlight
 * @param els {HTMLElement | String | HTMLElement[] | String[]} HTML TR element
 * reference, TR String ID, array of HTML TR element, or array of TR element IDs.
 */
YAHOO.widget.DataTable.prototype.highlight = function(els) {
    if(els.constructor != Array) {
        els = [els];
    }
    YAHOO.util.Dom.addClass(els,YAHOO.widget.DataTable.CLASS_HIGHLIGHT);
    this.fireEvent("highlightEvent",{els:els});
};

/**
 * Sets one or more elements to the unhighlighted state.
 *
 * @method unhighlight
 * @param els {HTMLElement | String | HTMLElement[] | String[]} HTML TR element
 * reference, TR String ID, array of HTML TR element, or array of TR element IDs.
 */
YAHOO.widget.DataTable.prototype.unhighlight = function(els) {
    if(els.constructor != Array) {
        els = [els];
    }
    YAHOO.util.Dom.removeClass(els,YAHOO.widget.DataTable.CLASS_HIGHLIGHT);
    this.fireEvent("unhighlightEvent",{els:els});
};


/**
 * Sets one or more elements to the selected state.
 *
 * @method select
 * @param els {HTMLElement | String | HTMLElement[] | String[]} HTML TR element
 * reference, TR String ID, array of HTML TR element, or array of TR element IDs.
 */
YAHOO.widget.DataTable.prototype.select = function(els) {
    if(els) {
        if(els.constructor != Array) {
            els = [els];
        }
        this._select(els);
        
        // Add Record ID to internal tracker
        var tracker = this._aSelectedRecords || [];
        for(var i=0; i<els.length; i++) {
            var id = els[i].recordId;
            // Remove if already there
            // Use Array.indexOf if available...
            if(tracker.indexOf && (tracker.indexOf(id) >  -1)) {
                tracker.splice(tracker.indexOf(id),1);
            }
            // ...or do it the old-fashioned way
            else {
                for(var j=0; j<tracker.length; j++) {
                   if(tracker[j] === id){
                        tracker.splice(j,1);
                    }
                }
            }
            // Add to the end
            tracker.push(id);
        }
        this._aSelectedRecords = tracker;
        this.fireEvent("selectEvent",{els:els});
    }
};

/**
 * Sets one or more elements to the unselected state.
 *
 * @method unselect
 * @param els {HTMLElement | String | HTMLElement[] | String[]} HTML element
 * reference, element ID, array of HTML elements, or array of element IDs
 */
YAHOO.widget.DataTable.prototype.unselect = function(els) {
    if(els) {
        if(els.constructor != Array) {
            els = [els];
        }
        this._unselect(els);
        // Remove Record ID from internal tracker
        var tracker = this._aSelectedRecords || [];
        for(var i=0; i<els.length; i++) {
            var id = els[i].recordId;
        
            // Use Array.indexOf if available...
            if(tracker.indexOf && (tracker.indexOf(id) >  -1)) {
                tracker.splice(tracker.indexOf(id),1);
            }
            // ...or do it the old-fashioned way
            else {
                for(var j=0; j<tracker.length; j++) {
                    if(tracker[j] === id){
                        tracker.splice(j,1);
                    }
                }
            }
        }
        this._aSelectedRecords = tracker;
        this.fireEvent("unselectEvent",{els:els});
    }
};

/**
 * Unselects all selected rows.
 *
 * @method unselectAllRows
 */
YAHOO.widget.DataTable.prototype.unselectAllRows = function() {
    var selectedRows = YAHOO.util.Dom.getElementsByClassName(YAHOO.widget.DataTable.CLASS_SELECTED,"tr",this._elBody);
    this.unselect(selectedRows);
    this.fireEvent("unselectEvent", {els:selectedRows});
};

/**
 * Unselects all selected cells.
 *
 * @method unselectAllCells
 */
YAHOO.widget.DataTable.prototype.unselectAllCells = function() {
    var selectedCells = YAHOO.util.Dom.getElementsByClassName(YAHOO.widget.DataTable.CLASS_SELECTED,"td",this._elBody);
    this.unselect(selectedCells);
    this.fireEvent("unselectEvent", {els:selectedCells});
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
 * Returns array of selected Record IDs.
 *
 * @method getSelectedRecordIds
 * @return {HTMLElement[]} Array of selected TR elements.
 */
YAHOO.widget.DataTable.prototype.getSelectedRecordIds = function() {
    return this._aSelectedRecords || [];
};

/**
 * Returns array of selected rows.
 *
 * @method getSelectedRows
 * @return {HTMLElement[]} Array of selected TR elements.
 */
YAHOO.widget.DataTable.prototype.getSelectedRows = function() {
    //TODO: keep internal array if this is non performant
    return YAHOO.util.Dom.getElementsByClassName(YAHOO.widget.DataTable.CLASS_SELECTED,"tr",this._elBody);
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
 * Returns pointer to the DataTable instance's ColumnSet instance.
 *
 * @method getColumnSet
 * @return {YAHOO.widget.ColumnSet} ColumnSet instance.
 */
YAHOO.widget.DataTable.prototype.getColumnSet = function() {
    return this._oColumnSet;
};

/**
 * Returns pointer to the DataTable instance's RecordSet instance.
 *
 * @method getRecordSet
 * @return {YAHOO.widget.RecordSet} RecordSet instance.
 */
YAHOO.widget.DataTable.prototype.getRecordSet = function() {
    return this._oRecordSet;
};

/**
 * Displays a specific page of a paginated DataTable.
 *
 * @method showPage
 * @param nPage {Number} Which page.
 */
YAHOO.widget.DataTable.prototype.showPage = function(nPage) {
    // Validate input
    if(!nPage || isNaN(nPage) || (nPage < 1) || (nPage > this._totalPages)) {
        nPage = 1;
    }
    this.pageCurrent = nPage;
    this.paginateRows();
};

/**
 * If pagination is enabled, paginates all data in RecordSet and renders
 * paginator UI, others renders normal TBODY without any paginator UI.
 *
 * @method paginateRows
 */
YAHOO.widget.DataTable.prototype.paginateRows = function() {
    var i;
    
    // How many total Records
    var recordsLength = this._oRecordSet.getLength();
    
    // How many rows this page
    var maxRows = (this.rowsPerPage < recordsLength) ?
            this.rowsPerPage : recordsLength;

    // How many total pages
    this._totalPages = Math.ceil(recordsLength / maxRows);

    // First row of this page
    this.startRecordIndex = (this.pageCurrent-1) * this.rowsPerPage;

    // How many page links to display
    var pageLinksLength =
            ((this.pageLinksLength > 0) && (this.pageLinksLength < this._totalPages)) ?
            this.pageLinksLength : this._totalPages;

    // First link of this page
    this.pageLinksStart = (Math.ceil(this.pageCurrent/pageLinksLength-1) * pageLinksLength) + 1;

    // Show Records for this page
    var pageRecords = this._oRecordSet.getRecords(this.startRecordIndex, this.rowsPerPage);
    this.replaceRows(pageRecords);

    if(this.rowsPerPage < recordsLength) {
        // Markup for page links
        var isFirstPage = (this.pageCurrent == 1) ? true : false;
        var isLastPage = (this.pageCurrent == this._totalPages) ? true : false;
        var firstPageLink = (isFirstPage) ?
                " <span class=\"" + YAHOO.widget.DataTable.CLASS_FIRSTPAGE + "\">&lt;&lt;</span> " :
                " <a href=\"#\" class=\"" + YAHOO.widget.DataTable.CLASS_FIRSTLINK + "\">&lt;&lt;</a> ";
        var prevPageLink = (isFirstPage) ?
                " <span class=\"" + YAHOO.widget.DataTable.CLASS_PREVPAGE + "\">&lt;</span> " :
                " <a href=\"#\" class=\"" + YAHOO.widget.DataTable.CLASS_PREVLINK + "\">&lt;</a> " ;
        var nextPageLink = (isLastPage) ?
                " <span class=\"" + YAHOO.widget.DataTable.CLASS_NEXTPAGE + "\">&gt;</span> " :
                " <a href=\"#\" class=\"" + YAHOO.widget.DataTable.CLASS_NEXTLINK + "\">&gt;</a> " ;
        var lastPageLink = (isLastPage) ?
                " <span class=\"" + YAHOO.widget.DataTable.CLASS_LASTPAGE + "\">&gt;&gt;</span> " :
                " <a href=\"#\" class=\"" + YAHOO.widget.DataTable.CLASS_LASTLINK + "\">&gt;&gt;</a> ";
        var markup = firstPageLink + prevPageLink;
        var maxLinks = (this.pageLinksStart+pageLinksLength < this._totalPages) ?
            this.pageLinksStart+pageLinksLength-1 : this._totalPages;
        for(i=this.pageLinksStart; i<=maxLinks; i++) {
             if(i != this.pageCurrent) {
                markup += " <a href=\"#\" class=\"" + YAHOO.widget.DataTable.CLASS_PAGELINK + "\">" + i + "</a> ";
            }
            else {
                markup += " <span class=\"" + YAHOO.widget.DataTable.CLASS_CURRENTPAGE + "\">" + i + "</span>";
            }
        }
        markup += nextPageLink + lastPageLink;

        // Markup for rows-per-page dropdowns
        var dropdown = this.rowsPerPageDropdown;
        var select1, select2;
        if(dropdown && (dropdown.constructor == Array) && (dropdown.length > 0)) {
            select1 = document.createElement("select");
            select1.className = YAHOO.widget.DataTable.CLASS_PAGESELECT;
            select2 = document.createElement("select");
            select2.className = YAHOO.widget.DataTable.CLASS_PAGESELECT;
            
            for(i=0; i<dropdown.length; i++) {
                var option1 = document.createElement("option");
                var option2 = document.createElement("option");
                option1.value = dropdown[i];
                option2.value = dropdown[i];
                option1.innerHTML = dropdown[i];
                option2.innerHTML = dropdown[i];

                if(this.rowsPerPage === dropdown[i]) {
                    option1.selected = true;
                    option2.selected = true;
                }
                option1 = select1.appendChild(option1);
                option2 = select2.appendChild(option2);
            }
        }

        // Populate each pager container with markup
        if(!this.pagers || (this.pagers.length === 0)) {
            var pager1 = document.createElement("span");
            pager1.className = YAHOO.widget.DataTable.CLASS_PAGELINKS;
            
            var pager2 = document.createElement("span");
            pager2.className = YAHOO.widget.DataTable.CLASS_PAGELINKS;

            pager1 = this._elContainer.insertBefore(pager1, this._elTable);
            select1 = (select1 === undefined) ? null :
                    this._elContainer.insertBefore(select1, this._elTable);
            select2 = (select2 === undefined) ? null :
                    this._elContainer.insertBefore(select2, this._elTable.nextSibling);
            pager2 = this._elContainer.insertBefore(pager2, this._elTable.nextSibling);
            this.pagers = [
                {links:pager1,select:select1},
                {links:pager2,select:select2}
            ];
        }
        for(i=0; i<this.pagers.length; i++) {
            this.pagers[i].links.innerHTML = markup;
            YAHOO.util.Event.purgeElement(this.pagers[i].links);
            if(this.pagers[i].select) {
                YAHOO.util.Event.purgeElement(this.pagers[i].select);
            }
            this.pagers[i].innerHTML = markup;
            YAHOO.util.Event.addListener(this.pagers[i].links,"click",this._onPagerClick,this);
            if(this.pagers[i].select) {
                YAHOO.util.Event.addListener(this.pagers[i].select,"change",this._onPagerSelect,this);
            }
        }
    }
    this.fireEvent("paginateEvent");
};

/**
 * Sort given column.
 *
 * @method sortColumn
 * @param oColumn {YAHOO.widget.Column} Column to sort. TODO: accept the TH or TH.key
 */
YAHOO.widget.DataTable.prototype.sortColumn = function(oColumn) {
    if(!oColumn) {
        return;
    }
    if(!oColumn instanceof YAHOO.widget.Column) {
        //TODO: Figure out the column based on TH ref or TH.key
        return;
    }
    if(oColumn.sortable) {
        // What is the default sort direction?
        var sortDir = (oColumn.sortOptions && oColumn.sortOptions.defaultOrder) ? oColumn.sortOptions.defaultOrder : "asc";

        //TODO: what if column doesn't have key?
        // Is this column sorted already?
        if(oColumn.key && this.sortedBy && (this.sortedBy.colKey == oColumn.key)) {
            if(this.sortedBy.dir) {
                sortDir = (this.sortedBy.dir == "asc") ? "desc" : "asc";
            }
            else {
                sortDir = (sortDir == "asc") ? "desc" : "asc";
            }
        }
        else if(!this.sortedBy) {
            this.sortedBy = {};
        }

        // Define the sort handler function based on the direction
        var sortFnc = null;
        if((sortDir == "desc") && oColumn.sortOptions && oColumn.sortOptions.descFunction) {
            sortFnc = oColumn.sortOptions.descFunction;
        }
        else if((sortDir == "asc") && oColumn.sortOptions && oColumn.sortOptions.ascFunction) {
            sortFnc = oColumn.sortOptions.ascFunction;
        }

        // Custom function was not provided so use the built-in sorter
        // ONLY IF column key is defined
        // TODO: use diff default functions based on column data type
        // TODO: nested/cumulative/hierarchical sorting
        if(!sortFnc && oColumn.key) {
            var sorted;
            sortFnc = function(a, b) {
                if(sortDir == "desc") {
                    sorted = YAHOO.util.Sort.compareDesc(a[oColumn.key],b[oColumn.key]);
                    if(sorted === 0) {
                        return YAHOO.util.Sort.compareDesc(a.id,b.id);
                    }
                    else {
                        return sorted;
                    }
                }
                else {
                    sorted = YAHOO.util.Sort.compareAsc(a[oColumn.key],b[oColumn.key]);
                    if(sorted === 0) {
                        return YAHOO.util.Sort.compareAsc(a.id,b.id);
                    }
                    else {
                        return sorted;
                    }
                }
            };
        }

        if(sortFnc) {
            // Do the actual sort
            this._oRecordSet.sort(sortFnc);

            // Update the UI
            this.paginateRows();

            // Update classes
            YAHOO.util.Dom.removeClass(this.sortedBy._id,YAHOO.widget.DataTable.CLASS_SORTEDBYASC);
            YAHOO.util.Dom.removeClass(this.sortedBy._id,YAHOO.widget.DataTable.CLASS_SORTEDBYDESC);
            var newClass = (sortDir == "asc") ? YAHOO.widget.DataTable.CLASS_SORTEDBYASC : YAHOO.widget.DataTable.CLASS_SORTEDBYDESC;
            YAHOO.util.Dom.addClass(oColumn.getId(), newClass);

            // Keep track of currently sorted column
            this.sortedBy.colKey = oColumn.key;
            this.sortedBy.dir = sortDir;
            this.sortedBy._id = oColumn.getId();

            this.fireEvent("columnSortEvent",{column:oColumn,dir:sortDir});
        }
    }
    else {
        //TODO
        YAHOO.log("Column is not sortable", "info", this.toString());
    }
};

/**
 * Shows editor for given cell.
 *
 * @method editCell
 */
YAHOO.widget.DataTable.prototype.editCell = function(elCell) {
    if(elCell && !isNaN(elCell.columnIndex)) {
        var column = this._oColumnSet.keys[elCell.columnIndex];
        if(column && column.editor) {
            this.activeEditor = column.getEditor(elCell,this._oRecordSet.getRecord(elCell.parentNode.recordId));
        }
        this._bFocused = true;
        this.fireEvent("editorShowEvent",{target:elCell,column:column});
    }
};

/**
 * Formats given cell.
 *
 * @method formatCell
 */
YAHOO.widget.DataTable.prototype.formatCell = function(elCell) {
    if(elCell && !isNaN(elCell.columnIndex)) {
        var column = this._oColumnSet.keys[elCell.columnIndex];
        column.format(elCell,this._oRecordSet.getRecord(elCell.parentNode.recordId));
        this.fireEvent("cellFormatEvent", {el:elCell});
    }
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
    YAHOO.util.Event.stopEvent(evt);
    
    //TODO: traverse DOM to find a columnIndex, incl safety net if none exists
    var columnIndex = target.columnIndex;
    if(!isNaN(columnIndex)) {
        this.sortColumn(this._oColumnSet.keys[columnIndex]);
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
    var i;
    var evt = oArgs.event;
    var target = oArgs.target;

    //TODO: add a safety net in case TR is never reached
    // Walk up the DOM until we get to the TR
    while(target.tagName.toLowerCase() != "tr") {
        target = target.parentNode;
    }

    if(this.isSelected(target)) {
        this.unselect(target);
    }
    else {
        if(this.rowSingleSelect && !evt.ctrlKey && !evt.shiftKey) {
            this.unselectAllRows();
        }
        if(evt.shiftKey) {
            var startRow = this._lastSelected;
            if(startRow && this.isSelected(startRow)) {
                this.unselectAllRows();
                if(startRow.sectionRowIndex < target.sectionRowIndex) {
                    for(i=startRow.sectionRowIndex; i<=target.sectionRowIndex; i++) {
                        this.select(this._elBody.rows[i]);
                    }
                }
                else {
                    for(i=target.sectionRowIndex; i<=startRow.sectionRowIndex; i++) {
                        this.select(this._elBody.rows[i]);
                    }
                }
            }
            else {
                this.select(target);
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
    while(target.tagName.toLowerCase() != "td") {
        target = target.parentNode;
    }

    if(this.isSelected(target)) {
        this.unselect(target);
    }
    else {
        if(this.rowSingleSelect && !evt.ctrlKey) {
            this.unselectAllCells();
        }
        this.select(target);
    }
};

/**
 * Overridable custom event handler to format cell.
 *
 * @method onEventFormatCell
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 */
YAHOO.widget.DataTable.prototype.onEventFormatCell = function(oArgs) {
    var evt = oArgs.event;
    var element = oArgs.target;

    //TODO: add a safety net in case TD is never reached
    // Walk up the DOM until we get to the TD
    while(element.tagName.toLowerCase() != "td") {
        element = element.parentNode;
    }

    this.formatCell(element);
};

/**
 * Overridable custom event handler to highlight cell.
 *
 * @method onEventHighlightCell
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 */
YAHOO.widget.DataTable.prototype.onEventHighlightCell = function(oArgs) {
    var evt = oArgs.event;
    var element = oArgs.target;

    //TODO: add a safety net in case TD is never reached
    // Walk up the DOM until we get to the TD
    while(element.tagName.toLowerCase() != "td") {
        element = element.parentNode;
    }
    this.highlight(element);
};

/**
 * Overridable custom event handler to unhighlight cell.
 *
 * @method onEventUnhighlightCell
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 */
YAHOO.widget.DataTable.prototype.onEventUnhighlightCell = function(oArgs) {
    var evt = oArgs.event;
    var element = oArgs.target;

    //TODO: add a safety net in case TD is never reached
    // Walk up the DOM until we get to the TD
    while(element.tagName.toLowerCase() != "td") {
        element = element.parentNode;
    }
    
    this.unhighlight(element);
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
    while(element.tagName.toLowerCase() != "td") {
        element = element.parentNode;
    }

    this.editCell(element);
};

/**
 * Handles data return for adding new rows to table, including updating pagination.
 *
 * @method onDataReturnPaginateRows
 * @param sRequest {String} Original request.
 * @param oResponse {Object} Response object.
 */
YAHOO.widget.DataTable.prototype.onDataReturnPaginateRows = function(sRequest, oResponse) {
    this.fireEvent("dataReturnEvent", {request:sRequest,response:oResponse});
    
    var ok = this.doBeforeLoadData(sRequest, oResponse);
    if(ok) {
        // Update the RecordSet from the response
        var newRecords = this._oRecordSet.append(oResponse);
        if(newRecords) {
            // Update markup
            this.paginateRows();
            YAHOO.log("Data returned for " + newRecords.length + " rows","info",this.toString());
        }
    }
};

/**
 * Handles data return for adding new rows to bottom of table.
 *
 * @method onDataReturnAppendRows
 * @param sRequest {String} Original request.
 * @param oResponse {Object} Response object.
 */
YAHOO.widget.DataTable.prototype.onDataReturnAppendRows = function(sRequest, oResponse) {
    this.fireEvent("dataReturnEvent", {request:sRequest,response:oResponse});
    
    var ok = this.doBeforeLoadData(sRequest, oResponse);
    if(ok) {
        // Update the RecordSet from the response
        var newRecords = this._oRecordSet.append(oResponse);
        if(newRecords) {
            // Update markup
            this.appendRows(newRecords);
            YAHOO.log("Data returned for " + newRecords.length + " rows","info",this.toString());
        }
    }
};

/**
 * Handles data return for inserting new rows to top of table.
 *
 * @method onDataReturnInsertRows
 * @param sRequest {String} Original request.
 * @param oResponse {Object} Response object.
 */
YAHOO.widget.DataTable.prototype.onDataReturnInsertRows = function(sRequest, oResponse) {
    this.fireEvent("dataReturnEvent", {request:sRequest,response:oResponse});
    
    var ok = this.doBeforeLoadData(sRequest, oResponse);
    if(ok) {
        // Update the RecordSet from the response
        var newRecords = this._oRecordSet.insert(oResponse);
        if(newRecords) {
            // Update markup
            this.insertRows(newRecords);
            YAHOO.log("Data returned for " + newRecords.length + " rows","info",this.toString());
        }
    }
};

/**
 * Handles data return for replacing all existing of table with new rows.
 *
 * @method onDataReturnReplaceRows
 * @param sRequest {String} Original request.
 * @param oResponse {Object} Response object.
 */
YAHOO.widget.DataTable.prototype.onDataReturnReplaceRows = function(sRequest, oResponse) {
    this.fireEvent("dataReturnEvent", {request:sRequest,response:oResponse});
    
    var ok = this.doBeforeLoadData(sRequest, oResponse);
    if(ok) {
        // Update the RecordSet from the response
        var newRecords = this._oRecordSet.replace(oResponse);
        if(newRecords) {
            this.replaceRows(newRecords);
            YAHOO.log("Data returned for " + newRecords.length + " rows","info",this.toString());
        }
    }
};

