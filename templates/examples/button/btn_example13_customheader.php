<style type="text/css">

    .yui-button {
    
        border-width: 1px 0;
        border-style: solid;
        border-color: #004d89;
        margin: auto .25em;

        /*
            Give the Button instance a transparent background image that 
            provides a glossy, glass-like look.  Since the background image is
            transparent, it can apply the glass effect the Button instance
            regardless of its background color.
        */
        background: url(../button/assets/gloss.png) repeat-x left center;
        
    }

    .ie6 {
    
        /* Make background image transparent IE 6 using the AlphaImageLoader. */
        background-image: none;
        filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../button/assets/gloss.png', sizingMethod = 'scale');
    
    }

    .yui-button .first-child {
    
        border-width: 0 1px;
        border-style: solid;
        border-color: #004d89;
        margin: 0 -1px;

        /*
            The following is necessary to get negative margins working in IE.s
        */

        *position: relative;
        *left: -1px;
    
    }
    
    .yui-button button,
    .yui-button a {
    
        padding: 0 10px;
        font-size: 93%;  /* 12px */
        line-height: 2;  /* ~24px */
        *line-height: 1.7; /* For IE */
        min-height: 2em; /* For Gecko */
        *min-height: auto; /* For IE */
        color: #fff;
        border: solid 1px #599acd;
    
    }

    .yui-button#ok-button {
        
        background-color: #004d89;
    
    }

</style>