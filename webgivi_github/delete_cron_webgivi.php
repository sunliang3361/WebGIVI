<?php
$path='/home/sunliang/public_html/webgivi/usrID/';
$number=0;
if($handle=opendir($path)){
	
	while(false!==($file=readdir($handle))){
		$filelastmodified=filemtime($path.$file);
		if((time()-$filelastmodified)>24*3600){
			if (preg_match('/\.txt$/i', $file) or preg_match('/\.png$/i', $file) or preg_match('/\.svg$/i', $file) or preg_match('/\.json$/i', $file)){
				unlink($path.$file);
				$number++;
			}	
		}		
	
	}
	closedir($handle);
}
echo time()."-There are $number people to visit this website \n";
?>
