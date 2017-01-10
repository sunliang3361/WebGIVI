<?php

$page="";

if (isset($_POST['Submit'])) {

	$x = $_POST['X'];
	$y = $_POST['Y'];	
	$show = $_POST['show'];
	if ($show!='yes'){ $show='no'; }

	$result = `python AboutSetGenes.py $x $y $show`;
	$r_arr = explode("\n",$result);	
	foreach ($r_arr as $line){
		$page .= <<<EOD
		$line<br>
EOD;
	}

}

else{

	$page .= <<<EOD
	<form method="post"><br>
	X: <input type='text' name='X'> <br>
	Y: <input type='text' name='Y'> <br>
	show <input type='checkbox' name='show' value='yes'><br>	
	<input type="submit" name='Submit' value="Submit" />
	</form>
EOD;


}

echo $page;

?>