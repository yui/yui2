<h2 class="first">Animation with Easing</h2>

<p>The <a href="http://developer.yahoo.com/yui/animation/">YUI Animation</a> Utility includes an Easing feature, which allows you to customize how the animation behaves.</p>

<p>For this example, we will animate the width of the <code>&lt;div&gt;</code> element named <code>demo</code>.</p>
<p>Add a little style so that we can see the animation in action:</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<style type="text/css">
#demo {
    background:#ccc;
    overflow:hidden; /* so we can animate to zero width */
    width:200px;
}
</style>
</textarea>

<p>Create the <code>demo</code> element and a button to run the animation:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<div id="demo">Demo</div>
<button id="demo-run">run</button>
</textarea>

<p>Now we create an instance of <code>YAHOO.util.Anim</code>, passing it the element we wish to animate, and the style attribute(s) to be animated. The duration and easing arguments are optional.  In this case, we will use 1 second as the duration, and the <code>easeOut</code> easing, which will slow the animation gradually as it nears the end:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
    var attributes = {
        width: { to: 0 }
    };
    var anim = new YAHOO.util.Anim('demo', attributes, 1, YAHOO.util.Easing.easeOut);
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
<p>This is an example of the Easing feature of the YUI Animation Utility.</p>

