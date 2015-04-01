<?php
//**************************************************
// API 1: submit all IDs to WebGIVI API (filter Table)
// 2015-03-22
//**************************************************
session_start();
require_once ('display_fns.php');
display_header();
?>

<script>
function loadTable(fileName, flag_egift, conceptName) {
    var currentData;
    var tooltip;
    var rowLength = 4;
    console.log(fileName);
    d3.text(fileName, function (geneItems) {
        //var datas = geneItems.split("\r\n");
        geneItems = geneItems.replace(/\r\n/g, '\n');
        geneItems = geneItems.replace(/\r/g, '\n');
        console.log(geneItems);
        if (geneItems.indexOf('\t') == -1) {
            //alert('Warning, your data format is wrong or your input IDs are too many, if not, please contact us!');
            //location.href = "index.php";
            return;
        }

        
        var datas = geneItems.split("\n");

        var geneItemData = {};
        geneItemData.genes = [];
        geneItemData.Items = [];
        for (var i = 0; i < datas.length; ++i) {
            if (datas[i] == "")
                continue;
            var pairs = datas[i].split("\t");
            if (pairs.length == 2){
                geneItemData.genes.push(pairs[0]);
                geneItemData.Items.push(pairs[1]);
            }else{
                alert('Warning, the line of your input data is not tab delimited:' + datas[i]);
            }

        }
        if (geneItemData.genes.length == 0 || geneItemData.Items.length == 0) {
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
        console.log('datas2');
    });

    var dataSelect = []; //save all highlighted iTerms
        console.log('datas3');
    function refreshTable(Data) {   //Data saves all the existing items in current views //yongnan
        d3.select("#delete").on("click", function (d) {
            d3.selectAll('.checkBox')[0].forEach(function (d, i) {
                if (d.checked) {
                    var currentdata = d3.select("#" + d.id).datum();
                    var index = Data.indexOf(currentdata);
                    if (index > -1) {
                        Data.splice(index, 1);
                    }
                }
            });
        console.log('datas4');
            //rewrite data to the gene iterm file???????????????????????????????????????????????????
            var saveString = "";
            for (var i = 0; i < Data.length; ++i) {
                for (var j = 0; j < Data[i].genes.length - 1; ++j) {
                    if (Data[i].genes[j] !== "") {
                        saveString += Data[i].genes[j];
                        saveString += "\t";
                        saveString += Data[i].keys
                        saveString += "\n";
                    }
                }

                saveString += Data[i].genes[Data[i].genes.length - 1];
                saveString += "\t";
                saveString += Data[i].keys
                saveString += "\n";
            }


            $.ajax({
                url: 'rewrite.php',
                type: "POST",
                data: {
                    txt: saveString,
                    fileName: fileName
                },
                dataType: "text",
                beforeSend: function () {
                    $('#wait').show();
                },
                success: function () {
                    $('#wait').hide();
                },
                error: function () {
                    $('#wait').hide();
                    alert("failure");
                }


            });

            refreshTable(Data);

        });

        //highlight all iterms with the frequency users defined
        function isNumber(obj) {
            return !isNaN(parseFloat(obj))
        };
        // define cutoff to highlight all iTerms
        $("#select_freq").click(function () {
            var input_freq = $("#input_freq").val();
            if (!isNumber(input_freq)) {
                alert("Please your input data type should be number!");
                return;
            }
            //console.log(Data);
            for (var i = 0; i < Data.length; ++i) {
                if (Data[i].sum <= input_freq) {
                    d3.select("#" + Data[i].id).property('checked', true);
                    d3.select("#cellTd" + Data[i].id).attr("class", "highlight");
                    dataSelect.push(Data[i].id);
                }
            }

        });


        // sort based on alphebetical or frequency.
        $('#sortTable').change(function () {
            if (this.value == 'freq') {
                //console.log('click freq');
                //sort Data based on freq
                sortObjByFreq(Data);
                refreshTable(Data);

            }
            else {
                //console.log('click alpha');
                //sort based on alphabetical order of iTerms
                sortObjByAlpha(Data);
                refreshTable(Data);
            }

        });

        function sortObjByFreq(Data) {
            var swapped;
            do {
                swapped = false;
                for (var i = 0; i < Data.length - 1; ++i) {
                    if (Data[i].sum > Data[i + 1].sum) {
                        var tmp = Data[i];
                        Data[i] = Data[i + 1];
                        Data[i + 1] = tmp;
                        swapped = true;
                    }
                }
            } while (swapped)
        }

        function sortObjByAlpha(Data) {
            var swapped;
            do {
                swapped = false;
                for (var i = 0; i < Data.length - 1; ++i) {
                    if (Data[i].keys > Data[i + 1].keys) {
                        var tmp = Data[i];
                        Data[i] = Data[i + 1];
                        Data[i + 1] = tmp;
                        swapped = true;
                    }
                }
            } while (swapped)
        }


        $("#clear").off().click(function () {
            for (var i = 0; i < Data.length; ++i) {
                d3.select("#" + Data[i].id).property('checked', false);
                d3.select("#cellTd" + Data[i].id).attr("class", "normal");
            }
            dataSelect = [];
        });

        //make sure data is rewrite successfully, and then we can use visualize the data
        $("#view").off().click(function () {
            window.open(fileName);
        });
        $("#cytoscape").off().click(function () {
            window.open('biolayout3.php?fileName=' + fileName, '_blank');
        });
        $('#conceptMap').off().click(function () {

            window.open('conceptMap.php?fileName=' + fileName + '&flag_egift=' + flag_egift + '&conceptName=' + conceptName, '_blank');

        });
        $('#download').off().click(function () {
            window.location.href = "download.php?path=" + fileName;
        });


        var margin = {top: 20, right: 10, bottom: 30, left: 10},
                width = 800 - margin.left - margin.right,
                height = 200 - margin.top - margin.bottom;
        if (d3.select('#d3table').select('table')) {
            d3.select('#d3table').select('table').remove();
        }
        var table = d3.select('#d3table').append("table")
            //.attr("width", width + margin.left + margin.right);
                .attr("height", height + margin.top + margin.bottom);
        table.append("tbody");
        var matrix = [];
        var currentData = clone(Data);
        //click visualize tool, then save the data into usrID folder

        while (currentData.length) {
            matrix.push(currentData.splice(0, rowLength));
        }
// ***********************how to understand clone function********************************
        //??????? ???????????????
        //?????????????number string boolean object undefined: Array ? Object ?? Object?
        //  ???????????
//        function clone(obj){
//            var o;
//            switch(typeof obj){
//                case 'undefined': break;
//                case 'string'   : o = obj +' ';break;
//                case 'number'   : o = obj - 0;break;
//                case 'boolean'  : o = obj;break;
//                case 'object'   :
//                    if(obj === null){
//                        o = null;
//                    }else{
//                        if(obj instanceof Array){
//                            o = [];
//                            for(var i = 0, len = obj.length; i < len; i++){
//                                o.push(clone(obj[i]));
//                            }
//                        }else{
//                            o = {};
//                            for(var k in obj){
//                                o[k] = clone(obj[k]);
//                            }
//                        }
//                    }
//                    break;
//                default:
//                    o = obj;break;
//            }
//            return o;
//        }
        function clone(obj) {       //
            if (null == obj || "object" != typeof obj)
                return obj;
            var copy = obj.constructor();     //copy ??
            for (var attr in obj) {//??(Object)???for in ?? ????? ? for( ; ; )??
                if (obj.hasOwnProperty(attr))
                    copy[attr] = obj[attr];//copy ????
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
                }).attr("width", 80);
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

        cellTd.attr("id",function (d, i) {
            return "cellTd" + d.id;
        }).on("click", function (d, i) {
                    if (!d3.select("#" + d3.select(this).datum().id).node().checked) {
                        d3.select(this).attr("class", "highlight");
                        d3.select("#" + d3.select(this).datum().id).property('checked', true);
                        dataSelect.push(d.id);
                    }
                    else {
                        d3.select(this).attr("class", "normal");
                        d3.select("#" + d3.select(this).datum().id).property('checked', false);
                        dataSelect = d3.set(dataSelect).values();
                        var index = dataSelect.indexOf(d.id);
                        if (index > -1) {
                            dataSelect.splice(index, 1);
                        }
                    }
                });


        function format_name(d) {
            var name = '<b>';
            name += d.genes.join("</b><br/><b>");
            name += '</b><br/>';
            return name;
        }

        {               //table???? ?
            var maxCount = d3.max(matrix, function (array) {
                return d3.max(array, function (d, i) {
                    return d.sum;
                });
            });
            if (maxCount > 0) {
                cellTd.append("svg").attr("left", 0)
                        .attr("class", "cellCount")
                        .attr("height", 10)
                        .append("rect")
                        .attr("height", 10)
                        .attr("width",
                        function (d) {
                            if (d.sum !== undefined)
                                return d.sum / maxCount * 80;    //??????????????????why 80??????????
                            else
                                return 0;
                        });
                cellTd.on("mouseover", function (d, i) {
                    tooltip.html(function () {
                        var name = format_name(d);
                        return name;
                    });
                    return tooltip.transition()
                            .duration(50)
                            .style("opacity", 0.9);
                })
                        .on("mousemove", function (d) {
                            return tooltip
                                    .style("top", (d3.event.pageY - 10) + "px")
                                    .style("left", (d3.event.pageX + 10) + "px");
                        })
                        .on("mouseout", function () {
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
        var cellDiv = cellTd.append('div');    //table ??checkbox
        cellDiv.append('input').attr("class", "checkBox")
                .attr("id", function (d, i) {
                    return d.id;
                })
                .attr('type', 'checkbox')
                .on("click", function (d, i) {
                    if (!this.checked) {
                        d3.select("cellTd" + d.id).attr("class", "highlight");
                        this.checked = true;
                        dataSelect.push(d.id);
                    }
                    else {
                        d3.select("cellTd" + d.id).attr("class", "normal");
                        this.checked = false;
                        dataSelect = d3.set(dataSelect).values();
                        var index = dataSelect.indexOf(d.id);
                        if (index > -1) {
                            dataSelect.splice(index, 1);
                        }
                    }
                });
        cellDiv.attr("class", "Bcell")
                .append("span")
                .text(function (d) {
                    return d.keys;
                });

        // add hight by checking the array
        dataSelect = d3.set(dataSelect).values();
        for (var i = 0; i < dataSelect.length; i++) {
            d3.select("#" + dataSelect[i]).property('checked', true);
            d3.select("#cellTd" + dataSelect[i]).attr("class", "highlight");
        }
    }
    function partData(data) {     //???????????

        var sData = {}; //0 genes 1 items
        var genes = [];
        var items = [];
        sData.keys = [
            d3.set(data.genes.map(function (d) {
                if (d !== "")
                    return d;
                return d;
            })).values().sort(function (a, b) {
                        return ( a < b ? -1 : a > b ? 1 : 0);
                    }),
            d3.set(data.Items.map(function (d) {
                if (d !== "")
                    return d;
                return d;
            })).values().sort(function (a, b) {
                        return ( a < b ? -1 : a > b ? 1 : 0);
                    })
        ];

        //initialize the relationship
        //*************************************
        sData.data = [                 
            sData.keys[0].map(
                    function (d) {
                        return sData.keys[1].map(function (v) {
                            return 0;
                        });
                    }),
            sData.keys[1].map(function (d) {
                return sData.keys[0].map(function (v) {
                    return 0;
                });
            })
        ];


        for (var i = 0; i < data.genes.length; ++i) {
            var gene = data.genes[i];
            var item = data.Items[i];
            sData.data[0][sData.keys[0].indexOf(gene)][sData.keys[1].indexOf(item)] = 1; // The relationship from left to right
            sData.data[1][sData.keys[1].indexOf(item)][sData.keys[0].indexOf(gene)] = 1; // The relationship from right to left
        }
        for (var i = 0; i < sData.keys[1].length; ++i) {
            var obj = {};
            obj.data = sData.data[1][i];
            obj.genes = [];
            for (var j = 0; j < obj.data.length; ++j) {
                if (obj.data[j] !== 0)
                    obj.genes.push(sData.keys[0][j]);
            }
            obj.keys = sData.keys[1][i];
            obj.id = "idItem" + i;
            obj.sum = d3.sum(sData.data[1][i]);
            items.push(obj);
        }
        return items;
    }
}
</script>

<?php
$data_string=array();

#Webgivi api without usrID folder which have the full permission
$type = $_GET['type'];

#get the similar php function to process the data and filter out category
#1.categories
echo "</br><div id='main'>";
echo "<b>Analysis Result:</b></br>";
echo "<div>Suggestion: if your filtered data is larger than 1000 lines, please use concept map to visuallize!</div></br>";
echo '<div id="wait"><!-- loading animation --></div>';
echo "<div>";
echo "Sort: <select id='sortTable'><option value='alph'>alphabetical</option><option value='freq'>frequency</option></select> &nbsp;&nbsp;&nbsp;&nbsp;";
echo "Frequency: <= <input id='input_freq' type='text' size=3 value='0' > <button id='select_freq'>Select</button>&nbsp;&nbsp;&nbsp;&nbsp;";
echo "Selection: <button id='clear'>Clear</button>&nbsp;&nbsp;&nbsp;&nbsp;";
echo "</br></br>";
echo "<button id='delete'>Delete</button> &nbsp;";
echo "<button id='view'>View</button> &nbsp;";
echo "<button id='download'>Download</button> &nbsp;";
echo "<button id='conceptMap'>Concept_Map View</button>&nbsp;";
        
if($type == 'entrez'||$type == 'gene-iterm'){
    echo "<button id='cytoscape'>Cytoscape View</button> &nbsp;";
}
echo "</br></br>";
echo '<div style="height: 700px; width: 1250px; overflow: scroll;">';
echo "<div id='d3table'></div>";

echo '</div>';

echo "</div>";
echo "</br></br></br>";

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

#print out all ID and iterms
if($type=='entrez'){
  $gene=implode(",", $_SESSION['missingID']);
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
	  loadTable(fileName,true,'gene2iTerm');
	</script>
        
<?php       
}else{
          $outfile=$filePass.'_custome.txt';
          $list='';
          $pathway2symbol = unserialize($_SESSION['symbol2pathway']);
          foreach($pathway2symbol as $pair){
    
            //echo $pair[0].'*'.$pair[1];
            
            $list = $list.implode("\t", $pair)."\n";
            //$list = $list.$line;
          }
          
          //echo $list;
          $fh=fopen($outfile,'w') or die ("cannot open this file");
          fwrite($fh,$list);
          fclose($fh);
?>
        <script>
	  var fileName = <?php echo "'".$outfile."'"; ?>;
          var conceptName = <?php echo "'".$conceptName."'"; ?>;
	  loadTable(fileName,false,'gene2pathway');
          
	</script>
<?php
}
?>