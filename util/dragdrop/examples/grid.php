<?php
    $templateRelativePath = '.';
    include('inc/inc-top.php');
?>

<body>

<style type="text/css">
body { background: url("img/grid.png") }

#dragDiv1 { 
    background:url(img/sq1.png) 0 0 no-repeat;background-color:#6D739A;
    top:237px; left:113px;border:0px solid white;
}

#dragDiv2 {
    background:url(img/sq2.png) 0 0 no-repeat;background-color:#566F4E;
    top:362px; left:238px; border:0px solid white;
}

#dragDiv3 {
    background:url(img/sq3.png) 0 0 no-repeat;background-color:#7E5B60;
    top:487px; left:363px; border:0px solid white;
}

</style>

<?php include('inc/inc-alljs.php'); ?>

<script type="text/javascript">

YAHOO.example.DDApp = function() {
    var dd, dd2, dd3, logger;
    return {
        init: function() {
            if (typeof(ygLogger) != "undefined") {
                ygLogger.init(document.getElementById("logDiv"));
                logger = new ygLogger("DDApp");
            }

            dd = new YAHOO.util.DD("dragDiv1");
            dd.setXConstraint(1000, 1000, 25);
            dd.setYConstraint(1000, 1000, 25);

            dd2 = new YAHOO.util.DD("dragDiv2");
            dd2.setXConstraint(1000, 1000, 25);
            dd2.setYConstraint(1000, 1000, 25);

            dd3 = new YAHOO.util.DD("dragDiv3");
            dd3.setXConstraint(1000, 1000, 25);
            dd3.setYConstraint(1000, 1000, 25);
        }
    };
} ();
    
YAHOO.util.Event.addListener(window, "load", YAHOO.example.DDApp.init);
    
</script>
v
<div id="pageTitle">
  <h3>Drag and Drop - YAHOO.util.DD</h3>
</div>

<?php include('inc/inc-rightbar.php'); ?>

<div id="content">
  <form name="dragDropForm" action="javscript:;">
    <div class="newsItem">
      <h3>YAHOO.util.DD Grid</h3>
    </div>
  </form>
</div>

<?php include('inc/inc-bottom.php'); ?>

<div id="dragDiv1" class="testSquare">YAHOO.util.DD</div>
<div id="dragDiv2" class="testSquare">YAHOO.util.DD</div>
<div id="dragDiv3" class="testSquare">YAHOO.util.DD</div>

</body>
</html>
