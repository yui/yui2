<h2 class="first">Setting up the Calendar and Container</h2>

<p>
In this example, we leverage Dialog's <code>context</code> configuration property to position the Calendar relative to a "Calendar" button, and Dialog's <code>buttons</code> property to provide "Select" and "Cancel" buttons for the Calendar. We set the dialog's <code>draggable</code> property to <code>false</code> for this example, however if the application required it, we could also easily set <code>draggable</code> to <code>true</code> to get a draggable Calendar.
</p>

<p>When creating a Calendar which is to be placed inside a Container control there are a few areas which require special attention.</p>

<ol>
   <li>
      <strong>Dialog Width</strong>
      <p>When using Sam skin, Dialogs require a width to be set to avoid rendering problems with IE6 and IE7 quirks mode.</p>
      <p>The Calendar by default has no specific width defined (it's content defines how wide it is) but we set a width which is wide enough to allow for Calendar's default Sam skin implementation.</p>

      <textarea name="code" class="JScript" cols="60" rows="1">
        dialog = new YAHOO.widget.Dialog("container", {
            context:["show", "tl", "bl"],
            buttons:[ {text:"Select", isDefault:true, handler: okHandler},
                      {text:"Cancel", handler: cancelHandler}],
            width:"16em",  // Sam Skin dialog needs to have a width defined (7*2em + 2*1em = 16em).
            draggable:false,
            close:true
        });
      </textarea>

      <p>In order to allow the Calendar to take up the full width of the Dialog, we set the <code>.bd</code> padding to 0.
         We also over-ride the Calendar container's pixel based padding, in favor of ems, which allows us to set an <code>em</code> based width for 
         the Dialog and have it resize automatically with text size changes.</p>

      <textarea name="code" class="CSS" cols="60" rows="1">
         #container .bd {padding:0;}	
         #cal {border:none;padding:1em}	
      </textarea>
   </li> 
   <li>
      <strong>Dialog Content Changes</strong>
      <p>Whenever the contents of the Calendar are changed we fire Dialog's <code>changeContent</code> event so any of Dialog's rendered elements which need to be kept in sync are redrawn <em>(such as the size of the shadow underlay for IE6/Safari2)</em>. We could optimize this, by checking for an actual change in dimensions before firing the <code>changeContent</code> event, using Calendar's <code>beforeRenderEvent</code> but the simpler approach is taken for the purposes of the example.<p>The Calendar has <code>hide_blank_weeks</code> set to <code>true</code> to illustrate the fact that the shadow is resized when the height of the Calendar changes.</p>

      <textarea name="code" class="JScript" cols="60" rows="1">
        calendar.renderEvent.subscribe(function() {
            // Tell Dialog it's contents have changed. 
            dialog.fireEvent("changeContent");
        });
      </textarea>

      <p><strong>NOTE:</strong> Normally if you were to change the contents of the Dialog's header, body or footer elements (e.g. using <code>dialog.setBody(...)</code>), <code>changeContent</code> would be fired automatically, but in this case, we're changing the contents of the Calendar, and not the body element directly so we need to inform the Dialog that something inside the body changed.</p>
   </li> 
   <li>
      <strong>Handling Calendar's Float</strong>
      <p>CSS is used to clear Calendar's float:left and allow the Dialog body element to wrap the Calendar.</p>
      <textarea name="code" class="CSS" cols="60" rows="1">
        #container .bd:after {content:".";display:block;clear:left;height:0;visibility:hidden;}
      </textarea>
   </li>
   <li><strong>Double Iframe Shims</strong>
       <p>Calendar's <code>iframe</code> property is set to <code>false</code> since the Dialog already provides iframe shim support and we want to avoid duplicating shims for performance reasons.</p>
   </li>
   <li><strong>Workaround IE's <code>border-collapse:collapse</code> Issue</strong>
       <p>IE has a known issue related to collapsed table borders remaining visible even though the table's containing element has its <code>visibility</code> set to <code>hidden</code> (See <a href="http://developer.yahoo.com/yui/container/#knownissues">Container known issues</a>).</p>
       <p>Since the Sam skin Calendar uses <code>border-collapse:collapse</code> and the Dialog is hidden using <code>visibility:hidden</code>, we need to use the workaround mentioned in the known issues section above, to make sure Calendar's table borders get hidden when the Dialog is hidden.</p>

      <textarea name="code" class="JScript" cols="60" rows="1">
        // Using dialog.hide() instead of specifying visible:false in the constructor config options
        // is a workaround for an IE6/7 container known issue with border-collapse:collapse.
        dialog.hide();
      </textarea>
   </li>
</ol>

<p>As a side note, this example also shows how you can use the simpler version of the Calendar constructor, providing only the container id (available as of 2.4.0) and also how you can use Calendar's locale properties to create long date strings from a JavaScript Date object.</p>
