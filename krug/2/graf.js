var svg = d3.select("svg"),
width = +svg.attr("width"),
height = +svg.attr("height") ;

	
var color = d3.scaleOrdinal(prop.colorsLeft);
	
function showPie(data){
	radius = 140 ;
	var pie = d3.pie().sort(null).value(function(d) {
		return d['Утверждено плановых назаначений'];
	});
	var path = d3.arc()
					.outerRadius(radius - 10)
					.innerRadius(40);
	var label = d3.arc()
					.outerRadius( radius /2)
					.innerRadius(radius/2 + 60  );
	
	var arc = svg.append("g")
					.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
						.selectAll(".arc")
						.data(pie(data)).enter().append("g")
							.attr("class", "arc");

	arc.append("path")
			.attr("d", path)
			.attr("fill", function(d) { return color(d.data['State']); });

	arc.append("text")
		  .attr("transform", function(d) {   return "translate(" + path.centroid(d) + ")"; })
		  .attr("dy", "0.35em")
		  .attr("text-anchor"  , "middle" )
		  .attr("font-family" , "sans-serif")
		  .attr("font-size" , "14")
		  .attr("fill" , "white")
		  .attr("font-wight" , "bold")
		  .text(function(d) {  return ( (d.endAngle - d.startAngle)/6.28 * 100).toFixed(1)   + '%'; });
}

function legend(data) {
	g = svg.append("g")
	 .attr("transform", "translate("+ (width-300) +","+ (height/4) +" )" )
	 .attr("class","legend");
	
	g.selectAll("rect").data(data).enter()
		.append("rect")
		  .attr("y",function(d,i){ return i*50})
		  .attr("fill", function(d) {  return color(d.State) ;  })
		  .attr("width",20).attr("height",20)
		;
	
	var legend = g.selectAll(".legend");
	
	legend.data(data).enter()
	.append("text")
	  .attr("y",function(d,i){ return i*50+15})
	  .attr("x",25)
	  .attr("class","legendcaption")
	  .attr("fill", function(d) { return prop.legendValue ;  })
	  .text(function(d) {return d.State ; });
	
	legend.data(data).enter()
		.append("text")
		  .attr("y",function(d,i){   return i*50+35})
		  .attr("x",25)
		  .attr("class","legendvalue")
		  .attr("fill", function(d) { return prop.legendText ;  })
		  .text(function(d) { return currencySwap(d['Утверждено плановых назаначений'] ); })
	;
}

function legendLeft(data) {
	
	 g.attr("class","legend");
	
	g.selectAll("rect").data(data).enter()
		.append("rect")
		  .attr("transform","translate(-100,100)")
		  .attr("y",function(d,i){ return i*25})
		  .attr("fill", function(d) {  return color(d.name) ;  })
		  .attr("width",20).attr("height",20)
		;
	
	var legend = g.selectAll(".legend");
	legend.data(data).enter()
	.append("text")
	  .attr("transform","translate(-100,100)")
	  .attr("y",function(d,i){ return i*25+15})
	  .attr("x",25)
	  .attr("class","legendcaption")
	  .attr("fill", function(d) { return prop.legendValue ;  })
	  .text(function(d) {return d.name ; });
	

}

function showPieLeft(data){
	radius = 100 ;
	var pie = d3.pie().sort(null).value(function(d) {
		return d['value'];
	});
	var path = d3.arc()
					.outerRadius(radius)
					.innerRadius(40);
	var label = d3.arc()
					.outerRadius( radius )
					.innerRadius(radius / 3.5);
	
	var arc = g
					.attr("transform", "translate(" + width / 5 + "," + height / 2 + ")")
						.selectAll(".arc")
						.data(pie(data)).enter().append("g")
							.attr("class", "arc");

	arc.append("path")
			.attr("d", path)
			.attr("fill", function(d) { return color(d.data['name']); });

	arc.append("text")
		  .attr("transform", function(d) { console.log(label.centroid(d));  return "translate(" + label.centroid(d) + ")"; })
		  .attr("text-anchor"  , "middle" )
		  .attr("dy", "0.35em")
		  .attr("font-family" , "sans-serif")
		  .attr("font-size" , "14")
		  .attr("fill" , "white")
		  .attr("font-wight" , "bold")
		  .text(function(d) {  return ( (d.endAngle - d.startAngle)/6.28 * 100).toFixed(1)   + '%'; });
}

function currencySwap(d){
    return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")  + " тыс. руб." ;
}

legend(data);
showPie(data);
g = svg.append("g") ; 
showPieLeft(dataLeft );
legendLeft(dataLeft  );

