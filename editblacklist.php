<?php
session_start();
require_once('display_fns.php');
display_header();
//$fileName = $_GET['fileName'];
?>

<script src="js/editBlacklist.js?version=11"></script>


<br>
<span>Edit the blacklist below: </span></br></br>
<textarea rows=20 cols=80 id='blacklist_txt'></textarea></br>
<button id='save'>Save</button> &nbsp;&nbsp;&nbsp;
<button id='reload'>Reload</button> &nbsp;&nbsp;&nbsp;
<!-- <button id='save_exit'>Save and Exit</button> &nbsp;&nbsp;&nbsp; -->

<script>
	loadBlacklist();
</script>

<?php

?>


