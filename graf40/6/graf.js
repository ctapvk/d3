function drawGraph() {

    svg = d3.select(".gist6");
    widthSvg = +svg.attr("width");
    heightSvg = +svg.attr("height");
    width = +svg.attr("width") - +(prop6.paddingLeft) - +prop6.paddingRight;
    height = +svg.attr("height") - +(prop6.paddingBottom);

    asisX = svg.append("g")
        .attr("class", "asisX")
        .attr("transform", "translate(" + [+prop6.paddingLeft, heightSvg] + ")")
        .attr("width", width)
        .attr("height", heightSvg - height)
    ;
    asisY = svg.append("g")
        .attr("class", "asisY")
        .attr("transform", "translate(" + [0, 0] + ")")
        .attr("width", +prop6.paddingLeft)
        .attr("height", height)
    ;
    gist = svg.append("g")
        .attr("class", "gist")
        .attr("transform", "translate(" + [+prop6.paddingLeft, height] + ")")
        .attr("width", width)
        .attr("height", height)
    ;
    countInnerDataForPie(data3);
	max = Math.max(data3[0].sum, data3[1].sum);
	duff =1.5;
    y = d3.scaleLinear()
        .domain([0, max*duff])
        .range([height, 0])
    ;
    y1 = d3.scaleLinear()
        .domain([0, max*duff])
        .range([0, height])
    ;
    x = d3.scaleLinear()
        .domain([0, data3.length])
        .range([+prop6.gistPadding, width])
    ;

    barSize = width / data3.length - +prop6.gistPadding;

    drawBack(asisX);
    drawAsisX(asisX);
    drawAsisY(asisY);
draw(gist);
drawCircle(gist);
drawLegend(gist);
    drawBottomLine(gist);



    function draw(canvas) {
        legend = canvas.append("g")
            .attr("transform", "translate(" + [0, -getElemHeight(canvas)] + ")")
            .attr("class", "bars")
        ;
        leftSide = canvas.append("g")
            .attr("transform", "translate(" + [0, -getElemHeight(canvas)] + ")")
            .attr("class", "leftSide")
        ;

        data3.forEach(function (dat, i) {
            text = legend.append("g")
                .attr("transform", function (d) {
                    return "translate(" + [x(i), 0] + ")"
                })
            ;
            sumRect = 0;
            count = 0;
            for (dd in dat) {
                if (dd != "year" && dd != "sum") {
                    rectHeight = (y(0)-y(max)) * dat[dd] /max;
                    sumRect += rectHeight;
                    legs = text.append("g").attr("transform", "translate(" + [barSize/2 - prop6.barSize/2
                        , -sumRect +height ] + ")")
					;

                    let sss= currencySwap(dat[dd]) + ' руб';
                    let sss1=dd;

                    legs.append("rect")
                        .attr("transform", "translate(" + [0,0] + ")")
							// , -height + sumRect - rectHeight + y(dat[dd])] + ")")
                        .attr("class", "rectsg6")
                        .attr("height", rectHeight)
                        .attr("width", prop6.barSize)
                        .attr("fill", prop6.colors[count++])
                        //.attr("onmousemove", '  console.log(event.x );  d3.select("#tooltipg6").select("#captionG6") .text(123); d3.select("#tooltipg6").classed("hidden", false); '  )
                        .on("mousemove", function(event) {
                            // console.log( d3.event);
                            d3.select("#tooltipg6").select("#captionG6") .text(sss1);
                            d3.select("#tooltipg6")
                                .style("left", d3.event.pageX  + "px")
                                .style("top", d3.event.pageY + "px")
                                .select("#valueG6") .text(sss)
                            ;
                            //Show the tooltip
                            d3.select("#tooltipg6").classed("hidden", false);
                        })
                        .on("mouseout",function() { d3.select("#tooltipg6").classed("hidden", true);  })
                    ;

                    legs.append("text")
							.attr("class" , "percentsInGist")
							.attr("fill" , "red")
							.attr("transform" , "translate(" + [+prop6.barSize/2 , rectHeight/2 ] + ")")
							.text((dat[dd] /dat.sum).toFixed(2)*100 + '%')
					;
                }
                ;
            }

        });
    }
function drawCircle(canvas) {
	radius = 30 ;
	te = canvas.append("g").attr("transform" , "translate("+
		[getElemWidth(canvas)/2 ,  -getElemHeight(canvas)+radius]+")");
	te.append("circle")
		.attr("cx", function (d) { return 0 ; })
        .attr("cy", function (d) { return 0 ; })
        .attr("r", function (d) { return radius; })
        .style("fill", function(d) { return prop6.circleColor; })
    ;
    te.append("text")
        .attr("class" , "percentsInGist")
        .attr("fill" , "red")
        .attr("transform" , "translate(" + [0,0 ] + ")")
        .text((data3[1].sum /data3[0].sum).toFixed(2)*100 + '%')
    ;

}

function drawLegend(canvas) {
	te = canvas.append("g");
    te.append("text")
        .attr("class" , "legendText")
        .attr("transform" , "translate(" + [ barSize/2 , -y(0)+y(data3[0].sum) -5 ] + ")")
        .text(currencySwap(data3[0].sum))
    ;
    te.append("text")
        .attr("class" , "legendText")
        .attr("transform" , "translate(" + [ barSize*1.5 , -y(0)+y(data3[1].sum) -5 ] + ")")
        .text(currencySwap(data3[1].sum))
    ;

}



    function drawBottomLine(canvas) {
        line = d3.line().x(function (d) {
            return d[0]
        }).y(function (d) {
            return d[1]
        });
        canvas.append("path")
            .attr("transform", function (d) {
                return "translate(" + [0, 0] + ")"
            })
            .attr("d", line([[0, 0], [width, 0]]))
            .attr("stroke-width", 4)
            .attr("stroke", "#CDD5DE")
        ;

    }

    function drawAsisX(canvas) {


        legend = canvas.append("g")
            .attr("transform", "translate(" + [0, -getElemHeight(asisX)] + ")")
            .attr("class", "text")
        ;

        data3.forEach(function (dat, i) {
            text = legend.append("g")
                .attr("transform", function (d) {
                    return "translate(" + [x(i), 0] + ")"
                })
            ;
            text.append("text")
                .attr("transform", function (d) {
                    return "translate(" + [barSize / 2, 25] + ")"
                })
                .attr("class", "asisXmounthText")
                .text(function (d) {
                    return dat.year
                })
            ;

        });

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
                        return "translate( " + [0, y(d) - height + 4 -backHei*3] + ")";
                    })
                    .attr("width", width)
                    .attr("height", backHei)
                    .attr("fill", prop6.backColor)
                ;
            }
        });
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

        y.ticks(8).reverse().forEach(function (dat, i) {
            if (dat != 0 &&  i !=0) {
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
                    .attr("r", 7)
                    .attr("fill", "#CDD5DE")
                ;

            }
        });
		legend.append("text")
			.attr("class" , "asisYcapiton")
			.attr("transform" , "translate( "+ [  -10,10 ] +")")
			.text("млн. руб." )
		;

    }




    function getElemWidth(el) {
        return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("width");
    }

    function getElemHeight(el) {
        return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("height");
    }

    function currencySwap(d) {
        return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + "";
    }

    function cutLongSum(d) {
        if (+d > 1000)
            return d.toString().substr(0, 3);
        else
            return d;
    }



	function countInnerDataForPie(d){

		for (k in d){
			var sum = 0;
			for ( dat in d[k] ) {
				if (dat != "year")
					sum+= +( d[k][dat] ) ;
			}
			d[k].sum = sum ;
		}
		return d
	}

}
