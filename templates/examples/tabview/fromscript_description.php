<h2 class="first">TabView From Script</h2>

<p>It is possible to build a <a href="http://developer.yahoo.com/yui/tabview/">YUI TabView</a> widget completely from script.</p>

<p>We will create a container to insert our new TabView into.  This can be any existing element on the page, including the <code>&lt;body&gt;</code>, but for this example, we will create a <code>&lt;div&gt;</code> called <code>container</code>:</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<div id="container"></div>
</textarea>


<p>First we will create a TabView instance, omitting the <code>element</code> argument, which signals the constructor to create the TabView container:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
    var tabView = new YAHOO.widget.TabView();
</textarea>

<p>Next we add tabs to our TabView, including the label and content for each tab and set the default selected tab to "active":</p>
<textarea name="code" class="JScript" cols="60" rows="1">
    tabView.addTab( new YAHOO.widget.Tab({
        label: 'lorem',
        content: '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat.</p>',
        active: true
    }));

    tabView.addTab( new YAHOO.widget.Tab({
        label: 'ipsum',
        content: '<ul><li><a href="#">Lorem ipsum dolor sit amet.</a></li><li><a href="#">Lorem ipsum dolor sit amet.</a></li><li><a href="#">Lorem ipsum dolor sit amet.</a></li><li><a href="#">Lorem ipsum dolor sit amet.</a></li></ul>'

    }));

    tabView.addTab( new YAHOO.widget.Tab({
        label: 'dolor',
        content: '<form action="#"><fieldset><legend>Lorem Ipsum</legend><label for="foo"> <input id="foo" name="foo"></label><input type="submit" value="submit"></fieldset></form>'
    }));
</textarea>

<p>All that is left is to append our new TabView to our container:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
    tabView.appendTo('container');
</textarea>
<p>This is a basic example of how to build a TabView from JavaScript.</p>

