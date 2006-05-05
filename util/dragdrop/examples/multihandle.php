  <?php
    $templateRelativePath = '.';
    include('inc/inc-top.php');
  ?>
  
<?php include('inc/inc-alljs.php'); ?>

<script type="text/javascript">

YAHOO.example.DDApp = function() {
    var dd, dd3, logger;
    return {
        init: function() {
            if (typeof(ygLogger) != "undefined") {
                ygLogger.init(document.getElementById("logDiv"));
                logger = new ygLogger("test_noimpl.php");
            }

            dd = new YAHOO.example.DDOnTop("dragDiv1");
            dd.setHandleElId("handle1");
            dd.setHandleElId("handle2");
            dd3 = new YAHOO.util.DDTarget("dragDiv3");
        }
    };
} ();
    
YAHOO.util.Event.addListener(window, "load", YAHOO.example.DDApp.init);
    
</script>
<body>
<div id="pageTitle">
    <h3>Drag and Drop - DD, DDTarget</h3>
</div>

<?php include('inc/inc-rightbar.php'); ?>

  <div id="content">
    <form name="dragDropForm" action="javscript:;">
    <div class="newsItem">
      <h3>Multiple Drag Handles</h3>
      <p>
        Demonstrates the support for multiple drag handles introduced in release 0.9.1.
      </p>

    </div>
    </form>
  </div>
    
<?php include('inc/inc-bottom.php'); ?>

    <div id="dragDiv1" style="position:absolute;color:white;background-color:#594178;top:240px; left:105px;height:200px;width:200px;z-index:2;padding:4px">
        <div id="handle1" style="text-align:center;margin-right:14px;cursor:move;float:left;color:black;width:90px;background-color:#eeeeee;border:1px solid black ">handle1</div>
        <div id="handle2" style="text-align:center;cursor:move;float:right;color:black;width:90px;background-color:#eeeeee;border:1px solid black ">handle2</div>
        <p>
        
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Mauris nec turpis. Vestibulum gravida suscipit libero. Integer id sapien. Nullam tempus, lorem quis rutrum consectetuer, erat massa vehicula nisl, eu pulvinar lacus diam ac orci
        
        </p>
    </div>

    <div id="dragDiv3" class="testSquare" style="background-color:#000000;top:460px; left:325px;cursor:default;z-index:0">DDTarget</div>
    
  </body>
</html>
 
