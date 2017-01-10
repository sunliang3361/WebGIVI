<?php

// open the file in a binary mode


$file=$_GET["name"];
//echo $file;
//echo md5($file);
//echo test_input($file);
$file2="/var/www/data/".md5($file).'txt';
$fp = fopen($file2, 'rb');

// send the right headers
header("Content-Type: text/plain");
header("Content-Length: " . filesize($file2));

// dump the picture and stop the script
fpassthru($fp);
exit;


?>

