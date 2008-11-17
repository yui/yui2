<div id="treewrapper">
	<div id="treediv"> </div>
</div>

<script>
//Wrap our initialization code in an anonymous function
//to keep out of the global namespace:
(function(){
	var init = function() {
		
		//create the TreeView instance:
		var tree = new YAHOO.widget.TreeView("treediv");
		
		//get a reusable reference to the root node:
		var root = tree.getRoot();
		
		//for Ahmed's documents, we'll use TextNodes.
		//First, create a parent node for his documents:
		var ahmedDocs = new YAHOO.widget.TextNode("Ahmed's Documents", root, true);
			//Create a child node for his Word document:
			var ahmedMsWord = new YAHOO.widget.TextNode("Prospectus", ahmedDocs, false);
			//Now, apply the "icon-doc" style to this node's
			//label:
			ahmedMsWord.labelStyle = "icon-doc";
			var ahmedPpt = new YAHOO.widget.TextNode("Presentation", ahmedDocs, false);
			ahmedPpt.labelStyle = "icon-ppt";
			var ahmedPdf = new YAHOO.widget.TextNode("Prospectus-PDF version", ahmedDocs, false);
			ahmedPdf.labelStyle = "icon-prv";
	
		//for Susheela's documents, we'll use HTMLNodes.
		//First, create a parent node for her documents:
		var sushDocs = new YAHOO.widget.TextNode("Susheela's Documents", root, true);
			//Create a child node for her zipped files:
			var sushZip = new YAHOO.widget.HTMLNode("<span class=\"htmlnodelabel\">Zipped Files</span>", sushDocs, false, true);
			//Now, apply the "icon-zip" style to this HTML node's
			//content:
			sushZip.contentStyle = "icon-zip";
			var sushDmg = new YAHOO.widget.HTMLNode("<span class=\"htmlnodelabel\">Files -- .dmg version</span>", sushDocs, false, true);
			sushDmg.contentStyle = "icon-dmg";
			var sushGen = new YAHOO.widget.HTMLNode("<span class=\"htmlnodelabel\">Script -- text version</span>", sushDocs, false, true);
			sushGen.contentStyle = "icon-gen";
			var sushJar = new YAHOO.widget.HTMLNode("<span class=\"htmlnodelabel\">JAR file</span>", sushDocs, false, true);
			sushJar.contentStyle = "icon-jar";
	
		tree.draw();
	}
	//Add an onDOMReady handler to build the tree when the document is ready
    YAHOO.util.Event.onDOMReady(init);
})();
</script>
