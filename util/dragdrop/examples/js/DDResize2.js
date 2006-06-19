
/* Copyright (c) 2006 Yahoo! Inc. All rights reserved. */

/**
 * @extends YAHOO.util.DragDrop
 * @constructor
 * @param {String} handle the id of the element that will cause the resize
 * @param {String} panel id of the element to resize
 * @param {String} sGroup the group of related DragDrop items
 */
YAHOO.example.DDResize = function(panelElId, nwHandle, 
        neHandle, seHandle, swHandle, sGroup, config) {
    if (panelElId) {
        this.init(panelElId, sGroup, config);
        this.nwHandle = nwHandle;
        this.neHandle = neHandle;
        this.seHandle = seHandle;
        this.swHandle = swHandle;
        this.setHandleElId(nwHandle);
        this.setHandleElId(neHandle);
        this.setHandleElId(seHandle);
        this.setHandleElId(swHandle);
        this.logger = this.logger || YAHOO;
    }
};

// YAHOO.example.DDResize.prototype = new YAHOO.util.DragDrop();
YAHOO.extend(YAHOO.example.DDResize, YAHOO.util.DragDrop);

YAHOO.example.DDResize.prototype.lockAspectRatio = false;

YAHOO.example.DDResize.prototype.onMouseDown = function(e) {
    var panel = this.getEl();
    this.startWidth = panel.offsetWidth;
    this.startHeight = panel.offsetHeight;
    this.panelStartPos = YAHOO.util.Dom.getXY(panel);

    this.aspectRatio = this.startWidth/this.startHeight;
    this.direction = this.getDirection(YAHOO.util.Event.getTarget(e, true).id);
    this.logger.log("direction " + this.direction);

    this.startPos = [YAHOO.util.Event.getPageX(e),
                     YAHOO.util.Event.getPageY(e)];
};

YAHOO.example.DDResize.prototype.onDrag = function(e) {
    var newPos = [YAHOO.util.Event.getPageX(e),
                  YAHOO.util.Event.getPageY(e)];

    var offsetX = newPos[0] - this.startPos[0];
    var offsetY = (this.lockAspectRatio) ? offsetX : newPos[1] - this.startPos[1];

    var newWidth = Math.max(this.startWidth + offsetX, 10);
    var newHeight = Math.max(this.startHeight + offsetY, 10);

    var panel = this.getEl();


    var panelPos = YAHOO.util.Dom.getXY(panel);
    var movePos = [this.panelStartPos[0], this.panelStartPos[1]];
    var doMove = false;

    if (this.direction == "nw" || this.direction == "sw") {
        movePos[0] = this.panelStartPos[0] + offsetX;
        newWidth = Math.max(this.startWidth - offsetX, 10);
        doMove = true;
    }

    if (this.direction == "ne" || this.direction == "nw") {
        offsetY = newPos[1] - this.startPos[1];
        offsetX = offsetY;
        movePos[1] = this.panelStartPos[1] + offsetY;
        newHeight = Math.max(this.startHeight - offsetY, 10);
        newWidth = Math.max(this.startWidth - offsetX, 10);
        doMove = true;
    }


    switch (this.direction) {
        case "nw":
            
    }


    if (doMove) {
        YAHOO.util.Dom.setXY(panel, movePos);
    }

    panel.style.width = newWidth + "px";
    panel.style.height = newHeight + "px";
};

YAHOO.example.DDResize.prototype.getDirection = function(handle) {
    if (handle == this.nwHandle) {
        return "nw";
    } else if (handle == this.neHandle) {
        return "ne";
    } else if (handle == this.seHandle) {
        return "se";
    } else if (handle == this.swHandle) {
        return "sw";
    } else {
        return null;
    }
}

