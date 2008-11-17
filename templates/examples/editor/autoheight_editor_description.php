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

<h2>Using the config option autoHeight</h2>

<p>The Editor will now grow and shrink in height to match the content inside. It will never shrink smaller than the current height config option.</p>

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
            focusAtStart: true,
            autoHeight: true
        };

    //Now let's load the Editor..
    var myEditor = new YAHOO.widget.Editor('editor', myConfig);
    myEditor.render();
})();
</textarea>
