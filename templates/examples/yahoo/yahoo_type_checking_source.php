<table id="demo">
    <thead>
        <tr>
            <th>Data</th>
            <th>isObject</th>
            <th>isArray</th>
            <th>isFunction</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>null<code></td>
            <td colspan="3"><input type="button" name="demo-1" id="demo-1" value="check"/></td>
        </tr>
        <tr>
            <td><code>[] or new Array()</code></td>
            <td colspan="3"><input type="button" name="demo-2" id="demo-2" value="check"/></td>
        </tr>
        <tr>
            <td><code>{} or new Object()</code></td>
            <td colspan="3"><input type="button" name="demo-3" id="demo-3" value="check"/></td>
        </tr>
        <tr>
            <td><code>function Foo() {}</code></td>
            <td colspan="3"><input type="button" name="demo-4" id="demo-4" value="check"/></td>
        </tr>
        <tr>
            <td><code>new Foo()</code></td>
            <td colspan="3"><input type="button" name="demo-5" id="demo-5" value="check"/></td>
        </tr>
        <tr>
            <td><code>elem.getElementsByTagName('p')</code></td>
            <td colspan="3"><input type="button" name="demo-6" id="demo-6" value="check"/></td>
        </tr>
        <tr>
            <td><code>YAHOO.util.Dom.
                        getElementsByClassName(<br/>
                        'foo','p',elem)</code></td>
            <td colspan="3"><input type="button" name="demo-7" id="demo-7" value="check"/></td>
        </tr>
    <tbody>
</table>
<script type="text/javascript">
    YAHOO.namespace('example');

    YAHOO.example.checkType = function (val) {
        return {
            'object'  : YAHOO.lang.isObject(val),
            'array'   : YAHOO.lang.isArray(val),
            'function': YAHOO.lang.isFunction(val)
        };
    }

    YAHOO.example.populateRow = function (e, data) {
        var cell = this.parentNode,
            row  = cell.parentNode;

        row.removeChild(cell);

        var td0 = document.createElement('td'),
            td1 = td0.cloneNode(false),
            td2 = td0.cloneNode(false);

        var results = YAHOO.example.checkType(data);

        td0.appendChild(document.createTextNode(
            results['object'] ?   'Y' : 'N'));
        td1.appendChild(document.createTextNode(
            results['array'] ?    'Y' : 'N'));
        td2.appendChild(document.createTextNode(
            results['function'] ? 'Y' : 'N'));

        row.appendChild(td0);
        row.appendChild(td1);
        row.appendChild(td2);
    }

    var foo = function () {};
    var f = document.getElementById('demo');

    YAHOO.util.Event.on('demo-1','click',YAHOO.example.populateRow, null);
    YAHOO.util.Event.on('demo-2','click',YAHOO.example.populateRow, []);
    YAHOO.util.Event.on('demo-3','click',YAHOO.example.populateRow, {});
    YAHOO.util.Event.on('demo-4','click',YAHOO.example.populateRow, foo);
    YAHOO.util.Event.on('demo-5','click',YAHOO.example.populateRow, new foo());
    YAHOO.util.Event.on('demo-6','click',YAHOO.example.populateRow,
        f.getElementsByTagName('tr'));
    YAHOO.util.Event.on('demo-7','click',YAHOO.example.populateRow,
        YAHOO.util.Dom.getElementsByClassName('foo','td',f));
</script>
