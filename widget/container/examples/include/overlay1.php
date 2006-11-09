			<p>The Overlay control is an extension of Module; its role is to facilitate the creation of modular content that is absolutely positioned above the flow of a page. It adds additional functionality to Module, including methods for positioning, multiple custom events for monitoring internal property changes, and a built-in IFRAME solution for dealing with SELECT element bleed-through in Internet Explorer.</p>

			<p>Overlay is fundamentally a building block for other UI controls. The concepts presented in this example will form the basis for the way that you interact with all of its subclasses.</p>

			<p>In this tutorial, similarly to the <a href="../module">Module tutorial</a>, we will build three Overlays with different types of positioning. One of them will be based on existing markup, while the other two will be created dynamically using script. In addition to instantiating the Overlays, we will also pass configuration arguments to each.</p>

			<textarea name="code" class="JScript" cols="60" rows="1">
					// Build overlay1 based on markup, initially hidden, fixed to the center of the viewport, and 300px wide
					YAHOO.example.container.overlay1 = new YAHOO.widget.Overlay("overlay1", { fixedcenter:true, 
																							  visible:false, 
																							  width:"300px" } );
					YAHOO.example.container.overlay1.render();


					// Build overlay2 dynamically, initially hidden, at position x:400,y:500, and 300px wide
					YAHOO.example.container.overlay2 = new YAHOO.widget.Overlay("overlay2", { xy:[400,500], 
																							  visible:false, 
																							  width:"300px" } );
					YAHOO.example.container.overlay2.setHeader("Overlay #2 from Script");
					YAHOO.example.container.overlay2.setBody("This is a dynamically generated Overlay.");
					YAHOO.example.container.overlay2.setFooter("End of Overlay #2");
					YAHOO.example.container.overlay2.render(document.body);

					// Build overlay3 dynamically, initially hidden, aligned to context element "context", and 200px wide
					YAHOO.example.container.overlay3 = new YAHOO.widget.Overlay("overlay3", { context:["ctx","tl","bl"], 
																							  visible:false, 
																							  width:"200px" } );
					YAHOO.example.container.overlay3.setHeader("Overlay #3 from Script");
					YAHOO.example.container.overlay3.setBody("This is a dynamically generated Overlay.");
					YAHOO.example.container.overlay3.setFooter("End of Overlay #3");
					YAHOO.example.container.overlay3.render(document.body);
			</textarea>

			<p>These Overlays introduce a few configuration properties. The "fixedcenter" property, when set to true, will force the Overlay to always be positioned in the center of the viewport, regardless of the scrolling or resizing of the window. The "visible" property determines whether the Overlay should be visible, and the "width" property allows a CSS width to be set for the Overlay. In addition, basic pixel-based positioning is available via the "xy" property, which can also be split into separate properties ("x" and "y").</p>

			<p>The "context" property, as shown in "overlay3", takes an array of arguments. The first argument in the array is the id of the element that we want to anchor the Overlay to. In our case, that element is a div with an id of "ctx". The next two arguments indicate the corner of the Overlay that should be attached to a corner of the context element. In this tutorial, "tl" and "bl" mean, "Anchor my Overlay's top left corner to my context element's bottom left corner." Other values include "tr" and "br" for "top right" and "bottom right", respectively.</p>

			<p>Similarly to the previous Module tutorial, we must define CSS styles for Overlay so that we can see a clear visual representation of our Overlays, since they are not styled by default. We will also style our "ctx" context element, so that it's easy to see:</p>

			<textarea name="code" class="HTML" cols="60" rows="1">
				<style>
					.overlay { border:1px dotted black;padding:5px;margin:10px; }
					.overlay .hd { border:1px solid red;padding:5px; }
					.overlay .bd { border:1px solid green;padding:5px; }
					.overlay .ft { border:1px solid blue;padding:5px; }

					#ctx { background:orange;width:100px;height:25px; }
				</style>
			</textarea>

			<p>The markup for "overlay1", plus the context element "ctx" and the buttons to show all our Overlays is displayed below. Note that "overlay1" has an inline style of "visibility:hidden" set in advance. The reason for this is because most browsers are slower to render CSS than inline styles, and we want this marked up Overlay to be hidden by default. If the inline style isn't present, it may cause a brief "flash" where the Overlay may be visible on slower machines.</p>

			<textarea name="code" class="HTML" cols="60" rows="1">
				<div>
					overlay1: 
					<button onclick="YAHOO.example.container.overlay1.show()">Show</button> 
					<button onclick="YAHOO.example.container.overlay1.hide()">Hide</button>
				</div>
				<div>
					overlay2: 
					<button onclick="YAHOO.example.container.overlay2.show()">Show</button> 
					<button onclick="YAHOO.example.container.overlay2.hide()">Hide</button>
				</div>
				<div>
					overlay3: 
					<button onclick="YAHOO.example.container.overlay3.show()">Show</button> 
					<button onclick="YAHOO.example.container.overlay3.hide()">Hide</button>
				</div>

				<div id="ctx">Align to me</div>

				<div id="overlay1" style="visibility:hidden">
					<div class="hd">Overlay #1 from Markup</div>
					<div class="bd">This is a Overlay that was marked up in the document.</div>
					<div class="ft">End of Overlay #1</div>
				</div>
			</textarea>