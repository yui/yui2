
/* Copyright (c) 2006 Yahoo! Inc. All rights reserved. */

/**
 * @class a YAHOO.util.DDProxy implementation. During the drag over event, the
 * dragged element is inserted before the dragged-over element.
 *
 * @extends YAHOO.util.DDProxy
 * @constructor
 * @param {String} id the id of the linked element
 * @param {String} sGroup the group of related DragDrop objects
 */
function ygDDList(id, sGroup) {

	if (id) {
		this.init(id, sGroup);
		this.initFrame();
		this.logger = new ygLogger("ygDDList");
	}

	var s = this.getDragEl().style;
	s.borderColor = "transparent";
	s.backgroundColor = "#f6f5e5";
	s.opacity = 0.76;
	s.filter = "alpha(opacity=76)";
}

ygDDList.prototype = new YAHOO.util.DDProxy();

ygDDList.prototype.startDrag = function(x, y) {
	this.logger.debug(this.id + " startDrag");

	var dragEl = this.getDragEl();
	var clickEl = this.getEl();

	dragEl.innerHTML = clickEl.innerHTML;
	dragEl.className = clickEl.className;
	dragEl.style.color = clickEl.style.color;
	dragEl.style.border = "1px solid blue";

};

ygDDList.prototype.endDrag = function(e) {
	// disable moving the linked element
};

ygDDList.prototype.onDrag = function(e, id) {
    
};

ygDDList.prototype.onDragOver = function(e, id) {
	// this.logger.debug(this.id.toString() + " onDragOver " + id);
	var el;
    
    if ("string" == typeof id) {
        el = YAHOO.util.DDM.getElement(id);
    } else { 
        el = YAHOO.util.DDM.getBestMatch(id).getEl();
    }

	
	var mid = YAHOO.util.DDM.getPosY(el) + ( Math.floor(el.offsetLeft / 2));
    this.logger.debug("mid: " + mid);

	if (YAHOO.util.Event.getPageY(e) < mid) {
		var el2 = this.getEl();
		var p = el.parentNode;
		p.insertBefore(el2, el);
	}
};

ygDDList.prototype.onDragEnter = function(e, id) {
	// this.logger.debug(this.id.toString() + " onDragEnter " + id);
	// this.getDragEl().style.border = "1px solid #449629";
};

ygDDList.prototype.onDragOut = function(e, id) {
    // I need to know when we are over nothing
	// this.getDragEl().style.border = "1px solid #964428";
}

/////////////////////////////////////////////////////////////////////////////

function ygDDListBoundary(id, sGroup) {
	if (id) {
		this.init(id, sGroup);
		this.logger = new ygLogger("ygDDListBoundary");
		this.isBoundary = true;
	}
}

ygDDListBoundary.prototype = new YAHOO.util.DDTarget();
