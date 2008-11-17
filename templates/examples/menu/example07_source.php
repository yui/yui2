<script type="text/javascript">

    // Instantiate and render the menu when it is available in the DOM

    YAHOO.util.Event.onContentReady("productsandservices", function () {

        /*
            Instantiate the menu and corresponding submenus. The first argument passed 
            to the constructor is the id of the element in the DOM that represents 
            the menu; the second is an object literal representing a set of 
            configuration properties for the menu.
        */ 

        var oMenu = new YAHOO.widget.Menu("productsandservices", { fixedcenter: true });


        /*
             Call the "render" method with no arguments since the 
             markup for this Menu instance is already exists in the page.
        */

        oMenu.render();


        YAHOO.util.Event.addListener("menutoggle", "click", oMenu.show, null, oMenu);
    
    });
    
</script>

<button id="menutoggle" type="button">Show Menu</button>

<div id="productsandservices" class="yuimenu">
    <div class="bd">
        <ul class="first-of-type">
            <li class="yuimenuitem">
            
                <a class="yuimenuitemlabel" href="#communication">Communication</a>

                <div id="communication" class="yuimenu">
                    <div class="bd">
                        <ul>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://360.yahoo.com">360&#176;</a></li>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://alerts.yahoo.com">Alerts</a></li>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://avatars.yahoo.com">Avatars</a></li>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://groups.yahoo.com">Groups</a></li>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://promo.yahoo.com/broadband/">Internet Access</a></li>
                            <li class="yuimenuitem">
                            
                                <a class="yuimenuitemlabel" href="#pim">PIM</a>
                            
                                <div id="pim" class="yuimenu">
                                    <div class="bd">
                                        <ul class="first-of-type">
                                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://mail.yahoo.com">Yahoo! Mail</a></li>
                                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://addressbook.yahoo.com">Yahoo! Address Book</a></li>
                                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://calendar.yahoo.com">Yahoo! Calendar</a></li>
                                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://notepad.yahoo.com">Yahoo! Notepad</a></li>
                                        </ul>            
                                    </div>
                                </div>                    
                            
                            </li>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://members.yahoo.com">Member Directory</a></li>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://messenger.yahoo.com">Messenger</a></li>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://mobile.yahoo.com">Mobile</a></li>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://www.flickr.com">Flickr Photo Sharing</a></li>
                        </ul>
                    </div>
                </div>                    
            
            </li>
            <li class="yuimenuitem">
            
                <a class="yuimenuitemlabel" href="http://shopping.yahoo.com">Shopping</a>

                <div id="shopping" class="yuimenu">
                    <div class="bd">                    
                        <ul>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://auctions.shopping.yahoo.com">Auctions</a></li>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://autos.yahoo.com">Autos</a></li>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://classifieds.yahoo.com">Classifieds</a></li>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://shopping.yahoo.com/b:Flowers%20%26%20Gifts:20146735">Flowers &#38; Gifts</a></li>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://realestate.yahoo.com">Real Estate</a></li>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://travel.yahoo.com">Travel</a></li>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://wallet.yahoo.com">Wallet</a></li>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://yp.yahoo.com">Yellow Pages</a></li>
                        </ul>
                    </div>
                </div>                    
            
            </li>
            <li class="yuimenuitem">
            
                <a class="yuimenuitemlabel" href="http://entertainment.yahoo.com">Entertainment</a>

                <div id="entertainment" class="yuimenu">
                    <div class="bd">                    
                        <ul>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://fantasysports.yahoo.com">Fantasy Sports</a></li>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://games.yahoo.com">Games</a></li>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://www.yahooligans.com">Kids</a></li>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://music.yahoo.com">Music</a></li>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://movies.yahoo.com">Movies</a></li>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://music.yahoo.com/launchcast">Radio</a></li>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://travel.yahoo.com">Travel</a></li>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://tv.yahoo.com">TV</a></li>
                        </ul>                    
                    </div>
                </div>                                        
            
            </li>
            <li class="yuimenuitem">
            
                <a class="yuimenuitemlabel" href="#information">Information</a>

                <div id="information" class="yuimenu">
                    <div class="bd">                                        
                        <ul>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://downloads.yahoo.com">Downloads</a></li>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://finance.yahoo.com">Finance</a></li>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://health.yahoo.com">Health</a></li>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://local.yahoo.com">Local</a></li>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://maps.yahoo.com">Maps &#38; Directions</a></li>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://my.yahoo.com">My Yahoo!</a></li>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://news.yahoo.com">News</a></li>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://search.yahoo.com">Search</a></li>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://smallbusiness.yahoo.com">Small Business</a></li>
                            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://weather.yahoo.com">Weather</a></li>
                        </ul>                    
                    </div>
                </div>                                        
            
            </li>
        </ul>            
    </div>
</div>