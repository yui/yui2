<h2>Getting Started</h2>
<p>
Using the Carousel ARIA Plugin is easy.  Simply include the source file(s) for the ARIA plugin after 
the Carousel source files as indicated on the Carousel landing page.
</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<!-- Source file -->
<script type="text/javascript" src="../carousel/assets/carouselariaplugin.js"></script>
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
var oTabView = new YAHOO.widget.Carousel({ usearia: true });
</textarea>

<h2>Plugin Features</h2>
<p>
Currently there is no ARIA role of <code>carousel</code>, however there are several ARIA roles
applicable to the HTML elements that compose a Carousel widget can be used that further enhance its 
accessibility.  A Carousel widget is composed of two primary elements: a content element
(<code>&#60;div class="yui-carousel-nav"&#62;</code>) that contains a list of items, and a 
navigation element (<code>&#60;div class="yui-carousel-content"&#62;</code>) that contains several 
buttons that control the items currently in view.  The Carousel ARIA Plugin applies the ARIA 
<code>role</code> of <a href="http://www.w3.org/TR/wai-aria/#toolbar"><code>toolbar</code></a> to 
the navigation element, and a <code>role</code> of 
<a href="http://www.w3.org/TR/wai-aria/#button"><code>button</code></a> to the 
<code>&#60;a&#62;</code> elements that serve as paging controls.  
A role of <a href="http://www.w3.org/TR/wai-aria/#listbox"><code>listbox</code></a> is applied to 
the <code>&#60;ol&#62;</code> inside the content element and a role of 
<a href="http://www.w3.org/TR/wai-aria/#option"><code>option</code></a> to each of its 
child <code>&#60;li&#62;</code> elements.
</p>


<h3>The <code>labelledby</code> and <code>describedby</code> attributes.</h3>
<p>
The Carousel ARIA Plugin adds a <code>labelledby</code> and <code>describedby</code>
attribute to the Carousel class, each of which maps back to their respective ARIA property of 
<a href="http://www.w3.org/TR/wai-aria/#labelledby"><code>aria-labelledby</code></a> and 
<a href="http://www.w3.org/TR/wai-aria/#describedby"><code>aria-describedby</code></a>.  When set,
each of these properties are applied to the same elements to which the roles of 
<a href="http://www.w3.org/TR/wai-aria/#toolbar"><code>toolbar</code></a> and 
<a href="http://www.w3.org/TR/wai-aria/#listbox"><code>listbox</code></a> are applied (
the <code>&#60;div class="yui-carousel-nav"&#62;</code> and 
<code>&#60;div class="yui-carousel-content"&#62;</code> elements respectively) to help the user
associate the two elements with each other.
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var oTabView = new YAHOO.widget.Carousel({ usearia: true, labelledby: "tabview-label" });
</textarea>


<h3>Enhanced Keyboard Support</h3>
<p>
In keeping with the 
<a href="http://www.w3.org/WAI/PF/aria-practices/#keyboard">WAI-ARIA Best Practices for keyboard 
navigation</a>, the Carousel ARIA Plugin modifies Carousel's default keyboard support such that 
the Carousel has two primary tab stops: one for the navigation element, and one for the 
content element.  After the user tabs into the Carousel's navigation or content element, pressing 
the arrow keys moves focus between each of the buttons or items.
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