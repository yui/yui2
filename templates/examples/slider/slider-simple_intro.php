<p>This example demonstrates a simple vertical implementation of the <a href="http://developer.yahoo.com/yui/slider/">YUI Slider Control</a>.  Some characteristics of this implementation include the following:</p>
<ul>
<li>The slider range is 200 pixels.</li>
<li>Custom logic is applied to convert the current pixel value
(from 0 to 200) to a "real" value.  In this case the "real"
range is 0 to 300.</li>
<li>The value is set to 30 after the control is initialized</li>
<li>Once the slider has focus, the up and down keys will move
the thumb 20 pixels (changing the "real" value by 30).</li>
<li>When the slider value changes, the UI is updated.  The title
attribute of the slider background is updated with the current
value, and the text field is updated with the current "real"
value.  These techniques can help inform assistive technologies
(like screen reader software) about the slider's current state.</li>
</ul>
