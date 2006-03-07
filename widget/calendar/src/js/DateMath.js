/* Copyright (c) 2006 Yahoo! Inc. All rights reserved. */

YAHOO.namespace("YAHOO.widget");

/**
* @class
* <p>YAHOO.widget.DateMath is used for simple date manipulation. The class is a static utility
* used for adding, subtracting, and comparing dates.</p>
*/
YAHOO.widget.DateMath = new function() {

	/**
	* Constant field representing Day
	* @type String
	*/
	this.DAY = "D";

	/**
	* Constant field representing Week
	* @type String
	*/
	this.WEEK = "W";

	/**
	* Constant field representing Year
	* @type String
	*/
	this.YEAR = "Y";

	/**
	* Constant field representing Month
	* @type String
	*/
	this.MONTH = "M";

	/**
	* Constant field representing one day, in milliseconds
	* @type Integer
	*/
	this.ONE_DAY_MS = 1000*60*60*24;

	/**
	* Adds the specified amount of time to the this instance.
	* @param {Date} date	The JavaScript Date object to perform addition on
	* @param {string} field	The this field constant to be used for performing addition.
	* @param {Integer} amount	The number of units (measured in the field constant) to add to the date.
	*/
	this.add = function(date, field, amount) {
		var d = new Date(date.getTime());
		switch (field)
		{
			case this.MONTH:
				var newMonth = date.getMonth() + amount;
				var years = 0;


				if (newMonth < 0) {
					while (newMonth < 0)
					{
						newMonth += 12;
						years -= 1;
					}
				} else if (newMonth > 11) {
					while (newMonth > 11)
					{
						newMonth -= 12;
						years += 1;
					}
				}
				
				d.setMonth(newMonth);
				d.setFullYear(date.getFullYear() + years);
				break;
			case this.DAY:
				d.setDate(date.getDate() + amount);
				break;
			case this.YEAR:
				d.setFullYear(date.getFullYear() + amount);
				break;
			case this.WEEK:
				d.setDate(date.getDate() + 7);
				break;
		}
		return d;
	};

	/**
	* Subtracts the specified amount of time from the this instance.
	* @param {Date} date	The JavaScript Date object to perform subtraction on
	* @param {Integer} field	The this field constant to be used for performing subtraction.
	* @param {Integer} amount	The number of units (measured in the field constant) to subtract from the date.
	*/
	this.subtract = function(date, field, amount) {
		return this.add(date, field, (amount*-1));
	};

	/**
	* Determines whether a given date is before another date on the calendar.
	* @param {Date} date		The Date object to compare with the compare argument
	* @param {Date} compareTo	The Date object to use for the comparison
	* @return {Boolean} true if the date occurs before the compared date; false if not.
	*/
	this.before = function(date, compareTo) {
		var ms = compareTo.getTime();
		if (date.getTime() < ms) {
			return true;
		} else {
			return false;
		}
	};

	/**
	* Determines whether a given date is after another date on the calendar.
	* @param {Date} date		The Date object to compare with the compare argument
	* @param {Date} compareTo	The Date object to use for the comparison
	* @return {Boolean} true if the date occurs after the compared date; false if not.
	*/
	this.after = function(date, compareTo) {
		var ms = compareTo.getTime();
		if (date.getTime() > ms) {
			return true;
		} else {
			return false;
		}
	};

	/**
	* Retrieves a JavaScript Date object representing January 1 of any given year.
	* @param {Integer} calendarYear		The calendar year for which to retrieve January 1
	* @return {Date}	January 1 of the calendar year specified.
	*/
	this.getJan1 = function(calendarYear) {
		return new Date(calendarYear,0,1); 
	};

	/**
	* Calculates the number of days the specified date is from January 1 of the specified calendar year.
	* Passing January 1 to this function would return an offset value of zero.
	* @param {Date}	date	The JavaScript date for which to find the offset
	* @param {Integer} calendarYear	The calendar year to use for determining the offset
	* @return {Integer}	The number of days since January 1 of the given year
	*/
	this.getDayOffset = function(date, calendarYear) {
		var beginYear = this.getJan1(calendarYear); // Find the start of the year. This will be in week 1.
		
		// Find the number of days the passed in date is away from the calendar year start
		var dayOffset = Math.ceil((date.getTime()-beginYear.getTime()) / this.ONE_DAY_MS);
		return dayOffset;
	};

	/**
	* Calculates the week number for the given date. This function assumes that week 1 is the
	* week in which January 1 appears, regardless of whether the week consists of a full 7 days.
	* The calendar year can be specified to help find what a the week number would be for a given
	* date if the date overlaps years. For instance, a week may be considered week 1 of 2005, or
	* week 53 of 2004. Specifying the optional calendarYear allows one to make this distinction
	* easily.
	* @param {Date}	date	The JavaScript date for which to find the week number
	* @param {Integer} calendarYear	OPTIONAL - The calendar year to use for determining the week number. Default is
	*											the calendar year of parameter "date".
	* @param {Integer} weekStartsOn	OPTIONAL - The integer (0-6) representing which day a week begins on. Default is 0 (for Sunday).
	* @return {Integer}	The week number of the given date.
	*/
	this.getWeekNumber = function(date, calendarYear, weekStartsOn) {
		if (! weekStartsOn) {
			weekStartsOn = 0;
		}
		if (! calendarYear) {
			calendarYear = date.getFullYear();
		}
		var weekNum = -1;
		
		var jan1 = this.getJan1(calendarYear);
		var jan1DayOfWeek = jan1.getDay();
		
		var month = date.getMonth();
		var day = date.getDate();
		var year = date.getFullYear();
		
		var dayOffset = this.getDayOffset(date, calendarYear); // Days since Jan 1, Calendar Year
			
		if (dayOffset < 0 && dayOffset >= (-1 * jan1DayOfWeek)) {
			weekNum = 1;
		} else {
			weekNum = 1;
			var testDate = this.getJan1(calendarYear);
			
			while (testDate.getTime() < date.getTime() && testDate.getFullYear() == calendarYear) {
				weekNum += 1;
				testDate = this.add(testDate, this.WEEK, 1);
			}
		}
		
		return weekNum;
	};

	/**
	* Determines if a given week overlaps two different years.
	* @param {Date}	weekBeginDate	The JavaScript Date representing the first day of the week.
	* @return {Boolean}	true if the date overlaps two different years.
	*/
	this.isYearOverlapWeek = function(weekBeginDate) {
		var overlaps = false;
		var nextWeek = this.add(weekBeginDate, this.DAY, 6);
		if (nextWeek.getFullYear() != weekBeginDate.getFullYear()) {
			overlaps = true;
		}
		return overlaps;
	};

	/**
	* Determines if a given week overlaps two different months.
	* @param {Date}	weekBeginDate	The JavaScript Date representing the first day of the week.
	* @return {Boolean}	true if the date overlaps two different months.
	*/
	this.isMonthOverlapWeek = function(weekBeginDate) {
		var overlaps = false;
		var nextWeek = this.add(weekBeginDate, this.DAY, 6);
		if (nextWeek.getMonth() != weekBeginDate.getMonth()) {
			overlaps = true;
		}
		return overlaps;
	};

	/**
	* Gets the first day of a month containing a given date.
	* @param {Date}	date	The JavaScript Date used to calculate the month start
	* @return {Date}		The JavaScript Date representing the first day of the month
	*/
	this.findMonthStart = function(date) {
		var start = new Date(date.getFullYear(), date.getMonth(), 1);
		return start;
	};

	/**
	* Gets the last day of a month containing a given date.
	* @param {Date}	date	The JavaScript Date used to calculate the month end
	* @return {Date}		The JavaScript Date representing the last day of the month
	*/
	this.findMonthEnd = function(date) {
		var start = this.findMonthStart(date);
		var nextMonth = this.add(start, this.MONTH, 1);
		var end = this.subtract(nextMonth, this.DAY, 1);
		return end;
	};

	/**
	* Clears the time fields from a given date, effectively setting the time to midnight.
	* @param {Date}	date	The JavaScript Date for which the time fields will be cleared
	* @return {Date}		The JavaScript Date cleared of all time fields
	*/
	this.clearTime = function(date) {
		date.setHours(0,0,0,0);
		return date;
	};
}