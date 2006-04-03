/* Copyright (c) 2006 Yahoo! Inc. All rights reserved. */

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
 * @extends YAHOO.util.DD
 * @constructor
 * @param {String} id the id of the linked html element
 * @param {String} sGroup the group of related DragDrop objects
 */
YAHOO.util.DDProxy = function(id, sGroup) {
    if (id) {
        this.forceCssPosition = false;

        this.init(id, sGroup);
        this.initFrame(); 
        this.logger.setModuleName("DDProxy");
    }
};

YAHOO.util.DDProxy.prototype = new YAHOO.util.DD();

/**
 * A reference to the one proxy div element we create for all instances of this 
 * class
 *
 * @type HTMLElement
 */
YAHOO.util.DDProxy.frameDiv = null;

/**
 * the drag frame div id
 *
 * @type String
 */
YAHOO.util.DDProxy.dragElId = "ygddfdiv";

/**
 * The border width of the frame.  This is used when we resize the frame to
 * the size of the linked element.  We substract the border width to make
 * the div the correct size.
 *
 * @TODO find a better way to handle this
 *
 * @type int
 */
YAHOO.util.DDProxy.prototype.borderWidth = 2;

/**
 * By default we resize the drag frame to be the same size as the element
 * we want to drag (this is to get the frame effect).  We can turn it off
 * if we want a different behavior (ex: ygDDMy2)
 *
 * @type boolean
 */
YAHOO.util.DDProxy.prototype.resizeFrame = true;

/**
 * By default the frame is positioned exactly where the drag element is, so
 * we use the cursor offset provided by YAHOO.util.DD.  Another option that works only if
 * you do not have constraints on the obj is to have the drag frame centered
 * around the cursor.  Set centerFrame to true for this effect.  Ex: 
 * ygDDMy2
 *
 * @type boolean
 */
YAHOO.util.DDProxy.prototype.centerFrame = false;

/**
 * Create the drag frame if needed
 */
YAHOO.util.DDProxy.createFrame = function() {
    var THIS = YAHOO.util.DDProxy;

    if (!document || !document.body) {
        setTimeout(THIS.createFrame, 50);
        return;
    }

    if (!THIS.frameDiv) {
        THIS.frameDiv = document.createElement("div");
        THIS.frameDiv.id = THIS.dragElId;
        var s = THIS.frameDiv.style;
        s.position = "absolute";
        s.visibility = "hidden";
        s.cursor = "move";
        s.border = "2px solid #aaa";
        s.zIndex = 999;
        document.body.appendChild(THIS.frameDiv);

    }
};

/**
 * Initialization for the drag frame element.  Must be called in the
 * constructor of all subclasses
 */
YAHOO.util.DDProxy.prototype.initFrame = function() {
    YAHOO.util.DDProxy.createFrame();
    this.setDragElId(YAHOO.util.DDProxy.dragElId);
    this.useAbsMath = true;

};

/**
 * Resizes the drag frame to the dimensions of the clicked object, positions 
 * it over the object, and finally displays it
 *
 * @param {int} iPageX X click position
 * @param {int} iPageY Y click position
 * @private
 */
YAHOO.util.DDProxy.prototype.showFrame = function(iPageX, iPageY) {
    var el = this.getEl();

    var s = this.getDragEl().style;

    if (this.resizeFrame) {
        s.width = (parseInt(el.offsetWidth, 10) - (2*this.borderWidth)) + "px";
        s.height = (parseInt(el.offsetHeight, 10) - (2*this.borderWidth)) + "px";
    }

    if (this.centerFrame) {
        this.setDelta(Math.round(parseInt(s.width, 10)/2), 
                Math.round(parseInt(s.width, 10)/2));
    }

    this.setDragElPos(iPageX, iPageY);

    s.visibility = "";
};

// overrides YAHOO.util.DragDrop
YAHOO.util.DDProxy.prototype.b4MouseDown = function(e) {
    var x = YAHOO.util.Event.getPageX(e);
    var y = YAHOO.util.Event.getPageY(e);
    this.autoOffset(x, y);
    this.setDragElPos(x, y);
};

// overrides YAHOO.util.DragDrop
YAHOO.util.DDProxy.prototype.b4StartDrag = function(x, y) {
    // show the drag frame
    this.logger.debug("start drag show frame, x: " + x + ", y: " + y);
    this.showFrame(x, y);
};

// overrides YAHOO.util.DragDrop
YAHOO.util.DDProxy.prototype.b4EndDrag = function(e) {
    this.logger.debug(this.id + " b4EndDrag");

    // hide the drag frame
    var s = this.getDragEl().style;
    s.visibility = "hidden";
};

// overrides YAHOO.util.DragDrop
// By default we try to move the element to the last location of the frame.  
// This is so that the default behavior mirrors that of YAHOO.util.DD.  
YAHOO.util.DDProxy.prototype.endDrag = function(e) {
    this.logger.debug(this.id + " endDrag");
    var lel = this.getEl();
    var del = this.getDragEl();

    // Show the drag frame briefly so we can get its position
    del.style.visibility = "";

    // Hide the linked element before the move to get around a Safari 
    // rendering bug.
    lel.style.visibility = "hidden";
    YAHOO.util.DDM.moveToEl(lel, del);
    del.style.visibility = "hidden";
    lel.style.visibility = "";
};

