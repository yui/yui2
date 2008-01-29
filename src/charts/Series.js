/**
 * Series class for the YUI Charts widget.
 *
 * @namespace YAHOO.widget
 * @class Series
 * @constructor
 */
YAHOO.widget.Series = function() {};

YAHOO.widget.Series.prototype = 
{
	/**
	 * The type of series.
	 *
	 * @property type
	 * @type String
	 */
	type: null,
	
	/**
	 * The human-readable name of the series.
	 *
	 * @property displayName
	 * @type String
	 */
	displayName: null
};

/**
 * CartesianSeries class for the YUI Charts widget.
 *
 * @namespace YAHOO.widget
 * @class CartesianSeries
 * @constructor
 */
YAHOO.widget.CartesianSeries = function() 
{
	YAHOO.widget.CartesianSeries.superclass.constructor.call(this);
};

YAHOO.lang.extend(YAHOO.widget.CartesianSeries, YAHOO.widget.Series,
{
	/**
	 * The field used to access the x-axis value from the items from the data source.
	 *
	 * @property xField
	 * @type String
	 */
	xField: null,
	
	/**
	 * The field used to access the y-axis value from the items from the data source.
	 *
	 * @property yField
	 * @type String
	 */
	yField: null
});

/**
 * ColumnSeries class for the YUI Charts widget.
 *
 * @namespace YAHOO.widget
 * @class ColumnSeries
 * @constructor
 */
YAHOO.widget.ColumnSeries = function() 
{
	YAHOO.widget.ColumnSeries.superclass.constructor.call(this);
};

YAHOO.lang.extend(YAHOO.widget.ColumnSeries, YAHOO.widget.CartesianSeries,
{
	type: "column"
});

/**
 * LineSeries class for the YUI Charts widget.
 *
 * @namespace YAHOO.widget
 * @class LineSeries
 * @constructor
 */
YAHOO.widget.LineSeries = function() 
{
	YAHOO.widget.LineSeries.superclass.constructor.call(this);
};

YAHOO.lang.extend(YAHOO.widget.LineSeries, YAHOO.widget.CartesianSeries,
{
	type: "line"
});


/**
 * BarSeries class for the YUI Charts widget.
 *
 * @namespace YAHOO.widget
 * @class BarSeries
 * @constructor
 */
YAHOO.widget.BarSeries = function() 
{
	YAHOO.widget.BarSeries.superclass.constructor.call(this);
};

YAHOO.lang.extend(YAHOO.widget.BarSeries, YAHOO.widget.CartesianSeries,
{
	type: "bar"
});


/**
 * PieSeries class for the YUI Charts widget.
 *
 * @namespace YAHOO.widget
 * @class PieSeries
 * @constructor
 */
YAHOO.widget.PieSeries = function() 
{
	YAHOO.widget.PieSeries.superclass.constructor.call(this);
};

YAHOO.lang.extend(YAHOO.widget.PieSeries, YAHOO.widget.Series,
{
	type: "pie",
	dataField: null,
	categoryField: null
});