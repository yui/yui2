/**
 * Contains the tree view state data and the root node.  This is an
 * ordered tree; child nodes will be displayed in the order created, and
 * there currently is no way to change this.
 *
 * @constructor
 * @param {string|HTMLElement} id The id of the element, or the element
 * itself that the tree will be inserted into.
 */
YAHOO.widget.TreeView = function(id) {
    if (id) { this.init(id); }
};

/**
 * Count of all nodes in all trees
 * @type int
 */
YAHOO.widget.TreeView.nodeCount = 0;

YAHOO.widget.TreeView.prototype = {

    /**
     * The id of tree container element
     *
     * @type String
     */
    id: null,

    /**
     * The host element for this tree
     * @private
     */
    _el: null,

     /**
     * Flat collection of all nodes in this tree
     *
     * @type Node[]
     * @private
     */
    _nodes: null,

    /**
     * We lock the tree control while waiting for the dynamic loader to return
     *
     * @type boolean
     */
    locked: false,

    /**
     * The animation to use for expanding children, if any
     *
     * @type string
     * @private
     */
    _expandAnim: null,

    /**
     * The animation to use for collapsing children, if any
     *
     * @type string
     * @private
     */
    _collapseAnim: null,

    /**
     * The current number of animations that are executing
     *
     * @type int
     * @private
     */
    _animCount: 0,

    /**
     * The maximum number of animations to run at one time.
     *
     * @type int
     */
    maxAnim: 2,

    /**
     * Sets up the animation for expanding children
     *
     * @param {string} the type of animation (acceptable values defined in 
     * YAHOO.widget.TVAnim)
     */
    setExpandAnim: function(type) {
        if (YAHOO.widget.TVAnim.isValid(type)) {
            this._expandAnim = type;
        }
    },

    /**
     * Sets up the animation for collapsing children
     *
     * @param {string} the type of animation (acceptable values defined in 
     * YAHOO.widget.TVAnim)
     */
    setCollapseAnim: function(type) {
        if (YAHOO.widget.TVAnim.isValid(type)) {
            this._collapseAnim = type;
        }
    },

    /**
     * Perform the expand animation if configured, or just show the
     * element if not configured or too many animations are in progress
     *
     * @param el {HTMLElement} the element to animate
     * @return {boolean} true if animation could be invoked, false otherwise
     */
    animateExpand: function(el) {
        this.logger.log("animating expand");

        if (this._expandAnim && this._animCount < this.maxAnim) {
            // this.locked = true;
            var tree = this;
            var a = YAHOO.widget.TVAnim.getAnim(this._expandAnim, el, 
                            function() { tree.expandComplete(); });
            if (a) { 
                ++this._animCount;
                a.animate();
            }

            return true;
        }

        return false;
    },

    /**
     * Perform the collapse animation if configured, or just show the
     * element if not configured or too many animations are in progress
     *
     * @param el {HTMLElement} the element to animate
     * @return {boolean} true if animation could be invoked, false otherwise
     */
    animateCollapse: function(el) {
        this.logger.log("animating collapse");

        if (this._collapseAnim && this._animCount < this.maxAnim) {
            // this.locked = true;
            var tree = this;
            var a = YAHOO.widget.TVAnim.getAnim(this._collapseAnim, el, 
                            function() { tree.collapseComplete(); });
            if (a) { 
                ++this._animCount;
                a.animate();
            }

            return true;
        }

        return false;
    },

    /**
     * Function executed when the expand animation completes
     */
    expandComplete: function() {
        this.logger.log("expand complete: " + this.id);
        --this._animCount;
        // this.locked = false;
    },

    /**
     * Function executed when the collapse animation completes
     */
    collapseComplete: function() {
        this.logger.log("collapse complete: " + this.id);
        --this._animCount;
        // this.locked = false;
    },

    /**
     * Initializes the tree
     *
     * @parm {string|HTMLElement} id the id of the element that will hold the tree
     * @private
     */
    init: function(id) {

        this.id = id;

        if ("string" !== typeof id) {
            this._el = id;
            this.id = this.generateId(id);
        }

        this._nodes = [];

        // store a global reference
        YAHOO.widget.TreeView.trees[this.id] = this;

        // Set up the root node
        this.root = new YAHOO.widget.RootNode(this);

        this.logger = new YAHOO.widget.LogWriter(this.toString());

        this.logger.log("tree init: " + this.id);
    },

    /**
     * Renders the tree boilerplate and visible nodes
     */
    draw: function() {
        var html = this.root.getHtml();
        this.getEl().innerHTML = html;
        this.firstDraw = false;
    },

    /**
     * Returns the tree's host element
     * @return {HTMLElement} the host element
     */
    getEl: function() {
        if (! this._el) {
            this._el = document.getElementById(this.id);
        }
        return this._el;
    },

    /**
     * Nodes register themselves with the tree instance when they are created.
     *
     * @param node {Node} the node to register
     * @private
     */
    regNode: function(node) {
        this._nodes[node.index] = node;
    },

    /**
     * Returns the root node of this tree
     *
     * @return {Node} the root node
     */
    getRoot: function() {
        return this.root;
    },

    /**
     * Configures this tree to dynamically load all child data
     *
     * @param {function} fnDataLoader the function that will be called to get the data
     * @param iconMode {int} configures the icon that is displayed when a dynamic
     * load node is expanded the first time without children.  By default, the 
     * "collapse" icon will be used.  If set to 1, the leaf node icon will be
     * displayed.
     */
    setDynamicLoad: function(fnDataLoader, iconMode) { 
        this.root.setDynamicLoad(fnDataLoader, iconMode);
    },

    /**
     * Expands all child nodes.  Note: this conflicts with the "multiExpand"
     * node property.  If expand all is called in a tree with nodes that
     * do not allow multiple siblings to be displayed, only the last sibling
     * will be expanded.
     */
    expandAll: function() { 
        if (!this.locked) {
            this.root.expandAll(); 
        }
    },

    /**
     * Collapses all expanded child nodes in the entire tree.
     */
    collapseAll: function() { 
        if (!this.locked) {
            this.root.collapseAll(); 
        }
    },

    /**
     * Returns a node in the tree that has the specified index (this index
     * is created internally, so this function probably will only be used
     * in html generated for a given node.)
     *
     * @param {int} nodeIndex the index of the node wanted
     * @return {Node} the node with index=nodeIndex, null if no match
     */
    getNodeByIndex: function(nodeIndex) {
        var n = this._nodes[nodeIndex];
        return (n) ? n : null;
    },

    /**
     * Returns a node that has a matching property and value in the data
     * object that was passed into its constructor.
     *
     * @param {object} property the property to search (usually a string)
     * @param {object} value the value we want to find (usuall an int or string)
     * @return {Node} the matching node, null if no match
     */
    getNodeByProperty: function(property, value) {
        for (var i in this._nodes) {
            var n = this._nodes[i];
            if (n.data && value == n.data[property]) {
                return n;
            }
        }

        return null;
    },

    /**
     * Returns a collection of nodes that have a matching property 
     * and value in the data object that was passed into its constructor.  
     *
     * @param {object} property the property to search (usually a string)
     * @param {object} value the value we want to find (usuall an int or string)
     * @return {Array} the matching collection of nodes, null if no match
     */
    getNodesByProperty: function(property, value) {
        var values = [];
        for (var i in this._nodes) {
            var n = this._nodes[i];
            if (n.data && value == n.data[property]) {
                values.push(n);
            }
        }

        return (values.length) ? values : null;
    },

    /**
     * Removes the node and its children, and optionally refreshes the 
     * branch of the tree that was affected.
     * @param {Node} The node to remove
     * @param {boolean} autoRefresh automatically refreshes branch if true
     * @return {boolean} False is there was a problem, true otherwise.
     */
    removeNode: function(node, autoRefresh) { 

        // Don't delete the root node
        if (node.isRoot()) {
            return false;
        }

        // Get the branch that we may need to refresh
        var p = node.parent;
        if (p.parent) {
            p = p.parent;
        }

        // Delete the node and its children
        this._deleteNode(node);

        // Refresh the parent of the parent
        if (autoRefresh && p && p.childrenRendered) {
            p.refresh();
        }

        return true;
    },

    /**
     * Deletes this nodes child collection, recursively.  Also collapses
     * the node, and resets the dynamic load flag.  The primary use for
     * this method is to purge a node and allow it to fetch its data
     * dynamically again.
     * @param {Node} node the node to purge
     */
    removeChildren: function(node) { 
        this.logger.log("Removing children for " + node);
        while (node.children.length) {
             this._deleteNode(node.children[0]);
        }

        node.childrenRendered = false;
        node.dynamicLoadComplete = false;
        // node.collapse();
        node.expand();
        node.collapse();
    },

    /**
     * Deletes the node and recurses children
     * @private
     */
    _deleteNode: function(node) { 
        // Remove all the child nodes first
        this.removeChildren(node);

        // Remove the node from the tree
        this.popNode(node);
    },

    /**
     * Removes the node from the tree, preserving the child collection 
     * to make it possible to insert the branch into another part of the 
     * tree, or another tree.
     * @param {Node} the node to remove
     */
    popNode: function(node) { 
        var p = node.parent;

        // Update the parent's collection of children
        var a = [];

        for (var i=0, len=p.children.length;i<len;++i) {
            if (p.children[i] != node) {
                a[a.length] = p.children[i];
            }
        }

        p.children = a;

        // reset the childrenRendered flag for the parent
        p.childrenRendered = false;

         // Update the sibling relationship
        if (node.previousSibling) {
            node.previousSibling.nextSibling = node.nextSibling;
        }

        if (node.nextSibling) {
            node.nextSibling.previousSibling = node.previousSibling;
        }

        node.parent = null;
        node.previousSibling = null;
        node.nextSibling = null;
        node.tree = null;

        // Update the tree's node collection 
        delete this._nodes[node.index];
    },


    /**
     * toString
     * @return {string} string representation of the tree
     */
    toString: function() {
        return "TreeView " + this.id;
    },

    /**
     * private
     */
    generateId: function(el) {
        var id = el.id;

        if (!id) {
            id = "yui-tv-auto-id-" + YAHOO.widget.TreeView.counter;
            YAHOO.widget.TreeView.counter++;
        }

        return id;
    },

    /**
     * Abstract method that is executed when a node is expanded
     * @param node {Node} the node that was expanded
     */
    onExpand: function(node) { },

    /**
     * Abstract method that is executed when a node is collapsed
     * @param node {Node} the node that was collapsed.
     */
    onCollapse: function(node) { }

};

/**
 * Global cache of tree instances
 *
 * @type Array
 * @private
 */
YAHOO.widget.TreeView.trees = [];

/**
 * @private
 */
YAHOO.widget.TreeView.counter = 0;

/**
 * Global method for getting a tree by its id.  Used in the generated
 * tree html.
 *
 * @param treeId {String} the id of the tree instance
 * @return {TreeView} the tree instance requested, null if not found.
 */
YAHOO.widget.TreeView.getTree = function(treeId) {
    var t = YAHOO.widget.TreeView.trees[treeId];
    return (t) ? t : null;
};


/**
 * Global method for getting a node by its id.  Used in the generated
 * tree html.
 *
 * @param treeId {String} the id of the tree instance
 * @param nodeIndex {String} the index of the node to return
 * @return {Node} the node instance requested, null if not found
 */
YAHOO.widget.TreeView.getNode = function(treeId, nodeIndex) {
    var t = YAHOO.widget.TreeView.getTree(treeId);
    return (t) ? t.getNodeByIndex(nodeIndex) : null;
};

/**
 * Adds an event.  Replace with event manager when available
 *
 * @param el the elment to bind the handler to
 * @param {string} sType the type of event handler
 * @param {function} fn the callback to invoke
 * @param {boolean} capture if true event is capture phase, bubble otherwise
 */
YAHOO.widget.TreeView.addHandler = function (el, sType, fn, capture) {
    capture = (capture) ? true : false;
    if (el.addEventListener) {
        el.addEventListener(sType, fn, capture);
    } else if (el.attachEvent) {
        el.attachEvent("on" + sType, fn);
    } else {
        el["on" + sType] = fn;
    }
};

/**
 * Attempts to preload the images defined in the styles used to draw the tree by
 * rendering off-screen elements that use the styles.
 */
YAHOO.widget.TreeView.preload = function(prefix) {
    prefix = prefix || "ygtv";
    var styles = ["tn","tm","tmh","tp","tph","ln","lm","lmh","lp","lph","loading"];

    var sb = [];
    
    for (var i = 0; i < styles.length; ++i) { 
        sb[sb.length] = '<span class="' + prefix + styles[i] + '">&#160;</span>';
    }

    var f = document.createElement("DIV");
    var s = f.style;
    s.position = "absolute";
    s.top = "-1000px";
    s.left = "-1000px";
    f.innerHTML = sb.join("");

    document.body.appendChild(f);
};

YAHOO.widget.TreeView.addHandler(window, 
                "load", YAHOO.widget.TreeView.preload);

