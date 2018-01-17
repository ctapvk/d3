function drawGraph36(data , prop , id) {

    prop.paddingLeft = 110 ;
    prop.paddingBottom = 90 ;
    // prop.paddingTop = 50 ;
    prop.paddingRight = 30 ;
    prop.barSize = 70 ;
    prop.backColor = "#acc" ;
    prop.backColor = "#eee" ;

    // console.log(data);
    /*
    wiAll = (prop.barSize*2 + prop.spaceBetween )*(data.length-1) +  30 + prop.paddingLeft + prop.paddingRight ;
    if ( wiAll > +svg.attr("width"))
        svg.attr("width" ,wiAll -(30 + prop.paddingLeft + prop.paddingRight) );
*/

    svg = d3.select("#"+id);
    svg.selectAll("*").remove();
    div = d3.select("#hideGraph36").append("div").attr("class", "tooltipGraph36").style("opacity", 0);

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
    diff = 1.05;
    min = 0;
    max = 10;
    min = parseInt(findMin(data)  * diff);
    min = parseInt(findMin(data));
    min = min * 0.95 ;
    max = parseInt(findMax(data) * diff);
    len = max.toString().length;
    deName = prop.deName ;
    if (len <4) { de=1; deText = deName; }
    if (len <7 && len>3) {de = 1; deText = deName; }
    if (len <10 && len >6) { de=0.001 ; deText = "тыс. "+deName; }
    if (len <13 && len >9) { de=0.000001 ; deText = "млн. "+deName; }
    if (len <16 && len >12) { de=0.000000001 ; deText = "млрд. "+deName; }
    if (len >15)  { de=0.000000000000001 ; deText = "трлн. "+deName; }


// console.log([ min , max ]);


    maxValsCount =  data[0].vals.length ;
    longestIndex = 0;
    data.forEach(function (t, number) {
        count = t.vals.length ;
        if (count > maxValsCount) {
            maxValsCount = count;
            longestIndex = number;
        }
    })


    len = maxValsCount ;
    size = ( prop.barSize) * len  ;
    if (  size > width ) {
        sizeSvg = +prop.paddingLeft + +prop.paddingRight + size   ;
        svg.attr("width" , sizeSvg  );
        width = sizeSvg ;
        // svg.attr('viewBox' , "0 0 "+ sizeSvg + " " +  svg.attr('height') ) ;
    }

    x = d3.scaleLinear()
        .domain([0  , maxValsCount ] )
        .range([ 50,  width   ])
    ;


    function drawLegend(canvas ) {
        te = canvas.append('g')
            .attr('class','valsLabals')
            .attr('transform','translate('+[0,20]+')')

        data[longestIndex].vals.forEach(function (t, i ) {
            te.append('text')
                .attr('transform','translate('+[x(i),0]+')')
                .html(breakLongText(d3.keys(t),5))
            ;
        })

        legend = canvas.append('g')
            .attr('class','legend')
            .attr('transform','translate('+[0,55]+')')

        data.forEach(function (t, number) {

            text = legend.append("g").attr("transform"  , "translate("+[150*number , 0]+")") ;
            text.append("text")
                .text(t.name)
                .attr("transform"  , "translate(35,17)")
            ;
            text.append("rect")
                .attr("width"  , 25 )
                .attr("height" , 25 )
                .attr("fill" , prop.colors[number])
        })
    }


    function drawGist(canvas ) {

        y = d3.scaleLinear()
            .domain([ min , max ] )
            .range([  0 ,getElemHeight(canvas)  ])
        ;


        g = canvas.append("g")
            .attr("transform", "translate("+[0, getElemHeight(canvas)]+")")
        ;
        gLables = canvas.append("g")
            .attr('class','gLables')
            .attr("transform", "translate("+[0, -prop.paddingTop +20]+")")
        ;

        data.forEach(function (t, number) {

            margin = 0 ;
            line = d3.line()
                .x(function(d , i ) { return x(i) ;  })
                .y(function(d) { return -y(d) + margin; })
            ;
            area = d3.area()
                .x(function(d , i ) {  return x(i) ; })
                .y0(0)
                .y1(function(d) {  return -y(d) + margin; })
            ;



            datGist = [];
            t.vals.forEach(function (t2 , num2) {
                val  = d3.values(t2)[0];
                datGist.push(  val ) ;
                gLables.append('text')
                    .attr("transform", "translate("+[x(num2), 20 * number]+")")
                    .attr('fill',prop.colors[number])
                    .text(currencySwap(val))
                ;

            })

            g.append("path")
                .attr("d", line(datGist))
                .style("stroke", prop.colors[number])
                .style("stroke-width", 2)
            ;
            /*
                        g.append("path")
                            .attr("d", area(datGist))
                            .style("fill", prop.colors[number])
                            .style("opacity", .3)
                        ;
            */
            // добавляем отметки к точкам
            g.selectAll(".dot" + number)
                .data(datGist)
                .enter().append("circle")
                .style("fill", prop.colors[number])
                .attr("class", "dot " + number)
                .attr("r", 6)
                .attr("cx", function(d,i) { return x(i) ; })
                .attr("cy", function(d) { return -y(d) + margin; })
            ;


        })

    }











    function drawAsisX(canvas) {

        line = d3.line().x(function(d) {return d[0];} ).y(function(d) { return d[1]} ) ;
        canvas.append("path")
            .attr("d", line([[0, 0], [getElemWidth(canvas), 0]]))
            .attr("stroke-width", 4)
            .attr("stroke", "#CDD5DE")
        ;
    }


    function drawAsisY(canvas) {

        y = d3.scaleLinear()
            .domain([min , max ])
            .range([height, 0])
        ;


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
                    .text( currencySwapAsis(dat) )
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
            .attr('class','border')
            .attr("stroke-width", 4)
            .attr("stroke", "#CDD5DE")
        ;

    }


    function currencySwap(d) {
        d = parseFloat(d * de).toFixed(2).toString().replace('.',',') ;
        return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + "";
    }

    function currencySwapAsis(d) {
        d = parseInt(d * de) ;
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
        return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " хешей.";
    }

    function cutLongSum(d) {
        if (+d > 1000)
            return d.toString().substr(0, 3);
        else
            return d;
    }

    function findMin(d) {
        min=d3.values(d[0]['vals'][0]);
        d.forEach(function (t, number) {
            t.vals.forEach(function (t2, number2) {

                dd = d3.values(t2)[0]
                if (min > dd) min = dd ;
                // console.log(dd)
            })
        })

        return min  ;
    }

    function findMax(d) {
        max=0;
        d.forEach(function (t, number) {
            // console.log(number, t )
            t.vals.forEach(function (t2, number2) {
                dd = parseFloat(d3.values(t2)[0]) ;
                if (max < dd) max = dd ;
                // console.log(dd)
            })
        })

        return max  ;
    }


    function getElemWidth(el) {
        return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("width");
    }

    function getElemHeight(el) {
        return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("height");
    }


    drawAsisY(asisY);
    drawAsisX(asisX);

    drawLegend(asisX ) ;
    drawGist(gist) ;

}