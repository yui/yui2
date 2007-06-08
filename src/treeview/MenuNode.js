/**
 * A menu-specific implementation that differs from TextNode in that only 
 * one sibling can be expanded at a time.
 * @namespace YAHOO.widget
 * @class MenuNode
 * @extends YAHOO.widget.TextNode
 * @param oData {object} a string or object containing the data that will
 * be used to render this node
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
