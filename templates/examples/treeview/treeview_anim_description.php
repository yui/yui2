<h2>Adding Animation Transitions to a TreeView Instance</h2>

<p>The code for this example is similar to the other examples included with TreeView.  The significant difference is that this example makes use of TreeView's <code>setExpandAnim</code> and <code>setCollapseAnim</code> methods, passing in as arguments TreeView's bundled transition objects.</p>

<textarea name="code" class="JScript" cols="60" rows="1">//instantiate the tree:
tree = new YAHOO.widget.TreeView("treeDiv1");
tree.setExpandAnim(YAHOO.widget.TVAnim.FADE_IN);
tree.setCollapseAnim(YAHOO.widget.TVAnim.FADE_OUT);

tree.subscribe("animStart", handleAnimStart);
tree.subscribe("animComplete", handleAnimComplete);</textarea>

<p>Additional transition effects can be added by building upon the pattern provided by the included <code>TVAnim</code> objects.</p>