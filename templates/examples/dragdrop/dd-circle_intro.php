<p>This example demonstrates how to implement a custom click validator to
make a circular drag and drop implementation.  Because all DOM elements that
have dimensions are rectangular, the way to implement a circular drag object
is to perform calculations on mousedown to determine whether the mouse was 
targeting a valid portion of the element (eg, a portion within the circle).</p>

<p>The same method could be used to create any non-rectangular draggable object.</p>