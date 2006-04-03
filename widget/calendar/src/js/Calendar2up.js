/* Copyright (c) 2006 Yahoo! Inc. All rights reserved. */

YAHOO.namespace("YAHOO.widget");

/**
* @class
* Calendar2up_Cal is the default implementation of the Calendar_Core base class, when used
* in a 2-up view. This class is the UED-approved version of the calendar selector widget. For all documentation
* on the implemented methods listed here, see the documentation for Calendar_Core. This class
* has some special attributes that only apply to calendars rendered within the calendar group implementation. 
* There should be no reason to instantiate this class directly.
* @constructor
* @param {String}	id			The id of the table element that will represent the calendar widget
* @param {String}	containerId	The id of the container element that will contain the calendar table
* @param {String}	monthyear	The month/year string used to set the current calendar page
* @param {String}	selected	A string of date values formatted using the date parser. The built-in
								default date format is MM/DD/YYYY. Ranges are defined using
								MM/DD/YYYY-MM/DD/YYYY. Month/day combinations are defined using MM/DD.
								Any combination of these can be combined by delimiting the string with
								commas. Example: "12/24/2005,12/25,1/18/2006-1/21/2006"
*/
YAHOO.widget.Calendar2up_Cal = function(id, containerId, monthyear, selected) {
	if (arguments.length > 0)
	{
		this.init(id, containerId, monthyear, selected);
	}
}

YAHOO.widget.Calendar2up_Cal.prototype = new YAHOO.widget.Calendar_Core();

/**
* Renders the header for each individual calendar in the 2-up view. More
* specifically, this method handles the placement of left and right arrows for
* navigating between calendar pages.
*/
YAHOO.widget.Calendar2up_Cal.prototype.renderHeader = function() {
	this.headerCell.innerHTML = "";
	
	var headerContainer = document.createElement("DIV");
	headerContainer.className = this.Style.CSS_HEADER;
	
	if (this.index == 0) {
		var linkLeft = document.createElement("A");
		linkLeft.href = "javascript:void(null)";
		YAHOO.util.Event.addListener(linkLeft, "click", this.parent.doPreviousMonth, this.parent);
		var imgLeft = document.createElement("IMG");
		imgLeft.src = this.Options.NAV_ARROW_LEFT;
		imgLeft.className = this.Style.CSS_NAV_LEFT;
		linkLeft.appendChild(imgLeft);
		headerContainer.appendChild(linkLeft);
	}
	
	headerContainer.appendChild(document.createTextNode(this.buildMonthLabel()));
	
	if (this.index == 1) {
		var linkRight = document.createElement("A");
		linkRight.href = "javascript:void(null)";
		YAHOO.util.Event.addListener(linkRight, "click", this.parent.doNextMonth, this.parent);
		var imgRight = document.createElement("IMG");
		imgRight.src = this.Options.NAV_ARROW_RIGHT;
		imgRight.className = this.Style.CSS_NAV_RIGHT;
		linkRight.appendChild(imgRight);
		headerContainer.appendChild(linkRight);
	}
	
	this.headerCell.appendChild(headerContainer);
};




/**
* @class
* Calendar2up is the default implementation of the CalendarGroup base class, when used
* in a 2-up view. This class is the UED-approved version of the 2-up calendar selector widget. For all documentation
* on the implemented methods listed here, see the documentation for CalendarGroup. 
* @constructor
* @param {String}	id			The id of the table element that will represent the calendar widget
* @param {String}	containerId	The id of the container element that will contain the calendar table
* @param {String}	monthyear	The month/year string used to set the current calendar page
* @param {String}	selected	A string of date values formatted using the date parser. The built-in
								default date format is MM/DD/YYYY. Ranges are defined using
								MM/DD/YYYY-MM/DD/YYYY. Month/day combinations are defined using MM/DD.
								Any combination of these can be combined by delimiting the string with
								commas. Example: "12/24/2005,12/25,1/18/2006-1/21/2006"
*/
YAHOO.widget.Calendar2up = function(id, containerId, monthyear, selected) {
	if (arguments.length > 0)
	{	
		this.buildWrapper(containerId);
		this.init(2, id, containerId, monthyear, selected);
	}
}

YAHOO.widget.Calendar2up.prototype = new YAHOO.widget.CalendarGroup();

/**
* Implementation of CalendarGroup.constructChild that ensures that child calendars of 
* Calendar2up will be of type Calendar2up_Cal.
*/
YAHOO.widget.Calendar2up.prototype.constructChild = function(id,containerId,monthyear,selected) {
	var cal = new YAHOO.widget.Calendar2up_Cal(id,containerId,monthyear,selected);
	return cal;
};

/**
* Builds the wrapper container for the 2-up calendar.
* @param {String} containerId	The id of the outer container element.
*/
YAHOO.widget.Calendar2up.prototype.buildWrapper = function(containerId) {
	var outerContainer = document.getElementById(containerId);
	
	outerContainer.className = "calcontainer";
	
	var innerContainer = document.createElement("DIV");
	innerContainer.className = "calbordered";
	innerContainer.id = containerId + "_inner";
	
	var cal1Container = document.createElement("DIV");
	cal1Container.id = containerId + "_0";
	cal1Container.className = "cal2up";
	cal1Container.style.marginRight = "10px";
	
	var cal2Container = document.createElement("DIV");
	cal2Container.id = containerId + "_1"; 
	cal2Container.className = "cal2up";
	
	outerContainer.appendChild(innerContainer);
	innerContainer.appendChild(cal1Container);
	innerContainer.appendChild(cal2Container);
	
	this.innerContainer = innerContainer;
	this.outerContainer = outerContainer;
}

/**
* Renders the 2-up calendar.
*/
YAHOO.widget.Calendar2up.prototype.render = function() {
	this.renderHeader();
	YAHOO.widget.CalendarGroup.prototype.render.call(this);
	this.renderFooter();
};

/**
* Renders the header located at the top of the container for the 2-up calendar.
*/
YAHOO.widget.Calendar2up.prototype.renderHeader = function() {
	if (! this.title) {
		this.title = "";
	}
	if (! this.titleDiv)
	{
		this.titleDiv = document.createElement("DIV");
		if (this.title == "")
		{
			this.titleDiv.style.display="none";
		}
	}

	this.titleDiv.className = "title";
	this.titleDiv.innerHTML = this.title;

	if (this.outerContainer.style.position == "absolute")
	{
		var linkClose = document.createElement("A");
		linkClose.href = "javascript:void(null)";
		YAHOO.util.Event.addListener(linkClose, "click", this.hide, this);

		var imgClose = document.createElement("IMG");
		imgClose.src = YAHOO.widget.Calendar_Core.IMG_ROOT + "us/my/bn/x_d.gif";
		imgClose.className = "close-icon";

		linkClose.appendChild(imgClose);

		this.linkClose = linkClose;

		this.titleDiv.appendChild(linkClose);
	}

	this.innerContainer.insertBefore(this.titleDiv, this.innerContainer.firstChild);
}

/**
* Hides the 2-up calendar's outer container from view.
*/
YAHOO.widget.Calendar2up.prototype.hide = function(e, cal) {
	if (! cal)
	{
		cal = this;
	}
	cal.outerContainer.style.display = "none";
}

/**
* Renders a footer for the 2-up calendar container. By default, this method is
* unimplemented.
*/
YAHOO.widget.Calendar2up.prototype.renderFooter = function() {}

YAHOO.widget.Cal2up = YAHOO.widget.Calendar2up;