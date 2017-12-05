function draw25(data, prop) {


    svg = d3.select(".gist25");


    data = dataProcc(data);

    widthSvg = +svg.attr("width");
    heightSvg = +svg.attr("height");
    width = +svg.attr("width") - +(prop.paddingLeft);
    height = +svg.attr("height") - +(prop.paddingBottom);

    asisX = svg.append("g")
        .attr("class", "asisX")
        .attr("transform", "translate("+[ widthSvg- width,  height  ]+")")
        .attr("width" ,  width)
        .attr("height" , heightSvg - height)
    ;
    gist = svg.append("g")
        .attr("class", "gist")
        .attr("transform", "translate("+[ widthSvg- width,  height  ]+")")
        .attr("width" , width)
        .attr("height" , height)
    ;
    asisY = svg.append("g")
        .attr("class", "asisY")
        .attr("transform", "translate("+[0,  0  ]+")")
        .attr("width" ,  widthSvg- width)
        .attr("height" , height)
    ;
    diff = 1.3 ;
    min = +findMinVal(data) ;
    max = +findMaxVal(data) ;
    y = d3.scaleLinear()
        .domain([ min * diff , max * diff] )
        .range([  height ,0   ])
    ;

// console.log([max ,  min]);
    if ( data.length < 5) {
        x = d3.scaleLinear()
            .domain([0  , data.length] )
            .range([ +prop.gistPadding ,  ( +prop.barSize + +prop.spaceBetween) * data.length   ])
        ;
        barSize = +prop.barSize ;
    } else {
        x = d3.scaleLinear()
            .domain([0  , data.length] )
            .range([ +prop.gistPadding ,  width   ])
        ;
        barSize = width / data.length  - +prop.spaceBetween;
    }

    drawBack(asisX);
    drawAsisY(asisY);
    showLegend(asisX) ;
    showPlanIn(gist);
    showFactIn(gist);
    showPlanOut(gist);
    showFactOut(gist);


    drawAsisX(gist);
    showSaldo(gist);

    function drawAsisX(canvas) {

        line  = d3.line().x(function(d) {return d[0]}).y(function(d) {return d[1]}) ;
        canvas.append("path")
            .attr("transform",function(d) { return "translate("+[ 0 , -height+y(0) ]+")" })
            .attr("d" , line([ [0,0] , [ getElemWidth(canvas), 0 ] ]))
            .attr("stroke-width", 4)
            .attr("stroke", "#CDD5DE")
        ;
    }

    function drawAsisY(canvas) {
        line  = d3.line()
            .x(function(d) {return d[0]})
            .y(function(d) {return d[1]})
        ;
        canvas.append("path")
            .attr("transform",function(d) { return "translate("+[ 0 , 0]+")" })
            .attr("d" , line([ [getElemWidth(canvas),0] , [ getElemWidth(canvas), getElemHeight(canvas) ] ]))
            .attr("stroke-width", 4)
            .attr("stroke", "#CDD5DE")
        ;

        legend = canvas.append("g")
            .attr("transform" , "translate("+ [ getElemWidth(canvas) , 0 ] +")")
            .attr("class", "legend")
        ;

        y.ticks().forEach(function(dat , i) {
            if (i!=y.ticks().length-1) {
                text = legend.append("g")
                    .attr("transform" , function(d) { return "translate(" + [0,  y(dat) ] + ")" })
                ;
                text .append("text")
                    .attr("class", "asisYcapiton")
                    .attr("transform" , function(d) { return "translate(" + [-10,  0 ] + ")" })
                    .text( function(d){ return currencySwap(dat)  })
                ;
                text .append("circle")
                    .attr("r" , 5)
                    .attr("fill",  "#CDD5DE" )
                ;
            }
        })
        ;

        legend.append("text")
            .attr("class" , "asisYcapiton")
            .attr("transform" , "translate( "+ [  -10,10 ] +")")
            .text("млн. руб." )
        ;
    }
    function drawBack(canvas){
        rects = canvas.append("g").attr("class" , "backRects");

        tis = y.ticks() ;
        backHei = y( tis[0]) - y( tis[1]) ;
        tis.forEach(function(d , i){
            // console.log(y.ticks());
            if (i %2 ==0) {
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

    function showPlanOut(canvas){
        rects = canvas.append("g");

        data.forEach(function(d , i){

            rectHeight = y(d.planOut);
            rects.append("rect")
                .attr("transform" , function() {   return "translate( "+ [ x(i) , -height+y(0)  ] +")" ; })
                .attr("width" , barSize )
                .attr("height" , function() { return -(rectHeight- y(0))  })
                .attr("fill", prop.colorPlanOut)
            ;


        });
    }



    function showFactOut(canvas){
        rects = canvas.append("g");

        data.forEach(function(d , i){

            rectHeight = y(d.factOut);
            rects.append("rect")
                .attr("transform" , function() {   return "translate( "+ [ x(i) , -height+y(0)  ] +")" ; })
                .attr("width" , barSize )
                .attr("height" , function() { return -(rectHeight- y(0))  })
                .attr("fill", prop.colorFactOut)
            ;

            rectHeight = d.planOut > d.factOut ? y(d.planOut) : y(d.factOut)  ;
            rects.append("text")
                .attr("class" , "factGistLabel")
                .attr("transform" , "translate( "+ [  x(i)+ barSize/2  , -height + y(0) -rectHeight + y(0)  + 10 ] +")")
                .text(-cutLongSum(d.factOut))
            ;
            rects.append("text")
                .attr("class" , "planGistLabel")
                .attr("transform" , "translate( "+ [  x(i)+ barSize/2  , -height + y(0) -rectHeight + y(0)  + 30 ] +")")
                .text(-cutLongSum(d.planOut))
            ;


        });
    }


    function showPlanIn(canvas){
        rects = canvas.append("g");

        data.forEach(function(d , i){

            rectHeight = y(d.planIn);
            rects.append("rect")
                .attr("transform" , function() {   return "translate( "+ [ x(i) , -height+y(d.planIn)  ] +")" ; })
                .attr("width" , barSize )
                .attr("height" , function() { return -(rectHeight- y(0))  })
                .attr("fill", prop.colorPlanIn)
            ;
        });
    }


    function showFactIn(canvas){
        rects = canvas.append("g");

        data.forEach(function(d , i){

            rectHeight = y(d.factIn);
            rects.append("rect")
                .attr("transform" , function() {   return "translate( "+ [ x(i) , -height+y(d.factIn)  ] +")" ; })
                .attr("width" , barSize )
                .attr("height" , function() { return -(rectHeight- y(0))  })
                .attr("fill", prop.colorFactIn)
            ;

            rectHeight = +d.planIn> d.factIn ? y(d.planIn): y(d.factIn) ;
            rects.append("text")
                .attr("class" , "factGistLabel")
                .attr("transform" , "translate( "+ [  x(i)+ barSize/2  , -height+rectHeight - 10 ] +")")
                .text(cutLongSum(d.factIn))
            ;
            rects.append("text")
                .attr("class" , "planGistLabel")
                .attr("transform" , "translate( "+ [  x(i)+ barSize/2  , -height+rectHeight - 25 ] +")")
                .text(cutLongSum(d.planIn))
            ;



        });
    }

    function showLegend(canvas){

        datas = canvas.append("g").attr("transform" , "translate(0,0)");

        data.forEach(function(d,i){
            datas.append("text")
                .attr("transform", "translate("+[ x(i)+ barSize/2 , +prop.moveMounth ]+")")
                .attr("class" , "mounthLabes")
                .text(d.date)
            ;
        });

        legend = canvas.append("g").attr("transform" , "translate(60,0)");

        inLeg = legend.append("g").attr("transform" , "translate(20,60)");
        inLeg.append("rect")
            .attr("width" , 20)
            .attr("height" , 20)
            .attr("fill" , prop.colorPlanIn)
        ;
        inLeg.append("text")
            .attr("transform" , "translate(30 , 15)")
            .attr("class" , "legend")
            .text("Привлеченные")
        ;
        inLeg = legend.append("g").attr("transform" , "translate(20,100)");
        inLeg.append("rect")
            .attr("width" , 20)
            .attr("height" , 20)
            .attr("fill" , prop.colorFactIn)
        ;
        inLeg.append("text")
            .attr("transform" , "translate(30 , 15)")
            .attr("class" , "legend")
            .text("Привлеченные")
        ;


        outLeg = legend.append("g").attr("transform" , "translate(-80,60)");
        outLeg.append("text")
            .attr("transform" , "translate(30 , 15)")
            .attr("class" , "legend")
            .text("План")
        ;
        outLeg.append("text")
            .attr("transform" , "translate(30 , 55)")
            .attr("class" , "legend")
            .text("Факт")
        ;

        outLeg = legend.append("g").attr("transform" , "translate(200,60)");
        outLeg.append("rect")
            .attr("width" , 20)
            .attr("height" , 20)
            .attr("fill" , prop.colorPlanOut)
        ;
        outLeg.append("text")
            .attr("transform" , "translate(30 , 15)")
            .attr("class" , "legend")
            .text("Погашенные")
        ;
        outLeg = legend.append("g").attr("transform" , "translate(200,100)");
        outLeg.append("rect")
            .attr("width" , 20)
            .attr("height" , 20)
            .attr("fill" , prop.colorFactOut)
        ;
        outLeg.append("text")
            .attr("transform" , "translate(30 , 15)")
            .attr("class" , "legend")
            .text("Погашенные")
        ;

        saldo = legend.append("g").attr("transform" , "translate(350,75)");

        saldo.append("text")
            .attr("transform" , "translate(120 , 15)")
            .attr("class" , "legend")
            .text("Сальдо")
        ;
        line = d3.line().x(function(d){return d[0]}).y(function(d){return d[1]});
        saldo.append("path")
            .attr("d", line([[20,10], [80, 10]]))
            .style("stroke", prop.colorSaldo)
            .style("stroke-width", 4)
        ;

        saldo.append("circle")
            .style("fill", prop.colorSaldo)
            .attr("class", "dot")
            .attr("r", 6)
            .attr("cx", 50 )
            .attr("cy", 10)
        ;



    }

    function showSaldo(canvas){


        line = d3.line()
            .x(function(d , i ) { return x(i) + barSize/2 ;  })
            .y(function(d) { return -height+y(d.factIn - d.factOut) ; })
        ;
        g = canvas.append("g")
            .attr("transform", "translate(0 ,0)")
        ;
        g.append("path")
            .attr("d", line(data))
            .style("stroke", prop.colorSaldo)
            .style("stroke-width", 4)
        ;

        g.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .style("fill", prop.colorSaldo)
            .attr("class", "dot")
            .attr("r", 6)
            .attr("cx", function(d,i) { return x(i) +barSize/2; })
            .attr("cy", function(d) { return -height+y(d.factIn - d.factOut) ; })
        ;
    }

    function findMaxVal(d){
        max = 0 ;
        for (i in d)
            if (parseFloat(max) < parseFloat(d[i].factIn))  max = d[i].factIn ;

        for (i in d)
            if (parseFloat(max) <parseFloat( d[i].planIn) )  max = d[i].planIn ;
        return max;

    }

    function findMinVal(d){
        min = d[0].factOut ;
        for (i in d)
            if (parseFloat(min) < parseFloat(d[i].factOut))  min = d[i].factOut ;
        for (i in d)
            if (parseFloat(min) < parseFloat(d[i].planOut))  min = d[i].planOut ;
        return -min;

    }

    function dataProcc(d) {
        for (i in d){2
            if (d[i].factOut < 0) d[i].factOut=0;
            if (d[i].factIn < 0) d[i].factIn=0;
            if (d[i].planIn < 0) d[i].planIn=0;
            if (d[i].planOut < 0) d[i].planOut=0;
        }

        return d ;

    }

    function getElemWidth (el){
        return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("width");
    }
    function getElemHeight (el){
        return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("height");
    }

    function currencySwap(d){
        d= parseInt(d * 0.001);
        return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")  + "" ;
    }

    function cutLongSum(d){
        d = d !== '' ? Math.floor(d) : '';
        if ( Math.abs(d) > 1000)
            if (+d > 0 )
                return d.toString().substr(0, -(Math.floor(min)).toString().length + d.toString().length + 5);
            else
                return ( d.toString().substr(0, -(Math.floor(max)).toString().length + d.toString().length + 5) );
        else
            return d ;
    }


}