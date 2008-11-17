<style type="text/css">

    /*
        Set the "zoom" property to "normal" since it is set to "1" by the 
        ".example-container .bd" rule in yui.css and this causes a Menu
        instance's width to expand to 100% of the browser viewport.
    */
    
    div.yuimenu .bd {
    
        zoom: normal;
    
    }

    /*
        Restore default padding of 10px for the calendar containtainer 
        that is overridden by the ".example-container .bd .bd" rule 
        in yui.css.
    */

    #calendarcontainer {

        padding:10px;

    }

    #calendarmenu {
    
        position: absolute;
    
    }

    #calendarpicker button {

        background: url(../button/assets/calendar_icon.gif) center center no-repeat;
        text-align: left;
        text-indent: -10em;
        overflow: hidden;
        *margin-left: 10em; /* For IE */
        *padding: 0 3em;    /* For IE */
        white-space: nowrap;

    }

    #month-field,
    #day-field {
    
        width: 2em;
    
    }
    
    #year-field {
    
        width: 3em;
    
    }

	#datefields {
	
		border: solid 1px #666;
		padding: .5em;
	
	}
	
	#calendarpicker  {
	
		vertical-align: baseline;
		
	}

</style>