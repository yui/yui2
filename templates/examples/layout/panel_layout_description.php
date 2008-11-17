<h2 class="first">Create the Panel</h2>

<p>First we must create the panel instance, like this:</p>

<textarea name="code" class="HTML">
    <div id="demo"></div>
</textarea>
<textarea name="code" class="JScript">
    var panel = new YAHOO.widget.Panel('demo', {
        draggable: true,
        close: false,
        autofillheight: "body", // default value, specified here to highlight its use in the example            
        width: '500px',
        xy: [100, 100]
    });
    panel.render();
</textarea>

<p>Now let's give it some content. Note that we are adding a DIV to the body with an id of <code>layout</code>. This will be the element we anchor the layout to.</p>
<textarea name="code" class="JScript">
    var panel = new YAHOO.widget.Panel('demo', {
        draggable: true,
        close: false,
        autofillheight: "body", // default value, specified here to highlight its use in the example            
        width: '500px',
        xy: [100, 100]
    });
    panel.setHeader('Test Panel');
    panel.setBody('<div id="layout"></div>');
    panel.render();
</textarea>

<h2>Adding the Layout instance</h2>

<p>Now we need to listen for the <code>beforeRender</code> event to render our Layout.</p>
<p>Inside of the <code>beforeRender</code> event, we will wait for the element <code>layout</code> to appear in the document, then we will setup our Layout instance.</p>
<p>The layout instance we are creating will have top, left, bottom and center units configured below:</p>

<textarea name="code" class="JScript">
    panel.setBody('<div id="layout"></div>');
    panel.beforeRenderEvent.subscribe(function() {
        Event.onAvailable('layout', function() {
            layout = new YAHOO.widget.Layout('layout', {
                height: 400,
                units: [
                    { position: 'top', height: 25, resize: false, body: 'Top', gutter: '2' },
                    { position: 'left', width: 150, resize: true, body: 'Left', gutter: '0 5 0 2', minWidth: 150, maxWidth: 300 },
                    { position: 'bottom', height: 25, body: 'Bottom', gutter: '2' },
                    { position: 'center', body: 'Center Unit', gutter: '0 2 0 0' }
                ]
            });

            layout.render();
        });
    });
    panel.render();
</textarea>

<p>Now we have a layout inside of a Panel.</p>

<h2>Make the Panel resizable</h2>

<p>After we have rendered our panel, we can attach the Resize Utility to it like this:</p>

<textarea name="code" class="JScript">
    panel.render();
    resize = new YAHOO.util.Resize('demo', {
        handles: ['br'],
        autoRatio: true,
        status: true,
        minWidth: 380,
        minHeight: 400
    });
</textarea>

<p>Now give the resize handle a little CSS to make it look nicer.</p>

<textarea name="code" class="CSS">
#demo .yui-resize-handle-br {
    height: 11px;
    width: 11px;
    background-position: -20px -60px;
    background-color: transparent;
}
</textarea>

<p>This will place a handle at the bottom right corner of the panel. This will only resize the outside portion of the panel, but we want the inside to resize properly.</p>

<p>Now we need to listen for the <code>resize</code> event on the Resize instance and do a little math.</p>

<textarea name="code" class="JScript">
    var panelHeight = args.height,
    padding = 20;
    this.cfg.setProperty("height", panelHeight + 'px');
</textarea>

<p>Now we have the Panel resizing the way we want, but the layout is not resizing to match. Inside the <code>resize</code> event from the Resize instance we need to add this at the bottom:</p>
<textarea name="code" class="JScript">
    var panelHeight = args.height,
    padding = 20;
    //Hack to trick IE into behaving
    Dom.setStyle('layout', 'display', 'none');
    this.cfg.setProperty("height", panelHeight + 'px');
    layout.set('height', this.body.offsetHeight - padding);
    layout.set('width', this.body.offsetWidth - padding);
    //Hack to trick IE into behaving
    Dom.setStyle('layout', 'display', 'block');
    layout.resize();
</textarea>

<p>Now we have a resizable panel with a fixed layout inside.</p>

<h2>Full Example Source</h2>
<textarea name="code" class="JScript">
(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        layout = null,
        resize = null;

    Event.onDOMReady(function() {
        var panel = new YAHOO.widget.Panel('demo', {
            draggable: true,
            close: false,
            autofillheight: "body", // default value, specified here to highlight its use in the example            
            underlay: 'none',
            width: '500px',
            xy: [100, 100]
        });
        panel.setHeader('Test Panel');
        panel.setBody('<div id="layout"></div>');
        panel.beforeRenderEvent.subscribe(function() {
            Event.onAvailable('layout', function() {
                layout = new YAHOO.widget.Layout('layout', {
                    height: 400,
                    width: 480,
                    units: [
                        { position: 'top', height: 25, resize: false, body: 'Top', gutter: '2' },
                        { position: 'left', width: 150, resize: true, body: 'Left', gutter: '0 5 0 2', minWidth: 150, maxWidth: 300 },
                        { position: 'bottom', height: 25, body: 'Bottom', gutter: '2' },
                        { position: 'center', body: 'Center Unit', gutter: '0 2 0 0' }
                    ]
                });

                layout.render();
            });
        });
        panel.render();
        resize = new YAHOO.util.Resize('demo', {
            handles: ['br'],
            autoRatio: true,
            status: false,
            minWidth: 380,
            minHeight: 400
        });
        resize.on('resize', function(args) {
            var panelHeight = args.height,
            padding = 20;
            //Hack to trick IE into behaving
            Dom.setStyle('layout', 'display', 'none');
            this.cfg.setProperty("height", panelHeight + 'px');
            layout.set('height', this.body.offsetHeight - padding);
            layout.set('width', this.body.offsetWidth - padding);
            //Hack to trick IE into behaving
            Dom.setStyle('layout', 'display', 'block');
            layout.resize();
            
        }, panel, true);
    });
})();
</textarea>
