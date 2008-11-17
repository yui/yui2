<span class="chart_title">Survey: What is your favorite season?</span>
<div id="chart">Unable to load Flash content. The YUI Charts Control requires Flash Player 9.0.45 or higher. You can install the latest version at the <a href="http://www.adobe.com/go/getflashplayer">Adobe Flash Player Download Center</a>.</p></div>

<script type="text/javascript">

	YAHOO.widget.Chart.SWFURL = "<?php echo $loader->base;?>/charts/assets/charts.swf";

//--- data

	YAHOO.example.publicOpinion =
	[
		{ response: "Summer", count: 564815 },
		{ response: "Fall", count: 664182 },
		{ response: "Spring", count: 248124 },
		{ response: "Winter", count: 271214 },
		{ response: "Undecided", count: 81845 }
	]

	var opinionData = new YAHOO.util.DataSource( YAHOO.example.publicOpinion );
	opinionData.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
	opinionData.responseSchema = { fields: [ "response", "count" ] };

//--- chart

	var mychart = new YAHOO.widget.PieChart( "chart", opinionData,
	{
		dataField: "count",
		categoryField: "response",
		style:
		{
			padding: 20,
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
		},
		//only needed for flash player express install
		expressInstall: "<?php echo $assetsDirectory; ?>expressinstall.swf"
	});


</script>