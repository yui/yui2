<?php

if (in_array($section, array("autocomplete", "button", "calendar", "colorpicker", "container", "datatable", "layout", "logger", "menu", "paginator", "editor", "profilerviewer", "resize", "tabview", "treeview"))) {
?>
Next, apply the <code>yui-skin-sam</code> class name to an element that is a parent of the element 
in which the <?php echo $component; ?> lives.  You can usually accomplish this simply by putting the class on the 
<code>&#60;body&#62;</code> tag:</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<body class="yui-skin-sam">
</textarea>

<p class="lastP">For more information on skinning YUI components and making use of default skins, 
see our <a href="http://developer.yahoo.com/yui/articles/skinning/">Understanding YUI Skins</a> 
article here on the website.</p>

<?php } ?>

<div class="configurator-notice">
<p><a href="/yui/articles/hosting/?<?php echo $section; ?>#configure"><img id="configuratorBadge" src="http://us.i1.yimg.com/us.yimg.com/i/ydn/yuiweb/img/configure.png" alt="YUI dependency configurator." title="Use the YUI dependency Configurator determine the optimal file list for your desired components; the Configurator uses YUI Loader to write out the full HTML for including the precise files you need for your implementation." height="127" width="150"></a>

<h3>YUI Dependency Configurator:</h3>
<p>Instead of copying and pasting the filepaths above, try letting <a href="/yui/articles/hosting/?<?php echo $section; ?>#configure">the YUI dependency Configurator determine the optimal file list for your desired components</a>; the Configurator uses YUI Loader write out the full HTML for including the precise files you need for your implementation.</p>

<p>
<?php

//include module name for YUI Loader if we're not on the Get or Yahoo Global
//page.  The local $section variable is the same as the YUI Loader's module
//name, so we'll use that here; its limitation is that it omits the option
//of using simpleeditor and containercore.
if ($section != "yuiloader") {
	if (($section != "yahoo") && ($section != "get")) { ?>
	<strong>Note:</strong> If you wish to include this component via the <a href="http://developer.yahoo.com/yui/yuiloader/">YUI Loader</a>, its module name is <code><?php echo $section; ?></code>. (<a href="http://developer.yahoo.com/yui/yuiloader/#modulenames">Click here for the full list of module names for YUI Loader.</a>)
	
	<?php } else { ?>
	
	<strong>Note:</strong> If you are loading components via the <a href="http://developer.yahoo.com/yui/yuiloader/">YUI Loader</a>, this component <em>is included in the YUI Loader package</em> &mdash; you do not need to load it separately. If YUI Loader is on the page, so is the <?php echo $component; ?>.
	
	
	<?php 
	}
}
?>
</p>
</div>


<div class="include-notice"><p class="firstP"><strong>Where these files come from:</strong> The files included using the text above will be served from Yahoo! servers; see "<a href="http://developer.yahoo.com/yui/articles/hosting/">Serving YUI Files from Yahoo!</a>" for important information about this service.  JavaScript files are minified, meaning that comments and white space have been removed to make them more efficient to download.  To use the full, commented versions or the <a href="http://developer.yahoo.com/yui/articles/faq/#debug"><code>-debug</code></a> versions of YUI JavaScript files, please <a href="http://developer.yahoo.com/yui/download/">download the library distribution</a> and host the files on your own server.</p>

<p><strong>Order matters:</strong> As is the case generally with JavaScript and CSS, order matters; these files should be included in the order specified above.  If you include files in the wrong order, errors may result.</p>

</div>
