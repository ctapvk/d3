function drawGist(data , prop , id) {

    prop.paddingLeft = 120 ;
    prop.paddingBottom = 200 ;
    prop.paddingTop = 0 ;
    prop.paddingRight = 30 ;
    prop.backColor = "#acc" ;

    // console.log(prop);

    svg = d3.select("#graf34");
    div = d3.select("#hide34").append("div").attr("class", "tooltip").style("opacity", 0);

    svg.selectAll("*").remove();

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
/*
    showBorders(asisX);
    showBorders(gist);
    showBorders(asisY);
    showBorders(asisXtop);
    showBorders(asisYright);
*/
    diff = 1.2;
    min = 0;
    max = findMax(data);
    y = d3.scaleLinear()
        .domain([min * diff, max * diff])
        .range([height, 0])
    ;

// console.log([max ,  min]);
    x = d3.scaleLinear()
        .domain([0, data.length])
        .range([ 0 , ( +prop.barSize + +prop.spaceBetween) * data.length])
    ;
    barSize = +prop.barSize;

drawLegend(asisX)
    function drawLegend(canvas) {
        dat = data[0].vals;

        te = canvas.append("g")   .attr("transform","translate("+[0,50]+")");
        c=0;
        for (let i=0;i<2;i++){
            ll = te.append("g").attr("transform","translate("+[0,50*c]+")");
            c++;
            ll.append("rect")
                .attr("width","20")
                .attr("height","20")
                .attr("fill",prop.colors[i])
            ll.append("text")
                .attr("transform","translate("+[30,15]+")")
                .html(breakLongText( d3.keys(dat[i])[0] , 30) )
        }

        te = canvas.append("g")   .attr("transform","translate("+[getElemWidth(canvas)/2,50]+")");
        c=0;
        for (let i=2;i<4;i++){
            ll = te.append("g").attr("transform","translate("+[0,50*c]+")");
            c++;
            ll.append("rect")
                .attr("width","20")
                .attr("height","20")
                .attr("fill",prop.colors[i])
            ll.append("text")
                .attr("transform","translate("+[30,15]+")")
                .html(breakLongText( d3.keys(dat[i])[0] , 30) )
        }
    }


    function drawGist(canvas) {
        te = canvas.append("g").attr("transform","translate("+[+prop.spaceBetween,0]+")");

        data.forEach(function (d , i) {
            bar = te.append("g");
            rect = bar.append("g")
                .attr("class", "asisY")
                .attr("transform","translate("+[x(i),0]+")")
                .attr("width",barSize)
                .attr("height",getElemHeight(canvas))
            ;
            rectDat = d.vals;  rectDif = 0;
            he = getElemHeight(canvas);
            rectDat.forEach(function (t,j) {
                rectHe = getElemHeight(canvas)-y(d3.values(t)[0] );
                rectDif+=rectHe;
                rect.append("rect")
                    .attr("width",barSize)
                    .attr("transform","translate("+[0,he - rectDif]+")")
                    .attr("height",rectHe)
                    .attr("fill",prop.colors[j])
                    .on("mousemove", function() {
                        div.transition().duration(200).style("opacity", .9);
                        let sum =0;
                        d.vals.forEach(function (t) { sum += d3.values(t)[0];  })

                        div.html(
                            d3.keys(t)[0] + " :  " + currencySwapNoCut(d3.values(t)[0]) + "<br>" +
                             "Всего :  " + currencySwapNoCut(sum) + "<br>"
                        )
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 30 ) + "px")
                        ;
                    })
                    .on("mouseout", function() { div.transition().duration(500).style("opacity", 0); })
            })
            // showBorders(rect)
            rect.append("text")
                .attr("transform","translate("+[barSize/2, +getElemHeight(canvas)+28]+")")
                .attr("class","middleText")
                .text(d.year)
        })
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
                    .attr("text-anchor", "end")
                    .attr("fill", "#bbc3cc")
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
            .attr("class", "asisYcapiton")
            .attr("transform", "translate( " + [getElemWidth(canvas)/2, 15] + ")")
            .text("млн. руб.")
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
        str = str;

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

    function findMax(data) {
        max=0;
        data.forEach(function (d) {
            sum =0;
            d.vals.forEach(function (t) { sum += d3.values(t)[0];  })
            if (max < sum ) max = sum ;
        })
        return max;
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
}