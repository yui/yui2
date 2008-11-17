<h2 class="first">Create a Stacked BarChart</h2>

<p>When creating Bar and Column charts with multiple series, you have the ability to stack your series on top of one-another. In this example, we'll create stacked BarChart, which lets you show the absolute values of data points through their segments, as well as the total values of each series.</p>

<h2>Create a DataSource</h2>

<p>First, we'll create the DataSource to populate the chart. This DataSource contains four values, a year and three sets of sales figures.</code>

<textarea name="code" class="JScript">
YAHOO.example.annualSales =
[
	{ year: 2004, internetsales: 246852, printsales: 2523359, tvsales: 3123493 },
	{ year: 2005, internetsales: 851876, printsales: 1084952, tvsales: 3166920 },
	{ year: 2006, internetsales: 3917246, printsales: 587151, tvsales: 2330095 },
	{ year: 2007, internetsales: 5318185, printsales: 307456, tvsales: 1830729 }
];

var salesData = new YAHOO.util.DataSource( YAHOO.example.annualSales );
salesData.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
salesData.responseSchema = { fields: [ "year", "internetsales", "printsales", "tvsales" ] };
</textarea>

<h2>Define Series Definition</h2>

<p>We will have three series in our example, corresponding to the Internet sales, print sales, and TV sales.</p>

<textarea name="code" class="JScript">
var seriesDef =
[
	{
		xField: "internetsales",
		displayName: "Internet Sales"
	},
	{
		xField: "printsales",
		displayName: "Print Sales"
	},
	{
		xField: "tvsales",
		displayName: "Television Sales"
	}
];
</textarea>

<h2>Create an Axis</h2>

<p>Create a <code>NumericAxis</code> and set its <code>stackingEnabled</code> property to <code>true</code>. Assign a <code>labelFunction</code> to format the axis.</p>

<textarea name="code" class="JScript">
//used to format x axis
YAHOO.example.numberToCurrency = function( value )
{
	return YAHOO.util.Number.format(Number(value), {prefix: "$", thousandsSeparator: ","});
}

//Numeric Axis for our currency
var currencyAxis = new YAHOO.widget.NumericAxis();
currencyAxis.stackingEnabled = true;
currencyAxis.labelFunction = YAHOO.example.numberToCurrency;
</textarea>

<h2>Create a StackedBarChart</h2>

<p>Instantiate a <code>StackedBarChart</code> and set its <code>xAxis</code> to the <code>NumericAxis</code> you created.</p>

<textarea name="code" class="JScript">
var mychart = new YAHOO.widget.StackedBarChart( "chart", salesData,
{
	series: seriesDef,
	yField: "year",
	xAxis: currencyAxis,
	//only needed for flash player express install
	expressInstall: "assets/expressinstall.swf"
});
</textarea>

<p>The series bars will stack from left to right rather than aligning vertically. </p>