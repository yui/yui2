<div id="cal1Container"></div>

<script type="text/javascript">
	YAHOO.namespace("example.calendar");

	YAHOO.example.calendar.init = function() {
		YAHOO.example.calendar.cal1 = new YAHOO.widget.CalendarGroup("cal1","cal1Container", 
																	 { pagedate:"2/2008" } );

		YAHOO.example.calendar.cal1.addRenderer("2/29", YAHOO.example.calendar.cal1.renderBodyCellRestricted);
		YAHOO.example.calendar.cal1.addRenderer("2/1/2008-2/7/2008", YAHOO.example.calendar.cal1.renderCellStyleHighlight1);

		var myCustomRenderer = function(workingDate, cell) {
			cell.innerHTML = "X";
			YAHOO.util.Dom.addClass(cell, "sunday");
			return YAHOO.widget.Calendar.STOP_RENDER;
		}
		YAHOO.example.calendar.cal1.addWeekdayRenderer(1, myCustomRenderer);

		YAHOO.example.calendar.cal1.render();
	}

	YAHOO.util.Event.onDOMReady(YAHOO.example.calendar.init);
</script>

<div style="clear:both" ></div>
