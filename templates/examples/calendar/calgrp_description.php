<h2 class="first">Setting up the Calendar</h2>

<p>
Having included the necessary script files and placed the requisite markup on the page, we can easily invoke a multi page Calendar by creating a CalendarGroup (see line 5 below).
In our previous examples, we've instantiated Calendar to show a single calendar month, whereas the CalendarGroup allows us to specify an n-month display.
</p>

<p>The only notable difference, illustrated in the code block below, is the use of the CalendarGroup class when instantiating the Calendar:</p>

<p>
By default, a CalendarGroup instance will show two months at a time but it can be configured to show more than two months by specifying the number of pages using the <em>pages</em> configuration property. In the example below, we'll set it to 3. When specifying the pages property, it should be the first property in the configuration object passed to the CalendarGroup constructor.
</p>

<textarea name="code" class="JScript" cols="60" rows="1">
<script>
	YAHOO.namespace("example.calendar");

	YAHOO.example.calendar.init = function() {
		YAHOO.example.calendar.cal1 = new YAHOO.widget.CalendarGroup("cal1","cal1Container", {PAGES:3});
		YAHOO.example.calendar.cal1.render();
	}

	YAHOO.util.Event.onDOMReady(YAHOO.example.calendar.init);
</script>
</textarea>

