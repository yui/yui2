<form action="http://video.search.yahoo.com/search/video" onsubmit="return YAHOO.example.CustomFormatting.validateForm();">
	<h3>Yahoo! Video Search:</h3>
	<div id="myAutoComplete">
		<input id="myInput" type="text" name="p">
		<div id="myContainer"></div>
	</div>
</form>

<script type="text/javascript">
YAHOO.example.CustomFormatting = (function(){
    // Instantiate DataSource
    var oDS = new YAHOO.util.ScriptNodeDataSource("http://search.yahooapis.com/VideoSearchService/V1/videoSearch");
    oDS.responseSchema = {
        resultsList: "ResultSet.Result",
        fields: ["Title","Thumbnail"]
    };
    // Setting to default value for demonstration purposes.
    // The webservice needs to support execution of a callback function.
    oDS.scriptCallbackParam = "callback";
    
    // Instantiate AutoComplete
    var oAC = new YAHOO.widget.AutoComplete("myInput","myContainer", oDS);
    // The webservice needs custom parameters
    oAC.generateRequest = function(sQuery) {
        return "?appid=YahooDemo&output=json&query=" + sQuery ;
    };
    // Result data passed as object for easy access from custom formatter.
    oAC.resultTypeList = false;
    // Customize formatter to show thumbnail images
    oAC.formatResult = function(oResultData, sQuery, sResultMatch) {
        var img = "", nonimg = "";
        var oThumbnail = oResultData.Thumbnail;
        if(oThumbnail && (oThumbnail !== "")) {
            img = "<img src=\""+ oThumbnail.Url + "\">";
        }
        else {
            img = "<span class=\"img\"><span class=\"imgtext\">N/A</span></span>";
        }
        return "<div class=\"result\">" + img + "&nbsp;<span class=\"name\">" + sResultMatch + "</span></div>";
    };

    // Stub for form validation
    var validateForm = function() {
        // Validation code goes here
        return true;
    };
    
    return {
        oDS: oDS,
        oAC: oAC,
        validateForm: validateForm
    }
})();
</script>
