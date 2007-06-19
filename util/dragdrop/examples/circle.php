  <?php
    $templateRelativePath = '.';
    include('inc/inc-top.php');
  ?>
<body>

<?php include('inc/inc-alljs.php'); ?>

<script type="text/javascript" src="../../build/animation/animation.js"></script>

<script type="text/javascript">

YAHOO.example.DDApp = function() {
    var dd;
    var clickRadius = 46, startPos = [105, 280];
    var Event=YAHOO.util.Event
    var Dom=YAHOO.util.Dom;

    return {
        init: function() {

            var el = Dom.get("dragDiv1");
            // Event.on(el, "selectstart", Event.preventDefault);

            dd = new YAHOO.util.DD(el);

            dd.clickValidator = function(e) {

                // get the screen rectangle for the element
                var el = this.getEl();
                var region = Dom.getRegion(el);

                // get the radius of the largest circle that can fit inside
                // var w = region.right - region.left;
                // var h = region.bottom - region.top;
                // var r = Math.round(Math.min(h, w) / 2);
                //-or- just use a well-known radius
                var r = clickRadius;

                // get the location of the click
                var x1 = Event.getPageX(e), y1 = Event.getPageY(e);

                // get the center of the circle
                var x2 = Math.round((region.right+region.left)/2);
                var y2 = Math.round((region.top+region.bottom)/2);


                // I don't want text selection even if the click does not
                // initiate a drag
                Event.preventDefault(e);

                // check to see if the click is in the circle
                return ( ((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2)) <= r*r );
            };

            dd.onDragDrop = function(e, id) {
                // center it in the square
                Dom.setXY(this.getEl(), Dom.getXY(id));
            }

            dd.onInvalidDrop = function(e) {
                // return to the start position
                // Dom.setXY(this.getEl(), startPos);

                // Animating the move is more intesting
                new YAHOO.util.Motion( 
                    this.id, { 
                        points: { 
                            to: startPos
                        }
                    }, 
                    0.3, 
                    YAHOO.util.Easing.easeOut 
                ).animate();

            }

            dd2 = new YAHOO.util.DDTarget("dragDiv2");
        }
    }
} ();
    
YAHOO.util.Event.addListener(window, "load", YAHOO.example.DDApp.init);
    
</script>

<style type="text/css">

#dragDiv1 { 
    background:url(img/circle.gif) 0 0 no-repeat;
    top:280px; left:105px;
    border:0px solid black;
    z-index:10;
    cursor:default;
}

#dragDiv2 { 
    background:url(img/sq2.png) 0 0 no-repeat;
    background:#A0B9A6;top:390px; left:215px;
    border:0px solid black;
    cursor:default;
}

</style>

<div id="pageTitle"><h3>Drag and Drop - YAHOO.util.DD</h3></div>

<?php include('inc/inc-rightbar.php'); ?>

<div id="content">
<form name="dragDropForm" action="javscript:;">
<div class="newsItem">
  <h3>Custom Click Validator Implementation and onInvalidDrop</h3>
  <p>

  In this example, we override clickValidator to provide custom logic for
  determining if the initial mousedown should initiate a drag.  A drag is 
  initiated only if the mousedown happens inside of the circle.  

  <br />
  
  In addition, the circle snaps back to its initial position if not dropped 
  on a target.  This is done by overriding the onInvalidDrop method.

  </p>

<strong>The logger is paused for performance reasons.  Click "Resume" to re-enable it.</strong>

</div>
</form>
</div>

<?php include('inc/inc-bottom.php'); ?>

<div id="dragDiv1" class="testSquare" ><br />DD</div>
<div id="dragDiv2" class="testSquare" >DDTarget</div>

</body>
</html>
