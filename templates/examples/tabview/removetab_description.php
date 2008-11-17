<h2 class="first">Removing Tabs from a TabView</h2>

<p>Dynamically removing tabs from a <a href="http://developer.yahoo.com/yui/tabview/">YUI TabView</a> widget is done with the <code>removeTab</code> method.</p>

<p>We will create a <code>&lt;div&gt;</code> called <code>demo</code> and include the TabView markup:</p>
<textarea name="code" class="HTML" cols="60" rows="1">
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
</textarea>

<p>Next, create an instance of TabView from our <code>demo</code> element:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
    var tabView = new YAHOO.widget.TabView('demo');
</script>
</textarea>
<p>Next we will write a function that removes the active tab:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
    var removeTab = function() {
        tabView.removeTab(tabView.get('activeTab'));
    };
</script>
<p>A button will be used to trigger the tab removal.  Here we create it, and assign a click listener that calls our removeTab function when the button is clicked:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<script>
    var button = document.createElement('button');
    button.innerHTML = 'remove tab';

    YAHOO.util.Event.on(button, 'click', removeTab);
    tabView.appendChild(button);
</script>
</textarea>
<p>This is a basic example of the TabView's addTab method.</p>

