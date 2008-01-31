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
 * @param aDefinitions {Object[]} Array of object literals that define cells in
 * the THEAD.
 */
YAHOO.widget.ColumnSet = function(aDefinitions) {
    this._sId = "yui-cs" + YAHOO.widget.ColumnSet._nCount;

    // First clone the defs
    aDefinitions = YAHOO.widget.DataTable._cloneObject(aDefinitions);
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

YAHOO.widget.ColumnSet.prototype = {
    /**
     * Unique instance name.
     *
     * @property _sId
     * @type String
     * @private
     */
    _sId : null,

    /**
     * Array of object literal Column definitions passed to the constructor.
     *
     * @property _aDefinitions
     * @type Object[]
     * @private
     */
    _aDefinitions : null,

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
    tree : null,

    /**
     * Flattened representation of all Columns.
     *
     * @property flat
     * @type YAHOO.widget.Column[]
     * @default []
     */
    flat : null,

    /**
     * Array of Columns that map one-to-one to a table column.
     *
     * @property keys
     * @type YAHOO.widget.Column[]
     * @default []
     */
    keys : null,

    /**
     * ID index of nested parent hierarchies for HEADERS accessibility attribute.
     *
     * @property headers
     * @type String[]
     * @default []
     */
    headers : null,

    /////////////////////////////////////////////////////////////////////////////
    //
    // Private methods
    //
    /////////////////////////////////////////////////////////////////////////////

    /**
     * Initializes ColumnSet instance with data from Column definitions.
     *
     * @method _init
     * @param aDefinitions {Object[]} Array of object literals that define cells in
     * the THEAD .
     * @private
     */

    _init : function(aDefinitions) {        
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

        // Internal recursive function to define Column instances
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
                
                // Assign unique ID to Column and cross-reference it back to the
                // original object literal definition
                currentNode.yuiColumnId = oColumn._sId = YAHOO.widget.Column._nCount + "";
                
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

            // Store the array
            this._aDefinitions = aDefinitions;
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
    },

    /////////////////////////////////////////////////////////////////////////////
    //
    // Public methods
    //
    /////////////////////////////////////////////////////////////////////////////

    /**
     * Returns unique name of the ColumnSet instance.
     *
     * @method getId
     * @return {String} Unique name of the ColumnSet instance.
     */

    getId : function() {
        return this._sId;
    },

    /**
     * ColumnSet instance name, for logging.
     *
     * @method toString
     * @return {String} Unique name of the ColumnSet instance.
     */

    toString : function() {
        return "ColumnSet instance " + this._sId;
    },

    /**
     * Public accessor to the definitions array.
     *
     * @method getDefinitions
     * @return {Object[]} Array of object literal Column definitions.
     */

    getDefinitions : function() {
        var aDefinitions = this._aDefinitions;
        
        // Internal recursive function to define Column instances
        var parseColumns = function(nodeList, oSelf) {
            // Parse each node at this depth for attributes and any children
            for(var j=0; j<nodeList.length; j++) {
                var currentNode = nodeList[j];
                
                // Get the Column for each node
                var oColumn = oSelf.getColumnById(currentNode.yuiColumnId);
                
                if(oColumn) {    
                    // Update the definition
                    currentNode.abbr = oColumn.abbr;
                    currentNode.className = oColumn.className;
                    currentNode.editor = oColumn.editor;
                    currentNode.editorOptions = oColumn.editorOptions;
                    currentNode.formatter = oColumn.formatter;
                    currentNode.hidden = oColumn.hidden;
                    currentNode.key = oColumn.key;
                    currentNode.label = oColumn.label;
                    currentNode.minWidth = oColumn.minWidth;
                    currentNode.resizeable = oColumn.resizeable;
                    currentNode.selected = oColumn.selected;
                    currentNode.sortable = oColumn.sortable;
                    currentNode.sortOptions = oColumn.sortOptions;
                    currentNode.width = oColumn.width;
                }
                            
                // The Column has descendants
                if(YAHOO.lang.isArray(currentNode.children)) {
                    // The children themselves must also be parsed for Column instances
                    parseColumns(currentNode.children, oSelf);
                }
            }
        };

        parseColumns(aDefinitions, this);
        this._aDefinitions = aDefinitions;
        return aDefinitions;
    },

    /**
     * Returns Column instance with given ID.
     *
     * @method getColumnById
     * @param column {String} Column ID.
     * @return {YAHOO.widget.Column} Column instance.
     */

    getColumnById : function(column) {
        if(YAHOO.lang.isString(column)) {
            var allColumns = this.flat;
            for(var i=allColumns.length-1; i>-1; i--) {
                if(allColumns[i]._sId === column) {
                    return allColumns[i];
                }
            }
        }
        return null;
    },

    /**
     * Returns Column instance with given key or ColumnSet key index.
     *
     * @method getColumn
     * @param column {String | Number} Column key or ColumnSet key index.
     * @return {YAHOO.widget.Column} Column instance.
     */

    getColumn : function(column) {
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
    },

    /**
     * Public accessor returns array of given Column's desendants (if any), including itself.
     *
     * @method getDescendants
     * @parem {YAHOO.widget.Column} Column instance.
     * @return {Array} Array including the Column itself and all descendants (if any).
     */
    getDescendants : function(oColumn) {
        var oSelf = this;
        var allDescendants = [];
        var i;

        // Recursive function to loop thru all children
        var parse = function(oParent) {
            allDescendants.push(oParent);
            // This Column has children
            if(oParent.children) {
                for(i=0; i<oParent.children.length; i++) {
                    parse(oSelf.getColumn(oParent.children[i].key));
                }
            }
        };
        parse(oColumn);

        return allDescendants;
    }
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
   }
    // Backward compatibility
    if(this.width && !YAHOO.lang.isNumber(this.width)) {
        this.width = null;
        YAHOO.log("The Column property width must be a number", "warn", this.toString());
    }
};

/////////////////////////////////////////////////////////////////////////////
//
// Private member variables
//
/////////////////////////////////////////////////////////////////////////////

YAHOO.lang.augmentObject(YAHOO.widget.Column, {
    /**
     * Internal class variable to index multiple Column instances.
     *
     * @property Column._nCount
     * @type Number
     * @private
     * @static
     */
    _nCount : 0,

    formatCheckbox : function(elCell, oRecord, oColumn, oData) {
        YAHOO.log("The method YAHOO.widget.Column.formatCheckbox() has been" +
        " deprecated in favor of YAHOO.widget.DataTable.formatCheckbox()", "warn",
        "YAHOO.widget.Column.formatCheckbox");
        YAHOO.widget.DataTable.formatCheckbox(elCell, oRecord, oColumn, oData);
    },

    formatCurrency : function(elCell, oRecord, oColumn, oData) {
        YAHOO.log("The method YAHOO.widget.Column.formatCurrency() has been" +
        " deprecated in favor of YAHOO.widget.DataTable.formatCurrency()", "warn",
        "YAHOO.widget.Column.formatCurrency");
        YAHOO.widget.DataTable.formatCurrency(elCell, oRecord, oColumn, oData);
    },

    formatDate : function(elCell, oRecord, oColumn, oData) {
        YAHOO.log("The method YAHOO.widget.Column.formatDate() has been" +
        " deprecated in favor of YAHOO.widget.DataTable.formatDate()", "warn",
        "YAHOO.widget.Column.formatDate");
        YAHOO.widget.DataTable.formatDate(elCell, oRecord, oColumn, oData);
    },

    formatEmail : function(elCell, oRecord, oColumn, oData) {
        YAHOO.log("The method YAHOO.widget.Column.formatEmail() has been" +
        " deprecated in favor of YAHOO.widget.DataTable.formatEmail()", "warn",
        "YAHOO.widget.Column.formatEmail");
        YAHOO.widget.DataTable.formatEmail(elCell, oRecord, oColumn, oData);
    },

    formatLink : function(elCell, oRecord, oColumn, oData) {
        YAHOO.log("The method YAHOO.widget.Column.formatLink() has been" +
        " deprecated in favor of YAHOO.widget.DataTable.formatLink()", "warn",
        "YAHOO.widget.Column.formatLink");
        YAHOO.widget.DataTable.formatLink(elCell, oRecord, oColumn, oData);
    },

    formatNumber : function(elCell, oRecord, oColumn, oData) {
        YAHOO.log("The method YAHOO.widget.Column.formatNumber() has been" +
        " deprecated in favor of YAHOO.widget.DataTable.formatNumber()", "warn",
        "YAHOO.widget.Column.formatNumber");
        YAHOO.widget.DataTable.formatNumber(elCell, oRecord, oColumn, oData);
    },

    formatSelect : function(elCell, oRecord, oColumn, oData) {
        YAHOO.log("The method YAHOO.widget.Column.formatSelect() has been" +
        " deprecated in favor of YAHOO.widget.DataTable.formatDropdown()", "warn",
        "YAHOO.widget.Column.formatSelect");
        YAHOO.widget.DataTable.formatDropdown(elCell, oRecord, oColumn, oData);
    }
});

YAHOO.widget.Column.prototype = {
    /**
     * Unique String identifier assigned at instantiation.
     *
     * @property _sId
     * @type String
     * @private
     */
    _sId : null,

    /**
     * Object literal definition
     *
     * @property _oDefinition
     * @type Object
     * @private
     */
    _oDefinition : null,

    /**
     * Reference to Column's current position index within its ColumnSet's keys
     * array, if applicable. This property only applies to non-nested and bottom-
     * level child Columns.
     *
     * @property _nKeyIndex
     * @type Number
     * @private
     */
    _nKeyIndex : null,

    /**
     * Reference to Column's current position index within its ColumnSet's tree
     * array, if applicable. This property only applies to non-nested and top-
     * level parent Columns.
     *
     * @property _nTreeIndex
     * @type Number
     * @private
     */
    _nTreeIndex : null,

    /**
     * Number of table cells the Column spans.
     *
     * @property _nColspan
     * @type Number
     * @private
     */
    _nColspan : 1,

    /**
     * Number of table rows the Column spans.
     *
     * @property _nRowspan
     * @type Number
     * @private
     */
    _nRowspan : 1,

    /**
     * Column's parent Column instance, or null.
     *
     * @property _oParent
     * @type YAHOO.widget.Column
     * @private
     */
    _oParent : null,

    /*TODO: remove
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
    _elTh : null,

    /**
     * The DOM reference to the associated resizerelement (if any).
     *
     * @property _elResizer
     * @type HTMLElement
     * @private
     */
    _elResizer : null,

    /**
     * For unreg() purposes, a reference to the Column's DragDrop instance.
     *
     * @property _dd
     * @type YAHOO.util.DragDrop
     * @private
     */
    _dd : null,

    /**
     * For unreg() purposes, a reference to the Column resizer's DragDrop instance.
     *
     * @property _ddResizer
     * @type YAHOO.util.DragDrop
     * @private
     */
    _ddResizer : null,

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
    key : null,

    /**
     * Text or HTML for display as Column's label in the TH element.
     *
     * @property label
     * @type String
     */
    label : null,

    /**
     * Column head cell ABBR for accessibility.
     *
     * @property abbr
     * @type String
     */
    abbr : null,

    /**
     * Array of object literals that define children (nested headers) of a Column.
     *
     * @property children
     * @type Object[]
     */
    children : null,

    /**
     * Column width (in pixels).
     *
     * @property width
     * @type Number
     */
    width : null,

    /**
     * Minimum Column width (in pixels).
     *
     * @property minWidth
     * @type Number
     * @default 10
     */
    minWidth : 10,

    /**
     * True if Column is in hidden state.
     *
     * @property hidden
     * @type Boolean
     * @default false     
     */
    hidden : false,

    /**
     * True if Column is in selected state.
     *
     * @property selected
     * @type Boolean
     * @default false     
     */
    selected : false,

    /**
     * Custom CSS class or array of classes to be applied to every cell in the Column.
     *
     * @property className
     * @type String || String[]
     */
    className : null,

    /**
     * Defines a format function.
     *
     * @property formatter
     * @type String || HTMLFunction
     */
    formatter : null,

    /**
     * Defines an editor function, otherwise Column is not editable.
     *
     * @property editor
     * @type String || HTMLFunction
     */
    editor : null,

    /**
     * Defines editor options for Column in an object literal of param:value pairs.
     *
     * @property editorOptions
     * @type Object
     */
    editorOptions : null,

    /**
     * True if Column is resizeable, false otherwise. The Drag & Drop Utility is
     * required to enable this feature. Only bottom-level and non-nested Columns are
     * resizeble. 
     *
     * @property resizeable
     * @type Boolean
     * @default false
     */
    resizeable : false,

    /**
     * True if Column is sortable, false otherwise.
     *
     * @property sortable
     * @type Boolean
     * @default false
     */
    sortable : false,

    /**
     * @property sortOptions.defaultOrder
     * @deprecated Use sortOptions.defaultDir.
     */
    /**
     * Default sort direction for Column: YAHOO.widget.DataTable.CLASS_ASC or YAHOO.widget.DataTable.CLASS_DESC.
     *
     * @property sortOptions.defaultDir
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
    sortOptions : null,















    /////////////////////////////////////////////////////////////////////////////
    //
    // Public methods
    //
    /////////////////////////////////////////////////////////////////////////////

    /**
     * Returns unique ID string.
     *
     * @method getId
     * @return {String} Unique ID string.
     */
    getId : function() {
        return this._sId;
    },

    /**
     * Column instance name, for logging.
     *
     * @method toString
     * @return {String} Column's unique name.
     */
    toString : function() {
        return "Column instance " + this._sId;
    },

    /**
     * Returns object literal definition.
     *
     * @method getDefinition
     * @return {Object} Object literal definition.
     */
    getDefinition : function() {
        var oDefinition = this._oDefinition;
        
        // Update the definition
        oDefinition.abbr = this.abbr;
        oDefinition.className = this.className;
        oDefinition.editor = this.editor;
        oDefinition.editorOptions = this.editorOptions;
        oDefinition.formatter = this.formatter;
        oDefinition.key = this.key;
        oDefinition.label = this.label;
        oDefinition.minWidth = this.minWidth;
        oDefinition.resizeable = this.resizeable;
        oDefinition.sortable = this.sortable;
        oDefinition.sortOptions = this.sortOptions;
        oDefinition.width = this.width;

        return oDefinition;
    },

    /**
     * Returns unique Column key.
     *
     * @method getKey
     * @return {String} Column key.
     */
    getKey : function() {
        return this.key;
    },

    /**
     * Public accessor returns Column's current position index within its
     * ColumnSet's keys array, if applicable. Only non-nested and bottom-level
     * child Columns will return a value.
     *
     * @method getKeyIndex
     * @return {Number} Position index, or null.
     */
    getKeyIndex : function() {
        return this._nKeyIndex;
    },

    /**
     * Public accessor returns Column's current position index within its
     * ColumnSet's tree array, if applicable. Only non-nested and top-level parent
     * Columns will return a value;
     *
     * @method getTreeIndex
     * @return {Number} Position index, or null.
     */
    getTreeIndex : function() {
        return this._nTreeIndex;
    },

    /**
     * Public accessor returns Column's parent instance if any, or null otherwise.
     *
     * @method getParent
     * @return {YAHOO.widget.Column} Column's parent instance.
     */
    getParent : function() {
        return this._oParent;
    },

    /**
     * Public accessor returns Column's calculated COLSPAN value.
     *
     * @method getColspan
     * @return {Number} Column's COLSPAN value.
     */
    getColspan : function() {
        return this._nColspan;
    },
    // Backward compatibility
    getColSpan : function() {
        YAHOO.log("The method getColSpan() has been" +
        " deprecated in favor of getColspan()", "warn", this.toString());
        return this.getColspan();
    },

    /**
     * Public accessor returns Column's calculated ROWSPAN value.
     *
     * @method getRowspan
     * @return {Number} Column's ROWSPAN value.
     */
    getRowspan : function() {
        return this._nRowspan;
    },

    /**
     * Returns DOM reference to the key TH element.
     *
     * @method getThEl
     * @return {HTMLElement} TH element.
     */
    getThEl : function() {
        return this._elTh;
    },

    /**
     * Returns DOM reference to the resizer element, or null.
     *
     * @method getResizerEl
     * @return {HTMLElement} DIV element.
     */
    getResizerEl : function() {
        return this._elResizer;
    },

    // Backward compatibility
    /**
     * @method getColEl
     * @deprecated Use getThEl
     */
    getColEl : function() {
        YAHOO.log("The method getColEl() has been" +
        " deprecated in favor of getThEl()", "warn",
        this.toString());
        return this.getThEl();
    },
    getIndex : function() {
        YAHOO.log("The method getIndex() has been" +
        " deprecated in favor of getKeyIndex()", "warn",
        this.toString());
        return this.getKeyIndex();
    },
    format : function() {
        YAHOO.log("The method format() has been deprecated in favor of the " +
        "DataTable method formatCell()", "error", this.toString());
    }
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
 * ColumnDD subclasses DragDrop to support rearrangeable Columns.
 *
 * @namespace YAHOO.util
 * @class ColumnDD
 * @extends YAHOO.util.DDProxy
 * @constructor
 * @param oDataTable {YAHOO.widget.DataTable} DataTable instance.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @param elTh {HTMLElement} TH element reference.
 * @param elTarget {HTMLElement} Drag target element.
 */
YAHOO.widget.ColumnDD = function(oDataTable, oColumn, elTh, elTarget) {
    if(oDataTable && oColumn && elTh && elTarget) {
        this.datatable = oDataTable;
        this.table = oDataTable.getTheadEl().parentNode;
        this.column = oColumn;
        this.headCell = elTh;
        this.pointer = elTarget;
        this.newIndex = null;
        this.init(elTh);
        this.initFrame(); // Needed for DDProxy
        this.invalidHandleTypes = {};

        //Set padding to account for children of nested columns
        this.setPadding(10, 0, (this.datatable.getTheadEl().offsetHeight + 10) , 0);
    }
    else {
        YAHOO.log("Column dragdrop could not be created","warn");
    }
};

if(YAHOO.util.DDProxy) {
    YAHOO.extend(YAHOO.widget.ColumnDD, YAHOO.util.DDProxy, {
        initConstraints: function() {
            //Get the top, right, bottom and left positions
            var region = YAHOO.util.Dom.getRegion(this.table),
                //Get the element we are working on
                el = this.getEl(),
                //Get the xy position of it
                xy = YAHOO.util.Dom.getXY(el),
                //Get the width and height
                width = parseInt(YAHOO.util.Dom.getStyle(el, 'width'), 10),
                height = parseInt(YAHOO.util.Dom.getStyle(el, 'height'), 10),
                //Set left to x minus left
                left = ((xy[0] - region.left) + 15), //Buffer of 15px
                //Set right to right minus x minus width
                right = ((region.right - xy[0] - width) + 15);
    
            //Set the constraints based on the above calculations
            this.setXConstraint(left, right);
            this.setYConstraint(10, 10);
            
            YAHOO.util.Event.on(window, 'resize', function() {
                this.initConstraints();
            }, this, true);
        },
        _resizeProxy: function() {
            this.constructor.superclass._resizeProxy.apply(this, arguments);
            var dragEl = this.getDragEl(),
                el = this.getEl();

            YAHOO.util.Dom.setStyle(this.pointer, 'height', (this.table.parentNode.offsetHeight + 10) + 'px');
            YAHOO.util.Dom.setStyle(this.pointer, 'display', 'block');
            var xy = YAHOO.util.Dom.getXY(el);
            YAHOO.util.Dom.setXY(this.pointer, [xy[0], (xy[1] - 5)]);
            
            YAHOO.util.Dom.setStyle(dragEl, 'height', this.datatable.getContainerEl().offsetHeight + "px");
            YAHOO.util.Dom.setStyle(dragEl, 'width', (parseInt(YAHOO.util.Dom.getStyle(dragEl, 'width'),10) + 4) + 'px');
            YAHOO.util.Dom.setXY(this.dragEl, xy);
        },
        onMouseDown: function() {
                this.initConstraints();
                this.resetConstraints();
        },
        clickValidator: function(e) {
            if(!this.column.hidden) {
                var target = YAHOO.util.Event.getTarget(e);
                return ( this.isValidHandleChild(target) &&
                            (this.id == this.handleElId ||
                                this.DDM.handleWasClicked(target, this.id)) );
            }
        },
        onDragOver: function(ev, id) {
            // Validate target
            var target = this.datatable.getColumn(id);
            if(target) {
                var mouseX = YAHOO.util.Event.getPageX(ev),
                targetX = YAHOO.util.Dom.getX(id),
                midX = targetX + ((YAHOO.util.Dom.get(id).offsetWidth)/2),
                currentIndex =  this.column.getTreeIndex(),
                targetIndex = target.getTreeIndex(),
                newIndex = targetIndex;
                
                
                if (mouseX < midX) {
                   YAHOO.util.Dom.setX(this.pointer, targetX);
                } else {
                    var thisWidth = parseInt(target.getThEl().offsetWidth, 10);
                    YAHOO.util.Dom.setX(this.pointer, (targetX + thisWidth));
                    newIndex++;
                }
                if (targetIndex > currentIndex) {
                    newIndex--;
                }
                if(newIndex < 0) {
                    newIndex = 0;
                }
                else if(newIndex > this.datatable.getColumnSet().tree[0].length) {
                    newIndex = this.datatable.getColumnSet().tree[0].length;
                }
                this.newIndex = newIndex;
            }
        },
        onDragDrop: function() {
            if(YAHOO.lang.isNumber(this.newIndex) && (this.newIndex !== this.column.getTreeIndex())) {
                var oDataTable = this.datatable;
                oDataTable._oChain.stop();
                var aColumnDefs = oDataTable._oColumnSet.getDefinitions();
                var oColumn = aColumnDefs.splice(this.column.getTreeIndex(),1)[0];
                aColumnDefs.splice(this.newIndex, 0, oColumn);
                oDataTable._initColumnSet(aColumnDefs);
                oDataTable._initTheadEls();
                oDataTable.render();
            }
        },
        endDrag: function() {
            this.newIndex = null;
            YAHOO.util.Dom.setStyle(this.pointer, 'display', 'none');
        }
    });
}

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * ColumnResizer subclasses DragDrop to support resizeable Columns.
 *
 * @namespace YAHOO.util
 * @class ColumnResizer
 * @extends YAHOO.util.DDProxy
 * @constructor
 * @param oDataTable {YAHOO.widget.DataTable} DataTable instance.
 * @param oColumn {YAHOO.widget.Column} Column instance.
 * @param elTh {HTMLElement} TH element reference.
 * @param sHandleElId {String} DOM ID of the handle element that causes the resize.
 * @param elProxy {HTMLElement} Resizer proxy element.
 */
YAHOO.util.ColumnResizer = function(oDataTable, oColumn, elTh, sHandleId, elProxy) {
    if(oDataTable && oColumn && elTh && sHandleId) {
        this.datatable = oDataTable;
        this.column = oColumn;
        this.headCell = elTh;
        this.init(sHandleId, sHandleId, {dragOnly:true, dragElId: elProxy.id});
        this.initFrame(); // Needed for proxy
    }
    else {
        YAHOO.log("Column resizer could not be created","warn");
    }
};

if(YAHOO.util.DD) {
    YAHOO.extend(YAHOO.util.ColumnResizer, YAHOO.util.DDProxy, {
        /////////////////////////////////////////////////////////////////////////////
        //
        // Public methods
        //
        /////////////////////////////////////////////////////////////////////////////
        /**
         * Resets resizer element.
         *
         * @method resetResizerEl
         */
        resetResizerEl : function() {
            var resizerStyle = YAHOO.util.Dom.get(this.handleElId).style;
            resizerStyle.left = "auto";
            resizerStyle.right = 0;
            resizerStyle.top = "auto";
            resizerStyle.bottom = 0;
        },
    
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
        onMouseUp : function(e) {
            this.resetResizerEl();
            this.datatable.fireEvent("columnResizeEvent", {column:this.column,target:this.headCell});
        },
    
        /**
         * Handles mousedown events on the Column resizer.
         *
         * @method onMouseDown
         * @param e {string} The mousedown event
         */
        onMouseDown : function(e) {
            this.startWidth = this.headCell.firstChild.offsetWidth;
            this.startX = YAHOO.util.Event.getXY(e)[0];
        },
    
        /**
         * Custom clickValidator to ensure Column is not in hidden state.
         *
         * @method clickValidator
         * @param {Event} e
         * @private
         */
        clickValidator : function(e) {
            if(!this.column.hidden) {
                var target = YAHOO.util.Event.getTarget(e);
                return ( this.isValidHandleChild(target) &&
                            (this.id == this.handleElId ||
                                this.DDM.handleWasClicked(target, this.id)) );
            }
        },
    
        /**
         * Handles drag events on the Column resizer.
         *
         * @method onDrag
         * @param e {string} The drag event
         */
        onDrag : function(e) {
            var newX = YAHOO.util.Event.getXY(e)[0];
            if(newX > YAHOO.util.Dom.getX(this.headCell.firstChild)) {
                var offsetX = newX - this.startX;
                var newWidth = this.startWidth + offsetX;
                this.datatable.setColumnWidth(this.column, newWidth);
                this.datatable._syncColWidths();
            }
        }
    });
}
