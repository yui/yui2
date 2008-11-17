<script type="text/javascript">
	YAHOO.namespace("example.calendar");

	YAHOO.example.calendar.init = function() {
		var eLog = YAHOO.util.Dom.get("evtentries");
		var eCount = 1;

		function logEvent(msg) {
			eLog.innerHTML = '<pre class="entry"><strong>' + eCount + ').</strong> ' + msg + '</pre>' + eLog.innerHTML;
			eCount++;
		}

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
	}

	YAHOO.util.Event.onDOMReady(YAHOO.example.calendar.init);
</script>

<div id="cal1Container"></div>
<div id="caleventlog" class="eventlog">
	<div class="hd">Select/Deselect Events</div>
	<div id="evtentries" class="bd"></div>
</div>
<div style="clear:both"></div>
