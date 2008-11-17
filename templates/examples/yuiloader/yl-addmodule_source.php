<!--Container for our call-to-action button-->
<div id="jsonInsertButtonContainer"></div>

<!--Container to which we'll append success message-->
<div id="jsonContainer"></div>

<script type="text/javascript">
//create our Button Instance which will trigger Loader to
//load the JSON utility from json.org.
YAHOO.example.buttoninit = function() {

	//Create the button instance:
	var oButton = new YAHOO.widget.Button({ 
		id: "jsonInsertButton",  
		type: "button",  
		label: "Click here to load JSON Utility",  
		container: "jsonInsertButtonContainer"  
	});
	YAHOO.log("Button created; click button to begin loading JSON.", "info", "example");

	//Create a handler that handles the button click;
	//it logs the click, hides the button, then fires 
	//the function (loaderinit) that brings in JSON:
	var onButtonClick = function() {
		YAHOO.log("Button clicked; hiding button now and loading JSON", "info", "example");
		YAHOO.util.Dom.setStyle("jsonInsertButtonContainer", "display", "none");
		YAHOO.example.loaderinit();
	}
	
	//attach the handler to the Button's click event:
	oButton.on("click", onButtonClick);
};

//Once the jsonInsertButtonContainer element is on the page, we can create
//our button instance; in this case, the onContentReady deferral is unnecessary,
//because we're writing the element to the page before this script,
//but in many cases the onContentReady wrapper gives you added
//flexibility and it comes at low expense:
YAHOO.util.Event.onAvailable("jsonInsertButtonContainer", 
								YAHOO.example.buttoninit);

//Once JSON is loaded, we want to simply display a message that indicates
//we were successful in bringing it into the page:
YAHOO.example.onJsonLoad = function( ){
	
	//Indicate on the page that the operation succeeded:
	YAHOO.util.Dom.get("jsonContainer").innerHTML = "The JSON utility was successfully loaded into the page.  Scroll through the Logger Console output at right to review the timeline of steps that were followed by the script; note that most recent log messages appear at the top.";
	
	//Log the completion of the process:
	YAHOO.log("JSON utility was successfully loaded into the page, and the page was updated to indicate success.  The process is complete.", "info", "example");

};

YAHOO.example.loaderinit = function() {
	YAHOO.log("YAHOO.example.loaderinit firing; we'll define our custom JSON module and load it now.", "info", "example");
	
	//Begin by creating a new Loader instance:
	var loader = new YAHOO.util.YUILoader();
	
	//Add the module to YUILoader
    loader.addModule({
        name: "json", //module name; must be unique
        type: "js", //can be "js" or "css"
        fullpath: "http://www.json.org/json2.js", //can use a path instead, extending base path
        varName: "JSON" // a variable that will be available when the script is loaded.  Needed
                        // in order to act on the script immediately in Safari 2.x and below.
		//requires: ['yahoo', 'event'] //if this module had dependencies, we could define here
    });

    loader.require("json"); //include the new  module

	//Insert JSON utility on the page, passing in our callback:
    loader.insert({
        onSuccess: YAHOO.example.onJsonLoad
    });
	
};
</script>

