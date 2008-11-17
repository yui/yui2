<h2 class="first">Animating Multiple Attributes</h2>

<p>The <a href="http://developer.yahoo.com/yui/animation/">YUI Animation</a> Utility allows you to animate multiple attributes with a single animation instance.</p>

<p>For this example, we will animate the height and width of the <code>&lt;div&gt;</code> element named <code>demo</code></p>
<p>Add a little style so that we can see the animation in action:</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<style type="text/css">
#demo {
    background:#ccc;
    height:300px;
    width:300px;
}
</style>
</textarea>

<p>Create the <code>demo</code> element and a button to run the animation:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<div id="demo">Demo</div>
<button id="demo-run">run</button>
</textarea>
<p>Now we create an instance of <code>YAHOO.util.Anim</code>, passing it the element we wish to animate, and the style attribute(s) to be animated:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
    var attributes = {
        height: { to: 100 },
        width: { to: 100 }
    };
    var anim = new YAHOO.util.Anim('demo', attributes);
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
<p>This is an example of animating multiple style attributes of an HTMLElement.</p>

