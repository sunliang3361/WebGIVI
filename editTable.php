<?php
session_start();
require_once('display_fns.php');
display_header();
//$fileName = $_GET['fileName'];
?>

<script src="js/editTable.js?version=2"></script>

<?php
      $type=$_SESSION["type"];
      $typeDB=$_SESSION["typeDB"];
      $organism=$_SESSION["organism"];
      //echo $type;
      //echo $typeDB;
      //echo "<b>You can view gene iterm in graph by the following method!\n</b>";
      //echo "</br></br>";
      $list = $_SESSION["txt_query"];

      // if amigo analysis, then no need for ID conversion. AMIGO takes uniprot, Entrez, Ensemble, gene symbols
      if($typeDB=="amigo"){
        if ($organism=="notselected"){ echo "<script type='text/javascript'> alert('For Amigo2 analysis, you must select an organism.'); location.href = 'index.php'; </script>"; }
        else if($type=="gene-iterm" || $type=="custome"){
          echo "<script type='text/javascript'> alert('For Amigo2 analysis, the input must be genes.'); location.href = 'index.php'; </script>";
        }
        /*else{
            $im_list=explode('\n', $list);
            $input_string='';
            foreach ($im_list as $item){ $input_string.=$item.' '; }
            $geneListAmigo = preg_replace('/\r\n|\r|\n/',',',$input_string);
          }//*/
      }

      //else{
        // Ashique
        // Based on type, convert the data in $list to appropriate Entrez IDs     
        if ($type=='uniprot'){
            $im_list=explode('\n', $list);
            $input_string='';
            foreach ($im_list as $item){ $input_string.=$item." "; }          
            $list = `python convertIDs.py -c u2e -i "$input_string" `;
        }
        else if($type=='ensembl'){
            $im_list=explode('\n', $list);
            $input_string='';
            foreach ($im_list as $item){ $input_string.=$item." "; }          
            $list = `python convertIDs.py -c b2u -i "$input_string" `;
            $list = preg_replace('/\r\n|\r|\n/'," ",$list);
            $list = `python convertIDs.py -c u2e -i "$list" `;
        }
        else if($type=='genesymbol'){
            $im_list=explode('\n', $list);
            $input_string='';
            foreach ($im_list as $item){ $input_string.=$item.","; }  
            $username="liang"; 
            $password="EntrezForLiang";
            //echo $input_string;
            //echo "http://biotm.cis.udel.edu/udelafc/getEntrezFromGene.php?user=$username&pass=$password&symbols=$input_string";
            $list = file_get_contents("https://biotm.cis.udel.edu/udelafc/getEntrezFromGene.php?user=$username&pass=$password&symbols=$input_string"); 
            //echo $list;
            //$list = `python GeneName2Entrez.py "$input_string" `;
            //echo $list;
        }
     // }

        $conceptName = $_SESSION["conceptName"];
        // 
        $date=new DateTime();
        $d=$date->getTimestamp();
        $ran=md5(uniqid());
        $filename="data/id_$d"."_$ran.txt";
        //if we find filename is the same, try to assign a new file name untile it's different.
        while(file_exists($filename)){
          $ran=md5(uniqid());
          $filename="data/id_$d"."_$ran.txt";
        }
        $fileID = "id_$d"."_$ran";
        $filePass="data/id_$d"."_$ran";
        $list=trim($list); 
        //only entrez id provided
        echo "</br><div id='main'>";
	echo "<b>Analysis Result:</b></br>";
        echo "<div>Suggestion: if your filtered data is larger than 1000 lines, please use concept map to visuallize!</div></br>";
        echo '<div id="wait"><!-- loading animation --></div>';
        echo "<div>";
        echo "Sort: <select id='sortTable'><option value='alph'>alphabetical</option><option value='freq'>frequency</option>";
        if($type == 'entrez' ||$type == 'uniprot'|| $type=='ensembl' || $type=='genesymbol'){
          echo "<option value='cat'>categories</option>";
          echo "<option value='pval'>p-values</option>";
        }
        echo "</select> &nbsp;&nbsp;&nbsp;&nbsp;";
        echo "Frequency: <= <input id='input_freq' type='text' size=3 value='0' > <button id='select_freq'>Select</button>&nbsp;&nbsp;&nbsp;&nbsp;";
        echo "Selection: <button id='clear'>Clear</button>&nbsp; <button id='selectall'>Select all</button>&nbsp; <button id='toggle'>Toggle</button>&nbsp;&nbsp;";       
        echo "</br></br>";
        echo "<!-- <button id='delete'>Delete</button> &nbsp; -->";        
        echo "Remove options: <select id='showTable'> <option value='none' selected>&lt;select one&gt;</option> <option value='remove'>Remove selected</option> <!-- <option value='blacklist'>Remove selected and blacklist</option> --> </select> &nbsp;";        
        echo "Include blacklisted items:<input type='checkbox' id='blacklistfilter' value='black' checked> &nbsp;";
        echo "<button id='reset'>Reset table</button> &nbsp;";
        echo "<button id='view'>View</button> &nbsp;";
        echo "<button id='download'>Download</button> &nbsp;";
        echo "<button id='conceptMap'>Concept_Map View</button>&nbsp;";
        
        if($type == 'entrez'||$type == 'gene-iterm'||$type == 'uniprot'|| $type=='ensembl' || $type=='genesymbol' || $type=='custome'){
            echo "<button id='cytoscape'>Cytoscape View</button> &nbsp;";
        }
        echo "&nbsp;&nbsp;&nbsp;<button id='editblacklist'>Edit blacklist</button>&nbsp;";
        echo "</br></br>";
        echo '<div style="height: 700px; width: 1250px; overflow: scroll;">';

        echo "<div id='d3table'></div>";

        echo '</div>';
        
        echo "</div>";
        echo "</br></br></br>";
	
        if($type=='entrez' || $type=='uniprot' || $type=='ensembl' || $type=='genesymbol'){
        $list = str_replace('"','-',$list);
  	//$list_arr = preg_split('/\r\n/', $list);
        $list = preg_replace('/\r\n|\r|\n/',"\n",$list);
        $list_arr=explode("\n",$list);
        foreach ($list_arr as $d) {
        	//echo "----$d-----</br>";
        	$gene=$gene.','.$d;
        }
      	$gene=ltrim($gene,',');
        
        if ($typeDB == 'egift'){
            
            //echo $gene; 
            //always use this username, otherwise you can't get results
            $username="liang"; 
            //This is password for you.
            $password="AnalysisForLiang";
            //$gene="650,651,652";

            $result = file_get_contents("https://biotm.cis.udel.edu/udelafc/getGeneAnalysisResults.php?user=$username&pass=$password&entrezids=$gene");

            $fh=fopen($filename,'w') or die ("cannot open this file");
            fwrite($fh,$result);
            fclose($fh);
            //echo 'perl eGIFT_parser.pl'.' '.$filePass;
            echo exec(escapeshellcmd('perl eGIFT_parser.pl'.' '.$filePass));
            echo "</br>";
             
            $outfile=$filePass.'_gene_iterm.txt';
            $outfile_post = $fileID.'_gene_iterm';	
            $fisher_file = $filePass.'_gene_iterm_fisher.txt';
            $fisher_result = `python FisherTest.py background_pairs.txt $outfile $fisher_file`;        
            //$fisher_result = trim($fisher_result);
        }

        /* if Amigo2 database, we do not need to go to eGIFT anymore */
        elseif ($typeDB =="amigo"){
            //echo $geneListAmigo;
            //echo $organism;
            $organism=preg_replace('/\s/', '~@~', $organism);
            //always use this username, otherwise you can't get results
            $username="liang"; 
            //This is password for you.
            $password="AnalysisForLiang";
            //$gene="650,651,652";
            //echo "https://biotm1.cis.udel.edu/udelafc/getAmigoAnalysisResults.php?user=$username&pass=$password&entrezids=$gene&organism=$organism";
            $result = file_get_contents("https://biotm.cis.udel.edu/udelafc/getAmigoAnalysisResults.php?user=$username&pass=$password&entrezids=$gene&organism=$organism");

            $fh=fopen($filename,'w') or die ("cannot open this file");
            fwrite($fh,$result);
            fclose($fh);

            //echo 'python amigo_parser.py'.' '.$filePass;
            echo exec(escapeshellcmd('python Amigo_parser.py'.' '.$filePass));
            $outfile_post = $fileID.'_gene_iterm';  
            $fisher_file = $filePass.'_gene_iterm_fisher.txt';

        }


?>

	<script>
	  var fileName = <?php echo "'".$outfile_post."'"; ?>;
          var conceptName = <?php echo "'".$conceptName."'"; ?>;
          var fisherFile = <?php echo "'".$fisher_file."'"; ?>;
	  loadTable(fileName,true,conceptName,fisherFile);
          
	</script>
<?php
        //$outfile1=$filePass.'_gene_iterm_modified.txt';
        //echo "<span>Gene Iterm Table:<a href='".$outfile."' target='_blank'><button>View</button></a></span></br>";
        
        }
        // gene-iterm pair provided
        elseif ($type=="gene-iterm"){
          $outfile=$filePass.'_gene_iterm.txt';
          $outfile_post = $fileID.'_gene_iterm';
          $fh=fopen($outfile,'w') or die ("cannot open this file");
          fwrite($fh,$list);
          fclose($fh);
          $fisher_file = $filePass.'_gene_iterm_fisher.txt';
          $fh=fopen($fisher_file,'w') or die ("cannot open this file");          
          fclose($fh);


?>
  <script>
	  var fileName = <?php echo "'".$outfile_post."'"; ?>;
          var conceptName = <?php echo "'".$conceptName."'"; ?>;
          var fisherFile = <?php echo "'".$fisher_file."'"; ?>;
    loadTable(fileName,true,conceptName,fisherFile);
          
	</script>

<?php
	}
        elseif ($type=="custome"){
          $outfile=$filePass.'_custome.txt';
          $outfile_post = $fileID.'_custome';
          $fh=fopen($outfile,'w') or die ("cannot open this file");
          fwrite($fh,$list);
          fclose($fh);
          $fisher_file = $filePass.'_gene_iterm_fisher.txt';
          $fh=fopen($fisher_file,'w') or die ("cannot open this file");          
          fclose($fh);

?>

  <script>
	  var fileName = <?php echo "'".$outfile_post."'"; ?>;
          var conceptName = <?php echo "'".$conceptName."'"; ?>;
	  var fisherFile = <?php echo "'".$fisher_file."'"; ?>;
    loadTable(fileName,true,conceptName,fisherFile);
          
	</script>
<?php            
        }
        


echo '</div>';
?>


