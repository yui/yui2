<h2 class="first">Setting up the Editors HTML</h2>

<p>Setting up the Editor's HTML is done by creating a <code>textarea</code> control on the page.</p>

<textarea name="code" class="HTML">
<button type="button" id="toggleEditor">Toggle Editor</button>
&lt;form method="post" action="#" id="form1"&gt;
&lt;textarea id="editor" name="editor" rows="20" cols="75"&gt;
This is some more test text.<br>This is some more test text.<br>This is some more test text.<br>
This is some more test text.<br>This is some more test text.<br>This is some more test text.
&lt;/textarea&gt;
&lt;/form&gt;
</textarea>

<h2>Setting up the Editors Javascript</h2>

<p>Once the <code>textarea</code> is on the page, then initialize the Editor like this:</p>

<textarea name="code" class="JScript">
(function() {
    //Setup some private variables
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event;

        //The Editor config
        var myConfig = {
            height: '300px',
            width: '600px',
            animate: true,
            dompath: true,
            focusAtStart: true
        };

    //Now let's load the Editor..
    var myEditor = new YAHOO.widget.Editor('editor', myConfig);
    myEditor.render();
})();
</textarea>

<h2>Getting the textarea in new place</h2>
<p>By default the RTE places the <code>textarea</code> inside the Editor's parent, but for this example we need it as a sibling of the iframe.</p>
<p>So, we will subscribe to the Editor's <code>afterRender</code> event and move it around.</p>

<textarea name="code" class="JScript">
var myEditor = new YAHOO.widget.Editor('editor', myConfig);
myEditor.on('toolbarLoaded', function() {
    this.on('afterRender', function() {
        var wrapper = this.get('editor_wrapper');
        wrapper.appendChild(this.get('element'));
        this.setStyle('width', '100%');
        this.setStyle('height', '100%');
        this.setStyle('visibility', '');
        this.setStyle('top', '');
        this.setStyle('left', '');
        this.setStyle('position', '');

        this.addClass('editor-hidden');
    }, this, true);
}, myEditor, true);
myEditor.render();
</textarea>

<h2>Add our new button</h2>
<p>Now we need to add our new Code Editor button. We do this by setting up a new <code>ToolbarButton</code> config and adding it to the toolbar with the Toolbar's <code>addButtonToGroup</code> method.</p>
<textarea name="code" class="CSS">
.yui-skin-sam .yui-toolbar-container .yui-toolbar-editcode span.yui-toolbar-icon {
    background-image: url( <?php echo $assetsDirectory; ?>html_editor.gif );
    background-position: 0 1px;
    left: 5px;
}
.yui-skin-sam .yui-toolbar-container .yui-button-editcode-selected span.yui-toolbar-icon {
    background-image: url( <?php echo $assetsDirectory; ?>html_editor.gif );
    background-position: 0 1px;
    left: 5px;
}
</textarea>
<textarea name="code" class="JScript">
myEditor.on('toolbarLoaded', function() {
    var codeConfig = {
        type: 'push', label: 'Edit HTML Code', value: 'editcode'
    };
    YAHOO.log('Create the (editcode) Button', 'info', 'example');
    this.toolbar.addButtonToGroup(codeConfig, 'insertitem');

    this.on('afterRender', function() {
        //snipped
    }, this, true);
}, myEditor, true);
</textarea>

<h2>Now we handle what happens when we click that button</h2>
<p>Starting by listening for the <code>editorcodeClick</code> event, we judge what state the code editor is in by the <code>state</code> var and act as needed.</p>
<p>If the state is <code>off</code> (the default) the we will set it to <code>on</code>, then fire the <code>cleanHTML</code> 
method (to tidy up the HTML in the Editor). Now we add the class <code>editor-hidden</code> to the <code>iframe</code> and remove it from the <code>textarea</code>. This will hide the Editor's iframe and show the textarea.</p>
<p>Then we will disable the Editor's toolbar with a call to <code>this.toolbar.set('disabled', true)</code>. Now we will set the <code>codeeditor</code> button back to enabled by calling <code>this.toolbar.getButtonByValue('editcode').set('disabled', false)</code>, then select it with the <code>selectButton</code> method.</p>
<p>Now, the next time the button is clicked we will reverse the process.</p>

<textarea name="code" class="CSS">
.editor-hidden {
    visibility: hidden;
    top: -9999px;
    left: -9999px;
    position: absolute;
}
textarea {
    border: 0;
    margin: 0;
    padding: 0;
}
</textarea>
<textarea name="code" class="JScript">
//Somewhere above the Editor code
var state = 'off';
YAHOO.log('Set state to off..', 'info', 'example');


//Inside the toolbarLoaded event
this.toolbar.on('editcodeClick', function() {
    var ta = this.get('element'),
        iframe = this.get('iframe').get('element');

    if (state == 'on') {
        state = 'off';
        this.toolbar.set('disabled', false);
        YAHOO.log('Show the Editor', 'info', 'example');
        YAHOO.log('Inject the HTML from the textarea into the editor', 'info', 'example');
        this.setEditorHTML(ta.value);
        if (!this.browser.ie) {
            this._setDesignMode('on');
        }

        Dom.removeClass(iframe, 'editor-hidden');
        Dom.addClass(ta, 'editor-hidden');
        this.show();
        this._focusWindow();
    } else {
        state = 'on';
        YAHOO.log('Show the Code Editor', 'info', 'example');
        this.cleanHTML();
        YAHOO.log('Save the Editors HTML', 'info', 'example');
        Dom.addClass(iframe, 'editor-hidden');
        Dom.removeClass(ta, 'editor-hidden');
        this.toolbar.set('disabled', true);
        this.toolbar.getButtonByValue('editcode').set('disabled', false);
        this.toolbar.selectButton('editcode');
        this.dompath.innerHTML = 'Editing HTML Code';
        this.hide();
    }
    return false;
}, this, true);
</textarea>

<h2>Putting the HTML into the textarea</h2>

<p>Using the new <code>cleanHTML</code> event, we will set the value of the <code>textarea</code> each time we call <code>this.saveHTML()</code></p>

<textarea name="code" class="JScript">
this.toolbar.on('editcodeClick', function() {
    this.on('cleanHTML', function(ev) {
        YAHOO.log('cleanHTML callback fired..', 'info', 'example');
        this.get('element').value = ev.html;
    }, this, true);
}, myEditor, true);
</textarea>

<h2>Full Example Javascript Source</h2>

<textarea name="code" class="JScript">
(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event;
    
    var myConfig = {
        height: '300px',
        width: '600px',
        animate: true,
        dompath: true,
        focusAtStart: true
    };

    var state = 'off';
    YAHOO.log('Set state to off..', 'info', 'example');

    YAHOO.log('Create the Editor..', 'info', 'example');
    var myEditor = new YAHOO.widget.Editor('editor', myConfig);
    myEditor.on('toolbarLoaded', function() {
        var codeConfig = {
            type: 'push', label: 'Edit HTML Code', value: 'editcode'
        };
        YAHOO.log('Create the (editcode) Button', 'info', 'example');
        this.toolbar.addButtonToGroup(codeConfig, 'insertitem');
        
        this.toolbar.on('editcodeClick', function() {
            var ta = this.get('element'),
                iframe = this.get('iframe').get('element');

            if (state == 'on') {
                state = 'off';
                this.toolbar.set('disabled', false);
                YAHOO.log('Show the Editor', 'info', 'example');
                YAHOO.log('Inject the HTML from the textarea into the editor', 'info', 'example');
                this.setEditorHTML(ta.value);
                if (!this.browser.ie) {
                    this._setDesignMode('on');
                }

                Dom.removeClass(iframe, 'editor-hidden');
                Dom.addClass(ta, 'editor-hidden');
                this.show();
                this._focusWindow();
            } else {
                state = 'on';
                YAHOO.log('Show the Code Editor', 'info', 'example');
                this.cleanHTML();
                YAHOO.log('Save the Editors HTML', 'info', 'example');
                Dom.addClass(iframe, 'editor-hidden');
                Dom.removeClass(ta, 'editor-hidden');
                this.toolbar.set('disabled', true);
                this.toolbar.getButtonByValue('editcode').set('disabled', false);
                this.toolbar.selectButton('editcode');
                this.dompath.innerHTML = 'Editing HTML Code';
                this.hide();
            }
            return false;
        }, this, true);

        this.on('cleanHTML', function(ev) {
            YAHOO.log('cleanHTML callback fired..', 'info', 'example');
            this.get('element').value = ev.html;
        }, this, true);
        
        this.on('afterRender', function() {
            var wrapper = this.get('editor_wrapper');
            wrapper.appendChild(this.get('element'));
            this.setStyle('width', '100%');
            this.setStyle('height', '100%');
            this.setStyle('visibility', '');
            this.setStyle('top', '');
            this.setStyle('left', '');
            this.setStyle('position', '');

            this.addClass('editor-hidden');
        }, this, true);
    }, myEditor, true);
    myEditor.render();

})();
</textarea>
