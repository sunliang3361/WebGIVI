<?php
require_once('display_fns.php');
display_header();
echo "<div id='container'>";
echo '<p><img src="images/newsgoldbullet.gif" border="0"style="margin-left: 0px"><b>Contact</b></p>';
echo "<p> If you have questions or comments about our application that we provide, we would be pleased to hear from you!</p>";
echo "<form action='contact.php' method='POST'>";
echo "<span>Name</span></br>";
echo "<input type='text' name='userName' size='35'/></br>";
echo "<span>Your email address (optional)</span></br>";
echo "<input type='text' name='userEmail' size='35'/></br>";
echo "<span>Subject</span></br>";
echo "<input type='text' name='userSubject' size='35'/></br>";
echo "<span>Message</span></br>";
echo "<textarea rows=20 cols=50 name='userMessage'></textarea>";
echo "<input type='submit' name='userSubmit'/>";

echo "</form>";

if(isset($_POST['userSubmit'])){
  if((!empty($_POST['userName']))&&(!empty($_POST['userMessage']))&&(!empty($_POST['userSubject']))){
      $to_email = ''; //'ashique@udel.edu';
      $subject = test_input($_POST['userSubject']);
      $subject = '[Cytoscape.js] '.$subject.'--'.test_input($_POST['userName']);
      $message = test_input($_POST['userMessage']);
      $userEmail = test_input($_POST['userEmail']);
      if (!empty($userEmail)){
         $headers = 'From:'.$userEmail."\r\n".'Reply-To:'.$userEmail."\r\n".'X-Mailer: PHP/' . phpversion();
         //mail($to_email, $subject, $message,$headers);
      }

      else{
        $to_email = $to_email; // dummy line because the next line is commented out. -- ASHIQUE
        //mail($to_email, $subject, $message);
        }
     echo "<p><b>Thanks for your question, we will contact you as soon as possible!</b></p>"; 
  }
  else{
    echo "<p><b>Your forgot to input your name or subject or mesage!</b></p>";
  }
}

echo "</div>";
display_footer();
?>