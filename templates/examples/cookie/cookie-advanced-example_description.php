<h2 class="first">Advanced Cookie Example</h2>
<p>This example consists of three buttons, each of which performs one of the basic cookie functions: getting a value,
setting a value, and removing a value. The first button, &quot;Get Value&quot;, retrieves the value of a cookie
and displays it in an alert:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.util.Event.on("yui-cookie-btn1", "click", function(){
    var value = YAHOO.util.Cookie.get("example");
    alert(value);
    YAHOO.log("Cookie 'example' has a value of '" + value + "'");
});
</textarea>
<p>The second button, &quot;Set Random Value&quot;, creates a random value and sets the cookie's value equal to it:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.util.Event.on("yui-cookie-btn2", "click", function(){
    var newValue = "yui" + Math.round(Math.random() * Math.PI * 1000);
    YAHOO.util.Cookie.set("example", newValue);
    YAHOO.log("Set cookie 'example' to '" + newValue + "'");
});
</textarea>
<p>After clicking this button, you can go back and click &quot;Get Value&quot; to see the new value that was assigned
to the cookie (you can also check the logger output).</p>
<p>The third button, &quot;Remove Value&quot;, completely removes the cookie from the page:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.util.Event.on("yui-cookie-btn3", "click", function(){
    YAHOO.util.Cookie.remove("example");
    YAHOO.log("Removed cookie 'example'.");
});
</textarea>  
<p>When this button is clicked, it removes the cookie. If &quot;Get Value&quot; is clicked immediately afterwards, the
value should be <code>null</code>.</p>