<h2 class="first">Adding Tabs to a TabView</h2>

<p>Dynamically adding tabs to a <a href="http://developer.yahoo.com/yui/tabview/">YUI TabView</a> widget is done with the <code>addTab</code> method.</p>

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
<p>For this example, a simple prompt will accept the new tab label and content.  We will need a function to accept the input, create, and add the new tab:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
    var addTab = function() {
        var labelText = window.prompt('enter the tab label');
        var content = window.prompt('enter the tab content');
        tabView.addTab( new YAHOO.widget.Tab({ label: labelText, content: content }) );
    };

</script>
<p>A button will be used to add new tabs.  Here we create it, and assign a click listener that calls our addTab function when the button is clicked:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
    var button = document.createElement('button');
    button.innerHTML = 'add tab';

    YAHOO.util.Event.on(button, 'click', addTab);
    tabView.appendChild(button);
</script>
</textarea>
<p>This is a basic example of the TabView's addTab method.</p>

