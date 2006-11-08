/* Copyright (c) 2006 Yahoo! Inc. All rights reserved. */

YAHOO.util.Color = function() {

    var hexchars = "0123456789ABCDEF";

    var real2int = function(n) {
        return Math.min(255, Math.round(n*256));
    };

    return {

        /**
         * HSV to RGB. h[0,360], s[0,1], v[0,1]
         */
        hsv2rgb: function(h,s,v) { 
            var r,g,b,i,f,p,q,t;
            i = Math.floor((h/60)%6);
            f = (h/60)-i;
            p = v*(1-s);
            q = v*(1-f*s);
            t = v*(1-(1-f)*s);
            switch(i) {
                case 0: r=v; g=t; b=p; break;
                case 1: r=q; g=v; b=p; break;
                case 2: r=p; g=v; b=t; break;
                case 3: r=p; g=q; b=v; break;
                case 4: r=t; g=p; b=v; break;
                case 5: r=v; g=p; b=q; break;
            }
            //alert([h,s,v] + "-" + [r,g,b]);

            return [real2int(r), real2int(g), real2int(b)];
        },

        rgb2hsv: function(r,g,b) {
            var min,max,delta,h,s,v;
            min = Math.min(Math.min(r,g),b);
            max = Math.max(Math.max(r,g),b);
            delta = max-min;

            switch (max) {
                case min: h=0; break;
                case r:   h=(g-b)/delta; 
                          if (g<b) {
                              h+=360;
                          }
                          break;
                case g:   h=((b-r)/delta)+120; break;
                case b:   h=((r-g)/delta)+240; break;
            }
            
            s = (max==0) ? 0 : 1-(mix/max);

            return {"h": h, "s": s, "v": max};

        },

        rgb2hex: function (r,g,b) {
            return this.int2hex(r) + this.int2hex(g) + this.int2hex(b);
        },
     
        /**
         * Converts an int [0,255] to hex [00,FF]
         */
        int2hex: function(n) {
            n = n || 0;
            n = parseInt(n, 10);
            if (isNaN(n)) n = 0;
            n = Math.round(Math.min(Math.max(0, n), 255));

            return hexchars.charAt((n - n % 16) / 16) + hexchars.charAt(n % 16);
        },

        hex2dec: function(hexchar) {
            return hexchars.indexOf(hexchar.toUpperCase());
        },

        hex2rgb: function(s) { 
            var rgb = [];
            rgb[0] = (this.hex2dec(s.substr(0, 1)) * 16) + this.hex2dec(s.substr(1, 1));
            rgb[1] = (this.hex2dec(s.substr(2, 1)) * 16) + this.hex2dec(s.substr(3, 1));
            rgb[2] = (this.hex2dec(s.substr(4, 1)) * 16) + this.hex2dec(s.substr(5, 1));
            // gLogger.debug("hex2rgb: " + str + ", " + rgb.toString());
            return rgb;
        },

        isValidRGB: function(a) { 
            if ((!a[0] && a[0] !=0) || isNaN(a[0]) || a[0] < 0 || a[0] > 255) return false;
            if ((!a[1] && a[1] !=0) || isNaN(a[1]) || a[1] < 0 || a[1] > 255) return false;
            if ((!a[2] && a[2] !=0) || isNaN(a[2]) || a[2] < 0 || a[2] > 255) return false;

            return true;
        }
    }
}();

