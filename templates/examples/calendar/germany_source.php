<div id="cal1Container"></div>

<script type="text/javascript">
	YAHOO.namespace("example.calendar");

	YAHOO.example.calendar.init = function() {
		YAHOO.example.calendar.cal1 = new YAHOO.widget.Calendar("cal1","cal1Container", 
																	{ LOCALE_WEEKDAYS:"short", 
																	  START_WEEKDAY: 1,
																	  MULTI_SELECT: true
																	 } );

		// Correct formats for Germany: dd.mm.yyyy, dd.mm, mm.yyyy

		YAHOO.example.calendar.cal1.cfg.setProperty("DATE_FIELD_DELIMITER", ".");

		YAHOO.example.calendar.cal1.cfg.setProperty("MDY_DAY_POSITION", 1);
		YAHOO.example.calendar.cal1.cfg.setProperty("MDY_MONTH_POSITION", 2);
		YAHOO.example.calendar.cal1.cfg.setProperty("MDY_YEAR_POSITION", 3);

		YAHOO.example.calendar.cal1.cfg.setProperty("MD_DAY_POSITION", 1);
		YAHOO.example.calendar.cal1.cfg.setProperty("MD_MONTH_POSITION", 2);
		
		// Date labels for German locale

		YAHOO.example.calendar.cal1.cfg.setProperty("MONTHS_SHORT",   ["Jan", "Feb", "M\u00E4r", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]);
		YAHOO.example.calendar.cal1.cfg.setProperty("MONTHS_LONG",    ["Januar", "Februar", "M\u00E4rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]);
		YAHOO.example.calendar.cal1.cfg.setProperty("WEEKDAYS_1CHAR", ["S", "M", "D", "M", "D", "F", "S"]);
		YAHOO.example.calendar.cal1.cfg.setProperty("WEEKDAYS_SHORT", ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]);
		YAHOO.example.calendar.cal1.cfg.setProperty("WEEKDAYS_MEDIUM",["Son", "Mon", "Die", "Mit", "Don", "Fre", "Sam"]);
		YAHOO.example.calendar.cal1.cfg.setProperty("WEEKDAYS_LONG",  ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"]);

		YAHOO.example.calendar.cal1.select("1.10.2006-8.10.2006");
		YAHOO.example.calendar.cal1.cfg.setProperty("PAGEDATE", "10.2006");
		YAHOO.example.calendar.cal1.render();
	}

	YAHOO.util.Event.onDOMReady(YAHOO.example.calendar.init);
</script>

<div style="clear:both" ></div>
