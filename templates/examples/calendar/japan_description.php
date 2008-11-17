<h2 class="first">Setting up the Calendar</h2>

<p>There are several properties that are used to change localization settings:</p>

<ul class="properties">
	<li><strong>LOCALE_MONTHS</strong> - The setting that determines which length of month labels should be used. Possible values are "short" and "long".</li>
	<li><strong>LOCALE_WEEKDAYS</strong> - The setting that determines which length of weekday labels should be used. Possible values are "1char", "short", "medium", and "long".</li>

	<li><strong>MONTHS_SHORT  </strong> - The short month labels for the current locale. Default: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]</li>
	<li><strong>MONTHS_LONG</strong> - The long month labels for the current locale. Default: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]</li>

	<li><strong>WEEKDAYS_1CHAR</strong> - The 1-character weekday labels for the current locale. Default: ["S", "M", "T", "W", "T", "F", "S"]</li>
	<li><strong>WEEKDAYS_SHORT</strong> - The short weekday labels for the current locale. Default: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]</li>
	<li><strong>WEEKDAYS_MEDIUM</strong> - The medium weekday labels for the current locale. Default: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]</li>
	<li><strong>WEEKDAYS_LONG</strong> - The long weekday labels for the current locale. Default: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]</li>
</ul>

<p>The Calendar also provides special configuration properties for determining how date strings and date range strings should be formatted. </p>
<p>These control how strings are parsed when used as input to the Calendar. By default, the date format for input to the Calendar is mm/dd/yyyy. Ranges are separated by a dash ("-") and lists of dates are delimited using a comma (","). Using these properties, the initial formatting of date can be easily modified:</p>

<ul class="properties">
	<li><strong>DATE_DELIMITER</strong> - The value used to delimit individual dates in a date string passed to various Calendar functions. Default: ","</li>
	<li><strong>DATE_FIELD_DELIMITER</strong> - The value used to delimit date fields in a date string passed to various Calendar functions. Default: "/"</li>
	<li><strong>DATE_RANGE_DELIMITER</strong> - The value used to delimit date ranges in a date string passed to various Calendar functions. Default: "-"</li>

	<li><strong>MDY_MONTH_POSITION</strong> - The position of the month in a month/day/year date string. Default: 1</li>
	<li><strong>MDY_DAY_POSITION</strong> - The position of the day in a month/day/year date string. Default: 2</li>
	<li><strong>MDY_YEAR_POSITION</strong> - The position of the year in a month/day/year date string. Default: 3</li>


	<li><strong>MD_MONTH_POSITION</strong> - The position of the month in a month/day date string. Default: 1</li>
	<li><strong>MD_DAY_POSITION</strong> - The position of the day in a month/day date string. Default: 2</li>

	<li><strong>MY_MONTH_POSITION</strong> - The position of the month in a month/year date string. Default: 1</li>
	<li><strong>MY_YEAR_POSITION</strong> - The position of the year in a month/year date string. Default: 2</li>
</ul>

<p>The following properties are used to format how the month, year label is rendered in the Calendar header:</p>
<ul class="properties">
	<li><strong>MY_LABEL_MONTH_POSITION</strong> - The position of the month in the "month year" date label used in the Calendar header. Default: 1</li>
	<li><strong>MY_LABEL_YEAR_POSITION</strong> - The position of the year in the "month year" date label used in the Calendar header. Default: 2</li>
	<li><strong>MY_LABEL_MONTH_SUFFIX</strong> - The suffix to be added to the month, when rendering the "month year" label in the Calendar header. Default: " "</li>
	<li><strong>MY_LABEL_YEAR_SUFFIX</strong> - The suffix to be added to the year, when rendering the "month year" label in the Calendar header. Default: ""</li>
</ul>

<p>In our tutorial, we will create a Japanese Calendar that is set up both to accept dates in the standard Japanese format (yyyy/mm/dd) and present the labels in Japanese. Note that all of our date label values will contain special characters in Unicode notation. The Calendar header label will be configured to render the year first, followed by the month, with a year character suffix.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
		YAHOO.example.calendar.cal1 = new YAHOO.widget.CalendarGroup("cal1","cal1Container", { START_WEEKDAY: 1, MULTI_SELECT:true } );

		// Correct formats for Japan: yyyy/mm/dd, mm/dd, yyyy/mm

		YAHOO.example.calendar.cal1.cfg.setProperty("MDY_YEAR_POSITION", 1);
		YAHOO.example.calendar.cal1.cfg.setProperty("MDY_MONTH_POSITION", 2);
		YAHOO.example.calendar.cal1.cfg.setProperty("MDY_DAY_POSITION", 3);

		YAHOO.example.calendar.cal1.cfg.setProperty("MY_YEAR_POSITION", 1);
		YAHOO.example.calendar.cal1.cfg.setProperty("MY_MONTH_POSITION", 2);

		// Date labels for Japanese locale

		YAHOO.example.calendar.cal1.cfg.setProperty("MONTHS_SHORT",   ["1\u6708", "2\u6708", "3\u6708", "4\u6708", "5\u6708", "6\u6708", "7\u6708", "8\u6708", "9\u6708", "10\u6708", "11\u6708", "12\u6708"]);
		YAHOO.example.calendar.cal1.cfg.setProperty("MONTHS_LONG",    ["1\u6708", "2\u6708", "3\u6708", "4\u6708", "5\u6708", "6\u6708", "7\u6708", "8\u6708", "9\u6708", "10\u6708", "11\u6708", "12\u6708"]);
		YAHOO.example.calendar.cal1.cfg.setProperty("WEEKDAYS_1CHAR", ["\u65E5", "\u6708", "\u706B", "\u6C34", "\u6728", "\u91D1", "\u571F"]);
		YAHOO.example.calendar.cal1.cfg.setProperty("WEEKDAYS_SHORT", ["\u65E5", "\u6708", "\u706B", "\u6C34", "\u6728", "\u91D1", "\u571F"]);
		YAHOO.example.calendar.cal1.cfg.setProperty("WEEKDAYS_MEDIUM",["\u65E5", "\u6708", "\u706B", "\u6C34", "\u6728", "\u91D1", "\u571F"]);
		YAHOO.example.calendar.cal1.cfg.setProperty("WEEKDAYS_LONG",  ["\u65E5", "\u6708", "\u706B", "\u6C34", "\u6728", "\u91D1", "\u571F"]);

		YAHOO.example.calendar.cal1.cfg.setProperty("MY_LABEL_YEAR_POSITION",  1);
		YAHOO.example.calendar.cal1.cfg.setProperty("MY_LABEL_MONTH_POSITION",  2);
		YAHOO.example.calendar.cal1.cfg.setProperty("MY_LABEL_YEAR_SUFFIX",  "\u5E74");
		YAHOO.example.calendar.cal1.cfg.setProperty("MY_LABEL_MONTH_SUFFIX",  "");
</textarea>

<p>Next, we can set some selected dates using our newly configured date format, and render the Calendar:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
		YAHOO.example.calendar.cal1.select("2006/10/1-2006/10/8");
		YAHOO.example.calendar.cal1.render();
</textarea>
