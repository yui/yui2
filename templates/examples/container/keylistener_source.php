<style>
	#example {height:20em;}
</style>

<script>
YAHOO.namespace("example.container");

function init() {
	// Build panel1 based on markup
	YAHOO.example.container.panel1 = new YAHOO.widget.Panel("panel1", { xy:[350,330], width:"250px", visible: false } );
	
	var kl = new YAHOO.util.KeyListener(document, { keys:27 },  							
												  { fn:YAHOO.example.container.panel1.hide,
													scope:YAHOO.example.container.panel1,
													correctScope:true }, "keyup" ); 
													// keyup is used here because Safari won't recognize the ESC
													// keydown event, which would normally be used by default

	YAHOO.example.container.panel1.cfg.queueProperty("keylisteners", kl);
	YAHOO.example.container.panel1.render();

	var kl2 = new YAHOO.util.KeyListener(document, { ctrl:true, keys:89 }, 
												   { fn:YAHOO.example.container.panel1.show, 
													 scope:YAHOO.example.container.panel1,
													 correctScope:true } );
	
	kl2.enable();

	YAHOO.util.Event.addListener("show", "click", YAHOO.example.container.panel1.show, YAHOO.example.container.panel1, true);
	YAHOO.util.Event.addListener("hide", "click", YAHOO.example.container.panel1.hide, YAHOO.example.container.panel1, true);
}

YAHOO.util.Event.onDOMReady(init);
</script>

<div>
panel1: 
<button id="show">Show (Ctrl+Y)</button> 
<button id="hide">Hide (Esc)</button>
</div>

<div id="panel1" style="visibility:hidden">
<div class="hd">KeyListener Example Panel</div>
<div class="bd">Press [ESC] to dismiss this Panel.</div>
</div>