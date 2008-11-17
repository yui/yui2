<p>
Begin by placing the markup for the two-column Grid on the page (this 
example uses the <a href="../grids/grids-t1.html">Grids Preset Template 1, 
160px left</a>).  Next add the Menu markup to the left column of the grid.
</p>
<p>
Use the <a href="../../event/#onavailable"><code>onContentReady</code> 
method of the Event</a> utility to instantiate the Menu as soon as 
its markup is available for scripting.
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
/*
     Initialize and render the Menu when its elements are ready 
     to be scripted.
*/

YAHOO.util.Event.onContentReady("productsandservices", function () {

    /*
         Instantiate a Menu:  The first argument passed to the 
         constructor is the id of the element in the page 
         representing the Menu; the second is an object literal 
         of configuration properties.
    */

    var oMenu = new YAHOO.widget.Menu("productsandservices", { 
                                            position: "static", 
                                            hidedelay:  750, 
                                            lazyload: true });

    /*
         Call the "render" method with no arguments since the 
         markup for this Menu instance is already exists in the page.
    */

    oMenu.render();            

});
</textarea>
<p>
This Menu instance makes use of several configuration properties.  Setting 
the "autosubmenudisplay" configuration property to "true" modifies its default 
behavior so that mousing over any item in the Menu automatically triggers 
the display of its submenu.  The "hidedelay" configuration property is set to 
"750" so each submenu automatically hides 750ms after the user's mouse has left
the menu.  Lastly, the "lazyload" property is set to "true" to help 
speed up the initial load time of the Menu instance by deferring the 
initialization and rendering of each submenu until just before it is initially
made visible.
</p>
<p>
Finally, it is necessary to set the "position" CSS property of the root Menu 
instance's element (<code>&#60;div id="#productsandservices"&#62;</code>) to 
"static" to match that of the "position" configuration property.
</p>
<textarea name="code" class="CSS" cols="60" rows="1">
#productsandservices {
    
    position: static;
    
}
</textarea>