<h2 class="first">Creating and Applying Custom Node Icons for Your TreeView:</h2>

<p>Many tree-style implementations call for using custom
icons on a per-node basis.  In this example, we'll look at one strategy for
apply custom icons to specific nodes using the <a
href="http://developer.yahoo.com/yui/treeview/">YUI TreeView Control</a>.</p>

<p>We'll start by using a single image containing our icon set and we'll use
the technique known as "<a
href="http://www.alistapart.com/articles/sprites">CSS Sprites</a>" to specify
which icon we want to use for each specific style.  This allows us to combine
seven images in a single HTTP request (<a
        href="http://yuiblog.com/blog/2006/11/28/performance-research-part-1/">read more about why reducing HTTP requests is a good idea</a>).
The raw image is displayed below.</p>

<style>
    #figure1 {background-color:#FFFCE9;padding:1em;border:1px solid grey}
</style>

<p><img id="figure1" src="<?php echo $assetsDirectory; ?>img/icons.png" width="18" height="252" alt="Our icon images are combined into a single png file to reduce HTTP requests." /></p>

<p>With that image in place, we can now set up our style rules to identify icons for each file type.  
We do that by positioning our <code>icons.png</code> image uniquely for each icon we want to display:</p>
                
<textarea name="code" class="HTML" cols="60" rows="1"><style type="text/css">
.icon-ppt { display:block; height: 22px; padding-left: 20px; background: transparent url(../treeview/assets/img/icons.png) 0 0px no-repeat; }
.icon-dmg { display:block; height: 22px; padding-left: 20px; background: transparent url(../treeview/assets/img/icons.png) 0 -36px no-repeat; }
.icon-prv { display:block; height: 22px; padding-left: 20px; background: transparent url(../treeview/assets/img/icons.png) 0 -72px no-repeat; }
.icon-gen { display:block; height: 22px; padding-left: 20px; background: transparent url(../treeview/assets/img/icons.png) 0 -108px no-repeat; }
.icon-doc { display:block; height: 22px; padding-left: 20px; background: transparent url(../treeview/assets/img/icons.png) 0 -144px no-repeat; }
.icon-jar { display:block; height: 22px; padding-left: 20px; background: transparent url(../treeview/assets/img/icons.png) 0 -180px no-repeat; }
.icon-zip { display:block; height: 22px; padding-left: 20px; background: transparent url(../treeview/assets/img/icons.png) 0 -216px no-repeat; }
.htmlnodelabel { margin-left: 20px; }
</style></textarea>

<p>The effect of these style rules is to create a 20-pixel space to the left of the styled object and to place the icon directly in that space.  The sheet of icons is positioned so that, for example, the zip-file icon will appear when the class <code>icon-zip</code> is applied.</p>

<p>To apply these styles on a per-node basis in TreeView, we use the <a href="http://developer.yahoo.com/yui/docs/YAHOO.widget.TextNode.html#labelStyle">labelStyle</a> property of <a href="http://developer.yahoo.com/yui/docs/YAHOO.widget.TextNode.html">TextNodes</a> and <a href="http://developer.yahoo.com/yui/docs/YAHOO.widget.MenuNode.html">MenuNodes</a> and the <a href="http://developer.yahoo.com/yui/docs/YAHOO.widget.HTMLNode.html#contentStyle">contentStyle</a> property of <a href="http://developer.yahoo.com/yui/docs/YAHOO.widget.HTMLNode.html">HTMLNodes</a>.</p>

<p>Here is the code used to create the TreeView instance above and to create the first node, "Ahmed's Documents," while applying the specific icon styles to each node:</p>

<textarea name="code" class="JScript" cols="60" rows="1">//create the TreeView instance:
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
    ahmedPdf.labelStyle = "icon-prv";</textarea>
    
<p>The script for creating Susheela's part of the tree is very similar.  Here, we'll use HTMLNodes, and we'll use the <code>contentStyle</code> property to apply the icon style:</p>

<textarea name="code" class="JScript" cols="60" rows="1">//for Susheela's documents, we'll use HTMLNodes.
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
    sushJar.contentStyle = "icon-jar";</textarea>
    
<p>Note that in this example we're also applying <a href="<?php echo $assetsDirectory; ?>css/folders/tree.css">the "folder style" CSS file</a> that is included with the TreeView Control's examples; you can find that file in <a href="http://developer.yahoo.com/yui/download/">the YUI distribution</a> under <code>/examples/treeview/assets/css/folders/tree.css</code>.</p>
