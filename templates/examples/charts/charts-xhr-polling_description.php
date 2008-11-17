<h2 class="first">Create a DataSource that uses XHR</h2>

<p>If a DataSource loads its data from an external source through XHR, a Chart may continually poll the DataSource to determine if new data is available. Nothing special needs to be done to the DataSource. The Chart handles all the details.</p>

<textarea name="code" class="JScript">
var jsonData = new YAHOO.util.DataSource( "<?php echo $assetsDirectory; ?>generatedata.php?" );
jsonData.responseType = YAHOO.util.DataSource.TYPE_JSON;
jsonData.responseSchema =
{
		resultsList: "Results",
		fields: ["Name","Value"]
};
</textarea>

<h2>Turning on Chart Polling</h2>

<p>The <code>polling</code> attribute of the Chart control accepts a numeric value representing the number of milliseconds between requests for new data.</p>

<textarea name="code" class="JScript">
var mychart = new YAHOO.widget.ColumnChart( "chart", jsonData,
{
	xField: "Name",
	yField: "Value",
	yAxis: yAxis,
	polling: 2000
});
</textarea>

<p>In this case, the Chart control will ask the DataSource to reload its data every two seconds. When new data is available, the chart will redraw or animate to display the new information.</p>