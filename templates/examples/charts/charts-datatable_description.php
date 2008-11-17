<h2 class="first">Create a DataSource</h2>

<p>The provider of data for the BarChart and the DataTable in this example is a standard JavaScript Array. Each Object in the Array contains multiple values that can be used for series in the BarChart or headers in the DataTable.</p>

<textarea name="code" class="JScript" cols="60" rows="10">
var annualIncome =
[
	{ year: 2003, revenue: 1246852, expense: 1123359, income: 123493 },
	{ year: 2004, revenue: 2451876, expense: 2084952, income: 366920 },
	{ year: 2005, revenue: 2917246, expense: 2587151, income: 330095 },
	{ year: 2006, revenue: 3318185, expense: 3087456, income: 230729 }
];

var incomeData = new YAHOO.util.DataSource( annualIncome );
incomeData.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
incomeData.responseSchema = { fields: [ "year", "revenue", "expense", "income" ] };
</textarea>

<p>The Array is passed to a new DataSource instance, and fields are defined to specify which items will be used from the original source.</p>

<h2>Define a Series Definition</h2>

<p>A series definition allows the chart to display more than one series, and one can use it customize the appearance and behavior of each series individually.</p>

<textarea name="code" class="JScript" cols="60" rows="10">
var seriesDef =
[
	{
		xField: "revenue",
		displayName: "Revenue"
	},
	{
		xField: "expense",
		displayName: "Expense"
	},
	{
		type: "line",
		xField: "income",
		displayName: "Income"
	}
];
</textarea>

<p>In the series definition above, each series uses the <code>xField</code> property to select a different key from the DataSource. The <code>displayName</code> property will provide a visual reference to the name of each series in the mouse-over data tip, and it will be displayed in the legend, if present.</p>

<p>Notice that the third series defines a <code>type</code> property. By customizing this value, we're able to build a combination chart that uses both bars and lines to display its data.</p>

<h2>Create the Chart</h2>

<p>The DataSource instance is passed as a required argument of the BarChart's constructor. The series definition is passed to the chart through an optional initialization attribute named <code>series</code>. We also specify the default <code>yField</code> to be used for categories and pass in a custom axis that formats its labels as currency.</p>

<textarea name="code" class="JScript" cols="60" rows="6">
var mychart = new YAHOO.widget.BarChart( "chart", incomeData,
{
	series: seriesDef,
	yField: "year",
	xAxis: currencyAxis
});
</textarea>

<h2>Define Column Headers and Create DataTable</h2>

<p>Similar to the Chart control's series definition, the DataTable control defines column headers. A <code>formatter</code> is set for each column that will display currency.</p>

<textarea name="code" class="JScript" cols="60" rows="8">
var columns =
[
	{key: "year", sortable: true, resizeable: true },
	{key: "revenue", formatter: "currency", sortable: true, resizeable: true },
	{key: "expense", formatter: "currency", sortable: true, resizeable: true },
	{key: "income", formatter: "currency", sortable: true, resizeable: true }
];
var table = new YAHOO.widget.DataTable( "datatable", columns, incomeData);
</textarea>

<p>Both the column headers and the DataSource instance are passed to the DataTable's constructor.</p>