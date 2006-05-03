/**
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
* @class
* Panel is an implementation of Overlay that behaves like an OS window, with a draggable header and an optional close icon at the top right.
* @param {string}	el	The element ID representing the Panel <em>OR</em>
* @param {Element}	el	The element representing the Panel
* @param {object}	userConfig	The configuration object literal containing the configuration that should be set for this Panel. See configuration documentation for more details.
* @constructor
*/
YAHOO.widget.PhotoBox = function(el, userConfig) {
	if (arguments.length > 0) {
		YAHOO.widget.PhotoBox.superclass.constructor.call(this, el, userConfig);
	}
}

YAHOO.widget.PhotoBox.prototype = new YAHOO.widget.Panel();
YAHOO.widget.PhotoBox.prototype.constructor = YAHOO.widget.PhotoBox;

/**
* Reference to the Panel's superclass, Overlay
* @type class
* @final
*/
YAHOO.widget.PhotoBox.superclass = YAHOO.widget.Panel.prototype;

/**
* Constant representing the default CSS class used for a Panel
* @type string
* @final
*/
YAHOO.widget.PhotoBox.CSS_PHOTOBOX = "photobox";

YAHOO.widget.PhotoBox.NAV_FOOTER_HTML = "<a id=\"$back.id\" href=\"javascript:void(null)\" class=\"back\"><img src=\"img/ybox-back.gif\" /></a><a id=\"$next.id\" href=\"javascript:void(null)\" class=\"next\"><img src=\"img/ybox-next.gif\" /></a>";
/*
* The Overlay initialization method, which is executed for Overlay and all of its subclasses. This method is automatically called by the constructor, and  sets up all DOM references for pre-existing markup, and creates required markup if it is not already present.
* @param {string}	el	The element ID representing the Overlay <em>OR</em>
* @param {Element}	el	The element representing the Overlay
* @param {object}	userConfig	The configuration object literal containing the configuration that should be set for this Overlay. See configuration documentation for more details.
*/
YAHOO.widget.PhotoBox.prototype.init = function(el, userConfig) {
	YAHOO.widget.PhotoBox.superclass.init.call(this, el/*, userConfig*/);  // Note that we don't pass the user config in here yet because we only want it executed once, at the lowest subclass level
	
	this.beforeInitEvent.fire(YAHOO.widget.PhotoBox);

	YAHOO.util.Dom.addClass(this.innerElement, YAHOO.widget.PhotoBox.CSS_PHOTOBOX);
	
	if (userConfig) {
		this.cfg.applyConfig(userConfig, true);
	}
	
	this.setFooter(YAHOO.widget.PhotoBox.NAV_FOOTER_HTML.replace("$back.id",this.id+"_back").replace("$next.id",this.id+"_next"));
	
	this.renderEvent.subscribe(function() {
		var back = document.getElementById(this.id + "_back");
		var next = document.getElementById(this.id + "_next");

		YAHOO.util.Event.addListener(back, "click", this.back, this, true);
		YAHOO.util.Event.addListener(next, "click", this.next, this, true);

	}, this, true);

	this.initEvent.fire(YAHOO.widget.PhotoBox);
}

/**
* Initializes the custom events for Module which are fired automatically at appropriate times by the Module class.
*/
YAHOO.widget.PhotoBox.prototype.initEvents = function() {
	YAHOO.widget.PhotoBox.superclass.initEvents.call(this);

	this.showMaskEvent = new YAHOO.util.CustomEvent("showMask");
	this.hideMaskEvent = new YAHOO.util.CustomEvent("hideMask");
}

/**
* Initializes the class's configurable properties which can be changed using the Panel's Config object (cfg).
*/
YAHOO.widget.PhotoBox.prototype.initDefaultConfig = function() {
	YAHOO.widget.PhotoBox.superclass.initDefaultConfig.call(this);
	
	this.cfg.addProperty("photos", { handler:this.configPhotos, suppressEvent:true });
}

YAHOO.widget.PhotoBox.prototype.images = new Array();

YAHOO.widget.PhotoBox.prototype.configPhotos = function(type, args, obj) {
	var photos = args[0];

	if (photos) {
		this.images = new Array();

		if (! (photos instanceof Array)) {
			photos = [photos];
		}

		this.currentImage = 0;

		if (photos.length == 1) {
			this.footer.style.display = "none";
		}

		for (var p=0;p<photos.length;p++) {
			var photo = photos[p];
			var img = new Image();
			img.src = photo.src;
			img.title = photo.caption;
			img.id = this.id + "_img";
			img.width = 500
			this.images[this.images.length] = img;
		}

		this.setImage(0);
	}

}

YAHOO.widget.PhotoBox.prototype.setImage = function(index) {
	var photos = this.cfg.getProperty("photos");

	if (photos) {
		if (! (photos instanceof Array)) {
			photos = [photos];
		}
		
		var back = document.getElementById(this.id + "_back");
		var next = document.getElementById(this.id + "_next");
		var img =  document.getElementById(this.id + "_img");
		var title = document.getElementById(this.id + "_title");

		this.currentImage = index;

		var current = this.images[index];

		var imgNode = document.createElement("IMG");
		imgNode.setAttribute("src",current.src);
		imgNode.setAttribute("title",current.title);
		imgNode.setAttribute("width",500);
		imgNode.setAttribute("id",current.id);
		

		img.parentNode.replaceChild((this.browser == "safari"?imgNode:current), img);
		
		this.body.style.height = "auto";

		//alert(this.body.style.height);
		//img.src = current.src;
		//img.title = current.caption;

		title.innerHTML = current.title;

		if (this.currentImage == 0) {
			back.style.display = "none";
		} else {
			back.style.display = "block";
		}

		if (this.currentImage == (photos.length-1)) {
			next.style.display = "none";
		} else {
			next.style.display = "block";
		}
	}
}

YAHOO.widget.PhotoBox.prototype.next = function() {	
	if (typeof this.currentImage == 'undefined') {
		this.currentImage = 0;
	}

	this.setImage(this.currentImage+1);
}

YAHOO.widget.PhotoBox.prototype.back = function() {
	if (typeof this.currentImage == 'undefined') {
		this.currentImage = 0;
	}

	this.setImage(this.currentImage-1);
}

YAHOO.widget.PhotoBox.prototype.configModal = function(type, args, obj) {
	var modal = args[0];

	if (modal) {
		this.buildMask();

		if (typeof this.maskOpacity == 'undefined') {
			this.mask.style.visibility = "hidden";
			this.mask.style.display = "block";
			this.maskOpacity = YAHOO.util.Dom.getStyle(this.mask,"opacity");
			this.mask.style.display = "none";
			this.mask.style.visibility = "visible";
		}

		if (! YAHOO.util.Config.alreadySubscribed( this.beforeShowEvent, this.showMask, this ) ) {
			this.beforeShowEvent.subscribe(this.showMask, this, true);
		}
		if (! YAHOO.util.Config.alreadySubscribed( this.beforeHideEvent, this.hideMask, this) ) {
			this.beforeHideEvent.subscribe(this.hideMask, this, true);
		}
		if (! YAHOO.util.Config.alreadySubscribed( YAHOO.widget.Overlay.windowResizeEvent, this.sizeMask, this ) ) {
			YAHOO.widget.Overlay.windowResizeEvent.subscribe(this.sizeMask, this, true);
		}
	} else {
		this.beforeShowEvent.unsubscribe(this.showMask, this);
		this.beforeHideEvent.unsubscribe(this.hideMask, this);
		YAHOO.widget.Overlay.windowResizeEvent.unsubscribe(this.sizeMask);
	}
}

YAHOO.widget.PhotoBox.prototype.showMask = function() {
	if (this.cfg.getProperty("modal") && this.mask) {
		YAHOO.util.Dom.addClass(document.body, "masked");
		this.sizeMask();

		var o = this.maskOpacity;

		if (! this.maskAnimIn) {
			this.maskAnimIn = new YAHOO.util.Anim(this.mask, {opacity: {to:o}}, 0.25)
			YAHOO.util.Dom.setStyle(this.mask, "opacity", 0);
		}

		if (! this.maskAnimOut) {
			this.maskAnimOut = new YAHOO.util.Anim(this.mask, {opacity: {to:0}}, 0.25)
			this.maskAnimOut.onComplete.subscribe(function() {
													this.mask.tabIndex = -1;
													this.mask.style.display = "none";
													this.hideMaskEvent.fire();
													YAHOO.util.Dom.removeClass(document.body, "masked");
												  }, this, true);
			
		}
		this.mask.style.display = "block";
		this.maskAnimIn.animate();
		this.mask.tabIndex = 0;
		this.showMaskEvent.fire();
	}
}

YAHOO.widget.PhotoBox.prototype.hideMask = function() {
	if (this.cfg.getProperty("modal") && this.mask) {
		this.maskAnimOut.animate();
	}
}