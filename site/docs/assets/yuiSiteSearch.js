//v1 
/*This script provides site-search suggest functionality
  in YUI's top nav. In this version, it uses Yahoo Search
  to get the top page suggestions from YDN and YUIBlog.
  When a search is instigated without using a suggestion,
  the search goes to a standard YSRP with results from the
  two target sites. This functionality is set to load 550
  ms after the page load event; it's possible on a slow
  connection to use the search box before this enhanced
  functionality loads.  Only YUI Loader is required; all
  other dependencies can be bootstrapped. */
YAHOO.namespace("yui.SiteSearch");

YAHOO.yui.SiteSearch.setup = function(){
	/* First, we'll create our DataSource, using the Script
	   Node DataSource constructor.  We pass in the base URL
	   and the schema that we'll use to map the returned 
	   data. */
	var oDataSource = new YAHOO.widget.DS_ScriptNode("http://search.yahooapis.com/WebSearchService/V1/webSearch?appid=3wEDxLHV34HvAU2lMnI51S4Qra5m.baugqoSv4gcRllqqVZm3UrMDZWToMivf5BJ3Mom&region=us&results=15&output=json&site=developer.yahoo.com&site=yuiblog.com", ["ResultSet.Result","Title","Url","ClickUrl"]);

	/* With all of the pieces in hand, we can now instantiate
	   and configure our AutoComplete instance: */
	var oAutoComp = new YAHOO.widget.AutoComplete(
		"searchinput", // the input field's ID
		"searchcontainer", // the suggestion container's ID
		oDataSource, // the DataSource
		{  // here, we begin our configuration options:
			autoHighlight: false, //We don't want the first
								  //result highlighted by default.
			maxResultsDisplayed: 15,
			queryDelay:.3,
			useIFrame: true,
			animVert: true,		  //Yes, animate the suggestion
								  //container...
			animSpeed: 0.2,		  //The animation should last
								  //0.3 seconds.
			minQueryLength: 4,	  //Don't search for results until
								  //the user has entered at least
								  //4 characters in the input field.
			useShadow: true,	  //Build in a drop-shadow.
			prehighlightClassName: "yui-ac-prehighlight"
								  //Use a different highlight style
								  //for mouse-over than for arrow-to.
		});

	/* Formatting your result is the key to having a customized
	   look-and-feel for your AutoComplete implementation.  Here,
	   we do a very simple markup for the result title and the
	   URL for the result. */
	oAutoComp.formatResult = function(oResultItem, sQuery) {
		sTitle = oResultItem[0].replace("<", "&lt;");
		sTitle = sTitle.replace(">", "&gt;");
		sUrl = oResultItem[1].replace("<", "&lt;");
		sUrl = sUrl.replace(">", "&gt;");
		return "<em>" + sTitle + "</em><br />" + sUrl;
	};
	
	/* We want to have, at the bottom of the search container, a 
	   link making it obvious to the user how s/he can find all
	   results for the current query.  We'll use AutoComplete's
	   built-in footer mechanism for that, adding a link to which
	   we'll wire a form-submit event: */
	oAutoComp.setFooter("<a id='sitesearchshowall' href='#'>View all search results.</a>");
	
	/* Here's the wiring for the form submission on our footer link.
	   Note that we use the YUI Event Utility to add this listener --
	   this is part of YUI Core. */
	YAHOO.util.Event.on("sitesearchshowall", "click", function(e) {
		/* The Dom Collection's get method is similar to
		   document.getElementById in this instance: */
		YAHOO.util.Dom.get("sitesearchform").submit();
	});

	/* What do we want to do when an item in the suggestion container
	   is selected (either by arrowing and hitting enter or by clicking)?
	   We'll subscribe to the itemSelectEvent and when it fires use its
	   arguments to set a new location for the current page. */
	oAutoComp.itemSelectEvent.subscribe(function(type, args) {
		/* this line works around Opera's preventDefault
		   bug: */
		YAHOO.util.Dom.get("searchsubmit").disabled = true;
		
		/* now, we go off to the destination page chosen by
		   the user from the AutoComplete suggestion list: */
		location.href = (args[2][2]);	
	});

	/* We'll use one of AutoComplete's built-in events to position the
	   suggestion container directly below the input field.  AutoComplete
	   handles this for you in non-centered implementations; for notes
	   on the centered implementation shown here, see Jenny Han Donnelly's 
	   tutorial: http://developer.yahoo.com/yui/examples/autocomplete/ac_ysearch_json.html */
	oAutoComp.doBeforeExpandContainer = function(oTextbox, oContainer, sQuery, aResults) {
		var pos = YAHOO.util.Dom.getXY("searchsubmit");
		pos[1] += YAHOO.util.Dom.get(oTextbox).offsetHeight + 2;
		pos[0] += (YAHOO.util.Dom.get("searchsubmit").offsetWidth - YAHOO.util.Dom.get(oContainer).offsetWidth);
		YAHOO.util.Dom.setXY(oContainer,pos);

		/* Workaround for an IE6 rendering bug: */
		document.getElementById("searchcontainer").style.overflow = "visible";

		return true;
	};

	/* Here we'll hack AutoComplete a little bit.  AutoComplete is
	   designed to put the selected item's primary value in the
	   input field.  In this case, that would be the result's Title
	   field.  We don't really want that -- we're using AutoComplete
	   not to do type-ahead but to map to instant results.  So, we'll
	   suppress the standard behavior by overriding a private method
	   on this specific AutoComplete instance: */
	oAutoComp._updateValue = function() {
		return true;
	}
}

YAHOO.yui.SiteSearch.init = function() {
	// Instantiate and configure Loader:
	var loader = new YAHOO.util.YUILoader({
		//base: '/yui/build/',
		combine: true,
		// Identify the components you want to load.  Loader will automatically identify
		// any additional dependencies required for the specified components.
		require: ["yahoo", "dom", "event", "animation", "get", "autocomplete"],
		// Configure loader to pull in optional dependencies.  For example, animation
		// is an optional dependency for slider.
		loadOptional: false,
		// The function to call when all script/css resources have been loaded
		onSuccess: YAHOO.yui.SiteSearch.setup});
	
	//insert the dependencies for the Site Search and initialize;
	//only insert JS, as AC's CSS is included in the site CSS, and
	//reinserting it can break some AC examples:
	loader.insert({}, "js");
}

YAHOO.util.Event.on(window, "load", function() {
	setTimeout(YAHOO.yui.SiteSearch.init, 450);
});
		  