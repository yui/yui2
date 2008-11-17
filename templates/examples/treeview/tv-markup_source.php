<h3>Tree from markup</h3>
<div id="markup" class="whitebg">
	<ul>
		<li>List 0
			<ul>
				<li>List 0-0
					<ul>
						<li>item 0-0-0</li>
						<li>item 0-0-1</li>
					</ul>
				</li>
			</ul>
		</li>
		<li>item 0-1
			<ul>
				<li><a target="_new" href="HTTP://developer.yahoo.com/yui" title="go to YUI Home Page">YUI</a>
					<ul>
						<li>item 0-1-0</li>
						<li>item 0-1-1</li>
					</ul>
				</li>
			</ul>
		</li>
	</ul>
</div>
<hr/>
<h3>Copy of the tree above taken from its own definition</h3>
<div id="treeDiv2" class="whitebg"></div>
<hr/>
<h3>Copy of the second branch of the tree at the top</h3>
<div id="treeDiv3" class="whitebg"></div>
<hr/>
<h3>Tree built from a static definition</h3>
<div id="treeDiv4" class="whitebg"></div>
<script type="text/javascript">

//global variable to allow console inspection of tree:
var tree1, tree2, tree3;

//anonymous function wraps the remainder of the logic:
(function() {
	var treeInit = function() {
		tree1 = new YAHOO.widget.TreeView("markup");
		tree1.render();
		
		tree2 = new YAHOO.widget.TreeView("treeDiv2",tree1.getTreeDefinition());
		tree2.render();

		var branch = tree1.getRoot().children[1];
		tree3 = new YAHOO.widget.TreeView("treeDiv3", branch.getNodeDefinition());
		tree3.render();
		
		(new YAHOO.widget.TreeView("treeDiv4",[
			'Label 0',
			{type:'Text', label:'text label 1', title:'this is the tooltip for text label 1'},
			{type:'Text', label:'branch 1', title:'there should be children here', expanded:true, children:[
				'Label 1-0'
			]},
			{type:'Text',label:'YAHOO',title:'this should be an href', href:'http://www.yahoo.com', target:'somewhere new'},
			{type:'HTML',html:'<a href="developer.yahoo.com/yui">YUI</a>'},
			{type:'MenuNode',label:'branch 3',title:'this is a menu node', expanded:false, children:[
				'Label 3-0',
				'Label 3-1'
			]}
		])).render();		
	};

	//Add an onDOMReady handler to build the tree when the document is ready
    YAHOO.util.Event.onDOMReady(treeInit);

})();

</script>