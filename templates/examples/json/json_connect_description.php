<h2 class="first">Include the JSON Utility</h2>
<p>The JSON utility is an extension of <code>YAHOO.lang</code>.  Load the JSON Utility by including these tags:</p>

<textarea name="code" class="HTML" rows="1" cols="60">
<script type="text/javascript" src="http://yui.yahooapis.com/2.5.1/build/yahoo/yahoo-min.js"></script>
<script type="text/javascript" src="http://yui.yahooapis.com/2.5.1/build/json/json-min.js"></script>

</textarea>

<h2>Use <code>YAHOO.lang.JSON.parse</code> in the success handler</h2>
<p>Pass the XHR <code>responseText</code> to <code>YAHOO.lang.JSON.parse</code> and capture the return value.  Note that the parse method can throw a <code>SyntaxError</code> exception, so be sure to wrap the call in a <code>try/catch</code> block.</p>

<textarea name="code" class="JScript" rows="1" cols="60">
var callbacks = {
    // Successful XHR response handler
    success : function (o) {
        var messages = [];

        // Use the JSON Utility to parse the data returned from the server
        try {
            messages = YAHOO.lang.JSON.parse(o.responseText);
        }
        catch (x) {
            alert("JSON Parse failed!");
            return;
        }

        // The returned data was parsed into an array of objects.
        // Add a P element for each received message
        for (var i = 0, len = messages.length; i < len; ++i) {
            var m = messages[i];
            var p = document.createElement('p');
            var message_text = document.createTextNode(
                    m.animal + ' says "' + m.message + '"');
            p.appendChild(message_text);
            msg_section.appendChild(p);
        }
    },

    ...
};

// Make the call to the server for JSON data
YAHOO.util.Connect.asyncRequest('GET',"<?php echo($assetsDirectory);?>jsonConnect.php", callbacks);
</textarea>

<p>The <code>parse</code> method returns the native JavaScript object representation of the string data returned from the <code>asyncRequest</code>.  In this case, the data is an array of object literals in this form:</p>
<textarea name="code" class="JScript" rows="1" cols="60">
[
    { "animal" : "Cat",  "message" : "Meow"  },
    { "animal" : "Dog",  "message" : "Woof"  },
    { "animal" : "Cow",  "message" : "Moo"   },
    { "animal" : "Duck", "message" : "Quack" },
    { "animal" : "Lion", "message" : "Roar"  }
]
</textarea>
