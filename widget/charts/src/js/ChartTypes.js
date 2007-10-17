YAHOO.widget.LineChart = function(containerId, dataSource, attributes)
{
	YAHOO.widget.LineChart.superclass.constructor.call(this, "line", containerId, dataSource, attributes);
};

YAHOO.lang.extend(YAHOO.widget.LineChart, YAHOO.widget.CartesianChart);

YAHOO.widget.ColumnChart = function(containerId, dataSource, attributes)
{
	YAHOO.widget.ColumnChart.superclass.constructor.call(this, "column", containerId, dataSource, attributes);
};

YAHOO.lang.extend(YAHOO.widget.ColumnChart, YAHOO.widget.CartesianChart);

YAHOO.widget.BarChart = function(containerId, dataSource, attributes)
{
	YAHOO.widget.BarChart.superclass.constructor.call(this, "bar", containerId, dataSource, attributes);
};

YAHOO.lang.extend(YAHOO.widget.BarChart, YAHOO.widget.CartesianChart);