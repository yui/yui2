<h2 class="first">Creating a Color Picker Within a Dialog Based on Page Markup</h2>

<p>As noted above, this example differs from <a href="colorpicker-dialog-from-script.html">the previous example</a> only in that the markup for the <a href="http://developer.yahoo.com/yui/colorpicker/">Color Picker Control</a> instance is placed on the page rather than being generated automatically by the control. The purpose here is to reveal the underlying markup in such a way that you might begin modifying it (and the accompanying CSS file that ships with Color Picker <a href="http://developer.yahoo.com/yui/download/">in the YUI download</a>) to create highly customized interfaces.</p>

<p>The markup used in this example to arrange the Color Picker interface is shown in the code block below.  While you would not want to change the size of the slider elements, most of the remaining elements can be repositioned or restyled at your discretion to create an interface tailored to your specific design needs.</p>

<textarea name="code" class="HTML" cols="60" rows="1"><!--markup for the various Color Picker interface controls-->
<div id="yui-picker-controls" class="yui-picker-controls">
  <div class="hd"><a href="#" id="yui-picker-controls-label"></a></div>
  <div class="bd">
	<form name="yui-picker-form" method="post" action="<?php echo $assetsDirectory; ?>post.php">

	  <ul id="yui-picker-rgb-controls" class="yui-picker-rgb-controls">
		<li>R
		<input autocomplete="off" name="yui-picker-r" id="yui-picker-r" type="text" value="0" size="3" maxlength="3" /></li>
		<li>G
		<input autocomplete="off" name="yui-picker-g" id="yui-picker-g" type="text" value="0" size="3" maxlength="3" /></li>
		<li>B
		<input autocomplete="off" name="yui-picker-b" id="yui-picker-b" type="text" value="0" size="3" maxlength="3" /></li>
	  </ul>

	  <ul class="yui-picker-hsv-controls" id="yui-picker-hsv-controls">
		<li>H
		<input autocomplete="off" name="yui-picker-h" id="yui-picker-h" type="text" value="0" size="3" maxlength="3" /> &#176;</li>
		<li>S
		<input autocomplete="off" name="yui-picker-s" id="yui-picker-s" type="text" value="0" size="3" maxlength="3" /> %</li>
		<li>V
		<input autocomplete="off" name="yui-picker-v" id="yui-picker-v" type="text" value="0" size="3" maxlength="3" /> %</li>
	  </ul>

	  <ul class="yui-picker-hex-summary" id="yui-picker-hex-summary">
		<li id="yui-picker-rhex">
		<li id="yui-picker-ghex">
		<li id="yui-picker-bhex">
	  </ul>

	  <div class="yui-picker-hex-controls" id="yui-picker-hex-controls">
		# <input autocomplete="off" name="yui-picker-hex" id="yui-picker-hex" type="text" value="0" size="6" maxlength="6" />
	  </div>

	</form>
  </div>
</div>

<!--markup for swatches-->
<div class="yui-picker-swatch" id="yui-picker-swatch">&nbsp;</div>
<div class="yui-picker-websafe-swatch" id="yui-picker-websafe-swatch">&nbsp;</div></textarea>

<p>See <a href="colorpicker-dialog-from-script.html">the previous example</a> for a full exploration of the JavaScript being used to set up the Dialog and to process the Color Picker's data submission via <a href="http://developer.yahoo.com/yui/connection/">Connection Manager</a>.</p>
