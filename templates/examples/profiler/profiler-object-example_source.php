<h3>Note:</h3>
<p>Keep an eye on the Logger console at right to see the profiling information being reported.</p>


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

<script type="text/javascript">
(function() {

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

    YAHOO.log("The example has finished loading; as you interact with it, you'll see log messages appearing here.", "info", "example");
})();
</script>