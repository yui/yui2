/**
 * A menu-specific implementation that differs from TextNode in that only 
 * one sibling can be expanded at a time.
 * @namespace YAHOO.widget
 * @class MenuNode
 * @extends YAHOO.widget.TextNode
 * @param oData {object} a string or object containing the data that will
 * be used to render this node.
 * Valid properties: 
 * <dl>
 *   <dt>label</dt>
 *   <dd>The text for the node's label</dd>
 *   <dt>title</dt>
 *   <dd>The title attribute for the label anchor</dd>
 *   <dt>title</dt>
 *   <dd>The title attribute for the label anchor</dd>
 *   <dt>href</dt>
 *   <dd>The href for the node's label.  By default it is set to
 *   expand/collapse the node.</dd>
 *   <dt>target</dt>
 *   <dd>The target attribute for the label anchor</dd>
 *   <dt>style</dt>
 *   <dd>A CSS class to apply to the label anchor</dd>
 * </dl>
 * All other attributes are made available in noderef.data, which
 * can be used to store custom attributes.  TreeView.getNode(s)ByProperty
 * can be used to retreive a node by one of the attributes.
 * @param oParent {YAHOO.widget.Node} this node's parent node
 * @param expanded {boolean} the initial expanded/collapsed state
 * @constructor
 */
YAHOO.widget.MenuNode = function(oData, oParent, expanded) {
	if (oData) { 
		this.init(oData, oParent, expanded);
		this.setUpLabel(oData);
	}

    /*
     * Menus usually allow only one branch to be open at a time.
     */
	this.multiExpand = false;

    this.logger     = new YAHOO.widget.LogWriter(this.toString());

};

YAHOO.extend(YAHOO.widget.MenuNode, YAHOO.widget.TextNode, {

    toString: function() { 
        return "MenuNode (" + this.index + ") " + this.label;
    }

});
