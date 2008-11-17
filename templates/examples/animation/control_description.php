<h2 class="first">Animating Motion Along a Curved Path</h2>

<p>The <a href="http://developer.yahoo.com/yui/animation/">YUI Animation</a> Utility allows you to animate the motion of an HTMLElement along a curved path using control points.</p>

<p>For this example, we will animate the position of a <code>&lt;div&gt;</code> element named <code>demo</code>.  The <code>points</code> attribute, introduced in the <code>YAHOO.util.Motion</code> subclass, accepts an optional <code>control</code> field of one or more control points</p>
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
<p>Now we create an instance of <code>YAHOO.util.Motion</code>, passing it the element we wish to animate, and the points attribute (an array of [x, y] positions), with the point we are animating to, and the control points that will influence the path:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
    var attributes = {
        points: { to: [600, 10], control: [ [100, 100], [800, 800] ] }
    };
    var anim = new YAHOO.util.Motion('demo', attributes);
</script>
<p>The final step is to call the <code>animate</code> method on our instance to start the animation.  The button will be the trigger that begins the animation sequence:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
YAHOO.util.Event.on('demo-run', 'click', function() {
    anim.animate();
});
</script>
</textarea>
<p>This is an example of animating the motion HTMLElement along a curved path.</p>

