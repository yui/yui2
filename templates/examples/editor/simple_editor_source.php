<form method="post" action="#" id="form1">
<textarea id="editor" name="editor" rows="20" cols="75">
This is some more test text.<br>This is some more test text.<br>This is some more test text.<br>This is some more test text.<br>This is some more test text.<br>This is some more test text.<br>This is some more test text.<br>
</textarea>
</form>

<script>

(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event;
    
    var myConfig = {
        height: '300px',
        width: '600px',
        dompath: true,
        focusAtStart: true
    };

    YAHOO.log('Create the Editor..', 'info', 'example');
    var myEditor = new YAHOO.widget.SimpleEditor('editor', myConfig);
    myEditor.render();

})();
</script>

