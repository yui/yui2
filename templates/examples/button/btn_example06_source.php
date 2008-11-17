<script type="text/javascript">

    YAHOO.example.init = function () {

        // "contentready" event handler for the "resetbuttonsfrommarkup" <fieldset>

        YAHOO.util.Event.onContentReady("resetbuttonsfrommarkup", function () {

            // Create a Button using an existing <input> element as a data source

            var oResetButton1 = new YAHOO.widget.Button("resetbutton1");

            // Create a Button using an existing <button> element as a data source

            var oResetButton2 = new YAHOO.widget.Button("resetbutton2");


            // Create a Button using the YUI Button markup

            var oResetButton3 = new YAHOO.widget.Button("resetbutton3");

            var oResetButton4 = new YAHOO.widget.Button("resetbutton4", { type: "reset" });
        
        });


        // Create a Button without using existing markup

        var oResetButton5 = new YAHOO.widget.Button({ type: "reset", label: "Reset Form", id: "resetfield5", container:  "resetbuttonsfromjavascript" });

    } ();

</script>

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

    <fieldset id="resetbuttons">
        <legend>Reset Buttons</legend>

        <fieldset id="resetbuttonsfrommarkup">
            <legend>From Markup</legend>

            <div>
                <input id="resetbutton1" type="reset" name="resetfield1" value="Reset Form">
                <button id="resetbutton2" type="reset" name="resetfield2">Reset Form</button>
            </div>

            <div>
                <span id="resetbutton3" class="yui-button yui-reset-button"><span class="first-child"><input type="reset" name="resetfield3" value="Reset Form"></span></span>
                <span id="resetbutton4" class="yui-button yui-reset-button"><span class="first-child"><button type="button" name="resetfield4">Reset Form</button></span></span>
            </div>

        </fieldset>

        <fieldset id="resetbuttonsfromjavascript">
            <legend>From JavaScript</legend>
        </fieldset>

    </fieldset>

</form>