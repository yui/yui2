<h2 class="first">Skinning the Panel Control with Custom CSS</h2>

<p>Panels (and all other containers using Standard Module Format) can be skinned using CSS to customize the look and feel of each component. In order to best explain how to customize the Panel's style, it is important to first understand the structure of the basic Panel. The Panel, with the default Sam skin applied looks like this:</p>

<p><img src="<?php echo $assetsDirectory; ?>img/skin-module.gif" width="320" height="99" alt="Panel Sam skin" /></p>

<p>Breaking the Panel down into its basic Standard Module Format, its structure can be diagrammed as such:</p>

<p><img src="<?php echo $assetsDirectory; ?>img/skin-chart.gif" width="320" height="99" alt="Basic panel structure" /></p>

<h3>Core CSS</h3>

<p>Since we're modifying virtually every aspect of the default Sam skin look for the panel, we'll include <code>container/assets/container-core.css</code> as our base set of CSS rules, instead of <code>container/assets/skins/sam/container.css</code>.</p>

<p>This way, we don't have to reset the additional style properties which are applied to implement Sam skin's look and feel. Our <a href="http://developer.ysahoo.com/yui/articles/skinning/">Understanding YUI Skins</a> article provides more information about skinning YUI components and the CSS files involved.</p>

<h3>Adding Custom Skin CSS</h3>

<p>The Panel, like all other YUI Container controls, has a header, body, and footer. In addition, the Panel also has a "close" element containing a background image to give it the appearance of a UI window close control. In this tutorial, we will manipulate the CSS styles for these elements and create several new elements to allow for additional pieces of the skin to be styled.</p>

<p>First, we will create rounded corners for our skin by applying images to the top left and top right corners of the Panel header. All of our CSS styles are applied to this Panel instance using ID selectors. In this case, the Panel's ID will be "myPanel", so all styles will begin with "#myPanel". In order to facilitate the creation of these corners, we will create two new empty <code>div</code> elements in the header, classed as "tl" and "tr" for "top left" and "top right":</p>

<textarea name="code" class="HTML" cols="60" rows="1">
	<div class="hd">
		<div class="tl"></div>
		<span>Panel from Markup</span>
		<div class="tr"></div>
	</div>
</textarea>

<p> Notice that the title is placed into a <code>span</code> tag. This is so that it can be more easily styled using CSS. The images will be applied as background images to each of our new corner elements, along with width and height styles, positioning, and margins:</p>

<textarea name="code" class="CSS" cols="60" rows="1">
#myPanel.yui-panel .hd { 
	padding:0;
	border:none;
	background:url(assets/img/aqua-hd-bg.gif) repeat-x;
	color:#000;
	height:22px;
	margin-left:6px;
	margin-right:6px;
	text-align:center;
	overflow:visible;
}

#myPanel.yui-panel .hd span {
	vertical-align:middle;
	line-height:22px;
	font-weight:bold;
}
#myPanel.yui-panel .hd .tl {
	width:7px;
	height:22px;
	top:0;
	left:0px;
	background:url(assets/img/aqua-hd-lt.gif) no-repeat;
	position:absolute;
}
#myPanel.yui-panel .hd .tr {
	width:7px;
	height:22px;
	top:0;
	right:0px;
	background:url(assets/img/aqua-hd-rt.gif) no-repeat;
	position:absolute;
}
</textarea>

<p>After absolutely positioning the new corner elements, they are anchored to the left and right corners of the header, as shown in this diagram:</p>

<p><img src="<?php echo $assetsDirectory; ?>img/skin-corners.gif" width="320" height="99" alt="Panel rounded corner elements" /></p>

<p>In this skin, we want our close icon to be positioned on the left side of the header, rather than the right side. We can override the existing "close" style so that the icon will be placed on the left. At the same time, we will apply background images to the close icon for both secure (https) and non-secure (https) servers. Since mixed content from secure and non-secure sites can cause security warnings in some browsers, YUI Container provides CSS hooks for both contexts so that you can specify proper sources for both.</p>

<textarea name="code" class="CSS" cols="60" rows="1">
#myPanel.yui-panel .container-close {
	position:absolute;
	top:3px;
	left:4px;
	height:18px;
	width:17px;
	background:url(assets/img/aqua-hd-close.gif) no-repeat; 
}

/* span:hover not supported on IE6 */
#myPanel.yui-panel .container-close:hover {
	background:url(assets/img/aqua-hd-close-over.gif) no-repeat; 
}

</textarea>

<p>Again, charting the repositioned close icon, it would look like this:</p>

<p><img src="<?php echo $assetsDirectory; ?>img/skin-close.gif" width="320" height="99" alt="Panel close element position" /></p>

<p>Styling the body and footer are as simple as overriding the default styles with the desired ones:</p>

<textarea name="code" class="CSS" cols="60" rows="1">
#myPanel.yui-panel .bd {
	overflow:hidden;
	padding:4px;
	border:1px solid #aeaeae;
	background-color:#FFF;
}
#myPanel.yui-panel .ft {
	font-size:75%;
	color:#666;
	padding:2px;
	overflow:hidden;
	border:1px solid #aeaeae;
	border-top:none;
	background-color:#dfdfdf;
}
</textarea>

<p>After applying all the styles to our Panel instance, the final output looks like the image below. Looking at the chart, we can see where the original familiar elements end up in the new layout, in addition to our newly created corner elements:</p>

<p><img src="<?php echo $assetsDirectory; ?>img/skin-final.gif" width="640" height="99" alt="Final Aqua skin panel and structure"/></p>

<p>We will tackle another skinning example in the <a href="panelskin2.html">Advanced Skinning Tutorial</a>.</p>
