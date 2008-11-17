<div id="treeView" style="background-color:white"></div>
<div id="msg">&nbsp;</div>
<script type="text/javascript">

//global variable to allow console inspection of tree:
var tree;

//anonymous function wraps the remainder of the logic:
(function() {
	var treeInit = function() {
		tree = new YAHOO.widget.TreeView("treeView", [
			'Label 0',
			{type:'Text', label:'Label 1', editable:true},
			{type:'Text', label:'Branch 2', editable:true, expanded:true, children:[
				{type:'Text', label:'Branch 2-0', editable:true, children: [
					'Label 2-0-0',
					'Label 2-0-1'
				]},
				
				{type:'Text', label:'Branch 2-1', editable:true, children: [
					'Label 2-1-0',
					'Label 2-1-1'
				]},
			]},
			{type:'Text',label:'YAHOO', href:'http://www.yahoo.com', target:'YAHOO\'s home page'},
			{type:'DateNode',label:'31.3.2001',editable:true, calendarConfig: {
				DATE_FIELD_DELIMITER:".",
				MDY_DAY_POSITION:1,
				MDY_MONTH_POSITION:2,
				MDY_YEAR_POSITION:3
			}},
			{type:'text',label:'Branch 3', editable:true, expanded:false, children:[
				'Label 3-0',
				'Label 3-1'
			]}
		]);
		tree.render();

		tree.subscribe('dblClickEvent',tree.onEventEditNode);
		
		tree.root.children[1].focus();
		
		tree.subscribe('enterKeyPressed',function(node) {
			YAHOO.util.Dom.get('msg').innerHTML = 'Enter key pressed on node: ' + node.label;
		});
		tree.subscribe('clickEvent',function(oArgs) {
			YAHOO.util.Dom.get('msg').innerHTML = 'Click on node: ' + oArgs.node.label;
		});
		tree.subscribe('dblClickEvent',function(oArgs) {
			YAHOO.util.Dom.get('msg').innerHTML = 'Double click on node: ' + oArgs.node.label;
		});
		
			
	};

	//Add an onDOMReady handler to build the tree when the document is ready
    YAHOO.util.Event.onDOMReady(treeInit);

})();

</script>