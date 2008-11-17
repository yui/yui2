<style type="text/css">

	/* Default/unfocused Panel style */
	.yui-skin-sam div[role=panel].yui-panel .hd {
		background: #F2F2F2;
	}

	/* Focused Panel style */	
	.yui-skin-sam .yui-panel-container.focused div[role=panel].yui-panel .hd {
		background: url(http://yui.yahooapis.com/2.5.2/build/assets/skins/sam/sprite.png) repeat-x 0 -200px;
	}
	
	/*
		The Container ARIA Plugin removes the "href" attribute from the <A> used to create the 
		close button for a Panel, resulting in the focus outline no longer be rendered in 
		Gecko-based browsers when the <A> element is focused.  For this reason, it is necessary to 
		restore the focus outline for the <A>.
	*/	
	a.container-close[role=button]:focus {
		outline: dotted 1px #000;
	}

	/*
		Necessary to explicitly set the text-align property so the content of the Panels 
		is aligned properly when viewed inside the YUI Examples chrome.
	*/
	#panel-2,
	#panel-3 {
		text-align: left;
	}
	
</style>

<script type="text/javascript" src="../container/assets/containerariaplugin.js"></script>