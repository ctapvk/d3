function gist8() {

    svg = d3.select(".gist8");
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
    min = +findMinVal(data8);
    max = +findMaxVal(data8);
    y = d3.scaleLinear()
        .domain([min * diff, max * diff])
        .range([height, 0])
    ;

// console.log([max ,  min]);
    if (data8.length < 5) {
        x = d3.scaleLinear()
            .domain([0, data8.length])
            .range([+prop8.gistPadding, ( +prop8.barSize + +prop8.spaceBetween) * data8.length])
        ;
        barSize = +prop8.barSize;
    } else {
        x = d3.scaleLinear()
            .domain([0, data8.length])
            .range([+prop8.gistPadding, width])
        ;
        barSize = width / data8.length - +prop8.spaceBetween;
    }

    drawBack(asisX);
    drawAsisY(asisY);
    showLegend(asisX);
    showPlanIn(gist);


    drawAsisX(gist);
    showSaldo(gist);

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
            .text("млн. руб.")
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




    function showPlanIn(canvas) {
        rects = canvas.append("g");

        data8.forEach(function (d, i) {

            rectHeight = y(d.zadolzhen);
            rects.append("rect")
                .attr("transform", function () {
                    return "translate( " + [x(i), -height + y(d.zadolzhen)] + ")";
                })
                .attr("width", barSize)
                .attr("height", function () {
                    return -(rectHeight - y(0))
                })
                .attr("fill", prop8.colorPlanIn)
            ;
            rects.append("text")
                .attr("class", "factGistLabel")
                .attr("transform", "translate( " + [x(i) + barSize / 2, -height + rectHeight + 15] + ")")
                .text(cutLongSum(d.zadolzhen))
            ;
        });
    }




    function showLegend(canvas) {

        datas = canvas.append("g").attr("transform", "translate(0,0)");

        data8.forEach(function (d, i) {
            datas.append("text")
                .attr("transform", "translate(" + [x(i) + barSize / 2, +prop8.moveMounth] + ")")
                .attr("class", "mounthLabes")
                .text(d.date)
            ;
        });

        legend = canvas.append("g").attr("transform", "translate(60,0)");


        outLeg = legend.append("g").attr("transform", "translate(200,60)");
        outLeg.append("rect")
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", prop8.colorPlanIn)
        ;
        outLeg.append("text")
            .attr("transform", "translate(30 , 15)")
            .attr("class", "legend")
            .text("Задолженность")
        ;

        saldo = legend.append("g").attr("transform", "translate(350,60)");

        saldo.append("text")
            .attr("transform", "translate(120 , 15)")
            .attr("class", "legend")
            .text("Сальдо")
        ;
        line = d3.line().x(function (d) {
            return d[0]
        }).y(function (d) {
            return d[1]
        });
        saldo.append("path")
            .attr("d", line([[20, 10], [80, 10]]))
            .style("stroke", prop8.colorSaldo)
            .style("stroke-width", 4)
        ;

        saldo.append("circle")
            .style("fill", prop8.colorSaldo)
            .attr("class", "dot")
            .attr("r", 6)
            .attr("cx", 50)
            .attr("cy", 10)
        ;


    }

    function showSaldo(canvas) {

        arr = [];
        for (i=1 ; i< data8.length ; i++ ){
            arr.push(data8[i].zadolzhen-data8[i-1].zadolzhen);
        }
        line = d3.line()
            .x(function (d, i) {
                return x(i+1) + barSize / 2;
            })
            .y(function (d) {
                return -height + y(d );
            })
        ;
        g = canvas.append("g")
            .attr("transform", "translate(0 ,0)")
        ;
        g.append("path")
            .attr("d", line(arr))
            .style("stroke", prop8.colorSaldo)
            .style("stroke-width", 4)
        ;

        g.selectAll(".dot")
            .data(arr)
            .enter().append("circle")
            .style("fill", prop8.colorSaldo)
            .attr("class", "dot")
            .attr("r", 6)
            .attr("cx", function (d, i) {
                return x(i+1) + barSize / 2;
            })
            .attr("cy", function (d) {
                return -height + y(d );
            })
        ;
    }

    function findMaxVal(d) {
        max = 0;
        for (i in d)
            if (parseFloat(max) < parseFloat(d[i].zadolzhen)) max = d[i].zadolzhen;
        return max;

    }

    function findMinVal(d) {
        min = d[0].zadolzhen;
        for (i=1 ;  i<d.length; i++)
            if (parseFloat(min) < parseFloat(d[i-1].zadolzhen-d[i].zadolzhen)) min = d[i-1].zadolzhen-d[i].zadolzhen;

        return -min;

    }

    function dataProcc(d) {
        for (i in d) {
            if (d[i].zadolzhen < 0) d[i].zadolzhen = 0;
        }

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

    function cutLongSum(d) {
        if (+d > 1000)
            return d.toString().substr(0, 3);
        else
            return d;
    }


}