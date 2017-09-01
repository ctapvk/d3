var svg = d3.select("svg"),
width = +svg.attr("width"),
height = +svg.attr("height") ;



function leftDonut(data) {
	var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
	radius = 100 ;
	var pie = d3.pie().sort(null).value(function(d) {
		return d['Утверждено плановых назаначений'];
	});

	var path = d3.arc().outerRadius(radius - 10).innerRadius(60);
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

}

function rigthDonut(data) {
	var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
	radius = 200 ;
	var pie = d3.pie()
	    .sort(null)
	    .value(function(d) { return d['Утверждено плановых назаначений']; });

	var path = d3.arc()
	    .outerRadius(radius - 10)
	    .innerRadius(60);

	var label = d3.arc()
	.outerRadius(radius - 40)
	.innerRadius(radius - 40);
	
	var arc = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")").selectAll(".arc")
	.data(pie(data))
	.enter().append("g")
	  .attr("class", "arc");

	arc.append("path")
	  .attr("d", path)
	  .attr("fill", function(d) { return color(d.data['State']); });

	arc.append("text")
	  .attr("transform", function(d) {   return "translate(" + label.centroid(d) + ")"; })
	  .attr("dy", "0.35em")
	  .text(function(d) { console.log(d); return ( (d.endAngle - d.startAngle)/6.28 * 100).toFixed(1)   + ' %'; });

}


d3.json("/dataJson/d1.json",  function( data) {
	
	rigthDonut(data);
	leftDonut(data) ; 
	
});




