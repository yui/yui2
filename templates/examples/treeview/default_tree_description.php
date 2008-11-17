<h2 class="first">Getting Started with the TreeView Control</h2>

<p>In this simple example for the <a href="http://developer.yahoo.com/yui/treeview/">TreeView Control</a>, we begin with a target <code>&lt;div&gt;</code> on the page; that target <code>&lt;div&gt;</code> is where our tree will be built. </p>

<textarea name="code" class="JScript" cols="60" rows="1"><div id="treeDiv1"></div></textarea>

<p>We can now instantiate our TreeView and populate its nodes.</p>

<textarea name="code" class="JScript" cols="60" rows="1">//instantiate the TreeView control:
var tree = new YAHOO.widget.TreeView("treeDiv1");

//get a reference to the root node; all
//top level nodes are children of the root node:
var rootNode = tree.getRoot();

//begin adding children
var tmpNode = new YAHOO.widget.TextNode("My nodelabel", tree.getRoot(), false);

//the tree won't show up until you draw (render) it:
tree.draw();</textarea>

<p>Once you have a tree in place, and even before you call its <code>draw()</code> method, you can begin subscribing to <a href="http://developer.yahoo.com/yui/docs/YAHOO.widget.TreeView.html#animComplete">the events in its API</a>.  For example, if you'd like to execute a function each time a node is collapsed, you would do the following:</p>

<textarea name="code" class="JScript" cols="60" rows="1">tree.subscribe("collapse", function(node) {
	  alert(node.index + " was collapsed");
   });
</textarea>

<p>For the sake of this example, we've elaborated on the code above and used loops and some random number logic to build out a larger tree.  We've stubbed out some additional event handlers that you might want to experiment with.  We've also wrapped the entire snippet in an anonymous function.  Here's the full source of the JavaScript we're using to generate the TreeView:</p>

<textarea name="code" class="JScript" cols="60" rows="1">//global variable to allow console inspection of tree:
var tree;

//anonymous function wraps the remainder of the logic:
(function() {

	//function to initialize the tree:
    function treeInit() {
        buildRandomTextNodeTree();
    }
    
	//Function  creates the tree and 
	//builds between 3 and 7 children of the root node:
    function buildRandomTextNodeTree() {
	
		//instantiate the tree:
        tree = new YAHOO.widget.TreeView("treeDiv1");

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

<p>Use this simple example to get started in your explorations of the TreeView Control, then move on to the more complex examples that explore additional features the control offers.</p>