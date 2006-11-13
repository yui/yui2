<?php
header("Content-type: text/html");

$items = 5;
$type = isset($_GET['type']) ? $_GET['type'] : 'list';

sleep(1);

if ($type == 'list') {


?>
<ul>
<?php
for ($i =0; $i < $items; $i++) {
    ?><li><a href="#">lorem ipsum dolor sit amet</a></li>
<?php
}
?>
</ul>

<?php
} else if ($type == 'para') {
    ?><p> Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut.</p> 
<p> Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut.</p> 
<?php    
}
?>
