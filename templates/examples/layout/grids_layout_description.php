<h2 class="first">Create the Grid Markup</h2>

<p>We will start by using the <a href="http://developer.yahoo.com/yui/grids/builder/">CSS Grid Builder</a> and creating a page with the following settings:
<ul>
    <li>Body Size: 750px</li>
    <li>Body Type: Sidebar left 160px</li>
    <li>Row: 1 Column (100)</li>
</ul>
</p>

<textarea name="code" class="HTML">
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
 "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
   <title>YUI Base Page</title>
   <link rel="stylesheet" href="reset-fonts-grids.css" type="text/css">
</head>
<body>
<div id="doc1" class="yui-t1">
   <div id="hd"><h1>YUI: CSS Grid Builder</h1></div>
   <div id="bd">
        <div id="yui-main">
	        <div class="yui-b">
                <div class="yui-g">
                    <div class="yui-u first">Lorem ipsum dolor lacus feugiat.</div>
                    <div class="yui-u">Lorem ipsum dolor sit amet, acus feugiat.</div>
                </div>
            </div>
	    </div>
	    <div id="nav" class="yui-b">Navigation Pane</div>
	</div>
   <div id="ft">Footer is here.</div>
</div>
</body>
</html>
</textarea>


<h2>Creating the Layout Instance</h2>
<p>Now we need to create an element based layout associated with the <code>#doc1</code> element (the root of the Grids based page).</p>
<p>Notice that we are setting a <code>height</code> and <code>width</code> config on the layout. These are needed since we are not attaching the layout to the body.</p>

<p>Now we create the Layout Unit configs to match the Grids CSS markup. <strong>Note:</strong> We are using the <code>grids</code> config option in the left and center units. The <code>grids</code>
config option will attempt to remove some of the Grids CSS classes that interfere with the Layout's design.</p>

<p>Finally we add a listener to the Layout instance for the <code>beforeResize</code> event. 
Here we again want to set the height of the <code>#doc1</code> element to the height of the browser window.</p>

<textarea name="code" class="JScript">
(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event;

    Event.onDOMReady(function() {
        var layout = new YAHOO.widget.Layout('doc1', {
            height: Dom.getClientHeight(), //Height of the viewport
            width: Dom.get('doc1').offsetWidth, //Width of the outer element
            minHeight: 150, //So it doesn't get too small
            units: [
                { position: 'top', height: 45, body: 'hd' },
                { position: 'left', width: 160, body: 'nav', grids: true },
                { position: 'bottom', height: 25, body: 'ft' },
                { position: 'center', body: 'bd', grids: true }
            ]
        });
        layout.on('beforeResize', function() {
            Dom.setStyle('doc1', 'height', Dom.getClientHeight() + 'px');
        });

        layout.render();

        //Handle the resizing of the window
        Event.on(window, 'resize', layout.resize, layout, true);
    });
})();
</textarea>
