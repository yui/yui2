<p>
Begin by defining an array of <a href="/yui/docs/YAHOO.widget.MenuItem.html#configattributes">MenuItem configuration properties</a> 
that describe each item in the MenuBar.  
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
/*
     Define an array of object literals, each containing 
     the data necessary to create the items for a MenuBar.
*/

var aItemData = [

    { 
        text: "<em id=\"yahoolabel\">Yahoo!</em>", 
        submenu: { 
            id: "yahoo", 
            itemdata: [
                "About Yahoo!",
                "YUI Team Info",
                "Preferences"
            ]
        }
        
    },

    { 
        text: "File", 
        submenu: {  
            id: "filemenu", 
            itemdata: [

                { text: "New File", helptext: "Ctrl + N" },
                "New Folder",
                { text: "Open", helptext: "Ctrl + O" },
                { 
                    text: "Open With...", 
                    submenu: { 
                        id: "applications", 
                        itemdata: [
                            "Application 1", 
                            "Application 2", 
                            "Application 3", 
                            "Application 4"
                        ] 
                    } 
                },
                { text: "Print", helptext: "Ctrl + P" }

            ] 
        }
    
    },
    
    {
        text: "Edit", 
        submenu: { 
            id: "editmenu", 
            itemdata: [

                [ 
                    { text: "Undo", helptext: "Ctrl + Z" },
                    { text: "Redo", helptext: "Ctrl + Y", disabled: true }
                ],
                
                [
                    { text: "Cut", helptext: "Ctrl + X", disabled: true },
                    { text: "Copy", helptext: "Ctrl + C", disabled: true },
                    { text: "Paste", helptext: "Ctrl + V" },
                    { text: "Delete", helptext: "Del", disabled: true }
                ],
                
                [ { text: "Select All", helptext: "Ctrl + A" } ],

                [
                    { text: "Find", helptext: "Ctrl + F" },
                    { text: "Find Again", helptext: "Ctrl + G" }
                ]
    
        ] }

    },

    "View",

    "Favorites",

    "Tools",

    "Help"
];
</textarea>
<p>
Next use the <a href="../../event/#onavailable"><code>onDOMReady</code> 
method of the Event</a> utility to instantiate the MenuBar as soon as the 
page's DOM is available for scripting.
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
/*
     Initialize and render the MenuBar when the page's DOM is ready 
     to be scripted.
*/

YAHOO.util.Event.onDOMReady(function () {

    /*
         Instantiate a MenuBar:  The first argument passed to the 
         constructor is the id of the element to be created; the 
         second is an object literal of configuration properties.
    */

    var oMenuBar = new YAHOO.widget.MenuBar("mymenubar", { 
                                                lazyload: true, 
                                                itemdata: aItemData 
                                                });


    /*
         Since this MenuBar instance is built completely from 
         script, call the "render" method passing in a node 
         reference for the DOM element that its should be 
         appended to.
    */

    oMenuBar.render(document.body);
    

	// Add a "show" event listener for each submenu.
	
	function onSubmenuShow() {

		var oIFrame,
			oElement,
			nOffsetWidth;


		// Keep the left-most submenu against the left edge of the browser viewport

		if (this.id == "yahoo") {
			
			YAHOO.util.Dom.setX(this.element, 0);

			oIFrame = this.iframe;            


			if (oIFrame) {
	
				YAHOO.util.Dom.setX(oIFrame, 0);
	
			}
			
			this.cfg.setProperty("x", 0, true);
		
		}


		/*
			Need to set the width for submenus of submenus in IE to prevent the mouseout 
			event from firing prematurely when the user mouses off of a MenuItem's 
			text node.
		*/

		if ((this.id == "filemenu" || this.id == "editmenu") && YAHOO.env.ua.ie) {

			oElement = this.element;
			nOffsetWidth = oElement.offsetWidth;
	
			/*
				Measuring the difference of the offsetWidth before and after
				setting the "width" style attribute allows us to compute the 
				about of padding and borders applied to the element, which in 
				turn allows us to set the "width" property correctly.
			*/
			
			oElement.style.width = nOffsetWidth + "px";
			oElement.style.width = (nOffsetWidth - (oElement.offsetWidth - nOffsetWidth)) + "px";
		
		}

	}
    

    // Subscribe to the "show" event for each submenu
    
    oMenuBar.subscribe("show", onSubmenuShow);

});
</textarea>
<p>
The "lazyload" property is set to "true" to help speed up the initial load time 
of the MenuBar instance by deferring the initialization and rendering of each 
submenu until just before it is initially made visible.  The "itemdata" 
property is set to the array of MenuItem configuration properties; each item
in the array will be used to add a new item to the MenuBar when it is rendered.
</p>
<p>
Often the first item in a menu bar has an icon as its label, but no text.  It is
easy to achieve this using CSS, while still ensuring the text of the MenuItem 
is available to users of a screen reader.
</p>
<p>
Start by wrapping the MenuItem's text label in an <code>&#60;em&#62;</code> element.  Next, give 
the <code>&#60;em&#62;</code> a fixed width, and set the "text-indent" property to a value that 
pushes the text beyond the boundaries of element as defined by the width.  Use the "overflow" 
property to hide the text.  Lastly, apply an image to the MenuItem instance via the 
"background" property.
</p>
<textarea name="code" class="CSS" cols="60" rows="1">
em#yahoolabel {

    text-indent: -6em;
    display: block;
    background: url(http://us.i1.yimg.com/us.yimg.com/i/us/nt/b/purpley.1.0.gif) center center no-repeat;
    width: 2em;
    overflow: hidden;

}
</textarea>