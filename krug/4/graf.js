var svg = d3.select("svg"),
width = +svg.attr("width"),
height = +svg.attr("height") ;

	
var color = d3.scaleOrdinal(prop.colorsLeft);
	


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



g = svg.append("g") ; 
showPieLeft(data );

