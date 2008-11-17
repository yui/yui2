<div id="demo">
    <h2 class="first">The Monster</h2>
    <p>By Stephen Crane</p>

    <div id="paging"></div>

    <div id="content" class="page1">
        <div class="page1">
            <p>Little Jim was, for the time, engine Number 36, and he was making the run between Syracuse and Rochester. He was fourteen minutes behind time, and the throttle was wide open. In consequence, when he swung around the curve at the flower-bed, a wheel of his cart destroyed a peony. Number 36 slowed down at once and looked guiltily at his father, who was mowing the lawn. The doctor had his back to this accident, and he continued to pace slowly to and fro, pushing the mower.</p>     
            <p>Jim dropped the tongue of the cart. He looked at his father and at the broken flower. Finally he went to the peony and tried to stand it on its pins, resuscitated, but the spine of it was hurt, and it would only hang limply from his hand. Jim could do no reparation. He looked again toward his father.</p>     
        </div>
        <div class="page2">
            <p>He went on to the lawn, very slowly, and kicking wretchedly at the turf. Presently his father came along with the whirring machine, while the sweet, new grass blades spun from the knives. In a low voice, Jim said, “Pa!”</p>     
            <p>The doctor was shaving this lawn as if it were a priest’s chin. All during the season he had worked at it in the coolness and peace of the evenings after supper. Even in the shadow of the cherry-trees the grass was strong and healthy. Jim raised his voice a trifle. “Pa!”</p>     
            <p>The doctor paused, and with the howl of the machine no longer occupying the sense, one could hear the robins in the cherry-trees arranging their affairs. Jim’s hands were behind his back, and sometimes his fingers clasped and unclasped. Again he said, “Pa!” The child’s fresh and rosy lip was lowered.</p>     
        </div>
        <div class="page3">
            <p>The doctor stared down at his son, thrusting his head forward and frowning attentively. “What is it, Jimmie?”</p>     
            <p>“Pa!” repeated the child at length. Then he raised his finger and pointed at the flower-bed. “There!”</p>     
            <p>“What?” said the doctor, frowning more. “What is it, Jim?”</p>     
            <p>After a period of silence, during which the child may have undergone a severe mental tumult, he raised his finger and repeated his former word—“There!” The father had respected this silence with perfect courtesy. Afterward his glance carefully followed the direction indicated by the child’s finger, but he could see nothing which explained to him. “I don’t understand what you mean, Jimmie,” he said.</p>     
        </div>
        <div class="page4">
            <p>It seemed that the importance of the whole thing had taken away the boy’s vocabulary. He could only reiterate, “There!”</p>     
            <p>The doctor mused upon the situation, but he could make nothing of it. At last he said, “Come, show me.”</p>     
            <p>Together they crossed the lawn toward the flower-bed. At some yards from the broken peony Jimmie began to lag. “There!” The word came almost breathlessly.</p>     
            <p>“Where?” said the doctor.</p>     
            <p>Jimmie kicked at the grass. “There!” he replied.</p>     
        </div>
        <div class="page5">
            <p>The doctor was obliged to go forward alone. After some trouble he found the subject of the incident, the broken flower. Turning then, he saw the child lurking at the rear and scanning his countenance.</p>     
            <p>The father reflected. After a time he said, “Jimmie, come here.” With an infinite modesty of demeanour the child came forward. “Jimmie, how did this happen?”</p>     
            <p>The child answered, “Now&#8212;I was playin’ train&#8212;and&#8212;now&#8212;I runned over it.”</p>
        </div>
    </div>
</div>
<script type="text/javascript">
YAHOO.util.Event.onDOMReady(function () {

// Set up the application under the YAHOO.example namespace
var Ex = YAHOO.namespace('example');

Ex.content    = YAHOO.util.Dom.get('content');

Ex.handlePagination = function (state) {
    // Show the appropriate content for the requested page
    Ex.content.className = 'page' + state.page;
    
    // Update the Paginator's state, confirming change
    Ex.paginator.setState(state);
};

// Create the Paginator widget and subscribe to its changeRequest event
Ex.paginator = new YAHOO.widget.Paginator({
    rowsPerPage : 1,
    totalRecords : Ex.content.getElementsByTagName('div').length,
    containers : 'paging'
});

Ex.paginator.subscribe('changeRequest', Ex.handlePagination);

// Render the Paginator into the configured container(s)
Ex.paginator.render();

});
</script>
