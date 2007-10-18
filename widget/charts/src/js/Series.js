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
	type: null,
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
	xField: null,
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