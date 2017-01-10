<?php
  session_start();
  require_once('display_fns.php');
  display_header();
  
  if ($_SERVER['REQUEST_METHOD']== "POST") {
    if(isset($_POST["box_submit"])&&isset($_POST["type"])){
      $_SESSION['type'] = test_input($_POST["type"]);
      $_SESSION['typeDB'] = test_input($_POST["typeDB"]);
      $_SESSION['organism'] = test_input($_POST["organism"]);
      $_SESSION['txt_query'] = test_input($_POST["txt_query"]);
      if (isset($_POST["conceptName"])){
        $_SESSION['conceptName'] = test_input($_POST["conceptName"]);
      }else{
        $_SESSION['conceptName']= false;
      }
      if (empty($_POST['txt_query'])){
        echo "<script type='text/javascript'> alert('Your ID list is empty! Please give me your ID!'); location.href = 'index.php'; </script>";
      }
      else{
        header('location: editTable.php');
        exit();
      }
    }
    elseif(isset($_POST["box_submit"])){
      echo "<script type='text/javascript'> alert('Please select your data type in the radio button!'); location.href = 'index.php'; </script>";
    }
    else{
      echo "<script type='text/javascript'> alert('Please resubmit your input data'); location.href = 'index.php'; </script>";
    }
  }
  

?>

<div id='index'>
<div id='container'>
  <div><img src="images/newsgoldbullet.gif" border="0"style="margin-left: 0px"><b>WebGIVI</b>  can accept a gene list that will be used to retrieve a gene symbol and iTerm list. This list can be resubmitted to visualize the gene-iTerm pairs using Cytoscape or Concept Map. The resulting list can be edited to remove iTerms that are not of interest to the user. Visualized Graphs can also be saved as PNG format. (NOTE: 
  <u>You may not be able to visualize more than 1000 node-iterm pairs at one time in Cytoscape due to the limitation of cytoscape.js. However, Concept Map can visualize big data !</u>).
  </div>
  </br>
  <div><img src="images/newsgoldbullet.gif" border="0"style="margin-left: 0px"><b>Data Visulization:</b></div>
  <form action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']);?>" method="post">
    <span><b>eGIFT Gene Enrichment Analysis</b></span></br>
    <span>Please Input Your Gene IDs(at least 2 IDs) OR gene symbols OR gene iterm pairs Below</span></br></br>
    <span><b>Samples:</b></span></br>
    <span>Entrez </span><button><a href="sampleData/entrezID-sample.txt" target="_blank" style="text-decoration:none;">Sample</a></button>
    <span>&nbspUniprot </span><button><a href="sampleData/uniprotID-sample.txt" target="_blank" style="text-decoration:none;">Sample</a></button>
    <span>&nbspEnsembl </span><button><a href="sampleData/ensemblID-sample.txt" target="_blank" style="text-decoration:none;">Sample</a></button>
    <span>&nbspGene symbol </span><button><a href="sampleData/symbol-sample.txt" target="_blank" style="text-decoration:none;">Sample</a></button>
    <span>&nbsp Gene-Iterm </span><button type="button"><a href="sampleData/gene-iterm-sample.txt" target="_blank" style="text-decoration:none;">Sample</a></button>
    </br>
    <span><b>Input type:</b></span></br>
    <span><input type="radio" name="type" value="entrez"></span><span>Entrez ID &nbsp&nbsp</span>
    <span><input type="radio" name="type" value="uniprot"></span><span>UniProt ID &nbsp&nbsp</span>
    <span><input type="radio" name="type" value="ensembl"></span><span>Ensembl ID &nbsp&nbsp</span>
    <span><input type="radio" name="type" value="genesymbol"></span><span>Gene symbols &nbsp&nbsp</span>
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
    <span> Database you want to choose: </span>
    <span><input type="radio" name="typeDB" value="egift" checked></span><span>eGIFT </span>
    <span><input type="radio" name="typeDB" value="amigo"></span><span>Amigo2 </span></br>
    <span> Organism: <select name='organism'>   
        <option value='notselected' selected>&lt;select&gt;</option> 
        <option value='Homo Sapiens'>Homo sapiens</option>
        <option value='Gallus gallus'>Gallus gallus</option>
      </select></span>
    <input type="submit" name="box_submit" value="Submit">
  </form>	

</div>
<div id='sidePage'>
  <a href='images/Liang_PAG_Poster.pdf' target='_blank'><img src='images/flowChart.png' height='250px'/></a></br>
  <iframe width="350" height="300" src="https://www.youtube.com/embed/RP4MWQpVHwU" frameborder="1" allowfullscreen></iframe>  
</div>
</div>
</br></br>
<?php

display_footer();

?>

