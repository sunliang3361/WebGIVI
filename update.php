<?php
   require_once('display_fns.php');
   //if fileName has no slash only contain number and strings, then give the value.
   if(preg_match("/[A-Za-z0-9\_]+/", $_POST['fileName']) == TRUE){
      $fileName = '/var/www/data/'.test_input($_POST['fileName']).'.txt';
   }else{
      echo "<script type='text/javascript'> alert('your input data format have problem, please contact us!'); </script>";
      exit();
   }
   if(preg_match("/\t/", $_POST['txt']) == TRUE){
      $txt = test_input($_POST['txt']);
   }else{
      echo "<script type='text/javascript'> alert('your input data format have problem, please contact us!'); </script>";
      exit();
   }
   
   
   //*********************************need to change********************************
   if(file_exists($fileName)){
      $file = fopen($fileName,'w');
      fwrite($file, $txt);
      fclose($file);
   }else{
      echo 'can not find the file you want!';
   }

?>
