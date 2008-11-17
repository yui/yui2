<!-- markup for expand/contract links -->
<div id="expandcontractdiv">
	<a id="collapse" href="#">Collapse all</a>
</div>

<div id="treeDiv1"></div>

<script type="text/javascript">
//an anonymous function wraps our code to keep our variables
//in function scope rather than in the global namespace:
(function() {
	var tree; //will hold our TreeView instance
	
	function treeInit() {
		
		YAHOO.log("Example's treeInit function firing.", "info", "example");
		
		//Hand off ot a method that randomly generates tree nodes:
		buildRandomTextNodeTree();
		
		//handler for collapsing all nodes
		YAHOO.util.Event.on("collapse", "click", function(e) {
			YAHOO.log("Collapsing all TreeView  nodes.", "info", "example");
			tree.collapseAll();
			YAHOO.util.Event.preventDefault(e);
		});
	}
	
	//This method will build a TreeView instance and populate it with
	//between 3 and 7 top-level nodes
	function buildRandomTextNodeTree() {
	
		//instantiate the tree:
		tree = new YAHOO.widget.TreeView("treeDiv1");
		
		//create top-level nodes
		for (var i = 0; i < Math.floor((Math.random()*4) + 3); i++) {
			var tmpNode = new YAHOO.widget.MenuNode("label-" + i, tree.getRoot(), false);
			
			//we'll delegate to another function to build child nodes:
			buildRandomTextBranch(tmpNode);
		}
		
		//once it's all built out, we need to render
		//our TreeView instance:
		tree.draw();
	}

	//This function adds a random number <4 of child nodes to a given
	//node, stopping at a specific node depth:
	function buildRandomTextBranch(node) {
		if (node.depth < 6) {
			YAHOO.log("buildRandomTextBranch: " + node.index);
			for ( var i = 0; i < Math.floor(Math.random() * 4) ; i++ ) {
				var tmpNode = new YAHOO.widget.MenuNode(node.label + "-" + i, node, false);
				buildRandomTextBranch(tmpNode);
			}
		}
	}
	
	//When the DOM is done loading, we can initialize our TreeView
	//instance:
	YAHOO.util.Event.onDOMReady(treeInit);
	
})();//anonymous function wrapper closed; () notation executes function

</script>
