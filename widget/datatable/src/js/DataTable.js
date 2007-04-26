
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
            this._oDataSource = oDataSource;
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
        if(elTable && !this._oDataSource) {
            // Fill RecordSet with data parsed out of table
            var aData = [];

            // Iterate through each TBODY
            for(i=0; i<elTable.tBodies.length; i++) {
                var elTbody = elTable.tBodies[i];

                // Iterate through each TR
                for(var j=0; j<elTbody.rows.length; j++) {
                    var elRow = elTbody.rows[j];
                    var oData = {};

                    // Iterate through each TD
                    for(var k=0; k<elRow.cells.length; k++) {

                        //var elCell = elRow.cells[l];
                        //elCell.id = this.id+"-bdrow"+k+"-cell"+l;
                        //TODO: can we parse a column with null key?
                        oData[oColumnSet.keys[k].key] = oColumnSet.keys[k].parse(elRow.cells[k].innerHTML);
                    }
                    aData.push(oData);
                }
            }
            
            // Initialize DOM elements
            this._initTableEl();
            
            ok = this.doBeforeLoadData(null,aData);
            if(ok) {
                this.initializeTable(aData);
            }
            else {
                YAHOO.log("The function doBeforeLoadData returned false","error",this);
            }
        }
        // Create markup from scratch using the provided DataSource
        else if(this._oDataSource) {
                // Initialize DOM elements
                this._initTableEl();

                // Send out for data in an asynchronous request
                oDataSource.sendRequest(this.initialRequest, this.onDataReturnInitializeTable, this);
        }
        // Else there is no data
        else {
            // Initialize DOM elements
            this._initTableEl();
            
            // Show empty message
            this.showTableMessage(YAHOO.widget.DataTable.MSG_EMPTY, YAHOO.widget.DataTable.CLASS_EMPTY);
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
        this.contextMenu = new YAHOO.widget.ContextMenu(this.id+"-cm", { trigger: this._elTbody.rows } );
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
     * Fired when DataTable view is refreshed.
     *
     * @event tableRefreshEvent
     */
    this.createEvent("tableRefreshEvent");

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

    /*TODO: delete
     * Fired when a TD element is formatted.
     *
     * @event cellFormatEvent
     * @param oArgs.el {HTMLElement} Reference to the TD element.
     */
    //this.createEvent("cellFormatEvent");

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
     * Fired when a row is added.
     *
     * @event rowAddEvent
     * @param oArgs.data {Object} The data added.
     * @param oArgs.trElId {String} The ID of the added TR element, if any.
     */
    this.createEvent("rowAddEvent");
    
    /**
     * Fired when a row is updated.
     *
     * @event rowUpdateEvent
     * @param oArgs.newData {Object} The new data.
     * @param oArgs.oldData {Object} The old data.
     * @param oArgs.trElId {Array} The ID of the updated TR element, if any.
     */
    this.createEvent("rowUpdateEvent");

    /**
     * Fired when one or more TR elements are deleted.
     *
     * @event rowDeleteEvent
     * @param oArgs.rowIndexes {Array} The indexes of the deleted rows.
     */
    this.createEvent("rowDeleteEvent");
    
    /**
     * Fired when a Record is updated in the RecordSet.
     *
     * @event recordSetUpdateEvent
     * @param oArgs.record {YAHOO.widget.Record} The Record instance.
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
 * @property YAHOO.widget.DataTable.CLASS_TABLE
 * @type String
 * @static
 * @final
 * @default "yui-dt"
 */
YAHOO.widget.DataTable.CLASS_TABLE = "yui-dt-table";

/**
 * Class name assigned the primary TBODY element that holds data rows.
 *
 * @property YAHOO.widget.DataTable.CLASS_BODY
 * @type String
 * @static
 * @final
 * @default "yui-dt-body"
 */
YAHOO.widget.DataTable.CLASS_BODY = "yui-dt-body";

/**
 * Class name assigned to container element within THEAD.
 *
 * @property YAHOO.widget.DataTable.CLASS_HEADCONTAINER
 * @type String
 * @static
 * @final
 */
YAHOO.widget.DataTable.CLASS_HEADCONTAINER = "yui-dt-headcontainer";

/**
 * Class name assigned to resizer handle element within THEAD.
 *
 * @property YAHOO.widget.DataTable.CLASS_HEADRESIZER
 * @type String
 * @static
 * @final
 * @default "yui-dt-headresizer"
 */
YAHOO.widget.DataTable.CLASS_HEADRESIZER = "yui-dt-headresizer";

/**
 * Class name assigned to text displayed within THEAD.
 *
 * @property YAHOO.widget.DataTable.CLASS_HEADTEXT
 * @type String
 * @static
 * @final
 * @default "yui-dt-headtext"
 */
YAHOO.widget.DataTable.CLASS_HEADTEXT = "yui-dt-headtext";

/**
 * Class name assigned to FIRST elements.
 *
 * @property YAHOO.widget.DataTable.CLASS_FIRST
 * @type String
 * @static
 * @final
 * @default "yui-dt-first"
 */
YAHOO.widget.DataTable.CLASS_FIRST = "yui-dt-first";

/**
 * Class name assigned to LAST elements.
 *
 * @property YAHOO.widget.DataTable.CLASS_LAST
 * @type String
 * @static
 * @final
 * @default "yui-dt-last"
 */
YAHOO.widget.DataTable.CLASS_LAST = "yui-dt-last";

/**
 * Class name assigned to even TR elements.
 *
 * @property YAHOO.widget.DataTable.CLASS_EVEN
 * @type String
 * @static
 * @final
 * @default "yui-dt-even"
 */
YAHOO.widget.DataTable.CLASS_EVEN = "yui-dt-even";

/**
 * Class name assigned to odd TR elements.
 *
 * @property YAHOO.widget.DataTable.CLASS_ODD
 * @type String
 * @static
 * @final
 * @default "yui-dt-odd"
 */
YAHOO.widget.DataTable.CLASS_ODD = "yui-dt-odd";

/**
 * Class name assigned to empty elements.
 *
 * @property YAHOO.widget.DataTable.CLASS_EMPTY
 * @type String
 * @static
 * @final
 * @default "yui-dt-empty"
 */
YAHOO.widget.DataTable.CLASS_EMPTY = "yui-dt-empty";

/**
 * Class name assigned to loading message.
 *
 * @property YAHOO.widget.DataTable.CLASS_LOADING
 * @type String
 * @static
 * @final
 * @default "yui-dt-loading"
 */
YAHOO.widget.DataTable.CLASS_LOADING = "yui-dt-loading";

/**
 * Class name assigned to elements with error messaging.
 *
 * @property YAHOO.widget.DataTable.CLASS_ERROR
 * @type String
 * @static
 * @final
 * @default "yui-dt-error"
 */
YAHOO.widget.DataTable.CLASS_ERROR = "yui-dt-error";

/**
 * Class name assigned to selected elements.
 *
 * @property YAHOO.widget.DataTable.CLASS_SELECTED
 * @type String
 * @static
 * @final
 * @default "yui-dt-selected"
 */
YAHOO.widget.DataTable.CLASS_SELECTED = "yui-dt-selected";

/**
 * Class name assigned to highlighted element.
 *
 * @property YAHOO.widget.DataTable.CLASS_HIGHLIGHT
 * @type String
 * @static
 * @final
 * @default "yui-dt-highlight"
 */
YAHOO.widget.DataTable.CLASS_HIGHLIGHT = "yui-dt-highlight";

/**
 * Class name assigned to container of a scrollable DataTable.
 *
 * @property YAHOO.widget.DataTable.CLASS_SCROLLABLE
 * @type String
 * @static
 * @final
 * @default "yui-dt-scrollable"
 */
YAHOO.widget.DataTable.CLASS_SCROLLABLE = "yui-dt-scrollable";

/**
 * Class name assigned to scrolling TBODY element of a scrollable DataTable.
 *
 * @property YAHOO.widget.DataTable.CLASS_SCROLLBODY
 * @type String
 * @static
 * @final
 * @default "yui-dt-scrollbody"
 */
YAHOO.widget.DataTable.CLASS_SCROLLBODY = "yui-dt-scrollbody";

/**
 * Class name assigned to column headers of sortable Columns.
 *
 * @property YAHOO.widget.DataTable.CLASS_SORTABLE
 * @type String
 * @static
 * @final
 * @default "yui-dt-sortable"
 */
YAHOO.widget.DataTable.CLASS_SORTABLE = "yui-dt-sortable";

/**
 * Class name assigned to column headers when sorted in ascending order.
 *
 * @property YAHOO.widget.DataTable.CLASS_SORTEDBYASC
 * @type String
 * @static
 * @final
 * @default "yui-dt-sortedbyasc"
 */
YAHOO.widget.DataTable.CLASS_SORTEDBYASC = "yui-dt-sortedbyasc";

/**
 * Class name assigned to column headers when sorted in descending order.
 *
 * @property YAHOO.widget.DataTable.CLASS_SORTEDBYDESC
 * @type String
 * @static
 * @final
 * @default "yui-dt-sortedbydesc"
 */
YAHOO.widget.DataTable.CLASS_SORTEDBYDESC = "yui-dt-sortedbydesc";

/**
 * Class name assigned to the paginator container element.
 *
 * @property YAHOO.widget.DataTable.CLASS_PAGINATOR
 * @type String
 * @static
 * @final
 * @default "yui-dt-paginator"
 */
YAHOO.widget.DataTable.CLASS_PAGINATOR = "yui-dt-paginator";

/**
 * Class name assigned to the pagination link "&lt;&lt;".
 *
 * @property YAHOO.widget.DataTable.CLASS_FIRSTLINK
 * @type String
 * @static
 * @final
 * @default "yui-dt-firstlink"
 */
YAHOO.widget.DataTable.CLASS_FIRSTLINK = "yui-dt-firstlink";

/**
 * Class name assigned to the pagination link "&lt;&lt;" when it is disabled.
 *
 * @property YAHOO.widget.DataTable.CLASS_FIRSTPAGE
 * @type String
 * @static
 * @final
 * @default "yui-dt-firstpage"
 */
YAHOO.widget.DataTable.CLASS_FIRSTPAGE = "yui-dt-firstpage";

/**
 * Class name assigned to the pagination link "&gt;&gt;".
 *
 * @property YAHOO.widget.DataTable.CLASS_LASTLINK
 * @type String
 * @static
 * @final
 * @default "yui-dt-lastlink"
 */
YAHOO.widget.DataTable.CLASS_LASTLINK = "yui-dt-lastlink";

/**
 * Class name assigned to the pagination link "&gt;&gt;" when it is disabled.
 *
 * @property YAHOO.widget.DataTable.CLASS_LASTPAGE
 * @type String
 * @static
 * @final
 * @default "yui-dt-lastpage"
 */
YAHOO.widget.DataTable.CLASS_LASTPAGE = "yui-dt-lastpage";

/**
 * Class name assigned to the pagination link "&lt;".
 *
 * @property YAHOO.widget.DataTable.CLASS_PREVLINK
 * @type String
 * @static
 * @final
 * @default "yui-dt-prevlink"
 */
YAHOO.widget.DataTable.CLASS_PREVLINK = "yui-dt-prevlink";

/**
 * Class name assigned to the pagination link "&lt;" when it is disabled.
 *
 * @property YAHOO.widget.DataTable.CLASS_PREVPAGE
 * @type String
 * @static
 * @final
 * @default "yui-dt-prevpage"
 */
YAHOO.widget.DataTable.CLASS_PREVPAGE = "yui-dt-prevpage";

/**
 * Class name assigned to the pagination link "&gt;".
 *
 * @property YAHOO.widget.DataTable.CLASS_NEXTLINK
 * @type String
 * @static
 * @final
 * @default "yui-dt-nextlink"
 */
YAHOO.widget.DataTable.CLASS_NEXTLINK = "yui-dt-nextlink";

/**
 * Class name assigned to the pagination link "&gt;" when it is disabled.
 *
 * @property YAHOO.widget.DataTable.CLASS_NEXTPAGE
 * @type String
 * @static
 * @final
 * @default "yui-dt-nextpage"
 */
YAHOO.widget.DataTable.CLASS_NEXTPAGE = "yui-dt-nextpage";


/**
 * Class name assigned to pagination links to specific page numbers.
 *
 * @property YAHOO.widget.DataTable.CLASS_PAGELINK
 * @type String
 * @static
 * @final
 * @default "yui-dt-pagelink"
 */
YAHOO.widget.DataTable.CLASS_PAGELINK = "yui-dt-pagelink";

/**
 * Class name assigned to pagination links for specific page numbers that are disabled.
 *
 * @property YAHOO.widget.DataTable.CLASS_CURRENTPAGE
 * @type String
 * @static
 * @final
 * @default "yui-dt-currentpage"
 */
YAHOO.widget.DataTable.CLASS_CURRENTPAGE = "yui-dt-currentpage";

/**
 * Class name assigned to the pagination SELECT element.
 *
 * @property YAHOO.widget.DataTable.CLASS_PAGESELECT
 * @type String
 * @static
 * @final
 * @default "yui-dt-pageselect"
 */
YAHOO.widget.DataTable.CLASS_PAGESELECT = "yui-dt-pageselect";

/**
 * Class name assigned to the pagination links container element.
 *
 * @property YAHOO.widget.DataTable.CLASS_PAGELINKS
 * @type String
 * @static
 * @final
 * @default "yui-dt-pagelinks"
 */
YAHOO.widget.DataTable.CLASS_PAGELINKS = "yui-dt-pagelinks";

/**
 * Class name assigned to editable TD elements.
 *
 * @property YAHOO.widget.DataTable.CLASS_EDITABLE
 * @type String
 * @static
 * @final
 * @default "yui-dt-editable"
 */
YAHOO.widget.DataTable.CLASS_EDITABLE = "yui-dt-editable";

/**
 * Class name assigned to editor DIV elements.
 *
 * @property YAHOO.widget.DataTable.CLASS_EDITOR
 * @type String
 * @static
 * @final
 * @default "yui-dt-editor"
 */
YAHOO.widget.DataTable.CLASS_EDITOR = "yui-dt-editor";

/**
 * Class name assigned to TD elements of type "checkbox".
 *
 * @property YAHOO.widget.DataTable.CLASS_CHECKBOX
 * @type String
 * @static
 * @final
 * @default "yui-dt-checkbox"
 */
YAHOO.widget.DataTable.CLASS_CHECKBOX = "yui-dt-checkbox";

/**
 * Class name assigned to TD elements of type "currency".
 *
 * @property YAHOO.widget.DataTable.CLASS_CURRENCY
 * @type String
 * @static
 * @final
 * @default "yui-dt-currency"
 */
YAHOO.widget.DataTable.CLASS_CURRENCY = "yui-dt-currency";

/**
 * Class name assigned to TD elements of type "date".
 *
 * @property YAHOO.widget.DataTable.CLASS_DATE
 * @type String
 * @static
 * @final
 * @default "yui-dt-date"
 */
YAHOO.widget.DataTable.CLASS_DATE = "yui-dt-date";

/**
 * Class name assigned to TD elements of type "email".
 *
 * @property YAHOO.widget.DataTable.CLASS_EMAIL
 * @type String
 * @static
 * @final
 * @default "yui-dt-email"
 */
YAHOO.widget.DataTable.CLASS_EMAIL = "yui-dt-email";

/**
 * Class name assigned to TD elements of type "link".
 *
 * @property YAHOO.widget.DataTable.CLASS_LINK
 * @type String
 * @static
 * @final
 * @default "yui-dt-link"
 */
YAHOO.widget.DataTable.CLASS_LINK = "yui-dt-link";

/**
 * Class name assigned to TD elements of type "number".
 *
 * @property YAHOO.widget.DataTable.CLASS_NUMBER
 * @type String
 * @static
 * @final
 * @default "yui-dt-number"
 */
YAHOO.widget.DataTable.CLASS_NUMBER = "yui-dt-number";

/**
 * Class name assigned to TD elements of type "string".
 *
 * @property YAHOO.widget.DataTable.CLASS_STRING
 * @type String
 * @static
 * @final
 * @default "yui-dt-string"
 */
YAHOO.widget.DataTable.CLASS_STRING = "yui-dt-string";

/**
 * Message to display if DataTable has no data.
 *
 * @property YAHOO.widget.DataTable.MSG_EMPTY
 * @type String
 * @static
 * @final
 * @default "No records found."
 */
YAHOO.widget.DataTable.MSG_EMPTY = "No records found.";

/**
 * Message to display while DataTable is loading data.
 *
 * @property YAHOO.widget.DataTable.MSG_LOADING
 * @type String
 * @static
 * @final
 * @default "Loading data..."
 */
YAHOO.widget.DataTable.MSG_LOADING = "Loading data...";

/**
 * Message to display while DataTable has data error.
 *
 * @property YAHOO.widget.DataTable.MSG_ERROR
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
 * @property _nCount
 * @type Number
 * @private
 * @static
 */
YAHOO.widget.DataTable._nCount = 0;

/**
 * Index assigned to instance.
 *
 * @property _nIndex
 * @type Number
 * @private
 */
YAHOO.widget.DataTable.prototype._nIndex = null;

/**
 * Unique name assigned to instance.
 *
 * @property _sName
 * @type String
 * @private
 */
YAHOO.widget.DataTable.prototype._sName = null;

/**
 * DOM reference to the container element for the DataTable instance into which
 * the TABLE element gets created.
 *
 * @property _elContainer
 * @type HTMLElement
 * @private
 */
YAHOO.widget.DataTable.prototype._elContainer = null;

/**
 * DOM reference to the TABLE element for the DataTable instance.
 *
 * @property _elTable
 * @type HTMLElement
 * @private
 */
YAHOO.widget.DataTable.prototype._elTable = null;

/**
 * DOM reference to the primary TBODY element for the DataTable instance.
 *
 * @property _elTbody
 * @type HTMLElement
 * @private
 */
YAHOO.widget.DataTable.prototype._elTbody = null;

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

/**
 * ID string of the selection anchor element.
 *
 * @property _sSelectionAnchorId
 * @type String
 * @private
 */
YAHOO.widget.DataTable.prototype._sSelectionAnchorId = null;

/**
 * Array of Record instances that are in the selected state.
 *
 * @property _aSelectedRecords
 * @type YAHOO.widget.Record[]
 * @private
 */
YAHOO.widget.DataTable.prototype._aSelectedRecords = null;

/**
 * Internal variable to track whether the DataTable instance has page focus.
 *
 * @property _bFocused
 * @type Boolean
 * @private
 */
YAHOO.widget.DataTable.prototype._bFocused = false;

/**
 * Internal object literal to track paginator values.
 *
 * @property _paginator
 * @type Object
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
 * Internal variable to track how many page links to display.
 *
 * @property _paginator.pageLinks
 * @type Number
 * @private
 */
/**
 * Internal variable to track total number of pages, calculated on the fly.
 *
 * @property _paginator.totalPages
 * @type Number
 * @private
 */
/**
 * Internal variable to track current page.
 *
 * @property _paginator.currentPage
 * @type Number
 * @private
 */
/**
 * Internal variable to track how many rows per page to display.
 *
 * @property _paginator.rowsPerPage
 * @type Number
 * @private
 */
/**
 * Array of container elements for paginator UI.
 *
 * @property _paginator.containers
 * @type HTMLElement[]
 * @private
 */
/**
 * Array of SELECT elements for paginator dropdowns. A simple array of numbers,
 * like [10, 25, 100]; or an array of object literals, like
 * [{value:10, text:"ten"}, {value:25, text:"twenty-five"}, {value:100, text:"one-hundred"}]
 *
 * @property _paginator.dropdowns
 * @type Number[] | Object[]
 * @private
 */
/**
 * Array of container elements for paginator links.
 *
 * @property _paginator.links
 * @type HTMLElement[]
 * @private
 */
YAHOO.widget.DataTable.prototype._paginator = null;



































/////////////////////////////////////////////////////////////////////////////
//
// Private methods
//
/////////////////////////////////////////////////////////////////////////////





// INIT FUNCTIONS



/**
 * Creates HTML markup for TABLE, THEAD and TBODY elements.
 *
 * @method _initTableEl
 * @private
 */
YAHOO.widget.DataTable.prototype._initTableEl = function() {
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
    this._initTheadEl(elTable, this._oColumnSet);


    // Create TBODY for messages
    var elMsgTbody = document.createElement("tbody");
    elMsgTbody.tabIndex = -1;
    this._elMsgRow = elMsgTbody.appendChild(document.createElement("tr"));
    var elMsgRow = this._elMsgRow;
    var elMsgCell = elMsgRow.appendChild(document.createElement("td"));
    elMsgCell.colSpan = this._oColumnSet.keys.length;
    this._elMsgCell = elMsgCell;
    this._elMsgTbody = elTable.appendChild(elMsgTbody);
    this.showTableMessage(YAHOO.widget.DataTable.MSG_LOADING, YAHOO.widget.DataTable.CLASS_LOADING);

    // Create TBODY for data
    this._elTbody = elTable.appendChild(document.createElement("tbody"));
    this._elTbody.tabIndex = -1;
    YAHOO.util.Dom.addClass(this._elTbody,YAHOO.widget.DataTable.CLASS_BODY);
    if(this.scrollable) {
        YAHOO.util.Dom.addClass(this._elTbody,YAHOO.widget.DataTable.CLASS_SCROLLBODY);
    }
};

/**
 * Populates THEAD element with TH cells as defined by ColumnSet.
 *
 * @method _initTheadEl
 * @private
 */
YAHOO.widget.DataTable.prototype._initTheadEl = function() {
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
            this._initThEl(elHeadCell,oColumn,i,j);
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
 * @method _initThEl
 * @param elHeadCell {HTMLElement} TH cell element reference.
 * @param oColumn {YAHOO.widget.Column} Column object.
 * @param row {number} Row index.
 * @param col {number} Column index.
 * @private
 */
YAHOO.widget.DataTable.prototype._initThEl = function(elHeadCell,oColumn,row,col) {
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
    if(this.sortedBy && this.sortedBy.key) {
        if(this.sortedBy.key === oColumn.key) {
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
        containers:[], // UI container elements
        rowsPerPage:500, // 500 rows
        currentPage:1,  // page one
        pageLinks:0,    // show all links
        pageLinksStart:1, // first link is page 1
        dropdownOptions:null, // no dropdown
        links: [], // links elements
        dropdowns: [] //dropdown elements
    };
    var containers = paginator.containers;

    // Pagination configuration options
    if(this.paginatorOptions) {
        // Validate container values
        if(YAHOO.util.Lang.isArray(this.paginatorOptions.containers)) {
            for(i=0; i<containers.length; i++) {
                if(YAHOO.util.Dom.get(containers[i] !== null)) {
                    containers.push(containers[i]);
                }
            }
        }

        // Validate rowsPerPage value
        if(YAHOO.util.Lang.isNumber(this.paginatorOptions.rowsPerPage)) {
            paginator.rowsPerPage = this.paginatorOptions.rowsPerPage;
        }

        // Validate currentPage value
        if(YAHOO.util.Lang.isNumber(this.paginatorOptions.currentPage)) {
            paginator.currentPage = this.paginatorOptions.currentPage;
        }

        // Validate pageLinks value
        if(YAHOO.util.Lang.isNumber(this.paginatorOptions.pageLinks)) {
            paginator.pageLinks = this.paginatorOptions.pageLinks;
        }

        // Validate pageLinksStart value
        if(YAHOO.util.Lang.isNumber(this.paginatorOptions.pageLinksStart)) {
            paginator.pageLinksStart = this.paginatorOptions.pageLinksStart;
        }

        // Validate dropdownOptions value
        if(YAHOO.util.Lang.isArray(this.paginatorOptions.dropdownOptions)) {
            paginator.dropdownOptions = this.paginatorOptions.dropdownOptions;
        }
    }

    // No containers found, create from scratch
    if(containers.length === 0) {
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
        containers = [pag0, pag1];
    }

    // Page links are enabled
    if(paginator.pageLinks > -1) {
        for(i=0; i<containers.length; i++) {
            // Create one page links container per paginator
            var linkEl = document.createElement("span");
            linkEl.id = "yui-dt-pagselect"+i;
            linkEl.className = YAHOO.widget.DataTable.CLASS_PAGELINKS;
            linkEl = containers[i].appendChild(linkEl);

            // Add event listener
            YAHOO.util.Event.addListener(linkEl,"click",this._onPagerClick,this);

             // Add to tracker
            paginator.links.push(linkEl);
       }
    }

    // Dropdown enabled
    if(paginator.dropdownOptions) {
        // Show these options in the dropdown
        var dropdownOptions = paginator.dropdownOptions;

        for(i=0; i<containers.length; i++) {
            // Create one SELECT element per Paginator container
            var selectEl = document.createElement("select");
            selectEl.className = YAHOO.widget.DataTable.CLASS_PAGESELECT;
            selectEl = containers[i].appendChild(selectEl);

            // Create OPTION elements
            for(j=0; j<dropdownOptions.length; j++) {
                var optionEl = document.createElement("option");
                optionEl.value = dropdownOptions[j].value || dropdownOptions[j];
                optionEl.innerHTML = dropdownOptions[j].text || dropdownOptions[j];
                optionEl = selectEl.appendChild(optionEl);
            }
            
            // Add event listener
            YAHOO.util.Event.addListener(selectEl,"change",this._onPagerSelect,this);

            // Add DOM reference to tracker
           paginator.dropdowns.push(selectEl);
        }
    }
    else {
        YAHOO.log("Could not create Paginator dropdown due to invalid dropdownOptions","error",this.toString());
    }

    this._paginator = paginator;
    this._paginator.containers = containers;
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
 * @return {String} ID of the added TR element.
 * @private
 */
YAHOO.widget.DataTable.prototype._addTrEl = function(oRecord, index) {
    this.hideTableMessage();

    // Is this an insert or an append?
    var insert = (!YAHOO.lang.isNumber(index) || (index < 0)) ? false : true;
    if(!insert || (index > this._elTbody.rows.length)) {
        index = this._elTbody.rows.length;
        insert = false;
    }

    var oColumnSet = this._oColumnSet;
    var oRecordSet = this._oRecordSet;

    var elRow = (insert) ?
        this._elTbody.insertBefore(document.createElement("tr"),this._elTbody.rows[index]) :
        this._elTbody.appendChild(document.createElement("tr"));
    elRow.id = this.id+"-bdrow"+index;
    elRow.yuiRecordId = oRecord.getId();

    // Create TBODY cells
    for(var j=0; j<oColumnSet.keys.length; j++) {
        var oColumn = oColumnSet.keys[j];
        var elCell = elRow.appendChild(document.createElement("td"));
        elCell.id = this.id+"-bdrow"+index+"-cell"+j;
        elCell.headers = oColumn.id;
        elCell.columnIndex = j;
        elCell.headers = oColumnSet.headers[j];

        // Update UI
        oColumn.format(elCell, oRecord);
        if (j === 0) {
            YAHOO.util.Dom.addClass(elCell,YAHOO.widget.DataTable.CLASS_FIRST);
        }
        else if (index === this._oColumnSet.keys.length-1) {
            YAHOO.util.Dom.addClass(elCell,YAHOO.widget.DataTable.CLASS_LAST);
        }

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

    return elRow.id;
};

/**
 * Formats all TD elements of given TR element with data from the appropriate Record.
 *
 * @method _updateTrEl
 * @param elRow {HTMLElement} The TR element to update.
 * @return {String} ID of the updated TR element.
 * @private
 */
YAHOO.widget.DataTable.prototype._updateTrEl = function(elRow) {
    this.hideTableMessage();

    var oRecord = this.getRecord(elRow);
    elRow.yuiRecordId = oRecord.getId();

    // ...Update TD elements with new data
    for(var j=0; j<elRow.cells.length; j++) {
        var oColumn = this._oColumnSet.keys[j];
        oColumn.format(elRow.cells[j], oRecord);
    }
    return elRow.id;
};


/**
 * Deletes TR element by DOM reference or by DataTable page row index.
 *
 * @method _deleteTrEl
 * @param row {HTMLElement | Number} TR element reference or Datatable page row index.
 * @private
 */
YAHOO.widget.DataTable.prototype._deleteTrEl = function(row) {
    // Convert to page row index
    if(!YAHOO.lang.isNumber(row)) {
        row = YAHOO.util.Dom.get(row).sectionRowIndex;
    }
    if(YAHOO.lang.isNumber(row) && (row > -2) && (row < this._elTbody.rows.length)) {
        this._elTbody.deleteRow(row);

        // Empty body
        if(this._elTbody.rows.length === 0) {
            this.showTableMessage(YAHOO.widget.DataTable.MSG_EMPTY, YAHOO.widget.DataTable.CLASS_EMPTY);
        }
        // If TR was deleted from the middle, restripe all rows
        else if((row > 0) && (row < this._elTbody.rows.length)) {
            this._setRowStripes();
        }
    }
    else {
        YAHOO.log("Could not delete row " + row, "warn", this.toString());
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
        // Unassign previous class
        if(this._sFirstTrId) {
            YAHOO.util.Dom.removeClass(this._firstTrId, YAHOO.widget.DataTable.CLASS_FIRST);
        }
        // Assign class
        YAHOO.util.Dom.addClass(rowEl, YAHOO.widget.DataTable.CLASS_FIRST);
        this._firstTrId = rowEl.id;
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
 * @param row {HTMLElement | Number} (optional) HTML TR element reference or
 * TBODY position index of where to start striping.
 * @param range {Number} (optional) Range defines a subset of rows to stripe.
 * @private
 */
YAHOO.widget.DataTable.prototype._setRowStripes = function(row, range) {
    if(!row && !range) {
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
        //TODO: allow striping of a subset of rows for performance
    }
};

/**
 * Assigns the class YAHOO.widget.DataTable.CLASS_SELECTED to the given
 * element(s) and updates internal tracker.
 *
 * @method _selectEl
 * @param els {HTMLElement | String | HTMLElement[] | String[]} HTML element by
 * reference or ID string, or array of HTML elements by reference or ID string.
 * @private
 */
YAHOO.widget.DataTable.prototype._selectEl = function(els) {
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
 * Removes the class YAHOO.widget.DataTable.CLASS_SELECTED from the given
 * element(s) and updates internal tracker.
 *
 * @method _unselectEl
 * @param els {HTMLElement | String | HTMLElement[] | String[]} HTMLElement by
 * reference or ID string, or array of HTML elements by reference or ID string.
 * @private
 */
YAHOO.widget.DataTable.prototype._unselectEl = function(els) {
    if(!YAHOO.lang.isArray(els)) {
        els = [els];
    }
    
    for(var i=0; i<els.length; i++) {
        // Remove the style
        YAHOO.util.Dom.removeClass(YAHOO.util.Dom.get(els[i]),YAHOO.widget.DataTable.CLASS_SELECTED);
    }
};

/**
 * Convenience method to remove the class YAHOO.widget.DataTable.CLASS_SELECTED
 * from all TR elements in the internal tracker.
 *
 * @method _unselectAllTrEls
 * @private
 */
YAHOO.widget.DataTable.prototype._unselectAllTrEls = function() {
    var selectedRows = YAHOO.util.Dom.getElementsByClassName(YAHOO.widget.DataTable.CLASS_SELECTED,"tr",this._elTbody);
    this._unselectEl(selectedRows);
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
    this._unselectEl(selectedCells);
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
                if(oldSelected.sectionRowIndex+1 < oSelf._elTbody.rows.length) {
                            if(!e.shiftKey || oSelf.rowSingleSelect) {
                                oSelf.unselectAllRows();
                            }
                            newSelected = oSelf._elTbody.rows[oldSelected.sectionRowIndex+1];
                            oSelf.selectRow(newSelected);
                            
                }
            }
            // cell mode
            else if(oldSelected.tagName.toLowerCase() == "td") {
                /*// We have room to move down
                if(oldSelected.sectionRowIndex+1 < oSelf._elTbody.rows.length) {
                            if(!e.shiftKey) {
                                oSelf.unselectAllRows();
                            }
                            newSelected = oSelf._elTbody.rows[oldSelected.sectionRowIndex+1];
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
                            newSelected = oSelf._elTbody.rows[oldSelected.sectionRowIndex-1];
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
                            newSelected = oSelf._elTbody.rows[oldSelected.sectionRowIndex-1];
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
        oSelf.refreshTable();
    }
};



















/////////////////////////////////////////////////////////////////////////////
//
// Private Custom Event Handlers
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Fires a recordSetUpdateEvent when RecordSet recordUpdateEvent is caught.
 *
 * @method _onRecordUpdate
 * @param oArgs.record {YAHOO.widget.Record} The Record instance.
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
 * True if primary TBODY should scroll while THEAD remains fixed.
 *
 * @property scrollable
 * @type Boolean
 * @default false
 */
YAHOO.widget.DataTable.prototype.scrollable = false;

/**
 * True if only one TR element may be selected at a time.
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
 * True if default paginator UI is enabled.
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
 *  sortedBy.key
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

// ACCESSORS

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
 * Returns the DataTable instance's paginator object literal.
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






























// DOM ACCESSORS

/**
 * Returns DOM reference to the DataTable's TABLE element.
 *
 * @method getTableEl
 * @return {HTMLElement} Reference to TABLE element.
 */
YAHOO.widget.DataTable.prototype.getTableEl = function() {
    return this._elTable;
};

/**
 * Returns DOM reference to the DataTable's THEAD element.
 *
 * @method getTheadEl
 * @return {HTMLElement} Reference to THEAD element.
 */
YAHOO.widget.DataTable.prototype.getTheadEl = function() {
    return this._elHead;
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
    return this._elMsgCell;
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
    //TODO: By Record
    // By page row index
    var allRows = this._elTbody.rows;
    if(YAHOO.lang.isNumber(row) && (row > -1) && (row < allRows.length)) {
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
            if(elRow.parentNode == this._elTbody) {
                // Now we can return the TR element
                return elRow;
            }
        }

    }
    
    YAHOO.log("Could not get TR element for row " + row, "warn", this.toString());
    return null;
};

/**
 * Returns DOM reference to the first TR element in the DataTable page, or null.
 *
 * @method getFirstTrEl
 * @return {HTMLElement} Reference to TR element.
 */
YAHOO.widget.DataTable.prototype.getFirstTrEl = function() {
    return this.getTrEl(0);
};

/**
 * Returns DOM reference to the last TR element in the DataTable page, or null.
 *
 * @method getLastTrEl
 * @return {HTMLElement} Reference to last TR element.
 */
YAHOO.widget.DataTable.prototype.getLastTrEl = function() {
    return this.getTrEl(this._elTbody.rows.length-1);
};

/**
 * Returns DOM reference to the TD element at given DataTable page coordinates, or null.
 *
 * @method getCell
 * @param row {Number} Page row index.
 * @param col {Number} Page column index.
 * @return {HTMLElement} Reference to TD element.
 */
YAHOO.widget.DataTable.prototype.getTdEl = function(row, col) {
    //TODO: accept other row and column identifers
    
    var pageRowIndex, colIndex;
    var allRows = this._elTbody.rows;
    if(YAHOO.lang.isNumber(row)) {
        if((row > -1) && (row < allRows.length)) {
            pageRowIndex = row;

            // We have a valid page row index, let's get the column index
            if(YAHOO.lang.isNumber(col)) {
                var cells = allRows[pageRowIndex].cells;
                if((col > -1) && (colIndex < cells.length)) {
                    colIndex = col;
                
                    // We have a valid column index, let's get the TD element
                    return cells[colIndex];
                }
            }
        }
    }
    
    YAHOO.log("Could not get TD element at row " + row + " and column " + col,
            "warn", this.toString());
    return null;
};

/**
 * Returns the page row index of given row. Returns null if the row is not in
 * view on the current DataTable page.
 *
 * @method getPageRowIndex
 * @param row {HTMLElement | String | YAHOO.widget.Record | Number} DOM or ID
 * string reference to an element within the DataTable page, a Record instance,
 * or a Record's RecordSet index.
 * @return {Number} Page row index, or null if row is not in view.
 */
YAHOO.widget.DataTable.prototype.getPageRowIndex = function(row) {
    var recordIndex;
    
    // By Record
    if(row instanceof YAHOO.widget.Record) {
        recordIndex = this._oRecordSet.getRecordIndex(row);
    }
    // By Record index
    else {
        recordIndex = row;
    }
    
    // Calculate page row index from Record index
    if(YAHOO.lang.isNumber(recordIndex)) {

        // DataTable is paginated
        if(this.isPaginated()) {
            // Get the first and last Record on this page
            var startRecordIndex = this._paginator.startRecordIndex;
            var endRecordIndex = startRecordIndex + this._paginator.rowsPerPage - 1;
            // This Record is in view
            if((recordIndex >= startRecordIndex) && (recordIndex <= endRecordIndex)) {
                return recordIndex - startRecordIndex;
            }
            // This Record is not in view
            else {
                return null;
            }
        }
        // Not paginated, just return the Record index
        else {
            return recordIndex;
        }

    }
    // By element reference or ID string
    else {
        // Validate TR element
        elRow = this.getTrEl(elRow);
        if(elRow) {
            return elRow.sectionRowIndex;
        }
    }
    
    YAHOO.log("Could not get page row index for row " + row, "warn", this.toString());
    return null;
};





















// RECORD FUNCTIONS

/**
 * Returns Record index for given TR element or page row index.
 *
 * @method getRecordIndex
 * @param row {YAHOO.widget.Record | HTMLElement | Number} Record instance, TR
 * element reference or page row index.
 * @return {Number} Record's RecordSet index.
 */
YAHOO.widget.DataTable.prototype.getRecordIndex = function(row) {
    var pageRowIndex;

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
                pageRowIndex = el.sectionRowIndex;
            }
        }
    }
    // By page row index
    else {
        pageRowIndex = row;
    }

    if(YAHOO.lang.isNumber(pageRowIndex)) {
        if(this._paginator && this._paginator.startRecordIndex) {
            return this._paginator.startRecordIndex + pageRowIndex;
        }
        else {
            return pageRowIndex;
        }
    }
    // Invalid identifier
    else {
        YAHOO.log("Could not get Record index for row " + row, "warn", this.toString());
        return null;
    }
};

/**
 * For the given identifier, returns the associated Record instance.
 *
 * @method getRecord
 * @param record {HTMLElement | String | Number} Record's RecordSet position
 * index, DOM element reference within the DataTable page, or by ID string to a
 * DOM element within the DataTable page.
 * @return {YAHOO.widget.Record} Record instance.
 */
YAHOO.widget.DataTable.prototype.getRecord = function(record) {
    var recordIndex;
    
    // By element reference or ID string
    if(!YAHOO.lang.isNumber(record)) {
        // Validate TR element
        var elRow = this.getTrEl(record);
        if(elRow) {
            recordIndex = this.getRecordIndex(elRow);
        }
    }
    // By Record index
    if(YAHOO.lang.isNumber(recordIndex)) {
        return this._oRecordSet.getRecord(recordIndex);
    }
    else {
        YAHOO.log("Could not get Record for " + record, "warn", this.toString());
        return null;
    }
};

































// ROW FUNCTIONS


/**
 * Adds a new Record  of data into the RecordSet at the index if given,
 * otherwise at the  end. If the new Record is in page view, the
 * corresponding DOM elements are also updated.
 *
 * @method addRow
 * @param oData {Object} Object literal of data for the row.
 * @param index {Number} (optional) RecordSet position index at which to add data.
 */
YAHOO.widget.DataTable.prototype.addRow = function(oData, index) {
    var oRecord = this._oRecordSet.addRecord(oData, index);
    if(oRecord) {
        var pageRowIndex = this.getPageRowIndex(oRecord);
        
        // Not paginated, so insert a new TR element
        if(!this.isPaginated()) {
            var newRowId = this._addTrEl(oRecord, pageRowIndex);
            if(newRowId) {
                // Is this an insert or an append?
                var append = (YAHOO.lang.isNumber(pageRowIndex) && (pageRowIndex > -1)
                        && (pageRowIndex < this._elTbody.rows.length)) ? false : true;

                // Stripe the one new row
                if(append) {
                    if((this._elTbody.rows.length-1)%2) {
                        YAHOO.util.Dom.addClass(newRowId, YAHOO.widget.DataTable.CLASS_ODD);
                    }
                    else {
                        YAHOO.util.Dom.addClass(newRowId, YAHOO.widget.DataTable.CLASS_EVEN);
                    }
                }
                // Restripe all the rows
                else {
                    //TODO: pass in a subset for better performance
                    this._setRowStripes();
                }

                // If new row is at the bottom
                if(append) {
                    this._setLastRow();
                }
                // If new row is at the top
                else if(YAHOO.lang.isNumber(index) && (pageRowIndex === 0)) {
                    this._setFirstRow();
                }
            }
        }
        // Paginated and Record is in view, so refresh the table to keep pagination state
        else if(pageRowIndex !== null) {
            this.refreshTable();
        }
        // Paginated but Record is not in view so just update pagination UI
        else {
            this.updatePaginator();
        }
        
        // TODO: what args to pass?
        this.fireEvent("rowAddEvent", {data:oData, trElId:newRowId});
        if(pageRowIndex === null) {
            pageRowIndex = "n/a";
        }
        YAHOO.log("DataTable row added: Record ID = " + oRecord.getId() +
                ", Record index = " + this.getRecordIndex(oRecord) +
                ", page row index = " + pageRowIndex, "info", this.toString());
    }
    else {
        YAHOO.log("Could not add row because Record could not be created", "error", this.toString());
    }
};

/**
 * For the given row, updates the associated Record with the given data. If the
 * row is in view, the corresponding DOM elements are also updated.
 *
 * @method updateRow
 * @param row {YAHOO.widget.Record | Number | HTMLElement | String}
 * Which row to update: By Record instance, by Record's RecordSet
 * position index, by HTMLElement reference to the TR element, or by ID string
 * of the TR element.
 * @param oData {Object} Object literal of data for the row.
 */
YAHOO.widget.DataTable.prototype.updateRow = function(row, oData) {
    var elRow = this.getTrEl(row);
    
    var oRecord = this.getRecord(elRow);
    if(oRecord !== null) {
        if(oData && (oData.constructor == Object)) {
            // Update the Record
            this._oRecordSet.updateRecord(oRecord, oData);
        
            // TODO: Update the TR element only if it is in view
            var rowId = this._updateTrEl(elRow);
            
            //TODO: Event passes TR ID old data, new data.
            this.fireEvent("rowUpdateEvent", {newData:oData, oldData:"todo", trElId:rowId});
        }
        else {
            YAHOO.log("Could not update row " + row +
                    " due to invalid data: " + oData, "error", this.toString());
        }
    }
    else {
        YAHOO.log("Could not update row " + row, "error", this.toString());
    }
};

/**
 * Deletes the given row's Record from the RecordSet. If the row is in view, the
 * corresponding DOM elements are also deleted.
 *
 * @method deleteRow
 * @param row {HTMLElement | String | Number} DOM element reference or ID string
 * to DataTable page element or RecordSet index.
 */
YAHOO.widget.DataTable.prototype.deleteRow = function(row) {
    // Get the Record index...
    var recordIndex = null;
    // ...by Record index
    if(YAHOO.lang.isNumber(row)) {
        recordIndex = row;
    }
    // ...by element reference
    else {
        var elRow = YAHOO.util.Dom.get(row);
        elRow = this.getTrEl(elRow);
        if(elRow) {
            recordIndex = this.getRecordIndex(elRow);
        }
    }
    if(recordIndex !== null) {
        // Copy data from the Record for the event that gets fired later
        var oRecordData = this.getRecord(recordIndex).getData();
        var oData = {};
        for(var key in oRecordData) {
            oData[key] = oRecordData[key];
        }
        
        // Delete Record from RecordSet
        this._oRecordSet.deleteRecord(recordIndex);
        
        // If row is in view, delete the TR element
        var pageRowIndex = this.getPageRowIndex(recordIndex);
        if(YAHOO.lang.isNumber(pageRowIndex)) {
            this._deleteTrEl(pageRowIndex);
            
            //TODO: doesn't need to be called every time
            // Set first-row and last-row trackers
            this._setFirstRow();
            this._setLastRow();
        }
        
        this.fireEvent("rowDeleteEvent",
                {pageRowIndex:pageRowIndex,
                recordIndex: recordIndex,
                recordData: oData});
        YAHOO.log("Deleted row " + pageRowIndex + " and Record " + recordIndex + " of data " + YAHOO.widget.Logger.dump(oData), "info", this.toString());
    }
    else {
        YAHOO.log("Could not delete given row: " + row, "warn", this.toString());
    }
};

/**
 * Sets a row to the selected state. If the row is in view, the corresponding
 * DOM elements are also updated.
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
        this._selectEl(row);

        // Add to the end of internal tracker
        tracker.push(recordId);
        this._aSelectedRecords = tracker;

        this.fireEvent("rowSelectEvent",{el:row, record:this.getRecord(row)});
        YAHOO.log("Row selected: ID=\"" + row.id + "\", " +
                "Record=" + this.getRecord(row),
                "info",this.toString());
    }
};

/**
 * Sets a row to the unselected state. If the row is in view, the corresponding
 * DOM elements are also updated.
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
        this._unselectEl(row);

        this.fireEvent("rowUnselectEvent",{el:row, record:this.getRecord(row)});
        YAHOO.log("Row unselected: ID=\"" + row.id + "\", " +
                "Record=" + this.getRecord(row),
                "info",this.toString());
    }
};


/**
 * Unselects all selected rows (across all pages).
 *
 * @method unselectAllRows
 */
YAHOO.widget.DataTable.prototype.unselectAllRows = function() {
    var selectedRows = YAHOO.util.Dom.getElementsByClassName(YAHOO.widget.DataTable.CLASS_SELECTED,"tr",this._elTbody);
    this.unselect(selectedRows);
    this._aSelectedRecords = [];
    this.fireEvent("unselectEvent", {els:selectedRows});
};





























// MESSAGING


/**
 * Displays message within secondary TBODY.
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
    this._elMsgTbody.style.display = "";
};

/**
 * Hides secondary TBODY.
 *
 * @method hideTableMessage
 */
YAHOO.widget.DataTable.prototype.hideTableMessage = function() {
    this._elMsgTbody.style.display = "none";
};































// PAGINATION


/**
 * Whether or not DataTable is paginated to show only a subset of RecordSet.
 *
 * @method isPaginated
 * @return {Boolean} Returns true if paginated, false otherwise.
 */
YAHOO.widget.DataTable.prototype.isPaginated = function() {
    return (this.paginator || (this._paginator));
};

/**
 * Displays given page of a paginated DataTable.
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
    this.refreshTable();
};

/**
 * Updates Paginator containers with markup. Override this method to customize pagination UI.
 *
 * @method formatPaginators
 */
 YAHOO.widget.DataTable.prototype.formatPaginators = function() {
    var pag = this._paginator;
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
    if(pag.dropdownOptions) {
        dropdownEnabled = true;
        for(i=0; i<pag.dropdowns.length; i++) {
            this.formatPaginatorDropdown(pag.dropdowns[i]);
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
YAHOO.widget.DataTable.prototype.formatPaginatorDropdown = function(elDropdown) {
    if(elDropdown.options) {
        var options = elDropdown.options;
        // Update dropdown's "selected" value
        for(var i=options.length-1; i>-1; i--) {
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
YAHOO.widget.DataTable.prototype.formatPaginatorLinks = function(elContainer, nCurrentPage, nPageLinksStart, nPageLinksLength, nTotalPages) {
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
    var markup = firstPageLink + prevPageLink;
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
    elContainer.innerHTML = markup;
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







































// TABLE FUNCTIONS

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
 * Deletes all data in RecordSet with the given data and populates the page view
 * with the new data. Any previous states of sorting and selection are cleared.
 * If pagination is enabled, displays only the current page, otherwise displays
 * all rows. For performance, reuses existing DOM elements when possible while
 * deleting extraneous elements.
 *
 * @method initializeTable
 * @param oData {Object | Object[]} An object literal of data or an array of
 * object literals containing data.
 */
YAHOO.widget.DataTable.prototype.initializeTable = function(oData) {
    // Add data to RecordSet
    var records = this._oRecordSet.replaceRecords(oData);
    
    //TODO: clear selections, clear sorts
    
    // Update table view
    this.refreshTable();
};

/**
 * Refreshes page view with existing Records from the RecordSet while
 * maintaining sort, pagination, and selection states. For performance, reuses
 * existing DOM elements when possible while deleting extraneous elements.
 *
 * @method refreshTable
 */
YAHOO.widget.DataTable.prototype.refreshTable = function() {
    var i, aRecords;
    
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
        aRecords = this._oRecordSet.getRecords(this._paginator.startRecordIndex, this._paginator.rowsPerPage);
    }
    // Show all records
    else {
        aRecords = this._oRecordSet.getRecords();
    }

    if(YAHOO.lang.isArray(aRecords) && (aRecords.length > 0)) {
        this.hideTableMessage();

        var elTbody = this._elTbody;
        var elRows = elTbody.rows;

        // Remove extra rows from the bottom so as to preserve ID order
        while(elTbody.hasChildNodes() && (elRows.length > aRecords.length)) {
            elTbody.deleteRow(-1);
        }

        // Unselect rows in the UI but keep tracking selected rows
        var selectedRecords = this.getSelectedRecordIds();
        if(selectedRecords.length > 0) {
            this._unselectAllTrEls();
        }

        //TODO: Keep track of updated TR IDs?
        var rowIds = [];
        
        // From the top, update in-place existing rows
        for(i=0; i<elRows.length; i++) {
            rowIds.push(this._updateTrEl(elRows[i]));
        }

        // Add rows as necessary
        for(i=elRows.length; i<aRecords.length; i++) {
            rowIds.push(this._addTrEl(aRecords[i]));
        }

        // Select any rows as necessary
        for(i=0; i<selectedRecords.length; i++) {
            var allRows = elTbody.rows;
            for(var j=0; j<allRows.length; j++) {
                if(selectedRecords[i] == allRows[j].yuiRecordId) {
                    this._selectEl([allRows[j]]);
                }
            }
        }

        // Set classes
        this._setFirstRow();
        this._setLastRow();
        this._setRowStripes();

        this.fireEvent("tableRefreshEvent", {records:aRecords});

        YAHOO.log("DataTable refreshed showing " + aRecords.length + " of " + this._oRecordSet.getLength() + " rows", "info", this.toString());
    }
    else {
        this.showTableMessage(YAHOO.widget.DataTable.MSG_EMPTY, YAHOO.widget.DataTable.CLASS_EMPTY);
    }
};

/**
 * Nulls out the DataTable instance and related objects, removes attached event
 * listeners, and clears out DOM elements inside the container. After calling
 * this method, the instance reference should be expliclitly nulled by
 * implementer, as in myDataTable = null. Use with caution!
 *
 * @method destroyTable
 */
YAHOO.widget.DataTable.prototype.destroyTable = function() {
    var elContainer = this._elContainer;
    
    // Unhook custom events
    this.unsubscribeAll();

    // Unhook DOM events
    YAHOO.util.Event.purgeElement(elContainer, true);
    
    // Remove DOM elements
    elContainer.innerHTML = "";
    
    // Null out objects
    for(var key in this) {
        if(this.hasOwnProperty(key)) {
            this[key] = null;
        }
    }
};





































// COLUMN FUNCTIONS




/**
 * Sorts given Column.
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
        if(oColumn.key && this.sortedBy && (this.sortedBy.key === oColumn.key)) {
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
            // Here "a" and "b" are 2 Records to sort by oColumn.key
            sortFnc = function(a, b) {
                if(sortDir == "desc") {
                    sorted = YAHOO.util.Sort.compareDesc(a.getData(oColumn.key),b.getData(oColumn.key));
                    if(sorted === 0) {
                        return YAHOO.util.Sort.compareDesc(a.id,b.id);
                    }
                    else {
                        return sorted;
                    }
                }
                else {
                    sorted = YAHOO.util.Sort.compareAsc(a.getData(oColumn.key),b.getData(oColumn.key));
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
            this._oRecordSet.sortRecords(sortFnc);

            // Update classes
            YAHOO.util.Dom.removeClass(this.sortedBy._id,YAHOO.widget.DataTable.CLASS_SORTEDBYASC);
            YAHOO.util.Dom.removeClass(this.sortedBy._id,YAHOO.widget.DataTable.CLASS_SORTEDBYDESC);
            var newClass = (sortDir == "asc") ? YAHOO.widget.DataTable.CLASS_SORTEDBYASC : YAHOO.widget.DataTable.CLASS_SORTEDBYDESC;
            YAHOO.util.Dom.addClass(oColumn.getId(), newClass);

            // Keep track of currently sorted column
            this.sortedBy.key = oColumn.key;
            this.sortedBy.dir = sortDir;
            this.sortedBy._id = oColumn.getId();

            this.fireEvent("columnSortEvent",{column:oColumn,dir:sortDir});
            YAHOO.log("RecordSet sorted on Column \"" + oColumn.key + "\" direction \"" + sortDir + "\"", "info", this.toString());
            
            // Update the UI
            //TODO
            this.refreshTable();
        }
    }
    else {
        //TODO
        YAHOO.log("Column is not sortable", "info", this.toString());
    }
};













// CSS



/**
 * Assigns the class YAHOO.widget.DataTable.CLASS_HIGHLIGHT to the given element(s).
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
 * Removes the class YAHOO.widget.DataTable.CLASS_HIGHLIGHT from the given element(s).
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
 * Assigns the class YAHOO.widget.DataTable.CLASS_HIGHLIGHT to the given element(s).
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
        this._selectEl(els);

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
        this._unselectEl(els);
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
 * Unselects all selected cells.
 *
 * @method unselectAllCells
 */
YAHOO.widget.DataTable.prototype.unselectAllCells = function() {
    var selectedCells = YAHOO.util.Dom.getElementsByClassName(YAHOO.widget.DataTable.CLASS_SELECTED,"td",this._elTbody);
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
    return YAHOO.util.Dom.getElementsByClassName(YAHOO.widget.DataTable.CLASS_SELECTED,"tr",this.__elTbody);
};

/**
 * Returns array of selected TD cells.
 *
 * @method getSelectedCells
 * @return {HTMLElement[]} Array of selected TD elements.
 */
YAHOO.widget.DataTable.prototype.getSelectedCells = function() {
    //TODO: keep internal array
    return YAHOO.util.Dom.getElementsByClassName(YAHOO.widget.DataTable.CLASS_SELECTED,"td",this.__elTbody);
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






























































// CELL FUNCTIONS

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
            //TODO: getRecord API has changed
            this.activeEditor = column.getEditor(elCell,this.getRecord(elCell));
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
        var oldValue = oRecord.getData(oColumn.key);
        var newValue = this.activeEditor.getValue();

        if(YAHOO.util.Lang.isString(oColumn.key)) {
            // Update Record field
            this._oRecordSet.updateField(oRecord,oColumn.key,newValue);

            //Update TD element
            oColumn.format(elCell, oRecord);
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

/*TODO: delete
 * Formats given cell.
 *
 * @method formatCell
 * @param elCell {HTMLElement} Cell element to format.
 * @param oRecord {YAHOO.widget.Record} (Optional) Record instance.
 */
/*YAHOO.widget.DataTable.prototype.formatCell = function(elCell) {
    if(elCell && YAHOO.lang.isNumber(elCell.columnIndex)) {
        var index = elCell.columnIndex;
        var column = this._oColumnSet.keys[index];
        column.format(elCell,this.getRecord(elCell));
        if (index === 0) {
            YAHOO.util.Dom.addClass(elCell,YAHOO.widget.DataTable.CLASS_FIRST);
        }
        else if (index === this._oColumnSet.keys.length-1) {
            YAHOO.util.Dom.addClass(elCell,YAHOO.widget.DataTable.CLASS_LAST);
        }
        this.fireEvent("cellFormatEvent", {el:elCell});
    }
};*/




































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
 * Overridable custom event handler to manage selection according to desktop paradigm.
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
    var rows = this._elTbody.rows;
    var anchor = YAHOO.util.Dom.get(this._sSelectionAnchorId);
    var anchorIndex;
    var targetIndex = elTarget.sectionRowIndex;

    // Both SHIFT and CTRL
    if(!bSingleSelect && bSHIFT && bCTRL) {
        // Validate anchor
        if(anchor) {
            anchorIndex = anchor.sectionRowIndex;
            if(this.isSelected(YAHOO.util.Dom.get(this._sSelectionAnchorId))) {
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
            this._sSelectionAnchorId = sTargetId;
            
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
            this._sSelectionAnchorId = sTargetId;
            
            // Select target only
            this.selectRow(elTarget);
        }
    }
    // Only CTRL
    else if(!bSingleSelect && bCTRL) {
        // Set anchor
        this._sSelectionAnchorId = sTargetId;
        
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
        this._sSelectionAnchorId = sTargetId;
        
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

    var index = target.columnIndex;
    var oColumn = this._oColumnSet.keys[index];
    oColumn.format(target, this.getRecord(target));
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
 * Callback function receives data from DataSource and populates an entire
 * DataTable with Records and TR elements, clearing previous Records, if any.
 *
 * @method onDataReturnInitializeTable
 * @param sRequest {String} Original request.
 * @param oResponse {Object} Response object.
 * @param bError {Boolean} (optional) True if there was a data error.
 */
YAHOO.widget.DataTable.prototype.onDataReturnInitializeTable = function(sRequest, oResponse) {
    this.fireEvent("dataReturnEvent", {request:sRequest,response:oResponse});

    // Pass data through abstract method for any transformations
    var ok = this.doBeforeLoadData(sRequest, oResponse);
    
    // Data ok to populate
    if(ok && oResponse && !oResponse.error && YAHOO.lang.isArray(oResponse.results)) {
        this.initializeTable(oResponse.results);
    }
    // Error
    else if(ok && oResponse.error) {
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
    var ok = this.doBeforeLoadData(sRequest, oResponse, bError);
    
    // Data ok to append
    if(ok && oResponse && !oResponse.error && YAHOO.lang.isArray(oResponse.results)) {
        this.addRows(oResponse.results, 0);
    }
    // Error
    else if(ok && oResponse.error) {
        this.showTableMessage(YAHOO.widget.DataTable.MSG_ERROR, YAHOO.widget.DataTable.CLASS_ERROR);
    }
};
