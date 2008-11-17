<h2 class="first">Using getStyle</h2>

<p><a href="/yui/dom/#getstyle"><code>getStyle</code></a>, part of the <a href="http://developer.yahoo.com/yui/dom/">YUI Dom Collection</a>, makes it easy to get the value of style properties from HTMLElements.</p>

<p>To illustrate the use of <code>getStyle</code>, we'll create a <code>&lt;div&gt;</code> called <code>foo</code> and a <code>&lt;div&gt;</code> called <code>bar</code>. When the button is clicked, the background color from <code>bar</code> will be applied to <code>foo</code>.</p>
<p>Add some simple CSS rules and markup for the demo element and a button to trigger the demo:</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<style type="text/css">
#foo {
    background-color:#00f;
    height:10px;
    width:10px;
}

#bar {
    width:100px;
    height:100px;
    background-color:#f00;
    margin:0 0 1em 100px;
}
</style>

<div id="foo"></div>
<div id="bar"></div>
<button id="demo-run">run</button>
</textarea>

<p>Now we will define the function that sets the background color of <code>foo</code> to the background color of <code>bar</code>.  The first argument of the <code>getStyle</code> method is either the ID of an HTMLElement, or an actual HTMLElement object.  The second is the style property that we wish to retrieve.  The <code>getStyle</code> method returns the element&apos;s current value for that property.

<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
    var setBgColor = function() {
        var bgcolor = YAHOO.util.Dom.getStyle('bar', 'backgroundColor');
        YAHOO.util.Dom.setStyle('foo', 'backgroundColor', bgcolor);
    };
</script>
</textarea>

<p>To trigger the demo, we will use the <a href="http://developer.yahoo.com/yui/event/">YUI Event Utility</a>'s <code>on</code> method to listen for clicks on the button.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
    YAHOO.util.Event.on('demo-run', 'click', move);
</script>
</textarea>

<p>This is a simple example of how to use the <code>YAHOO.util.Dom.getStyle</code> method.  One of the benefits of this method is that it can retrieve either inline styles or styles set in a stylesheet.  Browsers have different methods for retrieveing styles from a stylesheet, but the <code>getStyle</code> method normalizes these for you.</p>

