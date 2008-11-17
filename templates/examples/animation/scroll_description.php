<h2 class="first">Animated Scrolling</h2>

<p>The <a href="http://developer.yahoo.com/yui/animation/">YUI Animation</a> Utility allows you to animate the scroll position of an HTMLElement.</p>

<p>For this example, we will animate the scroll position of a <code>&lt;div&gt;</code> element named <code>demo</code>.  The <code>scroll</code> attribute, introduced in the <code>YAHOO.util.Scroll</code> subclass, accepts an optional <code>control</code> field of one or more control points</p>
<p>Add a little style so that we can see the animation in action:</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<style type="text/css">
#demo {
    height:6em;
    width:20em;
    overflow:auto;
}
</style>
</textarea>

<p>Create the <code>demo</code> element and a button to run the animation:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<div id="demo">
    <p>Sed pretium leo a quam. Sed placerat cursus odio. Duis varius mauris luctus enim. Sed augue. Vivamus malesuada pretium orci. In hac habitasse platea dictumst. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent et ante. Praesent convallis. Pellentesque sit amet leo. Ut convallis. Curabitur tincidunt, ipsum facilisis ultricies bibendum, eros dolor venenatis odio, id rutrum purus sem ac sem. Donec vel enim. Quisque purus. Vivamus fringilla, nibh sit amet blandit suscipit, dui arcu viverra magna, id consectetuer dui orci tincidunt neque. Morbi eget libero. Phasellus tempor. Duis dapibus. Pellentesque nisi arcu, mollis in, euismod non, fermentum sit amet, neque.</p>
</div>
<button id="demo-run">run</button>
</textarea>
<p>Now we create an instance of <code>YAHOO.util.Scroll</code>, passing it the element we wish to animate, and the scroll attribute (an array of [left, top] scroll values), with the scroll amount we are animating:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
    var attributes = {
        scroll: { to: [0, 200] }
    };
    var anim = new YAHOO.util.Scroll('demo', attributes);
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
<p>This is an example of animating the scrolling of an HTMLElement.</p>

