<div id="cal1Container"></div>

<script type="text/javascript">
	YAHOO.namespace("example.calendar");

	YAHOO.example.calendar.init = function() {
		YAHOO.example.calendar.cal1 = new YAHOO.widget.CalendarGroup("cal1","cal1Container", {PAGES:3});
		YAHOO.example.calendar.cal1.render();
	}

	YAHOO.util.Event.onDOMReady(YAHOO.example.calendar.init);
</script>

<div style="clear:both"></div>
