(function() {

    /**
     * The ProfilerViewer module provides a graphical display for viewing
	 * the output of the YUI Profiler.
     * @module profilerviewer
     * @requires yahoo, dom, event, element, profiler, yuiloader
     *
     */
    /**
     * A widget to view YUI Profiler Output.
     * @namespace YAHOO.widget
     * @class ProfilerViewer
     * @extends YAHOO.util.Element
     * @constructor
     * @param {HTMLElement | String | Object} el(optional) The html 
     * element into which the ProfileViewer should be rendered. 
     * An element will be created if none provided.
     * @param {Object} attr (optional) A key map of the ProfilerViewer's 
     * initial attributes.  Ignored if first arg is attributes object.
     */
    YAHOO.widget.ProfilerViewer = function(el, attr) {
        attr = attr || {};
        if (arguments.length == 1 && !YAHOO.lang.isString(el) && !el.nodeName) {
            attr = el;
            el = attr.element || null;
        }
        if (!el && !attr.element) {
            el = this._createProfilerViewerElement();
        }

    	YAHOO.widget.ProfilerViewer.superclass.constructor.call(this, el, attr); 
		
		this._init();
		
		YAHOO.log("ProfilerViewer instantiated.", "info", "ProfilerViewer");
    };

    YAHOO.extend(YAHOO.widget.ProfilerViewer, YAHOO.util.Element);
	
	// Static members of YAHOO.widget.ProfilerViewer:
	YAHOO.lang.augmentObject(YAHOO.widget.ProfilerViewer, {
		/**
		 * Classname for ProfilerViewer containing element.
		 * @static
		 * @property CLASS
		 * @type string
		 * @public
		 * @default "yui-pv"
		 */
		CLASS: 'yui-pv',
	
		/**
		 * Classname for ProfilerViewer button menu. 
		 * @static
		 * @property CLASS_DASHBOARD
		 * @type string
		 * @public
		 * @default "yui-pv-dashboard"
		 */
		CLASS_DASHBOARD: 'yui-pv-dashboard',
	
		/**
		 * Classname for element containing the chart and chart
		 * legend elements.
		 * @static
		 * @property CLASS_CHART_CONTAINER
		 * @type string
		 * @public
		 * @default "yui-pv-chartcontainer"
		 */
		CLASS_CHART_CONTAINER: 'yui-pv-chartcontainer',
	
		/**
		 * Classname for element containing the chart.
		 * @static
		 * @property CLASS_CHART
		 * @type string
		 * @public
		 * @default "yui-pv-chart"
		 */
		CLASS_CHART: 'yui-pv-chart',
		
		/**
		 * Classname for element containing the chart's legend. 
		 * @static
		 * @property CLASS_CHART_LEGEND
		 * @type string
		 * @public
		 * @default "yui-pv-chartlegend"
		 */
		CLASS_CHART_LEGEND: 'yui-pv-chartlegend',
		
		/**
		 * Classname for element containing the datatable. 
		 * @static
		 * @property CLASS_TABLE
		 * @type string
		 * @public
		 * @default "yui-pv-table"
		 */
		CLASS_TABLE: 'yui-pv-table',
		
		/**
		 * Strings used in the UI.
		 * @static
		 * @property STRINGS
		 * @object
		 * @public
		 * @default "English language strings for UI."
		 */
		STRINGS: {
			title: "YUI Profiler (beta)",
			buttons: {
				viewprofiler: "View Profiler Data",
				hideprofiler: "Hide Profiler Report",
				showchart: "Show Chart",
				hidechart: "Hide Chart",
				refreshdata: "Refresh Data"
			},
			colHeads: {
				fn: "Function/Method",
				calls: "Calls",
				avg: "Average",
				min: "Shortest",
				max: "Longest",
				total: "Total Time",
				pct: "Percent"
			},
			millisecondsAbbrev: "ms",
			initMessage: "initialiazing chart...",
			installFlashMessage: "Unable to load Flash content. The YUI Charts Control requires Flash Player 9.0.45 or higher. You can download the latest version of Flash Player from the <a href='http://www.adobe.com/go/getflashplayer'>Adobe Flash Player Download Center</a>."
		},

		/**
		 * Function used to format numbers in milliseconds
		 * for chart; must be publicly accessible, per Charts spec.
		 * @static
		 * @property timeAxisLabelFunction
		 * @type function
		 * @private
		 */
		timeAxisLabelFunction: function(n) {
			var a = (n === Math.floor(n)) ? n : (Math.round(n*1000))/1000;
			return (a + " " + YAHOO.widget.ProfilerViewer.STRINGS.millisecondsAbbrev);
		},

		/**
		 * Function used to format percent numbers for chart; must
		 * be publicly accessible, per Charts spec.
		 * @static
		 * @property percentAxisLabelFunction
		 * @type function
		 * @private
		 */
		percentAxisLabelFunction: function(n) {
			var a = (n === Math.floor(n)) ? n : (Math.round(n*100))/100;
			return (a + "%");
		}
		
	
	},true);
	

	/**
	 * STANDARD SHORTCUTS
	 */
    var Dom = YAHOO.util.Dom;
    var Event = YAHOO.util.Event;
	var Profiler = YAHOO.tool.Profiler;
	var PV = YAHOO.widget.ProfilerViewer;
	var proto = PV.prototype;


	/**
	 * PUBLIC METHODS
	 **/
	
	 /**
     * Refreshes the data displayed in the ProfilerViewer. When called,
	 * this will invoke a refresh of the DataTable and (if displayed)
	 * the Chart.
     * @method refreshData
     * @return void
	 * @public
     */	
	proto.refreshData = function() {
		YAHOO.log("Data refresh requested via refreshData method.", "info", "ProfilerViewer");
		this.fireEvent("dataRefreshEvent");
	};
	

    /**
     * PRIVATE PROPERTIES
     */
    proto._rendered = false;
	proto._headEl = null;
	proto._bodyEl = null;
	proto._refreshEl = null;
	proto._toggleVisibleEl = null;
	
	proto._tableEl = null;
	proto._dataTable = null;

	proto._chartEl = null;
	proto._chartLegendEl = null;
	proto._chartElHeight = 250;
	proto._chart = null;
	proto._chartInitialized = false;

    /**
     * PRIVATE METHODS
     **/

	proto._init = function() {
		/**
		 * CUSTOM EVENTS
		 **/
		
		/**
		 * Fired when a data refresh is requested. No arguments are passed
		 * with this event.
		 *
		 * @event refreshDataEvent
		 */
		this.createEvent("dataRefreshEvent");
		
		/**
		 * Fired when the viewer canvas first renders. No arguments are passed
		 * with this event.
		 *
		 * @event refreshDataEvent
		 */
		this.createEvent("renderEvent");

		
		this.on("dataRefreshEvent", this._refreshDataTable, this, true);
		
		this._initLauncherDOM();
		
		if(this.get("showChart")) {
			this.on("sortedByChange", this._refreshChart);
		}

		YAHOO.log("ProfilerViewer instance initialization complete.", "info", "ProfilerViewer");
	};

	/**
	 * If no element is passed in, create it as the first element
	 * in the document.
	 */
	proto._createProfilerViewerElement = function() {
		YAHOO.log("Creating root element...", "info", "ProfilerViewer");

		var el = document.createElement("div");
		document.body.insertBefore(el, document.body.firstChild);
		Dom.addClass(el, this.SKIN_CLASS);
		Dom.addClass(el, PV.CLASS);
		YAHOO.log(el);
		return el;
	};
			
    /**
     * Provides a readable name for the ProfilerViewer instance.
     * @method toString
     * @return String
	 * @private
	 */
    proto.toString = function() {
        return "ProfilerViewer " + (this.get('id') || this.get('tagName'));
    };

    /**
     * Toggles visibility of the viewer canvas.
     * @method _toggleVisible
     * @return void
	 * @private
     */	
	proto._toggleVisible = function() {
		YAHOO.log("Toggling visibility to " + !this.get("visible") + ".", "info", "ProfilerViewer");
		
		var newVis = (this.get("visible")) ? false : true;
		this.set("visible", newVis);
    };

    /**
     * Shows the viewer canvas.
     * @method show
     * @return void
	 * @private
     */	
	 proto._show = function() {
		if(!this._rendered) {
			var loader = new YAHOO.util.YUILoader();
			if (this.get("base")) {
				loader.base = this.get("base");
			}
			
			var modules = ["datatable"];
			if(this.get("showChart")) {
				modules.push("charts");
			}
			
			loader.insert({ require: modules,
							onSuccess: function() {
								this._render();
							},
							scope: this});
		} else {
			Dom.setStyle(this._bodyEl, "top", "");
			Dom.setStyle(this.get("element"), "height", "");
			Dom.setStyle(this._refreshEl, "display", "");
			this._toggleVisibleEl.innerHTML = PV.STRINGS.buttons.hideprofiler;
			this.refreshData();
		}
    };

    /**
     * Hides the viewer canvas.
     * @method hide
     * @return void
	 * @private
     */	
	proto._hide = function() {
		Dom.setStyle(this._bodyEl, "top", "-3000px");
		Dom.setStyle(this.get("element"), "height", (this._headEl.offsetHeight + "px"));
		Dom.setStyle(this._refreshEl, "display", "none");
		this._toggleVisibleEl.innerHTML = PV.STRINGS.buttons.viewprofiler;
    };
	
	/**
	 * Render the viewer canvas
	 */
	proto._render = function() {
		YAHOO.log("Beginning to render ProfilerViewer canvas...", "info", "ProfilerViewer");
		
		this._initViewerDOM();
		this._initDataTable();
		if(this.get("showChart")) {
			this._initChartDOM();
			this._initChart();
		}
		this._initDashboardDOM();
		this._rendered = true;
		this._toggleVisibleEl.innerHTML = PV.STRINGS.buttons.hideprofiler;
		
		this.fireEvent("renderEvent");

		YAHOO.log("ProfilerViewer rendering complete...", "info", "ProfilerViewer");
	};
	
	/**
	 * Set up the DOM structure for the ProfilerViewer launcher.
	 */
	proto._initLauncherDOM = function() {
		YAHOO.log("Creating the launcher...", "info", "ProfilerViewer");
		
		var el = this.get("element");
		Dom.addClass(el, PV.CLASS);
		this._headEl = document.createElement("div");
		this._dashboardEl = document.createElement("div");
		Dom.addClass(this._headEl, "hd");
		Dom.addClass(this._dashboardEl, PV.CLASS_DASHBOARD);
		var title = document.createElement("h4");
		title.innerHTML = PV.STRINGS.title;
		this._headEl.appendChild(this._dashboardEl);
		this._headEl.appendChild(title);
		el.appendChild(this._headEl);
		
		var s = PV.STRINGS.buttons;
		var b = (this.get("visible")) ? s.hideprofiler : s.viewprofiler;
		this._toggleVisibleEl = this._createButton(b, this._dashboardEl);
		Event.on(this._toggleVisibleEl, "click", this._toggleVisible, this, true);
	};

	/**
	 * Set up the DOM structure for the ProfilerViewer canvas,
	 * including the holder for the DataTable.
	 */
	proto._initViewerDOM = function() {
		YAHOO.log("Creating DOM structure for viewer...", "info", "ProfilerViewer");
		
		var el = this.get("element");
		this._bodyEl = document.createElement("div");
		Dom.addClass(this._bodyEl, "bd");
	 	this._tableEl = document.createElement("div");
		Dom.addClass(this._tableEl, PV.CLASS_TABLE);
		this._bodyEl.appendChild(this._tableEl);
		el.appendChild(this._bodyEl);
	};

	/**
	 * Set up the DOM structure for the ProfilerViewer canvas.
	 */
	proto._initChartDOM = function() {
		YAHOO.log("Adding DOM structure for chart...", "info", "ProfilerViewer");
		
		this._chartContainer = document.createElement("div");
		Dom.addClass(this._chartContainer, PV.CLASS_CHART_CONTAINER);
		
		var chl = document.createElement("div");
		Dom.addClass(chl, PV.CLASS_CHART_LEGEND);
		
		var chw = document.createElement("div");

		this._chartLegendEl = document.createElement("dl");
		this._chartLegendEl.innerHTML = "<dd>" + PV.STRINGS.initMessage + "</dd>";
		
		this._chartEl = document.createElement("div");
		Dom.addClass(this._chartEl, PV.CLASS_CHART);
		
		var msg = document.createElement("p");
		msg.innerHTML = PV.STRINGS.installFlashMessage;
		this._chartEl.appendChild(msg);
		
		this._chartContainer.appendChild(chl);
		chl.appendChild(chw);
		chw.appendChild(this._chartLegendEl);
		this._chartContainer.appendChild(this._chartEl);
		this._bodyEl.insertBefore(this._chartContainer,this._tableEl);
		
	};
	
	/**
	 * Set up the DOM structure for the ProfilerViewer dashboard.
	 */
	proto._initDashboardDOM = function() {
		YAHOO.log("Adding DOM structure for dashboard controls...", "info", "ProfilerViewer");
		
		var db = this._dashboardEl;
		this._refreshEl = this._createButton(PV.STRINGS.buttons.refreshdata, db, true);
		Event.on(this._refreshEl, "click", function() {this.fireEvent("dataRefreshEvent");}, this, true);
	};
	
	/**
	 * Create anchor elements for use as buttons. Args: label
	 * is text to appear on the face of the button, parentEl
	 * is the el to which the anchor will be attached, position
	 * is true for inserting as the first node and false for
	 * inserting as the last node of the parentEl.
	 */	
	proto._createButton = function(label, parentEl, position) {
		var b = document.createElement("a");
		b.innerHTML = b.title = label;
		if(parentEl) {
			if(!position) {
				parentEl.appendChild(b);
			} else {
				parentEl.insertBefore(b, parentEl.firstChild);	
			}
		}
		return b;
	};
	
	proto._genSortFunction = function(key, dir) {
		var by = key;
		var direction = dir;
		return function(a, b) {
			if (direction == YAHOO.widget.DataTable.CLASS_ASC) {
				return a[by] - b[by];	
			} else {
				return ((a[by] - b[by]) * -1);
			}
		};
	};

	var _arraySum = function(arr){
		var ct = 0;
		for(var i = 0; i < arr.length; ct+=arr[i++]){}
		return ct;
	};
	
	proto._getProfilerData = function() {
		YAHOO.log("Profiler data requested from function DataSource.", "info", "ProfilerViewer");
		
		var obj = Profiler.getFullReport();
		var arr = [];
		var totalTime = 0;
		for (name in obj) {
    		if (YAHOO.lang.hasOwnProperty(obj, name)) {
				var r = obj[name];
				var o = {};
				o.fn = name; //add function name to record
				o.points = r.points.slice(); //copy live array
				o.calls = r.calls;
				o.min = r.min;
				o.max = r.max;
				o.avg = r.avg;
				o.total = _arraySum(o.points);
				o.points = r.points;
				var f = this.get("filter");
				if((!f) || (f(o))) {
					arr.push(o);
					totalTime += o.total;
				}
			}
		}
		
		/*add calculated percentage column*/
		for (var i = 0, j = arr.length; i < j; i++) {
			arr[i].pct = (arr[i].total * 100) / totalTime;	
		}

		var sortedBy = this.get("sortedBy");
		var key = sortedBy.key;
		var dir = sortedBy.dir;		

		arr.sort(this._genSortFunction(key, dir));
		
		YAHOO.log("Returning data from DataSource: " + YAHOO.lang.dump(arr), "info", "ProfilerViewer");
		
		return arr;
	};
	
	/**
	 * Set up the DataTable.
	 */
	proto._initDataTable = function() {
		YAHOO.log("Creating DataTable instance...", "info", "ProfilerViewer");
		
		var self = this;
		
		/**
		 * Set up the JS Function DataSource, pulling data from
		 * the Profiler.
		 */
		this._dataSource = new YAHOO.util.DataSource(
			function() {
				return self._getProfilerData.call(self);	
			},
			{
				responseType: YAHOO.util.DataSource.TYPE_JSARRAY,
				maxCacheEntries: 0
			}
		);
		var ds = this._dataSource;

		ds.responseSchema =
		{
			fields: [ "fn", "avg", "calls", "max", "min", "total", "pct", "points"]
		};
		
		/**
		 * Set up the DataTable.
		 */
		var formatTimeValue = function(elCell, oRecord, oColumn, oData) {
			var a = (oData === Math.floor(oData)) ? oData : (Math.round(oData*1000))/1000;
			elCell.innerHTML = a + " " + PV.STRINGS.millisecondsAbbrev;
		};

		var formatPercent = function(elCell, oRecord, oColumn, oData) {
			var a = (oData === Math.floor(oData)) ? oData : (Math.round(oData*100))/100;
			elCell.innerHTML = a + "%";
		};
		
		var a = YAHOO.widget.DataTable.CLASS_ASC;
		var d = YAHOO.widget.DataTable.CLASS_DESC;
		var c = PV.STRINGS.colHeads;
		var f = formatTimeValue;
		
		var cols = [
			{key:"fn", sortable:true, label: c.fn,
				sortOptions: {defaultDir:a}, 
				resizeable: (YAHOO.util.DragDrop) ? true : false,
				minWidth:180},
			{key:"calls", sortable:true, label: c.calls,
				sortOptions: {defaultDir:d}},
			{key:"avg", sortable:true, label: c.avg,
				sortOptions: {defaultDir:d},
				formatter:f},
			{key:"min", sortable:true, label: c.min,
				sortOptions: {defaultDir:a},
				formatter:f}, 
			{key:"max", sortable:true, label: c.max,
				sortOptions: {defaultDir:d},
				formatter:f},
			{key:"total", sortable:true, label: c.total,
				sortOptions: {defaultDir:d},
				formatter:f},
			{key:"pct", sortable:true, label: c.pct,
				sortOptions: {defaultDir:d}, 
				formatter:formatPercent}
		];

		this._dataTable = new YAHOO.widget.DataTable(this._tableEl, cols, ds, {
			scrollable:true,
			height:this.get("tableHeight"),
			initialRequest:null,
			sortedBy: {
				key: "total",
				dir: YAHOO.widget.DataTable.CLASS_DESC
			}
		});
		var dt = this._dataTable;

		/**
		 * Wire up DataTable events to drive the rest of the UI.
		 */
		dt.subscribe("sortedByChange", this._sortedByChange, this, true);		
		YAHOO.log("DataTable initialized.", "info", "ProfilerViewer");
	};
		
	/**
	 * Proxy the sort event in DataTable into the ProfilerViewer
	 * attribute.
	 **/
	proto._sortedByChange = function(o) {
		YAHOO.log("Relaying DataTable sortedBy value change; new key: " + o.newValue.key + "; new direction: " + o.newValue.dir + ".", "info", "ProfilerViewer");
		this.set("sortedBy", {key: o.newValue.key, dir:o.newValue.dir});
	};

	/**
	 * Refresh DataTable, getting new data from Profiler.
	 **/
	proto._refreshDataTable = function(args) {
		YAHOO.log("Beginning to refresh DataTable contents...", "info", "ProfilerViewer");
		var dt = this._dataTable;
		dt.getDataSource().sendRequest("", dt.onDataReturnInitializeTable, dt);
		YAHOO.log("DataTable refresh complete.", "info", "ProfilerViewer");
	};

	/**
	 * Refresh chart, getting new data from table.
	 **/
	proto._refreshChart = function() {
		YAHOO.log("Beginning to refresh Chart contents...", "info", "ProfilerViewer");
		
		switch (this.get("sortedBy").key) {
			case "fn":
				/*Keep the same data on the chart, but force update to 
				  reflect new sort order on function/method name: */
				this._chart.set("dataSource", this._chart.get("dataSource"));
				
				/*no further action necessary; chart redraws*/
				return;
			case "calls":
				/*Null out the xAxis formatting before redrawing chart.*/
				this._chart.set("xAxis", this._chartAxisDefinitionPlain);
				break;
			case "pct":
				this._chart.set("xAxis", this._chartAxisDefinitionPercent);
				break;
			default:
				/*Set the default xAxis; redraw legend; set the new series definition.*/
				this._chart.set("xAxis", this._chartAxisDefinitionTime);
				break;
		}
		
		this._drawChartLegend();
		this._chart.set("series", this._getSeriesDef(this.get("sortedBy").key));

		YAHOO.log("Chart refresh complete.", "info", "ProfilerViewer");
	};
	
	/**
	 * Get data for the Chart from DataTable recordset
	 */
	proto._getChartData = function() {
		YAHOO.log("Getting data for chart from function DataSource.", "info", "ProfilerViewer");
		var records = this._dataTable.getRecordSet().getRecords(0, this.get("maxChartFunctions"));
		var arr = [];
		for (var i = records.length - 1; i>-1; i--) {
			arr.push(records[i].getData());	
		}
		YAHOO.log("Returning data to Chart: " + YAHOO.lang.dump(arr), "info", "ProfilerViewer");
		return arr;
	};
	
	/**
	 * Build series definition based on current configuration attributes.
	 */
	proto._getSeriesDef = function(field) {
		var sd = this.get("chartSeriesDefinitions")[field];
		var arr = [];
		for(var i = 0, j = sd.group.length; i<j; i++) {
			var c = this.get("chartSeriesDefinitions")[sd.group[i]];
			arr.push(
				{displayName:c.displayName,
				 xField:c.xField,
				 style: {color:c.style.color, size:c.style.size}
				}
			);
		}
		
		YAHOO.log("Returning new series definition to chart: " + YAHOO.lang.dump(arr), "info", "ProfilerViewer");
		return arr;
	};
	
	/**
	 * Set up the Chart.
	 */
	proto._initChart = function() {
		YAHOO.log("Initializing chart...", "info", "ProfilerViewer");
		
		YAHOO.widget.Chart.SWFURL = this.get("swfUrl");

		var self = this;
		
		/**
		 * Create DataSource based on records currently displayed
		 * at the top of the sort list in the DataTable.
		 */
		var ds = new YAHOO.util.DataSource(
			//force the jsfunction DataSource to run in the scope of
			//the ProfilerViewer, not in the YAHOO.util.DataSource scope:
			function() {
				return self._getChartData.call(self);
			}, 
			{
				responseType: YAHOO.util.DataSource.TYPE_JSARRAY,
				maxCacheEntries: 0
			}
		);

		ds.responseSchema =
		{
			fields: [ "fn", "avg", "calls", "max", "min", "total", "pct" ]
		};
		
		ds.subscribe('responseEvent', this._sizeChartCanvas, this, true);
		
		/**
		 * Set up the chart itself.
		 */
		this._chartAxisDefinitionTime = new YAHOO.widget.NumericAxis();
		this._chartAxisDefinitionTime.labelFunction = "YAHOO.widget.ProfilerViewer.timeAxisLabelFunction";
		
		this._chartAxisDefinitionPercent = new YAHOO.widget.NumericAxis();
		this._chartAxisDefinitionPercent.labelFunction = "YAHOO.widget.ProfilerViewer.percentAxisLabelFunction";

		this._chartAxisDefinitionPlain = new YAHOO.widget.NumericAxis();
		
		this._chart = new YAHOO.widget.BarChart( this._chartEl, ds,
		{
			yField: "fn",
			series: this._getSeriesDef(this.get("sortedBy").key),
			style: this.get("chartStyle"),
			xAxis: this._chartAxisDefinitionTime
		} );
		
		this._drawChartLegend();
		this._chartInitialized = true;
		this._dataTable.unsubscribe("initEvent", this._initChart, this);
		this._dataTable.subscribe("initEvent", this._refreshChart, this, true);
		
		YAHOO.log("Chart initialization complete.", "info", "ProfilerViewer");
	};
	
	/**
	 * Set up the Chart's legend
	 **/
	proto._drawChartLegend = function() {
		YAHOO.log("Drawing chart legend...", "info", "ProfilerViewer");
		var seriesDefs = this.get("chartSeriesDefinitions");
		var currentDef = seriesDefs[this.get("sortedBy").key];
		var l = this._chartLegendEl;
		l.innerHTML = "";
		for(var i = 0, j = currentDef.group.length; i<j; i++) {
			var c = seriesDefs[currentDef.group[i]];
			var dt = document.createElement("dt");
			Dom.setStyle(dt, "backgroundColor", "#" + c.style.color);
			var dd = document.createElement("dd");
			dd.innerHTML = c.displayName;
			l.appendChild(dt);
			l.appendChild(dd);
		}
	};
	
	/**
	 * Resize the chart's canvas if based on number of records
	 * returned from the chart's datasource.
	 **/
	proto._sizeChartCanvas = function(o) {
		YAHOO.log("Resizing chart canvas...", "info", "ProfilerViewer");
		var s = (o.response.length * 36) + 34;
		if (s != this._chartElHeight) {
			this._chartElHeight = s;
			Dom.setStyle(this._chartEl, "height", s + "px");
		}
	};

    /**
     * setAttributeConfigs TabView specific properties.
     * @method initAttributes
     * @param {Object} attr Hash of initial attributes
     */
    proto.initAttributes = function(attr) {
		YAHOO.log("Initializing attributes...", "info", "ProfilerViewer");
        YAHOO.widget.ProfilerViewer.superclass.initAttributes.call(this, attr);
        /**
         * The YUI Loader base path from which to pull YUI files needed
		 * in the rendering of the ProfilerViewer canvas.  Passed directly
		 * to YUI Loader.  Leave blank to draw files from
		 * yui.yahooapis.com.
         * @attribute base
         * @type string
		 * @default ""
         */
        this.setAttributeConfig('base', {
            value: attr.base
        });

        /**
         * The height of the DataTable.  The table will scroll
		 * vertically if the content overflows the specified
		 * height.
         * @attribute tableHeight
         * @type string
		 * @default "15em"
         */
        this.setAttributeConfig('tableHeight', {
            value: attr.tableHeight || "15em",
			method: function(s) {
				if(this._dataTable) {
					this._dataTable.set("height", s);
				}
			}
        });
		
        /**
         * The default column key to sort by.  Valid keys are: fn, calls,
		 * avg, min, max, total.  Valid dir values are: 
		 * YAHOO.widget.DataTable.CLASS_ASC AND
		 * YAHOO.widget.DataTable.CLASS_DESC.
         * @attribute sortedBy
         * @type obj
		 * @default {key:"total", dir:"yui-dt-desc"}
         */
        this.setAttributeConfig('sortedBy', {
            value: attr.sortedBy || {key:"total", dir:"yui-dt-desc"}
        });

        /**
         * A filter function to use in selecting functions that will
		 * appear in the ProfilerViewer report.  The function is passed
		 * a function report object and should return a boolean indicating
		 * whether that function should be included in the ProfilerViewer
		 * display.  The argument is structured as follows:
		 *
		 * {
		 *	 	fn: <str function name>,
		 *		calls : <n number of calls>,
		 *		avg : <n average call duration>,
		 *		max: <n duration of longest call>,
		 *		min: <n duration of shortest call>,
		 *		total: <n total time of all calls>
		 *		points : <array time in ms of each call>
		 *	}
		 *
		 * For example, you would use the follwing filter function to 
		 * return only functions that have been called at least once:
		 * 
		 * 	function(o) {
		 *		return (o.calls > 0);
		 *	}
		 *
         * @attribute filter
         * @type function
		 * @default null
         */
        this.setAttributeConfig('filter', {
            value: attr.filter || null,
			validator: YAHOO.lang.isFunction
        });

		/**
		 * The path to the YUI Charts swf file; must be a full URI
		 * or a path relative to the page being profiled. Changes at runtime
		 * not supported; pass this value in at instantiation.
		 * @attribute sfwUrl
		 * @default "http://yui.yahooapis.com/2.5.0/build/charts/assets/charts.swf"
		 */
		this.setAttributeConfig('swfUrl', {
			value: attr.swfUrl || "http://yui.yahooapis.com/2.5.0/build/charts/assets/charts.swf"
		});

        /**
         * The maximum number of functions to profile in the chart. The
		 * greater the number of functions, the greater the height of the
		 * chart canvas.
		 * height.
         * @attribute maxChartFunctions
         * @type int
		 * @default 6
         */
        this.setAttributeConfig('maxChartFunctions', {
            value: attr.maxChartFunctions || 6,
			method: function(s) {
				if(this._rendered) {
					this._sizeChartCanvas();
				}
			},
			validator: YAHOO.lang.isNumber
        });
		
        /**
         * The style object that defines the chart's visual presentation.
		 * Conforms to the style attribute passed to the Charts Control
		 * constructor.  See Charts Control User's Guide for more information
		 * on how to format this object.
         * @attribute chartStyle
         * @type obj
		 * @default 
		 * {
		 *		font:
		 *			{
		 *				name: "Arial",
		 *				color: 0xeeee5c,
		 *				size: 12
		 *			},
		 *		background:
		 *			{
		 *				color: "6e6e63"
		 *			}
		 *		}
         */
        this.setAttributeConfig('chartStyle', {
            value: 	attr.chartStyle || {
				font:
					{
						name: "Arial",
						color: 0xeeee5c,
						size: 12
					},
					background:
					{
						color: "6e6e63"
					}
				},
			method: function() {
					if(this._rendered && this.get("showChart")) {
						this._refreshChart();
					}
				}
        });
		
        /**
         * The series definition information to use when charting
		 * specific fields on the chart.  displayName, xField,
		 * and style members are used to construct the series
		 * definition; the "group" member is the array of fields
		 * that should be charted when the table is sorted by a
		 * given field.
         * @attribute chartSeriesDefinitions
         * @type obj
		 * @default 
		 * 		{
		 *				displayName: "Total",
		 *				xField: "total",
		 *				style: {color:"#ff0000", size:23},
		 *				group: ["total"]
		 *		}...
         */
        this.setAttributeConfig('chartSeriesDefinitions', {
            value: 	attr.chartSeriesDefinitions ||  {
						total: {
							displayName: PV.STRINGS.colHeads.total,
							xField: "total",
							style: {color:"CC3333", size:21},
							group: ["total"]
						},
						calls: {		
							displayName: PV.STRINGS.colHeads.calls,
							xField: "calls",
							style: {color:"A658BD", size:21},
							group: ["calls"]
						},
						avg: {
							displayName: PV.STRINGS.colHeads.avg,
							xField: "avg",
							style: {color:"209daf", size:9},
							group: ["avg", "min", "max"]
						},
						min: {
							displayName: PV.STRINGS.colHeads.min,
							xField: "min",
							style: {color:"b6ecf4", size:9},
							group: ["avg", "min", "max"]
						},
						max: {
							displayName: PV.STRINGS.colHeads.max,
							xField: "max",
							style: {color:"29c7de", size:9},
							group: ["avg", "min", "max"]
						},
						pct: {
							displayName: PV.STRINGS.colHeads.pct,
							xField: "pct",
							style: {color:"bdb327", size:21},
							group: ["pct"]
						}
				},
			method: function() {
					if(this._rendered && this.get("showChart")) {
						this._refreshChart();
					}
				}
        });
		
        /**
         * The default visibility setting for the viewer canvas. If true,
		 * the viewer will load all necessary files and render itself
		 * immediately upon instantiation; otherwise, the viewer will
		 * load only minimal resources until the user toggles visibility
		 * via the UI.
         * @attribute visible
         * @type boolean
		 * @default false
         */
        this.setAttributeConfig('visible', {
            value: attr.visible || false,
			validator: YAHOO.lang.isBoolean,
			method: function(b) {
				YAHOO.log("visible setting changing to " + b);
				if(b) {
					this._show();
				} else {
					if (this._rendered) {
						this._hide();
					}
				}
			}
        });

        /**
         * The default visibility setting for the chart.
         * @attribute showChart
         * @type boolean
		 * @default true
         */
        this.setAttributeConfig('showChart', {
            value: attr.showChart || true,
			validator: YAHOO.lang.isBoolean,
			writeOnce: true
			
        });
		
		YAHOO.widget.ProfilerViewer.superclass.initAttributes.call(this, attr);
		
		YAHOO.log("Attributes initialized.", "info", "ProfilerViewer");
    };
	
})();
YAHOO.register("profilerviewer", YAHOO.widget.ProfilerViewer, {version: "@VERSION@", build: "@BUILD@"});
