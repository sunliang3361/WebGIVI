<?php


require_once('display_fns.php');
header('Content-Type: text/plain');
if(preg_match("/[A-Za-z0-9\_]+/", $_GET['fileName']) == TRUE){
    $fileName = '/var/www/data/'.test_input($_GET['fileName']).'.txt';
}else{
    exit();
}

$file = fopen($fileName, "r");
while(!feof($file)){
    $line = fgets($file);
    if (trim($line)!='') {   echo($line); }
    # do same stuff with the $line
}
fclose($file);

?>