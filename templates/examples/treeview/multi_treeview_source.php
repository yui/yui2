<link rel="stylesheet" type="text/css" href="<?php echo $assetsDirectory; ?>css/multi/tree.css">

<style type="text/css">

#treecontainer {width: 550px;}
#tree1 {background: #fff; width:120px;padding: 10px;float:left;}
#tree2 {background: #fff; width:120px;padding: 10px;float:left;}
#tree3 {background: #fff; width:120px;padding: 10px;float:left;}
</style>


<div id="treecontainer">
	<div id="tree1"></div>
	<div id="tree2"></div>
	<div id="tree3" class="treemenu"></div>
</div>

<script type="text/javascript">

//global variable to allow console inspection of tree:
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

})();

</script>
