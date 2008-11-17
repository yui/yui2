<h2>Basic markup</h2>

<p>
  In our example, the TabView widget relies on the following markup:
</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<div id="demo" class="yui-navset yui-navset-top">
  <ul class="yui-nav">
    <li><a href="#tab1"><em>Tab One Label</em></a></li>
    <li title="active" class="selected"><a href="#tab2"><em>Tab Two Label</em></a></li>
    <li title="" class=""><a href="#tab3"><em>Tab Three Label</em></a></li>
  </ul>
  <div class="yui-content">
    <div style="display: none;" id="tab1"><p>Tab One Content</p></div>
    <div style="display: block;" id="tab2"><p>Tab Two Content</p></div>
    <div style="display: none;" id="tab3"><p>Tab Three Content</p></div>
  </div>
</div>
</textarea>

<h2>Add the markup required by the Browser History Manager</h2>

<textarea name="code" class="HTML" cols="60" rows="1">
<iframe id="yui-history-iframe" src="assets/blank.html"></iframe>
<input id="yui-history-field" type="hidden">
</textarea>

<p>
  This markup should be inserted right after the opening <code>body</code> tag.
</p>

<h2 class="first">Import the source files and dependencies</h2>

<p>
  In our example, we need the Event Utility, DOM Utility, TabView Widget, and the Browser History Manager:
</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<link rel="stylesheet" type="text/css" href="tabview.css"/>
<script src="yahoo-dom-event.js"></script>
<script src="element-beta.js"></script>
<script src="tabview.js"></script>
<script src="history.js"></script>
</textarea>

<h2>Design your application</h2>

<p>
  In our simple example, we have only one module, represented by the TabView widget. We will refer to this module using the identifier
  "tabview". The state of the TabView module will be represented using the string <code>"tab"</code> followed by the selected tab
  index (e.g. <code>"tab2"</code> if the third tab is selected)
</p>

<h2>Retrieve the initial state of the TabView module</h2>

<p>
  Use the <code>YAHOO.util.History.getBookmarkedState</code> method and default to the first tab:
</p>

<textarea name="code" class="JScript" cols="60" rows="1">
var bookmarkedTabViewState = YAHOO.util.History.getBookmarkedState("tabview");
var initialTabViewState = bookmarkedTabViewState || "tab0";
</textarea>

<h2>Register the TabView module</h2>

<p>
  Use the <code>YAHOO.util.History.register</code> method, passing in the TabView module identifier, the initial state of the TabView
  module, and the callback function that will be called when the state of the TabView module has changed:
</p>

<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.util.History.register("tabview", initialTabViewState, function (state) {
    // Select the tab according to the "state" parameter:
    tabView.set("activeIndex", state.substr(3));
});
</textarea>

<h2>Write the code that initializes your application</h2>

<textarea name="code" class="JScript" cols="60" rows="1">
var tabView;

function initTabView () {
    // Instantiate the TabView control...
    tabView = new YAHOO.widget.TabView("demo");
    tabView.addListener("activeTabChange", handleTabViewActiveTabChange);
}
</textarea>

<h2>Use the Browser History Manager <code>onReady</code> method</h2>

<p>
  Use the Browser History Manager <code>onReady</code> method to instantiate the TabView widget. Also, retrieve the current
  state of the TabView module, and use that state to select the right tab (the current state may be different from the initial
  state under certain circumstances - see the User's Guide)
</p>

<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.util.History.onReady(function () {
    var currentState;

    initTabView();

    // This is the tricky part... The onLoad event is fired when the user
    // comes back to the page using the back button. In this case, the
    // actual tab that needs to be selected corresponds to the last tab
    // selected before leaving the page, and not the initially selected tab.
    // This can be retrieved using getCurrentState:
    currentState = YAHOO.util.History.getCurrentState("tabview");
    tabView.set("activeIndex", currentState.substr(3));
});
</textarea>

<h2>Add history entries</h2>

<p>
  A new history entry must be added every time the user selects a tab. Use the TabView widget's <code>activeTabChange</code>
  event handler (set to <code>handleTabViewActiveTabChange</code> - see above):
</p>

<textarea name="code" class="JScript" cols="60" rows="1">
function handleTabViewActiveTabChange (e) {
    var newState, currentState;

    newState = "tab" + this.getTabIndex(e.newValue);

    try {
        currentState = YAHOO.util.History.getCurrentState("tabview");
        // The following test is crucial. Otherwise, we end up circling forever.
        // Indeed, YAHOO.util.History.navigate will call the module onStateChange
        // callback, which will call tabView.set, which will call this handler
        // and it keeps going from here...
        if (newState != currentState) {
            YAHOO.util.History.navigate("tabview", newState);
        }
    } catch (e) {
        tabView.set("activeIndex", newState.substr(3));
    }
}
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
    initTabView();
}
</textarea>
