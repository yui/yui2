<div id="testLogger"></div>
<div id="testDiv" style="position:absolute;width:10px;height:10px"></div>
<script type="text/javascript">

    YAHOO.namespace("example.yuitest");
    
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
     
    YAHOO.util.Event.onDOMReady(function (){
        //create the logger
        var logger = new YAHOO.tool.TestLogger("testLogger");
        YAHOO.tool.TestRunner.add(YAHOO.example.yuitest.AsyncTestCase);

        //run the tests
        YAHOO.tool.TestRunner.run();
    });

</script>