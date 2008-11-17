/*
Copyright (c) 2008, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.6.0
*/
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
*/

(function () {

YAHOO.util.StyleSheet = function (node) {
    var head,
        sheet,
        cssRules = {},
        _rules,
        _insertRule,
        _deleteRule;

    head = document.getElementsByTagName('head')[0];
    if (!head) {
        // TODO: do something. Preferably something smart
        YAHOO.log('HEAD element not found to append STYLE node','error','YAHOO.util.StyleSheet');
        throw new Error('HEAD element not found to append STYLE node');
    }

    // If an id or style node is provided, use that node
    // Us of link elements is still subject to same-domain restrictions
    node = node && YAHOO.util.Dom.get(node);

    // Otherwise, create a style node and append to head
    if (!node || node.parentNode !== head && (!node.sheet && !node.styleSheet)) {
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
        function (sel,cssText,i) { sheet.insertRule(sel+' '+cssText,i); } :
        function (sel,cssText,i) { sheet.addRule(sel,cssText,i); };

    // Initialize the cssRules map from the node
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

    YAHOO.lang.augmentObject(this,{
        // Enabling/disabling the stylesheet.  Changes may be made to rules
        // while disabled.
        enable : function () { sheet.disabled = false; },

        disable : function () { sheet.disabled = true; },

        isEnabled : function () { return !sheet.disabled; },

        // Normalize opacity assignment and clearing
        setOpacity : (('opacity' in node.style) ?
            function (sel,op) { this.setCSS(sel,'opacity:'+op); } :
            function (sel,op) {
                this.setCSS(sel,'filter: alpha(opacity='+(op*100)+')');
            }),

        unsetOpacity : (('opacity' in node.style) ?
            function (sel) { this.unsetCSS(sel,'opacity'); } :
            function (sel) { this.unsetCSS(sel,'filter'); }),

        // Update cssText for a rule.  Add the rule if it's not present already
        setCSS : function (sel,cssText) {
            var rule = cssRules[sel];


            // Opera throws an error if there's a syntax error in the cssText.
            // Should I do something about it, or let the error happen?
            if (rule) {
                rule.style.cssText += ';'+cssText;
            } else {
                var idx = sheet[_rules].length;
                _insertRule(sel,'{'+cssText+'}',idx);

                // Safari replaces the rules collection, but maintains the rule
                // instances in the new collection when rules are added/removed
                cssRules[sel] = sheet[_rules][idx];
            }
        },

        // remove rule properties or an entire rule
        unsetCSS : function (sel,props) {
            var rule = cssRules[sel],
                rules, i, tmpCssText;

            if (rule) {
                if (!props) { // remove the rule altogether
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

                if (!YAHOO.lang.isArray(props)) {
                    props = [props];
                }

                tmpCssText = rule.style.cssText;
                for (i = props.length - 1; i >= 0; --i) {
                    // regex strip properties and any subproperties (e.g. 'font'
                    // also strips line-height, font-weight, font-family etc)
                    tmpCssText = tmpCssText.replace(
                        YAHOO.util.StyleSheet._propertyRE(props[i]),'');
                }

                rule.style.cssText = tmpCssText;
            }
        }
    },true);

};

// Regex collection for unsetting rule properties.  Initialized with the
// properties that have child properties.  Added to from _propertyRE(prop).
YAHOO.util.StyleSheet.PROP_REGEX = {
    'border' : /border(?:-(?:(?:top|right|bottom|left)(?:-(?:color|style|width))?|(?:color|style|width)))?\s*:[^;]*(?:;|$)/gi,
    'font' : /(?:font(?:-(?:size|family|style|variant|weight))?|line-height)\s*:[^;]*(?:;|$)/gi
};

// Memoized regex generator to remove properties from cssText
YAHOO.util.StyleSheet._propertyRE = function (prop) {
    return this.PROP_REGEX[prop] ||
          (this.PROP_REGEX[prop] = new RegExp(prop+'(?:-[a-z\\-]+)?\\s*:[^;]*(?:;|$)','gi'));
};

})();
YAHOO.register("stylesheet", YAHOO.util.Stylesheet, {version: "2.6.0", build: "1321"});
