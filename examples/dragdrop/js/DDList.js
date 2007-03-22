
(function() {

var Dom = YAHOO.util.Dom;
var Event = YAHOO.util.Event;
var DDM = YAHOO.util.DragDropMgr;

YAHOO.example.DDListItem = function(id, sGroup, config) {

    if (id) {
        this.init(id, sGroup, config);
        this.initFrame();
        this.logger = this.logger || YAHOO;
    }

    var el = this.getDragEl();
    Dom.setStyle(el, "opacity", 0.67);
    this.host= config && config.hostId;

    this.setPadding(-4);
    this.goingUp = false;
    this.lastY = 0;
};

YAHOO.extend(YAHOO.example.DDListItem, YAHOO.util.DDProxy, {

    startDrag: function(x, y) {
        this.logger.log(this.id + " startDrag");

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
            0.3, 
            YAHOO.util.Easing.easeOut 
        )
        var proxyid = proxy.id;
        var id = this.id;
        a.onComplete.subscribe(function() {
                Dom.setStyle(proxyid, "visibility", "hidden");
                Dom.setStyle(id, "visibility", "");
            });
        a.animate();
    },

    onDragDrop: function(e, id) {
        YAHOO.log("DROP: " + id, "warn");
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
        var destEl;

        if ("string" == typeof id) { // POINT mode
            destEl = Dom.get(id);
        } else { // INTERSECT mode
            destEl= YAHOO.util.DDM.getBestMatch(id).getEl();
        }

        var destDD = DDM.getDDById(destEl.id);

        if (destDD.isContainer) {

            if (this.isEmpty) {
                destEl.appendChild(this.getEl());
                this.isEmpty = false;
                DDM.refreshCache();
            }

        } else {

            var orig_p = srcEl.parentNode;
            var p = destEl.parentNode;

            //YAHOO.log("destEl: " + destEl.id, "error");
            //YAHOO.log("p: " + p.id, "error");

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
        return "DDListItem " + this.id;
    }

});


YAHOO.example.DDList = function(id, sGroup, config) {

    if (id) {
        this.initTarget(id, sGroup, config);
        this.logger = this.logger || YAHOO;
    }

    this.isContainer = true;
    this.isEmpty = false;

};

YAHOO.extend(YAHOO.example.DDList, YAHOO.util.DDProxy, {


});

})();
