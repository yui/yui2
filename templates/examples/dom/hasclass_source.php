<div id="foo" class="bar baz">foo</div>
<button id="demo-run">run</button>

<script type="text/javascript">
(function() {
    var testClass = function(e) {
        alert(YAHOO.util.Dom.hasClass('foo', 'baz'));
    };

    YAHOO.util.Event.on('demo-run', 'click', testClass);

    YAHOO.log("The example has finished loading; as you interact with it, you'll see log messages appearing here.", "info", "example");

})();

</script>
