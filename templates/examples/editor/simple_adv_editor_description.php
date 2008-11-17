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
        Event = YAHOO.util.Event;

        //The SimpleEditor config
        var myConfig = {
            height: '300px',
            width: '600px',
            dompath: true,
            focusAtStart: true
        };

    //Now let's load the SimpleEditor..
    var myEditor = new YAHOO.widget.SimpleEditor('editor', myConfig);
    myEditor.render();
})();
</textarea>

<h2>Changing the buttons</h2>
<p>To use the advanced buttons we need to make sure that we load the <code>Menu</code> and <code>Button</code> controls first.</p>
<p>Now we need to tell the SimpleEditor to use the advanced buttons by setting the <code>_defaultToolbar.buttonType</code> variable to <code>advanced</code></p>
<textarea name="code" class="JScript">
    var myEditor = new YAHOO.widget.SimpleEditor('editor', myConfig);
    myEditor._defaultToolbar.buttonType = 'advanced';    
    myEditor.render();
</textarea>
