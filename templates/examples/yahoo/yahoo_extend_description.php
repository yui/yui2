<h2 class="first">YAHOO.lang is packaged with the YAHOO Global Object</h2>
<p><code>YAHOO.lang</code> comes bundled with the <a href="http://developer.yahoo.com/yui/yahoo/">YAHOO Global Object</a>.  To add the YAHOO Global Object, include the following in your markup:</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo($yuiCurrentVersion); ?>/build/yahoo/yahoo-min.js"></script>

</textarea>

<p>If you are using any other YUI component on your page, you should already have <code>YAHOO.lang</code> available.</p>

<h2>Creating a class hierarchy</h2>
<p>In this example, we create a class <code>YAHOO.example.Bird</code> then create a subclass <code>YAHOO.example.Chicken</code>.

<textarea name="code" class="JScript" cols="60" rows="1">
var Ye = YAHOO.example;

Ye.Bird = function (name) {
    this.name = name;
};
Ye.Bird.prototype.flighted   = true;  // Default for all Birds
Ye.Bird.prototype.isFlighted = function () { return this.flighted };
Ye.Bird.prototype.getName    = function () { return this.name };

Ye.Chicken = function (name) {
    // Chain the constructors
    this.constructor.superclass.constructor.call(this, name);
};
// Chickens are Birds
YAHOO.lang.extend(Ye.Chicken, Ye.Bird);

// Define the Chicken prototype methods/members
Ye.Chicken.prototype.flighted = false; // Override default for all Chickens
</textarea>

<h2><code>instanceof</code> many classes</h2>
<p>Unlike classes composed with augmentation, extending subclasses are also considered instances of their superclass and all classes higher up the inheritance tree.</p>

<p>We'll create an instance of <code>YAHOO.example.Chicken</code> and run some <code>instanceof</code> and method tests against it.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.util.Event.on('demo_btn','click', function () {

    // Create a test Chicken
    var chicken = new Ye.Chicken('Little');

    var results = YAHOO.util.Dom.get('demo');

    // Is the chicken an instanceof Object?
    results.innerHTML = chicken instanceof Object ?
                         "<p>chicken IS an instance of Object.</p>" :
                         "<p>chicken IS NOT an instance of Object.</p>";

    // Is the chicken an instanceof YAHOO.example.Bird?
    results.innerHTML += chicken instanceof Ye.Bird ?
                         "<p>chicken IS an instance of YAHOO.example.Bird.</p>" :
                         "<p>chicken IS NOT an instance of YAHOO.example.Bird.</p>";

    // Is the chicken an instanceof YAHOO.example.Chicken?
    results.innerHTML += chicken instanceof Ye.Chicken ?
                         "<p>chicken IS an instance of YAHOO.example.Chicken.</p>" :
                         "<p>chicken IS NOT an instance of YAHOO.example.Chicken.</p>";

    // instances inherit methods and members from their superclass and ancestors
    results.innerHTML += chicken.isFlighted() ?
                         "<p>chicken CAN fly.</p>" :
                         "<p>chicken CAN NOT fly.</p>";

    results.innerHTML += "<p>chicken's name is " + chicken.getName() + ".</p>";
});
</textarea>

<h2>Other architecture strategies</h2>
<p>Take a look at <code>YAHOO.lang.augmentProto</code> and <code>YAHOO.lang.augmentObject</code> for different strategies of managing your code structure.
