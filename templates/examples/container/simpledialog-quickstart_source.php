<style>
#container { height:12em; }
</style>

<script>
YAHOO.namespace("example.container");

function init() {
	
	// Define various event handlers for Dialog
	var handleYes = function() {
		alert("You clicked yes!");
		this.hide();
	};
	var handleNo = function() {
		this.hide();
	};

	// Instantiate the Dialog
	YAHOO.example.container.simpledialog1 = new YAHOO.widget.SimpleDialog("simpledialog1", 
																			 { width: "300px",
																			   fixedcenter: true,
																			   visible: false,
																			   draggable: false,
																			   close: true,
																			   text: "Do you want to continue?",
																			   icon: YAHOO.widget.SimpleDialog.ICON_HELP,
																			   constraintoviewport: true,
																			   buttons: [ { text:"Yes", handler:handleYes, isDefault:true },
																						  { text:"No",  handler:handleNo } ]
																			 } );
	YAHOO.example.container.simpledialog1.setHeader("Are you sure?");
	
	// Render the Dialog
	YAHOO.example.container.simpledialog1.render("container");

	YAHOO.util.Event.addListener("show", "click", YAHOO.example.container.simpledialog1.show, YAHOO.example.container.simpledialog1, true);
	YAHOO.util.Event.addListener("hide", "click", YAHOO.example.container.simpledialog1.hide, YAHOO.example.container.simpledialog1, true);

}

YAHOO.util.Event.addListener(window, "load", init);
</script>


<div id="container">
<button id="show">Show simpledialog1</button> 
<button id="hide">Hide simpledialog1</button>
</div>