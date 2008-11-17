<h2 class="first">Setting up the Tooltip</h2>

<p>Tooltip can be configured to reuse a single Tooltip for multiple context elements with <code>title</code> attributes &mdash; by default, Tooltip will autopopulate its <code>text</code> configuration property with the contents of its context element's <code>title</code> attribute. Reuse of Tooltip instances is an advisable performance enhancement strategy, especially when you have a large number of context elements that need to invoke Tooltips.</p>

<p>However for certain use cases, you may want to set the text of the tooltip dynamically. You can use the context based events tooltip provides, in particular the <code>contextMouseOverEvent</code> and <code>contextTriggerEvent</code> to set the shared tooltip's text directly based on the context element the tooltip is about to be displayed for. The <code>contextMouseOverEvent</code> can also be used to stop the Tooltip from being displayed</p>

<p>In this tutorial, we will dynamically create two groups of 5 links (Group A and Group B). We'll attach one Tooltip instance to the links in Group A a second Tooltip instance to the links in Group B by setting the <code>context</code> property to the array of link ids for that group.</p> 

<p><strong>Group A:</strong> For Group A we'll set the title attribute on each of the links, to drive the tooltip's text:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
    // Obtain an array of the links in Group A 
    var groupAIds = createTitledLinks();

    // For links in group A which all have titles, this is all we need.
    // The tooltip text for each context element will be set from the title attribute
    var ttA = new YAHOO.widget.Tooltip("ttA", {
        context:groupAIds
    });
</textarea>

<p><strong>Group B:</strong> For Group B we won't set titles on the links, but instead use the <code>contextTriggerEvent</code> to set the tooltip's text directly. The context element is available as the first entry of the <code>args</code> array passed to the listener:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
    // Obtain an array of the links in Group B
    var groupBIds = createUntitledLinks();

    // For links in group B, we'll set the tooltip text dynamically,
    // right before the tooltip is triggered, using the id of the triggering context.
    var ttB = new YAHOO.widget.Tooltip("ttB", {
        context:groupBIds
    });

    // Set the text for the tooltip just before we display it.
    ttB.contextTriggerEvent.subscribe(
        function(type, args) {
            var context = args[0];
            this.cfg.setProperty("text", "Tooltip for " + context.id + ", set using contextTriggerEvent");
        }
    );
</textarea>

<p>We'll also use the <code>contextMouseOverEvent</code> to stop the 3rd link from showing a tooltip, by returning <code>false</code> from the handler. We could also set the <code>disabled</code> property for the Tooltip, but then we'd need to re-enable it for the other context elements.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
    // Stop the tooltip from being displayed for link B3.
    ttB.contextMouseOverEvent.subscribe(
        function(type, args) {
            var context = args[0];
            if (context && context.id == "B3") {
                return false;
            } else {
                return true;
            }
        }
    );
</textarea>
