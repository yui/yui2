<script type="text/javascript">
    YAHOO.util.Event.onDOMReady(function(){

        var dialog, calendar;

        calendar = new YAHOO.widget.Calendar("cal", {
            iframe:false,          // Turn iframe off, since container has iframe support.
            hide_blank_weeks:true  // Enable, to demonstrate how we handle changing height, using changeContent
        });

        function okHandler() {
            if (calendar.getSelectedDates().length > 0) {

                var selDate = calendar.getSelectedDates()[0];

                // Pretty Date Output, using Calendar's Locale values: Friday, 8 February 2008
                var wStr = calendar.cfg.getProperty("WEEKDAYS_LONG")[selDate.getDay()];
                var dStr = selDate.getDate();
                var mStr = calendar.cfg.getProperty("MONTHS_LONG")[selDate.getMonth()];
                var yStr = selDate.getFullYear();

                YAHOO.util.Dom.get("date").value = wStr + ", " + dStr + " " + mStr + " " + yStr;
            } else {
                YAHOO.util.Dom.get("date").value = "";
            }
            this.hide();
        }
 
        function cancelHandler() {
            this.hide();
        }

        dialog = new YAHOO.widget.Dialog("container", {
            context:["show", "tl", "bl"],
            buttons:[ {text:"Select", isDefault:true, handler: okHandler}, 
                      {text:"Cancel", handler: cancelHandler}],
            width:"16em",  // Sam Skin dialog needs to have a width defined (7*2em + 2*1em = 16em).
            draggable:false,
            close:true
        });
        calendar.render();
        dialog.render();

        // Using dialog.hide() instead of visible:false is a workaround for an IE6/7 container known issue with border-collapse:collapse.
        dialog.hide();

        calendar.renderEvent.subscribe(function() {
            // Tell Dialog it's contents have changed, Currently used by container for IE6/Safari2 to sync underlay size
            dialog.fireEvent("changeContent");
        });

        YAHOO.util.Event.on("show", "click", function() {
	    dialog.show();
	});
    });
</script>
<div class="box">
   <div class="datefield">
      <label for="date">Date: </label><input type="text" id="date" name="date" value="" /><button type="button" id="show" title="Show Calendar"><img src="<?php echo $assetsDirectory; ?>calbtn.gif" width="18" height="18" alt="Calendar" ></button>
   </div>
   <div id="container">
      <div class="hd">Calendar</div>
      <div class="bd">
         <div id="cal"></div>
      </div>
   </div>
</div>
