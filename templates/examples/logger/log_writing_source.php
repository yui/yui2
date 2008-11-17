<div id="container"></div>
<div id="content">
    <h4>Example: Log messages into different categories</h4>
    <p>By default, unsourced log messages get assigned to a "global" bucket.</p>
    <ul>
    <li><a href="#" class="global info">Log an "info" message.</a></li>
    <li><a href="#" class="global warn">Log a "warn" message.</a></li>
    <li><a href="#" class="global error">Log an "error" message.</a></li>
    <li><a href="#" class="global time">Log a "time" message.</a></li>
    </ul>

    <h4>Example: Log messages into different categories and assign them
    to a source called <code>myBucket</code></h4>
    <p>You can assign a source to a log message by passing it in as
    the third argument to <code>YAHOO.log()</code>.</p>
    <ul>
    <li><a href="#" class="myBucket info">Log an "info" message.</a></li>
    <li><a href="#" class="myBucket warn">Log a "warn" message.</a></li>
    <li><a href="#" class="myBucket error">Log an "error" message.</a></li>
    <li><a href="#" class="myBucket time">Log a "time" message.</a></li>
    </ul>

    <h4>Example: Create a LogWriter to write log messages from a class
    named <code>MyClass</code></h4>
    <p>If you plan to assign many log messages to the same source (such
    as from a class), it may be easier to write log messages from a
    LogWriter instance.</p>
    <ul>
    <li><a href="#" class="MyClass info">Log an "info" message.</a></li>
    <li><a href="#" class="MyClass warn">Log a "warn" message.</a></li>
    <li><a href="#" class="MyClass error">Log an "error" message.</a></li>
    <li><a href="#" class="MyClass time">Log a "time" message.</a></li>
    </ul>
</div>


<script type="text/javascript">
YAHOO.util.Event.addListener(window, "load", function() {
    YAHOO.example.LogWriter = new function() {
        this.myLogReader = new YAHOO.widget.LogReader("container");
        this.myLogWriter = new YAHOO.widget.LogWriter("MyClass");

        // Click to log
        this.clickToLog = function(e) {
            YAHOO.util.Event.stopEvent(e);
            var target = YAHOO.util.Event.getTarget(e);
            var source = (YAHOO.util.Dom.hasClass(target, "MyClass")) ? "MyClass" : null;

            if(!source) {
                source = (YAHOO.util.Dom.hasClass(target, "myBucket")) ? "myBucket" : null;
                if(YAHOO.util.Dom.hasClass(target, "info")) {
                    YAHOO.log("This is an \"info\" message.", "info", source);
                }
                else if(YAHOO.util.Dom.hasClass(target, "warn")) {
                    YAHOO.log("This is a \"warn\" message.", "warn", source);
                }
                else if(YAHOO.util.Dom.hasClass(target, "error")) {
                    YAHOO.log("This is an \"error\" message.", "error", source);
                }
                else if(YAHOO.util.Dom.hasClass(target, "time")) {
                    YAHOO.log("This is a \"time\" message.", "time", source);
                }
            }
            else {
                if(YAHOO.util.Dom.hasClass(target, "info")) {
                    this.myLogWriter.log("This is an \"info\" message.", "info");
                }
                else if(YAHOO.util.Dom.hasClass(target, "warn")) {
                    this.myLogWriter.log("This is a \"warn\" message.", "warn");
                }
                else if(YAHOO.util.Dom.hasClass(target, "error")) {
                    this.myLogWriter.log("This is an \"error\" message.", "error");
                }
                else if(YAHOO.util.Dom.hasClass(target, "time")) {
                    this.myLogWriter.log("This is a \"time\" message.", "time");
                }

            }
        };

        YAHOO.util.Event.addListener(YAHOO.util.Dom.get("content"),"click",this.clickToLog, this, true);
    };
});
</script>

