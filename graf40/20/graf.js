function drawGraph20(prop, data , index) {
// init block
    var svg = d3.select(".graf20");
    svg.selectAll("*").remove();
    d3.selectAll(".tooltip").remove();

    widthSvg = +svg.attr("width");
    heightSvg = +svg.attr("height");
    width = +svg.attr("width") ;
    height = +svg.attr("height");

    center = svg.append("g")
        .attr("class", "center")
        .attr("transform", "translate("+[ width/2,  +prop.radius + 10  ]+")")
    ;

    x = d3.scaleLinear()
        .domain([0  , 100 ] )
        .range([ +prop.radiusOfHole  ,  +prop.radius   ])
    ;

    div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

// init block



    function drawBase(canvas){
        te = canvas.append("g").attr("class" , "basePie");

        pie = d3.pie().padAngle(.0).sort(null);
        arc = d3.arc();

        pie(data.vals[0].value).forEach( function (t, i ) {
            t.outerRadius = +prop.radius;  t.innerRadius = +prop.radiusOfHole ;
            te.append("path")
                .attr("fill" ,  prop.colorsBase[i] )
                .attr("d", arc(t))
                .on("mousemove", function(d) {
                    div.transition().duration(200).style("opacity", .9);
                    div.html( data.vals[0].name+ ' : ' + currencySwapNoCut(data.vals[0].value[i]) )
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    div.transition().duration(500).style("opacity", 0);
                })

            ;
        });

    }

    function drawOverBase(canvas , index){
        te = canvas.append("g").attr("class" , "OverPie");

        pie = d3.pie().padAngle(.0).sort(null);
        arc = d3.arc();
        label = d3.arc();

        leftSide = canvas.append("g").attr("class", "legend")  ;

        leftcount=0;rightcount=0;

        pie(data.vals[0].value).forEach( function (t, i ) {

            var per =   (data.vals[index].value[i]/ data.vals[0].value[i]).toFixed(2)*100 ;
            t.outerRadius = x(per) ;  t.innerRadius = +prop.radiusOfHole;
            if (index!=0) {
            te.append("path")
                .attr("fill" ,  prop.colorsOverBase[i] )
                .attr("d", arc(t))
                .on("mousemove", function(d) {
                    div.transition().duration(200).style("opacity", .9);
                    div.html( data.vals[index].name+ ' : ' + currencySwapNoCut(data.vals[index].value[i] ) +' ( '+ per.toFixed(0) + '% )' )
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    div.transition().duration(500).style("opacity", 0);
                })

            ;
            t.outerRadius = +prop.radiusOfHole+60 ;  t.innerRadius = +prop.radiusOfHole;
            if (per > 50)
            te.append("text")
                .attr("class" , "krugPieTextLegend")
                .attr("transform", "translate("+  arc.centroid(t)+")")
                .text(per + '%')
            ;
            }

            t.outerRadius = 230  ;
            text= [
                data.baseName.value[i],

                data.vals[index].name + ' <tspan class="leftLegUnderBold"> ' +
                currencySwapNoCut((data.vals[index].value[i]))  + ' ' +
                per  + '% </tspan>  '
            ];

            if ( t.endAngle > 3 ) leftDots(arc.centroid(t) , leftcount++ , i , text );
            if ( t.endAngle <= 3 ) rightDots(arc.centroid(t) , rightcount++ , i ,text);

        });


function leftDots(aa , leftcount, color, text){

    legLeft = leftSide.append("g")
        .attr("class" , "legLeft")
    ;

    bb = [ -prop.radius-100 ,  +prop.radius + 40 + leftcount*45 ];

    leftSideConn( aa[0] ,aa[1] , bb[0], bb[1] ,  legLeft   , leftcount) ;

    whiteDdd = legLeft.append("g")
        .attr("class" , "leftDots")
        .attr("transform" , "translate("+ aa +")")
    ;
    whiteDdd.append("circle")
        .attr("r", 5)
        .attr("class", "whiteDot")
        .attr("fill", "white")
    ;
    whiteDdd.append("circle")
        .attr("r", + 5-2.5)
        .attr("fill", function(d) {   return prop.colorsBase[color]; })
    ;

    leftLegend =  legLeft.append("g")
        .attr("transform" , function(d) { return "translate(" + [  bb[0], bb[1]  ] + ")" })
        .attr("class" , "leftLegend")
    ;
    leftLegend.append("rect")
        .attr("width" , 20)
        .attr("height" , 20)
        .attr("fill" , prop.colorsBase[color] )
    ;
    leftLegend.append("text")
        .attr("class", "leftLegTop")
        .attr("transform" , "translate(30 , 5)" )
        .text(text[0])
    ;
    leftLegend.append("text")
        .attr("class", "leftLegUnder")
        .attr("transform" , "translate(30 , 20)" )
        .html(text[1])
    ;

}

function rightDots(aa ,rightcount, color, text){

    legRight = leftSide.append("g")
        .attr("class" , "legRight")
    ;

    bb = [ +prop.radius+100 ,  +prop.radius + 40 + rightcount*45 ];

    rigthSideConn( aa[0] ,aa[1] , bb[0]+20, bb[1] ,  legRight   , rightcount) ;

    whiteDdd = legRight.append("g")
        .attr("class" , "leftDots")
        .attr("transform" , "translate("+ aa +")")
    ;
    whiteDdd.append("circle")
        .attr("r", 5)
        .attr("class", "whiteDot")
        .attr("fill", "white")
    ;
    whiteDdd.append("circle")
        .attr("r", + 5-2.5)
        .attr("fill", function(d) {   return prop.colorsBase[color]; })
    ;

    leftLegend =  legRight.append("g")
        .attr("transform" , function(d) { return "translate(" + [  bb[0], bb[1]  ] + ")" })
        .attr("class" , "leftLegend")
    ;
    leftLegend.append("rect")
        .attr("width" , 20)
        .attr("height" , 20)
        .attr("fill" , prop.colorsBase[color] )
    ;
    leftLegend.append("text")
        .attr("class", "rightLegTop")
        .attr("transform" , "translate(-30 , 5)" )
        .text(text[0])
    ;
    leftLegend.append("text")
        .attr("class", "rightLegUnder")
        .attr("transform" , "translate(-30 , 20)" )
        .html(text[1])
    ;

}



    }






    function leftSideConn(x,y, xEnd , yEnd ,  canvas , i) {
        dif = 15 ;
// console.log(x,y, xEnd , yEnd  , i) ;
        di = prop.paddingLeft + (i+2)*10 ;
        dat =[
            [x , y ],
            [xEnd - di + dif , y ]   ,
            [xEnd - di , y + dif ]   ,
            [xEnd - di  , yEnd - dif]  ,
            [xEnd - di +dif , yEnd]  ,
            [xEnd , yEnd]
        ];
        // console.log(dat);
// dat =[ [ x , y ],  [ xEnd , yEnd]     ];
        var line = d3.line()
                .x(function(d) { return d[0] ; })
                .y(function(d) { return d[1] ; })
                .curve(d3.curveCardinal.tension(0.8))
            // .curve(d3.curveBundle)
        ;
        gg = canvas.append("g").attr("class", "conn") ;
        gg.append("path")
            .attr("class", "curveLine")
            .attr("d",function(d,i){ return line(dat); })
        ;
    }

    function rigthSideConn(x,y, xEnd , yEnd ,  canvas , i) {
        dif = 15 ;
        // console.log(x,y, xEnd , yEnd  , i) ;
        di = prop.paddingLeft - (i+2)*10 ;
        dat =[
            [x , y ],
            [xEnd - di - dif , y ]   ,
            [xEnd - di , y + dif ]   ,
            [xEnd - di  , yEnd - dif]  ,
            [xEnd - di -dif , yEnd]  ,
            [xEnd , yEnd]
        ];
// dat =[ [ x , y ],  [ xEnd , yEnd]     ];
        var line = d3.line()
                .x(function(d) { return d[0] ; })
                .y(function(d) { return d[1] ; })
                .curve(d3.curveCardinal.tension(0.8))
            // .curve(d3.curveBundle)
        ;
        gg = canvas.append("g").attr("class", "conn") ;
        gg.append("path")
            .attr("class", "curveLine")
            .attr("d",function(d,i){ return line(dat); })
        ;
    }

    function cutLongText (str) {
        str = str[0];
        if (str.length > 25)
            return str.substr(0,25) + "..." ;
        else
            return str ;
    }


    function currencySwap(d) {
        d= parseInt(parseFloat(d)*0.001 );
        return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " тыс. руб.";
    }

    function currencySwapNoCut(d) {
        d= parseInt(parseFloat(d) );
        return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " руб.";
    }




drawBase(center);

drawOverBase(center , index);
}


te = d3.select("#graf20Legend");
s ='<div class="control-group">' ;
data20.vals.forEach(function(d, i) {
    // console.log(d);
    s+= '<label class="control control--radio" >' + d.name ;
    s+= '<input onclick="drawGraph20(prop20 ,data20 ,'+i +')" type="radio" name="radio" />';
    s+= '<div class="control__indicator"></div>';
    s+= '</label>';

})
s+= "</div>";

te.html(s);


