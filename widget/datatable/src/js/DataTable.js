    (function () {

var lang   = YAHOO.lang,
    util   = YAHOO.util,
    widget = YAHOO.widget,
    ua     = YAHOO.env.ua,
    
    Dom    = util.Dom,
    Ev     = util.Event,
    DS     = util.DataSourceBase,
    Pag    = widget.Paginator;

/**
 * The DataTable widget provides a progressively enhanced DHTML control for
 * displaying tabular data across A-grade browsers.
 *
 * @module datatable
 * @requires yahoo, dom, event, element, datasource
 * @optional dragdrop, dragdrop
 * @title DataTable Widget
 * @beta
 */

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * DataTable class for the YUI DataTable widget.
 *
 * @namespace YAHOO.widget
 * @class DataTable
 * @uses YAHOO.util.EventProvider
 * @constructor
 * @param elContainer {HTMLElement} Container element for the TABLE.
 * @param aColumnDefs {Object[]} Array of object literal Column definitions.
 * @param oDataSource {YAHOO.util.DataSource} DataSource instance.
 * @param oConfigs {object} (optional) Object literal of configuration values.
 */
YAHOO.widget.DataTable = function(elContainer,aColumnDefs,oDataSource,oConfigs) {
    var DT = widget.DataTable;
    
    if(oConfigs && oConfigs.scrollable) {
        return new YAHOO.widget.ScrollingDataTable(elContainer,aColumnDefs,oDataSource,oConfigs);
    }
    
    // Internal vars
    this._nIndex = DT._nCount;
    this._sId = "yui-dt"+this._nIndex;
    this._oChainRender = new YAHOO.util.Chain();
    this._oChainRender.subscribe("end",this._onRenderChainEnd, this, true);

    // Initialize configs
    this._initConfigs(oConfigs);

    // Initialize DataSource
    this._initDataSource(oDataSource);
    if(!this._oDataSource) {
        YAHOO.log("Could not instantiate DataTable due to an invalid DataSource", "error", this.toString());
        return;
    }

    // Initialize ColumnSet
    this._initColumnSet(aColumnDefs);
    if(!this._oColumnSet) {
        YAHOO.log("Could not instantiate DataTable due to an invalid ColumnSet", "error", this.toString());
        return;
    }

    // Initialize RecordSet
    this._initRecordSet();
    if(!this._oRecordSet) {
    }

    // Initialize DOM elements
    var okDom = this._initDomElements(elContainer);
    if(!okDom) {
        YAHOO.log("Could not instantiate DataTable due to an invalid DOM elements", "error", this.toString());
        return;
    }
    
    ///TODO: a better way to set up initial state, esp for DT created in hidden container
    this.showTableMessage(DT.MSG_LOADING, DT.CLASS_LOADING);
    
    // Call Element's constructor after DOM elements are created
    // but *before* table is populated with data
    DT.superclass.constructor.call(this, this._elContainer, this._oConfigs);
    
    // Element's constructor must first be called
    this.subscribe("tableMutationEvent",this._onTableMutationEvent);

    // HACK: Set sortedBy values for backward compatibility
    var oSortedBy = this.get("sortedBy");
    if(oSortedBy) {
        if(oSortedBy.dir == "desc") {
            this._configs.sortedBy.value.dir = DT.CLASS_DESC;
        }
        else if(oSortedBy.dir == "asc") {
            this._configs.sortedBy.value.dir = DT.CLASS_ASC;
        }
    }

    //HACK: Set the paginator values.  Attribute doesn't afford for merging
    // obj value's keys.  It's all or nothing.  Merge in provided keys.
    if(this._oConfigs.paginator && !(this._oConfigs.paginator instanceof YAHOO.widget.Paginator)) {
        // Backward compatibility
        this.updatePaginator(this._oConfigs.paginator);
    }

    // Initialize inline Cell editing
    this._oCellEditor = this._initCellEditor();
    
    // Initialize Column sort
    this._initColumnSort();

    // Once per instance
    YAHOO.util.Event.addListener(document, "click", this._onDocumentClick, this);

    DT._nCount++;
    DT._nCurrentCount++;
    
    // Send a simple initial request
    var oCallback = {
        success : this.onDataReturnSetRows,
        failure : this.onDataReturnSetRows,
        scope   : this,
        argument: {}
    };
    
    var initialLoad = this.get("initialLoad");
    if(initialLoad === true) {
        this._oDataSource.sendRequest(this.get("initialRequest"), oCallback);
    }
    // Do not send an initial request at all
    else if(initialLoad === false) {
        this.showTableMessage(DT.MSG_EMPTY, DT.CLASS_EMPTY);
        this._oChainRender.add({
            method: function() {
                if((this instanceof DT) && this._sId && this._bInit) {
                    this._bInit = false;
                    this.fireEvent("initEvent");
                    YAHOO.log("DataTable initialized with no rows", "info", this.toString());
                }
            },
            scope: this
        });
        this._oChainRender.run();
    }
    // Send an initial request with a custom payload
    else {
        var oCustom = initialLoad || {};
        oCallback.argument = oCustom.argument || {};
        this._oDataSource.sendRequest(oCustom.request, oCallback);
    }
};

var DT = widget.DataTable;

/////////////////////////////////////////////////////////////////////////////
//
// Public constants
//
/////////////////////////////////////////////////////////////////////////////

lang.augmentObject(DT, {

    /**
     * Class name assigned to outer DataTable container.
     *
     * @property DataTable.CLASS_DATATABLE
     * @type String
     * @static
     * @final
     * @default "yui-dt"
     */
    CLASS_DATATABLE : "yui-dt",

    /**
     * Class name assigned to liner DIV elements.
     *
     * @property DataTable.CLASS_LINER
     * @type String
     * @static
     * @final
     * @default "yui-dt-liner"
     */
    CLASS_LINER : "yui-dt-liner",

    /**
     * Class name assigned to display label elements.
     *
     * @property DataTable.CLASS_LABEL
     * @type String
     * @static
     * @final
     * @default "yui-dt-label"
     */
    CLASS_LABEL : "yui-dt-label",

    /**
     * Class name assigned to Column drag target.
     *
     * @property DataTable.CLASS_COLTARGET
     * @type String
     * @static
     * @final
     * @default "yui-dt-coltarget"
     */
    CLASS_COLTARGET : "yui-dt-coltarget",

    /**
     * Class name assigned to resizer handle elements.
     *
     * @property DataTable.CLASS_RESIZER
     * @type String
     * @static
     * @final
     * @default "yui-dt-resizer"
     */
    CLASS_RESIZER : "yui-dt-resizer",

    /**
     * Class name assigned to resizer proxy elements.
     *
     * @property DataTable.CLASS_RESIZERPROXY
     * @type String
     * @static
     * @final
     * @default "yui-dt-resizerproxy"
     */
    CLASS_RESIZERPROXY : "yui-dt-resizerproxy",

    /**
     * Class name assigned to Editor container elements.
     *
     * @property DataTable.CLASS_EDITOR
     * @type String
     * @static
     * @final
     * @default "yui-dt-editor"
     */
    CLASS_EDITOR : "yui-dt-editor",

    /**
     * Class name assigned to paginator container elements.
     *
     * @property DataTable.CLASS_PAGINATOR
     * @type String
     * @static
     * @final
     * @default "yui-dt-paginator"
     */
    CLASS_PAGINATOR : "yui-dt-paginator",

    /**
     * Class name assigned to page number indicators.
     *
     * @property DataTable.CLASS_PAGE
     * @type String
     * @static
     * @final
     * @default "yui-dt-page"
     */
    CLASS_PAGE : "yui-dt-page",

    /**
     * Class name assigned to default indicators.
     *
     * @property DataTable.CLASS_DEFAULT
     * @type String
     * @static
     * @final
     * @default "yui-dt-default"
     */
    CLASS_DEFAULT : "yui-dt-default",

    /**
     * Class name assigned to previous indicators.
     *
     * @property DataTable.CLASS_PREVIOUS
     * @type String
     * @static
     * @final
     * @default "yui-dt-previous"
     */
    CLASS_PREVIOUS : "yui-dt-previous",

    /**
     * Class name assigned next indicators.
     *
     * @property DataTable.CLASS_NEXT
     * @type String
     * @static
     * @final
     * @default "yui-dt-next"
     */
    CLASS_NEXT : "yui-dt-next",

    /**
     * Class name assigned to first elements.
     *
     * @property DataTable.CLASS_FIRST
     * @type String
     * @static
     * @final
     * @default "yui-dt-first"
     */
    CLASS_FIRST : "yui-dt-first",

    /**
     * Class name assigned to last elements.
     *
     * @property DataTable.CLASS_LAST
     * @type String
     * @static
     * @final
     * @default "yui-dt-last"
     */
    CLASS_LAST : "yui-dt-last",

    /**
     * Class name assigned to even elements.
     *
     * @property DataTable.CLASS_EVEN
     * @type String
     * @static
     * @final
     * @default "yui-dt-even"
     */
    CLASS_EVEN : "yui-dt-even",

    /**
     * Class name assigned to odd elements.
     *
     * @property DataTable.CLASS_ODD
     * @type String
     * @static
     * @final
     * @default "yui-dt-odd"
     */
    CLASS_ODD : "yui-dt-odd",

    /**
     * Class name assigned to selected elements.
     *
     * @property DataTable.CLASS_SELECTED
     * @type String
     * @static
     * @final
     * @default "yui-dt-selected"
     */
    CLASS_SELECTED : "yui-dt-selected",

    /**
     * Class name assigned to highlighted elements.
     *
     * @property DataTable.CLASS_HIGHLIGHTED
     * @type String
     * @static
     * @final
     * @default "yui-dt-highlighted"
     */
    CLASS_HIGHLIGHTED : "yui-dt-highlighted",

    /**
     * Class name assigned to hidden elements.
     *
     * @property DataTable.CLASS_HIDDEN
     * @type String
     * @static
     * @final
     * @default "yui-dt-hidden"
     */
    CLASS_HIDDEN : "yui-dt-hidden",

    /**
     * Class name assigned to disabled elements.
     *
     * @property DataTable.CLASS_DISABLED
     * @type String
     * @static
     * @final
     * @default "yui-dt-disabled"
     */
    CLASS_DISABLED : "yui-dt-disabled",

    /**
     * Class name assigned to empty indicators.
     *
     * @property DataTable.CLASS_EMPTY
     * @type String
     * @static
     * @final
     * @default "yui-dt-empty"
     */
    CLASS_EMPTY : "yui-dt-empty",

    /**
     * Class name assigned to loading indicatorx.
     *
     * @property DataTable.CLASS_LOADING
     * @type String
     * @static
     * @final
     * @default "yui-dt-loading"
     */
    CLASS_LOADING : "yui-dt-loading",

    /**
     * Class name assigned to error indicators.
     *
     * @property DataTable.CLASS_ERROR
     * @type String
     * @static
     * @final
     * @default "yui-dt-error"
     */
    CLASS_ERROR : "yui-dt-error",

    /**
     * Class name assigned to editable elements.
     *
     * @property DataTable.CLASS_EDITABLE
     * @type String
     * @static
     * @final
     * @default "yui-dt-editable"
     */
    CLASS_EDITABLE : "yui-dt-editable",

    /**
     * Class name assigned to draggable elements.
     *
     * @property DataTable.CLASS_DRAGGABLE
     * @type String
     * @static
     * @final
     * @default "yui-dt-draggable"
     */
    CLASS_DRAGGABLE : "yui-dt-draggable",

    /**
     * Class name assigned to resizeable elements.
     *
     * @property DataTable.CLASS_RESIZEABLE
     * @type String
     * @static
     * @final
     * @default "yui-dt-resizeable"
     */
    CLASS_RESIZEABLE : "yui-dt-resizeable",

    /**
     * Class name assigned to scrollable elements.
     *
     * @property DataTable.CLASS_SCROLLABLE
     * @type String
     * @static
     * @final
     * @default "yui-dt-scrollable"
     */
    CLASS_SCROLLABLE : "yui-dt-scrollable",

    /**
     * Class name assigned to sortable elements.
     *
     * @property DataTable.CLASS_SORTABLE
     * @type String
     * @static
     * @final
     * @default "yui-dt-sortable"
     */
    CLASS_SORTABLE : "yui-dt-sortable",

    /**
     * Class name assigned to ascending elements.
     *
     * @property DataTable.CLASS_ASC
     * @type String
     * @static
     * @final
     * @default "yui-dt-asc"
     */
    CLASS_ASC : "yui-dt-asc",

    /**
     * Class name assigned to descending elements.
     *
     * @property DataTable.CLASS_DESC
     * @type String
     * @static
     * @final
     * @default "yui-dt-desc"
     */
    CLASS_DESC : "yui-dt-desc",

    /**
     * Class name assigned to BUTTON elements and/or container elements.
     *
     * @property DataTable.CLASS_BUTTON
     * @type String
     * @static
     * @final
     * @default "yui-dt-button"
     */
    CLASS_BUTTON : "yui-dt-button",

    /**
     * Class name assigned to INPUT TYPE=CHECKBOX elements and/or container elements.
     *
     * @property DataTable.CLASS_CHECKBOX
     * @type String
     * @static
     * @final
     * @default "yui-dt-checkbox"
     */
    CLASS_CHECKBOX : "yui-dt-checkbox",

    /**
     * Class name assigned to SELECT elements and/or container elements.
     *
     * @property DataTable.CLASS_DROPDOWN
     * @type String
     * @static
     * @final
     * @default "yui-dt-dropdown"
     */
    CLASS_DROPDOWN : "yui-dt-dropdown",

    /**
     * Class name assigned to INPUT TYPE=RADIO elements and/or container elements.
     *
     * @property DataTable.CLASS_RADIO
     * @type String
     * @static
     * @final
     * @default "yui-dt-radio"
     */
    CLASS_RADIO : "yui-dt-radio",

    /**
     * Class name assigned to temporary elements.
     *
     * @property DataTable.CLASS_TMP
     * @type String
     * @static
     * @final
     * @default "yui-dt-tmp"
     */
    CLASS_TMP : "yui-dt-tmp",

    /**
     * Message to display if DataTable has no data.
     *
     * @property DataTable.MSG_EMPTY
     * @type String
     * @static
     * @final
     * @default "No records found."
     */
    MSG_EMPTY : "No records found.",

    /**
     * Message to display while DataTable is loading data.
     *
     * @property DataTable.MSG_LOADING
     * @type String
     * @static
     * @final
     * @default "Loading data..."
     */
    MSG_LOADING : "Loading data...",

    /**
     * Message to display while DataTable has data error.
     *
     * @property DataTable.MSG_ERROR
     * @type String
     * @static
     * @final
     * @default "Data error."
     */
    MSG_ERROR : "Data error.",

    /////////////////////////////////////////////////////////////////////////
    //
    // Private static properties
    //
    /////////////////////////////////////////////////////////////////////////

    /**
     * Internal class variable for indexing multiple DataTable instances.
     *
     * @property DataTable._nCount
     * @type Number
     * @private
     * @static
     */
    _nCount : 0,

    /**
     * Internal class variable tracking current number of DataTable instances,
     * so that certain class values can be reset when all instances are destroyed.          
     *
     * @property DataTable._nCurrentCount
     * @type Number
     * @private
     * @static
     */
    _nCurrentCount : 0,

    /**
     * Reference to the STYLE node that is dynamically created and updated
     * in order to manage Column widths.
     *
     * @property DataTable._elDynStyleNode
     * @type HTMLElement
     * @private
     * @static     
     */
    _elDynStyleNode : null,

    /**
     * Set to true if _elDynStyleNode cannot be populated due to browser incompatibility.
     *
     * @property DataTable._bDynStylesFallback
     * @type boolean
     * @private
     * @static     
     */
    _bDynStylesFallback : (ua.ie && (ua.ie<7)) ? true : false,

    /**
     * Object literal hash of Columns and their dynamically create style rules.
     *
     * @property DataTable._oDynStyles
     * @type Object
     * @private
     * @static     
     */
    _oDynStyles : {},

    /**
     * Element reference to shared Column drag target.
     *
     * @property DataTable._elColumnDragTarget
     * @type HTMLElement
     * @private
     * @static 
     */
    _elColumnDragTarget : null,

    /**
     * Element reference to shared Column resizer proxy.
     *
     * @property DataTable._elColumnResizerProxy
     * @type HTMLElement
     * @private
     * @static 
     */
    _elColumnResizerProxy : null,

    /////////////////////////////////////////////////////////////////////////
    //
    // Private static methods
    //
    /////////////////////////////////////////////////////////////////////////

    /**
     * Clones object literal or array of object literals.
     *
     * @method DataTable._cloneObject
     * @param o {Object} Object.
     * @private
     * @static     
     */
    _cloneObject : function(o) {
        if(!lang.isValue(o)) {
            return o;
        }
        
        var copy = {};
        
        if(lang.isArray(o)) {
            var array = [];
            for(var i=0,len=o.length;i<len;i++) {
                array[i] = DT._cloneObject(o[i]);
            }
            copy = array;
        }
        else if(o.constructor && (o.constructor == Object)) { 
            for (var x in o){
                if(lang.hasOwnProperty(o, x)) {
                    if(lang.isValue(o[x]) && (o[x].constructor == Object) || lang.isArray(o[x])) {
                        copy[x] = DT._cloneObject(o[x]);
                    }
                    else {
                        copy[x] = o[x];
                    }
                }
            }
        }
        else {
            copy = o;
        }
    
        return copy;
    },

    /**
     * Creates HTML markup for shared Column drag target.
     *
     * @method DataTable._initColumnDragTargetEl
     * @return {HTMLElement} Reference to Column drag target. 
     * @private
     * @static 
     */
    _initColumnDragTargetEl : function() {
        if(!DT._elColumnDragTarget) {
            // Attach Column drag target element as first child of body
            var elColumnDragTarget = document.createElement('div');
            elColumnDragTarget.id = "yui-dt-coltarget";
            elColumnDragTarget.className = DT.CLASS_COLTARGET;
            elColumnDragTarget.style.display = "none";
            document.body.insertBefore(elColumnDragTarget, document.body.firstChild);

            // Internal tracker of Column drag target
            DT._elColumnDragTarget = elColumnDragTarget;
            
        }
        return DT._elColumnDragTarget;
    },

    /**
     * Creates HTML markup for shared Column resizer proxy.
     *
     * @method DataTable._initColumnResizerProxyEl
     * @return {HTMLElement} Reference to Column resizer proxy.
     * @private 
     * @static 
     */
    _initColumnResizerProxyEl : function() {
        if(!DT._elColumnResizerProxy) {

            // Attach Column resizer element as first child of body
            var elColumnResizerProxy = document.createElement("div");
            elColumnResizerProxy.id = "yui-dt-colresizerproxy";
            Dom.addClass(elColumnResizerProxy, DT.CLASS_RESIZERPROXY);
            document.body.insertBefore(elColumnResizerProxy, document.body.firstChild);

            // Internal tracker of Column resizer proxy
            DT._elColumnResizerProxy = elColumnResizerProxy;
        }
        return DT._elColumnResizerProxy;
    },

    /**
     * Outputs markup into the given TH based on given Column.
     *
     * @method DataTable.formatTheadCell
     * @param elCellLabel {HTMLElement} The label DIV element within the TH liner.
     * @param oColumn {YAHOO.widget.Column} Column instance.
     * @param oSelf {YAHOO.wiget.DataTable} DataTable instance.
     * @static
     */
    formatTheadCell : function(elCellLabel, oColumn, oSelf) {
        var sKey = oColumn.getKey();
        var sLabel = lang.isValue(oColumn.label) ? oColumn.label : sKey;

        // Add accessibility link for sortable Columns
        if(oColumn.sortable) {
            // Calculate the direction
            var sSortClass = oSelf.getColumnSortDir(oColumn);
            var sSortDir = (sSortClass === DT.CLASS_DESC) ? "descending" : "ascending";

            // Generate a unique HREF for visited status
            var sHref = oSelf.getId() + "-sort" + oColumn.getId() + "-" + sSortDir;
            
            // Generate a dynamic TITLE for sort status
            var sTitle = "Click to sort " + sSortDir;
            
            // Format the element
            elCellLabel.innerHTML = "<a href=\"" + sHref + "\" title=\"" + sTitle + "\" class=\"" + DT.CLASS_SORTABLE + "\">" + sLabel + "</a>";
        }
        // Just display the label for non-sortable Columns
        else {
            elCellLabel.innerHTML = sLabel;
        }
    },

    /**
     * Formats a BUTTON element.
     *
     * @method DataTable.formatButton
     * @param el {HTMLElement} The element to format with markup.
     * @param oRecord {YAHOO.widget.Record} Record instance.
     * @param oColumn {YAHOO.widget.Column} Column instance.
     * @param oData {Object | Boolean} Data value for the cell. By default, the value
     * is what gets written to the BUTTON.
     * @static
     */
    formatButton : function(el, oRecord, oColumn, oData) {
        var sValue = lang.isValue(oData) ? oData : "Click";
        //TODO: support YAHOO.widget.Button
        //if(YAHOO.widget.Button) {

        //}
        //else {
            el.innerHTML = "<button type=\"button\" class=\""+
                    DT.CLASS_BUTTON + "\">" + sValue + "</button>";
        //}
    },

    /**
     * Formats a CHECKBOX element.
     *
     * @method DataTable.formatCheckbox
     * @param el {HTMLElement} The element to format with markup.
     * @param oRecord {YAHOO.widget.Record} Record instance.
     * @param oColumn {YAHOO.widget.Column} Column instance.
     * @param oData {Object | Boolean} Data value for the cell. Can be a simple
     * Boolean to indicate whether checkbox is checked or not. Can be object literal
     * {checked:bBoolean, label:sLabel}. Other forms of oData require a custom
     * formatter.
     * @static
     */
    formatCheckbox : function(el, oRecord, oColumn, oData) {
        var bChecked = oData;
        bChecked = (bChecked) ? " checked" : "";
        el.innerHTML = "<input type=\"checkbox\"" + bChecked +
                " class=\"" + DT.CLASS_CHECKBOX + "\">";
    },

    /**
     * Formats currency. Default unit is USD.
     *
     * @method DataTable.formatCurrency
     * @param el {HTMLElement} The element to format with markup.
     * @param oRecord {YAHOO.widget.Record} Record instance.
     * @param oColumn {YAHOO.widget.Column} Column instance.
     * @param oData {Number} Data value for the cell.
     * @static
     */
    formatCurrency : function(el, oRecord, oColumn, oData) {
        el.innerHTML = util.Number.format(oData, {
                prefix:"$",
                decimalPlaces:2,
                decimalSeparator:".",
                thousandsSeparator:","
            });
    },

    /**
     * Formats JavaScript Dates.
     *
     * @method DataTable.formatDate
     * @param el {HTMLElement} The element to format with markup.
     * @param oRecord {YAHOO.widget.Record} Record instance.
     * @param oColumn {YAHOO.widget.Column} Column instance.
     * @param oData {Object} Data value for the cell, or null.
     * @static
     */
    formatDate : function(el, oRecord, oColumn, oData) {
        el.innerHTML = util.Date.format(oData, {format:"MM/DD/YYYY"});
    },

    /**
     * Formats SELECT elements.
     *
     * @method DataTable.formatDropdown
     * @param el {HTMLElement} The element to format with markup.
     * @param oRecord {YAHOO.widget.Record} Record instance.
     * @param oColumn {YAHOO.widget.Column} Column instance.
     * @param oData {Object} Data value for the cell, or null.
     * @static
     */
    formatDropdown : function(el, oRecord, oColumn, oData) {
        var selectedValue = (lang.isValue(oData)) ? oData : oRecord.getData(oColumn.key);
        var options = (lang.isArray(oColumn.dropdownOptions)) ?
                oColumn.dropdownOptions : null;

        var selectEl;
        var collection = el.getElementsByTagName("select");

        // Create the form element only once, so we can attach the onChange listener
        if(collection.length === 0) {
            // Create SELECT element
            selectEl = document.createElement("select");
            Dom.addClass(selectEl, DT.CLASS_DROPDOWN);
            selectEl = el.appendChild(selectEl);

            // Add event listener
            Ev.addListener(selectEl,"change",this._onDropdownChange,this);
        }

        selectEl = collection[0];

        // Update the form element
        if(selectEl) {
            // Clear out previous options
            selectEl.innerHTML = "";

            // We have options to populate
            if(options) {
                // Create OPTION elements
                for(var i=0; i<options.length; i++) {
                    var option = options[i];
                    var optionEl = document.createElement("option");
                    optionEl.value = (lang.isValue(option.value)) ?
                            option.value : option;
                    optionEl.innerHTML = (lang.isValue(option.text)) ?
                            option.text : option;
                    optionEl = selectEl.appendChild(optionEl);
                    if (optionEl.value == selectedValue) {
                        optionEl.selected = true;
                    }
                }
            }
            // Selected value is our only option
            else {
                selectEl.innerHTML = "<option selected value=\"" + selectedValue + "\">" + selectedValue + "</option>";
            }
        }
        else {
            el.innerHTML = lang.isValue(oData) ? oData : "";
        }
    },

    /**
     * Formats emails.
     *
     * @method DataTable.formatEmail
     * @param el {HTMLElement} The element to format with markup.
     * @param oRecord {YAHOO.widget.Record} Record instance.
     * @param oColumn {YAHOO.widget.Column} Column instance.
     * @param oData {Object} Data value for the cell, or null.
     * @static
     */
    formatEmail : function(el, oRecord, oColumn, oData) {
        if(lang.isString(oData)) {
            el.innerHTML = "<a href=\"mailto:" + oData + "\">" + oData + "</a>";
        }
        else {
            el.innerHTML = lang.isValue(oData) ? oData : "";
        }
    },

    /**
     * Formats links.
     *
     * @method DataTable.formatLink
     * @param el {HTMLElement} The element to format with markup.
     * @param oRecord {YAHOO.widget.Record} Record instance.
     * @param oColumn {YAHOO.widget.Column} Column instance.
     * @param oData {Object} Data value for the cell, or null.
     * @static
     */
    formatLink : function(el, oRecord, oColumn, oData) {
        if(lang.isString(oData)) {
            el.innerHTML = "<a href=\"" + oData + "\">" + oData + "</a>";
        }
        else {
            el.innerHTML = lang.isValue(oData) ? oData : "";
        }
    },

    /**
     * Formats numbers.
     *
     * @method DataTable.formatNumber
     * @param el {HTMLElement} The element to format with markup.
     * @param oRecord {YAHOO.widget.Record} Record instance.
     * @param oColumn {YAHOO.widget.Column} Column instance.
     * @param oData {Object} Data value for the cell, or null.
     * @static
     */
    formatNumber : function(el, oRecord, oColumn, oData) {
        if(lang.isNumber(oData)) {
            el.innerHTML = oData;
        }
        else {
            el.innerHTML = lang.isValue(oData) ? oData : "";
        }
    },

    /**
     * Formats INPUT TYPE=RADIO elements.
     *
     * @method DataTable.formatRadio
     * @param el {HTMLElement} The element to format with markup.
     * @param oRecord {YAHOO.widget.Record} Record instance.
     * @param oColumn {YAHOO.widget.Column} Column instance.
     * @param oData {Object} (Optional) Data value for the cell.
     * @static
     */
    formatRadio : function(el, oRecord, oColumn, oData) {
        var bChecked = oData;
        bChecked = (bChecked) ? " checked" : "";
        el.innerHTML = "<input type=\"radio\"" + bChecked +
                " name=\"col" + oColumn.getId() + "-radio\"" +
                " class=\"" + DT.CLASS_RADIO+ "\">";
    },

    /**
     * Formats text strings.
     *
     * @method DataTable.formatText
     * @param el {HTMLElement} The element to format with markup.
     * @param oRecord {YAHOO.widget.Record} Record instance.
     * @param oColumn {YAHOO.widget.Column} Column instance.
     * @param oData {Object} (Optional) Data value for the cell.
     * @static
     */
    formatText : function(el, oRecord, oColumn, oData) {
        var value = (lang.isValue(oRecord.getData(oColumn.key))) ?
                oRecord.getData(oColumn.key) : "";
        //TODO: move to util function
        el.innerHTML = value.toString().replace(/&/g, "&#38;").replace(/</g, "&#60;").replace(/>/g, "&#62;");
    },

    /**
     * Formats TEXTAREA elements.
     *
     * @method DataTable.formatTextarea
     * @param el {HTMLElement} The element to format with markup.
     * @param oRecord {YAHOO.widget.Record} Record instance.
     * @param oColumn {YAHOO.widget.Column} Column instance.
     * @param oData {Object} (Optional) Data value for the cell.
     * @static
     */
    formatTextarea : function(el, oRecord, oColumn, oData) {
        var value = (lang.isValue(oRecord.getData(oColumn.key))) ?
                oRecord.getData(oColumn.key) : "";
        var markup = "<textarea>" + value + "</textarea>";
        el.innerHTML = markup;
    },

    /**
     * Formats INPUT TYPE=TEXT elements.
     *
     * @method DataTable.formatTextbox
     * @param el {HTMLElement} The element to format with markup.
     * @param oRecord {YAHOO.widget.Record} Record instance.
     * @param oColumn {YAHOO.widget.Column} Column instance.
     * @param oData {Object} (Optional) Data value for the cell.
     * @static
     */
    formatTextbox : function(el, oRecord, oColumn, oData) {
        var value = (lang.isValue(oRecord.getData(oColumn.key))) ?
                oRecord.getData(oColumn.key) : "";
        var markup = "<input type=\"text\" value=\"" + value + "\">";
        el.innerHTML = markup;
    },

    /**
     * Handles Paginator changeRequest events for static DataSources
     * (i.e. DataSources that return all data immediately)
     * @method DataTable.handleSimplePagination
     * @param {object} the requested state of the pagination
     * @param {DataTable} the DataTable instance
     * @static     
     */
    handleSimplePagination : function (oState,self) {
        // Set the core pagination values silently (the second param)
        // to avoid looping back through the changeRequest mechanism
        oState.paginator.setTotalRecords(oState.totalRecords,true);
        oState.paginator.setStartIndex(oState.recordOffset,true);
        oState.paginator.setRowsPerPage(oState.rowsPerPage,true);

        self.render();
    },

    /**
     * Handles Paginator changeRequest events for dynamic DataSources
     * such as DataSource.TYPE_XHR or DataSource.TYPE_JSFUNCTION.
     * @method DataTable.handleDataSourcePagination
     * @param {object} the requested state of the pagination
     * @param {DataTable} the DataTable instance
     * @static     
     */
    handleDataSourcePagination : function (oState,self) {
        var requestedRecords = oState.records[1] - oState.recordOffset;

        // Translate the proposed page state into a DataSource request param
        var generateRequest = self.get('generateRequest');
        var request = generateRequest({ pagination : oState }, self);

        var callback = {
            success : self.onDataReturnSetRows,
            failure : self.onDataReturnSetRows,
            argument : {
                startIndex : oState.recordOffset,
                pagination : oState
            },
            scope : self
        };

        self._oDataSource.sendRequest(request, callback);
    },

    /**
     * Enables CHECKBOX Editor.
     *
     * @method DataTable.editCheckbox
     * @param oEditor {Object} Object literal representation of Editor values.
     * @param oSelf {YAHOO.wiget.DataTable} Reference back to DataTable instance.
     * @static
     */
    //DT.editCheckbox = function(elContainer, oRecord, oColumn, oEditor, oSelf) 
    editCheckbox : function(oEditor, oSelf) {
        var elCell = oEditor.cell;
        var oRecord = oEditor.record;
        var oColumn = oEditor.column;
        var elContainer = oEditor.container;
        var aCheckedValues = oEditor.value;
        if(!lang.isArray(aCheckedValues)) {
            aCheckedValues = [aCheckedValues];
        }

        // Checkboxes
        if(oColumn.editorOptions && lang.isArray(oColumn.editorOptions.checkboxOptions)) {
            var checkboxOptions = oColumn.editorOptions.checkboxOptions;
            var checkboxValue, checkboxId, elLabel, j, k;
            // First create the checkbox buttons in an IE-friendly way
            for(j=0; j<checkboxOptions.length; j++) {
                checkboxValue = lang.isValue(checkboxOptions[j].label) ?
                        checkboxOptions[j].label : checkboxOptions[j];
                checkboxId =  oSelf.getId() + "-editor-checkbox" + j;
                elContainer.innerHTML += "<input type=\"checkbox\"" +
                        " name=\"" + oSelf.getId() + "-editor-checkbox\"" +
                        " value=\"" + checkboxValue + "\"" +
                        " id=\"" +  checkboxId + "\">";
                // Then create the labels in an IE-friendly way
                elLabel = elContainer.appendChild(document.createElement("label"));
                elLabel.htmlFor = checkboxId;
                elLabel.innerHTML = checkboxValue;
            }
            var aCheckboxEls = [];
            var checkboxEl;
            // Loop through checkboxes to check them
            for(j=0; j<checkboxOptions.length; j++) {
                checkboxEl = Dom.get(oSelf.getId() + "-editor-checkbox" + j);
                aCheckboxEls.push(checkboxEl);
                for(k=0; k<aCheckedValues.length; k++) {
                    if(checkboxEl.value === aCheckedValues[k]) {
                        checkboxEl.checked = true;
                    }
                }
                // Focus the first checkbox
                if(j===0) {
                    oSelf._focusEl(checkboxEl);
                }
            }
            // Loop through checkboxes to assign click handlers
            for(j=0; j<checkboxOptions.length; j++) {
                checkboxEl = Dom.get(oSelf.getId() + "-editor-checkbox" + j);
                Ev.addListener(checkboxEl, "click", function(){
                    var aNewValues = [];
                    for(var m=0; m<aCheckboxEls.length; m++) {
                        if(aCheckboxEls[m].checked) {
                            aNewValues.push(aCheckboxEls[m].value);
                        }
                    }
                    oSelf._oCellEditor.value = aNewValues;
                    oSelf.fireEvent("editorUpdateEvent",{editor:oSelf._oCellEditor});
                });
            }
        }
    },

    /**
     * Enables Date Editor.
     *
     * @method DataTable.editDate
     * @param oEditor {Object} Object literal representation of Editor values.
     * @param oSelf {YAHOO.wiget.DataTable} Reference back to DataTable instance.
     * @static
     */
    editDate : function(oEditor, oSelf) {
        var elCell = oEditor.cell;
        var oRecord = oEditor.record;
        var oColumn = oEditor.column;
        var elContainer = oEditor.container;
        var value = oEditor.value;
        
        // Set a default
        if(!(value instanceof Date)) {
            value = oEditor.defaultValue || new Date();
        }

        // Calendar widget
        if(YAHOO.widget.Calendar) {
            var selectedValue = (value.getMonth()+1)+"/"+value.getDate()+"/"+value.getFullYear();
            var calContainer = elContainer.appendChild(document.createElement("div"));
            var calPrefix = oColumn.getColEl();
            calContainer.id = calPrefix + "-dateContainer";
            var calendar =
                    new YAHOO.widget.Calendar(calPrefix + "-date",
                    calContainer.id,
                    {selected:selectedValue, pagedate:value});
            calendar.render();
            calContainer.style.cssFloat = "none";

            if(ua.ie) {
                var calFloatClearer = elContainer.appendChild(document.createElement("br"));
                calFloatClearer.style.clear = "both";
            }

            calendar.selectEvent.subscribe(function(type, args, obj) {
                oSelf._oCellEditor.value = new Date(args[0][0][0], args[0][0][1]-1, args[0][0][2]);
                oSelf.fireEvent("editorUpdateEvent",{editor:oSelf._oCellEditor});
            });
        }
        else {
            //TODO;
        }
    },

    /**
     * Enables SELECT Editor.
     *
     * @method DataTable.editDropdown
     * @param oEditor {Object} Object literal representation of Editor values.
     * @param oSelf {YAHOO.wiget.DataTable} Reference back to DataTable instance.
     * @static
     */
    editDropdown : function(oEditor, oSelf) {
        var elCell = oEditor.cell;
        var oRecord = oEditor.record;
        var oColumn = oEditor.column;
        var elContainer = oEditor.container;
        var value = oEditor.value;
        
        // Set a default
        if(!lang.isValue(value)) {
            value = oEditor.defaultValue;
        }


        // Textbox
        var elDropdown = elContainer.appendChild(document.createElement("select"));
        var dropdownOptions = (oColumn.editorOptions && lang.isArray(oColumn.editorOptions.dropdownOptions)) ?
                oColumn.editorOptions.dropdownOptions : [];
        for(var j=0; j<dropdownOptions.length; j++) {
            var dropdownOption = dropdownOptions[j];
            var elOption = document.createElement("option");
            elOption.value = (lang.isValue(dropdownOption.value)) ?
                    dropdownOption.value : dropdownOption;
            elOption.innerHTML = (lang.isValue(dropdownOption.text)) ?
                    dropdownOption.text : dropdownOption;
            elOption = elDropdown.appendChild(elOption);
            if(value === elDropdown.options[j].value) {
                elDropdown.options[j].selected = true;
            }
        }

        // Set up a listener on each check box to track the input value
        Ev.addListener(elDropdown, "change",
            function(){
                oSelf._oCellEditor.value = elDropdown[elDropdown.selectedIndex].value;
                oSelf.fireEvent("editorUpdateEvent",{editor:oSelf._oCellEditor});
        });

        // Focus the dropdown
        oSelf._focusEl(elDropdown);
    },

    /**
     * Enables INPUT TYPE=RADIO Editor.
     *
     * @method DataTable.editRadio
     * @param oEditor {Object} Object literal representation of Editor values.
     * @param oSelf {YAHOO.wiget.DataTable} Reference back to DataTable instance.
     * @static
     */
    editRadio : function(oEditor, oSelf) {
        var elCell = oEditor.cell;
        var oRecord = oEditor.record;
        var oColumn = oEditor.column;
        var elContainer = oEditor.container;
        var value = oEditor.value;

        // Set a default
        if(!lang.isValue(value)) {
            value = oEditor.defaultValue;
        }

        // Radios
        if(oColumn.editorOptions && lang.isArray(oColumn.editorOptions.radioOptions)) {
            var radioOptions = oColumn.editorOptions.radioOptions;
            var radioValue, radioId, elLabel, j;
            // First create the radio buttons in an IE-friendly way
            for(j=0; j<radioOptions.length; j++) {
                radioValue = lang.isValue(radioOptions[j].label) ?
                        radioOptions[j].label : radioOptions[j];
                radioId =  oSelf.getId() + "-col" + oColumn.getId() + "-radioeditor" + j;
                elContainer.innerHTML += "<input type=\"radio\"" +
                        " name=\"" + oSelf.getId() + "-editor-radio\"" +
                        " value=\"" + radioValue + "\"" +
                        " id=\"" +  radioId + "\">";
                // Then create the labels in an IE-friendly way
                elLabel = elContainer.appendChild(document.createElement("label"));
                elLabel.htmlFor = radioId;
                elLabel.innerHTML = radioValue;
            }
            // Then check one, and assign click handlers
            for(j=0; j<radioOptions.length; j++) {
                var radioEl = Dom.get(oSelf.getId() + "-col" + oColumn.getId() + "-radioeditor" + j);
                if(value === radioEl.value) {
                    radioEl.checked = true;
                    oSelf._focusEl(radioEl);
                }
                Ev.addListener(radioEl, "click",
                    function(){
                        oSelf._oCellEditor.value = this.value;
                        oSelf.fireEvent("editorUpdateEvent",{editor:oSelf._oCellEditor});
                });
            }
        }
    },

    /**
     * Enables TEXTAREA Editor.
     *
     * @method DataTable.editTextarea
     * @param oEditor {Object} Object literal representation of Editor values.
     * @param oSelf {YAHOO.wiget.DataTable} Reference back to DataTable instance.
     * @static
     */
    editTextarea : function(oEditor, oSelf) {
       var elCell = oEditor.cell;
       var oRecord = oEditor.record;
       var oColumn = oEditor.column;
       var elContainer = oEditor.container;
       var value = oEditor.value;

        // Set a default
        if(!lang.isValue(value)) {
            value = oEditor.defaultValue || "";
        }

        // Textarea
        var elTextarea = elContainer.appendChild(document.createElement("textarea"));
        elTextarea.style.width = elCell.offsetWidth + "px"; //(parseInt(elCell.offsetWidth,10)) + "px";
        elTextarea.style.height = "3em"; //(parseInt(elCell.offsetHeight,10)) + "px";
        elTextarea.value = value;

        // Set up a listener on each check box to track the input value
        Ev.addListener(elTextarea, "keyup", function(){
            //TODO: set on a timeout
            oSelf._oCellEditor.value = elTextarea.value;
            oSelf.fireEvent("editorUpdateEvent",{editor:oSelf._oCellEditor});
        });

        // Select the text
        elTextarea.focus();
        elTextarea.select();
    },

    /**
     * Enables INPUT TYPE=TEXT Editor.
     *
     * @method DataTable.editTextbox
     * @param oEditor {Object} Object literal representation of Editor values.
     * @param oSelf {YAHOO.wiget.DataTable} Reference back to DataTable instance.
     * @static
     */
    editTextbox : function(oEditor, oSelf) {
       var elCell = oEditor.cell;
       var oRecord = oEditor.record;
       var oColumn = oEditor.column;
       var elContainer = oEditor.container;
       var value = oEditor.value;

        // Set a default
        if(!lang.isValue(value)) {
            value = oEditor.defaultValue || "";
        }

        // Textbox
        var elTextbox;
        // Bug 1802582: SF3/Mac needs a form element wrapping the input
        if(ua.webkit>420) {
            elTextbox = elContainer.appendChild(document.createElement("form")).appendChild(document.createElement("input"));
        }
        else {
            elTextbox = elContainer.appendChild(document.createElement("input"));
        }
        elTextbox.type = "text";
        elTextbox.style.width = elCell.offsetWidth + "px"; //(parseInt(elCell.offsetWidth,10)) + "px";
        //elTextbox.style.height = "1em"; //(parseInt(elCell.offsetHeight,10)) + "px";
        elTextbox.value = value;

        // Bug: 1802582 Set up a listener on each textbox to track on keypress
        // since SF/OP can't preventDefault on keydown
        Ev.addListener(elTextbox, "keypress", function(v){
            // Prevent form submit
            // Save on "enter"
            if((v.keyCode === 13)) {
                YAHOO.util.Event.preventDefault(v);
                oSelf.saveCellEditor();
            }
        });

        // Set up a listener on each textbox to track the input value
        Ev.addListener(elTextbox, "keyup", function(v){
            // Update the tracker value
            oSelf._oCellEditor.value = elTextbox.value;
            oSelf.fireEvent("editorUpdateEvent",{editor:oSelf._oCellEditor});
        });

        // Select the text
        elTextbox.focus();
        elTextbox.select();
    },

    /**
     * Validates Editor input value to type Number, doing type conversion as
     * necessary. A valid Number value is return, else the previous value is returned
     * if input value does not validate.
     *
     *
     * @method DataTable.validateNumber
     * @param oData {Object} Data to validate.
     * @static
    */
    validateNumber : function(oData) {
        //Convert to number
        var number = oData * 1;

        // Validate
        if(lang.isNumber(number)) {
            return number;
        }
        else {
            YAHOO.log("Could not validate data " + lang.dump(oData) + " to type Number", "warn", this.toString());
            return null;
        }
    },

    /**
     * Translates (proposed) DataTable state data into a form consumable by
     * DataSource sendRequest as the request parameter.  Use
     * set('generateRequest', yourFunc) to use a custom function rather than this
     * one.
     * @method DataTable._generateRequest
     * @param oData {Object} Object literal defining the current or proposed state
     * @param oDataTable {DataTable} Reference to the DataTable instance
     * @returns {MIXED} Returns appropriate value based on DataSource type
     * @private
     * @static     
     */
    _generateRequest : function (oData, oDataTable) {
        var request = oData;

        if (oData.pagination) {
            if (oDataTable._oDataSource.dataType === DS.TYPE_XHR) {
                request = '?page=' +         oData.pagination.page +
                          '&recordOffset=' + oData.pagination.recordOffset +
                          '&rowsPerPage=' +  oData.pagination.rowsPerPage;
            }
        }
        
        return request;
    }
});

// Do in separate step so referenced properties are available
// TODO: editor shortcuts
/**
 * Cell formatting functions.
 * @property DataTable.Formatter
 * @type Object
 * @static
 */
DT.Formatter = {
    button   : DT.formatButton,
    checkbox : DT.formatCheckbox,
    currency : DT.formatCurrency,
    "date"   : DT.formatDate,
    dropdown : DT.formatDropdown,
    email    : DT.formatEmail,
    link     : DT.formatLink,
    "number" : DT.formatNumber,
    radio    : DT.formatRadio,
    text     : DT.formatText,
    textarea : DT.formatTextarea,
    textbox  : DT.formatTextbox
};

lang.extend(DT, util.Element, {

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
    DT.superclass.initAttributes.call(this, oConfigs);

    /**
    * @attribute summary
    * @description Value for the SUMMARY attribute.
    * @type String
    */
    this.setAttributeConfig("summary", {
        value: null,
        validator: lang.isString,
        method: function(sSummary) {
            this._elThead.parentNode.summary = sSummary;
        }
    });

    /**
    * @attribute selectionMode
    * @description Specifies row or cell selection mode. Accepts the following strings:
    *    <dl>
    *      <dt>"standard"</dt>
    *      <dd>Standard row selection with support for modifier keys to enable
    *      multiple selections.</dd>
    *
    *      <dt>"single"</dt>
    *      <dd>Row selection with modifier keys disabled to not allow
    *      multiple selections.</dd>
    *
    *      <dt>"singlecell"</dt>
    *      <dd>Cell selection with modifier keys disabled to not allow
    *      multiple selections.</dd>
    *
    *      <dt>"cellblock"</dt>
    *      <dd>Cell selection with support for modifier keys to enable multiple
    *      selections in a block-fashion, like a spreadsheet.</dd>
    *
    *      <dt>"cellrange"</dt>
    *      <dd>Cell selection with support for modifier keys to enable multiple
    *      selections in a range-fashion, like a calendar.</dd>
    *    </dl>
    *
    * @default "standard"
    * @type String
    */
    this.setAttributeConfig("selectionMode", {
        value: "standard",
        validator: lang.isString
    });

    /**
    * @attribute initialRequest
    * @description Defines the initial request that gets sent to the DataSource
    * during initialization. Value is ignored if initialLoad is set to any value
    * other than true.    
    * @type MIXED
    * @default null
    */
    this.setAttributeConfig("initialRequest", {
        value: null
    });

    /**
    * @attribute initialLoad
    * @description Determines whether or not to load data at instantiation. By
    * default, will trigger a sendRequest() to the DataSource and pass in the
    * request defined by initialRequest. If set to false, data will not load
    * at instantiation. Alternatively, implementers who wish to work with a 
    * custom payload may pass in an object literal with the following values:
    *     
    *    <dl>
    *      <dt>request (MIXED)</dt>
    *      <dd>Request value.</dd>
    *
    *      <dt>argument (MIXED)</dt>
    *      <dd>Custom data that will be passed through to the callback function.</dd>
    *    </dl>
    *
    *                    
    * @type Boolean | Object
    * @default true
    */
    this.setAttributeConfig("initialLoad", {
        value: true
    });

    /**
     * @attribute generateRequest
     * @description A function used to translate proposed DataTable state info
     * into a value which is then passed to the DataSource's sendRequest method.
     * This function is called to get the DataTable's initial data as well as
     * any data changes or requests such as pagination or sorting.  The method
     * is passed two params, an object literal with the state data and a
     * reference to the DataTable.
     * @type function
     * @default YAHOO.widget.DataTable._generateRequest
     */
    this.setAttributeConfig("generateRequest", {
        value: DT._generateRequest,
        validator: lang.isFunction
    });

    /**
    * @attribute sortedBy
    * @description Object literal provides metadata for initial sort values if
    * data will arrive pre-sorted:
    * <dl>
    *     <dt>sortedBy.key</dt>
    *     <dd>{String} Key of sorted Column</dd>
    *     <dt>sortedBy.dir</dt>
    *     <dd>{String} Initial sort direction, either YAHOO.widget.DataTable.CLASS_ASC or YAHOO.widget.DataTable.CLASS_DESC</dd>
    * </dl>
    * @type Object | null
    */
    this.setAttributeConfig("sortedBy", {
        value: null,
        // TODO: accepted array for nested sorts
        validator: function(oNewSortedBy) {
            if(oNewSortedBy) {
                return ((oNewSortedBy.constructor == Object) && oNewSortedBy.key);
            }
            else {
                return (oNewSortedBy === null);
            }
        },
        method: function(oNewSortedBy) {
            // Remove ASC/DESC from TH
            var oOldSortedBy = this.get("sortedBy");
            if(oOldSortedBy && (oOldSortedBy.constructor == Object) && oOldSortedBy.key) {
                var oldColumn = this._oColumnSet.getColumn(oOldSortedBy.key);
                var oldThEl = this.getThEl(oldColumn);
                Dom.removeClass(oldThEl, DT.CLASS_ASC);
                Dom.removeClass(oldThEl, DT.CLASS_DESC);
            }

            // Set ASC/DESC on TH
            if(oNewSortedBy) {
                var column = (oNewSortedBy.column) ? oNewSortedBy.column : this._oColumnSet.getColumn(oNewSortedBy.key);
                if(column) {
                    // Backward compatibility
                    if(oNewSortedBy.dir && ((oNewSortedBy.dir == "asc") ||  (oNewSortedBy.dir == "desc"))) {
                        var newClass = (oNewSortedBy.dir == "desc") ?
                                DT.CLASS_DESC :
                                DT.CLASS_ASC;
                        Dom.addClass(column.getThEl(), newClass);
                    }
                    else {
                         var sortClass = oNewSortedBy.dir || DT.CLASS_ASC;
                         Dom.addClass(column.getThEl(), sortClass);
                    }
                }
            }
        }
    });
    
    /**
    * @attribute paginator
    * @description Stores an instance of Pag, or (for
    * backward compatibility), an object literal of pagination values in the
    * following form:<br>
    *   { containers:[], // UI container elements <br>
    *   rowsPerPage:500, // 500 rows <br>
    *   currentPage:1,  // page one <br>
    *   pageLinks:0,    // show all links <br>
    *   pageLinksStart:1, // first link is page 1 <br>
    *   dropdownOptions:null, // no dropdown <br>
    *   links: [], // links elements <br>
    *   dropdowns: [] } //dropdown elements
    *
    * @default null
    * @type {Object|YAHOO.widget.Paginator}
    */
    this.setAttributeConfig("paginator", {
        value : { // Backward compatibility
            rowsPerPage:500, // 500 rows per page
            currentPage:1,  // show page one
            startRecordIndex:0, // start with first Record
            totalRecords:0, // how many Records total
            totalPages:0, // how many pages total
            rowsThisPage:0, // how many rows this page
            pageLinks:0,    // show all links
            pageLinksStart:1, // first link is page 1
            dropdownOptions: null, //no dropdown
            containers:[], // Paginator container element references
            dropdowns: [], //dropdown element references,
            links: [] // links elements
        },
        validator : function (oNewPaginator) {
            if (typeof oNewPaginator === 'object' && oNewPaginator) {
                if (oNewPaginator instanceof Pag) {
                    return true;
                }
                else {
                    // Backward compatibility
                    if(oNewPaginator && (oNewPaginator.constructor == Object)) {
                        // Check for incomplete set of values
                        if((oNewPaginator.rowsPerPage !== undefined) &&
                                (oNewPaginator.currentPage !== undefined) &&
                                (oNewPaginator.startRecordIndex !== undefined) &&
                                (oNewPaginator.totalRecords !== undefined) &&
                                (oNewPaginator.totalPages !== undefined) &&
                                (oNewPaginator.rowsThisPage !== undefined) &&
                                (oNewPaginator.pageLinks !== undefined) &&
                                (oNewPaginator.pageLinksStart !== undefined) &&
                                (oNewPaginator.dropdownOptions !== undefined) &&
                                (oNewPaginator.containers !== undefined) &&
                                (oNewPaginator.dropdowns !== undefined) &&
                                (oNewPaginator.links !== undefined)) {

                            // Validate each value
                            if(lang.isNumber(oNewPaginator.rowsPerPage) &&
                                    lang.isNumber(oNewPaginator.currentPage) &&
                                    lang.isNumber(oNewPaginator.startRecordIndex) &&
                                    lang.isNumber(oNewPaginator.totalRecords) &&
                                    lang.isNumber(oNewPaginator.totalPages) &&
                                    lang.isNumber(oNewPaginator.rowsThisPage) &&
                                    lang.isNumber(oNewPaginator.pageLinks) &&
                                    lang.isNumber(oNewPaginator.pageLinksStart) &&
                                    (lang.isArray(oNewPaginator.dropdownOptions) || lang.isNull(oNewPaginator.dropdownOptions)) &&
                                    lang.isArray(oNewPaginator.containers) &&
                                    lang.isArray(oNewPaginator.dropdowns) &&
                                    lang.isArray(oNewPaginator.links)) {
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        },
        method : function (oNewPaginator) {
            // Hook into the pagintor's change event
            if (oNewPaginator instanceof Pag) {
                oNewPaginator.subscribe('changeRequest', this.onPaginatorChange, this, true);

                // If the paginator has no configured containers, add some
                var containers = oNewPaginator.getContainerNodes();
                if (!containers.length) {
                    // Build the container nodes
                    var c_above = document.createElement('div');
                    c_above.id = this._sId + "-paginator0";
                    this._elContainer.insertBefore(c_above,this._elContainer.firstChild);

                    // ...and one below the table
                    var c_below = document.createElement('div');
                    c_below.id = this._sId + "-paginator1";
                    this._elContainer.appendChild(c_below);

                    containers = [c_above, c_below];
                    Dom.addClass(containers,
                                DT.CLASS_PAGINATOR);

                    oNewPaginator.set('containers',containers);
                }
            }
        }
    });

    /**
    * @attribute paginated
    * @deprecated No longer used, as long as "paginator" value is an instance of
    * Paginator class.  
    */
    this.setAttributeConfig("paginated", {
        value: false,
        validator: lang.isBoolean,
        method : function (on) {
            var curVal = this.get('paginated');
            var i,len;
            if (on == curVal) {
                return;
            }

            var oPaginator  = this.get('paginator');
            if (!(oPaginator instanceof Pag)) {
                // Backward compatibility--pagination generated here
                oPaginator = oPaginator || {
                    rowsPerPage     : 500,  // 500 rows per page
                    currentPage     : 1,    // show page one
                    startRecordIndex: 0,    // start with first Record
                    totalRecords    : 0,    // how many Records total
                    totalPages      : 0,    // how many pages total
                    rowsThisPage    : 0,    // how many rows this page
                    pageLinks       : 0,    // show all links
                    pageLinksStart  : 1,    // first link is page 1
                    dropdownOptions : null, // no dropdown
                    containers      : [],   // Paginator container element references
                    dropdowns       : [],   // dropdown element references,
                    links           : []    // links elements
                };
                var aContainerEls = oPaginator.containers;

                // Paginator is enabled
                if(on) {
                    // No containers found, create two from scratch
                    if(aContainerEls.length === 0) {
                        // One before TABLE
                        var pag0 = document.createElement("span");
                        pag0.id = this._sId + "-paginator0";
                        Dom.addClass(pag0, DT.CLASS_PAGINATOR);
                        pag0 = this._elContainer.insertBefore(pag0, this._elContainer.firstChild);
                        aContainerEls.push(pag0);

                        // One after TABLE
                        var pag1 = document.createElement("span");
                        pag1.id = this._sId + "-paginator1";
                        Dom.addClass(pag1, DT.CLASS_PAGINATOR);
                        pag1 = this._elContainer.appendChild(pag1);
                        aContainerEls.push(pag1);

                        // (re)set the paginator value directly
                        oPaginator.containers = aContainerEls;
                        this._configs.paginator.value= oPaginator;
                    }
                    else {
                        // Show each container
                        for(i=0; i<aContainerEls.length; i++) {
                            aContainerEls[i].style.display = "";
                        }
                    }

                    // Links are enabled
                    if(oPaginator.pageLinks > -1) {
                        var aLinkEls = oPaginator.links;
                        // No links containers found, create from scratch
                        if(aLinkEls.length === 0) {
                            for(i=0; i<aContainerEls.length; i++) {
                                // Create one links container per Paginator container
                                var linkEl = document.createElement("span");
                                linkEl.id = "yui-dt-pagselect"+i;
                                linkEl = aContainerEls[i].appendChild(linkEl);

                                // Add event listener
                                //TODO: anon fnc
                                Ev.addListener(linkEl,"click",this._onPaginatorLinkClick,this);

                                 // Add directly to tracker
                                this._configs.paginator.value.links.push(linkEl);
                           }
                       }
                    }

                    for(i=0; i<aContainerEls.length; i++) {
                        // Create one SELECT element per Paginator container
                        var selectEl = document.createElement("select");
                        Dom.addClass(selectEl, DT.CLASS_DROPDOWN);
                        selectEl = aContainerEls[i].appendChild(selectEl);
                        selectEl.id = "yui-dt-pagselect"+i;

                        // Add event listener
                        //TODO: anon fnc
                        Ev.addListener(selectEl,"change",this._onPaginatorDropdownChange,this);

                        // Add DOM reference directly to tracker
                       this._configs.paginator.value.dropdowns.push(selectEl);

                        // Hide dropdown
                        if(!oPaginator.dropdownOptions) {
                            selectEl.style.display = "none";
                        }
                    }

                    //TODO: fire paginatorDisabledEvent & add to api doc
                    YAHOO.log("Paginator enabled", "info", this.toString());
                }
                // Pagination is disabled
                else {
                    // Containers found
                    if(aContainerEls.length > 0) {
                        // Destroy or just hide?

                        // Hide each container
                        for(i=0; i<aContainerEls.length; i++) {
                            aContainerEls[i].style.display = "none";
                        }

                        /*TODO?
                        // Destroy each container
                        for(i=0; i<aContainerEls.length; i++) {
                            Ev.purgeElement(aContainerEls[i], true);
                            aContainerEls.innerHTML = null;
                            //TODO: remove container?
                            // aContainerEls[i].parentNode.removeChild(aContainerEls[i]);
                        }
                        */
                    }
                    //TODO: fire paginatorDisabledEvent & add to api doc
                    YAHOO.log("Paginator disabled", "info", this.toString());
                }
            }
        }
    });

    /**
     * @attribute paginationEventHandler
     * @description For use with Paginator pagination.  A
     * handler function that receives the changeRequest event from the
     * configured Paginator.  The handler method will be passed these
     * parameters:
     * <ol>
     * <li>oState {Object} - an object literal describing the requested
     * pagination state</li>
     * <li>oSelf {DataTable} - The DataTable instance.</li>
     * </ol>
     * 
     * For pagination through dynamic or server side data, assign
     * YAHOO.widget.DataTable.handleDataSourcePagination or your own custom
     * handler.
     * @type {function|Object}
     * @default YAHOO.widget.DataTable.handleSimplePagination
     */
    this.setAttributeConfig("paginationEventHandler", {
        value     : DT.handleSimplePagination,
        validator : lang.isObject
    });

    /**
    * @attribute caption
    * @description Value for the CAPTION element.
    * @type String
    */
    this.setAttributeConfig("caption", {
        value: null,
        validator: lang.isString,
        method: function(sCaption) {
            // Create CAPTION element
            if(!this._elCaption) {
                var bodyTable = this._elTbodyContainer.getElementsByTagName('table')[0];
                
                this._elCaption = bodyTable.createCaption();
            }
            // Set CAPTION value
            this._elCaption.innerHTML = sCaption;
        }
    });

    /**
    * @attribute width
    * @description Table width for scrollable tables
    * @type String
    */
    this.setAttributeConfig("width", {
        value: null,
        validator: lang.isString,
        method: function(oParam) {
            //TODO: repurpose?
            //this._elTheadContainer.style.width = oParam;
            //this._elTbodyContainer.style.width = oParam;            
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
            //TODO: repurpose?
            //this._elTbodyContainer.style.height = oParam;        
        }
    });

    /**
    * @attribute draggableColumns
    * @description True if Columns are draggable to reorder, false otherwise.
    * The Drag & Drop Utility is required to enable this feature. Only top-level
    * and non-nested Columns are draggable. Write once.
    * @default false
    * @type Boolean
    */
    this.setAttributeConfig("draggableColumns", {
        value: false,
        validator: lang.isBoolean,
        writeOnce: true
    });

    /**
     * @attribute renderLoopSize 	 
     * @description A value greater than 0 enables DOM rendering of rows to be
     * executed from a non-blocking timeout queue and sets how many rows to be
     * rendered per timeout. Recommended for very large data sets.     
     * @type Number 	 
     * @default 0 	 
     */ 	 
     this.setAttributeConfig("renderLoopSize", { 	 
         value: 0, 	 
         validator: lang.isNumber 	 
     }); 	 
},

/////////////////////////////////////////////////////////////////////////////
//
// Private member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * True if instance is initialized, so as to fire the initEvent rather than
 * renderEvent.
 *
 * @property _bInit
 * @type Boolean
 * @default true
 * @private
 */
_bInit : true,

/**
 * Index assigned to instance.
 *
 * @property _nIndex
 * @type Number
 * @private
 */
_nIndex : null,

/**
 * Counter for IDs assigned to TR elements.
 *
 * @property _nTrCount
 * @type Number
 * @private
 */
_nTrCount : 0,

/**
 * Counter for IDs assigned to TD elements.
 *
 * @property _nTdCount
 * @type Number
 * @private
 */
_nTdCount : 0,

/**
 * Unique id assigned to instance "yui-dtN", useful prefix for generating unique
 * DOM ID strings and log messages.
 *
 * @property _sId
 * @type String
 * @private
 */
_sId : null,

/**
 * Render chain.
 *
 * @property _oChainRender
 * @type YAHOO.util.Chain
 * @private
 */
_oChainRender : null,

/**
 * DOM reference to the container element for the DataTable instance into which
 * all other elements get created.
 *
 * @property _elContainer
 * @type HTMLElement
 * @private
 */
_elContainer : null,

/**
 * DOM reference to the TABLE element for the DataTable instance.
 *
 * @property _elTable
 * @type HTMLElement
 * @private
 */
_elTable : null,

/**
 * DOM reference to the CAPTION element for the DataTable instance.
 *
 * @property _elCaption
 * @type HTMLElement
 * @private
 */
_elCaption : null,

/**
 * DOM reference to the COLGROUP element for the DataTable instance.
 *
 * @property _elColgroup
 * @type HTMLElement
 * @private
 */
_elColgroup : null,

/**
 * DOM reference to the TABLE element for the DataTable instance.
 *
 * @property _elTable
 * @type HTMLElement
 * @private
 */
_elTable : null,

/**
 * DOM reference to the THEAD element for the DataTable instance.
 *
 * @property _elThead
 * @type HTMLElement
 * @private
 */
_elThead : null,

/**
 * DOM reference to the primary TBODY element for the DataTable instance.
 *
 * @property _elTbody
 * @type HTMLElement
 * @private
 */
_elTbody : null,

/**
 * DOM reference to the secondary TBODY element used to display DataTable messages.
 *
 * @property _elMsgTbody
 * @type HTMLElement
 * @private
 */
_elMsgTbody : null,

/**
 * DOM reference to the secondary TBODY element's single TR element used to display DataTable messages.
 *
 * @property _elMsgTbodyRow
 * @type HTMLElement
 * @private
 */
_elMsgTbodyRow : null,

/**
 * DOM reference to the secondary TBODY element's single TD element used to display DataTable messages.
 *
 * @property _elMsgTbodyCell
 * @type HTMLElement
 * @private
 */
_elMsgTbodyCell : null,

/**
 * DataSource instance for the DataTable instance.
 *
 * @property _oDataSource
 * @type YAHOO.util.DataSource
 * @private
 */
_oDataSource : null,

/**
 * ColumnSet instance for the DataTable instance.
 *
 * @property _oColumnSet
 * @type YAHOO.widget.ColumnSet
 * @private
 */
_oColumnSet : null,

/**
 * RecordSet instance for the DataTable instance.
 *
 * @property _oRecordSet
 * @type YAHOO.widget.RecordSet
 * @private
 */
_oRecordSet : null,

/**
 * ID string of first TR element of the current DataTable page.
 *
 * @property _sFirstTrId
 * @type String
 * @private
 */
_sFirstTrId : null,

/**
 * ID string of the last TR element of the current DataTable page.
 *
 * @property _sLastTrId
 * @type String
 * @private
 */
_sLastTrId : null,

/**
 * Template row to create all new rows from.
 * @property _elTrTemplate
 * @type {HTMLElement}
 * @private 
 */
_elTrTemplate : null,

/**
 * Sparse array of custom functions to set column widths for browsers that don't
 * support dynamic CSS rules.  Functions are added at the index representing
 * the number of rows they update.
 *
 * @property _aDynFunctions
 * @type Array
 * @private
 */
_aDynFunctions : [],





























/////////////////////////////////////////////////////////////////////////////
//
// Private methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Clears browser text selection. Useful to call on rowSelectEvent or
 * cellSelectEvent to prevent clicks or dblclicks from selecting text in the
 * browser.
 *
 * @method clearTextSelection
 */
clearTextSelection : function() {
    var sel;
    if(window.getSelection) {
    	sel = window.getSelection();
    }
    else if(document.getSelection) {
    	sel = document.getSelection();
    }
    else if(document.selection) {
    	sel = document.selection;
    }
    if(sel) {
        if(sel.empty) {
            sel.empty();
        }
        else if (sel.removeAllRanges) {
            sel.removeAllRanges();
        }
        else if(sel.collapse) {
            sel.collapse();
        }
    }
},

/**
 * Sets focus on the given element.
 *
 * @method _focusEl
 * @param el {HTMLElement} Element.
 * @private
 */
_focusEl : function(el) {
    el = el || this._elTbody;
    // http://developer.mozilla.org/en/docs/index.php?title=Key-navigable_custom_DHTML_widgets
    // The timeout is necessary in both IE and Firefox 1.5, to prevent scripts from doing
    // strange unexpected things as the user clicks on buttons and other controls.
    setTimeout(function() {
        try {
            el.focus();
        }
        catch(e) {
        }
    },0);
},

/**
 * Forces Gecko repaint.
 *
 * @method _repaintGecko
 * @el {HTMLElement} (Optional) Element to repaint, otherwise entire document body.
 * @private
 */
_repaintGecko : (ua.gecko) ? 
    function(el) {
        el = el || this._elContainer;
        var parent = el.parentNode;
        var nextSibling = el.nextSibling;
        parent.insertBefore(parent.removeChild(el), nextSibling);
    } : function() {},

/**
 * Forces Opera repaint.
 *
 * @method _repaintOpera
 * @private 
 */
_repaintOpera : (ua.opera) ? 
    function() {
        if(ua.opera) {
            document.body.style += '';
        }
    } : function() {} ,

/**
 * Forces Webkit repaint.
 *
 * @method _repaintWebkit
 * @el {HTMLElement} (Optional) Element to repaint, otherwise entire document body.
 * @private
 */
_repaintWebkit : (ua.webkit) ? 
    function(el) {
        el = el || this._elContainer;
        var parent = el.parentNode;
        var nextSibling = el.nextSibling;
        parent.insertBefore(parent.removeChild(el), nextSibling);
    } : function() {},






















// INIT FUNCTIONS

/**
 * Initializes object literal of config values.
 *
 * @method _initConfigs
 * @param oConfig {Object} Object literal of config values.
 * @private
 */
_initConfigs : function(oConfigs) {
    if(oConfigs) {
        if(oConfigs.constructor != Object) {
            oConfigs = null;
            YAHOO.log("Invalid configs", "warn", this.toString());
        }
        // Backward compatibility
        else if(lang.isBoolean(oConfigs.paginator)) {
            YAHOO.log("DataTable's paginator model has been revised" +
            " -- please refer to the documentation for implementation" +
            " details", "warn", this.toString());
        }
        this._oConfigs = oConfigs;
    }
    else {
        this._oConfigs = {};
    }
},

/**
 * Initializes ColumnSet.
 *
 * @method _initColumnSet
 * @param aColumnDefs {Object[]} Array of object literal Column definitions.
 * @private
 */
_initColumnSet : function(aColumnDefs) {
    if(this._oColumnSet) {
        // First clear _oDynStyles for existing ColumnSet
        for(var i=0, l=this._oColumnSet.keys.length; i<l; i++) {
            DT._oDynStyles[".yui-dt-col"+this._oColumnSet.keys[i].getId()] = undefined;
        }
        
        this._oColumnSet = null;
    }
    
    if(lang.isArray(aColumnDefs)) {
        this._oColumnSet =  new YAHOO.widget.ColumnSet(aColumnDefs);
    }
    // Backward compatibility
    else if(aColumnDefs instanceof YAHOO.widget.ColumnSet) {
        this._oColumnSet =  aColumnDefs;
        YAHOO.log("DataTable's constructor now requires an array" +
        " of object literal Column definitions instead of a ColumnSet instance",
        "warn", this.toString());
    }


},

/**
 * Initializes DataSource.
 *
 * @method _initDataSource
 * @param oDataSource {YAHOO.util.DataSource} DataSource instance.
 * @private
 */
_initDataSource : function(oDataSource) {
    this._oDataSource = null;
    if(oDataSource && (oDataSource instanceof DS)) {
        this._oDataSource = oDataSource;
    }
    // Backward compatibility
    else {
        var tmpTable = null;
        var tmpContainer = this._elContainer;
        var i=0;
        ///TODO: this will break if re-initing DS at runtime for SDT
        // Peek in container child nodes to see if TABLE already exists
        if(tmpContainer.hasChildNodes()) {
            var tmpChildren = tmpContainer.childNodes;
            for(i=0; i<tmpChildren.length; i++) {
                if(tmpChildren[i].nodeName && tmpChildren[i].nodeName.toLowerCase() == "table") {
                    tmpTable = tmpChildren[i];
                    break;
                }
            }
            if(tmpTable) {
                var tmpFieldsArray = [];
                for(; i<this._oColumnSet.keys.length; i++) {
                    tmpFieldsArray.push({key:this._oColumnSet.keys[i].key});
                }

                this._oDataSource = new DS(tmpTable);
                this._oDataSource.responseType = DS.TYPE_HTMLTABLE;
                this._oDataSource.responseSchema = {fields: tmpFieldsArray};
                YAHOO.log("Null DataSource for progressive enhancement from" +
                " markup has been deprecated", "warn", this.toString());
            }
        }
    }
},

/**
 * Initializes RecordSet.
 *
 * @method _initRecordSet
 * @private
 */
_initRecordSet : function() {
    if(this._oRecordSet) {
        this._oRecordSet.reset();
    }
    else {
        this._oRecordSet = new YAHOO.widget.RecordSet();
    }
},

/**
 * Initializes DOM elements.
 *
 * @method _initDomElements
 * @param elContainer {HTMLElement | String} HTML DIV element by reference or ID. 
 * return {Boolean} False in case of error, otherwise true 
 * @private
 */
_initDomElements : function(elContainer) {
    // Outer container
    this._elContainer = this._initContainerEl(elContainer);
    // TABLE
    this._elTable = this._initTableEl(this._elContainer);
    // COLGROUP
    this._elColgroup = this._initColgroupEl(this._elTable);
    // THEAD
    this._elThead = this._initTheadEl(this._elTable);
    // Primary TBODY
    this._elTbody = this._initTbodyEl(this._elTable);
    // Message TBODY
    this._elMsgTbody = this._initMsgTbodyEl(this._elTable);  
    // Column helpers
    this._initColumnHelpers(this._elThead);  

    if(!this._elContainer || !this._elTable || !this._elColgroup ||  !this._elThead || !this._elTbody || !this._elMsgTbody) {
        YAHOO.log("Could not instantiate DataTable due to an invalid DOM elements", "error", this.toString());
        return false;
    }
    else {
        return true;
    }
},

/**
 * Destroy's the DataTable outer container element, if available.
 *
 * @method _destroyContainerEl
 * @private
 */
_destroyContainerEl : function() {
    if(this._elContainer) {
        Ev.purgeElement(this._elContainer, true);
        this._elContainer.innerHTML = "";
        this._elContainer = null;
        this._elColgroup = null;
        this._elThead = null;
        this._elTbody = null;
    }
},

/**
 * Initializes the DataTable outer container element.
 *
 * @method _initContainerEl
 * @param elContainer {HTMLElement | String} HTML DIV element by reference or ID.
 * @return {HTMLElement} Initialized container element. 
 * @private
 */
_initContainerEl : function(elContainer) {
    // Destroy previous
    this._destroyContainerEl();

    // Validate container
    elContainer = Dom.get(elContainer);
    if(elContainer && elContainer.nodeName && (elContainer.nodeName.toLowerCase() == "div")) {
        Dom.addClass(elContainer, DT.CLASS_DATATABLE);
        return elContainer;
    }
},

/**
 * Destroy's the DataTable TABLE element, if available.
 *
 * @method _destroyTableEl
 * @private
 */
_destroyTableEl : function() {
    var elTable = this._elTable;
    if(elTable) {
        Ev.purgeElement(elTable, true);
        elTable.parentNode.removeChild(elTable);
        this._elColgroup = null;
        this._elThead = null;
        this._elTbody = null;
    }
},

/**
 * Creates HTML markup for TABLE, COLGROUP, THEAD and TBODY elements in outer
 * container element.
 *
 * @method _initTableEl
 * @param elContainer {HTMLElement} Container element into which to create TABLE.
 * @return {HTMLElement} Initialized TABLE element.
 * @private
 */
_initTableEl : function(elContainer) {
    if(elContainer) {
        // Destroy previous
        this._destroyTableEl();
    
        // Create TABLE
        return elContainer.appendChild(document.createElement("table"));   
    } 
},

/**
 * Destroy's the DataTable COLGROUP element, if available.
 *
 * @method _destroyColgroupEl
 * @private
 */
_destroyColgroupEl : function() {
    var elColgroup = this._elColgroup;
    if(elColgroup) {
        var elTable = elColgroup.parentNode;
        Ev.purgeElement(elColgroup, true);
        elTable.removeChild(elColgroup);
        this._elColgroup = null;
    }
},

/**
 * Initializes COLGROUP and COL elements for managing minWidth.
 *
 * @method _initColgroupEl
 * @param elTable {HTMLElement} TABLE element into which to create COLGROUP.
 * @return {HTMLElement} Initialized COLGROUP element. 
 * @private
 */
_initColgroupEl : function(elTable) {
    if(elTable) {
        // Destroy previous
        this._destroyColgroupEl();

        // Add COLs to DOCUMENT FRAGMENT
        var allCols = this._aColIds || [],
            allKeys = this._oColumnSet.keys,
            i = 0, len = allCols.length,
            elCol, oColumn,
            elFragment = document.createDocumentFragment(),
            elColTemplate = document.createElement("col");
    
        for(i=0,len=allKeys.length; i<len; i++) {
            oColumn = allKeys[i];
            elCol = elFragment.appendChild(elColTemplate.cloneNode(false));
        }
    
        // Create COLGROUP
        var elColgroup = elTable.insertBefore(document.createElement("colgroup"), elTable.firstChild);
        elColgroup.appendChild(elFragment);
        return elColgroup;
    }
},

/**
 * Destroy's the DataTable THEAD element, if available.
 *
 * @method _destroyTheadEl
 * @private
 */
_destroyTheadEl : function() {
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
 * Initializes THEAD element.
 *
 * @method _initTheadEl
 * @param elTable {HTMLElement} TABLE element into which to create COLGROUP.
 * @param {HTMLElement} Initialized THEAD element. 
 * @return Initialized THEAD element 
 * @private
 */
_initTheadEl : function(elTable) {
    if(elTable) {
        // Destroy previous
        this._destroyTheadEl();
    
        ///TODO: append to DOM later
        var elThead = (this._elColgroup) ?
            elTable.insertBefore(document.createElement("thead"), this._elColgroup.nextSibling) :
            elTable.appendChild(document.createElement("thead"));
    
         ///TODO: Move to container
        Ev.addListener(elThead, "focus", this._onTheadFocus, this);
        Ev.addListener(elThead, "keydown", this._onTheadKeydown, this);
        Ev.addListener(elThead, "mouseover", this._onTableMouseover, this);
        Ev.addListener(elThead, "mouseout", this._onTableMouseout, this);
        Ev.addListener(elThead, "mousedown", this._onTableMousedown, this);
        Ev.addListener(elThead, "mouseup", this._onTableMouseup, this);
        Ev.addListener(elThead, "click", this._onTheadClick, this);
        Ev.addListener(elTable, "dblclick", this._onTableDblclick, this);
        
       var oColumnSet = this._oColumnSet,
            oColumn, i,j, l;
        
    
        // Add TRs to the THEAD
        var colTree = oColumnSet.tree;
        var elTheadCell, id;
        for(i=0; i<colTree.length; i++) {
            var elTheadRow = elThead.appendChild(document.createElement("tr"));
            ///TODO: is this necessary?
            elTheadRow.id = this._sId+"-hdrow" + i;
    
            // ...and create TH cells
            for(j=0; j<colTree[i].length; j++) {
                oColumn = colTree[i][j];
                elTheadCell = elTheadRow.appendChild(document.createElement("th"));
                    oColumn._elTh = elTheadCell;
                ///elTheadCell.yuiCellIndex = j;
                this._initThEl(elTheadCell,oColumn);
            }
    
                // Set FIRST/LAST on THEAD rows
                if(i === 0) {
                    Dom.addClass(elTheadRow, DT.CLASS_FIRST);
                }
                if(i === (colTree.length-1)) {
                    Dom.addClass(elTheadRow, DT.CLASS_LAST);
                }

        }

        // Set FIRST/LAST on edge TH elements using the values in ColumnSet headers array
        var aFirstHeaders = oColumnSet.headers[0];
        var aLastHeaders = oColumnSet.headers[oColumnSet.headers.length-1];
        for(i=0; i<aFirstHeaders.length; i++) {
            //TODO: A better way to get th cell
            Dom.addClass(Dom.get(this._sId+"-th"+aFirstHeaders[i]), DT.CLASS_FIRST);
        }
        for(i=0; i<aLastHeaders.length; i++) {
            //TODO: A better way to get th cell
            Dom.addClass(Dom.get(this._sId+"-th"+aLastHeaders[i]), DT.CLASS_LAST);
        }
        
        YAHOO.log("TH cells for " + this._oColumnSet.keys.length + " keys created","info",this.toString());
    
        ///TODO: try _repaintGecko(this._elContainer) instead
        // Bug 1806891
        if(ua.webkit && ua.webkit < 420) {
            var oSelf = this;
            setTimeout(function() {
                elThead.style.display = "";
            },0);
            elThead.style.display = 'none';
        }
        
        return elThead;
    }
},

/**
 * Populates TH cell as defined by Column.
 *
 * @method _initThEl
 * @param elTheadCell {HTMLElement} TH cell element reference.
 * @param oColumn {YAHOO.widget.Column} Column object.
 * @private
 */
_initThEl : function(elTheadCell,oColumn) {
    var colKey = oColumn.getKey();
    var colId = oColumn.getId();
    
    // This is necessary for accessibility
    elTheadCell.id = this._sId+"-th" + oColumn.getId();
    ///elTheadCell.yuiColumnKey = colKey;
    ///elTheadCell.yuiColumnId = colId;
    elTheadCell.innerHTML = "";
    elTheadCell.rowSpan = oColumn.getRowspan();
    elTheadCell.colSpan = oColumn.getColspan();
    
    var elTheadCellLiner = elTheadCell.appendChild(document.createElement("div"));
    var elTheadCellLabel = elTheadCellLiner.appendChild(document.createElement("span"));

        
    elTheadCellLiner.id = elTheadCell.id + "-liner"; // Needed for resizer
    elTheadCellLiner.className = DT.CLASS_LINER;
    elTheadCellLabel.className = DT.CLASS_LABEL;

    // Clear minWidth on hidden Columns
    if(oColumn.hidden) {
        this._clearMinWidth(oColumn);
    }
        
    elTheadCell.className = this._getColumnClassNames(oColumn);
            
    // Set Column width for non fallback cases
    if(oColumn.width && !this._bDynStylesFallback) {
        this._setColumnWidthDynStyles(oColumn, oColumn.width + 'px', 'hidden');
    }

    DT.formatTheadCell(elTheadCellLabel, oColumn, this);
},

/**
 * Destroys elements associated with Column functionality: ColumnDD and ColumnResizers.
 *
 * @method _destroyColumnHelpers
 * @private
 */
_destroyColumnHelpers : function() {
    var i=0;
    // Destroy ColumnDDs
    var aTree = this._oColumnSet.tree[0];
    for(; i<aTree.length; i++) {
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
},

/**
 * Initializes elements associated with Column functionality: ColumnDD and ColumnResizers.
 *
 * @method _initColumnHelpers
 * @private
 */
_initColumnHelpers : function() {
    this._destroyColumnHelpers();
    
    var aTree = this._oColumnSet.tree[0],
        foundDD = (util.DD) ? true : false,
        needDD = false,
        oColumn, elTheadCell,
        i=0;
    
    ///TODO: converge the following loops
    
    // draggable
    // HACK: Not able to use attribute since this code is run before
    // attributes are initialized
    if(this._oConfigs.draggableColumns) {
        for(; i<this._oColumnSet.tree[0].length; i++) {
            oColumn = this._oColumnSet.tree[0][i];
            if(foundDD) {
                elTheadCell = oColumn.getThEl();
                Dom.addClass(elTheadCell, DT.CLASS_DRAGGABLE);
                var elDragTarget = DT._initColumnDragTargetEl();
                oColumn._dd = new YAHOO.widget.ColumnDD(this, oColumn, elTheadCell, elDragTarget);
            }
            else {
                needDD = true;
            }    
        }
    }
    // resizeable
    for(i=0; i<this._oColumnSet.keys.length; i++) {
        oColumn = this._oColumnSet.keys[i];
        if(oColumn.resizeable) {
            if(foundDD) {
                elTheadCell = oColumn.getThEl();
                Dom.addClass(elTheadCell, DT.CLASS_RESIZEABLE);
                var elThLiner = elTheadCell.firstChild;
                var elThResizer = elThLiner.appendChild(document.createElement("div"));
                elThResizer.id = this._sId + "-colresizer" + oColumn.getId();
                oColumn._elResizer = elThResizer;
                Dom.addClass(elThResizer,DT.CLASS_RESIZER);
                var elResizerProxy = DT._initColumnResizerProxyEl();
                oColumn._ddResizer = new YAHOO.util.ColumnResizer(
                        this, oColumn, elTheadCell, elThResizer.id, elResizerProxy);
                var cancelClick = function(e) {
                    Ev.stopPropagation(e);
                };
                Ev.addListener(elThResizer,"click",cancelClick);
            }
            else {
                needDD = true;
            }
        }
    }
    if(needDD) {
        YAHOO.log("Could not find DragDrop dependancy", "warn", this.toString());
    }
},

/**
 * Destroy's the DataTable TBODY element, if available.
 *
 * @method _destroyTbodyEl
 * @private
 */
_destroyTbodyEl : function() {
    var elTbody = this._elTbody;
    if(elTbody) {
        var elTable = elTbody.parentNode;
        Ev.purgeElement(elTbody, true);
        elTable.removeChild(elTbody);
        this._elTbody = null;
    }
},

/**
 * Initializes TBODY element for data.
 *
 * @method _initTbodyEl
 * @param elTable {HTMLElement} TABLE element into which to create TBODY .
 * @return {HTMLElement} Initialized TBODY element. 
 * @private
 */
_initTbodyEl : function(elTable) {
    if(elTable) {
        // Destroy previous
        this._destroyTbodyEl();
        
        // Create TBODY
        var elTbody = elTable.insertBefore(document.createElement("tbody"), this._elMsgTbody);
        elTbody.tabIndex = 0;
    
        ///TODO: move to container
        // Set up DOM events
        Ev.addListener(this.elContainer, "focus", this._onTableFocus, this);
        Ev.addListener(elTbody, "focus", this._onTbodyFocus, this);
    
        Ev.addListener(elTbody, "mouseover", this._onTableMouseover, this);
        Ev.addListener(elTbody, "mouseout", this._onTableMouseout, this);
        Ev.addListener(elTbody, "mousedown", this._onTableMousedown, this);
    
        Ev.addListener(elTbody, "keydown", this._onTbodyKeydown, this);
    
        Ev.addListener(elTbody, "keypress", this._onTableKeypress, this);
    
        // Since we can't listen for click and dblclick on the same element...
        Ev.addListener(elTbody.parentNode, "dblclick", this._onTableDblclick, this);
        Ev.addListener(elTbody, "click", this._onTbodyClick, this);
    
        // IE puts focus outline in the wrong place
        if(ua.ie) {
            elTbody.hideFocus=true;
        }

        return elTbody;
    }
},

/**
 * Destroy's the DataTable message TBODY element, if available.
 *
 * @method _destroyMsgTbodyEl
 * @private
 */
_destroyMsgTbodyEl : function() {
    var elMsgTbody = this._elMsgTbody;
    if(elMsgTbody) {
        var elTable = elMsgTbody.parentNode;
        Ev.purgeElement(elMsgTbody, true);
        elTable.removeChild(elMsgTbody);
        this._elTbody = null;
    }
},

/**
 * Initializes TBODY element for messaging.
 *
 * @method _initMsgTbodyEl
 * @param elTable {HTMLElement} TABLE element into which to create TBODY 
 * @private
 */
_initMsgTbodyEl : function(elTable) {
    if(elTable) {
        var elMsgTbody = document.createElement("tbody");
        var elMsgRow = elMsgTbody.appendChild(document.createElement("tr"));
        Dom.addClass(elMsgRow,DT.CLASS_FIRST);
        Dom.addClass(elMsgRow,DT.CLASS_LAST);
        this._elMsgRow = elMsgRow;
        var elMsgCell = elMsgRow.appendChild(document.createElement("td"));
        elMsgCell.colSpan = this._oColumnSet.keys.length;
        Dom.addClass(elMsgCell,DT.CLASS_FIRST);
        Dom.addClass(elMsgCell,DT.CLASS_LAST);
        this._elMsgTd = elMsgCell;
        elMsgTbody = elTable.appendChild(elMsgTbody);
        var elMsgCellLiner = elMsgCell.appendChild(document.createElement("div"));
        Dom.addClass(elMsgCellLiner,DT.CLASS_LINER);  
        return elMsgTbody;
    }
},

/**
 * Creates HTML markup for Cell Editor.
 *
 * @method _initCellEditorEl
 * @private
 */
_initCellEditor : function() {
    // TODO: destroy previous instances

    // Attach Cell Editor container element as first child of body
    var elCellEditor = document.createElement("div");
    elCellEditor.id = this._sId + "-celleditor";
    elCellEditor.style.display = "none";
    elCellEditor.tabIndex = 0;
    Dom.addClass(elCellEditor, DT.CLASS_EDITOR);
    ///TODO: insertbefore
    var elFirstChild = Dom.getFirstChild(document.body);
    if(elFirstChild) {
        elCellEditor = Dom.insertBefore(elCellEditor, elFirstChild);
    }
    else {
        elCellEditor = document.body.appendChild(elCellEditor);
    }
    
    // Internal tracker of Cell Editor values
    var oCellEditor = {};
    oCellEditor.container = elCellEditor;
    oCellEditor.value = null;
    oCellEditor.isActive = false;
    return oCellEditor;
},

/** 	 
  * Initializes Column sorting. 	 
  * 	 
  * @method _initColumnSort 	 
  * @private 	 
  */ 	 
_initColumnSort : function() {
    this.subscribe("theadCellClickEvent", this.onEventSortColumn); 	 
}, 	 
 

































// DOM MUTATION FUNCTIONS

/**
 * Retruns classnames to represent current Column states.
 * @method _getColumnClassnames 
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @param aAddClasses {String[]} An array of additional classnames to add to the
 * return value.  
 * @return {String} A String of classnames to be assigned to TH or TD elements
 * for given Column.  
 * @private 
 */
_getColumnClassNames : function (oColumn, aAddClasses) {
    var allClasses;
    
    // Add CSS classes
    if(lang.isString(oColumn.className)) {
        // Single custom class
        allClasses = [oColumn.className];
    }
    else if(lang.isArray(oColumn.className)) {
        // Array of custom classes
        allClasses = oColumn.className;
    }
    else {
        // no custom classes
        allClasses = [];
    }
    
    // Column key - minus any chars other than "A-Z", "a-z", "0-9", "_", "-", ".", or ":"
    allClasses[allClasses.length] = "yui-dt-col-"+oColumn.getKey().replace(/[^\w\-.:]/g,"");
    // Column ID
    allClasses[allClasses.length] = "yui-dt-col"+oColumn.getId();

    var isSortedBy = this.get("sortedBy") || {};
    // Sorted
    if(oColumn.key === isSortedBy.key) {
        allClasses[allClasses.length] = isSortedBy.dir || '';
    }
    // Hidden
    if(oColumn.hidden) {
        allClasses[allClasses.length] = DT.CLASS_HIDDEN;
    }
    // Selected
    if(oColumn.selected) {
        allClasses[allClasses.length] = DT.CLASS_SELECTED;
    }
    // Sortable
    if(oColumn.sortable) {
        allClasses[allClasses.length] = DT.CLASS_SORTABLE;
    }
    // Resizeable
    if(oColumn.resizeable) {
        allClasses[allClasses.length] = DT.CLASS_RESIZEABLE;
    }
    // Editable
    if(oColumn.editor) {
        allClasses[allClasses.length] = DT.CLASS_EDITABLE;
    }
    
    // Addtnl classes, including First/Last
    if(aAddClasses) {
        allClasses = allClasses.concat(aAddClasses);
    }
    
    return allClasses.join(' ');  
},

/**
 * Clears TR element template in response to any Column state change.
 * @method _clearTrTemplateEl
 * @private 
 */
_clearTrTemplateEl : function () {
    this._elTrTemplate = null;
},

/**
 * Returns a new TR element template with TD elements classed with current
 * Column states.
 * @method _getTrTemplateEl 
 * @return {HTMLElement} A TR element to be cloned and added to the DOM.
 * @private 
 */
_getTrTemplateEl : function (oRecord, index) {
    //TODO: Template must be nulled or updated with the following actions:
    // showColumn, hideColumn, setColumnWidth, insertColumn, removeColumn, selectColumn, sortColumn

    // Template is already available
    if(this._elTrTemplate) {
        return this._elTrTemplate;
    }
    // Template needs to be created
    else {
        var d   = document,
            tr  = d.createElement('tr'),
            td  = d.createElement('td'),
            div = d.createElement('div');
    
        // Append the liner element
        td.appendChild(div);

        // Create TD elements into DOCUMENT FRAGMENT
        var df = document.createDocumentFragment(),
            oColumnSet = this._oColumnSet,
            allKeys = oColumnSet.keys,
            allHeaders = oColumnSet.headers,
            allColHeaders, sHeader, sTdHeaders, oColumn, 
            elTd;

        // Set state for each TD;
        var aAddClasses;
        for(var i=0, keysLen=allKeys.length; i<keysLen; i++) {
            // Clone the TD template
            elTd = td.cloneNode(true);
            
            // For SF2 cellIndex bug: http://www.webreference.com/programming/javascript/ppk2/3.html
            ///elTd.yuiCellIndex = i;
    
            // Add structural attributes, derived from Column
            oColumn = allKeys[i];
            ///elTd.yuiColumnKey = oColumn.getKey();
            ///elTd.yuiColumnId  = oColumn.getId();
            
            // Set the TD's accessibility headers
            allColHeaders = allHeaders[i];
            for(var j=0, headersLen=allColHeaders.length; j < headersLen; ++j) {
                sHeader = this._sId + "-th" + allColHeaders[j] + ' ';
                sTdHeaders += sHeader;
            }
            elTd.headers = sTdHeaders;
            
            aAddClasses = [];
            // First TD?
            if(i === 0) {
                 aAddClasses = [DT.CLASS_FIRST];
            }
            // Last TD?
            else if(i === (keysLen-1)) {
                 aAddClasses = [DT.CLASS_LAST];
            }

            // Class the TD element
            elTd.className = this._getColumnClassNames(oColumn, aAddClasses);
    
            // Class the liner element
            elTd.firstChild.className = DT.CLASS_LINER;

            // Set Column width for fallback cases
            if(oColumn.width && this._bDynStylesFallback) {
                elTd.firstChild.style.overflow = 'hidden';
                elTd.firstChild.style.width = oColumn.width + 'px';
            }
            
            df.appendChild(elTd);
        }
        tr.appendChild(df);
        this._elTrTemplate = tr;
        return tr;
    }   
},

/**
 * Create a new TR element for a given Record and appends it with the correct
 * number of Column-state-classed TD elements. Striping is the responsibility of
 * the calling function, which may decide to stripe the single row, a subset of
 * rows, or all the rows.
 * @method _createTrEl
 * @param oRecord {YAHOO.widget.Record} Record instance
 * @return {HTMLElement} The new TR element.  This must be added to the DOM.
 * @private 
 */
_addTrEl : function (oRecord, index) {
    var elTrTemplate = this._getTrTemplateEl();
    
    // Clone the TR template.
    var elTr = elTrTemplate.cloneNode(true);
    
    // Set row-specific attributes
    elTr.id = this._sId+"-bdrow"+this._nTrCount++;
    
    // Populate content
    return this._updateTrEl(elTr,oRecord);
},

/**
 * Formats the contents of the given TR's TD elements with data from the given
 * Record. Only innerHTML should change, nothing structural.
 *
 * @method _updateTrEl
 * @param elTr {HTMLElement} The TR element to update.
 * @param oRecord {YAHOO.widget.Record} The associated Record instance.
 * @return {HTMLElement} DOM reference to the new TR element.
 * @private
 */
_updateTrEl : function(elTr, oRecord) {
    // Hide the row to prevent constant reflows
    elTr.style.display = 'none';
    
    // Update TD elements with new data
    var allTds = elTr.childNodes,
        elTd;
    for(var i=0,len=allTds.length; i<len; ++i) {
        elTd = allTds[i];
        
        // Set cell-specific attributes
        ///TODO: are IDs necessary?
        if(!elTd.id) {
            elTd.id = this._sId+"-bdcell"+this._nTdCount++;
        }
   
        // Set the cell content
        this.formatCell(allTds[i].firstChild, oRecord, this._oColumnSet.keys[i]);
    }

    // Update Record ID
    ///elTr.yuiRecordId = oRecord.getId();
    
    // Redisplay the row for reflow
    elTr.style.display = '';

    return elTr;
},


/**
 * Deletes TR element by DOM reference or by DataTable page row index.
 *
 * @method _deleteTrEl
 * @param row {HTMLElement | Number} TR element reference or Datatable page row index.
 * @return {Boolean} Returns true if successful, else returns false.
 * @private
 */
_deleteTrEl : function(row) {
    var rowIndex;

    // Get page row index for the element
    if(!lang.isNumber(row)) {
        rowIndex = Dom.get(row).sectionRowIndex;
    }
    else {
        rowIndex = row;
    }
    if(lang.isNumber(rowIndex) && (rowIndex > -2) && (rowIndex < this._elTbody.rows.length)) {
        // Cannot use tbody.deleteRow due to IE6 instability
        //return this._elTbody.deleteRow(rowIndex);
        return this._elTbody.removeChild(this.getTrEl(row));
    }
    else {
        return null;
    }
},



























// CSS/STATE FUNCTIONS




/**
 * Assigns the class YAHOO.widget.DataTable.CLASS_FIRST to the first TR element
 * of the DataTable page and updates internal tracker.
 *
 * @method _setFirstRow
 * @private
 */
_setFirstRow : function() {
    var rowEl = this.getFirstTrEl();
    if(rowEl) {
        // Remove FIRST
        if(this._sFirstTrId) {
            Dom.removeClass(this._sFirstTrId, DT.CLASS_FIRST);
        }
        // Set FIRST
        Dom.addClass(rowEl, DT.CLASS_FIRST);
        this._sFirstTrId = rowEl.id;
    }
    else {
        this._sFirstTrId = null;
    }
},

/**
 * Assigns the class YAHOO.widget.DataTable.CLASS_LAST to the last TR element
 * of the DataTable page and updates internal tracker.
 *
 * @method _setLastRow
 * @private
 */
_setLastRow : function() {
    var rowEl = this.getLastTrEl();
    if(rowEl) {
        // Unassign previous class
        if(this._sLastTrId) {
            Dom.removeClass(this._sLastTrId, DT.CLASS_LAST);
        }
        // Assign class
        Dom.addClass(rowEl, DT.CLASS_LAST);
        this._sLastTrId = rowEl.id;
    }
    else {
        this._sLastTrId = null;
    }
},

/**
 * Assigns the classes DT.CLASS_EVEN and DT.CLASS_ODD to one, many, or all TR elements.
 *
 * @method _setRowStripes
 * @param row {HTMLElement | String | Number} (optional) HTML TR element reference
 * or string ID, or page row index of where to start striping.
 * @param range {Number} (optional) If given, how many rows to stripe, otherwise
 * stripe all the rows until the end.
 * @private
 */
_setRowStripes : function(row, range) {
    // Default values stripe all rows
    var allRows = this._elTbody.rows,
        nStartIndex = 0,
        nEndIndex = allRows.length,
        aOdds = [], nOddIdx = 0,
        aEvens = [], nEvenIdx = 0;

    // Stripe a subset
    if((row !== null) && (row !== undefined)) {
        // Validate given start row
        var elStartRow = this.getTrEl(row);
        if(elStartRow) {
            nStartIndex = elStartRow.sectionRowIndex;

            // Validate given range
            if(lang.isNumber(range) && (range > 1)) {
                nEndIndex = nStartIndex + range;
            }
        }
    }

    for(var i=nStartIndex; i<nEndIndex; i++) {
        if(i%2) {
            aOdds[nOddIdx++] = allRows[i];
        } else {
            aEvens[nEvenIdx++] = allRows[i];
        }
    }

    if (aOdds.length) {
        Dom.replaceClass(aOdds, DT.CLASS_EVEN, DT.CLASS_ODD);
    }

    if (aEvens.length) {
        Dom.replaceClass(aEvens, DT.CLASS_ODD, DT.CLASS_EVEN);
    }
},













































/////////////////////////////////////////////////////////////////////////////
//
// Private DOM Event Handlers
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Fires tableMutationEvent whenever the render chain ends.
 *
 * @method _onRenderChainEnd
 * @private
 */
_onRenderChainEnd : function() {
    this.fireEvent("tableMutationEvent");
},

/**
 * Whenever content is updated (due to data load, dynamic data, etc), calls
 * minWidth validation.  
 *
 * @method _onTableMutationEvent
 * @param oArgs.column {YAHOO.widget.Column) If mutation occurs only in one Column,
 * that Column instance.  
 * @private
 */
_onTableMutationEvent : function(oArgs) {
    this._validateMinWidths((oArgs) ? oArgs.column : null);
},

/**
 * Handles click events on the DOCUMENT.
 *
 * @method _onDocumentClick
 * @param e {HTMLEvent} The click event.
 * @param oSelf {YAHOO.wiget.DataTable} DataTable instance.
 * @private
 */
_onDocumentClick : function(e, oSelf) {
    var elTarget = Ev.getTarget(e);
    var elTag = elTarget.nodeName.toLowerCase();

    if(!Dom.isAncestor(oSelf._elContainer, elTarget)) {
        oSelf.fireEvent("tableBlurEvent");

        // Fires editorBlurEvent when click is not within the TABLE.
        // For cases when click is within the TABLE, due to timing issues,
        // the editorBlurEvent needs to get fired by the lower-level DOM click
        // handlers below rather than by the TABLE click handler directly.
        if(oSelf._oCellEditor && oSelf._oCellEditor.isActive) {
            // Only if the click was not within the Cell Editor container
            if(!Dom.isAncestor(oSelf._oCellEditor.container, elTarget) &&
                    (oSelf._oCellEditor.container.id !== elTarget.id)) {
                oSelf.fireEvent("editorBlurEvent", {editor:oSelf._oCellEditor});
            }
        }
    }
},

/**
 * Handles focus events on the DataTable instance.
 *
 * @method _onTableFocus
 * @param e {HTMLEvent} The focus event.
 * @param oSelf {YAHOO.wiget.DataTable} DataTable instance.
 * @private
 */
_onTableFocus : function(e, oSelf) {
    oSelf.fireEvent("tableFocusEvent");
},

/**
 * Handles focus events on the THEAD element.
 *
 * @method _onTheadFocus
 * @param e {HTMLEvent} The focus event.
 * @param oSelf {YAHOO.wiget.DataTable} DataTable instance.
 * @private
 */
_onTheadFocus : function(e, oSelf) {
    oSelf.fireEvent("theadFocusEvent");
    oSelf.fireEvent("tableFocusEvent");
},

/**
 * Handles focus events on the TBODY element.
 *
 * @method _onTbodyFocus
 * @param e {HTMLEvent} The focus event.
 * @param oSelf {YAHOO.wiget.DataTable} DataTable instance.
 * @private
 */
_onTbodyFocus : function(e, oSelf) {
    oSelf.fireEvent("tbodyFocusEvent");
    oSelf.fireEvent("tableFocusEvent");
},

/**
 * Handles mouseover events on the DataTable instance.
 *
 * @method _onTableMouseover
 * @param e {HTMLEvent} The mouseover event.
 * @param oSelf {YAHOO.wiget.DataTable} DataTable instance.
 * @private
 */
_onTableMouseover : function(e, oSelf) {
    var elTarget = Ev.getTarget(e);
        var elTag = elTarget.nodeName.toLowerCase();
        var bKeepBubbling = true;
        while(elTarget && (elTag != "table")) {
            switch(elTag) {
                case "body":
                     return;
                case "a":
                    break;
                case "td":
                    bKeepBubbling = oSelf.fireEvent("cellMouseoverEvent",{target:elTarget,event:e});
                    break;
                case "span":
                    if(Dom.hasClass(elTarget, DT.CLASS_LABEL)) {
                        bKeepBubbling = oSelf.fireEvent("theadLabelMouseoverEvent",{target:elTarget,event:e});
                        // Backward compatibility
                        bKeepBubbling = oSelf.fireEvent("headerLabelMouseoverEvent",{target:elTarget,event:e});
                    }
                    break;
                case "th":
                    bKeepBubbling = oSelf.fireEvent("theadCellMouseoverEvent",{target:elTarget,event:e});
                    // Backward compatibility
                    bKeepBubbling = oSelf.fireEvent("headerCellMouseoverEvent",{target:elTarget,event:e});
                    break;
                case "tr":
                    if(elTarget.parentNode.nodeName.toLowerCase() == "thead") {
                        bKeepBubbling = oSelf.fireEvent("theadRowMouseoverEvent",{target:elTarget,event:e});
                        // Backward compatibility
                        bKeepBubbling = oSelf.fireEvent("headerRowMouseoverEvent",{target:elTarget,event:e});
                    }
                    else {
                        bKeepBubbling = oSelf.fireEvent("rowMouseoverEvent",{target:elTarget,event:e});
                    }
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
        oSelf.fireEvent("tableMouseoverEvent",{target:(elTarget || oSelf._elContainer),event:e});
},

/**
 * Handles mouseout events on the DataTable instance.
 *
 * @method _onTableMouseout
 * @param e {HTMLEvent} The mouseout event.
 * @param oSelf {YAHOO.wiget.DataTable} DataTable instance.
 * @private
 */
_onTableMouseout : function(e, oSelf) {
    var elTarget = Ev.getTarget(e);
    var elTag = elTarget.nodeName.toLowerCase();
    var bKeepBubbling = true;
    while(elTarget && (elTag != "table")) {
        switch(elTag) {
            case "body":
                return;
            case "a":
                break;
            case "td":
                bKeepBubbling = oSelf.fireEvent("cellMouseoutEvent",{target:elTarget,event:e});
                break;
            case "span":
                if(Dom.hasClass(elTarget, DT.CLASS_LABEL)) {
                    bKeepBubbling = oSelf.fireEvent("theadLabelMouseoutEvent",{target:elTarget,event:e});
                    // Backward compatibility
                    bKeepBubbling = oSelf.fireEvent("headerLabelMouseoutEvent",{target:elTarget,event:e});
                }
                break;
            case "th":
                bKeepBubbling = oSelf.fireEvent("theadCellMouseoutEvent",{target:elTarget,event:e});
                // Backward compatibility
                bKeepBubbling = oSelf.fireEvent("headerCellMouseoutEvent",{target:elTarget,event:e});
                break;
            case "tr":
                if(elTarget.parentNode.nodeName.toLowerCase() == "thead") {
                    bKeepBubbling = oSelf.fireEvent("theadRowMouseoutEvent",{target:elTarget,event:e});
                    // Backward compatibility
                    bKeepBubbling = oSelf.fireEvent("headerRowMouseoutEvent",{target:elTarget,event:e});
                }
                else {
                    bKeepBubbling = oSelf.fireEvent("rowMouseoutEvent",{target:elTarget,event:e});
                }
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
    oSelf.fireEvent("tableMouseoutEvent",{target:(elTarget || oSelf._elContainer),event:e});
},

/**
 * Handles mousedown events on the DataTable instance.
 *
 * @method _onTableMousedown
 * @param e {HTMLEvent} The mousedown event.
 * @param oSelf {YAHOO.wiget.DataTable} DataTable instance.
 * @private
 */
_onTableMousedown : function(e, oSelf) {
    var elTarget = Ev.getTarget(e);
    var elTag = elTarget.nodeName.toLowerCase();
    var bKeepBubbling = true;
    while(elTarget && (elTag != "table")) {
        switch(elTag) {
            case "body":
                return;
            case "a":
                break;
            case "td":
                bKeepBubbling = oSelf.fireEvent("cellMousedownEvent",{target:elTarget,event:e});
                break;
            case "span":
                if(Dom.hasClass(elTarget, DT.CLASS_LABEL)) {
                    bKeepBubbling = oSelf.fireEvent("theadLabelMousedownEvent",{target:elTarget,event:e});
                    // Backward compatibility
                    bKeepBubbling = oSelf.fireEvent("headerLabelMousedownEvent",{target:elTarget,event:e});
                }
                break;
            case "th":
                bKeepBubbling = oSelf.fireEvent("theadCellMousedownEvent",{target:elTarget,event:e});
                // Backward compatibility
                bKeepBubbling = oSelf.fireEvent("headerCellMousedownEvent",{target:elTarget,event:e});
                break;
            case "tr":
                if(elTarget.parentNode.nodeName.toLowerCase() == "thead") {
                    bKeepBubbling = oSelf.fireEvent("theadRowMousedownEvent",{target:elTarget,event:e});
                    // Backward compatibility
                    bKeepBubbling = oSelf.fireEvent("headerRowMousedownEvent",{target:elTarget,event:e});
                }
                else {
                    bKeepBubbling = oSelf.fireEvent("rowMousedownEvent",{target:elTarget,event:e});
                }
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
    oSelf.fireEvent("tableMousedownEvent",{target:(elTarget || oSelf._elContainer),event:e});
},

/**
 * Handles dblclick events on the DataTable instance.
 *
 * @method _onTableDblclick
 * @param e {HTMLEvent} The dblclick event.
 * @param oSelf {YAHOO.wiget.DataTable} DataTable instance.
 * @private
 */
_onTableDblclick : function(e, oSelf) {
    var elTarget = Ev.getTarget(e);
    var elTag = elTarget.nodeName.toLowerCase();
    var bKeepBubbling = true;
    while(elTarget && (elTag != "table")) {
        switch(elTag) {
            case "body":
                return;
            case "td":
                bKeepBubbling = oSelf.fireEvent("cellDblclickEvent",{target:elTarget,event:e});
                break;
            case "span":
                if(Dom.hasClass(elTarget, DT.CLASS_LABEL)) {
                    bKeepBubbling = oSelf.fireEvent("theadLabelDblclickEvent",{target:elTarget,event:e});
                    // Backward compatibility
                    bKeepBubbling = oSelf.fireEvent("headerLabelDblclickEvent",{target:elTarget,event:e});
                }
                break;
            case "th":
                bKeepBubbling = oSelf.fireEvent("theadCellDblclickEvent",{target:elTarget,event:e});
                // Backward compatibility
                bKeepBubbling = oSelf.fireEvent("headerCellDblclickEvent",{target:elTarget,event:e});
                break;
            case "tr":
                if(elTarget.parentNode.nodeName.toLowerCase() == "thead") {
                    bKeepBubbling = oSelf.fireEvent("theadRowDblclickEvent",{target:elTarget,event:e});
                    // Backward compatibility
                    bKeepBubbling = oSelf.fireEvent("headerRowDblclickEvent",{target:elTarget,event:e});
                }
                else {
                    bKeepBubbling = oSelf.fireEvent("rowDblclickEvent",{target:elTarget,event:e});
                }
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
    oSelf.fireEvent("tableDblclickEvent",{target:(elTarget || oSelf._elContainer),event:e});
},
/**
 * Handles keydown events on the THEAD element.
 *
 * @method _onTheadKeydown
 * @param e {HTMLEvent} The key event.
 * @param oSelf {YAHOO.wiget.DataTable} DataTable instance.
 * @private
 */
_onTheadKeydown : function(e, oSelf) {
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
},

/**
 * Handles keydown events on the TBODY element. Handles selection behavior,
 * provides hooks for ENTER to edit functionality.
 *
 * @method _onTbodyKeydown
 * @param e {HTMLEvent} The key event.
 * @param oSelf {YAHOO.wiget.DataTable} DataTable instance.
 * @private
 */
_onTbodyKeydown : function(e, oSelf) {
    var sMode = oSelf.get("selectionMode");

    if(sMode == "standard") {
        oSelf._handleStandardSelectionByKey(e);
    }
    else if(sMode == "single") {
        oSelf._handleSingleSelectionByKey(e);
    }
    else if(sMode == "cellblock") {
        oSelf._handleCellBlockSelectionByKey(e);
    }
    else if(sMode == "cellrange") {
        oSelf._handleCellRangeSelectionByKey(e);
    }
    else if(sMode == "singlecell") {
        oSelf._handleSingleCellSelectionByKey(e);
    }
    
    if(oSelf._oCellEditor && oSelf._oCellEditor.isActive) {
        oSelf.fireEvent("editorBlurEvent", {editor:oSelf._oCellEditor});
    }

    var elTarget = Ev.getTarget(e);
    var elTag = elTarget.nodeName.toLowerCase();
    var bKeepBubbling = true;
    while(elTarget && (elTag != "table")) {
        switch(elTag) {
            case "body":
                return;
            case "tbody":
                bKeepBubbling = oSelf.fireEvent("tbodyKeyEvent",{target:elTarget,event:e});
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
},

/**
 * Handles keypress events on the TABLE. Mainly to support stopEvent on Mac.
 *
 * @method _onTableKeypress
 * @param e {HTMLEvent} The key event.
 * @param oSelf {YAHOO.wiget.DataTable} DataTable instance.
 * @private
 */
_onTableKeypress : function(e, oSelf) {
    if(ua.webkit) {
        var nKey = Ev.getCharCode(e);
        // arrow down
        if(nKey == 40) {
            Ev.stopEvent(e);
        }
        // arrow up
        else if(nKey == 38) {
            Ev.stopEvent(e);
        }
    }
},

/**
 * Handles click events on the THEAD element.
 *
 * @method _onTheadClick
 * @param e {HTMLEvent} The click event.
 * @param oSelf {YAHOO.wiget.DataTable} DataTable instance.
 * @private
 */
_onTheadClick : function(e, oSelf) {
    // Always blur the cell editor
    if(oSelf._oCellEditor && oSelf._oCellEditor.isActive) {
        oSelf.fireEvent("editorBlurEvent", {editor:oSelf._oCellEditor});
    }

    var elTarget = Ev.getTarget(e);
    var elTag = elTarget.nodeName.toLowerCase();
    var bKeepBubbling = true;
    while(elTarget && (elTag != "table")) {
        switch(elTag) {
            case "body":
                return;
            case "input":
                if(elTarget.type.toLowerCase() == "checkbox") {
                    bKeepBubbling = oSelf.fireEvent("theadCheckboxClickEvent",{target:elTarget,event:e});
                }
                else if(elTarget.type.toLowerCase() == "radio") {
                    bKeepBubbling = oSelf.fireEvent("theadRadioClickEvent",{target:elTarget,event:e});
                }
                break;
            case "a":
                bKeepBubbling = oSelf.fireEvent("theadLinkClickEvent",{target:elTarget,event:e});
                break;
            case "button":
                bKeepBubbling = oSelf.fireEvent("theadButtonClickEvent",{target:elTarget,event:e});
                break;
            case "span":
                if(Dom.hasClass(elTarget, DT.CLASS_LABEL)) {
                    bKeepBubbling = oSelf.fireEvent("theadLabelClickEvent",{target:elTarget,event:e});
                    // Backward compatibility
                    bKeepBubbling = oSelf.fireEvent("headerLabelClickEvent",{target:elTarget,event:e});
                }
                break;
            case "th":
                bKeepBubbling = oSelf.fireEvent("theadCellClickEvent",{target:elTarget,event:e});
                // Backward compatibility
                bKeepBubbling = oSelf.fireEvent("headerCellClickEvent",{target:elTarget,event:e});
                break;
            case "tr":
                bKeepBubbling = oSelf.fireEvent("theadRowClickEvent",{target:elTarget,event:e});
                // Backward compatibility
                bKeepBubbling = oSelf.fireEvent("headerRowClickEvent",{target:elTarget,event:e});
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
    oSelf.fireEvent("tableClickEvent",{target:(elTarget || oSelf._elContainer),event:e});
},

/**
 * Handles click events on the primary TBODY element.
 *
 * @method _onTbodyClick
 * @param e {HTMLEvent} The click event.
 * @param oSelf {YAHOO.wiget.DataTable} DataTable instance.
 * @private
 */
_onTbodyClick : function(e, oSelf) {
    // Always blur the cell editor
    if(oSelf._oCellEditor && oSelf._oCellEditor.isActive) {
        oSelf.fireEvent("editorBlurEvent", {editor:oSelf._oCellEditor});
    }

    // Fire Custom Events
    var elTarget = Ev.getTarget(e);
    var elTag = elTarget.nodeName.toLowerCase();
    var bKeepBubbling = true;
    while(elTarget && (elTag != "table")) {
        switch(elTag) {
            case "body":
                return;
            case "input":
                if(elTarget.type.toLowerCase() == "checkbox") {
                    bKeepBubbling = oSelf.fireEvent("checkboxClickEvent",{target:elTarget,event:e});
                }
                else if(elTarget.type.toLowerCase() == "radio") {
                    bKeepBubbling = oSelf.fireEvent("radioClickEvent",{target:elTarget,event:e});
                }
                break;
            case "a":
                bKeepBubbling = oSelf.fireEvent("linkClickEvent",{target:elTarget,event:e});
                break;
            case "button":
                bKeepBubbling = oSelf.fireEvent("buttonClickEvent",{target:elTarget,event:e});
                break;
            case "td":
                bKeepBubbling = oSelf.fireEvent("cellClickEvent",{target:elTarget,event:e});
                break;
            case "tr":
                bKeepBubbling = oSelf.fireEvent("rowClickEvent",{target:elTarget,event:e});
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
    oSelf.fireEvent("tableClickEvent",{target:(elTarget || oSelf._elContainer),event:e});
},

/*TODO undeprecate?
 * Handles change events on SELECT elements within DataTable.
 *
 * @method _onDropdownChange
 * @param e {HTMLEvent} The change event.
 * @param oSelf {YAHOO.wiget.DataTable} DataTable instance.
 * @private
 * @deprecated
 */
_onDropdownChange : function(e, oSelf) {
    var elTarget = Ev.getTarget(e);
    //TODO: pass what args?
    //var value = elTarget[elTarget.selectedIndex].value;
    oSelf.fireEvent("dropdownChangeEvent", {event:e, target:elTarget});
},
































/////////////////////////////////////////////////////////////////////////////
//
// Public member variables
//
/////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////
//
// Public methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Returns unique id assigned to instance, which is a useful prefix for
 * generating unique DOM ID strings.
 *
 * @method getId
 * @return {String} Unique ID of the DataSource instance.
 */
getId : function() {
    return this._sId;
},

/**
 * DataSource instance name, for logging.
 *
 * @method toString
 * @return {String} Unique name of the DataSource instance.
 */

toString : function() {
    return "DataTable instance " + this._sId;
},

/**
 * Returns the DataTable instance's DataSource instance.
 *
 * @method getDataSource
 * @return {YAHOO.util.DataSource} DataSource instance.
 */
getDataSource : function() {
    return this._oDataSource;
},

/**
 * Returns the DataTable instance's ColumnSet instance.
 *
 * @method getColumnSet
 * @return {YAHOO.widget.ColumnSet} ColumnSet instance.
 */
getColumnSet : function() {
    return this._oColumnSet;
},

/**
 * Returns the DataTable instance's RecordSet instance.
 *
 * @method getRecordSet
 * @return {YAHOO.widget.RecordSet} RecordSet instance.
 */
getRecordSet : function() {
    return this._oRecordSet;
},

/**
 * Returns the DataTable instance's Cell Editor as an object literal with the
 * following properties:
 * <dl>
 * <dt>cell</dt>
 * <dd>{HTMLElement} Cell element being edited.</dd>
 *
 * <dt>column</dt>
 * <dd>{YAHOO.widget.Column} Associated Column instance.</dd>
 *
 * <dt>container</dt>
 * <dd>{HTMLElement} Reference to editor's container DIV element.</dd>
 *
 * <dt>isActive</dt>
 * <dd>{Boolean} True if cell is currently being edited.</dd>
 *
 * <dt>record</dt>
 * <dd>{YAHOO.widget.Record} Associated Record instance.</dd>
 *
 * <dt>validator</dt>
 * <dd>{HTMLFunction} Associated validator function called before new data is stored. Called
 * within the scope of the DataTable instance, the function receieves the
 * following arguments:
 *
 * <dl>
 *  <dt>oNewData</dt>
 *  <dd>{Object} New data to validate.</dd>
 *
 *  <dt>oOldData</dt>
 *  <dd>{Object} Original data in case of reversion.</dd>
 *
 *  <dt>oCellEditor</dt>
 *  <dd>{Object} Object literal representation of Editor values.</dd>
 * </dl>
 *
 *  </dd>
 *
 * <dt>defaultValue</dt>
 * <dd>Dynamically settable default value</dd>
 * </dl>
 *
 * <dt>value</dt>
 * <dd>Current input value</dd>
 * </dl>
 *
 *
 *
 *
 *
 * @method getCellEditor
 * @return {Object} Cell Editor object literal values.
 */
getCellEditor : function() {
    return this._oCellEditor;
},











































// DOM ACCESSORS

/**
 * Returns DOM reference to the DataTable's container element.
 *
 * @method getContainerEl
 * @return {HTMLElement} Reference to DIV element.
 */
getContainerEl : function() {
    return this._elContainer;
},

/**
 * Returns DOM reference to the DataTable's TABLE element.
 *
 * @method getTableEl
 * @return {HTMLElement} Reference to TABLE element.
 */
getTableEl : function() {
    return this._elTable;
},

/**
 * Returns DOM reference to the DataTable's THEAD element.
 *
 * @method getTheadEl
 * @return {HTMLElement} Reference to THEAD element.
 */
getTheadEl : function() {
    return this._elThead;
},

/**
 * Returns DOM reference to the DataTable's primary TBODY element.
 *
 * @method getTbodyEl
 * @return {HTMLElement} Reference to TBODY element.
 */
getTbodyEl : function() {
    return this._elTbody;
},

/**
 * Returns DOM reference to the DataTable's secondary TBODY element that is
 * used to display messages.
 *
 * @method getMsgTbodyEl
 * @return {HTMLElement} Reference to TBODY element.
 */
getMsgTbodyEl : function() {
    return this._elMsgTbody;
},

/**
 * Returns DOM reference to the TD element within the secondary TBODY that is
 * used to display messages.
 *
 * @method getMsgTdEl
 * @return {HTMLElement} Reference to TD element.
 */
getMsgTdEl : function() {
    return this._elMsgTd;
},

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
getTrEl : function(row) {
    var allRows = this._elTbody.rows;

    // By Record
    if(row instanceof YAHOO.widget.Record) {
        var nTrIndex = this.getTrIndex(row);
            if(nTrIndex !== null) {
                return allRows[nTrIndex];
            }
            // Not a valid Record
            else {
                return null;
            }
    }
    // By page row index
    else if(lang.isNumber(row) && (row > -1) && (row < allRows.length)) {
        return allRows[row];
    }
    // By ID string or element reference
    else {
        var elRow;
        var el = Dom.get(row);

        // Validate HTML element
        if(el && (el.ownerDocument == document)) {
            // Validate TR element
            if(el.nodeName.toLowerCase() != "tr") {
                // Traverse up the DOM to find the corresponding TR element
                elRow = Dom.getAncestorByTagName(el,"tr");
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

    return null;
},

/**
 * Returns DOM reference to the first TR element in the DataTable page, or null.
 *
 * @method getFirstTrEl
 * @return {HTMLElement} Reference to TR element.
 */
getFirstTrEl : function() {
    return this._elTbody.rows[0] || null;
},

/**
 * Returns DOM reference to the last TR element in the DataTable page, or null.
 *
 * @method getLastTrEl
 * @return {HTMLElement} Reference to last TR element.
 */
getLastTrEl : function() {
    var allRows = this._elTbody.rows;
        if(allRows.length > 0) {
            return allRows[allRows.length-1] || null;
        }
},

/**
 * Returns DOM reference to the next TR element from the given TR element, or null.
 *
 * @method getNextTrEl
 * @param row {HTMLElement | String | Number | YAHOO.widget.Record} Element
 * reference, ID string, page row index, or Record from which to get next TR element.
 * @return {HTMLElement} Reference to next TR element.
 */
getNextTrEl : function(row) {
    var nThisTrIndex = this.getTrIndex(row);
    if(nThisTrIndex !== null) {
        var allRows = this._elTbody.rows;
        if(nThisTrIndex < allRows.length-1) {
            return allRows[nThisTrIndex+1];
        }
    }

    YAHOO.log("Could not get next TR element for row " + row, "info", this.toString());
    return null;
},

/**
 * Returns DOM reference to the previous TR element from the given TR element, or null.
 *
 * @method getPreviousTrEl
 * @param row {HTMLElement | String | Number | YAHOO.widget.Record} Element
 * reference, ID string, page row index, or Record from which to get previous TR element.
 * @return {HTMLElement} Reference to previous TR element.
 */
getPreviousTrEl : function(row) {
    var nThisTrIndex = this.getTrIndex(row);
    if(nThisTrIndex !== null) {
        var allRows = this._elTbody.rows;
        if(nThisTrIndex > 0) {
            return allRows[nThisTrIndex-1];
        }
    }

    YAHOO.log("Could not get previous TR element for row " + row, "info", this.toString());
    return null;
},

/**
 * Returns DOM reference to a TD liner element.
 *
 * @method getTdLinerEl
 * @param cell {HTMLElement | String | Object} DOM element reference or string ID, or
 * object literal of syntax {record:oRecord, column:oColumn}.
 * @return {HTMLElement} Reference to TD liner element.
 */
getTdLinerEl : function(cell) {
    var elCell = this.getTdEl(cell);
    return elCell.firstChild || null;
},

/**
 * Returns DOM reference to a TD element.
 *
 * @method getTdEl
 * @param cell {HTMLElement | String | Object} DOM element reference or string ID, or
 * object literal of syntax {record:oRecord, column:oColumn}.
 * @return {HTMLElement} Reference to TD element.
 */
getTdEl : function(cell) {
    var elCell;
    var el = Dom.get(cell);

    // Validate HTML element
    if(el && (el.ownerDocument == document)) {
        // Validate TD element
        if(el.nodeName.toLowerCase() != "td") {
            // Traverse up the DOM to find the corresponding TR element
            elCell = Dom.getAncestorByTagName(el, "td");
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
    else if(cell) {
        var oRecord, nColKeyIndex;

        if(lang.isString(cell.columnId) && lang.isString(cell.recordId)) {
            oRecord = this.getRecord(cell.recordId);
            var oColumn = this.getColumnById(cell.columnId);
            if(oColumn) {
                nColKeyIndex = oColumn.getKeyIndex();
            }

        }
        if(cell.record && cell.column && cell.column.getKeyIndex) {
            oRecord = cell.record;
            nColKeyIndex = cell.column.getKeyIndex();
        }
        var elRow = this.getTrEl(oRecord);
        if((nColKeyIndex !== null) && elRow && elRow.cells && elRow.cells.length > 0) {
            return elRow.cells[nColKeyIndex] || null;
        }
    }

    return null;
},

/**
 * Returns DOM reference to the first TD element in the DataTable page (by default),
 * the first TD element of the optionally given row, or null.
 *
 * @method getFirstTdEl
 * @param row {HTMLElement} (optional) row from which to get first TD
 * @return {HTMLElement} Reference to TD element.
 */
getFirstTdEl : function(row) {
    var elRow = this.getTrEl(row) || this.getFirstTrEl();
    if(elRow && (elRow.cells.length > 0)) {
        return elRow.cells[0];
    }
    YAHOO.log("Could not get first TD element for row " + elRow, "info", this.toString());
    return null;
},

/**
 * Returns DOM reference to the last TD element in the DataTable page (by default),
 * the first TD element of the optionally given row, or null.
 *
 * @method getLastTdEl
 * @return {HTMLElement} Reference to last TD element.
 */
getLastTdEl : function(row) {
    var elRow = this.getTrEl(row) || this.getLastTrEl();
    if(elRow && (elRow.cells.length > 0)) {
        return elRow.cells[elRow.cells.length-1];
    }
    YAHOO.log("Could not get last TD element for row " + elRow, "info", this.toString());
    return null;
},

/**
 * Returns DOM reference to the next TD element from the given cell, or null.
 *
 * @method getNextTdEl
 * @param cell {HTMLElement | String | Object} DOM element reference or string ID, or
 * object literal of syntax {record:oRecord, column:oColumn} from which to get next TD element.
 * @return {HTMLElement} Reference to next TD element, or null.
 */
getNextTdEl : function(cell) {
    var elCell = this.getTdEl(cell);
    if(elCell) {
        var nThisTdIndex = elCell.cellIndex;
        ///var nThisTdIndex = elCell.yuiCellIndex;
        var elRow = this.getTrEl(elCell);
        if(nThisTdIndex < elRow.cells.length-1) {
            return elRow.cells[nThisTdIndex+1];
        }
        else {
            var elNextRow = this.getNextTrEl(elRow);
            if(elNextRow) {
                return elNextRow.cells[0];
            }
        }
    }
    YAHOO.log("Could not get next TD element for cell " + cell, "info", this.toString());
    return null;
},

/**
 * Returns DOM reference to the previous TD element from the given cell, or null.
 *
 * @method getPreviousTdEl
 * @param cell {HTMLElement | String | Object} DOM element reference or string ID, or
 * object literal of syntax {record:oRecord, column:oColumn} from which to get previous TD element.
 * @return {HTMLElement} Reference to previous TD element, or null.
 */
getPreviousTdEl : function(cell) {
    var elCell = this.getTdEl(cell);
    if(elCell) {
        var nThisTdIndex = elCell.cellIndex;
        ///var nThisTdIndex = elCell.yuiCellIndex;
        var elRow = this.getTrEl(elCell);
        if(nThisTdIndex > 0) {
            return elRow.cells[nThisTdIndex-1];
        }
        else {
            var elPreviousRow = this.getPreviousTrEl(elRow);
            if(elPreviousRow) {
                return this.getLastTdEl(elPreviousRow);
            }
        }
    }
    YAHOO.log("Could not get next TD element for cell " + cell, "info", this.toString());
    return null;
},

/**
 * Returns DOM reference to the above TD element from the given cell, or null.
 *
 * @method getAboveTdEl
 * @param cell {HTMLElement | String | Object} DOM element reference or string ID, or
 * object literal of syntax {record:oRecord, column:oColumn} from which to get next TD element.
 * @return {HTMLElement} Reference to next TD element, or null.
 */
getAboveTdEl : function(cell) {
    var elCell = this.getTdEl(cell);
    if(elCell) {
        var elPreviousRow = this.getPreviousTrEl(elCell);
        if(elPreviousRow) {
            return elPreviousRow.cells[elCell.cellIndex];
            ///return elPreviousRow.cells[elCell.yuiCellIndex];
        }
    }
    YAHOO.log("Could not get above TD element for cell " + cell, "info", this.toString());
    return null;
},

/**
 * Returns DOM reference to the below TD element from the given cell, or null.
 *
 * @method getBelowTdEl
 * @param cell {HTMLElement | String | Object} DOM element reference or string ID, or
 * object literal of syntax {record:oRecord, column:oColumn} from which to get previous TD element.
 * @return {HTMLElement} Reference to previous TD element, or null.
 */
getBelowTdEl : function(cell) {
    var elCell = this.getTdEl(cell);
    if(elCell) {
        var elNextRow = this.getNextTrEl(elCell);
        if(elNextRow) {
            return elNextRow.cells[elCell.cellIndex];
            ///return elNextRow.cells[elCell.yuiCellIndex];
        }
    }
    YAHOO.log("Could not get below TD element for cell " + cell, "info", this.toString());
    return null;
},

/**
 * Returns DOM reference to a TH liner element.
 *
 * @method getThLinerEl
 * @param theadCell {YAHOO.widget.Column | HTMLElement | String} Column instance,
 * DOM element reference, or string ID.
 * @return {HTMLElement} Reference to TH liner element.
 */
getThLinerEl : function(theadCell) {
    var elCell = this.getThEl(theadCell);
    return elCell.firstChild || null;
},

/**
 * Returns DOM reference to a TH element.
 *
 * @method getThEl
 * @param theadCell {YAHOO.widget.Column | HTMLElement | String} Column instance,
 * DOM element reference, or string ID.
 * @return {HTMLElement} Reference to TH element.
 */
getThEl : function(theadCell) {
    var elTheadCell;

    // Validate Column instance
    if(theadCell instanceof YAHOO.widget.Column) {
        var oColumn = theadCell;
        elTheadCell = oColumn.getThEl();
        if(elTheadCell) {
            return elTheadCell;
        }
    }
    // Validate HTML element
    else {
        var el = Dom.get(theadCell);

        if(el && (el.ownerDocument == document)) {
            // Validate TH element
            if(el.nodeName.toLowerCase() != "th") {
                // Traverse up the DOM to find the corresponding TR element
                elTheadCell = Dom.getAncestorByTagName(el,"th");
            }
            else {
                elTheadCell = el;
            }

            // Make sure the TH is in this THEAD
            if(elTheadCell && (elTheadCell.parentNode.parentNode == this._elThead)) {
                // Now we can return the TD element
                return elTheadCell;
            }
        }
    }

    return null;
},

/**
 * Returns the page row index of given row. Returns null if the row is not on the
 * current DataTable page.
 *
 * @method getTrIndex
 * @param row {HTMLElement | String | YAHOO.widget.Record | Number} DOM or ID
 * string reference to an element within the DataTable page, a Record instance,
 * or a Record's RecordSet index.
 * @return {Number} Page row index, or null if row does not exist or is not on current page.
 */
getTrIndex : function(row) {
    var nRecordIndex;

    // By Record
    if(row instanceof YAHOO.widget.Record) {
        nRecordIndex = this._oRecordSet.getRecordIndex(row);
        if(nRecordIndex === null) {
            // Not a valid Record
            return null;
        }
    }
    // Calculate page row index from Record index
    else if(lang.isNumber(row)) {
        nRecordIndex = row;
    }
    if(lang.isNumber(nRecordIndex)) {
        // Validate the number
        if((nRecordIndex > -1) && (nRecordIndex < this._oRecordSet.getLength())) {
            // DataTable is paginated
            var oPaginator = this.get('paginator');
            if(oPaginator instanceof Pag || this.get('paginated')) {
                // Get the first and last Record on current page
                var startRecordIndex = 0,
                    endRecordIndex   = 0;

                if (oPaginator instanceof Pag) {
                    var rng = oPaginator.getPageRecords();
                    startRecordIndex = rng[0];
                    endRecordIndex   = rng[1];
                } else {
                    startRecordIndex = oPaginator.startRecordIndex;
                    endRecordIndex = startRecordIndex + oPaginator.rowsPerPage - 1;
                }

                // This Record is on current page
                if((nRecordIndex >= startRecordIndex) && (nRecordIndex <= endRecordIndex)) {
                    return nRecordIndex - startRecordIndex;
                }
                // This Record is not on current page
                else {
                    return null;
                }
            }
            // Not paginated, just return the Record index
            else {
                return nRecordIndex;
            }
        }
        // RecordSet index is out of range
        else {
            return null;
        }
    }
    // By element reference or ID string
    else {
        // Validate TR element
        var elRow = this.getTrEl(row);
        if(elRow && (elRow.ownerDocument == document) &&
                (elRow.parentNode == this._elTbody)) {
            return elRow.sectionRowIndex;
        }
    }

    YAHOO.log("Could not get page row index for row " + row, "info", this.toString());
    return null;
},














































// TABLE FUNCTIONS

/**
 * Resets a RecordSet with the given data and populates the page view
 * with the new data. Any previous data, and selection and sort states are
 * cleared. The render method should be called as a separate step in order
 * to update the UI. 
 *
 * @method initializeTable
 */
initializeTable : function() {
    // Reset init flag
    this._bInit = true;
    
    // Clear the RecordSet
    this._oRecordSet.reset();

    // Clear selections
    this._unselectAllTrEls();
    this._unselectAllTdEls();
    this._aSelections = null;
    this._oAnchorRecord = null;
    this._oAnchorCell = null;
    
    // Clear sort
    this.set("sortedBy", null);
},

/**
 * Renders the view with existing Records from the RecordSet while
 * maintaining sort, pagination, and selection states. For performance, reuses
 * existing DOM elements when possible while deleting extraneous elements.
 *
 * @method render
 */
render : function() {
YAHOO.log("start render","time");

    this._oChainRender.stop();
    this.showTableMessage(DT.MSG_LOADING, DT.CLASS_LOADING);
    YAHOO.log("DataTable rendering...", "info", this.toString());

    var i, j, k, l, len, allRecords;

    // Paginator is enabled, show a subset of Records and update Paginator UI
    var oPaginator = this.get('paginator');
    var bPaginated = oPaginator instanceof Pag || this.get('paginated');
    if(bPaginated) {
        if (oPaginator instanceof Pag) {
            allRecords = this._oRecordSet.getRecords(
                            oPaginator.getStartIndex(),
                            oPaginator.getRowsPerPage());
            oPaginator.render();
        }
        else {
            // Backward compatibility
            this.updatePaginator();
            var rowsPerPage = oPaginator.rowsPerPage;
            var startRecordIndex = (oPaginator.currentPage - 1) * rowsPerPage;
            allRecords = this._oRecordSet.getRecords(startRecordIndex, rowsPerPage);
            this.formatPaginators();
        }
    }
    // Show all records
    else {
        allRecords = this._oRecordSet.getRecords();
    }

    var elTbody = this._elTbody;
    var allRows = elTbody.rows;

    // Should have rows
    if(lang.isArray(allRecords) && (allRecords.length > 0)) {
        // Keep track of selected rows
        var allSelectedRows = this.getSelectedRows();
        // Keep track of selected cells
        var allSelectedCells = this.getSelectedCells();
        // Anything to reinstate?
        var bReselect = (allSelectedRows.length>0) || (allSelectedCells.length > 0);

        // Remove extra rows from the bottom so as to preserve ID order
        while(elTbody.hasChildNodes() && (allRows.length > allRecords.length)) {
            elTbody.removeChild(allRows[allRows.length-1]); // Bug 1831689
        }

        // Unselect all TR and TD elements in the UI
        if(bReselect) {
            this._unselectAllTrEls();
            this._unselectAllTdEls();
        }

        this.hideTableMessage();

        // How many rows to work with each loop
        var loopN = this.get("renderLoopSize");
        var loopStart,
            loopEnd;
        
        // From the top, update in-place existing rows, so as to reuse DOM elements
        if(allRows.length > 0) {
            loopEnd = allRows.length; // End at last row
            this._oChainRender.add({
                method: function(oArg) {
                    if((this instanceof DT) && this._sId) {
                        var i = oArg.nCurrentRow,
                            // Must reference allRows.length instead of loopEnd
                            // here because loopEnd is reused below outside
                            // this closure.
                            len = loopN > 0 ? Math.min(i + loopN,allRows.length) : allRows.length;
                        for(; i < len; ++i) {
                            this._updateTrEl(allRows[i], allRecords[i]);
                        }
                        if (loopN > 0) {
                        }
                        oArg.nCurrentRow = i;
                    }
                },
                iterations: (loopN > 0) ? Math.ceil(loopEnd/loopN) : 1,
                argument: {nCurrentRow:0}, // Start at first row
                scope: this,
                timeout: (loopN > 0) ? 0 : -1
            });
        }

        loopStart = allRows.length; // where to start
        loopEnd = allRecords.length; // where to end

        /* Not chained for testing
        // Add more TR elements as necessary
        i = 0;
            len = loopEnd;
            var df = document.createDocumentFragment(),
            tr;
        for(; i < len; ++i) {
            tr = this._addTrEl(allRecords[i]);
            tr.className = (i%2) ? DT.CLASS_ODD : DT.CLASS_EVEN;
            df.appendChild(tr);
        }
        this._elTbody.appendChild(df);*/


        // Add more TR elements as necessary
        var nRowsNeeded = (loopEnd - loopStart); // how many needed
        if(nRowsNeeded > 0) {
            this._oChainRender.add({
                method: function(oArg) {
                    if((this instanceof DT) && this._sId) {
                        var i = oArg.nCurrentRow,
                            len = loopN > 0 ? Math.min(i + loopN,loopEnd) : loopEnd,
                            df = document.createDocumentFragment(),
                            tr;
                        for(; i < len; ++i) {
                            tr = this._addTrEl(allRecords[i]);
                            Dom.addClass(tr, (i%2) ? DT.CLASS_ODD : DT.CLASS_EVEN);
                            df.appendChild(tr);
                        }
                        this._elTbody.appendChild(df);
                        if (loopN > 0) {
                        }
                        oArg.nCurrentRow = i;
                    }
                },
                iterations: (loopN > 0) ? Math.ceil(nRowsNeeded/loopN) : 1,
                argument: {nCurrentRow:loopStart}, // start at last row
                scope: this,
                timeout: (loopN > 0) ? 0 : -1
            });
        }


        this._oChainRender.add({
            method: function(oArg) {
                if((this instanceof DT) && this._sId) {
                    this._setFirstRow();
                    this._setLastRow();

                    // Reinstate selected and sorted classes
                    if(bReselect) {
                        // Loop over each row
                        for(j=0; j<allRows.length; j++) {
                            var thisRow = allRows[j];
                            var sMode = this.get("selectionMode");
                            if ((sMode == "standard") || (sMode == "single")) {
                                // Set SELECTED
                                for(k=0; k<allSelectedRows.length; k++) {
                                    if(allSelectedRows[k] === this.getRecord(this.getRecordIndex(thisRow.sectionRowIndex)).getId()) {
                                    ///if(allSelectedRows[k] === thisRow.yuiRecordId) {
                                        Dom.addClass(thisRow, DT.CLASS_SELECTED);
                                        if(j === allRows.length-1) {
                                            this._oAnchorRecord = this.getRecord(this.getRecordIndex(thisRow.sectionRowIndex));
                                            ///this._oAnchorRecord = this.getRecord(thisRow.yuiRecordId);
                                        }
                                    }
                                }
                            }
                            else {
                                // Loop over each cell
                                for(k=0; k<thisRow.cells.length; k++) {
                                    var thisCell = thisRow.cells[k];
                                    // Set SELECTED
                                    for(l=0; l<allSelectedCells.length; l++) {
                                        if((allSelectedCells[l].recordId === this.getRecord(this.getRecordIndex(thisRow.sectionRowIndex)).getId()) &&
                                        ///if((allSelectedCells[l].recordId === thisRow.yuiRecordId) &&
                                                (allSelectedCells[l].columnId === this.getColumn(thisCell.cellIndex).getId())) {
                                                ///(allSelectedCells[l].columnId === thisCell.yuiColumnId)) {
                                            Dom.addClass(thisCell, DT.CLASS_SELECTED);
                                            if(k === thisRow.cells.length-1) {
                                                this._oAnchorCell = {record:this.getRecord(this.getRecordIndex(thisRow.sectionRowIndex)), column:this.getColumn(thisCell.cellIndex)};
                                                ///this._oAnchorCell = {record:this.getRecord(thisRow.yuiRecordId), column:this.getColumnById(thisCell.yuiColumnId)};
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                
                if(this._bInit) {
                    ///this._forceGeckoRedraw();

                    this._oChainRender.add({
                        method: function() {
                            if((this instanceof DT) && this._sId && this._bInit) {
                                this._bInit = false;
                                this.fireEvent("initEvent");
                                YAHOO.log("DataTable initialized with " + allRecords.length + " of " + this._oRecordSet.getLength() + " rows", "info", this.toString());
                            }
                        },
                        scope: this
                    });
                    this._oChainRender.run();
                }
                else {
                    this.fireEvent("renderEvent");
                    // Backward compatibility
                    this.fireEvent("refreshEvent");
                    YAHOO.log("DataTable rendered " + allRecords.length + " of " + this._oRecordSet.getLength() + " rows", "info", this.toString());
                }
            
            },
            scope: this,
            timeout: (loopN > 0) ? 0 : -1
        }); 
        
        this._oChainRender.add({
            method: function() {
                if((this instanceof DT) && this._sId) {
                    YAHOO.log("end render","time");
                }
            },
            scope: this
        });
                    
        this._oChainRender.run();

    }
    // Empty
    else {
        // Remove all rows
        while(elTbody.hasChildNodes()) {
            elTbody.deleteRow(-1);
        }

        this.showTableMessage(DT.MSG_EMPTY, DT.CLASS_EMPTY);
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
    
    // Destroy ColumnDD and ColumnResizers
    this._destroyColumnHelpers();
    
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
 * Displays message within secondary TBODY.
 *
 * @method showTableMessage
 * @param sHTML {String} (optional) Value for innerHTMlang.
 * @param sClassName {String} (optional) Classname.
 */
showTableMessage : function(sHTML, sClassName) {
    var elCell = this._elMsgTd;
    if(lang.isString(sHTML)) {
        elCell.firstChild.innerHTML = sHTML;
    }
    if(lang.isString(sClassName)) {
        Dom.addClass(elCell.firstChild, sClassName);
    }

    this._elMsgTbody.style.display = "";

    this.fireEvent("tableMsgShowEvent", {html:sHTML, className:sClassName});
    YAHOO.log("DataTable showing message: " + sHTML, "info", this.toString());
},

/**
 * Hides secondary TBODY.
 *
 * @method hideTableMessage
 */
hideTableMessage : function() {
    if(this._elMsgTbody.style.display != "none") {
        this._elMsgTbody.style.display = "none";
        this._elMsgTbody.parentNode.style.width = "";
        this.fireEvent("tableMsgHideEvent");
        YAHOO.log("DataTable message hidden", "info", this.toString());
    }
},

/**
 * Brings focus to the TBODY element. Alias to focusTbodyEl.
 *
 * @method focus
 */
focus : function() {
    this.focusTbodyEl();
},

/**
 * Brings focus to the THEAD element.
 *
 * @method focusTheadEl
 */
focusTheadEl : function() {
    this._focusEl(this._elThead);
},

/**
 * Brings focus to the TBODY element.
 *
 * @method focusTbodyEl
 */
focusTbodyEl : function() {
    this._focusEl(this._elTbody);
},

































































// RECORDSET FUNCTIONS

/**
 * Returns Record index for given TR element or page row index.
 *
 * @method getRecordIndex
 * @param row {YAHOO.widget.Record | HTMLElement | Number} Record instance, TR
 * element reference or page row index.
 * @return {Number} Record's RecordSet index, or null.
 */
getRecordIndex : function(row) {
    var nTrIndex;

    if(!lang.isNumber(row)) {
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

    if(lang.isNumber(nTrIndex)) {
        var oPaginator = this.get("paginator");
        if(oPaginator instanceof Pag) {
            return oPaginator.get('recordOffset') + nTrIndex;
        }
        else if (this.get('paginated')) {
            return oPaginator.startRecordIndex + nTrIndex;
        }
        else {
            return nTrIndex;
        }
    }

    YAHOO.log("Could not get Record index for row " + row, "info", this.toString());
    return null;
},

/**
 * For the given identifier, returns the associated Record instance.
 *
 * @method getRecord
 * @param row {HTMLElement | Number | String} DOM reference to a TR element (or
 * child of a TR element), RecordSet position index, or Record ID.
 * @return {YAHOO.widget.Record} Record instance.
 */
getRecord : function(row) {
    var oRecord = this._oRecordSet.getRecord(row);

    if(!oRecord) {
        // Validate TR element
        var elRow = this.getTrEl(row);
        if(elRow) {
            oRecord = this._oRecordSet.getRecord(this.getRecordIndex(elRow.sectionRowIndex));
            ///oRecord = this._oRecordSet.getRecord(elRow.yuiRecordId);
        }
    }

    if(oRecord instanceof YAHOO.widget.Record) {
        return this._oRecordSet.getRecord(oRecord);
    }
    else {
        YAHOO.log("Could not get Record for row at " + row, "info", this.toString());
        return null;
    }
},














































// COLUMN FUNCTIONS

/**
 * For the given identifier, returns the associated Column instance. Note: For
 * getting Columns by Column ID string, please use the method getColumnById().
 *
 * @method getColumn
 * @param column {HTMLElement | String | Number} DOM reference or ID string to a
 * TH/TD element (or child of a TH/TD element), a Column key, or a ColumnSet key index.
 * @return {YAHOO.widget.Column} Column instance.
 */
getColumn : function(column) {
    var oColumn = this._oColumnSet.getColumn(column);

    if(!oColumn) {
        // Validate TD element
        var elCell = this.getTdEl(column);
        if(elCell) {
            oColumn = this._oColumnSet.getColumn(elCell.cellIndex);
            ///oColumn = this._oColumnSet.getColumnById(elCell.yuiColumnId);
        }
        // Validate TH element
        else {
            elCell = this.getThEl(column);
            if(elCell) {
                oColumn = this._oColumnSet.getColumn(elCell.cellIndex);
                ///oColumn = this._oColumnSet.getColumnById(elCell.yuiColumnId);
            }
        }
    }
    if(!oColumn) {
        YAHOO.log("Could not get Column for column at " + column, "info", this.toString());
    }
    return oColumn;
},

/**
 * For the given Column ID, returns the associated Column instance. Note: For
 * getting Columns by key, please use the method getColumn().
 *
 * @method getColumnById
 * @param column {String} Column ID string.
 * @return {YAHOO.widget.Column} Column instance.
 */
getColumnById : function(column) {
    return this._oColumnSet.getColumnById(column);
},

/**
 * For the given Column instance, returns next direction to sort.
 *
 * @method getColumnSortDir
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @return {String} DataTable.widget.CLASS_ASC or DataTable.widget.CLASS_DESC.
 */
getColumnSortDir : function(oColumn) {
    // Backward compatibility
    if(oColumn.sortOptions && oColumn.sortOptions.defaultOrder) {
        if(oColumn.sortOptions.defaultOrder == "asc") {
            oColumn.sortOptions.defaultDir = DT.CLASS_ASC;
        }
        else if (oColumn.sortOptions.defaultOrder == "desc") {
            oColumn.sortOptions.defaultDir = DT.CLASS_DESC;
        }
    }
    
    // What is the Column's default sort direction?
    var sortDir = (oColumn.sortOptions && oColumn.sortOptions.defaultDir) ? oColumn.sortOptions.defaultDir : DT.CLASS_ASC;

    // Already sorted?
    var bSorted = false;
    var oSortedBy = this.get("sortedBy");
    if(oSortedBy && (oSortedBy.key === oColumn.key)) {
        bSorted = true;
        if(oSortedBy.dir) {
            sortDir = (oSortedBy.dir == DT.CLASS_ASC) ? DT.CLASS_DESC : DT.CLASS_ASC;
        }
        else {
            sortDir = (sortDir == DT.CLASS_ASC) ? DT.CLASS_DESC : DT.CLASS_ASC;
        }
    }
    return sortDir;
},

/**
 * Sorts given Column.
 *
 * @method sortColumn
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @param sDir {String} (Optional) YAHOO.widget.DataTable.CLASS_ASC or
 * YAHOO.widget.DataTable.CLASS_DESC
 */
sortColumn : function(oColumn, sDir) {
    if(oColumn && (oColumn instanceof YAHOO.widget.Column)) {
        if(!oColumn.sortable) {
            Dom.addClass(this.getThEl(oColumn), DT.CLASS_SORTABLE);
        }
        
        // Validate given direction
        if(sDir && (sDir !== DT.CLASS_ASC) && (sDir !== DT.CLASS_DESC)) {
            sDir = null;
        }
        
        // Get the sort dir
        var sortDir = sDir || this.getColumnSortDir(oColumn);

        // Do the actual sort
        var oSortedBy = this.get("sortedBy") || {};
        var bSorted = (oSortedBy.key === oColumn.key) ? true : false;
        if(!bSorted || sDir) {
            // Is there a custom sort handler function defined?
            var sortFnc = (oColumn.sortOptions && lang.isFunction(oColumn.sortOptions.sortFunction)) ?
                    // Custom sort function
                    oColumn.sortOptions.sortFunction :

                    // Default sort function
                    function(a, b, desc) {
                        var sorted = YAHOO.util.Sort.compare(a.getData(oColumn.key),b.getData(oColumn.key), desc);
                        if(sorted === 0) {
                            return YAHOO.util.Sort.compare(a.getId(),b.getId(), desc);
                        }
                        else {
                            return sorted;
                        }
                    };

            this._oRecordSet.sortRecords(sortFnc, ((sortDir == DT.CLASS_DESC) ? true : false));
        }
        else {
            this._oRecordSet.reverseRecords();
        }

        // Update sortedBy tracker
        this.set("sortedBy", {key:oColumn.key, dir:sortDir, column:oColumn});

        // Reset to first page
        //TODO: Keep selection in view
        var oPaginator = this.get('paginator');
        if (oPaginator instanceof Pag) {
            // TODO : is this server-side op safe?  Will fire changeRequest
            // event mechanism
            oPaginator.setPage(1,true);
        }
        else if (this.get('paginated')) {
            // Backward compatibility
            this.updatePaginator({currentPage:1});
        }

        // Update the UI
        DT.formatTheadCell(oColumn.getThEl().firstChild.firstChild, oColumn, this);
        this.render();

        this.fireEvent("columnSortEvent",{column:oColumn,dir:sortDir});
        YAHOO.log("Column \"" + oColumn.key + "\" sorted \"" + sortDir + "\"", "info", this.toString());
    }
    else {
        YAHOO.log("Could not sort Column \"" + oColumn.key + "\"", "warn", this.toString());
    }
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
            // This is why we must require a Number... :-|
            nWidth = (nWidth > oColumn.minWidth) ? nWidth : oColumn.minWidth;

            // Save state
            oColumn.width = nWidth;
            
            // Resize the DOM elements
            this._setColumnWidth(oColumn, nWidth+"px");
            
            this.fireEvent("columnSetWidthEvent",{column:oColumn,width:nWidth});
            YAHOO.log("Set width of Column " + oColumn + " to " + nWidth + "px", "info", this.toString());
            return;
        }
    }
    YAHOO.log("Could not set width of Column " + oColumn + " to " + nWidth + "px", "warn", this.toString());
},

/**
 * Sets liner DIV elements of given Column to given width. When value should be
 * auto-calculated to fit content overflow is set to visible, otherwise overflow
 * is set to hidden. No validations against minimum width and no updating
 * Column.width value.
 *
 * @method _setColumnWidth
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @param sWidth {String} New width value.
 * @private
 */
_setColumnWidth : function(oColumn, sWidth) {
///TODO: blow away the tr template for fallback cases
YAHOO.log('start _sColumnWidth','time');
    if(oColumn && (oColumn.getKeyIndex() !== null)) {
        var sOverflow = ((sWidth === '') || (sWidth === 'auto')) ? 'visible' : 'hidden';
    
        // Dynamic style algorithm
        if(!DT._bDynStylesFallback) {
            this._setColumnWidthDynStyles(oColumn, sWidth, sOverflow);
        }
        // Dynamic function algorithm
        else {
            this._setColumnWidthDynFunction(oColumn, sWidth, sOverflow);
        }
    }
    else {
        YAHOO.log("Could not set width of unknown Column " + oColumn + " to " + sWidth, "warn", this.toString());
    }
    YAHOO.log('end _sColumnWidth','time');
},

/**
 * Updates width of a Column's liner DIV elements by dynamically creating a
 * STYLE node and writing and updating CSS style rules to it. If this fails during
 * runtime, the fallback method _setColumnWidthDynFunction() will be called.
 * Notes: This technique is not performant in IE6. IE7 crashes if DataTable is
 * nested within another TABLE element. For these cases, it is recommended to
 * use the method _setColumnWidthDynFunction by setting _bDynStylesFallback to TRUE.
 *
 * @method _setColumnWidthDynStyles
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @param sWidth {String} New width value.
 * @private
 */
_setColumnWidthDynStyles : function(oColumn, sWidth, sOverflow) {
YAHOO.log('start _setColumnWidthDynStyles','time');
    var s = DT._elDynStyleNode,
        rule;
    
    // Create a new STYLE node
    if(!s) {
        s = document.createElement('style');
        s.type = 'text/css';
        s = document.getElementsByTagName('head').item(0).appendChild(s);
        DT._elDynStyleNode = s;
    }
    
    // We have a STYLE node to update
    if(s) {
        // Unique classname for this Column instance
        var sClassname = '.yui-dt-col' + oColumn.getId() + ' .yui-dt-liner';
        
        // Hide for performance
        if(this._elTbody) {
            this._elTbody.style.display = 'none';
        }
        
        rule = DT._oDynStyles[sClassname];

        // The Column does not yet have a rule
        if(!rule) {
            if(s.styleSheet && s.styleSheet.addRule) {
                s.styleSheet.addRule(sClassname,"overflow:"+sOverflow);
                s.styleSheet.addRule(sClassname,'width:'+sWidth);
                rule = s.styleSheet.rules[s.styleSheet.rules.length-1];
                DT._oDynStyles[sClassname] = rule;
            }
            else if(s.sheet && s.sheet.insertRule) {
                s.sheet.insertRule(sClassname+" {overflow:"+sOverflow+";width:"+sWidth+";}",s.sheet.cssRules.length);
                rule = s.sheet.cssRules[s.sheet.cssRules.length-1];
                DT._oDynStyles[sClassname] = rule;
            }
        }
        // We have a rule to update
        else {
            rule.style.overflow = sOverflow;
            rule.style.width = sWidth;
        } 
        
        // Unhide
        if(this._elTbody) {
            this._elTbody.style.display = '';
        }
    }
YAHOO.log('end _setColumnWidthDynStyles','time');
    
    // That was not a success, we must call the fallback routine
    if(!rule) {
        DT._bDynStylesFallback = true;
        this._setColumnWidthDynFunction(oColumn, sWidth);
    }
},

/**
 * Updates width of a Column's liner DIV elements by dynamically creating a
 * function to update all element style properties in one pass. Note: This
 * technique is not supported in sandboxed environments that prohibit EVALs.    
 *
 * @method _setColumnWidthDynFunction
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @param sWidth {String} New width value.
 * @private
 */
_setColumnWidthDynFunction : function(oColumn, sWidth, sOverflow) {
YAHOO.log('start _setColumnWidthDynFunction','time');
    ///TODO: why is this here?
    if(sWidth == 'auto') {
        sWidth = ''; 
    }
    
    // Create one function for each value of rows.length
    var rowslen = this._elTbody ? this._elTbody.rows.length : 0;
    
    // Dynamically create the function
    if (!this._aDynFunctions[rowslen]) {
        
        //Compile a custom function to do all the liner div width
        //assignments at the same time.  A unique function is required
        //for each unique number of rows in _elTbody.  This will
        //result in a function declaration like:
        //function (oColumn,sWidth,sOverflow) {
        //    var colIdx = oColumn.getKeyIndex();
        //    oColumn.getThEl().firstChild.style.overflow =
        //    this._elTbody.rows[0].cells[colIdx].firstChild.style.overflow =
        //    this._elTbody.rows[1].cells[colIdx].firstChild.style.overflow =
        //    ... (for all row indices in this._elTbody.rows.length - 1)
        //    this._elTbody.rows[99].cells[colIdx].firstChild.style.overflow =
        //    sOverflow;
        //    oColumn.getThEl().firstChild.style.width =
        //    this._elTbody.rows[0].cells[colIdx].firstChild.style.width =
        //    this._elTbody.rows[1].cells[colIdx].firstChild.style.width =
        //    ... (for all row indices in this._elTbody.rows.length - 1)
        //    this._elTbody.rows[99].cells[colIdx].firstChild.style.width =
        //    sWidth;
        //}
        
        var i,j,k;
        var resizerDef = [
            'var colIdx=oColumn.getKeyIndex();',
            'oColumn.getThEl().firstChild.style.overflow='
        ];
        for (i=rowslen-1, j=2; i >= 0; --i) {
            resizerDef[j++] = 'this._elTbody.rows[';
            resizerDef[j++] = i;
            resizerDef[j++] = '].cells[colIdx].firstChild.style.overflow=';
        }
        resizerDef[j] = 'sOverflow;';
        resizerDef[j+1] = 'oColumn.getThEl().firstChild.style.width=';
        for (i=rowslen-1, k=j+2; i >= 0; --i) {
            resizerDef[k++] = 'this._elTbody.rows[';
            resizerDef[k++] = i;
            resizerDef[k++] = '].cells[colIdx].firstChild.style.width=';
        }
        resizerDef[k] = 'sWidth;';
        this._aDynFunctions[rowslen] =
            new Function('oColumn','sWidth','sOverflow',resizerDef.join(''));
    }
    
    // Get the function to execute
    var resizerFn = this._aDynFunctions[rowslen];

    ///TODO: Hide TBODY for performance?
    if (resizerFn) {
        ///this._elTbody.style.display = 'none';
        resizerFn.call(this,oColumn,sWidth,sOverflow);
        ///this._elTbody.style.display = '';
    }
YAHOO.log('end _setColumnWidthDynFunction','time');
},

/**
 * Validates a Column (if given) or else all Columns against given minWidths, if any,
 * and if Column is not hidden nor has a set width. 
 *
 * @method _validateMinWidths
 * @param oArg.column {YAHOO.widget.Column} Affected Column instance, if available.
 * @private
 */
_validateMinWidths : function(oArg) {
    var elColgroup = this._elColgroup;
    var elColgroupClone = elColgroup.cloneNode(true);
    var bNeedsValidation = false;
    var allKeys = this._oColumnSet.keys;
    var elThLiner, oColumn;
    // Validate just one Column
    if(oArg && oArg.column) {
        oColumn = oArg.column;
        if(!oColumn.hidden && !oColumn.width && oColumn.minWidth) {
            elThLiner = oColumn.getThEl().firstChild;
            if(elThLiner.offsetWidth < oColumn.minWidth) {
                elColgroupClone.childNodes[oColumn.getKeyIndex()].style.width = 
                        oColumn.minWidth + 
                        (parseInt(Dom.getStyle(elThLiner,"paddingLeft"),10)|0) +
                        (parseInt(Dom.getStyle(elThLiner,"paddingRight"),10)|0) + "px";
                bNeedsValidation = true;
            }
        }
    }
    // Validate all Columns
    else {
        for(var i=0, l=allKeys.length; i<l; i++) {
            oColumn = allKeys[i];
            if(!oColumn.hidden && !oColumn.width && oColumn.minWidth) {
                elThLiner = oColumn.getThEl().firstChild;
                if(elThLiner.offsetWidth < oColumn.minWidth) {
                    elColgroupClone.childNodes[i].style.width = 
                            oColumn.minWidth + 
                            (parseInt(Dom.getStyle(elThLiner,"paddingLeft"),10)|0) +
                            (parseInt(Dom.getStyle(elThLiner,"paddingRight"),10)|0) + "px";
                    bNeedsValidation = true;
                }
            }
        }
    }
    if(bNeedsValidation) {
        elColgroup.parentNode.replaceChild(elColgroupClone, elColgroup);
        this._elColgroup = elColgroupClone;
    }
},

/**
 * Clears minWidth.
 *
 * @method _clearMinWidth
 * @param oColumn {YAHOO.widget.Column} Which Column.
 * @private
 */
_clearMinWidth : function(oColumn) {
    //TODO: SDT has 2 colgroups
    this._elColgroup.childNodes[oColumn.getKeyIndex()].style.width = '';
},

/**
 * Restores minWidth.
 *
 * @method _restoreMinWidth
 * @param oColumn {YAHOO.widget.Column} Which Column.
 * @private
 */
_restoreMinWidth : function(oColumn) {
    //TODO: SDT has 2 colgroups
    if(oColumn.minWidth) {
        this._elColgroup.childNodes[oColumn.getKeyIndex()].style.width = oColumn.minWidth + 'px';
    }
},

/**
 * Hides given Column. NOTE: You cannot hide/show nested Columns. You can only
 * hide/show non-nested Columns, and top-level parent Columns (which will
 * hide/show all children Columns).
 *
 * @method hideColumn
 * @param oColumn {YAHOO.widget.Column} Column instance.
 */
hideColumn : function(oColumn) {
    // Only top-level Columns can get hidden due to issues in FF2 and SF3
    if(oColumn && !oColumn.hidden && oColumn.getTreeIndex() !== null) {
        
        var allrows = this.getTbodyEl().rows;
        var l = allrows.length;
        var allDescendants = this._oColumnSet.getDescendants(oColumn);
        
        // Hide each nested Column
        for(var i=0; i<allDescendants.length; i++) {
            var thisColumn = allDescendants[i];
            thisColumn.hidden = true;

            // Style the head cell
            Dom.addClass(thisColumn.getThEl(), DT.CLASS_HIDDEN);
            
            // Does this Column have body cells?
            var thisKeyIndex = thisColumn.getKeyIndex();
            if(thisKeyIndex !== null) {                    
                // Clear minWidth
                this._clearMinWidth(oColumn);
                
                // Style the body cells
                for(var j=0;j<l;j++) {
                    Dom.addClass(allrows[j].cells[thisKeyIndex],DT.CLASS_HIDDEN);
                }
            }
            
            this.fireEvent("columnHideEvent",{column:thisColumn});
            YAHOO.log("Column \"" + oColumn.key + "\" hidden", "info", this.toString());
        }
      
        this._repaintOpera();
        this._clearTrTemplateEl();
    }
    else {
        YAHOO.log("Could not hide Column \"" + oColumn.key + "\". Only non-nested Columns can be hidden", "warn", this.toString());
    }
},

/**
 * Shows given Column. NOTE: You cannot hide/show nested Columns. You can only
 * hide/show non-nested Columns, and top-level parent Columns (which will
 * hide/show all children Columns).
 *
 * @method showColumn
 * @param oColumn {YAHOO.widget.Column} Column instance.
 */
showColumn : function(oColumn) {
    // Only top-level Columns can get hidden
    if(oColumn && oColumn.hidden && (oColumn.getTreeIndex() !== null)) {
        var allrows = this.getTbodyEl().rows;
        var l = allrows.length;
        var allDescendants = this._oColumnSet.getDescendants(oColumn);
        
        // Show each nested Column
        for(var i=0; i<allDescendants.length; i++) {
            var thisColumn = allDescendants[i];
            thisColumn.hidden = false;
            
            // Unstyle the head cell
            Dom.removeClass(thisColumn.getThEl(), DT.CLASS_HIDDEN);

            // Does this Column have body cells?
            var thisKeyIndex = thisColumn.getKeyIndex();
            if(thisKeyIndex !== null) {
                // Restore minWidth
                this._restoreMinWidth(oColumn);
                
            
                // Unstyle the body cells
                for(var j=0;j<l;j++) {
                    Dom.removeClass(allrows[j].cells[thisKeyIndex],DT.CLASS_HIDDEN);
                }
            }

            this.fireEvent("columnShowEvent",{column:thisColumn});
            YAHOO.log("Column \"" + oColumn.key + "\" shown", "info", this.toString());
        }
        this._clearTrTemplateEl();
    }
    else {
        YAHOO.log("Could not show Column \"" + oColumn.key + "\". Only non-nested Columns can be shown", "warn", this.toString());
    }
},

/**
 * Removes given Column. NOTE: You cannot remove nested Columns. You can only remove
 * non-nested Columns, and top-level parent Columns (which will remove all
 * children Columns).
 *
 * @method removeColumn
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @return oColumn {YAHOO.widget.Column} Removed Column instance.
 */
removeColumn : function(oColumn) {
    var nColTreeIndex = oColumn.getTreeIndex();
    if(nColTreeIndex !== null) {
        this._oChainRender.stop();
        var aOrigColumnDefs = this._oColumnSet.getDefinitions();

        oColumn = aOrigColumnDefs.splice(nColTreeIndex,1)[0];
        this._initColumnSet(aOrigColumnDefs);
        this._initTheadEl();

        this.render();
        this.fireEvent("columnRemoveEvent",{column:oColumn});
        YAHOO.log("Column \"" + oColumn.key + "\" removed", "info", this.toString());
        return oColumn;
    }
    YAHOO.log("Could not remove Column \"" + oColumn.key + "\". Only non-nested Columns can be removed", "warn", this.toString());
},

/**
 * Inserts given Column at the index if given, otherwise at the end. NOTE: You
 * can only add non-nested Columns and top-level parent Columns. You cannot add
 * a nested Column to an existing parent.
 *
 * @method insertColumn
 * @param oColumn {Object | YAHOO.widget.Column} Object literal Column
 * definition or a Column instance.
 * @param index {Number} (optional) Column key index.
 */
insertColumn : function(oColumn, index) {
    // Validate Column
    if(oColumn instanceof YAHOO.widget.Column) {
        oColumn = oColumn.getDefinition();
    }
    else if(oColumn.constructor !== Object) {
        YAHOO.log("Could not insert Column \"" + oColumn + "\" due to invalid argument", "warn", this.toString());
        return;
    }
    
    var oColumnSet = this._oColumnSet;

    // Validate index
    if(!lang.isValue(index) || !lang.isNumber(index)) {
        index = oColumnSet.tree[0].length;
    }
    
    this._oChainRender.stop();
    var aNewColumnDefs = this._oColumnSet.getDefinitions();
    aNewColumnDefs.splice(index, 0, oColumn);
    this._initColumnSet(aNewColumnDefs);
    this._initTheadEl();
    this.render();
    this.fireEvent("columnInsertEvent",{column:oColumn,index:index});
    YAHOO.log("Column \"" + oColumn.key + "\" inserted into index " + index, "info", this.toString());
},

/**
 * Selects given Column. NOTE: You cannot select/unselect nested Columns. You can only
 * select/unselect non-nested Columns, and bottom-level key Columns.
 *
 * @method selectColumn
 * @param column {HTMLElement | String | Number} DOM reference or ID string to a
 * TH/TD element (or child of a TH/TD element), a Column key, or a ColumnSet key index.
 */
selectColumn : function(oColumn) {
    oColumn = this.getColumn(oColumn);
    if(oColumn && !oColumn.selected) {
        // Only bottom-level Columns can get hidden
        if(oColumn.getKeyIndex() !== null) {
            oColumn.selected = true;
            
            // Update head cell
            var elTh = oColumn.getThEl();
            Dom.addClass(elTh,DT.CLASS_SELECTED);

            // Update body cells
            var allRows = this.getTbodyEl().rows;
            var oChainRender = this._oChainRender;
            oChainRender.add({
                method: function(oArg) {
                    if((this instanceof DT) && this._sId && allRows[oArg.rowIndex] && allRows[oArg.rowIndex].cells[oArg.cellIndex]) {
                        Dom.addClass(allRows[oArg.rowIndex].cells[oArg.cellIndex],DT.CLASS_SELECTED);                    
                    }
                    oArg.rowIndex++;
                },
                scope: this,
                iterations: allRows.length,
                argument: {rowIndex:0,cellIndex:oColumn.getKeyIndex()}
            });
            oChainRender.run();       
            
            this.fireEvent("columnSelectEvent",{column:oColumn});
            YAHOO.log("Column \"" + oColumn.key + "\" selected", "info", this.toString());
        }
        else {
            YAHOO.log("Could not select Column \"" + oColumn.key + "\". Only non-nested Columns can be selected", "warn", this.toString());
        }
    }
},

/**
 * Unselects given Column. NOTE: You cannot select/unselect nested Columns. You can only
 * select/unselect non-nested Columns, and bottom-level key Columns.
 *
 * @method unselectColumn
 * @param column {HTMLElement | String | Number} DOM reference or ID string to a
 * TH/TD element (or child of a TH/TD element), a Column key, or a ColumnSet key index.
 */
unselectColumn : function(oColumn) {
    oColumn = this.getColumn(oColumn);
    if(oColumn && oColumn.selected) {
        // Only bottom-level Columns can get hidden
        if(oColumn.getKeyIndex() !== null) {
            oColumn.selected = false;
            
            // Update head cell
            var elTh = oColumn.getThEl();
            Dom.removeClass(elTh,DT.CLASS_SELECTED);

            // Update body cells
            var allRows = this.getTbodyEl().rows;
            var oChainRender = this._oChainRender;
            oChainRender.add({
                method: function(oArg) {
                    if((this instanceof DT) && this._sId && allRows[oArg.rowIndex] && allRows[oArg.rowIndex].cells[oArg.cellIndex]) {
                        Dom.removeClass(allRows[oArg.rowIndex].cells[oArg.cellIndex],DT.CLASS_SELECTED); 
                    }                   
                    oArg.rowIndex++;
                },
                scope: this,
                iterations:allRows.length,
                argument: {rowIndex:0,cellIndex:oColumn.getKeyIndex()}
            });
            oChainRender.run();       
            
            this.fireEvent("columnUnselectEvent",{column:oColumn});
            YAHOO.log("Column \"" + oColumn.key + "\" unselected", "info", this.toString());
        }
        else {
            YAHOO.log("Could not unselect Column \"" + oColumn.key + "\". Only non-nested Columns can be unselected", "warn", this.toString());
        }
    }
},

/**
 * Returns an array selected Column instances.
 *
 * @method getSelectedColumns
 * @return {YAHOO.widget.Column[]} Array of Column instances.
 */
getSelectedColumns : function(oColumn) {
    var selectedColumns = [];
    var aKeys = this._oColumnSet.keys;
    for(var i=0,len=aKeys.length; i<len; i++) {
        if(aKeys[i].selected) {
            selectedColumns[selectedColumns.length] = aKeys[i];
        }
    }
    return selectedColumns;
},

/**
 * Assigns the class YAHOO.widget.DataTable.CLASS_HIGHLIGHTED to cells of the given Column.
 * NOTE: You cannot highlight/unhighlight nested Columns. You can only
 * highlight/unhighlight non-nested Columns, and bottom-level key Columns.
 *
 * @method highlightColumn
 * @param column {HTMLElement | String | Number} DOM reference or ID string to a
 * TH/TD element (or child of a TH/TD element), a Column key, or a ColumnSet key index.
 */
highlightColumn : function(column) {
    var oColumn = this.getColumn(column);
    // Only bottom-level Columns can get highlighted
    if(oColumn && (oColumn.getKeyIndex() !== null)) {
        /*// Make sure previous row is unhighlighted
        var sId = oColumn.getId();
        var sLastId = this._sLastHighlightedColumnId;
        if(sLastId && (sLastId !== sId)) {
            this.unhighlightColumn(this.getColumn(sLastId));
        }*/

        //this._sLastHighlightedColumnId = sId;
            
        // Update head cell
        var elTh = oColumn.getThEl();
        Dom.addClass(elTh,DT.CLASS_HIGHLIGHTED);

        // Update body cells
        var allRows = this.getTbodyEl().rows;
        var oChainRender = this._oChainRender;
        oChainRender.add({
            method: function(oArg) {
                if((this instanceof DT) && this._sId && allRows[oArg.rowIndex] && allRows[oArg.rowIndex].cells[oArg.cellIndex]) {
                    Dom.addClass(allRows[oArg.rowIndex].cells[oArg.cellIndex],DT.CLASS_HIGHLIGHTED);   
                }                 
                oArg.rowIndex++;
            },
            scope: this,
            iterations:allRows.length,
            argument: {rowIndex:0,cellIndex:oColumn.getKeyIndex()}
        });
        oChainRender.run();       
            
        this.fireEvent("columnHighlightEvent",{column:oColumn});
        YAHOO.log("Column \"" + oColumn.key + "\" highlighed", "info", this.toString());
    }
    else {
        YAHOO.log("Could not highlight Column \"" + oColumn.key + "\". Only non-nested Columns can be highlighted", "warn", this.toString());
    }
},

/**
 * Removes the class YAHOO.widget.DataTable.CLASS_HIGHLIGHTED to cells of the given Column.
 * NOTE: You cannot highlight/unhighlight nested Columns. You can only
 * highlight/unhighlight non-nested Columns, and bottom-level key Columns.
 *
 * @method unhighlightColumn
 * @param column {HTMLElement | String | Number} DOM reference or ID string to a
 * TH/TD element (or child of a TH/TD element), a Column key, or a ColumnSet key index.
 */
unhighlightColumn : function(column) {
    var oColumn = this.getColumn(column);
    // Only bottom-level Columns can get highlighted
    if(oColumn && (oColumn.getKeyIndex() !== null)) {
        // Update head cell
        var elTh = oColumn.getThEl();
        Dom.removeClass(elTh,DT.CLASS_HIGHLIGHTED);

        // Update body cells
        var allRows = this.getTbodyEl().rows;
        var oChainRender = this._oChainRender;
        oChainRender.add({
            method: function(oArg) {
                if((this instanceof DT) && this._sId && allRows[oArg.rowIndex] && allRows[oArg.rowIndex].cells[oArg.cellIndex]) {
                    Dom.removeClass(allRows[oArg.rowIndex].cells[oArg.cellIndex],DT.CLASS_HIGHLIGHTED);
                }                 
                oArg.rowIndex++;
            },
            scope: this,
            iterations:allRows.length,
            argument: {rowIndex:0,cellIndex:oColumn.getKeyIndex()}
        });
        oChainRender.run();       
            
        this.fireEvent("columnUnhighlightEvent",{column:oColumn});
        YAHOO.log("Column \"" + oColumn.key + "\" unhighlighted", "info", this.toString());
    }
    else {
        YAHOO.log("Could not unhighlight Column \"" + oColumn.key + "\". Only non-nested Columns can be unhighlighted", "warn", this.toString());
    }
},












































// ROW FUNCTIONS

/**
 * Adds one new Record of data into the RecordSet at the index if given,
 * otherwise at the end. If the new Record is in page view, the
 * corresponding DOM elements are also updated.
 *
 * @method addRow
 * @param oData {Object} Object literal of data for the row.
 * @param index {Number} (optional) RecordSet position index at which to add data.
 */
addRow : function(oData, index) {
    if(oData && (oData.constructor == Object)) {
        var oRecord = this._oRecordSet.addRecord(oData, index);
        if(oRecord) {
            var recIndex;
            var oPaginator = this.get('paginator');

            // Paginated
            if (oPaginator instanceof Pag || this.get('paginated')) {
                recIndex = this.getRecordIndex(oRecord);
                var endRecIndex;
                if (oPaginator instanceof Pag) {
                    // Update the paginator's totalRecords
                    var totalRecords = oPaginator.get('totalRecords');
                    if (totalRecords !== Pag.VALUE_UNLIMITED) {
                        oPaginator.set('totalRecords',totalRecords + 1);
                    }

                    endRecIndex = (oPaginator.getPageRecords())[1];
                }
                // Backward compatibility
                else {
                    endRecIndex = oPaginator.startRecordIndex +
                                  oPaginator.rowsPerPage - 1;
                    this.updatePaginator();
                }

                // New record affects the view
                if (recIndex <= endRecIndex) {
                    // Defer UI updates to the render method
                    this.render();
                }
                
                this.fireEvent("rowAddEvent", {record:oRecord});
                YAHOO.log("Added a row for Record " + YAHOO.lang.dump(oRecord) + " at RecordSet index " + recIndex, "info", this.toString()); 
                return;
            }
            // Not paginated
            else {
                recIndex = this.getTrIndex(oRecord);
                if(lang.isNumber(recIndex)) {
                    // Add the TR element
                    this._oChainRender.add({
                        method: function(oArg) {
                            if((this instanceof DT) && this._sId) {
                                var oRecord = oArg.record;
                                var recIndex = oArg.recIndex;
                                var elNewTr = this._addTrEl(oRecord, recIndex);
                                if(elNewTr) {
                                    var elNext = (this._elTbody.rows[recIndex]) ? this._elTbody.rows[recIndex] : null;
                                    this._elTbody.insertBefore(elNewTr, elNext);
                                    this.hideTableMessage();
            
                                    this.fireEvent("rowAddEvent", {record:oRecord});
                                    YAHOO.log("Added a row for Record " + YAHOO.lang.dump(oRecord) + " at RecordSet index " + recIndex, "info", this.toString());
                                }
                            }
                        },
                        argument: {record: oRecord, recIndex: recIndex},
                        scope: this,
                        timeout: (this.get("renderLoopSize") > 0) ? 0 : -1
                    });
                    this._oChainRender.run();
                    return;
                }
            }            
        }
    }
    YAHOO.log("Could not add row with " + lang.dump(oData), "error", this.toString());
},

/**
 * Convenience method to add multiple rows.
 *
 * @method addRows
 * @param aData {Object[]} Array of object literal data for the rows.
 * @param index {Number} (optional) RecordSet position index at which to add data.
 */
addRows : function(aData, index) {
    if(lang.isArray(aData)) {
        var aRecords = this._oRecordSet.addRecords(aData, index);
        if(aRecords) {
            var recIndex = this.getRecordIndex(aRecords[0]);
            
            // Paginated
            var oPaginator = this.get('paginator');
            if (oPaginator instanceof Pag ||
                this.get('paginated')) {
                var endRecIndex;
                if (oPaginator instanceof Pag) {
                    // Update the paginator's totalRecords
                    var totalRecords = oPaginator.get('totalRecords');
                    if (totalRecords !== Pag.VALUE_UNLIMITED) {
                        oPaginator.set('totalRecords',totalRecords + aRecords.length);
                    }

                    endRecIndex = (oPaginator.getPageRecords())[1];
                }
                // Backward compatibility
                else {
                    endRecIndex = oPaginator.startRecordIndex +
                                  oPaginator.rowsPerPage - 1;
                    this.updatePaginator();
                }

                // At least one of the new records affects the view
                if (recIndex <= endRecIndex) {
                    this.render();
                }
                
                this.fireEvent("rowsAddEvent", {records:aRecords});
                YAHOO.log("Added " + aRecords.length + 
                        " rows at index " + recIndex +
                        " with data " + lang.dump(aData), "info", this.toString());
                return;
            }
            // Not paginated
            else {
                // Add the TR elements
                var loopN = this.get("renderLoopSize");
                var loopEnd = recIndex + aData.length;
                var nRowsNeeded = (loopEnd - recIndex); // how many needed
                this._oChainRender.add({
                    method: function(oArg) {
                        if((this instanceof DT) && this._sId) {
                            var i = oArg.nCurrentRow,
                                j = oArg.nCurrentRecord,
                                len = loopN > 0 ? Math.min(i + loopN,loopEnd) : loopEnd;
                            for(; i < len; ++i,++j) {
                                this._addTrEl(aRecords[j], i);
                            }
                            oArg.nCurrentRow = i;
                            oArg.nCurrentRecord = j;
                        }
                    },
                    iterations: (loopN > 0) ? Math.ceil(loopEnd/loopN) : 1,
                    argument: {nCurrentRow:recIndex,nCurrentRecord:0},
                    scope: this,
                    timeout: (loopN > 0) ? 0 : -1
                });
                this._oChainRender.add({
                    method: function() {
                        this.fireEvent("rowsAddEvent", {records:aRecords});
                        YAHOO.log("Added " + aRecords.length + 
                                " rows at index " + recIndex +
                                " with data " + lang.dump(aData), "info", this.toString());
                    },
                    scope: this,
                    timeout: -1 // Needs to run immediately after the DOM insertions above
                });
                this._oChainRender.run();
                this.hideTableMessage();                
                return;
            }            
        }
    }
    YAHOO.log("Could not add rows with " + lang.dump(aData));    
},

/**
 * For the given row, updates the associated Record with the given data. If the
 * row is on current page, the corresponding DOM elements are also updated.
 *
 * @method updateRow
 * @param row {YAHOO.widget.Record | Number | HTMLElement | String}
 * Which row to update: By Record instance, by Record's RecordSet
 * position index, by HTMLElement reference to the TR element, or by ID string
 * of the TR element.
 * @param oData {Object} Object literal of data for the row.
 */
updateRow : function(row, oData) {
    var oldRecord, oldData, updatedRecord, elRow;

    // Get the Record directly
    if((row instanceof YAHOO.widget.Record) || (lang.isNumber(row))) {
        // Get the Record directly
        oldRecord = this._oRecordSet.getRecord(row);

        // Is this row on current page?
        elRow = this.getTrEl(oldRecord);
    }
    // Get the Record by TR element
    else {
        elRow = this.getTrEl(row);
        if(elRow) {
            oldRecord = this.getRecord(elRow);
        }
    }

    // Update the Record
    if(oldRecord) {
        // Copy data from the Record for the event that gets fired later
        var oRecordData = oldRecord.getData();
        oldData = YAHOO.widget.DataTable._cloneObject(oRecordData);

        updatedRecord = this._oRecordSet.updateRecord(oldRecord, oData);
    }
    else {
        YAHOO.log("Could not update row " + row + " with the data : " +
                lang.dump(oData), "error", this.toString());
        return;

    }

    // Update the TR only if row is on current page
    if(elRow) {
        this._oChainRender.add({
            method: function() {
                if((this instanceof DT) && this._sId) {
                    this._updateTrEl(elRow, updatedRecord);
                    this.fireEvent("rowUpdateEvent", {record:updatedRecord, oldData:oldData});
                    YAHOO.log("DataTable row updated: Record ID = " + updatedRecord.getId() +
                            ", Record index = " + this.getRecordIndex(updatedRecord) +
                            ", page row index = " + this.getTrIndex(updatedRecord), "info", this.toString());
                }
            },
            scope: this,
            timeout: (this.get("renderLoopSize") > 0) ? 0 : -1
        });
        this._oChainRender.run();
    }
    else {
        this.fireEvent("rowUpdateEvent", {record:updatedRecord, oldData:oldData});
        YAHOO.log("DataTable row updated: Record ID = " + updatedRecord.getId() +
                ", Record index = " + this.getRecordIndex(updatedRecord) +
                ", page row index = " + this.getTrIndex(updatedRecord), "info", this.toString());   
    }
},

/**
 * Deletes the given row's Record from the RecordSet. If the row is on current page,
 * the corresponding DOM elements are also deleted.
 *
 * @method deleteRow
 * @param row {HTMLElement | String | Number} DOM element reference or ID string
 * to DataTable page element or RecordSet index.
 */
deleteRow : function(row) {
    var nRecordIndex = this.getRecordIndex(row);
    if(lang.isNumber(nRecordIndex)) {
        var oRecord = this.getRecord(nRecordIndex);
        if(oRecord) {
            var nTrIndex = this.getTrIndex(nRecordIndex);
            
            // Remove from selection tracker if there
            var sRecordId = oRecord.getId();
            var tracker = this._aSelections || [];
            for(var j=tracker.length-1; j>-1; j--) {
                if((lang.isNumber(tracker[j]) && (tracker[j] === sRecordId)) ||
                        ((tracker[j].constructor == Object) && (tracker[j].recordId === sRecordId))) {
                    tracker.splice(j,1);
                }
            }
    
            // Delete Record from RecordSet
            var oData = this._oRecordSet.deleteRecord(nRecordIndex);
    
            // Update the UI
            if(oData) {
                // If paginated and the deleted row was on this or a prior page, just
                // re-render
                var oPaginator = this.get('paginator');
                if (oPaginator instanceof Pag ||
                    this.get('paginated')) {
        
                    var endRecIndex;
                    if (oPaginator instanceof Pag) {
                        // Update the paginator's totalRecords
                        var totalRecords = oPaginator.get('totalRecords');
                        if (totalRecords !== Pag.VALUE_UNLIMITED) {
                            oPaginator.set('totalRecords',totalRecords - 1);
                        }
        
                        endRecIndex = (oPaginator.getPageRecords())[1];
                    } else {
                        // Backward compatibility
                        endRecIndex = oPaginator.startRecordIndex +
                                      oPaginator.rowsPerPage - 1;
        
                        this.updatePaginator();
                    }
        
                    // If the deleted record was on this or a prior page, re-render
                    if (nRecordIndex <= endRecIndex) {
                        this.render();
                    }
                    return;
                }
                else {
                    if(lang.isNumber(nTrIndex)) {
                        this._oChainRender.add({
                            method: function() {
                                if((this instanceof DT) && this._sId) {
                                    var isLast = (nTrIndex == this.getLastTrEl().sectionRowIndex);
                                    this._deleteTrEl(nTrIndex);
                    
                                    // Empty body
                                    if(this._elTbody.rows.length === 0) {
                                        this.showTableMessage(DT.MSG_EMPTY, DT.CLASS_EMPTY);
                                    }
                                    // Update UI
                                    else {
                                        // Set FIRST/LAST
                                        if(nTrIndex === 0) {
                                            this._setFirstRow();
                                        }
                                        if(isLast) {
                                            this._setLastRow();
                                        }
                                        // Set EVEN/ODD
                                        if(nTrIndex != this._elTbody.rows.length) {
                                            this._setRowStripes(nTrIndex);
                                        }                                
                                    }
                    
                                    this.fireEvent("rowDeleteEvent", {recordIndex:nRecordIndex,
                                    oldData:oData, trElIndex:nTrIndex});
                                    YAHOO.log("Deleted row with data " + YAHOO.lang.dump(oData) +
                                    " at RecordSet index " + nRecordIndex + " and page row index " + nTrIndex, "info", this.toString());     
                                }
                            },
                            scope: this,
                            timeout: (this.get("renderLoopSize") > 0) ? 0 : -1
                        });
                        this._oChainRender.run();
                        return;
                    }
                }
            }
        }
    }
    YAHOO.log("Could not delete row: " + row, "warn", this.toString());
    return null;
},

/**
 * Convenience method to delete multiple rows.
 *
 * @method deleteRows
 * @param row {HTMLElement | String | Number} DOM element reference or ID string
 * to DataTable page element or RecordSet index.
 * @param count {Number} (optional) How many rows to delete. A negative value
 * will delete towards the beginning.
 */
deleteRows : function(row, count) {
    var nRecordIndex = this.getRecordIndex(row);
    if(lang.isNumber(nRecordIndex)) {
        var oRecord = this.getRecord(nRecordIndex);
        if(oRecord) {
            var nTrIndex = this.getTrIndex(nRecordIndex);
            
            // Remove from selection tracker if there
            var sRecordId = oRecord.getId();
            var tracker = this._aSelections || [];
            for(var j=tracker.length-1; j>-1; j--) {
                if((lang.isNumber(tracker[j]) && (tracker[j] === sRecordId)) ||
                        ((tracker[j].constructor == Object) && (tracker[j].recordId === sRecordId))) {
                    tracker.splice(j,1);
                }
            }
    
            // Delete Record from RecordSet
            var highIndex = nRecordIndex+1;
            var lowIndex = nRecordIndex;
        
            // Validate count and account for negative value
            if(count && lang.isNumber(count)) {
                highIndex = (count > 0) ? nRecordIndex + count -1 : nRecordIndex;
                lowIndex = (count > 0) ? nRecordIndex : nRecordIndex + count + 1;
                count = (count > 0) ? count : count*-1;
            }
            else {
                count = 1;
            }
            
            var aData = this._oRecordSet.deleteRecords(lowIndex, count);
    
            // Update the UI
            if(aData) {
                // If paginated and the deleted row was on this or a prior page, just
                // re-render
                var oPaginator = this.get('paginator');
                if (oPaginator instanceof Pag ||
                    this.get('paginated')) {
        
                    var endRecIndex;
                    if (oPaginator instanceof Pag) {
                        // Update the paginator's totalRecords
                        var totalRecords = oPaginator.get('totalRecords');
                        if (totalRecords !== Pag.VALUE_UNLIMITED) {
                            oPaginator.set('totalRecords',totalRecords - 1);
                        }
        
                        endRecIndex = (oPaginator.getPageRecords())[1];
                    } else {
                        // Backward compatibility
                        endRecIndex = oPaginator.startRecordIndex +
                                      oPaginator.rowsPerPage - 1;
        
                        this.updatePaginator();
                    }
        
                    // If the lowest deleted record was on this or a prior page, re-render
                    if (lowIndex <= endRecIndex) {
                        this.render();
                    }
                    return;
                }
                else {
                    if(lang.isNumber(nTrIndex)) {
                        // Delete the TR elements starting with highest index
                        var loopN = this.get("renderLoopSize");
                        var loopEnd = lowIndex;
                        var nRowsNeeded = count; // how many needed
                        this._oChainRender.add({
                            method: function(oArg) {
                                if((this instanceof DT) && this._sId) {
                                    var i = oArg.nCurrentRow,
                                        len = (loopN > 0) ? (Math.max(i - loopN,loopEnd)-1) : loopEnd-1;
                                    for(; i>len; --i) {
                                        this._deleteTrEl(i);
                                    }
                                    oArg.nCurrentRow = i;
                                }
                            },
                            iterations: (loopN > 0) ? Math.ceil(count/loopN) : 1,
                            argument: {nCurrentRow:highIndex},
                            scope: this,
                            timeout: (loopN > 0) ? 0 : -1
                        });
                        this._oChainRender.add({
                            method: function() {    
                                // Empty body
                                if(this._elTbody.rows.length === 0) {
                                    this.showTableMessage(DT.MSG_EMPTY, DT.CLASS_EMPTY);
                                }
                                else {
                                    this._setFirstRow();
                                    this._setLastRow();
                                    this._setRowStripes();
                                }
                                
                                this.fireEvent("rowsDeleteEvent", {recordIndex:count,
                                oldData:aData, count:nTrIndex});
                                YAHOO.log("DataTable row deleted: Record ID = " + sRecordId +
                                    ", Record index = " + nRecordIndex +
                                    ", page row index = " + nTrIndex, "info", this.toString());
                            },
                            scope: this,
                            timeout: -1 // Needs to run immediately after the DOM deletions above
                        });
                        this._oChainRender.run();
                        return;
                    }
                }
            }
        }
    }
    YAHOO.log("Could not delete " + count + " rows at row " + row, "warn", this.toString());
    return null;
},














































// CELL FUNCTIONS

/**
 * Outputs markup into the given TD based on given Record.
 *
 * @method formatCell
 * @param elCell {HTMLElement} The liner DIV element within the TD.
 * @param oRecord {YAHOO.widget.Record} (Optional) Record instance.
 * @param oColumn {YAHOO.widget.Column} (Optional) Column instance.
 */
formatCell : function(elCell, oRecord, oColumn) {
    if(!(oRecord instanceof YAHOO.widget.Record)) {
        oRecord = this.getRecord(elCell);
    }
    if(!(oColumn instanceof YAHOO.widget.Column)) {
        oColumn = this.getColumn(elCell.cellIndex);
        ///oColumn = this._oColumnSet.getColumn(elCell.parentNode.yuiColumnKey);
    }

    if(oRecord && oColumn) {
        var sKey = oColumn.key;
        var oData = oRecord.getData(sKey);

        var fnFormatter = typeof oColumn.formatter === 'function' ?
                          oColumn.formatter :
                          DT.Formatter[oColumn.formatter+''];

        // Apply special formatter
        if(fnFormatter) {
            fnFormatter.call(this, elCell, oRecord, oColumn, oData);
        }
        else {
            elCell.innerHTML = oData === undefined ||
                               oData === null ||
                               (typeof oData === 'number' && isNaN(oData)) ?
                                "" : oData.toString();
        }

        this.fireEvent("cellFormatEvent", {record:oRecord, column:oColumn, key:sKey, el:elCell});
    }
    else {
        YAHOO.log("Could not format cell " + elCell, "error", this.toString());
    }
},


















































// PAGINATION

/**
 * Delegates the Paginator changeRequest events to the configured
 * handler.
 * @method onPaginatorChange
 * @param {Object} an object literal describing the proposed pagination state
 */
onPaginatorChange : function (oState) {
    var handler = this.get('paginationEventHandler');

    handler(oState,this);
},


















































// SELECTION/HIGHLIGHTING

/*
 * ID string of last highlighted cell element
 *
 * @property _sLastHighlightedTdElId
 * @type String
 * @private
 */
//_sLastHighlightedTdElId : null,

/*
 * ID string of last highlighted row element
 *
 * @property _sLastHighlightedTrElId
 * @type String
 * @private
 */
//_sLastHighlightedTrElId : null,

/**
 * Array to track row selections (by sRecordId) and/or cell selections
 * (by {recordId:sRecordId, columnId:sColumnId})
 *
 * @property _aSelections
 * @type Object[]
 * @private
 */
_aSelections : null,

/**
 * Record instance of the row selection anchor.
 *
 * @property _oAnchorRecord
 * @type YAHOO.widget.Record
 * @private
 */
_oAnchorRecord : null,

/**
 * Object literal representing cell selection anchor:
 * {recordId:sRecordId, columnId:sColumnId}.
 *
 * @property _oAnchorCell
 * @type Object
 * @private
 */
_oAnchorCell : null,

/**
 * Convenience method to remove the class YAHOO.widget.DataTable.CLASS_SELECTED
 * from all TR elements on the page.
 *
 * @method _unselectAllTrEls
 * @private
 */
_unselectAllTrEls : function() {
    var selectedRows = Dom.getElementsByClassName(DT.CLASS_SELECTED,"tr",this._elTbody);
    Dom.removeClass(selectedRows, DT.CLASS_SELECTED);
},

/**
 * Returns object literal of values that represent the selection trigger. Used
 * to determine selection behavior resulting from a key event.
 *
 * @method _getSelectionTrigger
 * @private
 */
_getSelectionTrigger : function() {
    var sMode = this.get("selectionMode");
    var oTrigger = {};
    var oTriggerCell, oTriggerRecord, nTriggerRecordIndex, elTriggerRow, nTriggerTrIndex;

    // Cell mode
    if((sMode == "cellblock") || (sMode == "cellrange") || (sMode == "singlecell")) {
        oTriggerCell = this.getLastSelectedCell();
        // No selected cells found
        if(!oTriggerCell) {
            return null;
        }
        else {
            oTriggerRecord = this.getRecord(oTriggerCell.recordId);
            nTriggerRecordIndex = this.getRecordIndex(oTriggerRecord);
            elTriggerRow = this.getTrEl(oTriggerRecord);
            nTriggerTrIndex = this.getTrIndex(elTriggerRow);

            // Selected cell not found on this page
            if(nTriggerTrIndex === null) {
                return null;
            }
            else {
                oTrigger.record = oTriggerRecord;
                oTrigger.recordIndex = nTriggerRecordIndex;
                oTrigger.el = this.getTdEl(oTriggerCell);
                oTrigger.trIndex = nTriggerTrIndex;
                oTrigger.column = this.getColumnById(oTriggerCell.columnId);
                oTrigger.colKeyIndex = oTrigger.column.getKeyIndex();
                oTrigger.cell = oTriggerCell;
                return oTrigger;
            }
        }
    }
    // Row mode
    else {
        oTriggerRecord = this.getLastSelectedRecord();
        // No selected rows found
        if(!oTriggerRecord) {
                return null;
        }
        else {
            // Selected row found, but is it on current page?
            oTriggerRecord = this.getRecord(oTriggerRecord);
            nTriggerRecordIndex = this.getRecordIndex(oTriggerRecord);
            elTriggerRow = this.getTrEl(oTriggerRecord);
            nTriggerTrIndex = this.getTrIndex(elTriggerRow);

            // Selected row not found on this page
            if(nTriggerTrIndex === null) {
                return null;
            }
            else {
                oTrigger.record = oTriggerRecord;
                oTrigger.recordIndex = nTriggerRecordIndex;
                oTrigger.el = elTriggerRow;
                oTrigger.trIndex = nTriggerTrIndex;
                return oTrigger;
            }
        }
    }
},

/**
 * Returns object literal of values that represent the selection anchor. Used
 * to determine selection behavior resulting from a user event.
 *
 * @method _getSelectionAnchor
 * @param oTrigger {Object} (Optional) Object literal of selection trigger values
 * (for key events).
 * @private
 */
_getSelectionAnchor : function(oTrigger) {
    var sMode = this.get("selectionMode");
    var oAnchor = {};
    var oAnchorRecord, nAnchorRecordIndex, nAnchorTrIndex;

    // Cell mode
    if((sMode == "cellblock") || (sMode == "cellrange") || (sMode == "singlecell")) {
        // Validate anchor cell
        var oAnchorCell = this._oAnchorCell;
        if(!oAnchorCell) {
            if(oTrigger) {
                oAnchorCell = this._oAnchorCell = oTrigger.cell;
            }
            else {
                return null;
            }
        }
        oAnchorRecord = this._oAnchorCell.record;
        nAnchorRecordIndex = this._oRecordSet.getRecordIndex(oAnchorRecord);
        nAnchorTrIndex = this.getTrIndex(oAnchorRecord);
        // If anchor cell is not on this page...
        if(nAnchorTrIndex === null) {
            // ...set TR index equal to top TR
            if(nAnchorRecordIndex < this.getRecordIndex(this.getFirstTrEl())) {
                nAnchorTrIndex = 0;
            }
            // ...set TR index equal to bottom TR
            else {
                nAnchorTrIndex = this.getRecordIndex(this.getLastTrEl());
            }
        }

        oAnchor.record = oAnchorRecord;
        oAnchor.recordIndex = nAnchorRecordIndex;
        oAnchor.trIndex = nAnchorTrIndex;
        oAnchor.column = this._oAnchorCell.column;
        oAnchor.colKeyIndex = oAnchor.column.getKeyIndex();
        oAnchor.cell = oAnchorCell;
        return oAnchor;
    }
    // Row mode
    else {
        oAnchorRecord = this._oAnchorRecord;
        if(!oAnchorRecord) {
            if(oTrigger) {
                oAnchorRecord = this._oAnchorRecord = oTrigger.record;
            }
            else {
                return null;
            }
        }

        nAnchorRecordIndex = this.getRecordIndex(oAnchorRecord);
        nAnchorTrIndex = this.getTrIndex(oAnchorRecord);
        // If anchor row is not on this page...
        if(nAnchorTrIndex === null) {
            // ...set TR index equal to top TR
            if(nAnchorRecordIndex < this.getRecordIndex(this.getFirstTrEl())) {
                nAnchorTrIndex = 0;
            }
            // ...set TR index equal to bottom TR
            else {
                nAnchorTrIndex = this.getRecordIndex(this.getLastTrEl());
            }
        }

        oAnchor.record = oAnchorRecord;
        oAnchor.recordIndex = nAnchorRecordIndex;
        oAnchor.trIndex = nAnchorTrIndex;
        return oAnchor;
    }
},

/**
 * Determines selection behavior resulting from a mouse event when selection mode
 * is set to "standard".
 *
 * @method _handleStandardSelectionByMouse
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 * @private
 */
_handleStandardSelectionByMouse : function(oArgs) {
    var elTarget = oArgs.target;

    // Validate target row
    var elTargetRow = this.getTrEl(elTarget);
    if(elTargetRow) {
        var e = oArgs.event;
        var bSHIFT = e.shiftKey;
        var bCTRL = e.ctrlKey || ((navigator.userAgent.toLowerCase().indexOf("mac") != -1) && e.metaKey);

        var oTargetRecord = this.getRecord(elTargetRow);
        var nTargetRecordIndex = this._oRecordSet.getRecordIndex(oTargetRecord);

        var oAnchor = this._getSelectionAnchor();

        var i;

        // Both SHIFT and CTRL
        if(bSHIFT && bCTRL) {
            // Validate anchor
            if(oAnchor) {
                if(this.isSelected(oAnchor.record)) {
                    // Select all rows between anchor row and target row, including target row
                    if(oAnchor.recordIndex < nTargetRecordIndex) {
                        for(i=oAnchor.recordIndex+1; i<=nTargetRecordIndex; i++) {
                            if(!this.isSelected(i)) {
                                this.selectRow(i);
                            }
                        }
                    }
                    // Select all rows between target row and anchor row, including target row
                    else {
                        for(i=oAnchor.recordIndex-1; i>=nTargetRecordIndex; i--) {
                            if(!this.isSelected(i)) {
                                this.selectRow(i);
                            }
                        }
                    }
                }
                else {
                    // Unselect all rows between anchor row and target row
                    if(oAnchor.recordIndex < nTargetRecordIndex) {
                        for(i=oAnchor.recordIndex+1; i<=nTargetRecordIndex-1; i++) {
                            if(this.isSelected(i)) {
                                this.unselectRow(i);
                            }
                        }
                    }
                    // Unselect all rows between target row and anchor row
                    else {
                        for(i=nTargetRecordIndex+1; i<=oAnchor.recordIndex-1; i++) {
                            if(this.isSelected(i)) {
                                this.unselectRow(i);
                            }
                        }
                    }
                    // Select the target row
                    this.selectRow(oTargetRecord);
                }
            }
            // Invalid anchor
            else {
                // Set anchor
                this._oAnchorRecord = oTargetRecord;

                // Toggle selection of target
                if(this.isSelected(oTargetRecord)) {
                    this.unselectRow(oTargetRecord);
                }
                else {
                    this.selectRow(oTargetRecord);
                }
            }
        }
         // Only SHIFT
        else if(bSHIFT) {
            this.unselectAllRows();

            // Validate anchor
            if(oAnchor) {
                // Select all rows between anchor row and target row,
                // including the anchor row and target row
                if(oAnchor.recordIndex < nTargetRecordIndex) {
                    for(i=oAnchor.recordIndex; i<=nTargetRecordIndex; i++) {
                        this.selectRow(i);
                    }
                }
                // Select all rows between target row and anchor row,
                // including the target row and anchor row
                else {
                    for(i=oAnchor.recordIndex; i>=nTargetRecordIndex; i--) {
                        this.selectRow(i);
                    }
                }
            }
            // Invalid anchor
            else {
                // Set anchor
                this._oAnchorRecord = oTargetRecord;

                // Select target row only
                this.selectRow(oTargetRecord);
            }
        }
        // Only CTRL
        else if(bCTRL) {
            // Set anchor
            this._oAnchorRecord = oTargetRecord;

            // Toggle selection of target
            if(this.isSelected(oTargetRecord)) {
                this.unselectRow(oTargetRecord);
            }
            else {
                this.selectRow(oTargetRecord);
            }
        }
        // Neither SHIFT nor CTRL
        else {
            this._handleSingleSelectionByMouse(oArgs);
            return;
        }
    }
},

/**
 * Determines selection behavior resulting from a key event when selection mode
 * is set to "standard".
 *
 * @method _handleStandardSelectionByKey
 * @param e {HTMLEvent} Event object.
 * @private
 */
_handleStandardSelectionByKey : function(e) {
    var nKey = Ev.getCharCode(e);

    if((nKey == 38) || (nKey == 40)) {
        var bSHIFT = e.shiftKey;

        // Validate trigger
        var oTrigger = this._getSelectionTrigger();
        // Arrow selection only works if last selected row is on current page
        if(!oTrigger) {
            return null;
        }

        Ev.stopEvent(e);

        // Validate anchor
        var oAnchor = this._getSelectionAnchor(oTrigger);

        // Determine which direction we're going to
        if(bSHIFT) {
            // Selecting down away from anchor row
            if((nKey == 40) && (oAnchor.recordIndex <= oTrigger.trIndex)) {
                this.selectRow(this.getNextTrEl(oTrigger.el));
            }
            // Selecting up away from anchor row
            else if((nKey == 38) && (oAnchor.recordIndex >= oTrigger.trIndex)) {
                this.selectRow(this.getPreviousTrEl(oTrigger.el));
            }
            // Unselect trigger
            else {
                this.unselectRow(oTrigger.el);
            }
        }
        else {
            this._handleSingleSelectionByKey(e);
        }
    }
},

/**
 * Determines selection behavior resulting from a mouse event when selection mode
 * is set to "single".
 *
 * @method _handleSingleSelectionByMouse
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 * @private
 */
_handleSingleSelectionByMouse : function(oArgs) {
    var elTarget = oArgs.target;

    // Validate target row
    var elTargetRow = this.getTrEl(elTarget);
    if(elTargetRow) {
        var oTargetRecord = this.getRecord(elTargetRow);

        // Set anchor
        this._oAnchorRecord = oTargetRecord;

        // Select only target
        this.unselectAllRows();
        this.selectRow(oTargetRecord);
    }
},

/**
 * Determines selection behavior resulting from a key event when selection mode
 * is set to "single".
 *
 * @method _handleSingleSelectionByKey
 * @param e {HTMLEvent} Event object.
 * @private
 */
_handleSingleSelectionByKey : function(e) {
    var nKey = Ev.getCharCode(e);

    if((nKey == 38) || (nKey == 40)) {
        // Validate trigger
        var oTrigger = this._getSelectionTrigger();
        // Arrow selection only works if last selected row is on current page
        if(!oTrigger) {
            return null;
        }

        Ev.stopEvent(e);

        // Determine the new row to select
        var elNew;
        if(nKey == 38) { // arrow up
            elNew = this.getPreviousTrEl(oTrigger.el);

            // Validate new row
            if(elNew === null) {
                //TODO: wrap around to last tr on current page
                //elNew = this.getLastTrEl();

                //TODO: wrap back to last tr of previous page

                // Top row selection is sticky
                elNew = this.getFirstTrEl();
            }
        }
        else if(nKey == 40) { // arrow down
            elNew = this.getNextTrEl(oTrigger.el);

            // Validate new row
            if(elNew === null) {
                //TODO: wrap around to first tr on current page
                //elNew = this.getFirstTrEl();

                //TODO: wrap forward to first tr of previous page

                // Bottom row selection is sticky
                elNew = this.getLastTrEl();
            }
        }

        // Unselect all rows
        this.unselectAllRows();

        // Select the new row
        this.selectRow(elNew);

        // Set new anchor
        this._oAnchorRecord = this.getRecord(elNew);
    }
},

/**
 * Determines selection behavior resulting from a mouse event when selection mode
 * is set to "cellblock".
 *
 * @method _handleCellBlockSelectionByMouse
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 * @private
 */
_handleCellBlockSelectionByMouse : function(oArgs) {
    var elTarget = oArgs.target;

    // Validate target cell
    var elTargetCell = this.getTdEl(elTarget);
    if(elTargetCell) {
        var e = oArgs.event;
        var bSHIFT = e.shiftKey;
        var bCTRL = e.ctrlKey || ((navigator.userAgent.toLowerCase().indexOf("mac") != -1) && e.metaKey);

        var elTargetRow = this.getTrEl(elTargetCell);
        var nTargetTrIndex = this.getTrIndex(elTargetRow);
        var oTargetColumn = this.getColumn(elTargetCell);
        var nTargetColKeyIndex = oTargetColumn.getKeyIndex();
        var oTargetRecord = this.getRecord(elTargetRow);
        var nTargetRecordIndex = this._oRecordSet.getRecordIndex(oTargetRecord);
        var oTargetCell = {record:oTargetRecord, column:oTargetColumn};

        var oAnchor = this._getSelectionAnchor();

        var allRows = this.getTbodyEl().rows;
        var startIndex, endIndex, currentRow, i, j;

        // Both SHIFT and CTRL
        if(bSHIFT && bCTRL) {

            // Validate anchor
            if(oAnchor) {
                // Anchor is selected
                if(this.isSelected(oAnchor.cell)) {
                    // All cells are on the same row
                    if(oAnchor.recordIndex === nTargetRecordIndex) {
                        // Select all cells between anchor cell and target cell, including target cell
                        if(oAnchor.colKeyIndex < nTargetColKeyIndex) {
                            for(i=oAnchor.colKeyIndex+1; i<=nTargetColKeyIndex; i++) {
                                this.selectCell(elTargetRow.cells[i]);
                            }
                        }
                        // Select all cells between target cell and anchor cell, including target cell
                        else if(nTargetColKeyIndex < oAnchor.colKeyIndex) {
                            for(i=nTargetColKeyIndex; i<oAnchor.colKeyIndex; i++) {
                                this.selectCell(elTargetRow.cells[i]);
                            }
                        }
                    }
                    // Anchor row is above target row
                    else if(oAnchor.recordIndex < nTargetRecordIndex) {
                        startIndex = Math.min(oAnchor.colKeyIndex, nTargetColKeyIndex);
                        endIndex = Math.max(oAnchor.colKeyIndex, nTargetColKeyIndex);

                        // Select all cells from startIndex to endIndex on rows between anchor row and target row
                        for(i=oAnchor.trIndex; i<=nTargetTrIndex; i++) {
                            for(j=startIndex; j<=endIndex; j++) {
                                this.selectCell(allRows[i].cells[j]);
                            }
                        }
                    }
                    // Anchor row is below target row
                    else {
                        startIndex = Math.min(oAnchor.trIndex, nTargetColKeyIndex);
                        endIndex = Math.max(oAnchor.trIndex, nTargetColKeyIndex);

                        // Select all cells from startIndex to endIndex on rows between target row and anchor row
                        for(i=oAnchor.trIndex; i>=nTargetTrIndex; i--) {
                            for(j=endIndex; j>=startIndex; j--) {
                                this.selectCell(allRows[i].cells[j]);
                            }
                        }
                    }
                }
                // Anchor cell is unselected
                else {
                    // All cells are on the same row
                    if(oAnchor.recordIndex === nTargetRecordIndex) {
                        // Unselect all cells between anchor cell and target cell
                        if(oAnchor.colKeyIndex < nTargetColKeyIndex) {
                            for(i=oAnchor.colKeyIndex+1; i<nTargetColKeyIndex; i++) {
                                this.unselectCell(elTargetRow.cells[i]);
                            }
                        }
                        // Select all cells between target cell and anchor cell
                        else if(nTargetColKeyIndex < oAnchor.colKeyIndex) {
                            for(i=nTargetColKeyIndex+1; i<oAnchor.colKeyIndex; i++) {
                                this.unselectCell(elTargetRow.cells[i]);
                            }
                        }
                    }
                    // Anchor row is above target row
                    if(oAnchor.recordIndex < nTargetRecordIndex) {
                        // Unselect all cells from anchor cell to target cell
                        for(i=oAnchor.trIndex; i<=nTargetTrIndex; i++) {
                            currentRow = allRows[i];
                            for(j=0; j<currentRow.cells.length; j++) {
                                // This is the anchor row, only unselect cells after the anchor cell
                                if(currentRow.sectionRowIndex === oAnchor.trIndex) {
                                    if(j>oAnchor.colKeyIndex) {
                                        this.unselectCell(currentRow.cells[j]);
                                    }
                                }
                                // This is the target row, only unelect cells before the target cell
                                else if(currentRow.sectionRowIndex === nTargetTrIndex) {
                                    if(j<nTargetColKeyIndex) {
                                        this.unselectCell(currentRow.cells[j]);
                                    }
                                }
                                // Unselect all cells on this row
                                else {
                                    this.unselectCell(currentRow.cells[j]);
                                }
                            }
                        }
                    }
                    // Anchor row is below target row
                    else {
                        // Unselect all cells from target cell to anchor cell
                        for(i=nTargetTrIndex; i<=oAnchor.trIndex; i++) {
                            currentRow = allRows[i];
                            for(j=0; j<currentRow.cells.length; j++) {
                                // This is the target row, only unselect cells after the target cell
                                if(currentRow.sectionRowIndex == nTargetTrIndex) {
                                    if(j>nTargetColKeyIndex) {
                                        this.unselectCell(currentRow.cells[j]);
                                    }
                                }
                                // This is the anchor row, only unselect cells before the anchor cell
                                else if(currentRow.sectionRowIndex == oAnchor.trIndex) {
                                    if(j<oAnchor.colKeyIndex) {
                                        this.unselectCell(currentRow.cells[j]);
                                    }
                                }
                                // Unselect all cells on this row
                                else {
                                    this.unselectCell(currentRow.cells[j]);
                                }
                            }
                        }
                    }

                    // Select the target cell
                    this.selectCell(elTargetCell);
                }
            }
            // Invalid anchor
            else {
                // Set anchor
                this._oAnchorCell = oTargetCell;

                // Toggle selection of target
                if(this.isSelected(oTargetCell)) {
                    this.unselectCell(oTargetCell);
                }
                else {
                    this.selectCell(oTargetCell);
                }
            }

        }
         // Only SHIFT
        else if(bSHIFT) {
            this.unselectAllCells();

            // Validate anchor
            if(oAnchor) {
                // All cells are on the same row
                if(oAnchor.recordIndex === nTargetRecordIndex) {
                    // Select all cells between anchor cell and target cell,
                    // including the anchor cell and target cell
                    if(oAnchor.colKeyIndex < nTargetColKeyIndex) {
                        for(i=oAnchor.colKeyIndex; i<=nTargetColKeyIndex; i++) {
                            this.selectCell(elTargetRow.cells[i]);
                        }
                    }
                    // Select all cells between target cell and anchor cell
                    // including the target cell and anchor cell
                    else if(nTargetColKeyIndex < oAnchor.colKeyIndex) {
                        for(i=nTargetColKeyIndex; i<=oAnchor.colKeyIndex; i++) {
                            this.selectCell(elTargetRow.cells[i]);
                        }
                    }
                }
                // Anchor row is above target row
                else if(oAnchor.recordIndex < nTargetRecordIndex) {
                    // Select the cellblock from anchor cell to target cell
                    // including the anchor cell and the target cell
                    startIndex = Math.min(oAnchor.colKeyIndex, nTargetColKeyIndex);
                    endIndex = Math.max(oAnchor.colKeyIndex, nTargetColKeyIndex);

                    for(i=oAnchor.trIndex; i<=nTargetTrIndex; i++) {
                        for(j=startIndex; j<=endIndex; j++) {
                            this.selectCell(allRows[i].cells[j]);
                        }
                    }
                }
                // Anchor row is below target row
                else {
                    // Select the cellblock from target cell to anchor cell
                    // including the target cell and the anchor cell
                    startIndex = Math.min(oAnchor.colKeyIndex, nTargetColKeyIndex);
                    endIndex = Math.max(oAnchor.colKeyIndex, nTargetColKeyIndex);

                    for(i=nTargetTrIndex; i<=oAnchor.trIndex; i++) {
                        for(j=startIndex; j<=endIndex; j++) {
                            this.selectCell(allRows[i].cells[j]);
                        }
                    }
                }
            }
            // Invalid anchor
            else {
                // Set anchor
                this._oAnchorCell = oTargetCell;

                // Select target only
                this.selectCell(oTargetCell);
            }
        }
        // Only CTRL
        else if(bCTRL) {

            // Set anchor
            this._oAnchorCell = oTargetCell;

            // Toggle selection of target
            if(this.isSelected(oTargetCell)) {
                this.unselectCell(oTargetCell);
            }
            else {
                this.selectCell(oTargetCell);
            }

        }
        // Neither SHIFT nor CTRL
        else {
            this._handleSingleCellSelectionByMouse(oArgs);
        }
    }
},

/**
 * Determines selection behavior resulting from a key event when selection mode
 * is set to "cellblock".
 *
 * @method _handleCellBlockSelectionByKey
 * @param e {HTMLEvent} Event object.
 * @private
 */
_handleCellBlockSelectionByKey : function(e) {
    var nKey = Ev.getCharCode(e);
    var bSHIFT = e.shiftKey;
    if((nKey == 9) || !bSHIFT) {
        this._handleSingleCellSelectionByKey(e);
        return;
    }

    if((nKey > 36) && (nKey < 41)) {
        // Validate trigger
        var oTrigger = this._getSelectionTrigger();
        // Arrow selection only works if last selected row is on current page
        if(!oTrigger) {
            return null;
        }

        Ev.stopEvent(e);

        // Validate anchor
        var oAnchor = this._getSelectionAnchor(oTrigger);

        var i, startIndex, endIndex, elNew, elNewRow;
        var allRows = this.getTbodyEl().rows;
        var elThisRow = oTrigger.el.parentNode;

        // Determine which direction we're going to

        if(nKey == 40) { // arrow down
            // Selecting away from anchor cell
            if(oAnchor.recordIndex <= oTrigger.recordIndex) {
                // Select the horiz block on the next row...
                // ...making sure there is room below the trigger row
                elNewRow = this.getNextTrEl(oTrigger.el);
                if(elNewRow) {
                    startIndex = oAnchor.colKeyIndex;
                    endIndex = oTrigger.colKeyIndex;
                    // ...going left
                    if(startIndex > endIndex) {
                        for(i=startIndex; i>=endIndex; i--) {
                            elNew = elNewRow.cells[i];
                            this.selectCell(elNew);
                        }
                    }
                    // ... going right
                    else {
                        for(i=startIndex; i<=endIndex; i++) {
                            elNew = elNewRow.cells[i];
                            this.selectCell(elNew);
                        }
                    }
                }
            }
            // Unselecting towards anchor cell
            else {
                startIndex = Math.min(oAnchor.colKeyIndex, oTrigger.colKeyIndex);
                endIndex = Math.max(oAnchor.colKeyIndex, oTrigger.colKeyIndex);
                // Unselect the horiz block on this row towards the next row
                for(i=startIndex; i<=endIndex; i++) {
                    this.unselectCell(elThisRow.cells[i]);
                }
            }
        }
        // Arrow up
        else if(nKey == 38) {
            // Selecting away from anchor cell
            if(oAnchor.recordIndex >= oTrigger.recordIndex) {
                // Select the horiz block on the previous row...
                // ...making sure there is room
                elNewRow = this.getPreviousTrEl(oTrigger.el);
                if(elNewRow) {
                    // Select in order from anchor to trigger...
                    startIndex = oAnchor.colKeyIndex;
                    endIndex = oTrigger.colKeyIndex;
                    // ...going left
                    if(startIndex > endIndex) {
                        for(i=startIndex; i>=endIndex; i--) {
                            elNew = elNewRow.cells[i];
                            this.selectCell(elNew);
                        }
                    }
                    // ... going right
                    else {
                        for(i=startIndex; i<=endIndex; i++) {
                            elNew = elNewRow.cells[i];
                            this.selectCell(elNew);
                        }
                    }
                }
            }
            // Unselecting towards anchor cell
            else {
                startIndex = Math.min(oAnchor.colKeyIndex, oTrigger.colKeyIndex);
                endIndex = Math.max(oAnchor.colKeyIndex, oTrigger.colKeyIndex);
                // Unselect the horiz block on this row towards the previous row
                for(i=startIndex; i<=endIndex; i++) {
                    this.unselectCell(elThisRow.cells[i]);
                }
            }
        }
        // Arrow right
        else if(nKey == 39) {
            // Selecting away from anchor cell
            if(oAnchor.colKeyIndex <= oTrigger.colKeyIndex) {
                // Select the next vert block to the right...
                // ...making sure there is room
                if(oTrigger.colKeyIndex < elThisRow.cells.length-1) {
                    // Select in order from anchor to trigger...
                    startIndex = oAnchor.trIndex;
                    endIndex = oTrigger.trIndex;
                    // ...going up
                    if(startIndex > endIndex) {
                        for(i=startIndex; i>=endIndex; i--) {
                            elNew = allRows[i].cells[oTrigger.colKeyIndex+1];
                            this.selectCell(elNew);
                        }
                    }
                    // ... going down
                    else {
                        for(i=startIndex; i<=endIndex; i++) {
                            elNew = allRows[i].cells[oTrigger.colKeyIndex+1];
                            this.selectCell(elNew);
                        }
                    }
                }
            }
            // Unselecting towards anchor cell
            else {
                // Unselect the vert block on this column towards the right
                startIndex = Math.min(oAnchor.trIndex, oTrigger.trIndex);
                endIndex = Math.max(oAnchor.trIndex, oTrigger.trIndex);
                for(i=startIndex; i<=endIndex; i++) {
                    this.unselectCell(allRows[i].cells[oTrigger.colKeyIndex]);
                }
            }
        }
        // Arrow left
        else if(nKey == 37) {
            // Selecting away from anchor cell
            if(oAnchor.colKeyIndex >= oTrigger.colKeyIndex) {
                //Select the previous vert block to the left
                if(oTrigger.colKeyIndex > 0) {
                    // Select in order from anchor to trigger...
                    startIndex = oAnchor.trIndex;
                    endIndex = oTrigger.trIndex;
                    // ...going up
                    if(startIndex > endIndex) {
                        for(i=startIndex; i>=endIndex; i--) {
                            elNew = allRows[i].cells[oTrigger.colKeyIndex-1];
                            this.selectCell(elNew);
                        }
                    }
                    // ... going down
                    else {
                        for(i=startIndex; i<=endIndex; i++) {
                            elNew = allRows[i].cells[oTrigger.colKeyIndex-1];
                            this.selectCell(elNew);
                        }
                    }
                }
            }
            // Unselecting towards anchor cell
            else {
                // Unselect the vert block on this column towards the left
                startIndex = Math.min(oAnchor.trIndex, oTrigger.trIndex);
                endIndex = Math.max(oAnchor.trIndex, oTrigger.trIndex);
                for(i=startIndex; i<=endIndex; i++) {
                    this.unselectCell(allRows[i].cells[oTrigger.colKeyIndex]);
                }
            }
        }
    }
},

/**
 * Determines selection behavior resulting from a mouse event when selection mode
 * is set to "cellrange".
 *
 * @method _handleCellRangeSelectionByMouse
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 * @private
 */
_handleCellRangeSelectionByMouse : function(oArgs) {
    var elTarget = oArgs.target;

    // Validate target cell
    var elTargetCell = this.getTdEl(elTarget);
    if(elTargetCell) {
        var e = oArgs.event;
        var bSHIFT = e.shiftKey;
        var bCTRL = e.ctrlKey || ((navigator.userAgent.toLowerCase().indexOf("mac") != -1) && e.metaKey);

        var elTargetRow = this.getTrEl(elTargetCell);
        var nTargetTrIndex = this.getTrIndex(elTargetRow);
        var oTargetColumn = this.getColumn(elTargetCell);
        var nTargetColKeyIndex = oTargetColumn.getKeyIndex();
        var oTargetRecord = this.getRecord(elTargetRow);
        var nTargetRecordIndex = this._oRecordSet.getRecordIndex(oTargetRecord);
        var oTargetCell = {record:oTargetRecord, column:oTargetColumn};

        var oAnchor = this._getSelectionAnchor();

        var allRows = this.getTbodyEl().rows;
        var currentRow, i, j;

        // Both SHIFT and CTRL
        if(bSHIFT && bCTRL) {

            // Validate anchor
            if(oAnchor) {
                // Anchor is selected
                if(this.isSelected(oAnchor.cell)) {
                    // All cells are on the same row
                    if(oAnchor.recordIndex === nTargetRecordIndex) {
                        // Select all cells between anchor cell and target cell, including target cell
                        if(oAnchor.colKeyIndex < nTargetColKeyIndex) {
                            for(i=oAnchor.colKeyIndex+1; i<=nTargetColKeyIndex; i++) {
                                this.selectCell(elTargetRow.cells[i]);
                            }
                        }
                        // Select all cells between target cell and anchor cell, including target cell
                        else if(nTargetColKeyIndex < oAnchor.colKeyIndex) {
                            for(i=nTargetColKeyIndex; i<oAnchor.colKeyIndex; i++) {
                                this.selectCell(elTargetRow.cells[i]);
                            }
                        }
                    }
                    // Anchor row is above target row
                    else if(oAnchor.recordIndex < nTargetRecordIndex) {
                        // Select all cells on anchor row from anchor cell to the end of the row
                        for(i=oAnchor.colKeyIndex+1; i<elTargetRow.cells.length; i++) {
                            this.selectCell(elTargetRow.cells[i]);
                        }

                        // Select all cells on all rows between anchor row and target row
                        for(i=oAnchor.trIndex+1; i<nTargetTrIndex; i++) {
                            for(j=0; j<allRows[i].cells.length; j++){
                                this.selectCell(allRows[i].cells[j]);
                            }
                        }

                        // Select all cells on target row from first cell to the target cell
                        for(i=0; i<=nTargetColKeyIndex; i++) {
                            this.selectCell(elTargetRow.cells[i]);
                        }
                    }
                    // Anchor row is below target row
                    else {
                        // Select all cells on target row from target cell to the end of the row
                        for(i=nTargetColKeyIndex; i<elTargetRow.cells.length; i++) {
                            this.selectCell(elTargetRow.cells[i]);
                        }

                        // Select all cells on all rows between target row and anchor row
                        for(i=nTargetTrIndex+1; i<oAnchor.trIndex; i++) {
                            for(j=0; j<allRows[i].cells.length; j++){
                                this.selectCell(allRows[i].cells[j]);
                            }
                        }

                        // Select all cells on anchor row from first cell to the anchor cell
                        for(i=0; i<oAnchor.colKeyIndex; i++) {
                            this.selectCell(elTargetRow.cells[i]);
                        }
                    }
                }
                // Anchor cell is unselected
                else {
                    // All cells are on the same row
                    if(oAnchor.recordIndex === nTargetRecordIndex) {
                        // Unselect all cells between anchor cell and target cell
                        if(oAnchor.colKeyIndex < nTargetColKeyIndex) {
                            for(i=oAnchor.colKeyIndex+1; i<nTargetColKeyIndex; i++) {
                                this.unselectCell(elTargetRow.cells[i]);
                            }
                        }
                        // Select all cells between target cell and anchor cell
                        else if(nTargetColKeyIndex < oAnchor.colKeyIndex) {
                            for(i=nTargetColKeyIndex+1; i<oAnchor.colKeyIndex; i++) {
                                this.unselectCell(elTargetRow.cells[i]);
                            }
                        }
                    }
                    // Anchor row is above target row
                    if(oAnchor.recordIndex < nTargetRecordIndex) {
                        // Unselect all cells from anchor cell to target cell
                        for(i=oAnchor.trIndex; i<=nTargetTrIndex; i++) {
                            currentRow = allRows[i];
                            for(j=0; j<currentRow.cells.length; j++) {
                                // This is the anchor row, only unselect cells after the anchor cell
                                if(currentRow.sectionRowIndex === oAnchor.trIndex) {
                                    if(j>oAnchor.colKeyIndex) {
                                        this.unselectCell(currentRow.cells[j]);
                                    }
                                }
                                // This is the target row, only unelect cells before the target cell
                                else if(currentRow.sectionRowIndex === nTargetTrIndex) {
                                    if(j<nTargetColKeyIndex) {
                                        this.unselectCell(currentRow.cells[j]);
                                    }
                                }
                                // Unselect all cells on this row
                                else {
                                    this.unselectCell(currentRow.cells[j]);
                                }
                            }
                        }
                    }
                    // Anchor row is below target row
                    else {
                        // Unselect all cells from target cell to anchor cell
                        for(i=nTargetTrIndex; i<=oAnchor.trIndex; i++) {
                            currentRow = allRows[i];
                            for(j=0; j<currentRow.cells.length; j++) {
                                // This is the target row, only unselect cells after the target cell
                                if(currentRow.sectionRowIndex == nTargetTrIndex) {
                                    if(j>nTargetColKeyIndex) {
                                        this.unselectCell(currentRow.cells[j]);
                                    }
                                }
                                // This is the anchor row, only unselect cells before the anchor cell
                                else if(currentRow.sectionRowIndex == oAnchor.trIndex) {
                                    if(j<oAnchor.colKeyIndex) {
                                        this.unselectCell(currentRow.cells[j]);
                                    }
                                }
                                // Unselect all cells on this row
                                else {
                                    this.unselectCell(currentRow.cells[j]);
                                }
                            }
                        }
                    }

                    // Select the target cell
                    this.selectCell(elTargetCell);
                }
            }
            // Invalid anchor
            else {
                // Set anchor
                this._oAnchorCell = oTargetCell;

                // Toggle selection of target
                if(this.isSelected(oTargetCell)) {
                    this.unselectCell(oTargetCell);
                }
                else {
                    this.selectCell(oTargetCell);
                }
            }
        }
         // Only SHIFT
        else if(bSHIFT) {

            this.unselectAllCells();

            // Validate anchor
            if(oAnchor) {
                // All cells are on the same row
                if(oAnchor.recordIndex === nTargetRecordIndex) {
                    // Select all cells between anchor cell and target cell,
                    // including the anchor cell and target cell
                    if(oAnchor.colKeyIndex < nTargetColKeyIndex) {
                        for(i=oAnchor.colKeyIndex; i<=nTargetColKeyIndex; i++) {
                            this.selectCell(elTargetRow.cells[i]);
                        }
                    }
                    // Select all cells between target cell and anchor cell
                    // including the target cell and anchor cell
                    else if(nTargetColKeyIndex < oAnchor.colKeyIndex) {
                        for(i=nTargetColKeyIndex; i<=oAnchor.colKeyIndex; i++) {
                            this.selectCell(elTargetRow.cells[i]);
                        }
                    }
                }
                // Anchor row is above target row
                else if(oAnchor.recordIndex < nTargetRecordIndex) {
                    // Select all cells from anchor cell to target cell
                    // including the anchor cell and target cell
                    for(i=oAnchor.trIndex; i<=nTargetTrIndex; i++) {
                        currentRow = allRows[i];
                        for(j=0; j<currentRow.cells.length; j++) {
                            // This is the anchor row, only select the anchor cell and after
                            if(currentRow.sectionRowIndex == oAnchor.trIndex) {
                                if(j>=oAnchor.colKeyIndex) {
                                    this.selectCell(currentRow.cells[j]);
                                }
                            }
                            // This is the target row, only select the target cell and before
                            else if(currentRow.sectionRowIndex == nTargetTrIndex) {
                                if(j<=nTargetColKeyIndex) {
                                    this.selectCell(currentRow.cells[j]);
                                }
                            }
                            // Select all cells on this row
                            else {
                                this.selectCell(currentRow.cells[j]);
                            }
                        }
                    }
                }
                // Anchor row is below target row
                else {
                    // Select all cells from target cell to anchor cell,
                    // including the target cell and anchor cell
                    for(i=nTargetTrIndex; i<=oAnchor.trIndex; i++) {
                        currentRow = allRows[i];
                        for(j=0; j<currentRow.cells.length; j++) {
                            // This is the target row, only select the target cell and after
                            if(currentRow.sectionRowIndex == nTargetTrIndex) {
                                if(j>=nTargetColKeyIndex) {
                                    this.selectCell(currentRow.cells[j]);
                                }
                            }
                            // This is the anchor row, only select the anchor cell and before
                            else if(currentRow.sectionRowIndex == oAnchor.trIndex) {
                                if(j<=oAnchor.colKeyIndex) {
                                    this.selectCell(currentRow.cells[j]);
                                }
                            }
                            // Select all cells on this row
                            else {
                                this.selectCell(currentRow.cells[j]);
                            }
                        }
                    }
                }
            }
            // Invalid anchor
            else {
                // Set anchor
                this._oAnchorCell = oTargetCell;

                // Select target only
                this.selectCell(oTargetCell);
            }


        }
        // Only CTRL
        else if(bCTRL) {

            // Set anchor
            this._oAnchorCell = oTargetCell;

            // Toggle selection of target
            if(this.isSelected(oTargetCell)) {
                this.unselectCell(oTargetCell);
            }
            else {
                this.selectCell(oTargetCell);
            }

        }
        // Neither SHIFT nor CTRL
        else {
            this._handleSingleCellSelectionByMouse(oArgs);
        }
    }
},

/**
 * Determines selection behavior resulting from a key event when selection mode
 * is set to "cellrange".
 *
 * @method _handleCellRangeSelectionByKey
 * @param e {HTMLEvent} Event object.
 * @private
 */
_handleCellRangeSelectionByKey : function(e) {
    var nKey = Ev.getCharCode(e);
    var bSHIFT = e.shiftKey;
    if((nKey == 9) || !bSHIFT) {
        this._handleSingleCellSelectionByKey(e);
        return;
    }

    if((nKey > 36) && (nKey < 41)) {
        // Validate trigger
        var oTrigger = this._getSelectionTrigger();
        // Arrow selection only works if last selected row is on current page
        if(!oTrigger) {
            return null;
        }

        Ev.stopEvent(e);

        // Validate anchor
        var oAnchor = this._getSelectionAnchor(oTrigger);

        var i, elNewRow, elNew;
        var allRows = this.getTbodyEl().rows;
        var elThisRow = oTrigger.el.parentNode;

        // Arrow down
        if(nKey == 40) {
            elNewRow = this.getNextTrEl(oTrigger.el);

            // Selecting away from anchor cell
            if(oAnchor.recordIndex <= oTrigger.recordIndex) {
                // Select all cells to the end of this row
                for(i=oTrigger.colKeyIndex+1; i<elThisRow.cells.length; i++){
                    elNew = elThisRow.cells[i];
                    this.selectCell(elNew);
                }

                // Select some of the cells on the next row down
                if(elNewRow) {
                    for(i=0; i<=oTrigger.colKeyIndex; i++){
                        elNew = elNewRow.cells[i];
                        this.selectCell(elNew);
                    }
                }
            }
            // Unselecting towards anchor cell
            else {
                // Unselect all cells to the end of this row
                for(i=oTrigger.colKeyIndex; i<elThisRow.cells.length; i++){
                    this.unselectCell(elThisRow.cells[i]);
                }

                // Unselect some of the cells on the next row down
                if(elNewRow) {
                    for(i=0; i<oTrigger.colKeyIndex; i++){
                        this.unselectCell(elNewRow.cells[i]);
                    }
                }
            }
        }
        // Arrow up
        else if(nKey == 38) {
            elNewRow = this.getPreviousTrEl(oTrigger.el);

            // Selecting away from anchor cell
            if(oAnchor.recordIndex >= oTrigger.recordIndex) {
                // Select all the cells to the beginning of this row
                for(i=oTrigger.colKeyIndex-1; i>-1; i--){
                    elNew = elThisRow.cells[i];
                    this.selectCell(elNew);
                }

                // Select some of the cells from the end of the previous row
                if(elNewRow) {
                    for(i=elThisRow.cells.length-1; i>=oTrigger.colKeyIndex; i--){
                        elNew = elNewRow.cells[i];
                        this.selectCell(elNew);
                    }
                }
            }
            // Unselecting towards anchor cell
            else {
                // Unselect all the cells to the beginning of this row
                for(i=oTrigger.colKeyIndex; i>-1; i--){
                    this.unselectCell(elThisRow.cells[i]);
                }

                // Unselect some of the cells from the end of the previous row
                if(elNewRow) {
                    for(i=elThisRow.cells.length-1; i>oTrigger.colKeyIndex; i--){
                        this.unselectCell(elNewRow.cells[i]);
                    }
                }
            }
        }
        // Arrow right
        else if(nKey == 39) {
            elNewRow = this.getNextTrEl(oTrigger.el);

            // Selecting away from anchor cell
            if(oAnchor.recordIndex < oTrigger.recordIndex) {
                // Select the next cell to the right
                if(oTrigger.colKeyIndex < elThisRow.cells.length-1) {
                    elNew = elThisRow.cells[oTrigger.colKeyIndex+1];
                    this.selectCell(elNew);
                }
                // Select the first cell of the next row
                else if(elNewRow) {
                    elNew = elNewRow.cells[0];
                    this.selectCell(elNew);
                }
            }
            // Unselecting towards anchor cell
            else if(oAnchor.recordIndex > oTrigger.recordIndex) {
                this.unselectCell(elThisRow.cells[oTrigger.colKeyIndex]);

                // Unselect this cell towards the right
                if(oTrigger.colKeyIndex < elThisRow.cells.length-1) {
                }
                // Unselect this cells towards the first cell of the next row
                else {
                }
            }
            // Anchor is on this row
            else {
                // Selecting away from anchor
                if(oAnchor.colKeyIndex <= oTrigger.colKeyIndex) {
                    // Select the next cell to the right
                    if(oTrigger.colKeyIndex < elThisRow.cells.length-1) {
                        elNew = elThisRow.cells[oTrigger.colKeyIndex+1];
                        this.selectCell(elNew);
                    }
                    // Select the first cell on the next row
                    else if(oTrigger.trIndex < allRows.length-1){
                        elNew = elNewRow.cells[0];
                        this.selectCell(elNew);
                    }
                }
                // Unselecting towards anchor
                else {
                    // Unselect this cell towards the right
                    this.unselectCell(elThisRow.cells[oTrigger.colKeyIndex]);
                }
            }
        }
        // Arrow left
        else if(nKey == 37) {
            elNewRow = this.getPreviousTrEl(oTrigger.el);

            // Unselecting towards the anchor
            if(oAnchor.recordIndex < oTrigger.recordIndex) {
                this.unselectCell(elThisRow.cells[oTrigger.colKeyIndex]);

                // Unselect this cell towards the left
                if(oTrigger.colKeyIndex > 0) {
                }
                // Unselect this cell towards the last cell of the previous row
                else {
                }
            }
            // Selecting towards the anchor
            else if(oAnchor.recordIndex > oTrigger.recordIndex) {
                // Select the next cell to the left
                if(oTrigger.colKeyIndex > 0) {
                    elNew = elThisRow.cells[oTrigger.colKeyIndex-1];
                    this.selectCell(elNew);
                }
                // Select the last cell of the previous row
                else if(oTrigger.trIndex > 0){
                    elNew = elNewRow.cells[elNewRow.cells.length-1];
                    this.selectCell(elNew);
                }
            }
            // Anchor is on this row
            else {
                // Selecting away from anchor cell
                if(oAnchor.colKeyIndex >= oTrigger.colKeyIndex) {
                    // Select the next cell to the left
                    if(oTrigger.colKeyIndex > 0) {
                        elNew = elThisRow.cells[oTrigger.colKeyIndex-1];
                        this.selectCell(elNew);
                    }
                    // Select the last cell of the previous row
                    else if(oTrigger.trIndex > 0){
                        elNew = elNewRow.cells[elNewRow.cells.length-1];
                        this.selectCell(elNew);
                    }
                }
                // Unselecting towards anchor cell
                else {
                    this.unselectCell(elThisRow.cells[oTrigger.colKeyIndex]);

                    // Unselect this cell towards the left
                    if(oTrigger.colKeyIndex > 0) {
                    }
                    // Unselect this cell towards the last cell of the previous row
                    else {
                    }
                }
            }
        }
    }
},

/**
 * Determines selection behavior resulting from a mouse event when selection mode
 * is set to "singlecell".
 *
 * @method _handleSingleCellSelectionByMouse
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 * @private
 */
_handleSingleCellSelectionByMouse : function(oArgs) {
    var elTarget = oArgs.target;

    // Validate target cell
    var elTargetCell = this.getTdEl(elTarget);
    if(elTargetCell) {
        var elTargetRow = this.getTrEl(elTargetCell);
        var oTargetRecord = this.getRecord(elTargetRow);
        var oTargetColumn = this.getColumn(elTargetCell);
        var oTargetCell = {record:oTargetRecord, column:oTargetColumn};

        // Set anchor
        this._oAnchorCell = oTargetCell;

        // Select only target
        this.unselectAllCells();
        this.selectCell(oTargetCell);
    }
},

/**
 * Determines selection behavior resulting from a key event when selection mode
 * is set to "singlecell".
 *
 * @method _handleSingleCellSelectionByKey
 * @param e {HTMLEvent} Event object.
 * @private
 */
_handleSingleCellSelectionByKey : function(e) {
    var nKey = Ev.getCharCode(e);
    if((nKey == 9) || ((nKey > 36) && (nKey < 41))) {
        var bSHIFT = e.shiftKey;

        // Validate trigger
        var oTrigger = this._getSelectionTrigger();
        // Arrow selection only works if last selected row is on current page
        if(!oTrigger) {
            return null;
        }

        // Determine the new cell to select
        var elNew;
        if(nKey == 40) { // Arrow down
            elNew = this.getBelowTdEl(oTrigger.el);

            // Validate new cell
            if(elNew === null) {
                //TODO: wrap around to first tr on current page

                //TODO: wrap forward to first tr of next page

                // Bottom selection is sticky
                elNew = oTrigger.el;
            }
        }
        else if(nKey == 38) { // Arrow up
            elNew = this.getAboveTdEl(oTrigger.el);

            // Validate new cell
            if(elNew === null) {
                //TODO: wrap around to last tr on current page

                //TODO: wrap back to last tr of previous page

                // Top selection is sticky
                elNew = oTrigger.el;
            }
        }
        else if((nKey == 39) || (!bSHIFT && (nKey == 9))) { // Arrow right or tab
            elNew = this.getNextTdEl(oTrigger.el);

            // Validate new cell
            if(elNew === null) {
                //TODO: wrap around to first td on current page

                //TODO: wrap forward to first td of next page

                // Top-left selection is sticky, and release TAB focus
                //elNew = oTrigger.el;
                return;
            }
        }
        else if((nKey == 37) || (bSHIFT && (nKey == 9))) { // Arrow left or shift-tab
            elNew = this.getPreviousTdEl(oTrigger.el);

            // Validate new cell
            if(elNew === null) {
                //TODO: wrap around to last td on current page

                //TODO: wrap back to last td of previous page

                // Bottom-right selection is sticky, and release TAB focus
                //elNew = oTrigger.el;
                return;
            }
        }

        Ev.stopEvent(e);
        
        // Unselect all cells
        this.unselectAllCells();

        // Select the new cell
        this.selectCell(elNew);

        // Set new anchor
        this._oAnchorCell = {record:this.getRecord(elNew), column:this.getColumn(elNew)};
    }
},

/**
 * Returns array of selected TR elements on the page.
 *
 * @method getSelectedTrEls
 * @return {HTMLElement[]} Array of selected TR elements.
 */
getSelectedTrEls : function() {
    return Dom.getElementsByClassName(DT.CLASS_SELECTED,"tr",this._elTbody);
},

/**
 * Sets given row to the selected state.
 *
 * @method selectRow
 * @param row {HTMLElement | String | YAHOO.widget.Record | Number} HTML element
 * reference or ID string, Record instance, or RecordSet position index.
 */
selectRow : function(row) {
    var oRecord, elRow;

    if(row instanceof YAHOO.widget.Record) {
        oRecord = this._oRecordSet.getRecord(row);
        elRow = this.getTrEl(oRecord);
    }
    else if(lang.isNumber(row)) {
        oRecord = this.getRecord(row);
        elRow = this.getTrEl(oRecord);
    }
    else {
        elRow = this.getTrEl(row);
        oRecord = this.getRecord(elRow);
    }

    if(oRecord) {
        // Update selection trackers
        var tracker = this._aSelections || [];
        var sRecordId = oRecord.getId();
        var index = -1;

        // Remove if already there:
        // Use Array.indexOf if available...
        /*if(tracker.indexOf && (tracker.indexOf(sRecordId) >  -1)) {
            tracker.splice(tracker.indexOf(sRecordId),1);
        }*/
        if(tracker.indexOf) {
            index = tracker.indexOf(sRecordId);
            
        }
        // ...or do it the old-fashioned way
        else {
            for(var j=tracker.length-1; j>-1; j--) {
                if(tracker[j] === sRecordId){
                    index = j;
                    break;
                }
            }
        }
        if(index > -1) {
            tracker.splice(index,1);
        }
        
        // Add to the end
        tracker.push(sRecordId);
        this._aSelections = tracker;

        // Update trackers
        if(!this._oAnchorRecord) {
            this._oAnchorRecord = oRecord;
        }

        // Update UI
        if(elRow) {
            Dom.addClass(elRow, DT.CLASS_SELECTED);
        }

        this.fireEvent("rowSelectEvent", {record:oRecord, el:elRow});
        YAHOO.log("Selected " + elRow, "info", this.toString());
    }
    else {
        YAHOO.log("Could not select row " + row, "warn", this.toString());
    }
},

/**
 * Sets given row to the selected state.
 *
 * @method unselectRow
 * @param row {HTMLElement | String | YAHOO.widget.Record | Number} HTML element
 * reference or ID string, Record instance, or RecordSet position index.
 */
unselectRow : function(row) {
    var elRow = this.getTrEl(row);

    var oRecord;
    if(row instanceof YAHOO.widget.Record) {
        oRecord = this._oRecordSet.getRecord(row);
    }
    else if(lang.isNumber(row)) {
        oRecord = this.getRecord(row);
    }
    else {
        oRecord = this.getRecord(elRow);
    }

    if(oRecord) {
        // Update selection trackers
        var tracker = this._aSelections || [];
        var sRecordId = oRecord.getId();
        var index = -1;

        // Remove if found
        var bFound = false;

        // Use Array.indexOf if available...
        if(tracker.indexOf) {
            index = tracker.indexOf(sRecordId);
        }
        // ...or do it the old-fashioned way
        else {
            for(var j=tracker.length-1; j>-1; j--) {
                if(tracker[j] === sRecordId){
                    index = j;
                    break;
                }
            }
        }
        if(index > -1) {
            tracker.splice(index,1);
        }

        if(bFound) {
            // Update tracker
            this._aSelections = tracker;

            // Update the UI
            Dom.removeClass(elRow, DT.CLASS_SELECTED);

            this.fireEvent("rowUnselectEvent", {record:oRecord, el:elRow});
            YAHOO.log("Unselected " + elRow, "info", this.toString());

            return;
        }

        // Update the UI
        Dom.removeClass(elRow, DT.CLASS_SELECTED);

        this.fireEvent("rowUnselectEvent", {record:oRecord, el:elRow});
        YAHOO.log("Unselected " + elRow, "info", this.toString());
    }
    YAHOO.log("Could not unselect row " + row, "warn", this.toString());
},

/**
 * Clears out all row selections.
 *
 * @method unselectAllRows
 */
unselectAllRows : function() {
    // Remove all rows from tracker
    var tracker = this._aSelections || [];
    for(var j=tracker.length-1; j>-1; j--) {
       if(lang.isString(tracker[j])){
            tracker.splice(j,1);
        }
    }

    // Update tracker
    this._aSelections = tracker;

    // Update UI
    this._unselectAllTrEls();

    //TODO: send an array of [{el:el,record:record}]
    //TODO: or convert this to an unselectRows method
    //TODO: that takes an array of rows or unselects all if none given
    this.fireEvent("unselectAllRowsEvent");
    YAHOO.log("Unselected all rows", "info", this.toString());
},

/**
 * Convenience method to remove the class YAHOO.widget.DataTable.CLASS_SELECTED
 * from all TD elements in the internal tracker.
 *
 * @method _unselectAllTdEls
 * @private
 */
_unselectAllTdEls : function() {
    var selectedCells = Dom.getElementsByClassName(DT.CLASS_SELECTED,"td",this._elTbody);
    Dom.removeClass(selectedCells, DT.CLASS_SELECTED);
},

/**
 * Returns array of selected TD elements on the page.
 *
 * @method getSelectedTdEls
 * @return {HTMLElement[]} Array of selected TD elements.
 */
getSelectedTdEls : function() {
    return Dom.getElementsByClassName(DT.CLASS_SELECTED,"td",this._elTbody);
},

/**
 * Sets given cell to the selected state.
 *
 * @method selectCell
 * @param cell {HTMLElement | String} DOM element reference or ID string
 * to DataTable page element or RecordSet index.
 */
selectCell : function(cell) {
/*TODO:
accept {record}
*/
    var elCell = this.getTdEl(cell);

    if(elCell) {
        var oRecord = this.getRecord(elCell);
        var sColumnId = this.getColumn(elCell.cellIndex).getId();
        ///var sColumnId = elCell.yuiColumnId;

        if(oRecord && sColumnId) {
            // Get Record ID
            var tracker = this._aSelections || [];
            var sRecordId = oRecord.getId();

            // Remove if there
            for(var j=tracker.length-1; j>-1; j--) {
               if((tracker[j].recordId === sRecordId) && (tracker[j].columnId === sColumnId)){
                    tracker.splice(j,1);
                    break;
                }
            }

            // Add to the end
            tracker.push({recordId:sRecordId, columnId:sColumnId});

            // Update trackers
            this._aSelections = tracker;
            if(!this._oAnchorCell) {
                this._oAnchorCell = {record:oRecord, column:this.getColumnById(sColumnId)};
            }

            // Update the UI
            Dom.addClass(elCell, DT.CLASS_SELECTED);

            this.fireEvent("cellSelectEvent", {record:oRecord, column:this.getColumn(elCell.cellIndex), key: this.getColumn(elCell.cellIndex).getKey(), el:elCell});
            ///this.fireEvent("cellSelectEvent", {record:oRecord, column:this.getColumnById(sColumnId), key: elCell.yuiColumnKey, el:elCell});
            YAHOO.log("Selected " + elCell, "info", this.toString());
            return;
        }
    }
    YAHOO.log("Could not select cell " + cell, "warn", this.toString());
},

/**
 * Sets given cell to the unselected state.
 *
 * @method unselectCell
 * @param cell {HTMLElement | String} DOM element reference or ID string
 * to DataTable page element or RecordSet index.
 */
unselectCell : function(cell) {
    var elCell = this.getTdEl(cell);

    if(elCell) {
        var oRecord = this.getRecord(elCell);
        var sColumnId = this.getColumn(elCell.cellIndex).getId();
        ///var sColumnId = elCell.yuiColumnId;

        if(oRecord && sColumnId) {
            // Get Record ID
            var tracker = this._aSelections || [];
            var id = oRecord.getId();

            // Is it selected?
            for(var j=tracker.length-1; j>-1; j--) {
                if((tracker[j].recordId === id) && (tracker[j].columnId === sColumnId)){
                    // Remove from tracker
                    tracker.splice(j,1);

                    // Update tracker
                    this._aSelections = tracker;

                    // Update the UI
                    Dom.removeClass(elCell, DT.CLASS_SELECTED);

                    this.fireEvent("cellUnselectEvent", {record:oRecord, column: this.getColumn(elCell.cellIndex), key:this.getColumn(elCell.cellIndex).getKey(), el:elCell});
                    //this.fireEvent("cellUnselectEvent", {record:oRecord, column: this.getColumnById(sColumnId), key:elCell.yuiColumnKey, el:elCell});
                    YAHOO.log("Unselected " + elCell, "info", this.toString());
                    return;
                }
            }
        }
    }
    YAHOO.log("Could not unselect cell " + cell, "warn", this.toString());
},

/**
 * Clears out all cell selections.
 *
 * @method unselectAllCells
 */
unselectAllCells: function() {
    // Remove all cells from tracker
    var tracker = this._aSelections || [];
    for(var j=tracker.length-1; j>-1; j--) {
       if(tracker[j].constructor == Object){
            tracker.splice(j,1);
        }
    }

    // Update tracker
    this._aSelections = tracker;

    // Update UI
    this._unselectAllTdEls();

    //TODO: send data
    //TODO: or fire individual cellUnselectEvent
    this.fireEvent("unselectAllCellsEvent");
    YAHOO.log("Unselected all cells", "info", this.toString());
},

/**
 * Returns true if given item is selected, false otherwise.
 *
 * @method isSelected
 * @param o {String | HTMLElement | YAHOO.widget.Record | Number
 * {record:YAHOO.widget.Record, column:YAHOO.widget.Column} } TR or TD element by
 * reference or ID string, a Record instance, a RecordSet position index,
 * or an object literal representation
 * of a cell.
 * @return {Boolean} True if item is selected.
 */
isSelected : function(o) {
    if(o && (o.ownerDocument == document)) {
        return (Dom.hasClass(this.getTdEl(o),DT.CLASS_SELECTED) || Dom.hasClass(this.getTrEl(o),DT.CLASS_SELECTED));
    }
    else {
        var oRecord, sRecordId, j;
        var tracker = this._aSelections;
        if(tracker && tracker.length > 0) {
            // Looking for a Record?
            if(o instanceof YAHOO.widget.Record) {
                oRecord = o;
            }
            else if(lang.isNumber(o)) {
                oRecord = this.getRecord(o);
            }
            if(oRecord) {
                sRecordId = oRecord.getId();

                // Is it there?
                // Use Array.indexOf if available...
                if(tracker.indexOf) {
                    if(tracker.indexOf(sRecordId) >  -1) {
                        return true;
                    }
                }
                // ...or do it the old-fashioned way
                else {
                    for(j=tracker.length-1; j>-1; j--) {
                       if(tracker[j] === sRecordId){
                        return true;
                       }
                    }
                }
            }
            // Looking for a cell
            else if(o.record && o.column){
                sRecordId = o.record.getId();
                var sColumnId = o.column.getId();

                for(j=tracker.length-1; j>-1; j--) {
                    if((tracker[j].recordId === sRecordId) && (tracker[j].columnId === sColumnId)){
                        return true;
                    }
                }
            }
        }
    }
    return false;
},

/**
 * Returns selected rows as an array of Record IDs.
 *
 * @method getSelectedRows
 * @return {String[]} Array of selected rows by Record ID.
 */
getSelectedRows : function() {
    var aSelectedRows = [];
    var tracker = this._aSelections || [];
    for(var j=0; j<tracker.length; j++) {
       if(lang.isString(tracker[j])){
            aSelectedRows.push(tracker[j]);
        }
    }
    return aSelectedRows;
},

/**
 * Returns selected cells as an array of object literals:
 *     {recordId:sRecordId, columnId:sColumnId}.
 *
 * @method getSelectedCells
 * @return {Object[]} Array of selected cells by Record ID and Column ID.
 */
getSelectedCells : function() {
    var aSelectedCells = [];
    var tracker = this._aSelections || [];
    for(var j=0; j<tracker.length; j++) {
       if(tracker[j] && (tracker[j].constructor == Object)){
            aSelectedCells.push(tracker[j]);
        }
    }
    return aSelectedCells;
},

/**
 * Returns last selected Record ID.
 *
 * @method getLastSelectedRecord
 * @return {String} Record ID of last selected row.
 */
getLastSelectedRecord : function() {
    var tracker = this._aSelections;
    if(tracker && tracker.length > 0) {
        for(var i=tracker.length-1; i>-1; i--) {
           if(lang.isString(tracker[i])){
                return tracker[i];
            }
        }
    }
},

/**
 * Returns last selected cell as an object literal:
 *     {recordId:sRecordId, columnId:sColumnId}.
 *
 * @method getLastSelectedCell
 * @return {Object} Object literal representation of a cell.
 */
getLastSelectedCell : function() {
    var tracker = this._aSelections;
    if(tracker && tracker.length > 0) {
        for(var i=tracker.length-1; i>-1; i--) {
           if(tracker[i].recordId && tracker[i].columnId){
                return tracker[i];
            }
        }
    }
},

/**
 * Assigns the class YAHOO.widget.DataTable.CLASS_HIGHLIGHTED to the given row.
 *
 * @method highlightRow
 * @param row {HTMLElement | String} DOM element reference or ID string.
 */
highlightRow : function(row) {
    var elRow = this.getTrEl(row);

    if(elRow) {
        // Make sure previous row is unhighlighted
/*        if(this._sLastHighlightedTrElId) {
            Dom.removeClass(this._sLastHighlightedTrElId,DT.CLASS_HIGHLIGHTED);
        }*/
        var oRecord = this.getRecord(elRow);
        Dom.addClass(elRow,DT.CLASS_HIGHLIGHTED);
        //this._sLastHighlightedTrElId = elRow.id;
        this.fireEvent("rowHighlightEvent", {record:oRecord, el:elRow});
        YAHOO.log("Highlighted " + elRow, "info", this.toString());
        return;
    }
    YAHOO.log("Could not highlight row " + row, "warn", this.toString());
},

/**
 * Removes the class YAHOO.widget.DataTable.CLASS_HIGHLIGHTED from the given row.
 *
 * @method unhighlightRow
 * @param row {HTMLElement | String} DOM element reference or ID string.
 */
unhighlightRow : function(row) {
    var elRow = this.getTrEl(row);

    if(elRow) {
        var oRecord = this.getRecord(elRow);
        Dom.removeClass(elRow,DT.CLASS_HIGHLIGHTED);
        this.fireEvent("rowUnhighlightEvent", {record:oRecord, el:elRow});
        YAHOO.log("Unhighlighted " + elRow, "info", this.toString());
        return;
    }
    YAHOO.log("Could not unhighlight row " + row, "warn", this.toString());
},

/**
 * Assigns the class YAHOO.widget.DataTable.CLASS_HIGHLIGHTED to the given cell.
 *
 * @method highlightCell
 * @param cell {HTMLElement | String} DOM element reference or ID string.
 */
highlightCell : function(cell) {
    var elCell = this.getTdEl(cell);

    if(elCell) {
        // Make sure previous cell is unhighlighted
        /*if(this._sLastHighlightedTdElId) {
            Dom.removeClass(this._sLastHighlightedTdElId,DT.CLASS_HIGHLIGHTED);
        }*/

        var oRecord = this.getRecord(elCell);
        var sColumnId = this.getColumn(elCell.cellIndex).getId();
        //var sColumnId = elCell.yuiColumnId;
        Dom.addClass(elCell,DT.CLASS_HIGHLIGHTED);
        //this._sLastHighlightedTdElId = elCell.id;
        this.fireEvent("cellHighlightEvent", {record:oRecord, column:this.getColumn(elCell.cellIndex), key:this.getColumn(elCell.cellIndex).getKey(), el:elCell});
        ///this.fireEvent("cellHighlightEvent", {record:oRecord, column:this.getColumnById(sColumnId), key:elCell.yuiColumnKey, el:elCell});
        YAHOO.log("Highlighted " + elCell, "info", this.toString());
        return;
    }
    YAHOO.log("Could not highlight cell " + cell, "warn", this.toString());
},

/**
 * Removes the class YAHOO.widget.DataTable.CLASS_HIGHLIGHTED from the given cell.
 *
 * @method unhighlightCell
 * @param cell {HTMLElement | String} DOM element reference or ID string.
 */
unhighlightCell : function(cell) {
    var elCell = this.getTdEl(cell);

    if(elCell) {
        var oRecord = this.getRecord(elCell);
        Dom.removeClass(elCell,DT.CLASS_HIGHLIGHTED);
        this.fireEvent("cellUnhighlightEvent", {record:oRecord, column:this.getColumn(elCell.cellIndex), key:this.getColumn(elCell.cellIndex).getKey(), el:elCell});
        ///this.fireEvent("cellUnhighlightEvent", {record:oRecord, column:this.getColumnById(elCell.yuiColumnId), key:elCell.yuiColumnKey, el:elCell});
        YAHOO.log("Unhighlighted " + elCell, "info", this.toString());
        return;
    }
    YAHOO.log("Could not unhighlight cell " + cell, "warn", this.toString());
},













































// INLINE EDITING

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

            ///TODO: remove scrolling logic
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
 * Overridable abstract method to customize Cell Editor UI.
 *
 * @method doBeforeShowCellEditor
 * @param oCellEditor {Object} Cell Editor object literal.
 */
doBeforeShowCellEditor : function(oCellEditor) {
},

/**
 * Adds Save/Cancel buttons to Cell Editor.
 *
 * @method showCellEditorBtns
 * @param elContainer {HTMLElement} Cell Editor container.
 */
showCellEditorBtns : function(elContainer) {
    // Buttons
    var elBtnsDiv = elContainer.appendChild(document.createElement("div"));
    Dom.addClass(elBtnsDiv, DT.CLASS_BUTTON);

    // Save button
    var elSaveBtn = elBtnsDiv.appendChild(document.createElement("button"));
    Dom.addClass(elSaveBtn, DT.CLASS_DEFAULT);
    elSaveBtn.innerHTML = "OK";
    Ev.addListener(elSaveBtn, "click", function(oArgs, oSelf) {
        oSelf.onEventSaveCellEditor(oArgs, oSelf);
        oSelf.focusTbodyEl();
    }, this, true);

    // Cancel button
    var elCancelBtn = elBtnsDiv.appendChild(document.createElement("button"));
    elCancelBtn.innerHTML = "Cancel";
    Ev.addListener(elCancelBtn, "click", function(oArgs, oSelf) {
        oSelf.onEventCancelCellEditor(oArgs, oSelf);
        oSelf.focusTbodyEl();
    }, this, true);
},

/**
 * Clears Cell Editor of all state and UI.
 *
 * @method resetCellEditor
 */

resetCellEditor : function() {
    var elContainer = this._oCellEditor.container;
    elContainer.style.display = "none";
    Ev.purgeElement(elContainer, true);
    elContainer.innerHTML = "";
    this._oCellEditor.value = null;
    this._oCellEditor.isActive = false;
    
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

/**
 * Cancels Cell Editor.
 *
 * @method cancelCellEditor
 */
cancelCellEditor : function() {
    if(this._oCellEditor.isActive) {
        this.resetCellEditor();
        //TODO: preserve values for the event?
        this.fireEvent("editorCancelEvent", {editor:this._oCellEditor});
        YAHOO.log("Cell Editor input canceled", "info", this.toString());
    }
    else {
        YAHOO.log("Cell Editor not active to cancel input", "warn", this.toString());
    }
},







































// ABSTRACT METHODS

/**
 * Overridable method gives implementers a hook to access data before
 * it gets added to RecordSet and rendered to the TBODY.
 *
 * @method doBeforeLoadData
 * @param sRequest {String} Original request.
 * @param oResponse {Object} Response object.
 * @param oPayload {MIXED} additional arguments
 * @return {Boolean} Return true to continue loading data into RecordSet and
 * updating DataTable with new Records, false to cancel.
 */
doBeforeLoadData : function(sRequest, oResponse, oPayload) {
    return true;
},































































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
onEventSortColumn : function(oArgs) {
//TODO: support form elements in sortable columns
    var evt = oArgs.event;
    var target = oArgs.target;

    var el = this.getThEl(target) || this.getTdEl(target);
    if(el) {
    ///if(el && el.yuiColumnKey) {
        var oColumn = this.getColumn(el.cellIndex);
        ///var oColumn = this.getColumn(el.yuiColumnKey);
        if(oColumn.sortable) {
            Ev.stopEvent(evt);
            this.sortColumn(oColumn);
        }
    }
    else {
        YAHOO.log("Could not find Column for " + target, "warn", this.toString());
    }
},

/**
 * Overridable custom event handler to select Column.
 *
 * @method onEventSelectColumn
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 */
onEventSelectColumn : function(oArgs) {
    this.selectColumn(oArgs.target);
},

/**
 * Overridable custom event handler to highlight Column. Accounts for spurious
 * caused-by-child events. 
 *
 * @method onEventHighlightColumn
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 */
onEventHighlightColumn : function(oArgs) {
    //TODO: filter for all spurious events at a lower level
    if(!Dom.isAncestor(oArgs.target,Ev.getRelatedTarget(oArgs.event))) {
        this.highlightColumn(oArgs.target);
    }
},

/**
 * Overridable custom event handler to unhighlight Column. Accounts for spurious
 * caused-by-child events. 
 *
 * @method onEventUnhighlightColumn
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 */
onEventUnhighlightColumn : function(oArgs) {
    //TODO: filter for all spurious events at a lower level
    if(!Dom.isAncestor(oArgs.target,Ev.getRelatedTarget(oArgs.event))) {
        this.unhighlightColumn(oArgs.target);
    }
},

/**
 * Overridable custom event handler to manage selection according to desktop paradigm.
 *
 * @method onEventSelectRow
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 */
onEventSelectRow : function(oArgs) {
    var sMode = this.get("selectionMode");
    if(sMode == "single") {
        this._handleSingleSelectionByMouse(oArgs);
    }
    else {
        this._handleStandardSelectionByMouse(oArgs);
    }
},

/**
 * Overridable custom event handler to select cell.
 *
 * @method onEventSelectCell
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 */
onEventSelectCell : function(oArgs) {
    var sMode = this.get("selectionMode");
    if(sMode == "cellblock") {
        this._handleCellBlockSelectionByMouse(oArgs);
    }
    else if(sMode == "cellrange") {
        this._handleCellRangeSelectionByMouse(oArgs);
    }
    else {
        this._handleSingleCellSelectionByMouse(oArgs);
    }
},

/**
 * Overridable custom event handler to highlight row. Accounts for spurious
 * caused-by-child events. 
 *
 * @method onEventHighlightRow
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 */
onEventHighlightRow : function(oArgs) {
    //TODO: filter for all spurious events at a lower level
    if(!Dom.isAncestor(oArgs.target,Ev.getRelatedTarget(oArgs.event))) {
        this.highlightRow(oArgs.target);
    }
},

/**
 * Overridable custom event handler to unhighlight row. Accounts for spurious
 * caused-by-child events. 
 *
 * @method onEventUnhighlightRow
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 */
onEventUnhighlightRow : function(oArgs) {
    //TODO: filter for all spurious events at a lower level
    if(!Dom.isAncestor(oArgs.target,Ev.getRelatedTarget(oArgs.event))) {
        this.unhighlightRow(oArgs.target);
    }
},

/**
 * Overridable custom event handler to highlight cell. Accounts for spurious
 * caused-by-child events. 
 *
 * @method onEventHighlightCell
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 */
onEventHighlightCell : function(oArgs) {
    //TODO: filter for all spurious events at a lower level
    if(!Dom.isAncestor(oArgs.target,Ev.getRelatedTarget(oArgs.event))) {
        this.highlightCell(oArgs.target);
    }
},

/**
 * Overridable custom event handler to unhighlight cell. Accounts for spurious
 * caused-by-child events. 
 *
 * @method onEventUnhighlightCell
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 */
onEventUnhighlightCell : function(oArgs) {
    //TODO: filter for all spurious events at a lower level
    if(!Dom.isAncestor(oArgs.target,Ev.getRelatedTarget(oArgs.event))) {
        this.unhighlightCell(oArgs.target);
    }
},

/**
 * Overridable custom event handler to format cell.
 *
 * @method onEventFormatCell
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 */
onEventFormatCell : function(oArgs) {
    var target = oArgs.target;

    var elCell = this.getTdEl(target);
    if(elCell) {
    ///if(elCell && elCell.yuiColumnKey) {
        var oColumn = this.getColumn(elCell.cellIndex);
        ///var oColumn = this.getColumn(elCell.yuiColumnKey);
        this.formatCell(elCell.firstChild, this.getRecord(elCell), oColumn);
    }
    else {
        YAHOO.log("Could not format cell " + target, "warn", this.toString());
    }
},

/**
 * Overridable custom event handler to edit cell.
 *
 * @method onEventShowCellEditor
 * @param oArgs.event {HTMLEvent} Event object.
 * @param oArgs.target {HTMLElement} Target element.
 */
onEventShowCellEditor : function(oArgs) {
    var target = oArgs.target;

    var elCell = this.getTdEl(target);
    if(elCell) {
        this.showCellEditor(elCell);
    }
    else {
        YAHOO.log("Could not edit cell " + target, "warn", this.toString());
    }
},

/**
 * Overridable custom event handler to save Cell Editor input.
 *
 * @method onEventSaveCellEditor
 * @param oArgs.editor {Object} Cell Editor object literal.
 */
onEventSaveCellEditor : function(oArgs) {
    this.saveCellEditor();
},

/**
 * Overridable custom event handler to cancel Cell Editor.
 *
 * @method onEventCancelCellEditor
 * @param oArgs.editor {Object} Cell Editor object literal.
 */
onEventCancelCellEditor : function(oArgs) {
    this.cancelCellEditor();
},

/**
 * Callback function receives data from DataSource and populates an entire
 * DataTable with Records and TR elements, clearing previous Records, if any.
 *
 * @method onDataReturnInitializeTable
 * @param sRequest {String} Original request.
 * @param oResponse {Object} Response object.
 * @param oPayload {MIXED} (optional) Additional argument(s)
 */
onDataReturnInitializeTable : function(sRequest, oResponse, oPayload) {
    this.initializeTable();

    this.onDataReturnSetRows(sRequest,oResponse,oPayload);
},

/**
 * Callback function receives data from DataSource and appends to an existing
 * DataTable new Records and, if applicable, creates or updates
 * corresponding TR elements.
 *
 * @method onDataReturnAppendRows
 * @param sRequest {String} Original request.
 * @param oResponse {Object} Response object.
 * @param oPayload {MIXED} (optional) Additional argument(s)
 */
onDataReturnAppendRows : function(sRequest, oResponse, oPayload) {
    this.fireEvent("dataReturnEvent", {request:sRequest,response:oResponse,payload:oPayload});

    // Pass data through abstract method for any transformations
    var ok = this.doBeforeLoadData(sRequest, oResponse, oPayload);

    // Data ok to append
    if(ok && oResponse && !oResponse.error && lang.isArray(oResponse.results)) {

        this.addRows(oResponse.results);

        // Handle the meta && payload
        this._handleDataReturnPayload(sRequest, oResponse,
            this._mergeResponseMeta(oPayload, oResponse.meta));

        // Default the Paginator's totalRecords from the RecordSet length
        var oPaginator = this.get('paginator');
        if (oPaginator && oPaginator instanceof Pag &&
            oPaginator.get('totalRecords') < this._oRecordSet.getLength()) {
            oPaginator.set('totalRecords',this._oRecordSet.getLength());
        }
    }
    // Error
    else if(ok && oResponse.error) {
        this.showTableMessage(DT.MSG_ERROR, DT.CLASS_ERROR);
    }
},

/**
 * Callback function receives data from DataSource and inserts new records
 * starting at the index specified in oPayload.insertIndex.  If applicable,
 * creates or updates corresponding TR elements.
 *
 * @method onDataReturnInsertRows
 * @param sRequest {String} Original request.
 * @param oResponse {Object} Response object.
 * @param oPayload {MIXED} (optional) Additional argument(s)
 */
onDataReturnInsertRows : function(sRequest, oResponse, oPayload) {
    this.fireEvent("dataReturnEvent", {request:sRequest,response:oResponse,payload:oPayload});

    // Pass data through abstract method for any transformations
    var ok = this.doBeforeLoadData(sRequest, oResponse, oPayload);

    // Data ok to append
    if(ok && oResponse && !oResponse.error && lang.isArray(oResponse.results)) {
        var meta = this._mergeResponseMeta({
                // backward compatibility
                recordInsertIndex: (oPayload ? oPayload.insertIndex || 0 : 0) },
                oPayload, oResponse.meta);

        this.addRows(oResponse.results, meta.insertIndex);

        // Handle the magic meta values
        this._handleDataReturnPayload(sRequest,oResponse,meta);

        // Default the Paginator's totalRecords from the RecordSet length
        var oPaginator = this.get('paginator');
        if (oPaginator && oPaginator instanceof Pag &&
            oPaginator.get('totalRecords') < this._oRecordSet.getLength()) {
            oPaginator.set('totalRecords',this._oRecordSet.getLength());
        }
    }
    // Error
    else if(ok && oResponse.error) {
        this.showTableMessage(DT.MSG_ERROR, DT.CLASS_ERROR);
    }
},

/**
 * Receives reponse from DataSource and populates the RecordSet with the
 * results.
 * @method onDataReturnSetRows
 * @param oRequest {MIXED} Original generated request.
 * @param oResponse {Object} Response object.
 * @param oPayload {MIXED} (optional) Additional argument(s)
 */
onDataReturnSetRows : function(oRequest, oResponse, oPayload) {
    this.fireEvent("dataReturnEvent", {request:oRequest,response:oResponse,payload:oPayload});

    // Pass data through abstract method for any transformations
    var ok = this.doBeforeLoadData(oRequest, oResponse, oPayload);

    // Data ok to set
    if(ok && oResponse && !oResponse.error && lang.isArray(oResponse.results)) {
        var oPaginator = this.get('paginator');
        if (!(oPaginator instanceof Pag)) {
            oPaginator = null;
        }

        var meta = this._mergeResponseMeta({
                // backward compatibility
                recordStartIndex: oPayload ? oPayload.startIndex : null },
                oPayload, oResponse.meta);

        if (!lang.isNumber(meta.recordStartIndex)) {
            // Default to the current page offset if paginating; 0 if not.
            meta.recordStartIndex = oPaginator && meta.pagination ?
                meta.pagination.recordOffset || 0 : 0;
        }

        this._oRecordSet.setRecords(oResponse.results, meta.recordStartIndex);

        // Handle the magic meta values
        this._handleDataReturnPayload(oRequest,oResponse,meta);

        // Default the Paginator's totalRecords from the RecordSet length
        if (oPaginator && oPaginator.get('totalRecords') < this._oRecordSet.getLength()) {
            oPaginator.set('totalRecords',this._oRecordSet.getLength());
        }

        this.render();
    }
    // Error
    else if(ok && oResponse.error) {
        this.showTableMessage(DT.MSG_ERROR, DT.CLASS_ERROR);
    }
},

/**
 * Merges meta information from the response (as defined in the DataSource's
 * responseSchema.metaFields member) into the payload.  A few magic keys are
 * given special treatment: sortKey and sortDir => sorting.key|dir and all
 * keys paginationFoo => pagination.foo.  Merging is shallow with the exception
 * of the magic keys being added to their respective nested objects.
 *
 * @method _mergeResponseMeta
 * @param * {object} Any number of objects to merge together.  Last in wins.
 * @return {object} A new object containing the combined keys of all objects.
 * @private
 */
_mergeResponseMeta : function () {
    var meta = {},
        a = arguments,
        i = 0,len = a.length,
        k,o;

    for (; i < len; ++i) {
        o = a[i];
        if (lang.isObject(o)) {
            for (k in o) {
                if (lang.hasOwnProperty(o,k)) {
                    if (k.indexOf('pagination') === 0 && k.charAt(10)) {
                        if (!meta.pagination) {
                            meta.pagination = {};
                        }
                        meta.pagination[k.substr(10,1).toLowerCase()+k.substr(11)] = o[k];
                    } else if (/^sort(Key|Dir)/.test(k)) {
                        if (!meta.sorting) {
                            var curSort = this.get('sortedBy');
                            meta.sorting = curSort ? { key : curSort.key } : {};
                        }
                        meta.sorting[RegExp.$1.toLowerCase()] = o[k];
                    } else {
                        meta[k] = o[k];
                    }
                }
            }
        }
    }

    return meta;
},

/**
 * Updates the DataTable with data sent in an onDataReturn* payload
 * @method _handleDataReturnPayload
 * @param oRequest {MIXED} Original generated request.
 * @param oResponse {Object} Response object.
 * @param meta {MIXED} Argument(s) provided in payload or response meta
 * @private
 */
_handleDataReturnPayload : function (oRequest, oResponse, meta) {
    if (meta) {
        // Update with any pagination information
        var oPaginator = this.get('paginator');
        if (oPaginator instanceof Pag) {
            if (!lang.isUndefined(meta.totalRecords)) {
                oPaginator.set('totalRecords',parseInt(meta.totalRecords,10)|0);
            }

            if (lang.isObject(meta.pagination)) {
                // Set the paginator values in preparation for refresh
                oPaginator.set('rowsPerPage',meta.pagination.rowsPerPage);
                oPaginator.set('recordOffset',meta.pagination.recordOffset);
            }
        }

        // Update with any sorting information
        if (meta.sorting) {
            // Set the sorting values in preparation for refresh
            this.set('sortedBy', meta.sorting);
        }
    }
},

































    /////////////////////////////////////////////////////////////////////////////
    //
    // Custom Events
    //
    /////////////////////////////////////////////////////////////////////////////

    /**
     * Fired when the DataTable instance's initialization is complete.
     *
     * @event initEvent
     */

    /**
     * Fired when the DataTable's view is rendered.
     *
     * @event renderEvent
     */

    /**
     * Fired when any of the DataTable's content is changed.
     *
     * @event tableMutationEvent
     */

    /**
     * Fired when data is returned from DataSource but before it is consumed by
     * DataTable.
     *
     * @event dataReturnEvent
     * @param oArgs.request {String} Original request.
     * @param oArgs.response {Object} Response object.
     */

    /**
     * Fired when the DataTable has a focus event.
     *
     * @event tableFocusEvent
     */

    /**
     * Fired when the DataTable THEAD element has a focus event.
     *
     * @event theadFocusEvent
     */

    /**
     * Fired when the DataTable TBODY element has a focus event.
     *
     * @event tbodyFocusEvent
     */

    /**
     * Fired when the DataTable has a blur event.
     *
     * @event tableBlurEvent
     */

    /*TODO
     * Fired when the DataTable THEAD element has a blur event.
     *
     * @event theadBlurEvent
     */

    /*TODO
     * Fired when the DataTable TBODY element has a blur event.
     *
     * @event tbodyBlurEvent
     */

    /**
     * Fired when the DataTable has a key event.
     *
     * @event tableKeyEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The DataTable's TABLE element.
     */

    /**
     * Fired when the DataTable THEAD element has a key event.
     *
     * @event theadKeyEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The DataTable's TABLE element.
     */

    /**
     * Fired when the DataTable TBODY element has a key event.
     *
     * @event tbodyKeyEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The DataTable's TABLE element.
     */

    /**
     * Fired when the DataTable has a mouseover.
     *
     * @event tableMouseoverEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The DataTable's TABLE element.
     *
     */

    /**
     * Fired when the DataTable has a mouseout.
     *
     * @event tableMouseoutEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The DataTable's TABLE element.
     *
     */

    /**
     * Fired when the DataTable has a mousedown.
     *
     * @event tableMousedownEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The DataTable's TABLE element.
     *
     */

    /**
     * Fired when the DataTable has a click.
     *
     * @event tableClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The DataTable's TABLE element.
     *
     */

    /**
     * Fired when the DataTable has a dblclick.
     *
     * @event tableDblclickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The DataTable's TABLE element.
     *
     */

    /**
     * Fired when a message is shown in the DataTable's message element.
     *
     * @event tableMsgShowEvent
     * @param oArgs.html {String} The HTML displayed.
     * @param oArgs.className {String} The className assigned.
     *
     */

    /**
     * Fired when the DataTable's message element is hidden.
     *
     * @event tableMsgHideEvent
     */

    /**
     * Fired when a THEAD row has a mouseover.
     *
     * @event theadRowMouseoverEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TR element.
     */

    /**
     * Fired when a THEAD row has a mouseout.
     *
     * @event theadRowMouseoutEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TR element.
     */

    /**
     * Fired when a THEAD row has a mousedown.
     *
     * @event theadRowMousedownEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TR element.
     */

    /**
     * Fired when a THEAD row has a click.
     *
     * @event theadRowClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TR element.
     */

    /**
     * Fired when a THEAD row has a dblclick.
     *
     * @event theadRowDblclickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TR element.
     */

    /**
     * Fired when a THEAD cell has a mouseover.
     *
     * @event theadCellMouseoverEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TH element.
     *
     */

    /**
     * Fired when a THEAD cell has a mouseout.
     *
     * @event theadCellMouseoutEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TH element.
     *
     */

    /**
     * Fired when a THEAD cell has a mousedown.
     *
     * @event theadCellMousedownEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TH element.
     */

    /**
     * Fired when a THEAD cell has a click.
     *
     * @event theadCellClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TH element.
     */

    /**
     * Fired when a THEAD cell has a dblclick.
     *
     * @event theadCellDblclickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TH element.
     */

    /**
     * Fired when a THEAD label has a mouseover.
     *
     * @event theadLabelMouseoverEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The SPAN element.
     *
     */

    /**
     * Fired when a THEAD label has a mouseout.
     *
     * @event theadLabelMouseoutEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The SPAN element.
     *
     */

    /**
     * Fired when a THEAD label has a mousedown.
     *
     * @event theadLabelMousedownEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The SPAN element.
     */

    /**
     * Fired when a THEAD label has a click.
     *
     * @event theadLabelClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The SPAN element.
     */

    /**
     * Fired when a THEAD label has a dblclick.
     *
     * @event theadLabelDblclickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The SPAN element.
     */

    /**
     * Fired when a column is sorted.
     *
     * @event columnSortEvent
     * @param oArgs.column {YAHOO.widget.Column} The Column instance.
     * @param oArgs.dir {String} Sort direction: YAHOO.widget.DataTable.CLASS_ASC
     * or YAHOO.widget.DataTable.CLASS_DESC.
     */

    /**
     * Fired when a column width is set.
     *
     * @event columnSetWidthEvent
     * @param oArgs.column {YAHOO.widget.Column} The Column instance.
     * @param oArgs.width {Number} The width in pixels.
     */

    /**
     * Fired when a column is drag-resized.
     *
     * @event columnResizeEvent
     * @param oArgs.column {YAHOO.widget.Column} The Column instance.
     * @param oArgs.target {HTMLElement} The TH element.
     * @param oArgs.width {Number} Width in pixels.     
     */

    /**
     * Fired when a ColumnSet is re-initialized due to a Column being drag-reordered.
     *
     * @event columnReorderEvent
     */

    /**
     * Fired when a column is hidden.
     *
     * @event columnHideEvent
     * @param oArgs.column {YAHOO.widget.Column} The Column instance.
     */

    /**
     * Fired when a column is shown.
     *
     * @event columnShowEvent
     * @param oArgs.column {YAHOO.widget.Column} The Column instance.
     */

    /**
     * Fired when a column is selected.
     *
     * @event columnSelectEvent
     * @param oArgs.column {YAHOO.widget.Column} The Column instance.
     */

    /**
     * Fired when a column is unselected.
     *
     * @event columnUnselectEvent
     * @param oArgs.column {YAHOO.widget.Column} The Column instance.
     */
    /**
     * Fired when a column is removed.
     *
     * @event columnRemoveEvent
     * @param oArgs.column {YAHOO.widget.Column} The Column instance.
     */

    /**
     * Fired when a column is inserted.
     *
     * @event columnInsertEvent
     * @param oArgs.column {YAHOO.widget.Column} The Column instance.
     * @param oArgs.index {Number} The index position.
     */

    /**
     * Fired when a column is highlighted.
     *
     * @event columnHighlightEvent
     * @param oArgs.column {YAHOO.widget.Column} The highlighted Column.
     */

    /**
     * Fired when a column is unhighlighted.
     *
     * @event columnUnhighlightEvent
     * @param oArgs.column {YAHOO.widget.Column} The unhighlighted Column.
     */


    /**
     * Fired when a row has a mouseover.
     *
     * @event rowMouseoverEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TR element.
     */

    /**
     * Fired when a row has a mouseout.
     *
     * @event rowMouseoutEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TR element.
     */

    /**
     * Fired when a row has a mousedown.
     *
     * @event rowMousedownEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TR element.
     */

    /**
     * Fired when a row has a click.
     *
     * @event rowClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TR element.
     */

    /**
     * Fired when a row has a dblclick.
     *
     * @event rowDblclickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TR element.
     */

    /**
     * Fired when a row is added.
     *
     * @event rowAddEvent
     * @param oArgs.record {YAHOO.widget.Record} The added Record.
     */
     
    /**
     * Fired when rows are added.
     *
     * @event rowsAddEvent
     * @param oArgs.record {YAHOO.widget.Record[]} The added Records.
     */

    /**
     * Fired when a row is updated.
     *
     * @event rowUpdateEvent
     * @param oArgs.record {YAHOO.widget.Record} The updated Record.
     * @param oArgs.oldData {Object} Object literal of the old data.
     */

    /**
     * Fired when a row is deleted.
     *
     * @event rowDeleteEvent
     * @param oArgs.oldData {Object} Object literal of the deleted data.
     * @param oArgs.recordIndex {Number} Index of the deleted Record.
     * @param oArgs.trElIndex {Number} Index of the deleted TR element, if on current page.
     */
     
    /**
     * Fired when rows are deleted.
     *
     * @event rowsDeleteEvent
     * @param oArgs.oldData {Object[]} Array of object literals of the deleted data.
     * @param oArgs.recordIndex {Number} Index of the first deleted Record.
     * @param oArgs.count {Number} Number of deleted Records.
     */

    /**
     * Fired when a row is selected.
     *
     * @event rowSelectEvent
     * @param oArgs.el {HTMLElement} The selected TR element, if applicable.
     * @param oArgs.record {YAHOO.widget.Record} The selected Record.
     */

    /**
     * Fired when a row is unselected.
     *
     * @event rowUnselectEvent
     * @param oArgs.el {HTMLElement} The unselected TR element, if applicable.
     * @param oArgs.record {YAHOO.widget.Record} The unselected Record.
     */

    /**
     * Fired when all row selections are cleared.
     *
     * @event unselectAllRowsEvent
     */

    /**
     * Fired when a row is highlighted.
     *
     * @event rowHighlightEvent
     * @param oArgs.el {HTMLElement} The highlighted TR element.
     * @param oArgs.record {YAHOO.widget.Record} The highlighted Record.
     */

    /**
     * Fired when a row is unhighlighted.
     *
     * @event rowUnhighlightEvent
     * @param oArgs.el {HTMLElement} The highlighted TR element.
     * @param oArgs.record {YAHOO.widget.Record} The highlighted Record.
     */

    /**
     * Fired when a cell has a mouseover.
     *
     * @event cellMouseoverEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TD element.
     */

    /**
     * Fired when a cell has a mouseout.
     *
     * @event cellMouseoutEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TD element.
     */

    /**
     * Fired when a cell has a mousedown.
     *
     * @event cellMousedownEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TD element.
     */

    /**
     * Fired when a cell has a click.
     *
     * @event cellClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TD element.
     */

    /**
     * Fired when a cell has a dblclick.
     *
     * @event cellDblclickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The TD element.
     */

    /**
     * Fired when a cell is formatted.
     *
     * @event cellFormatEvent
     * @param oArgs.el {HTMLElement} The formatted TD element.
     * @param oArgs.record {YAHOO.widget.Record} The associated Record instance.
     * @param oArgs.column {YAHOO.widget.Column} The associated Column instance.
     * @param oArgs.key {String} (deprecated) The key of the formatted cell.
     */

    /**
     * Fired when a cell is selected.
     *
     * @event cellSelectEvent
     * @param oArgs.el {HTMLElement} The selected TD element.
     * @param oArgs.record {YAHOO.widget.Record} The associated Record instance.
     * @param oArgs.column {YAHOO.widget.Column} The associated Column instance.
     * @param oArgs.key {String} (deprecated) The key of the selected cell.
     */

    /**
     * Fired when a cell is unselected.
     *
     * @event cellUnselectEvent
     * @param oArgs.el {HTMLElement} The unselected TD element.
     * @param oArgs.record {YAHOO.widget.Record} The associated Record.
     * @param oArgs.column {YAHOO.widget.Column} The associated Column instance.
     * @param oArgs.key {String} (deprecated) The key of the unselected cell.

     */

    /**
     * Fired when a cell is highlighted.
     *
     * @event cellHighlightEvent
     * @param oArgs.el {HTMLElement} The highlighted TD element.
     * @param oArgs.record {YAHOO.widget.Record} The associated Record instance.
     * @param oArgs.column {YAHOO.widget.Column} The associated Column instance.
     * @param oArgs.key {String} (deprecated) The key of the highlighted cell.

     */

    /**
     * Fired when a cell is unhighlighted.
     *
     * @event cellUnhighlightEvent
     * @param oArgs.el {HTMLElement} The unhighlighted TD element.
     * @param oArgs.record {YAHOO.widget.Record} The associated Record instance.
     * @param oArgs.column {YAHOO.widget.Column} The associated Column instance.
     * @param oArgs.key {String} (deprecated) The key of the unhighlighted cell.

     */

    /**
     * Fired when all cell selections are cleared.
     *
     * @event unselectAllCellsEvent
     */

    /**
     * Fired when an Editor is activated.
     *
     * @event editorShowEvent
     * @param oArgs.editor {Object} The Editor object literal.
     */

    /**
     * Fired when an active Editor has a keydown.
     *
     * @event editorKeydownEvent
     * @param oArgs.editor {Object} The Editor object literal.
     * @param oArgs.event {HTMLEvent} The event object.
     */

    /**
     * Fired when Editor input is reverted.
     *
     * @event editorRevertEvent
     * @param oArgs.editor {Object} The Editor object literal.
     * @param oArgs.newData {Object} New data value from form input field.
     * @param oArgs.oldData {Object} Old data value.
     */

    /**
     * Fired when Editor input is saved.
     *
     * @event editorSaveEvent
     * @param oArgs.editor {Object} The Editor object literal.
     * @param oArgs.newData {Object} New data value from form input field.
     * @param oArgs.oldData {Object} Old data value.
     */

    /**
     * Fired when Editor input is canceled.
     *
     * @event editorCancelEvent
     * @param oArgs.editor {Object} The Editor object literal.
     */

    /**
     * Fired when an active Editor has a blur.
     *
     * @event editorBlurEvent
     * @param oArgs.editor {Object} The Editor object literal.
     */







    /**
     * Fired when a link is clicked.
     *
     * @event linkClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The A element.
     */

    /**
     * Fired when a BUTTON element is clicked.
     *
     * @event buttonClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The BUTTON element.
     */

    /**
     * Fired when a CHECKBOX element is clicked.
     *
     * @event checkboxClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The CHECKBOX element.
     */

    /*TODO
     * Fired when a SELECT element is changed.
     *
     * @event dropdownChangeEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The SELECT element.
     */

    /**
     * Fired when a RADIO element is clicked.
     *
     * @event radioClickEvent
     * @param oArgs.event {HTMLEvent} The event object.
     * @param oArgs.target {HTMLElement} The RADIO element.
     */


























/////////////////////////////////////////////////////////////////////////////
//
// Deprecated APIs
//
/////////////////////////////////////////////////////////////////////////////

/**
 * @method getBody
 * @deprecated Use getTbodyEl().
 */
getBody : function() {
    // Backward compatibility
    YAHOO.log("The method getBody() has been deprecated" +
            " in favor of getTbodyEl()", "warn", this.toString());
    return this.getTbodyEl();
},

/**
 * @method getCell
 * @deprecated Use getTdEl().
 */
getCell : function(index) {
    // Backward compatibility
    YAHOO.log("The method getCell() has been deprecated" +
            " in favor of getTdEl()", "warn", this.toString());
    return this.getTdEl(index);
},

/**
 * @method getRow
 * @deprecated Use getTrEl().
 */
getRow : function(index) {
    // Backward compatibility
    YAHOO.log("The method getRow() has been deprecated" +
            " in favor of getTrEl()", "warn", this.toString());
    return this.getTrEl(index);
},

/**
 * @method refreshView
 * @deprecated Use render.
 */
refreshView : function() {
    // Backward compatibility
    YAHOO.log("The method refreshView() has been deprecated" +
            " in favor of render()", "warn", this.toString());
    this.render();
},

/**
 * @method select
 * @deprecated Use selectRow.
 */
select : function(els) {
    // Backward compatibility
    YAHOO.log("The method select() has been deprecated" +
            " in favor of selectRow()", "warn", this.toString());
    if(!lang.isArray(els)) {
        els = [els];
    }
    for(var i=0; i<els.length; i++) {
        this.selectRow(els[i]);
    }
},

/**
 * @method updatePaginator
 * @deprecated Use Paginator class APIs.
 */
updatePaginator : function(oNewValues) {
    // Complete the set (default if not present)
    var oValidPaginator = this.get("paginator");

    var nOrigCurrentPage = oValidPaginator.currentPage;
    for(var param in oNewValues) {
        if(lang.hasOwnProperty(oValidPaginator, param)) {
            oValidPaginator[param] = oNewValues[param];
        }
    }

    oValidPaginator.totalRecords = this._oRecordSet.getLength();
    oValidPaginator.rowsThisPage = Math.min(oValidPaginator.rowsPerPage, oValidPaginator.totalRecords);
    oValidPaginator.totalPages = Math.ceil(oValidPaginator.totalRecords / oValidPaginator.rowsThisPage);
    if(isNaN(oValidPaginator.totalPages)) {
        oValidPaginator.totalPages = 0;
    }
    if(oValidPaginator.currentPage > oValidPaginator.totalPages) {
        if(oValidPaginator.totalPages < 1) {
            oValidPaginator.currentPage = 1;
        }
        else {
            oValidPaginator.currentPage = oValidPaginator.totalPages;
        }
    }

    if(oValidPaginator.currentPage !== nOrigCurrentPage) {
        oValidPaginator.startRecordIndex = (oValidPaginator.currentPage-1)*oValidPaginator.rowsPerPage;
    }


    this.set("paginator", oValidPaginator);
    return this.get("paginator");
},

/**
 * @method showPage
 * @deprecated Use Paginator class APIs.
 */
showPage : function(nPage) {
    var oPaginator = this.get('paginator');
    // Validate input
    if(!lang.isNumber(nPage) || (nPage < 1)) {
        if (oPaginator instanceof Pag) {
            if (!oPaginator.hasPage(nPage)) {
                nPage = 1;
            }
        } else if (nPage > oPaginator.totalPages) {
            nPage = 1;
        }
    }

    if (oPaginator instanceof Pag) {
        oPaginator.setPage(nPage);
    } else {
        this.updatePaginator({currentPage:nPage});
        this.render();
    }
},

/**
 * @method formatPaginators
 * @deprecated Use Paginator class APIs.
 */
formatPaginators : function() {
    var pag = this.get("paginator");
    if (pag instanceof Pag) {
        pag.update();
        return;
    }

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
    for(i=0; i<pag.dropdowns.length; i++) {
         if(pag.dropdownOptions) {
            dropdownEnabled = true;
            this.formatPaginatorDropdown(pag.dropdowns[i], pag.dropdownOptions);
        }
        else {
            pag.dropdowns[i].style.display = "none";
        }
    }

    // For Opera artifacting in dropdowns
    if(dropdownEnabled && ua.opera) {
        document.body.style += '';
    }
    YAHOO.log("Paginators formatted", "info", this.toString());
},

/**
 * @method formatPaginatorDropdown
 * @deprecated Use Paginator class APIs.
 */
formatPaginatorDropdown : function(elDropdown, dropdownOptions) {
    if(elDropdown && (elDropdown.ownerDocument == document)) {
        // Clear OPTION elements
        while (elDropdown.firstChild) {
            elDropdown.removeChild(elDropdown.firstChild);
        }

        // Create OPTION elements
        for(var j=0; j<dropdownOptions.length; j++) {
            var dropdownOption = dropdownOptions[j];
            var optionEl = document.createElement("option");
            optionEl.value = (lang.isValue(dropdownOption.value)) ?
                    dropdownOption.value : dropdownOption;
            optionEl.innerHTML = (lang.isValue(dropdownOption.text)) ?
                    dropdownOption.text : dropdownOption;
            optionEl = elDropdown.appendChild(optionEl);
        }

        var options = elDropdown.options;
        // Update dropdown's "selected" value
        if(options.length) {
            for(var i=options.length-1; i>-1; i--) {
                if((this.get("paginator").rowsPerPage + "") === options[i].value) {
                    options[i].selected = true;
                }
            }
        }

        // Show the dropdown
        elDropdown.style.display = "";
        return;
    }
    YAHOO.log("Could not update Paginator dropdown " + elDropdown, "error", this.toString());
},

/**
 * @method formatPaginatorLinks
 * @deprecated Use Paginator class APIs.
 */
formatPaginatorLinks : function(elContainer, nCurrentPage, nPageLinksStart, nPageLinksLength, nTotalPages) {
    if(elContainer && (elContainer.ownerDocument == document) &&
            lang.isNumber(nCurrentPage) && lang.isNumber(nPageLinksStart) &&
            lang.isNumber(nTotalPages)) {
        // Set up markup for first/last/previous/next
        var bIsFirstPage = (nCurrentPage == 1) ? true : false;
        var bIsLastPage = (nCurrentPage == nTotalPages) ? true : false;
        var sFirstLinkMarkup = (bIsFirstPage) ?
                " <span class=\"" + DT.CLASS_DISABLED +
                " " + DT.CLASS_FIRST + "\">&lt;&lt;</span> " :
                " <a href=\"#\" class=\"" + DT.CLASS_FIRST + "\">&lt;&lt;</a> ";
        var sPrevLinkMarkup = (bIsFirstPage) ?
                " <span class=\"" + DT.CLASS_DISABLED +
                " " + DT.CLASS_PREVIOUS + "\">&lt;</span> " :
                " <a href=\"#\" class=\"" + DT.CLASS_PREVIOUS + "\">&lt;</a> " ;
        var sNextLinkMarkup = (bIsLastPage) ?
                " <span class=\"" + DT.CLASS_DISABLED +
                " " + DT.CLASS_NEXT + "\">&gt;</span> " :
                " <a href=\"#\" class=\"" + DT.CLASS_NEXT + "\">&gt;</a> " ;
        var sLastLinkMarkup = (bIsLastPage) ?
                " <span class=\"" + DT.CLASS_DISABLED +
                " " + DT.CLASS_LAST +  "\">&gt;&gt;</span> " :
                " <a href=\"#\" class=\"" + DT.CLASS_LAST + "\">&gt;&gt;</a> ";

        // Start with first and previous
        var sMarkup = sFirstLinkMarkup + sPrevLinkMarkup;

        // Ok to show all links
        var nMaxLinks = nTotalPages;
        var nFirstLink = 1;
        var nLastLink = nTotalPages;

        if(nPageLinksLength > 0) {
        // Calculate how many links to show
            nMaxLinks = (nPageLinksStart+nPageLinksLength < nTotalPages) ?
                    nPageLinksStart+nPageLinksLength-1 : nTotalPages;

            // Try to keep the current page in the middle
            nFirstLink = (nCurrentPage - Math.floor(nMaxLinks/2) > 0) ? nCurrentPage - Math.floor(nMaxLinks/2) : 1;
            nLastLink = (nCurrentPage + Math.floor(nMaxLinks/2) <= nTotalPages) ? nCurrentPage + Math.floor(nMaxLinks/2) : nTotalPages;

            // Keep the last link in range
            if(nFirstLink === 1) {
                nLastLink = nMaxLinks;
            }
            // Keep the first link in range
            else if(nLastLink === nTotalPages) {
                nFirstLink = nTotalPages - nMaxLinks + 1;
            }

            // An even number of links can get funky
            if(nLastLink - nFirstLink === nMaxLinks) {
                nLastLink--;
            }
      }

        // Generate markup for each page
        for(var i=nFirstLink; i<=nLastLink; i++) {
            if(i != nCurrentPage) {
                sMarkup += " <a href=\"#\" class=\"" + DT.CLASS_PAGE + "\">" + i + "</a> ";
            }
            else {
                sMarkup += " <span class=\"" + DT.CLASS_SELECTED + "\">" + i + "</span>";
            }
        }
        sMarkup += sNextLinkMarkup + sLastLinkMarkup;
        elContainer.innerHTML = sMarkup;
        return;
    }
    YAHOO.log("Could not format Paginator links", "error", this.toString());
},

/**
 * @method _onPaginatorLinkClick
 * @private
 * @deprecated Use Paginator class APIs.
 */
_onPaginatorLinkClick : function(e, oSelf) {
    // Backward compatibility
    var elTarget = Ev.getTarget(e);
    var elTag = elTarget.nodeName.toLowerCase();

    if(oSelf._oCellEditor && oSelf._oCellEditor.isActive) {
        oSelf.fireEvent("editorBlurEvent", {editor:oSelf._oCellEditor});
    }

    while(elTarget && (elTag != "table")) {
        switch(elTag) {
            case "body":
                return;
            case "a":
                Ev.stopEvent(e);
                //TODO: after the showPage call, figure out which link
                //TODO: was clicked and reset focus to the new version of it
                //TODO: support multiple custom classnames
                switch(elTarget.className) {
                    case DT.CLASS_PAGE:
                        oSelf.showPage(parseInt(elTarget.innerHTML,10));
                        return;
                    case DT.CLASS_FIRST:
                        oSelf.showPage(1);
                        return;
                    case DT.CLASS_LAST:
                        oSelf.showPage(oSelf.get("paginator").totalPages);
                        return;
                    case DT.CLASS_PREVIOUS:
                        oSelf.showPage(oSelf.get("paginator").currentPage - 1);
                        return;
                    case DT.CLASS_NEXT:
                        oSelf.showPage(oSelf.get("paginator").currentPage + 1);
                        return;
                }
                break;
            default:
                return;
        }
        elTarget = elTarget.parentNode;
        if(elTarget) {
            elTag = elTarget.nodeName.toLowerCase();
        }
        else {
            return;
        }
    }
},

/**
 * @method _onPaginatorDropdownChange
 * @private
 * @deprecated Use Paginator class APIs.
 */
_onPaginatorDropdownChange : function(e, oSelf) {
    // Backward compatibility
    var elTarget = Ev.getTarget(e);
    var newValue = elTarget[elTarget.selectedIndex].value;

    var newRowsPerPage = lang.isValue(parseInt(newValue,10)) ? parseInt(newValue,10) : null;
    if(newRowsPerPage !== null) {
        var newStartRecordIndex = (oSelf.get("paginator").currentPage-1) * newRowsPerPage;
        oSelf.updatePaginator({rowsPerPage:newRowsPerPage, startRecordIndex:newStartRecordIndex});
        oSelf.render();
    }
    else {
        YAHOO.log("Could not paginate with " + newValue + " rows per page", "error", oSelf.toString());
    }
},

/**
 * @method onEventEditCell
 * @deprecated Use onEventShowCellEditor.
 */
onEventEditCell : function(oArgs) {
    // Backward compatibility
    YAHOO.log("The method onEventEditCell() has been deprecated" +
        " in favor of onEventShowCellEditor()", "warn", this.toString());
    this.onEventShowCellEditor(oArgs);
},

/**
 * @method onDataReturnReplaceRows
 * @deprecated Use onDataReturnInitializeTable.
 */
onDataReturnReplaceRows : function(sRequest, oResponse) {
    // Backward compatibility
    YAHOO.log("The method onDataReturnReplaceRows() has been deprecated" +
            " in favor of onDataReturnInitializeTable()", "warn", this.toString());
    this.onDataReturnInitializeTable(sRequest, oResponse);
}

/**
 * @event headerRowMouseoverEvent
 * @deprecated Use theadRowMouseoverEvent.
 */

/**
 * @event headerRowMouseoutEvent
 * @deprecated Use theadRowMouseoutEvent.
 */

/**
 * @event headerRowMousedownEvent
 * @deprecated Use theadRowMousedownEvent.
 */

/**
 * @event headerRowClickEvent
 * @deprecated Use theadRowClickEvent.
 */

/**
 * @event headerRowDblclickEvent
 * @deprecated Use theadRowDblclickEvent.
 */

/**
 * @event headerCellMouseoverEvent
 * @deprecated Use theadCellMouseoverEvent.
 */

/**
 * @event headerCellMouseoutEvent
 * @deprecated Use theadCellMouseoutEvent.
 */

/**
 * @event headerCellMousedownEvent
 * @deprecated Use theadCellMousedownEvent.
 */

/**
 * @event headerCellClickEvent
 * @deprecated Use theadCellClickEvent.
 */

/**
 * @event headerCellDblclickEvent
 * @deprecated Use theadCellDblclickEvent.
 */

/**
 * @event headerLabelMouseoverEvent
 * @deprecated Use theadLabelMouseoverEvent.
 */

/**
 * @event headerLabelMouseoutEvent
 * @deprecated Use theadLabelMouseoutEvent.
 */

/**
 * @event headerLabelMousedownEvent
 * @deprecated Use theadLabelMousedownEvent.
 */

/**
 * @event headerLabelClickEvent
 * @deprecated Use theadLabelClickEvent.
 */

/**
 * @event headerLabelDbllickEvent
 * @deprecated Use theadLabelDblclickEvent.
 */

});

/**
 * Alias for onDataReturnSetRows for backward compatibility
 * @method onDataReturnSetRecords
 * @deprecated Use onDataReturnSetRows
 */
DT.prototype.onDataReturnSetRecords = DT.prototype.onDataReturnSetRows;

})();
