<style>
.yui-overlay { position:absolute;border:1px dotted black;padding:5px;margin:10px;background:#fff; }
.yui-overlay .hd { border:1px solid red;padding:5px; }
.yui-overlay .bd { border:1px solid green;padding:5px; }
.yui-overlay .ft { border:1px solid blue;padding:5px; }
</style>

<script>
YAHOO.namespace("example.container");

function init() {
	// Build overlay1 based on markup
	YAHOO.example.container.overlay1 = new YAHOO.widget.Overlay("overlay1", { xy:[350,100],
																			  visible:false,
																			  width:"300px",
																			  zIndex:1000,
																			  effect:{effect:YAHOO.widget.ContainerEffect.FADE,duration:0.25} } );
	YAHOO.example.container.overlay1.render("example");

	// Build overlay2 based on markup
	YAHOO.example.container.overlay2 = new YAHOO.widget.Overlay("overlay2", { xy:[350,100],
																			  visible:false,
																			  width:"300px",
																			  zIndex:1000,
																			  effect:{effect:YAHOO.widget.ContainerEffect.SLIDE,duration:0.25} } );
	YAHOO.example.container.overlay2.render("example");

	// Build overlay3 based on markup
	YAHOO.example.container.overlay3 = new YAHOO.widget.Overlay("overlay3", { xy:[350,100],
																			  visible:false,
																			  width:"300px",
																			  zIndex:1000,
																			  effect:[{effect:YAHOO.widget.ContainerEffect.FADE,duration:0.5},
																					  {effect:YAHOO.widget.ContainerEffect.SLIDE,duration:0.5}] } );
	YAHOO.example.container.overlay3.render("example");

	YAHOO.util.Event.addListener("show1", "click", YAHOO.example.container.overlay1.show, YAHOO.example.container.overlay1, true);
	YAHOO.util.Event.addListener("hide1", "click", YAHOO.example.container.overlay1.hide, YAHOO.example.container.overlay1, true);

	YAHOO.util.Event.addListener("show2", "click", YAHOO.example.container.overlay2.show, YAHOO.example.container.overlay2, true);
	YAHOO.util.Event.addListener("hide2", "click", YAHOO.example.container.overlay2.hide, YAHOO.example.container.overlay2, true);

	YAHOO.util.Event.addListener("show3", "click", YAHOO.example.container.overlay3.show, YAHOO.example.container.overlay3, true);
	YAHOO.util.Event.addListener("hide3", "click", YAHOO.example.container.overlay3.hide, YAHOO.example.container.overlay3, true);

}

YAHOO.util.Event.onDOMReady(init);
</script>

<div>
overlay1 (fade in):
<button id="show1">Show</button>
<button id="hide1">Hide</button>
</div>
<div>
overlay2 (slide in):
<button id="show2">Show</button>
<button id="hide2">Hide</button>
</div>
<div>
overlay3 (fade and slide):
<button id="show3">Show</button>
<button id="hide3">Hide</button>
</div>

<div id="overlay1" style="visibility:hidden;">
<div class="hd">Overlay #1 from Markup</div>
<div class="bd">This is a Overlay that was marked up in the document.</div>
<div class="ft">End of Overlay #1</div>
</div>

<div id="overlay2" style="visibility:hidden;">
<div class="hd">Overlay #2 from Markup</div>
<div class="bd">This is a Overlay that was marked up in the document.</div>
<div class="ft">End of Overlay #2</div>
</div>

<div id="overlay3" style="visibility:hidden;">
<div class="hd">Overlay #3 from Markup</div>
<div class="bd">This is a Overlay that was marked up in the document.</div>
<div class="ft">End of Overlay #3</div>
</div>
