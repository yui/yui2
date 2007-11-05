(function() {
var Selector = function() {};

var Y = YAHOO.util;

var X = {
    IDENT: '-?[_a-z]+[_a-z0-9-]*',
    BEGIN: '^',
    END: '$',
    HYPHEN: '-',
    OR: '|',
    S: '\\s*',
    SP: '\\s+'
};

//re = /([a-z0-9]*)*([\[\.#:]{1}[a-z0-9]+)*\s*([>~+]?)?\s*(.*)*/i;
X.CAPTURE_IDENT = '(' + X.IDENT + ')';
X.BEGIN_SPACE = '(?:' + X.BEGIN + X.OR + X.SP +')';
X.END_SPACE = '(?:' + X.SP + X.OR + X.END + ')';
X.SELECTOR = '^((\\*|[a-z0-9]+)?([\\.#:\[]?[a-z]+[\\w\\-\\[\\]\.:\\(\\)#^~=$\\|\\*"\\\'\\!]*)?\\s*([,>+~]?)?\\s*).*$';
X.SIMPLE = '((\\*|[a-z0-9]+)?([\\.#:\[]?[a-z]+[\\w\\-\\[\\]\.:\\(\\)#^~=$\\|\\*"\\\'\\!]*)?\\s*)*';

Selector.prototype = {
    tokens: {
        '#': {
            pattern: '#' + X.CAPTURE_IDENT,
            test: function(node, id) {
                return node.id === id; 
            }
        },

        '.': {
            pattern: '\\.' + X.CAPTURE_IDENT,
            test: function(node, className) {
//console.log(getRegex(X.BEGIN_SPACE + className + X.END_SPACE).test(node.className));
//console.log(arguments);
                return getRegex(X.BEGIN_SPACE + className + X.END_SPACE).test(node.className);
                //return Y.Selector.tokens['['].test(node, 'className', '~=', node.className);
            }
        },

        '[': {
            pattern: '\\[([a-z]+\\w*)+([~\\|\\^\\$\\*!=]=?)?"?([^\\]"]*)"?\\]',
            //pattern: '\\[' + X.CAPTURE_IDENT + '\\s*([!\\|\\*^$~=]*)\\s*[\\\'"]*([-_a-z0-9\\s]*)[\\\'"]*\\]',
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

        ':': {
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
            //console.log(arguments);
            return getRegex(X.BEGIN_SPACE + val + X.END_SPACE).test(attr);
        },
        '|=': function(attr, val) { return getRegex(X.BEGIN + val + '[-]?', 'g').test(attr); }, // Match start with value followed by optional hyphen
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
            //console.log(simple);
            return !Y.Selector.simpleTest(node, simple);
        }
    },

    combinators: {
        ' ': function(node, tag) {
            return node.getElementsByTagName(tag);
        },

        '>': function() { // TODO: branch Y.Dom.getChildrenBy
            if (document.documentElement.children) {
                return function(node, tag) {
                    tag = tag || '*';
                    //clearFoundCache(); // TODO: why clear here?
                    return node.children.tags(tag);
                };
            } else {
                return function(node, tag) {
                    return Y.Dom.getChildrenBy(node, function(child) {
                        return (tag) ? child.tagName === tag : true;
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

    simpleTest: function test(node, selector) {
        var tag,
            simple,
            predicate,
            tokens = Y.Selector.tokens;
        
        var re = getRegex(X.SIMPLE);
        re.test(selector);

        simple = RegExp.$1;
        tag = RegExp.$2.toLowerCase() || '*';
        predicate = RegExp.$3;

        if (tag && tag != '*' && node.tagName.toLowerCase() != tag) {
            return false;
        } 

        if (!predicate) {
            return true;
        }
        var m;
        for (var token in tokens) {
            m = getRegex(tokens[token].pattern, 'g').exec(predicate);
            if (!m) {
                continue;
            }

            m[0] = node; // so we can pass args to test
            //while(m[0]) {
                if (!tokens[token].test.apply(null, m)) {
                    return false;
                }
            //}
        }
        return true;
    },

    test: function test(node, selector) {
        throw('Selector::test not implemented');
        var re = X.SELECTOR;
        var token = {};
        var tokens = Y.Selector.tokenize(selector);

        while(tokens.length) {
            token = tokens.pop();
            if (!Y.Selector.simpleTest(node, token.simple)) {
                return false;
            }
            if (token.previous && token.previous.combinator) {
                if (Y.Selector.combinators[token.combinator].test(node, node.parentNode)) {

                }
            }
        }
    },

    tokenize: function(selector) {
        var token,
            tokens = [];

        while ( selector.length && getRegex(X.SELECTOR).test(selector) ) {
            token = {
                previous: token,
                simple: RegExp.$1,
                tag: RegExp.$2.toLowerCase() || '*',
                predicate: RegExp.$3,
                combinator: RegExp.$4
            };

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
    },

    queryAll: function test(selector, root) {
        root = root || document;

        var node,
            candidates,
            result = [],
            todo = Y.Selector.tokenize(selector);

        var token = todo.shift();
        var nodes = root.getElementsByTagName(token.tag);

        result = filterByToken(nodes, token, root);

        return result;
    }
};

var filter = function (nodes, token, noCache) {
    var result = [],
        filtered = [],
        elements,
        tests = Y.Selector.tokens,
        getBy = Y.Selector.combinators,
        node,
        j;

    for (var i = 0, len = nodes.length; i < len; ++i) {
        node = nodes[i];
        if ( (node._found) || !Y.Selector.simpleTest(node, token.simple) ) {
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
        var elements = arguments.callee(root.getElementsByTagName(token.next.tagName), token.next, root, noCache);
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
    //YAHOO.log('getBySelector: clearing found cache of ' + foundCache.length + ' elements');
    for (var i = 0, len = foundCache.length; i < len; ++i) {
        delete foundCache[i]._found;
    }
    foundCache = [];
    //YAHOO.log('getBySelector: done clearing foundCache');
};

var getRegex = function(str, flags) {
    flags = flags || '';
    var re = regexCache[str];
    if (!re) {
        re = new RegExp(str);
        regexCache[str] = re;
    }
    //return (regexCache[str+flags] || (regexCache[str+flags] = new RegExp(str, flags)));
    //return new RegExp(str, flags);
    return re;
};

var trim = function(str) {
    return str.replace(getRegex(X.BEGIN + X.SP + X.OR + X.SP + X.END, 'g'), "");
};

Y.Selector = new Selector();
})();
