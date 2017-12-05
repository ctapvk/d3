svg = d3.select("svg");
widthSvg = +svg.attr("width");
heightSvg = +svg.attr("height");
width = +svg.attr("width") - +(prop.paddingLeft);
height = +svg.attr("height") - +(prop.paddingBottom);

gist = svg.append("g")
				.attr("class", "gist")
				.attr("transform", "translate("+[ widthSvg- width,  height  ]+")")
				.attr("width" , width)
				.attr("height" , height)
;
asisX = svg.append("g")
				.attr("class", "asisX")
				.attr("transform", "translate("+[ widthSvg- width,  height  ]+")")
				.attr("width" ,  width)
				.attr("height" , heightSvg - height)
;
asisY = svg.append("g")
				.attr("class", "asisY")
				.attr("transform", "translate("+[0,  0  ]+")")
				.attr("width" ,  widthSvg- width)
				.attr("height" , height)
;
diff = 1.2 ; 
min = findMaxVal2(data3) ; 
max = findMinVal2(data3) ;
y = d3.scaleLinear()
		.domain([ max * diff , min * diff] )
		.range([  height ,0   ])
;

// console.log([max ,  min]);
// console.log( [ findMaxVal2(data3) , findMinVal2(data3) ] );


x = d3.scaleLinear()
		.domain([0  , data3.length] )
		.range([ +prop.gistPadding ,  width   ])
;
barSize = width / data3.length  - +prop.spaceBetween; 

gistSize = barSize / 3 ; 

drawAsisY(asisY);
showLegend(asisX) ; 

showPlanIn(gist);
showFactIn(gist);


drawAsisX(gist);

function drawAsisX(canvas) {

	line  = d3.line().x(function(d) {return d[0]}).y(function(d) {return d[1]}) ;
	canvas.append("path")
					.attr("transform",function(d) { return "translate("+[ 0 , -height+y(0) ]+")" })
					.attr("d" , line([ [0,0] , [ getElemWidth(canvas), 0 ] ]))
					.attr("stroke-width", 4)
					.attr("stroke", "#CDD5DE")
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
						.attr("transform" , "translate("+ [ getElemWidth(canvas) , 0 ] +")")
						.attr("class", "legend")
	;

	y.ticks().forEach(function(dat , i) {
				text = legend.append("g") 
									.attr("transform" , function(d) { return "translate(" + [0,  y(dat) ] + ")" })	
				; 
				text .append("text")
						.attr("class", "asisYcapiton")
						.attr("transform" , function(d) { return "translate(" + [-10,  0 ] + ")" })
						.text( function(d){ return currencySwap(dat)  })
				;
				text .append("circle")
						.attr("r" , 5)
						.attr("fill",  "#CDD5DE" )
				;
			})
	;

}




function showPlanIn(canvas){
	rects = canvas.append("g");

	data3.forEach(function(d , i){

		dd3(d.dohodPlan , i , 0 , prop['доходы план'] ) ;
		dd3(d.rashodPlan , i , 1 ,  prop['расходы план'] ) ;
		dd3(d.deficitPlan , i , 2 ,  prop['деф проф план'] ) ;

	});
}

function dd3 (dat , i , count ,   color ) {

	rectHeight = y(dat); 
	text = rects.append("g") 
				 .attr("transform" , function(d) {
										if (dat > 0 )  yy2 = -height+y(dat) ; else yy2 =  -height+y(0)   ;
										return "translate( "+ [ x(i) + count*gistSize , yy2 ] +")" ; 
				})
	;

	text.append("rect")
			.attr("transform" , function() { return "translate(" + [0+ count * +prop.gistPaddInG  , 0 ] + ")" })
			.attr("width" , gistSize )
			.attr("height" , function() { 
				if (dat > 0 )  yy2 = -(rectHeight- y(0)) ; else yy2 = (rectHeight- y(0)) ;
				return yy2  })
			.attr("fill", color)
	;

	text.append("text")
			.attr("class" , "planGistLabel")
			.attr("transform" , function() {
				if (dat > 0 )  yy2 = 15 ; else yy2 = - 15   ;
				// return "translate( "+ [  x(i)+ gistSize/2  + count*gistSize  , -height+rectHeight - yy2 ] +")"
				return "translate( "+ [ 0 +barSize/6 + count * +prop.gistPaddInG  , -15 ] +")"
			})
			.text(cutLongSum(dat))
	;

}

function showFactIn(canvas){
	rects = canvas.append("g");

	data3.forEach(function(d , i){


		dd32(d.dohodFact , i , 0 ,  prop['доходы факт'] ) ;
		dd32(d.rashodFact , i , 1 ,   prop['расходы факт']) ;
		dd32(d.deficitFact , i , 2 ,   prop['деф проф факт'] ) ;
	});
}

function dd32 (dat , i , count ,   color ) {

	rectHeight = y(dat); 
	text = rects.append("g") 
				 .attr("transform" , function(d) {
										if (dat > 0 )  yy2 = -height+y(dat) ; else yy2 =  -height+y(0)   ;
										return "translate( "+ [ x(i) + count*gistSize , yy2 ] +")" ; 
				})
	;	
	text.append("rect")
			.attr("transform" , function() { return "translate(" + [0+ count * +prop.gistPaddInG  , 0 ] + ")" })

			// .attr("transform" , function() {   
			// 	if (dat > 0 )  yy2 = -height+y(dat) ; else yy2 =  -height+y(0)   ;
			// 	return "translate( "+ [ x(i) + count*gistSize , yy2 ] +")" ; })
			.attr("width" , gistSize )
			.attr("height" , function() { 
				if (dat > 0 )  yy2 = -(rectHeight- y(0)) ; else yy2 = (rectHeight- y(0)) ;
				return yy2  })
			.attr("fill", color)
	;

	text.append("text")
			.attr("class" , "factGistLabel")
			.attr("transform" , function() {
				if (dat > 0 )  yy2 = -15 ; else yy2 = 15   ;
				// return "translate( "+ [  x(i)+ gistSize/2  + count*gistSize  , -height+rectHeight - yy2 ] +")"
				return "translate( "+ [ 0 +barSize/6 + count * +prop.gistPaddInG  , 15 ] +")"
				})
			.text(cutLongSum(dat))
	;

}




function showLegend(canvas){

	datas = canvas.append("g").attr("transform" , "translate(0,0)");

	data3.forEach(function(d,i){
		datas.append("text")
					.attr("transform", "translate("+[ x(i)+ barSize/2 , +prop.moveMounth ]+")")
					.attr("class" , "mounthLabes")
					.text(d.name)
		;
	});

	legend = canvas.append("g").attr("transform" , "translate(0,0)");

	inLeg = legend.append("g").attr("transform" , "translate(20,60)");
	inLeg.append("rect")
				.attr("width" , 20)
				.attr("height" , 20)
				.attr("fill" , prop["доходы план"])
	;
	inLeg.append("text")
				.attr("transform" , "translate(30 , 15)")
				.attr("class" , "legend")
				.text("Доходы (план)")
	;
	inLeg = legend.append("g").attr("transform" , "translate(20,100)");
	inLeg.append("rect")
				.attr("width" , 20)
				.attr("height" , 20)
				.attr("fill" , prop["доходы факт"])
	;
	inLeg.append("text")
				.attr("transform" , "translate(30 , 15)")
				.attr("class" , "legend")
				.text("Доходы (факт)")
	;


	outLeg = legend.append("g").attr("transform" , "translate(250,60)");
	outLeg.append("rect")
				.attr("width" , 20)
				.attr("height" , 20)
				.attr("fill" ,  prop["расходы план"])
	;
	outLeg.append("text")
				.attr("transform" , "translate(30 , 15)")
				.attr("class" , "legend")
				.text("Расходы (план)")
	;


	outLeg = legend.append("g").attr("transform" , "translate(250,100)");
	outLeg.append("rect")
				.attr("width" , 20)
				.attr("height" , 20)
				.attr("fill" ,  prop["расходы факт"])
	;
	outLeg.append("text")
				.attr("transform" , "translate(30 , 15)")
				.attr("class" , "legend")
				.text("Расходы (факт)")
	;

	outLeg = legend.append("g").attr("transform" , "translate(450,60)");
	outLeg.append("rect")
				.attr("width" , 20)
				.attr("height" , 20)
				.attr("fill" ,  prop["деф проф план"])
	;
	outLeg.append("text")
				.attr("transform" , "translate(30 , 15)")
				.attr("class" , "legend")
				.text("Дефицит/профицит (план)")
	;
	outLeg = legend.append("g").attr("transform" , "translate(450,100)");
	outLeg.append("rect")
				.attr("width" , 20)
				.attr("height" , 20)
				.attr("fill" ,  prop["деф проф факт"])
	;
	outLeg.append("text")
				.attr("transform" , "translate(30 , 15)")
				.attr("class" , "legend")
				.text("Дефицит/профицит (факт)")
	;

}



function findMaxVal(d){
	max = d[0].factIn ; 
	for (i in d)
		if (max < d[i].factIn)  max = d[i].factIn ;	
	for (i in d)
		if (max < d[i].planIn)  max = d[i].planIn ;	
	return max; 

}

function findMinVal(d){
	max = d[0].factOut ; 
	for (i in d)
		if (max < d[i].factOut)  max = d[i].factOut ;	
	for (i in d)
		if (max < d[i].planOut)  max = d[i].planOut ;	
	return -max; 

}


function findMinVal2(d){
	mm1 = d[0].dohodPlan ; 
	for (i in d)
		for (key in d[i])
			if (key!="name" && mm1 >  d[i][key]) mm1 =d[i][key] ; 
	return mm1 ; 

}
function findMaxVal2(d){
	ma1 = d[0].dohodPlan ; 
	for (i in d)
		for (key in d[i])
			if (key!="name" && ma1 <  d[i][key]) ma1 =d[i][key] ; 
	return ma1 ; 

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
	if ( Math.abs(d) > 1000)
		if (+d > 0 )
			return  d.toString().substr(0, -max.toString().length +d.toString().length  +3) ; 
		else
			return  ( d.toString().substr(0, -min.toString().length +d.toString().length  +4  ) ) ; 
	else 
		return d ; 
}
