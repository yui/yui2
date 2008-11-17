<style>
    #treeDiv1 {background: #fff;}
</style>
<div id="treeDiv1"></div>

<script type="text/javascript">

//global variable to allow console inspection of tree:
var tree;

//anonymous function wraps the remainder of the logic:
(function() {

	//function to initialize the tree:
    function treeInit() {
        buildRandomTextNodeTree();
    }
	
	//Handler for animation start:
	function handleAnimStart(info) {
		YAHOO.log("handle animStart " + info.node.index, "info", "example");
	}
	
	//Handler for animation complete:
	function handleAnimComplete(info) {
		YAHOO.log("handle animComplete " + info.node.index, "info", "example");
	}
    
	//Function  creates the tree and 
	//builds between 3 and 7 children of the root node:
    function buildRandomTextNodeTree() {
	
		//instantiate the tree:
        tree = new YAHOO.widget.TreeView("treeDiv1");
		tree.setExpandAnim(YAHOO.widget.TVAnim.FADE_IN);
		tree.setCollapseAnim(YAHOO.widget.TVAnim.FADE_OUT);

        tree.subscribe("animStart", handleAnimStart);
        tree.subscribe("animComplete", handleAnimComplete);

        for (var i = 0; i < Math.floor((Math.random()*4) + 3); i++) {
            var tmpNode = new YAHOO.widget.TextNode("label-" + i, tree.getRoot(), false);

            buildRandomTextBranch(tmpNode);
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

	//This function adds a random number <4 of child nodes to a given
	//node, stopping at a specific node depth:
	function buildRandomTextBranch(node) {
		if (node.depth < 6) {
			YAHOO.log("buildRandomTextBranch: " + node.index, "info", "example");
			for ( var i = 0; i < Math.floor(Math.random() * 6) ; i++ ) {
				var tmpNode = new YAHOO.widget.TextNode(node.label + "-" + i, node, false);
				buildRandomTextBranch(tmpNode);
			}
		}
	}


	//Add a window onload handler to build the tree when the load
	//event fires.
    YAHOO.util.Event.addListener(window, "load", treeInit);

})();

</script>
