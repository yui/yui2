<h2 class="first">Creating Two Simple Panels</h2>

<p>The <a href="http://developer.yahoo.com/yui/container/panel/">Panel Control</a> is an extension of <a href="http://developer.yahoo.com/yui/container/overlay/">Overlay</a> that is meant to behave similarly to an OS window. Unlike true browser popup windows, Panel Control instances are floating DHTML elements embedded directly within the page context. The Panel Control extends the functionality of Overlay, adding support for modality, drag and drop, and close/dismiss buttons. Panel includes a pre-defined stylesheet to support the default look and feel characteristics that you see on this page.</p>

<p>In this tutorial, we will build two Panels. One of them will be based on existing markup; the other will be created dynamically using script. We'll pass configuration properties via the constructor to specify any non-default settings we want to use in our Panel instances.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
// Instantiate a Panel from markup
YAHOO.example.container.panel1 = new YAHOO.widget.Panel("panel1", { width:"320px", visible:false, constraintoviewport:true } );
YAHOO.example.container.panel1.render();

// Instantiate a Panel from script
YAHOO.example.container.panel2 = new YAHOO.widget.Panel("panel2", { width:"320px", visible:false, draggable:false, close:false } );
YAHOO.example.container.panel2.setHeader("Panel #2 from Script");
YAHOO.example.container.panel2.setBody("This is a dynamically generated Panel.");
YAHOO.example.container.panel2.setFooter("End of Panel #2");
YAHOO.example.container.panel2.render("container");
</textarea>

<p>These Panels introduce a few configuration properties. The <code>constraintoviewport</code> property, when set to true, will keep the Panel from being positioned outside of the viewport; this defends against the panel being dragged out of the viewport by the user and against the panel being moved outside the viewport by scripted changes to its x/y properties. The <code>draggable</code> property determines whether the Panel can be dragged (be sure to include the <a href="http://developer.yahoo.com/yui/dragdrop/">Drag and Drop Utility</a> if you want your panel to be draggable), and the <code>close</code> property determines whether the close icon should be displayed in the header of the Panel.</p>

<p>The markup for <code>panel1</code> is in standard module format, as is required by the <a href="http://developer.yahoo.com/yui/container/module/">Module</a> and Overlay classes on which Panel is built. We also provide buttons to allow for easy showing and hiding of both Panels:</p>

<textarea name="code" class="HTML" cols="60" rows="1"><div>
	<button id="show1">Show panel1</button> 
	<button id="hide1">Hide panel1</button>
</div>

<div id="panel1">
	<div class="hd">Panel #1 from Markup</div>
	<div class="bd">This is a Panel that was marked up in the document.</div>
	<div class="ft">End of Panel #1</div>
</div>

<div>
	<button id="show2">Show panel2</button> 
	<button id="hide2">Hide panel2</button>
</div></textarea>
