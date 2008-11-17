<h2 class="first">YAHOO.lang is packaged with the YAHOO Global Object</h2>
<p><code>YAHOO.lang</code> comes bundled with the <a href="http://developer.yahoo.com/yui/yahoo/">YAHOO Global Object</a>.</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo($yuiCurrentVersion); ?>/build/yahoo/yahoo-min.js"></script>

</textarea>

<p>If you are using any other YUI component on your page, you should already have YAHOO.lang available.</p>

<h2>Adding functionality to individual objects</h2>
<p>Static classes, such as <code>YAHOO.util.Dom</code>, are implemented as object literals with keys corresponding to public class methods.  As such, static classes aren't candidates for instantiation or prototype extention.  To add functionality to static classes, you need to work with the class's object literal.</p>

<p>In this example, <code>augmentObject</code> is used to add a set of behaviors to a static class.</p>

<p>We'll create a namespace <code>YAHOO.example.addons</code> to hold common packages of static methods and members.  In this namespace, we'll create a set of logging functions.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.namespace('example.addons');
YAHOO.example.addons.Logging = function () {
    var logger = null;
    
    // public methods
    return {
        initLogger : function (logNode) {
            if (!logger) {
                logger = YAHOO.util.Dom.get(logNode);
            }
        },

        log : function (message) {
            if (logger) {
                logger.innerHTML += '<p>' + message + '</p>';
            }
        }
    }
}(); // Execute the function, returning the object literal
</textarea>

<p>Now a targeted class that would benefit from these methods can add them using <code>augmentObject</code> while keeping its source focused and unique.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
// Static class with greater purpose
YAHOO.example.PageController = function () {
    var app_const = 12345;

    // Public API
    return {
        getConst : function () { return app_const },
        logConst : function () {
            this.initLogger('demo_logger');
            this.log('PageController class constant = ' +
                      this.getConst() +
                      '.  Logged courtesy of augmentation');
        }
    };
}();

// Augment PageController with the Logging methods
YAHOO.lang.augmentObject(
    YAHOO.example.PageController,
    YAHOO.example.addons.Logging);

YAHOO.util.Event.on('demo_btn','click',
                     YAHOO.example.PageController.logConst,
                     YAHOO.example.PageController, true);
</textarea>

<h2>Much like <code>YAHOO.lang.augmentProto</code></h2>
<p><code>augmentObject</code> works in similar fashion to <code>augmentProto</code>.  In fact, <code>augmentProto</code> uses <code>augmentObject</code> under the hood.  However, rather than adding functionality to class definitions (i.e. function prototypes), <code>augmentObject</code> can work with any object, including object literals and class instances.</p>

<p>See <code>augmentProto</code> and <code>extend</code> for other techniques to help manage your code structure.</p>
