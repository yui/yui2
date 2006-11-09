
			<p>The YUI Calendar Tutorials will provide you with working examples of several common uses of the Calendar component. Each tutorial contains a working functional example, plus documentation describing how it works.</p>


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