<h2 class="first">Using getElementsByClassName</h2>

<p><a href="/yui/dom/#getElementsByClassName"><code>getElementsByClassName</code></a>, part of the <a href="http://developer.yahoo.com/yui/dom/">YUI Dom Collection</a>, makes it easy to collect elements that have a given <code>className</code> applied.</p>

<p>To illustrate the use of <code>getElementsByClassName</code>, we'll create a number of <code>&lt;div&gt;</code>s with various combinations of classNames applied. When the document is clicked, we will collect all of the elements that have the <code>className</code> <code>bar</code>.</p>
<p>Add with some markup for the demo elements, including a button to trigger the demo:</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<div class="bar">div class="bar"</div>
<div class="bar-baz">div class="bar-baz"</div>
<div class="bar ">div class="bar "</div>
<div class=" bar ">div class=" bar "</div>
<div class="bar baz">div class=" bar baz"</div>
<div class="bar2 baz">div class=" bar2 baz"</div>
<div class="foo">div class="foo"</div>
<div class="foo" id="bar">div class="foo" id="bar"</div>
<div class="foo bar baz">div class="foo bar baz"</div>
<p class="bar">p class="bar"</p>
<button id="demo-run">run</button>
</textarea>

<p>Now we will define the function that collects the elements with the <code>className</code> of <code>bar</code> present.  The first argument of the <code>getElementsByClassName</code> method is the <code>className</code> we are searching for.  The second argument is an optional <code>tagName</code>, which will make the search much quicker.  The third argument is an optional ID of an HTMLElement, or an actual HTMLElement object to use as the root node to start from.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
    var getByClass = function() {
        alert('found: ' + YAHOO.util.Dom.getElementsByClassName('bar', 'div').length + ' elements');
    };
</script>
</textarea>

<p>To trigger the demo, we will use the <a href="http://developer.yahoo.com/yui/event/">YUI Event Utility</a>'s <code>on</code> method to listen for clicks on the button.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
    YAHOO.util.Event.on('demo-run', 'click', getByClass);
</script>
</textarea>

<p>This is a simple example of how to use the <code>YAHOO.util.Dom.getElementsByClassName</code> method. Keep in mind that the optional arguments should be used whenever possible to maximize the performance of the search.</p>

