<html>
<head>
<script type="text/javascript" src="../build/yahoo/yahoo-min.js" ></script>
<script type="text/javascript" src="../build/event/event-min.js" ></script>
<script type="text/javascript" src="../build/datasource/datasource.js" ></script>
<script type="text/javascript">
YAHOO.util.DateLocale['fr'] = YAHOO.lang.merge(YAHOO.util.DateLocale, {
	a: ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'],
	A: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
	b: ['jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jui', 'aoû', 'sep', 'oct', 'nov', 'déc'],
	B: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
	p: ['', ''],
	P: ['', ''],
	x: '%d.%m.%Y'
});

YAHOO.util.DateLocale['fr-CA'] = YAHOO.lang.merge(YAHOO.util.DateLocale['fr'], { x: '%Y-%m-%d' });

YAHOO.util.DateLocale['de'] = YAHOO.lang.merge(YAHOO.util.DateLocale['fr'], {
        a: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        A: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
        b: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
        B: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
});

YAHOO.util.DateLocale['de-CH'] = YAHOO.lang.merge(YAHOO.util.DateLocale['de'], { a: ['Son', 'Mon', 'Die', 'Mit', 'Don', 'Fre', 'Sam'] });

</script>
<style type="text/css">
TH, TD { font-size: 0.8em; }
.nomatch { background-color: #f88; #color: #fff; }
.match { background-color: #8f8; #color: #000; }
TH { text-align: left; }
</style>
</head>
<body>
<?php
$testdates = array(time(), strtotime('1900/01/01'), strtotime('2008/01/01'), strtotime('2008/01/01 08:00:00'), strtotime('2007/12/31 23:59:59'), strtotime('2008/02/29'), strtotime('2000/12/31'));
/*$testdates = array();
for($i=1; $i<366; $i++)
{
	$testdates[] = strtotime("2008/01/$i");
	$testdates[] = strtotime("2008/01/$i 11:59:59");
	$testdates[] = strtotime("2008/01/$i 12:00:00");
}*/
$formats = array('a','A','b','B','c','C','d','D','e','F','g','G','h','H','I','j','k','l','m','M','n','p','P','r','R','s','S','t','T','u','U','V','w','W','x','X','y','Y','z','Z','%');
//$formats = array('j');
foreach($testdates as $date)
{
?>
<script type="text/javascript">
var date = new Date('<?php echo strftime('%Y/%m/%d %H:%M:%S', $date); ?>');
</script>
<h2>Testing: <?php echo strftime('%Y/%m/%d %H:%M:%S', $date) ?> (
<script type="text/javascript">
document.write(YAHOO.util.Date.format(date, {format: '%Y/%m/%d %H:%M:%S'}));
</script>
)</h2>
<table cellspacing=0 cellpadding=4 border=1>
<tr> <th rowspan="2">format</th> <th colspan="2">US English</th> <th colspan="2">UK English</th> <th colspan="2">AU English</th> <th colspan="2">French</th> <th colspan="2">Canadian French</th> <th colspan="2">German</th> <th colspan="2">Swiss German</th> </tr>
<tr> <th>PHP</th> <th>Javascript</th> <th>PHP</th> <th>Javascript</th> <th>PHP</th> <th>Javascript</th> <th>PHP</th> <th>Javascript</th> <th>PHP</th> <th>Javascript</th> <th>PHP</th> <th>Javascript</th> <th>PHP</th> <th>Javascript</th> </tr>
<?php
foreach($formats as $format)
{
	$format = "%$format";

	setlocale(LC_TIME, 'en_US.UTF-8', 'en_US');
	$sDate = strftime($format, $date);
	$jsDate = preg_replace('/\n/', '\n', $sDate);
?>
<tr>
  <td>
    <?php echo $format; ?>
  </td>

  <!-- en-US -->
  <td>
    <?php echo $sDate ?>
  </td>
  <script type="text/javascript">
  var sDate=YAHOO.util.Date.format(date, {format: "<?php echo $format ?>"}, "en-US");
  document.write("<td class='" + (sDate == "<?php echo $jsDate ?>"?"match":"nomatch") + "'>");
  document.write(sDate);
  document.write("</td>\n");
  </script>

  <!-- en-GB -->
<?php
	setlocale(LC_TIME, 'en_GB.UTF-8', 'en_GB');
	$sDate = strftime($format, $date);
	$jsDate = preg_replace('/\n/', '\n', $sDate);
?>
  <td>
    <?php echo $sDate ?>
  </td>
  <script type="text/javascript">
  var sDate=YAHOO.util.Date.format(date, {format: "<?php echo $format ?>"}, "en-GB");
  document.write("<td class='" + (sDate == "<?php echo $jsDate ?>"?"match":"nomatch") + "'>");
  document.write(sDate);
  document.write("</td>\n");
  </script>

  <!-- en-AU -->
<?php
	setlocale(LC_TIME, 'en_AU.UTF-8', 'en_AU');
	$sDate = strftime($format, $date);
	$jsDate = preg_replace('/\n/', '\n', $sDate);
?>
  <td>
    <?php echo $sDate ?>
  </td>
  <script type="text/javascript">
  var sDate=YAHOO.util.Date.format(date, {format: "<?php echo $format ?>"}, "en-AU");
  document.write("<td class='" + (sDate == "<?php echo $jsDate ?>"?"match":"nomatch") + "'>");
  document.write(sDate);
  document.write("</td>\n");
  </script>

  <!-- fr -->
<?php
	setlocale(LC_TIME, 'fr_FR.UTF-8', 'fr_FR', 'fr');
	$sDate = strftime($format, $date);
	$jsDate = preg_replace('/\n/', '\n', $sDate);
?>
  <td>
    <?php echo $sDate ?>
  </td>
  </td>
  <script type="text/javascript">
  var sDate=YAHOO.util.Date.format(date, {format: "<?php echo $format ?>"}, "fr");
  document.write("<td class='" + (sDate == "<?php echo $jsDate ?>"?"match":"nomatch") + "'>");
  document.write(sDate);
  document.write("</td>\n");
  </script>

  <!-- fr-CA -->
<?php
	setlocale(LC_TIME, 'fr_CA.UTF-8', 'fr_CA');
	$sDate = strftime($format, $date);
	$jsDate = preg_replace('/\n/', '\n', $sDate);
?>
  <td>
    <?php echo $sDate ?>
  </td>
  </td>
  <script type="text/javascript">
  var sDate=YAHOO.util.Date.format(date, {format: "<?php echo $format ?>"}, "fr-CA");
  document.write("<td class='" + (sDate == "<?php echo $jsDate ?>"?"match":"nomatch") + "'>");
  document.write(sDate);
  document.write("</td>\n");
  </script>

  <!-- de -->
<?php
	setlocale(LC_TIME, 'de_DE.UTF-8', 'de_DE', 'de');
	$sDate = strftime($format, $date);
	$jsDate = preg_replace('/\n/', '\n', $sDate);
?>
  <td>
    <?php echo $sDate ?>
  </td>
  </td>
  <script type="text/javascript">
  var sDate=YAHOO.util.Date.format(date, {format: "<?php echo $format ?>"}, "de-DE");
  document.write("<td class='" + (sDate == "<?php echo $jsDate ?>"?"match":"nomatch") + "'>");
  document.write(sDate);
  document.write("</td>\n");
  </script>

  <!-- de-CH -->
<?php
	setlocale(LC_TIME, 'de_CH.UTF-8', 'de_CH');
	$sDate = strftime($format, $date);
	$jsDate = preg_replace('/\n/', '\n', $sDate);
?>
  <td>
    <?php echo $sDate ?>
  </td>
  </td>
  <script type="text/javascript">
  var sDate=YAHOO.util.Date.format(date, {format: "<?php echo $format ?>"}, "de-CH");
  document.write("<td class='" + (sDate == "<?php echo $jsDate ?>"?"match":"nomatch") + "'>");
  document.write(sDate);
  document.write("</td>\n");
  </script>

</tr>
<?php
}

?>
</table>
<?php
}
?>
</body>
</html>
