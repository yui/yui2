<h2 class="first">The Interval Selection Calendar</h2>

<p>The <code>IntervalCalendar</code> class, defined in this example, allows users to select pairs of dates representing the start and end of a date interval. Applications which require interval selection, for example a hotel check-in/check-out date selector, frequently display separate calendar instances to select the beginning and ending dates of the interval. The IntervalCalendar provides an alternate solution, by allowing the selection of both dates within the same calendar instance. It's most suitable for applications in which the beginning and ending dates fall within the span of a few days, so that the entire range falls within the calendar's visible set of months.</p>

<h3>The <code>IntervalCalendar</code> Class</h3>

<p>The <code>IntervalCalendar</code> class extends the <code>CalendarGroup</code> class, so that it can support a multi-page view. A two page view would probably be the most common use case for the Interval Calendar.</p>

<p>We start by defining the constructor for the <code>IntervalCalendar</code> class:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
    function IntervalCalendar(container, cfg) {
        /**
         * The interval state, which counts the number of interval endpoints that have
         * been selected (0 to 2).
         */
        this._iState = 0;

        // Must be a multi-select CalendarGroup
        cfg = cfg || {};
        cfg.multi_select = true;

        // Call parent constructor
        IntervalCalendar.superclass.constructor.call(this, container, cfg);

        // Subscribe internal event handlers
        this.beforeSelectEvent.subscribe(this._intervalOnBeforeSelect, this, true);
        this.selectEvent.subscribe(this._intervalOnSelect, this, true);
        this.beforeDeselectEvent.subscribe(this._intervalOnBeforeDeselect, this, true);
        this.deselectEvent.subscribe(this._intervalOnDeselect, this, true);
    }

    YAHOO.lang.extend(IntervalCalendar, YAHOO.widget.CalendarGroup, {
        ...
    });
</textarea>

<p>By default Calendar and CalendarGroup are designed to allow open ended selection of dates, which don't neccessarily need to form a continuous date range. However the Interval Calendar needs to constrain the selection behavior, to limit selection to a maximum of two date values - the beginning and ending dates for the interval. The Interval Calendar enforces the interval selection state, using two main code constructs; the <code>_iState</code> property and a set of event listeners for CalendarGroup's selection related events - <code>beforeSelect</code>, <code>select</code>, <code>beforeDeselect</code> and <code>deselect</code>.</p>

<h4>The <code>_iState</code> Property</h4>

<p>The <code>_iState</code> property is used to determine which of 3 "modes" Interval Calendar date selection is currently in - no dates selected, one date selected or two dates selected. Since internally, CalendarGroup maintains an array for all of its selected dates (that is, the start date, the end date and any dates in between), the Interval Calendar does not rely on the length of the <code>"selected"</code> dates array to determine which selection "mode" the Interval Calendar is in. Instead it maintains its own state using the <code>_iState</code> property.</p>

<h4>The Event Listeners</h4>

<p>The default select and deselect events that CalendarGroup fires when the user selects or deselects a date are used to maintain the value of the <code>_iState</code> property discussed above. This allows the Interval Calendar implementation to provide custom interval selection behavior without having to re-implement large portions of the Calendar or CalendarGroup date selection code.</p>

<p>
All the logic required to provide the custom selection functionality is wrapped up neatly in 4 event listener methods: <code>_intervalOnBeforeSelect</code>, <code>_intervalOnSelect</code>, <code>_intervalOnBeforeDeselect</code> and <code>_intervalOnDeselect</code> all of which work with the existing CalendarGroup selection API and the <code>_iState</code> property to ensure the user doesn't select more than two dates at any given time:</p>
</p>

<textarea name="code" class="JScript" cols="60" rows="1">
    /**
     * Handles beforeSelect event.
     */
    _intervalOnBeforeSelect : function(t,a,o) {
        // Update interval state
        this._iState = (this._iState + 1) % 3;
        if(this._iState == 0) {
            // If starting over with upcoming selection, first deselect all
            this.deselectAll();
            this._iState++;
        }
    },

    /**
     * Handles selectEvent event.
     */
    _intervalOnSelect : function(t,a,o) {
        // Get selected dates
        var dates = this.getSelectedDates();
        if(dates.length > 1) {
            /* If more than one date is selected, ensure that the entire interval
                between and including them is selected */
            var l = dates[0];
            var u = dates[dates.length - 1];
            this.cfg.setProperty('selected', this._dateIntervalString(l, u), false);
        }
        // Render changes
        this.render();
    },

    /**
     * Handles beforeDeselect event.
     */
    _intervalOnBeforeDeselect : function(t,a,o) {
        if(this._iState != 0) {
            /* If part of an interval is already selected, then swallow up
                this event because it is superfluous (see _intervalOnDeselect) */
            return false;
        }
    }

    /**
     * Handles deselectEvent event.
     */
    _intervalOnDeselect : function(t,a,o) {
        if(this._iState != 0) {

            // If part of an interval is already selected, then first deselect all
            this._iState = 0;
            this.deselectAll();

            // Get individual date deselected and page containing it
            var d = a[0];
            var date = YAHOO.widget.DateMath.getDate(d[0], d[1] - 1, d[2]);
            var page = this.getCalendarPage(date);
            if(page) {
                // Now (re)select the individual date
                page.beforeSelectEvent.fire();
                this.cfg.setProperty('selected', this._dateString(date), false);
                page.selectEvent.fire([d]);
            }

            // Swallow up since we called deselectAll above
            return false;
        }
    }
</textarea>

<h4>Supporting Selection  Methods</h4>

<p>The constructor code, along with the above 4 methods provide the backbone for interval selection state handling. Additionally <code>IntervalCalendar</code> provides a few supporting selection methods, to make it easier to work with intervals:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
    /**
    * Returns the lower and upper dates of the currently selected interval, if an
    * interval is selected.
    */
    getInterval : function() {
        // Get selected dates
        var dates = this.getSelectedDates();
        if(dates.length > 0) {
            // Return lower and upper date in array
            var l = dates[0];
            var u = dates[dates.length - 1];
            return [l, u];
        }
        else {
            // No dates selected, return empty array
            return [];
        }
    },

    /**
     * Sets the currently selected interval by specifying the lower and upper
     * dates of the interval (in either order).
     */
    setInterval : function(d1, d2) {
        // Determine lower and upper dates
        var b = (d1 <= d2);
        var l = b ? d1 : d2;
        var u = b ? d2 : d1;
        // Update configuration
        this.cfg.setProperty('selected', this._dateIntervalString(l, u), false);
        this._iState = 2;
    },

    /**
     * Resets the currently selected interval.
     */
    resetInterval : function() {
        // Update configuration
        this.cfg.setProperty('selected', [], false);
        this._iState = 0;
    }
</textarea>

<p>Since Calendar and CalendarGroup's underlying selection model is designed to allow you to select multiple, not neccessarily adjacent dates, the default selection methods and properties don't enforce the date selection constraints required by IntervalCalendar. The <code>IntervalCalendar</code> class provides the <code>setInterval</code>, <code>getInterval</code> and <code>resetInterval</code> methods as alternative selection methods, which follow the selection definitions required by the Interval Calendar, setting and returning dates as part of a continuous date range.</p>

<p><strong>NOTE:</strong> For the purposes of this example, Interval Calendar doesn't go out of it's way to prevent developers from using the default <code>select</code> method or <code>select</code> configuration property, to select arbitrary dates outside of the currently selected interval, but it could override the corresponding methods to protect against such use if desired</p>

<h3>Using The <code>IntervalCalendar</code> Class</h3>

<p>Using the <code>IntervalCalendar</code> class is straightforward. It's instantiated in the same way as the CalenderGroup, providing a container id and a configuration object, and <code>render</code> is invoked to display it:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
    var iCal = new YAHOO.example.calendar.IntervalCalendar("cal1Container", {pages:2});
    iCal.render();
</textarea>

<h3>Setting Up The Select Event Listener</h3>

<p>The example also registers a listener for the normal select event fired by the CalendarGroup, and uses the <code>IntervalCalendar's</code> <code>getInterval</code> method to populate text input elements representing beginning and ending dates for the interval selected:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
   cal.selectEvent.subscribe(function() {
        interval = this.getInterval();

        if (interval.length == 2) {
            inDate = interval[0];
            inTxt.value = (inDate.getMonth() + 1) + "/" + inDate.getDate() + "/" + inDate.getFullYear();

            if (interval[0].getTime() != interval[1].getTime()) {
                outDate = interval[1];
                outTxt.value = (outDate.getMonth() + 1) + "/" + outDate.getDate() + "/" + outDate.getFullYear();
            } else {
                outTxt.value = "";
            }

        }
    }, cal, true);
</textarea>

<p>The select event listener relies on the fact that <code>getInterval</code> will either return an empty array if no dates have been selected, or a two element array with the first element representing the start date of the interval and the second element representing the end date of the interval. If only one date has been selected, the start date and end date will be the same.<p/>
