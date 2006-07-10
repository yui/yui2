  <?php
    $templateRelativePath = '.';
    include('inc/inc-top.php');
  ?>
  
<?php include('inc/inc-alljs.php'); ?>

        <script type="text/javascript" src="js/DDPlayer.js" ></script>
<script type="text/javascript">
YAHOO.example.DDApp = function() {
    var slots = [];
    var players = [];
    var Event = YAHOO.util.Event;
    var DDM = YAHOO.util.DDM;
    return {

        remove: function() {
            players[4].removeFromGroup("bottomslots");
        },

        init: function() {
            
            // slots
            slots[0] = new YAHOO.util.DDTarget("t1", "topslots");
            slots[1] = new YAHOO.util.DDTarget("t2", "topslots");
            slots[2] = new YAHOO.util.DDTarget("b1", "bottomslots");
            slots[3] = new YAHOO.util.DDTarget("b2", "bottomslots");
            slots[4] = new YAHOO.util.DDTarget("b3", "bottomslots");
            slots[5] = new YAHOO.util.DDTarget("b4", "bottomslots");
            
            // players
            players[0] = new YAHOO.example.DDPlayer("pt1", "topslots");
            players[1] = new YAHOO.example.DDPlayer("pt2", "topslots");
            players[2] = new YAHOO.example.DDPlayer("pb1", "bottomslots");
            players[3] = new YAHOO.example.DDPlayer("pb2", "bottomslots");
            players[4] = new YAHOO.example.DDPlayer("pboth1", "topslots");
            players[4].addToGroup("bottomslots");
            players[5] = new YAHOO.example.DDPlayer("pboth2", "topslots");
            players[5].addToGroup("bottomslots");

            DDM.mode = document.getElementById("ddmode").selectedIndex;
        }

    };
} ();

YAHOO.util.Event.addListener(window, "load", YAHOO.example.DDApp.init);
//YAHOO.util.Event.addListener("removeButton", "click", YAHOO.example.DDApp.remove);

</script>
<body>
<div id="pageTitle"><h3>Drag and Drop - DDProxy</h3></div>

  <?php include('inc/inc-rightbar.php'); ?>

  <div id="content">
    <form name="dragDropForm" action="javscript:;">
    <div class="newsItem">
      <h3>Multiple groups, targetable affordance</h3>
      <p> 
        Mode: 
        <select id="ddmode" onchange="YAHOO.util.DDM.mode = this.selectedIndex">
          <option value="0" selected>Point</point>
          <option value="1">Intersect</point>
        </select>
      </p>
<strong>The logger is paused for performance reasons.  Click "Resume" to re-enable it.</strong>
      <div id="workArea">&nbsp;</div>
      <p>
     <!-- 
<input id="removeButton" type="button" value="remove" />
-->
      </p>
    </div>
    </form>
  </div>
    
  <?php include('inc/inc-bottom.php'); ?>

<style type="text/css">
    .slot { border:2px solid #aaaaaa; background-color:#dddddd; color:#666666; text-align:center; position: absolute; width:60px; height:60px; }
    .player { border:2px solid #bbbbbb; color:#eeeeee; text-align:center; position: absolute; width:60px; height:60px; }
    .target { border:2px solid #574188; background-color:#cccccc; text-align:center; position: absolute; width:60px; height:60px; }

    #t1 { left: 90px; top: 167px; }
    #t2 { left: 458px; top: 167px; }
    #b1 { left: 164px; top: 230px; }
    #b2 { left: 238px; top: 230px; }
    #b3 { left: 312px; top: 230px; }
    #b4 { left: 386px; top: 230px; }
    
    #pt1 { background-color:#7E695E; left: 164px; top: 350px; }
    #pt2 { background-color:#7E695E; left: 164px; top: 430px; }
    #pb1 { background-color:#416153; left: 275px; top: 350px; }
    #pb2 { background-color:#416153; left: 275px; top: 430px; }
    #pboth1 { background-color:#552E37; left: 386px; top: 350px; }
    #pboth2 { background-color:#552E37; left: 386px; top: 430px; }
</style>

<div class="slot" id="t1" >1</div>
<div class="slot" id="t2" >2</div>
<div class="slot" id="b1" >3</div>
<div class="slot" id="b2" >4</div>
<div class="slot" id="b3" >5</div>
<div class="slot" id="b4" >6</div>

<div class="player" id="pt1" >1</div>
<div class="player" id="pt2" >2</div>
<div class="player" id="pb1" >3</div>
<div class="player" id="pb2" >4</div>
<div class="player" id="pboth1" >5</div>
<div class="player" id="pboth2" >6</div>


</body>
</html>
