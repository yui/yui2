<p>In many cases, you'll want to avoid rendering your <a
href="http://developer.yahoo.com/yui/treeview/">TreeView Control</a> with a
full dataset.  Rather, you'll want to load all visible nodes immediately and
then retrieve data only when needed for nodes that aren't visible when the
control is first loaded.  This example shows you how to do that.</p>

<p>In the TreeView instance below, we've loaded all "top-level" nodes into the
page as soon as the page loads; these nodes contain the names of many Indian
states.  When a node is expanded, we use <a
href="http://developer.yahoo.com/yui/connection/">Connection Manager</a> to
access <a
href="http://developer.yahoo.com/search/web/V1/relatedSuggestion.html">a Yahoo!
Search web service that will return a list of "related suggestions."</a>  So
when the page loads, we know nothing about our top-level nodes' children.  And
while the resulting TreeView instance could grow quite large through user
interaction, we need only load a very light set of nodes to begin with.
</p>

<p>This example also shows the two label styles for childless nodes.  The first
(default) style maintains the expand/collapse icon style even when the node has
no children; the second style shows childless nodes as leaf nodes with no
expand/collapse icon.  Note: this is for dynamically loaded nodes after the
dynamic load process has produced zero children.  You can also force the leaf
node presentation for any node by setting the isLeaf property to true (this
also disables dynamic loading).</p>
