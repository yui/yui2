<h2 class="first">Resize Utility's core CSS file</h2>

<p>The ImageCropper's base class is a starting point for skinning the ImageCropper Control. Include this file and use the skin file as a reference for your new skin (<a href="../../build/imagecropper/assets/imagecropper-core.css">you can view the full contents of the base class here</a>).</p>

<h2>Sam's skin CSS file</h2>

<p>Once you have the base class in place, you can proceed to customize the look and feel of your Resize Utility by working with the skinnning file.   Starting with the Sam Skin version below is generally the fastest approach, allowing you to customize just those parts of the skin that will make your implementation resonate with the overall design of your application.</p>

<textarea name="code" class="CSS">
.yui-skin-sam .yui-crop .yui-crop-mask {
    background-color: #000;
    opacity: .5;
    filter: alpha(opacity=50);
}

.yui-skin-sam .yui-crop .yui-resize {
    border: 1px dashed #fff;   
}
</textarea>
