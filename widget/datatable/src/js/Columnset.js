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
 * Associated data field.
 *
 * @property key
 * @type String
 */
YAHOO.widget.Column.prototype.key = null;

/**
 * Text or HTML for display in the column head cell.
 *
 * @property text
 * @type String
 */
YAHOO.widget.Column.prototype.text = null;

/**
 * Width of the column, including units.
 *
 * @property width
 * @type String
 * @default "auto"
 */
YAHOO.widget.Column.prototype.width = "auto";

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

/////////////////////////////////////////////////////////////////////////////
//
// Public methods
//
/////////////////////////////////////////////////////////////////////////////

 /**
 * Public accessor to the unique name of the Column instance.
 *
 * @method toString
 * @return {String} Unique name of the Column instance.
 */
YAHOO.widget.Column.prototype.toString = function() {
    return "Column " + this.index + " (" + this.id + ")";
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
        YAHOO.log("Parsing " + oneColumnset.length + " columns in row " + currentrow, "warn");
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
                // ...as well as its parent header cell (if any)
                if (parentcell && parentcell.colspan) {
                    parentcell.colspan += subcolumnset.length;
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

            // Add the headre cell to the row array
            rows[currentrow].push(cell);
        }
        currentrow--;
    };

    // Do the parsing
    if(aColumnset.length > 0) {
        parseColumnsToRows(aColumnset);
    }

    // Some logging
    for(var i=0;i<rows.length;i++) {
        YAHOO.log("row"+i+": "+rows[i],"warn");
        for(var j=0; j<rows[i].length; j++) {
            var cell = rows[i][j];
            YAHOO.log("cell"+j+": "+cell.text + " rowspan: " + cell.rowspan + " colspan: " + cell.colspan ,"warn");
        }
    }
    this.rows = rows;
    this.columns = columns;
    //this.numColsInTable = numColsInTable;
};

/////////////////////////////////////////////////////////////////////////////
//
// Public member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Total number of columns in the DataTable.
 *
 * @property numColumnsInTable
 * @type Number
 * @default 0
 */
//YAHOO.widget.Columnset.prototype.numColsInTable = 0;

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


