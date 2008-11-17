<h2 class="first">Using addClass</h2>

<p><a href="/yui/dom/#addClass">addClass</a>, part of the <a href="http://developer.yahoo.com/yui/dom/">YUI Dom Collection</a>, makes it easy to add a given className to an element.</p>

<p>To illustrate the use of addClass, we'll create a <code>&lt;div&gt;</code> called <code>foo</code> with the className of <code>bar</code>. When the button is clicked, we will add the className <code>baz</code> to the element.</p>

<p>Add some markup for the demo element and a button to trigger the demo:</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<div id="foo" class="bar">foo</div>
<button id="demo-run">run</button>
</textarea>

<p>Now we will define the function that adds the class <code>baz</code> to the <code>foo</code> element.  The first argument of the <code>addClass</code> method is either the ID of an HTMLElement, or an actual HTMLElement object.  The second is the className to be added.

<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
    var addClass = function() {
        YAHOO.util.Dom.addClass('foo', 'baz');
        alert(YAHOO.util.Dom.get('foo').className);
    };
</script>
</textarea>

<p>To trigger the demo, we will use the <a href="http://developer.yahoo.com/yui/event/">YUI Event Utility</a>'s <code>on</code> method to listen for clicks on the button.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
    YAHOO.util.Event.on('demo-run', 'click', addClass);
</script>
</textarea>

<p>This is a simple example of how to use the Dom.addClass method. One of the benefits of this method is that it works regardless of how many classNames are present in the class attribute.</p>

