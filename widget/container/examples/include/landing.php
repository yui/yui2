
			<p>The YUI Container Tutorials will provide you with working examples of several common uses of the Container component. Each tutorial contains a working functional example, plus documentation describing how it works.</p>


<div id="landing">
<?php

foreach ($sections as $key => $data) {
	$name = $data["name"];
	$steps = $data["pages"];
	$desc = $data["desc"];

	?>
	<h3><a href="<?=$key?>"><?=$name?></a></h3>
	<p><?=$desc?></p>

	<?php
}
?>
</div>