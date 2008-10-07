(function () {

var x      = document.createElement('p').style, // worker style collection
    u      = YAHOO.util,
    lang   = YAHOO.lang,
    sheets = {},
    ssId   = 0,
    floatAttr = ('cssFloat' in x) ? 'cssFloat' : 'styleFloat',
    _toCssText, toCssText;

_toCssText = function (css,base) {
    var f = css.styleFloat || css.cssFloat || css['float'];
    x.cssText = base || '';
    if (f && !css[floatAttr]) {
        css = lang.merge(css);
        delete css.styleFloat; delete css.cssFloat; delete css['float'];
        css[floatAttr] = f;
    }
    for (var prop in css) {
        if (css.hasOwnProperty(prop)) {
            x[prop] = css[prop];
        }
    }
    return x.cssText;
};

// Wrap IE's toCssText to catch opacity.  The copy/merge is to preserve the
// input object's integrity, but if float and opacity are set, the input will
// be copied twice in IE.  Is there a way to avoid this without increasing the
// byte count?
toCssText = ('opacity' in x) ? _toCssText :
    function (css, cssText) {
        if ('opacity' in css) {
            css = lang.merge(css,{
                    filter: 'alpha(opacity='+(css.opacity*100)+')'
                  });
            delete css.opacity;
        }
        return _toCssText(css,cssText);
    };

u.StyleSheet = function (node) {
    var head,
        sheet,
        name = node+'',
        cssRules = {},
        _rules,
        _insertRule,
        _deleteRule;

    // Factory or constructor
    if (!(this instanceof u.StyleSheet)) {
        return new u.StyleSheet(node);
    }

    head = document.getElementsByTagName('head')[0];
    if (!head) {
        // TODO: do something. Preferably something smart
        YAHOO.log('HEAD element not found to append STYLE node','error','YAHOO.util.StyleSheet');
        throw new Error('HEAD element not found to append STYLE node');
    }

    // Return cached sheet if possible
    if (node && sheets[node]) {
        return sheets[node];
    }

    // If an id or style node is provided, use that node
    // Use of link elements is still subject to same-domain restrictions
    node = node && u.Dom.get(node);

    // Return a cached sheet if possible
    if (node && /^(?:style|link)$/i.test(node.nodeName) &&
            node.yuiSSID && sheets[node.yuiSSID]) {
        return sheets[node.yuiSSID];
    }

    // Otherwise, create a style node and append to head
    if (!node || node.parentNode !== head || (!node.sheet && !node.styleSheet)) {
        // Generate the style node
        node = document.createElement('style');
        node.type = 'text/css';

        // styleSheet isn't available on the style node in FF2 until appended
        // to the head element.  style nodes appended to body do not affect
        // change in Safari.
        head.appendChild(node);
    }

    // IE stores StyleSheet under the "styleSheet" property
    sheet = node.sheet || node.styleSheet;

    // IE stores the rules collection under the "rules" property
    _rules = ('cssRules' in sheet) ? 'cssRules' : 'rules';

    // IE supports removeRule
    _deleteRule = ('deleteRule' in sheet) ?
        function (i) { sheet.deleteRule(i); } :
        function (i) { sheet.removeRule(i); };

    // IE supports addRule with different signature
    _insertRule = ('insertRule' in sheet) ?
        function (sel,css,i) { sheet.insertRule(sel+' '+css,i); } :
        function (sel,css,i) { sheet.addRule(sel,css,i); };

    // Initialize the cssRules map from the node
    // TODO if xdomain link node, copy to a local style block and replace the
    // link node with the style node.  CAVEAT: alternate stylesheet, @media
    var i,r,sel;
    for (i = sheet[_rules].length - 1; i >= 0; --i) {
        r   = sheet[_rules][i];
        sel = r.selectorText;

        if (cssRules[sel]) {
            cssRules[sel].style.cssText += ';' + r.style.cssText;
            _deleteRule(i);
        } else {
            cssRules[sel] = r;
        }
    }

    // Cache the sheet by the generated Id
    node.yuiSSID = 'yui-stylesheet-' + (ssId++);
    u.StyleSheet.register(node.yuiSSID,this);
    u.StyleSheet.register(name,this);

    // Public API
    YAHOO.lang.augmentObject(this,{
        getId : function () { return node.yuiSSID; },

        // Enabling/disabling the stylesheet.  Changes may be made to rules
        // while disabled.
        enable : function () { sheet.disabled = false; },

        disable : function () { sheet.disabled = true; },

        isEnabled : function () { return !sheet.disabled; },

        // Update cssText for a rule.  Add the rule if it's not present already
        // TODO: test for breakage in funny selectors ##i:go-..\\bo\om or valid
        // (i think) #i\:go\-\.\.\\\\bo\\om
        setCSS : function (sel,css) {
            var rule    = cssRules[sel],
                idx;

            // Opera throws an error if there's a syntax error in the cssText.
            // Should I do something about it, or let the error happen?
            if (rule) {
                rule.style.cssText = u.StyleSheet.toCssText(css,rule.style.cssText);
            } else {
                idx = sheet[_rules].length;
                _insertRule(sel,'{'+u.StyleSheet.toCssText(css)+'}',idx);

                // Safari replaces the rules collection, but maintains the rule
                // instances in the new collection when rules are added/removed
                cssRules[sel] = sheet[_rules][idx];
            }
        },

        // remove rule properties or an entire rule
        unsetCSS : function (sel,css) {
            var rule = cssRules[sel],
                rules, i, cssText;

            if (rule) {
                if (!css) { // remove the rule altogether
                    rules = sheet[_rules];
                    for (i = rules.length - 1; i >= 0; --i) {
                        if (rules[i] === rule) {
                            delete cssRules[sel];
                            _deleteRule(i);
                            break;
                        }
                    }
                    return;
                }

                if (!YAHOO.lang.isArray(css)) {
                    css = [css];
                }

                cssText = rule.style.cssText;
                for (i = css.length - 1; i >= 0; --i) {
                    // regex strip properties and any subproperties (e.g. 'font'
                    // also strips line-height, font-weight, font-family etc)
                    cssText = cssText.replace(
                        YAHOO.util.StyleSheet._propertyRE(css[i]),'');
                }

                rule.style.cssText = cssText;
            }
        }
    },true);

};

YAHOO.lang.augmentObject(u.StyleSheet, {
    // Regex collection for unsetting rule properties.  Initialized with the
    // properties that have child properties.  Added to from _propertyRE(prop).
    PROP_REGEX : {
        'border' : /border(?:-(?:(?:top|right|bottom|left)(?:-(?:color|style|width))?|(?:color|style|width)))?\s*:[^;]*(?:;|$)/gi,
        'font' : /(?:font(?:-(?:size|family|style|variant|weight))?|line-height)\s*:[^;]*(?:;|$)/gi
    },

    // Memoized regex generator to remove properties from cssText
    _propertyRE : function (prop) {
        return this.PROP_REGEX[prop] ||
              (this.PROP_REGEX[prop] = new RegExp(prop.replace(/([A-Z])/g,'-$1')+'(?:-[a-z\\-]+)?\\s*:[^;]*(?:;|$)','gi'));
    },

    toCssText : toCssText,

    register : function (name,sheet) {
        return !!(name && sheet instanceof u.StyleSheet &&
                  !sheets[name] && (sheets[name] = sheet));
    }
},true);

})();

/*

NOTES
 * Style node must be added to the head element.  Safari does not honor styles
   applied to StyleSheet objects on style nodes in the body.
 * StyleSheet object is created on the style node when the style node is added
   to the head element in Firefox 2 (and maybe 3?)
 * The cssRules collection is replaced after insertRule/deleteRule calls in
   Safari 3.1.  Existing Rules are used in the new collection, so the collection
   cannot be cached, but the rules can be.
 * Opera requires that the index be passed with insertRule.
 * Same-domain restrictions prevent modifying StyleSheet objects attached to
   link elements with remote href (or "about:blank" or "javascript:false")
 * IE names StyleSheet related properties and methods differently (see code)
 * IE converts tag names to upper case in the Rule's selectorText
 * IE converts empty string assignment to complex properties to value settings
   for all child properties.  E.g. style.background = '' sets non-'' values on
   style.backgroundPosition, style.backgroundColor, etc.  All else clear
   style.background and all child properties.
 * IE assignment style.filter = '' will result in style.cssText == 'FILTER:'
 * All browsers support Rule.style.cssText as a read/write property, leaving
   only opacity needing to be accounted for.
 * Benchmarks of style.property = value vs style.cssText += 'property: value'
   indicate cssText is slightly slower for single property assignment.  For
   multiple property assignment, cssText speed stays relatively the same where
   style.property speed decreases linearly by the number of properties set.
   Exception being Opera 9.27, where style.property is always faster than
   style.cssText.
 * Opera 9.5b throws a syntax error when assigning cssText with a syntax error.
 * Stylesheet properties set with !important will trump inline style set on an
   element or in el.style.property.
 * Setting complex properties in cssText will SOMETIMES allow child properties
   to be unset
   set         unset              FF2  FF3  S3.1  IE6  IE7  Op9.27  Op9.5
   ----------  -----------------  ---  ---  ----  ---  ---  ------  -----
   border      -top               NO   NO   YES   YES  YES  YES     YES
               -top-color         NO   NO   YES             YES     YES
               -color             NO   NO   NO              NO      NO
   background  -color             NO   NO   YES             YES     YES
               -position          NO   NO   YES             YES     YES
               -position-x        NO   NO   NO              NO      NO
   font        line-height        YES  YES  NO    NO   NO   NO      YES
               -style             YES  YES  NO              YES     YES
               -size              YES  YES  NO              YES     YES
               -size-adjust       ???  ???  n/a   n/a  n/a  ???     ???
   padding     -top               NO   NO   YES             YES     YES
   margin      -top               NO   NO   YES             YES     YES
   list-style  -type              YES  YES  YES             YES     YES
               -position          YES  YES  YES             YES     YES
   overflow    -x                 NO   NO   YES             n/a     YES

   ??? - unsetting font-size-adjust has the same effect as unsetting font-size
*/

