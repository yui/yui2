<div id="cal1Container"></div>

<script type="text/javascript">
	YAHOO.namespace("example.calendar");

	YAHOO.example.calendar.init = function() {
		YAHOO.example.calendar.cal1 = new YAHOO.widget.Calendar("cal1","cal1Container", 
																{ pagedate : "1/2008",
																  mindate: "1/5/2008",
																  maxdate: "1/15/2008" }
																);
		YAHOO.example.calendar.cal1.render();
	}

	YAHOO.util.Event.onDOMReady(YAHOO.example.calendar.init);
</script>

<div style="clear:both" ></div>
