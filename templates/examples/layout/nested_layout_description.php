<h2 class="first">Set up the Layout Manager for a full page layout</h2>

<p>First we will make a full page layout by omitting the first parameter to the Layout Manager's constructor.</p>

<textarea name="code" class="JScript">
var layout = new YAHOO.widget.Layout({
});
layout.render();
</textarea>

<h2>Setting up the first Layout's Units</h2>

<p>For this example we will create all 5 units in the full page layout.</p>

<textarea name="code" class="JScript">
var layout = new YAHOO.widget.Layout({
    units: [
        { position: 'top', height: 50, resize: false, body: 'top1', header: 'Top', gutter: '5px', collapse: true, resize: true },
        { position: 'right', header: 'Right', width: 300, resize: true, gutter: '2px 5px', footer: 'Footer', collapse: true, scroll: true, body: 'right1' },
        { position: 'bottom', header: 'Bottom', height: 100, resize: true, body: 'bottom1', gutter: '5px', collapse: true },
        { position: 'left', header: 'Left', width: 200, resize: true, body: 'left1', gutter: '2px 5px', collapse: true, collapseSize: 50, scroll: true },
        { position: 'center' }
    ]
});
layout.render();
</textarea>

<h2>Setting up the second layout</h2>
<p>Now that we have the first layout rendered and working, we will go back and listen for the <code>render</code> event on the first layout to create the second one.</p>
<p>Inside the <code>render</code> event, we will call the <code>getUnitByPosition('center')</code> on the first layout to get the center unit. Then we will call its method
<code>.get('wrap');</code> to get us the root element of that unit.</p>
<p>Now that we have it, we will use it as the root element of the second layout and set it up as an element based layout.</p>
<p><strong>Note:</strong> that we are passing the <code>parent</code> config option. This config option will bind the 2 layouts together so that a resize on one will fire a resize on the other.</p>

<textarea name="code" class="JScript">
        var layout = new YAHOO.widget.Layout({
            units: [
                //Snipped
            ]
        });
        layout.on('render', function() {
            var el = layout.getUnitByPosition('center').get('wrap');
            var layout2 = new YAHOO.widget.Layout(el, {
                parent: layout,
                units: [
                    { position: 'top', header: 'Top 2', height: 30, gutter: '2px' },
                    { position: 'right', header: 'Right 2', width: 90, resize: true, proxy: false, body: 'Right Content Data', collapse: true, gutter: '2px 2px 2px 5px' },
                    { position: 'left', header: 'Left 2', width: 90, resize: true, proxy: false, body: 'Left Content Data', gutter: '2px 5px 2px 2px', collapse: true },
                    { position: 'center', body: 'center2', gutter: '2px', scroll: true }
                ]
            });
            layout2.render();
        });
        layout.render();

</textarea>


<h2>Full Example Source</h2>
<textarea name="code" class="JScript">
(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event;

    Event.onDOMReady(function() {
        var layout = new YAHOO.widget.Layout({
            minWidth: 1000,
            minHeight: 500,
            units: [
                { position: 'top', height: 50, resize: false, body: 'top1', header: 'Top', gutter: '5px', collapse: true, resize: true, maxHeight: 100 },
                { position: 'right', header: 'Right', width: 300, resize: true, gutter: '2px 5px', footer: 'Footer', collapse: true, scroll: true, body: 'right1', maxWidth: 400 },
                { position: 'bottom', header: 'Bottom', height: 100, resize: true, body: 'bottom1', gutter: '5px', collapse: true, maxHeight: 130 },
                { position: 'left', header: 'Left', width: 200, resize: true, body: 'left1', gutter: '2px 5px', collapse: true, collapseSize: 50, scroll: true, maxWidth: 300 },
                { position: 'center', minWidth: 400, minHeight: 200 }
            ]
        });
        layout.on('render', function() {
            var el = layout.getUnitByPosition('center').get('wrap');
            var layout2 = new YAHOO.widget.Layout(el, {
                parent: layout,
                minWidth: 400,
                minHeight: 200,
                units: [
                    { position: 'top', header: 'Top 2', height: 30, gutter: '2px', maxHeight: 80 },
                    { position: 'right', header: 'Right 2', width: 90, resize: true, proxy: false, body: 'Right Content Data', collapse: true, gutter: '2px 2px 2px 5px', maxWidth: 200 },
                    { position: 'left', header: 'Left 2', width: 90, resize: true, proxy: false, body: 'Left Content Data', gutter: '2px 5px 2px 2px', collapse: true, maxWidth: 200 },
                    { position: 'center', body: 'center2', gutter: '2px', scroll: true }
                ]
            });
            layout2.render();
        });
        layout.render();
    });
})();
</textarea>
