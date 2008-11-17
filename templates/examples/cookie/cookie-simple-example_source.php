<h3>Note:</h3>

<p>Keep an eye on the Logger console at right to view the log messages associated with this example.</p>



<script type="text/javascript">
(function(){

    var currentValue = YAHOO.util.Cookie.get("example");
    YAHOO.log("Cookie's current value is '" + currentValue + "'");

    var newValue = "yui" + Math.round(Math.random() * Math.PI * 1000);
    YAHOO.log("Setting cookie's value to '" + newValue + "'");
    YAHOO.util.Cookie.set("example", newValue);

})();
</script>