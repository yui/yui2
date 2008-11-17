<script type="text/javascript">

    (function () {
    
    	var Button = YAHOO.widget.Button;

        // "contentready" event handler for the "checkboxbuttonsfrommarkup" <fieldset>

        YAHOO.util.Event.onContentReady("checkboxbuttonsfrommarkup", function () {

            // Create Buttons using existing <input> elements as a data source
    
            var oCheckButton1 = new Button("checkbutton1", { label: "One" });
            var oCheckButton2 = new Button("checkbutton2", { label: "Two" });
            var oCheckButton3 = new Button("checkbutton3", { label: "Three" });
            var oCheckButton4 = new Button("checkbutton4", { label: "Four" });


            // Create Buttons using the YUI Button markup

            var oCheckButton5 = new Button("checkbutton5", { type: "checkbox", value: "1", checked: true });
            var oCheckButton6 = new Button("checkbutton6", { type: "checkbox", value: "2"});
            var oCheckButton7 = new Button("checkbutton7", { type: "checkbox", value: "3" });
            var oCheckButton8 = new Button("checkbutton8", { type: "checkbox", value: "4" });        
        
        });


        // Create Buttons without using existing markup

        var oCheckButton9 = new Button({ type: "checkbox", label: "One", id: "checkbutton9", name: "checkboxfield3", value: "1", container: "checkboxbuttonsfromjavascript", checked: true });
        var oCheckButton10 = new Button({ type: "checkbox", label: "Two", id: "checkbutton10", name: "checkboxfield3", value: "2", container: "checkboxbuttonsfromjavascript" });
        var oCheckButton11 = new Button({ type: "checkbox", label: "Three", id: "checkbutton11", name: "checkboxfield3", value: "3", container: "checkboxbuttonsfromjavascript" });
        var oCheckButton12 = new Button({ type: "checkbox", label: "Four", id: "checkbutton12", name: "checkboxfield3", value: "4", container: "checkboxbuttonsfromjavascript" });

    }());

</script>

<?php
    if(isset($_POST) && count($_POST) > 0) {
?>
        <div id="button-example-form-postdata">
            <h2>Post Data</h2>
            <pre>
<?php    
print_r($_POST);        
?>
            </pre>
        </div>
<?php    
    }
?>

<form id="button-example-form" name="button-example-form" method="post">

    <fieldset id="checkboxbuttons">
        <legend>Checkbox Buttons</legend>

        <fieldset id="checkboxbuttonsfrommarkup">
            <legend>From Markup</legend>

            <div>
                <input id="checkbutton1" type="checkbox" name="checkboxfield1" value="1" checked>
                <input id="checkbutton2" type="checkbox" name="checkboxfield1" value="2">
                <input id="checkbutton3" type="checkbox" name="checkboxfield1" value="3">
                <input id="checkbutton4" type="checkbox" name="checkboxfield1" value="4">
            </div>

            <div>
                <span id="checkbutton5" class="yui-button yui-checkbox-button"><span class="first-child"><button type="button" name="checkboxfield2">One</button></span></span>
                <span id="checkbutton6" class="yui-button yui-checkbox-button"><span class="first-child"><button type="button" name="checkboxfield2">Two</button></span></span>
                <span id="checkbutton7" class="yui-button yui-checkbox-button"><span class="first-child"><button type="button" name="checkboxfield2">Three</button></span></span>
                <span id="checkbutton8" class="yui-button yui-checkbox-button"><span class="first-child"><button type="button" name="checkboxfield2">Four</button></span></span>
            </div>

        </fieldset>

        <fieldset id="checkboxbuttonsfromjavascript">
            <legend>From JavaScript</legend>
        </fieldset>

    </fieldset>

    <div>
        <input type="reset" name="resetbutton" value="Reset Form">
        <input type="submit" name="submitbutton" value="Submit Form">
    </div>

</form>