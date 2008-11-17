<h2 class="first">Object Profiling Example</h2>
<p>To illustrate using the Profiler on objects, the <code>YAHOO.util.Dom</code> object is registered for profiling. This means
that all of the methods on the object are being profiled. The two methods being called explicity are <code>getElementsByClassName()</code>
and <code>addClass()</code>, although the Profiler will show that these methods use other methods on <code>YAHOO.util.Dom</code>. To
illustrate their use, a number of demo elements are added to the markup:</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<div class="bar">div class="bar"</div>
<div class="bar-baz">div class="bar-baz"</div>
<div class="bar ">div class="bar "</div>
<div class=" bar ">div class=" bar "</div>
<div class="bar baz">div class=" bar baz"</div>
<div class="bar2 baz">div class=" bar2 baz"</div>
<div class="foo">div class="foo"</div>
<div class="foo" id="bar">div class="foo" id="bar"</div>
<div class="foo bar baz">div class="foo bar baz"</div>
<p class="bar">p class="bar"</p>
<button id="demo-run">run</button>
</textarea>
<p>The button is used to run the example. The function being called when the button is clicked is assigned using the
  <a href="http://developer.yahoo.com/yui/event/">YUI Event Utility</a>'s <code>on()</code> method:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
YAHOO.util.Event.on('demo-run', 'click', function(){
    YAHOO.tool.Profiler.registerObject("YAHOO.util.Dom");
    
    var results = YAHOO.util.Dom.getElementsByClassName('bar');
    YAHOO.util.Dom.addClass(results, "newclass");
    
    var report = YAHOO.tool.Profiler.getFullReport(function(data){
        return data.calls > 0;
    });
    
    YAHOO.tool.Profiler.unregisterObject("YAHOO.util.Dom");    
    
    //output results
    for (var func in report){
        YAHOO.log(func + "(): Called " + report[func].calls + " times. Avg: " + 
            report[func].avg + ", Min: " + report[func].min + ", Max: " + report[func].max);
    }
});
</script>
</textarea>  
<p>The function begins be registering <code>YAHOO.util.Dom</code> with the Profiler. Note that since this object exists in the
  global scope, only one argument is necessary for <code>registerObject()</code>. Then, the <code>getElementsByClassName()</code>
  and <code>addClass()</code> methods are called. After that, the full report is returned and the object is unregistered. The last
  step is to output all of the information that was collected. Even though there's only two methods called explicitly in this example,
  the profiled data indicates that several other methods on <code>YAHOO.util.Dom</code> were called internally to accomplish the
  tasks.</p>

