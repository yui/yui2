<h2 class="first">Setting up the Editors HTML</h2>

<p>Setting up the Editor's HTML is done by creating a <code>textarea</code> control on the page.</p>

<textarea name="code" class="HTML">
&lt;form method="post" action="#" id="form1"&gt;
&lt;textarea id="editor" name="editor" rows="20" cols="75"&gt;
Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Suspendisse justo nibh,
pharetra at, adipiscing ullamcorper, rutrum ac, enim. Nullam pretium interdum metus.
Ut in neque. Vivamus ut lorem vitae turpis porttitor tempor. Nam consectetuer est quis lacus.
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

    Event.onDOMReady(function() {
        editor = new YAHOO.widget.SimpleEditor('editor', {
            height: '300px',
            width: '522px',
            dompath: true,
            animate: true
        });
        editor.render();
    });

})();
</textarea>

<h2>Setting up the Resize Utility</h2>

<p>Now we listen for the <code>editorContentLoaded</code> event and setup our Resize instance.</p>

<textarea name="code" class="JScript">
editor.on('editorContentLoaded', function() {
    resize = new YAHOO.util.Resize(editor.get('element_cont').get('element'), {
        handles: ['br'],
        autoRatio: true,
        status: true,
        proxy: true
    });
});
</textarea>

<h2>Making the Resize Utility do what we want</h2>

<p>Now we have a resizable Editor instance, but it doesn't resize the way we want. It only resizes the outer element. But we want the Editor to resize the content area as well.</p>
<p>This is where the config option <code>setSize</code> comes in. When you set the <code>setSize</code> option to false (only when using the proxy config), 
the Resize Utility will not resize the element. It will return the data needed to resize it in the <code>resize</code> Event.</p>

<p>So now we listen for the <code>startResize</code> Event to set the <code>disabled</code> option on the Editor instance.</p>
<p>Then we listen for the <code>resize</code> Event to get the new height and width. Once we have that we can do a little math and tell the Editor instance to resize itself.</p>

<textarea name="code" class="JScript">
resize = new YAHOO.util.Resize(editor.get('element_cont').get('element'), {
    handles: ['br'],
    autoRatio: true,
    status: true,
    proxy: true,
    setSize: false //This is where the magic happens
});
resize.on('startResize', function() {
    this.hide();
    this.set('disabled', true);
}, editor, true);
resize.on('resize', function(args) {
    var h = args.height;
    var th = (this.toolbar.get('element').clientHeight + 2); //It has a 1px border..
    var dh = (this.dompath.clientHeight + 1); //It has a 1px top border..
    var newH = (h - th - dh);
    this.set('width', args.width + 'px');
    this.set('height', newH + 'px');
    this.set('disabled', false);
    this.show();
}, editor, true);
</textarea>

<h2>Styling the resize handle</h2>
<p>Next we will override the default Resize CSS and make the handle a little bigger.</p>
<textarea name="code" class="CSS">
/* The ID of the editor's container and the bottom right resize handle. */
#editor_container .yui-resize-handle-br {
    /* Make the handle a little bigger than the default */
    height: 11px;
    width: 11px;
    /* Resposition the image */
    background-position: -20px -60px;
    /* Kill the hover on the handle */
    background-color: transparent;
}
</textarea>


<h2>Full Example Source</h2>
<textarea name="code" class="JScript">
(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        editor = null,
        resize = null;

    Event.onDOMReady(function() {
        editor = new YAHOO.widget.SimpleEditor('editor', {
            height: '300px',
            width: '522px',
            dompath: true,
            animate: true
        });
        editor.on('editorContentLoaded', function() {
            resize = new YAHOO.util.Resize(editor.get('element_cont').get('element'), {
                handles: ['br'],
                autoRatio: true,
                status: true,
                proxy: true,
                setSize: false //This is where the magic happens
            });
            resize.on('startResize', function() {
                this.hide();
                this.set('disabled', true);
            }, editor, true);
            resize.on('resize', function(args) {
                var h = args.height;
                var th = (this.toolbar.get('element').clientHeight + 2); //It has a 1px border..
                var dh = (this.dompath.clientHeight + 1); //It has a 1px top border..
                var newH = (h - th - dh);
                this.set('width', args.width + 'px');
                this.set('height', newH + 'px');
                this.set('disabled', false);
                this.show();
            }, editor, true);
        });
        editor.render();
    });

})();
</textarea>

