<?php

//always use this username, otherwise you can't get results
$username="liang"; 

//This is password for you.
$password="SentencesForLiang";

$symbol="gro";
$term="drosophila embryo";


$result = file_get_contents("https://biotm.cis.udel.edu/udelafc/getSentencePage.php?user=$username&pass=$password&gene=$symbol&term=$term");


// The $result contains the link to the sentence page. You can use the link in your own way OR you can redirect directly to the sentence page by this:

header( 'Location: '.$result );
die();


?>
