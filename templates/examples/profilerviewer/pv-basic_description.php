<h2 class="first">A Simple Use Case: Profiling Calendar</h2>

<p>One of the nice things about the <a href="http://developer.yahoo.com/yui/profiler/">YUI Profiler</a> is that it makes it simple to profile any JavaScript function or object structure.  <a href="http://developer.yahoo.com/yui/profilerviewer/">ProfilerViewer</a>'s job is to make it just as easy to explore that data.</p>

<p>In this example, we create an instance of YUI's <a href="http://developer.yahoo.com/yui/calendar/">Calendar Control</a>, tell Profiler to profile our Calendar instance, and then use ProfilerViewer to experience that data.</p>

<p>This example has the following dependencies:</p>

<textarea name="code" class="HTML" cols="60" rows="1"><link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>//build/calendar/assets/skins/sam/calendar.css"> 
<link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/profilerviewer/assets/skins/sam/profilerviewer.css">

<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/utilities/utilities.js"></script>
<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/element/element-beta-min.js"></script>
<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/calendar/calendar.js"></script>
<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/yuiloader/yuiloader-min.js"></script>
<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/profiler/profiler-min.js"></script>
<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/profilerviewer/profilerviewer-beta-min.js"></script></textarea>

<p>We begin with empty <code>div</code> elements for Calendar and Profiler to use:</p>

<textarea name="code" class="HTML" cols="60" rows="1"><div id="profiler">
<!--ProfilerViewer will be inserted here.-->
</div>

<div id="cal1container">
<!--Calendar instance will be inserted here.-->
</div></textarea>

<p>In JavaScript, we instantiate our Calendar and then pass the instance to Profiler for profiling:</p>

<textarea name="code" class="JScript" cols="60" rows="1">//instantiate Calendar:
YAHOO.example.calendar.cal1 = new YAHOO.widget.Calendar("cal1","cal1container");

//profile the instance, labeling it "cal1":
YAHOO.tool.Profiler.registerObject("cal1", YAHOO.example.calendar.cal1 );

//render the Calendar; after this line, the Calendar is on the page,
//ready to be used; all the while, Profiler will be tracking the time
//spent in each function:
YAHOO.example.calendar.cal1.render();</textarea>

<p>Finally, we set up ProfilerViewer to consume the profiling information and make it visible in the interface:</p>

<textarea name="code" class="JScript" cols="60" rows="1">//instantiate ProfilerViewer:
var pv = new YAHOO.widget.ProfilerViewer("profiler", {
    showChart: true, //we want to see the pretty charts!
    base:"../../build/", //path to YUI assets; if you leave this
    					 //blank, files will be drawn from 
                         //yui.yahooapis.com.
    //path to Charts Control swf file; if left blank, we'll
    //use the one from yui.yahooapis.com; this path is relative
    //to your current HTML page:
    swfUrl: "../../build/charts/assets/charts.swf",
    
    //In this case we only want to see functions that have
    //been called at least once and that have the "cal1"
    //label associated with them in Profiler:
    filter: function(o) {
        //Only show functions that have been called at least
        //once and that are part of the cal1 object:
        return ((o.calls > 0) && (o.fn.indexOf("cal1") > -1));
    }
});</textarea>

<p>The full JavaScript block for this example is as follows:</p>

<textarea name="code" class="JScript" cols="60" rows="1">YAHOO.namespace("example.calendar");

YAHOO.example.calendar.init = function() {
    //instantiate Calendar:
    YAHOO.example.calendar.cal1 = new YAHOO.widget.Calendar("cal1","cal1container");
    
    //profile the instance, labeling it "cal1":
    YAHOO.tool.Profiler.registerObject("cal1", YAHOO.example.calendar.cal1 );
    
    //render the Calendar; after this line, the Calendar is on the page,
    //ready to be used; all the while, Profiler will be tracking the time
    //spent in each function:
    YAHOO.example.calendar.cal1.render();
    
    YAHOO.example.pv = new YAHOO.widget.ProfilerViewer("profiler", {
        showChart: true, //we want to see the pretty charts!
        base:"../../build/", //path to YUI assets; if you leave this
                             //blank, files will be drawn from 
                             //yui.yahooapis.com.
        //path to Charts Control swf file; if left blank, we'll
        //use the one from yui.yahooapis.com; this path is relative
        //to your current HTML page:
        swfUrl: "../../build/charts/assets/charts.swf",
        
        //In this case we only want to see functions that have
        //been called at least once and that have the "cal1"
        //label associated with them in Profiler:
        filter: function(o) {
            //Only show functions that have been called at least
            //once and that are part of the cal1 object:
            return ((o.calls > 0) && (o.fn.indexOf("cal1") > -1));
        }
    });

}

//Run the calendar.innit function only when the Dom is fully loaded:
YAHOO.util.Event.onDOMReady(YAHOO.example.calendar.init);</textarea>
