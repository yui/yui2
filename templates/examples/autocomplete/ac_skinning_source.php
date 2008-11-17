<h3>Find a state:</h3>
<div id="statesautocomplete">
	<input id="statesinput" type="text">
	<div id="statescontainer"></div>
</div>

<!-- In-memory JS array begins-->
<script type="text/javascript">
YAHOO.example.statesArray = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Dakota",
    "North Carolina",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming"
];
</script>
<!-- In-memory JS array ends-->


<script type="text/javascript">
YAHOO.example.Skinning = function() {
    // Instantiate DataSource with a JS Array
    var myDS = new YAHOO.util.LocalDataSource(YAHOO.example.statesArray);

    // Instantiate first AutoComplete
    var myAutoComp = new YAHOO.widget.AutoComplete('statesinput','statescontainer', myDS);
    myAutoComp.prehighlightClassName = "yui-ac-prehighlight";
    myAutoComp.useShadow = true;
    
    return {
        oDS: myDS,
        oAC: myAutoComp
    };
}();
</script>
