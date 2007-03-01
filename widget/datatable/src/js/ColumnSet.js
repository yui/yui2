/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * The ColumnSet class defines and manages a DataTable's Columns,
 * including nested hierarchies and access to individual Column instances.
 *
 * @class ColumnSet
 * @uses YAHOO.util.EventProvider
 * @constructor
 * @param aHeaders {Object[]} Array of object literals that define header cells.
 */
YAHOO.widget.ColumnSet = function(aHeaders) {
//TODO: break out nested functions into private methods
    this._sName = "instance" + YAHOO.widget.ColumnSet._nCount;

    // Top-down tree representation of all Columns
    var tree = [];
    // Flat representation of all Columns
    var flat = [];
    // Flat representation of only Columns that display data
    var keys = [];
    // ID index of nested parent heirarchies for HEADERS attribute
    var headers = [];

    var nodelevel = -1;

    // Internal recursive function to parse Columns out of object literal defs
    var parseColumns = function(nodeList, parent) {
        nodelevel++;
        // A node level is an array of Columns
        if(!tree[nodelevel]) {
            tree[nodelevel] = [];
        }

        // Determine depth of descendants at this level for node's rowspan
        var nodeLevelMaxChildren = 0;
        var recurseChildren = function(nodeList) {
            var tmpMax = 0;
            for(var i=0; i<nodeList.length; i++) {
                if(nodeList[i].children) {
                    tmpMax++;
                    recurseChildren(nodeList[i].children);
                }
                if(tmpMax > nodeLevelMaxChildren) {
                    nodeLevelMaxChildren = tmpMax;
                }
            }
        };
        recurseChildren(nodeList);

        // Parse each node for attributes and any children
        for(var j=0; j<nodeList.length; j++) {
            // Instantiate a Column for each node
            var oColumn = new YAHOO.widget.Column(nodeList[j]);
            flat.push(oColumn);
            
            // Assign parent, if applicable
            if(parent) {
                oColumn._parent = parent;
            }

            // Start with default values
            oColumn._rowspan = 1;
            oColumn._colspan = 1;

            // Column may have children
            if(nodeList[j].children) {
                var children = nodeList[j].children;
                var length = children.length;
                
                // Cascade certain properties to children if not defined on their own
                for(var k=0; k<length; k++) {
                    var child = children[k];
                    if(oColumn.className && (child.className === undefined)) {
                        child.className = oColumn.className;
                    }
                    if(oColumn.editor && (child.editor === undefined)) {
                        child.editor = oColumn.editor;
                    }
                    if(oColumn.formatter && (child.formatter === undefined)) {
                        child.formatter = oColumn.formatter;
                    }
                    if(oColumn.parser && (child.parser === undefined)) {
                        child.parser = oColumn.parser;
                    }
                    if(oColumn.resizeable && (child.resizeable === undefined)) {
                        child.resizeable = oColumn.resizeable;
                    }
                    if(oColumn.type && (child.type === undefined)) {
                        child.type = oColumn.type;
                    }
                    if(oColumn.width && (child.width === undefined)) {
                        child.width = oColumn.width;
                    }
                }
                
                // Children increase colspan of the Column
                oColumn._colspan = length;

                // Children increase colspan of the Column's parent
                if (parent && parent._colspan) {
                    parent._colspan += length-1;
                    parent._children = [];
                    parent._children.push(oColumn);
                }
                
                // Children must also be parsed
                if(!tree[nodelevel+1]) {
                    tree[nodelevel+1] = [];
                }
               parseColumns(children, oColumn);
            }
            
            // This Column does not have children,
            // but other Columns at this level do
            else if(nodeLevelMaxChildren > 0) {
                // Children of siblings increase the rowspan of the Column
                oColumn._rowspan += nodeLevelMaxChildren;
                //if(oColumn.key) {
                    oColumn._index = keys.length;
                    keys.push(oColumn);
                //}
            }
            // This entire node level does not have any children
            else {
                //if(oColumn.key) {
                    oColumn._index = keys.length;
                    keys.push(oColumn);
                //}
            }

            // Add the Column to the top-down tree
            tree[nodelevel].push(oColumn);
        }
        nodelevel--;
    };

    // Do the parsing
    if(aHeaders.length > 0) {
        parseColumns(aHeaders);
    }

    // Store header nesting in an array
    var recurseAncestors = function(i, oColumn) {
        headers[i].push(oColumn._id);
        if(oColumn._parent) {
            recurseAncestors(i, oColumn._parent);
        }
    };
    for(var i=0; i<keys.length; i++) {
        headers[i] = [];
        recurseAncestors(i, keys[i]);
        headers[i] = headers[i].reverse();
        headers[i] = headers[i].join(" ");
    }

    this.tree = tree;
    this.flat = flat;
    this.keys = keys;
    this.headers = headers;
    
    YAHOO.widget.ColumnSet._nCount++;
    YAHOO.log("ColumnSet initialized", "info", this.toString());
};

/////////////////////////////////////////////////////////////////////////////
//
// Public member variables
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
YAHOO.widget.ColumnSet._nCount = 0;

/**
 * Unique instance name.
 *
 * @property _sName
 * @type String
 * @private
 */
YAHOO.widget.ColumnSet.prototype._sName = null;

/////////////////////////////////////////////////////////////////////////////
//
// Public member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Top-down tree representation of Column hierarchy.
 *
 * @property tree
 * @type YAHOO.widget.Column[]
 */
YAHOO.widget.ColumnSet.prototype.tree = null;

/**
 * Flattened representation of all Columns.
 *
 * @property flat
 * @type YAHOO.widget.Column[]
 * @default []
 */
YAHOO.widget.ColumnSet.prototype.flat = null;

/**
 * Array of Columns that map one-to-one to a table column.
 *
 * @property keys
 * @type YAHOO.widget.Column[]
 * @default []
 */
YAHOO.widget.ColumnSet.prototype.keys = null;

/**
 * ID index of nested parent heirarchies for HEADERS accessibility attribute.
 *
 * @property headers
 * @type String[]
 * @default []
 */
YAHOO.widget.ColumnSet.prototype.headers = null;

/////////////////////////////////////////////////////////////////////////////
//
// Public methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Public accessor to the unique name of the ColumnSet instance.
 *
 * @method toString
 * @return {String} Unique name of the ColumnSet instance.
 */

YAHOO.widget.ColumnSet.prototype.toString = function() {
    return "ColumnSet " + this._sName;
};

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * The Column class defines and manages attributes of DataTable Columns
 *
 *
 * @class Column
 * @constructor
 * @param oConfigs {Object} Object literal of configuration values.
 */
YAHOO.widget.Column = function(oConfigs) {
    // Internal variables
    this._id = "yui-dtcol"+YAHOO.widget.Column._nCount;
    
    // Object literal defines Column attributes
    if(typeof oConfigs == "object") {
        for(var sConfig in oConfigs) {
            if(sConfig) {
                this[sConfig] = oConfigs[sConfig];
            }
        }
    }
    
    YAHOO.widget.Column._nCount++;
};

/////////////////////////////////////////////////////////////////////////////
//
// Private member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Internal instance counter.
 *
 * @property _nCount
 * @type Number
 * @static
 * @default 0
 */
YAHOO.widget.Column._nCount = 0;


/**
 * Unique ID, also assigned as DOM ID.
 *
 * @property _id
 * @type String
 * @private
 */
YAHOO.widget.Column.prototype._id = null;

/**
 * Reference to Column's index within its ColumnSet's key array, or null if not applicable.
 *
 * @property _index
 * @type Number
 * @private
 */
YAHOO.widget.Column.prototype._index = null;

/**
 * Number of table cells the Column spans.
 *
 * @property _colspan
 * @type Number
 * @private
 */
YAHOO.widget.Column.prototype._colspan = 1;

/**
 * Number of table rows the Column spans.
 *
 * @property _rowspan
 * @type Number
 * @private
 */
YAHOO.widget.Column.prototype._rowspan = 1;

/**
 * Column's parent, or null.
 *
 * @property _parent
 * @type YAHOO.widget.Column
 * @private
 */
YAHOO.widget.Column.prototype._parent = null;

/**
 * Array of Column's chilren, or null.
 *
 * @property _children
 * @type YAHOO.widget.Column[]
 * @private
 */
YAHOO.widget.Column.prototype._children = null;

//TODO: clean these up

/**
 * Current offsetWidth of the Column (in pixels).
 *
 * @property _width
 * @type Number
 * @private
 */
YAHOO.widget.Column.prototype._width = null;

/**
 * Minimum width the Column can support (in pixels). Value is populated only if table
 * is fixedwidth, null otherwise.
 *
 * @property _minWidth
 * @type Number
 * @private
 */
YAHOO.widget.Column.prototype._minWidth = null;

/////////////////////////////////////////////////////////////////////////////
//
// Public member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Associated database field, or null.
 *
 * @property key
 * @type String
 */
YAHOO.widget.Column.prototype.key = null;

/**
 * Text or HTML for display in Column's assocated TH element.
 *
 * @property text
 * @type String
 */
YAHOO.widget.Column.prototype.text = null;

/**
 * Data types: "string", "number", "date", "currency", "checkbox", "select",
 * "email", "link".
 *
 * @property type
 * @type String
 * @default "string"
 */
YAHOO.widget.Column.prototype.type = "string";

/**
 * Column head cell ABBR for accessibility.
 *
 * @property abbr
 * @type String
 */
YAHOO.widget.Column.prototype.abbr = null;

/**
 * Array of object literals that define children (nested headers) of a Column.
 *
 * @property children
 * @type Object[]
 */
YAHOO.widget.Column.prototype.children = null;

/**
 * Column width.
 *
 * @property width
 * @type String
 */
YAHOO.widget.Column.prototype.width = null;

/**
 * Custom CSS class to be applied to every cell in the Column.
 *
 * @property className
 * @type String
 */
YAHOO.widget.Column.prototype.className = null;

/**
 * Defines a custom format function for Column, otherwise default is used,
 * according to Column type.
 *
 * @property formatter
 * @type HTMLFunction
 */
YAHOO.widget.Column.prototype.formatter = null;

/**
 * Defines a custom parse function for Column, otherwise default is used,
 * according to Column type.
 *
 * @property parser
 * @type HTMLFunction
 */
YAHOO.widget.Column.prototype.parser = null;

/**
 * Defines the type of editor for Column, otherwise Column is not editable.
 *
 * @property editor
 * @type String
 */
YAHOO.widget.Column.prototype.editor = null;

/**
 * True if Column is resizeable, false otherwise.
 *
 * @property resizeable
 * @type Boolean
 * @default false
 */
YAHOO.widget.Column.prototype.resizeable = false;

/**
 * True if Column is sortable, false otherwise.
 *
 * @property sortable
 * @type Boolean
 * @default false
 */
YAHOO.widget.Column.prototype.sortable = false;

/**
 * Custom sort handler to arrange Column in descending order.
 *
 * @property sortOptions.descFunction
 * @type Function
 * @default null
 */
YAHOO.widget.Column.prototype.descFunction = null;

/**
 * Custom sort handler to arrange Column in ascending order.
 *
 * @property sortOptions.ascFunction
 * @type Function
 * @default null
 */
YAHOO.widget.Column.prototype.ascFunction = null;















/////////////////////////////////////////////////////////////////////////////
//
// Public methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Public accessor returns Column's ID string.
 *
 * @method getId
 * @return {String} Column's ID string.
 */
YAHOO.widget.Column.prototype.getId = function() {
    return this._id;
};

/**
 * Public accessor returns Column's colspan number.
 *
 * @method getColSpan
 * @return {Number} Column's colspan number.
 */
YAHOO.widget.Column.prototype.getColSpan = function() {
    return this._colspan;
};

/**
 * Public accessor returns Column's rowspan number.
 *
 * @method getRowSpan
 * @return {Number} Column's rowspan number.
 */
YAHOO.widget.Column.prototype.getRowSpan = function() {
    return this._rowspan;
};


/**
 * Outputs markup into the given TD based on given Record.
 *
 * @method format
 * @param elCell {HTMLElement} TD to format for display.
 * @param oRecord {YAHOO.widget.Record} Record that holds data for the row.
 * @return {HTML} Markup.
 */
YAHOO.widget.Column.prototype.format = function(elCell,oRecord) {
    var oData = (this.key) ? oRecord[this.key] : null;
    if(this.formatter) {
        this.formatter(elCell, oRecord, this, oData);
    }
    else {
        var type = this.type;
        var markup = "";
        var classname = "";
        switch(type) {
            case "checkbox":
                YAHOO.widget.Column.formatCheckbox(elCell, oRecord, this, oData);
                classname = YAHOO.widget.DataTable.CLASS_CHECKBOX;
                break;
            case "currency":
                YAHOO.widget.Column.formatCurrency(elCell, oRecord, this, oData);
                classname = YAHOO.widget.DataTable.CLASS_CURRENCY;
                break;
            case "date":
                YAHOO.widget.Column.formatDate(elCell, oRecord, this, oData);
                classname = YAHOO.widget.DataTable.CLASS_DATE;
                break;
            case "email":
                YAHOO.widget.Column.formatEmail(elCell, oRecord, this, oData);
                classname = YAHOO.widget.DataTable.CLASS_EMAIL;
                break;
            case "link":
                YAHOO.widget.Column.formatLink(elCell, oRecord, this, oData);
                classname = YAHOO.widget.DataTable.CLASS_LINK;
                break;
            case "number":
                YAHOO.widget.Column.formatNumber(elCell, oRecord, this, oData);
                classname = YAHOO.widget.DataTable.CLASS_NUMBER;
                break;
            case "select":
                YAHOO.widget.Column.formatSelect(elCell, oRecord, this, oData);
                classname = YAHOO.widget.DataTable.CLASS_SELECT;
                break;
           default:
                elCell.innerHTML = (oData) ? oData.toString() : "";
                //elCell.innerHTML = (oData) ? "<a href=\"#\">"+oData.toString()+"</a>" : "";
                classname = YAHOO.widget.DataTable.CLASS_STRING;
                break;
        }

        YAHOO.util.Dom.addClass(elCell, classname);
        if(this.className) {
            YAHOO.util.Dom.addClass(elCell, this.className);
        }
    }
    
    if(this.editor) {
        YAHOO.util.Dom.addClass(elCell,YAHOO.widget.DataTable.CLASS_EDITABLE);
    }
};


/**
 * Formats cells in Columns of type "checkbox".
 *
 * @method formatCheckbox
 * @param elCell {HTMLElement} Table cell element.
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @param oData {Object} Data value for the cell, or null
 * @static
 */
YAHOO.widget.Column.formatCheckbox = function(elCell, oRecord, oColumn, oData) {
    var bChecked = oData;
    bChecked = (bChecked) ? " checked" : "";
    elCell.innerHTML = "<input type=\"checkbox\"" + bChecked +
            " class=\"" + YAHOO.widget.DataTable.CLASS_CHECKBOX + "\">";
};

/**
 * Formats cells in Columns of type "currency". Can be overridden for custom formatting.
 *
 * @method formatCurrency
 * @param elCell {HTMLElement} Table cell element.
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @param oData {Object} Data value for the cell, or null
 * @static
 */
YAHOO.widget.Column.formatCurrency = function(elCell, oRecord, oColumn, oData) {
    // Make it dollars
    var nAmount = oData;
    var markup;
        if((nAmount !== undefined) && (nAmount !== null) && !isNaN(parseFloat(nAmount))) {
             // Round to the penny
             nAmount = Math.round(nAmount*100)/100;
             markup = "$"+nAmount;

            // Normalize digits
            var dotIndex = markup.indexOf(".");
            if(dotIndex < 0) {
                markup += ".00";
            }
            else {
                while(dotIndex > markup.length-3) {
                    markup += "0";
                }
            }
        }
        else {
            markup = "";
        }
        elCell.innerHTML = markup;
};

/**
 * Formats cells in Columns of type "date".
 *
 * @method formatDate
 * @param elCell {HTMLElement} Table cell element.
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @param oData {Object} Data value for the cell, or null
 * @static
 */
YAHOO.widget.Column.formatDate = function(elCell, oRecord, oColumn, oData) {
    var oDate = oData;
    if(oDate) {
        elCell.innerHTML = oDate.getMonth() + "/" + oDate.getDate()  + "/" + oDate.getFullYear();
    }
    else {
        elCell.innerHTML = "";
    }
};

/**
 * Formats cells in Columns of type "email".
 *
 * @method formatEmail
 * @param elCell {HTMLElement} Table cell element.
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @param oData {Object} Data value for the cell, or null
 * @static
 */
YAHOO.widget.Column.formatEmail = function(elCell, oRecord, oColumn, oData) {
    var sEmail = oData;
    if(sEmail) {
        elCell.innerHTML = "<a href=\"mailto:" + sEmail + "\">" + sEmail + "</a>";
    }
    else {
        elCell.innerHTML = "";
    }
};

/**
 * Formats cells in Columns of type "link".
 *
 * @method formatLink
 * @param elCell {HTMLElement} Table cell element.
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @param oData {Object} Data value for the cell, or null
 * @static
 */
YAHOO.widget.Column.formatLink = function(elCell, oRecord, oColumn, oData) {
    var sLink = oData;
    if(sLink) {
        elCell.innerHTML = "<a href=\"" + sLink + "\">" + sLink + "</a>";
    }
    else {
        elCell.innerHTML = "";
    }
};

/**
 * Formats cells in Columns of type "number".
 *
 * @method formatNumber
 * @param elCell {HTMLElement} Table cell element.
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @param oData {Object} Data value for the cell, or null
 * @static
 */
YAHOO.widget.Column.formatNumber = function(elCell, oRecord, oColumn, oData) {
    var nNumber = oData;
    if((nNumber !== undefined) && (nNumber !== null)) {
        elCell.innerHTML = nNumber.toString();
    }
    else {
        elCell.innerHTML = "";
    }
};

/**
 * Formats cells in Columns of type "select".
 *
 * @method formatSelect
 * @param elCell {HTMLElement} Table cell element.
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @param oData {Object} Data value for the cell, or null
 * @static
 */
YAHOO.widget.Column.formatSelect = function(elCell, oRecord, oColumn, oData) {
    var selectedValue = oData;
    var options = oColumn.selectOptions;

    var markup = "<select>";
    if(options) {
        for(var i=0; i<options.length; i++) {
            var option = options[i];
            markup += "<option value=\"" + option + "\"";
            if(selectedValue === option) {
                markup += " selected";
            }
            markup += ">" + option + "</option>";
        }
    }
    else {
        if(selectedValue) {
            markup += "<option value=\"" + selectedValue + "\" selected>" + selectedValue + "</option>";
        }
    }
    markup += "</select>";
    elCell.innerHTML = markup;
};

/**
 * Takes innerHTML from TD and parses out data for storage in RecordSet.
 *
 * @method parse
 * @param sMarkup {String} The TD's innerHTML value.
 * @return {Object} Data.
 */
YAHOO.widget.Column.prototype.parse = function(sMarkup) {
    if(this.parser) {
        return this.parser(sMarkup);
    }
    else {
        var data = null;
        switch(this.type) {
            case "checkbox":
                data = YAHOO.widget.Column.parseCheckbox(sMarkup);
                break;
            case "currency":
                data = YAHOO.widget.Column.parseCurrency(sMarkup);
                break;
            case "date":
                data = YAHOO.widget.Column.parseDate(sMarkup);
                break;
            case "number":
                data = YAHOO.widget.Column.parseNumber(sMarkup);
                break;
            case "select":
                data = YAHOO.widget.Column.parseSelect(sMarkup);
                break;
           default:
                if(sMarkup) {
                    data = sMarkup;
                }
                break;
        }
        return data;
    }
};

/**
 * Default parse function for Columns of type "checkbox" takes markup and
 * extracts data. Can be overridden for custom parsing.
 *
 * @method parseCheckbox
 * @param sMarkup
 * @return {bChecked} True if checkbox is checked.
 */
YAHOO.widget.Column.parseCheckbox = function(sMarkup) {
    return (sMarkup.indexOf("checked") < 0) ? false : true;
};

/**
 * Default parse function for Columns of type "currency" takes markup and
 * extracts data. Can be overridden for custom parsing.
 *
 * @method parseCurrency
 * @param sMarkup
 * @return {nAmount} Floating point amount.
 */
YAHOO.widget.Column.parseCurrency = function(sMarkup) {
    return parseFloat(sMarkup.substring(1));
};

/**
 * Default parse function for Columns of type "date" takes markup and extracts
 * data. Can be overridden for custom parsing.
 *
 * @method parseDate
 * @param sMarkup
 * @return {oDate} Date instance.
 */
YAHOO.widget.Column.parseDate = function(sMarkup) {
    var mm = sMarkup.substring(0,sMarkup.indexOf("/"));
    sMarkup = sMarkup.substring(sMarkup.indexOf("/")+1);
    var dd = sMarkup.substring(0,sMarkup.indexOf("/"));
    var yy = sMarkup.substring(sMarkup.indexOf("/")+1);
    return new Date(yy, mm, dd);
};

/**
 * Default parse function for Columns of type "number" takes markup and extracts
 * data. Can be overridden for custom parsing.
 *
 * @method parseNumber
 * @param sMarkup
 * @return {nNumber} Number.
 */
YAHOO.widget.Column.parseNumber = function(sMarkup) {
    return parseFloat(sMarkup);
};

/**
 * Default parse function for Columns of type "select" takes markup and extracts
 * data. Can be overridden for custom parsing.
 *
 * @method parseSelect
 * @param sMarkup
 * @return {sValue} Value of selected option.
 */
YAHOO.widget.Column.parseSelect = function(sMarkup) {
    //return (sMarkup.indexOf("checked") < 0) ? false : true;
};

/**
 * Outputs editor markup into the given TD based on given Record.
 *
 * @method showEditor
 * @param elCell {HTMLElement} The cell to edit.
 * @param oRecord {YAHOO.widget.Record} The DataTable Record of the cell.
 * @return YAHOO.widget.ColumnEditor
 */
YAHOO.widget.Column.prototype.getEditor = function(elCell, oRecord) {
//Sync up the arg signature for ColumnEditor constructor and show()
    var oEditor = this.editor;
    if(oEditor.constructor == String) {
        oEditor = new YAHOO.widget.ColumnEditor(this.editor);
        oEditor.show(elCell, oRecord, this);
        this.editor = oEditor;
    }
    else if(oEditor instanceof YAHOO.widget.ColumnEditor) {
        oEditor.show(elCell, oRecord, this);
    }
    return oEditor;
};


/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * The ColumnEditor defines and manages inline editing functionality for a
 * DataTable Column.
 *
 * @class ColumnEditor
 * @constructor
 * @param elCell {HTMLElement} The cell to edit.
 * @param oRecord {YAHOO.widget.Record} The DataTable Record of the cell.
 * @param oColumn {YAHOO.widget.Column} The DataTable Column of the cell.
 * @parem sType {String} Type identifier
 */
YAHOO.widget.ColumnEditor = function(sType) {
    this.type = sType;

    //TODO: make sure ColumnEditors get destroyed if widget gets destroyed
    // Works better to attach ColumnEditor to document.body
    // rather than the DataTable container
    // elTable comes in as a cell. Traverse up DOM to find the table.
    // TODO: safety net in case table is never found.
    //while(elCell.nodeName.toLowerCase() != "table") {
    //    elCell = elCell.parentNode;
    //}
    //this.tableContainer = elCell.parentNode;
    
    var container = document.body.appendChild(document.createElement("div"));//this.tableContainer.appendChild(document.createElement("div"));
    container.style.position = "absolute";
    container.style.zIndex = 9000;
    container.id = "yui-dt-coled" + YAHOO.widget.ColumnEditor._nCount;
    this.container = container;

    switch(this.type) {
        case "textbox":
            this.createTextboxEditor();
            break;
        case "textarea":
            this.createTextareaEditor();
            break;
        default:
            break;
    }

    YAHOO.widget.ColumnEditor._nCount++;
};



/////////////////////////////////////////////////////////////////////////////
//
// Private member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Internal instance counter.
 *
 * @property _nCount
 * @type Number
 * @static
 * @default 0
 */
YAHOO.widget.ColumnEditor._nCount =0;

/////////////////////////////////////////////////////////////////////////////
//
// Public member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Reference to the container DOM element for the ColumnEditor.
 *
 * @property container
 * @type HTMLElement
 */
YAHOO.widget.ColumnEditor.prototype.container = null;

/**
 * Reference to the ColumnEditor's Column instance.
 *
 * @property column
 * @type YAHOO.widget.Column
 */
YAHOO.widget.ColumnEditor.prototype.column = null;

/**
 * Type of editor: "textbox", etc.
 *
 * @property type
 * @type String
 */
YAHOO.widget.ColumnEditor.prototype.type = null;



/**
 * Reference to form element(s) of the ColumnEditor.
 *
 * @property input
 * @type HTMLElement || HTMLElement[]
 */
YAHOO.widget.ColumnEditor.prototype.input = null;

/////////////////////////////////////////////////////////////////////////////
//
// Public methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Shows ColumnEditor.
 *
 * @method show
 * @param elCell {HTMLElement} The cell to edit.
 * @param oRecord {YAHOO.widget.Record} The DataTable Record of the cell.
 * @param oColumn {YAHOO.widget.Column} The DataTable Column of the cell.
 */
YAHOO.widget.ColumnEditor.prototype.show = function(elCell, oRecord, oColumn) {
    this.cell = elCell;
    this.record = oRecord;
    this.column = oColumn;
    switch(this.type) {
        case "textbox":
            this.showTextboxEditor(elCell, oRecord, oColumn);
            break;
        case "textarea":
            this.showTextareaEditor(elCell, oRecord, oColumn);
            break;
        default:
            break;
    }
};

/**
 * Returns ColumnEditor data value.
 *
 * @method getValue
 * @return Object
 */
YAHOO.widget.ColumnEditor.prototype.getValue = function() {
    var value;
    switch(this.type) {
        case "textbox":
            value = this.getTextboxEditorValue();
            break;
        case "textarea":
            value = this.getTextareaEditorValue();
            break;
        default:
            break;
    }
    return value;
};

/**
 * Creates a textbox editor in the DOM.
 *
 * @method createTextboxEditor
 * @return {HTML} ???
 */
YAHOO.widget.ColumnEditor.prototype.createTextboxEditor = function() {
    var elTextbox = this.container.appendChild(document.createElement("input"));
    // For FF bug 236791
    elTextbox.setAttribute("autocomplete","off");
    this.input = elTextbox;
};

/**
 * Creates a textarea editor in the DOM.
 *
 * @method createTextareaEditor
 * @return {HTML} ???
 */
YAHOO.widget.ColumnEditor.prototype.createTextareaEditor = function() {
    var elTextarea = this.container.appendChild(document.createElement("textarea"));
    this.input = elTextarea;
};

/**
 * Shows ColumnEditor
 *
 * @method showTextboxEditor
 * @param elCell {HTMLElement} The cell to edit.
 * @param oRecord {YAHOO.widget.Record} The DataTable Record of the cell.
 * @param oColumn {YAHOO.widget.Column} The DataTable Column of the cell.
 */
YAHOO.widget.ColumnEditor.prototype.showTextboxEditor = function(elCell, oRecord, oColumn) {
    // Size and value
    this.input.style.width = (parseInt(elCell.offsetWidth,10)-7) + "px";
    this.input.style.height = (parseInt(elCell.offsetHeight,10)-7) + "px";
    this.input.value = elCell.innerHTML;

    // Position and show
    var x,y;
    
    // Don't use getXY for Opera
    if(navigator.userAgent.toLowerCase().indexOf("opera") != -1) {
        x = elCell.offsetLeft;
        y = elCell.offsetTop;
        while(elCell.offsetParent) {
            x += elCell.offsetParent.offsetLeft;
            y += elCell.offsetParent.offsetTop;
            elCell = elCell.offsetParent;
        }
    }
    else {
        var xy = YAHOO.util.Dom.getXY(elCell);
        x = parseInt(YAHOO.util.Dom.getX(elCell),10);//xy[0] + 1;
        y = parseInt(YAHOO.util.Dom.getY(elCell),10);//xy[1] + 1;
    }
    this.container.style.left = x + "px";
    this.container.style.top = y + "px";
    this.container.style.display = "block";

    this.input.tabIndex = 0;
    this.input.focus();
    this.input.select();
};

/**
 * Shows ColumnEditor
 *
 * @method showTextareaEditor
 * @param elCell {HTMLElement} The cell to edit.
 * @param oRecord {YAHOO.widget.Record} The DataTable Record of the cell.
 * @param oColumn {YAHOO.widget.Column} The DataTable Column of the cell.
 */
YAHOO.widget.ColumnEditor.prototype.showTextareaEditor = function(elCell, oRecord, oColumn) {
    // Size and value
    this.input.style.width = (parseInt(elCell.offsetWidth,10)-7) + "px";
    this.input.style.height = 4*(parseInt(elCell.offsetHeight,10)-7) + "px";
    this.input.value = elCell.innerHTML;

    // Position and show
    var x,y;

    // Don't use getXY for Opera
    if(navigator.userAgent.toLowerCase().indexOf("opera") != -1) {
        x = elCell.offsetLeft;
        y = elCell.offsetTop;
        while(elCell.offsetParent) {
            x += elCell.offsetParent.offsetLeft;
            y += elCell.offsetParent.offsetTop;
            elCell = elCell.offsetParent;
        }
    }
    else {
        var xy = YAHOO.util.Dom.getXY(elCell);
        x = parseInt(YAHOO.util.Dom.getX(elCell),10);//xy[0] + 1;
        y = parseInt(YAHOO.util.Dom.getY(elCell),10);//xy[1] + 1;
    }
    this.container.style.left = x + "px";
    this.container.style.top = y + "px";
    this.container.style.display = "block";

    this.input.tabIndex = 0;
    this.input.focus();
    this.input.select();
};

/**
 * Hides ColumnEditor
 *
 * @method hide
 */
YAHOO.widget.ColumnEditor.prototype.hide = function() {
    this.input.tabIndex = -1;
    this.container.style.display = "none";
};

/**
 * Returns ColumnEditor value
 *
 * @method getTextboxEditorValue
 * @return String
 */
YAHOO.widget.ColumnEditor.prototype.getTextboxEditorValue = function() {
    return this.input.value;
};

/**
 * Returns ColumnEditor value
 *
 * @method getTextareaEditorValue
 * @return String
 */
YAHOO.widget.ColumnEditor.prototype.getTextareaEditorValue = function() {
    return this.input.value;
};

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * Sort static utility to support Column sorting.
 *
 * @class Sort
 * @static
 */
YAHOO.util.Sort = {
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
    compareAsc: function(a, b) {
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
    },

    /**
     * Comparator function for sort in descending order. String sorting is case insensitive.
     *
     * @method compareDesc
     * @param a {object} First sort argument.
     * @param b {object} Second sort argument.
     */
    compareDesc: function(a, b) {
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
    }
};

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * WidthResizer subclasses DragDrop to support resizeable Columns.
 *
 * @class WidthResizer
 * @extends YAHOO.util.DragDrop
 * @constructor
 * @param colElId {string} ID of the Column's TH element being resized
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

if(YAHOO.util.DD) {
    YAHOO.extend(YAHOO.util.WidthResizer, YAHOO.util.DD);
}

/////////////////////////////////////////////////////////////////////////////
//
// Public DOM event handlers
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Handles mousedown events on the Column resizer.
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
 * Handles mouseup events on the Column resizer.
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

    //TODO: set new ColumnSet width values
    this.datatable.fireEvent("columnResizeEvent",{datatable:this.datatable,target:YAHOO.util.Dom.get(this.id)});
};

/**
 * Handles drag events on the Column resizer.
 *
 * @method onDrag
 * @param e {string} The drag event
 */
YAHOO.util.WidthResizer.prototype.onDrag = function(e) {
    var newPos = YAHOO.util.Dom.getX(this.getDragEl());//YAHOO.log("newpos:"+newPos,"warn");//YAHOO.util.Event.getPageX(e);
    var offsetX = newPos - this.startPos;//YAHOO.log("offset:"+offsetX,"warn");
    //YAHOO.log("startwidth:"+this.startWidth + " and offset:"+offsetX,"warn");
    var newWidth = this.startWidth + offsetX;//YAHOO.log("newwidth:"+newWidth,"warn");

    if(newWidth < this.minWidth) {
        newWidth = this.minWidth;
    }

    // Resize the Column
    var oDataTable = this.datatable;
    var elCell = this.cell;

    //YAHOO.log("newwidth" + newWidth,"warn");
    //YAHOO.log(newWidth + " AND "+ elColumn.offsetWidth + " AND " + elColumn.id,"warn");

    // Resize the other Columns
    if(oDataTable.fixedwidth) {
        // Moving right or left?
        var sib = elCell.nextSibling;
        //var sibIndex = elCell.index + 1;
        var sibnewwidth = sib.offsetWidth - offsetX;
        if(sibnewwidth < this.sibMinWidth) {
            sibnewwidth = this.sibMinWidth;
        }

        //TODO: how else to cycle through all the Columns without having to use an index property?
        for(var i=0; i<oDataTable._oColumnSet.length; i++) {
            if((i != elCell.index) &&  (i!=sibIndex)) {
                YAHOO.util.Dom.get(oDataTable._oColumnSet.keys[i].id).style.width = oDataTable._oColumnSet.keys[i].width + "px";
            }
        }
        sib.style.width = sibnewwidth;
        elCell.style.width = newWidth + "px";
        //oDataTable._oColumnSet.flat[sibIndex].width = sibnewwidth;
        //oDataTable._oColumnSet.flat[elCell.index].width = newWidth;

    }
    else {
        elCell.style.width = newWidth + "px";
    }
};



