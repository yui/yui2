<div id="cal1Container"></div>

<script type="text/javascript">
	YAHOO.namespace("example.calendar");

	YAHOO.example.calendar.init = function() {
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

		// Month/Year label format for Japan
                YAHOO.example.calendar.cal1.cfg.setProperty("MY_LABEL_YEAR_POSITION",  1);
                YAHOO.example.calendar.cal1.cfg.setProperty("MY_LABEL_MONTH_POSITION",  2);
                YAHOO.example.calendar.cal1.cfg.setProperty("MY_LABEL_YEAR_SUFFIX",  "\u5E74");
                YAHOO.example.calendar.cal1.cfg.setProperty("MY_LABEL_MONTH_SUFFIX",  "");

		YAHOO.example.calendar.cal1.select("2006/10/1-2006/10/8");
		YAHOO.example.calendar.cal1.render();
	}

	YAHOO.util.Event.onDOMReady(YAHOO.example.calendar.init);
</script>

<div style="clear:both" ></div>
