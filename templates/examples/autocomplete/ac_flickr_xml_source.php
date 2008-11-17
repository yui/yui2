<h3>Find photos by tag and collect your selections:</h3>
<div id="flickrselections">
    <h5>Selections</h5>
    <div id="photos"></div>
</div>

<div id="flickrautocomplete">
	<input id="flickrinput" type="text">
	<div id="flickrcontainer"></div>
</div>

	
<script type="text/javascript">
YAHOO.example.ACFlickr = function() {
    // Set up a local proxy to the Flickr webservice
    var myDS = new YAHOO.util.XHRDataSource("<?php echo $assetsDirectory; ?>php/flickr_proxy.php");
    myDS.responseSchema = {
        resultNode: "photo",
        fields: ["title", "id", "owner", "secret", "server"]
    };
    myDS.responseType = YAHOO.util.XHRDataSource.TYPE_XML;
    myDS.maxCacheEntries = 100;
    
    // Instantiate AutoComplete
    var myAC = new YAHOO.widget.AutoComplete("flickrinput","flickrcontainer", myDS);
    myAC.resultTypeList = false;
    myAC.suppressInputUpdate = true;
    myAC.generateRequest = function(sQuery) {
        return "?method=flickr.photos.search&tags="+sQuery;
    };
    var getImgUrl = function(oPhoto, sSize) {
        var sId = oPhoto.id;
        var sSecret = oPhoto.secret;
        var sServer = oPhoto.server;
        var sUrl = "http://static.flickr.com/" +
            sServer +
            "/" +
            sId +
            "_" +
            sSecret +
            "_"+ (sSize || "s") +".jpg";
        return "<img src='" + sUrl + "' class='flickrImg'>";
    }
    
    myAC.formatResult = function(oResultItem, sQuery) {
        // This was defined by the schema array of the data source
        var sTitle = oResultItem.title;
        var sMarkup = getImgUrl(oResultItem) + " " + sTitle;
        return (sMarkup);
    };
    myAC.itemSelectEvent.subscribe(function(sType, aArgs){
        var oPhoto = aArgs[2];
        YAHOO.util.Dom.get("photos").innerHTML = 
            "<p>"+getImgUrl(oPhoto, "m")+"</p>"+YAHOO.util.Dom.get("photos").innerHTML
    });
    
    return {
        oDS: myDS,
        oAC: myAC
    };
}();
</script>
