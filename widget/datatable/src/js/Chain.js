YAHOO.util.Chain = function () {
    this.q = [].slice.call(arguments);
};

YAHOO.util.Chain.prototype = {
    id   : 0,

    run : function () {
        var c  = this.q[0];

        if (!c || this.id) {
            return this;
        }

        if (c.until) {
            if (c.until()) {
                this.q.shift();
                this.run();
                return this;
            }
        } else if (!c.iterations || !--c.iterations) {
            this.q.shift();
        }

        var fn = c.method || c;

        if (typeof fn === 'function') {
            var o    = c.scope || {},
                args = c.argument || [],
                ms   = c.timeout || 0,
                me   = this;
                
            if (!(args instanceof Array)) {
                args = [args];
            }

            this.id = setTimeout(function () {
                fn.apply(o,args);
                if (me.id) {
                    me.id = 0;
                    me.run();
                }
            },ms);
        }

        return this;
    },
    
    add  : function (f) {
        this.q.push(f);
        return this;
    },

    pause: function () {
        clearTimeout(this.id);
        this.id = 0;
        return this;
    },

    stop : function () { 
        this.pause();
        this.q = [];
        return this;
    }
};
