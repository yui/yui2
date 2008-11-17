<style>
    #toggleEditor {
        margin: 1em;
    }
</style>

<button type="button" id="toggleEditor">Toggle Editor</button><br>
<form method="post" action="#" id="form1">
<textarea id="editor" name="editor" rows="20" cols="75">
This is some more test text.<br>This is some more test text.<br>This is some more test text.<br>This is some more test text.<br>This is some more test text.<br>This is some more test text.<br>This is some more test text.<br>
</textarea>
</form>

<script>

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
</script>

