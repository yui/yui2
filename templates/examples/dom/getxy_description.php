<h2 class="first">Using getXY</h2>

<p><a href="/yui/dom/#getxy"><code>getXY</code></a>, part of the <a href="http://developer.yahoo.com/yui/dom/">YUI Dom Collection</a>, makes it easy to get an element's position relative to the document.</p>

<p>To illustrate the use of <code>getXY</code>, we'll create a <code>&lt;div&gt;</code> called <code>foo</code> and a <code>&lt;div&gt;</code> called <code>bar</code>. When the document is clicked, <code>foo</code> will move to the top left corner of <code>bar</code>.</p>
<p>Start with some simple CSS rules, markup for the demo elements, and a button to trigger the demo:</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<style type="text/css">
#foo {
    background-color:#00f;
    height:10px;
    width:10px;
}
#bar {
    background-color:#f00;
    height:100px;
    width:100px;
    margin:0 100px 1em;
}
</style>

<div id="foo"></div>
<div id="bar"></div>
<button id="demo-run">run</button>
</textarea>

<p>Now we will define the function that moves <code>foo</code> to the <code>xy</code> position of <code>bar</code>.  The only argument of the <code>getXY</code> method is either the ID of an HTMLElement, or an actual HTMLElement object.  The <code>getXY</code> method returns an array containing two values: <code>[x, y]</code> where <code>x</code> is the distance from the left edge of the document, and <code>y</code> is the distance from the top edge of the document. The <a href="http://developer.yahoo.com/yui/dom/">YUI Dom Collection</a> provides a <code>setXY</code> that accepts an array in the same format.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
var move = function() {
    var xy = YAHOO.util.Dom.getXY('bar');
    YAHOO.util.Dom.setXY('foo', xy);
};
</script>
</textarea>

<p>Next we will use the <a href="http://developer.yahoo.com/yui/event/">YUI Event Utility</a>'s <code>on</code> method to listen for clicks on the button.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.util.Event.on('demo-run', 'click', move);
</textarea>

<p>This is a simple example of how to use the <code>YAHOO.util.Dom.getXY</code> method.  One of the powerful things about this is that regardless of what is influencing the element's position, be it positioning (absolute, relative, etc.), margins, an <code>offsetParent</code> (any positioned ancestor), or any other factors that may affect it, <code>getXY</code> will return a position in document coordinates (e.g. <code>[0, 0]</code> will be the upper left corner of the document).</p>

