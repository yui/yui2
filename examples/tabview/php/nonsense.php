<?php
header("Content-type: text/html");
include_once('nonsenseGenerator/nonsenseGenerator.class.php');

$nonsense = new nonSenseGenerator();

$items = 5;
$type = isset($_GET['type']) ? $_GET['type'] : 'list';

sleep(1);

if ($type == 'list') {


?>
<ul>
<?php
for ($i =0; $i < $items; $i++) {
    ?><li><a href="#"><?php echo $nonsense->getNonSense(1) ?></a></li>
<?php
}
?>
</ul>

<?php
} else if ($type == 'para') {
    ?><p><?php echo $nonsense->getNonSense(1) . '. ' . 
                    $nonsense->getNonSense(1) . '. ' .
                    $nonsense->getNonSense(1)?>.</p>
<p><?php echo $nonsense->getNonSense(1) . '. ' . 
                    $nonsense->getNonSense(1) . '. ' .
                    $nonsense->getNonSense(1)?>.</p>
    <?php
}



?>