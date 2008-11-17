<span class="chart_title">Widgets, Inc. Financial Summary 2003-2006</span>
<div id="chart">Unable to load Flash content. The YUI Charts Control requires Flash Player 9.0.45 or higher. You can download the latest version of Flash Player from the <a href="http://www.adobe.com/go/getflashplayer">Adobe Flash Player Download Center</a>.</p></div>

<div id="datatable"></div>

<script type="text/javascript">

	YAHOO.widget.Chart.SWFURL = "<?php echo $loader->base;?>/charts/assets/charts.swf";
	
	//used to format x axis labels
	YAHOO.example.numberToCurrency = function( value )
	{
		return YAHOO.util.Number.format(Number(value), {prefix: "$", thousandsSeparator: ","});
	}
	
	//manipulating the DOM causes problems in ie, so create after window fires "load"
	YAHOO.util.Event.addListener(window, "load", function()
	{ 
	
	//--- data
   
		YAHOO.example.annualIncome =
		[
			{ year: 2003, revenue: 1246852, expense: 1123359, income: 123493 },
			{ year: 2004, revenue: 2451876, expense: 2084952, income: 366920 },
			{ year: 2005, revenue: 2917246, expense: 2587151, income: 330095 },
			{ year: 2006, revenue: 3318185, expense: 3087456, income: 230729 }
		];
   
		var incomeData = new YAHOO.util.DataSource( YAHOO.example.annualIncome );
		incomeData.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
		incomeData.responseSchema = { fields: [ "year", "revenue", "expense", "income" ] };
   
	//--- chart
   
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
   
		var currencyAxis = new YAHOO.widget.NumericAxis();
		currencyAxis.labelFunction = "YAHOO.example.numberToCurrency";
   
		var mychart = new YAHOO.widget.BarChart( "chart", incomeData,
		{
			series: seriesDef,
			yField: "year",
			xAxis: currencyAxis,
			//only needed for flash player express install
			expressInstall: "<?php echo $assetsDirectory; ?>expressinstall.swf"
		});
   
	//--- data table
	
		var columns =
		[
			{ key: "year", sortable: true, resizeable: true },
			{ key: "revenue", formatter: "currency", sortable: true, resizeable: true },
			{ key: "expense", formatter: "currency", sortable: true, resizeable: true },
			{ key: "income", formatter: "currency", sortable: true, resizeable: true }
		];
		var mytable = new YAHOO.widget.DataTable( "datatable", columns, incomeData,
			{ sortedBy: { key: "year", dir: "asc" }
		});
	});

</script>