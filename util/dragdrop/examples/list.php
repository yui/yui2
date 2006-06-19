  <?php
    $templateRelativePath = '.';
    include('inc/inc-top.php');

    $items = 20;
  ?>
  
<?php include('inc/inc-alljs.php'); ?>

<script type="text/javascript" src="js/DDList.js" ></script>

<script type="text/javascript">

YAHOO.example.DDApp = function() {
    return {
        init: function() {

            var i = 0;
            for (j=0;j < <?php echo $items ?>;++j) {
                new YAHOO.example.DDList("li" + j);
                new YAHOO.example.DDList("li" + (j + <?php echo $items ?>));
                new YAHOO.example.DDList("li" + (j + <?php echo ($items*2) ?>), "right");
            }

            new YAHOO.example.DDListBoundary("hidden1");
            new YAHOO.example.DDListBoundary("hidden2");
            new YAHOO.example.DDListBoundary("hidden3", "right");

            // dd11 = new YAHOO.example.DDList("li11");
            // dd11.addToGroup("right");
            // dd12 = new YAHOO.example.DDList("li12");
            // dd12.addToGroup("right");
            YAHOO.util.DDM.mode = 
                    document.getElementById("ddmode").selectedIndex;
        }
    };
} ();

YAHOO.util.Event.addListener(window, "load", YAHOO.example.DDApp.init);
// YAHOO.util.DDM.useCache = false;
    
</script>
<body>

<div id="pageTitle"><h3>Drag and Drop - DDProxy</h3></div>

<?php include('inc/inc-rightbar.php'); ?>

  <div id="content">
    <form name="dragDropForm" action="javscript:;">
    <div class="newsItem">
      <h3>Sortable List</h3>
      <p>
        This example extends
        DDProxy
        to implement a sortable list.  When a list item is dragged past the center
        of another list item, it is inserted before that item.
        The items in the first two columns can interact with items in the other
        column.  The items in the third column are defined as a separate group,
        so they can only interact with other items in the third column.
      </p>

        Mode: 
        <select id="ddmode" onchange="YAHOO.util.DDM.mode = this.selectedIndex">
          <option value="0" selected>Point</point>
          <option value="1">Intersect</point>
        </select>

    <table border="0">
    <tr>
    <td >
    <ul class="listGroup1">
        <li id="hidden6" class="sortListHidden">Hidden</li>
        <?php
            for ($i=0;$i<$items;++$i) {
            echo "<li id=\"li$i\" class=\"sortList\">li $i</li>";
            }
        ?>
        <li id="hidden1" class="sortListHidden">Hidden</li>

    </ul>
    </td>

    <td>&nbsp;</td>
<td>
    <ul class="listGroup1">
        <li id="hidden5" class="sortListHidden">Hidden</li>
        <?php
            for ($i=$items;$i<($items*2);++$i) {
            echo "<li id=\"li$i\" class=\"sortList\">li $i</li>";
            }
        ?>

        <li id="hidden2" class="sortListHidden">Hidden</li>
    </ul>
    </td>

    <td>&nbsp;</td>
<td>
    <ul class="listGroup2">
        <li id="hidden4" class="sortListHidden">Hidden</li>
        <?php
            for ($i=($items*2);$i<($items*3);++$i) {
            echo "<li id=\"li$i\" class=\"sortList\">li $i</li>";
            }
        ?>
        <li id="hidden3" class="sortListHidden">Hidden</li>
    </ul>
    </td>

    </tr>
    </table>

    </div>
    </form>
  </div>
    
<?php include('inc/inc-bottom.php'); ?>
  </body>
</html>
 
