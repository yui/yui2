<style type="text/css">

    /*
        Position and hide the Menu instance to prevent a flash of unstyled 
        content when the page is loading.
    */    

    div.yuimenu {
    
        position: absolute;
        visibility: hidden;
    
    }


    /*
        Set the "zoom" property to "normal" since it is set to "1" by the 
        ".example-container .bd" rule in yui.css and this causes a Menu
        instance's width to expand to 100% of the browser viewport.
    */
    
    div.yuimenu .bd {
    
        zoom: normal;
    
    }

</style>