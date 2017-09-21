svg = d3.select("svg");
widthSvg = +svg.attr("width");
heightSvg = +svg.attr("height");
width = +svg.attr("width") - +(prop.paddingLeft) - +prop.paddingRight;
height = +svg.attr("height") - +(prop.paddingBottom);

asisY = svg.append("g")
				.attr("class", "asisY")
				.attr("transform", "translate("+[0,  0  ]+")")
				.attr("width" ,  +prop.paddingLeft)
				.attr("height" , height)
;
gist = svg.append("g")
				.attr("class", "gist")
				.attr("transform", "translate("+[ +prop.paddingLeft,  height  ]+")")
				.attr("width" , width)
				.attr("height" , height)
;
asisX = svg.append("g")
				.attr("class", "asisX")
				.attr("transform", "translate("+[ +prop.paddingLeft,  heightSvg  ]+")")
				.attr("width" ,  width)
				.attr("height" , heightSvg - height)
;

y = d3.scaleLinear()
		.domain([0 , 105] )
		.range([  height , 0   ])
;
y1 = d3.scaleLinear()
		.domain([0 , 105] )
		.range([  0 , height   ])
;
x = d3.scaleLinear()
		.domain([0  , data3.length ] )
		.range([ +prop.gistPadding ,  width   ])
;

countInnerDataForPie(data3);
barSize = width / data3.length  - +prop.gistPadding; 

draw(gist); 

drawAsisX(asisX);
drawAsisY(asisY);

// showLegend(asisX);

function draw(canvas) {
	legend = canvas.append("g")
						.attr("transform" , "translate("+ [  0 , -getElemHeight(canvas) ] +")")
						.attr("class", "bars")
	;
	leftSide = canvas.append("g")
						.attr("transform" , "translate("+ [  0 , -getElemHeight(canvas) ] +")")
						.attr("class", "leftSide")
	;

	data3.forEach(function(dat , i) {
				text = legend.append("g")
							.attr("transform" , function(d) { return "translate(" + [ x(i)  ,  0 ] + ")" })
				;
				sumRect = 0;
				count = 0;
				for ( dd in dat ) {
						if (dd != "year" && dd != "sum"  ) {
							rectHeight = y(5) * dat[dd]  / dat.sum  ; 
							sumRect += rectHeight ; 
							text.append("rect")
									.attr("transform" , "translate("+ [  0 , sumRect-rectHeight +y(100) ] +")")
									.attr("class" , "rectsBar")
									.attr("height",  rectHeight )
									.attr("width", barSize)
									.attr("fill"  , prop.colors[count++])
							;

							if (count% 2!=0  && i ==0 ) leftDots();
							if (count% 2== 0  && i == (data3.length-1) ) rigthDots();
						};
				}

		function leftDots(){

			legLeft = leftSide.append("g")
						.attr("class" , "legLeft")  
			; 

			leftSideConn( x(i)+22, sumRect-rectHeight*0.5 +y(100) ,   0 ,  height + 40 + count*15 +1 ,  legLeft   , count) ; 

			whiteDdd = legLeft.append("g")
						.attr("class" , "leftDots") 
						.attr("transform" , "translate("+ [  x(i) +  22 , sumRect-rectHeight*0.5 +y(100) ] +")")
			; 
				whiteDdd.append("circle") 
						.attr("r", +prop["радиус белых кружков"])
						.attr("class", "whiteDot")
						.attr("fill", "white")
				;
				whiteDdd.append("circle") 
							.attr("r", + prop["радиус белых кружков"]-2)
							.attr("fill", function(d) {   return prop.colors[count-1]; })
				;

			leftLegend =  legLeft.append("g")
								.attr("transform" , function(d) { return "translate(" + [ 0 ,  height + 40 + count*15] + ")" })
								.attr("class" , "leftLegend") 
			;
				leftLegend.append("rect")
								.attr("width" , 20)
								.attr("height" , 20)
								.attr("fill" , prop.colors[count-1] )
				;
				leftLegend.append("text")
								.attr("class", "legendText")
								.attr("transform" , "translate(30 , 15)" )
								.text(dd)
			;
		}		

		function rigthDots(){

			legLeft = leftSide.append("g")
						.attr("class" , "legLeft")  
			; 

			rigthSideConn( x(i) + barSize- 22, sumRect-rectHeight*0.5 +y(100) ,   width ,  height + 40 + count*15 +1 ,  legLeft   , count) ; 

			whiteDdd = legLeft.append("g")
						.attr("class" , "leftDots") 
						.attr("transform" , "translate("+ [  x(i) + barSize- 22 , sumRect-rectHeight*0.5 +y(100) ] +")")
			; 
				whiteDdd.append("circle") 
						.attr("r", +prop["радиус белых кружков"])
						.attr("class", "whiteDot")
						.attr("fill", "white")
				;
				whiteDdd.append("circle") 
							.attr("r", + prop["радиус белых кружков"]-2)
							.attr("fill", function(d) {   return prop.colors[count-1]; })
				;

			leftLegend =  legLeft.append("g")
								.attr("transform" , function(d) { return "translate(" + [ width ,  height + 40 + count*15] + ")" })
								.attr("class" , "leftLegend") 
			;
				leftLegend.append("rect")
								.attr("width" , 20)
								.attr("height" , 20)
								.attr("transform" , "translate(-20 , 0)" )
								.attr("fill" , prop.colors[count-1] )
				;
				leftLegend.append("text")
								.attr("class", "legendTextRigth")
								.attr("transform" , "translate(-30 , 15)" )
								.text(dd)
			;
		}

	});
}

function leftSideConn(x,y, xEnd , yEnd ,  canvas , i) {
	dif = 15 ; 
// console.log(x,y, xEnd , yEnd  , i) ; 
di = prop.paddingLeft - i*10 ;
	dat =[ 
		[x , y ], 
		[xEnd - di + dif , y ]   , 
			[xEnd - di , y + dif ]   , 
		[xEnd - di  , yEnd - dif]  ,  
			[xEnd - di +dif , yEnd]  ,  
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

function rigthSideConn(x,y, xEnd , yEnd ,  canvas , i) {
	dif = 15 ; 
	console.log(x,y, xEnd , yEnd  , i) ; 
	di = -(prop.paddingLeft - i*10) ;
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



function drawAsisX(canvas) {
	line  = d3.line() .x(function(d) {return d[0]}) .y(function(d) {return d[1]}) ;
	canvas.append("path")
					.attr("transform",function(d) { return "translate("+[ 0 , -getElemHeight(canvas)]+")" })
					.attr("d" , line([ [0,0] , [ width, 0 ] ]))
					.attr("stroke-width", 4)
					.attr("stroke", "#CDD5DE")
	;

	legend = canvas.append("g")
						.attr("transform" , "translate("+ [  0 , -getElemHeight(asisX) ] +")")
						.attr("class", "text")
	;

	data3.forEach(function(dat , i) {
				text = legend.append("g")
							.attr("transform" , function(d) { return "translate(" + [ x(i)   ,  0 ] + ")" })
				;
				text.append("text")
						.attr("transform" , function(d) { return "translate(" + [ barSize/2 ,  25 ] + ")" })
						.attr("class" , "asisXmounthText")
						.text( function(d){ return dat.year  })
				;

			}) ;

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
						.attr("transform" , "translate("+ [ getElemWidth(canvas) , 0 ] +")")
						.attr("class", "legend")
	;

	y.ticks(5).reverse().forEach(function(dat , i) {
				if (dat !=0) {
					text = legend.append("g")
										.attr("transform" , function(d) { return "translate(" + [0,  y(dat) ] + ")" })	
					; 
					text.append("text")
							.attr("class", "asisYcapiton")
							.attr("transform" , function(d) { return "translate(" + [-10,  0 ] + ")" })
							.text( function(d){ return currencySwap(dat)  })
					;
					text.append("circle")
							.attr("r" , 7)
							.attr("fill",  "#CDD5DE" )
					;
				}
			});

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
					.text( function(d){ return cutLongSum(data[i])  })
		;		
		legend.append("text")
					.attr("transform" , function(d) { return "translate(" + [ 0 ,  25 ] + ")" })
					.attr("font-weight" , "bold" )
					.attr("fill" , prop.faktColor)
					.text( function(d){ return cutLongSum(data2[i])  })
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

function cutLongSum(d){
	if ( +d > 1000) 
		return  d.toString().substr(0,3) ; 
	else 
		return d ; 
}
