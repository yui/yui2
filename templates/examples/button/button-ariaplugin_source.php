<script type="text/javascript">

    (function () {
    	
    	var Event = YAHOO.util.Event,
    		Button = YAHOO.widget.Button,
    		UA = YAHOO.env.ua;

		Event.onContentReady("checkboxbutton-example", function () {		

			var oCheckButton1 = new Button("checkbutton1", { label: "Cheese" });
			var oCheckButton2 = new Button("checkbutton2", { label: "Mushrooms" });
			var oCheckButton3 = new Button("checkbutton3", { label: "Peperoni" });
			var oCheckButton4 = new Button("checkbutton4", { label: "Olives" });
		
		});

		Event.onContentReady("radiobutton-example", function () {

			//	Only apply the WAI-ARIA Roles and States for FF 3 and IE 8 since those
			//	are the only browsers that currently support ARIA.
		
			if ((UA.gecko && UA.gecko >= 1.9) || (UA.ie && UA.ie >= 8)) {

				// Remove the "for" attribute in favor of using the aria-labelledby attribute
				YAHOO.util.Dom.get("buttongroup-label").removeAttribute(YAHOO.env.ua.ie ? "htmlFor" : "for");

			}

			var oButtonGroup = new YAHOO.widget.ButtonGroup("buttongroup", { labelledby: "buttongroup-label" });
		
		});

		Event.onContentReady("menubutton-example", function () {

			var oMenuButton = new Button("menubutton-1", { type: "menu", menu: "menubutton-1-menu" });
		
		});

		Event.onContentReady("splitbutton-example", function () {

			var oMenuButton = new Button("splitbutton-1", { type: "split", menu: "splitbutton-1-menu" });
		
		});

    }());

</script>

<form id="button-example-form" name="button-example-form" method="post">

	<fieldset id="checkboxbutton-example">
		<legend>Pizza Toppings</legend>

		<input id="checkbutton1" type="checkbox" name="checkboxfield1" value="1" checked>
		<input id="checkbutton2" type="checkbox" name="checkboxfield1" value="2">
		<input id="checkbutton3" type="checkbox" name="checkboxfield1" value="3">
		<input id="checkbutton4" type="checkbox" name="checkboxfield1" value="4">
		
	</fieldset>

	<fieldset id="radiobutton-example">
		<legend>Radio Buttons</legend>

		<div id="buttongroup" class="yui-buttongroup">
			<label for="radio1" id="buttongroup-label">Size</label>
			<input id="radio1" type="radio" name="radiofield1" value="Small" checked>
			<input id="radio2" type="radio" name="radiofield1" value="Medium">
			<input id="radio3" type="radio" name="radiofield1" value="Large">
		</div>		

	</fieldset>

	<fieldset id="menubutton-example">
		<legend>Menu Button</legend>
		<input type="button" id="menubutton-1" name="menubutton-1" value="Move To">
		<select id="menubutton-1-menu" name="menubutton-1-menu">
			<option value="0">Archive</option>
			<option value="1">Favorites</option>
			<option value="2">Trash</option>                
		</select>
	</fieldset>

	<fieldset id="splitbutton-example">
		<legend>Split Button</legend>	
		<input type="button" id="splitbutton-1" name="splitbutton-1" value="Reply">
		<select id="splitbutton-1-menu" name="splitbutton-1-menu">
			<option value="0">Reply To Sender</option>
			<option value="1">Reply To All</option> 
		</select>
	</fieldset>

</form>