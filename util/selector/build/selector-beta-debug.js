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
            regexCache[str] = regexCache[str] || new RegExp(str);

            //return getRegExp(X.BEGIN_SPACE + val + X.END_SPACE).test(attr);
            return regexCache[str].test(attr);
        },
        '|=': function(attr, val) { return getRegExp(X.BEGIN + val + '[-]?', 'g').test(attr); }, // Match start with value followed by optional hyphen
        '^=': function(attr, val) { return attr.indexOf(val) === 0; }, // Match starts with value
        '$=': function(attr, val) { return attr.lastIndexOf(val) === attr.length - val.length; }, // Match ends with value
        '*=': function(attr, val) { return attr.indexOf(val) > -1; }, // Match contains value as substring 
        '': function(attr, val) { return attr; } // Just test for existence of attribute  // TODO: empty label is weak
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
            var children = Y.Selector.combinators['>'](node.parentNode); 
            return children[val - 1] === node;
        },

        'nth-last-child': function(node, val) {
            var children = Y.Selector.combinators['>'](node.parentNode); 
            return children[children.length - val] === node;
        },

        'nth-of-type': function(node, val) {
            var children = Y.Selector.combinators['>'](node.parentNode, node.tagName); 
            return children[val - 1] === node;
        },
         
        'nth-last-of-type': function(node, val) {
            var children = Y.Selector.combinators['>'](node.parentNode, node.tagName); 
            return children[children.length - val] === node;
        },
         
        'first-child': function(node) {
            return Y.Selector.pseudos['nth-child'](node, 1);
        },

        'last-child': function(node) {
            return Y.Selector.pseudos['nth-last-child'](node, 1);
        },

        'first-of-type': function(node, val) {
            return Y.Selector.pseudos['nth-of-type'](node, 1);
        },
         
        'last-of-type': function(node, val) {
            return Y.Selector.pseudos['nth-last-of-type'](node, 1);
        },
         
        'only-child': function(node) {
            return (!Y.Dom.getPreviousSibling(node) && !Y.Dom.getNextSibling(node));
        },

        'only-of-type': function(node) {
            var children = Y.Selector.combinators['>'](node.parentNode, node.tagName); 
            return (children.length === 1);
        },

        'empty': function(node) {
            return node.childNodes.length === 0;
        },

        'not': function(node, simple) {
            return !Y.Selector.simpleTest(node, simple);
        },

        'contains': function(node, str) { // TODO: unit test
            return node.indexOf(str) > -1;
        }
    },

    // TODO: make private?
    replaceShorthand: function(selector) {
        var shorthand = Y.Selector.shorthand;
        for (var re in shorthand) {
            selector = selector.replace(getRegExp(re + X.CAPTURE_IDENT, 'g'), shorthand[re]);
        }
        return selector;
    },

    /**
     * List of combinators and corresponding functions. 
     * These functions are called with the current node and expected type (tag),
     * and return an array of nodes.
     * @property combinators
     * @type object
     */
    combinators: {
        ' ': function(node, tag) {
            return node.getElementsByTagName(tag);
        },

        '>': function() {
            if (document.documentElement.children) {
                return function(node, tag) {
                    tag = tag || '*';
                    return node.children.tags(tag);
                };
            } else { // gecko
                return function(node, tag) {
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
        }(),

        '+': function(node, tag) {
            var sib = node.nextSibling;
            while (sib && !sib.tagName) {
                sib = sib.nextSibling;
            }

            if (sib && (tag == '*' || sib.tagName.toLowerCase() == tag)) {
                return [sib]; 
            }
            return [];
        },

        '~': function(node, tag) {
            var result = [];
            var sib = node.nextSibling;
            while (sib = sib.nextSibling) { // NOTE: assignment
                if (sib.nodeType === 1) {
                    result[result.length] = sib;
                } 
            }

            return result;
        }
    },

    /**
     * Tests whether the supplied node matches the supplied simple selector.
     * A simple selector does not contain combinators.
     * @method simpleTest
     *
     * @param {HTMLElement} node A reference to the HTMLElement being tested.
     * @param {string} selector The CSS Selector to test the node against.
     * @return{boolean} Whether or not the node matches the selector.
     * @static
     */
    simpleTest: function(node, selector, token) {
        var token = token || Y.Selector.tokenize(selector)[0];

        if (token.tag != '*' && node.tagName.toLowerCase() != token.tag) {
            return false; // tag match failed
        } 

        var ops = Y.Selector.operators;
        var ps = Y.Selector.operators;
        var attr = token.attributes;
        var pseudos = token.pseudos;

        for (var i = 0, len = attr.length; i < len; ++i) {
            if (!ops[attr[i][1]](node[attr[i][0]], attr[i][2])) {
                return false;
            }
        }
        for (var i = 0, len = pseudos.length; i < len; ++i) {
            if (ps[pseudos[i][0]] &&
                    !ps[pseudos[i][0]](node, pseudos[i][1])) {
                return false;
            }
        }
        return true;
    },

    // TODO: make private?
    tokenize: function(selector) {
        var token,
            tokens = [],
            m,
            aliases = Y.Selector.attrAliases,
            reAttr = getRegExp(X.ATTRIBUTES, 'g'),
            rePseudo = getRegExp(X.PSEUDO, 'g');

        selector = Y.Selector.replaceShorthand(selector);
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

            while (m = reAttr.exec(token.predicate)) {
                if (aliases[m[1]]) { // convert reserved words, etc
                    m[1] = aliases[m[1]];
                }
                token.attributes[token.attributes.length] = m.slice(1); // capture attribute tokens
            }
            
            while (m = rePseudo.exec(token.predicate)) {
                token.pseudos[token.pseudos.length] = m.slice(1); // capture pseudo tokens
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
     * Filters a set of nodes based on a given CSS simple selector. 
     * A simple selector does not contain combinators.
     * @method simpleFilter
     *
     * @param {HTMLElement} node A reference to the HTMLElement being tested.
     * @param {string} simple The Simple Selector to test the node against.
     * @return{array} An array of nodes from the supplied array that match the given selector.
     * @static
     */
    simpleFilter: function(nodes, simple, token) {
        var result = [],
            simpleTest = Y.Selector.simpleTest,
            ops = Y.Selector.operators,
            ps = Y.Selector.pseudos,
            attributes = token.attributes,
            attr,
            tag = token.tag,
            pseudos = token.pseudos;

        outer:
        for (var i = 0, len = nodes.length; i < len; ++i) {
            if (tag != '*' && nodes[i].tagName.toLowerCase() != tag) {
                continue; // tag match failed
            } 

            for (var j = 0, jlen = attributes.length; j < jlen; ++j) {
                attr = attributes[j];
                if (nodes[i][attr[0]]  === '' || // TODO: hasAttribute? What if title=""?
                        (ops[attr[1]] &&
                        !ops[attr[1]](nodes[i][attr[0]], attr[2]))
                ) {
                    continue outer;
                }
            }

            for (var j = 0, jlen = pseudos.length; j < jlen; ++j) {
                if (ps[pseudos[j][0]] &&
                        !ps[pseudos[j][0]](nodes[i], pseudos[j][1])) {
                    continue outer;
                }
            }
            result[result.length] = nodes[i];
        }
        return result;
    },

    /**
     * Retrieves a set of nodes based on a given CSS selector. 
     * @method queryAll
     *
     * @param {string} selector The CSS Selector to test the node against.
     * @param {HTMLElement} optional An HTMLElement to start the query from. Defaults to document.
     * @return{array} An array of nodes that match the given selector.
     * @static
     */
    queryAll: function(selector, root) {
        root = root || document;
        var tokens = Y.Selector.tokenize(selector);
        var result,
            nodes,
            token = tokens.shift();

        if (getRegExp('#' + X.CAPTURE_IDENT).test(token.predicates)) { // use ID shortcut
            nodes = [document.getElementById(RegExp.$1)];
        } else {
            nodes = root.getElementsByTagName(token.tag);
        }

        if (token.next) {
            result = filterByToken(nodes, token);
        } else {
            result = Y.Selector.simpleFilter(nodes, selector, token);
        }

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
        return Y.Selector.queryAll(selector, root)[0]; // TODO: break out so scanning stops after first node found
    }
};

var filter = function(nodes, token, noCache) {
    var result = [],
        filtered = [],
        elements,
        getBy = Y.Selector.combinators,
        node,
        noCache = noCache || !!token.next,
        simple = token.simple,
        next = token.next,
        comb = token.combinator,
        j;

    for (var i = 0, len = nodes.length; i < len; ++i) {
        node = nodes[i];
        if ( (node._found) || !Y.Selector.simpleTest(node, simple, token) ) {
            continue; // already found or failed test
        }

        if (token.next && token.combinator !== ',') {
            elements = arguments.callee(getBy[comb](node, next.tag), next, noCache);
            if (elements.length) {
                filtered = filtered.concat(elements);
            }
        } else {
            if (!noCache) {
                node._found = true;
                foundCache.push(node);
            }
            result[result.length] = node;
        }
    }
    return (result.length) ? result : filtered;
};

var filterByToken = function(nodes, token, root, noCache) {
    var result = filter(nodes, token, noCache); 

    if (token.next && token.combinator === ',') {
        var elements = arguments.callee(root.getElementsByTagName(token.next.tagName),
                token.next, root, noCache);
        if (elements.length) {
           result = result.concat(elements); 
        }
    }
    clearFoundCache();
    return result;
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

Y.Selector = new Selector();
})();
YAHOO.register("selector", YAHOO.util.Selector, {version: "@VERSION@", build: "@BUILD@"});
