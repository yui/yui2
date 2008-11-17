<p>
Begin by placing the markup for the two-column Grid on the page (this 
example uses the <a href="../grids/grids-t1.html">Grids Preset Template 1, 
160px left</a>).  Add the markup for the MenuBar instance to the 
right column of the grid, appending the class of "yuimenubarnav" to 
the root element.  The application of the "yuimenubarnav" class  
will render each item in the MenuBar instance with arrows to the right of each 
text label, providing a visual cue that the item contains a submenu.
</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<div id="productsandservices" class="yuimenubar yuimenubarnav">
    <!-- Additional Menubar markup here -->
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

    /*
         Call the "render" method with no arguments since the 
         markup for this MenuBar instance is already exists in 
         the page.
    */

    oMenuBar.render();

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