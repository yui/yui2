  <?php
    $templateRelativePath = '.';
    include('inc/inc-top.php');
  ?>
  
<?php include('inc/inc-alljs.php'); ?>

<script type="text/javascript" src="js/DDOnTop.js" ></script>

<script type="text/javascript" language="JavaScript">
    var dd, dd2, dd3;
    function dragDropInit() {
        dd = new YAHOO.example.DDOnTop("dragDiv1");

        dd2 = new YAHOO.example.DDOnTop("dragDiv2");
        // dd2.setPadding(-10);
        // dd2.setXConstraint(100, 100);
        // dd2.setYConstraint(0, 0);

        dd3 = new YAHOO.example.DDOnTop("dragDiv3");
        dd3.addInvalidHandleId("excludeid3");
    }
    
    YAHOO.util.Event.addListener(window, "load", dragDropInit);
    
</script>
<body>
<div id="pageTitle">
    <h3>Drag and Drop - DD</h3>
</div>

  <?php include('inc/inc-rightbar.php'); ?>

  <div id="content">
    <form name="dragDropForm" action="javscript:;">
    <div class="newsItem">
      <h3>Dragging beyond window boundary</h3>
      <p>
            Attempting to fix the FF browser issue dragging modules by the
            text node.  Masking the text node with a div appears to be 
            one approach.  There is still a dead space where the &amp;nbsp;
            is printed, but it doesn't seem to work without it.
      </p>
      <div id="workArea" style="height:420px">&nbsp;</div>
      <p>&nbsp;</p>
    </div>
    </form>
  </div>
    
    
  <?php
    include('inc/inc-bottom.php');
  ?>
    <div id="dragDiv1" class="testSquare" style="background:url(img/sq1.png) 0 0 no-repeat;background-color:#6D739A;top:240px; left:105px;color:black ">
    NOT BAD 
    <div style="position: absolute; top:0px; left: 0px; width:100px; height:20px;text-align:right">&nbsp;</div>
    </div>
    <div id="dragDiv2" class="testSquare" style="background:url(img/sq2.png) 0 0 no-repeat;background-color:#566F4E;top:350px; left:215px">
    <a href="#">HREFS IGNORED</a>
    </div>
    <div id="dragDiv3" class="testSquare" style="background:url(img/sq3.png) 0 0 no-repeat;background-color:#7E5B60;top:460px; left:325px;color:black">
    BROKEN
    <div id="excludeid1" class="excludeclass1" style="position:absolute; top:20px; left:20px;height:20px;width:20px;background-color:#333333">&nbsp;</div>
    <div id="excludeid2" class="excludeclass2" style="position:absolute; top:40px; left:40px;height:20px;width:20px;background-color:#333333">&nbsp;</div>
    <div id="excludeid3" class="excludeclass1" style="position:absolute; top:60px; left:60px;height:20px;width:20px;background-color:#333333">&nbsp;</div>
    </div>
 
    </body>
  </html>
