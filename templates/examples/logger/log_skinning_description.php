<h2 class="first">Sample Code</h2>

<p>DOM Overview:</p>

<textarea name="code" class="HTML" cols="60" rows="1">&lt;div class="yui-log yui-log-container"&gt;
    &lt;div class="yui-log-hd"&gt;
        &lt;div class="yui-log-btns"&gt;
            &lt;input type="button" class="yui-log-button" value="Collapse"&gt;
        &lt;/div&gt;
        &lt;h4&gt;Logger Console&lt;/h4&gt;
    &lt;/div&gt;
    &lt;div class="yui-log-bd"&gt;
        &lt;pre class="yui-log-verbose"&gt;
            &lt;p&gt;&lt;span class="[category]"&gt;CATEGORY&lt;/span&gt; Message.&lt;/p&gt;
        &lt;/pre&gt;
        ...
    &lt;/div&gt;
    &lt;div class="yui-log-ft"&gt;
        &lt;div class="yui-log-btns"&gt;
            &lt;input type="button" class="yui-log-button" value="Pause"&gt;
            &lt;input type="button" class="yui-log-button" value="Clear"&gt;
        &lt;/div&gt;
        &lt;div class="yui-log-categoryfilters"&gt;
            &lt;span class="yui-log-filtergrp"&gt;
                &lt;input type="checkbox" class="yui-log-filter-[category]"&gt;
                &lt;label class="[category]"&gt;category&lt;/label&gt;
            &lt;/span&gt;
            ...
        &lt;/div&gt;
        &lt;div class="yui-log-sourcefilters"&gt;
            &lt;span class="yui-log-filtergrp"&gt;
                &lt;input type="checkbox" class="yui-log-filter[source]"&gt;
                &lt;label class="[source]"&gt;source&lt;/label&gt;
            &lt;/span&gt;
            ...
        &lt;/div&gt;
    &lt;/div&gt;
&lt;/div>
</textarea>


<p>Core CSS:</p>

<textarea name="code" class="CSS" cols="60" rows="1">/* none */</textarea>

<p>Skin CSS:</p>

<textarea name="code" class="CSS" cols="60" rows="1">/* logger default styles */
/* default width: 31em */
/* default font-size 77% */
.yui-skin-sam .yui-log { padding:1em;width:31em;background-color:#AAA;color:#000;border:1px solid black;font-family:monospace;font-size:77%;text-align:left;z-index:9000; }

/* for containers built from scratch */
.yui-skin-sam .yui-log-container { position:absolute;top:1em;right:1em; }

/* buttons */
.yui-skin-sam .yui-log input {
    margin:0;padding:0;
    font-family:arial;
    font-size:100%;
    font-weight:normal;
}
.yui-skin-sam .yui-log .yui-log-btns { position:relative;float:right;bottom:.25em; }

/* header */
.yui-skin-sam .yui-log .yui-log-hd { margin-top:1em;padding:.5em;background-color:#575757; }
.yui-skin-sam .yui-log .yui-log-hd h4 { margin:0;padding:0;font-size:108%;font-weight:bold;color:#FFF; }

/* body */

.yui-skin-sam .yui-log .yui-log-bd { width:100%;height:20em;background-color:#FFF;border:1px solid gray;overflow:auto; } /* height is controlled here: default 20em*/
.yui-skin-sam .yui-log p { margin:1px;padding:.1em; }
.yui-skin-sam .yui-log pre { margin:0;padding:0; }

/* for pre to respect newlines yet wrap long lines */
/* http://www.longren.org/2006/09/27/wrapping-text-inside-pre-tags/ */
.yui-skin-sam .yui-log pre.yui-log-verbose {
    white-space: pre-wrap; /* css-3 */
    white-space: -moz-pre-wrap !important; /* Mozilla, since 1999 */
    white-space: -pre-wrap; /* Opera 4-6 */
    white-space: -o-pre-wrap; /* Opera 7 */
    word-wrap: break-word; /* Internet Explorer 5.5+ */
}

/* footer */
.yui-skin-sam .yui-log .yui-log-ft { margin-top:.5em; }
.yui-skin-sam .yui-log .yui-log-ft .yui-log-categoryfilters { }
.yui-skin-sam .yui-log .yui-log-ft .yui-log-sourcefilters { width:100%;border-top:1px solid #575757;margin-top:.75em;padding-top:.75em; }
.yui-skin-sam .yui-log .yui-log-filtergrp { margin-right:.5em; }

/* logs */
.yui-skin-sam .yui-log .info { background-color:#A7CC25; } /* A7CC25 green */
.yui-skin-sam .yui-log .warn { background-color:#F58516; } /* F58516 orange */
.yui-skin-sam .yui-log .error { background-color:#E32F0B; } /* E32F0B red */
.yui-skin-sam .yui-log .time { background-color:#A6C9D7; } /* A6C9D7 blue */
.yui-skin-sam .yui-log .window { background-color:#F2E886; } /* F2E886 tan */
</textarea>
