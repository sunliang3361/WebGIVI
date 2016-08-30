<?php
   require_once('display_fns.php');
   //if fileName has no slash only contain number and strings, then give the value.
   if(preg_match("/[A-Za-z0-9\_]+/", $_POST['fileName']) == TRUE){
      $fileName = 'blacklist/'.test_input($_POST['fileName']).'_all.txt';
      $termfileName = 'blacklist/'.test_input($_POST['fileName']).'_terms.txt';
   }else{
      echo "<script type='text/javascript'> alert('your input data format have problem, please contact us!'); </script>";
      exit();
   }
   if(preg_match("/\t/", $_POST['txt']) == TRUE){
      $txt = test_input($_POST['txt'])."\n";
   }else{
      echo "<script type='text/javascript'> alert('your input data format have problem, please contact us!'); </script>";
      exit();
   }
   
   
   //*********************************need to change********************************
      $file = fopen($fileName,'a+') or die ("cannot open this file");
      fwrite($file, "#TIME:".date("Y-m-d H:i:s",time())."\n");
      fwrite($file, $txt);
      fclose($file);

      $txt = test_input($_POST['txt']);
      $lines = explode("\n",$txt);
      $terms = array();
      foreach ($lines as $line){
         $ps = explode("\t",$line);
         $terms[$ps[1]]=$ps[1];
      }
      $saveString = join("\n",$terms)."\n";

      $file = fopen($termfileName,'a+') or die ("cannot open this file");
      #fwrite($file, "#TIME:".date("Y-m-d H:i:s",time())."\n");
      fwrite($file, "\n");
      fwrite($file, $saveString);
      fclose($file);
  

?>
