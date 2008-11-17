<script type="text/javascript">

	(function () {
	
		var Event = YAHOO.util.Event,
			Dom = YAHOO.util.Dom;


		Event.onDOMReady(function () {
	
			var oCalendarMenu;
	
			var onButtonClick = function () {
				
				// Create a Calendar instance and render it into the body 
				// element of the Overlay.
	
				var oCalendar = new YAHOO.widget.Calendar("buttoncalendar", oCalendarMenu.body.id);
	
				oCalendar.render();
	
	
				// Subscribe to the Calendar instance's "select" event to 
				// update the month, day, year form fields when the user
				// selects a date.
	
				oCalendar.selectEvent.subscribe(function (p_sType, p_aArgs) {
	
					var aDate;
	
					if (p_aArgs) {
							
						aDate = p_aArgs[0][0];
							
						Dom.get("month-field").value = aDate[1];
						Dom.get("day-field").value = aDate[2];
						Dom.get("year-field").value = aDate[0];
	
					}
					
					oCalendarMenu.hide();
				
				});
	
	
				// Pressing the Esc key will hide the Calendar Menu and send focus back to 
				// its parent Button
	
				Event.on(oCalendarMenu.element, "keydown", function (p_oEvent) {
				
					if (Event.getCharCode(p_oEvent) === 27) {
						oCalendarMenu.hide();
						this.focus();
					}
				
				}, null, this);
				
				
				var focusDay = function () {

					var oCalendarTBody = Dom.get("buttoncalendar").tBodies[0],
						aElements = oCalendarTBody.getElementsByTagName("a"),
						oAnchor;

					
					if (aElements.length > 0) {
					
						Dom.batch(aElements, function (element) {
						
							if (Dom.hasClass(element.parentNode, "today")) {
								oAnchor = element;
							}
						
						});
						
						
						if (!oAnchor) {
							oAnchor = aElements[0];
						}


						// Focus the anchor element using a timer since Calendar will try 
						// to set focus to its next button by default
						
						YAHOO.lang.later(0, oAnchor, function () {
							try {
								oAnchor.focus();
							}
							catch(e) {}
						});
					
					}
					
				};


				// Set focus to either the current day, or first day of the month in 
				// the Calendar	when it is made visible or the month changes
	
				oCalendarMenu.subscribe("show", focusDay);
				oCalendar.renderEvent.subscribe(focusDay, oCalendar, true);
	

				// Give the Calendar an initial focus
				
				focusDay.call(oCalendar);
	
	
				// Re-align the CalendarMenu to the Button to ensure that it is in the correct
				// position when it is initial made visible
				
				oCalendarMenu.align();
				
	
				// Unsubscribe from the "click" event so that this code is 
				// only executed once
	
				this.unsubscribe("click", onButtonClick);
			
			};
	
	
			// Create an Overlay instance to house the Calendar instance
	
			oCalendarMenu = new YAHOO.widget.Overlay("calendarmenu", { visible: false });
	
	
			// Create a Button instance of type "menu"
	
			var oButton = new YAHOO.widget.Button({ 
												type: "menu", 
												id: "calendarpicker", 
												label: "Choose A Date", 
												menu: oCalendarMenu, 
												container: "datefields" });
	
	
			oButton.on("appendTo", function () {
	
				// Create an empty body element for the Overlay instance in order 
				// to reserve space to render the Calendar instance into.
		
				oCalendarMenu.setBody("&#32;");
		
				oCalendarMenu.body.id = "calendarcontainer";
			
			});
			
	
			// Add a "click" event listener that will render the Overlay, and 
			// instantiate the Calendar the first time the Button instance is 
			// clicked.
	
			oButton.on("click", onButtonClick);
		
		});	

	}());

</script>

<div>

    <form id="button-example-form" name="button-example-form" method="post">
    
        <fieldset id="datefields">
    
            <legend>Date</legend>
    
            <label for="month-field">Month: </label> <input id="month-field" type="text" name="month">
            <label for="day-field">Day:</label> <input id="day-field" type="text" name="day">
            <label for="year-field">Year: </label> <input id="year-field" type="text" name="year">
    
        </fieldset>
    
    </form>

</div>