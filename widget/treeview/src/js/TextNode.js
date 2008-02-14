/**
 * The default node presentation.  The first parameter should be
 * either a string that will be used as the node's label, or an object
 * that has a string propery called label.  By default, the clicking the
 * label will toggle the expanded/collapsed state of the node.  By
 * changing the href property of the instance, this behavior can be
 * changed so that the label will go to the specified href.
 * @namespace YAHOO.widget
 * @class TextNode
 * @extends YAHOO.widget.Node
 * @constructor
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
 */
YAHOO.widget.TextNode = function(oData, oParent, expanded) {

    if (oData) { 
        this.init(oData, oParent, expanded);
        this.setUpLabel(oData);
    }

    this.logger     = new YAHOO.widget.LogWriter(this.toString());
};

YAHOO.extend(YAHOO.widget.TextNode, YAHOO.widget.Node, {
    
    /**
     * The CSS class for the label href.  Defaults to ygtvlabel, but can be
     * overridden to provide a custom presentation for a specific node.
     * @property labelStyle
     * @type string
     */
    labelStyle: "ygtvlabel",

    /**
     * The derived element id of the label for this node
     * @property labelElId
     * @type string
     */
    labelElId: null,

    /**
     * The text for the label.  It is assumed that the oData parameter will
     * either be a string that will be used as the label, or an object that
     * has a property called "label" that we will use.
     * @property label
     * @type string
     */
    label: null,

    textNodeParentChange: function() {
 
        /**
         * Custom event that is fired when the text node label is clicked.  The
         * custom event is defined on the tree instance, so there is a single
         * event that handles all nodes in the tree.  The node clicked is 
         * provided as an argument
         *
         * @event labelClick
         * @for YAHOO.widget.TreeView
         * @param {YAHOO.widget.Node} node the node clicked
         */
        if (this.tree && !this.tree.hasEvent("labelClick")) {
            this.tree.createEvent("labelClick", this.tree);
        }
       
    },

    /**
     * Sets up the node label
     * @method setUpLabel
     * @param oData string containing the label, or an object with a label property
     */
    setUpLabel: function(oData) { 
        
        // set up the custom event on the tree
        this.textNodeParentChange();
        this.subscribe("parentChange", this.textNodeParentChange);

        if (typeof oData == "string") {
            oData = { label: oData };
        }
        this.label = oData.label;
        this.data.label = oData.label;
        
        // update the link
        if (oData.href) {
            this.href = encodeURI(oData.href);
        }

        // set the target
        if (oData.target) {
            this.target = oData.target;
        }

        if (oData.style) {
            this.labelStyle = oData.style;
        }

        if (oData.title) {
            this.title = oData.title;
        }

        this.labelElId = "ygtvlabelel" + this.index;
    },

    /**
     * Returns the label element
     * @for YAHOO.widget.TextNode
     * @method getLabelEl
     * @return {object} the element
     */
    getLabelEl: function() { 
        return document.getElementById(this.labelElId);
    },

    // overrides YAHOO.widget.Node
    getNodeHtml: function() { 
        this.logger.log("Generating html");
        var sb = [];

        sb[sb.length] = '<table border="0" cellpadding="0" cellspacing="0">';
        sb[sb.length] = '<tr>';
        
        for (var i=0;i<this.depth;++i) {
            //sb[sb.length] = '<td><div class="' + this.getDepthStyle(i) + '">&#160;</div></td>';
            //sb[sb.length] = '<td><div class="' + this.getDepthStyle(i) + '"></div></td>';
            sb[sb.length] = '<td class="' + this.getDepthStyle(i) + '"><div class="ygtvspacer"></div></td>';
        }

        var getNode = 'YAHOO.widget.TreeView.getNode(\'' +
                        this.tree.id + '\',' + this.index + ')';

        sb[sb.length] = '<td';
        // sb[sb.length] = ' onselectstart="return false"';
        sb[sb.length] = ' id="' + this.getToggleElId() + '"';
        sb[sb.length] = ' class="' + this.getStyle() + '"';
        if (this.hasChildren(true)) {
            sb[sb.length] = ' onmouseover="this.className=';
            sb[sb.length] = getNode + '.getHoverStyle()"';
            sb[sb.length] = ' onmouseout="this.className=';
            sb[sb.length] = getNode + '.getStyle()"';
        }
        sb[sb.length] = ' onclick="javascript:' + this.getToggleLink() + '">';

        sb[sb.length] = '<div class="ygtvspacer">';

        /*
        sb[sb.length] = '<img id="' + this.getSpacerId() + '"';
        sb[sb.length] = ' alt=""';
        sb[sb.length] = ' tabindex=0';
        sb[sb.length] = ' src="' + this.spacerPath + '"';
        sb[sb.length] = ' title="' + this.getStateText() + '"';
        sb[sb.length] = ' class="ygtvspacer"';
        // sb[sb.length] = ' onkeypress="return ' + getNode + '".onKeyPress()"';
        sb[sb.length] = ' />';
        */

        //sb[sb.length] = '&#160;';

        sb[sb.length] = '</div>';
        sb[sb.length] = '</td>';
        sb[sb.length] = '<td ';
        sb[sb.length] = (this.nowrap) ? ' nowrap="nowrap" ' : '';
        sb[sb.length] = ' >';
        sb[sb.length] = '<a';
        sb[sb.length] = ' id="' + this.labelElId + '"';
        if (this.title) {
            sb[sb.length] = ' title="' + this.title + '"';
        }
        sb[sb.length] = ' class="' + this.labelStyle + '"';
        sb[sb.length] = ' href="' + this.href + '"';
        sb[sb.length] = ' target="' + this.target + '"';
        sb[sb.length] = ' onclick="return ' + getNode + '.onLabelClick(' + getNode +')"';
        if (this.hasChildren(true)) {
            sb[sb.length] = ' onmouseover="document.getElementById(\'';
            sb[sb.length] = this.getToggleElId() + '\').className=';
            sb[sb.length] = getNode + '.getHoverStyle()"';
            sb[sb.length] = ' onmouseout="document.getElementById(\'';
            sb[sb.length] = this.getToggleElId() + '\').className=';
            sb[sb.length] = getNode + '.getStyle()"';
        }
        sb[sb.length] = ' >';
        sb[sb.length] = this.label;
        sb[sb.length] = '</a>';
        sb[sb.length] = '</td>';
        sb[sb.length] = '</tr>';
        sb[sb.length] = '</table>';

        return sb.join("");
    },


    /**
     * Executed when the label is clicked.  Fires the labelClick custom event.
     * @method onLabelClick
     * @param me {Node} this node
     * @scope the anchor tag clicked
     * @return false to cancel the anchor click
     */
    onLabelClick: function(me) { 
        me.logger.log("onLabelClick " + me.label);
        return me.tree.fireEvent("labelClick", me);
        //return true;
    },

    toString: function() { 
        return "TextNode (" + this.index + ") " + this.label;
    }

});
