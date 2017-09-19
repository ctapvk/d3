var svg = d3.select("svg"),
width = +svg.attr("width"),
height = +svg.attr("height") ;

	
var color = d3.scaleOrdinal(prop.colorsLeft);


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

function outerPie(data){
	var pie = d3.pie().sort(null).value(function(d) {
		//console.log(d['sum']);
		return d['sum'];
	}).padAngle( +prop.paddingOuterPie);
	var path = d3.arc()
					.outerRadius(prop.outerPieRadius)
					.innerRadius(prop.outerPieInnerRadius);
	var label = d3.arc()
					.outerRadius( prop.outerPieRadius )
					.innerRadius(prop.outerPieInnerRadius);
	
	var arc = innerDonut.selectAll(".arc")
								.data(pie(data)).enter().append("g")
														.attr("class", "arc");

	arc.append("path")
			.attr("d", path)
			.attr("fill", function(d , i ) { 
				data2[i].startAngle = d.startAngle ;  
				data2[i].endAngle = d.endAngle ;  
				return color(d.data['name']); 
			});

	arc.append("text")
		  .attr("transform", function(d) {  return "translate(" + label.centroid(d) + ")"; })
		  .attr("text-anchor"  , "middle" )
		  .attr("dy", "0.35em")
		  .attr("font-family" , "sans-serif")
		  .attr("font-size" , "14")
		  .attr("fill" , "white")
//		  .attr("font-weight" , "bold")
		  .text(function(d) {  return ( (d.endAngle - d.startAngle)/6.28 * 100).toFixed(1)   + '%'; });
}



function innerPie(data , index , showLegend){
	var red = d3.scaleLinear()
					.domain([0 , (data[index].sum / +prop['количество градиента']) ]  )
					.range(["white" , prop.colorsLeft[index]  ]);	

	donut = g.append("g").attr("class", "donut");

	var pie = d3.pie()
				.sortValues(function compare(a, b) {   return a - b; 	})
				.value(function(d) { return d3.values(d);  })
				.startAngle(data[index].startAngle  +  +prop.paddingInnerPieAngle)
				.endAngle(data[index].endAngle - +prop.paddingInnerPieAngle) 
	;

	var path = d3.arc()
					.outerRadius(prop.innerPieRadius)
					.innerRadius(prop.innerPieInnerRaius  ) 
	;

	var arc = donut.selectAll(".arc")
						.data(pie(data[index].value)).enter()
							.append("g")
							.attr("class", "arc")
	;

	arc.append("path")
			.attr("d", path)
			.attr("fill", function(d) { return red(d3.values(d.data)); })
			.on("mouseover", function(d) {
				// console.log(d3.event.clientX);
					d3.select("#tooltip")
						.style("left", width/2+path.centroid(d)[0] + "px")
						.style("top", height/2+path.centroid(d)[1] + "px")
						.select("#value")
						.text(currencySwap( d3.values(d.data)) )
					;
					d3.select("#tooltip")
						.select("#tipCaption")
						.text( d3.keys(d.data));
					//Show the tooltip
					d3.select("#tooltip").classed("hidden", false);
			   })
			.on("mouseout",function() { d3.select("#tooltip").classed("hidden", true);  })
	;

	if (data2[index].startAngle > 2  )
		coord = [-250  , 100] ; 
	else 
		coord = [250  , -180] ;

	if (index ==2) coord[1] += -280; 
	
	legendCaption = donut.append("g")
							.attr("class" , "legendCaption")
							.attr("transform" , "translate(" + [ coord[0]-35 , coord[1]-15 ]  + ")" )
	;

	legend = arc.append("g")
					.attr("class" , "dotLegend")
					.attr("transform" , function(d , i ) {  return "translate(" + [ coord[0] , coord[1] + (i+1)*40 +9 ]  + ")";  })
	;
	if (showLegend ==1) {

		if (coord[0]<0 ) legendaLeft(index); else legenda(index);

		g3 = donut.append("g").attr("class" , "lineConn");
		whiteG = donut.append("g").attr("class" , "dots");
		var whiteDdd = whiteG.selectAll(".whiteDdd")
							.data(pie(data[index].value)).enter()
								.append("g")
								.attr("class", "whiteDdd") 
		;

		var label = d3.arc()
				.outerRadius(prop.innerPieRadius )
				.innerRadius(prop.innerPieRadius -25 )
		;
		whiteDdd.append("circle")
				.attr("transform" ,function(d , i) {
					arcCentr = label.centroid(d ) ; 
					drawLineConnection( arcCentr[0],  arcCentr[1] , coord[0]  , coord[1] + 40*(i+1), g3);   return "translate(" + label.centroid(d) + ")"; })
				.attr("r", + prop["радиус белых кружков"])
				.attr("class", "whiteDot")
				.attr("fill", "white")
		;
		whiteDdd.append("circle")
					.attr("transform" ,function(d , i) { return "translate(" + label.centroid(d ) + ")"; })
					.attr("r", + prop["радиус белых кружков"]-2)
					.attr("fill", function(d) {   return prop.colorsLeft[index]; }) 
		;
	}
}

function legenda(index){ 
	var red = d3.scaleLinear()
				.domain([0 , (data2[index].sum / +prop['количество градиента']) ]  )
				.range(["white" , prop.colorsLeft[index]  ])
	;
	legendCaption.append("text")
			.attr("transform", function(d) {  return "translate( 30,15)"; } )
			.attr("class" , "legendTextSum")
			.text(function(d) { return currencySwap(data2[index].sum ); })
	;

	legendCaption.append("rect")
		  .attr("transform", function(d) {  return "translate( 0,-3)"; } )
		  .attr("fill" , prop.colorsLeft[index] )
		  .attr("width" ,prop.rect)
		  .attr("height" , prop.rect)
	;

	legendCaption.append("text")
			.attr("transform", function(d) { return "translate( 30,0)"; } )
			.attr("class" , "legendText")
			.text(data2[index].name )
	;

	legend.append("text")
			.attr("transform", function(d) {  return "translate( 30,-4)"; } )
			.attr("class" , "legendText")
			.text(function(d) { return cutLongText(d3.keys(d.data).toString() ) ; })
	;

	legend.append("text")
			.attr("transform", function(d) {  return "translate( 30,10)"; } )
			.attr("class" , "legendTextSum")
			.text(function(d) { return currencySwap(d3.values(d.data)); })
	;
	legend.append("rect")
		  .attr("transform", function(d) {  return "translate( 0,-10)"; } )
		  .attr("fill" , function(d , i ) {  return  red(d3.values(d.data)); })
		  .attr("width" ,prop.rect)
		  .attr("height"  , prop.rect)
	;

}

function legendaLeft(index){ 
	var red = d3.scaleLinear()
				.domain([0 , (data2[index].sum / +prop['количество градиента']) ]  )
				.range(["white" , prop.colorsLeft[index]  ])
	;
	legendCaption.append("text")
			.attr("transform", function(d) {  return "translate( 40,15)"; } )
			.attr("class" , "legendTextSumLeft")
			.text(function(d) { return currencySwap(data2[index].sum ); })
	;

	legendCaption.append("rect")
		  .attr("transform", function(d) {  return "translate( 50,-3)"; } )
		  .attr("fill" , prop.colorsLeft[index] )
		  .attr("width" ,prop.rect)
		  .attr("height" , prop.rect)
	;

	legendCaption.append("text")
			.attr("transform", function(d) { return "translate( 40,0)"; } )
			.attr("class" , "legendTextLeft")
			.text(data2[index].name )
	;

	legend.append("text")
			.attr("transform", function(d) {  return "translate( -30,-4)"; } )
			.attr("class" , "legendTextLeft")
			.text(function(d) { return cutLongText(d3.keys(d.data).toString()); })
	;

	legend.append("text")
			.attr("transform", function(d) {  return "translate( -30,10)"; } )
			.attr("class" , "legendTextSumLeft")
			.text(function(d) { return currencySwap(d3.values(d.data)); })
	;
	legend.append("rect")
		  .attr("transform", function(d) {  return "translate( "+-prop.rect+",-10)"; } )
		  .attr("fill" , function(d , i ) {  return  red(d3.values(d.data)); })
		  .attr("width" ,prop.rect)
		  .attr("height"  , prop.rect)
	;

}


function drawLineConnection(x,y, xEnd , yEnd ,  canvas) {
	dif = 5 ; 

	if (y < yEnd )
		dat =[ [ x , y ],  [x, yEnd - dif ]   , [ x + dif, yEnd]  ,  [xEnd , yEnd]  ];
	else {
		dat =[ [ x , y ],  [x , yEnd + dif]   , [ x + dif , yEnd]  ,  [xEnd , yEnd]  ];
	}

	var line = d3.line()
					.x(function(d) { return d[0] ; })
					.y(function(d) { return d[1] ; })
					// .curve(d3.curveCardinal.tension(0.5))
					.curve(d3.curveBasis)
	;
	gg = canvas.append("g").attr("class", "conn") ; 
	gg.append("path")
		.style("fill","none")
		.style("stroke","gray")
		.style("stroke-width","2px")
		.attr("class", "curveLine")
		.attr("d",function(d,i){ return line(dat); })
	;
}


function currencySwap(d){
    return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")  + " тыс. руб." ;
}

function cutLongText (str) { 
	if (str.length > 25)
		return str.substr(0,25) + "..." ;
	else
		return str ;
}

lstLeft = 0;
lstRight = 0;

data2 = countInnerDataForPie(data2); 

g = svg.append('g')
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
		.attr("class" , "pie"); 
innerDonut = g.append("g")
				.attr("class", "outerDonut");


for (i in data2)
	data2[i].value.sort(function(x, y){ return d3.ascending(d3.values(x), d3.values(y)); }) ;

	data2[1].value.sort(function(x, y){ return  d3.values(y) - d3.values(x) }) ;
	data2[2].value.sort(function(x, y){ return  d3.values(y) - d3.values(x) }) ;



outerPie(data2 );
innerPie(data2, 0 , 1);
innerPie(data2, 1 , 1);
innerPie(data2, 2 , 1);



