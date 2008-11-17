<h3>Note:</h3>
<p>Keep an eye on the Logger console at right to see the profiling information being reported.</p>


<script type="text/javascript">

    YAHOO.namespace("example.profiler");

    //object with method to profile
    YAHOO.example.profiler.MathHelper = {    
        factorial : function (num){
            if (num > 1) {
                return num * YAHOO.example.profiler.MathHelper.factorial(num-1);
            } else {
                return 1;
            }
        }    
    };
    
    //register the function
    YAHOO.tool.Profiler.registerFunction("YAHOO.example.profiler.MathHelper.factorial");
    
     
    YAHOO.util.Event.onDOMReady(function (){
        
        YAHOO.example.profiler.MathHelper.factorial(10);
        
        var calls = YAHOO.tool.Profiler.getCallCount("YAHOO.example.profiler.MathHelper.factorial");
        var max = YAHOO.tool.Profiler.getMax("YAHOO.example.profiler.MathHelper.factorial");
        var min = YAHOO.tool.Profiler.getMin("YAHOO.example.profiler.MathHelper.factorial");
        var avg = YAHOO.tool.Profiler.getAverage("YAHOO.example.profiler.MathHelper.factorial");
        
        YAHOO.tool.Profiler.unregisterFunction("YAHOO.example.profiler.MathHelper.factorial");
        
        YAHOO.log("Method YAHOO.example.profiler.MathHelper was run " + calls + "times.");
        YAHOO.log("The average time was " + avg + "ms.");
        YAHOO.log("The max time was " + max + " ms.");
        YAHOO.log("The min time was " + min + " ms.");
        
    });

</script>