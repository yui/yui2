<!--markup for YUI Button Control-->
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
</div>

<script language="javascript">

//Setup the example once the animator div is present
//in the DOM.
YAHOO.util.Event.onAvailable("animator", function() {

	//This is the first animation; this one will 
	//fire when the button is clicked.
	var move = new YAHOO.util.Anim("animator", {
		left: {from:0, to:75}
	}, 1);
	
	//This is the second animation; it will fire
	//when the first animation is complete.
	var changeColor = new YAHOO.util.ColorAnim("animator", {
		backgroundColor: {from:"#003366", to:"#ff0000"}
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
		//reset the color value to the start so that
		//the animation can be run multiple times:
		YAHOO.util.Dom.setStyle("animator", "backgroundColor", "#003366");
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
});
</script>