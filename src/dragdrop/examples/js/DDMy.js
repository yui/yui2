
/* Copyright (c) 2006 Yahoo! Inc. All rights reserved. */

/**
 * @class a ygDDFramed implementation where the frame only moves vertically, and
 * the DOM elements are swapped when one is dropped on another
 *
 * @extends YAHOO.util.DDProxy
 * @constructor
 * @param {String} id the id of the linked element
 * @param {String} sGroup the group of related DragDrop objects
 */
YAHOO.example.DDMy = function(id, sGroup, config) {

    if (id) {
        this.init(id, sGroup, config);
        this.initFrame();
        this.logger = this.logger || YAHOO;
    }

    // The frame should only move vertically...  this makes it so the user can
    // only move content channels up and down within a column
    this.setXConstraint(0, 0);
};

// YAHOO.example.DDMy.prototype = new YAHOO.util.DDProxy();
YAHOO.extend(YAHOO.example.DDMy, YAHOO.util.DDProxy);

YAHOO.example.DDMy.prototype.onDragDrop = function(e, id) {
    this.logger.log(this.id + " onDragDrop");

    var el;

    if ("string" == typeof id) {
        el = YAHOO.util.DDM.getElement(id);
    } else {
        el = YAHOO.util.DDM.getBestMatch(id).getEl();
    }

    YAHOO.util.DDM.swapNode(this.getEl(), el);
};

YAHOO.example.DDMy.prototype.endDrag = function(e) {
    // we default behavior is to move the element to the end point when
    // the drag is ended.  In our case, we only want to move the element
    // when it is dropped on another dd element.  To override the default,
    // we simply need to create an empty endDrag function.
};
