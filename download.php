<?php

//$file = trim($_GET['path']);
$file = trim($_GET['path']);
$type = $_GET['type'];
// force user to download the image
if (file_exists($file)) {
    header('content-type: application/octet-stream');
    //header('Content-Type: text/plain'); 
    header('Content-Disposition: attachment; filename='.$file);
    header('Content-Transfer-Encoding: binary');
    header('Expires: 0');
    header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
    header('Pragma: no-cache');
    header('Content-Length: ' . filesize($file));
    ob_clean();
    flush();
    readfile($file);
    exit;
}
else {
    echo "$file is not found";
}
?>
