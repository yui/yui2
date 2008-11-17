<h2 class="first">Using query</h2>

<p>The <a href="/yui/selector/#query">query</a> method, part of the <a href="http://developer.yahoo.com/yui/selector/">YUI Selector Utility</a>, makes it easy to retrieve an array of elements based on a CSS3 Selector.</p>

<p>To illustrate the use of query, we'll create a few HTML lists. When the button is clicked, we will add a red border to all <code>LI</code>s that are descendants of <code>UL</code>s, and have the class <code>selected</code> applied.</p>

<p>Add some markup for the lists and a button to trigger the demo:</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<ul>
    <li class="selected">lorem</li>
    <li>ipsum</li>
    <li>dolor</li>
    <li>sit</li>
</ul>
<ul>
    <li>lorem</li>
    <li class="selected">ipsum</li>
    <li>dolor</li>
    <li>sit</li>
</ul>
<ul>
    <li>lorem</li>
    <li>ipsum</li>
    <li>dolor</li>
    <li class="selected">sit</li>
</ul>

<ol>
    <li>lorem</li>
    <li>ipsum</li>
    <li>dolor</li>
    <li class="selected">sit</li>
</ol>
<button id="demo-run">run</button>
</textarea>

<p>Now we will define the function that adds the border when the button is clicked, and assign it as a click handler.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
    var handleClick = function(e) {
        var nodes = YAHOO.util.Selector.query('ul li.selected');
        YAHOO.util.Dom.setStyle(nodes, 'border', '1px solid red');
    };

    YAHOO.util.Event.on('demo-run', 'click', handleClick);
</script>
</textarea>

<p>This is a simple example of how to use the <code>Selector.query</code> method.</p>

