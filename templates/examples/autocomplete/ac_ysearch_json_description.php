<h2 class="first">Sample Code</h2>

<p>CSS:</p>

<textarea name="code" class="CSS" cols="60" rows="1">
/* custom styles for centered example */
body, h1 { margin:0;padding:0; } /* needed for known issue with Dom.getXY() in safari for absolute elements in positioned containers */
#ysearch { text-align:center; }
#ysearchinput { position:static;width:20em; } /* to center, set static and explicit width: */
#ysearchcontainer { text-align:left;width:20em; } /* to center, set left-align and explicit width: */
</textarea>

<p>Markup:</p>

<textarea name="code" class="HTML" cols="60" rows="1">&lt;form action="http://search.yahoo.com/search"&gt;
    &lt;div id="ysearch"&gt;
		&lt;label&gt;Yahoo! Search: &lt;/label&gt;
		&lt;input id="ysearchinput" type="text" name="p"&gt;
		&lt;input id="ysearchsubmit" type="submit" value="Submit Query"&gt;
		&lt;div id="ysearchcontainer"&gt;&lt;/div&gt;
    &lt;/div&gt;
&lt;/form&gt;
</textarea>

<p>JavaScript:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.example.Centered = function() {
    var myDataSource = new YAHOO.util.XHRDataSource("<?php echo $assetsDirectory; ?>php/ysearch_proxy.php?output=json&");
    myDataSource.responseSchema = {
        resultsList: "ResultSet.Result",
        fields: ["Title"]
    };

    // Instantiate AutoComplete
    var myAutoComp = new YAHOO.widget.AutoComplete("ysearchinput","ysearchcontainer", myDataSource);
    myAutoComp.queryMatchContains = true;
    myAutoComp.queryQuestionMark = false;
    myAutoComp.useShadow = true;
    
    // Keeps container centered
    myAutoComp.doBeforeExpandContainer = function(oTextbox, oContainer, sQuery, aResults) {
        var pos = YAHOO.util.Dom.getXY(oTextbox);
        pos[1] += YAHOO.util.Dom.get(oTextbox).offsetHeight + 2;
        YAHOO.util.Dom.setXY(oContainer,pos);
        return true;
    };
    
    return {
        oDS: myDataSource,
        oAC: myAutoComp
    };
}();
</textarea>
