/* Copyright (c) 2006 Yahoo! Inc. All rights reserved. */

/**
 * Defines the interface and base operation of items that that can be 
 * dragged or can be drop targets.  It was designed to be extended, overriding
 * the event handlers for startDrag, onDrag, onDragOver, onDragOut.
 * Up to three html elements can be associated with a DragDrop instance:
 * <ul>
 * <li>linked element: the element that is passed into the constructor.
 * This is the element which defines the boundaries for interaction with 
 * other DragDrop objects.</li>
 * <li>handle element(s): The drag operation only occurs if the element that 
 * was clicked matches a handle element.  By default this is the linked 
 * element, but there are times that you will want only a portion of the 
 * linked element to initiate the drag operation, and the setHandleElId() 
 * method provides a way to define this.</li>
 * <li>drag element: this represents an the element that would be moved along
 * with the cursor during a drag operation.  By default, this is the linked
 * element itself as in {@link YAHOO.util.DD}.  setDragElId() lets you define
 * a separate element that would be moved, as in {@link YAHOO.util.DDProxy}
 * </li>
 * </ul>
 * This class should not be instantiated until the onload event to ensure that
 * the associated elements are available.
 * The following would define a DragDrop obj that would interact with any 
 * other * DragDrop obj in the "group1" group:
 * <pre>
 *  dd = new YAHOO.util.DragDrop("div1", "group1");
 * </pre>
 * Since none of the event handlers have been implemented, nothing would 
 * actually happen if you were to run the code above.  Normally you would 
 * override this class or one of the default implementations, but you can 
 * also override the methods you want on an instance of the class...
 * <pre>
 *  dd.onDragDrop = function(e, id) {
 *   alert("dd was dropped on " + id);
 *  }
 * </pre>
 * @constructor
 * @param {String} id of the element that is linked to this instance
 * @param {String} sGroup the group of related DragDrop objects
 */
YAHOO.util.DragDrop = function(id, sGroup) {
    if (id) {
        this.init(id, sGroup); 
    }
};

YAHOO.util.DragDrop.prototype = {

    /**
     * The id of the element associated with this object.  This is what we 
     * refer to as the "linked element" because the size and position of 
     * this element is used to determine when the drag and drop objects have 
     * interacted.
     *
     * @type String
     */
    id: null,

    /**
     * The id of the element that will be dragged.  By default this is same 
     * as the linked element , but could be changed to another element. Ex: 
     * YAHOO.util.DDProxy
     *
     * @type String
     * @private
     */
    dragElId: null, 

    /**
     * the id of the element that initiates the drag operation.  By default 
     * this is the linked element, but could be changed to be a child of this
     * element.  This lets us do things like only starting the drag when the 
     * header element within the linked html element is clicked.
     *
     * @type String
     * @private
     */
    handleElId: null, 

    /**
     * An array of HTML tags that will be ignored if clicked.
     * @type string[]
     */
    invalidHandleTypes: null, 

    /**
     * The linked element's absolute X position at the time the drag was 
     * started
     *
     * @type int
     * @private
     */
    startPageX: 0,

    /**
     * The linked element's absolute X position at the time the drag was 
     * started
     *
     * @type int
     * @private
     */
    startPageY: 0,

    /**
     * The group defines a logical collection of DragDrop objects that are 
     * related.  Instances only get events when interacting with other 
     * DragDrop object in the same group.  This lets us define multiple 
     * groups using a single DragDrop subclass if we want.
     * @type string[]
     */
    groups: null,

    /**
     * Individual drag/drop instances can be locked.  This will prevent 
     * onmousedown start drag.
     *
     * @type boolean
     * @private
     */
    locked: false,

    /**
     * Lock this instance
     */
    lock: function() { this.locked = true; },

    /**
     * Unlock this instace
     */
    unlock: function() { this.locked = false; },

    /**
     * By default, all insances can be a drop target.  This can be disabled by
     * setting isTarget to false.
     *
     * @type boolean
     */
    isTarget: true,

    /**
     * The padding configured for this drag and drop object for calculating
     * the drop zone intersection with this object.
     * @type int[]
     */
    padding: null,

    /**
     * @private
     */
    _domRef: null,

    /**
     * Internal typeof flag
     * @private
     */
    __ygDragDrop: true,

    /**
     * Set to true when horizontal contraints are applied
     *
     * @type boolean
     * @private
     */
    constrainX: false,

    /**
     * Set to true when vertical contraints are applied
     *
     * @type boolean
     * @private
     */
    constrainY: false,

    /**
     * The left constraint
     *
     * @type int
     * @private
     */
    minX: 0,

    /**
     * The right constraint
     *
     * @type int
     * @private
     */
    maxX: 0,

    /**
     * The up constraint 
     *
     * @type int
     * @private
     */
    minY: 0,

    /**
     * The down constraint 
     *
     * @type int
     * @private
     */
    maxY: 0,

    /**
     * Maintain offsets when we resetconstraints.  Used to maintain the 
     * slider thumb value, and this needs to be fixed.
     * @type boolean
     */
    maintainOffset: false,

    /**
     * Array of pixel locations the element will snap to if we specified a 
     * horizontal graduation/interval.  This array is generated automatically
     * when you define a tick interval.
     * @type int[]
     */
    xTicks: null,

    /**
     * Array of pixel locations the element will snap to if we specified a 
     * vertical graduation/interval.  This array is generated automatically 
     * when you define a tick interval.
     * @type int[]
     */
    yTicks: null,

    /**
     * By default the drag and drop instance will only respond to the primary
     * button click (left button for a right-handed mouse).  Set to true to
     * allow drag and drop to start with any mouse click that is propogated
     * by the browser
     * @type boolean
     */
    primaryButtonOnly: true,

    /**
     * Code that executes immediately before the startDrag event
     * @private
     */
    b4StartDrag: function(x, y) { },

    /**
     * Abstract method called after a drag/drop object is clicked
     * and the drag or mousedown time thresholds have beeen met.
     *
     * @param {int} X click location
     * @param {int} Y click location
     */
    startDrag: function(x, y) { /* override this */ },

    /**
     * Code that executes immediately before the onDrag event
     * @private
     */
    b4Drag: function(e) { },

    /**
     * Abstract method called during the onMouseMove event while dragging an 
     * object.
     *
     * @param {Event} e
     */
    onDrag: function(e) { /* override this */ },

    /**
     * Code that executes immediately before the onDragEnter event
     * @private
     */
    // b4DragEnter: function(e) { },

    /**
     * Abstract method called when this element fist begins hovering over 
     * another DragDrop obj
     *
     * @param {Event} e
     * @param {String || YAHOO.util.DragDrop[]} id In POINT mode, the element
     * id this is hovering over.  In INTERSECT mode, an array of one or more 
     * dragdrop items being hovered over.
     */
    onDragEnter: function(e, id) { /* override this */ },

    /**
     * Code that executes immediately before the onDragOver event
     * @private
     */
    b4DragOver: function(e) { },

    /**
     * Abstract method called when this element is hovering over another 
     * DragDrop obj
     *
     * @param {Event} e
     * @param {String || YAHOO.util.DragDrop[]} id In POINT mode, the element
     * id this is hovering over.  In INTERSECT mode, an array of dd items 
     * being hovered over.
     */
    onDragOver: function(e, id) { /* override this */ },

    /**
     * Code that executes immediately before the onDragOut event
     * @private
     */
    b4DragOut: function(e) { },

    /**
     * Abstract method called when we are no longer hovering over an element
     *
     * @param {Event} e
     * @param {String || YAHOO.util.DragDrop[]} id In POINT mode, the element
     * id this was hovering over.  In INTERSECT mode, an array of dd items 
     * that the mouse is no longer over.
     */
    onDragOut: function(e, id) { /* override this */ },

    /**
     * Code that executes immediately before the onDragDrop event
     * @private
     */
    b4DragDrop: function(e) { },

    /**
     * Abstract method called when this item is dropped on another DragDrop 
     * obj
     *
     * @param {Event} e
     * @param {String || YAHOO.util.DragDrop[]} id In POINT mode, the element
     * id this was dropped on.  In INTERSECT mode, an array of dd items this 
     * was dropped on.
     */
    onDragDrop: function(e, id) { /* override this */ },

    /**
     * Code that executes immediately before the endDrag event
     * @private
     */
    b4EndDrag: function(e) { },

    /**
     * Fired when we are done dragging the object
     *
     * @param {Event} e
     */
    endDrag: function(e) { /* override this */ },

    /**
     * Code executed immediately before the onMouseDown event

     * @param {Event} e
     * @private
     */
    b4MouseDown: function(e) {  },

    /**
     * Event handler that fires when a drag/drop obj gets a mousedown
     * @param {Event} e
     */
    onMouseDown: function(e) { /* override this */ },

    /**
     * Event handler that fires when a drag/drop obj gets a mouseup
     * @param {Event} e
     */
    onMouseUp: function(e) { /* override this */ },

    /**
     * Returns a reference to the linked element
     *
     * @return {HTMLElement} the html element 
     */
    getEl: function() { 
        if (!this._domRef) {
            this._domRef = this.DDM.getElement(this.id); 
        }

        return this._domRef;
    },

    /**
     * Returns a reference to the actual element to drag.  By default this is
     * the same as the html element, but it can be assigned to another 
     * element. An example of this can be found in YAHOO.util.DDProxy
     *
     * @return {HTMLElement} the html element 
     */
    getDragEl: function() {
        return this.DDM.getElement(this.dragElId);
    },

    /**
     * Sets up the DragDrop object.  Must be called in the constructor of any
     * YAHOO.util.DragDrop subclass
     *
     * @param id the id of the linked element
     * @param {String} sGroup the group of related items
     * element is supposed to be a target only, set to false.
     */
    init: function(id, sGroup) {
        this.initTarget(id, sGroup);
        YAHOO.util.Event.addListener(id, "mousedown", 
                                          this.handleMouseDown, this, true);
    },

    /**
     * Initializes Targeting functionality only... the object does not
     * get a mousedown handler.
     *
     * @param id the id of the linked element
     * @param {String} sGroup the group of related items
     * element is supposed to be a target only, set to false.
     */
    initTarget: function(id, sGroup) {

        // create a local reference to the drag and drop manager
        this.DDM = YAHOO.util.DDM;

        // create a logger instance
        this.logger = new ygLogger("DragDrop");

        // set the default padding
        this.padding = [0, 0, 0, 0];

        // initialize the groups array
        this.groups = {};

        // set the id
        this.id = id;

        // the element is a drag handle by default
        this.setDragElId(id); 

        // by default, clicked anchors will not start drag operations
        this.invalidHandleTypes = {a : "a"};

        // We don't want to register this as the handle with the manager
        // so we just set the id rather than calling the setter
        this.handleElId = id;

        // cache the position of the element if we can
        if (document && document.body) {
            this.setInitPosition();
        }

        // add to an interaction group
        this.addToGroup((sGroup) ? sGroup : "default");

    },

    /**
     * Configures the padding for the target zone in px.  Effectively expands
     * (or reduces) the virtual object size for targeting calculations.  
     * Supports css-style shorthand; if only one parameter is passed, all sides
     * will have that padding, and if only two are passed, the top and bottom
     * will have the first param, the left and right the second.
     * @param {int} iTop    Top pad
     * @param {int} iRight  Right pad
     * @param {int} iBot    Bot pad
     * @param {int} iLeft   Left pad
     */
    setPadding: function(iTop, iRight, iBot, iLeft) {
        // this.padding = [iLeft, iRight, iTop, iBot];
        if (!iRight && 0 !== iRight) {
            this.padding = [iTop, iTop, iTop, iTop];
        } else if (!iBot && 0 !== iBot) {
            this.padding = [iTop, iRight, iTop, iRight];
        } else {
            this.padding = [iTop, iRight, iBot, iLeft];
        }
    },

    /**
     * Stores the initial placement of the dd element
     */
    setInitPosition: function(diffX, diffY) {
        var el = this.getEl();

        if (!this.DDM.verifyEl(el)) {
            this.logger.debug(this.id + " element is broken");
            return;
        }

        var dx = diffX || 0;
        var dy = diffY || 0;

        var p = YAHOO.util.Dom.getXY( el );

        this.initPageX = p[0] - dx;
        this.initPageY = p[1] - dy;

        this.lastPageX = p[0];
        this.lastPageY = p[1];

        this.setStartPosition(p);
    },

    /**
     * Sets the start position of the element.  This is set when the obj
     * is initialized, the reset when a drag is started.
     * @param pos current position (from previous lookup)
     * @private
     */
    setStartPosition: function(pos) {

        var p = pos || YAHOO.util.Dom.getXY( this.getEl() );

        this.startPageX = p[0];
        this.startPageY = p[1];
    },

    /**
     * Add this instance to a group of related drag/drop objects.  All 
     * instances belong to at least one group, and can belong to as many 
     * groups as needed.
     *
     * @param sGroup {string} the name of the group
     */
    addToGroup: function(sGroup) {
        this.groups[sGroup] = true;
        this.DDM.regDragDrop(this, sGroup);
    },

    /**
     * Allows you to specify that an element other than the linked element 
     * will be moved with the cursor during a drag
     *
     * @param id the id of the element that will be used to initiate the drag
     */
    setDragElId: function(id) {
        this.dragElId = id;
    },

    /**
     * Allows you to specify a child of the linked element that should be 
     * used to initiate the drag operation.  An example of this would be if 
     * you have a content div with text and links.  Clicking anywhere in the 
     * content area would normally start the drag operation.  Use this method
     * to specify that an element inside of the content div is the element 
     * that starts the drag operation.
     *
     * @param id the id of the element that will be used to initiate the drag
     */
    setHandleElId: function(id) {
        this.handleElId = id;
        this.DDM.regHandle(this.id, id);
    },

    /**
     * Allows you to set an element outside of the linked element as a drag 
     * handle
     */
    setOuterHandleElId: function(id) {
        this.logger.debug("Adding outer handle event: " + id);
        YAHOO.util.Event.addListener(id, "mousedown", 
                this.handleMouseDown, this, true);
        this.setHandleElId(id);
    },

    /**
     * Remove all drag and drop hooks for this element
     */
    unreg: function() {
        this.logger.debug("DragDrop obj cleanup " + this.id);
        YAHOO.util.Event.removeListener(this.id, "mousedown", 
                this.handleMouseDown);
        this._domRef = null;
        this.DDM._remove(this);
    },

    /**
     * Returns true if this instance is locked, or the drag drop mgr is locked
     * (meaning that all drag/drop is disabled on the page.)
     *
     * @return {boolean} true if this obj or all drag/drop is locked, else 
     * false
     */
    isLocked: function() {
        return (this.DDM.isLocked() || this.locked);
    },

    /**
     * Fired when this object is clicked
     *
     * @param {Event} e 
     * @param {YAHOO.util.DragDrop} oDD the clicked dd object (this dd obj)
     * @private
     */
    handleMouseDown: function(e, oDD) {

        this.logger.debug("isLocked: " + this.isLocked());

        var EU = YAHOO.util.Event;

        
        var button = e.which || e.button;
        this.logger.debug("button: " + button);

        if (this.primaryButtonOnly && button > 1) {
            this.logger.debug("Mousedown was not produced by the primary button");
            return;
        }

        if (this.isLocked()) {
            this.logger.debug("Drag and drop is disabled, aborting");
            return;
        }

        this.logger.debug("mousedown " + this.id);

        this.DDM.refreshCache(this.groups);

        // Only process the event if we really clicked within the linked 
        // element.  The reason we make this check is that in the case that 
        // another element was moved between the clicked element and the 
        // cursor in the time between the mousedown and mouseup events. When 
        // this happens, the element gets the next mousedown event 
        // regardless of where on the screen it happened.  
        var pt = new YAHOO.util.Point(EU.getPageX(e), EU.getPageY(e));
        if ( this.DDM.isOverTarget(pt, this) )  {

            this.logger.debug("click is legit");

            //  check to see if the handle was clicked
            var srcEl = EU.getTarget(e);

            if (this.isValidHandleChild(srcEl) &&
                    (this.id == this.handleElId || 
                     this.DDM.handleWasClicked(srcEl, this.id)) ) {

                // set the initial element position
                this.setStartPosition();

                this.logger.debug("firing onMouseDown events");


                this.b4MouseDown(e);
                this.onMouseDown(e);
                this.DDM.handleMouseDown(e, this);

                this.DDM.stopEvent(e);
            }
        }
    },

    /**
     * Allows you to specify a tag name that should not start a drag operation
     * when clicked.  This is designed to facilitate embedding links within a
     * drag handle that do something other than start the drag.
     * 
     * @param {string} tagName the type of element to exclude
     */
    addInvalidHandleType: function(tagName) {
        var type = tagName.toUpperCase();
        this.invalidHandleTypes[type] = type;
    },

    /**
     * Unsets an excluded tag name set by addInvalidHandleType
     * 
     * @param {string} tagName the type of element to unexclude
     */
    removeInvalidHandleType: function(tagName) {
        var type = tagName.toUpperCase();
        this.invalidHandleTypes[type] = null;
    },

    /**
     * Checks the tag exclusion list to see if this click should be ignored
     *
     * @param {ygNode} node
     * @return {boolean} true if this is a valid tag type, false if not
     */
    isValidHandleChild: function(node) {
        var type = node.nodeName;

        if (type == "#text") {
            // this.logger.debug("text node, getting parent node type");
            type = node.parentNode.nodeName;
        }

        return (!this.invalidHandleTypes[type]);
    },

    /**
     * Create the array of horizontal tick marks if an interval was specified
     * in setXConstraint().
     *
     * @private
     */
    setXTicks: function(iStartX, iTickSize) {
        this.xTicks = [];
        this.xTickSize = iTickSize;
        
        var tickMap = {};

        for (var i = this.initPageX; i >= this.minX; i = i - iTickSize) {
            if (!tickMap[i]) {
                this.xTicks[this.xTicks.length] = i;
                tickMap[i] = true;
            }
        }

        for (i = this.initPageX; i <= this.maxX; i = i + iTickSize) {
            if (!tickMap[i]) {
                this.xTicks[this.xTicks.length] = i;
                tickMap[i] = true;
            }
        }

        this.xTicks.sort(this.DDM.numericSort) ;
        this.logger.debug("xTicks: " + this.xTicks.join());
    },

    /**
     * Create the array of vertical tick marks if an interval was specified in 
     * setYConstraint().
     *
     * @private
     */
    setYTicks: function(iStartY, iTickSize) {
        // this.logger.debug("setYTicks: " + iStartY + ", " + iTickSize
               // + ", " + this.initPageY + ", " + this.minY + ", " + this.maxY );
        this.yTicks = [];
        this.yTickSize = iTickSize;

        var tickMap = {};

        for (var i = this.initPageY; i >= this.minY; i = i - iTickSize) {
            if (!tickMap[i]) {
                this.yTicks[this.yTicks.length] = i;
                tickMap[i] = true;
            }
        }

        for (i = this.initPageY; i <= this.maxY; i = i + iTickSize) {
            if (!tickMap[i]) {
                this.yTicks[this.yTicks.length] = i;
                tickMap[i] = true;
            }
        }

        this.yTicks.sort(this.DDM.numericSort) ;
        this.logger.debug("yTicks: " + this.yTicks.join());
    },

    /**
     * By default, the element can be dragged any place on the screen.  Use 
     * this method to limit the horizontal travel of the element.  Pass in 
     * 0,0 for the parameters if you want to lock the drag to the y axis.
     *
     * @param {int} iLeft the number of pixels the element can move to the left
     * @param {int} iRight the number of pixels the element can move to the 
     * right
     * @param {int} iTickSize optional parameter for specifying that the 
     * element
     * should move iTickSize pixels at a time.
     */
    setXConstraint: function(iLeft, iRight, iTickSize) {
        this.leftConstraint = iLeft;

        this.rightConstraint = iRight;

        this.minX = this.initPageX - iLeft;
        this.maxX = this.initPageX + iRight;
        if (iTickSize) { this.setXTicks(this.initPageX, iTickSize); }

        this.constrainX = true;
        this.logger.debug("initPageX:" + this.initPageX + " minX:" + this.minX + 
                " maxX:" + this.maxX);
    },

    /**
     * By default, the element can be dragged any place on the screen.  Set 
     * this to limit the vertical travel of the element.  Pass in 0,0 for the
     * parameters if you want to lock the drag to the x axis.
     *
     * @param {int} iUp the number of pixels the element can move up
     * @param {int} iDown the number of pixels the element can move down
     * @param {int} iTickSize optional parameter for specifying that the 
     * element should move iTickSize pixels at a time.
     */
    setYConstraint: function(iUp, iDown, iTickSize) {
        this.logger.debug("setYConstraint: " + iUp + "," + iDown + "," + iTickSize);
        this.topConstraint = iUp;
        this.bottomConstraint = iDown;

        this.minY = this.initPageY - iUp;
        this.maxY = this.initPageY + iDown;
        if (iTickSize) { this.setYTicks(this.initPageY, iTickSize); }

        this.constrainY = true;
        
        this.logger.debug("initPageY:" + this.initPageY + " minY:" + this.minY + 
                " maxY:" + this.maxY);
    },

    /**
     * resetConstraints must be called if you manually reposition a dd element.
     * @param {boolean} maintainOffset
     */
    resetConstraints: function() {

        this.logger.debug("init pagexy: " + this.initPageX + ", " + 
        this.initPageY);
        this.logger.debug("last pagexy: " + this.lastPageX + ", " + 
        this.lastPageY);

        // figure out how much this thing has moved
        var dx = (this.maintainOffset) ? this.lastPageX - this.initPageX : 0;
        var dy = (this.maintainOffset) ? this.lastPageY - this.initPageY : 0;

        // this.logger.debug("diff: " + dx + ", " + dy);

        // reset the initial location
        this.setInitPosition(dx, dy);

        if (this.constrainX) {
            this.setXConstraint( this.leftConstraint, 
                                 this.rightConstraint, 
                                 this.xTickSize        );
        }

        if (this.constrainY) {
            this.setYConstraint( this.topConstraint, 
                                 this.bottomConstraint, 
                                 this.yTickSize         );
        }
    },

    /**
     * Normally the drag element is moved pixel by pixel, but we can specify 
     * that it move a number of pixels at a time.  This method resolves the 
     * location when we have it set up like this.
     *
     * @param {int} val where we want to place the object
     * @param {int[]} tickArray sorted array of valid points
     * @return {int} the closest tick
     * @private
     */
    getTick: function(val, tickArray) {

        if (!tickArray) {
            // If tick interval is not defined, it is effectively 1 pixel, 
            // so we return the value passed to us.
            return val; 
        } else if (tickArray[0] >= val) {
            // The value is lower than the first tick, so we return the first
            // tick.
            return tickArray[0];
        } else {
            for (var i = 0; i < tickArray.length; ++i) {
                var next = i + 1;
                if (tickArray[next] && tickArray[next] >= val) {
                    var diff1 = val - tickArray[i];
                    var diff2 = tickArray[next] - val;
                    return (diff2 > diff1) ? tickArray[i] : tickArray[next];
                }
            }

            // The value is larger than the last tick, so we return the last
            // tick.
            return tickArray[tickArray.length - 1];
        }
    },

    /**
     * toString method
     * @return {string} string representation of the dd obj
     */
    toString: function(val, tickArray) {
        return ("YAHOO.util.DragDrop {" + this.id + "}");
    }

};

