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

<h2>Now handle the Toggle</h2>

<p>Now we will create a <code>Button</code> control and attach a <code>click</code> event to it.</p>

<p>From the click event we will determine the state of the editor (either "on" or "off"). Then we will choose to either hide or show it,</p>

<p><strong>Note:</strong> It is not recommended to set the editor to <code>display: none</code>. This causes certain browsers to lose the editor, you should use <code>visibility: hidden</code> or <code>top, left</code> (to move it out of the viewable area).</p>

<p>Before showing or hiding the Editor, we need to clean up the HTML we are using.</p>

<p>Switching from the Editor to the textarea, we need to strip the HTML from our output and replace all <code>&lt;br&gt;</code>'s with line breaks. This code snippet will handle this for our example. Your implementation may need a stronger approach.</p>

<p><b>Note:</b> You "could" add a button to the toolbar and have it execute the toggle. Then remove these few lines from the example and you will have a source editor.</p>
<textarea class="JScript" name="code">
    //From the Editor to the textarea
    var stripHTML = /<\S[^><]*>/g;
    myEditor.get('textarea').value = myEditor.get('textarea').value.replace(/<br>/gi, '\n').replace(stripHTML, '');

    //From the textarea to the Editor
    myEditor.setEditorHTML(myEditor.get('textarea').value.replace(/\n/g, '<br>'));
</textarea>

<h2>Going from the Editor to the textarea</h2>

<p>First we must call <code>myEditor.saveHTML()</code>. This method will clean up the HTML in the Editor and return it to the textarea.</p>

<p>Once it is in the textarea, we will process it to remove all of the HTML and replace the <code>&lt;br&gt;</code>'s with line breaks.</p>

<p>Now using YAHOO.util.Dom we will set <code>top</code>, <code>left</code> and <code>position: absolute</code> (this will keep the Editor from taking up page space) on the Editor elements containers firstChild (which is the container that holds the Rich Text Editor). Then we will set the textarea to <code>hidden</code>.</p>

<textarea class="JScript" name="code">
myEditor.saveHTML();
var stripHTML = /<\S[^><]*>/g;
myEditor.get('textarea').value = myEditor.get('textarea').value.replace(/<br>/gi, '\n').replace(stripHTML, '');
Dom.setStyle(myEditor.get('element_cont').get('firstChild'), 'position', 'absolute');
Dom.setStyle(myEditor.get('element_cont').get('firstChild'), 'top', '-9999px');
Dom.setStyle(myEditor.get('element_cont').get('firstChild'), 'left', '-9999px');
myEditor.get('element_cont').removeClass('yui-editor-container');
Dom.setStyle(myEditor.get('element'), 'visibility', 'visible');
Dom.setStyle(myEditor.get('element'), 'top', '');
Dom.setStyle(myEditor.get('element'), 'left', '');
Dom.setStyle(myEditor.get('element'), 'position', 'static');
</textarea>

<h2>Going from the textarea to the Editor</h2>

<p>Using YAHOO.util.Dom we will set <code>top: 0</code>, <code>left: 0</code> and <code>position: static</code> (to put the Editor back in the page) on the Editor elements containers firstChild (which is the container that holds the Rich Text Editor). Then we will set the textarea to <code>visible</code>.</p>

<p>Then we call the Editor method <code>_setDesignMode('on')</code> to re-enable designMode since it may have been lost with the visibility change.</p>

<p>Now we call the Editor method <code>setEditorHTML()</code> passing it the value of the textarea with the line breaks all converted back to <code>&lt;br&gt;</code>'s.</p>


<textarea class="JScript" name="code">
Dom.setStyle(myEditor.get('element_cont').get('firstChild'), 'position', 'static');
Dom.setStyle(myEditor.get('element_cont').get('firstChild'), 'top', '0');
Dom.setStyle(myEditor.get('element_cont').get('firstChild'), 'left', '0');
Dom.setStyle(myEditor.get('textarea'), 'display', 'none');
myEditor._setDesignMode('on');
myEditor.setEditorHTML(myEditor.get('textarea').value.replace(/\n/g, '<br>'));
Dom.setStyle(myEditor.get('element'), 'visibility', 'hidden');
Dom.setStyle(myEditor.get('element'), 'top', '-9999px');
Dom.setStyle(myEditor.get('element'), 'left', '-9999px');
Dom.setStyle(myEditor.get('element'), 'position', 'absolute');
myEditor.get('element_cont').addClass('yui-editor-container');
</textarea>

<h2>Full Example Javascript Source</h2>

<textarea name="code" class="JScript">
(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event;
    
    YAHOO.log('Create Button Control (#toggleEditor)', 'info', 'example');
    var _button = new YAHOO.widget.Button('toggleEditor');
    _button.addClass('toggleEditor');

    var myConfig = {
        height: '300px',
        width: '600px',
        animate: true,
        dompath: true,
        focusAtStart: true
    };

    var state = 'on';
    YAHOO.log('Set state to on..', 'info', 'example');

    YAHOO.log('Create the Editor..', 'info', 'example');
    var myEditor = new YAHOO.widget.Editor('editor', myConfig);
    myEditor.render();

    _button.on('click', function(ev) {
        Event.stopEvent(ev);
        if (state == 'on') {
            YAHOO.log('state is on, so turn off', 'info', 'example');
            state = 'off';
            myEditor.saveHTML();
            YAHOO.log('Save the Editors HTML', 'info', 'example');
            var stripHTML = /<\S[^><]*>/g;
            myEditor.get('textarea').value = myEditor.get('textarea').value.replace(/<br>/gi, '\n').replace(stripHTML, '');
            YAHOO.log('Strip the HTML markup from the string.', 'info', 'example');
            YAHOO.log('Set Editor container to position: absolute, top: -9999px, left: -9999px. Set textarea visible', 'info', 'example');
            Dom.setStyle(myEditor.get('element_cont').get('firstChild'), 'position', 'absolute');
            Dom.setStyle(myEditor.get('element_cont').get('firstChild'), 'top', '-9999px');
            Dom.setStyle(myEditor.get('element_cont').get('firstChild'), 'left', '-9999px');
            myEditor.get('element_cont').removeClass('yui-editor-container');
            Dom.setStyle(myEditor.get('element'), 'visibility', 'visible');
            Dom.setStyle(myEditor.get('element'), 'top', '');
            Dom.setStyle(myEditor.get('element'), 'left', '');
            Dom.setStyle(myEditor.get('element'), 'position', 'static');
        } else {
            YAHOO.log('state is off, so turn on', 'info', 'example');
            state = 'on';
            YAHOO.log('Set Editor container to position: static, top: 0, left: 0. Set textarea to hidden', 'info', 'example');
            Dom.setStyle(myEditor.get('element_cont').get('firstChild'), 'position', 'static');
            Dom.setStyle(myEditor.get('element_cont').get('firstChild'), 'top', '0');
            Dom.setStyle(myEditor.get('element_cont').get('firstChild'), 'left', '0');
            Dom.setStyle(myEditor.get('element'), 'visibility', 'hidden');
            Dom.setStyle(myEditor.get('element'), 'top', '-9999px');
            Dom.setStyle(myEditor.get('element'), 'left', '-9999px');
            Dom.setStyle(myEditor.get('element'), 'position', 'absolute');
            myEditor.get('element_cont').addClass('yui-editor-container');
            YAHOO.log('Reset designMode on the Editor', 'info', 'example');
            myEditor._setDesignMode('on');
            YAHOO.log('Inject the HTML from the textarea into the editor', 'info', 'example');
            myEditor.setEditorHTML(myEditor.get('textarea').value.replace(/\n/g, '<br>'));
        }
    });
})();
</textarea>
