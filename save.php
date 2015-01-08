<?php
$data = $_POST['data'];
$type = $_POST['type'];
$pathwayID = $_POST['pathwayID'];
if ($type == 'subset'){
    $file = 'usrID/'.md5(uniqid()) . '.txt';
    file_put_contents($file, $data);
}
elseif($type == 'json'){
    $file = 'usrID/'.$pathwayID.'_subpathway' . '.js';
    file_put_contents($file, $data);
}
elseif($type == 'svg'){
    $file = 'usrID/'.md5(uniqid()) . '.svg';
    file_put_contents($file, $data);
}
else{
    $file = 'usrID/'.md5(uniqid()) . '.png';
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
