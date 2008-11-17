<span class="chart_title"></span>
<div id="chart">Unable to load Flash content. The YUI Charts Control requires Flash Player 9.0.45 or higher. You can download the latest version of Flash Player from the <a href="http://www.adobe.com/go/getflashplayer">Adobe Flash Player Download Center</a>.</p></div>

<script type="text/javascript">

	YAHOO.widget.Chart.SWFURL = "<?php echo $loader->base;?>/charts/assets/charts.swf";

//--- data

	var jsonData = new YAHOO.util.DataSource( "<?php echo $assetsDirectory; ?>generatedata.php?" );
	//use POST so that IE doesn't cache the data
	jsonData.connMethodPost = true;
	jsonData.responseType = YAHOO.util.DataSource.TYPE_JSON;
	jsonData.responseSchema =
	{
			resultsList: "Results",
			fields: ["Name","Value"]
	};
//--- chart

	var yAxis = new YAHOO.widget.NumericAxis();
	yAxis.minimum = 0;
	yAxis.maximum = 100;
	
	var mychart = new YAHOO.widget.ColumnChart( "chart", jsonData,
	{
		xField: "Name",
		yField: "Value",
		yAxis: yAxis,
		polling: 2000,
		//only needed for flash player express install
		expressInstall: "<?php echo $assetsDirectory; ?>expressinstall.swf"
	});
</script>