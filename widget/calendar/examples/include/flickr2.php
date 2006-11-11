		
			<?php 
			
			if (substr_count($_SERVER["REQUEST_URI"],"print") == 0) {
				include "include/$_section-solution.php";
			}
			?>
