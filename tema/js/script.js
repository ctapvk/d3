function drawGraph6(prop1,data1) {
    var data6 = data1;
    var prop6 = prop1;
	svg = d3.select(".graf6");
	widthSvg = +svg.attr("width");
	heightSvg = +svg.attr("height");
	width = +svg.attr("width") - +(prop6.paddingLeft) - +prop6.paddingRight;
	height = +svg.attr("height") - +(prop6.paddingBottom);

	asisX = svg.append("g")
		.attr("class", "asisX")
		.attr("transform", "translate(" + [+prop6.paddingLeft, heightSvg] + ")")
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
	countInnerDataForPie(data6);
	max = Math.max(data6[0].sum, data6[1].sum);
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
		.domain([0, data6.length])
		.range([+prop6.gistPadding, width])
	;

	barSize = width / data6.length - +prop6.gistPadding;

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

		data6.forEach(function (dat, i) {
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

					let sss= currencySwapNoCut(dat[dd]) + ' руб';
					let sss1=dd;

					legs.append("rect")
						.attr("transform", "translate(" + [0,0] + ")")
						// , -height + sumRect - rectHeight + y(dat[dd])] + ")")
						.attr("class", "rectsg6")
						.attr("height", rectHeight)
						.attr("width", prop6.barSize)
						.attr("fill", prop6.colorsLeft[count++])
						//.attr("onmousemove", '  console.log(event.x );  d3.select("#tooltipg6").select("#captionG6") .text(123); d3.select("#tooltipg6").classed("hidden", false); '  )
						.on("mousemove", function(event) {
							// console.log( d3.event);
							d3.select("#tooltipg6").select("#captionG6") .text(sss1);
							d3.select("#tooltipg6")
								.style("left", (d3.event.pageX-10) + 'px')
								.style("top", (d3.event.pageY-10) + 'px')
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
			.text((data6[1].sum /data6[0].sum).toFixed(2)*100 + '%')
		;

	}

	function drawLegend(canvas) {
		te = canvas.append("g");
		te.append("text")
			.attr("class" , "legendText")
			.attr("transform" , "translate(" + [ barSize/2 , -y(0)+y(data6[0].sum) -5 ] + ")")
			.text(currencySwap(data6[0].sum))
		;
		console.log(barSize);
		te.append("text")
			.attr("class" , "legendText")
			.attr("transform" , "translate(" + [ barSize*1.5 , -y(0)+y(data6[1].sum) -5 ] + ")")
			.text(currencySwap(data6[1].sum))
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

		data6.forEach(function (dat, i) {
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
		tis = y.ticks();
		backHei = y(tis[0]) - y(tis[1]);
		rects = canvas.append("g").attr("class", "backRects").attr("transform" , "translate(0,"+ 0 +")");

		tis.forEach(function (d, i) {
			 console.log(y.ticks());
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
		d= parseInt(parseFloat(d)*0.0000001 );
		return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + "";
	}

	function currencySwapNoCut(d) {
		d= parseInt(parseFloat(d) );
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




function drawGraph27(prop2,data2) {

    var prop27 = prop2;
	var data27 = data2;
	var svg2 = d3.select(".krug4"),
		width = +svg2.attr("width"),
		height = +svg2.attr("height") ;


	var color = d3.scaleOrdinal(prop27.colorsLeft);
	for (i in data27)
		data27[i].value.sort(function(x, y){ return d3.ascending(d3.values(y), d3.values(x)); }) ;

	data27 = countInnerDataForPie(data27);
	g_gist4 = svg2.append('g')
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
		.attr("class" , "donut");

	innerDonut = g_gist4.append("g")
		.attr("class", "innerDonut");


	showPieLeft2(data27 );
	accr() ;



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


	function countInnerDataForPie(d){

		for (k in d){
			var sum = 0;
			for ( key in d[k].value) {
				for (dat in d[k].value[key] ) {
					sum+= +(d[k].value[key][dat]) ;
				}
				d[k].sum = sum ;
			}
		}
		return d
	}

	function showPieLeft2(data){

		var pie = d3.pie().sort(null).value(function(d) {
			return d['sum'];
		});
		var path = d3.arc()
			.outerRadius(+prop27['радиус'])
			.innerRadius( +prop27['белая дырка внутри'] );
		var label = d3.arc()
			.outerRadius( +prop27['радиус'] )
			.innerRadius( +prop27['радиус'] / 3.5);

		var arc = innerDonut.selectAll(".arc")
			.data(pie(data)).enter().append("g")
			.attr("class", "arc");

		arc.append("path")
			.attr("d", path)
			.attr("fill", function(d , i ) {
				data27[i].startAngle = d.startAngle ;
				data27[i].endAngle = d.endAngle ;
				return color(d.data['name']); });

		arc.append("text")
			.attr("transform", function(d) {  return "translate(" + label.centroid(d) + ")"; })
			.attr("text-anchor"  , "middle" )
			.attr("dy", "0.35em")
			.attr("font-family" , "sans-serif")
			.attr("font-size" , "14")
			.attr("fill" , "white")
			.attr("font-weight" , "bold")
			.text(function(d) {  return ( (d.endAngle - d.startAngle)/6.28 * 100).toFixed(1)   + '%'; });
	}


	function showPiePercents(data , index){
		donut = g_gist4.append("g")
			.attr("class", "donut"+index);
		var radiusPlus = 40 ;
		var pie = d3.pie()
			.sortValues(function compare(a, b) {
				return b - a;
			})
			.value(function(d) { return d3.values(d);  })
			.startAngle(data[index].startAngle)
			.endAngle(data[index].endAngle) ;

		var path = d3.arc()
			.outerRadius(+prop27['радиус'] + +prop27['радиус гребешка'])
			.innerRadius(+prop27['радиус'] +6  ) ;
		var label = d3.arc()
			.outerRadius( +prop27['радиус'] )
			.innerRadius( +prop27['радиус'] + +prop27['белая дырка внутри'] + +prop27['радиус легенды гребешка']);
		var arc = donut.selectAll(".arc")
			.data(pie(data[index].value)).enter().append("g")
			.attr("class", "arc");


		var div = d3.select("body").append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);

		var red = d3.scaleLinear()
			.domain([0 , data27[index].value.length  ]  )
			.range([ prop27.colorsLeft[index] ,prop27.gradientColor  ]);

		arc.append("path")
			.attr("d", path)
			.attr("fill", function(d , i ) { return red(i) })
			.on("mousemove", function(d) {
				div.transition()
					.duration(200)
					.style("opacity", .9);
				div.html( d3.keys(d.data) + " : "+ currencySwapNoCut(d3.values(d.data))+"</br>"+
					"Доля в общих расходах :" + ((d.endAngle - d.startAngle)/6.28 * 100).toFixed(1)  +" % </br>   " )
					.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY - 28) + "px");
			})
			.on("mouseout", function(d) {
				div.transition()
					.duration(500)
					.style("opacity", 0);
			})
		;

		arc.append("text")
			.attr("transform", function(d) {  return "translate(" + label.centroid(d) + ")"; })
			.attr("text-anchor"  , "middle" )
			.attr("dy", "0.35em")
			.attr("font-family" , "sans-serif")
			.attr("font-size" , "14")
			.attr("fill" , "black")
			.attr("font-weight" , "bold")
			.text(function(d) {
				percfen = ( (d.endAngle - d.startAngle)/6.28 * 100).toFixed(1);
				if (percfen > 3)
					return percfen + '%';
				else
					return ""
			});
	}




	function accr(){
		str1 = "";
		str1+=('<div class="accord"> ');
		for (i =0 ; i < data27.length ;i ++) {

			var red = d3.scaleLinear()
				.domain([0 , data27[i].value.length ]  )
				.range([ prop27.colorsLeft[i] ,prop27.gradientColor  ]);

			rect5 = '<svg css="  top: 10; position: relative; " width="30" height="30"> '+
				'<rect width="20" height="20" transform="translate(5,5)" css="fill:'+ prop27.colorsLeft[i] +'; " /> </svg>';

			str1+=('<button class="accordion27" count='+i+'>' );
			str1+=('<div class="arrow right" id="arrToog'+ i  +'"> </div>' );
			str1+=( rect5 +'<div class="g18TextLegHeader">'+data27[i].name + '' );
			str1+=('<p class="g18TextLegHeaderSum"> ' + currencySwap(data27[i].sum) +  '</p> </div> </button> ' );
			str1+=('<div class="panel">');
			for (dat in data27[i].value) {
				// console.log( red(dat) );
				rect5 = '<svg css="  top: 20px; position: relative; " width="30" height="30"   > '+
					'<rect width="20" height="20" transform="translate(5,5)" css="fill:'+  red(dat) +'; " /> </svg>';
				str1+=('  <p  class="g18TextLegCaption"> ' + rect5  + cutLongText(Object.keys(data27[i].value[dat]) )  + ' </p>');
				str1+=('  <p  class="g18TextLeg"> '  +  currencySwap(Object.values(data27[i].value[dat]) )   + '</p>');
			}
			str1+=('</div>');
		}
		str1+=('</div>');

		d3.select("#str").html(str1);

		var acc = document.getElementsByClassName("accordion27");

		for (i = 0; i < acc.length; i++) {

			acc[i].onclick = function() {
				this.classList.toggle("active");
				showPiePercents(data27 , this.getAttribute("count"));


				document.getElementById("arrToog"+this.getAttribute("count") ).classList.toggle("right");

				if ( (this.className).indexOf("active") == -1) {
					d3.selectAll("g .donut"+this.getAttribute("count")).remove();
				}


				var panel = this.nextElementSibling;
				if (panel.style.maxHeight){
					panel.style.maxHeight = null;
				} else {
					panel.style.maxHeight = panel.scrollHeight + "px";
				}
			}
		}
	}







}







