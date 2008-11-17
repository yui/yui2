<h2 class="first">Setting up Overlays</h2>

<p>The <a href="http://developer.yahoo.com/yui/container/overlay/">Overlay Control</a> is an extension of <a href="http://developer.yahoo.com/yui/container/module/">Module</a>; its role is to facilitate the creation of modular content that is absolutely positioned above the flow of a page. It adds additional functionality to Module, including methods for positioning, multiple custom events for monitoring internal property changes, and a built-in <code>&lt;iframe&gt;</code> solution for dealing with <code>&lt;select&gt;</code> element bleed-through in Internet Explorer.</p>

<p>Overlay is fundamentally a building block for other UI controls. The concepts presented in this example will form the basis for the way that you interact with all of its subclasses, including <a href="http://developer.yahoo.com/yui/container/panel/">Panel</a> and <a href="http://developer.yahoo.com/yui/container/dialog/">Dialog</a>.</p>

<p>In this tutorial we will build three Overlays with different types of positioning. One of them will be based on existing markup; the other two will be created dynamically using script. In addition to instantiating the Overlays, we will also use the constructor to pass configuration properties for each of our Overlays.</p>

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

// Build overlay3 dynamically, initially hidden, aligned to context element "context", and 200px wide. 

// Re-align just before the overlay is shown and whenever the window is resized to account for changes in the position 
// of the context element after the initial context alignment
YAHOO.example.container.overlay3 = new YAHOO.widget.Overlay("overlay3", { context:["ctx","tl","bl", ["beforeShow", "windowResize"]],
																		  visible:false,
																		  width:"200px" } );
YAHOO.example.container.overlay3.setHeader("Overlay #3 from Script");
YAHOO.example.container.overlay3.setBody("This is a dynamically generated Overlay.");
YAHOO.example.container.overlay3.setFooter("End of Overlay #3");
YAHOO.example.container.overlay3.render(document.body);

YAHOO.util.Event.addListener("show1", "click", YAHOO.example.container.overlay1.show, YAHOO.example.container.overlay1, true);
YAHOO.util.Event.addListener("hide1", "click", YAHOO.example.container.overlay1.hide, YAHOO.example.container.overlay1, true);

YAHOO.util.Event.addListener("show2", "click", YAHOO.example.container.overlay2.show, YAHOO.example.container.overlay2, true);
YAHOO.util.Event.addListener("hide2", "click", YAHOO.example.container.overlay2.hide, YAHOO.example.container.overlay2, true);

YAHOO.util.Event.addListener("show3", "click", YAHOO.example.container.overlay3.show, YAHOO.example.container.overlay3, true);
YAHOO.util.Event.addListener("hide3", "click", YAHOO.example.container.overlay3.hide, YAHOO.example.container.overlay3, true);
</textarea>

<p>These Overlays introduce a few of the configuration properties which are available to help position the Overlay.</p>

<ul>
    <li><strong>Centered In The Viewport</strong>
    <p>
    The <code>fixedcenter</code> property, when set to true, will force the Overlay to always be positioned in the center of the viewport &mdash; even when the window is scrolled or resized. The <code>visible</code> property determines whether the Overlay should be visible, and the <code>width</code> property allows a CSS width to be set for the Overlay.
    </p>
    </li>

    <li><strong>At A Specific Page Co-ordinate</strong>
    <p>Basic pixel-based positioning is available via the <code>xy</code> property, which can also be split into separate properties (<code>x</code> and <code>y</code>). The <code>xy</code> co-ordinates are page co-cordinates, relative to the top/left corner of the document.</p>
    </li>

    <li><strong>Aligned To An Existing Element On The Page</strong>
    <p>The <code>context</code> property, as shown in <code>overlay3</code>, takes an array of values. The first entry in the array is the id of the element to which we want to anchor the Overlay. In this case, that element is a <code>&#60;div&#62;</code> with an id of <code>ctx</code>. The next two entries specify the positioning of the Overlay &mdash; <code>tl</code> and <code>bl</code> mean, "Anchor my Overlay's <em>t</em>op <em>l</em>eft corner to my context element's <em>b</em>ottom <em>l</em>eft corner." (Other possible values include <code>tr </code>and <code>br</code> for "top right" and "bottom right", respectively.). These first three entries in the array are required entries.</p>
    <p>The fourth entry in the array is optional and specifies the list of events (<em>triggers</em>) for which we want to re-align the Overlay with the context element. If this fourth "triggers" entry is not specified, context alignement is only done once, when the Overlay is created. This is sufficient for a majority of use cases, where the page co-ordinates of the context element remain constant. However in fluid layouts (such as this example template), the page co-ordinates of the context element change as the window is resized, therefore we ask the Overlay to align itself whenever the <code>"beforeShow"</code> and <code>"windowResize"</code> events are fired. The API documentation for the <a href="../../docs/YAHOO.widget.Overlay.html#config_context">context configuration property</a> discusses the events which are supported in more detail.</p>
    </li>
</ul>

<p>In the next step, we will define CSS styles that allow us to see a clear visual representation of our Overlays; remember, Overlays are building blocks for other controls and as such they are not styled by default. We will also style our <code>ctx</code> context element so that it's easy to see:</p>

<textarea name="code" class="HTML" cols="60" rows="1">
	<style>
		.yui-overlay { border:1px dotted black;padding:5px;margin:10px; }
		.yui-overlay .hd { border:1px solid red;padding:5px; }
		.yui-overlay .bd { border:1px solid green;padding:5px; }
		.yui overlay .ft { border:1px solid blue;padding:5px; }

		#ctx { background:orange;width:100px;height:25px; }
	</style>
</textarea>

<p>The markup for <code>overlay1</code>, plus the context element <code>ctx</code> and the buttons to show all our Overlays, is displayed below. Note that <code>overlay1</code> has an inline style of <code>visibility:hidden</code> set in advance. Most browsers are slower to render CSS than inline styles, and we want this marked-up Overlay to be hidden by default. If the inline style isn't present, it may cause a brief "flash of unstyled content" where the Overlay may be visible on slower machines.</p>

<textarea name="code" class="HTML" cols="60" rows="1">
	<div>
		overlay1:
		<button id="show1">Show</button>
		<button id="hide1">Hide</button>
	</div>
	<div>
		overlay2:
		<button id="show2">Show</button>
		<button id="hide2">Hide</button>
	</div>
	<div>
		overlay3:
		<button id="show3">Show</button>
		<button id="hide3">Hide</button>
	</div>

	<div id="ctx">Align to me</div>

	<div id="overlay1" style="visibility:hidden">
		<div class="hd">Overlay #1 from Markup</div>
		<div class="bd">This is a Overlay that was marked up in the document.</div>
		<div class="ft">End of Overlay #1</div>
	</div>
</textarea>
