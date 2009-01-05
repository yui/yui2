
/* Copyright (c) 2006 Yahoo! Inc. All rights reserved. */

/**
 * @class a DragDrop implementation that moves the object as it is being dragged,
 * and keeps the object being dragged on top.  This is a subclass of ygDD rather
 * than DragDrop, and inherits the implementation of most of the event listeners
 * from that class.
 *
 * @extends ygDD
 * @constructor
 * @param {String} id the id of the linked element
 * @param {String} sGroup the group of related DragDrop items
 */
function ygDDOnTop(id, sGroup) {
	if (id) {
		this.init(id, sGroup);
		this.logger = new ygLogger("ygDDOnTop");
	}
}

ygDDOnTop.prototype = new YAHOO.util.DD();

/**
 * The inital z-index of the element, stored so we can restore it later
 *
 * @type int
 */
ygDDOnTop.prototype.origZ = 0;

ygDDOnTop.prototype.startDrag = function(x, y) {
	this.logger.debug(this.id + " startDrag");

	var style = this.getEl().style;

	// store the original z-index
	this.origZ = style.zIndex;

	// The z-index needs to be set very high so the element will indeed be on top
	style.zIndex = 999;
}

ygDDOnTop.prototype.endDrag = function(e) {
	this.logger.debug(this.id + " endDrag");

	// restore the original z-index
	this.getEl().style.zIndex = this.origZ;
};
