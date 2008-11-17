<div id="dd-demo-1" class="dd-demo"></div>
<div id="dd-demo-2" class="dd-demo"></div>
<div id="dd-demo-3" class="dd-demo"></div>

<div id="dd-demo-3-proxy">Custom</div>

<script type="text/javascript">
    (function() {
        var dd, dd2, dd3;
        YAHOO.util.Event.onDOMReady(function() {
            // The first two instances will share a proxy
            // element, created automatically by the utility.
            // This element will be resized at drag time so
            // that it matches the size of the source element.
            // It is configured by default to have a 2 pixel
            // grey border.
            dd = new YAHOO.util.DDProxy("dd-demo-1");
            dd2 = new YAHOO.util.DDProxy("dd-demo-2");

            // The third instance has a dedicated custom proxy
            dd3 = new YAHOO.util.DDProxy("dd-demo-3", "default", { 

                    // Define a custom proxy element.  It will be
                    // created if not already on the page.
                    dragElId: "dd-demo-3-proxy", 

                    // When a drag starts, the proxy is normally
                    // resized.  Turn this off so we can keep a
                    // fixed sized proxy.
                    resizeFrame: false
                });

        });
    })();
</script>
