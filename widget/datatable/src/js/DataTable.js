
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
    var i, ok, elTable, elThead, elTbody;
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
    
    // Validate HTML Element
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
                elTbody = elTable.tBodies[i];

                // Iterate through each TR
                for(var j=0; j<elTbody.rows.length; j++) {
                    var elRow = elTbody.rows[j];
                    var oData = {};

                    // Iterate through each TD
                    for(var k=0; k<elRow.cells.length; k++) {
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

    // DOM elements are now available
    elTable = this._elTable;
    elTable.className = YAHOO.widget.DataTable.CLASS_TABLE;
    elThead = this._elThead;
    elTbody = this._elTbody;
    
    /////////////////////////////////////////////////////////////////////////////
    //
    // DOM Events
    //
    /////////////////////////////////////////////////////////////////////////////

    YAHOO.util.Event.addListener(document, "click", this._onDocumentClick, this);
    YAHOO.util.Event.addListener(document, "keydown", this._onDocumentKeydown, this);
    
    //YAHOO.util.Event.addListener(this._elContainer, "focus", this._onContainerFocus, this);
    //YAHOO.util.Event.addListener(this._elContainer, "blur", this._onContainerBlur, this);

    //YAHOO.util.Event.addListener(elTable, "focus", this._onTableFocus, this);
    //YAHOO.util.Event.addListener(elTable, "blur", this._onTableBlur, this);

    YAHOO.util.Event.addListener(elTable, "mouseover", this._onTableMouseover, this);
    YAHOO.util.Event.addListener(elTable, "mouseout", this._onTableMouseout, this);
    YAHOO.util.Event.addListener(elTable, "mousedown", this._onTableMousedown, this);
    //YAHOO.util.Event.addListener(elTable, "mouseup", this._onTableMouseup, this);
    //YAHOO.util.Event.addListener(elTable, "mousemove", this._onTableMousemove, this);

    // Since we can't listen for click and dblclick on the same element...
    YAHOO.util.Event.addListener(elTable, "dblclick", this._onTableDblclick, this);
    YAHOO.util.Event.addListener(elThead, "click", this._onTheadClick, this);
    YAHOO.util.Event.addListener(elTbody, "click", this._onTbodyClick, this);
    
    YAHOO.util.Event.addListener(elTbody, "keydown", this._onTbodyKeydown, this);
    YAHOO.util.Event.addListener(elTbody, "keyup", this._onTbodyKeyup, this);
    YAHOO.util.Event.addListener(elTbody, "keypress", this._onTbodyKeypress, this);

    /////////////////////////////////////////////////////////////////////////////
    //
    // Custom Event Wrappers for DOM Events
    //
    /////////////////////////////////////////////////////////////////////////////

    /**
     * Fired when the DataTable has a focus.
     *
     * @event tableFocusEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The DataTable's TABLE element.
     */
    this.createEvent("tableFocusEvent");

    /**
     * Fired when the DataTable has a blur.
     *
     * @event tableBlurEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The DataTable's TABLE element.
     */
    this.createEvent("tableBlurEvent");

    /**
     * Fired when the DataTable has a mouseover.
     *
     * @event tableMouseoverEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The DataTable's TABLE element.
     *
     */
    this.createEvent("tableMouseoverEvent");

    /**
     * Fired when the DataTable has a mouseout.
     *
     * @event tableMouseoutEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The DataTable's TABLE element.
     *
     */
    this.createEvent("tableMouseoutEvent");

    /**
     * Fired when the DataTable has a mousedown.
     *
     * @event tableMousedownEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The DataTable's TABLE element.
     *
     */
    this.createEvent("tableMousedownEvent");

    /**
     * Fired when the DataTable has a click.
     *
     * @event tableClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The DataTable's TABLE element.
     *
     */
    this.createEvent("tableClickEvent");

    /**
     * Fired when the DataTable has a dblclick.
     *
     * @event tableDblclickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The DataTable's TABLE element.
     *
     */
    this.createEvent("tableDblclickEvent");
    
    /**
     * Fired when a header cell has a mouseover.
     *
     * @event headerCellMouseoverEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TH element.
     *
     */
    this.createEvent("headerCellMouseoverEvent");

    /**
     * Fired when a header cell has a mouseout.
     *
     * @event headerCellMouseoutEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TH element.
     *
     */
    this.createEvent("headerCellMouseoutEvent");

    /**
     * Fired when a header cell has a mousedown.
     *
     * @event headerCellMousedownEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TH element.
     */
    this.createEvent("headerCellMousedownEvent");

    /**
     * Fired when a header cell has a click.
     *
     * @event headerCellClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TH element.
     */
    this.createEvent("headerCellClickEvent");

    /**
     * Fired when a header cell has a dblclick.
     *
     * @event headerCellDblclickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TH element.
     */
    this.createEvent("headerCellDblclickEvent");

    /**
     * Fired when a header label has a mouseover.
     *
     * @event headerLabelMouseoverEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The SPAN element.
     *
     */
    this.createEvent("headerLabelMouseoverEvent");

    /**
     * Fired when a header label has a mouseout.
     *
     * @event headerLabelMouseoutEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The SPAN element.
     *
     */
    this.createEvent("headerLabelMouseoutEvent");

    /**
     * Fired when a header label has a mousedown.
     *
     * @event headerLabelMousedownEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The SPAN element.
     */
    this.createEvent("headerLabelMousedownEvent");

    /**
     * Fired when a header label has a click.
     *
     * @event headerLabelClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The SPAN element.
     */
    this.createEvent("headerLabelClickEvent");

    /**
     * Fired when a header label has a dblclick.
     *
     * @event headerLabelDblclickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The SPAN element.
     */
    this.createEvent("headerLabelDblclickEvent");

    /**
     * Fired when a cell has a mouseover.
     *
     * @event cellMouseoverEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TD element.
     */
    this.createEvent("cellMouseoverEvent");

    /**
     * Fired when a cell has a mouseout.
     *
     * @event cellMouseoutEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TD element.
     */
    this.createEvent("cellMouseoutEvent");

    /**
     * Fired when a cell has a mousedown.
     *
     * @event cellMousedownEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TD element.
     */
    this.createEvent("cellMousedownEvent");

    /**
     * Fired when a cell has a click.
     *
     * @event cellClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TD element.
     */
    this.createEvent("cellClickEvent");

    /**
     * Fired when a cell has a dblclick.
     *
     * @event cellDblclickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TD element.
     */
    this.createEvent("cellDblclickEvent");

    /**
     * Fired when a row has a mouseover.
     *
     * @event rowMouseoverEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TR element.
     */
    this.createEvent("rowMouseoverEvent");

    /**
     * Fired when a row has a mouseout.
     *
     * @event rowMouseoutEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TR element.
     */
    this.createEvent("rowMouseoutEvent");

    /**
     * Fired when a row has a mousedown.
     *
     * @event rowMousedownEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TR element.
     */
    this.createEvent("rowMousedownEvent");

    /**
     * Fired when a row has a click.
     *
     * @event rowClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TR element.
     */
    this.createEvent("rowClickEvent");

    /**
     * Fired when a row has a dblclick.
     *
     * @event rowDblclickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TR element.
     */
    this.createEvent("rowDblclickEvent");

    /**
     * Fired when an active editor has a blur.
     *
     * @event editorBlurEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {YAHOO.widget.ColumnEditor} The active editor.
     */
    this.createEvent("editorBlurEvent");

    /**
     * Fired when an active editor has a keydown.
     *
     * @event editorKeydownEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {YAHOO.widget.ColumnEditor} The active editor.
     */
    this.createEvent("editorKeydownEvent");

    /**
     * Fired when a link has a click.
     *
     * @event linkClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The A element.
     */
    this.createEvent("linkClickEvent");

    /**
     * Fired when a CHECKBOX element is clicked.
     *
     * @event checkboxClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The CHECKBOX element.
     */
    this.createEvent("checkboxClickEvent");

    /**
     * Fired when a SELECT element is changed.
     *
     * @event selectChangeEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The SELECT element.
     */
    this.createEvent("selectChangeEvent");
    
    /**
     * Fired when a RADIO element is clicked.
     *
     * @event radioClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The RADIO element.
     */
    this.createEvent("radioClickEvent");
    
    /////////////////////////////////////////////////////////////////////////////
    //
    // Custom Events
    //
    /////////////////////////////////////////////////////////////////////////////

    /**
     * Fired when DataTable instance initialization is complete.
     *
     * @event initEvent
     */
    this.createEvent("initEvent");

    /**
     * Fired when DataTable view is refreshed.
     *
     * @event tableRefreshEvent
     */
    this.createEvent("tableRefreshEvent");

    /**
     * Fired when DataTable paginator is updated.
     *
     * @event paginatorUpdateEvent
     */
    this.createEvent("paginatorUpdateEvent");

    /**
     * Fired when data is returned from DataSource.
     *
     * @event dataReturnEvent
     * @param oArgs.request {String} Original request.
     * @param oArgs.response {Object} Response object.
     */
    this.createEvent("dataReturnEvent");
    
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
     * Fired when a column is sorted.
     *
     * @event columnSortEvent
     * @param oArgs.column {YAHOO.widget.Column} The Column instance.
     * @param oArgs.dir {String} Sort direction "asc" or "desc".
     */
    this.createEvent("columnSortEvent");

    /**
     * Fired when a column is resized.
     *
     * @event columnResizeEvent
     * @param oArgs.target {HTMLElement} The TH element.
     */
    this.createEvent("columnResizeEvent");

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
     * Fired when a row is selected.
     *
     * @event selectRowEvent
     * @param oArgs.el {HTMLElement} The selected TR element, if applicable.
     * @param oArgs.record {YAHOO.widget.Record} The selected Record.
     */
    this.createEvent("selectRowEvent");

    /**
     * Fired when a row is unselected.
     *
     * @event unselectRowEvent
     * @param oArgs.el {HTMLElement} The unselected TR element, if applicable.
     * @param oArgs.record {YAHOO.widget.Record} The unselected Record.
     */
    this.createEvent("unselectRowEvent");

    /**
     * Fired when all row selections are cleared.
     *
     * @event unselectAllRowsEvent
     */
    this.createEvent("unselectAllRowsEvent");

    /**
     * Fired when a cell is selected.
     *
     * @event selectCellEvent
     * @param oArgs.el {HTMLElement} The selected TD element, if applicable.
     * @param oArgs.record {YAHOO.widget.Record} The selected Record.
     * @param oArgs.key {String} The key of the selected cell, if applicable.
     */
    this.createEvent("selectCellEvent");

    /**
     * Fired when a cell is unselected.
     *
     * @event unselectCellEvent
     * @param oArgs.el {HTMLElement} The unselected TD element, if applicable.
     * @param oArgs.record {YAHOO.widget.Record} The unselected Record.
     * @param oArgs.key {String} The key of the unselected cell, if applicable.
     */
    this.createEvent("unselectCellEvent");

    /**
     * Fired when all cell selections are cleared.
     *
     * @event unselectAllCellsEvent
     */
    this.createEvent("unselectAllCellsEvent");

    /**
     * Fired when an element is highlighted.
     *
     * @event highlightEvent
     * @param oArgs.el {HTMLElement} The highlighted TD or TR element.
     */
    this.createEvent("highlightEvent");

    /**
     * Fired when an element is unhighlighted.
     *
     * @event unhighlightEvent
     * @param oArgs.el {HTMLElement} The highlighted TD or TR element.
     */
    this.createEvent("unhighlightEvent");



















    
    
    
    
    
    
    
    
    
    
    
    
    
    
    // Set up selection
    if(!this.selectionModel) {
        // Default values
        this.selectionModel = {
            eventName:null,
            cellMode:false,
            enableMulti:false,
            enableWraparound:false
        };
    }
    else if(this.selectionModel.eventName) {
        if(this.selectionModel.cellMode) {
            this.subscribe(this.selectionModel.eventName, this.onEventSelectCell);
        }
        else {
            this.subscribe(this.selectionModel.eventName, this.onEventSelectRow);
        }
    }

    // Set up sort
    this.subscribe("headerLabelClickEvent", this.onEventSortColumn);
    
    // Set up inline editing
    this.subscribe("editorKeydownEvent", this.onEditorKeydown);

    // Set up context menu
    //TODO: does trigger have to exist? can trigger be TBODY rather than rows?
    if(this.contextMenu && this.contextMenuOptions) {
        this.contextMenu = new YAHOO.widget.ContextMenu(this.id+"-cm", { trigger: this._elTbody.rows } );
        this.contextMenu.addItem("delete item");
        this.contextMenu.render(document.body);
    }

    YAHOO.widget.DataTable._nCount++;
    this.fireEvent("initEvent");
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
 * Class name assigned to TABLE element.
 *
 * @property YAHOO.widget.DataTable.CLASS_TABLE
 * @type String
 * @static
 * @final
 * @default "yui-dt-table"
 */
YAHOO.widget.DataTable.CLASS_TABLE = "yui-dt-table";

/**
 * Class name assigned to header container elements within each TH element.
 *
 * @property YAHOO.widget.DataTable.CLASS_HEADER
 * @type String
 * @static
 * @final
 * @default "yui-dt-header"
 */
YAHOO.widget.DataTable.CLASS_HEADER = "yui-dt-header";

/**
 * Class name assigned to the primary TBODY element.
 *
 * @property YAHOO.widget.DataTable.CLASS_BODY
 * @type String
 * @static
 * @final
 * @default "yui-dt-body"
 */
YAHOO.widget.DataTable.CLASS_BODY = "yui-dt-body";

/**
 * Class name assigned to the scrolling TBODY element of a scrollable DataTable.
 *
 * @property YAHOO.widget.DataTable.CLASS_SCROLLBODY
 * @type String
 * @static
 * @final
 * @default "yui-dt-scrollbody"
 */
YAHOO.widget.DataTable.CLASS_SCROLLBODY = "yui-dt-scrollbody";

/**
 * Class name assigned to display label elements.
 *
 * @property YAHOO.widget.DataTable.CLASS_LABEL
 * @type String
 * @static
 * @final
 * @default "yui-dt-label"
 */
YAHOO.widget.DataTable.CLASS_LABEL = "yui-dt-label";

/**
 * Class name assigned to resizer handle elements.
 *
 * @property YAHOO.widget.DataTable.CLASS_RESIZER
 * @type String
 * @static
 * @final
 * @default "yui-dt-resizer"
 */
YAHOO.widget.DataTable.CLASS_RESIZER = "yui-dt-resizer";

/**
 * Class name assigned to paginator container elements.
 *
 * @property YAHOO.widget.DataTable.CLASS_PAGINATOR
 * @type String
 * @static
 * @final
 * @default "yui-dt-paginator"
 */
YAHOO.widget.DataTable.CLASS_PAGINATOR = "yui-dt-paginator";


/**
 * Class name assigned to editor container elements.
 *
 * @property YAHOO.widget.DataTable.CLASS_EDITOR
 * @type String
 * @static
 * @final
 * @default "yui-dt-editor"
 */
YAHOO.widget.DataTable.CLASS_EDITOR = "yui-dt-editor";

/**
 * Class name assigned to first elements.
 *
 * @property YAHOO.widget.DataTable.CLASS_FIRST
 * @type String
 * @static
 * @final
 * @default "yui-dt-first"
 */
YAHOO.widget.DataTable.CLASS_FIRST = "yui-dt-first";

/**
 * Class name assigned to last elements.
 *
 * @property YAHOO.widget.DataTable.CLASS_LAST
 * @type String
 * @static
 * @final
 * @default "yui-dt-last"
 */
YAHOO.widget.DataTable.CLASS_LAST = "yui-dt-last";

/**
 * Class name assigned to even elements.
 *
 * @property YAHOO.widget.DataTable.CLASS_EVEN
 * @type String
 * @static
 * @final
 * @default "yui-dt-even"
 */
YAHOO.widget.DataTable.CLASS_EVEN = "yui-dt-even";

/**
 * Class name assigned to odd elements.
 *
 * @property YAHOO.widget.DataTable.CLASS_ODD
 * @type String
 * @static
 * @final
 * @default "yui-dt-odd"
 */
YAHOO.widget.DataTable.CLASS_ODD = "yui-dt-odd";

/**
 * Class name assigned to previous indicators.
 *
 * @property YAHOO.widget.DataTable.CLASS_PREVIOUS
 * @type String
 * @static
 * @final
 * @default "yui-dt-previous"
 */
YAHOO.widget.DataTable.CLASS_PREVIOUS = "yui-dt-previous";

/**
 * Class name assigned next indicators.
 *
 * @property YAHOO.widget.DataTable.CLASS_NEXT
 * @type String
 * @static
 * @final
 * @default "yui-dt-next"
 */
YAHOO.widget.DataTable.CLASS_NEXT = "yui-dt-next";

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
 * Class name assigned to highlighted elements.
 *
 * @property YAHOO.widget.DataTable.CLASS_HIGHLIGHTED
 * @type String
 * @static
 * @final
 * @default "yui-dt-highlighted"
 */
YAHOO.widget.DataTable.CLASS_HIGHLIGHTED = "yui-dt-highlighted";

/**
 * Class name assigned to disabled elements.
 *
 * @property YAHOO.widget.DataTable.CLASS_DISABLED
 * @type String
 * @static
 * @final
 * @default "yui-dt-disabled"
 */
YAHOO.widget.DataTable.CLASS_DISABLED = "yui-dt-disabled";

/**
 * Class name assigned to empty indicators.
 *
 * @property YAHOO.widget.DataTable.CLASS_EMPTY
 * @type String
 * @static
 * @final
 * @default "yui-dt-empty"
 */
YAHOO.widget.DataTable.CLASS_EMPTY = "yui-dt-empty";

/**
 * Class name assigned to loading indicatorx.
 *
 * @property YAHOO.widget.DataTable.CLASS_LOADING
 * @type String
 * @static
 * @final
 * @default "yui-dt-loading"
 */
YAHOO.widget.DataTable.CLASS_LOADING = "yui-dt-loading";

/**
 * Class name assigned to error indicators.
 *
 * @property YAHOO.widget.DataTable.CLASS_ERROR
 * @type String
 * @static
 * @final
 * @default "yui-dt-error"
 */
YAHOO.widget.DataTable.CLASS_ERROR = "yui-dt-error";

/**
 * Class name assigned to editable elements.
 *
 * @property YAHOO.widget.DataTable.CLASS_EDITABLE
 * @type String
 * @static
 * @final
 * @default "yui-dt-editable"
 */
YAHOO.widget.DataTable.CLASS_EDITABLE = "yui-dt-editable";

/**
 * Class name assigned to scrollable elements.
 *
 * @property YAHOO.widget.DataTable.CLASS_SCROLLABLE
 * @type String
 * @static
 * @final
 * @default "yui-dt-scrollable"
 */
YAHOO.widget.DataTable.CLASS_SCROLLABLE = "yui-dt-scrollable";

/**
 * Class name assigned to sortable elements.
 *
 * @property YAHOO.widget.DataTable.CLASS_SORTABLE
 * @type String
 * @static
 * @final
 * @default "yui-dt-sortable"
 */
YAHOO.widget.DataTable.CLASS_SORTABLE = "yui-dt-sortable";

/**
 * Class name assigned to ascending elements.
 *
 * @property YAHOO.widget.DataTable.CLASS_ASC
 * @type String
 * @static
 * @final
 * @default "yui-dt-asc"
 */
YAHOO.widget.DataTable.CLASS_ASC = "yui-dt-asc";

/**
 * Class name assigned to descending elements.
 *
 * @property YAHOO.widget.DataTable.CLASS_DESC
 * @type String
 * @static
 * @final
 * @default "yui-dt-desc"
 */
YAHOO.widget.DataTable.CLASS_DESC = "yui-dt-desc";

/**
 * Class name assigned to SELECT container elements.
 *
 * @property YAHOO.widget.DataTable.CLASS_DROPDOWN
 * @type String
 * @static
 * @final
 * @default "yui-dt-dropdown"
 */
YAHOO.widget.DataTable.CLASS_DROPDOWN = "yui-dt-dropdown";

/**
 * Class name assigned to INPUT TYPE=CHECKBOX container elements.
 *
 * @property YAHOO.widget.DataTable.CLASS_CHECKBOX
 * @type String
 * @static
 * @final
 * @default "yui-dt-checkbox"
 */
YAHOO.widget.DataTable.CLASS_CHECKBOX = "yui-dt-checkbox";

/**
 * Class name assigned to string container elements.
 *
 * @property YAHOO.widget.DataTable.CLASS_STRING
 * @type String
 * @static
 * @final
 * @default "yui-dt-string"
 */
YAHOO.widget.DataTable.CLASS_STRING = "yui-dt-string";

/**
 * Class name assigned to number container elements.
 *
 * @property YAHOO.widget.DataTable.CLASS_NUMBER
 * @type String
 * @static
 * @final
 * @default "yui-dt-number"
 */
YAHOO.widget.DataTable.CLASS_NUMBER = "yui-dt-number";


/**
 * Class name assigned to currency container elements.
 *
 * @property YAHOO.widget.DataTable.CLASS_CURRENCY
 * @type String
 * @static
 * @final
 * @default "yui-dt-currency"
 */
YAHOO.widget.DataTable.CLASS_CURRENCY = "yui-dt-currency";

/**
 * Class name assigned to date container elements.
 *
 * @property YAHOO.widget.DataTable.CLASS_DATE
 * @type String
 * @static
 * @final
 * @default "yui-dt-date"
 */
YAHOO.widget.DataTable.CLASS_DATE = "yui-dt-date";

/**
 * Class name assigned to email container elements.
 *
 * @property YAHOO.widget.DataTable.CLASS_EMAIL
 * @type String
 * @static
 * @final
 * @default "yui-dt-email"
 */
YAHOO.widget.DataTable.CLASS_EMAIL = "yui-dt-email";

/**
 * Class name assigned to link container elements.
 *
 * @property YAHOO.widget.DataTable.CLASS_LINK
 * @type String
 * @static
 * @final
 * @default "yui-dt-link"
 */
YAHOO.widget.DataTable.CLASS_LINK = "yui-dt-link";

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
 * DOM reference to the CAPTION element for the DataTable instance.
 *
 * @property _elCaption
 * @type HTMLElement
 * @private
 */
YAHOO.widget.DataTable.prototype._elCaption = null;

/**
 * DOM reference to the TABLE element for the DataTable instance.
 *
 * @property _elTable
 * @type HTMLElement
 * @private
 */
YAHOO.widget.DataTable.prototype._elTable = null;

/**
 * DOM reference to the THEAD element for the DataTable instance.
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
 * @property _elMsgTbody
 * @type HTMLElement
 * @private
 */
YAHOO.widget.DataTable.prototype._elMsgTbodyRow = null;

/**
 * DOM reference to the secondary TBODY element's single TD element used to display DataTable messages.
 *
 * @property _elMsgTbody
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
    var elThead = document.createElement("thead");
    elThead.tabIndex = -1;

    // Iterate through each row of Column headers...
    var colTree = this._oColumnSet.tree;
    for(i=0; i<colTree.length; i++) {
        var elTheadRow = elThead.appendChild(document.createElement("tr"));
        elTheadRow.id = this.id+"-hdrow"+i;

        // ...and create THEAD cells
        for(var j=0; j<colTree[i].length; j++) {
            oColumn = colTree[i][j];
            var elTheadCell = elTheadRow.appendChild(document.createElement("th"));
            elTheadCell.id = oColumn.getId();
            this._initThEl(elTheadCell,oColumn,i,j);
        }
    }

    this._elThead = this._elTable.appendChild(elThead);
    
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
                // TODO: better way to get elTheadContainer
                var elTheadContainer = (YAHOO.util.Dom.getElementsByClassName(YAHOO.widget.DataTable.CLASS_HEADER,"div",YAHOO.util.Dom.get(oColumn.getId())))[0];
                var elTheadResizer = elTheadContainer.appendChild(document.createElement("span"));
                elTheadResizer.id = oColumn.getId() + "-resizer";
                YAHOO.util.Dom.addClass(elTheadResizer,YAHOO.widget.DataTable.CLASS_RESIZER);
                oColumn.ddResizer = new YAHOO.util.WidthResizer(
                        this, oColumn.getId(), elTheadResizer.id, elTheadResizer.id);
                var cancelClick = function(e) {
                    YAHOO.util.Event.stopPropagation(e);
                };
                YAHOO.util.Event.addListener(elTheadResizer,"click",cancelClick);
            }
            if(this.fixedWidth) {
                //elTheadContainer.style.overflow = "hidden";
                // TODO: better way to get elTheadText
                var elTheadText = (YAHOO.util.Dom.getElementsByClassName(YAHOO.widget.DataTable.CLASS_LABEL,"span",YAHOO.util.Dom.get(oColumn.getId())))[0];
                elTheadText.style.overflow = "hidden";
            }
        }
    }

    YAHOO.log("Column headers for " + this._oColumnSet.keys.length + " keys created","info",this.toString());
};

/**
 * Populates TH cell as defined by Column.
 *
 * @method _initThEl
 * @param elTheadCell {HTMLElement} TH cell element reference.
 * @param oColumn {YAHOO.widget.Column} Column object.
 * @param row {number} Row index.
 * @param col {number} Column index.
 * @private
 */
YAHOO.widget.DataTable.prototype._initThEl = function(elTheadCell,oColumn,row,col) {
    // Clear out the cell of prior content
    // TODO: purgeListeners and other validation-related things
    var index = this._nIndex;
    elTheadCell.yuiColumnId = oColumn.getId();
    if(oColumn.abbr) {
        elTheadCell.abbr = oColumn.abbr;
    }
    if(oColumn.width) {
        elTheadCell.style.width = oColumn.width;
    }
    if(oColumn.className) {
        YAHOO.util.Dom.addClass(elTheadCell,oColumn.className);
    }
    // Apply CSS for sorted tables
    if(this.sortedBy && this.sortedBy.key) {
        if(this.sortedBy.key === oColumn.key) {
            var sortClass = (this.sortedBy.dir && (this.sortedBy.dir != "asc")) ?
                    YAHOO.widget.DataTable.CLASS_SORTEDBYDESC :
                    YAHOO.widget.DataTable.CLASS_SORTEDBYASC;
            YAHOO.util.Dom.addClass(elTheadCell,sortClass);
            this.sortedBy._id = elTheadCell.id;
        }
    }

    elTheadCell.innerHTML = "";
    elTheadCell.rowSpan = oColumn.getRowspan();
    elTheadCell.colSpan = oColumn.getColspan();

    var elTheadContainer = elTheadCell.appendChild(document.createElement("div"));
    elTheadContainer.id = this.id+"-hdrow"+row+"-container"+col;
    YAHOO.util.Dom.addClass(elTheadContainer,YAHOO.widget.DataTable.CLASS_HEADER);
    var elTheadContent = elTheadContainer.appendChild(document.createElement("span"));
    elTheadContent.id = this.id+"-hdrow"+row+"-text"+col;
    YAHOO.util.Dom.addClass(elTheadContent,YAHOO.widget.DataTable.CLASS_LABEL);

    var contentText = oColumn.text || oColumn.key || "";
    if(oColumn.sortable) {
        YAHOO.util.Dom.addClass(elTheadContent,YAHOO.widget.DataTable.CLASS_SORTABLE);
        //TODO: Make hash configurable to be a server link
        //TODO: Make title configurable
        //TODO: Separate contentText from an accessibility link that says
        // Click to sort ascending and push it offscreen
        var sortLink = "?key=" + oColumn.key;
        elTheadContent.innerHTML = "<a href=\"" + sortLink + "\" title=\"Click to sort\" class=\"" + YAHOO.widget.DataTable.CLASS_SORTABLE + "\">" + contentText + "</a>";
         //elTheadContent.innerHTML = contentText;

    }
    else {
        elTheadContent.innerHTML = contentText;
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
            linkEl = containers[i].appendChild(linkEl);

            // Add event listener
            YAHOO.util.Event.addListener(linkEl,"click",this._onPaginatorLinkClick,this);

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
            selectEl.className = YAHOO.widget.DataTable.CLASS_DROPDOWN;
            selectEl = containers[i].appendChild(selectEl);

            // Create OPTION elements
            for(j=0; j<dropdownOptions.length; j++) {
                var optionEl = document.createElement("option");
                optionEl.value = dropdownOptions[j].value || dropdownOptions[j];
                optionEl.innerHTML = dropdownOptions[j].text || dropdownOptions[j];
                optionEl = selectEl.appendChild(optionEl);
            }
            
            // Add event listener
            YAHOO.util.Event.addListener(selectEl,"change",this._onPaginatorDropdownChange,this);

            // Add DOM reference to tracker
           paginator.dropdowns.push(selectEl);
        }
    }
    else {
        YAHOO.log("Could not create Paginator dropdown due to invalid dropdownOptions","error",this.toString());
    }

    this._paginator = paginator;
    this._paginator.containers = containers;
    YAHOO.log("Paginator initialized: " + YAHOO.widget.Logger.dump(this._paginator), "info", this.toString());
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
 * @return {String} ID of the added TR element, or null.
 * @private
 */
YAHOO.widget.DataTable.prototype._addTrEl = function(oRecord, index) {
    this.hideTableMessage();

    // It's an append if no index provided, or index is negative or too big
    var append = (!YAHOO.lang.isNumber(index) || (index < 0) ||
            index > (this._elTbody.rows.length-2)) ? true : false;
            
    var oColumnSet = this._oColumnSet;
    var oRecordSet = this._oRecordSet;

    var elRow = (append) ? this._elTbody.appendChild(document.createElement("tr")) :
        this._elTbody.insertBefore(document.createElement("tr"),this._elTbody.rows[index]);

    elRow.id = this.id+"-bdrow"+(this._elTbody.rows.length-1);
    elRow.yuiRecordId = oRecord.getId();

    // Create TBODY cells
    for(var j=0; j<oColumnSet.keys.length; j++) {
        var oColumn = oColumnSet.keys[j];
        var elCell = elRow.appendChild(document.createElement("td"));
        elCell.id = elRow.id+"-cell"+j;
        elCell.yuiColumnId = oColumn.getId();
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

    return elRow.id || null;
};

/**
 * Formats all TD elements of given TR element with data from the given Record.
 *
 * @method _updateTrEl
 * @param elRow {HTMLElement} The TR element to update.
 * @param oRecord {YAHOO.widget.Record} The associated Record instance.
 * @return {String} ID of the updated TR element, or null.
 * @private
 */
YAHOO.widget.DataTable.prototype._updateTrEl = function(elRow, oRecord) {
    this.hideTableMessage();

    // Update TD elements with new data
    for(var j=0; j<elRow.cells.length; j++) {
        var oColumn = this._oColumnSet.keys[j];
        oColumn.format(elRow.cells[j], oRecord);
    }

    // Update Record ID
    elRow.yuiRecordId = oRecord.getId();
    
    return elRow.id || null;
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













































/////////////////////////////////////////////////////////////////////////////
//
// Private DOM Event Handlers
//
/////////////////////////////////////////////////////////////////////////////

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
        oSelf._bFocused = false;
        oSelf.fireEvent("tableBlurEvent");

        // Fires editorBlurEvent when click is not within the container.
        // For cases when click is within the container, due to timing issues,
        // the editorBlurevent needs to get fired by the lower-level DOM click
        // handlers below.
        if(oSelf.activeEditor) {
            // Only if the click was not within the editor container
            if(!YAHOO.util.Dom.isAncestor(oSelf.activeEditor.container, elTarget)) {
                oSelf.fireEvent("editorBlurEvent");
            }
            else {
                //TODO: built-in save and cancel?
            }
        }
    }
};

/**
 * Handles keydown events on the DOCUMENT.
 *
 * @method _onDocumentKeydown
 * @param e {HTMLEvent} The keydown event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onDocumentKeydown = function(e, oSelf) {
    var elTarget = YAHOO.util.Event.getTarget(e);
    var elTag = elTarget.tagName.toLowerCase();

    if(oSelf.activeEditor &&
            YAHOO.util.Dom.isAncestor(oSelf.activeEditor.container, elTarget)) {
        oSelf.fireEvent("editorKeydownEvent", {event:e, target:oSelf.activeEditor});
    }
};

/**
 * Handles mouseover events on the TABLE element.
 *
 * @method _onTableMouseover
 * @param e {HTMLEvent} The mouseover event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onTableMouseover = function(e, oSelf) {
    var elTarget = YAHOO.util.Event.getTarget(e);
    var elTag = elTarget.tagName.toLowerCase();

    while(elTag != "table") {
        switch(elTag) {
            case "body":
                 break;
            case "a":
                break;
            case "td":
                oSelf.fireEvent("cellMouseoverEvent",{target:elTarget,event:e});
                break;
            case "th":
                oSelf.fireEvent("headerCellMouseoverEvent",{target:elTarget,event:e});
                break;
            case "tr":
                //TODO: headerRowMouseOverEvent
                oSelf.fireEvent("rowMouseoverEvent",{target:elTarget,event:e});
                break;
            default:
                break;
        }
        elTarget = elTarget.parentNode;
        elTag = elTarget.tagName.toLowerCase();
    }
    oSelf.fireEvent("tableMouseoverEvent",{target:elTarget,event:e});
};

/**
 * Handles mouseout events on the TABLE element.
 *
 * @method _onTableMouseout
 * @param e {HTMLEvent} The mouseout event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onTableMouseout = function(e, oSelf) {
    var elTarget = YAHOO.util.Event.getTarget(e);
    var elTag = elTarget.tagName.toLowerCase();

    while(elTag != "table") {
        switch(elTag) {
            case "body":
                break;
            case "a":
                break;
            case "td":
                oSelf.fireEvent("cellMouseoutEvent",{target:elTarget,event:e});
                break;
            case "th":
                oSelf.fireEvent("headerCellMouseoutEvent",{target:elTarget,event:e});
                break;
            case "tr":
                //TODO: headerRowMouseoutEvent
                oSelf.fireEvent("rowMouseoutEvent",{target:elTarget,event:e});
                break;
            default:
                break;
        }
        elTarget = elTarget.parentNode;
        elTag = elTarget.tagName.toLowerCase();
    }
    oSelf.fireEvent("tableMouseoutEvent",{target:elTarget,event:e});
};

/**
 * Handles mousedown events on the TABLE element.
 *
 * @method _onTableMousedown
 * @param e {HTMLEvent} The mousedown event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onTableMousedown = function(e, oSelf) {
    var elTarget = YAHOO.util.Event.getTarget(e);
    var elTag = elTarget.tagName.toLowerCase();

    while(elTag != "table") {
        switch(elTag) {
            case "body":
                break;
            case "a":
                break;
            case "td":
                oSelf.fireEvent("cellMousedownEvent",{target:elTarget,event:e});
                break;
            case "th":
                oSelf.fireEvent("headerCellMousedownEvent",{target:elTarget,event:e});
                break;
            case "tr":
                //TODO: headerRowMousedownEvent
                oSelf.fireEvent("rowMousedownEvent",{target:elTarget,event:e});
                break;
            default:
                break;
        }
        elTarget = elTarget.parentNode;
        elTag = elTarget.tagName.toLowerCase();
    }
    oSelf.fireEvent("tableMousedownEvent",{target:elTarget,event:e});
};

/**
 * Handles dblclick events on the TABLE element.
 *
 * @method _onTableDblclick
 * @param e {HTMLEvent} The dblclick event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onTableDblclick = function(e, oSelf) {
    var elTarget = YAHOO.util.Event.getTarget(e);
    var elTag = elTarget.tagName.toLowerCase();

    while(elTag != "table") {
        switch(elTag) {
            case "body":
                break;
            case "td":
                oSelf.fireEvent("cellDblclickEvent",{target:elTarget,event:e});
                break;
            case "th":
                oSelf.fireEvent("headerCellDblclickEvent",{target:elTarget,event:e});
                break;
            case "tr":
                if(elTarget.parentNode.tagName.toLowerCase() == "thead") {
                    oSelf.fireEvent("headerRowDblclickEvent",{target:elTarget,event:e});
                }
                else {
                    oSelf.fireEvent("rowDblclickEvent",{target:elTarget,event:e});
                }
                break;
            default:
                break;
        }
        elTarget = elTarget.parentNode;
        elTag = elTarget.tagName.toLowerCase();
    }
    oSelf.fireEvent("tableDblclickEvent",{target:elTarget,event:e});
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
    var elTarget = YAHOO.util.Event.getTarget(e);
    var elTag = elTarget.tagName.toLowerCase();

    if(oSelf.activeEditor) {
        oSelf.fireEvent("editorBlurEvent");
    }

    while(elTag != "thead") {
            switch(elTag) {
                case "body":
                    break;
                case "span":
                    if(YAHOO.util.Dom.hasClass(elTarget, YAHOO.widget.DataTable.CLASS_LABEL)) {
                        oSelf.fireEvent("headerLabelClickEvent",{target:elTarget,event:e});
                    }
                    break;
                case "th":
                    oSelf.fireEvent("headerCellClickEvent",{target:elTarget,event:e});
                    break;
                case "tr":
                    oSelf.fireEvent("headerRowClickEvent",{target:elTarget,event:e});
                    break;
                default:
                    break;
            }
            elTarget = elTarget.parentNode;
            elTag = elTarget.tagName.toLowerCase();
    }
    oSelf.fireEvent("tableClickEvent",{target:elTarget,event:e});
};

/**
 * Handles click events on the primary TBODY element.
 *
 * @method _onTbodyDClick
 * @param e {HTMLEvent} The click event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onTbodyClick = function(e, oSelf) {
    var elTarget = YAHOO.util.Event.getTarget(e);
    var elTag = elTarget.tagName.toLowerCase();

    if(oSelf.activeEditor) {
        oSelf.fireEvent("editorBlurEvent");
    }

    while(elTag != "table") {
            switch(elTag) {
                case "body":
                    break;
                case "input":
                    if(elTarget.type.toLowerCase() == "checkbox") {
                        oSelf.fireEvent("checkboxClickEvent",{target:elTarget,event:e});
                    }
                    else if(elTarget.type.toLowerCase() == "radio") {
                        oSelf.fireEvent("radioClickEvent",{target:elTarget,event:e});
                    }
                    break;
                case "a":
                    oSelf.fireEvent("linkClickEvent",{target:elTarget,event:e});
                    break;
                case "td":
                    oSelf.fireEvent("cellClickEvent",{target:elTarget,event:e});
                    break;
                case "tr":
                    oSelf.fireEvent("rowClickEvent",{target:elTarget,event:e});
                    break;
                default:
                    break;
            }
            elTarget = elTarget.parentNode;
            elTag = elTarget.tagName.toLowerCase();
    }
    oSelf.fireEvent("tableClickEvent",{target:elTarget,event:e});
};

/**
 * Handles keydown events on the TABLE. Executes arrow selection.
 *
 * @method _onTableKeydown
 * @param e {HTMLEvent} The key event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onTableKeydown = function(e, oSelf) {
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
 * Handles keyup events on the TABLE. Executes deletion.
 *
 * @method _onTableKeyup
 * @param e {HTMLEvent} The key event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onTableKeyup = function(e, oSelf) {
    var key = YAHOO.util.Event.getCharCode(e);
    // delete
    if(key == 46) {//TODO: && this.isFocused
        //TODO: delete row
    }
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
 * Handles click events on paginator links.
 *
 * @method _onPaginatorLinkClick
 * @param e {HTMLEvent} The click event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onPaginatorLinkClick = function(e, oSelf) {
    var elTarget = YAHOO.util.Event.getTarget(e);
    var elTag = elTarget.tagName.toLowerCase();

    if(oSelf.activeEditor) {
        oSelf.fireEvent("editorBlurEvent");
    }

    while(elTag != "table") {
        switch(elTag) {
            case "body":
                return;
            case "a":
                YAHOO.util.Event.stopEvent(e);
                switch(elTarget.className) {
                    case YAHOO.widget.DataTable.CLASS_NUMBER:
                        oSelf.showPage(parseInt(elTarget.innerHTML,10));
                        return;
                    case YAHOO.widget.DataTable.CLASS_FIRST:
                        oSelf.showPage(1);
                        return;
                    case YAHOO.widget.DataTable.CLASS_LAST:
                        oSelf.showPage(oSelf._paginator.totalPages);
                        return;
                    case YAHOO.widget.DataTable.CLASS_PREVIOUS:
                        oSelf.showPage(oSelf._paginator.currentPage-1);
                        return;
                    case YAHOO.widget.DataTable.CLASS_NEXT:
                        oSelf.showPage(oSelf._paginator.currentPage+1);
                        return;
                }
                break;
            default:
                return;
        }
        elTarget = elTarget.parentNode;
        elTag = elTarget.tagName.toLowerCase();
    }
};

/**
 * Handles change events on paginator SELECT element.
 *
 * @method _onPaginatorDropdownChange
 * @param e {HTMLEvent} The change event.
 * @param oSelf {YAHOO.widget.DataTable} DataTable instance.
 * @private
 */
YAHOO.widget.DataTable.prototype._onPaginatorDropdownChange = function(e, oSelf) {
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
 *     <ul>
 *         <li>sortedBy.key</li>
 *         <li>sortedBy.dir</li>
 *      </ul>
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

// OBJECT ACCESSORS

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
    var allRows = this._elTbody.rows;
    
    // By Record
    if(row instanceof YAHOO.widget.Record) {
        var nTrIndex = this.getTrIndex(row);
        return allRows[nTrIndex];
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
 * @method getTdEl
 * @param row {HTMLElement | String} DOM element reference or string ID.
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
                elCell = YAHOO.util.Dom.getAncestorByTagName(el,"td");
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
    
    YAHOO.log("Could not get TD element for cell " + cell, "warn", this.toString());
    return null;
};

/**
 * Returns DOM reference to the TH element at given DataTable page coordinates, or null.
 *
 * @method getThEl
 * @param header {HTMLElement | String} DOM element reference or string ID.
 * @return {HTMLElement} Reference to TH element.
 */
YAHOO.widget.DataTable.prototype.getThEl = function(header) {
    var elHeader;
    var el = YAHOO.util.Dom.get(header);

    // Validate HTML element
    if(el && (el.ownerDocument == document)) {
        // Validate TH element
        if(el.tagName.toLowerCase() != "th") {
            // Traverse up the DOM to find the corresponding TR element
            elHeader = YAHOO.util.Dom.getAncestorByTagName(el,"th");
        }
        else {
            elHeader = el;
        }
    }

        // Make sure the TH is in this THEAD
        if(elHeader && (elHeader.parentNode.parentNode == this._elThead)) {
            // Now we can return the TD element
            return elHeader;
        }

    YAHOO.log("Could not get TH element for header " + header, "warn", this.toString());
    return null;
};

/**
 * Returns the page row index of given row. Returns null if the row is not in
 * view on the current DataTable page.
 *
 * @method getTrIndex
 * @param row {HTMLElement | String | YAHOO.widget.Record | Number} DOM or ID
 * string reference to an element within the DataTable page, a Record instance,
 * or a Record's RecordSet index.
 * @return {Number} Page row index, or null if row does not exist or is not in view.
 */
YAHOO.widget.DataTable.prototype.getTrIndex = function(row) {
    var nRecordIndex;
    
    // By Record
    if(row instanceof YAHOO.widget.Record) {
        nRecordIndex = this._oRecordSet.getRecordIndex(row);
    }
    // By Record index
    else {
        nRecordIndex = row;
    }
    
    // Calculate page row index from Record index
    if(YAHOO.lang.isNumber(nRecordIndex)) {

        // DataTable is paginated
        if(this.isPaginated()) {
            // Get the first and last Record on this page
            var startRecordIndex = this._paginator.startRecordIndex;
            var endRecordIndex = startRecordIndex + this._paginator.rowsPerPage - 1;
            // This Record is in view
            if((nRecordIndex >= startRecordIndex) && (nRecordIndex <= endRecordIndex)) {
                return nRecordIndex - startRecordIndex;
            }
            // This Record is not in view
            else {
                return null;
            }
        }
        // Not paginated, just return the Record index
        else {
            return nRecordIndex;
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
        if(this._paginator && this._paginator.startRecordIndex) {
            return this._paginator.startRecordIndex + nTrIndex;
        }
        else {
            return nTrIndex;
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
 * @param row {HTMLElement | String | Number} RecordSet position index, DOM
 * reference or ID string to an element within the DataTable page.
 * @return {YAHOO.widget.Record} Record instance.
 */
YAHOO.widget.DataTable.prototype.getRecord = function(row) {
    var nRecordIndex;
    
    // By element reference or ID string
    if(!YAHOO.lang.isNumber(row)) {
        // Validate TR element
        var elRow = this.getTrEl(row);
        if(elRow) {
            nRecordIndex = this.getRecordIndex(elRow);
        }
    }
    // By Record index
    if(YAHOO.lang.isNumber(nRecordIndex)) {
        return this._oRecordSet.getRecord(nRecordIndex);
    }
    else {
        YAHOO.log("Could not get Record for row " + row, "warn", this.toString());
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
        var nTrIndex = this.getTrIndex(oRecord);
        
        // Not paginated, so insert a new TR element
        if(!this.isPaginated()) {
            var newRowId = this._addTrEl(oRecord, nTrIndex);
            if(newRowId) {
                // Is this an insert or an append?
                var append = (YAHOO.lang.isNumber(nTrIndex) && (nTrIndex > -1)
                        && (nTrIndex < this._elTbody.rows.length)) ? false : true;

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
                else if(YAHOO.lang.isNumber(index) && (nTrIndex === 0)) {
                    this._setFirstRow();
                }
            }
        }
        // Paginated and Record is in view, so refresh the table to keep pagination state
        else if(nTrIndex !== null) {
            this.refreshTable();
        }
        // Paginated but Record is not in view so just update pagination UI
        else {
            this.updatePaginator();
        }
        
        // TODO: what args to pass?
        this.fireEvent("rowAddEvent", {data:oData, trElId:newRowId});
        
        // For log message
        if(nTrIndex === null) {
            nTrIndex = "n/a";
        }
        YAHOO.log("DataTable row added: Record ID = " + oRecord.getId() +
                ", Record index = " + this.getRecordIndex(oRecord) +
                ", page row index = " + nTrIndex, "info", this.toString());
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
    var oldRecord, updatedRecord, elRow;

    // Get the Record directly
    if((row instanceof YAHOO.widget.Record) || (YAHOO.lang.isNumber(row))) {
            // Get the Record directly
            oldRecord = this._oRecordSet.getRecord(row);
            
            // Is this row in view?
            elRow = this.getTrEl(oldRecord);
    }
    // Get the Record by TR element
    else {
        elRow = this.getTrEl(row);
        if(elRow) {
            oldRecord = this._oRecordSet.getRecord(this.getRecordIndex(elRow));
        }
    }

    // Update the Record
    if(oldRecord) {
        // Copy data from the Record for the event that gets fired later
        var oRecordData = oldRecord.getData();
        var oldData = {};
        for(var key in oRecordData) {
            oldData[key] = oRecordData[key];
        }

        updatedRecord = this._oRecordSet.updateRecord(oldRecord, oData);
    }
    else {
        YAHOO.log("Could not update row " + row + " with the data : " +
                YAHOO.widget.Logger.dump(oData), "error", this.toString());
        return;

    }
    
    // Update the TR only if row is in view
    if(elRow !== null) {
        this._updateTrEl(elRow, updatedRecord);
    }

    //TODO: Event passes TR ID old data, new data.
    this.fireEvent("rowUpdateEvent", {newData:oData, oldData:oldData, elRow:elRow});
    YAHOO.log("DataTable row updated: Record ID = " + updatedRecord.getId() +
            ", Record index = " + this.getRecordIndex(updatedRecord) +
            ", page row index = " + this.getTrIndex(updatedRecord), "info", this.toString());
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
        var oRecord = this._oRecordSet.getRecord(nRecordIndex);
        if(oRecord) {
            var nRecordId = oRecord.getId();
            
            // Remove from selection tracker if there
            var tracker = this._aSelections || [];
            for(var j=0; j<tracker.length; j++) {
                if((YAHOO.lang.isNumber(tracker[j]) && (tracker[j] === nRecordId)) ||
                        ((tracker[j].constructor == Object) && (tracker[j].recordId === nRecordId))) {
                    tracker.splice(j,1);
                }
            }

            // Copy data from the Record for the event that gets fired later
            var oRecordData = oRecord.getData();
            var oData = {};
            for(var key in oRecordData) {
                oData[key] = oRecordData[key];
            }

            // Delete Record from RecordSet
            this._oRecordSet.deleteRecord(nRecordIndex);

            // If row is in view, delete the TR element
            var nTrIndex = this.getTrIndex(nRecordIndex);
            if(YAHOO.lang.isNumber(nTrIndex)) {
                this._deleteTrEl(nTrIndex);

                //TODO: doesn't need to be called every time
                // Set first-row and last-row trackers
                this._setFirstRow();
                this._setLastRow();
            }

            this.fireEvent("rowDeleteEvent", {recordIndex:nRecordIndex,
                    recordData:oData, nTrIndex:nTrIndex});
            YAHOO.log("DataTable row deleted: Record ID = " + nRecordId +
                    ", Record index = " + nRecordIndex +
                    ", page row index = " + nTrIndex, "info", this.toString());
        }
    }
    else {
        YAHOO.log("Could not delete row: " + row, "warn", this.toString());
    }
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
 * Initializes a RecordSet with the given data and populates the page view
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
    // Clean up previous RecordSet, if any
    if(this._oRecordSet) {
        this._oRecordSet.unsubscribeAll();
    }
    
    // Create RecordSet
    this._oRecordSet = new YAHOO.widget.RecordSet();

    // Add data to RecordSet
    var records = this._oRecordSet.addRecords(oData);
    
    //TODO: clear selection tracker, clear sorts
    
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
    var i, j, aRecords;
    
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

        // Keep track of selected rows
        var aSelectedRows = this.getSelectedRows();
        
        // Keep track of selected cells
        var aSelectedCells = this.getSelectedCells();

        // Unselect TR elements in the UI
        if(aSelectedRows.length > 0) {
            this._unselectAllTrEls();
        }

        // Unselect TD elements in the UI
        if(aSelectedCells.length > 0) {
            this._unselectAllTdEls();
        }


        // From the top, update in-place existing rows
        for(i=0; i<elRows.length; i++) {
            this._updateTrEl(elRows[i], aRecords[i]);
        }

        // Add TR elements as necessary
        for(i=elRows.length; i<aRecords.length; i++) {
            this._addTrEl(aRecords[i]);
        }

        // Re-select any TR or TD elements as necessary
        var allSelections = aSelectedRows.concat(aSelectedCells);
        var allRows = elTbody.rows;
        for(i=0; i<allSelections.length; i++) {
            for(j=0; j<allRows.length; j++) {
                var thisRow = allRows[j];
                if(allSelections[i] === thisRow.yuiRecordId) {
                    YAHOO.util.Dom.addClass(thisRow, YAHOO.widget.DataTable.CLASS_SELECTED);
                }
                else if(allSelections[i].recordId === thisRow.yuiRecordId) {
                    for(var k=0; k<thisRow.cells.length; k++) {
                        if(thisRow.cells[k].yuiColumnId === allSelections[i].columnId) {
                            YAHOO.util.Dom.addClass(thisRow.cells[k], YAHOO.widget.DataTable.CLASS_SELECTED);
                        }
                    }
                }
            }
        }

        // Set classes
        this._setFirstRow();
        this._setLastRow();
        this._setRowStripes();

        this.fireEvent("tableRefreshEvent", {records:aRecords});

        YAHOO.log("DataTable showing " + aRecords.length + " of " + this._oRecordSet.getLength() + " rows", "info", this.toString());
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
    var instanceName = this.toString();
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

    YAHOO.log("DataTable destroyed: " + instanceName);
};

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
            " <span class=\"" + YAHOO.widget.DataTable.CLASS_DISABLED + "\">&lt;&lt;</span> " :
            " <a href=\"#\" class=\"" + YAHOO.widget.DataTable.CLASS_FIRST + "\">&lt;&lt;</a> ";
    var prevPageLink = (isFirstPage) ?
            " <span class=\"" + YAHOO.widget.DataTable.CLASS_DISABLED + "\">&lt;</span> " :
            " <a href=\"#\" class=\"" + YAHOO.widget.DataTable.CLASS_PREVIOUS + "\">&lt;</a> " ;
    var nextPageLink = (isLastPage) ?
            " <span class=\"" + YAHOO.widget.DataTable.CLASS_DISABLED + "\">&gt;</span> " :
            " <a href=\"#\" class=\"" + YAHOO.widget.DataTable.CLASS_NEXT + "\">&gt;</a> " ;
    var lastPageLink = (isLastPage) ?
            " <span class=\"" + YAHOO.widget.DataTable.CLASS_DISABLED + "\">&gt;&gt;</span> " :
            " <a href=\"#\" class=\"" + YAHOO.widget.DataTable.CLASS_LAST + "\">&gt;&gt;</a> ";
    var markup = firstPageLink + prevPageLink;
    var maxLinks = (nPageLinksStart+nPageLinksLength < nTotalPages) ?
        nPageLinksStart+nPageLinksLength-1 : nTotalPages;
    // Special case for pageLinksLength 0 => show all links
    if(nPageLinksLength === 0) {
        maxLinks = nTotalPages;
    }
    for(var i=nPageLinksStart; i<=maxLinks; i++) {
         if(i != nCurrentPage) {
            markup += " <a href=\"#\" class=\"" + YAHOO.widget.DataTable.CLASS_NUMBER + "\">" + i + "</a> ";
        }
        else {
            markup += " <span class=\"" + YAHOO.widget.DataTable.CLASS_SELECTED + "\">" + i + "</span>";
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

    this.fireEvent("paginatorUpdateEvent", {paginator:this._paginator});
    YAHOO.log("Paginator updated: " +
            YAHOO.widget.Logger.dump(this._paginator), "info", this.toString());
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
            YAHOO.log("DataTable sorted on Column key = \"" + oColumn.key +
                    "\", direction = \"" + sortDir + "\"", "info", this.toString());
            
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














































// SELECTION/HIGHLIGHTING

/**
 * Object literal of initial configuration values for selection model. By default
 * row and cell selection is disabled.
 *
 * @property selectionOptions
 * @type Object
 * @default null
 */
/**
 * Enable selection by cell with the value true, otherwise selections are by row.
 *
 * @property selectionModel.cellMode
 * @type Boolean
 */
/**
 * Name of the custom event that triggers selection. For example, to enable
 * cell selection by a mouse click, set this value to "cellClickEvent". To enable
 * row selection by a mouse dblclick, set this value to "rowDblclickEvent".
 *
 * @property selectionModel.eventName
 * @type String
 */
/**
 * Enable multiple selections via shift and control key modifiers.
 *
 * @property selectionModel.enableMulti
 * @type Boolean
 */
/**
 * Selection by arrows should wrap around to first row or cell when last row or
 * cell is reached.
 *
 * @property selectionModel.enableWraparound
 * @type Boolean
 */
YAHOO.widget.DataTable.prototype.selectionModel = null;

/**
 * Array of selections: {recordId:nRecordId, cellIndex:nCellIndex}
 *
 * @property _aSelections
 * @type Object[]
 * @private
 */
YAHOO.widget.DataTable.prototype._aSelections = null;

/**
 * ID string of the selection anchor element.
 *
 * @property _sSelectionAnchorId
 * @type String
 * @private
 */
YAHOO.widget.DataTable.prototype._sSelectionAnchorId = null;

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
 * @param row {HTMLElement | String} HTML element reference or ID.
 */
YAHOO.widget.DataTable.prototype.selectRow = function(row) {
    // Validate the row
    var elRow = this.getTrEl(row);
    if(elRow) {
        var oRecord = this.getRecord(elRow);
        if(oRecord) {
            // Get Record ID
            var tracker = this._aSelections || [];
            var id = oRecord.getId();
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

            // Update trackers
            this._lastSelectedId = elRow.id;
            if(!this._sSelectionAnchorId) {
                this._sSelectionAnchorId = elRow.id;
            }
            this._aSelections = tracker;
        
            // Update UI
            YAHOO.util.Dom.addClass(elRow, YAHOO.widget.DataTable.CLASS_SELECTED);

            this.fireEvent("selectEvent", {record:oRecord, el:elRow});
            YAHOO.log("DataTable row selected " + row, "info", this.toString());

            return;
        }
    }
    YAHOO.log("Could not select " + row, "warn", this.toString());
};

/**
 * Sets given row to the unselected state.
 *
 * @method unselectRow
 * @param row {HTMLElement | String} HTML TR element reference or ID.
 */
YAHOO.widget.DataTable.prototype.unselectRow = function(row) {
    // Validate the row
    var elRow = this.getTrEl(row);
    if(elRow) {
        var oRecord = this.getRecord(elRow);
        if(oRecord) {
            // Get Record ID
            var tracker = this._aSelections || [];
            var id = oRecord.getId();

            // Remove if there
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

            // Update tracker
            this._aSelections = tracker;

            // Update the UI
            YAHOO.util.Dom.removeClass(elRow, YAHOO.widget.DataTable.CLASS_SELECTED);

            this.fireEvent("unselectRowEvent", {record:oRecord, el:elRow});
            YAHOO.log("DataTable row unselected " + row, "info", this.toString());

            return;
        }
    }
    YAHOO.log("Could not unselect row " + row, "warn", this.toString());
};

/**
 * Clears out all row selections.
 *
 * @method unselectAllRows
 */
YAHOO.widget.DataTable.prototype.unselectAllRows = function() {
    // Remove from tracker
    var tracker = this._aSelections || [];
    for(var j=0; j<tracker.length; j++) {
       if(YAHOO.lang.isNumber(tracker[j])){
            tracker.splice(j,1);
        }
    }

    // Update tracker
    this._aSelections = tracker;

    // Update UI
    this._unselectAllTrEls();

    this.fireEvent("unselectAllRowsEvent");
    YAHOO.log("All row selections were cleared", "info", this.toString());
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
    var elCell = this.getTdEl(cell);
    
    if(elCell) {
        var oRecord = this.getRecord(elCell);
        var sColumnId = elCell.yuiColumnId;

        if(oRecord && sColumnId) {
            // Get Record ID
            var tracker = this._aSelections || [];
            var id = oRecord.getId();

            // Remove if there
            for(var j=0; j<tracker.length; j++) {
               if((tracker[j].recordId === id) && (tracker[j].columnId === sColumnId)){
                    tracker.splice(j,1);
                }
            }

            // Add to the end
            tracker.push({recordId:id, columnId:sColumnId});

            // Update trackers
            this._aSelections = tracker;
            this._lastSelectedId = elCell.id;
            if(!this._sSelectionAnchorId) {
                this._sSelectionAnchorId = elRow.id;
            }

            // Update the UI
            YAHOO.util.Dom.addClass(elCell, YAHOO.widget.DataTable.CLASS_SELECTED);

            this.fireEvent("selectCellEvent", {record:oRecord,
                    key: this._oColumnSet.getColumn(sColumnId).key, el:elCell});
            YAHOO.log("DataTable selected cell " + cell, "info", this.toString());

            return;
        }
    }
    YAHOO.log("Could not select " + item, "warn", this.toString());
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

            // Remove if there
            if((tracker[j].recordId === id) && (tracker[j].columnId === sColumnId)){
               if(tracker[j].recordId === id){
                    tracker.splice(j,1);
                }
            }

            // Update tracker
            this._aSelections = tracker;

            // Update the UI
            YAHOO.util.Dom.removeClass(elCell, YAHOO.widget.DataTable.CLASS_SELECTED);

            this.fireEvent("unselectCellEvent", {record:oRecord,
                    key:this._oColumnSet.getColumn(sColumnId).key, el:elCell});
            YAHOO.log("DataTable unselected cell " + cell, "info", this.toString());

            return;
        }
    }
    YAHOO.log("Could not unselect " + item, "warn", this.toString());
};

/**
 * Clears out all cell selections.
 *
 * @method unselectAllCells
 */
YAHOO.widget.DataTable.prototype.unselectAllCells= function() {
    // Remove from tracker
    var tracker = this._aSelections || [];
    for(var j=0; j<tracker.length; j++) {
       if(tracker[j].constructor == Object){
            tracker.splice(j,1);
        }
    }

    // Update tracker
    this._aSelections = tracker;

    // Update UI
    this._unselectAllTdEls();
    
    this.fireEvent("unselectAllCellsEvent");
    YAHOO.log("All cell selections were cleared", "info", this.toString());
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
 * Returns selected rows as an array of Record IDs.
 *
 * @method getSelectedRows
 * @return {HTMLElement[]} Array of selected TR elements.
 */
YAHOO.widget.DataTable.prototype.getSelectedRows = function() {
    var aSelectedRows = [];
    var tracker = this._aSelections || [];
    for(var j=0; j<tracker.length; j++) {
       if(YAHOO.lang.isNumber(tracker[j])){
            aSelectedRows.push(tracker[j]);
        }
    }
    return aSelectedRows;
};

/**
 * Returns selected cells as an array of object literals:
 *     {recordId:nRecordID, columnId:sColumnId}.
 *
 * @method getSelectedRows
 * @return {HTMLElement[]} Array of selected TR elements.
 */
YAHOO.widget.DataTable.prototype.getSelectedCells = function() {
    var aSelectedCells = [];
    var tracker = this._aSelections || [];
    for(var j=0; j<tracker.length; j++) {
       if(tracker[j] && (tracker[j].constructor == Object)){
            aSelectedCells.push({recordId:tracker[j].recordId, columnId:tracker[j].columnId});
        }
    }
    return aSelectedCells;
};









/**
 * Assigns the class YAHOO.widget.DataTable.CLASS_HIGHLIGHTED to the given element(s).
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
        YAHOO.util.Dom.addClass(els,YAHOO.widget.DataTable.CLASS_HIGHLIGHTED);
        this.fireEvent("highlightEvent",{els:els});
        //TODO
        //YAHOO.log();
    }
};

/**
 * Removes the class YAHOO.widget.DataTable.CLASS_HIGHLIGHTED from the given element(s).
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
        YAHOO.util.Dom.removeClass(els,YAHOO.widget.DataTable.CLASS_HIGHLIGHTED);
        this.fireEvent("unhighlightEvent",{els:els});
        //TODO
        //YAHOO.log();
    }
};












































// INLINE EDITING

/**
 * Shows editor for given cell.
 *
 * @method editCell
 * @param elCell {HTMLElement} Cell element to edit.
 */
YAHOO.widget.DataTable.prototype.editCell = function(elCell) {
    if(elCell && YAHOO.lang.isString(elCell.yuiColumnId)) {
        var column = this._oColumnSet.getColumn(elCell.yuiColumnId);
        if(column && column.editor) {
            this.activeEditor = column.getEditor(elCell,this.getRecord(elCell));
            this._bFocused = true;
            if(this.activeEditor) {
                // Explicitly call unhighlight for SF2
                if(YAHOO.util.Dom.hasClass(elCell, YAHOO.widget.DataTable.CLASS_HIGHLIGHTED)) {
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
            // Update Record data
            this._oRecordSet.updateKey(oRecord,oColumn.key,newValue);

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
        //TODO
        //YAHOO.log();
    }
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
 * Handles "editorKeydownEvent".
 *
 * @method onEditorKeydown
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {YAHOO.widget.ColumnEditor} Active editor.
 */
YAHOO.widget.DataTable.prototype.onEditorKeydown = function(oArgs) {
    var e = oArgs.event;
    var editor = oArgs.target;
    var elTarget = YAHOO.util.Event.getTarget(e);

    // Special keys drive interaction with the active editor.
    // esc Clears active editor
    if((e.keyCode == 27)) {
        this.cancelEditorData();
    }
    // enter Saves active editor data
    /*if(e.keyCode == 13) {
        // Only if we are not in a text area
        YAHOO.util.Event.stopEvent(oArgs.event);
        this.saveEditorData();
    }*/
};

/**
 * Overridable custom event handler to sort Column.
 *
 * @method onEventSortColumn
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 */
YAHOO.widget.DataTable.prototype.onEventSortColumn = function(oArgs) {
//TODO: support nested header column sorting
    var evt = oArgs.event;
    var target = oArgs.target;
    YAHOO.util.Event.stopEvent(evt);
    
    var el = this.getThEl(target) || this.getTdEl(target);
    if(el && YAHOO.lang.isString(el.yuiColumnId)) {
        this.sortColumn(this._oColumnSet.getColumn(el.yuiColumnId));
    }
    else {
        YAHOO.log("Could not sort column " + target, "warn", this.toString());
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
    var bSingleSelect = this.selectionModel && !this.selectionModel.enableMulti;
    var bSHIFT = evt.shiftKey;
    var bCTRL = evt.ctrlKey;
    var i, nAnchorIndex;

    var elRow = this.getTrEl(elTarget);
    if(elRow) {
        var allRows = this._elTbody.rows;
        var nTargetIndex = elRow.sectionRowIndex;
        var elAnchor = YAHOO.util.Dom.get(this._sSelectionAnchorId);
        
        /*// Traverse up the DOM to find the row
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
        
        var anchorIndex;
        var targetIndex = elTarget.sectionRowIndex;*/

        // Both SHIFT and CTRL
        if(!bSingleSelect && bSHIFT && bCTRL) {
            // Validate anchor
            if(elAnchor) {
                nAnchorIndex = elAnchor.sectionRowIndex;
                if(this.isSelected(elAnchor)) {
                    // Select all rows between anchor and target, inclusive
                    if(nAnchorIndex < nTargetIndex) {
                        for(i=nAnchorIndex+1; i<=nTargetIndex; i++) {
                            if(!this.isSelected(allRows[i])) {
                                this.selectRow(allRows[i]);
                            }
                        }
                    }
                    // Select all rows from target to anchor, inclusive
                    else {
                        for(i=nTargetIndex; i<=nAnchorIndex-1; i++) {
                            if(!this.isSelected(allRows[i])) {
                                this.selectRow(allRows[i]);
                            }
                        }
                    }
                }
                else {
                    // Unselect all rows between anchor row and target row
                    if(nAnchorIndex < nTargetIndex) {
                        for(i=nAnchorIndex+1; i<=nTargetIndex-1; i++) {
                            if(this.isSelected(allRows[i])) {
                                this.unselectRow(allRows[i]);
                            }
                        }
                    }
                    // Select from target to anchor
                    else {
                        for(i=nTargetIndex+1; i<=nAnchorIndex-1; i++) {
                            if(this.isSelected(allRows[i])) {
                                this.unselectRow(allRows[i]);
                            }
                        }
                    }
                    this.selectRow(elRow);
                }
            }
            // Invalid anchor
            else {
                // Set anchor
                this._sSelectionAnchorId = elRow.id;

                // Toggle selection of target
                if(this.isSelected(elRow)) {
                    this.unselectRow(elRow);
                }
                else {
                    this.selectRow(elRow);
                }
            }
        }
        // Only SHIFT
        else if(!bSingleSelect && bSHIFT) {
            this.unselectAllRows();

            // Validate anchor
            if(elAnchor) {
                nAnchorIndex = elAnchor.sectionRowIndex;

                // Select all rows between anchor and target, inclusive
                if(nAnchorIndex < nTargetIndex) {
                    for(i=nAnchorIndex; i<=nTargetIndex; i++) {
                        this.selectRow(allRows[i]);
                    }
                }
                // Select all rows from target to anchor
                else {
                    for(i=nTargetIndex; i<=nAnchorIndex; i++) {
                        this.selectRow(allRows[i]);
                    }
                }
            }
            // Invalid anchor
            else {
                // Set anchor
                this._sSelectionAnchorId = elRow.id;

                // Select target only
                this.selectRow(elRow);
            }
        }
        // Only CTRL
        else if(!bSingleSelect && bCTRL) {
            // Set anchor
            this._sSelectionAnchorId = elRow.id;

            // Toggle selection of target
            if(this.isSelected(elRow)) {
                this.unselectRow(elRow);
            }
            else {
                this.selectRow(elRow);
            }
        }
        // Neither SHIFT nor CTRL
        else if(bSingleSelect) {
            this.unselectAllRows();
            this.selectRow(elRow);
        }
        // Neither SHIFT nor CTRL
        else {
            // Set anchor
            this._sSelectionAnchorId = elRow.id;

            // Select only target
            this.unselectAllRows();
            this.selectRow(elRow);
        }
        YAHOO.util.Event.stopEvent(evt);
    }
    else {
        YAHOO.log("Could not select row " + elTarget, "warn", this.toString());
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
    var elTarget = oArgs.target;
    var bSingleSelect = this.selectionModel && !this.selectionModel.enableMulti;
    var bSHIFT = evt.shiftKey;
    var bCTRL = evt.ctrlKey;
    var i, nAchorRowIndex, nAnchorCellIndex;
    
    var elCell = this.getTdEl(elTarget);
    if(elCell) {
        var elRow = this.getTrEl(elCell);
        var allRows = this._elTbody.rows;
        var nTargetRowIndex = elRow.sectionRowIndex;
        var elAnchor = YAHOO.util.Dom.get(this._sSelectionAnchorId);

        // Both SHIFT and CTRL
        if(!bSingleSelect && bSHIFT && bCTRL) {
            // Validate anchor
            if(elAnchor) {
                nAnchorRowIndex = elAnchor.parentNode.sectionRowIndex;
                nAnchorCellIndex = elAnchor.cellIndex;
                
                if(this.isSelected(elAnchor)) {
                    //TODO: cell logic
                                // Select all rows between anchor and target, inclusive
                                if(nAnchorRowIndex < nTargetRowIndex) {
                                    for(i=nAnchorRowIndex+1; i<=nTargetRowIndex; i++) {
                                        if(!this.isSelected(allRows[i])) {
                                            this.selectRow(allRows[i]);
                                        }
                                    }
                                }
                                // Select all rows from target to anchor, inclusive
                                else {
                                    for(i=nTargetRowIndex; i<=nAnchorRowIndex-1; i++) {
                                        if(!this.isSelected(allRows[i])) {
                                            this.selectRow(allRows[i]);
                                        }
                                    }
                                }
                }
                else {
                    //TODO: cell logic
                                // Unselect all rows between anchor row and target row
                                if(nAnchorRowIndex < nTargetRowIndex) {
                                    for(i=nAnchorRowIndex+1; i<=nTargetRowIndex-1; i++) {
                                        if(this.isSelected(allRows[i])) {
                                            this.unselectCell(allRows[i]);
                                        }
                                    }
                                }
                                // Select from target to anchor
                                else {
                                    for(i=nTargetRowIndex+1; i<=nAnchorRowIndex-1; i++) {
                                        if(this.isSelected(allRows[i])) {
                                            this.unselectCell(allRows[i]);
                                        }
                                    }
                                }
                    this.selectCell(elCell);
                }
            }
            // Invalid anchor
            else {
                // Set anchor
                this._sSelectionAnchorId = elCell.id;

                // Toggle selection of target
                if(this.isSelected(elCell)) {
                    this.unselectCell(elCell);
                }
                else {
                    this.selectCell(elCell);
                }
            }
        }
        // Only SHIFT
        else if(!bSingleSelect && bSHIFT) {
            this.unselectAllCells();

            // Validate anchor
            if(elAnchor) {
                nAnchorRowIndex = elAnchor.parentNode.sectionRowIndex;
                nAnchorCellIndex = elAnchor.cellIndex;

                //TODO: Cell logic
                            // Select all cells between anchor and target, inclusive
                            if(nAnchorRowIndex < nTargetRowIndex) {
                                for(i=nAnchorRowIndex; i<=nTargetRowIndex; i++) {
                                    this.selectRow(allRows[i]);
                                }
                            }
                            // Select all rows from target to anchor
                            else {
                                for(i=nTargetRowIndex; i<=nAnchorRowIndex; i++) {
                                    this.selectRow(allRows[i]);
                                }
                            }
            }
            // Invalid anchor
            else {
                // Set anchor
                this._sSelectionAnchorId = elCell.id;

                // Select target only
                this.selectCell(elCell);
            }
        }
        // Only CTRL
        else if(!bSingleSelect && bCTRL) {
            // Set anchor
            this._sSelectionAnchorId = elCell.id;

            // Toggle selection of target
            if(this.isSelected(elCell)) {
                this.unselectCell(elCell);
            }
            else {
                this.selectCell(elCell);
            }
        }
        // Multi-selection has been disabled
        /*else if(bSingleSelect) {
            this.unselectCell(this._lastSelectedId);
            this.selectCell(elCell);
        }*/
        // Neither SHIFT nor CTRL or multi-selection has been disabled
        else {
            // Set anchor
            this._sSelectionAnchorId = elCell.id;

            // Select only target
            this.unselectAllCells();
            this.selectCell(elCell);
        }

        YAHOO.util.Event.stopEvent(evt);

        // Clear any selections that are a byproduct of the dblclick
        var sel;
        if(window.getSelection) { // doesn't work for opera -- try removeallranges?
        	sel = window.getSelection();
        }
         if(document.getSelection) {// works for opera but w/a context menu -- try removeallranges?
        	sel = document.getSelection();
        }
        else if(document.selection) {
        	sel = document.selection;
        }
        if(sel) {
            if(sel.empty) {
                sel.empty();
            }
            else if(sel.collapse) {
                sel.collapse();
            }
        }

    }
    else {
        YAHOO.log("Could not select cell " + elTarget, "warn", this.toString());
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

    var elCell = this.getTdEl(target);
    if(elCell && YAHOO.lang.isString(elCell.yuiColumnId)) {
        var oColumn = this._oColumnSet.getColumn(elCell.yuiColumnId);
        oColumn.format(elCell, this.getRecord(elCell));
    }
    else {
        YAHOO.log("Could not format cell " + target, "warn", this.toString());
    }
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

    var elCell = this.getTdEl(target);
    if(elCell) {
        this.highlight(elCell);
    }
    else {
        YAHOO.log("Could not highlight cell " + target, "warn", this.toString());
    }
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

    var elCell = this.getTdEl(target);
    if(elCell) {
        this.unhighlight(elCell);
    }
    else {
        YAHOO.log("Could not unhighlight cell " + target, "warn", this.toString());
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
    var elTag = target.tagName.toLowerCase();

    var elCell = this.getTdEl(target);
    if(elCell) {
        this.editCell(target);
    }
    else {
        YAHOO.log("Could not edit cell " + target, "warn", this.toString());
    }
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
