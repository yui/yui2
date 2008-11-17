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

<script type="text/javascript">
(function() {
    var getByClass = function(e) {
        alert('found: ' + YAHOO.util.Dom.getElementsByClassName('bar', 'div').length + ' elements');
    };

    YAHOO.util.Event.on('demo-run', 'click', getByClass);

    YAHOO.log("The example has finished loading; as you interact with it, you'll see log messages appearing here.", "info", "example");
})();
</script>
