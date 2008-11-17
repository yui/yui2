<h2>Getting Started</h2>
<p>
Using the Button ARIA Plugin is easy.  Simply include the source file(s) for the ARIA plugin after 
the Button source files as indicated on the Button landing page.
</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<!-- Source file -->
<script type="text/javascript" src="../button/assets/buttonariaplugin.js"></script>

<!-- OPTIONAL: Menu and Container ARIA Plugin files (required for creating Buttons of type "menu" and "split") -->
<script type="text/javascript" src="../container/assets/containerariaplugin.js"></script>
<script type="text/javascript" src="../menu/assets/menuariaplugin.js"></script>
</textarea>

<p>
All YUI ARIA Plugins require the user's browser and AT support the WAI-ARIA Roles and States.  
Currently only <a href="http://www.mozilla.com/en-US/firefox/">Firefox 3</a> and 
<a href="http://www.microsoft.com/windows/products/winfamily/ie/ie8/getitnow.mspx">Internet Explorer
8</a> have support for ARIA, and are supported by several screen readers for 
Windows that also offer support for ARIA.  For this reason the YUI ARIA Plugins are only enabled 
by default for these browsers.  To enable the ARIA plugin for other browsers, simply the set 
the <code>usearia</code> attribute to <code>true</code>.  For example:
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var oButton = new YAHOO.widget.Button({ 
	type: "checkbox",
	usearia: true,
	label: "A Checkbox", 
	name: "checkbox-1", 
	value: "1", 
	container: document.body });
</textarea>

<p>The same is true of the <code>ButtonGroup</code> widget:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var oButtonGroup = new YAHOO.widget.ButtonGroup({  
						name:  "radiogroup-1", 
						container:  document.body, 
						usearia: true });

oButtonGroup.addButtons([
	{ label: "Radio 1", value: "1" checked: true },
	{ label: "Radio 2", value: "2" }, 
	{ label: "Radio 3", value: "3" }, 
	{ label: "Radio 4", value: "4" }
]);
</textarea>

<h2>Plugin Features</h2>
<h3>More Accessible Radio Buttons and Checkboxes</h3>
<p>
All Buttons (with the exception of those of type <code>link</code>) created using the Button 
widget are represented in HTML using the <code>&#60;button&#62;</code> element.  While this element 
suits most applications, it doesn't convey the correct role information for Buttons of type
<code>checkbox</code> and <code>radio</code>.  For this reason the Button ARIA Plugin 
sets the ARIA <code>role</code> attribute of each Button to either <code>checkbox</code> and 
<code>radio</code>, and the ARIA <code>role</code> attribute for the root element of a 
ButtonGroup to 
<a href="http://www.w3.org/TR/wai-aria/#radiogroup"><code>radiogroup</code></a>.
Lastly, for Buttons of type
<code>checkbox</code> and <code>radio</code>, the Button ARIA Plugin automatically toggles the 
<a href="http://www.w3.org/TR/wai-aria/#checked"><code>aria-checked</code></a> attribute as the 
Button's <code>checked</code> attribute changes.
</p>

<h3>The <code>labelledby</code> and <code>describedby</code> Attributes.</h3>
<p>
The Button ARIA Plugin adds a <code>labelledby</code> and <code>describedby</code>
attribute to the ButtonGroup class, each of which maps back to their respective ARIA property of 
<a href="http://www.w3.org/TR/wai-aria/#labelledby"><code>aria-labelledby</code></a> and 
<a href="http://www.w3.org/TR/wai-aria/#describedby"><code>aria-describedby</code></a>.
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var oButtonGroup = new YAHOO.widget.ButtonGroup("buttongroup", { labelledby: "buttongroup-label" });
</textarea>

<h3>More Accessible Split Buttons and Menu Buttons</h3>
<p>
As indicated above, Buttons of type <code>menu</code> and <code>split</code> require the  
Container and Menu ARIA Plugins.  No additional configuration of a Button's Menu is required.  
Setting the <code>usearia</code> attribute to <code>true</code> for a Button will automatically set
the corresponding property on its Menu.  Additionally, the 
<a href="http://www.w3.org/TR/wai-aria/#haspopup"><code>aria-haspop</code></a> attribute
will automatically be set to <code>true</code> for each Button's <code>&#60;button&#62;</code> 
element so that users of AT know that the Button has a corresponding Menu.  The Menu's 
<code>labelledby</code> configuration property will automatically be set to the id of the 
Button, to further associate the Menu with its corresponding Button for users of AT.
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