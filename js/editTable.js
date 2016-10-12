
function loadTable(fileName, flag_egift, conceptName, fisherFile){   

    // LOADING contents
    var fileName_url = '/webgivi/edittable_output.php?filename='+fileName+'.txt';    
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET" ,fileName_url, false ); // false for synchronous request
    xmlHttp.send( null );
    var filetext = xmlHttp.responseText;
    

    // LOADING blacklist
    var blacklist_url = '/webgivi/blacklist_output.php';    
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET" ,blacklist_url, false ); // false for synchronous request
    xmlHttp.send( null );
    var blacklisttext = xmlHttp.responseText;    


    // LOADING fisherfile contents       
    var fisherfile_url = '/webgivi/fishertest_output.php?filename='+fisherFile;    
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET" ,fisherfile_url, false ); // false for synchronous request
    xmlHttp.send( null );
    var fisherfiletext = xmlHttp.responseText;
    //alert(fisherfiletext);


    //document.getElementById('pvalue').value=fisher;
    //console.log(fisher);
    
    var currentData;
    var originalData;
    var tooltip;
    var rowLength = 4;
    var fileName_txt = '/data/'+fileName+'.txt';
    var blacklistfile = 'blacklist';
    var blacklistfile_txt = '/blacklist/'+blacklistfile+'_terms.txt';
    var blacklistDict = {};
    var currentblacklistData = [];
    var item2categoryDict = {};
    var item2pvalueDict = {};

    

    // listing all blacklist terms in blacklistDict{}
    d3.text(blacklisttext, function (blackItems){
        var lines = blacklisttext.split("\n");
        var skipline = "#TIME:";
        for (var i = 0; i < lines.length; ++i) {
            if (!(lines[i].substring(0, skipline.length) === skipline) && lines[i].trim()){
                blacklistDict[lines[i]]='1';                
            }
        }        
    });


    // listing p-values from fisher test in item2pvalueDict{}
    d3.text(fisherfiletext, function (pvalues){
        var lines = fisherfiletext.split("\n");        
        for (var i = 0; i < lines.length; ++i) {
            if (lines[i].trim()){
                var pairs = lines[i].split("\t");
                item2pvalueDict[pairs[0]]=pairs[1];                                        
            }
        }        
    });
    //console.log(item2pvalueDict);


    // loading the data into currentData
    //d3.text(filetext, function (geneItems) {
    d3.text(filetext, function (dummy) {
        //var datas = geneItems.split("\r\n");
        geneItems = filetext.replace(/\r\n/g, '\n');
        geneItems = geneItems.replace(/\r/g, '\n');
        //var geneItems = filetext.split("\n");

        //console.log(geneItems);
        if (geneItems.indexOf('\t') == -1) {            
            alert('Warning, your data format is wrong or your input IDs are too many, if not, please contact us!');
            location.href = "index.php";
            return;
        }
        
        var datas = geneItems.split("\n");
        var geneItemData = {};
        geneItemData.genes = [];
        geneItemData.Items = [];
        geneItemData.Categories = [];

        for (var i = 0; i < datas.length; ++i) {            
            if (datas[i] == "")
                continue;
            var pairs = datas[i].split("\t");
            if (pairs.length >= 2){
                //if (!(pairs[1] in blacklistDict)){ 
                    geneItemData.genes.push(pairs[0]);
                    geneItemData.Items.push(pairs[1]);  
                    // if category is provided
                    if (pairs.length == 3 && pairs[2]!="") {
                        //var cat = pairs[2];
                        //if (cat==""){ cat = "nocat"; }
                        item2categoryDict[pairs[1]]=pairs[2];
                    }     
                    
                //}
            }else{
                alert('Warning, the line of your input data is not tab delimited:' + datas[i]);
            }

        }
        if (geneItemData.genes.length == 0 || geneItemData.Items.length == 0) {
            alert('The eGIFT result of your input data is empty OR your input data format is not correct OR Your input data is too big!');
            location.href = "index.php";
            return;
        }        
        currentData = partData(geneItemData); //0 genes 1 items
        originalData = partData(geneItemData); //0 genes 1 items

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



    var dataSelect = []; //save all highlighted iTerms



    function refreshTable(Data) {   //Data saves all the existing items in current views //yongnan    

        d3.select("#delete").on("click", function (d) {
            removeFromTable(Data);
            refreshTable(Data);
        });

        //highlight all iterms with the frequency users defined
        function isNumber(obj) {
            return !isNaN(parseFloat(obj))
        };        

        // add/remove blacklist item, depending on flag
        function blacklistFixer(Data,flag){
            //alert(Data);

            if (flag=='exclude'){   
                                 
                d3.selectAll('.checkBox')[0].forEach(function (d, i) {               
                    var currentdata = d3.select("#" + d.id).datum();
                    term = currentdata.keys;
                    if (term in blacklistDict){
                        var index = Data.indexOf(currentdata);
                        if (index > -1) {
                            Data.splice(index, 1);
                            currentblacklistData.push(currentdata);
                        }
                    }
                });
                
                //alert(currentblacklistData);
                //for (var i=0; i<currentblacklistData.length; i++){
                //    alert(currentblacklistData[i].genes);
                //}
            }
            else if (flag=='include') {
                
                for (var i=0; i<currentblacklistData.length; i++){
                    //alert(currentblacklistData[i].genes);
                    Data.push(currentblacklistData[i])
                }
                currentblacklistData = [];                
            }

            //rewrite data to the gene iterm file            
            var saveString = "";
            for (var i = 0; i < Data.length; ++i) {
                for (var j = 0; j < Data[i].genes.length - 1; ++j) {
                    if (Data[i].genes[j] !== "") {
                        saveString += Data[i].genes[j];
                        saveString += "\t";
                        saveString += Data[i].keys;
                        saveString += "\n";
                    }
                }

                saveString += Data[i].genes[Data[i].genes.length - 1];
                saveString += "\t";
                saveString += Data[i].keys;
                saveString += "\n";
            }

            $.ajax({
                url: 'update.php',
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

            sortObjByAlpha(Data);
            refreshTable(Data);         

        };


        // remove the selected items from table
        function removeFromTable(Data) {
            //alert(Data);
            d3.selectAll('.checkBox')[0].forEach(function (d, i) {                    
                    if (d.checked) {
                        var currentdata = d3.select("#" + d.id).datum();                        
                        var index = Data.indexOf(currentdata);
                        if (index > -1) {
                            Data.splice(index, 1);
                        }
                    }                    
                });
            //alert(Data);

            //rewrite data to the gene iterm file????reloadTable???????????????????????????????????????????????
            var saveString = "";
            for (var i = 0; i < Data.length; ++i) {
                for (var j = 0; j < Data[i].genes.length - 1; ++j) {
                    if (Data[i].genes[j] !== "") {
                        saveString += Data[i].genes[j];
                        saveString += "\t";
                        saveString += Data[i].keys;
                        saveString += "\n";
                    }
                }

                saveString += Data[i].genes[Data[i].genes.length - 1];
                saveString += "\t";
                saveString += Data[i].keys;
                saveString += "\n";
            }

            $.ajax({
                url: 'update.php',
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
        };

        // record in blacklist 
        function recordBlacklist(Data) {
            var blacklistTerms = [];
            var blacklistData = [];

            d3.selectAll('.checkBox')[0].forEach(function (d, i) {
                if (d.checked) {
                    var currentdata = d3.select("#" + d.id).datum();
                    blacklistData.push(currentdata);
                    var index = Data.indexOf(currentdata);

                    for (var i = 0; i < currentdata.genes.length; i++) {
                        if (currentdata.genes[i] !== "") {
                            //alert(currentdata.keys);                       
                            blacklistTerms.push(currentdata.keys);
                        }
                    }  
                }                  
            });

            //rewrite data to the gene iterm file???????????????????????????????????????????????????
            var saveString = "";
            for (var i = 0; i < blacklistData.length; ++i) {
                for (var j = 0; j < blacklistData[i].genes.length - 1; ++j) {
                    if (blacklistData[i].genes[j] !== "") {
                        saveString += blacklistData[i].genes[j];
                        saveString += "\t";
                        saveString += blacklistData[i].keys;
                        saveString += "\n";
                    }
                }

                saveString += blacklistData[i].genes[blacklistData[i].genes.length - 1];
                saveString += "\t";
                saveString += blacklistData[i].keys;
                saveString += "\n";
            }

            //alert(saveString);
            //alert(blacklistfile);
            $.ajax({
                url: 'blacklist.php',
                type: "POST",
                data: {
                    txt: saveString,
                    fileName: blacklistfile
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

            //alert(blacklistTerms.length);
            //for (index = 0; index < blacklistData.length; index++) {
            //    alert(blacklistData[index])
            //}
        };


        // define cutoff to highlight all iTerms
        $("#select_freq").click(function () {
            var input_freq = $("#input_freq").val();
            if (!isNumber(input_freq)) {
                alert("Please your input data type should be number!");
                return;
            }

            for (var i = 0; i < Data.length; ++i) {
                d3.select("#" + Data[i].id).property('checked', false);
                d3.select("#cellTd" + Data[i].id).attr("class", "normal");
            }
            dataSelect = [];
            
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
            else if (this.value == 'cat') {
                //console.log('click cat');
                //sort Data based on freq
                sortObjByCat(Data);                
                refreshTable(Data);

            }
            else if (this.value == 'pval') {
                //console.log('click cat');
                //sort Data based on freq
                sortObjByPval(Data);                
                refreshTable(Data);
            }
            else {
                //console.log('click alpha');
                //sort based on alphabetical order of iTerms
                sortObjByAlpha(Data);
                refreshTable(Data);
            }

        });

        // delete options dropdown menu : ASHIQUE
        $('#showTable').change(function () {
            if (this.value == 'showall') {                 
                //reloadTable(Data);   
                //loadTable(fileName, flag_egift, conceptName);
                //$("#clear").click();            
                $('#showTable').prop('selectedIndex', 0);      
            }
            else if (this.value == 'remove') {
                removeFromTable(Data);                
                $('#showTable').prop('selectedIndex', 0);                
            }
            else if (this.value == 'none') {
                $('#showTable').prop('selectedIndex', 0);
            }
            else {             
                //alert("Remove and blacklist");
                recordBlacklist(Data);              
                removeFromTable(Data);                
                $('#showTable').prop('selectedIndex', 0);            
            }

        });

        $('#blacklistfilter').change(function() {
            if ($(this).is(':checked')) { // checked, inclde blacklisted items                
                blacklistFixer(Data,"include");                
            }
            else{   // not checked, remove blacklisted items                            
                blacklistFixer(Data,"exclude");           
            }
        });

        function sortObjByFreq(Data) {
            var swapped;
            do {
                swapped = false;
                for (var i = 0; i < Data.length - 1; ++i) {
                    if (Data[i].sum < Data[i + 1].sum) {
                        var tmp = Data[i];
                        Data[i] = Data[i + 1];
                        Data[i + 1] = tmp;
                        swapped = true;
                    }
                }
            } while (swapped)
        }

        function sortObjByCat(Data) {
            //console.log("cat");
            var swapped;
            do {
                swapped = false;
                for (var i = 0; i < Data.length - 1; ++i) {
                    if (Data[i].cat < Data[i + 1].cat) {
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

        function sortObjByPval(Data) {
            var swapped;
            do {
                swapped = false;
                for (var i = 0; i < Data.length - 1; ++i) {
                    if (Data[i].pvalue > Data[i + 1].pvalue) {
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

        $("#selectall").off().click(function () {
            for (var i = 0; i < Data.length; ++i) {
                d3.select("#" + Data[i].id).property('checked', true);
                d3.select("#cellTd" + Data[i].id).attr("class", "highlight");
            }
            dataSelect = [];
        });

        $("#toggle").off().click(function () {
            for (var i = 0; i < Data.length; ++i) {
                if ($("#" + Data[i].id).is(':checked')){
                    d3.select("#" + Data[i].id).property('checked', false);
                    d3.select("#cellTd" + Data[i].id).attr("class", "normal");
                }
                else{
                    d3.select("#" + Data[i].id).property('checked', true);
                    d3.select("#cellTd" + Data[i].id).attr("class", "highlight");
                }               
            }
            dataSelect = [];
        });

        $("#reset").off().click(function () {            
            window.location.reload();           
        });

                

        //make sure data is rewrite successfully, and then we can use visualize the data
        var fileNameDir = '/var/www/data/'+fileName+'.txt';
        $("#view").off().click(function () {   
            window.open('view.php?fileName=' + fileName, '_blank');
            //window.open(fileNameDir);
        });
        $("#cytoscape").off().click(function () {
            window.open('cytoscape.php?fileName=' + fileName, '_blank');
        });
        $('#conceptMap').off().click(function () {

            window.open('conceptMap.php?fileName=' + fileName + '&flag_egift=' + flag_egift + '&conceptName=' + conceptName, '_blank');

        });
        $('#download').off().click(function () {
            window.location.href = "download.php?path=" + fileNameDir;
        });

        $("#editblacklist").off().click(function () {
            window.open('editblacklist.php', '_blank');
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
            //alert(currentData.splice(0, rowLength));
        }
// ***********************how to understand clone function********************************
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
            var copy = obj.constructor();     //copy 
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr))
                    copy[attr] = obj[attr];//copy 
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
            name += 'p='+d.pvalue+'<br/>';
            name += d.genes.join("</b><br/><b>");
            name += '</b><br/>';
            return name;
        }

        {               
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
                                return d.sum / maxCount * 80;    
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
        var cellDiv = cellTd.append('div');    //table 中放checkbox
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
                    if (d.cat==""){ return d.keys +' (no category)'; }
                    else{ return d.keys +' ('+ d.cat+')'; }
                });

        // add highlight by checking the array  : below is disabled by ASHIQUE, creates problem with
        // (i) first show all and then (ii) remove and blacklist the already selected ones
        
        dataSelect = d3.set(dataSelect).values();
        for (var i = 0; i < dataSelect.length; i++) {
            d3.select("#" + dataSelect[i]).property('checked', true);
            d3.select("#cellTd" + dataSelect[i]).attr("class", "highlight");
        } // */
    }
    function partData(data) {   

        var sData = {}; //0 genes 1 items
        var sData1 = {}; //0 genes 1 items
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
                    }),
            d3.set(data.Categories.map(function (d) {
                if (d !== "")
                    return d;
                return d;
            })).values().sort(function (a, b) {
                        return ( a < b ? -1 : a > b ? 1 : 0);
                    })
        ];
        //console.log(sData.keys[2]);
        //console.log(sData.keys);
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

        //console.log(sData.keys[2]);

        for (var i = 0; i < data.genes.length; ++i) {
            var gene = data.genes[i];
            var item = data.Items[i];
            var category = data.Categories[i];
            //console.log(sData.keys[1].indexOf(item));
            sData.data[0][sData.keys[0].indexOf(gene)][sData.keys[1].indexOf(item)] = 1; // The relationship from left to right
            sData.data[1][sData.keys[1].indexOf(item)][sData.keys[0].indexOf(gene)] = 1; // The relationship from right to left
            //sData.data[2][sData.keys[1].indexOf(item)][sData.keys[2].indexOf(category)] = 1; // The relationship from right to left
        }

        //console.log(item2pvalueDict);
        for (var i = 0; i < sData.keys[1].length; ++i) {
            var obj = {};
            obj.data = sData.data[1][i];
            obj.genes = [];
            for (var j = 0; j < obj.data.length; ++j) {
                if (obj.data[j] !== 0)
                    obj.genes.push(sData.keys[0][j]);
            }

            // iTerm category
            if (sData.keys[1][i] in item2categoryDict){
                //obj.keys = sData.keys[1][i] + ' ('+item2categoryDict[sData.keys[1][i]]+')';
                obj.keys = sData.keys[1][i];
                obj.cat = item2categoryDict[sData.keys[1][i]];
            }else{
                //obj.keys = sData.keys[1][i] + ' (no category)';
                obj.keys = sData.keys[1][i];
                obj.cat = "";
            }

            // p-values from fisher test
            //for (var key in item2pvalueDict) {
            //    console.log(key);
            //    console.log(item2pvalueDict[key]);
            //}
            

            //console.log(sData.keys[1][i]);
            if (sData.keys[1][i] in item2pvalueDict){
                //console.log("yes");
                //obj.keys = obj.keys + " - "+ item2pvalueDict[sData.keys[1][i]];
                obj.pvalue = parseFloat(item2pvalueDict[sData.keys[1][i]]);
            }else{
                //obj.keys = obj.keys;
                obj.pvalue = parseFloat(-1.0);
            }
            
            obj.id = "idItem" + i;
            obj.sum = d3.sum(sData.data[1][i]);

            items.push(obj);
        }
        return items;
    }
}
