<h2 class="first">Adding a Chinese Translation for the ProfilerViewer UI:</h2>

<p>Customizing the <a href="http://developer.yahoo.com/yui/profilerviewer/">ProfilerViewer</a> UI for non-English languages is easy.  In the example below, we've applied a Chinese translation provided by Hongwei Zeng to the ProfilerViewer.</p>

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
	title: "YUI代码分析器(beta)",
	buttons: {
		viewprofiler: "查看分析结果",
		hideprofiler: "隐藏分析结果",
		showchart: "显示图表",
		hidechart: "隐藏图表",
		refreshdata: "刷新数据"
	},
	colHeads: {
    	//key: [column label, column width in px]
		fn: ["函数/方法", null],
		calls: ["调用", 40],
		avg: ["平均值", 70],
		min: ["最小值", 70],
		max: ["最大值", 70],
		total: ["总时间", 70],
		pct: ["百分比", 70]
	},
	millisecondsAbbrev: "ms",
	initMessage: "初始化图表 ...",
	installFlashMessage: "无法加载Flash。YUI图表控件需要9.0.45以上版本的Flash播放器。您可以从<a href='http://www.adobe.com/go/getflashplayer'>Adobe Flash播放器下载中心</a>下载最新版本的播放器。"
};</textarea>
