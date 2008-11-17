<h2 class="first">Removing Tabs from a TabView</h2>

<p>Dynamically removing tabs to a <a href="http://developer.yahoo.com/yui/tabview/">YUI TabView</a> widget is done with the <code>removeTabs</code> method.</p>

<p>First we will create a <code>&lt;div&gt;</code> called <code>demo</code> and include the TabView markup:</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<div id="demo" class="yui-navset">
    <ul class="yui-nav">
        <li><a href="#tab1"><em>Tab One Label</em></a></li>
        <li class="selected"><a href="#tab2"><em>Tab Two Label</em></a></li>
        <li><a href="#tab3"><em>Tab Three Label</em></a></li>
    </ul>            
    <div class="yui-content">
        <div><p>Tab One Content</p></div>
        <div><p>Tab Two Content</p></div>
        <div><p>Tab Three Content</p></div>
    </div>
</div>
</textarea>

<p>Next, create an instance of TabView from our <code>demo</code> element:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<script>
(function() {
    var tabView = new YAHOO.widget.TabView('demo');
})();
</script>
</textarea>
<p>For this example, we will remove the active tab when a button is clicked.  This function will be the click handler for our button:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<script>
    var removeActiveTab = function() {
        tabView.removeTab(tabView.getActiveTab());
    };

</script>
<p>Now we create the button, and assign a click listener that calls our <code>removeActiveTab</code> function when the button is clicked:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<script>
    var button = document.createElement('button');
    button.innerHTML = 'remove tab';

    YAHOO.util.Event.on(button, 'click', removeActiveTab);
    tabView.appendChild(button);
</script>
</textarea>
<p>This is a basic example of the TabView&apos;s addTab method.</p>

