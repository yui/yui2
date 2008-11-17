<h2 class="first">Implementing the Folder Style for TreeVeiw</h2>

<p>The key change we've made in this example of the <a href="http://developer.yahoo.com/yui/treeview/">TreeView Control</a> is that we've applied a supplementary CSS file:</p>

<textarea name="code" class="HTML" cols="60" rows="1"><link rel="stylesheet" type="text/css" href="<?php echo $assetsDirectory; ?>css/folders/tree.css"></textarea>

<p>This CSS redefines the look of branch nodes so they appear as folders.  The folder-style CSS accompanies your <a href="http://developer.yahoo.com/yui/download/">YUI download</a> and can be found in the <code>yui/examples/treeview/assets</code> directory.</p>

<p>Beyond the <code>link</code> element referenced above, the following markup is on the page for this example:</p>

<textarea name="code" class="HTML" cols="60" rows="1"><!-- Some style for the expand/contract section-->
<style>
#expandcontractdiv {border:1px dotted #dedede; background-color:#EBE4F2; margin:0 0 .5em 0; padding:0.4em;}
#treeDiv1 { background: #fff; padding:1em; margin-top:1em; }
</style>

<!-- markup for expand/contract links -->
<div id="expandcontractdiv">
	<a id="expand" href="#">Expand all</a>
	<a id="collapse" href="#">Collapse all</a>
</div>

<div id="treeDiv1"></div></textarea>

<p>Based on that markup, we use the following JavaScript code to create our TreeView instance, populate its nodes, and add expand/collapse functionality:</p>

<textarea name="code" class="JScript" cols="60" rows="1">//an anonymous function wraps our code to keep our variables
//in function scope rather than in the global namespace:
(function() {
	var tree; //will hold our TreeView instance
	
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
				var tmpNode = new YAHOO.widget.TextNode(node.label + "-" + i, node, false);
				buildRandomTextBranch(tmpNode);
			}
		}
	}
	
	//When the DOM is done loading, we can initialize our TreeView
	//instance:
	YAHOO.util.Event.onDOMReady(treeInit);
	
})();//anonymous function wrapper closed; () notation executes function</textarea>


