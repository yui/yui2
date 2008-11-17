<h2 class="first">Setting up the HTML</h2>

<p>First we will begin by adding a simple div to the page with the id of <code>e_tabs</code>.</p>

<textarea name="code" class="HTML">
<style>
.yui-content {
    height: 250px;
}
.yui-content textarea {
    visibility: hidden;
}
</style>
<div id="e_tabs"></div>
</textarea>

<h2>Setting up the TabView Javascript</h2>

<p>Next we need to create the TabView control.</p>

<textarea name="code" class="JScript">
(function() {
    //Setup some private variables
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event;

    var myTabs = new YAHOO.widget.TabView('e_tabs');
})();
</textarea>

<h2>Now let's add some tabs</h2>

<p>Now that we have created the Tabview control, we can add some tabs.</p>
<p>Note that we are saving a reference to the tab containing the Editor's textarea in the variable called <code>editorTab</code></p>

<textarea class="JScript" name="code">
    YAHOO.log('Add the first tab..', 'info', 'example');
    myTabs.addTab( new YAHOO.widget.Tab({
        label: 'Tab One Label',
        content: '<p>Tab One Content</p>',
        active: true
    }));
    
    YAHOO.log('Add the editor tab..', 'info', 'example');
    editorTab = new YAHOO.widget.Tab({
        label: 'Editor Tab',
        content: '&lt;textarea id="editor"&gt;This is the editor content.. You can edit me!&lt;/textarea&gt;'
    });

    myTabs.addTab(editorTab);
    
    YAHOO.log('Add the third tab..', 'info', 'example');
    myTabs.addTab( new YAHOO.widget.Tab({
        label: 'Tab Three Label',
        content: '<p>Tab Three Content</p>'
    }));
</textarea>

<h2>Rendering the Editor</h2>

<p>Now that we have a place for the Editor to live, we can now render it.</p>

<textarea class="JScript" name="code">
    var myConfig = {
        height: '100px',
        width: '600px',
        animate: true,
        dompath: true
    };

    YAHOO.log('Create the Editor..', 'info', 'example');
    var myEditor = new YAHOO.widget.Editor('editor', myConfig);
    myEditor.render();
</textarea>

<h2>Full Example Javascript Source</h2>

<textarea name="code" class="JScript">
(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        editorTab = null,
        myEditor = null;


    YAHOO.log('Create the Tabview..', 'info', 'example');
    var myTabs = new YAHOO.widget.TabView('e_tabs');
	
    YAHOO.log('Add the first tab..', 'info', 'example');
    myTabs.addTab( new YAHOO.widget.Tab({
        label: 'Tab One Label',
        content: '&lt;p&gt;Tab One Content&lt;/p&gt;',
        active: true
    }));
    
    YAHOO.log('Add the editor tab..', 'info', 'example');
    editorTab = new YAHOO.widget.Tab({
        label: 'Editor Tab',
        content: '&lt;textarea id="editor"&gt;This is the editor content.. You can edit me!&lt;/textarea&gt; '
    });

    myTabs.addTab(editorTab);
    
    YAHOO.log('Add the third tab..', 'info', 'example');
    myTabs.addTab( new YAHOO.widget.Tab({
        label: 'Tab Three Label',
        content: '&lt;p&gt;Tab Three Content&lt;/p&gt;'
    }));
    
    myTabs.on('activeTabChange', function(ev) {
        YAHOO.log('Active tab Change, check to see if we are showing the editor..', 'info', 'example');
         if (ev.newValue == editorTab) {
            var myConfig = {
                height: '100px',
                width: '600px',
                animate: true,
                dompath: true
            };
            if (!myEditor) {
                YAHOO.log('Create the Editor..', 'info', 'example');
                myEditor = new YAHOO.widget.Editor('editor', myConfig);
                myEditor.render();
            }
         }
    });
})();
</textarea>
