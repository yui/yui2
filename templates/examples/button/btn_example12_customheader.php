<style type="text/css">

    /*
        Set the "zoom" property to "normal" since it is set to "1" by the 
        ".example-container .bd" rule in yui.css and this causes a Menu
        instance's width to expand to 100% of the browser viewport.
    */
    
    div.yuimenu .bd {
    
        zoom: normal;
    
    }

    #categorybutton button {
    
        /* 
            Suppress the focus outline since Safari will outline even the 
            text that is clipped by the application of the "overflow" property
            in the follow style rule.
        */

        outline: none;
    
    }

    #categorybutton button em {

        font-style: normal;
        display: block;
        text-align: left;
        white-space: nowrap;

        /*  Restrict the width of the label to 10em. */

        width: 10em;

        /* Hide the overflow if the text label exceeds 10em in width. */

        overflow: hidden;

        /* 
            IE, Safari and Opera support the ability to add ellipsis when the text 
            label exceeds 10em in width.
        */

        text-overflow: ellipsis;
		-o-text-overflow: ellipsis;

    }

</style>