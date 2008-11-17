<h2 class="first">Setting up the Calendar</h2>

<p>You have 2 ways in which you can enable the <code>CalendarNavigation</code> feature, which is available to both the Calendar and CalendarGroup controls. The easiest way to enable the feature is to simply set the <code>navigator</code> configuration property to <code>true</code> as show below:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
    YAHOO.example.calendar.cal1 = new YAHOO.widget.CalendarGroup("cal1Container",{navigator:true});
    YAHOO.example.calendar.cal1.render();
</textarea>
<p>The above code snippet generates the CalendarGroup with the CalendarNavigator UI enabled, and the default configuration for the CalendarNavigator applied.</p>
<p>If you want to change the default configuration of the CalendarNavigator UI, you can specify a configuration object for the <code>navigator</code> property. The properties of the configuration object are case sensitive, and are listed below:</p>
<dl>
  <dt>strings</dt>
  <dd><em>Object</em> :  An object with the properties shown below, defining the string labels to use in the Navigator's UI
      <dl style="margin-left:3em;">
          <dt>month</dt><dd><em>String</em> : The string to use for the month label. <em>Defaults to "Month"</em>.</dd>
          <dt>year</dt><dd><em>String</em> : The string to use for the year label. <em>Defaults to "Year"</em>.</dd>
          <dt>submit</dt><dd><em>String</em> : The string to use for the submit button label. <em>Defaults to "Okay"</em>.</dd>
          <dt>cancel</dt><dd><em>String</em> : The string to use for the cancel button label. <em>Defaults to "Cancel"</em>.</dd>
          <dt>invalidYear</dt><dd><em>String</em> : The string to use for the invalid year validation message. <em>Defaults to "Year needs to be a number"</em>.</dd>
      </dl>
  </dd>
  <dt>monthFormat</dt><dd><em>String</em> : The month format to use. Either YAHOO.widget.Calendar.LONG, or YAHOO.widget.Calendar.SHORT. <em>Defaults to YAHOO.widget.Calendar.LONG</em>.</dd>
  <dt>initialFocus</dt><dd><em>String</em> : Either "year" or "month" specifying which input control should get initial focus. <em>Defaults to "year"</em>.</dd>
</dl>
<p>For the Calendar instance, we setup the CalendarNavigator with a custom configuration:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
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
  YAHOO.example.calendar.cal2 = new YAHOO.widget.Calendar("cal2Container", {navigator:navConfig});
  YAHOO.example.calendar.cal2.render();
</textarea>

<p><strong>NOTE:</strong> In the above code examples, we use the simpler version of the constructor, and only pass in the id of the container. We don't pass both an <code>id</code> and container id argument, as we do with other examples. This is a new constructor format available as of 2.4.0 and can used if you don't need a specific id set on the Calendar table.</p>
