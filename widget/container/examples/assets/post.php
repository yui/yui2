<?php

print "data = { ";

$index = 0;

foreach($_POST as $key => $value) {
	
	print htmlspecialchars("$key:", ENT_QUOTES);
    
	if (gettype($value) == "array") {
		print "[";
		for ($i = 0;$i < count($_POST[$key]);$i++) { 
		   $v = $_POST[$key][$i]; 
		   print "\"$v\"";
		   if ($i < count($_POST[$key])-1) {
				print ",";
		   }
		} 
		print "]";
	} else {
		print "\"$value\"";
	}

	$index++;

	if ( ($index) < count($_POST) ) {
		print ", ";
	}
}

print " };";
?> 