function drawGraph31(data , prop , id) {


    prop.paddingLeft = 100 ;
    prop.paddingBottom = 60 ;
    prop.paddingTop = 70 ;
    prop.paddingRight = 30 ;
    prop.backColor = "#acc" ;
    prop.backColor = "#F8F9FA" ;

    // console.log(prop);

    svg = d3.select("#"+id);
    svg.selectAll("*").remove();
    
    div = d3.select("#divGraph31").append("div").attr("class", "tooltipGraph31").style("opacity", 0);

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

min = parseFloat(min);
max = parseFloat(max);
    len = min.toString().length;
    len = Math.round(min).toString().length;
    if (len <4) { de=1; deText = "руб."; }
    if (len <7 && len>3) {de = 0.001; deText = "тыс. руб."; }
    if (len <10 && len >6) { de=0.000001 ; deText = "млн. руб."; }
    if (len <13 && len >9) { de=0.000000001 ; deText = "млрд. руб."; }
    if (len <16 && len >12) { de=0.000000000001 ; deText = "трлн. руб."; }
    if (len >15)  { de=0.000000000000001 ; deText = "квинт. руб."; }


y = d3.scaleLinear()
        .domain([max * diff, min * diff])
        .range([height, 0]);

// console.log([max ,  min]);
// console.log( [ findMaxVal2(data) , findMinVal2(data) ] );


x = d3.scaleLinear()
        .domain([0  , 3] )
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
                    .attr("class", "asisYcapiton")
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
                .attr("class", "lebelgrag31")
                .text(deText)
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
            .attr("class","middleTextLegend")
            .attr("transform","translate("+[gistSize, -50]+")")
            .html(breakLongText( d.vol.name, 6) )
        ;
        line = d3.line().x(function(d) {return d[0];} ).y(function(d) { return d[1]} ) ;
        bar.append("path") 
            .attr("d", line([[gistSize,  -30], [gistSize, 10]]))
            .attr("stroke-width", 2)
            .attr("stroke", "#999")
        ;       
        // showBorders(bar); 
        showBar(bar, 0 ,d.vol.dohodPlan , prop.colorDoh );
        showBar(bar, 1 ,d.vol.rashodPlan , prop.colorRash);
        showBar(bar, 2 ,d.vol.deficitPlan , prop.colorDef);

        showBarObl(bar, 0 ,d.obl.dohodPlan , prop.colorDoh );
        showBarObl(bar, 1 ,d.obl.rashodPlan , prop.colorRash);
        showBarObl(bar, 2 ,d.obl.deficitPlan , prop.colorDef);


        gsi =gistSize*2.2;
        bar.append("text")
            .attr("class","middleTextLegend")
            .attr("transform","translate("+[gistSize+gsi, -50]+")")
            .html(breakLongText( d.obl.name, 6) )
        ;
        line = d3.line().x(function(d) {return d[0];} ).y(function(d) { return d[1]} ) ;
        bar.append("path") 
            .attr("d", line([[gistSize +gsi,  -30], [gistSize +gsi, 10]]))
            .attr("stroke-width", 2)
            .attr("stroke", "#999")
        ;       

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
                            div.html(   "  " + currencySwapNoCut(d) )
                                .style("left", (d3.event.pageX) + "px")
                                .style("top", (d3.event.pageY - 30 ) + "px")
                                ;
                            })
                            .on("mouseout", function() { div.transition().duration(500).style("opacity", 0); })
        ;        
}
function showBarObl(canvas, index ,d ,color ){
        rectHe =  y(0)-y(d)   ;  
        bar1 = canvas.append("g").attr("transform","translate("+[gistSize*2.2+  gistSize/2*index, parseFloat(d) > 0  ? y(0) -rectHe : y(0)   ]+")") ;
        bar1.append("rect")
            .attr("width" , gistSize )
            .attr("height" ,Math.abs( y(0)-y(d) ))
            .attr("fill", color)
            .on("mousemove", function() { 
                            div.transition().duration(200).style("opacity", .9);
                            div.html(   "  " + currencySwapNoCut(d) )
                                .style("left", (d3.event.pageX) + "px")
                                .style("top", (d3.event.pageY - 30 ) + "px")
                                ;
                            })
                            .on("mouseout", function() { div.transition().duration(500).style("opacity", 0); })
        ;        
}



function showFactIntext(canvas){
    rects = canvas.append("g").attr("transform","translate("+[50,0]+")")
    data.forEach(function(d , i){
        bar = rects.append("g").attr("transform","translate("+[x(i),-5]+")")
                                .attr("width",x(1)-x(0))
                                .attr("height",getElemHeight(canvas))
        ;
        showBartext(bar, 0 ,d.vol.dohodPlan , prop.colorDoh );
        showBartext(bar, 1 ,d.vol.rashodPlan , prop.colorRash);
        showBartext(bar, 2 ,d.vol.deficitPlan , prop.colorDef);

        showBarObltext(bar, 0 ,d.obl.dohodPlan , prop.colorDoh );
        showBarObltext(bar, 1 ,d.obl.rashodPlan , prop.colorRash);
        showBarObltext(bar, 2 ,d.obl.deficitPlan , prop.colorDef);


    });
}

function showBartext(canvas, index ,d ,color ){
    var koef = 1.5;
    if (index === 0) {
        koef = 0.55;
    }
        rectHe =  y(0)-y(d)   ;  
        bar1 = canvas.append("g").attr("transform","translate("+[gistSize/2*index, parseFloat(d) > 0  ? y(0) -rectHe : y(0)   ]+")") ;
        bar1.append("text")
                .attr("transform","translate("+[gistSize/2 * koef, -5]+")")
                .attr("class","planGistLabel")
                .text(currencySwap(d) )
        ;

}

function showBarObltext(canvas, index ,d ,color ){
    var koef = 1.5;
    if (index === 0) {
        koef = 0.55;
    }
        rectHe =  y(0)-y(d)   ;  
        bar1 = canvas.append("g").attr("transform","translate("+[gistSize*2.2+  gistSize/2*index, parseFloat(d) > 0  ? y(0) -rectHe : y(0)   ]+")") ;
        bar1.append("text")
                .attr("transform","translate("+[gistSize/2 * koef, -5]+")")
                .attr("class","planGistLabel")
                .text(currencySwap(d) )
        ;

}

function showLegend(canvas){
    te = canvas.append("g").attr("transform","translate("+[0, 30]+")") ; 

    inLeg = te.append("g").attr("transform" , "translate(20,10)");
    inLeg.append("rect")
                .attr("width" , 20)
                .attr("height" , 20)
                .attr("fill" , prop.colorDoh)
    ;
    inLeg.append("text")
                .attr("transform" , "translate(30 , 15)")
                .attr("class" , "legend")
                .text("Доходы")
    ;

    inLeg = te.append("g").attr("transform" , "translate(150,10)");
    inLeg.append("rect")
                .attr("width" , 20)
                .attr("height" , 20)
                .attr("fill" , prop.colorRash)
    ;
    inLeg.append("text")
                .attr("transform" , "translate(30 , 15)")
                .attr("class" , "legend")
                .text("Расходы")
    ;

    inLeg = te.append("g").attr("transform" , "translate(270,10)");
    inLeg.append("rect")
                .attr("width" , 20)
                .attr("height" , 20)
                .attr("fill" , prop.colorDef)
    ;
    inLeg.append("text")
                .attr("transform" , "translate(30 , 15)")
                .attr("class" , "legend")
                .text("Дефицит/профцит")
    ;


    te = canvas.append("g") ; 
    data.forEach(function(d,i){
        te.append("text")
                .attr("transform","translate("+[x(i) + gistSize*2.2,25]+")") 
                .attr("class", "mounth31")
                .text(d.name)
        ;
    })

}




function findMinVal2(d){
    mm1 = d[0].vol.dohodPlan ; 
    for (i in d)
        for (key in d[i].vol){

            di = parseFloat(d[i].vol[key] ) ; 

            if (isNaN(di)) di =0 ;
            if (key!="name" && mm1 > di ) mm1 =di ; 
        }
    for (i in d)
        for (key in d[i].obl){
            di = parseFloat(d[i].obl[key]) ; 
            if (isNaN(di)) di =0 ;
            if (key!="name" && mm1 > di ) mm1 =di 
        }
    return mm1 ; 

}

function findMaxVal2(d){
    ma1 = d[0].vol.dohodPlan ; 
    for (i in d)
        for (key in d[i].vol){
            di = parseFloat(d[i].vol[key] ) ; 
            if (isNaN(di)) di =0 ;
            if (key!="name" && ma1 < di ) ma1 =di ; 
        }
    for (i in d)
        for (key in d[i].obl){
            di = parseFloat(d[i].obl[key]) ; 
            if (isNaN(di)) di =0 ;
            if (key!="name" && ma1 <  di ) ma1 =di ; 
        }
    return ma1 ; 

}


function getElemWidth (el){
    return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("width");
}
function getElemHeight (el){
    return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("height");
}



function cutLongSum(d){ 
    d =parseInt(Math.abs(d) );
    if ( d > 100)
        if (+d > 0 )
            return  d.toString().substr(0, d.toString().length-max.toString().length   +3) ; 
        else
            return  ( d.toString().substr(0, d.toString().length-min.toString().length   +4  ) ) ; 
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
        /*
        len = min.toString().length; 
        de="";
        for (i=0 ; i<len-4; i++)
            de +="0" ; 
        de  = parseFloat("0."+de+"1");
        console.log(de );
        */
        d = parseInt(d *de );
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

    function getElemWidth(el) {
        return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("width");
    }

    function getElemHeight(el) {
        return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("height");
    }


    drawAsisY(asisY);
 
gistSize = barSize / 3 ; 
gistSize = 50 ; 

showLegend(asisX) ; 
showFactIn(gist);
showFactIntext(gist);

    drawAsisX(gist);
}