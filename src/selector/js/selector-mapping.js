var Y = YAHOO,
    Y_DOM = YAHOO.util.Dom, 
    Y_DOM_inDoc = Y_DOM.inDocument, 

    Y_UA = Y.env.ua,

    Y_guid = Y_DOM.generateId,
    
    Y_DOC = document,
    Y_DOCUMENT_ELEMENT = Y_DOC.documentElement,

    Y_Array = function(o, startIdx) {
        var l, a, start = startIdx || 0;

        // IE errors when trying to slice HTMLElement collections
        try {
            return Array.prototype.slice.call(o, start);
        } catch (e) {
            a = [];
            l = o.length;
            for (; start < l; start++) {
                a.push(o[start]);
            }
            return a;
        }
    };


