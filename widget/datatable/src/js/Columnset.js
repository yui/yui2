/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * The Column class defines and manages attributes of DataTable columns.
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
    if(!this.key) {
        YAHOO.log("Invalid column definition: key is required");
    }
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
 * Column's index.
 *
 * @property index
 * @type Number
 */
YAHOO.widget.Column.prototype.index = null;

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

/**
 * True if column is resizeable, false otherwise.
 *
 * @property resizeable
 * @type Boolean
 * @default false
 */
YAHOO.widget.Column.prototype.resizeable = false;

/**
 * Number of table cells column spans.
 *
 * @property colspan
 * @type Number
 * @default 1
 */
YAHOO.widget.Column.prototype.span = 1;

/**
 * True if column is last.
 *
 * @property isLast
 * @type Boolean
 * @default false
 */
YAHOO.widget.Column.prototype.isLast = false;

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
YAHOO.widget.Column.checkboxParser = function(sMarkup) {
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
YAHOO.widget.Column.currencyParser = function(sMarkup) {
    return parseFloat(sMarkup.substring(1));
};

 /**
 * Custom parser for columns of type "custom". Should be overridden for custom parsing.
 *
 * @method customParser
 * @param sMarkup
 * @return {oData} Data.
 */
YAHOO.widget.Column.customParser = function(sMarkup) {
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
YAHOO.widget.Column.dateParser = function(sMarkup) {
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
YAHOO.widget.Column.floatParser = function(sMarkup) {
    return parseFloat(sMarkup);
};

 /**
 * Default HTML parser for columns of type "html". Can be overridden for custom html parsing.
 *
 * @method htmlParser
 * @param sMarkup
 * @return {sMarkup} HTML markup.
 */
YAHOO.widget.Column.htmlParser = function(sMarkup) {
    return sMarkup;
};

 /**
 * Default int parser for columns of type "int". Can be overridden for custom int parsing.
 *
 * @method intParser
 * @param sMarkup
 * @return {nInt} Int number.
 */
YAHOO.widget.Column.intParser = function(sMarkup) {
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
YAHOO.widget.Column.radioParser = function(sMarkup) {
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
YAHOO.widget.Column.checkboxFormatter = function(bChecked, oRecord) {
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
YAHOO.widget.Column.currencyFormatter = function(nAmount, oRecord) {
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
YAHOO.widget.Column.customFormatter = function(oData, oRecord) {
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
YAHOO.widget.Column.dateFormatter = function(oDate, oRecord) {
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
YAHOO.widget.Column.floatFormatter = function(nFloat, oRecord) {
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
YAHOO.widget.Column.htmlFormatter = function(sMarkup, oRecord) {
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
YAHOO.widget.Column.intFormatter = function(nInt, oRecord) {
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
YAHOO.widget.Column.radioFormatter = function(bChecked, oRecord) {
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
        case "int":
            data = YAHOO.widget.Column.intParser(sMarkup);
            break;
        case "radio":
            data = YAHOO.widget.Column.radioParser(sMarkup);
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
 * @param elCell {HTMLElement} TD to format for display
 * @param oRecord {YAHOO.widget.Record} Record that holds data for the row.
 * @return {HTML} Markup.
 */
YAHOO.widget.Column.prototype.format = function(elCell,oRecord) {
    //TODO: switch statement
    var data = oRecord[this.key];
    var type = this.type;
    var markup = "";
    switch(type) {
        case "checkbox":
            markup = YAHOO.widget.Column.checkboxFormatter(data, oRecord);
            break;
        case "currency":
            markup = YAHOO.widget.Column.currencyFormatter(data, oRecord);
            break;
        case "custom":
            markup = YAHOO.widget.Column.customFormatter(data, oRecord);
            break;
        case "date":
            markup = YAHOO.widget.Column.dateFormatter(data, oRecord);
            break;
        case "float":
            markup = YAHOO.widget.Column.floatFormatter(data, oRecord);
            break;
        case "html":
            markup = YAHOO.widget.Column.htmlFormatter(data, oRecord);
            break;
        case "int":
            markup = YAHOO.widget.Column.intFormatter(data, oRecord);
            break;
        case "radio":
            markup = YAHOO.widget.Column.radioFormatter(data, oRecord);
            break;
       default:
            if(data) {
                markup = data.toString();
            }
            break;
    }
    
    elCell.innerHTML = markup;
    
    //TODO: make classname a constant
    if(this.editable) {
        YAHOO.util.Dom.addClass(elCell,"yui-dt-editable");
    }
};

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * The Columnset class defines and manages the complete set of DataTable columns,
 * including nested column headers.
 *
 * @class Columnset
 * @constructor
 * @param aColumnset {Object[]} Array of column object literals.
 */
YAHOO.widget.Columnset = function(aColumnset) {
    // Array of rows
    var rows = [];
    var columns = [];
    var currentrow = -1;
    //var numColsInTable = 0;

    // The implementer passes in an array of columns which we will
    // parse into an array of rows
    var parseColumnsToRows = function(oneColumnset, parentcell) {
        currentrow++;
        // A row is an array of header cells
        if(!rows[currentrow]) {
            rows[currentrow] = [];
        }

        // Tracking variable to determine if rowspan > 1
        var rowHasNested = false;
        for(var i=0; i<oneColumnset.length; i++) {
            if(oneColumnset[i].columnset) {
                rowHasNested = true;
            }
        }

        // Parse each column for attributes and nested header cells
        for(var i=0; i<oneColumnset.length; i++) {
            // Current header cell cell
            var cell = oneColumnset[i];
            // Start with default values
            cell.rowspan = 1;
            cell.colspan = 1;

            // The header cell may have a columnset to define subheaders
            var subcolumnset = cell.columnset;
            if(subcolumnset) {
                // Subheaders increase the colspan of the header cell...
                cell.colspan = subcolumnset.length;
                //YAHOO.log("cell"+cell.text + cell.colspan, "warn");
                // ...as well as its parent header cell (if any)
                if (parentcell && parentcell.colspan) {
                    parentcell.colspan += subcolumnset.length-1;
                    YAHOO.log("parent"+parentcell.text + parentcell.colspan,"warn");
                }
                if(!rows[currentrow+1]) {
                    rows[currentrow+1] = [];
                }
                parseColumnsToRows(subcolumnset, cell);
            }
            // This header cell does not have subheaders, but other header cells on this row seem to
            else if(rowHasNested) {
                cell.rowspan = 2;
                columns.push(new YAHOO.widget.Column(columns.length, cell));
                //numColsInTable++;
            }
            // This header cell does not have subheaders, and this entire row does not have any subheaders
            else {
                columns.push(new YAHOO.widget.Column(columns.length, cell));
                //numColsInTable++;
            }

            // Add the header cell to the row array
            rows[currentrow].push(new YAHOO.widget.Column(rows.length, cell));
        }
        currentrow--;
    };

    // Do the parsing
    if(aColumnset.length > 0) {
        parseColumnsToRows(aColumnset);
    }

    var lastRowCellsLn = rows[rows.length-1].length;
    rows[rows.length-1][lastRowCellsLn-1].isLast =
    this.rows = rows;
    columns[columns.length-1].isLast = true;
    this.columns = columns;
    //this.numColsInTable = numColsInTable;
};

/////////////////////////////////////////////////////////////////////////////
//
// Public member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Array of rows.
 *
 * @property rows
 * @type Object[]
 * @default []
 */
YAHOO.widget.Columnset.prototype.rows = [];

/**
 * Array of columns.
 *
 * @property columns
 * @type Object[]
 * @default []
 */
YAHOO.widget.Columnset.prototype.columns = [];
