<?php
require_once('display_fns.php');
display_header();
//$fileName = $_GET['fileName'];
?>

<script>
function loadTable(fileName,flag_egift){
    var currentData;
    var tooltip;
    var rowLength = 4;
    d3.text(fileName, function (geneItems) {
    //var datas = geneItems.split("\r\n");
    
    geneItems = geneItems.replace(/\r\n/g, '\n');
    geneItems = geneItems.replace(/\r/g, '\n');
    if(geneItems.indexOf('\t')==-1){
        alert('Warning error,please input tab delimited data!');
        location.href = "index.php";
        return;
    }
    var datas = geneItems.split("\n");
    var geneItemData={};
    geneItemData.genes = [];
    geneItemData.Items = [];
    for(var i=0; i<datas.length; ++i)
    {
        if(datas[i]=="")
        continue;
        var pairs = datas[i].split("\t");
        geneItemData.genes.push(pairs[0]);
        geneItemData.Items.push(pairs[1]);
    }
    if(geneItemData.genes.length == 0 || geneItemData.Items.length == 0 ){
        alert('The eGIFT result of your input data is empyt OR your input data format is not correct OR Your input data is too big!');
        location.href = "index.php";
        return;
    }
    currentData = partData(geneItemData); //0 genes 1 items
    tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("fill", "#333")
        .style("font-size", "12px")
        .style("background", "#eee")
        .style("box-shadow", "0 0 5px #999999")
        .style("position", "absolute")
        .style("z-index", "10");
    refreshTable(currentData);
    });


    function refreshTable(Data) {
        d3.select("#delete").on("click", function(d) {
            d3.selectAll('.checkBox')[0].forEach(function(d, i) {
                if(d.checked)
                {
                    var currentdata = d3.select("#"+d.id).datum();
                    var index = Data.indexOf(currentdata);
                    if(index > -1)
                    {
                        Data.splice(index,1);
                    }
                }
            });
            
                    //rewrite data to the gene iterm file???????????????????????????????????????????????????
            var saveString="";
            for(var i=0; i< Data.length; ++i)
            {   
                for(var j=0;j<Data[i].genes.length-1; ++j)
                {
                    if(Data[i].genes[j] !=="")
                    {
                        saveString += Data[i].genes[j];
                        saveString += "\t";
                        saveString += Data[i].keys
                        saveString += "\n";
                        }
                }
                
                saveString += Data[i].genes[Data[i].genes.length-1];
                saveString += "\t";
                saveString += Data[i].keys
                saveString += "\n";
            }

            
            $.ajax({
                url:'rewrite.php',
                type:"POST",
                data:{
                        txt:saveString,
                    fileName:fileName
                    },
                dataType:"text",
                beforeSend:function(){
                    $('#wait').show();
                },
                success:function(){
                    $('#wait').hide(); 
                },
                error:function(){
                    $('#wait').hide();
                    alert("failure");
                }
            
                
            });
            
            refreshTable(Data);
        
        });
    
        //make sure data is rewrite successfully, and then we can use visualize the data
        $("#view").click(function(){
            window.open(fileName);
            });
        $("#cytoscape").click(function(){
            window.open('biolayout3.php?fileName='+fileName,'_blank');
            });
        $('#conceptMap').click(function(){
  
            window.open('conceptMap.php?fileName='+fileName+'&flag_egift='+flag_egift,'_blank');
            
        });
        $('#download').click(function(){
	    window.location.href = "download.php?path="+ fileName;
        });
        
        
        var margin = {top: 20, right: 10, bottom: 30, left: 10},
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;
        if(d3.select('#d3table').select('table'))
        {
            d3.select('#d3table').select('table').remove();
        }
        var table = d3.select('#d3table').append("table");
            //.attr("width", width + margin.left + margin.right);
            //.attr("height", height + margin.top + margin.bottom);
        table.append("tbody");
        var matrix = [];
        var currentData = clone(Data);
        //click visualize tool, then save the data into usrID folder
        
        while(currentData.length) {
            matrix.push(currentData.splice(0,rowLength));
        }
        
        function clone(obj) {   // ***********************how to understand clone function********************************
            if (null == obj || "object" != typeof obj) return obj;
            var copy = obj.constructor();
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
            }
            return copy;
        }

        // fill the table
        // create rows
        var tr = d3.select("tbody")
            .selectAll("tr")
            .data(matrix);
        tr.enter().append("tr");
        // create cells
        var td = tr.selectAll("td")
            .data(function (d) {
            return d;
            }) .attr("width",80);
        //var cellTd = td.enter().append("td");
        //cellTd.on("click", function(d,i) {
        //if(!d3.select("#"+d3.select(this).datum().id).node().checked )
        //{
        //    d3.select(this).attr("class","highlight");
        //    d3.select("#"+d3.select(this).datum().id).property('checked', true);
        //}
        //else
        //{
        //    d3.select(this).attr("class","normal");
        //    d3.select("#"+d3.select(this).datum().id).property('checked', false);
        //}
        //});
        var cellTd = td.enter().append("td");

        cellTd.attr("id", function(d,i){
            return "cellTd"+d.id;
        }).on("click", function(d,i) {
            if(!d3.select("#"+d3.select(this).datum().id).node().checked )
            {
                d3.select(this).attr("class","highlight");
                d3.select("#"+d3.select(this).datum().id).property('checked', true);
            }
            else
            {
                d3.select(this).attr("class","normal");
                d3.select("#"+d3.select(this).datum().id).property('checked', false);
            }


        });


        function format_name(d) {
            var name = '<b>';
            name+=d.genes.join("</b><br/><b>");
            name+='</b><br/>';
            return name;
        }
    
        {
            var maxCount = d3.max(matrix, function(array) {
            return d3.max(array, function(d,i){
                return d.sum;
                });
            });
        if(maxCount>0)
        {
            cellTd.append("svg").attr("left", 0)
                .attr("class", "cellCount")
                .attr("height", 10)
                .append("rect")
                .attr("height", 10)
                .attr("width",
                    function(d) {
                        if(d.sum!==undefined)
                            return d.sum /maxCount * 80;
                        else
                            return 0;
                    });
            cellTd.on("mouseover", function(d,i) {
            tooltip.html(function() {
            var name = format_name(d);
            return name;
            });
            return tooltip.transition()
                .duration(50)
                .style("opacity", 0.9);
            })
            .on("mousemove", function(d) {
            return tooltip
                    .style("top", (d3.event.pageY-10)+"px")
                    .style("left", (d3.event.pageX+10)+"px");
            })
            .on("mouseout", function(){
                tooltip.style("opacity", 0);
            });
        }
        }
        //var cellDiv = cellTd.append('div');
        //cellDiv.append('input').attr("class","checkBox")
        //                        .attr("id", function(d,i){
        //                        return d.id;
        //                    })
        //        .attr('type','checkbox');
        var cellDiv = cellTd.append('div');
        cellDiv.append('input').attr("class","checkBox")
                .attr("id", function(d,i){
                    return d.id;
                })
                .attr('type','checkbox')
                .on("click", function(d,i) {
                    if(!this.checked )
                    {
                        d3.select("cellTd"+ d.id).attr("class","highlight");
                        this.checked=true;
                    }
                    else
                    {
                        d3.select("cellTd"+ d.id).attr("class","normal");
                        this.checked=false;
                    }
                });
        cellDiv.attr("class","Bcell")
                .append("span")
                .text(function(d) {return d.keys;});
        
        
        

        
    }
    
    function partData(data){
        //console.log('data');
        //console.log(data);
    var sData={}; //0 genes 1 items
    var genes=[];
    var items=[];
    sData.keys=[
        d3.set(data.genes.map(function(d){
            if (d !== "")
                return d;
            return d;
        })).values().sort(function(a,b){ return ( a<b? -1 : a>b ? 1 : 0);}),
        d3.set(data.Items.map(function(d){
            if (d !== "")
                return d;
            return d;})).values().sort(function(a,b){ return ( a<b? -1 : a>b ? 1 : 0);})
        ];
    //initialize the relationship
    //*************************************how to understand?????????????????????????????????????
    sData.data = [
        sData.keys[0].map(
        function(d){
        return sData.keys[1].map( function(v){ return 0; });
        }),
        sData.keys[1].map( function(d){ return sData.keys[0].map( function(v){ return 0; }); })
        ];
    //console.log('sData');
    //console.log(sData);
    
    for(var i=0; i<data.genes.length; ++i)
    {
    var gene =data.genes[i];
    var item =data.Items[i];
    sData.data[0][sData.keys[0].indexOf(gene)][sData.keys[1].indexOf(item)]=1; // The relationship from left to right
    sData.data[1][sData.keys[1].indexOf(item)][sData.keys[0].indexOf(gene)]=1; // The relationship from right to left
    }
    for(var i=0; i<sData.keys[1].length; ++i)
    {
        var obj = {};
        obj.data = sData.data[1][i];
        obj.genes = [];
        for(var j=0; j<obj.data.length; ++j)
        {
            if(obj.data[j]!==0)
                obj.genes.push(sData.keys[0][j]);
        }
        obj.keys = sData.keys[1][i];
        obj.id = "idItem"+i;
        obj.sum = d3.sum(sData.data[1][i]);
        items.push(obj);
    }
    return items;
    }
    
    
}
</script>


<?php
if(isset($_POST["box_submit"])&&isset($_POST["type"])){
      $type=$_POST["type"];
      if (isset($_POST["input_name"])){
        $inputName = $_POST["input_name"];
      }else{
        $inputName = false;
      }
      //echo "<b>You can view gene iterm in graph by the following method!\n</b>";
      //echo "</br></br>";
      $list = $_POST['txt_query'];
      $list = str_replace('"','-',$list);
     //if($type=='entrez'){
      if(empty($list)){
        echo "</br>";
        echo "Your ID list is empty! Please give me your ID!</br>";
        die();
      }
      else{    
        $date=new DateTime();
        $d=$date->getTimestamp();
        $ran=rand(1,50);
        $filename="usrID/id_$d"."_$ran.txt";
        //if we find filename is the same, try to assign a new file name untile it's different.
        while(file_exists($filename)){
          $ran=rand(1,50);
          $filename="usrID/id_$d"."_$ran.txt";
        }
        $filePass="usrID/id_$d"."_$ran";
        $list=trim($list); 
        //only entrez id provided
        echo "</br>";
	echo "<b>Analysis Result:</b></br>";
        echo "<div>Suggestion: if your filtered data is larger than 1000 lines, please use concept map to visuallize!</div></br>";
        echo '<div id="wait"><!-- loading animation --></div>';
        echo "<div>";
        echo "<div id='d3table'></div>";
        echo "</br>";
        echo "<button id='delete'>Delete</button> &nbsp;";
        echo "<button id='view'>View</button> &nbsp;";
        echo "<button id='download'>Download</button> &nbsp;";
        echo "<button id='conceptMap'>Concept_Map View</button>&nbsp;";
        if($type == 'entrez'||$type == 'gene-iterm'){
            echo "<button id='cytoscape'>Cytoscape View</button> &nbsp;";
        }
        
        echo "</div>";
        echo "</br></br></br>";
	
        if($type=='entrez'){

  	//$list_arr = preg_split('/\r\n/', $list);
        $list = preg_replace('/\r\n|\r|\n/',"\n",$list);
        $list_arr=explode("\n",$list);
        foreach ($list_arr as $d) {
        	//echo "----$d-----</br>";
        	$gene=$gene.','.$d;
        }
      	$gene=ltrim($gene,',');
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
        echo exec('perl eGIFT_parser.pl'.' '.$filePass);
        echo "</br>";
         
        $outfile=$filePass.'_gene_iterm.txt';
	
?>

	<script>
	  var fileName = <?php echo "'".$outfile."'"; ?>;
	  loadTable(fileName,true);
          
	</script>
<?php
        //$outfile1=$filePass.'_gene_iterm_modified.txt';
        //echo "<span>Gene Iterm Table:<a href='".$outfile."' target='_blank'><button>View</button></a></span></br>";
        
        }
        // gene-iterm pair provided
        elseif ($type=="gene-iterm"){
          $outfile=$filePass.'_gene_iterm.txt';
          $fh=fopen($outfile,'w') or die ("cannot open this file");
          fwrite($fh,$list);
          fclose($fh);
?>
        <script>
	  var fileName = <?php echo "'".$outfile."'"; ?>;
	  loadTable(fileName,true);
          
	</script>
<?php
	}
        elseif ($type=="custome"){
          $outfile=$filePass.'_custome.txt';
          $fh=fopen($outfile,'w') or die ("cannot open this file");
          fwrite($fh,$list);
          fclose($fh);
?>
        <script>
	  var fileName = <?php echo "'".$outfile."'"; ?>;
	  loadTable(fileName,false);
          
	</script>
<?php            
        }
        

     
   }
}	
elseif(isset($_POST["box_submit"])){
    echo "<script type='text/javascript'> alert('Please select your data type in the radio button!'); location.href = 'index.php'; </script>";
}
else{
    echo "<script type='text/javascript'> alert('Please resubmit your input data'); location.href = 'index.php'; </script>";
}

?>


