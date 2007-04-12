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
    var i, ok;
    this._nIndex = YAHOO.widget.DataTable._nCount;
    this._sName = "instance" + this._nIndex;
    this.id = "yui-dt"+this._nIndex;

    // Validate configs
    if(oConfigs && (oConfigs.constructor == Object)) {
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
    var elTable = null;
    elContainer = YAHOO.util.Dom.get(elContainer);
    if(elContainer && elContainer.tagName && (elContainer.tagName.toLowerCase() == "div")) {
        this._elContainer = elContainer;
        // Peek in container child nodes to see if TABLE already exists
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
            
            ok = this.doBeforeLoadData(null,aRecords);
            if(ok) {
                this._oRecordSet.addRecords(aRecords);
                this.populateTable();
            }
            else {
                YAHOO.log("The function doBeforeLoadData returned false","error",this);
            }
        }
        // Create markup from scratch using the provided DataSource
        else if(this.dataSource) {
                this._initTable();

                ok = this.doBeforeLoadData(this.initialRequest,aRecords);
                if(ok) {
                    // Send out for data in an asynchronous request
                    oDataSource.sendRequest(this.initialRequest, this.onDataReturnPopulateTable, this);
                }
                else {
                    YAHOO.log("The function doBeforeLoadData returned false","error",this);
                }
        }
        // Else there is no data
        else {
            this._initTable();
            this.showTableMessage();
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
    elTable.className = YAHOO.widget.DataTable.CLASS_TABLE;
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
    YAHOO.util.Event.addListener(document, "keydown", this._onDocumentKeydown, this);
    YAHOO.util.Event.addListener(document, "click", this._onDocumentClick, this);
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
     * Fired when a TR element is selected.
     *
     * @event rowSelectEvent
     * @param oArgs.el {HTMLElement} The selected TR element.
     * @param oArgs.record {YAHOO.widget.Record} The associated Record instance.
     */
    this.createEvent("rowSelectEvent");

    /**
     * Fired when a TR element is unselected.
     *
     * @event rowUnselectEvent
     * @param oArgs.el {HTMLElement} The unselected TR element.
     * @param oArgs.record {YAHOO.widget.Record} The associated Record instance.
     */
    this.createEvent("rowUnselectEvent");

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
     * Fired when one or more TR elements are updated.
     *
     * @event rowUpdateEvent
     * @param oArgs.rowIds {Array} The IDs of the updated rows.
     */
    this.createEvent("rowUpdateEvent");

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
 * Class name assigned to TABLE element.
 *
 * @property CLASS_TABLE
 * @type String
 * @static
 * @final
 * @default "yui-dt"
 */
YAHOO.widget.DataTable.CLASS_TABLE = "yui-dt-table";

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
 * Class name assigned to FIRST elements.
 *
 * @property CLASS_FIRST
 * @type String
 * @static
 * @final
 * @default "yui-dt-first"
 */
YAHOO.widget.DataTable.CLASS_FIRST = "yui-dt-first";

/**
 * Class name assigned to LAST elements.
 *
 * @property CLASS_LAST
 * @type String
 * @static
 * @final
 * @default "yui-dt-last"
 */
YAHOO.widget.DataTable.CLASS_LAST = "yui-dt-last";

/**
 * Class name assigned to even TR elements.
 *
 * @property CLASS_EVEN
 * @type String
 * @static
 * @final
 * @default "yui-dt-even"
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
 * Class name assigned to elements with error messaging.
 *
 * @property CLASS_ERROR
 * @type String
 * @static
 * @final
 * @default "yui-dt-error"
 */
YAHOO.widget.DataTable.CLASS_ERROR = "yui-dt-error";

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
 * Class name assigned to container of a scrollable DataTable.
 *
 * @property CLASS_SCROLLABLE
 * @type String
 * @static
 * @final
 * @default "yui-dt-scrollable"
 */
YAHOO.widget.DataTable.CLASS_SCROLLABLE = "yui-dt-scrollable";

/**
 * Class name assigned to scrolling TBODY element of a scrollable DataTable.
 *
 * @property CLASS_SCROLLBODY
 * @type String
 * @static
 * @final
 * @default "yui-dt-scrollbody"
 */
YAHOO.widget.DataTable.CLASS_SCROLLBODY = "yui-dt-scrollbody";

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
 * Class name assigned to the paginator container element.
 *
 * @property CLASS_PAGINATOR
 * @type String
 * @static
 * @final
 * @default "yui-dt-paginator"
 */
YAHOO.widget.DataTable.CLASS_PAGINATOR = "yui-dt-paginator";

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
 * Class name assigned to editor DIV elements.
 *
 * @property CLASS_EDITOR
 * @type String
 * @static
 * @final
 * @default "yui-dt-editor"
 */
YAHOO.widget.DataTable.CLASS_EDITOR = "yui-dt-editor";

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

/**
 * Message to display while DataTable has data error.
 *
 * @property MSG_ERROR
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
 * First TR element reference pointer.
 *
 * @property _elFirstRow
 * @type HTMLElement
 * @private
 */
YAHOO.widget.DataTable.prototype._elFirstRow = null;

/**
 * Last TR element reference pointer.
 *
 * @property _elLastRow
 * @type HTMLElement
 * @private
 */
YAHOO.widget.DataTable.prototype._elLastRow = null;

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
 * Id of anchor row for multiple selections.
 *
 * @property _selectRowAnchorId
 * @type String
 * @private
 */
YAHOO.widget.DataTable.prototype._selectRowAnchorId = null;

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
 * Internal object literal to track built-in paginator values.
 *
 * @property _paginator
 * @type Object[]
 * @private
 */
/**
 * Internal variable to track paginator dropdown options.
 *
 * @property _paginator.dropdownOptions
 * @type Number[] | Object[]
 * @private
 */
/**
 * Internal variable to track paginator page links.
 *
 * @property _paginator.pageLinks
 * @type Number
 * @private
 */
/**
 * Tracks total number of pages, calculated on the fly.
 *
 * @property _paginator.totalPages
 * @type Number
 * @private
 */
/**
 * Tracks current page.
 *
 * @property _paginator.currentPage
 * @type Number
 * @private
 */
/**
 * Tracks rows per page.
 *
 * @property _paginator.rowsPerPage
 * @type Number
 * @private
 */
/**
 * Array of paginator UI references.
 *
 * @property _paginator.elements
 * @type Object[]
 * @private
 */
/**
 * Reference to overall container element.
 *
 * @property _paginator.elements.container
 * @type HTMLElement
 * @private
 */
/**
 * Reference to SELECT element.
 *
 * @property _paginator.elements.select
 * @type HTMLElement
 * @private
 */
/**
 * Reference to page links container element.
 *
 * @property _paginator.elements.links
 * @type HTMLElement
 * @private
 */
YAHOO.widget.DataTable.prototype._paginator = null;

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
    elTable.id = "yui-dt-table"+this._nIndex;

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
    this.showTableMessage(YAHOO.widget.DataTable.MSG_LOADING, YAHOO.widget.DataTable.CLASS_LOADING);

    // Create TBODY for data
    this._elBody = elTable.appendChild(document.createElement("tbody"));
    this._elBody.tabIndex = -1;
    YAHOO.util.Dom.addClass(this._elBody,YAHOO.widget.DataTable.CLASS_BODY);
    if(this.scrollable) {
        YAHOO.util.Dom.addClass(this._elBody,YAHOO.widget.DataTable.CLASS_SCROLLBODY);
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
    
    // Add Resizer only after DOM has been updated
    for(i=0; i<this._oColumnSet.keys.length; i++) {
        oColumn = this._oColumnSet.keys[i];
        if(oColumn.resizeable && YAHOO.util.DD) {
            //TODO: deal with fixed width tables
            // Skip the last column for fixed-width tables
            if(!this.fixedWidth ||
                    (this.fixedWidth &&
                    (oColumn.getIndex() != this._oColumnSet.keys.length-1)
                    )
            ) {
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
                //elHeadContainer.style.overflow = "hidden";
                // TODO: better way to get elHeadText
                var elHeadText = (YAHOO.util.Dom.getElementsByClassName(YAHOO.widget.DataTable.CLASS_HEADTEXT,"span",YAHOO.util.Dom.get(oColumn.getId())))[0];
                elHeadText.style.overflow = "hidden";
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
    elHeadCell.columnIndex = oColumn.getIndex();
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
    elHeadCell.rowSpan = oColumn.getRowSpan();
    elHeadCell.colSpan = oColumn.getColSpan();

    var elHeadContainer = elHeadCell.appendChild(document.createElement("div"));
    elHeadContainer.id = this.id+"-hdrow"+row+"-container"+col;
    YAHOO.util.Dom.addClass(elHeadContainer,YAHOO.widget.DataTable.CLASS_HEADCONTAINER);
    var elHeadContent = elHeadContainer.appendChild(document.createElement("span"));
    elHeadContent.id = this.id+"-hdrow"+row+"-text"+col;
    YAHOO.util.Dom.addClass(elHeadContent,YAHOO.widget.DataTable.CLASS_HEADTEXT);

    var contentText = oColumn.text || oColumn.key || "";
    if(oColumn.sortable) {
        YAHOO.util.Dom.addClass(elHeadContent,YAHOO.widget.DataTable.CLASS_SORTABLE);
        //TODO: Make hash configurable to be a server link
        //TODO: Make title configurable
        //TODO: Separate contentText from an accessibility link that says
        // Click to sort ascending and push it offscreen
        var sortLink = "?key=" + oColumn.key;
        elHeadContent.innerHTML = "<a href=\"" + sortLink + "\" title=\"Click to sort\" class=\"" + YAHOO.widget.DataTable.CLASS_SORTABLE + "\">" + contentText + "</a>";
         //elHeadContent.innerHTML = contentText;

    }
    else {
        elHeadContent.innerHTML = contentText;
    }
};

/**
 * If pagination is enabled, initializes paginator container elements and sets
 * internal tracking variables.
 *
 * @method _initPaginator
 * @private
 */
YAHOO.widget.DataTable.prototype._initPaginator = function() {
    var i,j;

    // Set up default values
    var paginator = {
        elements:[], // element references
        pageLinks:0,    // show all links
        dropdownOptions:null, // no dropdown
        rowsPerPage:500, // 500 rows
        currentPage:1  // page one
    };
    var elements = paginator.elements;

    // Deal with unused deprecated values
    if(this.startRecordIndex != 1) {
        YAHOO.log("The property startRecordIndex is no longer used.","warn", this.toString());
    }
    if(this.pageLinksStart != 1) {
        YAHOO.log("The property pageLinksStart is no longer used.","warn", this.toString());
    }

    // Validate deprecated rowsPerPage value
    if(this.rowsPerPage && YAHOO.util.Lang.isNumber(this.rowsPerPage)) {
        paginator.rowsPerPage = this.rowsPerPage;
        YAHOO.log("The property rowsPerPage is deprecated in favor of " +
                " paginatorOptions.rowsPerPage.","warn", this.toString());
    }
    // Validate rowsPerPage value
    if(this.paginatorOptions && YAHOO.util.Lang.isNumber(this.paginatorOptions.rowsPerPage)) {
        paginator.rowsPerPage = this.paginatorOptions.rowsPerPage;
    }

    // Validate deprecated currentPage value
    if(this.pageCurrent && YAHOO.util.Lang.isNumber(this.pageCurrent)) {
        paginator.currentPage = this.pageCurrent;
        YAHOO.log("The property pageCurrent is deprecated in favor of " +
                " paginatorOptions.currentPage.","warn", this.toString());
    }
    // Validate currentPage value
    if(this.paginatorOptions && YAHOO.util.Lang.isNumber(this.paginatorOptions.currentPage)) {
        paginator.currentPage = this.paginatorOptions.currentPage;
    }

    // Validate deprecated pagers values
    if(this.pagers && YAHOO.util.Lang.isArray(this.pagers)) {
        var dep_containers = this.pagers;
        for(i=0; i<dep_containers.length; i++) {
            if(YAHOO.util.Dom.inDocument(dep_containers[i])) {
                elements.push({container:YAHOO.util.Dom.get(dep_containers[i])});
            }
        }
        YAHOO.log("The property pagers is deprecated in favor of " +
                " paginatorOptions.containers.","warn", this.toString());
    }
    // Validate container values
    if(this.paginatorOptions && YAHOO.util.Lang.isArray(this.paginatorOptions.containers)) {
        var containers = this.paginatorOptions.containers;
        for(i=0; i<containers.length; i++) {
            if(YAHOO.util.Dom.inDocument(containers[i])) {
                elements.push({container:YAHOO.util.Dom.get(containers[i])});
            }
        }
    }

    // No containers found, create from scratch
    if(elements.length === 0) {
        // One before TABLE
        var pag0 = document.createElement("span");
        pag0.id = "yui-dt-pagcontainer0";
        pag0.className = YAHOO.widget.DataTable.CLASS_PAGINATOR;
        pag0 = this._elContainer.insertBefore(pag0, this._elTable);

        // One after TABLE
        var pag1 = document.createElement("span");
        pag1.id = "yui-dt-pagcontainer1";
        pag1.className = YAHOO.widget.DataTable.CLASS_PAGINATOR;
        pag1 = this._elContainer.insertBefore(pag1, this._elTable.nextSibling);

        // Add to tracker
        elements = [{container:pag0}, {container:pag1}];
    }

    // Validate deprecated pageLinksLength value, accounting for neg value means show all
    if(this.pageLinksLength &&
            YAHOO.util.Lang.isNumber(this.pageLinksLength)) {
        paginator.pageLinks = this.pageLinksLength;
        if(this.pageLinksLength < 0) {
            paginator.pageLinks = 0;
        }
        YAHOO.log("The property pageLinksLength is deprecated in favor of " +
                " paginatorOptions.pageLinks.","warn", this.toString());
    }
    // Validate pageLinks value
    if(this.paginatorOptions &&
            YAHOO.util.Lang.isNumber(this.paginatorOptions.pageLinks)) {
        paginator.pageLinks = this.paginatorOptions.pageLinks;
    }

    // Page links are enabled
    if(paginator.pageLinks > -1) {
        for(i=0; i<elements.length; i++) {
            // Create one page links container per paginator
            var links = document.createElement("span");
            links.id = "yui-dt-pagselect"+i;
            links.className = YAHOO.widget.DataTable.CLASS_PAGELINKS;
            links = elements[i].container.appendChild(links);

            // Add event listener
            YAHOO.util.Event.addListener(links,"click",this._onPagerClick,this);

            // Add to tracker
            elements[i].links = links;
        }
    }

    // Validate deprecated rowsPerPageDropdown value
    if(this.rowsPerPageDropdown &&
            YAHOO.util.Lang.isArray(this.rowsPerPageDropdown)) {
        paginator.dropdownOptions = this.rowsPerPageDropdown;
        YAHOO.log("The property rowsPerPageDropdown is deprecated in favor of " +
                " paginatorOptions.dropdownOptions.","warn", this.toString());
    }
    // Validate dropdownOptions value
    if(this.paginatorOptions &&
            YAHOO.util.Lang.isArray(this.paginatorOptions.dropdownOptions)) {
        paginator.dropdownOptions = this.paginatorOptions.dropdownOptions;
    }

    this._paginator = paginator;
    this._paginator.elements = elements;
};

/**
 * Add a new row to table body at position i if given, or to the bottom
 * otherwise. Does not fire any events or apply any classes.
 *
 * @method _addRow
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param index {Number} Position at which to add row.
 * @return {String} ID of the added TR element.
 * @private
 */
YAHOO.widget.DataTable.prototype._addRow = function(oRecord, index) {
    this.hideTableMessage();

    // Is this an insert or an append?
    var insert = (!YAHOO.lang.isNumber(index) || (index < 0)) ? false : true;
    if(!insert || !this._elBody.rows[index]) {
        index = this._elBody.rows.length;
        insert = false;
    }

    var oColumnSet = this._oColumnSet;
    var oRecordSet = this._oRecordSet;

    var elRow = (insert) ?
        this._elBody.insertBefore(document.createElement("tr"),this._elBody.rows[index]) :
        this._elBody.appendChild(document.createElement("tr"));
    var recId = oRecord.yuiRecordId;
    elRow.id = this.id+"-bdrow"+index;
    elRow.yuiRecordId = recId;

    // Create TBODY cells
    for(var j=0; j<oColumnSet.keys.length; j++) {
        var oColumn = oColumnSet.keys[j];
        var elCell = elRow.appendChild(document.createElement("td"));
        elCell.id = this.id+"-bdrow"+index+"-cell"+j;
        elCell.headers = oColumn.id;
        elCell.columnIndex = j;
        elCell.headers = oColumnSet.headers[j];

        this.formatCell(elCell, oRecord);
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
 * Resets first row being tracked by class YAHOO.widget.DataTable.CLASS_FIRST.
 *
 * @method _resetFirstRow
 * @private
 */
YAHOO.widget.DataTable.prototype._resetFirstRow = function() {
    if(this._elBody.rows.length > 0) {
        YAHOO.util.Dom.removeClass(this.getFirstRow(),YAHOO.widget.DataTable.CLASS_FIRST);
        var elFirstRow = this._elBody.rows[0];
        YAHOO.util.Dom.addClass(elFirstRow,YAHOO.widget.DataTable.CLASS_FIRST);
        this._elFirstRow = elFirstRow;
    }
    else {
        this._elFirstRow = null;
    }
};

/**
 * Resets last row being tracked by class YAHOO.widget.DataTable.CLASS_LAST.
 *
 * @method _resetLastRow
 * @private
 */
YAHOO.widget.DataTable.prototype._resetLastRow = function() {
    if(this._elBody.rows.length > 0) {
        YAHOO.util.Dom.removeClass(this.getLastRow(),YAHOO.widget.DataTable.CLASS_LAST);
        var elLastRow = this._elBody.rows[this._elBody.rows.length-1];
        YAHOO.util.Dom.addClass(elLastRow,YAHOO.widget.DataTable.CLASS_LAST);
        this._elLastRow = elLastRow;
    }
    else {
        this._elLastRow = null;
    }
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
    this.hideTableMessage();

    var elRow = this._elBody.rows[index];
    elRow.yuiRecordId = oRecord.yuiRecordId;

    // ...Update TBODY cells with new data
    for(var j=0; j<elRow.cells.length; j++) {
        this.formatCell(elRow.cells[j]);
    }
    return elRow.id;
};

/**
 * Sets elements to selected state. Does not fire any events. Does not affect
 * internal tracker.
 *
 * @method _select
 * @param els {HTMLElement | String | HTMLElement[] | String[]} HTML element by
 * reference or ID string, or array of HTML elements by reference or ID string.
 * @private
 */
YAHOO.widget.DataTable.prototype._select = function(els) {
    if(!YAHOO.lang.isArray(els)) {
        els = [els];
    }

    for(var i=0; i<els.length; i++) {
        // Set the style
        YAHOO.util.Dom.addClass(YAHOO.util.Dom.get(els[i]),YAHOO.widget.DataTable.CLASS_SELECTED);
    }
    this._lastSelectedId = els[els.length-1].id;
};

/**
 * Sets elements to the unselected state. Does not fire any events. Does not
 * affect internal tracker.
 *
 * @method _unselect
 * @param els {HTMLElement | String | HTMLElement[] | String[]} HTMLElement by
 * reference or ID string, or array of HTML elements by reference or ID string.
 * @private
 */
YAHOO.widget.DataTable.prototype._unselect = function(els) {
    if(!YAHOO.lang.isArray(els)) {
        els = [els];
    }
    
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
    var recordId = elRow.yuiRecordId;
    for(var i=0; i< allRows.length; i++) {
        if(id == allRows[i].id) {
            this._elBody.deleteRow(i);

            // Update the RecordSet
            this._oRecordSet.deleteRecord(i);
            break;
        }
    }
    if(this._elBody.rows.length === 0) {
        this.showTableMessage(YAHOO.widget.DataTable.MSG_EMPTY, YAHOO.widget.DataTable.CLASS_EMPTY);
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
    oSelf.cancelEditorData();
    
    var elTarget = YAHOO.util.Event.getTarget(e);
    var elTag = elTarget.tagName.toLowerCase();
    var knownTag = false; // True if event should stop propagating

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
                    if(!YAHOO.util.Dom.hasClass(elTarget, YAHOO.widget.DataTable.CLASS_SORTABLE)) {
                        knownTag = true;
                    }
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
    //oSelf.focusTable();
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
    var oldSelectedId = oSelf._lastSelectedId;
    // Only move selection if one is already selected
    // TODO: config to allow selection even if one is NOT already selected
    // TODO: if something isn't selected already, arrow key should select first or last one
    if(oldSelectedId && oSelf.isSelected(oldSelectedId)) {
        var oldSelected = YAHOO.util.Dom.get(oldSelectedId);
        var newSelected;
        // arrow down
        if(e.keyCode == 40) {
            YAHOO.util.Event.stopEvent(e);
            // row mode
            if(oldSelected.tagName.toLowerCase() == "tr") {
                // We have room to move down
                if(oldSelected.sectionRowIndex+1 < oSelf._elBody.rows.length) {
                            if(!e.shiftKey || oSelf.rowSingleSelect) {
                                oSelf.unselectAllRows();
                            }
                            newSelected = oSelf._elBody.rows[oldSelected.sectionRowIndex+1];
                            oSelf.selectRow(newSelected);
                            
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
            //oSelf._bFocused = false;
            //oSelf.focusTable();
        }
        // arrow up
        else if(e.keyCode == 38) {
            YAHOO.util.Event.stopEvent(e);
            // row mode
            if(oldSelected.tagName.toLowerCase() == "tr") {
                // We have room to move up
                if((oldSelected.sectionRowIndex > 0)) {
                            if(!e.shiftKey || oSelf.rowSingleSelect) {
                                oSelf.unselectAllRows();
                            }
                            newSelected = oSelf._elBody.rows[oldSelected.sectionRowIndex-1];
                            oSelf.selectRow(newSelected);
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
            //oSelf._bFocused = false;
            //oSelf.focusTable();
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
 * Handles keydown events on the DOCUMENT. Executes interaction with editor.
 *
 * @method _onDocumentKeydown
 * @param e {HTMLEvent} The key event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onDocumentKeydown = function(e, oSelf) {
    // esc Clears active editor
    if((e.keyCode == 27)) {
        oSelf.cancelEditorData();
    }
    // enter Saves active editor data
    if(e.keyCode == 13) {
        YAHOO.util.Event.stopEvent(e);
        oSelf.saveEditorData();
    }
};

/**
 * Handles click events on the DOCUMENT. Hides active editor.
 *
 * @method _onDocumentClick
 * @param e {HTMLEvent} The click event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onDocumentClick = function(e, oSelf) {
    oSelf.saveEditorData();
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
    oSelf.saveEditorData();
    
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
                            oSelf.showPage(oSelf._paginator.totalPages);
                            break;
                        case YAHOO.widget.DataTable.CLASS_PREVLINK:
                            oSelf.showPage(oSelf._paginator.currentPage-1);
                            break;
                        case YAHOO.widget.DataTable.CLASS_NEXTLINK:
                            oSelf.showPage(oSelf._paginator.currentPage+1);
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
    var value = elTarget[elTarget.selectedIndex].value;

    // How many rows per page
    var oldRowsPerPage = oSelf._paginator.rowsPerPage;
    var rowsPerPage = parseInt(value,10) || null;
    if(rowsPerPage && (rowsPerPage != oldRowsPerPage)) {
        if(rowsPerPage > oldRowsPerPage) {
            oSelf._paginator.currentPage = 1;
        }
        oSelf._paginator.rowsPerPage = rowsPerPage;
        oSelf.populateTable();
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
 * True if built-in paginator is enabled.
 *
 * @property paginator
 * @type Boolean
 * @default false
 */
YAHOO.widget.DataTable.prototype.paginator = false;

/**
 * Object literal of initial paginator key:value properties.
 *
 * @property paginatorOptions
 * @type Object
 * @default {}
 */
/**
 * If built-in paginator is enabled, each page will display up to the given
 * number of rows per page. A value less than 1 will display all available
 * rows.
 *
 * @property paginatorOptions.rowsPerPage
 * @type Number
 * @default 500
 */
/**
 * If built-in paginator is enabled, current page to display.
 *
 * @property paginatorOptions.currentPage
 * @type Number
 * @default 1
 */
/**
 * Array of container elements to hold paginator UI, if enabled. If null,
 * 2 containers will be created dynamically, one before and one after the
 * TABLE element.
 *
 * @property paginatorOptions.containers
 * @type HTMLElement[]
 * @default null
 */
/**
 * Values to show in the SELECT dropdown. Can be an array of numbers to populate
 * each OPTION's value and text with the same value, or an array of object
 * literals of syntax {value:myValue, text:myText} will populate OPTION with
 * corresponding value and text. A null value or empty array prevents the
 * dropdown from displayed altogether.
 *
 * @property paginatorOptions.dropdownOptions
 * @type Number[] | Object{}
 */
/**
 * Maximum number of links to page numbers to show in paginator UI. Any pages
 * not linked would be available through the next/previous style links. A 0
 * value displays all page links. A negative value disables all page links.
 *
 * @property paginatorOptions.pageLinks
 * @type Number
 * @default 0
 */
YAHOO.widget.DataTable.prototype.paginatorOptions = null;

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
// Deprecated public member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated No longer used.
 * @property isEmpty
 * 
 */
/**
 * @deprecated No longer used.
 * @property isEmpty
 */
/**
 * @deprecated No longer used.
 * @property startRecordIndex
 */
/**
 * @deprecated No longer used.
 * @property pageLinksStart
 */
/**
 * @deprecated Deprecated in favor of paginatorOptions.currentPage
 * @property pageCurrent
 */
/**
 * @deprecated Deprecated in favor of paginatorOptions.rowsPerPage
 * @property rowsPerPage
 */
/**
 * @deprecated Deprecated in favor of paginatorOptions.pageLinks
 * @property pageLinksLength
 */
/**
 * @deprecated Deprecated in favor of paginatorOptions.dropdownOptions
 * @property rowsPerPageDropdown
 */
/**
 * @deprecated Deprecated in favor of paginatorOptions.containers
 * @property pagers
 */

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
 * Returns element reference to TR element at given index.
 *
 * @method getRow
 * @param index {Number} Row number.
 * @return {HTMLElement} Reference to TR element.
 */
YAHOO.widget.DataTable.prototype.getRow = function(index) {
    if(YAHOO.lang.isNumber(index) && (index > -1)) {
        return(this._elBody.rows[index]);
    }
    return null;
};

/**
 * Returns element reference to first TR element.
 *
 * @method getFirstRow
 * @return {HTMLElement} Reference to first TR element.
 */
YAHOO.widget.DataTable.prototype.getFirstRow = function() {
    return this._elFirstRow;
};

/**
 * Returns element reference to last TR element.
 *
 * @method getLastRow
 * @return {HTMLElement} Reference to last TR element.
 */
YAHOO.widget.DataTable.prototype.getLastRow = function() {
    return this._elLastRow;
};

/**
 * Returns element reference to TD element at given row and column positions.
 *
 * @method getCell
 * @param rowIndex {Number} Row index.
 * @param colIndex {Number} Column index.
 * @return {HTMLElement} Reference to TD element.
 */
YAHOO.widget.DataTable.prototype.getCell = function(rowIndex, colIndex) {
    if(YAHOO.lang.isNumber(rowIndex) && YAHOO.lang.isNumber(colIndex) &&
            (rowIndex > -1) && (colIndex > -1)) {
        return(this._elBody.rows[rowIndex].cells[colIndex]);
    }
    return null;
};

/**
 * Displays placeholder row with a message when there are no data rows.
 *
 * @method showTableMessage
 * @param sHTML {String} (optional) Value for innerHTML.
 * @param sClassName {String} (optional) Classname.
 */
YAHOO.widget.DataTable.prototype.showTableMessage = function(sHTML, sClassName) {
    var elCell = this._elMsgCell;
    if(YAHOO.lang.isString(sHTML)) {
        elCell.innerHTML = sHTML;
    }
    if(YAHOO.lang.isString(sClassName)) {
        elCell.className = sClassName;
    }
    this._elMsgBody.style.display = "";
};

/**
 * Hide placeholder message.
 *
 * @method hideTableMessage
 */
YAHOO.widget.DataTable.prototype.hideTableMessage = function() {
    this._elMsgBody.style.display = "none";
};


/**
 * @deprecated Deprecated in favor of showTableMessage().
 * @method showEmptyMessage
 * 
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
 * @deprecated Deprecated in favor of showTableMessage().
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
 * @deprecated Deprecated in favor of hideTableMessage().
 * @method hideTableMessages
 * 
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
 * @method appendRows
 * @param aRecords {YAHOO.widget.Record[]} Array of Records.
 */
YAHOO.widget.DataTable.prototype.appendRows = function(aRecords) {
    if(YAHOO.lang.isArray(aRecords) && (aRecords.length > 0)) {
        this.hideTableMessage();

        var rowIds = [];
        for(var i=0; i<aRecords.length; i++) {
            var rowId = this._addRow(aRecords[i]);
            rowIds.push(rowId);
        }

        // Reset last-row tracker
        this._resetLastRow();
        
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
    if(YAHOO.lang.isArray(aRecords) && (aRecords.length > 0)) {
        this.hideTableMessage();

        var rowIds = [];
        for(var i=0; i<aRecords.length; i++) {
            var rowId = this._addRow(aRecords[i],0);
            rowIds.push(rowId);
        }
        
        // Reset first-row tracker
        this._resetFirstRow();

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
    
    if(YAHOO.lang.isArray(aRecords) && (aRecords.length > 0)) {
        this.hideTableMessage();

        var elBody = this._elBody;
        var elRows = this._elBody.rows;

        // Remove extra rows from the bottom so as to preserve ID order
        while(elBody.hasChildNodes() && (elRows.length > aRecords.length)) {
            elBody.deleteRow(elRows.length-1);
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
                rowIds.push(this._updateRow(aRecords[i],i));
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
                if(selectedRecords[i] == allRows[j].yuiRecordId) {
                    this._select([allRows[j]]);
                }
            }
        }
        
        // Reset first-row and last-row trackers
        this._resetFirstRow();
        this._resetLastRow();

        this.fireEvent("rowReplaceEvent", {rowIds:rowIds});
    }
    else {
        this.showTableMessage(YAHOO.widget.DataTable.MSG_EMPTY, YAHOO.widget.DataTable.CLASS_EMPTY);
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
    if(oRecord && (oRecord instanceof YAHOO.widget.Record)) {
        var rowId = this._addRow(oRecord, index);
        // TODO: row may be inserted into middle... so don't reset first/last
        if(YAHOO.lang.isNumber(index)) {
            if(index === 0) {
                this._resetFirstRow();
            }
            this.fireEvent("rowInsertEvent", {rowIds:[rowId]});
        }
        else {
            this._resetLastRow();
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
    if(oRecord && (oRecord instanceof YAHOO.widget.Record)) {
        var rowId = this._updateRow(oRecord, index);
        this.fireEvent("rowUpdateEvent", {rowIds:[rowId]});
    }
};

/**
 * Calls delete on given rows.
 *
 * @method deleteRows
 * @param elRows {HTMLElement[]} Array of HTML table row element reference.
 */
YAHOO.widget.DataTable.prototype.deleteRows = function(elRows) {
    var rowIndexes = [];
    for(var i=0; i<rows.length; i++) {
        var rowIndex = (rows[i].sectionRowIndex !== undefined) ? rows[i].sectionRowIndex : null;
        rowIndexes.push(rowIndex);
        this._deleteRow(rows[i]);
        this.fireEvent("rowDeleteEvent", {rowIndexes:rowIndexes});
    }
    
    //TODO: can be optimized?
    // Reset first-row and last-row trackers
    this._resetFirstRow();
    this._resetLastRow();
};

/**
 * Deletes a given row element as well its corresponding Record in the RecordSet.
 *
 * @method deleteRow
 * @param elRow {HTMLElement} HTML table row element reference.
 */
YAHOO.widget.DataTable.prototype.deleteRow = function(elRow) {
    if(elRow && YAHOO.util.Dom.inDocument(elRow)) {
        var rowIndex = (elRow.sectionRowIndex !== undefined) ? elRow.sectionRowIndex : null;
        this._deleteRow(elRow);
        this.fireEvent("rowDeleteEvent", {rowIndexes:[rowIndex]});
        
        //TODO: can be optimized?
        // Reset first-row and last-row trackers
        this._resetFirstRow();
        this._resetLastRow();
    }
    
};

/**
 * Sets a row to the selected state.
 *
 * @method selectRow
 * @param row {HTMLElement | String} HTML TR element reference or ID.
 */
YAHOO.widget.DataTable.prototype.selectRow = function(row) {
    // Validate the row
    row = YAHOO.util.Dom.get(row);
    if(row && row.yuiRecordId) {
        var recordId = row.yuiRecordId;

        // Update internal tracker
        var tracker = this._aSelectedRecords || [];
        // Remove Record ID if already there...
        if(tracker.length > 0) {
            // ...using Array.indexOf if available...
            if(tracker.indexOf && (tracker.indexOf(recordId) > -1)) {
                tracker.splice(tracker.indexOf(recordId), 1);
            }
            // ...or do it the old-fashioned way
            else {
                for(var i=0; i<tracker.length; i++) {
                   if(tracker[i] === recordId) {
                        tracker.splice(i, 1);
                    }
                }
            }
        }

        // Update UI
        this._select(row);
        
        // Add to the end of internal tracker
        tracker.push(recordId);
        this._aSelectedRecords = tracker;

        this.fireEvent("rowSelectEvent",{el:row, record:this._oRecordSet.getRecord(recordId)});
        YAHOO.log("Row selected: ID=\"" + row.id + "\", " +
                "Record=" + this._oRecordSet.getRecord(recordId),
                "info",this.toString());
    }
};

/**
 * Sets a row to the unselected state.
 *
 * @method unselectRow
 * @param row {HTMLElement | String} HTML TR element reference or ID.
 */
YAHOO.widget.DataTable.prototype.unselectRow = function(row) {
    // Validate the row
    row = YAHOO.util.Dom.get(row);
    if(row && row.yuiRecordId) {
        var recordId = row.yuiRecordId;

        // Update internal tracker
        var tracker = this._aSelectedRecords || [];
        // Remove Record ID if there...
        if(tracker.length > 0) {
            // ...using Array.indexOf if available...
            if(tracker.indexOf && (tracker.indexOf(recordId) > -1)) {
                tracker.splice(tracker.indexOf(recordId), 1);
            }
            // ...or do it the old-fashioned way
            else {
                for(var i=0; i<tracker.length; i++) {
                   if(tracker[i] === recordId) {
                        tracker.splice(i, 1);
                    }
                }
            }
        }

        // Update UI
        this._unselect(row);

        this.fireEvent("rowUnselectEvent",{el:row, record:this._oRecordSet.getRecord(recordId)});
        YAHOO.log("Row unselected: ID=\"" + row.id + "\", " +
                "Record=" + this._oRecordSet.getRecord(recordId),
                "info",this.toString());
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
    if(els) {
        if(!YAHOO.lang.isArray(els)) {
            els = [els];
        }
        YAHOO.util.Dom.addClass(els,YAHOO.widget.DataTable.CLASS_HIGHLIGHT);
        this.fireEvent("highlightEvent",{els:els});
    }
};

/**
 * Sets one or more elements to the unhighlighted state.
 *
 * @method unhighlight
 * @param els {HTMLElement | String | HTMLElement[] | String[]} HTML TR element
 * reference, TR String ID, array of HTML TR element, or array of TR element IDs.
 */
YAHOO.widget.DataTable.prototype.unhighlight = function(els) {
    if(els) {
        if(!YAHOO.lang.isArray(els)) {
            els = [els];
        }
        YAHOO.util.Dom.removeClass(els,YAHOO.widget.DataTable.CLASS_HIGHLIGHT);
        this.fireEvent("unhighlightEvent",{els:els});
    }
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
        if(!YAHOO.lang.isArray(els)) {
            els = [els];
        }
        this._select(els);

        // Add Record ID to internal tracker
        var tracker = this._aSelectedRecords || [];
        for(var i=0; i<els.length; i++) {
            var id = els[i].yuiRecordId;
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
        YAHOO.log(els.length + " element(s) selected", "info", this.toString());
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
        if(!YAHOO.lang.isArray(els)) {
            els = [els];
        }
        this._unselect(els);
        // Remove Record ID from internal tracker
        var tracker = this._aSelectedRecords || [];
        for(var i=0; i<els.length; i++) {
            var id = els[i].yuiRecordId;
        
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
        YAHOO.log(els.length + " element(s) unselected", "info", this.toString());
    }
};

/**
 * Unselects all selected rows (across all pages, if applicable).
 *
 * @method unselectAllRows
 */
YAHOO.widget.DataTable.prototype.unselectAllRows = function() {
    var selectedRows = YAHOO.util.Dom.getElementsByClassName(YAHOO.widget.DataTable.CLASS_SELECTED,"tr",this._elBody);
    this.unselect(selectedRows);
    this._aSelectedRecords = [];
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
 * @param el {HTMLElement} HTML element reference or ID.
 * @return {Boolean} True if element is selected.
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
 * Returns paginator object literal.
 *
 * @method getPaginator
 * @return {Object} Paginator object literal with following properties:
 *     <ul>
 *     <li>currentPage: current page number</li>
 *     <li>dropdownOptions: array of numbers to show in dropdown</li>
 *     <li>elements: array of object literals that define where to show
 *     paginator UI with following properties:
 *         <ul>
 *         <li>container: element reference to paginator container</li>
 *         <li>links: element reference to page links container</li>
 *         <li>select: element reference to dropdown</li>
 *         </ul>
 *     </li>
 *     <li>pageLinks: number of page links displayed</li>
 *     <li>pageLinkStart: page number of first link</li>
 *     <li>rowsPerPage: number of rows displayed</li>
 *     <li>totalPages: total number of pages</li>
 *     </ul>
 */
YAHOO.widget.DataTable.prototype.getPaginator = function() {
    return this._paginator;
};

/**
 * Displays a specific page of a paginated DataTable.
 *
 * @method showPage
 * @param nPage {Number} Which page.
 */
YAHOO.widget.DataTable.prototype.showPage = function(nPage) {
    // Validate input
    if(!YAHOO.lang.isNumber(nPage) || (nPage < 1) || (nPage > this._paginator.totalPages)) {
        nPage = 1;
    }
    this._paginator.currentPage = nPage;
    this.populateTable();
};

/**
 * Updates Paginator containers with markup. Override this method to customize pagination UI.
 *
 * @method formatPaginators
 */
 YAHOO.widget.DataTable.prototype.formatPaginators = function() {
    var pag = this._paginator;
    
    // For Opera workaround
    var dropdownEnabled = false;
    
    // Update markup of each known Paginator container
    for(var i=0; i<pag.elements.length; i++) {
        var oElReferences = pag.elements[i];
        
        // Links are enabled
        if(pag.pageLinks > -1) {
            this.formatPaginatorLinks(oElReferences.links, pag.currentPage, pag.pageLinksStart, pag.pageLinks, pag.totalPages);
        }

        // Dropdown is enabled
        if(pag.dropdownOptions) {
            dropdownEnabled = true;
            this.formatPaginatorDropdown(oElReferences);
        }
    }

    // For Opera artifacting in dropdowns
    if(dropdownEnabled && navigator.userAgent.toLowerCase().indexOf("opera") != -1) {
        document.body.style += '';
    }
};

/**
 * Updates Paginator dropdown. If dropdown doesn't exist, the markup is created.
 * Sets dropdown's "selected" value.
 *
 * @method formatPaginatorDropdown
 * @param oElReferences {Object} Object literal of pointers to Paginator UI
 * elements.
 */
YAHOO.widget.DataTable.prototype.formatPaginatorDropdown = function(oElReferences) {
    var i;
    
    // Dropdown doesn't exist, so let's create it
    if(!oElReferences.select) {
        // Validate dropdownOptions
        if(YAHOO.lang.isArray(this._paginator.dropdownOptions)) {
            // Show these options in the dropdown
            var dropdownOptions = this._paginator.dropdownOptions;
            
            // Create one SELECT element per Paginator container
            var select = document.createElement("select");
            select.className = YAHOO.widget.DataTable.CLASS_PAGESELECT;
            select = oElReferences.container.appendChild(select);

            // Create OPTION elements
            for(i=0; i<dropdownOptions.length; i++) {
                var option = document.createElement("option");
                option.value = dropdownOptions[i].value || dropdownOptions[i];
                option.innerHTML = dropdownOptions[i].text || dropdownOptions[i];
                option = select.appendChild(option);
            }

            // Add event listener
            YAHOO.util.Event.addListener(select,"change",this._onPagerSelect,this);

            // Add DOM reference to tracker
            oElReferences.select = select;
        }
        else {
            YAHOO.log("Could not create Paginator dropdown due to invalid dropdownOptions","error",this.toString());
        }
    }
    
    if(oElReferences.select && oElReferences.select.options) {
        var options = oElReferences.select.options;
        // Update dropdown's "selected" value
        for(i=options.length-1; i>-1; i--) {
            if((this._paginator.rowsPerPage + "") === options[i].value) {
                options[i].selected = true;
            }
        }
    }
    else {
        YAHOO.log("Could not update Paginator dropdown","error",this.toString());
    }
};

/**
 * Updates Paginator links container with markup.
 *
 * @method formatPaginatorLinks
 */
YAHOO.widget.DataTable.prototype.formatPaginatorLinks = function(elLinksContainer, nCurrentPage, nPageLinksStart, nPageLinksLength, nTotalPages) {
    // Markup for page links
    var isFirstPage = (nCurrentPage == 1) ? true : false;
    var isLastPage = (nCurrentPage == nTotalPages) ? true : false;
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
    markup = firstPageLink + prevPageLink;
    var maxLinks = (nPageLinksStart+nPageLinksLength < nTotalPages) ?
        nPageLinksStart+nPageLinksLength-1 : nTotalPages;
    // Special case for pageLinksLength 0 => show all links
    if(nPageLinksLength === 0) {
        maxLinks = nTotalPages;
    }
    for(var i=nPageLinksStart; i<=maxLinks; i++) {
         if(i != nCurrentPage) {
            markup += " <a href=\"#\" class=\"" + YAHOO.widget.DataTable.CLASS_PAGELINK + "\">" + i + "</a> ";
        }
        else {
            markup += " <span class=\"" + YAHOO.widget.DataTable.CLASS_CURRENTPAGE + "\">" + i + "</span>";
        }
    }
    markup += nextPageLink + lastPageLink;
    elLinksContainer.innerHTML = markup;
};

/**
 * Updates Paginator internal values and UI.
 * @method updatePaginator
 */
YAHOO.widget.DataTable.prototype.updatePaginator = function() {
    // Paginator values must be initialized
    if(this._paginator === null) {
        this._initPaginator();
    }

    // How many total Records
    var recordsLength = this._oRecordSet.getLength();

    // If rowsPerPage < 1, show all rows
    this._paginator.rowsPerPage = (this._paginator.rowsPerPage > 0) ?
        this._paginator.rowsPerPage : recordsLength;
    var rowsPerPage = this._paginator.rowsPerPage;


    // How many rows this page
    var maxRows = (rowsPerPage < recordsLength) ?
            rowsPerPage : recordsLength;

    // How many total pages
    this._paginator.totalPages = Math.ceil(recordsLength / maxRows);

    // What is current page
    var currentPage = this._paginator.currentPage;

    // First row of this page
    this._paginator.startRecordIndex =  (currentPage-1) * rowsPerPage;

    // How many page links to display
    var pageLinksLength = this._paginator.pageLinks;
    // Show all links
    if(pageLinksLength === 0) {
        pageLinksLength = this._paginator.totalPages;
    }
    // Page links are enabled
    if(pageLinksLength > -1) {
        // First page link for this page
        this._paginator.pageLinksStart = (pageLinksLength == 1) ? currentPage :
                (Math.ceil(currentPage/pageLinksLength-1) * pageLinksLength) + 1;
    }

    this.formatPaginators();

    this.fireEvent("paginateEvent", {paginator:this._paginator});
    YAHOO.log("Currently displaying page " + currentPage + " of " +
            this._paginator.totalPages + " with " + rowsPerPage +
            " rows per page", "info", this.toString());
};

/**
 * @deprecated Deprecated in favor of populateTable().
 * @method populateTable
 */
YAHOO.widget.DataTable.prototype.paginateRows = function() {
    this.populateTable();
};

/**
 * Populates TBODY rows with data from RecordSet. If pagination is enabled,
 * displays only rows for current page and updates paginator UI, otherwise
 * displays all rows.
 *
 * @method populateTable
 */
YAHOO.widget.DataTable.prototype.populateTable = function() {
    // Records with which to populate the table
    var records;
    
    // Paginator is disabled
    if(!this.paginator) {
        // Paginator must be destroyed
        if(this._paginator !== null) {
            //TODO: this.destroyPaginator();
        }
    }
    // Paginator is enabled
    if(this.paginator) {
        this.updatePaginator();
        records = this._oRecordSet.getRecords(this._paginator.startRecordIndex, this._paginator.rowsPerPage);
    }
    // Show all records
    else {
        records = this._oRecordSet.getRecords();
    }

    this.replaceRows(records);
    YAHOO.log("Table populated with " + records.length + " rows", "info", this.toString());
};

/**
 * Sort given column.
 *
 * @method sortColumn
 * @param oColumn {YAHOO.widget.Column} Column instance.
 */
YAHOO.widget.DataTable.prototype.sortColumn = function(oColumn) {
    if(!oColumn) {
        return;
    }
    if(!oColumn instanceof YAHOO.widget.Column) {
        //TODO: accept the TH or TH.key
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
            this.populateTable();

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
            YAHOO.log("Column \"" + oColumn.key + "\" sorted \"" + sortDir + "\"", "info", this.toString());
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
 * @param elCell {HTMLElement} Cell element to edit.
 */
YAHOO.widget.DataTable.prototype.editCell = function(elCell) {
    if(elCell && YAHOO.lang.isNumber(elCell.columnIndex)) {
        var column = this._oColumnSet.keys[elCell.columnIndex];
        if(column && column.editor) {
            this.activeEditor = column.getEditor(elCell,this._oRecordSet.getRecord(elCell.parentNode.yuiRecordId));
            this._bFocused = true;
            if(this.activeEditor) {
                // Explicitly call unhighlight for SF2
                if(YAHOO.util.Dom.hasClass(elCell, YAHOO.widget.DataTable.CLASS_HIGHLIGHT)) {
                    this.unhighlight(elCell);
                }
                this.fireEvent("editorShowEvent",{target:elCell,column:column});
                YAHOO.log("Editor \"" + this.activeEditor.type + "\" activated for cell \"" + elCell.id + "\"", "info", this.toString());
            }
        }
    }
};

/**
 * Hides active editor, not saving any data.
 *
 * @method cancelEditorData
 */
YAHOO.widget.DataTable.prototype.cancelEditorData = function() {
    if(this.activeEditor) {
        this.activeEditor.hide();
        this.activeEditor = null;

        // Editor causes widget to lose focus
        //oSelf._bFocused = false;
        //oSelf.focusTable();

        //TODO: need an event here
    }
};

/**
 * Saves data in active editor.
 *
 * @method saveEditorData
 */
YAHOO.widget.DataTable.prototype.saveEditorData = function() {
    if(this.activeEditor) {
        var elCell = this.activeEditor.cell;
        var oColumn = this.activeEditor.column;
        var oRecord = this.activeEditor.record;
        var oldValue = oRecord[oColumn.key];
        var newValue = this.activeEditor.getValue();

        //Update Record
        if(YAHOO.util.Lang.isString(oColumn.key)) {
            // Update Record
            this._oRecordSet.updateRecord(oRecord,oColumn.key,newValue);

            //Update cell
            this.formatCell(elCell);
        }
        else {
            YAHOO.log("Could not save edit due to invalid Column key", "warn", this.toString());
        }

        // Hide editor
        this.activeEditor.hide();
        this.activeEditor = null;

        // Editor causes widget to lose focus
        //this._bFocused = false;
        //this.focusTable();
        this.fireEvent("cellEditEvent",{target:elCell,oldData:oldValue,newData:newValue});
    }
};

/**
 * Formats given cell.
 *
 * @method formatCell
 * @param elCell {HTMLElement} Cell element to format.
 */
YAHOO.widget.DataTable.prototype.formatCell = function(elCell) {
    if(elCell && YAHOO.lang.isNumber(elCell.columnIndex)) {
        var index = elCell.columnIndex;
        var column = this._oColumnSet.keys[index];
        column.format(elCell,this._oRecordSet.getRecord(elCell.parentNode.yuiRecordId));
        if (index === 0) {
            YAHOO.util.Dom.addClass(elCell,YAHOO.widget.DataTable.CLASS_FIRST);
        }
        else if (index === this._oColumnSet.keys.length-1) {
            YAHOO.util.Dom.addClass(elCell,YAHOO.widget.DataTable.CLASS_LAST);
        }
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
    if(YAHOO.lang.isNumber(target.columnIndex)) {
        this.sortColumn(this._oColumnSet.keys[target.columnIndex]);
    }
    else {
        //TODO: support sort on parent of nested header
        YAHOO.log("Could not sort due to invalid column","warn",this.toString());
    }
};

/**
 * Overridable custom event handler to select row according to desktop paradigm.
 *
 * @method onEventSelectRow
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 */
YAHOO.widget.DataTable.prototype.onEventSelectRow = function(oArgs) {
    var evt = oArgs.event;
    var elTarget = oArgs.target;
    var elTag = elTarget.tagName.toLowerCase();
    var bSingleSelect = this.rowSingleSelect;
    var bSHIFT = evt.shiftKey;
    var bCTRL = evt.ctrlKey;
    var i;

    // Traverse up the DOM to find the row
    while(elTag != "tr") {
        // Bail out
        if(elTag == "body") {
            return;
        }
        // Maybe it's the parent
        elTarget = elTarget.parentNode;
        elTag = elTarget.tagName.toLowerCase();
    }
    var sTargetId = elTarget.id;
    var rows = this._elBody.rows;
    var anchor = YAHOO.util.Dom.get(this._selectRowAnchorId);
    var anchorIndex;
    var targetIndex = elTarget.sectionRowIndex;

    // Both SHIFT and CTRL
    if(!bSingleSelect && bSHIFT && bCTRL) {
        // Validate anchor
        if(anchor) {
            anchorIndex = anchor.sectionRowIndex;
            if(this.isSelected(YAHOO.util.Dom.get(this._selectRowAnchorId))) {
                // Select all rows between anchor row and target row, inclusive
                if(anchorIndex < targetIndex) {
                    for(i=anchorIndex+1; i<=targetIndex; i++) {
                        if(!this.isSelected(rows[i])) {
                            this.selectRow(rows[i]);
                        }
                    }
                }
                // Select from target to anchor
                else {
                    for(i=targetIndex; i<=anchorIndex-1; i++) {
                        if(!this.isSelected(rows[i])) {
                            this.selectRow(rows[i]);
                        }
                    }
                }
            }
            else {
                // Unselect all rows between anchor row and target row, exclusive
                if(anchorIndex < targetIndex) {
                    for(i=anchorIndex+1; i<=targetIndex-1; i++) {
                        if(this.isSelected(rows[i])) {
                            this.unselectRow(rows[i]);
                        }
                    }
                }
                // Select from target to anchor
                else {
                    for(i=targetIndex+1; i<=anchorIndex-1; i++) {
                        if(this.isSelected(rows[i])) {
                            this.unselectRow(rows[i]);
                        }
                    }
                }
                this.select(elTarget);
            }
        }
        // Invalid anchor
        else {
            // Set anchor
            this._selectRowAnchorId = sTargetId;
            
            // Toggle selection of target
            if(this.isSelected(elTarget)) {
                this.unselect(elTarget);
            }
            else {
                this.select(elTarget);
            }
        }
    }
    // Only SHIFT
    else if(!bSingleSelect && bSHIFT) {
        this.unselectAllRows();

        // Validate anchor
        if(anchor) {
            anchorIndex = anchor.sectionRowIndex;
            
            // Select all rows between anchor row and target row inclusive
            if(anchorIndex < targetIndex) {
                for(i=anchorIndex; i<=targetIndex; i++) {
                    this.selectRow(rows[i]);
                }
            }
            // Select from target to anchor
            else {
                for(i=targetIndex; i<=anchorIndex; i++) {
                    this.selectRow(rows[i]);
                }
            }
        }
        // Invalid anchor
        else {
            // Set anchor
            this._selectRowAnchorId = sTargetId;
            
            // Select target only
            this.selectRow(elTarget);
        }
    }
    // Only CTRL
    else if(!bSingleSelect && bCTRL) {
        // Set anchor
        this._selectRowAnchorId = sTargetId;
        
        // Toggle selection of target
        if(this.isSelected(elTarget)) {
            this.unselect(elTarget);
        }
        else {
            this.select(elTarget);
        }
    }
    // Neither SHIFT nor CTRL
    else if(bSingleSelect) {
        this.unselect(this._lastSelectedId);
        this.select(elTarget);
    }
    // Neither SHIFT nor CTRL
    else {
        // Set anchor
        this._selectRowAnchorId = sTargetId;
        
        // Select only target
        this.unselectAllRows();
        this.selectRow(elTarget);
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
    var elTag = target.tagName.toLowerCase();

    // Walk up the DOM until we get to the TD
    while(elTag != "td") {
        // Bail out
        if(elTag == "body") {
            return;
        }
        
        target = target.parentNode;
        elTag = target.tagName.toLowerCase();
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
    var target = oArgs.target;
    var elTag = target.tagName.toLowerCase();

    // Walk up the DOM until we get to the TD
    while(elTag != "td") {
        // Bail out
        if(elTag == "body") {
            return;
        }

        target = target.parentNode;
        elTag = target.tagName.toLowerCase();
    }

    this.formatCell(target);
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
    var target = oArgs.target;
    var elTag = target.tagName.toLowerCase();

    // Walk up the DOM until we get to the TD
    while(elTag != "td") {
        // Bail out
        if(elTag == "body") {
            return;
        }

        target = target.parentNode;
        elTag = target.tagName.toLowerCase();
    }

    this.highlight(target);
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
    var target = oArgs.target;
    var elTag = target.tagName.toLowerCase();

    // Walk up the DOM until we get to the TD
    while(elTag != "td") {
        // Bail out
        if(elTag == "body") {
            return;
        }

        target = target.parentNode;
        elTag = target.tagName.toLowerCase();
    }

    this.unhighlight(target);
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
    var elTag = target.tagName.toLowerCase();

    // Walk up the DOM until we get to the TD
    while(elTag != "td") {
        // Bail out
        if(elTag == "body") {
            return;
        }

        target = target.parentNode;
        elTag = target.tagName.toLowerCase();
    }

    this.editCell(target);
};

/**
 * @deprecated Deprecated in favor of onDataReturnPopulateTable().
 * @method onDataReturnPaginateRows
 */
YAHOO.widget.DataTable.prototype.onDataReturnPaginateRows = function(sRequest, oResponse, bError) {

};

/**
 * Handles data return for adding new rows to table, including updating pagination.
 *
 * @method onDataReturnPopulateTable
 * @param sRequest {String} Original request.
 * @param oResponse {Object} Response object.
 * @param bError {Boolean} (optional) True if there was a data error.
 */
YAHOO.widget.DataTable.prototype.onDataReturnPopulateTable = function(sRequest, oResponse) {
    this.fireEvent("dataReturnEvent", {request:sRequest,response:oResponse});

    var ok = this.doBeforeLoadData(sRequest, oResponse);
    if(ok && oResponse && !oResponse.error && YAHOO.lang.isArray(oResponse.results)) {
        // Update the RecordSet from the response
        var newRecords = this._oRecordSet.append(oResponse.results);
        if(newRecords) {
            // Update markup
            this.populateTable();
        }
    }
    else if(oResponse.error) {
        this.showTableMessage(YAHOO.widget.DataTable.MSG_ERROR, YAHOO.widget.DataTable.CLASS_ERROR);
    }
    else {
        this.showTableMessage(YAHOO.widget.DataTable.MSG_EMPTY, YAHOO.widget.DataTable.CLASS_EMPTY);
    }
};

/**
 * Handles data return for adding new rows to bottom of table.
 *
 * @method onDataReturnAppendRows
 * @param sRequest {String} Original request.
 * @param oResponse {Object} Response object.
 * @param bError {Boolean} (optional) True if there was a data error.
 */
YAHOO.widget.DataTable.prototype.onDataReturnAppendRows = function(sRequest, oResponse) {
    this.fireEvent("dataReturnEvent", {request:sRequest,response:oResponse});
    
    var ok = this.doBeforeLoadData(sRequest, oResponse);
    if(ok && oResponse && !oResponse.error && YAHOO.lang.isArray(oResponse.results)) {
        // Update the RecordSet from the response
        var newRecords = this._oRecordSet.append(oResponse.results);
        if(newRecords) {
            // Update markup
            this.appendRows(newRecords);
            YAHOO.log("Data returned for " + newRecords.length + " rows","info",this.toString());
        }
    }
    else {
        //TODO
    }
};

/**
 * Handles data return for inserting new rows to top of table.
 *
 * @method onDataReturnInsertRows
 * @param sRequest {String} Original request.
 * @param oResponse {Object} Response object.
 * @param bError {Boolean} (optional) True if there was a data error.
 */
YAHOO.widget.DataTable.prototype.onDataReturnInsertRows = function(sRequest, oResponse) {
    this.fireEvent("dataReturnEvent", {request:sRequest,response:oResponse});
    
    var ok = this.doBeforeLoadData(sRequest, oResponse, bError);
    if(ok && oResponse && !oResponse.error && YAHOO.lang.isArray(oResponse.results)) {
        // Update the RecordSet from the response
        var newRecords = this._oRecordSet.insert(oResponse.results);
        if(newRecords) {
            // Update markup
            this.insertRows(newRecords);
            YAHOO.log("Data returned for " + newRecords.length + " rows","info",this.toString());
        }
    }
    else {
        //TODO
    }
};

/**
 * Handles data return for replacing all existing of table with new rows.
 *
 * @method onDataReturnReplaceRows
 * @param sRequest {String} Original request.
 * @param oResponse {Object} Response object.
 * @param bError {Boolean} (optional) True if there was a data error.
 */
YAHOO.widget.DataTable.prototype.onDataReturnReplaceRows = function(sRequest, oResponse) {
    this.fireEvent("dataReturnEvent", {request:sRequest,response:oResponse});
    
    var ok = this.doBeforeLoadData(sRequest, oResponse, bError);
    if(ok && oResponse && !oResponse.error && YAHOO.lang.isArray(oResponse.results)) {
        // Update the RecordSet from the response
        var newRecords = this._oRecordSet.replace(oResponse.results);
        if(newRecords) {
            this.replaceRows(newRecords);
            YAHOO.log("Data returned for " + newRecords.length + " rows","info",this.toString());
        }
    }
    else {
    
    }
};

