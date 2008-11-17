<h2 class="first">Create a DataSource</h2>

<p>Like the <a href="http://developer.yahoo.com/yui/datatable/">DataTable Control</a>, Charts use the <a href="http://developer.yahoo.com/yui/datasource/">DataSource Utility</a> for accessing the information it displays. A DataSource instance will accept many forms of data including simple JavaScript Arrays and external data loaded through XHR in formats including XML, JSON, and delimited text.</p>

<textarea name="code" class="JScript" cols="60" rows="10">
YAHOO.example.monthlyExpenses =
[
	{ month: "January", rent: 880.00, utilities: 894.68 },
	{ month: "February", rent: 880.00, utilities: 901.35 },
	{ month: "March", rent: 880.00, utilities: 889.32 },
	{ month: "April", rent: 880.00, utilities: 884.71 },
	{ month: "May", rent: 910.00, utilities: 879.811 },
	{ month: "June", rent: 910.00, utilities: 897.95 }
];

var myDataSource = new YAHOO.util.DataSource( YAHOO.example.monthlyExpenses );
myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
myDataSource.responseSchema =
{
	fields: [ "month", "rent", "utilities" ]
};
</textarea>

<p>In this example, data comes from a JavaScript Array. It is passed to the DataSource constructor. All of the fields (<code>"month"</code>, <code>"rent"</code>, and <code>"utilities"</code>) are included in the DataSource <code>responseSchema</code>.</p>

<h2>Define Multiple Series</h2>

<p>An Array of definitions allows you to specify more than one series to display in the Chart control. Each definition generally includes an <code>xField</code> or <code>yField</code> value that specifies which key in the DataSource is used to access the data for a particular axis.</p>

<textarea name="code" class="JScript" cols="60" rows="5">
var seriesDef = 
[
	{ displayName: "Rent", yField: "rent" },
	{ displayName: "Utilities", yField: "utilities" }
];
</textarea>

<p>A <code>displayName</code> is recommended to provide more information about a series to the viewer. This value is used in the mouse-over data tip and the legend, if displayed.</p>

<h2>Customize the Axis</h2>

<p>The LineChart in this example uses a custom NumericAxis. This axis has a minimum bound set to the value 800. A <code>labelFunction</code> is used to format each label on the axis.</p>

<textarea name="code" class="JScript" cols="60" rows="3">
var currencyAxis = new YAHOO.widget.NumericAxis();
currencyAxis.minimum = 800;
currencyAxis.labelFunction = YAHOO.example.formatCurrencyAxisLabel;
</textarea>

<p>The function <code>YAHOO.example.formatCurrencyAxisLabel()</code> uses the  <code>YAHOO.util.Number</code> class included with DataSource to format the text as currency.</p>

<textarea name="code" class="JScript" cols="60" rows="9">
YAHOO.example.formatCurrencyAxisLabel = function( value )
{
	return YAHOO.util.Number.format( value,
	{
		prefix: "$",
		thousandsSeparator: ",",
		decimalPlaces: 2
	});
}
</textarea>

<p>Due to the nature of ActionScript-JavaScript communication, this function must be globally accessible. It may not be a method of an object instance. Pass the function reference directly or a string representation of the function name. In this case, we pass a reference to <code>YAHOO.example.formatCurrencyAxisLabel</code>, but we can also use the string value <code>"YAHOO.example.formatCurrencyAxisLabel"</code>.</p>

<h2>Customize the Data Tip</h2>

<p>The chart uses a <code>dataTipFunction</code> to format the text appearing on its mouse-over data tip.</p>

<textarea name="code" class="JScript" cols="60" rows="6">
YAHOO.example.getDataTipText = function( item, index, series )
{
	var toolTipText = series.displayName + " for " + item.month;
	toolTipText += "\n" + YAHOO.example.formatCurrencyAxisLabel( item[series.yField] );
	return toolTipText;
}
</textarea>

<p>Notice that <code>getDataTipText()</code> extracts the y-axis value and formats it using <code>formatCurrencyAxisLabel()</code> to match the formatting on the axis labels.</p>

<h2>Creating the Chart</h2>

<p>All of the customizations made above are passed to the Chart control as initialization attributes. The <code>xField</code> attribute is used globally by all series, and each series defines its own <code>yField</code> to display different data than the other series.</p>

<textarea name="code" class="JScript" cols="60" rows="6">
var mychart = new YAHOO.widget.LineChart( "chart", myDataSource,
{
	xField: "month",
	series: seriesDef,
	yAxis: currencyAxis,
	dataTipFunction: YAHOO.example.getDataTipText
});
</textarea>

<p>Once again, don't forget the function reference we pass to <code>dataTipFunction</code> must be globally-accessible to allow Flash Player's ExternalInterface to call it.</p>