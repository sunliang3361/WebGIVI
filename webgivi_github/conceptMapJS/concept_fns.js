var SORTOUTERFLAG = "OuterLength";
var SORTINNERFLAG = "Default";
var UpExpressed = "Up expressed";
var DownExpressed = "Down expressed";
//window.conceptFile_name = 'Pineal';
//window.conceptFile_name ='';

function loadData(data, flag_egift) {
    //console.log(data);
    //
    outer = data.outer;
    if (SORTOUTERFLAG === "OuterLength") {
        sortOuterByNameLength(data.outer);
    }
    else if (SORTOUTERFLAG === "OuterFrequency") {
        sortOuterByNodesFrequency(data.outer);
    }
    else if (SORTOUTERFLAG === "OuterRateLimited") {
        sortOuterByNodesRateLimited(data.outer);
    }
    function compare(a, b) {
        if (a.name.length > b.name.length)
            return -1;
        if (a.name.length < b.name.length)
            return 1;
        return 0;
    }
    function sortDefault(inner) {
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
        inner_odd = inner_odd.reverse();
        return inner = inner_odd.concat(inner_even);
    }

    if (SORTINNERFLAG === "Default") {
        data.inner = sortDefault(data.inner);
    }
    else if (SORTINNERFLAG === "InnerLength") {
        sortInnerByNameLength(data.inner);
    }
    else if (SORTINNERFLAG === "InnerFrequency") {
        sortInnerByNodesFrequency(data.inner);
    }
    else if (SORTINNERFLAG === "InnerRateLimited") {
        sortInnerByNodesRateLimited(data.inner);
    }

    function sortOuterByNameLength(outer) {
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

    function sortOuterByNodesFrequency(outer) {
        var swapped;
        do {
            swapped = false;
            for (var i = 0; i < outer.length - 1; ++i) {
                if (outer[i].related_links.length < outer[i + 1].related_links.length) {
                    var tmp = outer[i];
                    outer[i] = outer[i + 1];
                    outer[i + 1] = tmp;
                    swapped = true;
                }
            }
        } while (swapped)
    }

    function sortOuterByNodesRateLimited(outer) {

        for (var i = 0; i < outer.length; ++i) {
            if (outer[i].rateLimit !== undefined)
                if (outer[i].rateLimit) {
                    outer.splice(0, 0, outer.splice(i, 1)[0]);
                }
        }
    }

    function sortInnerByNameLength(inner) {
        var swapped;
        do {
            swapped = false;
            for (var i = 0; i < inner.length - 1; ++i) {
                if (inner[i].name.length > inner[i + 1].name.length) {
                    var tmp = inner[i];
                    inner[i] = inner[i + 1];
                    inner[i + 1] = tmp;
                    swapped = true;
                }
            }
        } while (swapped)
    }

    function sortInnerByNodesFrequency(inner) {
        var swapped;
        do {
            swapped = false;
            for (var i = 0; i < inner.length - 1; ++i) {
                if (inner[i].related_links.length < inner[i + 1].related_links.length) {
                    var tmp = inner[i];
                    inner[i] = inner[i + 1];
                    inner[i + 1] = tmp;
                    swapped = true;
                }
            }
        } while (swapped)
    }

    function sortInnerByNodesRateLimited(inner) {

        for (var i = 0; i < inner.length; ++i) {
            if (inner[i].rateLimit !== undefined)
                if (inner[i].rateLimit) {
                    inner.splice(0, 0, inner.splice(i, 1)[0]);
                }
        }
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
    diameter = diameter > il * rect_height ? diameter : (il * rect_height + 40);

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

    function basicString(string, label) {
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

//    var ringSpacing = getStringLength(maxString);      //40chars 239
    function basicDivString(string, label) {
        var tmp = '';
        tmp += '<div id=' + "legend_" + string + ' class="widget shadow drag" style="position: absolute; left:0px; ' +
            'top:400px; width: 220px; height: 160px;">';
        tmp += '<div class="dragheader">' + label;
        tmp += '<span class="close" >X</span>';
        tmp += '</div>';
        tmp += '<div id=' + "divBody_" + string + '>';

        tmp += '</div>';
        tmp += '</div>';
        return tmp;
    }

    if (!$('#legend_dataFile').length) {
        adddconceptFileName();
    }

    //only show legend when if it's eGIFT data
    if (flag_egift) {
        addInnerLegend();
        addOuterLegend();
    }
    //添加legend名字 添加前判断 是否已经存在，若是，就删掉，之后按需添加
    function adddconceptFileName() {
        //添加legend名字 添加前判断 是否已经存在，若是，就删掉，之后按需添加
        if (window.conceptFile_name == "" || window.conceptFile_name == null)
            return;
        if ($('#legend_expressionFile').length) {
            $('#legend_expressionFile').remove();
        }
        var vcdiv = $(basicString("expressionFile", "File Name")).css({
            top: 10,
            height: 40
        });

        $('body').append(vcdiv);
        $(".drag").draggable();

        var parent = $('#legend_expressionFile');
        parent.find(".close").click(function () {
            parent.remove();
        });
        $('#legend_expressionFile').css({left: 0, top: 50, height: 60});
        var len = 220 - getStringLength("File Name") - 30;
        if (len < 0) {
            len = 0;
        }
        parent.find('.close').css({
            left: len
        })
        //if(typeof string == "string")
        //{
        //    if (string.length > 23) {
        //        var string = "Expression file: " + string.substr(0, 23) + "...";
        //    }
        //    else
        //    {
        //        var string = "Expression file: " + string;
        //    }
        //
        //}
        var expressionFileSvg = d3.select('#divBody_expressionFile').append('svg').attr("top", 20).attr("width", 220).attr("height", 40).append("g");

        if (!(window.conceptFile_name == "")) {
            if (window.conceptFile_name.length > 23) {
                var conceptFile_name = "Concept name: " + window.conceptFile_name.substr(0, 23) + "...";
            }
            else {
                var conceptFile_name = "Concept name: " + window.conceptFile_name;
            }
            expressionFileSvg
                .append('text')
                .attr("x", 5)
                .attr("y", 20)
                .text(conceptFile_name);
            //expressionFileSvg
            //    .append('text')
            //    .attr("x", 5)
            //    .attr("y", 40)
            //    .text(string);
        }
    }

    function addExpressionFile(string) {
        if (string == "" || string == undefined)
            return;
        if ($('#legend_expressionFile').length) {
            $('#legend_expressionFile').remove();
        }
        if ($('#legend_dataFile').length) {
            $('#legend_dataFile').remove();
        }
        var vcdiv = $(basicString("dataFile", "File Name")).css({
            top: 10,
            height: 60
        });

        $('body').append(vcdiv);
        $(".drag").draggable();

        var parent = $('#legend_dataFile');
        parent.find(".close").click(function () {
            parent.remove();
        });
        $('#legend_dataFile').css({left: 0, top: 50, height: 80});
        var len = 220 - getStringLength("File Name") - 30;
        if (len < 0) {
            len = 0;
        }
        parent.find('.close').css({
            left: len
        })
        if (typeof string == "string") {
            if (string.length > 23) {
                if (CUSTOMEDATA) {
                    var string = "Custom file: " + string.substr(0, 23) + "...";
                }
                else {
                    var string = "Expression file: " + string.substr(0, 23) + "...";
                }

            }
            else {
                if (CUSTOMEDATA) {
                    var string = "Custom file: " + string;
                }
                else {
                    var string = "Expression file: " + string;
                }
            }

        }
        var expressionFileSvg = d3.select('#divBody_dataFile').append('svg').attr("top", 20).attr("width", 220).attr("height", 60).append("g");

        if (window.conceptFile_name == '') {
            expressionFileSvg.attr("transform", "translate(" + (5) + "," + (20) + ")").append('text').text(string);
        }
        else {
            if (window.conceptFile_name.length > 23) {
                var conceptFile_name = "Concept name: " + window.conceptFile_name.substr(0, 23) + "...";
            }
            else {
                var conceptFile_name = "Concept name: " + window.conceptFile_name;
            }
            expressionFileSvg
                .append('text')
                .attr("x", 5)
                .attr("y", 20)
                .text(conceptFile_name);
            expressionFileSvg
                .append('text')
                .attr("x", 5)
                .attr("y", 40)
                .text(string);
        }
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
            .text(UpExpressed);

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
            .text("Ratelimit+" + UpExpressed);


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
            .text(DownExpressed);

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
            .text("Ratelimit+" + DownExpressed);


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
            .text(UpExpressed);

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
            .text("Ratelimit+" + UpExpressed);


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
            .text(DownExpressed);

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
            .text("Ratelimit+" + DownExpressed);
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
            return {"x": d.outer.y * Math.cos(projectX(d.outer.x)),   //角度转成实际位置
                "y": -d.outer.y * Math.sin(projectX(d.outer.x))};
        })
        .target(function (d) {
            return {"x": d.inner.y + rect_height / 2,        //实际位置
                "y": d.outer.x > 180 ? d.inner.x : d.inner.x + rect_width};
        })
        .projection(function (d) {
            return [d.y, d.x];
        });

    function projectX(x) {
        return ((x - 90) / 180 * Math.PI) - (Math.PI / 2);
    }

    //下面是缩放 navigation相关的
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

        xValue = 0;
        yValue = 0;
        zoomValue = 1;
        d3.select("#svgZoomContainer").attr("transform", "translate(" + xValue + "," + yValue + ")scale(" + zoomValue + ")");
    });
    d3.select("#moveLeft").on("click", function () {
        var transformString = d3.transform($("#svgZoomContainer").attr("transform"));
        xValue = parseFloat(transformString.translate[0]) - 5;
        yValue = parseFloat(transformString.translate[1]);
        zoomValue = parseFloat(transformString.scale[0]);
        d3.select("#svgZoomContainer").attr("transform", "translate(" + (xValue) + "," + (yValue) + ")scale(" + zoomValue + ")");
//        xValue =0;
    });
    d3.select("#moveRight").on("click", function () {
        var transformString = d3.transform($("#svgZoomContainer").attr("transform"));
        xValue = parseFloat(transformString.translate[0]) + 5;
        yValue = parseFloat(transformString.translate[1]);
        zoomValue = parseFloat(transformString.scale[0]);
        d3.select("#svgZoomContainer").attr("transform", "translate(" + (xValue) + "," + (yValue) + ")scale(" + zoomValue + ")");
//        xValue = 0;
    });
    d3.select("#moveUp").on("click", function () {
        var transformString = d3.transform($("#svgZoomContainer").attr("transform"));
        xValue = parseFloat(transformString.translate[0]);
        yValue = parseFloat(transformString.translate[1]) - 5;
        zoomValue = parseFloat(transformString.scale[0]);
        d3.select("#svgZoomContainer").attr("transform", "translate(" + (xValue) + "," + (yValue) + ")scale(" + zoomValue + ")");
//        yValue=0;
    });
    d3.select("#moveDown").on("click", function () {
        var transformString = d3.transform($("#svgZoomContainer").attr("transform"));
        xValue = parseFloat(transformString.translate[0]);
        yValue = parseFloat(transformString.translate[1]) + 5;
        zoomValue = parseFloat(transformString.scale[0]);
        d3.select("#svgZoomContainer").attr("transform", "translate(" + (xValue) + "," + (yValue) + ")scale(" + zoomValue + ")");
//        yValue=0;
    });

    d3.select("#zoomIn").on("click", function () {
        var transformString = d3.transform($("#svgZoomContainer").attr("transform"));
        xValue = parseFloat(transformString.translate[0]);
        yValue = parseFloat(transformString.translate[1]);
        zoomValue = parseFloat(transformString.scale[0]) + 0.1;
        d3.select("#svgZoomContainer").attr("transform", "translate(" + xValue + "," + yValue + ")scale(" + zoomValue + ")");
    });
    d3.select("#zoomOut").on("click", function () {
        var transformString = d3.transform($("#svgZoomContainer").attr("transform"));
        xValue = parseFloat(transformString.translate[0]);
        yValue = parseFloat(transformString.translate[1]);
        zoomValue = parseFloat(transformString.scale[0]) - 0.1;
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

//*************************draw links
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
            //---------------------------------------//
            tooltip = get_tooltip(d);

            tooltip.html(function () {
                return format_name(d, true);
            });

            $('#' + d.id + '-tp').dialog({
                width: "auto",
                height: "auto"
            });
            $('.tooltip').parent().css({
                left: d3.event.pageX + 10,
                top: d3.event.pageY - 10
            });
            d3.event.preventDefault();
            //---------------------------------------//
        });


//draw outer nodes
    var onode = zoomContainer.selectAll(".outer_node")
        .data(data.outer)
        .enter().append("g")
        .attr("class", "outer_node")
        .attr("transform", function (d) {
            return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
        })
        .on("click", nodeclick)
        .on("contextmenu", function (d, i) {
            //create tooltips                       //----------------------------------------//
            tooltip = get_tooltip(d);

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
            $('.tooltip').parent().css({
                left: d3.event.pageX + 10,
                top: d3.event.pageY - 10
            });
            d3.event.preventDefault();
        });
//-----------------draw circle------------------//
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
     //------------draw rect---------------//
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
            if (CUSTOMEDATA) {
                if (d.customColor === "1") {
                    return "#ffff00";
                }
                else
                    return "#f46d43";
            }
            else {
                if (d.regulation == undefined)
                    return "#f46d43";
                else if (d.regulation == "Up")
                    return "#ffff00";
                else if (d.regulation == "Down")
                    return "#00ff00";
            }
        });

    //------------draw text---------------//
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
        .attr("fill", function (d) {
            //if (d.searched === "1") {
            //    return "#ff0000";
            //}
            //else if (d.searched === "undefined") {
            //    return "#000000";
            //}
            //else
                return "#000000";
        })
        .text(function (d) {
            return trimLabel(d.name, 'outer');
        });

// draw inner nodes

    var inode = zoomContainer.selectAll(".inner_node")
        .data(data.inner)
        .enter().append("g")
        .attr("class", "inner_node")
        .attr("transform", function (d, i) {
            return "translate(" + d.x + "," + d.y + ")"
        })
        .on("click", nodeclick)  // add array
        .on("contextmenu", function (d, i) {
            //create tooltips  //-----------------------------------------------
            tooltip = get_tooltip(d);

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
            console.log(d3.event.pageX, d3.event.pageY);
            $('#' + d.id + '-tp').dialog({
                position: [d3.event.pageX + 10, d3.event.pageY - 10]
            });
            $('.tooltip').parent().css({
                left: d3.event.pageX + 10,
                top: d3.event.pageY - 10
            });
            d3.event.preventDefault();
            //-----------------------------------------------
        });
    //<line x1="5" y1="5" x2="40" y2="40" stroke="gray" stroke-width="5"  />

    //------------draw rect for ratelinited---------------//
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
    //------------draw rect for frequency---------------//
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
            if (CUSTOMEDATA) {
                if (d.customColor === "1") {
                    return "#ffff00";
                }
                else
                    return "#f46d43";
            }
            else {
                if (d.regulation == undefined)
                    return "#f46d43";
                else if (d.regulation == "Up")
                    return "#ffff00";
                else if (d.regulation == "Down")
                    return "#00ff00";
            }
        })
        .attr('pointer-events', 'all');
    //------------draw splitline between ratelimited and frequency---------------//
    //inode.append("line")
    //    .attr("x1", 10).attr("y1", 0)
    //    .attr("x2", 10).attr("y2", rect_height)
    //    .attr("stroke", "gray")
    //    .attr("fill", "gray")
    //    .attr("stroke-width", "2");
    //------------draw text---------------//
    inode.append("text")
        .attr('id', function (d) {
            return d.id + '-txt';
        })
        .attr('text-anchor', 'middle')
        //.attr("transform", "translate(" + (rect_width / 2 + 10) + ", " + rect_height * .75 + ")")
        .attr("transform", "translate(" + (rect_width / 2 ) + ", " + rect_height * .75 + ")")
        .text(function (d) {
            return trimLabel(d.name, 'inner');
        })    //d.name change to two lines or only show the fixed width of string and show all when hover
        .attr("fill", function (d) {
            //if (d.searched === "1") {
            //    return "#ff0000";
            //}
            //else if (d.searched === "undefined") {
            //    return "#000000";
            //}
            //else
                return "#000000";
        })
        .each(function (d) {
            d.bx = this.getBBox().x;
            d.by = this.getBBox().y;
            d.bwidth = this.getBBox().width;
            d.bheight = this.getBBox().height;
        });

    d3.select(self.frameElement).style("height", diameter - 150 + "px");

    //------------GUI---------------//
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
//	     svgAsDataUri($("#svgID")[0], {}, function(uri) {
//                window.open(uri);
//            });
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
                d3.select("#svgID").remove();    //=================================================================================================================================
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
        this.chooseColorFile = function () {
            $('#myInput').click();
        };
        this.upExpressed = UpExpressed;
        this.downExpressed = DownExpressed;

        this.colorNodeSample = function () {
            window.open('sampleData/symbolRegulation.txt', '_blank');
        };
        this.colorFileSample = function () {
            window.open('sampleData/colorSample.txt', '_blank');
        };
        this.load = function () {
            if (UpExpressed == "" || DownExpressed == "") {
                alert("Please input the expressed label!");
                return;
            }
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
                        d3.select("#svgID").remove();   //=================================================================================================================================
                        $("#menuID").remove();
                        $(".tooltip").remove();
                        $(".main").remove();

                        addExpressionFile(selected_file.name);
                        loadData(data, flag_egift);
                    }
                };
            }
        };
        this.loadColor = function () {
            var selected_colorfile = $('#myInput').get(0).files[0];
            if (selected_colorfile === undefined /*&& selectValue === null*/) {
                alert("Please select data file!");
            }
            else if (selected_colorfile !== undefined /*&& selectValue === null*/) {
                var reader = new FileReader();
                reader.readAsText(selected_colorfile, "UTF-8");
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
                        if (symbolRegulation[0].indexOf("state") == -1 || symbolRegulation.length < 2) {
                            alert("Color file is a tab-delimited format whose first line begins with name and state.");
                            return;
                        }
                        var symbolRegulations = {};
                        symbolRegulations.symbols = [];
                        symbolRegulations.customColor = [];
                        for (var i = 1; i < symbolRegulation.length; ++i) {
                            if (symbolRegulation[i] == "")
                                continue;
                            var tmps = symbolRegulation[i].split("\t");
                            symbolRegulations.symbols.push(tmps[0]);
                            symbolRegulations.customColor.push(tmps[1]);
                        }
                        for (var i = 0; i < data.inner.length; ++i) {
                            var index = symbolRegulations.symbols.indexOf(data.inner[i].name);
                            if (index > -1) {
                                data.inner[i].customColor = symbolRegulations.customColor[index];
                            }
                        }
                        for (var i = 0; i < data.outer.length; ++i) {
                            var index = symbolRegulations.symbols.indexOf(data.outer[i].name);
                            if (index > -1) {
                                data.outer[i].customColor = symbolRegulations.customColor[index];
                            }
                        }
                        d3.select("#svgID").remove();   //=================================================================================================================================
                        $("#menuID").remove();
                        $(".tooltip").remove();
                        $(".main").remove();

                        addExpressionFile(selected_colorfile.name);
                        loadData(data, flag_egift);
                    }
                };
            }
        }
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
            SymbolInInner = !SymbolInInner;
            renderNodes(newData);
        };
        this.innerLegend = function () {

            addInnerLegend();
        };
        this.inputSearchName = "";
        this.searchNode = function () {
            if (_this.inputSearchName === "")
                return;
            for (var i = 0; i < data.inner.length; ++i) {//Yongnan2015216
                if (_this.inputSearchName === data.inner[i].name) {
                    //data.inner[i].searched = "1";
                    d3.select("#"+data.inner[i].id+"-txt").attr("fill","#f00");
                }
            }
            for (var i = 0; i < data.outer.length; ++i) {
                if (_this.inputSearchName === data.outer[i].name) {
                    //data.outer[i].searched = "1";
                    d3.select("#"+data.outer[i].id+"-txt").attr("fill","#f00");
                }
            }
            //d3.select("#svgID").remove();   //=================================================================================================================================
            //$("#menuID").remove();
            //$(".tooltip").remove();
            //$(".main").remove();
            //loadData(data, flag_egift);
        };
        this.outerLegend = function () {

            addOuterLegend();
        };
        this.innersmallerLength = "200";
        this.innergreaterLength = "0";
        var _this = this;
        this.innerCutoff = function () {
            var smallLength = parseInt(_this.innersmallerLength);
            var greatLength = parseInt(_this.innergreaterLength);
            var cutoffObj = {};
            cutoffObj.inner = [];
            cutoffObj.outer = [];
            cutoffObj.links = [];
            tmp_outers = [];
            tmp_links = [];
            //console.log(data.inner);
            //console.log(data.links);
            for (var i = 0; i < data.inner.length; ++i) {   /*console.log('innder node'+i);
             console.log(data.inner[i].related_links);*/
                if (data.inner[i].related_links.length >= greatLength && data.inner[i].related_links.length <= smallLength) {
                    cutoffObj.inner.push(data.inner[i]);    // all inner data is extracted
                    for (var j = 0; j < data.inner[i].related_links.length; ++j) {
                        tmp_links.push(data.inner[i].related_links[j]); //get all related links id
                    }

                    for (var k = 0; k < data.inner[i].related_nodes.length; ++k) {
                        if (data.inner[i].related_nodes[k] != data.inner[i].id && tmp_outers.indexOf(data.inner[i].related_nodes[k]) == -1) {
                            tmp_outers.push(data.inner[i].related_nodes[k]); //get all related nodes id
                        }
                    }

                }
            }

            // get all realted real cutoffObj.links and cutoffObj.outer
            for (var i = 0; i < data.links.length; ++i) {
                for (var j = 0; j < tmp_links.length; ++j) {
                    if (data.links[i].id == tmp_links[j]) {
                        cutoffObj.links.push(data.links[i]);
                    }
                }
            }

            for (var i = 0; i < data.outer.length; ++i) {
                //here I don't remove some of related nodes from outer nodes
                for (var j = 0; j < tmp_outers.length; ++j) {
                    if (data.outer[i].id == tmp_outers[j]) {
                        cutoffObj.outer.push(data.outer[i]);
                    }
                }
            }


            d3.select("#svgID").remove();
            $("#menuID").remove();
            $(".tooltip").remove();
            $(".main").remove();  //remove the old gui
            window.gui_flag = true;
            window._data = data;

            loadData(cutoffObj, flag_egift);
        };
        this.outersmallerLength = "200";
        this.outergreaterLength = "0";
        this.outerCutoff = function () {
            var smallLength = parseInt(_this.outersmallerLength);
            var greatLength = parseInt(_this.outergreaterLength);
            var cutoffObj = {};

            cutoffObj.inner = [];
            cutoffObj.outer = [];
            cutoffObj.links = [];
            tmp_inners = [];
            tmp_links = [];

            for (var i = 0; i < data.outer.length; ++i) {   /*console.log('innder node'+i);
             console.log(data.inner[i].related_links);*/
                if (data.outer[i].related_links.length >= greatLength && data.outer[i].related_links.length <= smallLength) {

                    cutoffObj.outer.push(data.outer[i]);

                    // all inner data is extracted
                    for (var j = 0; j < data.outer[i].related_links.length; ++j) {
                        tmp_links.push(data.outer[i].related_links[j]); //get all related links id
                    }

                    for (var k = 0; k < data.outer[i].related_nodes.length; ++k) {
                        if (data.outer[i].related_nodes[k] != data.outer[i].id && tmp_inners.indexOf(data.outer[i].related_nodes[k]) == -1) {
                            tmp_inners.push(data.outer[i].related_nodes[k]); //get all related nodes id
                        }
                    }

                }
            }

            // get all realted real cutoffObj.links and cutoffObj.outer
            for (var i = 0; i < data.links.length; ++i) {
                for (var j = 0; j < tmp_links.length; ++j) {
                    if (data.links[i].id == tmp_links[j]) {
                        cutoffObj.links.push(data.links[i]);
                    }
                }
            }

            for (var i = 0; i < data.inner.length; ++i) {
                //here I don't remove some of related nodes from inner nodes
                for (var j = 0; j < tmp_inners.length; ++j) {
                    if (data.inner[i].id == tmp_inners[j]) {
                        cutoffObj.inner.push(data.inner[i]);
                    }
                }
            }


            d3.select("#svgID").remove();
            $("#menuID").remove();
            $(".tooltip").remove();
            $(".main").remove();  //remove the old gui
            window.gui_flag = true;
            window._data = data;

            loadData(cutoffObj, flag_egift);
        };
        this.sortOuterData = SORTOUTERFLAG;
        this.sortInnerData = SORTINNERFLAG;
        if (window.gui_flag) {
            this.goBack = function () {
                if (!window.gui_flag) {
                    alert("Already original data, can not go back any more!");
                    return;
                }
                d3.select("#svgID").remove();   //=================================================================================================================================
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
    //=================================================================================================================================
    if ($(".main")) {
        if ($(".ac")) {
            $(".ac").appendTo($("body"));
        }
        $(".main").remove();  //remove the old gui
    }
    //===============================================GUI=====================================================================

    var gui = new dat.GUI({ width: 360 });
    gui.add(text, 'switchNode').name('Switch');
    var searchNode = gui.addFolder('Search Node');
    searchNode.add(text, 'inputSearchName').name('Input Name');
    searchNode.add(text, 'searchNode').name('Search');
    if (flag_egift) {
        var legend = gui.addFolder('Legend');
        legend.add(text, 'innerLegend').name('Show Inner Legend');
        legend.add(text, 'outerLegend').name('Show Outer Legend');
    }
    if (!CUSTOMEDATA) {
        var loadFile = gui.addFolder('Load Expression File');
        var upExpressedControl = loadFile.add(text, 'upExpressed').name('Name Up Gene');
        upExpressedControl.onChange(function (value) {
            UpExpressed = value;
        });
        var downExpressedControl = loadFile.add(text, 'downExpressed').name('Name Down Gene');
        downExpressedControl.onChange(function (value) {
            DownExpressed = value;
        });
        loadFile.add(text, 'loadFile').name('Choose Data File');
        loadFile.add(text, 'colorNodeSample').name('Sample Data')
        loadFile.add(text, 'load').name('Load');
    }
    else {
        var loadColorFile = gui.addFolder('Load Color File');
        loadColorFile.add(text, 'chooseColorFile').name('Choose Data File');
        loadColorFile.add(text, 'colorFileSample').name('Sample Data')
        loadColorFile.add(text, 'loadColor').name('Load');
    }
    var sortOuterControl = gui.add(text, 'sortOuterData', [ 'OuterLength', 'OuterFrequency', 'OuterRateLimited' ]).name('sortOuterData').listen();
    var sortInnerControl = gui.add(text, 'sortInnerData', [ 'Default', 'InnerLength', 'InnerFrequency', 'InnerRateLimited' ]).name('sortInnerData').listen();
    sortOuterControl.onChange(function (value) {
        SORTOUTERFLAG = value;
        d3.select("#svgID").remove();   //=================================================================================================================================
        $("#menuID").remove();
        $(".tooltip").remove();
        $(".main").remove();
        loadData(data, flag_egift);
    });
    sortInnerControl.onChange(function (value) {
        SORTINNERFLAG = value;
        d3.select("#svgID").remove();   //=================================================================================================================================
        $("#menuID").remove();
        $(".tooltip").remove();
        $(".main").remove();
        loadData(data, flag_egift);
    });
    var Save = gui.addFolder('Save');
    Save.add(text, 'saveData').name('Save Data');
    var f1 = Save.addFolder('Save Image');
    f1.add(text, 'svg').name('Save as SVG');
    f1.add(text, 'svgToPNG').name('SVG to PNG');
    gui.add(text, 'subset').name('Subset Data');
    if (window.gui_flag) {
        gui.add(text, 'goBack').name('Previous Graph');
    }

    var cutoffLength = gui.addFolder('Filter');
    var innercutoffLength = cutoffLength.addFolder('Inner Data Filter');
    innercutoffLength.add(text, 'innersmallerLength').name("Edge number <="); ////////////?????????????????????????????????????????????????????????????????????????change
    innercutoffLength.add(text, 'innergreaterLength').name("Edge number >=");////////////?????????????????????????????????????????????????????????????????????????change
    innercutoffLength.add(text, 'innerCutoff').name('Select');

    var outercutoffLength = cutoffLength.addFolder('Outer Data Filter');
    outercutoffLength.add(text, 'outersmallerLength').name("Edge number <=");////////////?????????????????????????????????????????????????????????????????????????change
    outercutoffLength.add(text, 'outergreaterLength').name("Edge number >=");////////////?????????????????????????????????????????????????????????????????????????change
    outercutoffLength.add(text, 'outerCutoff').name('Select');
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
    function get_tooltip(d) {       //-----------------------------------------
        if (d3.select(".tooltip")) {
            if ($('.tooltip').parent())
                $('.tooltip').parent().remove();
            $('.tooltip').remove();
        }
        if (d) {
            var tooltip = d3.select("body")
                .append("div")
                .attr("class", "tooltip")
                .attr("id", d.id + '-tp')
                .attr("title", "Tool")
                .style("z-index", "200");
        }
        else {
            var tooltip = d3.select("body")
                .append("div")
                .attr("class", "tooltip")
                .attr("id", 'img-tp')
                .attr("title", "Tool")
                .style("z-index", "200");
        }
        //-----------------------------------------

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
                ////////////?????????????????????????????????????????????????????????????????????????change////////////?????????????????????????????????????????????????????????????????????????change
                //console.log('selectedObj');
                //console.log(selectedObj);
                //console.log(selectedObj.related_nodes.length);
                var existInInner = false;
                //here we use subsetObj to check whether inner node was selected already (different from the checking method when we need to push outer or inner node to subsetObj)
                for (var i = 0; i < subsetObj.inner.length; i++) {
                    if (subsetObj.inner[i].id == d.id) {
                        existInInner = true;
                    }
                }

                if (!existInInner) {
                    subsetObj.inner.push(d);
                }

                flag_node_type = 1;
                // if it's not in subset 
            }
            else {
                var existInOuter = false;
                for (var i = 0; i < subsetObj.outer.length; i++) {
                    if (subsetObj.outer[i].id == d.id) {
                        existInOuter = true;
                    }
                }
                if (!existInOuter) {
                    subsetObj.outer.push(d);
                }

                flag_node_type = 0;
                ////////////?????????????????????????????????????????????????????????????????????????change////////////?????????????????????????????????????????????????????????????????????????change
            }

            if (flag_node_type) {// inner node clicked, related nodes are outer nodes
//                console.log('want to check!');
//                console.log(d);
//                console.log('end!');
                for (var i = 0; i < d.related_nodes.length; i++) {  // subset related nodes
                    for (var j = 0; j < data.outer.length; j++) {
                        if (data.outer[j].id == d.related_nodes[i]) {
                            //subset group click flag should be false???????????????????
                            if (subsetObj.outer.indexOf(data.outer[j]) > -1) {
                                continue;
                            } else {
                                subsetObj.outer.push(data.outer[j]);
                            }
                        }
                    }

                    selectedObj.related_nodes.push(d.related_nodes[i]);

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
                    d3.select('#' + d.related_nodes[i]).classed('highlight', true);
                    d3.select('#' + d.related_nodes[i] + '-txt').attr("font-weight", 'bold');
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
                d3.select('#' + d.related_links[i]).attr('stroke-width', '2px');
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
            var menu_pop = '<div style="top:0;">Gene: ' + d.inner.name + '</div>'
                + '<div style="margin-top:3px"> symbol: ' + d.outer.name + '</div>'
                + '<div style="margin-top:5px">Link To : <a href="http://www.ncbi.nlm.nih.gov/gquery/?term=' + d.inner.name + '+' + d.outer.name + '" target = "_blank"><button>NCBI</button></a></div>'
                + '<div style="margin-top:5px">Link To : <a href="http://biotm.cis.udel.edu/udelafc/getSentencePage.php?user=liang&pass=SentencesForLiang&redirect=yes&gene=' + d.inner.name + '&term=' + d.outer.name.toLowerCase() + '" target = "_blank"><button>eGIFT</button></a></div>';
        }
        else {
            var name = d.name;
            var menu_pop = '<div style="top:0;"> Title: ' + name + '</div>';
            if (flag_egift) {
                menu_pop = menu_pop + '<div style="margin-top:3px">Link To : <a href="http://www.ncbi.nlm.nih.gov/gquery/?term=' + name + '" target = "_blank"><button>NCBI</button></a></div>';

            }

            menu_pop = menu_pop + '<div style="margin-top:5px">Node : <button id=' + d.id + '_rm>Remove</button></div>'
                + '<div style="margin-top:5px">Label Size: <input type="text" id=' + d.id + '_ls size="2"><lable> characters </lable><button id=' + d.id + '_rz>Resize</button></div>';

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

        d3.select("#svgID").remove();  //remove svg     //=================================================================================================================================
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



