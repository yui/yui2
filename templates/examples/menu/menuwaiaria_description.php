<h2>Getting Started</h2>
<p>
Using the Menu ARIA Plugin is easy.  Simply include the source file(s) for the ARIA plugin after 
the Menu source files as indicated on the Menu landing page.  (Note: Since the Container Core 
file is a dependency of Menu, the Container ARIA Plugin is also a dependency of the Menu 
ARIA Plugin.)
</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<!-- Dependency --> 
<script type="text/javascript" src="../container/assets/containerariaplugin.js"></script>
<!-- Source File --> 
<script type="text/javascript" src="../menu/assets/menuariaplugin.js"></script>
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
var oMenu = new YAHOO.widget.Menu("menu-1", { usearia: true });
</textarea>

<h2>Plugin Features</h2>
<h3>The <code>labelledby</code> and <code>describedby</code> configuration properties.</h3>
<p>
The Menu ARIA Plugin adds a <code>labelledby</code> and <code>describedby</code>
configuration properties to the Menu class, each of which maps back to their respective ARIA 
property of <a href="http://www.w3.org/TR/wai-aria/#labelledby"><code>aria-labelledby</code></a> and 
<a href="http://www.w3.org/TR/wai-aria/#describedby"><code>aria-describedby</code></a>.  For example:
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var oMenuBar = new YAHOO.widget.MenuBar("menubar-1", { labelledby: "menubar-label" });
</textarea>


<h3>Enhanced Keyboard Support</h3>
<p>
In keeping with the 
<a href="http://www.w3.org/WAI/PF/aria-practices/#keyboard">WAI-ARIA Best Practices for keyboard 
navigation</a> the ARIA plugin for Menu enhances Menu's default behavior such that 
only one MenuItem is in the browser's tab index, enabling the user to easily tab into and out of the 
Menu.  When a MenuItem in a Menu has focus, pressing the arrow keys moves focus between each 
MenuItem in the Menu.
</p>


<h3>ContextMenu Support</h3>
<p>
The Menu ARIA Plugin enhances the ContextMenu widget such that any element defined as a ContextMenu
instance's trigger will have the <a href="http://www.w3.org/TR/wai-aria/#labelledby">
<code>aria-haspopup</code></a> property automatically applied to let 
users of AT know that the element has a context menu associated with it.
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