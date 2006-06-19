  <?php
    $templateRelativePath = '.';
    include('inc/inc-top.php');
  ?>
  
<body>

<?php include('inc/inc-alljs.php'); ?>

        <script type="text/javascript" src="js/DDOnTop.js" ></script>

<script type="text/javascript" language="JavaScript">

YAHOO.example.DDApp = function() {
    var dd, dd2, dd3;

    return {
        init: function() {
            dd = new YAHOO.example.DDOnTop("dragDiv1");
            dd.addInvalidHandleId("excludeid3");
            dd.addInvalidHandleClass("excludeclass2");

            dd2 = new YAHOO.example.DDOnTop("dragDiv2");
            // dd2.setPadding(-10);
            // dd2.setXConstraint(100, 100);
            // dd2.setYConstraint(0, 0);

            dd3 = new YAHOO.example.DDOnTop("dragDiv3");
        }
    };
} ();

YAHOO.util.Event.addListener(window, "load", YAHOO.example.DDApp.init);
    
</script>
<style type="text/css">

#dragDiv1 {
    background:url(img/sq1.png) 0 0 no-repeat;
    background-color:#6D739A;top:240px; left:105px;
}
#excludeid1 {
    position:absolute; top:20px; left:20px;height:20px;width:20px;
    background-color:#333333;
}
#excludeid2 {
    position:absolute; top:40px; left:40px;height:20px;width:20px;
    background-color:#333333;
}
#excludeid3 {
    position:absolute; top:60px; left:60px;height:20px;width:20px;
    background-color:#333333;
}
#maskDiv {
    position: absolute; top:0px; left: 0px; width:100px; height:20px;
}

#dragDiv2 {
    background:url(img/sq2.png) 0 0 no-repeat;background-color:#566F4E;
    top:350px; left:215px;
}

#dragDiv3 {
    background:url(img/sq3.png) 0 0 no-repeat;background-color:#7E5B60;
    top:460px; left:325px;
}

</style>
<div id="pageTitle"><h3>Drag and Drop - DD</h3></div>

  <?php include('inc/inc-rightbar.php'); ?>

  <div id="content">
    <form name="dragDropForm" action="javscript:;">
    <div class="newsItem">
      <h3>Dragged object is on top</h3>
      <p>
        This example is identical to the basic drag and drop implementation, 
        YAHOO.util.DD,
        but we have extended it so that the square that is being dragged is positioned
        on top of the others.
      </p>
      <div id="workArea">&nbsp;</div>
      <p>&nbsp;</p>
    </div>
    </form>
  </div>
    
  <?php include('inc/inc-bottom.php'); ?>

    <div id="dragDiv1" class="testSquare">
        DDOnTop
        <div id="excludeid1" class="excludeclass1">&nbsp;</div>
        <div id="excludeid2" class="excludeclass2">&nbsp;</div>
        <div id="excludeid3" class="excludeclass1">&nbsp;</div>
        <div id="maskDiv">&nbsp;</div>
    </div>
    <div id="dragDiv2" class="testSquare">
        <a href="#">DDOnTop</a>
    </div>
    <div id="dragDiv3" class="testSquare">DDOnTop</div>
 
  </body>
</html>
