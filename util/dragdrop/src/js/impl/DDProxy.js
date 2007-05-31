/**
 * A DragDrop implementation that inserts an empty, bordered div into
 * the document that follows the cursor during drag operations.  At the time of
 * the click, the frame div is resized to the dimensions of the linked html
 * element, and moved to the exact location of the linked element.
 *
 * References to the "frame" element refer to the single proxy element that
 * was created to be dragged in place of all DDProxy elements on the
 * page.
 *
 * @class DDProxy
 * @extends YAHOO.util.DD
 * @constructor
 * @param {String} id the id of the linked html element
 * @param {String} sGroup the group of related DragDrop objects
 * @param {object} config an object containing configurable attributes
 *                Valid properties for DDProxy in addition to those in DragDrop: 
 *                   resizeFrame, centerFrame, dragElId
 */
YAHOO.util.DDProxy = function(id, sGroup, config) {
    if (id) {
        this.init(id, sGroup, config);
        this.initFrame(); 
    }
};

/**
 * The default drag frame div id
 * @property YAHOO.util.DDProxy.dragElId
 * @type String
 * @static
 */
YAHOO.util.DDProxy.dragElId = "ygddfdiv";

YAHOO.extend(YAHOO.util.DDProxy, YAHOO.util.DD, {

    /**
     * By default we resize the drag frame to be the same size as the element
     * we want to drag (this is to get the frame effect).  We can turn it off
     * if we want a different behavior.
     * @property resizeFrame
     * @type boolean
     */
    resizeFrame: true,

    /**
     * By default the frame is positioned exactly where the drag element is, so
     * we use the cursor offset provided by YAHOO.util.DD.  Another option that works only if
     * you do not have constraints on the obj is to have the drag frame centered
     * around the cursor.  Set centerFrame to true for this effect.
     * @property centerFrame
     * @type boolean
     */
    centerFrame: false,

    /**
     * Creates the proxy element if it does not yet exist
     * @method createFrame
     */
    createFrame: function() {
        var self = this;
        var body = document.body;

        if (!body || !body.firstChild) {
            setTimeout( function() { self.createFrame(); }, 50 );
            return;
        }

        var div = this.getDragEl();

        if (!div) {
            div    = document.createElement("div");
            div.id = this.dragElId;
            var s  = div.style;

            s.position   = "absolute";
            s.visibility = "hidden";
            s.cursor     = "move";
            s.border     = "2px solid #aaa";
            s.zIndex     = 999;

            // appendChild can blow up IE if invoked prior to the window load event
            // while rendering a table.  It is possible there are other scenarios 
            // that would cause this to happen as well.
            body.insertBefore(div, body.firstChild);
        }
    },

    /**
     * Initialization for the drag frame element.  Must be called in the
     * constructor of all subclasses
     * @method initFrame
     */
    initFrame: function() {
        this.createFrame();
    },

    applyConfig: function() {
        //this.logger.log("DDProxy applyConfig");
        YAHOO.util.DDProxy.superclass.applyConfig.call(this);

        this.resizeFrame = (this.config.resizeFrame !== false);
        this.centerFrame = (this.config.centerFrame);
        this.setDragElId(this.config.dragElId || YAHOO.util.DDProxy.dragElId);
    },

    /**
     * Resizes the drag frame to the dimensions of the clicked object, positions 
     * it over the object, and finally displays it
     * @method showFrame
     * @param {int} iPageX X click position
     * @param {int} iPageY Y click position
     * @private
     */
    showFrame: function(iPageX, iPageY) {
        var el = this.getEl();
        var dragEl = this.getDragEl();
        var s = dragEl.style;

        this._resizeProxy();

        if (this.centerFrame) {
            this.setDelta( Math.round(parseInt(s.width,  10)/2), 
                           Math.round(parseInt(s.height, 10)/2) );
        }

        this.setDragElPos(iPageX, iPageY);

        YAHOO.util.Dom.setStyle(dragEl, "visibility", "visible"); 
    },

    /**
     * The proxy is automatically resized to the dimensions of the linked
     * element when a drag is initiated, unless resizeFrame is set to false
     * @method _resizeProxy
     * @private
     */
    _resizeProxy: function() {
        if (this.resizeFrame) {
            var DOM    = YAHOO.util.Dom;
            var el     = this.getEl();
            var dragEl = this.getDragEl();

            var bt = parseInt( DOM.getStyle(dragEl, "borderTopWidth"    ), 10);
            var br = parseInt( DOM.getStyle(dragEl, "borderRightWidth"  ), 10);
            var bb = parseInt( DOM.getStyle(dragEl, "borderBottomWidth" ), 10);
            var bl = parseInt( DOM.getStyle(dragEl, "borderLeftWidth"   ), 10);

            if (isNaN(bt)) { bt = 0; }
            if (isNaN(br)) { br = 0; }
            if (isNaN(bb)) { bb = 0; }
            if (isNaN(bl)) { bl = 0; }

            this.logger.log("proxy size: " + bt + "  " + br + " " + bb + " " + bl);

            var newWidth  = Math.max(0, el.offsetWidth  - br - bl);                                                                                           
            var newHeight = Math.max(0, el.offsetHeight - bt - bb);

            this.logger.log("Resizing proxy element");

            DOM.setStyle( dragEl, "width",  newWidth  + "px" );
            DOM.setStyle( dragEl, "height", newHeight + "px" );
        }
    },

    // overrides YAHOO.util.DragDrop
    b4MouseDown: function(e) {
        this.setStartPosition();
        var x = YAHOO.util.Event.getPageX(e);
        var y = YAHOO.util.Event.getPageY(e);
        this.autoOffset(x, y);

        // This causes the autoscroll code to kick off, which means autoscroll can
        // happen prior to the check for a valid drag handle.
        // this.setDragElPos(x, y);
    },

    // overrides YAHOO.util.DragDrop
    b4StartDrag: function(x, y) {
        // show the drag frame
        this.logger.log("start drag show frame, x: " + x + ", y: " + y);
        this.showFrame(x, y);
    },

    // overrides YAHOO.util.DragDrop
    b4EndDrag: function(e) {
        this.logger.log(this.id + " b4EndDrag");
        YAHOO.util.Dom.setStyle(this.getDragEl(), "visibility", "hidden"); 
    },

    // overrides YAHOO.util.DragDrop
    // By default we try to move the element to the last location of the frame.  
    // This is so that the default behavior mirrors that of YAHOO.util.DD.  
    endDrag: function(e) {
        var DOM = YAHOO.util.Dom;
        this.logger.log(this.id + " endDrag");
        var lel = this.getEl();
        var del = this.getDragEl();

        // Show the drag frame briefly so we can get its position
        // del.style.visibility = "";
        DOM.setStyle(del, "visibility", ""); 

        // Hide the linked element before the move to get around a Safari 
        // rendering bug.
        //lel.style.visibility = "hidden";
        DOM.setStyle(lel, "visibility", "hidden"); 
        YAHOO.util.DDM.moveToEl(lel, del);
        //del.style.visibility = "hidden";
        DOM.setStyle(del, "visibility", "hidden"); 
        //lel.style.visibility = "";
        DOM.setStyle(lel, "visibility", ""); 
    },

    toString: function() {
        return ("DDProxy " + this.id);
    }

});
