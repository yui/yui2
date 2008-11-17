<h2 class="first">TabView From Markup</h2>

<p>One way you can build a <a href="http://developer.yahoo.com/yui/tabview/">YUI TabView</a> widget is by including the required markup in your page.  This is the most accessible way to provide tabbed content, because without script or styling, the tab links function as jump links to the associated content.</p>

<p>We will create a <code>&lt;div&gt;</code> called <code>demo</code> and include the TabView markup, which includes a list of navigational links that are anchored to a div in the <code>yui-content</code> container:</p>
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

<p>All that is left is to create an instance of TabView from our <code>demo</code> element:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
    var tabView = new YAHOO.widget.TabView('demo');
</script>
</textarea>
<p>This is a basic example of how to build a TabView from markup.</p>

