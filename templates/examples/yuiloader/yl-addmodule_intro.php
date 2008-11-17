<p><a href="http://developer.yahoo.com/yui/yuiloader/">The YUILoader Utility</a> is designed, of course, to help you put YUI components on the page.  But your applications will frequently consist of a YUI-component foundation with your own application logic built on top.  In other words, when you're loading YUI components you'll often want to load your own components as well.</p>

<p>This example shows you how to create a custom (non-YUI) module and load it via YUILoader.  Click the "Load JSON" button below to load Douglas Crockford's JSON utility from <a href="http://json.org/">JSON.org</a> via YUILoader.  Keep an eye on the Logger Control console at right to follow the logic as it executes after you click the button.</p>

<p>Note: in 2.4.1 Defining custom modules that override existing YUI skins requires a specific syntax.  See
the <a href="#overrideskins">example code</a> below for details.</p>
