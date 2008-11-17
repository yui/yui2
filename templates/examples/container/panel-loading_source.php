<div id="content"></div>

<script type="text/javascript">

    YAHOO.namespace("example.container");

    function init() {

        var content = document.getElementById("content");
        
        content.innerHTML = "";

        if (!YAHOO.example.container.wait) {

            // Initialize the temporary Panel to display while waiting for external content to load

            YAHOO.example.container.wait = 
                    new YAHOO.widget.Panel("wait",  
                                                    { width: "240px", 
                                                      fixedcenter: true, 
                                                      close: false, 
                                                      draggable: false, 
                                                      zindex:4,
                                                      modal: true,
                                                      visible: false
                                                    } 
                                                );
    
            YAHOO.example.container.wait.setHeader("Loading, please wait...");
            YAHOO.example.container.wait.setBody("<img src=\"http://us.i1.yimg.com/us.yimg.com/i/us/per/gr/gp/rel_interstitial_loading.gif\"/>");
            YAHOO.example.container.wait.render(document.body);

        }

        // Define the callback object for Connection Manager that will set the body of our content area when the content has loaded



        var callback = {
            success : function(o) {
                content.innerHTML = o.responseText;
                content.style.visibility = "visible";
                YAHOO.example.container.wait.hide();
            },
            failure : function(o) {
                content.innerHTML = o.responseText;
                content.style.visibility = "visible";
                content.innerHTML = "CONNECTION FAILED!";
                YAHOO.example.container.wait.hide();
            }
        }
    
        // Show the Panel
        YAHOO.example.container.wait.show();
        
        // Connect to our data source and load the data
        var conn = YAHOO.util.Connect.asyncRequest("GET", "<?php echo $assetsDirectory; ?>somedata.php?r=" + new Date().getTime(), callback);
    }
    
    YAHOO.util.Event.on("panelbutton", "click", init);
		
</script>
<button id="panelbutton">Show Panel</button>