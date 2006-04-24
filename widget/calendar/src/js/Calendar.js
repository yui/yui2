/**
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt 
**/

/**
* @class
* Calendar is the default implementation of the YAHOO.widget.Calendar_Core base class.
* This class is the UED-approved version of the calendar selector widget. For all documentation
* on the implemented methods listed here, see the documentation for YAHOO.widget.Calendar_Core.
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
YAHOO.widget.Calendar = function(id, containerId, monthyear, selected) {
	if (arguments.length > 0)
	{
		this.init(id, containerId, monthyear, selected);
	}
}

YAHOO.widget.Calendar.prototype = new YAHOO.widget.Calendar_Core();

YAHOO.widget.Calendar.prototype.buildShell = function() {
	this.border = document.createElement("DIV");
	this.border.className =  this.Style.CSS_BORDER;
	
	this.table = document.createElement("TABLE");
	this.table.cellSpacing = 0;	
	
	YAHOO.widget.Calendar_Core.setCssClasses(this.table, [this.Style.CSS_CALENDAR]);

	this.border.id = this.id;
	
	this.buildShellHeader();
	this.buildShellBody();
	this.buildShellFooter();
};

YAHOO.widget.Calendar.prototype.renderShell = function() {
	this.border.appendChild(this.table);
	this.oDomContainer.appendChild(this.border);
	this.shellRendered = true;
};

YAHOO.widget.Calendar.prototype.renderHeader = function() {
	this.headerCell.innerHTML = "";
	
	var headerContainer = document.createElement("DIV");
	headerContainer.className = this.Style.CSS_HEADER;
	
	var linkLeft = document.createElement("A");
	linkLeft.href = "javascript:" + this.id + ".previousMonth()";
	var imgLeft = document.createElement("IMG");
	imgLeft.src = this.Options.NAV_ARROW_LEFT;
	imgLeft.className = this.Style.CSS_NAV_LEFT;
	linkLeft.appendChild(imgLeft);
	
	var linkRight = document.createElement("A");
	linkRight.href = "javascript:" + this.id + ".nextMonth()";
	var imgRight = document.createElement("IMG");
	imgRight.src = this.Options.NAV_ARROW_RIGHT;
	imgRight.className = this.Style.CSS_NAV_RIGHT;
	linkRight.appendChild(imgRight);
	
	headerContainer.appendChild(linkLeft);
	headerContainer.appendChild(document.createTextNode(this.buildMonthLabel()));
	headerContainer.appendChild(linkRight);
	
	this.headerCell.appendChild(headerContainer);
};

YAHOO.widget.Cal = YAHOO.widget.Calendar;