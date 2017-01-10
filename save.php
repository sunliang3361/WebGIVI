<?php
require_once('display_fns.php');
//if(preg_match("/[A-Za-z0-9\_]+/", $_POST['data']) == TRUE){
//    $data = test_input($_POST['data']);
//}
$data = $_POST['data'];
if(preg_match("/[A-Za-z0-9\_]+/", $_POST['pathwayID']) == TRUE){
    $pathwayID = test_input($_POST['pathwayID']);
}
if(preg_match("/[A-Za-z0-9\_]+/", $_POST['type']) == TRUE){
    $type = test_input($_POST['type']);
}
//$data = $_POST['data'];
//$type = $_POST['type'];
//$pathwayID = $_POST['pathwayID'];

if ($type == 'subset'){
    $file = '/var/www/data/'.md5(uniqid()) . '.txt';
    file_put_contents($file, $data);
}
elseif($type == 'json'){
    $file = '/var/www/data/'.$pathwayID.'_subpathway' . '.js';
    file_put_contents($file, $data);
}
elseif($type == 'svg'){
    $file = '/var/www/data/'.md5(uniqid()) . '.svg';
    file_put_contents($file, $data);
}
else{
    $file = '/var/www/data/'.md5(uniqid()) . '.png';
    $uri =  substr($data,strpos($data,',')+1);
    // save to file
    file_put_contents($file, base64_decode($uri));
}



//$file = 'image/network'. '.png';
// remove "data:image/png;base64,"



// return the filename
//echo json_encode($file);
echo $file;


?>
