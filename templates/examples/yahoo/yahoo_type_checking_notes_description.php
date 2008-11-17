<h2 class="first">First, where it's at</h2>
<p>YAHOO.lang comes bundled with the <a href="http://developer.yahoo.com/yui/yahoo/">YAHOO Global Object</a> and contains a set of type checking routines that can help ensure the data you're working with is in the state you expect.</p>

<p>If you are using any other YUI component on your page, you should already have YAHOO.lang available.  Just make sure you have any of the following in your markup:</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo($yuiCurrentVersion); ?>/build/yahoo/yahoo-min.js"></script>

</textarea>

<h2>Consistency and readability</h2>
<p>The benefits of using YAHOO.lang type checking include:</p>
<ul>
    <li>Obviate browser idiosyncrasies</li>
    <li>Keep your code clean and readable</li>
    <li>Consistent methods yield consistent behavior</li>
</ul>

<p>As the size of your development team increases, these simple things can make a huge difference, especially during maintenance cycles and knowledge transfer.</p>

<p>Below follow some notes and caveats about type checking and YAHOO.lang's available utilities.</p>

<h2>isArray vs isObject</h2>
<p>If your code needs to separate arrays and objects, use <code>isArray</code> prior to <code>isObject</code>.  An array is an object, but an object isn't always an array.  Unlike with functions, there is no distinct native type in JavaScript to identify arrays.  As a result, code to distinguish arrays from objects can be awkward and inconsistent from one developer to the next.</p>

<p>Other objects will appear to behave as arrays, but are not.  DOM node collections, such as resulting from calls to <code>document.getElementsByTagName</code>, as well as the <code>arguments</code> object, available inside functions are two examples.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var test = YAHOO.lang;

var obj1 = {};
var obj2 = new Object();
typeof(obj1);        // 'object'

var arr1 = [];
var arr2 = new Array();
typeof(arr1);        // ALSO 'object'

// it is possible, though not advisable, to interact with arrays as objects
obj1['foo'] = 'bar';
arr1['foo'] = 'bar';

test.isArray(obj1);  // FALSE
test.isArray(obj2);  // FALSE
test.isArray(arr1);  // true
test.isArray(arr2);  // true

test.isObject(obj1); // true
test.isObject(obj2); // true
test.isObject(arr1); // true
test.isObject(arr2); // true

var nodes = document.getElementsByTagName('body');

test.isArray(nodes);           // FALSE
var body = nodes[0];           // even though it supports index subscripting
test.isArray(body.childNodes); // FALSE

function lookAtMe(arg1, arg2, arg3) {
    arguments.length;          // 3
    test.isObject(arguments);  // true
    test.isArray(arguments);   // FALSE
}
</textarea>

<h2>isUndefined</h2>
<p>Any variable name or object member name that has not been declared, or was declared but not initialized, is <code>undefined</code>.  JavaScript also supports the explicit assignment of <code>undefined</code> to variables.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var test = YAHOO.lang;

test.isUndefined(undefined);  // true

// not initialized
var x;
test.isUndefined(x);          // true

var obj = new Object();       // no object properties initialized
test.isUndefined(obj["foo"]); // true
test.isUndefined(obj);        // FALSE

// undefined as a value
x = undefined;
obj['key'] = undefined;

test.isUndefined(x);          // true
test.isUndefined(obj['key']); // true
</textarea>

<h3>isUndefined CAVEATS</h3>
<p><code>YAHOO.lang.isUndefined</code> can only safely be used to determine the state of a known variable or test for the existence of a property of a known object.  Because JavaScript will evaluate the parameter prior to supplying its value to <code>isUndefined</code>, runtime errors may occur when used to check globally scoped variables or testing for the existence of properties of a non-existent object.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var test = YAHOO.lang;

var x;
test.isUndefined(x);                          // true
test.isUndefined(notYetDeclared);             // RUNTIME ERROR
if (notYetDeclared === undefined) {}          // RUNTIME ERROR
if (typeof notYetDeclared === 'undefined') {} // Works

var obj = { 'foo' : 'bar' };
test.isUndefined(obj['property']);            // true
test.isUndefined(notYetDeclared['property']); // RUNTIME ERROR
</textarea>

<h2>isNull vs isUndefined</h2>
<p><code>null</code> is slightly less <em>nothing</em> than <code>undefined</code>.  They are distinct values, though they both evaluate to false when coerced to boolean.  Unlike <code>undefined</code>, <code>null</code> does not represent its own type.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var test = YAHOO.lang;

// Both null and undefined are values, but null must be assigned.
var x; // undefined by default
var y = null;
test.isUndefined(x); // true
test.isNull(x);      // FALSE
test.isUndefined(y); // FALSE
test.isNull(y);      // true

// undefined and null both evaluate to false through boolean type coercion
if (!x) {}           // pass
if (!y) {}           // pass
if (x == y) {}       // pass

// but neither is equal to other false values or === to the other
if (x == false) {}   // fail
if (x == 0) {}       // fail
if (x == '') {}      // fail
if (y == false) {}   // fail
if (y == 0) {}       // fail
if (y == '') {}      // fail
if (x === y) {}      // fail

// undefined is a type as well as a value
typeof(undefined);   // 'undefined'
typeof(null);        // 'object';
</textarea>

<p>The moral of the story?  <code>null</code> and <code>undefined</code> are different.  Using <code>isNull</code> and <code>isUndefined</code> will help you ensure you know exactly what you are dealing with.</p>

<h2>isFunction vs isObject</h2>
<p>If your code needs to separate functions and objects, use <code>isFunction</code> prior to <code>isObject</code>.  A function is an object, but an object isn't always a function.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var test = YAHOO.lang;

function func1() {};
var func2 = function () {};
var func3 = new Function();
typeof(func1);                // 'function'

var obj1 = {};
var obj2 = new Object();
var obj3 = {
        func4 : function () {}
};
typeof(obj1);                 // 'object'

test.isFunction(func1);         // true
test.isFunction(func2);         // true
test.isFunction(func3);         // true
test.isFunction(obj1);          // FALSE
test.isFunction(obj2);          // FALSE
test.isFunction(obj3);          // FALSE
test.isFunction(obj3['func4']); // true

test.isObject(func1);         // true
test.isObject(func2);         // true
test.isObject(func3);         // true
test.isObject(obj1);          // true
test.isObject(obj2);          // true
test.isObject(obj3);          // true
test.isObject(obj3['func4']); // true
</textarea>
