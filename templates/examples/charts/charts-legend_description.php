<h2 class="first">Add the Legend</h2>

<p>The <a href="http://developer.yahoo.com/yui/charts/">Charts Control</a> may display a legend by specifying the legend display style. Accepted values include <code>"top"</code>, <code>"right"</code>, <code>"bottom"</code>, <code>"left"</code>, and the default value <code>"none"</code>.</p>

<textarea name="code" class="JScript" cols="60" rows="7">
style:
{
	legend:
	{
		display: "right"
	}
}
</textarea>

<p>Legends that are displayed on the left or right sides will arrange their series or category items vertically. When you specify that the legend should be displayed on the top or bottom, it will arrange its items horizontally.</p>

<h2>Other Legend Styles</h2>

<p>Several substyles are available to allow you to customize the legend to fit your needs. In this example, we customize the font used by the text in the legend, the padding between the legend's items and the edge of the legend, and the spacing between the legend's items.</p>

<textarea name="code" class="JScript" cols="60" rows="10">
legend:
{
	display: "right",
	padding: 10,
	spacing: 5,
	font:
	{
		family: "Arial",
		size: 13
	}
}
</textarea>

<p>There are more styles available for legends, including border and background options. For full details about the legend styles, read the <a href="http://developer.yahoo.com/yui/charts/">Charts Control User's Guide</a>.