<style type="text/css">

.yui-skin-sam .yui-panel .hd {

    background: #F2F2F2;
    
}

.yui-skin-sam .yui-panel-container.focused .yui-panel .hd {

    background: url(../../build/assets/skins/sam/sprite.png) repeat-x 0 -200px;

}

</style>

<script>
YAHOO.namespace("example.container");

function init() {
	// Build panel1 based on markup
	YAHOO.example.container.panel1 = new YAHOO.widget.Panel("panel1", { xy:[150,100],
																		visible:false,
																		width:"300px"
																	  } );
	YAHOO.example.container.panel1.render();

	// Build panel2 based on markup
	YAHOO.example.container.panel2 = new YAHOO.widget.Panel("panel2", { xy:[250,200],
																		visible:false,
																		width:"300px"
																	  } );
	YAHOO.example.container.panel2.render();

	// Build panel3 based on markup
	YAHOO.example.container.panel3 = new YAHOO.widget.Panel("panel3", { xy:[350,300],
																		visible:false,
																		width:"300px"
																	  } );
	YAHOO.example.container.panel3.render();

	YAHOO.example.container.manager = new YAHOO.widget.OverlayManager();
	YAHOO.example.container.manager.register([YAHOO.example.container.panel1,
											  YAHOO.example.container.panel2,
											  YAHOO.example.container.panel3]);

	YAHOO.util.Event.addListener("show1", "click", YAHOO.example.container.panel1.show, YAHOO.example.container.panel1, true);
	YAHOO.util.Event.addListener("hide1", "click", YAHOO.example.container.panel1.hide, YAHOO.example.container.panel1, true);
	YAHOO.util.Event.addListener("focus1", "click", YAHOO.example.container.panel1.focus, YAHOO.example.container.panel1, true);

	YAHOO.util.Event.addListener("show2", "click", YAHOO.example.container.panel2.show, YAHOO.example.container.panel2, true);
	YAHOO.util.Event.addListener("hide2", "click", YAHOO.example.container.panel2.hide, YAHOO.example.container.panel2, true);
	YAHOO.util.Event.addListener("focus2", "click", YAHOO.example.container.panel2.focus, YAHOO.example.container.panel2, true);

	YAHOO.util.Event.addListener("show3", "click", YAHOO.example.container.panel3.show, YAHOO.example.container.panel3, true);
	YAHOO.util.Event.addListener("hide3", "click", YAHOO.example.container.panel3.hide, YAHOO.example.container.panel3, true);
	YAHOO.util.Event.addListener("focus3", "click", YAHOO.example.container.panel3.focus, YAHOO.example.container.panel3, true);

	YAHOO.util.Event.addListener("showAll", "click", YAHOO.example.container.manager.showAll, YAHOO.example.container.manager, true);
	YAHOO.util.Event.addListener("hideAll", "click", YAHOO.example.container.manager.hideAll, YAHOO.example.container.manager, true);
	YAHOO.util.Event.addListener("blurAll", "click", YAHOO.example.container.manager.blurAll, YAHOO.example.container.manager, true);
}

YAHOO.util.Event.onDOMReady(init);
</script>

<div>
panel1:
<button id="show1">Show</button>
<button id="hide1">Hide</button>
<button id="focus1">Focus</button>
</div>
<div>
panel2:
<button id="show2">Show</button>
<button id="hide2">Hide</button>
<button id="focus2">Focus</button>
</div>
<div>
panel3:
<button id="show3">Show</button>
<button id="hide3">Hide</button>
<button id="focus3">Focus</button>
</div>
<div>
All Panels:
<button id="showAll">Show All</button>
<button id="hideAll">Hide All</button>
<button id="blurAll">Blur All</button>
</div>

<div id="panel1" style="visibility:hidden">
<div class="hd">Panel #1 from Markup</div>
<div class="bd">This is a Panel that was marked up in the document.</div>
<div class="ft">End of Panel #1</div>
</div>

<div id="panel2" style="visibility:hidden">
<div class="hd">Panel #2 from Markup</div>
<div class="bd">This is a Panel that was marked up in the document.</div>
<div class="ft">End of Panel #2</div>
</div>

<div id="panel3" style="visibility:hidden">
<div class="hd">Panel #3 from Markup</div>
<div class="bd">This is a Panel that was marked up in the document.</div>
<div class="ft">End of Panel #3</div>
</div>
