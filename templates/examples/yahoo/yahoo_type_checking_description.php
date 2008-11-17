<h2 class="first">YAHOO.lang comes with YAHOO</h2>

<p><code>YAHOO.lang</code> comes bundled with the <a href="http://developer.yahoo.com/yui/yahoo/">YAHOO Global Object</a>.</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo($yuiCurrentVersion); ?>/build/yahoo/yahoo-min.js"></script>

</textarea>

</p>If you are using any other YUI components on your page, you should already have <code>YAHOO.lang</code> available.</p>

<h2>Checking types</h2>
<p>In this example, we use a few of the type-checking methods available in <code>YAHOO.lang</code> to test various types of data.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
// Test the input using YAHOO.lang type checking methods
YAHOO.example.checkType = function (val) {
    return {
        'object'  : YAHOO.lang.isObject(val),
        'array'   : YAHOO.lang.isArray(val),
        'function': YAHOO.lang.isFunction(val)
    };
}
</textarea>

<h2>Other type checking methods</h2>
<p><code>YAHOO.lang</code> currently supports the following type checking methods:</p>
<ul>
    <li><a href="http://developer.yahoo.com/yui/docs/YAHOO.lang.html#isArray">isArray</a></li>
    <li><a href="http://developer.yahoo.com/yui/docs/YAHOO.lang.html#isBoolean">isBoolean</a></li>
    <li><a href="http://developer.yahoo.com/yui/docs/YAHOO.lang.html#isFunction">isFunction</a></li>
    <li><a href="http://developer.yahoo.com/yui/docs/YAHOO.lang.html#isNull">isNull</a></li>
    <li><a href="http://developer.yahoo.com/yui/docs/YAHOO.lang.html#isNumber">isNumber</a></li>
    <li><a href="http://developer.yahoo.com/yui/docs/YAHOO.lang.html#isObject">isObject</a></li>
    <li><a href="http://developer.yahoo.com/yui/docs/YAHOO.lang.html#isString">isString</a></li>
    <li><a href="http://developer.yahoo.com/yui/docs/YAHOO.lang.html#isUndefined">isUndefined</a></li>
    <li><a href="http://developer.yahoo.com/yui/docs/YAHOO.lang.html#isValue">isValue</a></li>
</ul>
