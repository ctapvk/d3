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
	});
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
					.domain([0 , (data[index].sum / 6) ]  )
					.range(["white" , prop.colorsLeft[index]  ]);	
	donut = g.append("g")
	.attr("class", "donut");

	var pie = d3.pie()
				.sortValues(function compare(a, b) {
					  return b - a;
				})
				.value(function(d) { return d3.values(d);  })
				.startAngle(data[index].startAngle)
				.endAngle(data[index].endAngle) 
	;
	// data.sort(function(x, y){
	// 		return d3.ascending(x.sum, y.sum);
	// 	})
	var path = d3.arc()
					.outerRadius(prop.innerPieRadius)
					.innerRadius(prop.innerPieInnerRaius  ) ;
	var label = d3.arc()
					.outerRadius( prop.innerPieRadius )
					.innerRadius(prop.innerPieRadius -50 )
	;


	var arc = donut.selectAll(".arc")
						.data(pie(data[index].value)).enter().append("g")
							.attr("class", "arc");

	arc.append("path")
			.attr("d", path)
			.attr("fill", function(d) {  return red(d3.values(d.data)); })
	;
	if (showLegend ==1) {

	coord = [250 , -180] ; 
	coordArr = new Array();

	legend = arc.append("g")
					.attr("transform" , function(d) {
										coord[1]+=40;  
										coordArr.push( [ coord[0] , coord[1]  ] );  
										return "translate(" + [ coord[0] , coord[1] ]  + ")"; 
									})

	;

	legend.append("text")
			.attr("transform", function(d) {  return "translate( 30,0)"; } )
			.attr("text-anchor"  , "left" )
			.attr("dy", "0.35em")
			.attr("font-family" , "sans-serif")
			.attr("font-size" , "14")
			.attr("fill" , "#75777D")
			.attr("class" , "textLegend")
			.text(function(d) { return d3.keys(d.data); })
	;
	legend.append("text")
			.attr("transform", function(d) {  return "translate( 30,15)"; } )
			.attr("text-anchor"  , "left" )
			.attr("dy", "0.35em")
			.attr("font-family" , "sans-serif")
			.attr("font-size" , "14")
			.attr("fill" , "black")
			.attr("class" , "textLegend")
			.text(function(d) { return currencySwap(d3.values(d.data)); })
	;
	legend.append("rect")
		  .attr("transform", function(d) {  return "translate( 0,-10)"; } )
		  .attr("fill" , function (d) { console.log(d); return  red(d3.values(d.data)); })
		  .attr("width" ,20)
		  .attr("height" ,20)
	;




	arc.append("circle")
			.attr("transform" ,function(d) {
				return "translate(" + label.centroid(d) + ")";
			} ) 
			.attr("r",6)
			.attr("class", "whiteDot" + index )
			.attr("fill", "white")
	;
	d3.selectAll(".whiteDot"+ index)
				.attr("cc" , function (d , i ) { drawLineConnection( label.centroid(d)[0],  label.centroid(d)[1] , coordArr[i][0] ,coordArr[i][1] ,g);   } )
	;
	arc.append("circle")
				.attr("transform" ,function(d) {  return "translate(" + label.centroid(d) + ")"; }  )
				.attr("r",3)
				.attr("fill", function(d) {   return red(d3.values(d.data)); })
	;
	}

}


function drawLineConnection(x,y, xEnd , yEnd ,  canvas) {
	dif = 15 ; 

	if (y < yEnd )
		dat =[ [ x , y ],  [x, yEnd - dif ]   , [ x + dif, yEnd]  ,  [xEnd , yEnd]  ];
	else {
		if (y - yEnd < 100) 
			dat =[ [ x , y ],  [x , yEnd + dif]   , [ x + dif , yEnd]  ,  [xEnd , yEnd]  ];
		else 
			dat =[ [ x , y ],  [x , yEnd + dif+10]   , [ x + dif+10 , yEnd]  ,  [xEnd , yEnd]  ];
	}

	var line = d3.line()
	.x(function(d) { return d[0] ; })
	.y(function(d) { return d[1] ; })
	.curve(d3.curveCardinal.tension(0.5));
					
								
canvas.append("path")
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




data2 = countInnerDataForPie(data2);
g = svg.append('g')
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")") 
		.attr("class" , "donut"); 
innerDonut = g.append("g")
				.attr("class", "outerDonut");


outerPie(data2 );
innerPie(data2, 0 , 1);
innerPie(data2, 1 , 0);
innerPie(data2, 2 , 0);



