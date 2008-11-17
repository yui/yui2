<h2 class="first">Building trees from HTML markup or from previous definitions.</h2>

<p>In this brief example for the <a href="http://developer.yahoo.com/yui/treeview/">TreeView Control</a>, 
we begin with a <code>&lt;div&gt;</code> containing a set of nested unordered lists <code>&lt;ul&gt;</code>
providing the basic tree structure</p>

<textarea name="code" class="JScript" cols="60" rows="1"><div id="markup">
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
</div></textarea>

<p>We create a new TreeView and render it.  The TreeView will read the existing HTML and build the nodes from it.</p>

<textarea name="code" class="JScript" cols="60" rows="1">tree1 = new YAHOO.widget.TreeView("markup");
tree1.render();</textarea>

<p>Once we have a tree, we can read its definition, preserve it somehow and then build an identical tree from it.
In the second part we are building a couple of trees, one identical to the full tree
and another one from just a branch of it</p>

<textarea name="code" class="JScript" cols="60" rows="1">tree2 = new YAHOO.widget.TreeView("treeDiv2", tree1.getTreeDefinition());
tree2.render();

var branch = tree1.getRoot().children[1];
tree3 = new YAHOO.widget.TreeView("treeDiv3", branch.getNodeDefinition());
tree3.render();
</textarea>
<p>For <code>tree2</code> we have used the full tree definition from the first tree.  
For <code>tree3</code> we have first located a branch, for this sample, the second branch from the root
and used its definition for the tree</p>

<p>Finally, in the last tree, we used an object literal to define the full tree.</p>


<textarea name="code" class="JScript" cols="60" rows="1">(new YAHOO.widget.TreeView("treeDiv4",[
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
</textarea>

<p>Here we provide as a second argument to the constructor an array where each item can be either an 
object literal or a simple string, such as <code>'Label 0'</code>, 
which will be converted to a simple TextNode.</p>
<p>The items in the array can also be objects containing more detailed definitions for each node.  
All require a <code>type</code> property using either a short-name such as <code>'Text'</code> or <code>'HTML'</code> (case-insensitive)
or the object name of the node type like <code>'MenuNode'</code>, which will be resolved to YAHOO.widget.MenuNode.</p>
<p>Object definitions allow precise control over the tree since any public property of each node can be specified,
for example, some nodes start expanded while others collapsed. We cannot have such expressiveness from plain HTML markup.</p>
<p>We have defined a couple of external links.  In the first one, labeled <code>YAHOO</code>, the link has the
generic style of the rest of the nodes in the tree.  In the second one, labeled <code>YUI</code>, we have used an HTMLNode
instead of a TextNode so TreeView copies that string into the node without adding further classNames so it gets a different look.</p>
<p>The last node, being a MenuNode, forces other branches to collapse when expanded.  The other node with children, being a plain node
doesn't mind if other nodes remain expanded.</p>
<p>Nodes may contain a <code>children</code> property containing further node definitions.</p>