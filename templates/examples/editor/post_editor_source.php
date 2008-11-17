<style>
    #submitEditor {
        margin: 1em;
    }
    #status {
        margin: 2em;
        border: 1px solid black;
        background-color: #ccc;
        height: 4em;
    }
</style>

<form method="post" action="#" id="form1">
<textarea id="editor" name="editor" rows="20" cols="75">
This is some more test text.<br>This is some more test text.<br>This is some more test text.<br>This is some more test text.<br>This is some more test text.<br>This is some more test text.<br>This is some more test text.<br>
</textarea>
<input type="checkbox" id="filter" checked> <label for="filter">Filter editor data on server.</label><br>

<button type="button" id="submitEditor">Submit Form</button><br>

<div id="status"></div>
</form>

<script>
(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        status = null;

        var handleSuccess = function(o) {
            YAHOO.log('Post success', 'info', 'example');
            var json = o.responseText.substring(o.responseText.indexOf('{'), o.responseText.lastIndexOf('}') + 1);
            var data = eval('(' + json + ')');
            status.innerHTML = 'Status: ' + data.Results.status + '<br>Filter: ' + data.Results.filter + '<br>' + (new Date().toString());
            myEditor.setEditorHTML(data.Results.data);
        }
        var handleFailure = function(o) {
            YAHOO.log('Post failed', 'info', 'example');
            var json = o.responseText.substring(o.responseText.indexOf('{'), o.responseText.lastIndexOf('}') + 1);
            var data = eval('(' + json + ')');
            status.innerHTML = 'Status: ' + data.Results.status + '<br>';
        }

        var callback = {
            success: handleSuccess,
            failure: handleFailure
        };

    
    YAHOO.log('Create Button Control (#toggleEditor)', 'info', 'example');
    var _button = new YAHOO.widget.Button('submitEditor');

    var myConfig = {
        height: '300px',
        width: '600px',
        animate: true,
        dompath: true
    };

    YAHOO.log('Create the Editor..', 'info', 'example');
    var myEditor = new YAHOO.widget.Editor('editor', myConfig);
    myEditor.render();

    _button.on('click', function(ev) {
        YAHOO.log('Button clicked, initiate transaction', 'info', 'example');
        Event.stopEvent(ev);
        myEditor.saveHTML();
        window.setTimeout(function() {
            var sUrl = "<?php echo $assetsDirectory; ?>post.php";
            var data = 'filter=' + ((Dom.get('filter').checked) ? 'yes' : 'no') + '&editor_data=' + encodeURIComponent(myEditor.get('textarea').value);
            var request = YAHOO.util.Connect.asyncRequest('POST', sUrl, callback, data);
        }, 200);
    });


    Event.onDOMReady(function() {
        status = Dom.get('status');
    });
})();
</script>

