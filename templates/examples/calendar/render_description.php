<h2 class="first">Setting up the Calendar</h2>

<p>In this tutorial, we will create a Calendar that makes use of the built-in renderers, and we will also create one of our own.</p>

<p>The built-in renderers available are:</p>

<ul class="properties">
	<li><strong>renderCellDefault</strong> - Places a clickable link in the date cell</li>
	<li><strong>renderBodyCellRestricted</strong> - Renders a text=only cell with the "restricted" style</li>
	<li><strong>renderOutOfBoundsDate</strong> - Renders an out-of-bounds date (beyond the specified min/max dates)</li>
	<li><strong>renderCellNotThisMonth</strong> - Renders a cell that is displayed in the current page, but precedes or follows the current month</li>
	<li><strong>renderCellStyleToday</strong> - Renders the cell representing today's date</li>
	<li><strong>renderCellStyleSelected</strong> - Renders a selected cell</li>
	<li><strong>renderCellStyleHighlight1</strong> - Adds the "highlight1" class to the date cell</li>
	<li><strong>renderCellStyleHighlight2</strong> - Adds the "highlight2" class to the date cell</li>
	<li><strong>renderCellStyleHighlight3</strong> - Adds the "highlight3" class to the date cell</li>
	<li><strong>renderCellStyleHighlight4</strong> - Adds the "highlight4" class to the date cell</li>
</ul>

<p>To begin, we will instantiate a new Calendar and apply the restricted renderer to 2/29 of any year, and the "highlight1" style to the range of dates between 2/1/2008 and 2/7/2008.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
		YAHOO.example.calendar.cal1 = new YAHOO.widget.CalendarGroup("cal1","cal1Container",
																	 { pagedate:"2/2008" } );

		YAHOO.example.calendar.cal1.addRenderer("2/29", YAHOO.example.calendar.cal1.renderBodyCellRestricted);
		YAHOO.example.calendar.cal1.addRenderer("2/1/2008-2/7/2008", YAHOO.example.calendar.cal1.renderCellStyleHighlight1);
</textarea>


<p>Next, we will create a custom renderer that will place an "X" in the cell for every Sunday, and style it in a dark gray color. In order to specify that our renderer should override the default renderer (renderCellDefault), the custom function must return YAHOO.widget.Calendar.STOP_RENDER. This tells the Calendar to ignore the rest of the Render Stack and continue rendering the rest of the Calendar.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
		var myCustomRenderer = function(workingDate, cell) {
			cell.innerHTML = "X";
			YAHOO.util.Dom.addClass(cell, "sunday");
			return YAHOO.widget.Calendar.STOP_RENDER;
		}
		YAHOO.example.calendar.cal1.addWeekdayRenderer(1, myCustomRenderer);
</textarea>
