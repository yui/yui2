/*
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
Version 0.12
*/

/**
* ContainerEffect encapsulates animation transitions that are executed when an Overlay is shown or hidden.
* @namespace YAHOO.widget
* @class ContainerEffect
* @constructor
* @param {YAHOO.widget.Overlay}	overlay		The Overlay that the animation should be associated with
* @param {Object}	attrIn		The object literal representing the animation arguments to be used for the animate-in transition. The arguments for this literal are: attributes(object, see YAHOO.util.Anim for description), duration(Number), and method(i.e. YAHOO.util.Easing.easeIn).
* @param {Object}	attrOut		The object literal representing the animation arguments to be used for the animate-out transition. The arguments for this literal are: attributes(object, see YAHOO.util.Anim for description), duration(Number), and method(i.e. YAHOO.util.Easing.easeIn).
* @param {HTMLElement}	targetElement	Optional. The target element that should be animated during the transition. Defaults to overlay.element.
* @param {class}	Optional. The animation class to instantiate. Defaults to YAHOO.util.Anim. Other options include YAHOO.util.Motion.
*/
YAHOO.widget.ContainerEffect = function(overlay, attrIn, attrOut, targetElement, animClass) {
	if (! animClass) {
		animClass = YAHOO.util.Anim;
	}

	/**
	* The overlay to animate
	* @property overlay
	* @type YAHOO.widget.Overlay
	*/
	this.overlay = overlay;
	/**
	* The animation attributes to use when transitioning into view
	* @property attrIn
	* @type Object
	*/
	this.attrIn = attrIn;
	/**
	* The animation attributes to use when transitioning out of view
	* @property attrOut
	* @type Object
	*/
	this.attrOut = attrOut;
	/**
	* The target element to be animated
	* @property targetElement
	* @type HTMLElement
	*/
	this.targetElement = targetElement || overlay.element;
	/**
	* The animation class to use for animating the overlay
	* @property animClass
	* @type class
	*/
	this.animClass = animClass;
};

/**
* Initializes the animation classes and events.
* @method init
*/
YAHOO.widget.ContainerEffect.prototype.init = function() {
	this.beforeAnimateInEvent = new YAHOO.util.CustomEvent("beforeAnimateIn");
	this.beforeAnimateOutEvent = new YAHOO.util.CustomEvent("beforeAnimateOut");

	this.animateInCompleteEvent = new YAHOO.util.CustomEvent("animateInComplete");
	this.animateOutCompleteEvent = new YAHOO.util.CustomEvent("animateOutComplete");

	this.animIn = new this.animClass(this.targetElement, this.attrIn.attributes, this.attrIn.duration, this.attrIn.method);
	this.animIn.onStart.subscribe(this.handleStartAnimateIn, this);
	this.animIn.onTween.subscribe(this.handleTweenAnimateIn, this);
	this.animIn.onComplete.subscribe(this.handleCompleteAnimateIn, this);

	this.animOut = new this.animClass(this.targetElement, this.attrOut.attributes, this.attrOut.duration, this.attrOut.method);
	this.animOut.onStart.subscribe(this.handleStartAnimateOut, this);
	this.animOut.onTween.subscribe(this.handleTweenAnimateOut, this);
	this.animOut.onComplete.subscribe(this.handleCompleteAnimateOut, this);
};

/**
* Triggers the in-animation.
* @method animateIn
*/
YAHOO.widget.ContainerEffect.prototype.animateIn = function() {
	this.beforeAnimateInEvent.fire();
	this.animIn.animate();
};

/**
* Triggers the out-animation.
* @method animateOut
*/
YAHOO.widget.ContainerEffect.prototype.animateOut = function() {
	this.beforeAnimateOutEvent.fire();
	this.animOut.animate();
};

/**
* The default onStart handler for the in-animation.
* @method handleStartAnimateIn
* @param {String} type	The CustomEvent type
* @param {Object[]}	args	The CustomEvent arguments
* @param {Object} obj	The scope object
*/
YAHOO.widget.ContainerEffect.prototype.handleStartAnimateIn = function(type, args, obj) { };
/**
* The default onTween handler for the in-animation.
* @method handleTweenAnimateIn
* @param {String} type	The CustomEvent type
* @param {Object[]}	args	The CustomEvent arguments
* @param {Object} obj	The scope object
*/
YAHOO.widget.ContainerEffect.prototype.handleTweenAnimateIn = function(type, args, obj) { };
/**
* The default onComplete handler for the in-animation.
* @method handleCompleteAnimateIn
* @param {String} type	The CustomEvent type
* @param {Object[]}	args	The CustomEvent arguments
* @param {Object} obj	The scope object
*/
YAHOO.widget.ContainerEffect.prototype.handleCompleteAnimateIn = function(type, args, obj) { };

/**
* The default onStart handler for the out-animation.
* @method handleStartAnimateOut
* @param {String} type	The CustomEvent type
* @param {Object[]}	args	The CustomEvent arguments
* @param {Object} obj	The scope object
*/
YAHOO.widget.ContainerEffect.prototype.handleStartAnimateOut = function(type, args, obj) { };
/**
* The default onTween handler for the out-animation.
* @method handleTweenAnimateOut
* @param {String} type	The CustomEvent type
* @param {Object[]}	args	The CustomEvent arguments
* @param {Object} obj	The scope object
*/
YAHOO.widget.ContainerEffect.prototype.handleTweenAnimateOut = function(type, args, obj) { };
/**
* The default onComplete handler for the out-animation.
* @method handleCompleteAnimateOut
* @param {String} type	The CustomEvent type
* @param {Object[]}	args	The CustomEvent arguments
* @param {Object} obj	The scope object
*/
YAHOO.widget.ContainerEffect.prototype.handleCompleteAnimateOut = function(type, args, obj) { };

/**
* Returns a string representation of the object.
* @method toString
* @return {String}	The string representation of the ContainerEffect
*/ 
YAHOO.widget.ContainerEffect.prototype.toString = function() {
	var output = "ContainerEffect";
	if (this.overlay) {
		output += " [" + this.overlay.toString() + "]";
	}
	return output;
};

/**
* A pre-configured ContainerEffect instance that can be used for fading an overlay in and out.
* @method FADE
* @static
* @param {Overlay}	overlay	The Overlay object to animate
* @param {Number}	dur	The duration of the animation
* @return {ContainerEffect}	The configured ContainerEffect object
*/
YAHOO.widget.ContainerEffect.FADE = function(overlay, dur) {
	var fade = new YAHOO.widget.ContainerEffect(overlay, { attributes:{opacity: {from:0, to:1}}, duration:dur, method:YAHOO.util.Easing.easeIn }, { attributes:{opacity: {to:0}}, duration:dur, method:YAHOO.util.Easing.easeOut}, overlay.element );

	fade.handleStartAnimateIn = function(type,args,obj) {
		YAHOO.util.Dom.addClass(obj.overlay.element, "hide-select");
		
		if (! obj.overlay.underlay) {
			obj.overlay.cfg.refireEvent("underlay");
		}

		if (obj.overlay.underlay) {
			obj.initialUnderlayOpacity = YAHOO.util.Dom.getStyle(obj.overlay.underlay, "opacity");
			obj.overlay.underlay.style.filter = null;
		}

		YAHOO.util.Dom.setStyle(obj.overlay.element, "visibility", "visible"); 
		YAHOO.util.Dom.setStyle(obj.overlay.element, "opacity", 0);
	};

	fade.handleCompleteAnimateIn = function(type,args,obj) {
		YAHOO.util.Dom.removeClass(obj.overlay.element, "hide-select");

		if (obj.overlay.element.style.filter) {
			obj.overlay.element.style.filter = null;
		}			
		
		if (obj.overlay.underlay) {
			YAHOO.util.Dom.setStyle(obj.overlay.underlay, "opacity", obj.initialUnderlayOpacity);
		}

		obj.overlay.cfg.refireEvent("iframe");
		obj.animateInCompleteEvent.fire();
	};

	fade.handleStartAnimateOut = function(type, args, obj) {
		YAHOO.util.Dom.addClass(obj.overlay.element, "hide-select");

		if (obj.overlay.underlay) {
			obj.overlay.underlay.style.filter = null;
		}
	};

	fade.handleCompleteAnimateOut =  function(type, args, obj) { 
		YAHOO.util.Dom.removeClass(obj.overlay.element, "hide-select");
		if (obj.overlay.element.style.filter) {
			obj.overlay.element.style.filter = null;
		}				
		YAHOO.util.Dom.setStyle(obj.overlay.element, "visibility", "hidden");
		YAHOO.util.Dom.setStyle(obj.overlay.element, "opacity", 1); 

		obj.overlay.cfg.refireEvent("iframe");

		obj.animateOutCompleteEvent.fire();
	};	

	fade.init();
	return fade;
};


/**
* A pre-configured ContainerEffect instance that can be used for sliding an overlay in and out.
* @method SLIDE
* @static
* @param {Overlay}	overlay	The Overlay object to animate
* @param {Number}	dur	The duration of the animation
* @return {ContainerEffect}	The configured ContainerEffect object
*/
YAHOO.widget.ContainerEffect.SLIDE = function(overlay, dur) {
	var x = overlay.cfg.getProperty("x") || YAHOO.util.Dom.getX(overlay.element);
	var y = overlay.cfg.getProperty("y") || YAHOO.util.Dom.getY(overlay.element);

	var clientWidth = YAHOO.util.Dom.getClientWidth();
	var offsetWidth = overlay.element.offsetWidth;

	var slide = new YAHOO.widget.ContainerEffect(overlay, { 
															attributes:{ points: { to:[x, y] } }, 
															duration:dur, 
															method:YAHOO.util.Easing.easeIn 
														}, 
														{ 
															attributes:{ points: { to:[(clientWidth+25), y] } },
															duration:dur, 
															method:YAHOO.util.Easing.easeOut
														},
														overlay.element,
														YAHOO.util.Motion);
												

	slide.handleStartAnimateIn = function(type,args,obj) {
		obj.overlay.element.style.left = (-25-offsetWidth) + "px";
		obj.overlay.element.style.top  = y + "px";
	};
	
	slide.handleTweenAnimateIn = function(type, args, obj) {


		var pos = YAHOO.util.Dom.getXY(obj.overlay.element);

		var currentX = pos[0];
		var currentY = pos[1];

		if (YAHOO.util.Dom.getStyle(obj.overlay.element, "visibility") == "hidden" && currentX < x) {
			YAHOO.util.Dom.setStyle(obj.overlay.element, "visibility", "visible");
		}

		obj.overlay.cfg.setProperty("xy", [currentX,currentY], true);
		obj.overlay.cfg.refireEvent("iframe");
	};
	
	slide.handleCompleteAnimateIn = function(type, args, obj) {
		obj.overlay.cfg.setProperty("xy", [x,y], true);
		obj.startX = x;
		obj.startY = y;
		obj.overlay.cfg.refireEvent("iframe");
		obj.animateInCompleteEvent.fire();
	};

	slide.handleStartAnimateOut = function(type, args, obj) {
		var vw = YAHOO.util.Dom.getViewportWidth();
		
		var pos = YAHOO.util.Dom.getXY(obj.overlay.element);

		var yso = pos[1];

		var currentTo = obj.animOut.attributes.points.to;
		obj.animOut.attributes.points.to = [(vw+25), yso];
	};

	slide.handleTweenAnimateOut = function(type, args, obj) {
		var pos = YAHOO.util.Dom.getXY(obj.overlay.element);

		var xto = pos[0];
		var yto = pos[1];

		obj.overlay.cfg.setProperty("xy", [xto,yto], true);
		obj.overlay.cfg.refireEvent("iframe");
	};

	slide.handleCompleteAnimateOut = function(type, args, obj) { 
		YAHOO.util.Dom.setStyle(obj.overlay.element, "visibility", "hidden");

		obj.overlay.cfg.setProperty("xy", [x,y]);
		obj.animateOutCompleteEvent.fire();
	};	

	slide.init();
	return slide;
};