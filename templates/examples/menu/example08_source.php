<script type="text/javascript">

    /*
         Initialize and render the Menu when the element it is to be 
         rendered into is ready to be scripted.
    */

    YAHOO.util.Event.onAvailable("rendertarget", function () {

        /*
             Define an array of object literals, each containing 
             the configuration properties necessary to create a MenuItem and 
             its corresponding submenu.
        */

       var aItems = [
        
            {
                text: "Communication", 
                url: "#communication", 
                submenu: { 
                
                    id: "communication", 
                    itemdata: [ 
            
                        { text: "360", url: "http://360.yahoo.com" },
                        { text: "Alerts", url: "http://alerts.yahoo.com" },
                        { text: "Avatars", url: "http://avatars.yahoo.com" },
                        { text: "Groups", url: "http://groups.yahoo.com " },
                        { text: "Internet Access", url: "http://promo.yahoo.com/broadband" },
                        {
                            text: "PIM", 
                            url: "#pim", 
                            submenu: {
                                id: "pim", 
                                itemdata: [
        
                                    { text: "Yahoo! Mail", url: "http://mail.yahoo.com" },
                                    { text: "Yahoo! Address Book", url: "http://addressbook.yahoo.com" },
                                    { text: "Yahoo! Calendar",  url: "http://calendar.yahoo.com" },
                                    { text: "Yahoo! Notepad", url: "http://notepad.yahoo.com" }
        
                                ] 
                            }
                        
                        }, 
                        { text: "Member Directory", url: "http://members.yahoo.com" },
                        { text: "Messenger", url: "http://messenger.yahoo.com" },
                        { text: "Mobile", url: "http://mobile.yahoo.com" },
                        { text: "Flickr Photo Sharing", url: "http://www.flickr.com" }
            
                    ] 
                
                } 
            
            },

            {
                text: "Shopping", 
                url: "http://shopping.yahoo.com", 
                submenu: {
                    id: "shopping", 
                    itemdata: [

                        { text: "Auctions", url: "http://auctions.shopping.yahoo.com" },
                        { text: "Autos", url: "http://autos.yahoo.com" },
                        { text: "Classifieds", url: "http://classifieds.yahoo.com" },
                        { text: "Flowers & Gifts", url: "http://shopping.yahoo.com/b:Flowers%20%26%20Gifts:20146735" },
                        { text: "Real Estate", url: "http://realestate.yahoo.com" },
                        { text: "Travel", url: "http://travel.yahoo.com" },
                        { text: "Wallet", url: "http://wallet.yahoo.com" },
                        { text: "Yellow Pages", url: "http://yp.yahoo.com" }
            
                    ] 
                } 
            },

            {
                text: "Entertainment", 
                url: "http://entertainment.yahoo.com", 
                submenu: { 
                    id: "entertainment", 
                    itemdata: [
            
                        { text: "Fantasy Sports", url: "http://fantasysports.yahoo.com" },
                        { text: "Games", url: "http://games.yahoo.com" },
                        { text: "Kids", url: "http://www.yahooligans.com" },
                        { text: "Music", url: "http://music.yahoo.com" },
                        { text: "Movies", url: "http://movies.yahoo.com" },
                        { text: "Radio", url: "http://music.yahoo.com/launchcast" },
                        { text: "Travel", url: "http://travel.yahoo.com" },
                        { text: "TV", url: "http://tv.yahoo.com" }              
                    ] 
                } 
            },

            {
                text: "Information", 
                url: "#information", 
                submenu: {
                    id: "information", 
                    itemdata: [
            
                        { text: "Downloads", url: "http://downloads.yahoo.com" },
                        { text: "Finance", url: "http://finance.yahoo.com" },
                        { text: "Health", url: "http://health.yahoo.com" },
                        { text: "Local", url: "http://local.yahoo.com" },
                        { text: "Maps & Directions", url: "http://maps.yahoo.com" },
                        { text: "My Yahoo!", url: "http://my.yahoo.com" },
                        { text: "News", url: "http://news.yahoo.com" },
                        { text: "Search", url: "http://search.yahoo.com" },
                        { text: "Small Business", url: "http://smallbusiness.yahoo.com" },
                        { text: "Weather", url: "http://weather.yahoo.com" }
            
                    ]
                } 
            }            
        ];                


        /*
             Instantiate a Menu:  The first argument passed to the 
             constructor is the id of the element in the page 
             representing the Menu; the second is an object literal 
             of configuration properties.
        */

        var oMenu = new YAHOO.widget.Menu("productsandservices", { fixedcenter: true });


        /*
            Add items to the Menu instance by passing an array of object literals 
            (each of which represents a set of YAHOO.widget.MenuItem 
            configuration properties) to the "addItems" method.
        */

        oMenu.addItems(aItems);


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