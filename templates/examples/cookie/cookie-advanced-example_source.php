<h3>Note:</h3>

<p>Keep an eye on the Logger console at right to view the log messages associated with this example.</p>

<p>Click the buttons to interact with the cookie:</p>
<input type="button" value="Get Value" id="yui-cookie-btn1" />
<input type="button" value="Set Random Value" id="yui-cookie-btn2" />
<input type="button" value="Remove Value" id="yui-cookie-btn3" />
<script type="text/javascript">
(function(){

    YAHOO.util.Event.on("yui-cookie-btn1", "click", function(){
        var value = YAHOO.util.Cookie.get("example");
        alert(value);
        YAHOO.log("Cookie 'example' has a value of '" + value + "'");
    });

    YAHOO.util.Event.on("yui-cookie-btn2", "click", function(){
        var newValue = "yui" + Math.round(Math.random() * Math.PI * 1000);
        YAHOO.util.Cookie.set("example", newValue);
        YAHOO.log("Set cookie 'example' to '" + newValue + "'");
    });

    YAHOO.util.Event.on("yui-cookie-btn3", "click", function(){
        YAHOO.util.Cookie.remove("example");
        YAHOO.log("Removed cookie 'example'.");
    });


})();
</script>