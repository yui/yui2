<h2 class="first">Setting up the Editors HTML</h2>

<p>Setting up the Editor's HTML is done by creating a <code>textarea</code> control on the page.</p>

<textarea name="code" class="HTML">
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
        Event = YAHOO.util.Event,
        status = null;

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

<h2>Setup the Connection Manager Object</h2>

<p>We need to setup the callback object for Connection Manager. In the <code>handleSuccess</code> function, we will <code>eval</code> the data returned from the server.</p>
<p>Then we will call <code>myEditor.setEditorHTML</code> with the new HTML.</p>

<textarea name="code" class="JScript">
var handleSuccess = function(o) {
    YAHOO.log('Post success', 'info', 'example');
    var json = o.responseText.substring(o.responseText.indexOf('{'), o.responseText.lastIndexOf('}') + 1);
    var data = eval('(' + json + ')');
    status.innerHTML = 'Status: ' + data.Results.status +
        '<br>Filter: ' + data.Results.filter + '<br>' + (new Date().toString());
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
</textarea>

<h2>Setup the Button and the Checkbox</h2>

<p>Using a Button control, we create the new Button and subscribe to the <code>click</code> event to begin the transaction.</p>

<p>Before making the request, we need to pull the HTML from the editor by calling the <code>myEditor.saveHTML</code> method. This will place the filtered HTML from the Editor back into the textarea.</p>

<p>Once we have that, we contruct our query string, and fire off the request.</p>
<p><strong>Note:</strong> The request is wrapped in a short <code>setTimeout</code> to allow the browser to finish the cleanup calls that the Editor is making.</p>

<textarea name="code" class="JScript">
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
</textarea>

<h2>Snippet of server side PHP</h2>

<p>On the server side, first we filter the HTML to remove harmful HTML elements. Then we are doing a simple text filter (in this case the Elmer Fudd filter) and adding a "tagline" to the bottom of the data.</p>

<p>Once our filtering is complete, we are returning the new data to the browser.</p>

<textarea name="code" class="PHP">
header('Content-type: application/json');

// Use Services_JSON
require_once('JSON.php');
$json = new Services_JSON();

//Aggressive filtering...
$allow_tags = array(
    'b',
    'strong',
    'i',
    'em',
    'u',
    'a',
    'p',
    'sup',
    'sub',
    'div',
    'img',
    'span',
    'font',
    'br',
    'ul',
    'ol',
    'li'
);

$filter = $_POST['filter'];
$r_data = getRawEditorData('editor_data'); //Function defined in an include
$e_data = strip_tags($r_data, '<'.implode('><', $allow_tags).'>');

if ($filter == 'yes') {
	// Replace the words:
    $EditorData = fudd($e_data); //See full example code in the downloaded files..
    $EditorData .= '<br><br>--<br>Footer added on server side after filter'; 
} else {
    //Do some filtering here..
    $EditorData = $e_data;
}

//Create the payload JSON object to deliver back to the browser..
$data = new stdclass();
$data->Results = new stdclass();
$data->Results->raw_data = $r_data;
$data->Results->filter = $filter;
$data->Results->status = 'OK';
$data->Results->data = $EditorData;

echo($json->encode($data));
</textarea>


<h2>Full Example Javascript Source</h2>

<textarea name="code" class="JScript">
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
</textarea>
