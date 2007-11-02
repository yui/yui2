YAHOO.widget.CalendarNavigator = function(cal) {
	this.init(cal);
};

YAHOO.widget.CalendarNavigator.prototype = {

	id : null,
	cal : null,
	doc : null,

	navEl : null,
	maskEl : null,
	yearEl : null,
	monthEl : null,
	errorEl : null,
	submitEl : null,
	cancelEl : null,

	firstCtrl : null,
	lastCtrl : null,

	_year: null,
	_month: 0,

	init : function(cal) {
		var calBox = cal.oDomContainer;

		this.cal = cal;
		this.doc = calBox.ownerDocument;
		this.id = calBox.id + YAHOO.widget.CalendarNavigator.ID_SUFFIX;
	},

	show : function() {
		var CSS = YAHOO.widget.CalendarNavigator.CSS;

		if (this.cal.beforeShowNavEvent.fire()) {
			if (!this.__rendered) {
				this.render();
			}
			this.clearErrors();
			this._updateMonthUI();
			this._updateYearUI();

			this._show(this.navEl, true);
			this.setInitialFocus();
			this.showMask();

			YAHOO.util.Dom.addClass(this.cal.oDomContainer, CSS.NAV_VISIBLE);
			this.cal.showNavEvent.fire();
		}
	},

	hide : function() {
		var CSS = YAHOO.widget.CalendarNavigator.CSS;

		if (this.cal.beforeHideNavEvent.fire()) {
			this._show(this.navEl, false);
			this.hideMask();
			YAHOO.util.Dom.removeClass(this.cal.oDomContainer,  CSS.NAV_VISIBLE);
			this.cal.hideNavEvent.fire();
		}
	},

	submit : function() {
		if (this.validate()) {
			this.hide();

			this.setMonth(this._getMonthFromUI());
			this.setYear(this._getYearFromUI());

			var cal = this.cal;
			var nav = this;
			
			function update() {
				cal.setYear(nav.getYear());
				cal.setMonth(nav.getMonth());
				cal.render();
			}
			// Artificial delay, just to help the user see something changed
			var delay = YAHOO.widget.CalendarNavigator.UPDATE_DELAY;
			if (delay > 0) {
				window.setTimeout(update, delay);
			} else {
				update();
			}
		}
	},

	cancel : function() {
		this.hide();
	},

	validate : function() {
		if (this._getYearFromUI() !== null) {
			this.clearErrors();
			return true;
		} else {
			this.setYearError();
			this.setError(this._getCfg("invalidYear", true));
			return false;
		}
	},

	getMonth: function() {
		return this._month;
	},

	getYear: function() {
		return this._year;
	},

	setMonth : function(nMonth) {
		if (nMonth > 0 && nMonth < 12) {
			this._month = nMonth;
		}
		this._updateMonthUI();
	},

	setYear : function(nYear) {
		var yrPattern = YAHOO.widget.CalendarNavigator.YR_PATTERN;
		if (YAHOO.lang.isNumber(nYear) && yrPattern.test(nYear+"")) {
			this._year = nYear;
		}
		this._updateYearUI();
	},

	createMask : function() {
		var CSS = YAHOO.widget.CalendarNavigator.CSS;

		var d = this.doc.createElement("div");
		d.className = CSS.MASK;
		if (YAHOO.env.ua.ie && YAHOO.env.ua.ie <= 6) {
			d.className += " fixedsize";
		}
		this.cal.oDomContainer.appendChild(d);
		this.maskEl = d;
	},

	createNav : function() {
		var NAV = YAHOO.widget.CalendarNavigator;
		var doc = this.doc;

		var d = doc.createElement("div");
		d.className = NAV.CSS.NAV;
		d.innerHTML = this.renderNavContents();
		this.cal.oDomContainer.appendChild(d);

		this.navEl = d;

		this.yearEl = doc.getElementById(this.id + NAV.YEAR_SUFFIX);
		this.monthEl = doc.getElementById(this.id + NAV.MONTH_SUFFIX);
		this.errorEl = doc.getElementById(this.id + NAV.ERROR_SUFFIX);
		this.submitEl = doc.getElementById(this.id + NAV.SUBMIT_SUFFIX);
		this.cancelEl = doc.getElementById(this.id + NAV.CANCEL_SUFFIX);

		this.lastCtrl = this.cancelEl;
		this.firstCtrl = this.monthEl;
	},

	setInitialFocus : function() {
		var el = this.submitEl;
		var f = this._getCfg("initialFocus");

		if (f && f.toLowerCase) {
			f = f.toLowerCase();
			if (f == "year") {
				el = this.yearEl;
				try {
					this.yearEl.select();
				} catch (e) {
					// Ignore;
				}
			} else if (f == "month") {
				el = this.monthEl;
			}
		}

		if (el && YAHOO.lang.isFunction(el.focus)) {
			try {
				el.focus();
			} catch (e) {
				// TODO: Fall back if focus fails?
			}
		}
	},

	showMask : function() {
		this._show(this.maskEl, true);
	},

	hideMask : function() {
		this._show(this.maskEl, false);
	},

	moveTo: function(xy) {
		YAHOO.util.Dom.setXY(this.navEl, xy); 
	},

	render: function() {
		if (!this.__rendered) {

			this.createNav();
			this.createMask();
			this.applyListeners();

			this.__rendered = true;
		}
	},

	renderNavContents : function() {
		var NAV = YAHOO.widget.CalendarNavigator,
			CSS = NAV.CSS;

		var h = [];
		h[h.length] = '<div class="' + CSS.MONTH + '">';
		h[h.length] = this.renderMonth();
		h[h.length] = '</div>';
		h[h.length] = '<div class="' + CSS.YEAR + '">';
		h[h.length] = this.renderYear();
		h[h.length] = '</div>';
		h[h.length] = '<div class="' + CSS.BUTTONS + '">';
		h[h.length] = this.renderButtons();
		h[h.length] = '</div>';
		h[h.length] = '<div class="' + CSS.ERROR + '" id="' + this.id + NAV.ERROR_SUFFIX + '"></div>';
		return h.join('');
	},

	renderMonth : function() {
		var NAV = YAHOO.widget.CalendarNavigator,
			CSS = YAHOO.widget.CalendarNavigator.CSS;

		var id = this.id + NAV.MONTH_SUFFIX,
			mf = this._getCfg("monthFormat"),
			months = this.cal.cfg.getProperty((mf == YAHOO.widget.Calendar.SHORT) ? "MONTHS_SHORT" : "MONTHS_LONG");

		var h = [];
		if (months && months.length > 0) {
			h[h.length] = '<label for="' + id + '">';
			h[h.length] = this._getCfg("month", true);
			h[h.length] = '</label>';
			h[h.length] = '<select name="' + id + '" id="' + id + '" class="' + CSS.MONTH_CTRL + '">';
			for (var i = 0; i < months.length; i++) {
				h[h.length] = '<option value="' + i + '">';
				h[h.length] = months[i];
				h[h.length] = '</option>';
			}
			h[h.length] = '</select>';
		}

		return h.join('');
	},

	renderYear : function() {
		var NAV = YAHOO.widget.CalendarNavigator,
			CSS = YAHOO.widget.CalendarNavigator.CSS;

		var id = this.id + NAV.YEAR_SUFFIX,
			size = this._getCfg("yearMaxDigits");

		var h = [];
		h[h.length] = '<label for="' + id + '">';
		h[h.length] = this._getCfg("year", true);
		h[h.length] = '</label>';
		h[h.length] = '<input type="text" name="' + id + '" id="' + id + '" class="' + CSS.YEAR_CTRL + '" maxlength="' + size + '"/>';
		return h.join('');
	},

	renderButtons : function() {
		var h = [];
		h[h.length] = '<button id="' + this.id + '_submit' + '" class="default">';
		h[h.length] = this._getCfg("submit", true);
		h[h.length] = '</button>';
		h[h.length] = '<button id="' + this.id + '_cancel' + '">';
		h[h.length] = this._getCfg("cancel", true);
		h[h.length] = '</button>';
		return h.join('');
	},

	applyListeners : function() {
		var E = YAHOO.util.Event;
		E.on(this.submitEl, "click", this.submit, this, true);
		E.on(this.cancelEl, "click", this.cancel, this, true);
		E.on(this.yearEl, "blur", this.validate, this, true);

		this.applyKeyListeners();
	},

	purgeListeners : function() {
		var E = YAHOO.util.Event;
		E.removeListener(this.submitEl, "click", this.submit);
		E.removeListener(this.cancelEl, "click", this.cancel);

		this.purgeKeyListeners();
	},

	applyKeyListeners : function() {

		var KEYS = YAHOO.util.KeyListener.KEY;
		var E = YAHOO.util.Event;
		var NAV = YAHOO.widget.CalendarNavigator;

		function enter(e) {
			if (E.getCharCode(e) == KEYS.ENTER) {
				this.submit();
			}
		}

		function changeYear(e) {
			var value = (this.yearEl.value) ? parseInt(this.yearEl.value, 10) : null;
			if (isFinite(value)) {
				var b = false;
				switch(E.getCharCode(e)) {
					case KEYS.UP:
						this.yearEl.value = value + NAV.YR_MINOR_INC;
						b = true;
						break;
					case KEYS.PAGE_UP:
						this.yearEl.value = value + NAV.YR_MAJOR_INC;
						b = true;
						break;
					case KEYS.DOWN:
						this.yearEl.value = Math.max(value - NAV.YR_MINOR_INC, 0);
						b = true;
						break;
					case KEYS.PAGE_DOWN:
						this.yearEl.value = Math.max(value - NAV.YR_MAJOR_INC, 0);
						b = true;
						break;
					default:
						break;
				}
				if (b) {
					this.yearEl.select();
				}
			}
		}

		function tab(e) {
			if (E.getCharCode(e) == KEYS.TAB && !e.shiftKey) {
				try {
					E.preventDefault(e);
					this.firstCtrl.focus();
				} catch (e) {
					// Ignore - mainly for focus.
				}
			}
		}

		function shiftTab(e) {
			if (E.getCharCode(e) == KEYS.TAB && e.shiftKey) {
				try {
					E.preventDefault(e);
					this.lastCtrl.focus();
				} catch (e) {
					// Ignore - mainly for focus.
				}
			}
		}

		E.on(this.yearEl, "keypress", enter, this, true);
		E.on(this.yearEl, "keydown", changeYear, this, true);
		E.on(this.lastCtrl, "keydown", tab, this, true);
		E.on(this.firstCtrl, "keydown", shiftTab, this, true);
	},

	purgeKeyListeners : function() {
		var E = YAHOO.util.Event;
		E.removeListener(this.yearEl, "keypress");
		E.removeListener(this.yearEl, "keydown");
		E.removeListener(this.lastCtrl, "keydown");
		E.removeListener(this.firstCtrl, "keydown");
	},

	setError : function(msg) {
		if (this.errorEl) {
			this.errorEl.innerHTML = msg;
			this._show(this.errorEl, true);
		}
	},

	clearError : function() {
		if (this.errorEl) {
			this.errorEl.innerHTML = "";
			this._show(this.errorEl, false);
		}
	},

	setYearError : function() {
		YAHOO.util.Dom.addClass(this.yearEl, YAHOO.widget.CalendarNavigator.CSS.INVALID);
	},

	clearYearError : function() {
		YAHOO.util.Dom.removeClass(this.yearEl, YAHOO.widget.CalendarNavigator.CSS.INVALID);
	},

	clearErrors : function() {
		this.clearError();
		this.clearYearError();
	},

	erase : function() {
		this.purgeListeners();

		this.maskEl = null;
		this.yearEl = null;
		this.monthEl = null;
		this.errorEl = null;
		this.submitEl = null;
		this.cancelEl = null;

		this.firstCtrl = null;
		this.lastCtrl = null;

		if (this.navEl) {
			this.navEl.innerHTML = "";
		}
		this.navEl = null;
		this.__rendered = false;
	},

	destroy : function() {
		this.erase();
		this.doc = null;
		this.cal = null;
		this.id = null;
	},

	_show : function(el, bShow) {
		if (el) {
			YAHOO.util.Dom.setStyle(el, "display", (bShow) ? "block" : "none");
		}
	},

	_getCfg : function(prop, bIsStr) {
		var DEF_CFG = YAHOO.widget.CalendarNavigator._DEFAULT_CFG;
		var cfg = this.cal.cfg.getProperty("nav");

		if (bIsStr) {
			return (cfg.strings && cfg.strings[prop]) ? cfg.strings[prop] : DEF_CFG.strings[prop];
		} else {
			return cfg[prop] || DEF_CFG[prop];
		}
	},

	_getMonthFromUI : function() {
		if (this.monthEl) {
			return this.monthEl.selectedIndex;
		} else {
			return 0; // Default to Jan
		}
	},

	_getYearFromUI : function() {
		var NAV = YAHOO.widget.CalendarNavigator;

		var yr = null; // 0? -X?
		if (this.yearEl) {
			var value = this.yearEl.value;
			value = value.replace(NAV.TRIM, "$1");

			if (NAV.YR_PATTERN.test(value)) {
				yr = parseInt(value, 10);
			}
		}
		return yr;
	},

	_updateYearUI : function() {
		if (this.yearEl && this._year !== null) {
			this.yearEl.value = this._year;
		}
	},

	_updateMonthUI : function() {
		if (this.monthEl) {
			this.monthEl.selectedIndex = this._month;
		}
	}
};

(function() {
	// Setup Static Variables (inside anon fn, so that we can use shortcuts)
	var CN = YAHOO.widget.CalendarNavigator;

	CN.YR_PATTERN = /^\d+$/;
	CN.TRIM = /^\s*(.*?)\s*$/;

	CN.ID_SUFFIX = "_nav";
	CN.MONTH_SUFFIX = "_month";
	CN.YEAR_SUFFIX = "_year";
	CN.ERROR_SUFFIX = "_error";
	CN.CANCEL_SUFFIX = "_cancel";
	CN.SUBMIT_SUFFIX = "_submit";

	CN.YR_MINOR_INC = 1;
	CN.YR_MAJOR_INC = 10;
	CN.UPDATE_DELAY = 50;

	CN.CSS = {
		NAV :"yui-cal-nav",
		NAV_VISIBLE: "yui-cal-nav-visible",
		MASK : "yui-cal-nav-mask",
		YEAR : "yui-cal-nav-y",
		MONTH : "yui-cal-nav-m",
		BUTTONS : "yui-cal-nav-b",
		YEAR_CTRL : "yui-cal-nav-yc",
		MONTH_CTRL : "yui-cal-nav-mc",
		ERROR : "yui-cal-nav-e",
		INVALID : "yui-invalid"
	};

	CN._DEFAULT_CFG = {
		strings : {
			month: "Month",
			year: "Year",
			submit: "Okay",
			cancel: "Cancel",
			invalidYear : "Please enter a valid year (a 1-4 digit number)"
		},
		monthFormat: YAHOO.widget.Calendar.LONG,
		yearMaxDigits: 4,
		initialFocus: "year"
	};
})();
