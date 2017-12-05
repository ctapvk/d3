function drawGraph36(data , prop , id) {

    prop.paddingLeft = 100 ;
    prop.paddingBottom = 75 ;
    prop.paddingTop = 10 ;
    prop.paddingRight = 0 ;
    prop.backColor = "#acc" ;
    prop.backColor = "#F8F9FA" ;

    // console.log(prop);

    svg = d3.select("#"+id);
    svg.selectAll("*").remove();
    div = d3.select("#hideGraph36").append("div").attr("class", "tooltipGraph36").style("opacity", 0);

    widthSvg = +svg.attr("width");
    heightSvg = +svg.attr("height");
    width = +svg.attr("width") - +(prop.paddingLeft)- +(prop.paddingRight);
    height = +svg.attr("height") - +(prop.paddingBottom) - +prop.paddingTop;

    asisX = svg.append("g")
        .attr("class", "asisX")
        .attr("transform", "translate(" + [+prop.paddingLeft , heightSvg - +prop.paddingBottom ] + ")")
        .attr("width", width  )
        .attr("height", +prop.paddingBottom)
    ;
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
    // showBorders(asisX);
    // showBorders(gist);
    // showBorders(asisY);
    // showBorders(asisXtop);
    // showBorders(asisYright);
    diff = 1.2;
    min = 0;
    len = min.toString().length;
    if (len <4) { de=1; deText = "руб."; }
    if (len <7 && len>3) {de = 0.001; deText = "тыс. руб."; }
    if (len <10 && len >6) { de=0.000001 ; deText = "млн. руб."; }
    if (len <13 && len >9) { de=0.000000001 ; deText = "млрд. руб."; }
    if (len <16 && len >12) { de=0.000000000001 ; deText = "трлн. руб."; }
    if (len >15)  { de=0.000000000000001 ; deText = "квинт. руб."; }

    max = findMax(data);
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


    function drawGist(canvas) {
        te = canvas.append("g");

        data.forEach(function (d,i ) {

            reHe = getElemHeight(canvas)  - y(d.val);
            reMove =   y(d.val);
            bar  = te.append("g")
                .attr("transform", "translate("+[100 + x(i),  reMove]+")")
            ;

            color = prop.colorFact ;
            if (d.type == 1) color = prop.colorEval ;
            if (d.type == 2 ) color = prop.colorPlan ;

            tyt = ["Факт" , "Оценка" , "План"];
            bar.append("rect")
                .attr("width",barSize)
                .attr("height",reHe)
                .attr("fill",color)
                .on("mousemove", function() {
                    div.transition().duration(200).style("opacity", .9);
                    div.html(   tyt[d.type] + " :  " + currencySwapNoCut(d.val) )
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 30 ) + "px")
                    ;
                })
                .on("mouseout", function() { div.transition().duration(500).style("opacity", 0); })
            ;

            bar.append("text")
                .attr("transform", "translate("+[ barSize/2, -5]+")")
                .attr("class" , "legCaption")
                .text(currencySwap(d.val ))
            ;
        })
    }


    function drawLegend(canvas) {
        te = canvas.append("g") .attr("transform","translate("+[50,40]+")")   ;


        leg = te.append("g") .attr("transform","translate("+[0,0]+")")   ;
        leg.append("text")
            .attr("transform", "translate( 30,7)")
            .attr("class" , "legendSub")
            .text( "Факт" )
        ;
        leg.append("rect")
            .attr("transform",   "translate( 0,-10)" )
            .attr("fill" , prop.colorFact )
            .attr("width" , 20)
            .attr("height"  , 20)
        ;
        leg = te.append("g").attr("transform","translate("+[150,0]+")")   ;
        leg.append("text")
            .attr("transform", "translate( 30,7)")
            .attr("class" , "legendSub")
            .text( "Оценка" )
        ;
        leg.append("rect")
            .attr("transform",   "translate( 0,-10)" )
            .attr("fill" , prop.colorEval  )
            .attr("width" , 20)
            .attr("height"  , 20)
        ;

        leg = te.append("g") .attr("transform","translate("+[320,0]+")")   ;
        leg.append("text")
            .attr("transform", "translate( 30,7)")
            .attr("class" , "legendSub")
            .text( "План" )
        ;
        leg.append("rect")
            .attr("transform",   "translate( 0,-10)" )
            .attr("fill" , prop.colorPlan )
            .attr("width" , 20)
            .attr("height"  , 20)
        ;
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
            .attr("transform",  "translate(" + [getElemWidth(canvas), 0] + ")" )
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

    function findMax(d){
        max = 0;
        d.forEach(function (t, number) {
            if (parseFloat(t.val)> max) max =parseFloat(t.val) ;
        })
        return max ;
    }


    drawAsisY(asisY);
    drawAsisX(asisX);
    drawGist(gist);

    drawLegend(asisX);
}