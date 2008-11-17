<style type="text/css">

    /*
        Set the "zoom" property to "normal" since it is set to "1" by the 
        ".example-container .bd" rule in yui.css and this causes a Menu
        instance's width to expand to 100% of the browser viewport.
    */
    
    div.yuimenu .bd {
    
        zoom: normal;
    
    }


    #calendarmenu {
    
        position: absolute;
    
    }


    /*
        Restore default padding of 10px for the calendar containtainer 
        that is overridden by the ".example-container .bd .bd" rule 
        in yui.css.
    */

    #calendarcontainer {

        padding:10px;

    }
    
	#personalinfo {
	
		border: solid 1px #666;
		padding: .5em;
	
	}
	
	#calendarpicker  {
	
		vertical-align: baseline;
		
	}

	div.field {
	
		padding: .25em;
	
	}
	
	input#year {
	
		width: 4em;
	
	}

</style>