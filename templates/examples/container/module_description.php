<h2 class="first">Using the Module Control</h2>

<p>The Module control enables you to create a JavaScript object representation of a basic module of content. It can be used to manipulate existing content modules on your page or to create modules dynamically and append them to the DOM. All other components in the Container family have Module as their lowest-level base class.</p>

<p>Module is fundamentally a building block for other UI controls. The concepts presented in this example will form the basis for the way that you interact with all of its subclasses.</p>

<p>Module has three required dependencies: the <a href="http://developer.yahoo.com/yui/yahoo/">YAHOO Global object</a>, the <a href="http://developer.yahoo.com/yui/event/">Event Utility</a>, and the <a href="http://developer.yahoo.com/yui/dom/">DOM Collection</a>.</p>

<p>In addition, the JavaScript file for Container must be included. If you will not be using any of the pre-packaged rich controls (<a href="http://developer.yahoo.com/yui/container/tooltip/">Tooltip</a>, <a href="http://developer.yahoo.com/yui/container/panel/">Panel</a>, <a href="http://developer.yahoo.com/yui/container/dialog/">Dialog</a>, or <a href="http://developer.yahoo.com/yui/container/simpledialog/">SimpleDialog</a>), you can include the core libary (<code>container_core.js</code>), which only contains <a href="http://developer.yahoo.com/yui/container/module/">Module</a>, <a href="http://developer.yahoo.com/yui/container/overlay/">Overlay</a>, and its supporting classes. Otherwise, the full library should be included (<code>container.js</code>). You can see what the full list of included files looks like below. Please note that your file paths may vary depending on the location in which you installed the YUI libraries.</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<script type="text/javascript" src="yahoo.js"></script>
<script type="text/javascript" src="event.js" ></script>
<script type="text/javascript" src="dom.js" ></script>

<script type="text/javascript" src="container_core.js"></script>
</textarea>

<p>Modules can be built using existing markup or dynamically at runtime using JavaScript. In this tutorial, we will construct two Modules: one from markup, and one from script only. First, we'll add the Module from markup to the document. The markup is in Standard Module Format, which consists of an outer container div element and three possible child div elements that represent the header, body, and/or footer:</p>

<textarea name="code" class="HTML" cols="60" rows="1">

<div id="module1">
<div class="hd">Module #1 from Markup</div>
<div class="bd">This is a Module that was marked up in the document.</div>
<div class="ft">End of Module #1</div>
</div>

</textarea>

<p>Next, we'll build the JavaScript for our Modules and wrap it in a function to be executed when the window is finished loading. The Module called <code>module1</code> will be associated with our existing markup;  <code>module2</code> will be created dynamically from script. In this tutorial, we  pass to the Module constructor the one required argument: the id associated with that Module's container element.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
<script>
YAHOO.namespace("example.container");

function init() {
YAHOO.example.container.module1 = new YAHOO.widget.Module("module1", { visible: false });
YAHOO.example.container.module1.render();

YAHOO.example.container.module2 = new YAHOO.widget.Module("module2", { visible: false });
YAHOO.example.container.module2.setHeader("Module #2 from Script");
YAHOO.example.container.module2.setBody("This is a dynamically generated Module.");
YAHOO.example.container.module2.setFooter("End of Module #2");
YAHOO.example.container.module2.render("module2");
}

YAHOO.util.Event.addListener(window, "load", init);
</script>
</textarea>

<p>Note that to avoid using the global variable space, we are placing our example Modules into the <code>YAHOO.example.container</code> namespace. For more information about namespacing, see the <a href="http://developer.yahoo.com/yui/yahoo/">YAHOO Global object</a>.</p>


<p>Because <code>module1</code> is already in the document, the call to the <em>render</em> method requires no arguments. If that element wasn't present in the document, we would pass into the <code>render</code> method the element into which we wanted the module rendered.</p>

<p>To see our newly created Modules more easily, we can add a style block that defines custom CSS for the <code>module</code> CSS class. By default, Module doesn't come with any predefined styles, so it is up to you as a developer to provide any applicable styles. Our style block will define the <code>module</code> CSS class such that Modules and each of their child elements will have distinct border colors:</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<style>
.module { border:1px dotted black;padding:5px;margin:10px; }
.module .hd { border:1px solid red;padding:5px; }
.module .bd { border:1px solid green;padding:5px; }
.module .ft { border:1px solid blue;padding:5px; }
</style>
</textarea>

<p>Finally, we will add some HTML buttons to the page and wire them (using the <a href="http://developer.yahoo.com/yui/event">YUI Event Utility</a>) to the Modules' <code>show</code> and <code>hide</code> methods:</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<div>
<button id="show1">Show module1</button> 
<button id="hide1">Hide module1</button>
</div>

<div>
<button id="show2">Show module2</button> 
<button id="hide2">Hide module2</button>
</div>
</textarea>

<p></p>

<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.util.Event.addListener("show1", "click", YAHOO.example.container.module1.show, YAHOO.example.container.module1, true);
YAHOO.util.Event.addListener("hide1", "click", YAHOO.example.container.module1.hide, YAHOO.example.container.module1, true);

YAHOO.util.Event.addListener("show2", "click", YAHOO.example.container.module2.show, YAHOO.example.container.module2, true);
YAHOO.util.Event.addListener("hide2", "click", YAHOO.example.container.module2.hide, YAHOO.example.container.module2, true);
</textarea>