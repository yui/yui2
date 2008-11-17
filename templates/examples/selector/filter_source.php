<div id="selector-demo">
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
</div>
<script type="text/javascript">
(function() {
    var nodes = document.getElementById('selector-demo').getElementsByTagName('li');
    var handleClick = function(e) {
        nodes = YAHOO.util.Selector.filter(nodes, '.selected');
        alert(nodes.length); 
    };

    YAHOO.util.Event.on('demo-run', 'click', handleClick);

    YAHOO.log("The example has finished loading; as you interact with it, you'll see log messages appearing here.", "info", "example");
})();
</script>
