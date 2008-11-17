<h2 class="first">Loading TabView from an External Data Source</h2>

<p>The <a href="http://developer.yahoo.com/yui/tabview/">YUI TabView</a> provides a built-in way to load external data.</p>

<p>Because our content depends on JavaScript, in this case we will build our TabView entirely from script.  First create a container to insert our new TabView into.  This can be any existing element on the page, including the <code>&lt;body&gt;</code>, but for this example, we will create a <code>&lt;div&gt;</code> called <code>container</code>:</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<div id="container"><h2>Browser News</h2></div>
</textarea>

<p>Next we will create a TabView instance, omitting the <code>element</code> argument, which signals the constructor to create the TabView container:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
    var tabView = new YAHOO.widget.TabView();
</textarea>

<p>Next we add tabs to our TabView, including the label and a <code>dataSrc</code>pointing to the content, setting the default selected tab to "active".  To minimize the number of requests, we will set each <code>cacheData</code> for each Tab.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
    tabView.addTab( new YAHOO.widget.Tab({
        label: 'Opera',
        dataSrc: '<?php echo $assetsDirectory; ?>/news.php?&query=opera+browser',
        cacheData: true,
        active: true
    }));

    tabView.addTab( new YAHOO.widget.Tab({
        label: 'Firefox',
        dataSrc: '<?php echo $assetsDirectory; ?>/news.php?&query=firefox+browser',
        cacheData: true
    }));

    tabView.addTab( new YAHOO.widget.Tab({
        label: 'Explorer',
        dataSrc: '<?php echo $assetsDirectory; ?>/news.php?&query=microsoft+explorer+browser',
        cacheData: true
    }));

    tabView.addTab( new YAHOO.widget.Tab({
        label: 'Safari',
        dataSrc: '<?php echo $assetsDirectory; ?>/news.php?&query=apple+safari+browser',
        cacheData: true
    }));
</textarea>

<p>All that is left is to append our new TabView to our container:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
    tabView.appendTo('container');
</textarea>
<p>This is a basic example of how to load content from an external source into a TabView widget.</p>

