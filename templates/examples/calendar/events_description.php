<h2 class="first">Setting up the Calendar</h2>

<p>Calendar provides several events to which an application can subscribe in order to react easily to changes in the state of the Calendar. The events provided are:</p>

<ul class="properties">
	<li><strong>beforeRenderEvent</strong> - Fired prior to the rendering of the Calendar</li>
	<li><strong>renderEvent</strong> - Fired after the Calendar is rendered</li>
	<li><strong>beforeSelectEvent</strong> - Fired before a selection is made</li>
	<li><strong>selectEvent</strong> - Fired after a date selection is made. This event receives one argument -- an array of dates fields in the format: [[yyyy,mm,dd],[yyyy,mm,dd]]</li>
	<li><strong>beforeDeselectEvent</strong> - Fired before a deselection is made</li>
	<li><strong>deselectEvent</strong> - Fired after dates are deselected. This event receives one argument -- an array of dates fields in the format: [[yyyy,mm,dd],[yyyy,mm,dd]]</li>
	<li><strong>changePageEvent</strong> - Fired when the active Calendar page is changed</li>
	<li><strong>clearEvent</strong> - Fired when the Calendar is cleared. Calling <em>clear</em> on a Calendar removes all of its selections and sets the page to the current month and year.</li>
	<li><strong>resetEvent</strong> - Fired when the Calendar is reset. Calling a Calendar's <em>reset</em> method resets the Calendar to its original view and selection state.</li>
</ul>

<p>The events are each defined by YAHOO.util.CustomEvent, and are subscribed to using the <em>subscribe</em> method of CustomEvent. In this example, we will display a message each time a date is selected or deselected. The <em>selectEvent</em> and <em>deselectEvent</em> events will fire when selections and deselections are made via user interaction (eg, when a user clicks to select a date) or programatically (eg., if a script on the page executes the <em>select</em> method to select a date).</p>
<p>The <code>dateToLocaleString</code> function used to generate the messages demonstrates how you can use the locale configuration properties for Calendar when creating string representations of dates</p>

<textarea name="code" class="HTML" cols="60" rows="1">
                function dateToLocaleString(dt, cal) {
                        var wStr = cal.cfg.getProperty("WEEKDAYS_LONG")[dt.getDay()];
                        var dStr = dt.getDate();
                        var mStr = cal.cfg.getProperty("MONTHS_LONG")[dt.getMonth()];
                        var yStr = dt.getFullYear();
                        return (wStr + ", " + dStr + " " + mStr + " " + yStr);
                }

                function mySelectHandler(type,args,obj) {
                        var selected = args[0];
                        var selDate = this.toDate(selected[0]);

                        logEvent("SELECTED: " + dateToLocaleString(selDate, this));
                };

                function myDeselectHandler(type, args, obj) {
                        var deselected = args[0];
                        var deselDate = this.toDate(deselected[0]);

                        logEvent("DESELECTED: " + dateToLocaleString(deselDate, this));
                };

                YAHOO.example.calendar.cal1 = new YAHOO.widget.Calendar("cal1","cal1Container");

                YAHOO.example.calendar.cal1.selectEvent.subscribe(mySelectHandler, YAHOO.example.calendar.cal1, true);
                YAHOO.example.calendar.cal1.deselectEvent.subscribe(myDeselectHandler, YAHOO.example.calendar.cal1, true);

                YAHOO.example.calendar.cal1.render();
</textarea>
