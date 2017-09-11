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
y = d3.scaleLinear()
		.domain([ findMinVal(data)* diff , findMaxVal(data) * diff] )
		.range([  height ,0   ])
;

console.log([ findMinVal(data)  , findMaxVal(data)  ]);
x = d3.scaleLinear()
		.domain([0  , data.length] )
		.range([ +prop.gistPadding ,  width   ])
;
barSize = width / data.length  - 60; 

drawAsisX(gist);
drawAsisY(asisY);
showUp(gist);

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
						.attr("text-anchor", "end")
						.attr("dominant-baseline", "central")
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

function showUp(canvas){
	rects = canvas.append("g")
						// .attr("transform" , "translate(-20 ,20)" )
	;

	data.forEach(function(d , i){
		rects.append("rect")
				.attr("transform" , function() {   return "translate( "+ [ x(i) , -height+y(0)  ] +")" ; })
				.attr("width" , barSize )
				.attr("height" , function() {

					console.log(d.factOut) ; 
					console.log("y22 " +   (  400 - y(0)  - y(d.factOut) )   ); 


					return (  400 - y(0)  - y(d.factOut) ) })
				.attr("fill", "#acc")
	});
}


function findMaxVal(d){
	max = null ; 
	for (i in d)
		if (max < d[i].factIn)  max = d[i].factIn ;	
	for (i in d)
		if (max < d[i].planIn)  max = d[i].planIn ;	
	return max; 

}

function findMinVal(d){
	max = null ; 
	for (i in d)
		if (max < d[i].factOut)  max = d[i].factOut ;	
	for (i in d)
		if (max < d[i].planOut)  max = d[i].planOut ;	
	return -max; 

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

