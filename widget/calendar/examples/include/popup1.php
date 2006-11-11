
			<p>Calendar can be positioned absolutely to make it float above the document, and it provides a few extra configuration properties specifically geared towards applying it in this way. Those properties are: </p>
			
			<ul class="properties">
				<li><strong>close</strong> - Indicates whether or not a close icon should be displayed in the Calendar. Defaults to false.</li>
				<li><strong>iframe</strong> - Indicates whether or not an IFRAME shim should be placed under the Calendar to avoid the bleed-through of "select" elements in IE6 and below. Defaults to true for IE6 and below, when the Calendar is positioned absolutely or relatively.</li>
			</ul>

			<p>In addition, the Calendar provides <em>show</em> and <em>hide</em> methods for displaying the Calendar or hiding it from view. This is achieved by setting the Calendar's outer container to <em>display:none</em>.</p>

			<p>In this tutorial, we will create a Calendar and a CalendarGroup which can be displayed by clicking a corresponding button. First, the Calendar and CalendarGroup are instantiated using some of the new properties that were introduced in this tutorial.</p>

			<textarea name="code" class="JScript" cols="60" rows="1">
				YAHOO.example.calendar.cal1 = new YAHOO.widget.CalendarGroup("cal1","cal1Container", { pages:3, title:"Please make a selection:", close:true } );
				YAHOO.example.calendar.cal1.render();

				// Listener to show the 3-up Calendar when the button is clicked
				YAHOO.util.Event.addListener("show3up", "click", YAHOO.example.calendar.cal1.show, YAHOO.example.calendar.cal1, true);

				YAHOO.example.calendar.cal2 = new YAHOO.widget.Calendar("cal2","cal2Container", { title:"Choose a date:", close:true } );
				YAHOO.example.calendar.cal2.render();

				// Listener to show the 1-up Calendar when the button is clicked
				YAHOO.util.Event.addListener("show1up", "click", YAHOO.example.calendar.cal2.show, YAHOO.example.calendar.cal2, true);
			</textarea>

			<p>Next, we place the markup for the buttons that will invoke the Calendar and CalendarGroup, along with the container div elements that are required for each.</p>

			<textarea name="code" class="HTML" cols="60" rows="1">
				<button id="show3up">Show a 3-up Calendar</button>
				<div id="cal1Container"></div>

				<button id="show1up">Show a Single Calendar</button>
				<div id="cal2Container"></div>
			</textarea>
