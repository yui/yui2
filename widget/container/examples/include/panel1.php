			<p>The Panel control is an extension of Overlay that is meant to behave similarly to an OS window. Unlike true browser popup windows, panels are floating DHTML elements embedded directly within the page context. The Panel control extends the functionality of Overlay, adding support for modality, drag and drop, and close/dismiss buttons. Panel includes a pre-defined stylesheet to support default look and feel characteristics.</p>

			<p>In this tutorial, we will build two Panels. One of them will be based on existing markup, while the other will be created dynamically using script. In addition to instantiating the Panels, we will also pass configuration arguments to each.</p>

			<textarea name="code" class="JScript" cols="60" rows="1">
					// Instantiate a Panel from markup
					YAHOO.example.container.panel1 = new YAHOO.widget.Panel("panel1", { width:"300px", visible:false, constraintoviewport:true } );
					YAHOO.example.container.panel1.render();

					// Instantiate a Panel from script
					YAHOO.example.container.panel2 = new YAHOO.widget.Panel("panel2", { width:"300px", visible:false, draggable:false, close:false } );
					YAHOO.example.container.panel2.setHeader("Panel #2 from Script");
					YAHOO.example.container.panel2.setBody("This is a dynamically generated Panel.");
					YAHOO.example.container.panel2.setFooter("End of Panel #2");
					YAHOO.example.container.panel2.render(document.body);
			</textarea>

			<p>These Panels introduce a few configuration properties. The "constraintoviewport" property, when set to true, will keep the Panel from being positioned out of the viewport, either by dragging, or setting the x/y properties manually. The "draggable" property determines whether the Panel can be dragged, and the "close" property determines whether the close icon should be displayed in the header of the Panel.</p>

			<p>The "context" property, as shown in "overlay3", takes an array of arguments. The first argument in the array is the id of the element that we want to anchor the Overlay to. In our case, that element is a div with an id of "ctx". The next two arguments indicate the corner of the Overlay that should be attached to a corner of the context element. In this tutorial, "tl" and "bl" mean, "Anchor my Overlay's top left corner to my context element's bottom left corner." Other values include "tr" and "br" for "top right" and "bottom right", respectively.</p>

			<p>The markup for "panel1" is in standard module format, just like the base Module and Overlay classes. We also have defined buttons to allow for easy showing and hiding of both Panels:</p>

			<textarea name="code" class="HTML" cols="60" rows="1">

				<div>
					<button onclick="YAHOO.example.container.panel1.show()">Show panel1</button> 
					<button onclick="YAHOO.example.container.panel1.hide()">Hide panel1</button>
				</div>

				<div id="panel1">
					<div class="hd">Panel #1 from Markup</div>
					<div class="bd">This is a Panel that was marked up in the document.</div>
					<div class="ft">End of Panel #1</div>
				</div>

				<div>
					<button onclick="YAHOO.example.container.panel2.show()">Show panel2</button> 
					<button onclick="YAHOO.example.container.panel2.hide()">Hide panel2</button>
				</div>

			</textarea>