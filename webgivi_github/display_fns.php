<?php
function display_header(){
  ?>
<html>
<head>
  <title>webGIVI tool</title>
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
  <script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
  <link rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css"/>
  <link rel="stylesheet" href="css-ui/jquery-ui.css"/>
  <script src="http://d3js.org/d3.v3.min.js"></script>
  <script>
    $(function() {
      $( "#menu" ).menu();
      $( "#tabs" ).tabs();
      //    $body = $("body");
      //
      //$(document).on({
      //ajaxStart: function() { $body.addClass("loading");    },
      //ajaxStop: function() { $body.removeClass("loading"); }    
      //});
  });  
  </script>

  
  
</head>
<body>

<div id="header">
  <div id="logo">webGIVI<span id="logo-part"><sup> tool</sup></span></div>
  <div id="logo-text">
    <div id="logo-title">Visualization of Gene and iTerm</div>
  </div>
</div>

<div id="menu">
  <div><a href="index.php">Home</a></div>
  <div><a href="http://biotm.cis.udel.edu/eGIFT/">eGIFT</a></div>
  <div><a href="tutorial.php">Tutorial</a></div>
  <div><a href="contact.php">Contact</a></div>
</div>

<?php
}




function display_footer(){
?>
</body>
</html>
<?php
}


?>

