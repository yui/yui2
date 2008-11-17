<p>
When adding context menus to large data structures like a 
<code>&#60;table&#62;</code> or large list (<code>&#60;ol&#62;</code> 
or <code>&#60;ul&#62;</code>), it is recommended to bind a single 
YAHOO.widget.ContextMenu instance to the structure's root element, than to a set 
of its child nodes (<code>&#60;tr&#62;</code>s or <code>&#60;li&#62;</code>s).
Doing so significantly improves the performance of a web page or 
application by reducing the number of "contextmenu" event handlers 
as well as the number of YAHOO.widget.ContextMenu instances in memory.
</p>
<p>
Begin by creating a TreeView instance.  Next, create an object that maps 
HTML ids to their corresponding TextNode instances.  As each TextNode instance 
is added to the TreeView, store a reference to it in the map.
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
/*
     Initialize the TreeView instance when the "mytreeview" <div>
     is ready to be scripted.
*/

YAHOO.util.Event.onAvailable("mytreeview", function () {

    /*
         Map of YAHOO.widget.TextNode instances in the 
         TreeView instance.
    */

    var oTextNodeMap = {};


    // Creates a TextNode instance and appends it to the TreeView 

    function buildRandomTextBranch(p_oNode) {

        var oTextNode,
            i;

        if (p_oNode.depth < 6) {

            for (i = 0; i < Math.floor(Math.random() * 4); i++) {

                oTextNode = new YAHOO.widget.TextNode(p_oNode.label + "-" + i, p_oNode, false);

                oTextNodeMap[oTextNode.labelElId] = oTextNode;
                
                buildRandomTextBranch(oTextNode);

            }

        }

    }


    // Create a TreeView instance

    var oTreeView = new YAHOO.widget.TreeView("mytreeview");

    var n, oTextNode;

    for (n = 0; n < Math.floor((Math.random()*4) + 3); n++) {

        oTextNode = new YAHOO.widget.TextNode("label-" + n, oTreeView.getRoot(), false);
        
        /*
             Add the TextNode instance to the map, using its
             HTML id as the key.
        */
        
        oTextNodeMap[oTextNode.labelElId] = oTextNode;
        
        buildRandomTextBranch(oTextNode);

    }

    oTreeView.draw();

});
</textarea>
<p>
Once the TreeView is created, instantiate a ContextMenu specifying the TreeView 
instance's root element as its trigger.  Lastly, add a "triggerContextMenu" 
event handler for the ContextMenu instance that uses the "contextEventTarget" 
property to retrieve the TextNode instance that triggered its display.   
A reference to the TextNode is stored in a variable 
(<code>oCurrentTextNode</code>), so that it can be manipulated by the 
<code>addNode</code>, <code>editNodeLabel</code>, and <code>deleteNode</code> 
functions.
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
/*
     The YAHOO.widget.TextNode instance whose "contextmenu" 
     DOM event triggered the display of the 
     ContextMenu instance.
*/

var oCurrentTextNode = null;


/*
     Adds a new TextNode as a child of the TextNode instance 
     that was the target of the "contextmenu" event that 
     triggered the display of the ContextMenu instance.
*/

function addNode() {

    var sLabel = window.prompt("Enter a label for the new node: ", ""),
        oChildNode;

    if (sLabel && sLabel.length > 0) {
        
        oChildNode = new YAHOO.widget.TextNode(sLabel, oCurrentTextNode, false);

        oCurrentTextNode.refresh();
        oCurrentTextNode.expand();

        oTextNodeMap[oChildNode.labelElId] = oChildNode;

    }

}


/*
     Edits the label of the TextNode that was the target of the
     "contextmenu" event that triggered the display of the 
     ContextMenu instance.
*/

function editNodeLabel() {

    var sLabel = window.prompt("Enter a new label for this node: ", oCurrentTextNode.getLabelEl().innerHTML);

    if (sLabel && sLabel.length > 0) {
        
        oCurrentTextNode.getLabelEl().innerHTML = sLabel;

    }

}


/*
    Deletes the TextNode that was the target of the "contextmenu"
    event that triggered the display of the ContextMenu instance.
*/

function deleteNode() {

    delete oTextNodeMap[oCurrentTextNode.labelElId];

    oTreeView.removeNode(oCurrentTextNode);
    oTreeView.draw();

}


/*
    "contextmenu" event handler for the element(s) that 
    triggered the display of the ContextMenu instance - used
    to set a reference to the TextNode instance that triggered
    the display of the ContextMenu instance.
*/

function onTriggerContextMenu(p_oEvent) {

	var oTarget = this.contextEventTarget,
		Dom = YAHOO.util.Dom;

	/*
		 Get the TextNode instance that that triggered the 
		 display of the ContextMenu instance.
	*/

	var oTextNode = Dom.hasClass(oTarget, "ygtvlabel") ? 
						oTarget : Dom.getAncestorByClassName(oTarget, "ygtvlabel");

	if (oTextNode) {

		oCurrentTextNode = oTextNodeMap[oTarget.id];

	}
	else {
	
		// Cancel the display of the ContextMenu instance.
	
		this.cancel();
		
	}

}


/*
     Instantiate a ContextMenu:  The first argument passed to 
     the constructor is the id of the element to be created; the 
     second is an object literal of configuration properties.
*/

var oContextMenu = new YAHOO.widget.ContextMenu("mytreecontextmenu", {
                                                trigger: "mytreeview",
                                                lazyload: true, 
                                                itemdata: [
                                                    { text: "Add Child Node", onclick: { fn: addNode } },
                                                    { text: "Edit Node Label", onclick: { fn: editNodeLabel } },
                                                    { text: "Delete Node", onclick: { fn: deleteNode } }
                                                ] });


/*
     Subscribe to the "contextmenu" event for the element(s)
     specified as the "trigger" for the ContextMenu instance.
*/

oContextMenu.subscribe("triggerContextMenu", onTriggerContextMenu);
</textarea>
