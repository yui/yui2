<h2 class="first">Adding a German Translation for the ProfilerViewer UI:</h2>

<p>Customizing the <a href="http://developer.yahoo.com/yui/profilerviewer/">ProfilerViewer</a> UI for non-English languages is easy.  In the example below, we've applied a German translation provided by Christian Heilmann to the ProfilerViewer.</p>

<p>This example has the following dependencies:</p>

<textarea name="code" class="HTML" cols="60" rows="1"><link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>//build/calendar/assets/skins/sam/calendar.css"> 
<link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/profilerviewer/assets/skins/sam/profilerviewer.css">

<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/utilities/utilities.js"></script>
<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/element/element-beta-min.js"></script>
<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/calendar/calendar.js"></script>
<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/yuiloader/yuiloader-min.js"></script>
<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/profiler/profiler-min.js"></script>
<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/profilerviewer/profilerviewer-beta-min.js"></script></textarea>

<p>All of the interface's language strings live in the static member <code>YAHOO.widget.ProfilerViewer.STRINGS</code>.  Customizing the interface simply involves modifying or replacing that object prior to creating your ProfilerViewer instance.</p>

<textarea name="code" class="JavaScript" cols="60" rows="1"><div id="container">YAHOO.widget.ProfilerViewer.STRINGS = {
	title: "YUI Profiler (beta)",
	buttons: {
		viewprofiler: "Profiler Daten anzeigen",
		hideprofiler: "Profiler Report verstecken",
		showchart: "Diagramm anzeigen",
		hidechart: "Diagramm verstecken",
		refreshdata: "Daten neu laden"
	},
	colHeads: {
    	//key: [column label, column width in px]
		fn: ["Funktion/Methode", null],
		calls: ["Aufrufe", 60],
		avg: ["Durchschnitt", 90],
		min: ["Schnellste", 80],
		max: ["Langsamste", 85],
		total: ["Zeit total", 80],
		pct: ["Prozent", 70]
	},
	millisecondsAbbrev: "ms",
	initMessage: "Diagramm wird vorbereitet...",
	installFlashMessage: "Konnte Flash Inhalt nicht laden. YUI Charts Control erfordert Flash Player 9.0.45 or neuer. Bitten laden Sie die neueste Version des Flash Players beim <a href='http://www.adobe.com/go/getflashplayer'>Adobe Flash Player Download Center</a> herunter."
};</textarea>
