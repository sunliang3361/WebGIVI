<?php

// open the file in a binary mode


$file=$_GET["filename"];
$fp = fopen($file, 'r') or die("cannot open file.");


// send the right headers
header("Content-Type: text/plain");
header("Content-Length: " . filesize($file2));

// dump the picture and stop the script
fpassthru($fp);
exit;


?>

