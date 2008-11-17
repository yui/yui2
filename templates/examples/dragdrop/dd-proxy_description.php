<h2 class="first">Drag and Drop Proxies</h2>

<p>The <a href="http://developer.yahoo.com/yui/dragdrop/">YUI Drag &amp; Drop Utility</a> lets you make HTML elements draggable.</p>

<p>For this example, we will enable drag and drop for the three <code>&lt;div&gt;</code> elements.
However, instead of dragging the elements around, a proxy element is created and moved instead.
Many implmentations can benefit from the use of the proxy element because it avoids positioning
complications that can occur when changing the css styles of the source element.  Proxy drags
also perform better than dragging the element directly.
</p>

<p>Create the <code>demo</code> elements:</p>

<textarea name="code" class="JScript" cols="60" rows="1">

<div id="dd-demo-1" class="dd-demo"></div>
<div id="dd-demo-2" class="dd-demo"></div>
<div id="dd-demo-3" class="dd-demo"></div>

<div id="dd-demo-3-proxy">Custom</div>

</textarea>

<p>Now we create the instances of <code>YAHOO.util.DDProxy</code>, passing the element ids or references for our demo elements.</p>

<textarea name="code" class="JScript" cols="60" rows="1">

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

</textarea>
