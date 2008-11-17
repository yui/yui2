<h2 class="first">Customizing TabView Skin</h2>

<p>Skinning the <a href="http://developer.yahoo.com/yui/tabview/">YUI TabView</a> widget is done using CSS.</p>

<p>The stylesheet used for other TabView examples is a minified version of the tabview-core.css and tabview-skin.css files.  In order to customize the TabView skin, we recommend using the raw source files as a reference.</p>

<p>The tabview-core.css file includes foundational styling that controls tab orientation and basic layout, including margin between tabs and padding inside of tabs.  Overriding these allows you to customize TabView for your own needs.  We recommend overriding these in a separate file to simplify integrating with YUI updates.</p>

<p>This snippet from tabview-core.css shows the selectors and style properties you will need to override in order to customize tab spacing and padding:</p>
<textarea name="code" class="CSS" cols="60" rows="1">
/* default space between tabs */
.yui-navset .yui-nav li,
.yui-navset .yui-navset-top .yui-nav li,
.yui-navset .yui-navset-bottom .yui-nav li {
    margin:0 0.5em 0 0; /* horizontal tabs */
}
.yui-navset-left .yui-nav li,
.yui-navset-right .yui-nav li {
    margin:0 0 0.5em; /* vertical tabs */
}

/* default width for side tabs */
.yui-navset .yui-navset-left .yui-nav,
.yui-navset .yui-navset-right .yui-nav,
.yui-navset-left .yui-nav,
.yui-navset-right .yui-nav { width:6em; }

.yui-navset-top .yui-nav,
.yui-navset-bottom .yui-nav {
    width:auto;
}
.yui-navset .yui-navset-left,
.yui-navset-left { padding:0 0 0 6em; } /* map to nav width */
.yui-navset-right { padding:0 6em 0 0; } /* ditto */

</textarea>

<p>The tabview-skin.css file builds upon the tabview-core.css file, adding borders, color information and other skin specific styling.  This snippet includes all of the styling applied to the default TabView orientation ("top"):</p>
<textarea name="code" class="CSS" cols="60" rows="1"><style type="text/css">

/* .yui-navset defaults to .yui-navset-top */
.yui-skin-sam .yui-navset .yui-nav,
.yui-skin-sam .yui-navset .yui-navset-top .yui-nav { /* protect nested tabviews from other orientations */
    border:solid #2647a0; /* color between tab list and content */
    border-width:0 0 5px;
    Xposition:relative;
    zoom:1;
}

.yui-skin-sam .yui-navset .yui-nav li,
.yui-skin-sam .yui-navset .yui-navset-top .yui-nav li {
    margin:0 0.16em 0 0; /* space between tabs */
    padding:1px 0 0; /* gecko: make room for overflow */
    zoom:1;
}

.yui-skin-sam .yui-navset .yui-nav .selected,
.yui-skin-sam .yui-navset .yui-navset-top .yui-nav .selected { 
    margin:0 0.16em -1px 0; /* for overlap */
}

.yui-skin-sam .yui-navset .yui-nav a,
.yui-skin-sam .yui-navset .yui-navset-top .yui-nav a {
    background:#d8d8d8 url(../../../../assets/skins/sam/sprite.png) repeat-x; /* tab background */
    border:solid #a3a3a3;
    border-width:0 1px;
    color:#000;
    text-decoration:none;
}

.yui-skin-sam .yui-navset .yui-nav a em,
.yui-skin-sam .yui-navset .yui-navset-top .yui-nav a em {
    border:solid #a3a3a3;
    border-width:1px 0 0;
    cursor:hand;
    padding:0.25em .75em;
    left:0; right: 0; bottom: 0; /* protect from other orientations */
    top:-1px; /* for 1px rounded corners */
    position:relative;
}

.yui-skin-sam .yui-navset .yui-nav .selected a,
.yui-skin-sam .yui-navset .yui-nav .selected a:focus, /* no focus effect for selected */
.yui-skin-sam .yui-navset .yui-nav .selected a:hover { /* no hover effect for selected */
    background:#2647a0 url(../../../../assets/skins/sam/sprite.png) repeat-x left -1400px; /* selected tab background */
    color:#fff;
}

.yui-skin-sam .yui-navset .yui-nav a:hover,
.yui-skin-sam .yui-navset .yui-nav a:focus {
    background:#bfdaff url(../../../../assets/skins/sam/sprite.png) repeat-x left -1300px; /* selected tab background */
    outline:0;
}

.yui-skin-sam .yui-navset .yui-nav .selected a em {
    padding:0.35em 0.75em; /* raise selected tab */
}

.yui-skin-sam .yui-navset .yui-nav .selected a,
.yui-skin-sam .yui-navset .yui-nav .selected a em {
    border-color:#243356; /* selected tab border color */
}

.yui-skin-sam .yui-navset .yui-content {
    background:#edf5ff; /* content background color */
}

.yui-skin-sam .yui-navset .yui-content,
.yui-skin-sam .yui-navset .yui-navset-top .yui-content {
    border:1px solid #808080; /* content border */
    border-top-color:#243356; /* different border color */
    padding:0.25em 0.5em; /* content padding */
}

</style>
</textarea>

