<style>
.yui-content {
    height: 250px;
}
.yui-content textarea {
    visibility: hidden;
}
</style>

<div id="e_tabs"></div>

<script>

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
        content: '<p>Tab One Content</p>',
        active: true
    }));
    
    YAHOO.log('Add the editor tab..', 'info', 'example');
    editorTab = new YAHOO.widget.Tab({
        label: 'Editor Tab',
        content: '<textarea id="editor">This is the editor content.. You can edit me!</textarea> '
    });

    myTabs.addTab(editorTab);
    
    YAHOO.log('Add the third tab..', 'info', 'example');
    myTabs.addTab( new YAHOO.widget.Tab({
        label: 'Tab Three Label',
        content: '<p>Tab Three Content</p>'
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
</script>

