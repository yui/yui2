<h3>Note:</h3>

<p>Keep an eye on the Logger console at right to view the log messages associated with this example.</p>


<script type="text/javascript">
(function(){

    var Cookie = YAHOO.util.Cookie;
    
    //get subcookie values
    var name = Cookie.getSub("example", "name");
    var today = Cookie.getSub("example", "today", function(value){
        return new Date(value);
    });
    var count = Cookie.getSub("example", "count", Number);

    YAHOO.log("The subcookie 'name' is '" + name + "'(" + (typeof name) + ")");
    YAHOO.log("The subcookie 'today' is '" + today + "'(" + (typeof today) + ")");
    YAHOO.log("The subcookie 'count' is '" + count + "'(" + (typeof count) + ")");
       
    //set subcookie values
    Cookie.setSub("example", "name", "Yahoo!");
    Cookie.setSub("example", "today", (new Date()).toString());
    Cookie.setSub("example", "count", Math.round(Math.random() * 30));

})();
</script>