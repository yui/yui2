<style type="text/css">
    /* Clear calendar's float */
    #container .bd:after {content:".";display:block;clear:left;height:0;visibility:hidden;}

    /* Have calendar squeeze upto bd bounding box */
    #container .bd {padding:0;}

    /* Remove calendar's border and set padding in ems instead of px, so we can specify an width in ems for the container */
    #cal {border:none;padding:1em}

    /* Datefield look/feel */
    .datefield {
        position:relative;
        top:10px;
        left:10px;
        white-space:nowrap;
        border:1px solid black;
        background-color:#eee;
        width:25em;
        padding:5px;
    }

    .datefield input,
    .datefield button,
    .datefield label  {vertical-align:middle}

    .datefield label  {font-weight:bold}
    .datefield input  {width:15em}
    .datefield button  {padding:0 5px 0 5px; margin-left:2px;}
    .datefield button img {padding:0;margin:0;vertical-align:middle}

    /* Example box */
    .box {
	position:relative;
	height:30em;
    }
</style>
