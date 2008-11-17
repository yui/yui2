<div id="cal1Container"></div>

<script type="text/javascript">
	YAHOO.namespace("example.calendar");

	YAHOO.example.calendar.init = function() {
		YAHOO.example.calendar.cal1 = new YAHOO.widget.Calendar("cal1","cal1Container", { title:"My Calendar", close:true } );
		YAHOO.example.calendar.cal1.render();
	}

	YAHOO.util.Event.onDOMReady(YAHOO.example.calendar.init);
</script>
