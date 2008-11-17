<div id="cal1Container"></div>

<form name="dates" id="dates">
	<input type="text" name="date1" id="date1" />
	<button type="button" id="update">Update Calendar</button>
</form>

<script type="text/javascript">
	YAHOO.namespace("example.calendar");

	YAHOO.example.calendar.init = function() {

		function handleSelect(type,args,obj) {
			var dates = args[0]; 
			var date = dates[0];
			var year = date[0], month = date[1], day = date[2];
			
			var txtDate1 = document.getElementById("date1");
			txtDate1.value = month + "/" + day + "/" + year;
		}

		function updateCal() {
			var txtDate1 = document.getElementById("date1");

			if (txtDate1.value != "") {
				YAHOO.example.calendar.cal1.select(txtDate1.value);
				var selectedDates = YAHOO.example.calendar.cal1.getSelectedDates();
				if (selectedDates.length > 0) {
					var firstDate = selectedDates[0];
					YAHOO.example.calendar.cal1.cfg.setProperty("pagedate", (firstDate.getMonth()+1) + "/" + firstDate.getFullYear());
					YAHOO.example.calendar.cal1.render();
				} else {
					alert("Cannot select a date before 1/1/2006 or after 12/31/2008");
				}
				
			}
		}

		// For this example page, stop the Form from being submitted, and update the cal instead
		function handleSubmit(e) {
			updateCal();
			YAHOO.util.Event.preventDefault(e);
		}
		
		YAHOO.example.calendar.cal1 = new YAHOO.widget.Calendar("cal1","cal1Container", 
																	{ mindate:"1/1/2006",
																	  maxdate:"12/31/2008" });
		YAHOO.example.calendar.cal1.selectEvent.subscribe(handleSelect, YAHOO.example.calendar.cal1, true);
		YAHOO.example.calendar.cal1.render();

		YAHOO.util.Event.addListener("update", "click", updateCal);
		YAHOO.util.Event.addListener("dates", "submit", handleSubmit);
	}

	YAHOO.util.Event.onDOMReady(YAHOO.example.calendar.init);
</script>

<div style="clear:both" ></div>
