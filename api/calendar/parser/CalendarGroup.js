/*
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
Version 0.12
*/

/**
* YAHOO.widget.CalendarGroup is a special container class for YAHOO.widget.Calendar. This class facilitates
* the ability to have multi-page calendar views that share a single dataset and are
* dependent on each other.
* 
* The calendar group instance will refer to each of its elements using a 0-based index.
* For example, to construct the placeholder for a calendar group widget with id "cal1" and
* containerId of "cal1Container", the markup would be as follows:
*	<xmp>
*		<div id="cal1Container_0"></div>
*		<div id="cal1Container_1"></div>
*	</xmp>
* The tables for the calendars ("cal1_0" and "cal1_1") will be inserted into those containers.
* @namespace YAHOO.widget
* @class CalendarGroup
* @constructor
* @param {String}	id			The id of the table element that will represent the calendar widget
* @param {String}	containerId	The id of the container div element that will wrap the calendar table
* @param {Object}	config		The configuration object containing the Calendar's arguments
*/
YAHOO.widget.CalendarGroup = function(id, containerId, config) {
	if (arguments.length > 0) {
		this.init(id, containerId, config);
	}
};

/**
* Initializes the calendar group. All subclasses must call this method in order for the
* group to be initialized properly.
* @method init
* @param {String}	id			The id of the table element that will represent the calendar widget
* @param {String}	containerId	The id of the container div element that will wrap the calendar table
* @param {Object}	config		The configuration object containing the Calendar's arguments
*/
YAHOO.widget.CalendarGroup.prototype.init = function(id, containerId, config) {
	this.initEvents();
	this.initStyles();

	/**
	* The collection of Calendar pages contained within the CalendarGroup
	* @property pages
	* @type YAHOO.widget.Calendar[]
	*/
	this.pages = [];
	
	/**
	* The unique id associated with the CalendarGroup
	* @property id
	* @type String
	*/
	this.id = id;

	/**
	* The unique id associated with the CalendarGroup container
	* @property containerId
	* @type String
	*/
	this.containerId = containerId;

	/**
	* The outer containing element for the CalendarGroup
	* @property oDomContainer
	* @type HTMLElement
	*/
	this.oDomContainer = document.getElementById(containerId);

	YAHOO.util.Dom.addClass(this.oDomContainer, YAHOO.widget.CalendarGroup.CSS_CONTAINER);
	YAHOO.util.Dom.addClass(this.oDomContainer, YAHOO.widget.CalendarGroup.CSS_MULTI_UP);

	/**
	* The Config object used to hold the configuration variables for the CalendarGroup
	* @property cfg
	* @type YAHOO.util.Config
	*/
	this.cfg = new YAHOO.util.Config(this);

	/**
	* The local object which contains the CalendarGroup's options
	* @property Options
	* @type Object
	*/
	this.Options = {};

	/**
	* The local object which contains the CalendarGroup's locale settings
	* @property Locale
	* @type Object
	*/
	this.Locale = {};

	this.setupConfig();

	if (config) {
		this.cfg.applyConfig(config, true);
	}

	this.cfg.fireQueue();

	// OPERA HACK FOR MISWRAPPED FLOATS
	if (this.browser == "opera"){
		var fixWidth = function() {
			var startW = this.oDomContainer.offsetWidth;
			var w = 0;
			for (var p=0;p<this.pages.length;++p) {
				var cal = this.pages[p];
				w += cal.oDomContainer.offsetWidth;
			}
			if (w > 0) {
				this.oDomContainer.style.width = w + "px";
			}
		};
		this.renderEvent.subscribe(fixWidth,this,true);
	}
};


YAHOO.widget.CalendarGroup.prototype.setupConfig = function() {
	/**
	* The number of pages to include in the CalendarGroup. This value can only be set once, in the CalendarGroup's constructor arguments.
	* @config pages
	* @type Number
	* @default 2
	*/
	this.cfg.addProperty("pages", { value:2, validator:this.cfg.checkNumber, handler:this.configPages } );

	/**
	* The month/year representing the current visible Calendar date (mm/yyyy)
	* @config pagedate
	* @type String
	* @default today's date
	*/
	this.cfg.addProperty("pagedate", { value:new Date(), handler:this.configPageDate } );

	/**
	* The date or range of dates representing the current Calendar selection
	* @config selected
	* @type String
	* @default []
	*/
	this.cfg.addProperty("selected", { value:[], handler:this.delegateConfig } );

	/**
	* The title to display above the CalendarGroup's month header
	* @config title
	* @type String
	* @default ""
	*/
	this.cfg.addProperty("title", { value:"", handler:this.configTitle } );

	/**
	* Whether or not a close button should be displayed for this CalendarGroup
	* @config close
	* @type Boolean
	* @default false
	*/
	this.cfg.addProperty("close", { value:false, handler:this.configClose } );

	/**
	* Whether or not an iframe shim should be placed under the Calendar to prevent select boxes from bleeding through in Internet Explorer 6 and below.
	* @config iframe
	* @type Boolean
	* @default true
	*/
	this.cfg.addProperty("iframe", { value:true, handler:this.delegateConfig, validator:this.cfg.checkBoolean } );

	/**
	* The minimum selectable date in the current Calendar (mm/dd/yyyy)
	* @config mindate
	* @type String
	* @default null
	*/
	this.cfg.addProperty("mindate", { value:null, handler:this.delegateConfig } );

	/**
	* The maximum selectable date in the current Calendar (mm/dd/yyyy)
	* @config maxdate
	* @type String
	* @default null
	*/	
	this.cfg.addProperty("maxdate", { value:null, handler:this.delegateConfig  } );

	// Options properties

	/**
	* True if the Calendar should allow multiple selections. False by default.
	* @config MULTI_SELECT
	* @type Boolean
	* @default false
	*/
	this.cfg.addProperty("MULTI_SELECT",	{ value:false, handler:this.delegateConfig, validator:this.cfg.checkBoolean } );

	/**
	* The weekday the week begins on. Default is 0 (Sunday).
	* @config START_WEEKDAY
	* @type number
	* @default 0
	*/	
	this.cfg.addProperty("START_WEEKDAY",	{ value:0, handler:this.delegateConfig, validator:this.cfg.checkNumber  } );
	
	/**
	* True if the Calendar should show weekday labels. True by default.
	* @config SHOW_WEEKDAYS
	* @type Boolean
	* @default true
	*/	
	this.cfg.addProperty("SHOW_WEEKDAYS",	{ value:true, handler:this.delegateConfig, validator:this.cfg.checkBoolean } );
	
	/**
	* True if the Calendar should show week row headers. False by default.
	* @config SHOW_WEEK_HEADER
	* @type Boolean
	* @default false
	*/	
	this.cfg.addProperty("SHOW_WEEK_HEADER",{ value:false, handler:this.delegateConfig, validator:this.cfg.checkBoolean } );
	
	/**
	* True if the Calendar should show week row footers. False by default.
	* @config SHOW_WEEK_FOOTER
	* @type Boolean
	* @default false
	*/
	this.cfg.addProperty("SHOW_WEEK_FOOTER",{ value:false, handler:this.delegateConfig, validator:this.cfg.checkBoolean } );
	
	/**
	* True if the Calendar should suppress weeks that are not a part of the current month. False by default.
	* @config HIDE_BLANK_WEEKS
	* @type Boolean
	* @default false
	*/		
	this.cfg.addProperty("HIDE_BLANK_WEEKS",{ value:false, handler:this.delegateConfig, validator:this.cfg.checkBoolean } );
	
	/**
	* The image that should be used for the left navigation arrow.
	* @config NAV_ARROW_LEFT
	* @type String
	* @default YAHOO.widget.Calendar.IMG_ROOT + "us/tr/callt.gif"
	*/		
	this.cfg.addProperty("NAV_ARROW_LEFT",	{ value:YAHOO.widget.Calendar.IMG_ROOT + "us/tr/callt.gif", handler:this.delegateConfig } );
	
	/**
	* The image that should be used for the left navigation arrow.
	* @config NAV_ARROW_RIGHT
	* @type String
	* @default YAHOO.widget.Calendar.IMG_ROOT + "us/tr/calrt.gif"
	*/		
	this.cfg.addProperty("NAV_ARROW_RIGHT",	{ value:YAHOO.widget.Calendar.IMG_ROOT + "us/tr/calrt.gif", handler:this.delegateConfig } );

	// Locale properties
	
	/**
	* The short month labels for the current locale.
	* @config MONTHS_SHORT
	* @type String[]
	* @default ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	*/
	this.cfg.addProperty("MONTHS_SHORT",	{ value:["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], handler:this.delegateConfig } );
	
	/**
	* The long month labels for the current locale.
	* @config MONTHS_LONG
	* @type String[]
	* @default ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	*/		
	this.cfg.addProperty("MONTHS_LONG",		{ value:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], handler:this.delegateConfig } );
	
	/**
	* The 1-character weekday labels for the current locale.
	* @config WEEKDAYS_1CHAR
	* @type String[]
	* @default ["S", "M", "T", "W", "T", "F", "S"]
	*/		
	this.cfg.addProperty("WEEKDAYS_1CHAR",	{ value:["S", "M", "T", "W", "T", "F", "S"], handler:this.delegateConfig } );
	
	/**
	* The short weekday labels for the current locale.
	* @config WEEKDAYS_SHORT
	* @type String[]
	* @default ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
	*/		
	this.cfg.addProperty("WEEKDAYS_SHORT",	{ value:["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"], handler:this.delegateConfig } );
	
	/**
	* The medium weekday labels for the current locale.
	* @config WEEKDAYS_MEDIUM
	* @type String[]
	* @default ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
	*/		
	this.cfg.addProperty("WEEKDAYS_MEDIUM",	{ value:["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], handler:this.delegateConfig } );
	
	/**
	* The long weekday labels for the current locale.
	* @config WEEKDAYS_LONG
	* @type String[]
	* @default ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
	*/		
	this.cfg.addProperty("WEEKDAYS_LONG",	{ value:["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], handler:this.delegateConfig } );

	/**
	* The setting that determines which length of month labels should be used. Possible values are "short" and "long".
	* @config LOCALE_MONTHS
	* @type String
	* @default "long"
	*/
	this.cfg.addProperty("LOCALE_MONTHS",	{ value:"long", handler:this.delegateConfig } );

	/**
	* The setting that determines which length of weekday labels should be used. Possible values are "1char", "short", "medium", and "long".
	* @config LOCALE_WEEKDAYS
	* @type String
	* @default "short"
	*/	
	this.cfg.addProperty("LOCALE_WEEKDAYS",	{ value:"short", handler:this.delegateConfig } );

	/**
	* The value used to delimit individual dates in a date string passed to various Calendar functions.
	* @config DATE_DELIMITER
	* @type String
	* @default ","
	*/
	this.cfg.addProperty("DATE_DELIMITER",		{ value:",", handler:this.delegateConfig } );

	/**
	* The value used to delimit date fields in a date string passed to various Calendar functions.
	* @config DATE_FIELD_DELIMITER
	* @type String
	* @default "/"
	*/	
	this.cfg.addProperty("DATE_FIELD_DELIMITER",{ value:"/", handler:this.delegateConfig } );

	/**
	* The value used to delimit date ranges in a date string passed to various Calendar functions.
	* @config DATE_RANGE_DELIMITER
	* @type String
	* @default "-"
	*/
	this.cfg.addProperty("DATE_RANGE_DELIMITER",{ value:"-", handler:this.delegateConfig } );

	/**
	* The position of the month in a month/year date string
	* @config MY_MONTH_POSITION
	* @type Number
	* @default 1
	*/
	this.cfg.addProperty("MY_MONTH_POSITION",	{ value:1, handler:this.delegateConfig, validator:this.cfg.checkNumber } );
	
	/**
	* The position of the year in a month/year date string
	* @config MY_YEAR_POSITION
	* @type Number
	* @default 2
	*/	
	this.cfg.addProperty("MY_YEAR_POSITION",	{ value:2, handler:this.delegateConfig, validator:this.cfg.checkNumber } );
	
	/**
	* The position of the month in a month/day date string
	* @config MD_MONTH_POSITION
	* @type Number
	* @default 1
	*/	
	this.cfg.addProperty("MD_MONTH_POSITION",	{ value:1, handler:this.delegateConfig, validator:this.cfg.checkNumber } );
	
	/**
	* The position of the day in a month/year date string
	* @config MD_DAY_POSITION
	* @type Number
	* @default 2
	*/	
	this.cfg.addProperty("MD_DAY_POSITION",		{ value:2, handler:this.delegateConfig, validator:this.cfg.checkNumber } );
	
	/**
	* The position of the month in a month/day/year date string
	* @config MDY_MONTH_POSITION
	* @type Number
	* @default 1
	*/	
	this.cfg.addProperty("MDY_MONTH_POSITION",	{ value:1, handler:this.delegateConfig, validator:this.cfg.checkNumber } );
	
	/**
	* The position of the day in a month/day/year date string
	* @config MDY_DAY_POSITION
	* @type Number
	* @default 2
	*/	
	this.cfg.addProperty("MDY_DAY_POSITION",	{ value:2, handler:this.delegateConfig, validator:this.cfg.checkNumber } );
	
	/**
	* The position of the year in a month/day/year date string
	* @config MDY_YEAR_POSITION
	* @type Number
	* @default 3
	*/	
	this.cfg.addProperty("MDY_YEAR_POSITION",	{ value:3, handler:this.delegateConfig, validator:this.cfg.checkNumber } );

};

/**
* Initializes CalendarGroup's built-in CustomEvents
* @method initEvents
*/
YAHOO.widget.CalendarGroup.prototype.initEvents = function() {
	var me = this;

	/**
	* Proxy subscriber to subscribe to the CalendarGroup's child Calendars' CustomEvents
	* @method sub
	* @private
	* @param {Function} fn	The function to subscribe to this CustomEvent
	* @param {Object}	obj	The CustomEvent's scope object
	* @param {Boolean}	bOverride	Whether or not to apply scope correction
	*/
	var sub = function(fn, obj, bOverride) {
		for (var p=0;p<me.pages.length;++p) {
			var cal = me.pages[p];
			cal[this.type + "Event"].subscribe(fn, obj, bOverride);
		}
	};

	/**
	* Proxy unsubscriber to unsubscribe from the CalendarGroup's child Calendars' CustomEvents
	* @method unsub
	* @private
	* @param {Function} fn	The function to subscribe to this CustomEvent
	* @param {Object}	obj	The CustomEvent's scope object
	*/
	var unsub = function(fn, obj) {
		for (var p=0;p<me.pages.length;++p) {
			var cal = me.pages[p];
			cal[this.type + "Event"].unsubscribe(fn, obj);
		}
	};

	/**
	* Fired before a selection is made
	* @event beforeSelectEvent
	*/
	this.beforeSelectEvent = new YAHOO.util.CustomEvent("beforeSelect");
	this.beforeSelectEvent.subscribe = sub; this.beforeSelectEvent.unsubscribe = unsub;

	/**
	* Fired when a selection is made
	* @event selectEvent
	* @param {Array}	Array of Date field arrays in the format [YYYY, MM, DD].
	*/
	this.selectEvent = new YAHOO.util.CustomEvent("select"); 
	this.selectEvent.subscribe = sub; this.selectEvent.unsubscribe = unsub;

	/**
	* Fired before a selection is made
	* @event beforeDeselectEvent
	*/
	this.beforeDeselectEvent = new YAHOO.util.CustomEvent("beforeDeselect"); 
	this.beforeDeselectEvent.subscribe = sub; this.beforeDeselectEvent.unsubscribe = unsub;

	/**
	* Fired when a selection is made
	* @event deselectEvent
	* @param {Array}	Array of Date field arrays in the format [YYYY, MM, DD].
	*/
	this.deselectEvent = new YAHOO.util.CustomEvent("deselect"); 
	this.deselectEvent.subscribe = sub; this.deselectEvent.unsubscribe = unsub;
	
	/**
	* Fired when the Calendar page is changed
	* @event changePageEvent
	*/
	this.changePageEvent = new YAHOO.util.CustomEvent("changePage"); 
	this.changePageEvent.subscribe = sub; this.changePageEvent.unsubscribe = unsub;

	/**
	* Fired before the Calendar is rendered
	* @event beforeRenderEvent
	*/
	this.beforeRenderEvent = new YAHOO.util.CustomEvent("beforeRender");
	this.beforeRenderEvent.subscribe = sub; this.beforeRenderEvent.unsubscribe = unsub;

	/**
	* Fired when the Calendar is rendered
	* @event renderEvent
	*/
	this.renderEvent = new YAHOO.util.CustomEvent("render");
	this.renderEvent.subscribe = sub; this.renderEvent.unsubscribe = unsub;

	/**
	* Fired when the Calendar is reset
	* @event resetEvent
	*/
	this.resetEvent = new YAHOO.util.CustomEvent("reset"); 
	this.resetEvent.subscribe = sub; this.resetEvent.unsubscribe = unsub;

	/**
	* Fired when the Calendar is cleared
	* @event clearEvent
	*/
	this.clearEvent = new YAHOO.util.CustomEvent("clear");
	this.clearEvent.subscribe = sub; this.clearEvent.unsubscribe = unsub;

};

/**
* The default Config handler for the "pages" property
* @method configPages
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.CalendarGroup.prototype.configPages = function(type, args, obj) {
	var pageCount = args[0];

	for (var p=0;p<pageCount;++p) {
		var calId = this.id + "_" + p;
		var calContainerId = this.containerId + "_" + p;

		var childConfig = this.cfg.getConfig();
		childConfig.close = false;
		childConfig.title = false;

		var cal = this.constructChild(calId, calContainerId, childConfig);
		var caldate = cal.cfg.getProperty("pagedate");
		caldate.setMonth(caldate.getMonth()+p);
		cal.cfg.setProperty("pagedate", caldate);
		
		YAHOO.util.Dom.removeClass(cal.oDomContainer, this.Style.CSS_SINGLE);
		YAHOO.util.Dom.addClass(cal.oDomContainer, "groupcal");
		
		if (p===0) {
			YAHOO.util.Dom.addClass(cal.oDomContainer, "first");
		}

		if (p==(pageCount-1)) {
			YAHOO.util.Dom.addClass(cal.oDomContainer, "last");
		}
		
		cal.parent = this;
		cal.index = p; 

		this.pages[this.pages.length] = cal;
	}
};

/**
* The default Config handler for the "pagedate" property
* @method configPageDate
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.CalendarGroup.prototype.configPageDate = function(type, args, obj) {
	var val = args[0];

	for (var p=0;p<this.pages.length;++p) {
		var cal = this.pages[p];
		cal.cfg.setProperty("pagedate", val);
		var calDate = cal.cfg.getProperty("pagedate");
		calDate.setMonth(calDate.getMonth()+p);
	}
};

/**
* Delegates a configuration property to the CustomEvents associated with the CalendarGroup's children
* @method delegateConfig
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.CalendarGroup.prototype.delegateConfig = function(type, args, obj) {
	var val = args[0];
	var cal;

	for (var p=0;p<this.pages.length;p++) {
		cal = this.pages[p];
		cal.cfg.setProperty(type, val);
	}
};


/**
* Adds a function to all child Calendars within this CalendarGroup.
* @method setChildFunction
* @param {String}		fnName		The name of the function
* @param {Function}		fn			The function to apply to each Calendar page object
*/
YAHOO.widget.CalendarGroup.prototype.setChildFunction = function(fnName, fn) {
	var pageCount = this.cfg.getProperty("pages");

	for (var p=0;p<pageCount;++p) {
		this.pages[p][fnName] = fn;
	}
};

/**
* Calls a function within all child Calendars within this CalendarGroup.
* @method callChildFunction
* @param {String}		fnName		The name of the function
* @param {Array}		args		The arguments to pass to the function
*/
YAHOO.widget.CalendarGroup.prototype.callChildFunction = function(fnName, args) {
	var pageCount = this.cfg.getProperty("pages");

	for (var p=0;p<pageCount;++p) {
		var page = this.pages[p];
		if (page[fnName]) {
			var fn = page[fnName];
			fn.call(page, args);
		}
	}	
};

/**
* Constructs a child calendar. This method can be overridden if a subclassed version of the default
* calendar is to be used.
* @method constructChild
* @param {String}	id			The id of the table element that will represent the calendar widget
* @param {String}	containerId	The id of the container div element that will wrap the calendar table
* @param {Object}	config		The configuration object containing the Calendar's arguments
* @return {YAHOO.widget.Calendar}	The YAHOO.widget.Calendar instance that is constructed
*/
YAHOO.widget.CalendarGroup.prototype.constructChild = function(id,containerId,config) {
	var container = document.getElementById(containerId);
	if (! container) {
		container = document.createElement("div");
		container.id = containerId;
		this.oDomContainer.appendChild(container);
	}
	return new YAHOO.widget.Calendar(id,containerId,config);
};


/**
* Sets the calendar group's month explicitly. This month will be set into the first
* page of the multi-page calendar, and all other months will be iterated appropriately.
* @method setMonth
* @param {Number}	month		The numeric month, from 0 (January) to 11 (December)
*/
YAHOO.widget.CalendarGroup.prototype.setMonth = function(month) {
	for (var p=0;p<this.pages.length;++p) {
		var cal = this.pages[p];
		cal.setMonth(month+p);
	}
};

/**
* Sets the calendar group's year explicitly. This year will be set into the first
* page of the multi-page calendar, and all other months will be iterated appropriately.
* @method setYear
* @param {Number}	year		The numeric 4-digit year
*/
YAHOO.widget.CalendarGroup.prototype.setYear = function(year) {
	for (var p=0;p<this.pages.length;++p) {
		var cal = this.pages[p];
		var pageDate = cal.cfg.getProperty("pageDate");

		if ((pageDate.getMonth()+1) == 1 && p>0) {
			year+=1;
		}
		cal.setYear(year);
	}
};
/**
* Calls the render function of all child calendars within the group.
* @method render
*/
YAHOO.widget.CalendarGroup.prototype.render = function() {
	this.renderHeader();
	for (var p=0;p<this.pages.length;++p) {
		var cal = this.pages[p];
		cal.render();
	}
	this.renderFooter();
};

/**
* Selects a date or a collection of dates on the current calendar. This method, by default,
* does not call the render method explicitly. Once selection has completed, render must be 
* called for the changes to be reflected visually.
* @method select
* @param	{String/Date/Date[]}	date	The date string of dates to select in the current calendar. Valid formats are
*								individual date(s) (12/24/2005,12/26/2005) or date range(s) (12/24/2005-1/1/2006).
*								Multiple comma-delimited dates can also be passed to this method (12/24/2005,12/11/2005-12/13/2005).
*								This method can also take a JavaScript Date object or an array of Date objects.
* @return	{Date[]}			Array of JavaScript Date objects representing all individual dates that are currently selected.
*/
YAHOO.widget.CalendarGroup.prototype.select = function(date) {
	for (var p=0;p<this.pages.length;++p) {
		var cal = this.pages[p];
		cal.select(date);
	}
	return this.getSelectedDates();
};

/**
* Selects a date on the current calendar by referencing the index of the cell that should be selected.
* This method is used to easily select a single cell (usually with a mouse click) without having to do
* a full render. The selected style is applied to the cell directly.
* @method selectCell
* @param	{Number}	cellIndex	The index of the cell to select in the current calendar. 
* @return	{Date[]}	Array of JavaScript Date objects representing all individual dates that are currently selected.
*/
YAHOO.widget.CalendarGroup.prototype.selectCell = function(cellIndex) {
	for (var p=0;p<this.pages.length;++p) {
		var cal = this.pages[p];
		cal.selectCell(cellIndex);
	}
	return this.getSelectedDates();
};

/**
* Deselects a date or a collection of dates on the current calendar. This method, by default,
* does not call the render method explicitly. Once deselection has completed, render must be 
* called for the changes to be reflected visually.
* @method deselect
* @param	{String/Date/Date[]}	date	The date string of dates to deselect in the current calendar. Valid formats are
*								individual date(s) (12/24/2005,12/26/2005) or date range(s) (12/24/2005-1/1/2006).
*								Multiple comma-delimited dates can also be passed to this method (12/24/2005,12/11/2005-12/13/2005).
*								This method can also take a JavaScript Date object or an array of Date objects.	
* @return	{Date[]}			Array of JavaScript Date objects representing all individual dates that are currently selected.
*/
YAHOO.widget.CalendarGroup.prototype.deselect = function(date) {
	for (var p=0;p<this.pages.length;++p) {
		var cal = this.pages[p];
		cal.deselect(date);
	}
	return this.getSelectedDates();
};

/**
* Deselects all dates on the current calendar.
* @method deselectAll
* @return {Date[]}		Array of JavaScript Date objects representing all individual dates that are currently selected.
*						Assuming that this function executes properly, the return value should be an empty array.
*						However, the empty array is returned for the sake of being able to check the selection status
*						of the calendar.
*/
YAHOO.widget.CalendarGroup.prototype.deselectAll = function() {
	for (var p=0;p<this.pages.length;++p) {
		var cal = this.pages[p];
		cal.deselectAll();
	}
	return this.getSelectedDates();
};

/**
* Deselects a date on the current calendar by referencing the index of the cell that should be deselected.
* This method is used to easily deselect a single cell (usually with a mouse click) without having to do
* a full render. The selected style is removed from the cell directly.
* @method deselectCell
* @param	{Number}	cellIndex	The index of the cell to deselect in the current calendar. 
* @return	{Date[]}	Array of JavaScript Date objects representing all individual dates that are currently selected.
*/
YAHOO.widget.CalendarGroup.prototype.deselectCell = function(cellIndex) {
	for (var p=0;p<this.pages.length;++p) {
		var cal = this.pages[p];
		cal.deselectCell(cellIndex);
	}
	return this.getSelectedDates();
};

/**
* Resets the calendar widget to the originally selected month and year, and 
* sets the calendar to the initial selection(s).
* @method reset
*/
YAHOO.widget.CalendarGroup.prototype.reset = function() {
	for (var p=0;p<this.pages.length;++p) {
		var cal = this.pages[p];
		cal.reset();
	}
};

/**
* Clears the selected dates in the current calendar widget and sets the calendar
* to the current month and year.
* @method clear
*/
YAHOO.widget.CalendarGroup.prototype.clear = function() {
	for (var p=0;p<this.pages.length;++p) {
		var cal = this.pages[p];
		cal.clear();
	}
};

/**
* Navigates to the next month page in the calendar widget.
* @method nextMonth
*/
YAHOO.widget.CalendarGroup.prototype.nextMonth = function() {
	for (var p=0;p<this.pages.length;++p) {
		var cal = this.pages[p];
		cal.nextMonth();
	}
};

/**
* Navigates to the previous month page in the calendar widget.
* @method previousMonth
*/
YAHOO.widget.CalendarGroup.prototype.previousMonth = function() {
	for (var p=this.pages.length-1;p>=0;--p) {
		var cal = this.pages[p];
		cal.previousMonth();
	}
};

/**
* Navigates to the next year in the currently selected month in the calendar widget.
* @method nextYear
*/
YAHOO.widget.CalendarGroup.prototype.nextYear = function() {
	for (var p=0;p<this.pages.length;++p) {
		var cal = this.pages[p];
		cal.nextYear();
	}
};

/**
* Navigates to the previous year in the currently selected month in the calendar widget.
* @method previousYear
*/
YAHOO.widget.CalendarGroup.prototype.previousYear = function() {
	for (var p=0;p<this.pages.length;++p) {
		var cal = this.pages[p];
		cal.previousYear();
	}
};


/**
* Gets the list of currently selected dates from the calendar.
* @return			An array of currently selected JavaScript Date objects.
* @type Date[]
*/
YAHOO.widget.CalendarGroup.prototype.getSelectedDates = function() { 
	var returnDates = [];
	var selected = this.cfg.getProperty("selected");

	for (var d=0;d<selected.length;++d) {
		var dateArray = selected[d];

		var date = new Date(dateArray[0],dateArray[1]-1,dateArray[2]);
		returnDates.push(date);
	}

	returnDates.sort( function(a,b) { return a-b; } );
	return returnDates;
};

/**
* Adds a renderer to the render stack. The function reference passed to this method will be executed
* when a date cell matches the conditions specified in the date string for this renderer.
* @method addRenderer
* @param	{String}	sDates		A date string to associate with the specified renderer. Valid formats
*									include date (12/24/2005), month/day (12/24), and range (12/1/2004-1/1/2005)
* @param	{Function}	fnRender	The function executed to render cells that match the render rules for this renderer.
*/
YAHOO.widget.CalendarGroup.prototype.addRenderer = function(sDates, fnRender) {
	for (var p=0;p<this.pages.length;++p) {
		var cal = this.pages[p];
		cal.addRenderer(sDates, fnRender);
	}
};

/**
* Adds a month to the render stack. The function reference passed to this method will be executed
* when a date cell matches the month passed to this method.
* @method addMonthRenderer
* @param	{Number}	month		The month (1-12) to associate with this renderer
* @param	{Function}	fnRender	The function executed to render cells that match the render rules for this renderer.
*/
YAHOO.widget.CalendarGroup.prototype.addMonthRenderer = function(month, fnRender) {
	for (var p=0;p<this.pages.length;++p) {
		var cal = this.pages[p];
		cal.addMonthRenderer(month, fnRender);
	}
};

/**
* Adds a weekday to the render stack. The function reference passed to this method will be executed
* when a date cell matches the weekday passed to this method.
* @method addWeekdayRenderer
* @param	{Number}	weekday		The weekday (0-6) to associate with this renderer
* @param	{Function}	fnRender	The function executed to render cells that match the render rules for this renderer.
*/
YAHOO.widget.CalendarGroup.prototype.addWeekdayRenderer = function(weekday, fnRender) {
	for (var p=0;p<this.pages.length;++p) {
		var cal = this.pages[p];
		cal.addWeekdayRenderer(weekday, fnRender);
	}
};

/**
* Renders the header for the CalendarGroup.
* @method renderHeader
*/
YAHOO.widget.CalendarGroup.prototype.renderHeader = function() {};

/**
* Renders a footer for the 2-up calendar container. By default, this method is
* unimplemented.
* @method renderFooter
*/
YAHOO.widget.CalendarGroup.prototype.renderFooter = function() {};

/**
* Adds the designated number of months to the current calendar month, and sets the current
* calendar page date to the new month.
* @method addMonths
* @param {Number}	count	The number of months to add to the current calendar
*/
YAHOO.widget.CalendarGroup.prototype.addMonths = function(count) {
	this.callChildFunction("addMonths", count);
};


/**
* Subtracts the designated number of months from the current calendar month, and sets the current
* calendar page date to the new month.
* @method subtractMonths
* @param {Number}	count	The number of months to subtract from the current calendar
*/
YAHOO.widget.CalendarGroup.prototype.subtractMonths = function(count) {
	this.callChildFunction("subtractMonths", count);
};

/**
* Adds the designated number of years to the current calendar, and sets the current
* calendar page date to the new month.
* @method addYears
* @param {Number}	count	The number of years to add to the current calendar
*/
YAHOO.widget.CalendarGroup.prototype.addYears = function(count) {
	this.callChildFunction("addYears", count);
};

/**
* Subtcats the designated number of years from the current calendar, and sets the current
* calendar page date to the new month.
* @method subtractYears
* @param {Number}	count	The number of years to subtract from the current calendar
*/
YAHOO.widget.CalendarGroup.prototype.subtractYears = function(count) {
	this.callChildFunction("subtractYears", count);
};

/**
* CSS class representing the container for the calendar
* @property YAHOO.widget.CalendarGroup.CSS_CONTAINER
* @static
* @final
* @type String
*/
YAHOO.widget.CalendarGroup.CSS_CONTAINER = "yui-calcontainer";

/**
* CSS class representing the container for the calendar
* @property YAHOO.widget.CalendarGroup.CSS_MULTI_UP
* @static
* @final
* @type String
*/
YAHOO.widget.CalendarGroup.CSS_MULTI_UP = "multi";

/**
* CSS class representing the title for the 2-up calendar
* @property YAHOO.widget.CalendarGroup.CSS_2UPTITLE
* @static
* @final
* @type String
*/
YAHOO.widget.CalendarGroup.CSS_2UPTITLE = "title";

/**
* CSS class representing the close icon for the 2-up calendar
* @property YAHOO.widget.CalendarGroup.CSS_2UPCLOSE
* @static
* @final
* @type String
*/
YAHOO.widget.CalendarGroup.CSS_2UPCLOSE = "close-icon";

YAHOO.augment(YAHOO.widget.CalendarGroup, YAHOO.widget.Calendar, "buildDayLabel",
																 "buildMonthLabel",
																 "renderOutOfBoundsDate",
																 "renderRowHeader",
																 "renderRowFooter",
																 "renderCellDefault",
																 "styleCellDefault",
																 "renderCellStyleHighlight1",
																 "renderCellStyleHighlight2",
																 "renderCellStyleHighlight3",
																 "renderCellStyleHighlight4",
																 "renderCellStyleToday",
																 "renderCellStyleSelected",
																 "renderCellNotThisMonth",
																 "renderBodyCellRestricted",
																 "initStyles",
																 "configTitle",
																 "configClose",
																 "hide",
																 "show",
																 "browser");

/**
* Returns a string representation of the object.
* @method toString
* @return {String}	A string representation of the CalendarGroup object.
*/
YAHOO.widget.CalendarGroup.prototype.toString = function() {
	return "CalendarGroup " + this.id;
};

YAHOO.widget.CalGrp = YAHOO.widget.CalendarGroup;

/**
* @class YAHOO.widget.Calendar2up
* @extends YAHOO.widget.CalendarGroup
* @deprecated The old Calendar2up class is no longer necessary, since CalendarGroup renders in a 2up view by default.
*/
YAHOO.widget.Calendar2up = function(id, containerId, config) {
	this.init(id, containerId, config);
};

YAHOO.extend(YAHOO.widget.Calendar2up, YAHOO.widget.CalendarGroup);

/**
* @deprecated The old Calendar2up class is no longer necessary, since CalendarGroup renders in a 2up view by default.
*/
YAHOO.widget.Cal2up = YAHOO.widget.Calendar2up;