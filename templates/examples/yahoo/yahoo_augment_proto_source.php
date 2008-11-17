<input type="button" id="demo" name="demo" value="Send">

<p id="demo_p1"></p>
<p id="demo_p2"></p>

<script type="text/javascript">
    YAHOO.namespace('example');
    YAHOO.example.Foo = function () {
        /* code specific to Foo */
        this.createEvent('interestingMoment');
    }
    YAHOO.example.Foo.prototype.doSomething = function() {
        /* ..do something interesting... */

        this.fireEvent('interestingMoment');
    }

    YAHOO.lang.augmentProto(YAHOO.example.Foo, YAHOO.util.EventProvider);

    var f = new YAHOO.example.Foo();

    // Add some event listeners
    f.subscribe('interestingMoment', function () {
        var p = YAHOO.util.Dom.get('demo_p1');
        p.innerHTML = 'I was notified of an interesting moment';
    });
    f.subscribe('interestingMoment', function () {
        var p = YAHOO.util.Dom.get('demo_p2');
        p.innerHTML = 'I was also notified of an interesting moment';
    });

    YAHOO.util.Event.on('demo','click', function () { f.doSomething() });
</script>
