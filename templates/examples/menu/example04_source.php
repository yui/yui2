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

        var oMenu = new YAHOO.widget.Menu("menuwithgroups", { fixedcenter: true });

        /*
            Add items to the Menu instance by passing an array of object literals 
            (each of which represents a set of YAHOO.widget.MenuItem 
            configuration properties) to the "addItems" method.
        */

        oMenu.addItems([

            [
                { text: "Yahoo! Mail", url: "http://mail.yahoo.com" },
                { text: "Yahoo! Address Book", url: "http://addressbook.yahoo.com" },
                { text: "Yahoo! Calendar", url: "http://calendar.yahoo.com" },
                { text: "Yahoo! Notepad", url: "http://notepad.yahoo.com" }
            ],

            [

                { text: "Yahoo! Local", url: "http://local.yahoo.com" },
                { text: "Yahoo! Maps", url: "http://maps.yahoo.com" },
                { text: "Yahoo! Travel", url: "http://travel.yahoo.com" },
                { text: "Yahoo! Shopping", url: "http://shopping.yahoo.com" } 
            
            ],

            [

                { text: "Yahoo! Messenger", url: "http://messenger.yahoo.com" },
                { text: "Yahoo! 360", url: "http://360.yahoo.com" },
                { text: "Yahoo! Groups", url: "http://groups.yahoo.com" },
                { text: "Flickr Photo Sharing", url: "http://www.flickr.com" }
            
            ]
        
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