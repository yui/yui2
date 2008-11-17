<style type="text/css">

	/*
		The TabView ARIA Plugin removes the "href" attribute from the <A> element of each 
		Tab, resulting in the focus outline no longer be rendered in Gecko-based browsers when the 
		<A> element is focused.  For this reason, it is necessary to restore the focus outline 
		for the <A>. 
	*/
	.yui-skin-sam .yui-navset .yui-nav a[role=tab]:focus {
		outline: dotted 1px #000;
	}

	/*
		Hide the instructional text in the H1 and the content of the LiveRegion outside the 
		viewport boundaries so it is only readable by users of screen readers.
	*/
	#tabview-title em,
	.yui-navset div[role=log] {
		position: absolute;
		left: -999em;
	}

</style>
<script type="text/javascript" src="../tabview/assets/tabviewariaplugin.js"></script>