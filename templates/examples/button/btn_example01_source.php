<script type="text/javascript">

    YAHOO.example.init = function () {

        // "click" event handler for each Button instance

        function onButtonClick(p_oEvent) {

            YAHOO.log("You clicked button: " + this.get("id"), "info", "example1");
        
        }


        // "contentready" event handler for the "pushbuttonsfrommarkup" <fieldset>

        YAHOO.util.Event.onContentReady("pushbuttonsfrommarkup", function () {

            // Create Buttons using existing <input> elements as a data source

            var oPushButton1 = new YAHOO.widget.Button("pushbutton1");
            oPushButton1.on("click", onButtonClick);
            
            var oPushButton2 = new YAHOO.widget.Button("pushbutton2", { onclick: { fn: onButtonClick } });
            var oPushButton3 = new YAHOO.widget.Button("pushbutton3", { onclick: { fn: onButtonClick } });


            // Create Buttons using the YUI Button markup

            var oPushButton4 = new YAHOO.widget.Button("pushbutton4");
            oPushButton4.on("click", onButtonClick);

            var oPushButton5 = new YAHOO.widget.Button("pushbutton5", { onclick: { fn: onButtonClick } });
            var oPushButton6 = new YAHOO.widget.Button("pushbutton6", { onclick: { fn: onButtonClick } });        
        
        });


        // Create Buttons without using existing markup

        var oPushButton7 = new YAHOO.widget.Button({ label:"Add", id:"pushbutton7", container:"pushbuttonsfromjavascript" });
        oPushButton7.on("click", onButtonClick);

        var oPushButton8 = new YAHOO.widget.Button({ label:"Add", id:"pushbutton8", container:"pushbuttonsfromjavascript", onclick: { fn: onButtonClick } });
        var oPushButton9 = new YAHOO.widget.Button({ label:"Add", id:"pushbutton9", container:"pushbuttonsfromjavascript", onclick: { fn: onButtonClick } });

    } ();

</script>

<form id="button-example-form" name="button-example-form" method="post">

    <fieldset id="pushbuttons">
        <legend>Push Buttons</legend>

        <fieldset id="pushbuttonsfrommarkup">
            <legend>From Markup</legend>

            <div>
                <button type="button" id="pushbutton1" name="button1" value="Add">Add</button>
                <input type="button" id="pushbutton2" name="button2" value="Add">
                <input type="button" id="pushbutton3" name="button3" value="Add">
            </div>

            <div>
                <span id="pushbutton4" class="yui-button yui-push-button"><span class="first-child"><input type="button" name="button4" value="Add"></span></span>
                <span id="pushbutton5" class="yui-button yui-push-button"><em class="first-child"><button type="button" name="button5">Add</button></em></span>
                <span id="pushbutton6" class="yui-button yui-push-button"><strong class="first-child"><button type="button" name="button6">Add</button></strong></span>
            </div>

        </fieldset>
        
        <fieldset id="pushbuttonsfromjavascript">
            <legend>From JavaScript</legend>
        </fieldset>

    </fieldset>

</form>