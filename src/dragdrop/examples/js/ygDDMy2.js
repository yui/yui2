
/* Copyright (c) 2006 Yahoo! Inc. All rights reserved. */

/**
 * @class a ygDDFramed implementation like ygDDMy, but the content channels are
 * not restricted to one column, and we drag a miniature representation of the
 * content channel rather than a frame of the channel.
 *
 * @extends YAHOO.util.DDProxy
 * @constructor
 * @param {String} id the id of the linked element
 * @param {String} sGroup the group of related DragDrop objects
 */
function ygDDMy2(id, sGroup) {

	if (id) {
		this.init(id, sGroup);
		this.initFrame();
		this.logger = new ygLogger("ygDDMy2");
	}

	// Change the style of the frame to be a miniature representation of a
	// content channel
	var s = this.getDragEl().style;
	s.background = "url(img/channel.png) 0 0 no-repeat";
	s.height = "92px";
	s.width = "100px";
	// s.opacity = 0.66;
	// s.filter = "alpha(opacity=66)";

	// Specify that we do not want to resize the drag frame... we want to keep
	// the drag frame the size of our miniature content channel image
	this.resizeFrame = false;

	// Specify that we want the drag frame centered around the cursor rather 
	// than relative to the click location so that the miniature content
	// channel appears in the location that was clicked
	this.centerFrame = true;
}

ygDDMy2.prototype = new YAHOO.util.DDProxy();

ygDDMy2.prototype.onDragDrop = function(e, id) {
	this.logger.debug(this.id + " onDragDrop");

    var el;
    if ("string" == typeof id) {
        el = YAHOO.util.DDM.getElement(id);
    } else {
        el = YAHOO.util.DDM.getBestMatch(id).getEl();
    }

	YAHOO.util.DDM.swapNode(this.getEl(), el);
};

ygDDMy2.prototype.endDrag = function(e) {
	// we default behavior is to move the element to the end point when
	// the drag is ended.  In our case, we only want to move the element
	// when it is dropped on another dd element.  To override the default,
	// we simply need to create an empty endDrag function.
};
