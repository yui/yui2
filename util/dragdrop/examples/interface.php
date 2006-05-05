  <?php
  	$templateRelativePath = '.';
  	include('inc/inc-top.php');
  ?>
  
<?php include('inc/inc-alljs.php'); ?>

<script type="text/javascript">
	
	// if (ygLogger) var gLogger = new ygLogger("test_noimpl.php");
	var dd, dd2, dd3;
	
	function dragDropInit() {
		if (typeof(ygLogger) != "undefined") {
			ygLogger.init(document.getElementById("logDiv"));
		}

		dd = new YAHOO.util.DragDrop("dragDiv1");
		dd2 = new YAHOO.util.DragDrop("dragDiv2");
		dd3 = new YAHOO.util.DragDrop("dragDiv3");
	}
	
	YAHOO.util.Event.addListener(window, "load", dragDropInit);
	
</script>
<body>
<div id="pageTitle">
	<h3>Drag and Drop - YAHOO.util.DragDrop</h3>
</div>

<?php include('inc/inc-rightbar.php'); ?>

  <div id="content">
    <form name="dragDropForm" action="javscript:;">
	<div class="newsItem">
	  <h3>No Implementation</h3>
	  <p>By implementing the base drag and drop class, the manager class will
      keep track of the element's virtual position, but not actually move anything.
      You can click on any of the
	  three squares and watch the various events that the Drag and Drop Manager fires in
	  logger window.	  </p>
	</div>
	</form>
  </div>

  <?php
  	include('inc/inc-bottom.php');
  ?>
 
	<div id="dragDiv1" class="testSquare" style="background:url(img/sq1.png) 0 0 no-repeat;background-color:#6D739A;top:240px; left:105px ">DragDrop</div>
	<div id="dragDiv2" class="testSquare" style="background:url(img/sq2.png) 0 0 no-repeat;background-color:#566F4E;top:350px; left:215px">DragDrop</div>
	<div id="dragDiv3" class="testSquare" style="background:url(img/sq3.png) 0 0 no-repeat;background-color:#7E5B60;top:460px; left:325px">DragDrop</div>
   
    </body>
  </html>
