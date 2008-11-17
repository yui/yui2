<style type="text/css">

    /*
        Margin and padding on body element
        can introduce errors in determining
        element position and are not recommended;
        we turn them off as a foundation for YUI
        CSS treatments.
    */
    
    body {
    
        margin: 0;
        padding: 0;
    
    }

    #example {
    
        padding: 1em;
    
    }

    #photo {
    
        border: solid 1px #000;
    
    }


    /*
        Set the "zoom" property to "normal" since it is set to "1" by the 
        ".example-container .bd" rule in yui.css and this causes a Menu
        instance's width to expand to 100% of the browser viewport.
    */
    
    div.yuimenu .bd {
    
        zoom: normal;
    
    }
    

    /* Style the <div> element containing the Button instance */
    
    #opacitycontrols {
    
        border-top: solid 1px #000;
        padding: .5em .25em;
        margin-top: .5em;
    
    }


    /* Style the Slider instance */

    #slider-bg {
    
        position: relative;
        background: url(../button/assets/bg-fader.gif) 7px 12px no-repeat;
        height: 28px;
        width: 217px; 

    }

    #slider-thumb {

        cursor: default;
        position: absolute;
        top: 4px;

    }

    
    /*
        Give the <em> element wrapping the Button instance's text label a 
        fixed width so that the Button doesn't grow or shrink as the 
        text label is updated.
    */

    #opacitybutton-currentopacity {

        width: 3em;
        font-style: normal;
        display: block;
        text-align: left;

    }

	#opacitybutton  {
	
		vertical-align: middle;
		
	}

</style>
