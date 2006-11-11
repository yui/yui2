<?php

class nonSenseGenerator
{

	function nonSenseGenerator()
	{
		
	}
	
	function nonsense($numSentences = 1) {
		$lists = array("interjections", "determiners", "adjectives", "nouns", "adverbs", "verbs", "prepositions", "conjunctions", "comparatives");
		$vowels = array('a','e','i','o','u');
		$type = rand(0,1);

		foreach ($lists as $part) ${$part} = file("/home/y/share/pear/Yahoo/nonsenseGenerator/db/".$part.".txt");

		for ($i=0; $i<2; $i++) {
			foreach ($lists as $part) ${$part}[$i]	= trim(${$part}[rand(0,count(${$part}) - 1)]);

			if ($determiners[$i] == "a")
			foreach ($vowels as $vowel)
			if (($type && ($adjectives[$i][0] == $vowel)) || (!$type && ($nouns[$i][0] == $vowel))) $determiners[$i] = "an";

		}

                $determiners[0] = ucfirst($determiners[0]);
		$sentence = ($type ?
		"$determiners[0] $adjectives[0] $nouns[0] $adverbs[0] $verbs[0] $prepositions[0] $determiners[1] $adjectives[1] $nouns[1]" :
		"$determiners[0] $nouns[0] is $comparatives[0] $adjectives[0] than $determiners[1] $adjectives[1] $nouns[1]");

		if ($numSentences > 1) return $sentence." ".$this->nonsense($numSentences-1);
		return $sentence;
	}

	function getNonSense($words="")
	{

		if ($words=="") { $words = 10; };
	
		$nonsenseBuffer = "";


			$nonsenseBuffer .= $this->nonsense($words);
		
		return $nonsenseBuffer;
	}
}


?>
