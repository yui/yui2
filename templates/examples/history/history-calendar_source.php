<style>

#yui-history-iframe {
  position:absolute;
  top:0; left:0;
  width:1px; height:1px; /* avoid scrollbars */
  visibility:hidden;
}

</style>

<!-- Static markup required by the browser history utility. Note that the
     iframe is only used on Internet Explorer. If this page is server
     generated (by a PHP script for example), it is a good idea to create
     the IFrame ONLY for Internet Explorer (use server side user agent sniffing) -->

<iframe id="yui-history-iframe" src="assets/blank.html"></iframe>
<input id="yui-history-field" type="hidden">

<!-- Static markup required for the calendar widget. -->
<div id="container">
  <div id="calendarContainer"></div>
</div>

<script>

(function () {

    // The initial month will be chosen in the following order:
    //
    // URL fragment identifier (it will be there if the user previously
    // bookmarked the application in a specific state)
    //
    //         or
    //
    // today's corresponding month (default)

    var today = new Date();
    var defaultCalendarState = (today.getMonth() + 1) + "_" + today.getFullYear();
    var bookmarkedCalendarState = YAHOO.util.History.getBookmarkedState("calendar");
    var initialCalendarState = bookmarkedCalendarState || defaultCalendarState;

    var calendar;

    // Register our calendar module. Module registration MUST
    // take place before calling YAHOO.util.History.initialize.
    YAHOO.util.History.register("calendar", initialCalendarState, function (state) {
        // This is called after calling YAHOO.util.History.navigate, or after the user
        // has trigerred the back/forward button. We cannot discrminate between
        // these two situations.

        // Show the right month according to the "state" parameter:
        calendar.cfg.setProperty("pagedate", state.replace("_", "/"));
        calendar.render();
    });

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

    function initCalendar (startDate) {
        // Instantiate the calendar control...
        calendar = new YAHOO.widget.Calendar("calendar", "calendarContainer", startDate);
        calendar.beforeRenderEvent.subscribe(handleCalendarBeforeRender, calendar, true);
        calendar.render();
    }

    // Use the Browser History Manager onReady method to instantiate the calendar widget.
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

    // Initialize the browser history management library.
    try {
        YAHOO.util.History.initialize("yui-history-field", "yui-history-iframe");
    } catch (e) {
        // The only exception that gets thrown here is when the browser is
        // not supported (Opera, or not A-grade) Degrade gracefully.
        initCalendar({ pagedate: initialCalendarState.replace("_", "/") });
    }

})();

</script>
