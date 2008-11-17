<pre style="margin-bottom: 1em">
var chicken = new YAHOO.example.Chicken();
</pre>
<input type="button" name="demo_btn" id="demo_btn" value="Show Inheritance"/>
<div id="demo">
</div>
<script type="text/javascript">
    YAHOO.namespace('example');
    var Ye = YAHOO.example;

    Ye.Bird = function (name) {
        this.name = name;
    };
    Ye.Bird.prototype.flighted   = true;  // Default for all Birds
    Ye.Bird.prototype.isFlighted = function () { return this.flighted };
    Ye.Bird.prototype.getName    = function () { return this.name };

    Ye.Chicken = function (name) {
        // Chain the constructors
        this.constructor.superclass.constructor.call(this, name);
    };
    // Chickens are birds
    YAHOO.lang.extend(Ye.Chicken, Ye.Bird);
    
    // Define the Chicken prototype methods/members
    Ye.Chicken.prototype.flighted = false; // Override default for all Chickens

    Ye.showInheritance = function () {
        var chicken = new Ye.Chicken('Little'),
            results = YAHOO.util.Dom.get('demo');

        results.innerHTML = chicken instanceof Object ?
            "<p>chicken IS an instance of Object.</p>" :
            "<p>chicken IS NOT an instance of Object.</p>";

        results.innerHTML += chicken instanceof Ye.Bird ?
            "<p>chicken IS an instance of YAHOO.example.Bird.</p>" :
            "<p>chicken IS NOT an instance of YAHOO.example.Bird.</p>";

        results.innerHTML += chicken instanceof Ye.Chicken ?
            "<p>chicken IS an instance of YAHOO.example.Chicken.</p>" :
            "<p>chicken IS NOT an instance of YAHOO.example.Chicken.</p>";

        // Chicken instances inherit Bird methods and members
        results.innerHTML += chicken.isFlighted() ?
            "<p>chicken CAN fly.</p>" :
            "<p>chicken CAN NOT fly.</p>";

        results.innerHTML += "<p>chicken's name is " + chicken.getName() + ".</p>";
    }
    
    YAHOO.util.Event.on('demo_btn','click', Ye.showInheritance);
</script>
