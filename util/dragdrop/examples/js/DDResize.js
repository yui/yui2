
/* Copyright (c) 2006 Yahoo! Inc. All rights reserved. */

/**
 * @extends YAHOO.util.DragDrop
 * @constructor
 * @param {String} handle the id of the element that will cause the resize
 * @param {String} panel id of the element to resize
 * @param {String} sGroup the group of related DragDrop items
 */
YAHOO.example.DDResize = function(panelElId, handleElId, sGroup, config) {
    if (panelElId) {
        this.init(panelElId, sGroup, config);
        this.handleElId = handleElId;
        this.setHandleElId(handleElId);
        this.logger = this.logger || YAHOO;
    }
};

// YAHOO.example.DDResize.prototype = new YAHOO.util.DragDrop();
YAHOO.extend(YAHOO.example.DDResize, YAHOO.util.DragDrop);

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

