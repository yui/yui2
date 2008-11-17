<h2 class="first">YAHOO.lang is packaged with the YAHOO Global Object</h2>
<p><code>YAHOO.lang</code> comes bundled with the <a href="http://developer.yahoo.com/yui/yahoo/">YAHOO Global Object</a>.</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo($yuiCurrentVersion); ?>/build/yahoo/yahoo-min.js"></script>

</textarea>

<p>If you are using any other YUI component on your page, you should already have <code>YAHOO.lang</code> available.</p>

<h2>Merging hash tables</h2>
<p>In the example illustrated above, we merge three object literals in the form of hash tables.  Note the key values in later parameters override those in previous parameters.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.namespace('example');

YAHOO.example.set1 = { foo : "foo" };
YAHOO.example.set2 = { foo : "BAR", bar : "bar" };
YAHOO.example.set3 = { foo : "FOO", baz : "BAZ" };

YAHOO.example.doMerge = function () {
    var Ye = YAHOO.example;

    var merged = YAHOO.lang.merge(Ye.set1, Ye.set2, Ye.set3);

    // Output the stringified version of merged
    var result = YAHOO.util.Dom.get('demo_result');
    result.innerHTML = YAHOO.example.stringifyObj(merged);
}

YAHOO.util.Event.on('demo_btn','click',YAHOO.example.doMerge);
</textarea>
