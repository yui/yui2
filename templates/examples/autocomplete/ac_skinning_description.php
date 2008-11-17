<h2 class="first">Sample Code</h2>

<p>DOM Overview:</p>

<textarea name="code" class="HTML" cols="60" rows="1">&lt;div id="autocomplete" class="yui-ac"&gt;
	&lt;input id="input" type="text" class="yui-ac-input"&gt;
	&lt;div id="container" class="yui-ac-container"&gt;
        &lt;div class="yui-ac-content"&gt;
            &lt;div class="yui-ac-hd"&gt;&lt;/div&gt;
            &lt;div class="yui-ac-bd"&gt;
                &lt;ul&gt;
                    &lt;li class="yui-ac-highlight"&gt;&lt;/li&gt;
                    &lt;li class="yui-ac-prehighlight"&gt;&lt;/li&gt;
                    &lt;li&gt;&lt;/li&gt;
                    ...
                &lt;/ul&gt;
            &lt;/div&gt;
            &lt;div class="yui-ac-ft"&gt;&lt;/div&gt;
        &lt;/div&gt;
        &lt;div class="yui-ac-shadow"&gt;&lt;/div&gt;
        &lt;iframe&gt;&lt;/iframe&gt;
    &lt;/div&gt;
&lt;/div&gt;
</textarea>


<p>AutoComplete CSS:</p>

<textarea name="code" class="CSS" cols="60" rows="1">
/* styles for entire widget */
.yui-skin-sam .yui-ac {
    position:relative;font-family:arial;font-size:100%;
}

/* styles for input field */
.yui-skin-sam .yui-ac-input {
    position:absolute;width:100%;
}

/* styles for results container */
.yui-skin-sam .yui-ac-container {
    position:absolute;top:1.6em;width:100%;
}

/* styles for header/body/footer wrapper within container */
.yui-skin-sam .yui-ac-content {
    position:absolute;width:100%;border:1px solid #808080;background:#fff;overflow:hidden;z-index:9050;
}

/* styles for container shadow */
.yui-skin-sam .yui-ac-shadow {
    position:absolute;margin:.3em;width:100%;background:#000;-moz-opacity: 0.10;opacity:.10;filter:alpha(opacity=10);z-index:9049;
}

/* styles for results list */
.yui-skin-sam .yui-ac-content ul{
    margin:0;padding:0;width:100%;
}

/* styles for result item */
.yui-skin-sam .yui-ac-content li {
    margin:0;padding:2px 5px;cursor:default;white-space:nowrap;
}

/* styles for prehighlighted result item */
.yui-skin-sam .yui-ac-content li.yui-ac-prehighlight {
    background:#B3D4FF;
}

/* styles for highlighted result item */
.yui-skin-sam .yui-ac-content li.yui-ac-highlight {
    background:#426FD9;color:#FFF;
}</textarea>

<p>Implementation CSS:</p>

<textarea name="code" class="CSS" cols="60" rows="1">/* styles for this implementation */
#autocomplete {
    width:15em; /* set width for widget here */
    padding-bottom:2em;
}
</textarea>
