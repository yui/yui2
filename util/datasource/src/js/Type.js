/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * The static Number class provides helper functions to deal with data of type
 * Number.
 *
 * @namespace YAHOO.util
 * @requires yahoo
 * @class Number
 * @static
 */
 YAHOO.util.Number = {
 
     /**
     * Takes a native JavaScript Number and formats to string for display to user.
     *
     * @method format
     * @param nData {Number} Number.
     * @param oConfig {Object} (Optional) Optional configuration values:
     *  <dl>
     *   <dt>prefix {String}</dd>
     *   <dd>String prepended before each number, like a currency designator "$"</dd>
     *   <dt>decimalPlaces {Number}</dd>
     *   <dd>Number of decimal places to round.</dd>
     *   <dt>decimalSeparator {String}</dd>
     *   <dd>Decimal separator</dd>
     *   <dt>thousandsSeparator {String}</dd>
     *   <dd>Thousands separator</dd>
     *   <dt>suffix {String}</dd>
     *   <dd>String appended after each number, like " items" (note the space)</dd>
     *  </dl>
     * @return {String} Formatted number for display.
     */
    format : function(nData, oConfig) {
        oConfig = oConfig || {};
        
        if(!YAHOO.lang.isNumber(nData)) {
            nData *= 1;
        }

        if(YAHOO.lang.isNumber(nData)) {
            var bNegative = (nData < 0);
            var sOutput = nData + "";
            var sDecimalSeparator = (oConfig.decimalSeparator) ? oConfig.decimalSeparator : ".";
            var nDotIndex;

            // Manage decimals
            if(YAHOO.lang.isNumber(oConfig.decimalPlaces)) {
                // Round to the correct decimal place
                var nDecimalPlaces = oConfig.decimalPlaces;
                var nDecimal = Math.pow(10, nDecimalPlaces);
                sOutput = Math.round(nData*nDecimal)/nDecimal + "";
                nDotIndex = sOutput.lastIndexOf(".");

                if(nDecimalPlaces > 0) {
                    // Add the decimal separator
                    if(nDotIndex < 0) {
                        sOutput += sDecimalSeparator;
                        nDotIndex = sOutput.length-1;
                    }
                    // Replace the "."
                    else if(sDecimalSeparator !== "."){
                        sOutput = sOutput.replace(".",sDecimalSeparator);
                    }
                    // Add missing zeros
                    while((sOutput.length - 1 - nDotIndex) < nDecimalPlaces) {
                        sOutput += "0";
                    }
                }
            }
            
            // Add the thousands separator
            if(oConfig.thousandsSeparator) {
                var sThousandsSeparator = oConfig.thousandsSeparator;
                nDotIndex = sOutput.lastIndexOf(sDecimalSeparator);
                nDotIndex = (nDotIndex > -1) ? nDotIndex : sOutput.length;
                var sNewOutput = sOutput.substring(nDotIndex);
                var nCount = -1;
                for (var i=nDotIndex; i>0; i--) {
                    nCount++;
                    if ((nCount%3 === 0) && (i !== nDotIndex) && (!bNegative || (i > 1))) {
                        sNewOutput = sThousandsSeparator + sNewOutput;
                    }
                    sNewOutput = sOutput.charAt(i-1) + sNewOutput;
                }
                sOutput = sNewOutput;
            }

            // Prepend prefix
            sOutput = (oConfig.prefix) ? oConfig.prefix + sOutput : sOutput;

            // Append suffix
            sOutput = (oConfig.suffix) ? sOutput + oConfig.suffix : sOutput;

            return sOutput;
        }
        // Still not a Number, just return unaltered
        else {
            return nData;
        }
    }
 };



/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

(function() {

var xPad=function(x, pad, r)
{
    if(typeof(r) === 'undefined')
    {
        r=10;
    }
    for( ; parseInt(x, 10)<r && r>1; r/=10)
        x = pad.toString() + x;
    return x.toString();
};


/**
 * The static Date class provides helper functions to deal with data of type
 * Date.
 *
 * @namespace YAHOO.util
 * @requires yahoo
 * @class Date
 * @static
 */
 var Dt = {
    _locales: { },

    formats: {
        a: function(d, l) { return l.a[d.getDay()]; },
        A: function(d, l) { return l.A[d.getDay()]; },
        b: function(d, l) { return l.b[d.getMonth()]; },
        B: function(d, l) { return l.B[d.getMonth()]; },
        c: 'toLocaleString',
        C: function(d) { return xPad(parseInt(d.getFullYear()/100, 10), 0); },
        d: ['getDate', '0'],
        e: ['getDate', ' '],
        g: function(d) { return xPad(parseInt(Dt.formats.G(d)%100, 10), 0); },
        G: function(d) {
                var y = d.getFullYear();
                var V = parseInt(Dt.formats.V(d), 10);
                var W = parseInt(Dt.formats.W(d), 10);
    
                if(W > V) {
                    y++;
                } else if(W===0 && V>=52) {
                    y--;
                }
    
                return y;
            },
        H: ['getHours', '0'],
        I: function(d) { var I=d.getHours()%12; return xPad(I===0?12:I, 0); },
        j: function(d) {
                var ms = d - new Date('' + d.getFullYear() + '/1/1 GMT');
                ms += d.getTimezoneOffset()*60000;
                var doy = parseInt(ms/60000/60/24, 10);
                return xPad(doy, 0, 100);
            },
        m: function(d) { return xPad(d.getMonth()+1, 0); },
        M: ['getMinutes', '0'],
        p: function(d, l) { return l.p[d.getHours() >= 12 ? 1 : 0 ]; },
        P: function(d, l) { return l.P[d.getHours() >= 12 ? 1 : 0 ]; },
        S: ['getSeconds', '0'],
        u: function(d) { var dow = d.getDay(); return dow===0?7:dow; },
        U: function(d) {
                var doy = parseInt(Dt.formats.j(d), 10);
                var rdow = 6-d.getDay();
                var woy = parseInt((doy+rdow)/7, 10);
                return xPad(woy, 0);
            },
        V: function(d) {
                var woy = parseInt(Dt.formats.W(d), 10);
                var dow1_1 = (new Date('' + d.getFullYear() + '/1/1')).getDay();
                // First week is 01 and not 00 as in the case of %U and %W,
                // so we add 1 to the final result except if day 1 of the year
                // is a Monday (then %W returns 01).
                // We also need to subtract 1 if the day 1 of the year is 
                // Friday-Sunday, so the resulting equation becomes:
                var idow = woy + (dow1_1 > 4 || dow1_1 <= 1 ? 0 : 1);
                if(idow == 53 && (new Date('' + d.getFullYear() + '/12/31')).getDay() < 4)
                {
                    idow = 1;
                }
                else if(idow === 0)
                {
                    idow = Dt.formats.V(new Date('' + (d.getFullYear()-1) + '/12/31'));
                }
    
                return xPad(idow, 0);
            },
        w: 'getDay',
        W: function(d) {
                var doy = parseInt(Dt.formats.j(d), 10);
                var rdow = 7-Dt.formats.u(d);
                var woy = parseInt((doy+rdow)/7, 10);
                return xPad(woy, 0, 10);
            },
        y: function(d) { return xPad(d.getFullYear()%100, 0); },
        Y: 'getFullYear',
        z: function(d) {
                var o = d.getTimezoneOffset();
                var H = xPad(parseInt(Math.abs(o/60), 10), 0);
                var M = xPad(o%60, 0);
                return (o>0?'-':'+') + H + M;
            },
        Z: function(d) { return d.toString().replace(/^.*\(([^)]+)\)$/, '$1'); },
        '%': function(d) { return '%'; }
    },

    aggregates: {
        c: 'locale',
        D: '%m/%d/%y',
        h: '%b',
        n: '\n',
        r: '%I:%M:%S %p',
        R: '%H:%M',
        t: '\t',
        T: '%H:%M:%S',
        x: 'locale',
        X: 'locale'
    },

     /**
     * Takes a native JavaScript Date and formats to string for display to user.
     *
     * @method format
     * @param oDate {Date} Date.
     * @param oConfig {Object} (Optional) Optional configuration values:
     *  <dl>
     *   <dt>format {String}</dd>
     *   <dd>Any format defined by strftime is supported (e.g., "%Y/%m/%d" or "%Y-%m-%dT%H:%M:%S%z")</dd>
     *  </dl>
     * @param sLocale {String} (Optional) The locale to use when displaying days of week,
     *  months of the year, and other locale specific strings.
     * @return {String} Formatted date for display.
     */
    format : function(oDate, oConfig, sLocale) {
        oConfig = oConfig || {};
        
        if(!(oDate instanceof Date)) {
            return YAHOO.lang.isValue(oDate) ? oDate : "";
        }

        // Backwards compatibility
        if(oConfig.format == "MM/DD/YYYY") {
            oConfig.format = "%m/%d/%Y";
        }
       else if(oConfig.format == "YYYY/MM/DD") {
            oConfig.format = "%Y/%m/%d";
        }
        else if(oConfig.format == "DD/MM/YYYY") {
            oConfig.format = "%d/%m/%Y";
        }
        
        
        var format = oConfig.format || "%m/%d/%Y";
            
        sLocale = sLocale || "en";

        // Make sure we have a definition for the requested locale, or default to en.
        if(!(sLocale in Dt._locales)) {
            if(sLocale in YAHOO.util.DateLocale) {
                Dt._locales[sLocale] = new YAHOO.util.DateLocale[sLocale];
            } else if(sLocale.replace(/-[a-zA-Z]+$/, '') in Dt._locales) {
                sLocale = sLocale.replace(/-[a-zA-Z]+$/, '');
            } else if(sLocale.replace(/-[a-zA-Z]+$/, '') in YAHOO.util.DateLocale) {
                sLocale = sLocale.replace(/-[a-zA-Z]+$/, '');
                Dt._locales[sLocale] = new YAHOO.util.DateLocale[sLocale];
            } else {
                sLocale = "en";
            }
        }

        var aLocale = Dt._locales[sLocale];

        // First replace aggregates
        while(format.match(/%[cDhnrRtTxXzZ]/)) {
            format = format.replace(/%([cDhnrRtTxXzZ])/g, function(m0, m1) {
                    var f = Dt.aggregates[m1];
                    return (f == 'locale' ? aLocale[m1] : f);
            });
        }

        // Now replace formats
        var str = format.replace(/%([aAbBCdegGHIjmMpPSuUVwWyY%])/g, function(m0, m1) {
                var f = Dt.formats[m1];
                if(typeof(f) == 'string') {             // string => built in date function
                    return oDate[f]();
                } else if(typeof(f) == 'function') {    // function => our own function
                    return f.call(oDate, oDate, aLocale);
                } else if(typeof(f) == 'object' && typeof(f[0]) == 'string') {  // built in function with padding
                    return xPad(oDate[f[0]](), f[1]);
                } else {
                    return m1;
                }
            });

        return str;
    }
 };
 
 Dt.aggregates.z = Dt.formats.z(new Date());
 Dt.aggregates.Z = Dt.formats.Z(new Date());

 YAHOO.namespace("YAHOO.util");
 YAHOO.util.Date = Dt;

 YAHOO.util.DateLocale = function() {};

 YAHOO.util.DateLocale['en'] = function() {};
 YAHOO.lang.extend(YAHOO.util.DateLocale['en'], YAHOO.util.DateLocale, {
        a: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        A: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        b: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        B: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        c: '%a %d %b %Y %T %Z',
        p: ['AM', 'PM'],
        P: ['am', 'pm'],
        x: '%d/%m/%y',
        X: '%T'
 });

 YAHOO.util.DateLocale['en-US'] = function() {};
 YAHOO.lang.extend(YAHOO.util.DateLocale['en-US'], YAHOO.util.DateLocale['en'], {
        c: '%a %b %e %T %Y',
        x: '%D'
 });

 YAHOO.util.DateLocale['en-GB'] = function() {};
 YAHOO.lang.extend(YAHOO.util.DateLocale['en-GB'], YAHOO.util.DateLocale['en']);

 YAHOO.util.DateLocale['en-AU'] = function() {};
 YAHOO.lang.extend(YAHOO.util.DateLocale['en-AU'], YAHOO.util.DateLocale['en-GB']);

 for(var l in YAHOO.util.DateLocale) {
    if(YAHOO.util.DateLocale[l] && YAHOO.util.DateLocale[l].superclass)
        Dt._locales[l] = new YAHOO.util.DateLocale[l];
 }

})();
