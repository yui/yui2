/* Copyright (c) 2006 Yahoo! Inc. All rights reserved. */

function ygDDStack(id, sGroup) {
	if (id) {
		this.init(id, sGroup);
		this.initFrame();
		this.logger = new ygLogger("ygDDPlayer");
	}
}

ygDDStack.prototype = new YAHOO.util.DDTarget();

ygDDPlayer.TYPE = "ygDDPlayer";

/**
 * @class a YAHOO.util.DDFramed implementation. During the drag over event, the
 * dragged element is inserted before the dragged-over element.
 *
 * @extends YAHOO.util.DDProxy
 * @constructor
 * @param {String} id the id of the linked element
 * @param {String} sGroup the group of related DragDrop objects
 */
function ygDDPlayer(id, sGroup) {
    this.initPlayer(id, sGroup);
}

ygDDPlayer.prototype = new YAHOO.util.DDProxy();

ygDDPlayer.prototype.initPlayer = function(id, sGroup) {
	if (!id) { return; }

    this.init(id, sGroup);
    this.initFrame();
    this.logger = new ygLogger("ygDDPlayer");
    var s = this.getDragEl().style;
    s.borderColor = "transparent";
    // s.backgroundColor = "#cccccc";
    s.opacity = 0.76;
    s.filter = "alpha(opacity=76)";

    // specify that this is not currently a drop target
    this.isTarget = false;

    this.originalStyles = [];

    this.type = ygDDPlayer.TYPE;
    this.slot = null;

    this.startPos = YAHOO.util.Dom.getXY( this.getEl() );
    this.logger.debug(id + " startpos: " + this.startPos);
}

ygDDPlayer.prototype.startDrag = function(x, y) {
	this.logger.debug(this.id + " startDrag");

	var dragEl = this.getDragEl();
	var clickEl = this.getEl();

	dragEl.innerHTML = clickEl.innerHTML;
	dragEl.className = clickEl.className;
	dragEl.style.color = clickEl.style.color;
	dragEl.style.backgroundColor = clickEl.style.backgroundColor;

	var s = clickEl.style;
	s.opacity = .1;
	s.filter = "alpha(opacity=10)";

	var targets = YAHOO.util.DDM.getRelated(this, true);
	this.logger.debug(targets.length + " targets");
	for (var i=0; i<targets.length; i++) {
		
		var targetEl = this.getTargetDomRef(targets[i]);

		if (!this.originalStyles[targetEl.id]) {
			this.originalStyles[targetEl.id] = targetEl.className;
		}

		targetEl.className = "target";
	}
};

ygDDPlayer.prototype.getTargetDomRef = function(oDD) {
	if (oDD.player) {
		return oDD.player.getEl();
	} else {
		return oDD.getEl();
	}
};

ygDDPlayer.prototype.endDrag = function(e) {
	// reset the linked element styles
	var s = this.getEl().style;
	s.opacity = 1;
	s.filter = "alpha(opacity=100)";

	this.resetTargets();
};

ygDDPlayer.prototype.resetTargets = function() {

	// reset the target styles
	var targets = YAHOO.util.DDM.getRelated(this, true);
	for (var i=0; i<targets.length; i++) {
		var targetEl = this.getTargetDomRef(targets[i]);
		var oldStyle = this.originalStyles[targetEl.id];
		if (oldStyle) {
			targetEl.className = oldStyle;
		}
	}
};

ygDDPlayer.prototype.onDragDrop = function(e, id) {
	// get the drag and drop object that was targeted
	var oDD;
    
    if ("string" == typeof id) {
        oDD = YAHOO.util.DDM.getDDById(id);
    } else {
        oDD = YAHOO.util.DDM.getBestMatch(id);
    }

	var el = this.getEl();

	// check if the slot has a player in it already
	if (oDD.player) {
		// check if the dragged player was already in a slot
		if (this.slot) {
			// check to see if the player that is already in the
			// slot can go to the slot the dragged player is in
			// YAHOO.util.DDM.isLegalTarget is a new method
			if ( YAHOO.util.DDM.isLegalTarget(oDD.player, this.slot) ) {
				this.logger.debug("swapping player positions");
				YAHOO.util.DDM.moveToEl(oDD.player.getEl(), el);
				this.slot.player = oDD.player;
				oDD.player.slot = this.slot;
			} else {
				this.logger.debug("moving player in slot back to start");
				YAHOO.util.Dom.setXY(oDD.player.getEl(), oDD.player.startPos);
				this.slot.player = null;
				oDD.player.slot = null
			}
		} else {
			// the player in the slot will be moved to the dragged
			// players start position
			oDD.player.slot = null;
			YAHOO.util.DDM.moveToEl(oDD.player.getEl(), el);
		}
	} else {
		// Move the player into the emply slot
		// I may be moving off a slot so I need to clear the player ref
		if (this.slot) {
			this.slot.player = null;
		}
	}

	YAHOO.util.DDM.moveToEl(el, oDD.getEl());
	this.resetTargets();

	this.slot = oDD;
	this.slot.player = this;
};

ygDDPlayer.prototype.swap = function(el1, el2) {
    var dom = YAHOO.util.Dom;
	var pos1 = dom.getXY(el1);
	var pos2 = dom.getXY(el2);
	dom.setXY(el1, pos2);
	dom.setXY(el2, pos1);
};

ygDDPlayer.prototype.onDragOver = function(e, id) {};

ygDDPlayer.prototype.onDrag = function(e, id) {};
