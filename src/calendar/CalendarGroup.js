/**
* YAHOO.widget.CalendarGroup is a special container class for YAHOO.widget.Calendar. This class facilitates
* the ability to have multi-page calendar views that share a single dataset and are
* dependent on each other.
*
* The calendar group instance will refer to each of its elements using a 0-based index.
* For example, to construct the placeholder for a calendar group widget with id "cal1" and
* containerId of "cal1Container", the markup would be as follows:
*	<xmp>
*		<div id="cal1Container_0"></div>
*		<div id="cal1Container_1"></div>
*	</xmp>
* The tables for the calendars ("cal1_0" and "cal1_1") will be inserted into those containers.
* 
* <p>
* <strong>NOTE: As of 2.4.0, the constructor's ID argument is optional.</strong>
* The CalendarGroup can be constructed by simply providing a container ID string, 
* or a reference to a container DIV HTMLElement (the element needs to exist 
* in the document).
* 
* E.g.:
*	<xmp>
*		var c = new YAHOO.widget.CalendarGroup("calContainer", configOptions);
*	</xmp>
* or:
*   <xmp>
*       var containerDiv = YAHOO.util.Dom.get("calContainer");
*		var c = new YAHOO.widget.CalendarGroup(containerDiv, configOptions);
*	</xmp>
* </p>
* <p>
* If not provided, the ID will be generated from the container DIV ID by adding an "_t" suffix.
* For example if an ID is not provided, and the container's ID is "calContainer", the CalendarGroup's ID will be set to "calContainer_t".
* </p>
* 
* @namespace YAHOO.widget
* @class CalendarGroup
* @constructor
* @param {String} id optional The id of the table element that will represent the CalendarGroup widget. As of 2.4.0, this argument is optional.
* @param {String | HTMLElement} container The id of the container div element that will wrap the CalendarGroup table, or a reference to a DIV element which exists in the document.
* @param {Object} config optional The configuration object containing the initial configuration values for the CalendarGroup.
*/
YAHOO.widget.CalendarGroup = function(id, containerId, config) {
	if (arguments.length > 0) {
		this.init.apply(this, arguments);
	}
};

YAHOO.widget.CalendarGroup.prototype = {

	/**
	* Initializes the calendar group. All subclasses must call this method in order for the
	* group to be initialized properly.
	* @method init
	* @param {String} id optional The id of the table element that will represent the CalendarGroup widget. As of 2.4.0, this argument is optional.
	* @param {String | HTMLElement} container The id of the container div element that will wrap the CalendarGroup table, or a reference to a DIV element which exists in the document.
	* @param {Object} config optional The configuration object containing the initial configuration values for the CalendarGroup.
	*/
	init : function(id, container, config) {

		// Normalize 2.4.0, pre 2.4.0 args
		var nArgs = this._parseArgs(arguments);

		id = nArgs.id;
		container = nArgs.container;
		config = nArgs.config;

		this.oDomContainer = YAHOO.util.Dom.get(container);
		if (!this.oDomContainer) { this.logger.log("Container not found in document.", "error"); }

		if (!this.oDomContainer.id) {
			this.oDomContainer.id = YAHOO.util.Dom.generateId();
		}
		if (!id) {
			id = this.oDomContainer.id + "_t";
		}

		/**
		* The unique id associated with the CalendarGroup
		* @property id
		* @type String
		*/
		this.id = id;

		/**
		* The unique id associated with the CalendarGroup container
		* @property containerId
		* @type String
		*/
		this.containerId = this.oDomContainer.id;

		this.logger = new YAHOO.widget.LogWriter("CalendarGroup " + this.id);
		this.initEvents();
		this.initStyles();

		/**
		* The collection of Calendar pages contained within the CalendarGroup
		* @property pages
		* @type YAHOO.widget.Calendar[]
		*/
		this.pages = [];

		YAHOO.util.Dom.addClass(this.oDomContainer, YAHOO.widget.CalendarGroup.CSS_CONTAINER);
		YAHOO.util.Dom.addClass(this.oDomContainer, YAHOO.widget.CalendarGroup.CSS_MULTI_UP);

		/**
		* The Config object used to hold the configuration variables for the CalendarGroup
		* @property cfg
		* @type YAHOO.util.Config
		*/
		this.cfg = new YAHOO.util.Config(this);

		/**
		* The local object which contains the CalendarGroup's options
		* @property Options
		* @type Object
		*/
		this.Options = {};

		/**
		* The local object which contains the CalendarGroup's locale settings
		* @property Locale
		* @type Object
		*/
		this.Locale = {};

		this.setupConfig();

		if (config) {
			this.cfg.applyConfig(config, true);
		}

		this.cfg.fireQueue();

		// OPERA HACK FOR MISWRAPPED FLOATS
		if (YAHOO.env.ua.opera){
			this.renderEvent.subscribe(this._fixWidth, this, true);
			this.showEvent.subscribe(this._fixWidth, this, true);
		}

		this.logger.log("Initialized " + this.pages.length + "-page CalendarGroup", "info");
	},

	setupConfig : function() {

		var defCfg = YAHOO.widget.CalendarGroup._DEFAULT_CONFIG;

		/**
		* The number of pages to include in the CalendarGroup. This value can only be set once, in the CalendarGroup's constructor arguments.
		* @config pages
		* @type Number
		* @default 2
		*/
		this.cfg.addProperty(defCfg.PAGES.key, { value:defCfg.PAGES.value, validator:this.cfg.checkNumber, handler:this.configPages } );

		/**
		* The month/year representing the current visible Calendar date (mm/yyyy)
		* @config pagedate
		* @type String | Date
		* @default today's date
		*/
		this.cfg.addProperty(defCfg.PAGEDATE.key, { value:new Date(), handler:this.configPageDate } );

		/**
		* The date or range of dates representing the current Calendar selection
		*
		* @config selected
		* @type String
		* @default []
		*/
		this.cfg.addProperty(defCfg.SELECTED.key, { value:[], handler:this.configSelected } );

		/**
		* The title to display above the CalendarGroup's month header
		* @config title
		* @type String
		* @default ""
		*/
		this.cfg.addProperty(defCfg.TITLE.key, { value:defCfg.TITLE.value, handler:this.configTitle } );

		/**
		* Whether or not a close button should be displayed for this CalendarGroup
		* @config close
		* @type Boolean
		* @default false
		*/
		this.cfg.addProperty(defCfg.CLOSE.key, { value:defCfg.CLOSE.value, handler:this.configClose } );

		/**
		* Whether or not an iframe shim should be placed under the Calendar to prevent select boxes from bleeding through in Internet Explorer 6 and below.
		* This property is enabled by default for IE6 and below. It is disabled by default for other browsers for performance reasons, but can be 
		* enabled if required.
		* 
		* @config iframe
		* @type Boolean
		* @default true for IE6 and below, false for all other browsers
		*/
		this.cfg.addProperty(defCfg.IFRAME.key, { value:defCfg.IFRAME.value, handler:this.configIframe, validator:this.cfg.checkBoolean } );
	
		/**
		* The minimum selectable date in the current Calendar (mm/dd/yyyy)
		* @config mindate
		* @type String | Date
		* @default null
		*/
		this.cfg.addProperty(defCfg.MINDATE.key, { value:defCfg.MINDATE.value, handler:this.delegateConfig } );
	
		/**
		* The maximum selectable date in the current Calendar (mm/dd/yyyy)
		* @config maxdate
		* @type String | Date
		* @default null
		*/	
		this.cfg.addProperty(defCfg.MAXDATE.key, { value:defCfg.MAXDATE.value, handler:this.delegateConfig  } );
	
		// Options properties
	
		/**
		* True if the Calendar should allow multiple selections. False by default.
		* @config MULTI_SELECT
		* @type Boolean
		* @default false
		*/
		this.cfg.addProperty(defCfg.MULTI_SELECT.key,	{ value:defCfg.MULTI_SELECT.value, handler:this.delegateConfig, validator:this.cfg.checkBoolean } );
	
		/**
		* The weekday the week begins on. Default is 0 (Sunday).
		* @config START_WEEKDAY
		* @type number
		* @default 0
		*/	
		this.cfg.addProperty(defCfg.START_WEEKDAY.key,	{ value:defCfg.START_WEEKDAY.value, handler:this.delegateConfig, validator:this.cfg.checkNumber  } );
		
		/**
		* True if the Calendar should show weekday labels. True by default.
		* @config SHOW_WEEKDAYS
		* @type Boolean
		* @default true
		*/	
		this.cfg.addProperty(defCfg.SHOW_WEEKDAYS.key,	{ value:defCfg.SHOW_WEEKDAYS.value, handler:this.delegateConfig, validator:this.cfg.checkBoolean } );
		
		/**
		* True if the Calendar should show week row headers. False by default.
		* @config SHOW_WEEK_HEADER
		* @type Boolean
		* @default false
		*/	
		this.cfg.addProperty(defCfg.SHOW_WEEK_HEADER.key,{ value:defCfg.SHOW_WEEK_HEADER.value, handler:this.delegateConfig, validator:this.cfg.checkBoolean } );
		
		/**
		* True if the Calendar should show week row footers. False by default.
		* @config SHOW_WEEK_FOOTER
		* @type Boolean
		* @default false
		*/
		this.cfg.addProperty(defCfg.SHOW_WEEK_FOOTER.key,{ value:defCfg.SHOW_WEEK_FOOTER.value, handler:this.delegateConfig, validator:this.cfg.checkBoolean } );
		
		/**
		* True if the Calendar should suppress weeks that are not a part of the current month. False by default.
		* @config HIDE_BLANK_WEEKS
		* @type Boolean
		* @default false
		*/		
		this.cfg.addProperty(defCfg.HIDE_BLANK_WEEKS.key,{ value:defCfg.HIDE_BLANK_WEEKS.value, handler:this.delegateConfig, validator:this.cfg.checkBoolean } );
		
		/**
		* The image that should be used for the left navigation arrow.
		* @config NAV_ARROW_LEFT
		* @type String
		* @deprecated	You can customize the image by overriding the default CSS class for the left arrow - "calnavleft"
		* @default null
		*/		
		this.cfg.addProperty(defCfg.NAV_ARROW_LEFT.key,	{ value:defCfg.NAV_ARROW_LEFT.value, handler:this.delegateConfig } );
		
		/**
		* The image that should be used for the right navigation arrow.
		* @config NAV_ARROW_RIGHT
		* @type String
		* @deprecated	You can customize the image by overriding the default CSS class for the right arrow - "calnavright"
		* @default null
		*/		
		this.cfg.addProperty(defCfg.NAV_ARROW_RIGHT.key,	{ value:defCfg.NAV_ARROW_RIGHT.value, handler:this.delegateConfig } );
	
		// Locale properties
		
		/**
		* The short month labels for the current locale.
		* @config MONTHS_SHORT
		* @type String[]
		* @default ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
		*/
		this.cfg.addProperty(defCfg.MONTHS_SHORT.key,	{ value:defCfg.MONTHS_SHORT.value, handler:this.delegateConfig } );
		
		/**
		* The long month labels for the current locale.
		* @config MONTHS_LONG
		* @type String[]
		* @default ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
		*/		
		this.cfg.addProperty(defCfg.MONTHS_LONG.key,		{ value:defCfg.MONTHS_LONG.value, handler:this.delegateConfig } );
		
		/**
		* The 1-character weekday labels for the current locale.
		* @config WEEKDAYS_1CHAR
		* @type String[]
		* @default ["S", "M", "T", "W", "T", "F", "S"]
		*/		
		this.cfg.addProperty(defCfg.WEEKDAYS_1CHAR.key,	{ value:defCfg.WEEKDAYS_1CHAR.value, handler:this.delegateConfig } );
		
		/**
		* The short weekday labels for the current locale.
		* @config WEEKDAYS_SHORT
		* @type String[]
		* @default ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
		*/		
		this.cfg.addProperty(defCfg.WEEKDAYS_SHORT.key,	{ value:defCfg.WEEKDAYS_SHORT.value, handler:this.delegateConfig } );
		
		/**
		* The medium weekday labels for the current locale.
		* @config WEEKDAYS_MEDIUM
		* @type String[]
		* @default ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
		*/		
		this.cfg.addProperty(defCfg.WEEKDAYS_MEDIUM.key,	{ value:defCfg.WEEKDAYS_MEDIUM.value, handler:this.delegateConfig } );
		
		/**
		* The long weekday labels for the current locale.
		* @config WEEKDAYS_LONG
		* @type String[]
		* @default ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
		*/		
		this.cfg.addProperty(defCfg.WEEKDAYS_LONG.key,	{ value:defCfg.WEEKDAYS_LONG.value, handler:this.delegateConfig } );
	
		/**
		* The setting that determines which length of month labels should be used. Possible values are "short" and "long".
		* @config LOCALE_MONTHS
		* @type String
		* @default "long"
		*/
		this.cfg.addProperty(defCfg.LOCALE_MONTHS.key,	{ value:defCfg.LOCALE_MONTHS.value, handler:this.delegateConfig } );
	
		/**
		* The setting that determines which length of weekday labels should be used. Possible values are "1char", "short", "medium", and "long".
		* @config LOCALE_WEEKDAYS
		* @type String
		* @default "short"
		*/	
		this.cfg.addProperty(defCfg.LOCALE_WEEKDAYS.key,	{ value:defCfg.LOCALE_WEEKDAYS.value, handler:this.delegateConfig } );
	
		/**
		* The value used to delimit individual dates in a date string passed to various Calendar functions.
		* @config DATE_DELIMITER
		* @type String
		* @default ","
		*/
		this.cfg.addProperty(defCfg.DATE_DELIMITER.key,		{ value:defCfg.DATE_DELIMITER.value, handler:this.delegateConfig } );
	
		/**
		* The value used to delimit date fields in a date string passed to various Calendar functions.
		* @config DATE_FIELD_DELIMITER
		* @type String
		* @default "/"
		*/	
		this.cfg.addProperty(defCfg.DATE_FIELD_DELIMITER.key,{ value:defCfg.DATE_FIELD_DELIMITER.value, handler:this.delegateConfig } );
	
		/**
		* The value used to delimit date ranges in a date string passed to various Calendar functions.
		* @config DATE_RANGE_DELIMITER
		* @type String
		* @default "-"
		*/
		this.cfg.addProperty(defCfg.DATE_RANGE_DELIMITER.key,{ value:defCfg.DATE_RANGE_DELIMITER.value, handler:this.delegateConfig } );
	
		/**
		* The position of the month in a month/year date string
		* @config MY_MONTH_POSITION
		* @type Number
		* @default 1
		*/
		this.cfg.addProperty(defCfg.MY_MONTH_POSITION.key,	{ value:defCfg.MY_MONTH_POSITION.value, handler:this.delegateConfig, validator:this.cfg.checkNumber } );
		
		/**
		* The position of the year in a month/year date string
		* @config MY_YEAR_POSITION
		* @type Number
		* @default 2
		*/	
		this.cfg.addProperty(defCfg.MY_YEAR_POSITION.key,	{ value:defCfg.MY_YEAR_POSITION.value, handler:this.delegateConfig, validator:this.cfg.checkNumber } );
		
		/**
		* The position of the month in a month/day date string
		* @config MD_MONTH_POSITION
		* @type Number
		* @default 1
		*/	
		this.cfg.addProperty(defCfg.MD_MONTH_POSITION.key,	{ value:defCfg.MD_MONTH_POSITION.value, handler:this.delegateConfig, validator:this.cfg.checkNumber } );
		
		/**
		* The position of the day in a month/year date string
		* @config MD_DAY_POSITION
		* @type Number
		* @default 2
		*/	
		this.cfg.addProperty(defCfg.MD_DAY_POSITION.key,		{ value:defCfg.MD_DAY_POSITION.value, handler:this.delegateConfig, validator:this.cfg.checkNumber } );
		
		/**
		* The position of the month in a month/day/year date string
		* @config MDY_MONTH_POSITION
		* @type Number
		* @default 1
		*/	
		this.cfg.addProperty(defCfg.MDY_MONTH_POSITION.key,	{ value:defCfg.MDY_MONTH_POSITION.value, handler:this.delegateConfig, validator:this.cfg.checkNumber } );
		
		/**
		* The position of the day in a month/day/year date string
		* @config MDY_DAY_POSITION
		* @type Number
		* @default 2
		*/	
		this.cfg.addProperty(defCfg.MDY_DAY_POSITION.key,	{ value:defCfg.MDY_DAY_POSITION.value, handler:this.delegateConfig, validator:this.cfg.checkNumber } );
		
		/**
		* The position of the year in a month/day/year date string
		* @config MDY_YEAR_POSITION
		* @type Number
		* @default 3
		*/	
		this.cfg.addProperty(defCfg.MDY_YEAR_POSITION.key,	{ value:defCfg.MDY_YEAR_POSITION.value, handler:this.delegateConfig, validator:this.cfg.checkNumber } );
	
		/**
		* The position of the month in the month year label string used as the Calendar header
		* @config MY_LABEL_MONTH_POSITION
		* @type Number
		* @default 1
		*/
		this.cfg.addProperty(defCfg.MY_LABEL_MONTH_POSITION.key,	{ value:defCfg.MY_LABEL_MONTH_POSITION.value, handler:this.delegateConfig, validator:this.cfg.checkNumber } );
	
		/**
		* The position of the year in the month year label string used as the Calendar header
		* @config MY_LABEL_YEAR_POSITION
		* @type Number
		* @default 2
		*/
		this.cfg.addProperty(defCfg.MY_LABEL_YEAR_POSITION.key,	{ value:defCfg.MY_LABEL_YEAR_POSITION.value, handler:this.delegateConfig, validator:this.cfg.checkNumber } );
		
		/**
		* The suffix used after the month when rendering the Calendar header
		* @config MY_LABEL_MONTH_SUFFIX
		* @type String
		* @default " "
		*/
		this.cfg.addProperty(defCfg.MY_LABEL_MONTH_SUFFIX.key,	{ value:defCfg.MY_LABEL_MONTH_SUFFIX.value, handler:this.delegateConfig } );
		
		/**
		* The suffix used after the year when rendering the Calendar header
		* @config MY_LABEL_YEAR_SUFFIX
		* @type String
		* @default ""
		*/
		this.cfg.addProperty(defCfg.MY_LABEL_YEAR_SUFFIX.key, { value:defCfg.MY_LABEL_YEAR_SUFFIX.value, handler:this.delegateConfig } );

		/**
		* Configuration for the Month Year Navigation UI. By default it is disabled
		* @config NAV
		* @type Object
		* @default null
		*/
		this.cfg.addProperty(defCfg.NAV.key, { value:defCfg.NAV.value, handler:this.configNavigator } );
	},

	/**
	* Initializes CalendarGroup's built-in CustomEvents
	* @method initEvents
	*/
	initEvents : function() {
		var me = this;
		var strEvent = "Event";

		/**
		* Proxy subscriber to subscribe to the CalendarGroup's child Calendars' CustomEvents
		* @method sub
		* @private
		* @param {Function} fn	The function to subscribe to this CustomEvent
		* @param {Object}	obj	The CustomEvent's scope object
		* @param {Boolean}	bOverride	Whether or not to apply scope correction
		*/
		var sub = function(fn, obj, bOverride) {
			for (var p=0;p<me.pages.length;++p) {
				var cal = me.pages[p];
				cal[this.type + strEvent].subscribe(fn, obj, bOverride);
			}
		};

		/**
		* Proxy unsubscriber to unsubscribe from the CalendarGroup's child Calendars' CustomEvents
		* @method unsub
		* @private
		* @param {Function} fn	The function to subscribe to this CustomEvent
		* @param {Object}	obj	The CustomEvent's scope object
		*/
		var unsub = function(fn, obj) {
			for (var p=0;p<me.pages.length;++p) {
				var cal = me.pages[p];
				cal[this.type + strEvent].unsubscribe(fn, obj);
			}
		};
		
		var defEvents = YAHOO.widget.Calendar._EVENT_TYPES;
	
		/**
		* Fired before a selection is made
		* @event beforeSelectEvent
		*/
		this.beforeSelectEvent = new YAHOO.util.CustomEvent(defEvents.BEFORE_SELECT);
		this.beforeSelectEvent.subscribe = sub; this.beforeSelectEvent.unsubscribe = unsub;
	
		/**
		* Fired when a selection is made
		* @event selectEvent
		* @param {Array}	Array of Date field arrays in the format [YYYY, MM, DD].
		*/
		this.selectEvent = new YAHOO.util.CustomEvent(defEvents.SELECT); 
		this.selectEvent.subscribe = sub; this.selectEvent.unsubscribe = unsub;
	
		/**
		* Fired before a selection is made
		* @event beforeDeselectEvent
		*/
		this.beforeDeselectEvent = new YAHOO.util.CustomEvent(defEvents.BEFORE_DESELECT); 
		this.beforeDeselectEvent.subscribe = sub; this.beforeDeselectEvent.unsubscribe = unsub;
	
		/**
		* Fired when a selection is made
		* @event deselectEvent
		* @param {Array}	Array of Date field arrays in the format [YYYY, MM, DD].
		*/
		this.deselectEvent = new YAHOO.util.CustomEvent(defEvents.DESELECT); 
		this.deselectEvent.subscribe = sub; this.deselectEvent.unsubscribe = unsub;
		
		/**
		* Fired when the Calendar page is changed
		* @event changePageEvent
		*/
		this.changePageEvent = new YAHOO.util.CustomEvent(defEvents.CHANGE_PAGE); 
		this.changePageEvent.subscribe = sub; this.changePageEvent.unsubscribe = unsub;
	
		/**
		* Fired before the Calendar is rendered
		* @event beforeRenderEvent
		*/
		this.beforeRenderEvent = new YAHOO.util.CustomEvent(defEvents.BEFORE_RENDER);
		this.beforeRenderEvent.subscribe = sub; this.beforeRenderEvent.unsubscribe = unsub;
	
		/**
		* Fired when the Calendar is rendered
		* @event renderEvent
		*/
		this.renderEvent = new YAHOO.util.CustomEvent(defEvents.RENDER);
		this.renderEvent.subscribe = sub; this.renderEvent.unsubscribe = unsub;
	
		/**
		* Fired when the Calendar is reset
		* @event resetEvent
		*/
		this.resetEvent = new YAHOO.util.CustomEvent(defEvents.RESET); 
		this.resetEvent.subscribe = sub; this.resetEvent.unsubscribe = unsub;
	
		/**
		* Fired when the Calendar is cleared
		* @event clearEvent
		*/
		this.clearEvent = new YAHOO.util.CustomEvent(defEvents.CLEAR);
		this.clearEvent.subscribe = sub; this.clearEvent.unsubscribe = unsub;
	
		/**
		* Fired just before the CalendarGroup is to be shown
		* @event beforeShowEvent
		*/
		this.beforeShowEvent = new YAHOO.util.CustomEvent(defEvents.BEFORE_SHOW);
	
		/**
		* Fired after the CalendarGroup is shown
		* @event showEvent
		*/
		this.showEvent = new YAHOO.util.CustomEvent(defEvents.SHOW);
	
		/**
		* Fired just before the CalendarGroup is to be hidden
		* @event beforeHideEvent
		*/
		this.beforeHideEvent = new YAHOO.util.CustomEvent(defEvents.BEFORE_HIDE);
	
		/**
		* Fired after the CalendarGroup is hidden
		* @event hideEvent
		*/
		this.hideEvent = new YAHOO.util.CustomEvent(defEvents.HIDE);

		/**
		* Fired just before the CalendarNavigator is to be shown
		* @event beforeShowNavEvent
		*/
		this.beforeShowNavEvent = new YAHOO.util.CustomEvent(defEvents.BEFORE_SHOW_NAV);
	
		/**
		* Fired after the CalendarNavigator is shown
		* @event showNavEvent
		*/
		this.showNavEvent = new YAHOO.util.CustomEvent(defEvents.SHOW_NAV);
	
		/**
		* Fired just before the CalendarNavigator is to be hidden
		* @event beforeHideNavEvent
		*/
		this.beforeHideNavEvent = new YAHOO.util.CustomEvent(defEvents.BEFORE_HIDE_NAV);
	
		/**
		* Fired after the CalendarNavigator is hidden
		* @event hideNavEvent
		*/
		this.hideNavEvent = new YAHOO.util.CustomEvent(defEvents.HIDE_NAV);

		/**
		* Fired just before the CalendarNavigator is to be rendered
		* @event beforeRenderNavEvent
		*/
		this.beforeRenderNavEvent = new YAHOO.util.CustomEvent(defEvents.BEFORE_RENDER_NAV);

		/**
		* Fired after the CalendarNavigator is rendered
		* @event renderNavEvent
		*/
		this.renderNavEvent = new YAHOO.util.CustomEvent(defEvents.RENDER_NAV);
	},
	
	/**
	* The default Config handler for the "pages" property
	* @method configPages
	* @param {String} type	The CustomEvent type (usually the property name)
	* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
	* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
	*/
	configPages : function(type, args, obj) {
		var pageCount = args[0];
	
		var cfgPageDate = YAHOO.widget.CalendarGroup._DEFAULT_CONFIG.PAGEDATE.key;
	
		// Define literals outside loop	
		var sep = "_";
		var groupCalClass = "groupcal";
	
		var firstClass = "first-of-type";
		var lastClass = "last-of-type";
	
		for (var p=0;p<pageCount;++p) {
			var calId = this.id + sep + p;
			var calContainerId = this.containerId + sep + p;
	
			var childConfig = this.cfg.getConfig();
			childConfig.close = false;
			childConfig.title = false;
			childConfig.navigator = null;

			var cal = this.constructChild(calId, calContainerId, childConfig);
			var caldate = cal.cfg.getProperty(cfgPageDate);
			this._setMonthOnDate(caldate, caldate.getMonth() + p);
			cal.cfg.setProperty(cfgPageDate, caldate);
	
			YAHOO.util.Dom.removeClass(cal.oDomContainer, this.Style.CSS_SINGLE);
			YAHOO.util.Dom.addClass(cal.oDomContainer, groupCalClass);

			if (p===0) {
				YAHOO.util.Dom.addClass(cal.oDomContainer, firstClass);
			}
	
			if (p==(pageCount-1)) {
				YAHOO.util.Dom.addClass(cal.oDomContainer, lastClass);
			}
	
			cal.parent = this;
			cal.index = p; 
	
			this.pages[this.pages.length] = cal;
		}
	},
	
	/**
	* The default Config handler for the "pagedate" property
	* @method configPageDate
	* @param {String} type	The CustomEvent type (usually the property name)
	* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
	* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
	*/
	configPageDate : function(type, args, obj) {
		var val = args[0];
		var firstPageDate;
		
		var cfgPageDate = YAHOO.widget.CalendarGroup._DEFAULT_CONFIG.PAGEDATE.key;
		
		for (var p=0;p<this.pages.length;++p) {
			var cal = this.pages[p];
			if (p === 0) {
				firstPageDate = cal._parsePageDate(val);
				cal.cfg.setProperty(cfgPageDate, firstPageDate);
			} else {
				var pageDate = new Date(firstPageDate);
				this._setMonthOnDate(pageDate, pageDate.getMonth() + p);
				cal.cfg.setProperty(cfgPageDate, pageDate);
			}
		}
	},
	
	/**
	* The default Config handler for the CalendarGroup "selected" property
	* @method configSelected
	* @param {String} type	The CustomEvent type (usually the property name)
	* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
	* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
	*/
	configSelected : function(type, args, obj) {
		var cfgSelected = YAHOO.widget.CalendarGroup._DEFAULT_CONFIG.SELECTED.key;
		this.delegateConfig(type, args, obj);
		var selected = (this.pages.length > 0) ? this.pages[0].cfg.getProperty(cfgSelected) : []; 
		this.cfg.setProperty(cfgSelected, selected, true);
	},

	
	/**
	* Delegates a configuration property to the CustomEvents associated with the CalendarGroup's children
	* @method delegateConfig
	* @param {String} type	The CustomEvent type (usually the property name)
	* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
	* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
	*/
	delegateConfig : function(type, args, obj) {
		var val = args[0];
		var cal;
	
		for (var p=0;p<this.pages.length;p++) {
			cal = this.pages[p];
			cal.cfg.setProperty(type, val);
		}
	},

	/**
	* Adds a function to all child Calendars within this CalendarGroup.
	* @method setChildFunction
	* @param {String}		fnName		The name of the function
	* @param {Function}		fn			The function to apply to each Calendar page object
	*/
	setChildFunction : function(fnName, fn) {
		var pageCount = this.cfg.getProperty(YAHOO.widget.CalendarGroup._DEFAULT_CONFIG.PAGES.key);
	
		for (var p=0;p<pageCount;++p) {
			this.pages[p][fnName] = fn;
		}
	},

	/**
	* Calls a function within all child Calendars within this CalendarGroup.
	* @method callChildFunction
	* @param {String}		fnName		The name of the function
	* @param {Array}		args		The arguments to pass to the function
	*/
	callChildFunction : function(fnName, args) {
		var pageCount = this.cfg.getProperty(YAHOO.widget.CalendarGroup._DEFAULT_CONFIG.PAGES.key);
	
		for (var p=0;p<pageCount;++p) {
			var page = this.pages[p];
			if (page[fnName]) {
				var fn = page[fnName];
				fn.call(page, args);
			}
		}	
	},

	/**
	* Constructs a child calendar. This method can be overridden if a subclassed version of the default
	* calendar is to be used.
	* @method constructChild
	* @param {String}	id			The id of the table element that will represent the calendar widget
	* @param {String}	containerId	The id of the container div element that will wrap the calendar table
	* @param {Object}	config		The configuration object containing the Calendar's arguments
	* @return {YAHOO.widget.Calendar}	The YAHOO.widget.Calendar instance that is constructed
	*/
	constructChild : function(id,containerId,config) {
		var container = document.getElementById(containerId);
		if (! container) {
			container = document.createElement("div");
			container.id = containerId;
			this.oDomContainer.appendChild(container);
		}
		return new YAHOO.widget.Calendar(id,containerId,config);
	},
	
	/**
	* Sets the calendar group's month explicitly. This month will be set into the first
	* page of the multi-page calendar, and all other months will be iterated appropriately.
	* @method setMonth
	* @param {Number}	month		The numeric month, from 0 (January) to 11 (December)
	*/
	setMonth : function(month) {
		month = parseInt(month, 10);
		var currYear;

		var cfgPageDate = YAHOO.widget.CalendarGroup._DEFAULT_CONFIG.PAGEDATE.key;

		for (var p=0; p<this.pages.length; ++p) {
			var cal = this.pages[p];
			var pageDate = cal.cfg.getProperty(cfgPageDate);
			if (p === 0) {
				currYear = pageDate.getFullYear();
			} else {
				pageDate.setFullYear(currYear);
			}
			this._setMonthOnDate(pageDate, month+p); 
			cal.cfg.setProperty(cfgPageDate, pageDate);
		}
	},

	/**
	* Sets the calendar group's year explicitly. This year will be set into the first
	* page of the multi-page calendar, and all other months will be iterated appropriately.
	* @method setYear
	* @param {Number}	year		The numeric 4-digit year
	*/
	setYear : function(year) {
	
		var cfgPageDate = YAHOO.widget.CalendarGroup._DEFAULT_CONFIG.PAGEDATE.key;
	
		year = parseInt(year, 10);
		for (var p=0;p<this.pages.length;++p) {
			var cal = this.pages[p];
			var pageDate = cal.cfg.getProperty(cfgPageDate);
	
			if ((pageDate.getMonth()+1) == 1 && p>0) {
				year+=1;
			}
			cal.setYear(year);
		}
	},

	/**
	* Calls the render function of all child calendars within the group.
	* @method render
	*/
	render : function() {
		this.renderHeader();
		for (var p=0;p<this.pages.length;++p) {
			var cal = this.pages[p];
			cal.render();
		}
		this.renderFooter();
	},

	/**
	* Selects a date or a collection of dates on the current calendar. This method, by default,
	* does not call the render method explicitly. Once selection has completed, render must be 
	* called for the changes to be reflected visually.
	* @method select
	* @param	{String/Date/Date[]}	date	The date string of dates to select in the current calendar. Valid formats are
	*								individual date(s) (12/24/2005,12/26/2005) or date range(s) (12/24/2005-1/1/2006).
	*								Multiple comma-delimited dates can also be passed to this method (12/24/2005,12/11/2005-12/13/2005).
	*								This method can also take a JavaScript Date object or an array of Date objects.
	* @return	{Date[]}			Array of JavaScript Date objects representing all individual dates that are currently selected.
	*/
	select : function(date) {
		for (var p=0;p<this.pages.length;++p) {
			var cal = this.pages[p];
			cal.select(date);
		}
		return this.getSelectedDates();
	},

	/**
	* Selects dates in the CalendarGroup based on the cell index provided. This method is used to select cells without having to do a full render. The selected style is applied to the cells directly.
	* The value of the MULTI_SELECT Configuration attribute will determine the set of dates which get selected. 
	* <ul>
	*    <li>If MULTI_SELECT is false, selectCell will select the cell at the specified index for only the last displayed Calendar page.</li>
	*    <li>If MULTI_SELECT is true, selectCell will select the cell at the specified index, on each displayed Calendar page.</li>
	* </ul>
	* @method selectCell
	* @param	{Number}	cellIndex	The index of the cell to be selected. 
	* @return	{Date[]}	Array of JavaScript Date objects representing all individual dates that are currently selected.
	*/
	selectCell : function(cellIndex) {
		for (var p=0;p<this.pages.length;++p) {
			var cal = this.pages[p];
			cal.selectCell(cellIndex);
		}
		return this.getSelectedDates();
	},
	
	/**
	* Deselects a date or a collection of dates on the current calendar. This method, by default,
	* does not call the render method explicitly. Once deselection has completed, render must be 
	* called for the changes to be reflected visually.
	* @method deselect
	* @param	{String/Date/Date[]}	date	The date string of dates to deselect in the current calendar. Valid formats are
	*								individual date(s) (12/24/2005,12/26/2005) or date range(s) (12/24/2005-1/1/2006).
	*								Multiple comma-delimited dates can also be passed to this method (12/24/2005,12/11/2005-12/13/2005).
	*								This method can also take a JavaScript Date object or an array of Date objects.	
	* @return	{Date[]}			Array of JavaScript Date objects representing all individual dates that are currently selected.
	*/
	deselect : function(date) {
		for (var p=0;p<this.pages.length;++p) {
			var cal = this.pages[p];
			cal.deselect(date);
		}
		return this.getSelectedDates();
	},
	
	/**
	* Deselects all dates on the current calendar.
	* @method deselectAll
	* @return {Date[]}		Array of JavaScript Date objects representing all individual dates that are currently selected.
	*						Assuming that this function executes properly, the return value should be an empty array.
	*						However, the empty array is returned for the sake of being able to check the selection status
	*						of the calendar.
	*/
	deselectAll : function() {
		for (var p=0;p<this.pages.length;++p) {
			var cal = this.pages[p];
			cal.deselectAll();
		}
		return this.getSelectedDates();
	},
	
	/**
	* Deselects dates in the CalendarGroup based on the cell index provided. This method is used to select cells without having to do a full render. The selected style is applied to the cells directly.
	* deselectCell will deselect the cell at the specified index on each displayed Calendar page.
	*
	* @method deselectCell
	* @param	{Number}	cellIndex	The index of the cell to deselect. 
	* @return	{Date[]}	Array of JavaScript Date objects representing all individual dates that are currently selected.
	*/
	deselectCell : function(cellIndex) {
		for (var p=0;p<this.pages.length;++p) {
			var cal = this.pages[p];
			cal.deselectCell(cellIndex);
		}
		return this.getSelectedDates();
	},
	
	/**
	* Resets the calendar widget to the originally selected month and year, and 
	* sets the calendar to the initial selection(s).
	* @method reset
	*/
	reset : function() {
		for (var p=0;p<this.pages.length;++p) {
			var cal = this.pages[p];
			cal.reset();
		}
	},
	
	/**
	* Clears the selected dates in the current calendar widget and sets the calendar
	* to the current month and year.
	* @method clear
	*/
	clear : function() {
		for (var p=0;p<this.pages.length;++p) {
			var cal = this.pages[p];
			cal.clear();
		}
	},
	
	/**
	* Navigates to the next month page in the calendar widget.
	* @method nextMonth
	*/
	nextMonth : function() {
		for (var p=0;p<this.pages.length;++p) {
			var cal = this.pages[p];
			cal.nextMonth();
		}
	},
	
	/**
	* Navigates to the previous month page in the calendar widget.
	* @method previousMonth
	*/
	previousMonth : function() {
		for (var p=this.pages.length-1;p>=0;--p) {
			var cal = this.pages[p];
			cal.previousMonth();
		}
	},
	
	/**
	* Navigates to the next year in the currently selected month in the calendar widget.
	* @method nextYear
	*/
	nextYear : function() {
		for (var p=0;p<this.pages.length;++p) {
			var cal = this.pages[p];
			cal.nextYear();
		}
	},

	/**
	* Navigates to the previous year in the currently selected month in the calendar widget.
	* @method previousYear
	*/
	previousYear : function() {
		for (var p=0;p<this.pages.length;++p) {
			var cal = this.pages[p];
			cal.previousYear();
		}
	},

	/**
	* Gets the list of currently selected dates from the calendar.
	* @return			An array of currently selected JavaScript Date objects.
	* @type Date[]
	*/
	getSelectedDates : function() { 
		var returnDates = [];
		var selected = this.cfg.getProperty(YAHOO.widget.CalendarGroup._DEFAULT_CONFIG.SELECTED.key);
		for (var d=0;d<selected.length;++d) {
			var dateArray = selected[d];

			var date = YAHOO.widget.DateMath.getDate(dateArray[0],dateArray[1]-1,dateArray[2]);
			returnDates.push(date);
		}

		returnDates.sort( function(a,b) { return a-b; } );
		return returnDates;
	},

	/**
	* Adds a renderer to the render stack. The function reference passed to this method will be executed
	* when a date cell matches the conditions specified in the date string for this renderer.
	* @method addRenderer
	* @param	{String}	sDates		A date string to associate with the specified renderer. Valid formats
	*									include date (12/24/2005), month/day (12/24), and range (12/1/2004-1/1/2005)
	* @param	{Function}	fnRender	The function executed to render cells that match the render rules for this renderer.
	*/
	addRenderer : function(sDates, fnRender) {
		for (var p=0;p<this.pages.length;++p) {
			var cal = this.pages[p];
			cal.addRenderer(sDates, fnRender);
		}
	},

	/**
	* Adds a month to the render stack. The function reference passed to this method will be executed
	* when a date cell matches the month passed to this method.
	* @method addMonthRenderer
	* @param	{Number}	month		The month (1-12) to associate with this renderer
	* @param	{Function}	fnRender	The function executed to render cells that match the render rules for this renderer.
	*/
	addMonthRenderer : function(month, fnRender) {
		for (var p=0;p<this.pages.length;++p) {
			var cal = this.pages[p];
			cal.addMonthRenderer(month, fnRender);
		}
	},

	/**
	* Adds a weekday to the render stack. The function reference passed to this method will be executed
	* when a date cell matches the weekday passed to this method.
	* @method addWeekdayRenderer
	* @param	{Number}	weekday		The weekday (1-7) to associate with this renderer. 1=Sunday, 2=Monday etc.
	* @param	{Function}	fnRender	The function executed to render cells that match the render rules for this renderer.
	*/
	addWeekdayRenderer : function(weekday, fnRender) {
		for (var p=0;p<this.pages.length;++p) {
			var cal = this.pages[p];
			cal.addWeekdayRenderer(weekday, fnRender);
		}
	},

	/**
	 * Removes all custom renderers added to the CalendarGroup through the addRenderer, addMonthRenderer and 
	 * addWeekRenderer methods. CalendarGroup's render method needs to be called to after removing renderers 
	 * to see the changes applied.
	 * 
	 * @method removeRenderers
	 */
	removeRenderers : function() {
		this.callChildFunction("removeRenderers");
	},

	/**
	* Renders the header for the CalendarGroup.
	* @method renderHeader
	*/
	renderHeader : function() {
		// EMPTY DEFAULT IMPL
	},

	/**
	* Renders a footer for the 2-up calendar container. By default, this method is
	* unimplemented.
	* @method renderFooter
	*/
	renderFooter : function() {
		// EMPTY DEFAULT IMPL
	},

	/**
	* Adds the designated number of months to the current calendar month, and sets the current
	* calendar page date to the new month.
	* @method addMonths
	* @param {Number}	count	The number of months to add to the current calendar
	*/
	addMonths : function(count) {
		this.callChildFunction("addMonths", count);
	},
	
	/**
	* Subtracts the designated number of months from the current calendar month, and sets the current
	* calendar page date to the new month.
	* @method subtractMonths
	* @param {Number}	count	The number of months to subtract from the current calendar
	*/
	subtractMonths : function(count) {
		this.callChildFunction("subtractMonths", count);
	},

	/**
	* Adds the designated number of years to the current calendar, and sets the current
	* calendar page date to the new month.
	* @method addYears
	* @param {Number}	count	The number of years to add to the current calendar
	*/
	addYears : function(count) {
		this.callChildFunction("addYears", count);
	},

	/**
	* Subtcats the designated number of years from the current calendar, and sets the current
	* calendar page date to the new month.
	* @method subtractYears
	* @param {Number}	count	The number of years to subtract from the current calendar
	*/
	subtractYears : function(count) {
		this.callChildFunction("subtractYears", count);
	},

	/**
	 * Returns the Calendar page instance which has a pagedate (month/year) matching the given date. 
	 * Returns null if no match is found.
	 * 
	 * @method getCalendarPage
	 * @param {Date} date The JavaScript Date object for which a Calendar page is to be found.
	 * @return {Calendar} The Calendar page instance representing the month to which the date 
	 * belongs.
	 */
	getCalendarPage : function(date) {
		var cal = null;
		if (date) {
			var y = date.getFullYear(),
				m = date.getMonth();

			var pages = this.pages;
			for (var i = 0; i < pages.length; ++i) {
				var pageDate = pages[i].cfg.getProperty("pagedate");
				if (pageDate.getFullYear() === y && pageDate.getMonth() === m) {
					cal = pages[i];
					break;
				}
			}
		}
		return cal;
	},

	/**
	* Sets the month on a Date object, taking into account year rollover if the month is less than 0 or greater than 11.
	* The Date object passed in is modified. It should be cloned before passing it into this method if the original value needs to be maintained
	* @method	_setMonthOnDate
	* @private
	* @param	{Date}	date	The Date object on which to set the month index
	* @param	{Number}	iMonth	The month index to set
	*/
	_setMonthOnDate : function(date, iMonth) {
		// Bug in Safari 1.3, 2.0 (WebKit build < 420), Date.setMonth does not work consistently if iMonth is not 0-11
		if (YAHOO.env.ua.webkit && YAHOO.env.ua.webkit < 420 && (iMonth < 0 || iMonth > 11)) {
			var DM = YAHOO.widget.DateMath;
			var newDate = DM.add(date, DM.MONTH, iMonth-date.getMonth());
			date.setTime(newDate.getTime());
		} else {
			date.setMonth(iMonth);
		}
	},
	
	/**
	 * Fixes the width of the CalendarGroup container element, to account for miswrapped floats
	 * @method _fixWidth
	 * @private
	 */
	_fixWidth : function() {
		var w = 0;
		for (var p=0;p<this.pages.length;++p) {
			var cal = this.pages[p];
			w += cal.oDomContainer.offsetWidth;
		}
		if (w > 0) {
			this.oDomContainer.style.width = w + "px";
		}
	},
	
	/**
	* Returns a string representation of the object.
	* @method toString
	* @return {String}	A string representation of the CalendarGroup object.
	*/
	toString : function() {
		return "CalendarGroup " + this.id;
	}
};

/**
* CSS class representing the container for the calendar
* @property YAHOO.widget.CalendarGroup.CSS_CONTAINER
* @static
* @final
* @type String
*/
YAHOO.widget.CalendarGroup.CSS_CONTAINER = "yui-calcontainer";

/**
* CSS class representing the container for the calendar
* @property YAHOO.widget.CalendarGroup.CSS_MULTI_UP
* @static
* @final
* @type String
*/
YAHOO.widget.CalendarGroup.CSS_MULTI_UP = "multi";

/**
* CSS class representing the title for the 2-up calendar
* @property YAHOO.widget.CalendarGroup.CSS_2UPTITLE
* @static
* @final
* @type String
*/
YAHOO.widget.CalendarGroup.CSS_2UPTITLE = "title";

/**
* CSS class representing the close icon for the 2-up calendar
* @property YAHOO.widget.CalendarGroup.CSS_2UPCLOSE
* @static
* @final
* @deprecated	Along with Calendar.IMG_ROOT and NAV_ARROW_LEFT, NAV_ARROW_RIGHT configuration properties.
*					Calendar's <a href="YAHOO.widget.Calendar.html#Style.CSS_CLOSE">Style.CSS_CLOSE</a> property now represents the CSS class used to render the close icon
* @type String
*/
YAHOO.widget.CalendarGroup.CSS_2UPCLOSE = "close-icon";

YAHOO.lang.augmentProto(YAHOO.widget.CalendarGroup, YAHOO.widget.Calendar, "buildDayLabel",
																 "buildMonthLabel",
																 "renderOutOfBoundsDate",
																 "renderRowHeader",
																 "renderRowFooter",
																 "renderCellDefault",
																 "styleCellDefault",
																 "renderCellStyleHighlight1",
																 "renderCellStyleHighlight2",
																 "renderCellStyleHighlight3",
																 "renderCellStyleHighlight4",
																 "renderCellStyleToday",
																 "renderCellStyleSelected",
																 "renderCellNotThisMonth",
																 "renderBodyCellRestricted",
																 "initStyles",
																 "configTitle",
																 "configClose",
																 "configIframe",
																 "configNavigator",
																 "createTitleBar",
																 "createCloseButton",
																 "removeTitleBar",
																 "removeCloseButton",
																 "hide",
																 "show",
																 "toDate",
																 "_toDate",
																 "_parseArgs",
																 "browser");

/**
* The set of default Config property keys and values for the CalendarGroup
* @property YAHOO.widget.CalendarGroup._DEFAULT_CONFIG
* @final
* @static
* @private
* @type Object
*/
YAHOO.widget.CalendarGroup._DEFAULT_CONFIG = YAHOO.widget.Calendar._DEFAULT_CONFIG;
YAHOO.widget.CalendarGroup._DEFAULT_CONFIG.PAGES = {key:"pages", value:2};

YAHOO.widget.CalGrp = YAHOO.widget.CalendarGroup;

/**
* @class YAHOO.widget.Calendar2up
* @extends YAHOO.widget.CalendarGroup
* @deprecated The old Calendar2up class is no longer necessary, since CalendarGroup renders in a 2up view by default.
*/
YAHOO.widget.Calendar2up = function(id, containerId, config) {
	this.init(id, containerId, config);
};

YAHOO.extend(YAHOO.widget.Calendar2up, YAHOO.widget.CalendarGroup);

/**
* @deprecated The old Calendar2up class is no longer necessary, since CalendarGroup renders in a 2up view by default.
*/
YAHOO.widget.Cal2up = YAHOO.widget.Calendar2up;
