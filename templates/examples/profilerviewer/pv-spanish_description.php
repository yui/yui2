<h2 class="first">Adding a Spanish Translation for the ProfilerViewer UI:</h2>

<p>Customizing the <a href="http://developer.yahoo.com/yui/profilerviewer/">ProfilerViewer</a> UI for non-English languages is easy.  In the example below, we've applied a translation provided by Caridy Pati&ntilde;o Mayea to the ProfilerViewer.</p>

<p>This example has the following dependencies:</p>

<textarea name="code" class="HTML" cols="60" rows="1"><link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>//build/calendar/assets/skins/sam/calendar.css"> 
<link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/profilerviewer/assets/skins/sam/profilerviewer.css"> 

<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/utilities/utilities.js"></script>
<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/element/element-beta-min.js"></script>
<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/calendar/calendar.js"></script>
<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/yuiloader/yuiloader-min.js"></script>
<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/profiler/profiler-min.js"></script>
<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/profilerviewer/profilerviewer-beta-min.js"></script></textarea>

<p>All of the interface's language strings live in the static member <code>YAHOO.widget.ProfilerViewer.STRINGS</code>.  Customizing the interface simply involves modifying or replacing that object prior to instantiating your ProfilerViewer instance.</p>

<textarea name="code" class="JavaScript" cols="60" rows="1"><div id="container">YAHOO.widget.ProfilerViewer.STRINGS = {
    title: "YUI Profiler (beta)",
    buttons: {
        viewprofiler: "Mostrar datos del Profiler",
        hideprofiler: "Ocultar reporte del Profiler",
        showchart: "Mostrar Gráfica",
        hidechart: "Ocultar Gráfica",
        refreshdata: "Refrescar Datos"
    },
    colHeads: {
    	//key: [column label, column width in px]
        fn: ["Función/Método", null],
        calls: ["Llamadas", 70],
        avg: ["Promedio", 70],
        min: ["Menor", 70],
        max: ["Mayor", 70],
        total: ["Tiempo Total", 90],
        pct: ["Porcentaje", 80]
    },
    millisecondsAbbrev: "ms",
    initMessage: "Inicializando gráfica...",
    installFlashMessage: "No se pudo cargar el contenido Flash. El control YUI Charts requiere Flash Player 9.0.45 o superior. Usted puede descargar la última versión del Flash Player del <a href='http://www.adobe.com/go/getflashplayer?Lang=Spanish'>Centro de descargas de Adobe Flash Player</a>."
};</textarea>
