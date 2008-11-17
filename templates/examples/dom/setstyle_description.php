<h2 class="first">Using setStyle</h2>

<p><a href="/yui/dom/#setStyle"><code>setStyle</code></a>, part of the <a href="http://developer.yahoo.com/yui/dom/">YUI Dom Collection</a>, makes it easy to set the style properties of an HTMLElement. One of the benefits of this method is that it provides normalized (and simpler) mechanism for setting opacity in Internet Explorer.</p>

<p>To illustrate the use of <code>setStyle</code>, we'll create a <code>&lt;div&gt;</code> called <code>foo</code>. When the button is clicked, the opacity of <code>foo</code> will be set to <code>0.5</code>.</p>
<p>Add some simple CSS rules and markup for the demo element:</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<style type="text/css">
#foo {
    background-color:#00f;
    color:#fff;
    height:100px;
    width:100px;
}
</style>

<div id="foo">Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</div>
<button id="demo-run">run</button>
</textarea>

<p>Now we will define the function that sets the opacity of <code>foo</code>.  The first argument of the <code>setStyle</code> method is either the ID of an HTMLElement, or an actual HTMLElement object.  The second argument is the style property being set, and the third is the value to be applied to the property.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
    var fade = function() {
        YAHOO.util.Dom.setStyle('foo', 'opacity', 0.5);
    };
</script>
</textarea>

<p>Next we will use the <a href="http://developer.yahoo.com/yui/event/">YUI Event Utility</a>'s <code>on</code> method to listen for clicks on the button.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
    YAHOO.util.Event.on('demo-run', 'click', fade);
</script>
</textarea>

<p>This is a simple example of how to use the <code>YAHOO.util.Dom.setStyle</code> method. In addition to normalizing opacity, <code>setStyle</code> fixes other properties that vary across browsers (e.g. "float").</p>

