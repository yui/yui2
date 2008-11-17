<span class="chart_title">Wilson's Supermarket - Product Comparison</span>
<div id="chart">Unable to load Flash content. The YUI Charts Control requires Flash Player 9.0.45 or higher. You can download the latest version of Flash Player from the <a href="http://www.adobe.com/go/getflashplayer">Adobe Flash Player Download Center</a>.</p></div>

<script type="text/javascript">

	YAHOO.widget.Chart.SWFURL = "<?php echo $loader->base;?>/charts/assets/charts.swf";

//--- data

	YAHOO.example.salesComparison =
	[
		{ month: "Oct", pork: 1354, beef: 1442 },
		{ month: "Nov", pork: 1326, beef: 1496 },
		{ month: "Dec", pork: 1292, beef: 1582 },
		{ month: "Jan", pork: 1387, beef: 1597 },
		{ month: "Feb", pork: 1376, beef: 1603 }
	];

	var salesData = new YAHOO.util.DataSource( YAHOO.example.salesComparison );
	salesData.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
	salesData.responseSchema = { fields: [ "month", "pork", "beef" ] };

//--- chart

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

	var mychart = new YAHOO.widget.ColumnChart( "chart", salesData,
	{
		series: seriesDef,
		xField: "month",
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
		},
		//only needed for flash player express install
		expressInstall: "<?php echo $assetsDirectory; ?>expressinstall.swf"
	});
</script>