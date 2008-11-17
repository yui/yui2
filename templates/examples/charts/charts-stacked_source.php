<span class="chart_title">Media Conglomerate Ad Sales Summary 2004-2007</span>
<div id="chart">Unable to load Flash content. The YUI Charts Control requires Flash Player 9.0.45 or higher. You can download the latest version of Flash Player from the <a href="http://www.adobe.com/go/getflashplayer">Adobe Flash Player Download Center</a>.</p></div>

<script type="text/javascript">

	YAHOO.widget.Chart.SWFURL = "../../build/charts/assets/charts.swf";

//--- data

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

//--- chart

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

	//used to format x axis
	YAHOO.example.numberToCurrency = function( value )
	{
		return YAHOO.util.Number.format(Number(value), {prefix: "$", thousandsSeparator: ","});
	}

	//Numeric Axis for our currency
	var currencyAxis = new YAHOO.widget.NumericAxis();
	currencyAxis.stackingEnabled = true;
	currencyAxis.labelFunction = YAHOO.example.numberToCurrency;

	var mychart = new YAHOO.widget.StackedBarChart( "chart", salesData,
	{
		series: seriesDef,
		yField: "year",
		xAxis: currencyAxis,
		//only needed for flash player express install
		expressInstall: "assets/expressinstall.swf"
	});

</script>