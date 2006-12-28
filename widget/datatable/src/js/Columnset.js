/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * The Column class defines and manages attributes of DataTable Columns,
 * including certain DOM attributes of the associated TH.
 *
 *
 * @class Column
 * @constructor
 * @param nIndex {Number} Index of column.
 * @param oConfigs {Object} Object literal of configuration values.
 */
YAHOO.widget.Column = function(nIndex, oConfigs) {
    this.index = nIndex;
    if(typeof oConfigs == "object") {
        for(var sConfig in oConfigs) {
            if(sConfig) {
                this[sConfig] = oConfigs[sConfig];
            }
        }
    }
    this.id = "yui-dt-col"+YAHOO.widget.Column._nCount;
    YAHOO.widget.Column._nCount++;
};

/////////////////////////////////////////////////////////////////////////////
//
// Public member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Unique DOM id attribute.
 *
 * @property id
 * @type String
 */
YAHOO.widget.Column.prototype.id = null;

/**
 * Current offsetWidth of the column (in pixels).
 *
 * @property width
 * @type Number
 */
YAHOO.widget.Column.prototype.width = null;

/**
 * Minimum width the column can support (in pixels). Value is populated only if table
 * is fixedwidth, null otherwise.
 *
 * @property minWidth
 * @type Number
 */
YAHOO.widget.Column.prototype.minWidth = null;

/**
 * Number of table cells the Column spans.
 *
 * @property colspan
 * @type Number
 * @default 1
 */
YAHOO.widget.Column.prototype.colspan = 1;

/**
 * Number of table rows the Column spans.
 *
 * @property colspan
 * @type Number
 * @default 1
 */
YAHOO.widget.Column.prototype.rowspan = 1;

/**
 * Column's index within its Columnset's flat array.
 *
 * @property index
 * @type Number
 */
YAHOO.widget.Column.prototype.index = null;

/**
 * Column's chilren within its Columnset's tree hierarchy, or null.
 *
 * @property children
 * @type YAHOO.widget.Column
 */
YAHOO.widget.Column.prototype.children = null;

/**
 * Column's parent within its Columnset's tree hierarchy, or null.
 *
 * @property parent
 * @type YAHOO.widget.Column
 */
YAHOO.widget.Column.prototype.parent = null;

/**
 * Column's previous sibling within its Columnset's tree hierarchy, or null.
 *
 * @property prevSibling
 * @type YAHOO.widget.Column
 */
YAHOO.widget.Column.prototype.prevSibling = null;

/**
 * Column's next sibling within its Columnset's tree hierarchy, or null.
 *
 * @property nextSibling
 * @type YAHOO.widget.Column
 */
YAHOO.widget.Column.prototype.nextSibling = null;

/**
 * True if column is last. //TODO: do this programmatically
 *
 * @property isLast
 * @type Boolean
 * @default false
 */
YAHOO.widget.Column.prototype.isLast = false;

/**
 * Associated database column.
 *
 * @property key
 * @type String
 */
YAHOO.widget.Column.prototype.key = null;

/**
 * Data type: "string", "int", "float", "date", "object", "array", "boolean".
 *
 * @property type
 * @type String
 * @default "string"
 */
YAHOO.widget.Column.prototype.type = "string";

/**
 * Text or HTML for display in the column head cell.
 *
 * @property text
 * @type String
 */
YAHOO.widget.Column.prototype.text = null;

/**
 * If column is editable, defines the type of editor, otherwise null.
 *
 * @property editable
 * @type String
 * @default false
 */
YAHOO.widget.Column.prototype.editable = null;

/**
 * True if column is resizeable, false otherwise.
 *
 * @property resizeable
 * @type Boolean
 * @default false
 */
YAHOO.widget.Column.prototype.resizeable = false;

/**
 * True if column is sortable, false otherwise.
 *
 * @property sortable
 * @type Boolean
 * @default false
 */
YAHOO.widget.Column.prototype.sortable = false;

/**
 * True if column is currently sorted in ascending order.
 *
 * @property _currentSortDesc
 * @type Boolean
 * @default null
 */
YAHOO.widget.Column.prototype.currentlyAsc = null;

/**
 * True if unsorted column should get arranged in descending order, (i.e., dates that
 * by default should get sorted in reverse chronological order).
 *
 * @property sortDesc
 * @type Boolean
 * @default false
 */
YAHOO.widget.Column.prototype.sortDesc = false;

/**
 * Custom sort handler to arrange column in descending order.
 *
 * @property sortDescHandler
 * @type Function
 * @default null
 */
YAHOO.widget.Column.prototype.sortDescHandler = null;

/**
 * Custom sort handler to arrange column in ascending order.
 *
 * @property sortAscHandler
 * @type Function
 * @default null
 */
YAHOO.widget.Column.prototype.sortAscHandler = null;

/////////////////////////////////////////////////////////////////////////////
//
// Public methods
//
/////////////////////////////////////////////////////////////////////////////

 /**
 * Default checkbox parser for columns of type "checkbox". Can be overridden for custom
 * checkbox parsing.
 *
 * @method checkboxParser
 * @param sMarkup
 * @return {bChecked} True if checkbox is checked.
 */
YAHOO.widget.Column.prototype.checkboxParser = function(sMarkup) {
    return (sMarkup.indexOf("checked") < 0) ? false : true;
};

 /**
 * Default currency parser for columns of type "currency". Can be overridden for custom
 * currency parsing.
 *
 * @method currencyParser
 * @param sMarkup
 * @return {nAmount} Floating point amount.
 */
YAHOO.widget.Column.prototype.currencyParser = function(sMarkup) {
    return parseFloat(sMarkup.substring(1));
};

 /**
 * Custom parser for columns of type "custom". Should be overridden for custom parsing.
 *
 * @method customParser
 * @param sMarkup
 * @return {oData} Data.
 */
YAHOO.widget.Column.prototype.customParser = function(sMarkup) {
    return sMarkup;
};

 /**
 * Default date parser for columns of type "date". Can be overridden for custom date
 * parsing.
 *
 * @method dateParser
 * @param sMarkup
 * @return {oDate} Date instance.
 */
YAHOO.widget.Column.prototype.dateParser = function(sMarkup) {
    var mm = sMarkup.substring(0,sMarkup.indexOf("/"));
    sMarkup = sMarkup.substring(sMarkup.indexOf("/")+1);
    var dd = sMarkup.substring(0,sMarkup.indexOf("/"));
    var yy = sMarkup.substring(sMarkup.indexOf("/")+1);
    return new Date(yy, mm, dd);
};

 /**
 * Default float parser for columns of type "float". Can be overridden for custom float
 * parsing.
 *
 * @method floatParser
 * @param sMarkup
 * @return {nFloat} Float number.
 */
YAHOO.widget.Column.prototype.floatParser = function(sMarkup) {
    return parseFloat(sMarkup);
};

 /**
 * Default HTML parser for columns of type "html". Can be overridden for custom html parsing.
 *
 * @method htmlParser
 * @param sMarkup
 * @return {sMarkup} HTML markup.
 */
YAHOO.widget.Column.prototype.htmlParser = function(sMarkup) {
    return sMarkup;
};

 /**
 * Default int parser for columns of type "int". Can be overridden for custom int parsing.
 *
 * @method intParser
 * @param sMarkup
 * @return {nInt} Int number.
 */
YAHOO.widget.Column.prototype.intParser = function(sMarkup) {
    return parseInt(sMarkup);
};

 /**
 * Default radio parser for columns of type "radio". Can be overridden for custom
 * radio parsing.
 *
 * @method radioParser
 * @param sMarkup
 * @return {bChecked} True if radio is checked.
 */
YAHOO.widget.Column.prototype.radioParser = function(sMarkup) {
    return (sMarkup.indexOf("checked") < 0) ? false : true;
};

 /**
 * Default checkbox formatter for columns of type "checkbox". Can be overridden for custom
 * checkbox formatting.
 *
 * @method checkboxFormatter
 * @param bChecked {Boolean} Whether or not checkbox is checked.
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @return {HTML} Markup of formatted checkbox.
 */
YAHOO.widget.Column.prototype.checkboxFormatter = function(bChecked, oRecord) {
    bChecked = (bChecked) ? " checked" : "";
    return "<input type=\"checkbox\"" + bChecked + ">";
};

 /**
 * Default currency formatter for columns of type "currency". Can be overridden for custom
 * currency formatting.
 *
 * @method currencyFormatter
 * @param nAmount (Float) Currency amount.
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @return {HTML} Markup of formatted currency.
 */
YAHOO.widget.Column.prototype.currencyFormatter = function(nAmount, oRecord) {
    // Make it dollars
    var markup = "$"+nAmount;
    
    // Normalize to the penny
    var dotIndex = markup.indexOf(".")
    if(dotIndex < 0) {
        markup += ".00";
    }
    else {//alert(markup.length);
        while(dotIndex != markup.length-3) {
            markup += "0";
        }
    }
    return markup;
};

 /**
 * Custom formatter. Should be overridden for custom formatting of columns where type is
 * "custom".
 *
 * @method customFormatter
 * @param oData (Object) Data for formatting.
 * @param oRecord {YAHOO.widget.Record} Record Object
 * @return {HTML} Markup of formatted data.
 */
YAHOO.widget.Column.prototype.customFormatter = function(oData, oRecord) {
    return (oData) ? oData.toString() : "";
};

 /**
 * Default date formatter for columns of type "date". Can be overridden for custom date
 * formatting.
 *
 * @method dateFormatter
 * @param oDate (Date) Date instance.
 * @param oRecord {YAHOO.widget.Record} Record Object
 * @return {HTML} Markup of formatted date.
 */
YAHOO.widget.Column.prototype.dateFormatter = function(oDate, oRecord) {
    return oDate.getMonth() + "/" + oDate.getDate()  + "/" + oDate.getYear();
};

 /**
 * Default flat formatter for columns of type "float". Can be overridden for custom float
 * formatting.
 *
 * @method floatFormatter
 * @param nFloat (Number) Float.
 * @param oRecord {YAHOO.widget.Record} Record Object
 * @return {HTML} Markup of formatted float.
 */
YAHOO.widget.Column.prototype.floatFormatter = function(nFloat, oRecord) {
    return nFloat.toString();
};

 /**
 * Public static HTML formatter for columns of type "html". Can be overridden for custom
 * HTML formatting.
 *
 * @method htmlFormatter
 * @param sMarkup (HTML) Markup.
 * @param oRecord {YAHOO.widget.Record} Record Object
 * @return {HTML} Markup.
 */
YAHOO.widget.Column.prototype.htmlFormatter = function(sMarkup, oRecord) {
    return sMarkup;
};

 /**
 * Default flat formatter for columns of type "float". Can be overridden for custom float
 * formatting.
 *
 * @method intFormatter
 * @param nInt (Number) Integer.
 * @param oRecord {YAHOO.widget.Record} Record Object
 * @return {HTML} Markup of formatted float.
 */
YAHOO.widget.Column.prototype.intFormatter = function(nInt, oRecord) {
    return nInt.toString();
};

 /**
 * Public static radio formatter for columns of type "radio". Can be overridden for custom
 * radio formatting.
 *
 * @method radioFormatter
 * @param bChecked {Boolean} Whether or not radio is checked.
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @return {HTML} Markup of formatted radio.
 */
YAHOO.widget.Column.prototype.radioFormatter = function(bChecked, oRecord) {
    bChecked = (bChecked) ? " checked" : "";
    return "<input type=\"radio\"" + bChecked + ">";
};

 /**
 * Public accessor to the unique name of the Column instance.
 *
 * @method toString
 * @return {String} Unique name of the Column instance.
 */
YAHOO.widget.Column.prototype.toString = function() {
    return "Column " + this.index + " (" + this.key + ")";
};

 /**
 * Takes innerHTML from TD and parses out data for storage in Recordset.
 *
 * @method parse
 * @param sMarkup {String} The TD's innerHTML value.
 * @return {Object} Data.
 */
YAHOO.widget.Column.prototype.parse = function(sMarkup) {
//TODO: builtin parsers YAHOO.widget.Column.PARSEDATE, PARSEINT, PARSEFLOAT, and custom parsers
    var data = null;
    switch(this.type) {
        case "checkbox":
            data = this.checkboxParser(sMarkup);
            break;
        case "currency":
            data = this.currencyParser(sMarkup);
            break;
        case "custom":
            data = this.customParser(sMarkup);
            break;
        case "date":
            data = this.dateParser(sMarkup);
            break;
        case "float":
            data = this.floatParser(sMarkup);
            break;
        case "html":
            data = this.htmlParser(sMarkup);
            break;
        case "int":
            data = this.intParser(sMarkup);
            break;
        case "radio":
            data = this.radioParser(sMarkup);
            break;
       default:
            if(sMarkup) {
                data = sMarkup;
            }
            break;
    }
    return data;
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
    var data = oRecord[this.key];
    var type = this.type;
    var markup = "";
    switch(type) {
        case "checkbox":
            markup = this.checkboxFormatter(data, oRecord);
            break;
        case "currency":
            markup = this.currencyFormatter(data, oRecord);
            break;
        case "custom":
            markup = this.customFormatter(data, oRecord);
            break;
        case "date":
            markup = this.dateFormatter(data, oRecord);
            break;
        case "float":
            markup = this.floatFormatter(data, oRecord);
            break;
        case "html":
            markup = this.htmlFormatter(data, oRecord);
            break;
        case "int":
            markup = this.intFormatter(data, oRecord);
            break;
        case "radio":
            markup = this.radioFormatter(data, oRecord);
            break;
       default:
            if(data) {
                markup = data.toString();
            }
            break;
    }
    
    elCell.columnKey = this.key;
    elCell.recordId = oRecord.id;
    elCell.innerHTML = markup;
    YAHOO.util.Dom.addClass(elCell, "yui-dt-"+this.type);
    
    //TODO: make classname a constant
    if(this.editable) {
        YAHOO.util.Dom.addClass(elCell,YAHOO.widget.DataTable.CLASS_EDITABLE);
    }
};

 /**
 * Outputs editor markup into the given TD based on given Record.
 *
 * @method showEditor
 * @param elCell {HTMLElement} TD to format for display.
 * @param oRecord {YAHOO.widget.Record} Record that holds data for the row.
 */
YAHOO.widget.Column.prototype.showEditor = function(elCell,oRecord) {
    var oEditor = this.editor;
    if(!oEditor) {
        oEditor = new YAHOO.widget.ColumnEditor(this, elCell);
        this.editor = oEditor;
    }
    if(oEditor) {
        oEditor.show(elCell, oRecord, this);
    }
};

 /**
 * Hides editor markup for the Column.
 *
 * @method hideEditor
 */
YAHOO.widget.Column.prototype.hideEditor = function() {
    var oEditor = this.editor;
    if(oEditor) {
        oEditor.hide();
    }
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
YAHOO.widget.Column._nCount =0;

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * The Columnset class defines and manages the complete set of DataTable Columns,
 * including nested hierarchies, based on an array of columns object literals.
 *
 * @class Columnset
 * @constructor
 * @param aHeaderCells {Object[]} Array of header cells defined by object literals.
 */
YAHOO.widget.Columnset = function(aHeaderCells) {
//TODO: COL.prevSibling, COL.nextSibling
    // Tree representation of all Columns
    var tree = [];
    // Flat representation of all Columns
    var flat = [];
    // Flat representation of Columns in the bottom row of headers
    var bottom = [];

    var nodelevel = -1;

    // Internal recursive function to parse columns
    var parseColumns = function(nodeList, parent) {
        nodelevel++;
        // A node level is an array of Columns
        if(!tree[nodelevel]) {
            tree[nodelevel] = [];
        }

        // Determine if any nodes at this level have children
        var nodeLevelHasChildren = false;
        for(var i=0; i<nodeList.length; i++) {
            if(nodeList[i].children) {
                nodeLevelHasChildren = true;
            }
        }

        // Parse each node for attributes and any children
        for(var i=0; i<nodeList.length; i++) {
            // A node is a Column
            var oColumn = new YAHOO.widget.Column(tree.length, nodeList[i]);
            flat.push(oColumn);
            
            // Assign parent, if any
            if(parent) {
                oColumn.parent = parent;
            }

            // Start with default values
            oColumn.rowspan = 1;
            oColumn.colspan = 1;

            // Column may have a children that defines children
            var children = oColumn.children;
            if(children) {
                // Children increase colspan of the Column
                oColumn.colspan = children.length;

                // Children increase colspan of the Column's parent
                if (parent && parent.colspan) {
                    parent.colspan += children.length-1;
                }
                
                // Children must also be parsed
                if(!tree[nodelevel+1]) {
                    tree[nodelevel+1] = [];
                }
                parseColumns(children, oColumn);
            }
            
            // This Column does not have children,
            // but other Columns at this level do
            else if(nodeLevelHasChildren) {
                // Children of siblings increase the rowspan of the Column
                oColumn.rowspan = 2;
                bottom.push(oColumn);
            }
            // This entire node level does not have any children
            else {
                bottom.push(oColumn);
            }

            // Add the Column to the row array
            tree[nodelevel].push(oColumn);
        }
        nodelevel--;
    };

    // Do the parsing
    if(aHeaderCells.length > 0) {
        parseColumns(aHeaderCells);
    }

    //var lastRowCellsLn = tree[tree.length-1].length;
    //tree[tree.length-1][lastRowCellsLn-1].isLast = true
    this.tree = tree;
    this.flat = flat;
    //bottom[bottom.length-1].isLast = true;
    this.bottom = bottom;
};

/////////////////////////////////////////////////////////////////////////////
//
// Public member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Tree representation of column hierarchy.
 *
 * @property tree
 * @type YAHOO.widget.Column[]
 * @default []
 */
YAHOO.widget.Columnset.prototype.tree = [];

/**
 * Flat array of all columns.
 *
 * @property flat
 * @type YAHOO.widget.Column[]
 * @default []
 */
YAHOO.widget.Columnset.prototype.flat = [];

/**
 * Flat array of columns that comprise the bottom row of headers.
 *
 * @property bottom
 * @type YAHOO.widget.Column[]
 * @default []
 */
YAHOO.widget.Columnset.prototype.bottom = [];

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * The ColumnEditor defines and manages inline editing functionality for a
 * DataTable Column.
 *
 * @class ColumnEditor
 * @constructor
 * @param oColumn {YAHOO.widget.Column} DataTable Column instance.
 * @parem sType {String} Type identifier
 */
YAHOO.widget.ColumnEditor = function(oColumn, elCell) {
    this.column = oColumn;
    
    var container = document.body.appendChild(document.createElement("div"));
    container.style.position = "absolute";
    container.style.zIndex = 9000;
    container.id = "yui-dt-coled" + YAHOO.widget.ColumnEditor._nCount;
    this.container = container;

    switch(oColumn.editable) {
        case "textbox":
            this.createTextboxEditor();
            break;
        default:
            break;
    }
    
    YAHOO.widget.ColumnEditor._nCount++;
};

YAHOO.extend(YAHOO.widget.ColumnEditor, YAHOO.util.Element);

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
 * Reference to the Column object for the ColumnEditor.
 *
 * @property column
 * @type YAHOO.widget.Column
 */
YAHOO.widget.ColumnEditor.prototype.column = null;

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
 */
YAHOO.widget.ColumnEditor.prototype.show = function(elCell, oRecord, oColumn) {
    switch(oColumn.editable) {
        case "textbox":
            this.showTextboxEditor(elCell, oRecord, oColumn);
            break;
        default:
            break;
    }
}

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
 * Shows ColumnEditor
 *
 * @method showTextboxEditor
 */
YAHOO.widget.ColumnEditor.prototype.showTextboxEditor = function(elCell, oRecord, oColumn) {
    // Size and value
    this.input.style.width = (parseInt(elCell.offsetWidth)-7) + "px";
    this.input.style.height = (parseInt(elCell.offsetHeight)-7) + "px";
    this.input.value = oRecord[oColumn.key];
    
    // Position and show
    var x = parseInt(YAHOO.util.Dom.getX(elCell))+1 || 0;
    var y = parseInt(YAHOO.util.Dom.getY(elCell))+1 || 0;
    this.container.style.left = x + "px";
    this.container.style.top = y + "px";
    this.container.style.display = "block";
    
    this.input.focus();
    this.input.select();
};

 /**
 * Hides ColumnEditor
 *
 * @method hide
 */
YAHOO.widget.ColumnEditor.prototype.hide = function() {
    this.container.style.display = "none";
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
                YAHOO.util.Dom.get(oDataTable._oColumnset.bottom[i].id).style.width = oDataTable._oColumnset.bottom[i].width + "px";
            }
        }
        sib.style.width = sibnewwidth;
        elCell.style.width = newWidth + "px";
        oDataTable._oColumnset.bottom[sibIndex].width = sibnewwidth;
        oDataTable._oColumnset.bottom[elCell.index].width = newWidth;

    }
    else {
        elCell.style.width = newWidth + "px";
    }

};


