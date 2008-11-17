<h2 class="first">Sample Code for this Example</h2>

<p>CSS:</p>

<textarea name="code" class="CSS" cols="60" rows="1">/* custom styles for this example */
#container {position:relative;float:right;margin:1em;}
#container .mytype {background-color:#FF99CC;}
</textarea>

<p>Markup:</p>

<textarea name="code" class="HTML" cols="60" rows="1">&lt;div id="container"&gt;&lt;/div&gt;
</textarea>

<p>JavaScript:</p>

<textarea name="code" class="JScript" cols="60" rows="1">YAHOO.example.LogWriter = new function() {
    this.myLogReader = new YAHOO.widget.LogReader("container");
    this.myLogWriter = new YAHOO.widget.LogWriter("MyClass");

    // Generate logs
    YAHOO.log("This is an info message.", "info", source);
    YAHOO.log("This is a warn message.", "warn", source);
    YAHOO.log("This is an error message.", "error", source);
    YAHOO.log("This is a time message.", "time", source);

    this.myLogWriter.log("This is an info message.", "info");
    this.myLogWriter.log("This is a warn message.", "warn");
    this.myLogWriter.log("This is an error message.", "error");
    this.myLogWriter.log("This is a time message.", "time");
};
</textarea>
