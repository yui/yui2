/* Copyright (c) 2006 Yahoo! Inc. All rights reserved. */

// Only load the library once.  Rewriting the manager class would orphan 
// existing drag and drop instances.
if (!YAHOO.util.DragDropMgr) {

    /**
     * Handles the element interaction for all DragDrop items in the 
     * window.  Generally, you will not call this class directly, but it does
     * have helper methods that could be useful in your DragDrop 
     * implementations.  This class should not be instantiated; all methods 
     * are are static.
     *
     * @constructor
     */
    YAHOO.util.DragDropMgr = new function() {

        /**
         * Two dimensional Array of registered DragDrop objects.  The first 
         * dimension is the DragDrop item group, the second the DragDrop 
         * object.
         *
         * @type {string: string}
         * @private
         */
        this.ids = {};

        /**
         * Array of element ids defined as drag handles.  Used to determine 
         * if the element that generated the mousedown event is actually the 
         * handle and not the html element itself.
         *
         * @type {string: string}
         * @private
         */
        this.handleIds = {};

        /**
         * the DragDrop object that is currently being dragged
         *
         * @type DragDrop
         * @private
         **/
        this.dragCurrent = null;

        /**
         * the DragDrop object(s) that are being hovered over
         *
         * @type Array
         * @private
         */
        this.dragOvers = {};

        /**
         * @private
         */
        this.logger = null;

        /**
         * the X distance between the cursor and the object being dragged
         *
         * @type int
         * @private
         */
        this.deltaX = 0;

        /**
         * the Y distance between the cursor and the object being dragged
         *
         * @type int
         * @private
         */
        this.deltaY = 0;

        /**
         * Flag to determine if we should prevent the default behavior of the
         * events we define. By default this is true, but this can be set to 
         * false if you need the default behavior (not recommended)
         *
         * @type boolean
         */
        this.preventDefault = true;

        /**
         * Flag to determine if we should stop the propagation of the events 
         * we generate. This is true by default but you may want to set it to
         * false if the html element contains other features that require the
         * mouse click.
         *
         * @type boolean
         */
        this.stopPropagation = true;

        /**
         * @private
         */
        this.initalized = false;

        /**
         * All drag and drop can be disabled.
         *
         * @private
         */
        this.locked = false;
        
        /**
         * Called the first time an element is registered.
         *
         * @private
         */
        this.init = function() {
            this.logger = new ygLogger("DragDropMgr");
        };

        /**
         * In point mode, drag and drop interaction is defined by the 
         * location of the cursor during the drag/drop
         * @type int
         */
        this.POINT     = 0;

        /**
         * In intersect mode, drag and drop interactio nis defined by the 
         * overlap of two or more drag and drop objects.
         * @type int
         */
        this.INTERSECT = 1;

        /**
         * The current drag and drop mode.  Default it point mode
         * @type int
         */
        this.mode = this.POINT;

        /**
         * Runs method on all drag and drop objects
         * @private
         */
        this._execOnAll = function(sMethod, args) {
            for (var i in this.ids) {
                for (var j in this.ids[i]) {
                    var oDD = this.ids[i][j];
                    if (! this.isTypeOfDD(oDD)) {
                        continue;
                    }
                    oDD[sMethod].apply(oDD, args);
                }
            }
        };

        /**
         * Drag and drop initialization.  Sets up the global event handlers
         * @private
         */
        this._onLoad = function() {

            // Switched to onAvailable in 2.0.1 (in DragDrop.initTarget)
            // this._execOnAll("setInitPosition", []);

            this.logger = new ygLogger("DragDropMgr");
            this.logger.debug("DDM onload");

            var EU = YAHOO.util.Event;

            EU.on(document, "mouseup",   this.handleMouseUp, this, true);
            EU.on(document, "mousemove", this.handleMouseMove, this, true);
            EU.on(window,   "unload",    this._onUnload, this, true);
            EU.on(window,   "resize",    this._onResize, this, true);
            // EU.on(window,   "mouseout",    this._test);

            this.initalized = true;

        };

        /**
         * Reset constraints on all drag and drop objs
         * @private
         */
        this._onResize = function(e) {
            this.logger.debug("window resize");
            this._execOnAll("resetConstraints", []);
        };

        /**
         * Lock all drag and drop functionality
         */
        this.lock = function() { this.locked = true; };

        /**
         * Unlock all drag and drop functionality
         */
        this.unlock = function() { this.locked = false; };

        /**
         * Is drag and drop locked?
         *
         * @return {boolean} True if drag and drop is locked, false otherwise.
         */
        this.isLocked = function() { return this.locked; };

        /**
         * Location cache that is set for all drag drop objects when a drag is
         * initiated, cleared when the drag is finished.
         *
         * @private
         */
        this.locationCache = {};

        /**
         * Set useCache to false if you want to force object the lookup of each
         * drag and drop linked element constantly during a drag.
         * @type boolean
         */
        this.useCache = true;

        /**
         * The number of pixels that the mouse needs to move after the 
         * mousedown before the drag is initiated.  Default=3;
         * @type int
         */
        this.clickPixelThresh = 3;

        /**
         * The number of milliseconds after the mousedown event to initiate the
         * drag if we don't get a mouseup event. Default=1000
         * @type int
         */
        this.clickTimeThresh = 1000;

        /**
         * Flag that indicates that either the drag pixel threshold or the 
         * mousdown time threshold has been met
         * @type boolean
         * @private
         */
        this.dragThreshMet = false;

        /**
         * Timeout used for the click time threshold
         * @type Object
         * @private
         */
        this.clickTimeout = null;

        /**
         * The X position of the mousedown event stored for later use when a 
         * drag threshold is met.
         * @type int
         * @private
         */
        this.startX = 0;

        /**
         * The Y position of the mousedown event stored for later use when a 
         * drag threshold is met.
         * @type int
         * @private
         */
        this.startY = 0;

        /**
         * Each DragDrop instance must be registered with the DragDropMgr.  
         * This is executed in ygDragDrop.init()
         *
         * @param {DragDrop} oDD the DragDrop object to register
         * @param {String} sGroup the name of the group this element belongs to
         */
        this.regDragDrop = function(oDD, sGroup) {
            if (!this.initialized) { this.init(); }
            
            if (!this.ids[sGroup]) {
                this.ids[sGroup] = {};
            }
            this.ids[sGroup][oDD.id] = oDD;
        };

        /**
         * Unregisters a drag and drop item.  This is executed in 
         * ygDragDrop.unreg, use that method instead of calling this directly.
         * @private
         */
        this._remove = function(oDD) {
            for (var g in oDD.groups) {
                if (g && this.ids[g][oDD.id]) {
                    delete this.ids[g][oDD.id];
                }
            }
            delete this.handleIds[oDD.id];
        };

        /**
         * Each DragDrop handle element must be registered.  This is done
         * automatically when executing ygDragDrop.setHandleElId()
         *
         * @param {String} sDDId the DragDrop id this element is a handle for
         * @param {String} sHandleId the id of the element that is the drag 
         * handle
         */
        this.regHandle = function(sDDId, sHandleId) {
            if (!this.handleIds[sDDId]) {
                this.handleIds[sDDId] = {};
            }
            this.handleIds[sDDId][sHandleId] = sHandleId;
        };

        /**
         * Utility function to determine if a given element has been 
         * registered as a drag drop item.
         *
         * @param {String} id the element id to check
         * @return {boolean} true if this element is a DragDrop item, 
         * false otherwise
         */
        this.isDragDrop = function(id) {
            return ( this.getDDById(id) ) ? true : false;
        };

        /**
         * Returns the drag and drop instances that are in all groups the
         * passed in instance belongs to.
         *
         * @param {ygDragDrop} p_oDD the obj to get related data for
         * @param {boolean} bTargetsOnly if true, only return targetable objs
         * @return {ygDragDrop[]} the related instances
         */
        this.getRelated = function(p_oDD, bTargetsOnly) {
            var oDDs = [];
            for (var i in p_oDD.groups) {
                for (j in this.ids[i]) {
                    var dd = this.ids[i][j];
                    if (! this.isTypeOfDD(dd)) {
                        continue;
                    }
                    if (!bTargetsOnly || dd.isTarget) {
                        oDDs[oDDs.length] = dd;
                    }
                }
            }

            return oDDs;
        };

        /**
         * Returns true if the specified dd target is a legal target for 
         * the specifice drag obj
         *
         * @param {ygDragDrop} the drag obj
         * @param {ygDragDrop) the target
         * @return {boolean} true if the target is a legal target for the 
         * dd obj
         */
        this.isLegalTarget = function (oDD, oTargetDD) {
            var targets = this.getRelated(oDD);
            for (var i =0;i<targets.length;++i) {
                if (targets[i].id == oTargetDD.id) {
                    return true;
                }
            }

            return false;
        };

        /**
         * My goal is to be able to transparently determine if an object is
         * typeof ygDragDrop, and the exact subclass of ygDragDrop.  typeof 
         * returns "object", oDD.constructor.toString() always returns
         * "ygDragDrop" and not the name of the subclass.  So for now it just
         * evaluates a well-known variable in ygDragDrop.
         *
         * @param {Object} the object to evaluate
         * @return {boolean} true if typeof oDD = ygDragDrop
         */
        this.isTypeOfDD = function (oDD) {
            return (oDD && oDD.__ygDragDrop);
        };

        /**
         * Utility function to determine if a given element has been 
         * registered as a drag drop handle for the given Drag Drop object.
         *
         * @param {String} id the element id to check
         * @return {boolean} true if this element is a DragDrop handle, false 
         * otherwise
         */
        this.isHandle = function(sDDId, sHandleId) {
            return ( this.handleIds[sDDId] && 
                            this.handleIds[sDDId][sHandleId] );
        };

        /**
         * Returns the DragDrop instance for a given id
         *
         * @param {String} id the id of the DragDrop object
         * @return {DragDrop} the drag drop object, null if it is not found
         */
        this.getDDById = function(id) {
            for (var i in this.ids) {
                if (this.ids[i][id]) {
                    return this.ids[i][id];
                }
            }
            return null;
        };

        /**
         * Fired after a registered DragDrop object gets the mousedown event.
         * Sets up the events required to track the object being dragged
         *
         * @param {Event} e the event
         * @param oDD the DragDrop object being dragged
         * @private
         */
        this.handleMouseDown = function(e, oDD) {

            this.currentTarget = YAHOO.util.Event.getTarget(e);

            this.logger.debug("mousedown - adding event handlers");
            this.dragCurrent = oDD;

            var el = oDD.getEl();

            // track start position
            this.startX = YAHOO.util.Event.getPageX(e);
            this.startY = YAHOO.util.Event.getPageY(e);

            this.deltaX = this.startX - el.offsetLeft;
            this.deltaY = this.startY - el.offsetTop;

            this.dragThreshMet = false;

            this.clickTimeout = setTimeout( 
                    function() { DDM.startDrag(DDM.startX, DDM.startY); }, 
                    this.clickTimeThresh );
        };

        /**
         * Fired when either the drag pixel threshol or the mousedown hold 
         * time threshold has been met.
         * 
         * @param x {int} the X position of the original mousedown
         * @param y {int} the Y position of the original mousedown
         */
        this.startDrag = function(x, y) {
            this.logger.debug("firing drag start events");
            clearTimeout(this.clickTimeout);
            if (this.dragCurrent) {
                this.dragCurrent.b4StartDrag(x, y);
                this.dragCurrent.startDrag(x, y);
            }
            this.dragThreshMet = true;
        };

        /**
         * Internal function to handle the mouseup event.  Will be invoked 
         * from the context of the document.
         *
         * @param {Event} e the event
         * @private
         */
        this.handleMouseUp = function(e) {

            if (! this.dragCurrent) {
                return;
            }

            clearTimeout(this.clickTimeout);

            if (this.dragThreshMet) {
                this.logger.debug("mouseup detected - completing drag");
                this.fireEvents(e, true);
            } else {
                this.logger.debug("drag threshold not met");
            }

            this.stopDrag(e);

            this.stopEvent(e);
        };

        /**
         * Utility to stop event propagation and event default, if these 
         * features are turned on.
         *
         * @param {Event} e the event as returned by this.getEvent()
         */
        this.stopEvent = function(e) {
            if (this.stopPropagation) {
                YAHOO.util.Event.stopPropagation(e);
            }

            if (this.preventDefault) {
                YAHOO.util.Event.preventDefault(e);
            }
        };

        /** 
         * Internal function to clean up event handlers after the drag 
         * operation is complete
         *
         * @param {Event} e the event
         * @private
         */
        this.stopDrag = function(e) {
            // this.logger.debug("mouseup - removing event handlers");

            // Fire the drag end event for the item that was dragged
            if (this.dragCurrent) {
                if (this.dragThreshMet) {
                    this.logger.debug("firing endDrag events");
                    this.dragCurrent.b4EndDrag(e);
                    this.dragCurrent.endDrag(e);
                }

                this.logger.debug("firing onMouseUp event");
                this.dragCurrent.onMouseUp(e);
            }

            this.dragCurrent = null;
            this.dragOvers = {};
        };


        /** 
         * Internal function to handle the mousemove event.  Will be invoked 
         * from the context of the html element.
         *
         * @TODO figure out what we can do about mouse events lost when the 
         * user drags objects beyond the window boundary.  Currently we can 
         * detect this in internet explorer by verifying that the mouse is 
         * down during the mousemove event.  Firefox doesn't give us the 
         * button state on the mousemove event.
         *
         * @param {Event} e the event
         * @private
         */
        this.handleMouseMove = function(e) {
            if (! this.dragCurrent) {
                // this.logger.debug("no current drag obj");
                return;
            }

            // var button = e.which || e.button;
            // this.logger.debug("which: " + e.which + ", button: "+ e.button);

            // check for IE mouseup outside of page boundary
            if (YAHOO.util.Event.isIE && !e.button) {
                this.logger.debug("button failure");
                this.stopEvent(e);
                return this.handleMouseUp(e);
            }

            if (!this.dragThreshMet) {
                var diffX = Math.abs(this.startX - YAHOO.util.Event.getPageX(e));
                var diffY = Math.abs(this.startY - YAHOO.util.Event.getPageY(e));
                // this.logger.debug("diffX: " + diffX + "diffY: " + diffY);
                if (diffX > this.clickPixelThresh || 
                            diffY > this.clickPixelThresh) {
                    this.logger.debug("pixel threshold met");
                    this.startDrag(this.startX, this.startY);
                }
            }

            if (this.dragThreshMet) {
                this.dragCurrent.b4Drag(e);
                this.dragCurrent.onDrag(e);
                this.fireEvents(e, false);
            }

            this.stopEvent(e);
        };

        /**
         * Iterates over all of the DragDrop elements to find ones we are 
         * hovering over or dropping on
         *
         * @param {Event} e the event
         * @param {boolean} isDrop is this a drop op or a mouseover op?
         * @private
         */
        this.fireEvents = function(e, isDrop) {
            var dc = this.dragCurrent;

            // If the user did the mouse up outside of the window, we could 
            // get here even though we have ended the drag.
            if (!dc || dc.isLocked()) {
                return;
            }

            var x = YAHOO.util.Event.getPageX(e);
            var y = YAHOO.util.Event.getPageY(e);
            var pt = new YAHOO.util.Point(x,y);

            // cache the previous dragOver array
            var oldOvers = [];

            var outEvts   = [];
            var overEvts  = [];
            var dropEvts  = [];
            var enterEvts = [];

            // Check to see if the object we were hovering over is no longer 
            // being hovered over so we can fire the onDragOut event
            for (var i in this.dragOvers) {

                var ddo = this.dragOvers[i];

                if (! this.isTypeOfDD(ddo)) {
                    continue;
                }

                if (! this.isOverTarget(pt, ddo, this.mode)) {
                    outEvts.push( ddo );
                }

                oldOvers[i] = true;
                delete this.dragOvers[i];
            }

            for (var sGroup in dc.groups) {
                // this.logger.debug("Processing group " + sGroup);
                
                if ("string" != typeof sGroup) {
                    continue;
                }

                for (i in this.ids[sGroup]) {
                    var oDD = this.ids[sGroup][i];
                    if (! this.isTypeOfDD(oDD)) {
                        continue;
                    }

                    if (oDD.isTarget && !oDD.isLocked() && oDD != dc) {
                        if (this.isOverTarget(pt, oDD, this.mode)) {
                            // look for drop interactions
                            if (isDrop) {
                                dropEvts.push( oDD );
                            // look for drag enter and drag over interactions
                            } else {

                                // initial drag over: dragEnter fires
                                if (!oldOvers[oDD.id]) {
                                    enterEvts.push( oDD );
                                // subsequent drag overs: dragOver fires
                                } else {
                                    overEvts.push( oDD );
                                }

                                this.dragOvers[oDD.id] = oDD;
                            }
                        }
                    }
                }
            }

            if (this.mode) {
                if (outEvts.length > 0) {
                    dc.b4DragOut(e, outEvts);
                    dc.onDragOut(e, outEvts);
                }

                if (enterEvts.length > 0) {
                    dc.onDragEnter(e, enterEvts);
                }

                if (overEvts.length > 0) {
                    dc.b4DragOver(e, overEvts);
                    dc.onDragOver(e, overEvts);
                }

                if (dropEvts.length > 0) {
                    dc.b4DragDrop(e, dropEvts);
                    dc.onDragDrop(e, dropEvts);
                }

            } else {
                // fire dragout events
                for (i=0; i < outEvts.length; ++i) {
                    this.logger.debug(dc.id+" onDragOut: " + outEvts[i].id);
                    dc.b4DragOut(e, outEvts[i].id);
                    dc.onDragOut(e, outEvts[i].id);
                }
                 
                // fire enter events
                for (i=0; i < enterEvts.length; ++i) {
                    this.logger.debug(dc.id + " onDragEnter " + enterEvts[i].id);
                    // dc.b4DragEnter(e, oDD.id);
                    dc.onDragEnter(e, enterEvts[i].id);
                }
         
                // fire over events
                for (i=0; i < overEvts.length; ++i) {
                    this.logger.debug(dc.id + " onDragOver " + overEvts[i].id);
                    dc.b4DragOver(e, overEvts[i].id);
                    dc.onDragOver(e, overEvts[i].id);
                }

                // fire drop events
                for (i=0; i < dropEvts.length; ++i) {
                    this.logger.debug(dc.id + " dropped on " + dropEvts[i].id);
                    dc.b4DragDrop(e, dropEvts[i].id);
                    dc.onDragDrop(e, dropEvts[i].id);
                }

            }

        };

        /**
         * Helper function for getting the best match from the list of drag 
         * and drop objects returned by the drag and drop events when we are 
         * in INTERSECT mode.  It returns either the first object that the 
         * cursor is over, or the object that has the greatest overlap with 
         * the dragged element.
         *
         * @param  {ygDragDrop[]} dds The array of drag and drop objects 
         * targeted
         * @return {ygDragDrop}       The best single match
         */
        this.getBestMatch = function(dds) {
            var winner = null;
            // Return null if the input is not what we expect
            //if (!dds || !dds.length || dds.length == 0) {
               // winner = null;
            // If there is only one item, it wins
            //} else if (dds.length == 1) {

            if (dds.length == 1) {
                winner = dds[0];
            } else {
                // Loop through the targeted items
                for (var i=0; i<dds.length; ++i) {
                    var dd = dds[i];
                    // If the cursor is over the object, it wins.  If the 
                    // cursor is over multiple matches, the first one we come
                    // to wins.
                    if (dd.cursorIsOver) {
                        winner = dd;
                        break;
                    // Otherwise the object with the most overlap wins
                    } else {
                        if (!winner || 
                            winner.overlap.getArea() < dd.overlap.getArea()) {
                            winner = dd;
                        }
                    }
                }
            }

            return winner;
        };

        /**
         * Refreshes the cache of the top-left and bottom-right points of the 
         * drag and drop objects in the specified groups
         *
         * @param {Array} aGroups an associative array of groups to refresh
         */
        this.refreshCache = function(aGroups) {
            this.logger.debug("refreshing element location cache");
            for (sGroup in aGroups) {
                if ("string" != typeof sGroup) {
                    continue;
                }
                for (i in this.ids[sGroup]) {
                    var oDD = this.ids[sGroup][i];

                    if (this.isTypeOfDD(oDD)) {
                        var loc = this.getLocation(oDD);
                        if (loc) {
                            this.locationCache[oDD.id] = loc;
                        } else {
                            delete this.locationCache[oDD.id];
                            this.logger.debug("something is wrong with the element");
                            // this will unregister the drag and drop object if
                            // the element is not in a usable state
                            oDD.unreg();
                        }
                    }
                }
            }
        };

        /**
         * This checks to make sure an element exists and is in the DOM.  The
         * main purpose is to handle cases where innerHTML is used to remove
         * drag and drop objects from the DOM.  IE provides an 'unspecified
         * error' when trying to access the offsetParent of such an element
         * @param {HTMLElement} el the element to check
         * @return {boolean} true if the element looks usable
         */
        this.verifyEl = function(el) {
            try {
                if (el) {
                    var parent = el.offsetParent;
                    if (parent) {
                        return true;
                    }
                }
            } catch(e) {
                this.logger.debug("detected problem with an element");
            }

            return false;
        };
        
        /**
         * Returns the an array containing the drag and drop element's position
         * and size, including the ygDragDrop.padding configured for it
         *
         * @param {ygDragDrop} oDD the drag and drop object to get the 
         * location for
         * @return array containing the top left and bottom right points of the 
         * element 
         */
        this.getLocation = function(oDD) {
            if (! this.isTypeOfDD(oDD)) {
                this.logger.debug(oDD + " is not a DD obj");
                return null;
            }

            var el = oDD.getEl();

            if (!this.verifyEl(el)) {
                this.logger.debug(oDD + " element is not usable");
                return null;
            }

            // this.logger.debug(oDD.id + " padding: " + oDD.padding);

            // var aPos = ygPos.getPos(el);
            var aPos = YAHOO.util.Dom.getXY(el);

            x1 = aPos[0];
            x2 = x1 + el.offsetWidth;

            y1 = aPos[1];
            y2 = y1 + el.offsetHeight;

            var t = y1 - oDD.padding[0];
            var r = x2 + oDD.padding[1];
            var b = y2 + oDD.padding[2];
            var l = x1 - oDD.padding[3];

            return new YAHOO.util.Region( t, r, b, l );

        };

        /**
         * Checks the cursor location to see if it over the target
         * 
         * @param {YAHOO.util.Point} pt The point to evaluate
         * @param {ygDragDrop} oDDTarget the DragDrop object we are inspecting
         * @return {boolean} true if the mouse is over the target
         * @private
         */
        this.isOverTarget = function(pt, oDDTarget, intersect) {
            // use cache if available
            var loc = this.locationCache[oDDTarget.id];
            if (!loc || !this.useCache) {
                this.logger.debug("cache not populated");
                loc = this.getLocation(oDDTarget);
                this.locationCache[oDDTarget.id] = loc;

                this.logger.debug("cache: " + loc);
            }

            // this.logger.debug("isOverTarget: " + x + "," + y + ", " + loc);

            // var cursorIsOver =  (x >= loc[3] && x <= loc[1] && y >= loc[0] && y <= loc[2]);
            //oDDTarget.cursorIsOver = loc.contains( new YAHOO.util.Point(x, y) );
            oDDTarget.cursorIsOver = loc.contains( pt );
            oDDTarget.overlap = null;

            // if (this.INTERSECT == this.mode) {
            if (intersect) {

                var curRegion = 
                    YAHOO.util.Region.getRegion(this.dragCurrent.getDragEl());
                var overlap = curRegion.intersect(loc);

                if (overlap) {
                    oDDTarget.overlap = overlap;
                    return true;
                } else {
                    return false;
                }

            } else {
                return oDDTarget.cursorIsOver;
            }
        };

        /**
         * @private
         */
        this._onUnload = function(e, me) {
            this.unregAll();
        };

        /**
         * Cleans up the drag and drop events and objects.
         *
         * @private
         */
        this.unregAll = function() {
            this.logger.debug("unregister all");

            if (this.dragCurrent) {
                this.stopDrag();
                this.dragCurrent = null;
            }

            this._execOnAll("unreg", []);

            for (i in this.elementCache) {
                delete this.elementCache[i];
            }

            this.elementCache = {};
            this.ids = {};
        };

        /**
         * A cache of DOM elements
         *
         * @private
         */
        this.elementCache = {};
        
        /**
         * Get the wrapper for the DOM element specified
         *
         * @param {String} id the id of the elment to get
         * @return {YAHOO.util.DDM.ElementWrapper} the wrapped element
         * @private
         */
        this.getElWrapper = function(id) {
            var oWrapper = this.elementCache[id];
            if (!oWrapper || !oWrapper.el) {
                // this.logger.debug("adding element cache: " + id);
                oWrapper = this.elementCache[id] = 
                    new this.ElementWrapper(document.getElementById(id));
            }
            return oWrapper;
        };

        /**
         * Returns the actual DOM element
         *
         * @param {String} id the id of the elment to get
         * @return {Object} The element
         */
        this.getElement = function(id) {
            // return this.getElWrapper(id).el;
            return document.getElementById(id);
        };
        
        /**
         * Returns the style property for the DOM element (i.e., 
         * document.getElById(id).style)
         *
         * @param {String} id the id of the elment to get
         * @return {Object} The style property of the element
         */
        this.getCss = function(id) {
            // return this.getElWrapper(id).css;
            var css = null;
            var el = document.getElementById(id);
            if (el) {
                css = el.style;
            }

            return css;
        };

        /**
         * Inner class for cached elements
         */
        this.ElementWrapper = function(el) {
                /**
                 * @private
                 */
                this.el = el || null;
                /**
                 * @private
                 */
                this.id = this.el && el.id;
                /**
                 * @private
                 */
                this.css = this.el && el.style;
            };

        /**
         * Returns the X position of an html element
         * @param el the element for which to get the position
         * @return {int} the X coordinate
         */
        this.getPosX = function(el) {
            return YAHOO.util.Dom.getX(el);
        };

        /**
         * Returns the Y position of an html element
         * @param el the element for which to get the position
         * @return {int} the Y coordinate
         */
        this.getPosY = function(el) {
            return YAHOO.util.Dom.getY(el); 
        };

        /**
         * Swap two nodes.  In IE, we use the native method, for others we 
         * emulate the IE behavior
         *
         * @param n1 the first node to swap
         * @param n2 the other node to swap
         */
        this.swapNode = function(n1, n2) {
            if (n1.swapNode) {
                n1.swapNode(n2);
            } else {
                // the node reference order for the swap is a little tricky. 
                var p = n2.parentNode;
                var s = n2.nextSibling;
                n1.parentNode.replaceChild(n2,n1);
                p.insertBefore(n1,s);
            }
        };

        /**
         * @private
         */
        this.getScroll = function () {
            var t, l;
            if (document.documentElement && document.documentElement.scrollTop) {
                t = document.documentElement.scrollTop;
                l = document.documentElement.scrollLeft;
            } else if (document.body) {
                t = document.body.scrollTop;
                l = document.body.scrollLeft;
            }
            return { top: t, left: l };
        };

        /**
         * Returns the specified element style property
         * @param {HTMLElement} el          the element
         * @param {string}      styleProp   the style property
         * @return {string}     The value of the style property
         */
        this.getStyle = function(el, styleProp) {
            if (el.style.styleProp) {
                return el.style.styleProp;
            } else if (el.currentStyle) {
                return el.currentStyle[styleProp];
            } else if (document.defaultView) {
                return document.defaultView.getComputedStyle(el, null).
                    getPropertyValue(styleProp);
            }
        };

        /**
         * Gets the scrollTop
         *
         * @return {int} the document's scrollTop
         */
        this.getScrollTop = function () { return this.getScroll().top; };

        /**
         * Gets the scrollLeft
         *
         * @return {int} the document's scrollTop
         */
        this.getScrollLeft = function () { return this.getScroll().left; };

        this.moveToEl = function (moveEl, targetEl) {
            var aCoord = YAHOO.util.Dom.getXY(targetEl);
            this.logger.debug("moveToEl: " + aCoord);
            YAHOO.util.Dom.setXY(moveEl, aCoord);
        };

        /**
         * Gets the client height
         *
         * @return {int} client height in px
         */
        this.getClientHeight = function() {
            return (window.innerHeight) ? window.innerHeight : 
                (document.documentElement && document.documentElement.clientHeight) ?
                document.documentElement.clientHeight : document.body.offsetHeight;
        };

        /**
         * Gets the client width
         *
         * @return {int} client width in px
         */
        this.getClientWidth = function() {
            return (window.innerWidth) ? window.innerWidth : 
                (document.documentElement && document.documentElement.clientWidth) ?
                document.documentElement.clientWidth : document.body.offsetWidth;
        };

        /**
         * numeric array sort function
         */
        this.numericSort = function(a, b) { return (a - b); };

        /**
         * @private
         */
        this._timeoutCount = 0;

        /**
         * @private
         * Trying to make the load order less important.  Without this we get
         * an error if this file is loaded before the Event Utility.
         */
        this._addListeners = function() {
            if ( YAHOO.util.Event && document ) {
                this._onLoad();
            } else {
                if (this._timeoutCount > 1000) {
                    this.logger.debug("DragDrop requires the Event Utility");
                } else {
                    setTimeout(YAHOO.util.DDM._addListeners, 10);
                    if (document && document.body) {
                        this._timeoutCount += 1;
                    }
                }
            }
        };

        /**
         * Recursively searches the immediate parent and all child nodes for 
         * the handle element in order to determine wheter or not it was 
         * clicked.
         *
         * @param node the html element to inspect
         */
        this.handleWasClicked = function(node, id) {
            if (this.isHandle(id, node.id)) {
                this.logger.debug("clicked node is a handle");
                return true;
            } else {
                // check to see if this is a text node child of the one we want
                var p = node.parentNode;
                // this.logger.debug("p: " + p);

                while (p) {
                    if (this.isHandle(id, p.id)) {
                        return true;
                    } else {
                        this.logger.debug(p.id + " is not a handle");
                        p = p.parentNode;
                    }
                }
            }

            return false;
        };

    } ();

    // shorter alias, save a few bytes
    YAHOO.util.DDM = YAHOO.util.DragDropMgr;
    YAHOO.util.DDM._addListeners();

}

