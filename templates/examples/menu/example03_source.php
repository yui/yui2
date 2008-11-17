<script type="text/javascript">

    // Instantiate and render the menu when it is available in the DOM

    YAHOO.util.Event.onContentReady("menuwithgroups", function () {

        /*
             Instantiate a Menu:  The first argument passed to the 
             constructor is the id of the element in the page 
             representing the Menu; the second is an object literal 
             of configuration properties.
        */

        var oMenu = new YAHOO.widget.Menu("menuwithgroups", { fixedcenter: true });


        /*
             Call the "render" method with no arguments since the 
             markup for this Menu instance is already exists in the page.
        */

        oMenu.render();


        YAHOO.util.Event.addListener("menutoggle", "click", oMenu.show, null, oMenu);
    
    });
    
</script>

<button id="menutoggle" type="button">Show Menu</button>

<div id="menuwithgroups" class="yuimenu">
    <div class="bd">
        <ul class="first-of-type">
            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://mail.yahoo.com">Yahoo! Mail</a></li>
            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://addressbook.yahoo.com">Yahoo! Address Book</a></li>
            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://calendar.yahoo.com">Yahoo! Calendar</a></li>
            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://notepad.yahoo.com">Yahoo! Notepad</a></li>
        </ul>
        <ul>
            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://local.yahoo.com">Yahoo! Local</a></li>
            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://maps.yahoo.com">Yahoo! Maps</a></li>
            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://travel.yahoo.com">Yahoo! Travel</a></li>
            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://shopping.yahoo.com">Yahoo! Shopping</a></li>
        </ul>
        <ul>
            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://messenger.yahoo.com">Yahoo! Messenger</a></li>
            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://360.yahoo.com">Yahoo! 360</a></li>
            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://groups.yahoo.com">Yahoo! Groups</a></li>
            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://www.flickr.com">Flickr Photo Sharing</a></li>
        </ul>
    </div>
</div>