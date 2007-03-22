  <?php
    $templateRelativePath = '.';
    include('inc/inc-top.php');

    $items = 20;
  ?>
  
<?php include('inc/inc-alljs.php'); ?>

<script type="text/javascript" src="../../build/animation/animation-min.js"></script>

<style>

div.workarea { padding:10px; float:left }

ul.draglist { 
    position: relative;
    width: 200px; 
    height:400px;
    background: #f7f7f7;
    border: 1px solid gray;
    list-style: none;
    overflow: visible;
    margin:0;
    padding:0;
}

ul.draglist li {
    margin: 2px;
    cursor: move; 
}

ul.draglist li.list1 {
    background-color: #D1E6EC;
    border:1px solid #7EA6B2;
}

ul.draglist li.list2 {
    background-color: #D8D4E2;
    border:1px solid #6B4C86;
}

</style>

<script type="text/javascript">

//////////////////////////////////////////////////////////////////////////////
// example app
//////////////////////////////////////////////////////////////////////////////
YAHOO.example.DDApp = function() {
    var Dom = YAHOO.util.Dom;
    var Event = YAHOO.util.Event;
    var DDM = YAHOO.util.DragDropMgr;
    return {
        init: function() {

            new YAHOO.util.DDTarget("ul1");

            new YAHOO.example.DDList("li1_1");
            new YAHOO.example.DDList("li1_2");
            new YAHOO.example.DDList("li1_3");

            new YAHOO.util.DDTarget("ul2");

            new YAHOO.example.DDList("li2_1");
            new YAHOO.example.DDList("li2_2");
            new YAHOO.example.DDList("li2_3");

            Event.on("showButton", "click", this.showOrder);
        },

        showOrder: function() {
            var ul,items,out,i;

            ul = Dom.get("ul1");
            items = ul.getElementsByTagName("li");
            out = "List 1: ";
            for (i=0;i<items.length;i=i+1) {
                out += items[i].id + " ";
            }

            ul = Dom.get("ul2");
            items = ul.getElementsByTagName("li");
            out += "\n\nList 2: ";
            for (i=0;i<items.length;i=i+1) {
                out += items[i].id + " ";
            }

            alert(out);

        }
    };
} ();

//////////////////////////////////////////////////////////////////////////////
// custom drag and drop implementation
//////////////////////////////////////////////////////////////////////////////
(function() {

var Dom = YAHOO.util.Dom;
var Event = YAHOO.util.Event;
var DDM = YAHOO.util.DragDropMgr;

YAHOO.example.DDList = function(id, sGroup, config) {

    if (id) {
        this.init(id, sGroup, config);
        this.initFrame();
        this.logger = this.logger || YAHOO;
    }

    var el = this.getDragEl();
    Dom.setStyle(el, "opacity", 0.67);
    this.host= config && config.hostId;

    this.setPadding(-3);
    this.goingUp = false;
    this.lastY = 0;
};

YAHOO.extend(YAHOO.example.DDList, YAHOO.util.DDProxy, {

    startDrag: function(x, y) {


        this.logger.log(this.id + " startDrag");

        // make the proxy look like the source element
        var dragEl = this.getDragEl();
        var clickEl = this.getEl();
        Dom.setStyle(clickEl, "visibility", "hidden");

        dragEl.innerHTML = clickEl.innerHTML;

        Dom.setStyle(dragEl, "color", Dom.getStyle(clickEl, "color"));
        Dom.setStyle(dragEl, "backgroundColor", Dom.getStyle(clickEl, "backgroundColor"));
        Dom.setStyle(dragEl, "border", "2px solid gray");
    },

    endDrag: function(e) {

        var srcEl = this.getEl();
        var proxy = this.getDragEl();
        Dom.setStyle(proxy, "visibility", "visible");

        // animate the proxy element to the src element's location
        var a = new YAHOO.util.Motion( 
            proxy, { 
                points: { 
                    to: Dom.getXY(srcEl)
                }
            }, 
            0.2, 
            YAHOO.util.Easing.easeOut 
        )
        var proxyid = proxy.id;
        var id = this.id;

        // hide the proxy and show the source element when finished with the animation
        a.onComplete.subscribe(function() {
                Dom.setStyle(proxyid, "visibility", "hidden");
                Dom.setStyle(id, "visibility", "");
            });
        a.animate();
    },

    onDragDrop: function(e, id) {
        YAHOO.log("DROP: " + id, "warn");
        // we could try to apply logic to detect the case when the item
        // is dropped below the last item in the list, and append it to
        // that list.
    },

    onDrag: function(e, id) {

        // figure out which direction we are moving
        var y = Event.getPageY(e);

        if (y < this.lastY) {
            this.goingUp = true;
        } else if (y > this.lastY) {
            this.goingUp = false;
        }

        this.lastY = y;
        
    },

    onDragOver: function(e, id) {
    
        var srcEl = this.getEl();
        var destEl = Dom.get(id);

        // if the destination element is not a list item, then
        // it is the list.  We will ignore all events that
        // happen on the list unless that list is empty.
        if (destEl.nodeName.toLowerCase() != "li") {
            var destDD = DDM.getDDById(destEl.id);
            if (destDD.isEmpty) {
                destEl.appendChild(this.getEl());
                destDD.isEmpty = false;
                DDM.refreshCache();
            }
        } else {

            var orig_p = srcEl.parentNode;
            var p = destEl.parentNode;

            if (this.goingUp) {
                p.insertBefore(srcEl, destEl);
            } else {
                p.insertBefore(srcEl, destEl.nextSibling);
            }

            if (p != orig_p) {

                // set the new parent
                this.hostId = p.id;

                // check to se if the original parent is empty
                if (orig_p.getElementsByTagName("li").length === 0) {
                    // mark the list dd instance empty
                    DDM.getDDById(orig_p.id).isEmpty = true;
                }

                // the new parent can't be empty if it was previously
                DDM.getDDById(p.id).isEmpty = false;
            }

            DDM.refreshCache();
        }
    },

    onDragEnter: function(e, id) {
    },

    onDragOut: function(e, id) {
    },

    toString: function() {
        return "DDList " + this.id;
    }

});

})();


YAHOO.util.Event.addListener(window, "load", 
        YAHOO.example.DDApp.init, YAHOO.example.DDApp, true);
    
</script>
<body>

<div id="pageTitle"><h3>Drag and Drop - DDProxy</h3></div>

<?php include('inc/inc-rightbar.php'); ?>


  <div id="content">
    <form name="dragDropForm" action="javscript:;">
    <div class="newsItem">
      <h3>Sortable List</h3>
      <p>

        <input type="button" id="showButton" value="Show Current Order" />
      </p>

 <div class="workarea">
 <h3>List 1</h3>
 <ul id="ul1" class="draglist">
   <li class="list1" id="li1_1">list 1, item 1</li>
   <li class="list1" id="li1_2">list 1, item 2</li>
   <li class="list1" id="li1_3">list 1, item 3</li>
 </ul>
 </div>


 <div class="workarea">
 <h3>List 2</h3>
 <ul id="ul2" class="draglist">
   <li class="list2" id="li2_1">list 2, item 1</li>
   <li class="list2" id="li2_2">list 2, item 2</li>
   <li class="list2" id="li2_3">list 2, item 3</li>
 </ul>
 </div>

    </div>
    </form>
  </div>
    
<?php include('inc/inc-bottom.php'); ?>
  </body>
</html>
 
