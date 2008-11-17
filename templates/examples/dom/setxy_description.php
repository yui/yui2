<h2 class="first">Using setXY</h2>

<p><a href="/yui/dom/#setxy"><code>setXY</code></a>, part of the <a href="http://developer.yahoo.com/yui/dom/">YUI Dom Collection</a>, makes it easy to position an element relative to the document.</p>

<p>To illustrate the use of <code>setXY</code>, we'll create a single <code>&lt;div&gt;</code> called <code>foo</code> that positions itself to the cursor when the document is clicked.</p>

<p>Add some simple CSS rules and markup for the demo element and a button to activate the demo:</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<style type="text/css">
#foo {
    background-color:#00f;
    height:10px;
    width:10px;
}
</style>

<div id="foo"></div>
<button id="demo-run">run</button>
</textarea>

<p>Now we will define the function that moves the element based on the position of the click.  The first argument of the <code>setXY</code> method is either the ID of an HTMLElement, or an actual HTMLElement object.  The second argument is an array containing two values: <code>[x, y]</code> where <code>x</code> is the distance from the left edge of the document, and <code>y</code> is the distance from the top edge of the document. The <a href="http://developer.yahoo.com/yui/event/">YUI Event Utility</a> provides a <code>getXY</code> method that accepts an event object as an argument, and returns the position of the cursor at the time of the click. The returned position is an array in the same format as the <code>setXY</code> array, so it can be fed directly to the <code>setXY</code> method.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
    var move = function(e) {
        YAHOO.util.Dom.setXY('foo', YAHOO.util.Event.getXY(e));
    };
</script>
</textarea>

<p>Next we will use the <a href="http://developer.yahoo.com/yui/event/">YUI Event Utility</a>'s <code>on</code> method to listen for clicks on the document. </p>
<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
    YAHOO.util.Event.on('demo-run', 'click', move);
</script>
</textarea>

<p>This is a simple example of how to use the <code>YAHOO.util.Dom.setXY</code> method.  One of the powerful things about this is that regardless of what is influencing the element's position, be it positioning (absolute, relative, etc.), margins, and <code>offsetParent</code> (any positioned ancestor), or other factors that may affect it, <code>setXY</code> will ensure the final position is accurate in document coordinates (e.g. <code>[0, 0]</code> will be the upper left corner of the document).</p>

