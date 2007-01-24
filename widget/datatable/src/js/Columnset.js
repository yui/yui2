/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * The Columnset class defines and manages a DataTable's Columns,
 * including nested hierarchies and access to individual Column instances.
 *
 * @class Columnset
 * @constructor
 * @param aHeaders {Object[]} Array of object literals that define header cells.
 */
YAHOO.widget.Columnset = function(aHeaders) {
    this._sName = "instance" + YAHOO.widget.Columnset._nCount;
//TODO: Do we need COL.prevSibling, COL.nextSibling?
    // Tree representation of all Columns
    var tree = [];
    // Flat representation of all Columns
    var flat = [];
    // Flat representation of Columns that display data
    var keys = [];

    var nodelevel = -1;

    // Internal recursive function to parse columns
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
        }
        recurseChildren(nodeList);

        // Parse each node for attributes and any children
        for(var i=0; i<nodeList.length; i++) {
            // Instantiate a Column for each node
            var oColumn = new YAHOO.widget.Column(flat.length, nodeList[i]);
            flat.push(oColumn);
            
            // Assign parent, if applicable
            if(parent) {
                oColumn.parent = parent;
            }

            // Start with default values
            oColumn.rowspan = 1;
            oColumn.colspan = 1;

            // Column may have children
            if(oColumn.children) {
                var children = oColumn.children;
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
            else if(nodeLevelMaxChildren > 0) {
                // Children of siblings increase the rowspan of the Column
                oColumn.rowspan += nodeLevelMaxChildren;
                if(oColumn.key) {
                    keys.push(oColumn);
                }
            }
            // This entire node level does not have any children
            else {
                if(oColumn.key) {
                    keys.push(oColumn);
                }
            }

            // Add the Column to the tree's row array
            tree[nodelevel].push(oColumn);
        }
        nodelevel--;
    };

    // Do the parsing
    if(aHeaders.length > 0) {
        parseColumns(aHeaders);
    }

    this.tree = tree;
    this.flat = flat;
    this.keys = keys;
    
    YAHOO.widget.Columnset._nCount++;
    YAHOO.log("Columnset initialized", "info", this.toString());
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
YAHOO.widget.Columnset._nCount = 0;

/**
 * Unique instance name.
 *
 * @property _sName
 * @type String
 * @private
 */
YAHOO.widget.Columnset.prototype._sName = null;

/////////////////////////////////////////////////////////////////////////////
//
// Public member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Tree representation of Column hierarchy.
 *
 * @property tree
 * @type YAHOO.widget.Column[]
 * @default []
 */
YAHOO.widget.Columnset.prototype.tree = [];

/**
 * Flattened representation of all Columns.
 *
 * @property flat
 * @type YAHOO.widget.Column[]
 * @default []
 */
YAHOO.widget.Columnset.prototype.flat = [];

/**
 * Array of Columns that hold keys to data.
 *
 * @property keys
 * @type YAHOO.widget.Column[]
 * @default []
 */
YAHOO.widget.Columnset.prototype.keys = [];

/////////////////////////////////////////////////////////////////////////////
//
// Public methods
//
/////////////////////////////////////////////////////////////////////////////
 /**
 * Public accessor to the unique name of the Columnset instance.
 *
 * @method toString
 * @return {String} Unique name of the Columnset instance.
 */

YAHOO.widget.Columnset.prototype.toString = function() {
    return "Columnset " + this._sName;
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
 * @param nIndex {Number} Index of column.
 * @param oConfigs {Object} Object literal of configuration values.
 */
YAHOO.widget.Column = function(nIndex, oConfigs) {
    // Internal variables
    this.id = "yui-dtcol"+YAHOO.widget.Column._nCount;
    this.index = nIndex;
    
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

/////////////////////////////////////////////////////////////////////////////
//
// Public member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Unique ID, also assigned as DOM ID.
 *
 * @property id
 * @type String
 */
YAHOO.widget.Column.prototype.id = null;

/**
 * Reference to Column's index within its Columnset's flat array.
 *
 * @property index
 * @type Number
 */
YAHOO.widget.Column.prototype.index = null;

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
 * Column's parent, or null.
 *
 * @property parent
 * @type YAHOO.widget.Column
 */
YAHOO.widget.Column.prototype.parent = null;

/**
 * Array of Column's chilren, or null.
 *
 * @property children
 * @type YAHOO.widget.Column[]
 */
YAHOO.widget.Column.prototype.children = null;

/**
 * Associated database column, or null.
 *
 * @property key
 * @type String
 */
YAHOO.widget.Column.prototype.key = null;

/**
 * Data type: "string", "number", "float", "date", "object", "array", "boolean",
 * "currency", "checkbox", "select", "email", "link".
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
 * Column head cell ABBR for accessibility.
 *
 * @property abbr
 * @type String
 */
YAHOO.widget.Column.prototype.abbr = null;

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












//TODO: clean these up

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
 * Outputs markup into the given TD based on given Record.
 *
 * @method format
 * @param elCell {HTMLElement} TD to format for display.
 * @param oRecord {YAHOO.widget.Record} Record that holds data for the row.
 * @return {HTML} Markup.
 */
YAHOO.widget.Column.prototype.format = function(elCell,oRecord) {
    var oData = oRecord[this.key];
    var type = this.type;
    var markup = "";
    var classname = "";
    switch(type) {
        case "checkbox":
            YAHOO.widget.DataTable.checkboxFormatter(elCell, oData, oRecord, this);
            classname = YAHOO.widget.DataTable.CLASS_CHECKBOX;
            break;
        case "currency":
            YAHOO.widget.DataTable.currencyFormatter(elCell, oData, oRecord, this);
            classname = YAHOO.widget.DataTable.CLASS_CURRENCY;
            break;
        case "custom":
            YAHOO.widget.DataTable.customFormatter(elCell, oData, oRecord, this);
            classname = YAHOO.widget.DataTable.CLASS_CUSTOM;
            break;
        case "date":
            YAHOO.widget.DataTable.dateFormatter(elCell, oData, oRecord, this);
            classname = YAHOO.widget.DataTable.CLASS_DATE;
            break;
        case "email":
            YAHOO.widget.DataTable.emailFormatter(elCell, oData, oRecord, this);
            classname = YAHOO.widget.DataTable.CLASS_EMAIL;
            break;
        case "float":
            YAHOO.widget.DataTable.floatFormatter(elCell, oData, oRecord, this);
            classname = YAHOO.widget.DataTable.CLASS_FLOAT;
            break;
        case "html":
            YAHOO.widget.DataTable.htmlFormatter(elCell, oData, oRecord, this);
            classname = YAHOO.widget.DataTable.CLASS_HTML;
            break;
        case "link":
            YAHOO.widget.DataTable.linkFormatter(elCell, oData, oRecord, this);
            classname = YAHOO.widget.DataTable.CLASS_LINK;
            break;
        case "number":
            YAHOO.widget.DataTable.numberFormatter(elCell, oData, oRecord, this);
            classname = YAHOO.widget.DataTable.CLASS_NUMBER;
            break;
        case "select":
            YAHOO.widget.DataTable.selectFormatter(elCell, oData, oRecord, this);
            classname = YAHOO.widget.DataTable.CLASS_SELECT;
            break;
       default:
            if(oData) {
                elCell.innerHTML = oData.toString();
                classname = YAHOO.widget.DataTable.CLASS_STRING;
            }
            break;
    }

    elCell.columnKey = this.key;
    YAHOO.util.Dom.addClass(elCell, classname);

    if(this.editable) {
        YAHOO.util.Dom.addClass(elCell,YAHOO.widget.DataTable.CLASS_EDITABLE);
    }
};







//TODO: clean these up



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
            data = YAHOO.widget.Column.checkboxParser(sMarkup);
            break;
        case "currency":
            data = YAHOO.widget.Column.currencyParser(sMarkup);
            break;
        case "custom":
            data = YAHOO.widget.Column.customParser(sMarkup);
            break;
        case "date":
            data = YAHOO.widget.Column.dateParser(sMarkup);
            break;
        case "float":
            data = YAHOO.widget.Column.floatParser(sMarkup);
            break;
        case "html":
            data = YAHOO.widget.Column.htmlParser(sMarkup);
            break;
        case "number":
            data = YAHOO.widget.Column.numberParser(sMarkup);
            break;
        case "select":
            data = YAHOO.widget.Column.selectParser(sMarkup);
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
 * Default parser for columns of type "checkbox" takes markup and extracts data.
 * Can be overridden for custom parsing.
 *
 * @method checkboxParser
 * @param sMarkup
 * @return {bChecked} True if checkbox is checked.
 */
YAHOO.widget.Column.checkboxParser = function(sMarkup) {
    return (sMarkup.indexOf("checked") < 0) ? false : true;
};

 /**
 * Default parser for columns of type "currency" takes markup and extracts data.
 * Can be overridden for custom parsing.
 *
 * @method currencyParser
 * @param sMarkup
 * @return {nAmount} Floating point amount.
 */
YAHOO.widget.Column.currencyParser = function(sMarkup) {
    return parseFloat(sMarkup.substring(1));
};

 /**
 * Default parser for columns of type "custom" takes markup and extracts data.
 * Should be overridden for custom parsing.
 *
 * @method customParser
 * @param sMarkup
 * @return {oData} Data.
 */
YAHOO.widget.Column.customParser = function(sMarkup) {
    return sMarkup;
};

 /**
 * Default parser for columns of type "date" takes markup and extracts data.
 * Can be overridden for custom parsing.
 *
 * @method dateParser
 * @param sMarkup
 * @return {oDate} Date instance.
 */
YAHOO.widget.Column.dateParser = function(sMarkup) {
    var mm = sMarkup.substring(0,sMarkup.indexOf("/"));
    sMarkup = sMarkup.substring(sMarkup.indexOf("/")+1);
    var dd = sMarkup.substring(0,sMarkup.indexOf("/"));
    var yy = sMarkup.substring(sMarkup.indexOf("/")+1);
    return new Date(yy, mm, dd);
};

 /**
 * Default parser for columns of type "float" takes markup and extracts data.
 * Can be overridden for custom parsing.
 *
 * @method floatParser
 * @param sMarkup
 * @return {nFloat} Float number.
 */
YAHOO.widget.Column.floatParser = function(sMarkup) {
    return parseFloat(sMarkup);
};

 /**
 * Default parser for columns of type "html" takes markup and extracts data.
 * Can be overridden for custom parsing.
 *
 * @method htmlParser
 * @param sMarkup
 * @return {sMarkup} HTML markup.
 */
YAHOO.widget.Column.htmlParser = function(sMarkup) {
    return sMarkup;
};

 /**
 * Default parser for columns of type "number" takes markup and extracts data.
 * Can be overridden for custom parsing.
 *
 * @method numberParser
 * @param sMarkup
 * @return {nNumber} Number.
 */
YAHOO.widget.Column.numberParser = function(sMarkup) {
    return parseInt(sMarkup);
};

 /**
 * Default parser for columns of type "select" takes markup and extracts data.
 * Can be overridden for custom parsing.
 *
 * @method selectParser
 * @param sMarkup
 * @return {sValue} Value of selected option.
 */
YAHOO.widget.Column.selectParser = function(sMarkup) {
    //return (sMarkup.indexOf("checked") < 0) ? false : true;
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

    //TODO: make sure columneditors get destroyed if widget gets destroyed
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

    switch(oColumn.editable) {
        case "textbox":
            this.createTextboxEditor();
            break;
        default:
            break;
    }

    YAHOO.widget.ColumnEditor._nCount++;
};

if(YAHOO.util.Element) {
    YAHOO.extend(YAHOO.widget.ColumnEditor, YAHOO.util.Element);
}
else {
    YAHOO.log("Missing dependency: YAHOO.util.Element","error",this.toString());
}


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
 * Reference to the container DOM element for the DataTable.
 *
 * @property tableContainer
 * @type HTMLElement
 */
//YAHOO.widget.ColumnEditor.prototype.tableContainer = null;

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
    var x,y;
    
    // Don't use getXY for Opera
    if(window.opera) {
        x = elCell.offsetLeft;
        y = elCell.offsetTop;
        while(elCell.offsetParent) {
            x += elCell.offsetParent.offsetLeft;
            y += elCell.offsetParent.offsetTop
            elCell = elCell.offsetParent;
        }
    }
    else {
        var xy = YAHOO.util.Dom.getXY(elCell);
        x = parseInt(YAHOO.util.Dom.getX(elCell))//xy[0] + 1;
        y = parseInt(YAHOO.util.Dom.getY(elCell))//xy[1] + 1;
    }
    //YAHOO.log("xy "+xy,"debug",this.toString());
    //YAHOO.log("x "+x,"debug",this.toString());
    //YAHOO.log("y "+y,"debug",this.toString());
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

if(YAHOO.util.DD) {
    YAHOO.extend(YAHOO.util.WidthResizer, YAHOO.util.DD);
}

/////////////////////////////////////////////////////////////////////////////
//
// Public DOM event handlers
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
    //YAHOO.log("startwidth:"+this.startWidth + " and offset:"+offsetX,"warn");
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
        //var sibIndex = elCell.index + 1;
        var sibnewwidth = sib.offsetWidth - offsetX;
        if(sibnewwidth < this.sibMinWidth) {
            sibnewwidth = this.sibMinWidth;
        }

        //TODO: how else to cycle through all the columns without having to use an index property?""
        for(var i=0; i<oDataTable._oColumnset.length; i++) {
            if((i != elCell.index) &&  (i!=sibIndex)) {
                YAHOO.util.Dom.get(oDataTable._oColumnset.keys[i].id).style.width = oDataTable._oColumnset.keys[i].width + "px";
            }
        }
        sib.style.width = sibnewwidth;
        elCell.style.width = newWidth + "px";
        //oDataTable._oColumnset.flat[sibIndex].width = sibnewwidth;
        //oDataTable._oColumnset.flat[elCell.index].width = newWidth;

    }
    else {
        elCell.style.width = newWidth + "px";
    }
};



