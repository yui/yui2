<h2 class="first">Sample Code</h2>

<p>Data:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
...
food and drink   1924
food basic   1075
food carts   1042
...
</textarea>

<p>CSS:</p>

<textarea name="code" class="CSS" cols="60" rows="1">
#myAutoComplete {
    width:25em; /* set width here or else widget will expand to fit its container */
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
YAHOO.example.BasicRemote = function() {
    // Use an XHRDataSource
    var oDS = new YAHOO.util.XHRDataSource("<?php echo $assetsDirectory; ?>php/ysearch_flat.php");
    // Set the responseType
    oDS.responseType = YAHOO.util.XHRDataSource.TYPE_TEXT;
    // Define the schema of the delimited results
    oDS.responseSchema = {
        recordDelim: "\n",
        fieldDelim: "\t"
    };
    // Enable caching
    oDS.maxCacheEntries = 5;

    // Instantiate the AutoComplete
    var oAC = new YAHOO.widget.AutoComplete("myInput", "myContainer", oDS);
    
    return {
        oDS: oDS,
        oAC: oAC
    };
}();
</textarea>
