<h2 class="first">Basic markup</h2>

<textarea name="code" class="HTML" cols="60" rows="1">
<html>
  <head>
    <title>YUI Browser History Manager - Simple Navigation Bar Example</title>
  </head>
  <body>
    <div id="doc">
      <div id="hd">
        <h3>Navigation Links</h3>
        <div id="nav">
          <ul>
            <li><a href="?section=home">Home</a></li>
            <li><a href="?section=overview">Overview</a></li>
            <li><a href="?section=products">Products</a></li>
            <li><a href="?section=contactus">Contact Us</a></li>
          </ul>
        </div>
      </div>
      <div id="bd">
&lt;?php

$section = "home";
$sections = array("home", "overview", "products", "contactus");
if (isset($_GET["section"]) && in_array($_GET["section"], $sections)) {
    $section = $_GET["section"];
}

include( $section . ".php" );

?&gt;
      </div>
      <div id="ft">YUI Browser History Manager - Simple Navigation Bar Example</div>
    </div>
  </body>
</html>
</textarea>

<p>
  The small portion of PHP code is responsible for including the content specified by the "section" parameter in the URL.
  This technique avoids having to rewrite common parts of a web site such as header and footer.
</p>

<p>
  This page is already fully functional. However, clicking on the links in the navigation bar will refresh the entire
  page, including portions that are common to all the sections. This is highly inefficient (especially for a large web
  site), and using AJAX will allow us to optimize this. The idea is to use client-side scripting to intercept the click
  event, cancel it, and use the YUI Connection Manager to asynchronously load the content of the section, which we can
  then write to the document using innerHTML. The only downside of this approach is that it breaks the back/forward
  buttons, and individual sections cannot be bookmarked anymore. The Browser History Manager will help us work around
  this issue.
</p>

<h2>Add the markup required by the Browser History Manager</h2>

<textarea name="code" class="HTML" cols="60" rows="1">
<iframe id="yui-history-iframe" src="assets/blank.html"></iframe>
<input id="yui-history-field" type="hidden">
</textarea>

<p>
  This markup should be inserted right after the opening <code>body</code> tag.
</p>

<h2>Import the source files and dependencies</h2>

<p>
  In our example, we need the Connection Manager, Event Utility, DOM Utility, and the Browser History Manager:
</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<script src="yahoo-dom-event.js"></script>
<script src="connection.js"></script>
<script src="history.js"></script>
</textarea>

<h2>Write the code necessary to load a section of the web site</h2>

<p>
  Use the YUI Connection Manager's <code>asyncRequest</code> to achieve this:
</p>

<textarea name="code" class="JScript" cols="60" rows="1">
function loadSection(section) {
    var url = section + ".php";

    function successHandler(obj) {
        // Use the response...
        YAHOO.util.Dom.get("bd").innerHTML = obj.responseText;
    }

    function failureHandler(obj) {
        // Fallback...
        location.href = "?section=" + section;
    }

    YAHOO.util.Connect.asyncRequest("GET", url,
        {
            success:successHandler,
            failure:failureHandler
        }
    );
}
</textarea>

<h2>Design your application</h2>

<p>
  In our simple example, we have only one module, represented by the navigation bar. We will refer to this module using
  the identifier "navbar". The state of the navigation module will be represented using the name of the corresponding
  section ("home", "overview", "products", etc.)
</p>

<h2>Retrieve the initial state of the navigation module</h2>

<p>
  Use the <code>YAHOO.util.History.getBookmarkedState</code> method to find out the initial state of a module according
  to the URL fragment identifier (which is present if the user had previously bookmarked the application). In our
  example, we also use the <code>YAHOO.util.History.getQueryStringParameter</code> method to find out the initial state
  of a module according to the query string (which is present if the user reached the page using a search engine, or if
  the user did not have scripting enabled when previously bookmarking the page). Finally, default to "home":
</p>

<textarea name="code" class="JScript" cols="60" rows="1">
var bookmarkedSection = YAHOO.util.History.getBookmarkedState("navbar");
var querySection = YAHOO.util.History.getQueryStringParameter("section");
var initialSection = bookmarkedSection || querySection || "home";
</textarea>

<h2>Register the navigation module</h2>

<p>
  Use the <code>YAHOO.util.History.register</code> method, passing in the navigation module identifier, the initial
  state of the navigation module, and the callback function that will be called when the state of the navigation
  module has changed:
</p>

<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.util.History.register("navbar", initialSection, function (state) {
    // Load the appropriate section:
    loadSection(state);
});
</textarea>

<h2>Write the code that initializes your application</h2>

<p>
  First of all, we want to change the behavior of the links in the navigation bar. In order to do this, we simply
  enumerate them, and attach to each individual anchor an <code>onclick</code> handler. In the <code>onclick</code>
  handler, we cancel the event's default behavior and do some custom action.
</p>

<p>
  We also need to display the default section if a section was requested via the URL fragment identifier, and that
  section is different from the one loaded using PHP:
</p>

<textarea name="code" class="JScript" cols="60" rows="1">
function initializeNavigationBar() {
    // Process links
    var anchors, i, len, anchor, href, section, currentSection;
    anchors = YAHOO.util.Dom.get("nav").getElementsByTagName("a");
    for (i = 0, len = anchors.length; i < len; i++) {
        anchor = anchors[i];
        YAHOO.util.Event.addListener(anchor, "click", function (evt) {
            href = this.getAttribute("href");
            section = YAHOO.util.History.getQueryStringParameter("section", href) || "home";
            // If the Browser History Manager was not successfuly initialized,
            // the following call to YAHOO.util.History.navigate will throw an
            // exception. We need to catch it and update the UI. The only
            // problem is that this new state will not be added to the browser
            // history.
            //
            // Another solution is to make sure this is an A-grade browser.
            // In that case, under normal circumstances, no exception should
            // be thrown here.
            try {
                YAHOO.util.History.navigate("navbar", section);
            } catch (e) {
                loadSection(section);
            }
            YAHOO.util.Event.preventDefault(evt);
        });
    }

    // This is the tricky part... The window's onload handler is called when the
    // user comes back to your page using the back button. In this case, the
    // actual section that needs to be loaded corresponds to the last section
    // visited before leaving the page, and not the initial section. This can
    // be retrieved using getCurrentState:
    currentSection = YAHOO.util.History.getCurrentState("navbar");
    loadSection(currentSection);
}
</textarea>

<h2>Use to the Browser History Manager <code>onReady</code> method</h2>

<p>
  Use the Browser History Manager <code>onReady</code> method to initialize the application.
</p>

<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.util.History.onReady(function () {
    initializeNavigationBar();
});
</textarea>

<h2>Initialize the Browser History Manager</h2>

<p>
  Simply call <code>YAHOO.util.History.initialize</code>, passing in the id of the input field and IFrame we inserted
  in our static markup:
</p>

<textarea name="code" class="JScript" cols="60" rows="1">
// Initialize the browser history management library.
try {
    YAHOO.util.History.initialize("yui-history-field", "yui-history-iframe");
} catch (e) {
    // The only exception that gets thrown here is when the browser is
    // not supported (Opera, or not A-grade) Degrade gracefully.
    // Note that we have two options here to degrade gracefully:
    //   1) Call initializeNavigationBar. The page will use Ajax/DHTML,
    //      but the back/forward buttons will not work.
    //   2) Initialize our module. The page will not use Ajax/DHTML,
    //      but the back/forward buttons will work. This is what we
    //      chose to do here:
    loadSection(initSection);
}
</textarea>