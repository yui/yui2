/**
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
* @class
* A collection of ContainerEffect classes specifically used for animating Panels.
*/
YAHOO.widget.PanelEffect = function() { }

/**
* A pre-configured ContainerEffect instance that can be used for expanding the Panel body vertically
* @param {Panel}	The Panel object to animate
* @param {float}	The duration of the animation
* @type ContainerEffect
*/
YAHOO.widget.PanelEffect.BODY_EXPAND_V = function(overlay, dur) {
	var offsetHeight = overlay.body.offsetHeight;

	var padTop = YAHOO.util.Dom.getStyle(overlay.body, "paddingTop");
	var padBottom = YAHOO.util.Dom.getStyle(overlay.body, "paddingBottom");


	var expand = new YAHOO.widget.ContainerEffect(overlay, { attributes:{height: {from:0, to:(offsetHeight-parseInt(padTop)-parseInt(padBottom))}}, duration:dur, method:YAHOO.util.Easing.easeIn }, { attributes:{height: {to:0}}, duration:dur, method:YAHOO.util.Easing.easeOut}, overlay.body );

	expand.handleTweenAnimateIn = function(type, args, obj) {
		obj.overlay.cfg.refireEvent("underlay");
		obj.overlay.cfg.refireEvent("iframe");
		if (YAHOO.util.Dom.getStyle(obj.overlay.element, "visibility") == "hidden") {
			YAHOO.util.Dom.setStyle(obj.overlay.element, "visibility", "visible");
		}
	}

	expand.handleCompleteAnimateOut =  function(type, args, obj) { 
		YAHOO.util.Dom.setStyle(obj.overlay.element, "visibility", "hidden");
		YAHOO.util.Dom.setStyle(obj.overlay.body, "height", "auto");
	};	

	expand.handleTweenAnimateOut = function(type, args, obj) {
		obj.overlay.cfg.refireEvent("underlay");
		obj.overlay.cfg.refireEvent("iframe");
	}

	expand.init();
	return expand;
};

/**
* A pre-configured ContainerEffect instance that can be used for expanding the Panel horizontally
* @param {Panel}	The Panel object to animate
* @param {float}	The duration of the animation
* @type ContainerEffect
*/
YAHOO.widget.PanelEffect.EXPAND_H = function(overlay, dur) {
	var initialWidth = YAHOO.util.Dom.getStyle(overlay.innerElement, "width");

	var offsetWidth = overlay.innerElement.offsetWidth;
	var offsetHeight = overlay.innerElement.offsetHeight;

	var expand = new YAHOO.widget.ContainerEffect(overlay, { attributes:{width: {from:0, to:parseInt(initialWidth), unit:"em" }}, duration:dur, method:YAHOO.util.Easing.easeIn }, { attributes:{width: {to:0, unit:"em"}}, duration:dur, method:YAHOO.util.Easing.easeOut}, overlay.innerElement );

	expand.handleStartAnimateIn = function(type,args,obj) {
		var w = obj.cachedOffsetWidth || obj.overlay.innerElement.offsetWidth;

		if (obj.overlay.header) {
			var padLeft = YAHOO.util.Dom.getStyle(obj.overlay.header, "paddingLeft");
			var padRight = YAHOO.util.Dom.getStyle(obj.overlay.header, "paddingRight");
			obj.overlay.header.style.width = (w-parseInt(padLeft)-parseInt(padRight)) + "px";
		}
		if (obj.overlay.body) {
			var padLeft = YAHOO.util.Dom.getStyle(obj.overlay.body, "paddingLeft");
			var padRight = YAHOO.util.Dom.getStyle(obj.overlay.body, "paddingRight");
			obj.overlay.body.style.width = (w-parseInt(padLeft)-parseInt(padRight)) + "px";
		}
		if (obj.overlay.footer) {
			var padLeft = YAHOO.util.Dom.getStyle(obj.overlay.footer, "paddingLeft");
			var padRight = YAHOO.util.Dom.getStyle(obj.overlay.footer, "paddingRight");
			obj.overlay.footer.style.width = (w-parseInt(padLeft)-parseInt(padRight)) + "px";
		}
	}

	expand.handleTweenAnimateIn = function(type, args, obj) {
		obj.overlay.cfg.refireEvent("underlay");
		obj.overlay.cfg.refireEvent("iframe");
		if (YAHOO.util.Dom.getStyle(obj.overlay.element, "visibility") == "hidden") {
			YAHOO.util.Dom.setStyle(obj.overlay.element, "visibility", "visible");
		}
	}

	expand.handleCompleteAnimateIn = function(type,args,obj) {
		YAHOO.util.Dom.setStyle(obj.overlay.innerElement, "height", "auto");
		YAHOO.util.Dom.setStyle(obj.overlay.innerElement, "width", initialWidth);

		if (obj.overlay.header) {
			obj.overlay.header.style.width = "auto";
		}
		if (obj.overlay.body) {
			obj.overlay.body.style.width = "auto";
		}
		if (obj.overlay.footer) {
			obj.overlay.footer.style.width = "auto";
		}
	}

	expand.handleStartAnimateOut = function(type,args,obj) {
		var w = obj.overlay.innerElement.offsetWidth;
		obj.cachedOffsetWidth = w;

		if (obj.overlay.header) {
			var padLeft = YAHOO.util.Dom.getStyle(obj.overlay.header, "paddingLeft");
			var padRight = YAHOO.util.Dom.getStyle(obj.overlay.header, "paddingRight");
			obj.overlay.header.style.width = (w-parseInt(padLeft)-parseInt(padRight)) + "px";
		}
		if (obj.overlay.body) {
			var padLeft = YAHOO.util.Dom.getStyle(obj.overlay.body, "paddingLeft");
			var padRight = YAHOO.util.Dom.getStyle(obj.overlay.body, "paddingRight");
			obj.overlay.body.style.width = (w-parseInt(padLeft)-parseInt(padRight)) + "px";
		}
		if (obj.overlay.footer) {
			var padLeft = YAHOO.util.Dom.getStyle(obj.overlay.footer, "paddingLeft");
			var padRight = YAHOO.util.Dom.getStyle(obj.overlay.footer, "paddingRight");
			obj.overlay.footer.style.width = (w-parseInt(padLeft)-parseInt(padRight)) + "px";
		}
	}

	expand.handleTweenAnimateOut = function(type, args, obj) {
		obj.overlay.cfg.refireEvent("underlay");
		obj.overlay.cfg.refireEvent("iframe");
	}

	expand.handleCompleteAnimateOut =  function(type, args, obj) { 
		YAHOO.util.Dom.setStyle(obj.overlay.element, "visibility", "hidden");
		YAHOO.util.Dom.setStyle(obj.overlay.innerElement, "height", "auto");
		YAHOO.util.Dom.setStyle(obj.overlay.innerElement, "width", initialWidth);

		if (obj.overlay.header) {
			obj.overlay.header.style.width = "auto";
		}
		if (obj.overlay.body) {
			obj.overlay.body.style.width = "auto";
		}
		if (obj.overlay.footer) {
			obj.overlay.footer.style.width = "auto";
		}
	};	

	expand.init();
	return expand;
};


/**
* A pre-configured ContainerEffect instance that can be used for expanding the Panel vertically
* @param {Panel}	The Panel object to animate
* @param {float}	The duration of the animation
* @type ContainerEffect
*/
YAHOO.widget.PanelEffect.EXPAND_V = function(overlay, dur) {
	var offsetWidth = overlay.innerElement.offsetWidth;
	var offsetHeight = overlay.innerElement.offsetHeight;

	var expand = new YAHOO.widget.ContainerEffect(overlay, { attributes:{height: {from:0, to:offsetHeight}}, duration:dur, method:YAHOO.util.Easing.easeIn }, { attributes:{height: {to:0}}, duration:dur, method:YAHOO.util.Easing.easeOut}, overlay.innerElement );

	expand.handleTweenAnimateIn = function(type, args, obj) {
		obj.overlay.cfg.refireEvent("underlay");
		obj.overlay.cfg.refireEvent("iframe");
		if (YAHOO.util.Dom.getStyle(obj.overlay.element, "visibility") == "hidden") {
			YAHOO.util.Dom.setStyle(obj.overlay.element, "visibility", "visible");
		}
	}

	expand.handleCompleteAnimateIn = function(type,args,obj) {
		YAHOO.util.Dom.setStyle(obj.overlay.innerElement, "height", "auto");
	}

	expand.handleStartAnimateOut = function(type,args,obj) {
		var w = obj.overlay.innerElement.offsetWidth;
		obj.cachedOffsetWidth = w;
	}

	expand.handleTweenAnimateOut = function(type, args, obj) {
		obj.overlay.cfg.refireEvent("underlay");
		obj.overlay.cfg.refireEvent("iframe");
	}

	expand.handleCompleteAnimateOut =  function(type, args, obj) { 
		YAHOO.util.Dom.setStyle(obj.overlay.element, "visibility", "hidden");
		YAHOO.util.Dom.setStyle(obj.overlay.innerElement, "height", "auto");

		if (obj.overlay.header) {
			obj.overlay.header.style.width = "auto";
		}
		if (obj.overlay.body) {
			obj.overlay.body.style.width = "auto";
		}
		if (obj.overlay.footer) {
			obj.overlay.footer.style.width = "auto";
		}
	};	

	expand.init();
	return expand;
};