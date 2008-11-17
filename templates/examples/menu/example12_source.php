<script type="text/javascript">

    /*
         Initialize and render the Menu when the element it is to be 
         rendered into is ready to be scripted.
    */

    YAHOO.util.Event.onAvailable("rendertarget", function () {

        /*
             "configChange" event handler for each MenuItem instance - used 
             to log info about the configuration property that was changed.
        */

        function onMenuItemConfigChange(p_sType, p_aArgs) {

            var sPropertyName = p_aArgs[0][0],
                sPropertyValue = p_aArgs[0][1];

            YAHOO.log(("Index: " + this.index + ", " +
                       "Group Index: " + this.groupIndex + ", " +
                       "Custom Event Type: " + p_sType + ", " +                  
                       "\"" + sPropertyName + "\" Property Set To: \"" 
                       + sPropertyValue + "\""), "info", "example12");
        
        }


        /*
             Instantiate a Menu:  The first argument passed to the 
             constructor is the id of the element in the page 
             representing the Menu; the second is an object literal 
             of configuration properties.
        */

        var oMenu = new YAHOO.widget.Menu("basicmenu", { fixedcenter: true });


        /*
             Subscribe to the Menu instance's "itemAdded" event in order to 
             subscribe to the "configChange" event handler of each MenuItem 
             instance's configuration object.
        */

        oMenu.subscribe("itemAdded", function (p_sType, p_aArgs) {

            var oMenuItem = p_aArgs[0];
           
            /*
                 Subscribe to the "configChange" event handler of each MenuItem 
                 instance's configuration object.
            */

            oMenuItem.cfg.subscribe("configChanged", onMenuItemConfigChange);

        });


        /*
            Add items to the Menu instance by passing an array of strings 
            (each of which represents the "text" configuration property of a 
            YAHOO.widget.MenuItem instance) to the "addItems" method.
        */

        oMenu.addItems([
            
                "Selected MenuItem",
                "Disabled MenuItem",
                "MenuItem With A URL",
                "Checked MenuItem"

            ]);


        /*
            Since this Menu instance is built completely from script, call the 
            "render" method passing in the DOM element that it should be 
            appended to.
        */

        oMenu.render("rendertarget");


        /*
             Set a configuration property of each MenuItem to trigger the firing
             of its configuration object's "configChanged" event.
        */

        oMenu.getItem(0).cfg.setProperty("selected", true);
        oMenu.getItem(1).cfg.setProperty("disabled", true);
        oMenu.getItem(2).cfg.setProperty("url", "http://www.yahoo.com");
        oMenu.getItem(3).cfg.setProperty("checked", true);
        

        YAHOO.util.Event.addListener("menutoggle", "click", oMenu.show, null, oMenu);

    });
    
</script>

<button id="menutoggle" type="button">Show Menu</button>
<div id="rendertarget"></div>