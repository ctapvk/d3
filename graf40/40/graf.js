function drawGraph40(data , prop , id) {

    prop.paddingLeft = 100 ;
    prop.paddingBottom = 50 ;
    prop.paddingTop = 50 ;
    prop.paddingRight = 30 ;
    prop.backColor = "#acc" ;
    prop.backColor = "#F8F9FA" ;

    // console.log(data);

    svg = d3.select("#"+id);
    svg.selectAll("*").remove();
    div = d3.select("#hideGraph40").append("div").attr("class", "tooltipGraph40").style("opacity", 0);


    wiAll = (prop.barSize*2 + prop.spaceBetween )*(data.length-1) +  30 + prop.paddingLeft + prop.paddingRight ;
    if ( wiAll > +svg.attr("width"))
        svg.attr("width" ,wiAll -(30 + prop.paddingLeft + prop.paddingRight) );


    widthSvg = +svg.attr("width");
    heightSvg = +svg.attr("height");
    width = +svg.attr("width") - +(prop.paddingLeft)- +(prop.paddingRight);
    height = +svg.attr("height") - +(prop.paddingBottom) - +prop.paddingTop;

    asisXtop = svg.append("g")
        .attr("class", "asisXtop")
        .attr("transform", "translate(" + [ +prop.paddingLeft , 0 ] + ")")
        .attr("width", width )
        .attr("height", +prop.paddingTop)
    ;
    asisY = svg.append("g")
        .attr("class", "asisY")
        .attr("transform", "translate(" + [0, +prop.paddingTop] + ")")
        .attr("width", +prop.paddingLeft)
        .attr("height", heightSvg - +prop.paddingBottom - +prop.paddingTop)
    ;
    gist = svg.append("g")
        .attr("class", "gist")
        .attr("transform", "translate(" + [+prop.paddingLeft   , +prop.paddingTop ] + ")")
        .attr("width", width )
        .attr("height", heightSvg - +prop.paddingBottom - +prop.paddingTop )
    ;
    asisYright = svg.append("g")
        .attr("class", "asisYright")
        .attr("transform", "translate(" + [widthSvg -+prop.paddingRight , +prop.paddingTop] + ")")
        .attr("width", +prop.paddingRight )
        .attr("height", heightSvg - +prop.paddingBottom - +prop.paddingTop)
    ;
    asisX = svg.append("g")
        .attr("class", "asisX")
        .attr("transform", "translate(" + [+prop.paddingLeft , heightSvg - +prop.paddingBottom ] + ")")
        .attr("width", width  )
        .attr("height", +prop.paddingBottom)
    ;
    // showBorders(asisX);
    // showBorders(gist);
    // showBorders(asisY);
    // showBorders(asisXtop);
    // showBorders(asisYright);
    diff = 1.2;
    min = 0;
    max = findMax(data);
    len = max.toString().length  -3;
    if (len <4) { de=1; deText = "руб."; }
    if (len <7 && len>3) {de = 0.001; deText = "тыс. руб."; }
    if (len <10 && len >6) { de=0.000001 ; deText = "млн. руб."; }
    if (len <13 && len >9) { de=0.000000001 ; deText = "млрд. руб."; }
    if (len <16 && len >12) { de=0.000000000001 ; deText = "трлн. руб."; }
    if (len >15)  { de=0.000000000000001 ; deText = "квинт. руб."; }

    y = d3.scaleLinear()
        .domain([min * diff, max * diff])
        .range([height, 0])
    ;

// console.log([max ,  min]);
    barCount =  data.length -1 ;
    x = d3.scaleLinear()
        .domain([0, barCount ])
        .range([0, ( +prop.barSize + +prop.spaceBetween) * barCount])
    ;
    barSize = +prop.barSize;

    function drawAsisX(canvas) {

        line = d3.line().x(function(d) {return d[0];} ).y(function(d) { return d[1]} ) ;
        canvas.append("path") 
            .attr("d", line([[0, 0], [getElemWidth(canvas), 0]]))
            .attr("stroke-width", 4)
            .attr("stroke", "#CDD5DE")
        ;
    }


    function drawLegend(canvas) {
        te = canvas.append("g") .attr("transform","translate("+[50,40]+")")   ;


        data[0].vals.forEach(function (t2, number) {

            leg = te.append("g") .attr("transform","translate("+[350 * number,0]+")")   ;
            leg.append("text")
                .attr("transform", "translate( 30,7)")
                .attr("class" , "legendSub")
                .text( d3.keys(t2) )
            ;
            leg.append("rect")
                .attr("transform",   "translate( 0,-10)" )
                .attr("fill" , prop.color[number] )
                .attr("width" , 20)
                .attr("height"  , 20)
            ;

        })
    }

    function drawGist(canvas) {
        te  = canvas.append("g");

        data.forEach(function (t , i ) {

            bar  = te.append("g")
                .attr("transform", "translate("+[30 + x(i),  0]+")")
                .attr("height",getElemHeight(canvas))
                .attr("width",barSize*2)
            ;


            bar.append("text")
                .attr('class','barUp')
                .attr("transform", "translate("+[ barSize,  20-getElemHeight(asisXtop)]+")")
                .html(breakLongText(t.name , 20))
            ;

            line = d3.line().x(function(d){ return d[0]}).y(function(d){ return d[1] });

            dat = [ [barSize,0] , [barSize, 30 ]  ]   ;
            bar.append("path")
                .style("fill","none")
                .style("stroke","gray")
                .style("stroke-width","2px")
                .attr("d", line(dat))
            ;

            // showBorders(bar );
            t.vals.forEach(function (t2, number) {
                reHe = getElemHeight(canvas)  - y( d3.values(t2) );
                reMove =    y( d3.values(t2) );

                barRe = bar.append("g").attr("transform", "translate("+[barSize * number,  reMove]+")") ;

                barRe.append("rect")
                    .attr("width",barSize)
                    .attr("height",reHe)
                    .attr("fill",prop.color[number])
                    .on("mousemove", function() {
                        div.transition().duration(200).style("opacity", .9);
                        div.html(   d3.keys(t2) +  " :  " + currencySwapNoCut(d3.values(t2)) )
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 30 ) + "px")
                        ;
                    })
                    .on("mouseout", function() { div.transition().duration(500).style("opacity", 0); })
                ;
                barRe.append("text")
                    .attr("transform", "translate("+[ barSize/2, -5]+")")
                    .attr("class" , "legCaption")
                    .text(currencySwap(d3.values(t2) ))
                ;
            })

        })
    }


    function drawAsisY(canvas) {
        // back
        rects = canvas.append("g").attr("class", "backRects");

        tis = y.ticks();
        backHei = y(tis[0]) - y(tis[1]);
        tis.forEach(function (d, i) {
            // console.log(y.ticks());
            if (i % 2 == 0 && i!=0) {
                rectHeight = y(d.planOut);
                rects.append("rect")
                    .attr("transform", "translate( " + [ getElemWidth(canvas) ,  y(d)] + ")")
                    .attr("width", width)
                    .attr("height", backHei)
                    .attr("fill", prop.backColor)
                ;
            }
        });
        //asis
        line = d3.line().x(function(d) {return d[0];} ).y(function(d) { return d[1]} ) ;

        canvas.append("path")
            .attr("transform",  "translate(" + [0, 0] + ")" )
            .attr("d", line([
                [getElemWidth(canvas), 0],
                [getElemWidth(canvas), getElemHeight(canvas)]
            ]))
            .attr("stroke-width", 4)
            .attr("stroke", "#CDD5DE")
        ;

        legend = canvas.append("g")
            .attr("transform", "translate(" + [getElemWidth(canvas), 0] + ")")
            .attr("class", "legend")
        ;

        y.ticks().forEach(function (dat, i) {
            if (i != y.ticks().length - 1 && i !=0) {
                text = legend.append("g")
                    .attr("transform", function (d) {
                        return "translate(" + [0, y(dat)] + ")"
                    })
                ;
                text.append("text")
                    .attr("class","asisYcapiton")
                    .attr("transform",  "translate(" + [-10, 0] + ")" )
                    .text( currencySwap(dat) )
                ;
                text.append("circle")
                    .attr("r", 5)
                    .attr("fill", "#CDD5DE")
                ;

            }
        });

        canvas.append("text")
            .attr("class","asisYcapiton")
            .attr("transform",  "translate(" + [getElemWidth(canvas)-15, 0] + ")" )
            .text(deText)
        ;
    }



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


    function currencySwap(d) {
        d = parseInt(d * de);
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
        d= parseInt(parseFloat(d)*de );
        d = d.toString().replace(".", ",");
        return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + deText;
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

    function getElemWidth(el) {
        return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("width");
    }

    function getElemHeight(el) {
        return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("height");
    }

    function findMax(d) {
        max = 0 ;

        d.forEach(function (t, i ) {
            t.vals.forEach(function (t2) {
                if (parseFloat(d3.values(t2)) > max ) max  = parseFloat(d3.values(t2)) ;
            })
        })
        return max ;

    }

    drawAsisY(asisY);
    drawAsisX(asisX);
    drawGist(gist);
    drawLegend(asisX);





}