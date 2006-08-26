/*
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
Version 0.11.3
*/

/**
* <p>YAHOO.widget.CalendarGroup is a special container class for YAHOO.widget.Calendar_Core. This class facilitates
* the ability to have multi-page calendar views that share a single dataset and are
* dependent on each other.</p>
* 
* <p>The calendar group instance will refer to each of its elements using a 0-based index.
* For example, to construct the placeholder for a calendar group widget with id "cal1" and
* containerId of "cal1Container", the markup would be as follows:
*	<xmp>
*		<div id="cal1Container_0"></div>
*		<div id="cal1Container_1"></div>
*	</xmp>
* The tables for the calendars ("cal1_0" and "cal1_1") will be inserted into those containers.
* </p>
* @constructor
* @param {Integer}		pageCount	The number of pages that this calendar should display.
* @param {String}		id			The id of the element that will be inserted into the DOM.
* @param {String}	containerId	The id of the container element that the calendar will be inserted into.
* @param {String}		monthyear	The month/year string used to set the current calendar page
* @param {String}		selected	A string of date values formatted using the date parser. The built-in
									default date format is MM/DD/YYYY. Ranges are defined using
									MM/DD/YYYY-MM/DD/YYYY. Month/day combinations are defined using MM/DD.
									Any combination of these can be combined by delimiting the string with
									commas. Example: "12/24/2005,12/25,1/18/2006-1/21/2006"
*/
YAHOO.widget.CalendarGroup = function(pageCount, id, containerId, monthyear, selected) {
	if (arguments.length > 0) {
		this.init(pageCount, id, containerId, monthyear, selected);
	}
}

/**
* Initializes the calendar group. All subclasses must call this method in order for the
* group to be initialized properly.
* @param {Integer}		pageCount	The number of pages that this calendar should display.
* @param {String}		id			The id of the element that will be inserted into the DOM.
* @param {String}		containerId	The id of the container element that the calendar will be inserted into.
* @param {String}		monthyear	The month/year string used to set the current calendar page
* @param {String}		selected	A string of date values formatted using the date parser. The built-in
									default date format is MM/DD/YYYY. Ranges are defined using
									MM/DD/YYYY-MM/DD/YYYY. Month/day combinations are defined using MM/DD.
									Any combination of these can be combined by delimiting the string with
									commas. Example: "12/24/2005,12/25,1/18/2006-1/21/2006"
*/
YAHOO.widget.CalendarGroup.prototype.init = function(pageCount, id, containerId, monthyear, selected) {
	this.id = id;
	this.selectedDates = new Array();
	this.containerId = containerId;
	
	this.pageCount = pageCount;

	this.pages = new Array();

	for (var p=0;p<pageCount;++p) {
		var cal = this.constructChild(id + "_" + p, this.containerId + "_" + p , monthyear, selected);
				
		cal.parent = this;
		
		cal.index = p;

		cal.pageDate.setMonth(cal.pageDate.getMonth()+p);
		cal._pageDate = new Date(cal.pageDate.getFullYear(),cal.pageDate.getMonth(),cal.pageDate.getDate());
		this.pages.push(cal);
	}
	
	this.sync();

	this.doNextMonth = function(e, calGroup) {
		calGroup.nextMonth();
	};
	
	this.doPreviousMonth = function(e, calGroup) {
		calGroup.previousMonth();
	};
};

/**
* Adds a function to all child Calendars within this CalendarGroup.
* @param {String}		fnName		The name of the function
* @param {Function}		fn			The function to apply to each Calendar page object
*/
YAHOO.widget.CalendarGroup.prototype.setChildFunction = function(fnName, fn) {
	for (var p=0;p<this.pageCount;++p) {
		this.pages[p][fnName] = fn;
	}
}

/**
* Calls a function within all child Calendars within this CalendarGroup.
* @param {String}		fnName		The name of the function
* @param {Array}		args		The arguments to pass to the function
*/
YAHOO.widget.CalendarGroup.prototype.callChildFunction = function(fnName, args) {
	for (var p=0;p<this.pageCount;++p) {
		var page = this.pages[p];
		if (page[fnName]) {
			var fn = page[fnName];
			fn.call(page, args);
		}
	}	
}

/**
* Constructs a child calendar. This method can be overridden if a subclassed version of the default
* calendar is to be used.
* @param {String}		id			The id of the element that will be inserted into the DOM.
* @param {String}		containerId	The id of the container element that the calendar will be inserted into.
* @param {String}		monthyear	The month/year string used to set the current calendar page
* @param {String}		selected	A string of date values formatted using the date parser. The built-in
									default date format is MM/DD/YYYY. Ranges are defined using
									MM/DD/YYYY-MM/DD/YYYY. Month/day combinations are defined using MM/DD.
									Any combination of these can be combined by delimiting the string with
									commas. Example: "12/24/2005,12/25,1/18/2006-1/21/2006"
* @return							The YAHOO.widget.Calendar_Core instance that is constructed
* @type YAHOO.widget.Calendar_Core
*/
YAHOO.widget.CalendarGroup.prototype.constructChild = function(id,containerId,monthyear,selected) {
	return new YAHOO.widget.Calendar_Core(id,containerId,monthyear,selected);
};


/**
* Sets the calendar group's month explicitly. This month will be set into the first
* page of the multi-page calendar, and all other months will be iterated appropriately.
* @param {Integer}	month		The numeric month, from 1 (January) to 12 (December)
*/
YAHOO.widget.CalendarGroup.prototype.setMonth = function(month) {
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		cal.setMonth(month+p);
	}
};

/**
* Sets the calendar group's year explicitly. This year will be set into the first
* page of the multi-page calendar, and all other months will be iterated appropriately.
* @param {Integer}	year		The numeric 4-digit year
*/
YAHOO.widget.CalendarGroup.prototype.setYear = function(year) {
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		if ((cal.pageDate.getMonth()+1) == 1 && p>0)
		{
			year+=1;
		}
		cal.setYear(year);
	}
};

/**
* Calls the render function of all child calendars within the group.
*/
YAHOO.widget.CalendarGroup.prototype.render = function() {
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		cal.render();
	}
};

/**
* Calls the select function of all child calendars within the group.
*/
YAHOO.widget.CalendarGroup.prototype.select = function(date) {
	var ret;
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		ret = cal.select(date);
	}
	return ret;
};

/**
* Calls the selectCell function of all child calendars within the group.
*/
YAHOO.widget.CalendarGroup.prototype.selectCell = function(cellIndex) {
	var ret;
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		ret = cal.selectCell(cellIndex);
	}
	return ret;
};

/**
* Calls the deselect function of all child calendars within the group.
*/
YAHOO.widget.CalendarGroup.prototype.deselect = function(date) {
	var ret;
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		ret = cal.deselect(date);
	}
	return ret;
};

/**
* Calls the deselectAll function of all child calendars within the group.
*/
YAHOO.widget.CalendarGroup.prototype.deselectAll = function() {
	var ret;
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		ret = cal.deselectAll();
	}
	return ret;
};

/**
* Calls the deselectAll function of all child calendars within the group.
*/
YAHOO.widget.CalendarGroup.prototype.deselectCell = function(cellIndex) {
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		cal.deselectCell(cellIndex);
	}
	return this.getSelectedDates();
};

/**
* Calls the reset function of all child calendars within the group.
*/
YAHOO.widget.CalendarGroup.prototype.reset = function() {
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		cal.reset();
	}
};

/**
* Calls the clear function of all child calendars within the group.
*/
YAHOO.widget.CalendarGroup.prototype.clear = function() {
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		cal.clear();
	}
};

/**
* Calls the nextMonth function of all child calendars within the group.
*/
YAHOO.widget.CalendarGroup.prototype.nextMonth = function() {
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		cal.nextMonth();
	}
};

/**
* Calls the previousMonth function of all child calendars within the group.
*/
YAHOO.widget.CalendarGroup.prototype.previousMonth = function() {
	for (var p=this.pages.length-1;p>=0;--p)
	{
		var cal = this.pages[p];
		cal.previousMonth();
	}
};

/**
* Calls the nextYear function of all child calendars within the group.
*/
YAHOO.widget.CalendarGroup.prototype.nextYear = function() {
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		cal.nextYear();
	}
};

/**
* Calls the previousYear function of all child calendars within the group.
*/
YAHOO.widget.CalendarGroup.prototype.previousYear = function() {
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		cal.previousYear();
	}
};

/**
* Synchronizes the data values for all child calendars within the group. If the sync
* method is called passing in the caller object, the values of all children will be set
* to the values of the caller. If the argument is ommitted, the values from all children
* will be combined into one distinct list and set into each child.
* @param	{YAHOO.widget.Calendar_Core}	caller		The YAHOO.widget.Calendar_Core that is initiating the call to sync().
* @return								Array of selected dates, in JavaScript Date object form.
* @type Date[]
*/
YAHOO.widget.CalendarGroup.prototype.sync = function(caller) {
	var calendar;

	if (caller)
	{
		this.selectedDates = caller.selectedDates.concat();
	} else {
		var hash = new Object();
		var combinedDates = new Array();

		for (var p=0;p<this.pages.length;++p)
		{
			calendar = this.pages[p];

			var values = calendar.selectedDates;

			for (var v=0;v<values.length;++v)
			{
				var valueArray = values[v];
				hash[valueArray.toString()] = valueArray;
			}
		}

		for (var val in hash)
		{
			combinedDates[combinedDates.length]=hash[val];
		}
		
		this.selectedDates = combinedDates.concat();
	}

	// Set all the values into the children
	for (p=0;p<this.pages.length;++p)
	{
		calendar = this.pages[p];
		if (! calendar.Options.MULTI_SELECT) {
			calendar.clearAllBodyCellStyles(calendar.Config.Style.CSS_CELL_SELECTED);
		}
		calendar.selectedDates = this.selectedDates.concat();
		
	}
	
	return this.getSelectedDates();
};

/**
* Gets the list of currently selected dates from the calendar.
* @return			An array of currently selected JavaScript Date objects.
* @type Date[]
*/
YAHOO.widget.CalendarGroup.prototype.getSelectedDates = function() { 
	var returnDates = new Array();

	for (var d=0;d<this.selectedDates.length;++d)
	{
		var dateArray = this.selectedDates[d];

		var date = new Date(dateArray[0],dateArray[1]-1,dateArray[2]);
		returnDates.push(date);
	}

	returnDates.sort();
	return returnDates;
};

/**
* Calls the addRenderer function of all child calendars within the group.
*/
YAHOO.widget.CalendarGroup.prototype.addRenderer = function(sDates, fnRender) {
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		cal.addRenderer(sDates, fnRender);
	}
};

/**
* Calls the addMonthRenderer function of all child calendars within the group.
*/
YAHOO.widget.CalendarGroup.prototype.addMonthRenderer = function(month, fnRender) {
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		cal.addMonthRenderer(month, fnRender);
	}
};

/**
* Calls the addWeekdayRenderer function of all child calendars within the group.
*/
YAHOO.widget.CalendarGroup.prototype.addWeekdayRenderer = function(weekday, fnRender) {
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		cal.addWeekdayRenderer(weekday, fnRender);
	}
};

/**
* Sets an event handler universally across all child calendars within the group. For instance,
* to set the onSelect handler for all child calendars to a function called fnSelect, the call would be:
* <code>
* calGroup.wireEvent("onSelect", fnSelect);
* </code>
* @param	{String}	eventName	The name of the event to handler to set within all child calendars.
* @param	{Function}	fn			The function to set into the specified event handler.
*/
YAHOO.widget.CalendarGroup.prototype.wireEvent = function(eventName, fn) {
	for (var p=0;p<this.pages.length;++p)
	{
		var cal = this.pages[p];
		cal[eventName] = fn;
	}
};

/**
* Returns a string representation of the object.
* @type string
*/ 
YAHOO.widget.CalendarGroup.prototype.toString = function() {
	return "CalendarGroup " + this.id;
}

YAHOO.widget.CalGrp = YAHOO.widget.CalendarGroup;