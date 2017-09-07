svg = d3.select("svg");
width = +svg.attr("width");
height = +svg.attr("height");

var data = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

var outerRadius = height / 2 - 20,   innerRadius = outerRadius / 3 ;

var pie = d3.pie().padAngle(.02);

var arc = d3.arc()
    .padRadius(outerRadius)
    .innerRadius(innerRadius);
g = svg.append("g").attr("transform", "translate("+ [width/2 , height/2]+")") ;

g.selectAll("path")
    .data(pie(data))
		.enter().append("path")
			.each(function(d) { d.outerRadius = outerRadius - 20; })
			.attr("d", arc)
			.on("mouseover", function(d) {
					d3.select("#tooltip")
						.style("left", width/2+arc.centroid(d)[0] + "px")
						.style("top", height/2+arc.centroid(d)[1] + "px")						
						.select("#value")
						.text(d.data);
					//Show the tooltip
					d3.select("#tooltip").classed("hidden", false);
			   })
			.on("mouseout",function() { d3.select("#tooltip").classed("hidden", true);  });
