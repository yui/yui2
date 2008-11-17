<script type="text/javascript">

    YAHOO.example.init = function () {

        // "contentready" event handler for the "menubuttonsfrommarkup" <fieldset>

        YAHOO.util.Event.onContentReady("menubuttonsfrommarkup", function () {

            // Create a Button using an existing <input> element as a data source

            var oMenuButton1 = new YAHOO.widget.Button("menubutton1", { type: "menu", menu: "menubutton1select" });

            var oMenuButton2 = new YAHOO.widget.Button("menubutton2", { type: "menu", menu: "menubutton2select" });


            // Create a Button using an existing <input> element and a YAHOO.widget.Overlay instance as its menu

            var oMenuButton3 = new YAHOO.widget.Button("menubutton3", { type: "menu", menu: "menubutton3menu" });
        
        });


        // "click" event handler for each item in the Button's menu

        function onMenuItemClick(p_sType, p_aArgs, p_oItem) {

            oMenuButton4.set("label", p_oItem.cfg.getProperty("text"));
                            
        }


        // Create a Button without using existing markup

        //  Create an array of YAHOO.widget.MenuItem configuration properties

        var aMenuButton4Menu = [

            { text: "one", value: 1, onclick: { fn: onMenuItemClick } },
            { text: "two", value: 2, onclick: { fn: onMenuItemClick } },
            { text: "three", value: 3, onclick: { fn: onMenuItemClick } }
        
        ];

        /*
            Instantiate a Menu Button using the array of YAHOO.widget.MenuItem 
            configuration properties as the value for the "menu" configuration 
            attribute.
        */
        
        var oMenuButton4 = new YAHOO.widget.Button({ type: "menu", label: "one", name: "mymenubutton", menu: aMenuButton4Menu, container: "menubuttonsfromjavascript" });            


        /*
            Search for an element to place the Menu Button into via the 
            Event utilities "onContentReady" method
        */
        
        YAHOO.util.Event.onContentReady("menubuttonsfromjavascript", function () {
        
            // Instantiate an Overlay instance
        
            var oOverlay = new YAHOO.widget.Overlay("menubutton5menu", { visible: false });
            
            oOverlay.setBody("Menu Button 5 Menu");
        
            // Instantiate a Menu Button
        
            var oMenuButton5 = new YAHOO.widget.Button({ type: "menu", label: "Menu Button 5", menu: oOverlay });
            
            /*
                 Append the Menu Button and Overlay to the element with the id 
                 of "menubuttonsfromjavascript"
            */
            
            oMenuButton5.appendTo(this);

            oOverlay.render(this);
        
        });


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

    <fieldset id="menubuttons">
        <legend>Menu Buttons</legend>

        <fieldset id="menubuttonsfrommarkup">
            <legend>From Markup</legend>
            
            <input type="submit" id="menubutton1" name="menubutton1_button" value="Menu Button 1">
            <select id="menubutton1select" name="menubutton1select">
                <option value="0">One</option>
                <option value="1">Two</option>
                <option value="2">Three</option>                
            </select>


            <input type="button" id="menubutton2" name="menubutton2_button" value="Menu Button 2">
            <select id="menubutton2select" name="menubutton2select">
                <option value="0">One</option>
                <option value="1">Two</option>
                <option value="2">Three</option>                
            </select>

            <input type="button" id="menubutton3" name="menubutton3_button" value="Menu Button 3">
            <div id="menubutton3menu" class="yui-overlay">
                <div class="bd">Menu Button 3 Menu</div>
            </div>

        </fieldset>

        <fieldset id="menubuttonsfromjavascript">
            <legend>From JavaScript</legend>
        </fieldset>
        
    </fieldset>

</form>