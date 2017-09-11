svg = d3.select("svg");
widthSvg = +svg.attr("width");
heightSvg = +svg.attr("height");
width = +svg.attr("width") - +(prop.paddingLeft);
height = +svg.attr("height") - +(prop.paddingBottom);


monthNamesShort =  ['янв', 'фев', 'мар', 'апр', 'май', 'июн',
				   'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'] ; 


dat = [ {"name":"flfl"} , {}];

gist = svg.append("g")
				.attr("class", "gist")
				.attr("transform", "translate("+[ widthSvg- width,  height  ]+")")
				.attr("width" , width)
				.attr("height" , height)
;
asisX = svg.append("g")
				.attr("class", "asisX")
				.attr("transform", "translate("+[ widthSvg- width,  heightSvg  ]+")")
				.attr("width" ,  width)
				.attr("height" , heightSvg - height)
;
asisY = svg.append("g")
				.attr("class", "asisY")
				.attr("transform", "translate("+[0,  0  ]+")")
				.attr("width" ,  widthSvg- width)
				.attr("height" , height)
;
maxHeightRange = d3.max(data) * 1.3;
y = d3.scaleLinear()
		.domain([0 , maxHeightRange] )
		.range([  heightSvg ,heightSvg- height   ])
;
x = d3.scaleLinear()
		.domain([0  , 12] )
		.range([ +prop.gistPadding ,  width   ])
;

drawAsisX(asisX);
drawAsisY(asisY);
drawGist(gist , data , prop.planColor, "planGist") ; 
drawGist(gist , data2 ,  prop.faktColor, "factGist") ; 
showLables(gist);
showLegend(asisX);

function drawAsisX(canvas) {
	line  = d3.line()
					.x(function(d) {return d[0]})
					.y(function(d) {return d[1]})
	;
	canvas.append("path")
					.attr("transform",function(d) { return "translate("+[ 0 , -getElemHeight(canvas)]+")" })
					.attr("d" , line([ [0,0] , [ getElemWidth(canvas), 0 ] ]))
					.attr("stroke-width", 4)
					.attr("stroke", "#CDD5DE")
	;

	legend = canvas.append("g")
						.attr("transform" , "translate("+ [ getElemWidth(canvas) , -getElemHeight(asisX) ] +")")
						.attr("class", "text")
	;

	monthNamesShort.reverse().forEach(function(dat , i) {
				text = legend.append("g")
							.attr("transform" , function(d) { return "translate(" + [ -x(i)  + +prop.moveMounth ,  0 ] + ")" })
				;
				text.append("text")
						.attr("transform" , function(d) { return "translate(" + [ 0 ,  25 ] + ")" })
						.attr("class" , "asisXmounthText")
						.text( function(d){ return dat  })
				;

				line = d3.line().x(function(d){return d[0]}).y(function(d){return d[1]});
				text.append("path")
							.attr("d",line( [  [0,0] , [0,-height]  ] ))
							.attr("stroke-width",2)
							.attr("stroke" , "#acc")
				;

			})
	;

}

function drawAsisY(canvas) {
	line  = d3.line()
					.x(function(d) {return d[0]})
					.y(function(d) {return d[1]})
	;
	canvas.append("path")
					.attr("transform",function(d) { return "translate("+[ 0 , 0]+")" })
					.attr("d" , line([ [getElemWidth(canvas),0] , [ getElemWidth(canvas), getElemHeight(canvas) ] ]))
					.attr("stroke-width", 4)
					.attr("stroke", "#CDD5DE")
	;

	legend = canvas.append("g")
						.attr("transform" , "translate("+ [ getElemWidth(canvas) , -getElemHeight(asisX) ] +")")
						.attr("class", "legend")
	;

	y.ticks().forEach(function(dat , i) {
				text = legend.append("g") 
									.attr("transform" , function(d) { return "translate(" + [0,  y(dat) ] + ")" })	
				; 
				text
					.append("text")
						.attr("text-anchor", "end")
						.attr("dominant-baseline", "central")
						.attr("transform" , function(d) { return "translate(" + [-10,  0 ] + ")" })
						.text( function(d){ return currencySwap(dat)  })
				;
				text
					.append("circle")
						.attr("r" , 5)
						.attr("fill",  "#CDD5DE" )
				;
			})
	;

}

function drawGist(canvas , data , colorStroke, label) {

y = d3.scaleLinear()
		.domain([ maxHeightRange , 0 ] )
		.range([  heightSvg ,heightSvg- height   ])
;

	g = canvas.append("g")
					.attr("transform", "translate(29 ,0)")
	;

	margin = +getElemHeight(asisX) ; 
	line = d3.line()
				.x(function(d , i ) { return x(i) ;  })
				.y(function(d) { return -y(d) + margin; })
	;
	area = d3.area()
				.x(function(d , i ) {  return x(i) ; })
				.y0(0)
				.y1(function(d) {  return -y(d) + margin; })
	;
	g.append("path")
		.attr("d", line(data))
		.style("stroke", colorStroke)
		.style("stroke-width", 2)
	;
	g.append("path")
		.attr("d", area(data))
		.style("fill", colorStroke)
		.style("opacity", .3)
	;
 	// добавляем отметки к точкам
	g.selectAll(".dot " + label)
			.data(data)
			.enter().append("circle")
					.style("fill", colorStroke)
					.attr("class", "dot " + label)
					.attr("r", 6)
					.attr("cx", function(d,i) { return x(i) ; })
					.attr("cy", function(d) { return -y(d) + margin; })
	;

}


function showLables(canvas) {

	text =canvas.append("g")
					.attr("transform" , function(d) { return "translate(" + [ 5 ,  25-height ] + ")" })
					.attr("class" , "ted")
	;
	data.forEach(function(dat , i) {
		legend = text.append("g")
				.attr("transform" , function(d ) { return "translate(" + [ 29+x(i) , - 3 ] + ")" })
		;
		legend.append("text")
					.attr("fill" , prop.planColor)
					.attr("font-weight" , "bold" )
					.text( function(d){ return data[i]  })
		;		
		legend.append("text")
					.attr("transform" , function(d) { return "translate(" + [ 0 ,  25 ] + ")" })
					.attr("font-weight" , "bold" )
					.attr("fill" , prop.faktColor)
					.text( function(d){ return data2[i]  })
		;
	});

}

function showLegend(canvas){

	legend = canvas.append("g").attr("transform"  , "translate(20,-50)") ;

	text = legend.append("g").attr("transform"  , "translate(20,0)") ;
	text.append("text")
				.text("План")
				.attr("transform"  , "translate(35,17)") 
	;
	text.append("rect")
			.attr("width"  , 25 )
			.attr("height" , 25 )
			.attr("fill" , prop.planColor)
	;

	text = legend.append("g").attr("transform"  , "translate(150,0)") ;
	text.append("text")
				.text("Факт")
				.attr("transform"  , "translate(35,17)") 
	;
	text.append("rect")
			.attr("width"  , 25 )
			.attr("height" , 25 )
			.attr("fill" , prop.faktColor)
	;
}

function getElemWidth (el){
	return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("width");
}
function getElemHeight (el){
	return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("height");
}

function currencySwap(d){
	return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")  + "" ;
}

