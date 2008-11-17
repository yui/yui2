<script type="text/javascript">

    /*
         Initialize and render the Menu when its elements are ready 
         to be scripted.
    */

    YAHOO.util.Event.onContentReady("basicmenu", function () {
    
        /*
             Instantiate a Menu:  The first argument passed to the 
             constructor is the id of the element in the page 
             representing the Menu; the second is an object literal 
             of configuration properties.
        */

        var oMenu = new YAHOO.widget.Menu("basicmenu", { fixedcenter: true });


        /*
             Call the "render" method with no arguments since the 
             markup for this Menu instance is already exists in the page.
        */

        oMenu.render();


        YAHOO.util.Event.addListener("menutoggle", "click", oMenu.show, null, oMenu);
    
    });
    
</script>

<button id="menutoggle" type="button">Show Menu</button>

<div id="basicmenu" class="yuimenu">
    <div class="bd">
        <ul class="first-of-type">
            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://mail.yahoo.com">Yahoo! Mail</a></li>
            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://addressbook.yahoo.com">Yahoo! Address Book</a></li>
            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://calendar.yahoo.com">Yahoo! Calendar</a></li>
            <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://notepad.yahoo.com">Yahoo! Notepad</a></li>
        </ul>            
    </div>
</div>