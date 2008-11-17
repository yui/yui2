<p>This example demonstrates a vertical implementation of the <a href="http://developer.yahoo.com/yui/slider/">YUI Slider Control</a>.  Some characteristics of this implementation include the following:</p>
<ul>
    <li>The slider range is 200 pixels.</li>
    <li>CSS is used to place the slide thumb at the bottom of the slider.</li>
    <li>Custom logic is added to the slider instance to convert the offset value to a "real" value calculated from a provided min/max range.</li>
    <li>The custom min value is set to 10; the max 110.</li>
    <li>Once the slider has focus, the up and down keys will move
the thumb 20 pixels (changing the "real" value by 10).</li>
    <li>When the slider value changes, the pixel offset and calculated value are reported below the slider.</li>
</ul>
