<div id="treeDiv1"></div>

<script type="text/javascript">

//global variable to allow console inspection of tree:
var tree;

//anonymous function wraps the remainder of the logic:
(function() {

    var tt, contextElements = [];

	//function to initialize the tree:
    function treeInit() {
        buildRandomTextNodeTree();
        // Instantiate the single tooltip passing in the list of all of
        // the node label element ids
        tt = new YAHOO.widget.Tooltip("tt", { 
                    context: contextElements 
                });
    }
    
	//Function  creates the tree and 
	//builds between 3 and 7 children of the root node:
    function buildRandomTextNodeTree() {
	
		//instantiate the tree:
        tree = new YAHOO.widget.TreeView("treeDiv1");

        for (var i = 0; i < Math.floor((Math.random()*4) + 3); i++) {
            var o = {
                label: "label-" + i,

                // Tooltip will use the title attribute
                title: "This is " + "label-" + i
            };
            var tmpNode = new YAHOO.widget.TextNode(o, tree.getRoot(), false);

            // Generate the markup for this node when the tree is first
            // rendered.  This is necessary in order to make sure tooltips
            // can be attached to hidden nodes.
            tmpNode.renderHidden = true;

            // save the element id for Tooltip
            contextElements.push(tmpNode.labelElId);

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
                var o = {
                    label: node.label + "-" + i,
                    // Tooltip will use the title attribute
                    title: "This is " + node.label + "-" + i
                };
                var tmpNode = new YAHOO.widget.TextNode(o, node, false);
                // save the element id for Tooltip
                contextElements.push(tmpNode.labelElId);
            }
        }
    }

	//Add an onDOMReady handler to build the tree when the document is ready
    YAHOO.util.Event.onDOMReady(treeInit);

})();

</script>
