/**
 * The ProgressBar widget provides an easy way to draw a bar depicting progress of an operation,
 * a level meter, ranking or any such simple measure.
 * It allows for highly customized styles
 *
 * @module progressbar
 * @requires yahoo, dom, event, element
 * @optional animation
 * @title ProgressBar Widget
 */

(function () {
	var Dom = YAHOO.util.Dom,
		Lang = YAHOO.lang;
	
	/**
	 * A Progress Bar providing various visual options, animation, it can grow vertically or horizontally in any direction
	 * and fires several events while moving.
	 * @namespace YAHOO.widget
	 * @class ProgressBar
	 * @extends YAHOO.util.Element
	 * @param oConfigs {object} An object containing any configuration attributes to be set 
	 * @constructor
	 */        
	var Prog = function(oConfigs) {
        
		Prog.superclass.constructor.call(this, document.createElement('div') , oConfigs);
		this._init(oConfigs);
		
	};
	
	YAHOO.widget.ProgressBar = Prog;
	
	Lang.extend(Prog, YAHOO.util.Element, {
		/**
		 * Initialization code for the widget, separate from the constructor to allow for overriding/patching
		 *
		 * @method _init
		 * @param oConfigs {Object} (Optional) Object literal definition of configuration values.  
		 *        Not used internally, available for overrides.
		 * @private
		 */	
		 _init: function (oConfigs) {
			/**
			 * Fires when the value is about to change.  It reports the starting value
			 * @event start
			 * @type CustomEvent
			 * @param value {Number} the current (initial) value of the node
			 */
			// No actual creation required, event will be created when subscribed to
			//this.createEvent('start');
			/**
			 * If animation is loaded, it will trigger for each frame of the animation providing partial values
			 * @event changing
			 * @type CustomEvent
			 * @param  value{Number} the current (changing) value of the node
			 */
			// No actual creation required, event will be created when subscribed to
			//this.createEvent('changing');
			/**
			 * It will fire at the end of the animation or immediately upon changing values if animation is not loaded
			 * @event complete
			 * @type CustomEvent
			 * @param value {Number} the current (final)  value of the node
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

		    Prog.superclass.initAttributes.call(this, oConfigs);

			var el = this.get('element');
			el.innerHTML = 	'<div class="yui-pb-bar"></div><table class="yui-pb-mask"><tbody><tr><td class="yui-pb-tl"></td><td class="yui-pb-tr"></td></tr><tr><td class="yui-pb-bl"></td><td class="yui-pb-br"></td></tr></tbody></table>';
			var barEl  = el.firstChild,
				maskEl = barEl.nextSibling;
				
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
			 * @attribute direction
			 * @description Direction of movement of the bar.  
			 *    It can be any of 'ltr' (left to right), 'rtl' (the reverse) , 'ttb' (top to bottom) or 'btt'.
			 *    Case-insensitive when setting, it will always be returned in lower case
			 *    Can only be set once and only before rendering.
			 * @default 'lr'
			 * @type String
			 */			
			this.setAttributeConfig('direction', {
				writeOnce: true,
				value:'ltr',
				validator:function(value) {
					if (this._rendered) { return false; }
					switch (value.toLowerCase()) {
						case 'ltr':
						case 'rtl':
						case 'ttb':
						case 'btt':
							return true;
						default:
							return false;
					}
				},
				setter: function(value) {
					return value.toLowerCase();
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
					this._recalculateConstants();
					this.redraw();
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
					this._recalculateConstants();
					this.redraw();
				}
		    });
			/**
			 * @attribute width
			 * @description Width of the ProgressBar.
			 *     If a number, it will be presumed to be in pixels.  
			 *     If a string it should be a valid setting for the CSS width attribute.  
			 *     It will always be returned as a string including units.
			 * @default "200px"
			 * @type Number or String
			 */				

		    this.setAttributeConfig('width', {
		        value: '200px',
				method: function(value) {
					if (Lang.isNumber(value)) {
						value += 'px';
					}
					this.setStyle('width',value);
					Dom.setStyle(maskEl,'width', value);
					this.redraw();
				}
		    });

			/**
			 * @attribute height
			 * @description Height of the ProgressBar.
			 *     If a number, it will be presumed to be in pixels.  
			 *     If a string it should be a valid setting for the CSS height attribute.  
			 *     It will always be returned as a string including units.
			 * @default "20px"
			 * @type Number or String
			 */				
		    this.setAttributeConfig('height', {
		        value: '20px',
				method: function(value) {
					if (Lang.isNumber(value)) {
						value += 'px';
					}
					this.setStyle('height',value);
					Dom.setStyle(maskEl,'height', value);
					this.redraw();
				}
		    });
			
			/**
			 * @attribute barColor
			 * @description Color for the bar.  It can be any valid CSS color value.
			 * @default 'blue'
			 * @type String - CSS color specification
			 */				
			this.setAttributeConfig('barColor', {
				value:'blue',
				method: function (value) {
					Dom.setStyle(barEl,'background-color', value);
					Dom.setStyle(barEl,'background-image', 'none');
				}
			});

			/**
			 * @attribute backColor
			 * @description Color for the background.  It can be any valid CSS color value.
			 * @default 'white'
			 * @type String - CSS color specification
			 */				
			this.setAttributeConfig('backColor', {
				value:'white',
				method: function (value) {
					this.setStyle('background-color', value);
					this.setStyle('background-image', 'none');
				}
			});
			
			/**
			 * @attribute border
			 * @description CSS attributes for the border.
			 * @default 'none'
			 * @type String - CSS border specification
			 */				
			this.setAttributeConfig('border', {
				value:'none',
				method: function (value) {
					this.setStyle('border', value);
				}
			});
			
			/**
			 * @attribute ariaText
			 * @description The text to be voiced by screen readers.  
			 *     The text should contain a vertical bar character where the current  value of the bar should be inserted.
			 * @default '|'
			 * @type String
			 */				
			this.setAttributeConfig('ariaText', {
				value:'|'
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
			 * @description A reference to the YAHOO.util.Anim instance attached to the bar.  (ReadOnly)  
			 *   If the Animation utility is loaded, it will be automatically used.  
			 * @default null
			 * @type {instance of YAHOO.util.Anim}
			 */			
			
			this.setAttributeConfig('anim', {
				getter:function() {
					return this._anim;
				},
				validator: function() {
					return false;
				}
			});
			
			this.setAttributeConfig('animate', {
				value: false,
				validator: function(value) {
					if (Lang.isBoolean(value)) {
						if (value) {
							return Lang.isObject(YAHOO.util.Anim) && Lang.isNull(this._anim);
						} else {
							return !Lang.isNull(this._anim);
						}
					} else {
						return false;
					}
				},
				method:this._animateChange
			});
			
		},
		/** 
		 *  It will render the ProgressBar into the given container.  
		 *  If the container has other content, the ProgressBar will be appended to them.
		 *  If the second argument is provided, the ProgressBar will be inserted before the given child.
		 * The method is chainable since it returns a reference to this instance.
		 * @method render
		 * @param el {HTML Element}  HTML element that will contain the ProgressBar
		 * @param before {HTML Element}  (optional) If present, the ProgressBar will be inserted before this element.
		 * @return {YAHOO.widget.ProgressBar}
		 * @chainable
		 */
		render: function(el,before) {
			if (this._rendered) { return; }
			this._rendered = true;

			this.addClass('yui-pb');
			var container = this.get('element');
			container.tabIndex = 0;
			container.setAttribute('role','progressbar');
			container.setAttribute('aria-valuemin',this.get('minValue'));
			container.setAttribute('aria-valuemax',this.get('maxValue'));
			this._setAriaValue();

			this.appendTo(el,before);
			
			this.redraw();
			return this;
		},

		/** 
		 *  It will recalculate the bar size and position and redraw it
		 * @method redraw
		 * @return  void
		 * @private
		 */
		redraw: function () {
			this._recalculateConstants();
			this.refresh('value',true);
		},
			
		/** 
		 *  It will destroy the ProgressBar, related objects and unsubscribe all events
		 * @method destroy
		 * @return  void
		 */
		destroy: function() {
			this.set('animate',false);
			this.unsubscribeAll();
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
		 * The actual space (in pixels) available for the bar within the mask
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
		
		_anim:null,
		_rendered:false,
		
		/** 
		 *  Calculates some auxiliary values to make the rendering faster
		 * @method _recalculateConstants
		 * @return  void
		 * @private
		 */		
		_recalculateConstants: function() {
			var barEl = this.get('barEl');
			this._mn = this.get('minValue') || 0;

			switch (this.get('direction')) {
				case 'ltr':
				case 'rtl':
					this._barSpace = parseInt((this.getStyle('width') || this.get('width')),10) - 
						parseInt(Dom.getStyle(barEl,'marginLeft'),10)  -
						Math.abs(parseInt(Dom.getStyle(barEl,'marginRight'),10));
					break;
				case 'ttb':
				case 'btt':
					this._barSpace = parseInt((this.getStyle('height') || this.get('height')),10) -
						parseInt(Dom.getStyle(barEl,'marginTop'),10) -
						parseInt(Dom.getStyle(barEl,'marginBottom'),10); 
					break;
			}
			this._barFactor = this._barSpace / (this.get('maxValue') - this._mn)  || 1;
		},
		
		_animateChange: function (value) {
			var anim, barEl = this.get('barEl');
			if (value) {
				this._anim = anim = new YAHOO.util.Anim(barEl);
				anim.onTween.subscribe(function (ev) {
					this.fireEvent('changing',Math.floor(this._tweenFactor * anim.currentFrame + this._previousValue));
				},this,true);
				anim.onComplete.subscribe(function(ev) {
					this.fireEvent('complete',this._previousValue = this.get('value'));
					Dom.removeClass(barEl,'yui-pb-anim');
				},this,true);
			} else {
				anim = this._anim;
				anim.onTween.unsubscribeAll();
				anim.onComplete.unsubscribeAll();
			}
		},
		_valueChange: function (value) {
			var anim = this._anim,
				pixelValue = Math.floor((value - this._mn) * this._barFactor),
				barEl = this.get('barEl');
			
			this._setAriaValue();
			this.fireEvent('start',this._previousValue);
			if (anim) {
				if (anim.isAnimated) { anim.stop(); }
				Dom.addClass(barEl,'yui-pb-anim');
				this._tweenFactor = (value - this._previousValue) / anim.totalFrames;
				switch (this.get('direction')) {
					case 'ltr':
						anim.attributes = {width:{ to: pixelValue }}; 
						break;
					case 'rtl':
						anim.attributes = {
							width:{ to: pixelValue },
							left:{to: this._barSpace - pixelValue}
						}; 
						break;
					case 'ttb':
						anim.attributes = {height:{to: pixelValue}};
						break;
					case 'btt':
						anim.attributes = {
							height:{to: pixelValue},
							top:{to: this._barSpace - pixelValue}
						};
						break;
				}
				anim.animate();
			} else {
				switch (this.get('direction')) {
					case 'ltr':
						Dom.setStyle(barEl,'width',  pixelValue + 'px');
						break;
					case 'rtl':
						Dom.setStyle(barEl,'width',  pixelValue + 'px');
						Dom.setStyle(barEl,'left',(this._barSpace - pixelValue) + 'px');
						break;
					case 'ttb':
						Dom.setStyle(barEl,'height',  pixelValue + 'px');
						break;
					case 'btt':
						Dom.setStyle(barEl,'height',  pixelValue + 'px');
						Dom.setStyle(barEl,'top',  (this._barSpace - pixelValue) + 'px');
						break;
				}
				// If the animation utility has not been loaded then changing the value will always complete immediately.
				this.fireEvent('complete',value);
			}
		},
		_setAriaValue: function() {
			var container = this.get('element');
			container.setAttribute('aria-valuenow',this.get('value'));
			container.setAttribute('aria-valuetext',Lang.substitute(this.get('ariaText'),{
				value:this.get('value'),
				minValue:this.get('minValue'),
				maxValue:this.get('maxValue')
			}));
		}
	});
})();

YAHOO.register("progressbar", YAHOO.widget.ProgressBar, {version: "@VERSION@", build: "@BUILD@"});
