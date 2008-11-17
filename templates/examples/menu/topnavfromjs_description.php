<p>
Begin by placing the markup for the two-column Grid on the page (this 
example uses the <a href="../grids/grids-t1.html">Grids Preset Template 1, 
160px left</a>).  Add the markup for the root MenuBar instance to the 
right column of the grid, appending the class of "yuimenubarnav" to 
the root element.  The application of the "yuimenubarnav" class  
will render each item in the MenuBar instance with arrows to the right of each 
text label, providing a visual cue that the item contains a submenu.
</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<div id="productsandservices" class="yuimenubar yuimenubarnav">
    <div class="bd">
        <ul class="first-of-type">
            <li class="yuimenubaritem first-of-type">
                <a class="yuimenubaritemlabel" href="#communication">Communication</a>
            </li>
            <li class="yuimenubaritem">
                <a class="yuimenubaritemlabel" href="http://shopping.yahoo.com">Shopping</a>
            </li>
            <li class="yuimenubaritem">
                <a class="yuimenubaritemlabel" href="http://entertainment.yahoo.com">Entertainment</a>
            </li>
            <li class="yuimenubaritem">
                <a class="yuimenubaritemlabel" href="#">Information</a>
            </li>
        </ul>
    </div>
</div>
</textarea>
<p>
Use the <a href="../../event/#onavailable"><code>onContentReady</code> 
method of the Event</a> utility to instantiate the MenuBar as soon as 
its markup is available for scripting.
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
/*
     Initialize and render the MenuBar when its elements are ready 
     to be scripted.
*/

YAHOO.util.Event.onContentReady("productsandservices", function () {

    /*
         Instantiate a MenuBar:  The first argument passed to the 
         constructor is the id of the element in the page 
         representing the MenuBar; the second is an object literal 
         of configuration properties.
    */

    var oMenuBar = new YAHOO.widget.MenuBar("productsandservices", { 
                                                autosubmenudisplay: true, 
                                                hidedelay: 750, 
                                                lazyload: true });

});
</textarea>
<p>
This MenuBar instance makes use of several configuration properties.  Setting 
the "autosubmenudisplay" configuration property to "true" modifies its default 
behavior so that mousing over any item in the MenuBar automatically triggers 
the display of its submenu.  The "hidedelay" configuration property is set to 
"750" so each submenu automatically hides 750ms after the user's mouse has left
the menu.  Lastly, the "lazyload" property is set to "true" to help 
speed up the initial load time of the MenuBar instance by deferring the 
initialization and rendering of each submenu until just before it is initially
made visible.
</p>
<p>
Submenus are added to each item in the MenuBar by subscribing to the 
"beforeRender" event and setting the "submenu" configuration property of each 
MenuBarItem instance to an object literal containing the necessary data to 
create the submenu.
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
/*
     Define an array of object literals, each containing 
     the data necessary to create a submenu.
*/

var aSubmenuData = [

    {
        id: "communication", 
        itemdata: [ 
            { text: "360", url: "http://360.yahoo.com" },
            { text: "Alerts", url: "http://alerts.yahoo.com" },
            { text: "Avatars", url: "http://avatars.yahoo.com" },
            { text: "Groups", url: "http://groups.yahoo.com " },
            { text: "Internet Access", url: "http://promo.yahoo.com/broadband" },
            {
                text: "PIM", 
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
            { text: "Flickr Photo Sharing", url: "http://www.flickr.com" },
        ]
    },

    {
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
    },
    
    {
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
    },
    
    {
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
];


/*
     Subscribe to the "beforerender" event, adding a submenu 
     to each of the items in the MenuBar instance.
*/

oMenuBar.subscribe("beforeRender", function () {

    if (this.getRoot() == this) {

        this.getItem(0).cfg.setProperty("submenu", aSubmenuData[0]);
        this.getItem(1).cfg.setProperty("submenu", aSubmenuData[1]);
        this.getItem(2).cfg.setProperty("submenu", aSubmenuData[2]);
        this.getItem(3).cfg.setProperty("submenu", aSubmenuData[3]);

    }

});


/*
     Call the "render" method with no arguments since the 
     markup for this MenuBar instance is already exists in 
     the page.
*/

oMenuBar.render();    
</textarea>