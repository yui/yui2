<p><strong>Note:</strong> There is a unresolved performance issue with this example on pre-Intel Macs running the latest Opera browser.</p>

<h2 class="first">Getting Started</h2>

<p>This example contains a few YUI Utilities and Controls as well as the use of a few Yahoo! Services. Here is the complete list of items used:</p>
<p>YUI Utilities:
<ul>
    <li><a href="http://developer.yahoo.com/yui/yahoo">YAHOO</a></li>
    <li><a href="http://developer.yahoo.com/yui/dom">Dom</a></li>
    <li><a href="http://developer.yahoo.com/yui/event">Event</a></li>
    <li><a href="http://developer.yahoo.com/yui/animation">Animation</a></li>
    <li><a href="http://developer.yahoo.com/yui/selector">Selector</a></li>
    <li><a href="http://developer.yahoo.com/yui/get">Get</a></li>
    <li><a href="http://developer.yahoo.com/yui/yuiloader">YUI Loader</a></li>
</ul>
</p>
<p>YUI Controls:
<ul>
    <li><a href="http://developer.yahoo.com/yui/autocomplete">AutoComplete</a></li>
    <li><a href="http://developer.yahoo.com/yui/button">Button</a></li>
    <li><a href="http://developer.yahoo.com/yui/calendar">Calendar</a></li>
    <li><a href="http://developer.yahoo.com/yui/datatable">DataTable</a></li>
    <li><a href="http://developer.yahoo.com/yui/editor">Editor</a></li>
    <li><a href="http://developer.yahoo.com/yui/layout">Layout Manager</a></li>
    <li><a href="http://developer.yahoo.com/yui/logger">Logger</a></li>
    <li><a href="http://developer.yahoo.com/yui/menu">Menu</a></li>
    <li><a href="http://developer.yahoo.com/yui/container/simpledialog">SimpleDialog</a></li>
    <li><a href="http://developer.yahoo.com/yui/slider">Slider</a></li>
    <li><a href="http://developer.yahoo.com/yui/tabview">TabView</a></li>
    <li><a href="http://developer.yahoo.com/yui/container/tooltip">Tooltip</a></li>
</ul>
</p>
<p>Yahoo! Tools/Services:
    <ul>
        <li><a href="http://pipes.yahoo.com/pipes/person.info?display=pipes&eyuid=HlKenYc.qXFqx.HasMLFF4hABlre">Yahoo! Pipes</a></li>
        <li><a href="http://weather.yahoo.com/">Yahoo! Weather Feed</a></li>
        <li><a href="http://news.yahoo.com">Yahoo! News RSS Feeds</a></li>
        <li><a href="http://tech.groups.yahoo.com/group/ydn-javascript/">RSS Feed from YDN-Javascript Group</a></li>
        <li><a href="http://tech.groups.yahoo.com/group/ydn-patterns/">RSS Feed from YDN-Patterns Group</a></li>
        <li><a href="http://tech.groups.yahoo.com/group/ydn-delicious/">RSS Feed from YDN-Delicious Group</a></li>
        <li><a href="http://tech.groups.yahoo.com/group/ydn-mail/">RSS Feed from YDN-Mail Group</a></li>
        <li><a href="http://tech.groups.yahoo.com/group/yws-maps/">RSS Feed from YWS-Maps Group</a></li>
        <li><a href="http://tech.groups.yahoo.com/group/yws-flickr/">RSS Feed from YWS-Flickr Group</a></li>
        <li><a href="http://tech.groups.yahoo.com/group/yws-events/">RSS Feed from YWS-Events Group</a></li>
    </ul>
</p>

<h2>Design</h2>

<p>This example was designed to be used with the YUILoader and Get Utilities. Each important piece of the puzzle is created and stored in a separate Javasript file. Here are the links to the actual source files (listed in order of operation):
<ul>
    <li><a href="#main_js">main.js</a> - Main app logic</li>
    <li><a href="#tabview_js">tabview.js</a> - Creates the main tabview instance.
        <ul>
            <li><a href="#news_js">news.js</a> - Fetchs the news feeds</li>
            <li><a href="#inbox_js">inbox.js</a> - Contains the DataTable's logic</li>
        </ul>
    </li>
    <li><a href="#buttons_js">buttons.js</a> - Contains the button logic
        <ul>
            <li><a href="#editor_js">editor.js</a> - Contains the Editor's logic</li>
        </ul>
    </li>
    <li><a href="#calendar_js">calendar.js</a> - Contains the Calendar logic</li>
    <li><a href="#logger_js">logger.js</a> - Contains the Logger logic</li>
</ul>
</p>

<h2 id="main_js">main.js</h2>
<p>This file uses YUILoader to load: reset-fonts-grids, utilities, tabview, selector, resize and layout. Once they have loaded, it creates the main page layout. In it's render listener it loads <code>tabview.js</code> and <code>button.js</code></p>
<textarea name="code" class="JScript">
<?php include($assetsDirectory.'js/main.js'); ?>
</textarea>

<h2 id="tabview_js">tabview.js</h2>
<p>This file creates the main TabView used for the center unit. It also creates the welcome screen and uses <code>Get</code> to load the <code>news.js</code> file. If the Inbox tab is selected, it will use <code>Get</code> to load the <code>inbox.js</code>.</p>
<textarea name="code" class="JScript">
<?php include($assetsDirectory.'js/tabview.js'); ?>
</textarea>

<h2 id="news_js">news.js</h2>
<p>This file makes several calls to Yahoo! Pipes with the <code>Get</code> utility in order to fetch the 4 news feeds for the home screen.</p>
<textarea name="code" class="JScript">
<?php include($assetsDirectory.'js/news.js'); ?>
</textarea>

<h2 id="inbox_js">inbox.js</h2>
<p>This file uses <code>YUILoader</code> to fetch the DataTable and SimpleEditor (for the toolbar) modules to display the inbox. It also makes a call to a Yahoo! Pipe to gather the data to be populated by the DataTable.</p>
<textarea name="code" class="JScript">
<?php include($assetsDirectory.'js/inbox.js'); ?>
</textarea>

<h2 id="buttons_js">buttons.js</h2>
<p>This file handles the 3 main buttons on the screen: Check Mail, New Message and Search Web. It also handles the click for the New Message button which calls <code>Get</code> to load the <code>editor.js</code> file.</p>
<textarea name="code" class="JScript">
<?php include($assetsDirectory.'js/buttons.js'); ?>
</textarea>

<h2 id="editor_js">editor.js</h2>
<p>This file loads an Editor instance for use in the New Message tab.</p>
<textarea name="code" class="JScript">
<?php include($assetsDirectory.'js/editor.js'); ?>
</textarea>

<h2 id="calendar_js">calendar.js</h2>
<p>This file loads a Calendar instance and sets up the animation for showing and hiding via the calendar box in the lower left corner.</p>
<textarea name="code" class="JScript">
<?php include($assetsDirectory.'js/calendar.js'); ?>
</textarea>

<h2 id="logger_js">logger.js</h2>
<p>This file loads a Logger instance and places it in the right unit.</p>
<textarea name="code" class="JScript">
<?php include($assetsDirectory.'js/logger.js'); ?>
</textarea>

