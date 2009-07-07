/**
 * Widget for Flash embedding
 * @namespace YAHOO.widget
 * @module swf
 */

YAHOO.namespace("widget");

/**
 * Flash embedding utility.
 * @class SWF
 */
(function () {
	var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        SWFDetect = YAHOO.util.SWFDetect,
        Lang = YAHOO.lang,
        UA = YAHOO.env.ua,

		// private
		FLASH_CID = "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000",
		FLASH_TYPE = "application/x-shockwave-flash",
		FLASH_VER = "10.22",
		EXPRESS_INSTALL_URL = "http://fpdownload.macromedia.com/pub/flashplayer/update/current/swf/autoUpdater.swf?" + Math.random(),
		EVENT_HANDLER = "YAHOO.widget.SWF.eventHandler",
	// change to hash
		possibleAttributes = "#align#allowNetworking#allowScriptAccess#archive#base#bgcolor#border#codetype#devicefont#dir#hspace#lang#menu#name#quality#salign#scale#standby#style#tabindex#title#usemap#vspace#wmode#";
		
YAHOO.widget.SWF = function (p_oElement /*:String*/, swfURL /*:String*/, p_oAttributes /*:Object*/ ) {
	
	this._queue = this._queue || [];
	this._events = this._events || {};
	this._configs = this._configs || {};
	this._id = Dom.generateId(null, "yuiswf");
	
	var _id = this._id;
    var oElement = Dom.get(p_oElement);
	var flashVersion = (p_oAttributes["version"] || FLASH_VER);
	var isFlashVersionRight = SWFDetect.isFlashVersionAtLeast(flashVersion);
	var canExpressInstall = (UA.flash >= 8.0);
	var shouldExpressInstall = canExpressInstall && !isFlashVersionRight && p_oAttributes["useExpressInstall"];
	var flashURL = (shouldExpressInstall)?EXPRESS_INSTALL_URL:swfURL;
	var objstring = '<object ';
	var w, h;
	var flashvarstring = "YUISwfId=" + _id + "&YUIBridgeCallback=" + EVENT_HANDLER + "&";

    if (oElement && (isFlashVersionRight || shouldExpressInstall) && flashURL) {
				objstring += 'id="' + _id + '" '; 
				if (UA.ie) {
					objstring += 'classid="' + FLASH_CID + '" '
				}
				else {
					objstring += 'type="' + FLASH_TYPE + '" data="' + flashURL + '" ';
				}
				
                w = "100%";
				h = "100%";
				
				objstring += 'width="' + w + '" height="' + h + '">';
				
				if (UA.ie) {
					objstring += '<param name="movie" value="' + flashURL + '"/>';
				}
				
				for (var attribute in p_oAttributes.fixedAttributes) {
					if (possibleAttributes.indexOf("#" + attribute + "#") >= 0) {
						objstring += '<param name="' + attribute + '" value="' + p_oAttributes.fixedAttributes[attribute] + '"/>';
					}
				}

				for (var flashvar in p_oAttributes.flashVars) {
					var fvar = p_oAttributes.flashVars[flashvar];
					if (Lang.isString(fvar)) {
						flashvarstring += "&" + flashvar + "=" + encodeURIComponent(fvar);
					}
				}
				
				if (flashvarstring) {
					objstring += '<param name="flashVars" value="' + flashvarstring + '"/>';
				}
				
				objstring += "</object>"; 

				oElement.innerHTML = objstring;
			}
			
			YAHOO.widget.SWF.superclass.constructor.call(this, Dom.get(_id));
			YAHOO.widget.SWF._instances[_id] = this;
			
			this._swf = Dom.get(_id);	
};

YAHOO.widget.SWF._instances = YAHOO.widget.SWF._instances || {};

YAHOO.widget.SWF.eventHandler = function (swfid, event) {
	YAHOO.widget.SWF._instances[swfid]._eventHandler(event);
};

YAHOO.extend(YAHOO.widget.SWF, YAHOO.util.Element, {
	_eventHandler: function(event)
	{
		this.fireEvent(event.type, event);
	},	
	callSWF: function (func, args)
	{
		if (this._swf[func]) {
		return(this._swf[func].apply(this._swf, args));
	    } else {
		return null;
	    }
	}
});

	
})();
YAHOO.register("swf", YAHOO.widget.SWF, {version: "2.7.0", build: "1796"});
YAHOO.register("swf", YAHOO.widget.SWF, {version: "@VERSION@", build: "@BUILD@"});
