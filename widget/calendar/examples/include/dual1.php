			<p>Calendar can be displayed in a two-page format by using the CalendarGroup class. The dependencies (the <a href="http://developer.yahoo.com/yui/yahoo/">YAHOO Global object</a>, the <a href="http://developer.yahoo.com/yui/event/">Event Utility</a>, and the <a href="http://developer.yahoo.com/yui/dom/">DOM Collection</a>) and markup structure are identical to the basic Calendar (outlined in the <a href="../quickstart">Quickstart Tutorial</a>).</p>
			
			<p>Having included the necessary script files and placed the requisite markup on the page, we can easily invoke a Dual Calendar display by creating a CalendarGroup instance (see line 5 below); in our previous examples, we've instantiated Calendar to show a single calendar month.  CalendarGroup allows us to specify a n-month display.  By default, a CalendarGroup instance will show two months at a time.</p>

			<p>The only notable difference, illustrated in the code block below, is the use of the CalendarGroup class when instantiating the Calendar:</p>

			<textarea name="code" class="JScript" cols="60" rows="1">
				<script>
						YAHOO.namespace("example.calendar");

						function init() {
							YAHOO.example.calendar.cal1 = new YAHOO.widget.CalendarGroup("cal1","cal1Container");
							YAHOO.example.calendar.cal1.render();
						}

						YAHOO.util.Event.addListener(window, "load", init);
				</script>
			</textarea>
