<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8">
<title>ProfileViewer: Profiling Calendar with a Chinese UI</title>
<link rel="stylesheet" type="text/css" href="../../build/reset/reset.css"> 
<link rel="stylesheet" type="text/css" href="../../build/base/base.css"> 
<link rel="stylesheet" type="text/css" href="../../build/fonts/fonts.css"> 
<link rel="stylesheet" type="text/css" href="../../build/calendar/assets/skins/sam/calendar.css"> 
<link rel="stylesheet" type="text/css" href="../../build/profilerviewer/assets/skins/sam/profilerviewer.css">  

<script type="text/javascript" src="../../build/utilities/utilities.js"></script>
<script type="text/javascript" src="../../build/element/element-beta-min.js"></script>
<script type="text/javascript" src="../../build/calendar/calendar.js"></script>
<script type="text/javascript" src="../../build/profiler/profiler-min.js"></script>
<script type="text/javascript" src="../../build/profilerviewer/profilerviewer-beta-min.js"></script>

<style type="text/css">
	body {
		margin:1em;
	}
</style>

</head>

<body class="yui-skin-sam">

<h1>Internationalizing the ProfilerViewer Interface: Chinese</h1>

<p>The <a href="http://developer.yahoo.com/yui/profilerviewer/">ProfilerViewer Control</a> can be easily internationalized by modifying the <code>STRINGS</code> member of <code>YAHOO.widget.ProfilerViewer</code>  In this example, a Chinese translation provided by Hongwei Zeng of Alibaba.com is applied to the UI.</p>

<div id="profiler">
<!--ProfilerViewer will be inserted here.-->
</div>

<div id="cal1container">
<!--Calendar instance will be inserted here.-->
</div>

<script type="text/javascript">

YAHOO.widget.ProfilerViewer.STRINGS = {
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
};


	
	YAHOO.namespace("example.calendar");

	YAHOO.example.calendar.init = function() {
		YAHOO.example.calendar.cal1 = new YAHOO.widget.Calendar("cal1","cal1container");
		YAHOO.tool.Profiler.registerObject("cal1", YAHOO.example.calendar.cal1 );
		YAHOO.example.calendar.cal1.render();

		var pv = new YAHOO.widget.ProfilerViewer("profiler", {
			visible: true, //expand the viewer mmediately after instantiation
			showChart: true,
			base:"../../build/",
			swfUrl: "../../build/charts/assets/charts.swf"
		});
		
		//Just to make the instance publicly accessible via the console:
		YAHOO.example.pv = pv;
		
	}

	YAHOO.util.Event.onDOMReady(YAHOO.example.calendar.init);
	
</script>
</body>
</html>
