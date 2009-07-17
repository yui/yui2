/**
 *
 * @module progressbar
 * @requires yahoo, dom, event, element
 * @optional animation
 * @title ProgressBar Widget
 */

(function () {
	var Dom = YAHOO.util.Dom,
		Lang = YAHOO.lang,
		
		DIRECTION_LTR = 'ltr',
		DIRECTION_RTL = 'rtl',
		DIRECTION_TTB = 'ttb',
		DIRECTION_BTT = 'btt';
		
	
	/**
	 * The ProgressBar widget provides an easy way to draw a bar depicting progress of an operation,
	 * a level meter, ranking or any such simple linear measure.
	 * It allows for highly customized styles including animation, vertical or horizontal and forward or reverse.
	 * @namespace YAHOO.widget
	 * @class ProgressBar
	 * @extends YAHOO.util.Element
	 * @param oConfigs {object} An object containing any configuration attributes to be set 
	 * @constructor
	 */        
	var Prog = function(oConfigs) {
		YAHOO.log('Creating ProgressBar instance','info','ProgressBar');
        
		Prog.superclass.constructor.call(this, document.createElement('div') , oConfigs);
		this._init(oConfigs);
		
	};
	
	YAHOO.widget.ProgressBar = Prog;

    /**
     * Class name assigned to ProgressBar container.
     *
     * @property ProgressBar.CLASS_PROGBAR
     * @type String
     * @static
     * @final
     * @default "yui-pb"
     */
	Prog.CLASS_PROGBAR = 'yui-pb';
    /**
     * Class name assigned to the mask element.
     *
     * @property ProgressBar.CLASS_MASK
     * @type String
     * @static
     * @final
     * @default "yui-pb-mask"
     */
	Prog.CLASS_MASK = Prog.CLASS_PROGBAR + '-mask';
    /**
     * Class name assigned to the bar element.
     *
     * @property ProgressBar.CLASS_BAR
     * @type String
     * @static
     * @final
     * @default "yui-pb-bar"
     */
	Prog.CLASS_BAR = Prog.CLASS_PROGBAR + '-bar';
    /**
     * Class name assigned to the element showing the current value.
     *
     * @property ProgressBar.CLASS_CAPTION
     * @type String
     * @static
     * @final
     * @default "yui-pb-value"
     */
	Prog.CLASS_CAPTION = Prog.CLASS_PROGBAR + '-caption';
    /**
     * Class name assigned to the bar while animated.
     *
     * @property ProgressBar.CLASS_ANIM
     * @type String
     * @static
     * @final
     * @default "yui-pb-anim"
     */
	Prog.CLASS_ANIM = Prog.CLASS_PROGBAR + '-anim';
    /**
     * Class name assigned to the top-left cuadrant of the mask.
     *
     * @property ProgressBar.CLASS_TL
     * @type String
     * @static
     * @final
     * @default "yui-pb-tl"
     */
	Prog.CLASS_TL = Prog.CLASS_PROGBAR + '-tl';
    /**
     * Class name assigned to the top-right cuadrant of the mask.
     *
     * @property ProgressBar.CLASS_TR
     * @type String
     * @static
     * @final
     * @default "yui-pb-tr"
     */
	Prog.CLASS_TR = Prog.CLASS_PROGBAR + '-tr';
    /**
     * Class name assigned to the bottom-left cuadrant of the mask.
     *
     * @property ProgressBar.CLASS_BL
     * @type String
     * @static
     * @final
     * @default "yui-pb-bl"
     */
	Prog.CLASS_BL = Prog.CLASS_PROGBAR + '-bl';
    /**
     * Class name assigned to the bottom-right cuadrant of the mask.
     *
     * @property ProgressBar.CLASS_BR
     * @type String
     * @static
     * @final
     * @default "yui-pb-br"
     */
	Prog.CLASS_BR = Prog.CLASS_PROGBAR + '-br';
    /**
     * String containing the HTML string which is the basis for the Progress Bar.
     *
     * @property ProgressBar.MARKUP
     * @type String
     * @static
     * @final
     * @default (too long)
     */
	Prog.MARKUP = [
		'<div class="',
		Prog.CLASS_BAR,
		'"></div><div class="',
		Prog.CLASS_CAPTION,
		'"></div><div class="',
		Prog.CLASS_MASK,
		'"><div class="',
		Prog.CLASS_TL,
		'"></div><div class="',
		Prog.CLASS_TR,
		'"></div><div class="',
		Prog.CLASS_BL,
		'"></div><div class="',
		Prog.CLASS_BR,
		'"></div></div>'
	].join('');

	
	Lang.extend(Prog, YAHOO.util.Element, {
		/**
		 * Initialization code for the widget, separate from the constructor to allow for overriding/patching.
		 * It is called after <a href="#method_initAttributes">initAttributes</a>
		 *
		 * @method _init
		 * @param oConfigs {Object} (Optional) Object literal definition of configuration values.  
		 * @protected
		 */	
		 _init: function (oConfigs) {
			/**
			 * Fires when the value is about to change.  It reports the starting value
			 * @event start
			 * @type CustomEvent
			 * @param value {Number} the current (initial) value
			 */
			// No actual creation required, event will be created when subscribed to
			//this.createEvent('start');
			/**
			 * If animation is loaded, it will trigger for each frame of the animation providing partial values
			 * @event progress
			 * @type CustomEvent
			 * @param  value{Number} the current (progress) value
			 */
			// No actual creation required, event will be created when subscribed to
			//this.createEvent('progress');
			/**
			 * It will fire at the end of the animation or immediately upon progress values if animation is not loaded
			 * @event complete
			 * @type CustomEvent
			 * @param value {Number} the current (final)  value
			 */
			// No actual creation required, event will be created when listened to
			//this.createEvent('complete');
			

		},
		/**
		 * Implementation of Element's abstract method. Sets up config values.
		 *
		 * @method initAttributes
		 * @param oConfigs {Object} (Optional) Object literal definition of configuration values.
		 * @private
		 */	
		initAttributes: function (oConfigs) {
			YAHOO.log('Initializing configuration attributes','info','ProgressBar');

		    Prog.superclass.initAttributes.call(this, oConfigs);
			this.set('innerHTML',Prog.MARKUP);
			this.addClass(Prog.CLASS_PROGBAR);
			
			// I need to apply at least the following styles, if present in oConfigs, 
			// to the ProgressBar so when it later reads the width and height, 
			// they are already set to the correct values.
			// id is important because it can be used as a CSS selector.
			var key, presets = ['id','width','height','class','style'];
			while((key = presets.pop())) {
				if (key in oConfigs) {
					this.set(key,oConfigs[key]);
				}
			}
			

			var barEl  = this.getElementsByClassName(Prog.CLASS_BAR)[0],
				maskEl = this.getElementsByClassName(Prog.CLASS_MASK)[0];				
			/**
			 * @attribute barEl
			 * @description Reference to the HTML object that makes the moving bar (read-only)
			 * @type HTMLElement (div)
			 * @readonly
			 */			
		    this.setAttributeConfig('barEl', {
		        readOnly: true,
		        value: barEl
		    });
			/**
			 * @attribute maskEl
			 * @description Reference to the HTML object that overlays the bar providing the mask. (read-only)
			 * @type HTMLElement (table)
			 * @readonly
			 */			
		    this.setAttributeConfig('maskEl', {
		        readOnly: true,
		        value: maskEl
		    });
			
			/**
			 * @attribute captionEl
			 * @description Reference to the HTML object that contains the caption.
			 * @type HTMLElement or String
			 * @default a container placed centered over the progress bar.
			 */			
		    this.setAttributeConfig('captionEl', {
		        value: this.getElementsByClassName(Prog.CLASS_CAPTION)[0],
				validator: function (value) {
					return (Lang.isString(value) && Dom.get(value)) || (Lang.isObject(value) && value.ownerDocument == document);
				},
				setter: function (value) {
					return Dom.get(value);
				}
		    });
			
			/**
			 * @attribute direction
			 * @description Direction of movement of the bar.  
			 *    It can be any of 'ltr' (left to right), 'rtl' (the reverse) , 'ttb' (top to bottom) or 'btt'.
			 *    Can only be set once and only before rendering.
			 * @default 'ltr'
			 * @type String (any of "ltr", "rtl", "ttb" or "btt")
			 */			
			this.setAttributeConfig('direction', {
				writeOnce: true,
				value:DIRECTION_LTR,
				validator:function(value) {
					if (this._rendered) { return false; }
					switch (value) {
						case DIRECTION_LTR:
						case DIRECTION_RTL:
						case DIRECTION_TTB:
						case DIRECTION_BTT:
							return true;
						default:
							return false;
					}
				},
				method: function(value) {
					this._barSizeFunction = this._barSizeFunctions[this.get('anim')?1:0][value];
				}
			});
			
			/**
			 * @attribute maxValue
			 * @description Represents the top value for the bar. 
			 *   The bar will be fully extended when reaching this value.  
			 *   Values higher than this will be ignored. 
			 * @default 100
			 * @type Number
			 */				    
		    this.setAttributeConfig('maxValue', {
		        value: 100,
				validator: Lang.isNumber,
				method: function (value) {
					this.get('element').setAttribute('aria-valuemax',value);
				}
		    });
			
			/**
			 * @attribute minValue
			 * @description Represents the lowest value for the bar. 
			 *   The bar will be totally collapsed when reaching this value.  
			 *    Values lower than this will be ignored. 
			 * @default 0
			 * @type Number
			 */				

		    this.setAttributeConfig('minValue', {
		        value: 0,
				validator: Lang.isNumber,
				method: function (value) {
					this.get('element').setAttribute('aria-valuemin',value);
				}
		    });
			/**
			 * @attribute width
			 * @description Width of the ProgressBar.
			 *     If a number, it will be assumed to be in pixels.  
			 *     If a string it should be a valid setting for the CSS width attribute.  
			 *     It will always be returned as a string including units.
			 * @default "200px"
			 * @type Number or String
			 */				

		    this.setAttributeConfig('width', {
				getter: function() {
					return this.getStyle('width');
				},
				method: this._widthChange
		    });
		

			/**
			 * @attribute height
			 * @description Height of the ProgressBar.
			 *     If a number, it will be assumed to be in pixels.  
			 *     If a string it should be a valid setting for the CSS height attribute.  
			 *     It will always be returned as a string including units.
			 * @default "20px"
			 * @type Number or String
			 */				
		    this.setAttributeConfig('height', {
				getter:function() {
					return this.getStyle('height');
				},
				method: this._heightChange
		    });
			
			
	
			/**
			 * @attribute textTemplate
			 * @description Text to be shown usually overlapping the bar and to be voiced by screen readers.
			 *     The text is processed by <a href="YAHOO.lang.html#method_substitute">YAHOO.lang.substitute</a>.  
			 *     It can use the placeholders {value}, {minValue} and {maxValue}
			 * @default ""
			 * @type String
			 */				
			this.setAttributeConfig('textTemplate', {
				value:'{value}'
			});
			
			/**
			 * @attribute value
			 * @description The value for the bar.  
			 *     Valid values are in between the minValue and maxValue attributes.
			 * @default 0
			 * @type Number
			 */			
			this.setAttributeConfig('value', {
				value: 0,
				validator: function(value) {
					return Lang.isNumber(value) && value >= this.get('minValue') && value <= this.get('maxValue');
				},
				method: this._valueChange
		    });
			
			/**
			 * @attribute anim
			 * @description it accepts either a boolean (recommended) or an instance of <a href="YAHOO.util.Anim.html">YAHOO.util.Anim</a>.
			 *   If a boolean, it will enable/disable animation creating its own instance of the animation utility.  
			 *   If given an instance of <a href="YAHOO.util.Anim.html">YAHOO.util.Anim</a> it will use that instance.
			 *   The <a href="YAHOO.util.Anim.html">animation</a> utility needs to be loaded.
			 *   When read, it returns the instance of the animation utility in use or null if none.  
			 *   It can be used to set the animation parameters such as easing methods or duration.
			 * @default null
			 * @type {boolean} or {instance of YAHOO.util.Anim}
			 */						
			this.setAttributeConfig('anim', {
				validator: function(value) {
					return !!YAHOO.util.Anim;
				},
				setter: this._animSetter
			});
			
			
		},
		/** 
		 *  Renders the ProgressBar into the given container.  
		 *  If the container has other content, the ProgressBar will be appended to it.
		 *  If the second argument is provided, the ProgressBar will be inserted before the given child.
		 * The method is chainable since it returns a reference to this instance.
		 * @method render
		 * @param el {HTML Element}  HTML element that will contain the ProgressBar
		 * @param before {HTML Element}  (optional) If present, the ProgressBar will be inserted before this element.
		 * @return {YAHOO.widget.ProgressBar}
		 * @chainable
		 */
		render: function(parent,before) {

			YAHOO.log('start render','info','ProgressBar');
			if (this._rendered) { return; }
			this._rendered = true;

			// If the developer set a className attribute on initialization, 
			// Element would have wiped out my own className
			// So I need to insist on it.
			this.addClass(Prog.CLASS_PROGBAR);

			var container = this.get('element');
			container.tabIndex = 0;
			container.setAttribute('role','progressbar');
			container.setAttribute('aria-valuemin',this.get('minValue'));
			container.setAttribute('aria-valuemax',this.get('maxValue'));

			this.appendTo(parent,before);
			
			switch(this.get('direction')) {
				case DIRECTION_BTT:
					Dom.setStyle(this.get('barEl'),'background-position','left bottom');
					break;
				case DIRECTION_RTL:
					Dom.setStyle(this.get('barEl'),'background-position','right');
					break;
			}
					
			
			this._barSizeFunction = this._barSizeFunctions[0][this.get('direction')];
			this.redraw();
			this._fixEdges();
			this._barSizeFunction = this._barSizeFunctions[this.get('anim')?1:0][this.get('direction')];

			this.on('minValueChange',this.redraw);
			this.on('maxValueChange',this.redraw);

			return this;
		},

		/** 
		 * Recalculate the bar size and position and redraws it
		 * @method redraw
		 * @return  void
		 */
		redraw: function () {
			YAHOO.log('Redraw','info','ProgressBar');
			this._recalculateConstants();
			this._valueChange(this.get('value'));
		},
			
		/** 
		 * Destroys the ProgressBar, related objects and unsubscribes from all events
		 * @method destroy
		 * @return  void
		 */
		destroy: function() {
			YAHOO.log('destroy','info','ProgressBar');
			this.set('anim',false);
			this.unsubscribeAll();
			this.get('captionEl').innerHTML = '';
			var el = this.get('element');
			el.parentNode.removeChild(el);
		},
		/**
		 * The previous value setting for the bar.  Used mostly as information to event listeners
		 * @property _previousValue
		 * @type Number
		 * @private
		 * @default  0
		 */
		_previousValue:0,
		/**
		 * The actual space (in pixels) available for the bar within the mask (excludes margins)
		 * @property _barSpace
		 * @type Number
		 * @private
		 * @default  100
		 */
		_barSpace:100,
		/**
		 * The factor to convert the actual value of the bar into pixels
		 * @property _barSpace
		 * @type Number
		 * @private
		 * @default  1
		 */
		_barFactor:1,
		
		/**
		 * A flag to signal that rendering has already happened
		 * @property _rendered
		 * @type boolean
		 * @private
		 * @default  false
		 */
		_rendered:false,
		
		/**
		 * Collection of functions used by to calculate the size of the bar.
		 * One of this will be used depending on direction and whether animation is active.
		 * @property _barSizeFunctions
		 * @type {collection of functions}
		 * @private
		 */
		_barSizeFunctions: [
			{
				ltr: function(value, pixelValue, barEl, anim) {
					Dom.setStyle(barEl,'width',  pixelValue + 'px');
					this.fireEvent('progress',value);
					this.fireEvent('complete',value);
				},
				rtl: function(value, pixelValue, barEl, anim) {
					Dom.setStyle(barEl,'width',  pixelValue + 'px');
					Dom.setStyle(barEl,'left',(this._barSpace - pixelValue) + 'px');
					this.fireEvent('progress',value);
					this.fireEvent('complete',value);
				},
				ttb: function(value, pixelValue, barEl, anim) {
					Dom.setStyle(barEl,'height',  pixelValue + 'px');
					this.fireEvent('progress',value);
					this.fireEvent('complete',value);
				},
				btt: function(value, pixelValue, barEl, anim) {
					Dom.setStyle(barEl,'height',  pixelValue + 'px');
					Dom.setStyle(barEl,'top',  (this._barSpace - pixelValue) + 'px');
					this.fireEvent('progress',value);
					this.fireEvent('complete',value);
				}
			},
			{
				ltr: function(value, pixelValue, barEl, anim) {
					if (anim.isAnimated()) { anim.stop(); }
					Dom.addClass(barEl,Prog.CLASS_ANIM);
					this._tweenFactor = (value - this._previousValue) / anim.totalFrames;
					anim.attributes = {width:{ to: pixelValue }}; 
					anim.animate();
				},
				rtl: function(value, pixelValue, barEl, anim) {
					if (anim.isAnimated()) { anim.stop(); }
					Dom.addClass(barEl,Prog.CLASS_ANIM);
					this._tweenFactor = (value - this._previousValue) / anim.totalFrames;
					anim.attributes = {
						width:{ to: pixelValue },
						left:{to: this._barSpace - pixelValue}
					}; 
					anim.animate();
				},
				ttb: function(value, pixelValue, barEl, anim) {
					if (anim.isAnimated()) { anim.stop(); }
					Dom.addClass(barEl,Prog.CLASS_ANIM);
					this._tweenFactor = (value - this._previousValue) / anim.totalFrames;
					anim.attributes = {height:{to: pixelValue}};
					anim.animate();
				},
				btt: function(value, pixelValue, barEl, anim) {
					if (anim.isAnimated()) { anim.stop(); }
					Dom.addClass(barEl,Prog.CLASS_ANIM);
					this._tweenFactor = (value - this._previousValue) / anim.totalFrames;
					anim.attributes = {
						height:{to: pixelValue},
						top:{to: this._barSpace - pixelValue}
					};
					anim.animate();
				}
			}
		],
		
		/**
		 * Function to be used to calculate bar size.  
		 * It is picked from <a href="#property_barSizeFunctions">_barSizeFunctions</a>
		 * depending on direction and whether animation is active.
		 * @property _barSizeFunction
		 * @type {function}
		 * @default null
		 * @private
		 */		
		_barSizeFunction: null,
		
		_heightChange: function(value) {
			if (Lang.isNumber(value)) {
				value += 'px';
			}
			this.setStyle('height',value);
			Dom.setStyle(this.get('maskEl'),'height', value);
			this._fixEdges();
			this.redraw();
		},
		_widthChange: function(value) {
			if (Lang.isNumber(value)) {
				value += 'px';
			}
			this.setStyle('width',value);
			Dom.setStyle(this.get('maskEl'),'width', value);
			this._fixEdges();
			this.redraw();
		},
		_fixEdges:function() {
			if (!this.rendered) { return; }
			var maskEl = this.get('maskEl'),
				tlEl = Dom.getElementsByClassName(Prog.CLASS_TL,undefined,maskEl)[0],
				trEl = Dom.getElementsByClassName(Prog.CLASS_TR,undefined,maskEl)[0],
				blEl = Dom.getElementsByClassName(Prog.CLASS_BL,undefined,maskEl)[0],
				brEl = Dom.getElementsByClassName(Prog.CLASS_BR,undefined,maskEl)[0],
				newSize = (parseInt(Dom.getStyle(maskEl,'height'),10) -
				parseInt(Dom.getStyle(tlEl,'height'),10)) + 'px';
				
			Dom.setStyle(blEl,'height',newSize);
			Dom.setStyle(brEl,'height',newSize);
			newSize = (parseInt(Dom.getStyle(maskEl,'width'),10) -
				parseInt(Dom.getStyle(tlEl,'width'),10)) + 'px';
			Dom.setStyle(trEl,'width',newSize);
			Dom.setStyle(brEl,'width',newSize);
		},
					
				
		
		/** 
		 * Calculates some auxiliary values to make the rendering faster
		 * @method _recalculateConstants
		 * @return  void
		 * @private
		 */		
		_recalculateConstants: function() {
			YAHOO.log('Recalculating auxiliary factors','info','ProgressBar');
			var barEl = this.get('barEl');
			this._mn = this.get('minValue') || 0;

			switch (this.get('direction')) {
				case DIRECTION_LTR:
				case DIRECTION_RTL:
					this._barSpace = parseInt(this.get('width'),10) - 
						(parseInt(Dom.getStyle(barEl,'marginLeft'),10) || 0) -
						(parseInt(Dom.getStyle(barEl,'marginRight'),10) || 0);
					break;
				case DIRECTION_TTB:
				case DIRECTION_BTT:
					this._barSpace = parseInt(this.get('height'),10) -
						(parseInt(Dom.getStyle(barEl,'marginTop'),10) || 0)-
						(parseInt(Dom.getStyle(barEl,'marginBottom'),10) || 0); 
					break;
			}
			this._barFactor = this._barSpace / (this.get('maxValue') - this._mn)  || 1;
		},
		
		/** 
		 * Called in response to a change in the <a href="#config_anim">anim</a> attribute.
		 * It creates and sets up or destroys the instance of the animation utility that will move the bar
		 * @method _animSetter
		 * @return  void
		 * @private
		 */		
		_animSetter: function (value) {
			var anim, barEl = this.get('barEl');
			if (value) {
				YAHOO.log('Turning animation on','info','ProgressBar');
				if (value instanceof YAHOO.util.Anim) {
					anim = value;
				} else {
					anim = new YAHOO.util.Anim(barEl);
				}
				anim.onTween.subscribe(this._animOnTween,this,true);
				anim.onComplete.subscribe(this._animComplete,this,true);
			} else {
				YAHOO.log('Turning animation off','info','ProgressBar');
				anim = this.get('anim');
				if (anim) {
					anim.onTween.unsubscribeAll();
					anim.onComplete.unsubscribeAll();
				}
				anim = null;
			}
			this._barSizeFunction = this._barSizeFunctions[anim?1:0][this.get('direction')];
			return anim;
		},
		
		_animComplete: function(ev) {
			YAHOO.log('Animation completed','info','ProgressBar');
			var value = this.get('value');
			this._previousValue = value;
			this.fireEvent('complete', value);
			Dom.removeClass(this.get('barEl'),Prog.CLASS_ANIM);
			this._showTemplates(value,true);
		},
		_animOnTween:function (ev) {
			var value = Math.floor(this._tweenFactor * this.get('anim').currentFrame + this._previousValue);
			YAHOO.log('Animation onTween at: ' + value,'info','ProgressBar');
			this.fireEvent('progress',value);
			this._showTemplates(value,false);
		},
		
		/** 
		 * Called in response to a change in the <a href="#config_value">value</a> attribute.
		 * Moves the bar to reflect the new value
		 * @method _valueChange
		 * @return  void
		 * @private
		 */		
		_valueChange: function (value) {
			YAHOO.log('set value: ' + value,'info','ProgressBar');
			var anim = this.get('anim'),
				pixelValue = Math.floor((value - this._mn) * this._barFactor),
				barEl = this.get('barEl');
			
			this._showTemplates(value,true);
			if (this._rendered) {
				this.fireEvent('start',this._previousValue);
				this._barSizeFunction(value, pixelValue, barEl, anim);
			}
		},

		/** 
		 * Utility method to set the ARIA value attributes
		 * @method _showTemplates
		 * @return  void
		 * @private
		 */
		 _showTemplates: function(value, aria) {
 			YAHOO.log('Show template','info','ProgressBar');

			var captionEl = this.get('captionEl'),
				container = this.get('element'),
				text = Lang.substitute(this.get('textTemplate'),{
					value:value,
					minValue:this.get('minValue'),
					maxValue:this.get('maxValue')
				});
			if (aria) {
				container.setAttribute('aria-valuenow',value);
				container.setAttribute('aria-valuetext',text);
			}
			if (captionEl) {
				captionEl.innerHTML = text;
			}
		}
	});
})();