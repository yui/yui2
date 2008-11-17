<h2 class="first">Asynchronous Events Test Example</h2>

<p>This example begins by creating a namespace:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.namespace("example.yuitest");  
</textarea>
<p>This namespace serves as the core object upon which others will be added (to prevent creating global objects).</p>

<h3>Creating the TestCase</h3>

<p>The first step is to create a new <a href="/yui/yuitest/#testcase"><code>TestCase</code></a> object called <code>AsyncTestCase</code>.
  To do so, using the <code>TestCase</code> constructor and pass in an object literal containing information about the tests to be run:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.example.yuitest.AsyncTestCase = new YAHOO.tool.TestCase({

    //name of the test case - if not provided, one is auto-generated
    name : "Animation Tests",        
            
    //---------------------------------------------------------------------
    // Test methods - names must begin with "test"
    //---------------------------------------------------------------------
    
    testAnimation : function (){
        var Assert = YAHOO.util.Assert;
        var YUD = YAHOO.util.Dom;
        
        //animate width to 400px
        var myAnim = new YAHOO.util.Anim('testDiv', { width: { to: 400 } }, 3, YAHOO.util.Easing.easeOut);
        
        //assign oncomplete handler
        myAnim.onComplete.subscribe(function(){
        
            //tell the TestRunner to resume
            this.resume(function(){
            
                Assert.areEqual(YUD.get("testDiv").offsetWidth, 400, "Width of the DIV should be 400.");
            
            });
        
        }, this, true);

        //start the animation
        myAnim.animate();
        
        //wait until something happens
        this.wait();
    
    }
                
});

</textarea>  
<p>The only test in the <code>TestCase</code> is called <code>testAnimation</code>. It begins by creating a new
<code>Anim</code> object that will animate the width of a <code>div</code> to 400 pixels over three seconds. An
event handler is assigned to the <code>Anim</code> object's <code>onComplete</code> event, within which the
<code>resume()</code> method is called. A function is passed into the <code>resume()</code> method to indicate
the code to run when the test resumes, which is a test to make sure the width is 400 pixels. After that, the 
<code>animate()</code> method is called to begin the animation and the <code>wait()</code> method is called to
tell the <code>TestRunner</code> to wait until it is told to resume testing again. When the animation completes,
the <code>onComplete</code> event is fired and the test resumes, assuring that the width is correct.</p>
<h3>Running the tests</h3>

<p>With all of the tests defined, the last step is to run them. This initialization is assigned to take place when the document tree has been 
  completely loaded by using the Event utility's <code>onDOMReady()</code> method:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.util.Event.onDOMReady(function (){

    //create the logger
    var logger = new YAHOO.tool.TestLogger();
    
    //add the test suite to the runner's queue
    YAHOO.tool.TestRunner.add(YAHOO.example.yuitest.AsyncTestCase);

    //run the tests
    YAHOO.tool.TestRunner.run();
});
</textarea> 

<p>Before running the tests, it's necessary to create a <code>TestLogger</code> object to display the results (otherwise the tests would run 
  but you wouldn't see the results). After that, the <code>TestRunner</code> is loaded with the <code>TestCase</code> object by calling 
  <code>add()</code> (any number of <code>TestCase</code> and <code>TestSuite</code> objects can be added to a <code>TestRunner</code>, 
  this example only adds one for simplicity). The very last step is to call <code>run()</code>, which begins executing the tests in its
  queue and displays the results in the <code>TestLogger</code>.</p>