<div id="demo" class="yui-navset">
    <ul class="yui-nav">
        <li><a href="#tab1"><em>Tab One Label</em></a></li>
        <li class="selected"><a href="#tab2"><em>Tab Two Label</em></a></li>
        <li><a href="#tab3"><em>Tab Three Label</em></a></li>
    </ul>            
    <div class="yui-content">
        <div id="tab1"><p>Tab One Content</p></div>
        <div id="tab2"><p>Tab Two Content</p></div>
        <div id="tab3"><p>Tab Three Content</p></div>
    </div>
</div>

<script>
(function() {
    var tabView = new YAHOO.widget.TabView('demo');
    
    var removeTab = function() {
        tabView.removeTab(tabView.get('activeTab'));
    };

    var button = document.createElement('button');
    button.innerHTML = 'remove tab';

    YAHOO.util.Event.on(button, 'click', removeTab);
    tabView.appendChild(button);

    YAHOO.log("The example has finished loading; as you interact with it, you'll see log messages appearing here.", "info", "example");
})();
</script>
