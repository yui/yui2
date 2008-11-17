<style type="text/css">
#foo {width:10px; height:10px;background-color:#00f;}
</style>

<div id="foo"></div>

<script>
(function() {
    var move = function(e) {
        YAHOO.util.Dom.setXY('foo', YAHOO.util.Event.getXY(e));
    };

    YAHOO.util.Event.on(document, "click", move);

    YAHOO.log("The example has finished loading; as you interact with it, you'll see log messages appearing here.", "info", "example");

})();

</script>
