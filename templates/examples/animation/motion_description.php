<h2 class="first">Animating Motion</h2>

<p>The <a href="http://developer.yahoo.com/yui/animation/">YUI Animation</a> Utility allows you to animate the motion of an HTMLElement.</p>

<p>For this example, we will animate the position of a <code>&lt;div&gt;</code> element named <code>demo</code>.  Note that you could accomplish this with a positioned element by animating offset properties ("top", "left", etc.), but those values are not necessarily in page coordinates.  The <code>points</code> attribute, introduced in the <code>YAHOO.util.Motion</code> subclass, ensures that position is always relative to the document (unless using <code>by</code> rather than <code>to</code>, which is relative to the current position).</p>
<p>Add a little style so that we can see the animation in action:</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<style type="text/css">
#demo {
    background:#ccc;
    height:30px;
    width:30px;
}
</style>
</textarea>

<p>Create the <code>demo</code> element and a button to run the animation:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<div id="demo">Demo</div>
<button id="demo-run">run</button>
</textarea>
<p>Now we create an instance of <code>YAHOO.util.Motion</code>, passing it the element we wish to animate, and the points attribute (an array of [x, y] positions), with the point we are animating to:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
    var attributes = {
        points: { to: [600, 10] }
    };
    var anim = new YAHOO.util.Motion('demo', attributes);
</script>
</textarea>

<p>The final step is to call the <code>animate</code> method on our instance to start the animation.  The button will be the trigger that begins the animation sequence:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
YAHOO.util.Event.on('demo-run', 'click', function() {
    anim.animate();
});
</script>
</textarea>
<p>This is an example of animating the motion HTMLElement.</p>

