
/* Copyright (c) 2006 Yahoo! Inc. All rights reserved. */

/**
 * @class a ygDDFramed implementation that swaps positions with the target when
 * dropped
 *
 * @extends YAHOO.util.DDProxy
 * @constructor
 * @param {String} id the id of the linked element
 * @param {String} sGroup the group of related DragDrop items
 */
function ygDDSwap(id, sGroup) {
    this.swapInit(id, sGroup);
}

ygDDSwap.prototype = new YAHOO.util.DDProxy();

ygDDSwap.prototype.swapInit = function(id, sGroup) {
	if (!id) { return; }

    this.init(id, sGroup);
    this.initFrame();
    this.logger = new ygLogger("ygDDSwap");

    /**
     * css style to use when items are not being hovered over.
     */
    this.offClass = "testSquare";

    /**
     * css style to use when hovered over
     */
    this.onClass = "testSquareOn";

    /**
     * cache of the elements we have changed the style so we can restore it
     * later
     */
    this.els = [];

};

ygDDSwap.prototype.onDragDrop = function(e, id) {
    this.swap(this.getEl(), YAHOO.util.DDM.getElement(id));
};

ygDDSwap.prototype.swap = function(el1, el2) {
	this.logger.debug(this.id + " onDragDrop swap");

	// Swap out the position of the two objects.  This only works for absolutely
	// positioned elements.  See {@link ygDDMy} for an implementation that 
	// works for relatively positioned elements
	var s1 = el1.style;
	var s2 = el2.style;

	var l = s1.left;
	var t = s1.top;

	s1.left = s2.left;
	s1.top = s2.top;

	s2.left = l;
	s2.top = t;
};

ygDDSwap.prototype.onDragEnter = function(e, id) {
	this.logger.debug(this.id + " dragEnter " + id);

	// store a ref so we can restore the style later
	this.els[id] = true;

	// set the mouseover style
	var el = YAHOO.util.DDM.getElement(id);
	if (el.className != this.onClass) {
		el.className = this.onClass;
	}
};

ygDDSwap.prototype.onDragOut = function(e, id) {
	this.logger.debug(this.id + " dragOut " + id);

	// restore the style
	YAHOO.util.DDM.getElement(id).className = this.offClass;
};

ygDDSwap.prototype.endDrag = function(e) {
	this.logger.debug(this.id + " endDrag");
    this.resetStyles();
};

ygDDSwap.prototype.resetStyles = function() {
	// restore all element styles
	for (var i in this.els) {
		var el = YAHOO.util.DDM.getElement(i);
		if (el) { 
			el.className = this.offClass;
		}
	}
};

ygDDSwap.prototype.onDrag = function(e) { };

ygDDSwap.prototype.onDragOver = function(e) { };


//-------------------------------------------------------------------------
// Intersect mode
//-------------------------------------------------------------------------


ygDDSwap_i.prototype = new ygDDSwap();

function ygDDSwap_i(id, sGroup) {
    this.swapInit(id, sGroup);
}

ygDDSwap_i.prototype.onDragDrop = function(e, dds) {
	// this.logger.debug(this.id + " onDragDrop swap");
    var dd = YAHOO.util.DDM.getBestMatch(dds);
    this.swap(this.getEl(), dd.getEl());
};

ygDDSwap_i.prototype.onDragEnter = function(e, dds) { };

ygDDSwap_i.prototype.onDragOver = function(e, dds) {
	// this.logger.debug(this.id + " dragEnter " + id);

    this.resetStyles();

    var dd = YAHOO.util.DDM.getBestMatch(dds);

    this.els[dd.id] = true;

    // set the mouseover style
    var el = dd.getEl();
    if (el.className != this.onClass) {
        el.className = this.onClass;
    }
};

ygDDSwap_i.prototype.onDragOut = function(e, dds) {
	// this.logger.debug(this.id + " dragOut " + id);

	// restore the style
    for (var i=0; i<dds.length; ++i) {
	    dds[i].getEl().className = this.offClass;
    }
};

