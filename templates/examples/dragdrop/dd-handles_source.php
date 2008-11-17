<div id="playground">
<div id="dd-demo-1" class="dd-demo">
    <div id="dd-handle-1a" class="dd-multi-handle-1">H1</div>
    <div id="dd-handle-1b" class="dd-multi-handle-2">H2</div>
</div>
<div id="dd-demo-2" class="dd-demo">
    <div id="dd-handle-2" class="dd-handle">H</div>
</div>

<div id="dd-handle-3b" class="dd-outer-handle">Outer</div>
<div id="dd-demo-3" class="dd-demo"></div>
</div>
<script type="text/javascript">

(function() {

    var dd, dd2, dd3;
    YAHOO.util.Event.onDOMReady(function() {
        dd = new YAHOO.util.DD("dd-demo-1");

        // Configure one or more child element as a drag handle
        dd.setHandleElId("dd-handle-1a");
        dd.setHandleElId("dd-handle-1b");

        dd2 = new YAHOO.util.DD("dd-demo-2");
        dd2.setHandleElId("dd-handle-2");

        dd3 = new YAHOO.util.DD("dd-demo-3");
        dd3.setHandleElId("dd-handle-3a");

        // A handle that is not child of the source element
        dd3.setOuterHandleElId("dd-handle-3b");
    });

})();

</script>
