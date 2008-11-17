<div id="container">

    <!--Use a real form that works without JavaScript:-->
    <form method="GET" action="http://siteexplorer.search.yahoo.com/advsearch" id="siteExplorer">

        <label for="searchString">Site URL:</label> <input type="text" name="p" id="searchString" value="http://developer.yahoo.com/yui" size="40">
        
        <input type="hidden" name="bwm" value="i">
        <input type="hidden" name="bwms" value="p">
    
        <input type="submit" id="getSiteExplorerData" value="Click here to get JSON data.">
    
    </form>

    <div id="results">
        <!--JSON output will be written to the DOM here-->
        
    </div>
</div>

<script type="text/javascript">
//create a namespace for this example:
YAHOO.namespace("example.SiteExplorer");

//This example uses the "Module Pattern"; a full explanation of 
//this pattern can be found on yuiblog:
// http://yuiblog.com/blog/2007/06/12/module-pattern
YAHOO.example.SiteExplorer = function() {

    //set up some shortcuts in case our typing fingers
    //get lazy:
    var Event = YAHOO.util.Event,
        Dom = YAHOO.util.Dom,
        Button = YAHOO.widget.Button,
        Get = YAHOO.util.Get,
        elResults = Dom.get("results"),
        tIds = {},
        loading = false,
        current = null;
        
    // We use the Get Utility's success handler in conjunction with
    // the web service callback in order to detect bad responses 
    // from the web service.
    var onSiteExplorerSuccess = function(o) {

        // stop blocking requests
        loading = false;

        // A success response means the script node is inserted.  However, the
        // utility is unable to detect whether or not the content of the script
        // node is correct, or even if there was a bad response (like a 404
        // error).  To get around this, we use the web service callback to
        // verify that the script contents was correct.
        if (o.tId in tIds) {
YAHOO.log("The Get Utility has fired the success handler indicating that the " +
          "requested script has loaded and is ready for use.", "info", "example");
        } else {
YAHOO.log("The Get utility has fired onSuccess but the webservice callback did not " +
          "fire.  We could retry the transaction here, or notify the user of the " +
          "failure.", "info", "example");
        }

    }

    var onSiteExplorerFailure = function(o) {
YAHOO.log("The Get Utility failed.", "info", "example");
    }
    
    //function to retrieve data from Yahoo! Site Explorer web service --
    // http://developer.yahoo.com/search/siteexplorer/V1/inlinkData.html
    var getSiteExplorerData = function() {
        YAHOO.log("Button clicked; getSiteExplorerData firing.", "info", "example");

        // block multiple requests
        if (loading) {
            return;
        }
        loading = true;
        
        //Load the transitional state of the results section:
        elResults.innerHTML = "<h3>Retrieving incoming links for " +
            Dom.get("searchString").value + ":</h3>" +
            "<img src='http://l.yimg.com/us.yimg.com/i/nt/ic/ut/bsc/busybar_1.gif' " +
            "alt='Please wait...'>";
        
        //prepare the URL for the Yahoo Site Explorer API:
        var sURL = "http://search.yahooapis.com/SiteExplorerService/V1/inlinkData?" +
            "appid=3wEDxLHV34HvAU2lMnI51S4Qra5m.baugqoSv4gcRllqqVZm3UrMDZWToMivf5BJ3Mom" +
            "&results=20&output=json&omit_inlinks=domain" +
            "&callback=YAHOO.example.SiteExplorer.callback" +
            "&query=" + encodeURIComponent(Dom.get("searchString").value);
        
        //This simple line is the call to the Get Utility; we pass
        //in the URL and the configuration object, which in this case
        //consists merely of our success and failure callbacks:
        var transactionObj = Get.script(sURL, {
            onSuccess: onSiteExplorerSuccess,
            onFailure: onSiteExplorerFailure,
            scope    : this
        });
        
        //The script method returns a single-field object containing the
        //tranaction id:
        YAHOO.log("Get Utility transaction started; transaction object: " + YAHOO.lang.dump(transactionObj), "info", "example");

        // keep track of the current transaction id.  The transaction will be
        // considered complete only if the web service callback is executed.
        current = transactionObj.tId; 
    }
    return {
        init: function() {
                
            //suppress default form behavior
            Event.on("siteExplorer", "submit", function(e) {
                Event.preventDefault(e);
                getSiteExplorerData();
            }, this, true);
        
            //instantiate Button:
            var oButton = new Button("getSiteExplorerData");
            YAHOO.log("Button instantiated.", "info", "example");
        },

        callback: function(results) {
            YAHOO.log("Web service returned data to YAHOO.example.SiteExplorer.callback; beginning to process.", "info", "example");

            // Mark the transaction as complete.  This will be checked by the onSuccess
            // handler to determine if the transaction really succeeded.
            tIds[current] = true;
            
            //work with the returned data to extract meaningful fields:
            var aResults = results.ResultSet.Result;
            var totalLinks = results.ResultSet.totalResultsAvailable;
            var returnedLinkCount = results.ResultSet.totalResultsReturned;
            
            if(aResults) {//there are inbound links; process and display them:
            
                //write header and open list of inbound links:          
                var html = "<h3>There are " +
                    totalLinks + 
                    " inbound links for this page; here are the first " + 
                    returnedLinkCount +
                    ":</h3><ol>";
                
                //process list of inbound links:
                for (var i=0; i < aResults.length; i++) {
                    html += "<li><strong>" +
                        aResults[i].Title +
                        ":</strong> <a href='" +
                        aResults[i].Url +
                        "'>" + aResults[i].Url +
                        "</a></li>";
                }
                
                //close list of inbound links
                html += "</ol>";
                
            } else {//no inbound links exist for this page:
            
                var html = "<h3>There are no inbound links for the page specified.</h3";
                
            }
            
            //insert string into DOM:
            elResults.innerHTML = html;
        }
    }
}();

//Initialize the example when the DOM is completely loaded:
YAHOO.util.Event.onDOMReady(
    YAHOO.example.SiteExplorer.init, 
    YAHOO.example.SiteExplorer,         //pass this object to init and...
    true);                              //...run init in the passed object's
                                        //scope


</script>
