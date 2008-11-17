<div id="container">

    <div id="buttonContainer">
        <!--YUI Button instances, created from script, will go here.-->
    </div>

    <div class="module">
        <div class="hd"><h2>In the News:</h2></div>
        <div class="bd" id="results">
            <!--News stories will be displayed here.-->
        </div>
        <div class="ft">        
            <div id="searchControls">
                <!--Use a real form that works without JavaScript:-->
                <form method="GET" action="http://search.yahooapis.com/NewsSearchService/V1/newsSearch" id="newsSearch">            
                    <label for="searchString">Search Yahoo! News:</label> <input type="text" name="p" id="searchString" value="San Francisco" size="40">                
                    <input type="submit" id="getNewsData" value="Search Yahoo! News">                
                </form>            
            </div>
        </div>
    </div>
</div>

<script language="javascript">

// Encapsulating our code in a self-executing anonymous function
// is one way to create a namespace:
(function() {

// shortcuts and other variables:
var Button = YAHOO.widget.Button,
    Event = YAHOO.util.Event,
    Dom = YAHOO.util.Dom,
    Get = YAHOO.util.Get,
    elContainer = Dom.get("container"),
    tIds = {};

// YUI Buttons are attractive and effective for "call to action"
// tasks like the one here.  We'll create buttons purely from
// JavaScript; there's no need for this style-change functionality
// to be "accessible"; in fact, it's purely cosmetic, so keeping
// these buttons out of the page's initial DOM is preferable.  We'll
// use the "name" property of the button to determine what CSS to
// load when each button is clicked:
var borderButton = new Button({
    id: "borderButton",
    type: "checkbox",
    name: "border",
    label: "Border CSS",
    container: "buttonContainer" 
});
var backgroundButton = new Button({
    id: "backgroundButton",
    type: "checkbox",
    name: "background",
    label: "Background CSS",
    container: "buttonContainer"
});
var textButton = new Button({
    id: "textButton",
    type: "checkbox",
    name: "text",
    label: "Text CSS",
    container: "buttonContainer"
});
// Making available outside the anonymous function so these can be
// introspected in FireBug if desired:
YAHOO.example.buttons = [borderButton, backgroundButton, textButton];

// Checkbox buttons are either checked or unchecked; when their state
// changes, their "onCheckedChange" event fires.  We'll use that
// event to trigger the loading and unloading of CSS using the Get
// Utility.
var onCheckedChange = function() {
    //Which button was actuated?
    var name = this.get("name");
    //The button's checked state has already been updated, so if
    //true we load the necessary CSS:
    if(this.get("checked")) {
        // We'll use the 'data' parameter to pass through the name
        // of the CSS file to our onSuccess handler.  This allows
        // us to have access to the purge method when we want
        // to remove the CSS.
        //
        // In addition, we use the 'insertBefore' property to specify
        // the id of a style block we want to insert the new nodes
        // before.  By doing this, we can ensure that any style overrides
        // for the dynamically loaded CSS will be applied in the correct
        // order.
        Get.css("../get/assets/" + name + ".css", {
                data:         name,
                insertBefore: "styleoverrides",
                onSuccess:    onSuccess
        });
    } else {
        // In onSuccess, we save a reference to the callback object
        // in an associative array (tIds) indexed by the CSS name.  That 
        // allows us here, when the CSS needs to be removed, to simply
        // call the purge method corresponding to the item we want to 
        // remove.  Purge clears all the link nodes that were created
        // as part of the transaction (in this case, just a single 
        // link node).
        tIds[this.get("name")].purge();
        YAHOO.log("CSS was successfully purged; our object containing transaction ids now looks like this: " + YAHOO.lang.dump(tIds, 1),  "info", "example");
        
        // Some A-Grade browsers won't repaint automatically when CSS link nodes
        // are removed.  You can nudge these browsers to repaint by adding
        // a blank CSS stylesheet to the page:
        Get.css("../get/assets/neutral.css");
    }
};

// Now we can subscribe our onCheckedChange function to each
// of our three YUI Buttons' "checkedChange" event:
borderButton.on("checkedChange", onCheckedChange);
backgroundButton.on("checkedChange", onCheckedChange);
textButton.on("checkedChange", onCheckedChange);

// As noted above, in onSuccess we want to save the callback
// object in an associative array indexed by CSS file name so that
// we can purge the link nodes later if the CSS file needs to be
// removed.
var onSuccess = function(o) {
    tIds[o.data] = o;
    YAHOO.log("CSS was successfully returned; our object containing transaction ids now looks like this: " + YAHOO.lang.dump(tIds, 1), "info", "example");
}

})();
</script>

<script src="../get/assets/getNews.js" type="text/javascript"></script>
