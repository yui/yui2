<script type="text/javascript">

    /*
         Initialize and render the Menu when the element it is to be 
         rendered into is ready to be scripted.
    */

    YAHOO.util.Event.onAvailable("rendertarget", function () {

        /*
             Generic event handler used to log info about the DOM events for 
             the Menu instance.
        */
        
        function onMenuEvent(p_sType, p_aArgs) {
        
            var oDOMEvent = p_aArgs[0];

            YAHOO.log(("Id: " + this.id + ", " +
                       "Custom Event Type: " + p_sType + ", " +                  
                       "DOM Event Type: " + oDOMEvent.type), 
                       "info", "example10");
        }


        /*
             Generic event handler used to log info about the DOM events for 
             each MenuItem instance.
        */

        function onMenuItemEvent(p_sType, p_aArgs) {

            var oDOMEvent = p_aArgs[0];

            YAHOO.log(("Index: " + this.index + ", " +
                       "Group Index: " + this.groupIndex + ", " +
                       "Custom Event Type: " + p_sType + ", " +                  
                       "DOM Event Type: " + oDOMEvent.type
                       ), "info", "example10");
            
        }


        /*
             Instantiate a Menu:  The first argument passed to the 
             constructor is the id of the element in the page 
             representing the Menu; the second is an object literal 
             of configuration properties.
        */

        var oMenu = new YAHOO.widget.Menu("basicmenu", { fixedcenter: true });


        // Subscribe to the Menu instance's "itemAdded" event

        oMenu.subscribe("itemAdded", function (p_sType, p_aArgs) {
        
            var oMenuItem = p_aArgs[0];
            
            /*
                 Subscribe to each MenuItem instance's DOM events as they
                 are added to the Menu instance.
            */
        
            oMenuItem.subscribe("mouseover", onMenuItemEvent);
            oMenuItem.subscribe("mouseout", onMenuItemEvent);
            oMenuItem.subscribe("mousedown", onMenuItemEvent);
            oMenuItem.subscribe("mouseup", onMenuItemEvent);
            oMenuItem.subscribe("click", onMenuItemEvent);
            oMenuItem.subscribe("keydown", onMenuItemEvent);
            oMenuItem.subscribe("keyup", onMenuItemEvent);
            oMenuItem.subscribe("keypress", onMenuItemEvent);
        
        });


        //  Subscribe to every DOM event for the Menu instance.

        oMenu.subscribe("mouseover", onMenuEvent);
        oMenu.subscribe("mouseout", onMenuEvent);
        oMenu.subscribe("mousedown", onMenuEvent);
        oMenu.subscribe("mouseup", onMenuEvent);
        oMenu.subscribe("click", onMenuEvent);
        oMenu.subscribe("keydown", onMenuEvent);
        oMenu.subscribe("keyup", onMenuEvent);
        oMenu.subscribe("keypress", onMenuEvent);


        /*
            Add items to the Menu instance by passing an array of object literals 
            (each of which represents a set of YAHOO.widget.MenuItem 
            configuration properties) to the "addItems" method.
        */

        oMenu.addItems([
        
                "MenuItem 0",

                "MenuItem 1",

                /*
                     Add a disabled menu item to demonstrate that disabled 
                     items do not respond to DOM events.
                */
                { text: "MenuItem 2", disabled: true },

                "MenuItem 3",

                "MenuItem 4"

            ]);


        /*
            Since this Menu instance is built completely from script, call the 
            "render" method passing in the DOM element that it should be 
            appended to.
        */

        oMenu.render("rendertarget");


        YAHOO.util.Event.addListener("menutoggle", "click", oMenu.show, null, oMenu);
    
    });
    
</script>

<button id="menutoggle" type="button">Show Menu</button>
<div id="rendertarget"></div>