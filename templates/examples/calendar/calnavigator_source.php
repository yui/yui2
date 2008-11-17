<div id="cal1Container"></div>
<div id="cal2Container"></div>

<script type="text/javascript">
    YAHOO.namespace("example.calendar");

    YAHOO.example.calendar.init = function() {
        // Enable navigator with the default configuration
        YAHOO.example.calendar.cal1 = new YAHOO.widget.CalendarGroup("cal1Container", {navigator:true});
        YAHOO.example.calendar.cal1.render();
        
        // Enable navigator with a custom configuration
        var navConfig = {
            strings : {
                month: "Choose Month",
                year: "Enter Year",
                submit: "OK",
                cancel: "Cancel",
                invalidYear: "Please enter a valid year"
            },
            monthFormat: YAHOO.widget.Calendar.SHORT,
            initialFocus: "year"
        };
        YAHOO.example.calendar.cal2 = new YAHOO.widget.Calendar("cal2Container", {navigator: navConfig});
        YAHOO.example.calendar.cal2.render();
    }

    YAHOO.util.Event.onDOMReady(YAHOO.example.calendar.init);
</script>

<div style="clear:both" ></div>
