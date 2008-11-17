<div id="ddRGB" class="dragPanel">
  <h4 id="pickerHandle">&nbsp;</h4>
  <div id="rBG" class="bg" tabindex="1" hidefocus="true">
    <div id="rthumb" class="thumb"><img src="<?php echo $assetsDirectory; ?>thumb-rgb.png" /></div> 
  </div> 

  <div id="gBG" class="bg" tabindex="2" hidefocus="true">
    <div id="gthumb" class="thumb"><img src="<?php echo $assetsDirectory; ?>thumb-rgb.png" /></div> 
  </div> 

  <div id="bBG" class="bg" tabindex="3" hidefocus="true">
    <div id="bthumb" class="thumb"><img src="<?php echo $assetsDirectory; ?>thumb-rgb.png" /></div> 
  </div> 

  <div id="valdiv">
    <form name="rgbform">
      <table border="0">
        <tr>
          <td>
          RGB
          </td>
          <td>
            <input autocomplete="off" tabindex="3" name="rval" id="rval" type="text" value="0" size="4" maxlength="4" />
            <input autocomplete="off" tabindex="4" name="gval" id="gval" type="text" value="0" size="4" maxlength="4" />
            <input autocomplete="off" tabindex="5" name="bval" id="bval" type="text" value="0" size="4" maxlength="4" />
          </td>
          <td>
            <input tabindex="6" id="rgbSubmit" type="button" value="Update"  />
          </td>
        </tr>
        <tr>
          <td>
            Hex: #
          </td>
          <td>
            <input autocomplete="off" tabindex="7" name="hexval" id="hexval" type="text" value="" size="6" maxlength="6" />
          </td>
          <td>
            <input tabindex="8" id="hexSubmit" type="button" value="Update" />
          </td>
        </tr>
        <tr>
          <td>
            <input tabindex="9" id="resetButton" type="button" value="Reset" />
          </td>
        </tr>
      </table>
    </form>
  </div>

    <div id="swatch">&nbsp;</div>
</div>

<!-- color.js extracted from the colorpicker widget -->
<script type="text/javascript" src="<?php echo $assetsDirectory; ?>color.js"></script>

<script type="text/javascript">

YAHOO.example.RGBSlider = function() {

    var Event = YAHOO.util.Event,
        Dom = YAHOO.util.Dom,
        Color = YAHOO.util.Color,
        Slider = YAHOO.widget.Slider,
        r, g, b, dd;

    function updateSliderColors() {

        var curr, curg, curb;

        curr = Math.min(r.getValue() * 2, 255);
        curg = Math.min(g.getValue() * 2, 255);
        curb = Math.min(b.getValue() * 2, 255);

        YAHOO.log("updateSliderColor " + curr + ", " + curg + ", " + curb);

        for (var i=0; i<34; i++) {
            Dom.setStyle("rBG" + i, "background-color", 
                "rgb(" + (i*8) + "," + curg + "," + curb + ")");

            Dom.setStyle("gBG" + i, "background-color", 
                "rgb(" + curr + "," + (i*8) + "," + curb + ")");

            Dom.setStyle("bBG" + i, "background-color", 
                "rgb(" + curr + "," + curg + "," + (i*8) + ")");
        }

        Dom.setStyle("swatch", "background-color", 
            "rgb(" + curr + "," + curg + "," + curb + ")");

        Dom.get("hexval").value = Color.rgb2hex(curr, curg, curb);
    }

    function isValidRGB(a) { 
        if ((!a[0] && a[0] !=0) || isNaN(a[0]) || a[0] < 0 || a[0] > 255) return false;
        if ((!a[1] && a[1] !=0) || isNaN(a[1]) || a[1] < 0 || a[1] > 255) return false;
        if ((!a[2] && a[2] !=0) || isNaN(a[2]) || a[2] < 0 || a[2] > 255) return false;

        return true;
    }


    function listenerUpdate(whichSlider, newVal) {
        newVal = Math.min(255, newVal);
        Dom.get(whichSlider + "val").value = newVal;
        updateSliderColors();
    }

    return {

        userReset: function() {
            var v;
            var f = document.forms['rgbform'];

            r.setValue(0);
            g.setValue(0);
            b.setValue(0);
        },

        rgbInit: function() {

            r = Slider.getHorizSlider("rBG", "rthumb", 0, 128);
            r.subscribe("change", function(newVal) { listenerUpdate("r", newVal*2); });

            g = Slider.getHorizSlider("gBG", "gthumb", 0, 128);
            g.subscribe("change", function(newVal) { listenerUpdate("g", newVal*2); });

            b = Slider.getHorizSlider("bBG", "bthumb", 0, 128);
            b.subscribe("change", function(newVal) { listenerUpdate("b", newVal*2); });

            this.initColor();

            dd = new YAHOO.util.DD("ddRGB");
            dd.setHandleElId("pickerHandle");
        },

        initColor: function() {
            var ch = " ";

            d = document.createElement("P");
            d.className = "rb";
            r.getEl().appendChild(d);
            d = document.createElement("P");
            d.className = "rb";
            g.getEl().appendChild(d);
            d = document.createElement("P");
            d.className = "rb";
            b.getEl().appendChild(d);

            for (var i=0; i<34; i++) {
                d = document.createElement("SPAN");
                d.id = "rBG" + i
                // d.innerHTML = ch;
                r.getEl().appendChild(d);

                d = document.createElement("SPAN");
                d.id = "gBG" + i
                // d.innerHTML = ch;
                g.getEl().appendChild(d);

                d = document.createElement("SPAN");
                d.id = "bBG" + i
                // d.innerHTML = ch;
                b.getEl().appendChild(d);
            }

            d = document.createElement("P");
            d.className = "lb";
            r.getEl().appendChild(d);
            d = document.createElement("P");
            d.className = "lb";
            g.getEl().appendChild(d);
            d = document.createElement("P");
            d.className = "lb";
            b.getEl().appendChild(d);

            this.userUpdate();
        },

        hexUpdate: function(e) {
            return this.userUpdate(e, true);
        },

        userUpdate: function(e, isHex) {
            var v;
            var f = document.forms['rgbform'];

            if (isHex) {
                var hexval = f["hexval"].value;
                // shorthand #369
                if (hexval.length == 3) {
                    var newval = "";
                    for (var i=0;i<3;i++) {
                        var a = hexval.substr(i, 1);
                        newval += a + a;
                    }

                    hexval = newval;
                }

                YAHOO.log("hexval:" + hexval);

                if (hexval.length != 6) {
                    alert("illegal hex code: " + hexval);
                } else {
                    var rgb = Color.hex2rgb(hexval);
                    // alert(rgb.toString());
                    if (isValidRGB(rgb)) {
                        f['rval'].value = rgb[0];
                        f['gval'].value = rgb[1];
                        f['bval'].value = rgb[2];
                    }
                }
            }

            // red
            v = parseFloat(f['rval'].value);
            v = ( isNaN(v) ) ? 0 : Math.round(v);
            YAHOO.log("setValue, r: " + v);
            r.setValue(Math.round(v) / 2);

            v = parseFloat(f['gval'].value);
            v = ( isNaN(v) ) ? 0 : Math.round(v);
            YAHOO.log("setValue, g: " + g);
            g.setValue(Math.round(v) / 2);

            v = parseFloat(f['bval'].value);
            v = ( isNaN(v) ) ? 0 : Math.round(v);
            YAHOO.log("setValue, b: " + b);
            b.setValue(Math.round(v) / 2);

            updateSliderColors();

            if (e) {
                Event.stopEvent(e);
            }
        },

        init: function() {
            this.rgbInit();
            Event.on("rgbForm", "submit", this.userUpdate);
            Event.on("rgbSubmit", "click", this.userUpdate);
            Event.on("hexSubmit", "click", this.hexUpdate, this, true);
            Event.on("resetButton", "click", this.userReset);
        }
    };
}();

YAHOO.util.Event.onDOMReady(YAHOO.example.RGBSlider.init, 
                            YAHOO.example.RGBSlider, true);

</script>
