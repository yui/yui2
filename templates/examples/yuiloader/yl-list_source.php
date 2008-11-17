

<div>
<fieldset id="filterContainer">
    <legend>Filter</legend>
</fieldset>

<fieldset id="optionsContainer">
    <legend>Options</legend>
    <span id="loadOptionalContainer"></span>
    <span id="allowRollupContainer"></span>
    <span id="baseContainer">base: 
        <input id="baseInput" type="text" name="baseInput"></input>
    </span>

</fieldset>
</div>


<div id="buttonContainer"></div>


<textarea id="loaderOutput" name="loaderOutput" class="HTML" cols="60" rows="1"></textarea>

<script type="text/javascript">

(function() {

    var Y = YAHOO, D = Y.util.Dom, E = Y.util.Event, Button = Y.widget.Button, buttons = [],
        allModules, loadOptionalButton, filterGroup, allowRollupButton;

    function keys(o) {
        var a=[], i;
        for (i in o) {
            if (Y.lang.hasOwnProperty(o, i)) {
                a.push(i);
            }
        }

        return a;
    };

    function createButton(label) {
        var b = new Button({
            id: label,
            type: "checkbox",
            name: label,
            label: label,
            value: label,
            container: "buttonContainer" 
        });

        //b.addClass('yui-loader-button');

        b.on("click", showDependencies);

        buttons[label] = b;
    }

    function showDependencies() {

        var reqs = [], base, filter;

        var o = D.get('baseInput');

        base = o && o.value;
        if (base) {
            base = Y.lang.trim(base);
        }
        loadOptional = loadOptionalButton.get('checked');
        allowRollup = allowRollupButton.get('checked');
        filter = filterGroup.get('value');

        for (var i in buttons) {
            if (Y.lang.hasOwnProperty(buttons, i)) {
                if (buttons[i].get('checked')) {
                    reqs.push(i);
                }
            }
        }

        var loader = new Y.util.YUILoader({
            require: reqs,
            filter: filter,
            loadOptional: loadOptional,
            allowRollup: allowRollup,
            force: allModules
        });

        if (base) {
            loader.base = base;
        }

        loader.calculate();

        var s = loader.sorted, l = s.length, m, url, out = [];

        if (l) {

            for (i=0; i<l; i=i+1)  {
                m = loader.moduleInfo[s[i]];
                if (m.type == 'css') {
                    url = m.fullpath || loader._url(m.path);
                    out.push('<link rel="stylesheet" type="text/css" href="' + url + '">');
                }
            }

            if (out.length) {
                if (out.length < l) {
                    out.push('<!-- js -->')
                }
                out.unshift('<!-- css -->')
            } else {
                out.push('<!-- js -->')
            }

            for (i=0; i<l; i=i+1)  {
                m = loader.moduleInfo[s[i]];
                if (m.type == 'js') {
                    url = m.fullpath || loader._url(m.path);
                    out.push('<script type="text/javascript" src="' + url + '"></scr' + 'ipt>');
                }
            }
        }
        
        // This syntax highlighter just keeps making new elements if you need
        // to refresh the content.  Remove existing to unbreak this.
        var oldout = D.getElementsByClassName('dp-highlighter', 'div', 'example-canvas');
        if (oldout && oldout.length > 0) {
            var el = oldout[0];
            el.parentNode.removeChild(el);
        }

        // Show syntax highlighted output
        D.get('loaderOutput').value = out.join('\n');
        dp.SyntaxHighlighter.HighlightAll('loaderOutput'); 

    }

    function init() {

        filterGroup = new Y.widget.ButtonGroup({ 
               id:  "filter", 
               name:  "filter", 
               container:  "filterContainer" 
        });

        filterGroup.addButtons([
            { label: "-min", value: "", checked: true },
            { label: "-debug", value: "DEBUG" }, 
            { label: "raw", value: "RAW" }
        ]);

        filterGroup.on("valueChange", showDependencies);


        loadOptionalButton = new Button({
            id: "loadOptional",
            type: "checkbox",
            name: "loadOptional",
            label: "Load Optional",
            value: "true",
            container: "loadOptionalContainer" 
        });

        loadOptionalButton.on("click", showDependencies);

        allowRollupButton = new Button({
            id: "allRollup",
            type: "checkbox",
            name: "allowRollup",
            label: "Allow Rollup",
            value: "true",
            checked: true,
            container: "allowRollupContainer" 
        });

        allowRollupButton.on("click", showDependencies);

        var loader = new Y.util.YUILoader();

        allModules = keys(loader.moduleInfo);
        allModules.sort();

        for (var i=0; i<allModules.length; i=i+1) {
            createButton(allModules[i]);
        }

        showDependencies();
    }

    // E.onAvailable("buttonContainer", init);
    E.on(window, 'load', init);
})();

</script>
