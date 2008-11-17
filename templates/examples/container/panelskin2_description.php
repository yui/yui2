<h2 class="first">Skinning Panel: Beyond the Basics</h2>

<p>Panels can be skinned using only CSS, and a bit of extra markup. In the previous <a href="panelskin1.html">Skinning Tutorial</a>, we covered the basics of skinning Panels using CSS.</p>

<p>In this tutorial, we will create two Panels &mdash; one skinned to look like a Windows XP window, and one that looks like the Mac OS X Aqua style. First, let's look at the markup structure that will serve as the framework for our newly skinned Panels. You'll notice that a few additional elements have been added to the header and footer. The classes of these elements &mdash; "tl", "tr", "br" and "bl" &mdash; represent each of the corner images that will be applied to the XP skin. The Aqua skin will be built from script (not based on existing markup) using the same structure, although the rounded corners will only be applied to the top corners. The script and markup for the two skinned Panels are listed below: </p>

<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.example.container.panel2.setHeader("<div class='tl'></div><span>Panel #2 from Script</span><div class='tr'></div>");
YAHOO.example.container.panel2.setBody("This is a dynamically generated Panel.");
YAHOO.example.container.panel2.setFooter("<span>End of Panel #2</span>");
</textarea>

<textarea name="code" class="HTML" cols="60" rows="1">
<div id="panel1">
	<div class="hd"><div class="tl"></div><span>Panel #1 from Markup</span><div class="tr"></div></div>
	<div class="bd">This is a Panel that was marked up in the document.</div>
	<div class="ft"><div class="bl"></div><span>End of Panel #1</span><div class="br"></div></div>
</div>
</textarea>

<p>The skinning of these Panels is achieved using CSS definitions. As with the <a href="panelskin1.html">basic skinning example</a>, we'll start with <code>container/assets/container-core.css</code> as our base set of CSS rules, instead of <code>container/assets/skins/sam/container.css</code>, so that we don't have to reset the additional style properties which are applied to implement Sam Skin.</p>

<p>In this tutorial, we will use id selectors in our CSS definitions to specify which Panel should receive each skin. Most of the styles consist of background images that are applied to various pieces of the Panels. The styles are defined below:</p>

<h3>XP Panel Skin CSS</h3>
<textarea name="code" class="CSS" cols="60" rows="1">
	/* XP Panel Skin CSS */

	/* Skin default elements */
	#panel1_c.yui-panel-container.shadow .underlay {
		left:3px;
		right:-3px;
		top:3px;
		bottom:-3px;
		position:absolute;
		background-color:#000;
		opacity:0.12;
		filter:alpha(opacity=12);
	}

	/* Apply the border to the right side */
	#panel1.yui-panel {
		position:relative;
		border:none;
		overflow:visible;
		background:transparent url(assets/img/xp-brdr-rt.gif) no-repeat top right;
	}

	/* Style the close icon */
	#panel1.yui-panel .container-close {
		position:absolute;
		top:5px;
		right:8px;
		height:21px;
		width:21px;
		background:url(assets/img/xp-close.gif) no-repeat;
	}

	/* Style the header with its associated corners */
	#panel1.yui-panel .hd {
		padding:0;
		border:none;
		background:url(assets/img/xp-hd.gif) repeat-x;
		color:#FFF;
		height:30px;
		margin-left:8px;
		margin-right:8px;
		text-align:left;
		vertical-align:middle;
		overflow:visible;
	}

	/* Style the body with the left border */
	#panel1.yui-panel .bd {
		overflow:hidden;
		padding:10px;
		border:none;
		background:#FFF url(assets/img/xp-brdr-lt.gif) repeat-y; 
		margin:0 4px 0 0;
	}

	/* Style the footer with the bottom corner images */
	#panel1.yui-panel .ft {
		background:url(assets/img/xp-ft.gif) repeat-x;
		font-size:11px;
		height:26px;
		padding:0px 10px;
		border:none
	}

	/* Skin custom elements */
	#panel1.yui-panel .hd span {
		line-height:30px;
		vertical-align:middle;
		font-weight:bold;
	}
	#panel1.yui-panel .hd .tl {
		width:8px;
		height:29px;
		top:1px;
		left:0;
		background:url(assets/img/xp-tl.gif) no-repeat;
		position:absolute;
	}
	#panel1.yui-panel .hd .tr {
		width:8px;
		height:29px;
		top:1px;
		right:0;
		background:url(assets/img/xp-tr.gif) no-repeat; 
		position:absolute;
	}

	#panel1.yui-panel .ft span {
		line-height:22px;
		vertical-align:middle;
	}
	#panel1.yui-panel .ft .bl {
		width:8px;
		height:26px;
		bottom:0;
		left:0;
		background:url(assets/img/xp-bl.gif) no-repeat;
		position:absolute;
	}
	#panel1.yui-panel .ft .br {
		width:8px;
		height:26px;
		bottom:0;
		right:0;
		background:url(assets/img/xp-br.gif) no-repeat;
		position:absolute;
	}
</textarea>

<h3>Aqua Panel Skin CSS</h3>
<textarea name="code" class="CSS" cols="60" rows="1">
	/* Aqua Panel Skin CSS */

	/* Skin default Panel elements */
	#panel2_c.yui-panel-container.shadow .underlay {
		position:absolute;
		background-color:#000;
		opacity:0.12;
		filter:alpha(opacity=12);
		left:3px;
		right:-3px;
		bottom:-3px;
		top:3px;
	}
	#panel2.yui-panel {
		position:relative;
		border:none;
		overflow:visible;
		background-color:transparent;
	}

	/* Apply styles to the close icon to anchor it to the left side of the header */
	#panel2.yui-panel .container-close {
		position:absolute;
		top:3px;
		left:4px;
		height:18px;
		width:17px;
		background:url(assets/img/aqua-hd-close.gif) no-repeat;
	}
	/* span:hover not supported on IE6 */
	#panel2.yui-panel .container-close:hover {
		background:url(assets/img/aqua-hd-close-over.gif) no-repeat;
	}

	/* Style the header and apply the rounded corners, center the text */
	#panel2.yui-panel .hd {
		padding:0;
		border:none;
		background:url(assets/img/aqua-hd-bg.gif) repeat-x;
		color:#000;
		height:22px;
		margin-left:7px;
		margin-right:7px;
		text-align:center;
		overflow:visible;
	}
	/* Style the body and footer */
	#panel2.yui-panel .bd {
		overflow:hidden;
		padding:4px;
		border:1px solid #aeaeae;
		background-color:#FFF;
	}
	#panel2.yui-panel .ft {
		font-size:75%;
		color:#666;
		padding:2px;
		overflow:hidden;
		border:1px solid #aeaeae;
		border-top:none;
		background-color:#dfdfdf;
	}

	/* Skin custom elements */
	#panel2.yui-panel .hd span {
		vertical-align:middle;
		line-height:22px;
		font-weight:bold;
	}
	#panel2.yui-panel .hd .tl {
		width:7px;
		height:22px;
		top:0;
		left:0;
		background:url(assets/img/aqua-hd-lt.gif) no-repeat;
		position:absolute;
	}
	#panel2.yui-panel .hd .tr {
		width:7px;
		height:22px;
		top:0;
		right:0;
		background:url(assets/img/aqua-hd-rt.gif) no-repeat;
		position:absolute;
	}
</textarea>