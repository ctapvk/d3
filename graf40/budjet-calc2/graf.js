function gist8(data , prop ) {

    // console.log(data);
    svg = d3.select(".gist8");
    svg.selectAll("*").remove(); 

    widthSvg = +svg.attr("width");
    heightSvg = +svg.attr("height");
    width = +svg.attr("width") - +(prop.paddingLeft);
    height = +svg.attr("height") - +(prop.paddingBottom) - +prop.paddingTop;

    asisX = svg.append("g")
        .attr("class", "asisX")
        .attr("transform", "translate(" + [widthSvg - width, 0] + ")")
        .attr("width", width)
        .attr("height", +prop.paddingTop)
    ;
    gist = svg.append("g")
        .attr("class", "gist")
        .attr("transform", "translate(" + [widthSvg - width,  +prop.paddingTop] + ")")
        .attr("width", width)
        .attr("height", height - +prop.paddingBottom)
    ;
    asisY = svg.append("g")
        .attr("class", "asisY")
        .attr("transform", "translate(" + [0, +prop.paddingTop] + ")")
        .attr("width", widthSvg - width)
        .attr("height", height)
    ;
    // showBorders(asisX);
    // showBorders(gist);
    // showBorders(asisY);

    diff = 1.3;
    min = 0;
    max = +findMaxVal(data);
// console.log([max ,  min]);

    x = d3.scaleLinear()
        .domain([min * diff, max * diff])
        .range([0, width])
    ;
    y = d3.scaleLinear()
        .domain([0, data.length])
        .range([+prop.gistPadding, ( +prop.barSize + +prop.spaceBetween) * data.length])
    ;

    barSize = +prop.barSize;

    drawBack(asisX);
    drawAsisX(asisX);
    drawAsisY(asisY);

    showLegend(asisY);
    drawNach(gist);


    function showBorders(canvas ) {
        g = canvas.append("g");
        line = d3.line().x(function(d) {return d[0];} ).y(function(d) { return d[1]} ) ;
        d = [
            [0,0] ,
            [0,getElemHeight(canvas)] ,
            [getElemWidth(canvas),getElemHeight(canvas)] ,
            [getElemWidth(canvas),0] ,
            [0,0] ,
        ]

        g.append("path")
            .attr("d", line(d))
            .attr("stroke-width", 4)
            .attr("stroke", "#CDD5DE")
        ;

    }

    function drawAsisY(canvas) {

        line = d3.line().x(function(d) {return d[0];} ).y(function(d) { return d[1]} ) ;

        canvas.append("path")
            .attr("transform",   "translate(" + [0, 0 ] + ")" )
            .attr("d", line([[getElemWidth(canvas), 0], [getElemWidth(canvas), getElemHeight(canvas)]]))
            .attr("stroke-width", 4)
            .attr("stroke", "#CDD5DE")
        ;

        datas = canvas.append("g").attr("transform", "translate(0,0)");


        data.forEach(function (d, i) {
            datas.append("text")
                .attr("transform", " translate(" + [
                    getElemWidth(canvas) - +prop.moveMounth,
                    y(i)
                ] + ") ")
                .attr("class", "asisYcapiton")
                .text(i+1)
            ;
        });

    }

    function drawAsisX(canvas) {
        line = d3.line().x(function(d) {return d[0];} ).y(function(d) { return d[1]} ) ;

        canvas.append("path")
            .attr("transform", function (d) {
                return "translate(" + [0, 0] + ")"
            })
            .attr("d", line([[0, getElemHeight(canvas)], [ getElemWidth(canvas),getElemHeight(canvas) ]]))
            .attr("stroke-width", 4)
            .attr("stroke", "#CDD5DE")
        ;

        legend = canvas.append("g")
            .attr("transform", "translate(" + [getElemWidth(canvas), 0] + ")")
            .attr("class", "legend")
        ;

        x.ticks().forEach(function (dat, i) {
                text = legend.append("g")
                    .attr("transform", function (d) {
                        return "translate(" + [x(dat) - getElemWidth(canvas), getElemHeight(canvas)] + ")"
                    })
                ;
                text.append("text")
                    .attr("class", "AsisXText")
                    .attr("transform", "translate(" + [0, -10] + ")")
                    .text(currencySwap(dat))
                ;
                text.append("circle")
                    .attr("r", 5)
                    .attr("fill", "#CDD5DE")
                ;
        })
        ;

    }




    function drawBack(canvas) {
        rects = canvas.append("g").attr("class", "backRects");

        tis = x.ticks();
        widthRec = x(tis[1]) - x(tis[0]);
        tis.forEach(function (d, i) {
            if (i % 2 != 0) {
                rects.append("rect")
                    .attr("transform", "translate( " + [x(d), getElemHeight(canvas)] + ")" )
                    .attr("width", widthRec)
                    .attr("height",height)
                    .attr("fill", prop.backColor)
                ;
            }
        });
    }


    div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

    function drawNach(canvas) {
        rects = canvas.append("g");

        data.forEach(function (d, i) {

            rectWidth = x(Object.values(d));

            rects.append("rect")
                .attr("transform", function () {
                    return "translate( " +  [ 0, y(i) - barSize/2 ] + ")";
                })
                .attr("height", barSize)
                .attr("width",  rectWidth)
                .attr("fill", prop.colors[i])
                .on("mousemove", function() {
                    div.transition().duration(200).style("opacity", .9);
                    div.html(  Object.keys(d) + ' : '+  currencySwapNoCut(Object.values(d)) )
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 30 ) + "px")
                    ;
                })
                .on("mouseout", function() { div.transition().duration(500).style("opacity", 0); })

            ;

        });
    }

    
    function showLegend(canvas) {

        legend = canvas.append("g").attr("transform", "translate("+(20 ) +",0)");
        itemPos = 0;
        data.forEach(function (d, i) {


            outLeg = legend.append("g").attr("transform", "translate(0,"+(60 + itemPos++*30)+")");
            outLeg.append("rect")
                .attr("width", 20)
                .attr("height", 20)
                .attr("fill", prop.colors[i])
            ;
            outLeg.append("text")
                .attr("transform", "translate(30 , 15)")
                .attr("class", "legend")
                .text( (i+1) + '. ' + cutLongText(Object.keys(d)) )
            ;
        });




    }




    function findMaxVal(d) {
        max = 0;
        for (i in d)
            if (parseFloat(max) < parseFloat(Object.values(d[i])) ) max = Object.values(d[i]);
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


    // printTable(data);
    function printTable(d){
        console.log(d);

        s="<table> " ;
        s+="<tr>";
        s+="<td valign='top'>";
        for (i=0; i <11 ; i++){
        s+="<table> ";
            s+="<tr>";
            s+="<td width='400px'>";
            s+= Object.keys(d[i]) ;
            s+="</td>";
            s+="<td>";
            s+= currencySwapNoCut( Object.values(d[i]) );
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
            s+="<td width='400px'>";
            s+= Object.keys(d[i]) ;
            s+="</td>";
            s+="<td>";
            s+= currencySwapNoCut( Object.values(d[i]) );
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
