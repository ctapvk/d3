svg = d3.select("svg");
width = +svg.attr("width");
height = +svg.attr("height");
dat = [1,2,3];

pie = d3.pie().value( function (d) { return d ; });
path = d3.arc()
			.innerRadius(20)
			.outerRadius(100);
arc = svg.selectAll(".arc")
					.data(pie(dat))
					.enter().append("g")
					.attr("transform", "translate("+ [width/2  ,  height/2]+")")
								.attr("class","acr");

color = d3.scaleLinear("red" , "blue")	;		

arc.append("path")
		.attr("d", path)
		.attr("fill", function (d) { return color(d);} )
										
