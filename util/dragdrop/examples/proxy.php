<?php
    $templateRelativePath = '.';
    include('inc/inc-top.php');
?>

<body>

<?php include('inc/inc-alljs.php'); ?>

        <script type="text/javascript" src="js/DDSwap.js" ></script>

<script type="text/javascript" language="JavaScript">

YAHOO.example.DDApp = function() {
    var dd, dd2, dd3;

    function handleKeypress(e) {
        alert("asdf");
        YAHOO.log("keypress");
        YAHOO.util.Event.stopEvent(e);
        e.cancel = true;
        return false;
    }

    function initPointMode() {

        YAHOO.log("point mode");

        unreg();

        YAHOO.util.DDM.mode = YAHOO.util.DDM.POINT;

        dd = new YAHOO.example.DDSwap("dragDiv1", "proxytest");
        // dd.setPadding(10);
        //dd.setXConstraint(0,0);

        dd2 = new YAHOO.example.DDSwap("dragDiv2", "proxytest");
        dd2.addInvalidHandleType("input");
        // dd2.setPadding(10, 20, 30, 40);
        // dd2.setXConstraint(0,0);

        // the third DD instance uses its own proxy element
        dd3 = new YAHOO.example.DDSwap("dragDiv3", "proxytest",
                    { dragElId: "dragDiv4" });
        // dd3.setPadding(10, 40);
        // dd3.setPadding(10, 0, 20, 40);


    }

    function initIntersectMode() {

        YAHOO.log("intersect mode");

        unreg();

        YAHOO.util.DDM.mode = YAHOO.util.DDM.INTERSECT;

        dd = new YAHOO.example.DDSwap_i("dragDiv1");
        //dd.setPadding(10);

        dd2 = new YAHOO.example.DDSwap_i("dragDiv2");
        dd2.addInvalidHandleType("input");
        //dd2.setPadding(10, 20, 30, 40);
        // dd2.setXConstraint(0,0);

        dd3 = new YAHOO.example.DDSwap_i("dragDiv3");
        // dd3.setPadding(10, 40);
        //dd3.setPadding(10, 0, 20, 40);
    }

    function unreg() {
        if (dd) dd.unreg();
        if (dd2) dd2.unreg();
        if (dd3) dd3.unreg();
    }

    return {
        init: function() {

            // YAHOO.util.Event.on("testtext", "keydown", handleKeypress);
            initPointMode();
        },

        lock: function() { 
            dd.lock(); 
            dd2.setXConstraint(100, 100);
            dd2.setYConstraint(100, 100);
        },

        unlock: function() { 
            dd.unlock(); 
        },

        changeMode: function(val) {
            if (val == 1) {
                initIntersectMode();
            } else {
                initPointMode();
            }
        },

        unreg: function() {
            dd.unreg();
        }

    };
}();


YAHOO.util.Event.addListener(window, "load", YAHOO.example.DDApp.init);

</script>

<div id="pageTitle">
    <h3>Drag and Drop - DDProxy</h3>
</div>

  <?php include('inc/inc-rightbar.php'); ?>

  <div id="content">
    <form name="dragDropForm" action="javscript:;">
    <div class="newsItem">
      <h3>Proxy</h3>

      <!--
      <a href="javascript:YAHOO.util.DDM._onUnload()">Unload test</a>
      <a href="javascript:YAHOO.example.DDApp.lock()">lock</a>
      <a href="javascript:YAHOO.example.DDApp.unlock()">unlock</a>
      <a href="javascript:YAHOO.example.DDApp.unreg()">Unreg test</a>
      -->
      <p>
        This example builds on
        <a href="../test/test_draggable.php?mode=<? echo $_GET['mode'] ?>">YAHOO.util.DD</a>.
        Instead of moving the actual html element that was clicked, we have a hidden
        layer, empty aside from a border, absolutely positioned, that we place in the same 
        location of the clicked object.  The onDrag event handler was implemented so
        that the style of the DragDrop elements change when they interact.  The onDragDrop
        event handler was implemented so that the elements swap positions if one is dropped
        on another.
        Mode: 
        <select onchange="YAHOO.example.DDApp.changeMode(this.selectedIndex)">
          <option value="0" selected>Point</point>
          <option value="1">Intersect</point>
        </select>
<!--
        <input name="testtext" id="testtext" type="text" />
-->

      </p>

<strong>The logger is paused for performance reasons.  Click "Resume" to re-enable it.</strong>
    </div>
    </form>
  </div>
    
  <?php
    include('inc/inc-bottom.php');
  ?>
  
<!--
<div id="wrapperDiv" style="position:relative;width:400px;top:200px;height:200px;overflow:auto">
-->

<div id="dragDiv1" class="testSquare" style="background:url(img/sq1.png) 0 0 no-repeat;background-color:#6D739A;top:270px; left:105px ">DDSwap</div>
<div id="dragDiv2" class="testSquare" style="background:url(img/sq2.png) 0 0 no-repeat;background-color:#566F4E;top:350px; left:215px">
DDSwap
<!--
<input type="text" name="testinput" />
-->
</div>
<div id="wrapperDiv">
  <div id="dragDiv3" class="testSquare" style="background:url(img/sq3.png) 0 0 no-repeat;background-color:#7E5B60;top:430px; left:325px">DDSwap</div>
</div>

  <div id="dragDiv4" class="testSquare" style="visibility:hidden;border:0px solid black;height: 141px;width:160px;background-color:#7E5B60;top:630px; left:525px">a custom proxy element</div>
<!--
</div>
-->
</body>
</html>
