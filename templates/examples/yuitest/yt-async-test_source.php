<div id="testLogger"></div>
<script type="text/javascript">

    YAHOO.namespace("example.yuitest");
    
    YAHOO.example.yuitest.AsyncTestCase = new YAHOO.tool.TestCase({
    
        //name of the test case - if not provided, one is auto-generated
        name : "Asynchronous Tests",
        
        //---------------------------------------------------------------------
        // setUp and tearDown methods - optional
        //---------------------------------------------------------------------
        
        /*
         * Sets up data that is needed by each test.
         */
        setUp : function () {
            this.data = {
                name: "yuitest",
                year: 2007,
                beta: true
            };
        },
        
        /*
         * Cleans up everything that was created by setUp().
         */
        tearDown : function () {
            delete this.data;
        },
                
        //---------------------------------------------------------------------
        // Test methods - names must begin with "test"
        //---------------------------------------------------------------------
        
        testWait : function (){
            var Assert = YAHOO.util.Assert;
            
            //do some assertions now
            Assert.isTrue(this.data.beta);
            Assert.isNumber(this.data.year);
            
            //wait five seconds and do some more
            this.wait(function(){
            
                Assert.isString(this.data.name);                
            
            }, 5000);
        
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