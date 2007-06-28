/*  DONE:
    - tag
    - id
    - class(es)
    - attribute(s) (css3) 
    - child

    TODO:
    - siblings (~, +)
    - pseudo classes (div:first-child, div:last-child, nth-child) 
*/
(function() {
var Y = YAHOO.util;
var patterns = {
    selector: /^((\*|[a-z0-9]+)?([\.#:\[]?[a-z]+[\w\-\[\]\.:\(\)#^~=$\|\*"\']*)?\s*([,>+~]?)?\s*).*$/i,
    tag: /(^[a-z]+[a-z0-9\*]*){1}/i,
    className: /\.[a-z]+[a-z0-9_\:\-]*/gi, // TODO: picks up attr (".com")
    id: /#([a-z]+[a-z0-9_\:\-]*){1}/i,
    attr: /\[([a-z]+\w*)+([~\|\^\$\*]?=)?"?([^\]"]*)"?\]/gi,
    pseudo: /[:]{1}[a-z0-9\-()]+/gi
};

var tokenMap = {
    SELECTOR:   1,
    TAGNAME:    2,
    ATTRIBUTES: 3,
    COMBINATOR: 4
};
var foundCache = [];

var regexCache = {}

var getRegex = {
    className: function(className) {
        re = regexCache[className];
        if (!re) {
            re = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
            regexCache[className] = re;
        }
        return re; 
    }
};

var regexTest = function(type, str) {
    var re = regexCache[str];
    if (!re) {
        re = getRegex[type](str);
        regexCache[type] = re;
    }
    return re.test(str);
};

var clearFoundCache = function() {
    YAHOO.log('getBySelector: clearing found cache of ' + foundCache.length + ' elements');
    for (var i = 0, len = foundCache.length; i < len; ++i) {
        delete foundCache[i].found;
        foundCache[i].removeAttribute('found');
    }
    foundCache = [];
    YAHOO.log('getBySelector: done clearing foundCache');
};

// TODO: replace switch with fn call
var attributeTests = {
  '=': function(attr, val) { return (attr === val); }, // Equality
  '~': function(attr, val) { return (attr.match(new RegExp('\\b'+val+'\\b'))); }, // Match one of space seperated words 
  '|': function(attr, val) { return (attr.match(new RegExp('^'+val+'-?'))); }, // Match start with value followed by optional hyphen
  '^': function(attr, val) { return (attr.indexOf(val) === 0); }, // Match starts with value
  '$': function(attr, val) { return (attr.lastIndexOf(val) === attr.length - val.length); }, // Match ends with value
  '*': function(attr, val) { return (attr.indexOf(val) > -1); }, // Match ends with value
  '': function(attr, val) { return attr; } // Just test for existence of attribute  // TODO: empty label is weak
};
    
var testAttributes = function(node, attributes) {
    var attr, 
        pass = false;
    for (var i = 0, len = attributes.length; i < len; ++i) {
        attrTokens = patterns.attr.exec(attributes[i]) || patterns.attr.exec(attributes[i]);
        attr = node.getAttribute(attrTokens[1], 2);
        val = attrTokens[3];
        if (attr === null) {
            return false;
        }

        pass = false;
        switch(attrTokens[2]) {
            case '=':
                if (attr === val) {
                    pass = true;
                }
                break;
            case '~=':
                if (attr.match(new RegExp('\\b'+val+'\\b'))) {
                    pass = true;
                }
                break;
            case '|=':
                if (attr.match(new RegExp('^'+val+'-{1}'))) {
                    pass = true;
                }
                break;
            case '^=':
                if (attr.indexOf(val) === 0) {
                    pass = true;
                }
                break;
            case '$=':
                if (attr.lastIndexOf(val) === attr.length - val.length) {
                    pass = true;
                }
                break;
            case '*=':
                if (attr.indexOf(val) > -1) {
                    pass = true;
                }
                break;
            default:
                pass = true; // just test for presence
        }
    }

    return pass;
};

var testNode = function(node, token) {
    if (token.id) {
        if (!node || node.id != token.id) {
            return false;
        } 
    }
    if (token.tagName && token.tagName != '*') {
        if (node.tagName.toLowerCase() != token.tagName) {
            return false;
        } 
    }
    if (token.classNames) {
        if (!hasClasses(node, token.classNames)) {
            return false;
        } 
    }
    return true;
};

var hasClasses = function(element, classes) {
    for (var i = 0, len = classes.length; i < len; ++i) {
        var className = classes[i].substr(1); // strip dot
        re = regexCache[className] = regexCache[className] || getRegex.className(className);
        if (!re.test(element.className)) {
            return false;
        } 
    }

    return true;
};

YAHOO.util.Selector = { 
    match: function(selector) {
        var token,
            parts = []
            doc = document,
            sel = selector;

        while( sel.length && (match = patterns.selector.exec(sel)) ) {
            token = {
                previous: token, 
                selector: match[tokenMap.SELECTOR] || [],
                tagName: match[tokenMap.TAGNAME] || '*',
                combinator: match[tokenMap.COMBINATOR] || ' ',
                pseudo: (match[tokenMap.ATTRIBUTES]) ? match[tokenMap.ATTRIBUTES].match(patterns.pseudo) : [],
                id: (patterns.id.exec(match[tokenMap.ATTRIBUTES]) || [])[1],
                classNames: (match[tokenMap.ATTRIBUTES]) ? match[tokenMap.ATTRIBUTES].match(patterns.className) : [],
                attributes: (match[tokenMap.ATTRIBUTES]) ? match[tokenMap.ATTRIBUTES].match(patterns.attr) : []
            };

            if (token.previous) { // for bi-directional access
                token.previous.next = token;
            }

            parts.push(token);
            sel = YAHOO.lang.trim(sel.substr(token.selector.length));
        }

        var found = [],
            index = 0,
            item,
            context = [doc];


        token = parts.shift();

        var classNames = token.classNames;
        var filteredNodes = doc.getElementsByTagName(token.tagName),
            nodes = [];

        while (token && filteredNodes.length) {
            nodes = [];
            if (token.id) {
                node = doc.getElementById(token.id); // TODO: test ancestry
                if (testNode(node, token)) {
                    if (token.next) {
                        switch(token.combinator) {
                            case '>':
                                nodes = Y.Dom.getChildrenBy(node);
                                break;
                            default:
                                var index = 0;
                                items = node.getElementsByTagName(token.next.tagName);
                                while (items.item(index)) {
                                    nodes.push(items.item(index));
                                    //foundCache.push(items.item(index));
                                    //items(item).found = true;
                                    index++;
                                }

                        }
                    } else {
                        nodes = [node];
                    }
                } 
            } else {
                for (var i = 0, len = filteredNodes.length; i < len; ++i) {
                    if (classNames && classNames.length) {
                        if (!hasClasses(filteredNodes[i], classNames)) {
                            continue;
                        }
                    }
                    if (token.attributes && token.attributes.length) {
                        if (!testAttributes(filteredNodes[i], token.attributes)) {
                            continue;
                        }
                    }

                    if (token.next) {
                        var items;
                        switch(token.combinator) {
                            case '>':
                                items = Y.Dom.getChildrenBy(filteredNodes[i]);
                                break;
                            default:
                                items = filteredNodes[i].getElementsByTagName(token.next.tagName);

                        }
                        var index = 0;
                        while (items.item(index)) {
                            nodes.push(items.item(index));
                            //foundCache.push(items.item(index));
                            //items(item).found = true;
                            index++;
                        }
                    } else {
                        if (!filteredNodes[i].found) {
                            nodes.push(filteredNodes[i]);
                            foundCache.push(filteredNodes[i]);
                            filteredNodes[i].found = true;
                        }
                   }
                }
            }
            //clearFoundCache();
            token = token.next;
            filteredNodes = nodes; 
        }
        clearFoundCache();
        YAHOO.log('getBySelector: returning ' + filteredNodes.length + ' elements matching "' + selector + '"', 'time');
        return filteredNodes;
    }
}
})();
