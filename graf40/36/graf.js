function drawGraph36(data , prop  , idgraf) {
// init block
div = d3.select("#hideGraph36").append("div").attr("class", "tooltipGraph36").style("opacity", 0);
var svg = d3.select("#"+idgraf);
svg.selectAll("*").remove();

widthSvg = +svg.attr("width");
heightSvg = +svg.attr("height");
width = +svg.attr("width") ;
height = +svg.attr("height");

center = svg.append("g")
    .attr("transform", "translate("+[ 0, height/2  -+prop.stripSize /2]+")")
    .attr("class", "center36")
    .attr("width",width)
    .attr("height",+prop.stripSize)
    .attr("fill", prop.colorBackCenter)
;
center.append("rect")
            .attr("width", getElemWidth(center))
            .attr("height",getElemHeight(center)  )
            .attr("fill", prop.colorBackCenter)
;

// showBorders(center);

centerIn = center.append("g")
    .attr("transform","translate("+[50,50]+")")
    .attr("width", width - 100)
    .attr("height", getElemHeight(center) -100)
    .attr("fill", prop.colorBackCenter)
;

// showBorders(centerIn);

max = findmax(data); 
sum =  +summ(data);
x = d3.scaleLinear()
    .domain([0  , sum  ] )
    .range([ 0 ,  getElemWidth(centerIn)  ])
;

step=+0;
holderUp=0 ;  holderDown=0; 
data.forEach(function(d,i){
    // main strip
    let te = centerIn.append("g") 
                    .attr("transform","translate("+[step,0]+")")
    ; step += +x(d.plan );

    //console.log(step ,  sum  );
    let per = ((d.plan/sum).toFixed(2)*100).toFixed(0)   ; 
    te.append("rect")
            .attr("width", x(d.plan ) )
            .attr("class","rectBar36")
            .attr("height",getElemHeight(centerIn)  )
            .attr("fill", prop.colors[i] )
            .on("mousemove", function() { 
                div.transition().duration(200).style("opacity", .9);
                div.html(   d.name +  " : " +  per + "%" )
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 30 ) + "px")
                ;
            })
            .on("mouseout", function() { div.transition().duration(500).style("opacity", 0); })
    ;

    sizeText = 1 + (per/100)*3; 
    te.append("text")
            .attr("fill","gray")
            .attr("font-size",20*sizeText + "px")
            .attr("transform","translate(15,-20)")
            .text( per + "%" )
    ;

    // ======

    if (i%2==0){
        // legenda main strip
        coord = [ holderUp++ * 270 , -150] ; 
        topLeg = centerIn.append("g")
            .attr("class", "topLeg")
            .attr("transform", "translate("+coord+")") 
        ;
        showLegend(topLeg ,  data[i].name , prop.colors[i] , data[i].plan ,  data[i].fact  );
        upConn( coord[0], coord[1] , step - x(d.plan)+3 ,3, centerIn , 1  , prop.colors[i]  , d.pic);
        // ========

            if (d.vals[0]!=undefined){ 
                cx = d3.scaleLinear().domain([0  , d.plan  ] ).range([ 0 ,  x(d.plan )  ]);
                reWi=cx( d.vals[0].plan );
                te.append("rect")
                    .attr("transform","translate("+[0+reWi-3  ,-14]+")")
                    .attr("width", reWi )
                    .attr("height",11  )
                    .attr("fill", prop.colors[i] )
                        .on("mousemove", function() { 
                            div.transition().duration(200).style("opacity", .9);
                            div.html(  d.vals[0].name +  " : " + ( (+data[i].vals[0].plan  / +data[i].vals[0].fact).toFixed(2) *100)  + "%"  )
                                .style("left", (d3.event.pageX) + "px")
                                .style("top", (d3.event.pageY - 30 ) + "px")
                            ;
                        })
                        .on("mouseout", function() { div.transition().duration(500).style("opacity", 0); })


                ;
                // legenda sub strip
                coord = [ holderUp++ * 270 , -150] ; 
                topLeg = centerIn.append("g")
                    .attr("class", "topLeg")
                    .attr("transform", "translate("+coord+")") 
                ;
                showLegend(topLeg ,  data[i].vals[0].name , prop.colors[i] , data[i].vals[0].plan ,  data[i].vals[0].fact  );
                upConn( coord[0], coord[1] , step -3-1.5 ,-14, centerIn , 1  , prop.colors[i]   ,   data[i].vals[0].pic);
                // =======
            } 
    } else {

            if (d.vals[0]!=undefined){
                // console.log(data[i].vals[0].plan);
                cx = d3.scaleLinear().domain([0  , d.plan  ] ).range([ 0 ,  x(d.plan )  ]);
                reWi=cx( d.vals[0].plan );
                 w=(getElemHeight(centerIn));
                te.append("rect")
                    .attr("transform","translate("+[0+3 , 3 +50]+")")
                    .attr("width", reWi )
                    .attr("height",11  )
                    .attr("fill", prop.colors[i] )
                        .on("mousemove", function() { 
                            div.transition().duration(200).style("opacity", .9);
                            div.html(  d.vals[0].name +  " : " + ( (+data[i].vals[0].plan  / +data[i].vals[0].fact).toFixed(2) *100)  + "%"  )
                                .style("left", (d3.event.pageX) + "px")
                                .style("top", (d3.event.pageY - 30 ) + "px")
                            ;
                        })
                        .on("mouseout", function() { div.transition().duration(500).style("opacity", 0); })

                ;
                // legenda sub strip
                coord = [ holderDown++ * 270 , 180] ; 
                topLeg = centerIn.append("g")
                    .attr("class", "topLeg")
                    .attr("transform", "translate("+coord+")") 
                ;
                showLegend(topLeg , data[i].vals[0].name , prop.colors[i] , data[i].vals[0].plan ,  data[i].vals[0].fact  );
                upConn( coord[0], coord[1] , step - x(d.plan) +3+1.5 , 11+1.5 +50, centerIn , 1  , prop.colors[i] ,   data[i].vals[0].pic) ;
                // =======
            }         
        // legenda main strip
        coord = [ holderDown++ * 270 , 180] ; 
        topLeg = centerIn.append("g")
            .attr("class", "topLeg")
            .attr("transform", "translate("+coord+")") 
        ;
        w=(getElemHeight(centerIn));
        showLegend(topLeg ,  data[i].name , prop.colors[i] , data[i].plan ,  data[i].fact  );
        upConn( coord[0], coord[1] , step-3    , w -3, centerIn , 1  , prop.colors[i],   data[i].pic );
        // ========

    }


})



// init block



function findmax(d){
    max=0;
    d.forEach(function(d){
        if (parseFloat(d.plan)>max) max = d.plan;
    })
    return max;
}

function summ(d){
    sum=0;
    d.forEach(function(d){
        sum += +d.plan;
    })
    return sum;   
}



function upConn(x,y, xEnd , yEnd ,  canvas , i , color ,  picName) {

    if (y < yEnd)
    dif = 60+holderUp*7 ;  else dif = -80+ holderDown*7 ; 
// console.log(x,y, xEnd , yEnd  , i) ;  
    dat =[ 
        [x , y ], 
        [x  , y + dif ]   ,  
        [xEnd   , y + dif]  ,   
        [xEnd , yEnd]  
     ];
// dat =[ [ x , y ],  [ xEnd , yEnd]     ];
    var line = d3.line()
                    .x(function(d) { return d[0] ; })
                    .y(function(d) { return d[1] ; })
                    // .curve(d3.curveCardinal.tension(0.8))
                    // .curve(d3.curveBundle)
    ;
    gg = canvas.append("g").attr("class", "conn") ; 
    gg.append("path")
        .attr("class", "curveLine")
        .attr("d",function(d,i){ return line(dat); })
    ;

    canvas.append("circle")
            .attr("r",30)
            .attr("transform","translate("+[ x,y ]+")")
            .attr("fill",color)
    ;

    canvas.append("svg:image") 
            .attr("transform","translate("+[ x-20,y-20 ]+")") 
            .attr('width', 40)
            .attr('height', 40)
            .attr("xlink:href", "Icons/" + picName)
    ;

}

    function showLegend(canvas , name , color , plan ,  fact ) {
        te = canvas.append("g").attr("transform","translate(60,-20)");
        te.append("text")
            .attr("class","textLegend")
            .attr("fill",color)
            .text(name)

        te.append("text")
                .attr("transform","translate(0,30)")
                .attr("fill","black")
                .html("<tspan>План</tspan> <tspan style='font-weight:bold; '>"+plan+"</tspan><tspan> тыс.руб. </tspan> ")
        ;
        te.append("text")
                .attr("transform","translate(0,50)")
                .attr("fill","black")
                .html("<tspan>Факт</tspan> <tspan style='font-weight:bold; '>"+fact+"</tspan><tspan> тыс.руб. </tspan> ")
        ;
        te.append("text")
                .attr("transform","translate(0,70)")
                .attr("fill","black")
                .html("<tspan>% исполнения: </tspan> <tspan style='font-weight:bold; '>"+ ((plan/sum).toFixed(2)*100).toFixed(0)  +"%</tspan>  ")
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

    function getElemWidth(el) {
        return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("width");
    }

    function getElemHeight(el) {
        return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("height");
    }


    function currencySwapWithText(d) {
        d= parseInt(parseFloat(d)*0.000001 );
        return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " млн. руб.";
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

max = holderDown > holderUp ? holderDown : holderUp ;
if (  (270*max + 100) > widthSvg) {
    val =270*max +100  ; 
    svg.attr("width" , val  );
    d3.select('#someId').attr('viewBox' , "0 0 "+ val+ " 500") ; 
} 

}