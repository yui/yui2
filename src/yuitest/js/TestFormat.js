YAHOO.namespace("tool.TestFormat");

/**
 * Returns test results formatted as a JSON string. Requires JSON utility.
 * @param {Object} result The results object created by TestRunner.
 * @return {String} An XML-formatted string of results.
 * @namespace YAHOO.tool.TestFormat
 * @method JSON
 * @static
 */
YAHOO.tool.TestFormat.JSON = function(results /*:Object*/) /*:String*/ {
    return YAHOO.lang.JSON.stringify(results);
};

/**
 * Returns test results formatted as an XML string.
 * @param {Object} result The results object created by TestRunner.
 * @return {String} An XML-formatted string of results.
 * @namespace YAHOO.tool.TestFormat
 * @method XML
 * @static
 */
YAHOO.tool.TestFormat.XML = function(results /*:Object*/) /*:String*/ {

    var l = YAHOO.lang;
    var xml /*:String*/ = "<" + results.type + " name=\"" + results.name.replace(/"/g, "&quot;").replace(/'/g, "&apos;") + "\"";
    
    if (l.isNumber(results.duration)){
        xml += " duration=\"" + results.duration + "\"";
    }
    
    if (results.type == "test"){
        xml += " result=\"" + results.result + "\" message=\"" + results.message + "\">";
    } else {
        xml += " passed=\"" + results.passed + "\" failed=\"" + results.failed + "\" ignored=\"" + results.ignored + "\" total=\"" + results.total + "\">";
        for (var prop in results) {
            if (l.hasOwnProperty(results, prop) && l.isObject(results[prop]) && !l.isArray(results[prop])){
                xml += arguments.callee(results[prop]);
            }
        }        
    }

    xml += "</" + results.type + ">";
    
    return xml;

};