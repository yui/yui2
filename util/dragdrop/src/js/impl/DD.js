/* Copyright (c) 2006 Yahoo! Inc. All rights reserved. */

/**
 * A DragDrop implementation where the linked element follows the 
 * mouse cursor during a drag.
 *
 * @extends YAHOO.util.DragDrop
 * @constructor
 * @param {String} id the id of the linked element 
 * @param {String} sGroup the group of related DragDrop items
 */
YAHOO.util.DD = function(id, sGroup) {
    if (id) {
        this.init(id, sGroup);
        this.logger.setModuleName("DD");
    }
};

YAHOO.util.DD.prototype = new YAHOO.util.DragDrop();

/**
 * When set to true, the utility automatically tries to scroll the browser
 * window wehn a drag and drop element is dragged near the viewport boundary.
 * Defaults to true.
 *
 * @type boolean
 */
YAHOO.util.DD.prototype.scroll = true; 

/**
 * Sets the pointer offset to the distance between the linked element's top 
 * left corner and the location the element was clicked
 *
 * @param {int} iPageX the X coordinate of the click
 * @param {int} iPageY the Y coordinate of the click
 */
YAHOO.util.DD.prototype.autoOffset = function(iPageX, iPageY) {
    var el = this.getEl();
    var aCoord = YAHOO.util.Dom.getXY(el);
    var x = iPageX - aCoord[0];
    var y = iPageY - aCoord[1];
    this.setDelta(x, y);
    this.logger.debug("autoOffset el pos: " + aCoord + ", delta: " + x + "," + y);
};

/** 
 * Sets the pointer offset.  You can call this directly to force the offset to
 * be in a particular location (e.g., pass in 0,0 to set it to the center of the
 * object, as done in YAHOO.widget.Slider)
 *
 * @param {int} iDeltaX the distance from the left
 * @param {int} iDeltaY the distance from the top
 */
YAHOO.util.DD.prototype.setDelta = function(iDeltaX, iDeltaY) {
    this.deltaX = iDeltaX;
    this.deltaY = iDeltaY;
    this.logger.debug("deltaX:" + this.deltaX + ", deltaY:" + this.deltaY);
};

/**
 * Sets the drag element to the location of the mousedown or click event, 
 * maintaining the cursor location relative to the location on the element 
 * that was clicked.  Override this if you want to place the element in a 
 * location other than where the cursor is.
 *
 * @param {int} iPageX the X coordinate of the mousedown or drag event
 * @param {int} iPageY the Y coordinate of the mousedown or drag event
 */

YAHOO.util.DD.prototype.setDragElPos = function(iPageX, iPageY) {
    // the first time we do this, we are going to check to make sure
    // the element has css positioning

    var el = this.getDragEl();

    // if (!this.cssVerified) {
        // var pos = el.style.position;
        // this.logger.debug("drag element position: " + pos);
    // }

    this.alignElWithMouse(el, iPageX, iPageY);
};

/**
 * Sets the element to the location of the mousedown or click event, 
 * maintaining the cursor location relative to the location on the element 
 * that was clicked.  Override this if you want to place the element in a 
 * location other than where the cursor is.
 *
 * @param {HTMLElement} el the element to move
 * @param {int} iPageX the X coordinate of the mousedown or drag event
 * @param {int} iPageY the Y coordinate of the mousedown or drag event
 */
YAHOO.util.DD.prototype.alignElWithMouse = function(el, iPageX, iPageY) {
    var oCoord = this.getTargetCoord(iPageX, iPageY);
    var aCoord = [oCoord.x, oCoord.y];
    // this.logger.debug("****alignElWithMouse : " + el.id + ", " + aCoord + ", " + el.style.display);
    YAHOO.util.Dom.setXY(el, aCoord);

    this.cachePosition(oCoord.x, oCoord.y);

    this.autoScroll(oCoord.x, oCoord.y, el.offsetHeight, el.offsetWidth);
};

/**
 * Saves the most recent position so that we can reset the constraints and
 * tick marks on-demand.  We need to know this so that we can calculate the
 * number of pixels the element is offset from its original position.
 */
YAHOO.util.DD.prototype.cachePosition = function(iPageX, iPageY) {
    if (iPageX) {
        this.lastPageX = iPageX;
        this.lastPageY = iPageY;
    } else {
        var aCoord = YAHOO.util.Dom.getXY(this.getEl());
        this.lastPageX = aCoord[0];
        this.lastPageY = aCoord[1];
    }
};

/**
 * Auto-scroll the window if the dragged object has been moved beyond the 
 * visible window boundary.
 *
 * @param {int} x the drag element's x position
 * @param {int} y the drag element's y position
 * @param {int} h the height of the drag element
 * @param {int} w the width of the drag element
 * @private
 */
YAHOO.util.DD.prototype.autoScroll = function(x, y, h, w) {

    if (this.scroll) {
        // The client height
        var clientH = this.DDM.getClientHeight();

        // The client width
        var clientW = this.DDM.getClientWidth();

        // The amt scrolled down
        var st = this.DDM.getScrollTop();

        // The amt scrolled right
        var sl = this.DDM.getScrollLeft();

        // Location of the bottom of the element
        var bot = h + y;

        // Location of the right of the element
        var right = w + x;

        // The distance from the cursor to the bottom of the visible area, 
        // adjusted so that we don't scroll if the cursor is beyond the
        // element drag constraints
        var toBot = (clientH + st - y - this.deltaY);

        // The distance from the cursor to the right of the visible area
        var toRight = (clientW + sl - x - this.deltaX);

        // this.logger.debug( " x: " + x + " y: " + y + " h: " + h + 
        // " clientH: " + clientH + " clientW: " + clientW + 
        // " st: " + st + " sl: " + sl + " bot: " + bot + 
        // " right: " + right + " toBot: " + toBot + " toRight: " + toRight);

        // How close to the edge the cursor must be before we scroll
        // var thresh = (document.all) ? 100 : 40;
        var thresh = 40;

        // How many pixels to scroll per autoscroll op.  This helps to reduce 
        // clunky scrolling. IE is more sensitive about this ... it needs this 
        // value to be higher.
        var scrAmt = (document.all) ? 80 : 30;

        // Scroll down if we are near the bottom of the visible page and the 
        // obj extends below the crease
        if ( bot > clientH && toBot < thresh ) { 
            window.scrollTo(sl, st + scrAmt); 
        }

        // Scroll up if the window is scrolled down and the top of the object
        // goes above the top border
        if ( y < st && st > 0 && y - st < thresh ) { 
            window.scrollTo(sl, st - scrAmt); 
        }

        // Scroll right if the obj is beyond the right border and the cursor is
        // near the border.
        if ( right > clientW && toRight < thresh ) { 
            window.scrollTo(sl + scrAmt, st); 
        }

        // Scroll left if the window has been scrolled to the right and the obj
        // extends past the left border
        if ( x < sl && sl > 0 && x - sl < thresh ) { 
            window.scrollTo(sl - scrAmt, st);
        }
    }
};

/**
 * Finds the location the element should be placed if we want to move
 * it to where the mouse location less the click offset would place us.
 *
 * @param {int} iPageX the X coordinate of the click
 * @param {int} iPageY the Y coordinate of the click
 * @return an object that contains the coordinates (Object.x and Object.y)
 * @private
 */
YAHOO.util.DD.prototype.getTargetCoord = function(iPageX, iPageY) {

    // this.logger.debug("getTargetCoord: " + iPageX + ", " + iPageY);

    var x = iPageX - this.deltaX;
    var y = iPageY - this.deltaY;

    if (this.constrainX) {
        if (x < this.minX) { x = this.minX; }
        if (x > this.maxX) { x = this.maxX; }
    }

    if (this.constrainY) {
        if (y < this.minY) { y = this.minY; }
        if (y > this.maxY) { y = this.maxY; }
    }

    x = this.getTick(x, this.xTicks);
    y = this.getTick(y, this.yTicks);

    // this.logger.debug("getTargetCoord " + 
            // " iPageX: " + iPageX +
            // " iPageY: " + iPageY +
            // " x: " + x + ", y: " + y);

    return {x:x, y:y};
};

/** 
 * Event that fires prior to the onMouseDown event.  Overrides 
 * YAHOO.util.DragDrop.
 */
YAHOO.util.DD.prototype.b4MouseDown = function(e) {
    // this.resetConstraints();
    this.autoOffset(YAHOO.util.Event.getPageX(e), 
                        YAHOO.util.Event.getPageY(e));
};

/** 
 * Event that fires prior to the onDrag event.  Overrides 
 * YAHOO.util.DragDrop.
 */
YAHOO.util.DD.prototype.b4Drag = function(e) {
    this.setDragElPos(YAHOO.util.Event.getPageX(e), 
                        YAHOO.util.Event.getPageY(e));
};


///////////////////////////////////////////////////////////////////////////////
// Debugging ygDragDrop events that can be overridden
///////////////////////////////////////////////////////////////////////////////
/*
YAHOO.util.DD.prototype.startDrag = function(x, y) {
    this.logger.debug(this.id.toString()  + " startDrag");
};

YAHOO.util.DD.prototype.onDrag = function(e) {
    this.logger.debug(this.id.toString() + " onDrag");
};

YAHOO.util.DD.prototype.onDragEnter = function(e, id) {
    this.logger.debug(this.id.toString() + " onDragEnter: " + id);
};

YAHOO.util.DD.prototype.onDragOver = function(e, id) {
    this.logger.debug(this.id.toString() + " onDragOver: " + id);
};

YAHOO.util.DD.prototype.onDragOut = function(e, id) {
    this.logger.debug(this.id.toString() + " onDragOut: " + id);
};

YAHOO.util.DD.prototype.onDragDrop = function(e, id) {
    this.logger.debug(this.id.toString() + " onDragDrop: " + id);
};

YAHOO.util.DD.prototype.endDrag = function(e) {
    this.logger.debug(this.id.toString() + " endDrag");
};
*/

