<style>
	#container {height:15em;}
</style>

<script>
		YAHOO.namespace("example.container");

		function init() {
			// Instantiate a Panel from markup
			YAHOO.example.container.panel1 = new YAHOO.widget.Panel("panel1", { width:"320px", visible:false, constraintoviewport:true } );
			YAHOO.example.container.panel1.render();

			// Instantiate a Panel from script
			YAHOO.example.container.panel2 = new YAHOO.widget.Panel("panel2", { width:"320px", visible:false, draggable:false, close:false } );
			YAHOO.example.container.panel2.setHeader("Panel #2 from Script &mdash; This Panel Isn't Draggable");
			YAHOO.example.container.panel2.setBody("This is a dynamically generated Panel.");
			YAHOO.example.container.panel2.setFooter("End of Panel #2");
			YAHOO.example.container.panel2.render("container");

			YAHOO.util.Event.addListener("show1", "click", YAHOO.example.container.panel1.show, YAHOO.example.container.panel1, true);
			YAHOO.util.Event.addListener("hide1", "click", YAHOO.example.container.panel1.hide, YAHOO.example.container.panel1, true);

			YAHOO.util.Event.addListener("show2", "click", YAHOO.example.container.panel2.show, YAHOO.example.container.panel2, true);
			YAHOO.util.Event.addListener("hide2", "click", YAHOO.example.container.panel2.hide, YAHOO.example.container.panel2, true);
		}

		YAHOO.util.Event.addListener(window, "load", init);
</script>

<div id="container">
	<div>
		<button id="show1">Show panel1</button> 
		<button id="hide1">Hide panel1</button>
	</div>
	
	<div id="panel1">
		<div class="hd">Panel #1 from Markup &mdash; This Panel is Draggable</div>
		<div class="bd">This is a Panel that was marked up in the document.</div>
		<div class="ft">End of Panel #1</div>
	</div>
	
	<div>
		<button id="show2">Show panel2</button> 
		<button id="hide2">Hide panel2</button>
	</div>
</div>