<style>

#yui-history-iframe {
  position:absolute;
  top:0; left:0;
  width:1px; height:1px; /* avoid scrollbars */
  visibility:hidden;
}

#demo { margin-bottom:1em; }

</style>

<!-- Static markup required for browser history management. Note that these
     could be created using document.write in a script block. But they have
     to be created while the page is being parsed, so it cannot be done
     from an imported script file. Also, these have to be created as early
     as possible to avoid problems on Internet Explorer.
     Note that "magic URLs" such as:

         javascript:document.open();document.write(new Date().getTime());document.close();

     and such do NOT work on IE6! Only a real document works (that "real
     document" does not need to be an HTML document. It can be an image
     as well. Using an asset that you use somewhere else on your site,
     instead of a separate asset avoids an unnecessary server round trip.
     Finally, note that the iframe is only used on Internet Explorer.
     If this page is server generated (by a PHP script for example), it is
     a good idea to create the IFrame ONLY for Internet Explorer (use
     server side user agent sniffing) -->

<iframe id="yui-history-iframe" src="assets/blank.html"></iframe>
<input id="yui-history-field" type="hidden">

<!-- Static markup required for the TabView widget. -->

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

<script>

(function () {

    // The initially selected tab will be chosen in the following order:
    //
    // URL fragment identifier (it will be there if the user previously
    // bookmarked the application in a specific state)
    //
    //         or
    //
    // "tab0" (default)

    var bookmarkedTabViewState = YAHOO.util.History.getBookmarkedState("tabview");
    var initialTabViewState = bookmarkedTabViewState || "tab0";

    var tabView;

    // Register our TabView module. Module registration MUST
    // take place before calling YAHOO.util.History.initialize.
    YAHOO.util.History.register("tabview", initialTabViewState, function (state) {
        // This is called after calling YAHOO.util.History.navigate, or after the user
        // has trigerred the back/forward button. We cannot discrminate between
        // these two situations.

        // "state" can be "tab0", "tab1" or "tab2".
        // Select the right tab:
        tabView.set("activeIndex", state.substr(3));
    });

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

    function initTabView () {
        // Instantiate the TabView control...
        tabView = new YAHOO.widget.TabView("demo");
        tabView.addListener("activeTabChange", handleTabViewActiveTabChange);
    }

    // Use the Browser History Manager onReady method to instantiate the TabView widget.
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

    // Initialize the browser history management library.
    try {
        YAHOO.util.History.initialize("yui-history-field", "yui-history-iframe");
    } catch (e) {
        // The only exception that gets thrown here is when the browser is
        // not supported (Opera, or not A-grade) Degrade gracefully.
        initTabView();
    }

})();

</script>
