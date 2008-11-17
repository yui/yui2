
	<div id="ft">
        <p class="first">Copyright &copy; <?php print strftime("%Y"); ?> Yahoo! Inc. All rights reserved.</p>
        <p><a href="http://info.yahoo.com/privacy/us/yahoo/devel/details.html">Privacy Policy</a> - 
            <a href="http://docs.yahoo.com/info/terms/">Terms of Service</a> - 
            <a href="http://docs.yahoo.com/info/copyright/copyright.html">Copyright Policy</a> - 
            <a href="http://careers.yahoo.com/">Job Openings</a></p>
	</div>
</div>

<?php
//include code for syntax-highlighting boxes, mostly found on landing and example pages
if ($highlightSyntax) {
?>
<script src="/yui/assets/dpSyntaxHighlighter.js"></script>
<script language="javascript"> 
dp.SyntaxHighlighter.HighlightAll('code'); 
</script>
<?php
}



//only hardwire yuiloader on the page if we are not in the 
//examples directory; PHP Loader will handle all YUI script inclusion
//for examples.
if (!substr_count($_SERVER["REQUEST_URI"], "examples")) {
	if (substr_count($_SERVER["REQUEST_URI"], "articles/hosting")) {
		echo '<script type="text/javascript" src="http://yui.yahooapis.com/combo?'.$yuiUseVersion.'/build/yuiloader-dom-event/yuiloader-dom-event.js&'.$yuiUseVersion.'/build/element/element-beta-min.js&'.$yuiUseVersion.'/build/button/button-min.js&'.$yuiUseVersion.'/build/tabview/tabview-min.js"></script>';
	} else {
		echo '<script type="text/javascript" src="http://yui.yahooapis.com/'.$yuiUseVersion.'/build/yuiloader-dom-event/yuiloader-dom-event.js"></script>';
	}
}

if ($append) { //there is additional javascript for this page -- perhaps some use of YUI and/or custom js -- that is meant to be inserted at the last line of the file
	echo $append;
}
?>
<?php
if ($releasenotes) { 
?>
	<script type="text/javascript" src="/yui/docs/assets/yuiModuleMeta.js?v=3"></script>
	<script type="text/javascript" src="/yui/docs/assets/readme.js?v=3"></script>
<?php
}
?>

<script type="text/javascript" src="/yui/docs/assets/yuiSiteSearch.js?v=3"></script>


<!--MyBlogLog instrumentation-->
<script type="text/javascript" src="http://track2.mybloglog.com/js/jsserv.php?mblID=2007020704011645"></script>

</body>

</html>

