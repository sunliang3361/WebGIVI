<?php

// open the file in a binary mode

$file2="/var/www/blacklist/blacklist_terms.txt";
$fp = fopen($file2, 'rb');

// send the right headers
header("Content-Type: text/plain");
header("Content-Length: " . filesize($file2));

// dump the picture and stop the script
fpassthru($fp);
exit;


?>

