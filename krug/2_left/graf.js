var svg = d3.select("svg"),
width = +svg.attr("width"),
height = +svg.attr("height") ;

	
var color = d3.scaleOrdinal(prop.colorsLeft);
	
function showPie(data){	
	radius = 100 ;
	var pie = d3.pie().sort(null).value(function(d) {
		return d['Утверждено плановых назаначений'];
	});
	var path = d3.arc().outerRadius(radius - 10).innerRadius(40);
	var label = d3.arc().outerRadius(radius - 40).innerRadius(radius - 40);
	
	var arc = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
	.selectAll(".arc")
	.data(pie(data)).enter().append("g")
	.attr("class", "arc");

	arc.append("path").attr("d", path)
	.attr("fill", function(d) { return color(d.data['State']); });

	arc.append("text")
	  .attr("transform", function(d) {   return "translate(" + label.centroid(d) + ")"; })
	  .attr("dy", "0.35em")
	  .text(function(d) { console.log(1212); return ( (d.endAngle - d.startAngle)/6.28 * 100).toFixed(1)   + ' %'; });
}

function legend(data) {
	g = svg.append("g").attr("transform", "translate("+ (width-300) +","+ (height/4) +" )" ) ;
	g.selectAll("rect").data(data).enter()
		.append("rect").attr("y",function(d,i){ return i*30})
		.attr("fill", function(d) {  return color(d.State) ;  })
		.attr("width",20).attr("height",20)
		;
	g.selectAll("text").data(data).enter()
		.append("text").attr("y",function(d,i){ return i*30+15}).attr("x",25)
		.attr("fill", function(d) { ; return color(d.State) ;  })
		.text(function(d) {return d.State ; })
		;
	}

legend(data);
showPie(data);


