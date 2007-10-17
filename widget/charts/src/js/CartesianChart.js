YAHOO.widget.CartesianChart = function(type, containerId, dataSource, attributes)
{
	YAHOO.widget.CartesianChart.superclass.constructor.call(this, type, containerId, dataSource, attributes);
};

YAHOO.lang.extend(YAHOO.widget.CartesianChart, YAHOO.widget.Chart,
{

	_initAttributes: function(attributes)
	{	
		YAHOO.widget.CartesianChart.superclass._initAttributes.call(this, attributes);

		this.getAttributeConfig("xField",
		{
			method: this._getXField
		});

		this.setAttributeConfig("xField",
		{
			validator: YAHOO.lang.isString,
			method: this._setXField
		});

		this.getAttributeConfig("yField",
		{
			method: this._getYField
		});

		this.setAttributeConfig("yField",
		{
			validator: YAHOO.lang.isString,
			method: this._setYField
		});

		this.setAttributeConfig("xAxis",
		{
			method: this._setXAxis
		});

		this.setAttributeConfig("yAxis",
		{
			method: this._setYAxis
		});
	},

	_getXField: function()
	{
		return this._swf.getHorizontalField();
	},

	_setXField: function(value)
	{
		this._swf.setHorizontalField(value);
	},

	_getYField: function()
	{
		return this._swf.getVerticalField();
	},

	_setYField: function(value)
	{
		this._swf.setVerticalField(value);
	},
	
	_setXAxis: function(value)
	{
		this._swf.setHorizontalAxis(value);
	},

	_setYAxis: function(value)
	{
		this._swf.setVerticalAxis(value);
	}
});