
			<p>Calendar can be easily configured to prevent users from being able to select dates before and after given minimum and maximum dates. For this tutorial, it is assumed that you are starting with the basic Calendar (outlined in the <a href="../quickstart">Quickstart Tutorial</a>). The setup for the basic Calendar looks like this:</p>

			<textarea name="code" class="JScript" cols="60" rows="1">
				YAHOO.example.calendar.cal1 = new YAHOO.widget.Calendar("cal1","cal1Container");
				YAHOO.example.calendar.cal1.render();
			</textarea>

			<p>Enabling the minimum and maximum date features is as easy as adding additional arguments to the constructor's configuration object. In this tutorial, we will be working with three different configuration properties: <em>pagedate</em>, <em>mindate</em> and <em>maxdate</em>. In brief, here is a description of these properties and what they do:</p>

			<ul class="properties">
				<li><strong>pagedate</strong> - Specifies the month/year of the Calendar's initial view. For example, setting a value of "1/2006" would set the Calendar to January 2006.</li>
				<li><strong>mindate</strong> - Specifies the minimum selectable date for the Calendar. All dates before the minimum date will be grayed out. The value can be specified as a JavaScript Date object or as a string (e.g. "1/25/2007").</li>
				<li><strong>maxdate</strong> - Specifies the maximum selectable date for the Calendar. All dates after the maximum date will be grayed out. The value can be specified as a JavaScript Date object or as a string (e.g. "1/25/2007").</li>
			</ul>

			<p>Of course, you can specify these properties independently for different results. For instance, if you only wanted users to be able to select days following August 2, 2006, you would set the <em>mindate</em> property to "8/2/2006" and no dates prior would be selectable.</p>

			<p>For this example, we will set the current month view to January 2006 using the <em>pagedate</em> property, and we will limit the Calendar's minimum selectable date to January 5, and the maximum selectable date to January 15.</p>

			<textarea name="code" class="JScript" cols="60" rows="1">
				YAHOO.example.calendar.cal1 = new YAHOO.widget.Calendar("cal1","cal1Container", 
																		{ pagedate: "1/2006",
																		  mindate: "1/5/2006",
																		  maxdate: "1/15/2006" }
																		);
				YAHOO.example.calendar.cal1.render();
			</textarea>
