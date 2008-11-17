<p>
Begin by defining an anonymous function in order to keep all variables out of the global scope. 
Inside the anonymous function, define some shortcuts to utils that will be used frequently (Dom and 
Event).
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
(function () {

	var Event = YAHOO.util.Event,
		Dom = YAHOO.util.Dom;
			
}());			
</textarea>

<p>
Inside the the anonymous function, use the <code>onDOMReady</code> method of the Event utility to 
instantiate an Overlay and a Button when the page's DOM is ready to be scripted.
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
Event.onDOMReady(function () {

	var oCalendarMenu;
	
	// Create an Overlay instance to house the Calendar instance

	oCalendarMenu = new YAHOO.widget.Overlay("calendarmenu", { visible: false });


	// Create a Button instance of type "menu"

	var oButton = new YAHOO.widget.Button({ 
										type: "menu", 
										id: "calendarpicker", 
										label: "Choose A Date", 
										menu: oCalendarMenu, 
										container: "datefields" });

});
</textarea>

<p>
Once the new Button is created, add a listener for its "appendTo" event that 
will be used to render its Overlay instance into the same DOM element specified as the 
containing element for the Button.
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
oButton.on("appendTo", function () {

	// Create an empty body element for the Overlay instance in order 
	// to reserve space to render the Calendar instance into.

	oCalendarMenu.setBody("&#32;");

	oCalendarMenu.body.id = "calendarcontainer";

});
</textarea>

<p>
Add a listener for the Button's "click" event that will be used to create a 
new Calendar instance.  (Defering the creation and rendering of the Calendar until the firing of 
the "click" event improves the intial load time of the Button instance.)
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
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
/*
	Add a "click" event listener that will render the Overlay, and 
	instantiate the Calendar the first time the Button instance is 
	clicked.
*/

oButton.on("click", onButtonClick);
</textarea>
<p>
Lastly, style the Button with a calendar icon.
</p>
<textarea name="code" class="CSS" cols="60" rows="1">
#calendarpicker button {

    background: url(../button/assets/calendar_icon.gif) center center no-repeat;
    text-align: left;
    text-indent: -10em;
    overflow: hidden;
    *margin-left: 10em; /* For IE */
    *padding: 0 3em;    /* For IE */
    white-space: nowrap;

}
</textarea>