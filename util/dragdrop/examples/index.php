
<?php
if (isset($_GET["mode"])) {
    $mode = $_GET["mode"];
} else {
    $mode = "";
}

if ($mode == "dist") {
        $ext = "html";
} else {
        $ext = "php";
}

  	$templateRelativePath = '.';
  	include('inc/inc-top.php');
?>


<body style="height:100%">
<img id="ylogo" src="img/logo.gif" />

<div id="pageTitle">
  <h3>Drag and Drop</h3>
</div>
<div id="content">
  <form name="dragDropForm" action="javscript:;">
    <div class="newsItem">
      <p>&nbsp;</p>
      <p>&nbsp;</p>

      <p><a href="drag.<?php echo $ext ?>?mode=<?php echo $mode ?>">Drag test</a>:
	  All three squares can be dragged, and are drop targets</p>

      <p><a href="ontop.<?php echo $ext ?>?mode=<?php echo $mode ?>">On top test</a>: 
	  Same as the drag test, except the object being dragged is 
	  displayed on top of the others.</p>

      <p><a href="proxy.<?php echo $ext ?>?mode=<?php echo $mode ?>">Frame/swap test</a>: 
	  The actual element is not moved during a drag operation. 
	  Instead, an absolutely positioned div (created once for all instances) is resized to the dimensions 
	  of the linked element and moved to the location of the drag operation.
	  </p>

	<p><a href="list.<?php echo $ext ?>?mode=<?php echo $mode ?>">Sortable list test</a>: 
		When a list item is dragged past the center
		of another list item, it is inserted before that item.
		The items in the first two columns can interact with items in the other
		column.  The items in the third column are defined as a separate group,
		so they can only interact with other items in the third column.
	  </p>
<?php if ($mode != "dist") { ?>
      <p><a href="my.<?php echo $ext ?>?mode=<?php echo $mode ?>">My Yahoo! - constrained to column</a>: 
	  The content channels can be moved. When dropped on another content channel, the two channels swap positions. 
	  The items are constrained to the column they are in. The sections can only be dragged when you click on the 
	  header of the section, yet the outline is the size of the entire channel, and the entire channel is swapped
	  when dropped..</p>
		<p><a href="my2.<?php echo $ext ?>?mode=<?php echo $mode ?>">My Yahoo! - no constraints</a>:
		Instead of framing the content channel when clicked, a miniature representation of the content channel 
		is moved around.  The column restriction was removed, so you can drag and drop content channels to other
		columns.
		</p>

<?php } ?>

	   <p><a href="multihandle.<?php echo $ext ?>?mode=<?php echo $mode ?>">Multiple drag handles</a>:
	  Demonstrates the support for multiple drag handles introduced in release 0.9.1.
	  </p>

	  <p><a href="targetable.<?php echo $ext ?>?mode=<?php echo $mode ?>">Targetable Afforance</a>:
		Demonstrates functionality added in version 0.11.0, including support for
		mutiple groups and the ability to get a list of targets so that they can
		be highlighted during a drag. 
	  </p>

	  <p><a href="grid.<?php echo $ext ?>?mode=<?php echo $mode ?>">Grid</a>:
       Demonstrates the graduated movement feature of drag and drop 
	  </p>

	  <p><a href="resize.<?php echo $ext ?>?mode=<?php echo $mode ?>">Resize</a>:
       Demonstrates a draggable and resizable module.
	  </p>



	  <p>&nbsp;</p>
    </div>
  </form>
</div>
<?php include('inc/inc-bottom.php'); ?>
</body>
</html>
