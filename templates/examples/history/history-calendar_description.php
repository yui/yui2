<h2>Basic markup</h2>

<p>
  In our example, the calendar widget relies on the following markup:
</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<div id="calendarContainer"></div>
</textarea>

<h2>Add the markup required by the Browser History Manager</h2>

<textarea name="code" class="HTML" cols="60" rows="1">
<iframe id="yui-history-iframe" src="assets/blank.html"></iframe>
<input id="yui-history-field" type="hidden">
</textarea>

<p>
  This markup should be inserted right after the opening <code>body</code> tag.
</p>

<h2 class="first">Import the source files and dependencies</h2>

<p>
  In our example, we need the Event Utility, DOM Utility, Calendar Widget, and the Browser History Manager:
</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<link type="text/css" rel="stylesheet" href="calendar.css"/>
<script src="yahoo-dom-event.js"></script>
<script src="calendar.js"></script>
<script src="history.js"></script>
</textarea>

<h2>Design your application</h2>

<p>
  In our simple example, we have only one module, represented by the calendar widget. We will refer to this module using the identifier
  "calendar". The state of the calendar module will be represented by a string composed of the month and the year the widget currently
  renders, separated by <code>"_"</code> (e.g. <code>"2_2007"</code> for February 2007)
</p>

<h2>Retrieve the initial state of the calendar module</h2>

<p>
  Use the <code>YAHOO.util.History.getBookmarkedState</code> method and default to the month corresponding to today's date:
</p>

<textarea name="code" class="JScript" cols="60" rows="1">
var today = new Date();
var defaultCalendarState = (today.getMonth() + 1) + "_" + today.getFullYear();
var bookmarkedCalendarState = YAHOO.util.History.getBookmarkedState("calendar");
var initialCalendarState = bookmarkedCalendarState || defaultCalendarState;
</textarea>

<h2>Register the calendar module</h2>

<p>
  Use the <code>YAHOO.util.History.register</code> method, passing in the calendar module identifier, the initial state of the calendar
  module, and the callback function that will be called when the state of the calendar module has changed:
</p>

<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.util.History.register("calendar", initialCalendarState, function (state) {
    // Show the right month according to the "state" parameter:
    calendar.cfg.setProperty("pagedate", state.replace("_", "/"));
    calendar.render();
});
</textarea>

<h2>Write the code that initializes your application</h2>

<textarea name="code" class="JScript" cols="60" rows="1">
var calendar;

function initCalendar (startDate) {
    // Instantiate the calendar control...
    calendar = new YAHOO.widget.Calendar("calendar", "calendarContainer", startDate);
    calendar.beforeRenderEvent.subscribe(handleCalendarBeforeRender, calendar, true);
    calendar.render();
}
</textarea>

<h2>Use the Browser History Manager <code>onReady</code> method</h2>

<p>
  Use the Browser History Manager <code>onReady</code> method to instantiate the calendar widget. Also, retrieve the current
  state of the calendar module, and use that state to show the right month (the current state may be different from the initial
  state under certain circumstances - see the User's Guide)
</p>

<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.util.History.onReady(function () {
    var currentState;
    // This is the tricky part... The onLoad event is fired when the user
    // comes back to the page using the back button. In this case, the
    // actual month that needs to be loaded corresponds to the last month
    // visited before leaving the page, and not the initial month. This can
    // be retrieved using getCurrentState:
    currentState = YAHOO.util.History.getCurrentState("calendar");
    initCalendar({ pagedate: currentState.replace("_", "/") });
});
</textarea>

<h2>Add history entries</h2>

<p>
  A new history entry must be added every time the user views a new month. Use the calendar widget's <code>beforeRender</code>
  event handler (set to <code>handleCalendarBeforeRender</code> - see above):
</p>

<textarea name="code" class="JScript" cols="60" rows="1">
function handleCalendarBeforeRender () {
    var calDate, newState, currentState;

    calDate = calendar.cfg.getProperty("pageDate");
    newState = (calDate.getMonth() + 1) + "_" + calDate.getFullYear();

    try {
        currentState = YAHOO.util.History.getCurrentState("calendar");
        // The following test is crucial. Otherwise, we end up circling forever.
        // Indeed, YAHOO.util.History.navigate will call the module onStateChange
        // callback, which will call createCalendar, which will call calendar.render(),
        // which will end up calling handleCalendarBeforeRender, and it keeps going
        // from here...
        if (newState !== currentState) {
            YAHOO.util.History.navigate("calendar", newState);
        }
    } catch (e) {
        calendar.cfg.setProperty("pagedate", newState.replace("_", "/"));
        calendar.render();
    }
}
</textarea>

<h2>Initialize the Browser History Manager</h2>

<p>
  Simply call <code>YAHOO.util.History.initialize</code>, passing in the id of the input field and IFrame we inserted
  in our static markup:
</p>

<textarea name="code" class="JScript" cols="60" rows="1">
// Initialize the browser history management library.
try {
    YAHOO.util.History.initialize("yui-history-field", "yui-history-iframe");
} catch (e) {
    // The only exception that gets thrown here is when the browser is
    // not supported (Opera, or not A-grade) Degrade gracefully.
    initCalendar({ pagedate: initialCalendarState.replace("_", "/") });
}
</textarea>
