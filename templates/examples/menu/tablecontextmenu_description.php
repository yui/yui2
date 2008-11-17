<p>
When adding context menus to large data structures like a 
<code>&#60;table&#62;</code> or large list (<code>&#60;ol&#62;</code> 
or <code>&#60;ul&#62;</code>), it is recommended to bind a single 
YAHOO.widget.ContextMenu instance to the structure's root element, than to each of its 
child nodes (<code>&#60;tr&#62;</code>s or <code>&#60;li&#62;</code>s).
Doing so significantly improves the performance of a web page or 
application by reducing the number of "contextmenu" event handlers 
as well as the number of YAHOO.widget.ContextMenu instances in memory.
</p>
<p>
Begin by creating an <code>&#60;table&#62;</code> and giving 
<code>&#60;tr&#62;</code> elements that should have the same context menu a 
similar class name.
</p>

<p>
Next, use the <a href="../../event/#onavailable"><code>onContentReady</code> 
method of the Event</a> utility to listen for when the <code>&#60;table&#62;</code>
element is are ready to be scripted.
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.util.Event.onContentReady("dataset", function () {


});			
</textarea>

<p>
Inside the function passed to the Event Utility's <code>onContentReady</code> method, create a 
shortcut to the Dom Utility (since it will be used frequently) and an object literal that maps each 
class name to a set of MenuItem configuration properties.
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.util.Event.onContentReady("dataset", function () {

	var Dom = YAHOO.util.Dom;

	/*
		Map of CSS class names to arrays of MenuItem 
		configuration properties.
	*/

	var oContextMenuItems = {
	
		"type1": [
					"Context Menu 1, Item 1", 
					{
						text: "Context Menu 1, Item 2", 
						submenu: { 
									id: "submenu1", 
									lazyload: true, 
									itemdata: [
										"Context Menu 1 Submenu, Item 1", 
										"Context Menu 1 Submenu, Item 2", 
										"Context Menu 1 Submenu, Item 3", 
										"Context Menu 1 Submenu, Item 4"
									] 
								} 
					}, 
					"Context Menu 1, Item 3", 
					"Context Menu 1, Item 4"
				],

		"type2": [
					"Context Menu 2, Item 1", 
					"Context Menu 2, Item 2", 
					"Context Menu 2, Item 3", 
					"Context Menu 2, Item 4", 
					"Context Menu 2, Item 5", 
					"Context Menu 2, Item 6", 
					"Context Menu 2, Item 7", 
					"Context Menu 2, Item 8", 
					"Context Menu 2, Item 9", 
					"Context Menu 2, Item 10"
				],

		"type3": [
					"Context Menu 3, Item 1", 
					"Context Menu 3, Item 2", 
					"Context Menu 3, Item 3", 
					"Context Menu 3, Item 4"
				],

		"type4": [
					"Context Menu 4, Item 1", 
					"Context Menu 4, Item 2"
				],

		"type5": [
					"Context Menu 5, Item 1", 
					"Context Menu 5, Item 2", 
					"Context Menu 5, Item 3", 
					"Context Menu 5, Item 4", 
					"Context Menu 5, Item 5", 
					"Context Menu 5, Item 6"
				]
	
	};

});
</textarea>

<p>
Lastly, add a "beforeShow" event handler to the ContextMenu instance.  
This event handler makes use of the "contextEventTarget" property to determine
which <code>&#60;tr&#62;</code> element was the target of the "contextmenu" 
event.  Once found, the <code>&#60;tr&#62;</code> element's class name is 
used to look up its corresponding menu items in the "oContextMenuItems" 
map, which are then added to the ContextMenu instance via the "addItems" method.
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.util.Event.onContentReady("dataset", function () {

	var Dom = YAHOO.util.Dom;

	/*
		Map of CSS class names to arrays of MenuItem 
		configuration properties.
	*/

	var oContextMenuItems = {
	
		"type1": [
					"Context Menu 1, Item 1", 
					{
						text: "Context Menu 1, Item 2", 
						submenu: { 
									id: "submenu1", 
									lazyload: true, 
									itemdata: [
										"Context Menu 1 Submenu, Item 1", 
										"Context Menu 1 Submenu, Item 2", 
										"Context Menu 1 Submenu, Item 3", 
										"Context Menu 1 Submenu, Item 4"
									] 
								} 
					}, 
					"Context Menu 1, Item 3", 
					"Context Menu 1, Item 4"
				],

		"type2": [
					"Context Menu 2, Item 1", 
					"Context Menu 2, Item 2", 
					"Context Menu 2, Item 3", 
					"Context Menu 2, Item 4", 
					"Context Menu 2, Item 5", 
					"Context Menu 2, Item 6", 
					"Context Menu 2, Item 7", 
					"Context Menu 2, Item 8", 
					"Context Menu 2, Item 9", 
					"Context Menu 2, Item 10"
				],

		"type3": [
					"Context Menu 3, Item 1", 
					"Context Menu 3, Item 2", 
					"Context Menu 3, Item 3", 
					"Context Menu 3, Item 4"
				],

		"type4": [
					"Context Menu 4, Item 1", 
					"Context Menu 4, Item 2"
				],

		"type5": [
					"Context Menu 5, Item 1", 
					"Context Menu 5, Item 2", 
					"Context Menu 5, Item 3", 
					"Context Menu 5, Item 4", 
					"Context Menu 5, Item 5", 
					"Context Menu 5, Item 6"
				]
	
	};


	var oSelectedTR;    // The currently selected TR


	/*
		 "beforeshow" event handler for the ContextMenu instance - 
		 replaces the content of the ContextMenu instance based 
		 on the CSS class name of the <tr> element that triggered
		 its display.
	*/

	function onContextMenuBeforeShow(p_sType, p_aArgs) {

		var oTarget = this.contextEventTarget,
			aMenuItems,
			aClasses;


		if (this.getRoot() == this) {

			/*
				 Get the <tr> that was the target of the 
				 "contextmenu" event.
			*/

			oSelectedTR = oTarget.nodeName.toUpperCase() == "TR" ? 
							oTarget : Dom.getAncestorByTagName(oTarget, "TR");


			/*
				Get the array of MenuItems for the CSS class name from 
				the "oContextMenuItems" map.
			*/

			if (Dom.hasClass(oSelectedTR, "odd")) {

				aClasses = oSelectedTR.className.split(" ");

				aMenuItems = oContextMenuItems[aClasses[0]];
			
			}
			else {
				
				aMenuItems = oContextMenuItems[YAHOO.lang.trim(oSelectedTR.className)];

			}


			// Remove the existing content from the ContentMenu instance

			this.clearContent();
			

			// Add the new set of items to the ContentMenu instance                    
			
			this.addItems(aMenuItems);


			// Render the ContextMenu instance with the new content

			this.render();


			/*
				 Highlight the <tr> element in the table that was 
				 the target of the "contextmenu" event.
			*/

			Dom.addClass(oSelectedTR, "selected");
		
		}
		
	}


	/*
		 "hide" event handler for the ContextMenu - used to 
		 clear the selected <tr> element in the table.
	*/

	function onContextMenuHide(p_sType, p_aArgs) {

		if (this.getRoot() == this && oSelectedTR) {

			Dom.removeClass(oSelectedTR, "selected");
		
		}
	
	}


	/*
		 Instantiate a ContextMenu:  The first argument passed to 
		 the constructor is the id of the element to be created; the 
		 second is an object literal of configuration properties.
	*/

	var oContextMenu = new YAHOO.widget.ContextMenu("contextmenu", { 
															trigger: "dataset", 
															lazyload: true 
															});

	
	/*
		 Subscribe to the ContextMenu instance's "beforeshow" and 
		 "hide" events.
	*/

	oContextMenu.subscribe("beforeShow", onContextMenuBeforeShow);
	oContextMenu.subscribe("hide", onContextMenuHide);            

});
</textarea>