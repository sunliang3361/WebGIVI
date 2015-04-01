<?php
  require_once('display_fns.php');
  display_header();
?>

<div id='index'>
<div id='container'>
  <div><img src="images/newsgoldbullet.gif" border="0"style="margin-left: 0px"><b>WebGIVI</b> can accept Entrez gene list that will be used to retrieve a gene symbol and iTerm list. This list can be resubmitted to visualize the gene-iTerm pairs using cytoscape or Concept Map.
  Visualized Graph on the website can also be saved as PNG format. (NOTE:
  <u>You might can not visualize more than 1000 node-iterm pairs at one time in Cytoscape due to the limitation of cytoscape.js. However, Concept Map can visualize big data !</u>).
  </div>
  </br>
  <div><img src="images/newsgoldbullet.gif" border="0"style="margin-left: 0px"><b>Data Visulization:</b></div>
  <form action="filterTable.php" method="post">
    <span><b>eGIFT Gene Enrichment Analysis</b></span></br>
    <span>Please Input Your NCBI Entrez Gene IDs(at least 2 IDs) OR gene iterm pairs Below</span></br>
    <span>Entrez Sample: </span><button><a href="sampleData/entrezID-sample.txt" target="_blank" style="text-decoration:none;">Sample</a></button>
    <span>&nbsp&nbsp&nbsp Gene Iterm Pair: </span><button type="button"><a href="sampleData/gene-iterm-sample.txt" target="_blank" style="text-decoration:none;">Sample</a></button>
    </br></br>
    <span><input type="radio" name="type" value="entrez"></span><span>Entrez ID &nbsp&nbsp</span>
    <span><input type="radio" name="type" value="gene-iterm"></span><span>Symbol Iterm Pair</span></br></br>
    
    <span><b>Custom Data</b></span></br>
    <span>Users can visualize their two-column tab delimited data (e.g.gene pathway pair data) </span></br>
    <span>Sample: <button><a href="sampleData/custome-sample.txt" target="_blank" style="text-decoration:none;">Sample</a></button>
    </span></br></br>
    <span><input type="radio" name="type" value="custome"></span><span>Customized Data &nbsp&nbsp</span></br></br>
    <textarea rows=20 cols=80 name="txt_query"></textarea>

    <?php
      //require_once('recaptchalib.php');
      //$publickey = "6LeF0OwSAAAAAIz0gYTwKiRLAoohnCybX8ewNCaM"; // you got this from the signup page
      //echo recaptcha_get_html($publickey);
    ?>
    </br></br>
    <span>Name Your input List (optional) <input name='conceptName' type='txt'></span>
    </br>
    <input type="submit" name="box_submit" value="Submit">
  </form>	

</div>
<div id='sidePage'>
  <a href='images/Liang_PAG_Poster.pdf' target='_blank'><img src='images/flowChart.png' height='250px'/></a>
  <iframe width="350" height="300" src="https://www.youtube.com/embed/RP4MWQpVHwU" frameborder="1" allowfullscreen></iframe>  
</div>
</div>
</br></br>
<?php

display_footer();

?>

