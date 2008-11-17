<p>
    This example uses the <a href="http://developer.yahoo.com/yui/carousel/">YUI Carousel Control</a> to showcase a simple spotlight
    example using its <code>itemSelected</code> event.  In this example, you can use arrow
    keys to select items as well as click on an item to select it.
</p>
<p>
    Though this functionality looks a little complicated, it is very easy to
    implement.  This is because the YUI Carousel Control handles the keyboard
    event and the mouse click event for setting the selection.  When an item is
    selected, the YUI Carousel Control triggers an <code>itemSelected</code> event.  This
    example subscribes to the <code>itemSelected</code> event to display the selected
    image in the spotlight.
</p>
