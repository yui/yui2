<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>Safari 4 getBoundingClientRect</title>
    <style type="text/css" media="screen">
        body {
            position: relative;
        }

        #test {
            position: absolute;
            top: 200px;
            left: 400px;
            width: 10px;
            height: 10px;
            border: 1px solid black;
            background-color: red;
        }
	</style>
</head>
<body>
<p>Click on the red box in Safari 4 and look at the console. The numbers should be similar. Now zoom the page a couple of times then click the box, the numbers are <em>way off</em>.</p>
<div id="test"></div>

<script type="text/javascript">
window.onload = function() {
    document.getElementById('test').onclick = function(e) {
        var rect = document.getElementById('test').getBoundingClientRect();
        console.log(e);
        console.log([e.pageX, e.pageY], [rect.left, rect.top]);
    };
};
</script>
</body>
</html>
