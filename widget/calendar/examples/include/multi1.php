			<p>Although the default Calendar control only allows for a single selection to be made, it's easy to configure a Calendar to accept multiple selections.</p>

			<p>The markup for our multi-select Calendar example looks indentical to the single-select Calendar:</p>

			<textarea name="code" class="HTML" cols="60" rows="1">
				<div id="cal1Container"></div>
			</textarea>

			<p>Instantiating a multi-select Calendar is similar to instantiating a single-select Calendar; however, to specify the multi-select configuration we pass a configuration object into the constructor. The configuration object is a JavaScript object literal can be passed to the Calendar constructor in the form of key/value pairs for the purpose of setting the Calendar's various configuration properties.  In this case, we'll specify that the "MULTI-SELECT" option has a value of true in line 6 below.</p>

			<textarea name="code" class="JScript" cols="60" rows="1">
				<script>
						YAHOO.namespace("example.calendar");

						function init() {
							YAHOO.example.calendar.cal1 =
								new YAHOO.widget.Calendar("cal1","cal1Container", { MULTI_SELECT: true } );

							YAHOO.example.calendar.cal1.render();
						}

						YAHOO.util.Event.addListener(window, "load", init);
				</script>
			</textarea>

			<p>You will see Calendar's various other configuration properties at work throughout the remainder of the tutorials, and you can also view the Calendar's <a href=""http://developer.yahoo.com/yui/calendar/">configuration properties reference</a> for more details.</p>