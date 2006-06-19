  <?php
    $templateRelativePath = '.';
    include('inc/inc-top.php');
  ?>

<body>

<?php include('inc/inc-alljs.php'); ?>

    <?php
        $items = 100000;
        for ($i=0;$i<$items;++$i) {
        echo "<div id=\"div$i\" class=\"slowDiv\">div $i</div>";
        }
    ?>


<script type="text/javascript">

YAHOO.example.DDApp = function() {
    var dd, dd2, dd3, logger;
    return {
        init: function() {
            dd = new YAHOO.util.DD("dragDiv1");
            dd2 = new YAHOO.util.DD("dragDiv2");
            dd3 = new YAHOO.util.DD("dragDiv3");
        }
    }
} ();
    
YAHOO.util.Event.addListener(window, "load", YAHOO.example.DDApp.init);
    
</script>

<style type="text/css">

#dragDiv1 { 
    background:url(img/sq1.png) 0 0 no-repeat;
    background-color:#6D739A;top:240px; left:105px;
}

#dragDiv2 { 
    background:url(img/sq2.png) 0 0 no-repeat;
    background-color:#566F4E;top:350px; left:215px;
}

#dragDiv3 {
    background:url(img/sq3.png) 0 0 no-repeat;
    background-color:#7E5B60;top:460px; left:325px;
}

</style>

<div id="pageTitle"><h3>Drag and Drop - YAHOO.util.DD</h3></div>

<?php include('inc/inc-rightbar.php'); ?>

<div id="content">
<form name="dragDropForm" action="javscript:;">
<div class="newsItem">
  <h3>Basic Implementation of YAHOO.util.DragDrop</h3>
  <p>
  In this implementation of YAHOO.util.DragDrop, we keep track of the position of the clicked element
  so that we can move it along with cursor during the drag operation, maintaining the relationship
  between the location of the element and the location of the click.  
  This class also provides a way to
  define other elements that modify the way the drag operation works.      </p>
</div>
</form>
</div>

<?php
include('inc/inc-bottom.php');
?>
<div id="dragDiv1" class="testSquare" >YAHOO.util.DD</div>
<div id="dragDiv2" class="testSquare" >YAHOO.util.DD</div>
<div id="dragDiv3" class="testSquare" >YAHOO.util.DD</div>
</body>
</html>
