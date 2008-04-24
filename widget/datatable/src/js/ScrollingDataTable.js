(function () {

var lang   = YAHOO.lang,
    util   = YAHOO.util,
    widget = YAHOO.widget,
    ua     = YAHOO.env.ua,
    
    Dom    = util.Dom,
    Ev     = util.Event,
    DS     = util.DataSourceBase,
    DT     = widget.DataTable,
    Pag    = widget.Paginator;
    
/**
 * The ScrollingDataTable class extends the DataTable class to provide
 * functionality for x-scrolling, y-scrolling, and xy-scrolling.
 *
 * @namespace YAHOO.widget
 * @class ScrollingDataTable
 * @extends YAHOO.widget.DataTable
 * @constructor
 * @param elContainer {HTMLElement} Container element for the TABLE.
 * @param aColumnDefs {Object[]} Array of object literal Column definitions.
 * @param oDataSource {YAHOO.util.DataSource} DataSource instance.
 * @param oConfigs {object} (optional) Object literal of configuration values.
 */
widget.ScrollingDataTable = function(elContainer,aColumnDefs,oDataSource,oConfigs) {
    oConfigs = oConfigs || {};
    
    // Prevent infinite loop
    if(oConfigs.scrollable) {
        oConfigs.scrollable = false;
    }

    widget.ScrollingDataTable.superclass.constructor.call(this, elContainer,aColumnDefs,oDataSource,oConfigs); 

    this._oChainSync = new YAHOO.util.Chain();
    this._oChainRender.subscribe("end",this._sync, this, true);

};

var SDT = widget.ScrollingDataTable;

/////////////////////////////////////////////////////////////////////////////
//
// Public constants
//
/////////////////////////////////////////////////////////////////////////////
lang.augmentObject(SDT, {

    /**
     * Class name assigned to inner DataTable header container.
     *
     * @property DataTable.CLASS_HEADER
     * @type String
     * @static
     * @final
     * @default "yui-dt-hd"
     */
    CLASS_HEADER : "yui-dt-hd",
    
    /**
     * Class name assigned to inner DataTable body container.
     *
     * @property DataTable.CLASS_BODY
     * @type String
     * @static
     * @final
     * @default "yui-dt-bd"
     */
    CLASS_BODY : "yui-dt-bd"
});

lang.extend(SDT, DT, {

/**
 * Container for fixed header TABLE element.
 *
 * @property _elHdContainer
 * @type HTMLElement
 * @private
 */
_elHdContainer : null,

/**
 * Container for scrolling body TABLE element.
 *
 * @property _elBdContainer
 * @type HTMLElement
 * @private
 */
_elBdContainer : null,

/**
 * Body COLGROUP element.
 *
 * @property _elBdColgroup
 * @type HTMLElement
 * @private
 */
_elBdColgroup : null,

/**
 * Body THEAD element.
 *
 * @property _elBdThead
 * @type HTMLElement
 * @private
 */
_elBdThead : null,

/**
 * Sync chain.
 *
 * @property _oChainSync
 * @type YAHOO.util.Chain
 * @private
 */
_oChainSync : null,

/**
 * True if x-scrollbar is currently visible.
 * @property _bScrollbarX
 * @type Boolean
 * @private 
 */
_bScrollbarX : null,















/////////////////////////////////////////////////////////////////////////////
//
// Superclass methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Implementation of Element's abstract method. Sets up config values.
 *
 * @method initAttributes
 * @param oConfigs {Object} (Optional) Object literal definition of configuration values.
 * @private
 */

initAttributes : function(oConfigs) {
    oConfigs = oConfigs || {};
    SDT.superclass.initAttributes.call(this, oConfigs);



    /**
    * @attribute width
    * @description Table width for scrollable tables
    * @type String
    */
    this.setAttributeConfig("width", {
        value: null,
        validator: lang.isString,
        method: function(oParam) {
            this._elHdContainer.style.width = oParam;
            this._elBdContainer.style.width = oParam;            
        }
    });

    /**
    * @attribute height
    * @description Table height for scrollable tables
    * @type String
    */
    this.setAttributeConfig("height", {
        value: null,
        validator: lang.isString,
        method: function(oParam) {
            this._elBdContainer.style.height = oParam;       
        }
    });
},

/**
 * Initializes DOM elements for a ScrollingDataTable, including creation of
 * two separate TABLE elements.
 *
 * @method _initDomElements
 * @param elContainer {HTMLElement | String} HTML DIV element by reference or ID. 
 * return {Boolean} False in case of error, otherwise true 
 * @private
 */
_initDomElements : function(elContainer) {
    // Outer and inner containers
    var allContainers = this._initContainerEl(elContainer);
    if(allContainers) {
        // TABLEs
        this._initTableEl(allContainers);
        
        // COLGROUPs
        this._initColgroupEl(this._elHdTable, this._elTable);        
        
        // THEADs
        this._initTheadEl(this._elHdTable, this._elTable);                
        
        // Primary TBODY
        this._elTbody = this._initTbodyEl(this._elTable);
        // Message TBODY
        this._elMsgTbody = this._initMsgTbodyEl(this._elTable);
        
        // Column helpers
        this._initColumnHelpers(this._elThead);
    }
    if(!this._elContainer || !this._elTable || !this._elColgroup ||  !this._elThead || !this._elTbody || !this._elMsgTbody ||
            !this._elHdTable || !this._elBdColgroup || !this._elBdThead) {
        YAHOO.log("Could not instantiate DataTable due to an invalid DOM elements", "error", this.toString());
        return false;
    }
    else {
        return true;
    }
},

/**
 * Destroy's the DataTable outer and inner container elements, if available.
 *
 * @method _destroyContainerEl
 * @private
 */
_destroyContainerEl : function() {
    SDT.superclass._destroyContainerEl.call(this);
    this._elHdContainer = null;
    this._elBdContainer = null;
},

/**
 * Initializes the DataTable outer container element and creates inner header
 * and body container elements.
 *
 * @method _initContainerEl
 * @param elContainer {HTMLElement | String} HTML DIV element by reference or ID.
 * @private
 */
_initContainerEl : function(elContainer) {
    elContainer = SDT.superclass._initContainerEl.call(this, elContainer);
    
    if(elContainer) {
        Dom.addClass(elContainer, DT.CLASS_SCROLLABLE);
        this._elContainer = elContainer;
        
        // Container for header TABLE
        var elHdContainer = elContainer.appendChild(document.createElement("div"));
        Dom.addClass(elHdContainer, SDT.CLASS_HEADER);
        this._elHdContainer = elHdContainer;
    
        // Container for body TABLE
        var elBdContainer = elContainer.appendChild(document.createElement("div"));
        Dom.addClass(elBdContainer, SDT.CLASS_BODY);
        Ev.addListener(elBdContainer, "scroll", this._onScroll, this); // to sync horiz scroll headers
        this._elBdContainer = elBdContainer;
        
        return [elContainer, elHdContainer, elBdContainer];
    }
},

/**
 * Initializes ScrollingDataTable TABLE elements into the two inner containers.
 *
 * @method _initTableEl
 * @private
 */
_initTableEl : function(allContainers) {
    if(allContainers) {
        // Head TABLE
        this._destroyHdTableEl();
        this._elHdTable = this._baseInitTableEl(allContainers[1]);
        // Body TABLE
        this._elTable = this._baseInitTableEl(allContainers[2]);  
    }
},

/**
 * Destroy's the DataTable head TABLE element, if available.
 *
 * @method _destroyHdTableEl
 * @private
 */
_destroyHdTableEl : function() {
    var elTable = this._elHdTable;
    if(elTable) {
        Ev.purgeElement(elTable, true);
        elTable.parentNode.removeChild(elTable);
        
        // A little out of place, but where else can we null out these extra elements?
        this._elBdColgroup = null;
        this._elBdThead = null;
    }
},

/**
 * Initializes ScrollingDataTable COLGROUP elements into the two TABLEs.
 *
 * @method _initColgroupEl
 * @private
 */
_initColgroupEl : function(elHdTable, elBdTable) {
    // Scrolling body COLGROUP
    this._destroyBdColgroupEl();
    this._elBdColgroup = this._baseInitColgroupEl(elBdTable);
    // Standard head COLGROUP
    this._elColgroup = this._baseInitColgroupEl(elHdTable);
},

/**
 * Destroy's the DataTable head COLGROUP element, if available.
 *
 * @method _destroyBdColgroupEl
 * @private
 */
_destroyBdColgroupEl : function() {
    var elColgroup = this._elBdColgroup;
    if(elColgroup) {
        var elTable = elColgroup.parentNode;
        Ev.purgeElement(elColgroup, true);
        elTable.removeChild(elColgroup);
        this._elBdColgroup = null;
    }
},

/**
 * Initializes ScrollingDataTable THEAD elements into the two inner containers.
 *
 * @method _initTheadEl
 * @private
 */
_initTheadEl : function(elHdTable, elBdTable) {
    // Scrolling body THEAD
    this._destroyBdTheadEl();
    this._elBdThead = this._initBdTheadEl(elBdTable);
    // Standard head THEAD
    this._elThead = this._baseInitTheadEl(elHdTable);        
},

/**
 * Destroy's the DataTable body THEAD element, if available.
 *
 * @method _destroyBdTheadEl
 * @private
 */
_destroyBdTheadEl : function() {
    var elThead = this._elThead;
    if(elThead) {
        var elTable = elThead.parentNode;
        Ev.purgeElement(elThead, true);
        elTable.removeChild(elThead);
        this._elThead = null;

        this._destroyColumnHelpers();
    }
},

/**
 * Initializes body THEAD element.
 *
 * @method _initBdTheadEl
 * @param elTable {HTMLElement} TABLE element into which to create COLGROUP.
 * @return {HTMLElement} Initialized THEAD element. 
 * @private
 */
_initBdTheadEl : function(elTable) {
    if(elTable) {
        // Destroy previous
        this._destroyBdTheadEl();

        ///TODO: append to DOM later
        var elThead = (this._elBdColgroup) ?
            elTable.insertBefore(document.createElement("thead"), this._elBdColgroup.nextSibling) :
            elTable.appendChild(document.createElement("thead"));
        
        var oColumnSet = this._oColumnSet,
            oColumn,
            i=0, j=0;
    
        // Add TRs to the THEADs
        var colTree = oColumnSet.tree;
        var elTheadCell;
        
        for(; i<colTree.length; i++) {
            var elTheadRow = elThead.appendChild(document.createElement("tr"));
            ///TODO: is this necessary?
            //elTheadRow.id = this._sId+"-hdrow" + i + "-a11y";
    
            // ...and create TH cells
            for(; j<colTree[i].length; j++) {
                oColumn = colTree[i][j];
                elTheadCell = elTheadRow.appendChild(document.createElement("th"));
                // This is necessary for accessibility
                elTheadCell.id = this._sId+"-th" + oColumn.getId();
                elTheadCell.yuiCellIndex = j;
                this._initBdThEl(elTheadCell,oColumn,i,j);
            }
        }
        YAHOO.log("Accessibility TH cells for " + this._oColumnSet.keys.length + " keys created","info",this.toString());
        return elThead;
    }
},

/**
 * Populates TH cell for the body THEAD element.
 *
 * @method _initBdThEl
 * @param elTheadCell {HTMLElement} TH cell element reference.
 * @param oColumn {YAHOO.widget.Column} Column object.
 * @private
 */
_initBdThEl : function(elTheadCell,oColumn) {
    // This is necessary for accessibility
    elTheadCell.id = this._sId+"-th" + oColumn.getId();
    elTheadCell.rowSpan = oColumn.getRowspan();
    elTheadCell.colSpan = oColumn.getColspan();
    
    ///TODO: strip links and form elements
    var sKey = oColumn.getKey();
    var sLabel = lang.isValue(oColumn.label) ? oColumn.label : sKey;
    elTheadCell.innerHTML = sLabel;
},

/**
 * Populates TH cell for the body THEAD element.
 *
 * @method _initBdThEl
 * @param elTheadCell {HTMLElement} TH cell element reference.
 * @param oColumn {YAHOO.widget.Column} Column object.
 * @private
 */
_initThEl : function(elTheadCell,oColumn) {
    this._baseInitThEl(elTheadCell,oColumn);
    // This is necessary for _syncScrollPadding()
    elTheadCell.id = this._sId+"-thfixed" + oColumn.getId();
},




/**
 * Formats all TD elements of given TR element with data from the given Record.
 *
 * @method _updateTrEl
 * @param elRow {HTMLElement} The TR element to update.
 * @param oRecord {YAHOO.widget.Record} The associated Record instance.
 * @return {HTMLElement} DOM reference to the new TR element.
 * @private
 */
_xupdateTrEl : function(elRow, oRecord) {
    var oColumnSet = this._oColumnSet,
        sortKey,
        sortClass,
        isSortedBy = this.get("sortedBy"),
        i,j,len,jlen;

    if(isSortedBy) {
        sortKey = isSortedBy.key;
        sortClass = isSortedBy.dir;
    }

    // Hide the row to prevent constant reflows
    elRow.style.display = 'none';
    
    // Track whether to reaassing first/last classes
    var bFirstLast = false;

    // Remove extra TD elements
    while(elRow.childNodes.length > oColumnSet.keys.length) {
        elRow.removeChild(elRow.firstChild);
        bFirstLast = true;
    }
    // Add more TD elements as needed
    for (i=elRow.childNodes.length||0, len=oColumnSet.keys.length; i < len; ++i) {
        this._addTdEl(elRow,oColumnSet.keys[i],i);
        bFirstLast = true;
    }

    // Update TD elements with new data
    for(i=0,len=oColumnSet.keys.length; i<len; ++i) {
        var oColumn     = oColumnSet.keys[i],
            elCell      = elRow.childNodes[i],
            elCellLiner = elCell.firstChild,
            cellHeaders = '',
            headerType  = " ";

        // Set the cell's accessibility headers
        for(j=0,jlen=oColumnSet.headers[i].length; j < jlen; ++j) {
            cellHeaders += this._sId + "-th" + oColumnSet.headers[i][j] + headerType;
        }
        elCell.headers = cellHeaders;

        // Set First/Last on TD if necessary
        if(bFirstLast) {
            Dom.removeClass(elCell, DT.CLASS_FIRST);
            Dom.removeClass(elCell, DT.CLASS_LAST);
            if(i === 0) {
                Dom.addClass(elCell, DT.CLASS_FIRST);
            }
            else if(i === len-1) {
                Dom.addClass(elCell, DT.CLASS_LAST);
            }
        }

        // Set ASC/DESC on TD
        if(oColumn.key === sortKey) {
            Dom.replaceClass(elCell, sortClass === DT.CLASS_ASC ?
                                     DT.CLASS_DESC : DT.CLASS_ASC, sortClass);
        } else {
            Dom.removeClass(elCell, DT.CLASS_ASC);
            Dom.removeClass(elCell, DT.CLASS_DESC);
        }
        
        // Set Column hidden if appropriate
        if(oColumn.hidden) {
            Dom.addClass(elCell, DT.CLASS_HIDDEN);
        }
        else {
            Dom.removeClass(elCell, DT.CLASS_HIDDEN);
        }

        // Set Column selection on TH
        if(oColumn.selected) {
            Dom.addClass(elCell, DT.CLASS_SELECTED);
        }
        else {
            Dom.removeClass(elCell, DT.CLASS_SELECTED);
        }

        // Set the cell content
        this.formatCell(elCellLiner, oRecord, oColumn);

    }

    // Update Record ID
    elRow.yuiRecordId = oRecord.getId();
    
    // Redisplay the row for reflow
    elRow.style.display = '';

    return elRow;
},






















/**
 * Post render syncing of Column widths and scroll padding
 *
 * @method _sync
 * @private
 */
_sync : function() {
    this._syncColWidths();
    ///TODO: is this still necessary?
    DT._repaintGecko();
},

/**
 * Syncs up widths of THs and TDs across all those Columns without width values.
 * Actual adjustment is to the liner DIVs so window resizing will not affect cells. 
 *
 * @method _syncColWidths
 * @private
 */
_syncColWidths : function() {
    if(this._elTbody.rows.length > 0) {
        // Validate there is at least one row with cells and at least one Column
        var allKeys   = this._oColumnSet.keys,
            elRow     = this.getFirstTrEl();
    
        if(allKeys && elRow && (elRow.cells.length === allKeys.length)) {
            // Temporarily unsnap container since it causes inaccurate calculations
            var bUnsnap = false;
            if(YAHOO.env.ua.gecko || YAHOO.env.ua.opera) {
                bUnsnap = true;
                if(this.get("width")) {
                    this._elHdContainer.style.width = "";
                    this._elBdContainer.style.width = "";
                }
                else {
                    this._elContainer.style.width = "";
                }
            }
    
            var i,
                oColumn,
                cellsLen = elRow.cells.length;
            // First time through, reset the widths to get an accurate measure of the TD
            for(i=0; i<cellsLen; i++) {
                oColumn = allKeys[i];
                // Only for Columns without widths 
                ///TODO: and with a calculated width
                if(!oColumn.width && !oColumn.hidden && oColumn._bCalculatedWidth) {
                    this._setColumnWidth(oColumn, "auto");
                }
            }
    
            // Calculate width for every Column
            for(i=0; i<cellsLen; i++) {
                oColumn = allKeys[i];
                var newWidth;
                
                // Columns without widths
                if(!oColumn.width) {
                    var elTh = oColumn.getThEl();
                    var elTd = elRow.cells[i];

                    var elWider = (elTh.offsetWidth > elTd.offsetWidth) ?
                            elTh.firstChild : elTd.firstChild;               
                
                    if(elTh.offsetWidth !== elTd.offsetWidth ||
                        elWider.offsetWidth < oColumn.minWidth) {

                        // Calculate the new width by comparing liner widths
                        newWidth = Math.max(0, oColumn.minWidth,
                            elWider.offsetWidth -
                            (parseInt(Dom.getStyle(elWider,"paddingLeft"),10)|0) -
                            (parseInt(Dom.getStyle(elWider,"paddingRight"),10)|0));
                            
                        oColumn._bCalculatedWidth = true;
                    }
                }
                // Columns with widths
                else {
                    newWidth = oColumn.width;
                }
                
                // Hidden Columns
                if(oColumn.hidden) {
                    oColumn._nLastWidth = newWidth;
                    this._setColumnWidth(oColumn, '1px'); 

                // Update to the new width
                } else if(newWidth) {
                    this._setColumnWidth(oColumn, newWidth+'px');
                }
            }
            
            // Resnap unsnapped containers
            if(bUnsnap) {
                var sWidth = this.get("width");
                this._elHdContainer.style.width = sWidth;
                this._elBdContainer.style.width = sWidth;     
            } 

        }
    }

    this._syncScrollPadding();
},

/**
 * Syncs padding around scrollable tables, including Column header right-padding
 * and container width and height.
 *
 * @method _syncScrollPadding
 * @private
 */
_syncScrollPadding : function() {
    var elTbody = this._elTbody,
        elBdContainer = this._elBdContainer,
        aLastHeaders, len, prefix, i, elLiner;
    
    // IE 6 and 7 only when y-scrolling not enabled
    if(!this.get("height") && (ua.ie)) {
        // Snap outer container height to content
        // but account for x-scrollbar if it is visible
        if(elTbody.rows.length > 0) {
            elBdContainer.style.height = 
                    (elBdContainer.scrollWidth > elBdContainer.offsetWidth) ?
                    (elTbody.offsetHeight + 19) + "px" : 
                    elTbody.offsetHeight + "px";
        }
        else {
            elBdContainer.style.height = 
                    (elBdContainer.scrollWidth > elBdContainer.offsetWidth) ?
                    (this._elMsgTbody.offsetHeight + 19) + "px" : 
                    this._elMsgTbody.offsetHeight + "px";
        }
    }

    // X-scrolling not enabled
    if(!this.get("width")) {
        // Snap outer container width to content
        // but account for y-scrollbar if it is visible
        this._elContainer.style.width = 
                (elBdContainer.scrollHeight > elBdContainer.offsetHeight) ?
                (elTbody.parentNode.offsetWidth + 19) + "px" :
                //TODO: Can we detect left and right border widths instead of hard coding?
                (elTbody.parentNode.offsetWidth + 2) + "px";
    }
    // X-scrolling is enabled and x-scrollbar is visible
    else if((elBdContainer.scrollWidth > elBdContainer.offsetWidth) ||
        ((elBdContainer.scrollHeight > elBdContainer.offsetHeight) && (elBdContainer.scrollWidth > elBdContainer.offsetWidth-16))) {
        // Perform sync routine
        if(!this._bScrollbarX) {
            // Add Column header right-padding
            aLastHeaders = this._oColumnSet.headers[this._oColumnSet.headers.length-1];
            len = aLastHeaders.length;
            prefix = this._sId+"-thfixed";
            for(i=0; i<len; i++) {
                //TODO: A better way to get th cell
                elLiner = Dom.get(prefix+aLastHeaders[i]).firstChild;
                elLiner.style.marginRight = 
                        (parseInt(Dom.getStyle(elLiner,"marginRight"),10) + 
                        16) + "px";
            }
            
            // Save state   
            this._bScrollbarX = true;
        }
    }
    // X-scrollbar enabled but x-scrollbar is not visible
    else {
        // Perform sync routine
        if(this._bScrollbarX) {                 
            // Remove Column header right-padding                   
            aLastHeaders = this._oColumnSet.headers[this._oColumnSet.headers.length-1];
            len = aLastHeaders.length;
            prefix = this._sId+"-thfixed";
            for(i=0; i<len; i++) {
                //TODO: A better way to get th cell
                elLiner = Dom.get(prefix+aLastHeaders[i]).firstChild;
                Dom.setStyle(elLiner,"marginRight","");
            }
                                    
            // Save state
            this._bScrollbarX = false;
        }
    }

    // Sync message tbody
    if(this._elTbody.rows.length === 0) {
        this._elMsgTbody.parentNode.width = this.getTheadEl().parentNode.offsetWidth;
    }
    else {
        this._elMsgTbody.parentNode.width = "";
    }
},














/**
 * Nulls out the entire DataTable instance and related objects, removes attached
 * event listeners, and clears out DOM elements inside the container. After
 * calling this method, the instance reference should be expliclitly nulled by
 * implementer, as in myDataTable = null. Use with caution!
 *
 * @method destroy
 */
destroy : function() {
    this._oChainRender.stop();
    
    //TODO: destroy static resizer proxy and column proxy?
    
    var i;
    // Destroy ColumnDDs
    var aTree = this._oColumnSet.tree[0];
    for(i=0; i<aTree.length; i++) {
        if(aTree[i]._dd) {
            aTree[i]._dd = aTree[i]._dd.unreg();
        }
    }

    // Destroy ColumnResizers
    var aKeys = this._oColumnSet.keys;
    for(i=0; i<aKeys.length; i++) {
        if(aKeys[i]._ddResizer) {
            aKeys[i]._ddResizer = aKeys[i]._ddResizer.unreg();
        }
    }
    
    // Destroy Cell Editor
    Ev.purgeElement(this._oCellEditor.container, true);
    document.body.removeChild(this._oCellEditor.container);

    var instanceName = this.toString();
    var elContainer = this._elContainer;

    // Unhook custom events
    this._oRecordSet.unsubscribeAll();
    this.unsubscribeAll();

    // Unhook DOM events
    Ev.purgeElement(elContainer, true);
    Ev.removeListener(document, "click", this._onDocumentClick);

    // Remove DOM elements
    elContainer.innerHTML = "";

    // Null out objects
    for(var param in this) {
        if(lang.hasOwnProperty(this, param)) {
            this[param] = null;
        }
    }
    
    // Clean up static values
    DT._nCurrentCount--;
    
    if(DT._nCurrentCount < 1) {
        if(DT._elDynStyleNode) {
            document.getElementsByTagName('head')[0].removeChild(DT._elDynStyleNode);
            DT._elDynStyleNode = null;
        }
    }

    YAHOO.log("DataTable instance destroyed: " + instanceName);
},

/**
 * Sets given Column to given pixel width. If new width is less than minimum
 * width, sets to minimum width. Updates oColumn.width value.
 *
 * @method setColumnWidth
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @param nWidth {Number} New width in pixels.
 */
setColumnWidth : function(oColumn, nWidth) {
    oColumn = this.getColumn(oColumn);
    if(oColumn) {
        // Validate new width against minimum width
        if(lang.isNumber(nWidth)) {
            nWidth = (nWidth > oColumn.minWidth) ? nWidth : oColumn.minWidth;

            // Save state
            oColumn.width = nWidth;
            
            // Resize the DOM elements
            //this._oChainSync.stop();
            this._setColumnWidth(oColumn, nWidth+"px");
            this._syncScrollPadding();
            
            this.fireEvent("columnSetWidthEvent",{column:oColumn,width:nWidth});
            YAHOO.log("Set width of Column " + oColumn + " to " + nWidth + "px", "info", this.toString());
            return;
        }
    }
    YAHOO.log("Could not set width of Column " + oColumn + " to " + nWidth + "px", "warn", this.toString());
},


/**
 * Shows Cell Editor for given cell.
 *
 * @method showCellEditor
 * @param elCell {HTMLElement | String} Cell to edit.
 * @param oRecord {YAHOO.widget.Record} (Optional) Record instance.
 * @param oColumn {YAHOO.widget.Column} (Optional) Column instance.
 */
showCellEditor : function(elCell, oRecord, oColumn) {
    elCell = Dom.get(elCell);

    if(elCell && (elCell.ownerDocument === document)) {
        if(!oRecord || !(oRecord instanceof YAHOO.widget.Record)) {
            oRecord = this.getRecord(elCell);
        }
        if(!oColumn || !(oColumn instanceof YAHOO.widget.Column)) {
            oColumn = this.getColumn(elCell);
        }
        if(oRecord && oColumn) {
            var oCellEditor = this._oCellEditor;

            // Clear previous Editor
            if(oCellEditor.isActive) {
                this.cancelCellEditor();
            }

            // Editor not defined
            if(!oColumn.editor) {
                return;
            }

            // Update Editor values
            oCellEditor.cell = elCell;
            oCellEditor.record = oRecord;
            oCellEditor.column = oColumn;
            oCellEditor.validator = (oColumn.editorOptions &&
                    lang.isFunction(oColumn.editorOptions.validator)) ?
                    oColumn.editorOptions.validator : null;
            oCellEditor.value = oRecord.getData(oColumn.key);
            oCellEditor.defaultValue = null;

            // Move Editor
            var elContainer = oCellEditor.container;
            var x = Dom.getX(elCell);
            var y = Dom.getY(elCell);

            // SF doesn't get xy for cells in scrolling table
            // when tbody display is set to block
            if(isNaN(x) || isNaN(y)) {
                x = elCell.offsetLeft + // cell pos relative to table
                        Dom.getX(this._elTbody.parentNode) - // plus table pos relative to document
                        this._elTbody.scrollLeft; // minus tbody scroll
                y = elCell.offsetTop + // cell pos relative to table
                        Dom.getY(this._elTbody.parentNode) - // plus table pos relative to document
                        this._elTbody.scrollTop + // minus tbody scroll
                        this._elThead.offsetHeight; // account for fixed THEAD cells
            }

            elContainer.style.left = x + "px";
            elContainer.style.top = y + "px";

            // Hook to customize the UI
            this.doBeforeShowCellEditor(this._oCellEditor);

            //TODO: This is temporarily up here due so elements can be focused
            // Show Editor
            elContainer.style.display = "";

            // Handle ESC key
            Ev.addListener(elContainer, "keydown", function(e, oSelf) {
                // ESC hides Cell Editor
                if((e.keyCode == 27)) {
                    oSelf.cancelCellEditor();
                    oSelf.focusTbodyEl();
                }
                else {
                    oSelf.fireEvent("editorKeydownEvent", {editor:oSelf._oCellEditor, event:e});
                }
            }, this);

            // Render Editor markup
            var fnEditor;
            if(lang.isString(oColumn.editor)) {
                switch(oColumn.editor) {
                    case "checkbox":
                        fnEditor = DT.editCheckbox;
                        break;
                    case "date":
                        fnEditor = DT.editDate;
                        break;
                    case "dropdown":
                        fnEditor = DT.editDropdown;
                        break;
                    case "radio":
                        fnEditor = DT.editRadio;
                        break;
                    case "textarea":
                        fnEditor = DT.editTextarea;
                        break;
                    case "textbox":
                        fnEditor = DT.editTextbox;
                        break;
                    default:
                        fnEditor = null;
                }
            }
            else if(lang.isFunction(oColumn.editor)) {
                fnEditor = oColumn.editor;
            }

            if(fnEditor) {
                // Create DOM input elements
                fnEditor(this._oCellEditor, this);

                // Show Save/Cancel buttons
                if(!oColumn.editorOptions || !oColumn.editorOptions.disableBtns) {
                    this.showCellEditorBtns(elContainer);
                }

                oCellEditor.isActive = true;

                //TODO: verify which args to pass
                this.fireEvent("editorShowEvent", {editor:oCellEditor});
                YAHOO.log("Cell Editor shown for " + elCell, "info", this.toString());
                return;
            }
        }
    }
    YAHOO.log("Could not show Cell Editor for " + elCell, "warn", this.toString());
},

/**
 * Saves Cell Editor input to Record.
 *
 * @method saveCellEditor
 */
saveCellEditor : function() {
    if(this._oCellEditor.isActive) {
        var newData = this._oCellEditor.value;
        // Copy the data to pass to the event
        var oldData = YAHOO.widget.DataTable._cloneObject(this._oCellEditor.record.getData(this._oCellEditor.column.key));

        // Validate input data
        if(this._oCellEditor.validator) {
            newData = this._oCellEditor.value = this._oCellEditor.validator.call(this, newData, oldData, this._oCellEditor);
            if(newData === null ) {
                this.resetCellEditor();
                this.fireEvent("editorRevertEvent",
                        {editor:this._oCellEditor, oldData:oldData, newData:newData});
                YAHOO.log("Could not save Cell Editor input due to invalid data " +
                        lang.dump(newData), "warn", this.toString());
                return;
            }
        }
        // Update the Record
        this._oRecordSet.updateRecordValue(this._oCellEditor.record, this._oCellEditor.column.key, this._oCellEditor.value);
        // Update the UI
        this.formatCell(this._oCellEditor.cell.firstChild);
        
        // Bug fix 1764044
        this._oChainRender.add({
            method: function() {
                this._syncColWidths();
            },
            scope: this
        });
        this._oChainRender.run();
        // Clear out the Cell Editor
        this.resetCellEditor();

        this.fireEvent("editorSaveEvent",
                {editor:this._oCellEditor, oldData:oldData, newData:newData});
        YAHOO.log("Cell Editor input saved", "info", this.toString());
    }
    else {
        YAHOO.log("Cell Editor not active to save input", "warn", this.toString());
    }
},























/////////////////////////////////////////////////////////////////////////////
//
// Private DOM Event Handlers
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Syncs scrolltop and scrollleft of all TABLEs.
 *
 * @method _onScroll
 * @param e {HTMLEvent} The scroll event.
 * @param oSelf {YAHOO.widget.ScrollingDataTable} ScrollingDataTable instance.
 * @private
 */
_onScroll : function(e, oSelf) {
    oSelf._elHdContainer.scrollLeft = oSelf._elBdContainer.scrollLeft;

    if(oSelf._oCellEditor && oSelf._oCellEditor.isActive) {
        oSelf.fireEvent("editorBlurEvent", {editor:oSelf._oCellEditor});
        oSelf.cancelCellEditor();
    }

    var elTarget = Ev.getTarget(e);
    var elTag = elTarget.nodeName.toLowerCase();
    oSelf.fireEvent("tableScrollEvent", {event:e, target:elTarget});
},

/**
 * Handles keydown events on the THEAD element.
 *
 * @method _onTheadKeydown
 * @param e {HTMLEvent} The key event.
 * @param oSelf {YAHOO.widget.ScrollingDataTable} ScrollingDataTable instance.
 * @private
 */
_onTheadKeydown : function(e, oSelf) {
    // If tabbing to next TH label link causes THEAD to scroll,
    // need to sync scrollLeft with TBODY
    if(Ev.getCharCode(e) === 9) {
        setTimeout(function() {
            if((oSelf instanceof SDT) && oSelf._sId) {
                oSelf._elBdContainer.scrollLeft = oSelf._elHdContainer.scrollLeft;
            }
        },0);
    }
    
    var elTarget = Ev.getTarget(e);
    var elTag = elTarget.nodeName.toLowerCase();
    var bKeepBubbling = true;
    while(elTarget && (elTag != "table")) {
        switch(elTag) {
            case "body":
                return;
            case "input":
            case "textarea":
                // TODO
                break;
            case "thead":
                bKeepBubbling = oSelf.fireEvent("theadKeyEvent",{target:elTarget,event:e});
                break;
            default:
                break;
        }
        if(bKeepBubbling === false) {
            return;
        }
        else {
            elTarget = elTarget.parentNode;
            if(elTarget) {
                elTag = elTarget.nodeName.toLowerCase();
            }
        }
    }
    oSelf.fireEvent("tableKeyEvent",{target:(elTarget || oSelf._elContainer),event:e});
}




/**
 * Fired when a fixed scrolling DataTable has a scroll.
 *
 * @event tableScrollEvent
 * @param oArgs.event {HTMLEvent} The event object.
 * @param oArgs.target {HTMLElement} The DataTable's CONTAINER element (in IE)
 * or the DataTable's TBODY element (everyone else).
 *
 */




});

// Aliases
SDT.prototype._baseInitTableEl = DT.prototype._initTableEl;
SDT.prototype._baseInitColgroupEl = DT.prototype._initColgroupEl;
SDT.prototype._baseInitTheadEl = DT.prototype._initTheadEl;
SDT.prototype._baseInitThEl = DT.prototype._initThEl;

})();
