<h2 class="first">Using removeClass</h2>

<p><a href="/yui/dom/#removeClass"><code>removeClass</code></a>, part of the <a href="http://developer.yahoo.com/yui/dom/">YUI Dom Collection</a>, makes it easy to remove a given className from an element.</p>

<p>To illustrate the use of <code>removeClass</code>, we'll create a <code>&lt;div&gt;</code> called <code>foo</code> with the classNames of <code>bar</code> and <code>baz</code>. When the button is clicked, we will remove the className <code>baz</code> from the element.</p>
<p>Add some markup for the demo element and a button to trigger the demo:</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<div id="foo" class="bar baz">foo</div>
<button id="demo-run">run</button>
</textarea>

<p>Now we will define the function that removes the class <code>baz</code> from the <code>foo</code> element.  The first argument of the <code>removeClass</code> method is either the ID of an HTMLElement, or an actual HTMLElement object.  The second is the <code>className</code> to be removed.

<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
    var removeClass = function() {
        YAHOO.util.Dom.removeClass('foo', 'baz');
        alert(YAHOO.util.Dom.get('foo').className);
    };
</script>
</textarea>

<p>To trigger the demo, we will use the <a href="http://developer.yahoo.com/yui/event/">YUI Event Utility</a>'s <code>on</code> method to listen for clicks on the button.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
    YAHOO.util.Event.on('demo-run', 'click', testClass);
</script>
</textarea>

<p>This is a simple example of how to use the <code>YAHOO.util.Dom.removeClass</code> method. One of the benefits of this method is that it works regardless of how many <code>className</code>s are present in the class attribute.</p>

