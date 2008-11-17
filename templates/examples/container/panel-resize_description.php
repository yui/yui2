<h2 class="first">Leveraging the Resize Utility</h2>

<p>Prior to 2.5.0, we needed to add a large amount of code to the Panel control to create a resizable panel. With the Resize utility added in 2.5.0, we're able to achieve
the same results with a lot less code.</p>

<p>The Resize utility encapsulates the code required to:</p>
<ol>
 <li>Create the resize drag handle</li>
 <li>Monitor drag related events, and</li>
 <li>Resize the element it's bound to</li>
</ol>
<p>All we need to do is monitor when the panel is resized and resize it's contents relative to the new dimensions.</p>

<h2>Creating the Panel instance</h2>

<p>We start off by creating a Panel instance as we normally do. In this case we'll create it from markup:</p>
<textarea name="code" class="HTML">
<div id="resizablepanel">
    <div class="hd">Resizable Panel</div>
    <div class="bd">
        <p>Lorem Ipsum...</p>
    </div>
    <div class="ft"></div>
</div>
</textarea>

<p>CSS is used to set <code>overflow:auto</code> on the body of the panel so that scrollbars are displayed if the panel ends up being too small to display it's contents. We also provide a default height for the footer to accomodate the resize handle.</p>

<textarea name="code" class="CSS">
#resizablepanel .bd {
    overflow:auto;
    background-color:fff;
    padding:10px;
}

#resizablepanel .ft {
    height:15px;
    padding:0;
}
</textarea>

<p>NOTE: We also add three more CSS rules which, although not a core part of the design, are used to prevent the body overflow scrollbar from remaining visible in Gecko browsers on MacOS when the Panel is hidden. A detailed discussion of these rules can be found in the source of the example.</p>

<p>The JavaScript used to instantiate the Panel is shown below:</p>

<textarea name="code" class="JScript">
    var panel = new YAHOO.widget.Panel("resizablepanel", {
        draggable: true,
        width: "500px",
        height: "150px",
        autofillheight: "body",
        constraintoviewport: true,
        context: ["showbtn", "tl", "bl"]
    });
    panel.render();
</textarea>

<p>We set the <code>autofillheight</code> to <code>"body"</code>, just to highlight the behavior for the example. It is set to this value by default, and will result in the Panel resizing the body element to fill out the height of the Panel's DIV element (<code>'resizablepanel'</code>), whenever the <code>height</code> configuration property is set.

<h2>Adding the Resize Support</h2>

<h3>Creating A Resize Instance</h3>
<p>After we've rendered the panel we can attach the Resize utility to its containing DIV element. This will add the resize handle to the DIV and change it's size when the handle is dragged:</p>

<textarea name="code" class="JScript">
   var resize = new YAHOO.util.Resize('resizablepanel', {
         handles: ['br'],
         autoRatio: false,
         minWidth: 300,
         minHeight: 100,
         status: false
   });
</textarea>

<p>The Resize constructor is given the id of the HTML element we want to resize. In this case it's the containing DIV for the panel instance (with id <code>resizablepanel</code>). We also tell the resize utility we need a bottom-right handle and set <code>minWidth</code> and <code>minHeight</code> properties to limit how small the panel can get.</p>

<p>Some custom CSS is applied to the resize handle to align it with the bottom of the panel and increase the default size.</p>

<textarea name="code" class="CSS">
#resizablepanel .yui-resize-handle-br {
    right:0;
    bottom:0;
    height: 8px;
    width: 8px;
    position:absolute; 
}
</textarea>

<h3>Syncing Up Other Elements Of The Panel On Resize</h3>

<p>Dragging the handle will now resize the outer containing DIV of the panel. Since we want to keep the contents of the panel in sync with the new dimensions of the containing DIV, we listen for the <code>resize</code> event fired by the Resize instance.</p>

<p>In the listener, we set the Panel's <code>height</code> configuration property to match the new pixel height of the containing DIV. This will result in the body element, which we specified in the <code>autofillheight</code> property for the Panel, being resized to fill out the height of the containing DIV. The width is handled automatically by the browser, with the header, body and footer DIVs filling out their containing element. Setting the <code>height</code> configuration property, will also result in the iframe shim and shadow being resized to match the new dimensions of the containing DIV if required for the browser (IE6 and IE7 quirks mode).</p>

<textarea name="code" class="JScript">
   resize.on('resize', function(args) {
       var panelHeight = args.height;
       this.cfg.setProperty("height", panelHeight + "px");
   }, panel, true);
</textarea>

<h3>Setting Up Resize Constraints</h3>
<p>We also setup a listener for the <code>startResize</code> event, which we use to setup the constraints for the height and width of the resized element, if the panel's <code>constraintoviewport</code> value is set to true.</p>

<textarea name="code" class="JScript">
// Setup startResize handler, to constrain the resize width/height
// if the constraintoviewport configuration property is enabled.
resize.on('startResize', function(args) {

    if (this.cfg.getProperty("constraintoviewport")) {
        var D = YAHOO.util.Dom;

        var clientRegion = D.getClientRegion();
        var elRegion = D.getRegion(this.element);

        resize.set("maxWidth", clientRegion.right - elRegion.left - YAHOO.widget.Overlay.VIEWPORT_OFFSET);
        resize.set("maxHeight", clientRegion.bottom - elRegion.top - YAHOO.widget.Overlay.VIEWPORT_OFFSET);
    } else {
        resize.set("maxWidth", null);
        resize.set("maxHeight", null);
    }
}, panel, true);
</textarea>
