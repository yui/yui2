<h2 class="first">Introducing Additional YUI Components into a Page On-demand</h2>

<p>Our task here is to use the <a href="http://developer.yahoo.com/yui/loader/">YUI Loader Utility</a> to introduce a new YUI component, the <a href="http://developer.yahoo.com/yui/tabview/">TabView Control</a>, onto a page that already has some YUI content loaded on it (in this case, the <a href="http://developer.yahoo.com/yui/button/">Button Control</a> and the <a href="http://developer.yahoo.com/yui/logger/">Logger Control</a>).  This pattern is one that can be useful any time you want to perform on-demand loading &mdash; loading of components only when their need is actuated by a specific user behavior.</p>

<p>Our "user behavior" in this example will be the click of a YUI Button.  That button, when clicked, should disappear and give way to a TabView instance that we'll construct on the fly.  Before we construct it, though, we'll have to load TabView onto the page; it's not loaded as part of the initial page load.</p>

<p>Our markup is simple: An element for our button and an element into which we'll place our TabView DOM structure once it's created:</p>

<textarea name="code" class="HTML" cols="60" rows="1"><!--Container for our call-to-action button-->
<div id="tabInsertButtonContainer"></div>

<!--Container to which we'll append our TabView DOM-->
<div id="tabContainer"></div></textarea>

<p>Next, we instantiate our Button.  This step consists of (a) creating the Button Instance and (b) assigning a click handler to execute our logic to load TabView and create a TabView instance when the button is clicked:</p>

<textarea name="code" class="JScript" cols="60" rows="1">//create our Button instance which will trigger Loader to
//load TabView and create our Tabs.
YAHOO.example.buttoninit = function() {

	//Create the button instance:
	var oButton = new YAHOO.widget.Button({ 
		id: "tabInsertButton",  
		type: "button",  
		label: "Click here to load TabView",  
		container: "tabInsertButtonContainer"  
	});
	YAHOO.log("Button created; click button to begin loading TabView.", "info", "example");

	//Create a handler that handles the button click;
	//it logs the click, hides the button, then fires 
	//the function (loaderinit) that brings in TabView:
	var onButtonClick = function() {
		YAHOO.log("Button clicked; hiding button now and loading TabView", "info", "example");
		YAHOO.util.Dom.setStyle("tabInsertButtonContainer", "display", "none");
		YAHOO.example.loaderinit();
	}
	
	//attach the handler to the Button's click event:
	oButton.on("click", onButtonClick);
};

//Once the tabInsertButtonContainer element is on the page, we can create
//our button instance; in this case, the onContentReady deferral is unnecessary,
//because we're writing the element to the page before this script,
//but in many cases the onContentReady wrapper gives you added
//flexibility and it comes at low expense:
YAHOO.util.Event.onContentReady("tabInsertButtonContainer", 
								YAHOO.example.buttoninit);</textarea>

<p>When the button is clicked, we first need to use YUI Loader to bring TabView onto the page.  We've encapsulated that logic in <code>YAHOO.example.loaderinit</code>, which in the code above we've tied to the button's click event.  Here are the commented contents of the <code>loaderinit</code> function in which we instantiate Loader, configure it, and then use its insert method to bring the TabView script and CSS dependencies into the page.  <strong>Note:</strong>  In this example we've loaded YUI Loader in the initial page load, so its functionality is available to us in our scripts.</p>

<textarea name="code" class="JScript" cols="60" rows="1">YAHOO.example.loaderinit = function() {
	YAHOO.log("YAHOO.example.loaderinit firing; we'll bring in TabView and any missing dependencies now.", "info", "example");
	
	//Begin by creating a new Loader instance:
	var loader = new YAHOO.util.YUILoader();
	
	//configure Loader; we'll request TabView plus any
	//optional dependencies of TabView that aren't already on
	//the page:
	loader.require("tabview");
	loader.loadOptional = true;
	
	//We can now look at the components list that Loader has
	//calculated; this is what Loader has determined it needs
	//to add to the page:
	YAHOO.log("YUI components required: " + loader.sorted, "info", "example");
	
	//We'll specify files local to the current HTML page
	//so Loader does not load files from yui.yahooapis.com:
	loader.base = '../../build/';
	
	//When the loading is all complete, we want to initialize
	//our TabView process; we can set this here or pass this
	//in as an argument to the insert() method:
	loader.onSuccess = YAHOO.example.tabviewinit;
	
	//We've created and configured our Loader instance;
	//now we tell it to insert the needed components on the
	//page:
	loader.insert();
	
};</textarea>

<p>We have configured Loader to call <code>YAHOO.example.tabviewinit</code> when it completes its loading of TabView and its dependencies.  Loader dutifully does this, waiting for each required module to load and then executing our code to setup our TabView instance.  That last piece of the puzzle looks like this:</p>

<textarea name="code" class="JScript" cols="60" rows="1">//Here's the code that will set up our TabView instance.  We'll
//write this function and then tell Loader to fire it once it's done
//loading TabView into the page.
YAHOO.example.tabviewinit = function( ){
	
	//Simple "tabview from javascript" syntax; pass in an id for the
	//generated container element for the control, then add tabs one
	//at a time.
	var tabView = new YAHOO.widget.TabView( { id: 'generatedTabs' } );
	
	tabView.addTab( new YAHOO.widget.Tab({
		label: 'lorem',
		content: '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat.</p>',
		active: true
	}));

	tabView.addTab( new YAHOO.widget.Tab({
		label: 'ipsum',
		content: '<ul><li><a href="#">Lorem ipsum dolor sit amet.</a></li><li><a href="#">Lorem ipsum dolor sit amet.</a></li><li><a href="#">Lorem ipsum dolor sit amet.</a></li><li><a href="#">Lorem ipsum dolor sit amet.</a></li></ul>'
	}));
	
	tabView.addTab( new YAHOO.widget.Tab({
		label: 'dolor',
		content: '<form action="#"><fieldset><legend>Lorem Ipsum</legend><label for="foo"> <input id="foo" name="foo"></label><input type="submit" value="submit"></fieldset></form>'
	}));
	
	//Having created our TabView control, we append it to the DOM:
	tabView.appendTo('tabContainer'); 
	
	//Success!  Log the completion of the process:
	YAHOO.log("TabView instance created and appended to the DOM.  The process is complete.", "info", "example");

};</textarea>
