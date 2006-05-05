  <?php
    $templateRelativePath = '.';
    include('inc/inc-top.php');
  ?>
  
<?php include('inc/inc-alljs.php'); ?>

<body>
<script type="text/javascript" language="JavaScript">
    YAHOO.example.DDResize = function(panelElId, handleElId, sGroup) {
        if (handleElId) {
            this.init(panelElId, sGroup);
            this.logger = new ygLogger("DDResize");
        }

        this.handleElId = handleElId;

        this.setHandleElId(handleElId);
        

    var resizer_dd1 = new YAHOO.util.DD("the_img");                                                                                                      
    resizer_dd1.setYConstraint(10,10); 
        
    };

    YAHOO.example.DDResize.prototype = new YAHOO.util.DragDrop();

    YAHOO.example.DDResize.prototype.onMouseDown = function(e) {

        var panel = this.getEl();
        this.startWidth = panel.offsetWidth;
        this.startHeight = panel.offsetHeight;

        this.startPos = [YAHOO.util.Event.getPageX(e),
                         YAHOO.util.Event.getPageY(e)];
    };

    YAHOO.example.DDResize.prototype.onDrag = function(e) {
        var newPos = [YAHOO.util.Event.getPageX(e),
                      YAHOO.util.Event.getPageY(e)];

        var offsetX = newPos[0] - this.startPos[0];
        var offsetY = newPos[1] - this.startPos[1];

        var newWidth = Math.max(this.startWidth + offsetX, 10);
        var newHeight = Math.max(this.startHeight + offsetY, 10);

        var panel = this.getEl();
        panel.style.width = newWidth + "px";
        panel.style.height = newHeight + "px";
    };

    var resizer = new YAHOO.example.DDResize("panelDiv", "handleDiv");

    
</script>
<style type="text/css">
    #panelDiv {
        position:relative; 
        height: 300px; 
        width: 150px;
        top:80px; 
        left:105px; 
        border:1px solid #333333;
    }

    #handleDiv {
        position: absolute; 
        bottom:0px; 
        right: 0px; 
        width:10px; 
        height:10px;
        background-color:blue
    }

#the_img {
      position:absolute;top:10px;left:10px;
}
</style>

<div id="panelDiv">
    <div id="handleDiv">&nbsp;</div>
</div>

<table>
  <tr>
    <td>
      <img id='the_img' src='img/lthumb.png' />
    </td>
  </tr>
</table>

</body>

</html>
