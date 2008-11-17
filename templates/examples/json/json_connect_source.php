<div id="demo">
    <input type="button" id="demo_btn" value="Get Messages">

    <div id="demo_msg"></div>
</div>
<script type="text/javascript">
YAHOO.util.Event.on('demo_btn','click',function (e) {
    // Get the div element in which to report messages from the server
    var msg_section = YAHOO.util.Dom.get('demo_msg');
    msg_section.innerHTML = '';

    // Define the callbacks for the asyncRequest
    var callbacks = {

        success : function (o) {
            YAHOO.log("RAW JSON DATA: " + o.responseText);

            // Process the JSON data returned from the server
            var messages = [];
            try {
                messages = YAHOO.lang.JSON.parse(o.responseText);
            }
            catch (x) {
                alert("JSON Parse failed!");
                return;
            }

            YAHOO.log("PARSED DATA: " + YAHOO.lang.dump(messages));

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

        failure : function (o) {
            if (!YAHOO.util.Connect.isCallInProgress(o)) {
                alert("Async call failed!");
            }
        },

        timeout : 3000
    }

    // Make the call to the server for JSON data
    YAHOO.util.Connect.asyncRequest('GET',"<?php echo($assetsDirectory);?>jsonConnect.php", callbacks);
});
</script>
