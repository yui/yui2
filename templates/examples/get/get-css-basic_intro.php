<p><a href="http://developer.yahoo.com/yui/get">The YUI Get Utility</a> can be
used to fetch CSS stylesheets after the page has loaded.  This allows you to
reduce the size of your "main" stylesheet by segregating the style rules for
specific modules that may not be displayed when the page is first rendered.
Once the module is needed, you can bring in the CSS (and JavaScript)
dynamically using the Get Utility.</p>

<p>The example below demonstrates the dynamic addition and removal of three
stylesheets that change the appearance of the News module.  By clicking on the
buttons (which make use of the <a
href="http://developer.yahoo.com/yui/button/">YUI Button Control</a>), you can
add/remove border, background, and font treatments for the module.
(<strong>Note:</strong> The News module itself is built using the Get Utility
to fetch JSON data from the <a
href="http://developer.yahoo.com/search/news/V1/newsSearch.html">Yahoo! News
Search web service</a>; it follows the same code pattern described in the <a
href="get-script-basic.html">"Getting a Script Node with JSON Data"</a>
example.) </p>
