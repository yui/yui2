(function () {
	var Dom = YAHOO.util.Dom,
		Event = YAHOO.util.Event,
		Lang = YAHOO.lang,
		Widget = YAHOO.widget;

/**
 * The treeview widget is a generic tree building tool.
 * @module treeview
 * @title TreeView Widget
 * @requires yahoo, event
 * @optional animation
 * @namespace YAHOO.widget
 */

/**
 * Contains the tree view state data and the root node.
 *
 * @class TreeView
 * @uses YAHOO.util.EventProvider
 * @constructor
 * @param {string|HTMLElement} id The id of the element, or the element itself that the tree will be inserted into.  Existing markup in this element, if valid, will be used to build the tree
 * @param {Array|object|string}  oConfig (optional)  An array containing the definition of the tree.  Objects will be converted to arrays of one element.  A string will produce a single TextNode
 * 
 */
YAHOO.widget.TreeView = function(id, oConfig) {
    if (id) { this.init(id); }
	if (oConfig) {
		if (!Lang.isArray(oConfig)) {
			oConfig = [oConfig];
		}
		this.buildTreeFromObject(oConfig);
	} else if (Lang.trim(this._el.innerHTML)) {
		this.buildTreeFromMarkup(id);
	}
};

var TV = Widget.TreeView;

TV.prototype = {

    /**
     * The id of tree container element
     * @property id
     * @type String
     */
    id: null,

    /**
     * The host element for this tree
     * @property _el
     * @private
     * @type HTMLelement
     */
    _el: null,

     /**
     * Flat collection of all nodes in this tree.  This is a sparse
     * array, so the length property can't be relied upon for a
     * node count for the tree.
     * @property _nodes
     * @type Node[]
     * @private
     */
    _nodes: null,

    /**
     * We lock the tree control while waiting for the dynamic loader to return
     * @property locked
     * @type boolean
     */
    locked: false,

    /**
     * The animation to use for expanding children, if any
     * @property _expandAnim
     * @type string
     * @private
     */
    _expandAnim: null,

    /**
     * The animation to use for collapsing children, if any
     * @property _collapseAnim
     * @type string
     * @private
     */
    _collapseAnim: null,

    /**
     * The current number of animations that are executing
     * @property _animCount
     * @type int
     * @private
     */
    _animCount: 0,

    /**
     * The maximum number of animations to run at one time.
     * @property maxAnim
     * @type int
     */
    maxAnim: 2,

    /**
     * Whether there is any subscriber to dblClickEvent
     * @property _hasDblClickSubscriber
     * @type boolean
     * @private
     */
    _hasDblClickSubscriber: false,
	
    /**
     * Stores the timer used to check for double clicks
     * @property _dblClickTimer
     * @type window.timer object
     * @private
     */
    _dblClickTimer: null,

  /**
     * A reference to the Node currently having the focus or null if none.
     * @property currentFocus
     * @type YAHOO.widget.Node
     */
    currentFocus: null,

    /**
     * Sets up the animation for expanding children
     * @method setExpandAnim
     * @param {string} type the type of animation (acceptable values defined 
     * in YAHOO.widget.TVAnim)
     */
    setExpandAnim: function(type) {
        this._expandAnim = (Widget.TVAnim.isValid(type)) ? type : null;
    },

    /**
     * Sets up the animation for collapsing children
     * @method setCollapseAnim
     * @param {string} the type of animation (acceptable values defined in 
     * YAHOO.widget.TVAnim)
     */
    setCollapseAnim: function(type) {
        this._collapseAnim = (Widget.TVAnim.isValid(type)) ? type : null;
    },

    /**
     * Perform the expand animation if configured, or just show the
     * element if not configured or too many animations are in progress
     * @method animateExpand
     * @param el {HTMLElement} the element to animate
     * @param node {YAHOO.util.Node} the node that was expanded
     * @return {boolean} true if animation could be invoked, false otherwise
     */
    animateExpand: function(el, node) {
        this.logger.log("animating expand");

        if (this._expandAnim && this._animCount < this.maxAnim) {
            // this.locked = true;
            var tree = this;
            var a = Widget.TVAnim.getAnim(this._expandAnim, el, 
                            function() { tree.expandComplete(node); });
            if (a) { 
                ++this._animCount;
                this.fireEvent("animStart", {
                        "node": node, 
                        "type": "expand"
                    });
                a.animate();
            }

            return true;
        }

        return false;
    },

    /**
     * Perform the collapse animation if configured, or just show the
     * element if not configured or too many animations are in progress
     * @method animateCollapse
     * @param el {HTMLElement} the element to animate
     * @param node {YAHOO.util.Node} the node that was expanded
     * @return {boolean} true if animation could be invoked, false otherwise
     */
    animateCollapse: function(el, node) {
        this.logger.log("animating collapse");

        if (this._collapseAnim && this._animCount < this.maxAnim) {
            // this.locked = true;
            var tree = this;
            var a = Widget.TVAnim.getAnim(this._collapseAnim, el, 
                            function() { tree.collapseComplete(node); });
            if (a) { 
                ++this._animCount;
                this.fireEvent("animStart", {
                        "node": node, 
                        "type": "collapse"
                    });
                a.animate();
            }

            return true;
        }

        return false;
    },

    /**
     * Function executed when the expand animation completes
     * @method expandComplete
     */
    expandComplete: function(node) {
        this.logger.log("expand complete: " + this.id);
        --this._animCount;
        this.fireEvent("animComplete", {
                "node": node, 
                "type": "expand"
            });
        // this.locked = false;
    },

    /**
     * Function executed when the collapse animation completes
     * @method collapseComplete
     */
    collapseComplete: function(node) {
        this.logger.log("collapse complete: " + this.id);
        --this._animCount;
        this.fireEvent("animComplete", {
                "node": node, 
                "type": "collapse"
            });
        // this.locked = false;
    },

    /**
     * Initializes the tree
     * @method init
     * @parm {string|HTMLElement} id the id of the element that will hold the tree
     * @private
     */
    init: function(id) {
		this._el = Dom.get(id);
		this.id = Dom.generateId(this._el,"yui-tv-auto-id-");

    /**
         * When animation is enabled, this event fires when the animation
         * starts
         * @event animStart
         * @type CustomEvent
         * @param {YAHOO.widget.Node} node the node that is expanding/collapsing
         * @parm {String} type the type of animation ("expand" or "collapse")
         */
        this.createEvent("animStart", this);

        /**
         * When animation is enabled, this event fires when the animation
         * completes
         * @event animComplete
         * @type CustomEvent
         * @param {YAHOO.widget.Node} node the node that is expanding/collapsing
         * @parm {String} type the type of animation ("expand" or "collapse")
         */
        this.createEvent("animComplete", this);

        /**
         * Fires when a node is going to be collapsed.  Return false to stop
         * the collapse.
         * @event collapse
         * @type CustomEvent
         * @param {YAHOO.widget.Node} node the node that is collapsing
         */
        this.createEvent("collapse", this);

        /**
         * Fires after a node is successfully collapsed.  This event will not fire
         * if the "collapse" event was cancelled.
         * @event collapseComplete
         * @type CustomEvent
         * @param {YAHOO.widget.Node} node the node that was collapsed
         */
        this.createEvent("collapseComplete", this);

        /**
         * Fires when a node is going to be expanded.  Return false to stop
         * the collapse.
         * @event expand
         * @type CustomEvent
         * @param {YAHOO.widget.Node} node the node that is expanding
         */
        this.createEvent("expand", this);

        /**
         * Fires after a node is successfully expanded.  This event will not fire
         * if the "expand" event was cancelled.
         * @event expandComplete
         * @type CustomEvent
         * @param {YAHOO.widget.Node} node the node that was expanded
         */
        this.createEvent("expandComplete", this);

    /**
         * Fires when the Enter key is pressed on a node that has the focus
         * @event enterKeyPressed
         * @type CustomEvent
         * @param {YAHOO.widget.Node} node the node that has the focus
         */
        this.createEvent("enterKeyPressed", this);
		
    /**
         * Fires when the label in a TextNode or MenuNode or content in an HTMLNode receives a Click.
	* The listener may return false to cancel toggling and focusing on the node.
         * @event clickEvent
         * @type CustomEvent
         * @param oArgs.event  {HTMLEvent} The event object
         * @param oArgs.node {YAHOO.widget.Node} node the node that was clicked
         */
        this.createEvent("clickEvent", this);
		
    /**
         * Fires when the focus receives the focus, when it changes from a Node 
	* to another Node or when it is completely lost (blurred)
         * @event focusChanged
         * @type CustomEvent
         * @param oArgs.oldNode  {YAHOO.widget.Node} Node that had the focus or null if none
         * @param oArgs.newNode {YAHOO.widget.Node} Node that receives the focus or null if none
         */
        
		this.createEvent('focusChanged',this);

	/**
         * Fires when the label in a TextNode or MenuNode or content in an HTMLNode receives a double Click
         * @event dblClickEvent
         * @type CustomEvent
         * @param oArgs.event  {HTMLEvent} The event object
         * @param oArgs.node {YAHOO.widget.Node} node the node that was clicked
         */
		var self = this;
        this.createEvent("dblClickEvent", {
			scope:this,
			onSubscribeCallback: function() {
				self._hasDblClickSubscriber = true;
			}
		});
		
	/**
         * Custom event that is fired when the text node label is clicked. 
         *  The node clicked is  provided as an argument
         *
         * @event labelClick
         * @type CustomEvent
         * @param {YAHOO.widget.Node} node the node clicked
	* @deprecated use clickEvent or dblClickEvent
         */
		this.createEvent("labelClick", this);


        this._nodes = [];

        // store a global reference
        TV.trees[this.id] = this;

        // Set up the root node
        this.root = new Widget.RootNode(this);

        var LW = Widget.LogWriter;

        this.logger = (LW) ? new LW(this.toString()) : YAHOO;

        this.logger.log("tree init: " + this.id);
		
        // YAHOO.util.Event.onContentReady(this.id, this.handleAvailable, this, true);
        // YAHOO.util.Event.on(this.id, "click", this.handleClick, this, true);
    },

    //handleAvailable: function() {
        //var Event = YAHOO.util.Event;
        //Event.on(this.id, 
    //},
 /**
     * Builds the TreeView from an object.  This is the method called by the constructor to build the tree when it has a second argument.
     * @method buildTreeFromObject
     * @param  oConfig {Array}  array containing a full description of the tree
     * 
     */
	buildTreeFromObject: function (oConfig) {
		this.logger.log('Building tree from object');
		var build = function (parent, oConfig) {
			var i, item, node, children, type, NodeType, ThisType;
			for (i = 0; i < oConfig.length; i++) {
				item = oConfig[i];
				if (Lang.isString(item)) {
					node = new Widget.TextNode(item, parent);
				} else if (Lang.isObject(item)) {
					children = item.children;
					delete item.children;
					type = item.type || 'text';
					delete item.type;
					switch (type.toLowerCase()) {
						case 'text':
							node = new Widget.TextNode(item, parent);
							break;
						case 'menu':
							node = new Widget.MenuNode(item, parent);
							break;
						case 'html':
							node = new Widget.HTMLNode(item, parent);
							break;
						default:
							NodeType = Widget[type];
							if (Lang.isObject(NodeType)) {
								for (ThisType = NodeType; ThisType && ThisType !== Widget.Node; ThisType = ThisType.superclass.constructor) {}
								if (ThisType) {
									node = new NodeType(item, parent);
								} else {
									this.logger.log('Invalid type in node definition: ' + type,'error');
								}
							} else {
								this.logger.log('Invalid type in node definition: ' + type,'error');
							}
					}
					if (children) {
						build(node,children);
					}
				} else {
					this.logger.log('Invalid node definition','error');
				}
			}
		};
							
					
		build(this.root,oConfig);
	},
/**
     * Builds the TreeView from existing markup.   Markup should consist of &lt;UL&gt; or &lt;OL&gt; elements, possibly nested.  
     * Depending what the &lt;LI&gt; elements contain the following will be created: <ul>
     * 	         <li>plain text:  a regular TextNode</li>
     * 	         <li>an (un-)ordered list: a nested branch</li>
     * 	         <li>anything else: an HTMLNode</li></ul>
     * Only the first  outermost (un-)ordered list in the markup and its children will be parsed.
     * Tree will be fully collapsed.
     *  HTMLNodes have hasIcon set to true if the markup for that node has a className called hasIcon.
     * @method buildTreeFromMarkup
     * @param {string|HTMLElement} id the id of the element that contains the markup or a reference to it.
     */
	buildTreeFromMarkup: function (id) {
		var expanded, title;
		this.logger.log('Building tree from existing markup');
		var build = function (parent,markup) {
			var el, node, child, text;
			for (el = Dom.getFirstChild(markup); el; el = Dom.getNextSibling(el)) {
				if (el.nodeType == 1) {
					switch (el.tagName.toUpperCase()) {
						case 'LI':
							expanded = Dom.hasClass(el,'expanded')  && !Dom.hasClass(el,'collapsed');
							title = el.title || el.alt || '';
							for (child = el.firstChild; child; child = child.nextSibling) {
								if (child.nodeType == 3) {
									text = Lang.trim(child.nodeValue);
									if (text.length) {
										node = new Widget.TextNode(
											{
												label:text,
												expanded:expanded,
												title:title
											}, parent);
									}
								} else {
									switch (child.tagName.toUpperCase()) {
										case 'UL':
										case 'OL':
											build(node,child);
											break;
										case 'A':
											node = new Widget.TextNode({
												label:child.innerHTML,
												href: child.href,
												target:child.target,
												title:child.title ||child.alt,
												expanded:expanded
											},parent);
											break;
										default:
											var d = document.createElement('div');
											d.appendChild(child.cloneNode(true));
											node = new Widget.HTMLNode(
												{
													html:d.innerHTML,
													title:title,
													expanded:expanded,
													hasIcon: true
												}, parent);
											break;
									}
								}
							}
							break;
						case 'UL':
						case 'OL':
							this.logger.log('ULs or OLs can only contain LI elements, not other UL or OL.  This will not work in some browsers','error');
							build(node, el);
							break;
					}
				}
			}
		
		};
		var markup = Dom.getChildrenBy(Dom.get(id),function (el) { 
			var tag = el.tagName.toUpperCase();
			return  tag == 'UL' || tag == 'OL';
		});
		if (markup.length) {
			build(this.root, markup[0]);
		} else {
			this.logger.log('Markup contains no UL or OL elements','warn');
		}
	},
    /**
     * Renders the tree boilerplate and visible nodes
     * @method render
     */
    render: function() {
        var html = this.root.getHtml();
        this.getEl().innerHTML = html;
		var getTarget = function (ev) {
			var target = Event.getTarget(ev); 
			if (target.tagName.toUpperCase() != 'TD') { target = Dom.getAncestorByTagName(target,'td'); }
			if (Lang.isNull(target)) { return null; }
			if (target.className.length === 0) {
				target = target.previousSibling;
				if (Lang.isNull(target)) { return null; }
			}
			return target;
		};
		if (!this._hasEvents) {
			Event.on(
				this.getEl(),
				'click',
				function (ev) {
					var self = this,
						el = Event.getTarget(ev),
						node = this.getNodeByElement(el);
					if (!node) { return; }
						
					var toggle = function () {
						if (node.expanded) {
							node.collapse();
						} else {
							node.expand();
						}
						node.focus();
					};
					
					if (Dom.hasClass(el, node.labelStyle) || Dom.getAncestorByClassName(el,node.labelStyle)) {
						this.logger.log("onLabelClick " + node.label);
						this.fireEvent('labelClick',node);
					}
					while (el && !Dom.hasClass(el.parentNode,'ygtvrow') && !/ygtv[tl][mp]h?h?/.test(el.className)) {
						el = Dom.getAncestorByTagName(el,'td');
					}
					if (el) {
						// If it is a spacer cell, do nothing
						if (/ygtv(blank)?depthcell/.test(el.className)) { return; }
						//  If it is a toggle cell, toggle
						if (/ygtv[tl][mp]h?h?/.test(el.className)) {
							toggle();
						} else {
							if (this._dblClickTimer) {
								window.clearTimeout(this._dblClickTimer);
								this._dblClickTimer = null;
							} else {
								if (this._hasDblClickSubscriber) {
									this._dblClickTimer = window.setTimeout(function () {
										self._dblClickTimer = null;
										if (self.fireEvent('clickEvent', {event:ev,node:node}) !== false) { 
											toggle();
										}
									}, 200);
								} else {
									if (self.fireEvent('clickEvent', {event:ev,node:node}) !== false) { 
										toggle();
										Event.preventDefault(ev);
									}
								}
							}
						}
					}
				},
				this,
				true
			);
			
			Event.on(
				this.getEl(),
				'dblclick',
				function (ev) {
					if (!this._hasDblClickSubscriber) { return; }
					var el = Event.getTarget(ev);
					while (!Dom.hasClass(el.parentNode,'ygtvrow')) {
						el = Dom.getAncestorByTagName(el,'td');
					}
					if (/ygtv(blank)?depthcell/.test(el.className)) { return;}
					if (!(/ygtv[tl][mp]h?h?/.test(el.className))) {
						this.fireEvent('dblClickEvent', {event:ev, node:this.getNodeByElement(el)}); 
						if (this._dblClickTimer) {
							window.clearTimeout(this._dblClickTimer);
							this._dblClickTimer = null;
						}
					}
				},
				this,
				true
			);
			Event.on(
				this.getEl(),
				'mouseover',
				function (ev) {
					var target = getTarget(ev);
					if (target) {
						target.className = target.className.replace(/ygtv([lt])([mp])/gi,'ygtv$1$2h');
					}
				}
			);
			Event.on(
				this.getEl(),
				'mouseout',
				function (ev) {
					var target = getTarget(ev);
					if (target) {
						target.className = target.className.replace(/ygtv([lt])([mp])h/gi,'ygtv$1$2');
					}
				}
			);
			Event.on(
				this.getEl(),
				'keydown',
				function (ev) {
					var target = Event.getTarget(ev),
						node = this.getNodeByElement(target),
						newNode = node,
						KEY = YAHOO.util.KeyListener.KEY;
					//console.log('key');

					switch(ev.keyCode) {
						case KEY.UP:
							this.logger.log('UP');
							do {
								if (newNode.previousSibling) {
									newNode = newNode.previousSibling;
								} else {
									newNode = newNode.parent;
								}
							} while (newNode && !newNode._canHaveFocus());
							if (newNode) { newNode.focus();	}
							Event.preventDefault(ev);
							break;
						case KEY.DOWN:
							this.logger.log('DOWN');
							do {
								if (newNode.nextSibling) {
									newNode = newNode.nextSibling;
								} else {
									newNode.expand();
									newNode = (newNode.children.length || null) && newNode.children[0];
								}
							} while (newNode && !newNode._canHaveFocus);
							if (newNode) { newNode.focus();}
							Event.preventDefault(ev);
							break;
						case KEY.LEFT:
							this.logger.log('LEFT');
							do {
								if (newNode.parent) {
									newNode = newNode.parent;
								} else {
									newNode = newNode.previousSibling;
								}
							} while (newNode && !newNode._canHaveFocus());
							if (newNode) { newNode.focus();}
							Event.preventDefault(ev);
							break;
						case KEY.RIGHT:
							this.logger.log('RIGHT');
							do {
								newNode.expand();
								if (newNode.children.length) {
									newNode = newNode.children[0];
								} else {
									newNode = newNode.nextSibling;
								}
							} while (newNode && !newNode._canHaveFocus());
							if (newNode) { newNode.focus();}
							Event.preventDefault(ev);
							break;
						case KEY.ENTER:
							this.logger.log('ENTER: ' + newNode.href);
							if (node.href) {
								if (node.target) {
									window.open(node.href,node.target);
								} else {
									window.location(node.href);
								}
							} else {
								node.toggle();
							}
							this.fireEvent('enterKeyPressed',node);
							Event.preventDefault(ev);
							break;
						case KEY.HOME:
							this.logger.log('HOME');
							newNode = this.getRoot();
							if (newNode.children.length) {newNode = newNode.children[0];}
							if (newNode._canHaveFocus()) { newNode.focus(); }
							Event.preventDefault(ev);
							break;
						case KEY.END:
							this.logger.log('END');
							newNode = newNode.parent.children;
							newNode = newNode[newNode.length -1];
							if (newNode._canHaveFocus()) { newNode.focus(); }
							Event.preventDefault(ev);
							break;
						// case KEY.PAGE_UP:
							// this.logger.log('PAGE_UP');
							// break;
						// case KEY.PAGE_DOWN:
							// this.logger.log('PAGE_DOWN');
							// break;
						case 107:  // plus key
							if (ev.shiftKey) {
								this.logger.log('Shift-PLUS');
								node.parent.expandAll();
							} else {
								this.logger.log('PLUS');
								node.expand();
							}
							break;
						case 109: // minus key
							if (ev.shiftKey) {
								this.logger.log('Shift-MINUS');
								node.parent.collapseAll();
							} else {
								this.logger.log('MINUS');
								node.collapse();
							}
							break;
						default:
							break;
					}
				},
				this,
				true
			);
		}
		this._hasEvents = true;
    },
	
  /**
     * Returns the tree's host element
     * @method getEl
     * @return {HTMLElement} the host element
     */
    getEl: function() {
        if (! this._el) {
            this._el = Dom.get(this.id);
        }
        return this._el;
    },

    /**
     * Nodes register themselves with the tree instance when they are created.
     * @method regNode
     * @param node {Node} the node to register
     * @private
     */
    regNode: function(node) {
        this._nodes[node.index] = node;
    },

    /**
     * Returns the root node of this tree
     * @method getRoot
     * @return {Node} the root node
     */
    getRoot: function() {
        return this.root;
    },

    /**
     * Configures this tree to dynamically load all child data
     * @method setDynamicLoad
     * @param {function} fnDataLoader the function that will be called to get the data
     * @param iconMode {int} configures the icon that is displayed when a dynamic
     * load node is expanded the first time without children.  By default, the 
     * "collapse" icon will be used.  If set to 1, the leaf node icon will be
     * displayed.
     */
    setDynamicLoad: function(fnDataLoader, iconMode) { 
        this.root.setDynamicLoad(fnDataLoader, iconMode);
    },

    /**
     * Expands all child nodes.  Note: this conflicts with the "multiExpand"
     * node property.  If expand all is called in a tree with nodes that
     * do not allow multiple siblings to be displayed, only the last sibling
     * will be expanded.
     * @method expandAll
     */
    expandAll: function() { 
        if (!this.locked) {
            this.root.expandAll(); 
        }
    },

    /**
     * Collapses all expanded child nodes in the entire tree.
     * @method collapseAll
     */
    collapseAll: function() { 
        if (!this.locked) {
            this.root.collapseAll(); 
        }
    },

    /**
     * Returns a node in the tree that has the specified index (this index
     * is created internally, so this function probably will only be used
     * in html generated for a given node.)
     * @method getNodeByIndex
     * @param {int} nodeIndex the index of the node wanted
     * @return {Node} the node with index=nodeIndex, null if no match
     */
    getNodeByIndex: function(nodeIndex) {
        var n = this._nodes[nodeIndex];
        return (n) ? n : null;
    },

    /**
     * Returns a node that has a matching property and value in the data
     * object that was passed into its constructor.
     * @method getNodeByProperty
     * @param {object} property the property to search (usually a string)
     * @param {object} value the value we want to find (usuall an int or string)
     * @return {Node} the matching node, null if no match
     */
    getNodeByProperty: function(property, value) {
        for (var i in this._nodes) {
			if (this._nodes.hasOwnProperty(i)) {
	            var n = this._nodes[i];
	            if (n.data && value == n.data[property]) {
	                return n;
	            }
			}
        }

        return null;
    },

    /**
     * Returns a collection of nodes that have a matching property 
     * and value in the data object that was passed into its constructor.  
     * @method getNodesByProperty
     * @param {object} property the property to search (usually a string)
     * @param {object} value the value we want to find (usuall an int or string)
     * @return {Array} the matching collection of nodes, null if no match
     */
    getNodesByProperty: function(property, value) {
        var values = [];
        for (var i in this._nodes) {
			if (this._nodes.hasOwnProperty(i)) {
	            var n = this._nodes[i];
	            if (n.data && value == n.data[property]) {
	                values.push(n);
	            }
			}
        }

        return (values.length) ? values : null;
    },

    /**
     * Returns the treeview node reference for an anscestor element
     * of the node, or null if it is not contained within any node
     * in this tree.
     * @method getNodeByElement
     * @param {HTMLElement} the element to test
     * @return {YAHOO.widget.Node} a node reference or null
     */
    getNodeByElement: function(el) {

        var p=el, m, re=/ygtv([^\d]*)(.*)/;

        do {

            if (p && p.id) {
                m = p.id.match(re);
                if (m && m[2]) {
                    return this.getNodeByIndex(m[2]);
                }
            }

            p = p.parentNode;

            if (!p || !p.tagName) {
                break;
            }

        } 
        while (p.id !== this.id && p.tagName.toLowerCase() !== "body");

        return null;
    },

    /**
     * Removes the node and its children, and optionally refreshes the 
     * branch of the tree that was affected.
     * @method removeNode
     * @param {Node} The node to remove
     * @param {boolean} autoRefresh automatically refreshes branch if true
     * @return {boolean} False is there was a problem, true otherwise.
     */
    removeNode: function(node, autoRefresh) { 

        // Don't delete the root node
        if (node.isRoot()) {
            return false;
        }

        // Get the branch that we may need to refresh
        var p = node.parent;
        if (p.parent) {
            p = p.parent;
        }

        // Delete the node and its children
        this._deleteNode(node);

        // Refresh the parent of the parent
        if (autoRefresh && p && p.childrenRendered) {
            p.refresh();
        }

        return true;
    },

    /**
     * wait until the animation is complete before deleting 
     * to avoid javascript errors
     * @method _removeChildren_animComplete
     * @param o the custom event payload
     * @private
     */
    _removeChildren_animComplete: function(o) {
        this.unsubscribe(this._removeChildren_animComplete);
        this.removeChildren(o.node);
    },

    /**
     * Deletes this nodes child collection, recursively.  Also collapses
     * the node, and resets the dynamic load flag.  The primary use for
     * this method is to purge a node and allow it to fetch its data
     * dynamically again.
     * @method removeChildren
     * @param {Node} node the node to purge
     */
    removeChildren: function(node) { 

        if (node.expanded) {
            // wait until the animation is complete before deleting to
            // avoid javascript errors
            if (this._collapseAnim) {
                this.subscribe("animComplete", 
                        this._removeChildren_animComplete, this, true);
                Widget.Node.prototype.collapse.call(node);
                return;
            }

            node.collapse();
        }

        this.logger.log("Removing children for " + node);
        while (node.children.length) {
            this._deleteNode(node.children[0]);
        }

        if (node.isRoot()) {
            Widget.Node.prototype.expand.call(node);
        }

        node.childrenRendered = false;
        node.dynamicLoadComplete = false;

        node.updateIcon();
    },

    /**
     * Deletes the node and recurses children
     * @method _deleteNode
     * @private
     */
    _deleteNode: function(node) { 
        // Remove all the child nodes first
        this.removeChildren(node);

        // Remove the node from the tree
        this.popNode(node);
    },

    /**
     * Removes the node from the tree, preserving the child collection 
     * to make it possible to insert the branch into another part of the 
     * tree, or another tree.
     * @method popNode
     * @param {Node} the node to remove
     */
    popNode: function(node) { 
        var p = node.parent;

        // Update the parent's collection of children
        var a = [];

        for (var i=0, len=p.children.length;i<len;++i) {
            if (p.children[i] != node) {
                a[a.length] = p.children[i];
            }
        }

        p.children = a;

        // reset the childrenRendered flag for the parent
        p.childrenRendered = false;

         // Update the sibling relationship
        if (node.previousSibling) {
            node.previousSibling.nextSibling = node.nextSibling;
        }

        if (node.nextSibling) {
            node.nextSibling.previousSibling = node.previousSibling;
        }

        node.parent = null;
        node.previousSibling = null;
        node.nextSibling = null;
        node.tree = null;

        // Update the tree's node collection 
        delete this._nodes[node.index];
    },

	/**
	* Nulls out the entire TreeView instance and related objects, removes attached
	* event listeners, and clears out DOM elements inside the container. After
	* calling this method, the instance reference should be expliclitly nulled by
	* implementer, as in myDataTable = null. Use with caution!
	*
	* @method destroy
	*/
	destroy : function() {
		// Since the label editor can be separated from the main TreeView control
		// the destroy method for it might not be there.
		if (this._destroyEditor) { this._destroyEditor(); }
		var el = this.getEl();
		Event.removeListener(el,'click');
		Event.removeListener(el,'dblclick');
		Event.removeListener(el,'mouseover');
		Event.removeListener(el,'mouseout');
		Event.removeListener(el,'keydown');
		for (var i = 0 ; i < this._nodes.length; i++) {
			var node = this._nodes[i];
			if (node && node.destroy) {node.destroy(); }
		}
		el.parentNode.removeChild(el);
		this._hasEvents = false;
	},
		
			


    /**
     * TreeView instance toString
     * @method toString
     * @return {string} string representation of the tree
     */
    toString: function() {
        return "TreeView " + this.id;
    },

    /**
     * Count of nodes in tree
     * @method getNodeCount
     * @return {int} number of nodes in the tree
     */
    getNodeCount: function() {
        return this.getRoot().getNodeCount();
    },

    /**
     * Returns an object which could be used to rebuild the tree.
     * It can be passed to the tree constructor to reproduce the same tree.
     * It will return false if any node loads dynamically, regardless of whether it is loaded or not.
     * @method getTreeDefinition
     * @return {Object | false}  definition of the tree or false if any node is defined as dynamic
     */
    getTreeDefinition: function() {
        return this.getRoot().getNodeDefinition();
    },

    /**
     * Abstract method that is executed when a node is expanded
     * @method onExpand
     * @param node {Node} the node that was expanded
     * @deprecated use treeobj.subscribe("expand") instead
     */
    onExpand: function(node) { },

    /**
     * Abstract method that is executed when a node is collapsed.
     * @method onCollapse
     * @param node {Node} the node that was collapsed.
     * @deprecated use treeobj.subscribe("collapse") instead
     */
    onCollapse: function(node) { }

};

/* Backwards compatibility aliases */
var PROT = TV.prototype;
 /**
     * Renders the tree boilerplate and visible nodes.
     *  Alias for render
     * @method draw
     * @deprecated Use render instead
     */
PROT.draw = PROT.render;

/* end backwards compatibility aliases */

YAHOO.augment(TV, YAHOO.util.EventProvider);

/**
 * Running count of all nodes created in all trees.  This is 
 * used to provide unique identifies for all nodes.  Deleting
 * nodes does not change the nodeCount.
 * @property YAHOO.widget.TreeView.nodeCount
 * @type int
 * @static
 */
TV.nodeCount = 0;

/**
 * Global cache of tree instances
 * @property YAHOO.widget.TreeView.trees
 * @type Array
 * @static
 * @private
 */
TV.trees = [];

/**
 * Global method for getting a tree by its id.  Used in the generated
 * tree html.
 * @method YAHOO.widget.TreeView.getTree
 * @param treeId {String} the id of the tree instance
 * @return {TreeView} the tree instance requested, null if not found.
 * @static
 */
TV.getTree = function(treeId) {
    var t = TV.trees[treeId];
    return (t) ? t : null;
};


/**
 * Global method for getting a node by its id.  Used in the generated
 * tree html.
 * @method YAHOO.widget.TreeView.getNode
 * @param treeId {String} the id of the tree instance
 * @param nodeIndex {String} the index of the node to return
 * @return {Node} the node instance requested, null if not found
 * @static
 */
TV.getNode = function(treeId, nodeIndex) {
    var t = TV.getTree(treeId);
    return (t) ? t.getNodeByIndex(nodeIndex) : null;
};


/**
     * Class name assigned to elements that have the focus
     *
     * @property TreeView.FOCUS_CLASS_NAME
     * @type String
     * @static
     * @final
     * @default "ygtvfocus"

	*/ 
TV.FOCUS_CLASS_NAME = 'ygtvfocus';

/**
 * Attempts to preload the images defined in the styles used to draw the tree by
 * rendering off-screen elements that use the styles.
 * @method YAHOO.widget.TreeView.preload
 * @param {string} prefix the prefix to use to generate the names of the
 * images to preload, default is ygtv
 * @static
 */
TV.preload = function(e, prefix) {
    prefix = prefix || "ygtv";

    YAHOO.log("Preloading images: " + prefix, "info", "TreeView");

    var styles = ["tn","tm","tmh","tp","tph","ln","lm","lmh","lp","lph","loading"];
    // var styles = ["tp"];

    var sb = [];
    
    // save the first one for the outer container
    for (var i=1; i < styles.length; i=i+1) { 
        sb[sb.length] = '<span class="' + prefix + styles[i] + '">&#160;</span>';
    }

    var f = document.createElement("div");
    var s = f.style;
    s.className = prefix + styles[0];
    s.position = "absolute";
    s.height = "1px";
    s.width = "1px";
    s.top = "-1000px";
    s.left = "-1000px";
    f.innerHTML = sb.join("");

    document.body.appendChild(f);

    Event.removeListener(window, "load", TV.preload);

};

Event.addListener(window,"load", TV.preload);
})();
