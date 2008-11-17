<h2>Using ID and Class Selectors to Style Multiple TreeView Instances</h2>

<p>This example uses three TreeView instances.  The first takes the default CSS styles for TreeView.  The second overrides those styles with styles targeted at its parent element's ID.  The third overrides default styles with styles targeted at its parent element's CSS style.</p>

<p>The markup for this example is as follows:</p>

<textarea name="code" class="HTML" cols="60" rows="1"><link rel="stylesheet" type="text/css" href="<?php echo $assetsDirectory; ?>css/multi/tree.css">

<style>
#treecontaner {width: 550px;}
#tree1 {width:120px;padding: 10px;float:left;}
#tree2 {width:120px;padding: 10px;float:left;}
#tree3 {width:120px;padding: 10px;float:left;}
</style>


<div id="treecontainer">
	<div id="tree1"></div>
	<div id="tree2"></div>
	<div id="tree3" class="treemenu"></div>
</div></textarea>

<p>The targeted css rules for the second and third TreeView instances look like this (these are just excerpts; see the full <code>tree.css</code> file in the download <code>yui/examples/treeview/assets/css/multi</code> directory for the full definitions):</p>

<textarea name="code" class="JScript" cols="60" rows="1">/* via ID selector */
#tree2 .ygtvtn { background: url(../../img/folders/tn.gif) 0 0 no-repeat; width:17px; height:22px; }
#tree2 .ygtvtm { background: url(../../img/folders/tm.gif) 0 0 no-repeat; width:34px; height:22px; cursor:pointer }
#tree2 .ygtvtmh { background: url(../../img/folders/tmh.gif) 0 0 no-repeat; width:34px; height:22px; cursor:pointer }
....

/* via css class selector */
.treemenu .ygtvtn {background: transparent;  width:1em; height:20px; }
.treemenu .ygtvtm { background: url(../../img/menu/collapse.gif) 0 6px no-repeat; width:1em; height:22px; cursor:pointer }
.treemenu .ygtvtmh { background: url(../../img/menu/collapseh.gif) 0 6px no-repeat; width:1em; height:22px; cursor:pointer }
...</textarea>

<p>The full script source for this example is as follows:</p>

<textarea name="code" class="JScript" cols="60" rows="1">//global variable to allow console inspection of tree:
var tree;

//anonymous function wraps the remainder of the logic:
(function() {

	//function to initialize the three TreeView instances:
    function treeInit() {
        buildRandomTextNodeTree("tree1");
        buildRandomTextNodeTree("tree2");
        buildRandomTextNodeTree("tree3");
    }
    
	//Function  creates the tree and 
	//builds between 3 and 7 children of the root node:
    function buildRandomTextNodeTree(sTargetElId) {
	
		//instantiate the tree:
        tree = new YAHOO.widget.TreeView(sTargetElId);

        for (var i = 0; i < Math.floor((Math.random()*4) + 3); i++) {
            var tmpNode = new YAHOO.widget.TextNode("label-" + i, tree.getRoot(), false);
            // tmpNode.collapse();
            // tmpNode.expand();
            // buildRandomTextBranch(tmpNode);
            buildLargeBranch(tmpNode);
        }

       // Expand and collapse happen prior to the actual expand/collapse,
       // and can be used to cancel the operation
       tree.subscribe("expand", function(node) {
              YAHOO.log(node.index + " was expanded", "info", "example");
              // return false; // return false to cancel the expand
           });

       tree.subscribe("collapse", function(node) {
              YAHOO.log(node.index + " was collapsed", "info", "example");
           });

       // Trees with TextNodes will fire an event for when the label is clicked:
       tree.subscribe("labelClick", function(node) {
              YAHOO.log(node.index + " label was clicked", "info", "example");
           });

		//The tree is not created in the DOM until this method is called:
        tree.draw();
    }

	//function builds 10 children for the node you pass in:
    function buildLargeBranch(node) {
        if (node.depth < 10) {
            YAHOO.log("buildRandomTextBranch: " + node.index, "info", "example");
            for ( var i = 0; i < 10; i++ ) {
                new YAHOO.widget.TextNode(node.label + "-" + i, node, false);
            }
        }
    }

	//Add a window onload handler to build the tree when the load
	//event fires.
    YAHOO.util.Event.addListener(window, "load", treeInit);

})();</textarea>