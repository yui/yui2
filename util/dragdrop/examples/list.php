  <?php
    $templateRelativePath = '.';
    include('inc/inc-top.php');
  ?>
  
<?php include('inc/inc-alljs.php'); ?>
<script type="text/javascript" src="../../build/animation/animation-min.js"></script>
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
            Event.on("switchButton", "click", this.switchStyles);
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

        },

        switchStyles: function() {
            Dom.get("ul1").className = "draglist_alt";
            Dom.get("ul2").className = "draglist_alt";
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

    YAHOO.example.DDList.superclass.constructor.call(this, id, sGroup, config);

    this.logger = this.logger || YAHOO;
    var el = this.getDragEl();
    Dom.setStyle(el, "opacity", 0.67);
    this.host= config && config.hostId;

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


        // If there is one drop interaction, the li was dropped either on the list,
        // or it was dropped on the current location of the source element.
        if (DDM.interactionInfo.drop.length === 1) {
            // Check to see if we are over the source element's location.  We will
            // append to the bottom of the list once we are sure it was a white
            // space drop
            var pt = DDM.interactionInfo.point;
            var region = DDM.interactionInfo.sourceRegion;
            if (!region.intersect(pt)) {
                var destEl = Dom.get(id);
                var destDD = DDM.getDDById(id);
                destEl.appendChild(this.getEl());
                destDD.isEmpty = false;
                DDM.refreshCache();
            }
        }
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

        // We are only concerned with dragovers
        if (destEl.nodeName.toLowerCase() == "li") {
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

    toString: function() {
        return "DDList " + this.id;
    }

});

})();


YAHOO.util.Event.addListener(window, "load", 
        YAHOO.example.DDApp.init, YAHOO.example.DDApp, true);
    
</script>
<style type="text/css">

div.workarea { padding:10px; float:left }

ul.draglist { 
    position: relative;
    width: 200px; 
    height:300px;
    background: #f7f7f7;
    border: 1px solid gray;
    list-style: none;
    margin:0;
    padding:0;
}

ul.draglist li {
    margin: 1px;
    cursor: move; 
}

ul.draglist_alt { 
    position: relative;
    width: 200px; 
    list-style: none;
    margin:0;
    padding:0;
    /*
       The bottom padding provides the cushion that makes the empty 
       list targetable.  Alternatively, we could leave the padding 
       off by default, adding it when we detect that the list is empty.
    */
    padding-bottom:20px;
}

ul.draglist_alt li {
    margin: 1px;
    cursor: move; 
}


li.list1 {
    background-color: #D1E6EC;
    border:1px solid #7EA6B2;
}

li.list2 {
    background-color: #D8D4E2;
    border:1px solid #6B4C86;
}

#user_actions { float:right }

</style>

<body>

<div id="pageTitle"><h3>Drag and Drop - DDProxy</h3></div>
  <?php include('inc/inc-rightbar.php'); ?>
  <div id="content">
    <form name="dragDropForm" action="javscript:;">
    <div class="newsItem">
      <span id="user_actions">
        <input type="button" id="showButton" value="Show Current Order" />
        <input type="button" id="switchButton" value="Remove List Background" />
      </span>
      <h3>Sortable List</h3>
      <p>
In the sortable list example, we extend DDProxy instead of DD
so that we can use the source element as the "insertion point". 
When the drag starts, the proxy element style and content is
adjusted to match the source element, and visibility:hidden is
applied to the source element.</p>
<p>
To facilitate dragging into an empty list, we make the two list
elements DDTargets.  When interacting with the list item, we
will get two notifications (one for the list, one for the list
item).  We ignore all dragOver events that happen on the list 
and ignore all dragDrop events unless the drop was in the 
list's white space (not over another list item).
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
 
