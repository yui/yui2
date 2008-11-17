<script type="text/javascript">

    YAHOO.example.init = function () {

        // "contentready" event handler for the "submitbuttonsfrommarkup" <fieldset>
        
        YAHOO.util.Event.onContentReady("submitbuttonsfrommarkup", function () {

            // Create a Button using an existing <input> element as a data source

            var oSubmitButton1 = new YAHOO.widget.Button("submitbutton1", { value: "submitbutton1value" });

            // Create a Button using an existing <button> element as a data source

            var oSubmitButton2 = new YAHOO.widget.Button("submitbutton2");

            // Create a Button using the YUI Button markup

            var oSubmitButton3 = new YAHOO.widget.Button("submitbutton3", { value: "submitbutton3value" });
            
            var oSubmitButton4 = new YAHOO.widget.Button("submitbutton4", { type: "submit", value:  "submitbutton4value" });        
        
        });
        

        // Create a Button without using existing markup

        var oSubmitButton5 = new YAHOO.widget.Button({ type: "submit", label: "Submit Form", id: "submitbutton5", name: "submitbutton5", value:  "submitbutton5value", container: "submitbuttonsfromjavascript" });

        function onExampleSubmit(p_oEvent) {

            var bSubmit = window.confirm("Are you sure you want to submit this form?");

            if(!bSubmit) {
            
                YAHOO.util.Event.preventDefault(p_oEvent);
            
            }

        }

        YAHOO.util.Event.on("button-example-form", "submit", onExampleSubmit);

    } ();

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

    <fieldset>
        <legend>Info</legend>

        <label for="firstname">First Name: </label><input type="text" id="firstname" name="firstname" value="">
        <label for="lastname">Last Name: </label><input type="text" id="lastname" name="lastname" value="">

        <div>
            <label for="male">Gender: </label>
            
            <label for="male">Male </label>
            <input type="radio" id="male" name="gender" value="male" checked>
            
            <label for="female">Female </label>
            <input type="radio" id="female" name="gender" value="female">
        </div>

        <div>
            <label for="month">Birthday: </label>
            <select id="month" name="month"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option></select>
            <select name="day"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option><option value="24">24</option><option value="25">25</option><option value="26">26</option><option value="27">27</option><option value="28">28</option><option value="29">29</option><option value="30">30</option><option value="31">31</option></select>
            <input type="text" name="year" value="">
        </div>

    </fieldset>

    <fieldset id="submitbuttons">
        <legend>Submit Buttons</legend>

        <fieldset id="submitbuttonsfrommarkup">
            <legend>From Markup</legend>

            <div>
                <input id="submitbutton1" type="submit" name="submitfield1" value="Submit Form">
                <button id="submitbutton2" type="submit" name="submitfield2" value="submitfield2value">Submit Form</button>            
            </div>

            <div>
                <span id="submitbutton3" class="yui-button yui-submit-button"><span class="first-child"><input type="submit" name="submitfield3" value="Submit Form"></span></span>
                <span id="submitbutton4" class="yui-button yui-submit-button"><span class="first-child"><button type="button" name="submitfield4">Submit Form</button></span></span>
            </div>

        </fieldset>

        <fieldset id="submitbuttonsfromjavascript">
            <legend>From JavaScript</legend>
        </fieldset>

    </fieldset>

</form>