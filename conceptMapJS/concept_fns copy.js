function loadData(data, flag_egift) {

    outer = data.outer;
    sortOuter(data.outer);
    function sortOuter(outer) {
        var swapped;
        do {
            swapped = false;
            for (var i = 0; i < outer.length - 1; ++i) {
                if (outer[i].name.length > outer[i + 1].name.length) {
                    var tmp = outer[i];
                    outer[i] = outer[i + 1];
                    outer[i + 1] = tmp;
                    swapped = true;
                }
            }
        } while (swapped)
    }

    var colors = ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"];
    var color = d3.scale.linear()
        .domain([60, 220])
        .range([colors.length - 1, 0])
        .clamp(true);

    var rect_width = 40;
    var rect_height = 14;

    var link_width = "1px";

    var il = data.inner.length;
    var ol = data.outer.length;

    var diameter = 1400;
    var nodeRingLength = 250;
    diameter = diameter > il * rect_height ? diameter : (il * rect_height + 20);

    var inner_y = d3.scale.linear()
        .domain([0, il])
        .range([-(il * rect_height) / 2, (il * rect_height) / 2]);

    var outer_x;

    var levels = Math.ceil(ol / nodeRingLength);

    var maxString;
    var maxLength = 0;
    var maxStrings = [];
    for (var j = 0; j < levels; ++j) {
        for (var i = Math.floor(data.outer.length / levels * j); i < data.outer.length / levels * (j + 1); ++i) {
            if (data.outer[i].name.length > maxLength) {
                maxLength = data.outer[i].name.length;
                maxString = data.outer[i].name;
            }
        }
        var maxLength = 0;
        maxStrings.push(maxString);
    }
    var ringSpacings = [0];
    for (var i = 0; i < levels; i++) {
        var ringSpacing = getStringLength(maxStrings[i]) + 30;      //40chars 239
        ringSpacings.push(ringSpacing);
    }
//    var ringSpacing = getStringLength(maxString);      //40chars 239
    function basicDivString(string, label) {
        var tmp = '';
        tmp += '<div id=' + "legend_" + string + ' class="widget shadow drag" style="position: absolute; left:0px; top:400px; width: 220px; height: 160px;">';
        tmp += '<div class="dragheader">' + label;
        tmp += '<span class="close" >X</span>';
        tmp += '</div>';
        tmp += '<div id=' + "divBody_" + string + '>';

        tmp += '</div>';
        tmp += '</div>';
        return tmp;
    }

    if (flag_egift) {
        addInnerLegend();

        addOuterLegend();
    }


    function addInnerLegend() {
        if ($('#legend_inner').length) {
            $('#legend_inner').remove();
        }
        var vcdiv = $(basicDivString("inner", "Inner Legend")).css({
            top: 100
        });

        $('body').append(vcdiv);

        $(".drag").draggable();

        var parent = $('#legend_inner');
        parent.find(".close").css({
            left: 110
        }).click(function () {
                parent.remove();
            });
        var innerSvg = d3.select('#divBody_inner').append('svg').attr("left", 0).attr("top", 20).attr("width", 220).attr("height", 160).append('g');
        innerSvg.append('rect')
            .attr("x", 10)
            .attr("y", 10)
            .attr('width', 10)
            .attr('height', rect_height)
            .attr('fill', function (d) {
                return "#666666";//f46d43
            });
        innerSvg.append('rect')
            .attr("x", 20)
            .attr("y", 10)
            .attr('width', 40)
            .attr('height', rect_height)
            .attr('fill', function (d) {
                return "#f46d43";//
            });
        innerSvg.append('text')
            .attr("x", 70)
            .attr("y", 20)
            .text("Frequency");

        innerSvg.append('rect')
            .attr("x", 10)
            .attr("y", 30)
            .attr('width', 10)
            .attr('height', rect_height)
            .attr('fill', function (d) {
                return "#00f";//
            });
        innerSvg.append('rect')
            .attr("x", 20)
            .attr("y", 30)
            .attr('width', 40)
            .attr('height', rect_height)
            .attr('fill', function (d) {
                return "#f46d43";//
            });
        innerSvg.append('text')
            .attr("x", 70)
            .attr("y", 40)
            .text("Ratelimit+Frequency");


        innerSvg.append('rect')
            .attr("x", 10)
            .attr("y", 50)
            .attr('width', 10)
            .attr('height', rect_height)
            .attr('fill', function (d) {
                return "#666666";//f46d43
            });
        innerSvg.append('rect')
            .attr("x", 20)
            .attr("y", 50)
            .attr('width', 40)
            .attr('height', rect_height)
            .attr('fill', function (d) {
                return "#ffff00";//
            });
        innerSvg.append('text')
            .attr("x", 70)
            .attr("y", 60)
            .text("Up Regulated");

        innerSvg.append('rect')
            .attr("x", 10)
            .attr("y", 70)
            .attr('width', 10)
            .attr('height', rect_height)
            .attr('fill', function (d) {
                return "#00f";//
            });
        innerSvg.append('rect')
            .attr("x", 20)
            .attr("y", 70)
            .attr('width', 40)
            .attr('height', rect_height)
            .attr('fill', function (d) {
                return "#ffff00";//
            });
        innerSvg.append('text')
            .attr("x", 70)
            .attr("y", 80)
            .text("Ratelimit+Up Regulated");


        innerSvg.append('rect')
            .attr("x", 10)
            .attr("y", 90)
            .attr('width', 10)
            .attr('height', rect_height)
            .attr('fill', function (d) {
                return "#666666";//f46d43
            });
        innerSvg.append('rect')
            .attr("x", 20)
            .attr("y", 90)
            .attr('width', 40)
            .attr('height', rect_height)
            .attr('fill', function (d) {
                return "#00ff00";//
            });
        innerSvg.append('text')
            .attr("x", 70)
            .attr("y", 100)
            .text("Down Regulated");

        innerSvg.append('rect')
            .attr("x", 10)
            .attr("y", 110)
            .attr('width', 10)
            .attr('height', rect_height)
            .attr('fill', function (d) {
                return "#00f";//
            });
        innerSvg.append('rect')
            .attr("x", 20)
            .attr("y", 110)
            .attr('width', 40)
            .attr('height', rect_height)
            .attr('fill', function (d) {
                return "#00ff00";//
            });
        innerSvg.append('text')
            .attr("x", 70)
            .attr("y", 120)
            .text("Ratelimit+Down Regulated");


    }

    function addOuterLegend() {
        if ($('#legend_outer').length) {
            $('#legend_outer').remove();
        }
        var vcdiv = $(basicDivString("outer", "Outer Legend"));

        $('body').append(vcdiv);

        $(".drag").draggable();

        var parent = $('#legend_outer').css({
            top: 300
        });
        parent.find(".close").css({
            left: 110
        }).click(function () {
                parent.remove();
            });
        var innerSvg = d3.select('#divBody_outer').append('svg').attr("left", 0).attr("top", 20).attr("width", 220).attr("height", 160).append('g');
        innerSvg.append('circle')
            .attr("cx", 10)
            .attr("cy", 15)
            .attr('stroke', 'steelblue')
            .attr('stroke-width', '1.5px')
            .attr('pointer-events', 'all')
            .attr("r", 4.5)
            .attr("class", 'highlight')
            .attr("stroke", function (d) {
                return "#315B7E";
            })
            .attr("stroke-width", "2px")
            .attr('fill', function (d) {
                return "#ffffff";
            });
        innerSvg.append('rect')
            .attr("x", 20)
            .attr("y", 10)
            .attr('width', 40)
            .attr('height', rect_height)
            .attr('fill', function (d) {
                return "#f46d43";//
            });
        innerSvg.append('text')
            .attr("x", 70)
            .attr("y", 20)
            .text("Frequency");

        innerSvg.append('circle')
            .attr("cx", 10)
            .attr("cy", 35)
            .attr('stroke', 'steelblue')
            .attr('stroke-width', '1.5px')
            .attr('pointer-events', 'all')
            .attr("r", 4.5)
            .attr("class", 'highlight')
            .attr("stroke", function (d) {
                return "#315B7E";
            })
            .attr("stroke-width", "2px")
            .attr('fill', function (d) {
                return "#00f";
            });
        innerSvg.append('rect')
            .attr("x", 20)
            .attr("y", 30)
            .attr('width', 40)
            .attr('height', rect_height)
            .attr('fill', function (d) {
                return "#f46d43";//
            });
        innerSvg.append('text')
            .attr("x", 70)
            .attr("y", 40)
            .text("Ratelimit+Frequency");


        innerSvg.append('circle')
            .attr("cx", 10)
            .attr("cy", 55)
            .attr('stroke', 'steelblue')
            .attr('stroke-width', '1.5px')
            .attr('pointer-events', 'all')
            .attr("r", 4.5)
            .attr("class", 'highlight')
            .attr("stroke", function (d) {
                return "#315B7E";
            })
            .attr("stroke-width", "2px")
            .attr('fill', function (d) {
                return "#fff";
            });
        innerSvg.append('rect')
            .attr("x", 20)
            .attr("y", 50)
            .attr('width', 40)
            .attr('height', rect_height)
            .attr('fill', function (d) {
                return "#ffff00";//
            });
        innerSvg.append('text')
            .attr("x", 70)
            .attr("y", 60)
            .text("Up Regulated");

        innerSvg.append('circle')
            .attr("cx", 10)
            .attr("cy", 75)
            .attr('stroke', 'steelblue')
            .attr('stroke-width', '1.5px')
            .attr('pointer-events', 'all')
            .attr("r", 4.5)
            .attr("class", 'highlight')
            .attr("stroke", function (d) {
                return "#315B7E";
            })
            .attr("stroke-width", "2px")
            .attr('fill', function (d) {
                return "#00f";
            });
        innerSvg.append('rect')
            .attr("x", 20)
            .attr("y", 70)
            .attr('width', 40)
            .attr('height', rect_height)
            .attr('fill', function (d) {
                return "#ffff00";//
            });
        innerSvg.append('text')
            .attr("x", 70)
            .attr("y", 80)
            .text("Ratelimit+Up Regulated");


        innerSvg.append('circle')
            .attr("cx", 10)
            .attr("cy", 95)
            .attr('stroke', 'steelblue')
            .attr('stroke-width', '1.5px')
            .attr('pointer-events', 'all')
            .attr("r", 4.5)
            .attr("class", 'highlight')
            .attr("stroke", function (d) {
                return "#315B7E";
            })
            .attr("stroke-width", "2px")
            .attr('fill', function (d) {
                return "#fff";
            });
        innerSvg.append('rect')
            .attr("x", 20)
            .attr("y", 90)
            .attr('width', 40)
            .attr('height', rect_height)
            .attr('fill', function (d) {
                return "#00ff00";//
            });
        innerSvg.append('text')
            .attr("x", 70)
            .attr("y", 100)
            .text("Down Regulated");

        innerSvg.append('circle')
            .attr("cx", 10)
            .attr("cy", 115)
            .attr('stroke', 'steelblue')
            .attr('stroke-width', '1.5px')
            .attr('pointer-events', 'all')
            .attr("r", 4.5)
            .attr("class", 'highlight')
            .attr("stroke", function (d) {
                return "#315B7E";
            })
            .attr("stroke-width", "2px")
            .attr('fill', function (d) {
                return "#00f";
            });
        innerSvg.append('rect')
            .attr("x", 20)
            .attr("y", 110)
            .attr('width', 40)
            .attr('height', rect_height)
            .attr('fill', function (d) {
                return "#00ff00";//
            });
        innerSvg.append('text')
            .attr("x", 70)
            .attr("y", 120)
            .text("Ratelimit+Down Regulated");
    }

    function getStringLength(string) {
        d3.select('body').append('svg').attr("id", "tmpSVG").append('text').attr("id", "tmpSVGText").text(string);
        var bbox = d3.select('#tmpSVGText').node().getBBox().width;
        d3.select("#tmpSVG").remove();
        return bbox;
    }

    var domains = [];
    var ranges = [];
    for (var i = 0; i < ol; i += ol / (levels * 2)) {
        domains.push(i);
        domains.push(i + ol / (levels * 2));
    }

    for (var i = 0; i < levels; ++i) {
        ranges.push(10);
        ranges.push(170);
        ranges.push(190);
        ranges.push(350);
    }
    outer_x = d3.scale.linear()
        .domain(domains)   // by index
        .range(ranges);
// setup positioning
    data.outer = data.outer.map(function (d, i) {
        d.x = outer_x(i);     // by index
        var space = 0;
        for (var j = 0; j <= Math.floor(i / (ol / levels)); j++) {
            space += ringSpacings[Math.floor(j)]
        }
        d.y = diameter / 4 + space;

        d.clickFlag = false;   //see whether data is clicked or not; default value is false.

        return d;
    });

    data.inner = data.inner.map(function (d, i) {
        d.x = -(rect_width / 2);
        d.y = inner_y(i);
        d.clickFlag = false;   //see whether data is clicked or not; default value is false.
        return d;
    });


    var diagonal = d3.svg.diagonal()
        .source(function (d) {
            return {"x": d.outer.y * Math.cos(projectX(d.outer.x)),
                "y": -d.outer.y * Math.sin(projectX(d.outer.x))};
        })
        .target(function (d) {
            return {"x": d.inner.y + rect_height / 2,
                "y": d.outer.x > 180 ? d.inner.x : d.inner.x + rect_width};
        })
        .projection(function (d) {
            return [d.y, d.x];
        });

    function projectX(x) {
        return ((x - 90) / 180 * Math.PI) - (Math.PI / 2);
    }


    var width = window.innerWidth;
    var height = window.innerHeight;
    var zoom = d3.behavior.zoom()
        .scaleExtent([0.1, 10])
        .on("zoom", zoomed); //Yongnan
    var svg = d3.select("body").append("svg")
        .attr("id", 'svgID')  //to get the svg data!

        .style("width", width)
        .style("height", height)
        .style("left", 0)
        .style("top", 0)
        .append("g")
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")
        .call(zoom);  //Yongnan
    var zoomContainer = svg.append("g").attr("id", "svgZoomContainer");

    function zoomed() {
        zoomContainer.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }//Yongnan
    d3.select("#reset").on("click", function () {
        d3.select("#svgZoomContainer").attr("transform", "translate(" + 0 + "," + 0 + ")scale(" + 1.0 + ")");
    });
    d3.select("#moveLeft").on("click", function () {
        var transformString = d3.transform($("#svgZoomContainer").attr("transform"));
        xValue -= 5;
        yValue = 0;
        d3.select("#svgZoomContainer").attr("transform", "translate(" + (transformString.translate[0] + xValue) + "," + (transformString.translate[1] + yValue) + ")scale(" + zoomValue + ")");
    });
    d3.select("#moveRight").on("click", function () {
        var transformString = d3.transform($("#svgZoomContainer").attr("transform"));
        xValue += 5;
        yValue = 0;
        d3.select("#svgZoomContainer").attr("transform", "translate(" + (transformString.translate[0] + xValue) + "," + (transformString.translate[1] + yValue) + ")scale(" + zoomValue + ")");
    });
    d3.select("#moveUp").on("click", function () {
        var transformString = d3.transform($("#svgZoomContainer").attr("transform"));
        yValue -= 5;
        xValue = 0;
        d3.select("#svgZoomContainer").attr("transform", "translate(" + (transformString.translate[0] + xValue) + "," + (transformString.translate[1] + yValue) + ")scale(" + zoomValue + ")");
    });
    d3.select("#moveDown").on("click", function () {
        var transformString = d3.transform($("#svgZoomContainer").attr("transform"));
        yValue += 5;
        xValue = 0;
        d3.select("#svgZoomContainer").attr("transform", "translate(" + (transformString.translate[0] + xValue) + "," + (transformString.translate[1] + yValue) + ")scale(" + zoomValue + ")");
    });

    d3.select("#zoomIn").on("click", function () {
        zoomValue += 0.1;
        d3.select("#svgZoomContainer").attr("transform", "translate(" + xValue + "," + yValue + ")scale(" + zoomValue + ")");
    });
    d3.select("#zoomOut").on("click", function () {
        zoomValue -= 0.1;
        yValue = 0;
        xValue = 0;
        d3.select("#svgZoomContainer").attr("transform", "translate(" + xValue + "," + yValue + ")scale(" + zoomValue + ")");
    });
    // inner nodes
    var maxInnerLinks = d3.max(data.inner, function (d) {
        return d.related_links.length;
    });//Yongnan
    var maxOuterLinks = d3.max(data.outer, function (d) {
        return d.related_links.length;
    });//Yongnan

//************************* selectedNode*************************
    var selectedObj = {};
    selectedObj.related_nodes = [];
    selectedObj.related_links = [];

//*************************subset data********************
    var subsetObj = {};
    subsetObj.inner = [];
    subsetObj.outer = [];
    subsetObj.links = [];
//*************************remove array data********************   
    var removeObj = {};
    removeObj.related_nodes = [];
    removeObj.related_links = [];

//*************************links
    var link = zoomContainer.attr('class', 'links').selectAll(".link")
        .data(data.links)
        .enter().append('path')
        .attr('class', 'link')
        .attr('id', function (d) {
            return d.id
        })
        .attr("d", diagonal)   //how to understand??????????
        .attr('stroke', function (d) {
            return get_color(d.inner.name);
        })   // not function very well
        .attr('fill', 'none')
        .attr('stroke-width', link_width)
        .on("contextmenu", function (d, i) {
            //create tooltips
            var position = d3.mouse(this);
            tooltip = get_tooltip(d);
            d3.event.preventDefault();
            //console.log((Math.cos((d.x-90)/180*Math.PI)*d.y+diameter/2)+'*'+(Math.sin((d.x-90)/180*Math.PI)*d.y+diameter/2))
            tooltip.html(function () {
                return format_name(d, true);
            });

            $('#' + d.id + '-tprm').click(function () {
                $('#' + d.id + '-tp').remove();
            });
            //console.log('top'+(position[1]+diameter/2)+ ' left:'+(position[0]+diameter/2));
            $('#' + d.id + '-tp').dialog({
                width: "auto",
                height: "auto"
            });
        });


// outer nodes

    var onode = zoomContainer.selectAll(".outer_node")
        .data(data.outer)
        .enter().append("g")
        .attr("class", "outer_node")
        .attr("transform", function (d) {
            return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
        })
        .on("click", nodeclick)
        .on("contextmenu", function (d, i) {
            //create tooltips
            tooltip = get_tooltip(d);
            d3.event.preventDefault();
            //console.log((Math.cos((d.x-90)/180*Math.PI)*d.y+diameter/2)+'*'+(Math.sin((d.x-90)/180*Math.PI)*d.y+diameter/2))
            tooltip.html(function () {
                return format_name(d, false);
            });
            //console.log(svg.style("height"));
            //console.log('y:'+d.y+ svg.style("height")/2+20+' x:'+d.x+ svg.style("height")/2+20);
            $('#' + d.id + '-tprm').click(function () {
                $('#' + d.id + '-tp').remove();
            });

            $('#' + d.id + '_rm').click(function () {  //remove button clicked
                select_Node(d);
                $(".tooltip").remove();
            });

            $('#' + d.id + '-tp').dialog({
                width: "auto",
                height: "auto"
            });
        });


    onode.append("circle")
        .attr('id', function (d) {
            return d.id
        })
        .attr('stroke', 'steelblue')
        .attr('stroke-width', '1.5px')
        .attr('pointer-events', 'all')
        .attr("r", 4.5)
        .attr("class", 'highlight')
        .attr("stroke", function (d) {
            return "#315B7E";
        })
        .attr("stroke-width", "2px")
        .attr('fill', function (d) {
            if (d.rateLimit !== undefined && d.rateLimit)     //You need to set rateLimit attribute
            {
                return "#00f";
            }
            else {
                return "#ffffff";
            }
        });

//onode.append("circle")
//    .attr('r', 20)
//    .attr('visibility', 'hidden');

    onode.append('rect')     //Yongnan

        .attr('width', function (d) {
            if (maxOuterLinks == 0)
                return 0;
            return Math.floor(rect_width * d.related_links.length / maxOuterLinks)
        })
        .attr('x', function (d) {
            return 5;
        })
        .attr('y', function (d) {
            return -5;
        })
        .attr('height', 10)
        .attr('id', function (d) {
            return "outRect" + d.id;
        })
        .attr('fill', function (d) {
            if (d.regulation == undefined)
                return "#f46d43";
            else if (d.regulation == "Up")
                return "#ffff00";
            else if (d.regulation == "Down")
                return "#00ff00";
        });


    onode.append("text")
        .attr('id', function (d) {
            return d.id + '-txt';
        })
        .attr("dy", ".31em")
        .attr("text-anchor", function (d) {
            return d.x < 180 ? "start" : "end";
        })
        .attr("transform", function (d) {
            return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)";
        })
        .text(function (d) {
            return trimLabel(d.name, 'outer');
        });

// inner nodes

    var inode = zoomContainer.selectAll(".inner_node")
        .data(data.inner)
        .enter().append("g")
        .attr("class", "inner_node")
        .attr("transform", function (d, i) {
            return "translate(" + d.x + "," + d.y + ")"
        })
        .on("click", nodeclick)  // add array
        .on("contextmenu", function (d, i) {
            //create tooltips
            tooltip = get_tooltip(d);
            d3.event.preventDefault();
            tooltip.html(function () {
                return format_name(d, false);
            });
            $('#' + d.id + '-tprm').click(function () {
                $('#' + d.id + '-tp').remove();
            });

            $('#' + d.id + '_rm').click(function () {
                select_Node(d);
                $(".tooltip").remove();
            });
            $('#' + d.id + '_rz').click(function () {
                var size = $('#' + d.id + '_ls').val();
                //console.log(d3.select('#'+d.id).datum());
                if (typeof(parseInt(size)) == 'number') {
                    //$('#'+d.id+'-txt').text('oooop');
                    $('#' + d.id + '-txt').text(String(d3.select('#' + d.id).datum().name).substr(0, size) + "...").css("font-size", "12px");

                }
                else {
                    alert('Please give me number!');
                }
            });

            $('#' + d.id + '-tp').dialog({
                width: "auto",
                height: "auto"
            });

        });

    inode
        .append('rect')
        .attr('width', 10)
        .attr('height', rect_height)
        .attr('fill', function (d) {
            if (d.rateLimit !== undefined && d.rateLimit)     //You need to set rateLimit attribute
            {
                return "#00f";
            }
            else {
                return "#666666";//f46d43
            }
        })
        .attr('pointer-events', 'all');

    inode.append('rect')
        .attr('width', function (d) {       //Yongnan
            if (maxInnerLinks == 0)
                return 0;
            return 20 + Math.floor(rect_width * d.related_links.length / maxInnerLinks)
        })
        .attr('x', 10)
        .attr('height', rect_height)
        .attr('id', function (d) {
            return d.id;
        })
        .attr('fill', function (d) {
//            return "#f46d43"
            if (d.regulation == undefined)
                return "#f46d43";
            else if (d.regulation == "Up")
                return "#ffff00";
            else if (d.regulation == "Down")
                return "#00ff00";
        })
        .attr('pointer-events', 'all');

    inode.append("text")
        .attr('id', function (d) {
            return d.id + '-txt';
        })
        .attr('text-anchor', 'middle')
        .attr("transform", "translate(" + (rect_width / 2 + 10) + ", " + rect_height * .75 + ")")
        .text(function (d) {
            return trimLabel(d.name, 'inner');
        })    //d.name change to two lines or only show the fixed width of string and show all when hover
        .each(function (d) {
            d.bx = this.getBBox().x;
            d.by = this.getBBox().y;
            d.bwidth = this.getBBox().width;
            d.bheight = this.getBBox().height;
        });

    d3.select(self.frameElement).style("height", diameter - 150 + "px");

    var FizzyText = function () {
        this.saveData = function () {
            var data_download = '';
            //console.log("save current data!");
            data.links.forEach(function (d) {
                data_download = data_download + d.inner.name + '\t' + d.outer.name + '\n';
                //console.log(d.inner.name + '\t' + d.outer.name + '\n');
            });
            $.post('save.php', {data: data_download, type: 'subset'}, function (file) {   //here type:subset is txt file type
                window.location.href = "download.php?path=" + file;
            });
        };
        this.svg = function () {
            var img_download = '';
            img_download = document.getElementById("svgID");

            var svg_xml = (new XMLSerializer).serializeToString(img_download);
            //console.log(svg_xml);

            $.post('save.php', {data: svg_xml, type: 'svg'}, function (file) {   //here type:subset is txt file type
                window.location.href = "download.php?path=" + file;
            });
        };
        this.svgToPNG = function () {
            window.open("http://image.online-convert.com/convert-to-png");
        };
        this.subset = function () {
            if (window.gui_flag) {
                alert('can not subset anymore!');
                return;
            }

            if (subsetObj.inner.length && subsetObj.outer.length) {
                d3.select("svg").remove();
                $("#menuID").remove();
                $(".tooltip").remove();
                $(".main").remove();  //remove the old gui
                window.gui_flag = true;
                window._data = data;

                loadData(subsetObj, flag_egift);

            }
            else {
                alert("Please selected nodes and edges!");
            }

        };
        this.loadFile = function () {
            $('#myInput').click();
        };
        this.load = function () {
            var selected_file = $('#myInput').get(0).files[0];
            if (selected_file === undefined /*&& selectValue === null*/) {
                alert("Please select data file!");
            }
            else if (selected_file !== undefined /*&& selectValue === null*/) {
                var reader = new FileReader();
                reader.readAsText(selected_file, "UTF-8");
                reader.onerror = function () {
                };
                reader.onprogress = function (event) {
                };

                reader.onload = function () {
                    var tempdata = "";
                    tempdata = reader.result;
                    if (tempdata != null) {
                        tempdata = tempdata.replace(/\r\n/g, '\n');
                        tempdata = tempdata.replace(/\r/g, '\n');
                        var symbolRegulation = tempdata.split("\n");
                        if (symbolRegulation[0].indexOf("regulation") == -1 || symbolRegulation.length < 2) {
                            alert("Gene expression is a tab-delimited format whose first line begins with symbol and regulation.");
                            return;
                        }
                        var symbolRegulations = {};
                        symbolRegulations.symbols = [];
                        symbolRegulations.regulations = [];
                        for (var i = 1; i < symbolRegulation.length; ++i) {
                            if (symbolRegulation[i] == "")
                                continue;
                            var tmps = symbolRegulation[i].split("\t");
                            symbolRegulations.symbols.push(tmps[0]);
                            symbolRegulations.regulations.push(tmps[1]);
                        }
                        for (var i = 0; i < data.inner.length; ++i) {
                            var index = symbolRegulations.symbols.indexOf(data.inner[i].name);
                            if (index > -1) {
                                data.inner[i].regulation = symbolRegulations.regulations[index];
                            }
                        }
                        for (var i = 0; i < data.outer.length; ++i) {
                            var index = symbolRegulations.symbols.indexOf(data.outer[i].name);
                            if (index > -1) {
                                data.outer[i].regulation = symbolRegulations.regulations[index];
                            }
                        }
                        d3.select("svg").remove();
                        $("#menuID").remove();
                        $(".tooltip").remove();
                        $(".main").remove();

                        loadData(data, flag_egift);
                    }
                };
            }
        };
        this.switchNode = function () {
            var newData = [];
            for (var i = 0; i < data.outer.length; ++i) {
                var tmpData = [];
                tmpData.push(data.outer[i].name);
                var tmpdata = [];
                for (var j = 0; j < data.outer[i].related_nodes.length; ++j) {
                    if (getInnerNameById(data.outer[i].related_nodes[j]) !== null) {
                        tmpdata.push(getInnerNameById(data.outer[i].related_nodes[j]).name);
                    }
                }
                if (tmpdata.length > 0) {
                    tmpData.push(tmpdata);
                }
                newData.push(tmpData);
            }
            d3.select("#svgID").remove();
            $("#menuID").remove();
            $(".tooltip").remove();
            $(".main").remove();

            renderNodes(newData);
        };
        this.innerLegend = function () {

            addInnerLegend();
        };
        this.outerLegend = function () {

            addOuterLegend();
        };
        this.innersmallerLength = "5";
        this.innergreaterLength = "0";
        var _this = this;
        this.innerCutoff = function () {
            var smallLength = parseInt(_this.innersmallerLength);
            var greatLength = parseInt(_this.innergreaterLength);
            var cutoffObj = {};
            cutoffObj.inner = [];
            cutoffObj.outer = [];
            cutoffObj.links = [];
            //for(var i=0; i<data.inner.length; ++i)
            //{
            //     if(data.inner[i].related_links.length>=greatLength && data.inner[i].related_links.length<=smallLength)
            //     {
            //         cutoffObj.inner.push(data.inner[i]);
            //         for(var j=0; j<data.inner[i].related_links.length; j++)
            //         {
            //             if(getInnerNameById(data.inner[i].related_nodes[j])!==null)
            //             {
            //                 tmpdata.push(getInnerNameById(data.inner[i].related_nodes[j]));
            //             }
            //         }
            //     }
            //}
            d3.select("#svgID").remove();
            $("#menuID").remove();
            $(".tooltip").remove();
            $(".main").remove();  //remove the old gui
            window.gui_flag = true;
            window._data = data;
            //loadData(cutoffObjObj,flag_egift);
        };
        this.outersmallerLength = "5";
        this.outergreaterLength = "0";
        this.outerCutoff = function () {
            //var smallLength = parseInt(_this.outersmallerLength);
            //var greatLength = parseInt(_this.outergreaterLength);
            //var newTempData=[];
            //for(var i=0; i<data.outer.length; ++i)
            //{
            //    if(data.outer[i].related_links.length>=greatLength && data.outer[i].related_links.length<=smallLength)
            //    {
            //        newTempData.push(data.outer[i]);
            //    }
            //}
            //d3.select("#svgID").remove();
            //$("#menuID").remove();
            //$(".tooltip").remove();
            //$(".main").remove();  //remove the old gui
            //window.gui_flag = true;
            //window._data = data;
            //
            //loadData(newTempData,flag_egift);
        };
        if (window.gui_flag) {
            this.goBack = function () {
                if (!window.gui_flag) {
                    alert("Already original data, can not go back any more!");
                    return;
                }
                d3.select("svg").remove();
                $(".main").remove();  //remove the old gui
                loadData(window._data, flag_egift);
                subsetObj = {};
                subsetObj.inner = [];
                subsetObj.outer = [];
                subsetObj.links = [];
                selectedObj = {};
                selectedObj.related_nodes = [];
                selectedObj.related_links = [];
                window.gui_flag = false;
            };
        }
    };

    function getInnerNameById(id) {
        for (var i = 0; i < data.inner.length; ++i) {
            if (data.inner[i].id == id) {
                return data.inner[i];
            }
        }
        return null;
    }

    var text = new FizzyText();
    var gui = new dat.GUI();
    gui.add(text, 'switchNode').name('Switch');
    if (flag_egift) {
        var legend = gui.addFolder('Legend');
        legend.add(text, 'innerLegend').name('Show Inner Legend');
        legend.add(text, 'outerLegend').name('Show Outer Legend');
    }

    var loadFile = gui.addFolder('Load File');
    loadFile.add(text, 'loadFile').name('Choose Data File');
    loadFile.add(text, 'load').name('Load');
    var Save = gui.addFolder('Save');
    Save.add(text, 'saveData').name('Save Data');
    var f1 = Save.addFolder('Save Image');
    f1.add(text, 'svg').name('Save as SVG');
    f1.add(text, 'svgToPNG').name('SVG to PNG');
    gui.add(text, 'subset').name('Subset Data');
    if (window.gui_flag) {
        gui.add(text, 'goBack').name('Previous Graph');
    }

    var cutoffLength = gui.addFolder('Cutoff Length');
    var innercutoffLength = cutoffLength.addFolder('Inner Edge Cutoff');
    innercutoffLength.add(text, 'innersmallerLength').name("Cutoff # <");
    innercutoffLength.add(text, 'innergreaterLength').name("Cutoff # >");
    innercutoffLength.add(text, 'innerCutoff').name('Subset');

    var outercutoffLength = cutoffLength.addFolder('Outer Cutoff Length');
    outercutoffLength.add(text, 'outersmallerLength').name("Cutoff # <");
    outercutoffLength.add(text, 'outergreaterLength').name("Cutoff # >");
    outercutoffLength.add(text, 'outerCutoff').name('Subset');
//remove highlighted nodes and edges
//document.body.addEventListener("click", function() {
    $("#svgID")[0].addEventListener("click", function () {
        //console.log("clsvg");
        bgclick(selectedObj);
        subsetObj = {};
        subsetObj.inner = [];
        subsetObj.outer = [];
        subsetObj.links = [];
        // change all selected nodes'clickFlag  to default false
        //console.log(selectedObj.related_nodes);
        for (var i = 0; i < selectedObj.related_nodes.length; i++) {
            //console.log(d3.select("#"+selectedObj.related_nodes[i]));
            if (d3.select("#" + selectedObj.related_nodes[i])[0][0] != null) {
                d3.select("#" + selectedObj.related_nodes[i]).datum().clickFlag = false;
            }
        }
        selectedObj = {};
        selectedObj.related_nodes = [];
        selectedObj.related_links = [];
        //tooltip.style("opacity", 0);
        $(".tooltip").remove();

    });


////*************************small functions*************************
    function get_tooltip(d) {
        if (d) {
            var tooltip = d3.select("body")
                .append("div")
                .attr("class", "tooltip")
                .attr("id", d.id + '-tp')
                .attr("title", "Tool")
                //.style("width","150px")
                //.style("height","200px")
//	    .style("overflow","scroll")
//            .style("border-radius", "6px")
//	    .style("background-color","#fff")
//	    .style("font-family","arial, helvetica, sans-serif")
//	    .style("padding-top","5px")
//	    .style("padding-left","5px")
//	    //.style("opacity",0.9)
//            .style("position", "absolute")
                .style("z-index", "200");
        }
        else {
            var tooltip = d3.select("body")
                .append("div")
                .attr("class", "tooltip")
                .attr("id", 'img-tp')
                .attr("title", "Tool")
//	    .style("width","150px")
//	    .style("height","200px")
//	    .style("overflow","scroll")
//            .style("border-radius", "6px")
//	    .style("background-color","#fff")
//	    .style("font-family","arial, helvetica, sans-serif")
//	    .style("padding-top","5px")
//	    .style("padding-left","5px")
//	    .style("opacity",0.9)
//            .style("position", "absolute")
                .style("z-index", "200");
        }


        return tooltip;
    }

    function get_color(name)    // *** this function is not so useful for non-numeric data
    {
        var c = Math.round(color(name));
        if (isNaN(c))
            return '#dddddd';	// fallback color

        return colors[c];
    }

// Can't just use d3.svg.diagonal because one edge is in normal space, the
// other edge is in radial space. Since we can't just ask d3 to do projection
// of a single point, do it ourselves the same way d3 would do it.  


    function nodeclick(d) {
        // bring to front
        //should I go from data or class value???????????????????????
        if (d.clickFlag) {
            d.clickFlag = !d.clickFlag;
            //console.log('double click node');

            // remove selected nodes from selected object and it's related nodes
            for (var i = 0; i < selectedObj.related_nodes.length; i++) {
                if (selectedObj.related_nodes[i] == d.id) {
                    removeObj.related_nodes.push(d.id);
                    selectedObj.related_nodes.splice(i, 1);  //remove all clicked nodes in the selected obj

                }
            }
            for (var i = 0; i < d.related_nodes.length; i++) {
                for (var j = 0; j < selectedObj.related_nodes.length; j++) {
                    if (selectedObj.related_nodes[j] == d.related_nodes[i]) {
                        selectedObj.related_nodes.splice(j, 1);
                        removeObj.related_nodes.push(d.related_nodes[i]);
                        break;   // only remove one related nodes in case another selected node share the same related nodes
                    }
                }
            }
            //remove edges all remove no need to consider shared edges
            for (var i = 0; i < d.related_links.length; i++) {
                for (var j = 0; j < selectedObj.related_links.length; j++) {
                    if (selectedObj.related_links[j] == d.related_links[i]) {
                        selectedObj.related_links.splice(j, 1);
                        removeObj.related_links.push(d.related_links[i]);
                    }
                }
            }
            //console.log('remove----selected obj');
            //console.log(removeObj);
            //console.log(selectedObj);
            // remove the color from double clicked nodes and its related nodes
            // remove the color from removeObj, if element in it is not in selectedObj, make the color grey, and then empty the removeObj.
            for (var i = 0; i < removeObj.related_nodes.length; i++) {
                var flag = false; // remove the color, not in shared nodes
                for (var j = 0; j < selectedObj.related_nodes.length; j++) {
                    if (selectedObj.related_nodes[j] == removeObj.related_nodes[i]) {
                        flag = true;
                        //console.log('shared nodes');
                        //console.log(selectedObj.related_nodes[j]);
                    }
                }
                if (flag) {
                    continue;
                }
                else {
                    if (removeObj.related_nodes[i].indexOf('i') > -1) {
                        for (var k = 0; k < subsetObj.inner.length; k++) {
                            if (subsetObj.inner[k].id == removeObj.related_nodes[i]) {
                                subsetObj.inner.splice(k, 1);
                            }
                        }
                    }
                    else {
                        for (var k = 0; k < subsetObj.outer.length; k++) {
                            if (subsetObj.outer[k].id == removeObj.related_nodes[i]) {
                                subsetObj.outer.splice(k, 1);
                            }
                        }
                    }

                    d3.select("#" + removeObj.related_nodes[i]).classed('highlight', false);
                    d3.select("#" + removeObj.related_nodes[i]).attr('stroke', '#dddddd');
                }
            }
            // also need to remove all the edeges color of clicked one
            for (var i = 0; i < removeObj.related_links.length; i++) {
                //remove link from subsetObj
                for (var j = 0; j < subsetObj.links.length; j++) {
                    if (subsetObj.links[j].id == removeObj.related_links[i]) {
                        subsetObj.links.splice(j, 1);
                    }
                }
                //remove color of clicked node's related edges
                d3.select('#' + removeObj.related_links[i]).attr('stroke-width', link_width);
                d3.select('#' + removeObj.related_links[i]).attr('stroke', '#dddddd');
            }

            //empty removeObj
            removeObj.related_nodes = [];
            removeObj.related_links = [];

        }
        else {

            var flag_node_type = 1;  // click inner
            d3.selectAll('.links .link').sort(function (a, b) {
                return d.related_links.indexOf(a.id);
            });
            d.clickFlag = !d.clickFlag;
            if (d.id.indexOf('i') > -1) {
                subsetObj.inner.push(d);  //here we need to remove the node.x  and node.y
                flag_node_type = 1;
            }
            else {
                subsetObj.outer.push(d);
                flag_node_type = 0;
            }

            if (flag_node_type) {// inner node clicked, related nodes are outer nodes
                //console.log('want to check!');
                //console.log(d);
                //console.log('end!');
                for (var i = 0; i < d.related_nodes.length; i++) {  // subset related nodes
                    for (var j = 0; j < data.outer.length; j++) {
                        if (data.outer[j].id == d.related_nodes[i]) {
                            //subset group click flag should be false???????????????????
                            if (subsetObj.outer.indexOf(data.outer[j]) > -1) {
                                continue;
                            } else {
                                subsetObj.outer.push(data.outer[j]);
                            }

                            //console.log('outer node---new method');
                        }
                    }
                    //console.log('outer node---new method');
                    //console.log(d3.select('#'+d.related_nodes[i]).datum());    //don't know why it's not working
                    //subsetObj.outer.push(d3.select('#'+d.related_nodes[i]).datum());
                    //add nodes

                    selectedObj.related_nodes.push(d.related_nodes[i]);

                    //d3.select('#' + d.related_nodes[i]).datum().flag;

                    d3.select('#' + d.related_nodes[i]).classed('highlight', true);
                    d3.select('#' + d.related_nodes[i] + '-txt').attr("font-weight", 'bold');

                }
            }
            else {
                //outer node clicked

                for (var i = 0; i < d.related_nodes.length; i++) {
                    for (var j = 0; j < data.inner.length; j++) {
                        if (data.inner[j].id == d.related_nodes[i]) {
                            if (subsetObj.inner.indexOf(data.inner[j]) > -1) {
                                continue;
                            } else {
                                subsetObj.inner.push(data.inner[j]);
                            }

                        }
                    }
                    //add nodes
                    selectedObj.related_nodes.push(d.related_nodes[i]);
                    //console.log("duplicated inner node?");
                    //console.log(selectedObj.related_nodes);
                    d3.select('#' + d.related_nodes[i]).classed('highlight', true);
                    d3.select('#' + d.related_nodes[i] + '-txt').attr("font-weight", 'bold');
                    //if (d3.select('#' + d.related_nodes[i]).attr("clickFlag") == undefined){
                    //    d3.select('#' + d.related_nodes[i]).attr("clickFlag",1);
                    //}
                    //else{
                    //    d3.select('#' + d.related_nodes[i]).attr("clickFlag",(parseFloat(d3.select('#' + d.related_nodes[i]).attr("clickFlag"))+1));
                    //}

                }


            }

            //console.log(d);
            for (var i = 0; i < d.related_links.length; i++) {
                for (var j = 0; j < data.links.length; j++) {
                    if (data.links[j].id == d.related_links[i]) {
                        subsetObj.links.push(data.links[j]);
                    }
                }
                selectedObj.related_links.push(d.related_links[i]);
                d3.select('#' + d.related_links[i]).attr('stroke-width', '5px');
                d3.select('#' + d.related_links[i]).attr('stroke', 'red');  // add the red color (modified by myself)
            }
        }
        d3.event.stopPropagation();
    }

// click background, normalize all highlighted lines of selected nodes
    function bgclick(d) {
        if (d.related_nodes == null) {
            return;
        }
        //console.log('selectedNode');
        //console.log(d);
        for (var i = 0; i < d.related_nodes.length; i++) {
            //console.log('relatedNodes:'+d.related_nodes[i]);
            //console.log('relatedNodes:'+d3.select('#' + d.related_nodes[i]).);

            d3.select('#' + d.related_nodes[i]).classed('highlight', false);

            d3.select('#' + d.related_nodes[i] + '-txt').attr("font-weight", 'normal');
        }
        //console.log(d3.select(this));

        for (var i = 0; i < d.related_links.length; i++) {
            d3.select('#' + d.related_links[i]).attr('stroke-width', link_width);
            d3.select('#' + d.related_links[i]).attr('stroke', '#dddddd');
        }
        //console.log('I am in bgclick function');
        // //empty seleted Object
        d = {};
    }

// tooltip function
    function format_name(d, edge) {
        //console.log(name)
        if (edge) {
            //console.log(d);
            var menu_pop = '<div>Gene: ' + d.inner.name + '</div>'
                + '<div> symbol: ' + d.outer.name + '</div>';
            if (flag_egfit) {
                menu_pop = menu_pop + '<div>Link To : <a href="http://www.ncbi.nlm.nih.gov/gquery/?term=' + d.inner.name + '+' + d.outer.name + '" target = "_blank"><button>NCBI</button></a></div>'
                    + '<div>Link To : <a href="http://biotm.cis.udel.edu/udelafc/getSentencePage.php?user=liang&pass=SentencesForLiang&redirect=yes&gene=' + d.inner.name + '&term=' + d.outer.name.toLowerCase() + '" target = "_blank"><button>eGIFT</button></a></div>';

            }

        }
        else {
            var name = d.name;
            var menu_pop = '<div> Title: ' + name + '</div>';
            if (flag_egift) {
                menu_pop = menu_pop + '<div>Link To : <a href="http://www.ncbi.nlm.nih.gov/gquery/?term=' + name + '" target = "_blank"><button>NCBI</button></a></div>';

            }

            menu_pop = menu_pop + '<div>Node : <button id=' + d.id + '_rm>Remove</button></div>'
                + '<div>Label Size: <input type="text" id=' + d.id + '_ls size="2"><lable> characters </lable><button id=' + d.id + '_rz>Resize</button></div>';

        }
        //remove selected nodes and related edges
        return  menu_pop;
    }

    function select_Node(d) {
        //get the nodes and node connected edges
        if (d.id.indexOf('i') > -1) {
            for (var i = 0; i < data.inner.length; i++) {
                if (data.inner[i].id == d.id) {
                    //console.log('match inner');
                    data.inner.splice(i, 1);
                }
            }
        }


        //if outer nodes
        if (d.id.indexOf('o') > -1) {
            //console.log(d.id);
            for (var i = 0; i < data.outer.length; i++) {
                //console.log(data.outer[i].id);
                if (data.outer[i].id == d.id) {
                    //console.log('match outer');

                    data.outer.splice(i, 1);
                }
            }
        }
        //console.log(d.related_links);
        for (var i = 0; i < data.links.length; i++) {
            //console.log(data.links[i].id);
            for (var j = 0; j < d.related_links.length; j++) {
                if (data.links[i].id == d.related_links[j]) {
                    data.links.splice(i, 1);
                }
            }
        }

        d3.select("svg").remove();  //remove svg
        //$("#menuID").remove();  //remove div menu
        $(".main").remove();  //remove the old gui
        loadData(data, flag_egift);
        //tooltip.remove();
    }

    function trimLabel(label, type) {
        if (type == 'inner') {
            if (label.length > 1135) {
                return String(label).substr(0, 1135) + "...";
            }
            else {
                return label;
            }
        } else {
            if (label.length > 200) {
                return String(label).substr(0, 200) + "...";
            }
            else {
                return label;
            }
        }
    }

}



