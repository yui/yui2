<script type="text/javascript">

    /*
         Initialize and render the Menu when the element it is to be 
         rendered into is ready to be scripted.
    */

    YAHOO.util.Event.onAvailable("rendertarget", function () {

        /*
             Instantiate a Menu:  The first argument passed to the 
             constructor is the id of the element in the page 
             representing the Menu; the second is an object literal 
             of configuration properties.
        */

        var oMenu = new YAHOO.widget.Menu("basicmenu", { fixedcenter: true } );


        /*
            Add items to the Menu instance by passing an array of object literals 
            (each of which represents a set of YAHOO.widget.MenuItem 
            configuration properties) to the "addItems" method.
        */

        oMenu.addItems([

                { text: "Selected MenuItem", selected: true },
                { text: "Disabled MenuItem", disabled: true },
                { text: "MenuItem With A URL", url: "http://www.yahoo.com" },
                { text: "Checked MenuItem", checked: true }

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