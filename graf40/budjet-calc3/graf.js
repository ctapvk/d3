function gist8(data , prop ) {

    // console.log(data);
    svg = d3.select(".gist8");
    svg.selectAll("*").remove();

    widthSvg = +svg.attr("width");
    heightSvg = +svg.attr("height");
    width = +svg.attr("width") - +(prop.paddingLeft);
    height = +svg.attr("height") - +(prop.paddingBottom);

    asisX = svg.append("g")
        .attr("class", "asisX")
        .attr("transform", "translate(" + [widthSvg - width, height] + ")")
        .attr("width", width)
        .attr("height", heightSvg - height)
    ;
    gist = svg.append("g")
        .attr("class", "gist")
        .attr("transform", "translate(" + [widthSvg - width, height] + ")")
        .attr("width", width)
        .attr("height", height)
    ;
    asisY = svg.append("g")
        .attr("class", "asisY")
        .attr("transform", "translate(" + [0, 0] + ")")
        .attr("width", widthSvg - width)
        .attr("height", height)
    ;
    diff = 1.0;
    min = 0;
    max = +findMaxVal(data);
    y = d3.scaleLinear()
        .domain([min * diff, max * diff])
        .range([height, 0])
    ;

// console.log([max ,  min]);
    len =data.length ;
    size = ( +prop.barSize + +prop.spaceBetween) * len ;
    x = d3.scaleLinear()
        .domain([0, len])
        .range([+prop.gistPadding , size ])
    ;

    if (  size > widthSvg ) {
        sizeSvg = +prop.paddingLeft + size  +30;
        svg.attr("width" , sizeSvg  );
        d3.select('#someId').attr('viewBox' , "0 0 "+ sizeSvg + " 400") ;
    }

    rotText = "";
    barSize = +prop.barSize;

    drawBack(asisX);
    drawAsisY(asisY);
    showLegend(asisX);
    drawNach(gist);

    drawAsisX(gist);


    function drawAsisX(canvas) {

        line = d3.line().x(function (d) {
            return d[0]
        }).y(function (d) {
            return d[1]
        });
        canvas.append("path")
            .attr("transform", function (d) {
                return "translate(" + [0, -height + y(0)] + ")"
            })
            .attr("d", line([[0, 0], [size, 0]]))
            .attr("stroke-width", 4)
            .attr("stroke", "#CDD5DE")
        ;
    }

    function drawAsisY(canvas) {
        line = d3.line()
            .x(function (d) {
                return d[0]
            })
            .y(function (d) {
                return d[1]
            })
        ;
        canvas.append("path")
            .attr("transform", function (d) {
                return "translate(" + [0, 0] + ")"
            })
            .attr("d", line([[getElemWidth(canvas), 0], [getElemWidth(canvas), getElemHeight(canvas)]]))
            .attr("stroke-width", 4)
            .attr("stroke", "#CDD5DE")
        ;

        legend = canvas.append("g")
            .attr("transform", "translate(" + [getElemWidth(canvas), 0] + ")")
            .attr("class", "legend")
        ;

        y.ticks().forEach(function (dat, i) {
            if (i != y.ticks().length - 1) {
                text = legend.append("g")
                    .attr("transform", function (d) {
                        return "translate(" + [0, y(dat)] + ")"
                    })
                ;
                text.append("text")
                    .attr("class", "asisYcapiton")
                    .attr("transform", function (d) {
                        return "translate(" + [-10, 0] + ")"
                    })
                    .text(function (d) {
                        return currencySwap(dat)
                    })
                ;
                text.append("circle")
                    .attr("r", 5)
                    .attr("fill", "#CDD5DE")
                ;
            }
        })
        ;

        legend.append("text")
            .attr("class", "asisYcapiton")
            .attr("transform", "translate( " + [-10, 10] + ")")
            .text("руб.")
        ;
    }




    function drawBack(canvas) {
        rects = canvas.append("g").attr("class", "backRects");

        tis = y.ticks();
        backHei = y(tis[0]) - y(tis[1]);
        tis.forEach(function (d, i) {
            // console.log(y.ticks());
            if (i % 2 == 0) {
                rectHeight = y(d.planOut);
                rects.append("rect")
                    .attr("transform", function () {
                        return "translate( " + [0, y(d) - height] + ")";
                    })
                    .attr("width", width)
                    .attr("height", backHei)
                    .attr("fill", prop.backColor)
                ;
            }
        });
    }


    // div = d3.select("#noneDiv").append("div").attr("class", "tooltipOlolo").style("opacity", 0);
    div = d3.select("body").append("div").attr("class", "tooltipOlolo").style("opacity", 0);

    function drawNach(canvas) {
        rects = canvas.append("g");

        data.forEach(function (d, i) {

            rectHeight = y(d3.values(d));

            rects.append("rect")
                .attr("transform", function () {
                    return "translate( " + [x(i), -height + y(d3.values(d) )] + ")";
                })
                .attr("width", barSize)
                .attr("height", function () {
                    return -(rectHeight - y(0))
                })
                .attr("fill", prop.colors[i])
                .on("mousemove", function() {
                    div.transition().duration(200).style("opacity", .9);
                    div.html(  d3.keys(d) + ' : '+  currencySwapNoCut(d3.values(d)) )
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 30 ) + "px")
                    ;
                })
                .on("mouseout", function() { div.transition().duration(500).style("opacity", 0); })

            ;

            /*rects.append("text")
                .attr("class", "planGistLabel")
                .attr("transform", "translate( " + [x(i) + barSize / 2, -height + rectHeight - 15] + ")")
                .text(cutLongSum(d3.values(d)))
            ;*/
        });
    }


    function showLegend(canvas) {

        datas = canvas.append("g").attr("transform", "translate(0,0)");


        data.forEach(function (d, i) {
            datas.append("text")
                .attr("transform", " translate(" + [x(i) + barSize / 2, +prop.moveMounth] + ") ")
                .attr("class", "mounthLabes")
                .text(i+1)
            ;
        });

    }




    function findMaxVal(d) {
        max = 0;
        for (i in d)
            if (parseFloat(max) < parseFloat(d3.values(d[i])) ) max = d3.values(d[i]);
        return max;

    }


    function getElemWidth(el) {
        return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("width");
    }

    function getElemHeight(el) {
        return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("height");
    }

    function currencySwap(d) {
        // d = parseInt(d * 0.001);
        return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + "";
    }


    function cutLongText (str) {
        str = str[0];
        if (str.length > 22){
            return str.substr(0,22) + "..." ;
        }
        else
            return str ;
    }

    function breakLongText (str , limit) {
        str = str[0];

        if (str.length > limit){
            s="";
            if (str[limit-1]!=" ") for (i=limit;i< limit+10;i++) {
                if (str[i]==" ") {
                    limit=i+1;
                    break;
                }
            }
            s = "<tspan y='-20' x='0' dy='1.2em'>" + str.substr(0,limit) + "</tspan>" ;
            s += "<tspan x='0' dy='1.2em'>" + str.substr(limit) + "</tspan>" ;
            return s ;
        }
        else
            return str ;
    }


    function currencySwapWithText(d) {
        d= parseInt(parseFloat(d)*0.001 );
        return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " тыс. руб.";
    }

    function currencySwapNoCut(d) {
        d= (parseFloat(d) ).toFixed(2);
        d = d.toString().replace(".", ",")
        return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " руб.";
    }

    function cutLongSum(d) {
        if (+d > 1000)
            return d.toString().substr(0, 3);
        else
            return d;
    }


    printTable(data);
    function printTable(d){

        s="<table class='table-bughet-calc'> " ;
        s+="<tr>";
        s+="<td valign='top'>";
        for (i=0; i <11 ; i++){
            s+="<table> ";
            s+="<tr>";
            rect = '<svg width="20" height="20" ><rect width="20" height="20" fill="'+prop.colors[i]+'"></rect></svg>';
            s+="<td width='40px'>";
            s+= rect ;
            s+="</td>";
            s+="<td width='20px'>";
            s+= (i+1)  ;
            s+="</td>";
            s+="<td width='300px'>";
            s+= d3.keys(d[i]) ;
            s+="</td>";
            s+="<td width='90px'>";
            s+= currencySwapNoCut( d3.values(d[i]) );
            s+="</td>";
            s+="</tr>";
            s+="";
            s+="</table>";
        }
        s+="</td>";
        s+="<td valign='top'>";
        for (i=11; i <d.length ; i++){
            s+="<table> ";
            s+="<tr>";
            rect = '<svg width="20" height="20" ><rect width="20" height="20" fill="'+prop.colors[i]+'"></rect></svg>';
            s+="<td width='40px'>";
            s+= rect ;
            s+="</td>";
            s+="<td width='20px'>";
            s+= (i+1)  ;
            s+="</td>";
            s+="<td width='300px'>";
            s+= d3.keys(d[i]) ;
            s+="</td>";
            s+="<td width='90px'>";
            s+= currencySwapNoCut( d3.values(d[i]) );
            s+="</td>";
            s+="</tr>";
            s+="";
            s+="</table>";
        }
        s+="";
        s+="</td>";
        s+="</tr>";
        s+="";
        s+="</table>";


        d3.select("#tableTxtRez").html(s);
    }







}
