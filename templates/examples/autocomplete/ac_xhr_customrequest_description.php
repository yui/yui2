<h2 class="first">Sample Code</h2>

<p>Data:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
{"ResultSet":
    {"totalResultsAvailable":"22000000",
    "totalResultsReturned":5,
    "firstResultPosition":1,
    "Result": [
        {"Title":"foo",
        "Summary":"... When foo' is used in connection with bar' it has generally traced...",
        "Url":"http:\/\/www.catb.org\/~esr\/jargon\/html\/F\/foo.html",
        "ModificationDate":1072684800,
        "MimeType":"text\/html"
        },

        {"Title":"Foo Fighters",
        "Summary":"Official site with news, tour dates, discography, store, community, and more.",
        "Url":"http:\/\/www.foofighters.com\/",
        "ModificationDate":1138521600,
        "MimeType":"text\/html"
        }
        
        ...
    ]}
}</textarea>

<p>CSS:</p>

<textarea name="code" class="CSS" cols="60" rows="1">
#myAutoComplete {
    width:40em; /* set width here or else widget will expand to fit its container */
    padding-bottom:2em;
}
</textarea>

<p>Markup:</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<div id="myAutoComplete">
	<input id="myInput" type="text">
	<div id="myContainer"></div>
</div>
</textarea>

<p>JavaScript:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.example.RemoteCustomRequest = function() {
    // Use an XHRDataSource
    var oDS = new YAHOO.util.XHRDataSource("<?php echo $assetsDirectory; ?>php/ysearch_proxy.php");
    // Set the responseType
    oDS.responseType = YAHOO.util.XHRDataSource.TYPE_JSON;
    // Define the schema of the JSON results
    oDS.responseSchema = {
        resultsList : "ResultSet.Result",
        fields : ["Title"]
    };

    // Instantiate the AutoComplete
    var oAC = new YAHOO.widget.AutoComplete("myInput", "myContainer", oDS);
    // Throttle requests sent
    oAC.queryDelay = .5;
    // The webservice needs additional parameters
    oAC.generateRequest = function(sQuery) {
        return "?output=json&results=100&query=" + sQuery ;
    };
    
    return {
        oDS: oDS,
        oAC: oAC
    };
}();
</textarea>
