<h2 class="first">Styling the Chart</h2>

<p>To change the visual appearance of a <a href="http://developer.yahoo.com/yui/charts/">Charts Control</a> instance, one uses the <code>style</code> initialization attribute. Each part of the chart, including the background and border, xAxis and yAxis, and the dataTip may be customized.</p>

<textarea name="code" class="JScript" rows="10" cols="60">
style:
{
	border: {color: 0x96acb4, size: 12},
	font: {name: "Arial Black", size: 14, color: 0x586b71},
	dataTip:
	{
		border: {color: 0x2e434d, size: 2},
		font: {name: "Arial Black", size: 13, color: 0x586b71}
	},
	xAxis:
	{
		color: 0x2e434d
	},
	yAxis:
	{
		color: 0x2e434d,
		majorTicks: {color: 0x2e434d, length: 4},
		minorTicks: {color: 0x2e434d, length: 2},
		majorGridLines: {size: 0}
	}
}
</textarea>

<p>Notice that the main <code>font</code> style applies to both of the axes on the chart. The dataTip includes a custom <code>border</code> and <code>font</code>. The yAxis includes custom ticks and we hide the majorGridLines by setting the <code>size</code> value to <code>0</code>.</p>

<h2>Setting Series Skins</h2>

<p>The series definition includes <code>style</code> values for both series with declarations the for background image and color. These particular skins are transparent PNG images, and they allow the base color of the marker to show through. The marker size matches the image width.</p>
	
<textarea name="code" class="JScript" rows="10" cols="60">
var seriesDef =
[
	{
		yField: "pork",
		displayName: "Sales of Pork",
		style:
		{
			image: "<?php echo $assetsDirectory; ?>tube.png",
			mode: "no-repeat",
			color: 0x2e434d,
			size: 40
		}
	},
	{
		yField: "beef",
		displayName: "Sales of Beef",
		style:
		{
			image: "<?php echo $assetsDirectory; ?>tube.png",
			mode: "no-repeat",
			color: 0xc2d81e,
			size: 40
		}
	}
];
</textarea>

<p>The <code>mode</code> value specifies how the image will be displayed. In this case <code>"no-repeat"</code> ensures that the image will be displayed only once. Other possible values include <code>"repeat"</code>, <code>"repeat-x"</code>, <code>"repeat-y"</code>, and <code>"stretch"</code>.