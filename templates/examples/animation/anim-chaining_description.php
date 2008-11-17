<h2 class="first">Chaining Animations</h2>

<p>Chaining animations is easy to achieve in YUI's <a href="http://developer.yahoo.com/yui/animation/">Animation Utility</a> using the custom events that are built into your Animation instances.  Here, we'll use the <code>onComplete</code> event of one animation to kick off a second animation, creating a simple chain.</p>

<p>This example has the following dependencies:</p>

<textarea name="code" class="HTML" cols="60" rows="1"><link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/button/assets/skins/sam/button.css"> 

<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/yahoo-dom-event/yahoo-dom-event.js"></script>
<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/element/element-beta-min.js"></script>
<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/button/button-min.js"></script>
<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/animation/animation.js"></script></textarea>

<p>In this example, we begin with to page elements: a YUI Button that will actuate the animation sequence and a simple <code>&lt;div&gt;</code> that will animate in position and then in color.  Here's the markup for these elements:</p>

<textarea name="code" class="HTML" cols="60" rows="1"><!--markup for YUI Button Control-->
<span id="startAnim" class="yui-button yui-link-button">
    <em class="first-child">
        <a href="#" title="Click here to begin the chained animations.">Click here to begin the chained animations.</a>
    </em>
</span>

<!--The animated element.-->
<div id="animator">
	This element will animate position
    and then color when you click the 
    button.
</div></textarea>

<p>With these two elements in place, we can write our script.  This script:</p>
<ul>
  <li>Wraps itself in an onAvailable call so that it fires only when the element <code>#animator</code> is ready on the page;</li>
  <li>Creates the first animation instance, <code>move</code>;</li>
  <li>Creates the second animation instance, <code>changeColor</code>;</li>
  <li>Ties the second animation's <code>animate()</code> method to the <code>onComplete</code> event of the first animation to cause chaining;</li>
  <li>Sets up the button instance and ties the first animation's <code>animate()</code> method to the button's <code>click</code> event;</li>
  <li>Sets up some logging so that you can use the Logger display at right (if enabled) to see some of the events as they transpire (and see what their argument payloads are); note that this makes the animation much slower than it otherwise would be.</li>
</ul>

<p>Here is the full script block for this example:</p>

<textarea name="code" class="JScript" cols="60" rows="1">//Setup the example once the animator div is present
//in the DOM.
YAHOO.util.Event.onAvailable("animator", function() {

	//This is the first animation; this one will 
	//fire when the button is clicked.
	var move = new YAHOO.util.Anim("animator", {
		left: {from: 0, to:75}
	}, 1);
	
	//This is the second animation; it will fire
	//when the first animation is complete.
	var changeColor = new YAHOO.util.ColorAnim("animator", {
		backgroundColor: {to:"#ff0000"}
	}, 1);

	//Here's the chaining glue: We subscribe to the
	//first animation's onComplete event, and in 
	//our handler we animate the second animation:
	move.onComplete.subscribe(function() {
		changeColor.animate();
	});
	
	//Here we set up our YUI Button and subcribe to
	//its click event.  When clicked, it will
	//animate the first animation:
	var startAnim = new YAHOO.widget.Button("startAnim");
	startAnim.subscribe("click", function() {
		move.animate();
	});
	
	//You can also make use of the onStart and onTween
	//custom events in Animation; here, we'll log all
	//of changeColor's custom events and peek at their
	//argument signatures:
	changeColor.onStart.subscribe(function() {
		YAHOO.log("changeColor animation is starting.", "info", "example");
	});

	changeColor.onTween.subscribe(function(s, o) {
		YAHOO.log("changeColor onTween firing with these arguments: " + 
			YAHOO.lang.dump(o), "info", "example");
	});
	
	changeColor.onComplete.subscribe(function(s, o) {
		YAHOO.log("changeColor onComplete firing with these arguments: " + 
			YAHOO.lang.dump(o), "info", "example");
	});
});</textarea>


