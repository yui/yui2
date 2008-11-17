<h2 class="first">Sample Code for this Example</h2>

<p>CSS:</p>

<textarea name="code" class="CSS" cols="60" rows="1">/* No custom CSS. */
</textarea>

<p>Markup:</p>

<textarea name="code" class="HTML" cols="60" rows="1">&lt;p&gt;&lt;a href="#" id="loglink"&gt;Click here&lt;/a&gt; to log a simple message.</p&gt;
</textarea>

<p>JavaScript:</p>

<textarea name="code" class="JScript" cols="60" rows="1">YAHOO.example.Basic = new function() {
    YAHOO.util.Event.addListener(YAHOO.util.Dom.get("loglink"), "click", function(e) {
        YAHOO.util.Event.stopEvent(e);
        YAHOO.log("This is a simple log message.");
    });

    // Put a LogReader on your page
    this.myLogReader = new YAHOO.widget.LogReader();
};
</textarea>
