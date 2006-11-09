/**
 * A custom YAHOO.widget.Node that handles the unique nature of 
 * the virtual, presentationless root node.
 * @namespace YAHOO.widget
 * @class RootNode
 * @extends YAHOO.widget.Node
 * @param oTree {YAHOO.widget.TreeView} The tree instance this node belongs to
 * @constructor
 */
YAHOO.widget.RootNode = function(oTree) {
	// Initialize the node with null params.  The root node is a
	// special case where the node has no presentation.  So we have
	// to alter the standard properties a bit.
	this.init(null, null, true);
	
	/*
	 * For the root node, we get the tree reference from as a param
	 * to the constructor instead of from the parent element.
	 */
	this.tree = oTree;
};

YAHOO.extend(YAHOO.widget.RootNode, YAHOO.widget.Node, {
    
    // overrides YAHOO.widget.Node
    getNodeHtml: function() { 
        return ""; 
    },

    toString: function() { 
        return "RootNode";
    },

    loadComplete: function() { 
        this.tree.draw();
    }

});
