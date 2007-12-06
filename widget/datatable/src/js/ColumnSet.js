/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * The ColumnSet class defines and manages a DataTable's Columns,
 * including nested hierarchies and access to individual Column instances.
 *
 * @namespace YAHOO.widget
 * @class ColumnSet
 * @uses YAHOO.util.EventProvider
 * @constructor
 * @param aDefinitions {Object[]} Array of object literals that define header cells.
 */
YAHOO.widget.ColumnSet = function(aDefinitions) {
    this._sName = "instance" + YAHOO.widget.ColumnSet._nCount;

    this._init(aDefinitions);

    YAHOO.widget.ColumnSet._nCount++;
    YAHOO.log("ColumnSet initialized", "info", this.toString());
};

/////////////////////////////////////////////////////////////////////////////
//
// Private member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Internal class variable to index multiple ColumnSet instances.
 *
 * @property ColumnSet._nCount
 * @type Number
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

/**
 * Array of object literal Column definitions passed to the constructor.
 *
 * @property _aDefinitions
 * @type Object[]
 * @private
 */
YAHOO.widget.ColumnSet.prototype._aDefinitions = null;

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
 * ID index of nested parent hierarchies for HEADERS accessibility attribute.
 *
 * @property headers
 * @type String[]
 * @default []
 */
YAHOO.widget.ColumnSet.prototype.headers = null;

/////////////////////////////////////////////////////////////////////////////
//
// Private methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Initializes ColumnSet instance with data from Column definitions.
 *
 * @method _init
 * @param aDefinitions {Object[]} Array of object literals that define header cells.
 * @private
 */

YAHOO.widget.ColumnSet.prototype._init = function(aDefinitions) {
    aDefinitions = aDefinitions.slice();
    this._aDefinitions = aDefinitions;

    // DOM tree representation of all Columns
    var tree = [];
    // Flat representation of all Columns
    var flat = [];
    // Flat representation of only Columns that are meant to display data
    var keys = [];
    // Array of HEADERS attribute values for all keys in the "keys" array
    var headers = [];

    // Tracks current node list depth being tracked
    var nodeDepth = -1;

    // Internal recursive function to defined Column instances
    var oSelf = this;
    var parseColumns = function(nodeList, parent) {
        // One level down
        nodeDepth++;

        // Create corresponding tree node if not already there for this depth
        if(!tree[nodeDepth]) {
            tree[nodeDepth] = [];
        }


        // Parse each node at this depth for attributes and any children
        for(var j=0; j<nodeList.length; j++) {
            var currentNode = nodeList[j];

            // Instantiate a new Column for each node
            var oColumn = new YAHOO.widget.Column(currentNode);
            oColumn._sId = YAHOO.widget.Column._nCount + "";
            oColumn._sName = "Column instance" + YAHOO.widget.Column._nCount;
            // Assign a key if not found
            if(!YAHOO.lang.isValue(oColumn.key)) {
                oColumn.key = "yui-dt-col" + YAHOO.widget.Column._nCount;
            }
            // Increment counter
            YAHOO.widget.Column._nCount++;

            // Add the new Column to the flat list
            flat.push(oColumn);

            // Assign its parent as an attribute, if applicable
            if(parent) {
                oColumn.parent = parent;
            }

            // The Column has descendants
            if(YAHOO.lang.isArray(currentNode.children)) {
                oColumn.children = currentNode.children;

                // Determine COLSPAN value for this Column
                var terminalChildNodes = 0;
                var countTerminalChildNodes = function(ancestor) {
                    var descendants = ancestor.children;
                    // Drill down each branch and count terminal nodes
                    for(var k=0; k<descendants.length; k++) {
                        // Keep drilling down
                        if(YAHOO.lang.isArray(descendants[k].children)) {
                            countTerminalChildNodes(descendants[k]);
                        }
                        // Reached branch terminus
                        else {
                            terminalChildNodes++;
                        }
                    }
                };
                countTerminalChildNodes(currentNode);
                oColumn._nColspan = terminalChildNodes;

                // Cascade certain properties to children if not defined on their own
                var currentChildren = currentNode.children;
                for(var k=0; k<currentChildren.length; k++) {
                    var child = currentChildren[k];
                    if(oColumn.className && (child.className === undefined)) {
                        child.className = oColumn.className;
                    }
                    if(oColumn.editor && (child.editor === undefined)) {
                        child.editor = oColumn.editor;
                    }
                    if(oColumn.editorOptions && (child.editorOptions === undefined)) {
                        child.editorOptions = oColumn.editorOptions;
                    }
                    if(oColumn.formatter && (child.formatter === undefined)) {
                        child.formatter = oColumn.formatter;
                    }
                    if(oColumn.resizeable && (child.resizeable === undefined)) {
                        child.resizeable = oColumn.resizeable;
                    }
                    if(oColumn.sortable && (child.sortable === undefined)) {
                        child.sortable = oColumn.sortable;
                    }
                    if(oColumn.width && (child.width === undefined)) {
                        child.width = oColumn.width;
                    }
                    // Backward compatibility
                    if(oColumn.type && (child.type === undefined)) {
                        child.type = oColumn.type;
                    }
                    if(oColumn.type && !oColumn.formatter) {
                        YAHOO.log("The property type has been" +
                        " deprecated in favor of formatter", "warn", oColumn.toString());
                        oColumn.formatter = oColumn.type;
                    }
                    if(oColumn.text && !YAHOO.lang.isValue(oColumn.label)) {
                        YAHOO.log("The property text has been" +
                        " deprecated in favor of label", "warn", oColumn.toString());
                        oColumn.label = oColumn.text;
                    }
                    if(oColumn.parser) {
                        YAHOO.log("The property parser is no longer supported",
                        "warn", this.toString());
                    }
                    if(oColumn.sortOptions && ((oColumn.sortOptions.ascFunction) ||
                            (oColumn.sortOptions.descFunction))) {
                        YAHOO.log("The properties sortOptions.ascFunction and " +
                        " sortOptions.descFunction have been deprecated in favor " +
                        " of sortOptions.sortFunction", "warn", oColumn.toString());
                    }
                }

                // The children themselves must also be parsed for Column instances
                if(!tree[nodeDepth+1]) {
                    tree[nodeDepth+1] = [];
                }
                parseColumns(currentChildren, oColumn);
            }
            // This Column does not have any children
            else {
                oColumn._nKeyIndex = keys.length;
                oColumn._nColspan = 1;
                keys.push(oColumn);
            }

            // Add the Column to the top-down tree
            tree[nodeDepth].push(oColumn);
        }
        nodeDepth--;
    };

    // Parse out Column instances from the array of object literals
    if(YAHOO.lang.isArray(aDefinitions)) {
        parseColumns(aDefinitions);
    }
    else {
        YAHOO.log("Could not initialize ColumnSet due to invalid definitions","error");
        return null;
    }

    var i;

    // Determine ROWSPAN value for each Column in the tree
    var parseTreeForRowspan = function(tree) {
        var maxRowDepth = 1;
        var currentRow;
        var currentColumn;

        // Calculate the max depth of descendants for this row
        var countMaxRowDepth = function(row, tmpRowDepth) {
            tmpRowDepth = tmpRowDepth || 1;

            for(var n=0; n<row.length; n++) {
                var col = row[n];
                // Column has children, so keep counting
                if(YAHOO.lang.isArray(col.children)) {
                    tmpRowDepth++;
                    countMaxRowDepth(col.children, tmpRowDepth);
                    tmpRowDepth--;
                }
                // No children, is it the max depth?
                else {
                    if(tmpRowDepth > maxRowDepth) {
                        maxRowDepth = tmpRowDepth;
                    }
                }

            }
        };

        // Count max row depth for each row
        for(var m=0; m<tree.length; m++) {
            currentRow = tree[m];
            countMaxRowDepth(currentRow);

            // Assign the right ROWSPAN values to each Column in the row
            for(var p=0; p<currentRow.length; p++) {
                currentColumn = currentRow[p];
                if(!YAHOO.lang.isArray(currentColumn.children)) {
                    currentColumn._nRowspan = maxRowDepth;
                }
                else {
                    currentColumn._nRowspan = 1;
                }
            }

            // Reset counter for next row
            maxRowDepth = 1;
        }
    };
    parseTreeForRowspan(tree);

    // Store tree index values
    for(i=0; i<tree[0].length; i++) {
        tree[0][i]._nTreeIndex = i;
    }

    // Store header relationships in an array for HEADERS attribute
    var recurseAncestorsForHeaders = function(i, oColumn) {
        headers[i].push(oColumn._sId);
        if(oColumn.parent) {
            recurseAncestorsForHeaders(i, oColumn.parent);
        }
    };
    for(i=0; i<keys.length; i++) {
        headers[i] = [];
        recurseAncestorsForHeaders(i, keys[i]);
        headers[i] = headers[i].reverse();
    }

    // Save to the ColumnSet instance
    this.tree = tree;
    this.flat = flat;
    this.keys = keys;
    this.headers = headers;
};

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

/**
 * Public accessor to the definitions array.
 *
 * @method getDefinitions
 * @return {Object[]} Array of object literal definitions passed to the constructor.
 */

YAHOO.widget.ColumnSet.prototype.getDefinitions = function() {
    return this._aDefinitions;
};

/**
 * Returns Column instance with given ID.
 *
 * @method getColumnById
 * @param column {String} Column ID.
 * @return {YAHOO.widget.Column} Column instance.
 */

YAHOO.widget.ColumnSet.prototype.getColumnById = function(column) {
    if(YAHOO.lang.isString(column)) {
        var allColumns = this.flat;
        for(var i=allColumns.length-1; i>-1; i--) {
            if(allColumns[i]._sId === column) {
                return allColumns[i];
            }
        }
    }
    return null;
};

/**
 * Returns Column instance with given key or ColumnSet key index.
 *
 * @method getColumn
 * @param column {String | Number} Column key or ColumnSet key index.
 * @return {YAHOO.widget.Column} Column instance.
 */

YAHOO.widget.ColumnSet.prototype.getColumn = function(column) {
    if(YAHOO.lang.isNumber(column) && this.keys[column]) {
        return this.keys[column];
    }
    else if(YAHOO.lang.isString(column)) {
        var allColumns = this.flat;
        var aColumns = [];
        for(var i=0; i<allColumns.length; i++) {
            if(allColumns[i].key === column) {
                aColumns.push(allColumns[i]);
            }
        }
        if(aColumns.length === 1) {
            return aColumns[0];
        }
        else if(aColumns.length > 1) {
            return aColumns;
        }
    }
    return null;
};

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * The Column class defines and manages attributes of DataTable Columns
 *
 * @namespace YAHOO.widget
 * @class Column
 * @constructor
 * @param oConfigs {Object} Object literal of definitions.
 */
YAHOO.widget.Column = function(oConfigs) {
    // Object literal defines Column attributes
    if(oConfigs && (oConfigs.constructor == Object)) {
        for(var sConfig in oConfigs) {
            if(sConfig) {
                this[sConfig] = oConfigs[sConfig];
            }
        }
        
        //TODO: by reference or by value?
        this._oDefinition = oConfigs;
    }
};

/////////////////////////////////////////////////////////////////////////////
//
// Private member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Internal class variable to index multiple Column instances.
 *
 * @property Column._nCount
 * @type Number
 * @private
 * @static
 */
YAHOO.widget.Column._nCount = 0;

/**
 * Unique instance name.
 *
 * @property _sName
 * @type String
 * @private
 */
YAHOO.widget.Column.prototype._sName = null;

/**
 * Unique String identifier assigned at instantiation.
 *
 * @property _sId
 * @type String
 * @private
 */
YAHOO.widget.Column.prototype._sId = null;

/**
 * Object literal definition.
 *
 * @property _oDefinition
 * @type Object
 * @private
 */
YAHOO.widget.Column.prototype._oDefinition = null;

/**
 * Reference to Column's current position index within its ColumnSet's keys
 * array, if applicable. This property only applies to non-nested and bottom-
 * level child Columns.
 *
 * @property _nKeyIndex
 * @type Number
 * @private
 */
YAHOO.widget.Column.prototype._nKeyIndex = null;

/**
 * Reference to Column's current position index within its ColumnSet's tree
 * array, if applicable. This property only applies to non-nested and top-
 * level parent Columns.
 *
 * @property _nTreeIndex
 * @type Number
 * @private
 */
YAHOO.widget.Column.prototype._nTreeIndex = null;

/**
 * Number of table cells the Column spans.
 *
 * @property _nColspan
 * @type Number
 * @private
 */
YAHOO.widget.Column.prototype._nColspan = 1;

/**
 * Number of table rows the Column spans.
 *
 * @property _nRowspan
 * @type Number
 * @private
 */
YAHOO.widget.Column.prototype._nRowspan = 1;

/**
 * Column's parent Column instance, or null.
 *
 * @property _oParent
 * @type YAHOO.widget.Column
 * @private
 */
YAHOO.widget.Column.prototype._oParent = null;

/**
 * The DOM reference the associated COL element.
 *
 * @property _elCol
 * @type HTMLElement
 * @private
 */
//YAHOO.widget.Column.prototype._elCol = null;

/**
 * The DOM reference to the associated TH element.
 *
 * @property _elTh
 * @type HTMLElement
 * @private
 */
YAHOO.widget.Column.prototype._elTh = null;

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
 * Text or HTML for display as Column's label in the TH element.
 *
 * @property label
 * @type String
 */
YAHOO.widget.Column.prototype.label = null;

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
 * Minimum Column width (in pixels).
 *
 * @property minWidth
 * @type Number
 */
YAHOO.widget.Column.prototype.minWidth = 10;

/**
 * Custom CSS class or array of classes to be applied to every cell in the Column.
 *
 * @property className
 * @type String || String[]
 */
YAHOO.widget.Column.prototype.className = null;

/**
 * Defines a format function.
 *
 * @property formatter
 * @type String || HTMLFunction
 */
YAHOO.widget.Column.prototype.formatter = null;

/**
 * Defines an editor function, otherwise Column is not editable.
 *
 * @property editor
 * @type String || HTMLFunction
 */
YAHOO.widget.Column.prototype.editor = null;

/**
 * Defines editor options for Column in an object literal of param:value pairs.
 *
 * @property editorOptions
 * @type Object
 */
YAHOO.widget.Column.prototype.editorOptions = null;

/**
 * True if Column is resizeable, false otherwise. The Drag & Drop Utility is
 * required to enable this feature.
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
 * Default sort order for Column: "asc" or "desc".
 *
 * @property sortOptions.defaultOrder
 * @type String
 * @default null
 */
/**
 * Custom sort handler.
 *
 * @property sortOptions.sortFunction
 * @type Function
 * @default null
 */
YAHOO.widget.Column.prototype.sortOptions = null;















/////////////////////////////////////////////////////////////////////////////
//
// Public methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Public accessor to the unique name of the Column instance.
 *
 * @method toString
 * @return {String} Column's unique name.
 */
YAHOO.widget.Column.prototype.toString = function() {
    return this._sName;
};

/**
 * Returns unique ID string.
 *
 * @method getId
 * @return {String} Unique ID string.
 */
YAHOO.widget.Column.prototype.getId = function() {
    return this._sId;
};

/**
 * Returns object literal definition.
 *
 * @method getDefinition
 * @return {Object} Object literal definition.
 */
YAHOO.widget.Column.prototype.getDefinition = function() {
    return this._oDefinition;
};

/**
 * Returns unique Column key.
 *
 * @method getKey
 * @return {String} Column key.
 */
YAHOO.widget.Column.prototype.getKey = function() {
    return this.key;
};

/**
 * Public accessor returns Column's current position index within its
 * ColumnSet's keys array, if applicable. Only non-nested and bottom-level
 * child Columns will return a value.
 *
 * @method getKeyIndex
 * @return {Number} Position index, or null.
 */
YAHOO.widget.Column.prototype.getKeyIndex = function() {
    return this._nKeyIndex;
};

/**
 * Public accessor returns Column's current position index within its
 * ColumnSet's tree array, if applicable. Only non-nested and top-level parent
 * Columns will return a value;
 *
 * @method getTreeIndex
 * @return {Number} Position index, or null.
 */
YAHOO.widget.Column.prototype.getTreeIndex = function() {
    return this._nTreeIndex;
};

/**
 * Public accessor returns Column's parent instance if any, or null otherwise.
 *
 * @method getParent
 * @return {YAHOO.widget.Column} Column's parent instance.
 */
YAHOO.widget.Column.prototype.getParent = function() {
    return this._oParent;
};

/**
 * Public accessor returns Column's calculated COLSPAN value.
 *
 * @method getColspan
 * @return {Number} Column's COLSPAN value.
 */
YAHOO.widget.Column.prototype.getColspan = function() {
    return this._nColspan;
};
// Backward compatibility
YAHOO.widget.Column.prototype.getColSpan = function() {
    YAHOO.log("The method getColSpan() has been" +
    " deprecated in favor of getColspan()", "warn", this.toString());
    return this.getColspan();
};

/**
 * Public accessor returns Column's calculated ROWSPAN value.
 *
 * @method getRowspan
 * @return {Number} Column's ROWSPAN value.
 */
YAHOO.widget.Column.prototype.getRowspan = function() {
    return this._nRowspan;
};

/**
 * Returns DOM reference to associated COL element.
 *
 * @method getColEl
 * @return {HTMLElement} COL element.
 */
YAHOO.widget.Column.prototype.getColEl = function() {
    //return this._elCol;
};

/**
 * Returns DOM reference to the key TH element.
 *
 * @method getThEl
 * @return {HTMLElement} TH element.
 */
YAHOO.widget.Column.prototype.getThEl = function() {
    return this._elTh;
};

// Backward compatibility
YAHOO.widget.Column.prototype.getIndex = function() {
    YAHOO.log("The method getIndex() has been" +
    " deprecated in favor of getKeyIndex()", "warn",
    this.toString());
    return this.getKeyIndex();
};
YAHOO.widget.Column.prototype.format = function() {
    YAHOO.log("The method format() has been deprecated in favor of the " +
    "DataTable method formatCell()", "error", this.toString());
};
YAHOO.widget.Column.formatCheckbox = function(elCell, oRecord, oColumn, oData) {
    YAHOO.log("The method YAHOO.widget.Column.formatCheckbox() has been" +
    " deprecated in favor of YAHOO.widget.DataTable.formatCheckbox()", "warn",
    "YAHOO.widget.Column.formatCheckbox");
    YAHOO.widget.DataTable.formatCheckbox(elCell, oRecord, oColumn, oData);
};
YAHOO.widget.Column.formatCurrency = function(elCell, oRecord, oColumn, oData) {
    YAHOO.log("The method YAHOO.widget.Column.formatCurrency() has been" +
    " deprecated in favor of YAHOO.widget.DataTable.formatCurrency()", "warn",
    "YAHOO.widget.Column.formatCurrency");
    YAHOO.widget.DataTable.formatCurrency(elCell, oRecord, oColumn, oData);
};
YAHOO.widget.Column.formatDate = function(elCell, oRecord, oColumn, oData) {
    YAHOO.log("The method YAHOO.widget.Column.formatDate() has been" +
    " deprecated in favor of YAHOO.widget.DataTable.formatDate()", "warn",
    "YAHOO.widget.Column.formatDate");
    YAHOO.widget.DataTable.formatDate(elCell, oRecord, oColumn, oData);
};
YAHOO.widget.Column.formatEmail = function(elCell, oRecord, oColumn, oData) {
    YAHOO.log("The method YAHOO.widget.Column.formatEmail() has been" +
    " deprecated in favor of YAHOO.widget.DataTable.formatEmail()", "warn",
    "YAHOO.widget.Column.formatEmail");
    YAHOO.widget.DataTable.formatEmail(elCell, oRecord, oColumn, oData);
};
YAHOO.widget.Column.formatLink = function(elCell, oRecord, oColumn, oData) {
    YAHOO.log("The method YAHOO.widget.Column.formatLink() has been" +
    " deprecated in favor of YAHOO.widget.DataTable.formatLink()", "warn",
    "YAHOO.widget.Column.formatLink");
    YAHOO.widget.DataTable.formatLink(elCell, oRecord, oColumn, oData);
};
YAHOO.widget.Column.formatNumber = function(elCell, oRecord, oColumn, oData) {
    YAHOO.log("The method YAHOO.widget.Column.formatNumber() has been" +
    " deprecated in favor of YAHOO.widget.DataTable.formatNumber()", "warn",
    "YAHOO.widget.Column.formatNumber");
    YAHOO.widget.DataTable.formatNumber(elCell, oRecord, oColumn, oData);
};
YAHOO.widget.Column.formatSelect = function(elCell, oRecord, oColumn, oData) {
    YAHOO.log("The method YAHOO.widget.Column.formatSelect() has been" +
    " deprecated in favor of YAHOO.widget.DataTable.formatDropdown()", "warn",
    "YAHOO.widget.Column.formatSelect");
    YAHOO.widget.DataTable.formatDropdown(elCell, oRecord, oColumn, oData);
};

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * Sort static utility to support Column sorting.
 *
 * @namespace YAHOO.util
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
     * Comparator function for simple case-insensitive string sorting.
     *
     * @method compare
     * @param a {Object} First sort argument.
     * @param b {Object} Second sort argument.
     * @param desc {Boolean} True if sort direction is descending, false if
     * sort direction is ascending.
     */
    compare: function(a, b, desc) {
        if((a === null) || (typeof a == "undefined")) {
            if((b === null) || (typeof b == "undefined")) {
                return 0;
            }
            else {
                return 1;
            }
        }
        else if((b === null) || (typeof b == "undefined")) {
            return -1;
        }

        if(a.constructor == String) {
            a = a.toLowerCase();
        }
        if(b.constructor == String) {
            b = b.toLowerCase();
        }
        if(a < b) {
            return (desc) ? 1 : -1;
        }
        else if (a > b) {
            return (desc) ? -1 : 1;
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
 * ColumnResizer subclasses DragDrop to support resizeable Columns.
 *
 * @namespace YAHOO.util
 * @class ColumnResizer
 * @extends YAHOO.util.DragDrop
 * @constructor
 * @param oDataTable {YAHOO.widget.DataTable} DataTable instance.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @param elThead {HTMLElement} TH element reference.
 * @param sHandleElId {String} DOM ID of the handle element that causes the resize.
 * @param sGroup {String} Group name of related DragDrop items.
 * @param oConfig {Object} (Optional) Object literal of config values.
 */
YAHOO.util.ColumnResizer = function(oDataTable, oColumn, elThead, sHandleId, elProxy, oConfig) {
    if(oDataTable && oColumn && elThead && sHandleId) {
        this.datatable = oDataTable;
        this.column = oColumn;
        this.headCell = elThead;
        this.headLabel = elThead.firstChild.firstChild;
        this.init(sHandleId, sHandleId, {dragOnly:true, dragElId: elProxy.id});
        this.initFrame(); // Needed for proxy
        this.nOrigScrollTop = null; // Needed for IE fixed scrolling workaround 1118318
        //this.resetResizerPosition();
    }
    else {
        YAHOO.log("Column resizer could not be created due to invalid colElId","warn");
    }
};

if(YAHOO.util.DD) {
    YAHOO.util.DragDropMgr.clickTimeThresh = 1;
    YAHOO.extend(YAHOO.util.ColumnResizer, YAHOO.util.DDProxy);
}

/////////////////////////////////////////////////////////////////////////////
//
// Public methods
//
/////////////////////////////////////////////////////////////////////////////
YAHOO.util.ColumnResizer.prototype.resetResizerPosition = function() {
    /*var elResizer = YAHOO.util.Dom.get(this.handleElId);
    var resizerStyle = elResizer.style;
    this.headCell.firstChild.style.position = "relative";
    resizerStyle.left = (this.headCell.firstChild.offsetLeft + this.headCell.firstChild.offsetWidth - elResizer.offsetWidth) + "px";
    resizerStyle.right = "auto";
    resizerStyle.top = this.headCell.firstChild.offsetTop + "px";
    resizerStyle.bottom = "auto";
    resizerStyle.height = this.headCell.firstChild.offsetHeight + "px";
    this.headCell.firstChild.style.position = "";*/
};

/////////////////////////////////////////////////////////////////////////////
//
// Public DOM event handlers
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Handles mouseup events on the Column resizer.
 *
 * @method onMouseUp
 * @param e {string} The mouseup event
 */
YAHOO.util.ColumnResizer.prototype.onMouseUp = function(e) {
    this.bodyCell = null;

    // IE workaround for bug 1118318:
    // ...reinstate scrolltop
    /*if(this.nOrigScrollTop !== null) {
        //this.datatable._elContainer.scrollTop = this.nOrigScrollTop; // This doesn't work for some reason...
    }
    
    if(this.datatable.bFixedScrollBlockWorkaround) {
        this.datatable.syncColWidths();
    }*/

    var elResizer = YAHOO.util.Dom.get(this.handleElId);
    var resizerStyle = YAHOO.util.Dom.get(this.handleElId).style;
    resizerStyle.left = "auto";
    resizerStyle.right = 0;
    resizerStyle.top = "auto";
    resizerStyle.bottom = 0;
    
    this.datatable.fireEvent("columnResizeEvent", {column:this.column,target:this.headCell});
};

/**
 * Handles mousedown events on the Column resizer.
 *
 * @method onMouseDown
 * @param e {string} The mousedown event
 */
YAHOO.util.ColumnResizer.prototype.onMouseDown = function(e) {
    /*// IE workaround for bug 1118318:
    // Reset any scrolltop...
    this.nOrigScrollTop = null;
    if(this.datatable._elContainer.scrollTop > 0) {
        this.nOrigScrollTop = this.datatable._elContainer.scrollTop;
        this.datatable._elContainer.scrollTop = 0;
    }*/

    this.startWidth = this.headCell.firstChild.offsetWidth;
    this.startX = YAHOO.util.Event.getXY(e)[0];
    
    //TODO: make this configurable
    //var minWidth = 10;
    //var minWidth = parseInt(YAHOO.util.Dom.getStyle(this.headCell.firstChild,"paddingLeft"),10) || 0;
    //minWidth += parseInt(YAHOO.util.Dom.getStyle(this.headCell.firstChild,"paddingRight"),10) || 0;
    //minWidth += this.headCell.firstChild.firstChild.offsetWidth;
    //YAHOO.log(YAHOO.util.Dom.getStyle(this.headCell.firstChild,"paddingLeft"), "warn");
    //YAHOO.log(YAHOO.util.Dom.getStyle(this.headCell.firstChild,"paddingRight"), "warn");
    //YAHOO.log("minwidth " + minWidth,"time");

    if(this.datatable.getTbodyEl() && (this.datatable.getTbodyEl().rows.length > 0)) {
        this.bodyCell = this.datatable.getTbodyEl().rows[0].cells[this.headCell.yuiCellIndex];
    }

    //this.minWidth = minWidth;
};

/**
 * Handles drag events on the Column resizer.
 *
 * @method onDrag
 * @param e {string} The drag event
 */
YAHOO.util.ColumnResizer.prototype.onDrag = function(e) {
    var newX = YAHOO.util.Event.getXY(e)[0];
    if(newX > YAHOO.util.Dom.getX(this.headCell.firstChild)) {
        var offsetX = newX - this.startX;
        var newWidth = this.startWidth + offsetX;
        YAHOO.log("newwidth " + newWidth,"time");
        //if(newWidth > this.minWidth) {
            this.datatable.setColumnWidth(this.column, newWidth);
        //}
    }
};


/*YAHOO.widget.DataTable.prototype.syncColWidths = function() {
    var elHeadCell, elBodyCell, elHeadCellWidth, elBodyCellWidth, nWidth, i;

    // First pass make all body cells equal to head cells
    //for(i=this._oColumnSet.keys.length-1; i>-1; i--) {
    for(i=0; i<this._oColumnSet.keys.length; i++) {
        elHeadCell = this.getTheadEl().rows[this.getTheadEl().rows.length-1].cells[i];
        elBodyCell = this.getTbodyEl().rows[0].cells[i];
        elHeadCellWidth = elHeadCell.offsetWidth;
        elBodyCellWidth = elBodyCell.offsetWidth;

        if(elBodyCellWidth < elHeadCellWidth) {
            nWidth = elHeadCellWidth;
            elBodyCell.style.width = nWidth + "px";

            // Sync up offsets
            if(elHeadCellWidth > elBodyCellWidth) {
                if(elBodyCell.offsetWidth > elHeadCell.offsetWidth) {
                    nWidth -= (elBodyCell.offsetWidth - elHeadCell.offsetWidth);
                    elBodyCell.style.width = nWidth + "px";
                }
            }
            else if(elBodyCellWidth > elHeadCellWidth) {
                elHeadCell.style.width = nWidth + "px";
                if(elHeadCell.offsetWidth > elBodyCell.offsetWidth) {
                    nWidth -= (elHeadCell.offsetWidth - elBodyCell.offsetWidth);
                    elHeadCell.style.width = nWidth + "px";
                }
            }
        }
    }
    // Second pass make any too-narrow head cells equal to body cells
    for(i=0; i<this._oColumnSet.keys.length; i++) {
        elHeadCell = this.getTheadEl().rows[this.getTheadEl().rows.length-1].cells[i];
        elBodyCell = this.getTbodyEl().rows[0].cells[i];
        elHeadCellWidth = elHeadCell.offsetWidth;
        elBodyCellWidth = elBodyCell.offsetWidth;

        if(elBodyCellWidth > elHeadCellWidth) {
            elHeadCell.style.width = elBodyCellWidth + "px";

            // Sync up offsets
            if(elHeadCellWidth > elBodyCellWidth) {
                nWidth = elHeadCellWidth;
                if(elBodyCell.offsetWidth > elHeadCell.offsetWidth) {
                    nWidth -= (elBodyCell.offsetWidth - elHeadCell.offsetWidth);
                    elBodyCell.style.width = nWidth + "px";
                }
            }
            else if(elBodyCellWidth > elHeadCellWidth) {
                nWidth = elBodyCellWidth;
                elHeadCell.style.width = nWidth + "px";
                if(elHeadCell.offsetWidth > elBodyCell.offsetWidth) {
                    nWidth -= (elHeadCell.offsetWidth - elBodyCell.offsetWidth);
                    elHeadCell.style.width = nWidth + "px";
                }
            }
        }
    }
    
    
    
    
var elHeadCell, elBodyCell, elHeadCellWidth, elBodyCellWidth, nWidth, i;

     // First pass make all body cells equal to head cells
     //for(i=this._oColumnSet.keys.length-1; i>-1; i--) {
     for(i=0; i<this._oColumnSet.keys.length; i++) {
         elHeadCell = this.getTheadEl().rows[this.getTheadEl().rows.length-1].cells[i];
         elBodyCell = this.getTbodyEl().rows[0].cells[i];
         elHeadCellWidth = elHeadCell.offsetWidth;
         elBodyCellWidth = elBodyCell.offsetWidth;

         if(elBodyCellWidth < elHeadCellWidth) {
             nWidth = elHeadCellWidth;
             elBodyCell.style.width = nWidth + "px";

             // Sync up offsets
             if(elHeadCellWidth > elBodyCellWidth) {
                 if(elBodyCell.offsetWidth > elHeadCell.offsetWidth) {
                     nWidth -= (elBodyCell.offsetWidth - elHeadCell.offsetWidth);
                     elBodyCell.style.width = nWidth + "px";
                 }
             }
             else if(elBodyCellWidth > elHeadCellWidth) {
                 elHeadCell.style.width = nWidth + "px";
                 if(elHeadCell.offsetWidth > elBodyCell.offsetWidth) {
                     nWidth -= (elHeadCell.offsetWidth - elBodyCell.offsetWidth);
                     elHeadCell.style.width = nWidth + "px";
                 }
             }
         }
     }
     // Second pass make any too-narrow head cells equal to body cells
     for(i=0; i<this._oColumnSet.keys.length; i++) {
         elHeadCell = this.getTheadEl().rows[this.getTheadEl().rows.length-1].cells[i];
         elBodyCell = this.getTbodyEl().rows[0].cells[i];
         elHeadCellWidth = elHeadCell.offsetWidth;
         elBodyCellWidth = elBodyCell.offsetWidth;

         if(elBodyCellWidth > elHeadCellWidth) {
             elHeadCell.style.width = elBodyCellWidth + "px";

             // Sync up offsets
             if(elHeadCellWidth > elBodyCellWidth) {
                 nWidth = elHeadCellWidth;
                 if(elBodyCell.offsetWidth > elHeadCell.offsetWidth) {
                     nWidth -= (elBodyCell.offsetWidth - elHeadCell.offsetWidth);
                     elBodyCell.style.width = nWidth + "px";
                 }
             }
             else if(elBodyCellWidth > elHeadCellWidth) {
                 nWidth = elBodyCellWidth;
                 elHeadCell.style.width = nWidth + "px";
                 if(elHeadCell.offsetWidth > elBodyCell.offsetWidth) {
                     nWidth -= (elHeadCell.offsetWidth - elBodyCell.offsetWidth);
                     elHeadCell.style.width = nWidth + "px";
                 }
             }
         }
     }
 };*/


