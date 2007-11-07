(function() {
var Selector = function() {};

var Y = YAHOO.util;

var X = {
    IDENT: '-?[_a-z]+[-\\w]*',
    BEGIN: '^',
    END: '$',
    HYPHEN: '-',
    OR: '|',
    S: '\\s*',
    SP: '\\s+',
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

Selector.prototype = {
    selectors: {
        'id': {
            pattern: '#' + X.CAPTURE_IDENT,
            test: function(node, id) {
                return node.id === id; 
            }
        },

        'className': {
            pattern: '\\.' + X.CAPTURE_IDENT,
            test: function(node, className) {
                return getRegExp(X.BEGIN_SPACE + className + X.END_SPACE).test(node.className);
            }
        },

        'attribute': {
            pattern: '\\[([a-z]+\\w*)+([~\\|\\^\\$\\*!=]=?)?"?([^\\]"]*)"?\\]',
            test: function(node, attr, op, value) {
                op = op || '';
                var nodeVal;
                switch(attr) {
                    case 'class':
                        nodeVal = node.className;
                        break;
                    case 'for':
                        nodeVal = node.htmlFor;
                        break;
                    case 'href':
                        nodeVal = node.getAttributes('href', 2);
                        break;
                    default:
                        nodeVal = node[attr];
                }

                if (nodeVal !== '') {
                    return Y.Selector.operators[op](nodeVal, value);                
                }
            }
        },

        'pseudo': {
            pattern: ':' + X.CAPTURE_IDENT + '(?:\\({1}' + X.SIMPLE + '\\){1})*',
            test: function(node, pseudo, val) {
                return Y.Selector.pseudos[pseudo](node, val); 
            }
        }
    },

    operators: {
        '=': function(attr, val) { return attr === val; }, // Equality
        '!=': function(attr, val) { return attr !== val; }, // Inequality
        '~=': function(attr, val) { // Match one of space seperated words 
            return getRegExp(X.BEGIN_SPACE + val + X.END_SPACE).test(attr);
        },
        '|=': function(attr, val) { return getRegExp(X.BEGIN + val + '[-]?', 'g').test(attr); }, // Match start with value followed by optional hyphen
        '^=': function(attr, val) { return attr.indexOf(val) === 0; }, // Match starts with value
        '$=': function(attr, val) { return attr.lastIndexOf(val) === attr.length - val.length; }, // Match ends with value
        '*=': function(attr, val) { return attr.indexOf(val) > -1; }, // Match contains value as substring 
        '': function(attr, val) { return attr; } // Just test for existence of attribute  // TODO: empty label is weak
    },

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

    combinators: {
        ' ': function(node, tag) {
            return node.getElementsByTagName(tag);
        },

        '>': function() {
            if (document.documentElement.children) {
                return function(node, tag) {
                    tag = tag || '*'.toLowerCase();
                    //clearFoundCache(); // TODO: why clear here?
                    return node.children.tags(tag);
                };
            } else { // gecko
                return function(node, tag) {
                    return Y.Dom.getChildrenBy(node, function(child) {
                        return (tag) ? child.tagName.toLowerCase() === tag.toLowerCase() : true;
                    });
                };
            }
        }(),

        '+': function(node, tag) {
            var element = Y.Dom.getNextSiblingBy(node);
            if (!tag) {
                return [element];
            } else {
                return ( (element && element.tagName.toLowerCase() == tag) ? [element]: [] );
            }
        },

        '~': function(node, tag) {
            var elements = [];
            Y.Dom.getNextSiblingBy(node, function(el) {
                if (!el._found && testNode(el, token.next)) {
                    // TODO: test tagName?
                    if (el.tagName.toUpperCase() === token.next.tagName.toUpperCase()) {
                        markFound(el);
                        elements.push(el);
                    }
                }
                return false; // to scan all sibilings
            });
            return elements;
        }
    },

    simpleTest: function(node, selector, token) {
        var token = token || Y.Selector.tokenize(selector)[0];

        if (token.tag != '*' && node.tagName.toLowerCase() != token.tag) {
            return false;
        } 

        var selectors = Y.Selector.selectors;
        var predicates = token.predicates;
        var args;

        if (token.predicate) {
            for (var type in predicates) {
                if (predicates[type] !== undefined) {
                    for (var i = 0, len = predicates[type].length; i < len; ++i) {
                        args = [node].concat(predicates[type][i]);
                        if (!selectors[type].test.apply(null, args)) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    },

    tokenize: function(selector) {
        var token,
            tokens = [];

        while ( selector.length && getRegExp(X.SELECTOR).test(selector) ) {
            token = {
                previous: token,
                simple: RegExp.$1,
                tag: RegExp.$2.toLowerCase() || '*',
                predicate: RegExp.$3,
                combinator: RegExp.$4,
                predicates: {}
            };

            var selectors = Y.Selector.selectors;
            var args;

            if (token.predicate) {
                var m;
                for (var type in selectors) { // parse predicates
                    m = token.predicate.match(getRegExp(selectors[type].pattern, 'g')); 
                    if (m) {
                        token.predicates[type] = [];
                        for (var i = 0, len = m.length; i < len; ++i) {
                            args = getRegExp(selectors[type].pattern, 'g').exec(m[i]);
                            if (args) {
                                args.shift(); // remove full match
                                token.predicates[type].push(args); // to apply to type tests
                            }
                        }
                    }
                }
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

    simpleFilter: function(nodes, simple) {
        var result = [];
        for (var i = 0, len = nodes.length; i < len; ++i) {
            if (Y.Selector.simpleTest(nodes[i], simple)) {
                result[result.length] = nodes[i];
            }
        }
        return result;
    },

    queryAll: function(selector, root) {
        root = root || document;
        var tokens = Y.Selector.tokenize(selector);
        var result,
            nodes,
            token = tokens.shift();

        if (token.predicates.id) { // use ID shortcut
            nodes = [document.getElementById(token.predicates.id[0][0])];
        } else {
            nodes = root.getElementsByTagName(token.tag);
        }

        if (token.next) {
            result = filterByToken(nodes, token);
        } else {
            result = Y.Selector.simpleFilter(nodes, selector);
        }

        return result;
    }
};

var filter = function(nodes, token, noCache) {
    var result = [],
        filtered = [],
        elements,
        tests = Y.Selector.tokens,
        getBy = Y.Selector.combinators,
        node,
        j;

    for (var i = 0, len = nodes.length; i < len; ++i) {
        node = nodes[i];
        if ( (node._found) || !Y.Selector.simpleTest(node, token.simple, token) ) {
            continue; // already found or failed test
        }

        if (token.next && token.combinator !== ',') { // follow combinators to preserve source order
            elements = arguments.callee(getBy[token.combinator](node, token.next.tag), token.next, noCache);
            if (elements.length) {
                filtered = filtered.concat(elements);
            }
        } else {
            if (!node._found) {
                node._found = true;
                foundCache.push(node);
            }
            result.push(node);
        }
    }
    return (result.length) ? result : filtered;
};

var filterByToken = function(nodes, token, root, noCache) {
    var result = filter(nodes, token, noCache); 

    if (token.next && token.combinator && token.combinator === ',') {
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
        delete foundCache[i]._found;
    }
    foundCache = [];
    YAHOO.log('getBySelector: done clearing foundCache');
};

var getRegExp = function(str, flags) {
    flags = flags || '';
    var re = regexCache[str];
    if (!re) {
        re = new RegExp(str, flags);
        regexCache[str + flags] = re;
    }
    return re;
};

var trim = function(str) {
    return str.replace(getRegExp(X.BEGIN + X.SP + X.OR + X.SP + X.END, 'g'), "");
};

Y.Selector = new Selector();
})();
YAHOO.register("selector", YAHOO.util.Selector, {version: "@VERSION@", build: "@BUILD@"});
