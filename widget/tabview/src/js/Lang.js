(function() {
    
    YAHOO.util.Lang = {
        isArray: function(val) { // frames lose type, so test constructor string
            if (val.constructor && val.constructor.toString().indexOf('Array') > -1) {
                return true;
            } else {
                return YAHOO.util.Lang.isObject(val) && val.constructor == Array;
            }
        },
        
        isBoolean: function(val) {
            return typeof val == 'boolean';
        },
    
        isFunction: function(val) {
            return typeof val == 'function';
        },
        
        isNull: function(val) {
            return val === null;
        },
        
        isNumber: function(val) {
            return !isNaN(val);
        },
        
        isObject: function(val) {
            return typeof val == 'object' || YAHOO.util.Lang.isFunction(val);
        },
        
        isString: function(val) {
            return typeof val == 'string';
        },
        
        isUndefined: function(val) {
            return typeof val == 'undefined';
        }
    };
})();