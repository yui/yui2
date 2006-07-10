<?php
    $templateRelativePath = '.';
    include('inc/inc-top.php');
?>
  
<body>


<?php include('inc/inc-alljs.php'); ?>


        <script type="text/javascript" src="js/DDResize.js" ></script>

<script type="text/javascript">
YAHOO.example.DDApp = function() {
    var dd, dd2, dd3;
    return {
        init: function() {
            dd = new YAHOO.example.DDResize("panelDiv", "handleDiv", "panelresize");
            dd2 = new YAHOO.util.DD("panelDiv", "paneldrag");
            dd2.addInvalidHandleId("handleDiv");
            
        }
    };
} ();

function testclick(e) {
    alert("click");
}
    
// var resizer_dd1 = new YAHOO.util.DD("theimage");                                                                                                      
// resizer_dd1.setYConstraint(0,0); 

// YAHOO.util.Event.addListener("theimage", "mousedown", testclick);

YAHOO.util.Event.addListener(window, "load", YAHOO.example.DDApp.init);
    
</script>

<div id="pageTitle"><h3>Drag and Drop - DD</h3></div>

  <?php include('inc/inc-rightbar.php'); ?>

  <div id="content">
    <form name="dragDropForm" action="javscript:;">
      <h3>Resize</h3>
     
<strong>The logger is paused for performance reasons.  Click "Resume" to re-enable it.</strong>
    <div id="panelDiv">&nbsp;
        <div id="handleDiv"></div>
    </div>     
      
      <p>&nbsp;</p>



    </form>
  </div>
    

<style type="text/css">
    #panelDiv {
        position:relative; 
        height: 300px; 
        width: 150px;
        top:80px; 
        left:105px; 
        border:1px solid #333333;
        background-color: #f7f7f7;
    }

    #handleDiv {
        position: absolute; 
        bottom:0px; 
        right: 0px; 
        width:10px; 
        height:10px;
        background-color:blue;
        font-size: 1px;
    }

    #theimage {
        position:absolute;top:10px;left:10px;
    }
</style>
<!--
<table>
  <tr>
    <td>
      <img id='theimage' src='img/lthumb.png' />
    </td>
  </tr>
</table>
-->

<!--
 <div id="theimage" style="position:absolute;top:50px;height:10px;width:10px;background-color:red">asdf</div>
 -->
</body>
</html>
