<h2 class="first">Setting up the Calendar</h2>

<p>In this example, we will build a Calendar that can accept selections on any date from 1/1/2006 to 12/31/2008, and we will set up a series of select boxes that can be used to change the selected date. First, we will construct the Calendar with the minimum and maximum dates specified:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
		YAHOO.example.calendar.cal1 = new YAHOO.widget.Calendar("cal1","cal1Container",
																	{ mindate:"1/1/2006",
																	  maxdate:"12/31/2008" });
</textarea>

<p>Next, we will place our markup, which includes a standard container for the Calendar, and the select elements needed to change the date:</p>

<textarea name="code" class="HTML" cols="60" rows="1">
	<div id="cal1Container"></div>

	<form name="dates">
		<select id="selMonth" name="selMonth">
			...
		</select>

		<select name="selDay" id="selDay">
			...
		</select>

		<select name="selYear" id="selYear">
			...
		</select>
	</form>
</textarea>


<p>Next, we must define a handler that will fire when the user changes the selected date on the Calendar. This function will be named <em>handleSelect</em>, and will be subscribed to the Calendar's <em>selectEvent</em>:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
	function handleSelect(type,args,obj) {
		var dates = args[0];
		var date = dates[0];
		var year = date[0], month = date[1], day = date[2];

		var selMonth = document.getElementById("selMonth");
		var selDay = document.getElementById("selDay");
		var selYear = document.getElementById("selYear");

		selMonth.selectedIndex = month;
		selDay.selectedIndex = day;

		for (var y=0;y<selYear.options.length;y++) {
			if (selYear.options[y].text == year) {
				selYear.selectedIndex = y;
				break;
			}
		}
	}

	...

	YAHOO.example.calendar.cal1.selectEvent.subscribe(handleSelect, YAHOO.example.calendar.cal1, true);
</textarea>

<p>The <em>handleSelect</em> function receives an array of selected dates as an argument. Since this Calendar is only single-select, we will only need to retrieve the first (and only) item in the array. The date argument is passed as an easily sorted Integer array in the format: [yyyy, mm, dd]. The <em>handleSelect</em> function uses this array to properly select the corresponding values in each select field. Note that it's also necessary to subscribe the function to the <em>selectEvent</em> on the Calendar so that it will be fired when a selection is made.</p>

<p>Next, we will define a function called <em>updateCal</em>, which will be used to update the Calendar with the field values that are selected in each select field:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
	function updateCal() {
		var selMonth = document.getElementById("selMonth");
		var selDay = document.getElementById("selDay");
		var selYear = document.getElementById("selYear");

		var month = parseInt(selMonth.options[selMonth.selectedIndex].text);
		var day = parseInt(selDay.options[selDay.selectedIndex].value);
		var year = parseInt(selYear.options[selYear.selectedIndex].value);

		if (! isNaN(month) && ! isNaN(day) && ! isNaN(year)) {
			var date = month + "/" + day + "/" + year;

			YAHOO.example.calendar.cal1.select(date);
			YAHOO.example.calendar.cal1.cfg.setProperty("pagedate", month + "/" + year);
			YAHOO.example.calendar.cal1.render();
		}
	}
</textarea>

<p>The <em>updateCal</em> function does two key things. First, it grabs the selected values from the select fields and uses them to make a new selection on the Calendar. Next, it changes the visible page of the Calendar to the Calendar's earliest selected date, so that the selection will be clear to the user. We can wire up the select fields to call <em>updateCal</em> when selections are made using the Event utility. In our example, we will do this after initializing the Calendar:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
	YAHOO.util.Event.addListener(["selMonth","selDay","selYear"], "change", updateCal);
</textarea>

<p>It's worth noting that this example doesn't cover advanced features like date validation or randomly changing the selectable days based on the day of the month, so you are able to select invalid dates like February 31. Calendar automatically attempts to compensate for the extra invalid dates by moving the selection forward into the next month.</p>
