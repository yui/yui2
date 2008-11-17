<h2>Controlling Node Presentation with HTMLNodes</h2>

<p>The HTMLNode class allows you to control the full contents of your node instance's HTML.  No markup will be added for you for the node's icon; no node label will be added.  You do it all yourself.</p>

<p>In this example, we've started with the folder-style CSS; that causes the icon for our text nodes to take on the folder appearance.  Under each top-level TextNode we've added a single HTMLNode; its presentation is controlled by an inline CSS rule.  Here's what the CSS and markup looks like for this example:</p>

<textarea name="code" class="HTML" cols="60" rows="1"><link rel="stylesheet" type="text/css" href="<?php echo $assetsDirectory; ?>css/folders/tree.css">

<style>
/*expand/contract style:*/
#expandcontractdiv {border:1px solid #336600; background-color:#FFFFCC; margin:0 0 .5em 0; padding:0.2em;}

/*style for HTMLNode inner div; we'll apply this style
by hand in the HTML contents of our HTMLNode instances:*/
.htmlNodeClass {width:20em; height:5em; background-color:#CC6666; border:1px solid #000033;}
</style>

<!-- markup for expand/contract links -->
<div id="expandcontractdiv">
	<a id="expand" href="#">Expand all</a>
	<a id="collapse" href="#">Collapse all</a>
</div>

<div id="treeDiv1"></div></textarea>

<p>With that in place, we can build upon our code from previous examples to build a top-level node set consisting of TextNodes.  Under each TextNode, we'll add a single HTMLNode.  The contents of each HTMLNode will be a <code>&lt;div&gt;</code> with a small amount of text. We'll apply the <code>htmlNodeClass</code> style rule we defined above to this <code>&lt;div&gt;</code>; that will give it its shape, color and border. Here's the full script: </p>

<textarea name="code" class="JScript" cols="60" rows="1"><script type="text/javascript">
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

</script></textarea>
