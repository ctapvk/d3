function drawGraph20(prop, data , index ) {
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
        .attr("transform", "translate("+[ width/2,  +prop.radius + 40  ]+")")
    ;

    x = d3.scaleLinear()
        .domain([0  , 100 ] )
        .range([ +prop.radiusOfHole  ,  +prop.radius   ])
    ;

    div = d3.select("#hide888").append("div").attr("class", "tooltip").style("opacity", 0);

// init block

    drawCaption(svg);
    function drawCaption(canvas) {
        te = canvas.append("g") ;

        ar=[
            "Данные на " + prop.dataPar ,
            "Доведено лимитов к ассионованиям на " + prop.dataPar ,
            "Доведено обязательств к ассионованиям на " + prop.dataPar ,
            "Доведено кассовых планов к ассионованиям на " + prop.dataPar ,
            "Доведено исполнений к ассионованиям на " + prop.dataPar ,
        ];
        te.append("text")
            .attr("class","textAsisXtop")
            .attr("transform","translate("+[0 , 25]+")")
            .text(ar[index])
        ;
    }

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
                .text( Math.ceil(per) + '%')
            ;
            }

            t.outerRadius = 230  ;
            text= [
                data.baseName.value[i],

                data.vals[index].name + ' <tspan class="leftLegUnderBold"> ' +
                currencySwapNoCut( (data.vals[index].value[i]))  + ' ' +
                Math.ceil(per)  + '% </tspan>  '
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
        di =  (i+2)*10 ;
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
        di =  - (i+2)*10 ;
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

function showGist( index ) {


    svg = d3.select(".grafTwo");
    svg.selectAll("*").remove();

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
    asisYright = svg.append("g")
        .attr("class", "asisYright")
        .attr("transform", "translate(" + [widthSvg -+prop.paddingRight , +prop.paddingTop] + ")")
        .attr("width", +prop.paddingRight )
        .attr("height", heightSvg - +prop.paddingBottom - +prop.paddingTop)
    ;
    gist = svg.append("g")
        .attr("class", "gist")
        .attr("transform", "translate(" + [+prop.paddingLeft   , +prop.paddingTop ] + ")")
        .attr("width", width )
        .attr("height", heightSvg - +prop.paddingBottom - +prop.paddingTop )
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
    max = +data.vals[index].limit ;
    y = d3.scaleLinear()
        .domain([min * diff, max * diff])
        .range([height, 0])
    ;

// console.log([max ,  min]);
    x = d3.scaleLinear()
        .domain([0, 21])
        .range([+prop.gistPadding, ( +prop.barSize + +prop.spaceBetween) * 21])
    ;
    barSize = +prop.barSize;


    function drawCaption(canvas) {
        te = canvas.append("g") ;

        te.append("text")
            .attr("class","textAsisXtop")
            .attr("transform","translate("+[-prop.paddingLeft+10 , 25]+")")
            .text("Расходы бюджета на " + prop.dataPar)
        ;
    }

    function drawLegend(canvas) {
        te = canvas.append("g")
            .attr("transform" , "translate("+[ -30,30]+")")
        ;

        item = te.append("g") .attr("transform" , "translate("+[0,0]+")") ;
        item.append("rect")
            .attr("width","20")
            .attr("height","20")
            .attr("fill",prop.colorZak)
        ;
        item.append("text")
            .attr("transform","translate("+[25,15]+")")
            .attr("class","legendX")
            .text("Предусмотрено законом")
        ;
        item.append("text")
            .attr("transform","translate("+[25,35]+")")
            .attr("fill","gray")
            .text(currencySwapWithText(+data.vals[index].limit ))
        ;


        item = te.append("g") .attr("transform" , "translate("+[0,50]+")") ;
        item.append("rect")
            .attr("width","20")
            .attr("height","20")
            .attr("fill",prop.colorLim)
        ;
        item.append("text")
            .attr("transform","translate("+[25,15]+")")
            .attr("class","legendX")
            .text(data.vals[0].name )
        ;
        item.append("text")
            .attr("transform","translate("+[25,35]+")")
            .attr("fill","gray")
            .text(currencySwapWithText(d3.sum(data.vals[0].value) ))

        if (index!=0){
            item = te.append("g") .attr("transform" , "translate("+[0,100]+")") ;
            item.append("rect")
                .attr("width","20")
                .attr("height","20")
                .attr("fill",prop.colorGet)
            ;
            item.append("text")
                .attr("transform","translate("+[25,15]+")")
                .attr("class","legendX")
                .text(data.vals[index].name)
            ;
            item.append("text")
                .attr("transform","translate("+[25,35]+")")
                .attr("fill","gray")
                .text(currencySwapWithText(d3.sum(data.vals[index].value) ))
        }


    }

    function drawGist(canvas){
        te = canvas.append("g").attr("transform" , "translate(0,0)") ;

        zakTe = te.append("g").attr("transform" , "translate("+[ 40 , y(+data.vals[index].limit)  ]+")" )  ;
        zakTe.append("rect")
            .attr("fill" , prop.colorZak)
            .attr("width" , +prop.barSize)
            .attr("height" , height - y(+data.vals[index].limit))
        ;
        zakTe.append("text")
            .attr("class" , "legendCaption")
            .attr("transform" , "translate("+[ 0 , -5 ]+")" )
            .text(currencySwapNoCut(+data.vals[index].limit ))
        ;

        sum = d3.sum(data.vals[index].value) ; 
        sumAssig = d3.sum(data.vals[0].value) ;
        zakTe = te.append("g").attr("transform" , "translate("+[ 90 , y(sumAssig)  ]+")" )  ;
        zakTe.append("rect")
            .attr("fill" , prop.colorLim)
            .attr("width" , +prop.barSize)
            .attr("height" , height - y(sumAssig))
        ;
        zakTe.append("text")
            .attr("class" , "legendCaption")
            .attr("transform" , "translate("+[ +prop.barSize , -5 ]+")" )
            .text(currencySwapNoCut(sumAssig ))
        ;

        if (index!=0){
            per =  Math.floor((sum/ sumAssig  )*100) ;
            wi = +prop.barSize * (sum / +data.vals[index].limit) ;
            heParent =  height - y(sum) ;
            he = ( height - y(sum))  * per/100 ;
            // console.log(d3.sum(data.vals[index].value));
            zakTe = te.append("g").attr("transform" , "translate("+[
                90+ +prop.barSize/2 -  wi/2 ,
                y(sum) + ( height - y(sum) -he )
            ]+")" )  ;

            zakTe.append("rect")
                .attr("fill" , prop.colorGet)
                .attr("stroke" , "white")
                .attr("stroke-width" , "2px")
                // .attr("transform" , "translate("+[ 0 , -5 ]+")" )
                .attr("width" , wi )
                .attr("height" , he )
            ;
            if (per < 90) koi = -10 ;else koi=20;
            zakTe.append("text")
                .attr("class" , "legendCaption2")
                .attr("transform" , "translate("+[ +wi/2 , koi ]+")" )
                .text( per + "%" )
            ;
        }

    }

    function drawAsisX(canvas) {

        line = d3.line().x(function(d) {return d[0];} ).y(function(d) { return d[1]} ) ;

        canvas.append("path")
            .attr("transform", function (d) {
                return "translate(" + [0, -height + y(0)] + ")"
            })
            .attr("d", line([[0, 0], [getElemWidth(canvas), 0]]))
            .attr("stroke-width", 4)
            .attr("stroke", "#CDD5DE")
        ;
    }


    function drawAsisY(canvas) {
        // back
        rects = canvas.append("g").attr("class", "backRects");

        tis = y.ticks();
        backHei = y(tis[0]) - y(tis[1]);
        tis.forEach(function (d, i) {
            // console.log(y.ticks());
            if (i % 2 != 0 && i!=0) {
                rectHeight = y(d.planOut);
                rects.append("rect")
                    .attr("transform", "translate( " + [ getElemWidth(canvas) ,  y(d)] + ")")
                    .attr("width", width)
                    .attr("height", backHei)
                    .attr("fill", prop.backColor)
                ;
            }
        });

        //
        canvas.append("text")
            .attr("transform","translate("+[25,5]+")")
            .attr("class", "asisYcapitonRub")
            .text("тыс. руб.")
        ;
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
                    .attr("class", "asisYcapiton")
                    .attr("transform",  "translate(" + [-10, 0] + ")" )
                    .text( currencySwap(dat) )
                ;
                text.append("circle")
                    .attr("r", 5)
                    .attr("fill", "#CDD5DE")
                ;

            }
        });
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
        // d= parseInt(parseFloat(d)*0.001 );
        return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " руб.";
    }

    function currencySwapNoCut(d) {
        d= (parseInt(d) );
        return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + "";
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
    drawAsisX(asisX);
    drawGist(gist);
    drawLegend(asisX);
    drawCaption(asisXtop);

}


drawBase(center);
drawOverBase(center , index);
showGist( index );

}


te = d3.select("#graf20Legend");
s ='<div class="control-group">' ;
data20.vals.forEach(function(d, i) {
    // console.log(d);
    s+= '<label class="control control--radio" >' + d.name ;
    s+= '<input onclick="drawGraph20(prop20 ,data20 ,'+i +' )" type="radio" name="radio" />';
    s+= '<div class="control__indicator"></div>';
    s+= '</label>';

})
s+= "</div>";

te.html(s);


