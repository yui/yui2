<h2 class="first">Customizing Calendar's Skin</h2>

<p>YUI controls that support "skinning" generally have two levels of CSS: one that is <em>core to the control and its functioning</em> and another that is <em>purely presentational</em>.</p>

<p>Both the Skin and Core CSS for Calendar/CalendarGroup is show below. To modify the presentation of your Calendar instance, add rules that override those you see here or use this CSS block as a starting point for creating your own custom skin.</p>

<p>As a rule, you should avoid changes that affect the core CSS for a skinned control; rather, you should modify the presentation of a control by building upon (or replacing) its skin-level CSS. For more information about the skinning of YUI controls, please review <a href="http://developer.yahoo.com/yui/articles/skinning/">our skinning reference article</a> which goes into much more detail about how skins are created and how they operate.</p>

<h3>Skin CSS</h3>
<textarea name="code" class="CSS" cols="60" rows="1">
/**
 * SAM
 *
 * Skin colors used:
 *
 * - Control Border : 808080
 * - Control Chrome : f2f2f2
 * - Cell Borders : cccccc
 * - Normal Cell BG : ffffff
 * - Date Links : 0066cc
 * - Selected Cells BG : b3d4ff
 * - Cell Hover BG : 426fd9
 * - Disabled BG : cccccc
 * - Disabled Text Color : a6a6a6
 **/

/* CALENDAR BOUNDING BOX */
.yui-skin-sam .yui-calcontainer {
	background-color:#f2f2f2;
	border:1px solid #808080;
	padding:10px;
}

/* CALENDARGROUP BOUNDING BOX */
.yui-skin-sam .yui-calcontainer.multi {
	padding:0 5px 0 5px;
}

/* BOUNDING BOX FOR EACH CALENDAR GROUP PAGE */
.yui-skin-sam .yui-calcontainer.multi .groupcal {
	background-color:transparent;
	border:none;
	padding:10px 5px 10px 5px;
	margin:0;
}

/* TITLE BAR */
.yui-skin-sam .yui-calcontainer .title {
	background:url(../../../../assets/skins/sam/sprite.png) repeat-x 0 0;
	border-bottom:1px solid #cccccc;
	font:100% sans-serif;
	color:#000;
	font-weight:bold;
	height:auto;
	padding:.4em;
	margin:0 -10px 10px -10px;
	top:0;
	left:0;
	text-align:left;
}

.yui-skin-sam .yui-calcontainer.multi .title {
	margin:0 -5px 0 -5px;
}

.yui-skin-sam .yui-calcontainer.withtitle {
	padding-top:0;
}

/* CLOSE BUTTON */
.yui-skin-sam .yui-calcontainer .calclose {
	background:url(../../../../assets/skins/sam/sprite.png) no-repeat 0 -300px;
	width:25px;
	height:15px;
	top:.4em;
	right:.4em;
	cursor:pointer;
}

/* CALENDAR TABLE */
.yui-skin-sam .yui-calendar {
	border-spacing:0;
	border-collapse:collapse;
	font:100% sans-serif;
	text-align:center;
	margin:0;
}

/* NAVBAR BOUNDING BOX */
.yui-skin-sam .yui-calendar .calhead {
	background:transparent;
	border:none;
	vertical-align:middle;
	padding:0;
}

/* NAVBAR TEXT CONTAINER */
.yui-skin-sam .yui-calendar .calheader {
	background:transparent;
	font-weight:bold;
	padding:0 0 .6em 0;
	text-align:center;
}

.yui-skin-sam .yui-calendar .calheader img {
	border:none;
}

/* NAVBAR LEFT ARROW */
.yui-skin-sam .yui-calendar .calnavleft {
	background:url(../../../../assets/skins/sam/sprite.png) no-repeat 0 -450px;
	width:25px;
	height:15px;
	top:0;
	bottom:0;
	left:-10px;
	margin-left:.4em;
	cursor:pointer;
}

/* NAVBAR RIGHT ARROW */
.yui-skin-sam .yui-calendar .calnavright {
	background:url(../../../../assets/skins/sam/sprite.png) no-repeat 0 -500px;
	width:25px;
	height:15px;
	top:0;
	bottom:0;
	right:-10px;
	margin-right:.4em;
	cursor:pointer;
}

/* WEEKDAY HEADER ROW */
.yui-skin-sam .yui-calendar .calweekdayrow {
	height:2em;
}

.yui-skin-sam .yui-calendar .calweekdayrow th {
	padding:0;
	border:none;
}

/* WEEKDAY (Su, Mo, Tu...) HEADER CELLS */
.yui-skin-sam .yui-calendar .calweekdaycell {
	color:#000;
	font-weight:bold;
	text-align:center;
	width:2em;
}

/* CALENDAR FOOTER. NOT IMPLEMENTED BY DEFAULT */
.yui-skin-sam .yui-calendar .calfoot {
	background-color:#f2f2f2;
}

/* WEEK NUMBERS (ROW HEADERS/FOOTERS) */
.yui-skin-sam .yui-calendar .calrowhead, .yui-skin-sam .yui-calendar .calrowfoot {
	color:#a6a6a6;
	font-size:85%;
	font-style:normal;
	font-weight:normal;
	border:none;
}

.yui-skin-sam .yui-calendar .calrowhead {
	text-align:right;
	padding:0 2px 0 0;
}

.yui-skin-sam .yui-calendar .calrowfoot {
	text-align:left;
	padding:0 0 0 2px;
}

/* NORMAL CELLS */
.yui-skin-sam .yui-calendar td.calcell {
	border:1px solid #cccccc;
	background:#fff;
	padding:1px;
	height:1.6em;
	line-height:1.6em; /* set line height equal to cell height to center vertically */
	text-align:center;
	white-space:nowrap;
}

/* LINK INSIDE NORMAL CELLS */
.yui-skin-sam .yui-calendar td.calcell a {
	color:#0066cc;
	display:block;
	height:100%;
	text-decoration:none;
}

/* TODAY'S DATE */
.yui-skin-sam .yui-calendar td.calcell.today {
	background-color:#000;
}

.yui-skin-sam .yui-calendar td.calcell.today a {
	background-color:#fff;
}

/* OOM DATES */
.yui-skin-sam .yui-calendar td.calcell.oom {
	background-color:#cccccc;
	color:#a6a6a6;
	cursor:default;
}

/* SELECTED DATE */
.yui-skin-sam .yui-calendar td.calcell.selected {
	background-color:#fff;
	color:#000;
}

.yui-skin-sam .yui-calendar td.calcell.selected a {
	background-color:#b3d4ff;
	color:#000;
}

/* HOVER DATE */
.yui-skin-sam .yui-calendar td.calcell.calcellhover {
	background-color:#426fd9;
	color:#fff;
	cursor:pointer;
}

.yui-skin-sam .yui-calendar td.calcell.calcellhover a {
	background-color:#426fd9;
	color:#fff;
}

/* DEFAULT OOB DATES */
.yui-skin-sam .yui-calendar td.calcell.previous {
	color:#e0e0e0;
}

/* CUSTOM RENDERERS */
.yui-skin-sam .yui-calendar td.calcell.restricted { text-decoration:line-through; }
.yui-skin-sam .yui-calendar td.calcell.highlight1 { background-color:#ccff99; }
.yui-skin-sam .yui-calendar td.calcell.highlight2 { background-color:#99ccff; }
.yui-skin-sam .yui-calendar td.calcell.highlight3 { background-color:#ffcccc; }
.yui-skin-sam .yui-calendar td.calcell.highlight4 { background-color:#ccff99; }

/* CalendarNavigator */

/* MONTH/YEAR LABEL */
.yui-skin-sam .yui-calendar a.calnav { 
	border: 1px solid #f2f2f2;
	padding:0 4px;
	text-decoration:none;
	color:#000;
	zoom:1;
}

.yui-skin-sam .yui-calendar a.calnav:hover { 
	background: url(../../../../assets/skins/sam/sprite.png) repeat-x 0 0;
	border-color:#A0A0A0;
	cursor:pointer;
}

/* NAVIGATOR MASK */
.yui-skin-sam .yui-calcontainer .yui-cal-nav-mask {
	background-color:#000;
	opacity:0.25;
	*filter:alpha(opacity=25); /* IE */
}

/* NAVIGATOR BOUNDING BOX */
.yui-skin-sam .yui-calcontainer .yui-cal-nav {
	font-family:arial,helvetica,clean,sans-serif;
	font-size:93%;
	border:1px solid #808080;
	left:50%;
	margin-left:-7em;
	width:14em;
	padding:0;
	top:2.5em;
	background-color:#f2f2f2;
}

.yui-skin-sam .yui-calcontainer.withtitle .yui-cal-nav {
	top:4.5em;
}

/* NAVIGATOR BOUNDING BOX */
.yui-skin-sam .yui-calcontainer.multi .yui-cal-nav {
	width:16em;
	margin-left:-8em;
}

/* NAVIGATOR YEAR/MONTH/BUTTON/ERROR BOUNDING BLOCKS */
.yui-skin-sam .yui-calcontainer .yui-cal-nav-y,
.yui-skin-sam .yui-calcontainer .yui-cal-nav-m,
.yui-skin-sam .yui-calcontainer .yui-cal-nav-b {
	padding:5px 10px 5px 10px;
}

.yui-skin-sam .yui-calcontainer .yui-cal-nav-b {
	text-align:center;
}

.yui-skin-sam .yui-calcontainer .yui-cal-nav-e {
	margin-top:5px;
	padding:5px;
	background-color:#EDF5FF;
	border-top:1px solid black;
	display:none;
}

/* NAVIGATOR LABELS */
.yui-skin-sam .yui-calcontainer .yui-cal-nav label {
	display:block;
	font-weight:bold;
}

/* NAVIGATOR MONTH CONTROL */
.yui-skin-sam .yui-calcontainer .yui-cal-nav-mc {
	width:100%;
	_width:auto; /* IE6, IE7 Quirks don't handle 100% well */
}

/* NAVIGATOR MONTH CONTROL, VALIDATION ERROR */
.yui-skin-sam .yui-calcontainer .yui-cal-nav-y input.yui-invalid {
	background-color:#FFEE69;
	border: 1px solid #000;
}

/* NAVIGATOR YEAR CONTROL */
.yui-skin-sam .yui-calcontainer .yui-cal-nav-yc {
	width:4em;
}

/* NAVIGATOR BUTTONS */

/* BUTTON WRAPPER */
.yui-skin-sam .yui-calcontainer .yui-cal-nav .yui-cal-nav-btn {
	border:1px solid #808080;
	background: url(../../../../assets/skins/sam/sprite.png) repeat-x 0 0;
	background-color:#ccc;
	margin: auto .15em;
}

/* BUTTON (based on button-skin.css) */
.yui-skin-sam .yui-calcontainer .yui-cal-nav .yui-cal-nav-btn button {
	padding:0 8px;
	font-size:93%;
	line-height: 2;  /* ~24px */
	*line-height: 1.7; /* For IE */
	min-height: 2em; /* For Gecko */
	*min-height: auto; /* For IE */
	color: #000;
}

/* DEFAULT BUTTONS */
/* NOTE: IE6 will only pickup the yui-default specifier from the multiple class specifier */
.yui-skin-sam .yui-calcontainer .yui-cal-nav .yui-cal-nav-btn.yui-default {
	border:1px solid #304369;
	background-color: #426fd9;
	background: url(../../../../assets/skins/sam/sprite.png) repeat-x 0 -1400px;
}

.yui-skin-sam .yui-calcontainer .yui-cal-nav .yui-cal-nav-btn.yui-default button {
	color:#fff;
}
</textarea>

<h3>Core CSS</h3>
<textarea name="code" class="CSS" cols="60" rows="1">
/**
 * CORE
 *
 * This is the set of CSS rules required by Calendar to drive core functionality and structure.
 * Changes to these rules may result in the Calendar not functioning or rendering correctly.
 *
 * They should not be modified for skinning.
 **/
 
/* CALENDAR BOUNDING BOX */
.yui-calcontainer {
	position:relative;
	float:left;
	_overflow:hidden; /* IE6 only, to clip iframe shim */
}

/* IFRAME SHIM */
.yui-calcontainer iframe {
	position:absolute;
	border:none;
	margin:0;padding:0;
	z-index:0;
	width:100%;
	height:100%;
	left:0px;
	top:0px;
}

/* IFRAME SHIM IE6 only */
.yui-calcontainer iframe.fixedsize {
	width:50em;
	height:50em;
	top:-1px;
	left:-1px;
}

/* BOUNDING BOX FOR EACH CALENDAR GROUP PAGE */
.yui-calcontainer.multi .groupcal {
	z-index:1;
	float:left;
	position:relative;
}

/* TITLE BAR */
.yui-calcontainer .title {
	position:relative;
	z-index:1;
}

/* CLOSE ICON CONTAINER */
.yui-calcontainer .close-icon {
	position:absolute;
	z-index:1;
}

/* CALENDAR TABLE */
.yui-calendar {
	position:relative;
}

/* NAVBAR LEFT ARROW CONTAINER */
.yui-calendar .calnavleft {
	position:absolute;
	z-index:1;
}

/* NAVBAR RIGHT ARROW CONTAINER */
.yui-calendar .calnavright {
	position:absolute;
	z-index:1;
}

/* NAVBAR TEXT CONTAINER */
.yui-calendar .calheader {
	position:relative;
	width:100%;
	text-align:center;
}

/* CalendarNavigator */
.yui-calcontainer .yui-cal-nav-mask {
	position:absolute;
	z-index:2;
	margin:0;
	padding:0;
	width:100%;
	height:100%;
	_width:0;    /* IE6, IE7 quirks - width/height set programmatically to match container */
	_height:0;
	left:0;
	top:0;
	display:none;
}

/* NAVIGATOR BOUNDING BOX */
.yui-calcontainer .yui-cal-nav {
	position:absolute;
	z-index:3;
	top:0;
	display:none;
}

/* NAVIGATOR BUTTONS (based on button-core.css) */
.yui-calcontainer .yui-cal-nav .yui-cal-nav-btn  {
	display: -moz-inline-box; /* Gecko */
	display: inline-block; /* IE, Opera and Safari */
}

.yui-calcontainer .yui-cal-nav .yui-cal-nav-btn button {
	display: block;
	*display: inline-block; /* IE */
	*overflow: visible; /* Remove superfluous padding for IE */
	border: none;
	background-color: transparent;
	cursor: pointer;
}

/* Specific changes for calendar running under fonts/reset */
.yui-calendar .calbody a:hover {background:inherit;}
p#clear {clear:left; padding-top:10px;}
</textarea>

