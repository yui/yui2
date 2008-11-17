<div id="examplecontainer">
    <button id="show2up" type="button">Show CalendarGroup</button>
    <div id="cal1Container"></div>

    <button id="show1up" type="button">Show Calendar</button>
    <div id="cal2Container"></div>
</div>

<script type="text/javascript">
	YAHOO.namespace("example.calendar");

	YAHOO.example.calendar.init = function() {

		YAHOO.example.calendar.cal1 = new YAHOO.widget.CalendarGroup("cal1","cal1Container", { pages:2, title:"Please make a selection:", close:true } );
		YAHOO.example.calendar.cal1.render();

		// Listener to show the 2 page Calendar when the button is clicked
		YAHOO.util.Event.addListener("show2up", "click", YAHOO.example.calendar.cal1.show, YAHOO.example.calendar.cal1, true);

		YAHOO.example.calendar.cal2 = new YAHOO.widget.Calendar("cal2","cal2Container", { title:"Choose a date:", close:true } );
		YAHOO.example.calendar.cal2.render();

		// Listener to show the 1-up Calendar when the button is clicked
		YAHOO.util.Event.addListener("show1up", "click", YAHOO.example.calendar.cal2.show, YAHOO.example.calendar.cal2, true);
	}

	YAHOO.util.Event.onDOMReady(YAHOO.example.calendar.init);
</script>
