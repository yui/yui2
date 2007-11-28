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
    SIMPLE: '-\\w_\\[\\]\\.\\|\\*\\\'\\(\\)#:^~=$!"',
    COMBINATORS: ',>+~'
};

X.CAPTURE_IDENT = '(' + X.IDENT + ')';
X.BEGIN_SPACE = '(?:' + X.BEGIN + X.OR + X.SP +')';
X.END_SPACE = '(?:' + X.SP + X.OR + X.END + ')';
X.SELECTOR = '^(' + X.CAPTURE_IDENT + '?([' + CHARS.SIMPLE + ']*)?\\s*([' + CHARS.COMBINATORS + ']?)?\\s*).*$';
X.SIMPLE = '(' + X.CAPTURE_IDENT + '?([' + CHARS.SIMPLE + ']*)*)?';
X.ATTRIBUTES = '\\[([a-z]+\\w*)+([~\\|\\^\\$\\*!=]=?)?"?([^\\]"]*)"?\\]';
X.PSEUDO = ':' + X.CAPTURE_IDENT + '(?:\\({1}' + X.SIMPLE + '\\){1})*';

Selector.prototype = {
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
            return getChildren(node.parentNode)[val - 1] === node;
        },

        'nth-last-child': function(node, val) {
            return getChildren(node.parentNode)[children.length - val] === node;
        },

        'nth-of-type': function(node, val) {
            return getChildren(node.parentNode, node.tagName)[val - 1] === node;
        },
         
        'nth-last-of-type': function(node, val) {
            var children = getChildren(node.parentNode, node.tagName); 
            return children[children.length - val] === node;
        },
         
        'first-child': function(node) {
            return Selector.pseudos['nth-child'](node, 1);
        },

        'last-child': function(node) {
            return Selector.pseudos['nth-last-child'](node, 1);
        },

        'first-of-type': function(node, val) {
            return Selector.pseudos['nth-of-type'](node, 1);
        },
         
        'last-of-type': function(node, val) {
            return Selector.pseudos['nth-last-of-type'](node, 1);
        },
         
        'only-child': function(node) {
            return (!Y.Dom.getPreviousSibling(node) && !Y.Dom.getNextSibling(node));
        },

        'only-of-type': function(node) {
            return getChildren(node.parentNode, node.tagName).length === 1;
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
        node = document.getElementById(node) || node;
        return rTestNode(node, selector);
    },

    // TODO: make private?
    tokenize: function(selector) {
        var token,
            tokens = [],
            m,
            aliases = Selector.attrAliases,
            reAttr = getRegExp(X.ATTRIBUTES, 'g'),
            rePseudo = getRegExp(X.PSEUDO, 'g');

        selector = replaceShorthand(selector);
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

            var attr;
            while (m = rePseudo.exec(token.predicate)) { // process pseudos first to avoid false pos with :not
                token.predicate = token.predicate.replace(m[0], ''); // remove matched string from predicate
                token.pseudos[token.pseudos.length] = m.slice(1); // capture pseudo tokens
            }
            
            while (m = reAttr.exec(token.predicate)) {
                if (aliases[m[1]]) { // convert reserved words, etc
                    m[1] = aliases[m[1]];
                }
                attr = m.slice(1); // capture attribute tokens
                if (attr[1] === undefined) {
                    attr[1] = ''; // test for existence if no operator
                }
                token.attributes[token.attributes.length] = attr;
            }
            
            if (token.previous) {
                token.previous.next = token;
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
     * @param {array} nodes A set of nodes to filter. 
     * @param {string} selector The selector used to test each node.
     * @return{array} An array of nodes from the supplied array that match the given selector.
     * @static
     */
    filter: function(nodes, selector) {
        var tokens = Selector.tokenize(selector);
        return rFilter(nodes, Selector.tokenize(selector));
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
        root = document.getElementById(root) || root || document; 
        return query(selector, root);
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
        root = document.getElementById(root) || root || document; 
        return query(selector, root, true); // TODO: break out so scanning stops after first node found
    }
};

var query = function(selector, root, firstOnly) {
    root = root || document;
    var tokens = Selector.tokenize(selector);
    var firstToken = tokens[0];
    var result = [],
        nodes = [],
        //token = tokens.shift();
        token = tokens.pop();

    var id = getId(firstToken.attributes);

    if (id && document === root) {
        if (firstToken === token) { // zero depth
            nodes = [document.getElementById(id)];
        } else {
            root = document.getElementById(id);
        }
    }

    if (root && !nodes.length) {
        nodes = root.getElementsByTagName(token.tag);
    }

    if (nodes.length) {
        result = rFilter(nodes, token, root); 
        clearFoundCache();
    }
    return result;
};

var rFilter = function(nodes, token, root) {
    var result = [],
        prev = token.previous,
        markFound = false,
        candidates = [],
        deDuped = [],
        node;

    if (prev && prev.combinator === ',') { // start group from top && deDupe
        candidates = rFilter(root.getElementsByTagName(prev.tag), prev, root);
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
    if (document.documentElement.children) {
        return function(node, tag) {
            return tag ? node.children.tags(tag) : node.children;
        };
    } else {
        return function(node, tag) { // TODO: tag?
            var children = [],
                childNodes = node.childNodes;

            for (var i = 0, len = childNodes.length; i < len; ++i) {
                if (childNodes[i].nodeType === 1) {
                    children[children.length] = childNodes[i];
                }
            }
            return children;
        };
    }
}();

var getId = function(attr) {
    for (var i = 0, len = attr.length; i < len; ++i) {
        if (attr[i][0] == 'id' && attr[i][1] === '=') {
            return attr[i][2];
        }
    }
};

var replaceShorthand = function(selector) {
    var shorthand = Selector.shorthand;
    for (var re in shorthand) {
        selector = selector.replace(getRegExp(re + X.CAPTURE_IDENT, 'g'), shorthand[re]);
    }
    return selector;
};

Selector = new Selector();
Y.Selector = Selector;
})();
