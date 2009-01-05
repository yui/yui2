<?php
$templateRelativePath = '.';
include('inc/inc-top.php');
?>
<style type="text/css">

div.workarea { padding:10px; float:left }

div.workarea li {
    margin: 1px;
    cursor: move; 
    zoom:1;
}

ul.draglist { 
    position: relative;
    width: 200px; 
    height:240px;
    background: #f7f7f7;
    border: 1px solid gray;
    list-style: none;
    margin:0;
    padding:0;
    overflow:auto;
}

ul.draglist_scroll { 
    position: relative;
    width: 200px; 
    height:140px;
    background: #f7f7f7;
    border: 1px solid gray;
    list-style: none;
    margin:0;
    padding:0;
    overflow:auto;
}

ul.draglist_shrinkwrap { 
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
    padding-bottom:30px;
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

<?php include('inc/inc-alljs.php'); ?>
<script type="text/javascript" src="../../build/animation/animation-min.js"></script>
<script type="text/javascript">

(function() {

var Dom = YAHOO.util.Dom;
var Event = YAHOO.util.Event;
var DDM = YAHOO.util.DragDropMgr;

//////////////////////////////////////////////////////////////////////////////
// example app
//////////////////////////////////////////////////////////////////////////////
YAHOO.example.DDApp = {
    init: function() {

        var rows=9,cols=2,i,j;
        for (i=1;i<cols+1;i=i+1) {
            new YAHOO.util.DDTarget("ul"+i);
        }

        for (i=1;i<cols+1;i=i+1) {
            for (j=1;j<rows+1;j=j+1) {
                var dd=new YAHOO.example.DDList("li" + i + "_" + j);
                dd.addInvalidHandleType("input");
            }
        }

        Event.on("showButton", "click", this.showOrder);
        Event.on("switchButton", "click", this.switchStyles);
    },

    showOrder: function() {
        var parseList = function(ul, title) {
            var items = ul.getElementsByTagName("li");
            var out = title + ": ";
            for (i=0;i<items.length;i=i+1) {
                out += items[i].id + " ";
            }
            return out;
        };

        var ul1=Dom.get("ul1"), ul2=Dom.get("ul2");
        alert(parseList(ul1, "List 1") + "\n" + parseList(ul2, "List 2"));

    },

    switchStyles: function() {
        Dom.get("ul1").className = "draglist_alt";
        Dom.get("ul2").className = "draglist_alt";
    }
};

//////////////////////////////////////////////////////////////////////////////
// custom drag and drop implementation
//////////////////////////////////////////////////////////////////////////////

YAHOO.example.DDList = function(id, sGroup, config) {

    YAHOO.example.DDList.superclass.constructor.call(this, id, sGroup, config);

    this.logger = this.logger || YAHOO;
    var el = this.getDragEl();
    Dom.setStyle(el, "opacity", 0.67); // The proxy is slightly transparent

    this.goingUp = false;
    this.lastY = 0;
};

YAHOO.extend(YAHOO.example.DDList, YAHOO.util.DDProxy, {

    scrub: function(s) {
        return s.replace(/\s(id|name)=[^\s>]*/gi, "");
    },

    startDrag: function(x, y) {
        this.logger.log(this.id + " startDrag");

        // make the proxy look like the source element
        var dragEl = this.getDragEl();
        var clickEl = this.getEl();
        Dom.setStyle(clickEl, "visibility", "hidden");

        var html= this.scrub(clickEl.innerHTML);
        //var html= clickEl.innerHTML;
        dragEl.innerHTML = html;
        //alert(html);

        Dom.setStyle(dragEl, "color", Dom.getStyle(clickEl, "color"));
        Dom.setStyle(dragEl, "backgroundColor", Dom.getStyle(clickEl, "backgroundColor"));
        Dom.setStyle(dragEl, "border", "2px solid gray");
    },

    endDrag: function(e) {

        var srcEl = this.getEl();
        var proxy = this.getDragEl();

        // Show the proxy element and animate it to the src element's location
        Dom.setStyle(proxy, "visibility", "");
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
        var thisid = this.id;

        // Hide the proxy and show the source element when finished with the animation
        a.onComplete.subscribe(function() {
                Dom.setStyle(proxyid, "visibility", "hidden");
                Dom.setStyle(thisid, "visibility", "");
            });
        a.animate();
    },

    onDragDrop: function(e, id) {

        // If there is one drop interaction, the li was dropped either on the list,
        // or it was dropped on the current location of the source element.
        if (DDM.interactionInfo.drop.length === 1) {

            var destDD = DDM.getDDById(id);
            var destEl = destDD.getEl();

            // An extra check to verify that we are really dropping on the list,
            // needed in order to support scrolling lists.
            if (destEl.tagName.toLowerCase() != "li") {

                // The position of the cursor at the time of the drop (YAHOO.util.Point)
                var pt = DDM.interactionInfo.point; 

                // The region occupied by the source element at the time of the drop
                var region = DDM.interactionInfo.sourceRegion; 

                // Check to see if we are over the source element's location.  We will
                // append to the bottom of the list once we are sure it was a drop in
                // the negative space (the area of the list without any list items)
                if (!region.intersect(pt)) {
                    destEl.appendChild(this.getEl());
                    destDD.isEmpty = false;
                    DDM.refreshCache();
                }
            }

        }
    },

    onDrag: function(e) {

        // Keep track of the direction of the drag for use during onDragOver
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

        // We are only concerned with list items, we ignore the dragover
        // notifications for the list.
        if (destEl.nodeName.toLowerCase() == "li") {
            var orig_p = srcEl.parentNode;
            var p = destEl.parentNode;

            var y = Event.getPageY(e);
            var p_region = Dom.getRegion(p);

            // only process if we are operating within the visible section of the list
            if (y > p_region.top && y < p_region.bottom) {
                if (this.goingUp) {
                    p.insertBefore(srcEl, destEl); // insert above
                } else {
                    p.insertBefore(srcEl, destEl.nextSibling); // insert below
                }

                DDM.refreshCache();
            }
        }
    }
});

Event.onDOMReady(YAHOO.example.DDApp.init, YAHOO.example.DDApp, true);

})();

</script>

<body>

<div id="pageTitle"><h3>Drag and Drop - DDProxy</h3></div>
  <?php include('inc/inc-rightbar.php'); ?>
  <div id="content">
    <form name="dragDropForm" action="javscript:;">
    <div class="newsItem">
      <span id="user_actions">
        <input type="button" id="showButton" value="Show Current Order" />
        <input type="button" id="switchButton" value="Show Scrolling List" />
        
      </span>
      <h3>Sortable List - POINT mode</h3>
        <p>
        In the sortable list example, we extend DDProxy instead of DD
        so that we can use the source element as the "insertion point". 
        When the drag starts, the proxy element style and content is
        adjusted to match the source element, and visibility:hidden is
        applied to the source element.
        </p><p>
        To facilitate dragging into an empty list, we make the two list
        elements DDTargets.  When interacting with the list items, we
        will get two notifications (one for the list, one for the list
        item).  We ignore all dragOver events that happen on the list 
        and ignore all dragDrop events unless the drop was in the 
        list's negative space (not over another list item).
        </p>

      <div class="workarea">
        <h3>List 1</h3>
        <ul id="ul1" class="draglist">
          <li class="list1" id="li1_1"><input type="radio" id="lir1_1"></input>list 1, item 1</li>
          <li class="list1" id="li1_2">list 1, item 2</li>
          <li class="list1" id="li1_3">list 1, item 3</li>
          <li class="list1" id="li1_4">list 1, item 4</li>
          <li class="list1" id="li1_5">list 1, item 5</li>
          <li class="list1" id="li1_6">list 1, item 6</li>
          <li class="list1" id="li1_7">list 1, item 7</li>
          <li class="list1" id="li1_8">list 1, item 8</li>
          <li class="list1" id="li1_9">list 1, item 9</li>
        </ul>
      </div>

      <div class="workarea">
        <h3>List 2</h3>
        <ul id="ul2" class="draglist">
          <li class="list2" id="li2_1">list 2, item 1</li>
          <li class="list2" id="li2_2">list 2, item 2</li>
          <li class="list2" id="li2_3">list 2, item 3</li>
          <li class="list2" id="li2_4">list 2, item 4</li>
          <li class="list2" id="li2_5">list 2, item 5</li>
          <li class="list2" id="li2_6">list 2, item 6</li>
          <li class="list2" id="li2_7">list 2, item 7</li>
          <li class="list2" id="li2_8">list 2, item 8</li>
          <li class="list2" id="li2_9">list 2, item 9</li>
        </ul>
      </div>

    </div>
    </form>
  </div>
  <?php include('inc/inc-bottom.php'); ?>
  </body>
</html>
 
