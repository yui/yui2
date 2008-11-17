<h2 class="first">Label editing and keyboard navigation.</h2>

<p>This example for the <a href="http://developer.yahoo.com/yui/treeview/">TreeView Control</a> demonstrates user interaction models for inline editing and keyboard navigation. 
The second node in the tree, the one labeled <code>Label 1</code>, has the focus initially.  
The arrow, home and end keys can be used to move the focus on other nodes, 
the plus and minus (+/-) keys to expand/collapse nodes and shift-plus and shift-minus to expand-all/collapse-all.</p>

<p>The Enter key will act as a click on the node with the focus.  
It will expand or collapse it or will navigate if the node has an <code>href</code> property.</p>
<p>The example has event listeners for click, double-click and enter key pressed which will signal the event at the bottom of the box.
The click and double click events will not fire when the toggle icon is clicked since toggling has specific events associated with it.</p>

<p>Nodes defined by simple strings, instead of full object definitions, are plain non-editable TextNodes.  
They can be clicked, double-clicked and Enter pressed while the focus is on any of them.</p>

<p>A <code>DateNode</code> is included which is also editable via the <a href="http://developer.yahoo.com/yui/calendar/">YUI Calendar Control</a>.
The date is set in <code>dd.mm.yyyy</code> format and it has been declared so by the <code>calendarConfig</code> property which is 
the same used by Calendar (see: <a href="http://developer.yahoo.com/yui/calendar/#internationalization">Creating International Calendars</a>).</p>

<p>Here is the JavaScript we use to define the TreeView instance in this example:</p>

<textarea name="code" class="JScript" cols="60" rows="1">// Create a tree with an assortment of nodes
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
	{type:'Text',label:'Branch 3', editable:true, expanded:false, children:[
		'Label 3-0',
		'Label 3-1'
	]}
]);

// render it
tree.render();

// Make the editor pop-up on a double click
tree.subscribe('dblClickEvent',tree.onEventEditNode);

// Place the focus on the second node
tree.root.children[1].focus();

// report events
tree.subscribe('enterKeyPressed',function(node) {
	YAHOO.util.Dom.get('msg').innerHTML = 'Enter key pressed on node: ' + node.label;
});
tree.subscribe('clickEvent',function(oArgs) {
	YAHOO.util.Dom.get('msg').innerHTML = 'Click on node: ' + oArgs.node.label;
});
tree.subscribe('dblClickEvent',function(oArgs) {
	YAHOO.util.Dom.get('msg').innerHTML = 'Double click on node: ' + oArgs.node.label;
});
</textarea>
