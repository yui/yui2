YAHOO.widget.Chart = function(type, containerId, dataSource, attributes)
{
	YAHOO.widget.Chart.superclass.constructor.call(this, YAHOO.widget.Chart.SWFURL, containerId, attributes);
	
	this._type = type;
	this._dataSource = dataSource;
	
	this.createEvent("itemRollOver");
	this.createEvent("itemRollOut");
	this.createEvent("itemClick");
	this.createEvent("itemDoubleClick");
};

YAHOO.extend(YAHOO.widget.Chart, YAHOO.widget.FlashAdapter,
{
	_type: null,

	toString: function()
	{
		return "Chart " + this._id;
	},
	
	_initAttributes: function(attributes)
	{
		YAHOO.widget.Chart.superclass._initAttributes.call(this, attributes);

		this.getAttributeConfig("request",
		{
			method: this._getRequest
		});
		
		this.setAttributeConfig("request",
		{
			method: this._setRequest
		});
		
		this.getAttributeConfig("dataSource",
		{
			method: this._getDataSource
		});
		
		this.setAttributeConfig("dataSource",
		{
			method: this._setDataSource
		});
		
		this.getAttributeConfig("series",
		{
			method: this._getSeriesDefs
		});
		
		this.setAttributeConfig("series",
		{
			method: this._setSeriesDefs
		});
		
		this.getAttributeConfig("categoryNames",
		{
			method: this._getCategoryNames
		});
		
		this.setAttributeConfig("categoryNames",
		{
			validator: YAHOO.lang.isArray,
			method: this._setCategoryNames
		});
		
		this.getAttributeConfig("dataTipFunction",
		{
			method: this._getDataTipFunction
		});
		
		this.setAttributeConfig("dataTipFunction",
		{
			method: this._setDataTipFunction
		});
	},
	
	_loadHandler: function()
	{
		this._swf.setType(this._type);
		
		//set initial styles
		if(this._attributes.style)
		{
			this._swf.setStyles(this._attributes.style);		
		}
		
		YAHOO.widget.Chart.superclass._loadHandler.call(this);
		
		if(this._dataSource)
		{
			this.set("dataSource", this._dataSource);
		}
	},

	_refreshData: function()
	{
		if(this._dataSource != null)
		{
			this._dataSource.sendRequest(this._request, this._loadDataHandler, this);
		}
	},

	_loadDataHandler: function(request, response, error)
	{
		if(error)
		{
			YAHOO.log("Unable to load data.", "error");
		}
		else
		{
			//make a copy of the series definitions so that we aren't
			//editing them directly.
			var dataProvider = [];	
			var seriesCount = 0;
			if(this._seriesDefs)
			{
				seriesCount = this._seriesDefs.length;
				for(var i = 0; i < seriesCount; i++)
				{
					var currentSeries = this._seriesDefs[i];
					var clonedSeries = {};
					for(var prop in currentSeries)
					{
						clonedSeries[prop] = currentSeries[prop];
					}
					dataProvider.push(clonedSeries);
				}
			}
			
			if(seriesCount > 0)
			{
				for(i = 0; i < seriesCount; i++)
				{
					currentSeries = dataProvider[i];
					if(!currentSeries.type)
					{
						currentSeries.type = this._type;
					}
					currentSeries.dataProvider = response.results;
				}
			}
			else
			{
				var series = {type: this._type, dataProvider: response.results};
				dataProvider.push(series);
			}
			this._swf.setDataProvider(dataProvider);
		}
	},

	_request: null,
	
	_getRequest: function()
	{
		return this._request;
	},
	
	_setRequest: function(value)
	{
		this._request = value;
		this._refreshData();
	},

	_dataSource: null,
	
	_getDataSource: function()
	{
		return this._dataSource;
	},

	_setDataSource: function(value)
	{	
		this._dataSource = value;
		this._refreshData();
	},
	
	_seriesDefs: null,
	
	_getSeriesDefs: function()
	{
		return this._seriesDefs;
	},
	
	_setSeriesDefs: function(value)
	{
		this._seriesDefs = value;
	},

	_getCategoryNames: function()
	{
		return this._swf.getCategoryNames();
	},

	_setCategoryNames: function(value)
	{
		this._swf.setCategoryNames(value);
	},
	
	_dataTipFunction: null,
	
	_getDataTipFunction: function()
	{
		return this._dataTipFunction;
	},
	
	_setDataTipFunction: function(value)
	{
		this._dataTipFunction = value;
		this._swf.setDataTipFunction(value);
	}
});

YAHOO.widget.Chart.SWFURL = "Charts.swf";