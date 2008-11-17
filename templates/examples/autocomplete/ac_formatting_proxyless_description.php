<h2 class="first">Sample Code</h2>

<p>Data:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
{"ResultSet":
    {"totalResultsAvailable":"48",
    "totalResultsReturned":10,
    "firstResultPosition":1,
    "Result": [
        {"Title":"madonna_americanlife_9-rub08wm30p_450-v.asx",
        "Summary":"Summary: Madonna- American life Noticias madonna - Noticias madonna - Noticias madonna -",
        "Url":"http:\/\/www.warnerreprise.com\/asx\/madonna_americanlife_9-rub08wm30p_450-v.asx",
        "ClickUrl":"http:\/\/www.warnerreprise.com\/asx\/madonna_americanlife_9-rub08wm30p_450-v.asx",
        "RefererUrl":"http:\/\/www.descargaarchivos.com\/noticias\/index.php?query=madonna&type=video",
        "FileSize":"30",
        "FileFormat":"msmedia",
        "Height":"264",
        "Width":"352",
        "Duration":"240",
        "Streaming":"false",
        "Channels":"2",
        "Thumbnail": 
            {"Url":"http:\/\/scd.mm-so.yimg.com\/image\/1702827152",
            "Height":"108",
            "Width":"145"
        }
    }
        ...
    ]}
}
</textarea>

<p>CSS:</p>

<textarea name="code" class="CSS" cols="60" rows="1">
#myAutoComplete {
    width:30em; /* set width here or else widget will expand to fit its container */
    padding-bottom:2em;
}
/* styles for custom formatting */
.yui-ac .result {position:relative;height:62px;}
.yui-ac .name {position:absolute;bottom:0;left:64px;}
.yui-ac .img {position:absolute;top:0;left:0;width:58px;height:58px;border:1px solid black;background-color:black;color:white;}
.yui-ac .imgtext {position:absolute;width:58px;top:50%;text-align:center;}
.yui-ac img {width:60px;height:60px;margin-right:4px;}
</textarea>

<p>Markup:</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<form action="http://video.search.yahoo.com/search/video" onsubmit="return YAHOO.example.CustomFormatting.validateForm();">
	<h3>Yahoo! Video Search:</h3>
	<div id="myAutoComplete">
		<input id="myInput" type="text" name="p">
		<div id="myContainer"></div>
	</div>
</form>
</textarea>

<p>JavaScript:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
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
})();</textarea>
