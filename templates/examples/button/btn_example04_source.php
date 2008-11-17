<script type="text/javascript">

    (function () {

		var ButtonGroup = YAHOO.widget.ButtonGroup;


        // "checkedButtonChange" event handler for each ButtonGroup instance

        var onCheckedButtonChange = function (p_oEvent) {

            if(p_oEvent.prevValue) {

                YAHOO.log(p_oEvent.prevValue.get("name"), "info", "example4");
            
            }
            
            if(p_oEvent.newValue) {

                YAHOO.log(p_oEvent.newValue.get("name"), "info", "example4");

            }
        
        };


        // "contentready" event handler for the "radiobuttonsfrommarkup" <fieldset>    

        YAHOO.util.Event.onContentReady("radiobuttonsfrommarkup", function () {

            var oButtonGroup1 = new ButtonGroup("buttongroup1");
            oButtonGroup1.on("checkedButtonChange", onCheckedButtonChange);

            var oButtonGroup2 = new ButtonGroup("buttongroup2");
            oButtonGroup2.on("checkedButtonChange", onCheckedButtonChange);
        
        
        });


        // Create a ButtonGroup without using existing markup

        var oButtonGroup3 = new ButtonGroup({ id:  "buttongroup3", name:  "radiofield3", container:  "radiobuttonsfromjavascript", usearia: true });

        oButtonGroup3.addButtons([

            { label: "Radio 9", value: "Radio 9", checked: true },
            { label: "Radio 10", value: "Radio 10" }, 
            { label: "Radio 11", value: "Radio 11" }, 
            { label: "Radio 12", value: "Radio 12" }

        ]);
        
        oButtonGroup3.on("checkedButtonChange", onCheckedButtonChange);
    
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

    <fieldset id="radiobuttons">
        <legend>Radio Buttons</legend>

        <fieldset id="radiobuttonsfrommarkup">
            <legend>From Markup</legend>

            <div id="buttongroup1" class="yui-buttongroup">
                <input id="radio1" type="radio" name="radiofield1" value="Radio 1" checked>
                <input id="radio2" type="radio" name="radiofield1" value="Radio 2">
                <input id="radio3" type="radio" name="radiofield1" value="Radio 3">
                <input id="radio4" type="radio" name="radiofield1" value="Radio 4">
            </div>

            <div id="buttongroup2" class="yui-buttongroup">
                <span id="radio5" class="yui-button yui-radio-button yui-button-checked"><span class="first-child"><button type="button" name="radiofield2" value="Radio 5">Radio 5</button></span></span>
                <span id="radio6" class="yui-button yui-radio-button"><span class="first-child"><button type="button" name="radiofield2" value="Radio 6">Radio 6</button></span></span>
                <span id="radio7" class="yui-button yui-radio-button"><span class="first-child"><button type="button" name="radiofield2" value="Radio 7">Radio 7</button></span></span>
                <span id="radio8" class="yui-button yui-radio-button"><span class="first-child"><button type="button" name="radiofield2" value="Radio 8">Radio 8</button></span></span>
            </div>

        </fieldset>

        <fieldset id="radiobuttonsfromjavascript">
            <legend>From JavaScript</legend>
        </fieldset>

    </fieldset>

    <div>
        <input type="reset" name="resetbutton" value="Reset Form">
        <input type="submit" name="submitbutton" value="Submit Form">
    </div>

</form>