<h2 class="first">Simple Profiling Example</h2>

<p>This example begins by creating a namespace:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.namespace("example.profiler");  
</textarea>
<p>This namespace serves as the core object upon which others will be added (to prevent creating global objects).</p>
<p>Next, an object is created with a method:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
//object with method to profile
YAHOO.example.profiler.MathHelper = {    
    factorial : function (num){
        if (num > 1) {
            return num * MathHelper.factorial(num-1);
        } else {
            return 1;
        }
    }    
};
</textarea>
<p>This object, <code>MathHelper</code> contains a single method called <code>factorial()</code> that computes the
factorial of a given number. Any time <code>factorial()</code> is called, the argument indicates how many times
the function will be recursively called. For example, <code>factorial(10)</code> results in the funtion being
called 10 times. This makes it an ideal test case for profiling because the results are so predictable.</p>
<h3>Registering the function</h3>
<p>The most important step to profile this function is to call <code>registerFunction()</code> with the fully-qualified
function name, which is <code>YAHOO.example.profiler.MathHelper</code>:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.tool.Profiler.registerFunction("YAHOO.example.profiler.MathHelper.factorial");
</textarea>
<p>Since this function is fully accessible in the global scope, there's no need to provide the owner object
as the second argument.</p>

<h3>Running the example</h3>

<p>With everything setup, the last step is to run the code. This initialization is assigned to take place when the document tree has been 
completely loaded by using the Event utility's <code>onDOMReady()</code> method:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
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
</textarea>
<p>The code block begins by calling <code>factorial()</code> once, which gets profiled. Then, the information
about the function can be retrieved from the Profiler. This information is output into the Logger on the page,
displaying the number of times that the function was called along with the minimum, maximum, and average
running times. Since this is a very simple function, the run times will most likely be 0ms on most machines.</p>