<h2 class="first">Using hasClass</h2>

<p><a href="/yui/dom/#hasClass"><code>hasClass</code></a>, part of the <a href="http://developer.yahoo.com/yui/dom/">YUI Dom Collection</a>, makes it easy to test whether a given className is present on an element.</p>

<p>To illustrate the use of <code>hasClass</code>, we'll create a <code>&lt;div&gt;</code> called <code>foo</code> with the className of <code>bar</code> and <code>baz</code>. When the button is clicked, we will test whether the <code>className</code> <code>baz</code> is present.</p>

<p>Add some markup for the demo element:</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<div id="foo" class="bar baz">foo</div>
<button id="demo-run">run</button>
</textarea>

<p>Now we will define the function that tests whether <code>foo</code> has the <code>className</code> <code>baz</code> applied.  The first argument of the <code>hasClass</code> method is either the ID of an HTMLElement, or an actual HTMLElement object.  The second is the <code>className</code> we are testing for.  The <code>hasClass</code> method returns <code>true</code> or <code>false</code>, depending on whether the <code>className</code> exists on the element.

<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
    var testClass = function() {
        alert(YAHOO.util.Dom.hasClass('foo', 'baz'));
    };
</script>
</textarea>

<p>To trigger the demo, we will use the <a href="http://developer.yahoo.com/yui/event/">YUI Event Utility</a>'s <code>on</code> method to listen for clicks on the button.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
    YAHOO.util.Event.on('demo-run', 'click', testClass);
</script>
</textarea>

<p>This is a simple example of how to use the <code>YAHOO.util.Dom.hasClass</code> method. One of the benefits of this method is that it works regardless of how many <code>className</code>s are present in the class attribute.</p>

