<div id="foo" class="bar">foo</div>
<button id="demo-run">run</button>

<script type="text/javascript">
(function() {
    var addClass = function(e) {
        YAHOO.util.Dom.addClass('foo', 'baz');
        alert(YAHOO.util.Dom.get('foo').className);
    };

    YAHOO.util.Event.on('demo-run', 'click', addClass);

    YAHOO.log("The example has finished loading; as you interact with it, you'll see log messages appearing here.", "info", "example");
})();
</script>
