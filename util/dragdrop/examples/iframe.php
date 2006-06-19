  <?php
    $templateRelativePath = '.';
    include('inc/inc-top.php');
  ?>

<body>

<?php include('inc/inc-alljs.php'); ?>

<script type="text/javascript">

YAHOO.example.DDWithOverlay = function(id, sGroup, overlayId) {
    this.init(id, sGroup);
    // this.initFrame();
    this.overlayId = overlayId;
};

// YAHOO.example.DDWithOverlay.prototype = new YAHOO.util.DDProxy();
YAHOO.example.DDWithOverlay.prototype = new YAHOO.util.DD();

YAHOO.example.DDWithOverlay.prototype.startDrag = function(e) {
    var el = document.getElementById(this.overlayId);
    el.style.display = "block";

    // This only fixes the problem for the viewport
    el.style.height = (this.DDM.getClientHeight() - 20) + "px";
    el.style.width = (this.DDM.getClientWidth() - 20) + "px";

    // The next version of the Dom utility will provide functions for
    // calculating the full document dimensions... when available, this
    // will provide a better solution than the above solution

    // YAHOO.util.Dom.setStyle(el, "height", 
            // YAHOO.util.Dom.getDocumentHeight());
    // YAHOO.util.Dom.setStyle(el, "width", 
            // YAHOO.util.Dom.getDocumentWidth());
};

YAHOO.example.DDWithOverlay.prototype.endDrag = function(e) {
    document.getElementById(this.overlayId).style.display = "none";
};

YAHOO.example.DDApp = function() {
    var dd, dd2, dd3;
    return {
        init: function() {

            YAHOO.util.Event.addListener(
                    "overlay", 
                    "mouseover", function(e) {YAHOO.util.Event.stopEvent(e);}
                    );

            dd = new YAHOO.example.DDWithOverlay("dragDiv1", "default", "overlay");
            dd2 = new YAHOO.example.DDWithOverlay("dragDiv2", "default", "overlay");
            dd3 = new YAHOO.example.DDWithOverlay("dragDiv3", "default", "overlay");
        }
    };
} ();
    
YAHOO.util.Event.addListener(window, "load", YAHOO.example.DDApp.init);
    
</script>

<style type="text/css">

#dragDiv1 { 
    background:url(img/sq1.png) 0 0 no-repeat;
    background-color:#6D739A;top:240px; left:105px;
    height: 20px;
    width: 20px;
    z-index: 2;
}

#dragDiv2 { 
    background:url(img/sq2.png) 0 0 no-repeat;
    background-color:#566F4E;top:280px; left:105px;
    height: 20px;
    width: 20px;
    z-index: 2;
}

#dragDiv3 {
    background:url(img/sq3.png) 0 0 no-repeat;
    background-color:#7E5B60;top:320px; left:105px;
    height: 20px;
    width: 20px;
    z-index: 2;
}

iframe {
    position: absolute;
    height: 200px;
    width: 200px;
    left: 200px;
    border: 1px solid gray;
}

#iframe1 { top: 200px; }

#overlay {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 999;
height: 100%;
width: 100%;
display: none;
}

</style>

<div id="pageTitle"><h3>Drag and Drop w/ Overlay</h3></div>

<?php include('inc/inc-rightbar.php'); ?>

<div id="content">
<form name="dragDropForm" action="javscript:;">
<div class="newsItem">
  <h3>Drag and Drop w/ Overlay</h3>
  <p>This example uses a transparent overlay to cover iframes during the
  drag operation.  This gets around the issue of the frame "stealing"
  the mouse events while dragging over them.
  </p>
</div>
</form>
</div>

<?php
include('inc/inc-bottom.php');
?>
<div id="dragDiv1" class="testSquare" ></div>
<div id="dragDiv2" class="testSquare" ></div>
<div id="dragDiv3" class="testSquare" ></div>

<div id="overlay">&nbsp;</div>

<iframe id="iframe1" src="blank.html"></iframe>
</body>
</html>
