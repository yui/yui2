<style type="text/css">

    /*
        Set the "zoom" property to "normal" since it is set to "1" by the 
        ".example-container .bd" rule in yui.css and this causes a Menu
        instance's width to expand to 100% of the browser viewport.
    */
    
    div.yuimenu .bd {
    
        zoom: normal;
    
    }

    #button-container {
    
        padding: .5em;
    
    }

	#color-picker-button {

		vertical-align: baseline;
	
	}

    #color-picker-button button {
    
        outline: none;  /* Safari */
        line-height: 1.5;

    }


    /*
        Style the Button instance's label as a square whose background color 
        represents the current value of the ColorPicker instance.
    */

    #current-color {

        display: block;
        display: inline-block;
        *display: block;    /* For IE */
        margin-top: .5em;
        *margin: .25em 0;    /* For IE */
        width: 1em;
        height: 1em;
        overflow: hidden;
        text-indent: 1em;
        background-color: #fff;
        white-space: nowrap;
        border: solid 1px #000;

    }


    /* Hide default colors for the ColorPicker instance. */

    #color-picker-container .yui-picker-controls,
    #color-picker-container .yui-picker-swatch,
    #color-picker-container .yui-picker-websafe-swatch {
    
        display: none;
    
    }


    /*
        Size the body element of the Menu instance to match the dimensions of 
        the ColorPicker instance.
    */
            
    #color-picker-menu .bd {

        width: 220px;    
        height: 190px;
    
    }

	#photo {
	
		background: #fff url(../button/assets/ggbridge.png) top left no-repeat;
		
		/*
			Hide the alpha PNG from IE 6 and make the background image transparent via the use of 
			the AlphaImageLoader that is applied by the filter property.
		*/

		_background-image: none;
		_filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../button/assets/ggbridge.png', sizingMethod='image');;

		border: solid 1px #000;
		width: 400px;
		height: 300px;
		
		_width: 398px;	/* For IE 6 */
		_height: 298px;	/* For IE 6 */
	
	}

	#button-container {
	
        border-top: solid 1px #000;
        padding: .5em .25em;
        margin-top: .5em;
	
	}

</style>