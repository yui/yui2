<script type="text/javascript">

    /*
         Initialize and render the Menu when the element it is to be 
         rendered into is ready to be scripted.
    */

    YAHOO.util.Event.onAvailable("rendertarget", function () {

        /*
            "click" event handler for the Menu instance - used to keep the Menu 
            instance visible when clicked, since by default a Menu instance 
            will hide when clicked.
        */

        function onMenuClick(p_sType, p_aArgs, p_oValue) {

            this.show();

        }


        /*
             "click" event handler for each MenuItem instance - used to log 
             info about the MenuItem that was clicked.
        */

        function onMenuItemClick(p_sType, p_aArgs, p_oValue) {

            YAHOO.log(("index: " + this.index + 
                       ", text: " + this.cfg.getProperty("text") + 
                       ", value: " + p_oValue), "info", "example9");
        
        }


        /*
             Instantiate a Menu:  The first argument passed to the 
             constructor is the id of the element in the page 
             representing the Menu; the second is an object literal 
             of configuration properties.
        */

        var oMenu = new YAHOO.widget.Menu("mymenu", { fixedcenter: true });


        /*
            Add items to the Menu instance by passing an array of object literals 
            (each of which represents a set of YAHOO.widget.MenuItem 
            configuration properties) to the "addItems" method.
        */

        oMenu.addItems([

            //  Register a "click" event handler for the first item.

            { text: "Item One", onclick: { fn: onMenuItemClick } },


            /*
                 Register a "click" event handler for the second item, 
                 passing a string arguemnt ("foo") to the event handler.
            */
            { text: "Item Two", onclick: { fn: onMenuItemClick, obj: "foo" } },


            /*
                 Register a "click" event handler for the third item and
                 passing and array as an argument to the event handler.
            */
            { text: "Item Three", onclick: { fn: onMenuItemClick, obj: ["foo", "bar"] } }

        ]);


        oMenu.subscribe("click", onMenuClick);


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