<p>This example uses the <a href="http://developer.yahoo.com/yui/slider/">YUI Slider Control</a> to implement a basic horizontal slider with tick marks &amp; that is, with predefined intervals at which the slider thumb will stop as it's dragged.  (By default, a slider thumb can be dragged one pixel at a time.)</p>

<p>Here are some important characteristics of this implementation:</p>

<ul>
<li>The slider range is 200 pixels.</li>
<li>The slider movement is restricted to 20 pixel increments.</li>
<li>Custom logic is applied to convert the current pixel value
(from 0 to 200) to a "real" value.  In this case the "real"
range is 0 to 300.</li>
<li>Once the slider has focus, the left and right keys will move
the thumb 20 pixels (changing the "real" value by 30).</li>
<li>When the slider value changes, the UI is updated.  The title
attribute of the slider background is updated with the current
value, and the text field is updated with the current "real"
value.  These techniques can help inform assistive technologies
(like screen reader software) about the slider's current state.</li>
</ul>
