
			<p>In this example, we will build a Calendar that can accept selections on any date from 1/1/2006 to 12/31/2008, and we will set up a text field that will be updated whenever the Calendar's selected date is changed. In addition, we will provide a button that can be used to update the Calendar with whatever date the user types into a text field provided on the page. Note that this example requires the dependencies outlined in the <a href="../quickstart">Quickstart Tutorial</a>. First, we will construct the Calendar with the minimum and maximum dates specified:</p>
			
			<textarea name="code" class="JScript" cols="60" rows="1">
					YAHOO.example.calendar.cal1 = new YAHOO.widget.Calendar("cal1","cal1Container", 
																				{ mindate:"1/1/2006",
																				  maxdate:"12/31/2008" });
			</textarea>

			<p>Next, we will place our markup, which includes a standard container for the Calendar, and the form with a text field and button:</p>

			<textarea name="code" class="HTML" cols="60" rows="1">
				<div id="cal1Container"></div>

				<form name="dates">
					<input type="text" name="date1" id="date1" />
					<button type="button" id="update">&lt; Update Calendar</button>
				</form>
			</textarea>

			<p>Now, we must define a handler that will fire when the user changes the selected date on the Calendar. This function will be named <em>handleSelect</em>, and will be subscribed to the Calendar's <em>selectEvent</em>:</p>

			<textarea name="code" class="JScript" cols="60" rows="1">
				function handleSelect(type,args,obj) {
					var dates = args[0]; 
					var date = dates[0];
					var year = date[0], month = date[1], day = date[2];
					
					var txtDate1 = document.getElementById("date1");
					txtDate1.value = month + "/" + day + "/" + year;
				}

				...

				YAHOO.example.calendar.cal1.selectEvent.subscribe(handleSelect, YAHOO.example.calendar.cal1, true);
			</textarea>

			<p>The <em>handleSelect</em> function receives an array of selected dates as an argument. Since this Calendar is only single-select, we will only need to retrieve the first (and only) item in the array. The date argument is passed as an easily sorted Integer array in the format: [yyyy, mm, dd]. The <em>handleSelect</em> function takes these values and prints them into a text field which we will define in a later step. Note that it's also necessary to subscribe the function to the <em>selectEvent</em> on the Calendar so that it will be fired when a selection is made.</p>

			<p>Next, we will define a function called <em>updateCal</em>, which will be used to update the Calendar with the value that is typed into the text field. This function will be called via a button that will be created in our markup a little later.</p>

			<textarea name="code" class="JScript" cols="60" rows="1">
				function updateCal() {
					var txtDate1 = document.getElementById("date1");

					// Select the date typed in the field
					YAHOO.example.calendar.cal1.select(txtDate1.value); 
					
					var firstDate = YAHOO.example.calendar.cal1.getSelectedDates()[0];
					
					// Set the Calendar's page to the earliest selected date
					YAHOO.example.calendar.cal1.cfg.setProperty("pagedate", (firstDate.getMonth()+1) + "/" + firstDate.getFullYear()); 
					
					YAHOO.example.calendar.cal1.render();
				}
			</textarea>

			<p>The <em>updateCal</em> function does two key things. First, it grabs the value from the text field and uses it to make a new selection on the Calendar. Next, it changes the visible page of the Calendar to the Calendar's earliest selected date, so that the selection will be clear to the user.</p>


