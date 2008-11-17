<p>
Begin by adding the Menu markup to page, leaving off any Menu-specific CSS 
class names from the HTML elements to ensure the markup isn't rendered as a Menu
widget if JavaScript is disabled.
</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<div id="yproducts">
    <div class="bd">
        <ul>
            <li><a href="#">Products</a>
                <div id="products">
                    <div class="bd">
                        <ul>
                            <li><a href="http://mail.yahoo.com">Yahoo! Mail</a></li>
                            <li><a href="http://addressbook.yahoo.com">Yahoo! Address Book</a></li>
                            <li><a href="http://calendar.yahoo.com">Yahoo! Calender</a></li>
                            <li><a href="http://notepad.yahoo.com">Yahoo! Notepad</a></li>
                            <li><a href="http://messenger.yahoo.com">Yahoo! Messenger</a></li>
                            <li><a href="http://360.yahoo.com">Yahoo! 360</a></li>
                            <li><a href="http://www.flickr.com">Flickr Photo Sharing</a></li>
                            <li><a href="http://finance.yahoo.com/">Finance</a></li>
                            <li><a href="http://entertainment.yahoo.com/">Entertainment</a>
                                <div id="entertainmentproducts">
                                    <div class="bd">
                                        <ul>
                                            <li><a href="http://music.yahoo.com/">Yahoo! Music</a></li>
                                            <li><a href="http://movies.yahoo.com/">Yahoo! Movies</a></li>
                                            <li><a href="http://tv.yahoo.com/">Yahoo! TV</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </li>
            <li id="search"><a href="http://search.yahoo.com/">Search</a>
                <div id="searchproducts">
                    <div class="bd">
                        <ul>
                            <li><a href="http://images.search.yahoo.com/images">Yahoo! Image Search</a></li>
                            <li><a href="http://dir.yahoo.com/">Yahoo! Directory</a></li>
                            <li><a href="http://local.yahoo.com">Yahoo! Local</a></li>
                            <li><a href="http://news.search.yahoo.com/news">Yahoo! News Search</a></li>
                            <li><a href="http://search.yahoo.com/people">Yahoo! People Search</a></li>
                            <li><a href="http://search.yahoo.com/products">Yahoo! Product Search</a></li>
                        </ul>
                    </div>
                </div>                    
            </li>
            <li id="help"><a href="http://help.yahoo.com/">Help</a></li>
        </ul>
    </div>
</div>
</textarea>
<p>
Use the <a href="../../event/#onavailable"><code>onContentReady</code> 
method of the Event</a> utility to instantiate the Menu as soon as 
its markup is available for scripting.  Once the Menu is instantiated, the 
necessary Menu CSS class names will be appended to each element, so that the 
<code>&#60;ul&#62;</code> element will be rendered will be rendered as a 
Menu widget.
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
/*
     Initialize and render the MenuBar when its elements are ready 
     to be scripted.
*/

YAHOO.util.Event.onContentReady("yproducts", function () {


    /*
        Apply the "ytoolbar" class to the <H1> so that it is styled 
        like an application toolbar.
    */

    var oH1 = document.getElementsByTagName("h1")[0];

    YAHOO.util.Dom.addClass(oH1, "ytoolbar");


    /*
         Instantiate a Menu:  The first argument passed to the 
         constructor is the id of the element in the page 
         representing the Menu; the second is an object literal 
         of configuration properties.
    */

    var oMenu = new YAHOO.widget.Menu("yproducts", { zindex: 2 });


    /*
         Aligns the bottom-left corner of Menu instance to the  
         top-left corner of the Yahoo! anchor element that is 
         its context element.
    */

    function positionMenu() {

        oMenu.align("bl", "tl");

    }


    // "click" handler for the "Go to..." menu item

    function onGotoClick() {
    
        var sURL = window.prompt("Enter a URL: ","");

        if (sURL && sURL.length > 0) {
            
            document.location = sURL;

        }
    
    }


    /*
          Add an additional item to the Menu instance.  Unlike the 
          other items in the Menu instance, this item is added via 
          script since its functionality requires JavaScript.
    */

    oMenu.addItem({ text: "Go to...", id: "goto", onclick: { fn: onGotoClick } });


    /*
        "beforeShow" event listener - used to position the 
        root Menu instance when it is displayed.
    */

    oMenu.subscribe("beforeShow", function () {
    
        if (this.getRoot() == this) {

            positionMenu();

        }
    
    });


    /*
         Call the "render" method with no arguments since the 
         markup for this menu already exists in the pages.
    */

    oMenu.render();


    /*
        Position the bottom-left corner of the root menu to the 
        top-left corner of the "Yahoo!" anchor element.
    */

    oMenu.cfg.setProperty("context", ["yahoo", "bl", "tl"]);


    // "click" event handler for "Yahoo!" button

    function onYahooClick(p_oEvent) {

        // Position and display the menu
        
        positionMenu();

        oMenu.show();


        // Stop propagation and prevent the default "click" behavior

        YAHOO.util.Event.stopEvent(p_oEvent);
        
    }


    /*
        Assign a "click" event handler to the "Yahoo!" anchor that 
        will display the menu
    */
    
    YAHOO.util.Event.addListener("yahoo", "click", onYahooClick);


    /*
        Add a "resize" event handler for the window that will 
        reposition the H1 "toolbar" to the bottom of the viewport
    */

    YAHOO.widget.Overlay.windowResizeEvent.subscribe(positionMenu);

});
</textarea>
<p>
Skinning the Menu widget is done using CSS.  The stylesheet used for other Menu 
examples is a minified version of the menu-core.css and menu-skin.css files.  
When customizing the Menu skin, use the raw source files as a reference.
</p>
<p>
The menu-core.css file includes foundational styling that controls basic layout 
and positioning, whereas the menu-skin.css file is used to apply colors, 
borders, padding, etc.  Skinning can be accomplished by either overriding the 
styles defined in the menu-skin.css file, or by creating an entirely new skin 
file.  When overriding styles, place them in a separate file to simplify 
integrating with YUI updates.  The follow example illustrates how to override 
some of the default styles defined by the "Sam" skin.
</p>
<textarea name="code" class="CSS" cols="60" rows="1">
/* Define a new style for each menu */

.yui-skin-sam .yuimenu {

    line-height: 2;  /* ~24px */
    *line-height: 1.9; /* For IE */

}

.yui-skin-sam .yuimenu .bd {

    border-width: 2px;
    border-color: #ddd #666 #666 #ddd;
    border-style: solid;
    background-color: #ccc;

}


/* Define a new style for each MenuItem instance. */

.yui-skin-sam #yproducts li.yuimenuitem .yuimenuitemlabel {

    background: url(http://us.i1.yimg.com/us.yimg.com/i/us/nt/b/purpley.1.0.gif) no-repeat 4px;
    padding: 0 20px 0 24px;

}

.yui-skin-sam #yproducts li.yuimenuitem {

    /*
        For IE 7 Quirks and IE 6 Strict Mode and Quirks Mode:
        Used to collapse superfluous white space between <li> 
        elements that is triggered by the "display" property of the
        <a> elements being set to "block."
    */

    _border-bottom: solid 1px #ccc;

}


/* Define a new style for a MenuItem instance's "selected" state. */

.yui-skin-sam #yproducts .yuimenuitem-selected {

    background-color: #039;

}

.yui-skin-sam #yproducts .yuimenuitemlabel-selected {

    color: #fff;

}


/* Add unique icons to some of the MenuItem instances. */

.yui-skin-sam #yproducts li#help .yuimenuitemlabel {

    background-image: url(http://us.i1.yimg.com/us.yimg.com/i/nt/ic/ut/bsc/hlp16_1.gif);

}

.yui-skin-sam #yproducts li#search .yuimenuitemlabel {

    background-image: url(http://us.i1.yimg.com/us.yimg.com/i/nt/ic/ut/bsc/srch16_1.gif);

}

.yui-skin-sam #yproducts li#goto .yuimenuitemlabel {

    background-image: url(http://us.i1.yimg.com/us.yimg.com/i/nt/ic/ut/bsc/arorght16_1.gif);

}
</textarea>