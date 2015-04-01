<!DOCTYPE html>
<!--Part of code modified from Jam Cellar 2014-05-06-->
<!--Navigation panel on the concept map is from reactome-->
<head>
	<meta charset="utf-8">
	<meta name="name" content="Concept Map" />
	<title>Concept Map</title>

    <style>
        /** {*/
            /*margin: 0;*/
            /*padding: 0*/
        /*}*/

        /*body {*/
            /*font-family: "Helvetica Neue", Arial, Helvetica, sans-serif;*/
            /*background-color: #ffffff;*/
            /*margin: 0px;*/
            /*overflow: hidden;*/
        /*}*/

        svg {
            position: absolute;
            font: 12px sans-serif;

        }

        text {
            /*pointer-events: none;*/
        }

        .inner_node rect {
            pointer-events: all;
        }

        .inner_node rect.highlight {
            stroke: #315B7E;
            stroke-width: 2px;
        }

        .outer_node circle {
            /*fill: #fff;*/
            stroke: steelblue;
            stroke-width: 1.5px;
            pointer-events: all;
        }

        .outer_node circle.highlight {
            stroke: #315B7E;
            stroke-width: 2px;
        }

        .link {
            fill: none;
        }
        .dragheader { background-color:#666666;color:#fff; font-weight:bold;text-align: left;left:0px;top:0px;
            cursor:move; position:relative; }
        .dragheader:hover {color:red z-index:120;}
        .widget { float:left; background:#aec7e8; z-index:120;}
        .widget .close { color:red; font-size:0.7em;float:right; text-align: center }
        .widget .close:hover { color:greenyellow;cursor:pointer; }

    </style>
</head>
<body>
<table class="GG5EBMLCKI" style="position: absolute; left: 6px; top: 6px; z-index: 1000">
    <colgroup>
        <col>
    </colgroup>
    <tbody>
    <tr>
        <td id="reset" rowspan="2"><img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAARUlEQVR42mNgYGD4Tyy+du0aiGb4TwygngYYH5s4hgaYW9HZWDXg8yxWDVAOsgScjdNJMIUwmihPw0ykbrCSFNMgghQMAIlEf5Ic/Z/LAAAAAElFTkSuQmCC"
                width="12" height="12" class="gwt-Image" alt="reset" title="reset"></td>
        <td rowspan="2"><img  id="zoomIn"
                              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAPUlEQVR42mNgYGD4Tyw+c+YMiGb4TwzAqwGXGJ014PMsVg0gDgzDJGGYKCfBFBLtB5I0EIwHkmIa2XPEYABjqIzoNxHTuAAAAABJRU5ErkJggg=="
                              width="12" height="12" class="gwt-Image" alt="zoom in" title="zoom in"></td>
        <td rowspan="2"><img  id="zoomOut"
                              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAALUlEQVR42mNgYGD4Tyw+c+YMiGb4TwwYChrweRarBhAHFx4KniYppvF5FhsGACZcn28f7AIaAAAAAElFTkSuQmCC"
                              width="12" height="12" class="gwt-Image" alt="zoom out" title="zoom out"></td>
        <td rowspan="2"><img id="moveLeft"
                             src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAQklEQVR42mNgYGD4Tyw+c+YMiGb4TwygngZcBmDVAHMrURrweRarBigHLoGMcToJpgmmiChPY1NMebCSFNPoHiSEARyJjOip0asqAAAAAElFTkSuQmCC"
                             width="12" height="12" class="gwt-Image" alt="move left" title="move left"></td>
        <td><img id="moveUp"
                 src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAOUlEQVR42mNgYGD4Tyw+c+YMiGb4TwzAqwEmSZQGdCfg1YDL3UQ7iaANZPmBPhoIxgNJMQ0LDWIxAKWrjOj75HeuAAAAAElFTkSuQmCC"
                 width="12" height="12" class="gwt-Image" alt="move up" title="move up"></td>
        <td rowspan="2"><img id="moveRight"
                             src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAQElEQVR42mNgYGD4Tyw+c+YMiGb4TwygvgZ0caI0IMthaMDnWawaQBxkjBwyRDsJppgoDciKKQ9WkmIa3bOEMABhH42Buzog1wAAAABJRU5ErkJggg=="
                             width="12" height="12" class="gwt-Image" alt="move right" title="move right"></td>
    </tr>
    <tr>
        <td><img id="moveDown"
                 src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAN0lEQVR42mNgYGD4Tyw+c+YMiGb4TwzAqwEmOQg1IGvCqgFXyOC1AZti6vuBYDyQFNOw0CAWAwDNAozowTErvwAAAABJRU5ErkJggg=="
                 width="12" height="12" class="gwt-Image" alt="move down" title="move down"></td>
    </tr>
    </tbody>
</table>
<input id="myInput" type="file" style="visibility:hidden; "/>

<script src="http://d3js.org/d3.v3.min.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
<script src="//code.jquery.com/ui/1.11.2/jquery-ui.js"></script>
<link rel="stylesheet" href="//code.jquery.com/ui/1.11.2/themes/smoothness/jquery-ui.css">
<script type="text/javascript" src="jsLib/dat.gui.js"></script>
<link rel="stylesheet" href="css-ui/dat_gui.css">
<script src="conceptMapJS/concept_fns.js"></script>


<?php
    //$jsonFile = $_GET['fileName'];
    //$jsonData = file_get_contents($jsonFile);
    
    $outfile = $_GET['fileName'];
    $flag_egift = $_GET['flag_egift']; //check whehter it's egift data or customized data
    $conceptName = $_GET['conceptName'];
    if(!$conceptName){
	$conceptName = '';
    }
	  $list = file_get_contents($outfile);
	  $list = preg_replace('/\r\n|\r|\n/',"\n",$list);
	  $list_arr = explode("\n",$list);

	  $json_arr = array();
	  $json_data ='';
	  foreach ($list_arr as $d) {
		$data = explode("\t",$d);
		if($data[0] && $data[1]){
		   $json_arr['"'.$data[0].'"'][] = '"'.$data[1].'"'; 
		}

	    
	  }
	  //print_r($json_arr);
	  
	  foreach ($json_arr as $key=>$value){
	    $string = '['.$key . ',['.implode(',',$value).']]';
	    //echo $string.'-----</br>';
	    $json_data[]=$string;
	  }
	  $json_data_string = '['.implode(',',$json_data).']';
	  //echo $json_data_string;
	  //fwrite($fh_json,$json_data_string) or die("cannot open this json_arr file");
	  //fclose($fh_json);
	  
  
?>


<script>
//
// Generated by the Exaile Playlist Analyzer plugin.
// (C) 2014 Dustin Spicuzza <dustin@virtualroadside.com>
//
// This work is licensed under the Creative Commons Attribution 4.0
// International License. To view a copy of this license, visit
// http://creativecommons.org/licenses/by/4.0/.
//
// Inspired by http://www.findtheconversation.com/concept-map/
// Loosely based on http://bl.ocks.org/mbostock/4063550
//


//var data = [[120, ["like", "call response", "dramatic intro", "has breaks", "male vocalist", "silly", "swing"]], [150, ["brassy", "like", "calm energy", "female vocalist", "swing", "fun"]], [170, ["calm energy", "instrumental", "swing", "like", "happy"]], [140, ["has breaks", "male vocalist", "swing", "piano", "banjo", "chill"]], [160, ["calm energy", "instrumental", "swing", "like", "interesting"]], [140, ["brassy", "like", "energy", "dramatic intro", "male vocalist", "baseball", "swing"]], [170, ["instrumental", "interesting", "high energy", "like", "swing"]], [140, ["instrumental", "energy", "like", "swing"]], [200, ["instrumental", "brassy", "dramatic intro", "like", "swing"]], [160, ["male vocalist", "brassy", "swing", "like", "my favorites"]], [130, ["like", "interesting", "dramatic intro", "male vocalist", "silly", "swing", "gospel"]], [160, ["like", "long intro", "announcer", "energy", "swing", "female vocalist"]], [170, ["instrumental", "swing", "bass", "like"]], [150, ["like", "interesting", "has breaks", "instrumental", "chunky", "swing", "banjo", "trumpet"]], [170, ["like", "has breaks", "male vocalist", "silly", "swing", "banjo"]], [190, ["instrumental", "banjo", "swing"]], [130, ["instrumental", "brassy", "banjo", "like", "swing"]], [160, ["brassy", "like", "energy", "instrumental", "big band", "jam", "swing"]], [150, ["like", "male vocalist", "live", "swing", "piano", "banjo", "chill"]], [150, ["like", "trick ending", "instrumental", "chunky", "swing", "chill"]], [120, ["brassy", "like", "female vocalist", "swing", "chill", "energy buildup"]], [150, ["brassy", "like", "interesting", "instrumental", "swing", "piano"]], [190, ["brassy", "like", "long intro", "energy", "baseball", "swing", "female vocalist"]], [180, ["calm energy", "female vocalist", "live", "like", "swing"]], [200, ["banjo", "like", "long intro", "interesting", "energy", "my favorites", "male vocalist", "silly", "swing", "fun", "balboa"]], [150, ["brassy", "calm energy", "chunky", "instrumental", "old-timey", "live", "swing"]], [160, ["like", "call response", "interesting", "instrumental", "calm energy", "swing"]], [180, ["interesting", "swing", "fast", "male vocalist"]], [150, ["calm energy", "chunky", "swing", "female vocalist", "like"]], [180, ["like", "has breaks", "male vocalist", "chunky", "silly", "swing"]], [140, ["instrumental", "brassy", "dramatic intro", "swing", "chill"]], [150, ["male vocalist", "trumpet", "like", "swing"]], [150, ["instrumental", "energy", "like", "has breaks", "swing"]], [180, ["brassy", "like", "energy", "has breaks", "instrumental", "has calm", "swing"]], [150, ["female vocalist", "swing"]], [170, ["instrumental", "brassy", "energy", "swing"]], [170, ["calm energy", "instrumental", "energy", "like", "swing"]], [190, ["brassy", "like", "instrumental", "high energy", "swing", "trumpet"]], [160, ["male vocalist", "energy", "swing", "old-timey"]], [170, ["like", "oldies", "my favorites", "fast", "male vocalist", "high energy", "swing"]]];


var data = <?php echo $json_data_string; ?>;
window.conceptFile_name = <?php echo "'".$conceptName."'"; ?>;
var flag_egift = <?php echo $flag_egift; ?>;

console.log(window.conceptFile_name);
var xValue=0;
var yValue=0;
var zoomValue=1.0;
window.gui_flag = false;
window._data = null;
var CUSTOMEDATA = ! flag_egift;
    
var SymbolInInner = true;
    renderNodes(data);
//pass concept map name to concept_fns.js
    var concept_name = '';
    var concept_name = 'Pineal';
    
    function compare(a, b) {
        if (a.name.length > b.name.length)
            return -1;
        if (a.name.length < b.name.length)
            return 1;
        return 0;
    }
    function renderNodes(data) {
        var outer = d3.map();
        var inner = [];
        var links = [];

        var outerId = [0];

        data.forEach(function (d) {

            if (d == null)
                return;

            i = { id: 'i' + inner.length, name: d[0], related_links: [] };  //to do, we can sort the inner array
            i.related_nodes = [i.id];
            inner.push(i);

            if (!Array.isArray(d[1]))
                d[1] = [d[1]];
            d[1].forEach(function (d1) {

                o = outer.get(d1);

                if (o == null) {
                    o = { name: d1, id: 'o' + outerId[0], related_links: [] };
                    o.related_nodes = [o.id];
                    outerId[0] = outerId[0] + 1;

                    outer.set(d1, o);
                }

                // create the links
                l = { id: 'l-' + i.id + '-' + o.id, inner: i, outer: o }
                links.push(l);

                // and the relationships
                i.related_nodes.push(o.id);
                i.related_links.push(l.id);
                o.related_nodes.push(i.id);
                o.related_links.push(l.id);
            });
        });

        inner = inner.sort(compare);
        var inner_even = [];
        var inner_odd = [];
        for (var i = 0; i < inner.length; i++) {
            if (i % 2) {
                inner_odd.push(inner[i]);
            } else {
                inner_even.push(inner[i]);
            }
        }

        inner = inner_odd.reverse().concat(inner_even);

        data = {
            inner: inner,     //{ id: 'i' + inner.length, name: d[0], related_links: [] };
            outer: outer.values(),   //only the value part { name: d1,	id: 'o' + outerId[0], related_links: [] };
            links: links
        }

        d3.text("./ratelimitsymbol.txt", function (error, rateLimitSymbols) {
            rateLimitSymbols = rateLimitSymbols.replace(/\r\n/g, '\n');
            rateLimitSymbols = rateLimitSymbols.replace(/\r/g, '\n');
            var rateLimit_Symbols = rateLimitSymbols.split("\n");
            if (!SymbolInInner) {
                for (var i = 0; i < data.outer.length; ++i) {
                    var index = rateLimit_Symbols.indexOf(data.outer[i].name);
                    if (index > -1) {
                        data.outer[i].rateLimit = true;
                    }
                }
            }
            else {
                for (var i = 0; i < data.inner.length; ++i) {
                    var index = rateLimit_Symbols.indexOf(data.inner[i].name);
                    if (index > -1) {
                        data.inner[i].rateLimit = true;
                    }
                }
            }
	    
	    
            loadData(data,flag_egift);
        });
    }

</script>

