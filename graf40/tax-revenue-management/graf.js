




function gist8() {

    svg = d3.select(".gist8");
    svg.selectAll("*").remove();
    data8 = dataProcc(data8);

    widthSvg = +svg.attr("width");
    heightSvg = +svg.attr("height");
    width = +svg.attr("width") - +(prop8.paddingLeft);
    height = +svg.attr("height") - +(prop8.paddingBottom);

    asisX = svg.append("g")
        .attr("class", "asisX")
        .attr("transform", "translate(" + [widthSvg - width, height] + ")")
        .attr("width", width)
        .attr("height", heightSvg - height)
    ;
    gist = svg.append("g")
        .attr("class", "gist")
        .attr("transform", "translate(" + [widthSvg - width, height] + ")")
        .attr("width", width)
        .attr("height", height)
    ;
    asisY = svg.append("g")
        .attr("class", "asisY")
        .attr("transform", "translate(" + [0, 0] + ")")
        .attr("width", widthSvg - width)
        .attr("height", height)
    ;
    diff = 1.3;
    min = 0;
    max = +findMaxVal(data8);
    y = d3.scaleLinear()
        .domain([min * diff, max * diff])
        .range([height, 0])
    ;

// console.log([max ,  min]);
    if (data8.length < 7) {
        x = d3.scaleLinear()
            .domain([0, 6])
            .range([+prop8.gistPadding, ( +prop8.barSize + +prop8.spaceBetween) * 6])
        ;
        rotText = "";
        barSize = +prop8.barSize;
    } else {
        x = d3.scaleLinear()
            .domain([0, data8.length-1])
            .range([ +prop8.gistPadding/2 , (+prop8.barSize-5 )*11])
        ;
        rotText = "rotate(30 )";
        if (data8.length==12) c = 10; else c=5;
        barSize = +prop8.barSize-c; ;
    }

    drawBack(asisX);
    drawAsisY(asisY);
    showLegend(asisX);
    drawNach(gist);
    drawpostup(gist);


    drawAsisX(gist);


    function drawAsisX(canvas) {

        line = d3.line().x(function (d) {
            return d[0]
        }).y(function (d) {
            return d[1]
        });
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
        line = d3.line()
            .x(function (d) {
                return d[0]
            })
            .y(function (d) {
                return d[1]
            })
        ;
        canvas.append("path")
            .attr("transform", function (d) {
                return "translate(" + [0, 0] + ")"
            })
            .attr("d", line([[getElemWidth(canvas), 0], [getElemWidth(canvas), getElemHeight(canvas)]]))
            .attr("stroke-width", 4)
            .attr("stroke", "#CDD5DE")
        ;

        legend = canvas.append("g")
            .attr("transform", "translate(" + [getElemWidth(canvas), 0] + ")")
            .attr("class", "legend")
        ;

        y.ticks().forEach(function (dat, i) {
            if (i != y.ticks().length - 1) {
                text = legend.append("g")
                    .attr("transform", function (d) {
                        return "translate(" + [0, y(dat)] + ")"
                    })
                ;
                text.append("text")
                    .attr("class", "asisYcapiton")
                    .attr("transform", function (d) {
                        return "translate(" + [-10, 0] + ")"
                    })
                    .text(function (d) {
                        return currencySwap(dat)
                    })
                ;
                text.append("circle")
                    .attr("r", 5)
                    .attr("fill", "#CDD5DE")
                ;
            }
        })
        ;

        legend.append("text")
            .attr("class", "asisYcapiton")
            .attr("transform", "translate( " + [-10, 10] + ")")
            .text("тыс. руб.")
        ;
    }




    function drawBack(canvas) {
        rects = canvas.append("g").attr("class", "backRects");

        tis = y.ticks();
        backHei = y(tis[0]) - y(tis[1]);
        tis.forEach(function (d, i) {
            // console.log(y.ticks());
            if (i % 2 == 0) {
                rectHeight = y(d.planOut);
                rects.append("rect")
                    .attr("transform", function () {
                        return "translate( " + [0, y(d) - height] + ")";
                    })
                    .attr("width", width)
                    .attr("height", backHei)
                    .attr("fill", prop8.backColor)
                ;
            }
        });
    }


    div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

    function drawNach(canvas) {
        rects = canvas.append("g");

        data8.forEach(function (d, i) {

            rectHeight = y(d.nach);

            rects.append("rect")
                .attr("transform", function () {
                    return "translate( " + [x(i), -height + y(d.nach)] + ")";
                })
                .attr("width", barSize)
                .attr("height", function () {
                    return -(rectHeight - y(0))
                })
                .attr("fill", prop8.colornach)
                .on("mousemove", function() {
                    div.transition().duration(200).style("opacity", .9);
                    div.html(    currencySwapNoCut(d.nach) )
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 30 ) + "px")
                    ;
                })
                .on("mouseout", function() { div.transition().duration(500).style("opacity", 0); })
                .on("click", function() { drawGraph20(d.dat);  })

            ;
            rects.append("text")
                .attr("class", "planGistLabel")
                .attr("transform", "translate( " + [x(i) + barSize / 2, -height + rectHeight - 15] + ")")
                .text(cutLongSum(d.nach))

            ;
        });
    }

    function drawpostup(canvas) {
        rects = canvas.append("g");

        data8.forEach(function (d, i) {

            rectHeight = y(d.postup);
            rects.append("rect")
                .attr("transform", function () {
                    return "translate( " + [x(i), -height + y(d.postup)] + ")";
                })
                .attr("width", barSize)
                .attr("height", function () {
                    return -(rectHeight - y(0))
                })
                .attr("fill", prop8.colorpostup)
                .on("mousemove", function() {
                    div.transition().duration(200).style("opacity", .9);
                    div.html(   currencySwapNoCut(d.postup) )
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 30 ) + "px")
                    ;
                })
                .on("mouseout", function() { div.transition().duration(500).style("opacity", 0); })
                .on("click", function() { drawGraph20(d.dat);  })


            ;
            rects.append("text")
                .attr("class", "factGistLabel")
                .attr("transform", "translate( " + [x(i) + barSize / 2, -height + rectHeight + 15] + ")")
                .text(cutLongSum(d.postup))
            ;
        });
    }


    function wrapDate(d) {
        arr = d.split("-");
        if (arr[2]!=undefined)
            return arr[2] + '.' + arr[1] + '.' + arr[0];
        else
            return d ;
    }

    function showLegend(canvas) {

        datas = canvas.append("g").attr("transform", "translate(0,0)");


        data8.forEach(function (d, i) {
            datas.append("text")
                .attr("transform", " translate(" + [x(i) + barSize / 2, +prop8.moveMounth] + ") "+ rotText+" ")
                .attr("class", "mounthLabes")
                .text(wrapDate(d.date))
            ;
        });

        legend = canvas.append("g").attr("transform", "translate(60,0)");


        outLeg = legend.append("g").attr("transform", "translate(0,60)");
        outLeg.append("rect")
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", prop8.colornach)
        ;
        outLeg.append("text")
            .attr("transform", "translate(30 , 15)")
            .attr("class", "legend")
            .text("Начислено к уплате")
        ;

        outLeg = legend.append("g").attr("transform", "translate(200,60)");
        outLeg.append("rect")
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", prop8.colorpostup)
        ;
        outLeg.append("text")
            .attr("transform", "translate(30 , 15)")
            .attr("class", "legend")
            .text("Поступления в бюджеты")
        ;



    }



    function findMaxVal(d) {
        max = 0;
        for (i in d)
            if (parseFloat(max) < parseFloat(d[i].nach)) max = d[i].nach;
        for (i in d)
            if (parseFloat(max) < parseFloat(d[i].postup)) max = d[i].postup;
        return max;

    }

    function dataProcc(d) {
        for (i in d)
            if (d[i].nach < 0) d[i].nach = 0;
        for (i in d)
            if (d[i].postup < 0) d[i].postup = 0;


        return d;

    }

    function getElemWidth(el) {
        return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("width");
    }

    function getElemHeight(el) {
        return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("height");
    }

    function currencySwap(d) {
        d = parseInt(d * 0.001);
        return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + "";
    }


    function cutLongText (str) {
        str = str[0];
        if (str.length > 25){
            return str.substr(0,25) + "..." ;
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
        d= parseInt(parseFloat(d) );
        return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " руб.";
    }

    function cutLongSum(d) {
        if (+d > 1000)
            return d.toString().substr(0, 3);
        else
            return d;
    }



    function drawGraph20(data) {
// init block
        var svg = d3.select(".graf20");
        svg.selectAll("*").remove();

        widthSvg = +svg.attr("width");
        heightSvg = +svg.attr("height");
        width = +svg.attr("width") ;
        height = +svg.attr("height");

        center = svg.append("g")
            .attr("class", "center")
            .attr("transform", "translate("+[ width/2, +prop8.radius+30  ]+")")
        ;

        x = d3.scaleLinear()
            .domain([0  , 100 ] )
            .range([ 0 ,  +prop8.radius   ])
        ;

// init block



        function drawBase(canvas){
            te = canvas.append("g").attr("class" , "basePie");

            pie = d3.pie().padAngle(.0).sort(null);
            arc = d3.arc();

            dat = [];
            data.forEach(function (t) {
                dat.push((Object.values(t))[0])
            })


            pie( dat ).forEach( function (t, i ) {
                t.outerRadius = prop8.radius ;  t.innerRadius = 35;
                te.append("path")
                    .attr("fill" ,  prop8.colorsKrug[i] )
                    .attr("d", arc(t))
                    .on("mousemove", function(d) {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html(
                            Object.keys(data[i]) +" : " + currencySwapNoCut(t.data ) )
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                    })
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
                    })
                ;

                if ( +(t.data / d3.sum(dat))*100 >11)
                    txt=( (t.data / d3.sum(dat)).toFixed(3) * 100).toFixed(1) + '%' ;   else txt="";

                te.append("text")
                    .attr("class" , "krugPieTextLegend")
                    .attr("transform" , "translate(" + d3.arc().centroid(t) + ")")
                    .text( txt )
                ;
            });

        }



        function drawLegend(canvas) {
            te = canvas.append("g")
                .attr("transform" , "translate("+[ 50 ,  +prop8.radius*2 + 100 ]+")")
            ;
            caps = ["Поступления в ФБ","Поступления в бюджет Волгоградской области"];
            data.forEach(function (d , i ) {
                leg = te.append("g").attr("transform" , "translate("+[ 0, i*40  ]+")");

                leg.append("text")
                    .attr("class", "krugLegText").html( breakLongText(Object.keys(data[i]) , 18) )
                    // .attr("class", "krugLegText").text( Object.keys(data[i])  )
                ;


                leg.append("rect")
                    .attr("class" , "krugRectLeg")
                    .attr("transform" , "translate("+[ -35,-18 ]+")")
                    .attr("fill", prop8.colorsKrug[i])
                ;

            })
        }

        drawLegend(svg);
        drawBase(center);
    }




}
