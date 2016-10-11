<?php
  
  $fileName='/var/www/blacklist/blacklist_terms.txt'; 
   
  /*
   if(preg_match("/\n/", $_POST['txt']) == TRUE){
      $txt = test_input($_POST['txt']);
   }else{
      echo "<script type='text/javascript'> alert('your input data format have problem, please contact us!'); </script>";
      exit();
   }
   */
   
   $txt=$_POST['txt'];
   //*********************************need to change********************************
   if(file_exists($fileName)){
      $file = fopen($fileName,'w') or die("Cannot open file.");
      fwrite($file, $txt);
      fclose($file);
   }else{
      echo 'can not find the file you want!';
   }

?>
