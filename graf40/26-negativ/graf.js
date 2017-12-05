function drawGraph30(data , prop , id) {


    prop.paddingLeft = 100 ;
    prop.paddingBottom = 90 ;
    prop.paddingTop = 15 ;
    prop.paddingRight = 30 ;
    prop.backColor = "#acc" ;
    prop.backColor = "#F8F9FA" ;

    // console.log(prop);

    svg = d3.select("#"+id);
    svg.selectAll("*").remove();
    
    div = d3.select("#divGraph30").append("div").attr("class", "tooltipGraph30").style("opacity", 0);

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
diff = 1.3 ; 
min = findMaxVal2(data) ; 
max = findMinVal2(data) ;
y = d3.scaleLinear()
        .domain([max * diff, min * diff])
        .range([height, 0]);
y2 = d3.scaleLinear()
        .domain([max * diff, min * diff])
        .range([0, height]);

// console.log([max ,  min]);
// console.log( [ findMaxVal2(data) , findMinVal2(data) ] );

    countBars =Math.floor(width / (+prop.barSize + +prop.spaceBetween )) ;
    console.log( countBars)
x = d3.scaleLinear()
        .domain([0  , countBars ] )
        .range([ 0 ,  width   ])
;
    barSize = +prop.barSize;

    function drawAsisX(canvas) {

        line = d3.line().x(function(d) {return d[0];} ).y(function(d) { return d[1]} ) ;
        canvas.append("path") 
            .attr("d", line([[0,  y(0)], [getElemWidth(canvas), y(0)]]))
            .attr("stroke-width", 4)
            .attr("stroke", "#CDD5DE")
        ;
    }


    function drawAsisY(canvas) {
        // back
        rects = canvas.append("g").attr("class", "backRects");

        tis = y.ticks();
        backHei = y(tis[0]) - y(tis[1]);
        tis.forEach(function(d, i) {
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

        y.ticks().forEach(function(dat, i) {
            if (i != y.ticks().length - 1  ) {
                text = legend.append("g")
                    .attr("transform", function(d) {
                        return "translate(" + [0, y(dat)] + ")"
                    })
                ;
                text.append("text")
                    .attr("text-anchor", "end")
                    .attr("dominant-baseline", "central")
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
                .attr("transform", "translate(" + [getElemWidth(canvas)/2, 10] + ")")
                .attr("text-anchor", "middle")
                .text("тыс. руб.")
        ;
    }




function showFactIn(canvas){
    rects = canvas.append("g").attr("transform","translate("+[50,0]+")")
    data.forEach(function(d , i){
        bar = rects.append("g").attr("transform","translate("+[x(i),0]+")")
                                .attr("width",x(1)-x(0))
                                .attr("height",getElemHeight(canvas))
        ;

        bar.append("text")
            .attr("transform","translate("+[gistSize*0.75 , ( +getElemHeight(canvas) +25 ) ]+")")
            .attr("class","mountText")
            .text(d.name);


        showBar(bar, 0 ,d.fact , prop.colorFact );
        showBar(bar, 1 ,d.plan , prop.colorPlan);

    });
}

function showBar(canvas, index ,d ,color ){
        rectHe =  y(0)-y(d)   ;  
        bar1 = canvas.append("g").attr("transform","translate("+[gistSize/2*index, parseFloat(d) > 0  ? y(0) -rectHe : y(0)   ]+")") ;

        bar1.append("rect")
            .attr("width" , gistSize )
            .attr("height" ,Math.abs( y(0)-y(d) ))
            .attr("fill", color)
            .on("mousemove", function() { 
                            div.transition().duration(200).style("opacity", .9);
                            div.html(  legendaVals[index] + " : " + currencySwapNoCut(d) )
                                .style("left", (d3.event.pageX) + "px")
                                .style("top", (d3.event.pageY - 30 ) + "px")
                                ;
                            })
                            .on("mouseout", function() { div.transition().duration(500).style("opacity", 0); })
        ;
        // bar1.append("text")
        //         .attr("transform","translate("+[gistSize/2, -5]+")")
        //         .attr("class","planGistLabel")
        //         .text(currencySwap(d) )
        // ;
        

}



function showFactIntext(canvas){
    rects = canvas.append("g").attr("transform","translate("+[50,0]+")")
    data.forEach(function(d , i) {
        bar = rects.append("g").attr("transform","translate("+[x(i),0]+")")
                                .attr("width",x(1)-x(0))
                                .attr("height",getElemHeight(canvas))
        ;
        showBartext(bar, 0 ,d.fact , prop.colorFact  , d.plan);
        showBartext(bar, 1 ,d.plan , prop.colorPlan ,d.fact );

    });
}

function showBartext(canvas, index ,d ,color , d2){
        rectHe =  y(0)-y(d)   ;  
        bar1 = canvas.append("g").attr("transform","translate("+[gistSize/2*index, parseFloat(d) > 0  ? y(0) -rectHe : y(0)   ]+")") ;

        xpad = gistSize/2;
        if (d < d2 && index==0) xpad = 0 ;
        if (d < d2 && index==1) xpad = gistSize ;
        bar1.append("text")
                .attr("transform","translate("+[ xpad , -5]+")")
                .attr("class","planGistLabel")
                .text(currencySwap(d) )
        ;

}

function showLegend(canvas) {
    te = canvas.append("g").attr("transform","translate("+[0, 45]+")") ;

    inLeg = te.append("g").attr("transform" , "translate(20,10)");
    inLeg.append("rect")
                .attr("width" , 20)
                .attr("height" , 20)
                .attr("fill" , prop.colorFact)
    ;
    inLeg.append("text")
                .attr("transform" , "translate(30 , 15)")
                .attr("class" , "legend")
                .text(legendaVals[0])
    ;

    inLeg = te.append("g").attr("transform" , "translate(150,10)");
    inLeg.append("rect")
                .attr("width" , 20)
                .attr("height" , 20)
                .attr("fill" , prop.colorPlan)
    ;
    inLeg.append("text")
                .attr("transform" , "translate(30 , 15)")
                .attr("class" , "legend")
                .text(legendaVals[1])
    ;
    

}






function findMinVal2(d){
    mm1 = 0 ;
    for (i in d)
        for (key in d[i])
            if (key!="name" && mm1 >  d[i][key]) mm1 =d[i][key] ; 
    return mm1 ; 

}
function findMaxVal2(d){
    ma1 = 0 ;
    for (i in d)
        for (key in d[i])
            if (key!="name" && ma1 <  d[i][key]) ma1 =d[i][key] ; 
    return ma1 ; 

}


function getElemWidth (el){
    return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("width");
}
function getElemHeight (el){
    return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("height");
}



function cutLongSum(d){
    if ( Math.abs(d) > 1000)
        if (+d > 0 )
            return  d.toString().substr(0, -max.toString().length +d.toString().length  +3) ; 
        else
            return  ( d.toString().substr(0, -min.toString().length +d.toString().length  +4  ) ) ; 
    else 
        return d ; 
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
        d = parseInt(d * 0.001);
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

    function getElemWidth(el) {
        return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("width");
    }

    function getElemHeight(el) {
        return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("height");
    }


    drawAsisY(asisY);
 

gistSize = +prop.barSize ;

showLegend(asisX) ; 
showFactIn(gist);
showFactIntext(gist);

    drawAsisX(gist);
}