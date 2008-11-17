<h2 class="first">First, a word of caution</h2>

<p><strong>Please DO NOT use this in place of feature detection</strong>.  Though many browsers have known JavaScript implementation quirks, it is bad practic and unsafe coding to make the assumption that because the page is being viewed in browser X that you can rely on feature Y being available.  Check for feature Y if you need it.</p>

<p>Browser sniffing is an imprecise science, and relies on many things in the browser environment to be just right.  Though many techniques are very accurate, 100% accuracy can't be guaranteed.</p>

<p>Use the <code>YAHOO.env.ua</code> object to inform you of what browser your page is being viewed in, but for your own sake, do not infer anything from this.</p>

<h2>What YAHOO.env.ua looks like</h2>

<p><code>YAHOO.env.ua</code> is an object literal containing keys for most major user agents.  The key corresponding to the current browser is assigned a version number.  All others have value 0.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
if (YAHOO.env.ua.gecko > 0) {}  // e.g. Firefox
if (YAHOO.env.ua.ie > 0) {}     // Microsoft Internet Explorer

// Or leverage boolean coercion -- 0 evaulates as false
if (YAHOO.env.ua.opera) {}  // Opera
if (YAHOO.env.ua.webkit) {} // Safari, Webkit
</textarea>

<p>There's more information on the <code>YAHOO.env.ua</code> object and value ranges in the <a href="http://developer.yahoo.com/yui/docs/YAHOO.env.ua.html">API Documentation</a>.</p>

<h2>Bundled with the YAHOO Global Object</h2>

<p>YAHOO.env comes bundled with the <a href="http://developer.yahoo.com/yui/yahoo/">YAHOO Global Object</a> and is used to keep track of what is known about the YUI library and the browsing environment.</p>

<p>If you are using any other YUI component on your page, you should already have YAHOO.env available.  Otherwise, add the following:</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo($yuiCurrentVersion); ?>/build/yahoo/yahoo-min.js"></script>

</textarea>

<h2>The example: drag elements and rendering bugs</h2>

<p>In this example, we'll add an iframe shim to a <a href="http://developer.yahoo.com/yui/dragdrop/">Drag and Drop</a> element to account for a known display bug in Internet Explorer 6 regarding the z-indexing of <code>select</code> elements.  For you folks out there not using IE6, here's a screen shot of the bug in action.</p>

<img src="<?= $assetsDirectory ?>/needs_shim.png" alt="IE6 shows the select above all elements despite z-indexing">

<p>In this case, there is no way other than browser sniffing or conditional comments to address IE's rendering bug.  We'll choose sniffing over using proprietary extensions.</p>

<p>Here's the markup for the example:</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<div id="demo">

    <select name="foo">
        <option value="NONE" selected="selected">This is a very long select element for the example</option>
        <option value="1">Apple</option>
        <option value="2">Rutabaga</option>
        <option value="3">Motor oil</option>
    </select>

    <hr>

    <div id="dd1">
        <p>
            NO IFRAME<br>
            Drag over the select
        </p>
    </div>

    <div id="dd2">
        <p>
            IFRAME<br>
            Drag over the select
        </p>
    </div>

</div>
</textarea>

<h2>Targeting a browser for certain action</h2>
<p>Here, we create two Drag and Drop elements, then add the shim to the <code>dd2</code> element if the page is being viewed in a vulnerable version of IE.  Normally, of course, you'd add the shim behavior to both, but this will allow us to compare results.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.util.Event.onDOMReady(function () {

    var dd1 = new YAHOO.util.DD('dd1');
    var dd2 = new YAHOO.util.DD('dd2');

    // Note the ua.{key} value must be above 0 to indicate a match
    if (YAHOO.env.ua.ie > 5 && YAHOO.env.ua.ie < 7) {

        // Create an iframe shim
        var shim = document.createElement('iframe');
        shim.src = 'about:blank';
        shim.className = 'shim';

        // Add the shim to the dragging element on the first startDrag
        dd2.startDrag = function (x,y) {
            var d = this.getEl();

            if (d.firstChild !== shim) {
                YAHOO.util.Dom.setStyle(shim, 'height',d.offsetHeight);
                d.insertBefore(shim, d.firstChild);

            }
        }
    }
});
</textarea>
