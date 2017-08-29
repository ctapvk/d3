var svg = d3.select("svg"),
width = +svg.attr("width"),
height = +svg.attr("height") ;


d3.json("d1.js",  function( data) {
	
	var color = d3.scaleOrdinal(prop.colorsLeft);
	radius = 100 ;
	var pie = d3.pie().sort(null).value(function(d) {
		return d['Утверждено плановых назаначений'];
	});

	var path = d3.arc().outerRadius(radius - 10).innerRadius(40);
	var label = d3.arc().outerRadius(radius - 40).innerRadius(radius - 40);
	
	var arc = svg.append("g").attr("transform", "translate(" + width / 5 + "," + height / 2 + ")")
	.selectAll(".arc")
	.data(pie(data)).enter().append("g")
	.attr("class", "arc");

	arc.append("path").attr("d", path).attr("fill", function(d) {
		return color(d.data['State']);
	});

	arc.append("text")
	  .attr("transform", function(d) {   return "translate(" + label.centroid(d) + ")"; })
	  .attr("dy", "0.35em")
	  .text(function(d) { console.log(1212); return ( (d.endAngle - d.startAngle)/6.28 * 100).toFixed(1)   + ' %'; });
 
	
});




