<!DOCTYPE html>
<html>
<head>
<meta name="description" content="[Visual style example]" />
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
<meta charset=utf-8 />
<title>Visual style example</title>
  <!--<script src="http://cytoscape.github.io/cytoscape.js/api/cytoscape.js-latest/cytoscape.min.js"></script>-->
  <script src="cytoscape/cytoscape.min.js"></script>
  <script type="text/javascript" src="cytoscape/arbor.js"></script>
  <!--<script type="text/javascript" src="http://cytoscape.github.io/cytoscape.js/api/cytoscape.js-latest/arbor.js"></script>-->
  <script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
  <link rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css"/>
  <link rel="stylesheet" href="css-ui/jquery-ui.css"/>
  <!--<link rel="stylesheet" href="/resources/demos/style.css"/>-->
<?php
  $fileName=$_GET['fileName'];
  //$fileName="usrID/id_1378400413_14_gene_iterm.txt";
  echo '<script src="data.php?fileName='.$fileName.'"></script>';
?>


<script>
  $(function(){    
      $( "#menu" ).menu({
      select: function( event, ui ) {
      //console.log(ui.item.text());
      if(ui.item.text()=='Diagram'){
        $( "#dialog" ).dialog({ position: 'left top',width:250});
        }
      else if(ui.item.text()=='Layout'){
        $( "#dialog-layout" ).dialog({ position: 'left top',width:250});
        }
      //else if(ui.item.text()=='Tool'){
      else if(ui.item.text()=='Tool'){
        //uncheck all the check box
        $('#showNode2').prop('checked', false);
        $( "#dialog-tool" ).dialog({ position: 'left top',width:250});
        //console.log('Liang');
        }
        //alert(ui.item.text());
        }
      
      });
    
    var cy = $("#cy").cytoscape("get"); 
    //global variable
    //var selectAll;
    var selectedNode=cy.collection();
    var intersectedNode=cy.collection();
    var flag=0;
    var target;
      //cy.layout({ name: 'arbor' });
    
   // trigger layout method
    $( ".target" ).change(function () {
      $var=$( "select option:selected" ).val();
      if ($var=='tree'){
        cy.layout({ name: 'breadthfirst', fit:false, directed: true,padding: 0 });
      }
      else if ($var=='random'){
        cy.layout({ name: 'random' });
      }
      else if ($var=='circle'){
        cy.layout({ name: 'circle', fit: true});
      }
      else{
        cy.layout({ name: 'arbor',liveUpdate: true});
      }
      //console.log($var);
    });
    
    //cy.elements().unselectify();

    // ********left click node**************

    cy.on('tap', 'node', function(e){
      var node = e.cyTarget;
      //selectAll = cy.collection();
      var neighborhood = node.neighborhood().add(node);

      //console.log('neighborhood:'+neighborhood.data());
      
      if(flag==0 || flag==1){
        intersectedNode=neighborhood.intersect(selectedNode);
      }
      else{
        intersectedNode=neighborhood.intersect(intersectedNode);
      }
      
      
      //console.log(intersectedNode.length);
      
      if (intersectedNode.length){
        intersectedNode.removeClass('intersect');
      }
      
      selectedNode=selectedNode.add(neighborhood);
      
      
      cy.elements().addClass('faded');

            
      //neighborhood.removeClass('faded');
      selectedNode.removeClass('faded');
      
      intersectedNode.addClass('intersect');
      //cy.$('.faded').css('text-opacity',0.2);
      //console.log(cy.$('.faded').css()['text-opacity'] );
      
      flag++;
    }); 

    //2.tap and dialog

    cy.on('cxttap','node',function(e) {
      //var target = e.cyTarget;
      target = e.cyTarget;
      
      target.addClass('rightClick');
      
      //go to check this gene or iterm in NCBI
      $("#ncbi").attr("href","http://www.ncbi.nlm.nih.gov/pubmed/?term="+target.id());
      //$('a').attr("href", "/search/?what=parks&city=" + newCity);
      
      $("#dialog-rightClick").dialog({
        width:250,
        title:target.id(),
        //to do:very close to clicked node
        position:{my: 'left',at: 'right',of:e}
        //position:{e.pageX+3, e.pageY+3}
        //to do: provide different link based on different clicked node, something like html.write to change div text.
        
      });
      //uncheck all the check box
      $('#hdNode').prop('checked', false);
      $('#showNode').prop('checked', false);
      
      $('#hdNode').change(function(){
          if(this.checked){
          
      //    for (var i=0;i<target.length;i++)
      //{
      //  console.log(target[i].data());
      //  }
            target.hide();
            //e.cyTarget.hide();
            
          }
          else{
            target.show();
          }
        });
      $('#showNode').change(function(){
          if(this.checked){
            //console.log(target);
            cy.$().show();
          }
          else {
             target.hide();
          }

        });
      $('#rmNode').click(function(){
          cy.remove(target);
          //cy.$(':selected').remove();
          //remove all the edge and node from all selected node
          selectedNode.each(function(i,ele){
            if(ele.group()=='edges'){
              if(ele.data()['source']==target.id() || ele.data()['target']==target.id() ){
                selectedNode = selectedNode.not(ele);
              }
            }
          });
          selectedNode = selectedNode.not(target);
          //intersectedNode = intersectedNode.not(target);
          
          //selectAll.each(function(i,ele){
          //  if(ele.group()=='edges'){
          //    if(ele.data()['source']==target.id() || ele.data()['target']==target.id() ){
          //      selectAll = selectAll.not(ele);
          //    }
          //  }
          //});
          //selectAll = selectAll.not(target);
          
      });
      
    });
    
    
      $('#showNode2').change(function(){
          if(this.checked){
            //console.log(target);
            cy.$().show();
          }
          else {
            target.hide();
          }

        }); 
    // right click edge to get the gene-iterm pair in NCBI
    var target_edge;
    cy.on('click','edge',function(e) {
      //console.log('I am here');
      target_edge = e.cyTarget;
      //console.log(target_edge.data()['source']);
      
      $("#ncbi-edge").attr("href","http://www.ncbi.nlm.nih.gov/gquery/?term="+target_edge.data()['source']+'+'+target_edge.data()['target']);
      $("#egift-edge").attr("href","http://biotm.cis.udel.edu/udelafc/getSentencePage.php?user=liang&pass=SentencesForLiang&redirect=yes&gene="+target_edge.data()['source']+"&term="+target_edge.data()['target'].toLowerCase());
      $("#dialog-edgeClick").dialog({
        width:250,
        title:target_edge.data()['source']+'-'+target_edge.data()['target'],
        //to do:very close to clicked node
        position:{my: 'left',at: 'right',of:e}
        //position:{e.pageX+3, e.pageY+3}
        //to do: provide different link based on different clicked node, something like html.write to change div text.
        
      }); 
    });
    
    
    
    
    //click the background of the graph.
    cy.on('tap', function(e){
      if( e.cyTarget === cy ){
        //cy.nodes().unselect();
        selectedNode= cy.collection();
        //selectAll = cy.collection();
        intersectedNode=null;
        flag=0;
        cy.elements().removeClass('faded');
        cy.elements().removeClass('intersect');
        cy.elements().removeClass('rightClick');
      }
    });
    //save image as PNG
      $("#save-right").click(function () {
      $.post("save.php", {data: cy.png(),type:"image"}, function (file) {
        window.location.href =  "download.php?path="+ file
        });
      //zero selected node;
      //selectedNode=cy.collection();
      //cy.layout('arbor');
      //location.reload();
      //cy.load([{data: { id: 'foo' }, group: 'nodes'}, {data: { id: 'bar' },group: 'nodes'}, { data: { id: "e1", source: "n1", target: "n2" }, group: "edges" }]);
       
    });
    //save subset of the graph data
    $('#subset').click(function(){
      //var subset_array=new array();
      var subset_string='';
      //console.log(selecAll);
      //console.log('I am here\n'+selectedNode);
      //if (selectAll.length){
      //  selectAll.each(function(i,ele){
      //  //console.log(ele.data()['source']+'\n');
      //    if(ele.group()=='edges'){
      //     subset_string = subset_string+ele.data()['source']+'\t'+ele.data()['target']+'\n';
      //    }
      //  });
      //}
      //else{
      if (selectedNode.length){
        selectedNode.each(function(i,ele){
          //console.log(ele.group());
          //console.log(ele.data()['source']+'\n');
          if(ele.group()=='edges'){
            subset_string = subset_string+ele.data()['source']+'\t'+ele.data()['target']+'\n';
          }
        });

        $.post("save.php",{data:subset_string,type:"subset"},function(file){
          window.location.href = "download.php?path="+ file
        });
              
      }else{
        alert("You don't select any nodes or edges!");
      }
     // }
    });
    
    //subset the selected nodes and edges
    $('#subset_graph').click(function(){
      
        //cy.load([{data: { id: 'foo' }, group: 'nodes'}, {data: { id: 'bar' },group: 'nodes'}]);   { data: { id: "e1", source: "n1", target: "n2" }, group: "edges" }
        var subset_json='[';
        //console.log(selectedNode);
        if (selectedNode.length){
          //console.log("I am here1!");
            selectedNode.each(function(i,ele){
            //console.log(ele+'--'+ele.group());
            if(ele.group()=='nodes'){
              if(ele.data()['borderColor']){
                subset_json = subset_json + '{ data: {id:"'+ele.data()['id']+'",faveColor:"'+ele.data()['faveColor']+'",borderColor:"'+ele.data()['borderColor'];
                subset_json = subset_json + '",width:"'+ele.data()['width']+'",height:"'+ele.data()['height']+'"},group:"nodes"},';
              }else{
                subset_json = subset_json + '{ data: {id:"'+ele.data()['id']+'",faveColor:"'+ele.data()['faveColor']+'"},group:"nodes"},';
              }
            }
            if(ele.group()=='edges'){
              subset_json = subset_json + '{ data: {id:"'+ele.data()['id']+'", source:"'+ele.data()['source']+'",target:"'+ele.data()['target']+'"},group:"edges"},';
            }
            
            //console.log(subset_json+ele.json()['data']);
          });
           subset_json=subset_json+']';
        //var json=new array();
        //var json='[{ data: {id:"oxid"},group:"nodes"},{ data: {id:"e40", source:"HK1",target:"oxid"},group:"edges"},{ data: {id:"skeletal muscles"},group:"nodes"},{ data: {id:"e41", source:"HK1",target:"skeletal muscles"},group:"edges"},{ data: {id:"atp"},group:"nodes"},{ data: {id:"e42", source:"HK1",target:"atp"},group:"edges"},{ data: {id:"mitochondria"},group:"nodes"},{ data: {id:"e43", source:"HK1",target:"mitochondria"},group:"edges"},{ data: {id:"mitochondrial"},group:"nodes"},{ data: {id:"e44", source:"HK1",target:"mitochondrial"},group:"edges"},{ data: {id:"metabolism"},group:"nodes"},{ data: {id:"e45", source:"HK1",target:"metabolism"},group:"edges"},{ data: {id:"rat"},group:"nodes"},{ data: {id:"e46", source:"HK1",target:"rat"},group:"edges"},{ data: {id:"binding"},group:"nodes"},{ data: {id:"e47", source:"HK1",target:"binding"},group:"edges"},{ data: {id:"HK1"},group:"nodes"},]';
        //var json='[{ data: {"id":"oxid"},group:"nodes"}]';
        //subset_json=jQuery.parseJSON('[{ data: {id:"extracellular"},group:"nodes"}]');
        
          var obj=eval("("+subset_json+")");
          //var json_string=JSON.stringify(json);
          //var obj=jQuery.parseJSON(json_string);
          
          //var json=cy.$(':selected').json()
          //console.log(json);
          
          cy.load(obj);
          
          //try to zero selected node collection after load subset.
          selectedNode=cy.collection();
          flag=0;
            
            
            
        }
        else{
            //console.log("I am here!");
            alert("You don't select any nodes or edges!");
          //  selectAll=cy.$().select();
          //  //console.log("I am here!");
          //  selectAll.each(function(i,ele){
          //  console.log(ele+'--'+ele.group());
          //  if(ele.group()=='nodes'){
          //    if(ele.data()['borderColor']){
          //      subset_json = subset_json + '{ data: {id:"'+ele.data()['id']+'",faveColor:"'+ele.data()['faveColor']+'",borderColor:"'+ele.data()['borderColor'];
          //      subset_json = subset_json + '",width:"'+ele.data()['width']+'",height:"'+ele.data()['height']+'"},group:"nodes"},';
          //    }else{
          //      subset_json = subset_json + '{ data: {id:"'+ele.data()['id']+'",faveColor:"'+ele.data()['faveColor']+'"},group:"nodes"},';
          //    }
          //    
          //  }
          //  if(ele.group()=='edges'){
          //    subset_json = subset_json + '{ data: {id:"'+ele.data()['id']+'", source:"'+ele.data()['source']+'",target:"'+ele.data()['target']+'"},group:"edges"},';
          //  }
          //  
          //  //console.log(subset_json+ele.json()['data']);
          //});
        }



      });
    // select all nodes from graphics
    $('#selectAll').click(function(){
        //selectAll=cy.$().select();
        selectedNode=cy.$().select();
        //console.log(selectAll);
        //selectAll.each(function(i,ele){
        //  console.log(ele.data()['id']+'\n');
        //});
      });
	  
    //slider-opacity
      $("#slider-blue").slider({
	orientation: "horizontal",
        range: "min",
        max: 100,
        value: 25,
        // slide: refreshSwatch,
        slide: function (event, ui){
            //var val=ui.value/100;
            cy.$('.faded').css('opacity',ui.value/100);
          }
	});
      //slider text opacity
      $("#slider-green").slider({
	orientation: "horizontal",
        range: "min",
        max: 100,
        value: 10,
        // slide: refreshSwatch,
        slide: function (event, ui){
            //console.log(ui.value);
            //var val=ui.value/100;
            cy.$('.faded').css('text-opacity',ui.value/100);
          }
	});

  });
</script>
  <!--<link rel="stylesheet" type="text/css" href="style.css">-->
</head>
<body>
  <ul id="menu">
  <li><a id='legend'>Diagram</a></li>
  <li><a href="#">Layout</a></li>
  <li><a href="#">Tool</a></li>
  <li><a href="contact.php" target="_blank">Contact</a></li>
  </ul>
  
  <div id="dialog" title="Graph Legend">
    <canvas id='myLegend' width="400" height="200">Your browser doesn't support canvas</canvas>
    <script>
      var canvas = document.getElementById('myLegend');
      var context = canvas.getContext('2d');
      //draw symbol circle
      context.beginPath();
      x=15;y=15; radius=10;
      context.arc(x, y, radius, 0, 2 * Math.PI, false);
      context.strokeStyle = 'black';
      context.fillStyle = '#FFFF00'
      context.stroke();
      context.fill();
      context.closePath();
      //draw another iterm circle
      context.beginPath();     
      context.arc(x, y+25, radius, 0, 2 * Math.PI, false);
      context.strokeStyle = 'red';
      context.stroke();
      context.closePath();
      //draw selected circle
      context.beginPath();     
      context.arc(x, y+50, radius, 0, 2 * Math.PI, false);
      context.fillStyle = '#98FF98';
      context.fill();
      context.closePath();
      //draw shared circle
      context.beginPath();     
      context.arc(x, y+75, radius, 0, 2 * Math.PI, false);
      context.fillStyle = '#56CAFF';
      context.fill();
      context.closePath();
      //draw text
      context.font = '10pt';
      context.fillStyle = 'black';
      context.fillText('Gene Symbol', x+25, y+3);
      context.fillText('eGIFT iTerm', x+25, y+28);
      context.fillText('Selected Node', x+25, y+53);
      context.fillText('Shared Node', x+25, y+78);
      
    </script>
      <!--<img src="images/node-yellow.png" border="0"style="margin-left: 0px"><span style="font-size: 16px">&nbsp;Gene</span></br>-->
      <!--<img src="images/node-red.png" border="0"style="margin-left: 0px"><span style="font-size: 16px">&nbsp;Iterm</span></br>-->
      <!--<img src="images/node-mintgreen.png" border="0"style="margin-left: 0px"><span style="font-size: 16px">&nbsp;Node Selected</span></br>-->
      <!--<img src="images/node-lightblue.png" border="0"style="margin-left: 0px"><span style="font-size: 16px">&nbsp;Node Intersection</span></br>-->
  </div>
    
  <div id="dialog-layout" title="Layout Method">
    <form><span>Layout:</span>
    <select class="target">
      <option value="force" selected="selected">Force Directed</option>
      <option value="tree">Tree</option>
      <option value="random">Random</option>
      <option value="circle">Circle</option>
    </select>
    </form>
  </div>

  <div id="dialog-tool" title="Tool">
      <form>
        <input type='checkbox' id='showNode2' name='showNode'>Show All Nodes</br></br>
	<label>Opacity:</label><div id="slider-blue"></div>
        <label>Opacity-Text:</label><div id="slider-green"></div></br>
        <label>Image:</label><input type="button" id="save-right" value="Save"/></br>
        <label>Select All Nodes:</label><input type="button" id='selectAll' value="GO"/></br>
        <label>Selected Graph Data:</label><input type='button' id='subset' value="Save"/></br>
        <label>Selected Graph:</label><input type='button' id='subset_graph' value="Subset"/></br>
      </form>    
  </div>
  
  <div id="dialog-rightClick">
      <form>
        <input type='checkbox' id='hdNode' name='hdNode'>Hide Node</br>
        <input type='checkbox' id='showNode' name='showNode'>Show All Nodes</br>
      </form>
      <span>Node: <input type="button" id='rmNode' value="Remove"/></span></br>
      <span><b>NCBI: </b><a id='ncbi' href='http://www.ncbi.nlm.nih.gov/' target='_blank'><input type="button" value="GO"/></a></span>
  </div>
  
  <div id="dialog-edgeClick">
      <span><b>NCBI: </b><a id='ncbi-edge' href='http://www.ncbi.nlm.nih.gov/' target='_blank'><input type="button" value="GO" /></a></span></br>
      <span><b>eGIFT Sentence: </b><a id='egift-edge' href='#' target='_blank'><input type="button" value="GO"/></a></span>
  </div>
<!--  graph below-->
  <div id="cy"> </div>

</body>
</html>
