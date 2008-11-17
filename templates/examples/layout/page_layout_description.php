<h2 class="first">Using the Layout Manager for a full page layout</h2>

<p>We can make a full page layout, by omitting the first parameter to the Layout Manager's constructor.</p>

<textarea name="code" class="JScript">
var layout = new YAHOO.widget.Layout({
});
layout.render();
</textarea>

<h2>Setting up the Layout Units</h2>

<p>Each area of the layout (top, right, bottom, left and center) is made up of <code>LayoutUnit</code>s.</p>
<p>The only <strong>required</strong> unit is the center unit. It will be the one that is fluid when styled.</p>
<p>We can setup these units by passing them into the unit array configuration option.</p>

<textarea name="code" class="JScript">
var layout = new YAHOO.widget.Layout({
    units: [
        { position: 'top' },
        { position: 'right' },
        { position: 'bottom' },
        { position: 'left' },
        { position: 'center' }
    ]
});
layout.render();
</textarea>

<h2>Configuring a unit</h2>

<p>Each unit has its own configuration settings. In the example below we, will show the following options:
<ul>
    <li><code>position</code>: The position that this unit will take in the Layout.</li>
    <li><code>header</code>: The string to use for the Header of the unit.</li>
    <li><code>width</code>: The width (in pixels) that the unit will take up in the layout.</li>
    <li><code>resize</code>: Should the unit be resizable.</li>
    <li><code>gutter</code>: The gutter applied to the unit's wrapper, before the content.</li>
    <li><code>footer</code>: An id or string to use as the footer of the unit.</li>
    <li><code>collapse</code>: Should the unit be collapable. (places an icon in the header)</li>
    <li><code>scroll</code>: Should the unit's body have scroll bars if the body content is larger than the display area.</li>
    <li><code>body</code>: An id or string to be used as the unit's body</li>
    <li><code>animate</code>: Should be animate the expand and collapse moments.</li>
</ul>
</p>
<p>See the <a href="../../docs/module_layout.html">API docs</a> for more info on LayoutUnit options.</p>

<h3>The HTML for the body</h3>
<textarea name="code" class="HTML">
<div id="right1">
    <b>Right 1</b>
    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
    Suspendisse justo nibh, pharetra at, adipiscing ullamcorper.</p>
    <!-- SNIPPED -->
</div>
</textarea>
<h3>The configuration for the Right unit</h3>
<textarea name="code" class="JScript">
{
    position: 'right',
    header: 'Right',
    width: 300,
    resize: true,
    gutter: '5px',
    footer: 'Footer',
    collapse: true,
    scroll: true,
    body: 'right1',
    animate: true
}
</textarea>


<h2>Full Example Source</h2>
<textarea name="code" class="HTML">
<div id="top1">
    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Suspendisse justo nibh, pharetra at, adipiscing ullamcorper.</p>
</div>
<div id="bottom1">
    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Suspendisse justo nibh, pharetra at, adipiscing ullamcorper.</p>
</div>
<div id="right1">
    <b>Right 1</b>
    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Suspendisse justo nibh, pharetra at, adipiscing ullamcorper.</p>
    <!-- SNIPPED -->
</div>
<div id="left1">
    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Suspendisse justo nibh, pharetra at, adipiscing ullamcorper.</p>
    <!-- SNIPPED -->
</div>
<div id="center1">
    <p id="toggle"><a href="#" id="tRight">Toggle Right</a><a href="#" id="tLeft">Toggle Left</a>
    <a href="#" id="closeLeft">Close Left</a><a href="#" id="padRight">Add Gutter to Right</a></p>
    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Suspendisse justo nibh, pharetra at, .</p>
    <!-- SNIPPED -->
</div>
</textarea>
<textarea name="code" class="JScript">
(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event;

    Event.onDOMReady(function() {
        var layout = new YAHOO.widget.Layout({
            units: [
                { position: 'top', height: 50, body: 'top1', header: 'Top', gutter: '5px', collapse: true, resize: true },
                { position: 'right', header: 'Right', width: 300, resize: true, gutter: '5px', footer: 'Footer', collapse: true, scroll: true, body: 'right1', animate: true },
                { position: 'bottom', header: 'Bottom', height: 100, resize: true, body: 'bottom1', gutter: '5px', collapse: true },
                { position: 'left', header: 'Left', width: 200, resize: true, body: 'left1', gutter: '5px', collapse: true, close: true, collapseSize: 50, scroll: true, animate: true },
                { position: 'center', body: 'center1' }
            ]
        });
        layout.on('render', function() {
            layout.getUnitByPosition('left').on('close', function() {
                closeLeft();
            });
        });
        layout.render();
        Event.on('tLeft', 'click', function(ev) {
            Event.stopEvent(ev);
            layout.getUnitByPosition('left').toggle();
        });
        Event.on('tRight', 'click', function(ev) {
            Event.stopEvent(ev);
            layout.getUnitByPosition('right').toggle();
        });
        Event.on('padRight', 'click', function(ev) {
            Event.stopEvent(ev);
            var pad = prompt('CSS gutter to apply: ("2px" or "2px 4px" or any combination of the 4 sides)', layout.getUnitByPosition('right').get('gutter'));
            layout.getUnitByPosition('right').set('gutter', pad);
        });
        var closeLeft = function() {
            var a = document.createElement('a');
            a.href = '#';
            a.innerHTML = 'Add Left Unit';
            Dom.get('closeLeft').parentNode.appendChild(a);

            Dom.setStyle('tLeft', 'display', 'none');
            Dom.setStyle('closeLeft', 'display', 'none');
            Event.on(a, 'click', function(ev) {
                Event.stopEvent(ev);
                Dom.setStyle('tLeft', 'display', 'inline');
                Dom.setStyle('closeLeft', 'display', 'inline');
                a.parentNode.removeChild(a);
                layout.addUnit(layout.get('units')[3]);
                layout.getUnitByPosition('left').on('close', function() {
                    closeLeft();
                });
            });
        };
        Event.on('closeLeft', 'click', function(ev) {
            Event.stopEvent(ev);
            layout.getUnitByPosition('left').close();
        });
    });


})();
</textarea>
