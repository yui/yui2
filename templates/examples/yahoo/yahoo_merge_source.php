<div id="demo">
    <pre>set1 = { foo : "foo" };</pre>
    <pre>set2 = { foo : "BAR", bar : "bar"  };</pre>
    <pre>set3 = { foo : "FOO", baz : "BAZ" };</pre>

    <input type="button" name="demo_btn" id="demo_btn" value="Merge"/>
    <h3>result</h3>
    <pre id="demo_result">click Merge</pre>
    <script type="text/javascript">
        YAHOO.namespace('example');

        YAHOO.example.set1 = { foo : "foo" };
        YAHOO.example.set2 = { foo : "BAR", bar : "bar" };
        YAHOO.example.set3 = { foo : "FOO", baz : "BAZ" };

        YAHOO.example.doMerge = function () {
            var Ye = YAHOO.example;

            YAHOO.log('set1 = ' + YAHOO.lang.dump(Ye.set1));
            YAHOO.log('set2 = ' + YAHOO.lang.dump(Ye.set2));
            YAHOO.log('set3 = ' + YAHOO.lang.dump(Ye.set3));

            YAHOO.log('Merging set1, set2, and set3');
            var merged = YAHOO.lang.merge(Ye.set1, Ye.set2, Ye.set3);
            YAHOO.log('merged = ' + YAHOO.lang.dump(merged));

            var result = YAHOO.util.Dom.get('demo_result');
            result.innerHTML = YAHOO.example.stringifyObj(merged);
        };

        YAHOO.util.Event.on('demo_btn','click',YAHOO.example.doMerge);

        YAHOO.example.stringifyObj = function (obj) {
            var bits = ['{ '];
            for (var k in obj) {
                bits = bits.concat([k, ' : "', obj[k], '", ']);
            }
            bits[bits.length - 1] = '" }';

            return bits.join('');
        };
    </script>
</div>
