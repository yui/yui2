<style type="text/css">
.slot { border:2px solid #aaaaaa; background-color:#dddddd; color:#666666; text-align:center; position: absolute; width:60px; height:60px; }
.player { border:2px solid #bbbbbb; color:#eeeeee; text-align:center; position: absolute; width:60px; height:60px; }
.target { border:2px solid #574188; background-color:#cccccc; text-align:center; position: absolute; width:60px; height:60px; }

#t1 { left: 10px; top: 0px; }
#t2 { left: 378px; top: 0px; }
#b1 { left: 84px; top: 50px; }
#b2 { left: 158px; top: 50px; }
#b3 { left: 232px; top: 50px; }
#b4 { left: 306px; top: 50px; }

#pt1 { background-color:#7E695E; left: 84px; top: 150px; }
#pt2 { background-color:#7E695E; left: 84px; top: 230px; }
#pb1 { background-color:#416153; left: 195px; top: 150px; }
#pb2 { background-color:#416153; left: 195px; top: 230px; }
#pboth1 { background-color:#552E37; left: 306px; top: 150px; }
#pboth2 { background-color:#552E37; left: 306px; top: 230px; }

#usercontrols {
    top: -36px;
}

#workarea {
    position: relative;
    height: 300px;
}
</style>
<?php
if (!$clean) {
?>
<style>
    #usercontrols {
        position: absolute;
    }
</style>
<?php
}
?>
