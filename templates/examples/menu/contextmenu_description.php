<p>
Begin by defining an array of text labels, each of which represents an item in 
the ContextMenu.  Next, use the 
<a href="../../event/#onavailable"><code>onContentReady</code> method of the 
Event</a> utility to instantiate the ContextMenu as soon as the elements whose 
"contextmenu" event trigger its display are ready to be scripted.
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
/*
     Initialize the ContextMenu instances when the the elements 
     that trigger their display are ready to be scripted.
*/

YAHOO.util.Event.onContentReady("clones", function () {

    /*
         Array of text labels for the MenuItem instances to be
         added to the ContextMenu instanc.
    */

    var aMenuItems = ["Edit Name", "Clone", "Delete" ]; 


    /*
         Instantiate a ContextMenu:  The first argument passed to 
         the constructor is the id of the element to be created; the 
         second is an object literal of configuration properties.
    */

    var oEweContextMenu = new YAHOO.widget.ContextMenu(
                                "ewecontextmenu", 
                                {
                                    trigger: oClones.childNodes,
                                    itemdata: aMenuItems,
                                    lazyload: true                                    
                                } 
                            );
     
});
</textarea>
<p>
This ContextMenu makes use of a couple configuration properties, each of 
which is set via an object literal passed as the second argument to the 
constructor.  The "trigger" configuration property defines the element(s) whose 
"contextmenu" event trigger the display of the ContextMenu instance.  In this 
case, each <code>&#60;li&#62;</code> element of the 
<code>&#60;ul id="clones"&#62;</code> element is a trigger for the ContextMenu. 
The "lazyload" property is used speed up the initial load time of the 
ContextMenu instance.  By setting the "lazyload" property to "true," the 
ContextMenu will not be appended to the page until the initial firing of a 
"contextmenu" event by one of the elements defined as its trigger.  
Additionally, use of the "lazyload" property defers the initialization and 
rendering of submenus until just before it is initially made visible.  Lastly,
the "itemdata" property is set to the array of MenuItem configuration 
properties; each item in the array will be used to add a new item to the 
ContextMenu when it is rendered.
</p>
<p>
When multiple elements are defined as the "trigger" for a ContextMenu instance,
the "contextEventTarget" property can be used to determine which element 
triggered its display.  The "contextEventTarget" property returns a reference 
to the HTML element whose "contextmenu" event triggered the display of the 
ContextMenu instance.  In this example, the "contextEventTarget" property is 
used inside the scope of a "click" event listener (see "onEweContextMenuClick") 
to determine which <code>&#60;li&#62;</code> element triggered the display 
of the "ewe" ContextMenu instance.
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
// Maintain a reference to the "clones" <ul>

var oClones = this;


// Clone the first ewe so that we can create more later

var oLI = oClones.getElementsByTagName("li")[0];
var oEweTemplate = oLI.cloneNode(true);


// Renames an "ewe"

function editEweName(p_oLI) {

    var oCite = p_oLI.lastChild;


    if (oCite.nodeType != 1) {
    
        oCite = oCite.previousSibling;

    }

    var oTextNode = oCite.firstChild;

    var sName = window.prompt("Enter a new name for ", 
                oTextNode.nodeValue);


    if (sName && sName.length > 0) {
        
        oTextNode.nodeValue = sName;

    }

}


// Clones an "ewe"

function cloneEwe(p_oLI, p_oMenu) {

    var oClone = p_oLI.cloneNode(true);

    p_oLI.parentNode.appendChild(oClone);

    p_oMenu.cfg.setProperty("trigger", oClones.childNodes);

}


// Deletes an "ewe"

function deleteEwe(p_oLI) {

    var oUL = p_oLI.parentNode;

    oUL.removeChild(p_oLI);

}


// "click" event handler for each item in the ewe context menu

function onEweContextMenuClick(p_sType, p_aArgs) {

	/*
		 The second item in the arguments array (p_aArgs) 
		 passed back to the "click" event handler is the 
		 MenuItem instance that was the target of the 
		 "click" event.
	*/

	var oItem = p_aArgs[1], // The MenuItem that was clicked
		oTarget = this.contextEventTarget,
		oLI;


	if (oItem) {

		oLI = oTarget.nodeName.toUpperCase() == "LI" ? 
				oTarget : YAHOO.util.Dom.getAncestorByTagName(oTarget, "LI");


		switch (oItem.index) {
		
			case 0:     // Edit name

				editEweName(oLI);
			
			break;


			case 1:     // Clone

				cloneEwe(oLI, this);

			break;
			

			case 2:     // Delete

				deleteEwe(oLI);

			break;                    
		
		}
	
	}

}

// "render" event handler for the ewe context menu

function onContextMenuRender(p_sType, p_aArgs) {

    //  Add a "click" event handler to the ewe context menu

    this.subscribe("click", onEweContextMenuClick);

}


// Add a "render" event handler to the ewe context menu

oEweContextMenu.subscribe("render", onContextMenuRender);
</textarea>
<p>
In the example above, a single "click" event handler is added to the 
ContextMenu instance and discrete functionality is executed depending of the 
index of the MenuItem instance that was the target of the event.  An 
alternative way of listening for the "click" event on MenuItem instances is to 
use the "onclick" configuration property.  The "onclick" configuration property 
provides an easy way define a "click " event listener for individual items when 
building menus from script.  The "onclick" configuration property accepts an 
object literal representing the code to be executed when the MenuItem instance 
is clicked.  The format for the object literal is:
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
{
    fn: Function (Required),    // The handler to call when the event fires.
    obj: Object (Optional), // An object to pass back to the handler.
    scope: Object (Optional)    // The object to use for the scope of the handler. (By default the scope is the YAHOO.widget.MenuItem instance)
}
</textarea>
<p>
The second ContextMenu instance in this example makes use of the "onclick"
configuration property:
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
// Deletes an ewe from the field

function deleteEwes() {

    oEweContextMenu.cfg.setProperty("target", null);

    oClones.innerHTML = "";


    function onHide(p_sType, p_aArgs, p_oItem) {

        p_oItem.cfg.setProperty("disabled", true);
    
        p_oItem.parent.unsubscribe("hide", onHide, p_oItem);
    
    }

    this.parent.subscribe("hide", onHide, this);

}


// Creates a new ewe and appends it to the field

function createNewEwe() {

    var oLI = oEweTemplate.cloneNode(true);
    
    oClones.appendChild(oLI);

    this.parent.getItem(1).cfg.setProperty("disabled", false);

    oEweContextMenu.cfg.setProperty("trigger", oClones.childNodes);

}


// Sets the color of the grass in the field

function setFieldColor(p_sType, p_aArgs, p_sColor) {

    var oCheckedItem = this.parent.checkedItem;

    if (oCheckedItem != this) {

        YAHOO.util.Dom.setStyle("clones", "backgroundColor", p_sColor);
        
        this.cfg.setProperty("checked", true);


        oCheckedItem.cfg.setProperty("checked", false);

        this.parent.checkedItem = this;
    
    }

}


// "render" event handler for the field context menu

function onFieldMenuRender(p_sType, p_aArgs) {

    if (this.parent) {  // submenu

        this.checkedItem = this.getItem(0);

    }

}


/*
     Array of object literals - each containing configuration 
     properties for the items for the context menu.
*/

var oFieldContextMenuItemData = [

    {
        text: "Field color", 
        submenu: { 
            id: "fieldcolors", 
            itemdata: [
                { text: "Light Green", onclick: { fn: setFieldColor, obj: "#99cc66", checked: true } }, 
                { text: "Medium Green", onclick: { fn: setFieldColor, obj: "#669933" } }, 
                { text: "Dark Green", onclick: { fn: setFieldColor, obj: "#336600" } }
            ] 
        } 
    },
    { text: "Delete all", onclick: { fn: deleteEwes } },
    { text: "New Ewe", onclick: { fn: createNewEwe } }

];


/*
     Instantiate a ContextMenu:  The first argument passed to 
     the constructor is the id of the element to be created; the 
     second is an object literal of configuration properties.
*/

var oFieldContextMenu = new YAHOO.widget.ContextMenu(
                                "fieldcontextmenu",
                                {
                                    trigger: "clones",
                                    itemdata: oFieldContextMenuItemData,
                                    lazyload: true
                                }
                            );


// Add a "render" event handler to the field context menu

oFieldContextMenu.subscribe("render", onFieldMenuRender);
</textarea>