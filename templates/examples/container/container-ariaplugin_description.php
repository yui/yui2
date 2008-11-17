<h2>Getting Started</h2>
<p>
Using the Container ARIA Plugin is easy.  Simply include the source file(s) for the ARIA plugin 
after the Container source files as indicated on the Container landing page.
</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<!-- Source file -->
<script type="text/javascript" src="../container/assets/containerariaplugin.js"></script>
</textarea>

<p>
All YUI ARIA Plugins require the user's browser and AT support the WAI-ARIA Roles and States.  
Currently only <a href="http://www.mozilla.com/en-US/firefox/">Firefox 3</a> and 
<a href="http://www.microsoft.com/windows/products/winfamily/ie/ie8/getitnow.mspx">Internet Explorer
8</a> have support for ARIA, and are supported by several screen readers for 
Windows that also offer support for ARIA.  For this reason the YUI ARIA Plugins are only enabled 
by default for these browsers.  To enable the ARIA plugin for other browsers, simply the set 
the <code>usearia</code> configuration property to <code>true</code>.  For example:
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var oPanel = new YAHOO.widget.Panel("panel-1", {
	
	visible: false,
	fixedcenter: true,
	constraintoviewport: true,
	width: "300px",
	usearia: true

});
</textarea>

<h2>Plugin Features</h2>
<h3>Enhancements to Module and Overlay</h3>
<h4>IFrames Automatically Hidden from AT</h4>
<p>
Both the Module and Overlay widgets make use of iframes &#8212; Module for the purpose of 
publishing the <code>textResize</code> Custom Event, and Overlay provides an iframe shim to 
prevent <code>&#60;select&#62;</code> from poking through Overlay instances.  In both cases 
the iframe elements are hidden from the user using CSS.  To ensure these iframes also remain
hidden from AT, the Container ARIA Plugin sets the <code>role</code> attribute of each iframe to
<a href="http://www.w3.org/TR/wai-aria/#presentation"><code>presentation</code></a> and sets 
their <code>tabIndex</code> attribute to <code>-1</code>.
</p>

<h4>Visible State Communicated to AT</h4>
<p>
All Container widgets inherit a <code>visible</code> configuration property from Module.  To 
ensure that the visible state is properly conveyed to AT, the Container ARIA Plugin automatically
toggles the <a href="http://www.w3.org/TR/wai-aria/#hidden"><code>aria-hidden</code></a> 
attribute to the correct value when the value of the <code>visible</code> configuration property
is changed.
</p>

<h4>The <code>labelledby</code> and <code>describedby</code> Configuration Properties.</h4>
<p>
The Container ARIA Plugin adds a <code>labelledby</code> and <code>describedby</code>
configuration properties to the Menu class, each of which maps back to their respective ARIA 
property of <a href="http://www.w3.org/TR/wai-aria/#labelledby"><code>aria-labelledby</code></a> 
and <a href="http://www.w3.org/TR/wai-aria/#describedby"><code>aria-describedby</code></a>.
</p>


<h3>Enhancements to Panel</h3>
<p>
The Container ARIA Plugin adds a <code>role</code> configuration property to Panel that is set to
<code>dialog</code> by default. Authors using Panel (or any of its subclasses) to replace
JavaScript alerts, should set the <code>role</code> configuration property to 
<code>alertdialog</code>.  As an additonal convenience, the Container ARIA Plugin automatically 
sets the value of the <code>labelledby</code> configuration property to a Panel's header element.  
</p>

<p>
The Container ARIA Plugin adds some keyboard enhancements to Panel:  
Pressing the Esc key will automatically hide a Panel instance, or in the case of Dialog, call 
the <code>cancel</code> method.  Each Panel is also automatically registered with an OverlayManager
instance, and listens for the DOM focus and blur events so that Panels are automatically focused 
and blurred accordingly by the OverlayManager.  Lastly, when a Panel instance is hidden, focus
is automatically returned to the element in the DOM that was focused before the Panel was made
visible.
</p>


<h3>Enhancements to Tooltip</h3>
<p>
The Container ARIA Plugin enhances Tooltip such that each DOM element defined as a Tooltip 
instance's trigger has its 
<a href="http://www.w3.org/TR/wai-aria/#describedby"><code>aria-describedby</code></a> 
attribute automatically set to the Tooltip's id.  Additionally, when a Tooltip is automatically 
shown and hidden as it's trigger(s) are focused and blurred.
</p>


<h3>Enhanced Keyboard Support</h3>
<p>
In keeping with the 
<a href="http://www.w3.org/WAI/PF/aria-practices/#keyboard">WAI-ARIA Best Practices for keyboard 
navigation</a> the ARIA plugin for Menu enhances Menu's default behavior such that 
only one MenuItem is in the browser's tab index, enabling the user to easily tab into and out of the 
Menu.  When a MenuItem in a Menu has focus, pressing the arrow keys moves focus between each 
MenuItem in the Menu.
</p>


<h2>Screen Reader Testing</h2>
<p>
Two of the leading screen readers for Windows, 
<a href="http://www.freedomscientific.com/fs_products/software_jaws.asp">JAWS</a> and 
<a href="http://www.gwmicro.com/Window-Eyes/">Window-Eyes</a>, support ARIA.  Free, trial 
versions of both are available for download, but require Windows be restarted every 40 minutes.
The open-source 
<a href="http://www.nvda-project.org/">NVDA Screen Reader</a> is the best option for developers as 
it is both free and provides excellent support for ARIA.
</p>