<?php

if ($SECTION_NAME == "Tutorials") {
	$tocpath = "";
} else {
	$tocpath = "../";
}

?>
		<div id="toc" class="yui-b">
			<ul>
				<li class="sect"><a href="<?=$tocpath?>"><?=$COMPONENT?>: Tutorials</a></li>

<?php

foreach ($sections as $key => $data) {
	$name = $data["name"];
	$steps = $data["pages"];

	$itemClass = "item";
	$selected = false;

	if ($key == $_section) {
		$itemClass .= " selected";
		$selected = true;
	}

#	print "<li class=\"$itemClass\"><a href=\"$tocpath$key/1\">$name</a><a title=\"Printer-Friendly Version\" class=\"printer\" href=\"print\" target=\"_blank\">&nbsp</a></li>\n";
	print "<li class=\"$itemClass\"><a href=\"$tocpath$key/1\">$name</a></li>\n";

	if ($selected) {
		foreach ($steps as $stepNumber => $stepName) {

			$stepClass = "child";
			if ($stepNumber == $_step) {
				$stepClass .= " active";
			}

			print "<li class=\"$stepClass\"><a href=\"$tocpath$key/$stepNumber\">$stepName</a></li>\n";
		}
	}
}

?>
			</ul>
		</div>