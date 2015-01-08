<?php
//try to get node and edge information

$fileName=$_GET['fileName'];
#$fileName="usrID/id_1378400413_14_gene_iterm.txt";

$fh=fopen($fileName,'rb') or die ("can not open");
#$count=1;
$symbol=array();
$iterm=array();
$relation=array();
while(!feof($fh)){
    $line=fgets($fh);
    $data=explode("\t",$line);
    $data[0]=trim($data[0]);
    $data[1]=trim($data[1]);
    if(empty($data[0])){
        continue;
    }
   // $i='';
    if(!(in_array($data[0],$symbol))){
        $symbol[]=$data[0];
    }
    //if(in_array($data[1],$iterm)){
    //    $i=$iterm[$data[1]];
    //    
    //}
    //else{
    //    $i='i'.$count;
    //    $iterm[$data[1]]=$i;
    //}
    if(!(in_array($data[1],$iterm))){
        $iterm[]=$data[1];
    }

    $relation[$data[0]][]=$data[1]; 

    
    #$count++;
}



echo <<< EOT
$(document).ready(function(){
$('#cy').cytoscape({
    showOverlay: false,
    minZoom: 0.5,
    maxZoom: 2,
    layout: {name: 'arbor'},

    
    style: cytoscape.stylesheet()
      .selector('node')
        .css({
          'content': 'data(id)',
          'background-color': 'data(faveColor)',
          'border-width': 2,
          'border-color': 'data(borderColor)',
          'text-valign': 'center',
          'font-size':'data(font)',
          'width':'data(width)',
          'height':'data(height)',

        })
      .selector(':selected')
        .css({
          'background-color': '#98FF98',
          'line-color': '#98FF98',
          'target-arrow-color': '#98FF98',

        })
        
      .selector('edge')
        .css({
          'width': 2,
          'target-arrow-shape': 'none',

        })
      .selector('.faded')
        .css({
          'opacity': 0.25,
          'text-opacity': 0
        })
      .selector('.intersect')
        .css({
          'text-outline-color':'#56CAFF',
          'background-color': '#56CAFF',
        })
      .selector('.rightClick')
        .css({
          'background-color': '#98FF98 ',
          'text-outline-color': '#fff'
        })
    ,


    elements: {

      nodes: [
EOT;

foreach ($symbol as $s){
    echo '{ data:{id:"'.$s.'",faveColor:"#FFFF00"}},';
}
//#FF0000, red,#98FF98 
foreach ($iterm as $i){
    echo '{ data:{id:"'.$i.'",faveColor:"white",borderColor:"#FF0000",width:"40", height:"40", font:"15"}},';
}


echo "],edges:[";
//
//echo <<< EOT
//        {
//          data: { id: 'j', name: 'Jerry', weight: 65, height: 174 }
//        },
//
//        {
//          data: { id: 'e', name: 'Elaine', weight: 48, height: 160 }
//        },
//
//        {
//          data: { id: 'k', name: 'Kramer', weight: 75, height: 185 }
//        },
//
//        {
//          data: { id: 'g', name: 'George', weight: 70, height: 150 }
//        }
//      ],
//
//      edges: [
//        { data: { source: 'j', target: 'e' } },
//        { data: { source: 'j', target: 'k' } },
//        { data: { source: 'j', target: 'g' } },
//
//        { data: { source: 'e', target: 'j' } },
//        { data: { source: 'e', target: 'k' } },
//
//        { data: { source: 'k', target: 'j' } },
//        { data: { source: 'k', target: 'e' } },
//        { data: { source: 'k', target: 'g' } },
//
//        { data: { source: 'g', target: 'j' } }
//      ],
//EOT;

foreach ($relation as  $key=>$value){
    foreach($value as $item){
        echo '{ data:{source:"'.$key.'", target:"'.$item.'"}},';
    }

}

echo <<< EOT
    ],
    },
    //ready:function(){
    //    window.cy = this;
    //  $("#save-right").click(function () {
    //  $.post("save.php", {data: cy.png(),type:"image"}, function (file) {
    //    window.location.href =  "download.php?path="+ file
    //    });
    //  //zero selected node;
    //  //selectedNode=cy.collection();
    //  //cy.layout('arbor');
    //  //location.reload();
    //  //cy.load([{data: { id: 'foo' }, group: 'nodes'}, {data: { id: 'bar' },group: 'nodes'}, { data: { id: "e1", source: "n1", target: "n2" }, group: "edges" }]);
    //   
    //  });
    //  
    //  
    //     // trigger layout method
    //$( ".target" ).change(function () {
    //  $var=$( "select option:selected" ).val();
    //  if ($var=='tree'){
    //    cy.layout({ name: 'breadthfirst', fit:false, directed: true,padding: 0 });
    //  }
    //  else if ($var=='random'){
    //    cy.layout({ name: 'random' });
    //  }
    //  else if ($var=='circle'){
    //    cy.layout({ name: 'circle' });
    //  }
    //  else{
    //    cy.layout({ name: 'arbor',liveUpdate: true});
    //  }
    //  //console.log($var);
    //});
    //    
    //}

});
});
EOT;
?>
