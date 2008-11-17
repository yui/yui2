<h2 class="first">YAHOO.lang is packaged with the YAHOO Global Object</h2>
<p><code>YAHOO.lang</code> comes bundled with the <a href="http://developer.yahoo.com/yui/yahoo/">YAHOO Global Object</a>.  To add the YAHOO Global Object, include the following in your markup:</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo($yuiCurrentVersion); ?>/build/yahoo/yahoo-min.js"></script>

</textarea>

<p>If you are using any other YUI component on your page, you should already have <code>YAHOO.lang</code> available.</p>

<h2>The example: Any class can be an EventProvider</h2>
<p>This example creates a custom class, then augments it with <code>YAHOO.util.EventProvider</code> (functionality included in the <a href="http://developer.yahoo.com/yui/event/">YUI Event Utility</a>).  Using the packaged functionality of <code>EventProvider</code>, the code for <code>Foo</code> is able to focus on the functionality unique to its purpose.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.namespace('example');

// Create a class Foo for some greater purpose
YAHOO.example.Foo = function () {
    /* code specific to Foo */

    // Add a custom event for the instance
    this.createEvent('interestingMoment');
}
YAHOO.example.Foo.prototype.doSomething = function() {
    /* ..do something interesting... */

    // Fire off the custom event
    this.fireEvent('interestingMoment');
}

// Make the custom event stuff possible via augmentProto
YAHOO.lang.augmentProto(YAHOO.example.Foo, YAHOO.util.EventProvider);

var f = new YAHOO.example.Foo();

// Add some event listeners
f.subscribe('interestingMoment', function () {
    var p = YAHOO.util.Dom.get('demo_p1');
    p.innerHTML = 'I was notified of an interesting moment';
});
f.subscribe('interestingMoment', function () {
    var p = YAHOO.util.Dom.get('demo_p2');
    p.innerHTML = 'I was also notified of an interesting moment';
});

// Add a listener to the button to call the instance's doSomething method
YAHOO.util.Event.on('demo','click', function () { f.doSomething() });
</textarea>

<h2>Composition, not inheritance</h2>
<p>If <code>Foo</code> were a part of a class hierarchy, it would be improper to include <code>EventProvider</code> in the inheritance chain, since the purpose of the two are fundamentally different.</p>

<p>Unlike <code>extend</code>ed classes, the relationship between a class and the classes augmenting it is not an indication of type hierarchy.  The intent of <code>augmentProto</code> is to aid in extracting nonessential behaviors or behaviors shared by many classes, allowing for a composition-style class architecture.</p>

<img src="<?= "$assetsDirectory/composition_diagram.png" ?>" alt="Diagram showing class hierarchy, highlighting has-a relationship"/>

<p>This may appear similar to multiple inheritance, but it's not.  <code>augmentProto</code> simply adds the public methods and members from one class prototype to another class prototype.  Instances of the augmented class will not pass <code>instanceof</code> tests for the class(es) which augmented it.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
function Foo() {}
Foo.prototype.doSomething = function () { /* something */ };

function Bar() {}
YAHOO.lang.augmentProto(Bar, Foo);

var b = new Bar();
if (b instanceof Bar) {} // true 
if (b instanceof Foo) {} // FALSE
</textarea>

<h2 id="augment_naming">A short history of augmentProto</h2>
<p><code>augmentProto</code> started its life as <code>YAHOO.augment</code> way back in version 0.12 of YUI.</p>

<p>In version 2.2.0, it was moved into the <code>YAHOO.lang</code> module.  The alias <code>YAHOO.augment</code> was added for backward compatibility.</p>

<p>In version 2.3.0, <code>augment</code> became <code>augmentProto</code>.  Another alias, <code>YAHOO.lang.augment</code>, was created for backward compatibility.</p>

<p>While these aliases should be around for a while, it's advisable to use <code>YAHOO.lang.augmentProto</code> going forward to ensure that your code is as future-compatible as possible.</p>
