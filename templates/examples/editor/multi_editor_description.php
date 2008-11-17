<h2 class="first">Setting up the HTML</h2>

<p>First we place a textarea on the page and set it to visibility hidden, then create the editable areas and assign them a class of <code>editable</code></p>

<p>By using the <code>.yui-editor-container</code> class, we are setting the Editor to an absolute position of -9999px top and -9999px left to render it off of the screen.</p>

<textarea name="code" class="CSS">
.yui-editor-container {
    position: absolute;
    top: -9999px;
    left: -9999px;
    z-index: 999; /* So Safari behaves */
}
#editor {
    visibility: hidden;
    position: absolute;
}
.editable {
    border: 1px solid black;
    margin: .25em;
    float: left;
    width: 350px;
    height: 100px;
}
</textarea>
<textarea name="code" class="HTML">
&lt;textarea id="editor"&gt;&lt;/textarea&gt;

<div id="editable_cont">
    <div class="editable">#1. Double click me to edit the contents</div>
    <div class="editable">#2. Double click me to edit the contents</div>
    <div class="editable">#3. Double click me to edit the contents</div>
    <div class="editable">#4. Double click me to edit the contents</div>
    <div class="editable">#5. Double click me to edit the contents</div>
    <div class="editable">#6. Double click me to edit the contents</div>
</div>
</textarea>

<h2>Prep the Editor</h2>

<p>First we are going to setup the editor with a smaller toolbar.</p>

<textarea name="code" class="JScript">
(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        editing = null;
    
    YAHOO.log('Setup a stripped down config for the editor', 'info', 'example');
    var myConfig = {
        height: '150px',
        width: '380px',
        animate: true,
        limitCommands: true,
        toolbar: {
            titlebar: 'My Editor',
            collapse: true,
            buttons: [
                { group: 'textstyle', label: 'Font Style',
                    buttons: [
                        { type: 'push', label: 'Bold', value: 'bold' },
                        { type: 'push', label: 'Italic', value: 'italic' },
                        { type: 'push', label: 'Underline', value: 'underline' },
                        { type: 'separator' },
                        { type: 'select', label: 'Arial', value: 'fontname', disabled: true,
                            menu: [
                                { text: 'Arial', checked: true },
                                { text: 'Arial Black' },
                                { text: 'Comic Sans MS' },
                                { text: 'Courier New' },
                                { text: 'Lucida Console' },
                                { text: 'Tahoma' },
                                { text: 'Times New Roman' },
                                { text: 'Trebuchet MS' },
                                { text: 'Verdana' }
                            ]
                        },
                        { type: 'spin', label: '13', value: 'fontsize', range: [ 9, 75 ], disabled: true },
                        { type: 'separator' },
                        { type: 'color', label: 'Font Color', value: 'forecolor', disabled: true },
                        { type: 'color', label: 'Background Color', value: 'backcolor', disabled: true }
                    ]
                }
            ]
        }
    };

    YAHOO.log('Create the Editor..', 'info', 'example');
    myEditor = new YAHOO.widget.Editor('editor', myConfig);
    myEditor.render();
})();
</textarea>

<h2>Showing the Editor</h2>
<p>Now that we have the Editor rendered and positioned off of the screen, we need to be able to show it when you double click on an editable area.</p>

<p>We add a <code>dblclick</code> listener to the container <code>editable_cont</code>.</p>

<p>Inside of this listener, we grab the target of the event and check to see if it has the <code>editable</code> class.</p>
<p><strong>Note:</strong> This logic may need to be refined for your use case as it relies on the user clicking the DIV with the editable class, so clicking on an element inside the div will fail. Most of the time, you would probably want the user to click on some sort of Edit button to exec this action.</p>
<p>Once we have the DIV, we set the Editor's HTML with the innerHTML of the DIV.</p>
<p>Next we position the Editor with the XY coordinates of the DIV.</p>

<textarea name="code" class="JScript">
    Event.on('editable_cont', 'dblclick', function(ev) {
        var tar = Event.getTarget(ev);
        while(tar.id != 'editable_cont') {
            if (Dom.hasClass(tar, 'editable')) {
                YAHOO.log('An element with the classname of editable was double clicked on.', 'info', 'example');
                if (editing !== null) {
                    YAHOO.log('There is an editor open, save its data before continuing..', 'info', 'example');
                    myEditor.saveHTML();
                    editing.innerHTML = myEditor.get('element').value;
                }
                YAHOO.log('Get the XY position of the Element that was clicked', 'info', 'example');
                var xy = Dom.getXY(tar);
                YAHOO.log('Set the Editors HTML with the elements innerHTML', 'info', 'example');
                myEditor.setEditorHTML(tar.innerHTML);
                YAHOO.log('Reposition the editor with the elements xy', 'info', 'example');
                Dom.setXY(myEditor.get('element_cont').get('element'), xy);
                editing = tar;
            }
            tar = tar.parentNode;
        }
    });
</textarea>

<h2>Saving the Editor with the toolbar</h2>
<p>Now we need to setup a way to save the Editor's data, we are going to override the toolbar's collapse button and use it as a save button.</p>
<p>First we need to override the text on the collapse button, we do that by overriding the var <code>STR_COLLAPSE</code> on the <code>YAHOO.widget.Toolbar</code>'s prototype.</p>
<p>Now we listen for the <code>toolbarLoaded</code> event so we can attach our handler to the <code>toolbarCollapsed</code> event.</p>
<p>Inside of the <code>toolbarCollapsed</code> event, we will save the Editor's data back to the editable area. Then we will set the position of the editor back to -9999px left and -9999px top.</p>
<p><strong>Note:</strong> You could also do this using a Save button in the toolbar.</p>
<textarea name="code" class="JScript">
    YAHOO.log('Override the prototype of the toolbar to use a different string for the collapse button', 'info', 'example');
    YAHOO.widget.Toolbar.prototype.STR_COLLAPSE = 'Click to close the editor.';
    YAHOO.log('Create the Editor..', 'info', 'example');
    myEditor = new YAHOO.widget.Editor('editor', myConfig);
    myEditor.on('toolbarLoaded', function() {
        YAHOO.log('Toolbar is loaded, add a listener for the toolbarCollapsed event', 'info', 'example');
        this.toolbar.on('toolbarCollapsed', function() {
            YAHOO.log('Toolbar was collapsed, reposition and save the editors data', 'info', 'example');
            Dom.setXY(this.get('element_cont').get('element'), [-99999, -99999]);
            Dom.removeClass(this.toolbar.get('cont').parentNode, 'yui-toolbar-container-collapsed');
            myEditor.saveHTML();
            editing.innerHTML = myEditor.get('element').value;
            editing = null;
        }, myEditor, true);
    }, myEditor, true);
    myEditor.render();
</textarea>

<h2>Full Example Javascript Source</h2>

<textarea name="code" class="JScript">
(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        editing = null;
    
    YAHOO.log('Setup a stripped down config for the editor', 'info', 'example');
    var myConfig = {
        height: '150px',
        width: '380px',
        animate: true,
        limitCommands: true,
        toolbar: {
            titlebar: 'My Editor',
            collapse: true,
            buttons: [
                { group: 'textstyle', label: 'Font Style',
                    buttons: [
                        { type: 'push', label: 'Bold', value: 'bold' },
                        { type: 'push', label: 'Italic', value: 'italic' },
                        { type: 'push', label: 'Underline', value: 'underline' },
                        { type: 'separator' },
                        { type: 'select', label: 'Arial', value: 'fontname', disabled: true,
                            menu: [
                                { text: 'Arial', checked: true },
                                { text: 'Arial Black' },
                                { text: 'Comic Sans MS' },
                                { text: 'Courier New' },
                                { text: 'Lucida Console' },
                                { text: 'Tahoma' },
                                { text: 'Times New Roman' },
                                { text: 'Trebuchet MS' },
                                { text: 'Verdana' }
                            ]
                        },
                        { type: 'spin', label: '13', value: 'fontsize', range: [ 9, 75 ], disabled: true },
                        { type: 'separator' },
                        { type: 'color', label: 'Font Color', value: 'forecolor', disabled: true },
                        { type: 'color', label: 'Background Color', value: 'backcolor', disabled: true }
                    ]
                }
            ]
        }
    };

    YAHOO.log('Override the prototype of the toolbar to use a different string for the collapse button', 'info', 'example');
    YAHOO.widget.Toolbar.prototype.STR_COLLAPSE = 'Click to close the editor.';
    YAHOO.log('Create the Editor..', 'info', 'example');
    myEditor = new YAHOO.widget.Editor('editor', myConfig);
    myEditor.on('toolbarLoaded', function() {
        YAHOO.log('Toolbar is loaded, add a listener for the toolbarCollapsed event', 'info', 'example');
        this.toolbar.on('toolbarCollapsed', function() {
            YAHOO.log('Toolbar was collapsed, reposition and save the editors data', 'info', 'example');
            Dom.setXY(this.get('element_cont').get('element'), [-99999, -99999]);
            Dom.removeClass(this.toolbar.get('cont').parentNode, 'yui-toolbar-container-collapsed');
            myEditor.saveHTML();
            editing.innerHTML = myEditor.get('element').value;
            editing = null;
        }, myEditor, true);
    }, myEditor, true);
    myEditor.render();

    Event.on('editable_cont', 'dblclick', function(ev) {
        var tar = Event.getTarget(ev);
        while(tar.id != 'editable_cont') {
            if (Dom.hasClass(tar, 'editable')) {
                YAHOO.log('An element with the classname of editable was double clicked on.', 'info', 'example');
                if (editing !== null) {
                    YAHOO.log('There is an editor open, save its data before continuing..', 'info', 'example');
                    myEditor.saveHTML();
                    editing.innerHTML = myEditor.get('element').value;
                }
                YAHOO.log('Get the XY position of the Element that was clicked', 'info', 'example');
                var xy = Dom.getXY(tar);
                YAHOO.log('Set the Editors HTML with the elements innerHTML', 'info', 'example');
                myEditor.setEditorHTML(tar.innerHTML);
                YAHOO.log('Reposition the editor with the elements xy', 'info', 'example');
                Dom.setXY(myEditor.get('element_cont').get('element'), xy);
                editing = tar;
            }
            tar = tar.parentNode;
        }
    });
})();
</textarea>
