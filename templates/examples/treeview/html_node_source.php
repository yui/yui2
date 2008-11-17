<link rel="stylesheet" type="text/css" href="<?php echo $assetsDirectory; ?>css/folders/tree.css">

<style>
/*expand/contract style:*/
#expandcontractdiv {border:1px solid #336600; background-color:#FFFFCC; margin:0 0 .5em 0; padding:0.2em;}

/*style for HTMLNode inner div; we'll apply this style
by hand in the HTML contents of our HTMLNode instances:*/
.htmlNodeClass {width:20em; height:5em; background-color:#CC6666; border:1px solid #000033;}
#treeDiv1 { background: #fff }
</style>

<!-- markup for expand/contract links -->
<div id="expandcontractdiv">
	<a id="expand" href="#">Expand all</a>
	<a id="collapse" href="#">Collapse all</a>
</div>

<div id="treeDiv1"></div>

<script type="text/javascript">
//an anonymous function wraps our code to keep our variables
//in function scope rather than in the global namespace:
(function() {
	var tree; //will hold our TreeView instance
	var counter = 0; //will be used to increment HTML node labels
		
	function treeInit() {
		
		YAHOO.log("Example's treeInit function firing.", "info", "example");
		
		//Hand off ot a method that randomly generates tree nodes:
		buildRandomTextNodeTree();
		
		//handler for expanding all nodes
		YAHOO.util.Event.on("expand", "click", function(e) {
			YAHOO.log("Expanding all TreeView  nodes.", "info", "example");
			tree.expandAll();
			YAHOO.util.Event.preventDefault(e);
		});
		
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
			var tmpNode = new YAHOO.widget.TextNode("label-" + i, tree.getRoot(), false);
			
			//we'll delegate to another function to build child nodes:
			buildRandomHTMLBranch(tmpNode);
		}
		
		//once it's all built out, we need to render
		//our TreeView instance:
		tree.draw();
	}

	//This function adds a single chinld HTMLNodes to the supplied node:
	function buildRandomHTMLBranch(node) {
		YAHOO.log("buildRandomHTMLBranch: " + node.index);
	
		var id = "htmlnode_" + counter++;
	
		var html = '<div class="htmlNodeClass" id="' + id + '">' +
					'Info ' + id + '</div>';
	
		// new YAHOO.widget.HTMLNode(html, node, false, true);
		new YAHOO.widget.HTMLNode(html, node, false, false);	
	}
	
	//When the DOM is done loading, we can initialize our TreeView
	//instance:
	YAHOO.util.Event.onDOMReady(treeInit);
	
})();//anonymous function wrapper closed; () notation executes function

</script>
