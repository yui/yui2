/**
 * The selector module provides helper methods allowing CSS3 Selectors to be used with DOM elements.
 * @module selector
 * @title Selector Utility
 * @namespace YAHOO.util
 * @requires yahoo, dom
 */

(function() {
/**
 * Provides helper methods for collecting and filtering DOM elements.
 * @namespace YAHOO.util
 * @class Selector
 * @static
 */
var Selector = function() {};

var Y = YAHOO.util;

var X = {
    IDENT: '-?[_a-z]+[-\\w]*',
    BEGIN: '^',
    END: '$',
    HYPHEN: '-',
    OR: '|',
    S: '\\s*',
    SP: '\\s+'
};

var CHARS = {
    SIMPLE: '-+\\w_\\[\\]\\.\\|\\*\\\'\\(\\)#:^~=$!"',
    COMBINATORS: ',>+~'
};

X.CAPTURE_IDENT = '(' + X.IDENT + ')';
X.BEGIN_SPACE = '(?:' + X.BEGIN + X.OR + X.SP +')';
X.END_SPACE = '(?:' + X.SP + X.OR + X.END + ')';
X.SELECTOR = '^(' + X.CAPTURE_IDENT + '?([' + CHARS.SIMPLE + ']*)?\\s*([' + CHARS.COMBINATORS + ']?)?\\s*).*$';
X.SIMPLE = '(' + X.CAPTURE_IDENT + '?([' + CHARS.SIMPLE + ']*)*)?';
X.ATTRIBUTES = '\\[([a-z]+\\w*)+([~\\|\\^\\$\\*!=]=?)?"?([^\\]"]*)"?\\]';
X.PSEUDO = ':' + X.CAPTURE_IDENT + '(?:\\({1}' + X.SIMPLE + '\\){1})*';
X.NTH_CHILD = '^(?:(\\d*)(n){1}|(odd|even)$)*([-+])*(\\d*)$';

Selector.prototype = {
    /**
     * Default document for use queries 
     * @property document
     * @type object
     * @default window.document
     */
    document: window.document,
    /**
     * Mapping of attributes to aliases
     * @property attrAliases
     * @type object
     */
    attrAliases: {
        'for': 'htmlFor',
        'class': 'className'
    },

    /**
     * Mapping of shorthand tokens to corresponding attribute selector 
     * @property shorthand
     * @type object
     */
    shorthand: {
        '#': '[id=$1]',
        '\\.': '[className~=$1]'
    },

    /**
     * List of operators and corresponding boolean functions. 
     * These functions are passed the attribute and the current node's value of the attribute.
     * @property operators
     * @type object
     */
    operators: {
        '=': function(attr, val) { return attr === val; }, // Equality
        '!=': function(attr, val) { return attr !== val; }, // Inequality
        '~=': function(attr, val) { // Match one of space seperated words 
            var str = X.BEGIN_SPACE + val + X.END_SPACE;
            regexCache[str] = regexCache[str] || new RegExp(str); // skip getRegExp call for perf boost

            //return getRegExp(X.BEGIN_SPACE + val + X.END_SPACE).test(attr);
            return regexCache[str].test(attr);
        },
        '|=': function(attr, val) { return getRegExp(X.BEGIN + val + '[-]?', 'g').test(attr); }, // Match start with value followed by optional hyphen
        '^=': function(attr, val) { return attr.indexOf(val) === 0; }, // Match starts with value
        '$=': function(attr, val) { return attr.lastIndexOf(val) === attr.length - val.length; }, // Match ends with value
        '*=': function(attr, val) { return attr.indexOf(val) > -1; }, // Match contains value as substring 
        '': function(attr, val) { return attr; } // Just test for existence of attribute
    },

    /**
     * List of pseudo-classes and corresponding boolean functions. 
     * These functions are called with the current node, and any value that was parsed with the pseudo regex.
     * @property pseudos
     * @type object
     */
    pseudos: {
        'root': function(node) {
            return node === node.ownerDocument.documentElement;
        },

        'nth-child': function(node, val) {
            return getNthChild(node, val);
        },

        'nth-last-child': function(node, val) {
            return getNthChild(node, val, null, true);
        },

        'nth-of-type': function(node, val) {
            return getNthChild(node, val, node.tagName);
        },
         
        'nth-last-of-type': function(node, val) {
            return getNthChild(node.parentNode, val, node.tagName, true);
        },
         
        'first-child': function(node) {
            return Selector.pseudos['nth-child'](node, 1);
        },

        'last-child': function(node) {
            var children = getChildren(node.parentNode);
            return children[children.length - 1];
        },

        'first-of-type': function(node, val) {
            return getChildren(node.parentNode, node.tagName.toLowerCase())[0];
        },
         
        'last-of-type': function(node, val) {
            var children = getChildren(node.parentNode, node.tagName.toLowerCase());
            return children[children.length - 1];
        },
         
        'only-child': function(node) {
            return (!Y.Dom.getPreviousSibling(node) && !Y.Dom.getNextSibling(node));
        },

        'only-of-type': function(node) {
            return getChildren(node.parentNode, node.tagName.toLowerCase()).length === 1;
        },

        'empty': function(node) {
            return node.childNodes.length === 0;
        },

        'not': function(node, simple) {
            return !Selector.test(node, simple);
        },

        'contains': function(node, str) {
            return node.innerHTML.indexOf(str) > -1;
        }
    },

    /**
     * Test if the supplied node matches the supplied selector.
     * @method test
     *
     * @param {HTMLElement | String} node An id or node reference to the HTMLElement being tested.
     * @param {string} selector The CSS Selector to test the node against.
     * @return{boolean} Whether or not the node matches the selector.
     * @static
    
     */
    test: function(node, selector) {
        node = Selector.document.getElementById(node) || node;
        return rTestNode(node, selector);
    },

    // TODO: make private?
    tokenize: function(selector) {
        if (!selector) return [];
            var token,
            tokens = [],
            m,
            aliases = Selector.attrAliases,
            attr,
            reAttr = getRegExp(X.ATTRIBUTES, 'g'),
            rePseudo = getRegExp(X.PSEUDO, 'g');

        selector = replaceShorthand(selector);
        // break selector into simple selector units
        while ( selector.length && getRegExp(X.SELECTOR).test(selector) ) {
            token = {
                previous: token,
                simple: RegExp.$1,
                tag: RegExp.$2.toLowerCase() || '*',
                predicate: RegExp.$3,
                attributes: [],
                pseudos: [],
                combinator: RegExp.$4
            };

            // Parse pseudos first, then strip from predicate to 
            // avoid false positive from :not.
            while (m = rePseudo.exec(token.predicate)) {
                token.predicate = token.predicate.replace(m[0], '');
                token.pseudos[token.pseudos.length] = m.slice(1);
            }
            
            
            while (m = reAttr.exec(token.predicate)) { // parse attributes
                if (aliases[m[1]]) { // convert reserved words, etc
                    m[1] = aliases[m[1]];
                }
                attr = m.slice(1); // capture attribute tokens
                if (attr[1] === undefined) {
                    attr[1] = ''; // test for existence if no operator
                }
                token.attributes[token.attributes.length] = attr;
            }
            
            token.id = getId(token.attributes);
            if (token.previous) {
                token.previous.combinator = token.previous.combinator || ' ';
            }
            tokens[tokens.length] = token;
            selector = trim(selector.substr(token.simple.length));
        } 
        return tokens;
    },

    /**
     * Filters a set of nodes based on a given CSS selector. 
     * @method filter
     *
     * @param {array}  A set of nodes/ids to filter. 
     * @param {string} selector The selector used to test each node.
     * @return{array} An array of nodes from the supplied array that match the given selector.
     * @static
     */
    filter: function(arr, selector) {
        if (!arr || !selector) {
            YAHOO.log('filter: invalid input, returning array as is', 'warn', 'Selector');
        }
        var node,
            nodes = arr,
            result = [],
            tokens = Selector.tokenize(selector);

        if (!nodes.item) { // if not HTMLCollection, handle arrays of ids and/or nodes
            YAHOO.log('filter: scanning input for HTMLElements/IDs', 'info', 'Selector');
            for (var i = 0, len = arr.length; i < len; ++i) {
                if (!arr[i].tagName) { // tagName limits to HTMLElements 
                    node = Selector.document.getElementByid(arr[i]);
                    if (node) { // skip IDs that return null 
                        nodes[nodes.length] = node;
                    } else {
                        YAHOO.log('filter: skipping invalid node', 'warn', 'Selector');
                    }
                }
            }
        }
        result = rFilter(nodes, Selector.tokenize(selector));
        YAHOO.log('filter: returning:' + result.length, 'info', 'Selector');
        return result;
    },

    /**
     * Retrieves a set of nodes based on a given CSS selector. 
     * @method queryAll
     *
     * @param {string} selector The CSS Selector to test the node against.
     * @param {HTMLElement | String} optional An id or HTMLElement to start the query from. Defaults to document.
     * @return{array} An array of nodes that match the given selector.
     * @static
     */
    queryAll: function(selector, root) {
        root = Selector.document.getElementById(root) || root; 
        var result = query(selector, root);
        YAHOO.log('queryAll: returning ' + result.length + ' nodes', 'info', 'Selector');
        return result;
    },

    /**
     * Retrieves the first node that matches the given CSS selector. 
     * @method query
     *
     * @param {string} selector The CSS Selector to test the node against.
     * @param {HTMLElement} optional An HTMLElement to start the query from. Defaults to document.
     * @return{HTMLElement} A DOM node that match the given selector.
     * @static
     */
    query: function(selector, root) {
        root = Selector.document.getElementById(root) || root; 
        var result = query(selector, root);
        YAHOO.log('query: returning ' + result.length + ' nodes', 'info', 'Selector');
        return result;
    }
};

var query = function(selector, root, firstOnly) {
    if (!selector) {
        return []; // no nodes for you
    }
    root = root || Selector.document;
    var tokens = Selector.tokenize(selector);
    var result = [],
        idToken = tokens[getIdTokenIndex(tokens)],
        nodes = [],
        node,
        id,
        token = tokens.pop();
        
    if (idToken) {
        id = getId(idToken.attributes);
    }
    // if no root alternate root is specified use id shortcut
    if (id) {
        if (id === token.id) { // only one target
            nodes = [Selector.document.getElementById(id)] || root;
            YAHOO.log('_query: returning ' + result.length + ' nodes', 'info', 'Selector');
        } else { // reset root to id node if passes
            node = Selector.document.getElementById(id);
            if (root === Selector.document || root.contains(node)) {
                if ( node && rTestNode(node, null, idToken) ) {
                    root = node; // start from here
                }
            } else {
                return [];
            }
        }
    }

    if (root && !nodes.length) {
        nodes = root.getElementsByTagName(token.tag);
    }

    if (nodes.length) {
        result = rFilter(nodes, token, root, firstOnly); 
        clearFoundCache();
    }
    return result;
};

var rFilter = function(nodes, token, root, firstOnly) {
    var result = [],
        prev = token.previous,
        markFound = false,
        candidates = [],
        deDuped = [],
        node;

    if (prev && prev.combinator === ',') { // start group from top && deDupe
        candidates = arguments.callee(root.getElementsByTagName(prev.tag), prev, root);
        for (var i = 0, len = candidates.length; i < len; ++i) {
            if (!candidates[i]._found) {
                candidates[i]._found = true;
                deDuped[deDuped.length] = candidates[i];
                foundCache[foundCache.length] = candidates[i];
            }
        }
        result = result.concat(deDuped);
    }

    for (var i = 0, len = nodes.length; i < len; ++i) {
        node = nodes[i];
        if ( !rTestNode(node, null, token) ) {
            continue;
        }
        if (firstOnly) {
            return [node];
        }
        result[result.length] = node;
    }

    return result;
};

var rTestNode = function(node, selector, token) {
    token = token || Selector.tokenize(selector).pop();

    if (node._found || token.tag != '*' && node.tagName.toLowerCase() != token.tag) {
        return false; // tag match failed
    } 

    var ops = Selector.operators;
    var ps = Selector.pseudos;
    var attr = token.attributes;
    var pseudos = token.pseudos;
    var prev = token.previous;

    for (var i = 0, len = attr.length; i < len; ++i) {
        if (ops[attr[i][1]] && !ops[attr[i][1]](node[attr[i][0]], attr[i][2])) {
            return false;
        }
    }
    for (var i = 0, len = pseudos.length; i < len; ++i) {
        if (ps[pseudos[i][0]] &&
                !ps[pseudos[i][0]](node, pseudos[i][1])) {
            return false;
        }
    }

    if (prev) {
        if (prev.combinator !== ',') {
            return combinators[prev.combinator](node, token);
        }
    }
    return true;

};

var foundCache = [];
var regexCache = {};

var clearFoundCache = function() {
    YAHOO.log('getBySelector: clearing found cache of ' + foundCache.length + ' elements');
    for (var i = 0, len = foundCache.length; i < len; ++i) {
        try { // IE no like delete
            delete foundCache[i]._found;
        } catch(e) {
            foundCache[i].removeAttribute('_found');
        }
    }
    foundCache = [];
    YAHOO.log('getBySelector: done clearing foundCache');
};

var getRegExp = function(str, flags) {
    flags = flags || '';
    if (!regexCache[str + flags]) {
        regexCache[str + flags] = new RegExp(str, flags);
    }
    return regexCache[str + flags];
};

var trim = function(str) {
    return str.replace(getRegExp(X.BEGIN + X.SP + X.OR + X.SP + X.END, 'g'), "");
};

var combinators = {
    ' ': function(node, token) {
        node = node.parentNode;
        while (node && node.tagName) {
            if (rTestNode(node, null, token.previous)) {
                return true;
            }
            node = node.parentNode;
        }  
        return false;
    },

    '>': function(node, token) {
        return rTestNode(node.parentNode, null, token.previous);
    },
    '+': function(node, token) {
        var sib = node.previousSibling;
        while (sib && sib.nodeType !== 1) {
            sib = sib.previousSibling;
        }

        if (sib && rTestNode(sib, null, token.previous)) {
            return true; 
        }
        return false;
    },

    '~': function(node, token) {
        var sib = node.previousSibling;
        while (sib) {
            if (sib.nodeType === 1 && rTestNode(sib, null, token.previous)) {
                return true;
            }
            sib = sib.previousSibling;
        }

        return false;
    }
};

var getChildren = function() {
    if (document.documentElement.children) { // document for capability test
        return function(node, tag) {
            return tag ? node.children.tags(tag) : node.children;
        };
    } else {
        return function(node, tag) {
            var children = [],
                childNodes = node.childNodes,
                childTag;

            for (var i = 0, len = childNodes.length; i < len; ++i) {
                childTag = childNodes[i].tagName;
                if (childTag) {
                    if (!tag || childTag.toLowerCase() === tag) {
                        children[children.length] = childNodes[i];
                    }
                }
            }
            return children;
        };
    }
}();

/*
    an+b = get every _a_th node starting at the _b_th
    0n+b = no repeat ("0" and "n" may both be omitted (together) , e.g. "0n+1" or "1", not "0+1"), return only the _b_th element
    1n+b =  get every element starting from b ("1" may may be omitted, e.g. "1n+0" or "n+0" or "n")
    an+0 = get every _a_th element, "0" may be omitted 
*/
var getNthChild = function(node, expr, tag, reverse) {
    //var b = Number(expr);
    if (tag) tag = tag.toLowerCase();
    getRegExp(X.NTH_CHILD).test(expr);
    var a = parseInt(RegExp.$1, 10), // include every _a_ elements (zero means no repeat, just first _a_)
        n = RegExp.$2, // "n"
        oddeven = RegExp.$3, // "odd" or "even"
        op = RegExp.$4 || '+', // "+" or "-" (scan fwd or rev)
        b = parseInt(RegExp.$5, 10) || 0; // start scan from element _b_


YAHOO.log('n: ' + n);
    if ( isNaN(a) ) {
        a = 1;
    }
YAHOO.log('b: ' + b);
    if (oddeven) {
        a = 2; // always every other
        op = '+';
        n = 'n';
        b = (oddeven === 'odd') ? 1 : 2;
    }
    var children = getChildren(node.parentNode, tag);
    var result = [];


    if ( (n && !a) || ( !n ) ) { // undefined or 0
        return node === children[b-1]; 
    }

    if (a === 1) { // every node starting from b - 1
        for (var i = 0, len = children.length; i < len; i++) {
            if (children[i] === node && i > b - 1) {
                return true;
            }
        }
    }

    // else every _a_th node starting from b - 1
    if (!reverse) {
        for (var i = b - 1, len = children.length; i < len; i += a) {
            if ( children[i] === node ) {
                return true;
            }
        }
    } else {
        for (var i = children.length - b; i >= 0; i -= a) {
            if ( children[i] === node ) {
                return true;
            }
        }
    }
    return false;
};

var getId = function(attr) {
    for (var i = 0, len = attr.length; i < len; ++i) {
        if (attr[i][0] == 'id' && attr[i][1] === '=') {
            return attr[i][2];
        }
    }
};

var getIdTokenIndex = function(tokens) {
    for (var i = 0, len = tokens.length; i < len; ++i) {
        if (getId(tokens[i].attributes)) {
            return i;
        }
    }
    return -1;
};
var replaceShorthand = function(selector) {
    var shorthand = Selector.shorthand;
    for (var re in shorthand) {
        selector = selector.replace(getRegExp(re + X.CAPTURE_IDENT, 'g'), shorthand[re]);
    }
    return selector;
};

Selector = new Selector();
Selector.CHARS = CHARS;
Selector.TOKENS = X;
Y.Selector = Selector;
})();
YAHOO.register("selector", YAHOO.util.Selector, {version: "@VERSION@", build: "@BUILD@"});
