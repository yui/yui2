/* Copyright (c) 2006 Yahoo! Inc. All rights reserved. */

/**
 * A DragDrop implementation that does not move, but can be a drop 
 * target.  You would get the same result by simply omitting implementation 
 * for the event callbacks, but this way we reduce the processing cost of the 
 * event listener and the callbacks.
 *
 * @extends YAHOO.util.DragDrop 
 * @constructor
 * @param {String} id the id of the element that is a drop target
 * @param {String} sGroup the group of related DragDrop objects
 */
 
YAHOO.util.DDTarget = function(id, sGroup) {
    if (id) {
        this.initTarget(id, sGroup);
        this.logger.setModuleName("DDTarget");
    }
};

YAHOO.util.DDTarget.prototype = new YAHOO.util.DragDrop();

