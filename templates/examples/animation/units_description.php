<h2 class="first">Animating in other Units</h2>

<p>The <a href="http://developer.yahoo.com/yui/animation/">YUI Animation</a> Utility allows you to animate style attributes in any CSS unit.</p>

<p>For this example, we will animate the width of the <code>&lt;div&gt;</code> element named <code>demo</code> in EM units.  Using EMs is nice, because it becomes relative to the text size, and will scale as the user changes the browser text size setting.</p>
<p>Add a little style so that we can see the animation in action:</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<style type="text/css">
#demo {
    background:#ccc;
    width:30em;
}
</style>
</textarea>

<p>Create the <code>demo</code> element and a button to run the animation:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<div id="demo">Demo</div>
<button id="demo-run">run</button>
</textarea>
<p>Now we create an instance of <code>YAHOO.util.Anim</code>, passing it the element we wish to animate, and the style attribute(s) to be animated. Because we are changing the unit to something other than the default ("px"), the <code>from</code> field is required:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
    var attributes = {
        width: { from: 30, to: 10, unit:'em' }
    };
    var anim = new YAHOO.util.Anim('demo', attributes);
</script>
</textarea>

<p>The final step is to call the <code>animate</code> method on our instance to start the animation.  To keep things simple, we will animate when the document is clicked:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
YAHOO.util.Event.on('demo-run', 'click', function() {
    anim.animate();
});
</script>
</textarea>
<p>This is an example of animating in units other than pixels.</p>

