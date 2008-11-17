<h2 class="first">Setting up the Calendar</h2>

<p>In order to support a popup style Calendar which floats above other content on the page, Calendar provides a few extra configuration properties specifically geared towards popup Calendars. Those properties are: </p>

<ul class="properties">
	<li><strong>close</strong> - Indicates whether or not a close icon should be displayed in the Calendar. Defaults to false.</li>
	<li><strong>iframe</strong> - Indicates whether or not an IFRAME shim should be placed under the Calendar to avoid the bleed-through of "select" elements in IE6 and below. Defaults to true for IE6 and below, when the Calendar is positioned absolutely or relatively.</li>
</ul>

<p>In addition, the Calendar provides <em>show</em> and <em>hide</em> methods for displaying the Calendar or hiding it from view. This is achieved by setting the Calendar's outer container to <em>display:none</em>.</p>

<p>In this tutorial, we will create a Calendar and a CalendarGroup which can be displayed by clicking a corresponding button. First, the Calendar and CalendarGroup are instantiated using some of the new properties that were introduced in this tutorial.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
	YAHOO.example.calendar.cal1 = new YAHOO.widget.CalendarGroup("cal1","cal1Container", { pages:2, title:"Please make a selection:", close:true } );
	YAHOO.example.calendar.cal1.render();

	// Listener to show the two page Calendar when the button is clicked
	YAHOO.util.Event.addListener("show2up", "click", YAHOO.example.calendar.cal1.show, YAHOO.example.calendar.cal1, true);

	YAHOO.example.calendar.cal2 = new YAHOO.widget.Calendar("cal2","cal2Container", { title:"Choose a date:", close:true } );
	YAHOO.example.calendar.cal2.render();

	// Listener to show the single page Calendar when the button is clicked
	YAHOO.util.Event.addListener("show1up", "click", YAHOO.example.calendar.cal2.show, YAHOO.example.calendar.cal2, true);
</textarea>

<p>Next, we place the markup for the buttons that will invoke the Calendar and CalendarGroup, along with the container div elements that are required for each.</p>

<textarea name="code" class="HTML" cols="60" rows="1">
	<button id="show2up" type="button">Show CalendarGroup</button>
	<div id="cal1Container"></div>

	<button id="show1up" type="button">Show Calendar</button>
	<div id="cal2Container"></div>
</textarea>

<p>Using CSS, the calendar containers are positioned absolutely to place them above other content in the document and given a z-index so that the order in which they are stacked is defined explicitly if they're rendered on top of each other (we'll place the CalendarGroup above the single page Calendar).</p>

<textarea name="code" class="HTML" cols="60" rows="1">
	#cal1Container { display:none; position:absolute; left:10px; top:10px; z-index:2}
	#cal2Container { display:none; position:absolute; left:10px; top:300px; z-index:1}
</textarea>
